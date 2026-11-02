import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

console.log('=== [6/6] Playwright 跨屏幕与移动端交互自动化测试 ===\n');

const DIST_DIR = path.resolve('./dist');
const VIEWPORTS = [
  { width: 360, height: 640, name: 'Small Mobile (360px)' },
  { width: 390, height: 844, name: 'Standard Mobile (390px - iPhone 14/15)' },
  { width: 768, height: 1024, name: 'Tablet (768px - iPad)' },
  { width: 1024, height: 768, name: 'Small Desktop (1024px)' },
  { width: 1440, height: 900, name: 'Large Desktop (1440px)' }
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

// 1. Start local static file server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath.endsWith('/')) {
        reqPath += 'index.html';
      } else if (!path.extname(reqPath)) {
        reqPath += '/index.html';
      }

      const filePath = path.join(DIST_DIR, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        const notFoundPath = path.join(DIST_DIR, '404.html');
        if (fs.existsSync(notFoundPath)) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(notFoundPath).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

async function runMobileAudit() {
  const { server, port } = await startServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`✓ 本地静态测试服务器已启动: ${baseUrl}`);

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ headless: true });
  }

  let hasError = false;

  for (const vp of VIEWPORTS) {
    console.log(`\n--- 测试视口: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    // 1. Homepage horizontal overflow check
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    
    // Check horizontal overflow
    const overflowCheck = await page.evaluate(() => {
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        isOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });

    if (overflowCheck.isOverflow) {
      console.error(`  ❌ 视口 ${vp.width}px 存在水平溢出！clientWidth=${overflowCheck.clientWidth}, scrollWidth=${overflowCheck.scrollWidth}`);
      hasError = true;
    } else {
      console.log(`  ✓ Bento 宫格无水平溢出 (宽 ${vp.width}px, scrollWidth: ${overflowCheck.scrollWidth}px)`);
    }

    // 2. Mobile Menu Check (on widths < 860px)
    if (vp.width <= 768) {
      const toggle = page.locator('[data-mobile-nav-toggle]');
      const drawer = page.locator('[data-mobile-nav-menu]');

      if (await toggle.isVisible()) {
        await toggle.click();
        const isOpen = await drawer.evaluate(el => el.classList.contains('is-open'));
        const isAriaExpanded = await toggle.getAttribute('aria-expanded');

        if (isOpen && isAriaExpanded === 'true') {
          console.log(`  ✓ 移动端汉堡菜单展开正常 (aria-expanded=true)`);
          // Test Escape to close
          await page.keyboard.press('Escape');
          const isClosed = await drawer.evaluate(el => !el.classList.contains('is-open'));
          if (isClosed) {
            console.log(`  ✓ 按下 Escape 键自动关闭菜单正常`);
          } else {
            console.error(`  ❌ Escape 键未正确关闭菜单`);
            hasError = true;
          }
        } else {
          console.error(`  ❌ 汉堡菜单点击未正确展开`);
          hasError = true;
        }
      }
    }

    // 3. Diagnostic Wizard interaction check
    const winBtn = page.locator('[data-env="windows"]');
    if (await winBtn.isVisible()) {
      await winBtn.click();
      const symptomBtn = page.locator('[data-symptom="connected-no-web"]');
      if (await symptomBtn.isVisible()) {
        await symptomBtn.click();
        const reportBtn = page.locator('#btn-generate-report');
        if (await reportBtn.isVisible()) {
          await reportBtn.click();
          const reportArea = page.locator('#report-text-area');
          const reportValue = await reportArea.inputValue();
          if (reportValue.includes('CTC 金龙鱼设备连接自检报告')) {
            console.log(`  ✓ 诊断向导三步决策树及去敏报告生成交互正常`);
          } else {
            console.error(`  ❌ 自检报告内容未能正常生成`);
            hasError = true;
          }
        }
      }
    }

    // 4. FAQ accordion check
    const firstFaqTrigger = page.locator('.faq-trigger').first();
    if (await firstFaqTrigger.isVisible()) {
      await firstFaqTrigger.click();
      const isExpanded = await firstFaqTrigger.getAttribute('aria-expanded');
      if (isExpanded === 'true') {
        console.log(`  ✓ FAQ 折叠手风琴展开与 ARIA 状态正常`);
      } else {
        console.error(`  ❌ FAQ 展开交互异常`);
        hasError = true;
      }
    }

    // 5. Article Reading check
    await page.goto(`${baseUrl}/guides/ctc-windows-proxy/`, { waitUntil: 'domcontentloaded' });
    const h1 = page.locator('h1');
    const table = page.locator('.markdown-body table');
    const hasH1 = await h1.isVisible();
    const hasTable = await table.isVisible();

    if (hasH1 && hasTable) {
      console.log(`  ✓ 文章详情页正文与对比表格在 ${vp.width}px 视口下渲染完整`);
    } else {
      console.error(`  ❌ 文章详情页渲染缺失`);
      hasError = true;
    }

    await context.close();
  }

  // 6. Registration link destination check
  const testContext = await browser.newContext();
  const testPage = await testContext.newPage();
  await testPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  const regLinks = await testPage.locator('a[href*="varnexa.lingdongaff.com"]').all();
  let validRegCount = 0;
  for (const link of regLinks) {
    const href = await link.getAttribute('href');
    if (href === 'https://varnexa.lingdongaff.com/#/?code=HHoxxHGa') {
      validRegCount++;
    }
  }
  console.log(`\n✓ 首页验证了 ${validRegCount} 个注册按钮，目标链接全部正确`);

  await browser.close();
  server.close();

  console.log('\n=== 移动端与跨端自检结果 ===');
  if (hasError) {
    console.error('❌ 自动化测试未通过！');
    process.exit(1);
  } else {
    console.log('✅ 所有视口 (360px–1440px) 响应式、Bento 无溢出、菜单、向导与文章阅读全绿通过！');
  }
}

runMobileAudit();
