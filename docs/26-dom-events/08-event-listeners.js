/**
 * DOM EVENTS: 08 - Event Listeners (addEventListener / removeEventListener)
 *
 * ONE CONCEPT: The proper way to attach and detach event handlers
 */


// =============================================================================
// THREE WAYS TO ATTACH EVENTS
// =============================================================================

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THREE METHODS (ranked by preference)                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. addEventListener()  ← USE THIS                                  │
 *   │     element.addEventListener('click', handler);                     │
 *   │     ✓ Multiple handlers per event                                   │
 *   │     ✓ Can remove specific handlers                                  │
 *   │     ✓ Options (capture, once, passive)                              │
 *   │                                                                     │
 *   │  2. DOM property                                                    │
 *   │     element.onclick = handler;                                      │
 *   │     ✗ Only ONE handler per event (overwrites previous)              │
 *   │     ✓ Easy to read/modify                                           │
 *   │                                                                     │
 *   │  3. HTML attribute                                                  │
 *   │     <button onclick="handler()">                                    │
 *   │     ✗ Mixes JS with HTML                                            │
 *   │     ✗ Security issues (eval-like behavior)                          │
 *   │     ✗ Only ONE handler                                              │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// addEventListener SYNTAX
// =============================================================================

console.log('=== addEventListener Syntax ===\n');

/**
 *   element.addEventListener(type, listener, options);
 *
 *   type     : String - event name ('click', 'submit', etc.)
 *   listener : Function - called when event occurs
 *   options  : Object or Boolean (optional)
 *              { capture: false, once: false, passive: false, signal }
 *              OR just true/false for capture
 *
 */

const syntaxExample = `
// Basic usage
button.addEventListener('click', function(e) {
  console.log('Clicked!');
});

// Arrow function
button.addEventListener('click', (e) => {
  console.log('Clicked!');
});

// Named function (recommended for removal)
function handleClick(e) {
  console.log('Clicked!');
}
button.addEventListener('click', handleClick);

// With options
button.addEventListener('click', handleClick, {
  capture: false,  // Bubble phase (default)
  once: true,      // Remove after first trigger
  passive: true    // Won't call preventDefault
});

// Shorthand for capture
button.addEventListener('click', handleClick, true);  // capture: true
`;

console.log(syntaxExample);


// =============================================================================
// removeEventListener
// =============================================================================

console.log('=== removeEventListener ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  REMOVING EVENT LISTENERS                                           │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  CRITICAL: Must pass the SAME function reference!                   │
 *   │                                                                     │
 *   │  ✓ WORKS:                                                           │
 *   │  ────────                                                           │
 *   │  function handler() { }                                             │
 *   │  btn.addEventListener('click', handler);                            │
 *   │  btn.removeEventListener('click', handler);  // Same function!      │
 *   │                                                                     │
 *   │  ✗ DOESN'T WORK:                                                    │
 *   │  ────────────────                                                   │
 *   │  btn.addEventListener('click', function() { });                     │
 *   │  btn.removeEventListener('click', function() { });                  │
 *   │  // Different function objects!                                     │
 *   │                                                                     │
 *   │  ✗ DOESN'T WORK:                                                    │
 *   │  btn.addEventListener('click', () => { });                          │
 *   │  btn.removeEventListener('click', () => { });                       │
 *   │  // Different arrow functions!                                      │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Demonstration
class ListenerDemo {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, fn) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(fn);
    console.log(`  Added listener for '${type}'`);
  }

  removeEventListener(type, fn) {
    const fns = this.listeners.get(type);
    if (fns && fns.has(fn)) {
      fns.delete(fn);
      console.log(`  Removed listener for '${type}'`);
    } else {
      console.log(`  ⚠️ Listener NOT found for '${type}' (different function reference!)`);
    }
  }
}

console.log('Demo: Correct removal');
const demo1 = new ListenerDemo();
function myHandler() {}
demo1.addEventListener('click', myHandler);
demo1.removeEventListener('click', myHandler);  // Works!

console.log('\nDemo: Incorrect removal');
const demo2 = new ListenerDemo();
demo2.addEventListener('click', function() {});
demo2.removeEventListener('click', function() {});  // Doesn't work!


// =============================================================================
// USING AbortController
// =============================================================================

console.log('\n=== Modern: AbortController ===\n');

/**
 *   AbortController provides an elegant way to remove event listeners.
 *   Pass the signal to addEventListener, then call abort() to remove.
 *
 */

const abortExample = `
// Create controller
const controller = new AbortController();

// Add listeners with signal
button.addEventListener('click', handler1, { signal: controller.signal });
button.addEventListener('mouseover', handler2, { signal: controller.signal });
button.addEventListener('focus', handler3, { signal: controller.signal });

// Later: Remove ALL listeners at once!
controller.abort();

// Use case: Cleanup in components
class MyComponent {
  constructor() {
    this.controller = new AbortController();
  }

  mount() {
    document.addEventListener('click', this.onClick, {
      signal: this.controller.signal
    });
    window.addEventListener('resize', this.onResize, {
      signal: this.controller.signal
    });
  }

  unmount() {
    this.controller.abort();  // Clean up ALL listeners
  }
}
`;

console.log(abortExample);


// =============================================================================
// MULTIPLE LISTENERS
// =============================================================================

console.log('=== Multiple Listeners ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  addEventListener allows MULTIPLE handlers per event                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  btn.addEventListener('click', handler1);                           │
 *   │  btn.addEventListener('click', handler2);                           │
 *   │  btn.addEventListener('click', handler3);                           │
 *   │                                                                     │
 *   │  Click → handler1() → handler2() → handler3()                       │
 *   │                                                                     │
 *   │  Order: Same order they were added                                  │
 *   │                                                                     │
 *   │                                                                     │
 *   │  COMPARE: onclick property (only ONE handler)                       │
 *   │  ─────────────────────────────────────────────                      │
 *   │  btn.onclick = handler1;                                            │
 *   │  btn.onclick = handler2;  // Overwrites handler1!                   │
 *   │                                                                     │
 *   │  Click → handler2() only                                            │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulation
class Element {
  constructor(name) {
    this.name = name;
    this.eventListeners = [];
    this.onclick = null;
  }

  addEventListener(type, fn) {
    this.eventListeners.push(fn);
  }

  click() {
    console.log(`\n  Clicked ${this.name}:`);

    // addEventListener handlers
    this.eventListeners.forEach((fn, i) => {
      console.log(`    Handler ${i + 1} runs`);
    });

    // onclick property
    if (this.onclick) {
      console.log('    onclick handler runs');
    }
  }
}

console.log('Multiple addEventListener:');
const btn1 = new Element('button1');
btn1.addEventListener('click', () => {});
btn1.addEventListener('click', () => {});
btn1.addEventListener('click', () => {});
btn1.click();

console.log('\nMultiple onclick = (only last one):');
const btn2 = new Element('button2');
btn2.onclick = () => {};
btn2.onclick = () => {};  // Overwrites!
btn2.onclick = () => {};  // Overwrites again!
btn2.click();


// =============================================================================
// COMMON PATTERNS
// =============================================================================

console.log('\n=== Common Patterns ===\n');

const patterns = `
// Pattern 1: One-time handler
button.addEventListener('click', handler, { once: true });

// Pattern 2: Binding 'this'
class Component {
  constructor(element) {
    this.element = element;
    this.count = 0;

    // Bind to preserve 'this'
    this.handleClick = this.handleClick.bind(this);
    element.addEventListener('click', this.handleClick);
  }

  handleClick() {
    this.count++;  // 'this' works correctly
  }

  destroy() {
    this.element.removeEventListener('click', this.handleClick);
  }
}

// Pattern 3: Arrow function for 'this' (can't be removed!)
class Component2 {
  constructor(element) {
    element.addEventListener('click', (e) => {
      this.count++;  // 'this' works, but can't remove this listener!
    });
  }
}

// Pattern 4: Event delegation
document.addEventListener('click', (e) => {
  const button = e.target.closest('button[data-action]');
  if (button) {
    const action = button.dataset.action;
    handleAction(action);
  }
});
`;

console.log(patterns);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "Explain addEventListener and how to properly remove listeners"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "addEventListener is the modern way to attach event handlers in JavaScript.
 * It takes the event type, a handler function, and optional settings.
 *
 * The main advantage over onclick property is that you can add multiple
 * handlers to the same event. With onclick, each assignment overwrites the
 * previous handler.
 *
 * To remove a listener with removeEventListener, you must pass the exact
 * same function reference that was added. This is a common gotcha - if you
 * use an anonymous function or arrow function inline, you can't remove it
 * because you don't have a reference to it. The solution is to use named
 * functions.
 *
 * Modern browsers also support AbortController for cleanup. You pass a
 * signal to addEventListener, and when you call controller.abort(), all
 * listeners with that signal are removed. This is really clean for
 * component cleanup.
 *
 * There are also useful options: 'once' automatically removes the listener
 * after it fires once, 'passive' tells the browser you won't call
 * preventDefault which helps with scroll performance, and 'capture' makes
 * the handler run during the capture phase instead of bubbling.
 *
 * For class methods, you need to bind 'this' or the method won't have
 * access to the instance. I usually bind in the constructor and store
 * the bound function so I can remove it later."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Multiple handlers per event (vs onclick = only one)
 * ✓ Same function reference needed for removal
 * ✓ Options: once, passive, capture, signal
 * ✓ AbortController for easy cleanup
 * ✓ Bind 'this' for class methods
 *
 */


// RUN: node docs/26-dom-events/08-event-listeners.js
