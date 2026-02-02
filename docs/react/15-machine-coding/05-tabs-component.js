/**
 * TOPIC: Tabs Component — Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Tabs = Active Index + Lazy Map + Key Handler  ║
 * ║  Only ONE tab active. Lazy-load content on first visit.     ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: A filing cabinet with labeled drawers. You pull one  │
 * │  drawer open (active tab), the rest close. Some drawers are  │
 * │  empty until you first open them (lazy loading). Arrow keys  │
 * │  let you move between drawer handles without opening.        │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                             │
 * │                                             │
 * │  [Tab0]  [Tab1*]  [Tab2]   <- tab bar       │
 * │  ┌─────────────────────┐                    │
 * │  │  Content of Tab1    │   <- panel          │
 * │  │  (lazy loaded)      │                    │
 * │  └─────────────────────┘                    │
 * │                                             │
 * │  Keyboard: Left/Right = focus prev/next     │
 * │            Home = first, End = last          │
 * │            Enter/Space = activate            │
 * │                                             │
 * │  ARIA: role="tablist", role="tab",          │
 * │        role="tabpanel", aria-selected       │
 * └─────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/05-tabs-component.js
 */

// ─── Tab definitions ─────────────────────────────────────────
const TAB_CONFIG = [
  { id: "profile", label: "Profile", content: () => "Name: Surya, Role: Developer" },
  { id: "settings", label: "Settings", content: () => "Theme: Dark, Lang: EN" },
  { id: "billing", label: "Billing", content: () => "Plan: Pro, Next: 2025-02-01" },
];

// ─── State ───────────────────────────────────────────────────
function createTabsState(tabs) {
  return {
    tabs,
    activeIndex: 0,
    focusedIndex: 0,
    loadedSet: new Set([0]), // lazy: only first tab loaded initially
  };
}

// ─── Actions ─────────────────────────────────────────────────
function activate(state, index) {
  if (index < 0 || index >= state.tabs.length) return state;
  state.activeIndex = index;
  state.focusedIndex = index;
  state.loadedSet.add(index);
  return state;
}

function moveFocus(state, direction) {
  const len = state.tabs.length;
  if (direction === "left") state.focusedIndex = (state.focusedIndex - 1 + len) % len;
  else if (direction === "right") state.focusedIndex = (state.focusedIndex + 1) % len;
  else if (direction === "home") state.focusedIndex = 0;
  else if (direction === "end") state.focusedIndex = len - 1;
  return state;
}

function activateFocused(state) {
  return activate(state, state.focusedIndex);
}

// ─── ARIA attribute generator ────────────────────────────────
function getAriaAttributes(state) {
  return state.tabs.map((tab, i) => ({
    role: "tab",
    id: `tab-${tab.id}`,
    "aria-selected": i === state.activeIndex,
    "aria-controls": `panel-${tab.id}`,
    tabindex: i === state.focusedIndex ? 0 : -1,
  }));
}

function getPanelAria(state) {
  const tab = state.tabs[state.activeIndex];
  return {
    role: "tabpanel",
    id: `panel-${tab.id}`,
    "aria-labelledby": `tab-${tab.id}`,
  };
}

// ─── Render (simulated) ──────────────────────────────────────
function render(state) {
  const bar = state.tabs
    .map((t, i) => (i === state.activeIndex ? `[${t.label}*]` : `[${t.label}]`))
    .join("  ");
  const content = state.loadedSet.has(state.activeIndex)
    ? state.tabs[state.activeIndex].content()
    : "(not loaded yet)";
  return { bar, content, panel: getPanelAria(state) };
}

// ─── Simulation ──────────────────────────────────────────────
console.log("=== TABS COMPONENT SIMULATION ===\n");

let state = createTabsState(TAB_CONFIG);

// A: Initial render
let view = render(state);
console.log("A: Initial state");
console.log(`   Bar: ${view.bar}`);
console.log(`   Content: ${view.content}`);
console.log(`   ARIA: ${JSON.stringify(getAriaAttributes(state)[0])}\n`);

// B: Click Tab 2 (Billing)
state = activate(state, 2);
view = render(state);
console.log("B: Activate 'Billing' tab");
console.log(`   Bar: ${view.bar}`);
console.log(`   Content: ${view.content}`);
console.log(`   Loaded tabs: [${[...state.loadedSet].join(", ")}]\n`);

// C: Keyboard — press Left from index 2
state = moveFocus(state, "left");
console.log("C: Press Left arrow (focus moves, tab stays)");
console.log(`   Focused: ${state.tabs[state.focusedIndex].label}`);
console.log(`   Active : ${state.tabs[state.activeIndex].label}\n`);

// D: Press Enter to activate focused tab
state = activateFocused(state);
view = render(state);
console.log("D: Press Enter on focused tab");
console.log(`   Bar: ${view.bar}`);
console.log(`   Content: ${view.content}\n`);

// E: Home key
state = moveFocus(state, "home");
state = activateFocused(state);
view = render(state);
console.log("E: Home key + Enter");
console.log(`   Bar: ${view.bar}`);
console.log(`   Content: ${view.content}\n`);

// F: End key
state = moveFocus(state, "end");
state = activateFocused(state);
view = render(state);
console.log("F: End key + Enter");
console.log(`   Bar: ${view.bar}`);
console.log(`   Content: ${view.content}\n`);

// G: Wrap-around (Right from last)
state = moveFocus(state, "right");
console.log("G: Right from last tab wraps to first");
console.log(`   Focused: ${state.tabs[state.focusedIndex].label}\n`);

// H: Lazy loading check
console.log("H: Lazy load audit");
console.log(`   Loaded indices: [${[...state.loadedSet].join(", ")}]`);
console.log(`   All 3 loaded after visiting each: ${state.loadedSet.size === 3}\n`);

// I: Panel ARIA
const panel = getPanelAria(state);
console.log("I: Panel ARIA attributes");
console.log(`   ${JSON.stringify(panel)}\n`);

// ─── Follow-up Questions ─────────────────────────────────────
console.log("=== FOLLOW-UP QUESTIONS ===");
console.log("1. How would you handle disabled tabs?");
console.log("2. How to add animated transitions between panels?");
console.log("3. How would you persist the active tab in URL (routing)?");
console.log("4. How to support vertical tabs with Up/Down keys?");
console.log("5. What if tab content is async (API call on activate)?");

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER                                           ║
 * ║                                                             ║
 * ║  Tabs need: activeIndex state, lazy-load Set, keyboard      ║
 * ║  handler (Left/Right/Home/End), and ARIA roles (tablist,    ║
 * ║  tab, tabpanel, aria-selected). Focus and activation are    ║
 * ║  separate — arrow keys move focus, Enter/Space activates.   ║
 * ║  Lazy loading: track visited tabs in a Set, only render     ║
 * ║  content once the tab has been activated at least once.      ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
