/**
 * TOPIC: Context vs Props — When to Use Which, Tradeoffs
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Props are explicit wires. Context is wireless.       ║
 * ║  Use props by default; context when prop drilling     ║
 * ║  crosses 3+ levels for truly global data.             ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Props = handing a letter person-to-person down a      │
 * │ chain. Context = posting it on a bulletin board —     │
 * │ anyone can read it, but you lose track of who depends │
 * │ on it and it's harder to test in isolation.           │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  PROPS (explicit)           CONTEXT (implicit)        │
 * │  App ──prop──> Page         App (Provider)             │
 * │  Page ──prop──> Section       ...skip levels...       │
 * │  Section──prop──> Button    Button (useContext)        │
 * │                                                       │
 * │  Tradeoffs:                                           │
 * │  Props:   explicit, testable, verbose at depth        │
 * │  Context: concise, implicit coupling, all re-render   │
 * └───────────────────────────────────────────────────────┘
 */

// --- Demo 1: Prop Drilling (explicit, but verbose) ---

function App_Props(theme) {
  console.log(`A: App passes theme="${theme}" as prop`);
  Page_Props(theme);
}
function Page_Props(theme) {
  console.log(`B: Page forwards theme="${theme}" (doesn't use it)`);
  Button_Props(theme);
}
function Button_Props(theme) {
  console.log(`C: Button uses theme="${theme}"`);
}

App_Props('dark');

// --- Demo 2: Context (skips intermediate levels) ---
console.log('\n--- Context approach ---');

const ThemeCtx = { _value: null };

function App_Context() {
  ThemeCtx._value = 'dark'; // Provider sets value
  console.log(`D: App sets context value="dark"`);
  Page_Context();
}
function Page_Context() {
  console.log(`E: Page does NOT receive or forward theme`);
  Button_Context();
}
function Button_Context() {
  const theme = ThemeCtx._value; // useContext reads directly
  console.log(`F: Button reads context theme="${theme}"`);
}

App_Context();

// --- Demo 3: Testing tradeoff ---
console.log('\n--- Testing tradeoff ---');

// Props: easy to test in isolation
function ButtonWithProp(theme) {
  return `<button class="${theme}">Click</button>`;
}
console.log(`G: Test prop button = ${ButtonWithProp('light')}`);

// Context: must wrap with provider to test
function ButtonWithContext() {
  const theme = ThemeCtx._value; // depends on external state
  return `<button class="${theme}">Click</button>`;
}
ThemeCtx._value = 'test-theme';
console.log(`H: Test context button = ${ButtonWithContext()}`);

// --- Decision guide ---
console.log('\n--- When to use which ---');
const guide = [
  { data: 'theme/locale/auth', use: 'Context', why: 'truly global, rarely changes' },
  { data: 'form field value',   use: 'Props',   why: 'local, parent owns it' },
  { data: 'user object 5 deep', use: 'Context', why: 'avoids drilling 5 levels' },
  { data: 'button onClick',     use: 'Props',   why: 'direct parent-child' },
];
guide.forEach((g, i) => {
  console.log(`${String.fromCharCode(73 + i)}: "${g.data}" → ${g.use} (${g.why})`);
});

/**
 * OUTPUT:
 * A: App passes theme="dark" as prop
 * B: Page forwards theme="dark" (doesn't use it)
 * C: Button uses theme="dark"
 *
 * --- Context approach ---
 * D: App sets context value="dark"
 * E: Page does NOT receive or forward theme
 * F: Button reads context theme="dark"
 *
 * --- Testing tradeoff ---
 * G: Test prop button = <button class="light">Click</button>
 * H: Test context button = <button class="test-theme">Click</button>
 *
 * --- When to use which ---
 * I: "theme/locale/auth" → Context (truly global, rarely changes)
 * J: "form field value" → Props (local, parent owns it)
 * K: "user object 5 deep" → Context (avoids drilling 5 levels)
 * L: "button onClick" → Props (direct parent-child)
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Use props by default — they're explicit and testable. │
 * │ Use context for truly global data (theme, auth, i18n) │
 * │ that many nested components need. Context adds        │
 * │ implicit coupling and re-renders all consumers.       │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/06-context-api/02-context-vs-props.js
 */
