/**
 * TOPIC: Lifecycle Methods Mapped to useEffect
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  componentDidMount    = useEffect(fn, [])                          ║
 * ║  componentDidUpdate   = useEffect(fn, [dep])                       ║
 * ║  componentWillUnmount = return cleanup from useEffect              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Class components had 3 separate mailboxes: Mount, Update, Unmount │
 * │ useEffect is ONE smart mailbox that handles all three.            │
 * │ The dependency array picks which mail to accept.                  │
 * │ The cleanup return is the "goodbye letter" on unmount.            │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  CLASS                          HOOKS                             │
 * │  ─────                          ─────                             │
 * │  componentDidMount()     →  useEffect(() => {...}, [])            │
 * │  componentDidUpdate()    →  useEffect(() => {...}, [dep])         │
 * │  componentWillUnmount()  →  useEffect(() => { return () => {} }) │
 * │                                                                    │
 * │  COMBINED (mount + unmount):                                      │
 * │  useEffect(() => {                                                │
 * │    subscribe();              // mount                             │
 * │    return () => unsubscribe(); // unmount                         │
 * │  }, []);                                                          │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate component lifecycle with pure JS ===

let _cleanups = [];
let _depStore = [];
let _idx = 0;
let _mounted = true;

function useEffect(fn, deps) {
  const i = _idx++;
  const prev = _depStore[i];
  let shouldRun = false;

  if (!prev) shouldRun = true;
  else if (!deps) shouldRun = true;
  else shouldRun = deps.some((d, j) => d !== prev[j]);

  if (shouldRun) {
    // Run old cleanup before new effect
    if (_cleanups[i]) { _cleanups[i](); }
    const cleanup = fn();
    if (typeof cleanup === "function") _cleanups[i] = cleanup;
  }
  _depStore[i] = deps;
}

function unmount() {
  _cleanups.forEach(fn => { if (fn) fn(); });
  _cleanups = [];
}

// --- A: componentDidMount simulation ---
console.log("A: === componentDidMount → useEffect(fn, []) ===");
_idx = 0;
useEffect(() => {
  console.log("   Mounted! Fetching data...");
  // In React: fetch('/api/data').then(setData)
}, []);
_idx = 0;
useEffect(() => {
  console.log("   THIS SHOULD NOT PRINT (already mounted)");
}, []);

// --- B: componentDidUpdate simulation ---
console.log("\nB: === componentDidUpdate → useEffect(fn, [dep]) ===");
_depStore = []; _idx = 0;
let userId = 1;

function renderProfile(id) {
  userId = id;
  useEffect(() => {
    console.log(`   Fetching profile for user ${userId}`);
  }, [userId]);
}

renderProfile(1); _idx = 0;
renderProfile(1); _idx = 0; // same — skip
renderProfile(2); _idx = 0; // changed — run

// --- C: componentWillUnmount simulation ---
console.log("\nC: === componentWillUnmount → cleanup return ===");
_depStore = []; _cleanups = []; _idx = 0;

useEffect(() => {
  const id = setInterval(() => {}, 1000);
  console.log("   Timer started (interval ID simulated)");
  return () => {
    clearInterval(id);
    console.log("   Cleanup: Timer cleared on unmount");
  };
}, []);

console.log("   Unmounting component...");
unmount();

// --- D: Combined mount + update + unmount ---
console.log("\nD: === Full Lifecycle in One useEffect ===");
_depStore = []; _cleanups = []; _idx = 0;

function ChatRoom(roomId) {
  useEffect(() => {
    console.log(`   Subscribed to room ${roomId}`);
    return () => console.log(`   Unsubscribed from room ${roomId}`);
  }, [roomId]);
}

ChatRoom("general"); _idx = 0;
ChatRoom("random");  _idx = 0; // cleanup old, run new
console.log("   Unmounting...");
unmount();

/**
 * OUTPUT:
 * A: === componentDidMount → useEffect(fn, []) ===
 *    Mounted! Fetching data...
 *
 * B: === componentDidUpdate → useEffect(fn, [dep]) ===
 *    Fetching profile for user 1
 *    Fetching profile for user 2
 *
 * C: === componentWillUnmount → cleanup return ===
 *    Timer started (interval ID simulated)
 *    Unmounting component...
 *    Cleanup: Timer cleared on unmount
 *
 * D: === Full Lifecycle in One useEffect ===
 *    Subscribed to room general
 *    Unsubscribed from room general
 *    Subscribed to room random
 *    Unmounting...
 *    Unsubscribed from room random
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useEffect unifies all three class lifecycle     ║
 * ║ methods. [] = mount, [deps] = update, return fn = unmount.         ║
 * ║ The cleanup runs before re-running the effect AND on unmount,      ║
 * ║ preventing memory leaks from stale subscriptions."                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/03-useEffect-lifecycle/01-lifecycle-mapping.js
 */
