export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export function spiceLabel(level: number) {
  return ['MILD', 'GENTLE', 'WARM', 'FIERCE'][level] ?? 'MILD';
}

/** Preload images with progress reporting (0 → 1) */
export function preloadImages(urls: string[], onProgress?: (p: number) => void) {
  let done = 0;
  if (!urls.length) {
    onProgress?.(1);
    return Promise.resolve();
  }
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          const finish = () => {
            done += 1;
            onProgress?.(done / urls.length);
            resolve();
          };
          img.onload = finish;
          img.onerror = finish;
          img.src = url;
        })
    )
  );
}

export const img = (name: string) => `/images/${name}.webp`;
