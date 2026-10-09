import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images');
await fs.mkdir(OUT, { recursive: true });

const u = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const candidates = [
  // indian cuisine attempts
  ['in-01', 'photo-1585937421612-70a008356fbe'],
  ['in-02', 'photo-1631452180519-c014fe946bc7'],
  ['in-03', 'photo-1563379091339-03b21ab4a4f8'],
  ['in-04', 'photo-1601050690597-df0568f70950'],
  ['in-05', 'photo-1596797038530-2c107229654b'],
  ['in-06', 'photo-1567188040759-fb8a883dc6d8'],
  ['in-07', 'photo-1589302168068-964664d93dc0'],
  ['in-08', 'photo-1548943487-a2e4e43b4853'],
  ['in-09', 'photo-1606491956689-2ea866880c84'],
  ['in-10', 'photo-1517244683847-7456b63c5969'],
  ['in-11', 'photo-1599487488170-d11ec9c172f0'],
  ['in-12', 'photo-1601050690117-94f5f6fa8bd7'],
  ['in-13', 'photo-1626777553635-be342a0dd10b'],
  ['in-14', 'photo-1585032226651-759b368d7246'],
  ['in-15', 'photo-1610057099443-fde8c4d50f91'],
  ['in-16', 'photo-1505253758473-96b7015fcd40'],
  ['in-17', 'photo-1574658577558-4dd95a3d4d1d'],
  ['in-18', 'photo-1565557623262-b51c2513a641'],
  ['in-19', 'photo-1455619452474-d2be8b1e70cd'],
  ['in-20', 'photo-1476718406336-bb5a9690ee2a'],
  ['in-21', 'photo-1516714435131-44d6b64dc6a2'],
  ['in-22', 'photo-1585937421612-70a008356fbe'],
  ['in-23', 'photo-1567337710282-00832b415979'],
  ['in-24', 'photo-1613292443284-8d10ef9383fe'],
  // chef / plating / kitchen craft
  ['craft-01', 'photo-1556909212-d5b604d0c90d'],
  ['craft-02', 'photo-1522336572468-97b06e8ef143'],
  ['craft-03', 'photo-1466637574441-749b8f19452f'],
  ['craft-04', 'photo-1551218808-94e220e084d2'],
  ['craft-05', 'photo-1507048331197-7d4ac70811cf'],
  ['craft-06', 'photo-1414235077428-338989a2e8c0'],
  // fine dining / wine / luxury table
  ['lux-01', 'photo-1550966871-3ed3cdb5ed0c'],
  ['lux-02', 'photo-1510812431401-41d2bd2722f3'],
  ['lux-03', 'photo-1481833761820-0509d3217039'],
  ['lux-04', 'photo-1470337458703-46ad1756a187'],
  ['lux-05', 'photo-1559847844-5315695dadae'],
  ['lux-06', 'photo-1414235077428-338989a2e8c0'],
  ['lux-07', 'photo-1424847651672-bf20a4b0982b'],
  ['lux-08', 'photo-1517457373958-b7bdd4587205'],
  // asian / noodles / dumplings
  ['as-01', 'photo-1569718212165-3a8278d5f624'],
  ['as-02', 'photo-1552611052-33e04de081de'],
  ['as-03', 'photo-1546069901-d5bfd2cbfb1f'],
  ['as-04', 'photo-1541696432-82c6da8ce7bf'],
  ['as-05', 'photo-1585032226651-759b368d7246'],
  // ingredients macros
  ['ing-01', 'photo-1596040033229-a9821ebd058d'],
  ['ing-02', 'photo-1543353071-873f17a7a088'],
  ['ing-03', 'photo-1509358271058-acd22cc93898'],
  ['ing-04', 'photo-1518977676601-b53f82aba655'],
  ['ing-05', 'photo-1583258292688-d0213dc5a3a8'],
  ['ing-06', 'photo-1615485500704-8e990f9900f7'],
];

const jobs = candidates.map(([key, id]) => ({ key, url: u(id) }));

const ok = [];
const fail = [];

async function grab(c) {
  try {
    const res = await fetch(c.url, {
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    if (!res.ok) return fail.push([c.key, `http ${res.status}`]);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 24000) return fail.push([c.key, `small ${buf.length}`]);
    const webp = await sharp(buf)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 76 })
      .toBuffer();
    await fs.writeFile(path.join(OUT, `${c.key}.webp`), webp);
    ok.push(c.key);
  } catch (e) {
    fail.push([c.key, String(e.message).slice(0, 50)]);
  }
}

const queue = [...jobs];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) await grab(queue.shift());
  })
);
console.log(`ok: ${ok.length}, failed: ${fail.length}`);
for (const [k, why] of fail) console.log('  x', k, '-', why);

try {
  const COLS = 6, TW = 300, TH = 210, LB = 26;
  const keys = [...ok].sort();
  const rows = Math.ceil(keys.length / COLS);
  const comps = [];
  for (let i = 0; i < keys.length; i++) {
    const tile = await sharp(path.join(OUT, `${keys[i]}.webp`))
      .resize(TW, TH, { fit: 'cover' })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${TW}" height="${LB}"><rect width="${TW}" height="${LB}" fill="#000"/><text x="8" y="18" font-family="monospace" font-size="15" fill="#00ff88">${keys[i]}</text></svg>`
          ),
          top: TH - LB, left: 0,
        },
      ])
      .png()
      .toBuffer();
    comps.push({ input: tile, top: Math.floor(i / COLS) * TH, left: (i % COLS) * TW });
  }
  await sharp({ create: { width: COLS * TW, height: rows * TH, channels: 3, background: '#111' } })
    .composite(comps)
    .png()
    .toFile(path.join(ROOT, 'tools', 'contact-sheet-2.png'));
  console.log('sheet 2 done');
} catch (e) {
  console.log('sheet failed:', e.message);
}
