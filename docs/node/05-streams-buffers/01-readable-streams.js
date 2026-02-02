/**
 * TOPIC 01: Readable Streams
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ A Readable stream is a SOURCE of data — it pushes chunks to you.         ║
 * ║ You don't wait for ALL data; you process it CHUNK BY CHUNK.              ║
 * ║                                                                          ║
 * ║   'data' event   → fired for each chunk                                 ║
 * ║   'end' event    → no more data                                          ║
 * ║   'error' event  → something went wrong                                  ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  A Readable stream is like a WATER PIPE.                                   │
 * │                                                                            │
 * │  - Water (data) flows in CHUNKS through the pipe.                          │
 * │  - You DON'T wait for the entire tank to fill — you drink as it flows.     │
 * │  - Each gulp = one 'data' event with a chunk.                              │
 * │  - When the tank is empty = 'end' event.                                   │
 * │  - If the pipe bursts = 'error' event.                                     │
 * │  - You can also PAUSE the pipe and READ manually (pull mode).              │
 * │                                                                            │
 * │  "Don't wait for the whole tank — drink from the pipe!"                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Readable Stream (flowing mode):                                           │
 * │                                                                            │
 * │  ┌────────┐   chunk1   ┌───────────┐   chunk2   ┌───────────┐             │
 * │  │ SOURCE │ ─────────► │ 'data' cb │ ─────────► │ 'data' cb │ ──► ...     │
 * │  │ (file, │            │ (process  │            │ (process  │             │
 * │  │ array) │            │  chunk)   │            │  chunk)   │             │
 * │  └────────┘            └───────────┘            └───────────┘             │
 * │       │                                                                    │
 * │       └──── no more data ──► 'end' event fires                             │
 * │       └──── pipe bursts  ──► 'error' event fires                           │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Readable } = require('stream');

// ─────────────────────────────────────────────
// 1. Creating a Readable from an iterable
// ─────────────────────────────────────────────

const fruits = ['Apple', 'Banana', 'Cherry', 'Date'];
const fruitStream = Readable.from(fruits);

console.log('--- Example 1: Readable.from() with data/end events ---');

const chunks1 = [];
fruitStream.on('data', (chunk) => {
  chunks1.push(`  Received chunk: "${chunk}"`);
});

fruitStream.on('end', () => {
  chunks1.forEach((line) => console.log('A:', line));
  console.log('B: Stream ended — no more data\n');
  runExample2();
});

// ─────────────────────────────────────────────
// 2. Custom Readable with _read method
// ─────────────────────────────────────────────

const runExample2 = () => {
  console.log('--- Example 2: Custom Readable with push() ---');

  let count = 0;
  const counterStream = new Readable({
    read() {
      if (count < 5) {
        this.push(`Count: ${count}\n`);
        count++;
      } else {
        this.push(null); // signal end of stream
      }
    }
  });

  let data2 = '';
  counterStream.on('data', (chunk) => {
    data2 += chunk.toString();
  });

  counterStream.on('end', () => {
    console.log('C:', `All data: ${JSON.stringify(data2)}`);
    runExample3();
  });
};

// ─────────────────────────────────────────────
// 3. Error handling on readable
// ─────────────────────────────────────────────

const runExample3 = () => {
  console.log('\n--- Example 3: Error handling ---');

  const errorStream = new Readable({
    read() {
      this.destroy(new Error('Pipe burst!'));
    }
  });

  errorStream.on('error', (err) => {
    console.log('D:', `Error caught: "${err.message}"`);
    runExample4();
  });
};

// ─────────────────────────────────────────────
// 4. Paused mode with stream.read()
// ─────────────────────────────────────────────

const runExample4 = () => {
  console.log('\n--- Example 4: Paused mode (manual read) ---');

  const src = Readable.from(['one', 'two', 'three']);

  src.on('readable', () => {
    let chunk;
    while ((chunk = src.read()) !== null) {
      console.log('E:', `Manual read: "${chunk}"`);
    }
  });

  src.on('end', () => {
    console.log('F: Manual read finished');
  });
};

/**
 * OUTPUT:
 *   --- Example 1: Readable.from() with data/end events ---
 *   A:   Received chunk: "Apple"
 *   A:   Received chunk: "Banana"
 *   A:   Received chunk: "Cherry"
 *   A:   Received chunk: "Date"
 *   B: Stream ended — no more data
 *
 *   --- Example 2: Custom Readable with push() ---
 *   C: All data: "Count: 0\nCount: 1\nCount: 2\nCount: 3\nCount: 4\n"
 *
 *   --- Example 3: Error handling ---
 *   D: Error caught: "Pipe burst!"
 *
 *   --- Example 4: Paused mode (manual read) ---
 *   E: Manual read: "one"
 *   E: Manual read: "two"
 *   E: Manual read: "three"
 *   F: Manual read finished
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "A Readable stream is a source of data that emits chunks over time.        │
 * │  It has two modes: flowing (data event pushes automatically) and paused    │
 * │  (you call read() manually). Key events are 'data' for each chunk,        │
 * │  'end' when finished, and 'error' for failures. Examples include           │
 * │  fs.createReadStream, HTTP request bodies, and process.stdin. Streams      │
 * │  are memory-efficient because you process data piece by piece instead      │
 * │  of loading everything into memory at once."                               │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/05-streams-buffers/01-readable-streams.js
 */
