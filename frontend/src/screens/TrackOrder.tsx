import React, { useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Clock,
  Bike,
  PartyPopper,
  Phone,
  MapPin,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useApp, lineTotal } from '../store';
import { dishById } from '../data/menu';
import { locations } from '../data/locations';
import { ORDER_STAGES } from '../data';
import { Screen, Empty, DishImg, VegBadge } from '../ui';
import { formatINR } from '../lib/utils';
import { ordersApi, proxyApi } from '../lib/api';

export default function TrackOrder({ orderId }: { orderId: string }) {
  const order = useApp((s) => s.orders.find((o) => o.id === orderId));
  const advanceOrder = useApp((s) => s.advanceOrder);
  const setTab = useApp((s) => s.setTab);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!order || order.status >= 6) return;
    timer.current = window.setTimeout(() => {
      advanceOrder(orderId);
      ordersApi.advance(orderId, order.status + 1);
    }, 7000);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [order?.status, orderId, advanceOrder, order]);

  if (!order) {
    return (
      <Screen eyebrow="Tracking" title="Order Status">
        <Empty
          title="Order Not Found"
          sub="This order ticket is no longer active."
          cta="View All Orders"
          onCta={() => setTab('orders')}
        />
      </Screen>
    );
  }

  const branch = locations.find((l) => l.id === order.locationId);
  const delivered = order.status >= 6;
  const pct = (order.status / (ORDER_STAGES.length - 1)) * 100;

  return (
    <Screen eyebrow={order.code} title={delivered ? 'Delivered' : 'On The Way'}>
      <div className="w-full px-4 sm:px-6 lg:px-10 py-4 space-y-4 max-w-4xl mx-auto pb-32">
        {/* Live Tracking Card - Navy/Maroon brand style */}
        <div className="bg-gradient-to-br from-[#1D2E47] via-[#2C3E50] to-[#1E1E24] text-white rounded-3xl p-5 shadow-xl shadow-[#1D2E47]/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#E2952A]">
                <Clock size={13} /> {order.eta}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                {order.type}
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight leading-tight">
              {ORDER_STAGES[order.status].label}
            </h2>
            <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
              {ORDER_STAGES[order.status].sub}
            </p>

            {/* Progress bar */}
            <div className="mt-5 relative h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D48924] to-[#E2952A] rounded-full transition-all duration-700"
                style={{ width: `${Math.max(12, pct)}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-amber-100/90">
              <span>Order Placed</span>
              <span>Roasting</span>
              <span>Packed</span>
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Delivery Partner Details */}
        {!delivered && (
          <div className="bg-[#FBF7F0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D48924] text-[#1E1E24] font-black">
                <Bike size={22} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#1E1E24]">
                  Ramesh (Sahi Express)
                </p>
                <p className="text-[11px] text-[#1E1E24]/60 font-medium">
                  Assigned Delivery Partner · Bhopal Hub
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Calling delivery partner...')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#681121]/10 text-[#681121] border border-[#681121]/20 shadow-sm hover:bg-[#681121] hover:text-white transition-colors"
            >
              <Phone size={16} />
            </button>
          </div>
        )}

        {/* Order Details & Items Summary */}
        <div className="bg-[#FBF7F0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e5d8c3]">
            <h3 className="text-xs font-extrabold uppercase text-[#1E1E24]/60 tracking-wider">
              Items in this Order ({order.lines.length})
            </h3>
            <span className="text-xs font-bold text-[#681121]">
              {formatINR(order.total)}
            </span>
          </div>

          <div className="space-y-2.5">
            {order.lines.map((l) => {
              const d = dishById(l.dishId);
              if (!d) return null;
              return (
                <div key={l.key} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <VegBadge />
                    <span className="font-bold text-[#681121]">{l.qty}x</span>
                    <span className="font-semibold text-[#1E1E24]">{d.name}</span>
                  </div>
                  <span className="font-bold text-[#1E1E24]">{formatINR(lineTotal(l))}</span>
                </div>
              );
            })}
          </div>

          {order.address && (
            <div className="mt-4 pt-3 border-t border-[#e5d8c3] text-xs text-[#1E1E24]/70 flex items-start gap-2">
              <MapPin size={14} className="text-[#681121] shrink-0 mt-0.5" />
              <span>{order.address}</span>
            </div>
          )}
        </div>

        {/* WhatsApp Help CTA */}
        <button
          type="button"
          onClick={async () => {
            const msg = `Hi Sahi Crunch, need help with Order ${order.code}`;
            const { data } = await proxyApi.sendWhatsApp({ message: msg });
            if (data?.url) window.open(data.url, '_blank');
            else window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`, '_blank');
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1E1E24] border border-[#25D366]/40 font-extrabold text-xs py-3.5 rounded-2xl transition-colors"
        >
          <span>Need help with order? Chat on WhatsApp</span>
        </button>
      </div>
    </Screen>
  );
}
