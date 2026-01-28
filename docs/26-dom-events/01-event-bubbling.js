/**
 * DOM EVENTS: 01 - Event Bubbling
 *
 * ONE CONCEPT: Events rise UP from child to parent like bubbles in water
 */


// =============================================================================
// WHAT IS EVENT BUBBLING?
// =============================================================================

/**
 * Event Bubbling = When an event on a child element "bubbles up"
 *                  and triggers handlers on all ancestor elements.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Bubbles in water:
 *   - Drop a pebble at the bottom (child element)
 *   - Bubbles rise to the surface (parent elements)
 *   - Each level gets notified as bubble passes through
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   Click on <span> inside <button> inside <div>
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BUBBLING                                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   HTML Structure:                                                    │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │ <div id="container">                                        │    │
 *   │   │   ┌─────────────────────────────────────────────────────┐   │    │
 *   │   │   │ <button>                                            │   │    │
 *   │   │   │   ┌─────────────────────────────────────────────┐   │   │    │
 *   │   │   │   │ <span>Click Me</span>  ◄─── USER CLICKS     │   │   │    │
 *   │   │   │   └─────────────────────────────────────────────┘   │   │    │
 *   │   │   └─────────────────────────────────────────────────────┘   │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   │                                                                      │
 *   │   Event Flow (Bubbling):                                             │
 *   │                                                                      │
 *   │   <span>      ← Event starts here (target)                           │
 *   │      │                                                               │
 *   │      ▼  (bubble up)                                                  │
 *   │   <button>    ← button's handler fires                               │
 *   │      │                                                               │
 *   │      ▼  (bubble up)                                                  │
 *   │   <div>       ← div's handler fires                                  │
 *   │      │                                                               │
 *   │      ▼  (bubble up)                                                  │
 *   │   <body>      ← body's handler fires                                 │
 *   │      │                                                               │
 *   │      ▼  (bubble up)                                                  │
 *   │   document    ← document's handler fires                             │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   window      ← window's handler fires (end)                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// DEMONSTRATION (Simulated)
// =============================================================================

console.log('=== Event Bubbling Demo ===\n');

// Simulating bubbling
class EventSimulator {
  constructor() {
    this.handlers = new Map();
  }

  on(element, handler) {
    if (!this.handlers.has(element)) {
      this.handlers.set(element, []);
    }
    this.handlers.get(element).push(handler);
  }

  // Simulate click with bubbling
  click(target, ancestors) {
    const path = [target, ...ancestors];
    const event = {
      target: target,
      currentTarget: null,
      type: 'click'
    };

    console.log(`Clicked on: ${target}\n`);
    console.log('Bubbling up:');

    path.forEach(element => {
      event.currentTarget = element;
      const handlers = this.handlers.get(element) || [];

      if (handlers.length > 0) {
        console.log(`  ↑ ${element}`);
        handlers.forEach(h => h(event));
      } else {
        console.log(`  ↑ ${element} (no handler)`);
      }
    });
  }
}

const sim = new EventSimulator();

// Add handlers at different levels
sim.on('span', (e) => console.log(`    → Handler on span: target=${e.target}, currentTarget=${e.currentTarget}`));
sim.on('button', (e) => console.log(`    → Handler on button: target=${e.target}, currentTarget=${e.currentTarget}`));
sim.on('div', (e) => console.log(`    → Handler on div: target=${e.target}, currentTarget=${e.currentTarget}`));

// Simulate click
sim.click('span', ['button', 'div', 'body', 'html', 'document', 'window']);


// =============================================================================
// KEY INSIGHT: target vs currentTarget
// =============================================================================

console.log('\n=== target vs currentTarget ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CRITICAL DIFFERENCE                                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  event.target        = Element that was ACTUALLY clicked            │
 *   │                        (the origin, never changes during bubbling)  │
 *   │                                                                     │
 *   │  event.currentTarget = Element the handler is ATTACHED to           │
 *   │                        (changes as event bubbles up)                │
 *   │                                                                     │
 *   │                                                                     │
 *   │  Example:                                                           │
 *   │  ─────────                                                          │
 *   │  Click <span> inside <button>                                       │
 *   │  Handler is on <button>                                             │
 *   │                                                                     │
 *   │  event.target        = span   (what was clicked)                    │
 *   │  event.currentTarget = button (where handler is)                    │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Browser code example
const browserCode = `
// HTML:
// <div id="parent">
//   <button id="child">
//     <span>Click Me</span>
//   </button>
// </div>

document.getElementById('parent').addEventListener('click', function(e) {
  console.log('target:', e.target);           // span (what was clicked)
  console.log('currentTarget:', e.currentTarget); // div#parent (handler location)
  console.log('this:', this);                 // div#parent (same as currentTarget)
});

// When span is clicked:
// target:        <span>Click Me</span>
// currentTarget: <div id="parent">
// this:          <div id="parent">
`;

console.log('Browser Code:');
console.log(browserCode);


// =============================================================================
// WHY BUBBLING IS USEFUL
// =============================================================================

console.log('=== Why Bubbling is Useful ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  BENEFITS OF BUBBLING                                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. EVENT DELEGATION                                                │
 *   │     One handler on parent instead of many on children               │
 *   │                                                                     │
 *   │     ❌ Bad: Add click handler to each of 1000 list items            │
 *   │     ✓ Good: Add one handler to <ul>, check event.target             │
 *   │                                                                     │
 *   │  2. HANDLE DYNAMIC ELEMENTS                                         │
 *   │     Handler on parent catches events from future children           │
 *   │                                                                     │
 *   │  3. SIMPLER CODE                                                    │
 *   │     Less event listeners = less memory, better performance          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating event delegation
console.log('Event Delegation Example:\n');

const todoList = {
  items: ['Buy milk', 'Walk dog', 'Code'],
  handlers: [],

  addHandler(handler) {
    this.handlers.push(handler);
  },

  // Simulating click on an item
  clickItem(itemIndex) {
    const target = `li:item-${itemIndex}`;
    const event = {
      target: target,
      targetText: this.items[itemIndex]
    };

    // Handler on parent receives all clicks
    this.handlers.forEach(h => h(event));
  }
};

// ONE handler on the list (parent)
todoList.addHandler((e) => {
  console.log(`  Clicked: "${e.targetText}" (target: ${e.target})`);
});

// Click different items
todoList.clickItem(0);
todoList.clickItem(1);
todoList.clickItem(2);


// =============================================================================
// EVENTS THAT DON'T BUBBLE
// =============================================================================

console.log('\n=== Events That Do NOT Bubble ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  NON-BUBBLING EVENTS                                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  focus / blur        - Use focusin / focusout instead               │
 *   │  load / unload       - Only on window                               │
 *   │  scroll              - Only on scrolled element                     │
 *   │  mouseenter / leave  - Use mouseover / mouseout for bubbling        │
 *   │                                                                     │
 *   │  Check with: event.bubbles (true/false)                             │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const nonBubblingEvents = [
  { event: 'focus', bubbles: false, alternative: 'focusin' },
  { event: 'blur', bubbles: false, alternative: 'focusout' },
  { event: 'load', bubbles: false, alternative: 'none' },
  { event: 'mouseenter', bubbles: false, alternative: 'mouseover' },
  { event: 'mouseleave', bubbles: false, alternative: 'mouseout' }
];

console.log('Event            | Bubbles | Alternative');
console.log('-----------------|---------|------------');
nonBubblingEvents.forEach(e => {
  console.log(`${e.event.padEnd(16)} | ${String(e.bubbles).padEnd(7)} | ${e.alternative}`);
});


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What is event bubbling?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Event bubbling is when an event on a child element 'bubbles up' through
 * its ancestors. When you click a button, the click event doesn't just
 * fire on the button - it also fires on the button's parent, grandparent,
 * all the way up to the document and window.
 *
 * This is the default behavior in JavaScript. When you call addEventListener
 * without any options, your handler fires during the bubbling phase.
 *
 * The key thing to understand is the difference between event.target and
 * event.currentTarget. Target is the element that was actually clicked -
 * it never changes. CurrentTarget is the element the handler is attached
 * to - it changes as the event bubbles up.
 *
 * Bubbling enables event delegation, which is a huge performance benefit.
 * Instead of attaching handlers to every item in a list, you attach one
 * handler to the parent. When any child is clicked, the event bubbles up
 * to the parent where your handler catches it. You check event.target to
 * see which child was clicked.
 *
 * Not all events bubble though. Focus, blur, load, and scroll don't bubble.
 * You can check event.bubbles to verify."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Events propagate UP from child to ancestors
 * ✓ Default behavior for most events
 * ✓ target (clicked) vs currentTarget (handler location)
 * ✓ Enables event delegation pattern
 * ✓ Some events don't bubble (focus, blur, load)
 *
 */


// RUN: node docs/26-dom-events/01-event-bubbling.js
