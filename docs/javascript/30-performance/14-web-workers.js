/**
 * PERFORMANCE: 14 - Web Workers for Performance
 *
 * ONE CONCEPT: Move heavy computation off the main thread
 */


// =============================================================================
// WHY WEB WORKERS FOR PERFORMANCE
// =============================================================================

console.log('=== Web Workers for Performance ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  OFFLOADING HEAVY WORK TO WEB WORKERS                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WITHOUT Worker:                                                    │
 *   │  Main Thread: ██JS██████████████████████░░░░░░░░░░░░░░░░░░         │
 *   │               ↑ Heavy work blocks UI for 500ms!                    │
 *   │               User clicks → BLOCKED → janky UI                    │
 *   │                                                                      │
 *   │  WITH Worker:                                                       │
 *   │  Main Thread: ██░░░░░░░░░░░░░░░░░░░░░░░░░░ (free for UI)         │
 *   │  Worker:      ██████████████████████████░░░ (heavy work here)     │
 *   │               ↑ postMessage sends result back                      │
 *   │               User clicks → INSTANT response                       │
 *   │                                                                      │
 *   │  GOOD USE CASES:                                                    │
 *   │  • Parsing/processing large JSON/CSV                               │
 *   │  • Image manipulation (filters, resize)                            │
 *   │  • Complex calculations (sorting, searching 100K items)           │
 *   │  • Encryption/hashing                                               │
 *   │  • Markdown/syntax parsing                                          │
 *   │                                                                      │
 *   │  NOT FOR:                                                           │
 *   │  • DOM manipulation (workers can't access DOM)                     │
 *   │  • Quick operations (overhead not worth it)                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Workers: separate thread, no DOM access, communicate via messages');
console.log('Use for: heavy computation that would block the main thread');


// =============================================================================
// BASIC PATTERN
// =============================================================================

console.log('\n=== Basic Worker Pattern ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEB WORKER PATTERN                                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // main.js                                                         │
 *   │  const worker = new Worker('heavy-work.js');                       │
 *   │                                                                      │
 *   │  worker.postMessage({ data: largeDataSet });                       │
 *   │                                                                      │
 *   │  worker.onmessage = (event) => {                                   │
 *   │    console.log('Result:', event.data);                             │
 *   │    updateUI(event.data); // Back on main thread                   │
 *   │  };                                                                 │
 *   │                                                                      │
 *   │  worker.onerror = (error) => {                                     │
 *   │    console.error('Worker error:', error.message);                  │
 *   │  };                                                                 │
 *   │                                                                      │
 *   │  // heavy-work.js (worker)                                          │
 *   │  self.onmessage = (event) => {                                     │
 *   │    const result = processData(event.data);   // Heavy work        │
 *   │    self.postMessage(result);                  // Send back        │
 *   │  };                                                                 │
 *   │                                                                      │
 *   │  // Inline worker (no separate file):                              │
 *   │  const blob = new Blob([`                                          │
 *   │    self.onmessage = (e) => {                                       │
 *   │      const result = e.data.map(x => x * 2);                      │
 *   │      self.postMessage(result);                                     │
 *   │    };                                                               │
 *   │  `], { type: 'application/javascript' });                          │
 *   │  const worker = new Worker(URL.createObjectURL(blob));            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Main → postMessage(data) → Worker processes → postMessage(result) → Main');
console.log('Inline worker via Blob + URL.createObjectURL (no separate file)');


// =============================================================================
// TRANSFERABLE OBJECTS
// =============================================================================

console.log('\n=== Transferable Objects ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TRANSFERABLE OBJECTS: Zero-copy data transfer                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Normal postMessage: copies data (slow for large arrays)          │
 *   │  Transfer: moves ownership (instant, original becomes unusable)   │
 *   │                                                                      │
 *   │  // Copy (slow for large data):                                     │
 *   │  worker.postMessage(largeBuffer);                                  │
 *   │                                                                      │
 *   │  // Transfer (instant, zero-copy):                                  │
 *   │  worker.postMessage(largeBuffer, [largeBuffer]);                  │
 *   │  // largeBuffer is now empty in main thread!                       │
 *   │                                                                      │
 *   │  Transferable types:                                                │
 *   │  ArrayBuffer, MessagePort, ImageBitmap,                            │
 *   │  OffscreenCanvas, ReadableStream                                   │
 *   │                                                                      │
 *   │  Use for: image data, audio buffers, large typed arrays           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('postMessage(data) → copies (slow for large data)');
console.log('postMessage(data, [data]) → transfers (instant, zero-copy)');
console.log('Original becomes unusable after transfer');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Web Workers run JavaScript on a separate thread, keeping the main
 * thread free for UI updates and user input. I use them for heavy
 * computation like processing large datasets, image manipulation, or
 * complex sorting that would otherwise block the main thread for
 * hundreds of milliseconds.
 *
 * Communication is via postMessage — the main thread sends data to the
 * worker, the worker processes it, and sends the result back. For large
 * binary data like images or audio, I use transferable objects which
 * move ownership without copying — it's instant regardless of size.
 *
 * Workers can't access the DOM, so they're specifically for computation.
 * The pattern is: detect a long task in DevTools, extract the computation
 * into a worker, and update the UI when the result arrives.
 *
 * In modern frameworks, I might use Comlink to make worker communication
 * feel like normal async function calls instead of raw postMessage."
 */


// RUN: node docs/30-performance/14-web-workers.js
