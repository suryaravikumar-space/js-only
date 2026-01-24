/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONAL PROGRAMMING - FILE 1: PURE FUNCTIONS & IMMUTABILITY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Foundation of functional programming: Pure functions and immutable data
 * are the building blocks for predictable, testable code.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       PURE FUNCTIONS & IMMUTABILITY - FP FOUNDATIONS              ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                        WHAT IS A PURE FUNCTION?                            ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  A pure function has TWO key properties:                                   ║
 * ║                                                                            ║
 * ║  1. DETERMINISTIC                                                          ║
 * ║     Same inputs ALWAYS produce same outputs                                ║
 * ║                                                                            ║
 * ║     f(x) = y   ← Always, forever, guaranteed                              ║
 * ║                                                                            ║
 * ║  2. NO SIDE EFFECTS                                                        ║
 * ║     • Doesn't modify external state                                       ║
 * ║     • Doesn't mutate input arguments                                      ║
 * ║     • Doesn't perform I/O operations                                      ║
 * ║     • Doesn't call other impure functions                                 ║
 * ║                                                                            ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐  ║
 * ║  │                                                                      │  ║
 * ║  │     INPUT ────────► PURE FUNCTION ────────► OUTPUT                  │  ║
 * ║  │                          │                                          │  ║
 * ║  │                     No external                                     │  ║
 * ║  │                    dependencies                                     │  ║
 * ║  │                                                                      │  ║
 * ║  └─────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("1️⃣  PURE vs IMPURE FUNCTIONS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                         PURE FUNCTION EXAMPLES                             │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// ✅ PURE: Same input → Same output, no side effects
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function getFullName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

function getArrayLength(arr) {
  return arr.length;
}

// Pure: Creates NEW array, doesn't modify input
function doubleArray(arr) {
  return arr.map(x => x * 2);
}

// Pure: Returns new object, doesn't modify input
function updateAge(person, newAge) {
  return { ...person, age: newAge };
}

console.log("=== Pure Function Examples ===");
console.log("add(2, 3):", add(2, 3));
console.log("add(2, 3):", add(2, 3)); // Always same
console.log("multiply(4, 5):", multiply(4, 5));
console.log("getFullName('John', 'Doe'):", getFullName('John', 'Doe'));
console.log("doubleArray([1, 2, 3]):", doubleArray([1, 2, 3]));


/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        IMPURE FUNCTION EXAMPLES                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n=== Impure Function Examples ===");

// ❌ IMPURE: Depends on external state
let counter = 0;
function incrementCounter() {
  counter++; // Modifies external state
  return counter;
}

// ❌ IMPURE: Different output for same input
function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

// ❌ IMPURE: Modifies input (mutation)
function addItemMutating(arr, item) {
  arr.push(item); // Modifies original array!
  return arr;
}

// ❌ IMPURE: Performs I/O
function logMessage(msg) {
  console.log(msg); // Side effect: I/O
  return msg;
}

// ❌ IMPURE: Depends on current time
function getCurrentTimeMessage() {
  return `Current time: ${new Date().toISOString()}`;
}

console.log("incrementCounter():", incrementCounter()); // 1
console.log("incrementCounter():", incrementCounter()); // 2 - Different!
console.log("getRandomNumber(100):", getRandomNumber(100)); // Random each time

const originalArr = [1, 2, 3];
addItemMutating(originalArr, 4);
console.log("After mutation, originalArr:", originalArr); // Modified!


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                       SIDE EFFECTS CATALOG
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("2️⃣  COMMON SIDE EFFECTS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SIDE EFFECTS TO AVOID                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MUTATION                                                                    │
│  ─────────                                                                   │
│  • Modifying input arguments                                                │
│  • Changing object/array properties                                         │
│  • Reassigning variables outside scope                                      │
│                                                                              │
│  EXTERNAL STATE                                                              │
│  ──────────────                                                              │
│  • Reading/writing global variables                                         │
│  • Accessing closure variables                                              │
│  • Database operations                                                       │
│                                                                              │
│  I/O OPERATIONS                                                              │
│  ─────────────                                                               │
│  • console.log, console.error                                               │
│  • File system read/write                                                   │
│  • Network requests                                                          │
│  • DOM manipulation                                                          │
│                                                                              │
│  NON-DETERMINISTIC                                                           │
│  ─────────────────                                                           │
│  • Math.random()                                                            │
│  • Date.now(), new Date()                                                   │
│  • UUID generation                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    MAKING IMPURE FUNCTIONS PURE
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("3️⃣  MAKING IMPURE FUNCTIONS PURE\n");

console.log("=== Strategy 1: Inject Dependencies ===\n");

// ❌ Impure: Uses Math.random internally
function impureGenerateId() {
  return Math.random().toString(36).substring(2);
}

// ✅ Pure: Random function is injected
function pureGenerateId(randomFn) {
  return randomFn().toString(36).substring(2);
}

console.log("Impure ID:", impureGenerateId());
console.log("Pure ID (with mock):", pureGenerateId(() => 0.123456789));
console.log("Pure ID (with mock):", pureGenerateId(() => 0.123456789)); // Same!


console.log("\n=== Strategy 2: Return New Instead of Mutate ===\n");

// ❌ Impure: Mutates input
function impureSort(arr) {
  return arr.sort((a, b) => a - b); // Mutates original!
}

// ✅ Pure: Returns new sorted array
function pureSort(arr) {
  return [...arr].sort((a, b) => a - b);
}

const numbers = [3, 1, 4, 1, 5];
console.log("Original:", numbers);
console.log("pureSort result:", pureSort(numbers));
console.log("Original after pureSort:", numbers); // Unchanged!


console.log("\n=== Strategy 3: Move Side Effects to the Edge ===\n");

console.log(`
// Push side effects to the boundaries of your application

// ❌ Impure: Fetches and processes
async function impureGetUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  const user = await response.json();
  return \`Hello, \${user.name}!\`;
}

// ✅ Pure: Only processes (data transformation)
function formatUserGreeting(user) {
  return \`Hello, \${user.name}!\`;
}

// Impure boundary (kept separate)
async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// Usage: Pure core, impure shell
const user = await fetchUser(1);           // Impure: I/O
const greeting = formatUserGreeting(user); // Pure: transform
console.log(greeting);                     // Impure: I/O
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                         IMMUTABILITY
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("4️⃣  IMMUTABILITY - NEVER MUTATE DATA\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                      WHY IMMUTABILITY?                                     │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Mutable State:                                                           │
 * │  ┌─────────┐                                                              │
 * │  │ Object  │ ◄──── Reference A                                            │
 * │  │  data   │ ◄──── Reference B                                            │
 * │  └─────────┘                                                              │
 * │       │                                                                    │
 * │       ▼  A modifies object                                                │
 * │  ┌─────────┐                                                              │
 * │  │ Changed │ ◄──── Reference A                                            │
 * │  │  data!  │ ◄──── Reference B  (B is surprised!)                        │
 * │  └─────────┘                                                              │
 * │                                                                            │
 * │  Immutable State:                                                          │
 * │  ┌─────────┐                                                              │
 * │  │ Object  │ ◄──── Reference A                                            │
 * │  │  data   │ ◄──── Reference B                                            │
 * │  └─────────┘                                                              │
 * │       │                                                                    │
 * │       │  A creates NEW object                                             │
 * │       ▼                                                                    │
 * │  ┌─────────┐     ┌─────────┐                                             │
 * │  │ Object  │     │   New   │ ◄──── Reference A (points to new)           │
 * │  │  data   │ ◄───│  Object │                                             │
 * │  └─────────┘     └─────────┘                                             │
 * │       ▲                                                                    │
 * │  Reference B (still sees original)                                        │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log("=== Immutable Object Updates ===\n");

// Original object
const person = {
  name: 'Alice',
  age: 30,
  address: {
    city: 'Seattle',
    country: 'USA'
  }
};

// ❌ MUTATION (Bad)
// person.age = 31;

// ✅ IMMUTABLE UPDATE (Good)

// Shallow copy with spread
const personWithNewAge = { ...person, age: 31 };
console.log("Original person:", person);
console.log("Updated person:", personWithNewAge);
console.log("Same object?", person === personWithNewAge); // false

// Nested update (must spread nested objects too!)
const personWithNewCity = {
  ...person,
  address: {
    ...person.address,
    city: 'Portland'
  }
};

console.log("Original city:", person.address.city);
console.log("New city:", personWithNewCity.address.city);


console.log("\n=== Immutable Array Operations ===\n");

const fruits = ['apple', 'banana', 'cherry'];

// ❌ MUTATING METHODS (avoid these)
// fruits.push('date');      // Mutates!
// fruits.pop();             // Mutates!
// fruits.splice(1, 1);      // Mutates!
// fruits.sort();            // Mutates!
// fruits.reverse();         // Mutates!

// ✅ IMMUTABLE ALTERNATIVES
const withDate = [...fruits, 'date'];           // Add to end
const withGrape = ['grape', ...fruits];         // Add to start
const withoutBanana = fruits.filter(f => f !== 'banana');  // Remove
const doubled = fruits.map(f => f.toUpperCase()); // Transform
const sorted = [...fruits].sort();              // Sort copy

console.log("Original:", fruits);
console.log("With date:", withDate);
console.log("With grape:", withGrape);
console.log("Without banana:", withoutBanana);
console.log("Uppercased:", doubled);
console.log("Sorted:", sorted);
console.log("Original unchanged:", fruits);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     IMMUTABLE UPDATE PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("5️⃣  IMMUTABLE UPDATE PATTERNS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IMMUTABLE UPDATE PATTERNS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTS:                                                                    │
│  ─────────                                                                   │
│  // Add/Update property                                                      │
│  const updated = { ...obj, newProp: value };                                │
│                                                                              │
│  // Remove property                                                          │
│  const { propToRemove, ...rest } = obj;                                     │
│                                                                              │
│  // Nested update                                                            │
│  const nested = {                                                            │
│    ...obj,                                                                   │
│    level1: { ...obj.level1, level2: newValue }                              │
│  };                                                                          │
│                                                                              │
│  ARRAYS:                                                                     │
│  ────────                                                                    │
│  // Add to end                                                               │
│  const added = [...arr, newItem];                                           │
│                                                                              │
│  // Add to start                                                             │
│  const prepended = [newItem, ...arr];                                       │
│                                                                              │
│  // Insert at index                                                          │
│  const inserted = [...arr.slice(0, i), newItem, ...arr.slice(i)];           │
│                                                                              │
│  // Remove at index                                                          │
│  const removed = arr.filter((_, idx) => idx !== i);                         │
│                                                                              │
│  // Update at index                                                          │
│  const updated = arr.map((item, idx) => idx === i ? newItem : item);        │
│                                                                              │
│  // Concatenate                                                              │
│  const combined = [...arr1, ...arr2];                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
`);

// Practical examples
console.log("=== Practical Update Examples ===\n");

// Update item in array of objects
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: true },
  { id: 3, name: 'Charlie', active: true }
];

// Deactivate user with id 2
const updatedUsers = users.map(user =>
  user.id === 2 ? { ...user, active: false } : user
);

console.log("Original users:", users);
console.log("Updated users:", updatedUsers);
console.log("Same array?", users === updatedUsers); // false

// Remove property from object
const userWithSecret = { name: 'Alice', password: 'secret123', age: 30 };
const { password, ...safeUser } = userWithSecret;

console.log("\nUser with password:", userWithSecret);
console.log("Safe user (password removed):", safeUser);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     OBJECT.FREEZE vs LIBRARIES
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("6️⃣  ENFORCING IMMUTABILITY\n");

console.log("=== Object.freeze() ===\n");

const frozenPerson = Object.freeze({
  name: 'Alice',
  address: { city: 'Seattle' }
});

// These fail silently (or throw in strict mode)
frozenPerson.name = 'Bob';
frozenPerson.newProp = 'value';
delete frozenPerson.name;

console.log("Frozen person after mutation attempts:", frozenPerson);
console.log("name still Alice:", frozenPerson.name);

// ⚠️ WARNING: Object.freeze is SHALLOW!
frozenPerson.address.city = 'Portland'; // This WORKS!
console.log("Nested city mutated:", frozenPerson.address.city); // Portland

// Deep freeze helper
function deepFreeze(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}

console.log("\n=== Immutability Libraries ===\n");

console.log(`
Popular immutability libraries:

┌─────────────────────────────────────────────────────────────────────────────┐
│ Library          │ Description                          │ Size            │
├──────────────────┼──────────────────────────────────────┼─────────────────┤
│ Immer            │ "Mutate" drafts, produces immutable  │ ~12KB gzipped   │
│                  │ result. Most ergonomic.              │                 │
├──────────────────┼──────────────────────────────────────┼─────────────────┤
│ Immutable.js     │ Persistent data structures           │ ~60KB gzipped   │
│                  │ (List, Map, Set). By Facebook.       │                 │
├──────────────────┼──────────────────────────────────────┼─────────────────┤
│ seamless-immut.  │ Backwards compatible, works with     │ ~3KB gzipped    │
│                  │ regular JS objects/arrays.           │                 │
└─────────────────────────────────────────────────────────────────────────────┘

// Immer example (most popular):
const { produce } = require('immer');

const nextState = produce(state, draft => {
  // "Mutate" the draft - Immer makes it immutable!
  draft.users[0].name = 'New Name';
  draft.users.push({ id: 4, name: 'New User' });
});
// state is unchanged, nextState has updates
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    BENEFITS OF PURE FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("7️⃣  BENEFITS OF PURE FUNCTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WHY USE PURE FUNCTIONS?                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. TESTABLE                                                                 │
│     • No mocking of external state needed                                   │
│     • Input → Output, that's all you test                                   │
│     • Deterministic = predictable tests                                     │
│                                                                              │
│  2. CACHEABLE (Memoization)                                                  │
│     • Same input → Same output                                              │
│     • Can cache results safely                                              │
│     • Huge performance gains for expensive computations                     │
│                                                                              │
│  3. PARALLELIZABLE                                                           │
│     • No shared state = no race conditions                                  │
│     • Can run on multiple threads/workers safely                            │
│                                                                              │
│  4. DEBUGGABLE                                                               │
│     • Easier to trace: output depends only on input                         │
│     • No hidden state mutations to track                                    │
│     • Time-travel debugging possible (Redux)                                │
│                                                                              │
│  5. REUSABLE                                                                 │
│     • No dependencies on external context                                   │
│     • Can be moved, copied, composed freely                                 │
│                                                                              │
│  6. REFERENTIALLY TRANSPARENT                                                │
│     • Function call can be replaced with its result                         │
│     • Enables powerful optimizations                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
`);

// Memoization example
console.log("=== Memoization Example ===\n");

function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`  Cache hit for ${key}`);
      return cache.get(key);
    }
    console.log(`  Computing for ${key}`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Expensive pure function
function expensiveCalculation(n) {
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

const memoizedCalc = memoize(expensiveCalculation);

console.log("First call (1):", memoizedCalc(1));
console.log("Second call (1):", memoizedCalc(1)); // Cache hit!
console.log("First call (2):", memoizedCalc(2));
console.log("Third call (1):", memoizedCalc(1)); // Cache hit!


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📋  PURE FUNCTIONS - INTERVIEW QUESTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: What makes a function pure?                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Two properties:                                                          │
│    1. Deterministic: Same inputs always produce same outputs               │
│    2. No side effects: Doesn't modify external state or perform I/O        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: Why is immutability important in functional programming?                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: • Prevents unexpected changes (no shared mutable state bugs)            │
│    • Enables safe caching/memoization                                       │
│    • Makes code predictable and easier to debug                            │
│    • Allows safe parallelization                                            │
│    • Enables time-travel debugging (state history)                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: Is this function pure? console.log(x) || return x * 2                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: No, it's impure. console.log is a side effect (I/O operation).          │
│    Even though it returns deterministic output, the logging makes it       │
│    impure because it changes the external world (console output).          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: How do you update a nested object immutably?                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Spread at every level:                                                   │
│                                                                              │
│    const updated = {                                                        │
│      ...obj,                                                                │
│      nested: {                                                              │
│        ...obj.nested,                                                       │
│        property: newValue                                                   │
│      }                                                                       │
│    };                                                                        │
│                                                                              │
│    Or use libraries like Immer for cleaner syntax.                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: What is referential transparency?                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: An expression is referentially transparent if it can be replaced with   │
│    its value without changing program behavior.                             │
│                                                                              │
│    Pure functions are referentially transparent:                            │
│    add(2, 3) can always be replaced with 5                                 │
│                                                                              │
│    Impure functions are not:                                                │
│    getRandomNumber() cannot be replaced with a value                       │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("📝  PURE FUNCTIONS CHEAT SHEET\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                       PURE FUNCTIONS CHECKLIST                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Is your function PURE? Check:                                             ║
║  □ Same inputs → Same outputs (always)                                    ║
║  □ No console.log or other I/O                                            ║
║  □ No modifying arguments                                                  ║
║  □ No accessing/modifying globals                                          ║
║  □ No Math.random() or Date.now()                                          ║
║  □ No network/database calls                                               ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                      IMMUTABLE OPERATIONS                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ARRAYS (use these instead of mutating methods):                          ║
║  • [...arr, item]          instead of  arr.push(item)                     ║
║  • arr.slice(0, -1)        instead of  arr.pop()                          ║
║  • arr.filter(predicate)   instead of  arr.splice(i, 1)                   ║
║  • arr.map(transform)      instead of  for loop mutation                  ║
║  • [...arr].sort()         instead of  arr.sort()                         ║
║                                                                            ║
║  OBJECTS:                                                                  ║
║  • { ...obj, key: val }    Add/update property                            ║
║  • { ...obj, ...updates }  Merge updates                                  ║
║  • omit(obj, 'key')        Remove property                                ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FILE 1 COMPLETE ═══");
console.log("Run: node 02-higher-order-functions.js");
