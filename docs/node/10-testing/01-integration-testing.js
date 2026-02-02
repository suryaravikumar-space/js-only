/**
 * TOPIC 01: Integration Testing in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ An integration test verifies that MULTIPLE PARTS work TOGETHER.          ║
 * ║ If your test checks a single function in isolation - it's a unit test.   ║
 * ║ Integration tests touch REAL boundaries: HTTP, DB, file system.          ║
 * ║                                                                          ║
 * ║   Integration Test = Test components WORKING TOGETHER                    ║
 * ║   Scope            = Routes + Middleware + Controllers + DB              ║
 * ║   Speed            = Slower than unit, faster than E2E                   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Imagine you built individual LEGO bricks and tested each one (unit test). │
 * │  Now you SNAP THEM TOGETHER to build a wall. Does the wall stand?         │
 * │                                                                             │
 * │    - Does the door fit into the wall frame? (integration test)            │
 * │    - Does the roof connect to the walls? (integration test)               │
 * │    - Does the plumbing flow from sink to drain? (integration test)        │
 * │                                                                             │
 * │  Each brick is fine ALONE, but they might not FIT TOGETHER.               │
 * │  A bolt might be 1mm too wide. A pipe might not align.                    │
 * │                                                                             │
 * │  Integration tests catch the problems that happen AT THE SEAMS -          │
 * │  where one component hands data to another.                               │
 * │                                                                             │
 * │  "Test the seams where the bricks meet."                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: INTEGRATION TEST SCOPE                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Unit Test:                                                                │
 * │  ┌──────────┐                                                              │
 * │  │ Function │  <-- Test THIS alone                                        │
 * │  └──────────┘                                                              │
 * │                                                                             │
 * │  Integration Test:                                                         │
 * │  ┌────────┐   ┌────────────┐   ┌────────────┐   ┌────────┐               │
 * │  │ Client │──>│  Router +  │──>│ Controller │──>│   DB   │               │
 * │  │ (HTTP) │   │ Middleware │   │  + Service │   │ (Real) │               │
 * │  └────────┘   └────────────┘   └────────────┘   └────────┘               │
 * │        └────────── Test ALL of this TOGETHER ──────────┘                  │
 * │                                                                             │
 * │  Supertest Pattern:                                                        │
 * │  ┌──────────────────────────────────────────┐                              │
 * │  │  request(app)                            │                              │
 * │  │    .get('/api/users')                    │  <-- Real HTTP request       │
 * │  │    .set('Authorization', 'Bearer ...')   │  <-- Real headers            │
 * │  │    .expect(200)                          │  <-- Assert status           │
 * │  │    .expect('Content-Type', /json/)       │  <-- Assert headers          │
 * │  │    .expect({ users: [...] })             │  <-- Assert body             │
 * │  └──────────────────────────────────────────┘                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: Building a Minimal HTTP Server for Testing
// ============================================================================

const http = require('http');
const assert = require('assert');

// --- Simple in-memory "app" simulating Express-like routes ---
const createApp = () => {
  const users = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'user' },
  ];

  const routes = {
    'GET /api/users': (req) => {
      return { status: 200, body: { users, count: users.length } };
    },
    'GET /api/users/:id': (req, params) => {
      const user = users.find((u) => u.id === Number(params.id));
      if (!user) return { status: 404, body: { error: 'User not found' } };
      return { status: 200, body: user };
    },
    'POST /api/users': (req, params, body) => {
      if (!body.name) return { status: 400, body: { error: 'Name is required' } };
      const newUser = { id: users.length + 1, name: body.name, role: body.role || 'user' };
      users.push(newUser);
      return { status: 201, body: newUser };
    },
    'DELETE /api/users/:id': (req, params) => {
      const idx = users.findIndex((u) => u.id === Number(params.id));
      if (idx === -1) return { status: 404, body: { error: 'User not found' } };
      const deleted = users.splice(idx, 1)[0];
      return { status: 200, body: { message: `Deleted ${deleted.name}` } };
    },
  };

  // Simple router that matches patterns like "GET /api/users/:id"
  const matchRoute = (method, url) => {
    for (const [pattern, handler] of Object.entries(routes)) {
      const [routeMethod, routePath] = pattern.split(' ');
      if (routeMethod !== method) continue;

      const routeParts = routePath.split('/');
      const urlParts = url.split('/');
      if (routeParts.length !== urlParts.length) continue;

      const params = {};
      let match = true;
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = urlParts[i];
        } else if (routeParts[i] !== urlParts[i]) {
          match = false;
          break;
        }
      }
      if (match) return { handler, params };
    }
    return null;
  };

  const server = http.createServer((req, res) => {
    // --- Middleware: Auth check ---
    const authHeader = req.headers['authorization'];
    const publicRoutes = ['GET /api/users'];
    const routeKey = `${req.method} ${req.url}`;

    if (!publicRoutes.includes(routeKey) && !authHeader) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    // --- Middleware: Parse JSON body ---
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const parsedBody = body ? JSON.parse(body) : {};
      const matched = matchRoute(req.method, req.url);

      if (!matched) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
        return;
      }

      const result = matched.handler(req, matched.params, parsedBody);
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.body));
    });
  });

  return server;
};

console.log('A:', 'Minimal HTTP app created (router + middleware + controller)');


// ============================================================================
// SECTION 2: Supertest-like Helper (No External Dependency)
// ============================================================================

// --- Build a lightweight supertest-style request helper ---
const makeRequest = (server) => {
  // Start server on random port
  const startServer = () =>
    new Promise((resolve) => {
      server.listen(0, () => resolve(server.address().port));
    });

  const stopServer = () =>
    new Promise((resolve) => server.close(resolve));

  const request = async (method, path, { body, headers } = {}) => {
    const port = await startServer();
    const options = {
      hostname: 'localhost',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const result = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
          });
        });
      });
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });

    await stopServer();
    return result;
  };

  return {
    get: (path, opts) => request('GET', path, opts),
    post: (path, opts) => request('POST', path, opts),
    delete: (path, opts) => request('DELETE', path, opts),
  };
};

console.log('B:', 'Supertest-like helper built (no external deps)');


// ============================================================================
// SECTION 3: Integration Tests - GET Routes
// ============================================================================

const { describe, it, before, after } = require('node:test');

describe('Integration: GET /api/users', () => {

  let app, req;

  before(() => {
    app = createApp();
    req = makeRequest(app);
  });

  it('should return all users with 200 status', async () => {
    const res = await req.get('/api/users');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.count, 3);
    assert.ok(Array.isArray(res.body.users));
    assert.strictEqual(res.body.users[0].name, 'Alice');
  });

  it('should return Content-Type: application/json', async () => {
    const res = await req.get('/api/users');
    assert.ok(res.headers['content-type'].includes('application/json'));
  });

  // Public route - no auth needed
  it('should NOT require authorization for listing users', async () => {
    const res = await req.get('/api/users');
    assert.strictEqual(res.status, 200); // No auth header, still 200
  });
});

console.log('C:', 'GET route integration tests defined');


// ============================================================================
// SECTION 4: Integration Tests - GET with Params
// ============================================================================

describe('Integration: GET /api/users/:id', () => {

  let app, req;

  before(() => {
    app = createApp();
    req = makeRequest(app);
  });

  it('should return a single user by ID', async () => {
    const res = await req.get('/api/users/1', {
      headers: { Authorization: 'Bearer test-token' },
    });

    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body, { id: 1, name: 'Alice', role: 'admin' });
  });

  it('should return 404 for non-existent user', async () => {
    const res = await req.get('/api/users/999', {
      headers: { Authorization: 'Bearer test-token' },
    });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, 'User not found');
  });

  // TRICKY: Auth middleware fires BEFORE route handler
  it('should return 401 without auth token', async () => {
    const res = await req.get('/api/users/1');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error, 'Unauthorized');
  });
});

console.log('D:', 'GET /:id integration tests defined');


// ============================================================================
// SECTION 5: Integration Tests - POST (Create Resource)
// ============================================================================

describe('Integration: POST /api/users', () => {

  let app, req;

  before(() => {
    app = createApp();
    req = makeRequest(app);
  });

  it('should create a new user with 201 status', async () => {
    const res = await req.post('/api/users', {
      body: { name: 'Diana', role: 'moderator' },
      headers: { Authorization: 'Bearer test-token' },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.name, 'Diana');
    assert.strictEqual(res.body.role, 'moderator');
    assert.ok(res.body.id, 'Should have an auto-generated ID');
  });

  it('should default role to "user" if not provided', async () => {
    const res = await req.post('/api/users', {
      body: { name: 'Eve' },
      headers: { Authorization: 'Bearer test-token' },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.role, 'user');
  });

  // Validation: missing required field
  it('should return 400 when name is missing', async () => {
    const res = await req.post('/api/users', {
      body: { role: 'user' },
      headers: { Authorization: 'Bearer test-token' },
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Name is required');
  });

  // Auth middleware applies to POST too
  it('should return 401 without auth token', async () => {
    const res = await req.post('/api/users', {
      body: { name: 'Hacker' },
    });
    assert.strictEqual(res.status, 401);
  });
});

console.log('E:', 'POST integration tests defined');


// ============================================================================
// SECTION 6: Integration Tests - DELETE
// ============================================================================

describe('Integration: DELETE /api/users/:id', () => {

  let app, req;

  before(() => {
    app = createApp();
    req = makeRequest(app);
  });

  it('should delete an existing user', async () => {
    const res = await req.delete('/api/users/2', {
      headers: { Authorization: 'Bearer test-token' },
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.message.includes('Deleted'));
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await req.delete('/api/users/999', {
      headers: { Authorization: 'Bearer test-token' },
    });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, 'User not found');
  });
});

console.log('F:', 'DELETE integration tests defined');


// ============================================================================
// SECTION 7: Supertest Patterns Cheatsheet (What Real Code Looks Like)
// ============================================================================

// --- In a REAL project with Express + Supertest, you'd write: ---
//
// const request = require('supertest');
// const app = require('../app');
//
// describe('GET /api/users', () => {
//   it('should return all users', async () => {
//     const res = await request(app)
//       .get('/api/users')
//       .set('Authorization', 'Bearer valid-token')
//       .expect('Content-Type', /json/)
//       .expect(200);
//
//     expect(res.body.users).toHaveLength(3);
//   });
//
//   it('should filter by role', async () => {
//     const res = await request(app)
//       .get('/api/users?role=admin')
//       .set('Authorization', 'Bearer valid-token')
//       .expect(200);
//
//     expect(res.body.users.every(u => u.role === 'admin')).toBe(true);
//   });
//
//   it('should return 401 without token', async () => {
//     await request(app)
//       .get('/api/users')
//       .expect(401);
//   });
// });
//
// KEY PATTERN: Separate app from server
//   app.js   -> exports the Express app (NO .listen())
//   server.js -> requires app and calls .listen()
//   test      -> requires app, supertest starts its own server
//
// This prevents port conflicts and allows parallel test suites!

console.log('G:', 'Supertest patterns documented (see comments)');


// ============================================================================
// SECTION 8: Testing Middleware in Isolation vs Integration
// ============================================================================

describe('Middleware Integration', () => {

  // Middleware that validates API keys
  const apiKeyMiddleware = (req) => {
    const key = req.headers['x-api-key'];
    if (!key) return { valid: false, error: 'API key missing' };
    if (key !== 'secret-123') return { valid: false, error: 'Invalid API key' };
    return { valid: true, user: 'authenticated-user' };
  };

  // Middleware that rate-limits requests
  const rateLimiter = () => {
    const requests = new Map();
    return (ip) => {
      const now = Date.now();
      const windowMs = 1000; // 1 second window
      const maxRequests = 3;

      if (!requests.has(ip)) requests.set(ip, []);
      const timestamps = requests.get(ip).filter((t) => now - t < windowMs);
      timestamps.push(now);
      requests.set(ip, timestamps);

      return timestamps.length <= maxRequests
        ? { allowed: true, remaining: maxRequests - timestamps.length }
        : { allowed: false, retryAfter: windowMs };
    };
  };

  it('should validate correct API key', () => {
    const result = apiKeyMiddleware({ headers: { 'x-api-key': 'secret-123' } });
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.user, 'authenticated-user');
  });

  it('should reject missing API key', () => {
    const result = apiKeyMiddleware({ headers: {} });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'API key missing');
  });

  it('should reject invalid API key', () => {
    const result = apiKeyMiddleware({ headers: { 'x-api-key': 'wrong' } });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'Invalid API key');
  });

  it('should allow requests within rate limit', () => {
    const limiter = rateLimiter();
    assert.strictEqual(limiter('192.168.1.1').allowed, true);
    assert.strictEqual(limiter('192.168.1.1').allowed, true);
    assert.strictEqual(limiter('192.168.1.1').allowed, true);
  });

  it('should block requests exceeding rate limit', () => {
    const limiter = rateLimiter();
    limiter('10.0.0.1');
    limiter('10.0.0.1');
    limiter('10.0.0.1');
    const result = limiter('10.0.0.1'); // 4th request
    assert.strictEqual(result.allowed, false);
    assert.ok(result.retryAfter > 0);
  });

  // TRICKY: Different IPs have separate limits
  it('should track rate limits per IP', () => {
    const limiter = rateLimiter();
    limiter('1.1.1.1');
    limiter('1.1.1.1');
    limiter('1.1.1.1');

    // Different IP - fresh limit
    const result = limiter('2.2.2.2');
    assert.strictEqual(result.allowed, true);
  });
});

console.log('H:', 'Middleware integration tests defined');


// ============================================================================
// SECTION 9: Database Integration Test Pattern (Simulated)
// ============================================================================

describe('Database Integration (Simulated)', () => {

  // In-memory DB simulation
  const createDB = () => {
    const tables = {};
    return {
      createTable: (name) => { tables[name] = []; },
      insert: (table, record) => {
        const id = tables[table].length + 1;
        const entry = { id, ...record };
        tables[table].push(entry);
        return entry;
      },
      findById: (table, id) => tables[table]?.find((r) => r.id === id) || null,
      findAll: (table) => [...(tables[table] || [])],
      update: (table, id, data) => {
        const idx = tables[table]?.findIndex((r) => r.id === id);
        if (idx === -1 || idx === undefined) return null;
        tables[table][idx] = { ...tables[table][idx], ...data };
        return tables[table][idx];
      },
      deleteById: (table, id) => {
        const idx = tables[table]?.findIndex((r) => r.id === id);
        if (idx === -1 || idx === undefined) return false;
        tables[table].splice(idx, 1);
        return true;
      },
      drop: (name) => { delete tables[name]; },
    };
  };

  // Service layer that uses the DB
  const createUserService = (db) => ({
    createUser: (name, email) => {
      if (!name || !email) throw new Error('Name and email required');
      return db.insert('users', { name, email, createdAt: Date.now() });
    },
    getUser: (id) => db.findById('users', id),
    listUsers: () => db.findAll('users'),
    updateUser: (id, data) => {
      const existing = db.findById('users', id);
      if (!existing) throw new Error('User not found');
      return db.update('users', id, data);
    },
    deleteUser: (id) => {
      if (!db.deleteById('users', id)) throw new Error('User not found');
      return true;
    },
  });

  let db, userService;

  before(() => {
    db = createDB();
    db.createTable('users');
    userService = createUserService(db);
  });

  after(() => {
    db.drop('users');
  });

  it('should create and retrieve a user (full round-trip)', () => {
    const created = userService.createUser('Alice', 'alice@test.com');
    assert.strictEqual(created.name, 'Alice');
    assert.ok(created.id);

    const fetched = userService.getUser(created.id);
    assert.strictEqual(fetched.name, 'Alice');
    assert.strictEqual(fetched.email, 'alice@test.com');
  });

  it('should update a user through the service layer', () => {
    const user = userService.createUser('Bob', 'bob@test.com');
    const updated = userService.updateUser(user.id, { name: 'Robert' });
    assert.strictEqual(updated.name, 'Robert');
    assert.strictEqual(updated.email, 'bob@test.com'); // Unchanged fields preserved
  });

  it('should delete a user and confirm removal', () => {
    const user = userService.createUser('Temp', 'temp@test.com');
    userService.deleteUser(user.id);
    const result = userService.getUser(user.id);
    assert.strictEqual(result, null);
  });

  it('should throw when updating non-existent user', () => {
    assert.throws(() => userService.updateUser(999, { name: 'Ghost' }), {
      message: 'User not found',
    });
  });

  it('should list all users', () => {
    const all = userService.listUsers();
    assert.ok(Array.isArray(all));
    assert.ok(all.length > 0);
  });
});

console.log('I:', 'Database integration tests defined');
console.log('J:', 'All integration test concepts demonstrated!');

/**
 * OUTPUT:
 *   A: Minimal HTTP app created (router + middleware + controller)
 *   B: Supertest-like helper built (no external deps)
 *   C: GET route integration tests defined
 *   D: GET /:id integration tests defined
 *   E: POST integration tests defined
 *   F: DELETE integration tests defined
 *   G: Supertest patterns documented (see comments)
 *   H: Middleware integration tests defined
 *   I: Database integration tests defined
 *   J: All integration test concepts demonstrated!
 *
 *   (When run with --test, you'll see node:test output for all suites)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SUPERTEST PATTERNS CHEATSHEET                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ request(app).get('/path')           → GET request                        ║
 * ║ request(app).post('/path')          → POST request                       ║
 * ║   .send({ key: 'value' })          → Set request body                   ║
 * ║   .set('Header', 'value')          → Set request header                 ║
 * ║   .expect(200)                     → Assert status code                 ║
 * ║   .expect('Content-Type', /json/)  → Assert header value                ║
 * ║   .expect({ key: 'value' })        → Assert response body              ║
 * ║                                                                          ║
 * ║ KEY: Separate app.js from server.js so tests can import the app         ║
 * ║      without starting a server on a fixed port.                         ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Integration tests verify that multiple components work together - like    │
 * │  HTTP routes through middleware to controllers to the database. I use      │
 * │  supertest to make real HTTP requests against the Express app without      │
 * │  starting a server on a fixed port. Key patterns: separate app.js from    │
 * │  server.js, test full request/response cycles including status codes,     │
 * │  headers, and body content. I test both happy paths (valid requests)      │
 * │  and error paths (401 unauthorized, 404 not found, 400 validation).      │
 * │  Integration tests are slower than unit tests but catch bugs at the       │
 * │  seams where components interact - mismatched data formats, missing       │
 * │  middleware, broken auth flows. They sit in the middle of the test        │
 * │  pyramid: fewer than unit tests, more than E2E tests."                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node --test docs/node/10-testing/01-integration-testing.js
 */
