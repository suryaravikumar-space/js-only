/**
 * MACHINE CODING: 11 - Observable Pattern (RxJS-style)
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: An Observable is a lazy push-based data source.          ║
 * ║  Observers have next/error/complete. Operators like map/filter         ║
 * ║  transform the stream without mutating it.                             ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  STORY TO REMEMBER: A water pipe (Observable) pushes water (data).     │
 * │  Filters and heaters (operators) transform the water mid-flow.         │
 * │  The faucet (observer.next) receives the final water.                  │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                                                        │
 * │                                                                        │
 * │   Observable(subscribeFn)                                              │
 * │       │                                                                │
 * │       ├── .pipe(map(x => x*2), filter(x => x>5))                      │
 * │       │                                                                │
 * │       └── .subscribe({ next, error, complete })                        │
 * │                │          │          │                                  │
 * │              value      Error      Done                                │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * PROBLEM: Implement Observable with subscribe(observer), plus map, filter,
 *          and pipe operators. Observer has next/error/complete callbacks.
 *
 * RUN: node docs/javascript/29-machine-coding/11-observable.js
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

class Observable {
  constructor(subscribeFn) {
    this._subscribeFn = subscribeFn;
  }

  subscribe(observer) {
    const safeObserver = {
      next: observer.next || (() => {}),
      error: observer.error || ((e) => { throw e; }),
      complete: observer.complete || (() => {}),
    };
    let completed = false;
    const wrapped = {
      next(val) {
        if (!completed) safeObserver.next(val);
      },
      error(err) {
        if (!completed) { completed = true; safeObserver.error(err); }
      },
      complete() {
        if (!completed) { completed = true; safeObserver.complete(); }
      },
    };
    this._subscribeFn(wrapped);
    return { unsubscribe: () => { completed = true; } };
  }

  pipe(...operators) {
    return operators.reduce((source, op) => op(source), this);
  }

  // Static helper to create from array
  static from(arr) {
    return new Observable((observer) => {
      arr.forEach((item) => observer.next(item));
      observer.complete();
    });
  }

  static of(...args) {
    return Observable.from(args);
  }
}

// ─── Operators (each returns a function that takes source Observable) ────

function map(transformFn) {
  return (source) =>
    new Observable((observer) => {
      source.subscribe({
        next: (val) => observer.next(transformFn(val)),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
}

function filter(predicateFn) {
  return (source) =>
    new Observable((observer) => {
      source.subscribe({
        next: (val) => { if (predicateFn(val)) observer.next(val); },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
}

function take(count) {
  return (source) =>
    new Observable((observer) => {
      let taken = 0;
      source.subscribe({
        next: (val) => {
          if (taken < count) { taken++; observer.next(val); }
          if (taken >= count) observer.complete();
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST CASES
// ═══════════════════════════════════════════════════════════════════════════

console.log("═══ TEST A: Basic Observable ═══");
const obs1 = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});
obs1.subscribe({
  next: (v) => console.log("A: next:", v),
  complete: () => console.log("A: complete"),
});

console.log("\n═══ TEST B: Observable.from ═══");
Observable.from([10, 20, 30]).subscribe({
  next: (v) => console.log("B: value:", v),
  complete: () => console.log("B: done"),
});

console.log("\n═══ TEST C: map operator ═══");
Observable.from([1, 2, 3])
  .pipe(map((x) => x * 10))
  .subscribe({
    next: (v) => console.log("C: mapped:", v),
  });

console.log("\n═══ TEST D: filter operator ═══");
Observable.from([1, 2, 3, 4, 5])
  .pipe(filter((x) => x % 2 === 0))
  .subscribe({
    next: (v) => console.log("D: filtered:", v),
  });

console.log("\n═══ TEST E: pipe with map + filter ═══");
Observable.from([1, 2, 3, 4, 5, 6])
  .pipe(
    map((x) => x * 3),
    filter((x) => x > 10)
  )
  .subscribe({
    next: (v) => console.log("E: result:", v),
    complete: () => console.log("E: done"),
  });

console.log("\n═══ TEST F: take operator ═══");
Observable.from([1, 2, 3, 4, 5])
  .pipe(take(3))
  .subscribe({
    next: (v) => console.log("F: taken:", v),
    complete: () => console.log("F: complete after 3"),
  });

console.log("\n═══ TEST G: error handling ═══");
const errObs = new Observable((observer) => {
  observer.next("ok");
  observer.error(new Error("boom"));
  observer.next("should not appear");
});
errObs.subscribe({
  next: (v) => console.log("G: next:", v),
  error: (e) => console.log("G: error caught:", e.message),
  complete: () => console.log("G: should not complete"),
});

console.log("\n═══ TEST H: Observable.of ═══");
Observable.of("a", "b", "c").subscribe({
  next: (v) => console.log("H:", v),
});

// ═══════════════════════════════════════════════════════════════════════════
// FOLLOW-UP QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 1. How would you implement a scan (reduce-like) operator?
 * 2. How would you implement switchMap for async streams?
 * 3. How does cold vs hot Observable differ?
 * 4. How would you implement unsubscribe with teardown logic?
 * 5. How does RxJS Subject differ from Observable?
 */

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW ANSWER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  "Observable wraps a subscribe function. On subscribe, it calls the    ║
 * ║  function passing an observer with next/error/complete. Operators      ║
 * ║  like map/filter return new Observables that wrap the source.          ║
 * ║  pipe() chains operators via reduce. This is lazy - nothing runs      ║
 * ║  until subscribe() is called. Time: O(n*k) for n items, k operators." ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
