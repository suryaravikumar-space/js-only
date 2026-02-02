/**
 * NEXT.JS: 02 - Static Site Generation (SSG) & ISR
 *
 * ONE CONCEPT: Pre-render pages at build time for maximum speed
 */


// =============================================================================
// SSG — STATIC SITE GENERATION
// =============================================================================

console.log('=== Static Site Generation ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SSG: Pre-render HTML at BUILD time                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  BUILD TIME:                                                        │
 *   │  next build → fetch data → render HTML → static files            │
 *   │                                                                      │
 *   │  RUNTIME:                                                           │
 *   │  Request → CDN serves pre-built HTML → instant!                   │
 *   │  No server computation. Just a file.                               │
 *   │                                                                      │
 *   │  SSG vs SSR:                                                        │
 *   │  SSG:  HTML generated ONCE at build → served from CDN             │
 *   │  SSR:  HTML generated on EVERY request → server work              │
 *   │                                                                      │
 *   │  USE SSG FOR:                                                       │
 *   │  • Blog posts                                                       │
 *   │  • Documentation                                                    │
 *   │  • Marketing/landing pages                                          │
 *   │  • Product catalog (doesn't change often)                          │
 *   │  • Any page where content is known at build time                  │
 *   │                                                                      │
 *   │  DON'T USE SSG FOR:                                                 │
 *   │  • User dashboards (personalized)                                  │
 *   │  • Real-time data (stock prices)                                   │
 *   │  • Frequently changing content (without ISR)                       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('SSG: build once → serve from CDN → fastest possible');
console.log('Best for: blog, docs, marketing, product catalog');


// =============================================================================
// SSG IN NEXT.JS
// =============================================================================

console.log('\n=== SSG Implementation ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  APP ROUTER (default behavior)                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // app/blog/[slug]/page.tsx                                        │
 *   │  // Static by default! (fetch caches by default)                   │
 *   │                                                                      │
 *   │  async function BlogPost({ params }) {                             │
 *   │    const post = await fetch(`https://api.com/posts/${params.slug}`);│
 *   │    return <article>{post.content}</article>;                      │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // Tell Next.js which dynamic routes to pre-render                │
 *   │  export async function generateStaticParams() {                    │
 *   │    const posts = await fetch('https://api.com/posts');            │
 *   │    return posts.map(post => ({ slug: post.slug }));               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │  PAGES ROUTER                                                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  export async function getStaticProps({ params }) {                │
 *   │    const post = await getPost(params.slug);                        │
 *   │    return { props: { post } };                                    │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  export async function getStaticPaths() {                          │
 *   │    const posts = await getAllPosts();                               │
 *   │    return {                                                         │
 *   │      paths: posts.map(p => ({ params: { slug: p.slug } })),      │
 *   │      fallback: false  // 404 for unknown paths                    │
 *   │    };                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('App Router: static by default, generateStaticParams for dynamic');
console.log('Pages Router: getStaticProps + getStaticPaths');


// =============================================================================
// ISR — INCREMENTAL STATIC REGENERATION
// =============================================================================

console.log('\n=== ISR (Incremental Static Regeneration) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ISR: Static pages that refresh in the background                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  SSG problem: Content goes stale. Must rebuild entire site.        │
 *   │  ISR solution: Serve stale page → regenerate in background        │
 *   │                                                                      │
 *   │  Timeline:                                                          │
 *   │  Build: Generate page (fresh)                                       │
 *   │  0-60s: Serve cached page (fast, from CDN)                        │
 *   │  After 60s: Next request triggers background regeneration         │
 *   │  → That request still gets stale page (fast!)                     │
 *   │  → Next request gets fresh page                                   │
 *   │  = Stale-While-Revalidate pattern!                                 │
 *   │                                                                      │
 *   │  APP ROUTER:                                                        │
 *   │  async function Page() {                                            │
 *   │    const data = await fetch('https://api.com/data', {             │
 *   │      next: { revalidate: 60 }  // ← Revalidate every 60s        │
 *   │    });                                                              │
 *   │    return <div>{data}</div>;                                       │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  PAGES ROUTER:                                                      │
 *   │  export async function getStaticProps() {                          │
 *   │    return {                                                         │
 *   │      props: { data },                                               │
 *   │      revalidate: 60  // ← Revalidate every 60s                   │
 *   │    };                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  ON-DEMAND REVALIDATION:                                            │
 *   │  // API route to trigger revalidation                              │
 *   │  await res.revalidate('/blog/post-1');                             │
 *   │  // Revalidate when CMS publishes new content                     │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('ISR = SSG + automatic background refresh');
console.log('revalidate: 60 → page refreshes every 60 seconds');
console.log('Stale-while-revalidate: fast response + eventual freshness');
console.log('On-demand revalidation: trigger from CMS webhook');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "SSG pre-renders pages at build time into static HTML files served
 * from a CDN — it's the fastest option since there's no server
 * computation per request. I use it for blog posts, docs, and marketing
 * pages where content is known at build time. In the App Router, pages
 * are static by default; I use generateStaticParams for dynamic routes.
 *
 * The limitation is stale content — you'd need to rebuild the entire
 * site to update a page. ISR solves this with a stale-while-revalidate
 * pattern: serve the cached page instantly, regenerate in the background
 * after N seconds. The next visitor gets the fresh version.
 *
 * I also use on-demand revalidation for CMS-driven content: when an
 * editor publishes a new article, a webhook calls my API route which
 * triggers revalidation for that specific page — no waiting for the
 * timer.
 *
 * ISR gives me the speed of SSG with near-real-time content updates.
 * For truly dynamic content like user dashboards, I use SSR or client-
 * side fetching instead."
 */


// RUN: node docs/32-nextjs/02-static-site-generation.js
