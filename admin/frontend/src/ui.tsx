import React, { ReactNode } from 'react';
import { Zap } from 'lucide-react';

/* ---------- Shared Handmade Primitives ----------
   Same ink-on-kraft-paper language as the customer panel —
   see index.css for the .stamp / .tape / .btn-ink / .marker system. */

/** Hand-drawn amber squiggle that sits under serif headings */
export function Squiggle({ className = 'w-28 h-2.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 8" className={className} fill="none" aria-hidden="true">
      <path
        d="M2 5.5c14-3 28-3.5 42-2.5s27 2.5 41 1.5 22-2.5 33-3.5"
        stroke="#D86B9B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Section Header — serif italic title with a hand-drawn underline */
export function SectionTitle({
  children,
  subtitle,
  action,
  eyebrow,
}: {
  children: ReactNode;
  subtitle?: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-note text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C45688] mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-hand italic text-2xl sm:text-[26px] text-[#8F2859] tracking-tight leading-tight">
          {children}
        </h2>
        <Squiggle />
        {subtitle && (
          <p className="font-note text-[11px] text-[var(--ink-faint)] mt-1 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 font-note text-xs font-semibold text-[#C45688] underline decoration-dotted decoration-[#D86B9B] underline-offset-4">
          {action}
        </div>
      )}
    </div>
  );
}

/** Ink stamp chip — dashed border, uppercase, slight tilt applied by caller */
export function Stamp({
  children,
  tone = 'ink',
  className = '',
}: {
  children: ReactNode;
  tone?: 'ink' | 'amber' | 'green' | 'maroon' | 'navy' | 'kraft' | 'off';
  className?: string;
}) {
  const tones: Record<string, string> = {
    ink: 'text-[var(--ink-soft)] border-[var(--rule)]',
    off: 'text-[var(--ink-faint)] border-[var(--rule)]',
    amber: 'text-[#C45688] border-[#D86B9B]/50',
    green: 'text-[#3d7044] border-[#4E8B56]/50',
    maroon: 'text-[#C45688] border-[#C45688]/45',
    navy: 'text-[#1D2E47] border-[#1D2E47]/35',
    kraft: 'text-[#b88c57] border-[#D1A673]/70',
  };

  return <span className={`stamp ${tones[tone]} ${className}`}>{children}</span>;
}

/** Loading — a note scribbled while the pad loads */
export function Loader({ text = 'Pulling it off the board…', sub }: { text?: string; sub?: string }) {
  return (
    <div className="sc-card p-10 flex flex-col items-center justify-center gap-2 text-center">
      <span className="stamp tilt-l-sm text-[#C45688] border-[#D86B9B]/50">Working</span>
      <p className="font-hand italic text-xl text-[#8F2859]">{text}</p>
      <p className="font-note text-[11px] text-[var(--ink-faint)]">
        {sub || 'One second — checking with the kitchen'}
      </p>
    </div>
  );
}

/** Empty State — a doodle on a blank page */
export function Empty({
  title,
  sub,
  cta,
  onCta,
}: {
  title: string;
  sub: string;
  cta?: string;
  onCta?: () => void;
}) {
  return (
    <div className="sc-card p-10 flex flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C45688]/8 text-[#C45688] mb-4 border-2 border-dashed border-[#C45688]/25 tilt-l">
        <Zap size={34} />
      </div>
      <h3 className="font-hand italic text-2xl text-[#8F2859]">{title}</h3>
      <p className="mt-1.5 max-w-sm font-note text-xs text-[var(--ink-faint)] leading-relaxed">
        {sub}
      </p>
      {cta && onCta && (
        <button type="button" onClick={onCta} className="btn-ink mt-6 px-6 py-3 font-note text-xs font-semibold uppercase tracking-[0.14em]">
          {cta}
        </button>
      )}
    </div>
  );
}
