/**
 * TOPIC: Image Carousel — Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Carousel = Current Index + Direction + Timer  ║
 * ║  Infinite loop: (index + 1) % length. Pause on hover.      ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: A revolving door in a hotel lobby. It keeps turning  │
 * │  (auto-play). When a guest holds the door (hover), it stops. │
 * │  You can push it forward (next) or back (prev). Glass       │
 * │  panels = slides. Dots on the floor = indicators.           │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                             │
 * │                                             │
 * │     [<]  ┌─────────────┐  [>]              │
 * │          │  Slide N    │                    │
 * │          │  (image)    │                    │
 * │          └─────────────┘                    │
 * │           o  o  ●  o  o   <- dot indicators │
 * │                                             │
 * │  Auto-play: setInterval -> next()           │
 * │  Hover: clearInterval (pause)               │
 * │  Infinite: index = (i + 1) % len            │
 * │  Swipe: track touchStart/touchEnd delta     │
 * └─────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/08-carousel.js
 */

// ─── Slide data ──────────────────────────────────────────────
const SLIDES = [
  { id: 1, title: "Mountain Sunrise", src: "mountain.jpg" },
  { id: 2, title: "Ocean Waves",     src: "ocean.jpg" },
  { id: 3, title: "Forest Trail",    src: "forest.jpg" },
  { id: 4, title: "City Skyline",    src: "city.jpg" },
  { id: 5, title: "Desert Dunes",    src: "desert.jpg" },
];

// ─── Carousel State ──────────────────────────────────────────
function createCarousel(slides, autoPlayMs = 300) {
  return {
    slides,
    currentIndex: 0,
    autoPlayMs,
    timerId: null,
    paused: false,
    history: [], // track transitions for demo
  };
}

// ─── Navigation ──────────────────────────────────────────────
function next(c) {
  c.currentIndex = (c.currentIndex + 1) % c.slides.length;
  c.history.push({ action: "next", index: c.currentIndex });
  return c;
}

function prev(c) {
  c.currentIndex = (c.currentIndex - 1 + c.slides.length) % c.slides.length;
  c.history.push({ action: "prev", index: c.currentIndex });
  return c;
}

function goTo(c, index) {
  c.currentIndex = Math.max(0, Math.min(index, c.slides.length - 1));
  c.history.push({ action: "goTo", index: c.currentIndex });
  return c;
}

// ─── Dot indicators ─────────────────────────────────────────
function getDots(c) {
  return c.slides.map((_, i) => (i === c.currentIndex ? "●" : "○")).join("  ");
}

// ─── Swipe simulation ───────────────────────────────────────
function handleSwipe(c, startX, endX) {
  const delta = endX - startX;
  const threshold = 50;
  if (delta < -threshold) return next(c);   // swipe left -> next
  if (delta > threshold) return prev(c);    // swipe right -> prev
  return c;
}

// ─── Render ─────────────────────────────────────────────────
function render(c) {
  const slide = c.slides[c.currentIndex];
  return `  [<]  | ${slide.title.padEnd(18)} |  [>]\n        ${getDots(c)}`;
}

// ─── Auto-play simulation ────────────────────────────────────
function simulateAutoPlay(c, ticks) {
  const results = [];
  for (let i = 0; i < ticks; i++) {
    if (!c.paused) next(c);
    results.push({ tick: i + 1, index: c.currentIndex, paused: c.paused });
  }
  return results;
}

// ─── Simulation ──────────────────────────────────────────────
console.log("=== CAROUSEL SIMULATION ===\n");

let carousel = createCarousel(SLIDES);

// A: Initial render
console.log("A: Initial state");
console.log(render(carousel) + "\n");

// B: Next 3 times
console.log("B: Press Next 3 times");
next(carousel); next(carousel); next(carousel);
console.log(render(carousel) + "\n");

// C: Prev
console.log("C: Press Prev");
prev(carousel);
console.log(render(carousel) + "\n");

// D: Infinite loop — next from last
console.log("D: Infinite loop test — go to last, then next");
goTo(carousel, 4);
console.log(`   At last: ${carousel.slides[carousel.currentIndex].title}`);
next(carousel);
console.log(`   After next: ${carousel.slides[carousel.currentIndex].title} (wrapped!)\n`);

// E: Dot click (goTo)
console.log("E: Click dot 3 (index 2)");
goTo(carousel, 2);
console.log(render(carousel) + "\n");

// F: Auto-play simulation
console.log("F: Auto-play for 6 ticks");
goTo(carousel, 0);
carousel.paused = false;
const ticks = simulateAutoPlay(carousel, 6);
ticks.forEach((t) => {
  const name = carousel.slides[t.index].title;
  console.log(`   Tick ${t.tick}: index=${t.index} -> ${name}`);
});
console.log();

// G: Pause on hover
console.log("G: Pause on hover simulation");
carousel.paused = true;
const pausedTicks = simulateAutoPlay(carousel, 3);
console.log(`   3 ticks while paused — index stayed: ${carousel.currentIndex}`);
carousel.paused = false;
next(carousel);
console.log(`   Resumed — after next: ${carousel.currentIndex}\n`);

// H: Swipe simulation
console.log("H: Swipe gestures");
goTo(carousel, 2);
handleSwipe(carousel, 300, 100); // swipe left = next
console.log(`   Swipe left  (300->100): index=${carousel.currentIndex}`);
handleSwipe(carousel, 100, 300); // swipe right = prev
console.log(`   Swipe right (100->300): index=${carousel.currentIndex}`);
handleSwipe(carousel, 200, 180); // too small, no change
console.log(`   Small swipe (200->180): index=${carousel.currentIndex} (no change)\n`);

// I: Transition history
console.log("I: Transition history (last 5)");
carousel.history.slice(-5).forEach((h) => {
  console.log(`   ${h.action} -> index ${h.index}`);
});
console.log();

// ─── Follow-up Questions ─────────────────────────────────────
console.log("=== FOLLOW-UP QUESTIONS ===");
console.log("1. How to add CSS transition/animation between slides?");
console.log("2. How to support variable-width slides?");
console.log("3. How to lazy-load images not currently visible?");
console.log("4. How to make it accessible (aria-live, keyboard)?");
console.log("5. How to add drag-to-scroll on desktop?");

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER                                           ║
 * ║                                                             ║
 * ║  Carousel state: currentIndex, slides array, timerId.       ║
 * ║  Infinite loop via modulo: (i + 1) % length. Auto-play:    ║
 * ║  setInterval calling next(). Pause: clearInterval on        ║
 * ║  mouseenter, restart on mouseleave. Swipe: track            ║
 * ║  touchstart/touchend X delta, threshold ~50px.              ║
 * ║  Dots: map slides to active/inactive indicator.             ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
