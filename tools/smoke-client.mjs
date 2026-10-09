import { JSDOM } from 'jsdom';

/* ---------- jsdom globals (before anything touches the DOM) ---------- */
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/',
  pretendToBeVisual: true,
});
const { window } = dom;

const expose = (key, value) => Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
expose('window', window);
expose('document', window.document);
expose('navigator', window.navigator);
expose('localStorage', window.localStorage);
expose('location', window.location);
expose('history', window.history);
for (const k of ['HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'SVGElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'MutationObserver']) {
  expose(k, window[k]);
}
if (!window.matchMedia) {
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/* ---------- app modules via vite ---------- */
const { createServer } = await import('vite');
const vite = await createServer({ root: 'D:/The Gharelu Hub', server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => vite.ssrLoadModule(p);

const { renderToString } = await import('react-dom/server');
const { createElement, act, useState, useEffect } = await import('react');
const { createRoot } = await import('react-dom/client');

const { useApp } = await load('/src/store.ts');
const { dishes, dishById } = await load('/src/data/menu.ts');
const { locations } = await load('/src/data/locations.ts');
const App = (await load('/src/App.tsx')).default;

const dishName = (id) => dishById(id)?.name ?? '';

/* ---------- helpers ---------- */
const container = window.document.getElementById('root');
const root = createRoot(container);
const text = () => container.textContent.replace(/\s+/g, ' ').trim();

let pass = 0;
let fail = 0;
const check = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`ok     ${name}`); }
  else { fail++; console.log(`FAIL   ${name}  ${extra}`); }
};
const has = (needle) => text().includes(needle);

const seeded = {
  profile: { name: 'Aarav', phone: '+91 99999 99999', email: 'a@b.co', guest: false, addresses: ['42, 5th Cross, Indiranagar'], vegMode: false },
  cart: [{ key: 'seed|', dishId: dishes[0].id, qty: 2, options: [] }],
  orders: [{
    id: 'o1', code: 'GH-TEST01', type: 'delivery', locationId: 'indiranagar',
    lines: [{ key: 'seed|', dishId: dishes[0].id, qty: 2, options: [] }],
    subtotal: 800, tax: 40, discount: 0, fee: 49, total: 889,
    placedAt: Date.now(), status: 3, address: '42, 5th Cross', eta: '35–40 MIN', pointsEarned: 89,
  }],
  reservations: [{ id: 'r1', code: 'TB-TEST1', locationId: 'indiranagar', date: '2099-12-31', time: '20:00', guests: 4, notes: 'window seat' }],
  favorites: [dishes[1].id],
  points: 1420,
  onboarded: true,
  locationId: 'indiranagar',
};

const setState = async (patch) => {
  await act(async () => { useApp.setState(patch); });
};
const click = async (el, label) => {
  if (!el) { fail++; console.log(`FAIL   click target missing: ${label}`); return false; }
  await act(async () => {
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  return true;
};
const byText = (selector, needle) =>
  [...container.querySelectorAll(selector)].find((e) => e.textContent.includes(needle));
const setInput = async (el, value, label) => {
  if (!el) { fail++; console.log(`FAIL   input missing: ${label}`); return; }
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  await act(async () => {
    setter.call(el, value);
    el.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
};

/* ---------- boot ---------- */
await act(async () => {
  useApp.setState({ ...seeded, phase: 'splash', tab: 'home', stack: [], cartOpen: false, online: true });
  root.render(createElement(App));
});

check('splash renders', has('Your table awaits'));

/* ---------- phases ---------- */
await setState({ phase: 'onboarding' });
check('onboarding retired (falls through to app)', has('THE MOMENT'), text().slice(0, 120));

await setState({ phase: 'location' });
check('location picker (first time)', has('DINING') || has('CURRENT LOCATION'), text().slice(0, 120));

await setState({ phase: 'app', tab: 'home' });
check('home hero', has('MADE FOR') && has('THE MOMENT'), text().slice(0, 160));
check('home quick actions', has('RESERVE TABLE') && has('VIEW MENU'));
check('home loyalty block', has('THE TABLE CLUB'));
check('home uses seeded points', has('1420'));

await setState({ tab: 'menu' });
check('menu screen', has('THE MENU') && has('ALL'));
check('menu lists dishes', container.querySelectorAll('ul li').length > 3);

await setState({ tab: 'orders' });
check('orders screen with live order', has('IN THE KITCHEN') && has('GH-TEST01'), text().slice(0, 160));
check('orders shows stage', has('PREPARING') || has('PACKED') || has('OUT FOR DELIVERY'));

await setState({ tab: 'reservations' });
check('reservations upcoming', has('UPCOMING') && has('TB-TEST1'), text().slice(0, 160));

await setState({ tab: 'profile' });
check('profile screen', has('Aarav') && has('SAVED DISHES'), text().slice(0, 160));
check('profile rows', has('Rewards wallet') && has('Switch location'));

/* ---------- stack screens ---------- */
await setState({ stack: [{ type: 'dish', id: dishes[0].id }] });
check('dish detail', has(dishName(dishes[0].id)) && has('NOTE FOR THE KITCHEN'), text().slice(0, 160));
const addBtn = byText('button', 'ADD TO TABLE');
check('dish detail add bar', !!addBtn);
check('tab content hidden under stack screen', !has('MADE FOR') && !has('21 CHAPTERS'), text().slice(0, 120));

await setState({ stack: [{ type: 'checkout' }] });
check('checkout screen', has('THE BILL') && has('HOW ARE YOU HUNGRY'), text().slice(0, 160));
check('checkout order types', has('DELIVERY') && has('TAKEAWAY') && has('DINE-IN'));
check('checkout seeded subtotal', has('Subtotal'));

await setState({ stack: [{ type: 'track', orderId: 'o1' }] });
check('track order', has('GH-TEST01') && has('THE TICKET'), text().slice(0, 160));
check('track timeline', has('ORDER PLACED') && has('DELIVERED'));

await setState({ stack: [{ type: 'reserve' }] });
check('reserve flow', has('HOLD A TABLE') && has('PICK A DAY'), text().slice(0, 160));
const slot = [...container.querySelectorAll('button')].find((b) => /^\d{2}:\d{2}$/.test(b.textContent.trim()) && !b.disabled);
check('reserve has bookable slots', !!slot);
if (slot) {
  await click(slot, 'slot');
  const hold = byText('button', 'HOLD TABLE FOR');
  check('hold button activates after slot pick', !!hold);
  await click(hold, 'hold table');
  check('reservation confirmed', has('A CHAIR IS YOURS') && has('POINTS ADDED'), text().slice(0, 160));
}

await setState({ stack: [{ type: 'loyalty' }] });
check('loyalty screen', has('SPEND THE POINTS') && has('THE LADDER'), text().slice(0, 160));
check('loyalty rewards', has('Welcome Drink') && has('Chef'));

await setState({ stack: [{ type: 'offers' }] });
check('offers screen', has('GHARELU10') && has('LUNCH25'), text().slice(0, 160));

await setState({ stack: [{ type: 'search' }] });
check('search screen', has('TRENDING TONIGHT') && has('TAP A FEELING'), text().slice(0, 160));
const searchInput = container.querySelector('input[placeholder="Search the house…"]');
await setInput(searchInput, 'biryani', 'search');
check('search finds biryani', /Biryani/i.test(text()), text().slice(0, 200));

await setState({ stack: [{ type: 'location' }] });
check('change location', has('CHANGE LOCATION') || has('OR SELECT A ROOM'), text().slice(0, 160));

/* ---------- empty states ---------- */
await setState({ stack: [], tab: 'orders', orders: [] });
check('orders empty state', has('THE KITCHEN HIT A PAUSE'), text().slice(0, 160));

await setState({ cart: [], cartOpen: true });
check('cart empty state', has('THE TABLE IS EMPTY'), text().slice(0, 160));
await setState({ cartOpen: false, cart: seeded.cart });

/* ---------- interactions: add to cart ---------- */
await setState({ tab: 'menu', stack: [], cart: [], cartOpen: false });
const addRow = container.querySelector('button[aria-label^="Add "]');
check('menu add button exists', !!addRow?.getAttribute('aria-label'));
await click(addRow, 'add from menu');
check('cart got a line', useApp.getState().cart.length === 1, `len=${useApp.getState().cart.length}`);
check('floating cart shows count', !!container.querySelector('button[aria-label*="Open cart"]'));

/* ---------- full order flow ---------- */
const cartBtn = container.querySelector('button[aria-label^="Open cart"]');
await click(cartBtn, 'open cart');
check('cart sheet opens', has('YOUR TABLE') && has('SUBTOTAL'), text().slice(0, 160));
const toCheckout = byText('button', 'CONTINUE TO CHECKOUT');
await click(toCheckout, 'go checkout');
check('checkout opened from cart', has('THE BILL'), text().slice(0, 160));

const dinein = [...container.querySelectorAll('button')].find((b) => b.textContent.includes('DINE-IN') && b.textContent.length < 60);
await click(dinein, 'dine-in type');
const tableInput = container.querySelector('input[placeholder^="Table number"]');
await setInput(tableInput, '7', 'table');
const place = [...container.querySelectorAll('button')].find((b) => b.textContent.includes('PLACE ORDER'));
check('place order enabled', !!place && !place.disabled, place?.textContent ?? 'missing');
const beforeOrders = useApp.getState().orders.length;
await click(place, 'place order');
await act(async () => { await new Promise((r) => setTimeout(r, 1100)); });
check('order placed', useApp.getState().orders.length === beforeOrders + 1, `orders=${useApp.getState().orders.length}`);
check('cart cleared after order', useApp.getState().cart.length === 0);
check('lands on tracking', has('THE TICKET') && has('ORDER PLACED'), text().slice(0, 200));

/* ---------- offline banner ---------- */
await setState({ stack: [], tab: 'home', online: false });
check('offline banner', has("YOU’RE OFFLINE"), text().slice(0, 160));
await setState({ online: true });

console.log(`\n${pass} passed, ${fail} failed`);
await vite.close();
process.exit(fail === 0 ? 0 : 1);
