/**
 * WEB APIS: 03 - Fetch Real-World Patterns
 *
 * ONE CONCEPT: Production-ready patterns interviewers expect you to know
 */


// =============================================================================
// PATTERN 1: API CLIENT WRAPPER
// =============================================================================

console.log('=== Pattern 1: API Client ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WHY CREATE A WRAPPER?                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ✓ Automatic error handling (response.ok check)                      │
 *   │  ✓ Default headers (Authorization, Content-Type)                     │
 *   │  ✓ Base URL configuration                                            │
 *   │  ✓ Request/response interceptors                                     │
 *   │  ✓ Token refresh logic                                               │
 *   │  ✓ Consistent error format                                           │
 *   │                                                                      │
 *   │  INTERVIEW TIP: "I always create a wrapper instead of using          │
 *   │  fetch directly. It ensures consistent error handling and            │
 *   │  makes it easy to add auth headers everywhere."                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const apiClientCode = `
// ═══════════════════════════════════════════════════════════════════════
// Production API Client
// ═══════════════════════════════════════════════════════════════════════

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers['Authorization'] = \`Bearer \${token}\`;
    }

    // Stringify body if it's an object
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      // Handle HTTP errors
      if (!response.ok) {
        const error = new Error(\`HTTP \${response.status}\`);
        error.status = response.status;
        error.response = response;

        // Try to get error message from response
        try {
          error.data = await response.json();
        } catch {
          error.data = null;
        }

        throw error;
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return null;
      }

      return response.json();

    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError') {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  // Convenience methods
  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options) {
    return this.request(endpoint, { ...options, method: 'POST', body: data });
  }

  put(endpoint, data, options) {
    return this.request(endpoint, { ...options, method: 'PUT', body: data });
  }

  patch(endpoint, data, options) {
    return this.request(endpoint, { ...options, method: 'PATCH', body: data });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Usage
const api = new ApiClient('https://api.example.com');

// Clean API calls
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John', email: 'john@test.com' });
await api.delete('/users/123');
`;

console.log(apiClientCode);


// =============================================================================
// PATTERN 2: REQUEST WITH TIMEOUT
// =============================================================================

console.log('\n=== Pattern 2: Timeout ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PROBLEM: Fetch has NO built-in timeout!                            │
 *   │  Request can hang forever if server doesn't respond.                │
 *   │                                                                     │
 *   │  SOLUTION: Use AbortController with setTimeout                      │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const timeoutCode = `
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();

  // Set timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    return response;

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(\`Request timed out after \${timeout}ms\`);
    }
    throw error;

  } finally {
    clearTimeout(timeoutId);  // Clean up timer
  }
}

// Usage
try {
  const response = await fetchWithTimeout('/api/slow-endpoint', {}, 3000);
  const data = await response.json();
} catch (error) {
  if (error.message.includes('timed out')) {
    showError('Server is taking too long. Please try again.');
  }
}
`;

console.log(timeoutCode);


// =============================================================================
// PATTERN 3: RETRY LOGIC
// =============================================================================

console.log('\n=== Pattern 3: Retry with Exponential Backoff ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  EXPONENTIAL BACKOFF                                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Attempt 1: Wait 1 second                                           │
 *   │  Attempt 2: Wait 2 seconds                                          │
 *   │  Attempt 3: Wait 4 seconds                                          │
 *   │  Attempt 4: Wait 8 seconds                                          │
 *   │                                                                     │
 *   │  WHY?                                                               │
 *   │  - Gives server time to recover                                     │
 *   │  - Prevents hammering a struggling server                           │
 *   │  - Standard practice for production APIs                            │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const retryCode = `
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Only retry on server errors (5xx) or network issues
      if (response.ok) {
        return response;
      }

      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(\`Client error: \${response.status}\`);
      }

      lastError = new Error(\`Server error: \${response.status}\`);

    } catch (error) {
      lastError = error;

      // Don't retry if it was aborted
      if (error.name === 'AbortError') {
        throw error;
      }
    }

    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries - 1) {
      const delay = Math.pow(2, attempt) * 1000;  // 1s, 2s, 4s...
      console.log(\`Retrying in \${delay}ms... (attempt \${attempt + 2}/\${maxRetries})\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Usage
try {
  const response = await fetchWithRetry('/api/unreliable-endpoint');
  const data = await response.json();
} catch (error) {
  console.error('All retries failed:', error);
}


// Combined: Retry + Timeout
async function robustFetch(url, options = {}) {
  return fetchWithRetry(
    url,
    { ...options, signal: createTimeoutSignal(5000) },
    3
  );
}
`;

console.log(retryCode);


// =============================================================================
// PATTERN 4: PARALLEL REQUESTS
// =============================================================================

console.log('\n=== Pattern 4: Parallel Requests ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PARALLEL REQUESTS                                                  │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Sequential (slow):    Request A → Wait → Request B → Wait          │
 *   │                        Total: 2 seconds + 2 seconds = 4 seconds     │
 *   │                                                                     │
 *   │  Parallel (fast):      Request A ─────┐                             │
 *   │                        Request B ─────┼→ Both done                  │
 *   │                        Total: max(2 seconds, 2 seconds) = 2 seconds │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const parallelCode = `
// ═══════════════════════════════════════════════════════════════════════
// Promise.all - All must succeed
// ═══════════════════════════════════════════════════════════════════════
async function loadDashboard(userId) {
  try {
    const [user, posts, notifications] = await Promise.all([
      fetch('/api/users/' + userId).then(r => r.json()),
      fetch('/api/posts?userId=' + userId).then(r => r.json()),
      fetch('/api/notifications?userId=' + userId).then(r => r.json())
    ]);

    return { user, posts, notifications };

  } catch (error) {
    // If ANY request fails, all fail
    console.error('Failed to load dashboard:', error);
    throw error;
  }
}


// ═══════════════════════════════════════════════════════════════════════
// Promise.allSettled - Get results even if some fail
// ═══════════════════════════════════════════════════════════════════════
async function loadDashboardSafe(userId) {
  const results = await Promise.allSettled([
    fetch('/api/users/' + userId).then(r => r.json()),
    fetch('/api/posts?userId=' + userId).then(r => r.json()),
    fetch('/api/notifications?userId=' + userId).then(r => r.json())
  ]);

  return {
    user: results[0].status === 'fulfilled' ? results[0].value : null,
    posts: results[1].status === 'fulfilled' ? results[1].value : [],
    notifications: results[2].status === 'fulfilled' ? results[2].value : []
  };
}


// ═══════════════════════════════════════════════════════════════════════
// Promise.race - First to complete wins (good for timeout alternative)
// ═══════════════════════════════════════════════════════════════════════
const result = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
]);
`;

console.log(parallelCode);


// =============================================================================
// PATTERN 5: REQUEST DEDUPLICATION
// =============================================================================

console.log('\n=== Pattern 5: Request Deduplication ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PROBLEM: Same request made multiple times simultaneously           │
 *   │                                                                     │
 *   │  Component A: fetch('/api/user')  ─┐                                │
 *   │  Component B: fetch('/api/user')  ─┼→ 3 identical requests!         │
 *   │  Component C: fetch('/api/user')  ─┘                                │
 *   │                                                                     │
 *   │  SOLUTION: Cache in-flight requests                                 │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const dedupeCode = `
// Request deduplication
const inFlightRequests = new Map();

async function deduplicatedFetch(url, options = {}) {
  const key = \`\${options.method || 'GET'}:\${url}\`;

  // If request is already in flight, return the same promise
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }

  // Create new request
  const promise = fetch(url, options)
    .then(response => {
      inFlightRequests.delete(key);  // Remove from cache
      return response;
    })
    .catch(error => {
      inFlightRequests.delete(key);  // Remove on error too
      throw error;
    });

  inFlightRequests.set(key, promise);
  return promise;
}

// Now all these share ONE request:
const [user1, user2, user3] = await Promise.all([
  deduplicatedFetch('/api/user'),
  deduplicatedFetch('/api/user'),  // Same promise!
  deduplicatedFetch('/api/user')   // Same promise!
]);
`;

console.log(dedupeCode);


// =============================================================================
// PATTERN 6: POLLING
// =============================================================================

console.log('\n=== Pattern 6: Polling ===\n');

const pollingCode = `
// Poll for updates (when WebSocket isn't available)
function poll(url, interval, callback, shouldStop = () => false) {
  let timeoutId;

  async function execute() {
    if (shouldStop()) {
      return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      callback(null, data);
    } catch (error) {
      callback(error, null);
    }

    // Schedule next poll
    timeoutId = setTimeout(execute, interval);
  }

  execute();

  // Return cleanup function
  return () => clearTimeout(timeoutId);
}

// Usage: Check order status every 5 seconds
let orderComplete = false;

const stopPolling = poll(
  '/api/orders/123/status',
  5000,
  (error, data) => {
    if (error) {
      console.error('Failed to get status:', error);
      return;
    }

    updateStatusUI(data.status);

    if (data.status === 'delivered') {
      orderComplete = true;
      stopPolling();
    }
  },
  () => orderComplete
);

// Stop on component unmount
// stopPolling();
`;

console.log(pollingCode);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "How do you handle API calls in production?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "I never use fetch directly in production. I create an API client wrapper
 * that handles common concerns.
 *
 * First, error handling - the wrapper checks response.ok and throws proper
 * errors with status codes. This ensures I never forget to handle HTTP errors.
 *
 * Second, authentication - the wrapper automatically adds the Authorization
 * header with the token from storage. This keeps auth logic in one place.
 *
 * Third, I implement timeout using AbortController since fetch doesn't have
 * built-in timeout. I also add retry with exponential backoff for server
 * errors - retry after 1 second, then 2, then 4. This handles temporary
 * failures gracefully.
 *
 * For performance, I use Promise.all for parallel requests instead of
 * sequential awaits. For the dashboard, I might load user, posts, and
 * notifications in parallel.
 *
 * I also implement request deduplication. If the same endpoint is called
 * multiple times simultaneously, I return the same promise. This prevents
 * duplicate requests when multiple components need the same data.
 *
 * For real-time updates, I use WebSocket. But when that's not available,
 * I implement polling with a cleanup function to stop when the component
 * unmounts."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ API client wrapper (don't use fetch directly)
 * ✓ Timeout with AbortController
 * ✓ Retry with exponential backoff
 * ✓ Promise.all for parallel requests
 * ✓ Request deduplication
 *
 */


// RUN: node docs/27-web-apis/03-fetch-real-world.js
