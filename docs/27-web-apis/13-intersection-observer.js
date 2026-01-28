/**
 * WEB APIS: 13 - Intersection Observer
 *
 * ONE CONCEPT: Efficiently detect when elements enter/exit the viewport
 */


// =============================================================================
// WHAT IS INTERSECTION OBSERVER?
// =============================================================================

/**
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  THE PROBLEM: Scroll Event Listener                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // OLD WAY - Bad for performance!                                   │
 *   │  window.addEventListener('scroll', () => {                           │
 *   │    images.forEach(img => {                                           │
 *   │      const rect = img.getBoundingClientRect();  // Forces reflow!    │
 *   │      if (rect.top < window.innerHeight) {                            │
 *   │        loadImage(img);                                               │
 *   │      }                                                               │
 *   │    });                                                               │
 *   │  });                                                                 │
 *   │                                                                      │
 *   │  Problems:                                                           │
 *   │  • Fires 100s of times during scroll                                 │
 *   │  • getBoundingClientRect causes layout thrashing                     │
 *   │  • Blocks main thread                                                │
 *   │                                                                      │
 *   │                                                                      │
 *   │  THE SOLUTION: Intersection Observer                                 │
 *   │  ─────────────────────────────────────                               │
 *   │                                                                      │
 *   │  • Async - doesn't block main thread                                 │
 *   │  • Only fires when visibility CHANGES                                │
 *   │  • Browser optimized                                                 │
 *   │  • No layout thrashing                                               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC USAGE
// =============================================================================

console.log('=== Intersection Observer API ===\n');

const basicUsage = `
// ═══════════════════════════════════════════════════════════════════════
// CREATING AN OBSERVER
// ═══════════════════════════════════════════════════════════════════════

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible:', entry.target);
    } else {
      console.log('Element is hidden:', entry.target);
    }
  });
}, {
  root: null,          // Viewport (null = browser viewport)
  rootMargin: '0px',   // Margin around root (like CSS margin)
  threshold: 0         // 0 = any visibility, 1 = fully visible
});


// ═══════════════════════════════════════════════════════════════════════
// OBSERVING ELEMENTS
// ═══════════════════════════════════════════════════════════════════════

// Start observing
const element = document.querySelector('.target');
observer.observe(element);

// Stop observing
observer.unobserve(element);

// Stop all observations
observer.disconnect();


// ═══════════════════════════════════════════════════════════════════════
// ENTRY OBJECT PROPERTIES
// ═══════════════════════════════════════════════════════════════════════

entries.forEach(entry => {
  entry.target              // The observed element
  entry.isIntersecting      // Is it visible? (boolean)
  entry.intersectionRatio   // How much is visible (0 to 1)
  entry.boundingClientRect  // Element's position
  entry.rootBounds          // Root element's position
  entry.time                // Timestamp
});
`;

console.log(basicUsage);


// =============================================================================
// REAL-WORLD EXAMPLES
// =============================================================================

console.log('\n=== Real-World Examples ===\n');

const realWorldExamples = `
// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Lazy Loading Images (Most Common!)
// ═══════════════════════════════════════════════════════════════════════

function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;  // Load the image
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);  // Stop observing after load
      }
    });
  }, {
    rootMargin: '50px'  // Start loading 50px before visible
  });

  images.forEach(img => imageObserver.observe(img));
}

// HTML: <img data-src="photo.jpg" alt="Lazy image">


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Infinite Scroll
// ═══════════════════════════════════════════════════════════════════════

function setupInfiniteScroll() {
  const sentinel = document.querySelector('#load-more-trigger');

  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      const nextPage = await fetchNextPage();
      appendItems(nextPage);
    }
  });

  observer.observe(sentinel);
}

// HTML: <div id="items">...</div>
//       <div id="load-more-trigger"></div>  <!-- Hidden trigger -->


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Animate on Scroll
// ═══════════════════════════════════════════════════════════════════════

function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);  // Only animate once
      }
    });
  }, {
    threshold: 0.2  // Trigger when 20% visible
  });

  elements.forEach(el => observer.observe(el));
}

// CSS:
// .animate-on-scroll { opacity: 0; transform: translateY(20px); }
// .animated { opacity: 1; transform: translateY(0); transition: all 0.5s; }


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 4: Sticky Header Detection
// ═══════════════════════════════════════════════════════════════════════

function setupStickyHeader() {
  const header = document.querySelector('header');
  const sentinel = document.querySelector('#header-sentinel');

  const observer = new IntersectionObserver((entries) => {
    header.classList.toggle('sticky', !entries[0].isIntersecting);
  });

  observer.observe(sentinel);  // Invisible element above header
}


// ═══════════════════════════════════════════════════════════════════════
// EXAMPLE 5: Video Autoplay When Visible
// ═══════════════════════════════════════════════════════════════════════

function autoplayVideos() {
  const videos = document.querySelectorAll('video[data-autoplay]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  }, {
    threshold: 0.5  // Play when 50% visible
  });

  videos.forEach(video => observer.observe(video));
}
`;

console.log(realWorldExamples);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "How would you implement lazy loading?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "I'd use Intersection Observer, which is the modern, performant way to
 * detect when elements enter the viewport.
 *
 * For lazy loading images, I set data-src instead of src on images. Then
 * I create an Intersection Observer that watches these images. When an
 * image enters the viewport, the callback fires, I copy data-src to src
 * to trigger the actual load, and unobserve that image.
 *
 * This is much better than the old scroll event listener approach. Scroll
 * events fire hundreds of times during scrolling and calling
 * getBoundingClientRect causes layout thrashing. Intersection Observer is
 * asynchronous, browser-optimized, and only fires when visibility actually
 * changes.
 *
 * I also use rootMargin to start loading images before they're visible -
 * like 50px or 100px margin. This way images are ready by the time the
 * user scrolls to them.
 *
 * Beyond lazy loading, I use Intersection Observer for infinite scroll,
 * animate-on-scroll effects, tracking ad viewability for analytics, and
 * auto-playing videos only when they're visible."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Better than scroll events (async, browser-optimized)
 * ✓ No layout thrashing
 * ✓ Use cases: lazy loading, infinite scroll, animations
 * ✓ rootMargin for preloading
 * ✓ Unobserve after action for one-time events
 *
 */


// RUN: node docs/27-web-apis/13-intersection-observer.js
