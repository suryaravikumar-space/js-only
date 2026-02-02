/**
 * TOPIC 02: Uncaught Exceptions
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ An uncaught exception means your app is in an UNKNOWN STATE.              ║
 * ║ Log the error, clean up resources, then EXIT the process.                ║
 * ║ NEVER continue running after an uncaught exception.                       ║
 * ║                                                                            ║
 * ║   process.on('uncaughtException') → last chance to log and exit          ║
 * ║   Continuing after = data corruption, memory leaks, undefined behavior   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of a NUCLEAR REACTOR with alarm systems:                            │
 * │                                                                             │
 * │  Normal operation:                                                          │
 * │    - Each section has its own alarm handlers (try-catch)                   │
 * │    - Small problems get handled locally                                    │
 * │                                                                             │
 * │  Uncaught exception = alarm that NOBODY handled:                           │
 * │    - The master alarm goes off (uncaughtException event)                   │
 * │    - This is your LAST CHANCE to:                                          │
 * │      1. Log what went wrong (record the incident)                         │
 * │      2. Shut down the reactor safely (close connections)                   │
 * │      3. Alert the operators (send error report)                            │
 * │      4. SHUT DOWN (process.exit)                                           │
 * │                                                                             │
 * │  What you should NEVER do:                                                  │
 * │    - Keep the reactor running! The state is UNKNOWN.                       │
 * │    - Ignoring the alarm = potential MELTDOWN (data corruption)             │
 * │                                                                             │
 * │  "Log it, clean up, shut down. Never pretend it didn't happen."           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Crash Flow                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  ┌──────────┐   throw    ┌──────────┐   no catch   ┌──────────────────┐   │
 * │  │   Code   │ ────────▶  │ Call     │ ───────────▶  │ uncaughtException│   │
 * │  │  throws  │            │ Stack    │   bubbles up  │ event fires      │   │
 * │  └──────────┘            │ (empty!) │               └────────┬─────────┘   │
 * │                          └──────────┘                        │             │
 * │                                                              ▼             │
 * │                                              ┌───────────────────────────┐ │
 * │                                              │ Handler registered?       │ │
 * │                                              └─────┬───────────┬─────────┘ │
 * │                                                YES │           │ NO        │
 * │                                                    ▼           ▼           │
 * │                                              ┌──────────┐ ┌──────────┐    │
 * │                                              │ Log error│ │ Print    │    │
 * │                                              │ Cleanup  │ │ stack    │    │
 * │                                              │ Exit(1)  │ │ Exit(1)  │    │
 * │                                              └──────────┘ └──────────┘    │
 * │                                                                             │
 * │  BOTH paths end in exit — the only question is whether YOU control it.    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── 1. Register the uncaughtException handler FIRST ───
console.log('=== 1. Setting up uncaughtException handler ===');

process.on('uncaughtException', (err, origin) => {
  console.log('A:', `Uncaught Exception!`);
  console.log('B:', `Error: ${err.message}`);
  console.log('C:', `Origin: ${origin}`);
  console.log('D:', `Name: ${err.name}`);

  // In production, you would:
  // 1. Log to error tracking service (Sentry, Datadog, etc.)
  // 2. Close database connections
  // 3. Stop accepting new requests
  // 4. Exit with non-zero code

  console.log('E:', 'Performing cleanup before exit...');
  console.log('F:', 'Cleanup complete. Exiting.');

  // IMPORTANT: Always exit after uncaughtException
  // We use setTimeout to let console.log flush
  setTimeout(() => process.exit(1), 100);
});

// ─── 2. Demonstrate what happens without try-catch ───
console.log('\n=== 2. Simulating an uncaught exception ===');

// ─── 3. Show WHY you should not continue ───
console.log('G:', 'App is running normally...');
console.log('H:', 'Processing request 1...');
console.log('I:', 'Processing request 2...');

// ─── 4. Graceful cleanup pattern ───
// In a real app, you'd have resources to clean up
const mockResources = {
  dbConnection: { connected: true },
  httpServer: { listening: true },
  fileHandles: [1, 2, 3],
};

const cleanup = () => {
  console.log('J:', 'Closing DB connection...');
  mockResources.dbConnection.connected = false;

  console.log('K:', 'Stopping HTTP server...');
  mockResources.httpServer.listening = false;

  console.log('L:', 'Closing file handles...');
  mockResources.fileHandles.length = 0;

  console.log('M:', `Resources cleaned: DB=${mockResources.dbConnection.connected}, Server=${mockResources.httpServer.listening}`);
};

// ─── 5. Production-grade handler pattern ───
console.log('\n=== 5. Production handler pattern (demo only) ===');

const productionHandler = (err) => {
  // Step 1: Log with timestamp
  const timestamp = new Date().toISOString();
  console.log('N:', `[${timestamp}] FATAL: ${err.message}`);

  // Step 2: Log stack trace
  console.log('O:', `Stack: ${err.stack.split('\n').slice(0, 3).join(' | ')}`);

  // Step 3: Cleanup
  cleanup();

  // Step 4: Exit
  console.log('P:', 'Exiting with code 1');
};

// Demo the production handler without actually crashing
const demoErr = new Error('Database connection lost');
productionHandler(demoErr);

// ─── 6. Throw an actual uncaught exception to trigger the handler ───
console.log('\n=== 6. Triggering real uncaught exception ===');
console.log('Q:', 'About to throw an uncaught error...');

// This will be caught by our process.on('uncaughtException') handler above
// and the process will exit
throw new Error('Unhandled critical failure');

// This line will NEVER execute
console.log('R:', 'This never prints');

/**
 * OUTPUT:
 *   === 1. Setting up uncaughtException handler ===
 *
 *   === 2. Simulating an uncaught exception ===
 *   G: App is running normally...
 *   H: Processing request 1...
 *   I: Processing request 2...
 *
 *   === 5. Production handler pattern (demo only) ===
 *   N: [2024-01-01T00:00:00.000Z] FATAL: Database connection lost
 *   O: Stack: Error: Database connection lost | at Object.<anonymous> ...
 *   J: Closing DB connection...
 *   K: Stopping HTTP server...
 *   L: Closing file handles...
 *   M: Resources cleaned: DB=false, Server=false
 *   P: Exiting with code 1
 *
 *   === 6. Triggering real uncaught exception ===
 *   Q: About to throw an uncaught error...
 *   A: Uncaught Exception!
 *   B: Error: Unhandled critical failure
 *   C: Origin: uncaughtException
 *   D: Name: Error
 *   E: Performing cleanup before exit...
 *   F: Cleanup complete. Exiting.
 *   (process exits with code 1)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "process.on('uncaughtException') is a last-resort handler for errors that │
 * │  weren't caught by any try-catch. When it fires, the application is in   │
 * │  an unknown state. The correct response is to log the error to a         │
 * │  monitoring service, perform cleanup (close DB connections, stop the     │
 * │  server), and EXIT the process with a non-zero code. You should NEVER    │
 * │  continue running after an uncaught exception because the app state may  │
 * │  be corrupted. Use a process manager like PM2 to automatically restart   │
 * │  the process after it exits."                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/07-error-handling/02-uncaught-exceptions.js
 */
