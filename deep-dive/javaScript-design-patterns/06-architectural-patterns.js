/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 6: ARCHITECTURAL PATTERNS IN JAVASCRIPT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Architectural patterns define the high-level structure of software systems.
 * They provide templates for organizing code at the application level.
 *
 * INTERVIEW CONTEXT:
 * Understanding architectural patterns shows you can:
 * - Design scalable applications
 * - Separate concerns effectively
 * - Make informed technology decisions
 * - Communicate with senior engineers about system design
 *
 * PATTERNS COVERED:
 * 1. MVC (Model-View-Controller)
 * 2. MVP (Model-View-Presenter)
 * 3. MVVM (Model-View-ViewModel)
 * 4. Clean Architecture / Hexagonal
 * 5. Microservices Communication Patterns
 * 6. Repository Pattern
 * 7. Service Layer Pattern
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 6: ARCHITECTURAL PATTERNS IN JAVASCRIPT");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │            ARCHITECTURAL PATTERNS VS DESIGN PATTERNS                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   SCOPE COMPARISON:                                                     │
 * │   ═════════════════                                                     │
 * │                                                                          │
 * │   Design Patterns          │  Architectural Patterns                    │
 * │   ─────────────────────────│────────────────────────────────────────    │
 * │   Class/Object level       │  Application/System level                  │
 * │   Solve coding problems    │  Solve structural problems                 │
 * │   Examples:                │  Examples:                                 │
 * │   - Singleton              │  - MVC                                     │
 * │   - Factory                │  - Microservices                           │
 * │   - Observer               │  - Clean Architecture                      │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐  │
 * │   │                                                                  │  │
 * │   │            APPLICATION ARCHITECTURE LAYERS                      │  │
 * │   │                                                                  │  │
 * │   │   ┌──────────────────────────────────────────────────────────┐ │  │
 * │   │   │                  PRESENTATION LAYER                       │ │  │
 * │   │   │              (UI, Views, Controllers)                     │ │  │
 * │   │   └────────────────────────┬─────────────────────────────────┘ │  │
 * │   │                            │                                    │  │
 * │   │   ┌────────────────────────▼─────────────────────────────────┐ │  │
 * │   │   │                  BUSINESS LOGIC LAYER                     │ │  │
 * │   │   │            (Services, Use Cases, Domain)                  │ │  │
 * │   │   └────────────────────────┬─────────────────────────────────┘ │  │
 * │   │                            │                                    │  │
 * │   │   ┌────────────────────────▼─────────────────────────────────┐ │  │
 * │   │   │                   DATA ACCESS LAYER                       │ │  │
 * │   │   │          (Repositories, Data Sources, APIs)               │ │  │
 * │   │   └──────────────────────────────────────────────────────────┘ │  │
 * │   │                                                                  │  │
 * │   └─────────────────────────────────────────────────────────────────┘  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 1: MVC (Model-View-Controller)                   ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MVC PATTERN                                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  MVC separates an application into three interconnected components:     │
 * │  - Model: Data and business logic                                       │
 * │  - View: User interface presentation                                    │
 * │  - Controller: Handles user input, updates Model and View               │
 * │                                                                          │
 * │  HISTORY & CONTEXT:                                                     │
 * │  • Invented at Xerox PARC in 1979                                       │
 * │  • Foundation for most UI frameworks                                    │
 * │  • Used in: Express.js (backend), Backbone.js (frontend)                │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │                        MVC FLOW                                  │    │
 * │  │                                                                  │    │
 * │  │         User Action                                             │    │
 * │  │              │                                                   │    │
 * │  │              ▼                                                   │    │
 * │  │      ┌──────────────┐                                           │    │
 * │  │      │  CONTROLLER  │                                           │    │
 * │  │      │              │                                           │    │
 * │  │      │ Handles      │                                           │    │
 * │  │      │ user input   │                                           │    │
 * │  │      └───────┬──────┘                                           │    │
 * │  │              │ updates                                          │    │
 * │  │              ▼                                                   │    │
 * │  │      ┌──────────────┐         notifies        ┌──────────────┐ │    │
 * │  │      │    MODEL     │ ───────────────────────►│    VIEW      │ │    │
 * │  │      │              │                         │              │ │    │
 * │  │      │ Data &       │         queries         │ UI           │ │    │
 * │  │      │ Business     │◄───────────────────────│ Presentation │ │    │
 * │  │      │ Logic        │                         │              │ │    │
 * │  │      └──────────────┘                         └──────────────┘ │    │
 * │  │                                                      │          │    │
 * │  │                                                      ▼          │    │
 * │  │                                               Renders to User   │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  KEY PRINCIPLES:                                                        │
 * │  ───────────────                                                        │
 * │  1. Separation of Concerns: Each component has one job                  │
 * │  2. Loose Coupling: Components can be changed independently             │
 * │  3. Testability: Each part can be tested in isolation                   │
 * │                                                                          │
 * │  WHEN TO USE:                                                           │
 * │  • Web applications with clear UI/logic separation                      │
 * │  • Applications where multiple views show same data                     │
 * │  • When you need testable business logic                                │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// MVC: Complete Implementation - Todo Application
// ═══════════════════════════════════════════════════════════════════════════

/**
 * MODEL
 * Responsible for:
 * - Storing application data
 * - Business logic and validation
 * - Notifying observers (Views) of changes
 *
 * The Model knows nothing about Views or Controllers.
 * It simply manages data and broadcasts changes.
 */
class TodoModel {
    constructor() {
        this.todos = [];
        this.observers = [];
        this.nextId = 1;
    }

    // Observer pattern for View updates
    subscribe(observer) {
        this.observers.push(observer);
        // Return unsubscribe function
        return () => {
            this.observers = this.observers.filter(o => o !== observer);
        };
    }

    _notify() {
        this.observers.forEach(observer => observer(this.getTodos()));
    }

    // Business logic methods
    addTodo(text) {
        if (!text || text.trim() === "") {
            throw new Error("Todo text cannot be empty");
        }

        const todo = {
            id: this.nextId++,
            text: text.trim(),
            completed: false,
            createdAt: new Date()
        };

        this.todos.push(todo);
        this._notify();
        return todo;
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this._notify();
        }
        return todo;
    }

    deleteTodo(id) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index > -1) {
            this.todos.splice(index, 1);
            this._notify();
            return true;
        }
        return false;
    }

    getTodos() {
        // Return copy to prevent external mutation
        return this.todos.map(t => ({ ...t }));
    }

    getCompletedCount() {
        return this.todos.filter(t => t.completed).length;
    }

    getPendingCount() {
        return this.todos.filter(t => !t.completed).length;
    }
}

/**
 * VIEW
 * Responsible for:
 * - Rendering the UI
 * - Displaying data from the Model
 * - Capturing user input (but delegating handling to Controller)
 *
 * The View observes the Model and re-renders when data changes.
 * It doesn't modify data directly - it calls Controller methods.
 */
class TodoView {
    constructor() {
        this.onAddTodo = null;      // Event handlers set by Controller
        this.onToggleTodo = null;
        this.onDeleteTodo = null;
    }

    // Bind event handlers (called by Controller)
    bindAddTodo(handler) {
        this.onAddTodo = handler;
    }

    bindToggleTodo(handler) {
        this.onToggleTodo = handler;
    }

    bindDeleteTodo(handler) {
        this.onDeleteTodo = handler;
    }

    // Render the todo list
    render(todos) {
        console.log("\n    ┌─────────────────────────────────────┐");
        console.log("    │           TODO LIST                 │");
        console.log("    ├─────────────────────────────────────┤");

        if (todos.length === 0) {
            console.log("    │  No todos yet. Add one!            │");
        } else {
            todos.forEach(todo => {
                const status = todo.completed ? "✓" : "○";
                const text = todo.text.padEnd(30).slice(0, 30);
                console.log(`    │  ${status} [${todo.id}] ${text}│`);
            });
        }

        console.log("    └─────────────────────────────────────┘");
    }

    // Simulate user input (in real app, this would be DOM events)
    simulateAddTodo(text) {
        if (this.onAddTodo) {
            console.log(`    [View] User adding: "${text}"`);
            this.onAddTodo(text);
        }
    }

    simulateToggleTodo(id) {
        if (this.onToggleTodo) {
            console.log(`    [View] User toggling todo ${id}`);
            this.onToggleTodo(id);
        }
    }
}

/**
 * CONTROLLER
 * Responsible for:
 * - Handling user input from View
 * - Updating the Model based on user actions
 * - Coordinating between Model and View
 *
 * The Controller is the "glue" between Model and View.
 */
class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Subscribe View to Model changes
        this.model.subscribe((todos) => {
            this.view.render(todos);
        });

        // Bind View events to Controller handlers
        this.view.bindAddTodo(this.handleAddTodo.bind(this));
        this.view.bindToggleTodo(this.handleToggleTodo.bind(this));
        this.view.bindDeleteTodo(this.handleDeleteTodo.bind(this));

        // Initial render
        this.view.render(this.model.getTodos());
    }

    handleAddTodo(text) {
        try {
            this.model.addTodo(text);
            console.log("    [Controller] Todo added successfully");
        } catch (error) {
            console.log(`    [Controller] Error: ${error.message}`);
        }
    }

    handleToggleTodo(id) {
        const todo = this.model.toggleTodo(id);
        if (todo) {
            console.log(`    [Controller] Todo ${id} toggled to ${todo.completed ? "completed" : "pending"}`);
        }
    }

    handleDeleteTodo(id) {
        if (this.model.deleteTodo(id)) {
            console.log(`    [Controller] Todo ${id} deleted`);
        }
    }

    // Controller can also expose Model data to View
    getStats() {
        return {
            total: this.model.getTodos().length,
            completed: this.model.getCompletedCount(),
            pending: this.model.getPendingCount()
        };
    }
}

console.log("MVC Pattern - Todo Application:");

// Initialize MVC components
const todoModel = new TodoModel();
const todoView = new TodoView();
const todoController = new TodoController(todoModel, todoView);

// Simulate user interactions
todoView.simulateAddTodo("Learn MVC Pattern");
todoView.simulateAddTodo("Build an MVC App");
todoView.simulateToggleTodo(1);

console.log("\n    Stats:", todoController.getStats());

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              MVC: INTERVIEW EXPLANATION                                  │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  "MVC separates an application into three parts: Model holds the data   │
 * │   and business logic, View handles the UI, and Controller processes     │
 * │   user input and coordinates between them.                              │
 * │                                                                          │
 * │   The key benefit is separation of concerns - you can change the UI     │
 * │   without touching business logic, and vice versa. Each component       │
 * │   can be tested independently.                                          │
 * │                                                                          │
 * │   In JavaScript:                                                        │
 * │   • Backend (Express): Routes are Controllers, Models are data layer    │
 * │   • Frontend: React components combine View + Controller, with          │
 * │     separate state management (Model)                                   │
 * │                                                                          │
 * │   MVC variations like MVP and MVVM evolved to address specific UI       │
 * │   binding and testing needs."                                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 2: MVVM (Model-View-ViewModel)                   ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MVVM PATTERN                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  MVVM introduces a ViewModel that exposes data streams to the View      │
 * │  and handles View logic. Two-way data binding connects View to ViewModel│
 * │                                                                          │
 * │  USED BY: Vue.js, Angular, Knockout.js, WPF                             │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │                        MVVM FLOW                                 │    │
 * │  │                                                                  │    │
 * │  │   ┌──────────────┐    Two-way    ┌──────────────┐              │    │
 * │  │   │     VIEW     │◄────────────►│  VIEWMODEL   │              │    │
 * │  │   │              │   Binding     │              │              │    │
 * │  │   │ UI (HTML/    │               │ Exposes:     │              │    │
 * │  │   │  Components) │               │ - Properties │              │    │
 * │  │   │              │               │ - Commands   │              │    │
 * │  │   └──────────────┘               │ - Computed   │              │    │
 * │  │                                  └───────┬──────┘              │    │
 * │  │                                          │                      │    │
 * │  │                                          │ updates              │    │
 * │  │                                          ▼                      │    │
 * │  │                                  ┌──────────────┐              │    │
 * │  │                                  │    MODEL     │              │    │
 * │  │                                  │              │              │    │
 * │  │                                  │ Domain data  │              │    │
 * │  │                                  │ & logic      │              │    │
 * │  │                                  └──────────────┘              │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  MVC vs MVVM:                                                           │
 * │  ════════════                                                           │
 * │  MVC:  Controller handles input, manually updates View                  │
 * │  MVVM: ViewModel exposes data, binding auto-updates View                │
 * │                                                                          │
 * │  KEY CONCEPTS:                                                          │
 * │  ─────────────                                                          │
 * │  • Data Binding: View automatically reflects ViewModel changes          │
 * │  • Commands: Actions exposed by ViewModel, bound to UI events           │
 * │  • Computed Properties: Derived values that auto-update                 │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// MVVM: Implementation with Reactive Binding
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simple reactive system for MVVM data binding.
 * In real frameworks, this is provided by Vue, Angular, etc.
 */
class Reactive {
    constructor(data) {
        this._data = data;
        this._bindings = new Map();
        this._computedCache = new Map();

        return new Proxy(this, {
            get: (target, prop) => {
                if (prop in target._data) {
                    return target._data[prop];
                }
                return target[prop];
            },
            set: (target, prop, value) => {
                if (prop in target._data) {
                    target._data[prop] = value;
                    target._notifyBindings(prop);
                    return true;
                }
                target[prop] = value;
                return true;
            }
        });
    }

    bind(prop, callback) {
        if (!this._bindings.has(prop)) {
            this._bindings.set(prop, []);
        }
        this._bindings.get(prop).push(callback);
        // Initial call
        callback(this._data[prop]);
    }

    _notifyBindings(prop) {
        const bindings = this._bindings.get(prop) || [];
        bindings.forEach(cb => cb(this._data[prop]));

        // Also notify computed that depend on this prop
        this._computedCache.forEach((computed, name) => {
            if (computed.deps.includes(prop)) {
                const newValue = computed.fn();
                const bindings = this._bindings.get(name) || [];
                bindings.forEach(cb => cb(newValue));
            }
        });
    }

    computed(name, fn, deps) {
        this._computedCache.set(name, { fn, deps });
        // Make it accessible like a property
        Object.defineProperty(this, name, {
            get: fn,
            enumerable: true
        });
    }
}

/**
 * MODEL - Domain data and business rules
 */
class UserModel {
    constructor(data = {}) {
        this.firstName = data.firstName || "";
        this.lastName = data.lastName || "";
        this.email = data.email || "";
        this.age = data.age || 0;
    }

    validate() {
        const errors = [];
        if (!this.firstName) errors.push("First name required");
        if (!this.lastName) errors.push("Last name required");
        if (!this.email.includes("@")) errors.push("Invalid email");
        if (this.age < 0 || this.age > 150) errors.push("Invalid age");
        return errors;
    }
}

/**
 * VIEWMODEL - Presentation logic and data binding
 */
class UserViewModel {
    constructor(model) {
        // Wrap model data in reactive system
        this.state = new Reactive({
            firstName: model.firstName,
            lastName: model.lastName,
            email: model.email,
            age: model.age,
            isEditing: false,
            errors: []
        });

        this.model = model;

        // Computed property
        this.state.computed("fullName", () => {
            return `${this.state.firstName} ${this.state.lastName}`;
        }, ["firstName", "lastName"]);

        this.state.computed("isValid", () => {
            return this.state.errors.length === 0;
        }, ["errors"]);
    }

    // Commands (actions that View can trigger)
    updateFirstName(value) {
        this.state.firstName = value;
        this.model.firstName = value;
        this._validate();
    }

    updateLastName(value) {
        this.state.lastName = value;
        this.model.lastName = value;
        this._validate();
    }

    updateEmail(value) {
        this.state.email = value;
        this.model.email = value;
        this._validate();
    }

    toggleEdit() {
        this.state.isEditing = !this.state.isEditing;
    }

    save() {
        this._validate();
        if (this.state.errors.length === 0) {
            console.log("    [ViewModel] Saving user...");
            this.state.isEditing = false;
            return true;
        }
        return false;
    }

    _validate() {
        this.state.errors = this.model.validate();
    }
}

/**
 * VIEW - Simulated UI with bindings
 */
class UserView {
    constructor(viewModel) {
        this.vm = viewModel;
        this._setupBindings();
    }

    _setupBindings() {
        // Bind to ViewModel properties (simulating Vue/Angular templates)
        this.vm.state.bind("firstName", (val) => {
            console.log(`    [View Binding] firstName = "${val}"`);
        });

        this.vm.state.bind("fullName", (val) => {
            console.log(`    [View Binding] fullName = "${val}"`);
        });

        this.vm.state.bind("errors", (val) => {
            if (val.length > 0) {
                console.log(`    [View Binding] errors = ${JSON.stringify(val)}`);
            }
        });
    }

    // Simulate user input (two-way binding)
    userTypesFirstName(value) {
        console.log(`    [User Input] Types firstName: "${value}"`);
        this.vm.updateFirstName(value);
    }

    userTypesLastName(value) {
        console.log(`    [User Input] Types lastName: "${value}"`);
        this.vm.updateLastName(value);
    }

    userClicksSave() {
        console.log("    [User Input] Clicks Save");
        this.vm.save();
    }
}

console.log("MVVM Pattern - User Form:");

// Initialize MVVM components
const userModel = new UserModel({ firstName: "John", lastName: "Doe", email: "john@test.com", age: 30 });
const userViewModel = new UserViewModel(userModel);
const userView = new UserView(userViewModel);

// Simulate user interactions - watch the bindings update automatically
console.log("\n  User editing form:");
userView.userTypesFirstName("Jane");
userView.userTypesLastName("Smith");
userView.userClicksSave();

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 3: REPOSITORY PATTERN                            ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    REPOSITORY PATTERN                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  Repository abstracts data access, providing a collection-like          │
 * │  interface for domain objects. It hides storage implementation.         │
 * │                                                                          │
 * │  WHY IT MATTERS (INTERVIEW):                                            │
 * │  • Decouples business logic from data storage                           │
 * │  • Easy to swap databases (SQL, NoSQL, API, Memory)                     │
 * │  • Simplifies unit testing with mock repositories                       │
 * │  • Central place for query logic                                        │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   BUSINESS LOGIC                                                │    │
 * │  │        │                                                         │    │
 * │  │        │ uses                                                    │    │
 * │  │        ▼                                                         │    │
 * │  │   ┌──────────────────────────────────────────┐                  │    │
 * │  │   │            REPOSITORY INTERFACE          │                  │    │
 * │  │   │                                          │                  │    │
 * │  │   │  findById(id)    findAll()              │                  │    │
 * │  │   │  save(entity)    delete(id)             │                  │    │
 * │  │   │  findByQuery(criteria)                  │                  │    │
 * │  │   │                                          │                  │    │
 * │  │   └──────────────────┬───────────────────────┘                  │    │
 * │  │                      │                                           │    │
 * │  │          ┌───────────┼───────────┐                              │    │
 * │  │          │           │           │                              │    │
 * │  │          ▼           ▼           ▼                              │    │
 * │  │   ┌──────────┐ ┌──────────┐ ┌──────────┐                       │    │
 * │  │   │ PostgreSQL│ │ MongoDB  │ │ In-Memory│                       │    │
 * │  │   │   Repo   │ │   Repo   │ │   Repo   │                       │    │
 * │  │   └──────────┘ └──────────┘ └──────────┘                       │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  BENEFITS:                                                              │
 * │  • Switch from PostgreSQL to MongoDB without changing business code     │
 * │  • Use in-memory repository for unit tests                              │
 * │  • Add caching layer transparently                                      │
 * │  • Implement pagination, sorting in one place                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// REPOSITORY: Interface and Implementations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Repository Interface (abstract class in JS)
 *
 * Defines the contract that all repositories must follow.
 * Business logic depends on this interface, not implementations.
 */
class Repository {
    findById(id) { throw new Error("Not implemented"); }
    findAll() { throw new Error("Not implemented"); }
    save(entity) { throw new Error("Not implemented"); }
    delete(id) { throw new Error("Not implemented"); }
    findByQuery(criteria) { throw new Error("Not implemented"); }
}

/**
 * In-Memory Repository
 *
 * Useful for:
 * - Unit testing
 * - Prototyping
 * - Development without database
 */
class InMemoryUserRepository extends Repository {
    constructor() {
        super();
        this.users = new Map();
        this.nextId = 1;
    }

    async findById(id) {
        console.log(`    [InMemoryRepo] Finding user ${id}`);
        return this.users.get(id) || null;
    }

    async findAll() {
        console.log(`    [InMemoryRepo] Finding all users`);
        return Array.from(this.users.values());
    }

    async save(user) {
        if (!user.id) {
            user.id = this.nextId++;
            user.createdAt = new Date();
        }
        user.updatedAt = new Date();
        this.users.set(user.id, { ...user });
        console.log(`    [InMemoryRepo] Saved user ${user.id}`);
        return user;
    }

    async delete(id) {
        console.log(`    [InMemoryRepo] Deleting user ${id}`);
        return this.users.delete(id);
    }

    async findByQuery(criteria) {
        console.log(`    [InMemoryRepo] Finding by query:`, criteria);
        const users = Array.from(this.users.values());
        return users.filter(user => {
            return Object.entries(criteria).every(([key, value]) => {
                return user[key] === value;
            });
        });
    }
}

/**
 * API Repository
 *
 * Fetches data from a REST API instead of database.
 * Same interface, different implementation.
 */
class APIUserRepository extends Repository {
    constructor(baseUrl) {
        super();
        this.baseUrl = baseUrl;
    }

    async findById(id) {
        console.log(`    [APIRepo] GET ${this.baseUrl}/users/${id}`);
        // Simulated API call
        return { id, name: "API User", email: "api@test.com" };
    }

    async findAll() {
        console.log(`    [APIRepo] GET ${this.baseUrl}/users`);
        // Simulated API call
        return [{ id: 1, name: "API User 1" }, { id: 2, name: "API User 2" }];
    }

    async save(user) {
        const method = user.id ? "PUT" : "POST";
        const url = user.id
            ? `${this.baseUrl}/users/${user.id}`
            : `${this.baseUrl}/users`;
        console.log(`    [APIRepo] ${method} ${url}`);
        return { ...user, id: user.id || Date.now() };
    }

    async delete(id) {
        console.log(`    [APIRepo] DELETE ${this.baseUrl}/users/${id}`);
        return true;
    }

    async findByQuery(criteria) {
        const params = new URLSearchParams(criteria).toString();
        console.log(`    [APIRepo] GET ${this.baseUrl}/users?${params}`);
        return [];
    }
}

/**
 * Caching Repository Decorator
 *
 * Wraps any repository and adds caching layer.
 * Demonstrates how repository pattern enables composition.
 */
class CachingRepositoryDecorator extends Repository {
    constructor(repository, ttlMs = 60000) {
        super();
        this.repository = repository;
        this.cache = new Map();
        this.ttl = ttlMs;
    }

    async findById(id) {
        const cacheKey = `user:${id}`;
        const cached = this._getFromCache(cacheKey);

        if (cached) {
            console.log(`    [Cache] HIT for ${cacheKey}`);
            return cached;
        }

        console.log(`    [Cache] MISS for ${cacheKey}`);
        const result = await this.repository.findById(id);
        this._setCache(cacheKey, result);
        return result;
    }

    async findAll() {
        // Don't cache findAll to avoid stale data issues
        return this.repository.findAll();
    }

    async save(user) {
        const result = await this.repository.save(user);
        // Invalidate cache on save
        this.cache.delete(`user:${result.id}`);
        return result;
    }

    async delete(id) {
        const result = await this.repository.delete(id);
        this.cache.delete(`user:${id}`);
        return result;
    }

    async findByQuery(criteria) {
        return this.repository.findByQuery(criteria);
    }

    _getFromCache(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }

    _setCache(key, value) {
        this.cache.set(key, {
            value,
            expiry: Date.now() + this.ttl
        });
    }
}

/**
 * Service Layer using Repository
 *
 * Business logic uses repository interface.
 * Doesn't know or care about the actual storage.
 */
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userData) {
        // Business logic/validation
        if (!userData.email) {
            throw new Error("Email is required");
        }

        // Check for existing user
        const existing = await this.userRepository.findByQuery({
            email: userData.email
        });

        if (existing.length > 0) {
            throw new Error("User with this email already exists");
        }

        return this.userRepository.save(userData);
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`User ${id} not found`);
        }
        return user;
    }

    async getAllActiveUsers() {
        return this.userRepository.findByQuery({ active: true });
    }
}

console.log("Repository Pattern - User Management:");

// Use in-memory repository for development/testing
const memoryRepo = new InMemoryUserRepository();
const cachedRepo = new CachingRepositoryDecorator(memoryRepo);
const userService = new UserService(cachedRepo);

(async () => {
    console.log("\n  Creating user:");
    const user1 = await userService.createUser({
        name: "Alice",
        email: "alice@test.com",
        active: true
    });

    console.log("\n  Finding user (cache miss):");
    await userService.getUserById(user1.id);

    console.log("\n  Finding user again (cache hit):");
    await userService.getUserById(user1.id);

    console.log("\n  Switching to API repository:");
    const apiRepo = new APIUserRepository("https://api.example.com");
    const apiService = new UserService(apiRepo);
    await apiService.getUserById(123);
})();

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 4: SERVICE LAYER PATTERN                         ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SERVICE LAYER PATTERN                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  DEFINITION:                                                            │
 * │  Service Layer defines an application's boundary with a layer of        │
 * │  services that establishes available operations and coordinates         │
 * │  the application's response.                                            │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ┌──────────────────────────────────────────────────────────┐ │    │
 * │  │   │                    PRESENTATION LAYER                     │ │    │
 * │  │   │           (Controllers, API Routes, UI)                   │ │    │
 * │  │   └────────────────────────┬─────────────────────────────────┘ │    │
 * │  │                            │                                    │    │
 * │  │   ┌────────────────────────▼─────────────────────────────────┐ │    │
 * │  │   │                    SERVICE LAYER                          │ │    │
 * │  │   │                                                           │ │    │
 * │  │   │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│ │    │
 * │  │   │  │ UserService │ │OrderService │ │ NotificationService ││ │    │
 * │  │   │  └─────────────┘ └─────────────┘ └─────────────────────┘│ │    │
 * │  │   │                                                           │ │    │
 * │  │   │  Responsibilities:                                        │ │    │
 * │  │   │  • Business logic orchestration                          │ │    │
 * │  │   │  • Transaction management                                 │ │    │
 * │  │   │  • Cross-cutting concerns                                 │ │    │
 * │  │   │  • Coordinate multiple repositories                       │ │    │
 * │  │   │                                                           │ │    │
 * │  │   └────────────────────────┬─────────────────────────────────┘ │    │
 * │  │                            │                                    │    │
 * │  │   ┌────────────────────────▼─────────────────────────────────┐ │    │
 * │  │   │                    DATA ACCESS LAYER                      │ │    │
 * │  │   │                   (Repositories)                          │ │    │
 * │  │   └──────────────────────────────────────────────────────────┘ │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  KEY RESPONSIBILITIES:                                                  │
 * │  • Encapsulate business use cases                                       │
 * │  • Coordinate multiple domain objects                                   │
 * │  • Handle transactions                                                  │
 * │  • Provide facade to complex operations                                 │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE LAYER: E-commerce Example
// ═══════════════════════════════════════════════════════════════════════════

// Simulated repositories
class OrderRepository {
    constructor() { this.orders = new Map(); this.nextId = 1; }
    async save(order) {
        order.id = order.id || this.nextId++;
        this.orders.set(order.id, order);
        return order;
    }
    async findById(id) { return this.orders.get(id); }
}

class ProductRepository {
    constructor() {
        this.products = new Map([
            [1, { id: 1, name: "Widget", price: 29.99, stock: 100 }],
            [2, { id: 2, name: "Gadget", price: 49.99, stock: 50 }]
        ]);
    }
    async findById(id) { return this.products.get(id); }
    async updateStock(id, quantity) {
        const product = this.products.get(id);
        if (product) product.stock = quantity;
        return product;
    }
}

class PaymentService {
    async processPayment(amount, paymentMethod) {
        console.log(`    [PaymentService] Processing $${amount} via ${paymentMethod}`);
        // Simulate payment processing
        return { success: true, transactionId: `TXN-${Date.now()}` };
    }
}

class NotificationService {
    async sendOrderConfirmation(order, email) {
        console.log(`    [NotificationService] Sending confirmation to ${email}`);
        return { sent: true };
    }
}

/**
 * ORDER SERVICE
 *
 * Orchestrates the complete order process:
 * 1. Validate order
 * 2. Check inventory
 * 3. Process payment
 * 4. Create order
 * 5. Update inventory
 * 6. Send notification
 *
 * This is complex business logic that coordinates multiple
 * repositories and external services.
 */
class OrderService {
    constructor(orderRepo, productRepo, paymentService, notificationService) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }

    /**
     * Place an order - main business use case
     *
     * This method demonstrates how a service orchestrates
     * multiple operations into a single transaction.
     */
    async placeOrder(orderData) {
        console.log("\n    [OrderService] Starting order process...");

        // 1. Validate order data
        this._validateOrder(orderData);
        console.log("    [OrderService] ✓ Order validated");

        // 2. Check inventory and calculate total
        let total = 0;
        const orderItems = [];

        for (const item of orderData.items) {
            const product = await this.productRepo.findById(item.productId);

            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            orderItems.push({
                productId: product.id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                subtotal: product.price * item.quantity
            });

            total += product.price * item.quantity;
        }
        console.log(`    [OrderService] ✓ Inventory checked. Total: $${total.toFixed(2)}`);

        // 3. Process payment
        const payment = await this.paymentService.processPayment(
            total,
            orderData.paymentMethod
        );

        if (!payment.success) {
            throw new Error("Payment failed");
        }
        console.log(`    [OrderService] ✓ Payment processed: ${payment.transactionId}`);

        // 4. Create order record
        const order = await this.orderRepo.save({
            customerId: orderData.customerId,
            customerEmail: orderData.email,
            items: orderItems,
            total,
            transactionId: payment.transactionId,
            status: "CONFIRMED",
            createdAt: new Date()
        });
        console.log(`    [OrderService] ✓ Order created: #${order.id}`);

        // 5. Update inventory
        for (const item of orderItems) {
            const product = await this.productRepo.findById(item.productId);
            await this.productRepo.updateStock(
                item.productId,
                product.stock - item.quantity
            );
        }
        console.log("    [OrderService] ✓ Inventory updated");

        // 6. Send notification
        await this.notificationService.sendOrderConfirmation(
            order,
            orderData.email
        );
        console.log("    [OrderService] ✓ Confirmation sent");

        return order;
    }

    _validateOrder(orderData) {
        if (!orderData.customerId) throw new Error("Customer ID required");
        if (!orderData.email) throw new Error("Email required");
        if (!orderData.items || orderData.items.length === 0) {
            throw new Error("Order must have items");
        }
        if (!orderData.paymentMethod) throw new Error("Payment method required");
    }

    async getOrderById(orderId) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) throw new Error(`Order ${orderId} not found`);
        return order;
    }
}

console.log("Service Layer Pattern - Order Processing:");

// Initialize services with dependencies
const orderRepo = new OrderRepository();
const productRepo = new ProductRepository();
const paymentSvc = new PaymentService();
const notificationSvc = new NotificationService();

const orderService = new OrderService(
    orderRepo,
    productRepo,
    paymentSvc,
    notificationSvc
);

// Place an order
(async () => {
    try {
        const order = await orderService.placeOrder({
            customerId: "CUST-001",
            email: "customer@test.com",
            paymentMethod: "credit_card",
            items: [
                { productId: 1, quantity: 2 },
                { productId: 2, quantity: 1 }
            ]
        });

        console.log("\n    Order Result:", {
            orderId: order.id,
            total: order.total,
            status: order.status
        });
    } catch (error) {
        console.log("    Order Failed:", error.message);
    }
})();

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          ARCHITECTURAL PATTERNS SUMMARY                        ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │             ARCHITECTURAL PATTERNS COMPARISON                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PATTERN      │ KEY CONCEPT               │ WHEN TO USE                 │
 * │  ═════════════│═══════════════════════════│═══════════════════════════  │
 * │               │                           │                             │
 * │  MVC          │ Separate Model, View,     │ Web apps, when View         │
 * │               │ Controller                │ updates need control        │
 * │               │                           │                             │
 * │  MVVM         │ Two-way binding,          │ Complex UIs, when           │
 * │               │ ViewModel mediates        │ data binding helps          │
 * │               │                           │                             │
 * │  Repository   │ Abstract data access      │ When you might change       │
 * │               │                           │ data source later           │
 * │               │                           │                             │
 * │  Service      │ Orchestrate business      │ Complex operations          │
 * │  Layer        │ operations                │ spanning multiple objects   │
 * │               │                           │                             │
 * └──────────────────────────────────────────────────────────────────────────┘
 * │                                                                          │
 * │  INTERVIEW TALKING POINTS:                                              │
 * │  ═════════════════════════                                              │
 * │                                                                          │
 * │  • MVC is about separating concerns at the UI level                     │
 * │  • Repository pattern enables database-agnostic code                    │
 * │  • Service Layer handles complex business transactions                  │
 * │  • These patterns work together in real applications                    │
 * │  • Choice depends on application complexity and team size               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

setTimeout(() => {
    console.log("\nArchitectural Patterns Summary:");
    console.log("  1. MVC - Separate Model, View, Controller");
    console.log("  2. MVVM - Two-way binding with ViewModel");
    console.log("  3. Repository - Abstract data storage");
    console.log("  4. Service Layer - Orchestrate business logic\n");

    console.log("═══ FILE 6 COMPLETE ═══");
    console.log("Run: node 07-anti-patterns.js");
}, 500);
