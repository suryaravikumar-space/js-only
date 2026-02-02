/**
 * TOPIC: Virtualization — Only Render Visible Items in Long Lists
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Don't render 10,000 DOM nodes. Render only the      ║
 * ║  ~20 items visible in the viewport. Replace the rest  ║
 * ║  with empty space (padding). This is "windowing".     ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A train window: you only │
 * │ see the scenery in the   │
 * │ window frame. The rest   │
 * │ exists but isn't painted │
 * │ on screen. As you scroll │
 * │ (train moves), new items │
 * │ enter the window.        │
 * └──────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  [padding top]        │  ← empty space for items above
 * │  ┌─ visible ──┐      │
 * │  │ item 50    │      │  ← only these are real DOM nodes
 * │  │ item 51    │      │
 * │  │ item 52    │      │
 * │  │ item 53    │      │
 * │  └────────────┘      │
 * │  [padding bottom]    │  ← empty space for items below
 * └──────────────────────┘
 *
 * Libraries: react-window, react-virtuoso, TanStack Virtual
 */

// --- Simulate virtualization engine ---
function calculateWindow(config) {
  const { totalItems, itemHeight, viewportHeight, scrollTop } = config;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, totalItems - 1);
  const paddingTop = startIndex * itemHeight;
  const paddingBottom = (totalItems - endIndex - 1) * itemHeight;

  return { startIndex, endIndex, visibleCount, paddingTop, paddingBottom };
}

function renderWindow(items, window) {
  const visible = [];
  for (let i = window.startIndex; i <= window.endIndex; i++) {
    visible.push(items[i]);
  }
  return visible;
}

// --- Create a big list ---
const ALL_ITEMS = Array.from({ length: 10000 }, (_, i) => `Item #${i}`);
const ITEM_HEIGHT = 40;
const VIEWPORT_HEIGHT = 200; // fits 5 items

// A: Scroll at top
console.log("A: Scroll position = 0 (top of list)");
let win = calculateWindow({
  totalItems: ALL_ITEMS.length, itemHeight: ITEM_HEIGHT,
  viewportHeight: VIEWPORT_HEIGHT, scrollTop: 0,
});
console.log(`  Visible: indices ${win.startIndex}–${win.endIndex}`);
console.log(`  Rendered: [${renderWindow(ALL_ITEMS, win).join(", ")}]`);
console.log(`  DOM nodes: ${win.endIndex - win.startIndex + 1} (not 10,000!)`);

// B: Scroll to middle
console.log("\nB: Scroll position = 20000 (middle)");
win = calculateWindow({
  totalItems: ALL_ITEMS.length, itemHeight: ITEM_HEIGHT,
  viewportHeight: VIEWPORT_HEIGHT, scrollTop: 20000,
});
console.log(`  Visible: indices ${win.startIndex}–${win.endIndex}`);
console.log(`  Rendered: [${renderWindow(ALL_ITEMS, win).join(", ")}]`);
console.log(`  paddingTop: ${win.paddingTop}px, paddingBottom: ${win.paddingBottom}px`);

// C: Scroll near bottom
console.log("\nC: Scroll position = 399600 (near bottom)");
win = calculateWindow({
  totalItems: ALL_ITEMS.length, itemHeight: ITEM_HEIGHT,
  viewportHeight: VIEWPORT_HEIGHT, scrollTop: 399600,
});
console.log(`  Visible: indices ${win.startIndex}–${win.endIndex}`);
console.log(`  Rendered: [${renderWindow(ALL_ITEMS, win).join(", ")}]`);

// D: Performance comparison
console.log("\nD: Performance comparison");
const t1 = performance.now();
const naive = ALL_ITEMS.map((item) => `<div>${item}</div>`);
const t2 = performance.now();
console.log(`  Naive render 10,000 items: ${(t2 - t1).toFixed(2)}ms`);

const t3 = performance.now();
const virtualized = renderWindow(ALL_ITEMS, calculateWindow({
  totalItems: ALL_ITEMS.length, itemHeight: ITEM_HEIGHT,
  viewportHeight: VIEWPORT_HEIGHT, scrollTop: 0,
}));
const t4 = performance.now();
console.log(`  Virtualized render 5 items: ${(t4 - t3).toFixed(2)}ms`);

/**
 * OUTPUT:
 * A: Scroll position = 0 (top of list)
 *   Visible: indices 0–4
 *   Rendered: [Item #0, Item #1, Item #2, Item #3, Item #4]
 *   DOM nodes: 5 (not 10,000!)
 *
 * B: Scroll position = 20000 (middle)
 *   Visible: indices 500–504
 *   Rendered: [Item #500, Item #501, Item #502, Item #503, Item #504]
 *   paddingTop: 20000px, paddingBottom: 379800px
 *
 * C: Scroll position = 399600 (near bottom)
 *   Visible: indices 9990–9994
 *   Rendered: [Item #9990, ..., Item #9994]
 *
 * D: Performance comparison
 *   Naive render 10,000 items: ~Xms
 *   Virtualized render 5 items: ~Xms
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Virtualization (windowing) renders only visible items   │
 * │ in a scrollable list. Instead of 10K DOM nodes, you     │
 * │ render ~20. Libraries: react-window, react-virtuoso.    │
 * │ Key concept: calculate startIndex from scrollTop,       │
 * │ use padding to maintain scroll height.                  │
 * └─────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/09-performance/02-virtualization.js
 */
