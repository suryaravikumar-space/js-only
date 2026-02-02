/**
 * TOPIC: Context API — Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Context provides a way to share values between       ║
 * ║  components without explicitly passing props through  ║
 * ║  every level of the tree.                             ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────┐
 * │ Context = company-wide email vs passing notes desk    │
 * │ by desk. Everyone subscribed gets the message, but    │
 * │ you lose the paper trail of who really needed it.     │
 * └───────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────┐
 * │  Q1: What?    createContext → Provider → useContext    │
 * │  Q2: When?    Global data: theme, auth, locale        │
 * │  Q3: Perf?    All consumers re-render on change       │
 * │  Q4: Fix?     Split ctx, memo, useMemo value          │
 * │  Q5: vs Redux? Context = DI, Redux = state machine   │
 * └───────────────────────────────────────────────────────┘
 */

const QA = [
  {
    q: 'What is Context API?',
    a: 'A mechanism to pass data through the component tree without prop drilling. createContext makes a context, Provider sets the value, useContext reads it.'
  },
  {
    q: 'When should you use Context?',
    a: 'For truly global data needed by many components at different nesting levels — theme, auth, locale, feature flags. NOT for every piece of state.'
  },
  {
    q: 'What is the performance issue with Context?',
    a: 'When a context value changes, ALL components that call useContext for that context re-render, even if they only use a part of the value that did not change.'
  },
  {
    q: 'How do you fix context performance?',
    a: '1) Split large contexts into smaller ones. 2) Wrap provider value in useMemo. 3) Use React.memo on consumer components. 4) Separate state vs dispatch contexts.'
  },
  {
    q: 'What happens if there is no Provider above?',
    a: 'useContext returns the defaultValue passed to createContext. This is useful for testing and default themes.'
  },
  {
    q: 'Context vs Redux?',
    a: 'Context is dependency injection (passing values down). Redux is a state machine (actions, reducers, middleware, devtools, time-travel). Context lacks middleware and devtools.'
  },
  {
    q: 'Can you have multiple contexts?',
    a: 'Yes. Nest multiple providers. Each useContext call specifies which context to read. Split contexts for better performance.'
  },
  {
    q: 'What is "provider hell" and how to fix it?',
    a: 'Deeply nested providers. Fix with a ComposeProviders utility that takes an array of [Context, value] pairs and nests them programmatically.'
  },
  {
    q: 'Does useContext trigger re-render?',
    a: 'Yes. When the nearest Provider value changes (by reference), the component calling useContext re-renders. This is why useMemo on the value matters.'
  },
  {
    q: 'Context with useReducer pattern?',
    a: 'Common pattern: useReducer in parent, put state in StateContext and dispatch in DispatchContext. Components that only dispatch never re-render on state change.'
  }
];

QA.forEach((item, i) => {
  const label = String.fromCharCode(65 + i);
  console.log(`${label}: Q: ${item.q}`);
  console.log(`   A: ${item.a}\n`);
});

// --- Quick code recall ---
console.log('--- Quick Code Pattern ---');
console.log(`
// React code:
// const ThemeCtx = createContext('light');
//
// function App() {
//   return (
//     <ThemeCtx.Provider value="dark">
//       <Child />
//     </ThemeCtx.Provider>
//   );
// }
//
// function Child() {
//   const theme = useContext(ThemeCtx); // "dark"
// }
`);

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Context API = createContext + Provider + useContext.    │
 * │ Use for global data (theme/auth). Beware: all         │
 * │ consumers re-render on change. Fix with split          │
 * │ contexts, memo, and useMemo. Not a Redux replacement. │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/06-context-api/04-interview-cheatsheet.js
 */
