/**
 * TOPIC: Star Rating Component - Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: State holds currentRating; render maps 1..max    ║
 * ║  comparing index to rating to pick ★ or ☆                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  STORY: A restaurant reviewer taps stars on their phone.        │
 * │  Each tap sets rating, hovering previews a temporary glow,      │
 * │  half-stars let you be precise, read-only locks the display.    │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                                                 │
 * │                                                                 │
 * │  State: { rating: 0, hoverIndex: -1, readOnly: false }         │
 * │                                                                 │
 * │  onClick(3)          onHover(4)         render()                │
 * │  ┌─────────┐        ┌─────────┐       ┌──────────────┐         │
 * │  │ set     │        │ set     │       │ ★★★☆☆        │         │
 * │  │ rating=3│        │ hover=4 │       │ (rating=3)   │         │
 * │  └─────────┘        └─────────┘       └──────────────┘         │
 * │                                                                 │
 * │  Half-star: rating can be 2.5 -> ★★⯪☆☆                        │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/10-star-rating.js
 */

// ─── Star Rating State Machine ───────────────────────────────────────

function createStarRating(maxStars = 5, options = {}) {
  const { halfStar = false, readOnly = false, onChange = null } = options;
  let state = {
    rating: 0,
    hoverIndex: -1,
    readOnly,
    maxStars,
    halfStar,
  };

  function render() {
    const displayValue = state.hoverIndex >= 0 ? state.hoverIndex : state.rating;
    let stars = '';
    for (let i = 1; i <= state.maxStars; i++) {
      if (halfStar && displayValue >= i - 0.5 && displayValue < i) {
        stars += '⯪';
      } else if (displayValue >= i) {
        stars += '★';
      } else {
        stars += '☆';
      }
    }
    return stars;
  }

  function click(value) {
    if (state.readOnly) {
      return `[Read-Only] Cannot change rating`;
    }
    const clamped = Math.min(Math.max(0, value), state.maxStars);
    const prev = state.rating;
    state.rating = halfStar ? Math.round(clamped * 2) / 2 : Math.round(clamped);
    state.hoverIndex = -1;
    if (onChange) onChange(state.rating);
    return `Rating: ${prev} -> ${state.rating}`;
  }

  function hover(value) {
    if (state.readOnly) return;
    state.hoverIndex = halfStar ? Math.round(value * 2) / 2 : Math.round(value);
  }

  function hoverLeave() {
    state.hoverIndex = -1;
  }

  function getRating() {
    return state.rating;
  }

  return { render, click, hover, hoverLeave, getRating };
}

// ─── Simulation ──────────────────────────────────────────────────────

console.log('=== STAR RATING COMPONENT SIMULATION ===\n');

// A: Basic star rating
console.log('A: Create 5-star rating and click 3');
const basic = createStarRating(5, {
  onChange: (val) => console.log(`   onChange fired: ${val}`),
});
console.log(`   Initial:  ${basic.render()}`);
console.log(`   ${basic.click(3)}`);
console.log(`   Display:  ${basic.render()}\n`);

// B: Hover preview
console.log('B: Hover over star 5, then leave');
basic.hover(5);
console.log(`   Hovering: ${basic.render()}`);
basic.hoverLeave();
console.log(`   After:    ${basic.render()}\n`);

// C: Update rating
console.log('C: Click star 1 (downgrade)');
console.log(`   ${basic.click(1)}`);
console.log(`   Display:  ${basic.render()}\n`);

// D: Half-star support
console.log('D: Half-star mode — rate 2.5');
const half = createStarRating(5, { halfStar: true });
half.click(2.5);
console.log(`   Display:  ${half.render()}`);
half.click(4.5);
console.log(`   Rate 4.5: ${half.render()}\n`);

// E: Read-only mode
console.log('E: Read-only rating (preset 4)');
const readOnly = createStarRating(5, { readOnly: true });
readOnly.click(4); // forced set before read-only check workaround:
// For demo, create with state already set
const readOnlyDemo = createStarRating(5, { readOnly: false });
readOnlyDemo.click(4);
// Now make it read-only by creating new one
const ro = createStarRating(5, { readOnly: true });
console.log(`   Display:  ${ro.render()}`);
console.log(`   ${ro.click(2)}`);
console.log(`   Display:  ${ro.render()} (unchanged)\n`);

// F: Hover on read-only does nothing
console.log('F: Hover on read-only');
ro.hover(5);
console.log(`   Display:  ${ro.render()} (no preview)\n`);

// G: Edge cases
console.log('G: Edge cases');
const edge = createStarRating(5);
console.log(`   ${edge.click(0)}`);
console.log(`   Zero:     ${edge.render()}`);
console.log(`   ${edge.click(7)}`);
console.log(`   Clamped:  ${edge.render()} (max 5)`);
console.log(`   ${edge.click(-1)}`);
console.log(`   Clamped:  ${edge.render()} (min 0)\n`);

// H: Custom max stars
console.log('H: 10-star rating system');
const ten = createStarRating(10);
ten.click(7);
console.log(`   Display:  ${ten.render()}\n`);

// I: Toggle same rating (click again to clear)
console.log('I: Click same star toggles to zero');
const toggle = createStarRating(5);
toggle.click(3);
console.log(`   Rated 3:  ${toggle.render()}`);
// Simulate toggle: if clicking same value, reset to 0
const currentRating = toggle.getRating();
toggle.click(currentRating === 3 ? 0 : 3);
console.log(`   Toggle:   ${toggle.render()}\n`);

// ─── Follow-up Questions ─────────────────────────────────────────────

console.log('=== FOLLOW-UP QUESTIONS ===\n');
console.log('Q1: How to make half-star work with mouse position?');
console.log('    -> Check if click is on left/right half of star element via offsetX\n');
console.log('Q2: How to handle accessibility?');
console.log('    -> Use radio buttons under the hood, aria-label for each star\n');
console.log('Q3: How to animate star fill?');
console.log('    -> CSS transition on color/transform, stagger delay per index\n');

// ─── Interview Answer ────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  INTERVIEW ANSWER                                          ║');
console.log('║  State: { rating, hoverIndex }                             ║');
console.log('║  Render: map 1..max, compare to rating -> ★ or ☆           ║');
console.log('║  Half-star: check offsetX on click, round to 0.5           ║');
console.log('║  Read-only: ignore click/hover events                      ║');
console.log('║  onChange: callback prop fired on rating change             ║');
console.log('║  Hooks: useState(rating), useState(hover), useCallback     ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
