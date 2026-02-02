/**
 * TOPIC: Keyboard Accessibility
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Everything a mouse can do, a keyboard must do too.             ║
 * ║  Tab to navigate, Enter/Space to activate, Escape to dismiss.  ║
 * ║  If you can't see focus, keyboard users are lost.               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ Tab is the wheelchair ramp of the web. If your site has        │
 * │ stairs only (mouse-only interactions), wheelchair users         │
 * │ (keyboard users) can't enter. Focus indicators are the         │
 * │ handrails — remove them and people fall.                       │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  tabindex values:                                              │
 * │  ┌──────────────────────────────────────────────────────┐     │
 * │  │ tabindex="0"  → Natural tab order (USE THIS)         │     │
 * │  │ tabindex="-1" → Focusable via JS only (skip links)   │     │
 * │  │ tabindex="1+" → Forces order (NEVER DO THIS)         │     │
 * │  └──────────────────────────────────────────────────────┘     │
 * │                                                                │
 * │  Key bindings:                                                 │
 * │  Tab       → Next focusable element                           │
 * │  Shift+Tab → Previous focusable element                       │
 * │  Enter     → Activate link/button                             │
 * │  Space     → Activate button, toggle checkbox                 │
 * │  Escape    → Close dialog/dropdown                            │
 * │  Arrows    → Navigate within widgets (tabs, menus)            │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Tab Order Simulation ────────────────────────────────────
console.log("A: Tab Order (DOM order):");

const domElements = [
  { tag: "a", href: "/", text: "Home", tabindex: null },
  { tag: "button", text: "Sign In", tabindex: null },
  { tag: "input", type: "email", tabindex: null },
  { tag: "div", text: "Not focusable", tabindex: null },
  { tag: "div", text: "Custom button", tabindex: 0 },
  { tag: "div", text: "JS-only focus", tabindex: -1 },
  { tag: "span", text: "Forced first", tabindex: 1 },
];

const naturallyFocusable = ["a", "button", "input", "select", "textarea"];

const getTabOrder = (elements) => {
  const positive = elements.filter(el => el.tabindex > 0).sort((a, b) => a.tabindex - b.tabindex);
  const zero = elements.filter(el =>
    el.tabindex === 0 || (el.tabindex === null && naturallyFocusable.includes(el.tag))
  );
  return [...positive, ...zero];
};

const tabOrder = getTabOrder(domElements);
tabOrder.forEach((el, i) => {
  const reason = el.tabindex > 0 ? `tabindex=${el.tabindex} (BAD!)` :
                 el.tabindex === 0 ? "tabindex=0" : "native focusable";
  console.log(`   ${i + 1}. <${el.tag}> "${el.text}" — ${reason}`);
});

// ─── B: Focus Trap (Modal Pattern) ──────────────────────────────
console.log("\nB: Focus Trap Simulation (Modal):");

class FocusTrap {
  constructor(focusableElements) {
    this.elements = focusableElements;
    this.currentIndex = 0;
  }

  tab = () => {
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    return this.elements[this.currentIndex];
  };

  shiftTab = () => {
    this.currentIndex = (this.currentIndex - 1 + this.elements.length) % this.elements.length;
    return this.elements[this.currentIndex];
  };

  getCurrentFocus = () => this.elements[this.currentIndex];
}

const modalElements = ["Close Button", "Email Input", "Password Input", "Submit Button"];
const trap = new FocusTrap(modalElements);

console.log(`   Start: ${trap.getCurrentFocus()}`);
console.log(`   Tab:   ${trap.tab()}`);
console.log(`   Tab:   ${trap.tab()}`);
console.log(`   Tab:   ${trap.tab()}`);
console.log(`   Tab:   ${trap.tab()} ← wraps back to start`);
console.log(`   Shift+Tab: ${trap.shiftTab()} ← wraps to end`);

// ─── C: Roving Tabindex (Tabs/Toolbar) ──────────────────────────
console.log("\nC: Roving Tabindex Pattern:");

class RovingTabindex {
  constructor(items) {
    this.items = items.map((item, i) => ({ ...item, tabindex: i === 0 ? 0 : -1 }));
    this.activeIndex = 0;
  }

  move = (direction) => {
    this.items[this.activeIndex].tabindex = -1;
    this.activeIndex = (this.activeIndex + direction + this.items.length) % this.items.length;
    this.items[this.activeIndex].tabindex = 0;
    return this.items[this.activeIndex];
  };

  arrowRight = () => this.move(1);
  arrowLeft = () => this.move(-1);

  getState = () => this.items.map(i => `${i.label}(${i.tabindex})`).join(" | ");
}

const tabs = new RovingTabindex([
  { label: "Tab1" }, { label: "Tab2" }, { label: "Tab3" }
]);

console.log(`   Initial:     ${tabs.getState()}`);
console.log(`   ArrowRight:  ${tabs.arrowRight().label} → ${tabs.getState()}`);
console.log(`   ArrowRight:  ${tabs.arrowRight().label} → ${tabs.getState()}`);
console.log(`   ArrowRight:  ${tabs.arrowRight().label} → ${tabs.getState()} (wraps)`);
console.log(`   ArrowLeft:   ${tabs.arrowLeft().label} → ${tabs.getState()}`);

// ─── D: Skip Link Pattern ───────────────────────────────────────
console.log("\nD: Skip Link Pattern:");
console.log('   <a href="#main" class="skip-link">Skip to main content</a>');
console.log("   CSS: .skip-link { position:absolute; top:-40px; }");
console.log("   CSS: .skip-link:focus { top:0; }");
console.log("   First Tab press reveals it, Enter skips to #main");

// ─── E: Keyboard Event Handling ─────────────────────────────────
console.log("\nE: Keyboard Event Patterns:");

const handleKeyDown = (key, role) => {
  const handlers = {
    button: { Enter: "activate", " ": "activate" },
    link: { Enter: "navigate" },
    dialog: { Escape: "close" },
    tab: { ArrowLeft: "prev tab", ArrowRight: "next tab", Home: "first tab", End: "last tab" },
    menu: { ArrowUp: "prev item", ArrowDown: "next item", Escape: "close menu" },
    combobox: { ArrowDown: "open/next", ArrowUp: "prev", Escape: "close", Enter: "select" },
  };

  return handlers[role]?.[key] || "no action";
};

const testCases = [
  ["Enter", "button"], [" ", "button"], ["Enter", "link"],
  ["Escape", "dialog"], ["ArrowRight", "tab"], ["ArrowDown", "menu"],
];

testCases.forEach(([key, role]) => {
  console.log(`   [${role}] "${key}" → ${handleKeyDown(key, role)}`);
});

// ─── F: Focus Visible ───────────────────────────────────────────
console.log("\nF: Focus Indicator Requirements (WCAG 2.4.7 / 2.4.11):");
console.log("   2.4.7 (AA):  Focus indicator must be VISIBLE");
console.log("   2.4.11 (AAA): Focus indicator must have 3:1 contrast");
console.log("   2.4.13 (AAA): Focus not obscured by other content");
console.log("   NEVER: outline:none without replacement");
console.log("   GOOD:  :focus-visible { outline: 3px solid #005fcc; outline-offset: 2px; }");

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "All interactive content must be keyboard    ║
 * ║ accessible. tabindex=0 adds to tab order, -1 for JS-only      ║
 * ║ focus, never use positive tabindex. Modals need focus traps.   ║
 * ║ Tab groups (tabs, toolbars) use roving tabindex with arrow     ║
 * ║ keys. Always provide visible focus indicators — never remove   ║
 * ║ outline without a replacement."                                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/03-keyboard-accessibility.js
 */
