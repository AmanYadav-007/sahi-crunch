import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images');
const files = (await fs.readdir(OUT)).filter((f) => f.startsWith('in-') && f.endsWith('.webp')).sort();

const COLS = 6, TW = 300, TH = 210, LB = 26;
const rows = Math.ceil(files.length / COLS);
const comps = [];
for (let i = 0; i < files.length; i++) {
  const tile = await sharp(path.join(OUT, files[i]))
    .resize(TW, TH, { fit: 'cover' })
    .composite([{ input: Buffer.from(`<svg width="${TW}" height="${LB}"><rect width="${TW}" height="${LB}" fill="#000"/><text x="8" y="18" font-family="monospace" font-size="15" fill="#00ff88">${files[i].replace('.webp', '')}</text></svg>`), top: TH - LB, left: 0 }])
    .png().toBuffer();
  comps.push({ input: tile, top: Math.floor(i / COLS) * TH, left: (i % COLS) * TW });
}
await sharp({ create: { width: COLS * TW, height: rows * TH, channels: 3, background: '#111' } })
  .composite(comps).png().toFile(path.join(ROOT, 'tools', 'sheet-in.png'));
console.log('in-* count:', files.length);
