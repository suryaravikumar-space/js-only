/**
 * TOPIC: React System Design & Architecture
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  React system design = folder structure + state mgmt +   ║
 * ║  data fetching + routing + auth + performance.           ║
 * ║  Think in layers, not just components.                   ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ Building a React app = building a house:                  │
 * │  Foundation = folder structure & state architecture       │
 * │  Plumbing   = data fetching & API layer                   │
 * │  Wiring     = routing & authentication                    │
 * │  Insulation = performance optimization                    │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │  Section 1: Folder Structure                              │
 * │  Section 2: State Management Decisions                    │
 * │  Section 3: Performance Optimization Strategy             │
 * │  Section 4: Component Composition                         │
 * │  Section 5: Data Fetching Patterns                        │
 * │  Section 6: Authentication Flow                           │
 * │  Section 7: Routing Strategy                              │
 * └───────────────────────────────────────────────────────────┘
 */

// ============================================================
// SECTION 1: Folder Structure
// ============================================================
console.log("=== A: Folder Structure ===");

const folderStructure = {
  "src/": {
    "components/":  "Reusable UI (Button, Modal, Input)",
    "features/":    "Feature modules (auth/, dashboard/, profile/)",
    "hooks/":       "Custom hooks (useAuth, useFetch, useDebounce)",
    "context/":     "React contexts (AuthContext, ThemeContext)",
    "services/":    "API calls (api.js, authService.js)",
    "utils/":       "Pure helper functions (formatDate, validate)",
    "pages/":       "Route-level components (HomePage, LoginPage)",
    "layouts/":     "Page layouts (MainLayout, AuthLayout)",
    "types/":       "TypeScript types/interfaces",
    "constants/":   "App-wide constants (API_URL, ROLES)",
  },
};

Object.entries(folderStructure["src/"]).forEach(([dir, desc]) => {
  console.log(`  ${dir.padEnd(16)} ${desc}`);
});

console.log("\nA: Feature-based structure scales better than type-based.");
console.log("   Each feature/ folder has its own components, hooks, utils.\n");

// ============================================================
// SECTION 2: State Management Decisions
// ============================================================
console.log("=== B: State Management Decision Tree ===");

const stateDecisions = [
  ["Local UI state (toggle, form input)", "useState"],
  ["Complex local state (form with validation)", "useReducer"],
  ["Shared between siblings", "Lift state up to parent"],
  ["Shared across distant components", "Context API"],
  ["Global app state (auth, theme)", "Context + useReducer OR Zustand"],
  ["Server state (API data, caching)", "TanStack Query (React Query)"],
  ["Complex global + middleware", "Redux Toolkit (only if needed)"],
  ["URL state (filters, pagination)", "URL search params (useSearchParams)"],
];

stateDecisions.forEach(([scenario, solution]) => {
  console.log(`  ${scenario}`);
  console.log(`    => ${solution}`);
});
console.log("");

// ============================================================
// SECTION 3: Performance Optimization Strategy
// ============================================================
console.log("=== C: Performance Optimization Strategy ===");

const perfLayers = [
  { layer: "Render", tips: "React.memo, useMemo, useCallback, avoid inline objects in JSX" },
  { layer: "List",   tips: "Virtualization (react-window), stable keys, pagination" },
  { layer: "Bundle", tips: "Code splitting (React.lazy), tree shaking, dynamic import" },
  { layer: "Network", tips: "Caching (React Query), prefetching, optimistic updates" },
  { layer: "Images", tips: "Lazy loading, responsive images, next/image, CDN" },
  { layer: "Measure", tips: "React DevTools Profiler, Lighthouse, Web Vitals" },
];

perfLayers.forEach(({ layer, tips }) => {
  console.log(`  [${layer}] ${tips}`);
});
console.log("");

// ============================================================
// SECTION 4: Component Composition
// ============================================================
console.log("=== D: Component Composition Patterns ===");

// Simulate compound component pattern
function createSelect() {
  let value = null;
  const options = [];

  return {
    addOption(label, val) { options.push({ label, val }); },
    select(val) { value = val; },
    render() {
      const selected = options.find((o) => o.val === value);
      console.log("D: Select renders:", options.map((o) =>
        o.val === value ? `[${o.label}]` : o.label
      ).join(" | "));
    },
  };
}

const select = createSelect();
select.addOption("React", "react");
select.addOption("Vue", "vue");
select.addOption("Angular", "angular");
select.select("react");
select.render();

console.log("\nD: Composition patterns:");
console.log("   1. children prop (slots)");
console.log("   2. Compound components (Select + Option)");
console.log("   3. Render props (headless logic)");
console.log("   4. Custom hooks (shared behavior)");
console.log("   5. HOCs (cross-cutting concerns)\n");

// ============================================================
// SECTION 5: Data Fetching Patterns
// ============================================================
console.log("=== E: Data Fetching Patterns ===");

// Simulate a fetch hook
function useFetch(url) {
  const state = { data: null, loading: true, error: null };
  console.log("E: useFetch('" + url + "')");
  // In real React: useEffect + fetch + setState
  return state;
}

const patterns = [
  "useEffect + fetch      — simple, manual caching",
  "React Query / SWR      — caching, dedup, refetch, pagination",
  "Server Components      — fetch on server, zero client JS",
  "Server Actions         — mutations from client, run on server",
  "Suspense + use() hook  — streaming, progressive loading",
];

patterns.forEach((p) => console.log("  " + p));
console.log("");

// ============================================================
// SECTION 6: Authentication Flow
// ============================================================
console.log("=== F: Authentication Flow ===");

function simulateAuthFlow() {
  const auth = { user: null, token: null };

  function login(email, password) {
    // POST /api/login => { token, user }
    auth.token = "jwt_abc123";
    auth.user = { email, role: "admin" };
    console.log("F: Login => token stored, user set");
  }

  function protectedRoute(requiredRole) {
    if (!auth.token) return console.log("F: Redirect to /login");
    if (auth.user.role !== requiredRole) return console.log("F: 403 Forbidden");
    console.log("F: Access granted to", requiredRole, "route");
  }

  login("admin@test.com", "pass");
  protectedRoute("admin");
  protectedRoute("superadmin");
}

simulateAuthFlow();
console.log("\nF: Auth architecture:");
console.log("   AuthContext provides { user, login, logout }");
console.log("   ProtectedRoute checks auth before rendering");
console.log("   Token in httpOnly cookie (secure) or memory (SPA)\n");

// ============================================================
// SECTION 7: Routing Strategy
// ============================================================
console.log("=== G: Routing Strategy ===");

const routes = [
  { path: "/",          component: "HomePage",      auth: false },
  { path: "/login",     component: "LoginPage",     auth: false },
  { path: "/dashboard", component: "DashboardPage", auth: true },
  { path: "/profile",   component: "ProfilePage",   auth: true },
  { path: "*",          component: "NotFoundPage",  auth: false },
];

routes.forEach((r) => {
  console.log(`  ${r.path.padEnd(14)} => ${r.component} ${r.auth ? "(protected)" : ""}`);
});

console.log("\nG: Routing decisions:");
console.log("   React Router for SPA");
console.log("   Next.js App Router for SSR/SSG");
console.log("   Nested layouts for shared UI");
console.log("   Lazy load route components with React.lazy");

/**
 * OUTPUT:
 * === A: Folder Structure === (printed above)
 * === B: State Management === (decision tree)
 * === C: Performance === (layered strategy)
 * === D: Composition === (compound component demo)
 * === E: Data Fetching === (patterns list)
 * === F: Authentication === (flow demo)
 * === G: Routing === (route table)
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ React architecture: feature-based folders, state mgmt     │
 * │ by scope (local->context->global), React Query for        │
 * │ server state, composition over inheritance, layered        │
 * │ performance (render/list/bundle/network), AuthContext +    │
 * │ protected routes, lazy-loaded route-based splitting.       │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/14-interview-cheatsheet/02-system-design-react.js
 */
