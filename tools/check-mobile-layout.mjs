// Checks that no tab pans sideways on phones: for each tab at 320, 375 and 414 px, with every disclosure closed and then open,
// the document and the scroll stage are no wider than the screen, the browser did not zoom out to fit wide content, and a touch drag
// sideways moves nothing. Needs Playwright (not a project dependency) and a running app.
//   npx vite --port 5197   then   node tools/check-mobile-layout.mjs [http://localhost:5197]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.argv[2] ?? 'http://localhost:5197';
const tabs = ['/', '/proposals', '/methodology', '/assumptions', '/sources'];
const browser = await chromium.launch();
let failures = 0;
for (const width of [320, 375, 414]) {
  for (const path of tabs) {
    for (const open of [false, true]) {
      const ctx = await browser.newContext({ viewport: { width, height: 800 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(base + path);
      await page.waitForSelector('nav[aria-label="Views"]');
      if (path === '/proposals') await page.waitForSelector('.prop-card', { timeout: 60000 });
      await page.waitForTimeout(1000);
      await page.evaluate((o) => document.querySelectorAll('details').forEach((d) => { d.open = o; }), open);
      await page.waitForTimeout(300);
      const cdp = await ctx.newCDPSession(page);
      for (const dir of [-1, 1]) await cdp.send('Input.synthesizeScrollGesture', { x: width / 2, y: 400, xDistance: dir * 150, yDistance: 0, gestureSourceType: 'touch', speed: 800 });
      await page.waitForTimeout(200);
      const r = await page.evaluate(() => {
        const stage = document.querySelector('.stage');
        return { client: document.documentElement.clientWidth, doc: document.documentElement.scrollWidth, stage: stage?.scrollWidth ?? 0, stageLeft: stage?.scrollLeft ?? 0, pageLeft: window.visualViewport.pageLeft, scale: window.visualViewport.scale };
      });
      const ok = r.doc <= width && r.stage <= width && r.client === width && r.stageLeft === 0 && r.pageLeft === 0 && r.scale === 1;
      if (!ok) failures++;
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${width}px ${path} ${open ? 'open' : 'closed'} ${JSON.stringify(r)}`);
      await ctx.close();
    }
  }
}
await browser.close();
process.exit(failures ? 1 : 0);
