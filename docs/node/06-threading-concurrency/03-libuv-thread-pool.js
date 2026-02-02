/**
 * TOPIC 03: libuv Thread Pool
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Node.js has a HIDDEN thread pool (libuv) with 4 threads by default.      ║
 * ║ Operations like fs, dns.lookup, crypto, and zlib use this thread pool.   ║
 * ║ You can resize it: UV_THREADPOOL_SIZE=8 (max 1024).                      ║
 * ║                                                                          ║
 * ║ The event loop is single-threaded. The thread pool is NOT.               ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a hotel RECEPTION DESK (event loop) with BACK-OFFICE WORKERS     │
 * │  (thread pool).                                                            │
 * │                                                                            │
 * │  Reception (event loop):                                                   │
 * │    - Takes guest requests, gives out room keys (fast I/O)                 │
 * │    - Handles phone calls, greetings (network I/O via OS)                  │
 * │    - Never leaves the desk                                                 │
 * │                                                                            │
 * │  Back-office workers (thread pool = 4 workers):                           │
 * │    - Carry luggage to rooms (file system ops)                             │
 * │    - Look up guest records (dns.lookup)                                   │
 * │    - Count cash in the safe (crypto operations)                           │
 * │    - Pack/unpack boxes (zlib compression)                                 │
 * │                                                                            │
 * │  If 4 guests need luggage carried AND a 5th arrives:                      │
 * │    - 5th guest WAITS until one worker finishes                            │
 * │    - Solution: hire more workers (UV_THREADPOOL_SIZE=8)                   │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: libuv Thread Pool Architecture                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │            Your JavaScript Code                                           │
 * │                    │                                                       │
 * │                    ▼                                                       │
 * │   ┌────────────────────────────┐                                          │
 * │   │     EVENT LOOP (main)     │                                           │
 * │   │   Single-threaded JS      │                                           │
 * │   └─────────┬────────┬────────┘                                           │
 * │             │        │                                                    │
 * │     ┌───────┘        └────────┐                                           │
 * │     ▼                         ▼                                           │
 * │   ┌──────────────┐  ┌─────────────────────────────┐                       │
 * │   │  OS Kernel   │  │  libuv THREAD POOL          │                       │
 * │   │  (epoll/     │  │  (default: 4 threads)       │                       │
 * │   │   kqueue)    │  │                              │                       │
 * │   │              │  │  ┌─────┐ ┌─────┐            │                       │
 * │   │  - TCP/UDP   │  │  │ T1  │ │ T2  │            │                       │
 * │   │  - Pipes     │  │  └─────┘ └─────┘            │                       │
 * │   │  - Timers    │  │  ┌─────┐ ┌─────┐            │                       │
 * │   │              │  │  │ T3  │ │ T4  │            │                       │
 * │   │              │  │  └─────┘ └─────┘            │                       │
 * │   └──────────────┘  │                              │                       │
 * │                     │  Used by: fs, dns.lookup,    │                       │
 * │                     │  crypto, zlib                │                       │
 * │                     └─────────────────────────────┘                        │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const crypto = require('crypto');

// ─── 1. Default thread pool size ───
console.log('A:', `UV_THREADPOOL_SIZE: ${process.env.UV_THREADPOOL_SIZE || '4 (default)'}`);

// ─── 2. Demo: 4 crypto operations run in parallel, 5th waits ───
const hashPassword = (id) => {
  const start = Date.now();
  return new Promise((resolve) => {
    crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', () => {
      const time = Date.now() - start;
      resolve({ id, time });
    });
  });
};

const runDemo = async () => {
  console.log('B:', 'Starting 5 crypto.pbkdf2 operations...');
  console.log('C:', 'Thread pool has 4 threads, so 4 run in parallel, 5th waits.\n');

  const globalStart = Date.now();

  // Launch all 5 at once
  const results = await Promise.all([
    hashPassword(1),
    hashPassword(2),
    hashPassword(3),
    hashPassword(4),
    hashPassword(5), // This one has to wait for a thread
  ]);

  results.forEach(({ id, time }) => {
    console.log(`D: Task ${id} completed in ${time}ms`);
  });

  console.log(`\nE: Total time: ${Date.now() - globalStart}ms`);
  console.log('F: Notice tasks 1-4 finish around the same time (~same ms)');
  console.log('G: Task 5 finishes LATER because it waited for a free thread');

  // ─── 3. Which operations use the thread pool? ───
  console.log('\nH:', '┌──────────────────────┬────────────────────┐');
  console.log('I:', '│ Uses Thread Pool     │ Uses OS (no pool)  │');
  console.log('J:', '├──────────────────────┼────────────────────┤');
  console.log('K:', '│ fs.readFile           │ net.connect (TCP)  │');
  console.log('L:', '│ fs.writeFile          │ http.request       │');
  console.log('M:', '│ dns.lookup            │ dns.resolve        │');
  console.log('N:', '│ crypto.pbkdf2         │ setTimeout         │');
  console.log('O:', '│ crypto.randomBytes    │ setImmediate       │');
  console.log('P:', '│ zlib.gzip             │ socket.write       │');
  console.log('Q:', '│ zlib.deflate          │ pipe operations    │');
  console.log('R:', '└──────────────────────┴────────────────────┘');

  // ─── 4. How to change thread pool size ───
  console.log('\nS:', 'To increase thread pool size:');
  console.log('T:', '  UV_THREADPOOL_SIZE=8 node app.js');
  console.log('U:', '  Or: process.env.UV_THREADPOOL_SIZE = 8  (BEFORE any async ops)');
  console.log('V:', '  Max: 1024, but set it close to your CPU core count');
};

runDemo();

/**
 * OUTPUT:
 *   A: UV_THREADPOOL_SIZE: 4 (default)
 *   B: Starting 5 crypto.pbkdf2 operations...
 *   C: Thread pool has 4 threads, so 4 run in parallel, 5th waits.
 *
 *   D: Task 1 completed in ~85ms
 *   D: Task 2 completed in ~87ms
 *   D: Task 3 completed in ~88ms
 *   D: Task 4 completed in ~89ms
 *   D: Task 5 completed in ~170ms     ← nearly 2x because it waited!
 *
 *   E: Total time: ~170ms
 *   F: Notice tasks 1-4 finish around the same time (~same ms)
 *   G: Task 5 finishes LATER because it waited for a free thread
 *   H-R: (which operations use thread pool vs OS)
 *   S-V: (how to change thread pool size)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Node.js uses libuv's thread pool for operations that can't be handled    │
 * │  asynchronously by the OS kernel - like file system ops, dns.lookup,     │
 * │  crypto, and zlib. The default pool size is 4 threads. If all 4 are busy,│
 * │  additional operations queue up and wait. You can increase it via         │
 * │  UV_THREADPOOL_SIZE env var (max 1024). Network I/O (TCP, HTTP) uses OS  │
 * │  async primitives (epoll/kqueue) directly and does NOT use the pool."    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/03-libuv-thread-pool.js
 */
