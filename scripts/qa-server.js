import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const PORT = 5000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const fullPath = path.join(process.cwd(), reqPath);

  if (!fs.existsSync(fullPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + reqPath);
    return;
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const data = fs.readFileSync(fullPath);

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable'
  };

  if (/\.(html|css|js|json|svg)$/i.test(ext) && acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    const compressed = zlib.gzipSync(data);
    res.writeHead(200, headers);
    res.end(compressed);
  } else {
    headers['Content-Length'] = data.length;
    res.writeHead(200, headers);
    res.end(data);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Static server with gzip running at http://127.0.0.1:${PORT}/`);
});
