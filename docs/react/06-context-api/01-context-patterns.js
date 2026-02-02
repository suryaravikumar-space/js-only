/**
 * TOPIC: Context Patterns — Split Contexts, Multiple Providers, Composition
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Split state and dispatch into separate contexts so   ║
 * ║  components that only dispatch don't re-render when   ║
 * ║  state changes.                                       ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Think of two radio channels: one for news (state),    │
 * │ one for requests (dispatch). A reporter only needs    │
 * │ the request channel — she shouldn't be interrupted    │
 * │ every time the news updates.                          │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  <StateContext.Provider value={state}>                 │
 * │    <DispatchContext.Provider value={dispatch}>         │
 * │      <Display />   ← reads StateContext only          │
 * │      <Controls />  ← reads DispatchContext only       │
 * │    </DispatchContext.Provider>                         │
 * │  </StateContext.Provider>                              │
 * └───────────────────────────────────────────────────────┘
 */

// --- Pattern 1: Split State vs Dispatch ---

function createContext(defaultValue) {
  let _value = defaultValue;
  return {
    set(v) { _value = v; },
    get() { return _value; }
  };
}

const StateCtx = createContext({ count: 0 });
const DispatchCtx = createContext(null);

function reducer(state, action) {
  if (action.type === 'INC') return { count: state.count + 1 };
  if (action.type === 'DEC') return { count: state.count - 1 };
  return state;
}

let appState = { count: 0 };
const dispatch = (action) => {
  appState = reducer(appState, action);
  StateCtx.set(appState);
  console.log(`A: Dispatched ${action.type}, state = ${JSON.stringify(appState)}`);
};
DispatchCtx.set(dispatch);

// Display only reads state
function Display() {
  const state = StateCtx.get();
  console.log(`B: Display reads count = ${state.count}`);
}

// Controls only reads dispatch — never re-renders on state change
function Controls() {
  const d = DispatchCtx.get();
  console.log(`C: Controls has dispatch, does NOT read state`);
  d({ type: 'INC' });
  d({ type: 'INC' });
}

Controls();
Display();

// --- Pattern 2: Multiple Providers (nested contexts) ---
console.log('\n--- Multiple Providers ---');

const ThemeCtx = createContext('light');
const AuthCtx = createContext(null);

ThemeCtx.set('dark');
AuthCtx.set({ user: 'Surya', role: 'admin' });

function Navbar() {
  const theme = ThemeCtx.get();
  const auth = AuthCtx.get();
  console.log(`D: Navbar — theme="${theme}", user="${auth.user}"`);
}
Navbar();

// --- Pattern 3: Compose Providers helper ---
console.log('\n--- Provider Composition ---');

function ComposeProviders(providers, renderFn) {
  providers.forEach(([ctx, val]) => ctx.set(val));
  console.log(`E: All ${providers.length} providers composed`);
  renderFn();
}

ComposeProviders(
  [[ThemeCtx, 'ocean'], [AuthCtx, { user: 'Raj', role: 'viewer' }]],
  () => {
    console.log(`F: Theme="${ThemeCtx.get()}", User="${AuthCtx.get().user}"`);
  }
);

/**
 * OUTPUT:
 * C: Controls has dispatch, does NOT read state
 * A: Dispatched INC, state = {"count":1}
 * A: Dispatched INC, state = {"count":2}
 * B: Display reads count = 2
 *
 * --- Multiple Providers ---
 * D: Navbar — theme="dark", user="Surya"
 *
 * --- Provider Composition ---
 * E: All 2 providers composed
 * F: Theme="ocean", User="Raj"
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Split state and dispatch into two contexts so that    │
 * │ components calling dispatch don't re-render when      │
 * │ state changes. Compose multiple providers with a      │
 * │ helper to avoid deep nesting ("provider hell").       │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/06-context-api/01-context-patterns.js
 */
