/**
 * DOM EVENTS: 14 - Interview Cheat Sheet
 *
 * Quick reference for all event concepts - what to say in 30 seconds each
 */


// =============================================================================
// QUICK CONCEPT SUMMARY
// =============================================================================

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  EVENT FLOW                                                            │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  EVENT PROPAGATION                                                      │
 *   │  "Events travel in 3 phases: Capturing (down), Target, Bubbling (up)"   │
 *   │  By default, listeners fire during bubbling phase.                      │
 *   │                                                                         │
 *   │  BUBBLING                                                               │
 *   │  "Event goes UP from child to parent. Enables event delegation."        │
 *   │  Example: Click on button → fires on parent div → body → document       │
 *   │                                                                         │
 *   │  CAPTURING                                                              │
 *   │  "Event goes DOWN from window to target. Enable with { capture: true }" │
 *   │  Use to intercept events before they reach target.                      │
 *   │                                                                         │
 *   │  EVENT DELEGATION                                                       │
 *   │  "One listener on parent handles events for all children."              │
 *   │  Better performance, works for dynamic elements.                        │
 *   │  Use event.target and closest() to identify clicked element.            │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  EVENT OBJECT                                                           │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  target vs currentTarget                                                │
 *   │  • target: element that was ACTUALLY clicked (never changes)            │
 *   │  • currentTarget: element the handler is ATTACHED to                    │
 *   │                                                                         │
 *   │  Key Properties                                                         │
 *   │  • type: event name ('click', 'submit')                                 │
 *   │  • clientX/Y: viewport position                                         │
 *   │  • pageX/Y: document position (includes scroll)                         │
 *   │  • key/code: keyboard key (character vs physical key)                   │
 *   │  • ctrlKey, shiftKey, altKey, metaKey: modifier states                  │
 *   │                                                                         │
 *   │  Key Methods                                                            │
 *   │  • preventDefault(): stops browser default action                       │
 *   │  • stopPropagation(): stops bubbling to parents                         │
 *   │  • stopImmediatePropagation(): stops all handlers                       │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  EVENT LISTENERS                                                        │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  addEventListener                                                        │
 *   │  "Modern way. Multiple handlers per event. Has options."                │
 *   │  element.addEventListener('click', fn, { once, passive, capture })      │
 *   │                                                                         │
 *   │  removeEventListener                                                     │
 *   │  "Must pass SAME function reference. Named functions only."             │
 *   │                                                                         │
 *   │  Options                                                                │
 *   │  • once: auto-remove after first trigger                                │
 *   │  • passive: won't call preventDefault (scroll performance)              │
 *   │  • capture: fire during capturing phase                                 │
 *   │  • signal: AbortController for easy cleanup                             │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// CODE SNIPPETS
// =============================================================================

console.log('=== DOM Events Cheat Sheet ===\n');

// Event Delegation
console.log('─── Event Delegation ───');
const delegationCode = `
list.addEventListener('click', (e) => {
  const item = e.target.closest('li');
  if (item) handleItemClick(item);
});`;
console.log(delegationCode);

// Keyboard Shortcut
console.log('\n─── Keyboard Shortcut ───');
const keyboardCode = `
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveDocument();
  }
});`;
console.log(keyboardCode);

// Form Submission
console.log('\n─── Form Submission ───');
const formCode = `
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  fetch('/api', { method: 'POST', body: data });
});`;
console.log(formCode);

// Custom Event
console.log('\n─── Custom Event ───');
const customCode = `
// Dispatch
const event = new CustomEvent('cart:add', { detail: { id: 1 }, bubbles: true });
element.dispatchEvent(event);

// Listen
document.addEventListener('cart:add', (e) => console.log(e.detail));`;
console.log(customCode);

// Once + Passive
console.log('\n─── Listener Options ───');
const optionsCode = `
// One-time handler
btn.addEventListener('click', init, { once: true });

// Performance scroll
window.addEventListener('scroll', onScroll, { passive: true });

// AbortController cleanup
const controller = new AbortController();
window.addEventListener('resize', onResize, { signal: controller.signal });
controller.abort();  // Remove listener`;
console.log(optionsCode);


// =============================================================================
// QUICK REFERENCE TABLE
// =============================================================================

console.log('\n=== Quick Reference ===\n');

console.log('┌────────────────────┬────────────────────────────────────────────────┐');
console.log('│ NEED               │ USE                                            │');
console.log('├────────────────────┼────────────────────────────────────────────────┤');
console.log('│ Handle many items  │ Event delegation (one listener on parent)      │');
console.log('│ Stop page reload   │ e.preventDefault()                             │');
console.log('│ Stop bubbling      │ e.stopPropagation()                            │');
console.log('│ Stop all handlers  │ e.stopImmediatePropagation()                   │');
console.log('│ What was clicked   │ e.target                                       │');
console.log('│ Handler location   │ e.currentTarget                                │');
console.log('│ Run once           │ { once: true }                                 │');
console.log('│ Better scroll perf │ { passive: true }                              │');
console.log('│ Capture phase      │ { capture: true }                              │');
console.log('│ Easy cleanup       │ AbortController + { signal }                   │');
console.log('│ Keyboard char      │ e.key                                          │');
console.log('│ Physical key       │ e.code                                         │');
console.log('│ Live input updates │ "input" event                                  │');
console.log('│ Committed value    │ "change" event                                 │');
console.log('│ Focus delegation   │ "focusin"/"focusout" (they bubble)             │');
console.log('└────────────────────┴────────────────────────────────────────────────┘');


// =============================================================================
// COMMON INTERVIEW QUESTIONS
// =============================================================================

console.log('\n=== Common Interview Questions ===\n');

/**
 *
 *   Q: "What is event bubbling?"
 *   A: "Events propagate UP from child to parent elements. When you click
 *      a button, the click event fires on the button, then its parent,
 *      then grandparent, up to document. Default behavior in JS."
 *
 *
 *   Q: "What is event delegation?"
 *   A: "Adding one listener to a parent instead of many to children.
 *      Uses bubbling - child clicks bubble up to parent. Check event.target
 *      to see what was clicked. Better performance, works for dynamic content."
 *
 *
 *   Q: "Difference between target and currentTarget?"
 *   A: "target is the element that was actually clicked - never changes.
 *      currentTarget is where the handler is attached - changes during
 *      propagation."
 *
 *
 *   Q: "preventDefault vs stopPropagation?"
 *   A: "preventDefault stops the browser's default action (form submit,
 *      link navigation). stopPropagation stops the event from going to
 *      parent elements. They do different things."
 *
 *
 *   Q: "How to remove an event listener?"
 *   A: "Use removeEventListener with the exact same function reference.
 *      Anonymous functions can't be removed. For modern code, use
 *      AbortController with the signal option."
 *
 *
 *   Q: "What are passive event listeners?"
 *   A: "Passive listeners promise not to call preventDefault. This lets
 *      the browser start scrolling immediately without waiting for JS.
 *      Important for touch/scroll performance. Chrome makes some events
 *      passive by default."
 *
 *
 *   Q: "Difference between input and change events?"
 *   A: "input fires on every keystroke - good for live features. change
 *      fires when value is committed (blur or Enter) - good for validation."
 *
 */

const qa = [
  { q: 'Event bubbling?', a: 'Events propagate UP from child to parent' },
  { q: 'Event delegation?', a: 'One parent listener handles all children' },
  { q: 'target vs currentTarget?', a: 'What clicked vs where handler is' },
  { q: 'preventDefault vs stopPropagation?', a: 'Stop browser action vs stop bubbling' },
  { q: 'Remove listener?', a: 'Same function reference, or use AbortController' },
  { q: 'Passive listeners?', a: 'Won\'t preventDefault, better scroll performance' },
  { q: 'input vs change?', a: 'Every keystroke vs value committed' }
];

qa.forEach(({ q, a }) => {
  console.log(`Q: ${q}`);
  console.log(`A: ${a}\n`);
});


// =============================================================================
// EVENT TYPES QUICK LIST
// =============================================================================

console.log('=== Event Types ===\n');

console.log('MOUSE: click, dblclick, mousedown, mouseup, mousemove, mouseenter, mouseleave');
console.log('KEYBOARD: keydown, keyup (avoid keypress - deprecated)');
console.log('FORM: submit, reset, input, change, focus, blur, focusin, focusout');
console.log('TOUCH: touchstart, touchmove, touchend, touchcancel');
console.log('POINTER: pointerdown, pointermove, pointerup (unified mouse/touch)');
console.log('WINDOW: load, DOMContentLoaded, resize, scroll, beforeunload');


// =============================================================================
// THINGS THAT DON'T BUBBLE
// =============================================================================

console.log('\n=== Events That Don\'t Bubble ===\n');
console.log('focus/blur        → Use focusin/focusout');
console.log('mouseenter/leave  → Use mouseover/mouseout');
console.log('load/unload       → Only on window');
console.log('scroll            → Only on scrolled element');


console.log('\n=== Review individual files for detailed examples ===');


// RUN: node docs/26-dom-events/14-interview-cheatsheet.js
