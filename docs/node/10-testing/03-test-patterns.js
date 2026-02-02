/**
 * TOPIC 03: Test Patterns & Best Practices
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Great tests are READABLE, RELIABLE, and FAST.                            ║
 * ║ A flaky test is WORSE than no test - it erodes trust.                   ║
 * ║ Follow patterns to write tests that help, not hinder.                   ║
 * ║                                                                          ║
 * ║   AAA Pattern     = Arrange, Act, Assert (structure every test)         ║
 * ║   Test Doubles    = Stubs, Mocks, Spies, Fakes, Dummies               ║
 * ║   Fixtures        = Pre-built test data, reusable across tests         ║
 * ║   F.I.R.S.T.     = Fast, Isolated, Repeatable, Self-validating, Timely║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Imagine you're a CHEF preparing for a cooking competition:               │
 * │                                                                             │
 * │    - ARRANGE: Lay out all ingredients, preheat oven, grease the pan.     │
 * │      (Set up everything BEFORE you start cooking.)                       │
 * │                                                                             │
 * │    - ACT: Cook the dish. One action, one recipe.                         │
 * │      (Execute the ONE thing you're testing.)                             │
 * │                                                                             │
 * │    - ASSERT: Taste it. Check the temperature. Inspect the color.         │
 * │      (Verify the result matches expectations.)                           │
 * │                                                                             │
 * │  You wouldn't taste WHILE cooking (mixing Act and Assert).               │
 * │  You wouldn't start cooking before gathering ingredients (skipping       │
 * │  Arrange). Each step has its place.                                      │
 * │                                                                             │
 * │  Fixtures are like your MISE EN PLACE - pre-measured ingredients         │
 * │  in little bowls, ready to grab. Same data, every time you cook.         │
 * │                                                                             │
 * │  "Arrange your ingredients. Cook once. Taste to verify."                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: THE FIVE TEST DOUBLES                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  ┌──────────┐  Does nothing. Fills a parameter slot.                      │
 * │  │  DUMMY   │  Example: new Object() passed but never used               │
 * │  └──────────┘                                                              │
 * │       │                                                                    │
 * │  ┌──────────┐  Returns fixed data. No logic.                              │
 * │  │   STUB   │  Example: getUser() always returns { name: 'Alice' }       │
 * │  └──────────┘                                                              │
 * │       │                                                                    │
 * │  ┌──────────┐  Records calls. Wraps real or fake function.                │
 * │  │   SPY    │  Example: Was sendEmail() called with 'bob@test.com'?      │
 * │  └──────────┘                                                              │
 * │       │                                                                    │
 * │  ┌──────────┐  Pre-programmed expectations + verification.                │
 * │  │   MOCK   │  Example: Expects save() called exactly once with {...}    │
 * │  └──────────┘                                                              │
 * │       │                                                                    │
 * │  ┌──────────┐  Working implementation (simplified).                       │
 * │  │   FAKE   │  Example: In-memory DB instead of real PostgreSQL          │
 * │  └──────────┘                                                              │
 * │                                                                             │
 * │  Complexity:  Dummy < Stub < Spy < Mock < Fake                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: The AAA Pattern (Arrange-Act-Assert) Deep Dive
// ============================================================================

const assert = require('assert');
const { describe, it, beforeEach, afterEach } = require('node:test');

describe('AAA Pattern - Detailed Examples', () => {

  // --- System under test ---
  const createUserValidator = () => ({
    validate: (user) => {
      const errors = [];
      if (!user.name || user.name.trim().length < 2) errors.push('Name must be at least 2 characters');
      if (!user.email || !user.email.includes('@')) errors.push('Valid email is required');
      if (user.age !== undefined && (user.age < 0 || user.age > 150)) errors.push('Age must be 0-150');
      if (user.password && user.password.length < 8) errors.push('Password must be at least 8 characters');
      return { valid: errors.length === 0, errors };
    },
  });

  // GOOD AAA: Clear separation of phases
  it('should validate a complete user successfully', () => {
    // ── ARRANGE ──
    const validator = createUserValidator();
    const validUser = {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      age: 30,
      password: 'securePass123',
    };

    // ── ACT ──
    const result = validator.validate(validUser);

    // ── ASSERT ──
    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.errors, []);
  });

  // GOOD: One assertion concept per test (may use multiple assert calls)
  it('should reject user with short name', () => {
    // Arrange
    const validator = createUserValidator();
    const user = { name: 'A', email: 'a@b.com' };

    // Act
    const result = validator.validate(user);

    // Assert
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.includes('Name must be at least 2 characters'));
  });

  it('should reject user with invalid email', () => {
    const validator = createUserValidator();
    const user = { name: 'Alice', email: 'not-an-email' };

    const result = validator.validate(user);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.includes('Valid email is required'));
  });

  it('should collect ALL validation errors at once', () => {
    const validator = createUserValidator();
    const badUser = { name: '', email: '', age: 200, password: '123' };

    const result = validator.validate(badUser);

    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.errors.length, 4); // All four rules violated
  });

  // BAD PATTERN: Multiple acts in one test (AVOID)
  // it('should validate name AND email AND age', () => {
  //   const result1 = validator.validate({ name: 'A' });     // Act 1
  //   assert.strictEqual(result1.valid, false);               // Assert 1
  //   const result2 = validator.validate({ email: 'bad' });   // Act 2
  //   assert.strictEqual(result2.valid, false);               // Assert 2
  //   // This test does too many things! Split into separate tests.
  // });
});

console.log('A:', 'AAA pattern deep dive complete');


// ============================================================================
// SECTION 2: All Five Test Doubles (Practical Examples)
// ============================================================================

describe('Test Doubles - All Five Types', () => {

  // --- System under test ---
  const createNotificationService = (db, emailSender, logger) => ({
    notifyUser: (userId, message) => {
      logger.info(`Notifying user ${userId}`);
      const user = db.findUser(userId);
      if (!user) throw new Error('User not found');
      const result = emailSender.send(user.email, message);
      logger.info(`Notification sent: ${result.messageId}`);
      return { sent: true, messageId: result.messageId };
    },
  });

  // 1. DUMMY - passed but never used
  it('should demonstrate a DUMMY', () => {
    // logger is required by the constructor but not relevant to this test
    const dummyLogger = { info: () => {}, error: () => {}, warn: () => {} };

    // We only care about db + emailSender behavior here
    const db = { findUser: () => ({ email: 'test@test.com' }) };
    const emailSender = { send: () => ({ messageId: 'msg-1' }) };

    const service = createNotificationService(db, emailSender, dummyLogger);
    const result = service.notifyUser(1, 'Hello');
    assert.strictEqual(result.sent, true);
    // dummyLogger was never inspected or verified - it's just filler
  });

  // 2. STUB - returns canned data
  it('should demonstrate a STUB', () => {
    const stubDb = {
      findUser: (id) => {
        // Returns FIXED data regardless of logic
        return { id, name: 'Stub User', email: 'stub@test.com' };
      },
    };

    const stubEmailSender = {
      send: () => ({ messageId: 'stub-msg-id', delivered: true }),
    };

    const dummyLogger = { info: () => {} };
    const service = createNotificationService(stubDb, stubEmailSender, dummyLogger);

    const result = service.notifyUser(42, 'Test');
    assert.strictEqual(result.messageId, 'stub-msg-id');
    // We don't check if stub was called - we only use its return value
  });

  // 3. SPY - records calls while executing
  it('should demonstrate a SPY', () => {
    const calls = [];
    const spyLogger = {
      info: (msg) => { calls.push(msg); }, // Records but also "works"
      error: () => {},
    };

    const stubDb = { findUser: () => ({ email: 'a@b.com' }) };
    const stubEmail = { send: () => ({ messageId: 'x' }) };

    const service = createNotificationService(stubDb, stubEmail, spyLogger);
    service.notifyUser(1, 'Hi');

    // SPY: Inspect what was recorded
    assert.strictEqual(calls.length, 2);
    assert.ok(calls[0].includes('Notifying user 1'));
    assert.ok(calls[1].includes('Notification sent'));
  });

  // 4. MOCK - stub + expectations verified after
  it('should demonstrate a MOCK', () => {
    let sendCalledWith = null;
    const mockEmailSender = {
      send: (email, message) => {
        sendCalledWith = { email, message };
        return { messageId: 'mock-123' };
      },
    };

    const stubDb = { findUser: () => ({ email: 'alice@test.com' }) };
    const dummyLogger = { info: () => {} };

    const service = createNotificationService(stubDb, mockEmailSender, dummyLogger);
    service.notifyUser(1, 'Important!');

    // MOCK verification: Was it called with the RIGHT args?
    assert.strictEqual(sendCalledWith.email, 'alice@test.com');
    assert.strictEqual(sendCalledWith.message, 'Important!');
  });

  // 5. FAKE - simplified working implementation
  it('should demonstrate a FAKE', () => {
    // Fake in-memory database (works like real DB but no persistence)
    const fakeDb = (() => {
      const users = new Map();
      users.set(1, { id: 1, name: 'Alice', email: 'alice@fake.com' });
      users.set(2, { id: 2, name: 'Bob', email: 'bob@fake.com' });
      return {
        findUser: (id) => users.get(id) || null,
        addUser: (user) => { users.set(user.id, user); },
        count: () => users.size,
      };
    })();

    const stubEmail = { send: () => ({ messageId: 'f-1' }) };
    const dummyLogger = { info: () => {} };

    const service = createNotificationService(fakeDb, stubEmail, dummyLogger);

    // Fake DB actually works with real logic (lookup by ID)
    const result = service.notifyUser(1, 'Hello Alice');
    assert.strictEqual(result.sent, true);

    // Non-existent user triggers real error flow
    assert.throws(() => service.notifyUser(999, 'Hi'), { message: 'User not found' });
  });
});

console.log('B:', 'All five test doubles demonstrated');


// ============================================================================
// SECTION 3: Fixtures (Reusable Test Data)
// ============================================================================

describe('Fixtures - Reusable Test Data', () => {

  // --- FIXTURE FACTORY: Creates fresh test data each time ---
  const createUserFixture = (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides, // Override specific fields as needed
  });

  const createOrderFixture = (overrides = {}) => ({
    id: 100,
    userId: 1,
    items: [
      { name: 'Widget', price: 10, qty: 2 },
      { name: 'Gadget', price: 25, qty: 1 },
    ],
    total: 45,
    status: 'pending',
    ...overrides,
  });

  // BENEFIT: Each test gets clean data, only specifies what matters
  it('should use default fixture for basic test', () => {
    const user = createUserFixture();
    assert.strictEqual(user.name, 'Test User');
    assert.strictEqual(user.active, true);
  });

  it('should override specific fields', () => {
    const adminUser = createUserFixture({ role: 'admin', name: 'Admin Alice' });
    assert.strictEqual(adminUser.role, 'admin');
    assert.strictEqual(adminUser.name, 'Admin Alice');
    assert.strictEqual(adminUser.email, 'test@example.com'); // Default preserved
  });

  it('should create independent fixture instances', () => {
    const user1 = createUserFixture({ name: 'Alice' });
    const user2 = createUserFixture({ name: 'Bob' });

    // Each is independent - modifying one doesn't affect the other
    user1.active = false;
    assert.strictEqual(user2.active, true); // Unaffected!
  });

  // --- FIXTURE COLLECTION: Multiple related fixtures ---
  const fixtures = {
    users: {
      admin: () => createUserFixture({ id: 1, name: 'Admin', role: 'admin' }),
      regular: () => createUserFixture({ id: 2, name: 'Regular', role: 'user' }),
      inactive: () => createUserFixture({ id: 3, name: 'Inactive', active: false }),
    },
    orders: {
      pending: () => createOrderFixture({ status: 'pending' }),
      shipped: () => createOrderFixture({ id: 101, status: 'shipped' }),
      cancelled: () => createOrderFixture({ id: 102, status: 'cancelled', total: 0 }),
    },
  };

  it('should use fixture collections for readable tests', () => {
    const admin = fixtures.users.admin();
    const order = fixtures.orders.pending();

    assert.strictEqual(admin.role, 'admin');
    assert.strictEqual(order.status, 'pending');
    assert.strictEqual(order.total, 45);
  });

  it('should combine fixtures for integration scenarios', () => {
    const user = fixtures.users.regular();
    const order = fixtures.orders.shipped();

    // Simulate a service that links user to order
    const enrichedOrder = { ...order, userName: user.name };
    assert.strictEqual(enrichedOrder.userName, 'Regular');
    assert.strictEqual(enrichedOrder.status, 'shipped');
  });
});

console.log('C:', 'Fixture patterns demonstrated');


// ============================================================================
// SECTION 4: Test Naming Conventions (READABILITY)
// ============================================================================

describe('Test Naming Best Practices', () => {

  const isEligibleForDiscount = (user) => {
    return user.active && user.orderCount >= 5 && user.memberSince < 2023;
  };

  // PATTERN 1: "should [expected behavior] when [condition]"
  it('should return true when user is active with 5+ orders since before 2023', () => {
    const user = { active: true, orderCount: 10, memberSince: 2020 };
    assert.strictEqual(isEligibleForDiscount(user), true);
  });

  it('should return false when user is inactive', () => {
    const user = { active: false, orderCount: 10, memberSince: 2020 };
    assert.strictEqual(isEligibleForDiscount(user), false);
  });

  it('should return false when user has fewer than 5 orders', () => {
    const user = { active: true, orderCount: 3, memberSince: 2020 };
    assert.strictEqual(isEligibleForDiscount(user), false);
  });

  it('should return false when user joined in 2023 or later', () => {
    const user = { active: true, orderCount: 10, memberSince: 2024 };
    assert.strictEqual(isEligibleForDiscount(user), false);
  });

  // PATTERN 2: Group by method, then by scenario
  // describe('#methodName()')
  //   describe('when valid input')
  //     it('should ...')
  //   describe('when invalid input')
  //     it('should ...')
});

console.log('D:', 'Test naming conventions demonstrated');


// ============================================================================
// SECTION 5: The F.I.R.S.T. Principles
// ============================================================================

describe('F.I.R.S.T. Principles', () => {

  // F - FAST: Tests should run in milliseconds
  it('FAST: no network calls, no disk I/O, no sleeps', () => {
    const start = Date.now();
    // Pure computation - blazing fast
    const result = Array.from({ length: 1000 }, (_, i) => i * 2).reduce((a, b) => a + b, 0);
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 100, `Test took ${elapsed}ms - too slow!`);
    assert.strictEqual(result, 999000);
  });

  // I - ISOLATED: Tests don't depend on each other
  let sharedState = 0;

  it('ISOLATED: test A increments state', () => {
    sharedState = 0; // Reset! Don't depend on previous test
    sharedState += 1;
    assert.strictEqual(sharedState, 1);
  });

  it('ISOLATED: test B also starts fresh', () => {
    sharedState = 0; // Reset again! Don't assume test A ran first
    sharedState += 5;
    assert.strictEqual(sharedState, 5);
  });

  // R - REPEATABLE: Same result every time, anywhere
  it('REPEATABLE: no random, no Date.now(), no env-dependent code', () => {
    // BAD: if (Date.now() % 2 === 0) ... (depends on time)
    // BAD: if (Math.random() > 0.5) ... (depends on randomness)
    // GOOD: Deterministic inputs and outputs
    const hash = (str) => {
      let h = 0;
      for (const ch of str) h = ((h << 5) - h + ch.charCodeAt(0)) | 0;
      return h;
    };
    assert.strictEqual(hash('hello'), hash('hello')); // Always same
  });

  // S - SELF-VALIDATING: Pass or fail, no manual inspection
  it('SELF-VALIDATING: assert tells you pass/fail automatically', () => {
    // BAD: console.log(result); // Then you manually check the output
    // GOOD: assert.strictEqual(result, expected); // Automatic!
    const result = 2 + 2;
    assert.strictEqual(result, 4); // Machine checks, not human eyes
  });

  // T - TIMELY: Written at the same time as the code (TDD ideal)
  it('TIMELY: write test BEFORE or WITH the code, not months later', () => {
    // TDD cycle: RED -> GREEN -> REFACTOR
    // 1. Write a failing test (RED)
    // 2. Write minimum code to pass (GREEN)
    // 3. Improve the code (REFACTOR)
    assert.ok(true, 'TDD concept acknowledged');
  });
});

console.log('E:', 'F.I.R.S.T. principles demonstrated');


// ============================================================================
// SECTION 6: Test Organization Patterns
// ============================================================================

describe('Test Organization - Given/When/Then', () => {

  const createBankAccount = (initialBalance = 0) => {
    let balance = initialBalance;
    const history = [];
    return {
      deposit: (amount) => {
        if (amount <= 0) throw new Error('Deposit must be positive');
        balance += amount;
        history.push({ type: 'deposit', amount, balance });
        return balance;
      },
      withdraw: (amount) => {
        if (amount <= 0) throw new Error('Withdrawal must be positive');
        if (amount > balance) throw new Error('Insufficient funds');
        balance -= amount;
        history.push({ type: 'withdrawal', amount, balance });
        return balance;
      },
      getBalance: () => balance,
      getHistory: () => [...history],
    };
  };

  // GIVEN/WHEN/THEN format (BDD style)
  describe('given an account with $100', () => {
    let account;

    beforeEach(() => {
      // GIVEN
      account = createBankAccount(100);
    });

    describe('when depositing $50', () => {
      it('then balance should be $150', () => {
        // WHEN
        account.deposit(50);
        // THEN
        assert.strictEqual(account.getBalance(), 150);
      });

      it('then history should record the deposit', () => {
        account.deposit(50);
        const history = account.getHistory();
        assert.strictEqual(history.length, 1);
        assert.strictEqual(history[0].type, 'deposit');
        assert.strictEqual(history[0].amount, 50);
      });
    });

    describe('when withdrawing $30', () => {
      it('then balance should be $70', () => {
        account.withdraw(30);
        assert.strictEqual(account.getBalance(), 70);
      });
    });

    describe('when withdrawing $200 (more than balance)', () => {
      it('then should throw Insufficient funds', () => {
        assert.throws(() => account.withdraw(200), { message: 'Insufficient funds' });
      });

      it('then balance should remain unchanged', () => {
        try { account.withdraw(200); } catch (e) { /* expected */ }
        assert.strictEqual(account.getBalance(), 100);
      });
    });
  });

  describe('given a new empty account', () => {
    it('then balance should be 0', () => {
      const account = createBankAccount();
      assert.strictEqual(account.getBalance(), 0);
    });

    it('then withdrawal should throw', () => {
      const account = createBankAccount();
      assert.throws(() => account.withdraw(1), { message: 'Insufficient funds' });
    });
  });
});

console.log('F:', 'Given/When/Then organization demonstrated');


// ============================================================================
// SECTION 7: Testing Error Paths (Negative Testing)
// ============================================================================

describe('Negative Testing Patterns', () => {

  const parseJSON = (input) => {
    if (typeof input !== 'string') throw new TypeError('Input must be a string');
    if (input.trim() === '') throw new SyntaxError('Empty input');
    try {
      return { success: true, data: JSON.parse(input) };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Happy path
  it('should parse valid JSON', () => {
    const result = parseJSON('{"name":"Alice"}');
    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.data, { name: 'Alice' });
  });

  // Error paths (often MORE important than happy path!)
  it('should throw TypeError for non-string input', () => {
    assert.throws(() => parseJSON(123), TypeError);
    assert.throws(() => parseJSON(null), TypeError);
    assert.throws(() => parseJSON(undefined), TypeError);
    assert.throws(() => parseJSON([]), TypeError);
  });

  it('should throw SyntaxError for empty string', () => {
    assert.throws(() => parseJSON(''), SyntaxError);
    assert.throws(() => parseJSON('   '), SyntaxError);
  });

  it('should return error object for invalid JSON', () => {
    const result = parseJSON('{invalid}');
    assert.strictEqual(result.success, false);
    assert.ok(result.error.length > 0);
  });

  // BOUNDARY: valid but tricky inputs
  it('should handle edge case JSON values', () => {
    assert.deepStrictEqual(parseJSON('null').data, null);
    assert.deepStrictEqual(parseJSON('0').data, 0);
    assert.deepStrictEqual(parseJSON('""').data, '');
    assert.deepStrictEqual(parseJSON('false').data, false);
    assert.deepStrictEqual(parseJSON('[]').data, []);
  });
});

console.log('G:', 'Negative testing patterns demonstrated');


// ============================================================================
// SECTION 8: Shared Setup Patterns (beforeEach vs Factory)
// ============================================================================

describe('Setup Patterns Comparison', () => {

  // PATTERN 1: beforeEach (good for identical setup)
  describe('Pattern 1: beforeEach', () => {
    let items;

    beforeEach(() => {
      items = ['apple', 'banana', 'cherry'];
    });

    it('should start with 3 items', () => {
      assert.strictEqual(items.length, 3);
    });

    it('should allow adding items (isolated)', () => {
      items.push('date');
      assert.strictEqual(items.length, 4);
    });

    it('should still have 3 items (fresh from beforeEach)', () => {
      assert.strictEqual(items.length, 3); // Not affected by previous test
    });
  });

  // PATTERN 2: Factory function (better for varied setup)
  describe('Pattern 2: Factory Function', () => {

    const createList = (initialItems = []) => {
      const items = [...initialItems];
      return {
        add: (item) => items.push(item),
        remove: (item) => {
          const idx = items.indexOf(item);
          if (idx >= 0) items.splice(idx, 1);
        },
        has: (item) => items.includes(item),
        count: () => items.length,
        all: () => [...items],
      };
    };

    it('should create empty list', () => {
      const list = createList();
      assert.strictEqual(list.count(), 0);
    });

    it('should create pre-filled list', () => {
      const list = createList(['a', 'b', 'c']);
      assert.strictEqual(list.count(), 3);
    });

    it('should create list with specific items for this test', () => {
      const list = createList(['x', 'y']);
      list.add('z');
      assert.strictEqual(list.count(), 3);
      assert.ok(list.has('z'));
    });

    // Factory is BETTER when each test needs DIFFERENT initial state
  });
});

console.log('H:', 'Setup patterns compared');


// ============================================================================
// SECTION 9: Test Coverage Concepts
// ============================================================================

describe('Code Coverage Concepts', () => {

  // Coverage measures HOW MUCH of your code is exercised by tests
  const calculateShippingCost = (weight, destination, express) => {
    let cost = 0;

    // Branch 1: weight tiers
    if (weight <= 1) cost = 5;                    // Line 1
    else if (weight <= 5) cost = 10;              // Line 2
    else if (weight <= 20) cost = 25;             // Line 3
    else cost = 50;                               // Line 4

    // Branch 2: destination multiplier
    if (destination === 'international') cost *= 3; // Line 5
    else if (destination === 'remote') cost *= 2;   // Line 6

    // Branch 3: express shipping
    if (express) cost += 15;                       // Line 7

    return cost;
  };

  // To get 100% branch coverage, we need tests for ALL paths:
  it('weight <= 1kg, domestic, standard', () => {
    assert.strictEqual(calculateShippingCost(0.5, 'domestic', false), 5);
  });

  it('weight 1-5kg, international, standard', () => {
    assert.strictEqual(calculateShippingCost(3, 'international', false), 30); // 10 * 3
  });

  it('weight 5-20kg, remote, express', () => {
    assert.strictEqual(calculateShippingCost(10, 'remote', true), 65); // 25 * 2 + 15
  });

  it('weight > 20kg, domestic, express', () => {
    assert.strictEqual(calculateShippingCost(25, 'domestic', true), 65); // 50 + 15
  });

  // COVERAGE TYPES:
  // - Line coverage:     Was each LINE executed? (weakest)
  // - Branch coverage:   Was each IF/ELSE path taken?
  // - Function coverage: Was each FUNCTION called?
  // - Statement coverage: Was each STATEMENT executed?
  //
  // RUN: node --test --experimental-test-coverage 03-test-patterns.js
  //
  // AIM: 80%+ coverage is a good target. 100% is often not worth the effort.
  // GOTCHA: High coverage != good tests! You can cover 100% with zero assertions.
});

console.log('I:', 'Coverage concepts demonstrated');


// ============================================================================
// SECTION 10: Best Practices Summary
// ============================================================================

describe('Best Practices Checklist', () => {

  // 1. One logical concept per test
  it('should test one thing only', () => {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    assert.strictEqual(sum([1, 2, 3]), 6);
    // Don't also test average, max, min in this same test!
  });

  // 2. Don't use logic in tests (no if/else, no loops)
  it('should avoid conditional logic in tests', () => {
    // BAD:
    // if (process.env.NODE_ENV === 'test') { ... }
    // for (const item of items) { assert(...) }

    // GOOD: Explicit, flat assertions
    const result = [1, 2, 3].map((x) => x * 2);
    assert.deepStrictEqual(result, [2, 4, 6]);
  });

  // 3. Test public API, not private internals
  it('should test the interface, not implementation', () => {
    // We test WHAT the function returns, not HOW it computes it
    const sort = (arr) => [...arr].sort((a, b) => a - b);
    assert.deepStrictEqual(sort([3, 1, 2]), [1, 2, 3]);
    // Don't test which sorting algorithm is used internally!
  });

  // 4. Use descriptive assertion messages
  it('should provide clear failure messages', () => {
    const price = 99.99;
    assert.ok(price > 0, `Price should be positive but got ${price}`);
    assert.ok(price < 10000, `Price should be reasonable but got ${price}`);
  });

  // 5. Avoid shared mutable state between tests
  it('should never depend on test execution order', () => {
    // Each test creates its own state
    const data = { count: 0 };
    data.count += 1;
    assert.strictEqual(data.count, 1);
    // Next test won't see this data object
  });
});

console.log('J:', 'Best practices checklist complete');
console.log('K:', 'All test patterns demonstrated!');

/**
 * OUTPUT:
 *   A: AAA pattern deep dive complete
 *   B: All five test doubles demonstrated
 *   C: Fixture patterns demonstrated
 *   D: Test naming conventions demonstrated
 *   E: F.I.R.S.T. principles demonstrated
 *   F: Given/When/Then organization demonstrated
 *   G: Negative testing patterns demonstrated
 *   H: Setup patterns compared
 *   I: Coverage concepts demonstrated
 *   J: Best practices checklist complete
 *   K: All test patterns demonstrated!
 *
 *   (When run with --test, you'll see node:test output for all suites)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ TEST PATTERNS CHEATSHEET                                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ AAA PATTERN:     Arrange → Act → Assert (every test)                    ║
 * ║ F.I.R.S.T:      Fast, Isolated, Repeatable, Self-validating, Timely    ║
 * ║                                                                          ║
 * ║ TEST DOUBLES:                                                            ║
 * ║   Dummy  → Fills a slot, never used                                     ║
 * ║   Stub   → Returns canned data                                         ║
 * ║   Spy    → Records calls + wraps real function                          ║
 * ║   Mock   → Stub + expectations + verification                           ║
 * ║   Fake   → Simplified working implementation                            ║
 * ║                                                                          ║
 * ║ FIXTURES:        Factory functions with overrides                        ║
 * ║ NAMING:          "should [behavior] when [condition]"                   ║
 * ║ COVERAGE:        Aim 80%+, branches > lines                            ║
 * ║ NEGATIVE TESTS:  Test error paths MORE than happy paths                 ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "I structure every test with the AAA pattern: Arrange inputs and state,   │
 * │  Act by calling the code under test, Assert expected outcomes. I follow   │
 * │  F.I.R.S.T. principles - tests must be Fast, Isolated, Repeatable,       │
 * │  Self-validating, and Timely. For test doubles, I use the right level:   │
 * │  dummies for unused params, stubs for canned data, spies to record       │
 * │  calls, mocks for behavior verification, and fakes for simplified        │
 * │  implementations like in-memory databases. I use fixture factories       │
 * │  with overrides for reusable test data, name tests descriptively with    │
 * │  'should X when Y', and organize with Given/When/Then blocks. I aim     │
 * │  for 80%+ branch coverage, prioritize negative testing, and never put   │
 * │  logic (if/else/loops) inside test cases."                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node --test docs/node/10-testing/03-test-patterns.js
 */
