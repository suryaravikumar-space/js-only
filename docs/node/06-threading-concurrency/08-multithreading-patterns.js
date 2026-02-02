/**
 * TOPIC 08: Multithreading Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Thread Pool Pattern: Pre-create workers, queue tasks, reuse threads.    ║
 * ║ Worker Communication: postMessage/on('message') for structured data,    ║
 * ║ SharedArrayBuffer for high-performance shared state.                    ║
 * ║ Always match thread count to CPU cores for CPU-bound work.              ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a TAXI COMPANY:                                                  │
 * │                                                                            │
 * │  Thread Pool  = Fleet of taxis parked and READY                           │
 * │  Task Queue   = Customer requests waiting in line                          │
 * │  Worker       = Individual taxi driver                                     │
 * │                                                                            │
 * │  You DON'T hire a new driver for each customer (too expensive).           │
 * │  You DON'T have 1000 drivers for 4 roads (diminishing returns).           │
 * │  You keep N drivers (= CPU cores) and queue overflow requests.            │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Thread Pool Pattern                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  MAIN THREAD                                                              │
 * │  ┌─────────────────────────────────────────────┐                          │
 * │  │  Task Queue: [task1, task2, task3, task4...] │                          │
 * │  └─────────────┬───────────────────────────────┘                          │
 * │                │ dequeue                                                   │
 * │        ┌───────┼───────┐                                                  │
 * │        ▼       ▼       ▼                                                  │
 * │  ┌─────────┐┌─────────┐┌─────────┐                                       │
 * │  │Worker 1 ││Worker 2 ││Worker 3 │  (pool size = CPU cores)              │
 * │  │ [busy]  ││ [busy]  ││ [idle]  │                                       │
 * │  └────┬────┘└────┬────┘└─────────┘                                       │
 * │       │          │                                                        │
 * │       ▼          ▼                                                        │
 * │  result cb    result cb   → resolve Promise → next task from queue       │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');

if (isMainThread) {
  // ─── 1. Simple Thread Pool Implementation ───
  console.log('A:', '=== Thread Pool Pattern ===');

  class ThreadPool {
    constructor(size, workerScript) {
      this.size = size;
      this.workerScript = workerScript;
      this.workers = [];
      this.freeWorkers = [];
      this.taskQueue = [];

      for (let i = 0; i < size; i++) {
        this._addWorker();
      }
    }

    _addWorker() {
      const worker = new Worker(this.workerScript);
      worker.on('message', (result) => {
        worker._resolve(result);
        this.freeWorkers.push(worker);
        this._processQueue();
      });
      worker.on('error', (err) => {
        worker._reject(err);
      });
      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }

    _processQueue() {
      if (this.taskQueue.length === 0 || this.freeWorkers.length === 0) return;
      const { data, resolve, reject } = this.taskQueue.shift();
      const worker = this.freeWorkers.pop();
      worker._resolve = resolve;
      worker._reject = reject;
      worker.postMessage(data);
    }

    run(data) {
      return new Promise((resolve, reject) => {
        this.taskQueue.push({ data, resolve, reject });
        this._processQueue();
      });
    }

    destroy() {
      for (const worker of this.workers) {
        worker.terminate();
      }
    }
  }

  // ─── 2. Use the thread pool ───
  const POOL_SIZE = 2;
  console.log('B:', `Creating pool with ${POOL_SIZE} workers`);

  const pool = new ThreadPool(POOL_SIZE, __filename);

  const tasks = [10, 20, 30, 40, 50];
  console.log('C:', `Submitting ${tasks.length} tasks to ${POOL_SIZE} workers`);

  const start = Date.now();

  Promise.all(tasks.map((n, i) =>
    pool.run({ number: n, taskId: i }).then(result => {
      console.log(`D: Task ${result.taskId} → fib(${result.input}) = ${result.result} [worker ${result.workerId}]`);
      return result;
    })
  )).then((results) => {
    console.log('E:', `All ${results.length} tasks done in ${Date.now() - start}ms`);

    // ─── 3. Worker Communication Patterns ───
    console.log('F:', '=== Communication Patterns ===');
    console.log('G:', 'Pattern 1: postMessage (structured clone - copies data)');
    console.log('H:', 'Pattern 2: SharedArrayBuffer (zero-copy shared memory)');
    console.log('I:', 'Pattern 3: Transfer (move ownership, zero-copy)');
    console.log('J:', 'Pattern 4: MessageChannel (direct worker-to-worker)');

    // ─── 4. MessageChannel: Worker-to-Worker ───
    const { MessageChannel } = require('worker_threads');
    const { port1, port2 } = new MessageChannel();
    console.log('K:', 'MessageChannel created - enables direct worker-to-worker comms');
    console.log('L:', 'port1 and port2 can be transferred to different workers');
    port1.close();
    port2.close();

    pool.destroy();
    console.log('M:', 'Pool destroyed - all workers terminated');
  });

} else {
  // ─── WORKER: Compute fibonacci ───
  const { threadId } = require('worker_threads');

  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  parentPort.on('message', (task) => {
    const result = fibonacci(task.number);
    parentPort.postMessage({
      taskId: task.taskId,
      input: task.number,
      result: result,
      workerId: threadId
    });
  });
}

/**
 * OUTPUT:
 *   A: === Thread Pool Pattern ===
 *   B: Creating pool with 2 workers
 *   C: Submitting 5 tasks to 2 workers
 *   D: Task 0 → fib(10) = 55 [worker 1]
 *   D: Task 1 → fib(20) = 6765 [worker 2]
 *   D: Task 2 → fib(30) = 832040 [worker 1]
 *   D: Task 3 → fib(40) = 102334155 [worker 2]
 *   D: Task 4 → fib(50) = 12586269025 [worker 1]
 *   E: All 5 tasks done in XXXms
 *   F: === Communication Patterns ===
 *   G: Pattern 1: postMessage (structured clone - copies data)
 *   H: Pattern 2: SharedArrayBuffer (zero-copy shared memory)
 *   I: Pattern 3: Transfer (move ownership, zero-copy)
 *   J: Pattern 4: MessageChannel (direct worker-to-worker)
 *   K: MessageChannel created - enables direct worker-to-worker comms
 *   L: port1 and port2 can be transferred to different workers
 *   M: Pool destroyed - all workers terminated
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "The thread pool pattern pre-creates a fixed number of worker threads    │
 * │  (typically matching CPU core count) and queues tasks. When a worker     │
 * │  finishes, it picks the next task from the queue. This avoids the       │
 * │  overhead of constantly creating/destroying threads. Communication       │
 * │  between threads happens via postMessage (structured clone), shared      │
 * │  memory (SharedArrayBuffer + Atomics), transfer lists (zero-copy move), │
 * │  or MessageChannel for direct worker-to-worker communication. The key   │
 * │  is to never create more threads than cores for CPU-bound work."        │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/08-multithreading-patterns.js
 */
