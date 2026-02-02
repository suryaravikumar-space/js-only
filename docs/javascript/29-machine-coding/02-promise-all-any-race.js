/**
 * TOPIC: Implement Promise.all, Promise.any, Promise.race, Promise.allSettled
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: All four methods take an iterable of          ║
 * ║  promises and return a single promise. They differ only     ║
 * ║  in WHEN and HOW they settle.                               ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: Four race judges watching runners (promises):       │
 * │  ALL   — waits for every runner, fails if ANY falls.        │
 * │  RACE  — reports whoever finishes first (win or fall).      │
 * │  ANY   — reports first winner, fails only if ALL fall.      │
 * │  ALL_SETTLED — waits for everyone, reports all outcomes.    │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  VISUAL:                                                    │
 * │  P1 ──ok──┐                                                 │
 * │  P2 ──ok──┤  ALL: resolve([v1,v2,v3]) when all ok           │
 * │  P3 ──ok──┘  RACE: resolve(first settled)                   │
 * │              ANY: resolve(first fulfilled)                   │
 * │              ALLSETTLED: resolve([{status,value/reason}...]) │
 * └──────────────────────────────────────────────────────────────┘
 *
 * APPROACH:
 *  1. Wrap each input with Promise.resolve() to handle non-promise values
 *  2. Track results in an array, use a counter for completion
 *  3. Handle empty array edge cases per spec
 */

// ===================== IMPLEMENTATION =====================

Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises);
    if (arr.length === 0) return resolve([]);
    const results = new Array(arr.length);
    let remaining = arr.length;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = value;
          remaining--;
          if (remaining === 0) resolve(results);
        },
        (reason) => reject(reason)
      );
    });
  });
};

Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises);
    // If empty, promise stays pending forever (per spec)
    arr.forEach((p) => {
      Promise.resolve(p).then(resolve, reject);
    });
  });
};

Promise.myAny = function (promises) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises);
    if (arr.length === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }
    const errors = new Array(arr.length);
    let rejectedCount = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => resolve(value),
        (reason) => {
          errors[i] = reason;
          rejectedCount++;
          if (rejectedCount === arr.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        }
      );
    });
  });
};

Promise.myAllSettled = function (promises) {
  return new Promise((resolve) => {
    const arr = Array.from(promises);
    if (arr.length === 0) return resolve([]);
    const results = new Array(arr.length);
    let remaining = arr.length;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = { status: "fulfilled", value };
          remaining--;
          if (remaining === 0) resolve(results);
        },
        (reason) => {
          results[i] = { status: "rejected", reason };
          remaining--;
          if (remaining === 0) resolve(results);
        }
      );
    });
  });
};

// ===================== HELPERS =====================

const delay = (ms, val) => new Promise((res) => setTimeout(() => res(val), ms));
const fail = (ms, err) => new Promise((_, rej) => setTimeout(() => rej(err), ms));

// ===================== TEST CASES =====================

async function runTests() {
  console.log("=== Promise.myAll / myAny / myRace / myAllSettled ===\n");

  // A: myAll — all resolve
  const a = await Promise.myAll([delay(10, 1), delay(20, 2), delay(5, 3)]);
  console.log(`A: myAll resolved = [${a}]`); // [1,2,3]

  // B: myAll — one rejects
  try {
    await Promise.myAll([delay(10, 1), fail(5, "err"), delay(20, 3)]);
  } catch (e) {
    console.log(`B: myAll rejected = ${e}`); // err
  }

  // C: myAll — empty array
  const c = await Promise.myAll([]);
  console.log(`C: myAll empty = [${c}]`); // []

  // D: myAll — non-promise values
  const d = await Promise.myAll([10, 20, 30]);
  console.log(`D: myAll non-promise = [${d}]`); // [10,20,30]

  // E: myRace — first wins
  const e = await Promise.myRace([delay(30, "slow"), delay(10, "fast")]);
  console.log(`E: myRace winner = ${e}`); // fast

  // F: myRace — first rejects
  try {
    await Promise.myRace([fail(5, "quick-fail"), delay(50, "ok")]);
  } catch (err) {
    console.log(`F: myRace rejected = ${err}`); // quick-fail
  }

  // G: myAny — first fulfilled
  const g = await Promise.myAny([fail(5, "e1"), delay(10, "winner"), fail(15, "e2")]);
  console.log(`G: myAny winner = ${g}`); // winner

  // H: myAny — all reject
  try {
    await Promise.myAny([fail(5, "e1"), fail(10, "e2")]);
  } catch (err) {
    console.log(`H: myAny all rejected, errors = [${err.errors}]`); // [e1,e2]
  }

  // I: myAny — empty array
  try {
    await Promise.myAny([]);
  } catch (err) {
    console.log(`I: myAny empty = ${err.message}`);
  }

  // J: myAllSettled — mixed
  const j = await Promise.myAllSettled([delay(10, "ok"), fail(5, "bad"), delay(15, "fine")]);
  j.forEach((r, i) => {
    const val = r.status === "fulfilled" ? r.value : r.reason;
    console.log(`J${i}: ${r.status} -> ${val}`);
  });

  // K: myAllSettled — empty
  const k = await Promise.myAllSettled([]);
  console.log(`K: myAllSettled empty = [${k}]`);

  console.log("\n=== All tests complete ===");
}

runTests();

/**
 * FOLLOW-UP QUESTIONS:
 * 1. Why does Promise.race with an empty array stay pending forever?
 * 2. What is AggregateError and when was it introduced?
 * 3. How would you implement a Promise.map with concurrency limit?
 * 4. What happens if you pass non-iterable to Promise.all?
 * 5. How does order preservation work in Promise.all?
 */

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                         ║
 * ║  all: resolve when ALL fulfill, reject on FIRST reject.    ║
 * ║  race: settle with FIRST settled (fulfilled or rejected).  ║
 * ║  any: resolve with FIRST fulfilled, reject if ALL reject.  ║
 * ║  allSettled: always resolve with array of all outcomes.     ║
 * ║  Key: wrap inputs with Promise.resolve(), use counter +    ║
 * ║  index to preserve order in results array.                 ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// RUN: node docs/javascript/29-machine-coding/02-promise-all-any-race.js
