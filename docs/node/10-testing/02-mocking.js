/**
 * TOPIC 02: Mocking Techniques in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ A mock REPLACES a real dependency with a CONTROLLABLE FAKE.              ║
 * ║ You mock what you DON'T want to test - databases, APIs, file system.    ║
 * ║ If you mock everything, you test nothing. Mock at the BOUNDARY.         ║
 * ║                                                                          ║
 * ║   Mock   = Fake object with pre-programmed behavior + assertions        ║
 * ║   Stub   = Returns fixed data (no behavior verification)               ║
 * ║   Spy    = Wraps real function, records calls (real code still runs)    ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Imagine you're a MOVIE DIRECTOR testing a car chase scene:               │
 * │                                                                             │
 * │    - MOCK: Use a foam rubber car that LOOKS real but isn't.               │
 * │      You control exactly how it "crashes." You verify the stunt          │
 * │      actor reacted correctly to the crash. (Fake + Verification)         │
 * │                                                                             │
 * │    - STUB: Use a parked car as background scenery. It just SITS THERE    │
 * │      returning "I am a car." No one checks if it was driven.             │
 * │      (Fake data, no verification)                                        │
 * │                                                                             │
 * │    - SPY: Use a REAL car with hidden cameras. The car drives for real,   │
 * │      but you RECORD everything - speed, turns, braking.                  │
 * │      (Real behavior + Recording)                                         │
 * │                                                                             │
 * │  You don't need a real highway to test the scene.                        │
 * │  You don't need a real database to test your service layer.              │
 * │                                                                             │
 * │  "Fake the world around the code you're testing."                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: MOCK vs STUB vs SPY                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  STUB (Simplest):                                                          │
 * │  ┌──────────┐     ┌──────────────────┐                                    │
 * │  │  Code    │────>│  Stub: always    │                                    │
 * │  │  Under   │     │  returns { ok }  │     No verification               │
 * │  │  Test    │<────│                  │                                    │
 * │  └──────────┘     └──────────────────┘                                    │
 * │                                                                             │
 * │  MOCK (Stub + Verification):                                               │
 * │  ┌──────────┐     ┌──────────────────┐                                    │
 * │  │  Code    │────>│  Mock: returns   │                                    │
 * │  │  Under   │     │  { ok } AND      │     Was it called?                │
 * │  │  Test    │<────│  records calls   │───> With right args?              │
 * │  └──────────┘     └──────────────────┘     How many times?               │
 * │                                                                             │
 * │  SPY (Wraps Real):                                                         │
 * │  ┌──────────┐     ┌──────────────────┐                                    │
 * │  │  Code    │────>│  Spy: calls REAL │                                    │
 * │  │  Under   │     │  function but    │     Records everything            │
 * │  │  Test    │<────│  records calls   │───> Real result returned           │
 * │  └──────────┘     └──────────────────┘                                    │
 * │                                                                             │
 * │  When to use what:                                                         │
 * │  ┌────────┬────────────────────┬──────────────────────┐                   │
 * │  │ Type   │ Returns fake data? │ Verifies calls?      │                   │
 * │  ├────────┼────────────────────┼──────────────────────┤                   │
 * │  │ Stub   │ YES                │ NO                   │                   │
 * │  │ Mock   │ YES                │ YES                  │                   │
 * │  │ Spy    │ NO (real code)     │ YES                  │                   │
 * │  └────────┴────────────────────┴──────────────────────┘                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECTION 1: Building a Spy (From Scratch - No Libraries)
// ============================================================================

const assert = require('assert');
const { describe, it, beforeEach } = require('node:test');

// --- A spy wraps a real function and records calls ---
const createSpy = (fn = () => {}) => {
  const calls = [];

  const spy = (...args) => {
    const result = fn(...args);
    calls.push({ args, result, timestamp: Date.now() });
    return result;
  };

  spy.calls = calls;
  spy.callCount = () => calls.length;
  spy.calledWith = (...expectedArgs) =>
    calls.some((c) => JSON.stringify(c.args) === JSON.stringify(expectedArgs));
  spy.lastCall = () => calls[calls.length - 1];
  spy.reset = () => (calls.length = 0);

  return spy;
};

// --- Testing the spy itself ---
const add = (a, b) => a + b;
const spiedAdd = createSpy(add);

spiedAdd(2, 3);
spiedAdd(10, 20);

assert.strictEqual(spiedAdd.callCount(), 2);
assert.strictEqual(spiedAdd.calledWith(2, 3), true);
assert.strictEqual(spiedAdd.calledWith(99, 99), false);
assert.deepStrictEqual(spiedAdd.lastCall().args, [10, 20]);
assert.strictEqual(spiedAdd.lastCall().result, 30);

console.log('A:', 'Custom spy built and verified - callCount:', spiedAdd.callCount());


// ============================================================================
// SECTION 2: Building a Stub (Returns Fixed Data)
// ============================================================================

// --- A stub replaces a function with one that returns predetermined data ---
const createStub = (returnValue) => {
  const calls = [];

  const stub = (...args) => {
    calls.push({ args });
    if (typeof returnValue === 'function') return returnValue(...args);
    return returnValue;
  };

  stub.calls = calls;
  stub.callCount = () => calls.length;
  stub.returns = (value) => { returnValue = value; return stub; };
  stub.throws = (error) => {
    returnValue = () => { throw error; };
    return stub;
  };

  return stub;
};

// Stub that always returns fixed data
const fetchUserStub = createStub({ id: 1, name: 'Alice', role: 'admin' });

const result1 = fetchUserStub(1);
const result2 = fetchUserStub(999); // Returns same thing regardless of input!

assert.deepStrictEqual(result1, { id: 1, name: 'Alice', role: 'admin' });
assert.deepStrictEqual(result2, { id: 1, name: 'Alice', role: 'admin' });
assert.strictEqual(fetchUserStub.callCount(), 2);

console.log('B:', 'Stub returns fixed data regardless of input');

// Stub that changes return value
const configStub = createStub('development');
assert.strictEqual(configStub(), 'development');

configStub.returns('production');
assert.strictEqual(configStub(), 'production');

console.log('C:', 'Stub return value can be changed dynamically');


// ============================================================================
// SECTION 3: Building a Mock (Stub + Expectations)
// ============================================================================

// --- A mock has pre-programmed expectations about how it will be used ---
const createMock = (name = 'mock') => {
  const expectations = [];
  const calls = [];

  const mock = (...args) => {
    calls.push({ args });
    // Find matching expectation
    for (const exp of expectations) {
      if (JSON.stringify(exp.args) === JSON.stringify(args)) {
        exp.called = true;
        exp.callCount = (exp.callCount || 0) + 1;
        if (exp.error) throw exp.error;
        return exp.returnValue;
      }
    }
    return undefined;
  };

  mock.expects = (args) => {
    const expectation = {
      args,
      called: false,
      callCount: 0,
      returnValue: undefined,
      error: null,
    };
    expectations.push(expectation);
    return {
      returns: (value) => { expectation.returnValue = value; return mock; },
      throws: (err) => { expectation.error = err; return mock; },
    };
  };

  mock.verify = () => {
    for (const exp of expectations) {
      if (!exp.called) {
        throw new Error(
          `${name}: Expected call with args ${JSON.stringify(exp.args)} was never made`
        );
      }
    }
    return true;
  };

  mock.calls = calls;
  mock.callCount = () => calls.length;

  return mock;
};

// --- Using the mock ---
const dbMock = createMock('database');

// Set up expectations BEFORE running the code
dbMock.expects([1]).returns({ id: 1, name: 'Alice' });
dbMock.expects([2]).returns({ id: 2, name: 'Bob' });

// The code under test calls the mock
const user1 = dbMock(1);
const user2 = dbMock(2);

assert.deepStrictEqual(user1, { id: 1, name: 'Alice' });
assert.deepStrictEqual(user2, { id: 2, name: 'Bob' });

// Verify ALL expectations were met
assert.ok(dbMock.verify());

console.log('D:', 'Mock with expectations verified successfully');


// ============================================================================
// SECTION 4: Node.js Built-in Mock (node:test mock - Node 19.1+)
// ============================================================================

const { mock } = require('node:test');

describe('node:test Built-in Mock', () => {

  it('should create a basic mock function', () => {
    const fn = mock.fn();

    fn('hello');
    fn('world');

    assert.strictEqual(fn.mock.callCount(), 2);
    assert.deepStrictEqual(fn.mock.calls[0].arguments, ['hello']);
    assert.deepStrictEqual(fn.mock.calls[1].arguments, ['world']);
  });

  it('should mock with implementation', () => {
    const fn = mock.fn((x) => x * 2);

    assert.strictEqual(fn(5), 10);
    assert.strictEqual(fn(3), 6);
    assert.strictEqual(fn.mock.callCount(), 2);
  });

  it('should mock and restore methods on objects', () => {
    const calculator = {
      add: (a, b) => a + b,
      multiply: (a, b) => a * b,
    };

    // Mock the add method
    mock.method(calculator, 'add', () => 999);

    assert.strictEqual(calculator.add(2, 3), 999); // Mocked!
    assert.strictEqual(calculator.add.mock.callCount(), 1);

    // Restore original
    calculator.add.mock.restore();
    assert.strictEqual(calculator.add(2, 3), 5); // Original!
  });
});

console.log('E:', 'node:test built-in mock demonstrated');


// ============================================================================
// SECTION 5: Mocking Dependencies (Dependency Injection Pattern)
// ============================================================================

describe('Mocking via Dependency Injection', () => {

  // --- The service depends on a database and an email sender ---
  const createOrderService = (db, emailService) => ({
    placeOrder: (userId, items) => {
      // 1. Save order to DB
      const order = db.save('orders', {
        userId,
        items,
        total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
        status: 'pending',
        createdAt: Date.now(),
      });

      // 2. Send confirmation email
      emailService.send(userId, `Order #${order.id} confirmed! Total: $${order.total}`);

      return order;
    },

    getOrder: (orderId) => {
      const order = db.findById('orders', orderId);
      if (!order) throw new Error('Order not found');
      return order;
    },
  });

  it('should place an order using mocked DB and email', () => {
    // ARRANGE: Create mocked dependencies
    const mockDB = {
      save: createSpy((table, data) => ({ id: 42, ...data })),
      findById: createSpy(() => null),
    };

    const mockEmail = {
      send: createSpy(() => ({ delivered: true })),
    };

    const orderService = createOrderService(mockDB, mockEmail);

    // ACT
    const order = orderService.placeOrder('user-1', [
      { name: 'Widget', price: 10, qty: 2 },
      { name: 'Gadget', price: 25, qty: 1 },
    ]);

    // ASSERT: Verify the result
    assert.strictEqual(order.id, 42);
    assert.strictEqual(order.total, 45);
    assert.strictEqual(order.status, 'pending');

    // ASSERT: Verify DB was called correctly
    assert.strictEqual(mockDB.save.callCount(), 1);
    assert.strictEqual(mockDB.save.lastCall().args[0], 'orders');

    // ASSERT: Verify email was sent
    assert.strictEqual(mockEmail.send.callCount(), 1);
    assert.ok(mockEmail.send.calledWith('user-1', 'Order #42 confirmed! Total: $45'));
  });

  it('should throw when order not found', () => {
    const mockDB = {
      save: createSpy(),
      findById: createSpy(() => null), // Stub returns null
    };
    const mockEmail = { send: createSpy() };

    const orderService = createOrderService(mockDB, mockEmail);

    assert.throws(() => orderService.getOrder(999), {
      message: 'Order not found',
    });

    // Verify DB was queried
    assert.strictEqual(mockDB.findById.callCount(), 1);
    // Verify email was NOT sent
    assert.strictEqual(mockEmail.send.callCount(), 0);
  });
});

console.log('F:', 'Dependency injection mocking pattern demonstrated');


// ============================================================================
// SECTION 6: Mocking Timers (setTimeout, setInterval, Date.now)
// ============================================================================

describe('Mocking Timers', () => {

  // --- Function that depends on time ---
  const createCache = (ttlMs) => {
    const store = new Map();
    return {
      set: (key, value) => {
        store.set(key, { value, createdAt: Date.now() });
      },
      get: (key) => {
        const entry = store.get(key);
        if (!entry) return null;
        if (Date.now() - entry.createdAt > ttlMs) {
          store.delete(key);
          return null; // Expired
        }
        return entry.value;
      },
      size: () => store.size,
    };
  };

  // TECHNIQUE: Mock Date.now to control time
  it('should expire cache entries after TTL', () => {
    let fakeTime = 1000;
    const originalNow = Date.now;
    Date.now = () => fakeTime; // MOCK Date.now!

    const cache = createCache(5000); // 5 second TTL

    cache.set('key1', 'value1');
    assert.strictEqual(cache.get('key1'), 'value1'); // Not expired

    fakeTime += 3000; // Advance 3 seconds
    assert.strictEqual(cache.get('key1'), 'value1'); // Still valid

    fakeTime += 3000; // Advance 3 more (total 6 seconds > 5 TTL)
    assert.strictEqual(cache.get('key1'), null); // Expired!

    Date.now = originalNow; // RESTORE! (Critical - always clean up mocks)
  });

  // TECHNIQUE: Using node:test mock.timers (Node 20+)
  it('should demonstrate timer control concept', () => {
    // In Node 20+, you can use:
    // mock.timers.enable({ apis: ['setTimeout', 'Date'] });
    // mock.timers.tick(5000);  // Advance time by 5 seconds
    // mock.timers.reset();

    // Manual approach works everywhere:
    const callbacks = [];
    const fakeSetTimeout = (fn, ms) => {
      callbacks.push({ fn, ms });
    };

    // Code under test uses our fake setTimeout
    fakeSetTimeout(() => 'done!', 1000);

    assert.strictEqual(callbacks.length, 1);
    assert.strictEqual(callbacks[0].ms, 1000);
    assert.strictEqual(callbacks[0].fn(), 'done!');
  });
});

console.log('G:', 'Timer mocking techniques demonstrated');


// ============================================================================
// SECTION 7: Mocking HTTP Requests (Fetch/Axios Patterns)
// ============================================================================

describe('Mocking HTTP Requests', () => {

  // --- Service that fetches data from an external API ---
  const createWeatherService = (httpClient) => ({
    getTemperature: async (city) => {
      const data = await httpClient.get(`/weather?city=${city}`);
      if (!data || data.error) throw new Error(`Weather data unavailable for ${city}`);
      return { city, temp: data.temp, unit: 'celsius' };
    },
    getForecast: async (city, days) => {
      const data = await httpClient.get(`/forecast?city=${city}&days=${days}`);
      return data.forecast || [];
    },
  });

  it('should return temperature using mocked HTTP client', async () => {
    // Mock HTTP client - no real network calls!
    const mockHttp = {
      get: createSpy(async (url) => {
        if (url.includes('city=London')) return { temp: 15, humidity: 70 };
        if (url.includes('city=Tokyo')) return { temp: 28, humidity: 60 };
        return { error: 'City not found' };
      }),
    };

    const weather = createWeatherService(mockHttp);

    const london = await weather.getTemperature('London');
    assert.deepStrictEqual(london, { city: 'London', temp: 15, unit: 'celsius' });

    const tokyo = await weather.getTemperature('Tokyo');
    assert.deepStrictEqual(tokyo, { city: 'Tokyo', temp: 28, unit: 'celsius' });

    // Verify HTTP calls were made
    assert.strictEqual(mockHttp.get.callCount(), 2);
  });

  it('should throw for unavailable city', async () => {
    const mockHttp = {
      get: createSpy(async () => ({ error: 'Not found' })),
    };

    const weather = createWeatherService(mockHttp);

    await assert.rejects(
      () => weather.getTemperature('Atlantis'),
      { message: 'Weather data unavailable for Atlantis' }
    );
  });

  it('should handle network errors gracefully', async () => {
    const mockHttp = {
      get: createSpy(async () => { throw new Error('Network timeout'); }),
    };

    const weather = createWeatherService(mockHttp);

    await assert.rejects(
      () => weather.getTemperature('London'),
      { message: 'Network timeout' }
    );
  });
});

console.log('H:', 'HTTP request mocking demonstrated');


// ============================================================================
// SECTION 8: Mocking Modules (CommonJS Pattern)
// ============================================================================

describe('Module Mocking Patterns', () => {

  // TECHNIQUE 1: Factory function (best for CommonJS)
  // Instead of:  const fs = require('fs');
  // Do:          const createService = (fs) => { ... }

  it('should mock file system operations via DI', () => {
    const mockFs = {
      readFileSync: createSpy((path) => {
        if (path === '/config.json') return '{"port": 3000}';
        throw new Error('File not found');
      }),
      writeFileSync: createSpy(() => undefined),
      existsSync: createSpy((path) => path === '/config.json'),
    };

    // Service that uses fs
    const loadConfig = (fs) => {
      if (!fs.existsSync('/config.json')) throw new Error('Config missing');
      const raw = fs.readFileSync('/config.json');
      return JSON.parse(raw);
    };

    const config = loadConfig(mockFs);
    assert.deepStrictEqual(config, { port: 3000 });
    assert.strictEqual(mockFs.readFileSync.callCount(), 1);
    assert.strictEqual(mockFs.existsSync.callCount(), 1);
  });

  // TECHNIQUE 2: Monkey-patching require cache (advanced)
  it('should demonstrate require cache manipulation concept', () => {
    // In real code, you can override cached modules:
    // const original = require('./myModule');
    // require.cache[require.resolve('./myModule')].exports = mockModule;
    //
    // After test:
    // delete require.cache[require.resolve('./myModule')];
    //
    // This is FRAGILE - prefer dependency injection instead!

    assert.ok(true, 'require cache concept acknowledged');
  });

  // TECHNIQUE 3: Proxy pattern for partial mocking
  it('should partially mock an object using Proxy', () => {
    const realMath = {
      add: (a, b) => a + b,
      multiply: (a, b) => a * b,
      random: () => Math.random(),
    };

    // Only mock .random(), keep add/multiply real
    const mockedMath = new Proxy(realMath, {
      get(target, prop) {
        if (prop === 'random') return () => 0.5; // Deterministic!
        return target[prop]; // Everything else is real
      },
    });

    assert.strictEqual(mockedMath.add(2, 3), 5);       // Real
    assert.strictEqual(mockedMath.multiply(4, 5), 20);  // Real
    assert.strictEqual(mockedMath.random(), 0.5);        // Mocked!
    assert.strictEqual(mockedMath.random(), 0.5);        // Always 0.5
  });
});

console.log('I:', 'Module mocking patterns demonstrated');


// ============================================================================
// SECTION 9: Common Mocking Mistakes (INTERVIEW GOTCHAS)
// ============================================================================

describe('Mocking Anti-Patterns and Gotchas', () => {

  // MISTAKE 1: Over-mocking - mocking the thing you're testing
  it('GOTCHA: do not mock what you are testing', () => {
    // BAD: Mocking the function you want to test
    // const add = mock.fn(() => 5);
    // assert.strictEqual(add(2, 3), 5); // Proves nothing! You told it to return 5!

    // GOOD: Mock the DEPENDENCY, test the real function
    const realAdd = (a, b) => a + b;
    assert.strictEqual(realAdd(2, 3), 5); // Real test!
  });

  // MISTAKE 2: Forgetting to restore mocks
  it('GOTCHA: always restore mocks after test', () => {
    const obj = { getValue: () => 'real' };

    // Save original
    const original = obj.getValue;
    obj.getValue = () => 'mocked';

    assert.strictEqual(obj.getValue(), 'mocked');

    // RESTORE! If you forget, other tests see the mock
    obj.getValue = original;
    assert.strictEqual(obj.getValue(), 'real');
  });

  // MISTAKE 3: Testing implementation instead of behavior
  it('GOTCHA: test behavior, not implementation details', () => {
    // BAD: Testing HOW it works (brittle)
    // assert.strictEqual(mockDb.save.calls[0].args[0], 'users');
    // assert.strictEqual(mockDb.save.calls[0].args[1].name, 'Alice');

    // GOOD: Testing WHAT it produces (resilient)
    const createUser = (db) => {
      db.save({ name: 'Alice', role: 'user' });
      return { success: true };
    };

    const mockDb = { save: createSpy(() => {}) };
    const result = createUser(mockDb);

    // Test the OUTPUT, not the internal calls
    assert.deepStrictEqual(result, { success: true });
    // Only verify the mock was called (not exact args unless critical)
    assert.strictEqual(mockDb.save.callCount(), 1);
  });

  // MISTAKE 4: Mocking too many layers deep
  it('GOTCHA: mock at the boundary, not deep internals', () => {
    // BAD chain:  mock(serviceA.methodX.helperY.utilZ)
    // GOOD: mock(externalDependency) and let internal code run for real

    // If you find yourself mocking 3+ levels deep, your code needs refactoring!
    assert.ok(true, 'Mock at boundaries concept acknowledged');
  });
});

console.log('J:', 'Mocking anti-patterns and gotchas covered');
console.log('K:', 'All mocking concepts demonstrated!');

/**
 * OUTPUT:
 *   A: Custom spy built and verified - callCount: 2
 *   B: Stub returns fixed data regardless of input
 *   C: Stub return value can be changed dynamically
 *   D: Mock with expectations verified successfully
 *   E: node:test built-in mock demonstrated
 *   F: Dependency injection mocking pattern demonstrated
 *   G: Timer mocking techniques demonstrated
 *   H: HTTP request mocking demonstrated
 *   I: Module mocking patterns demonstrated
 *   J: Mocking anti-patterns and gotchas covered
 *   K: All mocking concepts demonstrated!
 *
 *   (When run with --test, you'll also see node:test output)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ MOCKING CHEATSHEET                                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ TYPES:                                                                   ║
 * ║   Stub  → Returns fixed data, no verification                          ║
 * ║   Spy   → Wraps real function, records calls                            ║
 * ║   Mock  → Stub + pre-programmed expectations + verification             ║
 * ║                                                                          ║
 * ║ NODE:TEST BUILT-IN (Node 19.1+):                                        ║
 * ║   mock.fn()              → Create mock function                         ║
 * ║   mock.fn(impl)          → Mock with implementation                     ║
 * ║   mock.method(obj, name) → Mock object method                          ║
 * ║   fn.mock.callCount()    → Number of calls                             ║
 * ║   fn.mock.calls           → Array of call info                          ║
 * ║   fn.mock.restore()      → Restore original                            ║
 * ║                                                                          ║
 * ║ PATTERNS:                                                                ║
 * ║   Dependency Injection  → Pass deps as params (BEST)                   ║
 * ║   Factory Functions     → createService(db, email) => { ... }          ║
 * ║   Proxy Pattern         → Partial mocking with JS Proxy                ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Mocking replaces real dependencies with controllable fakes to isolate    │
 * │  the code under test. There are three types: stubs return fixed data      │
 * │  without verification, spies wrap real functions while recording calls,   │
 * │  and mocks combine both with pre-programmed expectations. I prefer        │
 * │  dependency injection for testability - passing db and email services     │
 * │  as parameters rather than importing them directly. Node.js 19+ has      │
 * │  built-in mock support via node:test with mock.fn() and mock.method().   │
 * │  Key principles: mock at the boundary (not deep internals), always       │
 * │  restore mocks after tests, test behavior not implementation details,    │
 * │  and never mock the thing you're actually testing."                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node --test docs/node/10-testing/02-mocking.js
 */
