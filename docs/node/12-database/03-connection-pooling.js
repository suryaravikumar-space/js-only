// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                        CONNECTION POOLING                                  ║
// ║            Why Opening a New Connection Every Time is a Disaster           ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  STORY TO REMEMBER: THE HOTEL PHONE OPERATOR                              ║
// ║                                                                            ║
// ║  Imagine a hotel with ONE phone line. Every guest who wants to call out   ║
// ║  must wait for the line to be free. Now imagine installing 10 phone       ║
// ║  lines. Guests pick up any free line, make their call, hang up, and the  ║
// ║  line is ready for the next guest. Nobody installs a new phone line for   ║
// ║  each call and rips it out after - that would be insane!                  ║
// ║                                                                            ║
// ║  That's connection pooling:                                               ║
// ║    Phone line      = Database connection                                  ║
// ║    Hotel switchboard = Connection pool                                    ║
// ║    Guest phone call = Database query                                      ║
// ║    10 lines         = Pool size (max connections)                         ║
// ║                                                                            ║
// ║  WITHOUT pool: Install new line -> call -> rip out line (SLOW!)          ║
// ║  WITH pool:    Pick up free line -> call -> hang up (FAST!)              ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
//  VISUAL: Connection Pool Architecture
// ============================================================================
//
//   Node.js Application
//   ┌─────────────────────────────────────────────────────────┐
//   │  Request 1 ──┐                                         │
//   │  Request 2 ──┤                                         │
//   │  Request 3 ──┤    ┌───────────────────────────┐         │
//   │  Request 4 ──┼───►│    CONNECTION POOL        │         │
//   │  Request 5 ──┤    │                           │         │
//   │  ...         │    │  ┌─────┐ ┌─────┐ ┌─────┐ │         │
//   │  Request N ──┘    │  │Conn1│ │Conn2│ │Conn3│ │ ──────► DB
//   │                   │  │BUSY │ │FREE │ │BUSY │ │         │
//   │                   │  └─────┘ └─────┘ └─────┘ │         │
//   │  WAIT QUEUE:      │  ┌─────┐ ┌─────┐         │         │
//   │  [Req6, Req7]     │  │Conn4│ │Conn5│         │         │
//   │  (waiting for     │  │FREE │ │BUSY │         │         │
//   │   free connection) │  └─────┘ └─────┘         │         │
//   │                   └───────────────────────────┘         │
//   └─────────────────────────────────────────────────────────┘
//
//   Pool manages:
//     - Creating connections (up to max)
//     - Reusing idle connections
//     - Queuing requests when all connections busy
//     - Closing idle connections after timeout
//     - Health checking connections

// ============================================================================
//  A: WHY POOLING MATTERS - THE COST OF A CONNECTION
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  A: Why Pooling Matters - Cost of a Connection`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: What happens when you open a DB connection?
//
//   App                           Database Server
//   ───                           ───────────────
//    │                                 │
//    │──── TCP SYN ────────────────►   │   1. TCP handshake (3 packets)
//    │◄─── TCP SYN-ACK ───────────    │
//    │──── TCP ACK ────────────────►   │
//    │                                 │
//    │──── SSL ClientHello ────────►   │   2. SSL/TLS handshake (if encrypted)
//    │◄─── SSL ServerHello ────────   │      (4-7 more round trips!)
//    │──── SSL Finished ───────────►   │
//    │                                 │
//    │──── Auth Request ───────────►   │   3. Authentication
//    │◄─── Auth OK ────────────────   │      (user/password verification)
//    │                                 │
//    │──── Query ──────────────────►   │   4. NOW you can query!
//    │◄─── Results ────────────────   │
//    │                                 │
//   TOTAL: 20-100ms+ just to CONNECT!

const connectionCost = {
  tcpHandshake:    '~1-5ms (local), 10-50ms (remote)',
  sslHandshake:    '~5-30ms (adds encryption)',
  authentication:  '~2-10ms (verify credentials)',
  totalPerConnect: '~10-100ms EVERY TIME',
  queryTime:       '~1-5ms (simple query)',
  ratio:           'Connection setup can be 10-50x the query time!'
};

console.log('\n  Cost Breakdown per New Connection:');
Object.entries(connectionCost).forEach(([step, cost]) => {
  console.log(`    ${step.padEnd(20)}: ${cost}`);
});

// Simulation: with vs without pooling
console.log('\n  Simulation: 100 queries, query time = 2ms');

const simulateWithoutPool = (queryCount, connectTime, queryTime) => {
  const total = queryCount * (connectTime + queryTime);
  return { totalTime: total, connectOverhead: queryCount * connectTime };
};

const simulateWithPool = (queryCount, connectTime, queryTime, poolSize) => {
  const initialConnect = poolSize * connectTime; // open pool connections once
  const totalQuery = queryCount * queryTime;
  return { totalTime: initialConnect + totalQuery, connectOverhead: initialConnect };
};

const noPool = simulateWithoutPool(100, 30, 2);
const withPool = simulateWithPool(100, 30, 2, 5);

console.log(`\n  WITHOUT Pool (100 queries):
    Each query: 30ms connect + 2ms query = 32ms
    Total: ${noPool.totalTime}ms
    Connect overhead: ${noPool.connectOverhead}ms (${((noPool.connectOverhead / noPool.totalTime) * 100).toFixed(0)}% wasted on connections!)`);

console.log(`\n  WITH Pool (100 queries, pool=5):
    Initial: 5 connections x 30ms = 150ms (one-time)
    Queries: 100 x 2ms = 200ms
    Total: ${withPool.totalTime}ms
    Connect overhead: ${withPool.connectOverhead}ms (${((withPool.connectOverhead / withPool.totalTime) * 100).toFixed(0)}%)`);

console.log(`\n  Speedup: ${(noPool.totalTime / withPool.totalTime).toFixed(1)}x faster with pooling!`);

// ============================================================================
//  B: POOL LIFECYCLE SIMULATION
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  B: Pool Lifecycle Simulation`);
console.log(`${'='.repeat(60)}`);

class ConnectionPool {
  constructor(config) {
    this.maxSize = config.max || 10;
    this.minSize = config.min || 2;
    this.idleTimeoutMs = config.idleTimeoutMillis || 30000;
    this.acquireTimeoutMs = config.acquireTimeoutMillis || 5000;

    this.connections = [];   // All connections
    this.idle = [];          // Available connections
    this.busy = [];          // In-use connections
    this.waitQueue = [];     // Waiting requests
    this._idCounter = 0;
    this._totalQueries = 0;
    this._totalWaits = 0;

    // Create minimum connections
    for (let i = 0; i < this.minSize; i++) {
      this._createConnection();
    }
    console.log(`    [Pool] Initialized with ${this.minSize} connections (max: ${this.maxSize})`);
  }

  _createConnection() {
    if (this.connections.length >= this.maxSize) return null;
    this._idCounter++;
    const conn = {
      id: this._idCounter,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      queryCount: 0
    };
    this.connections.push(conn);
    this.idle.push(conn);
    console.log(`    [Pool] Created connection #${conn.id} (total: ${this.connections.length})`);
    return conn;
  }

  acquire() {
    // Try to get an idle connection
    if (this.idle.length > 0) {
      const conn = this.idle.shift();
      this.busy.push(conn);
      conn.lastUsed = Date.now();
      return { conn, waited: false };
    }

    // Try to create a new connection
    if (this.connections.length < this.maxSize) {
      const conn = this._createConnection();
      this.idle.splice(this.idle.indexOf(conn), 1); // remove from idle
      this.busy.push(conn);
      return { conn, waited: false };
    }

    // All connections busy, must wait
    this._totalWaits++;
    console.log(`    [Pool] All ${this.maxSize} connections busy! Request queued (queue: ${this.waitQueue.length + 1})`);
    return { conn: null, waited: true };
  }

  release(conn) {
    const idx = this.busy.indexOf(conn);
    if (idx !== -1) this.busy.splice(idx, 1);

    // If someone is waiting, give them this connection
    if (this.waitQueue.length > 0) {
      const waiting = this.waitQueue.shift();
      this.busy.push(conn);
      conn.lastUsed = Date.now();
      console.log(`    [Pool] Gave connection #${conn.id} to waiting request`);
      return;
    }

    // Otherwise return to idle
    this.idle.push(conn);
    conn.lastUsed = Date.now();
  }

  query(sql) {
    const { conn, waited } = this.acquire();
    if (!conn) {
      // Simulate queuing
      this.waitQueue.push({ sql, time: Date.now() });
      return;
    }
    conn.queryCount++;
    this._totalQueries++;
    this.release(conn);
  }

  stats() {
    return {
      total: this.connections.length,
      idle: this.idle.length,
      busy: this.busy.length,
      waiting: this.waitQueue.length,
      totalQueries: this._totalQueries,
      totalWaits: this._totalWaits
    };
  }

  drain() {
    console.log(`    [Pool] Draining all ${this.connections.length} connections...`);
    this.connections = [];
    this.idle = [];
    this.busy = [];
    this.waitQueue = [];
    console.log('    [Pool] All connections closed.');
  }
}

// Demo
const pool = new ConnectionPool({ max: 3, min: 1 });

console.log('\n--- Simulating traffic ---');

// Normal traffic
for (let i = 1; i <= 3; i++) {
  console.log(`\n  Request ${i}:`);
  pool.query(`SELECT * FROM users WHERE id = ${i}`);
}

// Burst traffic (exceeds pool)
console.log('\n--- Burst traffic (4 concurrent on pool of 3) ---');
const { conn: c1 } = pool.acquire();
const { conn: c2 } = pool.acquire();
const { conn: c3 } = pool.acquire();
const { conn: c4 } = pool.acquire(); // This one waits!

if (c1) pool.release(c1); // Release frees up for waiter
if (c2) pool.release(c2);
if (c3) pool.release(c3);

console.log('\n  Pool Stats:', pool.stats());
pool.drain();

// ============================================================================
//  C: POOL CONFIGURATION FOR DIFFERENT ENVIRONMENTS
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  C: Pool Configuration by Environment`);
console.log(`${'='.repeat(60)}`);

const configs = {
  development: {
    max: 5,
    min: 1,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 10000,
    note: 'Small pool, generous timeouts for debugging'
  },
  production: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 5000,
    note: 'Larger pool for high traffic'
  },
  serverless: {
    max: 1,
    min: 1,
    idleTimeoutMillis: 10000,
    acquireTimeoutMillis: 3000,
    note: 'Each Lambda gets its own process -> pool of 1!'
  },
  testing: {
    max: 2,
    min: 1,
    idleTimeoutMillis: 5000,
    acquireTimeoutMillis: 3000,
    note: 'Minimal resources, fast cleanup'
  }
};

Object.entries(configs).forEach(([env, config]) => {
  console.log(`\n  ${env.toUpperCase()}:`);
  console.log(`    max: ${config.max}, min: ${config.min}`);
  console.log(`    idleTimeout: ${config.idleTimeoutMillis}ms, acquireTimeout: ${config.acquireTimeoutMillis}ms`);
  console.log(`    Note: ${config.note}`);
});

// ============================================================================
//  D: POOL SIZE CALCULATION (THE FORMULA)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  D: Pool Size Calculation`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: Pool Size Formula
//
//   ┌─────────────────────────────────────────────────────┐
//   │                                                     │
//   │  Pool Size = (Core Count * 2) + Effective Spindle   │
//   │                                                     │
//   │  For SSD (spindle = 1):                             │
//   │    4 cores -> (4 * 2) + 1 = 9 connections           │
//   │    8 cores -> (8 * 2) + 1 = 17 connections          │
//   │                                                     │
//   │  Source: HikariCP (Java pool) benchmark guide       │
//   │  This formula works across languages!               │
//   │                                                     │
//   │  IMPORTANT: More connections != better performance! │
//   │  Too many connections cause:                        │
//   │    - Context switching overhead on DB server        │
//   │    - Memory exhaustion                              │
//   │    - Lock contention                                │
//   └─────────────────────────────────────────────────────┘

const calculatePoolSize = (cores, isSSD = true) => {
  const spindle = isSSD ? 1 : 4; // SSD = 1, HDD = higher
  return (cores * 2) + spindle;
};

console.log('\n  Recommended Pool Sizes (SSD):');
[1, 2, 4, 8, 16].forEach(cores => {
  console.log(`    ${cores} CPU core(s) -> ${calculatePoolSize(cores)} connections`);
});

console.log(`
  WARNING: These are PER APPLICATION INSTANCE!
  If you run 4 Node.js instances with pool=10 each:
    Total DB connections = 4 * 10 = 40
  Most databases default to max 100 connections!

  PostgreSQL: max_connections = 100 (default)
  MySQL:      max_connections = 151 (default)
`);

// ============================================================================
//  E: CONNECTION POOL EVENTS AND MONITORING
// ============================================================================

console.log(`${'='.repeat(60)}`);
console.log(`  E: Pool Events and Monitoring`);
console.log(`${'='.repeat(60)}`);

// Simulated pool with events
class MonitoredPool {
  constructor(config) {
    this.max = config.max || 10;
    this._listeners = {};
    this._metrics = {
      connectCount: 0,
      disconnectCount: 0,
      acquireCount: 0,
      releaseCount: 0,
      waitCount: 0,
      errorCount: 0,
      totalWaitTimeMs: 0
    };
  }

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  }

  _emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
  }

  simulateEvents() {
    // Simulate pool lifecycle events
    this._emit('connect', { message: 'New connection established' });
    this._metrics.connectCount++;

    this._emit('acquire', { message: 'Connection checked out' });
    this._metrics.acquireCount++;

    this._emit('release', { message: 'Connection returned to pool' });
    this._metrics.releaseCount++;

    // Simulate a wait
    this._emit('wait', { message: 'Request waiting for connection', queueLength: 3 });
    this._metrics.waitCount++;
    this._metrics.totalWaitTimeMs += 50;

    // Simulate an error
    this._emit('error', { message: 'Connection lost unexpectedly' });
    this._metrics.errorCount++;

    this._emit('remove', { message: 'Bad connection removed from pool' });
    this._metrics.disconnectCount++;
  }

  getMetrics() {
    return { ...this._metrics };
  }
}

const monitoredPool = new MonitoredPool({ max: 10 });

// Register event listeners (like in production)
monitoredPool.on('connect', (e) => console.log(`    [EVENT] connect: ${e.message}`));
monitoredPool.on('acquire', (e) => console.log(`    [EVENT] acquire: ${e.message}`));
monitoredPool.on('release', (e) => console.log(`    [EVENT] release: ${e.message}`));
monitoredPool.on('wait', (e) => console.log(`    [EVENT] wait: ${e.message} (queue: ${e.queueLength})`));
monitoredPool.on('error', (e) => console.log(`    [EVENT] error: ${e.message}`));
monitoredPool.on('remove', (e) => console.log(`    [EVENT] remove: ${e.message}`));

console.log('\n--- Pool Events ---');
monitoredPool.simulateEvents();

console.log('\n  Pool Metrics:', monitoredPool.getMetrics());

console.log(`
  Real pg Pool Events:
    pool.on('connect', (client) => { ... })  // New connection created
    pool.on('acquire', (client) => { ... })  // Connection checked out
    pool.on('remove',  (client) => { ... })  // Connection removed
    pool.on('error',   (err, client) => { ... }) // Idle client error

  Key Metrics to Monitor:
    - pool.totalCount     : Total connections (idle + busy)
    - pool.idleCount      : Available connections
    - pool.waitingCount   : Requests waiting for a connection
    - If waitingCount > 0 frequently -> increase pool size!
`);

// ============================================================================
//  F: COMMON POOLING MISTAKES
// ============================================================================

console.log(`${'='.repeat(60)}`);
console.log(`  F: Common Pooling Mistakes`);
console.log(`${'='.repeat(60)}`);

const mistakes = [
  {
    mistake: 'Creating a new pool per request',
    bad:     'app.get("/users", () => { const pool = new Pool(); ... })',
    good:    'Create pool ONCE at app startup, share across all routes',
    why:     'Each pool opens min connections. 100 requests = 100 pools = 500+ connections!'
  },
  {
    mistake: 'Not releasing checked-out clients',
    bad:     'const client = await pool.connect(); await client.query(...); // forgot release!',
    good:    'Always client.release() in a finally block',
    why:     'Leaked connections exhaust the pool -> all requests hang'
  },
  {
    mistake: 'Pool too large',
    bad:     'new Pool({ max: 100 }) on a 4-core server',
    good:    'Use formula: (cores * 2) + 1. For 4 cores = 9',
    why:     'Too many connections cause DB context switching, slower than fewer connections!'
  },
  {
    mistake: 'Not handling pool errors',
    bad:     '// No error handler on pool',
    good:    'pool.on("error", (err) => { log(err); process.exit(-1); })',
    why:     'Unhandled pool errors crash the process or silently leak connections'
  },
  {
    mistake: 'Using Client instead of Pool for web servers',
    bad:     'const client = new Client(); // single connection for Express app',
    good:    'const pool = new Pool(); // multiple reusable connections',
    why:     'Client = 1 connection = 1 query at a time. Pool = concurrent queries!'
  },
  {
    mistake: 'Not draining pool on shutdown',
    bad:     'process.exit() without closing pool',
    good:    'process.on("SIGTERM", () => pool.end().then(() => process.exit(0)))',
    why:     'Leaked connections stay open on DB server until timeout'
  }
];

mistakes.forEach(({ mistake, bad, good, why }, i) => {
  console.log(`\n  ${i + 1}. ${mistake}`);
  console.log(`     BAD:  ${bad}`);
  console.log(`     GOOD: ${good}`);
  console.log(`     WHY:  ${why}`);
});

// ============================================================================
//  G: POOL EXHAUSTION DEMO
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  G: Pool Exhaustion Demo`);
console.log(`${'='.repeat(60)}`);

class ExhaustionDemo {
  constructor(poolSize) {
    this.poolSize = poolSize;
    this.available = poolSize;
    this.waiting = 0;
    this.timeline = [];
  }

  request(name, holdTimeMs) {
    if (this.available > 0) {
      this.available--;
      this.timeline.push(`  ${name}: Got connection (${this.available}/${this.poolSize} available)`);
      // Simulate releasing after hold time
      setTimeout(() => {
        this.available++;
        this.waiting = Math.max(0, this.waiting - 1);
      }, holdTimeMs);
    } else {
      this.waiting++;
      this.timeline.push(`  ${name}: WAITING! (0/${this.poolSize} available, ${this.waiting} in queue)`);
    }
  }

  print() {
    this.timeline.forEach(line => console.log(line));
  }
}

const demo = new ExhaustionDemo(3);

console.log('\n  Pool size: 3, simulating 6 rapid requests:\n');
demo.request('Request 1', 100);
demo.request('Request 2', 100);
demo.request('Request 3', 100);
demo.request('Request 4', 100); // Will wait
demo.request('Request 5', 100); // Will wait
demo.request('Request 6', 100); // Will wait
demo.print();

console.log(`
  If wait exceeds acquireTimeoutMillis:
    -> Error: "Timeout acquiring connection from pool"
    -> HTTP 503 Service Unavailable

  Solutions:
    1. Increase pool size (if DB can handle it)
    2. Optimize slow queries (reduce hold time)
    3. Add connection timeout to queries
    4. Use read replicas for read-heavy traffic
    5. Add caching layer (Redis) to reduce DB hits
`);

// ============================================================================
//  H: REAL-WORLD POOL SETUP
// ============================================================================

console.log(`${'='.repeat(60)}`);
console.log(`  H: Real-World Pool Setup`);
console.log(`${'='.repeat(60)}`);

const realWorldSetup = `
  // db.js - Production-ready pool setup
  const { Pool } = require('pg');

  const pool = new Pool({
    // Connection
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'myapp',
    user:     process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD,

    // Pool sizing
    max: parseInt(process.env.DB_POOL_MAX) || 20,
    min: parseInt(process.env.DB_POOL_MIN) || 5,

    // Timeouts
    idleTimeoutMillis:       30000,  // Close idle conns after 30s
    connectionTimeoutMillis: 5000,   // Fail if can't connect in 5s

    // SSL (for production)
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,

    // Statement timeout (kill slow queries)
    statement_timeout: 30000  // 30s max query time
  });

  // Critical: Handle idle client errors
  pool.on('error', (err, client) => {
    console.error('Unexpected idle client error:', err.message);
    // In production: send to error tracking (Sentry, etc.)
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Draining database pool...');
    await pool.end();
    console.log('Pool drained. Exiting.');
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Health check helper
  const healthCheck = async () => {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return { healthy: true, pool: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }};
    } catch (err) {
      return { healthy: false, error: err.message };
    } finally {
      client.release();
    }
  };

  module.exports = { pool, healthCheck };
`;

console.log(realWorldSetup);

// ============================================================================
//  I: POOLING ACROSS DIFFERENT DATABASES
// ============================================================================

console.log(`${'='.repeat(60)}`);
console.log(`  I: Pooling Across Different Databases`);
console.log(`${'='.repeat(60)}`);

const dbPooling = [
  ['Database',    'Node.js Module',    'Default Pool', 'Config Key'],
  ['PostgreSQL',  'pg (Pool)',         '10',           'max'],
  ['MySQL',       'mysql2 (createPool)', '10',         'connectionLimit'],
  ['MongoDB',     'mongodb (MongoClient)', '5 per host', 'maxPoolSize'],
  ['SQLite',      'better-sqlite3',    'N/A (file)',   'No pooling needed'],
  ['Redis',       'ioredis',           '10',           'maxRetriesPerRequest'],
  ['Prisma',      '@prisma/client',    '(cores*2)+1',  'connection_limit in URL'],
  ['Sequelize',   'sequelize',         '5',            'pool.max in options'],
];

dbPooling.forEach(([db, module_, pool, key], i) => {
  if (i === 0) {
    console.log(`  ${db.padEnd(14)} | ${module_.padEnd(24)} | ${pool.padEnd(14)} | ${key}`);
    console.log(`  ${'─'.repeat(14)} | ${'─'.repeat(24)} | ${'─'.repeat(14)} | ${'─'.repeat(24)}`);
  } else {
    console.log(`  ${db.padEnd(14)} | ${module_.padEnd(24)} | ${pool.padEnd(14)} | ${key}`);
  }
});

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  INTERVIEW ANSWER                                                          ║
// ║                                                                            ║
// ║  "Connection pooling maintains a set of reusable database connections     ║
// ║  instead of opening a new one for every query. This matters because       ║
// ║  establishing a connection involves TCP handshake, SSL negotiation, and   ║
// ║  authentication - often 10-100ms overhead vs 1-5ms for the actual query. ║
// ║                                                                            ║
// ║  A pool pre-opens connections and hands them out to requests. When a      ║
// ║  request finishes, the connection returns to the pool for reuse.          ║
// ║  If all connections are busy, new requests wait in a queue.              ║
// ║                                                                            ║
// ║  Key configuration: pool size = (CPU cores * 2) + 1. More connections    ║
// ║  is NOT always better - too many cause context switching overhead on      ║
// ║  the database server. Common mistakes: creating a pool per request,      ║
// ║  not releasing checked-out clients (connection leak), and setting pool   ║
// ║  size too high. In serverless (Lambda), use pool size of 1 since each   ║
// ║  invocation may be a separate process."                                   ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
//  OUTPUT:
// ============================================================================
//
//   A: Cost of opening a connection (10-100ms per connect vs 1-5ms query)
//      Simulation: pooling is 9x+ faster for 100 queries
//   B: Pool lifecycle with acquire/release/wait queue simulation
//   C: Pool config for development, production, serverless, testing
//   D: Pool size formula: (cores * 2) + 1 with examples
//   E: Pool events and monitoring metrics
//   F: 6 Common pooling mistakes with fixes
//   G: Pool exhaustion demo showing queue buildup
//   H: Production-ready pool setup with graceful shutdown
//   I: Pooling across PostgreSQL, MySQL, MongoDB, Redis, ORMs
// ============================================================================

// RUN: node docs/node/12-database/03-connection-pooling.js
