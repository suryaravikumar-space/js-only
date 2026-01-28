/**
 * DOM EVENTS: 10 - Mouse Events
 *
 * ONE CONCEPT: All the events triggered by mouse interactions
 */


// =============================================================================
// MOUSE EVENT TYPES
// =============================================================================

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  MOUSE EVENT TYPES                                                  │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  CLICK EVENTS:                                                      │
 *   │  click        - Single left click                                   │
 *   │  dblclick     - Double left click                                   │
 *   │  contextmenu  - Right click (before context menu shows)             │
 *   │  auxclick     - Non-primary button click (middle, back, forward)    │
 *   │                                                                     │
 *   │  BUTTON EVENTS:                                                     │
 *   │  mousedown    - Any button pressed                                  │
 *   │  mouseup      - Any button released                                 │
 *   │                                                                     │
 *   │  MOVEMENT EVENTS:                                                   │
 *   │  mousemove    - Mouse moved (fires A LOT - throttle!)               │
 *   │  mouseenter   - Entered element (doesn't bubble)                    │
 *   │  mouseleave   - Left element (doesn't bubble)                       │
 *   │  mouseover    - Entered element or child (bubbles)                  │
 *   │  mouseout     - Left element or child (bubbles)                     │
 *   │                                                                     │
 *   │  WHEEL EVENT:                                                       │
 *   │  wheel        - Mouse wheel scrolled                                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// CLICK EVENT SEQUENCE
// =============================================================================

console.log('=== Click Event Sequence ===\n');

/**
 *   When user clicks:
 *
 *   1. mousedown   ← Button pressed
 *   2. mouseup     ← Button released
 *   3. click       ← Complete click
 *
 *   Double click:
 *   1. mousedown
 *   2. mouseup
 *   3. click
 *   4. mousedown
 *   5. mouseup
 *   6. click
 *   7. dblclick    ← After both clicks
 *
 */

console.log('Single click fires: mousedown → mouseup → click');
console.log('Double click fires: mousedown → mouseup → click → mousedown → mouseup → click → dblclick');


// =============================================================================
// MOUSE BUTTON DETECTION
// =============================================================================

console.log('\n=== Mouse Button Detection ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  e.button (which button triggered the event)                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  0 = Left button (primary)                                          │
 *   │  1 = Middle button (wheel)                                          │
 *   │  2 = Right button (secondary)                                       │
 *   │  3 = Back button                                                    │
 *   │  4 = Forward button                                                 │
 *   │                                                                     │
 *   │  Note: 'click' event only fires for button 0 (left)                 │
 *   │        Use 'mousedown' or 'auxclick' for other buttons              │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  e.buttons (which buttons are CURRENTLY pressed - bitmask)          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1  = Left button                                                   │
 *   │  2  = Right button                                                  │
 *   │  4  = Middle button                                                 │
 *   │  8  = Back button                                                   │
 *   │  16 = Forward button                                                │
 *   │                                                                     │
 *   │  Combine with bitwise AND to check:                                 │
 *   │  if (e.buttons & 1) // Left pressed                                 │
 *   │  if (e.buttons & 2) // Right pressed                                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const buttonExample = `
element.addEventListener('mousedown', (e) => {
  switch (e.button) {
    case 0: console.log('Left click'); break;
    case 1: console.log('Middle click'); break;
    case 2: console.log('Right click'); break;
  }
});

// Check if left button is held during move
element.addEventListener('mousemove', (e) => {
  if (e.buttons & 1) {
    console.log('Dragging with left button');
  }
});
`;

console.log(buttonExample);


// =============================================================================
// POSITION PROPERTIES
// =============================================================================

console.log('=== Position Properties ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │                         MONITOR SCREEN                               │
 *   │   ┌──────────────────────────────────────────────────────────────┐   │
 *   │   │ screenX/screenY (monitor coordinates)                        │   │
 *   │   │   ┌────────────────────────────────────────────────────────┐ │   │
 *   │   │   │ BROWSER WINDOW                                         │ │   │
 *   │   │   │   ┌──────────────────────────────────────────────────┐ │ │   │
 *   │   │   │   │ VIEWPORT clientX/clientY                         │ │ │   │
 *   │   │   │   │                                                  │ │ │   │
 *   │   │   │   │  ┌─────────────────────────────────────────────┐ │ │ │   │
 *   │   │   │   │  │ DOCUMENT pageX/pageY                        │ │ │ │   │
 *   │   │   │   │  │ (scrolled content)                          │ │ │ │   │
 *   │   │   │   │  │                                             │ │ │ │   │
 *   │   │   │   │  │   ┌──────────────┐                          │ │ │ │   │
 *   │   │   │   │  │   │ ELEMENT      │                          │ │ │ │   │
 *   │   │   │   │  │   │ offsetX/Y    │                          │ │ │ │   │
 *   │   │   │   │  │   │      ×       │ ← Click                  │ │ │ │   │
 *   │   │   │   │  │   └──────────────┘                          │ │ │ │   │
 *   │   │   │   │  │                                             │ │ │ │   │
 *   │   │   │   │  └─────────────────────────────────────────────┘ │ │ │   │
 *   │   │   │   └──────────────────────────────────────────────────┘ │ │   │
 *   │   │   └────────────────────────────────────────────────────────┘ │   │
 *   │   └──────────────────────────────────────────────────────────────┘   │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Position Properties:');
console.log('  clientX/Y  - Relative to viewport (what you see)');
console.log('  pageX/Y    - Relative to document (includes scroll)');
console.log('  screenX/Y  - Relative to monitor screen');
console.log('  offsetX/Y  - Relative to target element');

const positionExample = `
element.addEventListener('click', (e) => {
  console.log('Viewport:', e.clientX, e.clientY);
  console.log('Document:', e.pageX, e.pageY);
  console.log('Element:', e.offsetX, e.offsetY);
});

// pageX = clientX + window.scrollX
// pageY = clientY + window.scrollY
`;

console.log('\n' + positionExample);


// =============================================================================
// MOUSEENTER vs MOUSEOVER
// =============================================================================

console.log('=== mouseenter vs mouseover ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THE KEY DIFFERENCE                                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  <div id="parent">                                                  │
 *   │    <span id="child">Text</span>                                     │
 *   │  </div>                                                             │
 *   │                                                                     │
 *   │  mouseenter/mouseleave:                                             │
 *   │  • Fire ONLY when entering/leaving the element itself               │
 *   │  • Moving to child does NOT trigger mouseleave on parent            │
 *   │  • Does NOT bubble                                                  │
 *   │                                                                     │
 *   │  mouseover/mouseout:                                                │
 *   │  • Fire when entering/leaving element OR any descendant             │
 *   │  • Moving from parent to child triggers mouseout on parent          │
 *   │  • DOES bubble                                                      │
 *   │                                                                     │
 *   │  RECOMMENDATION:                                                    │
 *   │  Use mouseenter/mouseleave for hover effects                        │
 *   │  Use mouseover/mouseout for event delegation                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('mouseenter/mouseleave: Better for hover effects');
console.log('mouseover/mouseout: Better for event delegation');

const hoverExample = `
// Hover effect (use mouseenter/mouseleave)
element.addEventListener('mouseenter', () => {
  element.classList.add('hover');
});
element.addEventListener('mouseleave', () => {
  element.classList.remove('hover');
});

// Event delegation (use mouseover/mouseout because they bubble)
list.addEventListener('mouseover', (e) => {
  const item = e.target.closest('li');
  if (item) item.classList.add('hover');
});
list.addEventListener('mouseout', (e) => {
  const item = e.target.closest('li');
  if (item) item.classList.remove('hover');
});
`;

console.log('\n' + hoverExample);


// =============================================================================
// PRACTICAL EXAMPLES
// =============================================================================

console.log('=== Practical Examples ===\n');

const dragExample = `
// Simple Drag Implementation
let isDragging = false;
let startX, startY;

element.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - element.offsetLeft;
  startY = e.clientY - element.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  element.style.left = (e.clientX - startX) + 'px';
  element.style.top = (e.clientY - startY) + 'px';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
`;

console.log('Drag Implementation:');
console.log(dragExample);

const contextMenuExample = `
// Custom Right-Click Menu
element.addEventListener('contextmenu', (e) => {
  e.preventDefault();  // Block default menu

  customMenu.style.left = e.clientX + 'px';
  customMenu.style.top = e.clientY + 'px';
  customMenu.classList.add('visible');
});

// Close on click outside
document.addEventListener('click', () => {
  customMenu.classList.remove('visible');
});
`;

console.log('\nCustom Context Menu:');
console.log(contextMenuExample);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "Explain mouse events in JavaScript"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "JavaScript has several mouse events. Click events include click for
 * single left click, dblclick for double click, and contextmenu for right
 * click. There's also mousedown and mouseup which fire when buttons are
 * pressed and released.
 *
 * For movement, there's mousemove which fires constantly as the mouse
 * moves - you usually want to throttle this for performance. Then there
 * are pairs: mouseenter/mouseleave and mouseover/mouseout. The enter/leave
 * pair only fires when entering or leaving the element itself. The
 * over/out pair fires when moving to child elements too. I use enter/leave
 * for hover effects and over/out for event delegation since it bubbles.
 *
 * The event object has useful properties. For buttons, e.button tells you
 * which button triggered the event - 0 for left, 1 for middle, 2 for right.
 * For position, clientX/Y gives viewport coordinates, pageX/Y gives
 * document coordinates including scroll, and offsetX/Y gives position
 * relative to the clicked element.
 *
 * A common pattern is implementing drag - you track mousedown to start,
 * mousemove on the document to update position, and mouseup to stop.
 * You attach move and up to document so dragging continues even if the
 * mouse leaves the element."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Click sequence: mousedown → mouseup → click
 * ✓ e.button (0=left, 1=middle, 2=right)
 * ✓ Position: clientX/Y (viewport), pageX/Y (document), offsetX/Y (element)
 * ✓ mouseenter/leave vs mouseover/out
 * ✓ Throttle mousemove for performance
 *
 */


// RUN: node docs/26-dom-events/10-mouse-events.js
