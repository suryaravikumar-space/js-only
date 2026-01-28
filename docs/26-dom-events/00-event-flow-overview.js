/**
 * DOM EVENTS: 00 - Event Flow Overview
 *
 * ONE CONCEPT: Events travel through the DOM in three phases
 */


// =============================================================================
// WHAT IS EVENT FLOW?
// =============================================================================

/**
 * Event Flow = The path an event takes through the DOM when triggered.
 *
 * When you click a button, the event doesn't just happen on the button.
 * It travels through the ENTIRE DOM tree!
 *
 *
 * THE THREE PHASES:
 * -----------------
 *
 *   1. CAPTURING PHASE  - Event travels DOWN from window to target
 *   2. TARGET PHASE     - Event reaches the actual element clicked
 *   3. BUBBLING PHASE   - Event travels UP from target to window
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   User clicks <button> inside <div> inside <body>
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  EVENT FLOW                                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   PHASE 1: CAPTURING (top → down)                                    │
 *   │   ─────────────────────────────────                                  │
 *   │                                                                      │
 *   │   window ──────┐                                                     │
 *   │      │         │                                                     │
 *   │      ▼         │ Event travels                                       │
 *   │   document     │ DOWN through                                        │
 *   │      │         │ ancestors                                           │
 *   │      ▼         │                                                     │
 *   │   <html>       │                                                     │
 *   │      │         │                                                     │
 *   │      ▼         │                                                     │
 *   │   <body>       │                                                     │
 *   │      │         │                                                     │
 *   │      ▼         │                                                     │
 *   │   <div>        │                                                     │
 *   │      │         │                                                     │
 *   │      ▼         ▼                                                     │
 *   │   <button> ◄─── PHASE 2: TARGET (event reaches clicked element)      │
 *   │      │                                                               │
 *   │      │                                                               │
 *   │   PHASE 3: BUBBLING (down → top)                                     │
 *   │   ─────────────────────────────────                                  │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   <div>  ──────┐                                                     │
 *   │      │         │                                                     │
 *   │      ▼         │ Event travels                                       │
 *   │   <body>       │ UP through                                          │
 *   │      │         │ ancestors                                           │
 *   │      ▼         │                                                     │
 *   │   <html>       │                                                     │
 *   │      │         │                                                     │
 *   │      ▼         │                                                     │
 *   │   document     │                                                     │
 *   │      │         │                                                     │
 *   │      ▼         ▼                                                     │
 *   │   window ◄───── Event ends here                                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// VISUAL EXAMPLE
// =============================================================================

/**
 *   HTML Structure:
 *   ───────────────
 *
 *   <body>
 *     <div id="outer">
 *       <div id="inner">
 *         <button id="btn">Click Me</button>
 *       </div>
 *     </div>
 *   </body>
 *
 *
 *   When button is clicked, event visits:
 *   ────────────────────────────────────
 *
 *   CAPTURING:  window → document → html → body → outer → inner → button
 *   TARGET:     button (the actual element clicked)
 *   BUBBLING:   button → inner → outer → body → html → document → window
 *
 */


// =============================================================================
// CODE DEMONSTRATION (Simulated)
// =============================================================================

console.log('=== Event Flow Demo (Simulated) ===\n');

// Simulating event flow
function simulateEventFlow() {
  const path = ['window', 'document', 'html', 'body', 'div#outer', 'div#inner', 'button'];

  console.log('CAPTURING PHASE (top → down):');
  path.forEach((el, i) => {
    console.log(`  ${' '.repeat(i * 2)}↓ ${el}`);
  });

  console.log('\nTARGET PHASE:');
  console.log(`  ${'  '.repeat(path.length - 1)}★ button (TARGET)`);

  console.log('\nBUBBLING PHASE (down → top):');
  [...path].reverse().forEach((el, i) => {
    console.log(`  ${' '.repeat((path.length - 1 - i) * 2)}↑ ${el}`);
  });
}

simulateEventFlow();


// =============================================================================
// KEY FACTS
// =============================================================================

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  IMPORTANT FACTS                                                    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. By DEFAULT, listeners fire during BUBBLING phase               │
 *   │     element.addEventListener('click', handler);  // bubbling        │
 *   │                                                                     │
 *   │  2. To listen during CAPTURING, pass true as 3rd argument          │
 *   │     element.addEventListener('click', handler, true);  // capture   │
 *   │                                                                     │
 *   │  3. event.target = element that was CLICKED                        │
 *   │     event.currentTarget = element handler is ATTACHED to           │
 *   │                                                                     │
 *   │  4. Some events DON'T bubble (focus, blur, load, scroll)           │
 *   │                                                                     │
 *   │  5. Can stop propagation at any phase                              │
 *   │     event.stopPropagation()                                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BROWSER CODE EXAMPLE (Would run in browser)
// =============================================================================

const browserExample = `
// HTML: <div id="outer"><button id="btn">Click</button></div>

const outer = document.getElementById('outer');
const btn = document.getElementById('btn');

// Capturing phase (runs FIRST)
outer.addEventListener('click', () => {
  console.log('outer - CAPTURE');
}, true);  // ← true = capturing

// Bubbling phase (runs AFTER target)
outer.addEventListener('click', () => {
  console.log('outer - BUBBLE');
});  // ← default is bubbling

btn.addEventListener('click', () => {
  console.log('button - TARGET');
});

// OUTPUT when button clicked:
// outer - CAPTURE    (capturing phase)
// button - TARGET    (target phase)
// outer - BUBBLE     (bubbling phase)
`;

console.log('\n=== Browser Code Example ===');
console.log(browserExample);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "Explain event flow in the DOM"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "When an event occurs in the DOM, it doesn't just happen on the target
 * element. It goes through three phases.
 *
 * First is the Capturing phase. The event starts at the window and travels
 * DOWN through all ancestors until it reaches the target element.
 *
 * Second is the Target phase. The event reaches the actual element that
 * was clicked or interacted with.
 *
 * Third is the Bubbling phase. The event travels back UP from the target
 * through all ancestors back to the window.
 *
 * By default, event listeners fire during the bubbling phase. If you need
 * to catch an event during capturing, you pass true as the third argument
 * to addEventListener.
 *
 * This is important because it enables patterns like event delegation,
 * where you attach one listener to a parent element instead of many
 * listeners to child elements. When a child is clicked, the event bubbles
 * up to the parent where your handler catches it."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Three phases: Capturing → Target → Bubbling
 * ✓ Default is bubbling phase
 * ✓ Use true for capturing phase
 * ✓ Enables event delegation
 * ✓ Some events don't bubble (focus, blur)
 *
 */


// RUN: node docs/26-dom-events/00-event-flow-overview.js
