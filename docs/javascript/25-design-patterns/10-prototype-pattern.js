/**
 * DESIGN PATTERNS: 10 - Prototype Pattern
 *
 * ONE CONCEPT: Create new objects by CLONING existing ones
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS PROTOTYPE PATTERN?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Prototype = Create new objects by COPYING an existing object (prototype).
 *
 * Instead of: new Object() and configure it
 * Do: existingObject.clone()
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Making photocopies:
 *   - Instead of writing a letter from scratch each time
 *   - Write it once, then photocopy
 *   - Modify the copy if needed
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   const clone = original.clone();
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEMORY                                                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   BEFORE CLONE:                                                      │
 *   │                                                                      │
 *   │   ┌─────────────────────────────┐                                    │
 *   │   │  original                   │                                    │
 *   │   │  {                          │                                    │
 *   │   │    name: 'Template',        │                                    │
 *   │   │    settings: { theme: 'dark' }                                   │
 *   │   │  }                          │                                    │
 *   │   └─────────────────────────────┘                                    │
 *   │                                                                      │
 *   │                                                                      │
 *   │   AFTER clone():                                                     │
 *   │                                                                      │
 *   │   ┌─────────────────────────────┐   ┌─────────────────────────────┐  │
 *   │   │  original                   │   │  clone                      │  │
 *   │   │  {                          │   │  {                          │  │
 *   │   │    name: 'Template',        │   │    name: 'Template',        │  │
 *   │   │    settings: { ... }        │   │    settings: { ... }        │  │
 *   │   │  }                          │   │  }  ◄── NEW object          │  │
 *   │   └─────────────────────────────┘   └─────────────────────────────┘  │
 *   │                                                                      │
 *   │   Two separate objects with same data                                │
 *   │   Modifying clone doesn't affect original                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHY USE PROTOTYPE?
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHEN PROTOTYPE IS USEFUL                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. Object creation is expensive                                    │
 *   │     Clone is faster than creating from scratch                      │
 *   │                                                                     │
 *   │  2. Objects have complex initial state                              │
 *   │     Clone pre-configured object instead of setting up each time     │
 *   │                                                                     │
 *   │  3. You don't know the class                                        │
 *   │     You just have an object, want to copy it                        │
 *   │                                                                     │
 *   │  4. Need slight variations of same object                           │
 *   │     Clone and modify                                                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 1: Object with clone() method
// ═══════════════════════════════════════════════════════════════════════════

class Character {
  constructor(name, health, inventory) {
    this.name = name;
    this.health = health;
    this.inventory = inventory || [];
    this.position = { x: 0, y: 0 };
  }

  clone() {
    // Deep clone
    const clone = new Character(
      this.name,
      this.health,
      [...this.inventory]  // Copy array
    );
    clone.position = { ...this.position };  // Copy object
    return clone;
  }

  describe() {
    console.log(`${this.name}: HP=${this.health}, Items=${this.inventory.join(', ')}`);
  }
}

console.log('=== Prototype: Character Clone ===\n');

// Create template character
const warriorTemplate = new Character('Warrior', 100, ['sword', 'shield']);
warriorTemplate.position = { x: 10, y: 20 };

// Clone and customize
const player1 = warriorTemplate.clone();
player1.name = 'Player 1';
player1.inventory.push('potion');

const player2 = warriorTemplate.clone();
player2.name = 'Player 2';
player2.health = 120;

console.log('Template:');
warriorTemplate.describe();

console.log('\nClones:');
player1.describe();
player2.describe();

// Verify they're independent
console.log('\nOriginal inventory unchanged:', warriorTemplate.inventory);


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 2: Using Object.create()
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n=== Prototype: Object.create() ===\n');

const vehiclePrototype = {
  wheels: 4,
  start() {
    console.log(`  ${this.brand} starting...`);
  },
  drive() {
    console.log(`  ${this.brand} driving at ${this.speed}mph`);
  }
};

// Create objects using prototype
const car = Object.create(vehiclePrototype);
car.brand = 'Toyota';
car.speed = 60;

const truck = Object.create(vehiclePrototype);
truck.brand = 'Ford';
truck.speed = 45;
truck.wheels = 6;  // Override

car.start();
car.drive();

truck.start();
truck.drive();
console.log('  Truck wheels:', truck.wheels);


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 3: Deep Clone Utility
// ═══════════════════════════════════════════════════════════════════════════

function deepClone(obj) {
  // Handle null/undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // Handle Array
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  // Handle Object
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

console.log('\n=== Deep Clone Utility ===\n');

const original = {
  name: 'Config',
  settings: {
    theme: 'dark',
    colors: ['red', 'blue']
  }
};

const cloned = deepClone(original);
cloned.settings.theme = 'light';
cloned.settings.colors.push('green');

console.log('Original:', original.settings);
console.log('Cloned:', cloned.settings);


// ═══════════════════════════════════════════════════════════════════════════
// QUICK CLONE METHODS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n=== Quick Clone Methods ===\n');

const obj = { a: 1, b: { c: 2 } };

// Method 1: Spread (SHALLOW)
const shallow1 = { ...obj };

// Method 2: Object.assign (SHALLOW)
const shallow2 = Object.assign({}, obj);

// Method 3: JSON (DEEP, but loses functions/dates)
const deep = JSON.parse(JSON.stringify(obj));

// Method 4: structuredClone (DEEP, modern)
const structured = structuredClone(obj);

// Test
obj.b.c = 999;

console.log('Original modified to b.c = 999');
console.log('Shallow spread:', shallow1.b.c);  // 999 (affected!)
console.log('JSON clone:', deep.b.c);          // 2 (independent)
console.log('structuredClone:', structured.b.c);  // 2 (independent)


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Prototype pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Prototype pattern creates new objects by cloning an existing object.
 * Instead of using constructors and setting up state from scratch, you
 * copy a pre-configured prototype and modify as needed.
 *
 * It's useful when object creation is expensive or when objects have
 * complex initial state. For example, in a game, I might have a
 * 'warrior template' with default health, inventory, and abilities.
 * Creating each player by cloning this template is faster than
 * configuring from scratch each time.
 *
 * In JavaScript, we can implement this several ways. Objects can have
 * a clone() method that creates a copy. We can use Object.create()
 * to create new objects with a prototype. For deep cloning, there's
 * JSON.parse(JSON.stringify()) which works but loses functions and
 * special types. Modern JavaScript has structuredClone() for proper
 * deep cloning.
 *
 * The key is understanding shallow vs deep cloning. Spread operator
 * and Object.assign do shallow copies - nested objects are still
 * shared. For truly independent copies, you need deep cloning.
 *
 * JavaScript's prototype chain is actually based on this pattern -
 * objects inherit from other objects, not classes."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Create by cloning, not constructing
 * ✓ Useful when creation is expensive
 * ✓ clone() method or Object.create()
 * ✓ Shallow vs deep cloning
 * ✓ structuredClone() for deep copy
 *
 */


// RUN: node docs/25-design-patterns/10-prototype-pattern.js
