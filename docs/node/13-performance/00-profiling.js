/**
 * TOPIC 00: Node.js Profiling Tools
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Never optimize blindly. MEASURE first with profiling tools, IDENTIFY     ║
 * ║ the bottleneck, THEN optimize. Node gives you --prof, console.time,      ║
 * ║ perf_hooks, and the inspector protocol to find exactly where time goes.  ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a DOCTOR diagnosing a patient. The doctor doesn't just guess -   │
 * │  they run TESTS first. Blood work (console.time), X-rays (--prof),       │
 * │  MRI scans (perf_hooks).                                                 │
 * │                                                                            │
 * │    Patient: "My app is slow"                                              │
 * │    Bad Doctor: "Let me rewrite everything" (wasted effort)               │
 * │    Good Doctor: "Let me run diagnostics first"                           │
 * │                                                                            │
 * │    console.time   → Quick pulse check (simple timing)                    │
 * │    perf_hooks     → Detailed blood work (precise measurements)           │
 * │    --prof         → Full body scan (V8 CPU profile)                      │
 * │    --inspect      → Live surgery (Chrome DevTools attached)              │
 * │                                                                            │
 * │  The profiler tells you WHERE the disease is. Then you operate.          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Profiling Tool Hierarchy                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   Quick & Simple ──────────────────────────── Deep & Detailed             │
 * │                                                                            │
 * │   console.time()    perf_hooks        --prof           --inspect          │
 * │   ┌──────────┐    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
 * │   │ Label    │    │ performance  │  │ V8 CPU       │  │ Chrome       │   │
 * │   │ start/   │    │ .now()       │  │ profiler     │  │ DevTools     │   │
 * │   │ end      │    │ .mark()      │  │ tick-based   │  │ live debug   │   │
 * │   │          │    │ .measure()   │  │ sampling     │  │ heap snap    │   │
 * │   └──────────┘    └──────────────┘  └──────────────┘  └──────────────┘   │
 * │   ~ms accuracy     ~μs accuracy     function-level    real-time          │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── 1. console.time / console.timeEnd - Quick timing ───
console.log('A:', '=== console.time / console.timeEnd ===');

console.time('array-creation');
const arr = [];
for (let i = 0; i < 1_000_000; i++) {
  arr.push(i * 2);
}
console.timeEnd('array-creation');

console.log('B:', `Array length: ${arr.length}`);

// ─── 2. console.time with multiple labels ───
console.time('total-operation');

console.time('sort');
const sorted = [...arr].sort((a, b) => a - b);
console.timeEnd('sort');

console.time('filter');
const filtered = sorted.filter((n) => n % 10 === 0);
console.timeEnd('filter');

console.timeEnd('total-operation');
console.log('C:', `Filtered count: ${filtered.length}`);

// ─── 3. perf_hooks - High-resolution timing ───
const { performance, PerformanceObserver } = require('perf_hooks');

console.log('D:', '=== perf_hooks performance.now() ===');

const t0 = performance.now();
let sum = 0;
for (let i = 0; i < 1_000_000; i++) {
  sum += Math.sqrt(i);
}
const t1 = performance.now();
console.log('E:', `Sum of square roots took ${(t1 - t0).toFixed(4)}ms`);

// ─── 4. perf_hooks - mark() and measure() ───
console.log('F:', '=== perf_hooks mark() & measure() ===');

performance.mark('hash-start');

const crypto = require('crypto');
const hashes = [];
for (let i = 0; i < 1000; i++) {
  hashes.push(crypto.createHash('sha256').update(`data-${i}`).digest('hex'));
}

performance.mark('hash-end');
performance.measure('hashing-1000-sha256', 'hash-start', 'hash-end');

const [measure] = performance.getEntriesByName('hashing-1000-sha256');
console.log('G:', `Hashing 1000 SHA256: ${measure.duration.toFixed(4)}ms`);

// ─── 5. PerformanceObserver - Watch measurements ───
console.log('H:', '=== PerformanceObserver ===');

const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log('I:', `Observed: "${entry.name}" took ${entry.duration.toFixed(4)}ms`);
  });
});
obs.observe({ entryTypes: ['measure'] });

performance.mark('json-start');
const bigObj = {};
for (let i = 0; i < 10000; i++) {
  bigObj[`key_${i}`] = { value: i, nested: { deep: true } };
}
const json = JSON.stringify(bigObj);
JSON.parse(json);
performance.mark('json-end');
performance.measure('json-serialize-parse', 'json-start', 'json-end');

// ─── 6. process.hrtime.bigint() - Nanosecond precision ───
console.log('J:', '=== process.hrtime.bigint() - nanoseconds ===');

const hrStart = process.hrtime.bigint();
let count = 0;
for (let i = 0; i < 100_000; i++) {
  count++;
}
const hrEnd = process.hrtime.bigint();
const nanoseconds = Number(hrEnd - hrStart);
console.log('K:', `100k iterations: ${nanoseconds}ns (${(nanoseconds / 1e6).toFixed(4)}ms)`);

// ─── 7. process.memoryUsage() - Memory profiling ───
console.log('L:', '=== process.memoryUsage() ===');

const memBefore = process.memoryUsage();
const bigArray = new Array(1_000_000).fill('hello world');
const memAfter = process.memoryUsage();

const heapDiff = memAfter.heapUsed - memBefore.heapUsed;
console.log('M:', `Heap used before: ${(memBefore.heapUsed / 1024 / 1024).toFixed(2)}MB`);
console.log('N:', `Heap used after:  ${(memAfter.heapUsed / 1024 / 1024).toFixed(2)}MB`);
console.log('O:', `Difference:       ${(heapDiff / 1024 / 1024).toFixed(2)}MB`);

// ─── 8. process.cpuUsage() ───
console.log('P:', '=== process.cpuUsage() ===');

const cpuBefore = process.cpuUsage();
let fibonacci = (n) => (n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2));
fibonacci(30);
const cpuAfter = process.cpuUsage(cpuBefore);

console.log('Q:', `CPU user time:   ${cpuAfter.user}μs (${(cpuAfter.user / 1000).toFixed(2)}ms)`);
console.log('R:', `CPU system time: ${cpuAfter.system}μs (${(cpuAfter.system / 1000).toFixed(2)}ms)`);

// ─── 9. Custom profiling utility ───
console.log('S:', '=== Custom Profiler Utility ===');

const profiler = {
  timers: new Map(),

  start(label) {
    this.timers.set(label, {
      time: performance.now(),
      mem: process.memoryUsage().heapUsed,
    });
  },

  end(label) {
    const start = this.timers.get(label);
    if (!start) return null;
    const elapsed = performance.now() - start.time;
    const memDelta = process.memoryUsage().heapUsed - start.mem;
    this.timers.delete(label);
    return { elapsed, memDelta };
  },
};

profiler.start('custom-test');
const data = Array.from({ length: 500_000 }, (_, i) => ({ id: i, name: `item-${i}` }));
const result = profiler.end('custom-test');
console.log('T:', `Custom profiler: ${result.elapsed.toFixed(4)}ms, mem delta: ${(result.memDelta / 1024 / 1024).toFixed(2)}MB`);

// Clean up observer
obs.disconnect();

// ─── 10. --prof and --inspect usage (reference only) ───
console.log('U:', '=== --prof and --inspect (CLI commands, not runnable here) ===');
console.log('V:', 'To CPU profile: node --prof app.js → node --prof-process isolate-*.log');
console.log('W:', 'To debug live:  node --inspect app.js → open chrome://inspect');

/**
 * OUTPUT:
 *   A: === console.time / console.timeEnd ===
 *   array-creation: ~XXms
 *   B: Array length: 1000000
 *   sort: ~XXXms
 *   filter: ~XXms
 *   total-operation: ~XXXms
 *   C: Filtered count: 100000
 *   D: === perf_hooks performance.now() ===
 *   E: Sum of square roots took X.XXXXms
 *   F: === perf_hooks mark() & measure() ===
 *   G: Hashing 1000 SHA256: X.XXXXms
 *   H: === PerformanceObserver ===
 *   I: Observed: "json-serialize-parse" took X.XXXXms
 *   J: === process.hrtime.bigint() - nanoseconds ===
 *   K: 100k iterations: XXXXXXns (X.XXXXms)
 *   L: === process.memoryUsage() ===
 *   M: Heap used before: X.XXMB
 *   N: Heap used after:  XX.XXMB
 *   O: Difference:       XX.XXMB
 *   P: === process.cpuUsage() ===
 *   Q: CPU user time:   XXXXXμs (XX.XXms)
 *   R: CPU system time: XXXμs (X.XXms)
 *   S: === Custom Profiler Utility ===
 *   T: Custom profiler: XX.XXXXms, mem delta: XX.XXMB
 *   U: === --prof and --inspect (CLI commands, not runnable here) ===
 *   V: To CPU profile: node --prof app.js → node --prof-process isolate-*.log
 *   W: To debug live:  node --inspect app.js → open chrome://inspect
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "To profile Node.js, I use a layered approach. For quick checks,          │
 * │  console.time gives millisecond timing. For precise micro-benchmarks,     │
 * │  perf_hooks provides sub-millisecond accuracy with mark/measure. For      │
 * │  CPU profiling, node --prof generates a V8 tick log that shows which      │
 * │  functions consume the most time. For live debugging, node --inspect      │
 * │  connects to Chrome DevTools for heap snapshots and CPU flame charts.     │
 * │  I also use process.memoryUsage() and process.cpuUsage() to track        │
 * │  resource consumption. The key principle: always measure before           │
 * │  optimizing - gut feelings about bottlenecks are often wrong."            │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/13-performance/00-profiling.js
 */
