/**
 * TOPIC: RTK Query — Data Fetching & Caching in Redux Toolkit
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  RTK Query = data fetching + caching built into RTK.  ║
 * ║  Define endpoints once, get auto-generated hooks.     ║
 * ║  No more manual loading/error/data state management.  ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── RTK QUERY vs MANUAL ────────────────────────────────┐
 * │                                                       │
 * │  MANUAL (createAsyncThunk):     RTK QUERY:            │
 * │  - Write thunk                  - Define endpoint     │
 * │  - Write extraReducers          - Use auto-hook       │
 * │  - Manage loading state         - ✅ Auto loading     │
 * │  - Manage error state           - ✅ Auto error       │
 * │  - Manual cache invalidation    - ✅ Auto caching     │
 * │  - Manual deduplication         - ✅ Auto dedup       │
 * │  = ~50 lines per endpoint       = ~5 lines            │
 * │                                                       │
 * └───────────────────────────────────────────────────────┘
 */

// All RTK Query code is pseudo-code (requires npm packages)

// --- A: createApi setup ---
console.log('A: createApi setup:');
console.log(`
  import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

  export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Post', 'User'],     // for cache invalidation
    endpoints: (builder) => ({

      // GET request — query endpoint
      getPosts: builder.query({
        query: () => '/posts',
        providesTags: ['Post'],
      }),

      // GET with params
      getPostById: builder.query({
        query: (id) => \`/posts/\${id}\`,
        providesTags: (result, error, id) => [{ type: 'Post', id }],
      }),

      // POST/PUT/DELETE — mutation endpoint
      addPost: builder.mutation({
        query: (newPost) => ({
          url: '/posts',
          method: 'POST',
          body: newPost,
        }),
        invalidatesTags: ['Post'],   // refetch getPosts
      }),

      updatePost: builder.mutation({
        query: ({ id, ...body }) => ({
          url: \`/posts/\${id}\`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
      }),

      deletePost: builder.mutation({
        query: (id) => ({
          url: \`/posts/\${id}\`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
      }),
    }),
  });

  // Auto-generated hooks!
  export const {
    useGetPostsQuery,
    useGetPostByIdQuery,
    useAddPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
  } = apiSlice;
`);

// --- B: Store setup ---
console.log('B: Store setup with RTK Query:');
console.log(`
  import { configureStore } from '@reduxjs/toolkit';
  import { apiSlice } from './apiSlice';

  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      // ...other reducers
    },
    middleware: (getDefault) =>
      getDefault().concat(apiSlice.middleware),
  });
`);

// --- C: Using query hooks ---
console.log('C: Using query hooks in components:');
console.log(`
  function PostsList() {
    const {
      data: posts,      // the fetched data
      isLoading,        // first load
      isFetching,       // any fetch (including refetch)
      isError,          // request failed
      error,            // error details
      isSuccess,        // request succeeded
      refetch,          // manually refetch
    } = useGetPostsQuery();

    if (isLoading) return <Spinner />;
    if (isError) return <p>Error: {error.message}</p>;

    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    );
  }
`);

// --- D: Using mutation hooks ---
console.log('D: Using mutation hooks:');
console.log(`
  function AddPostForm() {
    const [addPost, { isLoading }] = useAddPostMutation();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await addPost({ title: 'New Post', body: 'Content' }).unwrap();
        // unwrap() throws on error, resolves on success
        alert('Post added!');
      } catch (err) {
        alert('Failed: ' + err.message);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <button disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Post'}
        </button>
      </form>
    );
  }
`);

// --- E: Cache & Tags ---
console.log('E: Cache invalidation with tags:');
console.log(`
  ┌─────────────────────────────────────────────┐
  │ providesTags   → "this query provides data  │
  │                   tagged as 'Post'"          │
  │                                              │
  │ invalidatesTags→ "this mutation invalidates  │
  │                   cached data tagged 'Post'" │
  │                                              │
  │ Flow:                                        │
  │ 1. getPosts provides ['Post']                │
  │ 2. addPost invalidates ['Post']              │
  │ 3. RTK Query auto-refetches getPosts!        │
  └─────────────────────────────────────────────┘

  // Granular invalidation:
  providesTags: (result) =>
    result
      ? [...result.map(({ id }) => ({ type: 'Post', id })), 'Post']
      : ['Post'],

  // Only refetch the specific post that changed:
  invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
`);

// --- F: Query options ---
console.log('F: Useful query options:');
console.log(`
  useGetPostsQuery(undefined, {
    pollingInterval: 30000,       // refetch every 30s
    skip: !isLoggedIn,            // skip if condition false
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,         // refetch when tab gets focus
    refetchOnReconnect: true,     // refetch on network reconnect
  });
`);

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ RTK Query: define API endpoints in createApi, get     │
 * │ auto-generated hooks (useGetXQuery, useXMutation).    │
 * │ Handles loading/error/caching/dedup automatically.    │
 * │ Tags system (providesTags/invalidatesTags) manages    │
 * │ cache invalidation. Replaces manual thunk patterns.   │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/redux/06-rtk-query.js
 */
