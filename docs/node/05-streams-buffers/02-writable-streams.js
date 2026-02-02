/**
 * TOPIC 02: Writable Streams
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ A Writable stream is a DESTINATION for data — you push chunks into it.   ║
 * ║ It accepts data with write() and signals completion with end().           ║
 * ║                                                                          ║
 * ║   stream.write(chunk)  → write data                                      ║
 * ║   stream.end()         → signal no more writes                           ║
 * ║   'finish' event       → all data flushed                                ║
 * ║   'drain' event        → buffer emptied, safe to write again             ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  A Writable stream is like a FUNNEL pouring into a bottle.                 │
 * │                                                                            │
 * │  - You pour liquid (chunks) into the funnel with write().                  │
 * │  - The funnel has a MAX CAPACITY (highWaterMark).                          │
 * │  - If you pour too fast, it overflows — write() returns false.             │
 * │  - Wait for 'drain' (funnel empties) before pouring more.                 │
 * │  - Call end() when you're done — triggers 'finish' event.                  │
 * │                                                                            │
 * │  "Pour through the funnel, wait for drain, then pour more."               │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │         write(chunk1)   write(chunk2)   end()                              │
 * │              │               │            │                                │
 * │              ▼               ▼            ▼                                │
 * │         ┌─────────────────────────────────────┐                            │
 * │         │      INTERNAL BUFFER                │                            │
 * │         │   (highWaterMark = 16KB default)    │                            │
 * │         │                                     │                            │
 * │         │  ┌───┬───┬───┬───┬   ┬   ┬   ┐    │                            │
 * │         │  │ c1│ c2│   │   │   │   │   │    │                            │
 * │         │  └───┴───┴───┴───┴   ┴   ┴   ┘    │                            │
 * │         └──────────────┬──────────────────────┘                            │
 * │                        │ flush                                             │
 * │                        ▼                                                   │
 * │              ┌──────────────────┐                                          │
 * │              │   DESTINATION    │──► 'finish' when end() + flushed         │
 * │              │ (file, stdout)   │──► 'drain' when buffer empties           │
 * │              └──────────────────┘                                          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Writable } = require('stream');

// ─────────────────────────────────────────────
// 1. Writing to process.stdout (simplest writable)
// ─────────────────────────────────────────────

console.log('--- Example 1: process.stdout is a Writable ---');
process.stdout.write('A: Hello from stdout.write()\n');

// ─────────────────────────────────────────────
// 2. Custom Writable stream
// ─────────────────────────────────────────────

console.log('\n--- Example 2: Custom Writable ---');

const collected = [];

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    collected.push(chunk.toString().toUpperCase());
    callback(); // signal we're done processing this chunk
  }
});

myWritable.write('hello');
myWritable.write(' world');
myWritable.end();

myWritable.on('finish', () => {
  console.log('B:', `Collected: ${JSON.stringify(collected)}`);
  console.log('C: Writable finished — all data flushed');
  runExample3();
});

// ─────────────────────────────────────────────
// 3. write() return value & highWaterMark
// ─────────────────────────────────────────────

const runExample3 = () => {
  console.log('\n--- Example 3: highWaterMark & write() return value ---');

  const tinyWritable = new Writable({
    highWaterMark: 10, // only 10 bytes buffer
    write(chunk, encoding, callback) {
      // simulate slow processing
      setTimeout(() => callback(), 50);
    }
  });

  const canContinue1 = tinyWritable.write('Short');
  console.log('D:', `write("Short") returned: ${canContinue1}`); // true

  const canContinue2 = tinyWritable.write('This is a longer string');
  console.log('E:', `write("This is a longer string") returned: ${canContinue2}`); // false — buffer full

  tinyWritable.on('drain', () => {
    console.log('F: drain event — buffer emptied, safe to write again');
  });

  tinyWritable.end(() => {
    console.log('G: tinyWritable finished\n');
    runExample4();
  });
};

// ─────────────────────────────────────────────
// 4. Error handling
// ─────────────────────────────────────────────

const runExample4 = () => {
  console.log('--- Example 4: Error handling ---');

  const errWritable = new Writable({
    write(chunk, encoding, callback) {
      callback(new Error('Disk full!'));
    }
  });

  errWritable.on('error', (err) => {
    console.log('H:', `Error caught: "${err.message}"`);
  });

  errWritable.write('data');
};

/**
 * OUTPUT:
 *   --- Example 1: process.stdout is a Writable ---
 *   A: Hello from stdout.write()
 *
 *   --- Example 2: Custom Writable ---
 *   B: Collected: ["HELLO"," WORLD"]
 *   C: Writable finished — all data flushed
 *
 *   --- Example 3: highWaterMark & write() return value ---
 *   D: write("Short") returned: true
 *   E: write("This is a longer string") returned: false
 *   F: drain event — buffer emptied, safe to write again
 *   G: tinyWritable finished
 *
 *   --- Example 4: Error handling ---
 *   H: Error caught: "Disk full!"
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "A Writable stream is a destination for data. You send chunks via          │
 * │  write() and call end() when done. It has an internal buffer sized by      │
 * │  highWaterMark — if write() returns false, the buffer is full and you      │
 * │  should wait for the 'drain' event. The 'finish' event fires after        │
 * │  end() is called and all data is flushed. Examples include                 │
 * │  fs.createWriteStream, HTTP responses, and process.stdout."               │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/05-streams-buffers/02-writable-streams.js
 */
