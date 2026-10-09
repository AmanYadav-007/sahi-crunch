import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images');
const FONT_OUT = path.join(ROOT, 'public', 'fonts');
const DATA_OUT = path.join(ROOT, 'public', 'data');
const SHEET = path.join(ROOT, 'tools', 'contact-sheet.png');

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(FONT_OUT, { recursive: true });
await fs.mkdir(DATA_OUT, { recursive: true });

const u = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const unsplash = [
  // restaurant interiors / atmosphere
  ['int-01', 'photo-1414235077428-338989a2e8c0'],
  ['int-02', 'photo-1517248135467-4c7edcad34c4'],
  ['int-03', 'photo-1552566626-52f8b828add9'],
  ['int-04', 'photo-1555396273-367ea4eb4db5'],
  ['int-05', 'photo-1466978913421-dad2ebd01d17'],
  ['int-06', 'photo-1559339352-11d035aa65de'],
  ['int-07', 'photo-1590846406792-0adc7f938f1d'],
  ['int-08', 'photo-1537047902294-62a40c20a6ae'],
  ['int-09', 'photo-1424847651672-bf20a4b0982b'],
  ['int-10', 'photo-1528605248644-14dd04022da1'],
  // chefs / kitchen / fire
  ['chef-01', 'photo-1577219491135-ce391730fb2c'],
  ['chef-02', 'photo-1583394293214-28ded15ee548'],
  ['chef-03', 'photo-1556910103-1c02745aae4d'],
  ['chef-04', 'photo-1600565193348-f74bd3c7ccdf'],
  ['chef-05', 'photo-1414235077428-338989a2e8c0'],
  ['fire-01', 'photo-1544025162-d76694265947'],
  ['fire-02', 'photo-1555939594-58d7cb561ad1'],
  ['fire-03', 'photo-1529692236671-f1f6cf9683ba'],
  ['fire-04', 'photo-1504754524776-8f4f37790ca0'],
  ['prep-01', 'photo-1466637574441-749b8f19452f'],
  ['prep-02', 'photo-1543353071-873f17a7a088'],
  ['prep-03', 'photo-1596040033229-a9821ebd058d'],
  ['prep-04', 'photo-1551218808-94e220e084d2'],
  ['prep-05', 'photo-1509440159596-0249088772ff'],
  ['table-01', 'photo-1499028344343-cd173ffc68a9'],
  ['table-02', 'photo-1517457373958-b7bdd4587205'],
  ['table-03', 'photo-1529543544282-ea669407fca3'],
  // plated western dishes
  ['dish-01', 'photo-1504674900247-0877df9cc836'],
  ['dish-02', 'photo-1432139555190-58524dae6a55'],
  ['dish-03', 'photo-1476224203421-9ac39bcb3327'],
  ['dish-04', 'photo-1473093295043-cdd812d0e601'],
  ['dish-05', 'photo-1600891964599-f61ba0e24092'],
  ['dish-06', 'photo-1490645935967-10de6ba17061'],
  ['dish-07', 'photo-1482049016688-2d3e1b311543'],
  ['dish-08', 'photo-1512621776951-a57141f2eefd'],
  ['dish-09', 'photo-1546069901-ba9599a7e63c'],
  ['dish-10', 'photo-1540189549336-e6e99c3679fe'],
  ['pizza-01', 'photo-1565299624946-b28f40a0ae38'],
  ['pizza-02', 'photo-1513104890138-7c749659a591'],
  ['pizza-03', 'photo-1606787366850-de6330128bfc'],
  ['burger-01', 'photo-1571091718767-18b5b1457add'],
  ['burger-02', 'photo-1568901346375-23c9450c58cd'],
  ['burger-03', 'photo-1550547660-d9450f859349'],
  ['burger-04', 'photo-1551782450-a2132b4ba21d'],
  ['sand-01', 'photo-1528735602780-2552fd46c7af'],
  ['sand-02', 'photo-1603064752734-4c48eff53d05'],
  ['coffee-01', 'photo-1509042239860-f550ce710b93'],
  ['coffee-02', 'photo-1495474472287-4d71bcdd2085'],
  ['coffee-03', 'photo-1461023058943-07fcbe16d735'],
  ['drink-01', 'photo-1544145945-f90425340c7e'],
  ['drink-02', 'photo-1536935338788-846bb9981813'],
  ['drink-03', 'photo-1514362545857-3bc16c4c7d1b'],
  ['dessert-01', 'photo-1551024506-0bccd828d307'],
  ['dessert-02', 'photo-1488477181946-6428a0291777'],
  ['dessert-03', 'photo-1563729784474-d77dbb933a9e'],
  ['dessert-04', 'photo-1587314168485-3236d6710814'],
  ['dessert-05', 'photo-1551024709-8f23befc6f87'],
];

const foodishCats = [
  'biryani', 'butter-chicken', 'chai', 'dessert', 'dosa', 'idli',
  'momos', 'paani-puri', 'paneer', 'pizza', 'samosa', 'rolls',
];

const candidates = [];
for (const [key, id] of unsplash) candidates.push({ key, url: u(id) });
for (const c of foodishCats) {
  for (let i = 1; i <= 5; i++) {
    candidates.push({ key: `in-${c}-${i}`, url: `https://foodish-api.com/images/${c}/${c}${i}.jpg` });
  }
}

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
    fail.push([c.key, String(e.message).slice(0, 60)]);
  }
}

async function pool(jobs, n) {
  const queue = [...jobs];
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (queue.length) await grab(queue.shift());
    })
  );
}

console.log(`downloading ${candidates.length} image candidates...`);
await pool(candidates, 8);
console.log(`ok: ${ok.length}, failed: ${fail.length}`);
for (const [k, why] of fail) console.log('  x', k, '-', why);

// ---------- contact sheet for visual verification ----------
try {
  const COLS = 6;
  const TW = 300;
  const TH = 210;
  const LB = 26;
  const keys = [...ok].sort();
  const rows = Math.ceil(keys.length / COLS);
  const comps = [];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const tile = await sharp(path.join(OUT, `${k}.webp`))
      .resize(TW, TH, { fit: 'cover' })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${TW}" height="${LB}"><rect width="${TW}" height="${LB}" fill="#000000"/><text x="8" y="18" font-family="monospace" font-size="15" fill="#00ff88">${k}</text></svg>`
          ),
          top: TH - LB,
          left: 0,
        },
      ])
      .png()
      .toBuffer();
    comps.push({ input: tile, top: Math.floor(i / COLS) * TH, left: (i % COLS) * TW });
  }
  await sharp({
    create: { width: COLS * TW, height: rows * TH, channels: 3, background: '#111111' },
  })
    .composite(comps)
    .png()
    .toFile(SHEET);
  console.log('contact sheet ->', SHEET);
} catch (e) {
  console.log('contact sheet failed:', e.message);
}

// ---------- self-hosted fonts ----------
try {
  const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  const cssUrl =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Jost:wght@300;400;500&display=swap';
  const cssRes = await fetch(cssUrl, { headers: { 'user-agent': UA } });
  const css = await cssRes.text();
  const blocks = css.split('@font-face').slice(1);
  let out = '';
  let n = 0;
  for (const b of blocks) {
    if (!b.includes('U+0000-00FF')) continue; // latin subset only
    const fam = b.match(/font-family:\s*'([^']+)'/)?.[1];
    const style = b.match(/font-style:\s*(\w+)/)?.[1] || 'normal';
    const weight = b.match(/font-weight:\s*(\d+)/)?.[1] || '400';
    const url = b.match(/url\(([^)]+)\)\s*format\('woff2'\)/)?.[1];
    if (!fam || !url) continue;
    const slug = `${fam.toLowerCase().replace(/\s+/g, '-')}-${weight}${style === 'italic' ? '-italic' : ''}`;
    const fontRes = await fetch(url, { headers: { 'user-agent': UA } });
    const buf = Buffer.from(await fontRes.arrayBuffer());
    await fs.writeFile(path.join(FONT_OUT, `${slug}.woff2`), buf);
    out += `@font-face{font-family:'${fam}';font-style:${style};font-weight:${weight};font-display:swap;src:url('/fonts/${slug}.woff2') format('woff2');}\n`;
    n++;
  }
  await fs.mkdir(path.join(ROOT, 'src', 'styles'), { recursive: true });
  await fs.writeFile(path.join(ROOT, 'src', 'styles', 'fonts.css'), out);
  console.log(`fonts: ${n} faces -> src/styles/fonts.css`);
} catch (e) {
  console.log('fonts failed:', e.message);
}

console.log('done.');
