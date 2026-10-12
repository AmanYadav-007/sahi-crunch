import { ShoppingBag } from 'lucide-react';
import { useApp, cartCount, cartSubtotal } from './store';
import { formatINR } from './lib/utils';

export default function FloatingCartButton() {
  const cart = useApp((s) => s.cart);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const stack = useApp((s) => s.stack);

  const count = cartCount(cart);
  const subtotal = cartSubtotal(cart);

  const isCheckout = stack.some((s) => s.type === 'checkout');
  if (isCheckout) return null;

  return (
    <aside aria-label="Cart shortcut" className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        id="floating-cart-btn"
        onClick={() => setCartOpen(true)}
        className="group relative flex items-center gap-3 btn-ink px-5 py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#D86B9B]/40"
        aria-label={`Open Bag, ${count} items`}
      >
        <div className="relative flex items-center justify-center">
          <ShoppingBag
            size={22}
            className="group-hover:rotate-6 transition-transform text-[#FDFBF7]"
          />
          {count > 0 && (
            <span className="absolute -top-2.5 -right-2.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D86B9B] px-1 font-note text-[11px] font-semibold text-white ring-2 ring-[#C45688] shadow-sm animate-pulse-subtle">
              {count}
            </span>
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="font-hand italic text-base leading-tight text-[#FDFBF7]">
            Bag
          </span>
          {count > 0 ? (
            <span className="font-note text-[11px] font-medium text-[#E88EB5] leading-tight">
              {formatINR(subtotal)}
            </span>
          ) : (
            <span className="font-note text-[10px] font-medium text-[#FDFBF7]/60 leading-tight">
              Empty
            </span>
          )}
        </div>
      </button>
    </aside>
  );
}
