/**
 * TOPIC 10: Race Conditions in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Race conditions occur when the outcome depends on the ORDER of async    ║
 * ║ operations. Even single-threaded JS has them! With worker threads,      ║
 * ║ shared memory adds classical data races. Prevention: Atomics, locks,   ║
 * ║ queues, and careful async design.                                       ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Two people share a BANK ACCOUNT with $100:                               │
 * │                                                                            │
 * │  Person A: reads balance ($100), plans to withdraw $80                    │
 * │  Person B: reads balance ($100), plans to withdraw $50                    │
 * │  Person A: writes $100 - $80 = $20 ✓                                     │
 * │  Person B: writes $100 - $50 = $50 ✓  (WRONG! Should be $20 - $50 = -$30)│
 * │                                                                            │
 * │  Both read STALE data. The fix: a LOCK that prevents concurrent access.  │
 * │  In single-threaded Node, the same happens with async read-modify-write. │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Race Condition Timeline                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  TIME →   t1         t2          t3         t4                            │
 * │                                                                            │
 * │  Async A: read(100)  ─────────── write(20)                                │
 * │  Async B:            read(100)   ────────── write(50)  ← WRONG!          │
 * │                                                                            │
 * │  Expected: 100 → 20 → -30 (overdraft error)                              │
 * │  Actual:   100 → 20 → 50  (race condition, money appeared!)              │
 * │                                                                            │
 * │  FIX with queue/lock:                                                      │
 * │  Async A: [LOCK] read(100) → write(20) [UNLOCK]                          │
 * │  Async B:                               [LOCK] read(20) → error [UNLOCK] │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── 1. Async Race Condition (single-threaded!) ───
console.log('A:', '=== Async Race Condition Demo ===');

let balance = 100;

const readBalance = () => new Promise(resolve =>
  setTimeout(() => resolve(balance), 10)
);

const writeBalance = (val) => new Promise(resolve =>
  setTimeout(() => { balance = val; resolve(); }, 10)
);

async function withdraw(amount, person) {
  const current = await readBalance(); // both read 100
  console.log(`B: ${person} reads balance: $${current}`);
  if (current >= amount) {
    await writeBalance(current - amount);
    console.log(`C: ${person} withdrew $${amount}, new balance: $${balance}`);
  } else {
    console.log(`C: ${person} DENIED - insufficient funds`);
  }
}

// Both fire at the same time - RACE CONDITION!
Promise.all([
  withdraw(80, 'Alice'),
  withdraw(50, 'Bob')
]).then(() => {
  console.log('D:', `Final balance: $${balance} (should be negative or denied, but got $${balance}!)`);

  // ─── 2. Fix: Async Mutex / Queue ───
  console.log('E:', '=== Fix: Async Mutex ===');

  class AsyncMutex {
    constructor() {
      this._queue = [];
      this._locked = false;
    }

    async acquire() {
      return new Promise(resolve => {
        if (!this._locked) {
          this._locked = true;
          resolve();
        } else {
          this._queue.push(resolve);
        }
      });
    }

    release() {
      if (this._queue.length > 0) {
        const next = this._queue.shift();
        next();
      } else {
        this._locked = false;
      }
    }
  }

  const mutex = new AsyncMutex();
  balance = 100; // reset

  async function safeWithdraw(amount, person) {
    await mutex.acquire();
    try {
      const current = await readBalance();
      console.log(`F: ${person} reads balance: $${current}`);
      if (current >= amount) {
        await writeBalance(current - amount);
        console.log(`G: ${person} withdrew $${amount}, new balance: $${balance}`);
      } else {
        console.log(`G: ${person} DENIED - insufficient funds ($${current} < $${amount})`);
      }
    } finally {
      mutex.release();
    }
  }

  return Promise.all([
    safeWithdraw(80, 'Alice'),
    safeWithdraw(50, 'Bob')
  ]);
}).then(() => {
  console.log('H:', `Final balance with mutex: $${balance} (correct!)`);

  // ─── 3. SharedArrayBuffer Race Condition ───
  console.log('I:', '=== Shared Memory Race Condition ===');

  const { Worker, isMainThread } = require('worker_threads');

  const sharedBuf = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  const sharedArr = new Int32Array(sharedBuf);
  sharedArr[0] = 0;

  // Unsafe: non-atomic increment (demonstrates the concept)
  console.log('J:', 'Without Atomics: counter++ is NOT atomic (read-modify-write)');
  console.log('K:', 'Thread A reads 5, Thread B reads 5, both write 6 → lost update!');

  // Safe: Atomics
  console.log('L:', 'With Atomics.add(): operation is atomic, no lost updates');
  Atomics.store(sharedArr, 0, 0);
  for (let i = 0; i < 1000; i++) {
    Atomics.add(sharedArr, 0, 1);
  }
  console.log('M:', `1000 atomic increments = ${Atomics.load(sharedArr, 0)} (always 1000)`);

  // ─── 4. Common Node.js Race Condition Patterns ───
  console.log('N:', '=== Common Race Condition Patterns ===');
  console.log('O:', 'Pattern 1: Check-then-act (if file exists → read file)');
  console.log('P:', 'Pattern 2: Read-modify-write (read balance → subtract → write)');
  console.log('Q:', 'Pattern 3: Multiple async ops assuming order');
  console.log('R:', 'Pattern 4: Shared state between request handlers');

  // ─── 5. Prevention Strategies ───
  console.log('S:', '=== Prevention Strategies ===');
  console.log('T:', '1. Async Mutex/Semaphore for async critical sections');
  console.log('U:', '2. Atomics for SharedArrayBuffer operations');
  console.log('V:', '3. Database transactions for DB operations');
  console.log('W:', '4. Idempotent operations (safe to retry)');
  console.log('X:', '5. Optimistic locking (version checks)');
});

/**
 * OUTPUT:
 *   A: === Async Race Condition Demo ===
 *   B: Alice reads balance: $100
 *   B: Bob reads balance: $100
 *   C: Alice withdrew $80, new balance: $20
 *   C: Bob withdrew $50, new balance: $50
 *   D: Final balance: $50 (should be negative or denied, but got $50!)
 *   E: === Fix: Async Mutex ===
 *   F: Alice reads balance: $100
 *   G: Alice withdrew $80, new balance: $20
 *   F: Bob reads balance: $20
 *   G: Bob DENIED - insufficient funds ($20 < $50)
 *   H: Final balance with mutex: $20 (correct!)
 *   I: === Shared Memory Race Condition ===
 *   J: Without Atomics: counter++ is NOT atomic (read-modify-write)
 *   K: Thread A reads 5, Thread B reads 5, both write 6 → lost update!
 *   L: With Atomics.add(): operation is atomic, no lost updates
 *   M: 1000 atomic increments = 1000 (always 1000)
 *   N: === Common Race Condition Patterns ===
 *   O: Pattern 1: Check-then-act (if file exists → read file)
 *   P: Pattern 2: Read-modify-write (read balance → subtract → write)
 *   Q: Pattern 3: Multiple async ops assuming order
 *   R: Pattern 4: Shared state between request handlers
 *   S: === Prevention Strategies ===
 *   T: 1. Async Mutex/Semaphore for async critical sections
 *   U: 2. Atomics for SharedArrayBuffer operations
 *   V: 3. Database transactions for DB operations
 *   W: 4. Idempotent operations (safe to retry)
 *   X: 5. Optimistic locking (version checks)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Race conditions exist even in single-threaded Node.js! When two async   │
 * │  operations read-modify-write shared state, the second may overwrite     │
 * │  the first's result. Classic example: two concurrent withdrawals both    │
 * │  reading the same balance. Fix with an async mutex that serializes       │
 * │  access. With worker threads and SharedArrayBuffer, we get classical     │
 * │  data races too - fix with Atomics. In databases, use transactions.     │
 * │  The key patterns to watch: check-then-act, read-modify-write, and      │
 * │  any shared mutable state between async operations."                     │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/10-race-conditions.js
 */
