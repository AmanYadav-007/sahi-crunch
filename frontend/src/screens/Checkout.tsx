import React, { useMemo, useState } from 'react';
import {
  Bike,
  ShoppingBag,
  Ticket,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Zap,
  X,
  Percent,
  LogIn,
} from 'lucide-react';
import { useApp, cartSubtotal, lineTotal, type OrderType } from '../store';
import { dishById } from '../data/menu';
import { locations } from '../data/locations';
import { offersFor } from '../data';
import { Screen, DishImg, Empty, Pill } from '../ui';
import { formatINR } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { ordersApi } from '../lib/api';

const TYPES: Array<{ id: OrderType; label: string; sub: string; Icon: typeof Bike }> = [
  { id: 'delivery', label: 'Delivery', sub: '10–15 mins to your doorstep', Icon: Bike },
  { id: 'takeaway', label: 'Takeaway', sub: 'Ready in 10 mins at kitchen', Icon: ShoppingBag },
];

const PAYMENTS = [
  { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)', sub: 'Instant payment via UPI QR/App', Icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Cards', sub: 'Visa, Mastercard, RuPay', Icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay cash or UPI on delivery', Icon: Banknote },
];

export default function Checkout() {
  const cart = useApp((s) => s.cart);
  const profile = useApp((s) => s.profile);
  const locationId = useApp((s) => s.locationId);
  const placeOrder = useApp((s) => s.placeOrder);

  const auth = useAuth();

  const [type, setType] = useState<OrderType>('delivery');
  const [address, setAddress] = useState(profile.addresses[0] ?? 'E-3 Arera Colony, Bhopal');
  const [offerId, setOfferId] = useState<string | null>(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [pay, setPay] = useState('upi');
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const subtotal = cartSubtotal(cart);
  const offers = useMemo(() => offersFor(locationId), [locationId]);
  const offer = offers.find((o) => o.id === offerId) ?? null;

  const discount = useMemo(() => {
    if (!offer) return 0;
    if (offer.code === 'SAHIFIRST') return Math.round((subtotal * 10) / 100);
    if (offer.code === 'SAHIREF') return 50;
    if (offer.code === 'BULKCRUNCH') return subtotal >= 999 ? Math.round((subtotal * 15) / 100) : 0;
    if (offer.code === 'SAHI25') return 250;
    if (offer.code === 'INSIDER') return Math.round((subtotal * 20) / 100);
    return Math.round((subtotal * 10) / 100);
  }, [offer, subtotal]);
  const deliveryFee = type === 'delivery' ? (subtotal > 299 ? 0 : 35) : 0;
  const platformFee = 5;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount) + deliveryFee + platformFee + tax;

  const ready = cart.length > 0 && (type === 'delivery' ? address.trim().length > 3 : true);

  if (cart.length === 0 && !placing) {
    return (
      <Screen eyebrow="Checkout" title="Your Cart">
        <Empty
          title="Your Cart is Empty"
          sub="Add items to cart before proceeding to checkout."
          cta="Explore Snacks"
          onCta={() => useApp.getState().setTab('menu')}
        />
      </Screen>
    );
  }

  const place = async () => {
    if (!ready) return;

    // Require auth before placing order
    if (!auth.isLoggedIn) {
      auth.openLogin();
      return;
    }

    setPlacing(true);
    setPlaceError('');
    const addressLine = type === 'delivery' ? address : `Pickup from ${branch.area} Kitchen`;

    try {
      const { data, error } = await ordersApi.place({
        type,
        locationId: branch.id,
        lines: cart,
        subtotal,
        tax,
        discount,
        fee: deliveryFee,
        total,
        address: addressLine,
        paymentMethod: pay,
        couponCode: offer?.code,
      });

      if (error || !data?.order) {
        setPlaceError(error ?? 'Failed to place order. Please try again.');
        setPlacing(false);
        return;
      }

      // Sync order into local store so tracking works
      const backendOrder = data.order;
      placeOrder({
        id: backendOrder.id,
        code: backendOrder.code,
        type,
        locationId: branch.id,
        lines: cart,
        subtotal,
        tax,
        discount,
        fee: deliveryFee,
        total,
        eta: type === 'delivery' ? '12–15 MINS' : '10 MINS',
        address: addressLine,
      });
    } catch {
      setPlaceError('Network error. Please try again.');
    }
    setPlacing(false);
  };

  return (
    <Screen title="Checkout">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-4 max-w-5xl mx-auto pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            {/* Delivery / Takeaway switch */}
            <div className="bg-[#FBF7F0] p-1.5 rounded-2xl border border-[#e5d8c3] shadow-sm flex gap-2">
              {TYPES.map((t) => {
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#681121] text-white shadow-md shadow-[#681121]/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-[#FDFBF7]'
                    }`}
                  >
                    <t.Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Delivery Address Box */}
            {type === 'delivery' ? (
              <div className="bg-[#FBF7F0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase text-[#1E1E24]/60 tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#681121]" /> Delivering To
                  </span>
                  <span className="text-[11px] font-bold text-[#D48924] bg-[#D48924]/10 px-2 py-0.5 rounded-full">Home</span>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter complete delivery address..."
                  className="w-full bg-[#FDFBF7] border border-[#e5d8c3] rounded-xl p-3 text-xs font-semibold text-[#1E1E24] outline-none focus:border-[#681121]"
                />
              </div>
            ) : (
              /* Takeaway Kitchen Pickup Details Box */
              <div className="bg-gradient-to-br from-[#FBF7F0] to-[#f4ebe0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-[#681121] tracking-wider flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-[#681121]" /> Self Pickup Counter
                  </span>
                  <span className="text-[11px] font-black text-[#4E8B56] bg-emerald-50 border border-[#4E8B56]/30 px-2.5 py-0.5 rounded-full">
                    ⚡ Ready in 10 Mins
                  </span>
                </div>

                <div className="bg-white/90 p-3 rounded-2xl border border-[#e8dfcf] space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="text-[#D48924] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-slate-900 leading-tight">
                        {branch.area} Kitchen
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600">
                    <Clock size={13} className="text-[#4E8B56]" />
                    <span>Kitchen Hours: 09:00 AM – 11:00 PM</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 font-medium px-1">
                  💡 Zero delivery charge! Simply show your Order ID at the counter when you arrive.
                </p>
              </div>
            )}

            {/* Selected Items Breakdown */}
            <div className="bg-[#FBF7F0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card">
              <h3 className="text-xs font-extrabold uppercase text-[#1E1E24]/60 tracking-wider mb-3">
                Order Items ({cart.length})
              </h3>
              <div className="space-y-2.5">
                {cart.map((l) => {
                  const d = dishById(l.dishId);
                  if (!d) return null;
                  return (
                    <div key={l.key} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-[#681121]">{l.qty}x</span>
                        <span className="font-medium text-[#1E1E24] truncate">{d.name}</span>
                      </div>
                      <span className="font-bold text-[#1E1E24]">{formatINR(lineTotal(l))}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coupons & Offers Box */}
            <div
              onClick={() => setShowCoupons(true)}
              className="bg-gradient-to-r from-[#D48924]/10 to-[#681121]/10 p-4 rounded-3xl border border-[#D48924]/30 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#681121]/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#681121] text-white flex items-center justify-center font-black shadow-sm">
                  <Ticket size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-extrabold text-[#1E1E24]">
                      {offer ? offer.code : 'Apply Coupon'}
                    </p>
                    {offer && (
                      <span className="text-[10px] font-black text-[#4E8B56] bg-[#4E8B56]/15 px-2 py-0.5 rounded-full">
                        APPLIED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#1E1E24]/70 font-medium mt-0.5">
                    {offer ? `Yay! Saving ${formatINR(discount)} on this order` : 'Select or enter coupon code'}
                  </p>
                </div>
              </div>

              {offer ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOfferId(null);
                  }}
                  className="text-xs font-bold text-red-600 bg-white px-3 py-1.5 rounded-xl border border-red-200 shadow-sm hover:bg-red-50 transition-colors"
                >
                  REMOVE
                </button>
              ) : (
                <div className="flex items-center gap-1 text-xs font-extrabold text-[#681121]">
                  <span>SELECT</span>
                  <ChevronRight size={14} />
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-[#FBF7F0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card">
              <h3 className="text-xs font-extrabold uppercase text-[#1E1E24]/60 tracking-wider mb-3">
                Payment Option
              </h3>
              <div className="space-y-2">
                {PAYMENTS.map((p) => {
                  const active = pay === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPay(p.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        active
                          ? 'border-[#681121] bg-[#681121]/10 text-[#681121] font-bold shadow-sm'
                          : 'border-[#e5d8c3] bg-[#FDFBF7] hover:border-[#681121]/40 text-[#1E1E24]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <p.Icon size={18} className={active ? 'text-[#681121]' : 'text-[#1E1E24]/40'} />
                        <div>
                          <p className="text-xs font-bold">{p.label}</p>
                          <p className="text-[10px] text-[#1E1E24]/60">{p.sub}</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          active ? 'border-[#681121] bg-[#681121]' : 'border-[#e5d8c3] bg-white'
                        }`}
                      >
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Bill Details */}
          <div className="space-y-4">
            {/* Bill Summary */}
            <div className="bg-[#FBF7F0] p-5 rounded-3xl border border-[#e5d8c3] shadow-card space-y-3 text-xs">
              <h3 className="text-xs font-extrabold uppercase text-[#1E1E24]/60 tracking-wider mb-2">
                Bill Details
              </h3>
              <div className="flex justify-between text-[#1E1E24]/80">
                <span>Item Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#4E8B56] font-bold">
                  <span>Coupon Savings</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#1E1E24]/80">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-[#4E8B56] uppercase">FREE</span>
                  ) : (
                    formatINR(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[#1E1E24]/80">
                <span>Platform Fee</span>
                <span>{formatINR(platformFee)}</span>
              </div>
              <div className="flex justify-between text-[#1E1E24]/80">
                <span>Taxes & GST (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="pt-2 border-t border-[#e5d8c3] flex justify-between text-base font-black text-[#1E1E24]">
                <span>Total to Pay</span>
                <span className="text-[#681121]">{formatINR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Place Order Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#e5d8c3] px-4 py-3 shadow-nav">
        <div className="mx-auto max-w-xl space-y-2">
          {placeError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-2 rounded-xl">
              {placeError}
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Pay via {pay.toUpperCase()}
              </p>
              <p className="text-lg font-black text-[#681121] tracking-tight leading-none mt-0.5">
                {formatINR(total)}
              </p>
            </div>

            <button
              type="button"
              disabled={!ready || placing}
              onClick={place}
              className="flex-1 flex items-center justify-center gap-2 bg-[#681121] hover:bg-[#540c19] disabled:opacity-50 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-[#681121]/25 active:scale-[0.99] transition-all"
            >
              {placing ? (
                <span>Placing Order...</span>
              ) : auth.isLoggedIn ? (
                <>
                  <span>Place Order</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Login to Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>


      {/* Coupons & Offers Selection Sheet Modal (Like Zomato/Swiggy) */}
      {showCoupons && (
        <div
          onClick={() => {
            setShowCoupons(false);
            setCouponError('');
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FDFBF7] rounded-t-3xl sm:rounded-3xl border border-[#e8dfcf] p-5 shadow-2xl max-h-[85vh] flex flex-col text-[#1E1E24]"
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e8dfcf]">
              <div>
                <h4 className="text-base font-extrabold text-[#1E1E24]">Apply Coupon</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Available offers for your cart ({formatINR(subtotal)})
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCoupons(false);
                  setCouponError('');
                }}
                className="p-1 rounded-full text-slate-400 hover:text-[#1E1E24] hover:bg-[#e8dfcf]/40"
              >
                <X size={20} />
              </button>
            </div>

            {/* Manual Code Input Bar */}
            <div className="pt-4 pb-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  placeholder="ENTER COUPON CODE"
                  className="flex-1 uppercase font-bold text-xs tracking-wider bg-white border border-[#e5d8c3] rounded-2xl px-3.5 py-3 outline-none focus:border-[#681121]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const matched = offers.find(
                      (o) => o.code.toUpperCase() === couponInput.trim().toUpperCase()
                    );
                    if (matched) {
                      setOfferId(matched.id);
                      setShowCoupons(false);
                      setCouponInput('');
                      setCouponError('');
                    } else {
                      setCouponError('Invalid coupon code. Please check again.');
                    }
                  }}
                  className="bg-[#681121] hover:bg-[#540c19] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow active:scale-95 transition-all"
                >
                  APPLY
                </button>
              </div>
              {couponError && (
                <p className="text-[11px] font-bold text-red-600 mt-1.5 ml-1">{couponError}</p>
              )}
            </div>

            {/* Coupons List */}
            <div className="overflow-y-auto space-y-3 pt-2 pb-4 flex-1 pr-1">
              {offers.map((o) => {
                const isSelected = offerId === o.id;
                return (
                  <div
                    key={o.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-[#681121]/5 border-[#681121]'
                        : 'bg-[#FBF7F0] border-[#e5d8c3] hover:border-[#D48924]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#1E1E24]">{o.value}</span>
                          <span className="text-[10px] font-black tracking-wider text-[#681121] bg-[#681121]/10 px-2 py-0.5 rounded-md border border-[#681121]/20">
                            {o.code}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#1E1E24] mt-1">{o.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{o.sub}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setOfferId(isSelected ? null : o.id);
                          setShowCoupons(false);
                        }}
                        className={`text-xs font-black px-3.5 py-1.5 rounded-xl border transition-all active:scale-95 ${
                          isSelected
                            ? 'text-red-600 bg-white border-red-200'
                            : 'text-[#681121] bg-[#FDFBF7] border-[#681121]/30 hover:bg-[#681121] hover:text-white'
                        }`}
                      >
                        {isSelected ? 'REMOVE' : 'APPLY'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
