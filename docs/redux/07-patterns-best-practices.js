/**
 * TOPIC: Redux Patterns & Best Practices
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Keep state minimal. Derive everything else.          ║
 * ║  Normalize nested data. Use RTK patterns.             ║
 * ╚════════════════════════════════════════════════════════╝
 */

// --- A: State normalization ---
console.log('A: Normalize state (avoid nested/duplicate data):');

// ❌ BAD — nested, duplicated data
const badState = {
  posts: [
    {
      id: 1,
      title: 'Redux',
      author: { id: 1, name: 'Alice' },
      comments: [
        { id: 1, text: 'Great!', author: { id: 2, name: 'Bob' } }
      ]
    }
  ]
};

// ✅ GOOD — normalized (like a database)
const goodState = {
  posts: {
    ids: [1, 2],
    entities: {
      1: { id: 1, title: 'Redux', authorId: 1, commentIds: [1] },
      2: { id: 2, title: 'RTK', authorId: 2, commentIds: [] }
    }
  },
  users: {
    ids: [1, 2],
    entities: {
      1: { id: 1, name: 'Alice' },
      2: { id: 2, name: 'Bob' }
    }
  },
  comments: {
    ids: [1],
    entities: {
      1: { id: 1, text: 'Great!', authorId: 2, postId: 1 }
    }
  }
};

console.log(`  Normalized: O(1) lookup by ID`);
console.log(`  Post 1: ${JSON.stringify(goodState.posts.entities[1])}`);

// --- B: createEntityAdapter ---
console.log('\nB: createEntityAdapter (pseudo-code):');
console.log(`
  import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

  const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
  });

  const postsSlice = createSlice({
    name: 'posts',
    initialState: postsAdapter.getInitialState({ status: 'idle' }),
    // initialState = { ids: [], entities: {}, status: 'idle' }
    reducers: {
      postAdded: postsAdapter.addOne,
      postsReceived: postsAdapter.setAll,
      postUpdated: postsAdapter.updateOne,
      postRemoved: postsAdapter.removeOne,
    }
  });

  // Auto-generated selectors:
  export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
  } = postsAdapter.getSelectors(state => state.posts);
`);

// --- C: Folder structure ---
console.log('C: Recommended folder structure:');
console.log(`
  ┌── Feature-based (recommended) ─────────────────┐
  │                                                  │
  │  src/                                            │
  │  ├── app/                                        │
  │  │   ├── store.js        ← configureStore        │
  │  │   └── hooks.js        ← typed hooks           │
  │  ├── features/                                   │
  │  │   ├── posts/                                  │
  │  │   │   ├── postsSlice.js  ← slice + selectors  │
  │  │   │   ├── PostsList.jsx  ← component          │
  │  │   │   └── PostForm.jsx                        │
  │  │   ├── users/                                  │
  │  │   │   ├── usersSlice.js                       │
  │  │   │   └── UserProfile.jsx                     │
  │  │   └── api/                                    │
  │  │       └── apiSlice.js    ← RTK Query          │
  │  └── common/                                     │
  │      └── components/                             │
  └──────────────────────────────────────────────────┘
`);

// --- D: What goes in Redux vs local state ---
console.log('D: Redux state vs local state:');
console.log(`
  ┌───────────────────┬────────────────────────────┐
  │ PUT IN REDUX      │ KEEP LOCAL (useState)       │
  ├───────────────────┼────────────────────────────┤
  │ Server data cache │ Form input values           │
  │ Auth state        │ UI toggles (modal open)     │
  │ User preferences  │ Hover/focus state           │
  │ Notifications     │ Component animation state   │
  │ Shopping cart     │ Dropdown open/close          │
  │ Filters applied   │ Scroll position              │
  │ globally          │ Temp validation errors       │
  └───────────────────┴────────────────────────────┘
`);

// --- E: Common mistakes ---
console.log('E: Common Redux mistakes:');

// Mistake 1: Putting everything in Redux
console.log(`
  ❌ Don't put form input in Redux
  ❌ Don't put modal open/close in Redux
  ❌ Don't put derived data in state (compute it)

  ✅ Keep state minimal, derive the rest
  ✅ Use selectors for computed values
  ✅ Local state for component-specific UI
`);

// Mistake 2: Not using RTK
console.log(`
  ❌ Don't write Redux from scratch anymore
  ✅ Always use Redux Toolkit (RTK)
  ✅ Use createSlice, not switch/case reducers
  ✅ Use RTK Query for API calls
`);

// --- F: Performance tips ---
console.log('F: Performance tips:');
console.log(`
  1. Use memoized selectors (createSelector)
  2. Keep useSelector return values small
     ❌ useSelector(state => state)  // entire store
     ✅ useSelector(state => state.counter.value)

  3. Use shallowEqual for object/array returns:
     import { shallowEqual } from 'react-redux';
     const { a, b } = useSelector(state => ({
       a: state.a,
       b: state.b
     }), shallowEqual);

  4. Split large slices into smaller ones
  5. Use createEntityAdapter for collections
`);

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ Best practices: normalize state, use RTK always,      │
 * │ feature-based folders, minimal Redux state (derive    │
 * │ the rest). createEntityAdapter for collections.       │
 * │ Memoized selectors for performance. RTK Query for API.│
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/redux/07-patterns-best-practices.js
 */
