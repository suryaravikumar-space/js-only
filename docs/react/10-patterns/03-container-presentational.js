/**
 * TOPIC: Container/Presentational — Separate Logic from UI
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Container = HOW things work (data, state, logic).    ║
 * ║  Presentational = HOW things look (UI, props only).   ║
 * ║  Custom hooks mostly replaced containers.             ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A chef (container) and  │
 * │ a waiter (presentational)│
 * │ Chef handles cooking    │
 * │ (logic, data fetching). │
 * │ Waiter handles serving  │
 * │ (displaying the food).  │
 * │ Chef doesn't serve,     │
 * │ waiter doesn't cook.    │
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  UserListContainer    │  ← fetches data, manages state
 * │    │                  │
 * │    └─ passes props    │
 * │         │             │
 * │         v             │
 * │    UserListView       │  ← pure UI, receives props
 * │      │                │
 * │      └─ renders <li>  │
 * └───────────────────────┘
 */

// --- Presentational: only renders what it receives ---
function UserListView(props) {
  if (props.loading) return "  <Spinner />";
  if (props.error) return `  <Error: ${props.error}>`;
  return props.users.map((u) => `  <li>${u.name} (${u.role})</li>`).join("\n");
}

function UserCardView(props) {
  return `  <Card name="${props.name}" email="${props.email}" />`;
}

// --- Container: handles logic, passes data to presentational ---
function UserListContainer() {
  // Simulate state
  let state = { users: [], loading: true, error: null };

  // Simulate componentDidMount / useEffect fetch
  function fetchData() {
    state = { ...state, loading: true };
    console.log(UserListView(state));

    // Simulate async response
    state = {
      loading: false,
      error: null,
      users: [
        { name: "Alice", role: "admin" },
        { name: "Bob", role: "user" },
        { name: "Charlie", role: "user" },
      ],
    };
    console.log(UserListView(state));
  }

  return { fetchData };
}

// A: Container fetches, presentational renders
console.log("A: Container/Presentational in action");
const container = UserListContainer();
container.fetchData();

// B: Presentational is reusable with different data
console.log("\nB: Same presentational, different data");
console.log(UserListView({
  loading: false, error: null,
  users: [{ name: "Dave", role: "manager" }],
}));

// C: Error state
console.log("\nC: Error state");
console.log(UserListView({ loading: false, error: "Network failed", users: [] }));

// D: Modern replacement — custom hooks
console.log("\nD: Modern approach with custom hooks");
function useUsers() {
  // Simulate hook that handles all the logic
  return {
    users: [{ name: "Alice", role: "admin" }, { name: "Bob", role: "user" }],
    loading: false,
    error: null,
    refetch: () => console.log("  [hook] refetching..."),
  };
}

// Now any component can use the hook directly — no container needed
function UserPage() {
  const { users, loading, error, refetch } = useUsers();
  console.log(`  Users from hook: ${users.map((u) => u.name).join(", ")}`);
  console.log(`  Loading: ${loading}, Error: ${error}`);
  refetch();
}
UserPage();

// E: When to still use the pattern
console.log("\nE: When container/presentational still useful");
console.log("  1. Design systems: presentational components as pure UI library");
console.log("  2. Storybook: presentational components are easy to showcase");
console.log("  3. Testing: test UI separately from logic");
console.log("  4. Team split: designers own presentational, devs own containers");

/**
 * OUTPUT:
 * A: Container/Presentational in action
 *   <Spinner />
 *   <li>Alice (admin)</li>
 *   <li>Bob (user)</li>
 *   <li>Charlie (user)</li>
 *
 * B: Same presentational, different data
 *   <li>Dave (manager)</li>
 *
 * C: Error state
 *   <Error: Network failed>
 *
 * D: Modern approach with custom hooks
 *   Users from hook: Alice, Bob
 *   Loading: false, Error: null
 *   [hook] refetching...
 *
 * E: When still useful (1-4 listed)
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Container = logic (fetch, state). Presentational = UI  │
 * │ (props only, no state). Separation makes presentational│
 * │ reusable and testable. Custom hooks largely replaced    │
 * │ containers, but the principle of separating logic from  │
 * │ UI remains fundamental in React architecture.           │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/10-patterns/03-container-presentational.js
 */
