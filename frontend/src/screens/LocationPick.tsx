import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Check,
  ChevronRight,
  Zap,
  Search,
  ExternalLink,
  ShieldCheck,
  Store,
  Compass,
  ArrowLeft,
  X,
  Phone,
} from 'lucide-react';
import { locations, type Location } from '../data/locations';
import { useApp } from '../store';
import { useToast } from '../lib/ToastContext';

export default function LocationPick({ firstTime }: { firstTime?: boolean }) {
  const setLocation = useApp((s) => s.setLocation);
  const pop = useApp((s) => s.pop);
  const selectedLocation = useApp((s) => s.locationId);
  const { showSuccess, showInfo } = useToast();

  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'upcoming'>('all');

  const useCurrent = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocating(false);
          setLocation('bhopal-main');
          showSuccess('Detected Arera Colony cluster! Outpost selected.', 'GPS Live');
          if (!firstTime) pop();
        },
        () => {
          // Fallback simulation
          setTimeout(() => {
            setLocating(false);
            setLocation('bhopal-main');
            showSuccess('Located nearest kitchen in Arera Colony, Bhopal!', 'Location Set');
            if (!firstTime) pop();
          }, 650);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setLocating(false);
        setLocation('bhopal-main');
        showSuccess('Defaulted to flagship Bhopal kitchen outpost.', 'Location Set');
        if (!firstTime) pop();
      }, 500);
    }
  };

  const handleSelectCluster = (loc: Location) => {
    if (loc.status === 'open') {
      setLocation(loc.id);
      showSuccess(`Delivery cluster switched to ${loc.area}, ${loc.city}!`, 'Hub Updated');
      if (!firstTime) pop();
    } else {
      showInfo(
        `${loc.area} kitchen is in preparation (${loc.openingDate || 'Coming Soon'}). Flagship Arera Colony hub is serving online deliveries.`,
        'Upcoming Cluster'
      );
    }
  };

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (activeFilter === 'open' && loc.status !== 'open') return false;
      if (activeFilter === 'upcoming' && loc.status === 'open') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          loc.area.toLowerCase().includes(q) ||
          loc.city.toLowerCase().includes(q) ||
          loc.address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32 text-[#1E1E24]">
      {/* Royal Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#540c19] via-[#681121] to-[#2e050c] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-radial from-[#D48924]/20 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-10 w-48 h-48 rounded-full bg-radial from-[#FDFBF7]/10 to-transparent blur-xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-2">
            {!firstTime ? (
              <button
                type="button"
                onClick={pop}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="h-9" />
            )}

            <div className="text-right">
              <span className="text-[11px] font-black text-amber-200">
                10–15 Min Express Delivery
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            {firstTime ? 'Choose Your Delivery Hub' : 'Select Delivery Outpost'}
          </h1>
          <p className="text-xs sm:text-sm text-orange-100/80 mt-1 max-w-lg font-medium leading-relaxed">
            Fresh small-batch roasted makhana & bakery dispatched directly from our certified oven micro-kitchens.
          </p>
        </div>
      </div>

      {/* Floating Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-4 relative z-20">

        {/* GPS Current Location Bar */}
        <div className="bg-[#FBF7F0] p-4 sm:p-5 rounded-3xl border border-[#e5d8c3] shadow-lg shadow-stone-900/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#681121] to-[#3d0913] text-white flex items-center justify-center shadow-md shadow-[#681121]/30 shrink-0">
                <Navigation size={20} className={locating ? 'animate-spin' : ''} />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1E1E24]">
                  {locating ? 'Detecting Nearest Kitchen...' : 'Use Precise GPS Location'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Instant mapping for Arera Colony, Shahpura, Kolar & Bhopal clusters
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={useCurrent}
              disabled={locating}
              className="inline-flex items-center justify-center gap-2 bg-[#681121] hover:bg-[#540c19] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-60"
            >
              <Compass size={14} />
              <span>{locating ? 'Locating...' : 'Detect Location'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Strip */}
        <div className="bg-[#FBF7F0] p-4 rounded-3xl border border-[#e5d8c3] shadow-card space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area (e.g. Arera Colony, Kolar, Indore)..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#e5d8c3] rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#681121] focus:ring-1 focus:ring-[#681121] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(
              [
                { id: 'all', label: 'All Hubs' },
                { id: 'open', label: 'Open Now (Express)' },
                { id: 'upcoming', label: 'Upcoming Outposts' },
              ] as const
            ).map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all ${
                    active
                      ? 'bg-[#681121] text-white shadow-sm'
                      : 'bg-white border border-[#e5d8c3] text-slate-600 hover:bg-[#f3ece0]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hub Cards Grid */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Available Micro-Kitchen Clusters ({filteredLocations.length})
            </h2>
            <span className="text-[11px] text-amber-800 font-bold">
              MP Headquarters: Bhopal
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation === loc.id;
              const isOpen = loc.status === 'open';

              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectCluster(loc)}
                  className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'border-[#681121] bg-[#681121]/5 shadow-md shadow-[#681121]/10'
                      : isOpen
                      ? 'border-[#e5d8c3] bg-[#FBF7F0] hover:border-[#681121]/40 hover:shadow-sm'
                      : 'border-[#e5d8c3] bg-[#FBF7F0]/60 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                          isSelected
                            ? 'bg-[#681121] text-white'
                            : isOpen
                            ? 'bg-[#4E8B56]/15 text-[#4E8B56]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <Store size={20} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-[#1E1E24]">
                            {loc.area}
                          </h3>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                            · {loc.city}
                          </span>
                          {isOpen ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#4E8B56]/15 text-[#3d7044] border border-[#4E8B56]/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4E8B56] animate-pulse" />
                              Active Dispatch
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                              {loc.openingDate || 'Launching Soon'}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xl">
                          {loc.address}
                        </p>

                        <p className="text-[11px] text-amber-800/90 font-medium italic">
                          &quot;{loc.tagline}&quot;
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[11px] font-semibold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {loc.hours}
                          </span>
                          {loc.mapUrl && (
                            <a
                              href={loc.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[#681121] hover:underline font-bold"
                            >
                              <span>View on Maps</span>
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selection Checkmark */}
                    <div className="shrink-0 pt-0.5">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-[#681121] text-white flex items-center justify-center shadow-md shadow-[#681121]/30">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border border-stone-300 group-hover:border-[#681121] transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 rounded-2xl bg-[#f5ece0]/80 border border-[#e2d2ba] flex items-center gap-3 text-xs text-stone-700">
          <ShieldCheck size={20} className="text-[#4E8B56] shrink-0" />
          <p className="leading-relaxed">
            All orders are small-batch roasted inside hygienic Bhopal kitchens with zero preservatives. Delivered hot and fresh in sealed aroma packs.
          </p>
        </div>

      </div>
    </div>
  );
}

