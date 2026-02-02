/**
 * DOM EVENTS: 04 - The Event Object
 *
 * ONE CONCEPT: Event handlers receive an object with all information about the event
 */


// =============================================================================
// WHAT IS THE EVENT OBJECT?
// =============================================================================

/**
 * Event Object = An object automatically passed to event handlers
 *                containing all information about the event.
 *
 * Contains:
 * - What element was interacted with
 * - What type of event occurred
 * - Position, keys pressed, etc.
 * - Methods to control event behavior
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   element.addEventListener('click', function(event) { ... });
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  EVENT OBJECT STRUCTURE                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  When click happens:                                                 │
 *   │                                                                      │
 *   │  ┌─────────────────────────────────────────────────────────────────┐ │
 *   │  │  MouseEvent {                                                   │ │
 *   │  │                                                                 │ │
 *   │  │    // COMMON TO ALL EVENTS                                      │ │
 *   │  │    type: 'click',          ← Event name                         │ │
 *   │  │    target: <button>,       ← Element clicked                    │ │
 *   │  │    currentTarget: <div>,   ← Element with handler               │ │
 *   │  │    eventPhase: 2,          ← 1=capture, 2=target, 3=bubble      │ │
 *   │  │    bubbles: true,          ← Does this event bubble?            │ │
 *   │  │    cancelable: true,       ← Can preventDefault?                │ │
 *   │  │    timeStamp: 12345.67,    ← When event fired                   │ │
 *   │  │                                                                 │ │
 *   │  │    // MOUSE-SPECIFIC                                            │ │
 *   │  │    clientX: 150,           ← X relative to viewport             │ │
 *   │  │    clientY: 200,           ← Y relative to viewport             │ │
 *   │  │    pageX: 150,             ← X relative to document             │ │
 *   │  │    pageY: 800,             ← Y relative to document             │ │
 *   │  │    button: 0,              ← Which button (0=left, 2=right)     │ │
 *   │  │    buttons: 1,             ← Buttons pressed (bitmask)          │ │
 *   │  │                                                                 │ │
 *   │  │    // MODIFIER KEYS                                             │ │
 *   │  │    ctrlKey: false,         ← Ctrl pressed?                      │ │
 *   │  │    shiftKey: false,        ← Shift pressed?                     │ │
 *   │  │    altKey: false,          ← Alt pressed?                       │ │
 *   │  │    metaKey: false,         ← Cmd/Win pressed?                   │ │
 *   │  │                                                                 │ │
 *   │  │    // METHODS                                                   │ │
 *   │  │    preventDefault(),       ← Stop default action                │ │
 *   │  │    stopPropagation(),      ← Stop bubbling                      │ │
 *   │  │    stopImmediatePropagation()  ← Stop all handlers              │ │
 *   │  │  }                                                              │ │
 *   │  └─────────────────────────────────────────────────────────────────┘ │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// CORE PROPERTIES (All Events)
// =============================================================================

console.log('=== Core Event Properties ===\n');

// Simulating an event object
const mockEvent = {
  // Identity
  type: 'click',
  target: '<button id="submit">',
  currentTarget: '<form>',

  // Phase
  eventPhase: 3,  // 1=capture, 2=target, 3=bubble
  bubbles: true,
  cancelable: true,

  // Timing
  timeStamp: 1706380000000,

  // State
  defaultPrevented: false,
  isTrusted: true  // true = user action, false = script-generated
};

console.log('Event Properties:');
Object.entries(mockEvent).forEach(([key, value]) => {
  console.log(`  ${key.padEnd(18)}: ${value}`);
});


// =============================================================================
// target vs currentTarget
// =============================================================================

console.log('\n=== target vs currentTarget ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THE MOST IMPORTANT DISTINCTION                                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  event.target                                                       │
 *   │  ─────────────                                                      │
 *   │  The element that TRIGGERED the event (was actually clicked)        │
 *   │  NEVER changes during bubbling/capturing                            │
 *   │                                                                     │
 *   │  event.currentTarget                                                │
 *   │  ────────────────────                                               │
 *   │  The element the handler is ATTACHED to                             │
 *   │  CHANGES as event propagates                                        │
 *   │  Same as 'this' in regular functions (not arrow functions)          │
 *   │                                                                     │
 *   │                                                                     │
 *   │  Example:                                                           │
 *   │  ─────────                                                          │
 *   │  <div id="parent">           ← Handler attached here                │
 *   │    <button id="child">       ← User clicks here                     │
 *   │      <span>Click</span>      ← Actual click target                  │
 *   │    </button>                                                        │
 *   │  </div>                                                             │
 *   │                                                                     │
 *   │  e.target        = <span>    (what was clicked)                     │
 *   │  e.currentTarget = <div>     (where handler is)                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulation
function simulateTargetVsCurrentTarget() {
  const elements = [
    { name: 'span (clicked)', isTarget: true },
    { name: 'button (parent)', hasHandler: false },
    { name: 'div (handler)', hasHandler: true }
  ];

  console.log('Click on <span> inside <button> inside <div>:\n');

  const target = elements.find(e => e.isTarget).name;

  elements.forEach(el => {
    if (el.hasHandler) {
      console.log(`Handler on ${el.name}:`);
      console.log(`  event.target        = ${target}`);
      console.log(`  event.currentTarget = ${el.name}`);
    }
  });
}

simulateTargetVsCurrentTarget();


// =============================================================================
// MOUSE EVENT PROPERTIES
// =============================================================================

console.log('\n=== Mouse Event Properties ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  POSITION PROPERTIES                                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  clientX / clientY  - Position relative to VIEWPORT                 │
 *   │                       (what you see on screen)                      │
 *   │                                                                     │
 *   │  pageX / pageY      - Position relative to DOCUMENT                 │
 *   │                       (includes scroll offset)                      │
 *   │                                                                     │
 *   │  screenX / screenY  - Position relative to MONITOR                  │
 *   │                       (rarely needed)                               │
 *   │                                                                     │
 *   │  offsetX / offsetY  - Position relative to TARGET ELEMENT           │
 *   │                       (useful for canvas, etc.)                     │
 *   │                                                                     │
 *   │                                                                     │
 *   │  ┌─────────── SCREEN ───────────┐                                   │
 *   │  │  screenX/Y                   │                                   │
 *   │  │  ┌────── VIEWPORT ──────┐    │                                   │
 *   │  │  │  clientX/Y           │    │                                   │
 *   │  │  │                      │    │                                   │
 *   │  │  │  ┌─ DOCUMENT ──────┐ │    │                                   │
 *   │  │  │  │  pageX/Y        │ │    │                                   │
 *   │  │  │  │                 │ │    │                                   │
 *   │  │  │  │  ┌─ ELEMENT ─┐  │ │    │                                   │
 *   │  │  │  │  │ offsetX/Y │  │ │    │                                   │
 *   │  │  │  │  │    ×      │  │ │    │ ← Click                           │
 *   │  │  │  │  └───────────┘  │ │    │                                   │
 *   │  │  │  └─────────────────┘ │    │                                   │
 *   │  │  └──────────────────────┘    │                                   │
 *   │  └──────────────────────────────┘                                   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const positions = [
  { prop: 'clientX/Y', desc: 'Viewport position (visible area)' },
  { prop: 'pageX/Y', desc: 'Document position (with scroll)' },
  { prop: 'screenX/Y', desc: 'Monitor position' },
  { prop: 'offsetX/Y', desc: 'Element position' }
];

console.log('Position Properties:');
positions.forEach(p => {
  console.log(`  ${p.prop.padEnd(12)}: ${p.desc}`);
});


// =============================================================================
// KEYBOARD EVENT PROPERTIES
// =============================================================================

console.log('\n=== Keyboard Event Properties ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  KEYBOARD PROPERTIES                                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  key      - The actual character ('a', 'Enter', 'ArrowUp')          │
 *   │             USE THIS ONE                                            │
 *   │                                                                     │
 *   │  code     - Physical key ('KeyA', 'Enter', 'ArrowUp')               │
 *   │             Same regardless of keyboard layout                      │
 *   │                                                                     │
 *   │  keyCode  - DEPRECATED, don't use                                   │
 *   │                                                                     │
 *   │                                                                     │
 *   │  Examples:                                                          │
 *   │  ─────────                                                          │
 *   │  Press 'a' key:                                                     │
 *   │    key: 'a', code: 'KeyA'                                           │
 *   │                                                                     │
 *   │  Press 'A' (shift+a):                                               │
 *   │    key: 'A', code: 'KeyA'                                           │
 *   │                                                                     │
 *   │  Press Enter:                                                       │
 *   │    key: 'Enter', code: 'Enter'                                      │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const keyExamples = [
  { press: 'a', key: 'a', code: 'KeyA' },
  { press: 'Shift+A', key: 'A', code: 'KeyA' },
  { press: 'Enter', key: 'Enter', code: 'Enter' },
  { press: 'Space', key: ' ', code: 'Space' },
  { press: 'Arrow Up', key: 'ArrowUp', code: 'ArrowUp' },
  { press: '1 (top row)', key: '1', code: 'Digit1' },
  { press: '1 (numpad)', key: '1', code: 'Numpad1' }
];

console.log('Key Press Examples:');
console.log('Press           | key          | code');
console.log('----------------|--------------|------------');
keyExamples.forEach(k => {
  console.log(`${k.press.padEnd(15)} | ${k.key.padEnd(12)} | ${k.code}`);
});


// =============================================================================
// MODIFIER KEYS
// =============================================================================

console.log('\n=== Modifier Keys ===\n');

/**
 *   Available on both mouse and keyboard events:
 *
 *   e.ctrlKey   - Ctrl (Windows/Linux) / Control (Mac)
 *   e.shiftKey  - Shift
 *   e.altKey    - Alt (Windows/Linux) / Option (Mac)
 *   e.metaKey   - Windows key / Command key (Mac)
 *
 */

const modifierExample = `
// Check for Ctrl+Click
element.addEventListener('click', function(e) {
  if (e.ctrlKey) {
    console.log('Ctrl+Click detected');
  }
});

// Check for Ctrl+S (save shortcut)
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();  // Stop browser save dialog
    saveDocument();
  }
});
`;

console.log('Modifier Key Examples:');
console.log(modifierExample);


// =============================================================================
// EVENT METHODS
// =============================================================================

console.log('=== Event Methods ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CONTROL METHODS                                                    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  e.preventDefault()                                                 │
 *   │    Stops default browser action                                     │
 *   │    Examples: form submit, link navigation, checkbox toggle          │
 *   │                                                                     │
 *   │  e.stopPropagation()                                                │
 *   │    Stops event from bubbling to parent elements                     │
 *   │    Other handlers on SAME element still run                         │
 *   │                                                                     │
 *   │  e.stopImmediatePropagation()                                       │
 *   │    Stops bubbling AND stops other handlers on same element          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Method              | Effect');
console.log('--------------------|------------------------------------------');
console.log('preventDefault()    | Stops default action (form submit, etc.)');
console.log('stopPropagation()   | Stops bubbling, same-element handlers run');
console.log('stopImmediate...()  | Stops bubbling AND same-element handlers');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "Explain the event object in JavaScript"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "When an event fires, the browser creates an event object and passes it
 * to the handler function. This object contains all the information about
 * what happened.
 *
 * The most important properties are target and currentTarget. Target is the
 * element that was actually clicked - it never changes during bubbling.
 * CurrentTarget is the element the handler is attached to - it changes as
 * the event propagates. This distinction is crucial for event delegation.
 *
 * For mouse events, you get position information: clientX/Y for viewport
 * position, pageX/Y for document position including scroll. For keyboard
 * events, you get key for the actual character and code for the physical
 * key. There are also modifier properties like ctrlKey, shiftKey for
 * detecting key combinations.
 *
 * The event object also has methods. preventDefault stops the default browser
 * action - like preventing a form from submitting or a link from navigating.
 * stopPropagation stops the event from bubbling to parent elements.
 *
 * The type property tells you the event name, bubbles tells you if it
 * bubbles, and isTrusted tells you if it was a real user action or
 * triggered by JavaScript."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Object passed to event handlers automatically
 * ✓ target (clicked) vs currentTarget (handler location)
 * ✓ Position: clientX/Y (viewport), pageX/Y (document)
 * ✓ Keyboard: key (character), code (physical key)
 * ✓ Methods: preventDefault(), stopPropagation()
 *
 */


// RUN: node docs/26-dom-events/04-event-object.js
