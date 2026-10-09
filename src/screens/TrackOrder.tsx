import { useEffect, useRef } from 'react';
import { Check, Clock, ChefHat, Bike, PartyPopper, Phone } from 'lucide-react';
import { useApp, lineTotal } from '../store';
import { dishById } from '../data/menu';
import { locations } from '../data/locations';
import { ORDER_STAGES } from '../data';
import { Screen, Empty, DishImg, Pill } from '../ui';
import { formatINR } from '../lib/utils';

const stageIcon = [Clock, Check, ChefHat, Check, Bike, Bike, PartyPopper];

export default function TrackOrder({ orderId }: { orderId: string }) {
  const order = useApp((s) => s.orders.find((o) => o.id === orderId));
  const advanceOrder = useApp((s) => s.advanceOrder);
  const timer = useRef<number | null>(null);

  /* the kitchen moves on its own — advance the demo order every 12s */
  useEffect(() => {
    if (!order || order.status >= 6) return;
    timer.current = window.setTimeout(() => advanceOrder(orderId), 12000);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [order?.status, orderId, advanceOrder, order]);

  if (!order) {
    return (
      <Screen eyebrow="TRACKING" title="ORDER">
        <Empty title="NO SUCH TICKET" sub="This order is no longer on the rail." cta="SEE MY ORDERS" onCta={() => useApp.getState().setTab('orders')} />
      </Screen>
    );
  }

  const branch = locations.find((l) => l.id === order.locationId);
  const delivered = order.status >= 6;
  const pct = (order.status / (ORDER_STAGES.length - 1)) * 100;

  return (
    <Screen eyebrow={order.code} title={delivered ? 'DELIVERED' : 'ON ITS WAY'}>
      {/* status hero */}
      <section className="panel relative overflow-hidden px-5 pb-7 pt-6">
        <div className="grain absolute inset-0" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="label gold">{order.eta} · {order.type.toUpperCase()}</span>
            <Pill tone={delivered ? 'open' : 'amber'}>{delivered ? 'COMPLETE' : 'LIVE'}</Pill>
          </div>
          <h2 className="h2 mt-3">
            {ORDER_STAGES[order.status].label}
          </h2>
          <p className="mt-1 text-sm text-ivory-dim">{ORDER_STAGES[order.status].sub}</p>

          <div className="relative mt-5 h-1 w-full bg-ivory/10">
            <div className="h-1 bg-gradient-to-r from-amber to-chili transition-all duration-1000" style={{ width: `${pct}%` }} />
            {!delivered && (
              <span className="pulse-dot absolute -top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-amber" style={{ left: `${pct}%` }} />
            )}
          </div>

          {/* kitchen vignette while cooking */}
          {!delivered && order.status <= 3 && (
            <div className="card mt-6 flex items-end gap-4 p-4">
              <svg viewBox="0 0 64 64" className="chef-sway h-16 w-16 shrink-0" aria-hidden>
                <circle cx="32" cy="20" r="10" fill="none" stroke="#e6a756" strokeWidth="2" />
                <path d="M22 34h20v18H22z" fill="none" stroke="rgba(241,234,221,0.5)" strokeWidth="2" />
                <path d="M14 44h14" stroke="#b5381f" strokeWidth="3" strokeLinecap="round" />
                <ellipse className="pan-flare" cx="21" cy="40" rx="6" ry="3" fill="#ff7a33" opacity="0.8" />
              </svg>
              <div>
                <p className="label gold">{order.status <= 1 ? 'THE PASS HAS IT' : 'FIRE ON THE LINE'}</p>
                <p className="body mt-1">
                  {branch?.area} kitchen · {order.lines.reduce((n, l) => n + l.qty, 0)} plates in motion
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* timeline */}
      <section className="px-5 pt-6">
        <ol className="relative space-y-0">
          <span className="absolute left-[13px] top-3 h-[calc(100%-24px)] w-px bg-ivory/10" aria-hidden />
          {ORDER_STAGES.map((s, i) => {
            const done = i < order.status;
            const now = i === order.status;
            const Icon = stageIcon[i];
            return (
              <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0">
                <span
                  className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                    done
                      ? 'border-herb bg-herb/20 text-herb'
                      : now
                        ? 'pulse-dot border-amber bg-amber text-ink-950'
                        : 'border hair-2 bg-ink text-ivory-faint'
                  }`}
                >
                  {done ? <Check size={13} strokeWidth={3} /> : <Icon size={13} strokeWidth={1.8} />}
                </span>
                <div className={`min-w-0 flex-1 ${!done && !now ? 'opacity-45' : ''}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`label ${now ? 'text-amber' : done ? 'text-ivory' : 'text-ivory-dim'}`}>{s.label}</h3>
                    <span className="eyebrow shrink-0">
                      {done ? 'DONE' : now ? 'NOW' : '—'}
                    </span>
                  </div>
                  <p className="caption mt-0.5">{s.sub}</p>
                  {now && !delivered && (
                    <div className="mt-2 h-0.5 w-24 overflow-hidden bg-ivory/10">
                      <span className="shimmer block h-0.5 w-full" />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* receipt */}
      <section className="mt-4 px-5">
        <div className="card p-5">
          <h3 className="mb-4 label text-ivory">THE TICKET</h3>
          <ul className="mb-4 space-y-3">
            {order.lines.map((l) => {
              const d = dishById(l.dishId);
              if (!d) return null;
              return (
                <li key={l.key} className="flex items-center gap-3">
                  <DishImg name={d.image} className="h-11 w-11 shrink-0 object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] text-ivory">
                      <span className="num text-amber">{l.qty}×</span> {d.name}
                    </span>
                    {l.options.length > 0 && (
                      <span className="caption block truncate">
                        {l.options.map((o) => o.choice).join(' · ')}
                      </span>
                    )}
                  </span>
                  <span className="num text-[13px] text-ivory-dim">{formatINR(lineTotal(l))}</span>
                </li>
              );
            })}
          </ul>
          <div className="hair-t space-y-1.5 pt-3">
            <Line label="Subtotal" value={formatINR(order.subtotal)} />
            {order.discount > 0 && <Line label="Discount" value={`− ${formatINR(order.discount)}`} tone="herb" />}
            {order.fee > 0 && <Line label="Delivery" value={formatINR(order.fee)} />}
            <Line label="Taxes" value={formatINR(order.tax)} />
            <div className="flex items-baseline justify-between pt-2">
              <span className="label text-ivory">PAID</span>
              <span className="num text-xl text-amber">{formatINR(order.total)}</span>
            </div>
          </div>
          <p className="eyebrow mt-3 text-right">+{order.pointsEarned} POINTS EARNED</p>
          {order.address && (
            <p className="caption hair-t mt-3 pt-3">
              {order.type === 'dinein' ? 'SERVED ' : order.type === 'takeaway' ? 'PICKUP ' : 'DELIVERED TO '}
              · {order.address}
            </p>
          )}
        </div>
      </section>

      {/* actions */}
      <section className="mt-5 flex gap-3 px-5">
        <a href={`tel:${branch?.phone.replace(/\s/g, '')}`} className="btn-ghost flex-1 !py-3.5 text-center">
          <Phone size={14} className="mr-2 inline" /> CALL THE HOUSE
        </a>
        <button
          type="button"
          onClick={() => {
            order.lines.forEach((l) =>
              useApp.getState().addToCart({ dishId: l.dishId, qty: l.qty, options: l.options })
            );
            useApp.getState().setCartOpen(true);
          }}
          className="btn-solid flex-1 !py-3.5"
        >
          ORDER AGAIN
        </button>
      </section>

      {delivered && (
        <p className="eyebrow gut mt-6 text-center">
          DID THE KITCHEN DELIVER? TELL THE CHEF — WE READ EVERY NOTE.
        </p>
      )}
      <div className="h-8" />
    </Screen>
  );
}

function Line({ label, value, tone }: { label: string; value: string; tone?: 'herb' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="body">{label}</span>
      <span className={`num text-[13px] ${tone === 'herb' ? 'text-herb' : 'text-ivory-dim'}`}>{value}</span>
    </div>
  );
}
