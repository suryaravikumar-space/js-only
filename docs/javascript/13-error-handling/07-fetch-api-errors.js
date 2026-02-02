/**
 * CHALLENGE 07: Fetch API Error Handling - INTERVIEW FAVORITE
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ fetch() does NOT throw on HTTP errors (404, 500, etc.)!                    ║
 * ║ It only throws on NETWORK failures (no internet, DNS failure).            ║
 * ║                                                                            ║
 * ║   fetch('/api/user')                                                       ║
 * ║     .then(res => {                                                         ║
 * ║       // ⚠️ 404 arrives here, NOT in catch!                                ║
 * ║       // res.ok is false, res.status is 404                                ║
 * ║     })                                                                     ║
 * ║     .catch(err => {                                                        ║
 * ║       // Only network errors end up here                                   ║
 * ║     });                                                                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Mock fetch for Node.js demo
// ═══════════════════════════════════════════════════════════════════════════════

function mockFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate network error
      if (url.includes('network-error')) {
        reject(new TypeError('Failed to fetch'));
        return;
      }

      // Simulate timeout
      if (url.includes('timeout')) {
        // Never resolves (simulated timeout)
        return;
      }

      // Simulate HTTP responses
      const responses = {
        '/api/users': { status: 200, data: [{ id: 1, name: 'John' }] },
        '/api/users/1': { status: 200, data: { id: 1, name: 'John' } },
        '/api/users/999': { status: 404, data: { error: 'User not found' } },
        '/api/error': { status: 500, data: { error: 'Internal server error' } },
        '/api/auth': { status: 401, data: { error: 'Unauthorized' } },
      };

      const response = responses[url] || { status: 404, data: { error: 'Not found' } };

      resolve({
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.status === 200 ? 'OK' : 'Error',
        json: () => Promise.resolve(response.data),
        text: () => Promise.resolve(JSON.stringify(response.data)),
      });
    }, 50);
  });
}


// ═══════════════════════════════════════════════════════════════════════════════
// 1. The Common Mistake
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. The Common Mistake ═══\n");

async function wrongWay() {
  try {
    const response = await mockFetch('/api/users/999');  // 404
    const data = await response.json();
    console.log('A: Got data:', data);  // Still runs! Bug!
    return data;
  } catch (error) {
    console.log('B: Error:', error.message);  // Never runs for 404!
  }
}

wrongWay().then(result => {
  console.log('C: Result:', result);  // { error: 'User not found' }
  console.log('   Problem: 404 was treated as success!\n');
});

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY 404 ISN'T CAUGHT                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   fetch('/api/users/999')                                                   │
 * │         │                                                                   │
 * │         ▼                                                                   │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  HTTP Request sent successfully ✓                                  │   │
 * │   │  Server responds with 404      ✓                                   │   │
 * │   │  Response received             ✓                                   │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │         │                                                                   │
 * │         ▼                                                                   │
 * │   Promise RESOLVES (not rejects!)                                           │
 * │   response.ok = false                                                       │
 * │   response.status = 404                                                     │
 * │                                                                             │
 * │   fetch only REJECTS on:                                                    │
 * │   • Network failure                                                         │
 * │   • CORS error                                                              │
 * │   • Request aborted                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. The Correct Way
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 2. The Correct Way ═══\n");

  async function correctWay() {
    try {
      const response = await mockFetch('/api/users/999');

      // CHECK response.ok or response.status!
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log('D: Error caught:', error.message);
      throw error;  // Re-throw or handle
    }
  }

  correctWay()
    .then(data => console.log('E: Success:', data))
    .catch(err => console.log('F: Failed:', err.message))
    .finally(() => console.log(''));

}, 200);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ALWAYS CHECK response.ok                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   async function fetchData(url) {                                           │
 * │     const response = await fetch(url);                                      │
 * │                                                                             │
 * │     if (!response.ok) {                                                     │
 * │       // response.ok is false for status 400-599                           │
 * │       throw new Error(`HTTP ${response.status}`);                           │
 * │     }                                                                       │
 * │                                                                             │
 * │     return response.json();                                                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   response.ok is equivalent to:                                             │
 * │   response.status >= 200 && response.status < 300                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Production-Grade Fetch Wrapper
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 3. Production Fetch Wrapper ═══\n");

  class HttpError extends Error {
    constructor(response, data) {
      super(data?.error || `HTTP ${response.status}`);
      this.name = 'HttpError';
      this.status = response.status;
      this.response = response;
      this.data = data;
    }
  }

  async function fetchJson(url, options = {}) {
    const { timeout = 5000, ...fetchOptions } = options;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await mockFetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });

      // Parse response body
      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      // Check for HTTP errors
      if (!response.ok) {
        throw new HttpError(response, data);
      }

      return data;

    } catch (error) {
      // Handle different error types
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof TypeError) {
        throw new Error('Network error: ' + error.message);
      }
      throw error;

    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Test the wrapper
  async function demo() {
    // Success
    try {
      const users = await fetchJson('/api/users');
      console.log('G: Users:', users);
    } catch (e) {
      console.log('H: Error:', e.message);
    }

    // 404
    try {
      await fetchJson('/api/users/999');
    } catch (e) {
      console.log('I: 404 Error:', e.message, '(status:', e.status + ')');
    }

    // 500
    try {
      await fetchJson('/api/error');
    } catch (e) {
      console.log('J: 500 Error:', e.message);
    }
  }

  demo().then(() => console.log(''));

}, 400);


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Handling Different Error Types
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 4. Error Type Handling ═══\n");

  class ApiError extends Error {
    constructor(message, status, code) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.code = code;
    }

    get isClientError() {
      return this.status >= 400 && this.status < 500;
    }

    get isServerError() {
      return this.status >= 500;
    }

    get isAuthError() {
      return this.status === 401 || this.status === 403;
    }
  }

  async function apiCall(url) {
    const response = await mockFetch(url);

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(data.error, response.status, data.code);
    }

    return response.json();
  }

  async function handleApiError(error) {
    if (!(error instanceof ApiError)) {
      console.log('K: Network/Unknown error:', error.message);
      return;
    }

    if (error.isAuthError) {
      console.log('L: Auth error - redirect to login');
    } else if (error.status === 404) {
      console.log('M: Not found - show 404 page');
    } else if (error.isServerError) {
      console.log('N: Server error - show error message, maybe retry');
    } else {
      console.log('O: Other error:', error.message);
    }
  }

  // Test different scenarios
  async function demo() {
    const urls = ['/api/auth', '/api/users/999', '/api/error'];

    for (const url of urls) {
      try {
        await apiCall(url);
      } catch (error) {
        await handleApiError(error);
      }
    }
  }

  demo().then(() => console.log(''));

}, 600);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR HANDLING BY STATUS CODE                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Status      │ Meaning            │ Action                                │
 * │   ────────────┼────────────────────┼────────────────────────────────────── │
 * │   400         │ Bad Request        │ Fix the request data                  │
 * │   401         │ Unauthorized       │ Redirect to login                     │
 * │   403         │ Forbidden          │ Show "access denied"                  │
 * │   404         │ Not Found          │ Show 404 page or fallback             │
 * │   422         │ Validation Error   │ Show field errors                     │
 * │   429         │ Rate Limited       │ Wait and retry                        │
 * │   500         │ Server Error       │ Show error, maybe retry               │
 * │   503         │ Service Unavail.   │ Retry with backoff                    │
 * │                                                                             │
 * │   CLIENT ERRORS (4xx): Usually user's fault - show message                 │
 * │   SERVER ERRORS (5xx): Not user's fault - retry or show error              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Retry on Failure
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 5. Fetch with Retry ═══\n");

  async function fetchWithRetry(url, options = {}) {
    const { retries = 3, retryDelay = 1000, retryOn = [500, 502, 503, 504] } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await mockFetch(url);

        if (!response.ok) {
          // Only retry on specific status codes
          if (retryOn.includes(response.status) && attempt < retries) {
            console.log(`   Attempt ${attempt}: ${response.status}, retrying...`);
            await new Promise(r => setTimeout(r, retryDelay));
            continue;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();

      } catch (error) {
        // Retry on network errors
        if (error instanceof TypeError && attempt < retries) {
          console.log(`   Attempt ${attempt}: Network error, retrying...`);
          await new Promise(r => setTimeout(r, retryDelay));
          continue;
        }
        throw error;
      }
    }
  }

  // Test
  fetchWithRetry('/api/users', { retries: 3, retryDelay: 100 })
    .then(data => console.log('P: Success after retries:', data))
    .catch(err => console.log('Q: All retries failed:', err.message))
    .finally(() => console.log(''));

}, 800);


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Complete Example: API Client
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 6. Complete API Client ═══\n");

  class ApiClient {
    constructor(baseUrl, options = {}) {
      this.baseUrl = baseUrl;
      this.defaultHeaders = options.headers || {};
      this.timeout = options.timeout || 10000;
    }

    async request(method, path, data = null) {
      const url = this.baseUrl + path;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await mockFetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return response.json();
    }

    get(path) { return this.request('GET', path); }
    post(path, data) { return this.request('POST', path, data); }
    put(path, data) { return this.request('PUT', path, data); }
    delete(path) { return this.request('DELETE', path); }
  }

  // Usage
  const api = new ApiClient('', {
    headers: { 'Authorization': 'Bearer token123' }
  });

  async function demo() {
    try {
      const users = await api.get('/api/users');
      console.log('R: GET /api/users:', users);

      const user = await api.get('/api/users/1');
      console.log('S: GET /api/users/1:', user);

    } catch (error) {
      console.log('T: Error:', error.message);
    }
  }

  demo().then(() => console.log(''));

}, 1000);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The biggest gotcha with fetch is that it doesn't throw on HTTP errors.    │
 * │  A 404 or 500 response still resolves the Promise - it only rejects        │
 * │  on actual network failures like no internet.                               │
 * │                                                                             │
 * │  So you must always check response.ok or response.status:                   │
 * │                                                                             │
 * │  const response = await fetch(url);                                         │
 * │  if (!response.ok) {                                                        │
 * │    throw new Error(`HTTP ${response.status}`);                              │
 * │  }                                                                          │
 * │                                                                             │
 * │  In production, I create an API client class that:                          │
 * │  - Wraps fetch with automatic response.ok checking                          │
 * │  - Has custom HttpError class with status and response body                 │
 * │  - Handles timeout with AbortController                                     │
 * │  - Retries on 5xx errors with exponential backoff                           │
 * │  - Handles different error types (auth, validation, server)                 │
 * │                                                                             │
 * │  Libraries like axios throw on 4xx/5xx by default, which is why             │
 * │  many developers prefer them over raw fetch."                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/07-fetch-api-errors.js
 */
