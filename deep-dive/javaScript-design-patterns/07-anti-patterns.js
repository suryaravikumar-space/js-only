/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 7: ANTI-PATTERNS IN JAVASCRIPT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Anti-patterns are common responses to recurring problems that are
 * ineffective and counterproductive. Learning them helps you recognize
 * and avoid bad code practices.
 *
 * INTERVIEW CONTEXT:
 * Interviewers often ask about anti-patterns to assess:
 * - Code review skills
 * - Understanding of best practices
 * - Ability to identify and fix problematic code
 * - Experience with real-world codebases
 *
 * ANTI-PATTERNS COVERED:
 * 1. Callback Hell (Pyramid of Doom)
 * 2. God Object / God Class
 * 3. Magic Numbers and Strings
 * 4. Spaghetti Code
 * 5. Copy-Paste Programming
 * 6. Premature Optimization
 * 7. Over-Engineering
 * 8. Tight Coupling
 * 9. Global State Abuse
 * 10. Memory Leaks
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 7: ANTI-PATTERNS IN JAVASCRIPT");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    WHY STUDY ANTI-PATTERNS?                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   "Those who cannot remember the past are condemned to repeat it."      │
 * │                                          — George Santayana              │
 * │                                                                          │
 * │   BENEFITS OF KNOWING ANTI-PATTERNS:                                    │
 * │   ═══════════════════════════════════                                   │
 * │                                                                          │
 * │   1. RECOGNITION - Spot problems in existing code                       │
 * │   2. PREVENTION - Avoid making the same mistakes                        │
 * │   3. COMMUNICATION - Name problems in code reviews                      │
 * │   4. REFACTORING - Know how to fix common issues                        │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐  │
 * │   │                                                                  │  │
 * │   │   ANTI-PATTERN              →    SOLUTION                       │  │
 * │   │   ─────────────────────────────────────────────────────────     │  │
 * │   │   Callback Hell             →    Promises / async-await         │  │
 * │   │   God Object                →    Single Responsibility          │  │
 * │   │   Magic Numbers             →    Named Constants                 │  │
 * │   │   Spaghetti Code            →    Modular Design                  │  │
 * │   │   Copy-Paste                →    DRY / Abstractions              │  │
 * │   │   Premature Optimization    →    Profile First                   │  │
 * │   │   Over-Engineering          →    YAGNI / KISS                    │  │
 * │   │   Tight Coupling            →    Dependency Injection            │  │
 * │   │   Global State              →    State Management                │  │
 * │   │   Memory Leaks              →    Proper Cleanup                  │  │
 * │   │                                                                  │  │
 * │   └─────────────────────────────────────────────────────────────────┘  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║       ANTI-PATTERN 1: CALLBACK HELL                            ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CALLBACK HELL                                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  WHAT IS IT?                                                            │
 * │  Deeply nested callbacks that make code hard to read, maintain,         │
 * │  and debug. Also called "Pyramid of Doom" due to its visual shape.      │
 * │                                                                          │
 * │  WHY IT'S BAD:                                                          │
 * │  • Hard to follow execution flow                                        │
 * │  • Difficult error handling                                             │
 * │  • Code becomes unmaintainable                                          │
 * │  • Testing becomes nearly impossible                                    │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   VISUAL REPRESENTATION:                                        │    │
 * │  │                                                                  │    │
 * │  │   asyncOp1(function(result1) {                                  │    │
 * │  │       asyncOp2(result1, function(result2) {                     │    │
 * │  │           asyncOp3(result2, function(result3) {                 │    │
 * │  │               asyncOp4(result3, function(result4) {             │    │
 * │  │                   asyncOp5(result4, function(result5) {         │    │
 * │  │                       // MORE NESTING...                        │    │
 * │  │                   });     ◄────── The "pyramid"                 │    │
 * │  │               });                                               │    │
 * │  │           });                                                   │    │
 * │  │       });                                                       │    │
 * │  │   });                                                           │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("❌ BAD: Callback Hell");
console.log("─".repeat(50));

// Simulated async operations
const simulateAsync = (name, ms, callback) => {
    setTimeout(() => callback(null, `${name} result`), ms);
};

// ❌ ANTI-PATTERN: Callback Hell
function fetchUserDataBad(userId, callback) {
    simulateAsync("getUser", 100, (err, user) => {
        if (err) return callback(err);
        simulateAsync("getProfile", 100, (err, profile) => {
            if (err) return callback(err);
            simulateAsync("getPosts", 100, (err, posts) => {
                if (err) return callback(err);
                simulateAsync("getComments", 100, (err, comments) => {
                    if (err) return callback(err);
                    simulateAsync("getLikes", 100, (err, likes) => {
                        if (err) return callback(err);
                        // This is just 5 levels deep - imagine 10+
                        callback(null, { user, profile, posts, comments, likes });
                    });
                });
            });
        });
    });
}

console.log(`
// ❌ Callback Hell - Hard to read, maintain, and test
fetchUserData(userId, (err, user) => {
    getProfile(user.id, (err, profile) => {
        getPosts(profile.id, (err, posts) => {
            getComments(posts[0].id, (err, comments) => {
                getLikes(comments[0].id, (err, likes) => {
                    // 5 levels deep... and counting
                });
            });
        });
    });
});
`);

console.log("\n✅ GOOD: Using async/await");
console.log("─".repeat(50));

// ✅ SOLUTION: async/await
async function fetchUserDataGood(userId) {
    const user = await getUser(userId);
    const profile = await getProfile(user.id);
    const posts = await getPosts(profile.id);
    const comments = await getComments(posts[0]?.id);
    const likes = await getLikes(comments[0]?.id);

    return { user, profile, posts, comments, likes };
}

// Helper to promisify
const promisify = (name, ms) => new Promise(r =>
    setTimeout(() => r(`${name} result`), ms)
);
const getUser = (id) => promisify("user", 10);
const getProfile = (id) => promisify("profile", 10);
const getPosts = (id) => promisify("posts", 10);
const getComments = (id) => promisify("comments", 10);
const getLikes = (id) => promisify("likes", 10);

console.log(`
// ✅ Clean and readable with async/await
async function fetchUserData(userId) {
    const user = await getUser(userId);
    const profile = await getProfile(user.id);
    const posts = await getPosts(profile.id);
    const comments = await getComments(posts[0].id);
    const likes = await getLikes(comments[0].id);

    return { user, profile, posts, comments, likes };
}
`);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       ANTI-PATTERN 2: GOD OBJECT                               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    GOD OBJECT / GOD CLASS                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  WHAT IS IT?                                                            │
 * │  A class that knows too much or does too much. It violates the          │
 * │  Single Responsibility Principle by having multiple responsibilities.   │
 * │                                                                          │
 * │  WARNING SIGNS:                                                         │
 * │  • Class has hundreds/thousands of lines                                │
 * │  • Class name includes "Manager", "Handler", "Processor"                │
 * │  • Many unrelated methods grouped together                              │
 * │  • Difficult to test in isolation                                       │
 * │  • Changes in one area break unrelated features                         │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   GOD OBJECT                    PROPER SEPARATION              │    │
 * │  │   ───────────────────────────────────────────────────────────   │    │
 * │  │                                                                  │    │
 * │  │   ┌─────────────────────┐      ┌─────────┐ ┌─────────┐         │    │
 * │  │   │   AppManager        │      │  User   │ │  Order  │         │    │
 * │  │   │                     │      │ Service │ │ Service │         │    │
 * │  │   │ • createUser()      │      └─────────┘ └─────────┘         │    │
 * │  │   │ • deleteUser()      │                                       │    │
 * │  │   │ • createOrder()     │      ┌─────────┐ ┌─────────┐         │    │
 * │  │   │ • processPayment()  │  →   │ Payment │ │  Email  │         │    │
 * │  │   │ • sendEmail()       │      │ Service │ │ Service │         │    │
 * │  │   │ • generateReport()  │      └─────────┘ └─────────┘         │    │
 * │  │   │ • logActivity()     │                                       │    │
 * │  │   │ • validateData()    │      ┌─────────┐ ┌─────────┐         │    │
 * │  │   │ • cacheData()       │      │ Report  │ │  Cache  │         │    │
 * │  │   │ • ... 50 more       │      │ Service │ │ Service │         │    │
 * │  │   └─────────────────────┘      └─────────┘ └─────────┘         │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("❌ BAD: God Object");
console.log("─".repeat(50));

// ❌ ANTI-PATTERN: God Object
class ApplicationManagerBad {
    constructor() {
        this.users = [];
        this.orders = [];
        this.products = [];
        this.cache = {};
        this.logs = [];
    }

    // User operations
    createUser(data) { /* ... */ }
    deleteUser(id) { /* ... */ }
    updateUser(id, data) { /* ... */ }
    validateUser(data) { /* ... */ }
    getUserPermissions(id) { /* ... */ }

    // Order operations
    createOrder(data) { /* ... */ }
    cancelOrder(id) { /* ... */ }
    calculateTotal(order) { /* ... */ }
    applyDiscount(order, code) { /* ... */ }

    // Payment operations
    processPayment(order, method) { /* ... */ }
    refundPayment(transactionId) { /* ... */ }
    validateCreditCard(card) { /* ... */ }

    // Notification operations
    sendEmail(to, subject, body) { /* ... */ }
    sendSMS(to, message) { /* ... */ }
    sendPushNotification(userId, message) { /* ... */ }

    // Reporting operations
    generateSalesReport(startDate, endDate) { /* ... */ }
    generateUserReport() { /* ... */ }
    exportToCSV(data) { /* ... */ }

    // Caching operations
    cacheData(key, value) { /* ... */ }
    getCachedData(key) { /* ... */ }
    invalidateCache(key) { /* ... */ }

    // Logging operations
    logActivity(action, userId) { /* ... */ }
    logError(error) { /* ... */ }

    // ... and 50 more methods
}

console.log(`
// ❌ God Object - Does everything, knows everything
class ApplicationManager {
    createUser() { }
    deleteUser() { }
    createOrder() { }
    processPayment() { }
    sendEmail() { }
    generateReport() { }
    cacheData() { }
    logActivity() { }
    // ... 50 more unrelated methods
}
`);

console.log("\n✅ GOOD: Single Responsibility");
console.log("─".repeat(50));

// ✅ SOLUTION: Separate responsibilities
class UserService {
    createUser(data) {
        console.log("    [UserService] Creating user");
        return { id: 1, ...data };
    }
    deleteUser(id) { /* ... */ }
}

class OrderService {
    constructor(paymentService, notificationService) {
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }

    createOrder(orderData) {
        console.log("    [OrderService] Creating order");
        // Coordinates but doesn't implement everything
        const order = { id: 1, ...orderData };
        this.paymentService.process(order);
        this.notificationService.sendOrderConfirmation(order);
        return order;
    }
}

class PaymentServiceGood {
    process(order) {
        console.log("    [PaymentService] Processing payment");
        return { transactionId: "TXN-123" };
    }
}

class NotificationServiceGood {
    sendOrderConfirmation(order) {
        console.log("    [NotificationService] Sending confirmation");
    }
}

console.log(`
// ✅ Single Responsibility - Each class does one thing well
class UserService {
    createUser(data) { }
    deleteUser(id) { }
}

class OrderService {
    constructor(paymentService, notificationService) {
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }
    createOrder(data) {
        // Coordinates other services
    }
}

class PaymentService {
    process(order) { }
    refund(transactionId) { }
}

class NotificationService {
    sendEmail(to, message) { }
    sendSMS(to, message) { }
}
`);

// Demo
const paymentSvc = new PaymentServiceGood();
const notifySvc = new NotificationServiceGood();
const orderSvc = new OrderService(paymentSvc, notifySvc);
orderSvc.createOrder({ items: [] });

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       ANTI-PATTERN 3: MAGIC NUMBERS/STRINGS                    ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MAGIC NUMBERS AND STRINGS                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  WHAT IS IT?                                                            │
 * │  Using literal numbers or strings directly in code without              │
 * │  explaining what they represent.                                        │
 * │                                                                          │
 * │  WHY IT'S BAD:                                                          │
 * │  • No context - what does 86400 mean?                                   │
 * │  • Hard to maintain - change in multiple places                         │
 * │  • Prone to typos with strings                                          │
 * │  • Difficult to understand intent                                       │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ❌ MAGIC:                    ✅ NAMED:                        │    │
 * │  │   ────────────────────────────────────────────────────────────  │    │
 * │  │                                                                  │    │
 * │  │   if (status === 1)            if (status === STATUS.ACTIVE)   │    │
 * │  │   if (role === "admin")        if (role === ROLES.ADMIN)       │    │
 * │  │   timeout = 86400000           timeout = ONE_DAY_MS            │    │
 * │  │   tax = price * 0.0825         tax = price * TAX_RATE          │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("❌ BAD: Magic Numbers and Strings");
console.log("─".repeat(50));

// ❌ ANTI-PATTERN: Magic numbers/strings
function calculatePriceBad(price, quantity) {
    let total = price * quantity;

    // What do these numbers mean?
    if (quantity > 10) {
        total *= 0.9; // Magic number
    }
    if (quantity > 50) {
        total *= 0.85; // Another magic number
    }

    total *= 1.0825; // What tax rate is this?

    if (total > 1000) {
        total -= 50; // What's this discount?
    }

    return total;
}

// What does status === 1 mean?
function processOrderBad(order) {
    if (order.status === 1) {
        // Do something
    } else if (order.status === 2) {
        // Do something else
    } else if (order.status === 3) {
        // And another thing
    }

    // What user type is "a"?
    if (order.userType === "a") {
        // Admin logic
    }
}

console.log(`
// ❌ Magic numbers - What do these mean?
if (quantity > 10) total *= 0.9;
if (quantity > 50) total *= 0.85;
total *= 1.0825;
if (total > 1000) total -= 50;

// ❌ Magic strings - What status is 1?
if (order.status === 1) { }
if (order.userType === "a") { }
`);

console.log("\n✅ GOOD: Named Constants");
console.log("─".repeat(50));

// ✅ SOLUTION: Named constants
const DISCOUNT_THRESHOLDS = {
    BULK_SMALL: { minQuantity: 10, discount: 0.10 },
    BULK_LARGE: { minQuantity: 50, discount: 0.15 }
};

const TAX_RATE = 0.0825; // Texas state tax
const LARGE_ORDER_THRESHOLD = 1000;
const LARGE_ORDER_DISCOUNT = 50;

const ORDER_STATUS = Object.freeze({
    PENDING: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
    CANCELLED: 5
});

const USER_TYPES = Object.freeze({
    ADMIN: "admin",
    EDITOR: "editor",
    VIEWER: "viewer"
});

function calculatePriceGood(price, quantity) {
    let total = price * quantity;

    // Now it's clear what we're checking
    if (quantity >= DISCOUNT_THRESHOLDS.BULK_LARGE.minQuantity) {
        total *= (1 - DISCOUNT_THRESHOLDS.BULK_LARGE.discount);
    } else if (quantity >= DISCOUNT_THRESHOLDS.BULK_SMALL.minQuantity) {
        total *= (1 - DISCOUNT_THRESHOLDS.BULK_SMALL.discount);
    }

    total *= (1 + TAX_RATE);

    if (total > LARGE_ORDER_THRESHOLD) {
        total -= LARGE_ORDER_DISCOUNT;
    }

    return total;
}

function processOrderGood(order) {
    // Now it's clear what we're checking
    if (order.status === ORDER_STATUS.PENDING) {
        console.log("    Processing pending order");
    } else if (order.status === ORDER_STATUS.SHIPPED) {
        console.log("    Order already shipped");
    }

    if (order.userType === USER_TYPES.ADMIN) {
        console.log("    Admin privileges applied");
    }
}

console.log(`
// ✅ Named constants - Self-documenting code
const ORDER_STATUS = Object.freeze({
    PENDING: 1,
    PROCESSING: 2,
    SHIPPED: 3
});

const TAX_RATE = 0.0825;
const BULK_DISCOUNT = 0.10;

if (quantity >= BULK_THRESHOLD) {
    total *= (1 - BULK_DISCOUNT);
}
total *= (1 + TAX_RATE);

if (order.status === ORDER_STATUS.PENDING) { }
`);

processOrderGood({ status: ORDER_STATUS.PENDING, userType: USER_TYPES.ADMIN });

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       ANTI-PATTERN 4: TIGHT COUPLING                           ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    TIGHT COUPLING                                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  WHAT IS IT?                                                            │
 * │  When components are heavily dependent on each other's internal         │
 * │  implementations, making them difficult to change independently.        │
 * │                                                                          │
 * │  WHY IT'S BAD:                                                          │
 * │  • Changes ripple through the codebase                                  │
 * │  • Hard to test in isolation                                            │
 * │  • Difficult to reuse components                                        │
 * │  • Reduces flexibility                                                  │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   TIGHT COUPLING                   LOOSE COUPLING               │    │
 * │  │   ─────────────────────────────────────────────────────────     │    │
 * │  │                                                                  │    │
 * │  │   ┌─────────────┐                  ┌─────────────┐              │    │
 * │  │   │  Service A  │                  │  Service A  │              │    │
 * │  │   │             │                  │             │              │    │
 * │  │   │ new         │                  │ interface   │              │    │
 * │  │   │ ServiceB()  │                  │     │       │              │    │
 * │  │   │             │                  └─────┼───────┘              │    │
 * │  │   │ ◄──────────►│                        ▼                      │    │
 * │  │   │             │                  ┌───────────┐                │    │
 * │  │   └──────┬──────┘                  │ Interface │                │    │
 * │  │          │                         └─────┬─────┘                │    │
 * │  │          ▼                               │                      │    │
 * │  │   ┌─────────────┐                        ▼                      │    │
 * │  │   │  Service B  │                  ┌─────────────┐              │    │
 * │  │   │ (concrete)  │                  │  Service B  │              │    │
 * │  │   └─────────────┘                  │  (injected) │              │    │
 * │  │                                    └─────────────┘              │    │
 * │  │   Can't swap B                     Easy to swap B               │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("❌ BAD: Tight Coupling");
console.log("─".repeat(50));

// ❌ ANTI-PATTERN: Tight coupling
class MySQLDatabase {
    query(sql) {
        console.log(`    [MySQL] Executing: ${sql}`);
        return [{ id: 1, name: "Test" }];
    }
}

class UserServiceTight {
    constructor() {
        // ❌ Directly instantiates MySQL - can't swap databases
        this.db = new MySQLDatabase();
    }

    getUsers() {
        // ❌ Depends on MySQL-specific query format
        return this.db.query("SELECT * FROM users");
    }
}

console.log(`
// ❌ Tight coupling - can't change database without rewriting
class UserService {
    constructor() {
        // Directly creates MySQL instance
        this.db = new MySQLDatabase();
    }

    getUsers() {
        // MySQL-specific query
        return this.db.query("SELECT * FROM users");
    }
}
`);

const tightService = new UserServiceTight();
tightService.getUsers();

console.log("\n✅ GOOD: Loose Coupling with Dependency Injection");
console.log("─".repeat(50));

// ✅ SOLUTION: Dependency injection
// Interface (contract) that all databases must follow
class DatabaseInterface {
    query(queryObj) { throw new Error("Not implemented"); }
    insert(table, data) { throw new Error("Not implemented"); }
}

// MySQL implementation
class MySQLAdapter extends DatabaseInterface {
    query(queryObj) {
        const sql = `SELECT ${queryObj.fields.join(", ")} FROM ${queryObj.table}`;
        console.log(`    [MySQL] ${sql}`);
        return [{ id: 1, name: "MySQL User" }];
    }
}

// MongoDB implementation
class MongoDBAdapter extends DatabaseInterface {
    query(queryObj) {
        console.log(`    [MongoDB] db.${queryObj.table}.find()`);
        return [{ id: 1, name: "MongoDB User" }];
    }
}

// InMemory for testing
class InMemoryAdapter extends DatabaseInterface {
    constructor() {
        super();
        this.data = {
            users: [{ id: 1, name: "Test User" }]
        };
    }

    query(queryObj) {
        console.log(`    [InMemory] Getting ${queryObj.table}`);
        return this.data[queryObj.table] || [];
    }
}

// Service depends on interface, not implementation
class UserServiceLoose {
    constructor(database) {
        // ✅ Database is injected - can be any implementation
        this.db = database;
    }

    getUsers() {
        // ✅ Database-agnostic query
        return this.db.query({
            table: "users",
            fields: ["*"]
        });
    }
}

console.log(`
// ✅ Loose coupling - database is injected
class UserService {
    constructor(database) {
        // Any database that implements the interface
        this.db = database;
    }

    getUsers() {
        // Database-agnostic query
        return this.db.query({ table: "users", fields: ["*"] });
    }
}

// Easy to swap implementations
const mysqlService = new UserService(new MySQLAdapter());
const mongoService = new UserService(new MongoDBAdapter());
const testService = new UserService(new InMemoryAdapter());
`);

// Demo
console.log("\n  Using MySQL:");
const mysqlService = new UserServiceLoose(new MySQLAdapter());
mysqlService.getUsers();

console.log("  Using MongoDB:");
const mongoService = new UserServiceLoose(new MongoDBAdapter());
mongoService.getUsers();

console.log("  Using InMemory (for tests):");
const testService = new UserServiceLoose(new InMemoryAdapter());
testService.getUsers();

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       ANTI-PATTERN 5: MEMORY LEAKS                             ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MEMORY LEAKS                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  WHAT IS IT?                                                            │
 * │  Memory that is no longer needed but isn't released, causing the        │
 * │  application to consume more and more memory over time.                 │
 * │                                                                          │
 * │  COMMON CAUSES IN JAVASCRIPT:                                           │
 * │  1. Forgotten timers/intervals                                          │
 * │  2. Closures holding references                                         │
 * │  3. Event listeners not removed                                         │
 * │  4. Detached DOM references                                             │
 * │  5. Global variables                                                    │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   MEMORY LEAK VISUAL:                                           │    │
 * │  │                                                                  │    │
 * │  │   Memory                                                        │    │
 * │  │     ▲                                                           │    │
 * │  │     │                              ╱ ← Never released           │    │
 * │  │     │                           ╱                               │    │
 * │  │     │                        ╱                                  │    │
 * │  │     │                     ╱                                     │    │
 * │  │     │                  ╱                                        │    │
 * │  │     │               ╱                                           │    │
 * │  │     │            ╱                                              │    │
 * │  │     │         ╱                                                 │    │
 * │  │     │      ╱                                                    │    │
 * │  │     │   ╱                                                       │    │
 * │  │     └──────────────────────────────────────────► Time           │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("❌ BAD: Memory Leaks");
console.log("─".repeat(50));

// ❌ ANTI-PATTERN 1: Forgotten interval
class LeakyTimerBad {
    constructor() {
        // ❌ This interval never gets cleared!
        setInterval(() => {
            console.log("    [LeakyTimer] Still running...");
        }, 1000);
    }
    // No cleanup method
}

// ❌ ANTI-PATTERN 2: Event listeners not removed
class LeakyEventsBad {
    constructor() {
        this.data = new Array(10000).fill("large data");

        // ❌ Listener holds reference to `this`, preventing GC
        // document.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(event) {
        console.log(this.data.length);
    }

    // destroy() method missing - no cleanup!
}

// ❌ ANTI-PATTERN 3: Closure holding large reference
function createLeakyClosure() {
    const largeData = new Array(1000000).fill("x");

    // ❌ Returns function that keeps largeData in memory forever
    return function() {
        return largeData.length;
    };
}

console.log(`
// ❌ Memory Leak 1: Forgotten interval
class Component {
    constructor() {
        setInterval(() => { /* ... */ }, 1000);
        // Never cleared!
    }
}

// ❌ Memory Leak 2: Event listeners not removed
class Component {
    constructor() {
        document.addEventListener("click", this.handleClick);
        // Never removed!
    }
}

// ❌ Memory Leak 3: Closures holding references
function createHandler() {
    const hugeData = new Array(1000000);
    return () => hugeData.length;  // hugeData never freed
}
`);

console.log("\n✅ GOOD: Proper Cleanup");
console.log("─".repeat(50));

// ✅ SOLUTION: Proper cleanup
class CleanComponent {
    constructor() {
        this.data = new Array(100).fill("data");
        this.intervalId = null;
        this.boundHandler = this.handleClick.bind(this);
    }

    start() {
        // Store interval ID for cleanup
        this.intervalId = setInterval(() => {
            console.log("    [CleanComponent] Tick");
        }, 1000);

        // Store bound handler for removal
        // document.addEventListener("click", this.boundHandler);
        console.log("    [CleanComponent] Started with event listeners");
    }

    handleClick(event) {
        console.log("    Click handled");
    }

    // ✅ Cleanup method
    destroy() {
        // Clear interval
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Remove event listener
        // document.removeEventListener("click", this.boundHandler);

        // Clear data references
        this.data = null;

        console.log("    [CleanComponent] Cleaned up all resources");
    }
}

// ✅ Using AbortController for event cleanup
class ModernEventHandling {
    constructor() {
        this.abortController = new AbortController();
    }

    setup() {
        // All listeners can be removed at once via abort
        const options = { signal: this.abortController.signal };

        // document.addEventListener("click", this.onClick, options);
        // document.addEventListener("scroll", this.onScroll, options);
        // window.addEventListener("resize", this.onResize, options);
        console.log("    [ModernEvents] Multiple listeners added with AbortController");
    }

    destroy() {
        // ✅ One call removes ALL listeners
        this.abortController.abort();
        console.log("    [ModernEvents] All listeners removed with abort()");
    }
}

console.log(`
// ✅ Proper cleanup
class Component {
    constructor() {
        this.intervalId = null;
        this.abortController = new AbortController();
    }

    start() {
        this.intervalId = setInterval(() => {}, 1000);

        // Use AbortController for easy cleanup
        document.addEventListener("click", handler, {
            signal: this.abortController.signal
        });
    }

    destroy() {
        clearInterval(this.intervalId);
        this.abortController.abort();  // Removes ALL listeners
        this.data = null;
    }
}
`);

// Demo
const component = new CleanComponent();
component.start();
setTimeout(() => component.destroy(), 100);

const modernEvents = new ModernEventHandling();
modernEvents.setup();
modernEvents.destroy();

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║       ANTI-PATTERN 6: PREMATURE OPTIMIZATION                   ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PREMATURE OPTIMIZATION                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  "Premature optimization is the root of all evil"                       │
 * │                                          — Donald Knuth                  │
 * │                                                                          │
 * │  WHAT IS IT?                                                            │
 * │  Optimizing code before knowing if it's actually a performance          │
 * │  bottleneck, often at the cost of readability and maintainability.      │
 * │                                                                          │
 * │  WHY IT'S BAD:                                                          │
 * │  • Wastes development time                                              │
 * │  • Makes code harder to understand                                      │
 * │  • Often optimizes the wrong things                                     │
 * │  • Can introduce bugs                                                   │
 * │                                                                          │
 * │  THE RIGHT APPROACH:                                                    │
 * │  1. Write clear, correct code first                                     │
 * │  2. Measure performance with profiling tools                            │
 * │  3. Identify actual bottlenecks                                         │
 * │  4. Optimize only what matters                                          │
 * │  5. Measure again to verify improvement                                 │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("❌ BAD: Premature Optimization");
console.log("─".repeat(50));

// ❌ ANTI-PATTERN: Micro-optimizations that hurt readability
function sumArrayBad(arr) {
    // ❌ "Optimized" but unreadable
    // Saving length to variable, using bitwise, manual loop
    let i = arr.length;
    let sum = 0;
    while (i--) {
        sum = (sum + arr[i]) | 0; // Bitwise OR for "faster" integer
    }
    return sum;
}

// ❌ Over-engineered caching for simple operations
class OverOptimizedCalculator {
    constructor() {
        this.cache = new Map();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    // ❌ Caching a simple addition - the cache overhead exceeds the benefit!
    add(a, b) {
        const key = `${a}+${b}`;
        if (this.cache.has(key)) {
            this.cacheHits++;
            return this.cache.get(key);
        }
        this.cacheMisses++;
        const result = a + b;
        this.cache.set(key, result);
        return result;
    }
}

console.log(`
// ❌ Premature optimization - sacrificing readability for negligible gain
function sumArray(arr) {
    let i = arr.length;
    let sum = 0;
    while (i--) {
        sum = (sum + arr[i]) | 0;  // Bitwise "optimization"
    }
    return sum;
}

// ❌ Caching simple operations - overhead > benefit
class Calculator {
    add(a, b) {
        const key = a + "+" + b;
        if (this.cache.has(key)) return this.cache.get(key);
        const result = a + b;  // Caching addition?!
        this.cache.set(key, result);
        return result;
    }
}
`);

console.log("\n✅ GOOD: Clear Code, Profile First");
console.log("─".repeat(50));

// ✅ SOLUTION: Write clear code first
function sumArrayGood(arr) {
    // ✅ Clear and readable - and fast enough for 99% of cases
    return arr.reduce((sum, num) => sum + num, 0);
}

// ✅ Only optimize what's actually slow (with profiling proof)
class SmartCalculator {
    constructor() {
        // Only cache expensive operations
        this.fibCache = new Map();
    }

    add(a, b) {
        // ✅ Simple operation - no caching needed
        return a + b;
    }

    // ✅ This SHOULD be cached - exponential time without it
    fibonacci(n) {
        if (n <= 1) return n;

        if (this.fibCache.has(n)) {
            return this.fibCache.get(n);
        }

        const result = this.fibonacci(n - 1) + this.fibonacci(n - 2);
        this.fibCache.set(n, result);
        return result;
    }
}

console.log(`
// ✅ Clear code first
function sumArray(arr) {
    return arr.reduce((sum, num) => sum + num, 0);
}

// ✅ Only cache expensive operations
class Calculator {
    add(a, b) {
        return a + b;  // Simple - no cache needed
    }

    fibonacci(n) {
        // THIS should be cached - O(2^n) without it!
        if (this.cache.has(n)) return this.cache.get(n);
        const result = this.fib(n-1) + this.fib(n-2);
        this.cache.set(n, result);
        return result;
    }
}
`);

// Demo the difference
const calc = new SmartCalculator();
console.log("    Simple add (no cache):", calc.add(5, 3));
console.log("    Fibonacci 40 (with cache):", calc.fibonacci(40));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          ANTI-PATTERNS SUMMARY                                 ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ANTI-PATTERNS CHEAT SHEET                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  ANTI-PATTERN            │ SOLUTION                                     │
 * │  ════════════════════════│════════════════════════════════════════════  │
 * │                          │                                              │
 * │  Callback Hell           │ Promises, async/await                        │
 * │                          │                                              │
 * │  God Object              │ Single Responsibility Principle              │
 * │                          │ Split into focused classes                   │
 * │                          │                                              │
 * │  Magic Numbers           │ Named constants                              │
 * │                          │ Configuration objects                        │
 * │                          │                                              │
 * │  Tight Coupling          │ Dependency Injection                         │
 * │                          │ Program to interfaces                        │
 * │                          │                                              │
 * │  Memory Leaks            │ Cleanup in destroy/unmount                   │
 * │                          │ AbortController, clearInterval               │
 * │                          │                                              │
 * │  Premature Optimization  │ Profile first, then optimize                 │
 * │                          │ Readability over micro-optimization          │
 * │                          │                                              │
 * │  Copy-Paste              │ DRY - Extract common code                    │
 * │                          │ Create reusable functions/classes            │
 * │                          │                                              │
 * │  Global State            │ Module pattern, State management             │
 * │                          │ Encapsulation                                │
 * │                          │                                              │
 * └──────────────────────────────────────────────────────────────────────────┘
 * │                                                                          │
 * │  INTERVIEW TIP:                                                         │
 * │  When discussing anti-patterns in interviews:                           │
 * │  1. Name the anti-pattern                                               │
 * │  2. Explain why it's problematic                                        │
 * │  3. Provide the solution/alternative                                    │
 * │  4. Give a real-world example if possible                               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

setTimeout(() => {
    console.log("Anti-Patterns Summary:");
    console.log("  1. Callback Hell      → async/await");
    console.log("  2. God Object         → Single Responsibility");
    console.log("  3. Magic Numbers      → Named Constants");
    console.log("  4. Tight Coupling     → Dependency Injection");
    console.log("  5. Memory Leaks       → Proper Cleanup");
    console.log("  6. Premature Opt      → Profile First\n");

    console.log("═══ FILE 7 COMPLETE ═══");
    console.log("Run: node 08-interview-qa.js");
}, 200);
