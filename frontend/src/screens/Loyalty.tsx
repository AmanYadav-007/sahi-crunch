import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Check, Lock, ArrowRight, Award } from 'lucide-react';
import { useApp, tierOf } from '../store';
import { TIERS, rewards } from '../data';
import { Screen } from '../ui';
import { useAuth } from '../lib/AuthContext';
import { loyaltyApi } from '../lib/api';

export default function Loyalty() {
  const points = useApp((s) => s.points);
  const addPoints = useApp((s) => s.addPoints);
  const auth = useAuth();
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isLoggedIn) return;
    loyaltyApi.get().then(({ data }) => {
      if (data && typeof data.points === 'number') {
        const diff = data.points - points;
        if (diff !== 0) addPoints(diff);
      }
    });
  }, [auth.isLoggedIn, points, addPoints]);

  const tierIdx = tierOf(points);
  const tier = TIERS[tierIdx];
  const next = TIERS[tierIdx + 1];

  const redeem = (id: string, cost: number, name: string) => {
    if (points < cost || redeemed.includes(id)) return;
    addPoints(-cost);
    setRedeemed((r) => [...r, id]);
    setFlash(`${name.toUpperCase()} REWARD UNLOCKED! Added to your account.`);
    window.setTimeout(() => setFlash(null), 3200);
  };

  return (
    <Screen eyebrow="Rewards Program" title="Crunch Club Points">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-4 space-y-5 max-w-5xl mx-auto pb-32">
        {/* Points Balance Banner - Maroon & Amber style */}
        <div className="bg-gradient-to-br from-[#681121] via-[#701222] to-[#1E1E24] text-white p-5 rounded-3xl shadow-xl shadow-[#681121]/25 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 bg-black/25 text-[#E2952A] text-xs font-black px-3 py-1 rounded-full uppercase">
              <Sparkles size={13} className="fill-[#E2952A]" />
              {tier.name} VIP TIER
            </span>
            <span className="text-xs font-bold text-amber-200">1 pt = ₹1 Cashback</span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black">{points}</span>
            <span className="text-sm font-bold text-amber-200">Crunch Points</span>
          </div>
          <p className="text-xs text-amber-100/80 mt-1">
            Earn 1 point on every ₹10 spent on Sahi Crunch small batches.
          </p>

          {/* Progress bar */}
          {next && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-xs font-bold text-amber-200 mb-1">
                <span>{tier.name}</span>
                <span>{next.from - points} pts to {next.name}</span>
              </div>
              <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D48924] to-[#E2952A] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (points / next.from) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {flash && (
          <div className="bg-[#4E8B56]/15 border border-[#4E8B56] text-[#4E8B56] p-3 rounded-2xl text-xs font-bold text-center">
            {flash}
          </div>
        )}

        {/* Redeemable Rewards List */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase text-[#1E1E24]/60 tracking-wider">
            Available Rewards to Redeem
          </h3>

          {rewards.map((r) => {
            const isOwned = redeemed.includes(r.id);
            const canAfford = points >= r.cost;

            return (
              <div
                key={r.id}
                className="bg-[#FBF7F0] p-4 rounded-2xl border border-[#e5d8c3] shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#681121]/10 text-[#681121] flex items-center justify-center font-bold">
                    <Gift size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1E24]">{r.name}</h4>
                    <p className="text-[11px] font-black text-[#D48924] mt-0.5">
                      {r.cost} Points
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAfford || isOwned}
                  onClick={() => redeem(r.id, r.cost, r.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isOwned
                      ? 'bg-[#4E8B56]/15 text-[#4E8B56] border border-[#4E8B56]'
                      : canAfford
                      ? 'bg-[#681121] hover:bg-[#540c19] text-white shadow-md'
                      : 'bg-[#1E1E24]/5 text-[#1E1E24]/30 cursor-not-allowed'
                  }`}
                >
                  {isOwned ? 'Redeemed ✓' : canAfford ? 'Redeem' : 'Locked'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
