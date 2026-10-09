import { useState } from 'react';
import { CalendarDays, Users, Clock, X, MapPin } from 'lucide-react';
import { useApp } from '../store';
import { locations } from '../data/locations';
import { events } from '../data';
import { Empty, Pill, SectionTitle, DishImg, TabHeader } from '../ui';

export default function Reservations() {
  const reservations = useApp((s) => s.reservations);
  const cancelReservation = useApp((s) => s.cancelReservation);
  const push = useApp((s) => s.push);
  const setTab = useApp((s) => s.setTab);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = reservations.filter((r) => r.date >= today);
  const past = reservations.filter((r) => r.date < today);

  return (
    <div className="safe-b pb-8">
      <TabHeader eyebrow="HOLD A CHAIR, KEEP THE EVENING" title="TABLES" />

      <div className="gut mt-5">
        <button type="button" onClick={() => push({ type: 'reserve' })} data-cursor="BOOK" className="btn-solid w-full !py-4">
          <CalendarDays size={15} />
          RESERVE A TABLE
        </button>
      </div>

      {reservations.length === 0 ? (
        <>
          <Empty
            title="NO TABLE, YET"
            sub="Your evening needs a chair. Pick a room, a time and the size of your table — it takes under a minute."
            cta="START A RESERVATION"
            onCta={() => push({ type: 'reserve' })}
            art="plate"
          />

          <section>
            <SectionTitle>THIS MONTH AT THE HOUSE</SectionTitle>
            <div className="no-bar flex gap-3 overflow-x-auto px-5 pb-1">
              {events.map((e) => (
                <article key={e.id} className="card w-60 shrink-0">
                  <div className="relative h-32 overflow-hidden">
                    <DishImg name={e.image} className="h-full w-full object-cover" />
                    <div className="scrim-soft absolute inset-0" />
                    <span className="absolute left-3 top-3">
                      <Pill tone="amber">{e.date.toUpperCase()}</Pill>
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="eyebrow">AT THE HOUSE</span>
                    <h3 className="h3 mt-1.5">{e.title}</h3>
                    <p className="caption mt-1 line-clamp-2">{e.desc}</p>
                    <div className="hair-t mt-3 flex items-center justify-between pt-3">
                      <span className="eyebrow">
                        <Clock size={11} className="mr-1 inline" />
                        {e.time}
                      </span>
                      <span className="num gold text-sm">{e.price ? `₹${e.price}` : 'NO COVER'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="sect gut">
            <h2 className="mb-3 label gold">UPCOMING</h2>
            <ul className="space-y-3">
              {upcoming.map((r) => {
                const loc = locations.find((l) => l.id === r.locationId);
                return (
                  <li key={r.id} className="card relative overflow-hidden p-5">
                    <div className="grain absolute inset-0" />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="num label gold">{r.code}</span>
                          <h3 className="h2 mt-1">
                            {new Date(r.date + 'T00:00:00').toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                            })}
                            <span className="ml-3 text-amber">{r.time}</span>
                          </h3>
                        </div>
                        <Pill tone="open">CONFIRMED</Pill>
                      </div>

                      <div className="hair-t mt-4 flex flex-wrap gap-x-5 gap-y-2 pt-3">
                        <span className="label flex items-center gap-1.5 text-ivory-dim">
                          <Users size={13} /> {r.guests} GUEST{r.guests > 1 ? 'S' : ''}
                        </span>
                        <span className="label flex items-center gap-1.5 text-ivory-dim">
                          <MapPin size={13} /> {loc?.area.toUpperCase()}
                        </span>
                      </div>
                      {r.notes && <p className="body mt-3 italic">“{r.notes}”</p>}

                      {confirmCancel === r.id ? (
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              cancelReservation(r.id);
                              setConfirmCancel(null);
                            }}
                            className="chip chip-danger flex-1 justify-center py-2.5"
                          >
                            YES, RELEASE IT
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmCancel(null)}
                            className="chip flex-1 justify-center py-2.5"
                          >
                            KEEP TABLE
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmCancel(r.id)}
                          className="mt-4 flex items-center gap-1.5 eyebrow transition-colors hover:text-chili"
                        >
                          <X size={12} /> CANCEL RESERVATION
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            {upcoming.length === 0 && (
              <p className="card-muted p-6 text-center eyebrow">
                NOTHING BOOKED AHEAD — YOUR NEXT TABLE IS A TAP AWAY.
              </p>
            )}
          </section>

          <section className="sect gut">
            <h2 className="mb-3 label text-ivory">PAST TABLES</h2>
            <ul className="space-y-2">
              {past.map((r) => (
                <li key={r.id} className="card flex items-center justify-between px-4 py-3">
                  <span className="label text-ivory-dim">
                    {r.date} · {r.time} · {r.guests} PAX
                  </span>
                  <span className="eyebrow">{r.code}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <div className="mt-8 flex justify-center px-5">
        <button type="button" onClick={() => setTab('home')} className="btn-ghost !py-3">
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}
