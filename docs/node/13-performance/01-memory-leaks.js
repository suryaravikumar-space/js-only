/**
 * TOPIC 01: Memory Leaks in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ A memory leak is when your program holds references to objects it no     ║
 * ║ longer needs, preventing garbage collection. In Node.js, common causes   ║
 * ║ are: global variables, closures, event listeners, and forgotten timers.  ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a HOTEL with limited rooms (heap memory). Guests check in        │
 * │  (objects created) and check out (garbage collected). A memory leak is    │
 * │  like a ghost guest - they checked out but the front desk NEVER removed  │
 * │  their key card from the system. The room stays "occupied" forever.      │
 * │                                                                            │
 * │    Global variable  → Guest who NEVER checks out                         │
 * │    Closure leak     → Room linked to guest who left, but the maid        │
 * │                       still has their room key in her pocket             │
 * │    Event listener   → A phone line kept open even after the call ended   │
 * │    Forgotten timer  → Wake-up call set for a guest who already left      │
 * │                                                                            │
 * │  The hotel fills up, new guests are rejected → OUT OF MEMORY crash.      │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Memory Leak Lifecycle                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   Healthy App:                                                            │
 * │   Memory ▲                                                                │
 * │          │    /\    /\    /\    (GC reclaims, stays flat)                 │
 * │          │   /  \  /  \  /  \                                             │
 * │          │──/────\/────\/────\──▶ Time                                    │
 * │                                                                            │
 * │   Leaking App:                                                            │
 * │   Memory ▲                                                                │
 * │          │              /───── (GC can't reclaim, keeps growing)          │
 * │          │           /──                                                  │
 * │          │        /──       💥 OOM CRASH                                  │
 * │          │     /──                                                        │
 * │          │──/──────────────────▶ Time                                     │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── 1. LEAK: Global variable accumulation ───
console.log('A:', '=== LEAK PATTERN: Global variables ===');

const globalCache = []; // This never gets cleaned!

const leakyAddToCache = (data) => {
  globalCache.push(data); // keeps growing forever
};

for (let i = 0; i < 1000; i++) {
  leakyAddToCache({ id: i, payload: 'x'.repeat(100) });
}
console.log('B:', `Global cache size: ${globalCache.length} items (never freed!)`);

// FIX: Use bounded cache
const boundedCache = [];
const MAX_CACHE = 100;

const safeAddToCache = (data) => {
  if (boundedCache.length >= MAX_CACHE) {
    boundedCache.shift(); // remove oldest
  }
  boundedCache.push(data);
};

for (let i = 0; i < 1000; i++) {
  safeAddToCache({ id: i, payload: 'x'.repeat(100) });
}
console.log('C:', `Bounded cache size: ${boundedCache.length} items (capped at ${MAX_CACHE})`);

// ─── 2. LEAK: Closure holding references ───
console.log('D:', '=== LEAK PATTERN: Closures ===');

const createLeakyClosure = () => {
  const hugeData = new Array(10000).fill('leak'); // captured by closure
  return () => {
    // Only uses hugeData.length but holds reference to ENTIRE array
    return hugeData.length;
  };
};

const closures = [];
for (let i = 0; i < 100; i++) {
  closures.push(createLeakyClosure()); // 100 closures, each holds hugeData
}
console.log('E:', `Closures created: ${closures.length} (each holds 10k-element array reference)`);

// FIX: Extract only what you need
const createSafeClosure = () => {
  const hugeData = new Array(10000).fill('leak');
  const length = hugeData.length; // extract needed value
  // hugeData can now be GC'd
  return () => length;
};

console.log('F:', `Safe closure returns: ${createSafeClosure()()}`);

// ─── 3. LEAK: Event listeners not removed ───
console.log('G:', '=== LEAK PATTERN: Event listeners ===');

const EventEmitter = require('events');
const emitter = new EventEmitter();

// BAD: Adding listeners in a loop without removing
const leakySetup = () => {
  for (let i = 0; i < 5; i++) {
    emitter.on('data', () => {}); // listeners pile up!
  }
};

leakySetup();
console.log('H:', `Listener count after leaky setup: ${emitter.listenerCount('data')}`);

// FIX: Remove listeners when done
const safeSetup = () => {
  const handler = (data) => data;
  emitter.on('data', handler);
  // Later, when no longer needed:
  emitter.removeListener('data', handler);
};

safeSetup();
console.log('I:', `Listener count after safe setup: ${emitter.listenerCount('data')} (handler removed)`);

// FIX: Use once() for one-time listeners
emitter.once('oneshot', () => {});
emitter.emit('oneshot');
console.log('J:', `once() listener count after emit: ${emitter.listenerCount('oneshot')} (auto-removed)`);

// ─── 4. LEAK: Forgotten timers ───
console.log('K:', '=== LEAK PATTERN: Forgotten timers ===');

// BAD: setInterval never cleared
let leakyData = { large: new Array(10000).fill('timer-leak') };
const leakyInterval = setInterval(() => {
  // holds reference to leakyData forever
  void leakyData;
}, 1000);

// FIX: Always clear timers
clearInterval(leakyInterval); // clean up immediately
leakyData = null; // allow GC
console.log('L:', 'Timer cleared + reference nulled = no leak');

// ─── 5. LEAK: Map/Set as cache without cleanup ───
console.log('M:', '=== LEAK PATTERN: Unbounded Map/Set ===');

const cache = new Map();
for (let i = 0; i < 1000; i++) {
  cache.set(`key-${i}`, { data: 'x'.repeat(100) });
}
console.log('N:', `Unbounded Map size: ${cache.size} (grows forever)`);

// FIX: Use WeakMap for object keys (auto-GC when key is dereferenced)
const weakCache = new WeakMap();
let objKey = { id: 1 };
weakCache.set(objKey, { data: 'cached-value' });
console.log('O:', `WeakMap has key: ${weakCache.has(objKey)}`);
objKey = null; // now the entry CAN be garbage collected
console.log('P:', 'WeakMap: key set to null, entry eligible for GC');

// ─── 6. Detection: Monitor memory growth ───
console.log('Q:', '=== DETECTION: Monitor memory ===');

const formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + 'MB';

const memSnap = () => {
  const mem = process.memoryUsage();
  return {
    heapUsed: formatMB(mem.heapUsed),
    heapTotal: formatMB(mem.heapTotal),
    external: formatMB(mem.external),
    rss: formatMB(mem.rss),
  };
};

console.log('R:', 'Memory snapshot:', JSON.stringify(memSnap()));

// ─── 7. Prevention checklist in code ───
console.log('S:', '=== PREVENTION: Best practices ===');

const preventionRules = [
  'Always remove event listeners when component/module is destroyed',
  'Clear ALL timers (setInterval, setTimeout) on cleanup',
  'Use WeakMap/WeakSet for caches keyed by objects',
  'Bound array/Map caches with a max size (LRU pattern)',
  'Avoid storing large data in closures - extract only needed values',
  'Set unused references to null explicitly',
  'Use --max-old-space-size to set memory limits for early detection',
];

preventionRules.forEach((rule, i) => {
  console.log(`T${i}:`, rule);
});

/**
 * OUTPUT:
 *   A: === LEAK PATTERN: Global variables ===
 *   B: Global cache size: 1000 items (never freed!)
 *   C: Bounded cache size: 100 items (capped at 100)
 *   D: === LEAK PATTERN: Closures ===
 *   E: Closures created: 100 (each holds 10k-element array reference)
 *   F: Safe closure returns: 10000
 *   G: === LEAK PATTERN: Event listeners ===
 *   H: Listener count after leaky setup: 5
 *   I: Listener count after safe setup: 5 (handler removed)
 *   J: once() listener count after emit: 0 (auto-removed)
 *   K: === LEAK PATTERN: Forgotten timers ===
 *   L: Timer cleared + reference nulled = no leak
 *   M: === LEAK PATTERN: Unbounded Map/Set ===
 *   N: Unbounded Map size: 1000 (grows forever)
 *   O: WeakMap has key: true
 *   P: WeakMap: key set to null, entry eligible for GC
 *   Q: === DETECTION: Monitor memory ===
 *   R: Memory snapshot: {"heapUsed":"X.XXMB","heapTotal":"X.XXMB",...}
 *   S: === PREVENTION: Best practices ===
 *   T0-T6: (prevention rules listed)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Memory leaks in Node.js happen when objects remain referenced after      │
 * │  they're no longer needed. The top causes are: (1) global variables or    │
 * │  unbounded caches that grow forever, (2) closures capturing large data    │
 * │  they don't fully need, (3) event listeners added but never removed,      │
 * │  and (4) forgotten setInterval timers. I detect them by monitoring        │
 * │  process.memoryUsage() over time - if heapUsed keeps climbing without    │
 * │  dropping after GC, there's a leak. I use heap snapshots via              │
 * │  --inspect + Chrome DevTools to find the retaining objects. Prevention    │
 * │  means: bounded caches, WeakMap for object-keyed caches, always          │
 * │  cleaning up listeners and timers, and extracting values from closures." │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/13-performance/01-memory-leaks.js
 */
