/**
 * TOPIC: State Batching in React 18
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ React BATCHES multiple setState calls into a SINGLE re-render.          ║
 * ║ React 18 batches EVERYWHERE: event handlers, promises, timeouts.        ║
 * ║ React 17 only batched inside event handlers.                            ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ Batching is like a WAITER at a restaurant. They don't run to the         │
 * │ kitchen after each item you order. They WAIT until you finish ordering   │
 * │ (all setState calls), then submit ONE ticket (one re-render).           │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Without Batching:              With Batching (React 18):                │
 * │   setA(1) → render               setA(1) ─┐                              │
 * │   setB(2) → render               setB(2) ─┤── ONE render                 │
 * │   setC(3) → render               setC(3) ─┘                              │
 * │   = 3 renders                    = 1 render                               │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Simulating React's batching with a queue
function createBatchedState() {
  let state = {};
  let queue = [];
  let isBatching = false;
  let renderCount = 0;

  function setState(key, value) {
    queue.push({ key, value });
    if (!isBatching) {
      flush();
    }
  }

  function flush() {
    while (queue.length > 0) {
      const { key, value } = queue.shift();
      state[key] = typeof value === 'function' ? value(state[key]) : value;
    }
    renderCount++;
    console.log(`   [Render #${renderCount}] State:`, JSON.stringify(state));
  }

  function batch(fn) {
    isBatching = true;
    fn();
    isBatching = false;
    flush();
  }

  return { setState, batch, getState: () => state, getRenderCount: () => renderCount };
}

// B: Without batching - each setState triggers a render
console.log('A: WITHOUT batching (3 renders):');
const store1 = createBatchedState();
store1.setState('a', 1);
store1.setState('b', 2);
store1.setState('c', 3);
console.log('   Total renders:', store1.getRenderCount());

// C: With batching - all setState calls batch into one render
console.log('\nB: WITH batching (1 render):');
const store2 = createBatchedState();
store2.batch(() => {
  store2.setState('a', 1);
  store2.setState('b', 2);
  store2.setState('c', 3);
});
console.log('   Total renders:', store2.getRenderCount());

// D: React 17 vs 18 batching
console.log('\nC: React 17 vs 18:');
console.log('   React 17: Batches ONLY in event handlers');
console.log('   React 18: Batches EVERYWHERE (automatic batching)');
console.log('');
console.log('   // React 17 - NOT batched (2 renders):');
console.log('   fetch("/api").then(() => { setA(1); setB(2); })');
console.log('');
console.log('   // React 18 - BATCHED (1 render):');
console.log('   fetch("/api").then(() => { setA(1); setB(2); })');

// E: Opting out of batching with flushSync
console.log('\nD: flushSync - opt out of batching:');
console.log('   import { flushSync } from "react-dom";');
console.log('   flushSync(() => setA(1));  // renders immediately');
console.log('   flushSync(() => setB(2));  // renders immediately');
console.log('   // Use only when you NEED synchronous DOM updates');

// F: Batching with functional updates
console.log('\nE: Batching + functional updates:');
const store3 = createBatchedState();
store3.setState('count', 0);
store3.batch(() => {
  store3.setState('count', prev => (prev || 0) + 1);
  store3.setState('count', prev => (prev || 0) + 1);
  store3.setState('count', prev => (prev || 0) + 1);
});
console.log('   3 increments in 1 render = count is 3');

/**
 * OUTPUT:
 *   A: 3 separate renders
 *   B: 1 batched render
 *   C: React 17 vs 18 comparison
 *   D: flushSync usage
 *   E: Functional updates batch correctly
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "React 18 introduced automatic batching - multiple setState calls in      │
 * │  any context (event handlers, promises, timeouts) are grouped into one    │
 * │  re-render. React 17 only batched in event handlers. This improves       │
 * │  performance by avoiding unnecessary renders. You can opt out with        │
 * │  flushSync() when synchronous DOM updates are needed."                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/02-state-useState/01-state-batching.js
 */
