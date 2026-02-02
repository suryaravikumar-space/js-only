/**
 * NEXT.JS: 01 - Server-Side Rendering (SSR)
 *
 * ONE CONCEPT: Render HTML on the server for every request
 */


// =============================================================================
// WHAT IS SSR?
// =============================================================================

console.log('=== Server-Side Rendering ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CSR vs SSR                                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  CSR (Client-Side Rendering):                                       │
 *   │  Server sends: <div id="root"></div> + bundle.js                  │
 *   │  Browser: download JS → parse → execute → fetch data → render    │
 *   │  User sees: blank page ─────────────────→ content                 │
 *   │  SEO:       ✗ (empty HTML)                                         │
 *   │                                                                      │
 *   │  SSR (Server-Side Rendering):                                       │
 *   │  Server: fetch data → render HTML → send complete HTML            │
 *   │  Browser: show HTML immediately → download JS → hydrate          │
 *   │  User sees: content immediately ──→ interactive                   │
 *   │  SEO:       ✓ (full HTML)                                          │
 *   │                                                                      │
 *   │  Timeline:                                                          │
 *   │  CSR: ░░░░░░░░░░████████ (blank → content)                        │
 *   │  SSR: ████████████████── (content immediately → interactive)      │
 *   │       ↑ FCP here        ↑ TTI here                                │
 *   │                                                                      │
 *   │  SSR = faster FCP (First Contentful Paint)                         │
 *   │  CSR = potentially faster TTI (Time to Interactive)               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CSR: blank page → download JS → render (slow FCP, no SEO)');
console.log('SSR: full HTML immediately → hydrate (fast FCP, good SEO)');


// =============================================================================
// SSR IN NEXT.JS (APP ROUTER)
// =============================================================================

console.log('\n=== SSR in Next.js App Router ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SSR WITH APP ROUTER (Next.js 13+)                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // app/products/[id]/page.tsx                                      │
 *   │  // Server Component by default — runs on server!                  │
 *   │                                                                      │
 *   │  async function ProductPage({ params }) {                          │
 *   │    // This runs on the server, every request                       │
 *   │    const product = await fetch(                                    │
 *   │      `https://api.com/products/${params.id}`,                     │
 *   │      { cache: 'no-store' }  // ← Forces SSR (no caching)         │
 *   │    ).then(r => r.json());                                          │
 *   │                                                                      │
 *   │    return (                                                         │
 *   │      <div>                                                          │
 *   │        <h1>{product.name}</h1>                                     │
 *   │        <p>{product.price}</p>                                      │
 *   │      </div>                                                         │
 *   │    );                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // cache: 'no-store' = SSR (every request)                        │
 *   │  // cache: 'force-cache' = SSG (build time, default)              │
 *   │  // next: { revalidate: 60 } = ISR (every 60s)                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('App Router: Server Components are SSR by default');
console.log('fetch with cache: "no-store" → SSR (every request)');
console.log('fetch with next: { revalidate: 60 } → ISR');


// =============================================================================
// SSR IN PAGES ROUTER (LEGACY)
// =============================================================================

console.log('\n=== SSR in Pages Router (Legacy) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SSR WITH PAGES ROUTER                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // pages/products/[id].tsx                                         │
 *   │  export async function getServerSideProps({ params }) {            │
 *   │    const res = await fetch(`https://api.com/products/${params.id}`);│
 *   │    const product = await res.json();                               │
 *   │                                                                      │
 *   │    return {                                                         │
 *   │      props: { product }  // Passed to component                   │
 *   │    };                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  export default function ProductPage({ product }) {                │
 *   │    return <h1>{product.name}</h1>;                                 │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  getServerSideProps runs on EVERY request on the server            │
 *   │  Has access to: req, res, params, query, cookies                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Pages Router: getServerSideProps() → runs per request');
console.log('Returns { props } passed to the page component');


// =============================================================================
// HYDRATION
// =============================================================================

console.log('\n=== Hydration ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HYDRATION: Making server-rendered HTML interactive                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. Server sends complete HTML (user sees content)                 │
 *   │  2. Browser downloads React JS bundle                              │
 *   │  3. React "hydrates": attaches event listeners to existing HTML   │
 *   │     (doesn't re-render — reuses server HTML)                      │
 *   │  4. Page is now interactive                                         │
 *   │                                                                      │
 *   │  HYDRATION MISMATCH:                                                │
 *   │  If server HTML ≠ client render → warning + re-render            │
 *   │  Common causes:                                                     │
 *   │  • Date.now() / Math.random() (different on server vs client)     │
 *   │  • Browser-only APIs (window, localStorage)                       │
 *   │  • Different data on server vs client                              │
 *   │                                                                      │
 *   │  Fix: useEffect for client-only code, or suppressHydrationWarning │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Hydration: React attaches event listeners to server HTML');
console.log('Mismatch: server HTML ≠ client render → warning');
console.log('Fix: useEffect for client-only logic');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "SSR renders HTML on the server for every request. The user sees content
 * immediately instead of a blank page — faster FCP and great for SEO
 * since crawlers get complete HTML.
 *
 * In Next.js App Router, components are server-rendered by default. I
 * control caching via fetch options: cache 'no-store' for SSR on every
 * request, 'force-cache' for SSG, and revalidate for ISR. In the Pages
 * Router, getServerSideProps runs per request and passes props.
 *
 * After the server sends HTML, React hydrates it — attaching event
 * listeners without re-rendering. If the server and client output don't
 * match, React warns about a hydration mismatch. I avoid this by keeping
 * browser-only code in useEffect and not using Date.now() or
 * Math.random() in the initial render.
 *
 * The trade-off: SSR has higher TTFB since the server must render each
 * request. For content that doesn't change often, SSG or ISR is better."
 */


// RUN: node docs/32-nextjs/01-server-side-rendering.js
