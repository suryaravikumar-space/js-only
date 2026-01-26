/**
 * CLASSES & OOP: 06 - Private Fields and Methods (ES2022)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Use # prefix for TRUE private fields and methods.                          ║
 * ║ They are NOT accessible outside the class - not even with bracket notation!║
 * ║                                                                            ║
 * ║   class User {                                                             ║
 * ║     #password;  // Truly private - cannot be accessed outside              ║
 * ║   }                                                                        ║
 * ║   user.#password;      // SyntaxError!                                     ║
 * ║   user['#password'];   // undefined (different property!)                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE PRIVATE FIELDS - Real World Justification                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE # PRIVATE WHEN:                                                         │
 * │                                                                             │
 * │ 1. INTERNAL STATE that consumers shouldn't access                           │
 * │    → #password, #apiKey, #secretToken                                       │
 * │    → #cache, #internalBuffer                                                │
 * │    → Implementation details that might change                               │
 * │                                                                             │
 * │ 2. PREVENTING ACCIDENTAL MODIFICATION                                       │
 * │    → #id that shouldn't be changed after creation                           │
 * │    → #state machine internals                                               │
 * │                                                                             │
 * │ 3. ENCAPSULATION (hiding complexity)                                        │
 * │    → #validateInput(), #formatOutput()                                      │
 * │    → Users don't need to know about internal helpers                        │
 * │                                                                             │
 * │ 4. LIBRARY/FRAMEWORK CODE                                                   │
 * │    → Prevent users from depending on internals                              │
 * │    → Safe to refactor without breaking consumers                            │
 * │                                                                             │
 * │ USE _UNDERSCORE CONVENTION WHEN:                                            │
 * │                                                                             │
 * │ 1. Need inheritance access (# is not inherited)                             │
 * │ 2. Working with older environments (# requires ES2022)                      │
 * │ 3. Team prefers convention over enforcement                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC PRIVATE FIELDS
// ═══════════════════════════════════════════════════════════════════════════════

class BankAccount {
  // Private fields MUST be declared at class level
  #balance = 0;
  #pin;
  #transactionHistory = [];

  constructor(initialBalance, pin) {
    this.accountNumber = Math.random().toString(36).substring(7);  // Public
    this.#balance = initialBalance;
    this.#pin = pin;
    this.#logTransaction('OPEN', initialBalance);
  }

  // Private method
  #logTransaction(type, amount) {
    this.#transactionHistory.push({
      type,
      amount,
      date: new Date(),
      balance: this.#balance
    });
  }

  // Private validation method
  #validatePin(pin) {
    return this.#pin === pin;
  }

  // Public methods to interact with private state
  deposit(amount) {
    if (amount <= 0) throw new Error('Deposit must be positive');
    this.#balance += amount;
    this.#logTransaction('DEPOSIT', amount);
    return this.#balance;
  }

  withdraw(amount, pin) {
    if (!this.#validatePin(pin)) {
      throw new Error('Invalid PIN');
    }
    if (amount > this.#balance) {
      throw new Error('Insufficient funds');
    }
    this.#balance -= amount;
    this.#logTransaction('WITHDRAW', -amount);
    return amount;
  }

  getBalance(pin) {
    if (!this.#validatePin(pin)) {
      throw new Error('Invalid PIN');
    }
    return this.#balance;
  }

  getStatement(pin) {
    if (!this.#validatePin(pin)) {
      throw new Error('Invalid PIN');
    }
    return [...this.#transactionHistory];  // Return copy
  }
}

const account = new BankAccount(1000, '1234');

console.log('A:', account.accountNumber);  // Random public ID
console.log('B:', account.deposit(500));   // 1500
console.log('C:', account.getBalance('1234'));  // 1500

// Try to access private fields - ALL FAIL!
console.log('D:', account.balance);        // undefined (not #balance)
console.log('E:', account['#balance']);    // undefined (different property!)
// console.log(account.#balance);          // SyntaxError!

// Try wrong PIN
try {
  account.withdraw(100, 'wrong');
} catch (e) {
  console.log('F:', e.message);  // Invalid PIN
}

/**
 * OUTPUT:
 *   A: [random string]
 *   B: 1500
 *   C: 1500
 *   D: undefined
 *   E: undefined
 *   F: Invalid PIN
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRIVATE vs UNDERSCORE CONVENTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: # PRIVATE vs _ CONVENTION                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ class WithUnderscore {            class WithPrivate {                       │
 * │   constructor() {                   #secret;  // Declared first             │
 * │     this._secret = 'shh';           constructor() {                         │
 * │   }                                   this.#secret = 'shh';                 │
 * │ }                                   }                                       │
 * │                                   }                                         │
 * │                                                                             │
 * │ const a = new WithUnderscore();   const b = new WithPrivate();              │
 * │ a._secret  // 'shh' - Accessible! b.#secret  // SyntaxError!                │
 * │                                                                             │
 * │ ┌──────────────────┬──────────────────────┬────────────────────────┐        │
 * │ │ Aspect           │ _underscore          │ #private               │        │
 * │ ├──────────────────┼──────────────────────┼────────────────────────┤        │
 * │ │ Enforcement      │ Convention only      │ Language enforced      │        │
 * │ │ Access           │ Still accessible     │ SyntaxError            │        │
 * │ │ Inheritance      │ Works normally       │ Not accessible!        │        │
 * │ │ Reflection       │ Shows in Object.keys │ Hidden completely      │        │
 * │ │ Browser support  │ All                  │ ES2022+ (modern)       │        │
 * │ │ TypeScript       │ Use 'private'        │ Use #                  │        │
 * │ └──────────────────┴──────────────────────┴────────────────────────┘        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class DemoUnderscore {
  constructor() {
    this._secret = 'visible';
  }
}

class DemoPrivate {
  #secret = 'hidden';

  getSecret() {
    return this.#secret;
  }
}

const demo1 = new DemoUnderscore();
const demo2 = new DemoPrivate();

console.log('G:', Object.keys(demo1));  // ['_secret'] - visible!
console.log('H:', Object.keys(demo2));  // [] - truly hidden!
console.log('I:', demo1._secret);       // 'visible' - accessible
console.log('J:', demo2.getSecret());   // 'hidden' - only via method

/**
 * OUTPUT:
 *   G: [ '_secret' ]
 *   H: []
 *   I: visible
 *   J: hidden
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRIVATE STATIC FIELDS
// ═══════════════════════════════════════════════════════════════════════════════

class ApiClient {
  static #apiKey = null;
  static #requestCount = 0;

  static initialize(apiKey) {
    ApiClient.#apiKey = apiKey;
  }

  static #getHeaders() {
    return {
      'Authorization': `Bearer ${ApiClient.#apiKey}`,
      'X-Request-Count': ApiClient.#requestCount
    };
  }

  static async fetch(url) {
    if (!ApiClient.#apiKey) {
      throw new Error('API not initialized! Call ApiClient.initialize(key) first');
    }

    ApiClient.#requestCount++;
    console.log(`Fetching ${url} with headers:`, ApiClient.#getHeaders());
    // Simulated fetch
    return { data: 'response' };
  }

  static getRequestCount() {
    return ApiClient.#requestCount;
  }
}

// Initialize once
ApiClient.initialize('super-secret-key');

// Use the client
ApiClient.fetch('/users');
ApiClient.fetch('/products');

console.log('K:', ApiClient.getRequestCount());  // 2

// Cannot access private static
// console.log(ApiClient.#apiKey);  // SyntaxError!

/**
 * OUTPUT:
 *   Fetching /users with headers: { Authorization: 'Bearer super-secret-key', 'X-Request-Count': 1 }
 *   Fetching /products with headers: { Authorization: 'Bearer super-secret-key', 'X-Request-Count': 2 }
 *   K: 2
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRIVATE FIELDS AND INHERITANCE - TRICKY!
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CRITICAL: Private fields are NOT inherited!                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Each class has its OWN private fields.                                      │
 * │ Child cannot access parent's #private.                                      │
 * │ Child can have same-named #field (they're different!)                       │
 * │                                                                             │
 * │ If you need inheritance access, use _underscore convention instead.         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Parent {
  #secret = 'parent secret';

  getSecret() {
    return this.#secret;
  }

  setSecret(value) {
    this.#secret = value;
  }
}

class Child extends Parent {
  // This is a DIFFERENT #secret!
  #secret = 'child secret';

  getChildSecret() {
    return this.#secret;  // Child's own #secret
  }

  tryAccessParent() {
    // Cannot do this:
    // return this.#secret;  // This is Child's #secret, not Parent's!
    // super.#secret;        // SyntaxError!
    return this.getSecret();  // Must use Parent's public method
  }
}

const child = new Child();

console.log('L:', child.getSecret());      // 'parent secret' (via Parent method)
console.log('M:', child.getChildSecret()); // 'child secret' (Child's own)
console.log('N:', child.tryAccessParent()); // 'parent secret'

child.setSecret('modified');
console.log('O:', child.getSecret());      // 'modified'
console.log('P:', child.getChildSecret()); // 'child secret' (unchanged!)

/**
 * OUTPUT:
 *   L: parent secret
 *   M: child secret
 *   N: parent secret
 *   O: modified
 *   P: child secret
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CHECKING IF OBJECT HAS PRIVATE FIELD
// ═══════════════════════════════════════════════════════════════════════════════

class TypeChecker {
  #brand;  // Used as type marker

  constructor() {
    this.#brand = true;
  }

  static isInstance(obj) {
    try {
      // #brand in obj - ES2022 private-in operator
      return #brand in obj;
    } catch {
      return false;
    }
  }
}

const tc = new TypeChecker();
const fake = { someProperty: true };

console.log('Q:', TypeChecker.isInstance(tc));    // true
console.log('R:', TypeChecker.isInstance(fake));  // false
console.log('S:', TypeChecker.isInstance({}));    // false

/**
 * OUTPUT:
 *   Q: true
 *   R: false
 *   S: false
 */


// ═══════════════════════════════════════════════════════════════════════════════
// REAL WORLD: Secure Configuration
// ═══════════════════════════════════════════════════════════════════════════════

class SecureConfig {
  #encryptionKey;
  #config = {};

  constructor(encryptionKey) {
    this.#encryptionKey = encryptionKey;
  }

  // Simulated encryption (real app would use crypto)
  #encrypt(value) {
    return btoa(`${this.#encryptionKey}:${value}`);
  }

  #decrypt(encoded) {
    const decoded = atob(encoded);
    const [, value] = decoded.split(':');
    return value;
  }

  set(key, value, sensitive = false) {
    this.#config[key] = sensitive ? this.#encrypt(value) : value;
  }

  get(key, isSensitive = false) {
    const value = this.#config[key];
    return isSensitive ? this.#decrypt(value) : value;
  }

  // Only returns non-sensitive config
  toJSON() {
    return { ...this.#config };
  }
}

const config = new SecureConfig('my-secret-key');
config.set('apiUrl', 'https://api.example.com');
config.set('apiSecret', 'super-secret-token', true);  // Encrypted!

console.log('T:', config.get('apiUrl'));                // https://api.example.com
console.log('U:', config.toJSON().apiSecret);           // [encrypted gibberish]
console.log('V:', config.get('apiSecret', true));       // super-secret-token

/**
 * OUTPUT:
 *   T: https://api.example.com
 *   U: bXktc2VjcmV0LWtleTpzdXBlci1zZWNyZXQtdG9rZW4=
 *   V: super-secret-token
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES2022 introduced true private fields using the # prefix. Unlike the       │
 * │  _underscore convention, # private fields are enforced by the language:     │
 * │                                                                             │
 * │  - Accessing obj.#field outside the class is a SyntaxError                  │
 * │  - obj['#field'] doesn't work (it's a different property)                   │
 * │  - Private fields don't show in Object.keys() or JSON                       │
 * │                                                                             │
 * │  Key rules:                                                                 │
 * │  - Private fields MUST be declared at class level (not just in constructor) │
 * │  - Private fields are NOT inherited (child can't access parent's #field)    │
 * │  - Use 'in' operator to check: #field in obj                                │
 * │                                                                             │
 * │  When to use #private:                                                      │
 * │  - Sensitive data (passwords, tokens, keys)                                 │
 * │  - Internal implementation details                                          │
 * │  - Library code where you need to protect internals                         │
 * │                                                                             │
 * │  When to use _underscore:                                                   │
 * │  - Need inheritance access                                                  │
 * │  - Supporting older browsers                                                │
 * │  - Team prefers convention over enforcement                                 │
 * │                                                                             │
 * │  You can also have static private: static #apiKey                           │
 * │  And private methods: #validateInput() { }"                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/06-private-fields.js
 */
