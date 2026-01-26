/**
 * CHALLENGE 01: JavaScript Built-in Error Types
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ JavaScript has 7 built-in error types. Each indicates a SPECIFIC problem: ║
 * ║                                                                            ║
 * ║   1. Error          - Generic error (base class)                           ║
 * ║   2. SyntaxError    - Invalid code syntax                                  ║
 * ║   3. ReferenceError - Variable doesn't exist                               ║
 * ║   4. TypeError      - Wrong type for operation                             ║
 * ║   5. RangeError     - Value out of allowed range                           ║
 * ║   6. URIError       - Invalid URI encoding                                 ║
 * ║   7. EvalError      - (Legacy, rarely seen)                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR TYPE HIERARCHY                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │                         ┌─────────────┐                                     │
 * │                         │   Error     │  ◄── Base class                     │
 * │                         │  (parent)   │                                     │
 * │                         └──────┬──────┘                                     │
 * │                                │                                            │
 * │        ┌───────────┬───────────┼───────────┬───────────┬───────────┐        │
 * │        │           │           │           │           │           │        │
 * │        ▼           ▼           ▼           ▼           ▼           ▼        │
 * │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
 * │   │Syntax   │ │Reference│ │ Type    │ │ Range   │ │  URI    │ │  Eval   │  │
 * │   │Error    │ │Error    │ │ Error   │ │ Error   │ │ Error   │ │ Error   │  │
 * │   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
 * │                                                                             │
 * │   All error types inherit from Error, so they all have:                     │
 * │   • name       (the error type)                                             │
 * │   • message    (description)                                                │
 * │   • stack      (stack trace)                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. SyntaxError - Invalid JavaScript syntax
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. SyntaxError ═══\n");

// Can only catch SyntaxError through eval or JSON.parse
try {
  JSON.parse('{ "name": }');  // Missing value
} catch (e) {
  console.log('A: SyntaxError:', e.name);
  console.log('   Message:', e.message);
}

try {
  eval('var x = ;');  // Invalid syntax
} catch (e) {
  console.log('B: SyntaxError from eval:', e.name);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYNTAXERROR - WHEN CODE IS MALFORMED                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Common causes:                                                              │
 * │ • JSON.parse() with invalid JSON                                            │
 * │ • eval() with invalid JavaScript                                            │
 * │ • new Function() with invalid code                                          │
 * │                                                                             │
 * │ NOTE: Syntax errors in your source code CANNOT be caught!                   │
 * │       They prevent the file from loading at all.                            │
 * │                                                                             │
 * │   // This file won't even run:                                              │
 * │   try {                                                                     │
 * │     let x = ;  // <-- Parse error, file won't load                          │
 * │   } catch (e) { }                                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. ReferenceError - Variable doesn't exist
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. ReferenceError ═══\n");

try {
  console.log(undeclaredVariable);
} catch (e) {
  console.log('C: ReferenceError:', e.name);
  console.log('   Message:', e.message);
}

try {
  const x = 1;
  console.log(y);  // y is not declared
} catch (e) {
  console.log('D: ReferenceError:', e.message);
}

// TDZ (Temporal Dead Zone) also causes ReferenceError
try {
  console.log(myLet);  // Before declaration
  let myLet = 'value';
} catch (e) {
  console.log('E: TDZ ReferenceError:', e.message);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REFERENCEERROR - VARIABLE NOT FOUND                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Common causes:                                                              │
 * │ • Using undeclared variable                                                 │
 * │ • Accessing let/const before declaration (TDZ)                              │
 * │ • Typos in variable names                                                   │
 * │ • Using variable outside its scope                                          │
 * │                                                                             │
 * │ INTERVIEW TIP:                                                              │
 * │ ReferenceError vs TypeError - what's the difference?                        │
 * │                                                                             │
 * │   foo;           // ReferenceError: foo is not defined                      │
 * │   obj.foo;       // undefined (NOT an error!)                               │
 * │   obj.foo.bar;   // TypeError: Cannot read property 'bar' of undefined     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. TypeError - Wrong type for operation
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. TypeError ═══\n");

// Calling non-function
try {
  const num = 42;
  num();  // number is not callable
} catch (e) {
  console.log('F: TypeError:', e.message);
}

// Accessing property of null/undefined
try {
  const obj = null;
  obj.property;
} catch (e) {
  console.log('G: TypeError:', e.message);
}

// Setting property on primitive
try {
  const str = 'hello';
  str.custom = 'value';  // Works silently in non-strict
  // But this fails:
  Object.defineProperty(str, 'x', { value: 1 });
} catch (e) {
  console.log('H: TypeError:', e.message);
}

// Calling new on non-constructor
try {
  const arrow = () => {};
  new arrow();  // Arrow functions can't be constructors
} catch (e) {
  console.log('I: TypeError:', e.message);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TYPEERROR - WRONG TYPE FOR OPERATION                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Most common error type! Causes:                                             │
 * │                                                                             │
 * │ 1. Calling non-function: x()    where x is not a function                  │
 * │ 2. Property of null/undefined:  null.foo, undefined.bar                    │
 * │ 3. new on non-constructor:      new (() => {})                             │
 * │ 4. Modifying read-only:         const arr = Object.freeze([1,2])           │
 * │                                 arr.push(3) // TypeError                   │
 * │                                                                             │
 * │ CONFUSING CASE:                                                             │
 * │                                                                             │
 * │   const obj = {};                                                          │
 * │   obj.a.b;     // TypeError: Cannot read property 'b' of undefined         │
 * │                                                                             │
 * │   Why TypeError and not ReferenceError?                                     │
 * │   Because obj.a DOES exist (it's undefined), but we're trying              │
 * │   to access .b on undefined - that's a type error!                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 4. RangeError - Value out of allowed range
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. RangeError ═══\n");

// Array with invalid length
try {
  const arr = new Array(-1);  // Negative length
} catch (e) {
  console.log('J: RangeError:', e.message);
}

// Stack overflow (recursive RangeError)
try {
  function infiniteRecursion() {
    return infiniteRecursion();
  }
  infiniteRecursion();
} catch (e) {
  console.log('K: RangeError:', e.message);
}

// toFixed with invalid precision
try {
  const num = 1.5;
  num.toFixed(101);  // Max is 100
} catch (e) {
  console.log('L: RangeError:', e.message);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ RANGEERROR - VALUE OUT OF BOUNDS                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Common causes:                                                              │
 * │ • new Array(-1)           - Negative array length                           │
 * │ • new Array(1e20)         - Array too large                                 │
 * │ • num.toFixed(101)        - Precision > 100                                 │
 * │ • num.toPrecision(0)      - Precision must be 1-100                         │
 * │ • Stack overflow          - Too much recursion                              │
 * │ • String.repeat(-1)       - Negative count                                  │
 * │                                                                             │
 * │ INTERVIEW TIP:                                                              │
 * │ Stack overflow is a RangeError, not a StackOverflowError!                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. URIError - Invalid URI encoding
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. URIError ═══\n");

try {
  decodeURIComponent('%');  // Invalid escape sequence
} catch (e) {
  console.log('M: URIError:', e.message);
}

try {
  decodeURI('%E0%A4%A');  // Incomplete sequence
} catch (e) {
  console.log('N: URIError:', e.message);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ URIERROR - INVALID URI OPERATIONS                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Only thrown by URI functions:                                               │
 * │ • decodeURI()                                                               │
 * │ • decodeURIComponent()                                                      │
 * │ • encodeURI()                                                               │
 * │ • encodeURIComponent()                                                      │
 * │                                                                             │
 * │ Rarely seen in practice - usually from malformed user input.               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Checking Error Types with instanceof
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Checking Error Types ═══\n");

function handleError(error) {
  if (error instanceof TypeError) {
    console.log('O: Handling TypeError');
  } else if (error instanceof ReferenceError) {
    console.log('P: Handling ReferenceError');
  } else if (error instanceof SyntaxError) {
    console.log('Q: Handling SyntaxError');
  } else if (error instanceof RangeError) {
    console.log('R: Handling RangeError');
  } else if (error instanceof Error) {
    console.log('S: Handling generic Error');
  }
}

handleError(new TypeError('type issue'));
handleError(new ReferenceError('ref issue'));
handleError(new Error('generic issue'));

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TYPE CHECKING BEST PRACTICES                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Method 1: instanceof (recommended for built-in errors)                      │
 * │                                                                             │
 * │   if (error instanceof TypeError) { ... }                                   │
 * │                                                                             │
 * │                                                                             │
 * │ Method 2: error.name (string comparison)                                    │
 * │                                                                             │
 * │   if (error.name === 'TypeError') { ... }                                   │
 * │                                                                             │
 * │                                                                             │
 * │ Method 3: error.constructor.name                                            │
 * │                                                                             │
 * │   if (error.constructor.name === 'TypeError') { ... }                       │
 * │                                                                             │
 * │                                                                             │
 * │ Order matters! Check specific errors before generic:                        │
 * │                                                                             │
 * │   ✗ BAD:                              ✓ GOOD:                               │
 * │   if (e instanceof Error)             if (e instanceof TypeError)           │
 * │   else if (e instanceof TypeError)    else if (e instanceof Error)          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Quick Reference Table
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR TYPES QUICK REFERENCE                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Error Type      │ Common Cause                   │ Example               │
 * │   ────────────────┼────────────────────────────────┼────────────────────── │
 * │   SyntaxError     │ Invalid code structure         │ JSON.parse('{')       │
 * │   ReferenceError  │ Variable not found             │ console.log(xyz)      │
 * │   TypeError       │ Wrong type for operation       │ null.foo, 42()        │
 * │   RangeError      │ Value out of bounds            │ new Array(-1)         │
 * │   URIError        │ Bad URI encoding               │ decodeURI('%')        │
 * │   EvalError       │ (Legacy, rarely used)          │ N/A                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript has 7 built-in error types, all inheriting from Error:         │
 * │                                                                             │
 * │  • SyntaxError: Thrown when code has invalid syntax, like bad JSON or      │
 * │    eval with malformed code. Note that syntax errors in source files       │
 * │    can't be caught - they prevent the file from loading.                   │
 * │                                                                             │
 * │  • ReferenceError: Thrown when accessing a variable that doesn't exist     │
 * │    or accessing let/const before declaration (temporal dead zone).         │
 * │                                                                             │
 * │  • TypeError: The most common error. Thrown when a value isn't the         │
 * │    expected type - like calling a non-function, accessing properties       │
 * │    of null/undefined, or using new on arrow functions.                     │
 * │                                                                             │
 * │  • RangeError: Thrown when a value is outside allowed range - like         │
 * │    negative array length, stack overflow, or toFixed(101).                 │
 * │                                                                             │
 * │  • URIError: Thrown by URI functions with malformed input.                 │
 * │                                                                             │
 * │  You can check error types with instanceof, checking specific types        │
 * │  before generic Error."                                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/01-error-types.js
 */
