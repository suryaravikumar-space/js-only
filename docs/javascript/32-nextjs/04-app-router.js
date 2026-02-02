/**
 * NEXT.JS: 04 - App Router & File-Based Routing
 *
 * ONE CONCEPT: File system structure = URL routes
 */


// =============================================================================
// APP ROUTER FILE CONVENTIONS
// =============================================================================

console.log('=== App Router File Conventions ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  APP ROUTER FILE STRUCTURE                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  app/                                                                │
 *   │  ├── layout.tsx          → Root layout (wraps all pages)           │
 *   │  ├── page.tsx            → / (home page)                           │
 *   │  ├── loading.tsx         → Loading UI (Suspense fallback)          │
 *   │  ├── error.tsx           → Error boundary                           │
 *   │  ├── not-found.tsx       → 404 page                                │
 *   │  │                                                                  │
 *   │  ├── about/                                                         │
 *   │  │   └── page.tsx        → /about                                  │
 *   │  │                                                                  │
 *   │  ├── blog/                                                          │
 *   │  │   ├── page.tsx        → /blog                                   │
 *   │  │   └── [slug]/                                                    │
 *   │  │       └── page.tsx    → /blog/my-post (dynamic)                │
 *   │  │                                                                  │
 *   │  ├── shop/                                                          │
 *   │  │   ├── layout.tsx      → Nested layout (sidebar)                │
 *   │  │   ├── page.tsx        → /shop                                   │
 *   │  │   └── [...categories]/                                           │
 *   │  │       └── page.tsx    → /shop/men/shoes (catch-all)            │
 *   │  │                                                                  │
 *   │  ├── (marketing)/        → Route group (no URL segment)           │
 *   │  │   ├── pricing/page.tsx → /pricing                              │
 *   │  │   └── features/page.tsx → /features                            │
 *   │  │                                                                  │
 *   │  └── api/                                                           │
 *   │      └── users/                                                     │
 *   │          └── route.ts    → API route: GET/POST /api/users         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const conventions = [
  { file: 'page.tsx',      purpose: 'Route UI (the page content)' },
  { file: 'layout.tsx',    purpose: 'Shared layout (persists across navigation)' },
  { file: 'loading.tsx',   purpose: 'Loading state (Suspense boundary)' },
  { file: 'error.tsx',     purpose: 'Error boundary (catches errors)' },
  { file: 'not-found.tsx', purpose: '404 page' },
  { file: 'route.ts',     purpose: 'API endpoint (GET, POST, etc.)' },
  { file: 'template.tsx',  purpose: 'Like layout but re-renders on navigation' },
];
conventions.forEach(({ file, purpose }) => {
  console.log(`  ${file.padEnd(16)} → ${purpose}`);
});


// =============================================================================
// DYNAMIC ROUTES
// =============================================================================

console.log('\n=== Dynamic Routes ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  DYNAMIC ROUTE PATTERNS                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  [id]/page.tsx            → /products/123                          │
 *   │    params: { id: "123" }                                            │
 *   │                                                                      │
 *   │  [category]/[id]/page.tsx → /electronics/456                       │
 *   │    params: { category: "electronics", id: "456" }                  │
 *   │                                                                      │
 *   │  [...slug]/page.tsx       → /docs/a/b/c (catch-all)               │
 *   │    params: { slug: ["a", "b", "c"] }                               │
 *   │                                                                      │
 *   │  [[...slug]]/page.tsx     → /docs OR /docs/a/b (optional catch-all)│
 *   │    params: { slug: undefined } or { slug: ["a", "b"] }            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('[id]         → single dynamic segment');
console.log('[...slug]    → catch-all (required)');
console.log('[[...slug]]  → optional catch-all');


// =============================================================================
// LAYOUTS
// =============================================================================

console.log('\n=== Layouts ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NESTED LAYOUTS                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // app/layout.tsx (root — wraps everything)                       │
 *   │  export default function RootLayout({ children }) {                │
 *   │    return (                                                         │
 *   │      <html><body>                                                   │
 *   │        <Navbar />                                                   │
 *   │        {children}                                                   │
 *   │        <Footer />                                                   │
 *   │      </body></html>                                                 │
 *   │    );                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // app/dashboard/layout.tsx (nested — wraps dashboard pages)      │
 *   │  export default function DashLayout({ children }) {                │
 *   │    return (                                                         │
 *   │      <div className="flex">                                        │
 *   │        <Sidebar />                                                  │
 *   │        <main>{children}</main>                                     │
 *   │      </div>                                                         │
 *   │    );                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  KEY: Layouts don't re-render on navigation!                       │
 *   │  Only the page.tsx inside changes.                                 │
 *   │  Sidebar state preserved when switching dashboard pages.           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Layouts persist across navigation (no re-render)');
console.log('Nested layouts: root wraps all, sub-layouts wrap sections');
console.log('Route groups (parentheses) organize without affecting URL');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Next.js App Router uses file-based routing where the folder structure
 * maps to URL paths. Each route has conventions: page.tsx for the UI,
 * layout.tsx for shared wrappers, loading.tsx for Suspense fallbacks,
 * and error.tsx for error boundaries.
 *
 * Layouts are the key innovation — they persist across navigation without
 * re-rendering. A dashboard layout with a sidebar won't re-mount when
 * switching between dashboard pages. This preserves state and avoids
 * unnecessary work.
 *
 * Dynamic routes use bracket notation: [id] for single segments,
 * [...slug] for catch-all. Route groups with parentheses organize code
 * without affecting the URL structure.
 *
 * Compared to the Pages Router, the App Router offers nested layouts,
 * Server Components by default, streaming with Suspense, and co-located
 * data fetching directly in components instead of separate
 * getServerSideProps functions."
 */


// RUN: node docs/32-nextjs/04-app-router.js
