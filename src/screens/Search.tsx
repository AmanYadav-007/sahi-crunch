import React, { useMemo, useState } from 'react';
import { Search as SearchIcon, X, TrendingUp, Sparkles, Plus, Minus, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FDFBF7] pb-28 text-[#1E1E24]">
      {/* Search Header */}
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#e5d8c3] px-4 py-3 shadow-sm flex items-center gap-3">
        <button
          type="button"
          onClick={pop}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBF7F0] text-[#1E1E24] hover:bg-[#e5d8c3]/40 border border-[#e5d8c3]"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#681121]" />
          <input
            autoFocus
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for snacks, bakes, namkeen..."
            className="w-full bg-[#FBF7F0] border border-[#e5d8c3] rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold text-[#1E1E24] placeholder-[#1E1E24]/40 outline-none focus:border-[#681121] focus:bg-white"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E24]/50 p-1"
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
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#1E1E24]/60 tracking-wider mb-3">
              <TrendingUp size={14} className="text-[#681121]" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQ(item)}
                  className="bg-[#FBF7F0] border border-[#e5d8c3] px-3.5 py-2 rounded-xl text-xs font-bold text-[#1E1E24] hover:border-[#681121] hover:text-[#681121] transition-colors shadow-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#1E1E24]/70">
              {results.length} snacks found for &quot;{q}&quot;
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">

            {results.map((dish) => {
              const inCart = cartQtyMap[dish.id];

              return (
                <div
                  key={dish.id}
                  onClick={() => push({ type: 'dish', id: dish.id })}
                  className="flex items-center justify-between gap-3 bg-[#FBF7F0] p-3.5 rounded-3xl border border-[#e5d8c3] shadow-card cursor-pointer hover:border-[#681121]/40 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#e5d8c3]/30 shrink-0">
                      <DishImg name={dish.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <VegBadge />
                        <span className="font-bold text-sm text-[#1E1E24] truncate">{dish.name}</span>
                      </div>
                      <p className="text-xs text-[#1E1E24]/60 line-clamp-1 mt-0.5">{dish.description}</p>
                      <p className="text-xs font-black text-[#681121] mt-1">{formatINR(dish.price)}</p>
                    </div>
                  </div>

                  {inCart && inCart.qty > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 bg-[#681121] text-white rounded-xl px-2 py-1 shadow-sm font-extrabold text-xs"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQty(inCart.key, inCart.qty - 1);
                        }}
                        className="p-1 hover:bg-[#540c19] rounded"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="font-bold">{inCart.qty}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQty(inCart.key, inCart.qty + 1);
                        }}
                        className="p-1 hover:bg-[#540c19] rounded"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ dishId: dish.id, qty: 1, options: [] });
                      }}
                      className="flex items-center gap-1 bg-[#FDFBF7] hover:bg-[#681121] hover:text-white text-[#681121] border-2 border-[#681121] font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm transition-colors"
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
