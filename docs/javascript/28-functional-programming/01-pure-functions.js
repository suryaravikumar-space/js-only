/**
 * FUNCTIONAL PROGRAMMING: 01 - Pure Functions
 *
 * ONE CONCEPT: Functions with no side effects that always return same output
 */


// =============================================================================
// WHAT IS A PURE FUNCTION?
// =============================================================================

console.log('=== Pure Functions ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TWO RULES FOR PURITY                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. DETERMINISTIC                                                    │
 *   │     Same input → Same output, ALWAYS                                 │
 *   │                                                                      │
 *   │  2. NO SIDE EFFECTS                                                  │
 *   │     Doesn't modify anything outside its scope                        │
 *   │                                                                      │
 *   │                                                                      │
 *   │  PURE:                    IMPURE:                                    │
 *   │  ┌───────────┐            ┌───────────┐                              │
 *   │  │   Input   │            │   Input   │                              │
 *   │  └─────┬─────┘            └─────┬─────┘                              │
 *   │        │                        │                                    │
 *   │        ▼                        ▼                                    │
 *   │  ┌───────────┐            ┌───────────┐──── Reads global state       │
 *   │  │  Function │            │  Function │──── Modifies external        │
 *   │  └─────┬─────┘            └─────┬─────┘──── Console/Network/DB       │
 *   │        │                        │                                    │
 *   │        ▼                        ▼                                    │
 *   │  ┌───────────┐            ┌───────────┐                              │
 *   │  │  Output   │            │  Output   │ (may vary!)                  │
 *   │  └───────────┘            └───────────┘                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// PURE vs IMPURE EXAMPLES
// =============================================================================

console.log('=== Pure vs Impure ===\n');

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 1: Simple Calculation
// ─────────────────────────────────────────────────────────────────────────────

// PURE ✓
const add = (a, b) => a + b;
console.log('Pure add(2, 3):', add(2, 3));
console.log('Pure add(2, 3):', add(2, 3));  // Always 5

// IMPURE ✗ - Depends on external variable
let multiplier = 2;
const multiplyImpure = (x) => x * multiplier;
console.log('Impure multiply(5):', multiplyImpure(5));  // 10
multiplier = 3;
console.log('Impure multiply(5):', multiplyImpure(5));  // 15 (different!)


// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 2: Array Operations
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n--- Array Operations ---\n');

const numbers = [1, 2, 3, 4, 5];

// PURE ✓ - Returns new array
const doubled = numbers.map(x => x * 2);
console.log('Original:', numbers);
console.log('Doubled:', doubled);

// IMPURE ✗ - Mutates original array
const numsCopy = [1, 2, 3, 4, 5];
numsCopy.push(6);  // Mutation!
console.log('After push:', numsCopy);


// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 3: Object Handling
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n--- Object Handling ---\n');

const user = { name: 'Alice', age: 25 };

// IMPURE ✗ - Mutates the object
function birthdayImpure(user) {
  user.age += 1;  // Mutation!
  return user;
}

// PURE ✓ - Returns new object
function birthdayPure(user) {
  return { ...user, age: user.age + 1 };
}

const aged = birthdayPure(user);
console.log('Original user:', user);
console.log('After birthday:', aged);


// =============================================================================
// SIDE EFFECTS
// =============================================================================

console.log('\n=== Side Effects ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHAT MAKES A FUNCTION IMPURE?                                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  READING:                                                           │
 *   │  • Global variables                                                 │
 *   │  • DOM                                                              │
 *   │  • User input                                                       │
 *   │  • Random values (Math.random)                                      │
 *   │  • Current time (Date.now)                                          │
 *   │  • Network/Database                                                 │
 *   │                                                                     │
 *   │  WRITING:                                                           │
 *   │  • Modifying arguments                                              │
 *   │  • Global variables                                                 │
 *   │  • DOM manipulation                                                 │
 *   │  • Console output                                                   │
 *   │  • Network requests                                                 │
 *   │  • File system                                                      │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// IMPURE - Uses Math.random
const getRandomImpure = () => Math.random();

// PURE - Accepts seed
const getRandomPure = (seed) => {
  // Simple deterministic pseudo-random
  return (seed * 9301 + 49297) % 233280 / 233280;
};

console.log('Impure random:', getRandomImpure());
console.log('Impure random:', getRandomImpure());  // Different!
console.log('Pure random(42):', getRandomPure(42));
console.log('Pure random(42):', getRandomPure(42));  // Same!


// =============================================================================
// MAKING IMPURE FUNCTIONS PURE
// =============================================================================

console.log('\n=== Making Functions Pure ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  STRATEGY: Dependency Injection                                    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  BEFORE (impure):                                                   │
 *   │  function getTime() {                                               │
 *   │    return Date.now();  // Depends on external state                 │
 *   │  }                                                                  │
 *   │                                                                     │
 *   │  AFTER (pure):                                                      │
 *   │  function getTime(dateProvider = Date) {                            │
 *   │    return dateProvider.now();                                       │
 *   │  }                                                                  │
 *   │                                                                     │
 *   │  // In tests:                                                       │
 *   │  getTime({ now: () => 1234567890 })  // Predictable!                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// IMPURE - Depends on Date
function formatDateImpure() {
  const now = new Date();
  return now.toISOString();
}

// PURE - Date injected
function formatDatePure(date) {
  return date.toISOString();
}

const fixedDate = new Date('2024-01-15');
console.log('Pure formatDate:', formatDatePure(fixedDate));


// =============================================================================
// REAL-WORLD: Redux Reducers
// =============================================================================

console.log('\n=== Real-World: Redux Reducers ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  REDUCERS MUST BE PURE                                             │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  WHY?                                                               │
 *   │  • Predictable state updates                                        │
 *   │  • Time-travel debugging                                            │
 *   │  • Hot reloading                                                    │
 *   │  • Easy testing                                                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// WRONG ✗
function reducerImpure(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      state.todos.push(action.payload);  // Mutation!
      return state;
    default:
      return state;
  }
}

// CORRECT ✓
function reducerPure(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]  // New array
      };
    default:
      return state;
  }
}

const initialState = { todos: ['Learn JS'] };
const action = { type: 'ADD_TODO', payload: 'Learn FP' };

const newState = reducerPure(initialState, action);
console.log('Original state:', initialState);
console.log('New state:', newState);


// =============================================================================
// TESTING PURE FUNCTIONS
// =============================================================================

console.log('\n=== Testing Pure Functions ===\n');

// Pure function - trivial to test
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Test - no setup, no mocks
const testItems = [
  { name: 'Apple', price: 1, quantity: 3 },
  { name: 'Banana', price: 0.5, quantity: 6 }
];

console.log('calculateTotal test:');
console.log('  Input:', JSON.stringify(testItems));
console.log('  Expected: 6');
console.log('  Actual:', calculateTotal(testItems));
console.log('  Pass:', calculateTotal(testItems) === 6);


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "A pure function has two properties: it always returns the same output
 * for the same input, and it has no side effects - it doesn't modify
 * anything outside its scope.
 *
 * Side effects include mutating arguments, modifying global variables,
 * console logging, network requests, and DOM manipulation.
 *
 * Pure functions are valuable because they're predictable and testable.
 * You can test them with simple assertions - no mocks needed. In React
 * and Redux, reducers must be pure for time-travel debugging to work.
 *
 * To make an impure function pure, I use dependency injection - passing
 * in dependencies like Date or Math.random as parameters. This makes
 * the function deterministic and testable.
 *
 * In practice, side effects are necessary but I push them to the edges
 * of my application and keep the core logic pure."
 */


// RUN: node docs/28-functional-programming/01-pure-functions.js
