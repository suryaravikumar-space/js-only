/**
 * WEB APIS: 02 - Fetch API Advanced
 *
 * ONE CONCEPT: Request options, headers, and different HTTP methods
 */


// =============================================================================
// FETCH OPTIONS
// =============================================================================

/**
 *   fetch(url, options)
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  OPTIONS OBJECT                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  {                                                                   │
 *   │    method: 'GET',           ← HTTP method                            │
 *   │    headers: {},             ← Request headers                        │
 *   │    body: null,              ← Request body (POST/PUT/PATCH)          │
 *   │    mode: 'cors',            ← CORS mode                              │
 *   │    credentials: 'same-origin', ← Cookie handling                     │
 *   │    cache: 'default',        ← Cache behavior                         │
 *   │    redirect: 'follow',      ← Redirect behavior                      │
 *   │    signal: null             ← AbortController signal                 │
 *   │  }                                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// HTTP METHODS (CRUD Operations)
// =============================================================================

console.log('=== HTTP Methods ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CRUD OPERATIONS                                                    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Operation    │ HTTP Method │ Has Body │ Typical Use                │
 *   │  ─────────────┼─────────────┼──────────┼─────────────────────────── │
 *   │  CREATE       │ POST        │ Yes      │ Create new resource        │
 *   │  READ         │ GET         │ No       │ Fetch data                 │
 *   │  UPDATE       │ PUT/PATCH   │ Yes      │ Update resource            │
 *   │  DELETE       │ DELETE      │ Optional │ Remove resource            │
 *   │                                                                     │
 *   │  PUT vs PATCH:                                                      │
 *   │  PUT   = Replace entire resource                                    │
 *   │  PATCH = Partial update (only changed fields)                       │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const crudExamples = `
// ═══════════════════════════════════════════════════════════════════════
// GET - Read data (no body)
// ═══════════════════════════════════════════════════════════════════════
const users = await fetch('/api/users').then(r => r.json());

// GET with query parameters
const url = new URL('/api/users', 'https://api.example.com');
url.searchParams.set('page', 1);
url.searchParams.set('limit', 10);
url.searchParams.set('sort', 'name');
// Result: /api/users?page=1&limit=10&sort=name

const pagedUsers = await fetch(url).then(r => r.json());


// ═══════════════════════════════════════════════════════════════════════
// POST - Create new resource
// ═══════════════════════════════════════════════════════════════════════
const newUser = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
}).then(r => r.json());


// ═══════════════════════════════════════════════════════════════════════
// PUT - Replace entire resource
// ═══════════════════════════════════════════════════════════════════════
const updatedUser = await fetch('/api/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Updated',
    email: 'john.new@example.com',
    role: 'admin'  // Must send ALL fields
  })
}).then(r => r.json());


// ═══════════════════════════════════════════════════════════════════════
// PATCH - Partial update
// ═══════════════════════════════════════════════════════════════════════
const patched = await fetch('/api/users/123', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newemail@example.com'  // Only changed fields
  })
}).then(r => r.json());


// ═══════════════════════════════════════════════════════════════════════
// DELETE - Remove resource
// ═══════════════════════════════════════════════════════════════════════
const deleted = await fetch('/api/users/123', {
  method: 'DELETE'
});

if (deleted.ok) {
  console.log('User deleted');
}
`;

console.log(crudExamples);


// =============================================================================
// HEADERS
// =============================================================================

console.log('\n=== Request Headers ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMMON REQUEST HEADERS                                             │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Content-Type     │ Type of data being sent                         │
 *   │                   │ 'application/json'                              │
 *   │                   │ 'application/x-www-form-urlencoded'             │
 *   │                   │ 'multipart/form-data'                           │
 *   │                                                                     │
 *   │  Authorization    │ Authentication token                            │
 *   │                   │ 'Bearer eyJhbGciOiJIUzI1NiIs...'                │
 *   │                                                                     │
 *   │  Accept           │ Expected response format                        │
 *   │                   │ 'application/json'                              │
 *   │                                                                     │
 *   │  X-Custom-Header  │ Custom application headers                      │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const headersExample = `
// Using headers object
const response = await fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken,
    'Accept': 'application/json',
    'X-Request-ID': generateRequestId()
  },
  body: JSON.stringify(data)
});

// Using Headers class (more flexible)
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', 'Bearer ' + token);

// Headers methods
headers.set('Accept', 'application/json');  // Set/overwrite
headers.get('Content-Type');                 // Get value
headers.has('Authorization');                // Check exists
headers.delete('X-Old-Header');              // Remove

const response = await fetch('/api/data', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
});

// Reading response headers
const contentType = response.headers.get('Content-Type');
const rateLimit = response.headers.get('X-RateLimit-Remaining');
`;

console.log(headersExample);


// =============================================================================
// SENDING DIFFERENT DATA TYPES
// =============================================================================

console.log('\n=== Sending Different Data Types ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  DATA TYPES FOR REQUEST BODY                                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  JSON           → JSON.stringify(obj) + Content-Type: json          │
 *   │  FormData       → new FormData() (auto sets Content-Type)           │
 *   │  URLSearchParams→ For form-urlencoded data                          │
 *   │  Blob/File      → Binary data                                       │
 *   │  String         → Plain text                                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const dataTypesExample = `
// ═══════════════════════════════════════════════════════════════════════
// JSON (most common for APIs)
// ═══════════════════════════════════════════════════════════════════════
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', age: 30 })
});


// ═══════════════════════════════════════════════════════════════════════
// FormData (for file uploads or form submissions)
// ═══════════════════════════════════════════════════════════════════════
const formData = new FormData();
formData.append('name', 'John');
formData.append('avatar', fileInput.files[0]);  // File upload

await fetch('/api/upload', {
  method: 'POST',
  body: formData  // Don't set Content-Type! Browser sets it with boundary
});

// From existing form
const form = document.getElementById('myForm');
const formData = new FormData(form);
await fetch('/api/submit', { method: 'POST', body: formData });


// ═══════════════════════════════════════════════════════════════════════
// URLSearchParams (form-urlencoded, like HTML forms)
// ═══════════════════════════════════════════════════════════════════════
const params = new URLSearchParams();
params.append('username', 'john');
params.append('password', 'secret');

await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params
});


// ═══════════════════════════════════════════════════════════════════════
// Plain text
// ═══════════════════════════════════════════════════════════════════════
await fetch('/api/log', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: 'Error occurred at line 42'
});
`;

console.log(dataTypesExample);


// =============================================================================
// CREDENTIALS (COOKIES)
// =============================================================================

console.log('\n=== Credentials (Cookies) ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CREDENTIALS OPTION                                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  'omit'        - Never send cookies                                 │
 *   │  'same-origin' - Send cookies for same-origin only (DEFAULT)        │
 *   │  'include'     - Always send cookies (even cross-origin)            │
 *   │                                                                     │
 *   │  IMPORTANT for authentication!                                      │
 *   │  If your API is on different domain, you need 'include'             │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const credentialsExample = `
// Same-origin (default) - cookies sent to same domain
await fetch('/api/users');  // Cookies included

// Cross-origin API - must explicitly include cookies
await fetch('https://api.example.com/users', {
  credentials: 'include'  // Send cookies to different domain
});

// Never send cookies (public API)
await fetch('https://public-api.com/data', {
  credentials: 'omit'
});
`;

console.log(credentialsExample);


// =============================================================================
// CORS (Cross-Origin Resource Sharing)
// =============================================================================

console.log('\n=== CORS Modes ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CORS - Cross-Origin Resource Sharing                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Your Site: https://myapp.com                                       │
 *   │  API:       https://api.example.com (different origin)              │
 *   │                                                                     │
 *   │  Browser blocks cross-origin requests by default.                   │
 *   │  Server must send CORS headers to allow it.                         │
 *   │                                                                     │
 *   │  MODE OPTIONS:                                                      │
 *   │  'cors'      - Allow cross-origin (default)                         │
 *   │  'no-cors'   - Restrict to simple requests, opaque response         │
 *   │  'same-origin' - Only same-origin allowed                           │
 *   │                                                                     │
 *   │  COMMON CORS ERROR:                                                 │
 *   │  "Access-Control-Allow-Origin header is missing"                    │
 *   │  → Server needs to add this header!                                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const corsExample = `
// Normal CORS request
await fetch('https://api.example.com/data', {
  mode: 'cors'  // Default
});

// If CORS fails, common solutions:
// 1. Server adds: Access-Control-Allow-Origin: https://myapp.com
// 2. Use a proxy server
// 3. For development: use CORS browser extension (NOT for production!)
`;

console.log(corsExample);


// =============================================================================
// ABORTING REQUESTS
// =============================================================================

console.log('\n=== Aborting Requests ===\n');

const abortExample = `
// Cancel a fetch request using AbortController
const controller = new AbortController();

// Pass signal to fetch
const fetchPromise = fetch('/api/data', {
  signal: controller.signal
});

// Cancel after 5 seconds
setTimeout(() => {
  controller.abort();
}, 5000);

try {
  const response = await fetchPromise;
  const data = await response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  } else {
    console.log('Request failed:', error);
  }
}

// REAL-WORLD: Cancel on component unmount (React)
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(e => {
      if (e.name !== 'AbortError') throw e;
    });

  return () => controller.abort();  // Cleanup
}, []);
`;

console.log(abortExample);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "How do you send POST requests with Fetch?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "To send a POST request, I pass an options object as the second argument
 * to fetch. I set method to POST, add headers including Content-Type, and
 * put the data in body.
 *
 * For JSON data, which is most common, I set Content-Type to application/json
 * and use JSON.stringify on the body. For file uploads, I use FormData and
 * let the browser set the Content-Type automatically.
 *
 * For authentication, I include the Authorization header with a Bearer token.
 * If the API uses cookies for auth and it's cross-origin, I need to set
 * credentials to 'include'.
 *
 * I always check response.ok to handle HTTP errors. For long-running requests,
 * I use AbortController to implement timeouts or cancel on component unmount.
 *
 * The same pattern works for PUT and PATCH - just change the method. PUT
 * replaces the entire resource, PATCH is for partial updates. DELETE usually
 * doesn't need a body."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ method: 'POST', headers, body in options object
 * ✓ JSON.stringify for JSON, FormData for files
 * ✓ credentials: 'include' for cross-origin cookies
 * ✓ AbortController for cancellation
 * ✓ PUT vs PATCH difference
 *
 */


// RUN: node docs/27-web-apis/02-fetch-advanced.js
