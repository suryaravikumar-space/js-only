/**
 * TOPIC: Accordion Component — Machine Coding Interview
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Track openPanels as a Set. Single-expand mode    ║
 * ║  keeps at most 1 item; multi-expand keeps any number.          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: Think of a paper accordion (zigzag fold). Only one      │
 * │  fold opens at a time in "single" mode. In "multi" mode,        │
 * │  several folds can stay open. Clicking an open fold closes it.  │
 * │  Arrow keys navigate between headers. Enter/Space toggles.      │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────── VISUAL DIAGRAM ───────────────────┐
 * │                                                       │
 * │   ┌─────────────────────────────┐                     │
 * │   │ [v] Section A (open)        │ <-- header          │
 * │   │   Content for section A     │ <-- body (visible)  │
 * │   ├─────────────────────────────┤                     │
 * │   │ [>] Section B (closed)      │                     │
 * │   ├─────────────────────────────┤                     │
 * │   │ [>] Section C (closed)      │                     │
 * │   └─────────────────────────────┘                     │
 * │                                                       │
 * │   click header -> toggle panel                        │
 * │   single mode: openPanels = Set([ clickedId ])        │
 * │   multi mode:  openPanels.add/delete(clickedId)       │
 * └───────────────────────────────────────────────────────┘
 *
 * PROBLEM: Build an accordion with single/multi expand, keyboard nav.
 *
 * APPROACH:
 *  - State: { panels: [...], openPanels: Set, mode, focusIndex }
 *  - toggle(id): single mode clears set; multi mode toggles the id
 *  - Keyboard: ArrowDown/Up moves focus; Enter/Space toggles
 *  - Animated height: concept explanation (max-height transition)
 *
 * RUN: node docs/react/15-machine-coding/04-accordion.js
 */

// --- Data ---
const panels = [
  { id: 'a', title: 'What is React?', content: 'A JavaScript library for building user interfaces.' },
  { id: 'b', title: 'What is JSX?', content: 'A syntax extension that looks like HTML in JavaScript.' },
  { id: 'c', title: 'What are hooks?', content: 'Functions that let you use state and lifecycle in function components.' },
  { id: 'd', title: 'What is the virtual DOM?', content: 'A lightweight copy of the real DOM for efficient diffing.' },
];

// --- State ---
const state = {
  openPanels: new Set(),
  mode: 'single', // 'single' | 'multi'
  focusIndex: 0,
};

// --- Render ---
function render(label) {
  console.log(`\n${label}`);
  console.log(`  mode=${state.mode} | open=[${[...state.openPanels]}] | focus=${state.focusIndex}`);
  console.log('  ┌─────────────────────────────────────────┐');
  panels.forEach((p, i) => {
    const isOpen = state.openPanels.has(p.id);
    const arrow = isOpen ? 'v' : '>';
    const focusMark = i === state.focusIndex ? '*' : ' ';
    console.log(`  │${focusMark}[${arrow}] ${p.title.padEnd(35)}│`);
    if (isOpen) {
      console.log(`  │   ${p.content.padEnd(37)}│`);
    }
    if (i < panels.length - 1) {
      console.log('  ├─────────────────────────────────────────┤');
    }
  });
  console.log('  └─────────────────────────────────────────┘');
}

// --- Toggle ---
function toggle(id) {
  if (state.mode === 'single') {
    if (state.openPanels.has(id)) {
      state.openPanels.clear();
    } else {
      state.openPanels.clear();
      state.openPanels.add(id);
    }
  } else {
    if (state.openPanels.has(id)) {
      state.openPanels.delete(id);
    } else {
      state.openPanels.add(id);
    }
  }
}

function clickPanel(id) {
  toggle(id);
  state.focusIndex = panels.findIndex(p => p.id === id);
  render(`A: Clicked "${id}"`);
}

// --- Keyboard ---
function keyDown(key) {
  if (key === 'ArrowDown') {
    state.focusIndex = Math.min(state.focusIndex + 1, panels.length - 1);
    render(`B: ArrowDown -> focus=${state.focusIndex}`);
  } else if (key === 'ArrowUp') {
    state.focusIndex = Math.max(state.focusIndex - 1, 0);
    render(`B: ArrowUp -> focus=${state.focusIndex}`);
  } else if (key === 'Enter' || key === 'Space') {
    const id = panels[state.focusIndex].id;
    toggle(id);
    render(`C: ${key} on "${id}"`);
  } else if (key === 'Home') {
    state.focusIndex = 0;
    render('B: Home -> focus=0');
  } else if (key === 'End') {
    state.focusIndex = panels.length - 1;
    render(`B: End -> focus=${state.focusIndex}`);
  }
}

function setMode(mode) {
  state.mode = mode;
  state.openPanels.clear();
  render(`D: Mode changed to "${mode}"`);
}

// --- Simulation ---
console.log('=== ACCORDION SIMULATION ===');

console.log('\n--- SINGLE EXPAND MODE ---');
render('E: Initial state');

clickPanel('a');
clickPanel('b');  // a closes, b opens
clickPanel('b');  // b closes (toggle off)
clickPanel('c');

console.log('\n--- KEYBOARD NAVIGATION (single mode) ---');
state.focusIndex = 0;
state.openPanels.clear();
keyDown('ArrowDown');   // focus=1
keyDown('ArrowDown');   // focus=2
keyDown('Enter');       // open c
keyDown('ArrowUp');     // focus=1
keyDown('Space');       // open b, c closes (single mode)

console.log('\n--- MULTI EXPAND MODE ---');
setMode('multi');

clickPanel('a');
clickPanel('c');  // both a and c open
clickPanel('d');  // a, c, d open
clickPanel('a');  // close a -> c, d open

console.log('\n--- Home/End keys ---');
keyDown('Home');
keyDown('End');

console.log('\n--- ANIMATED HEIGHT CONCEPT ---');
console.log('  // CSS approach for smooth expand/collapse:');
console.log('  // .panel-body {');
console.log('  //   max-height: 0;');
console.log('  //   overflow: hidden;');
console.log('  //   transition: max-height 0.3s ease;');
console.log('  // }');
console.log('  // .panel-body.open {');
console.log('  //   max-height: 500px; /* or use ref.scrollHeight */');
console.log('  // }');
console.log('  //');
console.log('  // Better: measure with useRef, set max-height to exact scrollHeight.');

console.log('\n--- ACCESSIBILITY ATTRIBUTES ---');
console.log('  // <button role="heading" aria-level="3"');
console.log('  //   aria-expanded={isOpen}');
console.log('  //   aria-controls="panel-content-id"');
console.log('  //   id="panel-header-id">');
console.log('  // <div role="region"');
console.log('  //   aria-labelledby="panel-header-id"');
console.log('  //   id="panel-content-id"');
console.log('  //   hidden={!isOpen}>');

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How to make accordion controlled vs uncontrolled?
 *    -> Controlled: parent passes openPanels + onChange. Uncontrolled: internal state.
 * 2. How to handle nested accordions?
 *    -> Each level manages its own openPanels state independently.
 * 3. How to handle dynamic panels (add/remove)?
 *    -> Use panel ID (not index) as key; Set operations remain the same.
 * 4. How to lazy-load panel content?
 *    -> Only fetch/render content when panel is first opened.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                             ║
 * ║  "I track open panels in a Set. In single-expand mode,         ║
 * ║  clicking clears the set and adds the clicked ID (or clears    ║
 * ║  if already open). In multi-expand, I toggle the ID in the     ║
 * ║  Set. Keyboard: ArrowUp/Down moves focus index, Enter/Space    ║
 * ║  toggles. For animation, I use max-height transition with      ║
 * ║  the element's scrollHeight. Each header has aria-expanded      ║
 * ║  and aria-controls for accessibility."                          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
