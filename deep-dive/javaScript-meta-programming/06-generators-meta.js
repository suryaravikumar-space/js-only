/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT META-PROGRAMMING - Generators & Iterators Meta
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Advanced generator and iterator patterns for meta-programming,
 * including custom iterables, async iteration, and generator composition.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ITERATION PROTOCOL                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ITERABLE PROTOCOL:                ITERATOR PROTOCOL:                  │
 * │   ══════════════════                ══════════════════                   │
 * │                                                                          │
 * │   An object is iterable if it       An object is an iterator if it      │
 * │   has [Symbol.iterator] method      has a next() method returning       │
 * │   that returns an iterator.         { value, done }.                    │
 * │                                                                          │
 * │   ┌───────────────────┐             ┌───────────────────┐               │
 * │   │     Iterable      │             │     Iterator      │               │
 * │   ├───────────────────┤             ├───────────────────┤               │
 * │   │ [Symbol.iterator] │────────────►│     next()        │               │
 * │   │   () => Iterator  │             │ () => { value,    │               │
 * │   └───────────────────┘             │         done }    │               │
 * │                                     └───────────────────┘               │
 * │                                                                          │
 * │   Consumed by:                      Returns:                            │
 * │   • for...of                        • { value: any, done: false }       │
 * │   • spread operator                 • { done: true }                    │
 * │   • Array.from()                                                        │
 * │   • destructuring                                                       │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           GENERATORS & ITERATORS META");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Custom Iterable Objects
// ============================================================================
console.log("─── Custom Iterable Objects ───\n");

// Method 1: Direct Iterator Implementation
const range1 = {
    start: 1,
    end: 5,

    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;

        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
};

console.log("Direct iterator:", [...range1]);

// Method 2: Generator-based
const range2 = {
    start: 1,
    end: 5,

    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end; i++) {
            yield i;
        }
    }
};

console.log("Generator-based:", [...range2]);
console.log("");

// ============================================================================
// Reusable Range Factory
// ============================================================================
console.log("─── Reusable Range Factory ───\n");

function* range(start, end, step = 1) {
    if (step > 0) {
        for (let i = start; i <= end; i += step) {
            yield i;
        }
    } else {
        for (let i = start; i >= end; i += step) {
            yield i;
        }
    }
}

console.log("range(1, 10, 2):", [...range(1, 10, 2)]);
console.log("range(5, 1, -1):", [...range(5, 1, -1)]);
console.log("");

// ============================================================================
// Infinite Sequences
// ============================================================================
console.log("─── Infinite Sequences ───\n");

function* naturals() {
    let n = 1;
    while (true) {
        yield n++;
    }
}

function* fibonacci() {
    let [a, b] = [0, 1];
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

function* primes() {
    const isPrime = n => {
        for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) return false;
        }
        return n > 1;
    };

    let n = 2;
    while (true) {
        if (isPrime(n)) yield n;
        n++;
    }
}

// Take n items from infinite generator
function take(n, generator) {
    const result = [];
    for (const value of generator) {
        if (result.length >= n) break;
        result.push(value);
    }
    return result;
}

console.log("First 10 naturals:", take(10, naturals()));
console.log("First 10 fibonacci:", take(10, fibonacci()));
console.log("First 10 primes:", take(10, primes()));
console.log("");

// ============================================================================
// Generator Utilities
// ============================================================================
console.log("─── Generator Utilities ───\n");

// Map over generator
function* map(gen, fn) {
    for (const value of gen) {
        yield fn(value);
    }
}

// Filter generator
function* filter(gen, predicate) {
    for (const value of gen) {
        if (predicate(value)) yield value;
    }
}

// Zip generators
function* zip(...gens) {
    const iterators = gens.map(g => g[Symbol.iterator]());

    while (true) {
        const results = iterators.map(it => it.next());
        if (results.some(r => r.done)) break;
        yield results.map(r => r.value);
    }
}

// Chain generators
function* chain(...gens) {
    for (const gen of gens) {
        yield* gen;
    }
}

// Flatten generator
function* flatten(gen, depth = 1) {
    for (const value of gen) {
        if (depth > 0 && value[Symbol.iterator]) {
            yield* flatten(value, depth - 1);
        } else {
            yield value;
        }
    }
}

const doubled = map(range(1, 5), x => x * 2);
console.log("map(range, x=>x*2):", [...doubled]);

const evens = filter(range(1, 10), x => x % 2 === 0);
console.log("filter(range, even):", [...evens]);

const zipped = zip(range(1, 3), ['a', 'b', 'c']);
console.log("zip(nums, letters):", [...zipped]);

const chained = chain([1, 2], [3, 4], [5]);
console.log("chain([1,2],[3,4],[5]):", [...chained]);
console.log("");

// ============================================================================
// Async Iterators
// ============================================================================
console.log("─── Async Iterators ───\n");

// Async generator
async function* asyncRange(start, end, delay = 100) {
    for (let i = start; i <= end; i++) {
        await new Promise(r => setTimeout(r, delay));
        yield i;
    }
}

// Async iterable object
const asyncDataSource = {
    data: [1, 2, 3, 4, 5],

    async *[Symbol.asyncIterator]() {
        for (const item of this.data) {
            await new Promise(r => setTimeout(r, 50));
            yield item;
        }
    }
};

// Consuming async iterables
async function consumeAsync() {
    console.log("Consuming async generator:");
    for await (const num of asyncRange(1, 3, 10)) {
        console.log("  Got:", num);
    }
}

consumeAsync();

// Async generator utilities
async function* asyncMap(asyncGen, fn) {
    for await (const value of asyncGen) {
        yield await fn(value);
    }
}

async function* asyncFilter(asyncGen, predicate) {
    for await (const value of asyncGen) {
        if (await predicate(value)) {
            yield value;
        }
    }
}

console.log("Async iteration patterns defined");
console.log("");

// ============================================================================
// Generator Communication
// ============================================================================
console.log("─── Generator Communication ───\n");

// Two-way communication with next(value)
function* twoWay() {
    const a = yield 'First yield';
    console.log('  Received:', a);

    const b = yield 'Second yield';
    console.log('  Received:', b);

    return 'Done';
}

const gen = twoWay();
console.log("gen.next():", gen.next());
console.log("gen.next('Hello'):", gen.next('Hello'));
console.log("gen.next('World'):", gen.next('World'));
console.log("");

// Generator as state machine
function* trafficLight() {
    while (true) {
        yield 'green';
        yield 'yellow';
        yield 'red';
    }
}

const light = trafficLight();
console.log("Traffic light:");
console.log("  ", light.next().value);
console.log("  ", light.next().value);
console.log("  ", light.next().value);
console.log("  ", light.next().value);
console.log("");

// ============================================================================
// Generator Delegation (yield*)
// ============================================================================
console.log("─── Generator Delegation (yield*) ───\n");

function* inner() {
    yield 'A';
    yield 'B';
    return 'inner done';
}

function* outer() {
    yield 'Before';
    const innerResult = yield* inner();  // Delegates to inner
    console.log('  Inner returned:', innerResult);
    yield 'After';
}

console.log("Delegation:", [...outer()]);

// Recursive delegation (tree traversal)
function* traverseTree(node) {
    yield node.value;
    for (const child of node.children || []) {
        yield* traverseTree(child);
    }
}

const tree = {
    value: 1,
    children: [
        { value: 2, children: [{ value: 4 }, { value: 5 }] },
        { value: 3, children: [{ value: 6 }] }
    ]
};

console.log("Tree traversal:", [...traverseTree(tree)]);
console.log("");

// ============================================================================
// Coroutines Pattern
// ============================================================================
console.log("─── Coroutines Pattern ───\n");

function coroutine(generatorFn) {
    const gen = generatorFn();
    gen.next();  // Start generator
    return (value) => gen.next(value);
}

const dataProcessor = coroutine(function* () {
    let total = 0;
    let count = 0;

    while (true) {
        const value = yield;
        if (value === null) break;
        total += value;
        count++;
        console.log(`  Running average: ${(total / count).toFixed(2)}`);
    }

    return total / count;
});

console.log("Sending values to coroutine:");
dataProcessor(10);
dataProcessor(20);
dataProcessor(30);
console.log("");

// ============================================================================
// Iterator Helpers (Proposal)
// ============================================================================
console.log("─── Iterator Helpers (Stage 3 Proposal) ───\n");

// Polyfill-style implementations
class IteratorHelper {
    constructor(iterator) {
        this.iterator = iterator;
    }

    map(fn) {
        const iter = this.iterator;
        return new IteratorHelper(map(iter, fn));
    }

    filter(fn) {
        const iter = this.iterator;
        return new IteratorHelper(filter(iter, fn));
    }

    take(n) {
        const iter = this.iterator;
        return new IteratorHelper((function* () {
            let count = 0;
            for (const value of iter) {
                if (count++ >= n) break;
                yield value;
            }
        })());
    }

    toArray() {
        return [...this.iterator];
    }

    [Symbol.iterator]() {
        return this.iterator;
    }
}

function iter(iterable) {
    return new IteratorHelper(iterable[Symbol.iterator]());
}

const result = iter(range(1, 10))
    .filter(x => x % 2 === 0)
    .map(x => x * 10)
    .take(3)
    .toArray();

console.log("Chained operations:", result);
console.log("");

// ============================================================================
// Generators Meta Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           GENERATORS & ITERATORS CHEAT SHEET                    ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  ITERABLE: Has [Symbol.iterator]() returning iterator           ║");
console.log("║  ITERATOR: Has next() returning { value, done }                 ║");
console.log("║                                                                  ║");
console.log("║  GENERATOR SYNTAX:                                               ║");
console.log("║  function* gen() { yield value; }                               ║");
console.log("║  *[Symbol.iterator]() { yield value; }                          ║");
console.log("║                                                                  ║");
console.log("║  ASYNC ITERATION:                                                ║");
console.log("║  async function* gen() { yield await promise; }                 ║");
console.log("║  for await (const x of asyncGen) { }                            ║");
console.log("║                                                                  ║");
console.log("║  COMMUNICATION:                                                  ║");
console.log("║  const received = yield value;  // two-way                      ║");
console.log("║  gen.next(sendValue)                                            ║");
console.log("║                                                                  ║");
console.log("║  DELEGATION:                                                     ║");
console.log("║  yield* otherGenerator;                                         ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    range,
    take,
    map,
    filter,
    zip,
    chain,
    flatten,
    fibonacci,
    primes,
    naturals,
    IteratorHelper,
    iter
};

console.log("═══ Next: Object Internals ═══");
console.log("Run: node deep-dive/javaScript-meta-programming/07-object-internals.js");
