/**
 * TOPIC: React Coding Challenges (Pure JS)
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  Interviewers test React thinking through code.          ║
 * ║  These challenges implement common hooks & patterns      ║
 * ║  in pure JS to prove you understand the internals.       ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ Each challenge = a React concept stripped to its core.    │
 * │ If you can build it in plain JS, you truly understand it. │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │  Challenge 1: useDebounce                                 │
 * │  Challenge 2: usePrevious                                 │
 * │  Challenge 3: Counter with useState logic                 │
 * │  Challenge 4: Todo list logic                             │
 * │  Challenge 5: Infinite scroll logic                       │
 * │  Challenge 6: useWindowSize                               │
 * └───────────────────────────────────────────────────────────┘
 */

// ============================================================
// CHALLENGE 1: Implement useDebounce
// ============================================================
console.log("=== A: useDebounce ===");

function useDebounce(callback, delay) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

// Test
const search = useDebounce((query) => {
  console.log("A: Searching for:", query);
}, 100);

search("h");
search("he");
search("hel");
search("hello"); // only this fires
setTimeout(() => console.log("A: (only 'hello' logged — previous calls debounced)\n"), 200);

// ============================================================
// CHALLENGE 2: Implement usePrevious
// ============================================================
setTimeout(() => {
  console.log("=== B: usePrevious ===");

  function usePrevious() {
    let ref = { current: undefined };
    return function update(value) {
      const prev = ref.current;
      ref.current = value;
      return prev;
    };
  }

  const getPrev = usePrevious();
  console.log("B: prev of 10 =>", getPrev(10)); // undefined
  console.log("B: prev of 20 =>", getPrev(20)); // 10
  console.log("B: prev of 30 =>", getPrev(30)); // 20
  console.log("");
}, 250);

// ============================================================
// CHALLENGE 3: Counter with useState logic
// ============================================================
setTimeout(() => {
  console.log("=== C: Counter (useState simulation) ===");

  function createCounter(initial) {
    let state = initial;
    let renderQueue = [];

    function setState(updater) {
      state = typeof updater === "function" ? updater(state) : updater;
      render();
    }

    function render() {
      console.log("C: Counter value:", state);
    }

    return {
      increment: () => setState((prev) => prev + 1),
      decrement: () => setState((prev) => prev - 1),
      reset: () => setState(initial),
    };
  }

  const counter = createCounter(0);
  counter.increment(); // 1
  counter.increment(); // 2
  counter.increment(); // 3
  counter.decrement(); // 2
  counter.reset();     // 0
  console.log("");
}, 300);

// ============================================================
// CHALLENGE 4: Todo List Logic
// ============================================================
setTimeout(() => {
  console.log("=== D: Todo List (useReducer pattern) ===");

  function todoReducer(state, action) {
    switch (action.type) {
      case "ADD":
        return [...state, { id: Date.now(), text: action.text, done: false }];
      case "TOGGLE":
        return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
      case "DELETE":
        return state.filter((t) => t.id !== action.id);
      default:
        return state;
    }
  }

  let todos = [];
  function dispatch(action) {
    todos = todoReducer(todos, action);
    console.log("D:", todos.map((t) => `${t.done ? "[x]" : "[ ]"} ${t.text}`).join(" | "));
  }

  dispatch({ type: "ADD", text: "Learn React" });
  dispatch({ type: "ADD", text: "Build project" });
  const firstId = todos[0].id;
  dispatch({ type: "TOGGLE", id: firstId });
  dispatch({ type: "DELETE", id: todos[1].id });
  console.log("");
}, 350);

// ============================================================
// CHALLENGE 5: Infinite Scroll Logic
// ============================================================
setTimeout(() => {
  console.log("=== E: Infinite Scroll Logic ===");

  function createInfiniteScroll(fetchPage) {
    let page = 1;
    let loading = false;
    let items = [];
    let hasMore = true;

    async function loadMore() {
      if (loading || !hasMore) return;
      loading = true;
      console.log("E: Loading page", page, "...");
      const newItems = await fetchPage(page);
      if (newItems.length === 0) {
        hasMore = false;
        console.log("E: No more items");
      } else {
        items = [...items, ...newItems];
        page++;
        console.log("E: Total items:", items.length);
      }
      loading = false;
    }

    function onScroll(scrollTop, clientHeight, scrollHeight) {
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
      }
    }

    return { loadMore, onScroll, getItems: () => items };
  }

  const fakeFetch = (p) =>
    Promise.resolve(p <= 3 ? Array.from({ length: 5 }, (_, i) => `Item ${(p - 1) * 5 + i + 1}`) : []);

  const scroll = createInfiniteScroll(fakeFetch);
  scroll.loadMore();
  setTimeout(() => scroll.loadMore(), 50);
  setTimeout(() => scroll.loadMore(), 100);
  setTimeout(() => scroll.loadMore(), 150); // empty — no more
  setTimeout(() => console.log(""), 200);
}, 400);

// ============================================================
// CHALLENGE 6: useWindowSize (custom hook)
// ============================================================
setTimeout(() => {
  console.log("=== F: useWindowSize ===");

  function useWindowSize() {
    let size = { width: 1024, height: 768 };
    const listeners = [];

    function subscribe(fn) {
      listeners.push(fn);
      return () => {
        const idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
      };
    }

    function simulateResize(w, h) {
      size = { width: w, height: h };
      listeners.forEach((fn) => fn(size));
    }

    return { getSize: () => size, subscribe, simulateResize };
  }

  const win = useWindowSize();
  const unsub = win.subscribe((s) => console.log("F: Window resized to:", s.width, "x", s.height));

  console.log("F: Initial:", win.getSize().width, "x", win.getSize().height);
  win.simulateResize(800, 600);
  win.simulateResize(375, 667);
  unsub();
  win.simulateResize(1920, 1080); // no log — unsubscribed
  console.log("F: After unsub, no log for 1920x1080");
}, 650);

/**
 * OUTPUT:
 * === A: useDebounce ===
 * A: Searching for: hello
 * A: (only 'hello' logged)
 *
 * === B: usePrevious ===
 * B: prev of 10 => undefined
 * B: prev of 20 => 10
 * B: prev of 30 => 20
 *
 * === C: Counter ===
 * C: Counter value: 1, 2, 3, 2, 0
 *
 * === D: Todo List ===
 * D: [ ] Learn React | [ ] Build project | [x] Learn React | [x] Learn React
 *
 * === E: Infinite Scroll ===
 * E: Loading page 1-4, total items growing
 *
 * === F: useWindowSize ===
 * F: resize events, unsub works
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ These patterns test: closures (debounce, previous),       │
 * │ state management (counter, todo reducer), async patterns  │
 * │ (infinite scroll), and pub/sub (window size). Master      │
 * │ these and you can build any React feature from scratch.   │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/14-interview-cheatsheet/01-coding-challenges.js
 */
