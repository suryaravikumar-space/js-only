/**
 * TOPIC 02: Caching Strategies in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Caching trades MEMORY for SPEED. Store expensive computation results     ║
 * ║ or frequent data lookups so you don't repeat the work. But every cache   ║
 * ║ needs an EVICTION strategy - unbounded caches become memory leaks.       ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a LIBRARY. Every time a student asks for a book, the librarian  │
 * │  walks to the warehouse (database/API). This takes 5 minutes.            │
 * │                                                                            │
 * │  Smart librarian keeps POPULAR BOOKS on a desk near the front:           │
 * │                                                                            │
 * │    In-memory cache  → Books on the desk (fastest, limited space)         │
 * │    LRU cache        → When desk is full, remove least-read book          │
 * │    TTL cache        → Return book to warehouse after 1 hour              │
 * │    Redis cache      → A second room with MORE shelves (shared)           │
 * │    Memoization      → Librarian remembers answers to common questions    │
 * │                                                                            │
 * │  Without limits, the desk overflows (memory leak). Strategy matters.     │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Cache Layers                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   Request ──▶ ┌─────────────┐  HIT   ┌──────────┐                        │
 * │               │ In-Memory   │────────▶│ Response │                        │
 * │               │ Cache (L1)  │         └──────────┘                        │
 * │               └──────┬──────┘                                             │
 * │                 MISS │                                                    │
 * │                      ▼                                                    │
 * │               ┌─────────────┐  HIT   ┌──────────┐                        │
 * │               │ Redis/      │────────▶│ Response │                        │
 * │               │ External(L2)│         └──────────┘                        │
 * │               └──────┬──────┘                                             │
 * │                 MISS │                                                    │
 * │                      ▼                                                    │
 * │               ┌─────────────┐         ┌──────────┐                        │
 * │               │ Database /  │────────▶│ Response │                        │
 * │               │ API (source)│  (slow) │ + cache  │                        │
 * │               └─────────────┘         └──────────┘                        │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { performance } = require('perf_hooks');

// ─── 1. Simple in-memory cache (Map) ───
console.log('A:', '=== Simple In-Memory Cache ===');

const simpleCache = new Map();

const expensiveQuery = (id) => {
  // Simulate slow database call
  let sum = 0;
  for (let i = 0; i < 1_000_000; i++) sum += i;
  return { id, name: `User-${id}`, computedSum: sum };
};

const cachedQuery = (id) => {
  if (simpleCache.has(id)) {
    return { ...simpleCache.get(id), fromCache: true };
  }
  const result = expensiveQuery(id);
  simpleCache.set(id, result);
  return { ...result, fromCache: false };
};

let t0 = performance.now();
const first = cachedQuery(42);
let t1 = performance.now();
console.log('B:', `First call: ${(t1 - t0).toFixed(4)}ms, fromCache: ${first.fromCache}`);

t0 = performance.now();
const second = cachedQuery(42);
t1 = performance.now();
console.log('C:', `Second call: ${(t1 - t0).toFixed(4)}ms, fromCache: ${second.fromCache}`);

// ─── 2. TTL (Time-To-Live) Cache ───
console.log('D:', '=== TTL Cache ===');

class TTLCache {
  constructor(ttlMs) {
    this.ttl = ttlMs;
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, { value, expires: Date.now() + this.ttl });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return undefined; // expired
    }
    return entry.value;
  }

  size() {
    return this.cache.size;
  }
}

const ttlCache = new TTLCache(100); // 100ms TTL
ttlCache.set('token', 'abc123');
console.log('E:', `Immediately: ${ttlCache.get('token')}`);

// We'll check expiry synchronously by simulating time passage
const blockUntil = (ms) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
};

blockUntil(150);
console.log('F:', `After 150ms: ${ttlCache.get('token')} (expired!)`);

// ─── 3. LRU (Least Recently Used) Cache ───
console.log('G:', '=== LRU Cache ===');

class LRUCache {
  constructor(maxSize) {
    this.max = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.max) {
      // Delete oldest (first inserted)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  keys() {
    return [...this.cache.keys()];
  }
}

const lru = new LRUCache(3);
lru.set('a', 1);
lru.set('b', 2);
lru.set('c', 3);
console.log('H:', `Cache keys: [${lru.keys()}] (capacity: 3)`);

lru.set('d', 4); // evicts 'a' (least recently used)
console.log('I:', `After adding 'd': [${lru.keys()}] ('a' evicted)`);

lru.get('b'); // 'b' is now most recently used
lru.set('e', 5); // evicts 'c' (least recently used now)
console.log('J:', `After get('b') + add 'e': [${lru.keys()}] ('c' evicted, 'b' survived)`);

// ─── 4. Memoization ───
console.log('K:', '=== Memoization ===');

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const fibonacci = (n) => (n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2));
const memoFib = memoize(function fib(n) {
  return n <= 1 ? n : memoFib(n - 1) + memoFib(n - 2);
});

t0 = performance.now();
const fib35 = fibonacci(35);
t1 = performance.now();
console.log('L:', `fibonacci(35) = ${fib35}, took ${(t1 - t0).toFixed(4)}ms`);

t0 = performance.now();
const memoFib35 = memoFib(35);
t1 = performance.now();
console.log('M:', `memoFib(35)   = ${memoFib35}, took ${(t1 - t0).toFixed(4)}ms`);

// Second call is instant
t0 = performance.now();
const memoFib35Again = memoFib(35);
t1 = performance.now();
console.log('N:', `memoFib(35) again = ${memoFib35Again}, took ${(t1 - t0).toFixed(4)}ms (cached)`);

// ─── 5. Memoize with TTL ───
console.log('O:', '=== Memoize with TTL ===');

const memoizeWithTTL = (fn, ttlMs) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    const entry = cache.get(key);
    if (entry && Date.now() < entry.expires) return entry.value;
    const value = fn(...args);
    cache.set(key, { value, expires: Date.now() + ttlMs });
    return value;
  };
};

const getConfig = memoizeWithTTL((env) => {
  return { env, dbUrl: `postgres://${env}-db:5432`, timestamp: Date.now() };
}, 200);

const config1 = getConfig('production');
console.log('P:', `Config timestamp: ${config1.timestamp}`);
const config2 = getConfig('production');
console.log('Q:', `Same timestamp (cached): ${config1.timestamp === config2.timestamp}`);

// ─── 6. Cache-aside pattern (common in production) ───
console.log('R:', '=== Cache-Aside Pattern ===');

const database = {
  users: { 1: 'Alice', 2: 'Bob', 3: 'Charlie' },
  query(id) {
    blockUntil(10); // simulate slow DB
    return this.users[id] || null;
  },
};

const appCache = new Map();

const getUser = (id) => {
  // 1. Check cache
  if (appCache.has(id)) {
    return { user: appCache.get(id), source: 'cache' };
  }
  // 2. Cache miss - query DB
  const user = database.query(id);
  // 3. Populate cache
  if (user) appCache.set(id, user);
  return { user, source: 'database' };
};

console.log('S:', 'First fetch:', JSON.stringify(getUser(1)));
console.log('T:', 'Second fetch:', JSON.stringify(getUser(1)));

// ─── 7. Redis concepts (pseudo-code, no real connection) ───
console.log('U:', '=== Redis Caching Concepts (pseudo-code) ===');

// Simulating Redis-like commands
const redisSimulator = {
  store: new Map(),
  ttls: new Map(),

  SET(key, value, exSeconds) {
    this.store.set(key, JSON.stringify(value));
    if (exSeconds) this.ttls.set(key, Date.now() + exSeconds * 1000);
  },

  GET(key) {
    const ttl = this.ttls.get(key);
    if (ttl && Date.now() > ttl) {
      this.store.delete(key);
      this.ttls.delete(key);
      return null;
    }
    const val = this.store.get(key);
    return val ? JSON.parse(val) : null;
  },
};

redisSimulator.SET('session:user1', { role: 'admin', name: 'Alice' }, 3600);
console.log('V:', 'Redis GET:', JSON.stringify(redisSimulator.GET('session:user1')));
console.log('W:', 'Redis pattern: SET key value EX ttl_seconds');

/**
 * OUTPUT:
 *   A: === Simple In-Memory Cache ===
 *   B: First call: X.XXXXms, fromCache: false
 *   C: Second call: X.XXXXms, fromCache: true
 *   D: === TTL Cache ===
 *   E: Immediately: abc123
 *   F: After 150ms: undefined (expired!)
 *   G: === LRU Cache ===
 *   H: Cache keys: [a,b,c] (capacity: 3)
 *   I: After adding 'd': [b,c,d] ('a' evicted)
 *   J: After get('b') + add 'e': [d,b,e] ('c' evicted, 'b' survived)
 *   K: === Memoization ===
 *   L: fibonacci(35) = 9227465, took XX.XXXXms
 *   M: memoFib(35)   = 9227465, took X.XXXXms
 *   N: memoFib(35) again = 9227465, took X.XXXXms (cached)
 *   O: === Memoize with TTL ===
 *   P: Config timestamp: XXXXXXXXXXXXX
 *   Q: Same timestamp (cached): true
 *   R: === Cache-Aside Pattern ===
 *   S: First fetch: {"user":"Alice","source":"database"}
 *   T: Second fetch: {"user":"Alice","source":"cache"}
 *   U: === Redis Caching Concepts (pseudo-code) ===
 *   V: Redis GET: {"role":"admin","name":"Alice"}
 *   W: Redis pattern: SET key value EX ttl_seconds
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Caching stores expensive results to avoid recomputation. I use several  │
 * │  strategies: (1) Simple Map cache for small datasets, (2) LRU cache to   │
 * │  bound memory by evicting least-used entries, (3) TTL cache for data     │
 * │  that goes stale (like API tokens), (4) Memoization for pure functions   │
 * │  where same inputs always give same outputs. In production, I use the    │
 * │  cache-aside pattern: check cache first, on miss query the source and    │
 * │  populate cache. For distributed systems, Redis provides shared caching  │
 * │  across multiple Node.js instances with built-in TTL via SET EX.         │
 * │  The key rule: every cache needs eviction - unbounded caches are leaks." │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/13-performance/02-caching-strategies.js
 */
