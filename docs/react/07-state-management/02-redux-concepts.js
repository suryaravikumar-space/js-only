/**
 * TOPIC: Redux Concepts — Store, Actions, Reducers, Dispatch, Selectors
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Redux = single source of truth. State is read-only.  ║
 * ║  Changes happen only through dispatching actions to   ║
 * ║  pure reducer functions.                              ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Redux is a bank. You can't reach into the vault       │
 * │ (store). You fill out a form (action), give it to the │
 * │ teller (dispatch), who follows strict rules (reducer) │
 * │ to update your balance (state).                       │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  UI ──dispatch(action)──> Reducer ──> New State       │
 * │   ↑                                      │            │
 * │   └──── selector(state) ←────────────────┘            │
 * │                                                       │
 * │  Action:   { type: 'ADD_TODO', payload: 'Learn' }    │
 * │  Reducer:  (state, action) => newState                │
 * │  Store:    { getState, dispatch, subscribe }          │
 * └───────────────────────────────────────────────────────┘
 */

// --- Build a mini Redux from scratch ---

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
      return () => { // unsubscribe
        const i = listeners.indexOf(fn);
        if (i > -1) listeners.splice(i, 1);
      };
    }
  };
}

// --- Define actions ---
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

function addTodo(text) {
  return { type: ADD_TODO, payload: text };
}
function toggleTodo(id) {
  return { type: TOGGLE_TODO, payload: id };
}

// --- Define reducer (pure function!) ---
function todoReducer(state = { todos: [], nextId: 1 }, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, { id: state.nextId, text: action.payload, done: false }],
        nextId: state.nextId + 1
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        )
      };
    default:
      return state;
  }
}

// --- Create store ---
const store = createStore(todoReducer, { todos: [], nextId: 1 });

// --- Subscribe (like a React component re-rendering) ---
const unsub = store.subscribe(() => {
  console.log(`  [subscriber] state changed:`, JSON.stringify(store.getState().todos));
});

// --- Dispatch actions ---
console.log('A: Dispatch ADD_TODO "Learn Redux":');
store.dispatch(addTodo('Learn Redux'));

console.log('B: Dispatch ADD_TODO "Build app":');
store.dispatch(addTodo('Build app'));

console.log('C: Dispatch TOGGLE_TODO id=1:');
store.dispatch(toggleTodo(1));

// --- Selectors (derive data from state) ---
console.log('\nD: Selectors:');
const selectAll = (state) => state.todos;
const selectDone = (state) => state.todos.filter(t => t.done);
const selectCount = (state) => state.todos.length;

console.log(`  All todos: ${JSON.stringify(selectAll(store.getState()))}`);
console.log(`  Done todos: ${JSON.stringify(selectDone(store.getState()))}`);
console.log(`  Count: ${selectCount(store.getState())}`);

// --- Unsubscribe ---
unsub();
console.log('\nE: After unsubscribe, dispatch is silent:');
store.dispatch(addTodo('No listener'));
console.log(`  State still updated: ${store.getState().todos.length} todos`);

/**
 * OUTPUT:
 * A: Dispatch ADD_TODO "Learn Redux":
 *   [subscriber] state changed: [{"id":1,"text":"Learn Redux","done":false}]
 * B: Dispatch ADD_TODO "Build app":
 *   [subscriber] state changed: [{"id":1,...},{"id":2,"text":"Build app","done":false}]
 * C: Dispatch TOGGLE_TODO id=1:
 *   [subscriber] state changed: [{"id":1,...,"done":true},{"id":2,...}]
 *
 * D: Selectors:
 *   All todos: [...]
 *   Done todos: [{"id":1,"text":"Learn Redux","done":true}]
 *   Count: 2
 *
 * E: After unsubscribe, dispatch is silent:
 *   State still updated: 3 todos
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Redux: single store, read-only state, pure reducers.  │
 * │ dispatch(action) → reducer(state, action) → newState. │
 * │ Selectors derive computed data. Subscribe for updates.│
 * │ Predictable, debuggable, time-travel capable.         │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/07-state-management/02-redux-concepts.js
 */
