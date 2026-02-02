/**
 * TOPIC 02: Concurrency vs Parallelism
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Concurrency = dealing with MULTIPLE things at once (structure).          ║
 * ║ Parallelism = doing MULTIPLE things at once (execution).                 ║
 * ║                                                                          ║
 * ║ Node.js JavaScript is CONCURRENT (event loop) but NOT parallel.          ║
 * ║ Node.js libuv thread pool and worker_threads enable true parallelism.    ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  CONCURRENCY = ONE chef juggling multiple dishes.                         │
 * │    - Chef puts pasta to boil, starts chopping onions, checks on sauce    │
 * │    - Only ONE pair of hands, but manages many tasks by switching          │
 * │    - Nothing is truly happening simultaneously                            │
 * │    - Smart SCHEDULING makes it feel parallel                              │
 * │                                                                            │
 * │  PARALLELISM = MULTIPLE chefs cooking simultaneously.                     │
 * │    - Chef A makes pasta, Chef B makes salad, Chef C makes dessert        │
 * │    - Tasks TRULY happen at the same time                                  │
 * │    - Requires multiple workers (CPU cores/threads)                        │
 * │                                                                            │
 * │  Node.js event loop = the ONE chef (concurrent).                          │
 * │  Worker threads / cluster = hiring more chefs (parallel).                 │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Concurrency vs Parallelism                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  CONCURRENCY (one thread, interleaved)                                    │
 * │  Time ──────────────────────────────────▶                                 │
 * │  Thread 1: ░░░AAA░░BBB░░AAA░░CCC░░BBB░░                                  │
 * │            switch  switch  switch  switch                                 │
 * │  (One worker, many tasks, fast switching)                                 │
 * │                                                                            │
 * │  PARALLELISM (multiple threads, simultaneous)                             │
 * │  Time ──────────────────────────────────▶                                 │
 * │  Thread 1: ░░░AAAAAAAAAAAAA░░░░░░░░░░░░                                  │
 * │  Thread 2: ░░░BBBBBBBBBBBBB░░░░░░░░░░░░                                  │
 * │  Thread 3: ░░░CCCCCCCCCCCCC░░░░░░░░░░░░                                  │
 * │  (Multiple workers, truly simultaneous)                                   │
 * │                                                                            │
 * │  NODE.JS REALITY:                                                         │
 * │  ┌─────────────────┐    ┌──────────────────────┐                          │
 * │  │ Event Loop (1)  │    │ libuv Thread Pool (4)│                          │
 * │  │ Concurrent JS   │───▶│ Parallel I/O & Crypto│                          │
 * │  │ (not parallel)  │    │ (true parallelism)   │                          │
 * │  └─────────────────┘    └──────────────────────┘                          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── 1. Concurrency demo: async tasks interleaved on one thread ───
const simulateAsync = (name, ms) => new Promise((resolve) => {
  setTimeout(() => {
    console.log(`  ${name} completed after ${ms}ms`);
    resolve();
  }, ms);
});

const concurrencyDemo = async () => {
  console.log('A:', '--- CONCURRENCY (one thread, interleaved) ---');
  const start = Date.now();

  // All start at once, but JS thread handles them one callback at a time
  await Promise.all([
    simulateAsync('Task-A', 100),
    simulateAsync('Task-B', 150),
    simulateAsync('Task-C', 80),
  ]);

  console.log('B:', `All done in ${Date.now() - start}ms (NOT 330ms - they overlapped!)`);
};

// ─── 2. Parallelism demo: worker threads running truly simultaneously ───
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const cpuWork = (iterations) => {
  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += Math.sqrt(i);
  }
  return sum;
};

const parallelismDemo = () => {
  return new Promise((resolve) => {
    console.log('\nC:', '--- PARALLELISM (multiple threads, simultaneous) ---');
    const start = Date.now();
    const WORK = 20_000_000;
    let completed = 0;

    // Spawn 4 workers doing CPU work in parallel
    for (let i = 0; i < 4; i++) {
      const worker = new Worker(__filename, {
        workerData: { task: 'cpu-work', iterations: WORK, id: i }
      });

      worker.on('message', (msg) => {
        console.log(`  Worker-${msg.id} done in ${msg.time}ms`);
        completed++;
        if (completed === 4) {
          console.log('D:', `All 4 parallel workers done in ${Date.now() - start}ms`);
          resolve();
        }
      });
    }
  });
};

// ─── 3. Sequential (no concurrency, no parallelism) ───
const sequentialDemo = () => {
  console.log('\nE:', '--- SEQUENTIAL (one by one, baseline) ---');
  const start = Date.now();
  const WORK = 20_000_000;

  for (let i = 0; i < 4; i++) {
    cpuWork(WORK);
    console.log(`  Sequential task ${i} done at ${Date.now() - start}ms`);
  }

  console.log('F:', `All 4 sequential tasks done in ${Date.now() - start}ms`);
};

if (isMainThread) {
  const run = async () => {
    await concurrencyDemo();
    sequentialDemo();
    await parallelismDemo();
    console.log('\nG:', 'Notice: parallel is faster than sequential for CPU work!');
  };
  run();
} else {
  // Worker thread: do CPU-heavy work
  const start = Date.now();
  cpuWork(workerData.iterations);
  parentPort.postMessage({ id: workerData.id, time: Date.now() - start });
}

/**
 * OUTPUT:
 *   A: --- CONCURRENCY (one thread, interleaved) ---
 *     Task-C completed after 80ms
 *     Task-A completed after 100ms
 *     Task-B completed after 150ms
 *   B: All done in ~150ms (NOT 330ms - they overlapped!)
 *
 *   E: --- SEQUENTIAL (one by one, baseline) ---
 *     Sequential task 0 done at ~50ms
 *     Sequential task 1 done at ~100ms
 *     Sequential task 2 done at ~150ms
 *     Sequential task 3 done at ~200ms
 *   F: All 4 sequential tasks done in ~200ms
 *
 *   C: --- PARALLELISM (multiple threads, simultaneous) ---
 *     Worker-0 done in ~55ms
 *     Worker-1 done in ~55ms
 *     Worker-2 done in ~55ms
 *     Worker-3 done in ~55ms
 *   D: All 4 parallel workers done in ~70ms
 *
 *   G: Notice: parallel is faster than sequential for CPU work!
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Concurrency means dealing with multiple tasks at once by interleaving    │
 * │  them on a single thread - like the Node.js event loop handling many I/O  │
 * │  operations. Parallelism means actually executing tasks simultaneously    │
 * │  on multiple CPU cores - like worker_threads or cluster. Node's event     │
 * │  loop is concurrent but not parallel for JS code. For CPU-heavy work,    │
 * │  we need worker_threads (true parallelism) or cluster (multi-process)."  │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/02-concurrency-vs-parallelism.js
 */
