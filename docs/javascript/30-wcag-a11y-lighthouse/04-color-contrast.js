/**
 * TOPIC: WCAG Color Contrast Ratios
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  AA Normal Text: 4.5:1 | AA Large Text: 3:1 | AAA: 7:1        ║
 * ║  Never rely on color alone to convey meaning.                   ║
 * ║  Contrast = (L1 + 0.05) / (L2 + 0.05) where L = luminance.   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ Movie theater marquee: small text (showtimes) needs HIGH       │
 * │ contrast (4.5:1). Big text (movie title) needs LESS (3:1).    │
 * │ Premium theater (AAA) demands BEST contrast (7:1) for all.    │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  1:1 ──── 3:1 ──── 4.5:1 ──── 7:1 ──── 21:1                 │
 * │   │        │         │          │         │                    │
 * │  FAIL   AA Large   AA Normal   AAA     Perfect                │
 * │  (same)  (>=18pt)  (<18pt)   (all)   (B on W)                │
 * │                                                                │
 * │  Luminance: L = 0.2126R + 0.7152G + 0.0722B                  │
 * │  Ratio: (L_lighter + 0.05) / (L_darker + 0.05)               │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Hex to RGB ──────────────────────────────────────────────
const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
};

console.log("A: Hex to RGB:");
console.log(`   #FFFFFF =>`, hexToRgb("#FFFFFF"));
console.log(`   #000000 =>`, hexToRgb("#000000"));
console.log(`   #3366CC =>`, hexToRgb("#3366CC"));

// ─── B: Relative Luminance ──────────────────────────────────────
const linearize = (channel) => {
  const sRGB = channel / 255;
  return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
};

console.log("\nB: Relative Luminance (0=black, 1=white):");
["#FFFFFF", "#000000", "#808080", "#0000FF"].forEach(hex => {
  console.log(`   ${hex}: ${luminance(hex).toFixed(4)}`);
});

// ─── C: Contrast Ratio Calculation ──────────────────────────────
const contrastRatio = (hex1, hex2) => {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

console.log("\nC: Contrast Ratios:");
[
  ["#FFFFFF", "#000000", "White on Black"],
  ["#FFFFFF", "#767676", "White on Gray (AA boundary)"],
  ["#FFFFFF", "#0000FF", "White on Blue"],
  ["#FFFF00", "#FFFFFF", "Yellow on White (bad!)"],
  ["#000000", "#333333", "Black on Dark Gray"],
].forEach(([fg, bg, label]) => {
  console.log(`   ${label}: ${contrastRatio(fg, bg).toFixed(2)}:1`);
});

// ─── D: Compliance Checker ──────────────────────────────────────
const checkCompliance = (fg, bg) => {
  const ratio = contrastRatio(fg, bg);
  return {
    ratio: `${ratio.toFixed(2)}:1`,
    aa_normal: ratio >= 4.5,
    aa_large: ratio >= 3.0,
    aaa_normal: ratio >= 7.0,
    aaa_large: ratio >= 4.5,
  };
};

console.log("\nD: WCAG Compliance:");
[["#000000", "#FFFFFF"], ["#767676", "#FFFFFF"], ["#888888", "#FFFFFF"], ["#FF0000", "#FFFFFF"]].forEach(([fg, bg]) => {
  const r = checkCompliance(fg, bg);
  console.log(`   ${fg} on ${bg}: ${r.ratio} | AA=${r.aa_normal ? "PASS" : "FAIL"} | AAA=${r.aaa_normal ? "PASS" : "FAIL"}`);
});

// ─── E: Color Blindness Types ───────────────────────────────────
console.log("\nE: Color Blindness Types:");
[
  { type: "Protanopia",    affected: "Red",   prevalence: "1.3% males", desc: "Red appears dark/black" },
  { type: "Deuteranopia",  affected: "Green", prevalence: "1.2% males", desc: "Green/red confusion" },
  { type: "Tritanopia",    affected: "Blue",  prevalence: "0.001%",     desc: "Blue/yellow confusion" },
  { type: "Achromatopsia", affected: "All",   prevalence: "0.003%",     desc: "Grayscale only" },
].forEach(({ type, affected, prevalence, desc }) => {
  console.log(`   ${type} (${affected}) — ${prevalence} — ${desc}`);
});

// ─── F: Problematic Combos ──────────────────────────────────────
console.log("\nF: Dangerous Color Combos:");
[
  { combo: "Red + Green",   fix: "Add icons/patterns alongside color" },
  { combo: "Green + Brown", fix: "Use different shapes or labels" },
  { combo: "Blue + Purple", fix: "Add text labels or underlines" },
  { combo: "Red + Black",   fix: "Use brighter red or add borders" },
].forEach(({ combo, fix }) => {
  console.log(`   ${combo} → Fix: ${fix}`);
});

// ─── G: Design System Audit ─────────────────────────────────────
console.log("\nG: Design Token Audit:");
const tokens = { primary: "#1A73E8", secondary: "#5F6368", error: "#D93025", success: "#188038", warning: "#F9AB00" };
const bg = "#FFFFFF";

Object.entries(tokens).forEach(([name, color]) => {
  const r = checkCompliance(color, bg);
  console.log(`   ${name} (${color}) on white: ${r.ratio} [AA: ${r.aa_normal ? "PASS" : "FAIL"}]`);
});

// ─── H: Tools ───────────────────────────────────────────────────
console.log("\nH: Contrast Testing Tools:");
["axe DevTools (Browser Extension)", "Lighthouse (Chrome Built-in)", "WebAIM Contrast Checker (Web)", "Stark (Figma/Sketch Plugin)", "WAVE (Browser Extension)"]
  .forEach(t => console.log(`   ${t}`));

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "WCAG contrast: 4.5:1 for normal AA text,   ║
 * ║ 3:1 for large text, 7:1 for AAA. Calculated from relative     ║
 * ║ luminance: (L1+0.05)/(L2+0.05). Never rely on color alone —   ║
 * ║ use icons, patterns, or text as redundant cues. 8% of men     ║
 * ║ have color blindness. Tools: axe, Lighthouse, WebAIM."         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/04-color-contrast.js
 */
