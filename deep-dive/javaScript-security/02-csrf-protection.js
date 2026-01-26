/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT SECURITY - CSRF (Cross-Site Request Forgery) Protection
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CSRF tricks authenticated users into executing unwanted actions
 * on a web application where they're currently authenticated.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CSRF ATTACK FLOW                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐       │
 * │   │   Victim    │         │   Evil Site │         │  Bank.com   │       │
 * │   │   Browser   │         │ (Attacker)  │         │  (Target)   │       │
 * │   └──────┬──────┘         └──────┬──────┘         └──────┬──────┘       │
 * │          │                       │                       │              │
 * │          │  1. Login to Bank     │                       │              │
 * │          │───────────────────────────────────────────────►              │
 * │          │                       │                       │              │
 * │          │  2. Session Cookie    │                       │              │
 * │          │◄───────────────────────────────────────────────              │
 * │          │                       │                       │              │
 * │          │  3. Visit Evil Site   │                       │              │
 * │          │──────────────────────►│                       │              │
 * │          │                       │                       │              │
 * │          │  4. Evil page with    │                       │              │
 * │          │     hidden form       │                       │              │
 * │          │◄──────────────────────│                       │              │
 * │          │                       │                       │              │
 * │          │  5. Auto-submit form to Bank                  │              │
 * │          │  (Cookie sent automatically!)                 │              │
 * │          │───────────────────────────────────────────────►              │
 * │          │                       │                       │              │
 * │          │  6. Money transferred!│                       │              │
 * │          │◄───────────────────────────────────────────────              │
 * │          │                       │                       │              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CSRF ATTACK EXAMPLES                                  │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Attack Vector 1: Hidden Form Auto-Submit
// ============================================================================
const hiddenFormAttack = `
<!-- On attacker's website: evil.com -->
<html>
<body onload="document.forms[0].submit()">
    <form action="https://bank.com/transfer" method="POST">
        <input type="hidden" name="to" value="attacker-account">
        <input type="hidden" name="amount" value="10000">
    </form>
</body>
</html>
`;

// ============================================================================
// Attack Vector 2: Image Tag GET Request
// ============================================================================
const imageTagAttack = `
<!-- Image tag that performs GET request -->
<img src="https://bank.com/transfer?to=attacker&amount=1000" style="display:none">

<!-- Or in an email -->
<img src="https://vulnerable-app.com/api/delete-account" width="0" height="0">
`;

// ============================================================================
// Attack Vector 3: AJAX Request (if CORS misconfigured)
// ============================================================================
const ajaxAttack = `
// If CORS allows credentials from any origin
fetch('https://bank.com/api/transfer', {
    method: 'POST',
    credentials: 'include',  // Sends cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: 'attacker', amount: 10000 })
});
`;

console.log("═══════════════════════════════════════════════════════════════");
console.log("           CSRF ATTACK VECTORS");
console.log("═══════════════════════════════════════════════════════════════\n");
console.log("1. Hidden Form Auto-Submit");
console.log("2. Image Tag GET Requests");
console.log("3. AJAX with Credentials (CORS misconfiguration)");
console.log("4. Clickjacking Combined with CSRF\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CSRF PROTECTION STRATEGIES                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  SYNCHRONIZER TOKEN PATTERN                     │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   ┌──────────┐         ┌──────────┐         ┌──────────┐                │
 * │   │  Client  │         │  Server  │         │  Session │                │
 * │   └────┬─────┘         └────┬─────┘         └────┬─────┘                │
 * │        │                    │                    │                       │
 * │        │  1. Request form   │                    │                       │
 * │        │───────────────────►│                    │                       │
 * │        │                    │                    │                       │
 * │        │                    │ 2. Generate Token  │                       │
 * │        │                    │───────────────────►│                       │
 * │        │                    │                    │                       │
 * │        │  3. Form + Token   │                    │                       │
 * │        │◄───────────────────│                    │                       │
 * │        │                    │                    │                       │
 * │        │  4. Submit + Token │                    │                       │
 * │        │───────────────────►│                    │                       │
 * │        │                    │                    │                       │
 * │        │                    │ 5. Verify Token    │                       │
 * │        │                    │───────────────────►│                       │
 * │        │                    │                    │                       │
 * │        │  6. Response       │◄───────────────────│                       │
 * │        │◄───────────────────│    Match!          │                       │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// CSRF Token Generation
// ============================================================================
const crypto = require('crypto');

class CSRFProtection {
    constructor() {
        this.tokens = new Map(); // In production, use session storage
    }

    // Generate cryptographically secure token
    generateToken(sessionId) {
        const token = crypto.randomBytes(32).toString('hex');
        this.tokens.set(sessionId, {
            token,
            createdAt: Date.now(),
            expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
        });
        return token;
    }

    // Verify token
    verifyToken(sessionId, submittedToken) {
        const stored = this.tokens.get(sessionId);

        if (!stored) {
            console.log("❌ No token found for session");
            return false;
        }

        if (Date.now() > stored.expiresAt) {
            this.tokens.delete(sessionId);
            console.log("❌ Token expired");
            return false;
        }

        // Constant-time comparison to prevent timing attacks
        const valid = crypto.timingSafeEqual(
            Buffer.from(stored.token),
            Buffer.from(submittedToken)
        );

        if (valid) {
            console.log("✅ CSRF token verified");
        } else {
            console.log("❌ Invalid CSRF token");
        }

        return valid;
    }

    // Cleanup expired tokens
    cleanup() {
        const now = Date.now();
        for (const [sessionId, data] of this.tokens) {
            if (now > data.expiresAt) {
                this.tokens.delete(sessionId);
            }
        }
    }
}

// ============================================================================
// Express.js CSRF Middleware
// ============================================================================
function csrfMiddleware() {
    const csrf = new CSRFProtection();

    return {
        // Generate token for forms
        generateMiddleware: (req, res, next) => {
            const sessionId = req.session?.id || 'demo-session';
            const token = csrf.generateToken(sessionId);

            // Make token available to templates
            res.locals.csrfToken = token;

            // Also set as cookie for double-submit pattern
            // res.cookie('XSRF-TOKEN', token, {
            //     httpOnly: false,  // JavaScript needs to read it
            //     secure: true,
            //     sameSite: 'Strict'
            // });

            console.log("CSRF token generated:", token.substring(0, 16) + "...");
            return token;
        },

        // Verify token on submission
        verifyMiddleware: (req, res, next) => {
            // Skip for GET, HEAD, OPTIONS
            if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
                return true;
            }

            const sessionId = req.session?.id || 'demo-session';

            // Check multiple sources for token
            const token = req.body?._csrf ||
                          req.headers['x-csrf-token'] ||
                          req.headers['x-xsrf-token'];

            if (!token) {
                console.log("❌ No CSRF token provided");
                return false;
            }

            return csrf.verifyToken(sessionId, token);
        }
    };
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DOUBLE SUBMIT COOKIE PATTERN                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   How it works:                                                          │
 * │   1. Server sets CSRF token in cookie (readable by JS)                  │
 * │   2. Client reads cookie, sends token in header                         │
 * │   3. Server compares cookie value with header value                     │
 * │                                                                          │
 * │   Why it works:                                                          │
 * │   • Attacker cannot read cookies from different origin                  │
 * │   • Attacker cannot set custom headers in cross-origin requests         │
 * │                                                                          │
 * │   ┌─────────────┐                            ┌─────────────┐            │
 * │   │   Browser   │                            │   Server    │            │
 * │   └──────┬──────┘                            └──────┬──────┘            │
 * │          │                                          │                   │
 * │          │  Request page                            │                   │
 * │          │─────────────────────────────────────────►│                   │
 * │          │                                          │                   │
 * │          │  Response + Set-Cookie: XSRF-TOKEN=abc   │                   │
 * │          │◄─────────────────────────────────────────│                   │
 * │          │                                          │                   │
 * │          │  POST /action                            │                   │
 * │          │  Cookie: XSRF-TOKEN=abc                  │                   │
 * │          │  Header: X-XSRF-TOKEN: abc              │                   │
 * │          │─────────────────────────────────────────►│                   │
 * │          │                                          │                   │
 * │          │                     Compare both = ✅    │                   │
 * │          │                                          │                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Double Submit Cookie Implementation
// ============================================================================
class DoubleSubmitCSRF {
    static cookieName = 'XSRF-TOKEN';
    static headerName = 'X-XSRF-TOKEN';

    static setToken(res) {
        const token = crypto.randomBytes(32).toString('hex');

        // Set cookie (readable by JavaScript)
        // res.cookie(this.cookieName, token, {
        //     httpOnly: false,   // Must be readable by JS
        //     secure: true,
        //     sameSite: 'Strict',
        //     path: '/'
        // });

        console.log("Double Submit Cookie set:", token.substring(0, 16) + "...");
        return token;
    }

    static verify(req) {
        const cookieToken = req.cookies?.[this.cookieName];
        const headerToken = req.headers?.[this.headerName.toLowerCase()];

        if (!cookieToken || !headerToken) {
            console.log("❌ Missing cookie or header token");
            return false;
        }

        try {
            const valid = crypto.timingSafeEqual(
                Buffer.from(cookieToken),
                Buffer.from(headerToken)
            );
            console.log(valid ? "✅ Double submit verified" : "❌ Token mismatch");
            return valid;
        } catch {
            return false;
        }
    }
}

// ============================================================================
// Frontend Implementation (Axios Example)
// ============================================================================
const axiosCSRFExample = `
// Configure Axios to read CSRF token from cookie
import axios from 'axios';

// Axios automatically reads XSRF-TOKEN cookie and sends X-XSRF-TOKEN header
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
axios.defaults.withCredentials = true;

// All requests now include CSRF token
axios.post('/api/transfer', { amount: 100 });

// Or manually with fetch:
const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

fetch('/api/transfer', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
    },
    body: JSON.stringify({ amount: 100 })
});
`;

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SAMESITE COOKIE ATTRIBUTE                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌──────────────────────────────────────────────────────────────────┐  │
 * │   │           SAMESITE VALUES COMPARISON                             │  │
 * │   ├───────────┬─────────────────────────────────────────────────────┤  │
 * │   │ Value     │ Behavior                                            │  │
 * │   ├───────────┼─────────────────────────────────────────────────────┤  │
 * │   │ Strict    │ Cookie NEVER sent cross-site                        │  │
 * │   │           │ ❌ Links from external sites                        │  │
 * │   │           │ ❌ Form submissions from external                   │  │
 * │   │           │ ❌ AJAX from external                               │  │
 * │   ├───────────┼─────────────────────────────────────────────────────┤  │
 * │   │ Lax       │ Cookie sent for top-level navigations               │  │
 * │   │ (default) │ ✅ Links from external sites (GET)                  │  │
 * │   │           │ ❌ Form submissions (POST)                          │  │
 * │   │           │ ❌ AJAX from external                               │  │
 * │   ├───────────┼─────────────────────────────────────────────────────┤  │
 * │   │ None      │ Cookie sent for all requests                        │  │
 * │   │           │ ✅ All cross-site requests                          │  │
 * │   │           │ ⚠️  Requires Secure attribute                       │  │
 * │   └───────────┴─────────────────────────────────────────────────────┘  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Cookie Configuration Examples
// ============================================================================
function setCookieSecurely(res, name, value) {
    // Maximum security cookie configuration
    const cookieOptions = {
        httpOnly: true,       // Not accessible via JavaScript
        secure: true,         // HTTPS only
        sameSite: 'Strict',   // Prevent cross-site sending
        maxAge: 3600000,      // 1 hour
        path: '/',
        // domain: '.example.com'  // If needed for subdomains
    };

    // res.cookie(name, value, cookieOptions);

    console.log("Secure cookie configuration:");
    console.log(JSON.stringify(cookieOptions, null, 2));
}

// ============================================================================
// Session Cookie Security
// ============================================================================
const sessionConfig = {
    secret: 'use-env-variable-with-min-32-chars',
    name: 'sessionId',  // Don't use default 'connect.sid'
    cookie: {
        httpOnly: true,
        secure: true,       // Set to false only in development
        sameSite: 'strict',
        maxAge: 3600000,    // 1 hour
        path: '/'
    },
    resave: false,
    saveUninitialized: false,
    rolling: true  // Reset expiry on each request
};

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CORS CONFIGURATION                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Proper CORS prevents cross-origin AJAX CSRF attacks                   │
 * │                                                                          │
 * │   ┌──────────────────────────────────────────────────────────────────┐  │
 * │   │                    SECURE CORS CONFIG                            │  │
 * │   └──────────────────────────────────────────────────────────────────┘  │
 * │                                                                          │
 * │   ✅ GOOD                          ❌ BAD                               │
 * │   ──────────                       ──────                               │
 * │   origin: ['https://app.com']      origin: '*'                          │
 * │   credentials: true                Access-Control-Allow-Origin: *       │
 * │                                    (with credentials)                    │
 * │                                                                          │
 * │   ⚠️  NEVER use origin: '*' with credentials: true                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// CORS Configuration
// ============================================================================
function corsConfiguration() {
    const allowedOrigins = [
        'https://myapp.com',
        'https://www.myapp.com',
        'https://admin.myapp.com'
    ];

    // Development origins (conditionally add)
    if (process.env.NODE_ENV === 'development') {
        allowedOrigins.push('http://localhost:3000');
    }

    const corsOptions = {
        origin: function(origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-XSRF-TOKEN'],
        exposedHeaders: ['X-Request-Id'],
        maxAge: 86400  // Cache preflight for 24 hours
    };

    console.log("CORS Configuration:");
    console.log("  Allowed origins:", allowedOrigins);
    console.log("  Credentials:", corsOptions.credentials);
    return corsOptions;
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CUSTOM HEADER VERIFICATION                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Simple but effective: Require custom header for state-changing        │
 * │   requests. Browsers don't allow custom headers in cross-origin         │
 * │   simple requests.                                                       │
 * │                                                                          │
 * │   Custom headers trigger preflight (OPTIONS request)                    │
 * │   If CORS rejects the preflight, request is blocked                     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Custom Header CSRF Protection
// ============================================================================
function customHeaderCSRF() {
    const CUSTOM_HEADER = 'X-Requested-With';
    const EXPECTED_VALUE = 'XMLHttpRequest';

    return {
        verify: (req) => {
            if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
                return true;
            }

            const headerValue = req.headers[CUSTOM_HEADER.toLowerCase()];

            if (headerValue === EXPECTED_VALUE) {
                console.log("✅ Custom header verified");
                return true;
            }

            console.log("❌ Missing or invalid custom header");
            return false;
        }
    };
}

// Frontend must send this header
const frontendExample = `
fetch('/api/action', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'  // Custom header
    },
    credentials: 'include',
    body: JSON.stringify(data)
});
`;

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ORIGIN/REFERER VALIDATION                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Additional layer: Verify Origin or Referer header                     │
 * │   Not foolproof (can be stripped) but adds defense in depth             │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Origin Validation
// ============================================================================
function validateOrigin(req) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const host = req.headers.host;

    // Get origin from Origin header or Referer
    let requestOrigin = origin;
    if (!requestOrigin && referer) {
        try {
            requestOrigin = new URL(referer).origin;
        } catch {
            requestOrigin = null;
        }
    }

    // If no origin info, could be same-origin or stripped
    // Consider blocking in high-security scenarios
    if (!requestOrigin) {
        console.log("⚠️  No Origin/Referer header");
        return { valid: false, reason: 'missing-origin' };
    }

    // Compare with expected host
    const expectedOrigin = `https://${host}`;

    try {
        const reqOrigin = new URL(requestOrigin);
        const expOrigin = new URL(expectedOrigin);

        if (reqOrigin.origin === expOrigin.origin) {
            console.log("✅ Origin validated:", requestOrigin);
            return { valid: true };
        }
    } catch {
        // Invalid URL format
    }

    console.log("❌ Origin mismatch:", requestOrigin, "vs", expectedOrigin);
    return { valid: false, reason: 'origin-mismatch' };
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    COMPLETE CSRF PROTECTION EXAMPLE                      │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Full Express.js CSRF Setup
// ============================================================================
const fullExpressExample = `
const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Parse cookies
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: 'https://myapp.com',
    credentials: true
}));

// Parse JSON
app.use(express.json());

// CSRF Token Generation
app.use((req, res, next) => {
    // Generate token if not exists
    if (!req.cookies['XSRF-TOKEN']) {
        const token = crypto.randomBytes(32).toString('hex');
        res.cookie('XSRF-TOKEN', token, {
            httpOnly: false,  // JS needs to read it
            secure: true,
            sameSite: 'strict'
        });
    }
    next();
});

// CSRF Verification Middleware
function csrfProtection(req, res, next) {
    // Skip for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const cookieToken = req.cookies['XSRF-TOKEN'];
    const headerToken = req.headers['x-xsrf-token'];

    if (!cookieToken || !headerToken) {
        return res.status(403).json({ error: 'CSRF token missing' });
    }

    if (cookieToken !== headerToken) {
        return res.status(403).json({ error: 'CSRF token invalid' });
    }

    next();
}

// Apply CSRF protection to all routes
app.use(csrfProtection);

// Protected route example
app.post('/api/transfer', (req, res) => {
    // CSRF protection already verified
    res.json({ success: true });
});
`;

// ============================================================================
// CSRF Protection Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           CSRF PROTECTION CHEAT SHEET                           ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  1. Use CSRF tokens (synchronizer or double-submit)             ║");
console.log("║  2. Set SameSite=Strict on session cookies                      ║");
console.log("║  3. Configure CORS properly (no wildcard with credentials)      ║");
console.log("║  4. Require custom headers for state-changing requests          ║");
console.log("║  5. Validate Origin/Referer headers as additional check         ║");
console.log("║  6. Use POST/PUT/DELETE for state changes, never GET            ║");
console.log("║  7. Regenerate session ID on login                              ║");
console.log("║  8. Implement proper logout (clear cookies)                     ║");
console.log("║  9. Use short session expiry times                              ║");
console.log("║  10. Consider re-authentication for sensitive actions           ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

// ============================================================================
// Demo Execution
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           CSRF PROTECTION DEMONSTRATIONS");
console.log("═══════════════════════════════════════════════════════════════\n");

// CSRF Token Generation
const csrf = new CSRFProtection();
const sessionId = 'user-session-123';
const token = csrf.generateToken(sessionId);
console.log("Generated Token:", token.substring(0, 32) + "...\n");

// Verify correct token
console.log("Verifying correct token:");
csrf.verifyToken(sessionId, token);

// Verify wrong token
console.log("\nVerifying wrong token:");
csrf.verifyToken(sessionId, 'invalid-token');

// Double Submit Cookie
console.log("\nDouble Submit Cookie Pattern:");
DoubleSubmitCSRF.setToken({});

// CORS Configuration
console.log("\n");
corsConfiguration();

// Origin Validation
console.log("\nOrigin Validation Examples:");
validateOrigin({
    headers: {
        origin: 'https://example.com',
        host: 'example.com'
    }
});

validateOrigin({
    headers: {
        origin: 'https://evil-site.com',
        host: 'example.com'
    }
});

// Secure cookie example
console.log("\n");
setCookieSecurely({}, 'session', 'value');

module.exports = {
    CSRFProtection,
    DoubleSubmitCSRF,
    csrfMiddleware,
    corsConfiguration,
    validateOrigin,
    customHeaderCSRF
};

console.log("\n═══ Next: Injection Attacks ═══");
console.log("Run: node deep-dive/javaScript-security/03-injection-attacks.js");
