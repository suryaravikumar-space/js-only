/**
 * TOPIC: React Router — Client-Side Routing Basics
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Client-side routing changes the URL and renders the  ║
 * ║  matching component WITHOUT a full page reload.       ║
 * ║  The browser never hits the server for new HTML.      ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Traditional routing = changing TV channels (full       │
 * │ reload). Client-side routing = flipping pages in a    │
 * │ book (instant, same book). React Router is the table  │
 * │ of contents — URL maps to page.                       │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  URL: /home    → <Home />                             │
 * │  URL: /about   → <About />                            │
 * │  URL: /user/42 → <User id={42} />                    │
 * │                                                       │
 * │  React code:                                          │
 * │  <BrowserRouter>                                      │
 * │    <Routes>                                           │
 * │      <Route path="/" element={<Home />} />            │
 * │      <Route path="/about" element={<About />} />      │
 * │    </Routes>                                          │
 * │  </BrowserRouter>                                     │
 * └───────────────────────────────────────────────────────┘
 */

// --- Simulate a client-side router in pure JS ---

function createRouter(routes) {
  let currentPath = '/';

  function matchRoute(path) {
    for (const route of routes) {
      // Exact match
      if (route.path === path) return route;
      // Param match: /user/:id
      const routeParts = route.path.split('/');
      const pathParts = path.split('/');
      if (routeParts.length === pathParts.length) {
        const params = {};
        const match = routeParts.every((part, i) => {
          if (part.startsWith(':')) { params[part.slice(1)] = pathParts[i]; return true; }
          return part === pathParts[i];
        });
        if (match) return { ...route, params };
      }
    }
    return null;
  }

  return {
    navigate(path) {
      currentPath = path;
      const matched = matchRoute(path);
      if (matched) {
        console.log(`  Route matched: "${matched.path}"`);
        matched.component(matched.params || {});
      } else {
        console.log(`  404: No route for "${path}"`);
      }
    },
    getCurrentPath() { return currentPath; }
  };
}

// --- Define routes ---
const router = createRouter([
  { path: '/',      component: () => console.log('  Render: <Home />') },
  { path: '/about', component: () => console.log('  Render: <About />') },
  { path: '/user/:id', component: (p) => console.log(`  Render: <User id="${p.id}" />`) },
]);

// --- Navigate ---
console.log('A: Navigate to /');
router.navigate('/');

console.log('B: Navigate to /about');
router.navigate('/about');

console.log('C: Navigate to /user/42');
router.navigate('/user/42');

console.log('D: Navigate to /unknown');
router.navigate('/unknown');

// --- How BrowserRouter works conceptually ---
console.log('\nE: BrowserRouter concept:');
console.log('  Uses History API (pushState) to change URL');
console.log('  Listens to popstate event for back/forward');
console.log('  Re-renders matched route component');

// Simulate history
const history = [];
function pushState(path) {
  history.push(path);
  console.log(`F: pushState("${path}") — history: [${history.join(', ')}]`);
}
pushState('/');
pushState('/about');
pushState('/user/42');
console.log(`G: Back button → pop to "${history[history.length - 2]}"`);

/**
 * OUTPUT:
 * A: Navigate to /
 *   Route matched: "/"
 *   Render: <Home />
 * B: Navigate to /about
 *   Route matched: "/about"
 *   Render: <About />
 * C: Navigate to /user/42
 *   Route matched: "/user/:id"
 *   Render: <User id="42" />
 * D: Navigate to /unknown
 *   404: No route for "/unknown"
 *
 * E: BrowserRouter concept:
 *   Uses History API...
 * F: pushState("/") — history: [/]
 * F: pushState("/about") — history: [/, /about]
 * F: pushState("/user/42") — history: [/, /about, /user/42]
 * G: Back button → pop to "/about"
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ React Router uses the History API to change URLs      │
 * │ without page reloads. BrowserRouter provides routing  │
 * │ context. Routes matches URLs to components. Route     │
 * │ defines path-to-component mappings.                   │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/08-react-router/00-routing-basics.js
 */
