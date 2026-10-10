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
    <Screen eyebrow="Deals" title="Offers & Coupons">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-4 space-y-4 max-w-6xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((o) => (
          <div
            key={o.id}
            className="bg-[#FBF7F0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[#681121]/10 text-[#681121] flex items-center justify-center font-black shrink-0">
                <Percent size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-black text-[#681121] tracking-tight block">
                  {o.value}
                </span>
                <p className="text-xs font-bold text-[#1E1E24] mt-0.5">{o.title}</p>
                <p className="text-[11px] text-[#1E1E24]/60 mt-0.5 leading-relaxed">{o.sub}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyCode(o.code)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-[#D48924] bg-[#D48924]/10 text-[#681121] text-xs font-extrabold active:scale-95 transition-transform"
            >
              {copied === o.code ? (
                <>
                  <Check size={13} className="text-[#4E8B56]" />
                  <span className="text-[#4E8B56]">COPIED</span>
                </>
              ) : (
                <span>{o.code}</span>
              )}
            </button>
          </div>
        ))}
        </div>
      </div>
    </Screen>
  );
}
