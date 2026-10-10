import React, { useEffect, useRef, useState } from 'react';
import { Zap, ShieldCheck, ArrowRight, Clock, Award } from 'lucide-react';
import { useApp } from '../store';

const INTRO_HOLD_MS = 2400;

export default function Splash() {
  const setPhase = useApp((s) => s.setPhase);
  const [leaving, setLeaving] = useState(false);
  const skipped = useRef(false);

  const finish = () => {
    if (skipped.current) return;
    skipped.current = true;
    setLeaving(true);
    window.setTimeout(() => setPhase('app'), 300);
  };

  useEffect(() => {
    const t = window.setTimeout(finish, INTRO_HOLD_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      onClick={finish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#681121] via-[#701222] to-[#1E1E24] text-white transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      } cursor-pointer`}
    >
      <div className="pt-12 text-center">
        {/* 10-15 min badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#D48924] text-[#1E1E24] px-3.5 py-1.5 rounded-full font-black text-xs shadow-md uppercase tracking-wider mb-4 animate-bounce">
          <Zap size={14} className="fill-[#1E1E24]" />
          <span>Bhopal&apos;s 10-15 Min Snack Delivery</span>
        </div>
      </div>

      {/* Brand Identity Center Card */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-5 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#681121] shadow-2xl p-1.5 rotate-2 border-2 border-[#D48924] overflow-hidden">
          <img
            src="/logo.png"
            alt="Sahi Crunch Logo"
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>

        <h1 className="text-4xl font-black tracking-tight text-[#FDFBF7] drop-shadow-sm">
          SAHI CRUNCH
        </h1>
        <p className="mt-2 text-base font-extrabold text-[#D48924] tracking-wide">
          Sahi Spice. Modern Crunch.
        </p>
        <p className="mt-1 text-xs text-[#FDFBF7]/80 max-w-xs font-medium">
          Small-batch preservative-free makhana, namkeen & fresh bakery
        </p>

        {/* Badges */}
        <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-[#FDFBF7]/90">
          <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            100% Pure Veg
          </span>
          <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            100% Baked, Not Fried
          </span>
        </div>
      </div>

      {/* Tap to enter footer */}
      <div className="w-full max-w-sm pb-8 text-center">
        <button
          type="button"
          onClick={finish}
          className="w-full flex items-center justify-center gap-2 bg-[#D48924] text-[#1E1E24] font-black text-sm py-4 rounded-2xl shadow-xl shadow-black/25 active:scale-95 transition-transform hover:bg-[#E2952A]"
        >
          <span>Explore Snacks</span>
          <ArrowRight size={16} />
        </button>
        <p className="mt-3 text-[10px] uppercase font-bold tracking-widest text-[#D48924]">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
