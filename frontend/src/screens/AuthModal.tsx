/**
 * AuthModal.tsx — Login & Register Modal for Sahi Crunch
 * Beautiful, animated modal with tab switching between Login and Register.
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function AuthModal() {
  const auth = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(auth.authModalMode);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setMode(auth.authModalMode);
    setError('');
  }, [auth.authModalMode]);

  if (!auth.showAuthModal) return null;

  const reset = () => {
    setName(''); setPhone(''); setEmail(''); setPassword(''); setError('');
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m); reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let err: string | null = null;

    if (mode === 'login') {
      if (loginMethod === 'email') {
        err = await auth.login(email, password);
      } else {
        err = await auth.loginPhone(phone, password);
      }
    } else {
      err = await auth.register(name, phone, email, password);
    }

    setLoading(false);
    if (err) setError(err);
    else reset();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) auth.closeAuthModal(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#e5d8c3] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#681121] via-[#701222] to-[#b87319] px-6 pt-7 pb-8 text-white">
          <button
            type="button"
            onClick={auth.closeAuthModal}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-9 w-9 rounded-xl overflow-hidden shadow-sm border border-white/20 bg-black/20 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Sahi Crunch" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold tracking-wider text-orange-200 uppercase">Sahi Crunch</div>
              <div className="text-xs text-orange-100">Bhopal's Snack Hub</div>
            </div>
          </div>

          <h2 className="text-2xl font-black mt-4 leading-tight">
            {mode === 'login' ? 'Welcome Back! 👋' : 'Join Sahi Crunch 🎉'}
          </h2>
          <p className="text-sm text-orange-100 mt-1">
            {mode === 'login'
              ? 'Log in to track orders & earn rewards.'
              : 'Create an account and get 120 bonus points!'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#FBF7F0] border-b border-[#e5d8c3]">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 py-3 text-sm font-extrabold transition-colors ${
                mode === m
                  ? 'text-[#681121] border-b-2 border-[#681121] bg-[#FDFBF7]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          {/* Register: Name */}
          {mode === 'register' && (
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#FBF7F0] border border-[#e5d8c3] rounded-xl text-sm font-medium text-[#1E1E24] placeholder-slate-400 focus:outline-none focus:border-[#681121] focus:ring-1 focus:ring-[#681121]/20 transition-all"
              />
            </div>
          )}

          {/* Login method toggle */}
          {mode === 'login' && (
            <div className="flex gap-2">
              {(['email', 'phone'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setLoginMethod(m)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors ${
                    loginMethod === m
                      ? 'bg-[#681121] text-white border-[#681121]'
                      : 'bg-[#FBF7F0] text-slate-500 border-[#e5d8c3] hover:bg-[#f3ece0]'
                  }`}
                >
                  {m === 'email' ? '📧 Email' : '📱 Phone'}
                </button>
              ))}
            </div>
          )}

          {/* Phone field */}
          {(mode === 'register' || loginMethod === 'phone') && (
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                placeholder="Phone Number (+91...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={mode === 'register' || loginMethod === 'phone'}
                className="w-full pl-10 pr-4 py-3 bg-[#FBF7F0] border border-[#e5d8c3] rounded-xl text-sm font-medium text-[#1E1E24] placeholder-slate-400 focus:outline-none focus:border-[#681121] focus:ring-1 focus:ring-[#681121]/20 transition-all"
              />
            </div>
          )}

          {/* Email field */}
          {(mode === 'register' || loginMethod === 'email') && (
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={mode === 'register' || loginMethod === 'email'}
                className="w-full pl-10 pr-4 py-3 bg-[#FBF7F0] border border-[#e5d8c3] rounded-xl text-sm font-medium text-[#1E1E24] placeholder-slate-400 focus:outline-none focus:border-[#681121] focus:ring-1 focus:ring-[#681121]/20 transition-all"
              />
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder={mode === 'register' ? 'Create Password (min 6 chars)' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === 'register' ? 6 : 1}
              className="w-full pl-10 pr-12 py-3 bg-[#FBF7F0] border border-[#e5d8c3] rounded-xl text-sm font-medium text-[#1E1E24] placeholder-slate-400 focus:outline-none focus:border-[#681121] focus:ring-1 focus:ring-[#681121]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#681121] hover:bg-[#540c19] disabled:opacity-70 text-white font-black py-3.5 rounded-xl shadow-lg shadow-[#681121]/20 transition-all active:scale-98"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Log In' : 'Create Account'}</span>
                <Sparkles size={15} className="text-orange-200" />
              </>
            )}
          </button>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
            <ShieldCheck size={12} className="text-[#4E8B56]" />
            <span>Your data is secure & never shared</span>
          </div>
        </form>
      </div>
    </div>
  );
}
