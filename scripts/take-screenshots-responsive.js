const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');

const VIEWPORTS = [
  { label: 'medium', width: 768,  height: 1024 },
  { label: 'small',  width: 375,  height: 812  },
];

const BASE_URL = 'http://localhost:3000';

const publicPages = [
  { name: 'landing',   path: '/' },
  { name: 'login',     path: '/login' },
  { name: 'register',  path: '/register' },
  { name: 'not-found', path: '/404-not-found-page-test' },
];

const dashboardPages = [
  { name: 'dashboard-home',      path: '/dashboard' },
  { name: 'dashboard-clients',   path: '/dashboard/clients' },
  { name: 'dashboard-projects',  path: '/dashboard/projects' },
  { name: 'dashboard-invoices',  path: '/dashboard/invoices' },
  { name: 'dashboard-time-logs', path: '/dashboard/time-logs' },
  { name: 'dashboard-ai',        path: '/dashboard/ai' },
  { name: 'dashboard-settings',  path: '/dashboard/settings' },
  { name: 'dashboard-profile',   path: '/dashboard/profile' },
];

async function capturePages(page, pages, dir) {
  for (const { name, path: urlPath } of pages) {
    const fullUrl = `${BASE_URL}${urlPath}`;
    console.log(`  → ${fullUrl}`);

    // Dark mode
    await page.goto(fullUrl, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('mode', 'dark');
      localStorage.setItem('theme', 'indigo');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }' });
    const darkPath = path.join(dir, `${name}-dark.png`);
    await page.screenshot({ path: darkPath, fullPage: true });
    console.log(`    ✓ saved ${name}-dark.png`);

    // Light mode
    await page.evaluate(() => localStorage.setItem('mode', 'light'));
    await page.reload({ waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }' });
    const lightPath = path.join(dir, `${name}-light.png`);
    await page.screenshot({ path: lightPath, fullPage: true });
    console.log(`    ✓ saved ${name}-light.png`);
  }
}

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const viewport of VIEWPORTS) {
    console.log(`\n📱 Capturing at ${viewport.label} (${viewport.width}×${viewport.height})...`);

    const dir = path.join(SCREENSHOTS_DIR, viewport.label);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });

    // ── Public pages ───────────────────────────────────────────────────
    console.log('  Public pages:');
    await capturePages(page, publicPages, dir);

    // ── Dashboard (register a fresh test account) ──────────────────────
    console.log('  Dashboard pages (attempting login)...');
    try {
      await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => localStorage.setItem('mode', 'dark'));
      await page.reload({ waitUntil: 'networkidle0' });

      await page.type('#name', 'Test User');
      await page.type('#reg-email', `test${Date.now()}@example.com`);
      await page.type('#reg-password', 'Password123!');
      await page.type('#confirmPassword', 'Password123!');
      await page.click('button[type="submit"]');

      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

      if (page.url().includes('/dashboard')) {
        console.log('  Successfully reached dashboard!');
        await capturePages(page, dashboardPages, dir);
      } else {
        console.log('  ⚠  Could not reach dashboard — skipping dashboard screenshots.');
      }
    } catch (err) {
      console.log(`  ⚠  Dashboard capture skipped: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\n✅ Responsive screenshots done!');
}

run().catch(console.error);
