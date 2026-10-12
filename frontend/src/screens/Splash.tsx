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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[var(--paper)] paper-grain text-[var(--ink)] transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      } cursor-pointer`}
    >
      <div className="pt-12 text-center">
        {/* 10-15 min badge — an ink stamp pressed onto the cover */}
        <span className="stamp tilt-r-sm text-[#C45688] border-[#D86B9B]/60">
          <Zap size={11} className="fill-[#C45688]" />
          <span>Bhopal&apos;s 10-15 Min Snack Delivery</span>
        </span>
      </div>

      {/* Brand Identity — logo pinned like a photo in the logbook */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-5 flex flex-col items-center">
          <div className="h-28 w-28 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Gharelu Hub Logo"
              className="h-full w-full object-contain drop-shadow-md"
            />
          </div>
        </div>

        <h1 className="font-hand italic text-4xl tracking-tight text-[#8F2859]">
          GHARELU HUB
        </h1>
        <svg viewBox="0 0 200 10" className="w-40 h-2.5 mt-1.5" fill="none" aria-hidden="true">
          <path d="M2 7c24-4 46-5 70-3.6s44 3.6 68 2.4 38-4 58-5" stroke="#D86B9B" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <p className="mt-2 font-hand italic text-lg text-[#C45688] tracking-wide">
          <span className="marker">Ghar Jaisa Swaad. Authentic Crunch.</span>
        </p>
        <p className="mt-1.5 font-note text-xs text-[var(--ink-soft)] max-w-xs leading-relaxed">
          Small-batch preservative-free makhana, namkeen &amp; fresh bakery
        </p>

        {/* Badges — two rubber stamps */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="stamp tilt-l-sm text-[#3d7044] border-[#4E8B56]/50">
            100% Pure Veg
          </span>
          <span className="stamp tilt-r-sm text-[#C45688] border-[#D86B9B]/60">
            100% Baked, Not Fried
          </span>
        </div>
      </div>

      {/* Tap to enter footer */}
      <div className="w-full max-w-sm pb-8 text-center">
        <button
          type="button"
          onClick={finish}
          className="btn-ink w-full flex items-center justify-center gap-2 font-note text-sm font-semibold uppercase tracking-[0.14em] py-4"
        >
          <span>Explore Snacks</span>
          <ArrowRight size={16} />
        </button>
        <p className="mt-3 font-note text-[10px] uppercase font-semibold tracking-[0.24em] text-[var(--ink-faint)]">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
