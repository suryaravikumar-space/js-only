/**
 * TOPIC 01: Asynchronous File Read/Write
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Async methods DO NOT block the event loop. Node keeps running other       ║
 * ║ code while the file operation happens in the background (via libuv).     ║
 * ║                                                                            ║
 * ║   Callback style: fs.readFile(path, encoding, callback)                  ║
 * ║   Promise style:  fs.promises.readFile(path, encoding)                   ║
 * ║   Async/Await:    await fs.promises.readFile(path, encoding)             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Imagine you SEND SOMEONE to the library to fetch a book for you.         │
 * │                                                                             │
 * │  Asynchronous reading:                                                     │
 * │    - You tell your assistant: "Go get me that book."                      │
 * │    - While they're gone, you keep working on other tasks                  │
 * │    - You answer phone calls, reply to emails, eat lunch                   │
 * │    - Assistant comes back: "Here's your book!" (callback fires)           │
 * │    - NOW you read the book                                                 │
 * │                                                                             │
 * │  Callback style = "Call me when you're back"                              │
 * │  Promise style  = "I promise I'll bring the book"                         │
 * │  Async/Await    = "I'll wait here but others can work"                    │
 * │                                                                             │
 * │  "Async = you delegate and keep working."                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: NON-BLOCKING TIMELINE                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Main Thread (Event Loop):                                                 │
 * │                                                                             │
 * │  Time ──────────────────────────────────────────────────────►              │
 * │                                                                             │
 * │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐                │
 * │  │ kick   │ │ handle │ │ serve  │ │ run    │ │ callback │                │
 * │  │ off    │ │ HTTP   │ │ other  │ │ timers │ │ fires!   │                │
 * │  │ read   │ │ req    │ │ req    │ │        │ │ got data │                │
 * │  └───┬────┘ └────────┘ └────────┘ └────────┘ └──────────┘                │
 * │      │                                            ▲                       │
 * │      │  libuv thread pool:                        │                       │
 * │      └──► ┌═══════════════════════════════════════┘                       │
 * │           ║  Reading file from disk (separate thread)                     │
 * │           ╚═══════════════════════════════════════                         │
 * │                                                                             │
 * │  The event loop is FREE to do other work while file I/O happens!          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const fs = require('fs');
const path = require('path');

const SCRATCH = '/tmp/claude/-home-surya-js-only/9ed60efb-9031-4376-b20f-72de729939fa/scratchpad';

// ─── 1. Callback style: fs.writeFile + fs.readFile ───────────────────────────
const cbFile = path.join(SCRATCH, 'async-callback.txt');

console.log('A:', 'Starting callback-style write...');

fs.writeFile(cbFile, 'Written with callback!\n', 'utf8', (err) => {
  if (err) throw err;
  console.log('C:', 'File written (callback fired)');

  fs.readFile(cbFile, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('D:', `Read back: "${data.trim()}"`);

    // Append
    fs.appendFile(cbFile, 'Appended line!\n', 'utf8', (err) => {
      if (err) throw err;
      console.log('E:', 'Data appended (callback)');

      // Now run the promise-based demos
      runPromiseDemo();
    });
  });
});

console.log('B:', 'This runs BEFORE the write completes! (non-blocking)');

// ─── 2. Promise style: fs.promises ──────────────────────────────────────────
const runPromiseDemo = async () => {
  const promFile = path.join(SCRATCH, 'async-promise.txt');

  // Write with promises
  await fs.promises.writeFile(promFile, 'Written with promises!\n', 'utf8');
  console.log('F:', 'File written (promise/await)');

  // Read with promises
  const data = await fs.promises.readFile(promFile, 'utf8');
  console.log('G:', `Read back: "${data.trim()}"`);

  // Append with promises
  await fs.promises.appendFile(promFile, 'Appended with promises!\n', 'utf8');
  const updated = await fs.promises.readFile(promFile, 'utf8');
  console.log('H:', `Updated:\n${updated}`);

  // ─── 3. Error handling with async/await ────────────────────────────────────
  try {
    await fs.promises.readFile('/nonexistent/path.txt', 'utf8');
  } catch (err) {
    console.log('I:', `Async error caught: ${err.code}`);
  }

  // ─── 4. Promise.all for parallel file operations ──────────────────────────
  const files = ['para-1.txt', 'para-2.txt', 'para-3.txt'];
  const filePaths = files.map((f) => path.join(SCRATCH, f));

  await Promise.all(
    filePaths.map((fp, i) => fs.promises.writeFile(fp, `File ${i + 1} content`, 'utf8'))
  );
  console.log('J:', 'Three files written in parallel');

  const results = await Promise.all(
    filePaths.map((fp) => fs.promises.readFile(fp, 'utf8'))
  );
  console.log('K:', `Read all three: [${results.join(', ')}]`);

  // Cleanup
  await Promise.all(
    [...filePaths, cbFile, promFile].map((fp) => fs.promises.unlink(fp))
  );
};

/**
 * OUTPUT:
 *   A: Starting callback-style write...
 *   B: This runs BEFORE the write completes! (non-blocking)
 *   C: File written (callback fired)
 *   D: Read back: "Written with callback!"
 *   E: Data appended (callback)
 *   F: File written (promise/await)
 *   G: Read back: "Written with promises!"
 *   H: Updated:
 *   Written with promises!
 *   Appended with promises!
 *
 *   I: Async error caught: ENOENT
 *   J: Three files written in parallel
 *   K: Read all three: [File 1 content, File 2 content, File 3 content]
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Node.js provides three ways to do async file I/O:                        │
 * │  1) Callback-based (fs.readFile) - original API, error-first callbacks    │
 * │  2) Promise-based (fs.promises.readFile) - returns a Promise              │
 * │  3) Async/await with fs.promises - cleanest syntax, use try/catch         │
 * │                                                                             │
 * │  All three are non-blocking: the event loop continues processing other    │
 * │  tasks while libuv handles the I/O on a thread pool thread. This is why   │
 * │  async I/O is REQUIRED in server request handlers - it lets Node serve    │
 * │  thousands of concurrent requests on a single thread. Use Promise.all()   │
 * │  to run multiple file operations in parallel for better throughput."       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/03-fs-module/01-read-write-async.js
 */
