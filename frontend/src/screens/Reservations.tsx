import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Clock, Users, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../store';
import { events } from '../data';
import { TabHeader, DishImg, Empty } from '../ui';
import { useAuth } from '../lib/AuthContext';
import { reservationsApi } from '../lib/api';

export default function Reservations() {
  const reservations = useApp((s) => s.reservations);
  const push = useApp((s) => s.push);
  const addReservation = useApp((s) => s.addReservation);
  const auth = useAuth();

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
    alert(`🎉 Tasting pass reserved for ${title}! We look forward to meeting you in Bhopal.`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-36 text-[#1E1E24]">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#681121] via-[#701222] to-[#b87319] text-white p-5 sm:p-7 rounded-3xl shadow-lg shadow-[#681121]/20">
          <div className="inline-flex items-center gap-1.5 bg-black/25 text-[#E2952A] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mb-2 uppercase">
            Weekend Bhopal Stalls
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-[#FDFBF7]">
            Free Sampling & Tasting Passes
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 font-medium leading-relaxed max-w-2xl">
            Taste our 5 Makhana varieties, freshly baked Nankhatai, and Ratlam Sev directly at our high-footfall Bhopal weekend spots (Boat Club & New Market).
          </p>
        </div>

        {/* Live Pop-up Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((ev) => {
            const isBooked = bookedEvents.includes(ev.id);

            return (
              <div
                key={ev.id}
                className="bg-[#FBF7F0] rounded-3xl overflow-hidden border border-[#e5d8c3] shadow-card hover:shadow-float transition-all"
              >
                <div className="relative h-44 w-full bg-[#f3ece0]">
                  <DishImg name={ev.image} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-[#FDFBF7]/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-[#1E1E24] shadow-sm flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#681121]" />
                    <span>{ev.location}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-[#4E8B56] text-white px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase shadow">
                    Free Entry
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <h3 className="text-base font-extrabold text-[#1E1E24] tracking-tight">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {ev.desc}
                  </p>

                  <div className="pt-2 border-t border-[#e8dfcf] flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-[#D48924]" /> {ev.date} · {ev.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-slate-400" /> {ev.seats} slots
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleBook(ev.id, ev.title)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                      isBooked
                        ? 'bg-[#4E8B56]/15 text-[#4E8B56] border border-[#4E8B56]/30'
                        : 'bg-[#681121] hover:bg-[#540c19] text-white shadow-md shadow-[#681121]/20 active:scale-[0.99]'
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
