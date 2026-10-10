import React, { useMemo, useState, useEffect } from 'react';
import {
  MapPin,
  ChevronDown,
  Search,
  Zap,
  Clock,
  Percent,
  Plus,
  Minus,
  Star,
  Heart,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  ThumbsUp,
  ThumbsDown,
  Leaf,
  Flame,
  QrCode,
  Bike,
  CheckCircle2,
} from 'lucide-react';
import { useApp, activeDishes, tierOf } from '../store';
import { categories, type Dish } from '../data/menu';
import { locations } from '../data/locations';
import { offersFor, TIERS } from '../data';
import { VegBadge, DeliveryPill, RatingBadge, DishImg } from '../ui';
import { formatINR } from '../lib/utils';
import { proxyApi } from '../lib/api';

export default function Home() {
  const profile = useApp((s) => s.profile);
  const locationId = useApp((s) => s.locationId);
  const push = useApp((s) => s.push);
  const setTab = useApp((s) => s.setTab);
  const addToCart = useApp((s) => s.addToCart);
  const cart = useApp((s) => s.cart);
  const setQty = useApp((s) => s.setQty);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);
  const points = useApp((s) => s.points);

  const [votes, setVotes] = useState<Record<string, 'up' | 'down'>>({});

  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const pool = useMemo(() => activeDishes(locationId), [locationId]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const heroSlides = useMemo(
    () => [
      {
        image: 'in-03',
        tag: '₹129 HERO PACK',
        tagBg: 'bg-[#D48924] text-[#1E1E24]',
        title: 'Bhopali Masala Makhana',
        dishId: 'makhana-masala',
      },
      {
        image: 'dessert-01',
        tag: 'PURE DESI GHEE',
        tagBg: 'bg-[#4E8B56] text-white',
        title: 'Sahi Nankhatai',
        dishId: 'nankhatai-classic',
      },
      {
        image: 'snack-01',
        tag: 'HERITAGE RECIPE',
        tagBg: 'bg-[#681121] text-white',
        title: 'Puffed Rice Sev Mixture',
        dishId: 'namkeen-sev',
      },
      {
        image: 'in-04',
        tag: '100% ROASTED',
        tagBg: 'bg-[#E2952A] text-[#1E1E24]',
        title: 'Cream & Herb Makhana',
        dishId: 'makhana-cream-onion',
      },
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const cartQtyMap = useMemo(() => {
    const map: Record<string, { qty: number; key: string }> = {};
    cart.forEach((c) => {
      map[c.dishId] = { qty: (map[c.dishId]?.qty ?? 0) + c.qty, key: c.key };
    });
    return map;
  }, [cart]);

  const displayedDishes = useMemo(() => {
    if (activeCategory === 'all') return pool;
    return pool.filter((d) => d.category === activeCategory);
  }, [pool, activeCategory]);

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
    <div className="min-h-screen bg-[#FDFBF7] pb-36 text-[#1E1E24]">
      {/* ================= 1. RESPONSIVE TOP HEADER (MOBILE & TABLET ONLY: lg:hidden) ================= */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#e8dfcf] shadow-sm px-4 sm:px-6 pt-3.5 pb-3.5">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
          {/* Brand Logo & Location delivery selector */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-[#681121] text-white font-black text-sm shadow-md">
                SC
              </div>

              <button
                type="button"
                onClick={() => push({ type: 'location' })}
                className="flex items-center gap-2.5 text-left min-w-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D48924] text-white font-black shadow-sm">
                  <Zap size={20} className="fill-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm sm:text-base text-[#1E1E24] tracking-tight flex items-center gap-1">
                      Delivery in 10-15 mins
                    </span>
                    <span className="bg-[#4E8B56]/15 text-[#4E8B56] border border-[#4E8B56]/30 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                      Fresh
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs truncate">
                    <span className="font-bold text-slate-700">{branch.area}</span>
                    <span>·</span>
                    <span className="truncate">{branch.city}</span>
                    <ChevronDown size={14} className="text-slate-400 shrink-0" />
                  </div>
                </div>
              </button>
            </div>

            {/* Loyalty points button on mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => push({ type: 'loyalty' })}
                className="flex items-center gap-1.5 bg-[#FBF7F0] border border-[#D48924]/40 px-2.5 py-1.5 rounded-full text-xs font-bold text-[#681121] shadow-sm shrink-0"
              >
                <Sparkles size={14} className="text-[#D48924] fill-[#D48924]" />
                <span>{points} pts</span>
              </button>
            </div>
          </div>

          {/* Search bar + Desktop Actions */}
          <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => push({ type: 'search' })}
              className="flex-1 min-w-0 flex items-center justify-between bg-[#FBF7F0] hover:bg-[#f3ece0] border border-[#e5d8c3] rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-400 transition-colors shadow-inner"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <Search size={18} className="text-[#D48924] shrink-0" />
                <span className="font-medium text-slate-600 truncate text-xs sm:text-sm">
                  Search &quot;Masala Makhana&quot;, &quot;Shahi Nankhatai&quot;...
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#4E8B56] bg-[#4E8B56]/10 px-2 py-0.5 rounded-md hidden md:inline-block shrink-0">
                100% PURE VEG
              </span>
            </button>

            {/* Desktop Loyalty Button */}
            <button
              type="button"
              onClick={() => push({ type: 'loyalty' })}
              className="hidden md:flex items-center gap-1.5 sm:gap-2 bg-[#FBF7F0] border border-[#D48924]/40 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-extrabold text-[#681121] shadow-sm shrink-0 hover:bg-[#f3ece0] transition-colors"
            >
              <Sparkles size={15} className="text-[#D48924] fill-[#D48924]" />
              <span>{points} Points</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 space-y-7 pt-4">
        {/* ================= 2. HERO PROMO CARD (RE-DESIGNED FULL BLEED CAROUSEL) ================= */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-[#681121] text-white shadow-2xl shadow-[#681121]/25 border border-amber-900/40 min-h-[380px] sm:min-h-[420px] md:min-h-[340px] flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            {/* Full-bleed rotating background images with cross-fade */}
            <div className="absolute inset-0 pointer-events-none">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.image}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeHeroSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  style={{ transitionProperty: 'opacity, transform' }}
                >
                  <DishImg
                    name={slide.image}
                    className="w-full h-full object-cover object-center md:object-right"
                  />
                </div>
              ))}

              {/* Left Tint with slanted zig-zag / jagged diagonal edge + 30% image blend */}
              <div
                className="absolute inset-y-0 left-0 w-full sm:w-[60%] md:w-[50%] lg:w-[45%] bg-[#681121]/75 backdrop-blur-[2px]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, calc(96% - 14px) 7%, calc(92% - 4px) 14%, calc(88% - 22px) 21%, calc(84% - 10px) 29%, calc(80% - 28px) 37%, calc(76% - 8px) 45%, calc(71% - 20px) 53%, calc(66% - 5px) 61%, calc(61% - 24px) 69%, calc(56% - 10px) 77%, calc(50% - 26px) 85%, calc(44% - 6px) 93%, 38% 100%, 0 100%)',
                }}
              />
              {/* Subtle gradient wash over tinted zone to keep white text readable and blend rich royal tones */}
              <div
                className="absolute inset-y-0 left-0 w-full sm:w-[60%] md:w-[50%] lg:w-[45%] bg-gradient-to-r from-[#500c19]/80 via-[#681121]/50 to-transparent pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, calc(96% - 14px) 7%, calc(92% - 4px) 14%, calc(88% - 22px) 21%, calc(84% - 10px) 29%, calc(80% - 28px) 37%, calc(76% - 8px) 45%, calc(71% - 20px) 53%, calc(66% - 5px) 61%, calc(61% - 24px) 69%, calc(56% - 10px) 77%, calc(50% - 26px) 85%, calc(44% - 6px) 93%, 38% 100%, 0 100%)',
                }}
              />
            </div>

            {/* Content & Trust Points both cleanly aligned to Left */}
            <div className="relative z-10 max-w-xl flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.15] text-[#FDFBF7] drop-shadow-sm">
                  SAHI SPICE <br />
                  <span className="text-[#E2952A]">100% Roasted, Never Fried</span>
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-amber-100/80 max-w-md font-medium leading-relaxed drop-shadow-sm">
                  Bhopal’s heritage recipes crafted in pure desi ghee & small batches. Clean indulgence made fresh daily.
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTab('menu')}
                    className="bg-[#D48924] hover:bg-[#b87319] text-[#1E1E24] font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Explore Menu
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const msg = 'Hi Sahi Crunch! I want to order.';
                      const { data } = await proxyApi.sendWhatsApp({ message: msg });
                      if (data?.url) window.open(data.url, '_blank');
                      else window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="bg-[#25D366] hover:bg-[#1fae53] text-white font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                </div>
              </div>

              {/* Left-Aligned Vertically Stacked Trust Badges */}
              <div className="mt-5 flex flex-col gap-1.5 self-start">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-orange-100/90 drop-shadow-sm">
                  <ShieldCheck size={14} className="text-[#E2952A] shrink-0" />
                  <span>0% Preservatives & Additives</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-orange-100/90 drop-shadow-sm">
                  <Clock size={14} className="text-[#E2952A] shrink-0" />
                  <span>Made-on-Date Timestamped</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-orange-100/90 drop-shadow-sm">
                  <Award size={14} className="text-[#E2952A] shrink-0" />
                  <span>FSSAI Schedule 4 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. FRESH BATCH SNACKS WITH INTEGRATED CATEGORY SORTING ================= */}
        <section>
          <div className="mb-3.5">
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Our Menu
            </h3>
          </div>

          {/* Integrated Category Sorting Pills */}
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-3 mb-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl shrink-0 text-xs font-black transition-all border ${activeCategory === 'all'
                  ? 'bg-[#681121] text-white border-[#681121] shadow-md shadow-[#681121]/20 scale-100'
                  : 'bg-[#FBF7F0] border-[#e5d8c3] text-[#1E1E24] hover:border-[#D48924]'
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#E2952A]" />
              <span>All Snacks</span>
            </button>

            {categories.map((c) => {
              const active = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl shrink-0 text-xs font-bold transition-all border ${active
                      ? 'bg-[#681121] text-white border-[#681121] shadow-md shadow-[#681121]/20'
                      : 'bg-[#FBF7F0] border-[#e5d8c3] text-[#1E1E24] hover:border-[#D48924]'
                    }`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-[#f3ece0] shrink-0 border border-black/10">
                    <DishImg
                      name={
                        c.id === 'makhana'
                          ? 'in-03'
                          : c.id === 'namkeen'
                            ? 'in-12'
                            : c.id === 'nankhatai'
                              ? 'dessert-01'
                              : c.id === 'cookies'
                                ? 'dessert-05'
                                : c.id === 'gifting'
                                  ? 'fire-01'
                                  : 'drink-01'
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Responsive Grid for Big Vertical Cards: 1 col on xs/mobile, 2 col on sm, 3 col on lg, 4 col on xl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {displayedDishes.slice(0, 8).map((dish) => {
              const inCart = cartQtyMap[dish.id];
              const isFav = favorites.includes(dish.id);

              return (
                <div
                  key={dish.id}
                  onClick={() => push({ type: 'dish', id: dish.id })}
                  className="group relative flex flex-col justify-between bg-[#FBF7F0] p-4 sm:p-5 rounded-3xl border border-[#e5d8c3] shadow-card hover:shadow-float hover:border-[#D48924]/70 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col">
                    {/* Big Square Image with Favorite Heart Button */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f3ece0] border border-[#e8dfcf] shadow-inner">
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
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FDFBF7]/90 backdrop-blur-sm shadow-md text-slate-500 hover:text-[#681121] hover:bg-white active:scale-90 transition-all"
                      >
                        <Heart
                          size={16}
                          className={isFav ? 'fill-[#681121] text-[#681121]' : ''}
                        />
                      </button>
                    </div>

                    {/* Vertically Aligned Info Details */}
                    <div className="mt-4 flex flex-col gap-1.5">
                      <h3 className="font-bold text-base sm:text-lg text-[#1E1E24] tracking-tight leading-snug line-clamp-1 group-hover:text-[#681121] transition-colors">
                        {dish.name}
                      </h3>

                      {/* Price Details */}
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-[#681121] tracking-tight">
                          {formatINR(dish.price)}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 font-medium line-through">
                          ₹{Math.round(dish.price * 1.25)}
                        </span>
                      </div>

                      {/* Feedback Thumbs Buttons */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Feedback:</span>
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
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold transition-all active:scale-90 ${votes[dish.id] === 'up'
                              ? 'bg-[#4E8B56]/15 text-[#4E8B56] border-[#4E8B56]/50 shadow-sm'
                              : 'bg-[#FDFBF7] text-slate-500 border-[#e5d8c3] hover:text-[#4E8B56] hover:border-[#4E8B56]/40'
                            }`}
                        >
                          <ThumbsUp
                            size={13}
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
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold transition-all active:scale-90 ${votes[dish.id] === 'down'
                              ? 'bg-[#b91c1c]/15 text-[#b91c1c] border-[#b91c1c]/50 shadow-sm'
                              : 'bg-[#FDFBF7] text-slate-500 border-[#e5d8c3] hover:text-[#b91c1c] hover:border-[#b91c1c]/40'
                            }`}
                        >
                          <ThumbsDown
                            size={13}
                            className={votes[dish.id] === 'down' ? 'fill-[#b91c1c]' : ''}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action: ADD / Quantity Stepper */}
                  <div className="mt-4 pt-3 border-t border-[#e8dfcf]">
                    {inCart && inCart.qty > 0 ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center justify-between bg-[#4E8B56] text-white rounded-xl px-4 py-2 shadow-md font-extrabold text-sm"
                      >
                        <button
                          type="button"
                          onClick={(e) => handleDecrement(dish, inCart.key, inCart.qty, e)}
                          className="p-1 hover:bg-[#3d7044] rounded active:scale-90 transition-transform"
                        >
                          <Minus size={15} strokeWidth={3} />
                        </button>
                        <span className="font-black text-sm">{inCart.qty}</span>
                        <button
                          type="button"
                          onClick={(e) => handleIncrement(dish, inCart.key, inCart.qty, e)}
                          className="p-1 hover:bg-[#3d7044] rounded active:scale-90 transition-transform"
                        >
                          <Plus size={15} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleAdd(dish, e)}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#FDFBF7] hover:bg-[#681121] text-[#681121] hover:text-white border-1.5 border-[#681121] font-black text-xs sm:text-sm py-2 rounded-xl shadow-sm hover:shadow active:scale-98 transition-all"
                      >
                        <span>ADD</span>
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explore full menu CTA */}
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setTab('menu')}
              className="flex items-center gap-2 bg-[#FBF7F0] hover:bg-[#681121] text-[#681121] hover:text-white border-1.5 border-[#681121] font-black text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-sm hover:shadow active:scale-95 transition-all"
            >
              <span>Full Menu</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* ================= 6. WHY BHOPAL CHOOSES SAHI CRUNCH (CASE-STUDY BACKED) ================= */}
        <section className="relative space-y-4">
          {/* Main Heritage & Mission Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3b0811] via-[#681121] to-[#240409] text-white p-6 sm:p-10 shadow-2xl border border-[#D48924]/30">
            {/* Ambient Background Glows & Subtle Texture */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#D48924]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#4E8B56]/15 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#D48924_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-[#540c19] text-[#E2952A] border border-[#D48924]/40 text-[10px] sm:text-xs font-black tracking-wider uppercase px-3.5 py-1 rounded-full mb-3 shadow-sm">
                  <span>78-Year Bhopali Legacy</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2952A]" />
                  <span className="text-[#FDFBF7]">Clean Snacking</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#FDFBF7] tracking-tight leading-tight">
                  Why People Choose Sahi Crunch
                </h3>

                <p className="text-xs sm:text-sm text-[#FDFBF7]/85 mt-2.5 leading-relaxed font-medium">
                  Zero palm oil, zero chemical sprays, and zero shelf-life aging. We roast fresh daily in small batches using Bhopal&apos;s heritage recipes, delivering direct to your doorstep in 10–15 minutes.
                </p>
              </div>

              {/* Verified Trust Badges */}
              <div className="flex flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <div className="flex-1 sm:flex-initial flex items-center gap-2.5 bg-[#540c19]/90 border border-[#D48924]/30 px-3.5 py-2 rounded-2xl text-left shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-[#4E8B56]/30 border border-[#4E8B56]/50 flex items-center justify-center text-[#5fa768] shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#FDFBF7]">FSSAI Schedule 4</p>
                    <p className="text-[9px] text-[#E2952A] font-bold">Certified Kitchen Rigor</p>
                  </div>
                </div>

                <div className="flex-1 sm:flex-initial flex items-center gap-2.5 bg-[#540c19]/90 border border-[#D48924]/30 px-3.5 py-2 rounded-2xl text-left shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-[#D48924]/30 border border-[#D48924]/50 flex items-center justify-center text-[#E2952A] shrink-0">
                    <QrCode size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#FDFBF7]">On-Pack Batch QR</p>
                    <p className="text-[9px] text-[#E2952A] font-bold">Farm-to-Pack Traceability</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars Grid with High-Res Visual Assets & Case Data */}
            <div className="mt-8 pt-7 border-t border-[#FDFBF7]/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {/* Pillar 1: Farm Direct Raw Materials */}
              <div className="group rounded-2xl bg-[#540c19]/70 hover:bg-[#540c19] border border-[#D48924]/30 hover:border-[#D48924] p-4 transition-all duration-300 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-[#D48924]/20 bg-[#240409]">
                    <img
                      src="/images/craft-02.webp"
                      alt="Farm-gate sourcing"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2.5 inline-flex items-center gap-1 bg-[#681121] text-[#E2952A] border border-[#D48924]/50 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      <Leaf size={10} />
                      <span>Farm Direct</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-[#FDFBF7] tracking-tight">
                    Malwa Wheat & Chambal Oils
                  </h4>
                  <p className="text-[11px] text-[#FDFBF7]/75 font-medium leading-relaxed mt-1">
                    Direct farm procurement eliminating middleman markups. Pure cold-pressed oils without refined palm oil.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#D48924]/20 flex items-center justify-between text-[10px] text-[#E2952A] font-black">
                  <span>0% Preservatives</span>
                  <span>100% Purity</span>
                </div>
              </div>

              {/* Pillar 2: Artisanal Woodfire Roasting */}
              <div className="group rounded-2xl bg-[#540c19]/70 hover:bg-[#540c19] border border-[#D48924]/30 hover:border-[#D48924] p-4 transition-all duration-300 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-[#D48924]/20 bg-[#240409]">
                    <img
                      src="/images/craft-03.webp"
                      alt="Artisanal Slow Roasting"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2.5 inline-flex items-center gap-1 bg-[#681121] text-[#E2952A] border border-[#D48924]/50 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      <Flame size={10} />
                      <span>Slow Roasted</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-[#FDFBF7] tracking-tight">
                    Kettle-Baked, Never Fried
                  </h4>
                  <p className="text-[11px] text-[#FDFBF7]/75 font-medium leading-relaxed mt-1">
                    Deck convection baking preserves grain fiber and lightness. Golden crisp crunch without oil sogginess.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#D48924]/20 flex items-center justify-between text-[10px] text-[#5fa768] font-black">
                  <span>Light Digestion</span>
                  <span>78-Yr Secret</span>
                </div>
              </div>

              {/* Pillar 3: On-Pack Traceability & Date Stamping */}
              <div className="group rounded-2xl bg-[#540c19]/70 hover:bg-[#540c19] border border-[#D48924]/30 hover:border-[#D48924] p-4 transition-all duration-300 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-[#D48924]/20 bg-[#240409]">
                    <img
                      src="/images/products/masala_makhana_pack.jpg"
                      alt="Transparent Batch Packaging"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2.5 inline-flex items-center gap-1 bg-[#681121] text-[#E2952A] border border-[#D48924]/50 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      <QrCode size={10} />
                      <span>Batch Stamped</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-[#FDFBF7] tracking-tight">
                    Strict 48-Hour Fresh Window
                  </h4>
                  <p className="text-[11px] text-[#FDFBF7]/75 font-medium leading-relaxed mt-1">
                    Permanent Made-on-Date stamp on front pouch. Scan batch QR for raw milling origins and press logs.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#D48924]/20 flex items-center justify-between text-[10px] text-[#E2952A] font-black">
                  <span>Batch-to-Order</span>
                  <span>Zero Stale Food</span>
                </div>
              </div>

              {/* Pillar 4: Hyperlocal 10-15 Min Hubs */}
              <div className="group rounded-2xl bg-[#540c19]/70 hover:bg-[#540c19] border border-[#D48924]/30 hover:border-[#D48924] p-4 transition-all duration-300 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-[#D48924]/20 bg-[#240409]">
                    <img
                      src="/images/products/nankhatai_pack.jpg"
                      alt="Quick Hub Dispatch"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2.5 inline-flex items-center gap-1 bg-[#681121] text-[#E2952A] border border-[#D48924]/50 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      <Bike size={10} />
                      <span>10–15 Mins</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-[#FDFBF7] tracking-tight">
                    Bhopal Cluster Express Hubs
                  </h4>
                  <p className="text-[11px] text-[#FDFBF7]/75 font-medium leading-relaxed mt-1">
                    Daily optimized batches across Arera Colony, Shahpura & Kolar Road dispatched direct from kitchen ovens.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#D48924]/20 flex items-center justify-between text-[10px] text-[#5fa768] font-black">
                  <span>Oven Fresh</span>
                  <span>Hyperlocal Express</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-4 pb-6 text-center border-t border-[#e5d8c3]/60">
          <div className="flex items-center justify-center gap-3 text-xs font-bold text-[#681121]">
            <span>100% Roasted</span>
            <span className="text-[#D48924]">·</span>
            <span>0% Preservatives</span>
            <span className="text-[#D48924]">·</span>
            <span>Made-on-Date Fresh</span>
            <span className="text-[#D48924]">·</span>
            <span>Bhopal Express Hubs</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 font-semibold tracking-wide">
            SAHI CRUNCH · Bhopal&apos;s 78-Year Modern Heritage Snackery
          </p>
        </footer>
      </div>
    </div>
  );
}
