// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                      CONNECTING TO POSTGRESQL                              ║
// ║             Relational Database - The Structured Powerhouse                ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  STORY TO REMEMBER: THE SPREADSHEET WITH STRICT RULES                     ║
// ║                                                                            ║
// ║  Imagine a massive Excel workbook where every SHEET is a "table" and      ║
// ║  every ROW must follow the exact same COLUMNS. You can't add a column     ║
// ║  to just one row - if you want a new field, every row gets it.            ║
// ║  Sheets can REFERENCE each other: the "orders" sheet has a column         ║
// ║  pointing to the "users" sheet. That link is a "foreign key."             ║
// ║                                                                            ║
// ║  MongoDB = Filing cabinet (flexible, each folder can differ)              ║
// ║  PostgreSQL = Spreadsheet (strict columns, every row same shape)          ║
// ║                                                                            ║
// ║  The pg module is the taxi that drives your Node.js app to the            ║
// ║  PostgreSQL spreadsheet building and back.                                ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
//  VISUAL: PostgreSQL Architecture with Node.js
// ============================================================================
//
//   Node.js App (your code)
//   ┌────────────────────────────────────────────────┐
//   │                                                │
//   │  const { Pool, Client } = require('pg');       │
//   │                                                │
//   │  ┌──────────┐      ┌──────────────────┐        │
//   │  │ Client   │      │ Pool             │        │
//   │  │ (single  │      │ (many reusable   │        │
//   │  │  conn)   │      │  connections)    │        │
//   │  └────┬─────┘      └────────┬─────────┘        │
//   └───────┼─────────────────────┼──────────────────┘
//           │                     │
//           ▼                     ▼
//   ┌──────────────────────────────────────────────┐
//   │         PostgreSQL Server (port 5432)         │
//   │  ┌────────────┐  ┌────────────┐               │
//   │  │ TABLE:     │  │ TABLE:     │               │
//   │  │ users      │  │ orders     │               │
//   │  │ ┌────┬───┐ │  │ ┌────┬───┐ │               │
//   │  │ │ id │name│ │  │ │ id │amt│ │               │
//   │  │ ├────┼───┤ │  │ ├────┼───┤ │               │
//   │  │ │ 1  │Ali│ │  │ │ 1  │500│ │               │
//   │  │ │ 2  │Bob│ │  │ │ 2  │300│ │               │
//   │  │ └────┴───┘ │  │ └────┴───┘ │               │
//   │  └────────────┘  └────────────┘               │
//   └──────────────────────────────────────────────┘
//
//  KEY TERMS:
//    Database    -> Database
//    Collection  -> Table
//    Document    -> Row
//    Field       -> Column
//    _id         -> Primary Key (serial/uuid)
//    $lookup     -> JOIN

// ============================================================================
//  A: CONNECTION STRING ANATOMY
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  A: Connection String Anatomy`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: PostgreSQL Connection String
//
//   postgresql://username:password@host:port/database?sslmode=require
//   ├──────────┤├──────┤ ├──────┤ ├──┤ ├──┤ ├──────┤├─────────────┤
//   │Protocol  ││ User │ │ Pass │ │Host│Port│ │  DB  ││   Options   │

const connectionExamples = {
  local:      'postgresql://localhost:5432/mydb',
  withAuth:   'postgresql://admin:secret@localhost:5432/mydb',
  remote:     'postgresql://user:pass@db.example.com:5432/production?sslmode=require',
  heroku:     'postgresql://user:pass@ec2-xx.compute.amazonaws.com:5432/dbname?sslmode=require',
  configObj:  '{ host, port, database, user, password } object form'
};

Object.entries(connectionExamples).forEach(([name, uri]) => {
  console.log(`  ${name.padEnd(12)}: ${uri}`);
});

// ============================================================================
//  B: CLIENT vs POOL - TWO WAYS TO CONNECT
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  B: Client vs Pool`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: Client vs Pool
//
//   CLIENT (Single Connection)         POOL (Multiple Connections)
//   ┌──────────────────────┐           ┌──────────────────────┐
//   │ Request 1 ─── Conn ──┼── DB      │ Request 1 ─┐         │
//   │ Request 2 ── WAIT!   │           │ Request 2 ─┼─ Pool ──┼── DB
//   │ Request 3 ── WAIT!   │           │ Request 3 ─┘  (10)   │
//   │ One at a time!       │           │ Concurrent! Fast!     │
//   └──────────────────────┘           └──────────────────────┘
//
//   Client: for scripts, migrations, one-off tasks
//   Pool:   for web servers (Express, Fastify, etc.)

// Simulating the pg module Client
class SimulatedClient {
  constructor(config) {
    this.config = config;
    this.connected = false;
    this._queryCount = 0;
  }

  async connect() {
    // In real pg: opens TCP connection to PostgreSQL
    this.connected = true;
    console.log(`    [Client] Connected to ${this.config.database || 'mydb'}`);
  }

  async query(text, params = []) {
    if (!this.connected) throw new Error('Client not connected! Call .connect() first.');
    this._queryCount++;
    console.log(`    [Client] Query #${this._queryCount}: ${text}`);
    if (params.length) console.log(`    [Client] Params: [${params.join(', ')}]`);
    // Return simulated result
    return { rows: [], rowCount: 0, command: text.split(' ')[0].toUpperCase() };
  }

  async end() {
    this.connected = false;
    console.log(`    [Client] Connection closed (${this._queryCount} queries executed)`);
  }
}

// Client usage pattern
console.log('\n--- Client Pattern (single connection) ---');
const clientDemo = async () => {
  const client = new SimulatedClient({
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    user: 'admin',
    password: 'secret'
  });

  try {
    await client.connect();
    await client.query('SELECT * FROM users WHERE id = $1', [1]);
    await client.query('INSERT INTO logs (message) VALUES ($1)', ['user_login']);
  } catch (err) {
    console.error('Database error:', err.message);
  } finally {
    await client.end(); // ALWAYS close in finally!
  }
};

clientDemo();

// ============================================================================
//  C: POOL PATTERN (PRODUCTION USE)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  C: Pool Pattern (Production)`);
console.log(`${'='.repeat(60)}`);

// Simulating the pg Pool
class SimulatedPool {
  constructor(config) {
    this.config = config;
    this.totalConnections = 0;
    this.activeConnections = 0;
    this.maxConnections = config.max || 10;
    this.idleTimeout = config.idleTimeoutMillis || 30000;
    this._queryCount = 0;
  }

  async query(text, params = []) {
    // Pool.query() = checkout connection -> run query -> return connection
    this._queryCount++;
    this.activeConnections = Math.min(this.activeConnections + 1, this.maxConnections);
    console.log(`    [Pool] Query #${this._queryCount}: ${text}`);
    if (params.length) console.log(`    [Pool] Params: [${params.join(', ')}]`);
    this.activeConnections--;
    return { rows: [], rowCount: 0 };
  }

  async connect() {
    // Returns a dedicated client from the pool
    this.totalConnections++;
    this.activeConnections++;
    const poolRef = this;
    console.log(`    [Pool] Checked out client #${this.totalConnections} (active: ${this.activeConnections}/${this.maxConnections})`);
    return {
      query: async (text, params = []) => {
        poolRef._queryCount++;
        console.log(`    [Pool Client] Query: ${text}`);
        return { rows: [], rowCount: 0 };
      },
      release: () => {
        poolRef.activeConnections--;
        console.log(`    [Pool] Client released (active: ${poolRef.activeConnections}/${poolRef.maxConnections})`);
      }
    };
  }

  async end() {
    console.log(`    [Pool] All connections closed (${this._queryCount} total queries)`);
  }
}

const poolDemo = async () => {
  const pool = new SimulatedPool({
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    user: 'admin',
    password: 'secret',
    max: 20,                  // Max pool size
    idleTimeoutMillis: 30000, // Close idle clients after 30s
    connectionTimeoutMillis: 2000 // Timeout if can't connect in 2s
  });

  // Pattern 1: Simple query (auto checkout/return)
  console.log('\n--- Pattern 1: pool.query() (simple, auto-managed) ---');
  await pool.query('SELECT NOW()');
  await pool.query('SELECT * FROM users WHERE email = $1', ['alice@test.com']);

  // Pattern 2: Checkout client for transactions
  console.log('\n--- Pattern 2: pool.connect() (for transactions) ---');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - 100 WHERE id = $1', [1]);
    await client.query('UPDATE accounts SET balance = balance + 100 WHERE id = $1', [2]);
    await client.query('COMMIT');
    console.log('    Transaction committed!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('    Transaction rolled back!');
  } finally {
    client.release(); // CRITICAL: always release back to pool!
  }

  await pool.end();
};

poolDemo();

// ============================================================================
//  D: PARAMETERIZED QUERIES (SQL INJECTION PREVENTION)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  D: Parameterized Queries (SQL Injection Prevention)`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: SQL Injection
//
//   BAD (string concatenation):
//   ┌─────────────────────────────────────────────────────┐
//   │ "SELECT * FROM users WHERE name = '" + userInput + "'"  │
//   │                                                     │
//   │ If userInput = "'; DROP TABLE users; --"            │
//   │ Result: SELECT * FROM users WHERE name = '';        │
//   │         DROP TABLE users; --'                       │
//   │         ^^^ YOUR TABLE IS GONE! ^^^                 │
//   └─────────────────────────────────────────────────────┘
//
//   GOOD (parameterized):
//   ┌─────────────────────────────────────────────────────┐
//   │ "SELECT * FROM users WHERE name = $1", [userInput]  │
//   │                                                     │
//   │ PostgreSQL treats $1 as a VALUE, never as SQL code  │
//   │ The malicious string is just stored as a string!    │
//   └─────────────────────────────────────────────────────┘

const userInput = "'; DROP TABLE users; --";

// BAD: string concatenation (NEVER DO THIS)
const badQuery = `SELECT * FROM users WHERE name = '${userInput}'`;
console.log('BAD (injectable):', badQuery);

// GOOD: parameterized query
const goodQuery = { text: 'SELECT * FROM users WHERE name = $1', values: [userInput] };
console.log('GOOD (safe):     ', goodQuery.text);
console.log('  Params:        ', goodQuery.values);
console.log('  PostgreSQL sees $1 as a value, not SQL code!');

// pg uses $1, $2, $3... for parameters (NOT ? like MySQL)
console.log(`
  PostgreSQL parameter syntax:
    $1, $2, $3, ... (numbered placeholders)

  MySQL parameter syntax:
    ?, ?, ? (positional placeholders)

  Example:
    pool.query(
      'INSERT INTO users (name, email, age) VALUES ($1, $2, $3)',
      ['Alice', 'alice@test.com', 30]
    );
`);

// ============================================================================
//  E: COMMON QUERY PATTERNS
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  E: Common Query Patterns`);
console.log(`${'='.repeat(60)}`);

const queryPatterns = [
  {
    name: 'SELECT (read)',
    sql: "SELECT id, name, email FROM users WHERE age > $1 ORDER BY name LIMIT $2",
    params: [25, 10],
    note: 'Always specify columns, avoid SELECT *'
  },
  {
    name: 'INSERT (create)',
    sql: "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name",
    params: ['Alice', 'alice@test.com'],
    note: 'RETURNING gives back inserted row (PostgreSQL-specific!)'
  },
  {
    name: 'UPDATE',
    sql: "UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    params: ['Alice Smith', 1],
    note: 'Always use WHERE clause! RETURNING * gives updated row'
  },
  {
    name: 'DELETE',
    sql: "DELETE FROM users WHERE id = $1 RETURNING *",
    params: [1],
    note: 'RETURNING shows what was deleted'
  },
  {
    name: 'UPSERT',
    sql: "INSERT INTO users (email, name) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET name = $2",
    params: ['alice@test.com', 'Alice'],
    note: 'Insert or update if exists (PostgreSQL 9.5+)'
  },
  {
    name: 'JOIN',
    sql: "SELECT u.name, o.amount FROM users u JOIN orders o ON u.id = o.user_id WHERE u.id = $1",
    params: [1],
    note: 'JOIN replaces MongoDB $lookup'
  }
];

queryPatterns.forEach(({ name, sql, params, note }) => {
  console.log(`\n  ${name}:`);
  console.log(`    SQL:    ${sql}`);
  console.log(`    Params: [${params.join(', ')}]`);
  console.log(`    Note:   ${note}`);
});

// ============================================================================
//  F: TRANSACTIONS (ACID GUARANTEE)
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  F: Transactions (ACID Guarantee)`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: Transaction Flow
//
//   BEGIN ──► UPDATE account A (-$100) ──► UPDATE account B (+$100) ──► COMMIT
//     │                                                                    │
//     │  If ANY step fails:                                                │
//     └──────────────────────── ROLLBACK ◄─────────────────────────────────┘
//         (undo everything, database unchanged)
//
//  ACID:
//    A - Atomicity:   All or nothing
//    C - Consistency: Data stays valid
//    I - Isolation:   Concurrent transactions don't interfere
//    D - Durability:  Committed data survives crashes

const simulateTransaction = async () => {
  const accounts = [
    { id: 1, name: 'Alice', balance: 1000 },
    { id: 2, name: 'Bob', balance: 500 }
  ];

  console.log('\n  Before transfer:', accounts.map(a => `${a.name}: $${a.balance}`).join(', '));

  // Simulate: Transfer $200 from Alice to Bob
  const transferAmount = 200;

  try {
    // BEGIN
    console.log('  BEGIN TRANSACTION');

    // Check balance
    if (accounts[0].balance < transferAmount) {
      throw new Error('Insufficient funds!');
    }

    // Debit Alice
    accounts[0].balance -= transferAmount;
    console.log(`  UPDATE accounts SET balance = ${accounts[0].balance} WHERE id = 1`);

    // Credit Bob
    accounts[1].balance += transferAmount;
    console.log(`  UPDATE accounts SET balance = ${accounts[1].balance} WHERE id = 2`);

    // COMMIT
    console.log('  COMMIT');
    console.log('  After transfer:', accounts.map(a => `${a.name}: $${a.balance}`).join(', '));
  } catch (err) {
    console.log('  ROLLBACK -', err.message);
    // In real code: await client.query('ROLLBACK');
  }
};

simulateTransaction();

// ============================================================================
//  G: ERROR HANDLING PATTERNS
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  G: Error Handling Patterns`);
console.log(`${'='.repeat(60)}`);

// Common PostgreSQL error codes
const pgErrorCodes = {
  '23505': { name: 'unique_violation', meaning: 'Duplicate key (e.g., email already exists)' },
  '23503': { name: 'foreign_key_violation', meaning: 'Referenced row does not exist' },
  '23502': { name: 'not_null_violation', meaning: 'Required column is NULL' },
  '42P01': { name: 'undefined_table', meaning: 'Table does not exist' },
  '42703': { name: 'undefined_column', meaning: 'Column does not exist' },
  '08006': { name: 'connection_failure', meaning: 'Cannot connect to database' },
  '40P01': { name: 'deadlock_detected', meaning: 'Two transactions waiting for each other' }
};

console.log('\n  Common PostgreSQL Error Codes:');
Object.entries(pgErrorCodes).forEach(([code, { name, meaning }]) => {
  console.log(`    ${code} | ${name.padEnd(22)} | ${meaning}`);
});

// Error handling example
const handlePgError = (err) => {
  switch (err.code) {
    case '23505':
      return { status: 409, message: 'Resource already exists' };
    case '23503':
      return { status: 400, message: 'Referenced resource not found' };
    case '23502':
      return { status: 400, message: `Missing required field: ${err.column}` };
    case '08006':
      return { status: 503, message: 'Database unavailable' };
    default:
      return { status: 500, message: 'Internal database error' };
  }
};

// Simulate error handling
const testErrors = [
  { code: '23505', detail: 'Key (email)=(alice@test.com) already exists' },
  { code: '23503', detail: 'Key (user_id)=(999) is not present in table "users"' },
  { code: '08006', detail: 'Connection refused' }
];

console.log('\n  Error Handling Results:');
testErrors.forEach(err => {
  const result = handlePgError(err);
  console.log(`    Code ${err.code} -> HTTP ${result.status}: ${result.message}`);
});

// ============================================================================
//  H: MIGRATIONS CONCEPT
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  H: Migrations Concept`);
console.log(`${'='.repeat(60)}`);

//  VISUAL: Migration Timeline
//
//   Migration 001          Migration 002          Migration 003
//   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
//   │ CREATE TABLE │  -->  │ ALTER TABLE  │  -->  │ ADD INDEX    │
//   │ users (      │       │ users ADD    │       │ ON users     │
//   │   id, name,  │       │ COLUMN       │       │ (email)      │
//   │   email      │       │ age INTEGER  │       │              │
//   │ )            │       │              │       │              │
//   └──────────────┘       └──────────────┘       └──────────────┘
//   UP: creates table      UP: adds column        UP: adds index
//   DOWN: drops table      DOWN: drops column     DOWN: drops index

const migrations = [
  {
    version: '001',
    name: 'create_users_table',
    up: `CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );`,
    down: 'DROP TABLE IF EXISTS users;'
  },
  {
    version: '002',
    name: 'add_age_to_users',
    up: 'ALTER TABLE users ADD COLUMN age INTEGER CHECK (age >= 0 AND age <= 150);',
    down: 'ALTER TABLE users DROP COLUMN age;'
  },
  {
    version: '003',
    name: 'create_orders_table',
    up: `CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );`,
    down: 'DROP TABLE IF EXISTS orders;'
  }
];

console.log('  Migration History:');
migrations.forEach(({ version, name, up }) => {
  const firstLine = up.trim().split('\n')[0];
  console.log(`    ${version}_${name}: ${firstLine}`);
});

console.log(`
  Migration Tools for Node.js:
    - node-pg-migrate   : Lightweight, SQL-based
    - knex.js           : Query builder with migrations
    - Sequelize CLI     : ORM-based migrations
    - Prisma Migrate    : Schema-first migrations
    - db-migrate        : Framework-agnostic
`);

// ============================================================================
//  I: REAL-WORLD EXPRESS + PG PATTERN
// ============================================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`  I: Real-World Express + pg Pattern`);
console.log(`${'='.repeat(60)}`);

const expressPatternCode = `
  // db.js - Database module (create once, export pool)
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false
  });

  // Listen for errors on idle clients
  pool.on('error', (err) => {
    console.error('Unexpected idle client error', err);
    process.exit(-1);
  });

  module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
    pool
  };

  // routes/users.js
  const db = require('../db');

  app.get('/users/:id', async (req, res) => {
    try {
      const { rows } = await db.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    } catch (err) {
      console.error('DB error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
`;

console.log(expressPatternCode);

// ============================================================================
//  J: POSTGRESQL vs MONGODB COMPARISON
// ============================================================================

console.log(`${'='.repeat(60)}`);
console.log(`  J: PostgreSQL vs MongoDB Comparison`);
console.log(`${'='.repeat(60)}`);

const comparison = [
  ['Feature',        'PostgreSQL',              'MongoDB'],
  ['Data Model',     'Tables with rows/columns','Collections with documents'],
  ['Schema',         'Strict (enforced)',       'Flexible (optional)'],
  ['Query Language', 'SQL',                     'MQL (MongoDB Query Language)'],
  ['Joins',          'Native JOIN',             '$lookup (aggregation)'],
  ['Transactions',   'Full ACID',               'ACID (since v4.0)'],
  ['Scaling',        'Vertical (+ read replicas)','Horizontal (sharding)'],
  ['Best For',       'Complex queries, relations','Flexible data, rapid dev'],
  ['Node.js Driver', 'pg',                      'mongodb'],
  ['Popular ORMs',   'Sequelize, Prisma, Knex', 'Mongoose, Prisma'],
];

comparison.forEach(([feature, pg, mongo], i) => {
  if (i === 0) {
    console.log(`  ${feature.padEnd(16)} | ${pg.padEnd(26)} | ${mongo}`);
    console.log(`  ${'─'.repeat(16)} | ${'─'.repeat(26)} | ${'─'.repeat(30)}`);
  } else {
    console.log(`  ${feature.padEnd(16)} | ${pg.padEnd(26)} | ${mongo}`);
  }
});

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  INTERVIEW ANSWER                                                          ║
// ║                                                                            ║
// ║  "PostgreSQL is a relational database accessed in Node.js via the 'pg'    ║
// ║  module. There are two main connection patterns:                           ║
// ║                                                                            ║
// ║  - Client: single connection for scripts and one-off tasks                ║
// ║  - Pool: multiple reusable connections for web servers (always use this)  ║
// ║                                                                            ║
// ║  Critical security rule: ALWAYS use parameterized queries ($1, $2...)     ║
// ║  to prevent SQL injection - never concatenate user input into SQL.        ║
// ║                                                                            ║
// ║  For transactions, checkout a client from the pool with pool.connect(),   ║
// ║  run BEGIN/COMMIT/ROLLBACK, and ALWAYS release the client in a finally    ║
// ║  block. PostgreSQL provides full ACID guarantees.                          ║
// ║                                                                            ║
// ║  The RETURNING clause is PostgreSQL-specific and lets you get back        ║
// ║  inserted/updated rows without a separate SELECT. Error handling should   ║
// ║  check error codes (23505 for duplicates, 23503 for FK violations) to    ║
// ║  return meaningful HTTP responses."                                        ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ============================================================================
//  OUTPUT:
// ============================================================================
//
//   A: Connection string anatomy with protocol/host/port/db/options
//   B: Client vs Pool comparison with simulated single connection
//   C: Pool pattern with auto-query and transaction checkout
//   D: Parameterized queries vs SQL injection vulnerability
//   E: Common query patterns (SELECT, INSERT, UPDATE, DELETE, UPSERT, JOIN)
//   F: Transaction simulation with ACID explanation
//   G: PostgreSQL error codes and error handling patterns
//   H: Migration concept with version timeline
//   I: Real-world Express + pg module pattern
//   J: PostgreSQL vs MongoDB comparison table
// ============================================================================

// RUN: node docs/node/12-database/01-connecting-postgres.js
