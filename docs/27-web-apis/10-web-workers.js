/**
 * WEB APIS: 10 - Web Workers
 *
 * ONE CONCEPT: Run JavaScript in background thread without blocking UI
 */


// =============================================================================
// WHAT ARE WEB WORKERS?
// =============================================================================

/**
 * Web Workers = JavaScript running in a SEPARATE THREAD.
 *               Main thread stays responsive while worker does heavy work.
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  THE PROBLEM: SINGLE-THREADED JAVASCRIPT                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Normal JavaScript runs on the MAIN THREAD:                          │
 *   │                                                                      │
 *   │  Main Thread                                                         │
 *   │  ┌──────────────────────────────────────────────────────────────┐    │
 *   │  │ UI Render │ Event │ Heavy Calc │ UI Render │ Event │        │    │
 *   │  └──────────────────────────────────────────────────────────────┘    │
 *   │                       ↑                                              │
 *   │              Page FREEZES during heavy calculation!                  │
 *   │              User can't click, scroll, or type.                      │
 *   │                                                                      │
 *   │                                                                      │
 *   │  WITH WEB WORKERS:                                                   │
 *   │                                                                      │
 *   │  Main Thread (stays responsive)                                      │
 *   │  ┌────────────────────────────────────────────────────────────────┐  │
 *   │  │ UI Render │ Event │ UI Render │ Event │ UI Render │ Event │   │  │
 *   │  └────────────────────────────────────────────────────────────────┘  │
 *   │                                                                      │
 *   │  Worker Thread (background)                                          │
 *   │  ┌────────────────────────────────────────────────────────────────┐  │
 *   │  │         Heavy Calculation (doesn't block main!)               │  │
 *   │  └────────────────────────────────────────────────────────────────┘  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC USAGE
// =============================================================================

console.log('=== Basic Web Worker Usage ===\n');

const basicUsage = `
// ═══════════════════════════════════════════════════════════════════════
// MAIN SCRIPT (main.js)
// ═══════════════════════════════════════════════════════════════════════

// Create a worker
const worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

// Receive result from worker
worker.onmessage = function(event) {
  console.log('Result from worker:', event.data);
};

// Handle errors
worker.onerror = function(error) {
  console.error('Worker error:', error);
};

// Terminate worker when done
worker.terminate();


// ═══════════════════════════════════════════════════════════════════════
// WORKER SCRIPT (worker.js)
// ═══════════════════════════════════════════════════════════════════════

// Receive data from main thread
self.onmessage = function(event) {
  const numbers = event.data.numbers;

  // Do heavy calculation
  const sum = numbers.reduce((a, b) => a + b, 0);

  // Send result back
  self.postMessage({ sum });
};
`;

console.log(basicUsage);


// =============================================================================
// WORKER LIMITATIONS
// =============================================================================

console.log('\n=== Worker Limitations ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHAT WORKERS CAN'T DO                                              │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ✗ Access DOM (no document, no window)                              │
 *   │  ✗ Access parent's variables directly                               │
 *   │  ✗ Use some APIs (alert, confirm, etc.)                             │
 *   │                                                                     │
 *   │                                                                     │
 *   │  WHAT WORKERS CAN DO                                                │
 *   │  ──────────────────────                                             │
 *   │                                                                     │
 *   │  ✓ fetch() - Make HTTP requests                                     │
 *   │  ✓ IndexedDB - Database access                                      │
 *   │  ✓ WebSockets - Real-time communication                             │
 *   │  ✓ setTimeout/setInterval                                           │
 *   │  ✓ importScripts() - Import other scripts                           │
 *   │  ✓ Create other workers (nested workers)                            │
 *   │  ✓ Crypto API                                                       │
 *   │                                                                     │
 *   │                                                                     │
 *   │  COMMUNICATION: Only via postMessage (data is COPIED, not shared)   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Workers CANNOT: Access DOM, window, parent variables');
console.log('Workers CAN: fetch, IndexedDB, WebSocket, Crypto');
console.log('Communication: Only via postMessage (data is copied)');


// =============================================================================
// REAL-WORLD EXAMPLES
// =============================================================================

console.log('\n=== Real-World Examples ===\n');

const realWorldExamples = `
// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Image Processing
// ═══════════════════════════════════════════════════════════════════════

// main.js
const imageWorker = new Worker('image-worker.js');

function processImage(imageData) {
  return new Promise((resolve, reject) => {
    imageWorker.postMessage({ imageData });

    imageWorker.onmessage = (e) => resolve(e.data.processedData);
    imageWorker.onerror = reject;
  });
}

// image-worker.js
self.onmessage = function(e) {
  const imageData = e.data.imageData;

  // Apply filter (CPU-intensive!)
  for (let i = 0; i < imageData.data.length; i += 4) {
    // Grayscale conversion
    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    imageData.data[i] = avg;     // R
    imageData.data[i + 1] = avg; // G
    imageData.data[i + 2] = avg; // B
  }

  self.postMessage({ processedData: imageData });
};


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Data Parsing (Large JSON/CSV)
// ═══════════════════════════════════════════════════════════════════════

// main.js
async function processLargeFile(file) {
  const worker = new Worker('parser-worker.js');

  worker.postMessage({ file });

  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      if (e.data.type === 'progress') {
        updateProgressBar(e.data.percent);
      } else if (e.data.type === 'complete') {
        resolve(e.data.result);
        worker.terminate();
      }
    };
  });
}

// parser-worker.js
self.onmessage = async function(e) {
  const file = e.data.file;
  const text = await file.text();
  const lines = text.split('\\n');
  const results = [];

  for (let i = 0; i < lines.length; i++) {
    // Parse line
    results.push(JSON.parse(lines[i]));

    // Report progress every 1000 lines
    if (i % 1000 === 0) {
      self.postMessage({
        type: 'progress',
        percent: (i / lines.length) * 100
      });
    }
  }

  self.postMessage({ type: 'complete', result: results });
};


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Real-time Search with Debouncing
// ═══════════════════════════════════════════════════════════════════════

// main.js
const searchWorker = new Worker('search-worker.js');
let searchData = [];  // Large dataset

// Send data to worker once
searchWorker.postMessage({ type: 'setData', data: searchData });

// Search as user types (doesn't block typing!)
searchInput.addEventListener('input', (e) => {
  searchWorker.postMessage({ type: 'search', query: e.target.value });
});

searchWorker.onmessage = (e) => {
  displayResults(e.data.results);
};

// search-worker.js
let data = [];

self.onmessage = function(e) {
  if (e.data.type === 'setData') {
    data = e.data.data;
  } else if (e.data.type === 'search') {
    const query = e.data.query.toLowerCase();
    const results = data.filter(item =>
      item.name.toLowerCase().includes(query)
    );
    self.postMessage({ results: results.slice(0, 100) });
  }
};
`;

console.log(realWorldExamples);


// =============================================================================
// INLINE WORKERS (No separate file)
// =============================================================================

console.log('\n=== Inline Workers ===\n');

const inlineWorkerExample = `
// Create worker from inline code (no separate file needed)
function createInlineWorker(fn) {
  const blob = new Blob(
    ['(' + fn.toString() + ')()'],
    { type: 'application/javascript' }
  );
  return new Worker(URL.createObjectURL(blob));
}

// Usage
const worker = createInlineWorker(function() {
  self.onmessage = function(e) {
    const result = e.data.numbers.reduce((a, b) => a + b, 0);
    self.postMessage({ sum: result });
  };
});

worker.postMessage({ numbers: [1, 2, 3, 4, 5] });
worker.onmessage = (e) => console.log('Sum:', e.data.sum);
`;

console.log(inlineWorkerExample);


// =============================================================================
// TRANSFERABLE OBJECTS
// =============================================================================

console.log('\n=== Transferable Objects (Performance) ===\n');

/**
 *   By default, postMessage COPIES data (slow for large data).
 *   Transferables MOVE data (instant, but original becomes unusable).
 */

const transferableExample = `
// Slow: Copying ArrayBuffer
const buffer = new ArrayBuffer(1000000);  // 1MB
worker.postMessage({ buffer });  // Copies entire buffer

// Fast: Transferring ArrayBuffer
const buffer = new ArrayBuffer(1000000);
worker.postMessage({ buffer }, [buffer]);  // Transfer ownership
// buffer is now unusable in main thread!

// Common transferables:
// - ArrayBuffer
// - MessagePort
// - ImageBitmap
// - OffscreenCanvas
`;

console.log(transferableExample);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What are Web Workers?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Web Workers let you run JavaScript in a background thread separate from
 * the main thread. This is important because JavaScript is single-threaded,
 * so if you do heavy computation, it blocks the UI - users can't click or
 * scroll until it's done.
 *
 * With workers, heavy work runs in the background while the main thread
 * stays responsive. I've used them for image processing, parsing large
 * files, and searching through big datasets without blocking the UI.
 *
 * Communication between main thread and worker is via postMessage. You
 * send data to the worker, it processes it, and sends results back. The
 * data is copied between threads, not shared. For large data like
 * ArrayBuffers, you can use transferable objects to move data instantly
 * instead of copying, but the original becomes unusable.
 *
 * Workers have limitations - they can't access the DOM or the window
 * object. But they can use fetch, IndexedDB, WebSockets, and other APIs.
 *
 * I use workers when I have CPU-intensive tasks that would otherwise
 * freeze the UI. For example, applying filters to images or sorting
 * thousands of records. The UI stays smooth while the worker handles
 * the heavy lifting."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Run JS in background thread - doesn't block UI
 * ✓ Communication via postMessage (data is copied)
 * ✓ Can't access DOM, but can use fetch, IndexedDB
 * ✓ Use for: image processing, large file parsing, heavy computation
 * ✓ Transferable objects for large data performance
 *
 */


// RUN: node docs/27-web-apis/10-web-workers.js
