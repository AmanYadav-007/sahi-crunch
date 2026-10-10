import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, Heart, Plus } from 'lucide-react';
import { useApp, activeDishes } from '../store';
import { categories, type Dish } from '../data/menu';
import { filters as FILTERS } from '../data';
import { formatINR, spiceLabel } from '../lib/utils';
import { DishImg, TabHeader } from '../ui';

export default function MenuScreen() {
  const locationId = useApp((s) => s.locationId);
  const push = useApp((s) => s.push);
  const addToCart = useApp((s) => s.addToCart);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);

  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [active, setActive] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const pool = useMemo(() => activeDishes(locationId), [locationId]);

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

  const count = results.length;

  return (
    <div className="safe-b pb-6">
      <TabHeader title="THE MENU" />

      {/* search + filter row */}
      <div className="topbar sticky top-0 z-20 mt-4 px-5 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => push({ type: 'search' })}
            data-cursor="SEARCH"
            className="chip h-11 w-full justify-start !text-ivory-faint"
          >
            <Search size={14} /> SEARCH DISH, INGREDIENT, MOOD…
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            aria-label="Filters"
            className={`chip relative h-11 w-11 shrink-0 justify-center !px-0 ${
              active.length ? 'chip-on' : ''
            }`}
          >
            <SlidersHorizontal size={15} />
            {active.length > 0 && <span className="count-badge absolute -right-1.5 -top-1.5">{active.length}</span>}
          </button>
        </div>

        {/* category chips */}
        <div className="no-bar mt-3 flex gap-2 overflow-x-auto pb-0.5">
          {[{ id: 'all', name: 'ALL' }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={`chip shrink-0 ${cat === c.id ? 'chip-on' : ''}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {q && (
          <div className="mt-2 flex items-center gap-2 border border-amber/50 px-3 py-2">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search…"
              className="flex-1 bg-transparent text-sm text-ivory outline-none"
            />
            <button type="button" onClick={() => setQ('')} aria-label="Clear" className="text-ivory-faint">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* active filter pills */}
      {active.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pt-3">
          {active.map((id) => (
            <button key={id} type="button" onClick={() => toggleFilter(id)} className="chip chip-on">
              {FILTERS.find((f) => f.id === id)?.label} <X size={11} />
            </button>
          ))}
        </div>
      )}

      {/* list */}
      <ul className="mt-2 px-5">
        {results.map((d) => (
          <MenuRow
            key={d.id}
            dish={d}
            onOpen={() => push({ type: 'dish', id: d.id })}
            onAdd={() => addToCart({ dishId: d.id, qty: 1, options: [] })}
            fav={favorites.includes(d.id)}
            onFav={() => toggleFavorite(d.id)}
          />
        ))}
      </ul>

      {results.length === 0 && (
        <div className="px-8 py-16 text-center">
          <p className="h2">NOTHING ON THIS PASS.</p>
          <p className="body mt-2">Try fewer filters, or search by ingredient.</p>
          <button
            type="button"
            onClick={() => {
              setActive([]);
              setCat('all');
              setQ('');
            }}
            className="btn-ghost mt-6 !py-3"
          >
            CLEAR EVERYTHING
          </button>
        </div>
      )}

      {/* filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <div className="scrim-dark fade-in absolute inset-0" onClick={() => setShowFilters(false)} aria-hidden />
          <div className="sheet sheet-up relative w-full max-w-[480px] pb-8">
            <div className="flex items-center justify-between px-5 py-4 hair-b">
              <h2 className="h3">FILTERS</h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                aria-label="Close"
                className="icon-btn"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFilter(f.id)}
                  className={`chip justify-center py-3 ${active.includes(f.id) ? 'chip-on' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 px-5">
              <button type="button" onClick={() => setActive([])} className="btn-ghost flex-1 !py-3">
                CLEAR
              </button>
              <button type="button" onClick={() => setShowFilters(false)} className="btn-solid flex-1 !py-3">
                SHOW {count} DISHES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuRow({
  dish,
  onOpen,
  onAdd,
  fav,
  onFav,
}: {
  dish: Dish;
  onOpen: () => void;
  onAdd: () => void;
  fav: boolean;
  onFav: () => void;
}) {
  return (
    <li className="hair-b">
      <div className="flex items-center gap-4 py-4">
        <button
          type="button"
          onClick={onOpen}
          data-cursor="VIEW"
          className="flex min-w-0 flex-1 items-center gap-4 text-left"
        >
          <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-ink-850">
            <DishImg name={dish.image} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 shrink-0 border ${dish.veg ? 'border-herb' : 'border-chili'}`} aria-hidden>
                <span className={`m-[2px] block h-1.5 w-1.5 rounded-full ${dish.veg ? 'bg-herb' : 'bg-chili'}`} />
              </span>
              {dish.bestseller && <span className="label gold">BESTSELLER</span>}
            </div>
            <h3 className="h3 mt-1 truncate">{dish.name}</h3>
            <p className="caption line-clamp-1">{dish.description}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="num gold">{formatINR(dish.price)}</span>
              <span className="eyebrow">
                {spiceLabel(dish.spiceLevel)}
                <span className="ml-1 text-chili">{'●'.repeat(dish.spiceLevel)}</span>
              </span>
            </div>
          </div>
        </button>
        <div className="flex shrink-0 flex-col items-center gap-3">
          <button
            type="button"
            onClick={onFav}
            aria-label={fav ? 'Remove favorite' : 'Save favorite'}
            className={fav ? 'text-chili' : 'text-ivory-faint'}
          >
            <Heart size={16} className={fav ? 'fill-chili' : ''} />
          </button>
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add ${dish.name}`}
            data-cursor="ADD"
            className="grid h-9 w-9 place-items-center hair-2 border text-ivory-dim transition-colors hover:border-amber hover:text-amber"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </li>
  );
}
