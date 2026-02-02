/**
 * TOPIC: createAsyncThunk — Async Logic in Redux Toolkit
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  createAsyncThunk generates 3 action types:           ║
 * ║  pending, fulfilled, rejected. Handle them in         ║
 * ║  extraReducers to manage loading/success/error state. ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── LIFECYCLE ──────────────────────────────────────────┐
 * │                                                       │
 * │  dispatch(fetchUsers())                               │
 * │       │                                               │
 * │       ├─→ pending   → { status: 'loading' }          │
 * │       │                                               │
 * │       ├─→ fulfilled → { status: 'succeeded', data }  │
 * │       │                                               │
 * │       └─→ rejected  → { status: 'failed', error }    │
 * │                                                       │
 * └───────────────────────────────────────────────────────┘
 */

// --- Simulating createAsyncThunk ---

// A: Manual thunk (what Redux Thunk middleware enables)
console.log('A: What is a thunk?');
console.log(`
  A thunk is a function that returns a function.
  Redux Thunk middleware lets you dispatch functions
  (instead of plain objects) that can do async work.

  // Manual thunk:
  function fetchUsers() {
    return async (dispatch, getState) => {
      dispatch({ type: 'users/loading' });
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        dispatch({ type: 'users/loaded', payload: data });
      } catch (err) {
        dispatch({ type: 'users/error', payload: err.message });
      }
    };
  }
`);

// B: createAsyncThunk simplifies this
console.log('B: createAsyncThunk (pseudo-code):');
console.log(`
  import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

  // Define the thunk
  const fetchUsers = createAsyncThunk(
    'users/fetchUsers',          // action type prefix
    async (arg, thunkAPI) => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed');
      return response.json();    // this becomes action.payload
    }
  );

  // Generated action types:
  // 'users/fetchUsers/pending'
  // 'users/fetchUsers/fulfilled'
  // 'users/fetchUsers/rejected'
`);

// C: Handling in extraReducers
console.log('C: extraReducers pattern:');
console.log(`
  const usersSlice = createSlice({
    name: 'users',
    initialState: {
      items: [],
      status: 'idle',    // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsers.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    }
  });
`);

// D: Simulating the flow
console.log('D: Simulating async thunk flow:');

function simulateCreateAsyncThunk(typePrefix, payloadCreator) {
  const pending = `${typePrefix}/pending`;
  const fulfilled = `${typePrefix}/fulfilled`;
  const rejected = `${typePrefix}/rejected`;

  function thunk(arg) {
    return async (dispatch) => {
      dispatch({ type: pending });
      try {
        const result = await payloadCreator(arg);
        dispatch({ type: fulfilled, payload: result });
      } catch (err) {
        dispatch({ type: rejected, error: { message: err.message } });
      }
    };
  }

  thunk.pending = pending;
  thunk.fulfilled = fulfilled;
  thunk.rejected = rejected;

  return thunk;
}

const fetchUsers = simulateCreateAsyncThunk(
  'users/fetchUsers',
  async () => {
    // Simulating API call
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]), 100);
    });
  }
);

console.log(`  Pending type: ${fetchUsers.pending}`);
console.log(`  Fulfilled type: ${fetchUsers.fulfilled}`);
console.log(`  Rejected type: ${fetchUsers.rejected}`);

// Simulate dispatch
const actions = [];
const fakeDispatch = (action) => {
  actions.push(action);
  console.log(`  Dispatched: ${action.type}`, action.payload ? `→ ${JSON.stringify(action.payload)}` : '');
};

fetchUsers()(fakeDispatch).then(() => {
  console.log(`  Total actions dispatched: ${actions.length}`);

  // E: thunkAPI — what's available inside
  console.log('\nE: thunkAPI object:');
  console.log(`
    createAsyncThunk('type', async (arg, thunkAPI) => {
      // thunkAPI contains:
      thunkAPI.dispatch(someAction());     // dispatch other actions
      thunkAPI.getState();                 // access current state
      thunkAPI.rejectWithValue('error');   // custom rejection
      thunkAPI.signal;                     // AbortController signal
    });

    // rejectWithValue example:
    const fetchUser = createAsyncThunk('user/fetch',
      async (userId, { rejectWithValue }) => {
        const res = await fetch('/api/user/' + userId);
        if (!res.ok) {
          return rejectWithValue({ status: res.status, message: 'Not found' });
        }
        return res.json();
      }
    );

    // In extraReducers:
    .addCase(fetchUser.rejected, (state, action) => {
      state.error = action.payload;  // { status: 404, message: 'Not found' }
    })
  `);

  // F: Using in component
  console.log('F: Using createAsyncThunk in component:');
  console.log(`
    function UserList() {
      const dispatch = useDispatch();
      const { items, status, error } = useSelector(state => state.users);

      useEffect(() => {
        if (status === 'idle') {
          dispatch(fetchUsers());
        }
      }, [status, dispatch]);

      if (status === 'loading') return <Spinner />;
      if (status === 'failed') return <Error message={error} />;

      return (
        <ul>
          {items.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
      );
    }
  `);
});

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ createAsyncThunk auto-generates pending/fulfilled/    │
 * │ rejected action types. Handle in extraReducers.       │
 * │ thunkAPI gives dispatch, getState, rejectWithValue.   │
 * │ Pattern: status idle→loading→succeeded/failed.        │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/redux/03-createAsyncThunk.js
 */
