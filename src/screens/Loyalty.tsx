import { useState } from 'react';
import { Check, Sparkles, Lock, Gift } from 'lucide-react';
import { useApp, tierOf } from '../store';
import { TIERS, rewards } from '../data';
import { Screen, Pill } from '../ui';

export default function Loyalty() {
  const points = useApp((s) => s.points);
  const addPoints = useApp((s) => s.addPoints);
  const referralCode = useApp((s) => s.referralCode);
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const tierIdx = tierOf(points);
  const tier = TIERS[tierIdx];
  const next = TIERS[tierIdx + 1] ?? null;
  const span = next ? next.from - tier.from : 1;
  const progress = next ? Math.min(100, ((points - tier.from) / span) * 100) : 100;

  const redeem = (id: string, cost: number, name: string) => {
    if (points < cost || redeemed.includes(id)) return;
    addPoints(-cost);
    setRedeemed((r) => [...r, id]);
    setFlash(`${name.toUpperCase()} IS YOURS — SHOW THE CODE AT THE TABLE.`);
    window.setTimeout(() => setFlash(null), 3200);
  };

  return (
    <Screen eyebrow="GHARELU HUB" title="YOUR POINTS">
      <div className="space-y-8 px-5 pt-5">
        {/* balance */}
        <section className="card-amber relative overflow-hidden p-6">
          <div className="grain absolute inset-0" />
          <div className="relative">
            <span className="label gold flex items-center gap-2">
              <Sparkles size={12} /> {tier.name} MEMBER
            </span>
            <div className="mt-3 flex items-end justify-between">
              <span className="num text-6xl leading-none text-ivory">{points}</span>
              <span className="eyebrow pb-2">POINTS</span>
            </div>

            <div className="mt-6 h-1.5 w-full bg-ivory/10">
              <div
                className="h-1.5 bg-gradient-to-r from-amber to-chili transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="eyebrow">{tier.name}</span>
              <span className="label gold">
                {next ? `${next.from - points} PTS TO ${next.name}` : 'TOP OF THE HOUSE'}
              </span>
            </div>
          </div>
        </section>

        {flash && (
          <p className="border border-herb/50 bg-herb/10 px-4 py-3 label text-herb fade-in">{flash}</p>
        )}

        {/* ladder */}
        <section>
          <h2 className="mb-3 label text-ivory">THE LADDER</h2>
          <ul className="space-y-2">
            {TIERS.map((t, i) => {
              const owned = i <= tierIdx;
              const current = i === tierIdx;
              return (
                <li
                  key={t.id}
                  className={`border p-4 transition-colors ${
                    current ? 'card-amber' : owned ? 'card' : 'card opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                          owned ? 'border-amber text-amber' : 'hair-2 border text-ivory-faint'
                        }`}
                      >
                        {owned ? <Check size={13} strokeWidth={3} /> : <Lock size={12} />}
                      </span>
                      <span className={`font-display text-xl font-semibold ${current ? 'text-amber' : 'text-ivory'}`}>
                        {t.name}
                      </span>
                    </span>
                    <span className="eyebrow num">{t.from.toLocaleString('en-IN')} PTS</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 pl-9">
                    {t.perks.map((p) => (
                      <span key={p} className="caption">
                        · {p}
                      </span>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* rewards */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 label text-ivory">
            <Gift size={13} className="text-amber" /> SPEND THE POINTS
          </h2>
          <ul className="space-y-2">
            {rewards.map((r) => {
              const owned = redeemed.includes(r.id);
              const afford = points >= r.cost;
              return (
                <li key={r.id} className="card flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] text-ivory">{r.name}</p>
                    <p className="num label gold">{r.cost.toLocaleString('en-IN')} PTS</p>
                  </div>
                  <button
                    type="button"
                    disabled={!afford || owned}
                    onClick={() => redeem(r.id, r.cost, r.name)}
                    className={`shrink-0 border px-4 py-2 label transition-all ${
                      owned
                        ? 'border-herb/50 bg-herb/15 text-herb'
                        : afford
                          ? 'border-amber bg-amber/12 text-amber hover:bg-amber hover:text-ink-950'
                          : ''
                    }`}
                  >
                    {owned ? 'REDEEMED' : afford ? 'REDEEM' : 'LOCKED'}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* how to earn */}
        <section className="card p-5">
          <h3 className="mb-3 label text-ivory">HOW POINTS ARRIVE</h3>
          <ul className="body space-y-2">
            <li className="flex justify-between">
              <span>Every ₹10 spent on an order</span>
              <span className="num gold">+1</span>
            </li>
            <li className="flex justify-between">
              <span>Placing a reservation</span>
              <span className="num gold">+50</span>
            </li>
            <li className="flex justify-between">
              <span>A friend uses your code</span>
              <span className="num gold">+200</span>
            </li>
            <li className="flex justify-between">
              <span>Redeeming a reward</span>
              <span className="num text-chili">−COST</span>
            </li>
          </ul>
        </section>

        {/* referral */}
        <section className="pb-2 text-center">
          <Pill tone="amber">YOUR CODE · {referralCode}</Pill>
          <p className="body mt-3">
            Share it. They eat, you both earn 200 points.
          </p>
        </section>
      </div>
    </Screen>
  );
}
