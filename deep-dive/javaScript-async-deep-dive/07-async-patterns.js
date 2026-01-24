/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                    JAVASCRIPT ASYNC DEEP DIVE                                ║
 * ║               PART 7: ADVANCED ASYNC PATTERNS                                ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  🎤 1-2 MINUTE INTERVIEW EXPLANATION                                         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  "Beyond basic async/await, there are powerful patterns for complex          ║
 * ║   scenarios:                                                                 ║
 * ║                                                                              ║
 * ║   DEBOUNCING: Wait for user to stop typing before making API call.           ║
 * ║   Useful for search inputs - only fires after a pause.                       ║
 * ║                                                                              ║
 * ║   THROTTLING: Limit how often a function can run. Useful for scroll          ║
 * ║   events - fires at most once per interval.                                  ║
 * ║                                                                              ║
 * ║   MEMOIZATION: Cache async results to avoid duplicate requests.              ║
 * ║   Same input returns cached Promise.                                         ║
 * ║                                                                              ║
 * ║   QUEUE: Process items sequentially, useful for ordered operations.          ║
 * ║                                                                              ║
 * ║   CANCELLATION: AbortController to cancel fetch requests or                  ║
 * ║   custom cancellation tokens for other async operations.                     ║
 * ║                                                                              ║
 * ║   PUB/SUB: Event-driven async patterns for decoupled communication."         ║
 * ║                                                                              ║
 * ║  KEY POINTS TO MENTION:                                                      ║
 * ║  • Debounce: delay until user stops                                          ║
 * ║  • Throttle: limit frequency                                                 ║
 * ║  • Memoize: cache async results                                              ║
 * ║  • AbortController: cancel fetch/operations                                  ║
 * ║  • Queue: sequential processing                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ DEBOUNCE vs THROTTLE - VISUAL COMPARISON                                     │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │                                                                             │
 *   │   User Input Events (each │ is an event):                                   │
 *   │   ──────│─│──│─│─│─│────────────│─│─│──────────────────────────────────▶    │
 *   │                                                                             │
 *   │                                                                             │
 *   │   DEBOUNCE (wait 200ms after last event):                                   │
 *   │   ──────────────────────────●─────────────────────●────────────────────▶    │
 *   │                             ↑                     ↑                         │
 *   │                         fires here            fires here                    │
 *   │                    (200ms after last)    (200ms after last)                 │
 *   │                                                                             │
 *   │                                                                             │
 *   │   THROTTLE (max once per 200ms):                                            │
 *   │   ──────●───────●───────●───────────────●───────●──────────────────────▶    │
 *   │         ↑       ↑       ↑               ↑       ↑                           │
 *   │     first   200ms   200ms            first   200ms                          │
 *   │     event   later   later            event   later                          │
 *   │                                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 */


function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 1: DEBOUNCING
// ════════════════════════════════════════════════════════════════════════════════

console.log("═══ SECTION 1: DEBOUNCING ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEBOUNCE - Wait for pause in events                                         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function debounce(fn, wait) {
    let timeoutId = null;

    return function(...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, wait);
    };
}

// Async debounce that returns a Promise
function debounceAsync(fn, wait) {
    let timeoutId = null;
    let pendingPromise = null;
    let resolve = null;

    return function(...args) {
        clearTimeout(timeoutId);

        if (!pendingPromise) {
            pendingPromise = new Promise(r => { resolve = r; });
        }

        timeoutId = setTimeout(async () => {
            const result = await fn.apply(this, args);
            resolve(result);
            pendingPromise = null;
        }, wait);

        return pendingPromise;
    };
}

// Demo
const search = debounce((query) => {
    console.log(`  Searching for: ${query}`);
}, 200);

console.log("Debounce demo (only last fires):");
search("h");
search("he");
search("hel");
search("hell");
search("hello");  // Only this one fires after 200ms pause


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 2: THROTTLING
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 2: THROTTLING ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THROTTLE - Limit execution frequency                                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function throttle(fn, limit) {
    let inThrottle = false;

    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Demo
const logScroll = throttle((position) => {
    console.log(`  Scroll position: ${position}`);
}, 100);

console.log("Throttle demo (max once per 100ms):");
for (let i = 0; i < 10; i++) {
    setTimeout(() => logScroll(i * 10), i * 30);
}


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 3: MEMOIZATION
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 3: MEMOIZATION ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MEMOIZE ASYNC - Cache Promise results                                       │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function memoizeAsync(fn) {
    const cache = new Map();

    return async function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log(`  Cache hit for: ${key}`);
            return cache.get(key);
        }

        console.log(`  Cache miss for: ${key}`);
        const result = await fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Demo
const fetchUser = memoizeAsync(async (id) => {
    await delay(100);
    return { id, name: `User ${id}` };
});

async function memoDemo() {
    console.log("Memoization demo:");
    console.log(await fetchUser(1));  // Cache miss
    console.log(await fetchUser(2));  // Cache miss
    console.log(await fetchUser(1));  // Cache hit!
}

setTimeout(() => memoDemo(), 500);


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 4: ASYNC QUEUE
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 4: ASYNC QUEUE ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ QUEUE - Process items sequentially                                          │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class AsyncQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    async add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.process();
        });
    }

    async process() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        const { task, resolve, reject } = this.queue.shift();

        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        }

        this.processing = false;
        this.process();  // Process next item
    }
}

// Demo
async function queueDemo() {
    console.log("Queue demo (sequential processing):");
    const queue = new AsyncQueue();

    // Add tasks (they run sequentially)
    queue.add(async () => {
        await delay(100);
        console.log("  Task 1 done");
        return 1;
    });

    queue.add(async () => {
        await delay(100);
        console.log("  Task 2 done");
        return 2;
    });

    queue.add(async () => {
        await delay(100);
        console.log("  Task 3 done");
        return 3;
    });
}

setTimeout(() => queueDemo(), 1000);


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 5: CANCELLATION
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 5: CANCELLATION ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ABORTCONTROLLER - Cancel fetch requests                                     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   const controller = new AbortController();
 *
 *   fetch(url, { signal: controller.signal })
 *       .then(response => ...)
 *       .catch(error => {
 *           if (error.name === 'AbortError') {
 *               console.log('Fetch cancelled');
 *           }
 *       });
 *
 *   // Later...
 *   controller.abort();  // Cancels the fetch
 */

// Custom cancellable async operation
function cancellableOperation(signal) {
    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
            if (signal.aborted) {
                clearInterval(checkInterval);
                reject(new Error("Operation cancelled"));
            }
        }, 10);

        setTimeout(() => {
            clearInterval(checkInterval);
            resolve("Operation completed");
        }, 200);
    });
}

// Demo
async function cancellationDemo() {
    console.log("Cancellation demo:");

    const controller = new AbortController();

    // Cancel after 50ms
    setTimeout(() => {
        console.log("  Aborting...");
        controller.abort();
    }, 50);

    try {
        const result = await cancellableOperation(controller.signal);
        console.log("  Result:", result);
    } catch (error) {
        console.log("  Caught:", error.message);
    }
}

setTimeout(() => cancellationDemo(), 1500);


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 6: DEFERRED / LAZY PROMISE
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 6: DEFERRED PROMISE ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEFERRED - Expose resolve/reject externally                                 │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function createDeferred() {
    let resolve, reject;

    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve, reject };
}

// Demo
async function deferredDemo() {
    console.log("Deferred demo:");

    const { promise, resolve } = createDeferred();

    // Resolve from elsewhere
    setTimeout(() => {
        console.log("  Resolving deferred...");
        resolve("Deferred value");
    }, 100);

    const result = await promise;
    console.log("  Got:", result);
}

setTimeout(() => deferredDemo(), 1800);


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 7: PUB/SUB PATTERN
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 7: PUB/SUB ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ EVENT EMITTER - Pub/Sub for async events                                    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class AsyncEventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, handler) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(handler);
        return () => this.off(event, handler);
    }

    off(event, handler) {
        const handlers = this.events.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) handlers.splice(index, 1);
        }
    }

    async emit(event, data) {
        const handlers = this.events.get(event) || [];
        await Promise.all(handlers.map(h => h(data)));
    }

    once(event) {
        return new Promise(resolve => {
            const unsubscribe = this.on(event, (data) => {
                unsubscribe();
                resolve(data);
            });
        });
    }
}

// Demo
async function pubsubDemo() {
    console.log("Pub/Sub demo:");
    const emitter = new AsyncEventEmitter();

    emitter.on('data', async (data) => {
        console.log("  Handler 1:", data);
    });

    emitter.on('data', async (data) => {
        await delay(50);
        console.log("  Handler 2:", data);
    });

    await emitter.emit('data', { message: "Hello!" });
    console.log("  All handlers done");
}

setTimeout(() => pubsubDemo(), 2100);


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 8: ASYNC POOL PATTERN
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 8: ASYNC POOL ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ POOL - Reusable concurrency limiter                                         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class AsyncPool {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    async run(fn) {
        if (this.running >= this.concurrency) {
            await new Promise(resolve => this.queue.push(resolve));
        }

        this.running++;

        try {
            return await fn();
        } finally {
            this.running--;
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                next();
            }
        }
    }
}

// Demo
async function poolDemo() {
    console.log("Pool demo (concurrency: 2):");
    const pool = new AsyncPool(2);

    const tasks = [1, 2, 3, 4, 5].map(i =>
        pool.run(async () => {
            console.log(`  Start task ${i}`);
            await delay(100);
            console.log(`  End task ${i}`);
            return i;
        })
    );

    const results = await Promise.all(tasks);
    console.log("  Results:", results);
}

setTimeout(() => poolDemo(), 2400);


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 9: INTERVIEW QUESTIONS
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 9: INTERVIEW QUESTIONS ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON INTERVIEW QUESTIONS                                                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Q1: What's the difference between debounce and throttle?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Debounce waits for pause after events, fires once.
 *    Throttle limits to max once per interval.
 *
 * Q2: How do you cancel a fetch request?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Use AbortController. Pass signal to fetch, call controller.abort().
 *
 * Q3: How do you memoize async functions?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Cache by args key, store and return the Promise (not just the result).
 *
 * Q4: What is a Deferred/Promise with external resolve?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: A pattern where resolve/reject are exposed outside the Promise constructor.
 */


/**
 * ════════════════════════════════════════════════════════════════════════════════
 * SUMMARY
 * ════════════════════════════════════════════════════════════════════════════════
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │                          KEY TAKEAWAYS                                      │
 *   ├─────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                             │
 *   │   RATE LIMITING                                                             │
 *   │   ├── Debounce: wait for pause, fire once                                   │
 *   │   └── Throttle: max once per interval                                       │
 *   │                                                                             │
 *   │   CACHING                                                                   │
 *   │   └── Memoize: cache async results by args                                  │
 *   │                                                                             │
 *   │   CONTROL FLOW                                                              │
 *   │   ├── Queue: sequential processing                                          │
 *   │   ├── Pool: limited concurrency                                             │
 *   │   └── Cancellation: AbortController                                         │
 *   │                                                                             │
 *   │   COMMUNICATION                                                             │
 *   │   ├── Deferred: external resolve/reject                                     │
 *   │   └── Pub/Sub: event-driven async                                           │
 *   │                                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══ FILE 7 COMPLETE ═══");
console.log("Run: node 08-interview-qa.js");
