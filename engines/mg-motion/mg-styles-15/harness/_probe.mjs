// Minimal readiness probe: reports why window.__ready never flips.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2' };

const srv = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (e, d) => {
    if (e) { res.writeHead(404); res.end('nf'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream' });
    res.end(d);
  });
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${srv.address().port}/_probe_index.html`;

const browser = await puppeteer.launch({
  executablePath: process.env.MG_CHROME,
  headless: true, protocolTimeout: 60000,
  args: ['--no-sandbox', '--disable-gpu-watchdog', '--font-render-hinting=none'],
});
const page = await browser.newPage();
page.on('console', m => console.log('[console]', m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
page.on('requestfailed', r => console.log('[reqfail]', r.url().split('/').slice(-1)[0], r.failure()?.errorText));
await page.goto(url, { waitUntil: 'load', timeout: 30000 });
await new Promise(r => setTimeout(r, 8000));
console.log('LOG>>>', JSON.stringify(await page.evaluate(() => window.__log || '(no log)')));
console.log('READY>>>', await page.evaluate(() => window.__ready === true));
await browser.close();
srv.close();

