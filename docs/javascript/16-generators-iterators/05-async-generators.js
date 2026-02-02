/**
 * GENERATORS & ITERATORS: 05 - Async Generators (async function*)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Async generators combine async/await with generators.                      ║
 * ║ They yield PROMISES and are consumed with for await...of                   ║
 * ║                                                                            ║
 * ║   async function* asyncGen() {                                             ║
 * ║     yield await fetchData();  // await + yield together!                   ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║   for await (const item of asyncGen()) { }                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE ASYNC GENERATORS - Real World Justification                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. PAGINATED API CALLS                                                      │
 * │    → Fetch pages one at a time                                              │
 * │    → Don't load all data upfront                                            │
 * │    → Process as you go                                                      │
 * │                                                                             │
 * │ 2. STREAMING DATA                                                           │
 * │    → WebSocket messages                                                     │
 * │    → Server-Sent Events                                                     │
 * │    → File streaming                                                         │
 * │                                                                             │
 * │ 3. DATABASE CURSORS                                                         │
 * │    → Process millions of records                                            │
 * │    → Without loading all into memory                                        │
 * │                                                                             │
 * │ 4. REAL-TIME FEEDS                                                          │
 * │    → Twitter/news feeds                                                     │
 * │    → Chat messages                                                          │
 * │    → Event streams                                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC ASYNC GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

// Helper to simulate async operation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function* simpleAsyncGen() {
  console.log('  Start');
  await delay(100);
  yield 1;

  console.log('  After first yield');
  await delay(100);
  yield 2;

  console.log('  After second yield');
  await delay(100);
  yield 3;
}

// Consume with for await...of
async function runBasic() {
  console.log('A: Async generator with for await...of:');

  for await (const value of simpleAsyncGen()) {
    console.log(`  Value: ${value}`);
  }

  console.log('  Done!');
}

runBasic();

/**
 * OUTPUT:
 *   A: Async generator with for await...of:
 *     Start
 *     Value: 1
 *     After first yield
 *     Value: 2
 *     After second yield
 *     Value: 3
 *     Done!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL: How Async Generators Work
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ASYNC GENERATOR FLOW                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   for await (const item of asyncGen()) { }                                  │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────┐               │
 * │   │ Iteration 1:                                            │               │
 * │   │                                                         │               │
 * │   │   1. Call .next() → Returns Promise                     │               │
 * │   │   2. await the Promise                                  │               │
 * │   │   3. Generator runs until yield                         │               │
 * │   │      (can await internally)                             │               │
 * │   │   4. Promise resolves with { value, done }              │               │
 * │   │   5. Loop body runs with value                          │               │
 * │   │                                                         │               │
 * │   └─────────────────────────────────────────────────────────┘               │
 * │                     │                                                       │
 * │                     ▼                                                       │
 * │   ┌─────────────────────────────────────────────────────────┐               │
 * │   │ Iteration 2:                                            │               │
 * │   │   (Same process repeats...)                             │               │
 * │   └─────────────────────────────────────────────────────────┘               │
 * │                     │                                                       │
 * │                     ▼                                                       │
 * │   ┌─────────────────────────────────────────────────────────┐               │
 * │   │ Final:                                                  │               │
 * │   │   done: true → Loop ends                                │               │
 * │   └─────────────────────────────────────────────────────────┘               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL: PAGINATED API
// ═══════════════════════════════════════════════════════════════════════════════

// Simulated API that returns paginated data
async function fetchPage(page) {
  await delay(50);  // Simulate network delay

  const allData = [
    'user1', 'user2', 'user3',  // Page 1
    'user4', 'user5', 'user6',  // Page 2
    'user7', 'user8'            // Page 3
  ];

  const pageSize = 3;
  const start = (page - 1) * pageSize;
  const items = allData.slice(start, start + pageSize);

  return {
    items,
    page,
    hasMore: start + pageSize < allData.length
  };
}

// Async generator for all users
async function* fetchAllUsers() {
  let page = 1;

  while (true) {
    console.log(`  Fetching page ${page}...`);
    const response = await fetchPage(page);

    for (const user of response.items) {
      yield user;
    }

    if (!response.hasMore) break;
    page++;
  }
}

async function runPaginated() {
  console.log('\nB: Paginated API with async generator:');

  for await (const user of fetchAllUsers()) {
    console.log(`  Got user: ${user}`);
  }

  console.log('  All users fetched!');
}

setTimeout(runPaginated, 500);

/**
 * OUTPUT:
 *   B: Paginated API with async generator:
 *     Fetching page 1...
 *     Got user: user1
 *     Got user: user2
 *     Got user: user3
 *     Fetching page 2...
 *     Got user: user4
 *     Got user: user5
 *     Got user: user6
 *     Fetching page 3...
 *     Got user: user7
 *     Got user: user8
 *     All users fetched!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL: POLLING WITH TIMEOUT
// ═══════════════════════════════════════════════════════════════════════════════

async function* poll(checkFn, intervalMs, maxAttempts = 10) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;
    const result = await checkFn();

    yield { attempt, result };

    if (result.done) return;

    await delay(intervalMs);
  }

  throw new Error('Max polling attempts reached');
}

// Simulated status check (completes on 3rd attempt)
let statusAttempt = 0;
async function checkJobStatus() {
  statusAttempt++;
  await delay(50);
  return {
    status: statusAttempt >= 3 ? 'complete' : 'pending',
    done: statusAttempt >= 3
  };
}

async function runPolling() {
  console.log('\nC: Polling with async generator:');

  try {
    for await (const { attempt, result } of poll(checkJobStatus, 100, 5)) {
      console.log(`  Attempt ${attempt}: ${result.status}`);
    }
    console.log('  Job completed!');
  } catch (e) {
    console.log('  Error:', e.message);
  }
}

setTimeout(runPolling, 1000);


// ═══════════════════════════════════════════════════════════════════════════════
// ASYNC GENERATOR WITH ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

async function* fetchWithRetry(urls) {
  for (const url of urls) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`  Fetching ${url} (attempt ${attempts})...`);
        await delay(50);

        // Simulate random failure
        if (url === 'fail.com' && attempts < 3) {
          throw new Error('Network error');
        }

        yield { url, data: `Data from ${url}` };
        break;

      } catch (error) {
        console.log(`  Error: ${error.message}`);
        if (attempts >= maxAttempts) {
          yield { url, error: error.message };
        }
        await delay(100);  // Wait before retry
      }
    }
  }
}

async function runWithRetry() {
  console.log('\nD: Async generator with retry:');

  const urls = ['api.com', 'fail.com', 'data.com'];

  for await (const result of fetchWithRetry(urls)) {
    if (result.error) {
      console.log(`  Failed: ${result.url} - ${result.error}`);
    } else {
      console.log(`  Success: ${result.data}`);
    }
  }
}

setTimeout(runWithRetry, 1500);


// ═══════════════════════════════════════════════════════════════════════════════
// MANUAL CONSUMPTION (without for await)
// ═══════════════════════════════════════════════════════════════════════════════

async function* asyncNumbers() {
  yield 1;
  await delay(50);
  yield 2;
  await delay(50);
  yield 3;
}

async function runManual() {
  console.log('\nE: Manual async iteration:');

  const gen = asyncNumbers();

  // .next() returns a Promise!
  let result = await gen.next();
  console.log(`  ${JSON.stringify(result)}`);

  result = await gen.next();
  console.log(`  ${JSON.stringify(result)}`);

  result = await gen.next();
  console.log(`  ${JSON.stringify(result)}`);

  result = await gen.next();
  console.log(`  ${JSON.stringify(result)}`);
}

setTimeout(runManual, 2500);

/**
 * OUTPUT:
 *   E: Manual async iteration:
 *     {"value":1,"done":false}
 *     {"value":2,"done":false}
 *     {"value":3,"done":false}
 *     {"done":true}
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Symbol.asyncIterator
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ASYNC ITERABLE PROTOCOL                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Just like Symbol.iterator for sync iterables,                               │
 * │ Symbol.asyncIterator defines async iterables.                               │
 * │                                                                             │
 * │ Async generators automatically implement this protocol.                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const asyncIterable = {
  data: [10, 20, 30],

  async *[Symbol.asyncIterator]() {
    for (const item of this.data) {
      await delay(50);
      yield item * 2;
    }
  }
};

async function runAsyncIterable() {
  console.log('\nF: Custom async iterable:');

  for await (const value of asyncIterable) {
    console.log(`  ${value}`);
  }
}

setTimeout(runAsyncIterable, 3000);

/**
 * OUTPUT:
 *   F: Custom async iterable:
 *     20
 *     40
 *     60
 */


// ═══════════════════════════════════════════════════════════════════════════════
// for await WITH REGULAR PROMISES
// ═══════════════════════════════════════════════════════════════════════════════

// for await works with arrays of promises too!
async function runPromiseArray() {
  console.log('\nG: for await with promise array:');

  const promises = [
    delay(100).then(() => 'first'),
    delay(50).then(() => 'second'),
    delay(150).then(() => 'third')
  ];

  // Note: Results come in ORDER, not completion time
  for await (const result of promises) {
    console.log(`  ${result}`);
  }
}

setTimeout(runPromiseArray, 3500);

/**
 * OUTPUT:
 *   G: for await with promise array:
 *     first
 *     second
 *     third
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Async generators combine generators with async/await. They use             │
 * │ 'async function*' syntax and are consumed with 'for await...of'.            │
 * │                                                                             │
 * │ Key characteristics:                                                        │
 * │ - Can use both yield and await                                              │
 * │ - .next() returns a Promise (not direct value)                              │
 * │ - Implement Symbol.asyncIterator protocol                                   │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │                                                                             │
 * │ 1. Paginated APIs - Fetch pages lazily, yield items one by one              │
 * │    async function* fetchAllUsers() {                                        │
 * │      while (hasMore) {                                                      │
 * │        const page = await fetchPage(pageNum++);                             │
 * │        yield* page.items;                                                   │
 * │      }                                                                      │
 * │    }                                                                        │
 * │                                                                             │
 * │ 2. Streaming data - WebSockets, SSE, file streams                           │
 * │                                                                             │
 * │ 3. Database cursors - Process large result sets without memory issues       │
 * │                                                                             │
 * │ 4. Polling - Repeatedly check status with delays                            │
 * │                                                                             │
 * │ Benefits over traditional approaches:                                       │
 * │ - Memory efficient (lazy evaluation)                                        │
 * │ - Clean syntax (no callback pyramids)                                       │
 * │ - Built-in backpressure (consumer controls pace)                            │
 * │ - Error handling with try/catch"                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/05-async-generators.js
 */
