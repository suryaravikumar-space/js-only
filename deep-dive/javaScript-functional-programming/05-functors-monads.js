/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONAL PROGRAMMING - FILE 5: FUNCTORS & MONADS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Functors and Monads are abstract patterns for handling values in containers.
 * They enable safe, composable operations on wrapped values.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       FUNCTORS & MONADS - CONTAINERS FOR VALUES                   ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                        WHAT IS A FUNCTOR?                                  ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  A Functor is a container that:                                            ║
 * ║  1. Holds a value                                                          ║
 * ║  2. Implements a map method                                                ║
 * ║  3. map applies a function to the value and returns a new Functor         ║
 * ║                                                                            ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐  ║
 * ║  │                                                                      │  ║
 * ║  │     ┌─────────┐                              ┌─────────┐            │  ║
 * ║  │     │ Functor │     .map(fn)                 │ Functor │            │  ║
 * ║  │     │         │  ─────────────────────────►  │         │            │  ║
 * ║  │     │   [5]   │  fn = x => x * 2             │  [10]   │            │  ║
 * ║  │     └─────────┘                              └─────────┘            │  ║
 * ║  │                                                                      │  ║
 * ║  │  The value stays in the container!                                  │  ║
 * ║  │  The function transforms what's inside.                             │  ║
 * ║  │                                                                      │  ║
 * ║  └─────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ║  Examples: Array, Promise, Maybe, Either                                   ║
 * ║                                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("1️⃣  UNDERSTANDING FUNCTORS\n");

// Array is a functor!
console.log("=== Array as a Functor ===");
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log("Original:", numbers);
console.log("Mapped:", doubled);


// Simple Box functor
class Box {
  constructor(value) {
    this.value = value;
  }

  map(fn) {
    return new Box(fn(this.value));
  }

  // Helper to get the value out
  fold(fn) {
    return fn(this.value);
  }

  toString() {
    return `Box(${this.value})`;
  }
}

console.log("\n=== Box Functor ===");
const box = new Box(5);
console.log("Box(5):", box.toString());

const result = box
  .map(x => x + 1)    // Box(6)
  .map(x => x * 2)    // Box(12)
  .map(x => x + 10);  // Box(22)

console.log("After map chain:", result.toString());
console.log("Extracted value:", result.fold(x => x));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        FUNCTOR LAWS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("2️⃣  FUNCTOR LAWS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                         FUNCTOR LAWS                                       │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  1. IDENTITY LAW                                                           │
 * │     functor.map(x => x) equals functor                                    │
 * │     Mapping identity function returns equivalent functor                  │
 * │                                                                            │
 * │  2. COMPOSITION LAW                                                        │
 * │     functor.map(f).map(g) equals functor.map(x => g(f(x)))               │
 * │     Mapping f then g equals mapping the composition of f and g           │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

const identity = x => x;
const f = x => x + 1;
const g = x => x * 2;

// Identity law
const box1 = new Box(5);
const box2 = box1.map(identity);
console.log("Identity Law:");
console.log("  Box(5).map(x => x) =", box2.toString());
console.log("  Equals Box(5)? Values equal:", box1.value === box2.value);

// Composition law
const box3 = new Box(5);
const leftSide = box3.map(f).map(g);          // map f, then map g
const rightSide = box3.map(x => g(f(x)));     // map composition
console.log("\nComposition Law:");
console.log("  box.map(f).map(g) =", leftSide.toString());
console.log("  box.map(x => g(f(x))) =", rightSide.toString());
console.log("  Values equal:", leftSide.value === rightSide.value);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        MAYBE FUNCTOR
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("3️⃣  MAYBE FUNCTOR - HANDLING NULL/UNDEFINED\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        MAYBE FUNCTOR                                       │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Maybe handles potentially null/undefined values safely.                  │
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────────────────────────┐      │
 * │  │                                                                  │      │
 * │  │  Just(5)                        Nothing                         │      │
 * │  │  ┌───────────┐                  ┌───────────┐                   │      │
 * │  │  │ Has value │  .map(fn)        │ No value  │  .map(fn)         │      │
 * │  │  │    [5]    │ ───────────►     │   null    │ ───────────►     │      │
 * │  │  └───────────┘  applies fn      └───────────┘  does nothing    │      │
 * │  │      ↓                              ↓                           │      │
 * │  │  Just(10)                       Nothing                         │      │
 * │  │                                                                  │      │
 * │  └─────────────────────────────────────────────────────────────────┘      │
 * │                                                                            │
 * │  No more: if (x != null) { ... }!                                         │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  static nothing() {
    return new Maybe(null);
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }

  fold(onNothing, onJust) {
    return this.isNothing() ? onNothing() : onJust(this.value);
  }

  toString() {
    return this.isNothing() ? 'Nothing' : `Just(${this.value})`;
  }
}

console.log("=== Maybe in Action ===\n");

// Safe property access
const user = {
  name: 'Alice',
  address: {
    city: 'Seattle'
  }
};

const userWithoutAddress = {
  name: 'Bob'
};

// Without Maybe - lots of null checks
function getCityOld(user) {
  if (user && user.address && user.address.city) {
    return user.address.city.toUpperCase();
  }
  return 'Unknown';
}

// With Maybe - clean chaining
const getCity = user =>
  Maybe.of(user)
    .map(u => u.address)
    .map(a => a.city)
    .map(c => c.toUpperCase())
    .getOrElse('Unknown');

console.log("getCity(user):", getCity(user));
console.log("getCity(userWithoutAddress):", getCity(userWithoutAddress));
console.log("getCity(null):", getCity(null));


// Practical Maybe example
console.log("\n=== Practical Maybe Example ===\n");

const findUser = id => {
  const users = { 1: { name: 'Alice', age: 30 }, 2: { name: 'Bob', age: 25 } };
  return Maybe.of(users[id]);
};

const getUserAge = id =>
  findUser(id)
    .map(user => user.age)
    .map(age => `Age: ${age}`)
    .getOrElse('User not found');

console.log("getUserAge(1):", getUserAge(1));
console.log("getUserAge(999):", getUserAge(999));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        EITHER FUNCTOR
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("4️⃣  EITHER FUNCTOR - HANDLING ERRORS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        EITHER FUNCTOR                                      │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Either has two sides: Left (error) and Right (success)                   │
 * │                                                                            │
 * │  Right(value)                        Left(error)                          │
 * │  ┌───────────┐                       ┌───────────┐                        │
 * │  │  Success  │  .map(fn)             │  Error    │  .map(fn)              │
 * │  │   [5]     │ ────────────►         │  [err]    │ ────────────►          │
 * │  └───────────┘  applies fn           └───────────┘  preserves error       │
 * │       ↓                                   ↓                                │
 * │  Right(10)                           Left(err)                            │
 * │                                                                            │
 * │  Convention: Right is "right" (correct), Left is "left" (wrong)          │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

class Either {
  constructor(value) {
    this.value = value;
  }

  static left(value) {
    return new Left(value);
  }

  static right(value) {
    return new Right(value);
  }

  static of(value) {
    return Either.right(value);
  }

  static try(fn) {
    try {
      return Either.right(fn());
    } catch (e) {
      return Either.left(e.message);
    }
  }
}

class Left extends Either {
  map(fn) {
    return this; // Ignore the function, just return self
  }

  fold(leftFn, rightFn) {
    return leftFn(this.value);
  }

  isLeft() { return true; }
  isRight() { return false; }

  toString() {
    return `Left(${this.value})`;
  }
}

class Right extends Either {
  map(fn) {
    return Either.right(fn(this.value));
  }

  fold(leftFn, rightFn) {
    return rightFn(this.value);
  }

  isLeft() { return false; }
  isRight() { return true; }

  toString() {
    return `Right(${this.value})`;
  }
}

console.log("=== Either in Action ===\n");

// Validation with Either
const validateAge = age => {
  if (typeof age !== 'number') return Either.left('Age must be a number');
  if (age < 0) return Either.left('Age cannot be negative');
  if (age > 150) return Either.left('Age is unrealistic');
  return Either.right(age);
};

const processAge = age =>
  validateAge(age)
    .map(a => a + 1)  // Next birthday age
    .fold(
      error => `Error: ${error}`,
      value => `Next birthday age: ${value}`
    );

console.log("processAge(25):", processAge(25));
console.log("processAge(-5):", processAge(-5));
console.log("processAge('hello'):", processAge('hello'));


// Chaining validations
console.log("\n=== Chained Validation ===\n");

const validateEmail = email => {
  if (!email.includes('@')) return Either.left('Invalid email');
  return Either.right(email);
};

const validatePassword = password => {
  if (password.length < 8) return Either.left('Password too short');
  return Either.right(password);
};

// Sequential validation
const validateUser = (email, password) => {
  return validateEmail(email)
    .map(() => validatePassword(password))
    .fold(
      err => `Validation failed: ${err}`,
      result => result.fold(
        err => `Validation failed: ${err}`,
        () => 'User is valid!'
      )
    );
};

console.log(validateUser('test@email.com', 'password123'));
console.log(validateUser('invalid', 'password123'));
console.log(validateUser('test@email.com', 'short'));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        WHAT IS A MONAD?
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("5️⃣  MONADS - FUNCTORS THAT CAN FLATTEN\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        WHAT IS A MONAD?                                    │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  A Monad is a Functor with extra powers:                                  │
 * │  1. Has map (it's a functor)                                              │
 * │  2. Has flatMap (also called chain, bind, >>=)                            │
 * │  3. Has of (creates a monad from a value)                                 │
 * │                                                                            │
 * │  The Problem with just map:                                               │
 * │  ┌─────────────────────────────────────────────────────────────────┐      │
 * │  │                                                                  │      │
 * │  │  Maybe(5).map(x => Maybe(x + 1))                                │      │
 * │  │                   ↓                                              │      │
 * │  │              Maybe(Maybe(6))  ← Nested! Not what we want!       │      │
 * │  │                                                                  │      │
 * │  └─────────────────────────────────────────────────────────────────┘      │
 * │                                                                            │
 * │  flatMap flattens:                                                        │
 * │  ┌─────────────────────────────────────────────────────────────────┐      │
 * │  │                                                                  │      │
 * │  │  Maybe(5).flatMap(x => Maybe(x + 1))                            │      │
 * │  │                   ↓                                              │      │
 * │  │              Maybe(6)  ← Flattened! Perfect!                    │      │
 * │  │                                                                  │      │
 * │  └─────────────────────────────────────────────────────────────────┘      │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Upgrade Maybe to a Monad
class MaybeMonad {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new MaybeMonad(value);
  }

  static nothing() {
    return new MaybeMonad(null);
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    return this.isNothing() ? this : MaybeMonad.of(fn(this.value));
  }

  // This is what makes it a Monad!
  flatMap(fn) {
    return this.isNothing() ? this : fn(this.value);
  }

  // Aliases
  chain(fn) { return this.flatMap(fn); }
  bind(fn) { return this.flatMap(fn); }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }

  toString() {
    return this.isNothing() ? 'Nothing' : `Just(${JSON.stringify(this.value)})`;
  }
}

console.log("=== map vs flatMap ===\n");

const parseNumber = str => {
  const num = parseInt(str, 10);
  return isNaN(num) ? MaybeMonad.nothing() : MaybeMonad.of(num);
};

// With map - gets nested
const nestedResult = MaybeMonad.of('42').map(parseNumber);
console.log("MaybeMonad.of('42').map(parseNumber):", nestedResult.toString());

// With flatMap - stays flat
const flatResult = MaybeMonad.of('42').flatMap(parseNumber);
console.log("MaybeMonad.of('42').flatMap(parseNumber):", flatResult.toString());


// Practical monad chaining
console.log("\n=== Monad Chaining ===\n");

const safeDivide = (a, b) =>
  b === 0 ? MaybeMonad.nothing() : MaybeMonad.of(a / b);

const calculation = MaybeMonad.of(100)
  .flatMap(x => safeDivide(x, 2))    // Just(50)
  .flatMap(x => safeDivide(x, 5))    // Just(10)
  .flatMap(x => safeDivide(x, 2));   // Just(5)

console.log("100 / 2 / 5 / 2 =", calculation.toString());

const badCalculation = MaybeMonad.of(100)
  .flatMap(x => safeDivide(x, 2))    // Just(50)
  .flatMap(x => safeDivide(x, 0))    // Nothing! Division by zero
  .flatMap(x => safeDivide(x, 2));   // Never called, stays Nothing

console.log("100 / 2 / 0 / 2 =", badCalculation.toString());


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        MONAD LAWS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("6️⃣  MONAD LAWS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MONAD LAWS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. LEFT IDENTITY                                                            │
│     M.of(a).flatMap(f) equals f(a)                                          │
│     Wrapping then flatMapping is same as just calling the function          │
│                                                                              │
│  2. RIGHT IDENTITY                                                           │
│     m.flatMap(M.of) equals m                                                │
│     flatMapping with of gives back the same monad                           │
│                                                                              │
│  3. ASSOCIATIVITY                                                            │
│     m.flatMap(f).flatMap(g) equals m.flatMap(x => f(x).flatMap(g))         │
│     Chaining order doesn't matter (just like (a+b)+c = a+(b+c))             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
`);

// Verify laws
console.log("=== Verifying Monad Laws ===\n");

const fn1 = x => MaybeMonad.of(x + 1);
const fn2 = x => MaybeMonad.of(x * 2);

// Left identity: of(a).flatMap(f) === f(a)
const leftId1 = MaybeMonad.of(5).flatMap(fn1).value;
const leftId2 = fn1(5).value;
console.log("Left Identity:", leftId1 === leftId2);

// Right identity: m.flatMap(of) === m
const rightId1 = MaybeMonad.of(5).flatMap(MaybeMonad.of).value;
const rightId2 = MaybeMonad.of(5).value;
console.log("Right Identity:", rightId1 === rightId2);

// Associativity: m.flatMap(f).flatMap(g) === m.flatMap(x => f(x).flatMap(g))
const assoc1 = MaybeMonad.of(5).flatMap(fn1).flatMap(fn2).value;
const assoc2 = MaybeMonad.of(5).flatMap(x => fn1(x).flatMap(fn2)).value;
console.log("Associativity:", assoc1 === assoc2);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        PROMISE IS A MONAD
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("7️⃣  PROMISE AS A MONAD\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PROMISE IS A MONAD                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Promise implements the monad pattern:                                       │
│                                                                              │
│  Promise.resolve(value)  ←  'of' - wraps a value                            │
│  promise.then(fn)        ←  'flatMap' - chains and flattens                 │
│                                                                              │
│  Promise.resolve(5)                                                          │
│    .then(x => Promise.resolve(x + 1))  // Returns Promise, auto-flattened  │
│    .then(x => x * 2)                   // Returns value, auto-wrapped       │
│    .then(console.log);                 // 12                                 │
│                                                                              │
│  Promise.then() is both map AND flatMap!                                    │
│  It automatically flattens if the callback returns a Promise.               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
`);

// Demonstrate Promise as monad
console.log("=== Promise Monad Demo ===");

Promise.resolve(5)
  .then(x => x + 1)                    // 6
  .then(x => Promise.resolve(x * 2))   // 12 (auto-flattened)
  .then(x => x + 10)                   // 22
  .then(result => console.log("Promise chain result:", result));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        PRACTICAL MONAD PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("8️⃣  PRACTICAL MONAD PATTERNS\n");

// IO Monad for side effects
class IO {
  constructor(effect) {
    this.effect = effect;
  }

  static of(value) {
    return new IO(() => value);
  }

  map(fn) {
    return new IO(() => fn(this.effect()));
  }

  flatMap(fn) {
    return new IO(() => fn(this.effect()).run());
  }

  run() {
    return this.effect();
  }
}

console.log("=== IO Monad ===\n");

const readConfig = () => new IO(() => ({ apiUrl: 'https://api.example.com' }));
const log = x => new IO(() => {
  console.log(`  Logging: ${JSON.stringify(x)}`);
  return x;
});

const program = readConfig()
  .flatMap(config => log(config))
  .map(config => config.apiUrl);

console.log("Running IO monad:");
const apiUrl = program.run();
console.log("  Result:", apiUrl);


// Task Monad (lazy Promise)
console.log("\n=== Task Monad (Lazy Promise) ===\n");

class Task {
  constructor(fork) {
    this.fork = fork;
  }

  static of(value) {
    return new Task((reject, resolve) => resolve(value));
  }

  static rejected(error) {
    return new Task((reject, resolve) => reject(error));
  }

  map(fn) {
    return new Task((reject, resolve) =>
      this.fork(reject, x => resolve(fn(x)))
    );
  }

  flatMap(fn) {
    return new Task((reject, resolve) =>
      this.fork(reject, x => fn(x).fork(reject, resolve))
    );
  }

  // Convert to Promise
  toPromise() {
    return new Promise((resolve, reject) => this.fork(reject, resolve));
  }
}

// Task is lazy - nothing happens until fork is called
const fetchTask = Task.of(42)
  .map(x => x * 2)
  .map(x => x + 10);

console.log("Task created but not executed yet...");

fetchTask.fork(
  err => console.log("Error:", err),
  result => console.log("Task result:", result)
);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📋  FUNCTORS & MONADS - INTERVIEW QUESTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: What is a Functor?                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A Functor is a container type that:                                      │
│    1. Holds a value                                                         │
│    2. Implements a map method                                               │
│    3. map applies a function to the value and returns a new Functor        │
│                                                                              │
│    Examples: Array, Maybe, Either, Promise                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: What is a Monad?                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A Monad is a Functor with additional capabilities:                       │
│    1. Has map (it's a functor)                                              │
│    2. Has flatMap (also called chain, bind)                                 │
│    3. Has of (creates monad from value)                                     │
│                                                                              │
│    flatMap allows chaining functions that return monads without nesting.    │
│    "A monad is just a monoid in the category of endofunctors" (joke)       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: What's the difference between map and flatMap?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: map:     Container(a).map(a => Container(b)) → Container(Container(b))  │
│    flatMap: Container(a).flatMap(a => Container(b)) → Container(b)         │
│                                                                              │
│    flatMap automatically unwraps/flattens the nested container.            │
│    Use flatMap when your function returns a container type.                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: Why is Maybe useful?                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Maybe eliminates null/undefined checks:                                  │
│                                                                              │
│    // Without Maybe - defensive null checks everywhere                      │
│    if (user && user.address && user.address.city) { ... }                  │
│                                                                              │
│    // With Maybe - clean chaining                                           │
│    Maybe.of(user).map(u => u.address).map(a => a.city)                     │
│                                                                              │
│    Operations on Nothing just pass through, no crashes.                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: Is Promise a Monad?                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Almost! Promise is monad-like but breaks some laws:                      │
│    • Promise.resolve is like 'of'                                           │
│    • .then() acts as both map AND flatMap (auto-flattens)                  │
│                                                                              │
│    It doesn't strictly follow monad laws due to:                            │
│    • Eager evaluation (not lazy)                                            │
│    • .then() not distinguishing map from flatMap                           │
│    • Some edge cases with Promise.resolve                                   │
│                                                                              │
│    For practical purposes, you can treat it like a monad.                   │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("📝  FUNCTORS & MONADS CHEAT SHEET\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                       QUICK REFERENCE                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  FUNCTOR (mappable container):                                             ║
║    • Has map(fn) → returns new Functor                                    ║
║    • Array, Maybe, Either, Promise are Functors                           ║
║                                                                            ║
║  MONAD (chainable container):                                              ║
║    • Has map (it's a Functor)                                             ║
║    • Has flatMap/chain/bind → flattens nested containers                  ║
║    • Has of → wraps value in container                                    ║
║                                                                            ║
║  COMMON TYPES:                                                             ║
║    Maybe - handles null/undefined                                          ║
║    Either - handles errors (Left=error, Right=success)                    ║
║    IO - wraps side effects                                                 ║
║    Task - lazy Promise                                                     ║
║                                                                            ║
║  WHEN TO USE:                                                              ║
║    map:     fn returns plain value                                        ║
║    flatMap: fn returns container (Maybe, Promise, etc.)                   ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FILE 5 COMPLETE ═══");
console.log("Run: node 06-recursion-tail-call.js");
