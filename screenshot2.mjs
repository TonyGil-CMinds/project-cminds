import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:3000');
await page.evaluate(() => {
  document.cookie = 'cminds_color=%235EC1F3; max-age=31536000; path=/; SameSite=Lax';
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
await page.evaluate(() => window.scrollBy({ top: 1800, behavior: 'instant' }));
await page.waitForTimeout(1000);

// Hover first card center
const cards = await page.$$('.initiative-card');
const box = await cards[0].boundingBox();
const cx = box.x + box.width * 0.55;
const cy = box.y + box.height * 0.5;
await page.mouse.move(cx, cy);
await page.waitForTimeout(1500);

// Check cursor element state
const cursorState = await page.evaluate(() => {
  const el = document.querySelector('.initiative-cursor');
  if (!el) return { found: false };
  const s = window.getComputedStyle(el);
  return {
    found: true,
    classes: el.className,
    opacity: s.opacity,
    left: el.style.left,
    top: el.style.top,
    zIndex: s.zIndex,
    transform: s.transform,
  };
});
console.log('cursor state:', JSON.stringify(cursorState, null, 2));

// Check if liquidGL canvas exists
const lgCanvas = await page.evaluate(() => {
  const canvas = document.querySelector('[data-liquid-ignore]');
  if (!canvas) return null;
  return { zIndex: canvas.style.zIndex, width: canvas.width, height: canvas.height };
});
console.log('liquidGL canvas:', lgCanvas);

// Take a zoomed crop of card area with cursor
await page.screenshot({ path: './public/screenshots/cursor-zoom.png', clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
console.log('saved cursor-zoom.png');

await browser.close();
