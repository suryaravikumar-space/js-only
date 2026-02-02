/**
 * FUNCTIONAL PROGRAMMING: 02 - Immutability
 *
 * ONE CONCEPT: Never modify existing data, always create new copies
 */


// =============================================================================
// WHAT IS IMMUTABILITY?
// =============================================================================

console.log('=== Immutability ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MUTABLE vs IMMUTABLE                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  MUTABLE (changeable):                                               │
 *   │  ┌─────────────┐                                                     │
 *   │  │ [1, 2, 3]   │ ← Original array                                    │
 *   │  └─────────────┘                                                     │
 *   │        │                                                             │
 *   │        │ push(4)                                                     │
 *   │        ▼                                                             │
 *   │  ┌─────────────┐                                                     │
 *   │  │ [1, 2, 3, 4]│ ← SAME array, modified                              │
 *   │  └─────────────┘                                                     │
 *   │                                                                      │
 *   │                                                                      │
 *   │  IMMUTABLE (unchangeable):                                           │
 *   │  ┌─────────────┐                                                     │
 *   │  │ [1, 2, 3]   │ ← Original (untouched)                              │
 *   │  └─────────────┘                                                     │
 *   │        │                                                             │
 *   │        │ [...arr, 4]                                                 │
 *   │        ▼                                                             │
 *   │  ┌─────────────┐                                                     │
 *   │  │ [1, 2, 3, 4]│ ← NEW array                                         │
 *   │  └─────────────┘                                                     │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// WHY IMMUTABILITY?
// =============================================================================

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  BENEFITS                                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. PREDICTABILITY                                                  │
 *   │     Data doesn't change unexpectedly                                │
 *   │                                                                     │
 *   │  2. CHANGE DETECTION                                                │
 *   │     oldObj !== newObj means something changed                       │
 *   │     (React uses this for performance!)                              │
 *   │                                                                     │
 *   │  3. DEBUGGING                                                       │
 *   │     Keep history of all states                                      │
 *   │     Time-travel debugging possible                                  │
 *   │                                                                     │
 *   │  4. CONCURRENCY                                                     │
 *   │     No race conditions with shared data                             │
 *   │                                                                     │
 *   │  5. UNDO/REDO                                                       │
 *   │     Just keep array of previous states                              │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// IMMUTABLE ARRAY OPERATIONS
// =============================================================================

console.log('=== Immutable Array Operations ===\n');

const original = [1, 2, 3];
console.log('Original:', original);

// ─────────────────────────────────────────────────────────────────────────────
// ADD ITEM
// ─────────────────────────────────────────────────────────────────────────────

// WRONG ✗
// original.push(4);

// CORRECT ✓
const added = [...original, 4];
console.log('Add to end:', added);

const prepended = [0, ...original];
console.log('Add to start:', prepended);

const insertAt = [...original.slice(0, 1), 1.5, ...original.slice(1)];
console.log('Insert at index 1:', insertAt);


// ─────────────────────────────────────────────────────────────────────────────
// REMOVE ITEM
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n--- Remove ---');

// WRONG ✗
// original.splice(1, 1);

// CORRECT ✓
const removed = original.filter((_, i) => i !== 1);
console.log('Remove index 1:', removed);

const removedValue = original.filter(x => x !== 2);
console.log('Remove value 2:', removedValue);


// ─────────────────────────────────────────────────────────────────────────────
// UPDATE ITEM
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n--- Update ---');

// WRONG ✗
// original[1] = 20;

// CORRECT ✓
const updated = original.map((x, i) => i === 1 ? 20 : x);
console.log('Update index 1 to 20:', updated);

console.log('\nOriginal unchanged:', original);


// =============================================================================
// IMMUTABLE OBJECT OPERATIONS
// =============================================================================

console.log('\n=== Immutable Object Operations ===\n');

const user = { name: 'Alice', age: 25, city: 'NYC' };
console.log('Original user:', user);

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PROPERTY
// ─────────────────────────────────────────────────────────────────────────────

// WRONG ✗
// user.age = 26;

// CORRECT ✓
const olderUser = { ...user, age: 26 };
console.log('Update age:', olderUser);


// ─────────────────────────────────────────────────────────────────────────────
// ADD PROPERTY
// ─────────────────────────────────────────────────────────────────────────────

const withEmail = { ...user, email: 'alice@example.com' };
console.log('Add email:', withEmail);


// ─────────────────────────────────────────────────────────────────────────────
// REMOVE PROPERTY
// ─────────────────────────────────────────────────────────────────────────────

const { city, ...withoutCity } = user;  // Destructuring
console.log('Remove city:', withoutCity);

console.log('\nOriginal unchanged:', user);


// =============================================================================
// NESTED IMMUTABILITY (TRICKY!)
// =============================================================================

console.log('\n=== Nested Immutability ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THE CHALLENGE                                                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Spread only does SHALLOW copy!                                     │
 *   │                                                                     │
 *   │  const obj = { nested: { value: 1 } };                              │
 *   │  const copy = { ...obj };                                           │
 *   │                                                                     │
 *   │  copy.nested.value = 2;  // ALSO modifies original!                 │
 *   │                                                                     │
 *   │  ┌─────────┐      ┌─────────┐                                       │
 *   │  │   obj   │      │  copy   │                                       │
 *   │  │ nested ─┼──────┼─ nested │  ← Same reference!                    │
 *   │  └─────────┘      └─────────┘                                       │
 *   │       └───────┬───────┘                                             │
 *   │         ┌─────┴─────┐                                               │
 *   │         │ { value } │                                               │
 *   │         └───────────┘                                               │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const state = {
  user: {
    name: 'Alice',
    address: {
      city: 'NYC',
      zip: '10001'
    }
  },
  items: [1, 2, 3]
};

console.log('Original state:', JSON.stringify(state, null, 2));

// WRONG ✗ - Shallow copy, nested objects shared
// const newState = { ...state };
// newState.user.address.city = 'LA';  // Modifies original!

// CORRECT ✓ - Deep copy each level
const newState = {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'LA'
    }
  }
};

console.log('\nNew state:', JSON.stringify(newState, null, 2));
console.log('\nOriginal unchanged:', state.user.address.city);


// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

console.log('\n=== Immutable Helper Functions ===\n');

// Deep clone (simple)
const deepClone = obj => JSON.parse(JSON.stringify(obj));

// Update nested property
function updateNested(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();

  const result = { ...obj };
  let current = result;

  for (const key of keys) {
    current[key] = { ...current[key] };
    current = current[key];
  }

  current[lastKey] = value;
  return result;
}

const data = { a: { b: { c: 1 } } };
const updated2 = updateNested(data, 'a.b.c', 42);
console.log('Original:', JSON.stringify(data));
console.log('Updated:', JSON.stringify(updated2));


// =============================================================================
// REAL-WORLD: REACT STATE
// =============================================================================

console.log('\n=== Real-World: React State ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHY REACT REQUIRES IMMUTABILITY                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  React uses reference equality for performance:                     │
 *   │                                                                     │
 *   │  if (oldState !== newState) {                                       │
 *   │    // Re-render component                                           │
 *   │  }                                                                  │
 *   │                                                                     │
 *   │  If you mutate, oldState === newState (same object)                 │
 *   │  React won't detect the change!                                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulated React state update
function simulateReactUpdate() {
  let state = { count: 0, items: ['a', 'b'] };

  // WRONG - Mutation (React won't re-render!)
  // state.count = 1;

  // CORRECT - New object (React detects change)
  const setState = (updater) => {
    const oldState = state;
    state = typeof updater === 'function' ? updater(state) : updater;

    const changed = oldState !== state;
    console.log(`State change detected: ${changed}`);
    return state;
  };

  // Add item immutably
  setState(prev => ({
    ...prev,
    items: [...prev.items, 'c']
  }));

  console.log('Final state:', state);
}

simulateReactUpdate();


// =============================================================================
// OBJECT.FREEZE (SHALLOW!)
// =============================================================================

console.log('\n=== Object.freeze ===\n');

const frozen = Object.freeze({ name: 'Alice', nested: { age: 25 } });

// This silently fails (or throws in strict mode)
frozen.name = 'Bob';
console.log('frozen.name:', frozen.name);  // Still 'Alice'

// BUT nested objects are NOT frozen!
frozen.nested.age = 30;  // This works!
console.log('frozen.nested.age:', frozen.nested.age);  // 30

// Deep freeze helper
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(value => {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  });
  return obj;
}


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Immutability means never modifying existing data - instead, we create
 * new copies with the changes. In JavaScript, I use spread operators for
 * objects and arrays: {...obj, newProp} or [...arr, newItem].
 *
 * The main benefit in React is change detection. React compares references
 * to detect changes - oldState !== newState. If you mutate the original
 * object, React won't see the change because it's still the same reference.
 *
 * The tricky part is nested updates. Spread only does shallow copies, so
 * for nested objects you need to spread at each level. For complex state,
 * I might use Immer which lets you write mutating code that produces
 * immutable updates under the hood.
 *
 * Immutability also enables time-travel debugging in Redux DevTools and
 * makes undo/redo trivial - just keep an array of previous states."
 */


// RUN: node docs/28-functional-programming/02-immutability.js
