/**
 * PROXY & REFLECT: 04 - Revocable Proxies & Advanced Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ REVOCABLE PROXIES & ADVANCED CONCEPTS                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Revocable proxies can be "turned off", making further operations throw.    ║
 * ║ Plus advanced patterns: proxy chains, invariants, and performance.         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// REVOCABLE PROXIES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Revocable Proxies ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Proxy.revocable(target, handler)                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Returns: { proxy, revoke }                                                │
 * │                                                                             │
 * │   • proxy: The proxy object (just like new Proxy())                         │
 * │   • revoke: Function to "turn off" the proxy                                │
 * │                                                                             │
 * │   After revoke() is called:                                                 │
 * │   • Any operation on proxy throws TypeError                                 │
 * │   • The proxy becomes permanently unusable                                  │
 * │   • Target is detached (helps GC)                                           │
 * │                                                                             │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   BEFORE revoke()         AFTER revoke()                           │    │
 * │   │   ─────────────────       ────────────────                         │    │
 * │   │                                                                    │    │
 * │   │   proxy ──► target        proxy ──► ✗ (throws TypeError)           │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const target = { name: 'Alice', data: 'sensitive' };

const { proxy, revoke } = Proxy.revocable(target, {
  get(target, property) {
    console.log(`  [GET] ${property}`);
    return Reflect.get(target, property);
  }
});

console.log('A: Before revoke:');
console.log('  proxy.name:', proxy.name);
console.log('  proxy.data:', proxy.data);

console.log('\nB: Revoking proxy...');
revoke();

console.log('\nC: After revoke:');
try {
  console.log(proxy.name);
} catch (e) {
  console.log('  Error:', e.message);
}

try {
  proxy.name = 'Bob';
} catch (e) {
  console.log('  Error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE: TEMPORARY ACCESS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case: Temporary Access ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TEMPORARY ACCESS PATTERN                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Give temporary access to sensitive data.                                  │
 * │   Revoke after use or after time limit.                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function createTemporaryAccess(sensitiveData, timeoutMs) {
  const { proxy, revoke } = Proxy.revocable(sensitiveData, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    }
  });

  // Auto-revoke after timeout
  setTimeout(() => {
    console.log('  [AUTO-REVOKE] Access expired');
    revoke();
  }, timeoutMs);

  return proxy;
}

const secrets = { apiKey: 'sk-123456', password: 'hunter2' };
const tempAccess = createTemporaryAccess(secrets, 100);

console.log('D: Immediate access works:');
console.log('  apiKey:', tempAccess.apiKey);

// Access after timeout
setTimeout(() => {
  console.log('\nE: After timeout:');
  try {
    console.log(tempAccess.apiKey);
  } catch (e) {
    console.log('  Error:', e.message);
  }
}, 150);


// ═══════════════════════════════════════════════════════════════════════════════
// PROXY INVARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log('\n=== Proxy Invariants ===\n');

  /**
   * ┌─────────────────────────────────────────────────────────────────────────────┐
   * │ INVARIANTS - Rules Traps MUST Follow                                        │
   * ├─────────────────────────────────────────────────────────────────────────────┤
   * │                                                                             │
   * │   Proxies cannot lie about certain things. These "invariants" ensure        │
   * │   JavaScript semantics stay consistent.                                     │
   * │                                                                             │
   * │   KEY INVARIANTS:                                                           │
   * │                                                                             │
   * │   1. get: If property is non-writable, non-configurable,                    │
   * │      trap MUST return the actual value                                      │
   * │                                                                             │
   * │   2. set: Can't return true for non-writable, non-configurable              │
   * │      properties                                                             │
   * │                                                                             │
   * │   3. has: Can't return false for non-configurable properties                │
   * │                                                                             │
   * │   4. deleteProperty: Can't return true for non-configurable properties      │
   * │                                                                             │
   * │   5. ownKeys: Must include all non-configurable properties                  │
   * │                                                                             │
   * │   6. getPrototypeOf: If target is non-extensible, must return               │
   * │      actual prototype                                                       │
   * │                                                                             │
   * └─────────────────────────────────────────────────────────────────────────────┘
   */

  const frozen = Object.freeze({ constant: 42 });

  const badProxy = new Proxy(frozen, {
    get(target, property) {
      // Try to lie about the frozen value
      return 999;
    }
  });

  console.log('F: Invariant enforcement:');
  try {
    console.log('  badProxy.constant:', badProxy.constant);
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // Invariant: Can't claim non-configurable property doesn't exist
  const withNonConfig = {};
  Object.defineProperty(withNonConfig, 'locked', {
    value: 'fixed',
    configurable: false
  });

  const hasProxy = new Proxy(withNonConfig, {
    has(target, property) {
      return false;  // Try to hide everything
    }
  });

  console.log('\nG: has() invariant:');
  try {
    console.log('  "locked" in hasProxy:', 'locked' in hasProxy);
  } catch (e) {
    console.log('  Error:', e.message);
  }


  // ═══════════════════════════════════════════════════════════════════════════════
  // PROXY CHAINS
  // ═══════════════════════════════════════════════════════════════════════════════

  console.log('\n=== Proxy Chains ===\n');

  /**
   * ┌─────────────────────────────────────────────────────────────────────────────┐
   * │ CHAINING MULTIPLE PROXIES                                                   │
   * ├─────────────────────────────────────────────────────────────────────────────┤
   * │                                                                             │
   * │   You can wrap a proxy with another proxy!                                  │
   * │                                                                             │
   * │   code ──► proxy1 ──► proxy2 ──► target                                     │
   * │              │          │                                                   │
   * │              ▼          ▼                                                   │
   * │           handler1   handler2                                               │
   * │                                                                             │
   * │   Each proxy layer can add different functionality.                         │
   * │                                                                             │
   * └─────────────────────────────────────────────────────────────────────────────┘
   */

  // Layer 1: Logging
  function withLogging(target) {
    return new Proxy(target, {
      get(target, property, receiver) {
        console.log(`    [LOG] get ${String(property)}`);
        return Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver) {
        console.log(`    [LOG] set ${String(property)} = ${value}`);
        return Reflect.set(target, property, value, receiver);
      }
    });
  }

  // Layer 2: Validation
  function withValidation(target) {
    return new Proxy(target, {
      set(target, property, value, receiver) {
        if (property === 'age' && (typeof value !== 'number' || value < 0)) {
          throw new Error('age must be a positive number');
        }
        return Reflect.set(target, property, value, receiver);
      }
    });
  }

  // Chain: original -> validation -> logging
  const original = { name: 'Bob', age: 25 };
  const validated = withValidation(original);
  const loggedAndValidated = withLogging(validated);

  console.log('H: Proxy chain in action:');
  console.log('  Getting name:', loggedAndValidated.name);
  loggedAndValidated.age = 30;

  console.log('\nI: Validation still works:');
  try {
    loggedAndValidated.age = -5;
  } catch (e) {
    console.log('  Error:', e.message);
  }


  // ═══════════════════════════════════════════════════════════════════════════════
  // PERFORMANCE CONSIDERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  console.log('\n=== Performance Considerations ===\n');

  /**
   * ┌─────────────────────────────────────────────────────────────────────────────┐
   * │ PROXY PERFORMANCE                                                           │
   * ├─────────────────────────────────────────────────────────────────────────────┤
   * │                                                                             │
   * │   PROS:                                                                     │
   * │   • Very powerful for meta-programming                                      │
   * │   • Clean API for interception                                              │
   * │   • Native browser support (no polyfill)                                    │
   * │                                                                             │
   * │   CONS:                                                                     │
   * │   • Slower than direct property access (function call overhead)             │
   * │   • Can't be polyfilled for older browsers                                  │
   * │   • Debugging can be harder (stack traces show proxy code)                  │
   * │                                                                             │
   * │                                                                             │
   * │   WHEN TO USE:                                                              │
   * │   ✓ Validation, access control, observables                                 │
   * │   ✓ Development/debugging tools                                             │
   * │   ✓ Framework internals (Vue, MobX)                                         │
   * │                                                                             │
   * │   WHEN TO AVOID:                                                            │
   * │   ✗ Hot paths with millions of operations                                   │
   * │   ✗ When direct property access suffices                                    │
   * │   ✗ If targeting old browsers without Proxy support                         │
   * │                                                                             │
   * └─────────────────────────────────────────────────────────────────────────────┘
   */

  // Simple performance comparison
  const directObj = { value: 0 };
  const proxiedObj = new Proxy({ value: 0 }, {
    get(target, prop) {
      return Reflect.get(target, prop);
    }
  });

  const iterations = 100000;

  console.log('J: Performance comparison:');

  let start = Date.now();
  for (let i = 0; i < iterations; i++) {
    directObj.value;
  }
  console.log(`  Direct access (${iterations}x): ${Date.now() - start}ms`);

  start = Date.now();
  for (let i = 0; i < iterations; i++) {
    proxiedObj.value;
  }
  console.log(`  Proxy access (${iterations}x): ${Date.now() - start}ms`);


  // ═══════════════════════════════════════════════════════════════════════════════
  // PROXY WITH CLASSES
  // ═══════════════════════════════════════════════════════════════════════════════

  console.log('\n=== Proxy with Classes ===\n');

  class User {
    constructor(name) {
      this._name = name;
    }

    get name() {
      return this._name;
    }

    greet() {
      return `Hello, I'm ${this._name}`;
    }
  }

  // Wrap class instances
  function createTrackedUser(name) {
    const user = new User(name);

    return new Proxy(user, {
      get(target, property, receiver) {
        const value = Reflect.get(target, property, receiver);
        if (typeof value === 'function') {
          return function(...args) {
            console.log(`    [METHOD] ${property}(${args.join(', ')})`);
            return value.apply(target, args);
          };
        }
        console.log(`    [PROP] ${property} = ${value}`);
        return value;
      }
    });
  }

  console.log('K: Tracked class instance:');
  const trackedUser = createTrackedUser('Alice');
  console.log('  Name:', trackedUser.name);
  console.log('  Greeting:', trackedUser.greet());


  /**
   * ┌─────────────────────────────────────────────────────────────────────────────┐
   * │ INTERVIEW ANSWER                                                            │
   * ├─────────────────────────────────────────────────────────────────────────────┤
   * │                                                                             │
   * │ "Proxy.revocable() creates a proxy that can be permanently disabled:        │
   * │                                                                             │
   * │   const { proxy, revoke } = Proxy.revocable(target, handler);               │
   * │   // Use proxy normally...                                                  │
   * │   revoke();  // Now any operation throws TypeError                          │
   * │                                                                             │
   * │ Use cases for revocable proxies:                                            │
   * │ • Temporary access to sensitive data                                        │
   * │ • Time-limited API access                                                   │
   * │ • Helping garbage collection by detaching target                            │
   * │                                                                             │
   * │ Proxy invariants are rules that traps must follow:                          │
   * │ • Can't lie about frozen/sealed object properties                           │
   * │ • Can't hide non-configurable properties                                    │
   * │ • Must return actual value for non-writable properties                      │
   * │                                                                             │
   * │ Performance considerations:                                                 │
   * │ • Proxies add function call overhead                                        │
   * │ • Avoid in hot paths with millions of operations                            │
   * │ • Great for dev tools, validation, reactive systems                         │
   * │ • Can't be polyfilled for IE11/older browsers"                              │
   * │                                                                             │
   * └─────────────────────────────────────────────────────────────────────────────┘
   *
   *
   * RUN: node docs/23-proxy-reflect/04-revocable-proxies.js
   */

}, 200);
