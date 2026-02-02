/**
 * DOM EVENTS: 11 - Keyboard Events
 *
 * ONE CONCEPT: Events triggered by keyboard interactions
 */


// =============================================================================
// KEYBOARD EVENT TYPES
// =============================================================================

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THREE KEYBOARD EVENTS                                              │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  keydown   - Key pressed down (fires first)                         │
 *   │             Fires repeatedly if key held                            │
 *   │             USE THIS for most cases                                 │
 *   │                                                                     │
 *   │  keypress  - DEPRECATED! Don't use                                  │
 *   │             Only fired for character keys                           │
 *   │             Doesn't work for Shift, Ctrl, arrows, etc.              │
 *   │                                                                     │
 *   │  keyup     - Key released                                           │
 *   │             Fires once when key is released                         │
 *   │             Use for detecting when to STOP something                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// KEY SEQUENCE
// =============================================================================

console.log('=== Key Event Sequence ===\n');

/**
 *   Press and hold 'a' key:
 *
 *   keydown (key='a')  ← First press
 *   keydown (key='a')  ← Auto-repeat
 *   keydown (key='a')  ← Auto-repeat
 *   keydown (key='a')  ← Auto-repeat
 *   keyup (key='a')    ← Release
 *
 */

console.log('Press and hold key:');
console.log('  keydown (repeat)');
console.log('  keydown (repeat)');
console.log('  keydown (repeat)');
console.log('  keyup   (release)');
console.log('\ne.repeat is true for auto-repeat keydown events');


// =============================================================================
// KEY PROPERTIES: key vs code
// =============================================================================

console.log('\n=== key vs code ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  e.key vs e.code                                                    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  e.key                                                              │
 *   │  ──────                                                             │
 *   │  The CHARACTER produced                                             │
 *   │  Affected by: Shift, Caps Lock, keyboard layout                     │
 *   │  Examples: 'a', 'A', '1', 'Enter', 'ArrowUp'                        │
 *   │                                                                     │
 *   │  e.code                                                             │
 *   │  ────────                                                           │
 *   │  The PHYSICAL KEY pressed                                           │
 *   │  NOT affected by modifiers or layout                                │
 *   │  Examples: 'KeyA', 'Digit1', 'Enter', 'ArrowUp'                     │
 *   │                                                                     │
 *   │                                                                     │
 *   │  USE key FOR:                                                       │
 *   │  • Character input ('a', 'A', '!', etc.)                            │
 *   │  • Text-based shortcuts (Ctrl+S for 's')                            │
 *   │                                                                     │
 *   │  USE code FOR:                                                      │
 *   │  • Game controls (WASD always same physical keys)                   │
 *   │  • Position-based shortcuts (regardless of layout)                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const keyExamples = [
  { action: 'Press a', key: 'a', code: 'KeyA' },
  { action: 'Press Shift+A', key: 'A', code: 'KeyA' },
  { action: 'Press 1 (top row)', key: '1', code: 'Digit1' },
  { action: 'Press Shift+1', key: '!', code: 'Digit1' },
  { action: 'Press Enter', key: 'Enter', code: 'Enter' },
  { action: 'Press Space', key: ' ', code: 'Space' },
  { action: 'Press Arrow Up', key: 'ArrowUp', code: 'ArrowUp' },
  { action: 'Press Escape', key: 'Escape', code: 'Escape' },
  { action: 'Press Tab', key: 'Tab', code: 'Tab' }
];

console.log('Press           | e.key        | e.code');
console.log('----------------|--------------|------------');
keyExamples.forEach(k => {
  const keyDisplay = k.key === ' ' ? '(space)' : k.key;
  console.log(`${k.action.padEnd(15)} | ${keyDisplay.padEnd(12)} | ${k.code}`);
});


// =============================================================================
// MODIFIER KEYS
// =============================================================================

console.log('\n=== Modifier Keys ===\n');

/**
 *   e.ctrlKey   - Ctrl (Win/Linux) / Control (Mac)
 *   e.shiftKey  - Shift
 *   e.altKey    - Alt (Win/Linux) / Option (Mac)
 *   e.metaKey   - Windows key / Command (Mac)
 *
 */

const modifierExample = `
document.addEventListener('keydown', (e) => {
  // Single modifier
  if (e.ctrlKey) console.log('Ctrl is pressed');
  if (e.shiftKey) console.log('Shift is pressed');
  if (e.altKey) console.log('Alt is pressed');
  if (e.metaKey) console.log('Meta (Win/Cmd) is pressed');

  // Keyboard shortcuts
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    saveDocument();
  }

  // Cross-platform (Ctrl on Windows, Cmd on Mac)
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    undo();
  }

  // Complex combos
  if (e.ctrlKey && e.shiftKey && e.key === 'P') {
    e.preventDefault();
    openCommandPalette();
  }
});
`;

console.log(modifierExample);


// =============================================================================
// COMMON PATTERNS
// =============================================================================

console.log('=== Common Patterns ===\n');

// Pattern 1: Keyboard Shortcuts
const shortcutsExample = `
// Keyboard Shortcut Handler
const shortcuts = {
  'ctrl+s': () => saveDocument(),
  'ctrl+z': () => undo(),
  'ctrl+shift+z': () => redo(),
  'escape': () => closeModal(),
  'ctrl+k': () => openSearch()
};

document.addEventListener('keydown', (e) => {
  // Build shortcut string
  let shortcut = '';
  if (e.ctrlKey || e.metaKey) shortcut += 'ctrl+';
  if (e.shiftKey) shortcut += 'shift+';
  if (e.altKey) shortcut += 'alt+';
  shortcut += e.key.toLowerCase();

  if (shortcuts[shortcut]) {
    e.preventDefault();
    shortcuts[shortcut]();
  }
});
`;

console.log('Pattern 1: Keyboard Shortcuts');
console.log(shortcutsExample);


// Pattern 2: Form Submission on Enter
const enterSubmitExample = `
// Submit form on Enter (but not in textarea)
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    form.submit();
  }
});
`;

console.log('\nPattern 2: Enter to Submit');
console.log(enterSubmitExample);


// Pattern 3: Game Controls
const gameControlsExample = `
// Game controls using e.code (physical key position)
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

function gameLoop() {
  if (keys['KeyW'] || keys['ArrowUp']) player.moveUp();
  if (keys['KeyS'] || keys['ArrowDown']) player.moveDown();
  if (keys['KeyA'] || keys['ArrowLeft']) player.moveLeft();
  if (keys['KeyD'] || keys['ArrowRight']) player.moveRight();
  if (keys['Space']) player.jump();

  requestAnimationFrame(gameLoop);
}
`;

console.log('\nPattern 3: Game Controls');
console.log(gameControlsExample);


// Pattern 4: Input Filtering
const inputFilterExample = `
// Only allow numbers in input
input.addEventListener('keydown', (e) => {
  // Allow: backspace, delete, tab, escape, enter, arrows
  const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                   'ArrowLeft', 'ArrowRight', 'Home', 'End'];

  if (allowed.includes(e.key)) return;

  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key)) return;

  // Block non-numbers
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
});
`;

console.log('\nPattern 4: Input Filtering');
console.log(inputFilterExample);


// =============================================================================
// SPECIAL KEY VALUES
// =============================================================================

console.log('\n=== Special Key Values ===\n');

const specialKeys = [
  { name: 'Enter/Return', key: 'Enter', code: 'Enter' },
  { name: 'Escape', key: 'Escape', code: 'Escape' },
  { name: 'Space', key: ' ', code: 'Space' },
  { name: 'Tab', key: 'Tab', code: 'Tab' },
  { name: 'Backspace', key: 'Backspace', code: 'Backspace' },
  { name: 'Delete', key: 'Delete', code: 'Delete' },
  { name: 'Arrow Up', key: 'ArrowUp', code: 'ArrowUp' },
  { name: 'Arrow Down', key: 'ArrowDown', code: 'ArrowDown' },
  { name: 'Arrow Left', key: 'ArrowLeft', code: 'ArrowLeft' },
  { name: 'Arrow Right', key: 'ArrowRight', code: 'ArrowRight' },
  { name: 'Home', key: 'Home', code: 'Home' },
  { name: 'End', key: 'End', code: 'End' },
  { name: 'Page Up', key: 'PageUp', code: 'PageUp' },
  { name: 'Page Down', key: 'PageDown', code: 'PageDown' }
];

console.log('Key Name         | e.key          | e.code');
console.log('-----------------|----------------|----------------');
specialKeys.forEach(k => {
  const keyDisplay = k.key === ' ' ? "' '" : k.key;
  console.log(`${k.name.padEnd(16)} | ${keyDisplay.padEnd(14)} | ${k.code}`);
});


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "Explain keyboard events in JavaScript"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "There are three keyboard events: keydown, keyup, and keypress. I always
 * use keydown because keypress is deprecated. Keydown fires when a key is
 * pressed and repeats if the key is held. Keyup fires once when released.
 *
 * The event object has two important properties for identifying keys:
 * e.key and e.code. Key gives you the character that would be produced,
 * so it's affected by Shift and keyboard layout. Code gives you the
 * physical key position, which is the same regardless of modifiers or
 * layout. I use key for text-related shortcuts like Ctrl+S, and code for
 * game controls where I want WASD to be the same physical keys on any
 * keyboard.
 *
 * For modifier keys, the event has boolean properties: ctrlKey, shiftKey,
 * altKey, and metaKey. To implement shortcuts like Ctrl+S, I check both
 * the modifier and the key: if (e.ctrlKey && e.key === 's'). For
 * cross-platform shortcuts, I check both ctrlKey and metaKey since Mac
 * users expect Cmd instead of Ctrl.
 *
 * To handle multiple keys at once, like in games, I maintain an object
 * tracking which keys are currently pressed. On keydown I set it to true,
 * on keyup I set it to false. Then in the game loop I can check which
 * keys are held.
 *
 * One important thing: if you handle a keyboard shortcut, always call
 * preventDefault to stop the browser's default action."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ keydown (use this) vs keyup vs keypress (deprecated)
 * ✓ e.key (character) vs e.code (physical key)
 * ✓ Modifier properties: ctrlKey, shiftKey, altKey, metaKey
 * ✓ Cross-platform: check both ctrlKey and metaKey for Mac
 * ✓ preventDefault for custom shortcuts
 *
 */


// RUN: node docs/26-dom-events/11-keyboard-events.js
