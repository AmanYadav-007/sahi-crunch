import { useMemo, useState } from 'react';
import { Search as SearchIcon, X, TrendingUp, Flame } from 'lucide-react';
import { useApp, activeDishes } from '../store';
import { type Dish } from '../data/menu';
import { intentMap, cravings } from '../data';
import { Screen, DishImg } from '../ui';
import { formatINR, spiceLabel } from '../lib/utils';

const TRENDING = ['biryani', 'paneer tikka', 'spicy', 'dessert', 'cold coffee', 'bestseller', 'veg', 'pizza'];

const CHIPS = ['I’M FEELING SPICY', 'SOMETHING LIGHT', 'FEED THE FAMILY', 'SWEET TOOTH', 'ONLY VEG', 'CHEF’S SPECIAL'];
const chipQuery: Record<string, string> = {
  'I’M FEELING SPICY': 'spicy',
  'SOMETHING LIGHT': 'light',
  'FEED THE FAMILY': 'bestseller',
  'SWEET TOOTH': 'sweet',
  'ONLY VEG': 'veg',
  'CHEF’S SPECIAL': 'bestseller',
};

export default function Search() {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const locationId = useApp((s) => s.locationId);
  const [q, setQ] = useState('');

  const pool = useMemo(() => activeDishes(locationId), [locationId]);
  const needle = q.trim().toLowerCase();

  const intent = needle ? intentMap.find((m) => m.keys.some((k) => needle.includes(k))) : undefined;
  const craving = needle ? cravings.find((c) => c.label.toLowerCase().includes(needle)) : undefined;

  const results = useMemo(() => {
    if (!needle) return [];
    const c = craving?.test ?? intent?.test;
    return pool
      .filter((d) => {
        const text =
          d.name.toLowerCase().includes(needle) ||
          d.description.toLowerCase().includes(needle) ||
          d.ingredients.some((i) => i.toLowerCase().includes(needle)) ||
          d.category.replace('-', ' ').includes(needle);
        return text || (c ? c(d) : false);
      })
      .slice(0, 24);
  }, [pool, needle, intent, craving]);

  const banner = needle
    ? craving
      ? `POURING A ${craving.label} SPREAD`
      : intent
        ? 'TUNED TO YOUR INTENT — FILTERING BY FEELING'
        : `${results.length} MATCH${results.length === 1 ? '' : 'ES'} ON THE PASS`
    : '';

  return (
    <Screen bare>
      <div className="min-h-[100dvh] pb-10">
        {/* search bar */}
        <header className="topbar safe-t sticky top-0 z-20 flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={pop}
            aria-label="Back"
            className="label shrink-0 text-ivory-faint transition-colors hover:text-amber"
          >
            BACK
          </button>
          <div className="hair-2 chip h-11 w-full justify-start !px-3 focus-within:border-amber">
            <SearchIcon size={15} className="shrink-0 text-amber" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the house…"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-ivory outline-none placeholder:text-ivory-faint"
            />
            {q && (
              <button type="button" aria-label="Clear" onClick={() => setQ('')} className="text-ivory-faint">
                <X size={15} />
              </button>
            )}
          </div>
        </header>

        <div className="px-5 pt-5">
          {!needle && (
            <>
              <section>
                <h2 className="eyebrow mb-3">TAP A FEELING</h2>
                <div className="flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setQ(chipQuery[c] ?? c.toLowerCase())}
                      className="chip chip-on"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-7">
                <h2 className="eyebrow mb-3 flex items-center gap-2">
                  <TrendingUp size={13} /> TRENDING TONIGHT
                </h2>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQ(t)}
                      className="chip"
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-7">
                <h2 className="eyebrow mb-3">TRY THE NATURAL LANGUAGE</h2>
                <p className="card-muted body p-4">
                  “something spicy and light” · “best dessert” · “under 400” · “only veg for four” — write it the way
                  you’d say it to the waiter.
                </p>
              </section>
            </>
          )}

          {needle && (
            <>
              <p className="fade-in label gold">{banner}</p>

              {results.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="h2">THE PASS CAME BACK EMPTY.</p>
                  <p className="body mt-2">
                    Try a dish name, an ingredient (“kasundi”), or a feeling (“spicy”).
                  </p>
                  <button type="button" onClick={() => setQ('')} className="btn-ghost mt-6 !py-3">
                    CLEAR SEARCH
                  </button>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {results.map((d) => (
                    <ResultRow key={d.id} dish={d} onOpen={() => push({ type: 'dish', id: d.id })} />
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}

function ResultRow({ dish, onOpen }: { dish: Dish; onOpen: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        data-cursor="VIEW"
        className="card flex w-full items-center gap-3.5 p-3 text-left transition-colors hover:border-amber/40"
      >
        <DishImg name={dish.image} className="h-16 w-16 shrink-0 object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 border ${dish.veg ? 'border-herb' : 'border-chili'}`}>
              <span className={`m-[2px] block h-1.5 w-1.5 rounded-full ${dish.veg ? 'bg-herb' : 'bg-chili'}`} />
            </span>
            {dish.bestseller && <span className="label gold">BESTSELLER</span>}
            {dish.spiceLevel >= 3 && <Flame size={12} className="text-chili" />}
          </div>
          <h3 className="h3 mt-1 truncate">{dish.name}</h3>
          <p className="caption truncate">{dish.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="num gold block">{formatINR(dish.price)}</span>
          <span className="eyebrow">{spiceLabel(dish.spiceLevel)}</span>
        </div>
      </button>
    </li>
  );
}

