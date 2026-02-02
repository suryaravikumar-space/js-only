/**
 * TOPIC 05: Backpressure
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Backpressure is when the WRITABLE can't keep up with the READABLE.       ║
 * ║ The solution: PAUSE reading until the writer drains its buffer.           ║
 * ║                                                                          ║
 * ║   write() returns false  → buffer full, STOP reading                     ║
 * ║   'drain' event fires    → buffer empty, RESUME reading                  ║
 * ║   pipe() handles this    → automatically pauses/resumes                  ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Backpressure is like a TRAFFIC JAM.                                       │
 * │                                                                            │
 * │  - Cars (data chunks) race down a highway (readable stream).               │
 * │  - They hit a narrow road (writable stream with limited buffer).           │
 * │  - If cars arrive faster than the road can handle = JAM.                   │
 * │  - Traffic control (backpressure) puts up a RED LIGHT (pause readable).    │
 * │  - When the road clears (drain event) = GREEN LIGHT (resume readable).    │
 * │  - pipe() is like an AUTOMATIC traffic light — handles it for you.        │
 * │                                                                            │
 * │  "Fast producer + slow consumer = backpressure. Pause and wait for drain." │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  WITHOUT backpressure (data loss / memory blow-up):                        │
 * │                                                                            │
 * │  Readable (FAST)      Writable (SLOW)                                      │
 * │  ████████████ ──────► ██░░░░░░  ← buffer overflows!                       │
 * │  chunks fly out        can't keep up                                       │
 * │                                                                            │
 * │  WITH backpressure (controlled flow):                                      │
 * │                                                                            │
 * │  Readable          Writable                                                │
 * │  ████ ──────────► ████████  ← buffer fills up                             │
 * │  (paused!)         write() returns false                                   │
 * │       ...waits...                                                          │
 * │  ████ ──────────► ██░░░░░░  ← drain event fires                          │
 * │  (resumed!)        buffer cleared                                          │
 * │                                                                            │
 * │  How pipe() handles it automatically:                                      │
 * │                                                                            │
 * │  readable.pipe(writable)                                                   │
 * │    │                                                                       │
 * │    ├─ on('data') → writable.write(chunk)                                   │
 * │    │                 │                                                     │
 * │    │                 ├─ returns true  → keep reading                       │
 * │    │                 └─ returns false → readable.pause()                   │
 * │    │                                                                       │
 * │    └─ writable.on('drain') → readable.resume()                             │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Readable, Writable, pipeline } = require('stream');

// ─────────────────────────────────────────────
// 1. Demonstrating write() returning false
// ─────────────────────────────────────────────

console.log('--- Example 1: write() return value ---');

const slowWriter = new Writable({
  highWaterMark: 16, // tiny 16-byte buffer
  write(chunk, encoding, callback) {
    // simulate slow processing (50ms per chunk)
    setTimeout(() => callback(), 50);
  }
});

const bigChunk = 'A'.repeat(20); // 20 bytes > 16 byte highWaterMark

const ok1 = slowWriter.write(bigChunk);
console.log('A:', `First write returned: ${ok1}`);  // false — exceeded highWaterMark

const ok2 = slowWriter.write('B');
console.log('B:', `Second write returned: ${ok2}`);  // false — still full

slowWriter.on('drain', () => {
  console.log('C: drain event — buffer cleared, safe to write again\n');
  runExample2();
});

slowWriter.end();

// ─────────────────────────────────────────────
// 2. Manual backpressure handling
// ─────────────────────────────────────────────

const runExample2 = () => {
  console.log('--- Example 2: Manual backpressure handling ---');

  let produced = 0;
  const fastReader = new Readable({
    highWaterMark: 10,
    read() {
      if (produced < 5) {
        const chunk = `chunk-${produced} `;
        this.push(chunk);
        produced++;
      } else {
        this.push(null);
      }
    }
  });

  const result = [];
  const slowDest = new Writable({
    highWaterMark: 8, // small buffer
    write(chunk, encoding, callback) {
      result.push(chunk.toString().trim());
      // simulate slow write
      setTimeout(() => callback(), 30);
    }
  });

  // Manual backpressure: pause/resume based on write() return
  fastReader.on('data', (chunk) => {
    const canContinue = slowDest.write(chunk);
    if (!canContinue) {
      fastReader.pause();
      slowDest.once('drain', () => {
        fastReader.resume();
      });
    }
  });

  fastReader.on('end', () => {
    slowDest.end();
  });

  slowDest.on('finish', () => {
    console.log('D:', `All chunks received: ${JSON.stringify(result)}`);
    console.log('E: Manual backpressure handled correctly\n');
    runExample3();
  });
};

// ─────────────────────────────────────────────
// 3. pipe() handles backpressure automatically
// ─────────────────────────────────────────────

const runExample3 = () => {
  console.log('--- Example 3: pipe() handles backpressure automatically ---');

  let count = 0;
  const producer = new Readable({
    highWaterMark: 10,
    read() {
      if (count < 5) {
        this.push(`item-${count} `);
        count++;
      } else {
        this.push(null);
      }
    }
  });

  const items = [];
  const consumer = new Writable({
    highWaterMark: 8,
    write(chunk, encoding, callback) {
      items.push(chunk.toString().trim());
      setTimeout(() => callback(), 20);
    }
  });

  producer.pipe(consumer);

  consumer.on('finish', () => {
    console.log('F:', `pipe() delivered all: ${JSON.stringify(items)}`);
    console.log('G: pipe() paused/resumed automatically — no manual code needed\n');
    runExample4();
  });
};

// ─────────────────────────────────────────────
// 4. Checking highWaterMark and writableLength
// ─────────────────────────────────────────────

const runExample4 = () => {
  console.log('--- Example 4: Inspecting buffer state ---');

  const writer = new Writable({
    highWaterMark: 32,
    write(chunk, encoding, callback) {
      setTimeout(() => callback(), 100);
    }
  });

  console.log('H:', `highWaterMark: ${writer.writableHighWaterMark} bytes`);

  writer.write('Hello World 12345'); // 17 bytes
  console.log('I:', `writableLength after write: ${writer.writableLength} bytes`);
  console.log('J:', `Buffer usage: ${writer.writableLength}/${writer.writableHighWaterMark}`);

  writer.end(() => {
    console.log('K: Writer finished');
  });
};

/**
 * OUTPUT:
 *   --- Example 1: write() return value ---
 *   A: First write returned: false
 *   B: Second write returned: false
 *   C: drain event — buffer cleared, safe to write again
 *
 *   --- Example 2: Manual backpressure handling ---
 *   D: All chunks received: ["chunk-0","chunk-1","chunk-2","chunk-3","chunk-4"]
 *   E: Manual backpressure handled correctly
 *
 *   --- Example 3: pipe() handles backpressure automatically ---
 *   F: pipe() delivered all: ["item-0","item-1","item-2","item-3","item-4"]
 *   G: pipe() paused/resumed automatically — no manual code needed
 *
 *   --- Example 4: Inspecting buffer state ---
 *   H: highWaterMark: 32 bytes
 *   I: writableLength after write: 17 bytes
 *   J: Buffer usage: 17/32
 *   K: Writer finished
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "Backpressure occurs when a readable stream produces data faster than      │
 * │  the writable stream can consume it. The writable's internal buffer        │
 * │  fills up past highWaterMark, and write() returns false — signaling        │
 * │  the producer to pause. When the buffer drains, a 'drain' event fires     │
 * │  and the producer resumes. pipe() and pipeline() handle this               │
 * │  automatically by pausing/resuming the readable. Without backpressure,     │
 * │  you'd exhaust memory or lose data. Always respect write()'s return        │
 * │  value when writing manually."                                             │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/05-streams-buffers/05-backpressure.js
 */
