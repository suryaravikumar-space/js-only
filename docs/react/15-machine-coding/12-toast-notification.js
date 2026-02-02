/**
 * TOPIC: Toast Notification System - Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Toast = array of { id, message, type, timer }.   ║
 * ║  show() pushes, auto-dismiss removes after duration,           ║
 * ║  max visible limit queues the rest.                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: You submit a form — a green "Saved!" slides in from     │
 * │  the corner. Another error toast stacks below it. After 3s      │
 * │  each fades out. Hover pauses the timer so you can read it.     │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                                                 │
 * │                                                                 │
 * │  toasts: [ {id,msg,type,timer}, ... ]   queue: [ ... ]         │
 * │                                                                 │
 * │  show("Saved","success",3000)                                   │
 * │    ┌──────────┐                                                 │
 * │    │ push to  │──► visible.length < max? ──► start timer        │
 * │    │ toasts[] │         │ no                                    │
 * │    └──────────┘         └──► push to queue                      │
 * │                                                                 │
 * │  Timer fires → remove from visible → promote from queue         │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/12-toast-notification.js
 */

// ─── Toast System ────────────────────────────────────────────────────

function createToastSystem(maxVisible = 3) {
  let toasts = [];
  let queue = [];
  let nextId = 1;
  let log = [];
  const timers = new Map();

  function _log(msg) {
    log.push(msg);
  }

  function render() {
    if (toasts.length === 0) return '[No toasts visible]';
    return toasts
      .map((t) => {
        const icon =
          t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️';
        const paused = t.paused ? ' (PAUSED)' : '';
        return `  ${icon} [${t.type.toUpperCase()}] ${t.message}${paused}`;
      })
      .join('\n');
  }

  function _promoteFromQueue() {
    if (queue.length > 0 && toasts.length < maxVisible) {
      const next = queue.shift();
      toasts.push(next);
      _log(`Promoted from queue: "${next.message}"`);
      _startTimer(next);
    }
  }

  function _startTimer(toast) {
    const timer = setTimeout(() => {
      dismiss(toast.id);
    }, toast.duration);
    timers.set(toast.id, { timer, remaining: toast.duration, startTime: Date.now() });
  }

  function show(message, type = 'info', duration = 3000) {
    const toast = { id: nextId++, message, type, duration, paused: false };

    if (toasts.length < maxVisible) {
      toasts.push(toast);
      _startTimer(toast);
      _log(`Showing: "${message}" (${type}, ${duration}ms)`);
    } else {
      queue.push(toast);
      _log(`Queued: "${message}" (visible full: ${toasts.length}/${maxVisible})`);
    }
    return toast.id;
  }

  function dismiss(id) {
    const idx = toasts.findIndex((t) => t.id === id);
    if (idx !== -1) {
      const removed = toasts.splice(idx, 1)[0];
      const timerInfo = timers.get(id);
      if (timerInfo) {
        clearTimeout(timerInfo.timer);
        timers.delete(id);
      }
      _log(`Dismissed: "${removed.message}"`);
      _promoteFromQueue();
      return true;
    }
    // Check queue
    const qIdx = queue.findIndex((t) => t.id === id);
    if (qIdx !== -1) {
      queue.splice(qIdx, 1);
      return true;
    }
    return false;
  }

  function pauseOnHover(id) {
    const toast = toasts.find((t) => t.id === id);
    const timerInfo = timers.get(id);
    if (toast && timerInfo) {
      clearTimeout(timerInfo.timer);
      timerInfo.remaining -= Date.now() - timerInfo.startTime;
      toast.paused = true;
      _log(`Paused: "${toast.message}" (${timerInfo.remaining}ms left)`);
    }
  }

  function resumeOnLeave(id) {
    const toast = toasts.find((t) => t.id === id);
    const timerInfo = timers.get(id);
    if (toast && timerInfo) {
      toast.paused = false;
      timerInfo.startTime = Date.now();
      timerInfo.timer = setTimeout(() => dismiss(id), timerInfo.remaining);
      _log(`Resumed: "${toast.message}"`);
    }
  }

  function dismissAll() {
    const ids = [...toasts.map((t) => t.id)];
    ids.forEach((id) => dismiss(id));
    queue = [];
    _log('Dismissed all toasts');
  }

  function getState() {
    return { visible: toasts.length, queued: queue.length };
  }

  function flushLog() {
    const out = [...log];
    log = [];
    return out;
  }

  function cleanup() {
    timers.forEach((info) => clearTimeout(info.timer));
    timers.clear();
  }

  return { show, dismiss, dismissAll, pauseOnHover, resumeOnLeave, render, getState, flushLog, cleanup };
}

// ─── Synchronous Simulation (no real timers) ─────────────────────────

function simulateSync() {
  console.log('=== TOAST NOTIFICATION SIMULATION ===\n');

  const toastSys = createToastSystem(3);

  // A: Show basic toasts
  console.log('A: Show 3 toasts');
  toastSys.show('File saved!', 'success', 3000);
  toastSys.show('Network error', 'error', 5000);
  toastSys.show('Low disk space', 'warning', 4000);
  toastSys.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log(toastSys.render());
  console.log(`   State: ${JSON.stringify(toastSys.getState())}\n`);

  // B: Queue overflow
  console.log('B: Add 2 more (exceeds max 3 visible)');
  toastSys.show('Update available', 'info', 3000);
  toastSys.show('Backup complete', 'success', 3000);
  toastSys.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log(`   State: ${JSON.stringify(toastSys.getState())}\n`);

  // C: Dismiss one, queue promotes
  console.log('C: Dismiss first toast -> queue promotes');
  toastSys.dismiss(1);
  toastSys.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log(toastSys.render());
  console.log(`   State: ${JSON.stringify(toastSys.getState())}\n`);

  // D: Pause on hover
  console.log('D: Pause toast #2 (hover)');
  toastSys.pauseOnHover(2);
  toastSys.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log(toastSys.render());
  console.log();

  // E: Resume
  console.log('E: Resume toast #2 (mouse leave)');
  toastSys.resumeOnLeave(2);
  toastSys.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log();

  // F: Dismiss all
  console.log('F: Dismiss all');
  toastSys.dismissAll();
  toastSys.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log(toastSys.render());
  console.log();

  // G: Different types
  console.log('G: All toast types');
  const fresh = createToastSystem(5);
  fresh.show('Saved', 'success', 2000);
  fresh.show('Failed', 'error', 2000);
  fresh.show('Careful', 'warning', 2000);
  fresh.show('FYI', 'info', 2000);
  fresh.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log(fresh.render());
  console.log();

  toastSys.cleanup();
  fresh.cleanup();
}

simulateSync();

// ─── Async Demo (real timers) ────────────────────────────────────────

console.log('H: Async auto-dismiss demo (watch toasts disappear)');
const asyncSys = createToastSystem(3);
asyncSys.show('This disappears in 500ms', 'info', 500);
asyncSys.show('This in 1000ms', 'warning', 1000);
asyncSys.show('Queued toast', 'success', 800);
asyncSys.flushLog().forEach((l) => console.log(`   ${l}`));
console.log(asyncSys.render());

setTimeout(() => {
  console.log('\n   After 600ms:');
  asyncSys.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log(asyncSys.render());
}, 600);

setTimeout(() => {
  console.log('\n   After 1100ms:');
  asyncSys.flushLog().forEach((l) => console.log(`   ${l}`));
  console.log(asyncSys.render());
  asyncSys.cleanup();

  // Print follow-ups after async completes
  console.log('\n=== FOLLOW-UP QUESTIONS ===\n');
  console.log('Q1: How to animate entry/exit?');
  console.log('    -> CSS transitions + onTransitionEnd to remove from DOM\n');
  console.log('Q2: How to position toasts?');
  console.log('    -> Fixed container, flex-column, configurable corner\n');
  console.log('Q3: How to make it a global singleton?');
  console.log('    -> React context or zustand store, portal to body\n');

  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  INTERVIEW ANSWER                                          ║');
  console.log('║  State: toasts[] array + queue[] for overflow              ║');
  console.log('║  show(): push + setTimeout for auto-dismiss               ║');
  console.log('║  Pause: clearTimeout, store remaining ms                   ║');
  console.log('║  Queue: when visible >= max, buffer; promote on dismiss   ║');
  console.log('║  Hooks: useReducer(toasts), useRef(timers), useCallback   ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
}, 1200);
