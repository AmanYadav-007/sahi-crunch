import { useState } from 'react';
import { Minus, Plus, Check, Users, CalendarDays, Clock } from 'lucide-react';
import { useApp } from '../store';
import { locations } from '../data/locations';
import { timeSlots, slotStatus } from '../data';
import { Screen } from '../ui';

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};
const iso = (d: Date) => d.toISOString().slice(0, 10);
const dayName = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase();

export default function ReserveFlow() {
  const locationId = useApp((s) => s.locationId);
  const addReservation = useApp((s) => s.addReservation);
  const setTab = useApp((s) => s.setTab);
  const profile = useApp((s) => s.profile);

  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const days = Array.from({ length: 7 }, (_, i) => daysFromNow(i));

  const [date, setDate] = useState(iso(days[0]));
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState<{ code: string; time: string; date: string; guests: number } | null>(null);

  const confirm = () => {
    if (!time) return;
    const res = addReservation({ locationId: branch.id, date, time, guests, notes: notes.trim() || undefined });
    setDone({ code: res.code, time, date, guests });
  };

  if (done) {
    return (
      <Screen eyebrow="CONFIRMED" title="YOUR TABLE">
        <div className="flex flex-col items-center px-6 pb-10 pt-10 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full border-2 border-herb text-herb">
            <Check size={34} strokeWidth={2.5} />
          </span>
          <h2 className="h2 mt-6">A CHAIR IS YOURS</h2>
          <p className="mt-2 max-w-xs text-sm text-ivory-dim">
            We’ve held {done.guests} seat{done.guests > 1 ? 's' : ''} at {branch.area}. Arrive within 15 minutes of
            your slot and the table stays yours.
          </p>

          <div className="card-amber mt-7 w-full p-6">
            <span className="num text-2xl tracking-[0.3em] text-amber">{done.code}</span>
            <div className="hair-t mt-4 grid grid-cols-3 gap-2 pt-4">
              <Cell label="DATE" value={new Date(done.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} />
              <Cell label="TIME" value={done.time} />
              <Cell label="GUESTS" value={String(done.guests)} />
            </div>
          </div>

          <p className="eyebrow mt-4">+50 POINTS ADDED TO GHARELU HUB</p>

          <button type="button" onClick={() => setTab('reservations')} className="btn-solid mt-7 w-full !py-4">
            VIEW MY TABLES
          </button>
          <button type="button" onClick={() => setTab('home')} className="eyebrow mt-3 w-full py-2">
            BACK HOME
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen eyebrow="RESERVATIONS" title="HOLD A TABLE">
      <div className="space-y-7 px-5 pt-5">
        {/* room */}
        <div className="card flex items-center justify-between px-4 py-3">
          <div>
            <span className="eyebrow">YOUR ROOM</span>
            <p className="h3">
              {branch.area}, {branch.city}
            </p>
          </div>
          <span className="label gold">{branch.hours}</span>
        </div>

        {/* date */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 label text-ivory">
            <CalendarDays size={13} className="text-amber" /> PICK A DAY
          </h2>
          <div className="no-bar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {days.map((d) => {
              const v = iso(d);
              const on = v === date;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setDate(v);
                    setTime('');
                  }}
                  className={`tile w-16 shrink-0 py-3 text-center ${
                    on ? 'tile-on' : ''
                  }`}
                >
                  <span className={`block label ${on ? 'gold' : 'text-ivory-faint'}`}>{dayName(d)}</span>
                  <span className={`num mt-1 block text-xl ${on ? 'text-ivory' : 'text-ivory-dim'}`}>{d.getDate()}</span>
                  <span className="eyebrow block">
                    {d.toLocaleDateString('en-IN', { month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* guests */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 label text-ivory">
            <Users size={13} className="text-amber" /> SIZE OF THE TABLE
          </h2>
          <div className="card flex items-center justify-between px-5 py-4">
            <button
              type="button"
              aria-label="Fewer guests"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="icon-btn"
            >
              <Minus size={16} />
            </button>
            <div className="text-center">
              <span className="num block text-4xl text-ivory">{guests}</span>
              <span className="eyebrow block">
                GUEST{guests > 1 ? 'S' : ''} {guests >= 8 ? '· LONG TABLE NEEDED' : ''}
              </span>
            </div>
            <button
              type="button"
              aria-label="More guests"
              onClick={() => setGuests((g) => Math.min(20, g + 1))}
              className="icon-btn"
            >
              <Plus size={16} />
            </button>
          </div>
        </section>

        {/* slots */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 label text-ivory">
            <Clock size={13} className="text-amber" /> CHOOSE A SEATING
          </h2>
          {(['Lunch', 'Dinner'] as const).map((meal) => (
            <div key={meal} className="mb-4">
              <p className="eyebrow mb-2">{meal.toUpperCase()}</p>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots
                  .filter((s) => s.meal === meal)
                  .map(({ t }) => {
                    const st = slotStatus(date, t);
                    const on = time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={st === 'unavailable'}
                        onClick={() => setTime(t)}
                        className={`chip justify-center py-2.5 ${
                          st === 'unavailable'
                            ? 'hair border opacity-40 line-through'
                            : on
                              ? 'chip-on'
                              : st === 'limited'
                                ? 'chip-danger'
                                : ''
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
          <p className="eyebrow flex flex-wrap gap-x-4">
            <span className="text-ivory-dim">● OPEN</span>
            <span className="text-chili">● FEW LEFT</span>
            <span className="text-ivory-faint/40">● FULL</span>
          </p>
        </section>

        {/* notes */}
        <section>
          <h2 className="mb-2 label text-ivory">ANYTHING WE SHOULD KNOW</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            maxLength={160}
            placeholder="Birthday, window seat, high chair…"
            className="field w-full resize-none"
          />
        </section>

        {!profile.name && (
          <p className="card px-4 py-3 eyebrow">
            BOOKING AS A GUEST — ADD YOUR NAME IN PROFILE SO WE KNOW WHO’S ARRIVING.
          </p>
        )}

        <button
          type="button"
          onClick={confirm}
          disabled={!time}
          data-cursor="HOLD"
          className="btn-solid w-full !py-4 disabled:opacity-40"
        >
          {time ? `HOLD TABLE FOR ${guests} · ${time}` : 'PICK A SEATING TIME'}
        </button>

        <p className="caption pb-4 text-center">
          Held 15 minutes past your slot · Free cancellation up to 2 hours before
        </p>
      </div>
    </Screen>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="eyebrow block">{label}</span>
      <span className="mt-1 block num text-lg text-ivory">{value}</span>
    </div>
  );
}
