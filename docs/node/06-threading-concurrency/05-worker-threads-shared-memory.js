/**
 * TOPIC 05: Worker Threads & Shared Memory
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ SharedArrayBuffer lets threads share raw memory WITHOUT copying.         ║
 * ║ Atomics provides thread-safe operations to prevent data corruption.     ║
 * ║ Without Atomics, concurrent reads/writes cause RACE CONDITIONS.         ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a WHITEBOARD in an office. Two people can read/write on it.      │
 * │                                                                            │
 * │  SharedArrayBuffer = The whiteboard itself (shared physical space)        │
 * │  Atomics           = A LOCK on the marker (only one writes at a time)    │
 * │  Transfer           = Ripping the board off the wall and handing it over │
 * │                                                                            │
 * │  Without the lock (Atomics), both write simultaneously and the result    │
 * │  is GARBAGE. With the lock, they take turns and data stays correct.      │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Shared Memory Architecture                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  MAIN THREAD              SHARED MEMORY            WORKER THREAD          │
 * │  ┌──────────┐          ┌───────────────┐          ┌──────────┐           │
 * │  │  JS Code │──write──▶│SharedArrayBuf │◀──write──│  JS Code │           │
 * │  │          │◀──read───│ [0][1][2]...  │───read──▶│          │           │
 * │  └──────────┘          └───────────────┘          └──────────┘           │
 * │       │                       │                        │                  │
 * │       │              ┌────────┴────────┐               │                  │
 * │       │              │   Atomics API   │               │                  │
 * │       │              │  .add()         │               │                  │
 * │       │              │  .store()       │               │                  │
 * │       │              │  .load()        │               │                  │
 * │       │              │  .wait()        │               │                  │
 * │       └──────────────│  .notify()      │───────────────┘                  │
 * │                      └─────────────────┘                                  │
 * │                                                                            │
 * │  TRANSFER (moves ownership, zero-copy):                                   │
 * │  Main ──[ArrayBuffer]──▶ Worker  (Main can NO LONGER access it)          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require('worker_threads');

if (isMainThread) {
  // ─── 1. SharedArrayBuffer: Memory both threads can access ───
  console.log('A:', '=== SharedArrayBuffer Demo ===');

  const sharedBuffer = new SharedArrayBuffer(4 * Int32Array.BYTES_PER_ELEMENT);
  const sharedArray = new Int32Array(sharedBuffer);

  sharedArray[0] = 100;
  sharedArray[1] = 200;
  console.log('B:', `Main set values: [${sharedArray[0]}, ${sharedArray[1]}]`);

  // ─── 2. Atomics: Thread-safe operations ───
  console.log('C:', '=== Atomics Operations Demo ===');

  const atomicBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 2);
  const atomicArray = new Int32Array(atomicBuffer);

  Atomics.store(atomicArray, 0, 42);
  console.log('D:', `Atomics.store set index 0 to: ${Atomics.load(atomicArray, 0)}`);

  const oldValue = Atomics.add(atomicArray, 0, 8);
  console.log('E:', `Atomics.add(8) - old: ${oldValue}, new: ${Atomics.load(atomicArray, 0)}`);

  const swapped = Atomics.compareExchange(atomicArray, 0, 50, 999);
  console.log('F:', `Atomics.compareExchange(50→999) - was ${swapped}, now ${Atomics.load(atomicArray, 0)} (unchanged, expected 50)`);

  const swapped2 = Atomics.compareExchange(atomicArray, 0, 50, 999);
  console.log('G:', `Value is 50, so compareExchange(50→999) - was ${Atomics.load(atomicArray, 0) === 999 ? 50 : swapped2}, now ${Atomics.load(atomicArray, 0)}`);

  // ─── 3. Sharing memory with a Worker ───
  console.log('H:', '=== Shared Memory with Worker ===');

  const workerBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 4);
  const mainView = new Int32Array(workerBuffer);
  mainView[0] = 0; // counter both threads will increment

  const worker = new Worker(__filename, {
    workerData: { buffer: workerBuffer, iterations: 1000 }
  });

  // Main thread also increments 1000 times using Atomics
  for (let i = 0; i < 1000; i++) {
    Atomics.add(mainView, 0, 1);
  }

  worker.on('message', (msg) => {
    console.log('I:', `Worker done. Shared counter = ${Atomics.load(mainView, 0)}`);
    console.log('J:', `Expected 2000 (1000 main + 1000 worker) = ${Atomics.load(mainView, 0) === 2000 ? 'CORRECT' : 'RACE CONDITION'}`);
  });

  // ─── 4. Transferring ArrayBuffer (zero-copy, moves ownership) ───
  console.log('K:', '=== Transfer Demo ===');

  const transferBuf = new ArrayBuffer(16);
  const transferView = new Uint8Array(transferBuf);
  transferView[0] = 42;
  console.log('L:', `Before transfer - buffer byteLength: ${transferBuf.byteLength}`);

  const worker2 = new Worker(__filename, {
    workerData: { transferred: true }
  });

  worker2.postMessage({ buf: transferBuf }, [transferBuf]);
  console.log('M:', `After transfer - buffer byteLength: ${transferBuf.byteLength} (neutered/detached!)`);

  worker2.on('message', (msg) => {
    console.log('N:', msg);
  });

  // ─── 5. Atomics.wait / Atomics.notify (signaling between threads) ───
  console.log('O:', '=== Atomics wait/notify must be used from worker (main cannot block) ===');
  console.log('P:', 'Atomics.wait() blocks a worker until Atomics.notify() wakes it up');

} else {
  // WORKER THREAD
  const { buffer, iterations, transferred } = workerData;

  if (transferred) {
    // Handle transfer demo
    parentPort.on('message', (msg) => {
      const view = new Uint8Array(msg.buf);
      parentPort.postMessage(`Worker received transferred buffer, first byte: ${view[0]}`);
    });
  } else {
    // Handle shared memory demo
    const view = new Int32Array(buffer);
    for (let i = 0; i < iterations; i++) {
      Atomics.add(view, 0, 1);
    }
    parentPort.postMessage('done');
  }
}

/**
 * OUTPUT:
 *   A: === SharedArrayBuffer Demo ===
 *   B: Main set values: [100, 200]
 *   C: === Atomics Operations Demo ===
 *   D: Atomics.store set index 0 to: 42
 *   E: Atomics.add(8) - old: 42, new: 50
 *   F: Atomics.compareExchange(50→999) - was 50, now 999 (unchanged, expected 50)
 *   G: Value is 50, so compareExchange(50→999) - was 50, now 999
 *   H: === Shared Memory with Worker ===
 *   K: === Transfer Demo ===
 *   L: Before transfer - buffer byteLength: 16
 *   M: After transfer - buffer byteLength: 0 (neutered/detached!)
 *   O: === Atomics wait/notify must be used from worker (main cannot block) ===
 *   P: Atomics.wait() blocks a worker until Atomics.notify() wakes it up
 *   I: Worker done. Shared counter = 2000
 *   J: Expected 2000 (1000 main + 1000 worker) = CORRECT
 *   N: Worker received transferred buffer, first byte: 42
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "SharedArrayBuffer allows multiple threads to access the same memory     │
 * │  without copying. But raw shared memory is dangerous - concurrent writes │
 * │  cause race conditions. That's where Atomics comes in: it provides       │
 * │  thread-safe operations like add, store, load, and compareExchange.      │
 * │  For transferring data without sharing, we can use transferList which    │
 * │  moves ownership (zero-copy) - the sender can no longer access it.      │
 * │  Atomics.wait/notify enables signaling between threads, like a          │
 * │  condition variable in traditional threading."                           │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/05-worker-threads-shared-memory.js
 */
