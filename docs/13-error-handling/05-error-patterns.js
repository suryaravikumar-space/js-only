/**
 * CHALLENGE 05: Error Handling Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Production-grade error handling uses PATTERNS, not just try-catch.        ║
 * ║ These patterns handle retries, fallbacks, timeouts, and recovery.         ║
 * ║                                                                            ║
 * ║   Common Patterns:                                                         ║
 * ║   • Retry Pattern         - Try again on transient failures               ║
 * ║   • Circuit Breaker       - Fail fast when service is down                ║
 * ║   • Fallback Pattern      - Use backup when primary fails                 ║
 * ║   • Timeout Pattern       - Don't wait forever                            ║
 * ║   • Graceful Degradation  - Partial functionality > total failure         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Retry Pattern
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. Retry Pattern ═══\n");

async function retry(fn, options = {}) {
  const { retries = 3, delay = 1000, backoff = 2 } = options;
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`   Attempt ${attempt}/${retries} failed: ${error.message}`);

      if (attempt < retries) {
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        console.log(`   Waiting ${waitTime}ms before retry...`);
        await new Promise(r => setTimeout(r, waitTime));
      }
    }
  }

  throw new Error(`All ${retries} attempts failed. Last error: ${lastError.message}`);
}

// Example: Flaky API call
let callCount = 0;
async function flakyApi() {
  callCount++;
  if (callCount < 3) {
    throw new Error('Network timeout');
  }
  return { data: 'Success!' };
}

(async () => {
  console.log('A: Calling flaky API with retry:');
  try {
    const result = await retry(flakyApi, { retries: 3, delay: 100, backoff: 1 });
    console.log('B: Final result:', result);
  } catch (e) {
    console.log('C: All retries failed:', e.message);
  }
  console.log('');
})();

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ RETRY PATTERN                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Attempt 1 ─── fail ───► wait ───► Attempt 2 ─── fail ───► wait ───►...  │
 * │                  │                              │                           │
 * │                  ▼                              ▼                           │
 * │             delay × 1                     delay × backoff                  │
 * │                                                                             │
 * │   EXPONENTIAL BACKOFF:                                                      │
 * │   • delay = 1000ms, backoff = 2                                             │
 * │   • Attempt 1 fails: wait 1000ms                                            │
 * │   • Attempt 2 fails: wait 2000ms                                            │
 * │   • Attempt 3 fails: wait 4000ms                                            │
 * │                                                                             │
 * │   USE WHEN:                                                                 │
 * │   ✓ Network requests                                                        │
 * │   ✓ Database connections                                                    │
 * │   ✓ Third-party API calls                                                   │
 * │   ✓ Transient failures (not programming errors!)                           │
 * │                                                                             │
 * │   DON'T RETRY:                                                              │
 * │   ✗ 400 Bad Request (your data is wrong)                                   │
 * │   ✗ 401/403 Auth errors (retrying won't help)                              │
 * │   ✗ Validation errors                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Circuit Breaker Pattern
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 2. Circuit Breaker Pattern ═══\n");

  class CircuitBreaker {
    constructor(options = {}) {
      this.failureThreshold = options.failureThreshold || 5;
      this.resetTimeout = options.resetTimeout || 30000;
      this.state = 'CLOSED';  // CLOSED = normal, OPEN = failing, HALF_OPEN = testing
      this.failures = 0;
      this.lastFailTime = null;
    }

    async call(fn) {
      if (this.state === 'OPEN') {
        if (Date.now() - this.lastFailTime > this.resetTimeout) {
          this.state = 'HALF_OPEN';
          console.log('   Circuit: HALF_OPEN (testing)');
        } else {
          throw new Error('Circuit is OPEN - failing fast');
        }
      }

      try {
        const result = await fn();
        this.onSuccess();
        return result;
      } catch (error) {
        this.onFailure();
        throw error;
      }
    }

    onSuccess() {
      this.failures = 0;
      if (this.state === 'HALF_OPEN') {
        console.log('   Circuit: CLOSED (recovered)');
      }
      this.state = 'CLOSED';
    }

    onFailure() {
      this.failures++;
      this.lastFailTime = Date.now();
      if (this.failures >= this.failureThreshold) {
        this.state = 'OPEN';
        console.log('   Circuit: OPEN (too many failures)');
      }
    }
  }

  // Demo
  const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 100 });
  let apiCallCount = 0;

  async function unreliableApi() {
    apiCallCount++;
    if (apiCallCount <= 5) throw new Error('Service unavailable');
    return 'OK';
  }

  async function demo() {
    for (let i = 1; i <= 7; i++) {
      try {
        const result = await breaker.call(unreliableApi);
        console.log(`D: Call ${i}: ${result}`);
      } catch (e) {
        console.log(`E: Call ${i}: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 50));
    }
  }

  demo().then(() => console.log(''));

}, 500);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CIRCUIT BREAKER STATES                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │                     success                                                 │
 * │        ┌─────────────────────────────────┐                                  │
 * │        │                                 │                                  │
 * │        ▼                                 │                                  │
 * │   ┌─────────┐         failures      ┌─────────┐                            │
 * │   │ CLOSED  │ ──── > threshold ───► │  OPEN   │                            │
 * │   │ (normal)│                       │ (fail   │                            │
 * │   └─────────┘                       │  fast)  │                            │
 * │        ▲                            └────┬────┘                            │
 * │        │                                 │                                  │
 * │        │   success                  timeout                                 │
 * │        │      │                          │                                  │
 * │   ┌────┴──────┴────┐                     │                                  │
 * │   │   HALF_OPEN    │◄────────────────────┘                                  │
 * │   │  (testing)     │                                                        │
 * │   └────────────────┘                                                        │
 * │           │                                                                 │
 * │        failure ───► back to OPEN                                           │
 * │                                                                             │
 * │   PURPOSE: Prevent cascading failures in distributed systems               │
 * │   - Don't keep hitting a dead service                                       │
 * │   - Allow service time to recover                                           │
 * │   - Fail fast = better user experience                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Fallback Pattern
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 3. Fallback Pattern ═══\n");

  async function withFallback(primary, fallback) {
    try {
      return await primary();
    } catch (primaryError) {
      console.log(`   Primary failed: ${primaryError.message}`);
      try {
        return await fallback();
      } catch (fallbackError) {
        throw new Error(
          `Both primary and fallback failed. ` +
          `Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`
        );
      }
    }
  }

  // Example: Multiple data sources
  async function fetchFromApi() {
    throw new Error('API is down');
  }

  async function fetchFromCache() {
    return { data: 'Cached data', source: 'cache' };
  }

  async function fetchFromDefault() {
    return { data: 'Default data', source: 'default' };
  }

  // Multi-level fallback
  async function getData() {
    return withFallback(
      fetchFromApi,
      () => withFallback(fetchFromCache, fetchFromDefault)
    );
  }

  getData().then(result => {
    console.log('F: Result:', result);
    console.log('');
  });

}, 1000);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FALLBACK PATTERN                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────┐     fail     ┌─────────────┐     fail     ┌───────────┐  │
 * │   │   PRIMARY   │ ───────────► │  FALLBACK   │ ───────────► │  DEFAULT  │  │
 * │   │   (API)     │              │  (Cache)    │              │  (Static) │  │
 * │   └─────────────┘              └─────────────┘              └───────────┘  │
 * │         │                            │                            │        │
 * │      success                      success                      success     │
 * │         │                            │                            │        │
 * │         ▼                            ▼                            ▼        │
 * │        RETURN                       RETURN                       RETURN    │
 * │                                                                             │
 * │   USE CASES:                                                                │
 * │   • API down? Use cached data                                               │
 * │   • No user photo? Use default avatar                                       │
 * │   • Feature flag service down? Use defaults                                 │
 * │   • CDN fails? Use origin server                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Timeout Pattern
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 4. Timeout Pattern ═══\n");

  function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    );
    return Promise.race([promise, timeout]);
  }

  // Example
  async function slowOperation() {
    await new Promise(r => setTimeout(r, 500));
    return 'Completed!';
  }

  async function testTimeout() {
    // Fast enough
    try {
      const result = await withTimeout(slowOperation(), 1000);
      console.log('G: Fast enough:', result);
    } catch (e) {
      console.log('H: Error:', e.message);
    }

    // Too slow
    try {
      const result = await withTimeout(slowOperation(), 100);
      console.log('I: Fast enough:', result);
    } catch (e) {
      console.log('J: Error:', e.message);
    }
  }

  testTimeout().then(() => console.log(''));

}, 1200);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TIMEOUT PATTERN WITH Promise.race                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Promise.race([                                                            │
 * │     actualOperation,  ─────────────────────────────────────►  result       │
 * │     timeout           ───────► reject!                                      │
 * │   ])                                                                        │
 * │                                                                             │
 * │   Whichever resolves/rejects FIRST wins!                                   │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐   │
 * │   │  TIME ──────────────────────────────────────────────────────────►  │   │
 * │   │                                                                     │   │
 * │   │  Timeout:   ──────────[100ms]──────► REJECT "Timeout!"             │   │
 * │   │                          ▲                                          │   │
 * │   │                          │ FIRST!                                   │   │
 * │   │                          │                                          │   │
 * │   │  Operation: ───────────────────────[500ms]─────────► resolve       │   │
 * │   │                                      (too late, ignored)           │   │
 * │   └────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   IMPORTANT: The slow operation still runs! Only the promise result        │
 * │   is ignored. Consider AbortController for true cancellation.              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Graceful Degradation
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 5. Graceful Degradation ═══\n");

  // Instead of failing completely, provide reduced functionality
  class FeatureService {
    constructor() {
      this.features = new Map();
    }

    async loadFeature(name, loader) {
      try {
        const feature = await loader();
        this.features.set(name, { status: 'active', impl: feature });
        console.log(`   Feature '${name}': ACTIVE`);
        return true;
      } catch (error) {
        this.features.set(name, { status: 'degraded', error: error.message });
        console.log(`   Feature '${name}': DEGRADED (${error.message})`);
        return false;
      }
    }

    isActive(name) {
      return this.features.get(name)?.status === 'active';
    }

    use(name, fallbackValue = null) {
      const feature = this.features.get(name);
      if (feature?.status === 'active') {
        return feature.impl;
      }
      return fallbackValue;
    }
  }

  async function demo() {
    const service = new FeatureService();

    // Load features - some may fail
    await service.loadFeature('analytics', async () => {
      return { track: (event) => console.log(`     Tracked: ${event}`) };
    });

    await service.loadFeature('recommendations', async () => {
      throw new Error('ML service unavailable');
    });

    await service.loadFeature('search', async () => {
      return { search: (q) => [`Result for: ${q}`] };
    });

    // App continues with available features
    console.log('\nK: App running with available features:');

    // Analytics works
    const analytics = service.use('analytics');
    if (analytics) {
      analytics.track('page_view');
    }

    // Recommendations degraded - use fallback
    const recs = service.use('recommendations', ['Popular Item 1', 'Popular Item 2']);
    console.log('     Recommendations:', recs);

    // Search works
    const searchService = service.use('search');
    if (searchService) {
      console.log('     Search results:', searchService.search('shoes'));
    }
  }

  demo().then(() => console.log(''));

}, 1500);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GRACEFUL DEGRADATION                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   INSTEAD OF:                                                               │
 * │   ┌───────────────────────────────────────────────────────────────────┐    │
 * │   │  "Error 500: Recommendations service is down"                     │    │
 * │   │  ─── ENTIRE PAGE FAILS ───                                        │    │
 * │   └───────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │   DO THIS:                                                                  │
 * │   ┌───────────────────────────────────────────────────────────────────┐    │
 * │   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │    │
 * │   │  │  Search  ✓  │  │  Cart  ✓    │  │  Recommendations        │   │    │
 * │   │  │  (working)  │  │  (working)  │  │  "Popular items"        │   │    │
 * │   │  └─────────────┘  └─────────────┘  │  (fallback content)     │   │    │
 * │   │                                     └─────────────────────────┘   │    │
 * │   │  ─── PAGE WORKS, REDUCED FUNCTIONALITY ───                        │    │
 * │   └───────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │   PRINCIPLE: Partial functionality is better than total failure!          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Production error handling uses patterns beyond basic try-catch:           │
 * │                                                                             │
 * │  Retry Pattern: For transient failures like network timeouts. Use          │
 * │  exponential backoff to avoid overwhelming the service. Only retry         │
 * │  5xx errors, not 4xx (those won't magically succeed).                      │
 * │                                                                             │
 * │  Circuit Breaker: Prevents cascading failures. After X failures,           │
 * │  'open' the circuit and fail fast. After a timeout, try one request        │
 * │  (half-open). If it works, close the circuit. Popular in microservices.    │
 * │                                                                             │
 * │  Fallback: When primary fails, use a backup. Like using cached data        │
 * │  when the API is down, or default avatar when image fails to load.         │
 * │                                                                             │
 * │  Timeout: Use Promise.race with a timeout promise. Prevents waiting        │
 * │  forever for slow responses. Consider AbortController for fetch.           │
 * │                                                                             │
 * │  Graceful Degradation: When a non-critical feature fails, continue         │
 * │  with reduced functionality rather than crashing the whole app.            │
 * │  Show 'Popular items' when recommendations service is down.                │
 * │                                                                             │
 * │  These patterns work together - retry with timeout, fallback after         │
 * │  circuit opens, degrade gracefully when fallback fails."                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/05-error-patterns.js
 */
