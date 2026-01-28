/**
 * PROXY & REFLECT: 00 - Proxy Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHAT IS A PROXY?                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A Proxy is a wrapper around an object that intercepts and customizes      ║
 * ║ fundamental operations (get, set, delete, etc.)                           ║
 * ║                                                                            ║
 * ║ Think of it as a "middleman" that sits between your code and the object.  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// THE PROXY CONCEPT
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== The Proxy Concept ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW PROXY WORKS                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   WITHOUT PROXY:                                                            │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │       Your Code ──────────────────────────────► Object                      │
 * │                     direct access                                           │
 * │                                                                             │
 * │                                                                             │
 * │   WITH PROXY:                                                               │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │       Your Code ────► Proxy ────► Object                                    │
 * │                         │                                                   │
 * │                         ▼                                                   │
 * │                      Handler                                                │
 * │                    (trap methods)                                           │
 * │                                                                             │
 * │                                                                             │
 * │   TERMINOLOGY:                                                              │
 * │   • target: The original object being proxied                               │
 * │   • handler: Object with trap methods that intercept operations             │
 * │   • trap: Method in handler that intercepts a specific operation            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CREATING A BASIC PROXY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Creating a Basic Proxy ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYNTAX                                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const proxy = new Proxy(target, handler);                                 │
 * │                            ▲       ▲                                        │
 * │                            │       │                                        │
 * │                            │       └── object with trap methods             │
 * │                            └── original object to wrap                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// The target object
const user = {
  name: 'Alice',
  age: 30
};

// Empty handler = no interception (passthrough)
const proxyPassthrough = new Proxy(user, {});

console.log('A: Passthrough proxy (empty handler):');
console.log('  proxyPassthrough.name:', proxyPassthrough.name);  // Alice
console.log('  proxyPassthrough.age:', proxyPassthrough.age);    // 30

// The proxy acts exactly like the original object
proxyPassthrough.name = 'Bob';
console.log('  After setting name to Bob:', user.name);  // Bob (original changed!)


// ═══════════════════════════════════════════════════════════════════════════════
// THE GET TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== The GET Trap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ get(target, property, receiver)                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts: Reading property values                                         │
 * │                                                                             │
 * │   proxy.property                                                            │
 * │   proxy[property]                                                           │
 * │   Reflect.get(proxy, property)                                              │
 * │                                                                             │
 * │ Parameters:                                                                 │
 * │   • target: The original object                                             │
 * │   • property: The property name (string or Symbol)                          │
 * │   • receiver: The proxy itself (or object inheriting from proxy)            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const person = {
  firstName: 'John',
  lastName: 'Doe'
};

const personProxy = new Proxy(person, {
  get(target, property, receiver) {
    console.log(`  [GET] Reading property: ${property}`);

    // Return a default value for non-existent properties
    if (!(property in target)) {
      return `Property "${property}" not found`;
    }

    return target[property];
  }
});

console.log('B: GET trap intercepts property access:');
console.log('  firstName:', personProxy.firstName);
console.log('  lastName:', personProxy.lastName);
console.log('  email:', personProxy.email);  // Not found


// ═══════════════════════════════════════════════════════════════════════════════
// THE SET TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== The SET Trap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ set(target, property, value, receiver)                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts: Setting property values                                         │
 * │                                                                             │
 * │   proxy.property = value                                                    │
 * │   proxy[property] = value                                                   │
 * │   Reflect.set(proxy, property, value)                                       │
 * │                                                                             │
 * │ MUST return:                                                                │
 * │   • true: if assignment succeeded                                           │
 * │   • false: if assignment should fail (throws in strict mode)                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const product = {
  name: 'Laptop',
  price: 999
};

const productProxy = new Proxy(product, {
  set(target, property, value, receiver) {
    console.log(`  [SET] Setting ${property} = ${value}`);

    // Validation: price must be positive number
    if (property === 'price') {
      if (typeof value !== 'number') {
        throw new TypeError('Price must be a number');
      }
      if (value < 0) {
        throw new RangeError('Price cannot be negative');
      }
    }

    target[property] = value;
    return true;  // Must return true for success
  }
});

console.log('C: SET trap with validation:');
productProxy.price = 1299;
console.log('  New price:', productProxy.price);

try {
  productProxy.price = -100;
} catch (e) {
  console.log('  Error:', e.message);  // Price cannot be negative
}


// ═══════════════════════════════════════════════════════════════════════════════
// THE HAS TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== The HAS Trap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ has(target, property)                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts: The "in" operator                                               │
 * │                                                                             │
 * │   property in proxy                                                         │
 * │   Reflect.has(proxy, property)                                              │
 * │                                                                             │
 * │ MUST return: boolean                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const data = {
  public: 'visible',
  _private: 'hidden'
};

const dataProxy = new Proxy(data, {
  has(target, property) {
    // Hide properties starting with underscore
    if (property.startsWith('_')) {
      return false;
    }
    return property in target;
  }
});

console.log('D: HAS trap hides private properties:');
console.log('  "public" in proxy:', 'public' in dataProxy);      // true
console.log('  "_private" in proxy:', '_private' in dataProxy);  // false (hidden!)
console.log('  But still accessible:', dataProxy._private);      // hidden


// ═══════════════════════════════════════════════════════════════════════════════
// THE DELETEPROPERTY TRAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== The DELETEPROPERTY Trap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ deleteProperty(target, property)                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Intercepts: The "delete" operator                                           │
 * │                                                                             │
 * │   delete proxy.property                                                     │
 * │   delete proxy[property]                                                    │
 * │   Reflect.deleteProperty(proxy, property)                                   │
 * │                                                                             │
 * │ MUST return: boolean                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const config = {
  apiKey: 'secret123',
  theme: 'dark',
  language: 'en'
};

const configProxy = new Proxy(config, {
  deleteProperty(target, property) {
    // Prevent deletion of apiKey
    if (property === 'apiKey') {
      console.log('  [DELETE] Cannot delete protected property: apiKey');
      return false;  // Deletion blocked
    }

    console.log(`  [DELETE] Deleting: ${property}`);
    delete target[property];
    return true;
  }
});

console.log('E: DELETEPROPERTY trap protects certain properties:');
console.log('  Before:', Object.keys(configProxy));

delete configProxy.theme;  // Allowed
delete configProxy.apiKey;  // Blocked

console.log('  After:', Object.keys(configProxy));


// ═══════════════════════════════════════════════════════════════════════════════
// PROXY VS TARGET IDENTITY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Proxy vs Target Identity ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTANT: Proxy !== Target                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const obj = {};                                                           │
 * │   const proxy = new Proxy(obj, {});                                         │
 * │                                                                             │
 * │   proxy === obj        // false                                             │
 * │   proxy == obj         // false                                             │
 * │                                                                             │
 * │   But they share the same underlying object!                                │
 * │   proxy.x = 1;                                                              │
 * │   obj.x              // 1                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const original = { x: 1 };
const proxy = new Proxy(original, {});

console.log('F: Proxy identity:');
console.log('  proxy === original:', proxy === original);  // false
console.log('  proxy == original:', proxy == original);    // false

proxy.y = 2;
console.log('  original.y after proxy.y = 2:', original.y);  // 2


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "A Proxy is a wrapper object that intercepts and customizes operations      │
 * │ on another object (the target). It uses a handler object containing         │
 * │ 'traps' - methods that intercept specific operations.                       │
 * │                                                                             │
 * │ Key concepts:                                                               │
 * │ • target: The object being wrapped                                          │
 * │ • handler: Object containing trap methods                                   │
 * │ • trap: Method that intercepts an operation (get, set, has, etc.)           │
 * │                                                                             │
 * │ Common traps:                                                               │
 * │ • get(target, property): intercepts property reads                          │
 * │ • set(target, property, value): intercepts property writes                  │
 * │ • has(target, property): intercepts 'in' operator                           │
 * │ • deleteProperty(target, property): intercepts 'delete' operator            │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │ • Validation before setting values                                          │
 * │ • Default values for missing properties                                     │
 * │ • Logging/debugging property access                                         │
 * │ • Access control and property hiding                                        │
 * │ • Observable/reactive objects"                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/23-proxy-reflect/00-proxy-basics.js
 */
