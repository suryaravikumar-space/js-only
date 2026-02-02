/**
 * TOPIC 03: Module Caching
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Modules are CACHED after first require():                                 ║
 * ║                                                                            ║
 * ║   require('./mod')  → Load, execute, cache                                ║
 * ║   require('./mod')  → Return cached version (NO re-execution)             ║
 * ║                                                                            ║
 * ║ Cache stored in: require.cache                                            ║
 * ║ This means module code runs ONCE, even if required multiple times.        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Module caching is like a LIBRARY with a PHOTOCOPIER:                     │
 * │                                                                             │
 * │  First time you borrow a book (require):                                   │
 * │    1. Librarian finds it on the shelf (resolve)                            │
 * │    2. Makes a photocopy (execute)                                          │
 * │    3. Gives you the copy                                                   │
 * │    4. Keeps the original in the "quick access" drawer (cache)             │
 * │                                                                             │
 * │  Next time you ask for the same book:                                      │
 * │    - Straight from the quick access drawer! No searching, no copying.     │
 * │                                                                             │
 * │  This means: If someone WRITES in the book (modifies exports),            │
 * │  EVERYONE who borrows it sees the same writing! (singleton)               │
 * │                                                                             │
 * │  "require = borrow once, everyone shares the same copy."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   require('./counter')                                                      │
 * │       │                                                                     │
 * │       ↓                                                                     │
 * │   ┌──────────────────┐                                                     │
 * │   │ require.cache    │                                                     │
 * │   │ has './counter'? │                                                     │
 * │   └───┬──────┬───────┘                                                     │
 * │    NO │      │ YES                                                         │
 * │       ↓      ↓                                                              │
 * │   Load &   Return cached ──→ { increment, getCount }                      │
 * │   Execute     (same object every time!)                                    │
 * │       │                                                                     │
 * │       ↓                                                                     │
 * │   Cache it ──→ require.cache['/abs/path/counter.js'] = module             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Demonstrate caching behavior
console.log('A:', 'First require of path module');
const path1 = require('path');

console.log('B:', 'Second require - returns cached');
const path2 = require('path');

console.log('C:', path1 === path2); // true - same cached object

// View the cache
const cacheKeys = Object.keys(require.cache);
console.log('D:', `${cacheKeys.length} modules cached`);

// Singleton pattern via module caching
// counter.js:
//   let count = 0;
//   module.exports = {
//     increment: () => ++count,
//     getCount: () => count
//   };
//
// app.js:
//   const c1 = require('./counter');
//   const c2 = require('./counter');
//   c1.increment();
//   console.log(c2.getCount()); // 1 - same instance!

// Simulating the singleton behavior
const createModule = () => {
  let count = 0;
  return { increment: () => ++count, getCount: () => count };
};

// With caching (same reference)
const cached = createModule();
const ref1 = cached;
const ref2 = cached;
ref1.increment();
ref1.increment();
console.log('E:', ref2.getCount()); // 2 - same instance

// How to clear cache (rarely needed)
// delete require.cache[require.resolve('./myModule')];
console.log('F:', 'Clear cache: delete require.cache[path]');

// require.resolve - find module path without loading
const resolvedPath = require.resolve('path');
console.log('G:', `path module resolves to: ${resolvedPath}`);

/**
 * OUTPUT:
 *   A: First require of path module
 *   B: Second require - returns cached
 *   C: true
 *   D: (number) modules cached
 *   E: 2
 *   F: Clear cache: delete require.cache[path]
 *   G: path module resolves to: path
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Node caches modules after first require(). Subsequent require() calls    │
 * │  return the cached object - the module code doesn't run again. This       │
 * │  creates a natural singleton pattern. The cache is stored in              │
 * │  require.cache and can be cleared with delete require.cache[path].        │
 * │  require.resolve() finds the path without loading the module."            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/01-modules-system/03-module-caching.js
 */
