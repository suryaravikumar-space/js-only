/**
 * TOPIC: Implement EventEmitter Class
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: An EventEmitter is a pub-sub registry —      ║
 * ║  a Map of event names to arrays of callback functions.      ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: Think of a radio station (emitter). Listeners tune  │
 * │  in (on), some listen once then leave (once), some turn     │
 * │  off (off), and the station broadcasts (emit) to all tuned. │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM:                                            │
 * │                                                             │
 * │  emitter._events = {                                        │
 * │    "data":  [ fn1, fn2, fn3(once) ]                         │
 * │    "error": [ fn4 ]                                         │
 * │  }                                                          │
 * │                                                             │
 * │  emit("data", val)                                          │
 * │    --> fn1(val), fn2(val), fn3(val) then remove fn3         │
 * └──────────────────────────────────────────────────────────────┘
 *
 * PROBLEM: Build an EventEmitter with on, off, emit, once.
 *
 * APPROACH:
 *  1. Store events in a Map<string, Array<{cb, once}>>
 *  2. on()   — push callback entry
 *  3. off()  — filter out matching callback
 *  4. emit() — iterate listeners, call each, remove once-flagged
 *  5. once() — delegate to on() with once flag
 */

// ===================== IMPLEMENTATION =====================

class EventEmitter {
  constructor() {
    this._events = new Map();
  }

  on(event, cb) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push({ cb, once: false });
    return this; // allow chaining
  }

  once(event, cb) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push({ cb, once: true });
    return this;
  }

  off(event, cb) {
    if (!this._events.has(event)) return this;
    const listeners = this._events.get(event).filter((l) => l.cb !== cb);
    if (listeners.length === 0) {
      this._events.delete(event);
    } else {
      this._events.set(event, listeners);
    }
    return this;
  }

  emit(event, ...args) {
    if (!this._events.has(event)) return false;
    const listeners = this._events.get(event);
    // iterate over a copy so removal during iteration is safe
    const snapshot = [...listeners];
    snapshot.forEach((listener) => {
      listener.cb(...args);
    });
    // remove once listeners after calling
    this._events.set(
      event,
      listeners.filter((l) => !l.once)
    );
    return true;
  }

  listenerCount(event) {
    return this._events.has(event) ? this._events.get(event).length : 0;
  }
}

// ===================== TEST CASES =====================

console.log("=== EventEmitter Machine Coding ===\n");

// A: Basic on + emit
const ee = new EventEmitter();
ee.on("greet", (name) => console.log(`A: Hello, ${name}!`));
ee.emit("greet", "Alice");
// Expected: A: Hello, Alice!

// B: Multiple listeners
ee.on("greet", (name) => console.log(`B: Hi there, ${name}!`));
ee.emit("greet", "Bob");
// Expected: A: Hello, Bob!  then  B: Hi there, Bob!

// C: once fires only once
ee.once("login", (user) => console.log(`C: ${user} logged in (once)`));
ee.emit("login", "Charlie");
ee.emit("login", "Charlie"); // should NOT print
console.log(`C: listener count after once fired = ${ee.listenerCount("login")}`);
// Expected: C: Charlie logged in (once) then count = 0

// D: off removes a specific listener
const handler = (x) => console.log(`D: value = ${x}`);
ee.on("data", handler);
ee.emit("data", 42);
ee.off("data", handler);
ee.emit("data", 99); // should NOT print
console.log(`D: listener count after off = ${ee.listenerCount("data")}`);
// Expected: D: value = 42 then count = 0

// E: Multiple args
ee.on("sum", (a, b) => console.log(`E: ${a} + ${b} = ${a + b}`));
ee.emit("sum", 3, 7);
// Expected: E: 3 + 7 = 10

// F: Chaining
const ee2 = new EventEmitter();
ee2.on("a", () => console.log("F: event a")).on("b", () => console.log("F: event b"));
ee2.emit("a");
ee2.emit("b");

// G: Emit non-existent event returns false
console.log(`G: emit unknown = ${ee.emit("unknown")}`);
// Expected: G: emit unknown = false

// H: once among regular listeners
const ee3 = new EventEmitter();
ee3.on("tick", () => console.log("H: regular tick"));
ee3.once("tick", () => console.log("H: once tick"));
ee3.on("tick", () => console.log("H: another regular tick"));
console.log("H: --- first emit ---");
ee3.emit("tick");
console.log("H: --- second emit ---");
ee3.emit("tick");
// Second emit should NOT show "once tick"

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How would you add a removeAllListeners(event?) method?
 * 2. How would you limit max listeners to prevent memory leaks?
 * 3. How does Node.js EventEmitter handle errors on 'error' event?
 * 4. How would you make emit async (wait for async listeners)?
 * 5. How do you handle listener exceptions without breaking other listeners?
 */

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                         ║
 * ║  EventEmitter stores a Map of event->listener arrays.      ║
 * ║  on() pushes, off() filters out, emit() calls all and      ║
 * ║  removes once-flagged listeners. once() is on() with a     ║
 * ║  flag. Always iterate a snapshot to handle mid-emit edits. ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// RUN: node docs/javascript/29-machine-coding/00-event-emitter.js
