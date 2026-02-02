/**
 * NEXT.JS: 14 - Common Patterns & Best Practices
 *
 * ONE CONCEPT: Real-world patterns used in production Next.js apps
 */


// =============================================================================
// AUTH PATTERN
// =============================================================================

console.log('=== Common Next.js Patterns ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  AUTHENTICATION PATTERN                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. Middleware checks token → redirect to /login                   │
 *   │  2. Server Component reads session → pass user to children        │
 *   │  3. Client Component renders interactive UI with user data        │
 *   │                                                                      │
 *   │  Libraries: NextAuth.js (Auth.js), Clerk, Lucia                   │
 *   │                                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │  FORM HANDLING PATTERN                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. Server Action validates + saves data                           │
 *   │  2. revalidatePath() updates cached pages                          │
 *   │  3. useFormStatus for loading state                                │
 *   │  4. useFormState for server validation errors                     │
 *   │                                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │  DATA FETCHING PATTERN                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Page (Server Component): fetch initial data                       │
 *   │  ├── Static sections: Suspense + loading skeletons                │
 *   │  └── Interactive sections: "use client" + SWR for updates         │
 *   │                                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │  PROJECT STRUCTURE                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  app/                                                                │
 *   │  ├── (auth)/login/page.tsx       Route groups for organization   │
 *   │  ├── (dashboard)/                                                   │
 *   │  │   ├── layout.tsx              Dashboard layout with sidebar   │
 *   │  │   ├── page.tsx                Dashboard home                   │
 *   │  │   └── settings/page.tsx       Dashboard settings               │
 *   │  ├── api/                         API routes                       │
 *   │  └── layout.tsx                   Root layout                      │
 *   │  components/                                                        │
 *   │  ├── ui/                          Reusable UI (Button, Modal)     │
 *   │  └── features/                    Feature-specific components     │
 *   │  lib/                             Utilities, DB client, auth      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Auth: middleware + Server Component + NextAuth/Clerk');
console.log('Forms: Server Actions + revalidatePath + useFormStatus');
console.log('Data: Server Component fetches + Client SWR for updates');
console.log('Structure: app/ routes, components/, lib/');


// =============================================================================
// ENVIRONMENT VARIABLES
// =============================================================================

console.log('\n=== Environment Variables ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ENV VARS IN NEXT.JS                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  SERVER-ONLY (default):                                             │
 *   │  DATABASE_URL=postgres://...                                       │
 *   │  API_SECRET=abc123                                                  │
 *   │  → Only accessible in Server Components, API routes                │
 *   │                                                                      │
 *   │  CLIENT-EXPOSED (NEXT_PUBLIC_ prefix):                              │
 *   │  NEXT_PUBLIC_API_URL=https://api.com                               │
 *   │  → Accessible everywhere (bundled into client JS!)                │
 *   │  ⚠ Never put secrets here!                                         │
 *   │                                                                      │
 *   │  .env files:                                                        │
 *   │  .env              → all environments                              │
 *   │  .env.local         → local overrides (gitignored)                │
 *   │  .env.development  → dev only                                      │
 *   │  .env.production   → prod only                                     │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Server-only: DATABASE_URL (no prefix, never in client)');
console.log('Client-exposed: NEXT_PUBLIC_API_URL (bundled into JS!)');
console.log('Never put secrets in NEXT_PUBLIC_ variables!');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "In production Next.js apps, I use middleware for auth guards, Server
 * Components for initial data loading, and client components only for
 * interactivity. Forms use Server Actions with revalidatePath for cache
 * invalidation and useFormStatus for loading states.
 *
 * I organize with route groups for logical separation — (auth) for
 * login/signup, (dashboard) for protected pages — each with its own
 * layout. Components go in a separate components/ directory, and
 * shared utilities in lib/.
 *
 * For environment variables, anything without the NEXT_PUBLIC_ prefix
 * stays server-side only. I put API keys and database URLs as regular
 * env vars, and only expose public API URLs with the NEXT_PUBLIC_ prefix."
 */


// RUN: node docs/32-nextjs/14-common-patterns.js
