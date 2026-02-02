/**
 * TOPIC: Images & Media Accessibility
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Informative images: describe the content.                       ║
 * ║  Decorative images: alt="" (empty, not missing).                ║
 * ║  Complex images: provide long description elsewhere.            ║
 * ║  Video: captions (deaf) + audio description (blind).            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ A blind person asks "What's in the photo?" You wouldn't        │
 * │ describe a decorative border — you'd say "just decoration."    │
 * │ For a chart, you wouldn't say "lines and bars" — you'd         │
 * │ explain the trend. For a video, you'd narrate what's shown.   │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  Alt Text Decision Tree:                                       │
 * │                                                                │
 * │  Is it decorative? ──YES──> alt=""                           │
 * │        │                                                       │
 * │       NO                                                       │
 * │        │                                                       │
 * │  Is it complex? ──YES──> alt="summary" + longdesc/aria-desc  │
 * │        │                                                       │
 * │       NO                                                       │
 * │        │                                                       │
 * │  Describe content ──> alt="meaningful description"           │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Alt Text Decision Tree ──────────────────────────────────
console.log("A: Alt Text Decision Logic:");

const determineAltText = (image) => {
  if (image.isDecorative) {
    return { alt: '""', longdesc: null, reason: "Decorative → empty alt, no description" };
  }
  if (image.isLink) {
    return { alt: image.linkDestination, longdesc: null, reason: "Link image → describe destination" };
  }
  if (image.isComplex) {
    return { alt: image.summary, longdesc: image.fullDescription, reason: "Complex → summary in alt + full description elsewhere" };
  }
  if (image.hasTextInImage) {
    return { alt: image.text, longdesc: null, reason: "Text in image → alt must contain that text" };
  }
  return { alt: image.content, longdesc: null, reason: "Informative → describe what's shown" };
};

const images = [
  { name: "Border decoration", isDecorative: true },
  { name: "Logo clicking home", isLink: true, linkDestination: "Go to homepage" },
  { name: "Sales chart", isComplex: true, summary: "Q4 sales chart", fullDescription: "Sales increased 25% from Q3 to Q4, with peak in December at $2.1M" },
  { name: "Button with 'Submit'", hasTextInImage: true, text: "Submit" },
  { name: "Team photo", content: "Engineering team at 2024 offsite in Seattle" },
];

images.forEach(img => {
  const { alt, longdesc, reason } = determineAltText(img);
  console.log(`   ${img.name}:`);
  console.log(`     alt="${alt}"`);
  if (longdesc) console.log(`     longdesc: "${longdesc}"`);
  console.log(`     Reason: ${reason}`);
});

// ─── B: CSS Background Images ───────────────────────────────────
console.log("\nB: CSS Background Images:");
console.log("   Problem: CSS backgrounds have NO alt text");
console.log("   If decorative: OK (borders, gradients)");
console.log("   If informative: BAD — must use <img> instead");
console.log("   Exception: Use role='img' + aria-label for icons:");
console.log('   <div role="img" aria-label="Warning" class="icon-warning"></div>');

// ─── C: SVG Accessibility ───────────────────────────────────────
console.log("\nC: SVG Accessibility:");
console.log('   Inline SVG decorative:');
console.log('   <svg aria-hidden="true"><path.../></svg>');
console.log('');
console.log('   Inline SVG informative:');
console.log('   <svg role="img" aria-labelledby="title1">');
console.log('     <title id="title1">Company logo</title>');
console.log('     <path.../></svg>');
console.log('');
console.log('   SVG as <img>:');
console.log('   <img src="chart.svg" alt="Sales chart showing 25% growth">');

// ─── D: Video Captions & Transcripts ────────────────────────────
console.log("\nD: Video Accessibility:");
console.log("   WCAG Requirements:");
console.log("   1.2.2 (A)  → Captions for prerecorded video (for deaf)");
console.log("   1.2.3 (A)  → Audio description OR transcript (for blind)");
console.log("   1.2.5 (AA) → Audio description for prerecorded video (for blind)");
console.log("");
console.log("   <video controls>");
console.log('     <source src="video.mp4">');
console.log('     <track kind="captions" src="captions.vtt" srclang="en" label="English">');
console.log('     <track kind="descriptions" src="audio-desc.vtt">');
console.log("   </video>");

// ─── E: WebVTT Caption Format ────────────────────────────────────
console.log("\nE: WebVTT Caption Example:");
const vttContent = `WEBVTT

00:00:00.000 --> 00:00:03.000
Welcome to our product demo.

00:00:03.500 --> 00:00:07.000
[upbeat music playing]

00:00:07.500 --> 00:00:12.000
Click the dashboard to see your analytics.`;

console.log(vttContent.split('\n').map(line => `   ${line}`).join('\n'));
console.log("\n   Key: [sound effects], (speaker: name), proper punctuation");

// ─── F: Audio Descriptions ──────────────────────────────────────
console.log("\nF: Audio Descriptions:");
console.log("   What they are: Narrator describes visual-only content");
console.log("   When needed: Graphs, text on screen, visual actions");
console.log("   Example: 'John walks to the whiteboard and writes MERGE'");
console.log("   Not needed for: Dialog-only scenes, music videos");
console.log("   Implementation:");
console.log("     - Separate audio track");
console.log("     - Extended audio (pauses video for descriptions)");
console.log("     - Text transcript as fallback");

// ─── G: Image Type Validator ────────────────────────────────────
console.log("\nG: Image Type Validator:");

const validateImageAccessibility = (img) => {
  const errors = [];
  const warnings = [];

  if (img.alt === undefined) {
    errors.push("Missing alt attribute entirely");
  } else if (img.alt === "" && !img.isDecorative) {
    warnings.push("Empty alt on potentially informative image");
  } else if (img.alt !== "" && img.isDecorative) {
    warnings.push("Decorative image has non-empty alt");
  }

  if (img.isComplex && (!img.longDescription && !img.ariaDescribedby)) {
    warnings.push("Complex image missing long description");
  }

  if (img.hasTextInImage && !img.alt?.includes(img.textContent)) {
    errors.push("Text in image not reflected in alt text");
  }

  return { errors, warnings, passes: errors.length === 0 };
};

const testImages = [
  { name: "Logo", alt: "ACME Corp", isDecorative: false },
  { name: "Divider", alt: "", isDecorative: true },
  { name: "Chart", alt: "Sales chart", isComplex: true, longDescription: "Full data..." },
  { name: "Icon button", hasTextInImage: true, textContent: "Save", alt: "Submit" },
  { name: "Photo" }, // Missing alt
];

testImages.forEach(img => {
  const result = validateImageAccessibility(img);
  console.log(`   ${img.name}: ${result.passes ? "PASS" : "FAIL"}`);
  if (result.errors.length) console.log(`     Errors: ${result.errors.join(", ")}`);
  if (result.warnings.length) console.log(`     Warnings: ${result.warnings.join(", ")}`);
});

// ─── H: Alt Text Anti-Patterns ──────────────────────────────────
console.log("\nH: Alt Text Anti-Patterns (DON'T DO THIS):");
const antiPatterns = [
  { bad: 'alt="image of"', why: "Screen reader already says 'image'" },
  { bad: 'alt="photo"', why: "Not descriptive" },
  { bad: 'alt="IMG_1234.jpg"', why: "Filename is meaningless" },
  { bad: 'alt="Click here"', why: "Doesn\'t describe image content" },
  { bad: 'Long essay in alt', why: "Use longdesc/aria-describedby for >150 chars" },
];

antiPatterns.forEach(({ bad, why }) => {
  console.log(`   ${bad}`);
  console.log(`     Why bad: ${why}`);
});

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Decorative images get alt='', informative   ║
 * ║ images describe content, complex images get summary + long      ║
 * ║ description. CSS backgrounds can't have alt text — use <img>    ║
 * ║ for informative content. Video needs captions (WCAG 1.2.2) and ║
 * ║ audio descriptions (1.2.5 AA). Never say 'image of' in alt —   ║
 * ║ screen readers already announce it's an image."                 ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/07-images-media.js
 */
