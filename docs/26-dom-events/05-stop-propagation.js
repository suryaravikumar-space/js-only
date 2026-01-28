/**
 * DOM EVENTS: 05 - stopPropagation vs stopImmediatePropagation
 *
 * ONE CONCEPT: Control how events propagate through the DOM
 */


// =============================================================================
// WHAT DO THESE METHODS DO?
// =============================================================================

/**
 * stopPropagation()          = Stop event from going to PARENT elements
 *                              Other handlers on SAME element still run
 *
 * stopImmediatePropagation() = Stop event from going to PARENTS
 *                              AND stop other handlers on SAME element
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  stopPropagation()                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   Click on <button>                                                  │
 *   │                                                                      │
 *   │   <div> handler1  ────────────────── ✗ NOT called                    │
 *   │       │                              (propagation stopped)           │
 *   │       │                                                              │
 *   │   <button>                                                           │
 *   │     handler1  ──── ✓ RUNS                                            │
 *   │     handler2  ──── ✓ RUNS  (same element handlers still run)         │
 *   │     handler3  ──── ✓ RUNS  calls e.stopPropagation()                 │
 *   │                                                                      │
 *   │   Result: All button handlers run, parent handlers DON'T             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  stopImmediatePropagation()                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   Click on <button>                                                  │
 *   │                                                                      │
 *   │   <div> handler1  ────────────────── ✗ NOT called                    │
 *   │       │                                                              │
 *   │       │                                                              │
 *   │   <button>                                                           │
 *   │     handler1  ──── ✓ RUNS  calls e.stopImmediatePropagation()        │
 *   │     handler2  ──── ✗ NOT called (stopped immediately)                │
 *   │     handler3  ──── ✗ NOT called                                      │
 *   │                                                                      │
 *   │   Result: Only handlers BEFORE the call run                          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// DEMONSTRATION
// =============================================================================

console.log('=== stopPropagation Demo ===\n');

class PropagationSimulator {
  constructor() {
    this.handlers = new Map();
    this.stopped = false;
    this.stoppedImmediate = false;
  }

  addHandler(element, name, callback) {
    if (!this.handlers.has(element)) {
      this.handlers.set(element, []);
    }
    this.handlers.get(element).push({ name, callback });
  }

  click(target, ancestors) {
    this.stopped = false;
    this.stoppedImmediate = false;

    const event = {
      target,
      stopPropagation: () => {
        console.log('    [stopPropagation called]');
        this.stopped = true;
      },
      stopImmediatePropagation: () => {
        console.log('    [stopImmediatePropagation called]');
        this.stopped = true;
        this.stoppedImmediate = true;
      }
    };

    console.log(`Clicked: ${target}\n`);

    // Target handlers
    const targetHandlers = this.handlers.get(target) || [];
    console.log(`Handlers on ${target}:`);
    for (const handler of targetHandlers) {
      if (this.stoppedImmediate) {
        console.log(`  ✗ ${handler.name} - NOT called (immediate stop)`);
      } else {
        console.log(`  ✓ ${handler.name} - RUNS`);
        handler.callback(event);
      }
    }

    // Parent handlers
    console.log(`\nHandlers on ancestors:`);
    for (const ancestor of ancestors) {
      const ancestorHandlers = this.handlers.get(ancestor) || [];
      for (const handler of ancestorHandlers) {
        if (this.stopped) {
          console.log(`  ✗ ${ancestor}.${handler.name} - NOT called (propagation stopped)`);
        } else {
          console.log(`  ✓ ${ancestor}.${handler.name} - RUNS`);
          handler.callback(event);
        }
      }
    }
  }
}

// Demo 1: stopPropagation
console.log('─── Demo 1: stopPropagation() ───\n');

const sim1 = new PropagationSimulator();
sim1.addHandler('button', 'handler1', () => {});
sim1.addHandler('button', 'handler2', (e) => e.stopPropagation());
sim1.addHandler('button', 'handler3', () => {});
sim1.addHandler('div', 'handler1', () => {});

sim1.click('button', ['div']);

// Demo 2: stopImmediatePropagation
console.log('\n─── Demo 2: stopImmediatePropagation() ───\n');

const sim2 = new PropagationSimulator();
sim2.addHandler('button', 'handler1', (e) => e.stopImmediatePropagation());
sim2.addHandler('button', 'handler2', () => {});
sim2.addHandler('button', 'handler3', () => {});
sim2.addHandler('div', 'handler1', () => {});

sim2.click('button', ['div']);


// =============================================================================
// COMPARISON TABLE
// =============================================================================

console.log('\n=== Comparison ===\n');

console.log('Method                    | Same Element | Parent Elements');
console.log('--------------------------|--------------|----------------');
console.log('stopPropagation()         | ✓ Still run  | ✗ Blocked');
console.log('stopImmediatePropagation()| ✗ Blocked    | ✗ Blocked');


// =============================================================================
// PRACTICAL USE CASES
// =============================================================================

console.log('\n=== Use Cases ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHEN TO USE EACH                                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  stopPropagation():                                                 │
 *   │  ─────────────────                                                  │
 *   │  • Modal/dropdown should not close when clicking inside             │
 *   │  • Nested clickable elements (card with delete button)              │
 *   │  • Prevent parent handler from running                              │
 *   │                                                                     │
 *   │  stopImmediatePropagation():                                        │
 *   │  ────────────────────────────                                       │
 *   │  • Override all other handlers                                      │
 *   │  • Analytics blocking / feature flags                               │
 *   │  • Debugging (isolate single handler)                               │
 *   │  • Security: prevent malicious handlers from running                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const useCase1 = `
// USE CASE 1: Modal should not close when clicking inside
// ─────────────────────────────────────────────────────────

document.body.addEventListener('click', () => {
  closeModal();  // Close modal when clicking anywhere
});

modal.addEventListener('click', (e) => {
  e.stopPropagation();  // Clicks inside modal don't close it
});
`;

const useCase2 = `
// USE CASE 2: Card with delete button
// ────────────────────────────────────

// Clicking card opens it
card.addEventListener('click', () => {
  openCard();
});

// Clicking delete button should NOT open card
deleteButton.addEventListener('click', (e) => {
  e.stopPropagation();  // Don't let click reach card
  deleteCard();
});
`;

const useCase3 = `
// USE CASE 3: Completely override behavior
// ────────────────────────────────────────

// Third party library added some handler
button.addEventListener('click', thirdPartyHandler);

// Our handler needs to be the ONLY one that runs
button.addEventListener('click', (e) => {
  e.stopImmediatePropagation();  // Stop all other handlers
  ourCustomHandler();
}, true);  // Capture phase runs first!
`;

console.log('Use Case 1: Modal');
console.log(useCase1);

console.log('Use Case 2: Nested buttons');
console.log(useCase2);

console.log('Use Case 3: Override all handlers');
console.log(useCase3);


// =============================================================================
// CAUTION: DON'T OVERUSE
// =============================================================================

console.log('=== Caution ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  ⚠️  DON'T OVERUSE STOP PROPAGATION                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Problems:                                                          │
 *   │  • Breaks event delegation                                          │
 *   │  • Analytics might miss events                                      │
 *   │  • Other features might depend on bubbling                          │
 *   │  • Hard to debug                                                    │
 *   │                                                                     │
 *   │  Better alternatives:                                               │
 *   │  • Check event.target in parent handler                             │
 *   │  • Use event.defaultPrevented flag                                  │
 *   │  • Design components to not need it                                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const betterAlternative = `
// BETTER: Check target instead of stopping propagation
document.addEventListener('click', (e) => {
  // Don't close modal if click was inside it
  if (e.target.closest('.modal')) {
    return;  // Exit early instead of stopping propagation
  }
  closeModal();
});

// This way, other document-level handlers still work!
`;

console.log('Better Alternative:');
console.log(betterAlternative);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What's the difference between stopPropagation and stopImmediatePropagation?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Both methods stop an event from bubbling up to parent elements, but they
 * differ in how they handle multiple handlers on the same element.
 *
 * stopPropagation stops the event from reaching parent elements, but if there
 * are multiple handlers on the same element, they all still run. For example,
 * if a button has three click handlers and the first one calls stopPropagation,
 * all three handlers run, but the parent div's handler doesn't.
 *
 * stopImmediatePropagation is more aggressive. It stops the event from reaching
 * parents AND stops any remaining handlers on the same element. Using the same
 * example, if the first handler calls stopImmediatePropagation, handlers two
 * and three don't run.
 *
 * I use stopPropagation for things like preventing a modal from closing when
 * you click inside it - the click shouldn't bubble to the document handler
 * that closes the modal. I'd use stopImmediatePropagation in rare cases where
 * I need to completely override behavior, like blocking all handlers when
 * implementing a feature flag.
 *
 * I try to avoid overusing these because they can break event delegation and
 * make debugging harder. Often, checking event.target in the parent handler
 * is a better approach."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ stopPropagation: stops bubbling, same-element handlers still run
 * ✓ stopImmediatePropagation: stops bubbling AND same-element handlers
 * ✓ Use case: Modal clicks, nested interactive elements
 * ✓ Caution: Can break delegation, use sparingly
 *
 */


// RUN: node docs/26-dom-events/05-stop-propagation.js
