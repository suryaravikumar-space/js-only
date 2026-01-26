/**
 * Answer 35: Implement Debounce and Throttle
 *
 * Essential for performance optimization:
 */

// ==================== DEBOUNCE ====================

// Basic Debounce
function debounce(fn, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// Debounce with immediate execution option
function debounceImmediate(fn, delay, immediate = false) {
    let timeoutId;

    return function (...args) {
        const callNow = immediate && !timeoutId;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            timeoutId = null;
            if (!immediate) {
                fn.apply(this, args);
            }
        }, delay);

        if (callNow) {
            fn.apply(this, args);
        }
    };
}

// Debounce with cancel
function debounceWithCancel(fn, delay) {
    let timeoutId;

    const debounced = function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };

    debounced.cancel = function () {
        clearTimeout(timeoutId);
    };

    return debounced;
}

// ==================== THROTTLE ====================

// Basic Throttle
function throttle(fn, limit) {
    let inThrottle = false;

    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Throttle with trailing call
function throttleWithTrailing(fn, limit) {
    let inThrottle = false;
    let lastArgs = null;

    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
                if (lastArgs) {
                    fn.apply(this, lastArgs);
                    lastArgs = null;
                }
            }, limit);
        } else {
            lastArgs = args;
        }
    };
}

// Throttle using timestamps
function throttleTimestamp(fn, limit) {
    let lastRun = 0;

    return function (...args) {
        const now = Date.now();

        if (now - lastRun >= limit) {
            fn.apply(this, args);
            lastRun = now;
        }
    };
}

// Throttle with cancel
function throttleWithCancel(fn, limit) {
    let inThrottle = false;
    let timeoutId;

    const throttled = function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;

            timeoutId = setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };

    throttled.cancel = function () {
        clearTimeout(timeoutId);
        inThrottle = false;
    };

    return throttled;
}

// ==================== DEMO ====================

// Simulated test (works in browser)
console.log("=== Debounce Demo ===");
let debounceCount = 0;
const debouncedFn = debounce(() => {
    debounceCount++;
    console.log(`Debounced function called: ${debounceCount}`);
}, 100);

// Simulate rapid calls
console.log("Calling 5 times rapidly...");
for (let i = 0; i < 5; i++) {
    debouncedFn();
}
// Only last call will execute after 100ms

console.log("\n=== Throttle Demo ===");
let throttleCount = 0;
const throttledFn = throttle(() => {
    throttleCount++;
    console.log(`Throttled function called: ${throttleCount}`);
}, 100);

// Immediate execution
throttledFn(); // Executes
throttledFn(); // Ignored
throttledFn(); // Ignored

// After 100ms, can execute again
setTimeout(() => {
    throttledFn(); // Executes
}, 150);

/**
 * Key Differences:
 * - Debounce: Waits until calls stop, then executes once
 * - Throttle: Executes immediately, then limits frequency
 *
 * Time Complexity: O(1) for both
 * Space Complexity: O(1) for both
 */
