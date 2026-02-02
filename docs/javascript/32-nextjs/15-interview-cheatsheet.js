/**
 * NEXT.JS: 15 - Interview Cheatsheet
 *
 * Quick reference for all Next.js concepts
 */


// =============================================================================
// MASTER CHEATSHEET
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEXT.JS CHEATSHEET                                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WHY NEXT.JS                                                        │
 *   │  • SSR/SSG for SEO + fast initial load                             │
 *   │  • File-based routing (app/ directory)                             │
 *   │  • Server Components (zero JS to client)                           │
 *   │  • API routes + Server Actions                                     │
 *   │  • Image, font, script optimization built-in                      │
 *   │                                                                      │
 *   │  RENDERING                                                          │
 *   │  • SSG: build-time, CDN, fastest (blog, docs)                     │
 *   │  • ISR: SSG + revalidate every N seconds                          │
 *   │  • SSR: every request, fresh data (dashboards)                    │
 *   │  • CSR: client-side, "use client" (interactive)                   │
 *   │  • Streaming: Suspense boundaries, progressive load               │
 *   │                                                                      │
 *   │  SERVER vs CLIENT COMPONENTS                                        │
 *   │  • Server (default): async, DB access, zero JS, no hooks         │
 *   │  • Client ("use client"): hooks, events, browser APIs            │
 *   │  • Keep "use client" boundary low in the tree                     │
 *   │  • Server can render Client, not vice versa                       │
 *   │                                                                      │
 *   │  APP ROUTER                                                         │
 *   │  • page.tsx (route), layout.tsx (shared wrapper)                  │
 *   │  • loading.tsx (Suspense), error.tsx (error boundary)            │
 *   │  • [id] dynamic, [...slug] catch-all, (group) route group        │
 *   │  • Layouts persist across navigation                               │
 *   │                                                                      │
 *   │  DATA FETCHING                                                      │
 *   │  • Server: async/await + fetch cache options                      │
 *   │  • no-store = SSR, revalidate = ISR, default = SSG               │
 *   │  • Client: SWR / React Query                                      │
 *   │  • Parallel: Promise.all, Streaming: Suspense                     │
 *   │                                                                      │
 *   │  CACHING (4 layers)                                                 │
 *   │  • Request Memoization → Data Cache → Route Cache → Router Cache │
 *   │  • Invalidate: revalidatePath, revalidateTag, time-based         │
 *   │                                                                      │
 *   │  API & MUTATIONS                                                    │
 *   │  • Route Handlers: app/api/route.ts (REST endpoints)             │
 *   │  • Server Actions: "use server" (form mutations, no API needed)  │
 *   │                                                                      │
 *   │  OPTIMIZATION                                                       │
 *   │  • next/image: auto WebP, srcset, lazy, CLS prevention           │
 *   │  • next/font: self-hosted, zero CLS, auto-subset                 │
 *   │  • Metadata API: SEO, OG tags, sitemap.ts, robots.ts            │
 *   │  • Middleware: auth, redirects, edge runtime                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// TOP INTERVIEW Q&A
// =============================================================================

console.log('=== Top Interview Q&A ===\n');

const qa = [
  {
    q: 'Why use Next.js over plain React?',
    a: 'Plain React is client-side only — no SEO, slow initial load, no routing. Next.js adds SSR/SSG for SEO and fast loads, file-based routing, API routes, Server Components that ship zero JS, and built-in image/font optimization. It\'s a full-stack React framework.'
  },
  {
    q: 'Explain SSR vs SSG vs ISR.',
    a: 'SSG renders at build time — fastest, served from CDN, for static content like blogs. SSR renders on every request — fresh data, for personalized/real-time pages. ISR is SSG that regenerates in the background after N seconds — fast AND fresh. Stale-while-revalidate pattern.'
  },
  {
    q: 'What are Server Components?',
    a: 'Components that run on the server only — they can access databases, use secrets, and ship zero JavaScript to the client. Default in App Router. I add "use client" only for components that need hooks, event handlers, or browser APIs. This drastically reduces bundle size.'
  },
  {
    q: 'How does data fetching work in the App Router?',
    a: 'Server Components use plain async/await with fetch(). Cache options control rendering: default is cached (SSG), cache: "no-store" is SSR, next: { revalidate: 60 } is ISR. I can also access the DB directly with Prisma. For client-side, I use SWR or React Query.'
  },
  {
    q: 'What is streaming in Next.js?',
    a: 'Streaming sends the page shell immediately and streams sections as their data becomes ready, using Suspense boundaries. Instead of waiting for the slowest fetch, users see content progressively. loading.tsx creates automatic Suspense boundaries per route.'
  },
  {
    q: 'Explain Next.js caching.',
    a: 'Four layers: Request Memoization deduplicates fetches in one render, Data Cache persists fetch results across requests, Full Route Cache stores pre-rendered HTML, Router Cache caches RSC payload in the browser. I invalidate with revalidatePath(), revalidateTag(), or time-based revalidation.'
  },
  {
    q: 'Server Components vs Client Components — when to use which?',
    a: 'Server Components for: data fetching, DB access, secrets, non-interactive UI. Client Components for: useState/useEffect, event handlers, browser APIs. Keep the "use client" boundary as low as possible. Server can render Client components but not vice versa — pass as children.'
  },
  {
    q: 'What are Server Actions?',
    a: 'Functions marked "use server" that run on the server but can be called from forms or client components. They handle mutations without needing API routes — like RPC. They work without JavaScript (progressive enhancement) and I call revalidatePath after mutations to update cached pages.'
  },
  {
    q: 'How does Next.js handle SEO?',
    a: 'SSR/SSG serves full HTML to crawlers. The Metadata API defines title, description, and OG tags per page (static or dynamic). sitemap.ts and robots.ts auto-generate. next/image handles alt text and performance. Fast Core Web Vitals boost Google rankings.'
  },
  {
    q: 'Pages Router vs App Router?',
    a: 'App Router is the modern approach: Server Components by default, nested layouts, streaming, Server Actions. Pages Router uses getServerSideProps/getStaticProps, all client components, limited layouts. Both can coexist for incremental migration. New projects should use App Router.'
  },
];

qa.forEach(({ q, a }, i) => {
  console.log(`${i + 1}. Q: ${q}`);
  console.log(`   A: ${a}\n`);
});


// RUN: node docs/32-nextjs/15-interview-cheatsheet.js
