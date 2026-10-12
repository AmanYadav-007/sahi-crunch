import React, { useState, useMemo } from 'react';
import {
  Navigation,
  Clock,
  Check,
  Zap,
  Search,
  ExternalLink,
  ShieldCheck,
  Store,
  Compass,
  ArrowLeft,
  X,
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
    <div className="min-h-screen bg-[var(--paper)] paper-grain pb-32 text-[var(--ink)]">
      {/* Header — the cover page of the delivery ledger */}
      <div className="relative overflow-hidden bg-[var(--paper-3)]/60 paper-grain border-b border-[var(--rule)] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 inset-x-0 h-1 bg-[#C45688]" aria-hidden="true" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-2">
            {!firstTime ? (
              <button
                type="button"
                onClick={pop}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--paper-2)] border border-[var(--rule)] text-[#C45688] hover:bg-[var(--paper)] transition-colors"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="h-9" />
            )}

            <span className="stamp tilt-r-sm text-[#C45688] border-[#D86B9B]/60">
              <Zap size={11} className="fill-[#C45688]" />
              10–15 Min Express Delivery
            </span>
          </div>

          <h1 className="font-hand italic text-2xl sm:text-3xl text-[#8F2859] tracking-tight mt-1">
            {firstTime ? 'Which kitchen should we pack from?' : 'Choose your kitchen'}
          </h1>
          <svg viewBox="0 0 260 12" className="w-44 sm:w-56 h-3 mt-1.5" fill="none" aria-hidden="true">
            <path d="M3 8.5c30-5 58-6.5 88-5s56 4.5 86 3 48-5 78-6" stroke="#D86B9B" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <p className="font-note text-xs sm:text-sm text-[var(--ink-soft)] mt-2 max-w-lg leading-relaxed">
            Fresh small-batch roasted makhana &amp; bakery dispatched directly from our certified oven micro-kitchens.
          </p>
        </div>
      </div>

      {/* Pinned Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-4 relative z-20">

        {/* GPS Current Location Bar — a note with the compass drawing */}
        <div className="bg-[var(--paper-2)] paper-grain p-4 sm:p-5 rounded-3xl border border-[var(--rule)] shadow-[3px_4px_0_rgba(84,12,25,0.05),0_16px_30px_-22px_rgba(84,12,25,0.4)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#C45688] text-[#FDFBF7] flex items-center justify-center shrink-0 shadow-[2px_3px_0_rgba(36,4,9,0.35)]">
                <Navigation size={20} className={locating ? 'animate-spin' : ''} />
              </div>
              <div>
                <h3 className="font-hand italic text-lg text-[#8F2859] leading-tight">
                  {locating ? 'Detecting Nearest Kitchen...' : 'Use Precise GPS Location'}
                </h3>
                <p className="font-note text-xs text-[var(--ink-soft)] mt-0.5">
                  Instant mapping for Arera Colony, Shahpura, Kolar &amp; Bhopal clusters
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={useCurrent}
              disabled={locating}
              className="btn-ink inline-flex items-center justify-center gap-2 font-note text-xs font-semibold px-4 py-2.5 disabled:opacity-60"
            >
              <Compass size={14} />
              <span>{locating ? 'Locating...' : 'Detect Location'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Strip */}
        <div className="bg-[var(--paper-2)] paper-grain p-4 rounded-3xl border border-[var(--rule)] shadow-[3px_4px_0_rgba(84,12,25,0.05),0_16px_30px_-22px_rgba(84,12,25,0.4)] space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D86B9B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area (e.g. Arera Colony, Kolar, Indore)..."
              className="form-blank w-full pl-10 pr-9 py-2.5 font-note text-xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--ink-faint)] hover:text-[var(--ink)]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills — torn paper tabs */}
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
                  className={`font-note text-xs font-semibold px-3 py-1.5 rounded-xl border-2 transition-all ${
                    active
                      ? 'bg-[#C45688] border-[#C45688] text-[#FDFBF7] shadow-[2px_3px_0_rgba(36,4,9,0.3)]'
                      : 'bg-[var(--paper-2)] border-dashed border-[var(--rule)] text-[var(--ink-soft)] hover:border-[#D86B9B]'
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
          <div className="flex items-center justify-between gap-3 px-1">
            <h2 className="font-note text-[10px] font-semibold uppercase text-[var(--ink-faint)] tracking-[0.18em]">
              Kitchens on the list ({filteredLocations.length})
            </h2>
            <span className="font-hand italic text-sm text-[#C45688]">
              MP Headquarters: Bhopal
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredLocations.map((loc, i) => {
              const isSelected = selectedLocation === loc.id;
              const isOpen = loc.status === 'open';
              const tilt = i % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm';

              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectCluster(loc)}
                  className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${tilt} hover:tilt-0 ${
                    isSelected
                      ? 'border-[#C45688] bg-[#C45688]/5 shadow-[3px_4px_0_rgba(104,17,33,0.14)]'
                      : isOpen
                      ? 'bg-[var(--paper-2)] paper-grain border-[var(--rule)] shadow-[3px_4px_0_rgba(84,12,25,0.05),0_16px_30px_-22px_rgba(84,12,25,0.4)] hover:border-[#D86B9B]/70'
                      : 'bg-[var(--paper-3)]/40 border border-dashed border-[var(--rule)] opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                          isSelected
                            ? 'bg-[#C45688] text-[#FDFBF7] shadow-[2px_3px_0_rgba(36,4,9,0.3)]'
                            : isOpen
                            ? 'bg-[#4E8B56]/15 text-[#3d7044] border border-[#4E8B56]/40'
                            : 'bg-[#D86B9B]/15 text-[#C45688] border border-[#D86B9B]/40'
                        }`}
                      >
                        <Store size={20} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-hand italic text-lg text-[#8F2859] leading-tight">
                            {loc.area}
                          </h3>
                          <span className="font-note text-[11px] font-medium text-[var(--ink-faint)] uppercase tracking-wide">
                            · {loc.city}
                          </span>
                          {isOpen ? (
                            <span className="stamp tilt-r-sm text-[#3d7044] border-[#4E8B56]/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4E8B56] animate-pulse" />
                              Active Dispatch
                            </span>
                          ) : (
                            <span className="stamp tilt-l-sm text-[#C45688] border-[#D86B9B]/60">
                              {loc.openingDate || 'Launching Soon'}
                            </span>
                          )}
                        </div>

                        <p className="font-note text-xs text-[var(--ink-soft)] leading-relaxed max-w-xl">
                          {loc.address}
                        </p>

                        <p className="font-hand italic text-[13px] text-[var(--ink-soft)]">
                          &quot;{loc.tagline}&quot;
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 font-note text-[11px] font-medium text-[var(--ink-faint)]">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-[#D86B9B]" />
                            {loc.hours}
                          </span>
                          {loc.mapUrl && (
                            <a
                              href={loc.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[#C45688] hover:underline font-semibold"
                            >
                              <span>View on Maps</span>
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selection Checkmark — pressed seal */}
                    <div className="shrink-0 pt-0.5">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-[#C45688] text-[#FDFBF7] flex items-center justify-center shadow-[2px_3px_0_rgba(36,4,9,0.3)]">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-dashed border-[var(--rule)] group-hover:border-[#C45688] transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Guarantee — stamped promise */}
        <div className="p-4 rounded-2xl bg-[var(--paper-3)]/60 border-2 border-dashed border-[var(--rule)] flex items-center gap-3 font-note text-xs text-[var(--ink-soft)]">
          <ShieldCheck size={20} className="text-[#3d7044] shrink-0" />
          <p className="leading-relaxed">
            All orders are small-batch roasted inside hygienic Bhopal kitchens with zero preservatives. Delivered hot and fresh in sealed aroma packs.
          </p>
        </div>

      </div>
    </div>
  );
}
