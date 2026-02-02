/**
 * DESIGN PATTERNS: 03 - Module Pattern
 *
 * ONE CONCEPT: Encapsulation - public and private members
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS MODULE PATTERN?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Module Pattern = Create PRIVATE variables and expose only what's needed.
 *
 * Uses closures to hide implementation details.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   A car has:
 *   - PRIVATE: engine, fuel system, wiring (you don't access directly)
 *   - PUBLIC: steering wheel, pedals, buttons (the interface)
 *
 *   The module pattern does the same for code.
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   const counter = (function() {
 *     let count = 0;              // Private
 *     return {
 *       increment() { count++; }  // Public
 *       getCount() { return count; }
 *     };
 *   })();
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEMORY LAYOUT                                                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   IIFE executes immediately:                                         │
 *   │                                                                      │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  Closure (IIFE's scope) - PRIVATE                           │    │
 *   │   │  ┌────────────────────────────────────────────────────────┐ │    │
 *   │   │  │  count = 0                                             │ │    │
 *   │   │  │                                                        │ │    │
 *   │   │  │  This variable is TRAPPED here                         │ │    │
 *   │   │  │  Only functions defined here can access it             │ │    │
 *   │   │  └────────────────────────────────────────────────────────┘ │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │                     ▲                                                │
 *   │                     │ (closure reference)                            │
 *   │                     │                                                │
 *   │   ┌─────────────────┴───────────────────────────────────────────┐    │
 *   │   │  Returned Object - PUBLIC                                   │    │
 *   │   │  ┌────────────────────────────────────────────────────────┐ │    │
 *   │   │  │  increment: function() {...}                           │ │    │
 *   │   │  │  getCount:  function() {...}                           │ │    │
 *   │   │  └────────────────────────────────────────────────────────┘ │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │                     ▲                                                │
 *   │                     │                                                │
 *   │   counter ──────────┘  (reference to public object)                  │
 *   │                                                                      │
 *   │                                                                      │
 *   │   counter.count          → undefined (can't access)                  │
 *   │   counter.increment()    → works (modifies private count)            │
 *   │   counter.getCount()     → works (reads private count)               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 1: Basic Module (IIFE)
// ═══════════════════════════════════════════════════════════════════════════

const Counter = (function() {
  // PRIVATE - trapped in closure
  let count = 0;

  function log(msg) {
    console.log(`[Counter] ${msg}`);
  }

  // PUBLIC - returned object
  return {
    increment() {
      count++;
      log(`Incremented to ${count}`);
    },
    decrement() {
      count--;
      log(`Decremented to ${count}`);
    },
    getCount() {
      return count;
    }
  };
})();

console.log('=== Basic Module Pattern ===\n');

Counter.increment();
Counter.increment();
Counter.decrement();

console.log('Count:', Counter.getCount());  // 1
console.log('Direct access:', Counter.count);  // undefined (private!)


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 2: Revealing Module Pattern
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Define ALL functions as private first.
 * Then explicitly reveal which ones are public.
 */

const Calculator = (function() {
  // ALL PRIVATE
  let result = 0;

  function add(x) {
    result += x;
    return this;
  }

  function subtract(x) {
    result -= x;
    return this;
  }

  function multiply(x) {
    result *= x;
    return this;
  }

  function reset() {
    result = 0;
    return this;
  }

  function getResult() {
    return result;
  }

  // REVEAL public API
  return {
    add,
    subtract,
    multiply,
    reset,
    getResult
  };
})();

console.log('\n=== Revealing Module Pattern ===\n');

Calculator.add(10).multiply(2).subtract(5);
console.log('Result:', Calculator.getResult());  // 15


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 3: Module with State
// ═══════════════════════════════════════════════════════════════════════════

const ShoppingCart = (function() {
  // Private state
  const items = [];

  // Private helper
  function calculateTotal() {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  // Public API
  return {
    addItem(name, price, qty = 1) {
      items.push({ name, price, qty });
      console.log(`Added: ${name}`);
    },

    removeItem(name) {
      const index = items.findIndex(i => i.name === name);
      if (index > -1) {
        items.splice(index, 1);
        console.log(`Removed: ${name}`);
      }
    },

    getTotal() {
      return calculateTotal();
    },

    getItems() {
      // Return copy to prevent direct modification
      return [...items];
    }
  };
})();

console.log('\n=== Module with State ===\n');

ShoppingCart.addItem('Apple', 1.5, 3);
ShoppingCart.addItem('Bread', 2.0, 1);
console.log('Items:', ShoppingCart.getItems());
console.log('Total: $' + ShoppingCart.getTotal());


// ═══════════════════════════════════════════════════════════════════════════
// MODERN ALTERNATIVE: ES Modules
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ES Modules provide similar encapsulation:
 *
 * // cart.js
 * const items = [];  // Private to module
 *
 * export function addItem(item) {
 *   items.push(item);
 * }
 *
 * export function getTotal() {
 *   return items.reduce(...);
 * }
 *
 * // No export = private to module
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Module pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Module pattern provides encapsulation in JavaScript by creating
 * private and public members. It uses closures to hide implementation
 * details and expose only what's needed.
 *
 * The classic implementation uses an IIFE - an Immediately Invoked
 * Function Expression. Variables declared inside the IIFE are private,
 * trapped in the closure. The IIFE returns an object containing only
 * the public methods, which have access to the private variables
 * through the closure.
 *
 * For example, I might have a private 'count' variable and public
 * 'increment' and 'getCount' methods. External code can only interact
 * through these methods - they can't access or modify 'count' directly.
 *
 * There's also the Revealing Module Pattern, where I define all
 * functions as private first, then explicitly choose which ones to
 * expose in the returned object. This makes it clearer what's public.
 *
 * In modern JavaScript, ES Modules provide similar functionality.
 * Anything not exported is private to the module. But the IIFE pattern
 * is still useful when you need multiple instances or when working
 * in environments without module support."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Encapsulation - private and public members
 * ✓ Uses IIFE and closures
 * ✓ Private variables trapped in closure
 * ✓ Return object exposes public API
 * ✓ Modern alternative: ES Modules
 *
 */


// RUN: node docs/25-design-patterns/03-module-pattern.js
