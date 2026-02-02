/**
 * TOPIC: useLayoutEffect — Synchronous Before Paint
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  useLayoutEffect fires synchronously AFTER DOM mutation but       ║
 * ║  BEFORE the browser paints. useEffect fires AFTER paint.          ║
 * ║  Use useLayoutEffect only when you need to measure/mutate DOM     ║
 * ║  before the user sees anything (prevents visual flicker).         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ useEffect is like fixing a typo AFTER the newspaper is printed.  │
 * │ Readers see the typo briefly. useLayoutEffect is fixing it       │
 * │ BEFORE the newspaper ships — readers never see the mistake.      │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │                                                                    │
 * │  Render → DOM updated → useLayoutEffect → Browser Paints         │
 * │                                              ↓                    │
 * │                                          useEffect               │
 * │                                                                    │
 * │  Timeline:                                                        │
 * │  ──[render]──[DOM]──[useLayoutEffect]──[PAINT]──[useEffect]──    │
 * │                      (sync, blocking)           (async)           │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate the execution order ===

const timeline = [];

function render(component) {
  timeline.push("1. Render (compute JSX)");
  component();
}

function commitDOM() {
  timeline.push("2. DOM updated (not visible yet)");
}

function runLayoutEffects(fn) {
  timeline.push("3. useLayoutEffect (sync, blocks paint)");
  fn();
}

function browserPaint() {
  timeline.push("4. Browser PAINT (user sees screen)");
}

function runEffects(fn) {
  timeline.push("5. useEffect (async, after paint)");
  fn();
}

// --- A: Execution order ---
console.log("A: === Execution Order ===");

render(() => {});
commitDOM();
runLayoutEffects(() => {});
browserPaint();
runEffects(() => {});

timeline.forEach(step => console.log(`   ${step}`));

// --- B: DOM Measurement use case ---
console.log("\nB: === DOM Measurement (Tooltip Position) ===");

// Simulated DOM node
const tooltipNode = { getBoundingClientRect: () => ({ top: 100, height: 50, left: 200 }) };

function Tooltip() {
  let position = null;

  // useLayoutEffect — measure before paint to avoid flicker
  const rect = tooltipNode.getBoundingClientRect();
  position = { top: rect.top - rect.height, left: rect.left };
  console.log(`   Measured: top=${position.top}, left=${position.left}`);
  console.log("   Position set BEFORE paint — no flicker!");

  // If we used useEffect here:
  console.log("   With useEffect: render(wrong pos) → paint → measure → setState → repaint");
  console.log("   With useLayoutEffect: render → measure → set pos → paint (correct!)");
}
Tooltip();

// --- C: Scroll restoration ---
console.log("\nC: === Scroll Restoration ===");

const scrollContainer = { scrollTop: 0 };

function ChatMessages(messageCount) {
  // After new messages render, scroll to bottom BEFORE user sees
  // useLayoutEffect:
  scrollContainer.scrollTop = messageCount * 60; // each msg 60px
  console.log(`   Messages: ${messageCount}, scrollTop set to: ${scrollContainer.scrollTop}`);
  console.log("   User sees already-scrolled view (no jump)");
}
ChatMessages(10);

// --- D: When to use which ---
console.log("\nD: === Decision Guide ===");
console.log("   useEffect (default):");
console.log("   - Data fetching");
console.log("   - Subscriptions");
console.log("   - Logging/analytics");
console.log("   - Anything that doesn't affect visual output\n");
console.log("   useLayoutEffect (rare):");
console.log("   - Measuring DOM elements (tooltips, popovers)");
console.log("   - Scroll position adjustment");
console.log("   - Preventing flicker when synchronizing DOM");
console.log("   - Animations that need immediate DOM reads\n");
console.log("   WARNING: useLayoutEffect blocks painting!");
console.log("   Heavy computation here = frozen UI. Keep it fast.");

/**
 * OUTPUT:
 * A: 1.Render → 2.DOM → 3.LayoutEffect → 4.Paint → 5.Effect
 * B: Tooltip measured before paint — no flicker
 * C: Scroll set before user sees — no jump
 * D: Decision guide printed
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useLayoutEffect runs synchronously after DOM   ║
 * ║ mutations but before the browser paints. Use it when you need to  ║
 * ║ measure or mutate the DOM without visual flicker — like tooltips  ║
 * ║ or scroll restoration. Default to useEffect; only switch to       ║
 * ║ useLayoutEffect if you see a flash of incorrect content."          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/04-hooks-deep-dive/04-useLayoutEffect.js
 */
