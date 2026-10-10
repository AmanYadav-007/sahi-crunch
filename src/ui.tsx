import type { ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useApp } from './store';

/* ---------- shared primitives ---------- */

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 eyebrow ${className}`}>
      <span className="h-px w-6 bg-amber/60" />
      {children}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between px-5">
      <h2 className="label text-ivory">{children}</h2>
      {action}
    </div>
  );
}

/** standard tab header — every tab screen opens with this exact rhythm */
export function TabHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <header className="safe-t flex items-start justify-between gap-4 px-5 pt-6">
      <div className="min-w-0">
        <h1 className="h1 mt-1.5">{title}</h1>
      </div>
      {right && <div className="shrink-0 pt-1">{right}</div>}
    </header>
  );
}

export function Price({ children }: { children: ReactNode }) {
  return <span className="num gold">₹{children}</span>;
}

/* screen wrapper with header + stack back */
export function Screen({
  title,
  eyebrow,
  children,
  right,
  onBack,
  bare,
}: {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  right?: ReactNode;
  onBack?: () => void;
  bare?: boolean;
}) {
  const pop = useApp((s) => s.pop);
  const back = onBack ?? pop;

  if (bare) return <div className="screen-in min-h-[100dvh]">{children}</div>;

  return (
    <div className="screen-in min-h-[100dvh] pb-24">
      <header className="safe-t topbar sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={back}
          aria-label="Back"
          data-cursor="BACK"
          className="icon-btn shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          {title && <h1 className="h3 truncate">{title}</h1>}
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center">{right}</div>
      </header>
      {children}
    </div>
  );
}

/* bottom sheet */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal>
      <div className="scrim-dark fade-in absolute inset-0" onClick={onClose} aria-hidden />
      <div className="sheet sheet-up relative max-h-[88dvh] w-full max-w-[480px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 hair-b">
          <h2 className="h3">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="icon-btn"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[74dvh] overflow-y-auto overscroll-contain pb-8">{children}</div>
      </div>
    </div>
  );
}

/* empty state — premium copy, no system icons */
export function Empty({
  title,
  sub,
  cta,
  onCta,
  art = 'plate',
}: {
  title: string;
  sub: string;
  cta?: string;
  onCta?: () => void;
  art?: 'plate' | 'glass' | 'note';
}) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden>
        <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(241,234,221,0.18)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="34" fill="none" stroke="rgba(230,167,86,0.4)" strokeWidth="1" strokeDasharray="4 6" />
        {art === 'plate' && <circle cx="60" cy="60" r="8" fill="#b5381f" opacity="0.7" />}
        {art === 'glass' && (
          <path d="M48 44h24l-5 26a7 7 0 0 1-14 0z" fill="none" stroke="#e6a756" strokeWidth="1.5" />
        )}
        {art === 'note' && (
          <>
            <path d="M44 46h32v28H44z" fill="none" stroke="#e6a756" strokeWidth="1.5" />
            <path d="M50 56h20M50 64h14" stroke="rgba(241,234,221,0.5)" strokeWidth="1.5" />
          </>
        )}
      </svg>
      <p className="h2 mt-6">{title}</p>
      <p className="body mt-2 max-w-xs">{sub}</p>
      {cta && (
        <button type="button" onClick={onCta} className="btn-solid mt-6 !py-3">
          {cta}
        </button>
      )}
    </div>
  );
}

/* status pill */
export function Pill({ tone, children }: { tone: 'open' | 'soon' | 'off' | 'amber'; children: ReactNode }) {
  const map = {
    open: 'text-herb border-herb/40 bg-herb/10',
    soon: 'text-amber border-amber/40 bg-amber/10',
    off: 'text-ivory-faint hair-2',
    amber: 'text-amber border-amber/50 bg-amber/10',
  } as const;
  return <span className={`label rounded-full border px-2.5 py-1 ${map[tone]}`}>{children}</span>;
}

/* dish image with graceful fallback */
export function DishImg({ name, className = '' }: { name: string; className?: string }) {
  return (
    <img
      src={`/images/${name}.webp`}
      alt=""
      loading="lazy"
      className={className}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.opacity = '0';
      }}
    />
  );
}
