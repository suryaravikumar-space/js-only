/**
 * TOPIC: Implement Promise from Scratch (MyPromise)
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: A Promise is a state machine with 3 states   ║
 * ║  (pending -> fulfilled | rejected) plus a queue of          ║
 * ║  callbacks that flush when the state transitions.           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: A Promise is like ordering food. You get a receipt  │
 * │  (pending). Kitchen finishes (fulfilled) or is out of stock │
 * │  (rejected). Either way your receipt resolves and the       │
 * │  waiter (then/catch) brings you the result.                 │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM:                                            │
 * │                                                             │
 * │   new MyPromise(executor)                                   │
 * │     state: PENDING                                          │
 * │     value: undefined                                        │
 * │     callbacks: []                                           │
 * │         │                                                   │
 * │    resolve(val) ──> state=FULFILLED, flush onFulfilled      │
 * │    reject(err)  ──> state=REJECTED,  flush onRejected       │
 * │         │                                                   │
 * │   .then(onF, onR) returns new MyPromise                     │
 * └──────────────────────────────────────────────────────────────┘
 *
 * PROBLEM: Build MyPromise with then, catch, finally, resolve, reject.
 *
 * APPROACH:
 *  1. Constructor runs executor(resolve, reject) immediately
 *  2. resolve/reject transition state and flush queued callbacks
 *  3. then() returns a new MyPromise, queues callbacks if pending
 *  4. Use queueMicrotask for async execution of callbacks
 *  5. catch = then(null, onRejected), finally = then(cb, cb) style
 */

// ===================== IMPLEMENTATION =====================

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this._state = PENDING;
    this._value = undefined;
    this._callbacks = [];

    const resolve = (value) => {
      if (this._state !== PENDING) return;
      // If value is a thenable, adopt its state
      if (value && typeof value.then === "function") {
        value.then(resolve, reject);
        return;
      }
      this._state = FULFILLED;
      this._value = value;
      this._flush();
    };

    const reject = (reason) => {
      if (this._state !== PENDING) return;
      this._state = REJECTED;
      this._value = reason;
      this._flush();
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  _flush() {
    queueMicrotask(() => {
      this._callbacks.forEach(({ onFulfilled, onRejected, resolve, reject }) => {
        const handler = this._state === FULFILLED ? onFulfilled : onRejected;
        if (!handler) {
          (this._state === FULFILLED ? resolve : reject)(this._value);
          return;
        }
        try {
          const result = handler(this._value);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
      this._callbacks = [];
    });
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const cb = {
        onFulfilled: typeof onFulfilled === "function" ? onFulfilled : null,
        onRejected: typeof onRejected === "function" ? onRejected : null,
        resolve,
        reject,
      };
      if (this._state === PENDING) {
        this._callbacks.push(cb);
      } else {
        // already settled — still queue async
        this._callbacks.push(cb);
        this._flush();
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (reason) => {
        onFinally();
        throw reason;
      }
    );
  }

  static resolve(value) {
    return new MyPromise((res) => res(value));
  }

  static reject(reason) {
    return new MyPromise((_, rej) => rej(reason));
  }
}

// ===================== TEST CASES =====================

console.log("=== MyPromise Polyfill Machine Coding ===\n");

// A: Sync resolve
new MyPromise((res) => res(10)).then((v) => console.log(`A: resolved = ${v}`));
// Expected: A: resolved = 10

// B: Async resolve
new MyPromise((res) => setTimeout(() => res(20), 50)).then((v) =>
  console.log(`B: async resolved = ${v}`)
);

// C: Chaining
MyPromise.resolve(1)
  .then((v) => v + 1)
  .then((v) => v * 3)
  .then((v) => console.log(`C: chain result = ${v}`));
// Expected: C: chain result = 6

// D: Error handling with catch
new MyPromise((_, rej) => rej("oops"))
  .catch((e) => {
    console.log(`D: caught = ${e}`);
    return "recovered";
  })
  .then((v) => console.log(`D: after catch = ${v}`));

// E: Executor throws
new MyPromise(() => {
  throw new Error("boom");
}).catch((e) => console.log(`E: executor error = ${e.message}`));

// F: finally runs on success
MyPromise.resolve("ok").finally(() => console.log("F: finally ran (success)"));

// G: finally runs on error
MyPromise.reject("fail")
  .finally(() => console.log("G: finally ran (error)"))
  .catch(() => {}); // swallow

// H: Resolve with thenable (promise-like)
new MyPromise((res) => res(MyPromise.resolve(99))).then((v) =>
  console.log(`H: thenable resolved = ${v}`)
);

// I: Static reject
MyPromise.reject("nope").catch((e) => console.log(`I: static reject = ${e}`));

// J: Multiple thens on same promise
const p = MyPromise.resolve(42);
p.then((v) => console.log(`J1: ${v}`));
p.then((v) => console.log(`J2: ${v}`));

// Wait for async test B
setTimeout(() => console.log("\n=== All tests complete ==="), 200);

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How does the Promises/A+ spec handle recursive thenables?
 * 2. What is the difference between microtask and macrotask scheduling?
 * 3. How would you implement Promise.all using MyPromise?
 * 4. Why must resolve/reject only transition once?
 * 5. How does unhandled rejection detection work in Node.js?
 */

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                         ║
 * ║  A Promise is a state machine (pending/fulfilled/rejected). ║
 * ║  Constructor runs executor immediately. resolve/reject      ║
 * ║  transition state once and flush queued callbacks via       ║
 * ║  microtask. then() returns a new Promise, enabling chains. ║
 * ║  catch = then(null, fn). finally runs on both outcomes.     ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// RUN: node docs/javascript/29-machine-coding/01-promise-polyfill.js
