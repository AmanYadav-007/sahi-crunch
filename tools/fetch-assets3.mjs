import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images');
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=75`;

const jobs = [
  ['in-02', 'photo-1631452180519-c014fe946bc7'],
  ['in-05', 'photo-1596797038530-2c107229654b'],
  ['in-06', 'photo-1567188040759-fb8a883dc6d8'],
  ['in-13', 'photo-1626777553635-be342a0dd10b'],
  ['in-17', 'photo-1574658577558-4dd95a3d4d1d'],
  ['in-25', 'photo-1589302168068-964664d93dc0'],
  ['in-26', 'photo-1547592180-85f173990554'],
  ['in-27', 'photo-1512058564366-18510be2db19'],
  ['in-28', 'photo-1534939561126-855b8675edd7'],
  ['in-29', 'photo-1604908176997-125f25cc6f3d'],
  ['in-30', 'photo-1609501676725-7186f017a4b7'],
  ['in-31', 'photo-1546833999-b9f581a1996d'],
  ['in-32', 'photo-1555126634-323283e090fa'],
  ['in-33', 'photo-1562967914-608f82629710'],
  ['in-34', 'photo-1626132647523-66f5bf380027'],
  ['in-35', 'photo-1633945274405-b6c8069047b0'],
];

const ok = [], fail = [];
for (const [key, id] of jobs) {
  let done = false;
  for (let attempt = 0; attempt < 2 && !done; attempt++) {
    try {
      const r = await fetch(u(id), { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      if (!r.ok) { fail.push([key, r.status]); break; }
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 24000) { fail.push([key, 'small']); break; }
      const w = await sharp(b).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 76 }).toBuffer();
      await fs.writeFile(path.join(OUT, `${key}.webp`), w);
      ok.push(key); done = true;
    } catch (e) {
      if (attempt === 1) fail.push([key, String(e.message).slice(0, 40)]);
      else await new Promise((res) => setTimeout(res, 1200));
    }
  }
}
console.log('ok:', ok.join(', '));
console.log('fail:', fail.map(([k, w]) => `${k}:${w}`).join(', ') || 'none');

try {
  const COLS = 6, TW = 300, TH = 210, LB = 26;
  const keys = ok.sort();
  if (keys.length) {
    const rows = Math.ceil(keys.length / COLS);
    const comps = [];
    for (let i = 0; i < keys.length; i++) {
      const tile = await sharp(path.join(OUT, `${keys[i]}.webp`))
        .resize(TW, TH, { fit: 'cover' })
        .composite([{ input: Buffer.from(`<svg width="${TW}" height="${LB}"><rect width="${TW}" height="${LB}" fill="#000"/><text x="8" y="18" font-family="monospace" font-size="15" fill="#00ff88">${keys[i]}</text></svg>`), top: TH - LB, left: 0 }])
        .png().toBuffer();
      comps.push({ input: tile, top: Math.floor(i / COLS) * TH, left: (i % COLS) * TW });
    }
    await sharp({ create: { width: COLS * TW, height: rows * TH, channels: 3, background: '#111' } })
      .composite(comps).png().toFile(path.join(ROOT, 'tools', 'contact-sheet-3.png'));
    console.log('sheet 3 done');
  }
} catch (e) { console.log('sheet fail', e.message); }
