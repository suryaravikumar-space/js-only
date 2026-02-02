/**
 * SYMBOLS: 03 - Practical Use Cases
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ REAL-WORLD SYMBOL PATTERNS                                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When and why to use Symbols in actual applications.                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 1: TRULY PRIVATE PROPERTIES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Use Case 1: Private Properties ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PRIVATE PROPERTIES WITH SYMBOLS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Before ES2022 private fields (#), Symbols were THE way to                 │
 * │   create "hidden" properties that won't be accidentally accessed.           │
 * │                                                                             │
 * │   Still useful when:                                                        │
 * │   • Supporting older environments                                           │
 * │   • Need properties hidden from for...in but still accessible               │
 * │   • Want controlled access (share symbol to grant access)                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const _balance = Symbol('balance');
const _transactionHistory = Symbol('transactionHistory');

class BankAccount {
  constructor(initialBalance) {
    this[_balance] = initialBalance;
    this[_transactionHistory] = [];
  }

  deposit(amount) {
    this[_balance] += amount;
    this[_transactionHistory].push({ type: 'deposit', amount, date: new Date() });
  }

  withdraw(amount) {
    if (amount > this[_balance]) {
      throw new Error('Insufficient funds');
    }
    this[_balance] -= amount;
    this[_transactionHistory].push({ type: 'withdraw', amount, date: new Date() });
  }

  getBalance() {
    return this[_balance];
  }
}

const account = new BankAccount(1000);
account.deposit(500);
account.withdraw(200);

console.log('A: Private properties hidden:');
console.log('  Object.keys:', Object.keys(account));  // []
console.log('  JSON.stringify:', JSON.stringify(account));  // {}
console.log('  getBalance():', account.getBalance());  // 1300

console.log('\nB: But accessible with symbol:');
console.log('  account[_balance]:', account[_balance]);  // 1300


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 2: UNIQUE ENUM-LIKE VALUES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 2: Unique Enum Values ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ENUM-LIKE CONSTANTS                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Using strings for constants can lead to collisions:                       │
 * │   status === 'pending'  // What if 'pending' comes from user input?         │
 * │                                                                             │
 * │   Symbols guarantee uniqueness:                                             │
 * │   status === STATUS.PENDING  // Only our code can create this value         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const STATUS = Object.freeze({
  PENDING: Symbol('pending'),
  APPROVED: Symbol('approved'),
  REJECTED: Symbol('rejected')
});

function processRequest(status) {
  switch (status) {
    case STATUS.PENDING:
      return 'Request is being processed...';
    case STATUS.APPROVED:
      return 'Request approved!';
    case STATUS.REJECTED:
      return 'Request rejected.';
    default:
      return 'Unknown status';
  }
}

console.log('C: Using symbol enums:');
console.log('  ', processRequest(STATUS.PENDING));
console.log('  ', processRequest(STATUS.APPROVED));

// Can't fake it with a string!
console.log('\nD: String cannot match symbol:');
console.log('  ', processRequest('pending'));  // Unknown status


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 3: METADATA / INTERNAL PROPERTIES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 3: Metadata ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ METADATA ON OBJECTS                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Add metadata that doesn't interfere with:                                 │
 * │   • Object serialization (JSON.stringify)                                   │
 * │   • Property enumeration (Object.keys)                                      │
 * │   • User-defined properties                                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const METADATA = Symbol('metadata');

function addMetadata(obj, data) {
  obj[METADATA] = {
    ...obj[METADATA],
    ...data
  };
  return obj;
}

function getMetadata(obj) {
  return obj[METADATA] || {};
}

const user = { name: 'Alice', email: 'alice@example.com' };

addMetadata(user, { createdAt: new Date(), source: 'signup' });
addMetadata(user, { lastModified: new Date() });

console.log('E: Object with metadata:');
console.log('  User data:', JSON.stringify(user));  // No metadata!
console.log('  Metadata:', getMetadata(user));


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 4: PREVENTING PROPERTY COLLISIONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 4: Property Collision Prevention ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SAFE LIBRARY PROPERTIES                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   When your library adds properties to user objects,                        │
 * │   symbols prevent collision with user's own properties.                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Validation library
const validationLib = (() => {
  const _validated = Symbol('validated');
  const _errors = Symbol('errors');

  return {
    validate(obj, rules) {
      const errors = [];
      for (const [key, validator] of Object.entries(rules)) {
        if (!validator(obj[key])) {
          errors.push(`Invalid ${key}`);
        }
      }

      obj[_validated] = errors.length === 0;
      obj[_errors] = errors;

      return obj[_validated];
    },

    isValid(obj) {
      return obj[_validated] === true;
    },

    getErrors(obj) {
      return obj[_errors] || [];
    }
  };
})();

const formData = {
  name: 'Bob',
  email: 'invalid-email',
  validated: 'user property',  // User's own property with same name!
  errors: []  // User's own property!
};

const rules = {
  name: (v) => v && v.length >= 2,
  email: (v) => v && v.includes('@')
};

validationLib.validate(formData, rules);

console.log('F: No collision with user properties:');
console.log('  formData.validated:', formData.validated);  // User's value preserved!
console.log('  formData.errors:', formData.errors);  // User's value preserved!
console.log('  Library isValid:', validationLib.isValid(formData));  // false
console.log('  Library errors:', validationLib.getErrors(formData));


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 5: PLUGIN SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 5: Plugin Systems ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PLUGIN HOOKS                                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Use symbols for plugin integration points.                                │
 * │   Plugins can implement specific symbol methods.                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Framework defines hooks
const Hooks = {
  onInit: Symbol('onInit'),
  onDestroy: Symbol('onDestroy'),
  serialize: Symbol('serialize')
};

class FrameworkComponent {
  constructor(config) {
    this.config = config;
    if (this[Hooks.onInit]) {
      this[Hooks.onInit]();
    }
  }

  destroy() {
    if (this[Hooks.onDestroy]) {
      this[Hooks.onDestroy]();
    }
  }

  toJSON() {
    if (this[Hooks.serialize]) {
      return this[Hooks.serialize]();
    }
    return this.config;
  }
}

// User creates component with hooks
class MyComponent extends FrameworkComponent {
  [Hooks.onInit]() {
    console.log('  [Hook] Component initialized!');
  }

  [Hooks.onDestroy]() {
    console.log('  [Hook] Component destroyed!');
  }

  [Hooks.serialize]() {
    return { type: 'MyComponent', ...this.config };
  }
}

console.log('G: Plugin hooks in action:');
const comp = new MyComponent({ name: 'test' });
console.log('  Serialized:', JSON.stringify(comp));
comp.destroy();


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 6: TYPE MARKERS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Use Case 6: Type Markers ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TYPE CHECKING WITH SYMBOLS                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Use symbols to mark objects as specific types,                            │
 * │   safer than duck typing or string markers.                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const TYPE_MARKER = Symbol.for('mylib.typeMarker');

const Types = {
  REQUEST: Symbol('Request'),
  RESPONSE: Symbol('Response'),
  ERROR: Symbol('Error')
};

function createRequest(data) {
  return {
    [TYPE_MARKER]: Types.REQUEST,
    data,
    timestamp: Date.now()
  };
}

function createResponse(data) {
  return {
    [TYPE_MARKER]: Types.RESPONSE,
    data,
    timestamp: Date.now()
  };
}

function isRequest(obj) {
  return obj && obj[TYPE_MARKER] === Types.REQUEST;
}

function isResponse(obj) {
  return obj && obj[TYPE_MARKER] === Types.RESPONSE;
}

const req = createRequest({ url: '/api' });
const res = createResponse({ status: 200 });

console.log('H: Type checking:');
console.log('  isRequest(req):', isRequest(req));  // true
console.log('  isResponse(req):', isResponse(req));  // false
console.log('  isResponse(res):', isResponse(res));  // true


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Real-world use cases for Symbols:                                          │
 * │                                                                             │
 * │ 1. PRIVATE PROPERTIES:                                                      │
 * │    Hidden from Object.keys, for...in, JSON.stringify                        │
 * │    Controlled access by sharing the symbol                                  │
 * │                                                                             │
 * │ 2. UNIQUE ENUM VALUES:                                                      │
 * │    Can't be faked with strings/numbers                                      │
 * │    Switch statements are type-safe                                          │
 * │                                                                             │
 * │ 3. METADATA:                                                                │
 * │    Add internal data without affecting serialization                        │
 * │    or interfering with user properties                                      │
 * │                                                                             │
 * │ 4. COLLISION PREVENTION:                                                    │
 * │    Libraries can add properties safely                                      │
 * │    No risk of overwriting user's properties                                 │
 * │                                                                             │
 * │ 5. PLUGIN HOOKS:                                                            │
 * │    Define extension points with symbol methods                              │
 * │    Clean separation between framework and user code                         │
 * │                                                                             │
 * │ 6. TYPE MARKERS:                                                            │
 * │    Mark objects with unforgeable type identifiers                           │
 * │    Better than string-based duck typing"                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/24-symbols/03-symbol-use-cases.js
 */
