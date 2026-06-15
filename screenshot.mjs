import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';

const OUT = './public/screenshots';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Inject cookie to skip onboarding, go straight to step 3
await page.goto('http://localhost:3000');
await page.evaluate(() => {
  document.cookie = 'cminds_color=%235EC1F3; max-age=31536000; path=/; SameSite=Lax';
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(4500); // loader + hero entrance animations

// Scroll to initiatives section
await page.evaluate(() => window.scrollBy({ top: 1800, behavior: 'instant' }));
await page.waitForTimeout(1000);

await page.screenshot({ path: `${OUT}/before-hover.png` });
console.log('saved before-hover.png');

// Hover first card
const cards = await page.$$('.initiative-card');
console.log('cards found:', cards.length);

if (cards[0]) {
  const box = await cards[0].boundingBox();
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.45);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/hover-card1.png` });
  console.log('saved hover-card1.png');
}

if (cards[2]) {
  const box = await cards[2].boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/hover-card3.png` });
  console.log('saved hover-card3.png');
}

await browser.close();
