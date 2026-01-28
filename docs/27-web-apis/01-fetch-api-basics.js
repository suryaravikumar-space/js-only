/**
 * WEB APIS: 01 - Fetch API Basics
 *
 * ONE CONCEPT: Modern way to make HTTP requests
 */


// =============================================================================
// WHAT IS FETCH API?
// =============================================================================

/**
 * Fetch API = Modern, Promise-based API for making HTTP requests.
 *             Replaced XMLHttpRequest (XHR) for most use cases.
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HOW FETCH WORKS                                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   Your Code                                                          │
 *   │      │                                                               │
 *   │      │  fetch('https://api.example.com/users')                       │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  BROWSER                                                    │    │
 *   │   │                                                             │    │
 *   │   │  1. Create HTTP Request                                     │    │
 *   │   │  2. Send to Server                                          │    │
 *   │   │  3. Wait for Response                                       │    │
 *   │   │  4. Return Promise                                          │    │
 *   │   │                                                             │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  SERVER                                                     │    │
 *   │   │                                                             │    │
 *   │   │  Process Request → Send Response                            │    │
 *   │   │                                                             │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   Response Object                                                    │
 *   │      │                                                               │
 *   │      │  .json() / .text() / .blob()                                  │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │   Parsed Data                                                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC SYNTAX
// =============================================================================

console.log('=== Basic Fetch Syntax ===\n');

/**
 *   fetch(url)                    → Returns Promise<Response>
 *   fetch(url, options)           → With configuration
 *
 *   Response methods (all return Promises):
 *   - response.json()   → Parse as JSON
 *   - response.text()   → Parse as text
 *   - response.blob()   → Parse as binary (images, files)
 *   - response.arrayBuffer() → Raw binary data
 *   - response.formData()   → Parse as FormData
 *
 */

const basicExample = `
// Simple GET request
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// With async/await (PREFERRED)
async function getUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
`;

console.log(basicExample);


// =============================================================================
// THE RESPONSE OBJECT
// =============================================================================

console.log('=== Response Object ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  RESPONSE OBJECT PROPERTIES                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Response {                                                          │
 *   │                                                                      │
 *   │    // STATUS                                                         │
 *   │    ok: true,              ← true if status 200-299                   │
 *   │    status: 200,           ← HTTP status code                         │
 *   │    statusText: 'OK',      ← HTTP status message                      │
 *   │                                                                      │
 *   │    // HEADERS                                                        │
 *   │    headers: Headers {},   ← Response headers                         │
 *   │                                                                      │
 *   │    // URL                                                            │
 *   │    url: 'https://...',    ← Final URL (after redirects)              │
 *   │    redirected: false,     ← Was there a redirect?                    │
 *   │                                                                      │
 *   │    // TYPE                                                           │
 *   │    type: 'basic',         ← basic, cors, opaque, etc.                │
 *   │                                                                      │
 *   │    // BODY (can only be read ONCE!)                                  │
 *   │    body: ReadableStream,  ← Raw body stream                          │
 *   │    bodyUsed: false,       ← Has body been read?                      │
 *   │                                                                      │
 *   │    // METHODS                                                        │
 *   │    json(),                ← Parse body as JSON                       │
 *   │    text(),                ← Parse body as text                       │
 *   │    blob(),                ← Parse body as Blob                       │
 *   │    clone()                ← Clone response (to read body twice)      │
 *   │  }                                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const responseExample = `
const response = await fetch('https://api.example.com/users');

// Check status
console.log(response.ok);         // true (status 200-299)
console.log(response.status);     // 200
console.log(response.statusText); // "OK"

// Access headers
console.log(response.headers.get('Content-Type')); // "application/json"

// Parse body (choose ONE - body can only be read once!)
const data = await response.json();   // For JSON
// const text = await response.text();  // For plain text
// const blob = await response.blob();  // For files/images

// To read body twice, clone first
const clone = response.clone();
const data1 = await response.json();
const data2 = await clone.json();
`;

console.log(responseExample);


// =============================================================================
// HTTP STATUS CODES
// =============================================================================

console.log('=== HTTP Status Codes ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMMON HTTP STATUS CODES                                           │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  2XX SUCCESS                                                        │
 *   │  200 OK              - Request succeeded                            │
 *   │  201 Created         - Resource created (POST)                      │
 *   │  204 No Content      - Success, no body (DELETE)                    │
 *   │                                                                     │
 *   │  3XX REDIRECT                                                       │
 *   │  301 Moved Permanently - Resource moved                             │
 *   │  304 Not Modified      - Use cached version                         │
 *   │                                                                     │
 *   │  4XX CLIENT ERROR                                                   │
 *   │  400 Bad Request     - Invalid request syntax                       │
 *   │  401 Unauthorized    - Need to authenticate                         │
 *   │  403 Forbidden       - Authenticated but not allowed                │
 *   │  404 Not Found       - Resource doesn't exist                       │
 *   │  422 Unprocessable   - Validation failed                            │
 *   │  429 Too Many Requests - Rate limited                               │
 *   │                                                                     │
 *   │  5XX SERVER ERROR                                                   │
 *   │  500 Internal Error  - Server crashed                               │
 *   │  502 Bad Gateway     - Upstream server error                        │
 *   │  503 Service Unavailable - Server overloaded                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('2XX: Success (200 OK, 201 Created, 204 No Content)');
console.log('4XX: Client Error (400 Bad Request, 401 Unauthorized, 404 Not Found)');
console.log('5XX: Server Error (500 Internal, 503 Unavailable)');


// =============================================================================
// IMPORTANT: FETCH DOESN'T REJECT ON HTTP ERRORS!
// =============================================================================

console.log('\n=== CRITICAL: Error Handling ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  ⚠️  FETCH ONLY REJECTS ON NETWORK ERRORS!                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  404, 500, etc. are NOT rejected!                                   │
 *   │  You must check response.ok manually!                               │
 *   │                                                                     │
 *   │  // This DOES NOT catch 404!                                        │
 *   │  fetch('/not-found')                                                │
 *   │    .then(res => res.json())  // Still runs!                         │
 *   │    .catch(err => ...)        // Not triggered for 404               │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const errorHandling = `
// ❌ WRONG - Doesn't catch HTTP errors
async function wrongWay() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();  // Runs even on 404!
    return data;
  } catch (error) {
    // Only catches network errors, NOT 404/500!
    console.error(error);
  }
}

// ✅ CORRECT - Check response.ok
async function rightWay() {
  try {
    const response = await fetch('/api/users');

    if (!response.ok) {
      // Throw error for 4XX/5XX status codes
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// ✅ EVEN BETTER - Reusable wrapper
async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    error.response = response;
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// Usage
try {
  const users = await fetchJSON('/api/users');
} catch (error) {
  if (error.status === 404) {
    console.log('Users not found');
  } else if (error.status === 401) {
    console.log('Please log in');
  } else {
    console.log('Request failed:', error.message);
  }
}
`;

console.log(errorHandling);


// =============================================================================
// REAL-WORLD EXAMPLE: LOADING USER DATA
// =============================================================================

console.log('\n=== Real-World Example ===\n');

const realWorldExample = `
// Real-world: Load user profile with loading state
async function loadUserProfile(userId) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const profileEl = document.getElementById('profile');

  try {
    // Show loading
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';

    // Fetch user data
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error('Failed to load user');
    }

    const user = await response.json();

    // Display data
    profileEl.innerHTML = \`
      <h1>\${user.name}</h1>
      <p>\${user.email}</p>
    \`;

  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.style.display = 'block';

  } finally {
    loadingEl.style.display = 'none';
  }
}
`;

console.log(realWorldExample);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "How do you make HTTP requests in JavaScript?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "I use the Fetch API, which is the modern, Promise-based way to make
 * HTTP requests. It replaced the older XMLHttpRequest.
 *
 * Basic usage is fetch(url) which returns a Promise that resolves to a
 * Response object. To get the actual data, you call response.json() for
 * JSON or response.text() for plain text. I prefer async/await syntax
 * for cleaner code.
 *
 * One critical thing about fetch - it only rejects on network errors,
 * not HTTP errors. So a 404 or 500 response won't throw an error. You
 * have to manually check response.ok, which is true for status codes
 * 200-299. If it's not ok, I throw an error manually.
 *
 * I usually create a wrapper function that handles this check automatically
 * and also adds common headers like Authorization. This way I don't have
 * to repeat the error checking in every request.
 *
 * For the response, the body can only be read once. If you need to read
 * it multiple times, you clone the response first with response.clone()."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Promise-based, modern replacement for XHR
 * ✓ fetch() returns Response, need .json() or .text() for data
 * ✓ CRITICAL: Doesn't reject on HTTP errors, check response.ok
 * ✓ Body can only be read once (use clone() if needed)
 * ✓ Use async/await for cleaner code
 *
 */


// RUN: node docs/27-web-apis/01-fetch-api-basics.js
