/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 3: BEHAVIORAL DESIGN PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Behavioral patterns deal with object interaction and responsibility.
 * They help define how objects communicate and distribute work.
 *
 * PATTERNS COVERED:
 * 1. Observer - Subscribe to events
 * 2. Strategy - Interchangeable algorithms
 * 3. Command - Encapsulate requests
 * 4. Iterator - Sequential access
 * 5. State - Change behavior with state
 * 6. Chain of Responsibility - Pass request along chain
 * 7. Mediator - Centralized communication
 * 8. Template Method - Define algorithm skeleton
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 3: BEHAVIORAL DESIGN PATTERNS");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 BEHAVIORAL PATTERNS OVERVIEW                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │
 * │   │   OBSERVER    │    │   STRATEGY    │    │    COMMAND    │           │
 * │   │               │    │               │    │               │           │
 * │   │  Pub/Sub      │    │ Swap          │    │ Encapsulate   │           │
 * │   │  events       │    │ algorithms    │    │ requests      │           │
 * │   └───────────────┘    └───────────────┘    └───────────────┘           │
 * │                                                                          │
 * │   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │
 * │   │    STATE      │    │   MEDIATOR    │    │   ITERATOR    │           │
 * │   │               │    │               │    │               │           │
 * │   │  Behavior     │    │ Centralize    │    │ Sequential    │           │
 * │   │  by state     │    │ communication │    │ access        │           │
 * │   └───────────────┘    └───────────────┘    └───────────────┘           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 1: OBSERVER                                ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     OBSERVER PATTERN                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Define one-to-many dependency. When one object changes,       │
 * │           all dependents are notified automatically.                    │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ┌─────────────────┐                                           │    │
 * │  │   │    SUBJECT      │                                           │    │
 * │  │   │   (Publisher)   │                                           │    │
 * │  │   │                 │                                           │    │
 * │  │   │  observers: []  │                                           │    │
 * │  │   │  subscribe()    │                                           │    │
 * │  │   │  unsubscribe()  │                                           │    │
 * │  │   │  notify()       │                                           │    │
 * │  │   └────────┬────────┘                                           │    │
 * │  │            │ notifies                                           │    │
 * │  │      ┌─────┼─────┬─────────┐                                    │    │
 * │  │      │     │     │         │                                    │    │
 * │  │      ▼     ▼     ▼         ▼                                    │    │
 * │  │   ┌─────┐┌─────┐┌─────┐┌─────┐                                  │    │
 * │  │   │ Ob1 ││ Ob2 ││ Ob3 ││ Ob4 │  ◄── Observers (Subscribers)    │    │
 * │  │   └─────┘└─────┘└─────┘└─────┘                                  │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  USE CASES:                                                             │
 * │  • Event systems (DOM events, custom events)                            │
 * │  • Reactive frameworks (Vue, React state)                               │
 * │  • Real-time updates (WebSocket messages)                               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// OBSERVER: Classic Implementation
// ═══════════════════════════════════════════════════════════════════════════

class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
    }

    emit(event, ...args) {
        if (!this.listeners.has(event)) return;
        this.listeners.get(event).forEach(callback => callback(...args));
    }

    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }
}

console.log("Observer Pattern - EventEmitter:");

const emitter = new EventEmitter();

// Subscribe
const unsubscribe = emitter.on("userLogin", (user) => {
    console.log(`  [Logger] User logged in: ${user.name}`);
});

emitter.on("userLogin", (user) => {
    console.log(`  [Analytics] Track login: ${user.id}`);
});

emitter.once("userLogin", () => {
    console.log("  [Welcome] First login detected (runs once)");
});

// Emit events
emitter.emit("userLogin", { id: 1, name: "Alice" });
console.log("");
emitter.emit("userLogin", { id: 2, name: "Bob" });

// ═══════════════════════════════════════════════════════════════════════════
// OBSERVER: Reactive Store (Redux-like)
// ═══════════════════════════════════════════════════════════════════════════

class Store {
    constructor(reducer, initialState = {}) {
        this.reducer = reducer;
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    dispatch(action) {
        this.state = this.reducer(this.state, action);
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Reducer
function counterReducer(state = { count: 0 }, action) {
    switch (action.type) {
        case "INCREMENT":
            return { ...state, count: state.count + 1 };
        case "DECREMENT":
            return { ...state, count: state.count - 1 };
        default:
            return state;
    }
}

console.log("\nReactive Store (Redux-like):");

const store = new Store(counterReducer, { count: 0 });

store.subscribe(state => {
    console.log(`  [UI] Count updated: ${state.count}`);
});

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "DECREMENT" });

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 2: STRATEGY                                ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     STRATEGY PATTERN                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Define a family of algorithms, encapsulate each one,          │
 * │           and make them interchangeable at runtime.                     │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ┌────────────────────────┐                                    │    │
 * │  │   │       CONTEXT          │                                    │    │
 * │  │   │                        │                                    │    │
 * │  │   │   strategy: Strategy   │──────┐                            │    │
 * │  │   │   setStrategy()        │      │                            │    │
 * │  │   │   execute()            │      │                            │    │
 * │  │   └────────────────────────┘      │                            │    │
 * │  │                                   │                            │    │
 * │  │                                   ▼                            │    │
 * │  │                        ┌──────────────────┐                    │    │
 * │  │                        │    Strategy      │                    │    │
 * │  │                        │   (interface)    │                    │    │
 * │  │                        │   execute()      │                    │    │
 * │  │                        └────────┬─────────┘                    │    │
 * │  │               ┌─────────────────┼─────────────────┐            │    │
 * │  │               │                 │                 │            │    │
 * │  │               ▼                 ▼                 ▼            │    │
 * │  │        ┌───────────┐     ┌───────────┐     ┌───────────┐      │    │
 * │  │        │ Strategy1 │     │ Strategy2 │     │ Strategy3 │      │    │
 * │  │        └───────────┘     └───────────┘     └───────────┘      │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// STRATEGY: Payment Processing
// ═══════════════════════════════════════════════════════════════════════════

// Strategies
const paymentStrategies = {
    creditCard: {
        name: "Credit Card",
        process(amount) {
            console.log(`  Processing $${amount} via Credit Card`);
            return { success: true, fee: amount * 0.029 };
        }
    },
    paypal: {
        name: "PayPal",
        process(amount) {
            console.log(`  Processing $${amount} via PayPal`);
            return { success: true, fee: amount * 0.034 };
        }
    },
    crypto: {
        name: "Cryptocurrency",
        process(amount) {
            console.log(`  Processing $${amount} via Crypto`);
            return { success: true, fee: amount * 0.01 };
        }
    }
};

// Context
class PaymentProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    checkout(amount) {
        if (!this.strategy) {
            throw new Error("Payment strategy not set");
        }
        return this.strategy.process(amount);
    }
}

console.log("Strategy Pattern - Payment Processing:");

const processor = new PaymentProcessor(paymentStrategies.creditCard);
console.log("  Result:", processor.checkout(100));

processor.setStrategy(paymentStrategies.crypto);
console.log("  Result:", processor.checkout(100));

// ═══════════════════════════════════════════════════════════════════════════
// STRATEGY: Sorting Algorithms
// ═══════════════════════════════════════════════════════════════════════════

const sortingStrategies = {
    bubble: (arr) => {
        const result = [...arr];
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result.length - i - 1; j++) {
                if (result[j] > result[j + 1]) {
                    [result[j], result[j + 1]] = [result[j + 1], result[j]];
                }
            }
        }
        return result;
    },

    quick: (arr) => {
        if (arr.length <= 1) return arr;
        const pivot = arr[Math.floor(arr.length / 2)];
        const left = arr.filter(x => x < pivot);
        const middle = arr.filter(x => x === pivot);
        const right = arr.filter(x => x > pivot);
        return [...sortingStrategies.quick(left), ...middle, ...sortingStrategies.quick(right)];
    },

    builtin: (arr) => [...arr].sort((a, b) => a - b)
};

class Sorter {
    constructor(strategy = sortingStrategies.builtin) {
        this.strategy = strategy;
    }

    sort(data) {
        return this.strategy(data);
    }
}

console.log("\nStrategy Pattern - Sorting:");
const data = [64, 34, 25, 12, 22, 11, 90];
const sorter = new Sorter(sortingStrategies.quick);
console.log("  Original:", data);
console.log("  Sorted:", sorter.sort(data));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 3: COMMAND                                 ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     COMMAND PATTERN                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Encapsulate a request as an object, letting you parameterize  │
 * │           clients, queue requests, and support undo operations.         │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ┌──────────┐  creates   ┌──────────┐  executes  ┌──────────┐ │    │
 * │  │   │  Client  │──────────► │ Command  │──────────► │ Receiver │ │    │
 * │  │   └──────────┘            └──────────┘            └──────────┘ │    │
 * │  │                                │                                │    │
 * │  │                                │ stored in                      │    │
 * │  │                                ▼                                │    │
 * │  │                         ┌──────────────┐                        │    │
 * │  │                         │   Invoker    │                        │    │
 * │  │                         │              │                        │    │
 * │  │                         │ history: []  │                        │    │
 * │  │                         │ execute()    │                        │    │
 * │  │                         │ undo()       │                        │    │
 * │  │                         └──────────────┘                        │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  USE CASES:                                                             │
 * │  • Undo/Redo functionality                                              │
 * │  • Transaction systems                                                  │
 * │  • Macro recording                                                      │
 * │  • Job queues                                                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Command interface
class Command {
    execute() { throw new Error("Must implement execute"); }
    undo() { throw new Error("Must implement undo"); }
}

// Receiver
class TextEditor {
    constructor() {
        this.content = "";
        this.clipboard = "";
    }

    insert(text, position = this.content.length) {
        this.content = this.content.slice(0, position) + text + this.content.slice(position);
    }

    delete(start, length) {
        const deleted = this.content.slice(start, start + length);
        this.content = this.content.slice(0, start) + this.content.slice(start + length);
        return deleted;
    }

    getContent() {
        return this.content;
    }
}

// Concrete Commands
class InsertCommand extends Command {
    constructor(editor, text, position) {
        super();
        this.editor = editor;
        this.text = text;
        this.position = position;
    }

    execute() {
        this.editor.insert(this.text, this.position);
    }

    undo() {
        this.editor.delete(this.position, this.text.length);
    }
}

class DeleteCommand extends Command {
    constructor(editor, start, length) {
        super();
        this.editor = editor;
        this.start = start;
        this.length = length;
        this.deletedText = "";
    }

    execute() {
        this.deletedText = this.editor.delete(this.start, this.length);
    }

    undo() {
        this.editor.insert(this.deletedText, this.start);
    }
}

// Invoker with history
class CommandManager {
    constructor() {
        this.history = [];
        this.redoStack = [];
    }

    execute(command) {
        command.execute();
        this.history.push(command);
        this.redoStack = []; // Clear redo stack on new command
    }

    undo() {
        if (this.history.length === 0) return;
        const command = this.history.pop();
        command.undo();
        this.redoStack.push(command);
    }

    redo() {
        if (this.redoStack.length === 0) return;
        const command = this.redoStack.pop();
        command.execute();
        this.history.push(command);
    }
}

console.log("Command Pattern - Text Editor with Undo:");

const editor = new TextEditor();
const commandManager = new CommandManager();

commandManager.execute(new InsertCommand(editor, "Hello", 0));
console.log(`  After insert: "${editor.getContent()}"`);

commandManager.execute(new InsertCommand(editor, " World", 5));
console.log(`  After insert: "${editor.getContent()}"`);

commandManager.execute(new InsertCommand(editor, "!", 11));
console.log(`  After insert: "${editor.getContent()}"`);

commandManager.undo();
console.log(`  After undo: "${editor.getContent()}"`);

commandManager.undo();
console.log(`  After undo: "${editor.getContent()}"`);

commandManager.redo();
console.log(`  After redo: "${editor.getContent()}"`);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 4: STATE                                   ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                      STATE PATTERN                                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Allow an object to change its behavior when its internal      │
 * │           state changes. The object appears to change its class.        │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ┌─────────────────┐         ┌──────────────────┐              │    │
 * │  │   │    Context      │◄───────►│      State       │              │    │
 * │  │   │                 │         │    (interface)   │              │    │
 * │  │   │  state: State   │         │                  │              │    │
 * │  │   │  request()      │         │   handle()       │              │    │
 * │  │   └─────────────────┘         └────────┬─────────┘              │    │
 * │  │                                        │                         │    │
 * │  │                         ┌──────────────┼──────────────┐          │    │
 * │  │                         │              │              │          │    │
 * │  │                         ▼              ▼              ▼          │    │
 * │  │                    ┌─────────┐   ┌─────────┐   ┌─────────┐      │    │
 * │  │                    │ State A │   │ State B │   │ State C │      │    │
 * │  │                    └─────────┘   └─────────┘   └─────────┘      │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  EXAMPLE: Traffic Light                                                 │
 * │  ┌────────┐        ┌────────┐        ┌────────┐                        │
 * │  │  RED   │ ──────►│ GREEN  │ ──────►│ YELLOW │ ──────► (RED)          │
 * │  │  stop  │        │   go   │        │ caution│                        │
 * │  └────────┘        └────────┘        └────────┘                        │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// State interface
class OrderState {
    constructor(order) {
        this.order = order;
    }
    proceed() { throw new Error("Must implement proceed"); }
    cancel() { throw new Error("Must implement cancel"); }
    getStatus() { throw new Error("Must implement getStatus"); }
}

// Concrete States
class PendingState extends OrderState {
    proceed() {
        console.log("  Order confirmed. Processing payment...");
        this.order.setState(new ProcessingState(this.order));
    }

    cancel() {
        console.log("  Order cancelled.");
        this.order.setState(new CancelledState(this.order));
    }

    getStatus() { return "PENDING"; }
}

class ProcessingState extends OrderState {
    proceed() {
        console.log("  Payment received. Shipping order...");
        this.order.setState(new ShippedState(this.order));
    }

    cancel() {
        console.log("  Cannot cancel. Order is being processed.");
    }

    getStatus() { return "PROCESSING"; }
}

class ShippedState extends OrderState {
    proceed() {
        console.log("  Order delivered!");
        this.order.setState(new DeliveredState(this.order));
    }

    cancel() {
        console.log("  Cannot cancel. Order already shipped.");
    }

    getStatus() { return "SHIPPED"; }
}

class DeliveredState extends OrderState {
    proceed() {
        console.log("  Order already delivered. No further action.");
    }

    cancel() {
        console.log("  Cannot cancel. Order was delivered.");
    }

    getStatus() { return "DELIVERED"; }
}

class CancelledState extends OrderState {
    proceed() {
        console.log("  Cannot proceed. Order was cancelled.");
    }

    cancel() {
        console.log("  Order already cancelled.");
    }

    getStatus() { return "CANCELLED"; }
}

// Context
class Order {
    constructor(id) {
        this.id = id;
        this.state = new PendingState(this);
    }

    setState(state) {
        this.state = state;
    }

    proceed() {
        this.state.proceed();
    }

    cancel() {
        this.state.cancel();
    }

    getStatus() {
        return this.state.getStatus();
    }
}

console.log("State Pattern - Order Processing:");

const order = new Order("ORD-001");
console.log(`  Status: ${order.getStatus()}`);

order.proceed(); // Pending -> Processing
console.log(`  Status: ${order.getStatus()}`);

order.cancel(); // Can't cancel in Processing
console.log(`  Status: ${order.getStatus()}`);

order.proceed(); // Processing -> Shipped
console.log(`  Status: ${order.getStatus()}`);

order.proceed(); // Shipped -> Delivered
console.log(`  Status: ${order.getStatus()}`);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 5: CHAIN OF RESPONSIBILITY                 ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                  CHAIN OF RESPONSIBILITY                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Pass request along a chain of handlers. Each handler          │
 * │           decides to process it or pass to the next handler.            │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   Request ────► ┌─────────┐    ┌─────────┐    ┌─────────┐      │    │
 * │  │                 │Handler 1│───►│Handler 2│───►│Handler 3│      │    │
 * │  │                 │         │    │         │    │         │      │    │
 * │  │                 │ Can't   │    │ Can't   │    │ Can     │      │    │
 * │  │                 │ handle  │    │ handle  │    │ handle! │      │    │
 * │  │                 └─────────┘    └─────────┘    └────┬────┘      │    │
 * │  │                                                    │           │    │
 * │  │                                                    ▼           │    │
 * │  │                                               [Response]       │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  USE CASES:                                                             │
 * │  • Middleware (Express.js)                                              │
 * │  • Event bubbling                                                       │
 * │  • Logging levels                                                       │
 * │  • Authentication chains                                                │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Handler base
class SupportHandler {
    constructor() {
        this.nextHandler = null;
    }

    setNext(handler) {
        this.nextHandler = handler;
        return handler; // For chaining
    }

    handle(ticket) {
        if (this.nextHandler) {
            return this.nextHandler.handle(ticket);
        }
        console.log("  [END] No handler could resolve the issue");
        return null;
    }
}

// Concrete Handlers
class Level1Support extends SupportHandler {
    handle(ticket) {
        if (ticket.severity === "low") {
            console.log(`  [L1] Handling ticket: ${ticket.issue}`);
            return { resolved: true, by: "Level 1 Support" };
        }
        console.log("  [L1] Escalating to Level 2...");
        return super.handle(ticket);
    }
}

class Level2Support extends SupportHandler {
    handle(ticket) {
        if (ticket.severity === "medium") {
            console.log(`  [L2] Handling ticket: ${ticket.issue}`);
            return { resolved: true, by: "Level 2 Support" };
        }
        console.log("  [L2] Escalating to Level 3...");
        return super.handle(ticket);
    }
}

class Level3Support extends SupportHandler {
    handle(ticket) {
        if (ticket.severity === "high") {
            console.log(`  [L3] Handling ticket: ${ticket.issue}`);
            return { resolved: true, by: "Level 3 Support" };
        }
        console.log("  [L3] Escalating to Manager...");
        return super.handle(ticket);
    }
}

class ManagerSupport extends SupportHandler {
    handle(ticket) {
        console.log(`  [MANAGER] Handling critical ticket: ${ticket.issue}`);
        return { resolved: true, by: "Manager" };
    }
}

console.log("Chain of Responsibility - Support Tickets:");

// Build chain
const l1 = new Level1Support();
const l2 = new Level2Support();
const l3 = new Level3Support();
const manager = new ManagerSupport();

l1.setNext(l2).setNext(l3).setNext(manager);

// Test tickets
console.log("\n  Ticket 1 (low severity):");
l1.handle({ issue: "Password reset", severity: "low" });

console.log("\n  Ticket 2 (high severity):");
l1.handle({ issue: "System down", severity: "high" });

console.log("\n  Ticket 3 (critical severity):");
l1.handle({ issue: "Data breach", severity: "critical" });

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 6: MEDIATOR                                ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     MEDIATOR PATTERN                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Define an object that encapsulates how objects interact.      │
 * │           Promotes loose coupling by preventing direct references.      │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   WITHOUT MEDIATOR:           WITH MEDIATOR:                    │    │
 * │  │                                                                  │    │
 * │  │   ┌───┐◄────►┌───┐            ┌───┐      ┌───┐                  │    │
 * │  │   │ A │      │ B │            │ A │      │ B │                  │    │
 * │  │   └─┬─┘◄────►└─┬─┘            └─┬─┘      └─┬─┘                  │    │
 * │  │     │          │                │          │                     │    │
 * │  │     ▼          ▼                └────┬─────┘                     │    │
 * │  │   ┌───┐◄────►┌───┐                   ▼                          │    │
 * │  │   │ C │      │ D │            ┌────────────┐                    │    │
 * │  │   └───┘      └───┘            │  MEDIATOR  │                    │    │
 * │  │                               └──────┬─────┘                    │    │
 * │  │   (tight coupling)                   │                          │    │
 * │  │                               ┌──────┴─────┐                    │    │
 * │  │                               │            │                     │    │
 * │  │                             ┌───┐      ┌───┐                    │    │
 * │  │                             │ C │      │ D │                    │    │
 * │  │                             └───┘      └───┘                    │    │
 * │  │                                                                  │    │
 * │  │                              (loose coupling)                   │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Mediator
class ChatRoom {
    constructor() {
        this.users = new Map();
    }

    register(user) {
        this.users.set(user.name, user);
        user.chatRoom = this;
    }

    send(message, from, to) {
        const timestamp = new Date().toLocaleTimeString();

        if (to) {
            // Private message
            const recipient = this.users.get(to);
            if (recipient) {
                recipient.receive(message, from, timestamp);
            }
        } else {
            // Broadcast
            this.users.forEach((user, name) => {
                if (name !== from) {
                    user.receive(message, from, timestamp);
                }
            });
        }
    }
}

// Colleague
class ChatUser {
    constructor(name) {
        this.name = name;
        this.chatRoom = null;
    }

    send(message, to = null) {
        console.log(`  [${this.name}] Sending: "${message}"${to ? ` to ${to}` : " (broadcast)"}`);
        this.chatRoom.send(message, this.name, to);
    }

    receive(message, from, timestamp) {
        console.log(`  [${this.name}] Received from ${from}: "${message}" at ${timestamp}`);
    }
}

console.log("Mediator Pattern - Chat Room:");

const chatRoom = new ChatRoom();

const alice = new ChatUser("Alice");
const bob = new ChatUser("Bob");
const charlie = new ChatUser("Charlie");

chatRoom.register(alice);
chatRoom.register(bob);
chatRoom.register(charlie);

alice.send("Hello everyone!"); // Broadcast
console.log("");
bob.send("Hi Alice!", "Alice"); // Private message

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 7: ITERATOR                                ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     ITERATOR PATTERN                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Provide a way to access elements of a collection              │
 * │           sequentially without exposing its underlying structure.       │
 * │                                                                          │
 * │  JavaScript has built-in iterator protocol:                             │
 * │  • Symbol.iterator method                                               │
 * │  • Generator functions (function*)                                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Custom iterable collection
class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(value) {
        const node = { value, next: null };
        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        this.length++;
        return this;
    }

    // Iterator protocol
    [Symbol.iterator]() {
        let current = this.head;
        return {
            next() {
                if (current) {
                    const value = current.value;
                    current = current.next;
                    return { value, done: false };
                }
                return { done: true };
            }
        };
    }

    // Generator-based iterator
    *values() {
        let current = this.head;
        while (current) {
            yield current.value;
            current = current.next;
        }
    }

    // Reverse iterator
    *reverse() {
        const values = [...this];
        for (let i = values.length - 1; i >= 0; i--) {
            yield values[i];
        }
    }
}

console.log("Iterator Pattern - LinkedList:");

const list = new LinkedList();
list.append(1).append(2).append(3).append(4).append(5);

console.log("  for...of iteration:");
for (const value of list) {
    console.log(`    ${value}`);
}

console.log("  Spread operator:", [...list]);
console.log("  Reverse:", [...list.reverse()]);

// Range iterator
function* range(start, end, step = 1) {
    for (let i = start; i <= end; i += step) {
        yield i;
    }
}

console.log("\n  Range iterator (1-10, step 2):", [...range(1, 10, 2)]);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 8: TEMPLATE METHOD                         ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                   TEMPLATE METHOD PATTERN                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Define the skeleton of an algorithm in a method,              │
 * │           deferring some steps to subclasses.                           │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ┌─────────────────────────────────────┐                       │    │
 * │  │   │        ABSTRACT CLASS               │                       │    │
 * │  │   │                                     │                       │    │
 * │  │   │   templateMethod() {                │ ◄── The skeleton      │    │
 * │  │   │       step1();         // concrete  │                       │    │
 * │  │   │       step2();         // abstract  │                       │    │
 * │  │   │       step3();         // abstract  │                       │    │
 * │  │   │       step4();         // concrete  │                       │    │
 * │  │   │   }                                 │                       │    │
 * │  │   └───────────────┬─────────────────────┘                       │    │
 * │  │                   │                                              │    │
 * │  │         ┌─────────┴─────────┐                                   │    │
 * │  │         │                   │                                   │    │
 * │  │         ▼                   ▼                                   │    │
 * │  │   ┌───────────┐       ┌───────────┐                             │    │
 * │  │   │ Subclass1 │       │ Subclass2 │                             │    │
 * │  │   │  step2()  │       │  step2()  │  ◄── Override abstract      │    │
 * │  │   │  step3()  │       │  step3()  │      steps only             │    │
 * │  │   └───────────┘       └───────────┘                             │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Abstract class
class DataExporter {
    // Template method - defines the algorithm skeleton
    export(data) {
        const validated = this.validate(data);
        const formatted = this.format(validated);
        const processed = this.process(formatted);
        return this.output(processed);
    }

    // Concrete step - same for all
    validate(data) {
        if (!Array.isArray(data)) {
            throw new Error("Data must be an array");
        }
        console.log(`  [Validate] ${data.length} records`);
        return data.filter(item => item != null);
    }

    // Abstract steps - must be implemented
    format(data) {
        throw new Error("Must implement format()");
    }

    process(data) {
        throw new Error("Must implement process()");
    }

    // Concrete step with hook
    output(data) {
        console.log(`  [Output] Exporting ${data.length} chars`);
        return data;
    }
}

// Concrete implementations
class JSONExporter extends DataExporter {
    format(data) {
        console.log("  [Format] Converting to JSON");
        return data;
    }

    process(data) {
        console.log("  [Process] Stringifying JSON");
        return JSON.stringify(data, null, 2);
    }
}

class CSVExporter extends DataExporter {
    format(data) {
        console.log("  [Format] Preparing CSV headers");
        return data;
    }

    process(data) {
        console.log("  [Process] Converting to CSV");
        if (data.length === 0) return "";
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map(item => Object.values(item).join(","));
        return [headers, ...rows].join("\n");
    }
}

class XMLExporter extends DataExporter {
    format(data) {
        console.log("  [Format] Preparing XML structure");
        return data;
    }

    process(data) {
        console.log("  [Process] Converting to XML");
        const items = data.map(item => {
            const fields = Object.entries(item)
                .map(([k, v]) => `<${k}>${v}</${k}>`)
                .join("");
            return `<item>${fields}</item>`;
        }).join("");
        return `<data>${items}</data>`;
    }
}

console.log("Template Method Pattern - Data Export:");

const testData = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
];

console.log("\n  JSON Export:");
const jsonExporter = new JSONExporter();
console.log("  Result:", jsonExporter.export(testData).substring(0, 50) + "...");

console.log("\n  CSV Export:");
const csvExporter = new CSVExporter();
console.log("  Result:", csvExporter.export(testData));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          BEHAVIORAL PATTERNS SUMMARY                           ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 BEHAVIORAL PATTERNS COMPARISON                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PATTERN         │ PURPOSE                      │ EXAMPLE               │
 * │  ════════════════│══════════════════════════════│═══════════════════    │
 * │                  │                              │                       │
 * │  Observer        │ Notify dependents of         │ Event systems,        │
 * │                  │ state changes                │ Pub/Sub               │
 * │                  │                              │                       │
 * │  Strategy        │ Interchangeable algorithms   │ Payment methods,      │
 * │                  │                              │ Sorting algorithms    │
 * │                  │                              │                       │
 * │  Command         │ Encapsulate requests as      │ Undo/Redo,            │
 * │                  │ objects                      │ Transaction queues    │
 * │                  │                              │                       │
 * │  State           │ Behavior changes with        │ Order states,         │
 * │                  │ internal state               │ UI states             │
 * │                  │                              │                       │
 * │  Chain of        │ Pass request along chain     │ Middleware,           │
 * │  Responsibility  │ of handlers                  │ Event bubbling        │
 * │                  │                              │                       │
 * │  Mediator        │ Centralized communication    │ Chat rooms,           │
 * │                  │ between objects              │ Form orchestration    │
 * │                  │                              │                       │
 * │  Iterator        │ Sequential access without    │ Collections,          │
 * │                  │ exposing internals           │ Generators            │
 * │                  │                              │                       │
 * │  Template Method │ Define algorithm skeleton,   │ Data exporters,       │
 * │                  │ defer steps to subclasses    │ Build processes       │
 * │                  │                              │                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Behavioral Patterns Summary:");
console.log("  1. Observer   - Pub/Sub event notification");
console.log("  2. Strategy   - Swappable algorithms");
console.log("  3. Command    - Encapsulated requests with undo");
console.log("  4. State      - Behavior by internal state");
console.log("  5. Chain      - Request through handler chain");
console.log("  6. Mediator   - Centralized communication");
console.log("  7. Iterator   - Sequential collection access");
console.log("  8. Template   - Algorithm skeleton\n");

console.log("═══ FILE 3 COMPLETE ═══");
console.log("Run: node 04-module-patterns.js");
