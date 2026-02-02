/**
 * TOPIC: Dynamic Routes — Params, useParams, useSearchParams
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Route params (:id) capture dynamic URL segments.     ║
 * ║  Search params (?key=val) capture query strings.      ║
 * ║  Both let one route handle many different URLs.       ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Route params = room number in a hotel (/room/204).    │
 * │ Search params = room preferences (?view=ocean&floor=2)│
 * │ The hotel (route) is the same, the room varies.       │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  /user/:id        → useParams() → { id: '42' }       │
 * │  /search?q=react  → useSearchParams() → q = 'react'  │
 * │                                                       │
 * │  /blog/:slug      → { slug: 'my-post' }              │
 * │  /shop/:cat/:id   → { cat: 'shoes', id: '99' }      │
 * └───────────────────────────────────────────────────────┘
 */

// --- Simulate URL param parsing ---

function matchParams(pattern, url) {
  const patternParts = pattern.split('/');
  const urlParts = url.split('?')[0].split('/');
  if (patternParts.length !== urlParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = urlParts[i];
    } else if (patternParts[i] !== urlParts[i]) {
      return null;
    }
  }
  return params;
}

// --- Simulate useSearchParams ---
function parseSearchParams(url) {
  const qIndex = url.indexOf('?');
  if (qIndex === -1) return {};
  const qs = url.slice(qIndex + 1);
  const params = {};
  qs.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    params[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return params;
}

// --- Demo 1: Single param ---
console.log('A: Single param — /user/:id');
const p1 = matchParams('/user/:id', '/user/42');
console.log(`   useParams() = ${JSON.stringify(p1)}`);

// --- Demo 2: Multiple params ---
console.log('B: Multiple params — /shop/:category/:id');
const p2 = matchParams('/shop/:category/:id', '/shop/shoes/99');
console.log(`   useParams() = ${JSON.stringify(p2)}`);

// --- Demo 3: Search params ---
console.log('C: Search params — /search?q=react&page=2');
const sp = parseSearchParams('/search?q=react&page=2');
console.log(`   useSearchParams() = ${JSON.stringify(sp)}`);

// --- Demo 4: Combined params + search params ---
console.log('D: Combined — /user/42?tab=posts&sort=new');
const p4 = matchParams('/user/:id', '/user/42?tab=posts&sort=new');
const sp4 = parseSearchParams('/user/42?tab=posts&sort=new');
console.log(`   params = ${JSON.stringify(p4)}, search = ${JSON.stringify(sp4)}`);

// --- Demo 5: Route component using params ---
console.log('\nE: Component using params:');

function UserProfile(url) {
  const params = matchParams('/user/:id', url);
  const search = parseSearchParams(url);
  console.log(`  // React: const { id } = useParams();`);
  console.log(`  // React: const [searchParams] = useSearchParams();`);
  console.log(`  Render: User #${params.id}, tab=${search.tab || 'default'}`);
}
UserProfile('/user/7?tab=settings');

// --- Demo 6: No match ---
console.log('\nF: No match:');
const p6 = matchParams('/user/:id', '/about');
console.log(`   matchParams("/user/:id", "/about") = ${p6}`);

// --- Optional params concept ---
console.log('\nG: Optional params (React Router v6 uses ? suffix):');
console.log('   Route: /blog/:slug?  matches /blog AND /blog/my-post');
console.log('   In our sim: handle with separate routes or default');

/**
 * OUTPUT:
 * A: Single param — /user/:id
 *    useParams() = {"id":"42"}
 * B: Multiple params — /shop/:category/:id
 *    useParams() = {"category":"shoes","id":"99"}
 * C: Search params — /search?q=react&page=2
 *    useSearchParams() = {"q":"react","page":"2"}
 * D: Combined — /user/42?tab=posts&sort=new
 *    params = {"id":"42"}, search = {"tab":"posts","sort":"new"}
 * E: Component using params:
 *    Render: User #7, tab=settings
 * F: No match:
 *    matchParams("/user/:id", "/about") = null
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Route params (:id) capture URL segments — read with   │
 * │ useParams(). Search params (?q=x) capture query       │
 * │ strings — read with useSearchParams(). Params are     │
 * │ strings; parse to numbers when needed.                │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/08-react-router/01-dynamic-routes.js
 */
