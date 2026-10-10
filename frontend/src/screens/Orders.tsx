import React, { useEffect, useState } from 'react';
import { ReceiptText, Clock, ArrowRight, RotateCcw, ChevronRight, LogIn, Loader2 } from 'lucide-react';
import { useApp, lineTotal, type Order } from '../store';
import { dishById } from '../data/menu';
import { TabHeader, Empty, VegBadge } from '../ui';
import { formatINR } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { ordersApi } from '../lib/api';

export default function Orders() {
  const orders = useApp((s) => s.orders);
  const syncOrders = useApp((s) => s.syncOrders);
  const push = useApp((s) => s.push);
  const setTab = useApp((s) => s.setTab);
  const addToCart = useApp((s) => s.addToCart);
  const auth = useAuth();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn) return;
    let mounted = true;
    setFetching(true);
    ordersApi.list().then(({ data }) => {
      if (mounted && data?.orders) {
        syncOrders(data.orders as unknown as Order[]);
      }
      if (mounted) setFetching(false);
    });
    return () => { mounted = false; };
  }, [auth.isLoggedIn, syncOrders]);

  const repeatOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.lines.forEach((l) => {
      addToCart({ dishId: l.dishId, qty: l.qty, options: l.options });
    });
    useApp.getState().setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-36 text-[#1E1E24]">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-5xl mx-auto space-y-4">
        {/* Auth prompt if guest */}
        {!auth.isLoggedIn && (
          <div className="bg-[#FBF7F0] border border-[#e5d8c3] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#681121]/10 text-[#681121] flex items-center justify-center font-bold">
                <LogIn size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E1E24]">Access your full order history</p>
                <p className="text-[11px] text-slate-500">Log in to view orders and live updates on any device.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => auth.openLogin()}
              className="w-full sm:w-auto px-4 py-2 bg-[#681121] text-white text-xs font-black rounded-xl hover:bg-[#540c19] transition-colors shrink-0"
            >
              Log In / Register
            </button>
          </div>
        )}

        {fetching && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={24} className="animate-spin text-[#681121]" />
            <p className="text-xs font-semibold">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Empty
            title="No Orders Placed Yet"
            sub="Explore our fresh roasted makhana & bakery items to place your first order."
            cta="Explore Menu"
            onCta={() => setTab('menu')}
          />
        ) : (
          orders.map((o) => {
            const isDelivered = o.status >= 6;
            const dateStr = new Date(o.placedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={o.id}
                className="bg-[#FBF7F0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#1E1E24]">{o.code}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          isDelivered
                            ? 'bg-[#4E8B56]/15 text-[#4E8B56] border border-[#4E8B56]/30'
                            : 'bg-[#D48924]/15 text-[#D48924] border border-[#D48924]/30'
                        }`}
                      >
                        {isDelivered ? 'Delivered' : 'In Progress'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{dateStr}</p>
                  </div>

                  <span className="text-base font-black text-[#681121]">
                    {formatINR(o.total)}
                  </span>
                </div>

                {/* Items */}
                <div className="pt-2 border-t border-[#e8dfcf] space-y-1.5">
                  {o.lines.map((l) => {
                    const d = dishById(l.dishId);
                    if (!d) return null;
                    return (
                      <div key={l.key} className="flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 truncate">
                          <VegBadge />
                          <span className="font-bold text-[#1E1E24]">{l.qty}x</span>
                          <span className="truncate">{d.name}</span>
                        </div>
                        <span className="font-semibold text-[#1E1E24]">{formatINR(lineTotal(l))}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#e8dfcf] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => push({ type: 'track', orderId: o.id })}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#FDFBF7] hover:bg-[#f3ece0] text-[#1E1E24] text-xs font-bold py-2.5 rounded-xl border border-[#e5d8c3] transition-colors"
                  >
                    <span>{isDelivered ? 'Order Receipt' : 'Live Tracking'}</span>
                    <ChevronRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => repeatOrder(o.id)}
                    className="flex items-center gap-1.5 bg-[#681121] hover:bg-[#540c19] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    <RotateCcw size={13} />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
