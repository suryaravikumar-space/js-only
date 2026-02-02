/**
 * TOPIC: Higher-Order Components (HOC) — Enhance Components with Wrappers
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  An HOC is a FUNCTION that takes a component and      ║
 * ║  returns a NEW enhanced component. It adds behavior   ║
 * ║  without modifying the original. withX naming.        ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A gift wrapper (HOC)    │
 * │ takes a gift (component)│
 * │ and wraps it with paper │
 * │ (extra behavior). The   │
 * │ gift inside is unchanged│
 * │ but now has a ribbon    │
 * │ (auth, loading, theme). │
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  withAuth(Dashboard)  │
 * │    │                  │
 * │    v                  │
 * │  EnhancedDashboard    │
 * │    ├─ checks auth     │
 * │    ├─ if auth → render Dashboard(props) │
 * │    └─ if not  → render "Please login"   │
 * └─────────────────────────────────────────┘
 *
 * React code:
 *   const EnhancedComp = withAuth(Dashboard);
 *   <EnhancedComp userId={1} />
 */

// --- Simulate component as a function ---
function Dashboard(props) {
  return `<Dashboard user="${props.user}" />`;
}

function UserProfile(props) {
  return `<UserProfile name="${props.name}" />`;
}

// A: withAuth HOC
console.log("A: withAuth HOC");
function withAuth(WrappedComponent) {
  return function EnhancedComponent(props) {
    if (!props.isAuthenticated) {
      return "<Redirect to='/login' />";
    }
    return WrappedComponent(props);
  };
}

const ProtectedDashboard = withAuth(Dashboard);
console.log(`  Logged in:  ${ProtectedDashboard({ isAuthenticated: true, user: "Surya" })}`);
console.log(`  Logged out: ${ProtectedDashboard({ isAuthenticated: false, user: "" })}`);

// B: withLoading HOC
console.log("\nB: withLoading HOC");
function withLoading(WrappedComponent) {
  return function EnhancedComponent(props) {
    if (props.isLoading) {
      return "<Spinner />";
    }
    return WrappedComponent(props);
  };
}

const LoadingProfile = withLoading(UserProfile);
console.log(`  Loading: ${LoadingProfile({ isLoading: true, name: "" })}`);
console.log(`  Loaded:  ${LoadingProfile({ isLoading: false, name: "Surya" })}`);

// C: withLogger HOC
console.log("\nC: withLogger HOC");
function withLogger(WrappedComponent, componentName) {
  return function EnhancedComponent(props) {
    console.log(`  [LOG] ${componentName} rendered with props: ${JSON.stringify(props)}`);
    return WrappedComponent(props);
  };
}

const LoggedDashboard = withLogger(Dashboard, "Dashboard");
LoggedDashboard({ user: "Surya" });

// D: Composing multiple HOCs
console.log("\nD: Composing HOCs");
function compose(...fns) {
  return (arg) => fns.reduceRight((result, fn) => fn(result), arg);
}

const enhance = compose(
  (comp) => withAuth(comp),
  (comp) => withLoading(comp),
  (comp) => withLogger(comp, "Dashboard")
);
const SuperDashboard = enhance(Dashboard);
console.log(`  ${SuperDashboard({ isAuthenticated: true, isLoading: false, user: "Surya" })}`);

// E: HOC pitfalls
console.log("\nE: HOC pitfalls");
console.log("  1. Wrapper hell: withA(withB(withC(Comp))) — hard to debug");
console.log("  2. Props collision: HOC and wrapped comp use same prop name");
console.log("  3. Static methods lost: must copy statics with hoist-non-react-statics");
console.log("  4. Refs don't pass through: need React.forwardRef");
console.log("  5. Modern alternative: Custom hooks (simpler, composable)");

/**
 * OUTPUT:
 * A: withAuth HOC
 *   Logged in:  <Dashboard user="Surya" />
 *   Logged out: <Redirect to='/login' />
 *
 * B: withLoading HOC
 *   Loading: <Spinner />
 *   Loaded:  <UserProfile name="Surya" />
 *
 * C: withLogger HOC
 *   [LOG] Dashboard rendered with props: {"user":"Surya"}
 *
 * D: Composing HOCs
 *   [LOG] ...
 *   <Dashboard user="Surya" />
 *
 * E: HOC pitfalls
 *   1-5 listed
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ An HOC is a function: (Component) => EnhancedComponent │
 * │ It adds behavior (auth, loading, logging) without      │
 * │ modifying the original. Convention: withX naming.       │
 * │ Pitfalls: wrapper hell, prop collision, lost refs.      │
 * │ Modern replacement: custom hooks.                       │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/10-patterns/02-hoc-pattern.js
 */
