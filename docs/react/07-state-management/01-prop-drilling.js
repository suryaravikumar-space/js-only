/**
 * TOPIC: Prop Drilling — The Problem and Solutions
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Prop drilling = passing props through intermediate   ║
 * ║  components that don't use them, just to reach a      ║
 * ║  deeply nested child.                                 ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Passing a note in class through 5 students who don't  │
 * │ care about it, just to reach one friend at the back.  │
 * │ Solutions: whisper directly (context), or use the     │
 * │ school intercom (state library).                      │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  App(user) → Layout(user) → Page(user) → Card(user)  │
 * │                ↑ doesn't      ↑ doesn't               │
 * │                  use it         use it                │
 * │                                                       │
 * │  Fixes:                                               │
 * │  1. Context API                                       │
 * │  2. Component composition (children)                  │
 * │  3. State management library                          │
 * └───────────────────────────────────────────────────────┘
 */

// --- The Problem ---
console.log('A: PROBLEM — Prop drilling through 4 levels:\n');

function App(user) {
  console.log(`  App(user="${user}") → passes to Layout`);
  Layout(user);
}
function Layout(user) {
  console.log(`  Layout(user="${user}") → passes to Page (doesn't use it!)`);
  Page(user);
}
function Page(user) {
  console.log(`  Page(user="${user}") → passes to Avatar (doesn't use it!)`);
  Avatar(user);
}
function Avatar(user) {
  console.log(`  Avatar(user="${user}") → FINALLY uses it!`);
}

App('Surya');

// --- Fix 1: Context ---
console.log('\nB: FIX 1 — Context (skip intermediate levels):');

const UserCtx = { _value: null };
function AppWithCtx() {
  UserCtx._value = 'Surya'; // Provider
  console.log(`  App sets context`);
  LayoutCtx();
}
function LayoutCtx() {
  console.log(`  Layout — no user prop needed!`);
  PageCtx();
}
function PageCtx() {
  console.log(`  Page — no user prop needed!`);
  AvatarCtx();
}
function AvatarCtx() {
  console.log(`  Avatar reads context: user="${UserCtx._value}"`);
}
AppWithCtx();

// --- Fix 2: Component Composition (children pattern) ---
console.log('\nC: FIX 2 — Composition (pass the component, not the data):');

// Instead of drilling user, parent renders Avatar and passes it as "children"
function AppCompose() {
  const user = 'Surya';
  const avatar = () => { console.log(`  Avatar(user="${user}") rendered`); };
  console.log(`  App creates Avatar with user, passes component down`);
  LayoutCompose(avatar);
}
function LayoutCompose(children) {
  console.log(`  Layout receives pre-built Avatar — no user prop`);
  PageCompose(children);
}
function PageCompose(children) {
  console.log(`  Page receives pre-built Avatar — no user prop`);
  children(); // renders Avatar
}
AppCompose();

// --- Fix 3: External Store ---
console.log('\nD: FIX 3 — External store (Redux/Zustand concept):');

const store = { user: 'Surya' };
function AvatarStore() {
  const user = store.user; // reads directly from store
  console.log(`  Avatar reads from store: user="${user}"`);
}
console.log(`  Store = ${JSON.stringify(store)}`);
console.log(`  Any component reads store directly:`);
AvatarStore();

// --- When is drilling OK? ---
console.log('\nE: When drilling is FINE:');
console.log(`  1-2 levels deep, explicit data flow, easy to trace`);

/**
 * OUTPUT:
 * A: PROBLEM — Prop drilling through 4 levels:
 *   App(user="Surya") → passes to Layout
 *   Layout(user="Surya") → passes to Page (doesn't use it!)
 *   Page(user="Surya") → passes to Avatar (doesn't use it!)
 *   Avatar(user="Surya") → FINALLY uses it!
 *
 * B: FIX 1 — Context (skip intermediate levels):
 *   App sets context
 *   Layout — no user prop needed!
 *   Page — no user prop needed!
 *   Avatar reads context: user="Surya"
 *
 * C: FIX 2 — Composition (pass the component, not the data):
 *   App creates Avatar with user, passes component down
 *   Layout receives pre-built Avatar — no user prop
 *   Page receives pre-built Avatar — no user prop
 *   Avatar(user="Surya") rendered
 *
 * D: FIX 3 — External store (Redux/Zustand concept):
 *   Store = {"user":"Surya"}
 *   Any component reads store directly:
 *   Avatar reads from store: user="Surya"
 *
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Prop drilling passes data through components that     │
 * │ don't need it. Fix with: Context API, component       │
 * │ composition (children/render props), or an external   │
 * │ state library. 1-2 levels of drilling is fine.        │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/07-state-management/01-prop-drilling.js
 */
