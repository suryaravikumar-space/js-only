/**
 * TOPIC 01: Process vs Thread
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Process = independent program with its OWN memory space.                 ║
 * ║ Thread  = lightweight unit of execution WITHIN a process, sharing memory.║
 * ║                                                                          ║
 * ║ Processes are ISOLATED. Threads SHARE memory.                            ║
 * ║ Crash in one process? Others survive. Crash in a thread? Process dies.   ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  PROCESS = Separate HOUSES on a street.                                   │
 * │    - Each house has its own kitchen, bathroom, furniture (memory)          │
 * │    - Houses don't share anything                                          │
 * │    - If one house burns down, others are fine                             │
 * │    - Communicating between houses = mailing letters (IPC)                 │
 * │                                                                            │
 * │  THREAD = ROOMS inside the same house.                                    │
 * │    - All rooms share the kitchen, bathroom (shared memory)                │
 * │    - People in different rooms can bump into each other (race conditions) │
 * │    - If the house burns down, ALL rooms are gone                          │
 * │    - Communicating between rooms = just yelling (fast, shared memory)     │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Process vs Thread Memory Layout                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   PROCESS A (PID: 1001)          PROCESS B (PID: 1002)                    │
 * │   ┌─────────────────────┐        ┌─────────────────────┐                  │
 * │   │  Own Heap Memory    │        │  Own Heap Memory    │                  │
 * │   │  Own Stack          │        │  Own Stack          │                  │
 * │   │  Own Code Segment   │        │  Own Code Segment   │                  │
 * │   │  Own File Descs     │        │  Own File Descs     │                  │
 * │   │                     │        │                     │                  │
 * │   │  ┌──────┐ ┌──────┐ │        │  ┌──────┐ ┌──────┐ │                  │
 * │   │  │ T1   │ │ T2   │ │        │  │ T1   │ │ T2   │ │                  │
 * │   │  │Stack │ │Stack │ │        │  │Stack │ │Stack │ │                  │
 * │   │  └──────┘ └──────┘ │        │  └──────┘ └──────┘ │                  │
 * │   │   ▲ SHARED HEAP ▲  │        │   ▲ SHARED HEAP ▲  │                  │
 * │   └─────────────────────┘        └─────────────────────┘                  │
 * │          ║                               ║                                │
 * │          ╚═══════ NO SHARING ════════════╝                                │
 * │          (communicate via IPC/pipes/sockets)                              │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { execSync } = require('child_process');

// ─── 1. Current process info ───
console.log('A:', `Current Process ID (PID): ${process.pid}`);
console.log('B:', `Parent Process ID (PPID): ${process.ppid}`);
console.log('C:', `Memory usage: ${JSON.stringify(process.memoryUsage().heapUsed)} bytes`);

// ─── 2. Spawning a child PROCESS (separate memory) ───
const { fork } = require('child_process');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  console.log('D:', `Main thread PID: ${process.pid}`);

  // ─── 3. Demonstrating THREAD (shared process, own stack) ───
  const worker = new Worker(__filename, { workerData: { type: 'thread-demo' } });

  worker.on('message', (msg) => {
    console.log('F:', `Message from worker THREAD: ${msg}`);
    console.log('G:', `Worker thread ran in SAME process (PID is same)`);
  });

  worker.on('exit', () => {
    // ─── 4. Demonstrating PROCESS (separate memory) ───
    console.log('H:', 'Now spawning a child PROCESS...');
    const child = fork(__filename, [], { env: { ...process.env, CHILD_PROCESS: 'true' } });

    child.on('message', (msg) => {
      console.log('J:', `Message from child PROCESS: ${msg.info}`);
      console.log('K:', `Child had DIFFERENT PID: ${msg.pid} (parent: ${process.pid})`);
    });

    child.on('exit', () => {
      console.log('L:', 'Child process exited');

      // ─── 5. Context switching cost comparison ───
      console.log('\n--- COMPARISON TABLE ---');
      console.log('M:', '┌────────────────┬──────────────────┬──────────────────┐');
      console.log('N:', '│ Feature        │ Process          │ Thread           │');
      console.log('O:', '├────────────────┼──────────────────┼──────────────────┤');
      console.log('P:', '│ Memory         │ Isolated (own)   │ Shared (heap)    │');
      console.log('Q:', '│ Creation cost  │ Heavy            │ Lightweight      │');
      console.log('R:', '│ Communication  │ IPC (slow)       │ Shared mem (fast)│');
      console.log('S:', '│ Crash impact   │ Others survive   │ Process dies     │');
      console.log('T:', '│ Context switch │ Expensive        │ Cheap            │');
      console.log('U:', '│ Node.js API    │ child_process    │ worker_threads   │');
      console.log('V:', '└────────────────┴──────────────────┴──────────────────┘');
    });
  });
} else if (process.env.CHILD_PROCESS === 'true') {
  // This runs in a CHILD PROCESS (different PID, different memory)
  process.send({ info: 'Hello from child process!', pid: process.pid });
} else {
  // This runs in a WORKER THREAD (same PID, shared memory possible)
  console.log('E:', `Worker thread PID: ${process.pid} (same as main!)`);
  parentPort.postMessage(`Hello from thread! PID: ${process.pid}`);
}

/**
 * OUTPUT:
 *   A: Current Process ID (PID): 12345
 *   B: Parent Process ID (PPID): 12300
 *   C: Memory usage: "5242880" bytes
 *   D: Main thread PID: 12345
 *   E: Worker thread PID: 12345 (same as main!)
 *   F: Message from worker THREAD: Hello from thread! PID: 12345
 *   G: Worker thread ran in SAME process (PID is same)
 *   H: Now spawning a child PROCESS...
 *   J: Message from child PROCESS: Hello from child process!
 *   K: Child had DIFFERENT PID: 12346 (parent: 12345)
 *   L: Child process exited
 *   --- COMPARISON TABLE ---
 *   M-V: (comparison table)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "A process is an independent program with its own memory space - if it    │
 * │  crashes, other processes are unaffected. A thread is a unit of execution │
 * │  within a process that shares the process's memory heap. Threads are      │
 * │  lighter to create and communicate faster via shared memory, but a crash  │
 * │  in one thread kills the whole process. In Node.js, child_process.fork() │
 * │  creates new processes (isolated), while worker_threads creates threads   │
 * │  (shared memory possible via SharedArrayBuffer)."                         │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/01-process-vs-thread.js
 */
