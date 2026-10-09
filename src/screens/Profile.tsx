import { useState } from 'react';
import {
  ChevronRight,
  Heart,
  Gift,
  Ticket,
  UserPlus,
  LogOut,
  Plus,
  X,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useApp, tierOf } from '../store';
import { dishById } from '../data/menu';
import { locations } from '../data/locations';
import { TIERS } from '../data';
import { Sheet, Pill, DishImg, SectionTitle, TabHeader } from '../ui';

export default function Profile() {
  const profile = useApp((s) => s.profile);
  const setProfile = useApp((s) => s.setProfile);
  const points = useApp((s) => s.points);
  const referralCode = useApp((s) => s.referralCode);
  const favorites = useApp((s) => s.favorites);
  const orders = useApp((s) => s.orders);
  const reservations = useApp((s) => s.reservations);
  const locationId = useApp((s) => s.locationId);
  const push = useApp((s) => s.push);
  const reset = useApp((s) => s.reset);

  const [signIn, setSignIn] = useState(false);
  const [addrOpen, setAddrOpen] = useState(false);
  const [addrText, setAddrText] = useState('');
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({ name: profile.name, phone: profile.phone, email: profile.email });
  const tier = TIERS[tierOf(points)];
  const branch = locations.find((l) => l.id === locationId) ?? locations[0];
  const favDishes = favorites.map(dishById).filter((d): d is NonNullable<typeof d> => Boolean(d));

  const saveSignIn = () => {
    setProfile({ ...form, guest: false });
    setSignIn(false);
  };

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
    } catch {
      /* clipboard can be blocked — the code stays visible */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="safe-b pb-8">
      <TabHeader
        eyebrow={profile.guest ? 'GUEST AT THE HOUSE' : 'WELCOME BACK'}
        title={profile.name || 'Your Table'}
        right={
          <div className="grid h-12 w-12 place-items-center border amber-line tint-amber">
            <span className="font-display text-2xl font-semibold text-amber">
              {(profile.name || 'G').charAt(0).toUpperCase()}
            </span>
          </div>
        }
      />

      <div className="gut mt-3">
        <p className="caption">
          {profile.phone || profile.email || 'No details saved yet'}
        </p>

        {profile.guest ? (
          <button type="button" onClick={() => setSignIn(true)} className="btn-solid mt-4 w-full !py-3.5">
            SIGN IN / CREATE ACCOUNT
          </button>
        ) : (
          <button
            type="button"
            onClick={() => push({ type: 'loyalty' })}
            data-cursor="CLUB"
            className="card-amber mt-4 flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span>
              <span className="label flex items-center gap-2 gold">
                <Sparkles size={12} /> THE TABLE CLUB · {tier.name}
              </span>
              <span className="mt-1 block num text-2xl text-ivory">
                {points}
                <span className="eyebrow ml-2">PTS</span>
              </span>
            </span>
            <ChevronRight size={18} className="text-amber" />
          </button>
        )}
      </div>

      {/* quick stats */}
      <section className="sect gut grid grid-cols-3 gap-2">
        <Stat label="ORDERS" value={orders.length} />
        <Stat label="TABLES" value={reservations.length} />
        <Stat label="SAVED" value={favorites.length} />
      </section>

      {/* saved */}
      <section className="sect">
        <SectionTitle
          action={
            <span className="eyebrow">
              <Heart size={11} className="mr-1 inline" />
              {favDishes.length}
            </span>
          }
        >
          SAVED DISHES
        </SectionTitle>
        {favDishes.length === 0 ? (
          <p className="gut body">Tap the heart on any dish and it waits for you here.</p>
        ) : (
          <div className="no-bar flex gap-3 overflow-x-auto px-5 pb-1">
            {favDishes.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => push({ type: 'dish', id: d.id })}
                className="w-32 shrink-0 text-left"
              >
                <div className="relative aspect-square overflow-hidden hair-all">
                  <DishImg name={d.image} className="h-full w-full object-cover" />
                  <div className="scrim-soft absolute inset-0" />
                </div>
                <span className="body-b mt-1.5 block truncate">{d.name}</span>
                <span className="num gold text-xs">₹{d.price}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* rows */}
      <section className="sect gut">
        <h2 className="mb-3 label text-ivory">YOUR HOUSE</h2>
        <ul className="card hair-y overflow-hidden">
          <Row Icon={Gift} title="Rewards wallet" sub={`${points} points · ${tier.name}`} onClick={() => push({ type: 'loyalty' })} />
          <Row Icon={Ticket} title="Offers" sub={`Live for ${branch.area}`} onClick={() => push({ type: 'offers' })} />
          <Row Icon={MapPin} title="Switch location" sub={`${branch.area}, ${branch.city}`} onClick={() => push({ type: 'location' })} />
          <Row
            Icon={Heart}
            title="Favorites"
            sub={`${favorites.length} saved`}
            onClick={() => push({ type: 'dish', id: favorites[0] ?? 'by-1' })}
          />
        </ul>
      </section>

      {/* addresses */}
      <section className="sect gut">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="label text-ivory">SAVED ADDRESSES</h2>
          <button type="button" onClick={() => setAddrOpen(true)} className="label gold">
            <Plus size={12} className="mr-1 inline" />
            ADD
          </button>
        </div>
        {profile.addresses.length === 0 ? (
          <p className="card-muted p-5 text-center caption">No addresses yet — add one for faster delivery.</p>
        ) : (
          <ul className="space-y-2">
            {profile.addresses.map((a, i) => (
              <li key={i} className="card flex items-start gap-3 px-4 py-3">
                <MapPin size={14} className="mt-0.5 shrink-0 text-amber" />
                <span className="body flex-1">{a}</span>
                <button
                  type="button"
                  aria-label="Remove address"
                  onClick={() => setProfile({ addresses: profile.addresses.filter((_, x) => x !== i) })}
                  className="text-ivory-faint transition-colors hover:text-chili"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* preferences */}
      <section className="sect gut">
        <h2 className="mb-3 label text-ivory">PREFERENCES</h2>
        <div className="card flex items-center justify-between px-4 py-4">
          <span className="body flex items-center gap-2.5">
            <Leaf size={15} className="text-herb" />
            Vegetarian menu first
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={!!profile.vegMode}
            onClick={() => setProfile({ vegMode: !profile.vegMode })}
            className={`relative h-6 w-11 border transition-colors ${
              profile.vegMode ? 'border-herb bg-herb/25' : 'hair-2 bg-ink-800'
            }`}
          >
            <span
              className={`absolute top-0.5 transition-all duration-300 ${
                profile.vegMode ? 'left-6 bg-herb' : 'left-0.5 bg-ivory-faint'
              }`}
              style={{ height: '1.1rem', width: '1.1rem' }}
            />
          </button>
        </div>
      </section>

      {/* referral */}
      <section className="sect gut">
        <button type="button" onClick={copyReferral} className="card-dash flex w-full items-center justify-between px-5 py-4 text-left">
          <span>
            <span className="label flex items-center gap-2 gold">
              <UserPlus size={12} /> REFER A FRIEND
            </span>
            <span className="caption mt-1 block">Both of you get 200 points on their first order.</span>
            <span className="num mt-1.5 block text-lg tracking-[0.2em] text-ivory">{referralCode}</span>
          </span>
          <span className="label shrink-0 gold">{copied ? 'COPIED' : 'TAP TO COPY'}</span>
        </button>
      </section>

      {/* contact + leave */}
      <section className="sect gut space-y-3">
        <div className="body flex items-center gap-3">
          <Phone size={13} className="text-amber" /> {branch.phone}
        </div>
        <div className="body flex items-center gap-3">
          <Mail size={13} className="text-amber" /> {profile.email || 'concierge@ghareluhub.in'}
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset this demo — cart, orders, reservations and points will be cleared.')) reset();
          }}
          className="chip w-full justify-center py-3 transition-colors hover:border-[rgba(181,56,31,0.5)] hover:text-[#d4553a]"
        >
          <LogOut size={13} /> {profile.guest ? 'RESET DEMO' : 'SIGN OUT'}
        </button>
        <p className="eyebrow pb-2 pt-3 text-center">GHARELU HUB · EST. 2019 · BENGALURU</p>
      </section>

      {profile.guest && (
        <div className="gut mt-6">
          <Pill tone="off">BROWSING AS A GUEST — SIGN IN TO EARN POINTS</Pill>
        </div>
      )}

      {/* sign in sheet */}
      <Sheet open={signIn} onClose={() => setSignIn(false)} title="YOUR DETAILS">
        <div className="space-y-4 px-5 pt-4">
          <Field label="NAME" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Who's at the table?" />
          <Field label="PHONE" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 " type="tel" />
          <Field label="EMAIL" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" type="email" />
          <button type="button" onClick={saveSignIn} className="btn-solid w-full !py-3.5">
            SAVE & CONTINUE
          </button>
          <p className="caption pb-2 text-center">
            We use this only for orders, tables and points. Never for spam.
          </p>
        </div>
      </Sheet>

      {/* address sheet */}
      <Sheet open={addrOpen} onClose={() => setAddrOpen(false)} title="NEW ADDRESS">
        <div className="space-y-4 px-5 pt-4">
          <textarea
            value={addrText}
            onChange={(e) => setAddrText(e.target.value)}
            rows={3}
            placeholder="Flat, street, landmark, pincode"
            className="field w-full resize-none"
          />
          <button
            type="button"
            disabled={!addrText.trim()}
            onClick={() => {
              setProfile({ addresses: [...profile.addresses, addrText.trim()] });
              setAddrText('');
              setAddrOpen(false);
            }}
            className="btn-solid w-full !py-3.5 disabled:opacity-40"
          >
            SAVE ADDRESS
          </button>
        </div>
      </Sheet>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card px-3 py-4 text-center">
      <span className="num gold block text-2xl">{value}</span>
      <span className="eyebrow mt-1 block">{label}</span>
    </div>
  );
}

function Row({
  Icon,
  title,
  sub,
  onClick,
}: {
  Icon: typeof Gift;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        data-cursor="OPEN"
        className="flex w-full items-center gap-3.5 px-4 py-4 text-left transition-colors hover:bg-[rgba(241,234,221,0.05)]"
      >
        <Icon size={17} className="shrink-0 text-amber" strokeWidth={1.6} />
        <span className="min-w-0 flex-1">
          <span className="body-b block">{title}</span>
          <span className="caption block truncate">{sub}</span>
        </span>
        <ChevronRight size={16} className="shrink-0 text-ivory-faint" />
      </button>
    </li>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow block">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field mt-1.5 w-full"
      />
    </label>
  );
}
