/**
 * DESIGN PATTERNS: 06 - Decorator Pattern
 *
 * ONE CONCEPT: Add behavior to objects without modifying their class
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS DECORATOR?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Decorator = WRAP an object to add new behavior.
 *
 * Original object stays unchanged.
 * New functionality is layered on top.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Plain coffee: $2
 *   + Milk decorator: +$0.50
 *   + Sugar decorator: +$0.25
 *   + Whipped cream decorator: +$0.75
 *
 *   Total: $3.50
 *
 *   The coffee is still coffee - we just decorated it.
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   const decorated = withLogging(originalFunction);
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WRAPPER STRUCTURE                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  DECORATOR WRAPPER                                          │    │
 *   │   │  ┌───────────────────────────────────────────────────────┐  │    │
 *   │   │  │  Before: console.log('Calling...')                    │  │    │
 *   │   │  │                                                       │  │    │
 *   │   │  │  ┌───────────────────────────────────────────────┐    │  │    │
 *   │   │  │  │  ORIGINAL FUNCTION                            │    │  │    │
 *   │   │  │  │  (unchanged)                                  │    │  │    │
 *   │   │  │  └───────────────────────────────────────────────┘    │  │    │
 *   │   │  │                                                       │  │    │
 *   │   │  │  After: console.log('Done!')                          │  │    │
 *   │   │  └───────────────────────────────────────────────────────┘  │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   │                                                                      │
 *   │   When decorated() is called:                                        │
 *   │                                                                      │
 *   │   1. Execute decorator's "before" code                               │
 *   │   2. Call original function                                          │
 *   │   3. Execute decorator's "after" code                                │
 *   │   4. Return result                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 1: Function Decorator
// ═══════════════════════════════════════════════════════════════════════════

// Decorator: Add logging
function withLogging(fn) {
  return function(...args) {
    console.log(`  [LOG] Calling ${fn.name} with:`, args);
    const result = fn.apply(this, args);
    console.log(`  [LOG] Result:`, result);
    return result;
  };
}

// Original function
function add(a, b) {
  return a + b;
}

// Decorated function
const loggedAdd = withLogging(add);

console.log('=== Function Decorator ===\n');
loggedAdd(5, 3);


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 2: Multiple Decorators (Stacking)
// ═══════════════════════════════════════════════════════════════════════════

// Decorator: Measure execution time
function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(`  [TIME] ${fn.name} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

// Decorator: Cache results
function withCache(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`  [CACHE] Hit for:`, args);
      return cache.get(key);
    }

    console.log(`  [CACHE] Miss for:`, args);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function expensiveCalculation(n) {
  // Simulate expensive work
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += i;
  }
  return result;
}

// Stack multiple decorators
const cachedCalculation = withCache(withTiming(expensiveCalculation));

console.log('\n=== Stacked Decorators ===\n');
console.log('First call:');
cachedCalculation(5);

console.log('\nSecond call (cached):');
cachedCalculation(5);


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 3: Object Decorator
// ═══════════════════════════════════════════════════════════════════════════

class Coffee {
  constructor() {
    this.description = 'Plain Coffee';
    this.cost = 2.00;
  }

  getDescription() {
    return this.description;
  }

  getCost() {
    return this.cost;
  }
}

// Decorator functions that wrap the object
function withMilk(coffee) {
  return {
    getDescription() {
      return coffee.getDescription() + ', Milk';
    },
    getCost() {
      return coffee.getCost() + 0.50;
    }
  };
}

function withSugar(coffee) {
  return {
    getDescription() {
      return coffee.getDescription() + ', Sugar';
    },
    getCost() {
      return coffee.getCost() + 0.25;
    }
  };
}

function withWhippedCream(coffee) {
  return {
    getDescription() {
      return coffee.getDescription() + ', Whipped Cream';
    },
    getCost() {
      return coffee.getCost() + 0.75;
    }
  };
}

console.log('\n=== Coffee Decorators ===\n');

let myCoffee = new Coffee();
console.log(`${myCoffee.getDescription()}: $${myCoffee.getCost()}`);

myCoffee = withMilk(myCoffee);
console.log(`${myCoffee.getDescription()}: $${myCoffee.getCost()}`);

myCoffee = withSugar(myCoffee);
console.log(`${myCoffee.getDescription()}: $${myCoffee.getCost()}`);

myCoffee = withWhippedCream(myCoffee);
console.log(`${myCoffee.getDescription()}: $${myCoffee.getCost()}`);


// ═══════════════════════════════════════════════════════════════════════════
// REAL-WORLD EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHERE YOU SEE DECORATORS                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Higher-Order Components (React):                                   │
 *   │    withRouter(Component)                                            │
 *   │    connect(mapState)(Component)                                     │
 *   │                                                                     │
 *   │  TypeScript/ES Decorators:                                          │
 *   │    @Component({ ... })                                              │
 *   │    @Injectable()                                                    │
 *   │                                                                     │
 *   │  Express Middleware:                                                │
 *   │    app.use(logging)                                                 │
 *   │    app.use(authentication)                                          │
 *   │    // Each wraps the request handler                                │
 *   │                                                                     │
 *   │  API Wrappers:                                                      │
 *   │    withRetry(fetchData)                                             │
 *   │    withTimeout(fetchData)                                           │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Decorator pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Decorator pattern lets you add behavior to objects or functions
 * without modifying them. You wrap the original with a decorator that
 * adds functionality before or after the original logic.
 *
 * In JavaScript, I typically implement it with higher-order functions.
 * A decorator takes a function, returns a new function that wraps the
 * original, adds some behavior, calls the original, maybe adds more
 * behavior after, and returns the result.
 *
 * The powerful thing is you can stack decorators. I might have
 * withLogging(), withCaching(), and withTiming() decorators. I can
 * apply all three to a function, and each layer adds its own behavior.
 * The original function stays unchanged.
 *
 * React's Higher-Order Components are decorators - withRouter wraps
 * a component and adds router props. Express middleware is similar -
 * each middleware wraps the request handling.
 *
 * For the coffee example: start with plain coffee at $2, add a milk
 * decorator for +$0.50, add sugar for +$0.25. Each decorator wraps
 * the previous object and modifies the cost and description.
 *
 * The main benefit is following the Open/Closed principle - you can
 * extend behavior without modifying existing code."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Wrap to add behavior, don't modify
 * ✓ Higher-order functions in JS
 * ✓ Decorators can be stacked
 * ✓ Examples: HOCs in React, Express middleware
 * ✓ Open/Closed principle
 *
 */


// RUN: node docs/25-design-patterns/06-decorator-pattern.js
