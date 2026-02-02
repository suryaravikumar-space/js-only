/**
 * TOPIC: React Machine Coding - Complete Interview Cheatsheet
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Every machine coding problem = State Design +    ║
 * ║  Event Handlers + Render Logic. Nail the state, rest follows.  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: You walk into an interview. They say "build X in 45    │
 * │  min." You sketch state on paper first, list events, then      │
 * │  code. This cheatsheet is your quick-draw reference.            │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  VISUAL: The Machine Coding Formula                             │
 * │                                                                 │
 * │  ┌───────────┐   ┌────────────┐   ┌──────────────┐             │
 * │  │  STATE    │──►│  EVENTS    │──►│  RENDER      │             │
 * │  │  Design   │   │  Handlers  │   │  JSX/Output  │             │
 * │  └───────────┘   └────────────┘   └──────────────┘             │
 * │                                                                 │
 * │  Step 1: What data?  Step 2: What actions?  Step 3: What UI?    │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/14-interview-cheatsheet.js
 */

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║     REACT MACHINE CODING — COMPLETE INTERVIEW CHEATSHEET       ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

const problems = [
  {
    num: 1,
    name: 'Todo List',
    state: '{ todos: [{ id, text, completed }], filter: "all"|"active"|"completed" }',
    hooks: 'useState, useCallback, useMemo (filtered list)',
    followUps: ['Persist with localStorage', 'Drag reorder', 'Undo/redo', 'Inline edit'],
  },
  {
    num: 2,
    name: 'Autocomplete / Typeahead',
    state: '{ query, suggestions[], selectedIndex, isOpen, loading }',
    hooks: 'useState, useEffect (debounced fetch), useRef (input), useCallback',
    followUps: ['Debounce API calls', 'Keyboard nav (arrow/enter)', 'Highlight matched text', 'Cache results'],
  },
  {
    num: 3,
    name: 'Modal / Dialog',
    state: '{ isOpen, content, onConfirm, onCancel }',
    hooks: 'useState, useEffect (body scroll lock, Esc key), useRef (focus trap), createPortal',
    followUps: ['Focus trap', 'Nested modals', 'Animations', 'Accessibility (aria)'],
  },
  {
    num: 4,
    name: 'Infinite Scroll',
    state: '{ items[], page, loading, hasMore }',
    hooks: 'useState, useEffect, useRef (sentinel), IntersectionObserver',
    followUps: ['Virtualization', 'Scroll restoration', 'Error retry', 'Skeleton loading'],
  },
  {
    num: 5,
    name: 'Tabs Component',
    state: '{ activeTab, tabs: [{ id, label, content }] }',
    hooks: 'useState, useCallback, useMemo',
    followUps: ['Lazy load tab content', 'Keyboard nav', 'Closable tabs', 'Overflow scroll'],
  },
  {
    num: 6,
    name: 'Accordion',
    state: '{ openPanels: Set or index, allowMultiple: bool }',
    hooks: 'useState, useRef (content height for animation)',
    followUps: ['Animated expand/collapse', 'Single vs multi open', 'Nested accordion', 'Accessibility'],
  },
  {
    num: 7,
    name: 'Countdown Timer',
    state: '{ timeLeft, isRunning, initialTime }',
    hooks: 'useState, useRef (intervalId), useEffect (cleanup), useCallback',
    followUps: ['Pause/resume', 'Lap times', 'Multiple timers', 'Background tab handling'],
  },
  {
    num: 8,
    name: 'Tic-Tac-Toe',
    state: '{ board: 3x3 array, currentPlayer, winner, history[] }',
    hooks: 'useState, useMemo (winner check), useCallback',
    followUps: ['Undo/redo (time travel)', 'AI opponent (minimax)', 'NxN board', 'Score tracking'],
  },
  {
    num: 9,
    name: 'Shopping Cart',
    state: '{ items: [{ id, name, price, qty }], total (derived) }',
    hooks: 'useReducer, useMemo (total), useContext (cart provider)',
    followUps: ['Coupon codes', 'Stock validation', 'Persist cart', 'Optimistic updates'],
  },
  {
    num: 10,
    name: 'Star Rating',
    state: '{ rating, hoverIndex }',
    hooks: 'useState, useCallback, useMemo',
    followUps: ['Half-star (offsetX)', 'Read-only mode', 'Accessibility (radio)', 'Animation'],
  },
  {
    num: 11,
    name: 'File Explorer Tree',
    state: '{ tree: recursive { name, type, children[], expanded } }',
    hooks: 'useState, useCallback (toggle/add/delete), useMemo (search filter)',
    followUps: ['Lazy load folders', 'Drag-drop reparent', 'Rename inline', 'Keyboard nav'],
  },
  {
    num: 12,
    name: 'Toast Notifications',
    state: '{ toasts: [{ id, msg, type, duration }], queue[] }',
    hooks: 'useReducer, useRef (timers), useEffect (auto-dismiss), createPortal',
    followUps: ['Pause on hover', 'Max visible limit', 'Slide animations', 'Global singleton'],
  },
  {
    num: 13,
    name: 'Drag & Drop Reorder',
    state: '{ items[], dragIndex, dropIndex }',
    hooks: 'useState, useRef (dragItem), useCallback (onDrag events)',
    followUps: ['Visual placeholder', 'Multi-list Kanban', 'Touch support', 'Persist order'],
  },
  {
    num: 14,
    name: 'Form Builder / Multi-Step Form',
    state: '{ steps[], currentStep, formData: {}, errors: {} }',
    hooks: 'useReducer, useCallback (validate), useMemo (progress)',
    followUps: ['Dynamic validation', 'Conditional fields', 'Save draft', 'Progress bar'],
  },
];

// ─── Print each problem ──────────────────────────────────────────────

problems.forEach((p, i) => {
  const letter = String.fromCharCode(65 + i);
  console.log(`${letter}: Problem #${p.num} — ${p.name}`);
  console.log(`   State:     ${p.state}`);
  console.log(`   Hooks:     ${p.hooks}`);
  console.log(`   Follow-up: ${p.followUps.join(' | ')}`);
  console.log();
});

// ─── Universal Patterns ──────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════════');
console.log('UNIVERSAL PATTERNS FOR ALL MACHINE CODING PROBLEMS\n');

console.log('P1: State Design First');
console.log('    -> Draw the state shape BEFORE writing JSX');
console.log('    -> Ask: what is the minimal state? What is derived?\n');

console.log('P2: useState vs useReducer');
console.log('    -> Simple toggle/value: useState');
console.log('    -> Complex with multiple sub-values: useReducer\n');

console.log('P3: Cleanup');
console.log('    -> Timers: clearTimeout/clearInterval in useEffect return');
console.log('    -> Listeners: removeEventListener in useEffect return');
console.log('    -> Subscriptions: unsubscribe in useEffect return\n');

console.log('P4: Performance');
console.log('    -> Expensive renders: React.memo');
console.log('    -> Expensive computation: useMemo');
console.log('    -> Stable callbacks: useCallback');
console.log('    -> Large lists: virtualization (react-window)\n');

console.log('P5: Accessibility');
console.log('    -> Keyboard navigation (onKeyDown)');
console.log('    -> ARIA roles and labels');
console.log('    -> Focus management (useRef + focus())');
console.log('    -> Screen reader announcements\n');

// ─── Quick Q&A Format ────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════════');
console.log('RAPID-FIRE Q&A\n');

const qa = [
  ['Q: How to debounce in React?', 'A: useRef for timer, clearTimeout + setTimeout in handler, or useMemo(() => debounce(fn), [])'],
  ['Q: How to handle Esc key globally?', 'A: useEffect with document.addEventListener("keydown"), check e.key === "Escape"'],
  ['Q: How to trap focus in modal?', 'A: Query all focusable elements, on Tab wrap from last to first, on Shift+Tab wrap first to last'],
  ['Q: How to detect click outside?', 'A: useRef on container, useEffect with mousedown listener, check !ref.contains(e.target)'],
  ['Q: How to share state across components?', 'A: useContext + Provider for moderate; zustand/redux for complex; prop drilling for simple'],
  ['Q: How to animate mount/unmount?', 'A: State for "exiting", apply exit class, onTransitionEnd remove from DOM. Or use Framer Motion'],
  ['Q: How to lazy load a component?', 'A: React.lazy(() => import("./Comp")) + Suspense fallback'],
  ['Q: How to persist state across refreshes?', 'A: useEffect to save to localStorage, useState initializer reads from localStorage'],
];

qa.forEach(([q, a]) => {
  console.log(`  ${q}`);
  console.log(`  ${a}\n`);
});

// ─── Time Management Tips ────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════════');
console.log('45-MINUTE STRATEGY\n');
console.log('  0-5  min: Clarify requirements, sketch state on paper');
console.log('  5-10 min: Set up component structure, define state');
console.log(' 10-30 min: Implement core logic + basic UI');
console.log(' 30-40 min: Edge cases, error handling');
console.log(' 40-45 min: Polish, explain trade-offs, discuss follow-ups\n');

// ─── Interview Answer ────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  MASTER INTERVIEW ANSWER                                   ║');
console.log('║                                                            ║');
console.log('║  Every machine coding problem follows:                     ║');
console.log('║  1. Design minimal state (what changes?)                   ║');
console.log('║  2. List event handlers (what can user do?)                ║');
console.log('║  3. Derive display from state (pure render)               ║');
console.log('║  4. Handle edge cases (empty, overflow, error)            ║');
console.log('║  5. Add polish (a11y, animation, perf)                    ║');
console.log('║                                                            ║');
console.log('║  State Design is 70% of the solution.                     ║');
console.log('║  Get that right and everything else follows.              ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
