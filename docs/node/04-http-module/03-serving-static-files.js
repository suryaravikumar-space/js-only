/**
 * TOPIC 03: Serving Static Files
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Static file serving = mapping a URL path to a file on disk.              ║
 * ║ You MUST set the correct Content-Type (MIME type) for each file.         ║
 * ║                                                                            ║
 * ║   .html → text/html       .css → text/css                                ║
 * ║   .js   → text/javascript .json → application/json                       ║
 * ║   .png  → image/png       .jpg  → image/jpeg                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of a LIBRARY.                                                       │
 * │                                                                             │
 * │  You walk in and say: "I want the book at shelf B, row 3"                 │
 * │    → That's like requesting /css/style.css                                │
 * │                                                                             │
 * │  The librarian:                                                            │
 * │    1. Finds the shelf      → path.join(__dirname, 'public', req.url)     │
 * │    2. Checks the format    → MIME type lookup (.css → text/css)          │
 * │    3. Hands you the book   → fs.readFile() + res.end(fileContent)        │
 * │    4. "Book not found"     → 404                                          │
 * │                                                                             │
 * │  Wrong label on the book (wrong MIME type)?                                │
 * │    Browser won't know how to read it!                                     │
 * │                                                                             │
 * │  "Static serving = librarian fetching books by shelf location."           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Static File Serving Flow                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Browser requests: GET /index.html                                       │
 * │        │                                                                    │
 * │        ▼                                                                    │
 * │   ┌──────────────────┐                                                    │
 * │   │ Parse req.url    │                                                    │
 * │   │ → "/index.html"  │                                                    │
 * │   └────────┬─────────┘                                                    │
 * │            ▼                                                                │
 * │   ┌──────────────────────────────────┐                                    │
 * │   │ Build file path:                 │                                    │
 * │   │ path.join(__dirname,             │                                    │
 * │   │   'public', 'index.html')        │                                    │
 * │   └────────┬─────────────────────────┘                                    │
 * │            ▼                                                                │
 * │   ┌──────────────────┐                                                    │
 * │   │ Get MIME type     │                                                    │
 * │   │ .html → text/html │                                                    │
 * │   └────────┬─────────┘                                                    │
 * │            ▼                                                                │
 * │   ┌──────────────────┐  Yes   ┌──────────────────┐                        │
 * │   │ File exists?     │ ─────► │ 200 + file data   │                        │
 * │   └────────┬─────────┘        └──────────────────┘                        │
 * │            │ No                                                             │
 * │            ▼                                                                │
 * │   ┌──────────────────┐                                                    │
 * │   │ 404 Not Found    │                                                    │
 * │   └──────────────────┘                                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const http = require('http');
const path = require('path');

// === MIME type lookup ===
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

// === Simulated file system (inline content instead of real files) ===
const VIRTUAL_FILES = {
  '/index.html': {
    content: '<!DOCTYPE html><html><head><link rel="stylesheet" href="/style.css"></head><body><h1>Hello Node!</h1><script src="/app.js"></script></body></html>',
  },
  '/style.css': {
    content: 'body { font-family: Arial, sans-serif; background: #f0f0f0; color: #333; }',
  },
  '/app.js': {
    content: 'console.log("App loaded!");',
  },
  '/data.json': {
    content: '{"name":"Node.js","type":"runtime","version":"20"}',
  },
};

const server = http.createServer((req, res) => {
  // Default to index.html for root
  let filePath = req.url === '/' ? '/index.html' : req.url;

  // Get the file extension
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  console.log(`   Request: ${filePath} → Content-Type: ${contentType}`);

  // Look up in virtual file system
  const file = VIRTUAL_FILES[filePath];

  if (file) {
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(file.content);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - File Not Found</h1>');
  }
});

const PORT = 3096;

server.listen(PORT, () => {
  console.log('A:', `Static file server on port ${PORT}`);

  // === Test serving different file types ===
  const testFiles = [
    { path: '/', label: 'B', desc: 'index.html (via /)' },
    { path: '/style.css', label: 'C', desc: 'CSS file' },
    { path: '/app.js', label: 'D', desc: 'JS file' },
    { path: '/data.json', label: 'E', desc: 'JSON file' },
    { path: '/missing.png', label: 'F', desc: '404 test' },
  ];

  let completed = 0;
  const results = {};

  testFiles.forEach(({ path: filePath, label, desc }) => {
    http.get(`http://localhost:${PORT}${filePath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const contentType = res.headers['content-type'];
        const preview = data.length > 60 ? `${data.substring(0, 60)}...` : data;
        results[label] = `${desc} [${res.statusCode}] type=${contentType} → "${preview}"`;
        completed += 1;

        if (completed === testFiles.length) {
          Object.keys(results).sort().forEach((key) => {
            console.log(`${key}:`, results[key]);
          });
          server.close(() => {
            console.log('G:', 'Server closed.');
          });
        }
      });
    });
  });
});

/**
 * OUTPUT:
 *   A: Static file server on port 3096
 *      Request: /index.html → Content-Type: text/html
 *      Request: /style.css → Content-Type: text/css
 *      Request: /app.js → Content-Type: text/javascript
 *      Request: /data.json → Content-Type: application/json
 *      Request: /missing.png → Content-Type: image/png
 *   B: index.html (via /) [200] type=text/html → "<!DOCTYPE html><html><head><link rel="stylesheet" href="..."
 *   C: CSS file [200] type=text/css → "body { font-family: Arial, sans-serif; background: #f0f0f..."
 *   D: JS file [200] type=text/javascript → "console.log("App loaded!");"
 *   E: JSON file [200] type=application/json → "{"name":"Node.js","type":"runtime","version":"20"}"
 *   F: 404 test [404] type=text/html → "<h1>404 - File Not Found</h1>"
 *   G: Server closed.
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SECURITY CONCERNS WITH STATIC FILES                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. Path traversal: /../../../etc/passwd → sanitize paths!                ║
 * ║ 2. Always resolve to a known root directory                               ║
 * ║ 3. Use path.normalize() to prevent directory traversal                   ║
 * ║ 4. In production, use express.static() or a CDN like nginx               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "To serve static files in Node.js, you map req.url to a file path using   │
 * │  path.join(__dirname, 'public', req.url), read it with fs.readFile(),     │
 * │  and send it with the correct MIME type in Content-Type header. You need  │
 * │  a MIME type lookup (extension to content-type map). Always sanitize the  │
 * │  path to prevent directory traversal attacks (../../etc/passwd). In       │
 * │  production, use express.static() middleware or serve files from nginx    │
 * │  / a CDN for better performance and caching."                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/04-http-module/03-serving-static-files.js
 */
