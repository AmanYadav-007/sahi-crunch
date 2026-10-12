import React, { useMemo, useState, useEffect } from 'react';
import { Search as SearchIcon, X, TrendingUp, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useApp, activeDishes } from '../store';
import { type Dish } from '../data/menu';
import { DishImg, VegBadge, RatingBadge } from '../ui';
import { formatINR } from '../lib/utils';

const POPULAR_SEARCHES = [
  'Bhopali Masala Makhana',
  'Shahi Nankhatai',
  'Ratlam Sev',
  'Peri Peri',
  'Salted Makhana',
  'Aloo Bhujiya',
  'Gift Box',
  'Cookies',
];

export default function Search() {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const locationId = useApp((s) => s.locationId);
  const addToCart = useApp((s) => s.addToCart);
  const cart = useApp((s) => s.cart);
  const setQty = useApp((s) => s.setQty);

  const [q, setQ] = useState('');

  // Always reset scroll to top immediately when Search screen opens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  const pool = useMemo(() => activeDishes(locationId), [locationId]);
  const needle = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!needle) return [];
    return pool.filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.description.toLowerCase().includes(needle) ||
        d.ingredients.some((i) => i.toLowerCase().includes(needle)) ||
        d.category.toLowerCase().includes(needle)
    );
  }, [pool, needle]);

  const cartQtyMap = useMemo(() => {
    const map: Record<string, { qty: number; key: string }> = {};
    cart.forEach((c) => {
      map[c.dishId] = { qty: (map[c.dishId]?.qty ?? 0) + c.qty, key: c.key };
    });
    return map;
  }, [cart]);

  return (
    <div className="min-h-screen bg-[var(--paper)] paper-grain pb-28 text-[var(--ink)]">
      {/* Search Header — writing a line in the kitchen log */}
      <header className="sticky top-0 z-30 bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--rule)] px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={pop}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--paper-2)] text-[#C45688] hover:bg-[var(--paper-3)] border border-[var(--rule)] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D86B9B]" />
          <input
            autoFocus
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for snacks, bakes, namkeen..."
            className="form-blank w-full pl-10 pr-9 py-2.5 font-note text-xs font-medium"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)] p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-4 space-y-5">
        {/* If no query: show trending chips */}
        {!needle ? (
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingUp size={14} className="text-[#D86B9B]" />
              <span className="font-note text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                What folks ask for most
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((item, i) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQ(item)}
                  className={`${i % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm'} hover:tilt-0 bg-[var(--paper-2)] paper-grain border-2 border-dashed border-[var(--rule)] px-3.5 py-2 rounded-xl font-note text-xs font-medium text-[var(--ink-soft)] hover:border-[#D86B9B] hover:text-[#C45688] transition-all duration-300`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-note text-xs font-medium text-[var(--ink-soft)]">
              {results.length} snacks found for &quot;{q}&quot;
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">

            {results.map((dish, i) => {
              const inCart = cartQtyMap[dish.id];
              const tilt = i % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm';

              return (
                <div
                  key={dish.id}
                  onClick={() => push({ type: 'dish', id: dish.id })}
                  className={`group flex items-center justify-between gap-3 bg-[var(--paper-2)] paper-grain p-3.5 rounded-3xl border border-[var(--rule)] shadow-[3px_4px_0_rgba(84,12,25,0.05),0_16px_30px_-22px_rgba(84,12,25,0.4)] cursor-pointer hover:border-[#D86B9B]/70 ${tilt} hover:tilt-0 transition-all duration-300`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Mini taped-in polaroid */}
                    <div className="w-16 h-16 shrink-0 bg-white p-1 rounded-lg border border-[var(--rule)] shadow-[2px_3px_0_rgba(84,12,25,0.08)]">
                      <div className="w-full h-full rounded-[4px] overflow-hidden bg-[var(--paper-3)]">
                        <DishImg name={dish.image} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <VegBadge />
                        <span className="font-hand text-lg text-[#8F2859] truncate leading-tight">{dish.name}</span>
                      </div>
                      <p className="font-note text-xs text-[var(--ink-soft)] line-clamp-1 mt-0.5">{dish.description}</p>
                      <p className="font-hand font-bold text-base text-[#C45688] mt-1">{formatINR(dish.price)}</p>
                    </div>
                  </div>

                  {inCart && inCart.qty > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="btn-ink flex items-center gap-2 rounded-xl px-2 py-1 font-note text-xs"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQty(inCart.key, inCart.qty - 1);
                        }}
                        className="p-1 hover:bg-white/15 rounded"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="font-semibold">{inCart.qty}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQty(inCart.key, inCart.qty + 1);
                        }}
                        className="p-1 hover:bg-white/15 rounded"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ) : !dish.available ? (
                    <span className="stamp shrink-0 text-[var(--ink-faint)] border-[var(--rule)]">
                      Sold out
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ dishId: dish.id, qty: 1, options: [] });
                      }}
                      className="btn-outline shrink-0 flex items-center gap-1 font-note text-xs font-semibold px-3 py-1.5"
                    >
                      <span>ADD</span>
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
