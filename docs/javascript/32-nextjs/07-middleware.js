/**
 * NEXT.JS: 07 - Middleware
 *
 * ONE CONCEPT: Run code before a request is completed (auth, redirects, rewrites)
 */


// =============================================================================
// WHAT IS MIDDLEWARE?
// =============================================================================

console.log('=== Next.js Middleware ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MIDDLEWARE: Code that runs BEFORE the request reaches your page    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Request → [Middleware] → Page/API Route                           │
 *   │                │                                                    │
 *   │                ├─ Redirect (auth check failed)                     │
 *   │                ├─ Rewrite (serve different page)                   │
 *   │                ├─ Set headers (CORS, security)                     │
 *   │                ├─ Set cookies                                       │
 *   │                └─ Return response directly                          │
 *   │                                                                      │
 *   │  // middleware.ts (root of project)                                 │
 *   │  import { NextResponse } from 'next/server';                       │
 *   │                                                                      │
 *   │  export function middleware(request) {                              │
 *   │    const token = request.cookies.get('token');                     │
 *   │                                                                      │
 *   │    if (!token && request.nextUrl.pathname.startsWith('/dashboard'))│
 *   │    {                                                                │
 *   │      return NextResponse.redirect(new URL('/login', request.url));│
 *   │    }                                                                │
 *   │                                                                      │
 *   │    return NextResponse.next(); // Continue to page                 │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // Match specific routes                                           │
 *   │  export const config = {                                            │
 *   │    matcher: ['/dashboard/:path*', '/api/:path*']                  │
 *   │  };                                                                 │
 *   │                                                                      │
 *   │  Runs at the EDGE (not Node.js) — limited APIs                    │
 *   │  Fast: runs before any page rendering                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('middleware.ts in project root → runs before every matched request');
console.log('Use cases: auth redirects, CORS, A/B testing, geolocation');
console.log('Runs at the Edge (fast, limited Node.js APIs)');


// =============================================================================
// COMMON USE CASES
// =============================================================================

console.log('\n=== Common Use Cases ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MIDDLEWARE USE CASES                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. AUTH PROTECTION                                                  │
 *   │     Check token → redirect to /login if missing                   │
 *   │                                                                      │
 *   │  2. ROLE-BASED ACCESS                                               │
 *   │     Check role in token → redirect if insufficient                │
 *   │                                                                      │
 *   │  3. GEOLOCATION REDIRECTS                                           │
 *   │     request.geo.country → redirect to country-specific page       │
 *   │                                                                      │
 *   │  4. A/B TESTING                                                      │
 *   │     Set cookie → rewrite to variant A or B                        │
 *   │                                                                      │
 *   │  5. RATE LIMITING                                                    │
 *   │     Track request count → return 429 if exceeded                  │
 *   │                                                                      │
 *   │  6. BOT DETECTION                                                    │
 *   │     Check user-agent → block or serve different content          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Auth, role-based access, geo-redirects, A/B testing, rate limiting');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Next.js middleware runs before requests reach the page, defined in
 * a middleware.ts file at the project root. It runs at the Edge which
 * means it's fast but has limited Node.js APIs — no filesystem access,
 * limited npm packages.
 *
 * I primarily use it for authentication: checking if a JWT or session
 * cookie exists before allowing access to protected routes like
 * /dashboard. If the token is missing or invalid, I redirect to /login.
 * The matcher config ensures middleware only runs on relevant paths,
 * not static assets.
 *
 * Other use cases include A/B testing (set a cookie, rewrite to variant
 * pages), geolocation-based redirects, and adding security headers.
 * It's much more efficient than checking auth in every page component."
 */


// RUN: node docs/32-nextjs/07-middleware.js
