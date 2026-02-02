/**
 * TOPIC 04: Graceful Shutdown
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A graceful shutdown means: stop accepting new work, finish current work, ║
 * ║ clean up resources, THEN exit. Never kill a process mid-operation.       ║
 * ║                                                                            ║
 * ║   SIGTERM → "Please shut down" (from kill, Docker, Kubernetes)           ║
 * ║   SIGINT  → "User pressed Ctrl+C"                                        ║
 * ║   process.on('exit') → Synchronous cleanup only (last chance)            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of a RESTAURANT at closing time:                                    │
 * │                                                                             │
 * │  SIGTERM arrives = "It's closing time!"                                    │
 * │                                                                             │
 * │  Step 1: STOP taking new orders                                            │
 * │    → server.close() — stop accepting new HTTP connections                 │
 * │    → Stop pulling from message queues                                      │
 * │                                                                             │
 * │  Step 2: FINISH current orders                                             │
 * │    → Let in-flight requests complete (with a timeout)                     │
 * │    → Finish processing current jobs                                        │
 * │                                                                             │
 * │  Step 3: CLEAN UP the kitchen                                              │
 * │    → Close database connections (wash the dishes)                          │
 * │    → Close Redis/cache connections (put away ingredients)                  │
 * │    → Flush logs (file the receipts)                                        │
 * │                                                                             │
 * │  Step 4: LOCK the door and leave                                           │
 * │    → process.exit(0) — clean exit                                          │
 * │                                                                             │
 * │  If cleanup takes too long (timeout), FORCE close:                         │
 * │    → process.exit(1) — emergency exit                                      │
 * │                                                                             │
 * │  "Close gracefully: stop, finish, clean, exit."                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Shutdown Sequence                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  SIGTERM / SIGINT received                                                 │
 * │       │                                                                    │
 * │       ▼                                                                    │
 * │  ┌──────────────────────┐                                                  │
 * │  │ 1. Stop new work     │ ← server.close(), stop consumers               │
 * │  └──────────┬───────────┘                                                  │
 * │             │                                                              │
 * │             ▼                                                              │
 * │  ┌──────────────────────┐       ┌─────────────────┐                       │
 * │  │ 2. Wait for in-flight│──────▶│ Timeout (30s)?  │                       │
 * │  │    requests          │       │ Force exit(1)   │                       │
 * │  └──────────┬───────────┘       └─────────────────┘                       │
 * │             │ all done                                                     │
 * │             ▼                                                              │
 * │  ┌──────────────────────┐                                                  │
 * │  │ 3. Close connections │ ← DB, Redis, file handles                      │
 * │  └──────────┬───────────┘                                                  │
 * │             │                                                              │
 * │             ▼                                                              │
 * │  ┌──────────────────────┐                                                  │
 * │  │ 4. Flush logs        │ ← Write final log entries                      │
 * │  └──────────┬───────────┘                                                  │
 * │             │                                                              │
 * │             ▼                                                              │
 * │  ┌──────────────────────┐                                                  │
 * │  │ 5. process.exit(0)   │ ← Clean exit                                   │
 * │  └──────────────────────┘                                                  │
 * │                                                                             │
 * │  process.on('exit') fires LAST — sync cleanup only (no async!)            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const http = require('http');

// ─── 1. Simulate resources that need cleanup ───
console.log('=== 1. Setting up resources ===');

const resources = {
  db: { connected: true, close: () => {
    resources.db.connected = false;
    console.log('F:', 'Database connection closed');
  }},
  cache: { connected: true, close: () => {
    resources.cache.connected = false;
    console.log('G:', 'Cache connection closed');
  }},
  fileHandles: { open: 3, close: () => {
    resources.fileHandles.open = 0;
    console.log('H:', 'File handles closed');
  }},
};

console.log('A:', `DB: ${resources.db.connected}, Cache: ${resources.cache.connected}`);

// ─── 2. Create an HTTP server ───
const server = http.createServer((req, res) => {
  // Simulate a slow request
  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  }, 100);
});

// ─── 3. Graceful shutdown function ───
let isShuttingDown = false;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) {
    console.log('B:', 'Shutdown already in progress...');
    return;
  }
  isShuttingDown = true;
  console.log('C:', `\nReceived ${signal}. Starting graceful shutdown...`);

  // Step 1: Stop accepting new connections
  server.close(() => {
    console.log('D:', 'HTTP server closed (no new connections)');

    // Step 2: Close resources
    console.log('E:', 'Closing resources...');
    resources.db.close();
    resources.cache.close();
    resources.fileHandles.close();

    console.log('I:', 'All resources cleaned up. Exiting.');
    process.exit(0);
  });

  // Step 3: Force exit if cleanup takes too long
  const forceTimeout = setTimeout(() => {
    console.log('FORCE:', 'Cleanup timed out! Forcing exit.');
    process.exit(1);
  }, 5000); // 5 second timeout

  // Allow the timeout to not keep the process alive
  forceTimeout.unref();
};

// ─── 4. Register signal handlers ───
console.log('\n=== 4. Registering signal handlers ===');

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

console.log('J:', 'SIGTERM handler registered (kill, Docker stop)');
console.log('K:', 'SIGINT handler registered (Ctrl+C)');

// ─── 5. process.on('exit') — last chance, sync only ───
process.on('exit', (code) => {
  // WARNING: Only synchronous code works here!
  // No async, no setTimeout, no promises
  console.log('L:', `Process exiting with code: ${code}`);
  console.log('M:', `DB closed: ${!resources.db.connected}`);
  console.log('N:', `Cache closed: ${!resources.cache.connected}`);
});

// ─── 6. process.on('beforeExit') — fires when event loop is empty ───
process.on('beforeExit', (code) => {
  // This does NOT fire on process.exit() or uncaught exceptions
  // It fires when the event loop has nothing left to do
  console.log('O:', `beforeExit with code: ${code}`);
});

// ─── 7. Start the server and demonstrate shutdown ───
console.log('\n=== 7. Starting server ===');

server.listen(0, () => {
  const port = server.address().port;
  console.log('P:', `Server listening on port ${port}`);
  console.log('Q:', 'Press Ctrl+C to trigger graceful shutdown');
  console.log('R:', `Or run: kill -SIGTERM ${process.pid}`);

  // Auto-shutdown after 1 second for demo purposes
  console.log('\n=== Auto-shutdown demo (1 second) ===');
  setTimeout(() => {
    console.log('S:', 'Triggering shutdown for demo...');
    gracefulShutdown('DEMO_SIGNAL');
  }, 1000);
});

// ─── 8. Production-grade shutdown pattern ───
console.log('\n=== 8. Production pattern summary ===');

const productionShutdownPattern = `
  // 1. Handle both signals
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // 2. In shutdown:
  //    a) server.close()        → stop new connections
  //    b) await drainRequests() → finish in-flight work
  //    c) await db.close()      → close DB pool
  //    d) await cache.quit()    → close Redis
  //    e) process.exit(0)       → clean exit

  // 3. Force timeout as safety net
  //    setTimeout(() => process.exit(1), 30000).unref();
`;

console.log('T:', 'Production pattern loaded (see code comments)');

/**
 * OUTPUT:
 *   === 1. Setting up resources ===
 *   A: DB: true, Cache: true
 *
 *   === 4. Registering signal handlers ===
 *   J: SIGTERM handler registered (kill, Docker stop)
 *   K: SIGINT handler registered (Ctrl+C)
 *
 *   === 7. Starting server ===
 *
 *   === 8. Production pattern summary ===
 *   T: Production pattern loaded (see code comments)
 *   P: Server listening on port XXXXX
 *   Q: Press Ctrl+C to trigger graceful shutdown
 *   R: Or run: kill -SIGTERM <pid>
 *
 *   === Auto-shutdown demo (1 second) ===
 *   S: Triggering shutdown for demo...
 *   C: Received DEMO_SIGNAL. Starting graceful shutdown...
 *   D: HTTP server closed (no new connections)
 *   E: Closing resources...
 *   F: Database connection closed
 *   G: Cache connection closed
 *   H: File handles closed
 *   I: All resources cleaned up. Exiting.
 *   L: Process exiting with code: 0
 *   M: DB closed: true
 *   N: Cache closed: true
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Graceful shutdown means handling SIGTERM and SIGINT to cleanly stop      │
 * │  your application. The process is: 1) Stop accepting new connections      │
 * │  with server.close(), 2) Wait for in-flight requests to complete,        │
 * │  3) Close database and cache connections, 4) Exit with process.exit(0).  │
 * │  A force-exit timeout (e.g., 30s) prevents hanging forever. The 'exit'   │
 * │  event is a last resort for sync-only cleanup. This is critical in       │
 * │  Docker/Kubernetes where SIGTERM is sent before container termination,   │
 * │  giving your app a window to shut down cleanly."                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/07-error-handling/04-graceful-shutdown.js
 */
