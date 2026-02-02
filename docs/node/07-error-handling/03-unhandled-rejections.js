/**
 * TOPIC 03: Unhandled Promise Rejections
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ EVERY Promise must have a .catch() or be in a try-catch with await.      ║
 * ║ Unhandled rejections CRASH your Node.js process (v15+).                  ║
 * ║                                                                            ║
 * ║   Node < 15  → Warning only (process continues)                          ║
 * ║   Node >= 15 → Throws and CRASHES (like uncaughtException)               ║
 * ║                                                                            ║
 * ║   Always: promise.catch() or try { await } catch { }                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of IGNORED PHONE CALLS that cause problems:                         │
 * │                                                                             │
 * │  Promise rejection = someone calling you with BAD NEWS                     │
 * │  .catch() handler = answering the phone and dealing with it               │
 * │                                                                             │
 * │  If you IGNORE the call (no .catch()):                                     │
 * │    Old Node (< v15): Your phone buzzes with a WARNING                     │
 * │      "Hey, someone tried to tell you something important!"                │
 * │      But life goes on... (dangerous! the problem festers)                 │
 * │                                                                             │
 * │    New Node (>= v15): Your phone EXPLODES                                 │
 * │      The ignored call was so critical that everything shuts down           │
 * │      This is BETTER — forces you to handle problems                       │
 * │                                                                             │
 * │  process.on('unhandledRejection') = a SECRETARY who picks up              │
 * │  all unanswered calls as a safety net (but you should still               │
 * │  answer your own calls!)                                                    │
 * │                                                                             │
 * │  "Always answer the phone. Ignoring bad news makes it worse."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Promise Rejection Flow                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Promise rejects                                                           │
 * │       │                                                                    │
 * │       ▼                                                                    │
 * │  Has .catch() or try-catch?                                                │
 * │       │                                                                    │
 * │  YES ─┤── NO ──────────────────────────────────────┐                       │
 * │   │   │                                             │                      │
 * │   ▼   │                                             ▼                      │
 * │ Handle│                              'unhandledRejection' event fires     │
 * │ error │                                             │                      │
 * │   │   │                                  ┌──────────┤──────────┐           │
 * │   ▼   │                              Handler?   No handler               │
 * │ Done  │                                  │          │                      │
 * │       │                                  ▼          ▼                      │
 * │       │                              Log & Exit   Node < 15: Warning     │
 * │       │                                           Node >= 15: CRASH      │
 * │       │                                                                    │
 * │  Also fires 'rejectionHandled' if .catch() is added LATER (rare)         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── 1. Register unhandledRejection handler ───
console.log('=== 1. Setting up unhandledRejection handler ===');

process.on('unhandledRejection', (reason, promise) => {
  console.log('A:', 'Unhandled Rejection detected!');
  console.log('B:', `Reason: ${reason}`);
  console.log('C:', `Promise: ${promise}`);
  // In production: log to monitoring, then exit
});

// ─── 2. Properly handled rejections (GOOD) ───
console.log('\n=== 2. Properly handled rejections ===');

// Method 1: .catch()
const fetchUser = (id) => {
  return new Promise((resolve, reject) => {
    if (id <= 0) reject(new Error(`Bad user id: ${id}`));
    else resolve({ id, name: 'Alice' });
  });
};

fetchUser(-1)
  .then((user) => console.log('D:', user.name))
  .catch((err) => console.log('D:', `Handled: ${err.message}`));

// Method 2: async/await with try-catch
const loadUser = async () => {
  try {
    const user = await fetchUser(-2);
    console.log('E:', user.name);
  } catch (err) {
    console.log('E:', `Handled: ${err.message}`);
  }
};

loadUser();

// ─── 3. Common patterns that cause unhandled rejections ───
console.log('\n=== 3. Common mistakes ===');

// Mistake 1: Forgetting .catch() on a promise
// BAD:  fetchUser(-3);  // No .catch() → unhandled rejection!
// GOOD:
fetchUser(-3).catch((err) => console.log('F:', `Caught: ${err.message}`));

// Mistake 2: async function without try-catch
const riskyAsync = async () => {
  // If this throws, the returned promise rejects
  throw new Error('Risky operation failed');
};

// BAD:  riskyAsync();  // No .catch() → unhandled rejection!
// GOOD:
riskyAsync().catch((err) => console.log('G:', `Caught: ${err.message}`));

// Mistake 3: Forgetting to await in try-catch
const forgetAwait = async () => {
  try {
    // BAD: not awaiting — try-catch won't catch this!
    // riskyAsync(); // This would be unhandled!

    // GOOD: await it
    await riskyAsync();
  } catch (err) {
    console.log('H:', `Caught with await: ${err.message}`);
  }
};

forgetAwait();

// ─── 4. Promise.all and rejection handling ───
console.log('\n=== 4. Promise.all rejection ===');

const task = (name, shouldFail) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      shouldFail
        ? reject(new Error(`${name} failed`))
        : resolve(`${name} done`);
    }, 10);
  });
};

// Promise.all fails fast on first rejection
Promise.all([
  task('Task1', false),
  task('Task2', true),
  task('Task3', false),
])
  .then((results) => console.log('I:', results))
  .catch((err) => console.log('I:', `All failed: ${err.message}`));

// Promise.allSettled never rejects — safer alternative
Promise.allSettled([
  task('Task1', false),
  task('Task2', true),
  task('Task3', false),
]).then((results) => {
  const fulfilled = results.filter((r) => r.status === 'fulfilled');
  const rejected = results.filter((r) => r.status === 'rejected');
  console.log('J:', `${fulfilled.length} succeeded, ${rejected.length} failed`);
});

// ─── 5. Node version behavior differences ───
console.log('\n=== 5. Node version behavior ===');

const nodeVersion = parseInt(process.version.slice(1));
console.log('K:', `Node version: ${process.version}`);
console.log('L:', `Unhandled rejections will: ${nodeVersion >= 15 ? 'CRASH the process' : 'show a warning'}`);

// ─── 6. rejectionHandled event (rare but useful) ───
process.on('rejectionHandled', (promise) => {
  console.log('M:', 'A previously unhandled rejection was handled later');
});

// ─── 7. Production pattern: global safety net ───
console.log('\n=== 7. Production safety net ===');

const setupGlobalHandlers = () => {
  // This is a SAFETY NET, not a replacement for proper .catch()
  const handler = (reason, promise) => {
    const timestamp = new Date().toISOString();
    console.log('N:', `[${timestamp}] UNHANDLED REJECTION: ${reason}`);
    // In production:
    // - Send to error tracking (Sentry, etc.)
    // - Log with full context
    // - Gracefully shut down
  };

  // Already registered above, but showing the pattern
  console.log('O:', 'Global rejection handler active');
  console.log('P:', 'Remember: this is a SAFETY NET, not a solution');
  console.log('Q:', 'Always use .catch() or try-catch with await');
};

setupGlobalHandlers();

/**
 * OUTPUT:
 *   === 1. Setting up unhandledRejection handler ===
 *
 *   === 2. Properly handled rejections ===
 *   D: Handled: Bad user id: -1
 *
 *   === 3. Common mistakes ===
 *
 *   === 4. Promise.all rejection ===
 *
 *   === 5. Node version behavior ===
 *   K: Node version: v20.x.x
 *   L: Unhandled rejections will: CRASH the process
 *
 *   === 7. Production safety net ===
 *   O: Global rejection handler active
 *   P: Remember: this is a SAFETY NET, not a solution
 *   Q: Always use .catch() or try-catch with await
 *   E: Handled: Bad user id: -2
 *   F: Caught: Bad user id: -3
 *   G: Caught: Risky operation failed
 *   H: Caught with await: Risky operation failed
 *   I: All failed: Task2 failed
 *   J: 2 succeeded, 1 failed
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "An unhandled rejection occurs when a Promise rejects without a .catch() │
 * │  handler. In Node.js v15+, this crashes the process just like an          │
 * │  uncaught exception. Every promise must have error handling — either      │
 * │  .catch() or try-catch with await. process.on('unhandledRejection')      │
 * │  acts as a global safety net for logging, but you should still handle    │
 * │  rejections locally. Common mistakes include forgetting .catch(), not    │
 * │  awaiting promises inside try-catch, and not handling Promise.all        │
 * │  rejections. Promise.allSettled is a safer alternative when you need     │
 * │  all results regardless of individual failures."                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/07-error-handling/03-unhandled-rejections.js
 */
