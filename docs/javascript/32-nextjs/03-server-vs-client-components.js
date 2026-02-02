/**
 * NEXT.JS: 03 - Server Components vs Client Components
 *
 * ONE CONCEPT: Server Components run on the server, ship zero JS to client
 */


// =============================================================================
// SERVER vs CLIENT COMPONENTS
// =============================================================================

console.log('=== Server vs Client Components ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SERVER COMPONENTS (default)     CLIENT COMPONENTS ("use client")  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ✓ Run on server only           ✓ Run in browser                   │
 *   │  ✓ Zero JS sent to client       ✗ JS bundle sent to client        │
 *   │  ✓ Direct DB/file access        ✓ useState, useEffect, hooks      │
 *   │  ✓ Access secrets/env vars      ✓ Event handlers (onClick)        │
 *   │  ✓ async/await in component     ✓ Browser APIs (window, DOM)      │
 *   │  ✗ No useState/useEffect        ✗ No direct DB access             │
 *   │  ✗ No browser APIs              ✗ No server secrets               │
 *   │  ✗ No event handlers            ✓ Re-renders on state change      │
 *   │                                                                      │
 *   │  // Server Component (default — no directive needed)               │
 *   │  async function ProductList() {                                    │
 *   │    const products = await db.query('SELECT * FROM products');     │
 *   │    return <ul>{products.map(p => <li>{p.name}</li>)}</ul>;       │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // Client Component (must add "use client")                       │
 *   │  "use client";                                                      │
 *   │  function AddToCart({ productId }) {                               │
 *   │    const [count, setCount] = useState(0);                          │
 *   │    return <button onClick={() => setCount(c => c+1)}>             │
 *   │      Add ({count})                                                  │
 *   │    </button>;                                                       │
 *   │  }                                                                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Server Component: runs on server, zero JS to client, async/await');
console.log('Client Component: "use client", has hooks, events, browser APIs');
console.log('Default is Server Component — add "use client" only when needed');


// =============================================================================
// COMPOSITION PATTERN
// =============================================================================

console.log('\n=== Composition Pattern ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HOW TO MIX SERVER + CLIENT COMPONENTS                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  RULE: Client components can't import Server components            │
 *   │  BUT: Server components CAN render Client components               │
 *   │                                                                      │
 *   │  ✓ CORRECT: Pass Server Component as children                     │
 *   │  // Server Component (page.tsx)                                     │
 *   │  export default async function Page() {                            │
 *   │    const data = await fetchData(); // Server-side fetch           │
 *   │    return (                                                         │
 *   │      <ClientWrapper>                                                │
 *   │        <ServerContent data={data} /> ← Works! Passed as children │
 *   │      </ClientWrapper>                                               │
 *   │    );                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  ✗ WRONG: Import server component inside client component         │
 *   │  "use client";                                                      │
 *   │  import ServerComponent from './ServerComponent'; // ✗ Error!     │
 *   │                                                                      │
 *   │  PATTERN: Server fetches data → passes to Client for interactivity│
 *   │                                                                      │
 *   │  // Server: fetch + render layout                                   │
 *   │  // Client: handle interactions (clicks, state, forms)            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Server components CAN render client components');
console.log('Client components CANNOT import server components');
console.log('Pattern: pass server component as children to client');


// =============================================================================
// WHEN TO USE WHICH
// =============================================================================

console.log('\n=== Decision Guide ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WHEN TO USE WHICH                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  SERVER COMPONENT when:                                             │
 *   │  • Fetching data                                                    │
 *   │  • Accessing database or filesystem                                │
 *   │  • Using API keys / secrets                                        │
 *   │  • Rendering large dependencies (keep off client bundle)          │
 *   │  • No interactivity needed                                         │
 *   │                                                                      │
 *   │  CLIENT COMPONENT when:                                             │
 *   │  • Using useState, useEffect, useContext                           │
 *   │  • Event handlers (onClick, onChange)                              │
 *   │  • Browser APIs (window, navigator, localStorage)                 │
 *   │  • Custom hooks that use state/effects                            │
 *   │  • Third-party components that use hooks                          │
 *   │                                                                      │
 *   │  RULE OF THUMB:                                                     │
 *   │  Keep "use client" boundary as low as possible                    │
 *   │  Don't make the entire page a client component!                   │
 *   │  Only the interactive leaf components need "use client"           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Server: data fetch, DB, secrets, no interactivity');
console.log('Client: hooks, events, browser APIs, third-party libs');
console.log('Keep "use client" boundary as LOW in the tree as possible');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "In the App Router, components are Server Components by default — they
 * run on the server, can directly access databases and secrets, and ship
 * zero JavaScript to the client. This dramatically reduces bundle size.
 *
 * I add 'use client' only for components that need interactivity:
 * useState, useEffect, event handlers, or browser APIs. I keep the
 * client boundary as low as possible in the component tree — only the
 * interactive leaf components, not the entire page.
 *
 * The composition pattern is key: a server component can render client
 * components, but not the other way around. When I need a client wrapper
 * around server content, I pass the server component as children — this
 * way the server component renders on the server and the client component
 * hydrates around it.
 *
 * This model means most of the page renders on the server with zero JS
 * cost, and only interactive parts add to the client bundle."
 */


// RUN: node docs/32-nextjs/03-server-vs-client-components.js
