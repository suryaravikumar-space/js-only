/**
 * CLASSES & OOP: 05 - Getters and Setters
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Getters and setters look like properties but run code when accessed.       ║
 * ║                                                                            ║
 * ║   get fullName() { return this.first + ' ' + this.last; }                  ║
 * ║   set fullName(v) { [this.first, this.last] = v.split(' '); }              ║
 * ║                                                                            ║
 * ║   user.fullName;           // Calls getter (no parentheses!)               ║
 * ║   user.fullName = 'John';  // Calls setter                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE GETTERS/SETTERS - Real World Justification                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE GETTERS WHEN:                                                           │
 * │                                                                             │
 * │ 1. COMPUTED PROPERTIES (derived from other properties)                      │
 * │    → fullName = firstName + lastName                                        │
 * │    → age = calculate from birthDate                                         │
 * │    → total = items.reduce(sum)                                              │
 * │                                                                             │
 * │ 2. LAZY EVALUATION (expensive computation only when needed)                 │
 * │    → Only calculate when actually accessed                                  │
 * │    → Can cache result for subsequent calls                                  │
 * │                                                                             │
 * │ 3. CLEAN API (access computed value like a property)                        │
 * │    → user.age instead of user.getAge()                                      │
 * │    → More natural, cleaner code                                             │
 * │                                                                             │
 * │ USE SETTERS WHEN:                                                           │
 * │                                                                             │
 * │ 1. VALIDATION (check values before storing)                                 │
 * │    → Ensure age is positive                                                 │
 * │    → Validate email format                                                  │
 * │                                                                             │
 * │ 2. SIDE EFFECTS (trigger actions on change)                                 │
 * │    → Update DOM when property changes                                       │
 * │    → Log changes for debugging                                              │
 * │    → Notify observers (reactive programming)                                │
 * │                                                                             │
 * │ 3. TRANSFORMATION (modify value before storing)                             │
 * │    → Trim whitespace                                                        │
 * │    → Convert to lowercase                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC GETTERS AND SETTERS
// ═══════════════════════════════════════════════════════════════════════════════

class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // GETTER - computed property
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // SETTER - allows setting fullName
  set fullName(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts.slice(1).join(' ');
  }
}

const person = new Person('John', 'Doe');

// Access like a property (no parentheses!)
console.log('A:', person.fullName);  // John Doe

// Set like a property
person.fullName = 'Jane Smith';
console.log('B:', person.firstName);  // Jane
console.log('C:', person.lastName);   // Smith
console.log('D:', person.fullName);   // Jane Smith

/**
 * OUTPUT:
 *   A: John Doe
 *   B: Jane
 *   C: Smith
 *   D: Jane Smith
 */


// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION WITH SETTERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY USE SETTERS FOR VALIDATION                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Without setter: Anyone can set invalid values                               │
 * │   user.age = -5;  // No validation!                                         │
 * │   user.email = 'not-an-email';  // No validation!                           │
 * │                                                                             │
 * │ With setter: Validation happens automatically                               │
 * │   user.age = -5;  // Throws error or ignores                                │
 * │   user.email = 'not-an-email';  // Throws error                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class User {
  constructor(name, email, age) {
    // Using setters for initial validation too!
    this.name = name;
    this.email = email;
    this.age = age;
  }

  // Name validation
  get name() {
    return this._name;
  }

  set name(value) {
    if (!value || value.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    this._name = value.trim();
  }

  // Email validation
  get email() {
    return this._email;
  }

  set email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
    this._email = value.toLowerCase();  // Normalize
  }

  // Age validation
  get age() {
    return this._age;
  }

  set age(value) {
    if (typeof value !== 'number' || value < 0 || value > 150) {
      throw new Error('Age must be a number between 0 and 150');
    }
    this._age = Math.floor(value);  // Store as integer
  }
}

const user = new User('Alice', 'alice@example.com', 30);
console.log('E:', user.name);   // Alice
console.log('F:', user.email);  // alice@example.com (lowercased)
console.log('G:', user.age);    // 30

// Try invalid values
try {
  user.age = -5;
} catch (e) {
  console.log('H:', e.message);  // Age must be a number between 0 and 150
}

try {
  user.email = 'invalid';
} catch (e) {
  console.log('I:', e.message);  // Invalid email format
}

/**
 * OUTPUT:
 *   E: Alice
 *   F: alice@example.com
 *   G: 30
 *   H: Age must be a number between 0 and 150
 *   I: Invalid email format
 */


// ═══════════════════════════════════════════════════════════════════════════════
// COMPUTED PROPERTIES WITH CACHING
// ═══════════════════════════════════════════════════════════════════════════════

class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this._areaCache = null;  // Cache for expensive computation
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
    this._areaCache = null;  // Invalidate cache
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
    this._areaCache = null;  // Invalidate cache
  }

  // Computed: Area
  get area() {
    // Simple computation here, but imagine expensive calculation
    if (this._areaCache === null) {
      console.log('  (computing area...)');
      this._areaCache = this._width * this._height;
    }
    return this._areaCache;
  }

  // Computed: Perimeter (no caching - simple enough)
  get perimeter() {
    return 2 * (this._width + this._height);
  }

  // Computed: Is it a square?
  get isSquare() {
    return this._width === this._height;
  }
}

const rect = new Rectangle(10, 5);

console.log('J:', rect.area);       // (computing...) 50
console.log('K:', rect.area);       // 50 (cached, no recompute!)
console.log('L:', rect.perimeter);  // 30
console.log('M:', rect.isSquare);   // false

rect.width = 5;  // Change dimension
console.log('N:', rect.area);       // (computing...) 25 (recomputed!)
console.log('O:', rect.isSquare);   // true

/**
 * OUTPUT:
 *   (computing area...)
 *   J: 50
 *   K: 50
 *   L: 30
 *   M: false
 *   (computing area...)
 *   N: 25
 *   O: true
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GETTER-ONLY (READ-ONLY PROPERTIES)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE GETTER-ONLY                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Computed values that shouldn't be set directly                           │
 * │    → age (derived from birthDate)                                           │
 * │    → total (derived from items)                                             │
 * │                                                                             │
 * │ 2. System-generated values                                                  │
 * │    → id (auto-generated)                                                    │
 * │    → createdAt (set once)                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Employee {
  static #nextId = 1;

  constructor(name, birthYear, salary) {
    this._id = Employee.#nextId++;  // Auto-generated
    this._name = name;
    this._birthYear = birthYear;
    this._salary = salary;
    this._createdAt = new Date();
  }

  // Read-only ID
  get id() {
    return this._id;
  }
  // No setter - can't change ID!

  // Read-only creation date
  get createdAt() {
    return this._createdAt;
  }
  // No setter - immutable

  // Computed age (always current)
  get age() {
    return new Date().getFullYear() - this._birthYear;
  }
  // No setter - set birthYear instead!

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}

const emp = new Employee('Bob', 1990, 75000);

console.log('P:', emp.id);         // 1
console.log('Q:', emp.age);        // Current year - 1990
console.log('R:', emp.createdAt);  // [Date object]

// Try to set read-only
emp.id = 999;  // Silently ignored (no setter!)
console.log('S:', emp.id);  // Still 1

/**
 * OUTPUT:
 *   P: 1
 *   Q: 35 (or current year - 1990)
 *   R: [Date]
 *   S: 1
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SIDE EFFECTS IN SETTERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL-WORLD USE CASES FOR SIDE EFFECTS                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. REACTIVE UI (Vue, MobX) - Update DOM when data changes                   │
 * │ 2. LOGGING/DEBUGGING - Track all property changes                           │
 * │ 3. OBSERVER PATTERN - Notify subscribers of changes                         │
 * │ 4. PERSISTENCE - Auto-save to localStorage/database                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Observable {
  constructor() {
    this._listeners = {};
  }

  on(property, callback) {
    if (!this._listeners[property]) {
      this._listeners[property] = [];
    }
    this._listeners[property].push(callback);
  }

  _notify(property, oldValue, newValue) {
    if (this._listeners[property]) {
      this._listeners[property].forEach(cb =>
        cb({ property, oldValue, newValue })
      );
    }
  }
}

class Settings extends Observable {
  constructor() {
    super();
    this._theme = 'light';
    this._fontSize = 16;
  }

  get theme() {
    return this._theme;
  }

  set theme(value) {
    if (value !== this._theme) {
      const oldValue = this._theme;
      this._theme = value;
      this._notify('theme', oldValue, value);  // Side effect!
    }
  }

  get fontSize() {
    return this._fontSize;
  }

  set fontSize(value) {
    if (value !== this._fontSize) {
      const oldValue = this._fontSize;
      this._fontSize = value;
      this._notify('fontSize', oldValue, value);  // Side effect!
    }
  }
}

const settings = new Settings();

// Subscribe to changes
settings.on('theme', (change) => {
  console.log(`Theme changed: ${change.oldValue} → ${change.newValue}`);
});

settings.on('fontSize', (change) => {
  console.log(`Font size changed: ${change.oldValue} → ${change.newValue}`);
});

// Trigger side effects
settings.theme = 'dark';
settings.fontSize = 18;
settings.theme = 'dark';  // No change, no notification

/**
 * OUTPUT:
 *   Theme changed: light → dark
 *   Font size changed: 16 → 18
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GETTERS/SETTERS ON OBJECT LITERALS
// ═══════════════════════════════════════════════════════════════════════════════

const counter = {
  _count: 0,

  get count() {
    return this._count;
  },

  set count(value) {
    if (value < 0) {
      console.log('Count cannot be negative!');
      return;
    }
    this._count = value;
  },

  increment() {
    this._count++;
  }
};

console.log('T:', counter.count);  // 0
counter.count = 10;
console.log('U:', counter.count);  // 10
counter.count = -5;                // Count cannot be negative!
console.log('V:', counter.count);  // Still 10

/**
 * OUTPUT:
 *   T: 0
 *   U: 10
 *   Count cannot be negative!
 *   V: 10
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Object.defineProperty - ADVANCED CONTROL
// ═══════════════════════════════════════════════════════════════════════════════

const product = { name: 'Laptop' };

Object.defineProperty(product, 'price', {
  get() {
    return this._price;
  },
  set(value) {
    if (value < 0) throw new Error('Price cannot be negative');
    this._price = value;
  },
  enumerable: true,  // Shows up in for...in
  configurable: false  // Cannot be deleted or redefined
});

product.price = 999;
console.log('W:', product.price);  // 999

// Property shows in keys because enumerable: true
console.log('X:', Object.keys(product));  // ['name', 'price']


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Getters and setters are special methods that look like properties.         │
 * │  You access them without parentheses: obj.prop instead of obj.getProp()     │
 * │                                                                             │
 * │  Use GETTERS for:                                                           │
 * │  - Computed properties (fullName = first + last)                            │
 * │  - Lazy evaluation with caching (expensive computation)                     │
 * │  - Clean API (obj.total vs obj.getTotal())                                  │
 * │                                                                             │
 * │  Use SETTERS for:                                                           │
 * │  - Validation (ensure age is positive)                                      │
 * │  - Side effects (notify observers, update DOM)                              │
 * │  - Transformation (trim, lowercase)                                         │
 * │                                                                             │
 * │  Common pattern: Use _underscore for backing field                          │
 * │    get name() { return this._name; }                                        │
 * │    set name(v) { this._name = v.trim(); }                                   │
 * │                                                                             │
 * │  Getter-only creates read-only property (no setter = can't assign)          │
 * │                                                                             │
 * │  Real-world uses:                                                           │
 * │  - Vue/MobX reactivity (setter triggers re-render)                          │
 * │  - Form validation (setter validates before storing)                        │
 * │  - Computed values (Array.length, Element.innerHTML)"                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/05-getters-setters.js
 */
