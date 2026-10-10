import React from 'react';
import {
  Zap,
  Search,
  Sparkles,
  ShoppingBag,
  MapPin,
  ChevronDown,
  Compass,
  ReceiptText,
  User,
  Heart,
  Calendar,
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
  const cart = useApp((s) => s.cart);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const locationId = useApp((s) => s.locationId);
  const points = useApp((s) => s.points);

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

  return (
    <header className="hidden lg:block sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#e8dfcf] shadow-sm transition-all w-full">
      <div className="w-full px-6 lg:px-8 xl:px-12 py-3 flex items-center justify-between gap-4 xl:gap-6">
        {/* Left: Brand Logo & Bhopal Express Location */}
        <div className="flex items-center gap-3 xl:gap-5 shrink-0">
          <button
            type="button"
            onClick={() => setTab('home')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="h-9 w-9 xl:h-10 xl:w-10 flex items-center justify-center rounded-2xl bg-[#681121] text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
              SC
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
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
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
            className="flex items-center gap-1 bg-gradient-to-r from-[#681121]/10 to-[#D48924]/15 border border-[#D48924]/30 px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-[#681121] shadow-sm hover:bg-[#D48924]/20 transition-colors"
          >
            <Sparkles size={13} className="text-[#D48924] fill-[#D48924]" />
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
              <span className="hidden xl:inline max-w-[80px] truncate">{auth.user?.name?.split(' ')[0]}</span>
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
    </header>
  );
}
