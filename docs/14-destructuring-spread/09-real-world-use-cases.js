/**
 * CHALLENGE 09: Real-World Use Cases
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THESE ARE ACTUAL PATTERNS YOU'LL USE IN PRODUCTION CODE                   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 1: React Component with Props
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Use Case 1: React Component ═══\n");

/**
 * SCENARIO: You're building a Button component in React.
 * It needs some props for styling, some for behavior, and should
 * forward remaining props to the HTML button element.
 */

function Button({
  // Extract known props with defaults
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  // Collect remaining for forwarding
  ...htmlProps
}) {
  const className = `btn btn-${variant} btn-${size}`;

  console.log('Button rendering:');
  console.log('  Variant:', variant);
  console.log('  Size:', size);
  console.log('  Disabled:', disabled);
  console.log('  Text:', children);
  console.log('  Forwarded props:', htmlProps);

  // In React: <button className={className} disabled={disabled} {...htmlProps}>{children}</button>
}

Button({
  children: 'Submit',
  variant: 'success',
  type: 'submit',
  onClick: () => console.log('clicked'),
  'data-testid': 'submit-btn'
});

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 2: API Response Processing
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Use Case 2: API Response ═══\n");

/**
 * SCENARIO: You fetch data from an API that returns a complex structure.
 * You need to extract specific fields and transform the data.
 */

const apiResponse = {
  status: 'success',
  data: {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' }
    ],
    pagination: {
      total: 100,
      page: 1,
      perPage: 10
    }
  },
  meta: {
    requestId: 'abc123',
    timestamp: Date.now()
  }
};

// Extract and transform
const {
  status,
  data: {
    users,
    pagination: { total, page }
  },
  meta: { requestId }
} = apiResponse;

console.log('Status:', status);
console.log('Request ID:', requestId);
console.log('Page', page, 'of', Math.ceil(total / 10));

// Transform users - extract only what we need for display
const displayUsers = users.map(({ name, role }) => ({ name, role }));
console.log('Users:', displayUsers);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 3: Redux/State Management
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Use Case 3: Redux State Updates ═══\n");

/**
 * SCENARIO: You're writing a Redux reducer that needs to update
 * nested state immutably.
 */

const initialState = {
  user: {
    profile: {
      name: 'John',
      email: 'john@example.com'
    },
    settings: {
      theme: 'light',
      notifications: true
    }
  },
  posts: [
    { id: 1, title: 'First Post', likes: 10 },
    { id: 2, title: 'Second Post', likes: 5 }
  ],
  loading: false
};

// Action: Update user's theme
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_THEME':
      return {
        ...state,
        user: {
          ...state.user,
          settings: {
            ...state.user.settings,
            theme: action.payload
          }
        }
      };

    case 'LIKE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload
            ? { ...post, likes: post.likes + 1 }
            : post
        )
      };

    case 'ADD_POST':
      return {
        ...state,
        posts: [...state.posts, action.payload]
      };

    default:
      return state;
  }
}

let state = initialState;
console.log('Initial theme:', state.user.settings.theme);

state = reducer(state, { type: 'UPDATE_THEME', payload: 'dark' });
console.log('After UPDATE_THEME:', state.user.settings.theme);
console.log('Original unchanged:', initialState.user.settings.theme);

state = reducer(state, { type: 'LIKE_POST', payload: 1 });
console.log('After LIKE_POST:', state.posts[0].likes);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 4: Configuration Merging
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Use Case 4: Config Merging ═══\n");

/**
 * SCENARIO: Your app has default config, environment-specific config,
 * and user-provided config. They need to be merged with proper precedence.
 */

const defaultConfig = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 5000,
    retries: 3
  },
  features: {
    darkMode: false,
    analytics: true
  },
  debug: false
};

const envConfig = {
  api: {
    baseUrl: 'https://api.production.com'
  },
  debug: false
};

const userConfig = {
  features: {
    darkMode: true
  }
};

// Merge with proper precedence (later wins)
const finalConfig = {
  ...defaultConfig,
  api: { ...defaultConfig.api, ...envConfig.api },
  features: { ...defaultConfig.features, ...userConfig.features },
  debug: envConfig.debug ?? defaultConfig.debug
};

console.log('Final Config:', JSON.stringify(finalConfig, null, 2));

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 5: Event Handlers
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Use Case 5: Event Handlers ═══\n");

/**
 * SCENARIO: You're handling form events and need to extract
 * specific values from the event object.
 */

function handleSubmit(event) {
  // In React: event.preventDefault();

  // Destructure what we need from event.target
  const { name, email, password } = event.target.elements;

  console.log('Form submitted:');
  console.log('  Name:', name.value);
  console.log('  Email:', email.value);
  console.log('  Password:', password.value.replace(/./g, '*'));
}

// Simulate form event
const fakeEvent = {
  target: {
    elements: {
      name: { value: 'John Doe' },
      email: { value: 'john@example.com' },
      password: { value: 'secret123' }
    }
  }
};

handleSubmit(fakeEvent);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 6: Data Transformation Pipeline
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Use Case 6: Data Pipeline ═══\n");

/**
 * SCENARIO: You receive raw data from an API and need to
 * transform it through multiple steps.
 */

const rawOrders = [
  { id: 1, customer: { name: 'Alice', email: 'a@test.com' }, items: [{ price: 100 }, { price: 50 }], status: 'completed' },
  { id: 2, customer: { name: 'Bob', email: 'b@test.com' }, items: [{ price: 200 }], status: 'pending' },
  { id: 3, customer: { name: 'Charlie', email: 'c@test.com' }, items: [{ price: 75 }, { price: 25 }], status: 'completed' }
];

// Pipeline with destructuring at each step
const completedOrdersSummary = rawOrders
  // Filter completed orders
  .filter(({ status }) => status === 'completed')
  // Calculate total for each order
  .map(({ id, customer: { name }, items }) => ({
    orderId: id,
    customerName: name,
    total: items.reduce((sum, { price }) => sum + price, 0)
  }))
  // Sort by total (descending)
  .sort(({ total: a }, { total: b }) => b - a);

console.log('Completed Orders:', completedOrdersSummary);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 7: Module Exports
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Use Case 7: Module Imports ═══\n");

/**
 * SCENARIO: You're importing utilities and want to rename
 * them to avoid conflicts or improve clarity.
 */

// Simulating: import { useState, useEffect, useCallback: useCb } from 'react';
const fakeReact = {
  useState: () => console.log('useState'),
  useEffect: () => console.log('useEffect'),
  useCallback: () => console.log('useCallback')
};

const { useState: us, useEffect: ue, useCallback: useCb } = fakeReact;
console.log('Renamed imports available:', typeof us, typeof ue, typeof useCb);

// Or destructure in function (common in tests)
function setup() {
  const { useState, useEffect } = fakeReact;
  return { useState, useEffect };
}

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SUMMARY: WHEN TO USE WHAT                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ React Components:                                                           │
 * │   → Object destructuring for props                                          │
 * │   → Rest (...props) for forwarding to DOM elements                         │
 * │                                                                             │
 * │ API Responses:                                                              │
 * │   → Nested destructuring to extract deep values                            │
 * │   → Array destructuring with map for transformations                       │
 * │                                                                             │
 * │ State Management:                                                           │
 * │   → Spread for immutable updates                                            │
 * │   → map + spread for updating array items                                  │
 * │                                                                             │
 * │ Config:                                                                     │
 * │   → Spread merging with precedence (later wins)                            │
 * │                                                                             │
 * │ Event Handlers:                                                             │
 * │   → Destructure event.target properties                                    │
 * │                                                                             │
 * │ Data Pipelines:                                                             │
 * │   → Destructure in filter/map callbacks                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/14-destructuring-spread/09-real-world-use-cases.js
 */
