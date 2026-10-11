import React, { useEffect, useState, useMemo } from 'react';
import {
  ReceiptText,
  Clock,
  RotateCcw,
  ChevronRight,
  LogIn,
  Loader2,
  PackageCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  Flame,
  Search,
} from 'lucide-react';
import { useApp, lineTotal, type Order } from '../store';
import { dishById } from '../data/menu';
import { Empty, VegBadge } from '../ui';
import { formatINR } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { ordersApi } from '../lib/api';
import { useToast } from '../lib/ToastContext';

type FilterTab = 'all' | 'active' | 'completed';

export default function Orders() {
  const orders = useApp((s) => s.orders);
  const syncOrders = useApp((s) => s.syncOrders);
  const push = useApp((s) => s.push);
  const setTab = useApp((s) => s.setTab);
  const addToCart = useApp((s) => s.addToCart);
  const auth = useAuth();
  const { showSuccess } = useToast();

  const [fetching, setFetching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    return () => {
      mounted = false;
    };
  }, [auth.isLoggedIn, syncOrders]);

  const repeatOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.lines.forEach((l) => {
      addToCart({ dishId: l.dishId, qty: l.qty, options: l.options });
    });
    useApp.getState().setCartOpen(true);
    showSuccess(`Items from order ${order.code} added to your cart!`, 'Order Re-added');
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const isDelivered = o.status >= 6;
      if (activeFilter === 'active' && isDelivered) return false;
      if (activeFilter === 'completed' && !isDelivered) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCode = o.code.toLowerCase().includes(query);
        const matchesItem = o.lines.some((l) => {
          const d = dishById(l.dishId);
          return d?.name.toLowerCase().includes(query);
        });
        return matchesCode || matchesItem;
      }
      return true;
    });
  }, [orders, activeFilter, searchQuery]);

  const activeOrdersCount = orders.filter((o) => o.status < 6).length;
  const completedOrdersCount = orders.filter((o) => o.status >= 6).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-36 text-[#1E1E24]">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-b from-[#681121] to-[#781829] text-white pt-8 pb-14 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
        {/* Subtle royal pattern backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D48924_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FDFBF7]">
                Your Orders & Dispatches
              </h1>
              <p className="text-xs sm:text-sm text-orange-100/80 mt-1 max-w-lg font-medium leading-relaxed">
                Track small-batch roasted makhana & bakery deliveries live from our Bhopal oven hubs.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs">
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-amber-200">Active Tracking</span>
                <span className="font-black text-white text-sm">{activeOrdersCount} in progress</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#E2952A] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto -mt-7 space-y-5 relative z-20">
        {/* Guest Auth Callout */}
        {!auth.isLoggedIn && (
          <div className="bg-white rounded-3xl p-5 border border-[#e5d8c3] shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-[#681121]/10 text-[#681121] flex items-center justify-center font-black shrink-0">
                <LogIn size={20} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#1E1E24]">Sync your order history across devices</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Log in to link past orders, auto-sync live courier status, and earn Crunch Club points.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => auth.openLogin()}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#681121] text-white text-xs font-black rounded-xl hover:bg-[#540c19] transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-2.5 border border-[#e5d8c3] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'active', label: 'In Progress', count: activeOrdersCount },
                { id: 'completed', label: 'Delivered', count: completedOrdersCount },
              ] as const
            ).map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#681121] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#1E1E24] hover:bg-[#FBF7F0]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-60">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or item..."
              className="w-full bg-[#FBF7F0] border border-[#e5d8c3] rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium text-[#1E1E24] placeholder-slate-400 outline-none focus:border-[#681121] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content Area */}
        {fetching && orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#e5d8c3] flex flex-col items-center justify-center gap-3 text-slate-400 shadow-sm">
            <Loader2 size={28} className="animate-spin text-[#681121]" />
            <p className="text-xs font-extrabold text-[#1E1E24]">Fetching your kitchen tickets...</p>
            <p className="text-[11px] text-slate-400">Syncing with Sahi Crunch live cloud</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#e5d8c3] shadow-card text-center">
            <Empty
              title={searchQuery ? 'No Matching Orders' : activeFilter === 'active' ? 'No Orders Currently In Progress' : 'No Orders Placed Yet'}
              sub={searchQuery ? 'Try searching with a different order code or dish name.' : 'Explore our fresh roasted makhana, bhopali nankhatai & heritage namkeen batches.'}
              cta="Explore Menu"
              onCta={() => setTab('menu')}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((o) => {
              const isDelivered = o.status >= 6;
              const dateStr = new Date(o.placedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={o.id}
                  className="bg-white rounded-3xl border border-[#e5d8c3] shadow-card hover:shadow-float transition-all overflow-hidden"
                >
                  {/* Order Top Ribbon */}
                  <div className="p-4 sm:p-5 pb-3.5 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#f0e6d6]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                            isDelivered ? 'bg-[#4E8B56]/15 text-[#4E8B56]' : 'bg-[#D48924]/15 text-[#D48924]'
                          }`}
                        >
                          {isDelivered ? <PackageCheck size={20} /> : <Truck size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-[#1E1E24] tracking-tight">{o.code}</span>
                            <span
                              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                isDelivered
                                  ? 'bg-[#4E8B56]/15 text-[#4E8B56] border border-[#4E8B56]/30'
                                  : 'bg-[#D48924]/15 text-[#b87319] border border-[#D48924]/30 animate-pulse'
                              }`}
                            >
                              {isDelivered ? 'Delivered' : 'In Progress'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>Placed on {dateStr}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-base sm:text-lg font-black text-[#681121]">
                          {formatINR(o.total)}
                        </span>
                        <span className="text-[11px] font-bold text-[#D48924] flex items-center gap-1">
                          <Sparkles size={11} className="fill-[#D48924]" />
                          +{o.pointsEarned || Math.round(o.total / 10)} Crunch Pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4 sm:p-5 py-3.5 space-y-2 bg-[#FCFAF5]/50">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Ordered Items ({o.lines.reduce((acc, cur) => acc + cur.qty, 0)})
                    </div>

                    <div className="divide-y divide-[#f3ece0]">
                      {o.lines.map((l) => {
                        const d = dishById(l.dishId);
                        if (!d) return null;
                        return (
                          <div key={l.key} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 truncate max-w-[75%]">
                              <VegBadge />
                              <div className="truncate">
                                <span className="font-extrabold text-[#1E1E24] mr-1.5">{l.qty} ×</span>
                                <span className="font-bold text-slate-700">{d.name}</span>
                                {d.weight && (
                                  <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({d.weight})</span>
                                )}
                              </div>
                            </div>
                            <span className="font-black text-[#1E1E24]">{formatINR(lineTotal(l))}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery Destination Snippet */}
                    {o.address && (
                      <div className="pt-2 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#681121] shrink-0" />
                        <span className="truncate">{o.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3.5 sm:p-4 bg-white border-t border-[#e8dfcf] flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => push({ type: 'track', orderId: o.id })}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#FBF7F0] hover:bg-[#f3ece0] text-[#1E1E24] text-xs font-extrabold py-2.5 rounded-xl border border-[#e5d8c3] transition-colors active:scale-[0.99]"
                    >
                      <span>{isDelivered ? 'View Receipt & Details' : 'Live GPS & Tracking'}</span>
                      <ChevronRight size={14} className="text-slate-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => repeatOrder(o.id)}
                      className="flex items-center gap-1.5 bg-[#681121] hover:bg-[#540c19] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                    >
                      <RotateCcw size={13} />
                      <span>Reorder</span>
                    </button>
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
