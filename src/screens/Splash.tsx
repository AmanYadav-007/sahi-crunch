import { useEffect, useRef, useState } from 'react';
import { useApp } from '../store';

const INTRO_HOLD_MS = 4600;

export default function Splash() {
  const setPhase = useApp((s) => s.setPhase);
  const [leaving, setLeaving] = useState(false);
  const skipped = useRef(false);

  const finish = () => {
    if (skipped.current) return;
    skipped.current = true;
    setLeaving(true);
    window.setTimeout(() => setPhase('app'), 520);
  };

  useEffect(() => {
    const t = window.setTimeout(finish, INTRO_HOLD_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      onClick={finish}
      aria-label="Skip intro"
      className={`relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-ink transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* ambient glow */}
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(230,167,86,0.16),transparent_65%)]" />

      {/* Gharelu Hub logo */}
      <div className="relative flex h-52 w-52 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-amber/20 shadow-[0_0_50px_rgba(230,167,86,0.15)]" />
        <img
          src="/favicon.png"
          alt="GHARELU HUB"
          className="relative h-36 w-36 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
        />
        {/* subtle ambient particles */}
        <span className="orbit-bit absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-amber" style={{ animationDelay: '0s' }} />
        <span className="orbit-bit absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-chili" style={{ animationDelay: '-3.5s' }} />
        <span className="orbit-bit absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-herb" style={{ animationDelay: '-7s' }} />
      </div>

      {/* brand + tagline */}
      <div className="rise relative mt-10 text-center" style={{ animationDelay: '0.4s' }}>
        <p className="font-display text-3xl font-semibold tracking-[0.3em] text-ivory">GHARELU HUB</p>
        <p className="rise mt-5 font-display text-2xl italic text-amber" style={{ animationDelay: '0.9s' }}>
          Your table awaits.
        </p>
      </div>

      {/* CTAs */}
      <div className="rise absolute inset-x-6 bottom-14 flex flex-col gap-3" style={{ animationDelay: '1.5s' }}>
        <span className="btn-solid w-full pointer-events-none">ORDER NOW</span>
        <span className="btn-ghost w-full pointer-events-none">RESERVE TABLE</span>
        <span className="eyebrow mt-2 block text-center">TAP TO SKIP</span>
      </div>
    </button>
  );
}
