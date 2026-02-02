/**
 * TOPIC: Countdown Timer — Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Timer = Remaining Seconds + Status + Interval ║
 * ║  Format: HH:MM:SS. Callback on zero. Multiple independent. ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: An egg timer on the kitchen counter. You twist it    │
 * │  to set time (start), hold it to freeze (pause), release to  │
 * │  continue (resume), slam it down to zero (reset). When it    │
 * │  hits zero, it rings (onComplete). Multiple timers for       │
 * │  eggs, pasta, and toast can all run independently.           │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                             │
 * │                                             │
 * │  ┌────────────────────┐                     │
 * │  │    01 : 30 : 45    │  <- HH:MM:SS       │
 * │  └────────────────────┘                     │
 * │  [Start] [Pause] [Resume] [Reset]           │
 * │                                             │
 * │  State: { remaining, initial, status }      │
 * │  status: idle | running | paused | done     │
 * │                                             │
 * │  setInterval(1000) decrements remaining     │
 * │  remaining === 0 -> onComplete() + clear    │
 * └─────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/09-countdown-timer.js
 */

// ─── Format helper ───────────────────────────────────────────
function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

// ─── Timer factory ───────────────────────────────────────────
function createTimer(name, totalSeconds, onComplete) {
  return {
    name,
    initial: totalSeconds,
    remaining: totalSeconds,
    status: "idle", // idle | running | paused | done
    intervalId: null,
    onComplete: onComplete || (() => {}),
    log: [],
  };
}

function tick(timer) {
  if (timer.status !== "running") return;
  timer.remaining -= 1;
  if (timer.remaining <= 0) {
    timer.remaining = 0;
    timer.status = "done";
    timer.log.push(`${timer.name}: COMPLETED`);
    timer.onComplete(timer.name);
  }
}

function start(timer) {
  if (timer.status === "running") return;
  timer.status = "running";
  timer.log.push(`${timer.name}: started at ${formatTime(timer.remaining)}`);
}

function pause(timer) {
  if (timer.status !== "running") return;
  timer.status = "paused";
  timer.log.push(`${timer.name}: paused at ${formatTime(timer.remaining)}`);
}

function resume(timer) {
  if (timer.status !== "paused") return;
  timer.status = "running";
  timer.log.push(`${timer.name}: resumed at ${formatTime(timer.remaining)}`);
}

function reset(timer) {
  timer.remaining = timer.initial;
  timer.status = "idle";
  timer.log.push(`${timer.name}: reset to ${formatTime(timer.initial)}`);
}

function display(timer) {
  return `[${timer.name}] ${formatTime(timer.remaining)} (${timer.status})`;
}

// ─── Simulate ticks (no real setInterval for demo) ───────────
function simulateTicks(timer, count) {
  for (let i = 0; i < count; i++) {
    tick(timer);
  }
}

// ─── Simulation ──────────────────────────────────────────────
console.log("=== COUNTDOWN TIMER SIMULATION ===\n");

const completions = [];

// A: Create and start a 10-second timer
const t1 = createTimer("Eggs", 10, (name) => completions.push(name));
console.log("A: Create 10s timer");
console.log(`   ${display(t1)}\n`);

// B: Start and tick 3 times
start(t1);
simulateTicks(t1, 3);
console.log("B: Start + 3 ticks");
console.log(`   ${display(t1)}\n`);

// C: Pause
pause(t1);
simulateTicks(t1, 5); // should not change
console.log("C: Pause + 5 ticks (no change)");
console.log(`   ${display(t1)}\n`);

// D: Resume and run to completion
resume(t1);
simulateTicks(t1, 7);
console.log("D: Resume + 7 ticks (completes)");
console.log(`   ${display(t1)}`);
console.log(`   onComplete fired: ${completions.includes("Eggs")}\n`);

// E: Reset
reset(t1);
console.log("E: Reset");
console.log(`   ${display(t1)}\n`);

// F: Format display tests
console.log("F: Format display tests");
console.log(`   0 seconds    -> ${formatTime(0)}`);
console.log(`   59 seconds   -> ${formatTime(59)}`);
console.log(`   3661 seconds -> ${formatTime(3661)}`);
console.log(`   86399 sec    -> ${formatTime(86399)}\n`);

// G: Multiple independent timers
console.log("G: Multiple timers running independently");
const t2 = createTimer("Pasta", 5, (name) => completions.push(name));
const t3 = createTimer("Toast", 3, (name) => completions.push(name));
start(t2);
start(t3);

for (let i = 1; i <= 6; i++) {
  simulateTicks(t2, 1);
  simulateTicks(t3, 1);
  console.log(`   Tick ${i}: ${display(t2)}  |  ${display(t3)}`);
}
console.log(`   Completions so far: [${completions.join(", ")}]\n`);

// H: Timer log audit
console.log("H: Timer event log (Eggs)");
t1.log.forEach((entry) => console.log(`   ${entry}`));
console.log();

// I: Edge cases
console.log("I: Edge cases");
const t4 = createTimer("Zero", 0, (name) => completions.push(name));
start(t4);
simulateTicks(t4, 1);
console.log(`   0-second timer after 1 tick: ${display(t4)}`);
console.log(`   Completed: ${t4.status === "done"}`);

pause(t4); // should not do anything on done timer
console.log(`   Pause on done timer: status still '${t4.status}'\n`);

// ─── Follow-up Questions ─────────────────────────────────────
console.log("=== FOLLOW-UP QUESTIONS ===");
console.log("1. How to handle timer drift with setInterval vs Date.now()?");
console.log("2. How to persist timer state across page reloads?");
console.log("3. How to add a count-up (stopwatch) mode?");
console.log("4. How to animate the display smoothly (requestAnimationFrame)?");
console.log("5. How to schedule timers (start at a specific time)?");

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER                                           ║
 * ║                                                             ║
 * ║  Timer state: remaining, initial, status (idle/running/     ║
 * ║  paused/done). setInterval(1s) decrements remaining.        ║
 * ║  Pause: clearInterval, save remaining. Resume: new          ║
 * ║  setInterval. Reset: remaining = initial. Format:           ║
 * ║  HH:MM:SS via Math.floor division. For accuracy, use       ║
 * ║  Date.now() delta instead of counting ticks.                ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
