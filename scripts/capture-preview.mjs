import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve('./dist');
const ARTIFACT_DIR = 'C:\\Users\\USERR\\.gemini\\antigravity\\brain\\448c3fca-d229-4194-b2e9-fb90b0cd5b4f';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  else if (!path.extname(reqPath)) reqPath += '/index.html';
  const fp = path.join(DIST_DIR, reqPath);
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
    fs.createReadStream(fp).pipe(res);
  } else {
    res.writeHead(404);
    res.end('404');
  }
});

server.listen(4328, '127.0.0.1', async () => {
  console.log('Static preview server started on port 4328');
  try {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });

    // 1. Desktop Homepage
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:4328/', { waitUntil: 'networkidle' });
    const homePath = path.join(ARTIFACT_DIR, 'preview-desktop-home.png');
    await page.screenshot({ path: homePath });
    console.log(`Saved: ${homePath}`);

    // 2. Desktop Diagnostics
    await page.goto('http://127.0.0.1:4328/diagnostics/', { waitUntil: 'networkidle' });
    await page.click('[data-env="windows"]');
    await page.click('[data-symptom="connected-no-web"]');
    await page.click('#btn-generate-report');
    await page.waitForTimeout(300);
    const diagPath = path.join(ARTIFACT_DIR, 'preview-desktop-diagnostics.png');
    await page.screenshot({ path: diagPath });
    console.log(`Saved: ${diagPath}`);

    // 3. Desktop Pricing
    await page.goto('http://127.0.0.1:4328/pricing/', { waitUntil: 'networkidle' });
    const pricingPath = path.join(ARTIFACT_DIR, 'preview-desktop-pricing.png');
    await page.screenshot({ path: pricingPath });
    console.log(`Saved: ${pricingPath}`);

    // 4. Mobile Homepage
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await mobilePage.goto('http://127.0.0.1:4328/', { waitUntil: 'networkidle' });
    const mobileHomePath = path.join(ARTIFACT_DIR, 'preview-mobile-home.png');
    await mobilePage.screenshot({ path: mobileHomePath });
    console.log(`Saved: ${mobileHomePath}`);

    await browser.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    server.close();
    console.log('Capture complete!');
  }
});
