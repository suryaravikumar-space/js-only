/**
 * TOPIC 03: Transform Streams
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ A Transform stream is BOTH Readable AND Writable.                        ║
 * ║ Data goes IN, gets MODIFIED, and comes OUT — like a filter.              ║
 * ║                                                                          ║
 * ║   input chunk → _transform(chunk, enc, cb) → push(modified) → output    ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  A Transform stream is like a FACTORY CONVEYOR BELT.                       │
 * │                                                                            │
 * │  - Raw material (input chunk) goes in on one end.                          │
 * │  - A machine (_transform) processes it — cuts, shapes, paints.             │
 * │  - Finished product (output chunk) comes out the other end.                │
 * │  - The belt keeps running — chunk after chunk gets processed.              │
 * │  - You can CHAIN belts: raw → cut → paint → package.                      │
 * │                                                                            │
 * │  "Raw in, processed out — that's a Transform stream."                      │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Readable ──► Transform ──► Writable                                       │
 * │                                                                            │
 * │  ┌────────┐    ┌───────────────────┐    ┌────────────┐                     │
 * │  │ "hello"│───►│ _transform()      │───►│ "HELLO"    │                     │
 * │  │ "world"│───►│  .toUpperCase()   │───►│ "WORLD"    │                     │
 * │  │  null  │───►│  push(modified)   │───►│ (end)      │                     │
 * │  └────────┘    └───────────────────┘    └────────────┘                     │
 * │                                                                            │
 * │  Pipeline:                                                                 │
 * │  ┌──────┐  pipe  ┌───────────┐  pipe  ┌───────────┐  pipe  ┌──────┐       │
 * │  │Source│──────►│ Transform1│──────►│ Transform2│──────►│ Dest │       │
 * │  │      │       │ uppercase │       │ add prefix│       │      │       │
 * │  └──────┘       └───────────┘       └───────────┘       └──────┘       │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Transform, Readable, Writable } = require('stream');

// ─────────────────────────────────────────────
// 1. Simple uppercase Transform
// ─────────────────────────────────────────────

console.log('--- Example 1: Uppercase Transform ---');

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    const upper = chunk.toString().toUpperCase();
    this.push(upper);
    callback();
  }
});

const source1 = Readable.from(['hello', ' ', 'world']);
const result1 = [];

source1
  .pipe(upperCase)
  .on('data', (chunk) => result1.push(chunk.toString()))
  .on('end', () => {
    console.log('A:', `Result: "${result1.join('')}"`);
    runExample2();
  });

// ─────────────────────────────────────────────
// 2. Transform with line numbering
// ─────────────────────────────────────────────

const runExample2 = () => {
  console.log('\n--- Example 2: Line Numbering Transform ---');

  let lineNum = 0;
  const addLineNumbers = new Transform({
    transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n').filter(Boolean);
      const numbered = lines.map((line) => {
        lineNum++;
        return `${lineNum}: ${line}`;
      });
      this.push(numbered.join('\n') + '\n');
      callback();
    }
  });

  const source2 = Readable.from(['apple\nbanana\n', 'cherry\ndate\n']);
  let result2 = '';

  source2
    .pipe(addLineNumbers)
    .on('data', (chunk) => { result2 += chunk.toString(); })
    .on('end', () => {
      console.log('B:', `Numbered:\n${result2.split('\n').filter(Boolean).map((l) => `     ${l}`).join('\n')}`);
      runExample3();
    });
};

// ─────────────────────────────────────────────
// 3. Chaining Transforms: Readable → T1 → T2 → Writable
// ─────────────────────────────────────────────

const runExample3 = () => {
  console.log('\n--- Example 3: Chaining Transforms ---');

  const toUpper = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    }
  });

  const addExclaim = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().trim() + '!\n');
      callback();
    }
  });

  const result3 = [];
  const collector = new Writable({
    write(chunk, encoding, callback) {
      result3.push(chunk.toString().trim());
      callback();
    }
  });

  const source3 = Readable.from(['hello', 'world', 'node']);

  source3
    .pipe(toUpper)
    .pipe(addExclaim)
    .pipe(collector);

  collector.on('finish', () => {
    console.log('C:', `Chained result: ${JSON.stringify(result3)}`);
    runExample4();
  });
};

// ─────────────────────────────────────────────
// 4. Transform that filters (drops some chunks)
// ─────────────────────────────────────────────

const runExample4 = () => {
  console.log('\n--- Example 4: Filtering Transform ---');

  const onlyLong = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const str = chunk.toString();
      if (str.length > 4) {
        this.push(str);
      }
      // short strings are dropped — not pushed
      callback();
    }
  });

  const words = Readable.from(['hi', 'hello', 'ok', 'world', 'no', 'stream']);
  const kept = [];

  words
    .pipe(onlyLong)
    .on('data', (chunk) => kept.push(chunk.toString()))
    .on('end', () => {
      console.log('D:', `Kept (length > 4): ${JSON.stringify(kept)}`);
    });
};

/**
 * OUTPUT:
 *   --- Example 1: Uppercase Transform ---
 *   A: Result: "HELLO WORLD"
 *
 *   --- Example 2: Line Numbering Transform ---
 *   B: Numbered:
 *        1: apple
 *        2: banana
 *        3: cherry
 *        4: date
 *
 *   --- Example 3: Chaining Transforms ---
 *   C: Chained result: ["HELLO!","WORLD!","NODE!"]
 *
 *   --- Example 4: Filtering Transform ---
 *   D: Kept (length > 4): ["hello","world","stream"]
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "A Transform stream is a duplex stream that modifies data as it passes     │
 * │  through. You implement _transform(chunk, enc, cb) to process each chunk   │
 * │  and push() the result. It's both readable and writable, making it         │
 * │  perfect for piping: readable.pipe(transform).pipe(writable). Common       │
 * │  uses include compression (zlib.createGzip), encryption, CSV parsing,      │
 * │  and data formatting. Transforms can also filter by choosing not to        │
 * │  push certain chunks."                                                     │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/05-streams-buffers/03-transform-streams.js
 */
