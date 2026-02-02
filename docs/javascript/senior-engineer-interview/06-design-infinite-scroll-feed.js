/**
 * ================================================================
 * QUESTION: "Design an infinite-scrolling social media feed
 *            like Twitter/Instagram. It must be performant
 *            on low-end devices."
 * ================================================================
 *
 * ASKED AT: Meta (E5 — "Design Facebook News Feed"), Amazon (SDE2),
 *           Google (L5), Twitter/X, LinkedIn
 * TYPE:     Frontend System Design
 *
 * Sources:
 *   - GreatFrontEnd System Design: https://www.greatfrontend.com/questions/system-design
 *   - Twitter engineering blog on feed rendering
 *   - web.dev content-visibility: https://web.dev/articles/content-visibility
 *   - IntersectionObserver: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * ================================================================
 * YOUR STORY TO THE INTERVIEWER:
 * ================================================================
 *
 * "I'll walk through 5 key decisions:
 *
 *  1. How to detect 'user scrolled to bottom' → IntersectionObserver
 *  2. How to fetch more posts → cursor-based pagination
 *  3. How to not crash on 1000+ posts → virtualization or DOM recycling
 *  4. How to handle images/videos → lazy loading + skeleton
 *  5. How to handle new posts while scrolling → 'New posts' banner
 *
 *  Let me start with the scroll detection..."
 *
 * ================================================================
 * VISUAL: THE PROBLEM
 * ================================================================
 *
 *   User scrolls through 500 posts:
 *
 *   WITHOUT virtualization:
 *   ┌────────────────┐
 *   │ Post 1 (DOM)   │  ← 500 DOM nodes in memory
 *   │ Post 2 (DOM)   │  ← Each post has: image, text, buttons,
 *   │ Post 3 (DOM)   │     avatar, timestamp = ~20 DOM nodes per post
 *   │ ...            │  ← 500 × 20 = 10,000 DOM nodes
 *   │ Post 500 (DOM) │  ← Browser: "I'm dying" 💀
 *   └────────────────┘     Low-end phone: 5fps scroll
 *
 *   WITH virtualization:
 *   ┌────────────────┐
 *   │ (spacer div)   │  ← height: 45,000px (takes space, no DOM)
 *   │ Post 48 (DOM)  │  ← Only ~15 posts rendered
 *   │ Post 49 (DOM)  │
 *   │ Post 50 (DOM)  │  ← Viewport (what user sees)
 *   │ Post 51 (DOM)  │
 *   │ Post 52 (DOM)  │
 *   │ (spacer div)   │  ← Takes remaining space
 *   └────────────────┘     15 × 20 = 300 DOM nodes. Smooth. 60fps.
 *
 * ================================================================
 * STEP 1: DETECT "LOAD MORE" — IntersectionObserver
 * ================================================================
 */

// ❌ BAD — scroll event listener (fires 100+ times per scroll)
/*
window.addEventListener('scroll', () => {
  // Fires CONSTANTLY. Expensive. Causes jank.
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 200) {
    loadMore();
  }
});
*/

// ✅ GOOD — IntersectionObserver (fires once when sentinel enters viewport)
function setupInfiniteScroll(sentinelElement, loadMore) {
  const observer = new IntersectionObserver(
    (entries) => {
      // Fires only when sentinel becomes visible
      if (entries[0].isIntersecting) {
        loadMore();
      }
    },
    { rootMargin: "200px" } // trigger 200px BEFORE user reaches bottom
  );

  observer.observe(sentinelElement);
  return () => observer.disconnect();
}

// HTML: <div id="feed">...posts...</div><div id="sentinel"></div>
// The sentinel is an invisible div at the bottom of the feed.
// When it enters the viewport → load more posts.

/**
 * ================================================================
 * STEP 2: CURSOR-BASED PAGINATION
 * ================================================================
 *
 *   Request:  GET /api/feed?cursor=post-50&limit=20
 *   Response: { posts: [...20 posts...], nextCursor: "post-70", hasMore: true }
 *
 *   Next:     GET /api/feed?cursor=post-70&limit=20
 *
 *   Why cursor not offset?
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ Offset-based: GET /feed?page=3&limit=20                    │
 *   │                                                              │
 *   │ Problem: While user reads page 1, 5 new posts are added.    │
 *   │ Page 3 now shows different posts than expected.              │
 *   │ User sees duplicates or misses posts.                       │
 *   │                                                              │
 *   │ Cursor-based: GET /feed?after=post-50&limit=20              │
 *   │                                                              │
 *   │ "Give me 20 posts AFTER this specific post."                │
 *   │ New posts at the top don't affect this.                     │
 *   │ No duplicates. No missed posts.                             │
 *   └──────────────────────────────────────────────────────────────┘
 */

// ================================================================
// STEP 3: MEMORY MANAGEMENT — don't let DOM grow forever
// ================================================================

/**
 * APPROACH A: content-visibility: auto (simplest, good enough for most)
 *
 * .post {
 *   content-visibility: auto;
 *   contain-intrinsic-size: 0 600px;
 * }
 *
 * Browser keeps DOM nodes but skips rendering for off-screen posts.
 * Reduces paint + layout cost dramatically.
 * Chrome team: 7x improvement on large pages.
 *
 *
 * APPROACH B: Full virtualization (for extreme cases: 10K+ items)
 * Use react-window, @tanstack/virtual, or similar.
 * Actually removes DOM nodes for off-screen items.
 *
 *
 * APPROACH C: DOM recycling (what mobile apps do)
 * Keep a pool of ~20 DOM elements. As user scrolls:
 * - Post that leaves top → its DOM element moves to bottom
 * - Update its content to show the new post
 * - No DOM creation/destruction. Zero GC pressure.
 *
 * Twitter/X uses this approach for their web feed.
 */

/**
 * ================================================================
 * STEP 4: IMAGE AND VIDEO HANDLING
 * ================================================================
 *
 *   <img loading="lazy" src="photo.jpg" />
 *
 *   loading="lazy" = browser loads image only when near viewport.
 *   No JavaScript needed. Works in all modern browsers.
 *
 *   For videos:
 *   - Don't autoplay until in viewport (IntersectionObserver)
 *   - Pause when out of viewport (saves battery + bandwidth)
 *   - Use <video preload="none"> for off-screen videos
 *
 *   Skeleton loading:
 *   Show gray placeholder boxes → swap with content when loaded.
 *   User perceives faster load. Better than spinner.
 *
 *   ┌─────────────────────┐      ┌─────────────────────┐
 *   │ ┌──┐ ▓▓▓▓▓▓▓▓▓▓▓▓ │      │ ┌──┐ Alice Johnson  │
 *   │ └──┘ ▓▓▓▓▓▓▓▓      │  →   │ └──┘ 2 hours ago    │
 *   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │      │ Just had the best   │
 *   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │      │ coffee in Tokyo!    │
 *   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │      │ [  photo.jpg  ]     │
 *   └─────────────────────┘      └─────────────────────┘
 *       Skeleton                      Loaded
 */

/**
 * ================================================================
 * STEP 5: NEW POSTS WHILE SCROLLING
 * ================================================================
 *
 * Problem: User is reading post 30. 10 new posts arrive.
 *          DO NOT push them into the feed (scroll position jumps).
 *
 * Solution:
 *   ┌──────────────────────────────────┐
 *   │  ↑ 10 new posts — click to see  │  ← banner at top
 *   ├──────────────────────────────────┤
 *   │  Post 21 (what user is reading)  │  ← scroll position stays
 *   │  Post 22                         │
 *   │  Post 23                         │
 *   └──────────────────────────────────┘
 *
 *   When user clicks banner:
 *   - Prepend new posts
 *   - Smooth scroll to top
 *
 *   When user IS at top (scrollY === 0):
 *   - Insert new posts directly (no banner needed)
 *
 *   This is exactly how Twitter, Instagram, and LinkedIn work.
 */

/**
 * ================================================================
 * CHEAT SHEET
 * ================================================================
 *
 * Interviewer says...                  │  You say...
 * ─────────────────────────────────────┼──────────────────────────────
 * "How to detect scroll bottom?"       │  IntersectionObserver on sentinel
 *                                      │  element. NOT scroll event.
 * "Why not scroll event?"              │  Fires 100+ times per scroll.
 *                                      │  IO fires once. No jank.
 * "How to handle 10K posts?"           │  Virtualization (only ~15 in DOM)
 *                                      │  OR content-visibility: auto (simpler)
 * "Cursor vs offset pagination?"       │  Cursor. Offset breaks when new
 *                                      │  posts arrive (duplicates/gaps).
 * "New posts while scrolling?"         │  Banner: "10 new posts." Don't
 *                                      │  shift scroll position.
 * "How to handle images?"              │  loading="lazy" (native).
 *                                      │  Skeleton placeholders.
 *                                      │  IntersectionObserver for video autoplay.
 * "Memory management?"                 │  DOM recycling (pool of elements),
 *                                      │  or drop posts beyond a threshold
 *                                      │  and re-fetch if user scrolls back.
 */
