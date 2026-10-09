import { useState } from 'react';
import { MapPin, Navigation, Clock, Bike, Utensils, CalendarCheck } from 'lucide-react';
import { locations } from '../data/locations';
import { useApp } from '../store';
import { Eyebrow, Screen, Pill } from '../ui';

export default function LocationPick({ firstTime }: { firstTime?: boolean }) {
  const setLocation = useApp((s) => s.setLocation);
  const [locating, setLocating] = useState(false);
  const [near, setNear] = useState<string | null>(null);

  const useCurrent = () => {
    setLocating(true);
    /* simulated geolocation — branch distances are demo data */
    window.setTimeout(() => {
      setLocating(false);
      setNear('indiranagar');
    }, 1100);
  };

  return (
    <Screen
      title={firstTime ? undefined : 'CHANGE LOCATION'}
      eyebrow={firstTime ? undefined : 'WHERE YOU DINING'}
      onBack={firstTime ? () => setLocation('indiranagar') : undefined}
      bare={firstTime}
    >
      {firstTime && (
        <div className="safe-t px-6 pt-10">
          <Eyebrow>STEP 1 OF 1</Eyebrow>
          <h1 className="h-hero mt-4">
            WHERE ARE YOU
            <br />
            <span className="text-amber">DINING?</span>
          </h1>
          <p className="body mt-4 max-w-sm">
            Menus, timing and offers change by room. Pick once — switch any time from the home screen.
          </p>
        </div>
      )}

      <div className={`space-y-3 px-5 ${firstTime ? 'mt-8 pb-10' : 'pt-5'}`}>
        {/* current location */}
        <button
          type="button"
          onClick={useCurrent}
          data-cursor="LOCATE"
          className="card-amber card-link flex w-full items-center gap-4 px-5 py-4 text-left"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber text-ink-950">
            <Navigation size={17} className={locating ? 'animate-spin' : ''} />
          </span>
          <span>
            <span className="block label text-amber">{locating ? 'FINDING YOU…' : 'CURRENT LOCATION'}</span>
            <span className="block body">
              {near ? 'Nearest: Indiranagar · 1.2 km' : 'Use GPS to find the closest room'}
            </span>
          </span>
        </button>

        <div className="flex items-center gap-3 py-2">
          <span className="h-px flex-1 bg-ivory/10" />
          <span className="eyebrow">OR SELECT A ROOM</span>
          <span className="h-px flex-1 bg-ivory/10" />
        </div>

        {locations.map((l) => {
          const open = l.status === 'open';
          const dist = l.id === 'indiranagar' ? '1.2 km' : l.id === 'koramangala' ? '4.8 km' : null;
          return (
            <button
              key={l.id}
              type="button"
              disabled={!open}
              onClick={() => setLocation(l.id)}
              data-cursor={open ? 'PICK' : undefined}
              className="card card-link w-full px-5 py-4 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0 text-amber" />
                    <h3 className="h3 truncate">
                      {l.area}
                      <span className="eyebrow ml-2">{l.city.toUpperCase()}</span>
                    </h3>
                  </div>
                  <p className="body mt-1 line-clamp-1">{l.address}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {l.status === 'open' && <Pill tone="open">OPEN NOW</Pill>}
                  {l.status === 'opening' && <Pill tone="soon">SOON</Pill>}
                  {l.status === 'future' && <Pill tone="off">{l.openingDate}</Pill>}
                  {dist && <span className="eyebrow">{dist}</span>}
                </div>
              </div>

              {open && (
                <div className="hair-t mt-3 flex flex-wrap gap-x-4 gap-y-2 pt-3">
                  <span className="eyebrow flex items-center gap-1.5">
                    <Clock size={12} /> {l.hours.split('·')[1]?.trim() ?? 'DAILY'}
                  </span>
                  {l.delivery && (
                    <span className="flex items-center gap-1.5 label text-herb">
                      <Bike size={12} /> DELIVERY
                    </span>
                  )}
                  <span className="eyebrow flex items-center gap-1.5">
                    <Utensils size={12} /> DINE-IN
                  </span>
                  <span className="eyebrow flex items-center gap-1.5">
                    <CalendarCheck size={12} /> RESERVATIONS
                  </span>
                </div>
              )}
            </button>
          );
        })}

        {firstTime && (
          <p className="eyebrow pt-2 text-center">YOU CAN CHANGE THIS ANY TIME</p>
        )}
      </div>
    </Screen>
  );
}
