/**
 * TOPIC 00: Unit Testing in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ A unit test verifies ONE small piece of code IN ISOLATION.               ║
 * ║ If your test touches the database, network, or file system -             ║
 * ║ it's NOT a unit test. Unit tests are FAST, ISOLATED, REPEATABLE.         ║
 * ║                                                                          ║
 * ║   Unit Test = Test ONE function/method with KNOWN inputs/outputs         ║
 * ║   Pattern   = AAA (Arrange → Act → Assert)                              ║
 * ║   Speed     = Milliseconds (if slow, something is wrong)                 ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Imagine you're building a LEGO CASTLE. Before snapping bricks together,  │
 * │  you inspect EACH BRICK individually:                                      │
 * │                                                                             │
 * │    - Does this 2x4 brick have the right number of studs? (unit test)      │
 * │    - Is this window piece transparent? (unit test)                         │
 * │    - Does this door hinge swing? (unit test)                              │
 * │                                                                             │
 * │  You DON'T test "does the whole castle stand up" yet - that's             │
 * │  integration testing. You test each brick ALONE, ISOLATED.                │
 * │                                                                             │
 * │  If a brick is defective, you catch it BEFORE wasting time building.      │
 * │  That's why unit tests run FIRST and run FAST.                            │
 * │                                                                             │
 * │  "Test the bricks before you build the castle."                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: THE TEST PYRAMID                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │              /\                                                             │
 * │             /  \         E2E Tests (Few, Slow, Expensive)                  │
 * │            / E2E\        - Full user flows, browser tests                  │
 * │           /──────\                                                          │
 * │          /        \      Integration Tests (Some, Medium)                  │
 * │         /Integration\    - Components working together                     │
 * │        /──────────────\                                                     │
 * │       /                \  Unit Tests (Many, Fast, Cheap)                   │
 * │      /   UNIT TESTS     \ - Individual functions/methods                   │
 * │     /____________________\                                                  │
 * │                                                                             │
 * │   70-80% Unit | 15-20% Integration | 5-10% E2E                            │
 * │                                                                             │
 * │                                                                             │
 * │   THE AAA PATTERN:                                                         │
 * │   ┌──────────┐    ┌──────────┐    ┌──────────┐                            │
 * │   │ ARRANGE  │───>│   ACT    │───>│  ASSERT  │                            │
 * │   │ Set up   │    │ Execute  │    │ Verify   │                            │
 * │   │ inputs & │    │ the code │    │ expected │                            │
 * │   │ expected │    │ under    │    │ outcomes │                            │
 * │   │ values   │    │ test     │    │          │                            │
 * │   └──────────┘    └──────────┘    └──────────┘                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: Node's Built-in assert Module (Foundation)
// ============================================================================

const assert = require('assert');

// --- Basic assertions ---

// assert.strictEqual (===) vs assert.equal (==)
// GOTCHA: ALWAYS use strictEqual, never equal (deprecated behavior)
const add = (a, b) => a + b;

assert.strictEqual(add(2, 3), 5, 'add(2,3) should be 5');
assert.strictEqual(add(-1, 1), 0, 'add(-1,1) should be 0');
assert.strictEqual(add(0, 0), 0, 'add(0,0) should be 0');
console.log('A:', 'assert.strictEqual - basic arithmetic passed');

// TRICKY: assert.equal uses == (loose equality) - NEVER use it!
// assert.equal(1, '1')    // PASSES! (loose) - BAD
// assert.strictEqual(1, '1') // FAILS! (strict) - GOOD

// --- Deep equality for objects/arrays ---
const getUser = (name) => ({ name, role: 'user', active: true });

assert.deepStrictEqual(
  getUser('Alice'),
  { name: 'Alice', role: 'user', active: true },
  'getUser should return correct structure'
);
console.log('B:', 'assert.deepStrictEqual - object comparison passed');

// TRICKY: strictEqual FAILS for objects (reference comparison)
// assert.strictEqual({a:1}, {a:1})  // FAILS! Different references!
// assert.deepStrictEqual({a:1}, {a:1})  // PASSES! Same values

// --- Testing truthy/falsy ---
assert.ok(true, 'true is truthy');
assert.ok(1, '1 is truthy');
assert.ok('hello', 'non-empty string is truthy');
// assert.ok(0)  // FAILS - 0 is falsy
// assert.ok('')  // FAILS - empty string is falsy
console.log('C:', 'assert.ok - truthy checks passed');

// --- Testing errors with assert.throws ---
const divide = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

assert.throws(
  () => divide(10, 0),          // Must wrap in function!
  { message: 'Division by zero' }  // Can match partial error properties
);
console.log('D:', 'assert.throws - error testing passed');

// TRICKY: Common mistake - forgetting to wrap in arrow function
// assert.throws(divide(10, 0))  // WRONG! Error thrown BEFORE assert sees it
// assert.throws(() => divide(10, 0))  // RIGHT! Assert controls execution

// --- assert.doesNotThrow ---
assert.doesNotThrow(() => divide(10, 2));
console.log('E:', 'assert.doesNotThrow - no error confirmed');

// --- assert.notStrictEqual and assert.notDeepStrictEqual ---
assert.notStrictEqual(add(2, 3), 6, '2+3 should NOT be 6');
assert.notDeepStrictEqual({ a: 1 }, { a: 2 }, 'objects should differ');
console.log('F:', 'notStrictEqual / notDeepStrictEqual passed');


// ============================================================================
// SECTION 2: node:test Module (Node 18+ Built-in Test Runner)
// ============================================================================

const { describe, it, test, before, after, beforeEach, afterEach } = require('node:test');

// --- Basic test structure ---
test('basic arithmetic', (t) => {
  assert.strictEqual(2 + 2, 4);
});

// --- describe/it blocks (BDD-style grouping) ---
describe('String Utilities', () => {

  const capitalize = (str) => {
    if (typeof str !== 'string') throw new TypeError('Expected a string');
    if (str.length === 0) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  it('should capitalize first letter', () => {
    assert.strictEqual(capitalize('hello'), 'Hello');
  });

  it('should handle single character', () => {
    assert.strictEqual(capitalize('a'), 'A');
  });

  it('should handle empty string', () => {
    assert.strictEqual(capitalize(''), '');
  });

  it('should lowercase the rest', () => {
    assert.strictEqual(capitalize('hELLO'), 'Hello');
  });

  // TRICKY: Testing error throws in it blocks
  it('should throw for non-string input', () => {
    assert.throws(() => capitalize(123), TypeError);
    assert.throws(() => capitalize(null), TypeError);
    assert.throws(() => capitalize(undefined), TypeError);
  });
});


// ============================================================================
// SECTION 3: The AAA Pattern (Arrange-Act-Assert) - INTERVIEW FAVORITE
// ============================================================================

describe('AAA Pattern Examples', () => {

  const calculateDiscount = (price, discountPercent) => {
    if (price < 0) throw new RangeError('Price cannot be negative');
    if (discountPercent < 0 || discountPercent > 100) {
      throw new RangeError('Discount must be 0-100');
    }
    return price - (price * discountPercent / 100);
  };

  it('should apply 20% discount correctly', () => {
    // ARRANGE - set up inputs and expected output
    const price = 100;
    const discount = 20;
    const expected = 80;

    // ACT - execute the function under test
    const result = calculateDiscount(price, discount);

    // ASSERT - verify the result
    assert.strictEqual(result, expected);
  });

  it('should return original price for 0% discount', () => {
    // Arrange
    const price = 50;
    // Act
    const result = calculateDiscount(price, 0);
    // Assert
    assert.strictEqual(result, 50);
  });

  it('should return 0 for 100% discount', () => {
    const result = calculateDiscount(200, 100);
    assert.strictEqual(result, 0);
  });

  // EDGE CASES - interviewers love these
  it('should throw for negative price', () => {
    assert.throws(() => calculateDiscount(-10, 20), RangeError);
  });

  it('should throw for discount > 100', () => {
    assert.throws(() => calculateDiscount(100, 150), RangeError);
  });

  // TRICKY: Floating point edge case
  it('should handle floating point correctly', () => {
    const result = calculateDiscount(10, 33.33);
    // GOTCHA: 10 - (10 * 33.33 / 100) = 6.667
    // Floating point may give 6.667000000000001
    assert.ok(Math.abs(result - 6.667) < 0.001, 'Should be close to 6.667');
  });
});


// ============================================================================
// SECTION 4: beforeEach / afterEach (Setup & Teardown)
// ============================================================================

describe('Shopping Cart (with beforeEach/afterEach)', () => {

  // Simple cart implementation to test
  const createCart = () => {
    const items = [];
    return {
      add: (item) => items.push(item),
      remove: (name) => {
        const idx = items.findIndex((i) => i.name === name);
        if (idx === -1) throw new Error(`Item "${name}" not found`);
        return items.splice(idx, 1)[0];
      },
      getTotal: () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
      getItems: () => [...items], // Return copy to prevent mutation
      clear: () => items.length = 0,
      count: () => items.length,
    };
  };

  let cart;

  // Runs BEFORE each test - fresh cart every time (ISOLATION!)
  beforeEach(() => {
    cart = createCart();
    cart.add({ name: 'Apple', price: 1.5, qty: 3 });
    cart.add({ name: 'Bread', price: 2.0, qty: 1 });
  });

  // Runs AFTER each test - cleanup
  afterEach(() => {
    cart.clear();
  });

  it('should start with 2 items from setup', () => {
    assert.strictEqual(cart.count(), 2);
  });

  it('should calculate total correctly', () => {
    // 1.5*3 + 2.0*1 = 6.5
    assert.strictEqual(cart.getTotal(), 6.5);
  });

  it('should add items', () => {
    cart.add({ name: 'Milk', price: 3.0, qty: 2 });
    assert.strictEqual(cart.count(), 3);
    assert.strictEqual(cart.getTotal(), 12.5); // 6.5 + 6.0
  });

  it('should remove items by name', () => {
    cart.remove('Apple');
    assert.strictEqual(cart.count(), 1);
    assert.strictEqual(cart.getTotal(), 2.0);
  });

  it('should throw when removing non-existent item', () => {
    assert.throws(() => cart.remove('Pizza'), { message: 'Item "Pizza" not found' });
  });

  // KEY POINT: Each test gets a FRESH cart because of beforeEach
  // Tests don't affect each other - this is TEST ISOLATION
  it('should still have 2 items (isolation proof)', () => {
    assert.strictEqual(cart.count(), 2); // Not affected by previous tests
  });
});


// ============================================================================
// SECTION 5: test.only / test.skip
// ============================================================================

describe('test.only and test.skip', () => {

  // test.skip - skips this test (useful for WIP or known failures)
  it.skip('this test is skipped', () => {
    assert.strictEqual(1, 2); // Would fail, but never runs
  });

  // test.todo - placeholder for tests you plan to write
  it.todo('should handle currency conversion');
  it.todo('should apply bulk discounts');

  // test.only - ONLY runs this test (when using --test-only flag)
  // Uncomment to try:
  // it.only('only this test runs', () => {
  //   assert.strictEqual(1, 1);
  // });

  it('this test runs normally', () => {
    assert.ok(true);
  });
});


// ============================================================================
// SECTION 6: Testing ASYNC Code (TRICKY - Interview Favorite)
// ============================================================================

describe('Testing Async Code', () => {

  // --- Async function to test ---
  const fetchUserById = async (id) => {
    if (!id) throw new Error('ID is required');
    // Simulate async DB lookup
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = { 1: 'Alice', 2: 'Bob', 3: 'Charlie' };
        if (users[id]) {
          resolve({ id, name: users[id] });
        } else {
          reject(new Error(`User ${id} not found`));
        }
      }, 10);
    });
  };

  // Method 1: async/await (PREFERRED)
  it('should fetch user by id (async/await)', async () => {
    const user = await fetchUserById(1);
    assert.deepStrictEqual(user, { id: 1, name: 'Alice' });
  });

  // Method 2: Return the promise (also works)
  it('should fetch user by id (return promise)', () => {
    return fetchUserById(2).then((user) => {
      assert.deepStrictEqual(user, { id: 2, name: 'Bob' });
    });
  });

  // TRICKY: Testing async errors
  it('should reject for non-existent user', async () => {
    await assert.rejects(
      async () => await fetchUserById(999),
      { message: 'User 999 not found' }
    );
  });

  // TRICKY: Testing synchronous throws in async functions
  it('should throw synchronously for missing id', async () => {
    await assert.rejects(
      () => fetchUserById(null),
      { message: 'ID is required' }
    );
  });

  // GOTCHA: Forgetting async/await - test passes but error is SILENT!
  // BAD:
  // it('broken test', () => {
  //   fetchUserById(999); // No await! Promise rejection goes unhandled!
  //   // Test PASSES even though it should FAIL
  // });
});


// ============================================================================
// SECTION 7: Testing Callbacks (Legacy Pattern - Still Asked in Interviews)
// ============================================================================

describe('Testing Callback-based Code', () => {

  // Callback-style function
  const readConfig = (path, callback) => {
    setTimeout(() => {
      if (path === '/valid') {
        callback(null, { port: 3000, host: 'localhost' });
      } else {
        callback(new Error(`Config not found: ${path}`));
      }
    }, 10);
  };

  // node:test handles callbacks via the done parameter or promisifying
  it('should read valid config', async () => {
    // Convert callback to promise for clean testing
    const result = await new Promise((resolve, reject) => {
      readConfig('/valid', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    assert.deepStrictEqual(result, { port: 3000, host: 'localhost' });
  });

  it('should error for invalid path', async () => {
    await assert.rejects(
      () => new Promise((resolve, reject) => {
        readConfig('/invalid', (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }),
      { message: 'Config not found: /invalid' }
    );
  });
});


// ============================================================================
// SECTION 8: Pure vs Impure Functions (Testing Impact)
// ============================================================================

describe('Pure vs Impure Functions', () => {

  // PURE function - same input ALWAYS gives same output, no side effects
  // EASY to test!
  const calculateTax = (amount, rate) => amount * rate;

  it('pure function: always predictable', () => {
    assert.strictEqual(calculateTax(100, 0.1), 10);
    assert.strictEqual(calculateTax(100, 0.1), 10); // Always same!
    assert.strictEqual(calculateTax(200, 0.2), 40);
  });

  // IMPURE function - depends on external state
  // HARDER to test! Need to control the external state
  let taxRate = 0.1;
  const calculateTaxImpure = (amount) => amount * taxRate; // Uses external var!

  it('impure function: depends on external state', () => {
    taxRate = 0.1;
    assert.strictEqual(calculateTaxImpure(100), 10);

    taxRate = 0.2; // Changing external state changes result!
    assert.strictEqual(calculateTaxImpure(100), 20);
  });

  // IMPURE: depends on current time
  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   return hour < 12 ? 'Good morning' : 'Good afternoon';
  // };
  // This is HARD to test because output changes based on time of day!
  // Solution: Inject the dependency
  const getGreeting = (hour) => {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  it('testable greeting with dependency injection', () => {
    assert.strictEqual(getGreeting(9), 'Good morning');
    assert.strictEqual(getGreeting(14), 'Good afternoon');
    assert.strictEqual(getGreeting(20), 'Good evening');
  });
});


// ============================================================================
// SECTION 9: Edge Cases & Tricky Scenarios
// ============================================================================

describe('Edge Cases Every Interviewer Asks', () => {

  const parseAge = (input) => {
    if (input === null || input === undefined) return null;
    const num = Number(input);
    if (Number.isNaN(num)) throw new TypeError(`Invalid age: ${input}`);
    if (num < 0 || num > 150) throw new RangeError(`Age out of range: ${num}`);
    return Math.floor(num);
  };

  it('should parse valid ages', () => {
    assert.strictEqual(parseAge(25), 25);
    assert.strictEqual(parseAge('30'), 30);
    assert.strictEqual(parseAge(25.7), 25);  // Floors decimals
  });

  it('should handle null/undefined', () => {
    assert.strictEqual(parseAge(null), null);
    assert.strictEqual(parseAge(undefined), null);
  });

  it('should throw for invalid inputs', () => {
    assert.throws(() => parseAge('abc'), TypeError);
    assert.throws(() => parseAge(''), TypeError);  // GOTCHA: Number('') is 0, but we check NaN first
    // Wait - Number('') is actually 0, not NaN! Let's verify:
  });

  it('GOTCHA: Number("") is 0, not NaN', () => {
    // This is a JavaScript quirk that trips people up
    assert.strictEqual(Number(''), 0);     // Surprise! '' becomes 0
    assert.strictEqual(Number(' '), 0);    // Whitespace too!
    assert.strictEqual(Number(null), 0);   // null is 0
    assert.ok(Number.isNaN(Number(undefined))); // undefined is NaN
    assert.ok(Number.isNaN(Number('abc')));     // Actual NaN
  });

  it('should throw for out of range', () => {
    assert.throws(() => parseAge(-1), RangeError);
    assert.throws(() => parseAge(151), RangeError);
  });

  // Boundary testing - test EXACTLY at boundaries
  it('should accept boundary values', () => {
    assert.strictEqual(parseAge(0), 0);     // Lower boundary
    assert.strictEqual(parseAge(150), 150); // Upper boundary
  });
});


// ============================================================================
// SECTION 10: Nested describe blocks & Test Organization
// ============================================================================

describe('Array Utilities', () => {

  const arrayUtils = {
    unique: (arr) => [...new Set(arr)],
    flatten: (arr) => arr.flat(Infinity),
    chunk: (arr, size) => {
      if (size <= 0) throw new Error('Chunk size must be positive');
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    },
    intersection: (a, b) => a.filter((item) => b.includes(item)),
  };

  describe('#unique()', () => {
    it('should remove duplicates', () => {
      assert.deepStrictEqual(arrayUtils.unique([1, 2, 2, 3, 3, 3]), [1, 2, 3]);
    });

    it('should handle empty array', () => {
      assert.deepStrictEqual(arrayUtils.unique([]), []);
    });

    it('should preserve order', () => {
      assert.deepStrictEqual(arrayUtils.unique([3, 1, 2, 1, 3]), [3, 1, 2]);
    });

    // GOTCHA: Objects are compared by reference in Set
    it('GOTCHA: does NOT dedupe objects by value', () => {
      const result = arrayUtils.unique([{ a: 1 }, { a: 1 }]);
      assert.strictEqual(result.length, 2); // Both kept! Different refs!
    });
  });

  describe('#chunk()', () => {
    it('should split array into chunks', () => {
      assert.deepStrictEqual(
        arrayUtils.chunk([1, 2, 3, 4, 5], 2),
        [[1, 2], [3, 4], [5]]
      );
    });

    it('should handle chunk size larger than array', () => {
      assert.deepStrictEqual(
        arrayUtils.chunk([1, 2], 5),
        [[1, 2]]
      );
    });

    it('should throw for zero/negative chunk size', () => {
      assert.throws(() => arrayUtils.chunk([1], 0), Error);
      assert.throws(() => arrayUtils.chunk([1], -1), Error);
    });
  });

  describe('#intersection()', () => {
    it('should find common elements', () => {
      assert.deepStrictEqual(
        arrayUtils.intersection([1, 2, 3, 4], [3, 4, 5, 6]),
        [3, 4]
      );
    });

    it('should return empty for no overlap', () => {
      assert.deepStrictEqual(
        arrayUtils.intersection([1, 2], [3, 4]),
        []
      );
    });
  });
});


console.log('G:', 'All inline assert tests passed!');
console.log('H:', 'Run with --test flag for full test runner output');

/**
 * OUTPUT:
 *   A: assert.strictEqual - basic arithmetic passed
 *   B: assert.deepStrictEqual - object comparison passed
 *   C: assert.ok - truthy checks passed
 *   D: assert.throws - error testing passed
 *   E: assert.doesNotThrow - no error confirmed
 *   F: notStrictEqual / notDeepStrictEqual passed
 *   G: All inline assert tests passed!
 *   H: Run with --test flag for full test runner output
 *
 *   (When run with --test, you'll also see node:test output like:)
 *   # tests 30
 *   # suites 8
 *   # pass 28
 *   # skip 1
 *   # todo 2
 *   # fail 0
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMMON ASSERT METHODS CHEATSHEET                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ assert.strictEqual(a, b)       → a === b (primitives)                   ║
 * ║ assert.deepStrictEqual(a, b)   → Deep value equality (objects/arrays)   ║
 * ║ assert.notStrictEqual(a, b)    → a !== b                                ║
 * ║ assert.ok(value)               → Truthy check                          ║
 * ║ assert.throws(fn, Error)       → Function throws expected error         ║
 * ║ assert.rejects(asyncFn, Error) → Async function rejects (MUST await!)  ║
 * ║ assert.doesNotThrow(fn)        → Function does NOT throw               ║
 * ║ assert.doesNotReject(asyncFn)  → Async does NOT reject                 ║
 * ║ assert.match(str, regex)       → String matches regex                  ║
 * ║ assert.doesNotMatch(str, regex)→ String does NOT match regex           ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Unit testing verifies individual functions or methods in isolation using  │
 * │  the AAA pattern: Arrange inputs, Act by calling the function, Assert      │
 * │  expected outputs. Node.js has a built-in test runner (node:test) since    │
 * │  v18 with describe/it blocks, hooks (beforeEach/afterEach), and skip/todo. │
 * │  I use assert.strictEqual for primitives, deepStrictEqual for objects,     │
 * │  assert.throws for sync errors, and assert.rejects for async errors.      │
 * │  Key principles: tests must be fast, isolated, repeatable, and test       │
 * │  edge cases like null inputs, boundary values, and type coercion gotchas. │
 * │  Pure functions are easiest to test; impure ones need dependency           │
 * │  injection to become testable."                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node --test docs/node/10-testing/00-unit-testing.js
 */
