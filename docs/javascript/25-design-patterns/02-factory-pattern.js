/**
 * DESIGN PATTERNS: 02 - Factory Pattern
 *
 * ONE CONCEPT: Create objects without using 'new' directly
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS FACTORY?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Factory = A function/method that CREATES objects for you.
 *
 * Instead of:  new Dog(), new Cat(), new Bird()
 * You say:     AnimalFactory.create('dog')
 *
 * The factory decides HOW to create the object.
 *
 *
 * REAL-WORLD EXAMPLES:
 * ────────────────────
 *
 *   • document.createElement('div')   - Browser's element factory
 *   • React.createElement()           - Creates React elements
 *   • User roles: createUser('admin') - Different user types
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   const car = VehicleFactory.create('car');
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  EXECUTION FLOW                                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   1. Call: VehicleFactory.create('car')                              │
 *   │                                                                      │
 *   │   2. Factory looks at type 'car'                                     │
 *   │      ┌─────────────────────────────────────────────────────────┐     │
 *   │      │  switch(type) {                                         │     │
 *   │      │    case 'car':   return new Car();                      │     │
 *   │      │    case 'bike':  return new Bike();                     │     │
 *   │      │    case 'truck': return new Truck();                    │     │
 *   │      │  }                                                      │     │
 *   │      └─────────────────────────────────────────────────────────┘     │
 *   │                                                                      │
 *   │   3. Factory creates and returns: new Car()                          │
 *   │                                                                      │
 *   │   HEAP:                                                              │
 *   │   ┌────────────────────────┐                                         │
 *   │   │  Car Object            │◄─── car (reference)                     │
 *   │   │  { wheels: 4,          │                                         │
 *   │   │    drive() {...} }     │                                         │
 *   │   └────────────────────────┘                                         │
 *   │                                                                      │
 *   │   Caller doesn't know about 'new Car()'                              │
 *   │   Caller just asked for 'car'                                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 1: Simple Factory Function
// ═══════════════════════════════════════════════════════════════════════════

function createUser(role) {
  const user = {
    role,
    createdAt: new Date()
  };

  if (role === 'admin') {
    user.permissions = ['read', 'write', 'delete', 'manage'];
    user.accessLevel = 10;
  } else if (role === 'editor') {
    user.permissions = ['read', 'write'];
    user.accessLevel = 5;
  } else {
    user.permissions = ['read'];
    user.accessLevel = 1;
  }

  return user;
}

console.log('=== Simple Factory ===\n');

const admin = createUser('admin');
const viewer = createUser('viewer');

console.log('Admin:', admin);
console.log('Viewer:', viewer);


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 2: Factory with Classes
// ═══════════════════════════════════════════════════════════════════════════

class Car {
  constructor() {
    this.type = 'car';
    this.wheels = 4;
  }
  drive() { console.log('Driving car...'); }
}

class Motorcycle {
  constructor() {
    this.type = 'motorcycle';
    this.wheels = 2;
  }
  drive() { console.log('Riding motorcycle...'); }
}

class Truck {
  constructor() {
    this.type = 'truck';
    this.wheels = 6;
  }
  drive() { console.log('Hauling with truck...'); }
}

// The Factory
class VehicleFactory {
  static create(type) {
    switch (type) {
      case 'car':        return new Car();
      case 'motorcycle': return new Motorcycle();
      case 'truck':      return new Truck();
      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}

console.log('\n=== Factory with Classes ===\n');

const myCar = VehicleFactory.create('car');
const myBike = VehicleFactory.create('motorcycle');

console.log('Car:', myCar);
console.log('Motorcycle:', myBike);

myCar.drive();
myBike.drive();


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 3: Factory with Registration
// ═══════════════════════════════════════════════════════════════════════════

/**
 * More flexible - register new types at runtime
 */

class ShapeFactory {
  constructor() {
    this.shapes = {};
  }

  register(name, ShapeClass) {
    this.shapes[name] = ShapeClass;
  }

  create(name, ...args) {
    const ShapeClass = this.shapes[name];
    if (!ShapeClass) {
      throw new Error(`Shape "${name}" not registered`);
    }
    return new ShapeClass(...args);
  }
}

class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() { return this.width * this.height; }
}

console.log('\n=== Factory with Registration ===\n');

const factory = new ShapeFactory();
factory.register('circle', Circle);
factory.register('rectangle', Rectangle);

const circle = factory.create('circle', 5);
const rect = factory.create('rectangle', 4, 6);

console.log('Circle area:', circle.area());
console.log('Rectangle area:', rect.area());


// ═══════════════════════════════════════════════════════════════════════════
// WHY USE FACTORY?
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  BENEFITS                                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. HIDE COMPLEXITY                                                 │
 *   │     Caller doesn't need to know about different constructors        │
 *   │                                                                     │
 *   │  2. FLEXIBLE                                                        │
 *   │     Change what's created without changing caller code              │
 *   │                                                                     │
 *   │  3. CENTRALIZED                                                     │
 *   │     All creation logic in one place                                 │
 *   │                                                                     │
 *   │  4. TESTABLE                                                        │
 *   │     Easy to mock the factory for tests                              │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Factory pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Factory pattern provides a way to create objects without exposing
 * the creation logic to the caller. Instead of using 'new' directly,
 * you call a factory method and tell it what TYPE of object you want.
 *
 * For example, instead of new AdminUser() or new GuestUser(), you'd
 * call UserFactory.create('admin') and the factory handles which
 * constructor to use.
 *
 * The main benefits are:
 *
 * First, it hides complexity. The caller doesn't need to know about
 * different classes or constructors.
 *
 * Second, it's flexible. If I need to change how admins are created,
 * I only change the factory, not every place that creates admins.
 *
 * Third, it centralizes creation logic. All the decision-making about
 * what to create is in one place.
 *
 * A real-world example is document.createElement() - you pass 'div'
 * or 'span', and the browser figures out which object to create.
 *
 * I use factories when I have multiple related types that share an
 * interface, or when object creation involves complex logic that
 * shouldn't be repeated everywhere."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Creates objects without 'new' keyword
 * ✓ Caller passes type, factory returns object
 * ✓ Hides creation complexity
 * ✓ Centralizes creation logic
 * ✓ Example: document.createElement()
 *
 */


// RUN: node docs/25-design-patterns/02-factory-pattern.js
