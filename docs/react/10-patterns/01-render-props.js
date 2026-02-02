/**
 * TOPIC: Render Props — Component Takes a Function, Calls It with Data
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  A render prop is a function prop that a component    ║
 * ║  calls to know WHAT to render. The component provides ║
 * ║  data, the function decides the UI.                   ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A weather station (comp) │
 * │ collects temperature     │
 * │ data. It calls YOU       │
 * │ (render function) saying │
 * │ "here's the data, you    │
 * │ decide how to display    │
 * │ it." Thermometer? Graph? │
 * │ Your choice.             │
 * └──────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  <MouseTracker render={(pos) => (  │
 * │    <p>Mouse at {pos.x},{pos.y}</p> │
 * │  )} />                             │
 * │                       │
 * │  Component: handles logic (tracking)│
 * │  Render prop: handles UI (display)  │
 * └─────────────────────────────────────┘
 */

// --- Simulate render prop pattern ---

// A: Basic render prop — MouseTracker
console.log("A: Basic render prop — MouseTracker");
function MouseTracker(renderFn) {
  // Component owns the logic (mouse position)
  const positions = [
    { x: 0, y: 0 },
    { x: 100, y: 50 },
    { x: 200, y: 150 },
  ];
  positions.forEach((pos) => {
    const output = renderFn(pos); // caller decides UI
    console.log(`  ${output}`);
  });
}

MouseTracker((pos) => `Mouse at (${pos.x}, ${pos.y})`);

// B: Different render for same data
console.log("\nB: Same component, different render");
MouseTracker((pos) => `Coordinates: x=${pos.x} | y=${pos.y}`);

// C: Data fetcher with render prop
console.log("\nC: DataFetcher render prop");
function DataFetcher(url, renderFn) {
  // Simulate fetch states
  console.log(`  ${renderFn({ loading: true, data: null, error: null })}`);
  // Simulate success
  const data = { users: ["Alice", "Bob"] };
  console.log(`  ${renderFn({ loading: false, data, error: null })}`);
}

DataFetcher("/api/users", ({ loading, data, error }) => {
  if (loading) return "Loading...";
  if (error) return `Error: ${error}`;
  return `Users: ${data.users.join(", ")}`;
});

// D: Children as render prop
console.log("\nD: Children as render prop (function as children)");
function Toggle(childrenFn) {
  let on = false;
  const toggle = () => { on = !on; };

  console.log(`  ${childrenFn({ on, toggle })}`);
  toggle();
  console.log(`  ${childrenFn({ on, toggle })}`);
}

Toggle(({ on, toggle }) => `Switch is ${on ? "ON" : "OFF"}`);

// E: Composing render props
console.log("\nE: Composing render props");
function WithAuth(renderFn) {
  const user = { name: "Surya", role: "admin" };
  return renderFn(user);
}

function WithTheme(renderFn) {
  const theme = { color: "dark", fontSize: 16 };
  return renderFn(theme);
}

const result = WithAuth((user) =>
  WithTheme((theme) =>
    `User: ${user.name}, Theme: ${theme.color}`
  )
);
console.log(`  ${result}`);

// F: Why hooks replaced render props
console.log("\nF: Render props vs Hooks (modern replacement)");
console.log("  Render prop:  <Mouse render={({x,y}) => <p>{x},{y}</p>} />");
console.log("  Hook:         const {x,y} = useMouse(); return <p>{x},{y}</p>");
console.log("  Hooks = flatter code, no nesting, easier to compose.");

/**
 * OUTPUT:
 * A: Basic render prop — MouseTracker
 *   Mouse at (0, 0)
 *   Mouse at (100, 50)
 *   Mouse at (200, 150)
 *
 * B: Same component, different render
 *   Coordinates: x=0 | y=0
 *   ...
 *
 * C: DataFetcher render prop
 *   Loading...
 *   Users: Alice, Bob
 *
 * D: Children as render prop
 *   Switch is OFF
 *   Switch is ON
 *
 * E: Composing render props
 *   User: Surya, Theme: dark
 *
 * F: Render props vs Hooks
 *   ...
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Render prop = a function prop a component calls to     │
 * │ know what to render. The component handles logic, the  │
 * │ function handles UI. Enables code reuse without HOCs.  │
 * │ Largely replaced by custom hooks (less nesting) but    │
 * │ still used in libs like React Router's <Route>.        │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/10-patterns/01-render-props.js
 */
