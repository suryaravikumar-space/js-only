/**
 * NEXT.JS: 11 - Caching in Next.js
 *
 * ONE CONCEPT: Next.js has multiple caching layers for maximum performance
 */


// =============================================================================
// CACHING LAYERS
// =============================================================================

console.log('=== Next.js Caching ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEXT.JS CACHING LAYERS                                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. REQUEST MEMOIZATION (per request)                               │
 *   │     Same fetch URL called multiple times in one render             │
 *   │     → Only one actual request, result shared                      │
 *   │     Automatic with fetch()                                         │
 *   │                                                                      │
 *   │  2. DATA CACHE (cross-request)                                      │
 *   │     fetch() results cached on server                               │
 *   │     Persists across requests and deployments                       │
 *   │     Opt out: cache: 'no-store'                                    │
 *   │     Revalidate: next: { revalidate: 60 }                         │
 *   │                                                                      │
 *   │  3. FULL ROUTE CACHE (pre-rendered pages)                          │
 *   │     Static routes cached as HTML + RSC payload                    │
 *   │     Served from CDN                                                │
 *   │     Invalidated by: revalidatePath(), revalidateTag()            │
 *   │                                                                      │
 *   │  4. ROUTER CACHE (client-side)                                      │
 *   │     RSC payload cached in browser                                  │
 *   │     Back/forward navigation is instant                             │
 *   │     Prefetched routes cached automatically                        │
 *   │                                                                      │
 *   │  INVALIDATION:                                                      │
 *   │  revalidatePath('/blog')          → revalidate specific path     │
 *   │  revalidateTag('posts')           → revalidate tagged fetches    │
 *   │  Time-based: next: { revalidate: 60 }                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('4 layers: Request Memo → Data Cache → Route Cache → Router Cache');
console.log('Invalidate: revalidatePath(), revalidateTag(), time-based');
console.log('Opt out: cache: "no-store" for fresh data every request');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Next.js has four caching layers. Request memoization deduplicates
 * identical fetch calls within a single render. The Data Cache persists
 * fetch results across requests on the server. The Full Route Cache
 * stores pre-rendered HTML on the CDN. The Router Cache keeps RSC
 * payloads in the browser for instant back/forward navigation.
 *
 * I control caching per fetch: no-store for dynamic data, revalidate
 * for ISR, and tag-based invalidation for on-demand updates from CMS
 * webhooks. After a Server Action mutation, I call revalidatePath or
 * revalidateTag to invalidate specific cached pages."
 */


// RUN: node docs/32-nextjs/11-caching.js
