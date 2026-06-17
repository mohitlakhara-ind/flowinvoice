/**
 * scripts/take-screenshots-responsive.js
 *
 * Logs in as the seeded demo user (demo@soloflow.app / Demo1234!)
 * and captures dark + light screenshots at medium & small viewports.
 *
 * Prerequisites:
 *   1. npx tsx prisma/seed-demo.ts   ← seed data first
 *   2. npm run dev                    ← app running on localhost:3000
 *   3. node scripts/take-screenshots-responsive.js
 */

const puppeteer = require('puppeteer');
const fs   = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const BASE_URL        = 'http://localhost:3000';
const DEMO_EMAIL      = 'demo@soloflow.app';
const DEMO_PASSWORD   = 'Demo1234!';

const VIEWPORTS = [
  { label: 'desktop', width: 1440, height: 900  },
  { label: 'medium',  width: 768,  height: 1024 },
  { label: 'small',   width: 375,  height: 812  },
];

const publicPages = [
  { name: 'landing',   path: '/'                     },
  { name: 'login',     path: '/login'                },
  { name: 'register',  path: '/register'             },
  { name: 'not-found', path: '/404-not-found-page-test' },
];

const dashboardPages = [
  { name: 'dashboard-home',      path: '/dashboard'             },
  { name: 'dashboard-clients',   path: '/dashboard/clients'    },
  { name: 'dashboard-projects',  path: '/dashboard/projects'   },
  { name: 'dashboard-invoices',  path: '/dashboard/invoices'   },
  { name: 'dashboard-time-logs', path: '/dashboard/time-logs'  },
  { name: 'dashboard-ai',        path: '/dashboard/ai'         },
  { name: 'dashboard-settings',  path: '/dashboard/settings'   },
  { name: 'dashboard-profile',   path: '/dashboard/profile'    },
];

/** Set theme in localStorage then reload, hide scrollbars. */
async function applyTheme(page, mode) {
  await page.evaluate((m) => {
    localStorage.setItem('mode', m);
    localStorage.setItem('theme', 'indigo');
  }, mode);
  await page.reload({ waitUntil: 'networkidle0', timeout: 20000 });
  await page.addStyleTag({
    content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }',
  });
}

/** Navigate and take dark + light shots for every page in the list. */
async function capturePages(page, pages, dir) {
  for (const { name, path: urlPath } of pages) {
    const fullUrl = `${BASE_URL}${urlPath}`;
    console.log(`  → ${fullUrl}`);

    // Dark mode
    await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 20000 });
    await applyTheme(page, 'dark');
    await page.screenshot({ path: path.join(dir, `${name}-dark.png`), fullPage: true });
    console.log(`    ✓ ${name}-dark.png`);

    // Light mode
    await applyTheme(page, 'light');
    await page.screenshot({ path: path.join(dir, `${name}-light.png`), fullPage: true });
    console.log(`    ✓ ${name}-light.png`);
  }
}

/** Log in once, then return — cookies/session persist on the page object. */
async function loginAsDemoUser(page) {
  console.log(`  Logging in as ${DEMO_EMAIL}…`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0', timeout: 20000 });

  // Set dark mode before logging in so dashboard loads correctly
  await page.evaluate(() => {
    localStorage.setItem('mode', 'dark');
    localStorage.setItem('theme', 'indigo');
  });

  await page.reload({ waitUntil: 'networkidle0', timeout: 20000 });

  // Fill login form
  await page.waitForSelector('#email', { timeout: 10000 });
  await page.click('#email', { clickCount: 3 });
  await page.type('#email', DEMO_EMAIL);

  await page.waitForSelector('#password', { timeout: 5000 });
  await page.click('#password', { clickCount: 3 });
  await page.type('#password', DEMO_PASSWORD);

  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 });

  const landed = page.url();
  if (!landed.includes('/dashboard')) {
    throw new Error(`Login failed — landed on: ${landed}`);
  }
  console.log(`  ✅ Logged in — at ${landed}`);
}

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const viewport of VIEWPORTS) {
    console.log(`\n📐 Viewport: ${viewport.label} (${viewport.width}×${viewport.height})`);

    const dir = path.join(SCREENSHOTS_DIR, viewport.label);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });

    // ── Public pages (no auth needed) ─────────────────────────────────────
    console.log('  📄 Public pages:');
    await capturePages(page, publicPages, dir);

    // ── Dashboard pages (login first) ─────────────────────────────────────
    console.log('  🔐 Dashboard pages:');
    try {
      await loginAsDemoUser(page);
      await capturePages(page, dashboardPages, dir);
    } catch (err) {
      console.warn(`  ⚠  Dashboard skipped: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\n✅ All screenshots captured!');
}

run().catch(console.error);
