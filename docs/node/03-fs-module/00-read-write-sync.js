/**
 * TOPIC 00: Synchronous File Read/Write
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Sync methods BLOCK the event loop - nothing else runs until they finish. ║
 * ║ Use them ONLY at startup (config loading) or in CLI scripts.             ║
 * ║                                                                            ║
 * ║   fs.readFileSync()   → blocks until entire file is read                 ║
 * ║   fs.writeFileSync()  → blocks until entire file is written              ║
 * ║   fs.appendFileSync() → blocks until data is appended                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Imagine you're READING A PHYSICAL BOOK at a library desk.                │
 * │                                                                             │
 * │  Synchronous reading:                                                      │
 * │    - You pick up the book and start reading page by page                  │
 * │    - You CANNOT do anything else until you finish the book                │
 * │    - Your friend asks you a question? "Wait, I'm reading."               │
 * │    - Phone rings? "Hold on, still reading."                               │
 * │    - Fire alarm? "Almost done with this chapter..."                       │
 * │                                                                             │
 * │  That's EXACTLY what readFileSync does to your Node.js server:            │
 * │    - The entire event loop STOPS                                           │
 * │    - No other requests are processed                                       │
 * │    - No callbacks fire                                                     │
 * │    - Everything waits for the file operation to complete                   │
 * │                                                                             │
 * │  "Sync = you sit and wait. Nothing else happens."                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: BLOCKING TIMELINE                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Event Loop (single thread):                                               │
 * │                                                                             │
 * │  Time ──────────────────────────────────────────────────────►              │
 * │                                                                             │
 * │  ┌──────────┐ ┌══════════════════════╗ ┌──────────┐                       │
 * │  │ code runs │ ║ readFileSync()       ║ │ code runs│                       │
 * │  │  before   │ ║ ████████████████████ ║ │  after   │                       │
 * │  └──────────┘ ║ BLOCKED - WAITING    ║ └──────────┘                       │
 * │               ╚══════════════════════╝                                     │
 * │                       ▲                                                    │
 * │                       │                                                    │
 * │              Nothing else can run!                                         │
 * │              No HTTP requests served                                       │
 * │              No callbacks executed                                         │
 * │              No timers fire                                                │
 * │                                                                             │
 * │  Compare with Async (next file):                                           │
 * │                                                                             │
 * │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
 * │  │ code runs │ │ other    │ │ other    │ │ callback │                     │
 * │  │ kicks off │ │ work     │ │ work     │ │ fires    │                     │
 * │  │ read      │ │ happens  │ │ happens  │ │ with data│                     │
 * │  └──────────┘ └──────────┘ └──────────┘ └──────────┘                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const fs = require('fs');
const path = require('path');

const SCRATCH = '/tmp/claude/-home-surya-js-only/9ed60efb-9031-4376-b20f-72de729939fa/scratchpad';

// ─── 1. writeFileSync: Create a file ─────────────────────────────────────────
const filePath = path.join(SCRATCH, 'sync-demo.txt');

fs.writeFileSync(filePath, 'Hello from writeFileSync!\n', 'utf8');
console.log('A:', 'File written successfully');

// ─── 2. readFileSync: Read the file back ─────────────────────────────────────
const content = fs.readFileSync(filePath, 'utf8');
console.log('B:', `Content: "${content.trim()}"`);

// ─── 3. appendFileSync: Append to the file ──────────────────────────────────
fs.appendFileSync(filePath, 'Second line appended!\n', 'utf8');
console.log('C:', 'Data appended');

const updatedContent = fs.readFileSync(filePath, 'utf8');
console.log('D:', `Updated content:\n${updatedContent}`);

// ─── 4. Demonstrating the BLOCKING nature ────────────────────────────────────
console.log('E:', 'Before sync write of large data...');

const bigData = 'x'.repeat(1_000_000); // 1MB of data
const bigFilePath = path.join(SCRATCH, 'sync-big.txt');

const start = Date.now();
fs.writeFileSync(bigFilePath, bigData, 'utf8');
const elapsed = Date.now() - start;

console.log('F:', `Wrote 1MB synchronously in ${elapsed}ms (event loop was BLOCKED)`);

// ─── 5. Error handling with try/catch (sync style) ───────────────────────────
try {
  const missing = fs.readFileSync('/this/file/does/not/exist.txt', 'utf8');
} catch (err) {
  console.log('G:', `Error caught: ${err.code} - ${err.message.split(',')[0]}`);
}

// ─── 6. Reading with encoding vs without ─────────────────────────────────────
fs.writeFileSync(path.join(SCRATCH, 'encoding-demo.txt'), 'Node.js Buffer demo', 'utf8');

const asBuffer = fs.readFileSync(path.join(SCRATCH, 'encoding-demo.txt'));
const asString = fs.readFileSync(path.join(SCRATCH, 'encoding-demo.txt'), 'utf8');

console.log('H:', `Without encoding: ${typeof asBuffer} → Buffer <${asBuffer[0]} ${asBuffer[1]} ...>`);
console.log('I:', `With 'utf8': ${typeof asString} → "${asString}"`);

// ─── Cleanup ─────────────────────────────────────────────────────────────────
fs.unlinkSync(bigFilePath);

/**
 * OUTPUT:
 *   A: File written successfully
 *   B: Content: "Hello from writeFileSync!"
 *   C: Data appended
 *   D: Updated content:
 *   Hello from writeFileSync!
 *   Second line appended!
 *
 *   E: Before sync write of large data...
 *   F: Wrote 1MB synchronously in Xms (event loop was BLOCKED)
 *   G: Error caught: ENOENT - ENOENT: no such file or directory
 *   H: Without encoding: object → Buffer <78 111 ...>
 *   I: With 'utf8': string → "Node.js Buffer demo"
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "fs.readFileSync and fs.writeFileSync are synchronous file operations      │
 * │  that BLOCK the event loop until completion. They return the result        │
 * │  directly (no callback needed) and errors are thrown, so you use           │
 * │  try/catch. They're fine for startup config loading or CLI tools, but      │
 * │  NEVER use them in a server's request handler - they'd block all other    │
 * │  requests. Without a second argument for encoding, readFileSync returns   │
 * │  a Buffer; pass 'utf8' to get a string."                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/03-fs-module/00-read-write-sync.js
 */
