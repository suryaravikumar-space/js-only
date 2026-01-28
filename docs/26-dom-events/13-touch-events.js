/**
 * DOM EVENTS: 13 - Touch Events
 *
 * ONE CONCEPT: Events for touch-screen interactions
 */


// =============================================================================
// TOUCH EVENT TYPES
// =============================================================================

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  TOUCH EVENTS                                                       │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  touchstart  - Finger touches screen                                │
 *   │  touchmove   - Finger moves on screen                               │
 *   │  touchend    - Finger lifts from screen                             │
 *   │  touchcancel - Touch interrupted (call, notification, etc.)         │
 *   │                                                                     │
 *   │                                                                     │
 *   │  COMPARISON WITH MOUSE:                                             │
 *   │  ───────────────────────                                            │
 *   │  touchstart  ≈ mousedown                                            │
 *   │  touchmove   ≈ mousemove                                            │
 *   │  touchend    ≈ mouseup                                              │
 *   │                                                                     │
 *   │  KEY DIFFERENCE: Touch supports MULTIPLE fingers!                   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// TOUCH EVENT PROPERTIES
// =============================================================================

console.log('=== Touch Event Properties ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TouchEvent STRUCTURE                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  event.touches                                                       │
 *   │  ─────────────                                                       │
 *   │  ALL fingers currently on screen (anywhere)                          │
 *   │                                                                      │
 *   │  event.targetTouches                                                 │
 *   │  ─────────────────                                                   │
 *   │  Fingers on THIS element                                             │
 *   │                                                                      │
 *   │  event.changedTouches                                                │
 *   │  ──────────────────                                                  │
 *   │  Fingers that CHANGED (triggered this event)                         │
 *   │  Most useful for touchend (which fingers lifted?)                    │
 *   │                                                                      │
 *   │                                                                      │
 *   │  Each Touch object:                                                  │
 *   │  ┌─────────────────────────────────────────────────────────────────┐ │
 *   │  │  {                                                              │ │
 *   │  │    identifier: 0,    // Unique ID for this finger               │ │
 *   │  │    target: <div>,    // Element originally touched              │ │
 *   │  │    clientX: 150,     // X relative to viewport                  │ │
 *   │  │    clientY: 200,     // Y relative to viewport                  │ │
 *   │  │    pageX: 150,       // X relative to document                  │ │
 *   │  │    pageY: 800,       // Y relative to document                  │ │
 *   │  │    screenX: 150,     // X relative to screen                    │ │
 *   │  │    screenY: 200,     // Y relative to screen                    │ │
 *   │  │    radiusX: 25,      // Touch radius X (finger size)            │ │
 *   │  │    radiusY: 25,      // Touch radius Y                          │ │
 *   │  │    force: 0.5        // Pressure (0-1, if supported)            │ │
 *   │  │  }                                                              │ │
 *   │  └─────────────────────────────────────────────────────────────────┘ │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const touchPropsExample = `
element.addEventListener('touchstart', (e) => {
  // How many fingers?
  console.log('Total touches:', e.touches.length);
  console.log('On this element:', e.targetTouches.length);

  // First finger position
  const touch = e.touches[0];
  console.log('Position:', touch.clientX, touch.clientY);

  // Track specific finger
  const fingerId = touch.identifier;
});

element.addEventListener('touchend', (e) => {
  // Which fingers lifted?
  const lifted = e.changedTouches;
  console.log('Fingers lifted:', lifted.length);

  // Note: e.touches won't include lifted fingers!
});
`;

console.log(touchPropsExample);


// =============================================================================
// BASIC TOUCH HANDLING
// =============================================================================

console.log('=== Basic Touch Handling ===\n');

const basicTouchExample = `
// Single touch tracking
element.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

element.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  // Update position
  element.style.transform = \`translate(\${deltaX}px, \${deltaY}px)\`;
});

element.addEventListener('touchend', (e) => {
  // Touch ended
});
`;

console.log(basicTouchExample);


// =============================================================================
// GESTURE DETECTION
// =============================================================================

console.log('=== Gesture Detection ===\n');

const swipeExample = `
// Swipe Detection
let touchStartX, touchStartY, touchStartTime;

element.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
});

element.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const touchEndTime = Date.now();

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const deltaTime = touchEndTime - touchStartTime;

  // Detect swipe (fast, mostly horizontal/vertical movement)
  const minSwipeDistance = 50;
  const maxSwipeTime = 300;

  if (deltaTime < maxSwipeTime) {
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) {
        console.log('Swipe RIGHT');
      } else {
        console.log('Swipe LEFT');
      }
    } else if (Math.abs(deltaY) > minSwipeDistance) {
      // Vertical swipe
      if (deltaY > 0) {
        console.log('Swipe DOWN');
      } else {
        console.log('Swipe UP');
      }
    }
  }
});
`;

console.log('Swipe Detection:');
console.log(swipeExample);


const pinchExample = `
// Pinch-to-Zoom Detection
let initialDistance = 0;
let currentScale = 1;

element.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    // Two fingers - start pinch
    initialDistance = getDistance(e.touches[0], e.touches[1]);
  }
});

element.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2) {
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scale = currentDistance / initialDistance;

    element.style.transform = \`scale(\${currentScale * scale})\`;
  }
});

element.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) {
    // Update base scale when pinch ends
    // currentScale *= lastScale;
  }
});

function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
`;

console.log('\nPinch-to-Zoom:');
console.log(pinchExample);


// =============================================================================
// TOUCH AND MOUSE COMPATIBILITY
// =============================================================================

console.log('\n=== Touch and Mouse Compatibility ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  IMPORTANT: Touch Devices Emulate Mouse Events!                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  When you tap on touch device:                                      │
 *   │                                                                     │
 *   │  1. touchstart                                                      │
 *   │  2. touchend                                                        │
 *   │  3. (300ms delay on older browsers)                                 │
 *   │  4. mousemove                                                       │
 *   │  5. mousedown                                                       │
 *   │  6. mouseup                                                         │
 *   │  7. click                                                           │
 *   │                                                                     │
 *   │  This means click handlers work on touch!                           │
 *   │  But if you handle touchstart, call preventDefault()                │
 *   │  to avoid double-handling.                                          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const compatibilityExample = `
// Option 1: Use click (works for both)
button.addEventListener('click', handleClick);
// ✓ Simple, works everywhere
// ✗ May have 300ms delay on touch (older browsers)

// Option 2: Handle both separately
button.addEventListener('touchstart', (e) => {
  e.preventDefault();  // Prevent mouse events from firing too
  handleAction();
});
button.addEventListener('click', handleAction);
// ✓ Responsive on touch, still works with mouse
// ✗ More code

// Option 3: Pointer Events (modern, recommended)
button.addEventListener('pointerdown', handleAction);
// ✓ Single API for mouse, touch, and pen
// ✓ No 300ms delay
// ✓ Works everywhere modern

// Check for touch support
if ('ontouchstart' in window) {
  console.log('Touch supported');
}

// Check for pointer support
if (window.PointerEvent) {
  console.log('Pointer Events supported');
}
`;

console.log(compatibilityExample);


// =============================================================================
// PASSIVE TOUCH EVENTS
// =============================================================================

console.log('\n=== Passive Touch Events (Performance) ===\n');

/**
 *   Chrome makes touchstart/touchmove passive by default!
 *
 *   If you need to call preventDefault (e.g., to prevent scrolling),
 *   you MUST explicitly set passive: false.
 */

const passiveExample = `
// This won't prevent scrolling (passive by default in Chrome)
document.addEventListener('touchmove', (e) => {
  e.preventDefault();  // Has no effect! Shows warning.
});

// This WILL prevent scrolling
document.addEventListener('touchmove', (e) => {
  e.preventDefault();  // Works
}, { passive: false });

// Best practice: Use passive when you don't need preventDefault
document.addEventListener('touchmove', trackPosition, { passive: true });
`;

console.log(passiveExample);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "Explain touch events in JavaScript"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Touch events handle multi-touch interactions on mobile devices. The
 * main events are touchstart, touchmove, touchend, and touchcancel.
 *
 * Unlike mouse events, touch events support multiple fingers. The event
 * object has three touch lists: touches (all fingers on screen),
 * targetTouches (fingers on this element), and changedTouches (fingers
 * that triggered this event). Each touch object has position properties
 * like clientX/Y and a unique identifier for tracking specific fingers.
 *
 * For gestures like swipe, I track the start position and time in
 * touchstart, then in touchend calculate the distance and speed. If it's
 * fast enough and far enough, it's a swipe. For pinch-to-zoom, I track
 * the distance between two fingers and scale based on how that changes.
 *
 * An important thing is that touch devices also fire mouse events after
 * touch events for compatibility. If I'm handling touchstart, I usually
 * call preventDefault to stop the redundant mouse events.
 *
 * For modern development, I prefer Pointer Events which unify mouse,
 * touch, and pen into one API. They have better performance and work
 * consistently across devices.
 *
 * Also, Chrome makes touchstart and touchmove passive by default for
 * performance. If you need to prevent scrolling, you must explicitly
 * set { passive: false }."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ touchstart, touchmove, touchend, touchcancel
 * ✓ Multi-touch: touches, targetTouches, changedTouches
 * ✓ Each touch has identifier, clientX/Y, target
 * ✓ Touch devices emit mouse events too
 * ✓ Pointer Events as modern alternative
 * ✓ Passive events for scroll performance
 *
 */


// RUN: node docs/26-dom-events/13-touch-events.js
