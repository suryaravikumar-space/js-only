/**
 * TOPIC: useFetch — Custom Data Fetching Hook
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  useFetch encapsulates loading, data, and error states.           ║
 * ║  It handles cleanup (AbortController), re-fetching on URL change, ║
 * ║  and prevents setState on unmounted components.                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ useFetch is a waiter. You tell them the order (URL). They go to  │
 * │ the kitchen (API), come back with food (data), or bad news       │
 * │ (error). While waiting you see a spinner (loading). If you leave │
 * │ the restaurant (unmount), they cancel your order (abort).        │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  useFetch(url)                                                     │
 * │   ├── state: { data: null, loading: true, error: null }          │
 * │   ├── useEffect(() => {                                           │
 * │   │     fetch(url, { signal })                                    │
 * │   │       .then(setData)                                          │
 * │   │       .catch(setError)                                        │
 * │   │       .finally(setLoading(false))                             │
 * │   │     return () => controller.abort()                           │
 * │   │   }, [url])                                                   │
 * │   └── return { data, loading, error }                             │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate useFetch with Promises ===

function useFetch(url) {
  let state = { data: null, loading: true, error: null };
  let cancelled = false;

  const setState = (updates) => {
    if (cancelled) {
      console.log(`   [CANCELLED] Ignored setState for ${url}`);
      return;
    }
    state = { ...state, ...updates };
  };

  // Simulate the effect
  const effect = async () => {
    console.log(`   Fetching: ${url}`);
    setState({ loading: true, error: null });

    try {
      // Simulate network delay
      const data = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (url.includes("error")) reject(new Error("404 Not Found"));
          else resolve({ id: 1, name: "React Data", source: url });
        }, 100);
      });

      setState({ data, loading: false });
      console.log(`   Success: ${JSON.stringify(state.data)}`);
    } catch (err) {
      setState({ error: err.message, loading: false });
      console.log(`   Error: ${state.error}`);
    }
  };

  const cleanup = () => {
    cancelled = true;
    console.log(`   Cleanup: Aborted fetch for ${url}`);
  };

  return { getState: () => state, effect, cleanup };
}

// --- A: Successful fetch ---
console.log("A: === Successful Fetch ===");
const fetchA = useFetch("/api/users");
fetchA.effect();

// --- B: Error fetch ---
console.log("\nB: === Error Handling ===");
const fetchB = useFetch("/api/error-endpoint");
fetchB.effect();

// --- C: Cleanup on unmount ---
console.log("\nC: === Cleanup on Unmount ===");
const fetchC = useFetch("/api/slow-data");
fetchC.effect();
fetchC.cleanup(); // User navigated away!

// --- D: Re-fetch on URL change ---
console.log("\nD: === Re-fetch on URL Change ===");

async function simulateUrlChange() {
  // Wait for fetches above
  await new Promise(r => setTimeout(r, 200));

  console.log("\n   --- URL changes from /users to /posts ---");
  const fetch1 = useFetch("/api/users");
  await fetch1.effect();

  fetch1.cleanup(); // cleanup old effect
  const fetch2 = useFetch("/api/posts");
  await fetch2.effect();
}

simulateUrlChange().then(() => {
  // --- E: The React code this simulates ---
  console.log("\nE: === Actual React Code ===");
  console.log("   function useFetch(url) {");
  console.log("     const [data, setData] = useState(null);");
  console.log("     const [loading, setLoading] = useState(true);");
  console.log("     const [error, setError] = useState(null);");
  console.log("     useEffect(() => {");
  console.log("       const controller = new AbortController();");
  console.log("       setLoading(true);");
  console.log("       fetch(url, { signal: controller.signal })");
  console.log("         .then(r => r.json())");
  console.log("         .then(setData)");
  console.log("         .catch(setError)");
  console.log("         .finally(() => setLoading(false));");
  console.log("       return () => controller.abort();");
  console.log("     }, [url]);");
  console.log("     return { data, loading, error };");
  console.log("   }");
});

/**
 * OUTPUT:
 * A: Fetching /api/users → Success with data
 * B: Fetching /api/error-endpoint → Error: 404 Not Found
 * C: Fetching /api/slow-data → Cleanup: Aborted
 * D: URL change → cleanup old, fetch new
 * E: Actual React code printed
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useFetch is a custom hook that encapsulates    ║
 * ║ data fetching with loading/error/data states. It uses useEffect   ║
 * ║ with the URL as a dependency, AbortController for cleanup, and    ║
 * ║ prevents setState after unmount. It re-fetches when URL changes." ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/05-custom-hooks/01-useFetch.js
 */
