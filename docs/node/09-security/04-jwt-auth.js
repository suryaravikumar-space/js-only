/**
 * TOPIC 04: JWT Authentication Flow (DEFENSIVE Security Education)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ NEVER store secrets in the JWT payload. ALWAYS verify the signature.      ║
 * ║ JWTs are signed, NOT encrypted - anyone can READ the payload.            ║
 * ║                                                                            ║
 * ║   JWT = Header.Payload.Signature (three Base64 parts, dot-separated)     ║
 * ║   The signature proves the token wasn't tampered with.                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of JWT as a CONCERT WRISTBAND:                                      │
 * │                                                                             │
 * │  1. HEADER = The wristband material (algorithm, type)                      │
 * │     - "This is a Tyvek band using hologram security"                      │
 * │                                                                             │
 * │  2. PAYLOAD = What's printed on the band (claims)                          │
 * │     - Name, seat section, VIP status, expiry time                          │
 * │     - ANYONE can read it! It's printed in plain text.                      │
 * │                                                                             │
 * │  3. SIGNATURE = The hologram seal                                          │
 * │     - Only the venue can CREATE the hologram (secret key)                  │
 * │     - Guards VERIFY the hologram at every door                             │
 * │     - If someone changes the name, the hologram won't match → REJECTED    │
 * │                                                                             │
 * │  ACCESS TOKEN  = Day pass (short-lived, 15 min)                            │
 * │  REFRESH TOKEN = Season pass (long-lived, 7 days, get new day passes)     │
 * │                                                                             │
 * │  "A JWT is a signed note, not a locked safe."                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: JWT Authentication Flow                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Client                        Server                                     │
 * │     │                              │                                        │
 * │     │  1. POST /login              │                                        │
 * │     │  { email, password }         │                                        │
 * │     │─────────────────────────────▶│                                        │
 * │     │                              │  2. Verify credentials                 │
 * │     │                              │  3. Create JWT (sign with secret)      │
 * │     │  4. { accessToken,           │                                        │
 * │     │       refreshToken }         │                                        │
 * │     │◀─────────────────────────────│                                        │
 * │     │                              │                                        │
 * │     │  5. GET /api/data            │                                        │
 * │     │  Authorization: Bearer <jwt> │                                        │
 * │     │─────────────────────────────▶│                                        │
 * │     │                              │  6. Verify JWT signature               │
 * │     │                              │  7. Check expiry (exp claim)           │
 * │     │  8. { data }                 │                                        │
 * │     │◀─────────────────────────────│                                        │
 * │     │                              │                                        │
 * │     │  9. POST /refresh            │  (when access token expires)           │
 * │     │  { refreshToken }            │                                        │
 * │     │─────────────────────────────▶│                                        │
 * │     │                              │  10. Verify refresh token              │
 * │     │  11. { newAccessToken }      │  11. Issue new access token            │
 * │     │◀─────────────────────────────│                                        │
 * │     │                              │                                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const crypto = require('crypto');

// ============================================================================
// 1. JWT STRUCTURE - Header.Payload.Signature
// ============================================================================

console.log('=== 1. JWT Structure ===\n');

// Base64URL encoding (URL-safe variant)
const base64UrlEncode = (obj) => {
  const json = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return Buffer.from(json).toString('base64url');
};

const base64UrlDecode = (str) => {
  return JSON.parse(Buffer.from(str, 'base64url').toString());
};

const header = { alg: 'HS256', typ: 'JWT' };
const payload = {
  sub: 'user-123',
  name: 'John Doe',
  role: 'admin',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
};

console.log('A:', 'Header:', header);
console.log('B:', 'Payload:', payload);
console.log('C:', 'Header (base64url):', base64UrlEncode(header));
console.log('D:', 'Payload (base64url):', base64UrlEncode(payload));

// ============================================================================
// 2. JWT SIGNING AND CREATION
// ============================================================================

console.log('\n=== 2. JWT Signing (HMAC-SHA256) ===\n');

const JWT_SECRET = crypto.randomBytes(32).toString('hex'); // Strong secret

const createJwt = (payloadObj, secret) => {
  const headerB64 = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const payloadB64 = base64UrlEncode(payloadObj);
  const signingInput = `${headerB64}.${payloadB64}`;

  // Create HMAC-SHA256 signature
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
};

const token = createJwt(payload, JWT_SECRET);
const parts = token.split('.');

console.log('E:', 'JWT created successfully');
console.log('F:', `  Header:    ${parts[0].substring(0, 30)}...`);
console.log('G:', `  Payload:   ${parts[1].substring(0, 30)}...`);
console.log('H:', `  Signature: ${parts[2].substring(0, 30)}...`);
console.log('I:', `  Full token length: ${token.length} chars`);

// ============================================================================
// 3. JWT VERIFICATION
// ============================================================================

console.log('\n=== 3. JWT Verification ===\n');

const verifyJwt = (tokenStr, secret) => {
  const tokenParts = tokenStr.split('.');
  if (tokenParts.length !== 3) return { valid: false, error: 'Invalid token format' };

  const [headerB64, payloadB64, signatureB64] = tokenParts;

  // Recompute signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  // Timing-safe comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signatureB64);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return { valid: false, error: 'Invalid signature' };
  }

  const signatureValid = crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  if (!signatureValid) return { valid: false, error: 'Signature mismatch - token tampered!' };

  // Decode and check expiry
  const decodedPayload = base64UrlDecode(payloadB64);
  const now = Math.floor(Date.now() / 1000);

  if (decodedPayload.exp && decodedPayload.exp < now) {
    return { valid: false, error: 'Token expired', expiredAt: new Date(decodedPayload.exp * 1000) };
  }

  return { valid: true, payload: decodedPayload };
};

// Valid token
console.log('J:', 'Verify valid token:', verifyJwt(token, JWT_SECRET));

// Tampered token (changed payload)
const tamperedToken = token.split('.');
const tamperedPayload = { ...payload, role: 'superadmin' }; // Attacker changes role
tamperedToken[1] = base64UrlEncode(tamperedPayload);
const tampered = tamperedToken.join('.');
console.log('K:', 'Verify TAMPERED token:', verifyJwt(tampered, JWT_SECRET));

// Wrong secret
console.log('L:', 'Verify with WRONG secret:', verifyJwt(token, 'wrong-secret'));

// ============================================================================
// 4. ACCESS + REFRESH TOKEN PATTERN
// ============================================================================

console.log('\n=== 4. Access + Refresh Token Pattern ===\n');

// In-memory store for refresh tokens (use Redis/DB in production)
const refreshTokenStore = new Map();

const issueTokenPair = (userId, role, secret) => {
  const accessPayload = {
    sub: userId,
    role,
    type: 'access',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
  };

  const refreshPayload = {
    sub: userId,
    type: 'refresh',
    jti: crypto.randomBytes(16).toString('hex'), // Unique token ID
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 604800, // 7 days
  };

  const accessToken = createJwt(accessPayload, secret);
  const refreshToken = createJwt(refreshPayload, secret);

  // Store refresh token JTI for revocation
  refreshTokenStore.set(refreshPayload.jti, { userId, active: true });

  return { accessToken, refreshToken, refreshJti: refreshPayload.jti };
};

const tokens = issueTokenPair('user-456', 'editor', JWT_SECRET);
console.log('M:', 'Access token issued (15 min expiry)');
console.log('N:', `  Length: ${tokens.accessToken.length} chars`);
console.log('O:', 'Refresh token issued (7 day expiry)');
console.log('P:', `  JTI (for revocation): ${tokens.refreshJti}`);

// ============================================================================
// 5. TOKEN REFRESH FLOW
// ============================================================================

console.log('\n=== 5. Token Refresh Flow ===\n');

const refreshAccessToken = (refreshTokenStr, secret) => {
  // Step 1: Verify the refresh token
  const result = verifyJwt(refreshTokenStr, secret);
  if (!result.valid) return { success: false, error: result.error };

  // Step 2: Check it's a refresh token
  if (result.payload.type !== 'refresh') return { success: false, error: 'Not a refresh token' };

  // Step 3: Check if refresh token is revoked
  const stored = refreshTokenStore.get(result.payload.jti);
  if (!stored || !stored.active) return { success: false, error: 'Refresh token revoked' };

  // Step 4: Issue new access token
  const newAccessPayload = {
    sub: result.payload.sub,
    role: 'editor', // Look up from DB in real app
    type: 'access',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 900,
  };

  return { success: true, accessToken: createJwt(newAccessPayload, secret) };
};

const refreshResult = refreshAccessToken(tokens.refreshToken, JWT_SECRET);
console.log('Q:', 'Refresh with valid refresh token:', refreshResult.success);

// Try using access token as refresh token (should fail)
const wrongTypeResult = refreshAccessToken(tokens.accessToken, JWT_SECRET);
console.log('R:', 'Refresh with ACCESS token (wrong type):', wrongTypeResult);

// Revoke refresh token
refreshTokenStore.set(tokens.refreshJti, { userId: 'user-456', active: false });
const revokedResult = refreshAccessToken(tokens.refreshToken, JWT_SECRET);
console.log('S:', 'Refresh after REVOCATION:', revokedResult);

// ============================================================================
// 6. JWT MIDDLEWARE PATTERN (Conceptual)
// ============================================================================

console.log('\n=== 6. JWT Middleware Pattern ===\n');

// Simulate Express middleware
const authMiddleware = (req, secret) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return { authenticated: false, error: 'No Authorization header' };

  const headerParts = authHeader.split(' ');
  if (headerParts[0] !== 'Bearer' || !headerParts[1]) {
    return { authenticated: false, error: 'Invalid Authorization format (need: Bearer <token>)' };
  }

  const result = verifyJwt(headerParts[1], secret);
  if (!result.valid) return { authenticated: false, error: result.error };

  return { authenticated: true, user: result.payload };
};

// Simulate requests
const validReq = { headers: { authorization: `Bearer ${token}` } };
const noHeaderReq = { headers: {} };
const badFormatReq = { headers: { authorization: 'Basic abc123' } };

console.log('T:', 'Valid Bearer token:', authMiddleware(validReq, JWT_SECRET));
console.log('U:', 'No auth header:', authMiddleware(noHeaderReq, JWT_SECRET));
console.log('V:', 'Wrong format (Basic):', authMiddleware(badFormatReq, JWT_SECRET));

// ============================================================================
// 7. JWT SECURITY BEST PRACTICES
// ============================================================================

console.log('\n=== 7. JWT Security Best Practices ===\n');

const bestPractices = [
  { rule: 'Use strong secrets', detail: 'Minimum 256-bit random key, never hardcode' },
  { rule: 'Short access token expiry', detail: '15 minutes max, use refresh tokens for longer sessions' },
  { rule: 'Always verify algorithm', detail: 'Specify expected alg, reject "none" algorithm' },
  { rule: 'Never store sensitive data', detail: 'JWT payload is base64 (readable), NOT encrypted' },
  { rule: 'Use HTTPS only', detail: 'Tokens in transit must be encrypted (TLS)' },
  { rule: 'Store tokens securely', detail: 'HttpOnly cookies (not localStorage) to prevent XSS theft' },
  { rule: 'Implement token revocation', detail: 'Track JTIs in DB/Redis, check blocklist on every request' },
  { rule: 'Rotate secrets periodically', detail: 'Support multiple valid secrets during rotation window' },
];

bestPractices.forEach((practice, i) => {
  console.log(`W: ${i + 1}. ${practice.rule}: ${practice.detail}`);
});

// ============================================================================
// 8. COMMON JWT ATTACKS & DEFENSES
// ============================================================================

console.log('\n=== 8. Common JWT Attacks & Defenses ===\n');

const attacks = [
  {
    attack: 'Algorithm "none" attack',
    how: 'Attacker sets alg to "none", removes signature',
    defense: 'ALWAYS specify expected algorithm, reject "none"',
  },
  {
    attack: 'Secret brute force',
    how: 'Weak secrets can be cracked with tools like jwt-cracker',
    defense: 'Use 256+ bit random secrets (crypto.randomBytes(32))',
  },
  {
    attack: 'Token theft (XSS)',
    how: 'localStorage tokens stolen via XSS',
    defense: 'Store in HttpOnly cookies, use CSP headers',
  },
  {
    attack: 'Token replay',
    how: 'Stolen token reused before expiry',
    defense: 'Short expiry, token binding, IP/device fingerprinting',
  },
];

attacks.forEach((item) => {
  console.log(`X: Attack: ${item.attack}`);
  console.log(`Y:   How: ${item.how}`);
  console.log(`Z:   Defense: ${item.defense}\n`);
});

/**
 * OUTPUT:
 *   === 1. JWT Structure ===
 *
 *   A: Header: { alg: 'HS256', typ: 'JWT' }
 *   B: Payload: { sub: 'user-123', name: 'John Doe', role: 'admin', iat: ..., exp: ... }
 *   C: Header (base64url): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *   D: Payload (base64url): eyJzdWIiOiJ1c2VyLTEy...
 *
 *   === 2. JWT Signing (HMAC-SHA256) ===
 *
 *   E: JWT created successfully
 *   F-I: (token parts and length)
 *
 *   === 3. JWT Verification ===
 *
 *   J: Verify valid token: { valid: true, payload: { sub: 'user-123', ... } }
 *   K: Verify TAMPERED token: { valid: false, error: 'Signature mismatch - token tampered!' }
 *   L: Verify with WRONG secret: { valid: false, error: 'Invalid signature' }
 *
 *   === 4. Access + Refresh Token Pattern ===
 *
 *   M-P: (token pair details)
 *
 *   === 5. Token Refresh Flow ===
 *
 *   Q: Refresh with valid refresh token: true
 *   R: Refresh with ACCESS token: { success: false, error: 'Not a refresh token' }
 *   S: Refresh after REVOCATION: { success: false, error: 'Refresh token revoked' }
 *
 *   === 6. JWT Middleware Pattern ===
 *
 *   T: Valid Bearer token: { authenticated: true, user: { ... } }
 *   U: No auth header: { authenticated: false, error: 'No Authorization header' }
 *   V: Wrong format: { authenticated: false, error: 'Invalid Authorization format ...' }
 *
 *   === 7-8: Best practices and attack/defense patterns ===
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JWT is a stateless auth token with three Base64URL parts: header         │
 * │  (algorithm), payload (claims like user ID, role, expiry), and signature  │
 * │  (HMAC or RSA). The server signs tokens with a secret key on login, and  │
 * │  verifies the signature on every request via Bearer header. JWTs are     │
 * │  signed but NOT encrypted - never put secrets in the payload. I use a    │
 * │  dual-token pattern: short-lived access tokens (15 min) and long-lived   │
 * │  refresh tokens (7 days) with JTI tracking for revocation. Tokens are    │
 * │  stored in HttpOnly cookies to prevent XSS theft. Key defenses: strong   │
 * │  256-bit secrets, always specify the expected algorithm (block 'none'),  │
 * │  timing-safe signature comparison, and HTTPS-only transmission."         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/09-security/04-jwt-auth.js
 */
