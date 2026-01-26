/**
 * RECURSION: 03 - Array Recursion
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ RECURSIVE ARRAY PATTERNS                                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Two main approaches:                                                       ║
 * ║ 1. HEAD + TAIL: Process first element, recurse on rest                     ║
 * ║ 2. INDEX-BASED: Pass index, increment each call                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// APPROACH 1: HEAD + TAIL (slice)
// ═══════════════════════════════════════════════════════════════════════════════

// Sum using head + tail
function sumSlice(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumSlice(arr.slice(1));
}

console.log('A: Sum [1,2,3,4,5]:', sumSlice([1, 2, 3, 4, 5]));  // 15


// ═══════════════════════════════════════════════════════════════════════════════
// APPROACH 2: INDEX-BASED (more efficient)
// ═══════════════════════════════════════════════════════════════════════════════

// Sum using index (no new arrays created)
function sumIndex(arr, i = 0) {
  if (i >= arr.length) return 0;
  return arr[i] + sumIndex(arr, i + 1);
}

console.log('B: Sum [1,2,3,4,5]:', sumIndex([1, 2, 3, 4, 5]));  // 15


// ═══════════════════════════════════════════════════════════════════════════════
// FIND ELEMENT
// ═══════════════════════════════════════════════════════════════════════════════

function find(arr, target, i = 0) {
  if (i >= arr.length) return -1;
  if (arr[i] === target) return i;
  return find(arr, target, i + 1);
}

console.log('\nC: Find 3 in [1,2,3,4,5]:', find([1, 2, 3, 4, 5], 3));  // 2
console.log('D: Find 9 in [1,2,3,4,5]:', find([1, 2, 3, 4, 5], 9));  // -1


// ═══════════════════════════════════════════════════════════════════════════════
// FILTER
// ═══════════════════════════════════════════════════════════════════════════════

function filter(arr, predicate, i = 0) {
  if (i >= arr.length) return [];

  const rest = filter(arr, predicate, i + 1);
  return predicate(arr[i]) ? [arr[i], ...rest] : rest;
}

console.log('\nE: Filter evens:', filter([1, 2, 3, 4, 5, 6], x => x % 2 === 0));
// [2, 4, 6]


// ═══════════════════════════════════════════════════════════════════════════════
// MAP
// ═══════════════════════════════════════════════════════════════════════════════

function map(arr, fn, i = 0) {
  if (i >= arr.length) return [];
  return [fn(arr[i]), ...map(arr, fn, i + 1)];
}

console.log('F: Map double:', map([1, 2, 3, 4], x => x * 2));
// [2, 4, 6, 8]


// ═══════════════════════════════════════════════════════════════════════════════
// REDUCE
// ═══════════════════════════════════════════════════════════════════════════════

function reduce(arr, fn, acc, i = 0) {
  if (i >= arr.length) return acc;
  return reduce(arr, fn, fn(acc, arr[i]), i + 1);
}

console.log('G: Reduce sum:', reduce([1, 2, 3, 4, 5], (a, b) => a + b, 0));
// 15


// ═══════════════════════════════════════════════════════════════════════════════
// FLATTEN NESTED ARRAY (Unknown Depth!)
// ═══════════════════════════════════════════════════════════════════════════════

function flatten(arr) {
  let result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result = [...result, ...flatten(item)];  // Recurse!
    } else {
      result.push(item);
    }
  }

  return result;
}

console.log('\nH: Flatten:', flatten([1, [2, [3, [4, [5]]]]]));
// [1, 2, 3, 4, 5]


// ═══════════════════════════════════════════════════════════════════════════════
// DEEP COPY ARRAY
// ═══════════════════════════════════════════════════════════════════════════════

function deepCopy(arr) {
  return arr.map(item =>
    Array.isArray(item) ? deepCopy(item) : item
  );
}

const original = [1, [2, 3], [4, [5, 6]]];
const copied = deepCopy(original);
copied[1][0] = 999;

console.log('I: Original:', original);  // [1, [2, 3], [4, [5, 6]]]
console.log('J: Copied:', copied);      // [1, [999, 3], [4, [5, 6]]]


// ═══════════════════════════════════════════════════════════════════════════════
// EVERY / SOME
// ═══════════════════════════════════════════════════════════════════════════════

function every(arr, predicate, i = 0) {
  if (i >= arr.length) return true;
  if (!predicate(arr[i])) return false;
  return every(arr, predicate, i + 1);
}

function some(arr, predicate, i = 0) {
  if (i >= arr.length) return false;
  if (predicate(arr[i])) return true;
  return some(arr, predicate, i + 1);
}

console.log('\nK: Every positive:', every([1, 2, 3], x => x > 0));  // true
console.log('L: Some even:', some([1, 3, 5, 6], x => x % 2 === 0)); // true


// ═══════════════════════════════════════════════════════════════════════════════
// REVERSE ARRAY
// ═══════════════════════════════════════════════════════════════════════════════

function reverse(arr) {
  if (arr.length <= 1) return arr;
  return [...reverse(arr.slice(1)), arr[0]];
}

console.log('\nM: Reverse:', reverse([1, 2, 3, 4, 5]));
// [5, 4, 3, 2, 1]


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW TIP                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Use INDEX approach for:                                                     │
 * │ • Better performance (no new arrays)                                        │
 * │ • Easier to convert to iteration                                            │
 * │                                                                             │
 * │ Use SLICE approach for:                                                     │
 * │ • Cleaner, more functional code                                             │
 * │ • When performance isn't critical                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/03-array-recursion.js
 */
