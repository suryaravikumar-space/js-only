/**
 * TOPIC 02: Streams - Reading & Writing Large Files
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Streams process data in CHUNKS instead of loading everything into        ║
 * ║ memory at once. A 2GB file? Streams handle it with ~64KB of memory.      ║
 * ║                                                                            ║
 * ║   fs.createReadStream()  → reads file in chunks                          ║
 * ║   fs.createWriteStream() → writes file in chunks                         ║
 * ║   readStream.pipe(writeStream) → connect them together                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  DRINKING WATER: two ways to do it.                                       │
 * │                                                                             │
 * │  Option A - Fill a bucket first (readFileSync / readFile):                │
 * │    - Go to the river                                                       │
 * │    - Fill a HUGE bucket with ALL the water                                │
 * │    - Carry the heavy bucket back                                           │
 * │    - NOW you can drink                                                     │
 * │    - Problem: What if the river is an ocean? Your bucket explodes! (OOM) │
 * │                                                                             │
 * │  Option B - Drink from a hose (Streams):                                  │
 * │    - Connect a hose to the river                                           │
 * │    - Water flows through in small amounts                                 │
 * │    - You drink as it comes, sip by sip (chunk by chunk)                  │
 * │    - Works even if the river is infinite!                                  │
 * │    - You never need to hold all the water at once                         │
 * │                                                                             │
 * │  "Streams = drinking from a hose, not filling a bucket."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: STREAM CHUNK FLOW                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  readFile (loads ALL into memory):                                         │
 * │                                                                             │
 * │  ┌─────────────────────────────────┐     ┌─────────────────┐              │
 * │  │  FILE (500MB)                   │ ──► │  RAM (500MB!)   │              │
 * │  │  ████████████████████████████   │     │  ██████████████ │              │
 * │  └─────────────────────────────────┘     └─────────────────┘              │
 * │                                                                             │
 * │  createReadStream (chunks of ~64KB):                                       │
 * │                                                                             │
 * │  ┌─────────────────────────────────┐     ┌───┐                            │
 * │  │  FILE (500MB)                   │ ──► │64K│ ──► process ──► done       │
 * │  │  ████████████████████████████   │     └───┘     ──► next chunk         │
 * │  └─────────────────────────────────┘     only 64KB in RAM at a time!      │
 * │                                                                             │
 * │  pipe() connects read → write:                                             │
 * │                                                                             │
 * │  ┌──────────┐    ┌───┐ ┌───┐ ┌───┐    ┌──────────┐                       │
 * │  │  source  │──►│ c1 │►│ c2 │►│ c3 │──►│  dest    │                       │
 * │  │  file    │    └───┘ └───┘ └───┘    │  file    │                       │
 * │  └──────────┘    chunks flow through   └──────────┘                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const fs = require('fs');
const path = require('path');

const SCRATCH = '/tmp/claude/-home-surya-js-only/9ed60efb-9031-4376-b20f-72de729939fa/scratchpad';

const run = async () => {

  // ─── 1. Create a sample file to stream ───────────────────────────────────
  const srcFile = path.join(SCRATCH, 'stream-source.txt');
  let sampleData = '';
  for (let i = 1; i <= 1000; i++) {
    sampleData += `Line ${i}: This is some sample data for streaming demo.\n`;
  }
  fs.writeFileSync(srcFile, sampleData, 'utf8');
  console.log('A:', `Created source file (${(sampleData.length / 1024).toFixed(1)} KB)`);

  // ─── 2. createReadStream - read in chunks ────────────────────────────────
  await new Promise((resolve) => {
    const readStream = fs.createReadStream(srcFile, {
      encoding: 'utf8',
      highWaterMark: 1024 // 1KB chunks (default is 64KB)
    });

    let chunkCount = 0;
    let totalBytes = 0;

    readStream.on('data', (chunk) => {
      chunkCount++;
      totalBytes += chunk.length;
    });

    readStream.on('end', () => {
      console.log('B:', `Read in ${chunkCount} chunks, total ${totalBytes} bytes`);
      resolve();
    });

    readStream.on('error', (err) => {
      console.error('Read error:', err.message);
      resolve();
    });
  });

  // ─── 3. createWriteStream - write in chunks ─────────────────────────────
  const destFile = path.join(SCRATCH, 'stream-dest.txt');

  await new Promise((resolve) => {
    const writeStream = fs.createWriteStream(destFile, { encoding: 'utf8' });

    for (let i = 1; i <= 5; i++) {
      writeStream.write(`Chunk ${i}: Written via stream\n`);
    }

    writeStream.end(() => {
      console.log('C:', 'Write stream finished');
      const content = fs.readFileSync(destFile, 'utf8');
      console.log('D:', `Dest file has ${content.split('\n').length - 1} lines`);
      resolve();
    });
  });

  // ─── 4. pipe() - connect read stream to write stream ────────────────────
  const copyDest = path.join(SCRATCH, 'stream-copy.txt');

  await new Promise((resolve) => {
    const readStream = fs.createReadStream(srcFile);
    const writeStream = fs.createWriteStream(copyDest);

    readStream.pipe(writeStream);

    writeStream.on('finish', () => {
      const origSize = fs.statSync(srcFile).size;
      const copySize = fs.statSync(copyDest).size;
      console.log('E:', `Piped ${origSize} bytes → copy is ${copySize} bytes (match: ${origSize === copySize})`);
      resolve();
    });
  });

  // ─── 5. Stream events ───────────────────────────────────────────────────
  await new Promise((resolve) => {
    const readStream = fs.createReadStream(srcFile, { highWaterMark: 16 * 1024 });

    readStream.on('open', () => console.log('F:', 'Event: open (file descriptor opened)'));
    readStream.on('ready', () => console.log('G:', 'Event: ready (stream is ready)'));

    let chunks = 0;
    readStream.on('data', () => chunks++);
    readStream.on('end', () => console.log('H:', `Event: end (${chunks} chunks read)`));
    readStream.on('close', () => {
      console.log('I:', 'Event: close (file descriptor closed)');
      resolve();
    });
  });

  // ─── 6. Memory comparison: readFile vs stream ──────────────────────────
  const memBefore = process.memoryUsage().heapUsed;
  await new Promise((resolve) => {
    const stream = fs.createReadStream(srcFile, { highWaterMark: 1024 });
    stream.on('data', () => {}); // consume
    stream.on('end', () => {
      const memAfter = process.memoryUsage().heapUsed;
      const diff = ((memAfter - memBefore) / 1024).toFixed(1);
      console.log('J:', `Stream memory overhead: ~${diff} KB (not the full file size!)`);
      resolve();
    });
  });

  // Cleanup
  [srcFile, destFile, copyDest].forEach((f) => fs.unlinkSync(f));
};

run();

/**
 * OUTPUT:
 *   A: Created source file (~53.7 KB)
 *   B: Read in ~54 chunks, total ~55000 bytes
 *   C: Write stream finished
 *   D: Dest file has 5 lines
 *   E: Piped ~55000 bytes → copy is ~55000 bytes (match: true)
 *   F: Event: open (file descriptor opened)
 *   G: Event: ready (stream is ready)
 *   H: Event: end (X chunks read)
 *   I: Event: close (file descriptor closed)
 *   J: Stream memory overhead: ~X KB (not the full file size!)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Streams process data in chunks rather than loading entire files into      │
 * │  memory. fs.createReadStream reads a file in configurable chunks           │
 * │  (default 64KB via highWaterMark), and fs.createWriteStream writes         │
 * │  chunk by chunk. The pipe() method connects a readable to a writable      │
 * │  stream, handling backpressure automatically. Streams are essential for    │
 * │  large files - reading a 2GB file with readFile would consume 2GB of      │
 * │  RAM, but streams only use ~64KB at a time. Key events: 'data' (chunk     │
 * │  received), 'end' (no more data), 'error', and 'close'. Node.js HTTP     │
 * │  requests and responses are also streams."                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/03-fs-module/02-streams-read-write.js
 */
