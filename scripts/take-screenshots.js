const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR);
}

const BASE_URL = 'http://localhost:3000';

const pagesToScreenshot = [
  { name: 'landing', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'register', path: '/register' },
  { name: 'not-found', path: '/404-not-found-page-test' }
];

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  for (const { name, path: urlPath } of pagesToScreenshot) {
    const fullUrl = `${BASE_URL}${urlPath}`;
    console.log(`Navigating to ${fullUrl}...`);
    
    // Go to page
    await page.goto(fullUrl, { waitUntil: 'networkidle0' });

    // Set Dark Mode
    await page.evaluate(() => {
      localStorage.setItem('mode', 'dark');
      localStorage.setItem('theme', 'indigo');
    });
    // Reload to apply dark mode (or simulate click, but reload is easier)
    await page.reload({ waitUntil: 'networkidle0' });
    
    // Hide scrollbars for cleaner screenshots
    await page.addStyleTag({content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }'});

    const darkPath = path.join(SCREENSHOTS_DIR, `${name}-dark.png`);
    await page.screenshot({ path: darkPath, fullPage: true });
    console.log(`Saved ${darkPath}`);

    // Set Light Mode
    await page.evaluate(() => {
      localStorage.setItem('mode', 'light');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    
    // Hide scrollbars again
    await page.addStyleTag({content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }'});

    const lightPath = path.join(SCREENSHOTS_DIR, `${name}-light.png`);
    await page.screenshot({ path: lightPath, fullPage: true });
    console.log(`Saved ${lightPath}`);
  }

  // Attempt to register/login to get dashboard screenshots
  try {
    console.log('Attempting to register and capture dashboard...');
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });
    
    // Set to dark mode for dashboard
    await page.evaluate(() => {
      localStorage.setItem('mode', 'dark');
    });
    await page.reload({ waitUntil: 'networkidle0' });

    await page.type('#name', 'Test User');
    await page.type('#reg-email', `test${Date.now()}@example.com`);
    await page.type('#reg-password', 'Password123!');
    await page.type('#confirmPassword', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard (or timeout)
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 });

    if (page.url().includes('/dashboard')) {
      console.log('Successfully reached dashboard!');
      
      const dashboardPages = [
        { name: 'dashboard-home', path: '/dashboard' },
        { name: 'dashboard-clients', path: '/dashboard/clients' },
        { name: 'dashboard-projects', path: '/dashboard/projects' },
        { name: 'dashboard-invoices', path: '/dashboard/invoices' },
        { name: 'dashboard-time-logs', path: '/dashboard/time-logs' },
        { name: 'dashboard-ai', path: '/dashboard/ai' },
        { name: 'dashboard-settings', path: '/dashboard/settings' },
        { name: 'dashboard-profile', path: '/dashboard/profile' }
      ];

      for (const { name, path: dPath } of dashboardPages) {
        console.log(`Navigating to ${dPath}...`);
        await page.goto(`${BASE_URL}${dPath}`, { waitUntil: 'networkidle0' });

        // Dashboard Dark
        await page.evaluate(() => localStorage.setItem('mode', 'dark'));
        await page.reload({ waitUntil: 'networkidle0' });
        await page.addStyleTag({content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }'});
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}-dark.png`), fullPage: true });
        console.log(`Saved ${name}-dark.png`);

        // Dashboard Light
        await page.evaluate(() => localStorage.setItem('mode', 'light'));
        await page.reload({ waitUntil: 'networkidle0' });
        await page.addStyleTag({content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }'});
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}-light.png`), fullPage: true });
        console.log(`Saved ${name}-light.png`);
      }

    } else {
      console.log('Failed to reach dashboard (DB issue or auth error). Skipping dashboard screenshots.');
    }
  } catch (err) {
    console.log('Could not capture dashboard screenshots: ' + err.message);
  }

  await browser.close();
  console.log('Screenshots collected!');
}

takeScreenshots().catch(console.error);
