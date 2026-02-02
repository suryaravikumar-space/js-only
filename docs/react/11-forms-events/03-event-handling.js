/**
 * TOPIC: Event Handling — SyntheticEvent, Event Pooling, Delegation
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  React wraps native events in SyntheticEvent for      ║
 * ║  cross-browser consistency. Events delegate to root   ║
 * ║  (not individual DOM nodes). Use camelCase: onClick.  ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A translator (Synthetic │
 * │ Event) sits between you │
 * │ and foreign speakers    │
 * │ (browsers). No matter   │
 * │ which browser speaks,   │
 * │ the translator gives    │
 * │ you the same format.    │
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  Native Event (browser) │
 * │    │                    │
 * │    v                    │
 * │  SyntheticEvent (React) │  ← cross-browser wrapper
 * │    │                    │
 * │    v                    │
 * │  Your handler(e)        │
 * │                         │
 * │  Event Delegation:      │
 * │  <div id="root">        │  ← ONE listener here
 * │    <button>             │  ← no listener here!
 * │    <button>             │  ← no listener here!
 * │  </div>                 │
 * └─────────────────────────┘
 */

// --- Simulate SyntheticEvent ---
function createSyntheticEvent(nativeEvent) {
  let defaultPrevented = false;
  let propagationStopped = false;

  return {
    type: nativeEvent.type,
    target: nativeEvent.target,
    currentTarget: nativeEvent.currentTarget,
    nativeEvent,
    preventDefault() {
      defaultPrevented = true;
      console.log("    [synthetic] preventDefault called");
    },
    stopPropagation() {
      propagationStopped = true;
      console.log("    [synthetic] stopPropagation called");
    },
    isDefaultPrevented: () => defaultPrevented,
    isPropagationStopped: () => propagationStopped,
  };
}

// A: SyntheticEvent wraps native event
console.log("A: SyntheticEvent wraps native event");
const nativeClick = { type: "click", target: "button", currentTarget: "button" };
const syntheticClick = createSyntheticEvent(nativeClick);
console.log(`  type: ${syntheticClick.type}`);
console.log(`  target: ${syntheticClick.target}`);
console.log(`  Has nativeEvent: ${!!syntheticClick.nativeEvent}`);

// B: preventDefault
console.log("\nB: preventDefault (e.g., form submit)");
function handleFormSubmit(e) {
  e.preventDefault();
  console.log(`  Form handled without page reload`);
}
handleFormSubmit(createSyntheticEvent({ type: "submit", target: "form", currentTarget: "form" }));

// C: Event delegation simulation
console.log("\nC: Event delegation (React attaches to root)");
function simulateEventDelegation() {
  const rootListeners = {};

  function addEventListener(eventType, selector, handler) {
    if (!rootListeners[eventType]) rootListeners[eventType] = [];
    rootListeners[eventType].push({ selector, handler });
  }

  function dispatchEvent(eventType, target) {
    const listeners = rootListeners[eventType] || [];
    listeners.forEach(({ selector, handler }) => {
      if (target === selector || target.startsWith(selector)) {
        const e = createSyntheticEvent({ type: eventType, target, currentTarget: selector });
        handler(e);
      }
    });
  }

  // Register handlers at root (like React does)
  addEventListener("click", "button#save", (e) => console.log(`  Save clicked: ${e.target}`));
  addEventListener("click", "button#del", (e) => console.log(`  Delete clicked: ${e.target}`));

  // Simulate clicks
  dispatchEvent("click", "button#save");
  dispatchEvent("click", "button#del");
  console.log(`  Only 1 root listener, not 1 per button!`);
}
simulateEventDelegation();

// D: Event pooling (pre-React 17)
console.log("\nD: Event pooling (removed in React 17)");
console.log("  Pre-17: SyntheticEvent was reused (pooled). Accessing e.type");
console.log("  in async callback returned null. Fix: e.persist().");
console.log("  React 17+: No pooling. Events work normally in async code.");

// E: Passing arguments to handlers
console.log("\nE: Passing arguments to event handlers");
function handleClick(id, e) {
  console.log(`  Clicked item ${id}, event type: ${e.type}`);
}
// In React: onClick={(e) => handleClick(42, e)}
const e = createSyntheticEvent({ type: "click", target: "li", currentTarget: "li" });
handleClick(42, e);
handleClick(99, e);

// F: Capture vs Bubble
console.log("\nF: Capture vs Bubble phase");
console.log("  onClickCapture → fires during CAPTURE (top-down)");
console.log("  onClick        → fires during BUBBLE (bottom-up)");
console.log("  Use capture for intercepting before children handle it");

/**
 * OUTPUT:
 * A: SyntheticEvent wraps native event
 *   type: click, target: button, Has nativeEvent: true
 *
 * B: preventDefault
 *   [synthetic] preventDefault called
 *   Form handled without page reload
 *
 * C: Event delegation
 *   Save clicked / Delete clicked
 *   Only 1 root listener, not 1 per button!
 *
 * D: Event pooling (explanation)
 *
 * E: Passing arguments
 *   Clicked item 42/99
 *
 * F: Capture vs Bubble
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ React uses SyntheticEvent for cross-browser consistency.│
 * │ Events delegate to root (React 17: root container,     │
 * │ before: document). Use camelCase (onClick, onChange).   │
 * │ Event pooling removed in React 17. preventDefault()    │
 * │ instead of returning false.                            │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/11-forms-events/03-event-handling.js
 */
