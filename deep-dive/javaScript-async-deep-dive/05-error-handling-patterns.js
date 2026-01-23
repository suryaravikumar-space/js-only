/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                    JAVASCRIPT ASYNC DEEP DIVE                                ║
 * ║                PART 5: ERROR HANDLING PATTERNS                               ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  🎤 1-2 MINUTE INTERVIEW EXPLANATION                                         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  "Error handling in async JavaScript has evolved significantly:              ║
 * ║                                                                              ║
 * ║   CALLBACKS: Use the error-first pattern - callback(error, result).          ║
 * ║   Check if error is truthy before using the result.                          ║
 * ║                                                                              ║
 * ║   PROMISES: Use .catch() at the end of chains. Errors propagate down         ║
 * ║   the chain until caught. You can recover by returning a value from catch.   ║
 * ║                                                                              ║
 * ║   ASYNC/AWAIT: Use try/catch blocks just like synchronous code.              ║
 * ║   A rejected Promise becomes a thrown error that can be caught.              ║
 * ║                                                                              ║
 * ║   Key patterns include: global unhandled rejection handlers, retry with      ║
 * ║   exponential backoff, graceful degradation with fallback values, and        ║
 * ║   proper error propagation up the call stack.                                ║
 * ║                                                                              ║
 * ║   Important: Always handle errors! Unhandled Promise rejections can crash    ║
 * ║   Node.js apps and cause silent failures in browsers."                       ║
 * ║                                                                              ║
 * ║  KEY POINTS TO MENTION:                                                      ║
 * ║  • Callbacks: error-first pattern callback(err, result)                      ║
 * ║  • Promises: .catch() for chains, errors propagate                           ║
 * ║  • async/await: try/catch blocks                                             ║
 * ║  • Global handlers: unhandledrejection event                                 ║
 * ║  • Patterns: retry, fallback, graceful degradation                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR HANDLING EVOLUTION - COMPLETE VISUAL                                   │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │                    ERROR HANDLING APPROACHES                                │
 *   ├─────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                             │
 *   │   CALLBACKS                 PROMISES                  ASYNC/AWAIT           │
 *   │   ═══════════════           ══════════════════        ═══════════════════   │
 *   │                                                                             │
 *   │   doAsync((err, data) => {  doAsync()                 async function() {    │
 *   │       if (err) {                .then(data => {})         try {             │
 *   │           // handle             .catch(err => {})             await doAsync()│
 *   │       }                                                  } catch (err) {    │
 *   │       // use data                                            // handle      │
 *   │   })                                                     }                  │
 *   │                                                       }                     │
 *   │                                                                             │
 *   │   Error check at           Centralized at             Same as sync code!    │
 *   │   EVERY level              end of chain                                     │
 *   │                                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE ERROR PROPAGATION - VISUAL FLOW                                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   Promise.resolve()
 *       │
 *       ▼
 *   .then(step1)  ──────────────────────────────────────────────▶ SUCCESS
 *       │                                                            │
 *       │ ← ERROR THROWN                                             │
 *       │                                                            ▼
 *       ▼                                                        .then(step2)
 *   .then(step2)  ←── SKIPPED! ───────────────────────────────────  │
 *       │                                                            │
 *       ▼                                                            ▼
 *   .then(step3)  ←── SKIPPED! ───────────────────────────────────  │
 *       │                                                            │
 *       ▼                                                            ▼
 *   .catch(handleError)  ◀──────── ERROR CAUGHT HERE ────────────────┘
 *       │
 *       │ Return value = recovery
 *       ▼
 *   .then(afterCatch)  ◀── Can continue after recovery!
 *
 *
 */


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 1: CALLBACK ERROR HANDLING
// ════════════════════════════════════════════════════════════════════════════════

console.log("═══ SECTION 1: CALLBACK ERROR HANDLING ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR-FIRST CALLBACK PATTERN                                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function fetchDataCallback(url, callback) {
    setTimeout(() => {
        if (url.includes("error")) {
            callback(new Error("Failed to fetch"), null);
        } else {
            callback(null, { data: "Success!" });
        }
    }, 100);
}

// Proper error handling
fetchDataCallback("https://api.example.com/data", (err, data) => {
    if (err) {
        console.log("Error:", err.message);
        return;  // IMPORTANT: return early!
    }
    console.log("Data:", data);
});

fetchDataCallback("https://api.example.com/error", (err, data) => {
    if (err) {
        console.log("Error:", err.message);
        return;
    }
    console.log("Data:", data);
});


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 2: PROMISE ERROR HANDLING
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 2: PROMISE ERROR HANDLING ═══\n");

function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ .catch() PLACEMENT                                                          │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Error propagation - skips intermediate .then()
Promise.resolve("start")
    .then(v => {
        console.log("Step 1:", v);
        throw new Error("Error at step 1");
    })
    .then(v => {
        console.log("Step 2 - SKIPPED");
    })
    .then(v => {
        console.log("Step 3 - SKIPPED");
    })
    .catch(err => {
        console.log("Caught:", err.message);
        return "recovered";
    })
    .then(v => {
        console.log("After catch:", v);
    });


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MULTIPLE .catch() FOR GRANULAR HANDLING                                     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function fetchUser() {
    return delay(50, { id: 1, name: "John" });
}

function fetchPosts(userId) {
    return Promise.reject(new Error("Posts service unavailable"));
}

// Granular error handling
fetchUser()
    .then(user => {
        console.log("\nGot user:", user.name);
        return fetchPosts(user.id);
    })
    .catch(err => {
        console.log("Posts error:", err.message);
        return [];  // Fallback to empty array
    })
    .then(posts => {
        console.log("Posts (or fallback):", posts);
    });


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 3: ASYNC/AWAIT ERROR HANDLING
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 3: ASYNC/AWAIT ERROR HANDLING ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TRY/CATCH WITH ASYNC/AWAIT                                                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

async function basicTryCatch() {
    try {
        const result = await Promise.reject(new Error("Failed!"));
        console.log("Result:", result);
    } catch (error) {
        console.log("Caught in try/catch:", error.message);
    } finally {
        console.log("Cleanup in finally");
    }
}

basicTryCatch();


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GRANULAR ERROR HANDLING WITH MULTIPLE TRY/CATCH                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

async function granularHandling() {
    let user;
    try {
        user = await fetchUser();
        console.log("\nGot user:", user.name);
    } catch (error) {
        console.log("User fetch failed, using guest");
        user = { id: 0, name: "Guest" };
    }

    let posts;
    try {
        posts = await fetchPosts(user.id);
    } catch (error) {
        console.log("Posts fetch failed, using empty array");
        posts = [];
    }

    return { user, posts };
}

granularHandling().then(result => console.log("Final result:", result));


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INLINE .catch() WITH AWAIT                                                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

async function inlineCatch() {
    // Provide fallback without try/catch
    const user = await fetchUser().catch(err => {
        console.log("Fallback user");
        return { id: 0, name: "Guest" };
    });

    const posts = await fetchPosts(user.id).catch(err => []);

    return { user, posts };
}


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 4: GLOBAL ERROR HANDLERS
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 4: GLOBAL ERROR HANDLERS ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ UNHANDLED REJECTION HANDLERS                                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   BROWSER:
 *   window.addEventListener('unhandledrejection', event => {
 *       console.error('Unhandled:', event.reason);
 *       event.preventDefault();  // Prevent default logging
 *   });
 *
 *   NODE.JS:
 *   process.on('unhandledRejection', (reason, promise) => {
 *       console.error('Unhandled:', reason);
 *   });
 */

// Node.js global handler
process.on('unhandledRejection', (reason, promise) => {
    console.log('Global handler caught:', reason.message || reason);
});

// This would trigger the global handler (if not caught)
// Promise.reject(new Error("Unhandled!"));


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 5: RETRY PATTERN
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 5: RETRY PATTERN ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ RETRY WITH EXPONENTIAL BACKOFF                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   Attempt 1: wait 1s
 *   Attempt 2: wait 2s
 *   Attempt 3: wait 4s
 *   Attempt 4: wait 8s
 *   ...
 */

async function retryWithBackoff(fn, maxAttempts = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            console.log(`  Attempt ${attempt} failed: ${error.message}`);

            if (attempt === maxAttempts) {
                throw new Error(`Failed after ${maxAttempts} attempts: ${error.message}`);
            }

            // Exponential backoff
            const waitTime = baseDelay * Math.pow(2, attempt - 1);
            console.log(`  Waiting ${waitTime}ms before retry...`);
            await delay(waitTime);
        }
    }
}

// Demo: Simulate unreliable API
let callCount = 0;
async function unreliableApi() {
    callCount++;
    if (callCount < 3) {
        throw new Error("Service unavailable");
    }
    return { success: true };
}

console.log("Testing retry pattern:");
retryWithBackoff(unreliableApi, 5, 100)
    .then(result => console.log("Success:", result))
    .catch(err => console.log("Final failure:", err.message));


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 6: FALLBACK PATTERN
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 6: FALLBACK PATTERN ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FALLBACK / GRACEFUL DEGRADATION                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

async function fetchWithFallback(primaryFn, fallbackFn, fallbackValue) {
    try {
        return await primaryFn();
    } catch (primaryError) {
        console.log(`Primary failed: ${primaryError.message}`);

        if (fallbackFn) {
            try {
                return await fallbackFn();
            } catch (fallbackError) {
                console.log(`Fallback failed: ${fallbackError.message}`);
            }
        }

        return fallbackValue;
    }
}

// Example usage
const primaryApi = () => Promise.reject(new Error("Primary down"));
const fallbackApi = () => Promise.reject(new Error("Fallback down"));
const defaultData = { cached: true, data: "default" };

fetchWithFallback(primaryApi, fallbackApi, defaultData)
    .then(result => console.log("Result:", result));


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 7: ERROR AGGREGATION
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 7: ERROR AGGREGATION ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COLLECTING MULTIPLE ERRORS                                                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

async function validateAll(validators, data) {
    const errors = [];

    for (const validator of validators) {
        try {
            await validator(data);
        } catch (error) {
            errors.push(error.message);
        }
    }

    if (errors.length > 0) {
        throw new Error(`Validation failed:\n  - ${errors.join('\n  - ')}`);
    }

    return true;
}

// Example validators
const validators = [
    async (data) => {
        if (!data.email) throw new Error("Email required");
    },
    async (data) => {
        if (!data.password) throw new Error("Password required");
    },
    async (data) => {
        if (data.password && data.password.length < 8) {
            throw new Error("Password must be 8+ characters");
        }
    }
];

validateAll(validators, { email: "", password: "123" })
    .then(() => console.log("Valid!"))
    .catch(err => console.log(err.message));


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 8: TIMEOUT PATTERN
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 8: TIMEOUT PATTERN ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE WITH TIMEOUT                                                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function withTimeout(promise, ms, errorMessage = "Operation timed out") {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), ms);
    });
    return Promise.race([promise, timeout]);
}

// Demo
const slowOperation = () => delay(2000, "done");

console.log("Testing timeout:");
withTimeout(slowOperation(), 100, "Too slow!")
    .then(result => console.log("Result:", result))
    .catch(err => console.log("Timeout:", err.message));


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 9: CIRCUIT BREAKER PATTERN
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 9: CIRCUIT BREAKER ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CIRCUIT BREAKER                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   States:                                                                   │
 * │   ┌──────────┐        failures > threshold        ┌──────────┐              │
 * │   │  CLOSED  │ ──────────────────────────────────▶│   OPEN   │              │
 * │   │  (normal)│                                    │ (failing)│              │
 * │   └────┬─────┘                                    └────┬─────┘              │
 * │        │                                               │                    │
 * │        │ success                         timeout       │                    │
 * │        │                                    │          │                    │
 * │        │         ┌──────────────┐           │          │                    │
 * │        └─────────│  HALF-OPEN   │◀──────────┴──────────┘                    │
 * │                  │   (testing)  │                                           │
 * │                  └──────────────┘                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class CircuitBreaker {
    constructor(fn, options = {}) {
        this.fn = fn;
        this.failureThreshold = options.failureThreshold || 3;
        this.resetTimeout = options.resetTimeout || 10000;

        this.state = 'CLOSED';
        this.failures = 0;
        this.lastFailure = null;
    }

    async call(...args) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailure > this.resetTimeout) {
                this.state = 'HALF-OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }

        try {
            const result = await this.fn(...args);
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failures++;
        this.lastFailure = Date.now();
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
}

// Usage example
const unreliable = async () => {
    if (Math.random() > 0.5) throw new Error("Random failure");
    return "success";
};

const breaker = new CircuitBreaker(unreliable, { failureThreshold: 2, resetTimeout: 1000 });


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 10: INTERVIEW QUESTIONS
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 10: INTERVIEW QUESTIONS ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON INTERVIEW QUESTIONS                                                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Q1: How do you handle errors in callbacks vs Promises vs async/await?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Callbacks: error-first pattern (err, result)
 *    Promises: .catch() method
 *    async/await: try/catch blocks
 *
 * Q2: What happens to unhandled Promise rejections?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Browser: Console warning, unhandledrejection event
 *    Node.js: Warning or crash (depending on version), unhandledRejection event
 *
 * Q3: How do you implement retry logic with exponential backoff?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Loop with try/catch, increase delay exponentially (baseDelay * 2^attempt)
 *
 * Q4: What is the Circuit Breaker pattern?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Prevents repeated calls to failing services. States: Closed, Open, Half-Open.
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
 *   │   ERROR HANDLING METHODS                                                    │
 *   │   ├── Callbacks: error-first pattern                                        │
 *   │   ├── Promises: .catch() at end of chain                                    │
 *   │   └── async/await: try/catch blocks                                         │
 *   │                                                                             │
 *   │   PATTERNS                                                                  │
 *   │   ├── Retry with exponential backoff                                        │
 *   │   ├── Fallback/graceful degradation                                         │
 *   │   ├── Timeout wrapping                                                      │
 *   │   ├── Circuit breaker                                                       │
 *   │   └── Error aggregation                                                     │
 *   │                                                                             │
 *   │   GLOBAL HANDLERS                                                           │
 *   │   ├── window.addEventListener('unhandledrejection')                         │
 *   │   └── process.on('unhandledRejection')                                      │
 *   │                                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══ FILE 5 COMPLETE ═══");
console.log("Run: node 06-parallel-sequential.js");
