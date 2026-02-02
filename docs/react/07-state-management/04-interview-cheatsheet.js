/**
 * TOPIC: State Management — Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Start with local state (useState). Lift when shared. ║
 * ║  Use Context for global. Use Redux/Zustand for        ║
 * ║  complex, cross-cutting state.                        ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ State management is like organizing a kitchen.        │
 * │ Keep spices near the stove (local state), shared      │
 * │ items in the fridge (lifted state), and pantry for    │
 * │ the whole house (global store).                       │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  Complexity scale:                                    │
 * │  useState → useReducer → Context → Zustand → Redux   │
 * │  simple ──────────────────────────────────── complex  │
 * │                                                       │
 * │  Decision:                                            │
 * │  1 component?        → useState                       │
 * │  siblings share?     → lift state                     │
 * │  deeply nested?      → Context                        │
 * │  complex logic?      → useReducer                     │
 * │  app-wide + devtools → Redux / Zustand                │
 * └───────────────────────────────────────────────────────┘
 */

const QA = [
  {
    q: 'What is lifting state up?',
    a: 'Moving shared state to the closest common parent. Data flows down via props, events flow up via callbacks.'
  },
  {
    q: 'What is prop drilling and how to fix it?',
    a: 'Passing props through components that don\'t use them. Fix: Context API, component composition (children), or external state library.'
  },
  {
    q: 'useState vs useReducer?',
    a: 'useState for simple values. useReducer for complex state with multiple sub-values or when next state depends on previous. useReducer is also better for testing.'
  },
  {
    q: 'When to use Context vs Redux?',
    a: 'Context for low-frequency global data (theme, auth). Redux for complex state with middleware, devtools, time-travel. Context re-renders all consumers; Redux uses selectors.'
  },
  {
    q: 'What are the three Redux principles?',
    a: '1) Single source of truth (one store). 2) State is read-only (change via actions). 3) Changes via pure functions (reducers).'
  },
  {
    q: 'What is Zustand?',
    a: 'Minimal state library. One store, no Provider, selector-based subscriptions. Less boilerplate than Redux. Hook-based API.'
  },
  {
    q: 'What is Jotai?',
    a: 'Atomic state management. Each atom is independent. Components subscribe to specific atoms. Derived atoms for computed values. Bottom-up approach.'
  },
  {
    q: 'How do you decide what state management to use?',
    a: 'Start simple: useState → lift state → useReducer → Context → external lib. Only add complexity when needed. Server state? Use React Query.'
  },
  {
    q: 'What is server state vs client state?',
    a: 'Server state: data from API (cached, stale, async). Use React Query/SWR. Client state: UI state (modals, forms). Use useState/Redux.'
  },
  {
    q: 'Can you use multiple state solutions together?',
    a: 'Yes! Common: React Query for server state + Zustand for client state + Context for theme/auth. Pick the right tool for each job.'
  }
];

QA.forEach((item, i) => {
  const label = String.fromCharCode(65 + i);
  console.log(`${label}: Q: ${item.q}`);
  console.log(`   A: ${item.a}\n`);
});

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Start with useState, lift when shared, Context for    │
 * │ global, Redux/Zustand for complex. Server state with  │
 * │ React Query. Match tool to complexity. Don't over-    │
 * │ engineer — most apps need useState + Context.         │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/07-state-management/04-interview-cheatsheet.js
 */
