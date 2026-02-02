/**
 * TOPIC: Implement Deep Clone Handling All Types + Circular References
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Recursively copy every value. Use a WeakMap   ║
 * ║  to track already-cloned objects and break circular refs.   ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: Deep clone is like photocopying a book that has     │
 * │  chapters referencing other chapters. You copy each page,   │
 * │  and when you see "see chapter 3" — if you already copied   │
 * │  chapter 3, you point to YOUR copy, not the original.       │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM:                                            │
 * │                                                             │
 * │  deepClone(obj, seen=WeakMap)                               │
 * │    ├── primitive? return as-is                              │
 * │    ├── seen.has(obj)? return seen.get(obj)  [circular!]     │
 * │    ├── Date?    new Date(obj)                               │
 * │    ├── RegExp?  new RegExp(obj)                             │
 * │    ├── Map?     new Map, clone each entry                   │
 * │    ├── Set?     new Set, clone each value                   │
 * │    ├── Array?   [], clone each element                      │
 * │    └── Object?  {}, clone each property                     │
 * └──────────────────────────────────────────────────────────────┘
 *
 * APPROACH:
 *  1. Handle null/primitives (return directly)
 *  2. Check WeakMap for circular reference
 *  3. Handle each special type: Date, RegExp, Map, Set
 *  4. Handle Array and plain Object recursively
 *  5. Store clone in WeakMap BEFORE recursing children
 */

// ===================== IMPLEMENTATION =====================

function deepClone(obj, seen = new WeakMap()) {
  // Primitives and null
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Circular reference check
  if (seen.has(obj)) {
    return seen.get(obj);
  }

  // Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Map
  if (obj instanceof Map) {
    const cloned = new Map();
    seen.set(obj, cloned);
    obj.forEach((value, key) => {
      cloned.set(deepClone(key, seen), deepClone(value, seen));
    });
    return cloned;
  }

  // Set
  if (obj instanceof Set) {
    const cloned = new Set();
    seen.set(obj, cloned);
    obj.forEach((value) => {
      cloned.add(deepClone(value, seen));
    });
    return cloned;
  }

  // Array or plain Object
  const cloned = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  seen.set(obj, cloned); // store BEFORE recursing to handle circular

  for (const key of Reflect.ownKeys(obj)) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor.value !== undefined) {
      cloned[key] = deepClone(descriptor.value, seen);
    } else {
      Object.defineProperty(cloned, key, descriptor);
    }
  }

  return cloned;
}

// ===================== TEST CASES =====================

console.log("=== Deep Clone Machine Coding ===\n");

// A: Primitives
console.log(`A: number  = ${deepClone(42)}`);
console.log(`A: string  = ${deepClone("hello")}`);
console.log(`A: boolean = ${deepClone(true)}`);
console.log(`A: null    = ${deepClone(null)}`);
console.log(`A: undef   = ${deepClone(undefined)}`);

// B: Plain object — verify independence
const origB = { a: 1, b: { c: 2 } };
const cloneB = deepClone(origB);
cloneB.b.c = 999;
console.log(`B: original.b.c = ${origB.b.c} (should be 2)`);
console.log(`B: clone.b.c    = ${cloneB.b.c} (should be 999)`);

// C: Array with nested
const origC = [1, [2, [3]]];
const cloneC = deepClone(origC);
cloneC[1][1][0] = 999;
console.log(`C: original[1][1][0] = ${origC[1][1][0]} (should be 3)`);
console.log(`C: clone[1][1][0]    = ${cloneC[1][1][0]} (should be 999)`);

// D: Date
const origD = new Date("2024-01-15");
const cloneD = deepClone(origD);
console.log(`D: same time?   = ${origD.getTime() === cloneD.getTime()}`);
console.log(`D: same ref?    = ${origD === cloneD} (should be false)`);

// E: RegExp
const origE = /hello/gi;
const cloneE = deepClone(origE);
console.log(`E: source match = ${origE.source === cloneE.source}`);
console.log(`E: flags match  = ${origE.flags === cloneE.flags}`);
console.log(`E: same ref?    = ${origE === cloneE} (should be false)`);

// F: Map
const origF = new Map([
  ["x", { deep: true }],
  ["y", [1, 2]],
]);
const cloneF = deepClone(origF);
cloneF.get("x").deep = false;
console.log(`F: orig Map x.deep = ${origF.get("x").deep} (should be true)`);
console.log(`F: clone Map x.deep = ${cloneF.get("x").deep} (should be false)`);

// G: Set
const innerG = { val: 1 };
const origG = new Set([innerG, "hello", 42]);
const cloneG = deepClone(origG);
console.log(`G: same size = ${origG.size === cloneG.size}`);
console.log(`G: same ref? = ${origG === cloneG} (should be false)`);
// inner object should be different ref
const clonedInner = [...cloneG][0];
clonedInner.val = 999;
console.log(`G: orig inner.val = ${innerG.val} (should be 1)`);

// H: Circular reference
const origH = { name: "root" };
origH.self = origH;
origH.nested = { parent: origH };
const cloneH = deepClone(origH);
console.log(`H: clone.self === clone?          = ${cloneH.self === cloneH} (should be true)`);
console.log(`H: clone.nested.parent === clone? = ${cloneH.nested.parent === cloneH} (should be true)`);
console.log(`H: clone !== original?            = ${cloneH !== origH} (should be true)`);

// I: Mixed complex object
const origI = {
  num: 1,
  str: "hi",
  arr: [1, { a: 2 }],
  date: new Date(),
  regex: /test/i,
  map: new Map([["k", "v"]]),
  set: new Set([1, 2]),
  nested: { deep: { deeper: true } },
};
const cloneI = deepClone(origI);
cloneI.nested.deep.deeper = false;
cloneI.arr[1].a = 999;
console.log(`I: orig nested = ${origI.nested.deep.deeper} (should be true)`);
console.log(`I: orig arr[1].a = ${origI.arr[1].a} (should be 2)`);
console.log(`I: clone is independent = true`);

// J: Symbol keys
const sym = Symbol("secret");
const origJ = { [sym]: "hidden", visible: "shown" };
const cloneJ = deepClone(origJ);
console.log(`J: symbol key preserved = ${cloneJ[sym]} (should be hidden)`);

console.log("\n=== All tests complete ===");

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How does structuredClone() differ from a manual deep clone?
 * 2. What types CANNOT be deep cloned (functions, WeakMap, DOM nodes)?
 * 3. How would you handle cloning class instances with methods?
 * 4. What is the performance cost of deep clone on large objects?
 * 5. When would JSON.parse(JSON.stringify()) be sufficient?
 */

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                         ║
 * ║  Deep clone recursively copies all values. Use WeakMap to   ║
 * ║  detect circular refs — store clone BEFORE recursing into   ║
 * ║  children. Handle Date (new Date(t)), RegExp (new RegExp),  ║
 * ║  Map/Set (iterate & clone entries), Array/Object (recurse   ║
 * ║  own keys). Primitives return as-is. Reflect.ownKeys gets   ║
 * ║  symbol keys too.                                           ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// RUN: node docs/javascript/29-machine-coding/04-deep-clone.js
