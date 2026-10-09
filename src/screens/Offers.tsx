import { useState } from 'react';
import { Copy, Check, Ticket, CalendarDays } from 'lucide-react';
import { useApp } from '../store';
import { offersFor } from '../data';
import { Screen, Empty, Pill } from '../ui';

export default function Offers() {
  const locationId = useApp((s) => s.locationId);
  const push = useApp((s) => s.push);
  const profile = useApp((s) => s.profile);
  const [copied, setCopied] = useState<string | null>(null);

  const list = offersFor(locationId);

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard can be blocked — the code stays visible on the card */
    }
    setCopied(code);
    window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1800);
  };

  return (
    <Screen eyebrow="AT THE HOUSE" title="OFFERS">
      {list.length === 0 ? (
        <Empty
          title="NO OFFERS HERE, YET"
          sub="This room is cooking something. Switch location or check back next week."
          cta="SWITCH LOCATION"
          onCta={() => push({ type: 'location' })}
          art="note"
        />
      ) : (
        <div className="space-y-5 px-5 pt-5">
          <p className="body">
            House offers for {profile.name ? `${profile.name.split(' ')[0]}, ` : ''}your table. Tap a code to copy —
            it applies at checkout.
          </p>

          <ul className="space-y-4">
            {list.map((o) => (
              <li key={o.id} className="card-dash relative overflow-hidden p-5">
                <div className="grain absolute inset-0" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="label gold flex items-center gap-2">
                      <Ticket size={12} /> {o.title}
                    </span>
                    <p className="num mt-2 text-3xl leading-none text-ivory">{o.value}</p>
                    <p className="body mt-2">{o.sub}</p>
                    <p className="caption mt-3">
                      {o.locations ? 'Select rooms only' : 'All rooms'} · One use per account
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Pill tone="amber">LIVE</Pill>
                  </div>
                </div>

                <div className="hair-t relative mt-4 flex items-center justify-between gap-3 pt-4">
                  <code className="num gold text-lg tracking-[0.25em]">{o.code}</code>
                  <button
                    type="button"
                    onClick={() => copy(o.code)}
                    className={`flex items-center gap-1.5 border px-3.5 py-2 label transition-all duration-300 ${
                      copied === o.code
                        ? 'border-herb bg-herb/15 text-herb'
                        : ''
                    }`}
                  >
                    {copied === o.code ? <Check size={12} /> : <Copy size={12} />}
                    {copied === o.code ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* recurring moments */}
          <section className="card p-5">
            <h2 className="label mb-3 flex items-center gap-2 text-ivory">
              <CalendarDays size={13} className="text-amber" /> MARK THE CALENDAR
            </h2>
            <ul className="body space-y-2.5">
              <li className="flex justify-between gap-3">
                <span>Weekday lunch, 12:00–15:00</span>
                <span className="num shrink-0 text-amber">₹250 OFF</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Monday–Thursday, any hour</span>
                <span className="num shrink-0 text-amber">15% OFF</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Orders above ₹1,499</span>
                <span className="num shrink-0 text-amber">FREE DESSERT</span>
              </li>
            </ul>
          </section>

          <button type="button" onClick={() => push({ type: 'checkout' })} className="btn-solid w-full !py-4">
            APPLY A CODE AT CHECKOUT
          </button>

          <p className="caption pb-4 text-center">
            Offers don’t stack. The house picks the kindest one for your bill.
          </p>
        </div>
      )}
    </Screen>
  );
}
