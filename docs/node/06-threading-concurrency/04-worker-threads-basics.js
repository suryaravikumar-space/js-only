/**
 * TOPIC 04: Worker Threads Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ worker_threads lets you run JavaScript in PARALLEL on separate threads.  ║
 * ║ Each worker has its own V8 instance and event loop.                       ║
 * ║ Communication via postMessage() (structured clone) or SharedArrayBuffer. ║
 * ║                                                                          ║
 * ║ Use for CPU-heavy work. NOT needed for I/O (event loop handles that).    ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  You're a MANAGER (main thread) who needs help with heavy tasks.          │
 * │  You HIRE ASSISTANTS (worker threads) for CPU-heavy work.                 │
 * │                                                                            │
 * │  Manager:                                                                  │
 * │    - "Hey assistant, crunch these numbers" (postMessage)                   │
 * │    - Continues doing other work while assistant crunches                   │
 * │    - Assistant yells back "Done! Here's the result" (on 'message')        │
 * │                                                                            │
 * │  Key rules:                                                                │
 * │    - Each assistant has their own desk (V8 instance)                       │
 * │    - Messages are COPIES (not references) unless SharedArrayBuffer        │
 * │    - isMainThread tells you "Am I the manager or an assistant?"           │
 * │    - workerData is the initial task briefing given at hiring time          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Main Thread <-> Worker Communication                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   MAIN THREAD                        WORKER THREAD                        │
 * │   ┌────────────────────┐             ┌────────────────────┐               │
 * │   │ isMainThread: true │             │ isMainThread: false│               │
 * │   │                    │             │                    │               │
 * │   │ new Worker(file,   │─workerData─▶│ workerData = {...} │               │
 * │   │   { workerData })  │             │                    │               │
 * │   │                    │             │                    │               │
 * │   │ worker.postMessage │────msg────▶│ parentPort.on(msg) │               │
 * │   │                    │             │                    │               │
 * │   │ worker.on('message'│◀───msg─────│ parentPort.post    │               │
 * │   │                    │             │  Message(result)   │               │
 * │   │ worker.on('error') │◀──error────│ throw / unhandled  │               │
 * │   │ worker.on('exit')  │◀──code─────│ process.exit()     │               │
 * │   └────────────────────┘             └────────────────────┘               │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Worker, isMainThread, parentPort, workerData, threadId } = require('worker_threads');

if (isMainThread) {
  console.log('A:', `Main thread (threadId: ${threadId})`);

  // ─── 1. Basic worker with workerData ───
  const worker1 = new Worker(__filename, {
    workerData: { task: 'greet', name: 'Surya' }
  });

  worker1.on('message', (msg) => {
    console.log('C:', `Worker1 says: ${msg}`);
  });

  worker1.on('exit', (code) => {
    console.log('D:', `Worker1 exited with code ${code}`);

    // ─── 2. Worker with postMessage communication ───
    const worker2 = new Worker(__filename, {
      workerData: { task: 'calculator' }
    });

    worker2.on('message', (msg) => {
      console.log('F:', `Calculator result: ${msg}`);
    });

    // Send work AFTER worker is ready
    worker2.on('online', () => {
      console.log('E:', 'Worker2 is online, sending work...');
      worker2.postMessage({ operation: 'add', a: 10, b: 20 });
      worker2.postMessage({ operation: 'multiply', a: 5, b: 7 });
      worker2.postMessage({ operation: 'done' });
    });

    worker2.on('exit', () => {
      console.log('G:', 'Worker2 exited');

      // ─── 3. CPU-heavy work in worker ───
      console.log('\nH:', 'Offloading CPU work to worker...');
      const start = Date.now();

      const worker3 = new Worker(__filename, {
        workerData: { task: 'fibonacci', n: 40 }
      });

      worker3.on('message', (msg) => {
        console.log('I:', `Fibonacci(40) = ${msg.result}, took ${msg.time}ms in worker`);
        console.log('J:', `Main thread was FREE during that ${Date.now() - start}ms`);
      });
    });
  });

  console.log('B:', 'Main thread continues working (not blocked by workers)');

} else {
  // ─── WORKER THREAD CODE ───
  const { task } = workerData;

  if (task === 'greet') {
    parentPort.postMessage(`Hello ${workerData.name} from thread ${threadId}!`);
  }

  if (task === 'calculator') {
    parentPort.on('message', (msg) => {
      if (msg.operation === 'done') {
        process.exit(0);
        return;
      }

      let result;
      if (msg.operation === 'add') result = msg.a + msg.b;
      if (msg.operation === 'multiply') result = msg.a * msg.b;

      parentPort.postMessage(`${msg.a} ${msg.operation} ${msg.b} = ${result}`);
    });
  }

  if (task === 'fibonacci') {
    const fib = (n) => (n <= 1 ? n : fib(n - 1) + fib(n - 2));
    const start = Date.now();
    const result = fib(workerData.n);
    parentPort.postMessage({ result, time: Date.now() - start });
  }
}

/**
 * OUTPUT:
 *   A: Main thread (threadId: 0)
 *   B: Main thread continues working (not blocked by workers)
 *   C: Worker1 says: Hello Surya from thread 1!
 *   D: Worker1 exited with code 0
 *   E: Worker2 is online, sending work...
 *   F: Calculator result: 10 add 20 = 30
 *   F: Calculator result: 5 multiply 7 = 35
 *   G: Worker2 exited
 *
 *   H: Offloading CPU work to worker...
 *   I: Fibonacci(40) = 102334155, took ~800ms in worker
 *   J: Main thread was FREE during that ~800ms
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "worker_threads allows running JS in parallel threads. Each worker gets   │
 * │  its own V8 instance and event loop. Use isMainThread to check context,   │
 * │  workerData for initial data, and postMessage/on('message') for two-way   │
 * │  communication. Messages are structured-cloned (copied), not shared.      │
 * │  Use workers for CPU-heavy tasks like image processing, crypto, or        │
 * │  complex calculations. Don't use them for I/O - the event loop already   │
 * │  handles that efficiently."                                                │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/04-worker-threads-basics.js
 */
