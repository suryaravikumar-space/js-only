/**
 * PROXY & REFLECT: 03 - Practical Use Cases
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ REAL-WORLD PROXY PATTERNS                                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Proxies enable powerful patterns that would be difficult or impossible     ║
 * ║ to implement otherwise. Here are the most common and useful ones.          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 1: VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Use Case 1: Validation ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VALIDATION PROXY                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Validate data BEFORE it's stored in an object.                            │
 * │   No invalid data can ever exist in the object!                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function createValidator(target, validations) {
  return new Proxy(target, {
    set(target, property, value, receiver) {
      const validator = validations[property];

      if (validator) {
        const result = validator(value);
        if (result !== true) {
          throw new Error(`Invalid value for ${property}: ${result}`);
        }
      }

      return Reflect.set(target, property, value, receiver);
    }
  });
}

// Define validations
const userValidations = {
  age: (value) => {
    if (typeof value !== 'number') return 'must be a number';
    if (value < 0 || value > 150) return 'must be between 0 and 150';
    return true;
  },
  email: (value) => {
    if (typeof value !== 'string') return 'must be a string';
    if (!value.includes('@')) return 'must be valid email';
    return true;
  },
  name: (value) => {
    if (typeof value !== 'string') return 'must be a string';
    if (value.length < 2) return 'must be at least 2 characters';
    return true;
  }
};

const user = createValidator({}, userValidations);

console.log('A: Setting valid values:');
user.name = 'Alice';
user.age = 30;
user.email = 'alice@example.com';
console.log('  User:', user);

console.log('\nB: Trying invalid values:');
try {
  user.age = -5;
} catch (e) {
  console.log('  Error:', e.message);
}

try {
  user.email = 'invalid';
} catch (e) {
  console.log('  Error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 2: DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 2: Default Values ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEFAULT VALUES PROXY                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Return a default value for non-existent properties                        │
 * │   instead of undefined.                                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function withDefaults(target, defaults) {
  return new Proxy(target, {
    get(target, property, receiver) {
      if (property in target) {
        return Reflect.get(target, property, receiver);
      }
      return defaults[property] ?? defaults['*'] ?? undefined;
    }
  });
}

const config = withDefaults(
  { theme: 'dark' },
  {
    theme: 'light',
    language: 'en',
    timeout: 5000,
    '*': 'default value'  // Fallback for any property
  }
);

console.log('C: Getting values with defaults:');
console.log('  theme:', config.theme);           // dark (from object)
console.log('  language:', config.language);     // en (from defaults)
console.log('  timeout:', config.timeout);       // 5000 (from defaults)
console.log('  unknown:', config.unknown);       // default value (from *)


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 3: OBSERVABLE / REACTIVE OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 3: Observable / Reactive Objects ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ OBSERVABLE PROXY                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Notify subscribers when properties change.                                │
 * │   This is the foundation of reactive frameworks like Vue.js!                │
 * │                                                                             │
 * │         state.count = 5                                                     │
 * │               │                                                             │
 * │               ▼                                                             │
 * │         Proxy set trap                                                      │
 * │               │                                                             │
 * │               ▼                                                             │
 * │         Notify all subscribers                                              │
 * │               │                                                             │
 * │         ┌─────┴─────┐                                                       │
 * │         ▼           ▼                                                       │
 * │      Update UI   Log change                                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function createObservable(target) {
  const subscribers = new Map();

  return new Proxy(target, {
    set(target, property, value, receiver) {
      const oldValue = target[property];
      const result = Reflect.set(target, property, value, receiver);

      // Notify subscribers if value changed
      if (oldValue !== value) {
        const callbacks = subscribers.get(property) || [];
        callbacks.forEach(callback => callback(value, oldValue, property));
      }

      return result;
    },

    get(target, property, receiver) {
      if (property === 'subscribe') {
        return (prop, callback) => {
          if (!subscribers.has(prop)) {
            subscribers.set(prop, []);
          }
          subscribers.get(prop).push(callback);
        };
      }
      return Reflect.get(target, property, receiver);
    }
  });
}

const state = createObservable({ count: 0, name: 'App' });

// Subscribe to changes
state.subscribe('count', (newVal, oldVal) => {
  console.log(`  count changed: ${oldVal} → ${newVal}`);
});

state.subscribe('name', (newVal, oldVal) => {
  console.log(`  name changed: "${oldVal}" → "${newVal}"`);
});

console.log('D: Changing observed values:');
state.count = 1;
state.count = 2;
state.name = 'MyApp';


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 4: CACHING / MEMOIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 4: Caching / Memoization ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CACHING PROXY                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Cache expensive computations automatically.                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function createCachedObject(target, computedProps) {
  const cache = new Map();

  return new Proxy(target, {
    get(target, property, receiver) {
      // Check if it's a computed property
      if (computedProps[property]) {
        if (cache.has(property)) {
          console.log(`    [CACHE HIT] ${property}`);
          return cache.get(property);
        }
        console.log(`    [COMPUTING] ${property}`);
        const value = computedProps[property](target);
        cache.set(property, value);
        return value;
      }
      return Reflect.get(target, property, receiver);
    },

    set(target, property, value, receiver) {
      // Invalidate cache when base property changes
      cache.clear();
      console.log(`    [CACHE CLEARED] base property "${property}" changed`);
      return Reflect.set(target, property, value, receiver);
    }
  });
}

const rectangle = createCachedObject(
  { width: 10, height: 5 },
  {
    area: (obj) => obj.width * obj.height,
    perimeter: (obj) => 2 * (obj.width + obj.height)
  }
);

console.log('E: Computing values:');
console.log('  Area:', rectangle.area);           // Computing
console.log('  Area again:', rectangle.area);     // Cache hit
console.log('  Perimeter:', rectangle.perimeter); // Computing

console.log('\nF: After changing width:');
rectangle.width = 20;                             // Cache cleared
console.log('  Area:', rectangle.area);           // Computing again


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 5: ACCESS CONTROL / PRIVATE PROPERTIES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 5: Access Control ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ACCESS CONTROL PROXY                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Hide private properties, make read-only properties,                       │
 * │   restrict access based on conditions.                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function createSecure(target, { privateProps = [], readOnlyProps = [] } = {}) {
  return new Proxy(target, {
    get(target, property, receiver) {
      if (privateProps.includes(property)) {
        throw new Error(`Cannot access private property: ${property}`);
      }
      return Reflect.get(target, property, receiver);
    },

    set(target, property, value, receiver) {
      if (privateProps.includes(property)) {
        throw new Error(`Cannot set private property: ${property}`);
      }
      if (readOnlyProps.includes(property)) {
        throw new Error(`Cannot modify read-only property: ${property}`);
      }
      return Reflect.set(target, property, value, receiver);
    },

    has(target, property) {
      if (privateProps.includes(property)) {
        return false;  // Hide private properties from "in" operator
      }
      return Reflect.has(target, property);
    },

    ownKeys(target) {
      return Reflect.ownKeys(target).filter(key => !privateProps.includes(key));
    },

    getOwnPropertyDescriptor(target, property) {
      if (privateProps.includes(property)) {
        return undefined;
      }
      return Reflect.getOwnPropertyDescriptor(target, property);
    }
  });
}

const account = createSecure(
  { name: 'Alice', balance: 1000, _password: 'secret123', id: 'ACC001' },
  { privateProps: ['_password'], readOnlyProps: ['id'] }
);

console.log('G: Accessing properties:');
console.log('  name:', account.name);
console.log('  balance:', account.balance);
console.log('  Object.keys:', Object.keys(account));  // No _password!

console.log('\nH: Trying restricted access:');
try {
  console.log(account._password);
} catch (e) {
  console.log('  Error:', e.message);
}

try {
  account.id = 'NEW_ID';
} catch (e) {
  console.log('  Error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 6: LOGGING / DEBUGGING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 6: Logging / Debugging ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LOGGING PROXY                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Track all property access and modifications for debugging.                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function createLogged(target, name = 'Object') {
  return new Proxy(target, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      console.log(`  [LOG] ${name}.${String(property)} -> ${JSON.stringify(value)}`);
      return value;
    },

    set(target, property, value, receiver) {
      const oldValue = target[property];
      console.log(`  [LOG] ${name}.${String(property)} = ${JSON.stringify(value)} (was: ${JSON.stringify(oldValue)})`);
      return Reflect.set(target, property, value, receiver);
    },

    deleteProperty(target, property) {
      console.log(`  [LOG] delete ${name}.${String(property)}`);
      return Reflect.deleteProperty(target, property);
    }
  });
}

console.log('I: Logged object operations:');
const logged = createLogged({ x: 1, y: 2 }, 'point');
logged.x;           // Log read
logged.z = 3;       // Log write
delete logged.y;    // Log delete


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 7: NEGATIVE ARRAY INDICES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 7: Negative Array Indices ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NEGATIVE INDEX ARRAY                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Access array elements from the end using negative indices,                │
 * │   like Python arrays!                                                       │
 * │                                                                             │
 * │   arr[-1]  →  Last element                                                  │
 * │   arr[-2]  →  Second to last                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function createPythonArray(arr) {
  return new Proxy(arr, {
    get(target, property, receiver) {
      const index = Number(property);
      if (!isNaN(index) && index < 0) {
        return target[target.length + index];
      }
      return Reflect.get(target, property, receiver);
    },

    set(target, property, value, receiver) {
      const index = Number(property);
      if (!isNaN(index) && index < 0) {
        target[target.length + index] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}

const arr = createPythonArray([1, 2, 3, 4, 5]);

console.log('J: Negative indices:');
console.log('  arr[-1]:', arr[-1]);  // 5
console.log('  arr[-2]:', arr[-2]);  // 4
console.log('  arr[-3]:', arr[-3]);  // 3

arr[-1] = 100;
console.log('  After arr[-1] = 100:', [...arr]);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Common Proxy use cases:                                                    │
 * │                                                                             │
 * │ 1. VALIDATION: Validate data before allowing it to be set                   │
 * │    - Type checking, range validation, format validation                     │
 * │                                                                             │
 * │ 2. DEFAULT VALUES: Return defaults for missing properties                   │
 * │    - Useful for configuration objects                                       │
 * │                                                                             │
 * │ 3. REACTIVE/OBSERVABLE: Notify when properties change                       │
 * │    - Foundation of Vue.js reactivity system                                 │
 * │    - Enables automatic UI updates                                           │
 * │                                                                             │
 * │ 4. CACHING: Cache expensive computed properties                             │
 * │    - Automatic memoization                                                  │
 * │    - Cache invalidation on dependency change                                │
 * │                                                                             │
 * │ 5. ACCESS CONTROL: Hide private properties, enforce read-only               │
 * │    - Implement true private members                                         │
 * │    - Create immutable views                                                 │
 * │                                                                             │
 * │ 6. LOGGING/DEBUGGING: Track all property access                             │
 * │    - Debugging complex object interactions                                  │
 * │                                                                             │
 * │ 7. NEGATIVE ARRAY INDICES: Access from end like Python                      │
 * │    - Syntactic sugar for common patterns"                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/23-proxy-reflect/03-proxy-use-cases.js
 */
