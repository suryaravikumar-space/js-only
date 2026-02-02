/**
 * TOPIC: Redux Basics — Why Redux, Core Principles, Data Flow
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Redux = Predictable state container. One store,      ║
 * ║  one state tree, state changes only via dispatching   ║
 * ║  actions processed by pure reducer functions.         ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Imagine a BANK. You can't reach into the vault        │
 * │ (store) and grab cash. You fill out a withdrawal      │
 * │ slip (action), hand it to the teller (dispatch),      │
 * │ who follows strict bank rules (reducer) to update     │
 * │ your balance (state). Every transaction is logged.    │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── THREE PRINCIPLES ───────────────────────────────────┐
 * │ 1. Single source of truth   → one store               │
 * │ 2. State is read-only       → only actions change it   │
 * │ 3. Pure functions (reducers)→ (state, action) => new   │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── DATA FLOW ──────────────────────────────────────────┐
 * │                                                       │
 * │  UI ──dispatch(action)──> Middleware ──> Reducer       │
 * │   ↑                                       │           │
 * │   └──── useSelector(state) ←──────────────┘           │
 * │                                                       │
 * └───────────────────────────────────────────────────────┘
 */

// --- A: When do you need Redux? ---
console.log('A: When to use Redux:');
console.log(`
  ✅ USE Redux when:
  - Multiple components need same state
  - State is updated frequently
  - Complex state logic (many actions)
  - Medium-to-large app with many developers

  ❌ AVOID Redux when:
  - Small app with simple state
  - State is local to one component
  - You can solve it with Context + useReducer
`);

// --- B: Redux vs Context API ---
console.log('B: Redux vs Context API:');
const comparison = {
  Redux: {
    performance: 'Optimized — only re-renders subscribed components',
    devTools: 'Time-travel debugging, action log, state diff',
    middleware: 'Built-in support (thunk, saga, etc.)',
    boilerplate: 'More setup (reduced with RTK)',
    bestFor: 'Complex global state, frequent updates'
  },
  ContextAPI: {
    performance: 'All consumers re-render on any change',
    devTools: 'No built-in dev tools',
    middleware: 'Manual implementation needed',
    boilerplate: 'Minimal setup',
    bestFor: 'Theme, locale, auth — infrequent updates'
  }
};
console.log(JSON.stringify(comparison, null, 2));

// --- C: Core concepts in plain JS ---
console.log('\nC: Building Redux from scratch:');

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
      listeners.forEach(fn => fn());
      return action;
    },
    subscribe: (fn) => {
      listeners.push(fn);
      return () => {
        const idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
      };
    }
  };
}

// --- D: Actions & Action Creators ---
const INCREMENT = 'counter/increment';
const DECREMENT = 'counter/decrement';
const ADD_BY = 'counter/addBy';

function increment() { return { type: INCREMENT }; }
function decrement() { return { type: DECREMENT }; }
function addBy(amount) { return { type: ADD_BY, payload: amount }; }

// --- E: Reducer (pure function) ---
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    case ADD_BY:
      return { ...state, count: state.count + action.payload };
    default:
      return state;
  }
}

// --- F: Store in action ---
const store = createStore(counterReducer, { count: 0 });

store.subscribe(() => {
  console.log(`  [store] count = ${store.getState().count}`);
});

console.log('\nD: Dispatching actions:');
store.dispatch(increment());    // count = 1
store.dispatch(increment());    // count = 2
store.dispatch(addBy(10));      // count = 12
store.dispatch(decrement());    // count = 11

// --- G: Why immutability matters ---
console.log('\nE: Why immutability?');
const oldState = { count: 5, todos: ['a', 'b'] };

// ❌ WRONG — mutating state
// oldState.count = 6;

// ✅ RIGHT — new object
const newState = { ...oldState, count: 6 };

console.log(`  oldState === newState? ${oldState === newState}`); // false
console.log(`  Redux can detect change via reference comparison`);

/**
 * OUTPUT:
 * A: When to use Redux: ...
 * B: Redux vs Context API: ...
 * C: Building Redux from scratch:
 * D: Dispatching actions:
 *   [store] count = 1
 *   [store] count = 2
 *   [store] count = 12
 *   [store] count = 11
 * E: Why immutability?
 *   oldState === newState? false
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Redux has 3 principles: single store, read-only state,│
 * │ pure reducers. Data flows: UI→dispatch→reducer→state. │
 * │ Use Redux for complex shared state. Context API for   │
 * │ simple, infrequently changing values like theme/auth. │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/redux/00-redux-basics.js
 */
