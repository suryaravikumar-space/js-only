/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 5: REACTIVE PATTERNS IN JAVASCRIPT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Reactive programming is a paradigm focused on data streams and change
 * propagation. When data changes, everything that depends on it updates
 * automatically.
 *
 * INTERVIEW CONTEXT:
 * Reactive patterns are heavily used in modern frameworks like Vue, React,
 * and Angular. Understanding these patterns demonstrates knowledge of:
 * - State management
 * - Data flow architecture
 * - Performance optimization through fine-grained reactivity
 *
 * PATTERNS COVERED:
 * 1. Observable Pattern - Core reactive building block
 * 2. Reactive Signals - Fine-grained reactivity (like SolidJS)
 * 3. Computed Properties - Derived state
 * 4. Reactive Stores - State management
 * 5. Two-way Data Binding - Vue-style reactivity
 * 6. Flux Pattern - Unidirectional data flow
 * 7. Event Sourcing - State as event history
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 5: REACTIVE PATTERNS IN JAVASCRIPT");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │               REACTIVE PROGRAMMING FUNDAMENTALS                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   WHAT IS REACTIVE PROGRAMMING?                                         │
 * │   ══════════════════════════════                                        │
 * │                                                                          │
 * │   Reactive programming is about building systems that automatically     │
 * │   react to changes. Instead of manually updating dependent values,      │
 * │   the system tracks dependencies and propagates changes.                │
 * │                                                                          │
 * │   IMPERATIVE vs REACTIVE:                                               │
 * │   ─────────────────────────                                             │
 * │                                                                          │
 * │   // Imperative (manual updates)                                        │
 * │   let a = 5;                                                            │
 * │   let b = 10;                                                           │
 * │   let sum = a + b;  // 15                                              │
 * │   a = 20;                                                               │
 * │   // sum is still 15! Must manually update                             │
 * │   sum = a + b;  // Now 30                                              │
 * │                                                                          │
 * │   // Reactive (automatic updates)                                       │
 * │   const a = signal(5);                                                  │
 * │   const b = signal(10);                                                 │
 * │   const sum = computed(() => a.value + b.value);  // 15               │
 * │   a.value = 20;                                                         │
 * │   // sum.value is automatically 30!                                     │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐  │
 * │   │                  REACTIVE DATA FLOW                             │  │
 * │   │                                                                  │  │
 * │   │     ┌─────────┐                                                 │  │
 * │   │     │  State  │  ◄── Source of truth                           │  │
 * │   │     └────┬────┘                                                 │  │
 * │   │          │ changes                                              │  │
 * │   │          ▼                                                      │  │
 * │   │     ┌─────────────────────────┐                                 │  │
 * │   │     │   Reactive System       │                                 │  │
 * │   │     │   (tracks dependencies) │                                 │  │
 * │   │     └───────────┬─────────────┘                                 │  │
 * │   │          ┌──────┴──────┐                                        │  │
 * │   │          │             │                                        │  │
 * │   │          ▼             ▼                                        │  │
 * │   │     ┌─────────┐   ┌─────────┐                                   │  │
 * │   │     │Computed │   │  Effect │  ◄── Auto-updated                │  │
 * │   │     │ Values  │   │  (Side  │                                   │  │
 * │   │     │         │   │ Effects)│                                   │  │
 * │   │     └─────────┘   └─────────┘                                   │  │
 * │   │                                                                  │  │
 * │   └─────────────────────────────────────────────────────────────────┘  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 1: OBSERVABLE PATTERN                            ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    OBSERVABLE PATTERN                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  An Observable represents a stream of values over time. Observers       │
 * │  subscribe to receive these values and react when new data arrives.     │
 * │                                                                          │
 * │  WHY IT MATTERS (INTERVIEW):                                            │
 * │  • Foundation of RxJS (heavily used in Angular)                         │
 * │  • Handles async data streams elegantly                                 │
 * │  • Enables operators like map, filter, debounce on streams              │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   OBSERVABLE LIFECYCLE:                                         │    │
 * │  │                                                                  │    │
 * │  │   ┌──────────────┐                                              │    │
 * │  │   │   Producer   │  (data source: API, events, timer)          │    │
 * │  │   └──────┬───────┘                                              │    │
 * │  │          │                                                       │    │
 * │  │          ▼ emits                                                 │    │
 * │  │   ┌──────────────┐                                              │    │
 * │  │   │  Observable  │                                              │    │
 * │  │   │              │                                              │    │
 * │  │   │  subscribe() │──────┐                                       │    │
 * │  │   └──────────────┘      │                                       │    │
 * │  │                         ▼                                        │    │
 * │  │                  ┌─────────────┐                                 │    │
 * │  │                  │  Observer   │                                 │    │
 * │  │                  │             │                                 │    │
 * │  │                  │  next()     │ ◄── receives values            │    │
 * │  │                  │  error()    │ ◄── receives errors            │    │
 * │  │                  │  complete() │ ◄── stream ended               │    │
 * │  │                  └─────────────┘                                 │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  COMMON OBSERVABLE SOURCES:                                             │
 * │  • User events (clicks, key presses, form input)                        │
 * │  • HTTP responses                                                       │
 * │  • WebSocket messages                                                   │
 * │  • Timers and intervals                                                 │
 * │  • File system changes                                                  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// OBSERVABLE: Complete Implementation with Operators
// ═══════════════════════════════════════════════════════════════════════════

class Observable {
    /**
     * Creates an Observable from a subscriber function.
     *
     * The subscriber function receives an observer object with:
     * - next(value): Emit a value to subscribers
     * - error(err): Emit an error and stop
     * - complete(): Signal completion
     *
     * @param {Function} subscriber - Function that produces values
     */
    constructor(subscriber) {
        this._subscriber = subscriber;
    }

    /**
     * Subscribe to this Observable to receive values.
     *
     * @param {Object|Function} observerOrNext - Observer object or next function
     * @returns {Object} Subscription with unsubscribe method
     */
    subscribe(observerOrNext) {
        // Normalize observer (can be function or object)
        const observer = typeof observerOrNext === "function"
            ? { next: observerOrNext, error: () => {}, complete: () => {} }
            : { next: () => {}, error: () => {}, complete: () => {}, ...observerOrNext };

        let isUnsubscribed = false;

        // Create safe observer that checks unsubscribe status
        const safeObserver = {
            next: (value) => !isUnsubscribed && observer.next(value),
            error: (err) => !isUnsubscribed && observer.error(err),
            complete: () => !isUnsubscribed && observer.complete()
        };

        // Execute subscriber and get cleanup function
        const cleanup = this._subscriber(safeObserver);

        // Return subscription object
        return {
            unsubscribe: () => {
                isUnsubscribed = true;
                if (typeof cleanup === "function") cleanup();
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // OPERATORS: Transform and combine observables
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Transform each value emitted by the Observable.
     *
     * Example: numbers$.map(x => x * 2)
     * Input:  1, 2, 3
     * Output: 2, 4, 6
     */
    map(transform) {
        return new Observable(observer => {
            const subscription = this.subscribe({
                next: (value) => observer.next(transform(value)),
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            });
            return () => subscription.unsubscribe();
        });
    }

    /**
     * Filter values based on a predicate function.
     *
     * Example: numbers$.filter(x => x > 2)
     * Input:  1, 2, 3, 4
     * Output: 3, 4
     */
    filter(predicate) {
        return new Observable(observer => {
            const subscription = this.subscribe({
                next: (value) => predicate(value) && observer.next(value),
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            });
            return () => subscription.unsubscribe();
        });
    }

    /**
     * Take only the first n values then complete.
     *
     * Example: numbers$.take(3)
     * Input:  1, 2, 3, 4, 5
     * Output: 1, 2, 3 (complete)
     */
    take(count) {
        return new Observable(observer => {
            let taken = 0;
            const subscription = this.subscribe({
                next: (value) => {
                    if (taken < count) {
                        taken++;
                        observer.next(value);
                        if (taken === count) observer.complete();
                    }
                },
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            });
            return () => subscription.unsubscribe();
        });
    }

    /**
     * Debounce: Only emit after silence for given duration.
     *
     * Useful for: Search input, resize events
     */
    debounce(ms) {
        return new Observable(observer => {
            let timeoutId;
            const subscription = this.subscribe({
                next: (value) => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => observer.next(value), ms);
                },
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            });
            return () => {
                clearTimeout(timeoutId);
                subscription.unsubscribe();
            };
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STATIC CREATION METHODS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Create Observable from array/iterable.
     */
    static from(iterable) {
        return new Observable(observer => {
            for (const value of iterable) {
                observer.next(value);
            }
            observer.complete();
        });
    }

    /**
     * Create Observable that emits values at interval.
     */
    static interval(ms) {
        return new Observable(observer => {
            let count = 0;
            const id = setInterval(() => observer.next(count++), ms);
            return () => clearInterval(id);
        });
    }

    /**
     * Create Observable from DOM event.
     */
    static fromEvent(element, eventName) {
        return new Observable(observer => {
            const handler = (e) => observer.next(e);
            element.addEventListener(eventName, handler);
            return () => element.removeEventListener(eventName, handler);
        });
    }

    /**
     * Create Observable from Promise.
     */
    static fromPromise(promise) {
        return new Observable(observer => {
            promise
                .then(value => {
                    observer.next(value);
                    observer.complete();
                })
                .catch(err => observer.error(err));
        });
    }
}

console.log("Observable Pattern - Implementation:");

// Example 1: Basic subscription
console.log("\n  Example 1: Basic Observable");
const numbers$ = Observable.from([1, 2, 3, 4, 5]);
numbers$
    .map(x => x * 2)
    .filter(x => x > 4)
    .subscribe({
        next: (value) => console.log(`    Received: ${value}`),
        complete: () => console.log("    Complete!")
    });

// Example 2: Interval with take
console.log("\n  Example 2: Interval (first 3 values)");
const interval$ = Observable.interval(100).take(3);
interval$.subscribe({
    next: (value) => console.log(`    Tick: ${value}`),
    complete: () => console.log("    Interval complete!")
});

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              OBSERVABLE: INTERVIEW EXPLANATION                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  "An Observable is a lazy push collection. Unlike Promises which        │
 * │   execute immediately, Observables only execute when subscribed to.     │
 * │   They can emit multiple values over time and support operators like    │
 * │   map, filter, and debounce.                                            │
 * │                                                                          │
 * │   Key differences from Promises:                                        │
 * │   • Lazy vs Eager execution                                             │
 * │   • Multiple values vs Single value                                     │
 * │   • Cancellable via unsubscribe vs Cannot cancel                        │
 * │   • Rich operator support vs Limited chaining                           │
 * │                                                                          │
 * │   Real-world uses: Search-as-you-type, real-time dashboards,           │
 * │   handling user input events, WebSocket communication."                 │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 2: REACTIVE SIGNALS                              ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    REACTIVE SIGNALS                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  Signals are reactive primitives that hold a value and notify           │
 * │  subscribers when that value changes. They form the foundation          │
 * │  of fine-grained reactivity in frameworks like SolidJS.                 │
 * │                                                                          │
 * │  WHY SIGNALS MATTER (INTERVIEW):                                        │
 * │  • More efficient than virtual DOM diffing                              │
 * │  • Automatic dependency tracking                                         │
 * │  • No need for useEffect dependency arrays                              │
 * │  • Now being adopted by Angular, Preact, and others                     │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   SIGNAL ARCHITECTURE:                                          │    │
 * │  │                                                                  │    │
 * │  │        ┌─────────────┐                                          │    │
 * │  │        │   Signal    │                                          │    │
 * │  │        │  (count=0)  │                                          │    │
 * │  │        └──────┬──────┘                                          │    │
 * │  │               │                                                  │    │
 * │  │    READ       │ value    WRITE                                   │    │
 * │  │   ┌───────────┴───────────┐                                     │    │
 * │  │   │                       │                                     │    │
 * │  │   ▼                       ▼                                     │    │
 * │  │ count.value            count.value = 5                          │    │
 * │  │   │                       │                                     │    │
 * │  │   │ (tracked)             │ (notifies)                          │    │
 * │  │   ▼                       ▼                                     │    │
 * │  │ ┌─────────────────────────────────────┐                         │    │
 * │  │ │           Dependencies              │                         │    │
 * │  │ │                                     │                         │    │
 * │  │ │  computed(() => count.value * 2)   │ ◄── Auto-updates        │    │
 * │  │ │  effect(() => console.log(count))  │ ◄── Auto-runs           │    │
 * │  │ │                                     │                         │    │
 * │  │ └─────────────────────────────────────┘                         │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  COMPARISON: REACT vs SIGNALS                                           │
 * │  ═════════════════════════════                                          │
 * │                                                                          │
 * │  React (coarse-grained):                                                │
 * │  • Component re-renders entirely when state changes                     │
 * │  • Virtual DOM diff to find actual changes                              │
 * │  • useEffect needs explicit dependency array                            │
 * │                                                                          │
 * │  Signals (fine-grained):                                                │
 * │  • Only affected parts update                                           │
 * │  • No virtual DOM needed                                                │
 * │  • Dependencies tracked automatically                                    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// SIGNALS: Implementation with Auto-tracking
// ═══════════════════════════════════════════════════════════════════════════

// Global tracking for automatic dependency collection
let currentEffect = null;
const effectStack = [];

/**
 * Signal: A reactive value container.
 *
 * When read inside an effect or computed, the signal tracks that
 * dependency automatically. When written, it notifies all dependents.
 */
function createSignal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    // Getter function (read access)
    const read = () => {
        // Track dependency if inside an effect
        if (currentEffect) {
            subscribers.add(currentEffect);
        }
        return value;
    };

    // Setter function (write access)
    const write = (newValue) => {
        // Support function updater pattern
        if (typeof newValue === "function") {
            newValue = newValue(value);
        }

        // Only update if value changed
        if (value !== newValue) {
            value = newValue;
            // Notify all dependents
            subscribers.forEach(effect => effect());
        }
    };

    return [read, write];
}

/**
 * Effect: A side effect that auto-tracks its dependencies.
 *
 * The effect function is run immediately, and any signals read
 * during execution are tracked. When those signals change,
 * the effect re-runs automatically.
 */
function createEffect(fn) {
    const effect = () => {
        // Push to stack for nested effects
        effectStack.push(effect);
        currentEffect = effect;

        try {
            fn();
        } finally {
            // Pop from stack
            effectStack.pop();
            currentEffect = effectStack[effectStack.length - 1] || null;
        }
    };

    // Run immediately to track dependencies
    effect();

    return effect;
}

/**
 * Computed: A derived signal that automatically updates.
 *
 * The compute function is like an effect that returns a value.
 * It's lazy - only recomputes when its dependencies change AND
 * when the value is read.
 */
function createComputed(fn) {
    let cachedValue;
    let dirty = true;
    const subscribers = new Set();

    // Create internal effect to track dependencies
    createEffect(() => {
        if (dirty) {
            cachedValue = fn();
            dirty = false;
        }
    });

    // Mark as dirty when dependencies change (via internal effect)
    const originalFn = fn;
    fn = () => {
        dirty = true;
        subscribers.forEach(effect => effect());
        return originalFn();
    };

    // Return read-only signal
    return () => {
        if (currentEffect) {
            subscribers.add(currentEffect);
        }
        return cachedValue;
    };
}

console.log("Reactive Signals - Implementation:");

// Example: Counter with derived state
console.log("\n  Example: Reactive Counter");

const [count, setCount] = createSignal(0);
const [multiplier, setMultiplier] = createSignal(2);

// This effect auto-tracks count() and multiplier()
createEffect(() => {
    console.log(`    Count: ${count()}, Multiplied: ${count() * multiplier()}`);
});

console.log("  Setting count to 5:");
setCount(5);

console.log("  Setting multiplier to 3:");
setMultiplier(3);

console.log("  Using updater function:");
setCount(c => c + 1);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              SIGNALS: INTERVIEW EXPLANATION                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  "Signals provide fine-grained reactivity by tracking dependencies      │
 * │   automatically. When you read a signal inside an effect or computed,   │
 * │   it records that dependency. When the signal changes, only the         │
 * │   specific effects that depend on it re-run.                            │
 * │                                                                          │
 * │   This is more efficient than React's approach because:                 │
 * │   1. No virtual DOM diffing needed                                      │
 * │   2. Updates are surgically precise                                     │
 * │   3. No stale closure issues                                            │
 * │   4. Dependencies are tracked at runtime, not declared                  │
 * │                                                                          │
 * │   Frameworks using signals: SolidJS, Preact Signals, Angular Signals,  │
 * │   Vue's Composition API (similar concept with ref/reactive)."           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 3: REACTIVE STORE                                ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    REACTIVE STORE                                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  A centralized state container that provides reactive access to         │
 * │  application state. All state changes flow through the store.           │
 * │                                                                          │
 * │  WHY STORES MATTER (INTERVIEW):                                         │
 * │  • Single source of truth                                               │
 * │  • Predictable state updates                                            │
 * │  • Time-travel debugging                                                │
 * │  • Easy state persistence                                               │
 * │                                                                          │
 * │  POPULAR IMPLEMENTATIONS:                                               │
 * │  • Redux (React)                                                        │
 * │  • Vuex/Pinia (Vue)                                                     │
 * │  • MobX (React/Vue)                                                     │
 * │  • Zustand (React)                                                      │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │                    STORE ARCHITECTURE                           │    │
 * │  │                                                                  │    │
 * │  │   ┌──────────────────────────────────────────────────────┐      │    │
 * │  │   │                     STORE                             │      │    │
 * │  │   │                                                       │      │    │
 * │  │   │  ┌─────────────────────────────────────────────────┐ │      │    │
 * │  │   │  │                  STATE                          │ │      │    │
 * │  │   │  │  { users: [], cart: [], auth: null }           │ │      │    │
 * │  │   │  └─────────────────────────────────────────────────┘ │      │    │
 * │  │   │                                                       │      │    │
 * │  │   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │      │    │
 * │  │   │  │   ACTIONS   │  │   GETTERS   │  │ MUTATIONS   │  │      │    │
 * │  │   │  │  (async)    │  │  (computed) │  │  (sync)     │  │      │    │
 * │  │   │  └─────────────┘  └─────────────┘  └─────────────┘  │      │    │
 * │  │   │                                                       │      │    │
 * │  │   └───────────────────────────────────────────────────────┘      │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// REACTIVE STORE: Full Implementation
// ═══════════════════════════════════════════════════════════════════════════

class ReactiveStore {
    /**
     * Creates a new reactive store.
     *
     * @param {Object} options - Store configuration
     * @param {Object} options.state - Initial state
     * @param {Object} options.mutations - Synchronous state modifiers
     * @param {Object} options.actions - Async operations
     * @param {Object} options.getters - Computed values
     */
    constructor({ state = {}, mutations = {}, actions = {}, getters = {} }) {
        this._state = this._makeReactive(state);
        this._mutations = mutations;
        this._actions = actions;
        this._getters = {};
        this._subscribers = [];

        // Setup getters
        Object.keys(getters).forEach(key => {
            Object.defineProperty(this._getters, key, {
                get: () => getters[key](this._state),
                enumerable: true
            });
        });
    }

    /**
     * Make an object reactive using Proxy.
     * Any changes trigger subscriber notifications.
     */
    _makeReactive(obj) {
        const store = this;

        return new Proxy(obj, {
            get(target, key) {
                const value = target[key];
                // Recursively make nested objects reactive
                if (value && typeof value === "object") {
                    return store._makeReactive(value);
                }
                return value;
            },
            set(target, key, value) {
                const oldValue = target[key];
                target[key] = value;

                // Notify subscribers on change
                if (oldValue !== value) {
                    store._notify({ key, oldValue, newValue: value });
                }
                return true;
            }
        });
    }

    /**
     * Get current state (read-only snapshot).
     */
    get state() {
        return this._state;
    }

    /**
     * Get computed getters.
     */
    get getters() {
        return this._getters;
    }

    /**
     * Commit a mutation to change state.
     * Mutations must be synchronous.
     *
     * @param {string} type - Mutation name
     * @param {*} payload - Data to pass to mutation
     */
    commit(type, payload) {
        const mutation = this._mutations[type];
        if (!mutation) {
            throw new Error(`Unknown mutation: ${type}`);
        }
        mutation(this._state, payload);
    }

    /**
     * Dispatch an action.
     * Actions can be async and commit mutations.
     *
     * @param {string} type - Action name
     * @param {*} payload - Data to pass to action
     * @returns {Promise}
     */
    async dispatch(type, payload) {
        const action = this._actions[type];
        if (!action) {
            throw new Error(`Unknown action: ${type}`);
        }

        // Provide context to action
        const context = {
            state: this._state,
            getters: this._getters,
            commit: this.commit.bind(this),
            dispatch: this.dispatch.bind(this)
        };

        return await action(context, payload);
    }

    /**
     * Subscribe to state changes.
     *
     * @param {Function} callback - Called on every state change
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this._subscribers.push(callback);
        return () => {
            const index = this._subscribers.indexOf(callback);
            if (index > -1) this._subscribers.splice(index, 1);
        };
    }

    _notify(mutation) {
        this._subscribers.forEach(callback => callback(mutation, this._state));
    }
}

console.log("Reactive Store - Implementation:");

// Create store
const store = new ReactiveStore({
    state: {
        todos: [],
        filter: "all"
    },

    mutations: {
        ADD_TODO(state, text) {
            state.todos.push({
                id: Date.now(),
                text,
                completed: false
            });
        },
        TOGGLE_TODO(state, id) {
            const todo = state.todos.find(t => t.id === id);
            if (todo) todo.completed = !todo.completed;
        },
        SET_FILTER(state, filter) {
            state.filter = filter;
        }
    },

    actions: {
        async addTodoAsync({ commit }, text) {
            // Simulate API call
            await new Promise(r => setTimeout(r, 100));
            commit("ADD_TODO", text);
            return { success: true };
        }
    },

    getters: {
        completedTodos: (state) => state.todos.filter(t => t.completed),
        pendingTodos: (state) => state.todos.filter(t => !t.completed),
        todoCount: (state) => state.todos.length
    }
});

// Subscribe to changes
store.subscribe((mutation, state) => {
    console.log(`    [Store] Mutation: ${mutation.key} changed`);
});

// Use the store
console.log("\n  Adding todos:");
store.commit("ADD_TODO", "Learn Reactive Patterns");
store.commit("ADD_TODO", "Build an App");

console.log("  Todos:", store.state.todos.map(t => t.text));
console.log("  Count getter:", store.getters.todoCount);

console.log("\n  Toggling first todo:");
store.commit("TOGGLE_TODO", store.state.todos[0].id);
console.log("  Completed:", store.getters.completedTodos.map(t => t.text));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 4: FLUX PATTERN                                  ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                      FLUX PATTERN                                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  Flux is an architectural pattern for unidirectional data flow.         │
 * │  Data flows in one direction: Action → Dispatcher → Store → View        │
 * │                                                                          │
 * │  WHY FLUX MATTERS (INTERVIEW):                                          │
 * │  • Predictable state management                                         │
 * │  • Easier debugging (data flows one way)                                │
 * │  • Foundation for Redux                                                 │
 * │  • Solves cascading update problems                                     │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │                     FLUX DATA FLOW                              │    │
 * │  │                                                                  │    │
 * │  │   ┌────────────────────────────────────────────────────────┐   │    │
 * │  │   │                                                        │   │    │
 * │  │   │         ┌──────────┐      ┌────────────┐              │   │    │
 * │  │   │         │  ACTION  │─────►│ DISPATCHER │              │   │    │
 * │  │   │         └──────────┘      └─────┬──────┘              │   │    │
 * │  │   │              ▲                  │                      │   │    │
 * │  │   │              │                  ▼                      │   │    │
 * │  │   │         ┌────┴─────┐      ┌──────────┐                │   │    │
 * │  │   │         │   VIEW   │◄─────│  STORE   │                │   │    │
 * │  │   │         │  (React) │      │  (State) │                │   │    │
 * │  │   │         └──────────┘      └──────────┘                │   │    │
 * │  │   │                                                        │   │    │
 * │  │   └────────────────────────────────────────────────────────┘   │    │
 * │  │                                                                  │    │
 * │  │   FLOW EXPLAINED:                                               │    │
 * │  │   1. View dispatches Action (user clicks button)                │    │
 * │  │   2. Dispatcher sends Action to all Stores                      │    │
 * │  │   3. Store updates state and emits change                       │    │
 * │  │   4. View re-renders with new state                             │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  FLUX vs MVC:                                                           │
 * │  ════════════                                                           │
 * │  MVC: Bidirectional - Models and Views can update each other           │
 * │  Flux: Unidirectional - Data flows in one direction only               │
 * │                                                                          │
 * │  This prevents the "cascading updates" problem where one change        │
 * │  triggers another, which triggers another, making bugs hard to track.  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// FLUX: Complete Implementation
// ═══════════════════════════════════════════════════════════════════════════

// Dispatcher: Central hub that receives actions and routes to stores
class Dispatcher {
    constructor() {
        this._callbacks = new Map();
        this._lastId = 0;
    }

    /**
     * Register a callback to receive all dispatched actions.
     * @returns {string} Token to identify this callback
     */
    register(callback) {
        const id = `callback_${++this._lastId}`;
        this._callbacks.set(id, callback);
        return id;
    }

    /**
     * Unregister a callback.
     */
    unregister(id) {
        this._callbacks.delete(id);
    }

    /**
     * Dispatch an action to all registered callbacks.
     */
    dispatch(action) {
        if (!action.type) {
            throw new Error("Actions must have a type property");
        }
        console.log(`    [Dispatcher] Dispatching: ${action.type}`);
        this._callbacks.forEach(callback => callback(action));
    }
}

// FluxStore: Holds state and responds to actions
class FluxStore {
    constructor(dispatcher) {
        this._state = {};
        this._listeners = [];

        // Register with dispatcher
        this._dispatchToken = dispatcher.register(this._handleAction.bind(this));
    }

    _handleAction(action) {
        // Override in subclass
    }

    getState() {
        return { ...this._state };
    }

    addListener(callback) {
        this._listeners.push(callback);
        return () => {
            const index = this._listeners.indexOf(callback);
            if (index > -1) this._listeners.splice(index, 1);
        };
    }

    _emitChange() {
        this._listeners.forEach(callback => callback(this._state));
    }
}

console.log("Flux Pattern - Implementation:");

// Create dispatcher
const appDispatcher = new Dispatcher();

// Create store
class TodoStore extends FluxStore {
    constructor(dispatcher) {
        super(dispatcher);
        this._state = { items: [] };
    }

    _handleAction(action) {
        switch (action.type) {
            case "ADD_ITEM":
                this._state.items = [...this._state.items, {
                    id: Date.now(),
                    text: action.payload,
                    done: false
                }];
                console.log(`    [TodoStore] Added item: ${action.payload}`);
                this._emitChange();
                break;

            case "REMOVE_ITEM":
                this._state.items = this._state.items.filter(
                    item => item.id !== action.payload
                );
                console.log(`    [TodoStore] Removed item: ${action.payload}`);
                this._emitChange();
                break;
        }
    }

    getItems() {
        return this._state.items;
    }
}

const todoStore = new TodoStore(appDispatcher);

// Subscribe to changes (simulating View)
todoStore.addListener((state) => {
    console.log(`    [View] Updated! Items: ${state.items.length}`);
});

// Dispatch actions
console.log("\n  Dispatching ADD_ITEM:");
appDispatcher.dispatch({ type: "ADD_ITEM", payload: "Learn Flux" });

console.log("\n  Dispatching ADD_ITEM:");
appDispatcher.dispatch({ type: "ADD_ITEM", payload: "Build App" });

console.log("\n  Current state:", todoStore.getItems());

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 5: EVENT SOURCING                                ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    EVENT SOURCING                                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  Instead of storing current state, store the sequence of events         │
 * │  that led to that state. Current state is derived by replaying events.  │
 * │                                                                          │
 * │  WHY EVENT SOURCING MATTERS (INTERVIEW):                                │
 * │  • Complete audit trail of all changes                                  │
 * │  • Time-travel debugging                                                │
 * │  • Replay events to rebuild state                                       │
 * │  • Excellent for financial/compliance systems                           │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   TRADITIONAL:              EVENT SOURCING:                     │    │
 * │  │                                                                  │    │
 * │  │   ┌────────────┐           ┌────────────────────────────────┐  │    │
 * │  │   │  balance:  │           │  Event Log:                    │  │    │
 * │  │   │   $150     │           │  ─────────────────────────────  │  │    │
 * │  │   └────────────┘           │  1. DEPOSIT $100  (t=0)        │  │    │
 * │  │                            │  2. DEPOSIT $75   (t=1)        │  │    │
 * │  │   (What happened?          │  3. WITHDRAW $25  (t=2)        │  │    │
 * │  │    We don't know!)         │  ─────────────────────────────  │  │    │
 * │  │                            │  Current: $150                  │  │    │
 * │  │                            │  (Derived from events)          │  │    │
 * │  │                            └────────────────────────────────┘  │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  BENEFITS:                                                              │
 * │  • Can rebuild state at any point in time                               │
 * │  • Natural undo/redo                                                    │
 * │  • Debugging: see exact sequence of events                              │
 * │  • Analytics: query the event history                                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// EVENT SOURCING: Bank Account Example
// ═══════════════════════════════════════════════════════════════════════════

class EventSourcedBankAccount {
    constructor(accountId) {
        this.accountId = accountId;
        this.events = [];        // Event log (append-only)
        this.version = 0;        // Current version
        this._balance = 0;       // Derived state
    }

    /**
     * Apply an event and record it.
     */
    _apply(event) {
        // Record event
        const recordedEvent = {
            ...event,
            accountId: this.accountId,
            timestamp: Date.now(),
            version: ++this.version
        };
        this.events.push(recordedEvent);

        // Update derived state
        this._updateState(recordedEvent);

        console.log(`    [Event ${this.version}] ${event.type}: $${event.amount || 0}`);
    }

    /**
     * Update state based on event type.
     */
    _updateState(event) {
        switch (event.type) {
            case "ACCOUNT_OPENED":
                this._balance = event.initialBalance || 0;
                break;
            case "MONEY_DEPOSITED":
                this._balance += event.amount;
                break;
            case "MONEY_WITHDRAWN":
                this._balance -= event.amount;
                break;
        }
    }

    // Commands (business operations)
    open(initialBalance = 0) {
        this._apply({ type: "ACCOUNT_OPENED", initialBalance });
    }

    deposit(amount) {
        if (amount <= 0) throw new Error("Amount must be positive");
        this._apply({ type: "MONEY_DEPOSITED", amount });
    }

    withdraw(amount) {
        if (amount <= 0) throw new Error("Amount must be positive");
        if (amount > this._balance) throw new Error("Insufficient funds");
        this._apply({ type: "MONEY_WITHDRAWN", amount });
    }

    // Queries
    get balance() {
        return this._balance;
    }

    getHistory() {
        return this.events.map(e => ({
            type: e.type,
            amount: e.amount || e.initialBalance,
            timestamp: new Date(e.timestamp).toISOString()
        }));
    }

    /**
     * Rebuild state from event log.
     * Useful for loading from persistence or time-travel.
     */
    static fromEvents(accountId, events) {
        const account = new EventSourcedBankAccount(accountId);
        events.forEach(event => {
            account.events.push(event);
            account._updateState(event);
            account.version = event.version;
        });
        return account;
    }

    /**
     * Get state at specific version (time-travel).
     */
    getStateAtVersion(targetVersion) {
        let balance = 0;
        for (const event of this.events) {
            if (event.version > targetVersion) break;

            switch (event.type) {
                case "ACCOUNT_OPENED":
                    balance = event.initialBalance || 0;
                    break;
                case "MONEY_DEPOSITED":
                    balance += event.amount;
                    break;
                case "MONEY_WITHDRAWN":
                    balance -= event.amount;
                    break;
            }
        }
        return { balance };
    }
}

console.log("Event Sourcing - Bank Account:");

const account = new EventSourcedBankAccount("ACC-001");
account.open(100);
account.deposit(50);
account.deposit(25);
account.withdraw(30);

console.log(`\n  Current balance: $${account.balance}`);
console.log("  Balance at version 2:", account.getStateAtVersion(2));
console.log("  Event history:", account.getHistory().length, "events");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          REACTIVE PATTERNS SUMMARY                             ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 REACTIVE PATTERNS COMPARISON                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PATTERN         │ USE WHEN                     │ FRAMEWORKS            │
 * │  ════════════════│══════════════════════════════│══════════════════════ │
 * │                  │                              │                       │
 * │  Observable      │ Async streams,               │ RxJS, Angular         │
 * │                  │ event handling               │                       │
 * │                  │                              │                       │
 * │  Signals         │ Fine-grained reactivity,     │ SolidJS, Preact,      │
 * │                  │ performance-critical UIs     │ Angular Signals       │
 * │                  │                              │                       │
 * │  Reactive Store  │ Centralized state,           │ Redux, Vuex,          │
 * │                  │ complex apps                 │ Pinia, Zustand        │
 * │                  │                              │                       │
 * │  Flux            │ Unidirectional flow,         │ Flux, Redux           │
 * │                  │ predictable state            │                       │
 * │                  │                              │                       │
 * │  Event Sourcing  │ Audit trails,                │ Backend systems,      │
 * │                  │ time-travel, analytics       │ Financial apps        │
 * │                  │                              │                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 * │                                                                          │
 * │  INTERVIEW KEY POINTS:                                                  │
 * │  ═════════════════════                                                  │
 * │                                                                          │
 * │  1. Reactivity = automatic updates when data changes                    │
 * │  2. Observables handle streams, Signals handle values                   │
 * │  3. Flux/Redux ensure predictable state via unidirectional flow         │
 * │  4. Event sourcing stores events, not state                             │
 * │  5. Fine-grained reactivity (Signals) > Virtual DOM (React) for perf   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Reactive Patterns Summary:");
console.log("  1. Observable - Stream processing with operators");
console.log("  2. Signals - Fine-grained dependency tracking");
console.log("  3. Reactive Store - Centralized state container");
console.log("  4. Flux - Unidirectional data flow");
console.log("  5. Event Sourcing - State as event history\n");

console.log("═══ FILE 5 COMPLETE ═══");
console.log("Run: node 06-architectural-patterns.js");
