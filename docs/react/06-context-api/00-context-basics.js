/**
 * TOPIC: React Context API — createContext, Provider, useContext
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Context = a global store that any nested component   ║
 * ║  can read WITHOUT passing props through every level.  ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Context is like a radio station. The Provider is the  │
 * │ broadcast tower (sets the value). Any component with  │
 * │ useContext is a radio tuned to that frequency — it    │
 * │ receives the value directly, no wires needed.         │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │                                                       │
 * │  createContext(default)  ──>  { Provider, Consumer }  │
 * │                                                       │
 * │  <ThemeContext.Provider value="dark">                  │
 * │      <App>                                            │
 * │        <Sidebar>                                      │
 * │          <Button />  ← useContext(ThemeContext)="dark" │
 * │        </Sidebar>                                     │
 * │      </App>                                           │
 * │  </ThemeContext.Provider>                              │
 * │                                                       │
 * └───────────────────────────────────────────────────────┘
 *
 * React code (for reference):
 *   const ThemeCtx = createContext('light');
 *   <ThemeCtx.Provider value="dark"><App /></ThemeCtx.Provider>
 *   function Button() { const theme = useContext(ThemeCtx); }
 */

// --- Simulate createContext, Provider, useContext in pure JS ---

function createContext(defaultValue) {
  let _value = defaultValue;
  const _subscribers = [];
  return {
    _default: defaultValue,
    Provider(value, childrenFn) {
      _value = value;
      console.log(`A: Provider broadcasting value = "${_value}"`);
      childrenFn(); // render children
    },
    useContext() {
      console.log(`B: useContext reads value = "${_value}"`);
      return _value;
    },
    subscribe(fn) {
      _subscribers.push(fn);
    },
    _notify() {
      _subscribers.forEach(fn => fn(_value));
    }
  };
}

// --- Demo ---

const ThemeContext = createContext('light');
console.log(`C: Default value = "${ThemeContext._default}"`);

// Simulating <ThemeContext.Provider value="dark">
ThemeContext.Provider('dark', () => {
  // Deep nested component calls useContext
  const theme = ThemeContext.useContext();
  console.log(`D: Button renders with theme = "${theme}"`);
});

// Subscribe pattern (like re-render on context change)
ThemeContext.subscribe((val) => console.log(`E: Subscriber got = "${val}"`));
ThemeContext.Provider('blue', () => {
  ThemeContext.useContext();
  ThemeContext._notify();
});

// Without provider — uses default
const LangContext = createContext('en');
console.log(`F: No provider, default = "${LangContext._default}"`);

/**
 * OUTPUT:
 * C: Default value = "light"
 * A: Provider broadcasting value = "dark"
 * B: useContext reads value = "dark"
 * D: Button renders with theme = "dark"
 * A: Provider broadcasting value = "blue"
 * B: useContext reads value = "blue"
 * E: Subscriber got = "blue"
 * F: No provider, default = "en"
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ createContext creates a context object with a default. │
 * │ Provider wraps a subtree and sets the value. Any child│
 * │ calls useContext(Ctx) to read the nearest Provider's  │
 * │ value. If no Provider exists, the default is used.    │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/06-context-api/00-context-basics.js
 */
