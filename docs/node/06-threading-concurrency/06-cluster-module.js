/**
 * TOPIC 06: Cluster Module
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Cluster forks MULTIPLE PROCESSES (not threads) of the same script.      ║
 * ║ Each process has its own V8 instance, memory, and event loop.           ║
 * ║ The OS load-balances incoming connections across workers.               ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a RESTAURANT with one kitchen (server port).                     │
 * │                                                                            │
 * │  cluster.fork() = Hiring MORE CHEFS (workers).                           │
 * │  Master process  = The HEAD CHEF who delegates but doesn't cook.         │
 * │  Worker process  = Each chef cooks independently with own stove.         │
 * │                                                                            │
 * │  A customer order (HTTP request) comes in, the host (OS) sends it to    │
 * │  whichever chef is FREE. If one chef crashes (process dies), the others  │
 * │  keep cooking. The head chef can hire a replacement immediately.          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Cluster Architecture                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │          ┌─────────────────────────────────┐                              │
 * │          │       MASTER PROCESS            │                              │
 * │          │   (cluster.isMaster = true)     │                              │
 * │          │                                 │                              │
 * │          │   cluster.fork() x numCPUs      │                              │
 * │          └──────┬──────┬──────┬────────────┘                              │
 * │                 │      │      │                                           │
 * │          ┌──────┘      │      └──────┐                                    │
 * │          ▼             ▼             ▼                                    │
 * │   ┌────────────┐┌────────────┐┌────────────┐                             │
 * │   │  Worker 1  ││  Worker 2  ││  Worker 3  │                             │
 * │   │  PID: 101  ││  PID: 102  ││  PID: 103  │                             │
 * │   │  Own V8    ││  Own V8    ││  Own V8    │                             │
 * │   │  Own Memory││  Own Memory││  Own Memory│                             │
 * │   └────────────┘└────────────┘└────────────┘                             │
 * │          ▲             ▲             ▲                                    │
 * │          └─────────────┼─────────────┘                                    │
 * │                        │                                                  │
 * │              ┌─────────┴─────────┐                                        │
 * │              │  PORT 3000 (shared)│                                        │
 * │              │  OS load-balances  │                                        │
 * │              └────────────────────┘                                        │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster || cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log('A:', `Master process PID: ${process.pid}`);
  console.log('B:', `CPU cores available: ${numCPUs}`);
  console.log('C:', `Forking 2 workers (demo uses 2 instead of ${numCPUs})...`);

  // ─── 1. Fork workers ───
  const workers = [];
  for (let i = 0; i < 2; i++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  // ─── 2. Listen for messages from workers ───
  cluster.on('message', (worker, msg) => {
    console.log('D:', `Master received from worker ${worker.process.pid}: ${msg}`);
  });

  // ─── 3. Handle worker exit / auto-restart ───
  cluster.on('exit', (worker, code, signal) => {
    console.log('E:', `Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
    console.log('F:', 'Forking a replacement worker...');
    // cluster.fork(); // In production, uncomment to auto-restart
  });

  // ─── 4. Send message to workers ───
  setTimeout(() => {
    for (const id in cluster.workers) {
      cluster.workers[id].send('Hello from master!');
    }
  }, 100);

  // ─── 5. Graceful shutdown ───
  setTimeout(() => {
    console.log('G:', 'Master shutting down all workers...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  }, 500);

} else {
  // ─── WORKER PROCESS ───
  console.log('H:', `Worker started - PID: ${process.pid}`);

  // Each worker can create its own HTTP server on the SAME port
  // (the OS distributes connections via round-robin)
  // Commented out to keep demo non-blocking:
  // http.createServer((req, res) => {
  //   res.writeHead(200);
  //   res.end(`Handled by worker ${process.pid}\n`);
  // }).listen(3000);

  // ─── Receive messages from master ───
  process.on('message', (msg) => {
    console.log('I:', `Worker ${process.pid} received: ${msg}`);
    process.send(`Ack from ${process.pid}`);
  });

  // ─── Simulate some work ───
  console.log('J:', `Worker ${process.pid} is ready to handle requests`);
}

/**
 * OUTPUT:
 *   A: Master process PID: 12345
 *   B: CPU cores available: 8
 *   C: Forking 2 workers (demo uses 2 instead of 8)...
 *   H: Worker started - PID: 12346
 *   J: Worker 12346 is ready to handle requests
 *   H: Worker started - PID: 12347
 *   J: Worker 12347 is ready to handle requests
 *   I: Worker 12346 received: Hello from master!
 *   I: Worker 12347 received: Hello from master!
 *   D: Master received from worker 12346: Ack from 12346
 *   D: Master received from worker 12347: Ack from 12347
 *   G: Master shutting down all workers...
 *   E: Worker 12346 died (code: null, signal: SIGTERM)
 *   F: Forking a replacement worker...
 *   E: Worker 12347 died (code: null, signal: SIGTERM)
 *   F: Forking a replacement worker...
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "The cluster module lets us fork multiple processes from the same Node   │
 * │  script. Each worker is a full process with its own V8 and memory, so   │
 * │  a crash in one doesn't affect others. The master process manages       │
 * │  workers - forking, monitoring, and restarting them. All workers can    │
 * │  share the same server port because the OS distributes connections via  │
 * │  round-robin. This is ideal for utilizing all CPU cores on a machine.   │
 * │  In production, PM2 abstracts this - but understanding cluster is key   │
 * │  for interviews."                                                       │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/06-cluster-module.js
 */
