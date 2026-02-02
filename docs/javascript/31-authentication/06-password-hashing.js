/**
 * AUTHENTICATION: 06 - Password Hashing
 *
 * ONE CONCEPT: Never store plain passwords — hash with bcrypt/argon2
 */


// =============================================================================
// WHY HASH PASSWORDS
// =============================================================================

console.log('=== Password Hashing ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WHY HASH?                                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Database gets breached (it happens):                              │
 *   │                                                                      │
 *   │  PLAINTEXT:     password123        → Attacker sees password!      │
 *   │  MD5:           482c811da5d5b4bc   → Rainbow table → cracked!    │
 *   │  SHA256:        ef92b778baf...     → Rainbow table → cracked!    │
 *   │  SHA256 + salt: a1f2b3c4d5...     → Better, but too fast         │
 *   │  bcrypt:        $2b$10$abc...      → Slow by design → SAFE       │
 *   │                                                                      │
 *   │  HASHING:                                                           │
 *   │  • One-way: can't reverse hash → password                         │
 *   │  • Deterministic: same input → same output                        │
 *   │  • Salt: random data added to prevent rainbow tables              │
 *   │  • Cost factor: makes hashing intentionally slow                  │
 *   │                                                                      │
 *   │  bcrypt("password123", salt, cost=10):                             │
 *   │  $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy   │
 *   │  ───── ── ──────────────────────── ──────────────────────────────  │
 *   │  algo  cost     salt (22 chars)          hash (31 chars)          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Never plaintext, never MD5/SHA256 alone');
console.log('bcrypt: includes salt + cost factor (slow by design)');
console.log('Slow = hard to brute force');


// =============================================================================
// BCRYPT USAGE
// =============================================================================

console.log('\n=== bcrypt Pattern ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BCRYPT USAGE                                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Registration (hash + store)                                     │
 *   │  const bcrypt = require('bcrypt');                                  │
 *   │  const saltRounds = 12;                                             │
 *   │  const hash = await bcrypt.hash(password, saltRounds);            │
 *   │  // Store hash in database (NOT the password!)                    │
 *   │                                                                      │
 *   │  // Login (compare)                                                 │
 *   │  const match = await bcrypt.compare(password, storedHash);        │
 *   │  if (match) { /* valid login */ }                                  │
 *   │                                                                      │
 *   │  SALT ROUNDS:                                                       │
 *   │  10 = ~100ms (minimum recommended)                                 │
 *   │  12 = ~400ms (good default)                                        │
 *   │  14 = ~1.5s  (high security)                                      │
 *   │  Each +1 doubles the time                                          │
 *   │                                                                      │
 *   │  ALTERNATIVES:                                                      │
 *   │  Argon2 — newer, memory-hard (resists GPU attacks)                │
 *   │  scrypt — memory-hard, used by some systems                       │
 *   │  bcrypt is still widely used and secure                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Hash:    bcrypt.hash(password, 12) → store hash');
console.log('Verify:  bcrypt.compare(password, hash) → true/false');
console.log('Salt rounds 12 = ~400ms (good default)');
console.log('Argon2 = newer alternative (memory-hard)');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "I never store passwords in plaintext. I use bcrypt which includes a
 * random salt (prevents rainbow table attacks) and a configurable cost
 * factor that makes hashing intentionally slow — around 400ms at cost
 * factor 12. This means an attacker who gets the database can only try
 * about 2-3 passwords per second per hash, making brute force impractical.
 *
 * bcrypt stores everything in one string: the algorithm, cost factor,
 * salt, and hash. To verify, I use bcrypt.compare() which extracts the
 * salt and cost, hashes the input the same way, and compares.
 *
 * For new systems, I'd also consider Argon2 which is memory-hard —
 * it requires a lot of RAM to compute, which makes GPU-based attacks
 * much harder since GPUs have limited memory per core. But bcrypt
 * remains widely used and secure."
 */


// RUN: node docs/31-authentication/06-password-hashing.js
