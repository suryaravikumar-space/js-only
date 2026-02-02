/**
 * TOPIC: createSlice Deep Dive — Reducers, Prepare Callbacks, extraReducers
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  createSlice = name + initialState + reducers.        ║
 * ║  It auto-generates action types like 'name/reducer'.  ║
 * ║  Use prepare for custom payload shapes.               ║
 * ║  Use extraReducers for external actions (thunks).     ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌── ANATOMY ────────────────────────────────────────────┐
 * │ createSlice({                                         │
 * │   name: 'todos',        ← prefix for action types    │
 * │   initialState: [],     ← default state              │
 * │   reducers: {           ← case reducers              │
 * │     add(state, action) { ... }                        │
 * │   },                                                  │
 * │   extraReducers(builder) { ... } ← external actions  │
 * │ })                                                    │
 * └───────────────────────────────────────────────────────┘
 */

// --- Simulating createSlice behavior ---

// A: Basic createSlice simulation
console.log('A: createSlice simulation:');

function createSlice({ name, initialState, reducers }) {
  const actions = {};
  const caseReducers = {};

  for (const key in reducers) {
    const type = `${name}/${key}`;
    caseReducers[type] = reducers[key];

    // Auto-generate action creator
    actions[key] = (payload) => ({ type, payload });
    actions[key].type = type;
  }

  function reducer(state = initialState, action) {
    if (caseReducers[action.type]) {
      // In real RTK, Immer wraps this
      const draft = JSON.parse(JSON.stringify(state));
      const result = caseReducers[action.type](draft, action);
      return result !== undefined ? result : draft;
    }
    return state;
  }

  return { name, actions, reducer };
}

// B: Usage
const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], nextId: 1 },
  reducers: {
    add(state, action) {
      state.items.push({
        id: state.nextId++,
        text: action.payload,
        done: false
      });
    },
    toggle(state, action) {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    remove(state, action) {
      state.items = state.items.filter(t => t.id !== action.payload);
    }
  }
});

const { add, toggle, remove } = todosSlice.actions;

console.log(`  Action type: ${add.type}`);       // todos/add
console.log(`  Action: ${JSON.stringify(add('Learn RTK'))}`);

// Test the reducer
let state = todosSlice.reducer(undefined, { type: '@@INIT' });
state = todosSlice.reducer(state, add('Learn RTK'));
state = todosSlice.reducer(state, add('Build app'));
state = todosSlice.reducer(state, toggle(1));
console.log(`  State: ${JSON.stringify(state)}`);

// C: prepare callback pattern (pseudo-code)
console.log('\nC: prepare callback (pseudo-code):');
console.log(`
  // Use prepare when you need to customize payload shape
  const todosSlice = createSlice({
    name: 'todos',
    initialState: [],
    reducers: {
      addTodo: {
        reducer(state, action) {
          state.push(action.payload);
        },
        prepare(text) {
          return {
            payload: {
              id: nanoid(),       // auto-generate ID
              text,
              done: false,
              createdAt: new Date().toISOString()
            }
          };
        }
      }
    }
  });

  // dispatch(addTodo('Learn RTK'))
  // action = { type: 'todos/addTodo', payload: { id: 'abc', text: 'Learn RTK', ... } }
`);

// D: extraReducers pattern (pseudo-code)
console.log('D: extraReducers (pseudo-code):');
console.log(`
  // Use extraReducers to handle actions from OTHER slices or createAsyncThunk

  const todosSlice = createSlice({
    name: 'todos',
    initialState: { items: [], status: 'idle' },
    reducers: { ... },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTodos.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchTodos.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(fetchTodos.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        // Listen to another slice's action:
        .addCase(userSlice.actions.logout, (state) => {
          state.items = [];
        });
    }
  });
`);

// E: Multiple slices working together
console.log('\nE: Multiple slices in store:');
console.log(`
  // counterSlice.js
  const counterSlice = createSlice({ name: 'counter', ... });

  // todosSlice.js
  const todosSlice = createSlice({ name: 'todos', ... });

  // store.js
  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,   // state.counter
      todos: todosSlice.reducer,       // state.todos
    }
  });

  // In component:
  const count = useSelector(state => state.counter.value);
  const todos = useSelector(state => state.todos.items);
`);

/**
 * ┌── INTERVIEW ANSWER ───────────────────────────────────┐
 * │ createSlice takes name, initialState, reducers. Auto-  │
 * │ generates action types (name/reducer) and creators.    │
 * │ Use prepare callback for custom payload shapes.        │
 * │ Use extraReducers (builder pattern) for external       │
 * │ actions like createAsyncThunk lifecycle actions.        │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/redux/02-createSlice-deep-dive.js
 */
