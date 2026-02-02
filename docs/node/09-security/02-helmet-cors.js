/**
 * TOPIC 02: Helmet Middleware & CORS Setup (DEFENSIVE Security Education)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Set security headers on EVERY response. Helmet does 11+ headers for you. ║
 * ║ CORS controls WHO can call your API - default to DENY, then allowlist.   ║
 * ║                                                                            ║
 * ║   Helmet = armor for HTTP headers.                                        ║
 * ║   CORS   = bouncer checking the guest list.                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of your server as a NIGHTCLUB:                                      │
 * │                                                                             │
 * │  1. HELMET = The Dress Code Enforcer                                       │
 * │     - Every guest leaving gets a SAFETY BADGE (security headers)           │
 * │     - Badge says: "No sneaking scripts (CSP), no framing me (X-Frame),    │
 * │       don't sniff my type (X-Content-Type), use HTTPS (HSTS)"            │
 * │     - Without badges, guests are EXPOSED to pickpockets                   │
 * │                                                                             │
 * │  2. CORS = The Bouncer with a Guest List                                   │
 * │     - Only people from APPROVED addresses can enter                        │
 * │     - Bouncer checks: "Where are you from?" (Origin header)               │
 * │     - Unknown origin? DENIED at the door.                                  │
 * │     - VIP preflight: "Can I bring special items?" (OPTIONS request)        │
 * │                                                                             │
 * │  "Helmet dresses your responses. CORS checks your visitors."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Helmet & CORS in Request Lifecycle                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Browser (origin: https://myapp.com)                                      │
 * │       │                                                                     │
 * │       │  request                                                            │
 * │       ▼                                                                     │
 * │   ┌────────────────────────────────────────────┐                           │
 * │   │           EXPRESS SERVER                     │                           │
 * │   │                                              │                           │
 * │   │   ┌──────────┐    ┌───────────────────┐    │                           │
 * │   │   │  CORS    │───▶│  Is origin in     │    │                           │
 * │   │   │ middleware│    │  allowlist?        │    │                           │
 * │   │   └──────────┘    └────┬──────────┬───┘    │                           │
 * │   │                    YES ▼          ▼ NO     │                           │
 * │   │               ┌──────────┐  ┌─────────┐   │                           │
 * │   │               │ Continue │  │ BLOCK   │   │                           │
 * │   │               └────┬─────┘  │ request │   │                           │
 * │   │                    ▼        └─────────┘   │                           │
 * │   │              ┌──────────┐                  │                           │
 * │   │              │  HELMET  │  Adds headers:   │                           │
 * │   │              │ middleware│  X-Frame-Options │                           │
 * │   │              └────┬─────┘  CSP, HSTS, etc. │                           │
 * │   │                   ▼                         │                           │
 * │   │              ┌──────────┐                  │                           │
 * │   │              │  Route   │                  │                           │
 * │   │              │ handler  │                  │                           │
 * │   │              └──────────┘                  │                           │
 * │   └────────────────────────────────────────────┘                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// 1. HELMET - Security Headers (Simulated without express dependency)
// ============================================================================

console.log('=== 1. HELMET - Security Headers Explained ===\n');

// Simulate what Helmet sets on every response
const helmetHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'",
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'SAMEORIGIN',
  'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
  'X-Download-Options': 'noopen',
  'X-Content-Type-Options': 'nosniff',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Referrer-Policy': 'no-referrer',
  'X-XSS-Protection': '0',
};

console.log('A:', 'Helmet sets these headers on EVERY response:');
Object.entries(helmetHeaders).forEach(([header, value]) => {
  console.log(`B:   ${header}: ${value}`);
});

// What each header prevents
console.log('\nC:', 'What each key header PREVENTS:');
const headerExplanations = [
  { header: 'Content-Security-Policy', prevents: 'XSS - controls where scripts/styles load from' },
  { header: 'X-Frame-Options', prevents: 'Clickjacking - prevents page from being embedded in iframe' },
  { header: 'Strict-Transport-Security', prevents: 'Downgrade attacks - forces HTTPS for future visits' },
  { header: 'X-Content-Type-Options', prevents: 'MIME sniffing - browser trusts declared Content-Type' },
  { header: 'Referrer-Policy', prevents: 'URL leakage - controls Referer header sent to other sites' },
];

headerExplanations.forEach((item) => {
  console.log(`D:   ${item.header} → ${item.prevents}`);
});

// ============================================================================
// 2. HELMET USAGE PATTERN (conceptual Express code)
// ============================================================================

console.log('\n=== 2. HELMET USAGE PATTERN ===\n');

// Simulating how you'd configure Helmet in Express
const helmetConfig = {
  // Default: enables all protections
  default: 'app.use(helmet())',

  // Custom CSP configuration
  customCSP: `app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted-cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.mysite.com"],
      }
    }
  }))`,

  // Disable specific middleware
  partial: `app.use(helmet({
    contentSecurityPolicy: false,  // disable CSP if using custom
    crossOriginEmbedderPolicy: false
  }))`,
};

console.log('E:', 'Basic Helmet setup:');
console.log(`F:   ${helmetConfig.default}`);
console.log('\nG:', 'Custom CSP (Content-Security-Policy):');
console.log(`H:   ${helmetConfig.customCSP}`);
console.log('\nI:', 'Partial Helmet (disable specific headers):');
console.log(`J:   ${helmetConfig.partial}`);

// ============================================================================
// 3. CORS - Cross-Origin Resource Sharing
// ============================================================================

console.log('\n=== 3. CORS - Cross-Origin Resource Sharing ===\n');

// Simulate CORS checking
const corsAllowlist = ['https://myapp.com', 'https://admin.myapp.com'];

const checkCors = (origin) => {
  if (!origin) return { allowed: true, reason: 'No origin (same-origin or server-to-server)' };
  if (corsAllowlist.includes(origin)) return { allowed: true, reason: 'Origin in allowlist' };
  return { allowed: false, reason: `Origin "${origin}" NOT in allowlist` };
};

console.log('K:', 'CORS Allowlist:', corsAllowlist);
console.log('L:', 'Check https://myapp.com:', checkCors('https://myapp.com'));
console.log('M:', 'Check https://evil.com:', checkCors('https://evil.com'));
console.log('N:', 'Check no origin (curl):', checkCors(undefined));

// ============================================================================
// 4. CORS PREFLIGHT - OPTIONS Request
// ============================================================================

console.log('\n=== 4. CORS PREFLIGHT (OPTIONS Request) ===\n');

// Browser sends preflight for non-simple requests
const preflightResponse = (requestMethod, requestHeaders) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  const allowedHeaders = ['Content-Type', 'Authorization'];

  const methodOk = allowedMethods.includes(requestMethod);
  const headersOk = requestHeaders.every((h) => allowedHeaders.includes(h));

  return {
    'Access-Control-Allow-Methods': allowedMethods.join(', '),
    'Access-Control-Allow-Headers': allowedHeaders.join(', '),
    'Access-Control-Max-Age': '86400',
    methodAllowed: methodOk,
    headersAllowed: headersOk,
    decision: methodOk && headersOk ? 'ALLOW preflight' : 'DENY preflight',
  };
};

console.log('O:', 'Preflight for PUT with Authorization:');
console.log('P:', preflightResponse('PUT', ['Authorization']));
console.log('\nQ:', 'Preflight for PATCH (not allowed):');
console.log('R:', preflightResponse('PATCH', ['Authorization']));

// ============================================================================
// 5. CORS CONFIGURATION PATTERNS
// ============================================================================

console.log('\n=== 5. CORS Configuration Patterns ===\n');

const corsPatterns = {
  // Pattern 1: Simple allowlist
  simple: `app.use(cors({ origin: ['https://myapp.com', 'https://admin.myapp.com'] }))`,

  // Pattern 2: Dynamic origin check
  dynamic: `app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowlist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    }
  }))`,

  // Pattern 3: Credentials (cookies/auth headers)
  withCredentials: `app.use(cors({
    origin: 'https://myapp.com',
    credentials: true,           // Allow cookies
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400                // Cache preflight for 24 hours
  }))`,

  // DANGEROUS: Never do this in production
  dangerous: `app.use(cors({ origin: '*' }))  // DANGER: allows ANY origin!`,
};

console.log('S:', 'Pattern 1 - Simple allowlist:');
console.log(`T:   ${corsPatterns.simple}`);
console.log('\nU:', 'Pattern 2 - Dynamic origin check:');
console.log(`V:   ${corsPatterns.dynamic}`);
console.log('\nW:', 'Pattern 3 - With credentials:');
console.log(`X:   ${corsPatterns.withCredentials}`);
console.log('\nY:', 'DANGEROUS pattern (never in production):');
console.log(`Z:   ${corsPatterns.dangerous}`);

// ============================================================================
// 6. SECURITY HEADERS AUDIT
// ============================================================================

console.log('\n=== 6. Security Headers Audit Checklist ===\n');

const auditHeaders = (responseHeaders) => {
  const required = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'Referrer-Policy',
  ];

  const results = required.map((header) => ({
    header,
    present: header in responseHeaders,
    status: header in responseHeaders ? 'PASS' : 'FAIL',
  }));

  const score = results.filter((r) => r.present).length;
  return { results, score, total: required.length, grade: score === required.length ? 'A+' : score >= 3 ? 'B' : 'F' };
};

// Audit a response WITH Helmet
const withHelmet = auditHeaders(helmetHeaders);
console.log('AA:', 'Audit WITH Helmet:');
withHelmet.results.forEach((r) => console.log(`AB:   [${r.status}] ${r.header}`));
console.log(`AC:   Grade: ${withHelmet.grade} (${withHelmet.score}/${withHelmet.total})`);

// Audit a response WITHOUT Helmet
const withoutHelmet = auditHeaders({ 'Content-Type': 'text/html' });
console.log('\nAD:', 'Audit WITHOUT Helmet:');
withoutHelmet.results.forEach((r) => console.log(`AE:   [${r.status}] ${r.header}`));
console.log(`AF:   Grade: ${withoutHelmet.grade} (${withoutHelmet.score}/${withoutHelmet.total})`);

/**
 * OUTPUT:
 *   === 1. HELMET - Security Headers Explained ===
 *
 *   A: Helmet sets these headers on EVERY response:
 *   B:   Content-Security-Policy: default-src 'self'; script-src 'self'; ...
 *   B:   X-Frame-Options: SAMEORIGIN
 *   B:   Strict-Transport-Security: max-age=15552000; includeSubDomains
 *   ... (all 12 headers)
 *
 *   C: What each key header PREVENTS:
 *   D:   Content-Security-Policy → XSS - controls where scripts/styles load from
 *   D:   X-Frame-Options → Clickjacking - prevents iframe embedding
 *   ... (all 5 explanations)
 *
 *   === 2. HELMET USAGE PATTERN ===
 *
 *   E: Basic Helmet setup:
 *   F:   app.use(helmet())
 *   G: Custom CSP ...
 *   ... (config patterns)
 *
 *   === 3. CORS - Cross-Origin Resource Sharing ===
 *
 *   K: CORS Allowlist: [ 'https://myapp.com', 'https://admin.myapp.com' ]
 *   L: Check https://myapp.com: { allowed: true, reason: 'Origin in allowlist' }
 *   M: Check https://evil.com: { allowed: false, reason: 'Origin "https://evil.com" NOT in allowlist' }
 *   N: Check no origin (curl): { allowed: true, reason: 'No origin ...' }
 *
 *   === 4. CORS PREFLIGHT (OPTIONS Request) ===
 *
 *   O: Preflight for PUT with Authorization:
 *   P: { ..., decision: 'ALLOW preflight' }
 *   Q: Preflight for PATCH (not allowed):
 *   R: { ..., decision: 'DENY preflight' }
 *
 *   === 5. CORS Configuration Patterns ===
 *
 *   S-Z: (various CORS config patterns shown)
 *
 *   === 6. Security Headers Audit Checklist ===
 *
 *   AA: Audit WITH Helmet:
 *   AB:   [PASS] Content-Security-Policy
 *   AB:   [PASS] X-Frame-Options
 *   ... all PASS, Grade: A+
 *
 *   AD: Audit WITHOUT Helmet:
 *   AE:   [FAIL] Content-Security-Policy
 *   ... all FAIL, Grade: F
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Helmet is Express middleware that sets 11+ HTTP security headers with a   │
 * │  single line: app.use(helmet()). It prevents clickjacking (X-Frame),      │
 * │  MIME sniffing (X-Content-Type), enforces HTTPS (HSTS), and sets Content  │
 * │  Security Policy to block XSS. CORS controls which origins can call your  │
 * │  API - you define an allowlist of trusted domains, and the middleware      │
 * │  checks the Origin header. For non-simple requests (PUT, DELETE, custom   │
 * │  headers), the browser sends a preflight OPTIONS request first. Always    │
 * │  use credentials:true with a specific origin (never '*') when cookies     │
 * │  are involved. Together, Helmet and CORS form the first defense layer."   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/09-security/02-helmet-cors.js
 */
