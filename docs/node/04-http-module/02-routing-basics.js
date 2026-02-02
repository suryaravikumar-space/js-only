/**
 * TOPIC 02: Routing Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Routing = matching req.url + req.method to the right handler.            ║
 * ║ Without a framework, you use if/else or a lookup object.                 ║
 * ║                                                                            ║
 * ║   if (req.url === '/api/users' && req.method === 'GET') { ... }         ║
 * ║   else { res.writeHead(404); res.end('Not Found'); }                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of a RECEPTION DESK in a large building.                           │
 * │                                                                             │
 * │  A visitor walks in and says:                                              │
 * │    - "I want to SEE (GET) the SALES department (/sales)"                  │
 * │    - "I want to SUBMIT (POST) a form to HR (/hr)"                        │
 * │    - "I want to UPDATE (PUT) my info in ACCOUNTS (/accounts)"            │
 * │                                                                             │
 * │  The receptionist checks:                                                  │
 * │    1. WHERE do you want to go?  → req.url                                │
 * │    2. WHAT do you want to do?   → req.method                             │
 * │    3. Directs them accordingly  → route handler                           │
 * │    4. "Sorry, no such dept"     → 404 Not Found                           │
 * │                                                                             │
 * │  "Routing = receptionist directing visitors to the right room."           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Routing Flow                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Incoming Request                                                         │
 * │        │                                                                    │
 * │        ▼                                                                    │
 * │   ┌─────────┐    GET /          ┌──────────────┐                          │
 * │   │ Router  │ ────────────────► │ Home Handler │                          │
 * │   │         │                   └──────────────┘                          │
 * │   │ Check   │    GET /api/users ┌──────────────┐                          │
 * │   │ url +   │ ────────────────► │ Users List   │                          │
 * │   │ method  │                   └──────────────┘                          │
 * │   │         │    POST /api/users┌──────────────┐                          │
 * │   │         │ ────────────────► │ Create User  │                          │
 * │   │         │                   └──────────────┘                          │
 * │   │         │    No match       ┌──────────────┐                          │
 * │   │         │ ────────────────► │ 404 Handler  │                          │
 * │   └─────────┘                   └──────────────┘                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const http = require('http');

// === In-memory data store ===
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// === Helper to send JSON responses ===
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// === Server with manual routing ===
const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(`   Route hit: ${method} ${url}`);

  // --- Route: GET / ---
  if (url === '/' && method === 'GET') {
    sendJSON(res, 200, { message: 'Welcome to the API' });

  // --- Route: GET /api/users ---
  } else if (url === '/api/users' && method === 'GET') {
    sendJSON(res, 200, { users });

  // --- Route: POST /api/users ---
  } else if (url === '/api/users' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      const newUser = JSON.parse(body);
      newUser.id = users.length + 1;
      users.push(newUser);
      sendJSON(res, 201, { created: newUser });
    });

  // --- Route: GET /api/users/:id (simple pattern) ---
  } else if (url.match(/^\/api\/users\/\d+$/) && method === 'GET') {
    const id = parseInt(url.split('/').pop());
    const user = users.find((u) => u.id === id);
    if (user) {
      sendJSON(res, 200, { user });
    } else {
      sendJSON(res, 404, { error: 'User not found' });
    }

  // --- 404: No route matched ---
  } else {
    sendJSON(res, 404, { error: `Cannot ${method} ${url}` });
  }
});

const PORT = 3097;

server.listen(PORT, () => {
  console.log('A:', `Router server on port ${PORT}`);

  // === Test multiple routes ===
  const testRoutes = [
    { path: '/', label: 'B' },
    { path: '/api/users', label: 'C' },
    { path: '/api/users/1', label: 'D' },
    { path: '/nonexistent', label: 'E' },
  ];

  let completed = 0;
  const results = {};

  testRoutes.forEach(({ path, label }) => {
    http.get(`http://localhost:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        results[label] = `[${res.statusCode}] ${data}`;
        completed += 1;

        if (completed === testRoutes.length) {
          // Print in order
          Object.keys(results).sort().forEach((key) => {
            console.log(`${key}:`, results[key]);
          });

          // POST test
          const postData = JSON.stringify({ name: 'Charlie' });
          const postOpts = {
            hostname: 'localhost',
            port: PORT,
            path: '/api/users',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData),
            },
          };

          const postReq = http.request(postOpts, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              console.log('F:', `[${res.statusCode}] ${data}`);
              server.close(() => {
                console.log('G:', 'Server closed.');
              });
            });
          });
          postReq.write(postData);
          postReq.end();
        }
      });
    });
  });
});

/**
 * OUTPUT:
 *   A: Router server on port 3097
 *      Route hit: GET /
 *      Route hit: GET /api/users
 *      Route hit: GET /api/users/1
 *      Route hit: GET /nonexistent
 *   B: [200] {"message":"Welcome to the API"}
 *   C: [200] {"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}
 *   D: [200] {"user":{"id":1,"name":"Alice"}}
 *   E: [404] {"error":"Cannot GET /nonexistent"}
 *      Route hit: POST /api/users
 *   F: [201] {"created":{"name":"Charlie","id":3}}
 *   G: Server closed.
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ ROUTING PATTERNS                                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. if/else chain       → simple, but messy with many routes              ║
 * ║ 2. Lookup object/Map   → cleaner, O(1) lookup                            ║
 * ║ 3. Regex matching      → for dynamic segments like /users/:id            ║
 * ║ 4. Express/Fastify     → use a framework for real apps                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "In vanilla Node.js, routing is done manually by checking req.url and     │
 * │  req.method with if/else statements or a route map object. You parse the  │
 * │  URL, match it against known patterns (including regex for dynamic        │
 * │  segments like /users/:id), and call the appropriate handler. Unmatched   │
 * │  routes return 404. This approach works for small servers, but for real   │
 * │  applications you'd use Express or Fastify which provide declarative     │
 * │  routing with app.get('/path', handler) syntax, middleware support,       │
 * │  and built-in parameter parsing."                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/04-http-module/02-routing-basics.js
 */
