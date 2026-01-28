/**
 * DOM EVENTS: 07 - Custom Events
 *
 * ONE CONCEPT: Create and dispatch your own events
 */


// =============================================================================
// WHAT ARE CUSTOM EVENTS?
// =============================================================================

/**
 * Custom Events = Events you CREATE and DISPATCH yourself.
 *
 * Built-in events: click, submit, keydown (browser triggers these)
 * Custom events: You define the name, data, and when to trigger them.
 *
 *
 * WHY USE CUSTOM EVENTS?
 * ──────────────────────
 *
 *   • Decouple components (A doesn't need to know about B)
 *   • Communicate between unrelated parts of your app
 *   • Create consistent API for custom components
 *   • Mimic native DOM behavior in web components
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CUSTOM EVENT FLOW                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   STEP 1: Create the event                                           │
 *   │   ──────────────────────────                                         │
 *   │                                                                      │
 *   │   const event = new CustomEvent('user-login', {                      │
 *   │     detail: { userId: 123, name: 'John' },  // Your custom data      │
 *   │     bubbles: true,      // Should it bubble up?                      │
 *   │     cancelable: true    // Can it be preventDefault'd?               │
 *   │   });                                                                │
 *   │                                                                      │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  CustomEvent {                                              │    │
 *   │   │    type: 'user-login',                                      │    │
 *   │   │    detail: { userId: 123, name: 'John' },                   │    │
 *   │   │    bubbles: true,                                           │    │
 *   │   │    cancelable: true,                                        │    │
 *   │   │    target: null  (until dispatched)                         │    │
 *   │   │  }                                                          │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   │   STEP 2: Dispatch the event                                         │
 *   │   ──────────────────────────                                         │
 *   │                                                                      │
 *   │   element.dispatchEvent(event);                                      │
 *   │                                                                      │
 *   │   • Event travels through DOM (capture → target → bubble)            │
 *   │   • All listeners for 'user-login' are called                        │
 *   │   • Returns false if any handler called preventDefault()             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC EXAMPLE
// =============================================================================

console.log('=== Basic Custom Event ===\n');

// In Node.js, we'll simulate since there's no DOM
// This is how it works in browser:

const browserBasic = `
// 1. Listen for the custom event
document.addEventListener('user-login', function(e) {
  console.log('User logged in:', e.detail.name);
  console.log('User ID:', e.detail.userId);
});

// 2. Create the custom event
const event = new CustomEvent('user-login', {
  detail: {
    userId: 123,
    name: 'John Doe'
  }
});

// 3. Dispatch it
document.dispatchEvent(event);

// Output:
// User logged in: John Doe
// User ID: 123
`;

console.log(browserBasic);

// Simulated version for Node.js
class EventSimulator {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(handler);
  }

  dispatchEvent(event) {
    const handlers = this.listeners.get(event.type) || [];
    handlers.forEach(h => h(event));
    return !event.defaultPrevented;
  }
}

// Demo
const doc = new EventSimulator();

doc.addEventListener('user-login', (e) => {
  console.log(`Received: ${e.type}`);
  console.log(`Detail: ${JSON.stringify(e.detail)}`);
});

// Simulate CustomEvent
const loginEvent = {
  type: 'user-login',
  detail: { userId: 123, name: 'John' },
  bubbles: true,
  cancelable: true,
  defaultPrevented: false
};

doc.dispatchEvent(loginEvent);


// =============================================================================
// CUSTOMEVENTS vs EVENT
// =============================================================================

console.log('\n=== CustomEvent vs Event ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  TWO WAYS TO CREATE CUSTOM EVENTS                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  new Event('my-event')                                              │
 *   │  ─────────────────────                                              │
 *   │  • Basic event, no custom data                                      │
 *   │  • Can set bubbles/cancelable                                       │
 *   │                                                                     │
 *   │  new CustomEvent('my-event', { detail: {...} })                     │
 *   │  ────────────────────────────────────────────────                   │
 *   │  • Can attach custom data via 'detail' property                     │
 *   │  • Also can set bubbles/cancelable                                  │
 *   │  • USE THIS when you need to pass data                              │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const comparison = `
// Event - no custom data
const simpleEvent = new Event('data-loaded', {
  bubbles: true,
  cancelable: false
});
// Access: e.type → 'data-loaded'

// CustomEvent - with custom data
const detailEvent = new CustomEvent('data-loaded', {
  detail: { items: [1, 2, 3], count: 3 },
  bubbles: true,
  cancelable: false
});
// Access: e.detail.items → [1, 2, 3]
`;

console.log(comparison);


// =============================================================================
// PRACTICAL EXAMPLES
// =============================================================================

console.log('=== Practical Examples ===\n');

// Example 1: Form Wizard
console.log('─── Example 1: Form Wizard Steps ───\n');

const wizardExample = `
// Step component dispatches event when complete
class FormStep extends HTMLElement {
  complete(data) {
    this.dispatchEvent(new CustomEvent('step-complete', {
      detail: { step: this.stepNumber, data },
      bubbles: true  // Parent wizard can catch it
    }));
  }
}

// Wizard listens for step completions
wizard.addEventListener('step-complete', (e) => {
  console.log(\`Step \${e.detail.step} completed\`);
  saveStepData(e.detail.data);
  showNextStep();
});
`;
console.log(wizardExample);


// Example 2: Shopping Cart
console.log('─── Example 2: Shopping Cart Events ───\n');

const cartExample = `
// Product component
addToCartBtn.addEventListener('click', () => {
  const event = new CustomEvent('cart:add', {
    detail: {
      productId: this.productId,
      name: this.productName,
      price: this.price,
      quantity: 1
    },
    bubbles: true
  });
  this.dispatchEvent(event);
});

// Cart listens at document level
document.addEventListener('cart:add', (e) => {
  cart.addItem(e.detail);
  updateCartUI();
});

document.addEventListener('cart:remove', (e) => {
  cart.removeItem(e.detail.productId);
  updateCartUI();
});
`;
console.log(cartExample);


// Example 3: Component Communication
console.log('─── Example 3: Component Communication ───\n');

const commExample = `
// Modal component
class Modal {
  open() {
    this.element.classList.add('open');
    this.element.dispatchEvent(new Event('modal:open', { bubbles: true }));
  }

  close() {
    this.element.classList.remove('open');
    this.element.dispatchEvent(new Event('modal:close', { bubbles: true }));
  }
}

// Other components react to modal state
document.addEventListener('modal:open', () => {
  document.body.classList.add('modal-open');
  pauseVideoPlayer();
});

document.addEventListener('modal:close', () => {
  document.body.classList.remove('modal-open');
  resumeVideoPlayer();
});
`;
console.log(commExample);


// =============================================================================
// CHECKING IF CANCELLED
// =============================================================================

console.log('=== Checking if Event was Cancelled ===\n');

const cancelExample = `
// Dispatch returns false if preventDefault was called
const event = new CustomEvent('before-delete', {
  detail: { itemId: 123 },
  cancelable: true,  // Must be cancelable!
  bubbles: true
});

const notCancelled = element.dispatchEvent(event);

if (notCancelled) {
  // No handler called preventDefault
  deleteItem(123);
} else {
  // Some handler prevented the action
  console.log('Delete was cancelled');
}

// Handler that might cancel:
element.addEventListener('before-delete', (e) => {
  if (!confirm('Are you sure?')) {
    e.preventDefault();  // Cancel the action
  }
});
`;

console.log(cancelExample);


// =============================================================================
// NAMING CONVENTIONS
// =============================================================================

console.log('=== Event Naming Conventions ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  NAMING YOUR CUSTOM EVENTS                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Use lowercase with dashes or colons:                               │
 *   │  ✓ 'user-login'                                                     │
 *   │  ✓ 'cart:add'                                                       │
 *   │  ✓ 'data-loaded'                                                    │
 *   │                                                                     │
 *   │  Avoid:                                                             │
 *   │  ✗ 'userLogin'    (camelCase - not standard)                        │
 *   │  ✗ 'USER_LOGIN'   (screaming case)                                  │
 *   │  ✗ 'click'        (conflicts with built-in)                         │
 *   │                                                                     │
 *   │  Common patterns:                                                   │
 *   │  • component:action (cart:add, modal:open)                          │
 *   │  • entity-action (user-login, data-loaded)                          │
 *   │  • before/after (before-delete, after-save)                         │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Good event names:');
console.log('  cart:add, cart:remove, cart:update');
console.log('  modal:open, modal:close');
console.log('  user-login, user-logout');
console.log('  before-delete, after-save');
console.log('  data-loaded, form-validated');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "How do you create custom events in JavaScript?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "You use the CustomEvent constructor to create events with custom names
 * and data. The constructor takes the event name and an options object
 * where you can specify 'detail' for your custom data, 'bubbles' for
 * whether it should bubble up the DOM, and 'cancelable' for whether
 * handlers can prevent it.
 *
 * To trigger the event, you call dispatchEvent on an element. The event
 * then goes through the normal capture-target-bubble phases if you set
 * bubbles to true.
 *
 * I use custom events for component communication. For example, in an
 * e-commerce site, when someone clicks 'Add to Cart', that product
 * component dispatches a 'cart:add' event with the product details.
 * The cart component listens for this event at the document level and
 * updates itself. This keeps the components decoupled - the product
 * component doesn't need to know anything about the cart.
 *
 * You can also check if an event was cancelled by looking at the return
 * value of dispatchEvent - it returns false if any handler called
 * preventDefault. This is useful for 'before-action' events where you
 * want to give handlers a chance to cancel the action.
 *
 * For naming, I use lowercase with dashes or colons - like 'user-login'
 * or 'modal:close' - to distinguish from built-in events and follow
 * web component conventions."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ new CustomEvent(name, { detail, bubbles, cancelable })
 * ✓ element.dispatchEvent(event) to trigger
 * ✓ Use for component communication
 * ✓ detail property holds custom data
 * ✓ dispatchEvent returns false if cancelled
 *
 */


// RUN: node docs/26-dom-events/07-custom-events.js
