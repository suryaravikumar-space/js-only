/**
 * FUNCTIONAL PROGRAMMING: 11 - Memoization
 *
 * ONE CONCEPT: Cache function results to avoid redundant computation
 */


// =============================================================================
// WHAT IS MEMOIZATION?
// =============================================================================

console.log('=== Memoization ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEMOIZATION                                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  First call:                                                         │
 *   │  ┌──────┐     ┌────────────┐     ┌────────┐     ┌────────┐          │
 *   │  │ args │ ──▶ │ Not in     │ ──▶ │Compute │ ──▶ │ Store  │          │
 *   │  │      │     │ cache?     │     │ result │     │in cache│          │
 *   │  └──────┘     └────────────┘     └────────┘     └────────┘          │
 *   │                                                                      │
 *   │  Subsequent calls (same args):                                       │
 *   │  ┌──────┐     ┌────────────┐     ┌────────┐                         │
 *   │  │ args │ ──▶ │ In cache!  │ ──▶ │ Return │  ← INSTANT!             │
 *   │  │      │     │            │     │ cached │                         │
 *   │  └──────┘     └────────────┘     └────────┘                         │
 *   │                                                                      │
 *   │  Only works for PURE FUNCTIONS (same input = same output)            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC MEMOIZATION
// =============================================================================

console.log('=== Basic Memoize ===\n');

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`  Cache HIT for ${key}`);
      return cache.get(key);
    }

    console.log(`  Cache MISS for ${key}`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Usage
function expensiveAdd(a, b) {
  // Simulate expensive computation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result = a + b;
  }
  return result;
}

const memoizedAdd = memoize(expensiveAdd);

console.log('First call:');
console.time('  Time');
console.log('  Result:', memoizedAdd(10, 20));
console.timeEnd('  Time');

console.log('\nSecond call (cached):');
console.time('  Time');
console.log('  Result:', memoizedAdd(10, 20));
console.timeEnd('  Time');

console.log('\nDifferent args:');
console.log('  Result:', memoizedAdd(5, 10));


// =============================================================================
// FIBONACCI WITH MEMOIZATION
// =============================================================================

console.log('\n=== Fibonacci: Naive vs Memoized ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  NAIVE FIBONACCI CALL TREE (exponential!)                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │                fib(5)                                               │
 *   │              /        \                                             │
 *   │          fib(4)      fib(3)                                        │
 *   │         /    \       /    \                                         │
 *   │      fib(3) fib(2) fib(2) fib(1)                                  │
 *   │      /   \                                                         │
 *   │   fib(2) fib(1)                                                    │
 *   │                                                                     │
 *   │   fib(2) computed 3 TIMES! fib(3) computed 2 TIMES!               │
 *   │   O(2^n) - exponential!                                            │
 *   │                                                                     │
 *   │                                                                     │
 *   │  MEMOIZED: Each value computed ONCE                                │
 *   │                                                                     │
 *   │  fib(5) → fib(4) → fib(3) → fib(2) → fib(1) → fib(0)             │
 *   │                                                                     │
 *   │  O(n) - linear!                                                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Naive O(2^n)
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Memoized O(n)
function fibMemoized(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemoized(n - 1, memo) + fibMemoized(n - 2, memo);
  return memo[n];
}

// Or using the generic memoize
const fibGeneric = memoize(function fib(n) {
  if (n <= 1) return n;
  return fibGeneric(n - 1) + fibGeneric(n - 2);
});

console.log('Naive fib(10):', fibNaive(10));

console.time('Naive fib(35)');
console.log('Naive fib(35):', fibNaive(35));
console.timeEnd('Naive fib(35)');

console.time('Memoized fib(35)');
console.log('Memoized fib(35):', fibMemoized(35));
console.timeEnd('Memoized fib(35)');


// =============================================================================
// ADVANCED MEMOIZE: WITH MAX SIZE (LRU)
// =============================================================================

console.log('\n=== Memoize with LRU Cache ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  LRU (Least Recently Used) CACHE                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Problem: Unbounded cache = memory leak                             │
 *   │  Solution: Limit cache size, evict oldest entries                   │
 *   │                                                                     │
 *   │  Cache (max 3):                                                     │
 *   │  [A] [B] [C]  ← Full                                               │
 *   │                                                                     │
 *   │  Add D:                                                             │
 *   │  [B] [C] [D]  ← A evicted (least recently used)                    │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

function memoizeWithLimit(fn, maxSize = 100) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // Move to end (most recently used)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn(...args);

    // Evict oldest if full
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

const cachedCalc = memoizeWithLimit(x => x * x, 3);
console.log('Cache size 3:');
console.log(cachedCalc(1));  // Compute, cache: [1]
console.log(cachedCalc(2));  // Compute, cache: [1, 2]
console.log(cachedCalc(3));  // Compute, cache: [1, 2, 3]
console.log(cachedCalc(4));  // Compute, cache: [2, 3, 4] — 1 evicted
console.log(cachedCalc(2));  // HIT, cache: [3, 4, 2]


// =============================================================================
// REAL-WORLD: API RESPONSE CACHING
// =============================================================================

console.log('\n=== Real-World: API Cache ===\n');

function memoizeWithExpiry(fn, ttlMs = 60000) {
  const cache = new Map();

  return async function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key);
      if (Date.now() - timestamp < ttlMs) {
        console.log('  Cache hit (fresh)');
        return value;
      }
      console.log('  Cache expired');
      cache.delete(key);
    }

    console.log('  Cache miss - fetching...');
    const result = await fn(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  };
}

// Usage
const fetchUser = memoizeWithExpiry(async (id) => {
  // Simulated API call
  return { id, name: 'Alice', fetchedAt: new Date().toISOString() };
}, 5000);

(async () => {
  const user1 = await fetchUser(1);
  console.log('First fetch:', user1);

  const user2 = await fetchUser(1);
  console.log('Second fetch:', user2);
})();


// =============================================================================
// REAL-WORLD: REACT useMemo / useCallback
// =============================================================================

console.log('\n=== React Memoization ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  REACT MEMOIZATION                                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  useMemo(fn, deps)                                                  │
 *   │  → Cache COMPUTED VALUE                                             │
 *   │  → Recompute only when deps change                                  │
 *   │  → const sorted = useMemo(() => sort(list), [list])                 │
 *   │                                                                     │
 *   │  useCallback(fn, deps)                                              │
 *   │  → Cache FUNCTION REFERENCE                                         │
 *   │  → New reference only when deps change                              │
 *   │  → const handleClick = useCallback(() => {}, [id])                  │
 *   │                                                                     │
 *   │  React.memo(Component)                                              │
 *   │  → Cache COMPONENT RENDER                                           │
 *   │  → Skip re-render if props unchanged                                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('useMemo: cache computed values');
console.log('useCallback: cache function references');
console.log('React.memo: cache component renders');


// =============================================================================
// REAL-WORLD: SELECTOR MEMOIZATION (Redux)
// =============================================================================

console.log('\n=== Selector Memoization (Reselect Pattern) ===\n');

function createSelector(...args) {
  const resultFn = args.pop();
  const inputSelectors = args;
  let lastInputs = null;
  let lastResult = null;

  return function(state) {
    const inputs = inputSelectors.map(sel => sel(state));

    // Check if inputs changed
    if (lastInputs && inputs.every((input, i) => input === lastInputs[i])) {
      console.log('  Selector: cache hit');
      return lastResult;
    }

    console.log('  Selector: recomputing');
    lastInputs = inputs;
    lastResult = resultFn(...inputs);
    return lastResult;
  };
}

// Usage
const getUsers = state => state.users;
const getFilter = state => state.filter;

const getFilteredUsers = createSelector(
  getUsers,
  getFilter,
  (users, filter) => users.filter(u => u.active === filter)
);

const state = {
  users: [
    { name: 'Alice', active: true },
    { name: 'Bob', active: false }
  ],
  filter: true
};

console.log('First call:', getFilteredUsers(state));
console.log('Same state:', getFilteredUsers(state));  // Cache hit


// =============================================================================
// WHEN NOT TO MEMOIZE
// =============================================================================

console.log('\n=== When NOT to Memoize ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  DON'T MEMOIZE WHEN:                                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ✗ Function is fast already                                         │
 *   │    Overhead of caching > computation cost                           │
 *   │                                                                     │
 *   │  ✗ Results rarely repeat                                            │
 *   │    Cache fills up, never gets hits                                  │
 *   │                                                                     │
 *   │  ✗ Function has side effects                                        │
 *   │    Memoization skips the function entirely on cache hit             │
 *   │                                                                     │
 *   │  ✗ Arguments are complex objects                                    │
 *   │    JSON.stringify is expensive for large objects                     │
 *   │                                                                     │
 *   │  DO MEMOIZE WHEN:                                                   │
 *   │  ✓ Expensive computation (sorting, filtering large datasets)        │
 *   │  ✓ Same inputs called repeatedly                                    │
 *   │  ✓ Pure functions only                                              │
 *   │  ✓ Results are deterministic                                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Memoization is caching a function's result based on its arguments.
 * If the same arguments are passed again, the cached result is returned
 * instead of recomputing. It only works for pure functions because
 * we need the same input to always produce the same output.
 *
 * The classic example is fibonacci. Naive recursion is O(2^n) because
 * it recomputes the same values. With memoization, each value is
 * computed once, making it O(n).
 *
 * I implement it with a Map where the key is the serialized arguments
 * and the value is the result. For production, I add features like
 * max cache size (LRU eviction) and TTL for time-based expiry.
 *
 * In React, useMemo caches computed values and useCallback caches
 * function references. React.memo caches entire component renders.
 * In Redux, the reselect library memoizes selectors so derived data
 * isn't recomputed when unrelated state changes.
 *
 * The tradeoff is memory vs speed. Don't memoize cheap functions or
 * functions that rarely get the same arguments."
 */


// RUN: node docs/28-functional-programming/11-memoization.js
