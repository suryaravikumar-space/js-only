/**
 * TOPIC 09: Multiprocessing Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Processes are ISOLATED - separate memory, separate V8 instances.        ║
 * ║ Communication happens via IPC (Inter-Process Communication).            ║
 * ║ Crash in one process NEVER brings down others (unlike threads).         ║
 * ║ Higher memory overhead but maximum isolation and stability.              ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine separate OFFICE BUILDINGS (processes) vs. rooms in one building  │
 * │  (threads).                                                                │
 * │                                                                            │
 * │  Threads  = Employees in one building sharing the break room.             │
 * │             Fast to talk, but if the building burns, ALL are gone.        │
 * │  Processes = Separate buildings with their own break rooms.               │
 * │             Must use PHONE (IPC) to communicate, but if one burns,       │
 * │             the others are completely fine.                                │
 * │                                                                            │
 * │  Use processes when ISOLATION matters more than speed.                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Process Pool with IPC                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  ┌─────────────────────────────────────────────┐                          │
 * │  │            MASTER PROCESS                    │                          │
 * │  │  ┌──────────────────────────────┐           │                          │
 * │  │  │ Task Queue: [t1, t2, t3...] │           │                          │
 * │  │  └──────────────────────────────┘           │                          │
 * │  └───────┬──────────┬──────────┬───────────────┘                          │
 * │      IPC │      IPC │      IPC │                                          │
 * │   (JSON) │   (JSON) │   (JSON) │                                          │
 * │          │          │          │                                           │
 * │  ┌───────▼───┐┌─────▼─────┐┌──▼────────┐                                │
 * │  │ Process 1 ││ Process 2 ││ Process 3 │                                │
 * │  │ Own V8    ││ Own V8    ││ Own V8    │                                │
 * │  │ Own Heap  ││ Own Heap  ││ Own Heap  │                                │
 * │  │ PID: 101  ││ PID: 102  ││ PID: 103  │                                │
 * │  └───────────┘└───────────┘└───────────┘                                │
 * │                                                                            │
 * │  IPC Methods:                                                              │
 * │  ├── process.send() / process.on('message')  (fork built-in)             │
 * │  ├── Unix Domain Sockets / Named Pipes                                    │
 * │  ├── Shared files / databases (Redis, etc.)                               │
 * │  └── TCP/HTTP between processes                                           │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { fork, spawn } = require('child_process');
const path = require('path');

// ─── 1. Process Pool Pattern ───
console.log('A:', '=== Process Pool Pattern ===');

class ProcessPool {
  constructor(size, script) {
    this.size = size;
    this.script = script;
    this.pool = [];
    this.freePool = [];
    this.taskQueue = [];

    for (let i = 0; i < size; i++) {
      this._createProcess();
    }
  }

  _createProcess() {
    // Use spawn with IPC since we can't fork to a separate file in demo
    const child = spawn('node', ['-e', `
      process.on('message', (task) => {
        // Simulate CPU work
        let result = 0;
        for (let i = 0; i < task.iterations; i++) {
          result += Math.sqrt(i);
        }
        process.send({ taskId: task.taskId, result: Math.floor(result), pid: process.pid });
      });
      process.send({ ready: true, pid: process.pid });
    `], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

    child._busy = false;
    child._ready = false;

    child.on('message', (msg) => {
      if (msg.ready) {
        child._ready = true;
        this.freePool.push(child);
        this._processQueue();
        return;
      }
      child._busy = false;
      if (child._taskResolve) {
        child._taskResolve(msg);
      }
      this.freePool.push(child);
      this._processQueue();
    });

    this.pool.push(child);
  }

  _processQueue() {
    while (this.taskQueue.length > 0 && this.freePool.length > 0) {
      const { task, resolve } = this.taskQueue.shift();
      const child = this.freePool.pop();
      child._busy = true;
      child._taskResolve = resolve;
      child.send(task);
    }
  }

  run(task) {
    return new Promise((resolve) => {
      this.taskQueue.push({ task, resolve });
      this._processQueue();
    });
  }

  destroy() {
    this.pool.forEach(child => child.kill());
  }
}

// ─── 2. Use the Process Pool ───
const POOL_SIZE = 2;
console.log('B:', `Creating process pool with ${POOL_SIZE} processes`);

const pool = new ProcessPool(POOL_SIZE, __filename);

// Wait for processes to be ready, then submit tasks
setTimeout(() => {
  const tasks = [
    { taskId: 0, iterations: 100000 },
    { taskId: 1, iterations: 200000 },
    { taskId: 2, iterations: 150000 },
    { taskId: 3, iterations: 100000 },
  ];

  console.log('C:', `Submitting ${tasks.length} tasks`);
  const start = Date.now();

  Promise.all(tasks.map(task =>
    pool.run(task).then(result => {
      console.log(`D: Task ${result.taskId} done by PID ${result.pid}, result=${result.result}`);
      return result;
    })
  )).then(() => {
    console.log('E:', `All tasks completed in ${Date.now() - start}ms`);

    // ─── 3. IPC Patterns ───
    console.log('F:', '=== IPC Communication Patterns ===');
    console.log('G:', 'Pattern 1: JSON messages via process.send() (built-in with fork)');
    console.log('H:', 'Pattern 2: stdout/stdin pipes (spawn, works with any language)');
    console.log('I:', 'Pattern 3: Shared database/Redis (for complex state)');
    console.log('J:', 'Pattern 4: Unix domain sockets (fast local IPC)');

    // ─── 4. Process isolation advantage ───
    console.log('K:', '=== Process Isolation ===');
    console.log('L:', 'Each process has ~30-50MB base memory overhead');
    console.log('M:', 'But crash isolation: one dying process does not affect others');
    console.log('N:', 'Threads share memory (~2MB each) but one crash kills all');

    pool.destroy();
    console.log('O:', 'Process pool destroyed');
  });
}, 500);

/**
 * OUTPUT:
 *   A: === Process Pool Pattern ===
 *   B: Creating process pool with 2 processes
 *   C: Submitting 4 tasks
 *   D: Task 0 done by PID XXXXX, result=XXXXX
 *   D: Task 1 done by PID XXXXX, result=XXXXX
 *   D: Task 2 done by PID XXXXX, result=XXXXX
 *   D: Task 3 done by PID XXXXX, result=XXXXX
 *   E: All tasks completed in XXXms
 *   F: === IPC Communication Patterns ===
 *   G: Pattern 1: JSON messages via process.send() (built-in with fork)
 *   H: Pattern 2: stdout/stdin pipes (spawn, works with any language)
 *   I: Pattern 3: Shared database/Redis (for complex state)
 *   J: Pattern 4: Unix domain sockets (fast local IPC)
 *   K: === Process Isolation ===
 *   L: Each process has ~30-50MB base memory overhead
 *   M: But crash isolation: one dying process does not affect others
 *   N: Threads share memory (~2MB each) but one crash kills all
 *   O: Process pool destroyed
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Multiprocessing in Node means forking separate OS processes, each with  │
 * │  its own V8 engine and memory space. Communication happens through IPC   │
 * │  - typically JSON messages via process.send(). The process pool pattern  │
 * │  pre-creates a fixed number of child processes and queues tasks to them. │
 * │  The main advantage over threads is crash isolation - a segfault or      │
 * │  unhandled exception in one process doesn't take down the others.       │
 * │  The trade-off is higher memory overhead (~30-50MB per process vs ~2MB  │
 * │  per thread) and IPC serialization cost. Use processes for stability-   │
 * │  critical work, threads for performance-critical CPU-bound work."       │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/09-multiprocessing-patterns.js
 */
