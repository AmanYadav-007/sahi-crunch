import React, { useEffect, useState } from 'react';
import {
  Zap,
  Search,
  Coins,
  Sparkles,
  ShoppingBag,
  MapPin,
  ChevronDown,
  Compass,
  ReceiptText,
  User,
  Heart,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { useApp, cartCount, cartSubtotal, type Tab } from './store';
import { locations } from './data/locations';
import { formatINR } from './lib/utils';
import { useAuth } from './lib/AuthContext';

export default function TopNavbar() {
  const auth = useAuth();
  const tab = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);
  const push = useApp((s) => s.push);
  const pop = useApp((s) => s.pop);
  const stack = useApp((s) => s.stack);
  const cart = useApp((s) => s.cart);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const locationId = useApp((s) => s.locationId);
  const points = useApp((s) => s.points);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const count = cartCount(cart);
  const subtotal = cartSubtotal(cart);

  const navLinks: Array<{ id: Tab; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Explore Snacks' },
    { id: 'orders', label: 'Orders' },
    { id: 'reservations', label: 'Tasting Passes' },
    { id: 'profile', label: 'Account' },
  ];

  const hasBack = stack.length > 0;

  return (
    <header className="hidden lg:block sticky top-0 z-40 transition-all duration-300 w-full pointer-events-none">
      {/* 1. SCROLLED STATE: Pure Floating Rounded Capsule Pill */}
      {scrolled ? (
        <div className="w-full flex justify-center pt-3 pb-2 px-4 animate-in fade-in slide-in-from-top-1 duration-200 pointer-events-auto">
          <div className="inline-flex items-center gap-3 bg-[#FAF5EC]/95 backdrop-blur-xl border border-[#e2d2ba] px-5 py-2.5 rounded-full shadow-2xl shadow-stone-900/15">
              {/* Back Button (Appears before nav items if inside sub-page/stack) */}
              {hasBack && (
                <button
                  type="button"
                  onClick={pop}
                  className="flex items-center gap-1.5 bg-[#681121] hover:bg-[#540c19] text-white px-3.5 py-2 rounded-full text-xs font-black shadow-sm transition-all active:scale-95 mr-1"
                  title="Go Back"
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>
              )}

              {/* Small Brand Logo Icon */}
              <button
                type="button"
                onClick={() => {
                  if (hasBack) pop();
                  setTab('home');
                }}
                className="w-9 h-9 rounded-full overflow-hidden bg-[#681121] flex items-center justify-center shrink-0 mr-1 shadow-md hover:scale-105 transition-transform border border-[#D48924]/30"
                title="Home"
              >
                <img src="/logo.png" alt="Sahi Crunch" className="w-full h-full object-cover" />
              </button>

              {/* Navigation Pill Links */}
              <nav aria-label="Desktop floating pill" className="flex items-center gap-1.5">
                {navLinks.map((item) => {
                  const active = tab === item.id && !hasBack;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (hasBack) {
                          while (useApp.getState().stack.length > 0) {
                            useApp.getState().pop();
                          }
                        }
                        setTab(item.id);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-extrabold transition-all relative whitespace-nowrap ${
                        active
                          ? 'text-[#681121] bg-[#681121]/15 font-black shadow-sm'
                          : 'text-[#1E1E24]/80 hover:text-[#1E1E24] hover:bg-stone-200/60'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Mini Actions: Search & Points */}
              <div className="flex items-center gap-2 pl-3 ml-1.5 border-l border-[#d9c7ad]">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    push({ type: 'search' });
                  }}
                  className="p-2 rounded-full hover:bg-stone-200/60 text-slate-700 transition-colors"
                  title="Search Snacks"
                >
                  <Search size={16} className="text-[#D48924]" />
                </button>

                <button
                  type="button"
                  onClick={() => push({ type: 'loyalty' })}
                  className="inline-flex items-center gap-1.5 bg-[#D48924]/15 px-3 py-1.5 rounded-full text-xs font-black text-[#8B4513] hover:bg-[#D48924]/25 transition-colors border border-[#D48924]/30"
                  title="Rewards Balance"
                >
                  <Coins size={14} className="text-[#D48924]" />
                  <span>{points} pts</span>
                </button>
              </div>
            </div>
        </div>
      ) : (
        /* 2. TOP DEFAULT STATE: Full Top Bar */
        <div className="bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#e8dfcf] shadow-sm transition-all w-full pointer-events-auto">
          <div className="w-full px-6 lg:px-8 xl:px-12 py-3 flex items-center justify-between gap-4 xl:gap-6">
            {/* Left: Brand Logo & Bhopal Express Location */}
            <div className="flex items-center gap-3 xl:gap-5 shrink-0">
              {/* Back Button if in sub-screen/stack */}
              {hasBack && (
                <button
                  type="button"
                  onClick={pop}
                  className="flex items-center gap-1.5 bg-[#681121] hover:bg-[#540c19] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
                  title="Go Back"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (hasBack) pop();
                  setTab('home');
                }}
                className="flex items-center gap-2.5 group text-left"
              >
                <div className="h-10 w-10 xl:h-11 xl:w-11 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform border border-[#D48924]/30 bg-[#681121] flex items-center justify-center shrink-0">
                  <img
                    src="/logo.png"
                    alt="Sahi Crunch Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-black text-base xl:text-lg tracking-tight text-[#1E1E24] block leading-tight group-hover:text-[#681121] transition-colors">
                    SAHI CRUNCH
                  </span>
                  <span className="text-[9px] xl:text-[10px] font-bold tracking-wider uppercase text-[#D48924] block">
                    Sahi Baked Heritage
                  </span>
                </div>
              </button>

              {/* Location Delivery Cluster Pill */}
              <button
                type="button"
                onClick={() => push({ type: 'location' })}
                className="hidden xl:flex items-center gap-2 bg-[#FBF7F0] hover:bg-[#f3ece0] border border-[#e5d8c3] px-3 py-1.5 rounded-2xl text-left transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#D48924] text-white font-black shrink-0">
                  <Zap size={13} className="fill-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#1E1E24]">
                    <span>10-15 Min Hub</span>
                    <span className="bg-[#4E8B56] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                      Fresh
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 truncate max-w-[100px]">
                    {branch.area}
                  </p>
                </div>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav aria-label="Desktop primary" className="flex items-center gap-1">
              {navLinks.map((item) => {
                const active = tab === item.id && !hasBack;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (hasBack) {
                        while (useApp.getState().stack.length > 0) {
                          useApp.getState().pop();
                        }
                      }
                      setTab(item.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-extrabold transition-all relative whitespace-nowrap ${
                      active
                        ? 'text-[#681121] bg-[#681121]/10 font-black shadow-sm'
                        : 'text-[#1E1E24]/70 hover:text-[#1E1E24] hover:bg-[#FBF7F0]'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 inset-x-3 h-0.5 bg-[#681121] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Search, Loyalty Points & Cart / Book Now Button */}
            <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
              {/* Quick Search */}
              <button
                type="button"
                onClick={() => push({ type: 'search' })}
                className="flex items-center gap-1.5 bg-[#FBF7F0] hover:bg-[#f3ece0] text-slate-600 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border border-[#e5d8c3]"
              >
                <Search size={14} className="text-[#D48924]" />
                <span className="hidden 2xl:inline">Search...</span>
              </button>

              {/* Points */}
              <button
                type="button"
                onClick={() => push({ type: 'loyalty' })}
                className="flex items-center gap-1.5 bg-[#D48924]/10 border border-[#D48924]/30 px-3 py-1.5 rounded-xl text-xs font-black text-[#8B4513] shadow-sm hover:bg-[#D48924]/20 transition-colors"
              >
                <Coins size={14} className="text-[#D48924]" />
                <span>{points} pts</span>
              </button>

              {/* Auth Button */}
              {auth.isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setTab('profile')}
                  className="flex items-center gap-1.5 bg-[#FBF7F0] hover:bg-[#f3ece0] border border-[#e5d8c3] text-[#1E1E24] font-extrabold text-xs px-2.5 py-1.5 rounded-xl transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#681121] text-white flex items-center justify-center text-[10px] font-black">
                    {auth.user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden xl:inline max-w-[80px] truncate">
                    {auth.user?.name?.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => auth.openLogin()}
                  className="flex items-center gap-1.5 bg-[#681121]/10 hover:bg-[#681121]/15 text-[#681121] border border-[#681121]/20 font-extrabold text-xs px-2.5 py-1.5 rounded-xl transition-colors"
                >
                  <User size={13} />
                  <span>Login</span>
                </button>
              )}

              {/* Tasting Pass / Booking Shortcut */}
              <button
                type="button"
                onClick={() => setTab('reservations')}
                className="bg-[#681121] hover:bg-[#540c19] text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap"
              >
                Book Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

