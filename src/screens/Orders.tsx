import { ReceiptText, ChevronRight, RefreshCw } from 'lucide-react';
import { useApp } from '../store';
import { dishById } from '../data/menu';
import { locations } from '../data/locations';
import { ORDER_STAGES } from '../data';
import { Empty, Pill, DishImg, TabHeader } from '../ui';
import { formatINR } from '../lib/utils';

const typeLabel = { delivery: 'DELIVERY', takeaway: 'TAKEAWAY', dinein: 'DINE-IN' } as const;

export const stamp = (t: number) =>
  new Date(t).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });

export default function Orders() {
  const orders = useApp((s) => s.orders);
  const push = useApp((s) => s.push);
  const setTab = useApp((s) => s.setTab);

  const live = orders.filter((o) => o.status < 6);
  const past = orders.filter((o) => o.status >= 6);

  if (orders.length === 0) {
    return (
      <div className="safe-b pb-8">
        <TabHeader eyebrow="EVERY PASS, EVERY PLATE" title="ORDERS" />
        <Empty
          title="THE KITCHEN HIT A PAUSE"
          sub="No orders yet. When you place one, it appears here with live tracking from the pass to your door."
          cta="BROWSE THE MENU"
          onCta={() => setTab('menu')}
        />
      </div>
    );
  }

  return (
    <div className="safe-b pb-8">
      <TabHeader
        eyebrow={`${orders.length} ORDER${orders.length > 1 ? 'S' : ''} ON RECORD`}
        title="ORDERS"
      />

      {live.length > 0 && (
        <section className="sect gut">
          <h2 className="mb-3 label gold">IN THE KITCHEN</h2>
          {live.map((o) => {
            const stage = ORDER_STAGES[o.status];
            const pct = (o.status / (ORDER_STAGES.length - 1)) * 100;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => push({ type: 'track', orderId: o.id })}
                data-cursor="TRACK"
                className="card-amber relative block w-full overflow-hidden p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="num text-amber">{o.code}</span>
                  <Pill tone="amber">{typeLabel[o.type]}</Pill>
                </div>
                <p className="h2 mt-3">{stage.label}</p>
                <p className="body mt-0.5">
                  {stage.sub} · ETA {o.eta}
                </p>

                <div className="relative mt-4 h-1 w-full bg-ivory/10">
                  <div
                    className="h-1 bg-gradient-to-r from-amber to-chili transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="pulse-dot absolute -top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-amber" style={{ left: `${pct}%` }} />
                </div>

                <div className="hair-t mt-4 flex items-center justify-between pt-3">
                  <span className="caption min-w-0 truncate pr-3">
                    {o.lines.map((l) => `${l.qty}× ${dishById(l.dishId)?.name ?? ''}`).join(', ')}
                  </span>
                  <span className="num gold shrink-0">{formatINR(o.total)}</span>
                </div>
                <span className="mt-3 flex items-center gap-1 label gold">
                  OPEN TRACKING <ChevronRight size={12} />
                </span>
              </button>
            );
          })}
        </section>
      )}

      {past.length > 0 && (
        <section className="sect gut">
          <h2 className="mb-3 label text-ivory">PAST ORDERS</h2>
          <ul className="space-y-3">
            {past.map((o) => (
              <li key={o.id} className="card p-4">
                <div className="flex gap-3">
                  <div className="flex -space-x-3">
                    {o.lines.slice(0, 3).map((l) => {
                      const d = dishById(l.dishId);
                      return d ? (
                        <DishImg
                          key={l.key}
                          name={d.image}
                          className="h-11 w-11 rounded-full border border-ink object-cover"
                        />
                      ) : null;
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="num label text-ivory-dim">{o.code}</span>
                      <Pill tone="off">{typeLabel[o.type]}</Pill>
                    </div>
                    <p className="body-b mt-1 truncate">
                      {o.lines.map((l) => `${l.qty}× ${dishById(l.dishId)?.name ?? ''}`).join(', ')}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="eyebrow">{stamp(o.placedAt)}</span>
                      <span className="num gold">{formatINR(o.total)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      o.lines.forEach((l) =>
                        useApp.getState().addToCart({ dishId: l.dishId, qty: l.qty, options: l.options })
                      );
                      useApp.getState().setCartOpen(true);
                    }}
                    className="chip flex-1 justify-center py-2.5"
                  >
                    <RefreshCw size={11} />
                    REORDER
                  </button>
                  <button
                    type="button"
                    onClick={() => push({ type: 'track', orderId: o.id })}
                    className="chip flex-1 justify-center py-2.5"
                  >
                    RECEIPT
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="eyebrow gut mt-8">
        PREPARED AT {locations.find((l) => l.id === orders[0]?.locationId)?.area.toUpperCase()} · GHARELU HUB
      </p>
    </div>
  );
}
