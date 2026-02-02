/**
 * TOPIC: ARIA Attributes — Roles, States & Properties
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  First Rule of ARIA: Don't use ARIA if native HTML works.      ║
 * ║  <button> beats <div role="button"> every time.                ║
 * ║  ARIA modifies the accessibility tree, NOT behavior.            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ ARIA is like name tags at a costume party. If someone is       │
 * │ already wearing a police uniform (native <button>), they       │
 * │ don't need a name tag saying "POLICE". But if someone is in    │
 * │ plain clothes acting as security (<div>), they NEED the tag.   │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  ARIA Categories:                                              │
 * │  ├── Roles: what IS it? (button, dialog, tab, alert)          │
 * │  ├── States: what CONDITION is it in? (expanded, selected)    │
 * │  └── Properties: what INFO does it have? (label, describedby) │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Five Rules of ARIA ──────────────────────────────────────
console.log("A: The 5 Rules of ARIA:");
const rules = [
  "Don't use ARIA if native HTML works (<button> > <div role='button'>)",
  "Don't change native semantics (<h2 role='tab'> is wrong)",
  "All interactive ARIA controls must be keyboard accessible",
  "Don't use role='presentation' or aria-hidden='true' on focusable elements",
  "All interactive elements must have an accessible name",
];
rules.forEach((rule, i) => console.log(`   Rule ${i + 1}: ${rule}`));

// ─── B: ARIA Roles by Category ──────────────────────────────────
console.log("\nB: ARIA Role Categories:");
const roleCategories = {
  Widget: ["button", "checkbox", "dialog", "slider", "tab", "tabpanel", "textbox", "combobox", "menu", "menuitem"],
  Landmark: ["banner", "navigation", "main", "complementary", "contentinfo", "form", "region", "search"],
  Document: ["article", "heading", "img", "list", "listitem", "row", "cell", "table"],
  Live: ["alert", "log", "marquee", "status", "timer"],
};

Object.entries(roleCategories).forEach(([category, roles]) => {
  console.log(`   ${category}: ${roles.join(", ")}`);
});

// ─── C: Accessible Name Computation ─────────────────────────────
console.log("\nC: Accessible Name Priority (highest → lowest):");

const computeAccessibleName = (element) => {
  if (element.ariaLabelledby) return { source: "aria-labelledby", name: element.ariaLabelledby };
  if (element.ariaLabel) return { source: "aria-label", name: element.ariaLabel };
  if (element.label) return { source: "<label>", name: element.label };
  if (element.title) return { source: "title", name: element.title };
  if (element.textContent) return { source: "text content", name: element.textContent };
  if (element.alt) return { source: "alt", name: element.alt };
  return { source: "NONE", name: "" };
};

const elements = [
  { tag: "button", ariaLabelledby: "Submit Form", ariaLabel: "Submit", textContent: "Go" },
  { tag: "button", ariaLabel: "Close dialog", textContent: "X" },
  { tag: "input", label: "Email address" },
  { tag: "img", alt: "Company logo" },
  { tag: "div", title: "Tooltip text" },
  { tag: "span" },
];

elements.forEach(el => {
  const { source, name } = computeAccessibleName(el);
  console.log(`   <${el.tag}>: "${name}" (via ${source})`);
});

// ─── D: aria-label vs aria-labelledby vs aria-describedby ───────
console.log("\nD: Labeling Attributes:");
const labelAttrs = [
  { attr: "aria-label",       use: "Inline label (no visible text)", example: '<button aria-label="Close">X</button>' },
  { attr: "aria-labelledby",  use: "Reference another element's text", example: '<h2 id="title">Cart</h2><div aria-labelledby="title">' },
  { attr: "aria-describedby", use: "Additional description",        example: '<input aria-describedby="hint"><p id="hint">Min 8 chars</p>' },
];

labelAttrs.forEach(({ attr, use, example }) => {
  console.log(`   ${attr}:`);
  console.log(`     Use: ${use}`);
  console.log(`     Example: ${example}`);
});

// ─── E: Live Regions ────────────────────────────────────────────
console.log("\nE: aria-live Regions:");
const liveRegions = [
  { value: "polite",     behavior: "Announced after current speech finishes", use: "Status updates, toast messages" },
  { value: "assertive",  behavior: "Interrupts current speech immediately",   use: "Error messages, critical alerts" },
  { value: "off",        behavior: "Not announced",                           use: "Default — updates ignored" },
];

liveRegions.forEach(({ value, behavior, use }) => {
  console.log(`   aria-live="${value}": ${behavior}`);
  console.log(`     Use for: ${use}`);
});

console.log("\n   Shorthand roles:");
console.log('   role="alert"  = aria-live="assertive" + aria-atomic="true"');
console.log('   role="status" = aria-live="polite" + aria-atomic="true"');

// ─── F: Common ARIA States ──────────────────────────────────────
console.log("\nF: Common ARIA States (dynamic):");
const states = [
  { attr: "aria-expanded",  values: "true/false",      widget: "Accordion, dropdown, tree" },
  { attr: "aria-selected",  values: "true/false",      widget: "Tab, listbox option" },
  { attr: "aria-checked",   values: "true/false/mixed", widget: "Checkbox, switch" },
  { attr: "aria-pressed",   values: "true/false/mixed", widget: "Toggle button" },
  { attr: "aria-hidden",    values: "true/false",      widget: "Decorative icons, hidden content" },
  { attr: "aria-disabled",  values: "true/false",      widget: "Non-interactive disabled state" },
  { attr: "aria-invalid",   values: "true/false",      widget: "Form validation error" },
  { attr: "aria-current",   values: "page/step/true",  widget: "Current page in nav, breadcrumb" },
];

states.forEach(({ attr, values, widget }) => {
  console.log(`   ${attr.padEnd(18)} [${values.padEnd(16)}] → ${widget}`);
});

// ─── G: aria-hidden Pitfalls ────────────────────────────────────
console.log("\nG: aria-hidden Dangers:");
console.log('   aria-hidden="true" removes element from accessibility tree');
console.log("   NEVER put on a focusable element (creates ghost focus)");
console.log("   NEVER put on a parent of focusable elements");
console.log("   Good: decorative icons, visual-only separators");
console.log("   Bad: hiding content you want some users to access");

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "First rule: don't use ARIA if native HTML   ║
 * ║ works. ARIA has roles (what it is), states (its condition),     ║
 * ║ and properties (extra info). aria-labelledby wins over          ║
 * ║ aria-label in name computation. aria-live='polite' for status   ║
 * ║ updates, 'assertive' for errors. Never put aria-hidden on      ║
 * ║ focusable elements."                                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/02-aria-attributes.js
 */
