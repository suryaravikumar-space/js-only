/**
 * CHALLENGE 30: Ultimate Combined Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE FINAL TEST                                                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This challenge combines EVERYTHING you've learned:                         ║
 * ║                                                                            ║
 * ║   • Nested objects and `this`                                              ║
 * ║   • Method extraction (losing `this`)                                      ║
 * ║   • bind() permanence                                                      ║
 * ║   • IIFE and closures                                                      ║
 * ║   • Prototype chain                                                        ║
 * ║   • Method chaining                                                        ║
 * ║                                                                            ║
 * ║ If you can predict all outputs correctly, you've mastered execution        ║
 * ║ context and `this` binding!                                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var app = {
  name: 'MyApp',
  config: {
    name: 'Config',
    getAppName: function() {
      return this.name;
    }
  },
  start: function() {
    return 'Starting ' + this.name;
  }
};

console.log('A:', app.config.getAppName());
console.log('B:', app.config.getAppName.call(app));

var startApp = app.start;
console.log('C:', startApp());

var boundStart = app.start.bind(app);
console.log('D:', boundStart.call({ name: 'Other' }));

var counter = (function() {
  var count = 0;
  return {
    add: function(n) { count += n; return count; },
    get: function() { return count; }
  };
})();

console.log('E:', counter.add(5));
console.log('F:', counter.add(3));

function Calculator(initial) {
  this.value = initial;
}

Calculator.prototype.add = function(n) {
  this.value += n;
  return this;
};

Calculator.prototype.getValue = function() {
  return this.value;
};

var calc = new Calculator(10);
console.log('G:', calc.add(5).add(3).getValue());

var addMethod = calc.add;
try {
  addMethod(10);
  console.log('H:', 'No error');
} catch (e) {
  console.log('H:', 'Error - this.value is undefined');
}

/**
 * OUTPUT:
 *   A: Config
 *   B: MyApp
 *   C: Starting undefined
 *   D: Starting MyApp
 *   E: 5
 *   F: 8
 *   G: 18
 *   H: No error (but value is NaN!)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: app.config.getAppName()                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║   • What's immediately before the dot? → config                            ║
 * ║   • this = config (NOT app!)                                               ║
 * ║   • this.name = 'Config'                                                   ║
 * ║   • Result: 'Config'                                                       ║
 * ║                                                                            ║
 * ║   RULE: Nested objects - this = object immediately before the dot          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: app.config.getAppName.call(app)                                         ║
 * ║ ──────────────────────────────────                                         ║
 * ║   • call() explicitly sets this = app                                      ║
 * ║   • this.name = 'MyApp'                                                    ║
 * ║   • Result: 'MyApp'                                                        ║
 * ║                                                                            ║
 * ║   RULE: call/apply override the default this binding                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: startApp()                                                              ║
 * ║ ─────────────                                                              ║
 * ║   • startApp = app.start (just a reference)                                ║
 * ║   • startApp() is STANDALONE call                                          ║
 * ║   • this = global object (non-strict mode)                                 ║
 * ║   • global.name = undefined                                                ║
 * ║   • Result: 'Starting undefined'                                           ║
 * ║                                                                            ║
 * ║   RULE: Extracted methods lose their this binding                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: boundStart.call({ name: 'Other' })                                      ║
 * ║ ─────────────────────────────────────                                      ║
 * ║   • boundStart = app.start.bind(app)                                       ║
 * ║   • bind() is PERMANENT - this is locked to app                            ║
 * ║   • call({ name: 'Other' }) is IGNORED!                                    ║
 * ║   • this = app (still!)                                                    ║
 * ║   • Result: 'Starting MyApp'                                               ║
 * ║                                                                            ║
 * ║   RULE: bind() cannot be overridden by call/apply/another bind             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: counter.add(5)                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   • counter is returned from IIFE                                          ║
 * ║   • IIFE has private variable: count = 0                                   ║
 * ║   • add(5) → count += 5 → count = 5                                        ║
 * ║   • Result: 5                                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: counter.add(3)                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   • count is still 5 (closure preserves it!)                               ║
 * ║   • add(3) → count += 3 → count = 8                                        ║
 * ║   • Result: 8                                                              ║
 * ║                                                                            ║
 * ║   RULE: IIFE creates private state via closure                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ G: calc.add(5).add(3).getValue()                                           ║
 * ║ ────────────────────────────────                                           ║
 * ║   • new Calculator(10) → this.value = 10                                   ║
 * ║   • calc.add(5)                                                            ║
 * ║     - this = calc, this.value = 10 + 5 = 15                                ║
 * ║     - returns this (calc), enabling chaining                               ║
 * ║   • .add(3)                                                                ║
 * ║     - this = calc, this.value = 15 + 3 = 18                                ║
 * ║     - returns this (calc)                                                  ║
 * ║   • .getValue()                                                            ║
 * ║     - this = calc, returns 18                                              ║
 * ║   • Result: 18                                                             ║
 * ║                                                                            ║
 * ║   RULE: Method chaining works by returning this                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ H: addMethod(10)                                                           ║
 * ║ ────────────────                                                           ║
 * ║   • addMethod = calc.add (extracted method)                                ║
 * ║   • addMethod(10) is STANDALONE call                                       ║
 * ║   • this = global object                                                   ║
 * ║   • this.value = undefined                                                 ║
 * ║   • undefined + 10 = NaN (no error thrown!)                                ║
 * ║   • global.value = NaN                                                     ║
 * ║   • returns this (global), not undefined                                   ║
 * ║   • Result: 'No error' (but global.value is now NaN)                       ║
 * ║                                                                            ║
 * ║   NOTE: In strict mode, this would throw because this.value                ║
 * ║   would be undefined.undefined = undefined                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SUMMARY: THE 7 RULES OF `this`                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. DEFAULT BINDING (standalone call)                                        │
 * │    foo();                                                                   │
 * │    → Non-strict: this = global                                              │
 * │    → Strict: this = undefined                                               │
 * │                                                                             │
 * │ 2. IMPLICIT BINDING (method call)                                           │
 * │    obj.foo();                                                               │
 * │    → this = obj (object before the dot)                                     │
 * │                                                                             │
 * │ 3. EXPLICIT BINDING (call/apply)                                            │
 * │    foo.call(obj) / foo.apply(obj)                                           │
 * │    → this = obj (first argument)                                            │
 * │                                                                             │
 * │ 4. HARD BINDING (bind)                                                      │
 * │    var bound = foo.bind(obj);                                               │
 * │    → this = obj (PERMANENT, can't override except with new)                 │
 * │                                                                             │
 * │ 5. NEW BINDING (constructor)                                                │
 * │    new Foo();                                                               │
 * │    → this = newly created object                                            │
 * │                                                                             │
 * │ 6. ARROW FUNCTIONS (lexical)                                                │
 * │    const arrow = () => this;                                                │
 * │    → this = inherited from enclosing scope (FIXED at definition)            │
 * │                                                                             │
 * │ 7. NESTED OBJECTS                                                           │
 * │    outer.inner.method();                                                    │
 * │    → this = inner (immediately before the dot)                              │
 * │                                                                             │
 * │                                                                             │
 * │ PRECEDENCE (highest to lowest):                                             │
 * │    new > bind > call/apply > method call > standalone                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE ALGORITHM TO DETERMINE `this`                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When you see a function call, ask these questions IN ORDER:                 │
 * │                                                                             │
 * │ 1. Is it an arrow function?                                                 │
 * │    → YES: this = enclosing scope's this (can't change)                      │
 * │    → NO: Continue...                                                        │
 * │                                                                             │
 * │ 2. Is it called with `new`?                                                 │
 * │    → YES: this = new object being created                                   │
 * │    → NO: Continue...                                                        │
 * │                                                                             │
 * │ 3. Was it created with bind()?                                              │
 * │    → YES: this = bound object (permanent)                                   │
 * │    → NO: Continue...                                                        │
 * │                                                                             │
 * │ 4. Is it called with call() or apply()?                                     │
 * │    → YES: this = first argument to call/apply                               │
 * │    → NO: Continue...                                                        │
 * │                                                                             │
 * │ 5. Is it a method call (obj.method())?                                      │
 * │    → YES: this = object before the dot                                      │
 * │    → NO: Continue...                                                        │
 * │                                                                             │
 * │ 6. It's a standalone call                                                   │
 * │    → Non-strict: this = global object                                       │
 * │    → Strict: this = undefined                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER: THE ULTIMATE SUMMARY                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "`this` in JavaScript is determined by HOW a function is called, not        │
 * │  where it's defined. The key rules are:                                     │
 * │                                                                             │
 * │  1. Method call (obj.fn()): this = obj                                      │
 * │  2. Standalone call (fn()): this = global (non-strict) or undefined (strict)│
 * │  3. call/apply: this = first argument                                       │
 * │  4. bind: this = bound value (permanent, can't override)                    │
 * │  5. new: this = newly created object                                        │
 * │  6. Arrow: this = lexically inherited (can't change)                        │
 * │                                                                             │
 * │  Common gotchas:                                                            │
 * │  - Extracting a method loses this: var fn = obj.method; fn(); // this=global│
 * │  - Passing method as callback loses this                                    │
 * │  - Nested objects: outer.inner.fn() → this = inner, not outer               │
 * │  - bind is permanent: boundFn.call(other) still uses original bound value   │
 * │                                                                             │
 * │  Solutions for lost this:                                                   │
 * │  - bind(): obj.method.bind(obj)                                             │
 * │  - Arrow wrapper: () => obj.method()                                        │
 * │  - var self = this pattern                                                  │
 * │  - Arrow function class fields                                              │
 * │                                                                             │
 * │  Understanding this is essential because it affects every aspect of         │
 * │  JavaScript OOP, event handling, callbacks, and modern frameworks."         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CONGRATULATIONS!                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ If you've made it through all 30 challenges and understand each output,    ║
 * ║ you have mastered one of the most confusing aspects of JavaScript!         ║
 * ║                                                                            ║
 * ║ You now understand:                                                        ║
 * ║   ✓ Execution context and how `this` is determined                         ║
 * ║   ✓ call(), apply(), and bind() differences                                ║
 * ║   ✓ Arrow functions vs regular functions                                   ║
 * ║   ✓ Method extraction and callback pitfalls                                ║
 * ║   ✓ IIFE and the module pattern                                            ║
 * ║   ✓ Closures and private state                                             ║
 * ║   ✓ Strict mode differences                                                ║
 * ║   ✓ Prototype-based method chaining                                        ║
 * ║                                                                            ║
 * ║ You're ready for those high-paying JavaScript interviews!                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/01-execution-context/30-ultimate-combined-challenge.js
 */
