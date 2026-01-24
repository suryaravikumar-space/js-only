/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 3: LIBUV AND THE THREAD POOL
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * libuv is the C library that provides Node.js with async I/O capabilities.
 * It handles the event loop, file system operations, networking, and more.
 *
 * INTERVIEW CONTEXT:
 * Understanding libuv demonstrates deep Node.js knowledge:
 * - Why some operations are truly async vs using thread pool
 * - How to optimize thread pool size
 * - Why certain operations block despite being "async"
 *
 * TOPICS COVERED:
 * 1. What is libuv?
 * 2. Thread Pool Architecture
 * 3. Operations Using Thread Pool
 * 4. Configuring Thread Pool Size
 * 5. Kernel Async vs Thread Pool
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 3: LIBUV AND THE THREAD POOL");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    LIBUV ARCHITECTURE                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  libuv provides TWO mechanisms for async operations:                    │
 * │                                                                          │
 * │  1. KERNEL ASYNC (epoll/kqueue/IOCP) - No threads needed               │
 * │  2. THREAD POOL - For operations OS can't do async                     │
 * │                                                                          │
 * │  ┌────────────────────────────────────────────────────────────────┐     │
 * │  │                                                                  │     │
 * │  │                       YOUR NODE.JS CODE                         │     │
 * │  │                              │                                   │     │
 * │  │                              ▼                                   │     │
 * │  │   ┌──────────────────────────────────────────────────────────┐ │     │
 * │  │   │                        LIBUV                              │ │     │
 * │  │   │                                                           │ │     │
 * │  │   │  ┌─────────────────┐       ┌─────────────────────────┐  │ │     │
 * │  │   │  │   EVENT LOOP    │       │     THREAD POOL         │  │ │     │
 * │  │   │  │   (main thread) │       │   (4 threads default)   │  │ │     │
 * │  │   │  │                 │       │                         │  │ │     │
 * │  │   │  │ • Timers        │       │  Thread 1  │  Thread 2  │  │ │     │
 * │  │   │  │ • I/O polling   │       │  Thread 3  │  Thread 4  │  │ │     │
 * │  │   │  │ • Callbacks     │       │                         │  │ │     │
 * │  │   │  └────────┬────────┘       └────────────┬────────────┘  │ │     │
 * │  │   │           │                             │                │ │     │
 * │  │   │           │     KERNEL ASYNC            │                │ │     │
 * │  │   │           │  ┌──────────────────────┐   │                │ │     │
 * │  │   │           └──┤ epoll (Linux)        │   │                │ │     │
 * │  │   │              │ kqueue (macOS)       │   │                │ │     │
 * │  │   │              │ IOCP (Windows)       │   │                │ │     │
 * │  │   │              └──────────────────────┘   │                │ │     │
 * │  │   │                                         │                │ │     │
 * │  │   └─────────────────────────────────────────┼────────────────┘ │     │
 * │  │                                             │                   │     │
 * │  │   ┌─────────────────────────────────────────▼────────────────┐ │     │
 * │  │   │                  OPERATING SYSTEM                         │ │     │
 * │  │   │                                                           │ │     │
 * │  │   │   Network │ File System │ DNS │ Crypto │ Compression    │ │     │
 * │  │   └───────────────────────────────────────────────────────────┘ │     │
 * │  │                                                                  │     │
 * │  └────────────────────────────────────────────────────────────────┘     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║          KERNEL ASYNC vs THREAD POOL                           ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              WHICH OPERATIONS USE WHAT?                                  │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  KERNEL ASYNC (No thread pool):                                         │
 * │  ═══════════════════════════════                                        │
 * │  These use OS-level async APIs directly                                 │
 * │                                                                          │
 * │  ✓ TCP/UDP networking (http, net, dgram)                               │
 * │  ✓ Unix domain sockets                                                  │
 * │  ✓ TTY (terminal I/O)                                                   │
 * │  ✓ Signals                                                              │
 * │  ✓ Child processes (spawn/fork)                                         │
 * │                                                                          │
 * │  Why? OS kernels have native async support for networking               │
 * │                                                                          │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                          │
 * │  THREAD POOL (Uses libuv threads):                                      │
 * │  ═════════════════════════════════                                      │
 * │  These operations block at OS level, so libuv uses threads              │
 * │                                                                          │
 * │  ✓ File system operations (fs.*)                                        │
 * │  ✓ DNS lookups (dns.lookup, NOT dns.resolve*)                          │
 * │  ✓ Crypto (crypto.pbkdf2, crypto.randomBytes, etc.)                    │
 * │  ✓ Zlib compression                                                     │
 * │  ✓ Some C++ addons                                                      │
 * │                                                                          │
 * │  Why? OS doesn't provide async APIs for these operations                │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Operation Categories:");
console.log("─".repeat(50));

console.log("\n  🚀 KERNEL ASYNC (fast, no thread pool):");
console.log("     • TCP/UDP networking");
console.log("     • HTTP requests/responses");
console.log("     • Timers");
console.log("     • Child processes");

console.log("\n  🧵 THREAD POOL (uses limited threads):");
console.log("     • fs.* (file operations)");
console.log("     • dns.lookup()");
console.log("     • crypto.pbkdf2, crypto.randomBytes");
console.log("     • zlib compression");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          THREAD POOL DEMONSTRATION                             ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

const crypto = require('crypto');
const fs = require('fs');

// Current thread pool size
const UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || 4;
console.log(`Thread Pool Size: ${UV_THREADPOOL_SIZE}`);
console.log("(Set UV_THREADPOOL_SIZE env var to change)\n");

/**
 * DEMONSTRATION: Thread Pool Bottleneck
 *
 * With default pool size of 4, running 8 heavy operations will show
 * that first 4 complete together, then next 4 complete together.
 */

console.log("Demo: Thread Pool Bottleneck with crypto.pbkdf2");
console.log("─".repeat(50));

const start = Date.now();

function hashPassword(id) {
    const startHash = Date.now();
    crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, key) => {
        const duration = Date.now() - startHash;
        const total = Date.now() - start;
        console.log(`  Hash ${id} done in ${duration}ms (total: ${total}ms)`);
    });
}

// Run 8 hash operations (2x the thread pool size)
console.log("  Starting 8 hash operations (thread pool = 4)...\n");
for (let i = 1; i <= 8; i++) {
    hashPassword(i);
}

console.log("  Watch: First 4 complete ~together, then next 4\n");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          THREAD POOL OPTIMIZATION                              ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              CONFIGURING THREAD POOL SIZE                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  UV_THREADPOOL_SIZE environment variable                                │
 * │  ═════════════════════════════════════════                              │
 * │                                                                          │
 * │  • Default: 4 threads                                                   │
 * │  • Maximum: 1024 threads (but rarely need more than CPU cores)          │
 * │  • MUST be set BEFORE Node.js starts                                    │
 * │                                                                          │
 * │  WHEN TO INCREASE:                                                      │
 * │  ─────────────────                                                      │
 * │  • Heavy file I/O applications                                          │
 * │  • Lots of crypto operations                                            │
 * │  • DNS-heavy applications                                               │
 * │  • Image/video processing                                               │
 * │                                                                          │
 * │  GUIDELINES:                                                            │
 * │  ────────────                                                           │
 * │  • For I/O-bound: UV_THREADPOOL_SIZE = number of CPU cores             │
 * │  • For CPU-bound: UV_THREADPOOL_SIZE = 1-2 per core                    │
 * │  • Too many threads = context switching overhead                        │
 * │                                                                          │
 * │  HOW TO SET:                                                            │
 * │  ┌────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │  // Linux/macOS                                                 │    │
 * │  │  UV_THREADPOOL_SIZE=8 node app.js                               │    │
 * │  │                                                                  │    │
 * │  │  // Windows (PowerShell)                                        │    │
 * │  │  $env:UV_THREADPOOL_SIZE=8; node app.js                         │    │
 * │  │                                                                  │    │
 * │  │  // In code (MUST be first line, before any require)           │    │
 * │  │  process.env.UV_THREADPOOL_SIZE = 8;  // Won't work!           │    │
 * │  │                                                                  │    │
 * │  └────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const os = require('os');

console.log("Thread Pool Optimization Guidelines:");
console.log("─".repeat(50));

console.log(`\n  Your system: ${os.cpus().length} CPU cores`);
console.log(`  Current thread pool: ${UV_THREADPOOL_SIZE} threads`);

console.log("\n  Recommendations by workload:");
console.log("  ┌────────────────────────────────────────────────────────┐");
console.log("  │ Workload Type         │ Recommended Pool Size         │");
console.log("  ├────────────────────────────────────────────────────────┤");
console.log(`  │ I/O heavy (file ops)  │ ${os.cpus().length} (match CPU cores)          │`);
console.log(`  │ Crypto heavy          │ ${os.cpus().length * 2} (2x CPU cores)             │`);
console.log("  │ Mixed workload        │ CPU cores + 2                 │");
console.log("  │ Low async usage       │ 4 (default is fine)           │");
console.log("  └────────────────────────────────────────────────────────┘");

console.log("\n  Setting thread pool size:");
console.log("  $ UV_THREADPOOL_SIZE=8 node app.js");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          DNS: LOOKUP vs RESOLVE                                ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              DNS LOOKUP vs DNS RESOLVE                                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  This is a COMMON INTERVIEW QUESTION!                                   │
 * │                                                                          │
 * │  dns.lookup():                                                          │
 * │  ─────────────                                                          │
 * │  • Uses THREAD POOL                                                     │
 * │  • Uses OS resolver (checks /etc/hosts, etc.)                          │
 * │  • Same behavior as other programs on system                            │
 * │  • Can be blocked by thread pool exhaustion                             │
 * │                                                                          │
 * │  dns.resolve*():                                                        │
 * │  ────────────────                                                       │
 * │  • Uses KERNEL ASYNC (c-ares library)                                   │
 * │  • Directly queries DNS servers                                         │
 * │  • Ignores /etc/hosts                                                   │
 * │  • More scalable, no thread pool limits                                 │
 * │                                                                          │
 * │  IMPACT:                                                                │
 * │  ┌────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │  With 4 threads and 100 concurrent DNS lookups:                 │    │
 * │  │                                                                  │    │
 * │  │  dns.lookup():                                                  │    │
 * │  │  └─► Only 4 at a time! Others queue up                         │    │
 * │  │  └─► Blocks other thread pool operations                       │    │
 * │  │                                                                  │    │
 * │  │  dns.resolve():                                                 │    │
 * │  │  └─► All 100 run in parallel                                   │    │
 * │  │  └─► Doesn't affect thread pool                                │    │
 * │  │                                                                  │    │
 * │  └────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const dns = require('dns');

console.log("DNS Operations Comparison:");
console.log("─".repeat(50));

console.log("\n  dns.lookup() - Uses Thread Pool:");
console.log("  ─────────────────────────────────");
const lookupStart = Date.now();
dns.lookup('google.com', (err, address) => {
    console.log(`  dns.lookup result: ${address} (${Date.now() - lookupStart}ms)`);
    console.log("  Uses: Thread Pool (limited by UV_THREADPOOL_SIZE)");
});

console.log("\n  dns.resolve() - Uses Kernel Async:");
console.log("  ─────────────────────────────────");
const resolveStart = Date.now();
dns.resolve4('google.com', (err, addresses) => {
    console.log(`  dns.resolve4 result: ${addresses?.[0]} (${Date.now() - resolveStart}ms)`);
    console.log("  Uses: c-ares library (kernel async, no thread pool)");
});

console.log("\n  ⚠️  Tip: Use dns.resolve*() for better scalability!");

setTimeout(() => {
    console.log("\n╔════════════════════════════════════════════════════════════════╗");
    console.log("║          LIBUV SUMMARY                                         ║");
    console.log("╚════════════════════════════════════════════════════════════════╝\n");

    console.log("Interview Key Points - libuv:");
    console.log("─".repeat(50));

    console.log("\n  What libuv provides:");
    console.log("  • Event loop implementation");
    console.log("  • Thread pool for blocking operations");
    console.log("  • Cross-platform async I/O");
    console.log("  • Timers, signals, child processes");

    console.log("\n  Thread Pool (UV_THREADPOOL_SIZE):");
    console.log("  • Default: 4 threads");
    console.log("  • Used by: fs.*, dns.lookup, crypto, zlib");
    console.log("  • NOT used by: networking, timers");
    console.log("  • Increase for I/O or crypto heavy apps");

    console.log("\n  Common Interview Questions:");
    console.log("  Q: Is Node.js single-threaded?");
    console.log("  A: JS executes on single thread, but libuv uses");
    console.log("     a thread pool for blocking operations.");

    console.log("\n  Q: dns.lookup vs dns.resolve?");
    console.log("  A: lookup uses thread pool, resolve uses kernel async.");
    console.log("     For scalability, prefer dns.resolve*().");

    console.log("\n═══ FILE 3 COMPLETE ═══");
    console.log("Run: node 04-streams-buffers.js");
}, 2000);
