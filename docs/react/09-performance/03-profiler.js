/**
 * TOPIC: React Profiler API — Measure Component Render Performance
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  <Profiler id="name" onRender={callback}> wraps      ║
 * ║  components to measure render time. The onRender      ║
 * ║  callback receives phase, duration, and commit info.  ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A coach with a stopwatch │
 * │ (Profiler) timing each   │
 * │ runner (component). After │
 * │ each lap (render), the   │
 * │ coach records: who ran,  │
 * │ mount or update, and how │
 * │ long it took.            │
 * └──────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  <Profiler onRender>  │
 * │    <App />            │
 * │  </Profiler>          │
 * │       │               │
 * │       v               │
 * │  onRender(id, phase,  │
 * │    actualDuration,    │
 * │    baseDuration,      │
 * │    startTime,         │
 * │    commitTime)        │
 * └───────────────────────┘
 *
 * React code (for reference):
 *   <Profiler id="App" onRender={(id, phase, actual, base) => {
 *     console.log(`${id} ${phase}: ${actual}ms`);
 *   }}>
 *     <App />
 *   </Profiler>
 */

// --- Simulate Profiler ---
function createProfiler(id, onRender) {
  let renderCount = 0;

  return {
    render(componentFn) {
      renderCount++;
      const phase = renderCount === 1 ? "mount" : "update";
      const startTime = performance.now();
      const result = componentFn();
      const endTime = performance.now();
      const actualDuration = endTime - startTime;

      onRender(id, phase, actualDuration, startTime, endTime);
      return result;
    },
  };
}

// --- Simulate components with varying cost ---
function cheapComponent() {
  let sum = 0;
  for (let i = 0; i < 100; i++) sum += i;
  return `<Cheap result=${sum} />`;
}

function expensiveComponent() {
  let sum = 0;
  for (let i = 0; i < 1_000_000; i++) sum += i;
  return `<Expensive result=${sum} />`;
}

// A: Profile mount
console.log("A: Profile mount phase");
const profiler = createProfiler("App", (id, phase, duration, start, end) => {
  console.log(`  [profiler] id="${id}" phase=${phase} duration=${duration.toFixed(3)}ms`);
});
profiler.render(cheapComponent);

// B: Profile update
console.log("\nB: Profile update phase");
profiler.render(cheapComponent);

// C: Compare cheap vs expensive
console.log("\nC: Compare component costs");
const cheapProfiler = createProfiler("Cheap", (id, phase, duration) => {
  console.log(`  [${id}] ${phase}: ${duration.toFixed(3)}ms`);
});
const expProfiler = createProfiler("Expensive", (id, phase, duration) => {
  console.log(`  [${id}] ${phase}: ${duration.toFixed(3)}ms`);
});
cheapProfiler.render(cheapComponent);
expProfiler.render(expensiveComponent);

// D: Collecting render stats over time
console.log("\nD: Collecting render stats");
const stats = [];
const statsProfiler = createProfiler("List", (id, phase, duration) => {
  stats.push({ id, phase, duration });
});
for (let i = 0; i < 5; i++) statsProfiler.render(cheapComponent);
console.log(`  Total renders: ${stats.length}`);
const total = stats.reduce((s, r) => s + r.duration, 0);
console.log(`  Total time: ${total.toFixed(3)}ms`);
console.log(`  Avg per render: ${(total / stats.length).toFixed(3)}ms`);
console.log(`  Phases: ${stats.map((s) => s.phase).join(", ")}`);

// E: Identifying slow renders
console.log("\nE: Slow render detection");
const THRESHOLD = 0.5;
const slowProfiler = createProfiler("Dashboard", (id, phase, duration) => {
  if (duration > THRESHOLD) {
    console.log(`  [WARNING] ${id} slow ${phase}: ${duration.toFixed(3)}ms > ${THRESHOLD}ms`);
  } else {
    console.log(`  [OK] ${id} ${phase}: ${duration.toFixed(3)}ms`);
  }
});
slowProfiler.render(cheapComponent);
slowProfiler.render(expensiveComponent);

/**
 * OUTPUT:
 * A: Profile mount phase
 *   [profiler] id="App" phase=mount duration=X.XXXms
 *
 * B: Profile update phase
 *   [profiler] id="App" phase=update duration=X.XXXms
 *
 * C: Compare component costs
 *   [Cheap] mount: ~0.XXXms
 *   [Expensive] mount: ~X.XXXms
 *
 * D: Collecting render stats
 *   Total renders: 5
 *   Total time: X.XXXms
 *   Avg per render: X.XXXms
 *   Phases: mount, update, update, update, update
 *
 * E: Slow render detection
 *   [OK] Dashboard mount: ...
 *   [WARNING] Dashboard slow update: ...
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ React Profiler wraps components and fires onRender     │
 * │ after each commit. It reports: id, phase (mount/update)│
 * │ actualDuration, baseDuration, startTime, commitTime.   │
 * │ Use it in dev to find bottlenecks. React DevTools      │
 * │ Profiler tab provides a visual flame graph.            │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/09-performance/03-profiler.js
 */
