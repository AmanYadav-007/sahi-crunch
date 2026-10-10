import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Check, ChevronRight, Zap } from 'lucide-react';
import { locations } from '../data/locations';
import { useApp } from '../store';
import { Screen, Pill } from '../ui';

export default function LocationPick({ firstTime }: { firstTime?: boolean }) {
  const setLocation = useApp((s) => s.setLocation);
  const selectedLocation = useApp((s) => s.locationId);
  const [locating, setLocating] = useState(false);

  const useCurrent = () => {
    setLocating(true);
    window.setTimeout(() => {
      setLocating(false);
      setLocation('bhopal-main');
    }, 800);
  };

  return (
    <Screen
      title={firstTime ? undefined : 'Select Delivery Cluster'}
      eyebrow={firstTime ? undefined : 'Bhopal Express Hubs'}
      onBack={firstTime ? () => setLocation('bhopal-main') : undefined}
      bare={firstTime}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 py-4 max-w-4xl mx-auto space-y-4 pb-24">
        {firstTime && (
          <div className="pt-6 pb-2">
            <div className="inline-flex items-center gap-1.5 bg-[#D48924] text-[#1E1E24] font-black text-xs px-3 py-1 rounded-full mb-3 shadow-sm">
              <Zap size={14} className="fill-[#1E1E24]" />
              <span>10-15 Min Delivery in Bhopal</span>
            </div>
            <h1 className="text-2xl font-black text-[#1E1E24] tracking-tight leading-tight">
              Where should we deliver your snacks?
            </h1>
            <p className="text-xs text-[#1E1E24]/70 mt-1 font-medium">
              We bake small batches and dispatch fresh within 48 hours to all major Bhopal clusters.
            </p>
          </div>
        )}

        {/* GPS Current Location button */}
        <button
          type="button"
          onClick={useCurrent}
          className="w-full flex items-center justify-between p-4 bg-[#FBF7F0] border border-[#e5d8c3] rounded-2xl text-left hover:border-[#681121]/40 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#681121] text-white font-black shadow">
              <Navigation size={18} className={locating ? 'animate-spin' : ''} />
            </div>
            <div>
              <p className="text-xs font-black text-[#1E1E24]">
                {locating ? 'Detecting your GPS location...' : 'Use Current Location'}
              </p>
              <p className="text-[11px] text-[#D48924] font-semibold">
                Arera Colony, Shahpura, Kolar Road
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#681121]" />
        </button>

        {/* Cluster list */}
        <div className="space-y-2.5 pt-2">
          <p className="text-xs font-extrabold uppercase text-[#1E1E24]/60 tracking-wider">
            Available Kitchen Clusters
          </p>

          {locations.map((loc) => {
            const isSelected = selectedLocation === loc.id;
            const isOpen = loc.status === 'open';

            return (
              <div
                key={loc.id}
                onClick={() => {
                  if (isOpen) setLocation(loc.id);
                }}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#681121] bg-[#681121]/10 shadow-sm'
                    : isOpen
                    ? 'border-[#e5d8c3] bg-[#FBF7F0] hover:border-[#681121]/40'
                    : 'border-[#e5d8c3] bg-[#FBF7F0]/50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                      isSelected
                        ? 'bg-[#681121] text-white'
                        : 'bg-[#e5d8c3]/40 text-[#1E1E24]'
                    }`}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1E1E24]">{loc.area}</h3>
                      <span className="text-[10px] font-semibold text-[#1E1E24]/50 uppercase">
                        {loc.city}
                      </span>
                    </div>
                    <p className="text-xs text-[#1E1E24]/70 mt-0.5 line-clamp-1">{loc.address}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-bold">
                      {isOpen ? (
                        <span className="text-[#4E8B56] bg-[#4E8B56]/15 px-2 py-0.5 rounded border border-[#4E8B56]/30">
                          10-15 Min Delivery Active
                        </span>
                      ) : (
                        <span className="text-[#D48924] bg-[#D48924]/15 px-2 py-0.5 rounded border border-[#D48924]/30">
                          Coming in Month 3
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#681121] text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
