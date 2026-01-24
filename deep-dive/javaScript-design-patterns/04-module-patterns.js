/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 4: MODULE PATTERNS IN JAVASCRIPT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Module patterns help organize code, encapsulate functionality,
 * and manage dependencies.
 *
 * PATTERNS COVERED:
 * 1. Revealing Module Pattern
 * 2. IIFE Module Pattern
 * 3. Namespace Pattern
 * 4. Sandbox Pattern
 * 5. Import/Export Patterns (ES6)
 * 6. CommonJS Pattern
 * 7. Mixin Pattern
 * 8. Dependency Injection
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 4: MODULE PATTERNS IN JAVASCRIPT");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MODULE PATTERNS OVERVIEW                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   EVOLUTION OF MODULES:                                                 │
 * │                                                                          │
 * │   1995 ─────► 2009 ─────► 2015 ─────► Now                              │
 * │   Global     IIFE/       CommonJS    ES Modules                        │
 * │   Namespace  Revealing   (Node.js)   (Native)                          │
 * │                                                                          │
 * │   ┌───────────────────────────────────────────────────────────────┐    │
 * │   │                                                                │    │
 * │   │   GOALS OF MODULE PATTERNS:                                   │    │
 * │   │   • Encapsulation (private/public)                            │    │
 * │   │   • Reusability                                               │    │
 * │   │   • Dependency management                                      │    │
 * │   │   • Avoid global namespace pollution                          │    │
 * │   │   • Testability                                               │    │
 * │   │                                                                │    │
 * │   └───────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 1: REVEALING MODULE PATTERN                      ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │               REVEALING MODULE PATTERN                                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Create modules with clear public API while keeping            │
 * │           internal implementation private.                              │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   const Module = (function() {                                  │    │
 * │  │                                                                  │    │
 * │  │       // PRIVATE - Not accessible outside                       │    │
 * │  │       let privateVar = "secret";                                │    │
 * │  │       function privateFunc() { ... }                            │    │
 * │  │                                                                  │    │
 * │  │       // PUBLIC - Revealed in return object                     │    │
 * │  │       function publicFunc() { ... }                             │    │
 * │  │                                                                  │    │
 * │  │       return {                                                  │    │
 * │  │           publicFunc    ◄── API exposed here                   │    │
 * │  │       };                                                        │    │
 * │  │   })();                                                         │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const UserService = (function() {
    // Private variables
    let users = [];
    let idCounter = 0;

    // Private functions
    function generateId() {
        return ++idCounter;
    }

    function validateUser(user) {
        return user.name && user.email;
    }

    // Public API
    function addUser(userData) {
        if (!validateUser(userData)) {
            throw new Error("Invalid user data");
        }
        const user = {
            id: generateId(),
            ...userData,
            createdAt: new Date()
        };
        users.push(user);
        return user;
    }

    function getUser(id) {
        return users.find(u => u.id === id);
    }

    function getAllUsers() {
        return [...users]; // Return copy to protect internal array
    }

    function deleteUser(id) {
        const index = users.findIndex(u => u.id === id);
        if (index > -1) {
            users.splice(index, 1);
            return true;
        }
        return false;
    }

    function getUserCount() {
        return users.length;
    }

    // Reveal public API
    return {
        add: addUser,
        get: getUser,
        getAll: getAllUsers,
        delete: deleteUser,
        count: getUserCount
    };
})();

console.log("Revealing Module Pattern - UserService:");

UserService.add({ name: "Alice", email: "alice@test.com" });
UserService.add({ name: "Bob", email: "bob@test.com" });

console.log("  All users:", UserService.getAll());
console.log("  User count:", UserService.count());
console.log("  Get user 1:", UserService.get(1));

// Private variables are not accessible
console.log("  Direct access to 'users':", typeof UserService.users); // undefined

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 2: IIFE MODULE PATTERN                           ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    IIFE MODULE PATTERN                                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  IIFE = Immediately Invoked Function Expression                         │
 * │                                                                          │
 * │  Creates a new scope immediately, avoiding global pollution.            │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   (function(global, $) {                                        │    │
 * │  │       // Module code here                                       │    │
 * │  │       // 'global' is window, '$' is jQuery                     │    │
 * │  │   })(window, jQuery);                                           │    │
 * │  │                                                                  │    │
 * │  │   Benefits:                                                     │    │
 * │  │   • Immediate execution                                         │    │
 * │  │   • Private scope                                               │    │
 * │  │   • Dependency injection via parameters                         │    │
 * │  │   • Clear what external dependencies are used                   │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Simulating global object
const myApp = {};

// IIFE with dependency injection
(function(app, utils) {
    // Private
    const config = {
        apiUrl: "https://api.example.com",
        timeout: 5000
    };

    // Module
    app.api = {
        get(endpoint) {
            return `GET ${config.apiUrl}/${endpoint}`;
        },
        post(endpoint, data) {
            return `POST ${config.apiUrl}/${endpoint} with ${JSON.stringify(data)}`;
        }
    };

    // Using injected dependency
    app.api.formatDate = (date) => utils.formatDate(date);

})(myApp, {
    formatDate: (d) => d.toISOString()
});

console.log("IIFE Module Pattern:");
console.log("  GET:", myApp.api.get("users"));
console.log("  POST:", myApp.api.post("users", { name: "Test" }));
console.log("  Format date:", myApp.api.formatDate(new Date()));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 3: NAMESPACE PATTERN                             ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    NAMESPACE PATTERN                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Organize code under a single global object to avoid naming conflicts.  │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   MyApp                                                         │    │
 * │  │   ├── utils                                                     │    │
 * │  │   │   ├── string                                                │    │
 * │  │   │   └── date                                                  │    │
 * │  │   ├── services                                                  │    │
 * │  │   │   ├── auth                                                  │    │
 * │  │   │   └── api                                                   │    │
 * │  │   └── components                                                │    │
 * │  │       ├── header                                                │    │
 * │  │       └── footer                                                │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Namespace with safe creation
const MyApp = MyApp || {};

// Namespace utility function
MyApp.namespace = function(namespaceString) {
    const parts = namespaceString.split(".");
    let parent = MyApp;

    // Skip 'MyApp' if included
    const startIndex = parts[0] === "MyApp" ? 1 : 0;

    for (let i = startIndex; i < parts.length; i++) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

// Create namespaces
MyApp.namespace("utils.string");
MyApp.namespace("utils.date");
MyApp.namespace("services.auth");

// Add functionality
MyApp.utils.string = {
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    truncate: (str, len) => str.length > len ? str.slice(0, len) + "..." : str
};

MyApp.utils.date = {
    format: (date) => date.toLocaleDateString(),
    relative: (date) => {
        const diff = Date.now() - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} minutes ago`;
        return `${Math.floor(mins / 60)} hours ago`;
    }
};

MyApp.services.auth = {
    login: (user, pass) => ({ token: "abc123", user }),
    logout: () => ({ success: true })
};

console.log("Namespace Pattern:");
console.log("  Capitalize:", MyApp.utils.string.capitalize("hello"));
console.log("  Truncate:", MyApp.utils.string.truncate("Hello World", 5));
console.log("  Format date:", MyApp.utils.date.format(new Date()));
console.log("  Auth login:", MyApp.services.auth.login("admin", "pass"));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 4: SANDBOX PATTERN                               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SANDBOX PATTERN                                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Provides isolated environment for modules with their dependencies.     │
 * │  Each sandbox instance is independent.                                  │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   Sandbox(['module1', 'module2'], function(box) {              │    │
 * │  │       // box has module1 and module2 functionality              │    │
 * │  │       box.module1.doSomething();                                │    │
 * │  │       box.module2.doSomethingElse();                            │    │
 * │  │   });                                                           │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

function Sandbox(...args) {
    const callback = args.pop(); // Last argument is callback
    const modules = args.length > 0 && Array.isArray(args[0]) ? args[0] : args;

    // Create sandbox instance
    const box = {};

    // Load requested modules
    modules.forEach(moduleName => {
        if (Sandbox.modules[moduleName]) {
            Sandbox.modules[moduleName](box);
        }
    });

    // Execute callback with sandbox
    callback(box);
}

// Module registry
Sandbox.modules = {};

// Define modules
Sandbox.modules.ajax = function(box) {
    box.ajax = {
        get: (url) => console.log(`  [AJAX] GET ${url}`),
        post: (url, data) => console.log(`  [AJAX] POST ${url}`, data)
    };
};

Sandbox.modules.dom = function(box) {
    box.dom = {
        find: (selector) => console.log(`  [DOM] Finding ${selector}`),
        create: (tag) => console.log(`  [DOM] Creating <${tag}>`)
    };
};

Sandbox.modules.events = function(box) {
    const listeners = {};
    box.events = {
        on: (event, fn) => {
            listeners[event] = listeners[event] || [];
            listeners[event].push(fn);
            console.log(`  [EVENTS] Registered listener for '${event}'`);
        },
        emit: (event, data) => {
            (listeners[event] || []).forEach(fn => fn(data));
        }
    };
};

console.log("Sandbox Pattern:");

// Create sandboxed environment with specific modules
Sandbox(["ajax", "events"], function(box) {
    console.log("  Sandbox 1 (ajax + events):");
    box.ajax.get("/api/users");
    box.events.on("loaded", () => console.log("  Data loaded!"));
    box.events.emit("loaded");
});

Sandbox(["dom"], function(box) {
    console.log("\n  Sandbox 2 (dom only):");
    box.dom.find("#app");
    box.dom.create("div");
    // box.ajax would be undefined here
});

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 5: ES6 MODULES                                   ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ES6 MODULES                                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Native module system in JavaScript.                                    │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   // Named exports                                              │    │
 * │  │   export const foo = 1;                                         │    │
 * │  │   export function bar() { }                                     │    │
 * │  │   export class Baz { }                                          │    │
 * │  │                                                                  │    │
 * │  │   // Default export                                             │    │
 * │  │   export default class MainClass { }                            │    │
 * │  │                                                                  │    │
 * │  │   // Named imports                                              │    │
 * │  │   import { foo, bar } from './module.js';                       │    │
 * │  │                                                                  │    │
 * │  │   // Default import                                             │    │
 * │  │   import MainClass from './module.js';                          │    │
 * │  │                                                                  │    │
 * │  │   // Import all                                                 │    │
 * │  │   import * as Utils from './utils.js';                          │    │
 * │  │                                                                  │    │
 * │  │   // Re-export                                                  │    │
 * │  │   export { foo, bar } from './other.js';                        │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  KEY FEATURES:                                                          │
 * │  • Static analysis (tree-shaking)                                       │
 * │  • Live bindings (not copies)                                           │
 * │  • Strict mode by default                                               │
 * │  • Async loading support                                                │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("ES6 Modules - Export/Import Patterns:");

console.log(`
  // math.js - Named exports
  export const PI = 3.14159;
  export function add(a, b) { return a + b; }
  export function multiply(a, b) { return a * b; }

  // Logger.js - Default export
  export default class Logger {
    log(msg) { console.log(msg); }
  }

  // main.js - Imports
  import Logger from './Logger.js';              // Default
  import { add, multiply } from './math.js';     // Named
  import { PI as pi } from './math.js';          // Aliased
  import * as MathUtils from './math.js';        // Namespace

  // Dynamic import (async)
  const module = await import('./heavy-module.js');
`);

// Simulated module pattern
const MathModule = {
    PI: 3.14159,
    add: (a, b) => a + b,
    multiply: (a, b) => a * b
};

console.log("  Simulated module usage:");
console.log("  PI:", MathModule.PI);
console.log("  add(2, 3):", MathModule.add(2, 3));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 6: MIXIN PATTERN                                 ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MIXIN PATTERN                                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Add functionality to objects/classes without inheritance.              │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ┌────────────────┐                                            │    │
 * │  │   │    MyClass     │                                            │    │
 * │  │   │                │                                            │    │
 * │  │   │  ownMethod()   │                                            │    │
 * │  │   └───────┬────────┘                                            │    │
 * │  │           │                                                      │    │
 * │  │     ┌─────┼─────┬─────────┐                                     │    │
 * │  │     │     │     │         │                                     │    │
 * │  │     ▼     ▼     ▼         ▼                                     │    │
 * │  │  ┌──────┐┌──────┐┌──────┐┌──────┐                               │    │
 * │  │  │Mixin1││Mixin2││Mixin3││Mixin4│  ◄── Mixed in                │    │
 * │  │  │log() ││emit()││save()││load()│                               │    │
 * │  │  └──────┘└──────┘└──────┘└──────┘                               │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Mixins as plain objects
const LoggerMixin = {
    log(message) {
        console.log(`  [${this.constructor.name}] ${message}`);
    },
    warn(message) {
        console.log(`  [WARN] ${message}`);
    }
};

const EventMixin = {
    _events: null,

    on(event, handler) {
        if (!this._events) this._events = {};
        if (!this._events[event]) this._events[event] = [];
        this._events[event].push(handler);
    },

    emit(event, ...args) {
        if (!this._events || !this._events[event]) return;
        this._events[event].forEach(handler => handler(...args));
    },

    off(event, handler) {
        if (!this._events || !this._events[event]) return;
        this._events[event] = this._events[event].filter(h => h !== handler);
    }
};

const SerializableMixin = {
    toJSON() {
        return JSON.stringify(this.getData ? this.getData() : this);
    },

    fromJSON(json) {
        const data = JSON.parse(json);
        Object.assign(this, data);
        return this;
    }
};

// Mixin utility
function mixin(target, ...mixins) {
    mixins.forEach(mixinObj => {
        Object.getOwnPropertyNames(mixinObj).forEach(name => {
            if (name !== "constructor") {
                Object.defineProperty(
                    target.prototype,
                    name,
                    Object.getOwnPropertyDescriptor(mixinObj, name)
                );
            }
        });
    });
    return target;
}

// Base class
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    getData() {
        return { name: this.name, email: this.email };
    }
}

// Apply mixins
mixin(User, LoggerMixin, EventMixin, SerializableMixin);

console.log("Mixin Pattern:");

const user = new User("Alice", "alice@test.com");

// Using LoggerMixin
user.log("Created new user");

// Using EventMixin
user.on("save", () => user.log("User saved!"));
user.emit("save");

// Using SerializableMixin
console.log("  JSON:", user.toJSON());

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 7: DEPENDENCY INJECTION                          ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 DEPENDENCY INJECTION                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Provide dependencies from outside instead of creating them inside.     │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   WITHOUT DI:                    WITH DI:                       │    │
 * │  │                                                                  │    │
 * │  │   class Service {                class Service {                │    │
 * │  │       constructor() {                constructor(db, logger) {  │    │
 * │  │           this.db = new DB();            this.db = db;          │    │
 * │  │           this.logger = new Logger();    this.logger = logger;  │    │
 * │  │       }                              }                          │    │
 * │  │   }                              }                              │    │
 * │  │                                                                  │    │
 * │  │   // Tight coupling            // Loose coupling               │    │
 * │  │   // Hard to test              // Easy to mock/test            │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Simple DI Container
class Container {
    constructor() {
        this.dependencies = new Map();
        this.singletons = new Map();
    }

    register(name, factory, singleton = false) {
        this.dependencies.set(name, { factory, singleton });
        return this;
    }

    resolve(name) {
        const dep = this.dependencies.get(name);
        if (!dep) {
            throw new Error(`Dependency '${name}' not registered`);
        }

        if (dep.singleton) {
            if (!this.singletons.has(name)) {
                this.singletons.set(name, dep.factory(this));
            }
            return this.singletons.get(name);
        }

        return dep.factory(this);
    }
}

// Dependencies
class DatabaseConnection {
    constructor(config) {
        this.config = config;
        console.log(`  [DB] Connected to ${config.host}`);
    }
    query(sql) {
        return `Result of: ${sql}`;
    }
}

class LogService {
    log(message) {
        console.log(`  [LOG] ${message}`);
    }
}

class UserRepository {
    constructor(db, logger) {
        this.db = db;
        this.logger = logger;
    }

    findAll() {
        this.logger.log("Finding all users");
        return this.db.query("SELECT * FROM users");
    }

    findById(id) {
        this.logger.log(`Finding user ${id}`);
        return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
    }
}

class UserController {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }

    getUsers() {
        return this.userRepo.findAll();
    }
}

console.log("Dependency Injection:");

// Setup container
const container = new Container();

// Register dependencies
container.register("config", () => ({
    host: "localhost",
    port: 5432,
    database: "myapp"
}));

container.register("db", (c) =>
    new DatabaseConnection(c.resolve("config")),
    true // singleton
);

container.register("logger", () =>
    new LogService(),
    true // singleton
);

container.register("userRepo", (c) =>
    new UserRepository(c.resolve("db"), c.resolve("logger"))
);

container.register("userController", (c) =>
    new UserController(c.resolve("userRepo"))
);

// Resolve and use
const controller = container.resolve("userController");
console.log("  " + controller.getUsers());

// For testing, we can inject mocks
console.log("\n  Testing with mocks:");
const mockContainer = new Container();
mockContainer.register("db", () => ({
    query: () => "MOCK: [{id: 1, name: 'Test'}]"
}));
mockContainer.register("logger", () => ({
    log: (msg) => console.log(`  [MOCK LOG] ${msg}`)
}));
mockContainer.register("userRepo", (c) =>
    new UserRepository(c.resolve("db"), c.resolve("logger"))
);

const testRepo = mockContainer.resolve("userRepo");
console.log("  " + testRepo.findAll());

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       PATTERN 8: FACTORY MODULE PATTERN                        ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                   FACTORY MODULE PATTERN                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Factory function that creates module instances with private state.     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

function createStore(initialState = {}) {
    // Private state for each instance
    let state = { ...initialState };
    const listeners = [];

    // Private methods
    function notify() {
        listeners.forEach(listener => listener(state));
    }

    // Public API
    return {
        getState() {
            return { ...state };
        },

        setState(newState) {
            state = { ...state, ...newState };
            notify();
        },

        subscribe(listener) {
            listeners.push(listener);
            return () => {
                const index = listeners.indexOf(listener);
                if (index > -1) listeners.splice(index, 1);
            };
        },

        reset() {
            state = { ...initialState };
            notify();
        }
    };
}

console.log("Factory Module Pattern - Store:");

// Create independent instances
const store1 = createStore({ count: 0 });
const store2 = createStore({ name: "Test" });

store1.subscribe(state => console.log("  Store1 updated:", state));
store2.subscribe(state => console.log("  Store2 updated:", state));

store1.setState({ count: 1 });
store2.setState({ name: "Updated" });

console.log("  Store1 state:", store1.getState());
console.log("  Store2 state:", store2.getState());

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          MODULE PATTERNS SUMMARY                               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 MODULE PATTERNS COMPARISON                               │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PATTERN              │ USE WHEN                  │ KEY BENEFIT          │
 * │  ════════════════════ │═══════════════════════════│═════════════════════ │
 * │                       │                           │                      │
 * │  Revealing Module     │ Need private/public split │ Clean API            │
 * │                       │                           │                      │
 * │  IIFE                 │ Immediate execution,      │ Dependency           │
 * │                       │ legacy browser support    │ injection            │
 * │                       │                           │                      │
 * │  Namespace            │ Organizing large apps     │ Avoid globals        │
 * │                       │                           │                      │
 * │  Sandbox              │ Isolated environments     │ Independence         │
 * │                       │                           │                      │
 * │  ES6 Modules          │ Modern applications       │ Native, tree-shake   │
 * │                       │                           │                      │
 * │  Mixin                │ Share behavior across     │ Composition over     │
 * │                       │ unrelated classes         │ inheritance          │
 * │                       │                           │                      │
 * │  Dependency Injection │ Testable, flexible code   │ Loose coupling       │
 * │                       │                           │                      │
 * │  Factory Module       │ Multiple instances        │ Private per instance │
 * │                       │ with private state        │                      │
 * │                       │                           │                      │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Module Patterns Summary:");
console.log("  1. Revealing Module - Clear public API, private internals");
console.log("  2. IIFE - Immediate execution with dependencies");
console.log("  3. Namespace - Organize under global object");
console.log("  4. Sandbox - Isolated module environments");
console.log("  5. ES6 Modules - Native import/export");
console.log("  6. Mixin - Share behavior without inheritance");
console.log("  7. Dependency Injection - Loose coupling, testability");
console.log("  8. Factory Module - Instance-specific private state\n");

console.log("═══ FILE 4 COMPLETE ═══");
console.log("Run: node 05-reactive-patterns.js");
