/**
 * TOPIC: Responsive Design & Accessibility
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Content must work at 200% zoom without horizontal scroll.      ║
 * ║  Content must reflow at 320px width (400% zoom equivalent).     ║
 * ║  Touch targets must be at least 44x44 CSS pixels.               ║
 * ║  Never lock orientation. Use relative units for text.           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ A library should work whether you hold the book close (zoom)   │
 * │ or far (normal). If you have to tilt your head sideways        │
 * │ (horizontal scroll), the book is broken. If the buttons are    │
 * │ too small to press, it's unusable for shaky hands.             │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  WCAG Responsive Criteria:                                     │
 * │  1.4.4  (AA)  → 200% zoom, no horizontal scroll                │
 * │  1.4.10 (AA)  → 400% reflow to 320px, no 2D scroll            │
 * │  1.4.12 (AA)  → Text spacing overridable without breaking      │
 * │  2.5.5  (AAA) → Touch targets 44x44 CSS pixels                │
 * │  1.3.4  (AA)  → Don't lock orientation                        │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: 200% Zoom Validator (WCAG 1.4.4) ────────────────────────
console.log("A: 200% Zoom Test:");

const validateZoom = (viewport, contentWidth) =>
  [100, 150, 200].map(zoom => ({
    zoom: `${zoom}%`,
    effectiveWidth: viewport / (zoom / 100),
    hasHorizontalScroll: contentWidth > viewport / (zoom / 100),
  }));

const zoomResults = validateZoom(1280, 900);
zoomResults.forEach(r => {
  console.log(`   Zoom ${r.zoom} → effective: ${r.effectiveWidth.toFixed(0)}px | h-scroll: ${r.hasHorizontalScroll ? "FAIL" : "PASS"}`);
});

// ─── B: 320px Reflow (WCAG 1.4.10) ──────────────────────────────
console.log("\nB: 320px Reflow (400% zoom equivalent):");

const REFLOW_WIDTH = 320;
const pageElements = [
  { name: "nav-menu", minWidth: 280 },
  { name: "data-table", minWidth: 500 },
  { name: "hero-text", minWidth: 300 },
  { name: "sidebar", minWidth: 350 },
];

pageElements.forEach(el => {
  const passes = el.minWidth <= REFLOW_WIDTH;
  console.log(`   ${el.name.padEnd(12)} (min ${el.minWidth}px) → ${passes ? "PASS" : "FAIL"}`);
});

console.log("   Exception: Data tables can horizontal scroll if responsive view provided");

// ─── C: Touch Target Size (WCAG 2.5.5) ──────────────────────────
console.log("\nC: Touch Target Validation (44x44px minimum):");

const MIN_TOUCH = 44;
const targets = [
  { name: "submit-btn", width: 120, height: 48 },
  { name: "close-icon", width: 24, height: 24 },
  { name: "nav-link", width: 80, height: 44 },
  { name: "checkbox", width: 16, height: 16 },
  { name: "menu-item", width: 200, height: 50 },
];

targets.forEach(({ name, width, height }) => {
  const passes = width >= MIN_TOUCH && height >= MIN_TOUCH;
  console.log(`   ${name.padEnd(12)} (${width}x${height}) → ${passes ? "PASS" : "FAIL"}`);
});

console.log("   Note: WCAG 2.2 updated to 24x24 minimum (2.5.8 AA)");

// ─── D: Orientation Lock Check (WCAG 1.3.4) ─────────────────────
console.log("\nD: Orientation Lock:");

const pages = [
  { name: "Home", locksOrientation: false },
  { name: "Video Player", locksOrientation: true, requiredOrientation: "landscape" },
  { name: "Form", locksOrientation: false },
];

pages.forEach(page => {
  const passes = !page.locksOrientation;
  console.log(`   ${page.name.padEnd(14)} → ${passes ? "PASS" : "FAIL"} ${page.requiredOrientation ? `(locked to ${page.requiredOrientation})` : ""}`);
});

console.log("   Exception: Only lock if essential (piano app, check deposit)");

// ─── E: Responsive Unit Checker ─────────────────────────────────
console.log("\nE: Responsive Units (use relative, not fixed px):");

const relativeUnits = ["em", "rem", "%", "vw", "vh", "ch"];
const styles = [
  { property: "font-size", value: "16px" },
  { property: "font-size", value: "1rem" },
  { property: "padding", value: "2em" },
  { property: "width", value: "300px" },
  { property: "max-width", value: "90%" },
];

styles.forEach(({ property, value }) => {
  const isRelative = relativeUnits.some(u => value.endsWith(u));
  console.log(`   ${property}: ${value} → ${isRelative ? "PASS" : "WARN"} ${isRelative ? "(relative)" : "(fixed)"}`);
});

// ─── F: Text Spacing (WCAG 1.4.12) ──────────────────────────────
console.log("\nF: Text Spacing Requirements:");

const spacingReqs = {
  lineHeight: 1.5,
  letterSpacing: 0.12,
  wordSpacing: 0.16,
  paragraphSpacing: 2.0,
};

const currentSpacing = {
  lineHeight: 1.6,
  letterSpacing: 0.1,
  wordSpacing: 0.2,
  paragraphSpacing: 1.5,
};

Object.entries(spacingReqs).forEach(([prop, minVal]) => {
  const actual = currentSpacing[prop] || 0;
  const passes = actual >= minVal;
  console.log(`   ${prop.padEnd(18)} → required: ${minVal}, actual: ${actual} → ${passes ? "PASS" : "FAIL"}`);
});

console.log("   Must tolerate user overrides without breaking layout");

// ─── G: Responsive A11y Audit Summary ───────────────────────────
console.log("\nG: Responsive A11y Audit:");

const allChecks = [
  { rule: "1.4.4 Zoom 200%", pass: !zoomResults.find(r => r.zoom === "200%").hasHorizontalScroll },
  { rule: "1.4.10 Reflow", pass: pageElements.every(e => e.minWidth <= REFLOW_WIDTH) },
  { rule: "2.5.5 Touch Targets", pass: targets.every(t => t.width >= MIN_TOUCH && t.height >= MIN_TOUCH) },
  { rule: "1.3.4 Orientation", pass: pages.every(p => !p.locksOrientation) },
  { rule: "1.4.12 Text Spacing", pass: Object.entries(spacingReqs).every(([k, v]) => (currentSpacing[k] || 0) >= v) },
];

allChecks.forEach(({ rule, pass }) => {
  console.log(`   ${rule.padEnd(25)} → ${pass ? "PASS ✓" : "FAIL ✗"}`);
});

const passCount = allChecks.filter(c => c.pass).length;
console.log(`\n   Score: ${passCount}/${allChecks.length} passed`);

// ─── H: Best Practices ──────────────────────────────────────────
console.log("\nH: Responsive A11y Best Practices:");
console.log("   - Use viewport meta tag: <meta name='viewport' content='width=device-width, initial-scale=1'>");
console.log("   - Use relative units (rem, em) for font-size");
console.log("   - Use CSS Grid/Flexbox (auto-reflows)");
console.log("   - Test with actual zoom + real screen readers");
console.log("   - Avoid fixed positioning that overlaps content");
console.log("   - Ensure focus indicators scale with zoom");

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Responsive a11y means content works at 200% ║
 * ║ zoom without horizontal scroll (1.4.4), reflows at 320px for   ║
 * ║ 400% zoom (1.4.10), touch targets 44x44px (2.5.5), orientation ║
 * ║ not locked (1.3.4), and text spacing overridable (1.4.12). Use ║
 * ║ relative units, flexible layouts, and test with real zoom."    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/08-responsive-a11y.js
 */
