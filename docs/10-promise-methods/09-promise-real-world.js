/**
 * CHALLENGE 09: Real-World Promise Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Common real-world patterns:                                                ║
 * ║                                                                            ║
 * ║ 1. RETRY: Try again on failure with backoff                                ║
 * ║ 2. QUEUE: Limit concurrent operations                                      ║
 * ║ 3. DEBOUNCE: Wait for pause before executing                               ║
 * ║ 4. CACHE: Remember results to avoid re-fetching                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Pattern 1: Retry with exponential backoff
function fetchWithRetry(url, retries = 3, delay = 100) {
  return new Promise((resolve, reject) => {
    function attempt(n) {
      simulateFetch(url)
        .then(resolve)
        .catch(err => {
          if (n <= 0) reject(err);
          else setTimeout(() => attempt(n - 1), delay * (4 - n));
        });
    }
    attempt(retries);
  });
}

var fetchCount = 0;
function simulateFetch(url) {
  fetchCount++;
  return fetchCount < 3
    ? Promise.reject(new Error('Network error'))
    : Promise.resolve({ data: 'success' });
}

fetchWithRetry('/api').then(r => console.log('A:', r.data));

// Pattern 2: Promise queue (rate limiting)
function createQueue(concurrency) {
  var running = 0;
  var queue = [];

  function next() {
    if (running >= concurrency || queue.length === 0) return;
    running++;
    var { task, resolve, reject } = queue.shift();
    task()
      .then(resolve)
      .catch(reject)
      .finally(() => { running--; next(); });
  }

  return function add(task) {
    return new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject });
      next();
    });
  };
}

var addToQueue = createQueue(2);
var results = [];

[1, 2, 3, 4].forEach(n => {
  addToQueue(() => new Promise(r => setTimeout(() => r(n), 10)))
    .then(v => results.push(v));
});

setTimeout(() => console.log('B:', results.length), 100);

// Pattern 3: Debounced promise
function debouncePromise(fn, wait) {
  var timeout;
  return function(...args) {
    return new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(fn(...args)), wait);
    });
  };
}

var debouncedSearch = debouncePromise(q => 'result: ' + q, 50);
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc').then(r => console.log('C:', r));

// Pattern 4: Cache promise results
function memoizePromise(fn) {
  var cache = new Map();
  return function(key) {
    if (cache.has(key)) return cache.get(key);
    var promise = fn(key);
    cache.set(key, promise);
    return promise;
  };
}

var cachedFetch = memoizePromise(id => Promise.resolve({ id, ts: Date.now() }));
cachedFetch(1).then(r1 => {
  setTimeout(() => {
    cachedFetch(1).then(r2 => console.log('D:', r1.ts === r2.ts));
  }, 10);
});

/**
 * OUTPUT:
 *   A: success
 *   B: 4
 *   C: result: abc
 *   D: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PATTERN EXPLANATIONS                                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Retry succeeds on 3rd attempt                                           ║
 * ║ ──────────────────────────────────                                         ║
 * ║   fetchCount 1 → reject → retry                                            ║
 * ║   fetchCount 2 → reject → retry                                            ║
 * ║   fetchCount 3 → resolve → 'success'                                       ║
 * ║                                                                            ║
 * ║ B: Queue processes all 4 items                                             ║
 * ║ ──────────────────────────────────                                         ║
 * ║   Concurrency 2: runs 1,2 first, then 3,4                                  ║
 * ║   All 4 complete within 100ms                                              ║
 * ║                                                                            ║
 * ║ C: Debounce only executes last call                                        ║
 * ║ ──────────────────────────────────────                                     ║
 * ║   'a' scheduled → 'ab' cancels → 'abc' executes                            ║
 * ║   Only 'abc' result is returned                                            ║
 * ║                                                                            ║
 * ║ D: Cache returns same promise                                              ║
 * ║ ────────────────────────────────                                           ║
 * ║   First call creates and caches promise                                    ║
 * ║   Second call returns cached promise (same timestamp)                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/10-promise-methods/09-promise-real-world.js
 */
