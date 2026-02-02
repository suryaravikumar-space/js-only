/**
 * BUNDLERS & MODULES: 06 - Babel Transforms & What Babel Outputs
 *
 * ONE CONCEPT: See exactly what Babel does to modern JS syntax
 */


// =============================================================================
// ARROW FUNCTIONS
// =============================================================================

console.log('=== Transform: Arrow Functions ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INPUT (ES6+):                      OUTPUT (ES5):                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  const add = (a, b) => a + b;       var add = function(a, b) {     │
 *   │                                       return a + b;                 │
 *   │                                     };                               │
 *   │                                                                      │
 *   │  // Arrow captures `this`:          // Babel saves `this`:          │
 *   │  class Timer {                       function Timer() {              │
 *   │    start() {                           var _this = this;            │
 *   │      setTimeout(() => {                this.start = function() {    │
 *   │        this.done = true;                 setTimeout(function() {    │
 *   │      }, 100);                              _this.done = true;       │
 *   │    }                                     }, 100);                   │
 *   │  }                                    };                             │
 *   │                                     }                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Modern
const add = (a, b) => a + b;

// What Babel outputs (conceptually)
var addES5 = function(a, b) {
  return a + b;
};

console.log('Arrow:', add(1, 2));
console.log('ES5:', addES5(1, 2));


// =============================================================================
// CLASSES
// =============================================================================

console.log('\n=== Transform: Classes ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INPUT:                              OUTPUT:                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  class Animal {                      function Animal(name) {        │
 *   │    constructor(name) {                 this.name = name;            │
 *   │      this.name = name;              }                                │
 *   │    }                                 Animal.prototype.speak =       │
 *   │    speak() {                           function() {                 │
 *   │      return this.name;                   return this.name;          │
 *   │    }                                   };                            │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  class Dog extends Animal {          function Dog(name) {           │
 *   │    constructor(name) {                 Animal.call(this, name);     │
 *   │      super(name);                   }                                │
 *   │    }                                 Dog.prototype =                 │
 *   │    bark() {                            Object.create(               │
 *   │      return 'Woof!';                     Animal.prototype);         │
 *   │    }                                 Dog.prototype.constructor=Dog; │
 *   │  }                                  Dog.prototype.bark =            │
 *   │                                       function() { return 'Woof!'; │
 *   │                                     };                               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name; }
}

class Dog extends Animal {
  bark() { return 'Woof!'; }
}

const d = new Dog('Rex');
console.log('Class:', d.speak(), d.bark());


// =============================================================================
// DESTRUCTURING
// =============================================================================

console.log('\n=== Transform: Destructuring ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INPUT:                                OUTPUT:                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  const { a, b } = obj;               var a = obj.a;                │
 *   │                                       var b = obj.b;                │
 *   │                                                                      │
 *   │  const [x, ...rest] = arr;           var x = arr[0];               │
 *   │                                       var rest = arr.slice(1);      │
 *   │                                                                      │
 *   │  const { a: x = 5 } = obj;           var _obj$a = obj.a;           │
 *   │                                       var x = _obj$a === void 0    │
 *   │                                         ? 5 : _obj$a;              │
 *   │                                                                      │
 *   │  function f({ name }) {}              function f(_ref) {            │
 *   │                                         var name = _ref.name;      │
 *   │                                       }                             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const obj = { a: 1, b: 2, c: 3 };
const { a, b } = obj;
const arr = [10, 20, 30];
const [x, ...rest] = arr;

console.log('Destructured:', a, b);
console.log('Array:', x, rest);


// =============================================================================
// TEMPLATE LITERALS
// =============================================================================

console.log('\n=== Transform: Template Literals ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INPUT:                              OUTPUT:                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  `Hello ${name}!`                    "Hello " + name + "!"          │
 *   │                                                                      │
 *   │  `Line 1                             "Line 1\nLine 2"               │
 *   │  Line 2`                                                             │
 *   │                                                                      │
 *   │  tag`hello ${x}`                     tag(["hello ", ""], x);        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const name = 'World';
console.log(`Hello ${name}!`);
// Babel output: "Hello " + name + "!"


// =============================================================================
// OPTIONAL CHAINING & NULLISH COALESCING
// =============================================================================

console.log('\n=== Transform: ?. and ?? ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INPUT:                              OUTPUT:                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  obj?.foo?.bar                       var _obj, _obj$foo;            │
 *   │                                      (_obj = obj) === null ||       │
 *   │                                      _obj === void 0 ? void 0 :    │
 *   │                                      (_obj$foo = _obj.foo) ===     │
 *   │                                      null || _obj$foo === void 0   │
 *   │                                      ? void 0 : _obj$foo.bar;     │
 *   │                                                                      │
 *   │  x ?? 'default'                      x !== null && x !== void 0    │
 *   │                                      ? x : 'default';              │
 *   │                                                                      │
 *   │  Note: ?? checks null/undefined only                                │
 *   │        || checks all falsy values                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const user = { profile: { name: 'Alice' } };
console.log('Optional chain:', user?.profile?.name);
console.log('Missing chain:', user?.settings?.theme);
console.log('Nullish coal:', null ?? 'default');
console.log('Nullish 0:', 0 ?? 'default');     // 0 (not falsy check!)
console.log('OR 0:', 0 || 'default');           // 'default' (falsy check)


// =============================================================================
// ASYNC/AWAIT
// =============================================================================

console.log('\n=== Transform: async/await ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ASYNC/AWAIT → REGENERATOR / STATE MACHINE                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  INPUT:                                                              │
 *   │  async function fetchUser(id) {                                      │
 *   │    const res = await fetch(`/api/${id}`);                            │
 *   │    const data = await res.json();                                    │
 *   │    return data;                                                      │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  OUTPUT (simplified):                                                │
 *   │  function fetchUser(id) {                                            │
 *   │    return regeneratorRuntime.async(function(_context) {              │
 *   │      while (1) switch (_context.prev = _context.next) {             │
 *   │        case 0:                                                       │
 *   │          _context.next = 2;                                          │
 *   │          return fetch("/api/" + id);                                │
 *   │        case 2:                                                       │
 *   │          res = _context.sent;                                       │
 *   │          _context.next = 5;                                          │
 *   │          return res.json();                                         │
 *   │        case 5:                                                       │
 *   │          data = _context.sent;                                      │
 *   │          return data;                                               │
 *   │      }                                                               │
 *   │    });                                                               │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  Babel transforms async/await into a state machine using            │
 *   │  regenerator-runtime. Modern targets skip this entirely.            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('async/await → state machine (regenerator)');
console.log('If targeting modern browsers, Babel leaves async/await as-is');


// =============================================================================
// JSX (preset-react)
// =============================================================================

console.log('\n=== Transform: JSX ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  JSX → JAVASCRIPT                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  CLASSIC (React 16):                                                 │
 *   │  <Button color="red">                React.createElement(           │
 *   │    Click me                            Button,                      │
 *   │  </Button>                             { color: "red" },            │
 *   │                                        "Click me"                   │
 *   │                                      );                              │
 *   │                                                                      │
 *   │  AUTOMATIC (React 17+):                                              │
 *   │  <Button color="red">                import { jsx } from            │
 *   │    Click me                            'react/jsx-runtime';         │
 *   │  </Button>                           jsx(Button,                    │
 *   │                                        { color: "red",             │
 *   │                                          children: "Click me" }    │
 *   │                                      );                              │
 *   │                                                                      │
 *   │  Automatic runtime: no need to import React in every file!          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('JSX is syntactic sugar for function calls');
console.log('Classic: React.createElement(type, props, children)');
console.log('Automatic (17+): jsx(type, props) — no React import needed');


// =============================================================================
// SPREAD / REST
// =============================================================================

console.log('\n=== Transform: Spread/Rest ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INPUT:                              OUTPUT:                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  { ...obj, x: 1 }                   Object.assign({}, obj, {x:1}) │
 *   │                                                                      │
 *   │  [...arr, 4]                         [].concat(arr, [4])            │
 *   │                                                                      │
 *   │  function f(...args) {}              function f() {                 │
 *   │                                        var args = Array.prototype  │
 *   │                                          .slice.call(arguments);   │
 *   │                                      }                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const original = { a: 1, b: 2 };
const spread = { ...original, c: 3 };
console.log('Spread:', spread);
// Babel: Object.assign({}, original, { c: 3 })


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Babel transforms modern JavaScript syntax into equivalent older code.
 * For example:
 *
 * - Arrow functions become regular functions with a saved `this` reference
 * - Classes become constructor functions with prototype methods
 * - Optional chaining becomes nested null checks with temp variables
 * - async/await becomes a state machine using regenerator-runtime
 * - JSX becomes React.createElement calls (or jsx() with automatic runtime)
 * - Object spread becomes Object.assign
 *
 * The key distinction is syntax transforms vs polyfills. Babel can rewrite
 * optional chaining syntax, but Array.includes needs a polyfill — actual
 * code that implements the missing API. core-js provides these polyfills,
 * and preset-env with useBuiltIns: 'usage' auto-imports only what's needed.
 *
 * Understanding what Babel outputs helps debug issues. For example, knowing
 * that arrow functions capture `this` via a `_this` variable explains
 * certain behavior in transpiled class methods."
 */


// RUN: node docs/29-bundlers-modules/06-babel-transforms.js
