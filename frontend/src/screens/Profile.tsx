import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Award,
  ChevronRight,
  LogOut,
  LogIn,
  MessageCircle,
  Share2,
  Pencil,
  Check,
  X,
  Loader2,
  ShieldCheck,
  CreditCard,
  Gift,
  Heart,
  Clock,
  HelpCircle,
  ArrowRight,
  Copy,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useApp, tierOf } from '../store';
import { TIERS } from '../data';
import { locations } from '../data/locations';
import { useAuth } from '../lib/AuthContext';
import { proxyApi } from '../lib/api';
import { useToast } from '../lib/ToastContext';

export default function Profile() {
  const push = useApp((s) => s.push);
  const setTab = useApp((s) => s.setTab);
  const locationId = useApp((s) => s.locationId);
  const points = useApp((s) => s.points);

  const auth = useAuth();
  const { showSuccess, confirm } = useToast();
  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const tierIndex = tierOf(points);
  const tier = TIERS[tierIndex];
  const nextTier = TIERS[Math.min(tierIndex + 1, TIERS.length - 1)];

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(auth.user?.name ?? '');
  const [editEmail, setEditEmail] = useState(auth.user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [vegMode, setVegMode] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setEditError('');
    const err = await auth.updateProfile({ name: editName, email: editEmail });
    setSaving(false);
    if (err) {
      setEditError(err);
    } else {
      setEditing(false);
      showSuccess('Profile details updated successfully!');
    }
  };

  const handleShareApp = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sahicrunch.in';
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      showSuccess('Referral link copied to clipboard! Share with friends to earn points.', 'Invite Link');
      setTimeout(() => setCopiedShare(false), 2400);
    } else {
      showSuccess('Referral link ready: ' + shareUrl, 'Invite Link');
    }
  };

  const displayName = auth.user?.name || (auth.isLoggedIn ? 'Sahi Foodie' : 'Guest Foodie');
  const displayPhone = auth.user?.phone || '';
  const displayEmail = auth.user?.email || '';
  const initial = displayName[0]?.toUpperCase() ?? 'S';

  // Tier progress estimation
  const tierMin = tier.from;
  const tierNextMin = nextTier.from > tierMin ? nextTier.from : tierMin + 500;
  const progressPercent = Math.min(
    100,
    Math.max(12, Math.round(((points - tierMin) / (tierNextMin - tierMin || 1)) * 100))
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32 text-[#1E1E24]">
      {/* Editorial Luxury Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#540c19] via-[#681121] to-[#2e050c] text-white pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-radial from-[#D48924]/25 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-10 w-48 h-48 rounded-full bg-radial from-[#FDFBF7]/10 to-transparent blur-xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                Member Profile
              </h1>
            </div>

            {auth.isLoggedIn ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={auth.openLogin}
                className="flex items-center gap-1.5 bg-[#D48924] hover:bg-[#c37b1d] text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Floating Overlay */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 space-y-5 relative z-20">

        {/* 1. Identity & Card */}
        <div className="bg-[#FBF7F0] rounded-3xl p-6 border border-[#e5d8c3] shadow-xl shadow-stone-900/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#681121] to-[#3a0812] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#681121]/30 border-2 border-white">
                  {initial}
                </div>
                {auth.isLoggedIn && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#4E8B56] text-white flex items-center justify-center border-2 border-white shadow-sm" title="Verified Account">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {!editing ? (
                  <>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-[#1E1E24] truncate">
                        {displayName}
                      </h2>
                      {auth.isLoggedIn && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditName(auth.user?.name ?? '');
                            setEditEmail(auth.user?.email ?? '');
                            setEditing(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#681121] hover:bg-[#681121]/10 transition-colors"
                          title="Edit Personal Info"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium mt-0.5">
                      {displayPhone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-slate-400" />
                          {displayPhone}
                        </span>
                      )}
                      {displayEmail && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-slate-400" />
                          {displayEmail}
                        </span>
                      )}
                      {!displayPhone && !displayEmail && (
                        <span className="text-amber-800/80 font-semibold text-[11px]">
                          Guest Access · Sign in to preserve your history
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 mt-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-sm font-bold border border-[#e5d8c3] rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-[#681121] focus:ring-1 focus:ring-[#681121]"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-xs border border-[#e5d8c3] rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-[#681121] focus:ring-1 focus:ring-[#681121]"
                      placeholder="Email Address"
                    />
                    {editError && <p className="text-xs text-red-600 font-semibold">{editError}</p>}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 bg-[#4E8B56] hover:bg-[#3d7044] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditing(false); setEditError(''); }}
                        className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        <X size={13} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-2 sm:self-center">
              <div className="flex-1 sm:flex-initial bg-[#F5ECE0] border border-[#e2d2ba] rounded-2xl px-4 py-2 text-center">
                <span className="block text-[10px] font-black uppercase text-amber-800/80 tracking-wide">
                  Tier Status
                </span>
                <span className="text-sm font-black text-[#681121]">{tier.name}</span>
              </div>
              <div className="flex-1 sm:flex-initial bg-[#F5ECE0] border border-[#e2d2ba] rounded-2xl px-4 py-2 text-center">
                <span className="block text-[10px] font-black uppercase text-amber-800/80 tracking-wide">
                  Crunch Pts
                </span>
                <span className="text-sm font-black text-[#b87319]">{points}</span>
              </div>
            </div>
          </div>

          {/* Guest welcome callout */}
          {!auth.isLoggedIn && (
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-[#681121]/10 via-[#D48924]/10 to-[#681121]/5 border border-[#681121]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-extrabold text-[#681121] flex items-center gap-1.5">
                  <Gift size={15} className="text-[#D48924]" />
                  Unlock 120 Welcome Points & Secret Offers
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Sign in with your phone or email to activate exclusive club discounts and live tracking.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={auth.openRegister}
                  className="flex-1 sm:flex-initial text-xs font-extrabold bg-[#681121] hover:bg-[#540c19] text-white px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                  Join Free
                </button>
                <button
                  type="button"
                  onClick={auth.openLogin}
                  className="flex-1 sm:flex-initial text-xs font-bold bg-white text-[#681121] border border-[#681121]/30 hover:bg-slate-50 px-3 py-2 rounded-xl transition-all"
                >
                  Log In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Interactive VIP Club Loyalty Card */}
        <div
          onClick={() => push({ type: 'loyalty' })}
          className="relative overflow-hidden bg-gradient-to-br from-[#681121] via-[#751728] to-[#b87319] text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#681121]/20 border border-white/20 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:scale-[1.007]"
        >
          {/* Card Decorative Elements */}
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-56 h-56 rounded-full bg-white/10 blur-2xl group-hover:bg-white/15 transition-all" />
          <div className="absolute left-1/3 -bottom-10 w-40 h-40 rounded-full bg-[#E2952A]/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black tracking-widest uppercase text-amber-200 border border-white/20">
                  {tier.name} CLUB PASSPORT
                </span>
                <span className="text-[11px] font-semibold text-white/70">
                  Tap for rewards vault →
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-orange-200/90 font-bold">
                  Available Crunch Balance
                </p>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    {points}
                  </span>
                  <span className="text-sm font-extrabold text-orange-200">Points</span>
                  <span className="text-xs text-white/80 font-medium ml-1">
                    (₹{(points * 0.5).toFixed(0)} cashback value)
                  </span>
                </div>
              </div>

              {/* Tier Progress Bar */}
              <div className="pt-1 max-w-md">
                <div className="flex justify-between text-[11px] font-bold text-orange-100/90 mb-1.5">
                  <span>Current: {tier.name}</span>
                  <span>Next: {nextTier.name} ({tierNextMin} pts)</span>
                </div>
                <div className="h-2 w-full bg-black/25 rounded-full overflow-hidden p-0.5 backdrop-blur-sm border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#F5C26B] via-[#FFE4A0] to-[#E2952A] rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/75 mt-1.5">
                  Earn 10 points per ₹100 spent · Unlock free side dishes at {tierNextMin} points
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l border-white/15 pt-4 sm:pt-0 sm:pl-6">
              <div className="text-left sm:text-right">
                <span className="block text-[10px] uppercase font-bold text-orange-200">Redeem Perks</span>
                <span className="text-xs font-black text-white">Instant Cart Discount</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#681121] transition-all">
                <ChevronRight size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Quick Foodie Preferences */}
        <div className="bg-[#FBF7F0] rounded-3xl p-5 border border-[#e5d8c3] shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#4E8B56]/15 text-[#4E8B56] flex items-center justify-center">
                <Sliders size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-[#1E1E24]">Pure Vegetarian Mode</p>
                <p className="text-xs text-slate-500 font-medium">
                  {vegMode ? 'Active: Showing green dot certified veg treats only' : 'Inactive: Showing entire royal snacking menu'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setVegMode((v) => !v)}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                vegMode ? 'bg-[#4E8B56]' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={vegMode}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  vegMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. Categorized Service Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1: Orders & Delivery */}
          <div className="bg-[#FBF7F0] rounded-3xl border border-[#e5d8c3] shadow-card divide-y divide-[#e8dfcf] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#f5ece0]/60 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-[#681121] tracking-wider">
                Orders & Delivery
              </span>
              <Clock size={14} className="text-[#681121]" />
            </div>

            <button
              type="button"
              onClick={() => setTab('orders')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f3ece0] transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#681121]/10 text-[#681121] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E1E24]">Active & Past Orders</p>
                  <p className="text-[11px] text-slate-500">Track kitchen dispatch, bills & receipts</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-[#681121] group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => push({ type: 'location' })}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f3ece0] transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#681121]/10 text-[#681121] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E1E24]">Saved Delivery Outpost</p>
                  <p className="text-[11px] text-slate-500">{branch.area}, {branch.city}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-[#681121] group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* Section 2: Rewards & Specials */}
          <div className="bg-[#FBF7F0] rounded-3xl border border-[#e5d8c3] shadow-card divide-y divide-[#e8dfcf] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#f5ece0]/60 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-[#681121] tracking-wider">
                Rewards & Club
              </span>
              <Award size={14} className="text-[#681121]" />
            </div>

            <button
              type="button"
              onClick={() => push({ type: 'offers' })}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f3ece0] transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#D48924]/15 text-[#D48924] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E1E24]">Offers, Coupons & Deals</p>
                  <p className="text-[11px] text-slate-500">View active promo codes & discounts</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-[#681121] group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={handleShareApp}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f3ece0] transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Share2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E1E24]">Invite Friends</p>
                  <p className="text-[11px] text-slate-500">
                    {copiedShare ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Link copied! Send via WhatsApp
                      </span>
                    ) : (
                      'Earn 200 points for every referral friend'
                    )}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-lg">
                +200 Pts
              </span>
            </button>
          </div>
        </div>

        {/* 5. Support & Direct Concierge */}
        <div className="bg-[#FBF7F0] rounded-3xl p-5 border border-[#e5d8c3] shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MessageCircle size={22} />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1E1E24]">Royal WhatsApp Concierge</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Instant order assistance, corporate bulk inquiries, or culinary feedback.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const msg = `Hi Sahi Crunch Concierge, I need assistance with my account/order.`;
                const { data } = await proxyApi.sendWhatsApp({ message: msg });
                if (data?.url) window.open(data.url, '_blank');
                else window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold px-4 py-3 rounded-2xl shadow-md transition-all active:scale-95"
            >
              <MessageCircle size={15} />
              <span>Connect on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* 6. Account Status / Session Control */}
        <div className="pt-2">
          {auth.isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                confirm({
                  title: 'Sign Out Confirmation',
                  message: 'Are you sure you want to sign out of your Sahi Crunch account on this device?',
                  confirmLabel: 'Yes, Sign Out',
                  cancelLabel: 'Keep Logged In',
                  variant: 'danger',
                  onConfirm: async () => {
                    await auth.logout();
                    showSuccess('You have been signed out safely.');
                  },
                });
              }}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-red-200/80 text-red-600 bg-red-50/60 hover:bg-red-100/70 text-xs font-extrabold transition-colors shadow-sm"
            >
              <LogOut size={16} />
              <span>Sign Out of Sahi Crunch</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={auth.openLogin}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-[#681121]/30 text-white bg-[#681121] hover:bg-[#540c19] text-xs font-black transition-all shadow-md active:scale-[0.99]"
            >
              <LogIn size={16} />
              <span>Sign In / Create VIP Account</span>
            </button>
          )}
        </div>

        {/* Footer Brand Info */}
        <div className="text-center pt-3 pb-6 space-y-1">
          <p className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
            SAHI CRUNCH LUXURY STREET FOOD · BHOPAL, MP
          </p>
          <p className="text-[10px] text-stone-400">
            Crafted for pure flavor & crispy perfection · App v2.4.0
          </p>
        </div>

      </div>
    </div>
  );
}

