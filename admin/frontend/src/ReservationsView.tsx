import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, RefreshCw, Check, X, Sparkles } from 'lucide-react';
import { adminApi } from './adminApi';
import type { Reservation } from './types';
import { SectionTitle, Empty, Loader, Stamp } from './ui';

export default function ReservationsView() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  const loadReservations = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReservations();
      setReservations(res.reservations);
    } catch (err) {
      console.error('Failed to load reservations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await adminApi.updateReservationStatus(id, status);
      loadReservations();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filtered = reservations.filter((r) =>
    statusFilter === 'all' ? true : r.status === statusFilter
  );

  const counts = {
    all: reservations.length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  };

  const statusStamp = (s: string) =>
    s === 'confirmed'
      ? 'text-[#3d7044] border-[#4E8B56]/50'
      : s === 'cancelled'
      ? 'text-[var(--ink-faint)] border-[var(--rule)]'
      : 'text-[#C45688] border-[#D86B9B]/50';

  return (
    <div className="space-y-6">
      {/* Header — a notice pinned to the kitchen board */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Guest book · Bhopal"
          subtitle="Manage weekend tasting tables, experiential pass check-ins and guest counts."
        >
          VIP tasting passes &amp; table bookings
        </SectionTitle>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'pending', label: 'Pending' },
              { id: 'cancelled', label: 'Cancelled' },
            ] as const
          ).map((f) => {
            const isSelected = statusFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl font-note text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'btn-ink'
                    : 'text-[var(--ink-soft)] hover:text-[#8F2859] hover:bg-[var(--paper-2)] border border-[var(--rule)] bg-[var(--paper-2)]'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[var(--paper-3)] text-[var(--ink-faint)]'
                  }`}
                >
                  {counts[f.id]}
                </span>
              </button>
            );
          })}

          <button onClick={loadReservations} className="btn-outline flex items-center gap-1.5 font-note text-xs font-semibold px-3 py-1.5">
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* Banner — written on the kitchen board */}
      <div className="tilt-l-sm">
        <div className="sc-card p-5 sm:p-6">
          <span className="font-note text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C45688]">
            Written on the guest book
          </span>
          <h2 className="font-hand italic text-2xl sm:text-3xl text-[#8F2859] tracking-tight leading-snug mt-1.5">
            Confirm the pass, keep the seat warm
          </h2>
          <svg viewBox="0 0 240 10" className="w-44 sm:w-56 h-2.5 mt-1.5" fill="none" aria-hidden="true">
            <path
              d="M3 7c26-4 50-5.5 77-4s50 4 77 2.5 44-4.5 78-5.5"
              stroke="#D86B9B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="font-note text-xs sm:text-sm text-[var(--ink-soft)] mt-2 leading-relaxed max-w-2xl">
            Every booking below is a guest waiting at the Boat Club or New Market stall. Stamp it
            confirmed and the kitchen will keep the tasting tray aside.
          </p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="sc-skeleton h-64 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Empty
          title="No passes in this page of the book"
          sub="Nothing matches the selected status. Try another filter to see the rest of the guest book."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((res, i) => (
            <div
              key={res.id}
              className={`sc-card sc-card-hover relative overflow-hidden p-5 flex flex-col gap-4 ${
                i % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm'
              } hover:tilt-0`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-hand italic text-lg tracking-tight text-[#8F2859]">
                  #{res.code}
                </span>
                <span className={`stamp ${statusStamp(res.status)}`}>{res.status}</span>
              </div>

              <div className="space-y-2.5 font-note text-xs text-[var(--ink-soft)]">
                <div className="flex items-center gap-2.5 rounded-lg bg-[var(--paper-3)]/50 border border-[var(--rule)] px-3 py-2">
                  <Calendar size={14} className="text-[#C45688]" />
                  <span>
                    Date: <strong className="text-[#8F2859]">{res.date}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg bg-[var(--paper-3)]/50 border border-[var(--rule)] px-3 py-2">
                  <Clock size={14} className="text-[#D86B9B]" />
                  <span>
                    Slot: <strong className="text-[#8F2859]">{res.time}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg bg-[var(--paper-3)]/50 border border-[var(--rule)] px-3 py-2">
                  <Users size={14} className="text-[#1D2E47]" />
                  <span>
                    Guests: <strong className="text-[#8F2859]">{res.guests} persons</strong>
                  </span>
                </div>

                {res.notes && (
                  <p className="bg-[var(--paper)] p-2.5 rounded-lg border border-dashed border-[var(--rule)] text-[var(--ink-faint)] italic leading-relaxed font-hand text-[13px]">
                    “{res.notes}”
                  </p>
                )}
              </div>

              <div className="mt-auto pt-3 border-t border-dashed border-[var(--rule)] flex items-center justify-end gap-2.5 text-xs">
                {res.status !== 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange(res.id, 'confirmed')}
                    className="btn-ink flex items-center gap-1.5 font-note text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2"
                  >
                    <Check size={14} />
                    Confirm pass
                  </button>
                )}
                {res.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange(res.id, 'cancelled')}
                    className="flex items-center gap-1.5 rounded-[0.7rem] px-4 py-2 font-note text-xs font-semibold border-2 border-dashed border-[var(--rule)] bg-[var(--paper-3)]/60 text-[var(--ink-faint)] hover:text-[#C45688] hover:border-[#C45688]/40 transition-colors"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
