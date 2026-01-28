/**
 * DESIGN PATTERNS: 05 - Publish/Subscribe (Pub/Sub) Pattern
 *
 * ONE CONCEPT: Decouple publishers from subscribers using events/topics
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS PUB/SUB?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pub/Sub = Publishers emit EVENTS, Subscribers listen to EVENTS.
 *
 * They don't know about each other - the EVENT CHANNEL connects them.
 *
 *
 * OBSERVER vs PUB/SUB:
 * ────────────────────
 *
 *   OBSERVER:
 *   Subject ──────▶ Observer     (Subject knows its observers)
 *
 *   PUB/SUB:
 *   Publisher ──▶ Event Channel ──▶ Subscriber
 *                 (middleman)
 *
 *   In Pub/Sub, publisher and subscriber are COMPLETELY DECOUPLED.
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   pubsub.subscribe('userLogin', handler);
 *   pubsub.publish('userLogin', userData);
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEMORY STRUCTURE                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   EVENT CHANNEL (the pubsub object):                                 │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  events: {                                                  │    │
 *   │   │    'userLogin': [handler1, handler2],                       │    │
 *   │   │    'userLogout': [handler3],                                │    │
 *   │   │    'purchase': [handler4, handler5, handler6]               │    │
 *   │   │  }                                                          │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   │                                                                      │
 *   │   When publish('userLogin', data) is called:                         │
 *   │                                                                      │
 *   │   1. Look up 'userLogin' in events object                            │
 *   │   2. Get array: [handler1, handler2]                                 │
 *   │   3. Call handler1(data)                                             │
 *   │   4. Call handler2(data)                                             │
 *   │                                                                      │
 *   │                                                                      │
 *   │   ┌─────────────┐                    ┌─────────────┐                 │
 *   │   │  Publisher  │                    │  Subscriber │                 │
 *   │   │  (any code) │                    │  (any code) │                 │
 *   │   └──────┬──────┘                    └──────▲──────┘                 │
 *   │          │                                  │                        │
 *   │          │ publish()                subscribe()                      │
 *   │          │                                  │                        │
 *   │          ▼                                  │                        │
 *   │   ┌─────────────────────────────────────────┴────────┐               │
 *   │   │              EVENT CHANNEL                       │               │
 *   │   │   (Publishers and subscribers don't know         │               │
 *   │   │    about each other - only about events)         │               │
 *   │   └──────────────────────────────────────────────────┘               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

const PubSub = {
  events: {},

  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  },

  publish(event, data) {
    if (!this.events[event]) {
      return;  // No subscribers
    }

    this.events[event].forEach(callback => {
      callback(data);
    });
  }
};

console.log('=== Pub/Sub Pattern ===\n');

// Subscriber 1: Logger
PubSub.subscribe('user:login', (user) => {
  console.log(`  [Logger] User logged in: ${user.name}`);
});

// Subscriber 2: Analytics
PubSub.subscribe('user:login', (user) => {
  console.log(`  [Analytics] Track login for: ${user.id}`);
});

// Subscriber 3: Welcome message
PubSub.subscribe('user:login', (user) => {
  console.log(`  [UI] Welcome back, ${user.name}!`);
});

// Publisher (could be anywhere in the codebase)
console.log('Publishing user:login event...');
PubSub.publish('user:login', { id: 123, name: 'Alice' });


// ═══════════════════════════════════════════════════════════════════════════
// PRACTICAL EXAMPLE: E-Commerce Events
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n=== E-Commerce Pub/Sub ===\n');

// Different modules subscribe to events
// They don't know about each other!

// Inventory module
PubSub.subscribe('order:placed', (order) => {
  console.log(`  [Inventory] Reduce stock for ${order.items.length} items`);
});

// Email module
PubSub.subscribe('order:placed', (order) => {
  console.log(`  [Email] Send confirmation to ${order.email}`);
});

// Analytics module
PubSub.subscribe('order:placed', (order) => {
  console.log(`  [Analytics] Track order value: $${order.total}`);
});

// Somewhere in checkout code...
console.log('Order placed!');
PubSub.publish('order:placed', {
  id: 'ORD-001',
  email: 'customer@example.com',
  items: ['item1', 'item2'],
  total: 99.99
});


// ═══════════════════════════════════════════════════════════════════════════
// UNSUBSCRIBE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n=== Unsubscribe ===\n');

const unsubscribe = PubSub.subscribe('test', (data) => {
  console.log('  Received:', data);
});

PubSub.publish('test', 'First message');

unsubscribe();  // Remove this subscriber

PubSub.publish('test', 'Second message');  // Nothing happens


// ═══════════════════════════════════════════════════════════════════════════
// OBSERVER vs PUB/SUB COMPARISON
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMPARISON                                                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ┌──────────────────┬──────────────────┬──────────────────┐         │
 *   │  │                  │ OBSERVER          │ PUB/SUB          │         │
 *   │  ├──────────────────┼──────────────────┼──────────────────┤         │
 *   │  │ Coupling         │ Subject knows     │ Fully decoupled  │         │
 *   │  │                  │ observers         │                  │         │
 *   │  ├──────────────────┼──────────────────┼──────────────────┤         │
 *   │  │ Communication    │ Direct            │ Via event/topic  │         │
 *   │  ├──────────────────┼──────────────────┼──────────────────┤         │
 *   │  │ Flexibility      │ Tightly scoped    │ Any-to-any       │         │
 *   │  ├──────────────────┼──────────────────┼──────────────────┤         │
 *   │  │ Use case         │ One subject,      │ Many publishers, │         │
 *   │  │                  │ many observers    │ many subscribers │         │
 *   │  └──────────────────┴──────────────────┴──────────────────┘         │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "What's the difference between Observer and Pub/Sub?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Both patterns deal with event-based communication, but they differ
 * in coupling.
 *
 * In the Observer pattern, the Subject directly knows its observers.
 * The subject maintains a list and calls observer methods directly.
 * It's a direct one-to-many relationship.
 *
 * In Pub/Sub, there's an event channel in the middle. Publishers
 * emit named events, and subscribers listen to those event names.
 * Publishers and subscribers don't know about each other at all -
 * they only know about the event channel.
 *
 * This makes Pub/Sub more flexible for larger applications. Different
 * modules can communicate without importing each other. For example,
 * when an order is placed, I publish an 'order:placed' event. The
 * inventory module, email module, and analytics module all subscribe
 * to that event independently. They don't know about the checkout
 * code, and the checkout code doesn't know about them.
 *
 * The tradeoff is that Pub/Sub can be harder to debug because the
 * flow is less explicit. You can't easily trace who's listening
 * to an event just by looking at the code.
 *
 * Node.js EventEmitter is basically Pub/Sub. Redux also uses a
 * similar pattern where actions are published and reducers subscribe."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Observer: direct, subject knows observers
 * ✓ Pub/Sub: event channel in middle, fully decoupled
 * ✓ Pub/Sub better for large apps, multiple modules
 * ✓ Tradeoff: harder to debug event flow
 * ✓ Examples: EventEmitter, Redux
 *
 */


// RUN: node docs/25-design-patterns/05-pubsub-pattern.js
