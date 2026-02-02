/**
 * TOPIC 04: Piping
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ pipe() connects a Readable to a Writable — data flows automatically.     ║
 * ║ pipeline() does the same BUT with proper error handling & cleanup.        ║
 * ║                                                                          ║
 * ║   readable.pipe(writable)                  → simple, no error cleanup    ║
 * ║   pipeline(readable, ...transforms, writable, cb) → safe, auto cleanup  ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Piping is like PLUMBING in a house.                                       │
 * │                                                                            │
 * │  - pipe() connects pipes together — water flows from source to drain.      │
 * │  - You can chain pipes: tank → filter → heater → faucet.                  │
 * │  - With pipe(), if one pipe BURSTS, the others keep running (leak!).       │
 * │  - pipeline() is like a SMART plumbing system — if one pipe bursts,       │
 * │    it shuts off ALL pipes and reports the problem.                          │
 * │                                                                            │
 * │  "pipe() connects, pipeline() connects SAFELY."                            │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  pipe() chain:                                                             │
 * │                                                                            │
 * │  ┌────────┐ .pipe() ┌───────────┐ .pipe() ┌───────────┐ .pipe() ┌──────┐ │
 * │  │Readable│────────►│ Transform │────────►│ Transform │────────►│Write ││
 * │  │ source │         │ uppercase │         │ add-prefix│         │ dest ││
 * │  └────────┘         └───────────┘         └───────────┘         └──────┘ │
 * │                                                                            │
 * │  pipeline() — same flow but with error propagation:                        │
 * │                                                                            │
 * │  pipeline(source, uppercase, addPrefix, dest, (err) => {                   │
 * │    // if ANY stream errors, ALL are destroyed & err is reported            │
 * │  });                                                                       │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const { Readable, Writable, Transform, pipeline } = require('stream');

// ─────────────────────────────────────────────
// 1. Basic pipe(): Readable → Writable
// ─────────────────────────────────────────────

console.log('--- Example 1: Basic pipe() ---');

const source1 = Readable.from(['Hello ', 'from ', 'pipe!']);
const result1 = [];

const dest1 = new Writable({
  write(chunk, encoding, callback) {
    result1.push(chunk.toString());
    callback();
  }
});

source1.pipe(dest1);

dest1.on('finish', () => {
  console.log('A:', `Piped result: "${result1.join('')}"`);
  runExample2();
});

// ─────────────────────────────────────────────
// 2. Chaining pipes: Readable → Transform → Writable
// ─────────────────────────────────────────────

const runExample2 = () => {
  console.log('\n--- Example 2: Chaining pipes ---');

  const source = Readable.from(['node', 'streams', 'rock']);

  const upper = new Transform({
    transform(chunk, enc, cb) {
      this.push(chunk.toString().toUpperCase());
      cb();
    }
  });

  const addBang = new Transform({
    transform(chunk, enc, cb) {
      this.push(chunk.toString() + '! ');
      cb();
    }
  });

  const parts = [];
  const dest = new Writable({
    write(chunk, enc, cb) {
      parts.push(chunk.toString());
      cb();
    }
  });

  source.pipe(upper).pipe(addBang).pipe(dest);

  dest.on('finish', () => {
    console.log('B:', `Chained: "${parts.join('').trim()}"`);
    runExample3();
  });
};

// ─────────────────────────────────────────────
// 3. pipe() does NOT propagate errors!
// ─────────────────────────────────────────────

const runExample3 = () => {
  console.log('\n--- Example 3: pipe() error problem ---');

  const badSource = new Readable({
    read() {
      this.destroy(new Error('Source exploded!'));
    }
  });

  const dest = new Writable({
    write(chunk, enc, cb) { cb(); }
  });

  // With pipe(), you must listen for errors on EACH stream
  badSource.on('error', (err) => {
    console.log('C:', `Error on source: "${err.message}"`);
  });

  dest.on('error', (err) => {
    console.log('C:', `Error on dest: "${err.message}"`);
  });

  badSource.pipe(dest);

  // Give it a moment then move on
  setTimeout(() => runExample4(), 100);
};

// ─────────────────────────────────────────────
// 4. pipeline() — the safe way (auto error handling)
// ─────────────────────────────────────────────

const runExample4 = () => {
  console.log('\n--- Example 4: pipeline() — safe piping ---');

  const source = Readable.from(['hello', ' ', 'pipeline']);

  const upper = new Transform({
    transform(chunk, enc, cb) {
      this.push(chunk.toString().toUpperCase());
      cb();
    }
  });

  const result = [];
  const dest = new Writable({
    write(chunk, enc, cb) {
      result.push(chunk.toString());
      cb();
    }
  });

  pipeline(source, upper, dest, (err) => {
    if (err) {
      console.log('D:', `Pipeline error: "${err.message}"`);
    } else {
      console.log('D:', `Pipeline result: "${result.join('')}"`);
    }
    runExample5();
  });
};

// ─────────────────────────────────────────────
// 5. pipeline() error propagation
// ─────────────────────────────────────────────

const runExample5 = () => {
  console.log('\n--- Example 5: pipeline() with error ---');

  const source = Readable.from(['data1', 'data2']);

  const badTransform = new Transform({
    transform(chunk, enc, cb) {
      cb(new Error('Transform broke!'));
    }
  });

  const dest = new Writable({
    write(chunk, enc, cb) { cb(); }
  });

  pipeline(source, badTransform, dest, (err) => {
    if (err) {
      console.log('E:', `Pipeline caught error: "${err.message}"`);
      console.log('F: All streams destroyed & cleaned up automatically');
    }
  });
};

/**
 * OUTPUT:
 *   --- Example 1: Basic pipe() ---
 *   A: Piped result: "Hello from pipe!"
 *
 *   --- Example 2: Chaining pipes ---
 *   B: Chained: "NODE! STREAMS! ROCK!"
 *
 *   --- Example 3: pipe() error problem ---
 *   C: Error on source: "Source exploded!"
 *
 *   --- Example 4: pipeline() — safe piping ---
 *   D: Pipeline result: "HELLO PIPELINE"
 *
 *   --- Example 5: pipeline() with error ---
 *   E: Pipeline caught error: "Transform broke!"
 *   F: All streams destroyed & cleaned up automatically
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "pipe() connects a readable to a writable so data flows automatically,     │
 * │  and it handles backpressure. However, pipe() doesn't propagate errors —   │
 * │  you must listen on each stream individually. pipeline() (from             │
 * │  stream module) is the preferred approach: it chains streams together,     │
 * │  propagates errors to a single callback, and destroys all streams on       │
 * │  failure. Always use pipeline() in production. You can also use the        │
 * │  promise version: const { pipeline } = require('stream/promises')."       │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/05-streams-buffers/04-piping.js
 */
