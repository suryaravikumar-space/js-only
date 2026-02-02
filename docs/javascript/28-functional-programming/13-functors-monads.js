/**
 * FUNCTIONAL PROGRAMMING: 13 - Functors & Monads
 *
 * ONE CONCEPT: Containers that wrap values and provide safe transformation chains
 */


// =============================================================================
// WHAT IS A FUNCTOR?
// =============================================================================

console.log('=== Functors ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  FUNCTOR = Container with .map()                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  A functor wraps a value and lets you transform it:                  │
 *   │                                                                      │
 *   │  ┌─────────────────┐     map(fn)     ┌─────────────────┐             │
 *   │  │  Container(5)   │ ─────────────▶ │  Container(10)  │             │
 *   │  └─────────────────┘                 └─────────────────┘             │
 *   │                                                                      │
 *   │  Rules:                                                              │
 *   │  1. container.map(x => x)  ===  container  (identity)               │
 *   │  2. container.map(f).map(g)  ===  container.map(x => g(f(x)))       │
 *   │     (composition)                                                    │
 *   │                                                                      │
 *   │  Arrays are functors!  [1,2,3].map(fn)                              │
 *   │  Promises are functors-ish!  promise.then(fn)                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Simple Functor: Box
class Box {
  constructor(value) {
    this._value = value;
  }

  static of(value) {
    return new Box(value);
  }

  map(fn) {
    return Box.of(fn(this._value));
  }

  toString() {
    return `Box(${JSON.stringify(this._value)})`;
  }
}

const result = Box.of(5)
  .map(x => x + 1)
  .map(x => x * 2)
  .map(x => `Result: ${x}`);

console.log('Box:', result.toString());  // Box("Result: 12")

// Array is a functor
console.log('Array functor:', [1, 2, 3].map(x => x * 2));


// =============================================================================
// MAYBE FUNCTOR (Null Safety)
// =============================================================================

console.log('\n=== Maybe Functor ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  MAYBE: Safe null/undefined handling                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  WITH VALUE:                  WITHOUT VALUE:                        │
 *   │  ┌──────────────┐            ┌──────────────┐                       │
 *   │  │  Maybe("hi") │            │  Maybe(null) │                       │
 *   │  └──────┬───────┘            └──────┬───────┘                       │
 *   │         │ map(toUpper)              │ map(toUpper)                  │
 *   │         ▼                           ▼                               │
 *   │  ┌──────────────┐            ┌──────────────┐                       │
 *   │  │  Maybe("HI") │            │  Maybe(null) │  ← Skipped!           │
 *   │  └──────────────┘            └──────────────┘    No error!          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

class Maybe {
  constructor(value) {
    this._value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  isNothing() {
    return this._value === null || this._value === undefined;
  }

  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value));
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this._value;
  }

  toString() {
    return this.isNothing() ? 'Maybe(null)' : `Maybe(${JSON.stringify(this._value)})`;
  }
}

// Safe property access
const user = {
  name: 'Alice',
  address: {
    street: '123 Main St',
    city: 'NYC'
  }
};

const userWithout = {
  name: 'Bob',
  address: null
};

// WITHOUT Maybe - crashes!
// console.log(userWithout.address.city);  // TypeError!

// WITH Maybe - safe!
const getCity = (user) =>
  Maybe.of(user)
    .map(u => u.address)
    .map(a => a.city)
    .getOrElse('Unknown city');

console.log('Alice city:', getCity(user));
console.log('Bob city:', getCity(userWithout));  // No crash!


// Real-world: Safe config access
const config = {
  database: {
    host: 'localhost',
    port: 5432
  }
};

const getConfigValue = (...keys) =>
  keys.reduce(
    (maybe, key) => maybe.map(obj => obj[key]),
    Maybe.of(config)
  ).getOrElse('default');

console.log('\nDB host:', getConfigValue('database', 'host'));
console.log('Cache host:', getConfigValue('cache', 'host'));  // 'default'


// =============================================================================
// WHAT IS A MONAD?
// =============================================================================

console.log('\n=== Monads ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MONAD = Functor + flatMap (chain)                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Problem with just .map():                                           │
 *   │  Maybe.of(5).map(x => Maybe.of(x + 1))  →  Maybe(Maybe(6))          │
 *   │  ← Nested containers!                                               │
 *   │                                                                      │
 *   │  Solution: .chain() / .flatMap()                                     │
 *   │  Maybe.of(5).chain(x => Maybe.of(x + 1))  →  Maybe(6)               │
 *   │  ← Flattened!                                                        │
 *   │                                                                      │
 *   │                                                                      │
 *   │  Monad Laws:                                                         │
 *   │  1. Left identity:   M.of(a).chain(f)  ===  f(a)                     │
 *   │  2. Right identity:  m.chain(M.of)     ===  m                        │
 *   │  3. Associativity:   m.chain(f).chain(g)  ===                        │
 *   │                      m.chain(x => f(x).chain(g))                     │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Add chain to Maybe
Maybe.prototype.chain = function(fn) {
  return this.isNothing() ? this : fn(this._value);
};

// Without chain (nested!)
const nested = Maybe.of(5).map(x => Maybe.of(x + 1));
console.log('Nested:', nested.toString());  // Maybe(Maybe(6))

// With chain (flat!)
const flat = Maybe.of(5).chain(x => Maybe.of(x + 1));
console.log('Chained:', flat.toString());  // Maybe(6)


// =============================================================================
// EITHER MONAD (Error Handling)
// =============================================================================

console.log('\n=== Either Monad ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  EITHER: Success or Failure                                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Right(value) = Success (operations continue)                       │
 *   │  Left(error)  = Failure (operations skip)                           │
 *   │                                                                     │
 *   │  Right(5).map(x => x + 1)  →  Right(6)                              │
 *   │  Left("err").map(x => x + 1)  →  Left("err")  ← Skipped!           │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

class Right {
  constructor(value) { this._value = value; }
  map(fn) { return new Right(fn(this._value)); }
  chain(fn) { return fn(this._value); }
  fold(leftFn, rightFn) { return rightFn(this._value); }
  toString() { return `Right(${JSON.stringify(this._value)})`; }
}

class Left {
  constructor(value) { this._value = value; }
  map(fn) { return this; }  // Skip!
  chain(fn) { return this; }  // Skip!
  fold(leftFn, rightFn) { return leftFn(this._value); }
  toString() { return `Left(${JSON.stringify(this._value)})`; }
}

// Validation pipeline
function parseJSON(str) {
  try {
    return new Right(JSON.parse(str));
  } catch (e) {
    return new Left(`Invalid JSON: ${e.message}`);
  }
}

function validateAge(data) {
  if (!data.age || data.age < 0) {
    return new Left('Invalid age');
  }
  return new Right(data);
}

function formatUser(data) {
  return new Right(`User: ${data.name}, Age: ${data.age}`);
}

// Success path
const validResult = parseJSON('{"name": "Alice", "age": 25}')
  .chain(validateAge)
  .chain(formatUser)
  .fold(
    error => `Error: ${error}`,
    result => result
  );

console.log('Valid:', validResult);

// Failure path (short-circuits!)
const invalidResult = parseJSON('not json')
  .chain(validateAge)
  .chain(formatUser)
  .fold(
    error => `Error: ${error}`,
    result => result
  );

console.log('Invalid:', invalidResult);


// =============================================================================
// PROMISES ARE MONADS (Roughly)
// =============================================================================

console.log('\n=== Promises as Monads ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PROMISE ≈ MONAD                                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Promise.resolve(5)            ≈  Maybe.of(5)                       │
 *   │  promise.then(fn)              ≈  maybe.map(fn)                     │
 *   │  promise.then(asyncFn)         ≈  maybe.chain(fn)                   │
 *   │  promise.catch(fn)             ≈  either.fold(leftFn)               │
 *   │                                                                     │
 *   │  .then() auto-flattens nested promises (acts as both map & chain)  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Promise chain is monadic
Promise.resolve(5)
  .then(x => x + 1)                        // map
  .then(x => Promise.resolve(x * 2))       // chain (auto-flattened)
  .then(result => console.log('Promise monad:', result));  // 12


// =============================================================================
// PRACTICAL: Optional Chaining vs Maybe
// =============================================================================

console.log('\n=== Modern JS: Optional Chaining ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  JS HAS BUILT-IN NULL SAFETY NOW                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Maybe monad:                                                       │
 *   │  Maybe.of(user).map(u => u.address).map(a => a.city)               │
 *   │                                                                     │
 *   │  Optional chaining (modern JS):                                     │
 *   │  user?.address?.city                                                │
 *   │                                                                     │
 *   │  Nullish coalescing:                                                │
 *   │  user?.address?.city ?? 'Unknown'                                   │
 *   │                                                                     │
 *   │  Use Maybe/Either when you need:                                    │
 *   │  • Chainable transformations                                        │
 *   │  • Error messages along the chain                                   │
 *   │  • Composable with pipe/compose                                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Optional chaining: user?.address?.city');
console.log('Modern JS covers most Maybe use cases');
console.log('Either is still valuable for validation pipelines');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "A functor is a container that implements map - it wraps a value and
 * lets you transform it. Arrays are functors - [1,2,3].map(fn). A monad
 * is a functor that also has chain (flatMap) to avoid nested containers.
 *
 * The most practical example is the Maybe monad for null safety. Instead
 * of checking if(user && user.address && user.address.city), you chain
 * operations and it short-circuits on null. Modern JS has optional chaining
 * for this, but Maybe is still useful in FP-heavy code.
 *
 * The Either monad is great for validation pipelines. Right holds a success
 * value and continues processing. Left holds an error and skips all
 * subsequent operations. It's like a synchronous version of Promise's
 * then/catch pattern.
 *
 * Promises are basically monads - .then() acts as both map and chain
 * because it auto-flattens nested promises.
 *
 * In practice, I don't reach for monads often in JS because of optional
 * chaining and try/catch, but understanding them helps with understanding
 * Promise chains, RxJS Observables, and state management patterns."
 */


// RUN: node docs/28-functional-programming/13-functors-monads.js
