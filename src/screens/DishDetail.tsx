import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Share2,
  Zap,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useApp, activeDishes, type OptionChoice } from '../store';
import { dishById } from '../data/menu';
import { customizationsFor, pairingsFor } from '../data';
import { DishImg, Empty, VegBadge, RatingBadge, DeliveryPill } from '../ui';
import { formatINR } from '../lib/utils';

export default function DishDetail({ id }: { id: string }) {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const locationId = useApp((s) => s.locationId);
  const addToCart = useApp((s) => s.addToCart);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);

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
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center p-6 text-[#1E1E24]">
        <Empty
          title="Item Not Found"
          sub="This snack is currently out of stock or being freshly roasted."
          cta="Back to Menu"
          onCta={pop}
        />
      </div>
    );
  }

  const isFav = favorites.includes(dish.id);
  const pairings = pairingsFor(dish, activeDishes(locationId));

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
    <div className="min-h-screen bg-[#FDFBF7] pb-36 text-[#1E1E24]">
      {/* Top Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between p-4 sm:px-6 lg:px-8 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#e8dfcf] shadow-sm">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={pop}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBF7F0] text-[#1E1E24] border border-[#e5d8c3] hover:bg-[#f3ece0] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`${dish.name} — Sahi Crunch Bhopal`);
                alert('Link copied to clipboard!');
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(dish.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout (Desktop Side-by-Side, Mobile Stacked) */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* Left Column: Product Image */}
          <div className="md:sticky md:top-24">
            <div className="relative aspect-video md:aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 shadow-lg border border-slate-100">
              <DishImg name={dish.image} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <VegBadge />
                <DeliveryPill time="10 MINS" />
              </div>
              {dish.bestseller && (
                <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-md shadow">
                  BESTSELLER
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Details & Customizations */}
          <div className="space-y-5">
            <div className="bg-[#FBF7F0] rounded-3xl p-5 sm:p-6 border border-[#e5d8c3] shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E24] tracking-tight leading-tight">
                    {dish.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-2">
                    <RatingBadge rating="4.9" count="240+ ratings" />
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-bold text-slate-500">{dish.weight || '40g pack'}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 line-through block font-medium">
                    ₹{Math.round(dish.price * 1.25)}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#681121]">
                    {formatINR(dish.price)}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {dish.description}
              </p>

              {/* Quick Commerce Guarantees */}
              <div className="mt-5 pt-4 border-t border-[#e8dfcf] grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#FDFBF7] rounded-2xl p-3 border border-[#e5d8c3]">
                  <Clock size={18} className="mx-auto text-[#D48924] mb-1" />
                  <p className="text-xs font-bold text-[#1E1E24]">48h SLA</p>
                  <p className="text-[10px] text-slate-400">Baked-on stamp</p>
                </div>
                <div className="bg-[#FDFBF7] rounded-2xl p-3 border border-[#e5d8c3]">
                  <ShieldCheck size={18} className="mx-auto text-[#4E8B56] mb-1" />
                  <p className="text-xs font-bold text-[#1E1E24]">Clean Food</p>
                  <p className="text-[10px] text-slate-400">0% Preservatives</p>
                </div>
                <div className="bg-[#FDFBF7] rounded-2xl p-3 border border-[#e5d8c3]">
                  <Zap size={18} className="mx-auto text-[#D48924] mb-1" />
                  <p className="text-xs font-bold text-[#1E1E24]">Deck Roasted</p>
                  <p className="text-[10px] text-slate-400">Convection oven</p>
                </div>
              </div>

              {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#e8dfcf]">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#681121] mb-2">
                    Clean Ingredients
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dish.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="text-xs font-semibold bg-[#4E8B56]/10 text-[#4E8B56] border border-[#4E8B56]/30 px-3 py-1 rounded-xl"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customization Options */}
            {groups.length > 0 && (
              <div className="space-y-4">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-[#FBF7F0] rounded-3xl p-5 border border-[#e5d8c3] shadow-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-extrabold text-[#1E1E24] uppercase tracking-wide">
                        {group.label}
                      </h3>
                      {group.required && (
                        <span className="text-[10px] font-bold text-[#681121] bg-[#681121]/10 px-2.5 py-0.5 rounded-md border border-[#681121]/20">
                          Required
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {group.choices.map((choice) => {
                        const isChosen = (sel[group.id] ?? []).includes(choice.id);
                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() => toggle(group.id, choice.id, !!group.multi)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                              isChosen
                                ? 'border-[#681121] bg-[#681121]/10 font-bold text-[#681121] shadow-sm'
                                : 'border-[#e5d8c3] bg-[#FDFBF7] hover:border-[#D48924] text-[#1E1E24]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isChosen
                                    ? 'border-[#681121] bg-[#681121]'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <span className="text-xs sm:text-sm font-semibold">{choice.label}</span>
                            </div>

                            {choice.delta > 0 && (
                              <span className="text-xs font-bold text-[#681121]">
                                +{formatINR(choice.delta)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pairings */}
        {pairings.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-black text-[#1E1E24] mb-4">Frequently Bought Together</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pairings.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => push({ type: 'dish', id: p.id })}
                  className="bg-[#FBF7F0] rounded-3xl p-3 border border-[#e5d8c3] shadow-sm hover:shadow-card hover:border-[#D48924] transition-all cursor-pointer"
                >
                  <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#f3ece0] mb-2">
                    <DishImg name={p.image} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#1E1E24] truncate">{p.name}</p>
                  <p className="text-xs sm:text-sm font-black text-[#681121] mt-1">{formatINR(p.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Bar (Sticky & Centered on Desktop) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#e8dfcf] px-4 py-3 shadow-nav">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center bg-[#FBF7F0] border border-[#e5d8c3] rounded-2xl px-3 py-2">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="p-1 text-slate-600 hover:text-[#681121] rounded"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-black text-sm sm:text-base text-[#1E1E24]">{qty}</span>
            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="p-1 text-slate-600 hover:text-[#681121] rounded"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={add}
            className="flex-1 max-w-md flex items-center justify-between bg-[#681121] hover:bg-[#540c19] text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-[#681121]/25 active:scale-[0.99] transition-all"
          >
            <span>{added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}</span>
            <span>{formatINR(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
