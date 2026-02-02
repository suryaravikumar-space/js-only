/**
 * TOPIC: Lifting State Up — Data Down, Events Up
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  When two siblings need shared state, lift it to      ║
 * ║  their closest common parent. Data flows DOWN via     ║
 * ║  props, events flow UP via callbacks.                 ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Two kids arguing over the TV remote. Solution: give   │
 * │ the remote to the parent. Kids request (event up),    │
 * │ parent decides and sets channel (data down).          │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │         Parent (owns state)                           │
 * │         /          \                                  │
 * │   [state ↓]     [state ↓]                            │
 * │   ChildA          ChildB                              │
 * │   [event ↑]     [event ↑]                            │
 * │                                                       │
 * │  Before: ChildA has local state, ChildB can't see it  │
 * │  After:  Parent holds state, both children share it   │
 * └───────────────────────────────────────────────────────┘
 */

// --- BEFORE: state is local, siblings can't share ---
console.log('A: BEFORE — state stuck in one child:');

function TempInputLocal() {
  let temp = 25; // local state — sibling can't access
  console.log(`  TempInput has temp=${temp} (local)`);
  return temp;
}
function TempDisplayLocal() {
  console.log(`  TempDisplay has NO access to temp`);
}
TempInputLocal();
TempDisplayLocal();

// --- AFTER: lift state to parent ---
console.log('\nB: AFTER — state lifted to parent:');

function Parent() {
  let temp = 25; // state lives here

  // callback passed down — event flows UP
  const onTempChange = (newTemp) => {
    temp = newTemp;
    console.log(`C: Parent updates temp to ${temp}`);
    // re-render children with new state
    TempInput(temp, onTempChange);
    TempDisplay(temp);
  };

  // initial render — data flows DOWN
  TempInput(temp, onTempChange);
  TempDisplay(temp);
}

function TempInput(temp, onChange) {
  console.log(`D: TempInput shows ${temp}C`);
  // simulate user typing new value
  if (temp === 25) onChange(30); // event UP
}

function TempDisplay(temp) {
  const f = (temp * 9/5) + 32;
  console.log(`E: TempDisplay shows ${temp}C = ${f}F`);
}

Parent();

// --- Pattern: multiple children sharing state ---
console.log('\nF: Multiple children sharing lifted state:');

function Dashboard() {
  let filter = 'all';
  const setFilter = (f) => {
    filter = f;
    console.log(`G: Dashboard sets filter="${filter}"`);
    Sidebar(filter, setFilter);
    Content(filter);
  };
  Sidebar(filter, setFilter);
  Content(filter);
}

function Sidebar(filter, onFilter) {
  console.log(`H: Sidebar shows active filter="${filter}"`);
  if (filter === 'all') onFilter('active');
}
function Content(filter) {
  console.log(`I: Content filters items by "${filter}"`);
}

Dashboard();

/**
 * OUTPUT:
 * A: BEFORE — state stuck in one child:
 *   TempInput has temp=25 (local)
 *   TempDisplay has NO access to temp
 *
 * B: AFTER — state lifted to parent:
 * D: TempInput shows 25C
 * C: Parent updates temp to 30
 * D: TempInput shows 30C
 * E: TempDisplay shows 30C = 86F
 * E: TempDisplay shows 25C = 77F
 *
 * F: Multiple children sharing lifted state:
 * H: Sidebar shows active filter="all"
 * G: Dashboard sets filter="active"
 * H: Sidebar shows active filter="active"
 * I: Content filters items by "active"
 * I: Content filters items by "all"
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Lifting state = move shared state to the closest      │
 * │ common parent. Parent passes state down as props and  │
 * │ children send events up via callback props. This is   │
 * │ React's fundamental data flow pattern.                │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/07-state-management/00-lifting-state.js
 */
