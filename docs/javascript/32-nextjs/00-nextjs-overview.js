/**
 * NEXT.JS: 00 - Next.js Overview
 *
 * ONE CONCEPT: Why Next.js exists and what problems it solves
 */


// =============================================================================
// WHY NEXT.JS?
// =============================================================================

console.log('=== Why Next.js? ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PROBLEMS WITH PLAIN REACT (CRA / Vite)                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. NO SEO                                                          │
 *   │     React renders on client → search engines see empty HTML       │
 *   │     <div id="root"></div> → nothing to index                     │
 *   │                                                                      │
 *   │  2. SLOW INITIAL LOAD                                               │
 *   │     Download JS → Parse → Execute → Fetch data → Render          │
 *   │     User sees blank page while all this happens                    │
 *   │                                                                      │
 *   │  3. NO FILE-BASED ROUTING                                           │
 *   │     Must configure react-router manually                           │
 *   │                                                                      │
 *   │  4. NO API ROUTES                                                   │
 *   │     Need separate backend server                                   │
 *   │                                                                      │
 *   │  5. NO BUILT-IN OPTIMIZATION                                        │
 *   │     Image optimization, font loading, code splitting — DIY        │
 *   │                                                                      │
 *   │  NEXT.JS SOLVES ALL OF THESE:                                       │
 *   │  ✓ SSR/SSG → SEO + fast initial load                              │
 *   │  ✓ File-based routing (pages/ or app/)                            │
 *   │  ✓ API routes (serverless functions)                               │
 *   │  ✓ Image, font, script optimization built-in                      │
 *   │  ✓ Automatic code splitting per route                             │
 *   │  ✓ Zero-config TypeScript, CSS Modules, Sass                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Plain React: no SEO, slow initial load, manual routing');
console.log('Next.js: SSR/SSG, file routing, API routes, optimizations');


// =============================================================================
// RENDERING STRATEGIES OVERVIEW
// =============================================================================

console.log('\n=== Rendering Strategies ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEXT.JS RENDERING OPTIONS                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  CSR (Client-Side Rendering):                                       │
 *   │  Browser renders. "use client" components.                         │
 *   │  Use for: interactive UI, user-specific content                    │
 *   │                                                                      │
 *   │  SSR (Server-Side Rendering):                                       │
 *   │  Server renders on EVERY request. Fresh data.                      │
 *   │  Use for: personalized pages, real-time data                       │
 *   │                                                                      │
 *   │  SSG (Static Site Generation):                                      │
 *   │  Build-time render. HTML files served from CDN.                   │
 *   │  Use for: blog, docs, marketing pages                              │
 *   │                                                                      │
 *   │  ISR (Incremental Static Regeneration):                             │
 *   │  Static + revalidate after N seconds.                              │
 *   │  Use for: product pages, news (stale-while-revalidate)            │
 *   │                                                                      │
 *   │  Speed:     SSG > ISR > SSR > CSR (initial load)                  │
 *   │  Freshness: CSR > SSR > ISR > SSG (data freshness)               │
 *   │                                                                      │
 *   │  NEXT.JS LETS YOU MIX THESE PER PAGE!                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const strategies = [
  { name: 'SSG',  speed: 'Fastest', freshness: 'Build-time',  use: 'Blog, docs, marketing' },
  { name: 'ISR',  speed: 'Fast',    freshness: 'N seconds',   use: 'Product pages, news' },
  { name: 'SSR',  speed: 'Medium',  freshness: 'Every request', use: 'Personalized, real-time' },
  { name: 'CSR',  speed: 'Slowest', freshness: 'Real-time',   use: 'Interactive dashboards' },
];
strategies.forEach(({ name, speed, freshness, use }) => {
  console.log(`  ${name}: ${speed.padEnd(8)} | Data: ${freshness.padEnd(14)} | ${use}`);
});


// =============================================================================
// NEXT.JS ARCHITECTURE
// =============================================================================

console.log('\n=== Architecture ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEXT.JS ARCHITECTURE                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ┌─────────────────────────────────────────────────────┐            │
 *   │  │                   Next.js App                        │            │
 *   │  │  ┌──────────────┐  ┌──────────────┐                │            │
 *   │  │  │ Server       │  │ Client       │                │            │
 *   │  │  │ Components   │  │ Components   │                │            │
 *   │  │  │ (default)    │  │ ("use client")│               │            │
 *   │  │  └──────────────┘  └──────────────┘                │            │
 *   │  │  ┌──────────────┐  ┌──────────────┐                │            │
 *   │  │  │ API Routes   │  │ Middleware   │                │            │
 *   │  │  │ (route.ts)   │  │ (edge)      │                │            │
 *   │  │  └──────────────┘  └──────────────┘                │            │
 *   │  └─────────────────────────────────────────────────────┘            │
 *   │                         │                                           │
 *   │  Deploys to: Vercel, Node.js server, Docker, static export        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Server Components (default) + Client Components ("use client")');
console.log('API Routes + Middleware + File-based routing');
console.log('Deploy: Vercel, Node.js, Docker, static export');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Next.js is a React framework that solves the problems plain React
 * can't: SEO, initial load performance, routing, and API handling.
 * Plain React renders entirely on the client — search engines see empty
 * HTML and users see a blank page while JavaScript loads and fetches data.
 *
 * Next.js offers multiple rendering strategies per page: SSG for static
 * content served from CDN (fastest), SSR for dynamic content rendered
 * on each request, ISR for static pages that revalidate after N seconds,
 * and CSR for interactive client-side features. I can mix these in the
 * same app.
 *
 * With the App Router, components are Server Components by default —
 * they render on the server, send HTML, and ship zero JavaScript to the
 * client. I add 'use client' only for interactive components that need
 * hooks or browser APIs. This drastically reduces the client-side bundle.
 *
 * Built-in features like Image optimization, font loading, code splitting,
 * and API routes make Next.js a full-stack React framework."
 */


// RUN: node docs/32-nextjs/00-nextjs-overview.js
