/**
 * TOPIC 12: Performance Comparison
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Single thread: No overhead, best for I/O and light CPU work.            ║
 * ║ Worker threads: ~5ms startup, shared memory, best for CPU-bound tasks.  ║
 * ║ Cluster: ~30ms startup, full isolation, best for scaling HTTP servers.  ║
 * ║ ALWAYS benchmark YOUR use case - overhead can exceed the benefit.       ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Carrying boxes across a room:                                             │
 * │                                                                            │
 * │  Single person (single thread):                                            │
 * │    → Fastest for 1-2 boxes (no coordination needed)                       │
 * │                                                                            │
 * │  Team in same room (worker threads):                                       │
 * │    → Great for many boxes. Small coordination cost. Can share a cart.     │
 * │                                                                            │
 * │  Teams in separate buildings (cluster):                                    │
 * │    → Each team has own cart. If one building floods, others continue.     │
 * │    → But moving boxes BETWEEN buildings is slow (IPC).                    │
 * │                                                                            │
 * │  The WORST mistake: hiring a team to move ONE box.                        │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Performance Characteristics                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  APPROACH        STARTUP   MEMORY     COMMUNICATION   BEST FOR            │
 * │  ─────────────   ───────   ────────   ─────────────   ──────────────      │
 * │  Single Thread   0ms       baseline   N/A             I/O, light CPU      │
 * │  Worker Thread   ~5ms      +2MB/ea    fast (shared)   CPU-bound tasks     │
 * │  Cluster/fork    ~30ms     +30MB/ea   slow (IPC/JSON) HTTP scaling        │
 * │                                                                            │
 * │  CPU-bound task speedup:                                                   │
 * │  ┌────────────────────────────────────────────────┐                       │
 * │  │ 1 thread:  ████████████████████████████ 100%   │                       │
 * │  │ 2 threads: ██████████████ 50%                  │                       │
 * │  │ 4 threads: ███████ 25%                         │                       │
 * │  │ 8 threads: ████ ~14% (diminishing returns)     │                       │
 * │  └────────────────────────────────────────────────┘                       │
 * │  (Linear speedup is theoretical max - overhead reduces it)                │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');

if (isMainThread) {
  // ─── Benchmark helper ───
  function benchmark(label, fn) {
    const start = process.hrtime.bigint();
    return Promise.resolve(fn()).then(result => {
      const end = process.hrtime.bigint();
      const ms = Number(end - start) / 1e6;
      return { label, ms: ms.toFixed(2), result };
    });
  }

  // ─── CPU-bound task: fibonacci ───
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  const FIB_N = 38;
  const NUM_TASKS = 4;
  const NUM_CPUS = os.cpus().length;

  console.log('A:', `=== Performance Comparison: fib(${FIB_N}) x ${NUM_TASKS} tasks ===`);
  console.log('B:', `CPU cores: ${NUM_CPUS}`);

  // ─── 1. Single Thread (sequential) ───
  benchmark('Single Thread (sequential)', () => {
    const results = [];
    for (let i = 0; i < NUM_TASKS; i++) {
      results.push(fibonacci(FIB_N));
    }
    return results[0];
  }).then(single => {
    console.log('C:', `${single.label}: ${single.ms}ms (result: ${single.result})`);

    // ─── 2. Worker Threads (parallel) ───
    return benchmark('Worker Threads (parallel)', () => {
      return new Promise((resolve) => {
        let completed = 0;
        const results = [];
        const workerCount = Math.min(NUM_TASKS, NUM_CPUS);

        for (let i = 0; i < workerCount; i++) {
          const w = new Worker(__filename, {
            workerData: { n: FIB_N, mode: 'fibonacci' }
          });
          w.on('message', (result) => {
            results.push(result);
            completed++;
            if (completed === workerCount) resolve(results[0]);
          });
        }
      });
    });
  }).then(threaded => {
    console.log('D:', `${threaded.label}: ${threaded.ms}ms (result: ${threaded.result})`);

    // ─── 3. Measure worker startup overhead ───
    return benchmark('Worker startup overhead (1 worker)', () => {
      return new Promise((resolve) => {
        const w = new Worker(__filename, {
          workerData: { n: 1, mode: 'fibonacci' }
        });
        w.on('message', (result) => resolve(result));
      });
    });
  }).then(startup => {
    console.log('E:', `${startup.label}: ${startup.ms}ms`);

    // ─── 4. Message passing overhead ───
    return benchmark('Message passing (1000 round-trips)', () => {
      return new Promise((resolve) => {
        const w = new Worker(__filename, {
          workerData: { mode: 'echo' }
        });
        let count = 0;
        w.on('message', () => {
          count++;
          if (count >= 1000) {
            w.terminate();
            resolve(count);
          } else {
            w.postMessage(count);
          }
        });
        w.postMessage(0);
      });
    });
  }).then(messaging => {
    console.log('F:', `${messaging.label}: ${messaging.ms}ms (${messaging.result} msgs)`);

    // ─── 5. SharedArrayBuffer vs postMessage ───
    return benchmark('SharedArrayBuffer write (1M operations)', () => {
      const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
      const view = new Int32Array(sab);
      for (let i = 0; i < 1000000; i++) {
        Atomics.add(view, 0, 1);
      }
      return Atomics.load(view, 0);
    });
  }).then(shared => {
    console.log('G:', `${shared.label}: ${shared.ms}ms (result: ${shared.result})`);

    // ─── 6. Summary ───
    console.log('H:', '=== Summary ===');
    console.log('I:', 'Single thread: Zero overhead. Use for I/O-bound or quick CPU tasks.');
    console.log('J:', 'Worker threads: ~5ms startup. Worth it when CPU work > 50ms.');
    console.log('K:', 'Cluster: ~30ms startup. Best for HTTP server scaling.');
    console.log('L:', 'Rule of thumb: threads = CPU cores for CPU-bound work.');
    console.log('M:', 'SharedArrayBuffer is MUCH faster than postMessage for frequent data sharing.');
    console.log('N:', 'ALWAYS benchmark - parallelism overhead can exceed single-thread time for small tasks.');
  });

} else {
  // ─── WORKER ───
  const { n, mode } = workerData;

  if (mode === 'fibonacci') {
    function fibonacci(num) {
      if (num <= 1) return num;
      return fibonacci(num - 1) + fibonacci(num - 2);
    }
    parentPort.postMessage(fibonacci(n));
  } else if (mode === 'echo') {
    parentPort.on('message', (msg) => {
      parentPort.postMessage(msg);
    });
  }
}

/**
 * OUTPUT:
 *   A: === Performance Comparison: fib(38) x 4 tasks ===
 *   B: CPU cores: 8
 *   C: Single Thread (sequential): ~2400ms (result: 39088169)
 *   D: Worker Threads (parallel): ~700ms (result: 39088169)
 *   E: Worker startup overhead (1 worker): ~5ms
 *   F: Message passing (1000 round-trips): ~80ms (1000 msgs)
 *   G: SharedArrayBuffer write (1M operations): ~15ms (result: 1000000)
 *   H: === Summary ===
 *   I: Single thread: Zero overhead. Use for I/O-bound or quick CPU tasks.
 *   J: Worker threads: ~5ms startup. Worth it when CPU work > 50ms.
 *   K: Cluster: ~30ms startup. Best for HTTP server scaling.
 *   L: Rule of thumb: threads = CPU cores for CPU-bound work.
 *   M: SharedArrayBuffer is MUCH faster than postMessage for frequent data sharing.
 *   N: ALWAYS benchmark - parallelism overhead can exceed single-thread time for small tasks.
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "For performance, single-threaded Node is best for I/O-bound work since │
 * │  there's zero coordination overhead. Worker threads shine for CPU-bound  │
 * │  tasks - they add ~5ms startup per worker but can divide work across    │
 * │  cores for near-linear speedup. Cluster processes have ~30ms startup    │
 * │  and ~30MB memory each but provide full isolation for HTTP scaling.     │
 * │  The key is to benchmark: parallelism is only worth it when the task    │
 * │  takes significantly longer than the coordination overhead. Use         │
 * │  SharedArrayBuffer over postMessage for high-frequency data sharing     │
 * │  between threads - it's orders of magnitude faster."                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/12-performance-comparison.js
 */
