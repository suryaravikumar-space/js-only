/**
 * TOPIC 14: Threading & Concurrency Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Know these cold: single-threaded but non-blocking, event loop, libuv    ║
 * ║ thread pool (4 threads), worker_threads for CPU, cluster for scaling,   ║
 * ║ child_process for external programs. Node is NOT single-threaded at     ║
 * ║ the system level - only YOUR JS code runs on one thread.                ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Think of Node.js as an AIRPORT:                                          │
 * │                                                                            │
 * │  Main Thread  = ONE air traffic controller (directs everything)           │
 * │  Event Loop   = The radar screen (constantly checking what's ready)       │
 * │  libuv Pool   = Ground crew (4 workers handling baggage/fuel in parallel) │
 * │  Workers      = Co-pilots you hire for heavy computation                  │
 * │  Cluster      = Multiple airports handling same airline routes            │
 * │  Child Process= Calling another airline to handle a special flight        │
 * │                                                                            │
 * │  The controller NEVER loads baggage personally (blocking). They delegate. │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Complete Threading Model                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────────────────┐              │
 * │  │                    NODE.JS PROCESS                       │              │
 * │  │                                                         │              │
 * │  │  ┌──────────────────────────────────────┐              │              │
 * │  │  │  MAIN THREAD (V8 + Event Loop)       │              │              │
 * │  │  │  - YOUR JavaScript code              │              │              │
 * │  │  │  - Callbacks, Promises, async/await  │              │              │
 * │  │  └──────────────────────────────────────┘              │              │
 * │  │              │                                          │              │
 * │  │  ┌───────────┴───────────────────────────┐             │              │
 * │  │  │  LIBUV THREAD POOL (default 4)        │             │              │
 * │  │  │  - fs operations                      │             │              │
 * │  │  │  - dns.lookup                         │             │              │
 * │  │  │  - crypto.pbkdf2, randomBytes         │             │              │
 * │  │  │  - zlib compression                   │             │              │
 * │  │  └───────────────────────────────────────┘             │              │
 * │  │              │                                          │              │
 * │  │  ┌───────────┴───────────────────────────┐             │              │
 * │  │  │  WORKER THREADS (on demand)           │             │              │
 * │  │  │  - CPU-bound JS tasks                 │             │              │
 * │  │  │  - SharedArrayBuffer sharing          │             │              │
 * │  │  │  - Each has own V8 + event loop       │             │              │
 * │  │  └───────────────────────────────────────┘             │              │
 * │  └─────────────────────────────────────────────────────────┘              │
 * │                                                                            │
 * │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │
 * │  │ Cluster Fork │  │ Cluster Fork │  │ Child Process│                    │
 * │  │ (full copy)  │  │ (full copy)  │  │ (any binary) │                    │
 * │  └──────────────┘  └──────────────┘  └──────────────┘                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── Q1: Is Node.js single-threaded? ───
console.log('A:', '=== Q1: Is Node.js single-threaded? ===');
console.log('B:', 'Answer: PARTIALLY. Your JS runs on ONE thread, but Node uses');
console.log('C:', 'multiple threads behind the scenes (libuv pool for fs, dns, crypto).');
console.log('D:', `libuv pool size: ${process.env.UV_THREADPOOL_SIZE || 4} (default 4, max 1024)`);

// ─── Q2: Event Loop phases ───
console.log('E:', '=== Q2: Event Loop Phases ===');
console.log('F:', '1. Timers        → setTimeout, setInterval callbacks');
console.log('G:', '2. Pending I/O   → system-level callbacks (TCP errors)');
console.log('H:', '3. Idle/Prepare  → internal use only');
console.log('I:', '4. Poll          → retrieve new I/O events, execute callbacks');
console.log('J:', '5. Check         → setImmediate callbacks');
console.log('K:', '6. Close         → socket.on("close") callbacks');
console.log('L:', 'Between phases: process.nextTick() and Promise microtasks run');

// ─── Q3: Worker Threads vs Cluster vs Child Process ───
console.log('M:', '=== Q3: Threads vs Cluster vs Child Process ===');
console.log('N:', 'Worker Threads: same process, shared memory possible, ~2MB each');
console.log('O:', 'Cluster:        separate processes, same port, ~30MB each, crash isolation');
console.log('P:', 'Child Process:  any binary, IPC or stdio pipes, fully independent');

// ─── Q4: How does Node handle concurrency? ───
console.log('Q:', '=== Q4: How does Node handle concurrency? ===');
console.log('R:', 'I/O concurrency: Event loop + OS async primitives (epoll/kqueue)');
console.log('S:', 'CPU concurrency: Worker threads or child processes');
console.log('T:', 'Concurrency ≠ Parallelism. Concurrency = managing many tasks.');
console.log('U:', 'Parallelism = executing tasks simultaneously on multiple cores.');

// ─── Q5: What blocks the event loop? ───
console.log('V:', '=== Q5: What blocks the event loop? ===');
const blockStart = Date.now();
let sum = 0;
for (let i = 0; i < 1e7; i++) sum += i;
console.log('W:', `Sync loop (10M iterations): ${Date.now() - blockStart}ms - BLOCKS everything`);
console.log('X:', 'Other blockers: JSON.parse(huge), RegExp backtracking, crypto sync');

// ─── Q6: How to fix a blocking operation? ───
console.log('Y:', '=== Q6: How to fix blocking? ===');
console.log('Z:', '1. Use async version (fs.readFile vs fs.readFileSync)');
console.log('AA:', '2. Offload to worker thread (CPU-bound work)');
console.log('AB:', '3. Break into chunks (setImmediate between batches)');
console.log('AC:', '4. Use streams instead of buffering entire data');

// ─── Q7: SharedArrayBuffer vs postMessage ───
console.log('AD:', '=== Q7: SharedArrayBuffer vs postMessage ===');
console.log('AE:', 'postMessage: copies data (structured clone), safe, slower for large data');
console.log('AF:', 'SharedArrayBuffer: zero-copy shared memory, fast, needs Atomics for safety');
console.log('AG:', 'Transfer: zero-copy move (sender loses access), one-time transfer');

// ─── Q8: Race conditions in Node? ───
console.log('AH:', '=== Q8: Race conditions in Node? ===');
console.log('AI:', 'YES! Even single-threaded: async read-modify-write on shared state.');
console.log('AJ:', 'Fix: async mutex, database transactions, idempotent operations.');
console.log('AK:', 'With workers: use Atomics for SharedArrayBuffer access.');

// ─── Q9: When NOT to use threads? ───
console.log('AL:', '=== Q9: When NOT to use threads? ===');
console.log('AM:', '- I/O-bound work (DB queries, HTTP calls, file reads)');
console.log('AN:', '- Tasks under 50ms (thread startup overhead exceeds benefit)');
console.log('AO:', '- Simple request/response APIs (async/await is perfect)');

// ─── Q10: Production scaling strategy? ───
console.log('AP:', '=== Q10: Production scaling? ===');
console.log('AQ:', '1. Single server: PM2 cluster mode (uses all cores)');
console.log('AR:', '2. Multiple servers: Nginx/HAProxy load balancer in front');
console.log('AS:', '3. CPU tasks: Worker thread pool (piscina or custom)');
console.log('AT:', '4. External tools: child_process.spawn (FFmpeg, ImageMagick)');
console.log('AU:', '5. Containers: Kubernetes horizontal pod autoscaling');

// ─── Quick Reference Table ───
console.log('AV:', '=== QUICK REFERENCE ===');
console.log('AW:', '┌───────────────────┬─────────────────────────────────────┐');
console.log('AX:', '│ Concept           │ Key Point                           │');
console.log('AY:', '├───────────────────┼─────────────────────────────────────┤');
console.log('AZ:', '│ Event Loop        │ Checks callback queues in phases    │');
console.log('BA:', '│ libuv Pool        │ 4 threads for fs/dns/crypto/zlib    │');
console.log('BB:', '│ Worker Threads    │ CPU-bound JS, shared memory         │');
console.log('BC:', '│ Cluster           │ Multi-process, same port, isolation  │');
console.log('BD:', '│ child_process     │ External binaries, IPC/pipes        │');
console.log('BE:', '│ SharedArrayBuffer │ Zero-copy shared memory + Atomics   │');
console.log('BF:', '│ Atomics           │ Thread-safe operations on shared mem│');
console.log('BG:', '│ process.nextTick  │ Runs before any I/O (microtask)     │');
console.log('BH:', '│ setImmediate      │ Runs in Check phase (after Poll)    │');
console.log('BI:', '│ Race Condition    │ Async read-modify-write on state    │');
console.log('BJ:', '└───────────────────┴─────────────────────────────────────┘');

/**
 * OUTPUT:
 *   A: === Q1: Is Node.js single-threaded? ===
 *   B: Answer: PARTIALLY. Your JS runs on ONE thread, but Node uses
 *   C: multiple threads behind the scenes (libuv pool for fs, dns, crypto).
 *   D: libuv pool size: 4 (default 4, max 1024)
 *   E: === Q2: Event Loop Phases ===
 *   F: 1. Timers        → setTimeout, setInterval callbacks
 *   G: 2. Pending I/O   → system-level callbacks (TCP errors)
 *   H: 3. Idle/Prepare  → internal use only
 *   I: 4. Poll          → retrieve new I/O events, execute callbacks
 *   J: 5. Check         → setImmediate callbacks
 *   K: 6. Close         → socket.on("close") callbacks
 *   L: Between phases: process.nextTick() and Promise microtasks run
 *   M: === Q3: Threads vs Cluster vs Child Process ===
 *   N: Worker Threads: same process, shared memory possible, ~2MB each
 *   O: Cluster:        separate processes, same port, ~30MB each, crash isolation
 *   P: Child Process:  any binary, IPC or stdio pipes, fully independent
 *   Q: === Q4: How does Node handle concurrency? ===
 *   R: I/O concurrency: Event loop + OS async primitives (epoll/kqueue)
 *   S: CPU concurrency: Worker threads or child processes
 *   T: Concurrency ≠ Parallelism. Concurrency = managing many tasks.
 *   U: Parallelism = executing tasks simultaneously on multiple cores.
 *   V: === Q5: What blocks the event loop? ===
 *   W: Sync loop (10M iterations): XXms - BLOCKS everything
 *   X: Other blockers: JSON.parse(huge), RegExp backtracking, crypto sync
 *   Y: === Q6: How to fix blocking? ===
 *   Z: 1. Use async version (fs.readFile vs fs.readFileSync)
 *   AA: 2. Offload to worker thread (CPU-bound work)
 *   AB: 3. Break into chunks (setImmediate between batches)
 *   AC: 4. Use streams instead of buffering entire data
 *   AD: === Q7: SharedArrayBuffer vs postMessage ===
 *   AE: postMessage: copies data (structured clone), safe, slower for large data
 *   AF: SharedArrayBuffer: zero-copy shared memory, fast, needs Atomics for safety
 *   AG: Transfer: zero-copy move (sender loses access), one-time transfer
 *   AH: === Q8: Race conditions in Node? ===
 *   AI: YES! Even single-threaded: async read-modify-write on shared state.
 *   AJ: Fix: async mutex, database transactions, idempotent operations.
 *   AK: With workers: use Atomics for SharedArrayBuffer access.
 *   AL: === Q9: When NOT to use threads? ===
 *   AM: - I/O-bound work (DB queries, HTTP calls, file reads)
 *   AN: - Tasks under 50ms (thread startup overhead exceeds benefit)
 *   AO: - Simple request/response APIs (async/await is perfect)
 *   AP: === Q10: Production scaling? ===
 *   AQ: 1. Single server: PM2 cluster mode (uses all cores)
 *   AR: 2. Multiple servers: Nginx/HAProxy load balancer in front
 *   AS: 3. CPU tasks: Worker thread pool (piscina or custom)
 *   AT: 4. External tools: child_process.spawn (FFmpeg, ImageMagick)
 *   AU: 5. Containers: Kubernetes horizontal pod autoscaling
 *   AV: === QUICK REFERENCE ===
 *   AW-BJ: (reference table)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Node.js runs your JavaScript on a single thread, but the runtime is     │
 * │  NOT single-threaded. libuv manages a thread pool (default 4) for fs,    │
 * │  dns, crypto, and zlib. The event loop orchestrates async callbacks in   │
 * │  phases. For CPU-heavy JS work, use worker_threads - they share memory   │
 * │  via SharedArrayBuffer and Atomics. For scaling HTTP servers, use the    │
 * │  cluster module to fork across cores. For external programs, use         │
 * │  child_process. Race conditions exist even in single-threaded code when  │
 * │  async operations interleave. In production, PM2 handles clustering,    │
 * │  and tools like piscina manage worker thread pools efficiently."         │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/14-interview-cheatsheet.js
 */
