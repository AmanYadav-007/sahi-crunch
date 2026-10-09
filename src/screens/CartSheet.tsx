import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useApp, lineTotal, cartSubtotal, cartCount } from '../store';
import { dishById } from '../data/menu';
import { Sheet, DishImg, Empty } from '../ui';
import { formatINR } from '../lib/utils';

export default function CartSheet() {
  const open = useApp((s) => s.cartOpen);
  const setOpen = useApp((s) => s.setCartOpen);
  const cart = useApp((s) => s.cart);
  const setQty = useApp((s) => s.setQty);
  const clearCart = useApp((s) => s.clearCart);
  const push = useApp((s) => s.push);
  const pop = useApp((s) => s.pop);

  const subtotal = cartSubtotal(cart);
  const count = cartCount(cart);

  const checkout = () => {
    setOpen(false);
    pop(); // drop any stacked screen so checkout replaces cleanly
    push({ type: 'checkout' });
  };

  return (
    <Sheet open={open} onClose={() => setOpen(false)} title="YOUR TABLE">
      {cart.length === 0 ? (
        <Empty
          title="THE TABLE IS EMPTY"
          sub="Nothing chosen yet. The menu is one tap away — start with a signature."
          cta="OPEN THE MENU"
          onCta={() => {
            setOpen(false);
            useApp.getState().setTab('menu');
          }}
          art="plate"
        />
      ) : (
        <div className="px-5 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow">
              {count} ITEM{count > 1 ? 'S' : ''}
            </span>
            <button type="button" onClick={clearCart} className="eyebrow transition-colors hover:text-chili">
              CLEAR TABLE
            </button>
          </div>

          <ul className="space-y-4">
            {cart.map((l) => {
              const d = dishById(l.dishId);
              if (!d) return null;
              return (
                <li key={l.key} className="flex gap-3.5">
                  <DishImg name={d.image} className="h-16 w-16 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="h3 truncate">{d.name}</h3>
                      <button type="button" aria-label="Remove" onClick={() => setQty(l.key, 0)} className="text-ivory-faint">
                        <X size={14} />
                      </button>
                    </div>
                    {l.options.length > 0 && (
                      <p className="mt-0.5 line-clamp-2 caption">
                        {l.options.map((o) => o.choice).join(' · ')}
                      </p>
                    )}
                    {l.note && <p className="mt-0.5 line-clamp-1 caption italic text-amber">“{l.note}”</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 hair-2 border px-2 py-1">
                        <button type="button" aria-label="Less" onClick={() => setQty(l.key, l.qty - 1)} className="text-ivory-dim">
                          <Minus size={13} />
                        </button>
                        <span className="num w-4 text-center text-sm text-ivory">{l.qty}</span>
                        <button type="button" aria-label="More" onClick={() => setQty(l.key, l.qty + 1)} className="text-ivory-dim">
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="num gold">{formatINR(lineTotal(l))}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="hair-t mt-6 pt-4">
            <div className="flex items-center justify-between">
              <span className="eyebrow">SUBTOTAL</span>
              <span className="num text-xl text-ivory">{formatINR(subtotal)}</span>
            </div>
            <p className="caption mt-1 text-right">Taxes & fees calculated at checkout</p>
          </div>

          <button type="button" onClick={checkout} data-cursor="CHECKOUT" className="btn-solid mt-4 flex w-full items-center justify-between !py-4">
            <span className="flex items-center gap-2">
              <ShoppingBag size={15} /> CONTINUE TO CHECKOUT
            </span>
            <span className="num">{formatINR(subtotal)}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
            className="mt-3 w-full py-2 eyebrow"
          >
            KEEP BROWSING
          </button>
        </div>
      )}
    </Sheet>
  );
}
