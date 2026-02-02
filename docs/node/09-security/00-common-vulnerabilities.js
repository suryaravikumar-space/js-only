/**
 * TOPIC 00: Common Vulnerabilities (DEFENSIVE Security Education)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ NEVER trust user input. ALWAYS validate, sanitize, and escape.           ║
 * ║ Security is not a feature - it's a REQUIREMENT at every layer.           ║
 * ║                                                                            ║
 * ║   OWASP Top 10 = The 10 most critical web application security risks.    ║
 * ║   Know the attacks → Build the defenses → Ship secure code.              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of your Node.js app as a CASTLE:                                   │
 * │                                                                             │
 * │  1. FRONT GATE (Injection)                                                │
 * │     - Attackers slip poisoned messages to the guards (SQL/command inject) │
 * │     - Defense: Guards read from a SCRIPT, never obey raw messages         │
 * │                                                                             │
 * │  2. WINDOWS (XSS - Cross-Site Scripting)                                  │
 * │     - Attackers throw scrolls through windows that trick people inside    │
 * │     - Defense: Seal all windows with FILTERS (escape output)              │
 * │                                                                             │
 * │  3. SECRET TUNNELS (CSRF - Cross-Site Request Forgery)                    │
 * │     - Attackers forge royal seals to issue fake commands                   │
 * │     - Defense: Use SECRET TOKENS only the real king knows                 │
 * │                                                                             │
 * │  4. BROKEN WALLS (Auth Bypass)                                            │
 * │     - Crumbling walls let anyone walk in without ID                       │
 * │     - Defense: REINFORCE every wall, check ID at every door               │
 * │                                                                             │
 * │  "A castle is only as strong as its weakest wall."                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Attack Vectors                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │                        ┌─────────────┐                                     │
 * │                        │  ATTACKER   │                                     │
 * │                        └──────┬──────┘                                     │
 * │              ┌────────────────┼────────────────┐                           │
 * │              ▼                ▼                ▼                           │
 * │     ┌────────────┐   ┌──────────────┐  ┌────────────┐                    │
 * │     │ INJECTION  │   │     XSS      │  │   CSRF     │                    │
 * │     │ sql/cmd/   │   │ stored/      │  │ forged     │                    │
 * │     │ code       │   │ reflected    │  │ requests   │                    │
 * │     └─────┬──────┘   └──────┬───────┘  └─────┬──────┘                    │
 * │           ▼                 ▼                 ▼                           │
 * │     ┌─────────────────────────────────────────────┐                       │
 * │     │           YOUR NODE.JS APP                   │                       │
 * │     │  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │                       │
 * │     │  │ Routes  │ │ Database │ │ User Sessions│ │                       │
 * │     │  └─────────┘ └──────────┘ └──────────────┘ │                       │
 * │     └─────────────────────────────────────────────┘                       │
 * │                                                                             │
 * │   DEFENSE LAYERS:                                                          │
 * │   ┌──────────┐ ┌───────────┐ ┌────────────┐ ┌──────────┐                │
 * │   │ Validate │→│ Sanitize  │→│ Parameterize│→│  Escape  │                │
 * │   │  Input   │ │   Data    │ │  Queries    │ │  Output  │                │
 * │   └──────────┘ └───────────┘ └────────────┘ └──────────┘                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const crypto = require('crypto');

// ============================================================================
// 1. SQL INJECTION - Understanding and Prevention
// ============================================================================

console.log('=== 1. SQL INJECTION (Conceptual Demo) ===\n');

// VULNERABLE pattern (NEVER do this):
const vulnerableSqlQuery = (userInput) => {
  // This concatenates raw user input - DANGEROUS
  const query = `SELECT * FROM users WHERE name = '${userInput}'`;
  return query;
};

// What an attacker could send:
const maliciousInput = "'; DROP TABLE users; --";
console.log('A:', 'VULNERABLE query with malicious input:');
console.log('B:', vulnerableSqlQuery(maliciousInput));
console.log('C:', '^^^ This would DELETE the entire users table!\n');

// SAFE pattern - Parameterized queries (conceptual):
const safeSqlQuery = (userInput) => {
  // In real code, use your DB driver's parameterized queries
  // e.g., db.query('SELECT * FROM users WHERE name = ?', [userInput])
  const escaped = userInput.replace(/'/g, "''").replace(/;/g, '').replace(/--/g, '');
  return { query: 'SELECT * FROM users WHERE name = ?', params: [userInput], escaped };
};

const safeResult = safeSqlQuery(maliciousInput);
console.log('D:', 'SAFE parameterized query:');
console.log('E:', `  Query template: ${safeResult.query}`);
console.log('F:', `  Params (treated as DATA, not code): ${JSON.stringify(safeResult.params)}`);

// ============================================================================
// 2. XSS (Cross-Site Scripting) - Understanding and Prevention
// ============================================================================

console.log('\n=== 2. XSS - Cross-Site Scripting ===\n');

// Function to ESCAPE HTML (defense against XSS)
const escapeHtml = (str) => {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return String(str).replace(/[&<>"'/]/g, (char) => escapeMap[char]);
};

const xssAttempt = '<script>alert("hacked")</script>';

console.log('G:', 'Malicious input:', xssAttempt);
console.log('H:', 'After escapeHtml:', escapeHtml(xssAttempt));
console.log('I:', 'The script tags are now HARMLESS text, not executable code.\n');

// Stored XSS example - always escape before rendering
const userComment = { user: 'attacker', text: '<img src=x onerror=alert(1)>' };
const safeComment = { user: escapeHtml(userComment.user), text: escapeHtml(userComment.text) };
console.log('J:', 'Unsafe comment:', userComment.text);
console.log('K:', 'Safe comment:  ', safeComment.text);

// ============================================================================
// 3. CSRF (Cross-Site Request Forgery) - Understanding and Prevention
// ============================================================================

console.log('\n=== 3. CSRF - Cross-Site Request Forgery ===\n');

// CSRF Token generation and validation
const generateCsrfToken = () => crypto.randomBytes(32).toString('hex');

const csrfTokenStore = new Map(); // In real apps, store per-session

const createSession = (sessionId) => {
  const token = generateCsrfToken();
  csrfTokenStore.set(sessionId, token);
  return token;
};

const validateCsrfToken = (sessionId, submittedToken) => {
  const storedToken = csrfTokenStore.get(sessionId);
  if (!storedToken) return false;
  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(storedToken, 'hex'),
    Buffer.from(submittedToken, 'hex')
  );
};

const sessionId = 'user-session-123';
const csrfToken = createSession(sessionId);
console.log('L:', `CSRF token generated: ${csrfToken.substring(0, 16)}...`);
console.log('M:', `Valid token check: ${validateCsrfToken(sessionId, csrfToken)}`);
console.log('N:', `Forged token check: ${validateCsrfToken(sessionId, generateCsrfToken())}`);

// ============================================================================
// 4. COMMAND INJECTION - Understanding and Prevention
// ============================================================================

console.log('\n=== 4. COMMAND INJECTION ===\n');

// VULNERABLE pattern (NEVER do this):
const vulnerableCommand = (filename) => {
  // exec with string concatenation is DANGEROUS
  return `exec("ls -la ${filename}")`;
};

const maliciousFilename = 'file.txt; rm -rf /';
console.log('O:', 'VULNERABLE command:', vulnerableCommand(maliciousFilename));
console.log('P:', '^^^ This would delete everything on the system!\n');

// SAFE pattern - validate input and use execFile (not exec)
const safeFilenamePattern = /^[a-zA-Z0-9._-]+$/;

const safeCommand = (filename) => {
  if (!safeFilenamePattern.test(filename)) {
    return { safe: false, error: 'Invalid filename - contains dangerous characters' };
  }
  // execFile with arguments array prevents injection
  return { safe: true, command: 'execFile("ls", ["-la", filename])' };
};

console.log('Q:', 'Safe check on malicious input:', safeCommand(maliciousFilename));
console.log('R:', 'Safe check on valid input:', safeCommand('report.txt'));

// ============================================================================
// 5. AUTH BYPASS - Understanding and Prevention
// ============================================================================

console.log('\n=== 5. AUTH BYPASS Prevention ===\n');

// VULNERABLE: comparison operator issues
const vulnerableAuth = (inputPassword, storedHash) => {
  // Using == allows type coercion exploits
  return inputPassword == storedHash; // eslint-disable-line eqeqeq
};

// SAFE: proper password hashing with timing-safe comparison
const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
};

const verifyPassword = (inputPassword, storedHash, salt) => {
  const inputHash = hashPassword(inputPassword, salt);
  // Timing-safe comparison prevents timing attacks
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(storedHash));
};

const salt = crypto.randomBytes(16).toString('hex');
const storedHash = hashPassword('mySecurePassword123', salt);

console.log('S:', `Password hashed with PBKDF2 (salt: ${salt.substring(0, 8)}...)`);
console.log('T:', `Hash: ${storedHash.substring(0, 32)}...`);
console.log('U:', `Correct password: ${verifyPassword('mySecurePassword123', storedHash, salt)}`);
console.log('V:', `Wrong password: ${verifyPassword('wrongPassword', storedHash, salt)}`);

// ============================================================================
// 6. OWASP TOP 10 Summary for Node.js
// ============================================================================

console.log('\n=== 6. OWASP TOP 10 CHEATSHEET ===\n');

const owaspTop10 = [
  { rank: 'A01', name: 'Broken Access Control', fix: 'Check permissions on EVERY route' },
  { rank: 'A02', name: 'Cryptographic Failures', fix: 'Use strong hashing (bcrypt/PBKDF2), HTTPS' },
  { rank: 'A03', name: 'Injection', fix: 'Parameterized queries, input validation' },
  { rank: 'A04', name: 'Insecure Design', fix: 'Threat modeling, secure design patterns' },
  { rank: 'A05', name: 'Security Misconfiguration', fix: 'Helmet.js, disable debug in prod' },
  { rank: 'A06', name: 'Vulnerable Components', fix: 'npm audit, keep dependencies updated' },
  { rank: 'A07', name: 'Auth Failures', fix: 'MFA, strong passwords, session management' },
  { rank: 'A08', name: 'Data Integrity Failures', fix: 'Verify signatures, secure CI/CD' },
  { rank: 'A09', name: 'Logging Failures', fix: 'Log security events, monitor anomalies' },
  { rank: 'A10', name: 'SSRF', fix: 'Validate URLs, allowlist destinations' },
];

owaspTop10.forEach((item) => {
  console.log(`W: ${item.rank}: ${item.name} → ${item.fix}`);
});

/**
 * OUTPUT:
 *   === 1. SQL INJECTION (Conceptual Demo) ===
 *
 *   A: VULNERABLE query with malicious input:
 *   B: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
 *   C: ^^^ This would DELETE the entire users table!
 *
 *   D: SAFE parameterized query:
 *   E:   Query template: SELECT * FROM users WHERE name = ?
 *   F:   Params (treated as DATA, not code): ["'; DROP TABLE users; --"]
 *
 *   === 2. XSS - Cross-Site Scripting ===
 *
 *   G: Malicious input: <script>alert("hacked")</script>
 *   H: After escapeHtml: &lt;script&gt;alert(&quot;hacked&quot;)&lt;&#x2F;script&gt;
 *   I: The script tags are now HARMLESS text, not executable code.
 *
 *   J: Unsafe comment: <img src=x onerror=alert(1)>
 *   K: Safe comment:   &lt;img src=x onerror=alert(1)&gt;
 *
 *   === 3. CSRF - Cross-Site Request Forgery ===
 *
 *   L: CSRF token generated: a1b2c3d4e5f6...
 *   M: Valid token check: true
 *   N: Forged token check: false
 *
 *   === 4. COMMAND INJECTION ===
 *
 *   O: VULNERABLE command: exec("ls -la file.txt; rm -rf /")
 *   P: ^^^ This would delete everything on the system!
 *
 *   Q: Safe check on malicious input: { safe: false, error: '...' }
 *   R: Safe check on valid input: { safe: true, command: '...' }
 *
 *   === 5. AUTH BYPASS Prevention ===
 *
 *   S: Password hashed with PBKDF2 (salt: a1b2c3d4...)
 *   T: Hash: 9f86d081884c7d659a2feaa0...
 *   U: Correct password: true
 *   V: Wrong password: false
 *
 *   === 6. OWASP TOP 10 CHEATSHEET ===
 *
 *   W: A01: Broken Access Control → Check permissions on EVERY route
 *   W: A02: Cryptographic Failures → Use strong hashing, HTTPS
 *   ... (all 10 items)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The most common Node.js vulnerabilities are Injection (SQL, command),     │
 * │  XSS, CSRF, and broken authentication. Defense follows layers: validate   │
 * │  all input, use parameterized queries (never concatenate), escape output   │
 * │  for XSS, use CSRF tokens with timing-safe comparison, hash passwords     │
 * │  with PBKDF2/bcrypt, and follow the OWASP Top 10 checklist. Security is   │
 * │  never a single fix - it's defense in depth at every layer."              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/09-security/00-common-vulnerabilities.js
 */
