/**
 * NEXT.JS: 05 - Data Fetching
 *
 * ONE CONCEPT: Fetch data on server, client, or build time
 */


// =============================================================================
// DATA FETCHING IN APP ROUTER
// =============================================================================

console.log('=== Data Fetching in App Router ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  FETCHING IN SERVER COMPONENTS                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Just use async/await — no special API needed!                  │
 *   │  async function ProductPage({ params }) {                          │
 *   │    const product = await fetch(`/api/products/${params.id}`);     │
 *   │    return <h1>{product.name}</h1>;                                 │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  CACHING OPTIONS (via fetch):                                       │
 *   │  ┌─────────────────────────────────────────────────────────────┐    │
 *   │  │ fetch(url)                                                  │    │
 *   │  │   → Default: cached (SSG-like)                             │    │
 *   │  │                                                             │    │
 *   │  │ fetch(url, { cache: 'no-store' })                          │    │
 *   │  │   → SSR: fresh data every request                          │    │
 *   │  │                                                             │    │
 *   │  │ fetch(url, { next: { revalidate: 60 } })                  │    │
 *   │  │   → ISR: revalidate every 60 seconds                      │    │
 *   │  │                                                             │    │
 *   │  │ fetch(url, { next: { tags: ['products'] } })              │    │
 *   │  │   → Tag-based: revalidateTag('products')                  │    │
 *   │  └─────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   │  DIRECT DB ACCESS (no fetch needed):                                │
 *   │  async function Page() {                                            │
 *   │    const users = await prisma.user.findMany();                    │
 *   │    return <UserList users={users} />;                             │
 *   │  }                                                                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Server Components: just async/await (no special API)');
console.log('Default: cached. no-store: SSR. revalidate: ISR.');
console.log('Can access DB directly (Prisma, Drizzle) — no API needed!');


// =============================================================================
// PARALLEL & SEQUENTIAL FETCHING
// =============================================================================

console.log('\n=== Parallel vs Sequential Fetching ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PARALLEL vs SEQUENTIAL                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  SEQUENTIAL (waterfall — slow!):                                    │
 *   │  const user = await getUser(id);         // 200ms                  │
 *   │  const posts = await getPosts(user.id);  // 300ms                  │
 *   │  // Total: 500ms (one after another)                               │
 *   │                                                                      │
 *   │  PARALLEL (fast!):                                                   │
 *   │  const [user, posts] = await Promise.all([                        │
 *   │    getUser(id),      // 200ms ─┐                                   │
 *   │    getPosts(id),     // 300ms ─┤ parallel                         │
 *   │  ]);                                                                │
 *   │  // Total: 300ms (parallel!)                                       │
 *   │                                                                      │
 *   │  STREAMING (progressive):                                           │
 *   │  // Suspense boundaries load independently                        │
 *   │  <Suspense fallback={<UserSkeleton />}>                           │
 *   │    <UserProfile />  ← Streams when ready                          │
 *   │  </Suspense>                                                        │
 *   │  <Suspense fallback={<PostsSkeleton />}>                          │
 *   │    <UserPosts />    ← Streams when ready                          │
 *   │  </Suspense>                                                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Sequential: await one after another (waterfall)');
console.log('Parallel: Promise.all (both at once)');
console.log('Streaming: Suspense boundaries load independently');


// =============================================================================
// CLIENT-SIDE FETCHING
// =============================================================================

console.log('\n=== Client-Side Fetching ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CLIENT COMPONENTS: useEffect or SWR/React Query                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // SWR (recommended for client fetching)                          │
 *   │  "use client";                                                      │
 *   │  import useSWR from 'swr';                                         │
 *   │                                                                      │
 *   │  function Dashboard() {                                             │
 *   │    const { data, error, isLoading } = useSWR('/api/stats', fetch);│
 *   │    if (isLoading) return <Spinner />;                              │
 *   │    if (error) return <Error />;                                    │
 *   │    return <Stats data={data} />;                                   │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  SWR/React Query benefits:                                          │
 *   │  • Caching + deduplication                                         │
 *   │  • Automatic revalidation                                           │
 *   │  • Optimistic updates                                               │
 *   │  • Stale-while-revalidate                                          │
 *   │                                                                      │
 *   │  WHEN TO FETCH CLIENT-SIDE:                                        │
 *   │  • Real-time updates (polling, WebSocket)                          │
 *   │  • User interactions (search, pagination)                          │
 *   │  • Data that changes per user action                               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Client: SWR or React Query (caching, revalidation)');
console.log('Use for: real-time, user interactions, dynamic updates');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "In the App Router, Server Components fetch data with plain async/await
 * — no special API. The fetch function controls caching: default is
 * cached (SSG), no-store for SSR, and revalidate for ISR. I can also
 * access the database directly with Prisma since it runs on the server.
 *
 * I use Promise.all for parallel fetches to avoid waterfalls, and
 * Suspense boundaries for streaming — each section loads independently
 * so the user sees content progressively instead of waiting for
 * everything.
 *
 * For client-side fetching after user interactions, I use SWR or React
 * Query which handle caching, deduplication, and stale-while-revalidate
 * automatically. The pattern is: Server Components for initial data,
 * client-side libraries for interactive updates."
 */


// RUN: node docs/32-nextjs/05-data-fetching.js
