/**
 * TOPIC: WCAG 2.1/2.2 Overview — Principles, Levels & Law
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  WCAG = Web Content Accessibility Guidelines (W3C).             ║
 * ║  4 Principles: POUR — Perceivable, Operable, Understandable,   ║
 * ║  Robust. 3 Levels: A (minimum), AA (standard), AAA (ideal).    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ POUR is like building a restaurant:                            │
 * │ P - Perceivable: Customers can SEE the menu (braille too)     │
 * │ O - Operable: Doors open for wheelchairs (keyboard nav)       │
 * │ U - Understandable: Menu is in plain language                 │
 * │ R - Robust: Works with any assistive device                   │
 * │ Levels A/AA/AAA = Bronze / Silver / Gold compliance tiers     │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │           ┌─────┐                                              │
 * │           │ AAA │  ← Gold: ideal, not always required          │
 * │         ┌─┴─────┴─┐                                            │
 * │         │   AA    │  ← Silver: legal standard (most laws)      │
 * │       ┌─┴─────────┴─┐                                          │
 * │       │      A      │  ← Bronze: bare minimum                  │
 * │       └─────────────┘                                          │
 * │                                                                │
 * │  POUR cuts across ALL levels:                                  │
 * │  ┌────────────┬───────────┬──────────────┬────────┐           │
 * │  │ Perceivable│ Operable  │Understandable│ Robust │           │
 * │  └────────────┴───────────┴──────────────┴────────┘           │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: WCAG Criteria Database ─────────────────────────────────
const wcagCriteria = [
  { id: "1.1.1", name: "Non-text Content",        principle: "Perceivable",    level: "A",   desc: "All non-text content has a text alternative" },
  { id: "1.3.1", name: "Info and Relationships",  principle: "Perceivable",    level: "A",   desc: "Structure is programmatically determined" },
  { id: "1.4.3", name: "Contrast (Minimum)",      principle: "Perceivable",    level: "AA",  desc: "Text contrast ratio at least 4.5:1" },
  { id: "1.4.6", name: "Contrast (Enhanced)",     principle: "Perceivable",    level: "AAA", desc: "Text contrast ratio at least 7:1" },
  { id: "1.4.11",name: "Non-text Contrast",       principle: "Perceivable",    level: "AA",  desc: "UI components 3:1 contrast (WCAG 2.1)" },
  { id: "2.1.1", name: "Keyboard",                principle: "Operable",       level: "A",   desc: "All functionality from keyboard" },
  { id: "2.4.7", name: "Focus Visible",           principle: "Operable",       level: "AA",  desc: "Keyboard focus indicator visible" },
  { id: "2.5.8", name: "Target Size (Minimum)",   principle: "Operable",       level: "AA",  desc: "Targets 24x24 CSS pixels (WCAG 2.2)" },
  { id: "3.1.1", name: "Language of Page",        principle: "Understandable", level: "A",   desc: "Default language programmatically determined" },
  { id: "3.3.7", name: "Redundant Entry",         principle: "Understandable", level: "A",   desc: "No duplicate info requests (WCAG 2.2)" },
  { id: "4.1.2", name: "Name, Role, Value",       principle: "Robust",         level: "A",   desc: "UI components have accessible name/role" },
  { id: "4.1.3", name: "Status Messages",         principle: "Robust",         level: "AA",  desc: "Status messages via assistive tech" },
];

console.log("A: All WCAG Criteria:");
wcagCriteria.forEach(({ id, name, level }) => {
  console.log(`   ${id} [${level.padEnd(3)}] ${name}`);
});

// ─── B: Group by POUR Principle ────────────────────────────────
const grouped = wcagCriteria.reduce((acc, item) => {
  (acc[item.principle] = acc[item.principle] || []).push(item);
  return acc;
}, {});

console.log("\nB: Grouped by POUR:");
Object.entries(grouped).forEach(([principle, items]) => {
  console.log(`   ${principle}: ${items.length} criteria → [${items.map(i => i.id).join(", ")}]`);
});

// ─── C: Filter by Level ────────────────────────────────────────
console.log("\nC: By conformance level:");
["A", "AA", "AAA"].forEach(level => {
  const items = wcagCriteria.filter(c => c.level === level);
  console.log(`   Level ${level}: ${items.map(i => i.name).join(", ")}`);
});

// ─── D: WCAG Checker Class ─────────────────────────────────────
class WCAGChecker {
  constructor(targetLevel = "AA") {
    this.targetLevel = targetLevel;
    this.levelRank = { A: 1, AA: 2, AAA: 3 };
  }

  getApplicableCriteria = () => {
    const max = this.levelRank[this.targetLevel];
    return wcagCriteria.filter(c => this.levelRank[c.level] <= max);
  };

  checkImage = (el) => {
    const pass = Boolean(el.alt || el.ariaLabel);
    return { criterion: "1.1.1", pass, msg: pass ? "Has text alternative" : "Missing alt text" };
  };

  checkContrast = (fgHex, bgHex) => {
    const lum = (hex) => {
      const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
      const lin = rgb.map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
    };
    const [l1, l2] = [lum(fgHex), lum(bgHex)];
    const ratio = Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100;
    return { ratio, passAA: ratio >= 4.5, passAAA: ratio >= 7 };
  };

  checkKeyboard = (el) => {
    const focusable = ["button", "a", "input", "select", "textarea"];
    const pass = focusable.includes(el.tag) || el.tabindex >= 0;
    return { criterion: "2.1.1", pass, msg: pass ? "Keyboard accessible" : "NOT keyboard accessible" };
  };
}

const checker = new WCAGChecker("AA");
console.log("\nD: Applicable for AA:");
const applicable = checker.getApplicableCriteria();
console.log(`   ${applicable.length} criteria: ${applicable.map(c => c.id).join(", ")}`);

// ─── E: Run Checks ─────────────────────────────────────────────
console.log("\nE: Element checks:");
console.log(`   Image with alt:    ${JSON.stringify(checker.checkImage({ tag: "img", alt: "Logo", ariaLabel: null }))}`);
console.log(`   Image without alt: ${JSON.stringify(checker.checkImage({ tag: "img", alt: null, ariaLabel: null }))}`);
console.log(`   <div> no tabindex: ${JSON.stringify(checker.checkKeyboard({ tag: "div", tabindex: undefined }))}`);
console.log(`   <button>:          ${JSON.stringify(checker.checkKeyboard({ tag: "button", tabindex: 0 }))}`);

// ─── F: Contrast Checks ────────────────────────────────────────
console.log("\nF: Contrast ratios:");
[
  { fg: "#000000", bg: "#FFFFFF", label: "Black on White" },
  { fg: "#767676", bg: "#FFFFFF", label: "Gray on White " },
  { fg: "#FF0000", bg: "#00FF00", label: "Red on Green  " },
].forEach(({ fg, bg, label }) => {
  const { ratio, passAA, passAAA } = checker.checkContrast(fg, bg);
  console.log(`   ${label}: ratio=${ratio}:1 | AA=${passAA} | AAA=${passAAA}`);
});

// ─── G: Legal Requirements ──────────────────────────────────────
console.log("\nG: Legal landscape:");
[
  { law: "ADA (Americans with Disabilities Act)", region: "USA",    standard: "WCAG 2.1 AA" },
  { law: "Section 508",                           region: "USA",    standard: "WCAG 2.0 AA" },
  { law: "EAA (European Accessibility Act)",      region: "EU",     standard: "WCAG 2.1 AA" },
  { law: "AODA",                                  region: "Canada", standard: "WCAG 2.0 AA" },
].forEach(({ law, region, standard }) => {
  console.log(`   [${region.padEnd(7)}] ${law} → ${standard}`);
});

// ─── H: WCAG 2.2 New Criteria ───────────────────────────────────
console.log("\nH: New in WCAG 2.2:");
wcagCriteria
  .filter(c => c.desc.includes("2.2"))
  .forEach(c => console.log(`   ${c.id} ${c.name} (Level ${c.level}) — ${c.desc}`));

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "WCAG is the W3C's Web Content Accessibility ║
 * ║ Guidelines. Four principles: POUR (Perceivable, Operable,      ║
 * ║ Understandable, Robust). Three levels: A (minimum), AA         ║
 * ║ (standard — required by ADA/EAA), AAA (enhanced). WCAG 2.2     ║
 * ║ added Target Size and Redundant Entry. In practice we aim for  ║
 * ║ AA: 4.5:1 contrast, keyboard access, alt text, semantics."     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/00-wcag-overview.js
 */
