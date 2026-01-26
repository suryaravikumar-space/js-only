/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT SECURITY - Secure Coding Practices
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Defensive programming practices to prevent security vulnerabilities.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    OWASP TOP 10 OVERVIEW (2021)                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   A01: Broken Access Control                                            │
 * │   A02: Cryptographic Failures                                           │
 * │   A03: Injection                                                         │
 * │   A04: Insecure Design                                                  │
 * │   A05: Security Misconfiguration                                        │
 * │   A06: Vulnerable Components                                            │
 * │   A07: Authentication Failures                                          │
 * │   A08: Software/Data Integrity Failures                                 │
 * │   A09: Security Logging Failures                                        │
 * │   A10: Server-Side Request Forgery (SSRF)                              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const crypto = require('crypto');
const path = require('path');

console.log("═══════════════════════════════════════════════════════════════");
console.log("           SECURE CODING PRACTICES");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    INPUT VALIDATION                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Rule: Never trust user input. Validate, sanitize, then use.          │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  VALIDATION STRATEGY                            │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   User Input ──► Type Check ──► Format Check ──► Range Check ──► Use   │
 * │                      │              │               │                   │
 * │                      ▼              ▼               ▼                   │
 * │                   Reject if     Reject if       Reject if              │
 * │                   wrong type    malformed       out of range           │
 * │                                                                          │
 * │   Whitelist > Blacklist:                                                │
 * │   • Define what IS allowed, not what ISN'T                             │
 * │   • Easier to maintain, harder to bypass                               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Input Validation Framework
// ============================================================================
class Validator {
    static rules = {
        // Type validators
        isString: (v) => typeof v === 'string',
        isNumber: (v) => typeof v === 'number' && !isNaN(v),
        isBoolean: (v) => typeof v === 'boolean',
        isArray: (v) => Array.isArray(v),
        isObject: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),

        // String validators
        minLength: (min) => (v) => typeof v === 'string' && v.length >= min,
        maxLength: (max) => (v) => typeof v === 'string' && v.length <= max,
        pattern: (regex) => (v) => typeof v === 'string' && regex.test(v),

        // Number validators
        min: (min) => (v) => typeof v === 'number' && v >= min,
        max: (max) => (v) => typeof v === 'number' && v <= max,
        integer: (v) => Number.isInteger(v),

        // Common patterns
        email: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
        alphanumeric: (v) => /^[a-zA-Z0-9]+$/.test(v),
        uuid: (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v),
        slug: (v) => /^[a-z0-9-]+$/.test(v),
        url: (v) => {
            try {
                new URL(v);
                return true;
            } catch {
                return false;
            }
        }
    };

    static validate(value, rules) {
        const errors = [];

        for (const [ruleName, ruleArg] of Object.entries(rules)) {
            let validator = this.rules[ruleName];

            if (typeof validator === 'function') {
                // Simple validator
                if (typeof ruleArg === 'boolean' && ruleArg) {
                    if (!validator(value)) {
                        errors.push(`Failed ${ruleName} validation`);
                    }
                }
                // Parameterized validator
                else if (typeof ruleArg !== 'boolean') {
                    const paramValidator = validator(ruleArg);
                    if (!paramValidator(value)) {
                        errors.push(`Failed ${ruleName}(${ruleArg}) validation`);
                    }
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    static sanitize(value, type = 'string') {
        switch (type) {
            case 'string':
                return String(value).trim();
            case 'number':
                const num = Number(value);
                return isNaN(num) ? 0 : num;
            case 'boolean':
                return Boolean(value);
            case 'email':
                return String(value).toLowerCase().trim();
            case 'html':
                return String(value)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;');
            default:
                return value;
        }
    }
}

// Demo
console.log("─── Input Validation Demo ───\n");
console.log("Email validation:");
console.log("  'test@example.com':", Validator.validate('test@example.com', { email: true }));
console.log("  'invalid-email':", Validator.validate('invalid-email', { email: true }));

console.log("\nString length validation:");
console.log("  'hello' (min 3, max 10):", Validator.validate('hello', { minLength: 3, maxLength: 10 }));
console.log("  'hi' (min 3):", Validator.validate('hi', { minLength: 3 }));

console.log("\nSanitization:");
console.log("  HTML sanitize '<script>':", Validator.sanitize('<script>alert(1)</script>', 'html'));

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ACCESS CONTROL                                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Principle of Least Privilege:                                         │
 * │   Users should only have access to what they need.                      │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │              RBAC vs ABAC                                       │   │
 * │   ├────────────────────┬────────────────────────────────────────────┤   │
 * │   │ RBAC               │ ABAC                                       │   │
 * │   │ (Role-Based)       │ (Attribute-Based)                          │   │
 * │   ├────────────────────┼────────────────────────────────────────────┤   │
 * │   │ User has roles     │ Policies based on attributes              │   │
 * │   │ Roles have perms   │ User attrs, resource attrs, context       │   │
 * │   │ Simple hierarchy   │ Complex, flexible policies                │   │
 * │   │ Easy to manage     │ Fine-grained control                       │   │
 * │   └────────────────────┴────────────────────────────────────────────┘   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           ACCESS CONTROL");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Role-Based Access Control (RBAC)
// ============================================================================
class RBAC {
    constructor() {
        this.roles = new Map();
        this.userRoles = new Map();
    }

    // Define role with permissions
    defineRole(roleName, permissions) {
        this.roles.set(roleName, new Set(permissions));
    }

    // Inherit permissions from another role
    extendRole(roleName, baseRole, additionalPermissions = []) {
        const basePerms = this.roles.get(baseRole) || new Set();
        const newPerms = new Set([...basePerms, ...additionalPermissions]);
        this.roles.set(roleName, newPerms);
    }

    // Assign role to user
    assignRole(userId, roleName) {
        if (!this.userRoles.has(userId)) {
            this.userRoles.set(userId, new Set());
        }
        this.userRoles.get(userId).add(roleName);
    }

    // Check permission
    can(userId, permission) {
        const roles = this.userRoles.get(userId);
        if (!roles) return false;

        for (const role of roles) {
            const permissions = this.roles.get(role);
            if (permissions && permissions.has(permission)) {
                return true;
            }
        }
        return false;
    }

    // Authorization middleware
    authorize(permission) {
        return (req, res, next) => {
            if (!this.can(req.user?.id, permission)) {
                console.log(`❌ Access denied: ${permission}`);
                // return res.status(403).json({ error: 'Forbidden' });
                return { allowed: false };
            }
            console.log(`✅ Access granted: ${permission}`);
            return { allowed: true };
        };
    }
}

// Demo
const rbac = new RBAC();
rbac.defineRole('user', ['read:posts', 'create:posts', 'edit:own_posts']);
rbac.defineRole('moderator', ['read:posts', 'create:posts', 'edit:any_posts', 'delete:posts']);
rbac.extendRole('admin', 'moderator', ['manage:users', 'manage:settings']);

rbac.assignRole('user123', 'user');
rbac.assignRole('mod456', 'moderator');
rbac.assignRole('admin789', 'admin');

console.log("─── RBAC Demo ───\n");
console.log("User can read posts:", rbac.can('user123', 'read:posts'));
console.log("User can delete posts:", rbac.can('user123', 'delete:posts'));
console.log("Moderator can delete posts:", rbac.can('mod456', 'delete:posts'));
console.log("Admin can manage users:", rbac.can('admin789', 'manage:users'));

// ============================================================================
// Ownership-Based Access Control
// ============================================================================
class ResourceAccessControl {
    static async canAccess(userId, resourceId, action, getResource) {
        const resource = await getResource(resourceId);

        if (!resource) {
            return { allowed: false, reason: 'Resource not found' };
        }

        // Check ownership
        if (resource.ownerId === userId) {
            return { allowed: true, reason: 'Owner access' };
        }

        // Check if resource is public
        if (action === 'read' && resource.isPublic) {
            return { allowed: true, reason: 'Public resource' };
        }

        // Check shared access
        if (resource.sharedWith?.includes(userId)) {
            const shareLevel = resource.sharePermissions?.[userId];
            if (this.permissionIncludes(shareLevel, action)) {
                return { allowed: true, reason: 'Shared access' };
            }
        }

        return { allowed: false, reason: 'Access denied' };
    }

    static permissionIncludes(level, action) {
        const levels = {
            'view': ['read'],
            'edit': ['read', 'write'],
            'admin': ['read', 'write', 'delete', 'share']
        };
        return levels[level]?.includes(action) || false;
    }
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SECURE DATA HANDLING                                  │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           SECURE DATA HANDLING");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Sensitive Data Protection
// ============================================================================
class SensitiveDataHandler {
    static sensitiveFields = new Set([
        'password', 'ssn', 'creditCard', 'secret', 'token', 'apiKey',
        'privateKey', 'pin', 'cvv', 'bankAccount'
    ]);

    // Redact sensitive fields from logs
    static redact(obj, depth = 0) {
        if (depth > 10) return '[MAX_DEPTH]';
        if (obj === null || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => this.redact(item, depth + 1));
        }

        const redacted = {};
        for (const [key, value] of Object.entries(obj)) {
            if (this.sensitiveFields.has(key.toLowerCase())) {
                redacted[key] = '[REDACTED]';
            } else if (typeof value === 'object') {
                redacted[key] = this.redact(value, depth + 1);
            } else {
                redacted[key] = value;
            }
        }
        return redacted;
    }

    // Mask partial data for display
    static mask(value, type) {
        switch (type) {
            case 'email':
                const [user, domain] = String(value).split('@');
                return `${user[0]}***@${domain}`;
            case 'phone':
                return String(value).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            case 'creditCard':
                return String(value).replace(/\d(?=\d{4})/g, '*');
            case 'ssn':
                return '***-**-' + String(value).slice(-4);
            default:
                return '*'.repeat(String(value).length);
        }
    }

    // Secure comparison (constant-time)
    static secureCompare(a, b) {
        if (typeof a !== 'string' || typeof b !== 'string') return false;
        if (a.length !== b.length) return false;

        return crypto.timingSafeEqual(
            Buffer.from(a),
            Buffer.from(b)
        );
    }
}

// Demo
console.log("─── Sensitive Data Handling ───\n");
const userData = {
    name: 'John',
    email: 'john@example.com',
    password: 'secret123',
    creditCard: '4111111111111111',
    profile: {
        apiKey: 'sk_live_xxx123'
    }
};

console.log("Original:", userData);
console.log("Redacted:", SensitiveDataHandler.redact(userData));

console.log("\nMasking:");
console.log("Email:", SensitiveDataHandler.mask('john@example.com', 'email'));
console.log("Credit Card:", SensitiveDataHandler.mask('4111111111111111', 'creditCard'));
console.log("SSN:", SensitiveDataHandler.mask('123-45-6789', 'ssn'));

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ERROR HANDLING                                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Secure Error Handling Principles:                                     │
 * │   1. Don't expose internal details to users                             │
 * │   2. Log full details for debugging                                     │
 * │   3. Use generic messages for external errors                           │
 * │   4. Never include stack traces in production                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Secure Error Handler
// ============================================================================
class SecureErrorHandler {
    static isDevelopment = process.env.NODE_ENV === 'development';

    // Define safe error messages
    static errorMessages = {
        VALIDATION_ERROR: 'Invalid input provided',
        AUTHENTICATION_ERROR: 'Authentication failed',
        AUTHORIZATION_ERROR: 'Access denied',
        NOT_FOUND: 'Resource not found',
        RATE_LIMIT: 'Too many requests, please try again later',
        INTERNAL_ERROR: 'An unexpected error occurred',
        DATABASE_ERROR: 'Service temporarily unavailable'
    };

    static handle(error, req) {
        // Generate error ID for tracking
        const errorId = crypto.randomBytes(8).toString('hex');

        // Log full error details
        console.error(`[${errorId}] Error:`, {
            message: error.message,
            stack: error.stack,
            path: req?.path,
            method: req?.method,
            userId: req?.user?.id,
            timestamp: new Date().toISOString()
        });

        // Return safe error response
        const safeMessage = this.getSafeMessage(error);

        return {
            error: true,
            message: safeMessage,
            errorId,  // For support reference
            ...(this.isDevelopment && { debug: error.message })
        };
    }

    static getSafeMessage(error) {
        // Map error types to safe messages
        if (error.name === 'ValidationError') {
            return this.errorMessages.VALIDATION_ERROR;
        }
        if (error.name === 'UnauthorizedError') {
            return this.errorMessages.AUTHENTICATION_ERROR;
        }
        if (error.code === 'ENOENT') {
            return this.errorMessages.NOT_FOUND;
        }
        // Default to generic message
        return this.errorMessages.INTERNAL_ERROR;
    }
}

console.log("\n─── Secure Error Handling ───\n");
try {
    throw new Error('Database connection failed: host=localhost, user=admin, password=secret');
} catch (e) {
    const response = SecureErrorHandler.handle(e, { path: '/api/users', method: 'GET' });
    console.log("User sees:", response);
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SECURE LOGGING                                        │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Security Logger
// ============================================================================
class SecurityLogger {
    static levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, CRITICAL: 4 };

    static log(level, event, data) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            event,
            data: SensitiveDataHandler.redact(data)
        };

        console.log(JSON.stringify(entry));
        return entry;
    }

    // Security events to log
    static loginAttempt(userId, success, ip, userAgent) {
        this.log(success ? 'INFO' : 'WARN', 'LOGIN_ATTEMPT', {
            userId,
            success,
            ip,
            userAgent,
            ...(success ? {} : { failureReason: 'Invalid credentials' })
        });
    }

    static accessDenied(userId, resource, action) {
        this.log('WARN', 'ACCESS_DENIED', { userId, resource, action });
    }

    static suspiciousActivity(type, details) {
        this.log('CRITICAL', 'SUSPICIOUS_ACTIVITY', { type, ...details });
    }

    static configChange(userId, setting, oldValue, newValue) {
        this.log('INFO', 'CONFIG_CHANGE', {
            userId,
            setting,
            oldValue: '[REDACTED]',
            newValue: '[REDACTED]'
        });
    }
}

console.log("\n─── Security Logging ───\n");
SecurityLogger.loginAttempt('user123', true, '192.168.1.1', 'Mozilla/5.0');
SecurityLogger.accessDenied('user456', '/admin/settings', 'write');
SecurityLogger.suspiciousActivity('SQL_INJECTION_ATTEMPT', {
    payload: "' OR '1'='1",
    ip: '10.0.0.1'
});

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DEPENDENCY SECURITY                                   │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           DEPENDENCY SECURITY");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("Security Audit Commands:");
console.log("  npm audit              - Check for known vulnerabilities");
console.log("  npm audit fix          - Auto-fix vulnerabilities");
console.log("  npm outdated           - Check for outdated packages");
console.log("  npx snyk test          - Deep vulnerability scanning");

console.log("\nPackage-lock.json:");
console.log("  • Always commit package-lock.json");
console.log("  • Ensures consistent dependency versions");
console.log("  • Prevents supply chain attacks via version manipulation");

console.log("\nDependency Best Practices:");
console.log("  • Minimize dependencies");
console.log("  • Review new dependencies before adding");
console.log("  • Use lockfile for deterministic installs");
console.log("  • Set up automated security scanning in CI/CD");
console.log("  • Use npm ci instead of npm install in production");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SECURE CONFIGURATION                                  │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Environment Configuration
// ============================================================================
class SecureConfig {
    static requiredEnvVars = [
        'NODE_ENV',
        'DATABASE_URL',
        'JWT_SECRET',
        'SESSION_SECRET'
    ];

    static validate() {
        const missing = this.requiredEnvVars.filter(v => !process.env[v]);

        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }

        // Validate secret strength
        const secrets = ['JWT_SECRET', 'SESSION_SECRET'];
        for (const secret of secrets) {
            if (process.env[secret]?.length < 32) {
                throw new Error(`${secret} must be at least 32 characters`);
            }
        }

        console.log("✅ Environment configuration validated");
    }

    static get(key, defaultValue) {
        const value = process.env[key];
        if (value === undefined) {
            if (defaultValue === undefined) {
                throw new Error(`Missing required config: ${key}`);
            }
            return defaultValue;
        }
        return value;
    }

    // Never expose secrets
    static getPublicConfig() {
        return {
            nodeEnv: process.env.NODE_ENV,
            apiUrl: process.env.API_URL,
            // Never include secrets here
        };
    }
}

// ============================================================================
// Secure Coding Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           SECURE CODING CHEAT SHEET                             ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  INPUT VALIDATION:                                               ║");
console.log("║  • Validate type, format, length, range                         ║");
console.log("║  • Whitelist allowed characters, not blacklist                  ║");
console.log("║  • Sanitize before use, encode for output context              ║");
console.log("║                                                                  ║");
console.log("║  ACCESS CONTROL:                                                 ║");
console.log("║  • Implement RBAC or ABAC                                       ║");
console.log("║  • Check ownership for resource access                          ║");
console.log("║  • Default deny, explicit allow                                 ║");
console.log("║                                                                  ║");
console.log("║  DATA PROTECTION:                                                ║");
console.log("║  • Redact sensitive data in logs                                ║");
console.log("║  • Use constant-time comparison for secrets                     ║");
console.log("║  • Encrypt sensitive data at rest and in transit               ║");
console.log("║                                                                  ║");
console.log("║  ERROR HANDLING:                                                 ║");
console.log("║  • Generic messages to users, detailed logs internally         ║");
console.log("║  • Include error IDs for tracking                               ║");
console.log("║  • Never expose stack traces in production                      ║");
console.log("║                                                                  ║");
console.log("║  DEPENDENCIES:                                                   ║");
console.log("║  • Run npm audit regularly                                      ║");
console.log("║  • Use lockfile and npm ci                                      ║");
console.log("║  • Review dependencies before adding                            ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    Validator,
    RBAC,
    ResourceAccessControl,
    SensitiveDataHandler,
    SecureErrorHandler,
    SecurityLogger,
    SecureConfig
};

console.log("═══ Next: Cryptography Basics ═══");
console.log("Run: node deep-dive/javaScript-security/07-cryptography.js");
