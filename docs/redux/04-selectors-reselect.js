/**
 * TOPIC: Selectors & Reselect — Deriving Data from State
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Selectors extract and derive data from state.        ║
 * ║  Memoized selectors (createSelector) avoid            ║
 * ║  recomputation when inputs haven't changed.           ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── WHY SELECTORS? ─────────────────────────────────────┐
 * │ 1. Encapsulate state shape (if shape changes, fix     │
 * │    selectors, not every component)                    │
 * │ 2. Memoize expensive computations                     │
 * │ 3. Compose selectors together                         │
 * │ 4. Reuse across components                            │
 * └───────────────────────────────────────────────────────┘
 */

// --- A: Basic selectors ---
console.log('A: Basic selectors:');

const state = {
  todos: {
    items: [
      { id: 1, text: 'Learn Redux', done: true, priority: 'high' },
      { id: 2, text: 'Build app', done: false, priority: 'high' },
      { id: 3, text: 'Write tests', done: false, priority: 'low' },
      { id: 4, text: 'Deploy', done: true, priority: 'medium' },
    ]
  },
  filters: {
    status: 'all',
    priority: 'all'
  }
};

// Simple selectors (input selectors)
const selectTodos = (state) => state.todos.items;
const selectStatusFilter = (state) => state.filters.status;
const selectPriorityFilter = (state) => state.filters.priority;

console.log(`  All todos: ${selectTodos(state).length}`);
console.log(`  Status filter: ${selectStatusFilter(state)}`);

// --- B: Derived selectors (computed) ---
console.log('\nB: Derived selectors:');

const selectCompletedTodos = (state) =>
  selectTodos(state).filter(t => t.done);

const selectActiveTodos = (state) =>
  selectTodos(state).filter(t => !t.done);

const selectHighPriority = (state) =>
  selectTodos(state).filter(t => t.priority === 'high');

console.log(`  Completed: ${selectCompletedTodos(state).length}`);
console.log(`  Active: ${selectActiveTodos(state).length}`);
console.log(`  High priority: ${selectHighPriority(state).length}`);

// --- C: The problem without memoization ---
console.log('\nC: Problem without memoization:');

let computeCount = 0;
const selectFilteredTodos = (state) => {
  computeCount++;
  return selectTodos(state).filter(t => !t.done);
};

// Every call recomputes even with same state
selectFilteredTodos(state);
selectFilteredTodos(state);
selectFilteredTodos(state);
console.log(`  Computed ${computeCount} times (should be 1 with memoization)`);

// --- D: createSelector (memoization) ---
console.log('\nD: createSelector simulation:');

function createSelector(...args) {
  const resultFunc = args.pop();
  const inputSelectors = args;
  let lastInputs = null;
  let lastResult = null;

  return (state) => {
    const inputs = inputSelectors.map(sel => sel(state));

    // Check if inputs changed (shallow equality)
    if (lastInputs !== null &&
        inputs.length === lastInputs.length &&
        inputs.every((val, i) => val === lastInputs[i])) {
      return lastResult; // return cached
    }

    lastInputs = inputs;
    lastResult = resultFunc(...inputs);
    return lastResult;
  };
}

let memoComputeCount = 0;
const selectFilteredMemo = createSelector(
  selectTodos,
  (todos) => {
    memoComputeCount++;
    return todos.filter(t => !t.done);
  }
);

const result1 = selectFilteredMemo(state);
const result2 = selectFilteredMemo(state); // cached!
const result3 = selectFilteredMemo(state); // cached!

console.log(`  Computed ${memoComputeCount} time(s) — memoized!`);
console.log(`  Same reference? ${result1 === result2}`); // true

// --- E: Composing selectors ---
console.log('\nE: Composing selectors:');

const selectActiveHighPriority = createSelector(
  selectActiveTodos,
  (activeTodos) => activeTodos.filter(t => t.priority === 'high')
);

// Pseudo pattern — in real RTK:
console.log(`
  // Real RTK with reselect:
  import { createSelector } from '@reduxjs/toolkit';

  const selectTodos = (state) => state.todos.items;
  const selectFilter = (state) => state.filters.status;

  const selectFilteredTodos = createSelector(
    [selectTodos, selectFilter],
    (todos, filter) => {
      if (filter === 'all') return todos;
      if (filter === 'active') return todos.filter(t => !t.done);
      if (filter === 'completed') return todos.filter(t => t.done);
    }
  );

  // In component:
  const filteredTodos = useSelector(selectFilteredTodos);
  // Only recomputes when todos or filter changes!
`);

// --- F: useSelector and re-renders ---
console.log('F: useSelector behavior:');
console.log(`
  // ❌ BAD — creates new array every render, causes re-render
  const activeTodos = useSelector(state =>
    state.todos.filter(t => !t.done)
  );

  // ✅ GOOD — memoized, same reference if inputs unchanged
  const activeTodos = useSelector(selectActiveTodos);

  // ✅ ALSO GOOD — primitive values don't need memoization
  const count = useSelector(state => state.counter.value);
`);

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Selectors derive data from state. createSelector from │
 * │ Reselect (included in RTK) memoizes results — only    │
 * │ recomputes when inputs change. Prevents unnecessary   │
 * │ re-renders with useSelector. Compose small selectors  │
 * │ into complex ones. Keep state minimal, derive the rest│
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/redux/04-selectors-reselect.js
 */
