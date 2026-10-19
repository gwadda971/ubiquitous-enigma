// Usage: node render.js <out_dir> [fps] [only_time_list]
const { chromium } = require('/tmp/pwtmp/node_modules/playwright-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const out = process.argv[2];
  const fps = +(process.argv[3] || 30);
  const only = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('file://' + path.join(__dirname, 'scene.html'));
  await page.evaluate(() => document.fonts.ready);
  if (only) {
    for (const t of only) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(out, `t${t}.png`) });
    }
  } else {
    const total = 90 * fps;
    for (let i = 0; i < total; i++) {
      await page.evaluate(t => window.render(t), i / fps);
      await page.screenshot({ path: path.join(out, `f${String(i).padStart(5, '0')}.png`) });
    }
  }
  await browser.close();
})();
