/**
 * NEXT.JS: 10 - Streaming & Suspense
 *
 * ONE CONCEPT: Send HTML progressively as data becomes available
 */


// =============================================================================
// STREAMING
// =============================================================================

console.log('=== Streaming & Suspense ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TRADITIONAL SSR vs STREAMING SSR                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  TRADITIONAL SSR:                                                   │
 *   │  Fetch ALL data → Render ALL HTML → Send → Hydrate ALL           │
 *   │  User waits for slowest data fetch before seeing ANYTHING         │
 *   │                                                                      │
 *   │  STREAMING SSR:                                                     │
 *   │  Send shell immediately → Stream sections as they're ready        │
 *   │                                                                      │
 *   │  Timeline:                                                          │
 *   │  Traditional: ░░░░░░░░░░░░████████████ (nothing then everything) │
 *   │  Streaming:   ████░░████░░████████████ (progressive)              │
 *   │               ↑shell  ↑section1  ↑section2                        │
 *   │                                                                      │
 *   │  // loading.tsx → instant Suspense boundary                        │
 *   │  // Each Suspense boundary streams independently                   │
 *   │                                                                      │
 *   │  <Suspense fallback={<HeaderSkeleton />}>                          │
 *   │    <Header />         ← Streams when data ready                  │
 *   │  </Suspense>                                                        │
 *   │  <Suspense fallback={<FeedSkeleton />}>                            │
 *   │    <Feed />           ← Streams independently                    │
 *   │  </Suspense>                                                        │
 *   │  <Suspense fallback={<SidebarSkeleton />}>                        │
 *   │    <Sidebar />        ← Streams independently                    │
 *   │  </Suspense>                                                        │
 *   │                                                                      │
 *   │  Each section loads as its data becomes available!                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Traditional SSR: wait for ALL data → send ALL HTML');
console.log('Streaming: send shell → stream sections as ready');
console.log('loading.tsx = auto Suspense boundary for that route');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Streaming SSR sends the page shell immediately and streams sections
 * as their data becomes available. Instead of waiting for the slowest
 * API call before showing anything, the user sees the layout instantly
 * with skeleton loaders, and each section fills in independently.
 *
 * In Next.js, I wrap async server components in Suspense boundaries.
 * The loading.tsx file convention creates automatic Suspense boundaries
 * at the route level. Each boundary streams independently — a slow
 * database query doesn't block the entire page.
 *
 * This dramatically improves perceived performance: the user sees content
 * progressively instead of staring at a blank page. It's especially
 * valuable for pages that fetch from multiple slow data sources."
 */


// RUN: node docs/32-nextjs/10-streaming-suspense.js
