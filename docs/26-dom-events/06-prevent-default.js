/**
 * DOM EVENTS: 06 - preventDefault()
 *
 * ONE CONCEPT: Stop the browser's default action for an event
 */


// =============================================================================
// WHAT IS DEFAULT BEHAVIOR?
// =============================================================================

/**
 * Default Behavior = What the browser automatically does when an event occurs.
 *
 * Examples:
 * - Click link → Navigate to href
 * - Submit form → Send data and reload page
 * - Click checkbox → Toggle checked state
 * - Right-click → Show context menu
 * - Press key in input → Add character
 *
 * preventDefault() stops these default actions.
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   link.addEventListener('click', function(e) {
 *     e.preventDefault();
 *     console.log('Navigation prevented!');
 *   });
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  EVENT FLOW                                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   1. User clicks link                                                │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   2. Click event created                                             │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   3. Your handler runs                                               │
 *   │      │                                                               │
 *   │      ├─── e.preventDefault() called                                  │
 *   │      │    └── Sets event.defaultPrevented = true                     │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   4. Browser checks: defaultPrevented?                               │
 *   │      │                                                               │
 *   │      ├── true  → Skip navigation ✓                                   │
 *   │      └── false → Navigate to href                                    │
 *   │                                                                      │
 *   │   NOTE: Event still bubbles! Only default action is stopped.         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// COMMON USE CASES
// =============================================================================

console.log('=== Common Use Cases for preventDefault() ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMMON SCENARIOS                                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. FORMS - Prevent page reload                                     │
 *   │     Submit via AJAX instead of traditional form submission          │
 *   │                                                                     │
 *   │  2. LINKS - Single Page App navigation                              │
 *   │     Handle routing in JavaScript instead of full page load          │
 *   │                                                                     │
 *   │  3. CHECKBOXES - Custom toggle logic                                │
 *   │     Validate before allowing state change                           │
 *   │                                                                     │
 *   │  4. KEYBOARD - Custom shortcuts                                     │
 *   │     Ctrl+S for custom save instead of browser save dialog           │
 *   │                                                                     │
 *   │  5. DRAG & DROP - Custom behavior                                   │
 *   │     Prevent default drag behavior                                   │
 *   │                                                                     │
 *   │  6. CONTEXT MENU - Custom right-click menu                          │
 *   │     Replace default context menu                                    │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// EXAMPLES
// =============================================================================

console.log('─── Example 1: Form Submission ───\n');

const formExample = `
const form = document.getElementById('myForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();  // Stop form from submitting normally

  // Get form data
  const formData = new FormData(form);

  // Submit via fetch instead
  fetch('/api/submit', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success!', data);
  });
});
`;
console.log(formExample);


console.log('─── Example 2: SPA Link Navigation ───\n');

const linkExample = `
document.addEventListener('click', function(e) {
  // Check if it's an internal link
  const link = e.target.closest('a[href^="/"]');

  if (link) {
    e.preventDefault();  // Don't navigate normally

    const path = link.getAttribute('href');

    // Use History API for client-side routing
    history.pushState(null, '', path);

    // Load content via JavaScript
    loadPage(path);
  }
});
`;
console.log(linkExample);


console.log('─── Example 3: Custom Keyboard Shortcuts ───\n');

const keyboardExample = `
document.addEventListener('keydown', function(e) {
  // Ctrl+S or Cmd+S
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();  // Stop browser save dialog
    saveDocument();
  }

  // Ctrl+Z - custom undo
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();  // Stop browser undo
    customUndo();
  }
});
`;
console.log(keyboardExample);


console.log('─── Example 4: Custom Context Menu ───\n');

const contextMenuExample = `
element.addEventListener('contextmenu', function(e) {
  e.preventDefault();  // Hide default right-click menu

  // Show custom menu at click position
  showCustomMenu(e.clientX, e.clientY);
});
`;
console.log(contextMenuExample);


console.log('─── Example 5: Form Validation ───\n');

const validationExample = `
checkbox.addEventListener('click', function(e) {
  if (!isUserAllowedToToggle()) {
    e.preventDefault();  // Don't toggle checkbox
    showError('You cannot change this setting');
  }
});

input.addEventListener('keydown', function(e) {
  // Only allow numbers
  if (!/[0-9]/.test(e.key) && e.key.length === 1) {
    e.preventDefault();  // Don't insert character
  }
});
`;
console.log(validationExample);


// =============================================================================
// CHECKING IF PREVENTABLE
// =============================================================================

console.log('=== Checking if Event is Cancelable ===\n');

/**
 *   Not all events can be canceled!
 *
 *   e.cancelable  → true/false
 *
 *   Non-cancelable events:
 *   - scroll
 *   - focus/blur
 *   - load
 *   - etc.
 *
 */

const cancelableCheck = `
element.addEventListener('click', function(e) {
  if (e.cancelable) {
    e.preventDefault();
    console.log('Default prevented');
  } else {
    console.log('This event cannot be canceled');
  }
});

// Check after preventing
element.addEventListener('click', function(e) {
  e.preventDefault();

  if (e.defaultPrevented) {
    console.log('Default was prevented (by this or earlier handler)');
  }
});
`;

console.log('Checking Cancelable:');
console.log(cancelableCheck);


// =============================================================================
// preventDefault vs stopPropagation
// =============================================================================

console.log('=== preventDefault vs stopPropagation ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THEY DO DIFFERENT THINGS!                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  preventDefault()                                                   │
 *   │  ─────────────────                                                  │
 *   │  • Stops BROWSER DEFAULT action                                     │
 *   │  • Event still propagates (bubbles)                                 │
 *   │  • Other handlers still run                                         │
 *   │                                                                     │
 *   │  stopPropagation()                                                  │
 *   │  ──────────────────                                                 │
 *   │  • Stops event from going to PARENT elements                        │
 *   │  • Default action still happens                                     │
 *   │  • Only affects handler execution, not browser behavior             │
 *   │                                                                     │
 *   │                                                                     │
 *   │  You might need BOTH:                                               │
 *   │  ─────────────────────                                              │
 *   │  form.addEventListener('submit', function(e) {                      │
 *   │    e.preventDefault();     // Don't submit form                     │
 *   │    e.stopPropagation();    // Don't let parent know about submit    │
 *   │  });                                                                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Comparison:');
console.log('─────────────────────────────────────────────────────────');
console.log('Method              | Stops Default | Stops Bubbling');
console.log('─────────────────────────────────────────────────────────');
console.log('preventDefault()    | ✓ Yes         | ✗ No');
console.log('stopPropagation()   | ✗ No          | ✓ Yes');
console.log('Both together       | ✓ Yes         | ✓ Yes');


// =============================================================================
// RETURN FALSE (Legacy)
// =============================================================================

console.log('\n=== return false (Legacy Pattern) ===\n');

/**
 *   In old-style event handlers, return false does BOTH:
 *   - preventDefault()
 *   - stopPropagation()
 *
 *   Only works with:
 *   - onclick="return handler()"
 *   - element.onclick = function() { return false; }
 *
 *   Does NOT work with addEventListener!
 */

const returnFalseExample = `
// OLD WAY (still works but not recommended)
<a href="page.html" onclick="return false">Click</a>

// This does NOT work with addEventListener
element.addEventListener('click', function(e) {
  return false;  // Does NOTHING! Must use preventDefault()
});
`;

console.log('return false pattern:');
console.log(returnFalseExample);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What does preventDefault() do?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "preventDefault stops the browser's default action for an event, but it
 * doesn't stop the event from propagating.
 *
 * Different events have different default actions. Clicking a link navigates
 * to the href. Submitting a form sends data and reloads the page. Pressing
 * a key in an input inserts that character. Right-clicking shows the context
 * menu. preventDefault stops these specific browser behaviors.
 *
 * I use it most commonly with form submissions. Instead of letting the form
 * submit normally and reload the page, I call preventDefault and submit via
 * fetch for a better user experience in SPAs. I also use it for custom
 * keyboard shortcuts - to implement Ctrl+S for saving, I need to prevent
 * the browser's default save dialog.
 *
 * It's important to note that preventDefault doesn't stop event propagation.
 * If you click a link inside a div, and both have handlers, both handlers
 * run even if one calls preventDefault. The link just won't navigate.
 * If you need to stop both the default action AND propagation, you need
 * to call both preventDefault and stopPropagation.
 *
 * Not all events are cancelable though. You can check event.cancelable
 * before calling preventDefault. Scroll events, for example, can't be
 * canceled with preventDefault."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Stops browser default action (navigation, form submit, etc.)
 * ✓ Does NOT stop propagation
 * ✓ Common uses: AJAX forms, SPA routing, custom shortcuts
 * ✓ Check event.cancelable - not all events can be prevented
 * ✓ event.defaultPrevented tells if it was already prevented
 *
 */


// RUN: node docs/26-dom-events/06-prevent-default.js
