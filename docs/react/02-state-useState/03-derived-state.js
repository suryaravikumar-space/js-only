/**
 * TOPIC: Derived State & useMemo Concept
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ If you can COMPUTE a value from existing state/props, DON'T store it    ║
 * ║ as separate state. Derive it during render. Use useMemo only when       ║
 * ║ the computation is EXPENSIVE.                                            ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ Derived state is like your AGE. You don't store it separately from       │
 * │ your birthdate - you CALCULATE it. Storing both creates bugs when        │
 * │ one updates but the other doesn't.                                       │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   BAD (redundant state):        GOOD (derived):                           │
 * │   ┌──────────────────┐          ┌──────────────────┐                      │
 * │   │ items: [...]      │          │ items: [...]      │                     │
 * │   │ filteredItems: [] │ ← sync?  │ // computed:      │                     │
 * │   │ totalPrice: 99   │ ← sync?  │ filtered = items  │                     │
 * │   └──────────────────┘          │   .filter(...)    │                     │
 * │   OUT OF SYNC RISK!             │ total = items     │                     │
 * │                                  │   .reduce(...)    │                     │
 * │                                  └──────────────────┘                      │
 * │                                  ALWAYS IN SYNC!                           │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: BAD - storing derived state separately
console.log('A: BAD pattern - redundant state:');
let items = [
  { name: 'Apple', price: 2, inStock: true },
  { name: 'Banana', price: 1, inStock: false },
  { name: 'Cherry', price: 3, inStock: true },
];
let filteredItems = items.filter(i => i.inStock);  // stored separately
let totalPrice = items.reduce((sum, i) => sum + i.price, 0);

items.push({ name: 'Date', price: 4, inStock: true });
// filteredItems and totalPrice are now STALE!
console.log('   items count:', items.length);
console.log('   filteredItems count:', filteredItems.length, '(STALE - missing Date!)');
console.log('   totalPrice:', totalPrice, '(STALE - missing Date!)');

// B: GOOD - derive values when needed
console.log('\nB: GOOD pattern - derive on access:');
function getFilteredItems(items) { return items.filter(i => i.inStock); }
function getTotalPrice(items) { return items.reduce((sum, i) => sum + i.price, 0); }

console.log('   filteredItems:', getFilteredItems(items).length, '(always correct)');
console.log('   totalPrice:', getTotalPrice(items), '(always correct)');

// C: Simulating useMemo - cache expensive computations
console.log('\nC: useMemo simulation (memoization):');
function useMemo(computeFn, deps) {
  if (!useMemo._cache) useMemo._cache = {};
  const key = JSON.stringify(deps);
  if (useMemo._cache[key] === undefined) {
    console.log('   [Computing - cache miss]');
    useMemo._cache[key] = computeFn();
  } else {
    console.log('   [Using cached - cache hit]');
  }
  return useMemo._cache[key];
}

const expensiveResult1 = useMemo(() => getTotalPrice(items), [items.length]);
const expensiveResult2 = useMemo(() => getTotalPrice(items), [items.length]);
console.log('   Result:', expensiveResult1, expensiveResult2);

// D: When to use useMemo
console.log('\nD: When to useMemo:');
const guidelines = [
  'YES: Filtering/sorting large lists (1000+ items)',
  'YES: Complex calculations (recursive, mathematical)',
  'NO:  Simple arithmetic (a + b)',
  'NO:  String concatenation',
  'NO:  Premature optimization - measure first!',
];
guidelines.forEach(g => console.log('   ' + g));

// E: Common derived state examples
console.log('\nE: Common derived values (compute, don\'t store):');
const examples = [
  ['fullName',       'firstName + " " + lastName'],
  ['filteredList',   'items.filter(i => i.matches(query))'],
  ['total',          'cart.reduce((sum, i) => sum + i.price, 0)'],
  ['isValid',        'name.length > 0 && email.includes("@")'],
  ['sortedItems',    '[...items].sort((a,b) => a.name.localeCompare(b.name))'],
];
examples.forEach(([name, expr]) => console.log(`   ${name.padEnd(16)}: ${expr}`));

/**
 * OUTPUT:
 *   A: BAD pattern showing stale derived state
 *   B: GOOD pattern with computed values
 *   C: useMemo cache hit/miss demonstration
 *   D: When to useMemo guidelines
 *   E: Common derived state examples
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "If a value can be computed from existing state or props, derive it       │
 * │  during render instead of storing it as separate state. Redundant state   │
 * │  creates sync bugs. For expensive computations, wrap with useMemo to     │
 * │  cache the result until dependencies change. But don't memoize           │
 * │  everything - only when you've measured a performance issue."             │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/02-state-useState/03-derived-state.js
 */
