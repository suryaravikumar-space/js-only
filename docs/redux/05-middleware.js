/**
 * TOPIC: Redux Middleware — Intercepting Actions
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Middleware sits between dispatch and the reducer.     ║
 * ║  It can log, modify, delay, or stop actions.          ║
 * ║  Pattern: store => next => action => { ... }          ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── FLOW ───────────────────────────────────────────────┐
 * │                                                       │
 * │  dispatch(action)                                     │
 * │       │                                               │
 * │       ▼                                               │
 * │  [Middleware 1] ──> [Middleware 2] ──> [Reducer]       │
 * │   (logger)          (thunk)          (state update)   │
 * │                                                       │
 * └───────────────────────────────────────────────────────┘
 */

// --- A: Middleware signature ---
console.log('A: Middleware signature:');

// store => next => action => result
// Curried function with 3 levels

const loggerMiddleware = (store) => (next) => (action) => {
  console.log(`  [LOG] dispatching: ${action.type}`);
  console.log(`  [LOG] prev state: ${JSON.stringify(store.getState())}`);
  const result = next(action); // pass to next middleware or reducer
  console.log(`  [LOG] next state: ${JSON.stringify(store.getState())}`);
  return result;
};

// --- B: Build store with middleware ---
function createStore(reducer, initialState, middlewares = []) {
  let state = initialState;
  const listeners = [];

  const store = {
    getState: () => state,
    subscribe: (fn) => { listeners.push(fn); },
    dispatch: null // will be overridden
  };

  // Base dispatch
  let dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(fn => fn());
    return action;
  };

  // Apply middleware chain (right to left)
  const chain = middlewares.map(mw => mw(store));
  dispatch = chain.reduceRight((next, mw) => mw(next), dispatch);

  store.dispatch = dispatch;
  return store;
}

// --- C: Common middleware examples ---

// Thunk middleware — enables dispatching functions
const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// Crash reporter
const crashMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error('  [CRASH]', err.message);
  }
};

// --- D: Testing our middleware ---
console.log('\nD: Middleware in action:');

function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    default: return state;
  }
}

const store = createStore(
  reducer,
  { count: 0 },
  [loggerMiddleware, thunkMiddleware]
);

store.dispatch({ type: 'INCREMENT' });

console.log('\n  Dispatching thunk:');
store.dispatch((dispatch, getState) => {
  console.log(`  [THUNK] current count: ${getState().count}`);
  dispatch({ type: 'INCREMENT' });
  dispatch({ type: 'INCREMENT' });
  console.log(`  [THUNK] final count: ${getState().count}`);
});

// --- E: RTK default middleware ---
console.log('\nE: RTK default middleware:');
console.log(`
  configureStore automatically includes:

  1. redux-thunk         — async logic via dispatch(fn)
  2. serializableCheck   — warns if non-serializable values in state/actions
  3. immutableCheck      — warns if state is mutated outside Immer

  // Customize:
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(myLogger)             // add custom
        .concat(apiMiddleware),       // add RTK Query middleware
  });

  // Disable checks in production:
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
`);

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Middleware intercepts dispatched actions before they   │
 * │ reach the reducer. Shape: store=>next=>action=>{}.    │
 * │ RTK includes thunk + serializableCheck + immutable-   │
 * │ Check by default. Add custom middleware via configure- │
 * │ Store's middleware option.                             │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/redux/05-middleware.js
 */
