/**
 * TOPIC: Nested Routes — Outlet, Layout Routes, Index Routes
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Nested routes render child components inside parent  ║
 * ║  layouts via <Outlet />. The parent stays mounted,    ║
 * ║  only the child swaps on URL change.                  ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ A picture frame (layout) stays on the wall. You swap  │
 * │ the photo inside (Outlet). The frame has navbar and   │
 * │ sidebar; only the content area changes per route.     │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  /dashboard              Layout (navbar + sidebar)    │
 * │  /dashboard/stats        → <Outlet> = <Stats />      │
 * │  /dashboard/settings     → <Outlet> = <Settings />   │
 * │                                                       │
 * │  <Route path="/dashboard" element={<Layout />}>       │
 * │    <Route index element={<Overview />} />             │
 * │    <Route path="stats" element={<Stats />} />         │
 * │    <Route path="settings" element={<Settings />} />   │
 * │  </Route>                                             │
 * └───────────────────────────────────────────────────────┘
 */

// --- Simulate nested route matching ---

function createNestedRouter(routeTree) {
  function match(path) {
    const segments = path.split('/').filter(Boolean);
    return matchNode(routeTree, segments, 0);
  }

  function matchNode(routes, segments, depth) {
    for (const route of routes) {
      const routeSeg = route.path === '/' ? '' : route.path;

      if (route.index && depth === segments.length) {
        return [route]; // index route matches parent path exactly
      }
      if (routeSeg === segments[depth]) {
        if (route.children) {
          const childMatch = matchNode(route.children, segments, depth + 1);
          if (childMatch) return [route, ...childMatch];
          // No child matched but parent has index
          const idx = route.children.find(c => c.index);
          if (idx && depth + 1 === segments.length) return [route, idx];
        }
        if (depth + 1 === segments.length) return [route];
      }
    }
    return null;
  }
  return { match };
}

// --- Define route tree ---
const routes = [
  {
    path: 'dashboard', component: 'Layout',
    children: [
      { index: true, component: 'Overview' },
      { path: 'stats', component: 'Stats' },
      { path: 'settings', component: 'Settings',
        children: [
          { index: true, component: 'SettingsGeneral' },
          { path: 'profile', component: 'SettingsProfile' },
        ]
      },
    ]
  }
];

const router = createNestedRouter(routes);

// --- Test matches ---
function renderMatch(url) {
  const matched = router.match(url);
  if (!matched) { console.log(`  404: ${url}`); return; }
  const names = matched.map(r => r.component);
  console.log(`  ${url}`);
  names.forEach((name, i) => {
    const indent = '    '.repeat(i + 1);
    const isLast = i === names.length - 1;
    console.log(`${indent}${isLast ? '→' : '├'} <${name} ${isLast ? '/>' : '> (has <Outlet />)'}`);
  });
}

console.log('A: Nested route matching:\n');
renderMatch('/dashboard');
renderMatch('/dashboard/stats');
renderMatch('/dashboard/settings');
renderMatch('/dashboard/settings/profile');

// --- Outlet concept ---
console.log('\nB: Outlet simulation:');

function Layout(outletContent) {
  console.log('  <Layout>');
  console.log('    <Navbar />');
  console.log(`    <Outlet> → ${outletContent}`);
  console.log('  </Layout>');
}

Layout('<Stats />');
console.log('');
Layout('<Settings />');

// --- Index route ---
console.log('\nC: Index route = default child when parent path matches exactly');
console.log('   /dashboard → Layout + Overview (index)');
console.log('   /dashboard/stats → Layout + Stats (not index)');

/**
 * OUTPUT:
 * A: Nested route matching:
 *   /dashboard
 *     ├ <Layout > (has <Outlet />)
 *         → <Overview />
 *   /dashboard/stats
 *     ├ <Layout > (has <Outlet />)
 *         → <Stats />
 *   /dashboard/settings
 *     ├ <Layout > (has <Outlet />)
 *         ├ <Settings > (has <Outlet />)
 *             → <SettingsGeneral />
 *   /dashboard/settings/profile
 *     ├ <Layout > (has <Outlet />)
 *         ├ <Settings > (has <Outlet />)
 *             → <SettingsProfile />
 *
 * B: Outlet simulation:
 *   <Layout> <Navbar /> <Outlet> → <Stats /> </Layout>
 *   <Layout> <Navbar /> <Outlet> → <Settings /> </Layout>
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Nested routes render children inside parent layouts   │
 * │ via <Outlet />. Index routes are the default child    │
 * │ when the parent path matches exactly. Layout routes   │
 * │ share UI (nav, sidebar) across child routes.          │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/08-react-router/02-nested-routes.js
 */
