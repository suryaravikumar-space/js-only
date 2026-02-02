/**
 * DESIGN PATTERNS: 04 - Observer Pattern
 *
 * ONE CONCEPT: Objects subscribe to events and react when they happen
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS OBSERVER PATTERN?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Observer = Objects WATCH a subject and get NOTIFIED when it changes.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   YouTube subscription:
 *   - You SUBSCRIBE to a channel
 *   - When channel uploads, you get NOTIFIED
 *   - You can UNSUBSCRIBE anytime
 *
 *
 * TWO PARTS:
 * ──────────
 *
 *   SUBJECT (Observable):
 *   - Maintains list of observers
 *   - Notifies them when state changes
 *
 *   OBSERVERS:
 *   - Subscribe to subject
 *   - Have an update() method
 *   - React when notified
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   subject.subscribe(observer1);
 *   subject.subscribe(observer2);
 *   subject.notify('data');
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEMORY & EXECUTION                                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   SUBJECT OBJECT:                                                    │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  observers: [                                               │    │
 *   │   │    observer1 ──────────┐                                    │    │
 *   │   │    observer2 ──────────┼──┐                                 │    │
 *   │   │  ]                     │  │                                 │    │
 *   │   │                        │  │                                 │    │
 *   │   │  notify(data) {        │  │                                 │    │
 *   │   │    for each observer:  │  │                                 │    │
 *   │   │      observer.update() │  │                                 │    │
 *   │   │  }                     │  │                                 │    │
 *   │   └────────────────────────┼──┼─────────────────────────────────┘    │
 *   │                            │  │                                      │
 *   │                            ▼  ▼                                      │
 *   │   ┌────────────────┐  ┌────────────────┐                             │
 *   │   │  observer1     │  │  observer2     │                             │
 *   │   │  update(data)  │  │  update(data)  │                             │
 *   │   └────────────────┘  └────────────────┘                             │
 *   │                                                                      │
 *   │                                                                      │
 *   │   When notify('data') is called:                                     │
 *   │                                                                      │
 *   │   Step 1: Loop through observers array                               │
 *   │   Step 2: Call observer1.update('data')                              │
 *   │   Step 3: Call observer2.update('data')                              │
 *   │                                                                      │
 *   │   Both observers react to the same event!                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 1: Basic Observer
// ═══════════════════════════════════════════════════════════════════════════

class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
    console.log('Observer subscribed');
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
    console.log('Observer unsubscribed');
  }

  notify(data) {
    console.log(`Notifying ${this.observers.length} observers...`);
    this.observers.forEach(observer => observer.update(data));
  }
}

// Observers
const observer1 = {
  name: 'Observer 1',
  update(data) {
    console.log(`  ${this.name} received: ${data}`);
  }
};

const observer2 = {
  name: 'Observer 2',
  update(data) {
    console.log(`  ${this.name} received: ${data}`);
  }
};

console.log('=== Basic Observer Pattern ===\n');

const subject = new Subject();
subject.subscribe(observer1);
subject.subscribe(observer2);

subject.notify('Hello Observers!');

subject.unsubscribe(observer1);
subject.notify('Second message');


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 2: Practical Example - Stock Price
// ═══════════════════════════════════════════════════════════════════════════

class Stock {
  constructor(symbol, price) {
    this.symbol = symbol;
    this.price = price;
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  setPrice(newPrice) {
    const oldPrice = this.price;
    this.price = newPrice;

    // Notify all observers of price change
    this.observers.forEach(observer => {
      observer.update(this.symbol, oldPrice, newPrice);
    });
  }
}

// Different types of observers
const priceAlert = {
  threshold: 150,
  update(symbol, oldPrice, newPrice) {
    if (newPrice > this.threshold) {
      console.log(`  ALERT: ${symbol} exceeded $${this.threshold}! Now: $${newPrice}`);
    }
  }
};

const priceLogger = {
  update(symbol, oldPrice, newPrice) {
    const change = ((newPrice - oldPrice) / oldPrice * 100).toFixed(2);
    console.log(`  LOG: ${symbol} changed ${change}% ($${oldPrice} → $${newPrice})`);
  }
};

console.log('\n=== Stock Price Observer ===\n');

const apple = new Stock('AAPL', 145);
apple.subscribe(priceAlert);
apple.subscribe(priceLogger);

apple.setPrice(148);
apple.setPrice(152);
apple.setPrice(149);


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 3: Using Functions (Simpler)
// ═══════════════════════════════════════════════════════════════════════════

function createObservable() {
  const listeners = [];

  return {
    subscribe(fn) {
      listeners.push(fn);
      // Return unsubscribe function
      return () => {
        const index = listeners.indexOf(fn);
        if (index > -1) listeners.splice(index, 1);
      };
    },

    emit(data) {
      listeners.forEach(fn => fn(data));
    }
  };
}

console.log('\n=== Functional Observer ===\n');

const clicks = createObservable();

const unsubscribe1 = clicks.subscribe(data => {
  console.log('  Handler 1:', data);
});

const unsubscribe2 = clicks.subscribe(data => {
  console.log('  Handler 2:', data);
});

clicks.emit({ x: 100, y: 200 });

unsubscribe1();  // Remove first handler
clicks.emit({ x: 150, y: 250 });


// ═══════════════════════════════════════════════════════════════════════════
// REAL-WORLD EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHERE YOU SEE OBSERVER PATTERN                                    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  DOM Events:                                                        │
 *   │    button.addEventListener('click', handler)                        │
 *   │    // Button is subject, handler is observer                        │
 *   │                                                                     │
 *   │  React/Vue Reactivity:                                              │
 *   │    When state changes, UI components re-render                      │
 *   │                                                                     │
 *   │  Node.js EventEmitter:                                              │
 *   │    emitter.on('event', handler)                                     │
 *   │                                                                     │
 *   │  RxJS Observables:                                                  │
 *   │    observable.subscribe(observer)                                   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Observer pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Observer pattern defines a one-to-many relationship between objects.
 * When one object changes state, all its dependents are notified automatically.
 *
 * There are two main parts: the Subject, which is being observed, and the
 * Observers, which are watching it.
 *
 * The Subject maintains a list of observers and has methods like subscribe(),
 * unsubscribe(), and notify(). When something important happens, it loops
 * through its observers and calls their update() method with the relevant data.
 *
 * A real-world example is DOM events. When you call addEventListener, you're
 * subscribing an observer to the button. When the button is clicked, it
 * notifies all subscribed handlers.
 *
 * The benefits are loose coupling - the subject doesn't need to know what
 * the observers do with the data, it just notifies them. And you can add
 * or remove observers at runtime without changing the subject.
 *
 * This pattern is the foundation for reactive programming. React and Vue
 * use it for state management - when state changes, all subscribed
 * components re-render. RxJS and Node's EventEmitter are also built
 * on this pattern."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ One-to-many relationship
 * ✓ Subject maintains observer list
 * ✓ subscribe(), unsubscribe(), notify()
 * ✓ Loose coupling
 * ✓ Examples: DOM events, React state, EventEmitter
 *
 */


// RUN: node docs/25-design-patterns/04-observer-pattern.js
