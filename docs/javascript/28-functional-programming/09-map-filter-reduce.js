/**
 * FUNCTIONAL PROGRAMMING: 09 - Map, Filter, Reduce
 *
 * ONE CONCEPT: The three core array transformation methods that replace loops
 */


// =============================================================================
// THE BIG THREE
// =============================================================================

console.log('=== Map, Filter, Reduce ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  THE BIG THREE                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  MAP: Transform each element                                         │
 *   │  [1, 2, 3]  →  map(x => x * 2)  →  [2, 4, 6]                        │
 *   │                                                                      │
 *   │  FILTER: Keep elements that pass a test                              │
 *   │  [1, 2, 3, 4]  →  filter(x => x > 2)  →  [3, 4]                     │
 *   │                                                                      │
 *   │  REDUCE: Accumulate into a single value                              │
 *   │  [1, 2, 3]  →  reduce((acc, x) => acc + x, 0)  →  6                  │
 *   │                                                                      │
 *   │                                                                      │
 *   │  ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐                         │
 *   │  │Input│ ──▶ │ MAP │ ──▶ │FILTR│ ──▶ │REDUC│ ──▶ Result              │
 *   │  │Array│     │     │     │     │     │     │                         │
 *   │  └─────┘     └─────┘     └─────┘     └─────┘                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// MAP: Transform Every Element
// =============================================================================

console.log('=== MAP ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HOW MAP WORKS INTERNALLY                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Input:    [1,    2,    3]                                           │
 *   │             │     │     │                                           │
 *   │             ▼     ▼     ▼                                           │
 *   │  fn(x):   x*2   x*2   x*2    ← Applied to EACH element             │
 *   │             │     │     │                                           │
 *   │             ▼     ▼     ▼                                           │
 *   │  Output:   [2,    4,    6]    ← NEW array, same length              │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const numbers = [1, 2, 3, 4, 5];

// Basic transform
console.log('Double:', numbers.map(x => x * 2));
console.log('Strings:', numbers.map(x => `Item ${x}`));

// callback(element, index, array)
console.log('With index:', numbers.map((x, i) => `${i}: ${x}`));

// Real-world: Transform API data
const apiUsers = [
  { first_name: 'Alice', last_name: 'Smith', age: 25 },
  { first_name: 'Bob', last_name: 'Jones', age: 30 }
];

const displayUsers = apiUsers.map(user => ({
  fullName: `${user.first_name} ${user.last_name}`,
  isAdult: user.age >= 18
}));
console.log('\nTransform API data:', displayUsers);

// Implement map from scratch
Array.prototype.myMap = function(fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(fn(this[i], i, this));
  }
  return result;
};

console.log('Custom map:', [1, 2, 3].myMap(x => x * 10));


// =============================================================================
// FILTER: Keep Elements That Pass
// =============================================================================

console.log('\n=== FILTER ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HOW FILTER WORKS INTERNALLY                                       │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Input:    [1,   2,   3,   4,   5]                                   │
 *   │             │    │    │    │    │                                    │
 *   │             ▼    ▼    ▼    ▼    ▼                                    │
 *   │  test:     odd? even? odd? even? odd?                               │
 *   │             ✓    ✗    ✓    ✗    ✓                                    │
 *   │             │         │         │                                   │
 *   │             ▼         ▼         ▼                                   │
 *   │  Output:   [1,        3,        5]   ← Only passing elements        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Evens:', numbers.filter(x => x % 2 === 0));
console.log('Greater than 3:', numbers.filter(x => x > 3));

// Real-world: Filter products
const products = [
  { name: 'Laptop', price: 999, inStock: true },
  { name: 'Phone', price: 699, inStock: false },
  { name: 'Tablet', price: 499, inStock: true },
  { name: 'Watch', price: 299, inStock: true }
];

const affordable = products.filter(p => p.price < 500 && p.inStock);
console.log('\nAffordable in-stock:', affordable);

// Remove falsy values
const mixed = [0, 1, '', 'hello', null, undefined, false, true, NaN];
console.log('Remove falsy:', mixed.filter(Boolean));

// Remove duplicates (with filter)
const dupes = [1, 2, 2, 3, 3, 3, 4];
const unique = dupes.filter((val, idx, arr) => arr.indexOf(val) === idx);
console.log('Unique:', unique);

// Implement filter from scratch
Array.prototype.myFilter = function(fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (fn(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

console.log('Custom filter:', [1, 2, 3, 4, 5].myFilter(x => x > 2));


// =============================================================================
// REDUCE: Accumulate to Single Value
// =============================================================================

console.log('\n=== REDUCE ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HOW REDUCE WORKS INTERNALLY                                       │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  reduce((acc, curr) => acc + curr, 0)                               │
 *   │                                                                     │
 *   │  Step 0: acc = 0 (initial value)                                    │
 *   │                                                                     │
 *   │  Step 1: acc = 0 + 1 = 1                                            │
 *   │  Step 2: acc = 1 + 2 = 3                                            │
 *   │  Step 3: acc = 3 + 3 = 6                                            │
 *   │  Step 4: acc = 6 + 4 = 10                                           │
 *   │  Step 5: acc = 10 + 5 = 15                                          │
 *   │                                                                     │
 *   │  Result: 15                                                         │
 *   │                                                                     │
 *   │  acc = accumulator (running total)                                  │
 *   │  curr = current element                                             │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Sum
const sum = numbers.reduce((acc, x) => acc + x, 0);
console.log('Sum:', sum);

// Max
const max = numbers.reduce((a, b) => a > b ? a : b);
console.log('Max:', max);

// Count occurrences
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log('Count:', count);

// Group by property
const people = [
  { name: 'Alice', dept: 'Engineering' },
  { name: 'Bob', dept: 'Marketing' },
  { name: 'Charlie', dept: 'Engineering' },
  { name: 'Diana', dept: 'Marketing' }
];

const grouped = people.reduce((acc, person) => {
  const key = person.dept;
  acc[key] = acc[key] || [];
  acc[key].push(person.name);
  return acc;
}, {});
console.log('\nGrouped:', grouped);

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
console.log('Flatten:', flat);

// Reduce can implement map and filter!
console.log('\n--- Reduce implements everything ---');

const mapWithReduce = (arr, fn) =>
  arr.reduce((acc, x, i) => [...acc, fn(x, i)], []);

const filterWithReduce = (arr, fn) =>
  arr.reduce((acc, x, i) => fn(x, i) ? [...acc, x] : acc, []);

console.log('Map via reduce:', mapWithReduce([1, 2, 3], x => x * 2));
console.log('Filter via reduce:', filterWithReduce([1, 2, 3, 4], x => x > 2));


// =============================================================================
// CHAINING: Combining All Three
// =============================================================================

console.log('\n=== Chaining ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PIPELINE                                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  data                                                               │
 *   │    .filter(...)   → remove unwanted                                 │
 *   │    .map(...)      → transform                                       │
 *   │    .reduce(...)   → combine                                         │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const orders = [
  { product: 'Laptop', price: 999, quantity: 2, status: 'completed' },
  { product: 'Phone', price: 699, quantity: 1, status: 'cancelled' },
  { product: 'Tablet', price: 499, quantity: 3, status: 'completed' },
  { product: 'Watch', price: 299, quantity: 1, status: 'completed' }
];

// Total revenue from completed orders
const revenue = orders
  .filter(o => o.status === 'completed')
  .map(o => o.price * o.quantity)
  .reduce((total, amount) => total + amount, 0);

console.log('Total revenue:', revenue);

// Most expensive completed product
const mostExpensive = orders
  .filter(o => o.status === 'completed')
  .reduce((max, o) => o.price > max.price ? o : max);

console.log('Most expensive:', mostExpensive.product);


// =============================================================================
// PERFORMANCE: CHAINING vs SINGLE REDUCE
// =============================================================================

console.log('\n=== Performance Consideration ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CHAINING vs SINGLE PASS                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Chaining: 3 passes over data (filter → map → reduce)              │
 *   │  Single reduce: 1 pass over data                                    │
 *   │                                                                     │
 *   │  For small arrays: chaining is more readable                        │
 *   │  For large arrays: single reduce is faster                          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Chaining (3 passes, readable)
const revenueChain = orders
  .filter(o => o.status === 'completed')
  .map(o => o.price * o.quantity)
  .reduce((sum, n) => sum + n, 0);

// Single reduce (1 pass, faster for large data)
const revenueSingle = orders.reduce((sum, o) => {
  if (o.status === 'completed') {
    return sum + o.price * o.quantity;
  }
  return sum;
}, 0);

console.log('Chain result:', revenueChain);
console.log('Single result:', revenueSingle);
console.log('(Same result, single pass is faster for large datasets)');


// =============================================================================
// OTHER USEFUL METHODS
// =============================================================================

console.log('\n=== Other Array Methods ===\n');

const nums = [1, 2, 3, 4, 5];

// find - first matching element
console.log('find(>3):', nums.find(x => x > 3));

// findIndex - index of first match
console.log('findIndex(>3):', nums.findIndex(x => x > 3));

// some - any element passes?
console.log('some(>3):', nums.some(x => x > 3));

// every - all elements pass?
console.log('every(>0):', nums.every(x => x > 0));

// flatMap - map + flatten
const sentences = ['hello world', 'foo bar'];
console.log('flatMap:', sentences.flatMap(s => s.split(' ')));


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Map, filter, and reduce are the core functional array methods that
 * replace imperative loops.
 *
 * Map transforms each element and returns a new array of the same length.
 * Filter returns a new array with only elements that pass a test.
 * Reduce accumulates all elements into a single value - it's the most
 * powerful because you can implement map and filter with reduce.
 *
 * I chain them for readable data pipelines: filter unwanted data, map
 * to transform, then reduce to aggregate.
 *
 * An important gotcha is that chaining creates intermediate arrays.
 * For small datasets, readability wins. For large datasets, a single
 * reduce pass is more performant because it only iterates once.
 *
 * CRITICAL: Always provide an initial value to reduce. Without one,
 * it uses the first element as the initial accumulator, which can
 * cause bugs with empty arrays - it throws a TypeError.
 *
 * Real-world: I use these for transforming API responses, calculating
 * totals, grouping data, and building lookup objects."
 */


// RUN: node docs/28-functional-programming/09-map-filter-reduce.js
