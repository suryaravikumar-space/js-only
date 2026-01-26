/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT SECURITY - Prototype Pollution
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Prototype pollution is a JavaScript-specific vulnerability where an attacker
 * modifies Object.prototype, affecting all objects in the application.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PROTOTYPE CHAIN OVERVIEW                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  JAVASCRIPT PROTOTYPE CHAIN                     │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   const obj = { name: 'test' };                                         │
 * │                                                                          │
 * │   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐         │
 * │   │     obj      │─────►│Object.proto- │─────►│    null      │         │
 * │   │              │      │    type      │      │              │         │
 * │   │ name: 'test' │      │              │      │              │         │
 * │   │              │      │ toString()   │      │              │         │
 * │   │              │      │ hasOwnProp() │      │              │         │
 * │   └──────────────┘      └──────────────┘      └──────────────┘         │
 * │         ▲                     ▲                     ▲                   │
 * │         │                     │                     │                   │
 * │    Instance              Prototype                 End                  │
 * │                                                                          │
 * │   Property Lookup:                                                       │
 * │   1. Check obj.name         → Found: 'test'                             │
 * │   2. Check obj.toString     → Not on obj                                │
 * │   3. Check Object.prototype → Found: toString()                         │
 * │                                                                          │
 * │   ⚠️  If Object.prototype is polluted, ALL objects are affected!       │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           PROTOTYPE POLLUTION VULNERABILITY");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    POLLUTION ATTACK VECTORS                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   1. Object merge operations                                            │
 * │   2. Deep clone functions                                               │
 * │   3. Object property assignment from user input                         │
 * │   4. JSON parsing with key manipulation                                 │
 * │   5. Query string parsing                                               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// DEMONSTRATION: How Prototype Pollution Works
// ============================================================================
function demonstratePollution() {
    console.log("─── Prototype Pollution Demo ───\n");

    // Create a clean object
    const cleanObj = {};
    console.log("Before pollution:");
    console.log(`  cleanObj.isAdmin: ${cleanObj.isAdmin}`);  // undefined

    // Pollute the prototype (THIS IS THE ATTACK)
    // Object.prototype.isAdmin = true;

    // Now ALL objects have isAdmin = true
    // console.log("After pollution:");
    // console.log(`  cleanObj.isAdmin: ${cleanObj.isAdmin}`);  // true!
    // console.log(`  {}.isAdmin: ${({}).isAdmin}`);            // true!

    console.log("\n⚠️  After Object.prototype.isAdmin = true:");
    console.log("  Every new {} would have isAdmin = true!");
    console.log("  This bypasses authentication checks!\n");
}

demonstratePollution();

// ============================================================================
// VULNERABLE: Unsafe Object Merge
// ============================================================================
function vulnerableMerge(target, source) {
    // NEVER DO THIS with untrusted input!
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            vulnerableMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// Attack payload
const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true}}');

console.log("─── Vulnerable Merge Attack ───");
console.log("Malicious payload:", JSON.stringify(maliciousPayload));
console.log("If merged: Object.prototype.isAdmin would become true!\n");

// ============================================================================
// VULNERABLE: Lodash _.merge (older versions)
// ============================================================================
const lodashVulnerabilityExample = `
// Vulnerable in lodash < 4.17.12
const _ = require('lodash');

// Attacker sends this JSON:
const payload = JSON.parse('{"__proto__": {"polluted": true}}');

// Merge with an object
_.merge({}, payload);

// Now EVERY object has 'polluted' property
console.log({}.polluted);  // true!
`;

console.log("─── Lodash Vulnerability Example ───");
console.log("Vulnerable versions: lodash < 4.17.12");
console.log("Attack: _.merge({}, {__proto__: {isAdmin: true}})\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PROTOTYPE POLLUTION IMPACTS                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  POTENTIAL EXPLOITS                             │   │
 * │   ├─────────────────────────────────────────────────────────────────┤   │
 * │   │                                                                 │   │
 * │   │   1. Authentication Bypass                                     │   │
 * │   │      pollute: { isAdmin: true, role: 'admin' }                │   │
 * │   │                                                                 │   │
 * │   │   2. Remote Code Execution (RCE)                               │   │
 * │   │      Via template engines, child_process options              │   │
 * │   │                                                                 │   │
 * │   │   3. Denial of Service (DoS)                                   │   │
 * │   │      Override critical methods like toString()                │   │
 * │   │                                                                 │   │
 * │   │   4. Property Injection                                        │   │
 * │   │      Add malicious properties to all objects                  │   │
 * │   │                                                                 │   │
 * │   │   5. SQL/NoSQL Injection via ORM                               │   │
 * │   │      Manipulate query builders through prototypes             │   │
 * │   │                                                                 │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// IMPACT: Authentication Bypass
// ============================================================================
function authenticationBypass() {
    console.log("─── Authentication Bypass Example ───\n");

    // Vulnerable authentication check
    function checkAccess(user) {
        // If user.isAdmin doesn't exist, it checks prototype!
        if (user.isAdmin) {
            return 'ADMIN ACCESS GRANTED';
        }
        return 'ACCESS DENIED';
    }

    const normalUser = { name: 'John', role: 'user' };
    console.log("Normal user:", checkAccess(normalUser));  // DENIED

    // After pollution: Object.prototype.isAdmin = true;
    // const pollutedUser = { name: 'Attacker' };
    // checkAccess(pollutedUser);  // ADMIN ACCESS GRANTED!

    console.log("After pollution: Any user object gains isAdmin!\n");
}

authenticationBypass();

// ============================================================================
// IMPACT: RCE via child_process
// ============================================================================
const rceExample = `
// If shell option is polluted to true:
Object.prototype.shell = true;

// execSync now uses shell, allowing injection
const { execSync } = require('child_process');
execSync('id', { input: '' });  // Safe normally

// With shell: true and polluted env:
Object.prototype.env = { NODE_OPTIONS: '--require /tmp/evil.js' };
// Node processes load attacker's code!
`;

console.log("─── RCE via Prototype Pollution ───");
console.log("Polluting 'shell' or 'env' can lead to RCE");
console.log("Affects: child_process, spawn options\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PREVENTION STRATEGIES                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   1. Block dangerous keys (__proto__, constructor, prototype)           │
 * │   2. Use Object.create(null) for dictionaries                           │
 * │   3. Use Map instead of plain objects                                   │
 * │   4. Freeze Object.prototype                                            │
 * │   5. Use hasOwnProperty checks                                          │
 * │   6. Update vulnerable libraries                                        │
 * │   7. Use schema validation                                              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           PROTOTYPE POLLUTION PREVENTION");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// SECURE: Block Dangerous Keys
// ============================================================================
function safeMerge(target, source) {
    const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

    for (const key in source) {
        // Block dangerous keys
        if (DANGEROUS_KEYS.includes(key)) {
            console.log(`⚠️  Blocked dangerous key: ${key}`);
            continue;
        }

        // Only copy own properties
        if (!Object.prototype.hasOwnProperty.call(source, key)) {
            continue;
        }

        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            safeMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

console.log("─── Safe Merge Function ───");
const safeResult = safeMerge({}, JSON.parse('{"__proto__": {"evil": true}, "name": "safe"}'));
console.log("Result:", safeResult);
console.log("Object.prototype.evil:", ({}).evil, "\n");  // undefined

// ============================================================================
// SECURE: Object.create(null)
// ============================================================================
function useNullPrototype() {
    // Objects with null prototype have no __proto__
    const safeDict = Object.create(null);

    // No prototype chain
    console.log("─── Object.create(null) ───");
    console.log("safeDict.__proto__:", safeDict.__proto__);  // undefined
    console.log("safeDict.hasOwnProperty:", safeDict.hasOwnProperty);  // undefined

    // Safe to use as dictionary
    safeDict.key = 'value';
    safeDict['__proto__'] = { attack: true };  // Just a normal property!

    console.log("safeDict['__proto__']:", safeDict['__proto__']);
    console.log("Object.prototype affected:", Object.prototype.attack, "\n");  // undefined
}

useNullPrototype();

// ============================================================================
// SECURE: Use Map instead of Object
// ============================================================================
function useMap() {
    console.log("─── Map Instead of Object ───");

    const safeMap = new Map();

    // __proto__ is just a key, doesn't affect prototype
    safeMap.set('__proto__', { attack: true });
    safeMap.set('constructor', { attack: true });

    console.log("Map.get('__proto__'):", safeMap.get('__proto__'));
    console.log("Object.prototype affected:", Object.prototype.attack);  // undefined
    console.log("");
}

useMap();

// ============================================================================
// SECURE: Freeze Object.prototype
// ============================================================================
function freezePrototype() {
    console.log("─── Freeze Object.prototype ───");

    // In application startup:
    // Object.freeze(Object.prototype);

    // Now prototype cannot be modified
    // Object.prototype.isAdmin = true;  // Throws in strict mode, silently fails otherwise

    console.log("Object.freeze(Object.prototype) prevents modifications");
    console.log("Note: May break some libraries that extend Object.prototype\n");
}

freezePrototype();

// ============================================================================
// SECURE: JSON Schema Validation
// ============================================================================
class SchemaValidator {
    static schemas = {
        user: {
            type: 'object',
            properties: {
                name: { type: 'string', maxLength: 100 },
                email: { type: 'string', format: 'email' },
                age: { type: 'number', minimum: 0, maximum: 150 }
            },
            required: ['name', 'email'],
            additionalProperties: false  // Reject unknown properties!
        }
    };

    static validate(data, schemaName) {
        const schema = this.schemas[schemaName];
        if (!schema) throw new Error(`Unknown schema: ${schemaName}`);

        // Check for prototype pollution keys
        const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
        const checkForDangerous = (obj, path = '') => {
            if (typeof obj !== 'object' || obj === null) return;

            for (const key of Object.keys(obj)) {
                if (dangerousKeys.includes(key)) {
                    throw new Error(`Dangerous key blocked: ${path}${key}`);
                }
                checkForDangerous(obj[key], `${path}${key}.`);
            }
        };

        checkForDangerous(data);

        // Additional validation based on schema...
        console.log("✅ Schema validation passed");
        return true;
    }
}

console.log("─── Schema Validation ───");
try {
    SchemaValidator.validate({ name: 'John', email: 'john@example.com' }, 'user');
} catch (e) {
    console.log("Error:", e.message);
}

try {
    SchemaValidator.validate({ __proto__: { isAdmin: true } }, 'user');
} catch (e) {
    console.log("Blocked:", e.message);
}
console.log("");

// ============================================================================
// SECURE: Safe Property Access
// ============================================================================
class SafeObject {
    // Check if property exists on object itself, not prototype
    static has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    // Get property only if it's own property
    static get(obj, key) {
        return this.has(obj, key) ? obj[key] : undefined;
    }

    // Safe iteration
    static *keys(obj) {
        for (const key of Object.keys(obj)) {
            if (this.has(obj, key)) {
                yield key;
            }
        }
    }

    // Safe assignment with key validation
    static set(obj, key, value) {
        const dangerous = ['__proto__', 'constructor', 'prototype'];
        if (dangerous.includes(key)) {
            throw new Error(`Cannot set dangerous property: ${key}`);
        }
        obj[key] = value;
        return obj;
    }
}

console.log("─── Safe Object Operations ───");
const obj = { name: 'test' };
console.log("SafeObject.has(obj, 'name'):", SafeObject.has(obj, 'name'));
console.log("SafeObject.has(obj, 'toString'):", SafeObject.has(obj, 'toString'));

try {
    SafeObject.set(obj, '__proto__', { evil: true });
} catch (e) {
    console.log("Blocked:", e.message);
}
console.log("");

// ============================================================================
// SECURE: Deep Clone Without Pollution
// ============================================================================
function safeDeepClone(obj, seen = new WeakMap()) {
    // Handle primitives and null
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Handle circular references
    if (seen.has(obj)) {
        return seen.get(obj);
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        const clone = [];
        seen.set(obj, clone);
        for (let i = 0; i < obj.length; i++) {
            clone[i] = safeDeepClone(obj[i], seen);
        }
        return clone;
    }

    // Handle objects
    const clone = Object.create(null);  // No prototype!
    seen.set(obj, clone);

    for (const key of Object.keys(obj)) {
        // Skip dangerous keys
        if (['__proto__', 'constructor', 'prototype'].includes(key)) {
            continue;
        }

        // Only copy own properties
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = safeDeepClone(obj[key], seen);
        }
    }

    return clone;
}

console.log("─── Safe Deep Clone ───");
const malicious = JSON.parse('{"__proto__": {"polluted": true}, "safe": "value"}');
const cloned = safeDeepClone(malicious);
console.log("Cloned object:", cloned);
console.log("Pollution check:", ({}).polluted, "\n");  // undefined

// ============================================================================
// Libraries with Known Vulnerabilities
// ============================================================================
console.log("─── Vulnerable Libraries (Update These!) ───");
const vulnerableLibs = [
    { name: 'lodash', fix: '>= 4.17.12', method: 'merge, defaultsDeep' },
    { name: 'jQuery', fix: '>= 3.4.0', method: '$.extend' },
    { name: 'underscore', fix: '>= 1.12.1', method: 'extend' },
    { name: 'hoek', fix: '>= 6.1.3', method: 'merge' },
    { name: 'set-value', fix: '>= 4.0.0', method: 'set' },
    { name: 'mixin-deep', fix: '>= 2.0.1', method: 'mixin' },
    { name: 'merge-deep', fix: '>= 3.0.3', method: 'merge' }
];

vulnerableLibs.forEach(lib => {
    console.log(`  ${lib.name}: ${lib.method} - Fix: ${lib.fix}`);
});

// ============================================================================
// Prototype Pollution Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           PROTOTYPE POLLUTION PREVENTION CHEAT SHEET            ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  DETECTION:                                                      ║");
console.log("║  • Check for __proto__, constructor, prototype in user input   ║");
console.log("║  • Audit merge/extend/clone functions                           ║");
console.log("║  • Use npm audit to find vulnerable packages                    ║");
console.log("║                                                                  ║");
console.log("║  PREVENTION:                                                     ║");
console.log("║  • Block __proto__, constructor, prototype keys                 ║");
console.log("║  • Use Object.create(null) for dictionaries                     ║");
console.log("║  • Use Map/Set instead of plain objects                         ║");
console.log("║  • Use Object.hasOwnProperty.call() for checks                  ║");
console.log("║  • Consider Object.freeze(Object.prototype)                     ║");
console.log("║  • Update vulnerable libraries immediately                      ║");
console.log("║  • Validate JSON schemas, reject unknown properties             ║");
console.log("║                                                                  ║");
console.log("║  SAFE PATTERNS:                                                  ║");
console.log("║  • const dict = Object.create(null);                            ║");
console.log("║  • const map = new Map();                                       ║");
console.log("║  • if (Object.hasOwn(obj, key)) { ... }                         ║");
console.log("║  • Filter keys before merge operations                          ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

// ============================================================================
// Comprehensive Safe Merge Implementation
// ============================================================================
class SafeObjectMerger {
    static DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

    static isDangerous(key) {
        return this.DANGEROUS_KEYS.has(key);
    }

    static merge(target, ...sources) {
        for (const source of sources) {
            if (!source || typeof source !== 'object') continue;

            for (const key of Object.keys(source)) {
                // Skip dangerous keys
                if (this.isDangerous(key)) {
                    console.warn(`Blocked dangerous key: ${key}`);
                    continue;
                }

                const sourceValue = source[key];
                const targetValue = target[key];

                // Deep merge for objects (not arrays)
                if (
                    sourceValue !== null &&
                    typeof sourceValue === 'object' &&
                    !Array.isArray(sourceValue) &&
                    targetValue !== null &&
                    typeof targetValue === 'object' &&
                    !Array.isArray(targetValue)
                ) {
                    target[key] = this.merge({}, targetValue, sourceValue);
                } else {
                    target[key] = sourceValue;
                }
            }
        }
        return target;
    }

    static clone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(item => this.clone(item));

        const result = Object.create(null);
        for (const key of Object.keys(obj)) {
            if (!this.isDangerous(key)) {
                result[key] = this.clone(obj[key]);
            }
        }
        return result;
    }
}

console.log("─── SafeObjectMerger Demo ───");
const merged = SafeObjectMerger.merge(
    { a: 1 },
    { b: 2, __proto__: { evil: true } },
    { c: { deep: 'value' } }
);
console.log("Merged result:", merged);
console.log("Pollution test:", ({}).evil);  // undefined

module.exports = {
    safeMerge,
    safeDeepClone,
    SafeObject,
    SafeObjectMerger,
    SchemaValidator
};

console.log("\n═══ Next: Authentication Security ═══");
console.log("Run: node deep-dive/javaScript-security/05-auth-security.js");
