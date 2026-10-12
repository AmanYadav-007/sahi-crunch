import React, { useState } from 'react';
import { Sparkles, MapPin, Clock, Users, Check } from 'lucide-react';
import { useApp } from '../store';
import { events } from '../data';
import { TabHeader, DishImg } from '../ui';
import { useAuth } from '../lib/AuthContext';
import { reservationsApi } from '../lib/api';
import { useToast } from '../lib/ToastContext';

export default function Reservations() {
  const reservations = useApp((s) => s.reservations);
  const push = useApp((s) => s.push);
  const addReservation = useApp((s) => s.addReservation);
  const auth = useAuth();
  const { alert } = useToast();

  const [bookedEvents, setBookedEvents] = useState<string[]>([]);

  const handleBook = (eventId: string, title: string) => {
    addReservation({
      date: new Date().toISOString().slice(0, 10),
      time: '18:00',
      guests: 2,
      locationId: 'bhopal-main',
      notes: `Pop-up event pass: ${title}`,
    });
    if (auth.isLoggedIn) {
      reservationsApi.create({
        locationId: 'bhopal-main',
        date: new Date().toISOString().slice(0, 10),
        time: '18:00',
        guests: 2,
        notes: `Pop-up event pass: ${title}`,
      }).catch(() => {});
    }
    setBookedEvents((prev) => [...prev, eventId]);
    alert(
      `🎉 Tasting pass reserved for ${title}! Your VIP entry pass has been secured. We look forward to seeing you at our Bhopal stall.`,
      'Sampling Pass Reserved!',
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] paper-grain pb-36 text-[var(--ink)]">
      <TabHeader eyebrow="Tasting calendar · Bhopal" title="Pop-up Tastings" />

      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto space-y-7">
        {/* Banner — a notice pinned to the kitchen board */}
        <div className="relative tilt-l-sm">
          <div className="bg-[var(--paper-2)] paper-grain border border-[var(--rule)] rounded-3xl p-5 sm:p-7 shadow-[3px_4px_0_rgba(84,12,25,0.05),0_16px_30px_-22px_rgba(84,12,25,0.4)]">
            <span className="font-note text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C45688]">
              Written on the kitchen board
            </span>
            <h2 className="font-hand italic text-2xl sm:text-3xl text-[#8F2859] tracking-tight leading-snug mt-1.5">
              Come taste before you order
            </h2>
            <svg viewBox="0 0 240 10" className="w-44 sm:w-56 h-2.5 mt-1.5" fill="none" aria-hidden="true">
              <path d="M3 7c26-4 50-5.5 77-4s50 4 77 2.5 44-4.5 78-5.5" stroke="#D86B9B" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="font-note text-xs sm:text-sm text-[var(--ink-soft)] mt-2 leading-relaxed max-w-2xl">
              Taste our 5 Makhana varieties, freshly baked Nankhatai, and Ratlam Sev directly at our high-footfall Bhopal weekend spots (Boat Club &amp; New Market).
            </p>
          </div>
        </div>

        {/* Live Pop-up Cards — photos taped into the log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev, i) => {
            const isBooked = bookedEvents.includes(ev.id);
            const tilt = i % 2 === 0 ? 'tilt-l-sm' : 'tilt-r-sm';

            return (
              <div
                key={ev.id}
                className={`${tilt} hover:tilt-0 bg-[var(--paper-2)] paper-grain rounded-3xl border border-[var(--rule)] shadow-[3px_4px_0_rgba(84,12,25,0.05),0_16px_30px_-22px_rgba(84,12,25,0.4)] hover:border-[#D86B9B]/70 transition-all duration-300`}
              >
                <div className="relative px-4 pt-6 pb-2">
                  <span className="tape w-20 top-4 left-1/2 -translate-x-1/2 rotate-[-3deg] z-10" aria-hidden="true" />

                  {/* Polaroid frame */}
                  <div className="relative bg-white p-2.5 pb-9 rounded-sm border border-[var(--rule)] shadow-[4px_6px_0_rgba(84,12,25,0.08),0_20px_40px_-24px_rgba(84,12,25,0.5)]">
                    <div className="relative h-44 w-full overflow-hidden bg-[var(--paper-3)]">
                      <DishImg name={ev.image} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-hand italic text-sm text-[var(--ink-soft)] text-center mt-2 leading-none">
                      {ev.date}
                    </p>
                  </div>

                  {/* Ink stamps over the photo */}
                  <span className="stamp tilt-l-sm absolute top-8 left-7 bg-[var(--paper-2)]/95 text-[var(--ink)]">
                    <MapPin size={11} className="text-[#C45688]" />
                    <span>{ev.location}</span>
                  </span>
                  <span className="stamp tilt-r-sm absolute top-8 right-7 bg-[var(--paper-2)]/95 text-[#3d7044] border-[#4E8B56]/60">
                    Free Entry
                  </span>
                </div>

                <div className="px-4 pb-4 pt-1 space-y-2.5">
                  <h3 className="font-hand italic text-xl text-[#8F2859] tracking-tight leading-snug">
                    {ev.title}
                  </h3>
                  <p className="font-note text-xs text-[var(--ink-soft)] leading-relaxed">
                    {ev.desc}
                  </p>

                  <div className="pt-2 border-t border-dashed border-[var(--rule)] flex items-center justify-between font-note text-[11px] text-[var(--ink-faint)]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#D86B9B]" /> {ev.date} · {ev.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={13} className="text-[var(--ink-faint)]" /> {ev.seats} slots
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleBook(ev.id, ev.title)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-[0.7rem] font-note text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
                      isBooked
                        ? 'bg-[#4E8B56]/10 text-[#3d7044] border-2 border-dashed border-[#4E8B56]/60 tilt-l-sm cursor-default'
                        : 'btn-ink'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <Check size={16} />
                        <span>Tasting Pass Reserved!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>Get Free Tasting Pass</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
