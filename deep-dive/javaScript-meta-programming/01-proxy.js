/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT META-PROGRAMMING - Proxy
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Proxy allows you to intercept and customize fundamental operations on objects
 * like property access, assignment, enumeration, and function invocation.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PROXY OVERVIEW                                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  PROXY ARCHITECTURE                             │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   ┌──────────────┐                                                      │
 * │   │   Client     │                                                      │
 * │   │   Code       │                                                      │
 * │   └──────┬───────┘                                                      │
 * │          │ proxy.property = value                                       │
 * │          ▼                                                               │
 * │   ┌──────────────────────────────────────────────────────────┐         │
 * │   │                    PROXY                                  │         │
 * │   │  ┌────────────────────────────────────────────────────┐  │         │
 * │   │  │                  HANDLER                            │  │         │
 * │   │  │  • get(target, prop)                               │  │         │
 * │   │  │  • set(target, prop, value)                        │  │         │
 * │   │  │  • has(target, prop)                               │  │         │
 * │   │  │  • deleteProperty(target, prop)                    │  │         │
 * │   │  │  • apply(target, thisArg, args)                    │  │         │
 * │   │  │  • construct(target, args)                         │  │         │
 * │   │  │  • ... 13 traps total                              │  │         │
 * │   │  └────────────────────────────────────────────────────┘  │         │
 * │   └──────────────────────────────────────────────────────────┘         │
 * │          │                                                              │
 * │          ▼                                                              │
 * │   ┌──────────────┐                                                      │
 * │   │   Target     │ ◄── Original object being proxied                   │
 * │   │   Object     │                                                      │
 * │   └──────────────┘                                                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           PROXY FUNDAMENTALS");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    BASIC PROXY SYNTAX                                    │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Basic Proxy Syntax ───\n");

// Basic proxy with get and set traps
const target = { name: 'John', age: 30 };

const handler = {
    get(target, property, receiver) {
        console.log(`Getting property: ${property}`);
        return target[property];
    },

    set(target, property, value, receiver) {
        console.log(`Setting property: ${property} = ${value}`);
        target[property] = value;
        return true;  // Must return true for success
    }
};

const proxy = new Proxy(target, handler);

console.log("Proxy Demo:");
console.log("proxy.name:", proxy.name);
proxy.city = 'NYC';
console.log("target:", target);
console.log("");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ALL PROXY TRAPS                                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   PROPERTY ACCESS:                                                       │
 * │   • get(target, prop, receiver)                                         │
 * │   • set(target, prop, value, receiver)                                  │
 * │   • has(target, prop) - for 'in' operator                               │
 * │   • deleteProperty(target, prop)                                        │
 * │                                                                          │
 * │   OBJECT OPERATIONS:                                                     │
 * │   • ownKeys(target) - Object.keys, for...in                             │
 * │   • getOwnPropertyDescriptor(target, prop)                              │
 * │   • defineProperty(target, prop, descriptor)                            │
 * │                                                                          │
 * │   PROTOTYPE:                                                             │
 * │   • getPrototypeOf(target)                                              │
 * │   • setPrototypeOf(target, proto)                                       │
 * │                                                                          │
 * │   EXTENSIBILITY:                                                         │
 * │   • isExtensible(target)                                                │
 * │   • preventExtensions(target)                                           │
 * │                                                                          │
 * │   FUNCTION:                                                              │
 * │   • apply(target, thisArg, args)                                        │
 * │   • construct(target, args, newTarget)                                  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── All Proxy Traps ───\n");

// Comprehensive handler example
const comprehensiveHandler = {
    // Property access
    get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    },

    has(target, prop) {
        return Reflect.has(target, prop);
    },

    deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    },

    // Object operations
    ownKeys(target) {
        return Reflect.ownKeys(target);
    },

    getOwnPropertyDescriptor(target, prop) {
        return Reflect.getOwnPropertyDescriptor(target, prop);
    },

    defineProperty(target, prop, descriptor) {
        return Reflect.defineProperty(target, prop, descriptor);
    },

    // Prototype
    getPrototypeOf(target) {
        return Reflect.getPrototypeOf(target);
    },

    setPrototypeOf(target, proto) {
        return Reflect.setPrototypeOf(target, proto);
    },

    // Extensibility
    isExtensible(target) {
        return Reflect.isExtensible(target);
    },

    preventExtensions(target) {
        return Reflect.preventExtensions(target);
    },

    // Function calls (for function proxies)
    apply(target, thisArg, args) {
        return Reflect.apply(target, thisArg, args);
    },

    construct(target, args, newTarget) {
        return Reflect.construct(target, args, newTarget);
    }
};

console.log("13 Proxy Traps Available:");
console.log("  Property: get, set, has, deleteProperty");
console.log("  Object: ownKeys, getOwnPropertyDescriptor, defineProperty");
console.log("  Prototype: getPrototypeOf, setPrototypeOf");
console.log("  Extensibility: isExtensible, preventExtensions");
console.log("  Function: apply, construct\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PRACTICAL USE CASES                                   │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           PRACTICAL PROXY USE CASES");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Use Case 1: Validation
// ============================================================================
console.log("─── 1. Validation ───\n");

function createValidator(schema) {
    return {
        set(target, property, value) {
            const validator = schema[property];

            if (validator && !validator.validate(value)) {
                throw new Error(`Invalid value for ${property}: ${validator.message}`);
            }

            target[property] = value;
            return true;
        }
    };
}

const userSchema = {
    name: {
        validate: v => typeof v === 'string' && v.length >= 2,
        message: 'Name must be a string with at least 2 characters'
    },
    age: {
        validate: v => typeof v === 'number' && v >= 0 && v <= 150,
        message: 'Age must be a number between 0 and 150'
    },
    email: {
        validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format'
    }
};

const user = new Proxy({}, createValidator(userSchema));

try {
    user.name = 'John';
    user.age = 30;
    user.email = 'john@example.com';
    console.log("Valid user:", user);

    // This would throw
    // user.age = -5;
} catch (e) {
    console.log("Validation error:", e.message);
}
console.log("");

// ============================================================================
// Use Case 2: Default Values
// ============================================================================
console.log("─── 2. Default Values ───\n");

function withDefaults(target, defaults) {
    return new Proxy(target, {
        get(obj, prop) {
            return prop in obj ? obj[prop] : defaults[prop];
        }
    });
}

const config = withDefaults(
    { port: 3000 },
    { port: 8080, host: 'localhost', timeout: 5000 }
);

console.log("config.port:", config.port);       // 3000 (from target)
console.log("config.host:", config.host);       // 'localhost' (default)
console.log("config.timeout:", config.timeout); // 5000 (default)
console.log("");

// ============================================================================
// Use Case 3: Property Access Logging
// ============================================================================
console.log("─── 3. Property Access Logging ───\n");

function createLogger(target, logFn = console.log) {
    return new Proxy(target, {
        get(obj, prop) {
            logFn(`[GET] ${prop}`);
            return obj[prop];
        },
        set(obj, prop, value) {
            logFn(`[SET] ${prop} = ${JSON.stringify(value)}`);
            obj[prop] = value;
            return true;
        }
    });
}

const loggedObj = createLogger({ x: 1, y: 2 });
loggedObj.x;
loggedObj.z = 3;
console.log("");

// ============================================================================
// Use Case 4: Negative Array Indices
// ============================================================================
console.log("─── 4. Negative Array Indices ───\n");

function createNegativeArray(arr) {
    return new Proxy(arr, {
        get(target, prop) {
            let index = Number(prop);

            if (!Number.isNaN(index) && index < 0) {
                index = target.length + index;
            }

            return target[index];
        }
    });
}

const arr = createNegativeArray([1, 2, 3, 4, 5]);
console.log("arr[-1]:", arr[-1]);  // 5
console.log("arr[-2]:", arr[-2]);  // 4
console.log("arr[0]:", arr[0]);    // 1
console.log("");

// ============================================================================
// Use Case 5: Observable Object (Reactive)
// ============================================================================
console.log("─── 5. Observable Object ───\n");

function createObservable(target, callback) {
    return new Proxy(target, {
        set(obj, prop, value) {
            const oldValue = obj[prop];
            obj[prop] = value;
            callback(prop, value, oldValue);
            return true;
        }
    });
}

const state = createObservable({ count: 0 }, (prop, newVal, oldVal) => {
    console.log(`State changed: ${prop} from ${oldVal} to ${newVal}`);
});

state.count = 1;
state.count = 2;
console.log("");

// ============================================================================
// Use Case 6: Private Properties
// ============================================================================
console.log("─── 6. Private Properties ───\n");

function createPrivate(target) {
    return new Proxy(target, {
        get(obj, prop) {
            if (prop.startsWith('_')) {
                throw new Error(`Cannot access private property: ${prop}`);
            }
            return obj[prop];
        },
        set(obj, prop, value) {
            if (prop.startsWith('_')) {
                throw new Error(`Cannot set private property: ${prop}`);
            }
            obj[prop] = value;
            return true;
        },
        has(obj, prop) {
            if (prop.startsWith('_')) return false;
            return prop in obj;
        },
        ownKeys(obj) {
            return Object.keys(obj).filter(key => !key.startsWith('_'));
        }
    });
}

const privateObj = createPrivate({ name: 'John', _secret: 'password123' });
console.log("privateObj.name:", privateObj.name);
console.log("Keys:", Object.keys(privateObj));

try {
    console.log(privateObj._secret);
} catch (e) {
    console.log("Error:", e.message);
}
console.log("");

// ============================================================================
// Use Case 7: Function Proxy (Memoization)
// ============================================================================
console.log("─── 7. Function Memoization ───\n");

function memoize(fn) {
    const cache = new Map();

    return new Proxy(fn, {
        apply(target, thisArg, args) {
            const key = JSON.stringify(args);

            if (cache.has(key)) {
                console.log(`Cache hit for: ${key}`);
                return cache.get(key);
            }

            console.log(`Computing for: ${key}`);
            const result = target.apply(thisArg, args);
            cache.set(key, result);
            return result;
        }
    });
}

const expensiveFn = memoize((a, b) => {
    // Simulate expensive computation
    return a + b;
});

console.log("Result:", expensiveFn(1, 2));  // Computing
console.log("Result:", expensiveFn(1, 2));  // Cache hit
console.log("Result:", expensiveFn(3, 4));  // Computing
console.log("");

// ============================================================================
// Use Case 8: Revocable Proxy
// ============================================================================
console.log("─── 8. Revocable Proxy ───\n");

const { proxy: revocableProxy, revoke } = Proxy.revocable(
    { data: 'sensitive' },
    {
        get(target, prop) {
            return target[prop];
        }
    }
);

console.log("Before revoke:", revocableProxy.data);
revoke();

try {
    console.log(revocableProxy.data);
} catch (e) {
    console.log("After revoke:", e.message);
}
console.log("");

// ============================================================================
// Proxy Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           PROXY CHEAT SHEET                                     ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  SYNTAX:                                                         ║");
console.log("║  const proxy = new Proxy(target, handler);                      ║");
console.log("║  const { proxy, revoke } = Proxy.revocable(target, handler);    ║");
console.log("║                                                                  ║");
console.log("║  COMMON TRAPS:                                                   ║");
console.log("║  get(target, prop, receiver)                                    ║");
console.log("║  set(target, prop, value, receiver) → return true              ║");
console.log("║  has(target, prop) → for 'in' operator                          ║");
console.log("║  deleteProperty(target, prop)                                   ║");
console.log("║  apply(target, thisArg, args) → for functions                   ║");
console.log("║                                                                  ║");
console.log("║  USE CASES:                                                      ║");
console.log("║  • Validation     • Logging       • Default values              ║");
console.log("║  • Private props  • Memoization   • Reactive/Observable         ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    createValidator,
    withDefaults,
    createLogger,
    createNegativeArray,
    createObservable,
    createPrivate,
    memoize
};

console.log("═══ Next: Reflect API ═══");
console.log("Run: node deep-dive/javaScript-meta-programming/02-reflect.js");
