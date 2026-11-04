#!/usr/bin/env node
// 零依赖静态服务器：把 skill 根目录 serving 出来，让「用 ES module 写的 demo」也能播放。
// node scripts/serve.mjs [--port 8088] [--open]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argPort = process.argv.indexOf('--port');
const PORT = argPort > 0 ? Number(process.argv[argPort + 1]) : 8088;
const argRoot = process.argv.indexOf('--root');
const OVERRIDE_ROOT = argRoot >= 0 ? path.resolve(process.argv[argRoot + 1]) : null;
const OPEN = process.argv.includes('--open');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.hdr': 'application/octet-stream',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.flac': 'audio/flac',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
  if (rel === '/' || rel === '') rel = OVERRIDE_ROOT ? '/styles/art-deco/demo/index.html' : '/gallery/index.html';
  const base = OVERRIDE_ROOT || ROOT;
  const abs = path.join(base, rel);
  if (!abs.startsWith(base)) { res.writeHead(403).end('forbidden'); return; }
  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('404 ' + rel); return; }
    const type = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache', 'access-control-allow-origin': '*' });
    fs.createReadStream(abs).pipe(res);
  });
});

server.listen(PORT, () => {
  const base = 'http://localhost:' + PORT;
  console.log('');
  console.log('  选片台     ' + base + '/gallery/index.html');
  console.log('  一次演示   ' + base + '/engines/onetake/gallery/gallery.html?demo=wordRise&play');
  console.log('  动效播放器 ' + base + '/engines/wise-motion/catalog/index.html#fade-rise');
  console.log('  案例 demo  ' + base + '/engines/claude-motion/assets/cases/lemo-opuscar/styles/art-deco/demo/index.html');
  console.log('');
  console.log('  Ctrl+C 结束。用这个地址打开选片台时，标「可播放」的模块化 demo 也能直接放。');
  console.log('');
  if (OPEN) {
    const opener = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    import('node:child_process').then((cp) => cp.spawn(opener, [base + '/gallery/index.html'], { shell: true, stdio: 'ignore' }));
  }
});
