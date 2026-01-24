/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 1: CREATIONAL DESIGN PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Creational patterns deal with object creation mechanisms, trying to create
 * objects in a manner suitable to the situation.
 *
 * PATTERNS COVERED:
 * 1. Singleton - Ensure single instance
 * 2. Factory - Create objects without specifying class
 * 3. Abstract Factory - Create families of related objects
 * 4. Builder - Construct complex objects step by step
 * 5. Prototype - Clone existing objects
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 1: CREATIONAL DESIGN PATTERNS");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 CREATIONAL PATTERNS OVERVIEW                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │
 * │   │   SINGLETON   │    │    FACTORY    │    │    BUILDER    │           │
 * │   │               │    │               │    │               │           │
 * │   │  One instance │    │ Create from   │    │ Step-by-step  │           │
 * │   │   globally    │    │   interface   │    │ construction  │           │
 * │   └───────────────┘    └───────────────┘    └───────────────┘           │
 * │                                                                          │
 * │   ┌───────────────┐    ┌───────────────┐                                │
 * │   │   PROTOTYPE   │    │   ABSTRACT    │                                │
 * │   │               │    │   FACTORY     │                                │
 * │   │ Clone objects │    │   Families    │                                │
 * │   │               │    │  of objects   │                                │
 * │   └───────────────┘    └───────────────┘                                │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 1: SINGLETON                               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     SINGLETON PATTERN                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Ensure a class has only ONE instance and provide              │
 * │           a global point of access to it.                               │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                      SINGLETON                                   │    │
 * │  │  ┌─────────────────────────────────────────────────────────┐   │    │
 * │  │  │                 instance: null                           │   │    │
 * │  │  │  ─────────────────────────────────────────────────────  │   │    │
 * │  │  │                                                          │   │    │
 * │  │  │         getInstance()                                    │   │    │
 * │  │  │              │                                           │   │    │
 * │  │  │              ▼                                           │   │    │
 * │  │  │    ┌────────────────────┐                               │   │    │
 * │  │  │    │ instance exists?   │                               │   │    │
 * │  │  │    └─────────┬──────────┘                               │   │    │
 * │  │  │        YES   │    NO                                    │   │    │
 * │  │  │         │    │    │                                     │   │    │
 * │  │  │         ▼    │    ▼                                     │   │    │
 * │  │  │    [return]  │  [create new]                            │   │    │
 * │  │  │    instance  │   instance                               │   │    │
 * │  │  │              │      │                                   │   │    │
 * │  │  │              └──────┴────► return instance              │   │    │
 * │  │  │                                                          │   │    │
 * │  │  └─────────────────────────────────────────────────────────┘   │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  USE CASES:                                                             │
 * │  • Database connections                                                 │
 * │  • Configuration managers                                               │
 * │  • Logging services                                                     │
 * │  • Cache managers                                                       │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON: IMPLEMENTATION 1 - Basic Class-based
// ═══════════════════════════════════════════════════════════════════════════

class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        this.timestamp = Date.now();
        this.data = {};
        Singleton.instance = this;
    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    setData(key, value) {
        this.data[key] = value;
    }

    getData(key) {
        return this.data[key];
    }
}

// Test
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
const s3 = new Singleton();

s1.setData("name", "Singleton Data");

console.log("Singleton Test:");
console.log("  s1 === s2:", s1 === s2); // true
console.log("  s1 === s3:", s1 === s3); // true
console.log("  s3.getData('name'):", s3.getData("name")); // "Singleton Data"

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON: IMPLEMENTATION 2 - Module Pattern (ES6)
// ═══════════════════════════════════════════════════════════════════════════

const DatabaseConnection = (() => {
    let instance = null;

    function createConnection() {
        return {
            host: "localhost",
            port: 5432,
            query: (sql) => console.log(`  Executing: ${sql}`),
            close: () => console.log("  Connection closed")
        };
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = createConnection();
                console.log("  New database connection created");
            }
            return instance;
        }
    };
})();

console.log("\nDatabase Singleton (Module Pattern):");
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log("  db1 === db2:", db1 === db2); // true

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON: IMPLEMENTATION 3 - Proxy-based
// ═══════════════════════════════════════════════════════════════════════════

function singletonProxy(TargetClass) {
    let instance = null;

    return new Proxy(TargetClass, {
        construct(target, args) {
            if (!instance) {
                instance = new target(...args);
            }
            return instance;
        }
    });
}

class Logger {
    constructor() {
        this.logs = [];
    }
    log(message) {
        this.logs.push({ time: new Date(), message });
        console.log(`  [LOG] ${message}`);
    }
    getLogs() {
        return this.logs;
    }
}

const SingletonLogger = singletonProxy(Logger);

console.log("\nProxy-based Singleton:");
const logger1 = new SingletonLogger();
const logger2 = new SingletonLogger();
logger1.log("First message");
logger2.log("Second message");
console.log("  logger1 === logger2:", logger1 === logger2);
console.log("  Total logs:", logger1.getLogs().length); // 2

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              SINGLETON: INTERVIEW EXPLANATION                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  "The Singleton pattern ensures a class has only ONE instance and       │
 * │   provides a global access point. In JavaScript, we can implement it    │
 * │   using a class with a static instance, a module pattern with closure,  │
 * │   or a Proxy.                                                           │
 * │                                                                          │
 * │   Common use cases include database connections, configuration          │
 * │   managers, and logging services where you need consistent shared       │
 * │   state across the application.                                         │
 * │                                                                          │
 * │   CAVEATS:                                                              │
 * │   • Can create hidden dependencies                                      │
 * │   • Makes unit testing harder (global state)                           │
 * │   • Not thread-safe by default in multi-threaded environments"         │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 2: FACTORY                                 ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                      FACTORY PATTERN                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Create objects without specifying the exact class.            │
 * │           Delegate instantiation to subclasses or factory methods.      │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │                    UserFactory.create(type)                     │    │
 * │  │                              │                                   │    │
 * │  │               ┌──────────────┼──────────────┐                   │    │
 * │  │               │              │              │                   │    │
 * │  │               ▼              ▼              ▼                   │    │
 * │  │        ┌──────────┐   ┌──────────┐   ┌──────────┐              │    │
 * │  │        │  Admin   │   │  Editor  │   │  Viewer  │              │    │
 * │  │        │          │   │          │   │          │              │    │
 * │  │        │ canEdit  │   │ canEdit  │   │ canView  │              │    │
 * │  │        │ canDelete│   │ canView  │   │          │              │    │
 * │  │        │ canView  │   │          │   │          │              │    │
 * │  │        └──────────┘   └──────────┘   └──────────┘              │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  BENEFITS:                                                              │
 * │  • Loose coupling (client doesn't know concrete classes)               │
 * │  • Easy to add new types                                               │
 * │  • Centralized object creation logic                                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY: IMPLEMENTATION 1 - Simple Factory
// ═══════════════════════════════════════════════════════════════════════════

class Car {
    constructor(options) {
        this.doors = options.doors || 4;
        this.color = options.color || "white";
        this.type = options.type;
    }
    describe() {
        return `${this.color} ${this.type} with ${this.doors} doors`;
    }
}

class CarFactory {
    static create(type) {
        switch (type) {
            case "sedan":
                return new Car({ type: "Sedan", doors: 4, color: "silver" });
            case "suv":
                return new Car({ type: "SUV", doors: 5, color: "black" });
            case "sports":
                return new Car({ type: "Sports", doors: 2, color: "red" });
            default:
                throw new Error(`Unknown car type: ${type}`);
        }
    }
}

console.log("Simple Factory:");
const sedan = CarFactory.create("sedan");
const sports = CarFactory.create("sports");
console.log("  Sedan:", sedan.describe());
console.log("  Sports:", sports.describe());

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY: IMPLEMENTATION 2 - Factory with Registration
// ═══════════════════════════════════════════════════════════════════════════

class UserFactory {
    static types = {};

    static register(type, UserClass) {
        UserFactory.types[type] = UserClass;
    }

    static create(type, props) {
        const UserClass = UserFactory.types[type];
        if (!UserClass) {
            throw new Error(`Unknown user type: ${type}`);
        }
        return new UserClass(props);
    }
}

class AdminUser {
    constructor({ name }) {
        this.name = name;
        this.permissions = ["read", "write", "delete", "admin"];
    }
}

class EditorUser {
    constructor({ name }) {
        this.name = name;
        this.permissions = ["read", "write"];
    }
}

class ViewerUser {
    constructor({ name }) {
        this.name = name;
        this.permissions = ["read"];
    }
}

// Register types
UserFactory.register("admin", AdminUser);
UserFactory.register("editor", EditorUser);
UserFactory.register("viewer", ViewerUser);

console.log("\nFactory with Registration:");
const admin = UserFactory.create("admin", { name: "Alice" });
const editor = UserFactory.create("editor", { name: "Bob" });
console.log("  Admin:", admin.name, "- Permissions:", admin.permissions);
console.log("  Editor:", editor.name, "- Permissions:", editor.permissions);

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY: IMPLEMENTATION 3 - Functional Factory
// ═══════════════════════════════════════════════════════════════════════════

const createNotification = (type, message) => {
    const baseNotification = {
        id: Date.now(),
        message,
        createdAt: new Date(),
        dismiss() {
            console.log(`  Dismissed: ${this.message}`);
        }
    };

    const types = {
        success: { ...baseNotification, type: "success", icon: "✓", color: "green" },
        error: { ...baseNotification, type: "error", icon: "✗", color: "red" },
        warning: { ...baseNotification, type: "warning", icon: "⚠", color: "yellow" },
        info: { ...baseNotification, type: "info", icon: "ℹ", color: "blue" }
    };

    return types[type] || types.info;
};

console.log("\nFunctional Factory:");
const success = createNotification("success", "Operation completed!");
const error = createNotification("error", "Something went wrong!");
console.log(`  ${success.icon} [${success.type}] ${success.message}`);
console.log(`  ${error.icon} [${error.type}] ${error.message}`);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 3: ABSTRACT FACTORY                        ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                   ABSTRACT FACTORY PATTERN                               │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Create families of related objects without specifying         │
 * │           their concrete classes.                                       │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                    UIFactory                                     │    │
 * │  │      ┌────────────────┴────────────────┐                        │    │
 * │  │      │                                 │                        │    │
 * │  │      ▼                                 ▼                        │    │
 * │  │ ┌──────────────┐              ┌──────────────┐                  │    │
 * │  │ │ LightFactory │              │ DarkFactory  │                  │    │
 * │  │ │              │              │              │                  │    │
 * │  │ │ createButton │              │ createButton │                  │    │
 * │  │ │ createInput  │              │ createInput  │                  │    │
 * │  │ │ createModal  │              │ createModal  │                  │    │
 * │  │ └──────┬───────┘              └──────┬───────┘                  │    │
 * │  │        │                             │                          │    │
 * │  │        ▼                             ▼                          │    │
 * │  │  ┌───────────┐                ┌───────────┐                     │    │
 * │  │  │LightButton│                │DarkButton │                     │    │
 * │  │  │LightInput │                │DarkInput  │                     │    │
 * │  │  │LightModal │                │DarkModal  │                     │    │
 * │  │  └───────────┘                └───────────┘                     │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Abstract Factory for UI Themes
class UIFactory {
    createButton() { throw new Error("Must implement createButton"); }
    createInput() { throw new Error("Must implement createInput"); }
    createCheckbox() { throw new Error("Must implement createCheckbox"); }
}

// Light Theme Factory
class LightThemeFactory extends UIFactory {
    createButton(text) {
        return {
            text,
            theme: "light",
            bgColor: "#ffffff",
            textColor: "#333333",
            render() {
                return `[Light Button: ${this.text}]`;
            }
        };
    }

    createInput(placeholder) {
        return {
            placeholder,
            theme: "light",
            bgColor: "#f5f5f5",
            borderColor: "#cccccc",
            render() {
                return `[Light Input: ${this.placeholder}]`;
            }
        };
    }

    createCheckbox(label) {
        return {
            label,
            theme: "light",
            checkmark: "☐",
            render() {
                return `${this.checkmark} ${this.label} (light)`;
            }
        };
    }
}

// Dark Theme Factory
class DarkThemeFactory extends UIFactory {
    createButton(text) {
        return {
            text,
            theme: "dark",
            bgColor: "#333333",
            textColor: "#ffffff",
            render() {
                return `[Dark Button: ${this.text}]`;
            }
        };
    }

    createInput(placeholder) {
        return {
            placeholder,
            theme: "dark",
            bgColor: "#444444",
            borderColor: "#666666",
            render() {
                return `[Dark Input: ${this.placeholder}]`;
            }
        };
    }

    createCheckbox(label) {
        return {
            label,
            theme: "dark",
            checkmark: "☑",
            render() {
                return `${this.checkmark} ${this.label} (dark)`;
            }
        };
    }
}

// Usage - Theme-agnostic code
function buildLoginForm(factory) {
    const button = factory.createButton("Login");
    const input = factory.createInput("Enter username");
    const checkbox = factory.createCheckbox("Remember me");

    return {
        render() {
            console.log(`  ${input.render()}`);
            console.log(`  ${checkbox.render()}`);
            console.log(`  ${button.render()}`);
        }
    };
}

console.log("Abstract Factory - Theme System:");
console.log("\n  Light Theme Form:");
const lightFactory = new LightThemeFactory();
buildLoginForm(lightFactory).render();

console.log("\n  Dark Theme Form:");
const darkFactory = new DarkThemeFactory();
buildLoginForm(darkFactory).render();

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 4: BUILDER                                 ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                      BUILDER PATTERN                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Construct complex objects step by step. Separate              │
 * │           construction from representation.                              │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │    QueryBuilder                                                  │    │
 * │  │         │                                                        │    │
 * │  │         ▼                                                        │    │
 * │  │    .select("name")                                              │    │
 * │  │         │                                                        │    │
 * │  │         ▼                                                        │    │
 * │  │    .from("users")                                               │    │
 * │  │         │                                                        │    │
 * │  │         ▼                                                        │    │
 * │  │    .where("active = true")                                      │    │
 * │  │         │                                                        │    │
 * │  │         ▼                                                        │    │
 * │  │    .orderBy("name")                                             │    │
 * │  │         │                                                        │    │
 * │  │         ▼                                                        │    │
 * │  │    .build()  ──────►  "SELECT name FROM users WHERE..."        │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  BENEFITS:                                                              │
 * │  • Fluent interface (method chaining)                                  │
 * │  • Encapsulates complex construction logic                             │
 * │  • Same construction process for different representations             │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// BUILDER: IMPLEMENTATION 1 - Query Builder
// ═══════════════════════════════════════════════════════════════════════════

class QueryBuilder {
    constructor() {
        this.reset();
    }

    reset() {
        this._select = [];
        this._from = "";
        this._where = [];
        this._orderBy = [];
        this._limit = null;
        return this;
    }

    select(...fields) {
        this._select.push(...fields);
        return this;
    }

    from(table) {
        this._from = table;
        return this;
    }

    where(condition) {
        this._where.push(condition);
        return this;
    }

    orderBy(field, direction = "ASC") {
        this._orderBy.push(`${field} ${direction}`);
        return this;
    }

    limit(count) {
        this._limit = count;
        return this;
    }

    build() {
        const parts = [];

        parts.push(`SELECT ${this._select.join(", ") || "*"}`);
        parts.push(`FROM ${this._from}`);

        if (this._where.length) {
            parts.push(`WHERE ${this._where.join(" AND ")}`);
        }

        if (this._orderBy.length) {
            parts.push(`ORDER BY ${this._orderBy.join(", ")}`);
        }

        if (this._limit !== null) {
            parts.push(`LIMIT ${this._limit}`);
        }

        return parts.join(" ");
    }
}

console.log("Query Builder:");
const query = new QueryBuilder()
    .select("id", "name", "email")
    .from("users")
    .where("active = true")
    .where("age >= 18")
    .orderBy("name", "ASC")
    .limit(10)
    .build();

console.log("  " + query);

// ═══════════════════════════════════════════════════════════════════════════
// BUILDER: IMPLEMENTATION 2 - HTTP Request Builder
// ═══════════════════════════════════════════════════════════════════════════

class RequestBuilder {
    constructor() {
        this.config = {
            method: "GET",
            headers: {},
            body: null,
            timeout: 30000,
            retries: 0
        };
    }

    setUrl(url) {
        this.config.url = url;
        return this;
    }

    setMethod(method) {
        this.config.method = method;
        return this;
    }

    setHeader(key, value) {
        this.config.headers[key] = value;
        return this;
    }

    setBody(body) {
        this.config.body = JSON.stringify(body);
        this.setHeader("Content-Type", "application/json");
        return this;
    }

    setTimeout(ms) {
        this.config.timeout = ms;
        return this;
    }

    setRetries(count) {
        this.config.retries = count;
        return this;
    }

    build() {
        if (!this.config.url) {
            throw new Error("URL is required");
        }
        return { ...this.config };
    }
}

console.log("\nHTTP Request Builder:");
const request = new RequestBuilder()
    .setUrl("https://api.example.com/users")
    .setMethod("POST")
    .setHeader("Authorization", "Bearer token123")
    .setBody({ name: "John", email: "john@example.com" })
    .setTimeout(5000)
    .setRetries(3)
    .build();

console.log("  Config:", JSON.stringify(request, null, 2).split('\n').map(l => '  ' + l).join('\n'));

// ═══════════════════════════════════════════════════════════════════════════
// BUILDER: IMPLEMENTATION 3 - Form Validation Builder
// ═══════════════════════════════════════════════════════════════════════════

class ValidationBuilder {
    constructor(fieldName) {
        this.fieldName = fieldName;
        this.rules = [];
    }

    required(message = `${this.fieldName} is required`) {
        this.rules.push({
            name: "required",
            validate: (value) => value !== undefined && value !== null && value !== "",
            message
        });
        return this;
    }

    minLength(length, message = `${this.fieldName} must be at least ${length} characters`) {
        this.rules.push({
            name: "minLength",
            validate: (value) => String(value).length >= length,
            message
        });
        return this;
    }

    maxLength(length, message = `${this.fieldName} must be at most ${length} characters`) {
        this.rules.push({
            name: "maxLength",
            validate: (value) => String(value).length <= length,
            message
        });
        return this;
    }

    pattern(regex, message = `${this.fieldName} format is invalid`) {
        this.rules.push({
            name: "pattern",
            validate: (value) => regex.test(String(value)),
            message
        });
        return this;
    }

    custom(validateFn, message) {
        this.rules.push({
            name: "custom",
            validate: validateFn,
            message
        });
        return this;
    }

    build() {
        return {
            field: this.fieldName,
            validate: (value) => {
                const errors = [];
                for (const rule of this.rules) {
                    if (!rule.validate(value)) {
                        errors.push(rule.message);
                    }
                }
                return { valid: errors.length === 0, errors };
            }
        };
    }
}

console.log("\nValidation Builder:");
const emailValidator = new ValidationBuilder("Email")
    .required()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .build();

const passwordValidator = new ValidationBuilder("Password")
    .required()
    .minLength(8)
    .pattern(/[A-Z]/, "Must contain uppercase letter")
    .pattern(/[0-9]/, "Must contain number")
    .build();

console.log("  Email 'test@email.com':", emailValidator.validate("test@email.com"));
console.log("  Email '':", emailValidator.validate(""));
console.log("  Password 'weak':", passwordValidator.validate("weak"));
console.log("  Password 'Strong123':", passwordValidator.validate("Strong123"));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 5: PROTOTYPE                               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     PROTOTYPE PATTERN                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Create new objects by cloning existing objects               │
 * │           (prototypes) rather than instantiating new ones.              │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │    ┌───────────────┐                                            │    │
 * │  │    │   PROTOTYPE   │                                            │    │
 * │  │    │               │                                            │    │
 * │  │    │  clone()      │                                            │    │
 * │  │    └───────┬───────┘                                            │    │
 * │  │            │                                                     │    │
 * │  │    ┌───────┴───────┐                                            │    │
 * │  │    │               │                                            │    │
 * │  │    ▼               ▼                                            │    │
 * │  │  ┌─────┐        ┌─────┐                                         │    │
 * │  │  │Clone│        │Clone│                                         │    │
 * │  │  │  1  │        │  2  │                                         │    │
 * │  │  └─────┘        └─────┘                                         │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  WHEN TO USE:                                                           │
 * │  • Object creation is expensive (DB queries, API calls)                │
 * │  • Objects have complex initialization                                  │
 * │  • You need many similar objects with slight variations                │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// PROTOTYPE: IMPLEMENTATION 1 - Document Clone
// ═══════════════════════════════════════════════════════════════════════════

class DocumentPrototype {
    constructor(title, content, metadata = {}) {
        this.title = title;
        this.content = content;
        this.metadata = metadata;
        this.createdAt = new Date();
    }

    // Shallow clone
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    // Deep clone
    deepClone() {
        return new DocumentPrototype(
            this.title,
            this.content,
            JSON.parse(JSON.stringify(this.metadata))
        );
    }
}

console.log("Prototype - Document Clone:");
const originalDoc = new DocumentPrototype(
    "Template",
    "Content here",
    { tags: ["template"], author: "System" }
);

const clonedDoc = originalDoc.deepClone();
clonedDoc.title = "New Document";
clonedDoc.metadata.tags.push("copy");

console.log("  Original:", originalDoc.title, "Tags:", originalDoc.metadata.tags);
console.log("  Cloned:", clonedDoc.title, "Tags:", clonedDoc.metadata.tags);

// ═══════════════════════════════════════════════════════════════════════════
// PROTOTYPE: IMPLEMENTATION 2 - Component Prototype Registry
// ═══════════════════════════════════════════════════════════════════════════

class ComponentRegistry {
    constructor() {
        this.prototypes = new Map();
    }

    register(name, prototype) {
        this.prototypes.set(name, prototype);
    }

    create(name, overrides = {}) {
        const prototype = this.prototypes.get(name);
        if (!prototype) {
            throw new Error(`Prototype '${name}' not found`);
        }
        const clone = JSON.parse(JSON.stringify(prototype));
        return { ...clone, ...overrides };
    }
}

const registry = new ComponentRegistry();

// Register prototypes
registry.register("button", {
    type: "button",
    styles: { padding: "10px", borderRadius: "4px" },
    events: []
});

registry.register("input", {
    type: "input",
    styles: { padding: "8px", border: "1px solid #ccc" },
    placeholder: "Enter text...",
    events: []
});

console.log("\nComponent Registry:");
const primaryButton = registry.create("button", { variant: "primary", label: "Submit" });
const secondaryButton = registry.create("button", { variant: "secondary", label: "Cancel" });
console.log("  Primary Button:", primaryButton);
console.log("  Secondary Button:", secondaryButton);

// ═══════════════════════════════════════════════════════════════════════════
// PROTOTYPE: IMPLEMENTATION 3 - Using Object.create()
// ═══════════════════════════════════════════════════════════════════════════

const vehiclePrototype = {
    init(make, model) {
        this.make = make;
        this.model = model;
        return this;
    },
    getInfo() {
        return `${this.make} ${this.model}`;
    }
};

function createVehicle(make, model) {
    return Object.create(vehiclePrototype).init(make, model);
}

console.log("\nObject.create() Prototype:");
const car1 = createVehicle("Toyota", "Camry");
const car2 = createVehicle("Honda", "Accord");
console.log("  Car 1:", car1.getInfo());
console.log("  Car 2:", car2.getInfo());
console.log("  Same prototype:", Object.getPrototypeOf(car1) === Object.getPrototypeOf(car2));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          CREATIONAL PATTERNS SUMMARY                           ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 CREATIONAL PATTERNS COMPARISON                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PATTERN          │ USE WHEN                    │ EXAMPLE               │
 * │  ═════════════════│═════════════════════════════│══════════════════════ │
 * │                   │                             │                       │
 * │  Singleton        │ Need single instance        │ DB connection,        │
 * │                   │ with global access          │ Logger, Config        │
 * │                   │                             │                       │
 * │  Factory          │ Create objects without      │ User types,           │
 * │                   │ specifying exact class      │ Notification types    │
 * │                   │                             │                       │
 * │  Abstract Factory │ Create families of          │ UI themes,            │
 * │                   │ related objects             │ Cross-platform UI     │
 * │                   │                             │                       │
 * │  Builder          │ Complex object with         │ Query builder,        │
 * │                   │ many configuration options  │ Request builder       │
 * │                   │                             │                       │
 * │  Prototype        │ Clone expensive objects     │ Document templates,   │
 * │                   │ or object templates         │ Component registry    │
 * │                   │                             │                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Creational Patterns Summary:");
console.log("  1. Singleton  - One instance, global access");
console.log("  2. Factory    - Create without specifying class");
console.log("  3. Abstract Factory - Families of related objects");
console.log("  4. Builder    - Step-by-step construction");
console.log("  5. Prototype  - Clone existing objects\n");

console.log("═══ FILE 1 COMPLETE ═══");
console.log("Run: node 02-structural-patterns.js");
