import React from 'react';
import { Tag, Percent, Copy, Check, Ticket, ArrowRight } from 'lucide-react';
import { offers } from '../data';
import { Screen } from '../ui';

export default function Offers() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Screen eyebrow="Pinned by the counter" title="Offers & Coupons">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-6 space-y-4 max-w-6xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {offers.map((o, idx) => (
          <div
            key={o.id}
            className={`relative bg-[var(--paper-2)] paper-grain p-4 rounded-2xl border border-[var(--rule)] shadow-[3px_4px_0_rgba(84,12,25,0.05),0_16px_30px_-22px_rgba(84,12,25,0.4)] flex items-start justify-between gap-3 transition-all duration-300 hover:rotate-0 hover:shadow-[4px_6px_0_rgba(84,12,25,0.08),0_20px_40px_-24px_rgba(84,12,25,0.5)] ${
              idx % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm'
            }`}
          >
            {/* A strip of tape pinning the coupon to the board */}
            <span
              className={`absolute -top-2.5 z-10 w-14 h-5 bg-[#e6d3a3]/80 border-y border-white/50 shadow-sm pointer-events-none ${
                idx % 2 === 0 ? 'left-8 rotate-[-4deg]' : 'right-8 rotate-[3deg]'
              }`}
              aria-hidden="true"
            />

            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#D48924]/12 border-2 border-dashed border-[#D48924]/50 text-[#b87319] flex items-center justify-center shrink-0">
                <Percent size={20} />
              </div>
              <div className="min-w-0">
                <span className="font-hand italic text-2xl text-[#540c19] leading-none block marker w-fit">
                  {o.value}
                </span>
                <p className="font-note text-xs font-semibold text-[var(--ink)] mt-1.5">{o.title}</p>
                <p className="font-note text-[11px] text-[var(--ink-soft)] mt-0.5 leading-relaxed">{o.sub}</p>
              </div>
            </div>

            {/* Tear-off code chip */}
            <button
              type="button"
              onClick={() => copyCode(o.code)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-[#681121]/40 bg-[#681121]/6 text-[#681121] font-note text-xs font-semibold uppercase tracking-[0.1em] active:scale-95 transition-transform"
            >
              {copied === o.code ? (
                <>
                  <Check size={13} className="text-[#3d7044]" />
                  <span className="text-[#3d7044]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>{o.code}</span>
                </>
              )}
            </button>
          </div>
        ))}
        </div>

        {/* Handwritten footnote */}
        <p className="font-hand italic text-sm text-[var(--ink-soft)] pt-1">
          Stacks with nothing else, sorry — but the fresh-batch prices are already the fair ones.
        </p>
      </div>
    </Screen>
  );
}
