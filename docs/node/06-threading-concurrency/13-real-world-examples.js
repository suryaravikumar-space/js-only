/**
 * TOPIC 13: Real-World Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Worker Threads → Image/video processing, encryption, data parsing.      ║
 * ║ Cluster        → HTTP server scaling across all CPU cores.              ║
 * ║ Child Process  → Running shell commands, Python scripts, FFmpeg.        ║
 * ║ Single Thread  → REST APIs, database queries, file serving (I/O).      ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  A VIDEO PRODUCTION COMPANY:                                               │
 * │                                                                            │
 * │  Receptionist (Main Thread) → Answers phones, schedules meetings (I/O)   │
 * │  Video Editors (Workers)    → Render videos in parallel (CPU-heavy)      │
 * │  Branch Offices (Cluster)   → Handle clients in different cities         │
 * │  Freelancers (Child Process)→ External specialists (Python ML, FFmpeg)   │
 * │                                                                            │
 * │  You would NEVER have the receptionist edit video (blocks all calls).    │
 * │  You would NEVER open a branch office to answer ONE phone call.          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Decision Tree                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  What are you doing?                                                       │
 * │  │                                                                        │
 * │  ├── I/O (DB, files, HTTP) ──→ Single thread (async/await)               │
 * │  │                                                                        │
 * │  ├── CPU-heavy in JS ──→ Worker Threads                                  │
 * │  │   ├── Image resizing                                                   │
 * │  │   ├── JSON parsing (large)                                            │
 * │  │   ├── Encryption/hashing                                               │
 * │  │   └── Data transformation                                             │
 * │  │                                                                        │
 * │  ├── Scale HTTP server ──→ Cluster (or PM2)                              │
 * │  │                                                                        │
 * │  ├── Run external program ──→ Child Process                              │
 * │  │   ├── FFmpeg (video)                                                   │
 * │  │   ├── Python script                                                    │
 * │  │   └── Shell commands                                                   │
 * │  │                                                                        │
 * │  └── Need isolation ──→ Child Process (fork)                             │
 * │      └── Untrusted code execution                                         │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const crypto = require('crypto');
const { execSync } = require('child_process');

if (isMainThread) {
  // ─── EXAMPLE 1: Password Hashing with Worker Thread ───
  console.log('A:', '=== Example 1: Password Hashing (Worker Thread) ===');

  function hashPasswordInWorker(password) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { task: 'hash', password }
      });
      worker.on('message', resolve);
      worker.on('error', reject);
    });
  }

  // ─── EXAMPLE 2: Large JSON Parsing ───
  console.log('B:', '=== Example 2: Large JSON Parsing (Worker Thread) ===');

  function parseJSONInWorker(jsonString) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { task: 'parse', data: jsonString }
      });
      worker.on('message', resolve);
      worker.on('error', reject);
    });
  }

  // ─── EXAMPLE 3: CPU-bound Data Transformation ───
  console.log('C:', '=== Example 3: Data Transformation (Worker Thread) ===');

  function transformDataInWorker(records) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { task: 'transform', records }
      });
      worker.on('message', resolve);
      worker.on('error', reject);
    });
  }

  // ─── Run all examples ───
  async function runExamples() {
    // Example 1: Hash password
    const start1 = Date.now();
    const hash = await hashPasswordInWorker('mySecurePassword123');
    console.log('D:', `Password hash: ${hash.substring(0, 32)}... (${Date.now() - start1}ms)`);

    // Example 2: Parse large JSON
    const largeArray = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`
    }));
    const jsonStr = JSON.stringify(largeArray);
    console.log('E:', `JSON size: ${(jsonStr.length / 1024).toFixed(1)}KB`);

    const start2 = Date.now();
    const parsed = await parseJSONInWorker(jsonStr);
    console.log('F:', `Parsed ${parsed.count} records in worker (${Date.now() - start2}ms)`);

    // Example 3: Data transformation
    const records = Array.from({ length: 5000 }, (_, i) => ({
      name: `john doe ${i}`,
      salary: 50000 + Math.random() * 50000
    }));

    const start3 = Date.now();
    const transformed = await transformDataInWorker(records);
    console.log('G:', `Transformed ${transformed.count} records (${Date.now() - start3}ms)`);
    console.log('H:', `Sample: ${JSON.stringify(transformed.sample)}`);

    // ─── EXAMPLE 4: Child Process for shell commands ───
    console.log('I:', '=== Example 4: Shell Commands (Child Process) ===');
    const nodeVersion = execSync('node --version').toString().trim();
    console.log('J:', `Node version via child_process: ${nodeVersion}`);

    // ─── EXAMPLE 5: When to use single thread ───
    console.log('K:', '=== Example 5: Single Thread is BEST for I/O ===');
    const fs = require('fs');
    const start5 = Date.now();
    const fileContent = fs.readFileSync(__filename, 'utf8');
    console.log('L:', `Read ${fileContent.length} chars in ${Date.now() - start5}ms (single thread, async ideal)`);

    // ─── EXAMPLE 6: Cluster for HTTP scaling ───
    console.log('M:', '=== Example 6: HTTP Scaling (Cluster - pseudocode) ===');
    console.log('N:', 'const cluster = require("cluster");');
    console.log('O:', 'if (cluster.isMaster) { for (let i = 0; i < cpus; i++) cluster.fork(); }');
    console.log('P:', 'else { http.createServer(handler).listen(3000); }');

    // ─── Summary ───
    console.log('Q:', '=== Decision Summary ===');
    console.log('R:', 'Password hashing   → Worker Thread (CPU-heavy, blocks event loop)');
    console.log('S:', 'Image resizing     → Worker Thread (sharp library uses workers internally)');
    console.log('T:', 'HTTP server scale  → Cluster / PM2 (multi-process, same port)');
    console.log('U:', 'FFmpeg conversion  → child_process.spawn (external binary)');
    console.log('V:', 'REST API handlers  → Single thread (I/O-bound, async is perfect)');
  }

  runExamples();

} else {
  // ─── WORKER TASKS ───
  const { task, password, data, records } = workerData;

  if (task === 'hash') {
    const hash = crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha512').toString('hex');
    parentPort.postMessage(hash);
  }

  if (task === 'parse') {
    const parsed = JSON.parse(data);
    parentPort.postMessage({ count: parsed.length, firstId: parsed[0].id });
  }

  if (task === 'transform') {
    const result = records.map(r => ({
      name: r.name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
      salary: Math.round(r.salary * 100) / 100,
      tax: Math.round(r.salary * 0.3 * 100) / 100
    }));
    parentPort.postMessage({ count: result.length, sample: result[0] });
  }
}

/**
 * OUTPUT:
 *   A: === Example 1: Password Hashing (Worker Thread) ===
 *   B: === Example 2: Large JSON Parsing (Worker Thread) ===
 *   C: === Example 3: Data Transformation (Worker Thread) ===
 *   D: Password hash: 7a1f2e3d4b5c6a7b8c9d0e1f2a3b... (XXXms)
 *   E: JSON size: XXX.XKB
 *   F: Parsed 10000 records in worker (XXms)
 *   G: Transformed 5000 records (XXms)
 *   H: Sample: {"name":"John Doe 0","salary":XXXXX,"tax":XXXXX}
 *   I: === Example 4: Shell Commands (Child Process) ===
 *   J: Node version via child_process: vXX.X.X
 *   K: === Example 5: Single Thread is BEST for I/O ===
 *   L: Read XXXX chars in 0ms (single thread, async ideal)
 *   M: === Example 6: HTTP Scaling (Cluster - pseudocode) ===
 *   N: const cluster = require("cluster");
 *   O: if (cluster.isMaster) { for (let i = 0; i < cpus; i++) cluster.fork(); }
 *   P: else { http.createServer(handler).listen(3000); }
 *   Q: === Decision Summary ===
 *   R: Password hashing   → Worker Thread (CPU-heavy, blocks event loop)
 *   S: Image resizing     → Worker Thread (sharp library uses workers internally)
 *   T: HTTP server scale  → Cluster / PM2 (multi-process, same port)
 *   U: FFmpeg conversion  → child_process.spawn (external binary)
 *   V: REST API handlers  → Single thread (I/O-bound, async is perfect)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "In real-world Node.js: I use worker threads for CPU-heavy tasks like    │
 * │  password hashing (pbkdf2), image processing, or large data transforms  │
 * │  - anything that would block the event loop for >50ms. For scaling an   │
 * │  HTTP server across cores, I use cluster module or PM2. For running     │
 * │  external tools like FFmpeg or Python scripts, child_process.spawn is   │
 * │  the right choice. And for typical REST API work - database queries,    │
 * │  file I/O, HTTP calls - single-threaded async/await is actually the     │
 * │  most efficient because Node's event loop handles I/O without blocking. │
 * │  The key is knowing that threads are for CPU, not I/O."                 │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/13-real-world-examples.js
 */
