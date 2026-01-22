/**
 * CHALLENGE 10: Ultimate Higher-Order Functions Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Master these patterns:                                                     ║
 * ║                                                                            ║
 * ║ 1. Chaining: filter → map → reduce                                         ║
 * ║ 2. Nested HOFs: Functions returning functions returning functions          ║
 * ║ 3. Implementing HOFs with reduce                                           ║
 * ║ 4. Data grouping and transformation                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Challenge 1: Nested HOFs
var numbers = [1, 2, 3, 4, 5];

var result1 = numbers
  .map(x => x * 2)
  .filter(x => x > 5)
  .reduce((a, b) => a + b, 0);

console.log('A:', result1);

// Challenge 2: HOF returning HOF
function multiply(a) {
  return function(b) {
    return function(c) {
      return a * b * c;
    };
  };
}

console.log('B:', multiply(2)(3)(4));

// Challenge 3: Reduce to implement map
function customMap(arr, fn) {
  return arr.reduce(function(acc, curr, index) {
    acc.push(fn(curr, index));
    return acc;
  }, []);
}

console.log('C:', customMap([1, 2, 3], x => x * 10));

// Challenge 4: Reduce to implement filter
function customFilter(arr, predicate) {
  return arr.reduce(function(acc, curr) {
    if (predicate(curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);
}

console.log('D:', customFilter([1, 2, 3, 4, 5], x => x % 2 === 0));

// Challenge 5: Complex transformation
var data = [
  { category: 'A', value: 10 },
  { category: 'B', value: 20 },
  { category: 'A', value: 30 },
  { category: 'B', value: 40 }
];

var grouped = data.reduce(function(acc, item) {
  if (!acc[item.category]) {
    acc[item.category] = 0;
  }
  acc[item.category] += item.value;
  return acc;
}, {});

console.log('E:', grouped);

/**
 * OUTPUT:
 *   A: 24
 *   B: 24
 *   C: [ 10, 20, 30 ]
 *   D: [ 2, 4 ]
 *   E: { A: 40, B: 60 }
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Chained HOFs                                                            ║
 * ║ ───────────────                                                            ║
 * ║   [1, 2, 3, 4, 5]                                                          ║
 * ║     .map(x => x * 2)     → [2, 4, 6, 8, 10]                                ║
 * ║     .filter(x => x > 5)  → [6, 8, 10]                                      ║
 * ║     .reduce((a,b) => a+b, 0) → 6 + 8 + 10 = 24                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Triple-nested HOF                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   multiply(2)     → returns function(b) with a=2 in closure                ║
 * ║   multiply(2)(3)  → returns function(c) with a=2, b=3 in closure           ║
 * ║   multiply(2)(3)(4) → returns 2 * 3 * 4 = 24                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Map via reduce                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   Start: acc=[]                                                            ║
 * ║   Element 1: acc=[10]  (1*10)                                              ║
 * ║   Element 2: acc=[10, 20]  (2*10)                                          ║
 * ║   Element 3: acc=[10, 20, 30]  (3*10)                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Filter via reduce                                                       ║
 * ║ ──────────────────                                                         ║
 * ║   Start: acc=[]                                                            ║
 * ║   1: odd → skip                                                            ║
 * ║   2: even → acc=[2]                                                        ║
 * ║   3: odd → skip                                                            ║
 * ║   4: even → acc=[2, 4]                                                     ║
 * ║   5: odd → skip                                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Group and sum                                                           ║
 * ║ ────────────────                                                           ║
 * ║   Start: acc={}                                                            ║
 * ║   {A, 10}: acc={A: 10}                                                     ║
 * ║   {B, 20}: acc={A: 10, B: 20}                                              ║
 * ║   {A, 30}: acc={A: 40, B: 20}                                              ║
 * ║   {B, 40}: acc={A: 40, B: 60}                                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY INTERVIEW IMPLEMENTATIONS                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. Implement map using reduce                                          │
 * │   Array.prototype.myMap = function(fn) {                                    │
 * │     return this.reduce((acc, curr, i, arr) => {                             │
 * │       acc.push(fn(curr, i, arr));                                           │
 * │       return acc;                                                           │
 * │     }, []);                                                                 │
 * │   };                                                                        │
 * │                                                                             │
 * │   // 2. Implement filter using reduce                                       │
 * │   Array.prototype.myFilter = function(predicate) {                          │
 * │     return this.reduce((acc, curr, i, arr) => {                             │
 * │       if (predicate(curr, i, arr)) acc.push(curr);                          │
 * │       return acc;                                                           │
 * │     }, []);                                                                 │
 * │   };                                                                        │
 * │                                                                             │
 * │   // 3. Implement find using reduce                                         │
 * │   Array.prototype.myFind = function(predicate) {                            │
 * │     return this.reduce((found, curr, i, arr) => {                           │
 * │       if (found !== undefined) return found;                                │
 * │       if (predicate(curr, i, arr)) return curr;                             │
 * │       return undefined;                                                     │
 * │     }, undefined);                                                          │
 * │   };                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON DATA TRANSFORMATIONS                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Group by property                                                      │
 * │   var groupBy = (arr, key) => arr.reduce((acc, item) => {                   │
 * │     var group = item[key];                                                  │
 * │     acc[group] = acc[group] || [];                                          │
 * │     acc[group].push(item);                                                  │
 * │     return acc;                                                             │
 * │   }, {});                                                                   │
 * │                                                                             │
 * │   // Count occurrences                                                      │
 * │   var countBy = (arr, key) => arr.reduce((acc, item) => {                   │
 * │     var group = typeof key === 'function' ? key(item) : item[key];          │
 * │     acc[group] = (acc[group] || 0) + 1;                                     │
 * │     return acc;                                                             │
 * │   }, {});                                                                   │
 * │                                                                             │
 * │   // Array to object (by id)                                                │
 * │   var keyBy = (arr, key) => arr.reduce((acc, item) => {                     │
 * │     acc[item[key]] = item;                                                  │
 * │     return acc;                                                             │
 * │   }, {});                                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW CHEAT SHEET                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────┬─────────────────────────────────────────────────────┐      │
 * │   │ Task       │ Pattern                                             │      │
 * │   ├────────────┼─────────────────────────────────────────────────────┤      │
 * │   │ Transform  │ .map(fn)                                            │      │
 * │   │ Filter     │ .filter(predicate)                                  │      │
 * │   │ Aggregate  │ .reduce(fn, initial)                                │      │
 * │   │ Find one   │ .find(predicate)                                    │      │
 * │   │ Check any  │ .some(predicate)                                    │      │
 * │   │ Check all  │ .every(predicate)                                   │      │
 * │   │ Group by   │ .reduce((acc, x) => { acc[key].push(x) }, {})       │      │
 * │   │ Count      │ .reduce((acc, x) => { acc[key]++ }, {})             │      │
 * │   │ Sum        │ .reduce((sum, x) => sum + x.value, 0)               │      │
 * │   │ Flatten    │ .reduce((acc, x) => acc.concat(x), [])              │      │
 * │   │ Unique     │ .filter((x, i, arr) => arr.indexOf(x) === i)        │      │
 * │   │ Max/Min    │ .reduce((max, x) => x > max ? x : max)              │      │
 * │   └────────────┴─────────────────────────────────────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/10-ultimate-hof-challenge.js
 */
