import React from 'react';
import {
  Minus,
  Plus,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Zap,
  Trash2,
  Clock,
  Sparkles,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { useApp, lineTotal, cartSubtotal, cartCount } from '../store';
import { dishById } from '../data/menu';
import { Sheet, DishImg, Empty, VegBadge } from '../ui';
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

  const freeDeliveryThreshold = 299;
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 35;
  const platformFee = 5;
  const grandTotal = subtotal + deliveryFee + platformFee;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const [showCelebration, setShowCelebration] = React.useState(false);
  const prevFreeDeliveryRef = React.useRef(isFreeDelivery);

  // Trigger full-screen celebration burst when threshold is crossed
  React.useEffect(() => {
    if (!prevFreeDeliveryRef.current && isFreeDelivery) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2800);
      return () => clearTimeout(timer);
    }
    prevFreeDeliveryRef.current = isFreeDelivery;
  }, [isFreeDelivery]);

  const checkout = () => {
    setOpen(false);
    pop();
    push({ type: 'checkout' });
  };

  const orderWhatsApp = () => {
    const linesText = cart
      .map((l) => {
        const d = dishById(l.dishId);
        return `• ${l.qty}x ${d?.name || 'Item'} (${formatINR(lineTotal(l))})`;
      })
      .join('%0A');
    const msg = `Hi Sahi Crunch! I would like to place an order:%0A%0A${linesText}%0A%0ASubtotal: ${formatINR(subtotal)}%0APlease confirm delivery in Bhopal!`;
    window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`, '_blank');
  };

  const footerContent = cart.length > 0 ? (
    <div className="space-y-2">
      <button
        type="button"
        onClick={checkout}
        className="w-full flex items-center justify-between bg-gradient-to-r from-[#681121] via-[#7a1427] to-[#540c19] hover:from-[#540c19] hover:to-[#450A14] text-white font-black text-sm py-3.5 px-5 rounded-2xl shadow-lg shadow-[#681121]/30 active:scale-[0.99] transition-all"
      >
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
            {count} {count === 1 ? 'Item' : 'Items'}
          </span>
          <span className="text-base font-black tracking-tight">{formatINR(grandTotal)}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/15 px-3.5 py-1.5 rounded-xl border border-white/20">
          <span className="text-xs font-black uppercase tracking-wider">Proceed to Pay</span>
          <ChevronRight size={16} />
        </div>
      </button>

      <button
        type="button"
        onClick={orderWhatsApp}
        className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-300 text-emerald-800 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.99]"
      >
        <MessageCircle size={15} className="text-emerald-600 fill-emerald-600" />
        <span>Or Instant Order via WhatsApp (1-Click)</span>
      </button>
    </div>
  ) : undefined;

  return (
    <Sheet
      open={open}
      onClose={() => setOpen(false)}
      title="My Cart"
      footer={footerContent}
    >
      {/* Full-Screen Immersive Celebration Overlay */}
      {showCelebration && (
        <div
          onClick={() => setShowCelebration(false)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/75 backdrop-blur-md p-6 select-none cursor-pointer animate-fadeIn"
        >
          {/* Confetti Rain Layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(28)].map((_, i) => {
              const colors = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];
              const color = colors[i % colors.length];
              const left = `${(i * 3.6) + (i % 5)}%`;
              const delay = `${(i * 0.08) % 1.2}s`;
              const size = i % 2 === 0 ? 'w-2.5 h-4' : 'w-3 h-3 rounded-full';
              return (
                <div
                  key={i}
                  className={`absolute ${size} animate-confetti-piece`}
                  style={{
                    backgroundColor: color,
                    left,
                    top: '-10px',
                    animationDelay: delay,
                  }}
                />
              );
            })}
          </div>

          {/* Central High-Impact Celebration Card */}
          <div className="animate-celebrate relative max-w-sm w-full bg-gradient-to-b from-[#1C1417] via-[#2D121B] to-[#12080D] border-2 border-[#E2952A] rounded-3xl p-7 text-center shadow-[0_0_50px_rgba(226,149,42,0.4)] text-white">
            <div className="relative inline-flex mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E2952A] to-[#4E8B56] flex items-center justify-center text-4xl shadow-xl shadow-[#4E8B56]/30">
                🎉
              </div>
              <span className="absolute -top-1 -right-1 text-2xl animate-bounce">⚡</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#4E8B56]/20 border border-[#4E8B56]/50 text-[#5fa768] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              <Sparkles size={13} className="fill-[#5fa768]" />
              <span>Special Perk Unlocked</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              FREE DELIVERY!
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-200/90 leading-relaxed font-medium">
              Congratulations! Your order exceeds ₹299. You just saved <strong className="text-[#E2952A] font-black">₹35</strong> on delivery charges.
            </p>

            <button
              type="button"
              onClick={() => setShowCelebration(false)}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#D48924] to-[#4E8B56] text-white font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
            >
              Continue to Order
            </button>
          </div>
        </div>
      )}

      {cart.length === 0 ? (
        <Empty
          title="Your Cart is Empty"
          sub="Crispy roasted makhanas and artisanal tea-time bites are just a few taps away."
          cta="Explore Snacks"
          onCta={() => {
            setOpen(false);
            useApp.getState().setTab('menu');
          }}
        />
      ) : (
        <div className="px-4 sm:px-5 pt-3 pb-6 space-y-4">
          {/* Free Delivery Goal Banner: Only shown when free delivery is NOT yet reached */}
          {!isFreeDelivery && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#D48924]/10 via-[#FDFBF7] to-[#4E8B56]/15 border border-[#e8dfcf] p-3.5 shadow-sm transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm bg-gradient-to-br from-[#D48924] to-[#B36F15]">
                    <ShoppingBag size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 tracking-tight">
                      Add <span className="text-[#681121]">{formatINR(amountToFreeDelivery)}</span> more for <span className="text-[#4E8B56]">FREE Delivery</span>
                    </p>
                    <p className="text-[11px] font-medium text-slate-500">
                      Free delivery on orders above {formatINR(freeDeliveryThreshold)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Current: {formatINR(subtotal)}</span>
                  <span>Goal: {formatINR(freeDeliveryThreshold)}</span>
                </div>
                <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D48924] to-[#4E8B56] rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cart Items Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Items Selected
              </span>
              {isFreeDelivery ? (
                <button
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/80 px-2 py-0.5 rounded-lg transition-colors"
                >
                  <Trash2 size={11} />
                  <span>Clear Cart</span>
                </button>
              ) : (
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Clock size={11} /> 100% Freshly Packed
                </span>
              )}
            </div>

            {cart.map((l) => {
              const d = dishById(l.dishId);
              if (!d) return null;

              return (
                <div
                  key={l.key}
                  className="group relative flex items-center justify-between gap-3 bg-white border border-[#e8dfcf] hover:border-[#D48924]/40 p-3 sm:p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#f3ece0] shrink-0 border border-[#e8dfcf] shadow-inner">
                      <DishImg name={d.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <VegBadge />
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {d.name}
                        </h4>
                      </div>

                      {l.options.length > 0 && (
                        <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
                          {l.options.map((o) => o.choice).join(' · ')}
                        </p>
                      )}

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-black text-[#681121]">
                          {formatINR(lineTotal(l))}
                        </span>
                        {l.qty > 1 && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            ({formatINR(d.price)} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modern Stepper Button */}
                  <div className="flex items-center bg-[#4E8B56]/10 border border-[#4E8B56]/30 rounded-xl px-1 py-0.5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQty(l.key, l.qty - 1)}
                      aria-label="Decrease quantity"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4E8B56] hover:bg-[#4E8B56]/20 active:scale-90 transition-all font-bold"
                    >
                      <Minus size={13} strokeWidth={2.8} />
                    </button>
                    <span className="w-6 text-center font-black text-xs text-slate-900">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(l.key, l.qty + 1)}
                      aria-label="Increase quantity"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4E8B56] hover:bg-[#4E8B56]/20 active:scale-90 transition-all font-bold"
                    >
                      <Plus size={13} strokeWidth={2.8} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bill Summary Card */}
          <div className="bg-white border border-[#e8dfcf] rounded-2xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-[#681121]">
                Bill Breakdown
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Taxes Included
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600">Item Total</span>
                <span className="font-bold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600 flex items-center gap-1">
                  Delivery Partner Fee
                </span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#4E8B56] bg-emerald-50 px-2 py-0.5 rounded-md">
                      FREE
                    </span>
                  ) : (
                    <span className="font-bold text-slate-900">{formatINR(deliveryFee)}</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600">Platform Handling Fee</span>
                <span className="font-bold text-slate-900">{formatINR(platformFee)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-[#e8dfcf] flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 block leading-tight">
                  To Pay
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Incl. all standard taxes
                </span>
              </div>
              <span className="text-lg font-black text-[#681121] tracking-tight">
                {formatINR(grandTotal)}
              </span>
            </div>
          </div>

          {/* Guaranteed Savings Badge */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#4E8B56]/15 to-[#4E8B56]/5 border border-[#4E8B56]/30 text-[#245b2b] p-3 rounded-2xl text-xs font-bold shadow-sm">
            <div className="h-6 w-6 rounded-full bg-[#4E8B56] text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={14} />
            </div>
            <div className="flex-1">
              <span>You saved <strong className="font-black text-[#1e5025]">₹45</strong> on this direct kitchen order!</span>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
