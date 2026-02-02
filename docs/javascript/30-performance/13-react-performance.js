/**
 * PERFORMANCE: 13 - React Performance
 *
 * ONE CONCEPT: Prevent unnecessary re-renders and optimize React apps
 */


// =============================================================================
// WHY REACT RE-RENDERS
// =============================================================================

console.log('=== React Performance ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REACT RE-RENDER TRIGGERS                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  A component re-renders when:                                       │
 *   │  1. Its state changes (setState/useState)                          │
 *   │  2. Its parent re-renders (props may or may not change)            │
 *   │  3. Context value it consumes changes                               │
 *   │                                                                      │
 *   │  KEY INSIGHT:                                                       │
 *   │  Parent re-renders → ALL children re-render by default            │
 *   │  Even if their props didn't change!                                │
 *   │                                                                      │
 *   │  <App>            ← state change here                              │
 *   │    <Header />     ← re-renders (child of App)                     │
 *   │    <Sidebar />    ← re-renders (child of App)                     │
 *   │    <Content>      ← re-renders (child of App)                     │
 *   │      <Article />  ← re-renders (child of Content)                │
 *   │    </Content>                                                       │
 *   │                                                                      │
 *   │  Re-render ≠ DOM update                                             │
 *   │  React diffs virtual DOM → only updates changed DOM nodes         │
 *   │  But re-rendering is still CPU work                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Parent re-render → ALL children re-render by default');
console.log('Re-render ≠ DOM update (React diffs first)');
console.log('But excessive re-renders waste CPU');


// =============================================================================
// React.memo
// =============================================================================

console.log('\n=== React.memo ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  React.memo: Skip re-render if props unchanged                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  const ExpensiveList = React.memo(function ExpensiveList({ items }) │
 *   │  {                                                                  │
 *   │    return items.map(item => <Item key={item.id} {...item} />);    │
 *   │  });                                                                │
 *   │                                                                      │
 *   │  // Parent re-renders but items didn't change?                     │
 *   │  // → ExpensiveList skips re-render!                               │
 *   │                                                                      │
 *   │  GOTCHA: Objects/arrays/functions are new references every render  │
 *   │  <ExpensiveList items={[1,2,3]} />   ← NEW array every render!   │
 *   │  <ExpensiveList onClick={() => {}} /> ← NEW function every render!│
 *   │  → memo won't help because props "changed" (different reference)  │
 *   │                                                                      │
 *   │  FIX: useMemo for objects/arrays, useCallback for functions       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('React.memo: shallow-compares props, skips if unchanged');
console.log('Gotcha: inline objects/functions = new reference every render');
console.log('Fix: useMemo + useCallback to stabilize references');


// =============================================================================
// useMemo & useCallback
// =============================================================================

console.log('\n=== useMemo & useCallback ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  useMemo: Cache computed value                                      │
 *   │  useCallback: Cache function reference                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // useMemo: expensive computation                                  │
 *   │  const sorted = useMemo(                                            │
 *   │    () => items.sort((a,b) => a.name.localeCompare(b.name)),       │
 *   │    [items]  // Recompute only when items change                   │
 *   │  );                                                                 │
 *   │                                                                      │
 *   │  // useCallback: stable function reference                         │
 *   │  const handleClick = useCallback((id) => {                        │
 *   │    setSelected(id);                                                 │
 *   │  }, []);  // Never changes (no deps)                               │
 *   │                                                                      │
 *   │  // Now memo works!                                                 │
 *   │  <MemoizedChild items={sorted} onClick={handleClick} />           │
 *   │                                                                      │
 *   │  WHEN TO USE:                                                       │
 *   │  ✓ Expensive computations (useMemo)                                │
 *   │  ✓ Stabilizing props for memo'd children (useMemo/useCallback)   │
 *   │  ✓ Dependencies for other hooks (useEffect deps)                  │
 *   │                                                                      │
 *   │  WHEN NOT TO:                                                       │
 *   │  ✗ Simple calculations (overhead > savings)                        │
 *   │  ✗ No memo'd children (stabilizing refs for nothing)             │
 *   │  ✗ Premature optimization                                          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('useMemo: cache value     → [items] recomputes only when items change');
console.log('useCallback: cache fn ref → stable reference for memo children');
console.log('Only use when there is a measurable benefit');


// =============================================================================
// OTHER TECHNIQUES
// =============================================================================

console.log('\n=== Other Optimization Techniques ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MORE REACT PERFORMANCE TECHNIQUES                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. MOVE STATE DOWN                                                 │
 *   │     Keep state close to where it's used                            │
 *   │     Don't put everything in App state                              │
 *   │                                                                      │
 *   │  2. LIFT CONTENT UP (children as props)                            │
 *   │     <Layout>                                                        │
 *   │       <ExpensiveChild />  ← Passed as children, not re-created   │
 *   │     </Layout>                                                       │
 *   │     When Layout re-renders, children don't re-render              │
 *   │                                                                      │
 *   │  3. SPLIT CONTEXT                                                   │
 *   │     Separate frequently-changing values (theme vs auth)           │
 *   │     Prevents unnecessary re-renders of all consumers              │
 *   │                                                                      │
 *   │  4. VIRTUALIZE LONG LISTS                                          │
 *   │     react-virtuoso or @tanstack/react-virtual                      │
 *   │                                                                      │
 *   │  5. LAZY LOAD ROUTES + COMPONENTS                                  │
 *   │     React.lazy + Suspense                                           │
 *   │                                                                      │
 *   │  6. USE KEY CORRECTLY                                               │
 *   │     Stable keys (id, not index) for lists                          │
 *   │     Change key to force remount                                     │
 *   │                                                                      │
 *   │  7. React DevTools Profiler                                         │
 *   │     Identify which components re-render and why                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('1. Move state down (fewer re-renders)');
console.log('2. Lift content up (children as props)');
console.log('3. Split context (separate fast/slow updates)');
console.log('4. Virtualize long lists');
console.log('5. React.lazy for code splitting');
console.log('6. Stable keys (id not index)');
console.log('7. Profile with React DevTools');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "React re-renders a component when its state changes, its parent
 * re-renders, or a consumed context value changes. The key insight is
 * that parent re-renders cascade to ALL children by default, even if
 * their props didn't change.
 *
 * To prevent unnecessary re-renders, I use React.memo to skip
 * re-rendering when props are unchanged. But memo uses shallow
 * comparison, so I stabilize object and function props with useMemo
 * and useCallback to prevent new references every render.
 *
 * Before reaching for memo, I try simpler approaches first: moving
 * state closer to where it's used (fewer components in the re-render
 * tree), and passing components as children props which aren't
 * re-created on parent re-render.
 *
 * For context, I split frequently-changing values from stable ones to
 * prevent all consumers from re-rendering. I use React DevTools Profiler
 * to identify bottlenecks before optimizing — premature optimization
 * adds complexity without measurable benefit."
 */


// RUN: node docs/30-performance/13-react-performance.js
