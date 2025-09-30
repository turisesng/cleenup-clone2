// capture.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  // ✅ 1. List only the pages that actually exist on WaxWox.com
  const routes = [
    '/',           // homepage
    '/fleet',      // fleet page
    '/franchise',  // franchise page
    '/imprint',    // imprint / legal page
    '/posts'       // blog / posts page
  ];

  const base = 'https://www.WaxWox.com';
  const out  = path.join(__dirname, 'rendered');

  // ✅ 2. Create the output folder if it doesn’t exist
  if (!fs.existsSync(out)) fs.mkdirSync(out);

  // ✅ 3. Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // ✅ 4. Loop through each route and save the rendered HTML
  for (const r of routes) {
    const url = base + r;
    try {
      console.log(`Fetching: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      const html = await page.content();
      const fname = r === '/'
        ? 'index.html'
        : r.replace(/\//g, '_').replace(/^_/, '') + '.html';

      fs.writeFileSync(path.join(out, fname), html);
      console.log(`✔ Saved ${fname}`);
    } catch (err) {
      console.error(`✖ Failed ${url}: ${err.message}`);
    }
  }

  // ✅ 5. Close browser
  await browser.close();
  console.log('✅ Done. All captured pages are in the "rendered" folder.');
})();
