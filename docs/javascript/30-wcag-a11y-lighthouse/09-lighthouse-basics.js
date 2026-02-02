/**
 * TOPIC: Lighthouse Basics — Scoring & Metrics
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Lighthouse scores 5 categories: Performance, Accessibility,    ║
 * ║  Best Practices, SEO, PWA. Each 0-100. Core Web Vitals =        ║
 * ║  LCP, CLS, INP. Run in CI/CD for regression testing.           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ Lighthouse is like a health check-up. Performance = cardio,    │
 * │ Accessibility = vision test, Best Practices = hygiene, SEO =   │
 * │ how easy you are to find, PWA = fitness level. Each test has  │
 * │ a score. 90+ = healthy, <50 = needs urgent care.              │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  Lighthouse Categories:                                        │
 * │  ┌──────────────────┬────────────────────────────────┐        │
 * │  │ Performance      │ LCP, CLS, TBT, FCP, Speed Index│        │
 * │  │ Accessibility    │ ARIA, contrast, labels, alt    │        │
 * │  │ Best Practices   │ HTTPS, errors, deprecated APIs │        │
 * │  │ SEO              │ meta tags, mobile, crawlable   │        │
 * │  │ PWA              │ manifest, service worker       │        │
 * │  └──────────────────┴────────────────────────────────┘        │
 * │                                                                │
 * │  Core Web Vitals (CWV):                                        │
 * │  LCP  → Largest Contentful Paint  (<2.5s good)                │
 * │  CLS  → Cumulative Layout Shift   (<0.1 good)                 │
 * │  INP  → Interaction to Next Paint (<200ms good)               │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Lighthouse Categories ───────────────────────────────────
console.log("A: Lighthouse 5 Categories:");

const categories = [
  { name: "Performance",    weight: "Varies by metric", keyMetrics: ["LCP", "TBT", "CLS", "FCP", "Speed Index"] },
  { name: "Accessibility",  weight: "Equal per audit",  keyMetrics: ["ARIA", "contrast", "labels", "alt text"] },
  { name: "Best Practices", weight: "Equal per audit",  keyMetrics: ["HTTPS", "no console errors", "image aspect ratio"] },
  { name: "SEO",            weight: "Equal per audit",  keyMetrics: ["meta description", "mobile-friendly", "robots.txt"] },
  { name: "PWA",            weight: "Equal per audit",  keyMetrics: ["manifest.json", "service worker", "installable"] },
];

categories.forEach(({ name, weight, keyMetrics }) => {
  console.log(`   ${name.padEnd(16)} → ${weight}`);
  console.log(`     Key: ${keyMetrics.join(", ")}`);
});

// ─── B: Scoring Algorithm ───────────────────────────────────────
console.log("\nB: Scoring Algorithm:");

const calculatePerformanceScore = (metrics) => {
  const weights = { LCP: 0.25, TBT: 0.30, CLS: 0.25, FCP: 0.10, SI: 0.10 };
  let totalScore = 0;

  Object.entries(metrics).forEach(([metric, value]) => {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      TBT: { good: 200, poor: 600 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      SI: { good: 3400, poor: 5800 },
    };

    const { good, poor } = thresholds[metric];
    let score = 100;

    if (value > poor) score = 0;
    else if (value > good) {
      score = Math.round(100 - ((value - good) / (poor - good)) * 100);
    }

    totalScore += score * weights[metric];
  });

  return Math.round(totalScore);
};

const sampleMetrics = { LCP: 2200, TBT: 250, CLS: 0.08, FCP: 1600, SI: 3200 };
console.log(`   Sample metrics: ${JSON.stringify(sampleMetrics)}`);
console.log(`   Performance Score: ${calculatePerformanceScore(sampleMetrics)}/100`);

// ─── C: Core Web Vitals ─────────────────────────────────────────
console.log("\nC: Core Web Vitals (CWV):");

const cwvThresholds = [
  { metric: "LCP", name: "Largest Contentful Paint", good: "<2.5s", needs: "2.5-4.0s", poor: ">4.0s", measures: "Loading" },
  { metric: "INP", name: "Interaction to Next Paint", good: "<200ms", needs: "200-500ms", poor: ">500ms", measures: "Interactivity" },
  { metric: "CLS", name: "Cumulative Layout Shift", good: "<0.1", needs: "0.1-0.25", poor: ">0.25", measures: "Visual Stability" },
];

cwvThresholds.forEach(({ metric, name, good, needs, poor, measures }) => {
  console.log(`   ${metric} — ${name}`);
  console.log(`     Good: ${good} | Needs Improvement: ${needs} | Poor: ${poor}`);
  console.log(`     Measures: ${measures}`);
});

console.log("\n   Deprecated (June 2024): FID replaced by INP");
console.log("   Field data (RUM) > Lab data (Lighthouse) for CWV");

// ─── D: Performance Metrics Deep Dive ───────────────────────────
console.log("\nD: Performance Metrics:");

const perfMetrics = [
  { metric: "FCP", name: "First Contentful Paint", desc: "When first text/image paints", target: "<1.8s" },
  { metric: "LCP", name: "Largest Contentful Paint", desc: "When largest element paints", target: "<2.5s" },
  { metric: "TBT", name: "Total Blocking Time", desc: "Sum of blocking time >50ms", target: "<200ms" },
  { metric: "CLS", name: "Cumulative Layout Shift", desc: "Visual stability score", target: "<0.1" },
  { metric: "SI", name: "Speed Index", desc: "How fast content is visually displayed", target: "<3.4s" },
  { metric: "TTI", name: "Time to Interactive", desc: "When page is fully interactive", target: "<3.8s" },
];

perfMetrics.forEach(({ metric, name, desc, target }) => {
  console.log(`   ${metric} — ${name}`);
  console.log(`     ${desc} | Target: ${target}`);
});

// ─── E: Running Lighthouse ──────────────────────────────────────
console.log("\nE: How to Run Lighthouse:");
console.log("   1. Chrome DevTools: F12 → Lighthouse tab → Generate report");
console.log("   2. CLI: npm i -g lighthouse && lighthouse https://example.com");
console.log("   3. CI/CD: lighthouse-ci (budget.json for thresholds)");
console.log("   4. PageSpeed Insights: https://pagespeed.web.dev (field + lab data)");
console.log("   5. Programmatic: @lighthouse/core npm package");

// ─── F: Lighthouse CI Example ───────────────────────────────────
console.log("\nF: Lighthouse CI Budget (lighthouserc.json):");

const lighthouserc = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: ["https://example.com"],
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
      },
    },
  },
};

console.log(JSON.stringify(lighthouserc, null, 2).split('\n').map(l => `   ${l}`).join('\n'));

// ─── G: Accessibility Audit Categories ──────────────────────────
console.log("\nG: Lighthouse Accessibility Audits:");

const a11yAudits = [
  "ARIA attributes valid",
  "Button has accessible name",
  "Color contrast sufficient",
  "Document has title",
  "Form elements have labels",
  "Image elements have alt",
  "Links have discernible names",
  "Lists contain only <li> elements",
  "Heading elements in sequentially-descending order",
  "lang attribute on <html>",
];

a11yAudits.forEach(audit => console.log(`   - ${audit}`));

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Lighthouse scores 5 categories: Performance ║
 * ║ (LCP, CLS, TBT, FCP, SI), Accessibility (ARIA, contrast,       ║
 * ║ labels), Best Practices (HTTPS, errors), SEO (meta, mobile),   ║
 * ║ PWA (manifest, SW). Core Web Vitals = LCP <2.5s, CLS <0.1,     ║
 * ║ INP <200ms. Run in CI with lighthouse-ci for budgets. Field    ║
 * ║ data (RUM) beats lab data for CWV accuracy."                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/09-lighthouse-basics.js
 */
