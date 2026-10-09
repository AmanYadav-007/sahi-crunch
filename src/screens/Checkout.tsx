import { useMemo, useState } from 'react';
import { Bike, ShoppingBag, Utensils, Ticket, CreditCard, Smartphone, Banknote, Check, MapPin } from 'lucide-react';
import { useApp, cartSubtotal, lineTotal, type OrderType } from '../store';
import { dishById } from '../data/menu';
import { locations } from '../data/locations';
import { offersFor } from '../data';
import { Screen, DishImg, Empty, Pill } from '../ui';
import { formatINR } from '../lib/utils';

const TYPES: Array<{ id: OrderType; label: string; sub: string; Icon: typeof Bike }> = [
  { id: 'delivery', label: 'DELIVERY', sub: 'To your door', Icon: Bike },
  { id: 'takeaway', label: 'TAKEAWAY', sub: 'Ready in 25 min', Icon: ShoppingBag },
  { id: 'dinein', label: 'DINE-IN', sub: 'At your table', Icon: Utensils },
];

const FEE = { delivery: 49, takeaway: 0, dinein: 0 };
const TAX_RATE = 0.05;
const PAYMENTS = [
  { id: 'upi', label: 'UPI', sub: 'GPay · PhonePe · Paytm', Icon: Smartphone },
  { id: 'card', label: 'CARD', sub: 'Visa · Mastercard · Amex', Icon: CreditCard },
  { id: 'cod', label: 'PAY AT TABLE / DOOR', sub: 'Cash or card on arrival', Icon: Banknote },
];

/** "10% OFF" / "₹250 OFF" → discount for this subtotal */
const offerAmount = (value: string, subtotal: number) => {
  if (value.includes('%')) {
    const p = Number(value.replace(/[^0-9]/g, '')) || 0;
    return Math.round((subtotal * p) / 100);
  }
  const flat = Number(value.replace(/[^0-9]/g, '')) || 0;
  return Math.min(flat, subtotal);
};

export default function Checkout() {
  const cart = useApp((s) => s.cart);
  const profile = useApp((s) => s.profile);
  const locationId = useApp((s) => s.locationId);
  const placeOrder = useApp((s) => s.placeOrder);
  const points = useApp((s) => s.points);

  const [type, setType] = useState<OrderType>(profile.addresses.length ? 'delivery' : 'dinein');
  const [address, setAddress] = useState(profile.addresses[0] ?? '');
  const [table, setTable] = useState('');
  const [slot, setSlot] = useState('ASAP · 25 MIN');
  const [offerId, setOfferId] = useState<string | null>(null);
  const [pay, setPay] = useState('upi');
  const [placing, setPlacing] = useState(false);

  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const subtotal = cartSubtotal(cart);
  const offers = useMemo(() => offersFor(locationId), [locationId]);
  const offer = offers.find((o) => o.id === offerId) ?? null;
  const discount = offer ? offerAmount(offer.value, subtotal) : 0;
  const fee = FEE[type];
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const total = Math.max(0, subtotal - discount) + fee + tax;
  const earned = Math.round(total / 10);

  const ready =
    cart.length > 0 &&
    (type === 'delivery' ? address.trim().length > 3 : type === 'dinein' ? table.trim().length > 0 : true);

  if (cart.length === 0 && !placing) {
    return (
      <Screen eyebrow="CHECKOUT" title="YOUR ORDER">
        <Empty
          title="NOTHING TO SETTLE"
          sub="Your table was cleared. Add something from the menu and come back."
          cta="OPEN THE MENU"
          onCta={() => useApp.getState().setTab('menu')}
        />
      </Screen>
    );
  }

  const place = () => {
    if (!ready) return;
    setPlacing(true);
    const addressLine =
      type === 'delivery'
        ? address
        : type === 'dinein'
          ? `Table ${table} · ${branch.area}`
          : `Pickup ${slot} · ${branch.area}`;
    window.setTimeout(() => {
      placeOrder({
        type,
        locationId: branch.id,
        lines: cart,
        subtotal,
        tax,
        discount,
        fee,
        total,
        eta: type === 'delivery' ? '35–40 MIN' : type === 'takeaway' ? '25 MIN' : '15 MIN',
        address: addressLine,
      });
      setPlacing(false);
    }, 900);
  };

  return (
    <Screen eyebrow="CHECKOUT" title="YOUR ORDER">
      <div className="space-y-7 px-5 pt-5">
        {/* order type */}
        <section>
          <h2 className="mb-3 label text-ivory">HOW ARE YOU HUNGRY?</h2>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map(({ id, label, sub, Icon }) => {
              const on = type === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setType(id)}
                  aria-pressed={on}
                  className={`tile ${on ? 'tile-on' : ''}`}
                >
                  <Icon size={19} className={on ? 'text-amber' : 'text-ivory-dim'} strokeWidth={1.6} />
                  <span className={`label ${on ? 'gold' : 'text-ivory-dim'}`}>{label}</span>
                  <span className="caption">{sub}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* destination */}
        <section>
          <h2 className="mb-3 label text-ivory">
            {type === 'delivery' ? 'DELIVER TO' : type === 'dinein' ? 'YOUR TABLE' : 'PICKUP'}
          </h2>

          {type === 'delivery' && (
            <div className="space-y-2">
              {profile.addresses.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAddress(a)}
                  className={`choice !items-start ${address === a ? 'choice-on' : ''}`}
                >
                  <span className="flex items-start gap-3">
                    <MapPin size={15} className={`mt-0.5 shrink-0 ${address === a ? 'text-amber' : 'text-ivory-faint'}`} />
                    <span>{a}</span>
                  </span>
                  {address === a && <Check size={15} className="shrink-0 text-amber" />}
                </button>
              ))}
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Or type a new address…"
                className="field w-full"
              />
              <p className="eyebrow">
                {branch.area.toUpperCase()} · ARRIVING IN 35–40 MIN
              </p>
            </div>
          )}

          {type === 'dinein' && (
            <div className="space-y-3">
              <input
                value={table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="Table number (shown on your QR)"
                className="field w-full"
              />
              <div className="card flex items-center justify-between px-4 py-3">
                <span className="body">
                  {branch.area} · {branch.hours}
                </span>
                <Pill tone="open">OPEN</Pill>
              </div>
            </div>
          )}

          {type === 'takeaway' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {['ASAP · 25 MIN', 'IN 1 HOUR', 'IN 2 HOURS', 'TONIGHT 20:00'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`chip ${slot === s ? 'chip-on' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="eyebrow">COLLECT AT {branch.address.toUpperCase()}</p>
            </div>
          )}
        </section>

        {/* items */}
        <section>
          <h2 className="mb-3 label text-ivory">THE ORDER</h2>
          <ul className="card hair-y overflow-hidden">
            {cart.map((l) => {
              const d = dishById(l.dishId);
              if (!d) return null;
              return (
                <li key={l.key} className="flex items-center gap-3 p-3">
                  <DishImg name={d.image} className="h-12 w-12 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="body-b truncate">
                      <span className="num gold">{l.qty}×</span> {d.name}
                    </p>
                    {l.options.length > 0 && (
                      <p className="caption truncate">{l.options.map((o) => o.choice).join(' · ')}</p>
                    )}
                  </div>
                  <span className="num text-[14px] text-ivory-dim">{formatINR(lineTotal(l))}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* offers */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 label text-ivory">
            <Ticket size={13} className="text-amber" /> OFFERS
          </h2>
          <div className="no-bar flex gap-2 overflow-x-auto pb-1">
            {offers.map((o) => {
              const on = offerId === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOfferId(on ? null : o.id)}
                  className={`card-dash w-40 shrink-0 px-3 py-3 text-left transition-colors ${
                    on ? 'tint-amber' : ''
                  }`}
                >
                  <span className={`num block text-lg ${on ? 'gold' : 'text-ivory'}`}>{o.value}</span>
                  <span className="label block truncate text-ivory-dim">{o.title}</span>
                  <span className="caption block truncate">{o.code}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* payment */}
        <section>
          <h2 className="mb-3 label text-ivory">PAYMENT</h2>
          <ul className="card hair-y overflow-hidden">
            {PAYMENTS.map(({ id, label, sub, Icon }) => {
              const on = pay === id;
              return (
                <li key={id}>
                  <button type="button" onClick={() => setPay(id)} className="flex w-full items-center gap-3.5 px-4 py-4 text-left">
                    <Icon size={17} className={on ? 'text-amber' : 'text-ivory-faint'} strokeWidth={1.6} />
                    <span className="flex-1">
                      <span className="body-b block">{label}</span>
                      <span className="caption block">{sub}</span>
                    </span>
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        on ? 'border-amber bg-amber text-ink-950' : 'hair-2 border'
                      }`}
                    >
                      {on && <Check size={12} strokeWidth={3} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* bill */}
        <section className="card p-5">
          <h2 className="mb-4 label text-ivory">THE BILL</h2>
          <Row label="Subtotal" value={formatINR(subtotal)} />
          {discount > 0 && offer && <Row label={`Offer · ${offer.code}`} value={`− ${formatINR(discount)}`} tone="herb" />}
          <Row label={type === 'delivery' ? 'Delivery' : 'Handling'} value={fee ? formatINR(fee) : 'FREE'} />
          <Row label="Taxes (5%)" value={formatINR(tax)} />
          <div className="hair-t mt-3 flex items-baseline justify-between pt-3">
            <span className="label text-ivory">TOTAL</span>
            <span className="num gold text-2xl">{formatINR(total)}</span>
          </div>
          <p className="eyebrow mt-2 text-right">
            YOU EARN {earned} POINTS · BALANCE {points}
          </p>
        </section>

        {!ready && (
          <p className="label border amber-line tint-amber px-4 py-3 text-amber">
            {type === 'delivery'
              ? 'ADD A DELIVERY ADDRESS TO CONTINUE'
              : type === 'dinein'
                ? 'TELL US YOUR TABLE NUMBER'
                : 'CHOOSE A PICKUP TIME'}
          </p>
        )}

        <button
          type="button"
          onClick={place}
          disabled={!ready || placing}
          data-cursor="PLACE"
          className="btn-solid w-full !py-4 disabled:opacity-40"
        >
          {placing ? 'SENDING TO THE KITCHEN…' : `PLACE ORDER · ${formatINR(total)}`}
        </button>
        <p className="caption pb-4 text-center">
          By placing this order you agree to the house rules. Cancel free within 2 minutes.
        </p>
      </div>
    </Screen>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'herb' }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="body">{label}</span>
      <span className={`num text-[14px] ${tone === 'herb' ? 'text-herb' : 'text-ivory'}`}>{value}</span>
    </div>
  );
}
