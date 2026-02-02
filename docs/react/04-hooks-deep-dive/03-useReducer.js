/**
 * TOPIC: useReducer — Predictable State with dispatch + reducer
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  dispatch(action) → reducer(state, action) → newState             ║
 * ║  State transitions are explicit, testable, and centralized.       ║
 * ║  Use when state logic is complex or involves multiple sub-values. ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ useReducer is a vending machine. You press a button (dispatch an │
 * │ action), the machine's logic (reducer) processes it, and a       │
 * │ product drops out (new state). You never reach inside — you only │
 * │ interact through buttons (actions).                               │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │                                                                    │
 * │  User clicks → dispatch({ type: "INCREMENT" })                    │
 * │                        ↓                                          │
 * │              reducer(state, action)                                │
 * │                        ↓                                          │
 * │              return newState → re-render                          │
 * │                                                                    │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate useReducer ===

function useReducer(reducer, initialState) {
  let state = initialState;

  function dispatch(action) {
    const newState = reducer(state, action);
    console.log(`   dispatch(${JSON.stringify(action)})`);
    console.log(`   ${JSON.stringify(state)} → ${JSON.stringify(newState)}`);
    state = newState;
  }

  function getState() { return state; }
  return [getState, dispatch];
}

// --- A: Counter reducer ---
console.log("A: === Counter Reducer ===");

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT": return { count: state.count + 1 };
    case "DECREMENT": return { count: state.count - 1 };
    case "RESET":     return { count: 0 };
    default:          return state;
  }
}

const [getCount, dispatchCount] = useReducer(counterReducer, { count: 0 });
dispatchCount({ type: "INCREMENT" });
dispatchCount({ type: "INCREMENT" });
dispatchCount({ type: "DECREMENT" });
dispatchCount({ type: "RESET" });

// --- B: Todo list reducer (complex state) ---
console.log("\nB: === Todo List Reducer ===");

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "TOGGLE":
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case "DELETE":
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

let todos = [];
function todosDispatch(action) {
  const prev = todos;
  todos = todoReducer(todos, action);
  console.log(`   ${action.type}: [${todos.map(t => `${t.text}(${t.done ? "done" : "pending"})`)}]`);
}

todosDispatch({ type: "ADD", text: "Learn React" });
const firstId = todos[0].id;
todosDispatch({ type: "ADD", text: "Build project" });
todosDispatch({ type: "TOGGLE", id: firstId });
todosDispatch({ type: "DELETE", id: firstId });

// --- C: useReducer vs useState ---
console.log("\nC: === useReducer vs useState ===");
console.log("   useState: Simple values (count, name, boolean)");
console.log("   useReducer: Complex objects, multiple related values,");
console.log("               or when next state depends on previous.");
console.log("");
console.log("   useReducer advantages:");
console.log("   1. All state logic in one place (reducer function)");
console.log("   2. Easy to test (pure function)");
console.log("   3. dispatch identity is stable (no useCallback needed)");
console.log("   4. Can pass dispatch down instead of callbacks");

// --- D: Reducer with init function (lazy init) ---
console.log("\nD: === Lazy Initialization ===");

function init(initialCount) {
  console.log(`   Lazy init called with ${initialCount}`);
  return { count: initialCount }; // expensive computation once
}

// In React: useReducer(reducer, initialArg, init)
const lazyState = init(10);
console.log(`   Initial state: ${JSON.stringify(lazyState)}`);
console.log("   Third arg to useReducer: runs once, avoids re-creating");

/**
 * OUTPUT:
 * A: Counter increments, decrements, resets
 * B: Todo list add, toggle, delete
 * C: Comparison table
 * D: Lazy init pattern
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useReducer takes a reducer function and        ║
 * ║ initial state, returns [state, dispatch]. dispatch sends actions   ║
 * ║ to the reducer which returns new state. Use it for complex state  ║
 * ║ logic — the reducer is pure, testable, and keeps logic centralized║
 * ║ dispatch is referentially stable, unlike setState callbacks."      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/04-hooks-deep-dive/03-useReducer.js
 */
