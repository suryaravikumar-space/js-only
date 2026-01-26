/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT SECURITY - Authentication Security
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Secure authentication is the foundation of application security.
 * This covers password handling, JWT, session management, and OAuth.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    AUTHENTICATION FLOW                                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  AUTHENTICATION TYPES                           │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   1. Session-Based                 2. Token-Based (JWT)                 │
 * │   ┌──────────┐                     ┌──────────┐                         │
 * │   │  Client  │                     │  Client  │                         │
 * │   └────┬─────┘                     └────┬─────┘                         │
 * │        │ Login                          │ Login                         │
 * │        ▼                                ▼                               │
 * │   ┌──────────┐                     ┌──────────┐                         │
 * │   │  Server  │                     │  Server  │                         │
 * │   └────┬─────┘                     └────┬─────┘                         │
 * │        │ Create session                 │ Generate JWT                  │
 * │        ▼                                ▼                               │
 * │   ┌──────────┐                     ┌──────────┐                         │
 * │   │ Session  │                     │   JWT    │                         │
 * │   │  Store   │                     │ (signed) │                         │
 * │   │(Redis/DB)│                     │ No store │                         │
 * │   └────┬─────┘                     └────┬─────┘                         │
 * │        │ Set cookie                     │ Return token                  │
 * │        ▼                                ▼                               │
 * │   Cookie sent                      Token in header                      │
 * │   automatically                    Authorization: Bearer xxx            │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const crypto = require('crypto');

console.log("═══════════════════════════════════════════════════════════════");
console.log("           PASSWORD SECURITY");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PASSWORD HASHING                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ❌ NEVER:                        ✅ ALWAYS:                            │
 * │   • Store plain text               • Use bcrypt/scrypt/argon2           │
 * │   • Use MD5/SHA1/SHA256            • Use unique salt per password       │
 * │   • Use same salt for all          • Use sufficient work factor         │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  HASHING ALGORITHM COMPARISON                   │   │
 * │   ├─────────────┬───────────┬───────────┬──────────────────────────┤   │
 * │   │ Algorithm   │ CPU Cost  │ Memory    │ Recommendation           │   │
 * │   ├─────────────┼───────────┼───────────┼──────────────────────────┤   │
 * │   │ bcrypt      │ High      │ Low       │ Good, widely supported   │   │
 * │   │ scrypt      │ High      │ High      │ Better vs GPU attacks    │   │
 * │   │ Argon2id    │ High      │ High      │ Best, winner of PHC      │   │
 * │   │ PBKDF2      │ Medium    │ Low       │ Acceptable, legacy       │   │
 * │   │ SHA256      │ Fast      │ Low       │ ❌ NOT for passwords     │   │
 * │   └─────────────┴───────────┴───────────┴──────────────────────────┘   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECURE: Password Hashing with bcrypt
// ============================================================================
class PasswordService {
    // bcrypt configuration
    static SALT_ROUNDS = 12;  // 2^12 iterations, increase over time

    // Hash password (bcrypt includes salt automatically)
    static async hash(password) {
        // Using bcryptjs or bcrypt library:
        // const bcrypt = require('bcrypt');
        // return await bcrypt.hash(password, this.SALT_ROUNDS);

        // Native Node.js alternative using scrypt:
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16);
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(`${salt.toString('hex')}:${derivedKey.toString('hex')}`);
            });
        });
    }

    // Verify password
    static async verify(password, storedHash) {
        // With bcrypt:
        // return await bcrypt.compare(password, storedHash);

        // With scrypt:
        const [saltHex, hashHex] = storedHash.split(':');
        const salt = Buffer.from(saltHex, 'hex');
        const storedKey = Buffer.from(hashHex, 'hex');

        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                // Constant-time comparison
                resolve(crypto.timingSafeEqual(derivedKey, storedKey));
            });
        });
    }

    // Check password strength
    static validateStrength(password) {
        const errors = [];

        if (password.length < 12) {
            errors.push('Password must be at least 12 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain number');
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            errors.push('Password must contain special character');
        }

        // Check for common passwords (in production, use a proper list)
        const commonPasswords = ['password123', '123456789', 'qwerty123'];
        if (commonPasswords.includes(password.toLowerCase())) {
            errors.push('Password is too common');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Demo
console.log("─── Password Hashing Demo ───\n");
(async () => {
    const password = 'SecureP@ss123!';

    console.log("Original password:", password);
    const hash = await PasswordService.hash(password);
    console.log("Hashed:", hash.substring(0, 50) + "...");

    const valid = await PasswordService.verify(password, hash);
    console.log("Verification:", valid ? "✅ Valid" : "❌ Invalid");

    const wrongValid = await PasswordService.verify('wrongpass', hash);
    console.log("Wrong password:", wrongValid ? "✅ Valid" : "❌ Invalid");

    console.log("\nPassword strength check:");
    console.log("'weak':", PasswordService.validateStrength('weak'));
    console.log("'SecureP@ss123!':", PasswordService.validateStrength('SecureP@ss123!'));
})();

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    JWT (JSON Web Token)                                  │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   JWT Structure:                                                         │
 * │   ═══════════════                                                        │
 * │                                                                          │
 * │   ┌────────────┬────────────┬────────────┐                              │
 * │   │   Header   │  Payload   │ Signature  │                              │
 * │   │  (Base64)  │  (Base64)  │  (Base64)  │                              │
 * │   └────────────┴────────────┴────────────┘                              │
 * │        │            │            │                                       │
 * │        ▼            ▼            ▼                                       │
 * │   { "alg":"HS256"  { "sub":"1"    HMACSHA256(                           │
 * │     "typ":"JWT" }    "exp":1234    header + "." +                       │
 * │                      "iat":1233 }  payload, secret)                     │
 * │                                                                          │
 * │   xxxxx.yyyyy.zzzzz                                                     │
 * │                                                                          │
 * │   ⚠️  NEVER store sensitive data in JWT payload (it's only encoded!)   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           JWT SECURITY");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// JWT Implementation
// ============================================================================
class JWTService {
    static SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
    static ALGORITHM = 'HS256';

    // Base64URL encode (not standard Base64!)
    static base64UrlEncode(data) {
        return Buffer.from(JSON.stringify(data))
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static base64UrlDecode(str) {
        // Add padding back
        const pad = str.length % 4;
        const padded = pad ? str + '='.repeat(4 - pad) : str;

        return JSON.parse(
            Buffer.from(
                padded.replace(/-/g, '+').replace(/_/g, '/'),
                'base64'
            ).toString()
        );
    }

    // Create JWT
    static create(payload, expiresIn = '1h') {
        const header = {
            alg: this.ALGORITHM,
            typ: 'JWT'
        };

        // Parse expiry
        const expiryMs = this.parseExpiry(expiresIn);
        const now = Math.floor(Date.now() / 1000);

        const fullPayload = {
            ...payload,
            iat: now,
            exp: now + Math.floor(expiryMs / 1000),
            jti: crypto.randomBytes(16).toString('hex')  // Token ID for revocation
        };

        // Create signature
        const data = `${this.base64UrlEncode(header)}.${this.base64UrlEncode(fullPayload)}`;
        const signature = crypto
            .createHmac('sha256', this.SECRET)
            .update(data)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        return `${data}.${signature}`;
    }

    // Verify JWT
    static verify(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }

            const [headerB64, payloadB64, signatureB64] = parts;

            // Verify algorithm (prevent algorithm confusion attack)
            const header = this.base64UrlDecode(headerB64);
            if (header.alg !== this.ALGORITHM) {
                throw new Error('Invalid algorithm');
            }

            // Verify signature
            const data = `${headerB64}.${payloadB64}`;
            const expectedSignature = crypto
                .createHmac('sha256', this.SECRET)
                .update(data)
                .digest('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            if (!crypto.timingSafeEqual(
                Buffer.from(signatureB64),
                Buffer.from(expectedSignature)
            )) {
                throw new Error('Invalid signature');
            }

            // Decode payload
            const payload = this.base64UrlDecode(payloadB64);

            // Check expiration
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                throw new Error('Token expired');
            }

            // Check not before
            if (payload.nbf && payload.nbf > now) {
                throw new Error('Token not yet valid');
            }

            return { valid: true, payload };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    static parseExpiry(expiry) {
        const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
        const match = expiry.match(/^(\d+)([smhd])$/);
        if (!match) return 3600000; // Default 1 hour
        return parseInt(match[1]) * units[match[2]];
    }
}

// Demo
console.log("─── JWT Demo ───\n");
const token = JWTService.create({ userId: 123, role: 'admin' }, '1h');
console.log("Generated JWT:");
console.log(token.substring(0, 50) + "...\n");

const parts = token.split('.');
console.log("Header:", JWTService.base64UrlDecode(parts[0]));
console.log("Payload:", JWTService.base64UrlDecode(parts[1]));

console.log("\nVerification:", JWTService.verify(token));
console.log("Tampered:", JWTService.verify(token + 'x'));

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    JWT SECURITY BEST PRACTICES                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ❌ NEVER:                        ✅ ALWAYS:                            │
 * │   • Store JWT in localStorage      • Use HttpOnly cookies               │
 * │   • Use "none" algorithm           • Verify algorithm in code           │
 * │   • Use weak secrets               • Use strong random secrets          │
 * │   • Long expiration times          • Short expiry + refresh tokens      │
 * │   • Store sensitive data           • Minimal payload data               │
 * │                                                                          │
 * │   Token Storage Comparison:                                              │
 * │   ┌─────────────────┬───────────────┬─────────────────────────────────┐ │
 * │   │ Storage         │ XSS Safe?     │ CSRF Safe?                      │ │
 * │   ├─────────────────┼───────────────┼─────────────────────────────────┤ │
 * │   │ localStorage    │ ❌ No         │ ✅ Yes                          │ │
 * │   │ sessionStorage  │ ❌ No         │ ✅ Yes                          │ │
 * │   │ Cookie (normal) │ ❌ No         │ ❌ No                           │ │
 * │   │ Cookie (HttpOnly│ ✅ Yes        │ ❌ No (need CSRF token)         │ │
 * │   │ + SameSite)     │               │ ✅ Yes (with Strict)            │ │
 * │   └─────────────────┴───────────────┴─────────────────────────────────┘ │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Refresh Token Pattern
// ============================================================================
class TokenPair {
    static accessTokenExpiry = '15m';
    static refreshTokenExpiry = '7d';

    // In production, store refresh tokens in database
    static refreshTokens = new Map();

    static generate(userId) {
        const accessToken = JWTService.create(
            { userId, type: 'access' },
            this.accessTokenExpiry
        );

        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Store refresh token with metadata
        this.refreshTokens.set(refreshToken, {
            userId,
            createdAt: Date.now(),
            expiresAt: Date.now() + JWTService.parseExpiry(this.refreshTokenExpiry)
        });

        return { accessToken, refreshToken };
    }

    static refresh(refreshToken) {
        const stored = this.refreshTokens.get(refreshToken);

        if (!stored) {
            throw new Error('Invalid refresh token');
        }

        if (Date.now() > stored.expiresAt) {
            this.refreshTokens.delete(refreshToken);
            throw new Error('Refresh token expired');
        }

        // Generate new tokens
        const newTokens = this.generate(stored.userId);

        // Invalidate old refresh token (token rotation)
        this.refreshTokens.delete(refreshToken);

        return newTokens;
    }

    static revoke(refreshToken) {
        return this.refreshTokens.delete(refreshToken);
    }

    static revokeAll(userId) {
        for (const [token, data] of this.refreshTokens) {
            if (data.userId === userId) {
                this.refreshTokens.delete(token);
            }
        }
    }
}

console.log("\n─── Token Pair Demo ───\n");
const tokens = TokenPair.generate(123);
console.log("Access Token:", tokens.accessToken.substring(0, 40) + "...");
console.log("Refresh Token:", tokens.refreshToken.substring(0, 40) + "...");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SESSION SECURITY                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Session Security Measures:                                             │
 * │   ═══════════════════════════                                            │
 * │                                                                          │
 * │   1. Regenerate session ID on login                                     │
 * │   2. Secure cookie attributes                                           │
 * │   3. Session timeout (absolute and idle)                                │
 * │   4. Bind session to client fingerprint                                 │
 * │   5. Secure session storage                                             │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           SESSION SECURITY");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Secure Session Configuration
// ============================================================================
const sessionConfiguration = {
    name: 'sid',  // Custom name (not default 'connect.sid')
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    cookie: {
        httpOnly: true,     // Not accessible via JavaScript
        secure: true,       // HTTPS only
        sameSite: 'strict', // Prevent CSRF
        maxAge: 3600000,    // 1 hour
        path: '/',
        domain: undefined   // Current domain only
    },
    resave: false,
    saveUninitialized: false,
    rolling: true,  // Reset expiry on activity

    // Use secure session store in production
    // store: new RedisStore({ client: redisClient })
};

console.log("Secure Session Configuration:");
console.log(JSON.stringify(sessionConfiguration.cookie, null, 2));

// ============================================================================
// Session Management
// ============================================================================
class SessionManager {
    static sessions = new Map();

    static create(userId, metadata = {}) {
        const sessionId = crypto.randomBytes(32).toString('hex');

        this.sessions.set(sessionId, {
            userId,
            createdAt: Date.now(),
            lastActivity: Date.now(),
            userAgent: metadata.userAgent,
            ip: metadata.ip,
            // Fingerprint for session binding
            fingerprint: this.generateFingerprint(metadata)
        });

        return sessionId;
    }

    static validate(sessionId, metadata = {}) {
        const session = this.sessions.get(sessionId);

        if (!session) {
            return { valid: false, error: 'Session not found' };
        }

        // Check absolute timeout (e.g., 24 hours)
        const maxAge = 24 * 60 * 60 * 1000;
        if (Date.now() - session.createdAt > maxAge) {
            this.destroy(sessionId);
            return { valid: false, error: 'Session expired (absolute)' };
        }

        // Check idle timeout (e.g., 1 hour)
        const idleTimeout = 60 * 60 * 1000;
        if (Date.now() - session.lastActivity > idleTimeout) {
            this.destroy(sessionId);
            return { valid: false, error: 'Session expired (idle)' };
        }

        // Validate fingerprint (session binding)
        const currentFingerprint = this.generateFingerprint(metadata);
        if (session.fingerprint !== currentFingerprint) {
            this.destroy(sessionId);
            return { valid: false, error: 'Session hijacking detected' };
        }

        // Update last activity
        session.lastActivity = Date.now();

        return { valid: true, userId: session.userId };
    }

    static regenerate(oldSessionId, metadata = {}) {
        const session = this.sessions.get(oldSessionId);
        if (!session) return null;

        // Create new session with same data
        const newSessionId = this.create(session.userId, metadata);

        // Destroy old session
        this.destroy(oldSessionId);

        return newSessionId;
    }

    static destroy(sessionId) {
        return this.sessions.delete(sessionId);
    }

    static destroyAllForUser(userId) {
        for (const [sessionId, session] of this.sessions) {
            if (session.userId === userId) {
                this.sessions.delete(sessionId);
            }
        }
    }

    static generateFingerprint(metadata) {
        // Combine stable client attributes
        const data = [
            metadata.userAgent || '',
            // Don't use IP as it can change
        ].join('|');

        return crypto.createHash('sha256').update(data).digest('hex');
    }
}

// Demo
console.log("\n─── Session Management Demo ───\n");
const sessionId = SessionManager.create(123, {
    userAgent: 'Mozilla/5.0',
    ip: '192.168.1.1'
});
console.log("Created session:", sessionId.substring(0, 16) + "...");

const validation = SessionManager.validate(sessionId, {
    userAgent: 'Mozilla/5.0'
});
console.log("Validation:", validation);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    RATE LIMITING & BRUTE FORCE PREVENTION               │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Rate Limiter
// ============================================================================
class RateLimiter {
    constructor(options = {}) {
        this.windowMs = options.windowMs || 15 * 60 * 1000;  // 15 minutes
        this.maxAttempts = options.maxAttempts || 100;
        this.store = new Map();
    }

    // Clean expired entries
    cleanup() {
        const now = Date.now();
        for (const [key, data] of this.store) {
            if (now > data.resetTime) {
                this.store.delete(key);
            }
        }
    }

    // Check and increment
    check(key) {
        this.cleanup();

        const now = Date.now();
        let record = this.store.get(key);

        if (!record || now > record.resetTime) {
            record = {
                count: 0,
                resetTime: now + this.windowMs
            };
        }

        record.count++;
        this.store.set(key, record);

        const remaining = Math.max(0, this.maxAttempts - record.count);
        const allowed = record.count <= this.maxAttempts;

        return {
            allowed,
            remaining,
            resetTime: record.resetTime,
            retryAfter: allowed ? 0 : Math.ceil((record.resetTime - now) / 1000)
        };
    }

    // Reset counter (on successful login)
    reset(key) {
        this.store.delete(key);
    }
}

// ============================================================================
// Login Attempt Tracker
// ============================================================================
class LoginAttemptTracker {
    static limiter = new RateLimiter({ maxAttempts: 5, windowMs: 15 * 60 * 1000 });
    static accountLocks = new Map();

    static recordAttempt(identifier, success) {
        if (success) {
            this.limiter.reset(identifier);
            return { allowed: true };
        }

        const result = this.limiter.check(identifier);

        // Lock account after too many failures
        if (!result.allowed) {
            this.accountLocks.set(identifier, {
                lockedUntil: Date.now() + 30 * 60 * 1000  // 30 minutes
            });
        }

        return result;
    }

    static isLocked(identifier) {
        const lock = this.accountLocks.get(identifier);
        if (!lock) return false;

        if (Date.now() > lock.lockedUntil) {
            this.accountLocks.delete(identifier);
            return false;
        }

        return true;
    }
}

console.log("\n─── Rate Limiting Demo ───\n");
const rateLimiter = new RateLimiter({ maxAttempts: 3, windowMs: 60000 });
for (let i = 1; i <= 5; i++) {
    const result = rateLimiter.check('user@example.com');
    console.log(`Attempt ${i}:`, result.allowed ? '✅ Allowed' : '❌ Blocked',
        `(${result.remaining} remaining)`);
}

// ============================================================================
// Authentication Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           AUTHENTICATION SECURITY CHEAT SHEET                   ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  PASSWORD SECURITY:                                              ║");
console.log("║  • Hash with bcrypt/scrypt/Argon2 (never MD5/SHA)               ║");
console.log("║  • Minimum 12 characters with complexity requirements           ║");
console.log("║  • Use password breach databases (HaveIBeenPwned)               ║");
console.log("║  • Implement account lockout after failed attempts              ║");
console.log("║                                                                  ║");
console.log("║  JWT SECURITY:                                                   ║");
console.log("║  • Verify algorithm explicitly in code                          ║");
console.log("║  • Use short expiry (15-30 min) with refresh tokens             ║");
console.log("║  • Store in HttpOnly cookies (not localStorage)                 ║");
console.log("║  • Include jti claim for revocation                             ║");
console.log("║                                                                  ║");
console.log("║  SESSION SECURITY:                                               ║");
console.log("║  • Regenerate session ID on login                               ║");
console.log("║  • Use secure cookie attributes (HttpOnly, Secure, SameSite)    ║");
console.log("║  • Implement idle and absolute timeouts                         ║");
console.log("║  • Store sessions securely (Redis with encryption)              ║");
console.log("║                                                                  ║");
console.log("║  BRUTE FORCE PREVENTION:                                         ║");
console.log("║  • Rate limit login attempts (per IP and account)               ║");
console.log("║  • Progressive delays after failed attempts                     ║");
console.log("║  • CAPTCHA after multiple failures                              ║");
console.log("║  • Alert users of failed login attempts                         ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    PasswordService,
    JWTService,
    TokenPair,
    SessionManager,
    RateLimiter,
    LoginAttemptTracker,
    sessionConfiguration
};

console.log("═══ Next: Secure Coding Practices ═══");
console.log("Run: node deep-dive/javaScript-security/06-secure-coding.js");
