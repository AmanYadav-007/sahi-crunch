import { useMemo, useState } from 'react';
import { ArrowLeft, Heart, Minus, Plus, Flame, Leaf, Share2 } from 'lucide-react';
import { useApp, activeDishes, type OptionChoice } from '../store';
import { dishById, categoryById } from '../data/menu';
import { customizationsFor, pairingsFor } from '../data';
import { DishImg, Empty, Eyebrow } from '../ui';
import { formatINR, spiceLabel } from '../lib/utils';

export default function DishDetail({ id }: { id: string }) {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const locationId = useApp((s) => s.locationId);
  const addToCart = useApp((s) => s.addToCart);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);
  const vegMode = useApp((s) => s.profile.vegMode);

  const dish = dishById(id);
  const groups = useMemo(() => (dish ? customizationsFor(dish) : []), [dish]);

  const firstOf = () =>
    Object.fromEntries(
      groups.filter((g) => g.required).map((g) => [g.id, [g.choices[0].id]])
    ) as Record<string, string[]>;

  const [sel, setSel] = useState<Record<string, string[]>>(firstOf);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);

  if (!dish) {
    return (
      <Screenish onBack={pop}>
        <Empty title="OFF THE MENU" sub="This dish has left the pass for now." cta="BACK TO MENU" onCta={pop} />
      </Screenish>
    );
  }

  const category = categoryById(dish.category);
  const isFav = favorites.includes(dish.id);
  const pairings = pairingsFor(dish, activeDishes(locationId)).filter((p) => p.veg || !vegMode);

  const chosen: OptionChoice[] = groups.flatMap((g) =>
    (sel[g.id] ?? []).map((cid) => {
      const c = g.choices.find((x) => x.id === cid)!;
      return { group: g.label, choice: c.label, delta: c.delta };
    })
  );
  const delta = chosen.reduce((n, o) => n + o.delta, 0);
  const unit = dish.price + delta;
  const total = unit * qty;

  const toggle = (gid: string, cid: string, multi: boolean) =>
    setSel((s) => {
      const cur = s[gid] ?? [];
      if (multi) {
        return { ...s, [gid]: cur.includes(cid) ? cur.filter((x) => x !== cid) : [...cur, cid] };
      }
      return { ...s, [gid]: [cid] };
    });

  const add = () => {
    addToCart({ dishId: dish.id, qty, options: chosen, note: note.trim() || undefined });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="screen-in min-h-[100dvh] pb-32">
      {/* hero */}
      <div className="relative h-[52vh] min-h-[320px] overflow-hidden">
        <DishImg name={dish.image} className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-b absolute inset-0" />
        <div className="grain absolute inset-0" />

        <div className="safe-t absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3">
          <button
            type="button"
            onClick={pop}
            aria-label="Back"
            data-cursor="BACK"
            className="glass grid h-10 w-10 place-items-center rounded-full text-ivory"
          >
            <ArrowLeft size={17} />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Share"
              onClick={() => {
                navigator.clipboard?.writeText(`${dish.name} · ${formatINR(dish.price)} — The Gharelu Hub`).catch(() => {});
                setAdded(false);
              }}
              className="glass grid h-10 w-10 place-items-center rounded-full text-ivory"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              aria-label="Favorite"
              onClick={() => toggleFavorite(dish.id)}
              className={`glass grid h-10 w-10 place-items-center rounded-full ${isFav ? 'text-chili' : 'text-ivory'}`}
            >
              <Heart size={16} className={isFav ? 'fill-chili' : ''} />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-5 bottom-5">
          <Eyebrow>{category?.eyebrow ?? 'OFF-MENU'}</Eyebrow>
          <div className="mt-2 flex items-start justify-between gap-3">
            <h1 className="h2 max-w-[70%] leading-tight">{dish.name}</h1>
            <span className="num gold shrink-0 pt-2 text-2xl">{formatINR(dish.price)}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`flex items-center gap-1.5 border px-2 py-1 label ${dish.veg ? 'border-herb text-herb' : 'border-chili text-chili'}`}>
              <Leaf size={11} /> {dish.veg ? 'VEG' : 'NON-VEG'}
            </span>
            <span className="label flex items-center gap-1.5 text-ivory-dim">
              <Flame size={12} className="text-chili" />
              {spiceLabel(dish.spiceLevel)}
              <span className="text-chili">{'●'.repeat(dish.spiceLevel)}</span>
            </span>
            {dish.bestseller && <span className="label gold">BESTSELLER</span>}
          </div>
        </div>
      </div>

      {/* story */}
      <section className="gut pt-6">
        <p className="body">{dish.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {dish.ingredients.map((i) => (
            <span key={i} className="chip">
              {i}
            </span>
          ))}
        </div>
        {!dish.available && (
          <p className="mt-4 border border-chili/40 bg-chili/10 px-4 py-3 label text-chili">
            NOT ON THE PASS TODAY — ASK THE KITCHEN WHEN IT RETURNS.
          </p>
        )}
      </section>

      {/* customizations */}
      {groups.length > 0 && (
        <section className="sect gut space-y-6">
          {groups.map((g) => {
            const multi = !!g.multi;
            return (
              <div key={g.id}>
                <div className="hair-b mb-3 flex items-baseline justify-between pb-2">
                  <h2 className="label text-ivory">{g.label}</h2>
                  <span className="eyebrow">{multi ? 'CHOOSE ANY' : 'CHOOSE ONE'}</span>
                </div>
                <div className={`grid gap-2 ${multi && g.choices.length > 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {g.choices.map((c) => {
                    const on = (sel[g.id] ?? []).includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggle(g.id, c.id, multi)}
                        aria-pressed={on}
                        className={`choice ${on ? 'choice-on' : ''}`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`grid h-4 w-4 shrink-0 place-items-center border ${
                              on ? 'border-amber' : 'hair-2'
                            } ${multi ? '' : 'rounded-full'}`}
                          >
                            {on && <span className={`h-2 w-2 bg-amber ${multi ? '' : 'rounded-full'}`} />}
                          </span>
                          <span>{c.label}</span>
                        </span>
                        {c.delta > 0 && <span className="num gold text-[13px]">+{c.delta}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* note */}
      <section className="sect gut">
        <h2 className="mb-2 label text-ivory">NOTE FOR THE KITCHEN</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={140}
          placeholder="Less oil, no coriander, extra lime…"
          className="field w-full resize-none"
        />
        <span className="eyebrow mt-1 block text-right">{note.length}/140</span>
      </section>

      {/* pairings */}
      {pairings.length > 0 && (
        <section className="sect">
          <div className="mb-3 flex items-baseline justify-between px-5">
            <h2 className="label text-ivory">PAIR IT WITH</h2>
            <span className="eyebrow">THE SOMMELIER OF THE PASS</span>
          </div>
          <div className="no-bar flex gap-3 overflow-x-auto px-5 pb-1">
            {pairings.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => push({ type: 'dish', id: p.id })}
                className="w-36 shrink-0 text-left"
              >
                <div className="relative aspect-square overflow-hidden hair-all">
                  <DishImg name={p.image} className="h-full w-full object-cover" />
                  <div className="scrim-soft absolute inset-0" />
                </div>
                <span className="body-b mt-2 block truncate">{p.name}</span>
                <span className="num gold text-xs">{formatINR(p.price)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* sticky add bar */}
      <div
        className="actionbar fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-4 py-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
      >
        <div className="flex items-center gap-3">
          <div className="hair-2 flex items-center gap-3 border px-3 py-2.5">
            <button type="button" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-ivory-dim">
              <Minus size={15} />
            </button>
            <span className="num w-5 text-center text-ivory">{qty}</span>
            <button type="button" aria-label="Increase" onClick={() => setQty((q) => Math.min(20, q + 1))} className="text-ivory-dim">
              <Plus size={15} />
            </button>
          </div>
          <button
            type="button"
            onClick={add}
            disabled={!dish.available}
            data-cursor="ADD"
            className={`flex flex-1 items-center justify-between gap-3 px-5 py-3.5 transition-all duration-300 disabled:opacity-40 ${
              added ? 'bg-herb text-ink-950' : 'btn-solid'
            }`}
          >
            <span>{added ? 'ADDED TO THE TABLE' : 'ADD TO TABLE'}</span>
            <span className="num">{formatINR(total)}</span>
          </button>
        </div>
        {delta > 0 && (
          <p className="eyebrow mt-2 text-center">
            BASE {formatINR(dish.price)} + OPTIONS {formatINR(delta)} = {formatINR(unit)} EACH
          </p>
        )}
      </div>
    </div>
  );
}

function Screenish({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return (
    <div className="screen-in min-h-[100dvh] pt-16">
      <button type="button" onClick={onBack} className="btn-ghost mx-5 !py-2.5">
        ← BACK
      </button>
      {children}
    </div>
  );
}
