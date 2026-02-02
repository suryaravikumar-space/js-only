/**
 * TOPIC: Context Performance — Re-render Problem & Solutions
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  When a context value changes, ALL consumers          ║
 * ║  re-render — even if they only use part of the value. ║
 * ║  Fix: split context, memo children, useMemo value.    ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Context is a loudspeaker — when it broadcasts, every  │
 * │ listener wakes up, even if the message isn't for them.│
 * │ Solution: use separate channels (split contexts) so   │
 * │ only relevant listeners hear the update.              │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  PROBLEM:                                             │
 * │  Context { user, theme } changes theme                │
 * │    → UserDisplay re-renders (unnecessary!)            │
 * │    → ThemeDisplay re-renders (needed)                 │
 * │                                                       │
 * │  FIX: Split into UserCtx + ThemeCtx                   │
 * │    → UserDisplay subscribes only to UserCtx           │
 * │    → ThemeDisplay subscribes only to ThemeCtx         │
 * └───────────────────────────────────────────────────────┘
 */

// --- Simulate render tracking ---
let renderCount = {};
function trackRender(name) {
  renderCount[name] = (renderCount[name] || 0) + 1;
  console.log(`  ${name} rendered (#${renderCount[name]})`);
}

// --- Problem: single big context ---
console.log('A: PROBLEM — Single context, change theme:');

let bigCtx = { user: 'Surya', theme: 'light' };
const consumers = {
  UserDisplay()  { trackRender('UserDisplay'); },
  ThemeDisplay() { trackRender('ThemeDisplay'); },
};

function notifyAll() {
  Object.values(consumers).forEach(fn => fn());
}

bigCtx.theme = 'dark'; // only theme changed
notifyAll(); // both re-render!
console.log(`B: Both rendered even though only theme changed\n`);

// --- Solution 1: Split contexts ---
console.log('C: FIX 1 — Split contexts:');
renderCount = {};

const userCtx = { _value: 'Surya', _subs: [] };
const themeCtx = { _value: 'light', _subs: [] };

function subscribe(ctx, name, fn) {
  ctx._subs.push({ name, fn });
}
function updateCtx(ctx, newVal) {
  ctx._value = newVal;
  ctx._subs.forEach(s => { trackRender(s.name); s.fn(newVal); });
}

subscribe(userCtx, 'UserDisplay', () => {});
subscribe(themeCtx, 'ThemeDisplay', () => {});

updateCtx(themeCtx, 'dark');
console.log(`D: Only ThemeDisplay rendered!\n`);

// --- Solution 2: Memoize context value ---
console.log('E: FIX 2 — useMemo on provider value:');
renderCount = {};

// BAD: new object every render
function providerBad(user, theme) {
  return { user, theme }; // new reference each time!
}
const v1 = providerBad('Surya', 'dark');
const v2 = providerBad('Surya', 'dark');
console.log(`F: Without memo, same data = same ref? ${v1 === v2}`); // false

// GOOD: useMemo — return same ref if inputs unchanged
let memoCache = null;
let memoKey = null;
function useMemoValue(user, theme) {
  const key = `${user}|${theme}`;
  if (key === memoKey) return memoCache;
  memoKey = key;
  memoCache = { user, theme };
  return memoCache;
}
const m1 = useMemoValue('Surya', 'dark');
const m2 = useMemoValue('Surya', 'dark');
console.log(`G: With memo, same data = same ref? ${m1 === m2}`); // true

// --- Solution 3: React.memo on children ---
console.log('\nH: FIX 3 — memo children (skip if props unchanged):');
renderCount = {};

function memo(component) {
  let prevProps = undefined;
  return (props) => {
    if (JSON.stringify(props) === JSON.stringify(prevProps)) {
      console.log(`  ${component.name} SKIPPED (memo)`);
      return;
    }
    prevProps = { ...props };
    component(props);
  };
}

function ExpensiveChild(props) { trackRender('ExpensiveChild'); }
const MemoChild = memo(ExpensiveChild);

MemoChild({ label: 'hi' });
MemoChild({ label: 'hi' }); // skipped
MemoChild({ label: 'changed' }); // rendered

/**
 * OUTPUT:
 * A: PROBLEM — Single context, change theme:
 *   UserDisplay rendered (#1)
 *   ThemeDisplay rendered (#1)
 * B: Both rendered even though only theme changed
 *
 * C: FIX 1 — Split contexts:
 *   ThemeDisplay rendered (#1)
 * D: Only ThemeDisplay rendered!
 *
 * E: FIX 2 — useMemo on provider value:
 * F: Without memo, same data = same ref? false
 * G: With memo, same data = same ref? true
 *
 * H: FIX 3 — memo children (skip if props unchanged):
 *   ExpensiveChild rendered (#1)
 *   ExpensiveChild SKIPPED (memo)
 *   ExpensiveChild rendered (#2)
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Context re-renders ALL consumers on any value change. │
 * │ Fix with: (1) split into smaller contexts, (2) wrap  │
 * │ provider value in useMemo, (3) React.memo children.   │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/06-context-api/03-context-performance.js
 */
