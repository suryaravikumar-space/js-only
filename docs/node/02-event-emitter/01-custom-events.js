/**
 * TOPIC 01: Custom Events
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Custom events let you design your OWN event-driven systems:              ║
 * ║                                                                          ║
 * ║   class MyClass extends EventEmitter → create event-driven classes       ║
 * ║   Multiple .on() on same event       → all fire in registration order    ║
 * ║   .emit() with rich data             → pass objects, arrays, anything    ║
 * ║                                                                          ║
 * ║ Events are just STRINGS - you can name them anything you want.           ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STORY TO REMEMBER: The Pizza Shop Order System                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ A pizza shop has 3 stages, each fires a CUSTOM EVENT:                    ║
 * ║                                                                          ║
 * ║   1. Customer places order   → 'order-placed'                           ║
 * ║   2. Kitchen finishes pizza  → 'order-ready'                            ║
 * ║   3. Driver delivers pizza   → 'order-delivered'                        ║
 * ║                                                                          ║
 * ║ Different staff LISTEN to different events:                              ║
 * ║   - Kitchen listens for 'order-placed'                                  ║
 * ║   - Counter listens for 'order-ready'                                   ║
 * ║   - Manager listens for ALL events (for tracking)                       ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *   VISUAL: Pizza Order Event Flow
 *
 *   Customer                Kitchen               Counter              Driver
 *      │                      │                      │                    │
 *      │  ── order-placed ──▶ │                      │                    │
 *      │                      │── (cooks pizza) ──▶  │                    │
 *      │                      │  ── order-ready ──▶  │                    │
 *      │                      │                      │── (hands to) ──▶  │
 *      │                      │                      │ order-delivered ─▶ │
 *      │                      │                      │                    │
 *      ▼                      ▼                      ▼                    ▼
 *
 *   Manager listens to ALL three events for logging/tracking
 */

const EventEmitter = require('events');

// ─── Custom event-driven class: PizzaShop ───────────────────────────────────

class PizzaShop extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.orderCount = 0;
  }

  placeOrder(pizza, customer) {
    this.orderCount += 1;
    const order = {
      id: this.orderCount,
      pizza,
      customer,
      time: new Date().toLocaleTimeString()
    };
    console.log(`A: [${this.name}] Order #${order.id} placed by ${customer}`);
    this.emit('order-placed', order);
    return order;
  }

  cookOrder(order) {
    console.log(`B: [Kitchen] Cooking ${order.pizza}...`);
    this.emit('order-ready', order);
  }

  deliverOrder(order) {
    console.log(`C: [Driver] Delivering to ${order.customer}...`);
    this.emit('order-delivered', order);
  }
}

// ─── Create the shop and attach listeners ───────────────────────────────────

const shop = new PizzaShop('Mario\'s Pizza');

// Kitchen listens for new orders
shop.on('order-placed', (order) => {
  console.log(`D: [Kitchen] Received order #${order.id}: ${order.pizza}`);
  shop.cookOrder(order);
});

// Counter listens for ready orders
shop.on('order-ready', (order) => {
  console.log(`E: [Counter] Order #${order.id} is ready for pickup!`);
  shop.deliverOrder(order);
});

// Driver confirms delivery
shop.on('order-delivered', (order) => {
  console.log(`F: [Driver] Order #${order.id} delivered to ${order.customer}`);
});

// Manager tracks everything
shop.on('order-placed', (order) => {
  console.log(`G: [Manager] Logged: new order from ${order.customer}`);
});

shop.on('order-delivered', (order) => {
  console.log(`H: [Manager] Logged: delivery complete for #${order.id}`);
});

// ─── Place an order (triggers the whole chain) ──────────────────────────────

console.log('--- Order Flow ---');
shop.placeOrder('Margherita', 'Alice');

// ─── Multiple listeners on the same event fire in order ─────────────────────

console.log('\n--- Listener Execution Order ---');

const demo = new EventEmitter();

demo.on('test', () => console.log('I: First listener'));
demo.on('test', () => console.log('J: Second listener'));
demo.on('test', () => console.log('K: Third listener'));

demo.emit('test');

// ─── Passing complex data through events ────────────────────────────────────

console.log('\n--- Rich Event Data ---');

class OrderTracker extends EventEmitter {
  update(status) {
    this.emit('status-change', {
      status,
      timestamp: Date.now(),
      details: { source: 'OrderTracker' }
    });
  }
}

const tracker = new OrderTracker();

tracker.on('status-change', ({ status, details }) => {
  console.log(`L: Status changed to "${status}" from ${details.source}`);
});

tracker.update('processing');
tracker.update('shipped');

/**
 * OUTPUT:
 *   --- Order Flow ---
 *   A: [Mario's Pizza] Order #1 placed by Alice
 *   D: [Kitchen] Received order #1: Margherita
 *   B: [Kitchen] Cooking Margherita...
 *   E: [Counter] Order #1 is ready for pickup!
 *   C: [Driver] Delivering to Alice...
 *   F: [Driver] Order #1 delivered to Alice
 *   H: [Manager] Logged: delivery complete for #1
 *   G: [Manager] Logged: new order from Alice
 *
 *   --- Listener Execution Order ---
 *   I: First listener
 *   J: Second listener
 *   K: Third listener
 *
 *   --- Rich Event Data ---
 *   L: Status changed to "processing" from OrderTracker
 *   L: Status changed to "shipped" from OrderTracker
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │ "Custom events are created by extending EventEmitter. You define          │
 * │  meaningful event names like 'order-placed' or 'status-change' and        │
 * │  emit them at the right moments with relevant data. Multiple listeners    │
 * │  can subscribe to the same event and they execute synchronously in        │
 * │  registration order. This pattern decouples components - the emitter      │
 * │  doesn't need to know who's listening."                                   │
 * │                                                                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/02-event-emitter/01-custom-events.js
 */
