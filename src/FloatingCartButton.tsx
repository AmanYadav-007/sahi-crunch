import { ShoppingBag } from 'lucide-react';
import { useApp, cartCount, cartSubtotal } from './store';
import { formatINR } from './lib/utils';

export default function FloatingCartButton() {
  const cart = useApp((s) => s.cart);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const stack = useApp((s) => s.stack);

  const count = cartCount(cart);
  const subtotal = cartSubtotal(cart);

  // If stack has checkout or we are on screens that shouldn't conflict, check stack:
  const isCheckout = stack.some((s) => s.type === 'checkout');
  if (isCheckout) return null;

  return (
    <aside aria-label="Cart shortcut" className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        id="floating-cart-btn"
        onClick={() => setCartOpen(true)}
        className="group relative flex items-center gap-3 bg-[#4E8B56] hover:bg-[#3f7346] text-white px-5 py-3.5 rounded-full shadow-2xl shadow-[#4E8B56]/40 hover:shadow-[#4E8B56]/60 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
        aria-label={`Open Bag, ${count} items`}
      >
        <div className="relative flex items-center justify-center">
          <ShoppingBag size={22} className="group-hover:rotate-6 transition-transform" />
          {count > 0 && (
            <span className="absolute -top-2.5 -right-2.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D48924] px-1 text-[11px] font-black text-white ring-2 ring-white shadow-sm animate-pulse-subtle">
              {count}
            </span>
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-wide uppercase leading-tight">
            Bag
          </span>
          {count > 0 ? (
            <span className="text-[11px] font-bold text-emerald-100 leading-tight">
              {formatINR(subtotal)}
            </span>
          ) : (
            <span className="text-[10px] font-medium text-emerald-100/90 leading-tight">
              Empty
            </span>
          )}
        </div>
      </button>
    </aside>
  );
}
