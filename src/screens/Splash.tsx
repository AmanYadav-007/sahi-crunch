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

      {/* rotating dish */}
      <div className="relative h-56 w-56">
        <div className="dish-spin absolute inset-0 rounded-full border hair" />
        <img
          src="/images/in-03.webp"
          alt=""
          className="dish-spin absolute inset-4 rounded-full object-cover shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        />
        {/* floating ingredients */}
        <span className="orbit-bit absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-chili" style={{ animationDelay: '0s' }} />
        <span className="orbit-bit absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-herb" style={{ animationDelay: '-3.5s' }} />
        <span className="orbit-bit absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-amber" style={{ animationDelay: '-7s' }} />
        {/* steam */}
        <span className="steam-wisp absolute left-[38%] top-6 h-8 w-1.5 rounded-full bg-ivory/40 blur-[3px]" style={{ animationDelay: '0s' }} />
        <span className="steam-wisp absolute left-[52%] top-8 h-10 w-1.5 rounded-full bg-ivory/30 blur-[3px]" style={{ animationDelay: '-1.2s' }} />
        <span className="steam-wisp absolute left-[64%] top-7 h-7 w-1.5 rounded-full bg-ivory/35 blur-[3px]" style={{ animationDelay: '-2.1s' }} />
      </div>

      {/* logo + line */}
      <div className="rise relative mt-12 text-center" style={{ animationDelay: '0.5s' }}>
        <svg viewBox="0 0 64 64" className="mx-auto h-10 w-10" aria-hidden>
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(241,234,221,0.3)" strokeWidth="1.5" />
          <path d="M32 14c4 6 9.5 8.8 9.5 16.2A9.5 9.5 0 0 1 32 39.7a9.5 9.5 0 0 1-9.5-9.5C22.5 22.8 28 20 32 14z" fill="#b5381f" />
          <path d="M32 24c2.2 3.2 5 4.7 5 8.4a5 5 0 1 1-10 0c0-3.7 2.8-5.2 5-8.4z" fill="#e6a756" />
        </svg>
        <p className="mt-4 font-display text-2xl font-semibold tracking-[0.3em] text-ivory">GHARELU</p>
        <p className="rise mt-8 font-display text-3xl italic text-amber" style={{ animationDelay: '1.1s' }}>
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
