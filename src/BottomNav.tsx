import { Home, UtensilsCrossed, ReceiptText, CalendarDays, User } from 'lucide-react';
import { useApp, cartCount, type Tab } from './store';

const TABS: Array<{ id: Tab; label: string; Icon: typeof Home }> = [
  { id: 'home', label: 'HOME', Icon: Home },
  { id: 'menu', label: 'MENU', Icon: UtensilsCrossed },
  { id: 'orders', label: 'ORDERS', Icon: ReceiptText },
  { id: 'reservations', label: 'TABLES', Icon: CalendarDays },
  { id: 'profile', label: 'PROFILE', Icon: User },
];

export default function BottomNav() {
  const tab = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);
  const cart = useApp((s) => s.cart);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const stack = useApp((s) => s.stack);
  const count = cartCount(cart);

  if (stack.length > 0) return null;

  return (
    <nav
      aria-label="Primary"
      className="actionbar fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="flex items-stretch justify-between px-2">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => setTab(id)}
                aria-current={active ? 'page' : undefined}
                data-cursor="GO"
                className="relative flex w-full flex-col items-center gap-1 py-2.5 transition-colors duration-300"
              >
                <span
                  className={`relative grid h-7 w-7 place-items-center transition-transform duration-500 ease-luxe ${
                    active ? 'scale-110 text-amber' : 'text-ivory-faint'
                  }`}
                >
                  <Icon size={19} strokeWidth={active ? 2 : 1.5} />
                </span>
                <span className={`label transition-colors ${active ? 'text-amber' : 'text-ivory-faint'}`}>
                  {label}
                </span>
                <span
                  className={`absolute -top-px h-px bg-amber transition-all duration-500 ease-luxe ${
                    active ? 'w-8 opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* floating cart */}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        aria-label={`Open cart, ${count} items`}
        data-cursor="CART"
        className={`fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full border transition-all duration-500 ease-luxe ${
          count > 0
            ? 'border-amber bg-amber text-ink-950 shadow-[0_10px_40px_rgba(230,167,86,0.35)] scale-100'
            : 'pointer-events-none scale-0 border hair-2 bg-ink-800 text-ivory'
        }`}
        style={{ right: 'max(1rem, calc(50% - 224px))' }}
      >
        <span className="num text-lg font-semibold">{count}</span>
      </button>
    </nav>
  );
}
