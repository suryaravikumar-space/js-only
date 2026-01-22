/**
 * CONCEPT 26: `this` in Nested Objects
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE KEY RULE                                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ `this` is ALWAYS the object IMMEDIATELY before the dot.                    ║
 * ║                                                                            ║
 * ║ For nested objects:                                                        ║
 * ║   outer.inner.method()  →  this = inner (NOT outer!)                       ║
 * ║                                                                            ║
 * ║ Only the LAST object before the method call matters.                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ============================================================================
// EXAMPLE 1: Basic Nested Object
// ============================================================================

console.log('=== Example 1: Basic Nested Object ===');

var company = {
  name: 'TechCorp',

  department: {
    name: 'Engineering',

    getName: function() {
      return this.name;
    }
  }
};

console.log('company.department.getName():', company.department.getName());
// Output: Engineering (NOT TechCorp!)

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BREAKDOWN                                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ company.department.getName()                                                │
 * │         └────────┘                                                          │
 * │              │                                                              │
 * │              └── Object IMMEDIATELY before .getName()                       │
 * │                                                                             │
 * │ this = company.department = { name: 'Engineering', getName: ... }           │
 * │                                                                             │
 * │ this.name = 'Engineering'                                                   │
 * │                                                                             │
 * │ company.name is IGNORED - only the immediate object matters!                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 2: Accessing Parent from Nested Object
// ============================================================================

console.log('\n=== Example 2: Accessing Parent ===');

var outer = {
  name: 'Outer',
  value: 100,

  inner: {
    name: 'Inner',
    value: 50,

    getOwnName: function() {
      return this.name;  // 'Inner'
    },

    // Can't access outer.name with `this`!
    // getOuterName: function() {
    //   return this.???  // No way to get to outer!
    // }
  }
};

console.log('inner.getOwnName():', outer.inner.getOwnName());  // Inner

// To access parent, you need a reference
outer.inner.parent = outer;  // Store reference
outer.inner.getParentName = function() {
  return this.parent.name;
};

console.log('inner.getParentName():', outer.inner.getParentName());  // Outer


// ============================================================================
// EXAMPLE 3: Multiple Levels of Nesting
// ============================================================================

console.log('\n=== Example 3: Deep Nesting ===');

var app = {
  name: 'MyApp',

  config: {
    name: 'Config',

    database: {
      name: 'Database',

      connection: {
        name: 'Connection',

        getName: function() {
          return this.name;
        }
      }
    }
  }
};

// Each level only sees its immediate object
console.log('connection.getName():', app.config.database.connection.getName());
// Output: Connection

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CHAIN BREAKDOWN                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ app.config.database.connection.getName()                                    │
 * │                     └────────┘                                              │
 * │                          │                                                  │
 * │                          └── this = connection                              │
 * │                                                                             │
 * │ It doesn't matter how deep the nesting is.                                  │
 * │ Only the object IMMEDIATELY before the method matters.                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 4: Method Reference Loses Context
// ============================================================================

console.log('\n=== Example 4: Extracting Method ===');

var team = {
  name: 'Alpha Team',

  leader: {
    name: 'John',

    introduce: function() {
      console.log('I am ' + this.name);
    }
  }
};

// Direct call - works
team.leader.introduce();  // I am John

// Extract method - loses context
var introduce = team.leader.introduce;
introduce();  // I am undefined (this = global)

// The FIX: bind it
var boundIntroduce = team.leader.introduce.bind(team.leader);
boundIntroduce();  // I am John


// ============================================================================
// EXAMPLE 5: Tricky Interview Question
// ============================================================================

console.log('\n=== Example 5: Interview Question ===');

var obj = {
  name: 'obj',

  nested: {
    name: 'nested',

    arrowMethod: () => {
      console.log('Arrow:', this.name);
    },

    regularMethod: function() {
      console.log('Regular:', this.name);
    }
  }
};

obj.nested.regularMethod();  // Regular: nested
obj.nested.arrowMethod();    // Arrow: undefined

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TRICKY PART: Arrow in Nested Object                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ regularMethod:                                                              │
 * │   - this = nested (object before dot)                                       │
 * │   - this.name = 'nested'                                                    │
 * │                                                                             │
 * │ arrowMethod:                                                                │
 * │   - Arrow functions inherit this from LEXICAL SCOPE                         │
 * │   - Object literal { } is NOT a scope!                                      │
 * │   - The arrow was defined in the global scope                               │
 * │   - this = global object                                                    │
 * │   - this.name = undefined                                                   │
 * │                                                                             │
 * │ REMEMBER: Object literals don't create scope for arrow functions!           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 6: Arrow Function Inside Method (Correct Use)
// ============================================================================

console.log('\n=== Example 6: Arrow Inside Method ===');

var player = {
  name: 'Player',

  stats: {
    name: 'Stats',
    health: 100,

    showHealth: function() {
      // Regular method - this = stats
      console.log('Stats name:', this.name);  // Stats

      // Arrow inside method - inherits this from showHealth
      var logHealth = () => {
        console.log('Arrow this.name:', this.name);  // Stats (inherited!)
        console.log('Health:', this.health);          // 100
      };

      logHealth();
    }
  }
};

player.stats.showHealth();


// ============================================================================
// EXAMPLE 7: Nested Object with Methods at Different Levels
// ============================================================================

console.log('\n=== Example 7: Methods at Different Levels ===');

var game = {
  title: 'Super Game',

  getTitle: function() {
    return this.title;
  },

  player: {
    name: 'Hero',
    score: 0,

    getName: function() {
      return this.name;
    },

    inventory: {
      name: 'Backpack',
      items: ['sword', 'potion'],

      getName: function() {
        return this.name;
      },

      getItems: function() {
        return this.items;
      }
    }
  }
};

console.log('game.getTitle():', game.getTitle());
// Super Game (this = game)

console.log('game.player.getName():', game.player.getName());
// Hero (this = player)

console.log('game.player.inventory.getName():', game.player.inventory.getName());
// Backpack (this = inventory)

console.log('game.player.inventory.getItems():', game.player.inventory.getItems());
// ['sword', 'potion'] (this = inventory)


// ============================================================================
// EXAMPLE 8: Common Mistake - Callback in Nested Object
// ============================================================================

console.log('\n=== Example 8: Callback Mistake ===');

var store = {
  name: 'Main Store',

  cart: {
    name: 'Shopping Cart',
    items: ['apple', 'banana', 'orange'],

    // MISTAKE: Using regular function in forEach
    showItemsBroken: function() {
      console.log('Cart:', this.name);  // Shopping Cart

      this.items.forEach(function(item) {
        // this = global here! Not cart!
        console.log(this.name + ':', item);  // undefined: apple
      });
    },

    // FIX 1: Arrow function
    showItemsArrow: function() {
      console.log('Cart:', this.name);

      this.items.forEach((item) => {
        console.log(this.name + ':', item);  // Shopping Cart: apple
      });
    },

    // FIX 2: thisArg parameter
    showItemsThisArg: function() {
      console.log('Cart:', this.name);

      this.items.forEach(function(item) {
        console.log(this.name + ':', item);
      }, this);  // <-- Pass this as second argument
    }
  }
};

console.log('\nBroken:');
store.cart.showItemsBroken();

console.log('\nFixed with arrow:');
store.cart.showItemsArrow();

console.log('\nFixed with thisArg:');
store.cart.showItemsThisArg();


// ============================================================================
// EXAMPLE 9: Practical Pattern - Manager with Sub-managers
// ============================================================================

console.log('\n=== Example 9: Real-World Pattern ===');

var userManager = {
  prefix: '[UserManager]',

  log: function(msg) {
    console.log(this.prefix, msg);
  },

  auth: {
    prefix: '[Auth]',

    log: function(msg) {
      console.log(this.prefix, msg);
    },

    login: function(user) {
      this.log('Logging in: ' + user);  // [Auth] Logging in: john
    },

    // Can't call parent's log directly!
    // To do so, need reference or different approach
  },

  profile: {
    prefix: '[Profile]',

    log: function(msg) {
      console.log(this.prefix, msg);
    },

    update: function(field) {
      this.log('Updating: ' + field);  // [Profile] Updating: email
    }
  }
};

userManager.log('System ready');           // [UserManager] System ready
userManager.auth.login('john');            // [Auth] Logging in: john
userManager.profile.update('email');       // [Profile] Updating: email


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ VISUAL: this in Nested Objects                                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   var a = {                                                                ║
 * ║     name: 'A',                                                             ║
 * ║     b: {                                                                   ║
 * ║       name: 'B',                                                           ║
 * ║       c: {                                                                 ║
 * ║         name: 'C',                                                         ║
 * ║         getName: function() { return this.name; }                          ║
 * ║       }                                                                    ║
 * ║     }                                                                      ║
 * ║   };                                                                       ║
 * ║                                                                            ║
 * ║   a.b.c.getName()                                                          ║
 * ║   │ │ │                                                                    ║
 * ║   │ │ └── this = c (immediately before .getName)                           ║
 * ║   │ │                                                                      ║
 * ║   │ └──── b is in the chain but doesn't affect this                        ║
 * ║   │                                                                        ║
 * ║   └────── a is in the chain but doesn't affect this                        ║
 * ║                                                                            ║
 * ║   Result: 'C'                                                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SUMMARY: Nested Objects and this                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ RULE:                                                                      ║
 * ║   this = object IMMEDIATELY before the dot                                 ║
 * ║   outer.inner.method() → this = inner                                      ║
 * ║                                                                            ║
 * ║ KEY POINTS:                                                                ║
 * ║   1. Nesting depth doesn't matter - only immediate object counts           ║
 * ║   2. Nested objects can't access parent via this                           ║
 * ║   3. Store parent reference if needed: child.parent = parent               ║
 * ║   4. Arrow functions in object literals inherit from global scope          ║
 * ║   5. Arrow functions INSIDE methods inherit from the method's this         ║
 * ║                                                                            ║
 * ║ COMMON MISTAKES:                                                           ║
 * ║   - Expecting this to be the root object                                   ║
 * ║   - Using arrow functions as methods in nested objects                     ║
 * ║   - Forgetting that callbacks lose context                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "In nested objects, `this` is always the object immediately before the     │
 * │  dot when the method is called. For outer.inner.method(), `this` is        │
 * │  `inner`, not `outer`.                                                      │
 * │                                                                             │
 * │  This means nested objects can't directly access their parent via `this`.  │
 * │  If you need parent access, you have to explicitly store a reference.      │
 * │                                                                             │
 * │  A common gotcha is using arrow functions as methods in nested objects.    │
 * │  Object literals don't create scope, so the arrow inherits `this` from     │
 * │  the global scope, not from the object. Regular functions should be used   │
 * │  for methods, while arrow functions are better for callbacks inside        │
 * │  those methods."                                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node concepts/01-execution-context/26-this-nested-objects.js
 */
