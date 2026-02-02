/**
 * ================================================================
 * QUESTION: "Your dashboard app crashes after 8 hours of use.
 *            Users report the tab becomes unresponsive.
 *            How would you debug and fix this?"
 * ================================================================
 *
 * ASKED AT: Google (L5), Amazon (SDE2 Frontend), Meta (E5)
 * TYPE:     Debugging + System Design + Real-world experience
 *
 * Sources:
 *   - V8 GC internals: https://v8.dev/blog/trash-talk
 *   - Chrome DevTools Memory docs: https://developer.chrome.com/docs/devtools/memory-problems
 *   - MDN Memory Management: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management
 *   - GreatFrontEnd Advanced JS: https://www.greatfrontend.com/blog/advanced-javascript-interviews-questions-for-10-years-experience
 *   - GitHub sudheerj/javascript-interview-questions (280+ questions, no AI content)
 *
 * ================================================================
 * YOUR STORY TO THE INTERVIEWER (memorize this flow):
 * ================================================================
 *
 * "At my previous company we had a real-time analytics dashboard.
 *  Support tickets said: 'app freezes after a few hours.'
 *
 *  STEP 1 — I reproduced it:
 *  Opened DevTools → Memory tab → took a heap snapshot.
 *  Left the dashboard running for 30 minutes.
 *  Took another snapshot. Compared them.
 *  Memory grew from 45MB to 380MB. Confirmed: memory leak.
 *
 *  STEP 2 — I found the source:
 *  In the comparison view, I sorted by '# Delta' (objects created but never freed).
 *  Found thousands of 'Detached HTMLDivElement' entries.
 *  Traced the retainer chain → an array in our chart component
 *  was holding references to old DOM nodes after re-renders.
 *
 *  STEP 3 — I fixed it:
 *  Cleaned up the array on component unmount.
 *  Also found 3 setInterval timers never cleared.
 *  Also found a WebSocket listener closure capturing stale state.
 *
 *  After fixes: memory stayed flat at ~50MB for 24 hours."
 *
 * ================================================================
 * VISUAL: HOW GARBAGE COLLECTION DECIDES WHAT TO FREE
 * ================================================================
 *
 *   GC ROOT (window, stack, closures)
 *     │
 *     ├──→ App State ──→ User Object ──→ ✅ KEPT (reachable)
 *     │
 *     ├──→ Event Listener ──→ Old Component ──→ 🔴 LEAK!
 *     │    (forgot to remove)   (should be freed)
 *     │
 *     └──→ Timer callback ──→ Huge Array ──→ 🔴 LEAK!
 *          (setInterval)       (captured in closure)
 *
 *   Rule: If GC can walk from any root to an object → object stays in memory.
 *   A "leak" = object is reachable but YOU no longer need it.
 *
 * ================================================================
 * THE 5 LEAK TYPES (with code you can run)
 * ================================================================
 */

// ─────────────────────────────────────────
// LEAK 1: EVENT LISTENERS NOT REMOVED
// ─────────────────────────────────────────
// Real scenario: Scroll/resize handler on window, component unmounts,
//                listener stays → closure keeps entire component alive

// ❌ BAD
function BadComponent(data) {
  // This closure captures `data` (could be megabytes)
  const onScroll = () => {
    console.log(data.length);
  };
  window.addEventListener("scroll", onScroll);
  // Component is destroyed... but onScroll still lives on window
  // GC path: window → scroll listeners → onScroll → closure → data → 🔴 LEAKED
}

// ✅ GOOD — AbortController (modern, cleanest)
function GoodComponent(data) {
  const controller = new AbortController();

  window.addEventListener(
    "scroll",
    () => {
      console.log(data.length);
    },
    { signal: controller.signal }
  );

  // On destroy: one line removes ALL listeners tied to this controller
  return () => controller.abort();
}

// ✅ GOOD — React pattern
/*
useEffect(() => {
  const handler = () => console.log('scroll');
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);  // ← cleanup
}, []);
*/

// ─────────────────────────────────────────
// LEAK 2: setInterval / setTimeout NEVER CLEARED
// ─────────────────────────────────────────
// Real scenario: Polling API every 5s. User navigates away. Timer keeps firing.

// ❌ BAD
function startPolling(url) {
  const cache = new Array(100000).fill("cached-data"); // 800KB

  setInterval(async () => {
    const res = await fetch(url);
    cache.push(await res.json()); // cache grows FOREVER
  }, 5000);
  // No way to stop this. `cache` grows until tab crashes.
}

// ✅ GOOD
function startPollingFixed(url) {
  const cache = [];
  const MAX_CACHE = 100;

  const id = setInterval(async () => {
    const res = await fetch(url);
    cache.push(await res.json());
    if (cache.length > MAX_CACHE) cache.shift(); // bounded
  }, 5000);

  return () => clearInterval(id); // caller can stop it
}

// ─────────────────────────────────────────
// LEAK 3: DETACHED DOM NODES
// ─────────────────────────────────────────
// Real scenario: Dynamic list. Remove item from DOM. Array still holds reference.
// This is exactly what I'd show in DevTools — filter "Detached" in heap snapshot.

// ❌ BAD
const listItems = [];

function addItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  document.getElementById("list").appendChild(li);
  listItems.push(li); // JS reference
}

function removeItem(index) {
  const li = listItems[index];
  li.remove(); // removed from DOM ✅
  // BUT listItems[index] still points to it → DETACHED DOM NODE → 🔴 LEAK
}

// ✅ GOOD
function removeItemFixed(index) {
  const li = listItems[index];
  li.remove();
  listItems.splice(index, 1); // remove JS reference too
  // Now nothing points to it → GC frees the DOM node ✅
}

// ─────────────────────────────────────────
// LEAK 4: CLOSURES CAPTURING TOO MUCH
// ─────────────────────────────────────────
// Real scenario: Factory function returns small callback, but closure
//                holds reference to huge dataset it doesn't need

// ❌ BAD
function createAnalyzer(rawData) {
  // rawData = 50MB dataset
  const processed = rawData.map((d) => d.value * 2);

  return function getAverage() {
    // Only needs `processed`, but closure also retains `rawData`
    // because they share the same scope
    return processed.reduce((a, b) => a + b, 0) / processed.length;
  };
  // rawData (50MB) lives forever because getAverage's closure scope includes it
}

// ✅ GOOD — isolate what the closure needs
function createAnalyzerFixed(rawData) {
  const processed = rawData.map((d) => d.value * 2);
  const avg = processed.reduce((a, b) => a + b, 0) / processed.length;

  // rawData and processed are now eligible for GC
  return function getAverage() {
    return avg; // only captures a single number
  };
}

// ─────────────────────────────────────────
// LEAK 5: UNBOUNDED MAPS / CACHES
// ─────────────────────────────────────────
// Real scenario: Cache user profile data by ID. 10K users → 100MB+ cache.

// ❌ BAD
const userCache = new Map();

function getUser(id) {
  if (userCache.has(id)) return userCache.get(id);
  const user = fetchUser(id);
  userCache.set(id, user); // grows forever
  return user;
}

// ✅ GOOD — LRU Cache (bounded)
class LRUCache {
  constructor(max = 500) {
    this.max = max;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // move to end (most recent)
    return val;
  }

  set(key, val) {
    this.cache.delete(key);
    this.cache.set(key, val);
    if (this.cache.size > this.max) {
      // Map iterates in insertion order → first key is oldest
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}

// ✅ ALSO GOOD — WeakMap (auto GC when key object is collected)
const metadata = new WeakMap();
function attachMeta(domNode, data) {
  metadata.set(domNode, data);
  // When domNode is removed and GC'd → this entry vanishes automatically
}

/**
 * ================================================================
 * HOW TO DEBUG IN DEVTOOLS (step by step)
 * ================================================================
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │  STEP 1: Baseline                                   │
 *   │  DevTools → Memory → Take Heap Snapshot              │
 *   │  Note the total size (e.g., 45MB)                   │
 *   ├─────────────────────────────────────────────────────┤
 *   │  STEP 2: Reproduce                                  │
 *   │  Use the app for 5-10 minutes (navigate, open/close │
 *   │  modals, switch pages)                              │
 *   ├─────────────────────────────────────────────────────┤
 *   │  STEP 3: Force GC                                   │
 *   │  Click the 🗑️ (trash can) icon in Memory tab        │
 *   │  This forces garbage collection                     │
 *   ├─────────────────────────────────────────────────────┤
 *   │  STEP 4: Compare                                    │
 *   │  Take another snapshot. Select it.                  │
 *   │  Change view to "Comparison"                        │
 *   │  Sort by "# Delta" or "Size Delta"                  │
 *   │  Objects with positive delta = potential leaks       │
 *   ├─────────────────────────────────────────────────────┤
 *   │  STEP 5: Find the retainer                          │
 *   │  Click a leaked object → look at "Retainers" panel  │
 *   │  This shows WHY GC couldn't free it                 │
 *   │  e.g., "system / Context" = closure holding it      │
 *   │  e.g., "Array" = some array still references it     │
 *   ├─────────────────────────────────────────────────────┤
 *   │  STEP 6: Filter "Detached"                          │
 *   │  Type "Detached" in the search box                  │
 *   │  Shows all DOM nodes removed from tree but still    │
 *   │  held in JS memory                                  │
 *   └─────────────────────────────────────────────────────┘
 *
 * ================================================================
 * PRODUCTION MONITORING (bonus points in interview)
 * ================================================================
 */

function monitorMemoryInProduction() {
  // Chrome-only API, but covers ~70% of users
  if (!performance.memory) return;

  const readings = [];

  setInterval(() => {
    const mb = performance.memory.usedJSHeapSize / 1024 / 1024;
    readings.push(mb);

    // If last 5 readings are all increasing → probable leak
    if (readings.length >= 5) {
      const last5 = readings.slice(-5);
      const allIncreasing = last5.every((val, i) => i === 0 || val > last5[i - 1]);

      if (allIncreasing) {
        // Send alert to monitoring (Sentry, DataDog, etc.)
        console.warn(`Memory leak detected: ${last5.map((m) => m.toFixed(1)).join("→")} MB`);
      }
    }

    // Keep only last 60 readings (10 minutes at 10s interval)
    if (readings.length > 60) readings.shift();
  }, 10000);
}

/**
 * ================================================================
 * QUICK CHEAT SHEET — what to say for each leak type
 * ================================================================
 *
 * Interviewer asks about leak?  →  Pick the story above.
 *
 * LEAK TYPE           │  ONE-LINE FIX                  │ DEVTOOLS CLUE
 * ────────────────────┼────────────────────────────────┼─────────────────────
 * Event listener      │  AbortController / removeEvent │ "Detached" + retainer
 * Timer               │  clearInterval on unmount      │  Growing array in heap
 * Detached DOM        │  Remove from JS array too      │  "Detached HTMLElement"
 * Closure             │  Extract values, don't capture │  "system / Context"
 * Unbounded cache     │  LRU or WeakMap                │  Map size keeps growing
 */
