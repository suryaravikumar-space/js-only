/**
 * DOM EVENTS: 02 - Event Capturing
 *
 * ONE CONCEPT: Events travel DOWN from parent to child before bubbling
 */


// =============================================================================
// WHAT IS EVENT CAPTURING?
// =============================================================================

/**
 * Event Capturing = The FIRST phase where event travels DOWN from window
 *                   to the target element.
 *
 * Also called "trickling" (opposite of bubbling).
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Catching a ball:
 *   - Ball thrown from top (window)
 *   - Falls down through each level
 *   - Each level can "catch" it (capture) before it reaches target
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   Click on <button> inside <div>
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CAPTURING PHASE                                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   window ──────► Start here                                          │
 *   │      │                                                               │
 *   │      ▼  (capturing - going DOWN)                                     │
 *   │   document                                                           │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   <html>                                                             │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   <body>                                                             │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   <div>      ← Capture handler fires HERE (before target!)           │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   <button>   ← TARGET (event finally reaches clicked element)        │
 *   │      │                                                               │
 *   │      ▼  (now bubbling begins - going UP)                             │
 *   │   <div>      ← Bubble handler fires here                             │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   ... back up to window                                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// ENABLING CAPTURE MODE
// =============================================================================

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HOW TO USE CAPTURING                                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  // Method 1: Third argument = true                                 │
 *   │  element.addEventListener('click', handler, true);                  │
 *   │                                                                     │
 *   │  // Method 2: Options object with capture: true                     │
 *   │  element.addEventListener('click', handler, { capture: true });     │
 *   │                                                                     │
 *   │                                                                     │
 *   │  DEFAULT (bubbling):                                                │
 *   │  element.addEventListener('click', handler);        // bubbling     │
 *   │  element.addEventListener('click', handler, false); // bubbling     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// DEMONSTRATION (Simulated)
// =============================================================================

console.log('=== Event Capturing Demo ===\n');

class EventFlowSimulator {
  constructor() {
    this.captureHandlers = new Map();
    this.bubbleHandlers = new Map();
  }

  // Add handler with capture option
  addEventListener(element, handler, capture = false) {
    const map = capture ? this.captureHandlers : this.bubbleHandlers;
    if (!map.has(element)) {
      map.set(element, []);
    }
    map.get(element).push(handler);
  }

  // Simulate click
  click(target, ancestors) {
    const pathDown = ['window', 'document', 'html', 'body', ...ancestors, target];
    const pathUp = [...pathDown].reverse();

    console.log(`Clicked: ${target}\n`);

    // PHASE 1: CAPTURING (top → down)
    console.log('PHASE 1 - CAPTURING (top → down):');
    pathDown.forEach(element => {
      const handlers = this.captureHandlers.get(element) || [];
      if (handlers.length > 0) {
        console.log(`  ↓ ${element} [CAPTURE]`);
        handlers.forEach(h => h({ target, currentTarget: element, phase: 'capture' }));
      } else {
        console.log(`  ↓ ${element}`);
      }
    });

    // PHASE 2: TARGET
    console.log(`\nPHASE 2 - TARGET:`);
    console.log(`  ★ ${target} [TARGET]`);

    // PHASE 3: BUBBLING (down → top)
    console.log('\nPHASE 3 - BUBBLING (down → top):');
    pathUp.forEach(element => {
      const handlers = this.bubbleHandlers.get(element) || [];
      if (handlers.length > 0) {
        console.log(`  ↑ ${element} [BUBBLE]`);
        handlers.forEach(h => h({ target, currentTarget: element, phase: 'bubble' }));
      } else {
        console.log(`  ↑ ${element}`);
      }
    });
  }
}

const sim = new EventFlowSimulator();

// Add CAPTURE handler on div (fires BEFORE button)
sim.addEventListener('div', (e) => {
  console.log(`    → div handler (capture): I see ${e.target} click FIRST!`);
}, true);  // ← capture = true

// Add BUBBLE handler on div (fires AFTER button)
sim.addEventListener('div', (e) => {
  console.log(`    → div handler (bubble): I see ${e.target} click AFTER`);
}, false);  // ← capture = false (bubble)

// Simulate click on button
sim.click('button', ['div']);


// =============================================================================
// ORDER OF EXECUTION
// =============================================================================

console.log('\n=== Execution Order ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HANDLER EXECUTION ORDER                                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Given: Click on <button> inside <div>                              │
 *   │                                                                     │
 *   │  Handlers:                                                          │
 *   │  1. div has capture handler                                         │
 *   │  2. button has handler                                              │
 *   │  3. div has bubble handler                                          │
 *   │                                                                     │
 *   │  Execution Order:                                                   │
 *   │  ─────────────────                                                  │
 *   │  1. div capture   ← FIRST (capturing phase)                         │
 *   │  2. button        ← SECOND (target phase)                           │
 *   │  3. div bubble    ← THIRD (bubbling phase)                          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const browserExample = `
// HTML: <div id="outer"><button id="btn">Click</button></div>

const outer = document.getElementById('outer');
const btn = document.getElementById('btn');

// 1. Capture handler (fires FIRST)
outer.addEventListener('click', () => {
  console.log('1. outer CAPTURE');
}, true);

// 2. Target handler (fires SECOND)
btn.addEventListener('click', () => {
  console.log('2. button TARGET');
});

// 3. Bubble handler (fires LAST)
outer.addEventListener('click', () => {
  console.log('3. outer BUBBLE');
});

// Click button → Output:
// 1. outer CAPTURE
// 2. button TARGET
// 3. outer BUBBLE
`;

console.log('Browser Example:');
console.log(browserExample);


// =============================================================================
// WHEN TO USE CAPTURING
// =============================================================================

console.log('=== When to Use Capturing ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  USE CASES FOR CAPTURING                                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. INTERCEPT BEFORE TARGET                                         │
 *   │     Stop event before it reaches child                              │
 *   │     Example: Block clicks on disabled buttons                       │
 *   │                                                                     │
 *   │  2. FOCUS MANAGEMENT                                                │
 *   │     focusin/focusout bubble, but focus/blur don't                   │
 *   │     Use capture to catch focus/blur on parent                       │
 *   │                                                                     │
 *   │  3. EVENT LOGGING / ANALYTICS                                       │
 *   │     Capture all events at document level                            │
 *   │     Log before any handler can stop propagation                     │
 *   │                                                                     │
 *   │  4. OVERRIDE CHILD BEHAVIOR                                         │
 *   │     Parent can handle event before child sees it                    │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Example: Intercept and block
const interceptExample = `
// Block all clicks on elements with "disabled" class
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('disabled')) {
    e.stopPropagation();  // Stop event here
    e.preventDefault();
    console.log('Click blocked - element is disabled');
  }
}, true);  // ← CAPTURE phase - runs BEFORE target handler
`;

console.log('Intercept Example:');
console.log(interceptExample);


// =============================================================================
// CAPTURE vs BUBBLE COMPARISON
// =============================================================================

console.log('=== Capture vs Bubble ===\n');

console.log('Aspect          | Capturing         | Bubbling');
console.log('----------------|-------------------|-------------------');
console.log('Direction       | Window → Target   | Target → Window');
console.log('Runs            | FIRST             | AFTER target');
console.log('Default         | NO                | YES');
console.log('Enable          | { capture: true } | Default');
console.log('Use case        | Intercept         | Delegation');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What is event capturing?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Event capturing is the first phase of event propagation, where the event
 * travels DOWN from the window through all ancestors to the target element.
 * It happens BEFORE the bubbling phase.
 *
 * By default, event listeners fire during bubbling, not capturing. To listen
 * during the capturing phase, you pass true as the third argument to
 * addEventListener, or use { capture: true } in the options object.
 *
 * The order is: capture handlers fire first (top to bottom), then the target
 * handler, then bubble handlers (bottom to top). So if you add a capture
 * handler on a parent div, and someone clicks a button inside it, the div's
 * capture handler fires BEFORE the button's handler.
 *
 * Capturing is useful when you want to intercept an event before it reaches
 * the target. For example, you might want to block clicks on disabled elements.
 * By using a capture handler on the document, you can catch and stop the event
 * before any child handler runs.
 *
 * It's also useful for analytics - you can log events at the document level
 * during capture before any child handler might call stopPropagation."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ First phase - event goes DOWN (window → target)
 * ✓ Happens BEFORE bubbling
 * ✓ Enable with: addEventListener(event, handler, true)
 * ✓ Use case: Intercept before target
 * ✓ Not default - must explicitly enable
 *
 */


// RUN: node docs/26-dom-events/02-event-capturing.js
