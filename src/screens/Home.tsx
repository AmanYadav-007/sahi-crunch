import { useMemo, useState } from 'react';
import { MapPin, ShoppingBag, CalendarDays, BookOpen, Tag, ChevronRight, Heart, Star } from 'lucide-react';
import { useApp, activeDishes, tierOf } from '../store';
import { categories, dishById, type Dish } from '../data/menu';
import { signatures } from '../data/content';
import { locations } from '../data/locations';
import { cravings, hourLabel, offersFor, TIERS } from '../data';
import { Eyebrow, SectionTitle, DishImg, Pill } from '../ui';
import { formatINR } from '../lib/utils';

const QUICK = [
  { id: 'order', label: 'ORDER FOOD', Icon: ShoppingBag },
  { id: 'reserve', label: 'RESERVE TABLE', Icon: CalendarDays },
  { id: 'menu', label: 'VIEW MENU', Icon: BookOpen },
  { id: 'offers', label: 'OFFERS', Icon: Tag },
] as const;

export default function Home() {
  const profile = useApp((s) => s.profile);
  const locationId = useApp((s) => s.locationId);
  const push = useApp((s) => s.push);
  const setTab = useApp((s) => s.setTab);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const addToCart = useApp((s) => s.addToCart);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);
  const orders = useApp((s) => s.orders);
  const points = useApp((s) => s.points);

  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const pool = useMemo(() => activeDishes(locationId), [locationId]);

  const [craving, setCraving] = useState(cravings[0]);
  const cravingDishes = pool.filter(craving.test).slice(0, 6);

  const sigDishes = signatures
    .map((s) => dishById(s.dishId))
    .filter(Boolean)
    .slice(0, 4) as Dish[];

  const special = pool.find((d) => d.bestseller) ?? pool[0];
  const tier = TIERS[tierOf(points)];
  const usuals = (orders[0]?.lines.map((l) => dishById(l.dishId)).filter(Boolean) ?? []) as Dish[];

  const quick = (id: (typeof QUICK)[number]['id']) => {
    if (id === 'order') setCartOpen(true);
    if (id === 'reserve') push({ type: 'reserve' });
    if (id === 'menu') setTab('menu');
    if (id === 'offers') push({ type: 'offers' });
  };

  return (
    <div className="safe-b pb-8">
      {/* ---- header ---- */}
      <header className="safe-t flex items-center justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <span className="eyebrow block">
            {hourLabel()}
            {profile.name ? `, ${profile.name.toUpperCase()}` : ''}
          </span>
          <button
            type="button"
            onClick={() => push({ type: 'location' })}
            data-cursor="SWITCH"
            className="chip chip-on mt-1.5 max-w-full"
          >
            <MapPin size={12} />
            <span className="truncate">
              {branch.area.toUpperCase()} · {branch.city.toUpperCase()}
            </span>
            <ChevronRight size={12} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => push({ type: 'loyalty' })}
          data-cursor="CLUB"
          className="chip shrink-0"
        >
          <Star size={12} className="fill-amber text-amber" />
          {points} PTS
        </button>
      </header>

      {/* ---- cinematic hero ---- */}
      <section className="relative mt-5 h-[46vh] min-h-[340px] overflow-hidden">
        <DishImg name={special?.image ?? 'in-03'} className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-b absolute inset-0" />
        <div className="grain absolute inset-0" />

        <div className="absolute inset-x-5 bottom-5">
          <Eyebrow>SIGNATURE DISH</Eyebrow>
          <h1 className="h-hero mt-3">
            MADE FOR
            <br />
            <span className="text-amber">THE MOMENT.</span>
          </h1>
          {special && (
            <div className="mt-3 flex items-center gap-3">
              <span className="body">{special.name}</span>
              <span className="num gold">{formatINR(special.price)}</span>
            </div>
          )}
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={() => setCartOpen(true)} className="btn-solid flex-1 !py-3.5">
              ORDER NOW
            </button>
            <button type="button" onClick={() => push({ type: 'reserve' })} className="btn-ghost !py-3.5">
              RESERVE TABLE
            </button>
          </div>
        </div>
      </section>

      {/* ---- quick actions ---- */}
      <section className="sect gut grid grid-cols-4 gap-2">
        {QUICK.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => quick(id)}
            data-cursor="GO"
            className="card flex flex-col items-center gap-2 py-4 transition-colors duration-300 hover:bg-[rgba(241,234,221,0.075)] active:scale-95"
          >
            <Icon size={18} className="gold" strokeWidth={1.6} />
            <span className="label text-center leading-tight text-ivory-dim">{label}</span>
          </button>
        ))}
      </section>

      {/* ---- your usuals ---- */}
      {usuals.length > 0 && (
        <section className="sect">
          <SectionTitle>YOUR USUALS</SectionTitle>
          <div className="no-bar flex gap-3 overflow-x-auto px-5 pb-1">
            {usuals.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => push({ type: 'dish', id: d.id })}
                className="card flex w-44 shrink-0 items-center gap-3 p-2 text-left transition-colors hover:bg-[rgba(241,234,221,0.075)]"
              >
                <DishImg name={d.image} className="h-12 w-12 shrink-0 object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-ivory">{d.name}</span>
                  <span className="num gold text-xs">{formatINR(d.price)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ---- signatures ---- */}
      <section className="sect">
        <SectionTitle action={<span className="eyebrow">SWIPE</span>}>SIGNATURES</SectionTitle>
        <div className="no-bar flex snap-x gap-4 overflow-x-auto px-5 pb-1">
          {sigDishes.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => push({ type: 'dish', id: d.id })}
              data-cursor="VIEW"
              className="group relative h-72 w-56 shrink-0 snap-start overflow-hidden text-left hair-all"
            >
              <DishImg
                name={d.image}
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-105"
              />
              <div className="scrim-b absolute inset-0" />
              <div className="absolute inset-x-3 bottom-3">
                <span className="h3 block">{d.name}</span>
                <span className="mt-1 flex items-center justify-between">
                  <span className="num gold">{formatINR(d.price)}</span>
                  <Heart
                    size={16}
                    className={favorites.includes(d.id) ? 'fill-chili text-chili' : 'text-ivory/60'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(d.id);
                    }}
                  />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ---- explore by craving ---- */}
      <section className="sect">
        <SectionTitle>EXPLORE BY CRAVING</SectionTitle>
        <div className="no-bar flex gap-2 overflow-x-auto px-5 pb-1">
          {cravings.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCraving(c)}
              className={`chip shrink-0 ${craving.id === c.id ? 'chip-on' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="no-bar mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {cravingDishes.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => push({ type: 'dish', id: d.id })}
              className="w-36 shrink-0 text-left"
            >
              <div className="relative aspect-square overflow-hidden hair-all">
                <DishImg name={d.image} className="h-full w-full object-cover" />
                <div className="scrim-soft absolute inset-0" />
                <span className="num gold absolute bottom-2 left-2 text-sm">{formatINR(d.price)}</span>
              </div>
              <span className="h4 mt-2 block truncate">{d.name}</span>
            </button>
          ))}
          {cravingDishes.length === 0 && (
            <p className="eyebrow py-6">NOTHING IN THIS MOOD AT THIS ROOM YET.</p>
          )}
        </div>
      </section>

      {/* ---- today's special ---- */}
      {special && (
        <section className="sect gut">
          <SectionTitle>TODAY’S SPECIAL</SectionTitle>
          <button
            type="button"
            onClick={() => push({ type: 'dish', id: special.id })}
            className="card-amber flex w-full overflow-hidden text-left transition-colors hover:bg-[rgba(230,167,86,0.16)]"
          >
            <div className="relative h-32 w-32 shrink-0 overflow-hidden">
              <DishImg name={special.image} className="h-full w-full object-cover" />
              <div className="scrim-soft absolute inset-0" />
            </div>
            <div className="min-w-0 flex-1 p-4">
              <div className="flex items-center gap-2">
                <Pill tone="amber">BESTSELLER</Pill>
              </div>
              <h3 className="h3 mt-2 truncate">{special.name}</h3>
              <p className="caption mt-1 line-clamp-2">{special.description}</p>
              <span className="num gold mt-2 block text-lg">{formatINR(special.price)}</span>
            </div>
          </button>
        </section>
      )}

      {/* ---- discover the restaurant ---- */}
      <section className="sect gut">
        <SectionTitle>DISCOVER THE RESTAURANT</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => push({ type: 'search' })}
            className="relative h-32 overflow-hidden text-left hair-all"
          >
            <DishImg name="chef-04" className="h-full w-full object-cover" />
            <div className="scrim-soft absolute inset-0" />
            <span className="absolute bottom-3 left-3 h3">
              MEET THE CHEF
            </span>
          </button>
          <button
            type="button"
            onClick={() => push({ type: 'offers' })}
            className="relative h-32 overflow-hidden text-left hair-all"
          >
            <DishImg name="fire-01" className="h-full w-full object-cover" />
            <div className="scrim-soft absolute inset-0" />
            <span className="absolute bottom-3 left-3 h3">
              STORIES & OFFERS
            </span>
          </button>
        </div>
      </section>

      {/* ---- nearby locations ---- */}
      <section className="sect">
        <SectionTitle>NEARBY LOCATIONS</SectionTitle>
        <div className="no-bar flex gap-3 overflow-x-auto px-5 pb-1">
          {locations.map((l) => (
            <div key={l.id} className="card w-56 shrink-0 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="h3 truncate">{l.area}</h3>
                {l.status === 'open' ? <Pill tone="open">OPEN</Pill> : <Pill tone="soon">SOON</Pill>}
              </div>
              <p className="caption mt-1 line-clamp-2">{l.tagline}</p>
              <span className="eyebrow mt-2 block">{l.city.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- loyalty ---- */}
      <section className="sect gut">
        <button type="button" onClick={() => push({ type: 'loyalty' })} className="card-amber relative w-full overflow-hidden p-6 text-left">
          <div className="grain absolute inset-0" />
          <div className="relative">
            <Eyebrow>GHARELU HUB</Eyebrow>
            <p className="h2 mt-3">
              {tier.name} <span className="text-amber">·</span> <span className="num">{points}</span>
              <span className="eyebrow ml-2">PTS</span>
            </p>
            <div className="mt-4 h-1 w-full bg-ivory/10">
              <div
                className="h-1 bg-gradient-to-r from-amber to-chili transition-all duration-700"
                style={{ width: `${Math.min(100, (points / 5000) * 100)}%` }}
              />
            </div>
            <span className="mt-3 flex items-center gap-1 label gold">
              VIEW REWARDS <ChevronRight size={12} />
            </span>
          </div>
        </button>
      </section>

      {/* ---- offers strip ---- */}
      <section className="sect">
        <SectionTitle>OFFERS FOR {branch.area.toUpperCase()}</SectionTitle>
        <div className="no-bar flex gap-3 overflow-x-auto px-5 pb-1">
          {offersFor(locationId).map((o) => (
            <div key={o.id} className="card-dash w-52 shrink-0 p-4">
              <span className="num gold block text-xl">{o.value}</span>
              <p className="label mt-1 text-ivory">{o.title}</p>
              <p className="caption mt-1">{o.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="eyebrow my-10 text-center">EXPERIENCE THE FOOD · DISCOVER THE STORY · MAKE IT YOURS</p>
    </div>
  );
}
