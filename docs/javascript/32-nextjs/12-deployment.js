/**
 * NEXT.JS: 12 - Deployment & Output Modes
 *
 * ONE CONCEPT: How to deploy Next.js in different environments
 */


// =============================================================================
// DEPLOYMENT OPTIONS
// =============================================================================

console.log('=== Deployment Options ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NEXT.JS DEPLOYMENT MODES                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. VERCEL (recommended)                                            │
 *   │     git push → auto deploy                                        │
 *   │     Serverless functions, Edge, ISR, Analytics                    │
 *   │     Zero config. Best Next.js support.                            │
 *   │                                                                      │
 *   │  2. NODE.JS SERVER (self-hosted)                                    │
 *   │     next build → next start                                       │
 *   │     Run on any Node.js server (EC2, DigitalOcean)                │
 *   │     Full feature support                                           │
 *   │                                                                      │
 *   │  3. DOCKER                                                          │
 *   │     next build → standalone output → Docker image                 │
 *   │     // next.config.js                                               │
 *   │     output: 'standalone'  → minimal Docker image (~100MB)        │
 *   │                                                                      │
 *   │  4. STATIC EXPORT                                                   │
 *   │     // next.config.js                                               │
 *   │     output: 'export'  → pure HTML/CSS/JS (no server needed)     │
 *   │     Host on any CDN (S3, Cloudflare Pages)                        │
 *   │     ⚠ No SSR, no API routes, no ISR, no middleware               │
 *   │                                                                      │
 *   │  output: 'standalone' vs 'export':                                 │
 *   │  standalone = Node.js server (full features, smaller Docker)      │
 *   │  export = static files only (limited features, any host)         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Vercel: best DX, auto-deploy, zero config');
console.log('Node.js: next build → next start (self-hosted)');
console.log('Docker: output: "standalone" (minimal image)');
console.log('Static: output: "export" (no server features)');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Next.js offers flexible deployment. Vercel provides the best
 * experience with automatic deployments, serverless functions, and
 * Edge runtime. For self-hosting, I use the standalone output mode
 * which creates a minimal Node.js server perfect for Docker — the
 * image is around 100MB instead of including all of node_modules.
 *
 * For simple static sites, output: 'export' generates pure HTML/CSS/JS
 * that can be hosted anywhere, but loses server features like SSR,
 * API routes, and middleware.
 *
 * I choose based on requirements: Vercel for most projects (simplest),
 * Docker standalone for enterprise/custom infrastructure, and static
 * export for landing pages that don't need server features."
 */


// RUN: node docs/32-nextjs/12-deployment.js
