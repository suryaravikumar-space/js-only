/**
 * TOPIC: React.memo — Skip Re-renders When Props Haven't Changed
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  React.memo does a SHALLOW comparison of props.       ║
 * ║  If props are the same, the component SKIPS render.   ║
 * ║  It's a HIGHER-ORDER COMPONENT for function components║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A security guard (memo)  │
 * │ checks your ID (props).  │
 * │ Same ID? "You already    │
 * │ entered, no need to      │
 * │ check again." Different  │
 * │ ID? "Come in, re-render."│
 * └──────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  Parent re-renders    │
 * │       │               │
 * │       v               │
 * │  memo(Child)          │
 * │    │                  │
 * │    ├─ props same?     │
 * │    │  YES → skip      │
 * │    │  NO  → re-render │
 * └───────────────────────┘
 *
 * React code (for reference):
 *   const MemoChild = React.memo(function Child({ name }) {
 *     console.log('Child rendered');
 *     return <div>{name}</div>;
 *   });
 */

// --- Simulate shallow compare (what React.memo uses internally) ---
function shallowEqual(prevProps, nextProps) {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  if (prevKeys.length !== nextKeys.length) return false;
  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) return false;
  }
  return true;
}

// --- Simulate React.memo ---
function reactMemo(componentFn, customCompare) {
  let lastProps = null;
  let lastResult = null;
  const compare = customCompare || shallowEqual;

  return function memoized(props) {
    if (lastProps && compare(lastProps, props)) {
      console.log(`  [memo] Props unchanged — SKIPPED render`);
      return lastResult;
    }
    console.log(`  [memo] Props changed — RENDERING`);
    lastProps = { ...props };
    lastResult = componentFn(props);
    return lastResult;
  };
}

// --- Component ---
function UserCard(props) {
  return `<UserCard name="${props.name}" age=${props.age} />`;
}

const MemoUserCard = reactMemo(UserCard);

// A: First render — always renders
console.log("A: First render");
MemoUserCard({ name: "Surya", age: 25 });

// B: Same props — should skip
console.log("\nB: Same props");
MemoUserCard({ name: "Surya", age: 25 });

// C: Different props — should render
console.log("\nC: Different props");
MemoUserCard({ name: "Surya", age: 26 });

// D: Object prop trap — new ref each time breaks memo
console.log("\nD: Object prop (new ref each time)");
const MemoCard2 = reactMemo(UserCard);
MemoCard2({ name: "Surya", age: 25, style: { color: "red" } });
MemoCard2({ name: "Surya", age: 25, style: { color: "red" } }); // renders! refs differ

// E: Custom comparator
console.log("\nE: Custom comparator (deep check on 'name' only)");
const MemoCard3 = reactMemo(UserCard, (prev, next) => prev.name === next.name);
MemoCard3({ name: "Surya", age: 25 });
MemoCard3({ name: "Surya", age: 99 }); // skipped — name same

/**
 * OUTPUT:
 * A: First render
 *   [memo] Props changed — RENDERING
 *
 * B: Same props
 *   [memo] Props unchanged — SKIPPED render
 *
 * C: Different props
 *   [memo] Props changed — RENDERING
 *
 * D: Object prop (new ref each time)
 *   [memo] Props changed — RENDERING
 *   [memo] Props changed — RENDERING
 *
 * E: Custom comparator (deep check on 'name' only)
 *   [memo] Props changed — RENDERING
 *   [memo] Props unchanged — SKIPPED render
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ React.memo is an HOC that memoizes a function component. │
 * │ It shallow-compares props and skips re-render if same.   │
 * │ Pitfall: object/array/function props create new refs,    │
 * │ defeating memo. Fix with useMemo/useCallback.            │
 * └──────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/09-performance/00-react-memo.js
 */
