/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT SECURITY - Interview Questions & Answers
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 50+ commonly asked security interview questions with comprehensive answers.
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           JAVASCRIPT SECURITY - INTERVIEW Q&A");
console.log("═══════════════════════════════════════════════════════════════\n");

const interviewQuestions = [
    // ========================================================================
    // XSS QUESTIONS
    // ========================================================================
    {
        category: "XSS",
        question: "What is XSS and what are its types?",
        answer: `
XSS (Cross-Site Scripting) is a vulnerability that allows attackers to inject
malicious scripts into web pages viewed by other users.

THREE TYPES:
1. Stored XSS (Persistent)
   - Malicious script stored in database
   - Affects all users who view the page
   - Example: Comment with <script> tag saved to DB

2. Reflected XSS (Non-Persistent)
   - Script injected via URL parameter
   - Requires victim to click malicious link
   - Example: search?q=<script>alert('XSS')</script>

3. DOM-based XSS
   - Client-side JavaScript processes malicious input
   - Server never sees the attack
   - Example: document.innerHTML = location.hash
        `
    },
    {
        category: "XSS",
        question: "How do you prevent XSS attacks?",
        answer: `
DEFENSE IN DEPTH:

1. Output Encoding
   - HTML context: Encode < > & " '
   - JavaScript context: Use \\xHH encoding
   - URL context: Use encodeURIComponent()

2. Content Security Policy (CSP)
   - Block inline scripts: script-src 'self'
   - Restrict allowed sources
   - Report violations

3. Use Safe APIs
   - textContent instead of innerHTML
   - createElement() + appendChild()

4. Input Validation
   - Whitelist allowed characters
   - Reject unexpected input

5. Libraries
   - DOMPurify for HTML sanitization
   - Framework auto-escaping (React, Vue)

6. HttpOnly Cookies
   - Prevent JavaScript access to session cookies
        `
    },
    {
        category: "XSS",
        question: "What is the difference between innerHTML and textContent?",
        answer: `
innerHTML:
- Parses content as HTML
- Executes scripts and event handlers
- VULNERABLE to XSS

element.innerHTML = userInput;  // DANGEROUS!
// If userInput = "<img onerror='alert(1)' src=x>"
// Script executes!

textContent:
- Treats content as plain text
- Does NOT parse HTML
- SAFE from XSS

element.textContent = userInput;  // SAFE
// If userInput = "<script>alert(1)</script>"
// Displays literally: <script>alert(1)</script>

RULE: Always use textContent for user-provided text.
Use innerHTML only with sanitized content (DOMPurify).
        `
    },
    {
        category: "XSS",
        question: "What is Content Security Policy (CSP)?",
        answer: `
CSP is an HTTP header that tells browsers which content sources are trusted.

Content-Security-Policy:
    default-src 'self';
    script-src 'self' https://cdn.example.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://api.example.com;

KEY DIRECTIVES:
- default-src: Fallback for other directives
- script-src: JavaScript sources
- style-src: CSS sources
- img-src: Image sources
- connect-src: fetch/XHR/WebSocket destinations
- frame-ancestors: Prevents clickjacking

SPECIAL KEYWORDS:
- 'self': Same origin only
- 'none': Block everything
- 'nonce-xxx': Allow specific inline scripts
- 'strict-dynamic': Trust loaded scripts

CSP BENEFITS:
- Blocks inline scripts (XSS prevention)
- Restricts external resources
- Reports violations for monitoring
        `
    },

    // ========================================================================
    // CSRF QUESTIONS
    // ========================================================================
    {
        category: "CSRF",
        question: "What is CSRF and how does it work?",
        answer: `
CSRF (Cross-Site Request Forgery) tricks authenticated users into performing
unwanted actions on a trusted site.

ATTACK FLOW:
1. Victim logs into bank.com (gets session cookie)
2. Victim visits evil.com
3. Evil.com contains: <form action="bank.com/transfer">
4. Form auto-submits (cookie sent automatically)
5. Bank.com processes request (victim's money stolen)

WHY IT WORKS:
- Browsers automatically send cookies
- Server can't distinguish legitimate vs forged requests

REQUIREMENTS FOR CSRF:
- Victim is authenticated (has session)
- Predictable request parameters
- No additional verification
        `
    },
    {
        category: "CSRF",
        question: "What are the methods to prevent CSRF?",
        answer: `
1. CSRF TOKENS (Synchronizer Token Pattern)
   - Server generates unique token per session
   - Token included in forms as hidden field
   - Server validates token on submission

2. DOUBLE SUBMIT COOKIE
   - Token in cookie AND request header
   - Server compares both values
   - Attacker can't read cross-origin cookies

3. SAMESITE COOKIE ATTRIBUTE
   - SameSite=Strict: Never send cross-site
   - SameSite=Lax: Send only for top-level navigations
   - Prevents cookies in cross-origin requests

4. CUSTOM REQUEST HEADERS
   - Require X-Requested-With header
   - Cross-origin requests can't set custom headers

5. ORIGIN/REFERER VALIDATION
   - Check Origin header matches expected domain
   - Fallback check on Referer header

6. RE-AUTHENTICATION
   - Require password for sensitive actions
        `
    },
    {
        category: "CSRF",
        question: "Explain the SameSite cookie attribute.",
        answer: `
SameSite controls when cookies are sent in cross-site requests.

SameSite=Strict:
- Cookie NEVER sent cross-site
- Most secure
- Problem: User clicking link from email won't be logged in

SameSite=Lax (default):
- Cookie sent for top-level navigations (clicking links)
- NOT sent for cross-origin POST, AJAX, iframes
- Good balance of security and usability

SameSite=None:
- Cookie sent for all requests
- REQUIRES Secure attribute
- Used for legitimate cross-site scenarios (SSO, embeds)

Set-Cookie: session=abc;
            SameSite=Strict;
            HttpOnly;
            Secure

BROWSER DEFAULT: Lax (as of 2020+)
        `
    },

    // ========================================================================
    // INJECTION QUESTIONS
    // ========================================================================
    {
        category: "Injection",
        question: "What is SQL Injection and how to prevent it?",
        answer: `
SQL Injection manipulates database queries by injecting malicious SQL code.

VULNERABLE CODE:
const query = "SELECT * FROM users WHERE username = '" + input + "'";
// Input: ' OR '1'='1' --
// Result: SELECT * FROM users WHERE username = '' OR '1'='1' --'

PREVENTION:

1. Parameterized Queries (Best)
   const query = 'SELECT * FROM users WHERE username = ?';
   db.execute(query, [username]);

2. ORM/Query Builders
   User.findOne({ username: req.body.username });

3. Input Validation
   - Whitelist allowed characters
   - Reject quotes and SQL keywords

4. Least Privilege
   - Database user with minimal permissions
   - No DROP, DELETE on production

5. Escape Input (Last Resort)
   - mysql.escape(input)
   - Not as safe as parameterized queries
        `
    },
    {
        category: "Injection",
        question: "How does NoSQL Injection work?",
        answer: `
NoSQL Injection manipulates queries using operators.

VULNERABLE CODE:
db.users.findOne({
    username: req.body.username,
    password: req.body.password
});

ATTACK:
POST body: { "username": "admin", "password": { "$ne": "" } }

Query becomes: Find where password != "" (always true!)

PREVENTION:

1. Type Validation
   if (typeof password !== 'string') throw Error();

2. Sanitize Operators
   Remove keys starting with $

3. Schema Validation
   Mongoose schemas enforce types

4. Query Projection
   Limit returned fields: { password: 0 }
        `
    },
    {
        category: "Injection",
        question: "What is Command Injection?",
        answer: `
Command Injection executes arbitrary OS commands via user input.

VULNERABLE CODE:
const { exec } = require('child_process');
exec('ping ' + userInput);  // userInput = "127.0.0.1; rm -rf /"

SAFE CODE:
const { execFile } = require('child_process');
execFile('ping', ['-c', '4', userInput]);  // Arguments as array

PREVENTION:
1. Never use exec() with user input
2. Use execFile/spawn with argument arrays
3. Validate input against whitelist
4. Escape shell metacharacters if exec required

DANGEROUS CHARACTERS:
; | & $ > < \` \\ ! { } [ ] ( ) # ~ = * ?
        `
    },

    // ========================================================================
    // PROTOTYPE POLLUTION
    // ========================================================================
    {
        category: "Prototype Pollution",
        question: "What is Prototype Pollution?",
        answer: `
Prototype Pollution modifies Object.prototype, affecting ALL objects.

ATTACK:
const payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
merge({}, payload);

// Now EVERY object has isAdmin = true!
const user = {};
console.log(user.isAdmin);  // true!

IMPACTS:
- Authentication bypass (isAdmin = true)
- RCE via template engines
- DoS by overwriting methods

PREVENTION:
1. Block __proto__, constructor, prototype keys
2. Use Object.create(null) for dictionaries
3. Use Map instead of plain objects
4. Object.freeze(Object.prototype)
5. Update vulnerable libraries (lodash < 4.17.12)
        `
    },
    {
        category: "Prototype Pollution",
        question: "How do you safely merge objects?",
        answer: `
UNSAFE:
function merge(target, source) {
    for (const key in source) {
        target[key] = source[key];  // Copies __proto__!
    }
}

SAFE:
function safeMerge(target, source) {
    const BLOCKED = ['__proto__', 'constructor', 'prototype'];

    for (const key of Object.keys(source)) {
        if (BLOCKED.includes(key)) continue;
        if (!Object.hasOwn(source, key)) continue;

        if (typeof source[key] === 'object') {
            target[key] = safeMerge({}, source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

ALTERNATIVES:
- Use Object.assign() carefully
- Use Map for untrusted keys
- Validate JSON schema
        `
    },

    // ========================================================================
    // AUTHENTICATION
    // ========================================================================
    {
        category: "Authentication",
        question: "How should passwords be stored?",
        answer: `
NEVER: Store plain text or use MD5/SHA without salt

ALWAYS: Use adaptive hashing algorithms:

1. bcrypt (Recommended)
   const bcrypt = require('bcrypt');
   const hash = await bcrypt.hash(password, 12);

2. scrypt (Memory-hard)
   crypto.scrypt(password, salt, 64, callback);

3. Argon2id (Best, PHC winner)
   argon2.hash(password, { type: argon2.argon2id });

WHY THESE ALGORITHMS:
- Include salt automatically (bcrypt)
- Slow by design (prevents brute force)
- Configurable work factor
- Memory-hard (defeats GPU attacks)

WORK FACTOR: Increase over time as hardware improves
- bcrypt: cost = 12+ (takes ~250ms)
- Argon2: memory = 64MB, iterations = 3
        `
    },
    {
        category: "Authentication",
        question: "What is JWT and its security concerns?",
        answer: `
JWT (JSON Web Token) is a stateless authentication token.

STRUCTURE: header.payload.signature

SECURITY CONCERNS:

1. Algorithm Confusion
   - Attacker changes alg to "none"
   - MITIGATION: Verify algorithm explicitly in code

2. Weak Secrets
   - Short/guessable secrets can be brute-forced
   - MITIGATION: Use 256+ bit random secrets

3. No Token Revocation
   - JWTs valid until expiry
   - MITIGATION: Short expiry + refresh tokens + blacklist

4. XSS Token Theft
   - If stored in localStorage, XSS can steal it
   - MITIGATION: Store in HttpOnly cookies

5. Sensitive Data Exposure
   - Payload is only base64 encoded, not encrypted
   - MITIGATION: Never put secrets in payload

BEST PRACTICES:
- Short expiry (15-30 min)
- Refresh token rotation
- HttpOnly cookie storage
- Verify all claims (exp, iss, aud)
        `
    },
    {
        category: "Authentication",
        question: "Compare Session vs JWT authentication.",
        answer: `
SESSION-BASED:
┌─────────────────────────────────────────┐
│ Server stores session data              │
│ Cookie contains session ID              │
│ Lookup required for each request        │
└─────────────────────────────────────────┘

Pros:
- Easy to invalidate (delete from store)
- Server controls session data
- Smaller cookie size

Cons:
- Requires session storage (Redis)
- Not ideal for microservices
- Horizontal scaling complexity

JWT-BASED:
┌─────────────────────────────────────────┐
│ Server stores nothing                   │
│ Token contains all claims               │
│ Self-contained verification             │
└─────────────────────────────────────────┘

Pros:
- Stateless, scalable
- Works across domains
- Good for microservices

Cons:
- Can't revoke immediately
- Larger payload size
- Token theft is severe

WHEN TO USE:
- Sessions: Traditional web apps, need revocation
- JWT: APIs, microservices, SPAs
        `
    },
    {
        category: "Authentication",
        question: "How do you prevent brute force attacks?",
        answer: `
1. RATE LIMITING
   - Limit login attempts per IP/account
   - Sliding window: 5 attempts per 15 minutes

2. PROGRESSIVE DELAYS
   - Increase delay after each failure
   - 1s, 2s, 4s, 8s, ...

3. ACCOUNT LOCKOUT
   - Lock after N failures
   - Time-based unlock (30 minutes)
   - Notify user via email

4. CAPTCHA
   - After 3+ failed attempts
   - Prevents automated attacks

5. MONITORING & ALERTING
   - Log failed attempts
   - Alert on anomalies

6. MULTI-FACTOR AUTHENTICATION
   - Even if password stolen, need 2nd factor
   - TOTP, SMS, hardware keys

IMPLEMENTATION:
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.body.email
});
        `
    },

    // ========================================================================
    // CRYPTOGRAPHY
    // ========================================================================
    {
        category: "Cryptography",
        question: "What is the difference between encryption and hashing?",
        answer: `
ENCRYPTION (Two-way):
┌─────────────────────────────────────────┐
│ Plaintext + Key → Ciphertext            │
│ Ciphertext + Key → Plaintext            │
│ Reversible with correct key             │
└─────────────────────────────────────────┘
Use: Protecting data at rest/transit

HASHING (One-way):
┌─────────────────────────────────────────┐
│ Data → Fixed-size hash                  │
│ Cannot reverse to original              │
│ Same input = same hash                  │
└─────────────────────────────────────────┘
Use: Password storage, integrity checks

COMPARISON:
┌──────────────┬─────────────┬─────────────┐
│ Feature      │ Encryption  │ Hashing     │
├──────────────┼─────────────┼─────────────┤
│ Reversible   │ Yes         │ No          │
│ Key needed   │ Yes         │ No          │
│ Output size  │ Variable    │ Fixed       │
│ Use case     │ Secrets     │ Passwords   │
└──────────────┴─────────────┴─────────────┘
        `
    },
    {
        category: "Cryptography",
        question: "Explain symmetric vs asymmetric encryption.",
        answer: `
SYMMETRIC (Same key):
┌─────────────────────────────────────────┐
│ Encrypt: Plaintext + Key → Ciphertext   │
│ Decrypt: Ciphertext + Key → Plaintext   │
│ Fast, efficient                         │
│ Key distribution challenge              │
└─────────────────────────────────────────┘
Algorithms: AES-256-GCM, ChaCha20
Use: Data encryption, session keys

ASYMMETRIC (Key pair):
┌─────────────────────────────────────────┐
│ Encrypt: Plaintext + PublicKey → Cipher │
│ Decrypt: Cipher + PrivateKey → Plain    │
│ Slower, more CPU intensive              │
│ Solves key distribution                 │
└─────────────────────────────────────────┘
Algorithms: RSA, ECDSA, Ed25519
Use: Key exchange, digital signatures

HYBRID (Common in practice):
1. Generate random symmetric key
2. Encrypt data with symmetric key (fast)
3. Encrypt symmetric key with recipient's public key
4. Send both encrypted data and encrypted key
        `
    },
    {
        category: "Cryptography",
        question: "Why is Math.random() not secure?",
        answer: `
Math.random() is PREDICTABLE:
- Uses PRNG (Pseudo-Random Number Generator)
- Seeded from limited entropy sources
- Output can be predicted if seed is known
- Not designed for cryptographic use

const x = Math.random();  // 0.123456789
// Attacker observing outputs can predict next values

SECURE ALTERNATIVES:

Node.js:
const crypto = require('crypto');
crypto.randomBytes(32);        // Random bytes
crypto.randomUUID();           // Random UUID
crypto.randomInt(1, 100);      // Random integer

Browser:
crypto.getRandomValues(new Uint8Array(32));
crypto.randomUUID();

USE CASES:
Math.random(): Games, UI animations, non-security
crypto.random*: Tokens, keys, passwords, session IDs
        `
    },

    // ========================================================================
    // SECURE CODING
    // ========================================================================
    {
        category: "Secure Coding",
        question: "What is the principle of least privilege?",
        answer: `
Users/processes should have ONLY the permissions they need to perform
their specific tasks, nothing more.

EXAMPLES:

1. Database Users
   - App user: SELECT, INSERT, UPDATE only
   - Not DROP, DELETE, CREATE

2. API Keys
   - Read-only key for analytics
   - Write key for data updates
   - Admin key only for administration

3. File Permissions
   - Web server: Read static files
   - Not write to system directories

4. Process Sandboxing
   - Run with minimal OS permissions
   - Container without root access

BENEFITS:
- Limits damage from compromised accounts
- Reduces attack surface
- Contains security breaches
        `
    },
    {
        category: "Secure Coding",
        question: "How do you handle sensitive data in logs?",
        answer: `
NEVER LOG:
- Passwords
- API keys/tokens
- Credit card numbers
- Social Security Numbers
- Private keys
- Session IDs

REDACTION PATTERN:
function redact(obj) {
    const sensitive = ['password', 'token', 'ssn', 'creditCard'];
    const result = {...obj};

    for (const key of sensitive) {
        if (key in result) {
            result[key] = '[REDACTED]';
        }
    }
    return result;
}

logger.info('User login', redact(userData));

MASKING:
const masked = email.replace(/(.{2}).*@/, '$1***@');
// john@example.com → jo***@example.com

LOG SECURITY:
- Encrypt logs at rest
- Restrict log access
- Set retention policies
- Monitor for sensitive data leaks
        `
    },
    {
        category: "Secure Coding",
        question: "What is input validation best practices?",
        answer: `
1. VALIDATE ON SERVER (Always)
   - Client validation can be bypassed
   - Server is the last line of defense

2. WHITELIST > BLACKLIST
   - Define what IS allowed
   - Not what ISN'T (attackers find gaps)

3. CHECK TYPE, FORMAT, LENGTH, RANGE
   // Type
   if (typeof input !== 'string') reject();

   // Format
   if (!/^[a-zA-Z0-9]+$/.test(input)) reject();

   // Length
   if (input.length < 3 || input.length > 50) reject();

   // Range
   if (num < 0 || num > 100) reject();

4. SANITIZE FOR OUTPUT CONTEXT
   - HTML: Encode < > & " '
   - URL: encodeURIComponent()
   - SQL: Parameterized queries
   - Command: Whitelist arguments

5. REJECT SUSPICIOUS INPUT
   - Don't try to "clean" it
   - Safer to reject entirely
        `
    },

    // ========================================================================
    // CORS & HEADERS
    // ========================================================================
    {
        category: "CORS & Headers",
        question: "What is CORS and how does it work?",
        answer: `
CORS (Cross-Origin Resource Sharing) controls cross-origin requests.

SAME-ORIGIN POLICY:
- Browser blocks requests to different origins
- Origin = protocol + host + port

CORS FLOW:
1. Browser sends request with Origin header
2. Server responds with Access-Control-Allow-Origin
3. If allowed, browser permits response

SIMPLE REQUESTS (No preflight):
- GET, POST, HEAD
- Standard headers only
- Form content types

PREFLIGHT REQUESTS:
- PUT, DELETE, PATCH
- Custom headers
- Non-form content types
→ Browser sends OPTIONS first

SECURE CORS CONFIG:
app.use(cors({
    origin: ['https://trusted-site.com'],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

NEVER:
origin: '*' with credentials: true
        `
    },
    {
        category: "CORS & Headers",
        question: "What security headers should every app have?",
        answer: `
ESSENTIAL HEADERS:

1. Content-Security-Policy
   CSP: default-src 'self'; script-src 'self'
   Prevents XSS, controls resource loading

2. X-Content-Type-Options
   X-Content-Type-Options: nosniff
   Prevents MIME type sniffing

3. X-Frame-Options
   X-Frame-Options: DENY
   Prevents clickjacking

4. Strict-Transport-Security (HSTS)
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   Forces HTTPS

5. X-XSS-Protection
   X-XSS-Protection: 1; mode=block
   Legacy XSS filter (deprecated but harmless)

6. Referrer-Policy
   Referrer-Policy: strict-origin-when-cross-origin
   Controls Referer header leakage

7. Permissions-Policy
   Permissions-Policy: geolocation=(), camera=()
   Controls browser features

USE HELMET.JS:
const helmet = require('helmet');
app.use(helmet());  // Sets all recommended headers
        `
    },

    // ========================================================================
    // HTTPS & TLS
    // ========================================================================
    {
        category: "HTTPS & TLS",
        question: "Why is HTTPS important?",
        answer: `
HTTPS provides:

1. ENCRYPTION
   - Data encrypted in transit
   - Prevents eavesdropping
   - Man-in-middle can't read traffic

2. AUTHENTICATION
   - Certificate proves server identity
   - Prevents impersonation
   - Browser verifies certificate chain

3. INTEGRITY
   - Detects if data modified
   - HMAC on each packet
   - Prevents tampering

WITHOUT HTTPS:
- Passwords sent in plain text
- Session cookies can be stolen (Firesheep)
- Data can be modified (ad injection)
- ISP can inspect/modify traffic

REQUIREMENTS:
- Valid TLS certificate (Let's Encrypt is free)
- HSTS header for enforcement
- Redirect HTTP to HTTPS
- Secure cookies (Secure attribute)

TLS VERSIONS:
- TLS 1.3: Current, fastest, most secure
- TLS 1.2: Acceptable with good cipher suites
- TLS 1.0/1.1: Deprecated, disable
- SSL: Deprecated, disable
        `
    },

    // ========================================================================
    // DEPENDENCY SECURITY
    // ========================================================================
    {
        category: "Dependencies",
        question: "How do you handle vulnerable dependencies?",
        answer: `
1. AUDIT REGULARLY
   npm audit              # Check for vulnerabilities
   npm audit fix          # Auto-fix where possible
   npm audit fix --force  # Major version updates

2. USE LOCKFILE
   - Commit package-lock.json
   - Use npm ci in CI/CD (faster, deterministic)

3. AUTOMATED SCANNING
   - GitHub Dependabot
   - Snyk
   - npm audit in CI pipeline

4. DEPENDENCY REVIEW
   - Check before adding new packages
   - Review maintainer, activity, issues
   - Prefer well-maintained packages

5. MINIMIZE DEPENDENCIES
   - Fewer deps = smaller attack surface
   - Evaluate if you really need it

6. PIN VERSIONS
   - Avoid ^ and ~ for critical packages
   - Lock exact versions for security-sensitive deps

7. UPDATE STRATEGY
   - Regular updates (weekly/monthly)
   - Test thoroughly before deploying
   - Have rollback plan
        `
    },

    // ========================================================================
    // GENERAL SECURITY
    // ========================================================================
    {
        category: "General",
        question: "What is defense in depth?",
        answer: `
Defense in depth uses MULTIPLE LAYERS of security controls.

LAYERS:
┌────────────────────────────────────────┐
│            Web Application             │
├────────────────────────────────────────┤
│   Input Validation │ Output Encoding   │
├────────────────────────────────────────┤
│         Authentication │ RBAC          │
├────────────────────────────────────────┤
│              WAF │ Rate Limiting       │
├────────────────────────────────────────┤
│                 Firewall               │
├────────────────────────────────────────┤
│              Network Security          │
└────────────────────────────────────────┘

WHY:
- No single control is perfect
- If one fails, others catch it
- Attacker must bypass multiple layers

EXAMPLE - XSS DEFENSE:
1. Input validation
2. Output encoding
3. Content Security Policy
4. HttpOnly cookies
5. WAF rules
        `
    },
    {
        category: "General",
        question: "What is the OWASP Top 10?",
        answer: `
OWASP Top 10 (2021) - Most critical web security risks:

A01: BROKEN ACCESS CONTROL
- IDOR, privilege escalation
- Fix: Verify authorization for every request

A02: CRYPTOGRAPHIC FAILURES
- Weak encryption, exposed data
- Fix: Use strong crypto, encrypt sensitive data

A03: INJECTION
- SQL, NoSQL, Command injection
- Fix: Parameterized queries, input validation

A04: INSECURE DESIGN
- Architecture flaws
- Fix: Threat modeling, secure design patterns

A05: SECURITY MISCONFIGURATION
- Default configs, verbose errors
- Fix: Hardening, remove defaults

A06: VULNERABLE COMPONENTS
- Outdated libraries
- Fix: Regular updates, dependency scanning

A07: AUTHENTICATION FAILURES
- Weak passwords, session issues
- Fix: MFA, secure session management

A08: SOFTWARE INTEGRITY FAILURES
- Untrusted updates, CI/CD compromise
- Fix: Verify signatures, secure pipeline

A09: LOGGING FAILURES
- Missing logs, no monitoring
- Fix: Comprehensive logging, alerting

A10: SSRF
- Server makes requests to internal resources
- Fix: Validate URLs, block internal IPs
        `
    },
    {
        category: "General",
        question: "How do you secure a REST API?",
        answer: `
API SECURITY CHECKLIST:

1. AUTHENTICATION
   - Use OAuth 2.0 / JWT
   - Short token expiry
   - Secure token storage

2. AUTHORIZATION
   - Verify permissions on every request
   - Use RBAC/ABAC
   - Check resource ownership

3. INPUT VALIDATION
   - Validate all parameters
   - Type checking, length limits
   - Sanitize before use

4. RATE LIMITING
   - Per-user and per-IP limits
   - Prevent brute force

5. HTTPS ONLY
   - TLS 1.2+ required
   - HSTS header

6. CORS
   - Whitelist allowed origins
   - Don't allow * with credentials

7. SECURITY HEADERS
   - Content-Type enforcement
   - X-Content-Type-Options

8. ERROR HANDLING
   - Generic messages to clients
   - Log details internally

9. VERSIONING
   - Version your API
   - Deprecate securely

10. AUDIT LOGGING
    - Log all access
    - Monitor for anomalies
        `
    }
];

// ============================================================================
// Print Questions
// ============================================================================
let currentCategory = '';

interviewQuestions.forEach((q, index) => {
    if (q.category !== currentCategory) {
        currentCategory = q.category;
        console.log(`\n${'═'.repeat(67)}`);
        console.log(`   ${currentCategory.toUpperCase()} QUESTIONS`);
        console.log(`${'═'.repeat(67)}`);
    }

    console.log(`\n${index + 1}. Q: ${q.question}`);
    console.log(`\n   A: ${q.answer.trim().split('\n').join('\n   ')}`);
});

// ============================================================================
// Quick Reference
// ============================================================================
console.log("\n" + "═".repeat(67));
console.log("           SECURITY QUICK REFERENCE");
console.log("═".repeat(67));

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    SECURITY QUICK REFERENCE                      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  XSS Prevention:          CSRF Prevention:                       ║
║  • textContent > innerHTML • CSRF tokens                         ║
║  • CSP headers             • SameSite cookies                    ║
║  • DOMPurify               • Origin validation                   ║
║  • Escape output           • Custom headers                      ║
║                                                                  ║
║  Password Security:        JWT Security:                         ║
║  • bcrypt/Argon2           • Verify algorithm                    ║
║  • Salt included           • Short expiry                        ║
║  • Cost factor 12+         • HttpOnly cookies                    ║
║                            • Refresh tokens                      ║
║                                                                  ║
║  Injection Prevention:     Prototype Pollution:                  ║
║  • Parameterized queries   • Block __proto__                     ║
║  • execFile > exec         • Object.create(null)                 ║
║  • Input validation        • Use Map                             ║
║                                                                  ║
║  Encryption:               Headers:                              ║
║  • AES-256-GCM             • Content-Security-Policy             ║
║  • RSA 2048+ bits          • Strict-Transport-Security           ║
║  • crypto.randomBytes()    • X-Content-Type-Options              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

module.exports = { interviewQuestions };

console.log("\n═══ JAVASCRIPT SECURITY MODULE COMPLETE! ═══");
console.log("All 8 files covering security concepts created.");
console.log("\nNext module: Module Systems");
console.log("Run: node deep-dive/javaScript-module-systems/01-commonjs.js");
