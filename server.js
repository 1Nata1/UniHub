const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, req.url === '/' ? '/index.html' : req.url);
  
  // SPA fallback - serve index.html for non-file routes
  const ext = path.extname(filePath);
  if (!ext && req.url !== '/') {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try index.html for SPA routes
      if (err.code === 'ENOENT' && !ext) {
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        });
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
      return;
    }

    const mime = mimeTypes[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`UniHub rodando em http://127.0.0.1:${PORT}`);
  console.log('Pressione Ctrl+C para parar');
});

process.on('SIGINT', () => {
  console.log('\nServidor parado.');
  process.exit(0);
});