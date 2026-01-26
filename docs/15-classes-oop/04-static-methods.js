/**
 * CLASSES & OOP: 04 - Static Methods and Properties
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Static members belong to the CLASS, not to instances.                      ║
 * ║ Call them on the class itself: ClassName.method()                          ║
 * ║                                                                            ║
 * ║   class MathUtils {                                                        ║
 * ║     static add(a, b) { return a + b; }  // Called: MathUtils.add(1, 2)     ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║   const util = new MathUtils();                                            ║
 * ║   util.add(1, 2);  // ERROR! Static methods aren't on instances            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE STATIC METHODS - Real World Justification                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE STATIC WHEN:                                                            │
 * │                                                                             │
 * │ 1. UTILITY FUNCTIONS that don't need instance data                          │
 * │    → Math.max(), Math.round()                                               │
 * │    → Validator.isEmail(str)                                                 │
 * │    → No 'this' needed, just input → output                                  │
 * │                                                                             │
 * │ 2. FACTORY METHODS that create instances                                    │
 * │    → Date.now(), User.fromJSON(), Array.from()                              │
 * │    → Alternative constructors with meaningful names                         │
 * │                                                                             │
 * │ 3. CONSTANTS shared across all instances                                    │
 * │    → HttpStatus.OK = 200                                                    │
 * │    → Config.API_URL                                                         │
 * │                                                                             │
 * │ 4. SINGLETON access                                                         │
 * │    → Database.getInstance()                                                 │
 * │    → Logger.getInstance()                                                   │
 * │                                                                             │
 * │ 5. CLASS-LEVEL TRACKING                                                     │
 * │    → User.count (total users created)                                       │
 * │    → Connection.active (active connections)                                 │
 * │                                                                             │
 * │ DON'T USE STATIC WHEN:                                                      │
 * │                                                                             │
 * │ 1. Method needs 'this' (instance data)                                      │
 * │ 2. Behavior varies per instance                                             │
 * │ 3. You need polymorphism (different behavior in subclasses)                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC STATIC METHODS
// ═══════════════════════════════════════════════════════════════════════════════

class Calculator {
  // Static method - belongs to class
  static add(a, b) {
    return a + b;
  }

  static subtract(a, b) {
    return a - b;
  }

  static multiply(a, b) {
    return a * b;
  }

  // Instance method - needs 'new' to use
  calculate(operation, a, b) {
    switch(operation) {
      case '+': return a + b;
      case '-': return a - b;
      default: return NaN;
    }
  }
}

// Static methods called on CLASS
console.log('A:', Calculator.add(5, 3));       // 8
console.log('B:', Calculator.subtract(10, 4)); // 6

// Instance methods called on INSTANCE
const calc = new Calculator();
console.log('C:', calc.calculate('+', 5, 3));  // 8

// What happens if you try to call static on instance?
console.log('D:', calc.add);  // undefined - not on instance!

/**
 * OUTPUT:
 *   A: 8
 *   B: 6
 *   C: 8
 *   D: undefined
 */


// ═══════════════════════════════════════════════════════════════════════════════
// STATIC PROPERTIES (ES2022+)
// ═══════════════════════════════════════════════════════════════════════════════

class AppConfig {
  // Static properties
  static API_URL = 'https://api.example.com';
  static VERSION = '1.0.0';
  static MAX_RETRIES = 3;
  static #SECRET_KEY = 'super-secret';  // Private static (ES2022)

  static getConfig() {
    return {
      url: this.API_URL,  // 'this' in static = the class itself
      version: this.VERSION
    };
  }

  // Can access private static within the class
  static getSecretKey() {
    return this.#SECRET_KEY;
  }
}

console.log('E:', AppConfig.API_URL);         // https://api.example.com
console.log('F:', AppConfig.VERSION);         // 1.0.0
console.log('G:', AppConfig.getConfig());     // { url: '...', version: '1.0.0' }
console.log('H:', AppConfig.getSecretKey());  // super-secret

// Private static not accessible outside
// console.log(AppConfig.#SECRET_KEY);  // SyntaxError!

/**
 * OUTPUT:
 *   E: https://api.example.com
 *   F: 1.0.0
 *   G: { url: 'https://api.example.com', version: '1.0.0' }
 *   H: super-secret
 */


// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY METHODS - Creating Instances Differently
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE FACTORY METHODS                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Create instances from different data formats (JSON, XML, CSV)            │
 * │ 2. Provide meaningful names for creation (User.fromEmail vs new User)       │
 * │ 3. Async creation (can't use async constructor)                             │
 * │ 4. Validation before creation                                               │
 * │ 5. Return cached instances (flyweight pattern)                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  // Factory: Create from JSON string
  static fromJSON(jsonString) {
    const data = JSON.parse(jsonString);
    return new User(data.id, data.name, data.email);
  }

  // Factory: Create from form data
  static fromFormData(formData) {
    return new User(
      Date.now(),  // Generate ID
      formData.get('name'),
      formData.get('email')
    );
  }

  // Factory: Create guest user
  static createGuest() {
    return new User(0, 'Guest', 'guest@example.com');
  }

  // Async factory (constructor can't be async!)
  static async fetchById(id) {
    // Simulate API call
    const response = await Promise.resolve({
      id,
      name: 'Fetched User',
      email: 'fetched@example.com'
    });
    return new User(response.id, response.name, response.email);
  }
}

// Different ways to create users
const user1 = new User(1, 'Alice', 'alice@example.com');
const user2 = User.fromJSON('{"id": 2, "name": "Bob", "email": "bob@example.com"}');
const guest = User.createGuest();

console.log('I:', user1.name);  // Alice
console.log('J:', user2.name);  // Bob
console.log('K:', guest.name);  // Guest

// Async factory
User.fetchById(3).then(user => {
  console.log('L:', user.name);  // Fetched User
});

/**
 * OUTPUT:
 *   I: Alice
 *   J: Bob
 *   K: Guest
 *   L: Fetched User
 */


// ═══════════════════════════════════════════════════════════════════════════════
// TRACKING INSTANCES WITH STATIC
// ═══════════════════════════════════════════════════════════════════════════════

class Connection {
  static #count = 0;
  static #connections = [];

  constructor(host) {
    this.host = host;
    this.id = ++Connection.#count;  // Auto-increment ID
    Connection.#connections.push(this);
  }

  static getCount() {
    return Connection.#count;
  }

  static getAllConnections() {
    return [...Connection.#connections];  // Return copy
  }

  static closeAll() {
    Connection.#connections.forEach(conn => conn.close());
    Connection.#connections = [];
  }

  close() {
    console.log(`Closing connection ${this.id} to ${this.host}`);
  }
}

const conn1 = new Connection('localhost:3000');
const conn2 = new Connection('api.example.com');
const conn3 = new Connection('db.example.com');

console.log('M:', Connection.getCount());  // 3
console.log('N:', Connection.getAllConnections().map(c => c.host));

/**
 * OUTPUT:
 *   M: 3
 *   N: [ 'localhost:3000', 'api.example.com', 'db.example.com' ]
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON PATTERN WITH STATIC
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE SINGLETON                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Database connection pools (expensive to create multiple)                 │
 * │ 2. Configuration managers (single source of truth)                          │
 * │ 3. Logging services (consistent logging throughout app)                     │
 * │ 4. Cache managers (shared cache across modules)                             │
 * │                                                                             │
 * │ BE CAREFUL:                                                                 │
 * │ - Singletons can make testing harder (global state)                         │
 * │ - Consider dependency injection as alternative                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Database {
  static #instance = null;

  constructor(connectionString) {
    if (Database.#instance) {
      throw new Error('Database already initialized! Use Database.getInstance()');
    }
    this.connectionString = connectionString;
    this.connected = false;
  }

  static getInstance(connectionString) {
    if (!Database.#instance) {
      Database.#instance = new Database(connectionString);
    }
    return Database.#instance;
  }

  connect() {
    this.connected = true;
    return `Connected to ${this.connectionString}`;
  }

  query(sql) {
    if (!this.connected) throw new Error('Not connected!');
    return `Executing: ${sql}`;
  }
}

// Always returns same instance
const db1 = Database.getInstance('mongodb://localhost:27017');
const db2 = Database.getInstance('different://url');  // Ignored!

console.log('O:', db1 === db2);  // true - same instance!
console.log('P:', db2.connectionString);  // mongodb://localhost:27017

/**
 * OUTPUT:
 *   O: true
 *   P: mongodb://localhost:27017
 */


// ═══════════════════════════════════════════════════════════════════════════════
// STATIC IN INHERITANCE
// ═══════════════════════════════════════════════════════════════════════════════

class Animal {
  static kingdom = 'Animalia';

  static describe() {
    return `Kingdom: ${this.kingdom}`;
  }
}

class Dog extends Animal {
  static species = 'Canis familiaris';

  static describe() {
    // Access parent static with super
    return `${super.describe()}, Species: ${this.species}`;
  }
}

console.log('Q:', Animal.kingdom);    // Animalia
console.log('R:', Dog.kingdom);       // Animalia (inherited!)
console.log('S:', Dog.species);       // Canis familiaris
console.log('T:', Animal.describe()); // Kingdom: Animalia
console.log('U:', Dog.describe());    // Kingdom: Animalia, Species: Canis familiaris

/**
 * OUTPUT:
 *   Q: Animalia
 *   R: Animalia
 *   S: Canis familiaris
 *   T: Kingdom: Animalia
 *   U: Kingdom: Animalia, Species: Canis familiaris
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STATIC INHERITANCE VISUAL                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────────┐                                           │
 * │   │ Animal (class)              │                                           │
 * │   │                             │                                           │
 * │   │ static kingdom = 'Animalia' │                                           │
 * │   │ static describe()           │                                           │
 * │   │                             │                                           │
 * │   └──────────────┬──────────────┘                                           │
 * │                  │ extends (prototype chain for classes too!)               │
 * │                  ▼                                                          │
 * │   ┌─────────────────────────────┐                                           │
 * │   │ Dog (class)                 │                                           │
 * │   │                             │                                           │
 * │   │ static species = 'Canis...' │                                           │
 * │   │ static describe()           │ ← overrides Animal.describe               │
 * │   │                             │                                           │
 * │   │ Can access Animal.kingdom   │ ← inherited static!                       │
 * │   │ via Dog.kingdom             │                                           │
 * │   └─────────────────────────────┘                                           │
 * │                                                                             │
 * │   Static properties are inherited through the class chain!                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// REAL-WORLD EXAMPLE: Validator Class
// ═══════════════════════════════════════════════════════════════════════════════

class Validator {
  static EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static URL_REGEX = /^https?:\/\/.+/;

  static isEmail(str) {
    return this.EMAIL_REGEX.test(str);
  }

  static isURL(str) {
    return this.URL_REGEX.test(str);
  }

  static isNotEmpty(str) {
    return str && str.trim().length > 0;
  }

  static isInRange(num, min, max) {
    return num >= min && num <= max;
  }

  // Validate an object against rules
  static validate(data, rules) {
    const errors = [];

    for (const [field, validators] of Object.entries(rules)) {
      for (const validator of validators) {
        const result = validator(data[field]);
        if (result !== true) {
          errors.push({ field, error: result });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Using the validator
console.log('V:', Validator.isEmail('test@example.com'));  // true
console.log('W:', Validator.isEmail('invalid'));           // false
console.log('X:', Validator.isURL('https://google.com'));  // true

const result = Validator.validate(
  { email: 'bad-email', age: 150 },
  {
    email: [
      (v) => Validator.isEmail(v) || 'Invalid email format'
    ],
    age: [
      (v) => Validator.isInRange(v, 0, 120) || 'Age must be 0-120'
    ]
  }
);

console.log('Y:', result);

/**
 * OUTPUT:
 *   V: true
 *   W: false
 *   X: true
 *   Y: { valid: false, errors: [ { field: 'email', error: 'Invalid email format' }, { field: 'age', error: 'Age must be 0-120' } ] }
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Static methods and properties belong to the class itself, not instances.   │
 * │  Call them on the class: ClassName.method(), not instance.method().         │
 * │                                                                             │
 * │  When to use static:                                                        │
 * │                                                                             │
 * │  1. UTILITY FUNCTIONS - Pure functions without instance data                │
 * │     Example: Math.max(), Validator.isEmail()                                │
 * │                                                                             │
 * │  2. FACTORY METHODS - Alternative ways to create instances                  │
 * │     Example: User.fromJSON(), Date.now(), Array.from()                      │
 * │     Especially useful for async creation (constructors can't be async)      │
 * │                                                                             │
 * │  3. CONSTANTS - Shared configuration                                        │
 * │     Example: HttpStatus.OK = 200, Config.API_URL                            │
 * │                                                                             │
 * │  4. INSTANCE TRACKING - Count objects, cache instances                      │
 * │     Example: User.count, Connection.active                                  │
 * │                                                                             │
 * │  5. SINGLETON PATTERN - Single shared instance                              │
 * │     Example: Database.getInstance()                                         │
 * │                                                                             │
 * │  In static methods, 'this' refers to the class itself.                      │
 * │  Static members ARE inherited by child classes.                             │
 * │  Use super.staticMethod() to call parent's static method."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/04-static-methods.js
 */
