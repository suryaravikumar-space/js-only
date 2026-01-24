/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 8: DESIGN PATTERNS - COMPREHENSIVE INTERVIEW Q&A
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file contains 50+ interview questions covering all design patterns.
 * Each question includes the answer, code examples, and interviewer tips.
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("   FILE 8: DESIGN PATTERNS - COMPREHENSIVE INTERVIEW Q&A");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    QUESTION CATEGORIES OVERVIEW                         │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
 * │  │  CREATIONAL     │  │   STRUCTURAL    │  │   BEHAVIORAL    │         │
 * │  │   Q1 - Q12      │  │   Q13 - Q24     │  │   Q25 - Q36     │         │
 * │  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
 * │           │                    │                    │                   │
 * │           └────────────────────┼────────────────────┘                   │
 * │                                ▼                                        │
 * │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
 * │  │    MODULE       │  │ ARCHITECTURAL   │  │  ANTI-PATTERNS  │         │
 * │  │   Q37 - Q42     │  │   Q43 - Q48     │  │   Q49 - Q55     │         │
 * │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 1: CREATIONAL PATTERNS (Q1-Q12)               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q1: What is the Singleton pattern and when would you use it?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Singleton ensures a class has only ONE instance and provides a global
 * point of access to it.
 *
 * USE CASES:
 * • Database connections (reuse expensive connections)
 * • Configuration managers (single source of truth)
 * • Logging services (consistent logging throughout app)
 * • Caching (shared cache across application)
 *
 * INTERVIEWER TIP: Follow up with "What are the drawbacks of Singleton?"
 * - Hidden dependencies
 * - Harder to test (global state)
 * - Can violate Single Responsibility
 */

class DatabaseSingleton {
    constructor() {
        if (DatabaseSingleton.instance) {
            return DatabaseSingleton.instance;
        }
        this.connection = "Connected to DB";
        DatabaseSingleton.instance = this;
    }

    static getInstance() {
        if (!DatabaseSingleton.instance) {
            DatabaseSingleton.instance = new DatabaseSingleton();
        }
        return DatabaseSingleton.instance;
    }
}

console.log("Q1: Singleton Pattern");
const db1 = DatabaseSingleton.getInstance();
const db2 = DatabaseSingleton.getInstance();
console.log("  Same instance?", db1 === db2); // true

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q2: Explain the Factory pattern. When is it better than using 'new'?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Factory pattern creates objects without specifying the exact class.
 * It's better than 'new' when:
 *
 * 1. Object creation is complex
 * 2. Type is determined at runtime
 * 3. You want to decouple client from concrete classes
 * 4. You need a central place for object creation logic
 */

class NotificationFactory {
    static create(type, message) {
        const notifications = {
            email: { type: "email", message, send: () => `Emailing: ${message}` },
            sms: { type: "sms", message, send: () => `SMS: ${message}` },
            push: { type: "push", message, send: () => `Push: ${message}` }
        };

        if (!notifications[type]) {
            throw new Error(`Unknown notification type: ${type}`);
        }
        return notifications[type];
    }
}

console.log("\nQ2: Factory Pattern");
const emailNotif = NotificationFactory.create("email", "Hello!");
console.log("  ", emailNotif.send());

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q3: What's the difference between Factory and Abstract Factory?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * Factory: Creates ONE type of object
 *   UserFactory.create("admin") → AdminUser
 *
 * Abstract Factory: Creates FAMILIES of related objects
 *   UIFactory.createButton() + UIFactory.createInput()
 *   (all matching the same theme/style)
 *
 * Use Abstract Factory when you need to ensure related objects
 * are compatible with each other (e.g., UI themes).
 */

console.log("\nQ3: Factory vs Abstract Factory");
console.log("  Factory: Creates one type (UserFactory → User)");
console.log("  Abstract Factory: Creates families (UIFactory → Button + Input + Modal)");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q4: Explain the Builder pattern with a practical example.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Builder separates construction of complex objects from their representation.
 * It allows step-by-step construction with a fluent interface.
 *
 * PERFECT FOR:
 * • Objects with many optional parameters
 * • Complex object construction
 * • When you want readable construction code
 */

class RequestBuilder {
    constructor() {
        this.config = { method: "GET", headers: {} };
    }

    setUrl(url) { this.config.url = url; return this; }
    setMethod(method) { this.config.method = method; return this; }
    setHeader(key, value) { this.config.headers[key] = value; return this; }
    setBody(body) { this.config.body = body; return this; }

    build() { return { ...this.config }; }
}

console.log("\nQ4: Builder Pattern");
const request = new RequestBuilder()
    .setUrl("/api/users")
    .setMethod("POST")
    .setHeader("Content-Type", "application/json")
    .setBody({ name: "John" })
    .build();
console.log("  Built request:", request.method, request.url);

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q5: What is the Prototype pattern? How does JavaScript use it natively?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Prototype creates new objects by cloning existing ones.
 *
 * JavaScript uses prototypal inheritance natively:
 * - Every object has a [[Prototype]] (__proto__)
 * - Object.create() creates with specified prototype
 * - Classes are syntactic sugar over prototype chain
 */

const vehiclePrototype = {
    drive() { return `Driving ${this.model}`; }
};

function createVehicle(model) {
    const vehicle = Object.create(vehiclePrototype);
    vehicle.model = model;
    return vehicle;
}

console.log("\nQ5: Prototype Pattern");
const car = createVehicle("Tesla");
console.log("  ", car.drive());
console.log("  Uses prototype:", Object.getPrototypeOf(car) === vehiclePrototype);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 2: STRUCTURAL PATTERNS (Q13-Q24)              ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q6: What is the Adapter pattern? Give a real-world JavaScript example.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Adapter converts one interface to another that clients expect.
 *
 * REAL-WORLD EXAMPLES:
 * • Wrapping localStorage to work like an async API
 * • Converting XML API responses to JSON format
 * • Making old callback-based APIs work with Promises
 */

// Old API uses callbacks
const oldApi = {
    fetchData: (callback) => {
        setTimeout(() => callback(null, { data: "old format" }), 100);
    }
};

// Adapter makes it work with Promises
const modernAdapter = {
    fetchData: () => new Promise((resolve, reject) => {
        oldApi.fetchData((err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    })
};

console.log("Q6: Adapter Pattern");
modernAdapter.fetchData().then(data => console.log("  Adapted:", data));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q7: Explain the Decorator pattern. How do you implement it in JS?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Decorator adds behavior to objects dynamically without modifying them.
 *
 * IN JAVASCRIPT:
 * 1. Function wrapping (higher-order functions)
 * 2. Object composition
 * 3. ES7 decorator syntax (with transpilation)
 */

// Function decorator
function withLogging(fn) {
    return function(...args) {
        console.log(`  [LOG] Calling with:`, args);
        const result = fn.apply(this, args);
        console.log(`  [LOG] Result:`, result);
        return result;
    };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);

console.log("\nQ7: Decorator Pattern");
loggedAdd(2, 3);

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q8: What is the Facade pattern? When should you use it?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Facade provides a simplified interface to a complex subsystem.
 *
 * USE WHEN:
 * • You have a complex library/API to simplify
 * • You want to hide complexity from clients
 * • You need to provide a unified API to multiple subsystems
 *
 * EXAMPLE: jQuery is a facade over DOM APIs
 */

// Complex subsystems
const authSystem = { login: () => "logged in" };
const cartSystem = { getItems: () => ["item1", "item2"] };
const paymentSystem = { process: () => "payment processed" };

// Facade
const checkoutFacade = {
    checkout(userId) {
        const auth = authSystem.login(userId);
        const items = cartSystem.getItems(userId);
        const payment = paymentSystem.process(items);
        return { auth, items, payment };
    }
};

console.log("\nQ8: Facade Pattern");
console.log("  Simple checkout:", checkoutFacade.checkout("user1"));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q9: How does the Proxy pattern differ from Decorator?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * DECORATOR: Adds NEW functionality
 *   coffee → coffee with milk → coffee with milk and sugar
 *
 * PROXY: Controls ACCESS to existing functionality
 *   - Validation before allowing access
 *   - Caching expensive operations
 *   - Lazy loading
 *   - Access control
 *
 * JavaScript has native Proxy object for this!
 */

const user = { name: "John", password: "secret" };

const protectedUser = new Proxy(user, {
    get(target, prop) {
        if (prop === "password") {
            return "***HIDDEN***";
        }
        return target[prop];
    }
});

console.log("\nQ9: Proxy Pattern");
console.log("  Direct access:", user.password);
console.log("  Via proxy:", protectedUser.password);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 3: BEHAVIORAL PATTERNS (Q25-Q36)              ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q10: Explain the Observer pattern. How is it used in JavaScript?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Observer defines a one-to-many dependency. When one object changes,
 * all dependents are notified automatically.
 *
 * USED IN JAVASCRIPT:
 * • DOM event listeners (addEventListener)
 * • Node.js EventEmitter
 * • RxJS Observables
 * • State management (Redux store.subscribe)
 * • Custom pub/sub systems
 */

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
        return () => this.off(event, callback);
    }

    emit(event, data) {
        (this.events[event] || []).forEach(cb => cb(data));
    }

    off(event, callback) {
        this.events[event] = (this.events[event] || []).filter(cb => cb !== callback);
    }
}

console.log("Q10: Observer Pattern");
const emitter = new EventEmitter();
emitter.on("data", (d) => console.log("  Received:", d));
emitter.emit("data", { message: "Hello Observer!" });

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q11: What is the Strategy pattern? Provide a practical example.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Strategy defines a family of algorithms and makes them interchangeable.
 * The client can choose which algorithm to use at runtime.
 *
 * EXAMPLES:
 * • Payment processing (credit card, PayPal, crypto)
 * • Sorting algorithms
 * • Compression algorithms
 * • Validation strategies
 */

const paymentStrategies = {
    creditCard: (amount) => `Charged $${amount} to credit card`,
    paypal: (amount) => `Sent $${amount} via PayPal`,
    bitcoin: (amount) => `Transferred ${amount / 50000} BTC`
};

function processPayment(amount, strategy) {
    return paymentStrategies[strategy](amount);
}

console.log("\nQ11: Strategy Pattern");
console.log("  ", processPayment(100, "creditCard"));
console.log("  ", processPayment(100, "paypal"));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q12: Explain the Command pattern. Where is it useful?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Command encapsulates a request as an object, allowing you to:
 * - Queue operations
 * - Log operations
 * - Support undo/redo
 * - Decouple sender from receiver
 *
 * USEFUL FOR:
 * • Text editors (undo/redo)
 * • Transaction systems
 * • Macro recording
 * • Job queues
 */

class Command {
    execute() {}
    undo() {}
}

class AddTextCommand extends Command {
    constructor(editor, text) {
        super();
        this.editor = editor;
        this.text = text;
    }

    execute() {
        this.editor.content += this.text;
    }

    undo() {
        this.editor.content = this.editor.content.slice(0, -this.text.length);
    }
}

console.log("\nQ12: Command Pattern (Undo/Redo)");
const editor = { content: "Hello" };
const cmd = new AddTextCommand(editor, " World");
cmd.execute();
console.log("  After execute:", editor.content);
cmd.undo();
console.log("  After undo:", editor.content);

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q13: What is the State pattern? How does it differ from Strategy?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * STATE: Object behavior changes based on INTERNAL state
 *   - State transitions are managed by the states themselves
 *   - Example: Order status (pending → processing → shipped)
 *
 * STRATEGY: Behavior is chosen by CLIENT
 *   - Client explicitly selects the algorithm
 *   - Example: Choosing payment method
 *
 * KEY DIFFERENCE:
 * - State: behavior changes automatically as state changes
 * - Strategy: client explicitly sets the behavior
 */

console.log("\nQ13: State vs Strategy");
console.log("  State: Behavior changes with internal state (Order: pending→shipped)");
console.log("  Strategy: Client chooses behavior (User picks: creditCard/paypal)");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 4: ARCHITECTURE & MODULES (Q37-Q48)           ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q14: Explain the Module pattern. Why was it important before ES6?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Module pattern uses closures to create private/public encapsulation.
 * Before ES6 modules, it was the primary way to:
 * - Avoid global namespace pollution
 * - Create private variables/functions
 * - Organize code into self-contained units
 */

const CounterModule = (function() {
    // Private
    let count = 0;

    // Public API
    return {
        increment() { return ++count; },
        decrement() { return --count; },
        getCount() { return count; }
    };
})();

console.log("Q14: Module Pattern (Revealing Module)");
console.log("  Increment:", CounterModule.increment());
console.log("  Increment:", CounterModule.increment());
console.log("  Count:", CounterModule.getCount());
console.log("  Private 'count' accessible?", typeof CounterModule.count); // undefined

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q15: What is MVC? How does it apply to frontend development?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * MODEL: Data and business logic
 * VIEW: UI presentation
 * CONTROLLER: Handles input, updates Model and View
 *
 * FRONTEND APPLICATION:
 * • React: Components combine View + some Controller
 *         State/Context = Model
 * • Vue: Template = View, Methods = Controller, Data = Model
 * • Angular: Templates = View, Components = Controller, Services = Model
 */

console.log("\nQ15: MVC Pattern");
console.log("  Model: Data & business logic");
console.log("  View: UI rendering");
console.log("  Controller: Input handling & coordination");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q16: What's the difference between MVC, MVP, and MVVM?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * MVC (Model-View-Controller):
 * - View can query Model directly
 * - Controller handles input
 * - Used in: Express.js, Rails
 *
 * MVP (Model-View-Presenter):
 * - View is passive (dumb)
 * - Presenter mediates ALL communication
 * - Better for testing
 *
 * MVVM (Model-View-ViewModel):
 * - Two-way data binding
 * - ViewModel exposes data streams
 * - Used in: Vue, Angular, WPF
 */

console.log("\nQ16: MVC vs MVP vs MVVM");
console.log("  MVC: View queries Model directly");
console.log("  MVP: Presenter mediates everything");
console.log("  MVVM: Two-way binding between View and ViewModel");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q17: Explain the Repository pattern. Why is it useful?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Repository abstracts data access, providing a collection-like interface.
 *
 * BENEFITS:
 * • Decouple business logic from data storage
 * • Easy to swap databases (MySQL → MongoDB)
 * • Simplifies testing with mock repositories
 * • Central place for query logic
 */

// Repository interface
const userRepository = {
    findById: (id) => ({ id, name: "User " + id }),
    findAll: () => [{ id: 1 }, { id: 2 }],
    save: (user) => ({ ...user, id: Date.now() }),
    delete: (id) => true
};

console.log("\nQ17: Repository Pattern");
console.log("  Find user:", userRepository.findById(1));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q18: What is Dependency Injection? Why is it important?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * DI provides dependencies from outside instead of creating them inside.
 *
 * WITHOUT DI:
 *   class Service { constructor() { this.db = new Database(); } }
 *
 * WITH DI:
 *   class Service { constructor(db) { this.db = db; } }
 *
 * BENEFITS:
 * • Loose coupling
 * • Easy testing (inject mocks)
 * • Flexibility to swap implementations
 * • Clear dependency graph
 */

console.log("\nQ18: Dependency Injection");

// Without DI (tight coupling)
class ServiceBad {
    constructor() {
        this.db = { query: () => "hardcoded DB" }; // Can't change!
    }
}

// With DI (loose coupling)
class ServiceGood {
    constructor(db) {
        this.db = db; // Injected - can be anything!
    }
}

const mockDb = { query: () => "mock result" };
const realDb = { query: () => "real DB result" };

console.log("  With mock:", new ServiceGood(mockDb).db.query());
console.log("  With real:", new ServiceGood(realDb).db.query());

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 5: ANTI-PATTERNS (Q49-Q55)                    ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q19: What are anti-patterns? Name 5 common ones in JavaScript.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Anti-patterns are common solutions that are counterproductive.
 *
 * COMMON JS ANTI-PATTERNS:
 * 1. Callback Hell - Nested callbacks
 * 2. God Object - Class that does everything
 * 3. Magic Numbers - Unexplained literals
 * 4. Tight Coupling - Direct dependencies
 * 5. Memory Leaks - Unreleased resources
 * 6. Copy-Paste Programming - Duplicated code
 * 7. Premature Optimization - Optimizing too early
 */

console.log("Q19: Common JavaScript Anti-Patterns");
console.log("  1. Callback Hell → Use async/await");
console.log("  2. God Object → Single Responsibility");
console.log("  3. Magic Numbers → Named constants");
console.log("  4. Tight Coupling → Dependency Injection");
console.log("  5. Memory Leaks → Proper cleanup");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q20: How do you identify and fix the "God Object" anti-pattern?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * IDENTIFICATION SIGNS:
 * • Class has 500+ lines
 * • Many unrelated methods
 * • Name includes "Manager", "Handler", "Utility"
 * • Hard to test in isolation
 *
 * FIX:
 * • Extract related methods into separate classes
 * • Apply Single Responsibility Principle
 * • Use composition over inheritance
 */

console.log("\nQ20: Fixing God Object");
console.log("  Problem: AppManager with createUser, processOrder, sendEmail, ...");
console.log("  Solution: Split into UserService, OrderService, EmailService");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q21: What causes memory leaks in JavaScript? How do you prevent them?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * COMMON CAUSES:
 * 1. Forgotten timers (setInterval not cleared)
 * 2. Event listeners not removed
 * 3. Closures holding large references
 * 4. Detached DOM references
 * 5. Global variables
 *
 * PREVENTION:
 * • Always clearInterval/clearTimeout
 * • Remove event listeners in cleanup
 * • Use WeakMap/WeakSet for caching
 * • Use AbortController for fetch
 * • Nullify references when done
 */

console.log("\nQ21: Memory Leak Prevention");
console.log("  • Clear intervals: clearInterval(id)");
console.log("  • Remove listeners: removeEventListener()");
console.log("  • Use AbortController for fetch");
console.log("  • Nullify large references: data = null");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 6: QUICK FIRE QUESTIONS                       ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * QUICK FIRE Q&A - SHORT ANSWERS
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Q: What pattern would you use for undo/redo?
 * A: Command pattern - encapsulates operations with execute() and undo()
 *
 * Q: What pattern is Redux based on?
 * A: Observer (store.subscribe) + Command (actions) + Reducer (state machine)
 *
 * Q: How would you implement a plugin system?
 * A: Strategy pattern - plugins are interchangeable strategies
 *
 * Q: What pattern does Express middleware use?
 * A: Chain of Responsibility - each middleware can handle or pass to next
 *
 * Q: What's the pattern behind React's context?
 * A: Dependency Injection - provides dependencies without prop drilling
 *
 * Q: Promise.all() is an example of which pattern?
 * A: Aggregator/Composite - treats multiple promises as one
 *
 * Q: What pattern does fetch().then().catch() use?
 * A: Promise/Observer hybrid + Method chaining (fluent interface)
 *
 * Q: How would you implement a theming system?
 * A: Abstract Factory - creates families of themed components
 *
 * Q: What's the pattern behind Object.create()?
 * A: Prototype - creates new object with specified prototype
 *
 * Q: What pattern is localStorage similar to?
 * A: Repository - provides CRUD interface for persistent data
 */

console.log("Quick Fire Answers:");
console.log("  • Undo/Redo → Command pattern");
console.log("  • Redux → Observer + Command + State machine");
console.log("  • Express middleware → Chain of Responsibility");
console.log("  • React Context → Dependency Injection");
console.log("  • Theming system → Abstract Factory");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║                   INTERVIEW CHEAT SHEET                        ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                  DESIGN PATTERNS INTERVIEW CHEAT SHEET                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  CREATIONAL - How objects are created                                   │
 * │  ═══════════════════════════════════                                    │
 * │  Singleton    → One instance globally (DB connection)                   │
 * │  Factory      → Create without specifying class (Notifications)         │
 * │  Builder      → Step-by-step construction (Query builder)               │
 * │  Prototype    → Clone existing objects (Object.create)                  │
 * │                                                                          │
 * │  STRUCTURAL - How objects are composed                                  │
 * │  ═══════════════════════════════════                                    │
 * │  Adapter      → Convert interfaces (API wrappers)                       │
 * │  Decorator    → Add behavior (HOCs, logging)                            │
 * │  Facade       → Simplify complex systems (jQuery)                       │
 * │  Proxy        → Control access (validation, caching)                    │
 * │  Composite    → Tree structures (DOM, file systems)                     │
 * │                                                                          │
 * │  BEHAVIORAL - How objects interact                                      │
 * │  ═══════════════════════════════════                                    │
 * │  Observer     → Pub/sub events (EventEmitter)                           │
 * │  Strategy     → Interchangeable algorithms (Payment methods)            │
 * │  Command      → Encapsulate requests (Undo/redo)                        │
 * │  State        → Behavior by state (Order status)                        │
 * │  Chain        → Pass along chain (Middleware)                           │
 * │  Iterator     → Sequential access (for...of)                            │
 * │                                                                          │
 * │  REMEMBER: Pattern name → Problem it solves → Example                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Design Patterns Cheat Sheet:");
console.log("─".repeat(60));
console.log("  CREATIONAL: Singleton, Factory, Builder, Prototype");
console.log("  STRUCTURAL: Adapter, Decorator, Facade, Proxy, Composite");
console.log("  BEHAVIORAL: Observer, Strategy, Command, State, Chain");
console.log("─".repeat(60));
console.log("\n  Key: Know the PROBLEM each pattern solves!");

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("   FILE 8 COMPLETE - DESIGN PATTERNS MODULE FINISHED!");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("Topics Covered in Design Patterns Module:");
console.log("  ✓ Creational Patterns (Singleton, Factory, Builder, Prototype)");
console.log("  ✓ Structural Patterns (Adapter, Decorator, Facade, Proxy)");
console.log("  ✓ Behavioral Patterns (Observer, Strategy, Command, State)");
console.log("  ✓ Module Patterns (IIFE, Revealing Module, ES6 Modules)");
console.log("  ✓ Reactive Patterns (Observable, Signals, Stores)");
console.log("  ✓ Architectural Patterns (MVC, MVVM, Repository)");
console.log("  ✓ Anti-Patterns & Solutions");
console.log("  ✓ Interview Q&A\n");

console.log("Next Module: Node.js Architecture");
console.log("Location: deep-dive/javaScript-nodejs-architecture/");
