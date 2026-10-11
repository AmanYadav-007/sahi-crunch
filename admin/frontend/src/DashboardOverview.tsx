import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Calendar,
  Users,
  Receipt,
  CheckCircle2,
  ArrowUpRight,
  Clock3,
  Layers,
} from 'lucide-react';
import { adminApi, ORDER_STAGES } from './adminApi';
import type { DashboardMetrics, Order } from './types';
import { SectionTitle, Squiggle, Empty, Loader } from './ui';

export default function DashboardOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then((res) => {
        setMetrics(res.metrics);
        setRecentOrders(res.recentOrders);
        setCategories(res.categoryDistribution);
      })
      .catch((err) => console.error('Failed to load stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="sc-skeleton h-44 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="sc-skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="sc-skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  const kpis = [
    {
      title: 'Gross Revenue',
      value: `₹${metrics?.totalRevenue?.toLocaleString('en-IN') || 0}`,
      desc: 'All-time platform sales',
      icon: IndianRupee,
      fill: 100,
    },
    {
      title: 'Orders in Pipeline',
      value: `${metrics?.pendingOrders || 0}`,
      desc: 'Roasting, packing & dispatch',
      icon: ShoppingBag,
      fill: 62,
      live: true,
    },
    {
      title: 'Snack Catalog',
      value: `${metrics?.totalDishes || 0}`,
      desc: `${metrics?.activeDishesCount || 0} live on the customer app`,
      icon: Package,
      fill: 78,
    },
    {
      title: 'Tasting Passes',
      value: `${metrics?.upcomingReservations || 0}`,
      desc: 'Confirmed upcoming guests',
      icon: Calendar,
      fill: 45,
    },
  ];

  const secondary = [
    { label: 'Total orders', value: metrics?.totalOrders ?? 0, icon: Receipt },
    { label: 'Completed', value: metrics?.completedOrders ?? 0, icon: CheckCircle2 },
    { label: 'Customers', value: metrics?.totalUsers ?? 0, icon: Users },
    { label: 'All bookings', value: metrics?.totalReservations ?? 0, icon: Calendar },
  ];

  const catEntries = Object.entries(categories);
  const maxCat = Math.max(1, ...catEntries.map(([, c]) => c));

  const stageCounts = recentOrders.reduce<Record<number, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-6">
      {/* ============ The maroon ledger sign ============ */}
      <div className="relative rounded-2xl bg-[#540c19] text-[#FDFBF7] border border-[#D48924]/40 p-5 sm:p-7 shadow-[3px_4px_0_rgba(36,4,9,0.35),0_16px_30px_-22px_rgba(84,12,25,0.6)] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[#D48924] pointer-events-none" />
        <div className="absolute inset-x-0 top-1.5 h-px bg-[#E2952A]/50 pointer-events-none" />
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(226,149,42,0.13)_1px,transparent_1px)] [background-size:19px_19px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center gap-6">
          <div className="flex-1 min-w-0">
            <span className="font-note text-[10px] font-semibold uppercase tracking-[0.26em] text-[#E2952A]">
              Master operations · Bhopal kitchen
            </span>
            <h1 className="font-hand italic text-3xl sm:text-4xl tracking-tight text-[#FDFBF7] leading-tight mt-1.5">
              Bhopal Artisanal Snacking Control Center
            </h1>
            <svg viewBox="0 0 240 12" className="w-44 sm:w-60 h-3 mt-1" fill="none" aria-hidden="true">
              <path
                d="M3 8.5c26-4.5 52-6 78-4.5s50 4.5 76 3 52-5 80-6"
                stroke="#D48924"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-note text-xs sm:text-sm text-[#FDFBF7]/75 mt-2 max-w-xl leading-relaxed">
              Real-time control over products, woodfire roasting status, instant image updates and
              doorstep deliveries — from one kitchen pad.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('products')}
                className="btn-amber flex items-center gap-1.5 font-note text-xs font-semibold uppercase tracking-[0.12em] px-5 py-2.5"
              >
                Manage Products
                <ArrowUpRight size={14} />
              </button>
              <button
                onClick={() => onNavigate('orders')}
                className="btn-chalk flex items-center gap-1.5 font-note text-xs font-semibold uppercase tracking-[0.12em] px-5 py-2.5"
              >
                View Dispatch Queue
              </button>
            </div>
          </div>

          {/* Right rail — stamps pressed onto the sign */}
          <div className="xl:w-[300px] shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Clock3 size={13} className="text-[#E2952A]" />
              <span className="font-note text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E2952A]">
                Today · {today}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {secondary.map((s, i) => (
                <div
                  key={s.label}
                  className={`rounded-lg px-3 py-2.5 bg-[#240409]/50 border-2 border-dashed border-[#E2952A]/50 shadow-[2px_3px_0_rgba(36,4,9,0.35)] ${
                    i % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm'
                  }`}
                >
                  <span className="font-hand text-2xl leading-none text-[#FDFBF7] block">
                    {typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}
                  </span>
                  <span className="font-note text-[9px] font-semibold uppercase tracking-[0.14em] text-[#E2952A] mt-1 block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ KPI cards — notes pinned to the board ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((c, i) => (
          <div
            key={c.title}
            className={`sc-card sc-card-hover relative overflow-hidden p-5 ${
              i % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm'
            } hover:tilt-0`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-note text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                  {c.title}
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="font-hand text-3xl font-semibold leading-none text-[#540c19]">
                    {c.value}
                  </span>
                  {c.live && <span className="stamp tilt-r-sm text-[#3d7044] border-[#4E8B56]/50">Live</span>}
                </div>
                <p className="font-note text-[11px] text-[var(--ink-faint)] mt-1.5 leading-snug">
                  {c.desc}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#681121]/8 border-2 border-dashed border-[#681121]/30 text-[#681121] flex items-center justify-center shrink-0">
                <c.icon size={19} />
              </div>
            </div>

            <div className="mt-4 h-2 w-full bg-[var(--paper-3)] border border-[var(--rule)] rounded-full overflow-hidden">
              <div className="h-full sc-bar" style={{ width: `${c.fill}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* ============ Orders + Catalog ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders — the ticket pad */}
        <div className="lg:col-span-2 sc-card relative p-5 sm:p-6">
          <div className="mb-4">
            <SectionTitle
              eyebrow="Fresh off the grill"
              action={
                <button onClick={() => onNavigate('orders')} className="flex items-center gap-1">
                  View all orders <ArrowUpRight size={13} />
                </button>
              }
            >
              Latest customer orders
            </SectionTitle>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-10 text-center rounded-xl border-2 border-dashed border-[var(--rule)] bg-[var(--paper-3)]/40">
              <p className="font-hand italic text-xl text-[#540c19]">The ticket pad is still empty</p>
              <p className="font-note text-[11px] text-[var(--ink-faint)] mt-1">
                No orders yet — new tickets print here the moment they arrive.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--rule)]/70">
              {recentOrders.map((ord) => {
                const stage = ORDER_STAGES[ord.status] || ORDER_STAGES[0];
                return (
                  <div
                    key={ord.id}
                    className="py-3.5 flex items-center justify-between gap-3 font-note text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-hand italic text-base text-[#540c19]">#{ord.code}</span>
                        <span className={`stamp ${stage.color}`}>{stage.label}</span>
                        <span className="stamp tilt-r-sm text-[var(--ink-faint)]">
                          {ord.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--ink-faint)] mt-1 truncate max-w-xs font-medium">
                        {ord.address || 'Takeaway counter pickup'} · {ord.lines.length} snacks
                      </p>
                    </div>

                    <span className="font-hand text-lg font-semibold text-[#681121] shrink-0">
                      ₹{ord.total}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pipeline snapshot — stamps across the bottom of the pad */}
          {recentOrders.length > 0 && (
            <div className="mt-5 pt-4 border-t border-dashed border-[var(--rule)]">
              <p className="font-note text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)] mb-2.5">
                Pipeline snapshot · latest {recentOrders.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stageCounts).map(([stageIdx, count]) => {
                  const stage = ORDER_STAGES[Number(stageIdx)] || ORDER_STAGES[0];
                  return (
                    <span key={stageIdx} className={`stamp ${stage.color}`}>
                      {stage.label} · {count}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Catalog by chapter */}
        <div className="sc-card p-5 sm:p-6 flex flex-col">
          <div className="mb-4">
            <SectionTitle eyebrow="Recipe cards" subtitle="SKU spread across menu chapters">
              Catalog by chapter
            </SectionTitle>
          </div>

          {catEntries.length === 0 ? (
            <p className="font-note text-xs text-[var(--ink-faint)] italic py-6 text-center">
              No categories written down yet.
            </p>
          ) : (
            <div className="space-y-3.5">
              {catEntries.map(([cat, count], i) => (
                <div key={cat}>
                  <div className="flex items-center justify-between font-note text-[11px] mb-1.5">
                    <span className="font-semibold text-[#540c19] capitalize">
                      {cat.replace(/-/g, ' ')}
                    </span>
                    <span className="font-hand font-semibold text-[#681121] text-sm">
                      {count} SKUs
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--paper-3)] border border-[var(--rule)] overflow-hidden">
                    <div
                      className="h-full sc-bar"
                      style={{
                        width: `${Math.max(8, (count / maxCat) * 100)}%`,
                        animationDelay: `${i * 90}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-6">
            <button
              onClick={() => onNavigate('products')}
              className="btn-outline w-full flex items-center justify-center gap-1.5 font-note text-xs font-semibold py-2.5"
            >
              Add more SKUs / flavours
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ============ Quick actions ============ */}
      <div className="sc-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#681121]/8 border-2 border-dashed border-[#681121]/30 text-[#681121] flex items-center justify-center shrink-0 tilt-l-sm">
            <Layers size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-hand italic text-xl text-[#540c19] leading-tight">Quick actions</p>
            <p className="font-note text-[11px] text-[var(--ink-faint)]">
              Jump straight into the pads you use most.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => onNavigate('products')} className="btn-ink flex items-center gap-1.5 font-note text-xs font-semibold uppercase tracking-[0.12em] px-4 py-2.5">
            <Package size={14} /> New Product
          </button>
          <button onClick={() => onNavigate('orders')} className="btn-outline flex items-center gap-1.5 font-note text-xs font-semibold px-4 py-2.5">
            <ShoppingBag size={14} /> Dispatch Queue
          </button>
          <button onClick={() => onNavigate('reservations')} className="btn-outline flex items-center gap-1.5 font-note text-xs font-semibold px-4 py-2.5">
            <Calendar size={14} /> Passes
          </button>
          <button onClick={() => onNavigate('users')} className="btn-outline flex items-center gap-1.5 font-note text-xs font-semibold px-4 py-2.5">
            <Users size={14} /> Customers
          </button>
        </div>
      </div>
    </div>
  );
}
