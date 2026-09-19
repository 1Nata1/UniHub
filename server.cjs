const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  
  // Remove leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }
  
  let filePath = path.join(DIST_DIR, pathname || 'index.html');
  
  // Security: prevent directory traversal
  const resolvedPath = path.resolve(filePath);
  const resolvedDist = path.resolve(DIST_DIR);
  if (!resolvedPath.startsWith(resolvedDist)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  
  // If no extension and not a file, try index.html (SPA fallback)
  if (!ext && !pathname.endsWith('/')) {
    // Check if it's likely a route (not a file)
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }
      serveFile(filePath, res);
    });
    return;
  }

  serveFile(filePath, res);
});

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Try index.html for SPA routes
        const ext = path.extname(filePath).toLowerCase();
        if (!ext || filePath.endsWith('index.html')) {
          fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, data2) => {
            if (err2) {
              res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
              res.end('Not found');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data2);
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not found');
        }
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server error');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

server.listen(PORT, '127.0.0.1', () => {
  console.log(`UniHub rodando em http://127.0.0.1:${PORT}`);
  console.log('Pressione Ctrl+C para parar');
});

process.on('SIGINT', () => {
  console.log('\nServidor parado.');
  process.exit(0);
});