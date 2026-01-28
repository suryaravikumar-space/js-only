/**
 * GARBAGE COLLECTION: 04 - Memory Profiling & Debugging
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ DEBUGGING MEMORY ISSUES                                                    ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Tools and techniques to find and fix memory problems:                      ║
 * ║ • Chrome DevTools Memory Panel                                             ║
 * ║ • Node.js --inspect and heap snapshots                                     ║
 * ║ • process.memoryUsage() in Node.js                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// NODE.JS MEMORY USAGE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Node.js Memory Usage ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ process.memoryUsage()                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   {                                                                         │
 * │     rss: 12345678,        // Resident Set Size - total memory allocated     │
 * │     heapTotal: 1234567,   // Total heap size                                │
 * │     heapUsed: 123456,     // Actual memory used                             │
 * │     external: 12345,      // Memory for C++ objects (buffers)               │
 * │     arrayBuffers: 1234    // Memory for ArrayBuffers                        │
 * │   }                                                                         │
 * │                                                                             │
 * │   IMPORTANT METRICS:                                                        │
 * │   • heapUsed: Memory your JS objects are using                              │
 * │   • heapTotal: Memory allocated for heap (can shrink/grow)                  │
 * │   • rss: Total process memory (heap + stack + code)                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function printMemory(label) {
  const mem = process.memoryUsage();
  console.log(`${label}:`);
  console.log(`  Heap Used: ${formatBytes(mem.heapUsed)}`);
  console.log(`  Heap Total: ${formatBytes(mem.heapTotal)}`);
  console.log(`  RSS: ${formatBytes(mem.rss)}`);
}

printMemory('A: Initial memory');

// Allocate some memory
const bigArray = new Array(1000000).fill({ data: 'x'.repeat(100) });
printMemory('B: After allocation');

// Clear reference
// bigArray = null;  // Can't reassign const, so...
bigArray.length = 0;
printMemory('C: After clearing array');


// ═══════════════════════════════════════════════════════════════════════════════
// DETECTING MEMORY LEAKS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Detecting Memory Leaks ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYMPTOMS OF A MEMORY LEAK                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. heapUsed keeps growing over time                                       │
 * │   2. GC runs more frequently but doesn't help                               │
 * │   3. Application becomes slower                                             │
 * │   4. Eventually: "JavaScript heap out of memory" error                      │
 * │                                                                             │
 * │                                                                             │
 * │   MEMORY PATTERN:                                                           │
 * │                                                                             │
 * │   Normal (Sawtooth pattern):                                                │
 * │   ┌──────────────────────────────────────────────────────────────────┐      │
 * │   │     /\    /\    /\    /\    /\                                   │      │
 * │   │    /  \  /  \  /  \  /  \  /  \   ← GC cleans up                 │      │
 * │   │   /    \/    \/    \/    \/    \                                 │      │
 * │   └──────────────────────────────────────────────────────────────────┘      │
 * │                                                                             │
 * │   Memory Leak (Upward trend):                                               │
 * │   ┌──────────────────────────────────────────────────────────────────┐      │
 * │   │                                         /\                       │      │
 * │   │                                /\      /  \   ← Growing!         │      │
 * │   │                       /\      /  \    /    \                     │      │
 * │   │              /\      /  \    /    \  /      \                    │      │
 * │   │     /\      /  \    /    \  /      \/                            │      │
 * │   │    /  \    /    \  /      \/                                     │      │
 * │   │   /    \  /      \/                                              │      │
 * │   └──────────────────────────────────────────────────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simple leak detection by tracking memory over time
class MemoryMonitor {
  constructor() {
    this.samples = [];
  }

  sample() {
    const mem = process.memoryUsage();
    this.samples.push({
      timestamp: Date.now(),
      heapUsed: mem.heapUsed
    });
  }

  analyze() {
    if (this.samples.length < 2) return 'Not enough samples';

    const first = this.samples[0].heapUsed;
    const last = this.samples[this.samples.length - 1].heapUsed;
    const diff = last - first;

    console.log(`  First sample: ${formatBytes(first)}`);
    console.log(`  Last sample: ${formatBytes(last)}`);
    console.log(`  Difference: ${formatBytes(diff)}`);

    if (diff > 10 * 1024 * 1024) {  // 10MB growth
      return 'Possible memory leak detected!';
    }
    return 'Memory looks stable';
  }
}

const monitor = new MemoryMonitor();
monitor.sample();

// Simulate some work
for (let i = 0; i < 5; i++) {
  const temp = new Array(10000).fill('data');
  monitor.sample();
}

console.log('D: Memory analysis:');
console.log('  ', monitor.analyze());


// ═══════════════════════════════════════════════════════════════════════════════
// CHROME DEVTOOLS WORKFLOW
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Chrome DevTools Workflow ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FINDING MEMORY LEAKS IN BROWSER                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   STEP 1: Open DevTools → Memory tab                                        │
 * │                                                                             │
 * │   STEP 2: Take a Heap Snapshot                                              │
 * │   • Click "Take heap snapshot"                                              │
 * │   • This is your baseline                                                   │
 * │                                                                             │
 * │   STEP 3: Perform the action that might leak                                │
 * │   • Navigate pages                                                          │
 * │   • Open/close modals                                                       │
 * │   • Trigger the suspected leak                                              │
 * │                                                                             │
 * │   STEP 4: Take another Heap Snapshot                                        │
 * │                                                                             │
 * │   STEP 5: Compare snapshots                                                 │
 * │   • Select "Comparison" view                                                │
 * │   • Look for objects that shouldn't exist                                   │
 * │   • Check "# Delta" column for growing counts                               │
 * │                                                                             │
 * │   STEP 6: Inspect retained objects                                          │
 * │   • Click an object to see what's holding it                                │
 * │   • "Retainers" shows the reference chain                                   │
 * │   • Find the root cause of the leak                                         │
 * │                                                                             │
 * │                                                                             │
 * │   USEFUL VIEWS:                                                             │
 * │   • Summary: Objects grouped by constructor                                 │
 * │   • Comparison: Diff between snapshots                                      │
 * │   • Containment: Object hierarchy                                           │
 * │   • Statistics: Memory breakdown by type                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('E: Chrome DevTools steps - see comments above');


// ═══════════════════════════════════════════════════════════════════════════════
// NODE.JS DEBUGGING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Node.js Memory Debugging ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NODE.JS DEBUGGING COMMANDS                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. RUN WITH INSPECTOR:                                                    │
 * │      node --inspect app.js                                                  │
 * │      # Opens debugger on localhost:9229                                     │
 * │      # Open chrome://inspect in Chrome                                      │
 * │                                                                             │
 * │   2. EXPOSE GC (for testing):                                               │
 * │      node --expose-gc app.js                                                │
 * │      # In code: global.gc() to force GC                                     │
 * │                                                                             │
 * │   3. HEAP SNAPSHOT:                                                         │
 * │      const v8 = require('v8');                                              │
 * │      const fs = require('fs');                                              │
 * │                                                                             │
 * │      const snapshot = v8.writeHeapSnapshot();                               │
 * │      console.log('Snapshot written to:', snapshot);                         │
 * │      // Open .heapsnapshot in Chrome DevTools                               │
 * │                                                                             │
 * │   4. INCREASE HEAP SIZE:                                                    │
 * │      node --max-old-space-size=4096 app.js  # 4GB                           │
 * │                                                                             │
 * │   5. GC LOGGING:                                                            │
 * │      node --trace-gc app.js                                                 │
 * │      # Logs every GC event                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('F: Node.js debugging commands - see comments above');

// Example: Writing a heap snapshot (commented to avoid creating files)
// const v8 = require('v8');
// const snapshotFile = v8.writeHeapSnapshot();
// console.log('Snapshot:', snapshotFile);


// ═══════════════════════════════════════════════════════════════════════════════
// BEST PRACTICES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Best Practices ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MEMORY OPTIMIZATION BEST PRACTICES                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. CLEANUP PATTERNS:                                                      │
 * │      • Clear timers: clearInterval(), clearTimeout()                        │
 * │      • Remove listeners: removeEventListener()                              │
 * │      • Null large objects when done: data = null;                           │
 * │      • Clear collections: array.length = 0; map.clear();                    │
 * │                                                                             │
 * │   2. USE WEAK REFERENCES:                                                   │
 * │      • WeakMap for object metadata/caches                                   │
 * │      • WeakSet for tracking objects                                         │
 * │      • WeakRef for optional references (advanced)                           │
 * │                                                                             │
 * │   3. BOUNDED DATA STRUCTURES:                                               │
 * │      • LRU caches with max size                                             │
 * │      • Circular buffers for logs                                            │
 * │      • TTL (time-to-live) for cached data                                   │
 * │                                                                             │
 * │   4. AVOID PATTERNS:                                                        │
 * │      • Global variables                                                     │
 * │      • Closures capturing large data                                        │
 * │      • Unbounded arrays/objects                                             │
 * │      • Storing DOM references                                               │
 * │                                                                             │
 * │   5. TESTING:                                                               │
 * │      • Profile before and after changes                                     │
 * │      • Test with production-like data volumes                               │
 * │      • Monitor in production                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('G: Best practices - see comments above');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "To debug memory issues in JavaScript:                                      │
 * │                                                                             │
 * │ In Node.js:                                                                 │
 * │ • process.memoryUsage() shows heapUsed, heapTotal, rss                      │
 * │ • node --inspect opens debugger for Chrome DevTools                         │
 * │ • node --trace-gc logs GC events                                            │
 * │ • v8.writeHeapSnapshot() creates heap snapshots                             │
 * │                                                                             │
 * │ In Chrome DevTools:                                                         │
 * │ 1. Take heap snapshot (baseline)                                            │
 * │ 2. Perform actions                                                          │
 * │ 3. Take another snapshot                                                    │
 * │ 4. Compare to find growing objects                                          │
 * │ 5. Check 'Retainers' to find what's holding references                      │
 * │                                                                             │
 * │ Memory leak symptoms:                                                       │
 * │ • heapUsed grows continuously (not sawtooth pattern)                        │
 * │ • GC runs frequently but memory doesn't decrease                            │
 * │ • Eventually crashes with 'heap out of memory'                              │
 * │                                                                             │
 * │ Common fixes:                                                               │
 * │ • Clear timers and event listeners                                          │
 * │ • Use WeakMap/WeakSet for caches                                            │
 * │ • Implement bounded/LRU caches                                              │
 * │ • Null out large objects when done"                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/22-garbage-collection/04-memory-profiling.js
 */
