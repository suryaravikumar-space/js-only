/**
 * TOPIC: Redux Toolkit (RTK) — Modern Redux Setup
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Redux Toolkit is the official, recommended way to    ║
 * ║  write Redux. It eliminates boilerplate and includes  ║
 * ║  best practices by default (Immer, Thunk, DevTools). ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Old Redux = building a house brick by brick.          │
 * │ RTK = getting a pre-built modular home. Same house,   │
 * │ 80% less work. You still control the layout.          │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── RTK INCLUDES ───────────────────────────────────────┐
 * │ configureStore  → wraps createStore + middleware       │
 * │ createSlice     → auto-generates actions + reducer    │
 * │ createAsyncThunk→ async logic with lifecycle actions  │
 * │ Immer           → write "mutating" code, stays pure   │
 * │ Redux DevTools  → enabled by default                  │
 * └───────────────────────────────────────────────────────┘
 */

// ==========================================================
// PSEUDO-CODE (RTK requires npm install @reduxjs/toolkit)
// Showing the PATTERNS you'd use in a real React app
// ==========================================================

// --- A: configureStore ---
console.log('A: configureStore (pseudo-code):');
console.log(`
  import { configureStore } from '@reduxjs/toolkit';
  import counterReducer from './counterSlice';
  import todosReducer from './todosSlice';

  const store = configureStore({
    reducer: {
      counter: counterReducer,   // auto-combined
      todos: todosReducer,
    },
    // middleware: defaults include redux-thunk
    // devTools: true by default in development
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
`);

// --- B: createSlice — the magic of RTK ---
console.log('B: createSlice (pseudo-code):');
console.log(`
  import { createSlice } from '@reduxjs/toolkit';

  const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
      increment(state) {
        state.value += 1;        // ← Immer makes this safe!
      },
      decrement(state) {
        state.value -= 1;
      },
      addBy(state, action) {
        state.value += action.payload;
      },
    },
  });

  // Auto-generated action creators:
  export const { increment, decrement, addBy } = counterSlice.actions;

  // The reducer:
  export default counterSlice.reducer;
`);

// --- C: Immer under the hood ---
console.log('C: How Immer works in RTK:');

// Simulating Immer's produce
function produce(baseState, recipe) {
  const draft = JSON.parse(JSON.stringify(baseState)); // deep clone
  recipe(draft);
  return draft;
}

const state = { users: [{ name: 'Alice', age: 25 }], count: 1 };

// With Immer (what RTK does internally):
const nextState = produce(state, (draft) => {
  draft.users[0].age = 26;   // looks like mutation
  draft.count = 2;           // but creates new object
});

console.log(`  Original age: ${state.users[0].age}`);   // 25
console.log(`  New age: ${nextState.users[0].age}`);     // 26
console.log(`  Immutable? ${state !== nextState}`);       // true

// --- D: Using in React component (pseudo-code) ---
console.log('\nD: Using RTK in React components:');
console.log(`
  import { useSelector, useDispatch } from 'react-redux';
  import { increment, decrement, addBy } from './counterSlice';

  function Counter() {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
      <div>
        <h1>{count}</h1>
        <button onClick={() => dispatch(increment())}>+1</button>
        <button onClick={() => dispatch(decrement())}>-1</button>
        <button onClick={() => dispatch(addBy(5))}>+5</button>
      </div>
    );
  }
`);

// --- E: Provider setup ---
console.log('E: Provider setup:');
console.log(`
  import { Provider } from 'react-redux';
  import { store } from './store';

  function App() {
    return (
      <Provider store={store}>
        <Counter />
      </Provider>
    );
  }
`);

// --- F: Old Redux vs RTK comparison ---
console.log('F: Old Redux vs RTK:');
console.log(`
  ┌─────────────────────┬──────────────────────┐
  │    OLD REDUX         │    REDUX TOOLKIT      │
  ├─────────────────────┼──────────────────────┤
  │ const ADD = 'ADD';   │ createSlice auto-     │
  │ function add(x) {    │ generates action       │
  │   return {type:ADD,  │ types + creators       │
  │     payload: x};     │                        │
  │ }                    │                        │
  ├─────────────────────┼──────────────────────┤
  │ switch(action.type)  │ reducers: {           │
  │   case ADD:          │   add(state, action) { │
  │     return {         │     state.val +=        │
  │       ...state,      │       action.payload;   │
  │       val: state.val │   }                     │
  │         + action     │ }                       │
  │         .payload     │                        │
  │     };               │                        │
  ├─────────────────────┼──────────────────────┤
  │ combineReducers()    │ configureStore({       │
  │ createStore()        │   reducer: { ... }     │
  │ applyMiddleware()    │ })  ← all in one       │
  └─────────────────────┴──────────────────────┘
`);

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ RTK is the official Redux approach. createSlice auto- │
 * │ generates action types + creators. Immer lets you     │
 * │ write "mutating" code that stays immutable. configure-│
 * │ Store bundles middleware + devTools. 80% less code.    │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/redux/01-redux-toolkit-setup.js
 */
