/**
 * DESIGN PATTERNS: 07 - Strategy Pattern
 *
 * ONE CONCEPT: Swap algorithms at runtime without changing the code that uses them
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS STRATEGY?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Strategy = Define a family of algorithms, make them INTERCHANGEABLE.
 *
 * Instead of if/else or switch, use pluggable strategy objects.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Getting to work:
 *   - Strategy 1: Drive car
 *   - Strategy 2: Take bus
 *   - Strategy 3: Ride bike
 *
 *   Same goal (get to work), different strategies.
 *   Swap strategies based on weather, traffic, etc.
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   context.setStrategy(strategyA);
 *   context.execute();
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  STRUCTURE                                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   CONTEXT OBJECT:                                                    │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  strategy: ─────────┐                                       │    │
 *   │   │                     │                                       │    │
 *   │   │  execute() {        │                                       │    │
 *   │   │    this.strategy.doWork()  ◄── delegates to strategy        │    │
 *   │   │  }                  │                                       │    │
 *   │   │                     │                                       │    │
 *   │   │  setStrategy(s) {   │                                       │    │
 *   │   │    this.strategy = s│                                       │    │
 *   │   │  }                  │                                       │    │
 *   │   └─────────────────────┼───────────────────────────────────────┘    │
 *   │                         │                                            │
 *   │                         ▼                                            │
 *   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
 *   │   │ Strategy A  │  │ Strategy B  │  │ Strategy C  │                  │
 *   │   │ doWork()    │  │ doWork()    │  │ doWork()    │                  │
 *   │   └─────────────┘  └─────────────┘  └─────────────┘                  │
 *   │                                                                      │
 *   │   All strategies have same interface (doWork)                        │
 *   │   Context doesn't care which one is used                             │
 *   │   Can swap at runtime with setStrategy()                             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM: Without Strategy (ugly if/else)
// ═══════════════════════════════════════════════════════════════════════════

function calculateShippingBad(weight, method) {
  if (method === 'standard') {
    return weight * 1.5;
  } else if (method === 'express') {
    return weight * 3.0;
  } else if (method === 'overnight') {
    return weight * 5.0;
  } else if (method === 'drone') {
    return weight * 10.0;
  }
  // Adding new methods means modifying this function!
}


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION: With Strategy
// ═══════════════════════════════════════════════════════════════════════════

// Strategy objects - each has same interface
const shippingStrategies = {
  standard: {
    calculate: (weight) => weight * 1.5,
    estimatedDays: 5
  },
  express: {
    calculate: (weight) => weight * 3.0,
    estimatedDays: 2
  },
  overnight: {
    calculate: (weight) => weight * 5.0,
    estimatedDays: 1
  },
  drone: {
    calculate: (weight) => weight * 10.0,
    estimatedDays: 0.5
  }
};

// Context
class ShippingCalculator {
  constructor() {
    this.strategy = null;
  }

  setStrategy(strategyName) {
    this.strategy = shippingStrategies[strategyName];
    if (!this.strategy) {
      throw new Error(`Unknown shipping method: ${strategyName}`);
    }
  }

  calculate(weight) {
    if (!this.strategy) {
      throw new Error('No shipping strategy set');
    }
    return {
      cost: this.strategy.calculate(weight),
      days: this.strategy.estimatedDays
    };
  }
}

console.log('=== Strategy Pattern ===\n');

const calculator = new ShippingCalculator();

calculator.setStrategy('standard');
console.log('Standard:', calculator.calculate(10));

calculator.setStrategy('express');
console.log('Express:', calculator.calculate(10));

calculator.setStrategy('overnight');
console.log('Overnight:', calculator.calculate(10));


// ═══════════════════════════════════════════════════════════════════════════
// PRACTICAL EXAMPLE: Payment Processing
// ═══════════════════════════════════════════════════════════════════════════

const paymentStrategies = {
  creditCard: {
    process(amount, details) {
      console.log(`  Processing $${amount} via Credit Card: ${details.cardNumber}`);
      return { success: true, transactionId: 'CC-' + Date.now() };
    }
  },
  paypal: {
    process(amount, details) {
      console.log(`  Processing $${amount} via PayPal: ${details.email}`);
      return { success: true, transactionId: 'PP-' + Date.now() };
    }
  },
  crypto: {
    process(amount, details) {
      console.log(`  Processing $${amount} via Crypto: ${details.wallet}`);
      return { success: true, transactionId: 'CR-' + Date.now() };
    }
  }
};

class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  pay(amount, details) {
    return this.strategy.process(amount, details);
  }
}

console.log('\n=== Payment Strategies ===\n');

const processor = new PaymentProcessor(paymentStrategies.creditCard);
processor.pay(100, { cardNumber: '****1234' });

processor.setStrategy(paymentStrategies.paypal);
processor.pay(50, { email: 'user@example.com' });


// ═══════════════════════════════════════════════════════════════════════════
// SIMPLEST FORM: Functions as Strategies
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n=== Functions as Strategies ===\n');

// Sorting strategies
const sortStrategies = {
  byName: (a, b) => a.name.localeCompare(b.name),
  byPrice: (a, b) => a.price - b.price,
  byRating: (a, b) => b.rating - a.rating
};

const products = [
  { name: 'Laptop', price: 999, rating: 4.5 },
  { name: 'Phone', price: 699, rating: 4.8 },
  { name: 'Tablet', price: 499, rating: 4.2 }
];

function sortProducts(products, strategy) {
  return [...products].sort(strategy);
}

console.log('By Name:', sortProducts(products, sortStrategies.byName).map(p => p.name));
console.log('By Price:', sortProducts(products, sortStrategies.byPrice).map(p => p.name));
console.log('By Rating:', sortProducts(products, sortStrategies.byRating).map(p => p.name));


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Strategy pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Strategy pattern lets you define a family of algorithms and make
 * them interchangeable. Instead of using if/else or switch statements
 * to choose behavior, you encapsulate each algorithm in its own object
 * or function.
 *
 * There are two parts: the Context, which is the class that uses a
 * strategy, and the Strategies themselves. All strategies implement
 * the same interface. The context doesn't know which specific strategy
 * it's using - it just calls the interface method.
 *
 * For example, for shipping calculation, instead of a big switch
 * statement with 'standard', 'express', 'overnight', I create separate
 * strategy objects. Each has a calculate() method. The ShippingCalculator
 * just calls this.strategy.calculate() - it doesn't care which one.
 *
 * The benefit is you can add new strategies without modifying existing
 * code. To add 'drone delivery', I just create a new strategy object.
 * The calculator code doesn't change. This follows the Open/Closed
 * principle.
 *
 * In JavaScript, the simplest form is passing functions around.
 * Array.sort() takes a comparator function - that's a strategy.
 * You can swap the comparison logic by passing different functions."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Define family of algorithms, make interchangeable
 * ✓ Replace if/else with strategy objects
 * ✓ Same interface, different implementations
 * ✓ Add new strategies without modifying code
 * ✓ Example: Array.sort() comparator
 *
 */


// RUN: node docs/25-design-patterns/07-strategy-pattern.js
