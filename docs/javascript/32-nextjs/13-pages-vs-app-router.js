/**
 * NEXT.JS: 13 - Pages Router vs App Router
 *
 * ONE CONCEPT: Two routing systems — legacy Pages vs modern App Router
 */


// =============================================================================
// COMPARISON
// =============================================================================

console.log('=== Pages Router vs App Router ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PAGES ROUTER vs APP ROUTER                                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ┌─────────────────────┬───────────────┬───────────────────────┐   │
 *   │  │ Feature             │ Pages Router  │ App Router            │   │
 *   │  ├─────────────────────┼───────────────┼───────────────────────┤   │
 *   │  │ Directory           │ pages/        │ app/                  │   │
 *   │  │ Components          │ All client    │ Server by default     │   │
 *   │  │ Data fetching       │ getServerSide │ async/await in        │   │
 *   │  │                     │ Props/Static  │ Server Components     │   │
 *   │  │ Layouts             │ _app.tsx      │ Nested layout.tsx     │   │
 *   │  │ Loading UI          │ Manual        │ loading.tsx           │   │
 *   │  │ Error handling      │ Manual        │ error.tsx             │   │
 *   │  │ Streaming           │ No            │ Yes (Suspense)        │   │
 *   │  │ Server Actions      │ No            │ Yes                   │   │
 *   │  │ Partial rendering   │ No            │ Yes (per-segment)     │   │
 *   │  │ Middleware           │ Yes           │ Yes                   │   │
 *   │  │ API Routes          │ pages/api/    │ app/api/route.ts     │   │
 *   │  │ Stability           │ Mature        │ Stable (13.4+)       │   │
 *   │  └─────────────────────┴───────────────┴───────────────────────┘   │
 *   │                                                                      │
 *   │  Pages Router data fetching:                                        │
 *   │  • getServerSideProps → SSR                                        │
 *   │  • getStaticProps → SSG                                            │
 *   │  • getStaticPaths → dynamic SSG routes                            │
 *   │                                                                      │
 *   │  App Router data fetching:                                          │
 *   │  • fetch() with cache options in Server Components                │
 *   │  • generateStaticParams for dynamic SSG routes                    │
 *   │                                                                      │
 *   │  Both can coexist in the same project during migration!           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Pages Router: pages/, client components, getServerSideProps');
console.log('App Router:   app/, server components, async/await, streaming');
console.log('App Router is the future. Both can coexist during migration.');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "The App Router is the modern approach with Server Components by default,
 * nested layouts that persist across navigation, streaming via Suspense,
 * and data fetching directly in components with async/await. The Pages
 * Router uses getServerSideProps and getStaticProps for data fetching,
 * all components are client-side, and layouts are limited to _app.tsx.
 *
 * For new projects, I use the App Router exclusively. For existing
 * projects, both routers can coexist, allowing incremental migration.
 * The biggest wins from migrating are Server Components (smaller bundles),
 * nested layouts (better UX), and streaming (progressive loading)."
 */


// RUN: node docs/32-nextjs/13-pages-vs-app-router.js
