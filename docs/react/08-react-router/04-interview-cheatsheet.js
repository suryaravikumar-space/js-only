/**
 * TOPIC: React Router — Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  React Router enables SPA navigation: URL changes,    ║
 * ║  component swaps, no page reload. It matches URL      ║
 * ║  patterns to components using the History API.        ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ React Router is a GPS for your SPA. It reads the      │
 * │ address (URL), looks at the map (route config), and   │
 * │ shows the destination (component) — all without       │
 * │ leaving the car (page reload).                        │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  Hooks:                                               │
 * │  useParams()       → { id: '42' }                    │
 * │  useSearchParams() → URLSearchParams                  │
 * │  useNavigate()     → navigate('/path')                │
 * │  useLocation()     → { pathname, search, state }     │
 * │  useMatch()        → match object or null             │
 * │                                                       │
 * │  Components:                                          │
 * │  <BrowserRouter>   → provides routing context         │
 * │  <Routes>          → matches first matching route     │
 * │  <Route>           → path-to-component map            │
 * │  <Link>            → declarative <a> navigation       │
 * │  <NavLink>         → Link with active class           │
 * │  <Navigate>        → declarative redirect             │
 * │  <Outlet>          → render nested child route        │
 * └───────────────────────────────────────────────────────┘
 */

const QA = [
  {
    q: 'What is client-side routing?',
    a: 'Changing URLs and rendering components without a full page reload. Uses History API (pushState/popstate). The server always serves the same HTML.'
  },
  {
    q: 'BrowserRouter vs HashRouter?',
    a: 'BrowserRouter uses clean URLs (/about) via History API — needs server config for catch-all. HashRouter uses hash (#/about) — works everywhere, no server config needed.'
  },
  {
    q: 'How does route matching work in v6?',
    a: 'Routes picks the BEST match (not first). More specific paths win. /user/new matches before /user/:id. No need for "exact" prop like v5.'
  },
  {
    q: 'What is an Outlet?',
    a: 'A placeholder in parent route components where the matched child route renders. Like {children} but for nested routes. Parent layout stays mounted.'
  },
  {
    q: 'What is an index route?',
    a: 'The default child route when the parent path matches exactly. Like a default tab. Defined with <Route index element={...} />.'
  },
  {
    q: 'Link vs NavLink?',
    a: 'Both prevent full page reloads. NavLink adds an "active" class/style when its "to" matches the current URL. Use NavLink for navbars.'
  },
  {
    q: 'How to do programmatic navigation?',
    a: 'const navigate = useNavigate(); navigate("/path") to go forward, navigate(-1) to go back, navigate("/path", { replace: true }) to replace history.'
  },
  {
    q: 'How to protect routes (auth)?',
    a: 'Create a ProtectedRoute wrapper: check auth, render <Outlet /> if authenticated, <Navigate to="/login" replace /> if not.'
  },
  {
    q: 'What is lazy loading routes?',
    a: 'Use React.lazy() + Suspense to code-split route components. Each route loads its JS bundle only when navigated to. Reduces initial bundle size.'
  },
  {
    q: 'useParams vs useSearchParams?',
    a: 'useParams reads URL segments (/user/:id → {id}). useSearchParams reads query string (?q=react → get("q")). Params are route-defined; search params are freeform.'
  }
];

QA.forEach((item, i) => {
  const label = String.fromCharCode(65 + i);
  console.log(`${label}: Q: ${item.q}`);
  console.log(`   A: ${item.a}\n`);
});

// --- Quick code recall ---
console.log('--- Quick Code Pattern ---');
console.log(`
// React Router v6 setup:
// <BrowserRouter>
//   <Routes>
//     <Route path="/" element={<Layout />}>
//       <Route index element={<Home />} />
//       <Route path="about" element={<About />} />
//       <Route path="user/:id" element={<User />} />
//       <Route path="*" element={<NotFound />} />
//     </Route>
//   </Routes>
// </BrowserRouter>
//
// function Layout() {
//   return <><Navbar /><Outlet /></>;
// }
// function User() {
//   const { id } = useParams();
//   const navigate = useNavigate();
// }
`);

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ React Router: BrowserRouter for context, Routes for   │
 * │ matching, Route for mapping, Outlet for nesting.      │
 * │ useParams for URL segments, useNavigate for code      │
 * │ navigation, NavLink for active styling. v6 picks      │
 * │ best match automatically.                             │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/08-react-router/04-interview-cheatsheet.js
 */
