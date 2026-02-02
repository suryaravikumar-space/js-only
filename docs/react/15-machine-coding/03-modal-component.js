/**
 * TOPIC: Modal Component — Machine Coding Interview
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: A modal is a state boolean (isOpen) + portal +   ║
 * ║  focus trap + escape handler + overlay click handler.          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: A modal is a pop-up dialog box. When it opens, the     │
 * │  background freezes (scroll lock), focus is TRAPPED inside      │
 * │  (Tab cycles within modal). Press Escape or click the dark      │
 * │  overlay behind it to close. It renders via a PORTAL so it      │
 * │  escapes parent z-index/overflow issues.                        │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────── VISUAL DIAGRAM ───────────────────┐
 * │                                                       │
 * │   Page                                                │
 * │   ┌─────────────────────────────────────┐             │
 * │   │  [Open Modal button]                │             │
 * │   │                                     │             │
 * │   │   ╔═══ OVERLAY (dark) ═══╗         │             │
 * │   │   ║  ┌─── Modal ────┐    ║         │             │
 * │   │   ║  │ Title     [X]│    ║         │             │
 * │   │   ║  │ Content      │    ║         │             │
 * │   │   ║  │ [Cancel][OK] │    ║         │             │
 * │   │   ║  └──────────────┘    ║         │             │
 * │   │   ╚══════════════════════╝         │             │
 * │   └─────────────────────────────────────┘             │
 * │                                                       │
 * │   Portal: renders modal into document.body            │
 * │   Focus trap: Tab stays inside modal                  │
 * └───────────────────────────────────────────────────────┘
 *
 * PROBLEM: Build a modal with open/close, ESC, overlay click,
 *          focus trap, scroll lock, and portal concept.
 *
 * RUN: node docs/react/15-machine-coding/03-modal-component.js
 */

// --- State ---
const state = {
  isOpen: false,
  bodyScrollLocked: false,
  focusedElement: 'page-button', // simulated focus
  modalContent: '',
};

const MODAL_FOCUSABLES = ['close-btn', 'cancel-btn', 'ok-btn'];
let focusIndex = 0;

// --- Render ---
function render(label) {
  console.log(`\n${label}`);
  console.log(`  isOpen=${state.isOpen} | scrollLock=${state.bodyScrollLocked} | focus="${state.focusedElement}"`);
  if (state.isOpen) {
    console.log('  ╔═══════════════════════════╗');
    console.log('  ║   OVERLAY (click=close)   ║');
    console.log('  ║  ┌─────────────────────┐  ║');
    console.log(`  ║  │ ${state.modalContent.padEnd(19)} │  ║`);
    console.log('  ║  │ [Cancel]      [OK]  │  ║');
    console.log('  ║  └─────────────────────┘  ║');
    console.log('  ╚═══════════════════════════╝');
  } else {
    console.log('  [ Open Modal button ]');
  }
}

// --- Open / Close ---
function openModal(content) {
  state.isOpen = true;
  state.modalContent = content;
  state.bodyScrollLocked = true;
  focusIndex = 0;
  state.focusedElement = MODAL_FOCUSABLES[focusIndex];
  render('A: Modal OPENED');
}

function closeModal(reason) {
  state.isOpen = false;
  state.bodyScrollLocked = false;
  state.focusedElement = 'page-button'; // restore focus to trigger element
  state.modalContent = '';
  render(`B: Modal CLOSED (reason: ${reason})`);
}

// --- Event handlers ---
function pressEscape() {
  if (state.isOpen) {
    console.log('\n  [User pressed Escape]');
    closeModal('escape');
  }
}

function clickOverlay() {
  if (state.isOpen) {
    console.log('\n  [User clicked overlay]');
    closeModal('overlay-click');
  }
}

function clickCloseButton() {
  if (state.isOpen) {
    console.log('\n  [User clicked X button]');
    closeModal('close-button');
  }
}

// --- Focus trap ---
function pressTab(shift = false) {
  if (!state.isOpen) return;
  if (shift) {
    focusIndex = focusIndex <= 0 ? MODAL_FOCUSABLES.length - 1 : focusIndex - 1;
  } else {
    focusIndex = (focusIndex + 1) % MODAL_FOCUSABLES.length;
  }
  state.focusedElement = MODAL_FOCUSABLES[focusIndex];
  console.log(`  [Tab${shift ? '+Shift' : ''}] -> focus="${state.focusedElement}"`);
}

// --- Portal concept ---
function explainPortal() {
  console.log('\n--- PORTAL CONCEPT ---');
  console.log('  // React Portal renders children into a DOM node outside the parent:');
  console.log('  // ReactDOM.createPortal(<Modal />, document.getElementById("modal-root"))');
  console.log('  // This avoids z-index and overflow:hidden issues from ancestors.');
}

// --- Simulation ---
console.log('=== MODAL COMPONENT SIMULATION ===');

render('C: Initial state — modal closed');

console.log('\n--- Opening modal ---');
openModal('Delete this item?');

console.log('\n--- Focus trap demo (Tab cycles within modal) ---');
pressTab();       // cancel-btn
pressTab();       // ok-btn
pressTab();       // wraps to close-btn
pressTab(true);   // shift+tab -> ok-btn

console.log('\n--- Close via Escape ---');
pressEscape();

console.log('\n--- Open again, close via overlay click ---');
openModal('Confirm action?');
clickOverlay();

console.log('\n--- Open again, close via X button ---');
openModal('Settings');
clickCloseButton();

console.log('\n--- Scroll lock demo ---');
openModal('Long form');
console.log(`  Body scroll locked: ${state.bodyScrollLocked}`);
console.log('  // document.body.style.overflow = "hidden"');
closeModal('demo');
console.log(`  Body scroll restored: ${!state.bodyScrollLocked}`);

explainPortal();

console.log('\n--- Focus restore demo ---');
console.log('  Before open: focus on "page-button"');
openModal('Test');
console.log(`  Inside modal: focus on "${state.focusedElement}"`);
closeModal('test');
console.log(`  After close: focus restored to "${state.focusedElement}"`);

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How to stack multiple modals?
 *    -> Maintain an array/stack of modals; only top one traps focus.
 * 2. How to animate open/close?
 *    -> Use CSS transitions + a "closing" state to delay unmount.
 * 3. How to make it accessible (a11y)?
 *    -> role="dialog", aria-modal="true", aria-labelledby, aria-describedby.
 * 4. How to prevent event bubbling to overlay from modal content click?
 *    -> e.stopPropagation() on the modal container's onClick.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                             ║
 * ║  "My Modal uses a boolean isOpen state. It renders via a React ║
 * ║  Portal into document.body to avoid z-index issues. On open,   ║
 * ║  I lock body scroll (overflow:hidden), trap focus with Tab     ║
 * ║  cycling through focusable elements, and listen for Escape.    ║
 * ║  Clicking the overlay (but not modal content, via              ║
 * ║  stopPropagation) also closes. On close, I restore focus to    ║
 * ║  the trigger element and unlock scroll."                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
