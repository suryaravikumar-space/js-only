/**
 * CHALLENGE 09: Real World Usage Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHEN TO USE EACH                                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ DEBOUNCE: Wait for user to stop                                            ║
 * ║   - Search input autocomplete                                              ║
 * ║   - Window resize handler                                                  ║
 * ║   - Auto-save draft                                                        ║
 * ║                                                                            ║
 * ║ THROTTLE: Limit frequency                                                  ║
 * ║   - Scroll position tracking                                               ║
 * ║   - Mouse position tracking                                                ║
 * ║   - API rate limiting                                                      ║
 * ║                                                                            ║
 * ║ MEMOIZE: Cache expensive results                                           ║
 * ║   - API response caching                                                   ║
 * ║   - Complex calculations                                                   ║
 * ║   - Recursive algorithms                                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function debounce(fn, delay) {
  var timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  var lastCall = 0;
  return function(...args) {
    var now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

var searchAPI = debounce((query) => {
  console.log('A: Searching for:', query);
}, 300);

searchAPI('h');
searchAPI('he');
searchAPI('hel');
searchAPI('hell');
searchAPI('hello');

var scrollCount = 0;
var handleScroll = throttle(() => {
  scrollCount++;
}, 100);

for (var i = 0; i < 10; i++) {
  handleScroll();
}

setTimeout(() => {
  console.log('B: Scroll handler called', scrollCount, 'times');
}, 100);

/**
 * OUTPUT:
 *   B: Scroll handler called 1 times
 *   A: Searching for: hello
 *
 * RUN: node docs/12-debounce-throttle-memoize/09-real-world-usage.js
 */
