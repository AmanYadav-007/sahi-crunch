import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Search,
  RefreshCw,
  PackageCheck,
  Truck,
} from 'lucide-react';
import { adminApi, ORDER_STAGES } from './adminApi';
import type { Order } from './types';
import { Squiggle, Empty, Loader, Stamp } from './ui';

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // exact stage (sent to API)
  const [tabFilter, setTabFilter] = useState<'all' | 'active' | 'done'>('all'); // local view tab
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      });
      setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, [statusFilter, typeFilter]);

  const handleStatusChange = async (orderId: string, newStatus: number) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const activeCount = orders.filter((o) => o.status < 4).length;
  const deliveredCount = orders.filter((o) => o.status >= 4).length;
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const filteredOrders = orders.filter((o) => {
    // View tab (mirrors the customer Orders screen)
    if (tabFilter === 'active' && o.status >= 4) return false;
    if (tabFilter === 'done' && o.status < 4) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.code.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      (o.address && o.address.toLowerCase().includes(q))
    );
  });

  const summary = [
    { label: 'Total orders', value: String(orders.length) },
    { label: 'In pipeline', value: String(activeCount) },
    { label: 'Delivered', value: String(deliveredCount) },
    { label: 'Order value', value: `₹${revenue.toLocaleString('en-IN')}` },
  ];

  return (
    <div>
      {/* ===== Dispatch board hero — the maroon sign ===== */}
      <div className="relative bg-[#540c19] -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 pt-8 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[#D48924] pointer-events-none" />
        <div className="absolute inset-x-0 top-1.5 h-px bg-[#E2952A]/50 pointer-events-none" />
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(226,149,42,0.13)_1px,transparent_1px)] [background-size:19px_19px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-note text-[10px] font-semibold uppercase tracking-[0.26em] text-[#E2952A]">
                Dispatch board · Bhopal kitchen
              </span>
              <h1 className="font-hand italic text-3xl sm:text-4xl tracking-tight text-[#FDFBF7] leading-tight mt-1">
                Orders &amp; dispatches
              </h1>
              <svg viewBox="0 0 240 12" className="w-44 sm:w-56 h-3 mt-1" fill="none" aria-hidden="true">
                <path
                  d="M3 8.5c26-4.5 52-6 78-4.5s50 4.5 76 3 52-5 80-6"
                  stroke="#D48924"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <p className="font-note text-xs sm:text-sm text-[#FDFBF7]/75 mt-2 max-w-lg leading-relaxed">
                Track every ticket from the woodfire roaster to the rider's bag.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto tilt-l-sm bg-[#240409]/50 border-2 border-dashed border-[#E2952A]/50 rounded-lg px-3.5 py-2 shadow-[2px_3px_0_rgba(36,4,9,0.35)]">
              <div className="text-right">
                <span className="block font-note text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E2952A]">
                  On the board
                </span>
                <span className="font-hand italic text-base leading-tight text-[#FDFBF7]">
                  {activeCount} in progress
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#E2952A]" />
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-7 space-y-5 relative z-20">
        {/* Summary ledger strip */}
        <div className="sc-card p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y-0">
          {summary.map((s) => (
            <div key={s.label} className="px-1">
              <span className="font-note text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                {s.label}
              </span>
              <p className="font-hand text-2xl font-semibold text-[#540c19] leading-tight mt-0.5">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filter & search bar — tabs + blank form */}
        <div className="sc-card p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All tickets', count: orders.length },
              { id: 'active', label: 'In progress', count: activeCount },
              { id: 'done', label: 'Delivered', count: deliveredCount },
            ].map((tab) => {
              const isSelected = tabFilter === tab.id;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setTabFilter(tab.id as 'all' | 'active' | 'done')}
                  className={`px-3.5 py-1.5 rounded-xl font-note text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'btn-ink'
                      : 'text-[var(--ink-soft)] hover:text-[#540c19] hover:bg-[var(--paper-3)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[var(--paper-3)] text-[var(--ink-faint)]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-end">
            <div className="relative flex-1 sm:flex-none sm:w-56">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code, address, ID…"
                className="form-blank w-full pl-8 pr-3 py-1.5 font-note text-xs text-[var(--ink)] outline-none focus:border-[#681121]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sc-select sm:w-auto py-1.5 text-xs"
            >
              <option value="">All stages</option>
              {ORDER_STAGES.map((s, idx) => (
                <option key={idx} value={idx}>
                  {idx}: {s.label}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="sc-select sm:w-auto py-1.5 text-xs"
            >
              <option value="">All types</option>
              <option value="delivery">Doorstep delivery</option>
              <option value="takeaway">Pickup / takeaway</option>
              <option value="dinein">Dine-in stall</option>
            </select>

            <button onClick={loadOrders} className="btn-outline flex items-center gap-1.5 font-note text-xs font-semibold px-3 py-1.5 whitespace-nowrap">
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>
        </div>

        {/* ===== Tickets ===== */}
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="sc-skeleton h-44 rounded-2xl" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Empty
            title="Nothing on the board"
            sub="No tickets match this filter. Clear the search or pick another stage."
          />
        ) : (
          <div className="space-y-5 max-w-4xl mx-auto">
            {filteredOrders.map((order, idx) => {
              const currentStage = ORDER_STAGES[order.status] || ORDER_STAGES[0];
              const isDone = order.status >= 5;
              const dateStr = new Date(order.placedAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <div
                  key={order.id}
                  className={`sc-card sc-card-hover relative overflow-hidden ${
                    idx % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm'
                  } hover:tilt-0`}
                >
                  {/* tape holding the ticket to the board */}
                  <span
                    className={`absolute -top-2.5 z-10 w-16 h-5 rotate-[-4deg] bg-[#e6d3a3]/80 border-y border-white/50 shadow-sm pointer-events-none ${
                      idx % 2 === 0 ? 'right-7' : 'left-7 rotate-[3deg]'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Ticket head ribbon */}
                  <div className="p-4 sm:p-5 pb-3.5 bg-[var(--paper-3)]/50 border-b border-[var(--rule)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl border-2 border-dashed flex items-center justify-center shrink-0 ${
                            isDone
                              ? 'bg-[#4E8B56]/10 border-[#4E8B56]/40 text-[#3d7044]'
                              : 'bg-[#D48924]/10 border-[#D48924]/50 text-[#b87319]'
                          }`}
                        >
                          {isDone ? <PackageCheck size={20} /> : <Truck size={20} />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-hand italic text-base tracking-tight text-[#540c19]">
                              #{order.code}
                            </span>
                            <span className={`stamp ${currentStage.color}`}>{currentStage.label}</span>
                            <span className="stamp tilt-r-sm text-[var(--ink-faint)]">
                              {order.type}
                            </span>
                          </div>
                          <p className="font-note text-[11px] text-[var(--ink-faint)] font-medium mt-1 flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>Placed {dateStr}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--rule)] gap-1">
                        <span className="font-hand text-xl font-semibold text-[#681121]">
                          ₹{order.total}
                        </span>
                        <span className="font-note text-[11px] font-semibold text-[#b87319]">
                          {currentStage.desc}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body — items & destination */}
                  <div className="p-4 sm:p-5 py-3.5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-note text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)] mb-1.5">
                        Ordered items ({order.lines.length})
                      </div>
                      <div className="divide-y divide-[var(--rule)]/60">
                        {order.lines.map((line, i) => (
                          <div
                            key={i}
                            className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs font-note"
                          >
                            <span className="flex items-center gap-2.5 truncate max-w-[75%]">
                              <span className="veg-badge" />
                              <span className="truncate">
                                <span className="font-semibold text-[#540c19] mr-1.5">
                                  {line.qty} ×
                                </span>
                                <span className="font-medium text-[var(--ink)]">
                                  {line.dishId.replace(/-/g, ' ')}
                                </span>
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-dashed border-[var(--rule)] md:pl-4 pt-3 md:pt-0">
                      <div className="font-note text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)] mb-1.5">
                        Dispatch destination
                      </div>

                      {order.address ? (
                        <p className="font-note text-[11px] text-[var(--ink-soft)] font-medium flex items-start gap-1.5">
                          <MapPin size={12} className="text-[#681121] shrink-0 mt-0.5" />
                          <span>{order.address}</span>
                        </p>
                      ) : (
                        <p className="font-note text-[11px] text-[var(--ink-faint)] italic">
                          Self pickup / counter takeaway
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-note text-[11px] text-[var(--ink-faint)] font-medium mt-2.5">
                        <span>
                          Payment: <strong className="text-[#540c19] uppercase">{order.paymentMethod}</strong>
                        </span>
                        <span>
                          ETA: <strong className="text-[#540c19]">{order.eta}</strong>
                        </span>
                        {order.couponCode && (
                          <span className="stamp tilt-r-sm text-[#3d7044] border-[#4E8B56]/50">
                            {order.couponCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions bar — move the ticket along the board */}
                  <div className="p-3.5 sm:p-4 border-t border-[var(--rule)] flex items-center justify-between gap-3">
                    <span className="font-note text-[11px] text-[var(--ink-faint)] font-medium">
                      Stage {order.status} of {ORDER_STAGES.length - 1}
                    </span>

                    <div className="flex items-center gap-2.5">
                      <label className="font-note text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                        Move to
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                        className={`sc-select w-auto py-1.5 text-xs font-semibold ${currentStage.color}`}
                      >
                        {ORDER_STAGES.map((st, i) => (
                          <option key={i} value={i}>
                            {i} — {st.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
