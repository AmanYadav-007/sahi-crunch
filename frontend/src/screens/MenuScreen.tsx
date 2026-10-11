import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Heart,
  Plus,
  Minus,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useApp, activeDishes, activeCategories } from '../store';
import { type Dish } from '../data/menu';
import { filters as FILTERS } from '../data';
import { formatINR } from '../lib/utils';
import { DishImg, VegBadge, RatingBadge, DeliveryPill } from '../ui';

export default function MenuScreen() {
  const locationId = useApp((s) => s.locationId);
  const push = useApp((s) => s.push);
  const addToCart = useApp((s) => s.addToCart);
  const cart = useApp((s) => s.cart);
  const setQty = useApp((s) => s.setQty);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);

  // Store user feedback vote ('up' | 'down') per dishId
  const [votes, setVotes] = useState<Record<string, 'up' | 'down'>>({});

  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [active, setActive] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const pool = useMemo(() => activeDishes(locationId), [locationId]);

  // Live menu chapters — synced from the admin panel via /api/categories
  const allCategories = useApp((s) => s.categories);
  const categories = useMemo(
    () => activeCategories(locationId, allCategories),
    [locationId, allCategories]
  );

  const cartQtyMap = useMemo(() => {
    const map: Record<string, { qty: number; key: string }> = {};
    cart.forEach((c) => {
      map[c.dishId] = { qty: (map[c.dishId]?.qty ?? 0) + c.qty, key: c.key };
    });
    return map;
  }, [cart]);

  const results = useMemo(() => {
    let list = cat === 'all' ? pool : pool.filter((d) => d.category === cat);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(needle) ||
          d.description.toLowerCase().includes(needle) ||
          d.ingredients.some((i) => i.includes(needle)) ||
          d.category.replace('-', ' ').includes(needle)
      );
    }
    if (active.length) {
      const tests = FILTERS.filter((f) => active.includes(f.id)).map((f) => f.test);
      list = list.filter((d) => tests.every((t) => t(d)));
    }
    return list;
  }, [pool, cat, q, active]);

  const toggleFilter = (id: string) =>
    setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const handleAdd = (d: Dish, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ dishId: d.id, qty: 1, options: [] });
  };

  const handleIncrement = (d: Dish, key: string, currentQty: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQty(key, currentQty + 1);
  };

  const handleDecrement = (d: Dish, key: string, currentQty: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQty(key, Math.max(0, currentQty - 1));
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] paper-grain pb-36 text-[var(--ink)]">
      {/* Header Search & Category Filter — the top of a recipe card */}
      <header className="sticky top-0 lg:static z-20 bg-[var(--paper)] border-b border-[var(--rule)] px-4 sm:px-6 lg:px-10 xl:px-12 pt-3 pb-3 relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-[#681121]" aria-hidden="true" />
        <div className="w-full">
          {/* Search Input Bar — a blank on a form */}
          <div className="flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D48924]" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search dishes, flavours, spices..."
                className="form-blank w-full pl-8 pr-8 py-1.5 sm:py-2 font-note text-xs"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)] p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              title="Filters"
              className={`flex h-8 sm:h-9 w-8 sm:w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-colors ${
                active.length > 0
                  ? 'bg-[#681121]/10 border-[#681121] text-[#681121]'
                  : 'bg-[var(--paper-2)] border-dashed border-[var(--rule)] text-[var(--ink-soft)] hover:border-[#D48924]'
              }`}
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>

          {/* Category Pills — torn paper tabs */}
          <div className="no-scrollbar flex gap-2 sm:gap-3 overflow-x-auto pt-3 pb-1">
            {[{ id: 'all', name: 'All' }, ...categories].map((c) => {
              const isSelected = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className={`px-4 py-2 rounded-full font-note text-xs font-medium whitespace-nowrap transition-all border-2 ${
                    isSelected
                      ? 'bg-[#681121] border-[#681121] text-[#FDFBF7] shadow-[2px_3px_0_rgba(36,4,9,0.3)]'
                      : 'bg-[var(--paper-2)] border-dashed border-[var(--rule)] text-[var(--ink-soft)] hover:border-[#D48924]'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {showFilters && (
            <div className="mt-2.5 pt-2 border-t border-dashed border-[var(--rule)] flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const isOn = active.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFilter(f.id)}
                    className={`font-note text-xs font-medium px-3 py-1 rounded-xl border-2 transition-colors ${
                      isOn
                        ? 'bg-[#4E8B56] border-[#4E8B56] text-white'
                        : 'bg-[var(--paper-2)] border-dashed border-[var(--rule)] text-[var(--ink-soft)] hover:border-[#4E8B56]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Product List Responsive Grid: Full width across screens */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {results.map((dish, i) => {
            const inCart = cartQtyMap[dish.id];
            const isFav = favorites.includes(dish.id);
            const tilt = ['tilt-l-sm', 'tilt-r-sm', 'tilt-r-sm', 'tilt-l-sm'][i % 4];

            return (
              <div
                key={dish.id}
                onClick={() => push({ type: 'dish', id: dish.id })}
                className={`group relative flex items-center justify-between gap-3.5 sm:gap-4 bg-[var(--paper-2)] paper-grain p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-[var(--rule)] shadow-[3px_4px_0_rgba(84,12,25,0.05),0_14px_26px_-20px_rgba(84,12,25,0.4)] hover:shadow-lg hover:border-[#D48924]/60 ${tilt} hover:tilt-0 transition-all duration-300 cursor-pointer`}
              >
                {/* Left Info Column: Name -> Price -> Thumbs Feedback */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                  <div>
                    <h3 className="font-hand font-bold text-xl text-[#540c19] tracking-tight leading-snug line-clamp-2 group-hover:text-[#681121] transition-colors">
                      {dish.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="font-hand font-bold text-xl sm:text-2xl text-[#681121] tracking-tight">
                        {formatINR(dish.price)}
                      </span>
                      <span className="font-note text-xs text-[var(--ink-faint)] font-medium line-through">
                        ₹{Math.round(dish.price * 1.25)}
                      </span>
                    </div>
                  </div>

                  {/* Feedback: Thumbs Up / Down Buttons */}
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <span className="font-note text-[11px] font-medium text-[var(--ink-faint)] mr-0.5">Feedback:</span>
                    <button
                      type="button"
                      aria-label="Thumbs Up"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVotes((prev) => ({
                          ...prev,
                          [dish.id]: prev[dish.id] === 'up' ? (undefined as any) : 'up',
                        }));
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-medium transition-all active:scale-90 ${
                        votes[dish.id] === 'up'
                          ? 'bg-[#4E8B56]/12 text-[#3d7044] border-[#4E8B56]/50 shadow-sm'
                          : 'bg-[var(--paper-2)] text-[var(--ink-faint)] border-[var(--rule)] hover:text-[#3d7044] hover:border-[#4E8B56]/40'
                      }`}
                    >
                      <ThumbsUp
                        size={12}
                        className={votes[dish.id] === 'up' ? 'fill-[#4E8B56]' : ''}
                      />
                    </button>

                    <button
                      type="button"
                      aria-label="Thumbs Down"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVotes((prev) => ({
                          ...prev,
                          [dish.id]: prev[dish.id] === 'down' ? (undefined as any) : 'down',
                        }));
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-medium transition-all active:scale-90 ${
                        votes[dish.id] === 'down'
                          ? 'bg-[#b91c1c]/12 text-[#b91c1c] border-[#b91c1c]/50 shadow-sm'
                          : 'bg-[var(--paper-2)] text-[var(--ink-faint)] border-[var(--rule)] hover:text-[#b91c1c] hover:border-[#b91c1c]/40'
                      }`}
                    >
                      <ThumbsDown
                        size={12}
                        className={votes[dish.id] === 'down' ? 'fill-[#b91c1c]' : ''}
                      />
                    </button>
                  </div>
                </div>

                {/* Right Column: Square Image with Like button & Overlapping/Embedded ADD Button */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[var(--paper-3)] border border-[var(--rule)]">
                    <DishImg
                      name={dish.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <button
                      type="button"
                      aria-label="Add to favorites"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(dish.id);
                      }}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--paper-2)]/90 backdrop-blur-sm shadow text-[var(--ink-faint)] hover:text-[#681121] hover:bg-white active:scale-90 transition-all"
                    >
                      <Heart
                        size={14}
                        className={isFav ? 'fill-[#681121] text-[#681121]' : ''}
                      />
                    </button>
                  </div>

                  {/* ADD / Quantity Stepper Button floating neatly over bottom of image */}
                  <div className="-mt-4 z-10 w-24 sm:w-26">
                    {inCart && inCart.qty > 0 ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-between bg-[#4E8B56] text-white rounded-xl px-2.5 py-1.5 shadow-md font-note font-semibold text-xs"
                      >
                        <button
                          type="button"
                          onClick={(e) => handleDecrement(dish, inCart.key, inCart.qty, e)}
                          className="p-0.5 hover:bg-[#3d7044] rounded active:scale-90 transition-transform"
                        >
                          <Minus size={13} strokeWidth={3} />
                        </button>
                        <span className="font-note font-semibold">{inCart.qty}</span>
                        <button
                          type="button"
                          onClick={(e) => handleIncrement(dish, inCart.key, inCart.qty, e)}
                          className="p-0.5 hover:bg-[#3d7044] rounded active:scale-90 transition-transform"
                        >
                          <Plus size={13} strokeWidth={3} />
                        </button>
                      </div>
                    ) : !dish.available ? (
                      <span className="stamp w-full justify-center py-1.5 text-[var(--ink-faint)] border-[var(--rule)]">
                        Sold out
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleAdd(dish, e)}
                        className="btn-outline w-full flex items-center justify-center gap-1 font-note text-xs font-semibold py-1.5"
                      >
                        <span>ADD</span>
                        <Plus size={13} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
