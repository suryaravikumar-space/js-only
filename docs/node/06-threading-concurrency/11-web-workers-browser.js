/**
 * TOPIC 11: Web Workers (Browser) vs Worker Threads (Node)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Browser Web Workers and Node Worker Threads serve the same purpose:     ║
 * ║ running JS in parallel. But they differ in APIs, shared memory access,  ║
 * ║ and what's available in their scope (no DOM in workers, no fs in        ║
 * ║ browser). Node workers are MORE powerful (SharedArrayBuffer, require).  ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Both are like hiring an ASSISTANT who works in a separate room:          │
 * │                                                                            │
 * │  Browser Web Worker = Assistant in a room with NO WINDOWS (no DOM).      │
 * │                       Can only pass NOTES through the door (postMessage). │
 * │                       Cannot see or touch the main room's furniture.      │
 * │                                                                            │
 * │  Node Worker Thread = Assistant in a room with a SHARED WHITEBOARD       │
 * │                       (SharedArrayBuffer). Can use require(), has more   │
 * │                       tools. Still communicates via messages too.          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Comparison Table                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  FEATURE              BROWSER WEB WORKER      NODE WORKER THREAD          │
 * │  ───────────────────  ────────────────────    ────────────────────         │
 * │  API                  new Worker('file.js')   new Worker('file.js')       │
 * │  Communication        postMessage/onmessage   postMessage/on('message')   │
 * │  Shared Memory        SharedArrayBuffer       SharedArrayBuffer           │
 * │  require/import       importScripts()         require() / import          │
 * │  DOM Access           NO                      N/A (no DOM in Node)        │
 * │  File System          NO                      YES (require('fs'))         │
 * │  Network              fetch/XMLHttpRequest    http, net, etc.             │
 * │  Thread ID            N/A                     threadId                    │
 * │  Worker Data          N/A                     workerData (constructor)    │
 * │  MessageChannel       YES                     YES                         │
 * │  Transfer             YES (Transferable)      YES (transferList)          │
 * │  Inline Worker        Blob URL                eval string / workerData   │
 * │  Terminate            worker.terminate()      worker.terminate()          │
 * │  Process exit         N/A                     process.exit() in worker   │
 * │  Service Workers      YES                     NO                          │
 * │  Atomics              YES                     YES                         │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Worker, isMainThread, parentPort, workerData, threadId } = require('worker_threads');

if (isMainThread) {
  // ─── 1. Node Worker Thread API (runs here) ───
  console.log('A:', '=== Node Worker Threads API ===');

  const worker = new Worker(__filename, {
    workerData: { task: 'fibonacci', n: 35 }
  });

  worker.on('message', (msg) => {
    console.log('B:', `Main received: ${JSON.stringify(msg)}`);
  });

  worker.on('exit', (code) => {
    console.log('C:', `Worker exited with code ${code}`);

    // ─── 2. Browser Web Worker equivalent (pseudocode) ───
    console.log('D:', '=== Browser Web Worker Equivalent (pseudocode) ===');
    console.log('E:', '// Browser: const w = new Worker("worker.js")');
    console.log('F:', '// Browser: w.postMessage({ task: "fibonacci", n: 35 })');
    console.log('G:', '// Browser: w.onmessage = (e) => console.log(e.data)');
    console.log('H:', '// Worker:  self.onmessage = (e) => { ... self.postMessage(result) }');

    // ─── 3. Key Differences ───
    console.log('I:', '=== Key Differences ===');
    console.log('J:', 'Node: workerData passes data at construction (no browser equivalent)');
    console.log('K:', 'Node: require() works in workers (browser uses importScripts)');
    console.log('L:', 'Node: Full access to fs, net, crypto, etc.');
    console.log('M:', 'Browser: No DOM access in workers (use main thread for UI)');
    console.log('N:', 'Browser: Service Workers for caching/offline (Node has no equivalent)');

    // ─── 4. Shared Memory comparison ───
    console.log('O:', '=== Shared Memory (same in both!) ===');
    const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
    const view = new Int32Array(sab);
    Atomics.store(view, 0, 42);
    console.log('P:', `SharedArrayBuffer + Atomics work identically: ${Atomics.load(view, 0)}`);
    console.log('Q:', 'Both environments support Atomics.wait/notify for signaling');

    // ─── 5. Transfer comparison ───
    console.log('R:', '=== Transfer (same concept, similar API) ===');
    console.log('S:', 'Node:    worker.postMessage(data, [arrayBuffer])');
    console.log('T:', 'Browser: worker.postMessage(data, [arrayBuffer])');
    console.log('U:', 'Both: original buffer becomes "neutered" (0 bytes) after transfer');

    // ─── 6. When to use which ───
    console.log('V:', '=== When to Use ===');
    console.log('W:', 'Browser Web Workers: heavy computation without blocking UI');
    console.log('X:', 'Node Worker Threads: CPU-bound tasks (image processing, crypto, etc.)');
  });

  worker.postMessage({ action: 'start' });

} else {
  // ─── WORKER THREAD ───
  const { task, n } = workerData;

  function fibonacci(num) {
    if (num <= 1) return num;
    return fibonacci(num - 1) + fibonacci(num - 2);
  }

  parentPort.on('message', (msg) => {
    if (msg.action === 'start') {
      const result = fibonacci(n);
      parentPort.postMessage({
        task,
        input: n,
        result,
        threadId
      });
    }
  });
}

/**
 * OUTPUT:
 *   A: === Node Worker Threads API ===
 *   B: Main received: {"task":"fibonacci","input":35,"result":9227465,"threadId":1}
 *   C: Worker exited with code 0
 *   D: === Browser Web Worker Equivalent (pseudocode) ===
 *   E: // Browser: const w = new Worker("worker.js")
 *   F: // Browser: w.postMessage({ task: "fibonacci", n: 35 })
 *   G: // Browser: w.onmessage = (e) => console.log(e.data)
 *   H: // Worker:  self.onmessage = (e) => { ... self.postMessage(result) }
 *   I: === Key Differences ===
 *   J: Node: workerData passes data at construction (no browser equivalent)
 *   K: Node: require() works in workers (browser uses importScripts)
 *   L: Node: Full access to fs, net, crypto, etc.
 *   M: Browser: No DOM access in workers (use main thread for UI)
 *   N: Browser: Service Workers for caching/offline (Node has no equivalent)
 *   O: === Shared Memory (same in both!) ===
 *   P: SharedArrayBuffer + Atomics work identically: 42
 *   Q: Both environments support Atomics.wait/notify for signaling
 *   R: === Transfer (same concept, similar API) ===
 *   S: Node:    worker.postMessage(data, [arrayBuffer])
 *   T: Browser: worker.postMessage(data, [arrayBuffer])
 *   U: Both: original buffer becomes "neutered" (0 bytes) after transfer
 *   V: === When to Use ===
 *   W: Browser Web Workers: heavy computation without blocking UI
 *   X: Node Worker Threads: CPU-bound tasks (image processing, crypto, etc.)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Browser Web Workers and Node Worker Threads both run JavaScript in      │
 * │  parallel threads. The API is similar - postMessage for communication,   │
 * │  SharedArrayBuffer for shared memory. Key differences: Node workers     │
 * │  can use require() and access the full Node API (fs, net, etc.), while  │
 * │  browser workers can't access the DOM. Node has workerData for passing  │
 * │  data at construction. Browser has Service Workers for offline/caching  │
 * │  which Node doesn't have. Both support Atomics and transfer lists.      │
 * │  Use browser workers for heavy computation without blocking UI, and     │
 * │  Node workers for CPU-bound server tasks."                               │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/11-web-workers-browser.js
 */
