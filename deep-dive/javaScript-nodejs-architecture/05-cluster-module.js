/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NODE.JS ARCHITECTURE - FILE 5: CLUSTER MODULE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Deep dive into Node.js Cluster Module - scaling Node.js applications
 * across multiple CPU cores for improved performance and availability.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       NODE.JS CLUSTER MODULE - MULTI-CORE SCALING                 ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    WHY CLUSTER MODULE?                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  Problem: Node.js is single-threaded                                       ║
 * ║                                                                            ║
 * ║  ┌────────────────────────────────────────────────────────────────────┐   ║
 * ║  │                    8-Core CPU Server                                │   ║
 * ║  │                                                                     │   ║
 * ║  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                              │   ║
 * ║  │   │Core 1│ │Core 2│ │Core 3│ │Core 4│                              │   ║
 * ║  │   │ Node │ │ Idle │ │ Idle │ │ Idle │                              │   ║
 * ║  │   │ 100% │ │  0%  │ │  0%  │ │  0%  │                              │   ║
 * ║  │   └──────┘ └──────┘ └──────┘ └──────┘                              │   ║
 * ║  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                              │   ║
 * ║  │   │Core 5│ │Core 6│ │Core 7│ │Core 8│                              │   ║
 * ║  │   │ Idle │ │ Idle │ │ Idle │ │ Idle │                              │   ║
 * ║  │   │  0%  │ │  0%  │ │  0%  │ │  0%  │                              │   ║
 * ║  │   └──────┘ └──────┘ └──────┘ └──────┘                              │   ║
 * ║  │                                                                     │   ║
 * ║  │   Without Cluster: Only 1 core utilized = 12.5% CPU usage!         │   ║
 * ║  └────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ║  Solution: Cluster Module creates worker processes                         ║
 * ║                                                                            ║
 * ║  ┌────────────────────────────────────────────────────────────────────┐   ║
 * ║  │                    8-Core CPU Server                                │   ║
 * ║  │                                                                     │   ║
 * ║  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                              │   ║
 * ║  │   │Core 1│ │Core 2│ │Core 3│ │Core 4│                              │   ║
 * ║  │   │Worker│ │Worker│ │Worker│ │Worker│                              │   ║
 * ║  │   │  1   │ │  2   │ │  3   │ │  4   │                              │   ║
 * ║  │   └──────┘ └──────┘ └──────┘ └──────┘                              │   ║
 * ║  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                              │   ║
 * ║  │   │Core 5│ │Core 6│ │Core 7│ │Core 8│                              │   ║
 * ║  │   │Worker│ │Worker│ │Worker│ │Worker│                              │   ║
 * ║  │   │  5   │ │  6   │ │  7   │ │  8   │                              │   ║
 * ║  │   └──────┘ └──────┘ └──────┘ └──────┘                              │   ║
 * ║  │                                                                     │   ║
 * ║  │   With Cluster: All cores utilized = 100% CPU usage!               │   ║
 * ║  └────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const cluster = require('cluster');
const os = require('os');
const http = require('http');

console.log("1️⃣  CLUSTER ARCHITECTURE\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                      CLUSTER ARCHITECTURE                                  │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │                         ┌─────────────────┐                               │
 * │                         │  Master Process │                               │
 * │                         │                 │                               │
 * │                         │  • Fork workers │                               │
 * │                         │  • Manage lifecycle                             │
 * │                         │  • Load balance │                               │
 * │                         └────────┬────────┘                               │
 * │                                  │                                         │
 * │              ┌───────────────────┼───────────────────┐                    │
 * │              │                   │                   │                    │
 * │              ▼                   ▼                   ▼                    │
 * │     ┌────────────────┐  ┌────────────────┐  ┌────────────────┐           │
 * │     │  Worker 1      │  │  Worker 2      │  │  Worker 3      │           │
 * │     │                │  │                │  │                │           │
 * │     │  • Own V8      │  │  • Own V8      │  │  • Own V8      │           │
 * │     │  • Own Event   │  │  • Own Event   │  │  • Own Event   │           │
 * │     │    Loop        │  │    Loop        │  │    Loop        │           │
 * │     │  • Own Memory  │  │  • Own Memory  │  │  • Own Memory  │           │
 * │     └────────────────┘  └────────────────┘  └────────────────┘           │
 * │                                                                            │
 * │     Each worker is a SEPARATE PROCESS (not thread)                        │
 * │     Workers do NOT share memory (isolated)                                │
 * │     Communication via IPC (Inter-Process Communication)                   │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`System Info:
  CPU Cores: ${os.cpus().length}
  Platform: ${os.platform()}
  Total Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                          BASIC CLUSTER EXAMPLE
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("2️⃣  BASIC CLUSTER IMPLEMENTATION\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    CLUSTER SETUP PATTERN                                   │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   const cluster = require('cluster');                                      │
 * │                                                                            │
 * │   if (cluster.isMaster) {                                                 │
 * │       // Master process code                                               │
 * │       // Fork workers here                                                 │
 * │       for (let i = 0; i < numCPUs; i++) {                                 │
 * │           cluster.fork();                                                  │
 * │       }                                                                    │
 * │   } else {                                                                 │
 * │       // Worker process code                                               │
 * │       // Start server here                                                 │
 * │       http.createServer(handler).listen(port);                            │
 * │   }                                                                        │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`
// Basic Cluster Server Example
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    // Optionally restart worker
    cluster.fork();
  });

} else {
  // Workers share the same port
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(\`Response from worker \${process.pid}\\n\`);
  }).listen(8000);

  console.log(\`Worker \${process.pid} started\`);
}
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                       LOAD BALANCING STRATEGIES
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("3️⃣  LOAD BALANCING STRATEGIES\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    ROUND-ROBIN (Default on Linux)                          │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   Master distributes connections in round-robin fashion                   │
 * │                                                                            │
 * │                    Incoming Connections                                    │
 * │                         │ │ │ │                                            │
 * │                         ▼ ▼ ▼ ▼                                            │
 * │                    ┌─────────────┐                                        │
 * │                    │   Master    │                                        │
 * │                    │  Process    │                                        │
 * │                    └──────┬──────┘                                        │
 * │                           │                                                │
 * │          ┌────────────────┼────────────────┐                              │
 * │          │                │                │                              │
 * │          ▼                ▼                ▼                              │
 * │     ┌─────────┐      ┌─────────┐      ┌─────────┐                        │
 * │     │ Worker  │      │ Worker  │      │ Worker  │                        │
 * │     │    1    │      │    2    │      │    3    │                        │
 * │     └─────────┘      └─────────┘      └─────────┘                        │
 * │         ↑                ↑                ↑                               │
 * │     Request 1        Request 2        Request 3                          │
 * │     Request 4        Request 5        Request 6                          │
 * │        ...              ...              ...                              │
 * │                                                                            │
 * │   Pros: Fair distribution, prevents worker starvation                     │
 * │   Cons: May not consider worker load                                      │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`
Load Balancing Strategies:

┌────────────────────────────────────────────────────────────────────────────┐
│ Strategy        │ Description                    │ Platform               │
├────────────────────────────────────────────────────────────────────────────┤
│ SCHED_RR        │ Round-robin (default)          │ All except Windows     │
│ (Round Robin)   │ Master distributes connections │                        │
│                 │ evenly among workers           │                        │
├────────────────────────────────────────────────────────────────────────────┤
│ SCHED_NONE      │ OS handles distribution        │ Default on Windows     │
│ (OS Default)    │ Workers compete for connections│                        │
│                 │ Can lead to uneven distribution│                        │
└────────────────────────────────────────────────────────────────────────────┘

// Set scheduling policy programmatically
cluster.schedulingPolicy = cluster.SCHED_RR;   // Round-robin
cluster.schedulingPolicy = cluster.SCHED_NONE; // OS default

// Or via environment variable
// NODE_CLUSTER_SCHED_POLICY=rr   (round-robin)
// NODE_CLUSTER_SCHED_POLICY=none (OS default)
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    INTER-PROCESS COMMUNICATION (IPC)
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("4️⃣  INTER-PROCESS COMMUNICATION (IPC)\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                         IPC MESSAGE FLOW                                   │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   ┌──────────────────────────────────────────────────────────────────┐    │
 * │   │                        MASTER                                     │    │
 * │   │                                                                   │    │
 * │   │   worker.send({ type: 'task', data: {...} })                     │    │
 * │   │                          │                                        │    │
 * │   └──────────────────────────┼───────────────────────────────────────┘    │
 * │                              │ IPC Channel                                │
 * │                              ▼                                             │
 * │   ┌──────────────────────────────────────────────────────────────────┐    │
 * │   │                        WORKER                                     │    │
 * │   │                                                                   │    │
 * │   │   process.on('message', (msg) => {                               │    │
 * │   │     // Handle message                                            │    │
 * │   │   });                                                            │    │
 * │   │                                                                   │    │
 * │   │   process.send({ type: 'result', data: {...} })                  │    │
 * │   │                          │                                        │    │
 * │   └──────────────────────────┼───────────────────────────────────────┘    │
 * │                              │ IPC Channel                                │
 * │                              ▼                                             │
 * │   ┌──────────────────────────────────────────────────────────────────┐    │
 * │   │                        MASTER                                     │    │
 * │   │                                                                   │    │
 * │   │   worker.on('message', (msg) => {                                │    │
 * │   │     // Handle response                                           │    │
 * │   │   });                                                            │    │
 * │   └──────────────────────────────────────────────────────────────────┘    │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`
// IPC Example - Master to Worker Communication

if (cluster.isMaster) {
  const worker = cluster.fork();

  // Send message to worker
  worker.send({ type: 'task', data: { value: 42 } });

  // Receive message from worker
  worker.on('message', (msg) => {
    console.log('Master received:', msg);
  });

} else {
  // Receive message from master
  process.on('message', (msg) => {
    console.log('Worker received:', msg);

    // Process and send result back
    const result = msg.data.value * 2;
    process.send({ type: 'result', value: result });
  });
}

// Broadcast to all workers
function broadcastToWorkers(message) {
  for (const id in cluster.workers) {
    cluster.workers[id].send(message);
  }
}
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        GRACEFUL SHUTDOWN
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("5️⃣  GRACEFUL SHUTDOWN PATTERN\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    GRACEFUL SHUTDOWN FLOW                                  │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   SIGTERM/SIGINT                                                          │
 * │        │                                                                   │
 * │        ▼                                                                   │
 * │   ┌─────────────────────────────────────────────────────────────────┐     │
 * │   │ 1. Stop accepting new connections                               │     │
 * │   │    server.close()                                               │     │
 * │   └─────────────────────────────────────────────────────────────────┘     │
 * │        │                                                                   │
 * │        ▼                                                                   │
 * │   ┌─────────────────────────────────────────────────────────────────┐     │
 * │   │ 2. Wait for existing connections to complete                    │     │
 * │   │    Track active connections                                     │     │
 * │   └─────────────────────────────────────────────────────────────────┘     │
 * │        │                                                                   │
 * │        ▼                                                                   │
 * │   ┌─────────────────────────────────────────────────────────────────┐     │
 * │   │ 3. Close database connections                                   │     │
 * │   │    db.close()                                                   │     │
 * │   └─────────────────────────────────────────────────────────────────┘     │
 * │        │                                                                   │
 * │        ▼                                                                   │
 * │   ┌─────────────────────────────────────────────────────────────────┐     │
 * │   │ 4. Exit process                                                 │     │
 * │   │    process.exit(0)                                              │     │
 * │   └─────────────────────────────────────────────────────────────────┘     │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`
// Graceful Shutdown Implementation

const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster) {
  const numCPUs = require('os').cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Graceful shutdown handler
  process.on('SIGTERM', () => {
    console.log('Master: SIGTERM received, shutting down gracefully...');

    // Notify all workers to shutdown
    for (const id in cluster.workers) {
      cluster.workers[id].send({ type: 'shutdown' });
    }

    // Force exit after timeout
    setTimeout(() => {
      console.log('Master: Force exit after timeout');
      process.exit(1);
    }, 30000);
  });

  // Restart crashed workers
  cluster.on('exit', (worker, code, signal) => {
    if (!worker.exitedAfterDisconnect) {
      console.log(\`Worker \${worker.process.pid} crashed, restarting...\`);
      cluster.fork();
    }
  });

} else {
  let isShuttingDown = false;
  const connections = new Set();

  const server = http.createServer((req, res) => {
    if (isShuttingDown) {
      res.setHeader('Connection', 'close');
    }

    res.writeHead(200);
    res.end('Hello World');
  });

  // Track connections
  server.on('connection', (socket) => {
    connections.add(socket);
    socket.on('close', () => connections.delete(socket));
  });

  server.listen(8000);

  // Handle shutdown message from master
  process.on('message', (msg) => {
    if (msg.type === 'shutdown') {
      isShuttingDown = true;
      console.log(\`Worker \${process.pid}: Shutting down...\`);

      // Stop accepting new connections
      server.close(() => {
        console.log(\`Worker \${process.pid}: Server closed\`);
        process.exit(0);
      });

      // Close existing connections after timeout
      setTimeout(() => {
        connections.forEach(socket => socket.destroy());
      }, 5000);
    }
  });
}
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        ZERO-DOWNTIME RESTART
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("6️⃣  ZERO-DOWNTIME RESTART (ROLLING RESTART)\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    ROLLING RESTART SEQUENCE                                │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   Initial State:  [Worker 1] [Worker 2] [Worker 3] [Worker 4]             │
 * │                        ↑          ↑          ↑          ↑                 │
 * │                     Active     Active     Active     Active               │
 * │                                                                            │
 * │   Step 1: Disconnect Worker 1                                             │
 * │   [Worker 1] [Worker 2] [Worker 3] [Worker 4] [Worker 5]                  │
 * │      ↓          ↑          ↑          ↑          ↑                        │
 * │   Draining   Active     Active     Active     Active                      │
 * │                                                                            │
 * │   Step 2: Worker 1 exits after draining                                   │
 * │            [Worker 2] [Worker 3] [Worker 4] [Worker 5]                    │
 * │                ↑          ↑          ↑          ↑                         │
 * │             Active     Active     Active     Active                       │
 * │                                                                            │
 * │   Step 3: Repeat for Worker 2, 3, 4...                                    │
 * │                                                                            │
 * │   Final: All workers replaced without downtime!                           │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`
// Zero-Downtime Rolling Restart

const cluster = require('cluster');

if (cluster.isMaster) {
  const numCPUs = require('os').cpus().length;

  // Initial workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Rolling restart function
  async function rollingRestart() {
    const workers = Object.values(cluster.workers);

    for (const worker of workers) {
      // Fork new worker first
      const newWorker = cluster.fork();

      // Wait for new worker to be ready
      await new Promise(resolve => {
        newWorker.on('listening', resolve);
      });

      // Now disconnect old worker (graceful)
      worker.disconnect();

      // Wait for old worker to exit
      await new Promise(resolve => {
        worker.on('exit', resolve);
      });

      console.log(\`Replaced worker \${worker.process.pid} with \${newWorker.process.pid}\`);
    }

    console.log('Rolling restart complete!');
  }

  // Trigger restart on SIGUSR2
  process.on('SIGUSR2', () => {
    console.log('Starting rolling restart...');
    rollingRestart();
  });

  cluster.on('exit', (worker, code, signal) => {
    if (!worker.exitedAfterDisconnect) {
      console.log(\`Worker \${worker.process.pid} crashed, replacing...\`);
      cluster.fork();
    }
  });
}
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        SHARED STATE PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("7️⃣  SHARED STATE PATTERNS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    HANDLING SHARED STATE                                   │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   Problem: Workers don't share memory!                                     │
 * │                                                                            │
 * │   ┌──────────┐  count=5  ┌──────────┐  count=3  ┌──────────┐             │
 * │   │ Worker 1 │           │ Worker 2 │           │ Worker 3 │             │
 * │   │ Memory   │           │ Memory   │           │ Memory   │             │
 * │   └──────────┘           └──────────┘           └──────────┘             │
 * │                                                                            │
 * │   Each worker has its own isolated memory space                           │
 * │                                                                            │
 * │   ─────────────────────────────────────────────────────────────────────   │
 * │                                                                            │
 * │   Solutions:                                                               │
 * │                                                                            │
 * │   1. External Data Store (Redis)                                          │
 * │   ┌──────────┐      ┌──────────┐      ┌──────────┐                       │
 * │   │ Worker 1 │      │ Worker 2 │      │ Worker 3 │                       │
 * │   └────┬─────┘      └────┬─────┘      └────┬─────┘                       │
 * │        │                 │                 │                              │
 * │        └─────────────────┼─────────────────┘                              │
 * │                          ▼                                                 │
 * │                   ┌────────────┐                                          │
 * │                   │   Redis    │  count=11                                │
 * │                   └────────────┘                                          │
 * │                                                                            │
 * │   2. Master as Coordinator                                                 │
 * │   ┌──────────────────────────────────────────────┐                       │
 * │   │                   MASTER                      │                       │
 * │   │            Shared State: count=11            │                       │
 * │   └──────────────────────────────────────────────┘                       │
 * │         ▲               ▲               ▲                                 │
 * │         │ IPC           │ IPC           │ IPC                             │
 * │   ┌─────┴────┐    ┌─────┴────┐    ┌─────┴────┐                           │
 * │   │ Worker 1 │    │ Worker 2 │    │ Worker 3 │                           │
 * │   └──────────┘    └──────────┘    └──────────┘                           │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`
// Pattern 1: Using Redis for Shared State

const Redis = require('ioredis');
const redis = new Redis();

// In any worker:
async function incrementCounter() {
  const newValue = await redis.incr('counter');
  console.log(\`Counter is now: \${newValue}\`);
  return newValue;
}

// Atomic operations across all workers!

// ─────────────────────────────────────────────────────────────────────────

// Pattern 2: Master as State Coordinator

if (cluster.isMaster) {
  // Shared state in master
  const sharedState = { counter: 0 };

  cluster.on('message', (worker, msg) => {
    if (msg.type === 'increment') {
      sharedState.counter++;
      // Broadcast new state to all workers
      for (const id in cluster.workers) {
        cluster.workers[id].send({
          type: 'stateUpdate',
          counter: sharedState.counter
        });
      }
    }
  });

} else {
  let localCounter = 0;

  // Request state update
  function increment() {
    process.send({ type: 'increment' });
  }

  // Receive state updates
  process.on('message', (msg) => {
    if (msg.type === 'stateUpdate') {
      localCounter = msg.counter;
      console.log(\`Worker \${process.pid}: Counter updated to \${localCounter}\`);
    }
  });
}
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    STICKY SESSIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("8️⃣  STICKY SESSIONS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    WHY STICKY SESSIONS?                                    │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   Problem: WebSocket/Session state is worker-local                        │
 * │                                                                            │
 * │   Request 1 ───► Worker 1  (login, session created)                       │
 * │   Request 2 ───► Worker 2  (session not found! ❌)                        │
 * │                                                                            │
 * │   ─────────────────────────────────────────────────────────────────────   │
 * │                                                                            │
 * │   Solution: Route same client to same worker                               │
 * │                                                                            │
 * │                    ┌─────────────┐                                        │
 * │   Client A ──────► │   Master    │ ───────► Worker 1 (always)             │
 * │                    │  IP Hash:   │                                        │
 * │   Client B ──────► │  A → W1     │ ───────► Worker 2 (always)             │
 * │                    │  B → W2     │                                        │
 * │   Client C ──────► │  C → W1     │ ───────► Worker 1 (always)             │
 * │                    └─────────────┘                                        │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`
// Sticky Sessions with IP Hash

const cluster = require('cluster');
const net = require('net');
const http = require('http');

const numCPUs = require('os').cpus().length;

// Simple IP hash function
function ipHash(ip, numWorkers) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = ((hash << 5) - hash) + ip.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % numWorkers;
}

if (cluster.isMaster) {
  const workers = [];

  // Create workers
  for (let i = 0; i < numCPUs; i++) {
    workers.push(cluster.fork());
  }

  // Create TCP server to distribute connections
  net.createServer({ pauseOnConnect: true }, (connection) => {
    const ip = connection.remoteAddress;
    const workerIndex = ipHash(ip, workers.length);
    const worker = workers[workerIndex];

    // Send connection to specific worker
    worker.send('sticky-session:connection', connection);
  }).listen(3000);

} else {
  const server = http.createServer((req, res) => {
    res.end(\`Worker \${process.pid} handling request\\n\`);
  });

  // Don't listen on port, accept from master
  server.listen(0, 'localhost');

  process.on('message', (msg, connection) => {
    if (msg === 'sticky-session:connection') {
      server.emit('connection', connection);
      connection.resume();
    }
  });
}
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    CLUSTER VS PM2 COMPARISON
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("9️⃣  CLUSTER MODULE VS PM2\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLUSTER MODULE vs PM2                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Feature              │  Native Cluster         │  PM2                      │
│  ─────────────────────┼─────────────────────────┼─────────────────────────  │
│  Setup                │  Manual code required   │  Zero code changes        │
│  Auto-restart         │  Manual implementation  │  Built-in                 │
│  Load balancing       │  Built-in (round-robin) │  Built-in                 │
│  Zero-downtime reload │  Manual implementation  │  pm2 reload               │
│  Monitoring           │  Manual implementation  │  Built-in dashboard       │
│  Log management       │  Manual                 │  Built-in                 │
│  Process management   │  Manual                 │  CLI commands             │
│  Memory limits        │  Manual                 │  --max-memory-restart     │
│  Startup scripts      │  Manual                 │  pm2 startup              │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  When to use Cluster Module:                                                 │
│  • Fine-grained control over worker management                              │
│  • Custom IPC communication                                                 │
│  • Specific load balancing strategies                                       │
│  • Avoiding external dependencies                                           │
│                                                                              │
│  When to use PM2:                                                           │
│  • Quick production deployment                                              │
│  • Need monitoring and log management                                       │
│  • Want automatic memory management                                         │
│  • Prefer CLI-based management                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

// PM2 Commands for Comparison:
pm2 start app.js -i max        # Start with max workers
pm2 reload app                 # Zero-downtime restart
pm2 scale app +2               # Add 2 more workers
pm2 monit                      # Real-time monitoring
pm2 logs                       # View logs
pm2 save                       # Save process list
pm2 startup                    # Generate startup script
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("📋  CLUSTER MODULE - INTERVIEW QUESTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: How does Node.js Cluster module achieve load balancing?                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: The master process creates a listening socket and distributes            │
│    incoming connections to workers. By default (on most platforms),         │
│    it uses round-robin scheduling where the master accepts connections      │
│    and distributes them evenly. On Windows, the OS handles distribution.    │
│                                                                              │
│    The workers all share the same server port - this is possible because    │
│    the master either passes file descriptors (Windows) or handles           │
│    accepts and passes connections via IPC.                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: Do cluster workers share memory?                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: No, each worker is a separate OS process with its own:                   │
│    • V8 instance and heap                                                   │
│    • Event loop                                                             │
│    • Memory space                                                           │
│                                                                              │
│    Workers can only communicate via IPC (Inter-Process Communication)       │
│    using worker.send() and process.on('message').                           │
│                                                                              │
│    For shared state, use external stores like Redis or coordinate           │
│    through the master process.                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: How do you implement zero-downtime restart with cluster?                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Use a rolling restart strategy:                                          │
│                                                                              │
│    1. Fork a new worker                                                     │
│    2. Wait for it to be ready (listening event)                             │
│    3. Disconnect old worker (graceful shutdown)                             │
│    4. Wait for old worker to exit                                           │
│    5. Repeat for each worker                                                │
│                                                                              │
│    This ensures there's always at least one worker handling requests.       │
│    The disconnect() method stops accepting new connections while            │
│    allowing existing ones to complete.                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: What's the difference between worker.kill() and worker.disconnect()?    │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: worker.disconnect():                                                      │
│    • Graceful - stops accepting new connections                             │
│    • Allows existing connections to complete                                │
│    • Worker exits when all connections close                                │
│    • Sets worker.exitedAfterDisconnect = true                               │
│                                                                              │
│    worker.kill():                                                            │
│    • Forceful - sends SIGKILL (or specified signal)                         │
│    • Terminates immediately                                                 │
│    • Connections are dropped                                                │
│    • Use only for unresponsive workers                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: How many workers should you spawn?                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Common recommendations:                                                   │
│                                                                              │
│    • CPU-bound work: numCPUs workers                                        │
│    • I/O-bound work: numCPUs or numCPUs + 1 workers                         │
│    • Mixed: Start with numCPUs, monitor and adjust                          │
│                                                                              │
│    Too few: Underutilize CPU resources                                      │
│    Too many: Context switching overhead, memory pressure                    │
│                                                                              │
│    const optimal = require('os').cpus().length;                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q6: How do you handle sticky sessions with cluster?                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Sticky sessions route the same client to the same worker, needed for:    │
│    • WebSocket connections                                                  │
│    • In-memory sessions                                                     │
│    • Local caching                                                          │
│                                                                              │
│    Implementation:                                                           │
│    1. Create TCP server in master                                           │
│    2. Hash client IP to get consistent worker index                         │
│    3. Pass connection to specific worker via IPC                            │
│    4. Worker handles connection normally                                    │
│                                                                              │
│    Alternative: Use load balancer with sticky session support               │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("📝  CLUSTER MODULE CHEAT SHEET\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                       CLUSTER API QUICK REFERENCE                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Properties:                                                               ║
║    cluster.isMaster          // true if master process                     ║
║    cluster.isWorker          // true if worker process                     ║
║    cluster.worker            // Reference to current Worker object         ║
║    cluster.workers           // Hash of all workers (master only)          ║
║    cluster.schedulingPolicy  // SCHED_RR or SCHED_NONE                     ║
║                                                                            ║
║  Master Methods:                                                           ║
║    cluster.fork()            // Fork new worker                            ║
║    cluster.disconnect()      // Disconnect all workers                     ║
║    cluster.setupMaster()     // Configure cluster settings                 ║
║                                                                            ║
║  Worker Methods:                                                           ║
║    worker.send(message)      // Send message to worker                     ║
║    worker.kill([signal])     // Kill worker with signal                    ║
║    worker.disconnect()       // Gracefully disconnect worker               ║
║    worker.isConnected()      // Is IPC channel connected?                  ║
║    worker.isDead()           // Is worker dead?                            ║
║                                                                            ║
║  Master Events:                                                            ║
║    cluster.on('fork')        // Worker forked                              ║
║    cluster.on('online')      // Worker is online                           ║
║    cluster.on('listening')   // Worker is listening                        ║
║    cluster.on('disconnect')  // Worker disconnected                        ║
║    cluster.on('exit')        // Worker exited                              ║
║    cluster.on('message')     // Message from worker                        ║
║                                                                            ║
║  Worker Events:                                                            ║
║    worker.on('message')      // Message from master                        ║
║    worker.on('error')        // Error occurred                             ║
║    worker.on('disconnect')   // Disconnected from master                   ║
║    worker.on('exit')         // Worker exited                              ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║                       COMMON PATTERNS                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Fork workers:                                                             ║
║    for (let i = 0; i < os.cpus().length; i++) cluster.fork();             ║
║                                                                            ║
║  Restart crashed workers:                                                  ║
║    cluster.on('exit', (w, c, s) => {                                       ║
║      if (!w.exitedAfterDisconnect) cluster.fork();                        ║
║    });                                                                     ║
║                                                                            ║
║  Graceful shutdown:                                                        ║
║    process.on('SIGTERM', () => {                                          ║
║      for (const id in cluster.workers) {                                   ║
║        cluster.workers[id].disconnect();                                   ║
║      }                                                                     ║
║    });                                                                     ║
║                                                                            ║
║  IPC Communication:                                                        ║
║    // Master to worker:  worker.send(msg)                                  ║
║    // Worker to master:  process.send(msg)                                 ║
║    // Receive:           .on('message', handler)                           ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FILE 5 COMPLETE ═══");
console.log("Run: node 06-worker-threads.js");
