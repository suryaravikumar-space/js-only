/**
 * MACHINE CODING: 14 - Interview Cheat Sheet
 *
 * Quick reference for ALL 14 machine coding problems.
 * For each: problem name, key approach, time/space complexity, common follow-ups.
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  USE THIS: Quick revision before interviews. Run and read the output.  ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/29-machine-coding/14-interview-cheatsheet.js
 */

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 00: DEBOUNCE
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  00 - DEBOUNCE                                              ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Wrap fn in closure with timer. clearTimeout on   ║");
console.log("║  each call, setTimeout to delay. Only last call fires.      ║");
console.log("║  Time: O(1) per call | Space: O(1)                         ║");
console.log("║  Follow-ups: leading edge, cancel, flush, maxWait          ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 01: THROTTLE
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  01 - THROTTLE                                              ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Track lastCall timestamp. Only execute if enough ║");
console.log("║  time has passed. Use Date.now() comparison.                ║");
console.log("║  Time: O(1) per call | Space: O(1)                         ║");
console.log("║  Follow-ups: trailing call, leading+trailing, cancel        ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 02: PROMISE FROM SCRATCH
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  02 - PROMISE FROM SCRATCH                                  ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: State machine (pending/fulfilled/rejected).      ║");
console.log("║  .then() queues callbacks. resolve/reject flush the queue.  ║");
console.log("║  Time: O(n) for n .then() calls | Space: O(n)              ║");
console.log("║  Follow-ups: Promise.all, race, allSettled, chaining        ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 03: EVENT EMITTER
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  03 - EVENT EMITTER                                         ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Map of event -> listener arrays. on() pushes,    ║");
console.log("║  emit() iterates and calls, off() splices by reference.     ║");
console.log("║  Time: O(n) emit | Space: O(n) listeners                   ║");
console.log("║  Follow-ups: once(), wildcard, max listeners, async emit    ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 04: DEEP CLONE
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  04 - DEEP CLONE                                            ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Recursion + WeakMap for circular refs. Handle    ║");
console.log("║  Date, RegExp, Map, Set, Array, plain objects.              ║");
console.log("║  Time: O(n) all properties | Space: O(n) + O(d) stack      ║");
console.log("║  Follow-ups: circular refs, symbols, prototypes, Buffer     ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 05: FLATTEN (Array & Object)
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  05 - FLATTEN (Array & Object)                              ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Array: recursive concat or reduce. Object: DFS   ║");
console.log("║  with dot-notation keys. Track depth for limited flatten.   ║");
console.log("║  Time: O(n) total elements | Space: O(d) recursion depth    ║");
console.log("║  Follow-ups: depth limit, unflatten, iterative approach     ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 06: CURRYING (auto-curry)
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  06 - CURRYING (auto-curry)                                 ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Return inner fn that collects args. When         ║");
console.log("║  args.length >= fn.length, call fn. Else return collector.  ║");
console.log("║  Time: O(n) for n args | Space: O(n) accumulated args      ║");
console.log("║  Follow-ups: placeholder support, infinite curry, uncurry   ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 07: FUNCTION COMPOSITION (pipe/compose)
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  07 - FUNCTION COMPOSITION (pipe/compose)                   ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: pipe = reduce L-to-R, compose = reduceRight.     ║");
console.log("║  Each fn's output becomes next fn's input.                  ║");
console.log("║  Time: O(k) for k functions | Space: O(1)                  ║");
console.log("║  Follow-ups: async pipe, error handling, lazy evaluation    ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 08: LRU CACHE
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  08 - LRU CACHE                                             ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Map (preserves insertion order) for O(1) get/set ║");
console.log("║  On access, delete+re-insert to move to end. Evict first.  ║");
console.log("║  Time: O(1) get & put | Space: O(capacity)                 ║");
console.log("║  Follow-ups: TTL expiry, LFU cache, thread-safe version    ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 09: ASYNC TASK QUEUE
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  09 - ASYNC TASK QUEUE                                      ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Queue array + running counter. add() pushes     ║");
console.log("║  task, calls _run(). _run checks if running < concurrency. ║");
console.log("║  Time: O(1) add | Space: O(n) queued tasks                 ║");
console.log("║  Follow-ups: priority queue, retry, cancel, pause/resume   ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 10: PUBSUB
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  10 - PUBSUB (Publish-Subscribe)                            ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Topics map -> arrays of {token, callback}.       ║");
console.log("║  subscribe() returns token. publish() iterates topic list.  ║");
console.log("║  Time: O(n) publish | Space: O(n) subscribers              ║");
console.log("║  Follow-ups: subscribeOnce, wildcard topics, async publish  ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 11: OBSERVABLE
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  11 - OBSERVABLE (RxJS-style)                                ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Constructor takes subscribeFn. subscribe() calls ║");
console.log("║  it with observer {next,error,complete}. Operators return   ║");
console.log("║  new Observable wrapping source. pipe() chains via reduce.  ║");
console.log("║  Time: O(n*k) n items, k operators | Space: O(k) chain     ║");
console.log("║  Follow-ups: cold vs hot, switchMap, Subject, unsubscribe   ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 12: VIRTUAL DOM
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  12 - VIRTUAL DOM                                           ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: createElement builds vNode objects. diff()       ║");
console.log("║  recursively compares old/new trees -> patch list. patch()  ║");
console.log("║  applies minimal changes to real DOM.                       ║");
console.log("║  Time: O(n) nodes | Space: O(n) tree                       ║");
console.log("║  Follow-ups: keyed children, fiber, batching, event system  ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM 13: JSON PARSER
// ═══════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  13 - JSON PARSER                                           ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log("║  Approach: Recursive descent. Cursor index walks string.    ║");
console.log("║  parseValue checks first char: \" -> parseString, { ->      ║");
console.log("║  parseObject, [ -> parseArray, digits -> parseNumber.       ║");
console.log("║  Time: O(n) string length | Space: O(d) nesting depth      ║");
console.log("║  Follow-ups: stringify, reviver fn, streaming parser        ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════════════════════════════════════
// QUICK COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════

console.log("┌────────────────────────┬─────────────┬──────────────────────┐");
console.log("│ Problem                │ Key DS      │ Core Technique       │");
console.log("├────────────────────────┼─────────────┼──────────────────────┤");
console.log("│ Debounce               │ Timer ID    │ clearTimeout/set     │");
console.log("│ Throttle               │ Timestamp   │ Date.now() check     │");
console.log("│ Promise                │ Queue       │ State machine        │");
console.log("│ Event Emitter          │ Map<Array>  │ on/emit/off          │");
console.log("│ Deep Clone             │ WeakMap     │ Recursion            │");
console.log("│ Flatten                │ Array       │ Recursive concat     │");
console.log("│ Currying               │ Closure     │ Args accumulation    │");
console.log("│ Compose/Pipe           │ Array       │ reduce/reduceRight   │");
console.log("│ LRU Cache              │ Map         │ Delete + re-insert   │");
console.log("│ Async Queue            │ Array       │ Concurrency counter  │");
console.log("│ PubSub                 │ Map<Array>  │ Token-based unsub    │");
console.log("│ Observable             │ Closure     │ Lazy subscribe chain │");
console.log("│ Virtual DOM            │ Tree(obj)   │ Recursive diff       │");
console.log("│ JSON Parser            │ Index/cursor│ Recursive descent    │");
console.log("└────────────────────────┴─────────────┴──────────────────────┘");

console.log("\n═══ INTERVIEW TIP ═══");
console.log("Q: Which problem tests closures the most?");
console.log("A: Debounce, Throttle, Currying - all rely on closure for state.\n");
console.log("Q: Which problem tests recursion the most?");
console.log("A: Deep Clone, Flatten, Virtual DOM diff, JSON Parser.\n");
console.log("Q: Which problem tests async understanding?");
console.log("A: Promise from scratch, Async Queue, Observable.\n");
console.log("Q: Which is most commonly asked?");
console.log("A: Debounce/Throttle (most common), Promise, Event Emitter, LRU Cache.\n");

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW STRATEGY: Start by clarifying requirements. Write the       ║
 * ║  interface first (function signature). Then implement core logic.      ║
 * ║  Add edge cases last. Talk through your approach before coding.        ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
