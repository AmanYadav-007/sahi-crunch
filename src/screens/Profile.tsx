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
} from 'lucide-react';
import { useApp, tierOf } from '../store';
import { TIERS } from '../data';
import { locations } from '../data/locations';
import { TabHeader } from '../ui';
import { useAuth } from '../lib/AuthContext';

export default function Profile() {
  const push = useApp((s) => s.push);
  const locationId = useApp((s) => s.locationId);
  const points = useApp((s) => s.points);

  const auth = useAuth();
  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const tier = TIERS[tierOf(points)];

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(auth.user?.name ?? '');
  const [editEmail, setEditEmail] = useState(auth.user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setEditError('');
    const err = await auth.updateProfile({ name: editName, email: editEmail });
    setSaving(false);
    if (err) setEditError(err);
    else setEditing(false);
  };

  const displayName = auth.user?.name || 'Sahi Crunch Member';
  const displayPhone = auth.user?.phone || '';
  const displayEmail = auth.user?.email || '';
  const initial = displayName[0]?.toUpperCase() ?? 'S';

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-36 text-[#1E1E24]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 max-w-4xl mx-auto">

        {/* User Profile Card */}
        <div className="bg-[#FBF7F0] p-5 rounded-3xl border border-[#e5d8c3] shadow-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#681121] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#681121]/20">
                {initial}
              </div>
              <div>
                {!editing ? (
                  <>
                    <h2 className="text-base font-extrabold text-[#1E1E24] leading-tight">{displayName}</h2>
                    {displayPhone && <p className="text-xs text-slate-500 font-medium mt-0.5">{displayPhone}</p>}
                    {displayEmail && <p className="text-xs text-slate-400 mt-0.5">{displayEmail}</p>}
                  </>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-sm font-bold border border-[#e5d8c3] rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-[#681121]"
                      placeholder="Your name"
                    />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-sm border border-[#e5d8c3] rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-[#681121]"
                      placeholder="Email address"
                    />
                    {editError && <p className="text-xs text-red-600 font-medium">{editError}</p>}
                  </div>
                )}
                {!editing && (
                  <div className="mt-1.5 inline-flex items-center gap-1 bg-[#D48924]/15 text-[#b87319] border border-[#D48924]/30 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    <Sparkles size={11} className="text-[#D48924] fill-[#D48924]" />
                    <span>{tier.name} CLUB MEMBER</span>
                  </div>
                )}
              </div>
            </div>

            {/* Auth State Buttons */}
            {auth.isLoggedIn ? (
              <div className="flex gap-2">
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => { setEditName(auth.user?.name ?? ''); setEditEmail(auth.user?.email ?? ''); setEditing(true); }}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#681121]/10 text-[#681121] hover:bg-[#681121]/20 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                ) : (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setEditing(false); setEditError(''); }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4E8B56] text-white hover:bg-[#3d7044] transition-colors"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={auth.openLogin}
                className="flex items-center gap-1.5 bg-[#681121] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-colors hover:bg-[#540c19]"
              >
                <LogIn size={14} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Not logged in prompt */}
          {!auth.isLoggedIn && (
            <div className="mt-4 p-3.5 bg-[#681121]/5 rounded-2xl border border-[#681121]/15">
              <p className="text-xs text-[#681121] font-semibold leading-relaxed">
                🎁 Login to track orders, earn Crunch Rewards points, and get exclusive member offers!
              </p>
              <button
                type="button"
                onClick={auth.openRegister}
                className="mt-2.5 w-full bg-[#681121] text-white text-xs font-extrabold py-2.5 rounded-xl shadow-sm transition-colors hover:bg-[#540c19]"
              >
                Create Free Account & Get 120 Points →
              </button>
            </div>
          )}
        </div>

        {/* Loyalty Points Card */}
        <div
          onClick={() => push({ type: 'loyalty' })}
          className="bg-gradient-to-r from-[#681121] via-[#701222] to-[#b87319] text-white p-5 rounded-3xl shadow-lg shadow-[#681121]/20 cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E2952A]">
              Crunch Rewards Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-[#FDFBF7]">{points}</span>
              <span className="text-xs font-bold text-orange-100">Points Available</span>
            </div>
            <p className="text-xs text-orange-100 mt-1">
              Redeem for free packs & instant bill discounts →
            </p>
          </div>
          <ChevronRight size={24} className="text-white/80" />
        </div>

        {/* Settings Links */}
        <div className="bg-[#FBF7F0] rounded-3xl border border-[#e5d8c3] shadow-card divide-y divide-[#e8dfcf]">
          <button
            type="button"
            onClick={() => push({ type: 'location' })}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f3ece0] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#681121]/10 text-[#681121] flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E1E24]">Saved Addresses</p>
                <p className="text-[11px] text-slate-500">{branch.area}, Bhopal</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => push({ type: 'offers' })}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f3ece0] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#681121]/10 text-[#681121] flex items-center justify-center">
                <Award size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E1E24]">Offers & Coupons</p>
                <p className="text-[11px] text-slate-500">View available promo codes & discounts</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => window.open('https://wa.me/91XXXXXXXXXX?text=Hi%20Sahi%20Crunch,%20I%20need%20help%20with%20an%20order', '_blank')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">WhatsApp Concierge</p>
                <p className="text-[11px] text-slate-500">Live chat support & bulk queries</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => { navigator.clipboard?.writeText('https://sahicrunch.in'); alert('App link copied to clipboard!'); }}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Share2 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Share App</p>
                <p className="text-[11px] text-slate-500">Refer friends & earn 200 points</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Logout / Login */}
        <div className="pt-2">
          {auth.isLoggedIn ? (
            <button
              type="button"
              onClick={async () => {
                if (window.confirm('Log out of Sahi Crunch?')) await auth.logout();
              }}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-bold transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={auth.openLogin}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-[#681121]/30 text-[#681121] bg-[#681121]/5 hover:bg-[#681121]/10 text-xs font-bold transition-colors"
            >
              <LogIn size={16} />
              <span>Login / Create Account</span>
            </button>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-400 font-medium pt-4">
          SAHI CRUNCH · App v2.4.0 · Bhopal, MP
        </p>
      </div>
    </div>
  );
}
