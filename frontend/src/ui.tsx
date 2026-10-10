import React, { ReactNode, CSSProperties } from 'react';
import { ArrowLeft, X, Star, Clock, Zap, ShieldCheck } from 'lucide-react';
import { useApp } from './store';

/* ---------- Shared Quick-Commerce Primitives ---------- */

/** Pure Veg Green Dot Badge */
export function VegBadge({ className = '' }: { className?: string }) {
  return (
    <div
      title="100% Pure Vegetarian"
      className={`inline-flex items-center justify-center w-3.5 h-3.5 border-[1.5px] border-emerald-600 rounded-[3px] bg-white p-[2px] shrink-0 ${className}`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
    </div>
  );
}

/** 10 MINS Delivery Pill */
export function DeliveryPill({ time = '10 MINS' }: { time?: string }) {
  return (
    <div className="inline-flex items-center gap-1 bg-[#D48924] text-[#1E1E24] px-2 py-0.5 rounded-md font-black text-[11px] shadow-sm tracking-tight">
      <Zap size={11} className="fill-[#1E1E24]" />
      <span>{time}</span>
    </div>
  );
}

/** Rating Pill */
export function RatingBadge({ rating = '4.8', count }: { rating?: string | number; count?: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#4E8B56] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[4px]">
      <span>{rating}</span>
      <Star size={10} className="fill-white" />
      {count && <span className="text-[9px] font-normal opacity-90">({count})</span>}
    </span>
  );
}

/** Modern Section Header */
export function SectionTitle({
  children,
  subtitle,
  action,
}: {
  children: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3.5 flex items-end justify-between px-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{children}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 text-sm font-bold text-orange-600">{action}</div>}
    </div>
  );
}

/** Tab header with delivery time & location context */
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
    <header className="sticky top-0 lg:top-[73px] z-20 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#e8dfcf] px-4 sm:px-6 lg:px-10 py-3.5 sm:py-4 flex items-center justify-between transition-all">
      <div>
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-wider text-[#D48924]">{eyebrow}</p>}
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1E24] tracking-tight">{title}</h1>
      </div>
      {right && <div>{right}</div>}
    </header>
  );
}

/** Standard Price Element */
export function Price({ children, original }: { children: ReactNode; original?: number }) {
  return (
    <div className="inline-flex items-baseline gap-1.5 font-sans">
      <span className="text-[#681121] font-extrabold text-base tracking-tight">₹{children}</span>
      {original && (
        <span className="text-slate-400 text-xs font-medium line-through">₹{original}</span>
      )}
    </div>
  );
}

/** Modern Screen Wrapper with Back Button */
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

  if (bare) return <div className="min-h-screen bg-[#FDFBF7]">{children}</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24 text-[#1E1E24]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e8dfcf] bg-[#FDFBF7]/95 px-4 py-3 backdrop-blur-md shadow-sm">
        <button
          type="button"
          onClick={back}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBF7F0] text-[#1E1E24] border border-[#e5d8c3] hover:bg-[#f3ece0] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1 text-center px-2">
          {eyebrow && <p className="text-[10px] font-bold text-[#D48924] uppercase tracking-wider">{eyebrow}</p>}
          {title && <h1 className="text-base font-bold text-[#1E1E24] truncate">{title}</h1>}
        </div>
        <div className="flex h-9 w-9 items-center justify-center">{right}</div>
      </header>
      {children}
    </div>
  );
}

/** Modern Bottom Sheet */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity p-0 sm:p-4">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#FDFBF7] border border-[#e8dfcf] shadow-2xl z-10 slide-up-modal overflow-hidden">
        {/* Header - Fixed / Sticky */}
        <div className="shrink-0 flex flex-col items-center bg-[#FDFBF7] pt-2.5 pb-2.5 border-b border-[#e8dfcf] px-5">
          <div className="h-1.5 w-12 rounded-full bg-slate-300 sm:hidden mb-1.5" />
          <div className="flex w-full items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#1E1E24]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#FBF7F0] border border-[#e5d8c3] p-1.5 text-slate-600 hover:bg-[#f3ece0] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Fixed Pinned Bottom Footer (Never moves on scroll) */}
        {footer && (
          <div className="shrink-0 border-t border-[#e8dfcf] bg-[#FDFBF7] px-4 py-3 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Fallback Image Display */
export function DishImg({
  name,
  className = '',
  alt = 'Sahi Crunch Snack',
}: {
  name: string;
  className?: string;
  alt?: string;
}) {
  const src = name.startsWith('/') || name.includes('.') ? name : `/images/${name}.webp`;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        // Fallback to high quality crisp snack fallback
        const target = e.currentTarget;
        if (!target.src.includes('in-03.webp')) {
          target.src = '/images/in-03.webp';
        }
      }}
      className={`object-cover ${className}`}
    />
  );
}

/** Modern Empty State */
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
  art?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#681121]/10 text-[#681121] mb-4 border border-[#681121]/20">
        <Zap size={36} />
      </div>
      <h3 className="text-lg font-bold text-[#1E1E24]">{title}</h3>
      <p className="mt-1.5 max-w-xs text-xs text-slate-500 leading-relaxed">{sub}</p>
      {cta && onCta && (
        <button
          type="button"
          onClick={onCta}
          className="mt-6 rounded-xl bg-[#681121] hover:bg-[#540c19] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#681121]/20 active:scale-95 transition-transform"
        >
          {cta}
        </button>
      )}
    </div>
  );
}

/** Status Pill */
export function Pill({
  children,
  tone = 'amber',
}: {
  children: ReactNode;
  tone?: 'open' | 'soon' | 'off' | 'amber' | 'green';
}) {
  const tones = {
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    soon: 'bg-amber-50 text-amber-700 border-amber-200',
    amber: 'bg-orange-50 text-orange-700 border-orange-200',
    off: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${
        tones[tone]
      }`}
    >
      {children}
    </span>
  );
}
