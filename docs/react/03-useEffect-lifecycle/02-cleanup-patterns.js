/**
 * TOPIC: useEffect Cleanup Patterns
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  Every effect that creates a subscription, timer, or listener      ║
 * ║  MUST return a cleanup function. Otherwise you get memory leaks.   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Think of cleanup as checking out of a hotel room.                 │
 * │ You turned on the lights (subscription), ran the bath (timer),   │
 * │ ordered room service (fetch). Before you leave, turn off lights, │
 * │ drain the bath, cancel the order. Always clean up after yourself! │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  EFFECT CREATED          CLEANUP NEEDED                           │
 * │  ──────────────          ──────────────                           │
 * │  setInterval()      →   clearInterval()                          │
 * │  setTimeout()       →   clearTimeout()                           │
 * │  addEventListener() →   removeEventListener()                    │
 * │  fetch() request    →   AbortController.abort()                  │
 * │  WebSocket.open()   →   WebSocket.close()                        │
 * └───────────────────────────────────────────────────────────────────┘
 */

// --- A: Timer Cleanup ---
console.log("A: === Timer Cleanup ===");

function simulateTimerEffect() {
  console.log("   Effect: Starting interval");
  let ticks = 0;
  const id = setInterval(() => { ticks++; }, 100);

  // Cleanup function
  const cleanup = () => {
    clearInterval(id);
    console.log(`   Cleanup: Interval cleared after ${ticks} ticks`);
  };
  return cleanup;
}

const cleanupTimer = simulateTimerEffect();
setTimeout(() => {
  cleanupTimer(); // Simulates unmount

  // --- B: Subscription Cleanup ---
  console.log("\nB: === Subscription Cleanup (EventEmitter) ===");

  const listeners = {};
  const emitter = {
    on(event, fn) {
      (listeners[event] = listeners[event] || []).push(fn);
      console.log(`   Subscribed to "${event}"`);
    },
    off(event, fn) {
      listeners[event] = (listeners[event] || []).filter(f => f !== fn);
      console.log(`   Unsubscribed from "${event}"`);
    },
    emit(event, data) {
      (listeners[event] || []).forEach(fn => fn(data));
    }
  };

  function simulateSubscription() {
    const handler = (data) => console.log(`   Received: ${data}`);
    emitter.on("message", handler);
    return () => emitter.off("message", handler); // cleanup
  }

  const cleanupSub = simulateSubscription();
  emitter.emit("message", "Hello!");
  cleanupSub(); // unmount
  emitter.emit("message", "This should NOT be received");

  // --- C: AbortController for fetch cleanup ---
  console.log("\nC: === AbortController Fetch Cleanup ===");

  function simulateFetchEffect(url) {
    const controller = new AbortController();
    console.log(`   Fetching ${url}...`);

    // Simulate fetch with abort
    const fetchPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve("data"), 500);
      controller.signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new Error("Aborted"));
      });
    });

    fetchPromise
      .then(d => console.log(`   Got: ${d}`))
      .catch(e => console.log(`   ${e.message} — no stale setState!`));

    return () => {
      console.log("   Cleanup: Aborting fetch");
      controller.abort();
    };
  }

  const cleanupFetch = simulateFetchEffect("/api/user/1");
  // User navigates away quickly — abort!
  cleanupFetch();

  // --- D: Boolean flag pattern (ignore stale results) ---
  console.log("\nD: === Boolean Flag Pattern ===");

  function simulateAsyncEffect(id) {
    let cancelled = false;
    console.log(`   Fetching user ${id}...`);

    Promise.resolve(`User-${id}`).then(data => {
      if (!cancelled) {
        console.log(`   setState(${data}) — applied`);
      } else {
        console.log(`   setState(${data}) — IGNORED (stale)`);
      }
    });

    return () => { cancelled = true; console.log(`   Cleanup: Marked stale`); };
  }

  const cleanup1 = simulateAsyncEffect(1);
  cleanup1(); // deps changed before resolve
  simulateAsyncEffect(2);

  setTimeout(() => {
    console.log("\n--- All effects and cleanups complete ---");
  }, 100);

}, 350);

/**
 * OUTPUT:
 * A: === Timer Cleanup ===
 *    Effect: Starting interval
 *    Cleanup: Interval cleared after 3 ticks
 *
 * B: === Subscription Cleanup (EventEmitter) ===
 *    Subscribed to "message"
 *    Received: Hello!
 *    Unsubscribed from "message"
 *
 * C: === AbortController Fetch Cleanup ===
 *    Fetching /api/user/1...
 *    Cleanup: Aborting fetch
 *    Aborted — no stale setState!
 *
 * D: === Boolean Flag Pattern ===
 *    Fetching user 1...
 *    Cleanup: Marked stale
 *    Fetching user 2...
 *    setState(User-1) — IGNORED (stale)
 *    setState(User-2) — applied
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Every useEffect that creates a side effect     ║
 * ║ should return a cleanup function. For timers use clearInterval,    ║
 * ║ for fetch use AbortController, for subscriptions use unsubscribe. ║
 * ║ Cleanup runs before the next effect AND on unmount."               ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/03-useEffect-lifecycle/02-cleanup-patterns.js
 */
