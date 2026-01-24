/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 2: STRUCTURAL DESIGN PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Structural patterns deal with object composition, creating relationships
 * between objects to form larger structures.
 *
 * PATTERNS COVERED:
 * 1. Adapter - Convert interface to another
 * 2. Decorator - Add responsibilities dynamically
 * 3. Facade - Simplified interface to complex system
 * 4. Proxy - Placeholder/surrogate for another object
 * 5. Composite - Tree structures of objects
 * 6. Bridge - Separate abstraction from implementation
 * 7. Flyweight - Share common state between objects
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 2: STRUCTURAL DESIGN PATTERNS");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 STRUCTURAL PATTERNS OVERVIEW                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │
 * │   │    ADAPTER    │    │   DECORATOR   │    │    FACADE     │           │
 * │   │               │    │               │    │               │           │
 * │   │  Convert      │    │ Add behavior  │    │ Simplify      │           │
 * │   │  interfaces   │    │  dynamically  │    │ complex API   │           │
 * │   └───────────────┘    └───────────────┘    └───────────────┘           │
 * │                                                                          │
 * │   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐           │
 * │   │     PROXY     │    │   COMPOSITE   │    │    BRIDGE     │           │
 * │   │               │    │               │    │               │           │
 * │   │ Control       │    │ Tree of       │    │ Separate      │           │
 * │   │ access        │    │ objects       │    │ abstraction   │           │
 * │   └───────────────┘    └───────────────┘    └───────────────┘           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 1: ADAPTER                                 ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                      ADAPTER PATTERN                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Convert the interface of a class into another interface       │
 * │           that clients expect. Lets incompatible classes work together. │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   CLIENT                                                        │    │
 * │  │      │                                                          │    │
 * │  │      │  expects method: request()                               │    │
 * │  │      ▼                                                          │    │
 * │  │   ┌──────────────┐                                              │    │
 * │  │   │   ADAPTER    │                                              │    │
 * │  │   │              │                                              │    │
 * │  │   │  request() { │──────► translates to ──────┐                │    │
 * │  │   │    ...       │                            │                │    │
 * │  │   │  }           │                            ▼                │    │
 * │  │   └──────────────┘                    ┌──────────────┐         │    │
 * │  │                                       │   ADAPTEE    │         │    │
 * │  │                                       │              │         │    │
 * │  │                                       │ specificReq()│         │    │
 * │  │                                       └──────────────┘         │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  USE CASES:                                                             │
 * │  • Legacy code integration                                              │
 * │  • Third-party library wrappers                                         │
 * │  • API version migration                                                │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Old payment system (legacy)
class OldPaymentSystem {
    constructor() {
        this.name = "LegacyPayment";
    }

    processPayment(amount, currency) {
        return {
            status: "SUCCESS",
            transactionId: "LEG-" + Date.now(),
            amount: amount,
            currency: currency
        };
    }
}

// New payment interface expected by the application
class PaymentAdapter {
    constructor(legacyPayment) {
        this.legacyPayment = legacyPayment;
    }

    // New interface method
    pay(paymentDetails) {
        // Adapt to old interface
        const result = this.legacyPayment.processPayment(
            paymentDetails.amount,
            paymentDetails.currency
        );

        // Transform response to new format
        return {
            success: result.status === "SUCCESS",
            id: result.transactionId,
            data: {
                amount: result.amount,
                currency: result.currency,
                timestamp: new Date().toISOString()
            }
        };
    }
}

console.log("Adapter Pattern - Payment System:");
const legacyPayment = new OldPaymentSystem();
const paymentAdapter = new PaymentAdapter(legacyPayment);

// Use new interface
const result = paymentAdapter.pay({ amount: 100, currency: "USD" });
console.log("  Payment result:", result);

// ═══════════════════════════════════════════════════════════════════════════
// ADAPTER: API Response Adapter
// ═══════════════════════════════════════════════════════════════════════════

// External API returns different formats
const externalAPIResponse = {
    user_name: "john_doe",
    user_email: "john@example.com",
    created_timestamp: 1640000000000,
    is_verified: 1
};

// Our app expects camelCase
function apiResponseAdapter(response) {
    return {
        userName: response.user_name,
        userEmail: response.user_email,
        createdAt: new Date(response.created_timestamp),
        isVerified: Boolean(response.is_verified)
    };
}

console.log("\nAPI Response Adapter:");
console.log("  Original:", externalAPIResponse);
console.log("  Adapted:", apiResponseAdapter(externalAPIResponse));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 2: DECORATOR                               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     DECORATOR PATTERN                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Attach additional responsibilities to an object dynamically.  │
 * │           Provides a flexible alternative to subclassing.               │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ┌────────────────────────────────────────────────────┐        │    │
 * │  │   │              LOGGING DECORATOR                      │        │    │
 * │  │   │  ┌──────────────────────────────────────────────┐  │        │    │
 * │  │   │  │           CACHE DECORATOR                    │  │        │    │
 * │  │   │  │  ┌────────────────────────────────────────┐  │  │        │    │
 * │  │   │  │  │         TIMING DECORATOR               │  │  │        │    │
 * │  │   │  │  │  ┌──────────────────────────────────┐  │  │  │        │    │
 * │  │   │  │  │  │                                  │  │  │  │        │    │
 * │  │   │  │  │  │     ORIGINAL FUNCTION            │  │  │  │        │    │
 * │  │   │  │  │  │                                  │  │  │  │        │    │
 * │  │   │  │  │  └──────────────────────────────────┘  │  │  │        │    │
 * │  │   │  │  └────────────────────────────────────────┘  │  │        │    │
 * │  │   │  └──────────────────────────────────────────────┘  │        │    │
 * │  │   └────────────────────────────────────────────────────┘        │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  BENEFITS:                                                              │
 * │  • Add behavior without modifying original class                        │
 * │  • Stack multiple decorators                                            │
 * │  • Single Responsibility Principle                                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// DECORATOR: Function Decorators
// ═══════════════════════════════════════════════════════════════════════════

// Logging decorator
function withLogging(fn, label = fn.name) {
    return function (...args) {
        console.log(`  [LOG] ${label} called with:`, args);
        const result = fn.apply(this, args);
        console.log(`  [LOG] ${label} returned:`, result);
        return result;
    };
}

// Timing decorator
function withTiming(fn, label = fn.name) {
    return function (...args) {
        const start = performance.now();
        const result = fn.apply(this, args);
        const duration = (performance.now() - start).toFixed(2);
        console.log(`  [TIME] ${label} took ${duration}ms`);
        return result;
    };
}

// Memoization decorator
function withMemoization(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log("  [CACHE] Hit for:", key);
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Original function
function calculateSum(a, b) {
    return a + b;
}

// Apply decorators
const decoratedSum = withLogging(withTiming(calculateSum), "calculateSum");

console.log("Function Decorators:");
decoratedSum(5, 3);

// ═══════════════════════════════════════════════════════════════════════════
// DECORATOR: Class Decorators (using composition)
// ═══════════════════════════════════════════════════════════════════════════

class Coffee {
    constructor() {
        this.description = "Basic Coffee";
        this.cost = 2.00;
    }

    getDescription() {
        return this.description;
    }

    getCost() {
        return this.cost;
    }
}

class CoffeeDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }

    getDescription() {
        return this.coffee.getDescription();
    }

    getCost() {
        return this.coffee.getCost();
    }
}

class MilkDecorator extends CoffeeDecorator {
    getDescription() {
        return `${super.getDescription()} + Milk`;
    }

    getCost() {
        return super.getCost() + 0.50;
    }
}

class SugarDecorator extends CoffeeDecorator {
    getDescription() {
        return `${super.getDescription()} + Sugar`;
    }

    getCost() {
        return super.getCost() + 0.25;
    }
}

class WhippedCreamDecorator extends CoffeeDecorator {
    getDescription() {
        return `${super.getDescription()} + Whipped Cream`;
    }

    getCost() {
        return super.getCost() + 0.75;
    }
}

console.log("\nClass Decorators - Coffee Shop:");
let myCoffee = new Coffee();
console.log(`  ${myCoffee.getDescription()}: $${myCoffee.getCost().toFixed(2)}`);

myCoffee = new MilkDecorator(myCoffee);
console.log(`  ${myCoffee.getDescription()}: $${myCoffee.getCost().toFixed(2)}`);

myCoffee = new SugarDecorator(myCoffee);
console.log(`  ${myCoffee.getDescription()}: $${myCoffee.getCost().toFixed(2)}`);

myCoffee = new WhippedCreamDecorator(myCoffee);
console.log(`  ${myCoffee.getDescription()}: $${myCoffee.getCost().toFixed(2)}`);

// ═══════════════════════════════════════════════════════════════════════════
// DECORATOR: ES7 Decorators (TypeScript/Babel syntax example)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ES7 Decorator Syntax (requires transpilation):
 *
 * function log(target, name, descriptor) {
 *     const original = descriptor.value;
 *     descriptor.value = function(...args) {
 *         console.log(`Calling ${name} with`, args);
 *         return original.apply(this, args);
 *     };
 *     return descriptor;
 * }
 *
 * class Calculator {
 *     @log
 *     add(a, b) {
 *         return a + b;
 *     }
 * }
 */

// Simulating ES7 decorator behavior
function createMethodDecorator(decoratorFn) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return decoratorFn(originalMethod, this, args, propertyKey);
        };
        return descriptor;
    };
}

console.log("\nES7-style Decorator Simulation:");
console.log("  See code comments for @decorator syntax");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 3: FACADE                                  ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                      FACADE PATTERN                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Provide a simplified interface to a complex subsystem.        │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   CLIENT                                                        │    │
 * │  │      │                                                          │    │
 * │  │      │  one simple call                                         │    │
 * │  │      ▼                                                          │    │
 * │  │   ┌──────────────────────────────────────────────┐              │    │
 * │  │   │              FACADE                           │              │    │
 * │  │   │                                               │              │    │
 * │  │   │    processOrder()                             │              │    │
 * │  │   │         │                                     │              │    │
 * │  │   └─────────┼─────────────────────────────────────┘              │    │
 * │  │             │                                                    │    │
 * │  │    ┌────────┼────────┬────────────┬────────────┐                │    │
 * │  │    │        │        │            │            │                │    │
 * │  │    ▼        ▼        ▼            ▼            ▼                │    │
 * │  │ ┌──────┐ ┌──────┐ ┌──────┐  ┌──────────┐ ┌──────────┐          │    │
 * │  │ │ Auth │ │ Cart │ │ Pay  │  │ Inventory│ │ Shipping │          │    │
 * │  │ └──────┘ └──────┘ └──────┘  └──────────┘ └──────────┘          │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Complex subsystems
class AuthService {
    authenticate(userId) {
        console.log(`  [Auth] Authenticating user ${userId}`);
        return { authenticated: true, token: "abc123" };
    }
}

class CartService {
    getItems(userId) {
        console.log(`  [Cart] Getting items for user ${userId}`);
        return [
            { id: 1, name: "Product A", price: 29.99 },
            { id: 2, name: "Product B", price: 49.99 }
        ];
    }

    calculateTotal(items) {
        return items.reduce((sum, item) => sum + item.price, 0);
    }

    clearCart(userId) {
        console.log(`  [Cart] Clearing cart for user ${userId}`);
    }
}

class PaymentService {
    processPayment(amount, token) {
        console.log(`  [Payment] Processing $${amount.toFixed(2)}`);
        return { success: true, transactionId: "TXN-" + Date.now() };
    }
}

class InventoryService {
    checkStock(items) {
        console.log(`  [Inventory] Checking stock for ${items.length} items`);
        return true;
    }

    reserveItems(items) {
        console.log(`  [Inventory] Reserving ${items.length} items`);
    }
}

class ShippingService {
    createShipment(userId, items) {
        console.log(`  [Shipping] Creating shipment for user ${userId}`);
        return { trackingNumber: "SHIP-" + Date.now() };
    }
}

// FACADE - Simplified interface
class OrderFacade {
    constructor() {
        this.auth = new AuthService();
        this.cart = new CartService();
        this.payment = new PaymentService();
        this.inventory = new InventoryService();
        this.shipping = new ShippingService();
    }

    // One simple method that coordinates everything
    async processOrder(userId) {
        console.log(`\n  Processing order for user ${userId}...`);

        // 1. Authenticate
        const authResult = this.auth.authenticate(userId);
        if (!authResult.authenticated) {
            throw new Error("Authentication failed");
        }

        // 2. Get cart items
        const items = this.cart.getItems(userId);
        if (items.length === 0) {
            throw new Error("Cart is empty");
        }

        // 3. Check inventory
        if (!this.inventory.checkStock(items)) {
            throw new Error("Items out of stock");
        }

        // 4. Calculate total and process payment
        const total = this.cart.calculateTotal(items);
        const paymentResult = this.payment.processPayment(total, authResult.token);

        if (!paymentResult.success) {
            throw new Error("Payment failed");
        }

        // 5. Reserve inventory and create shipment
        this.inventory.reserveItems(items);
        const shipment = this.shipping.createShipment(userId, items);

        // 6. Clear cart
        this.cart.clearCart(userId);

        return {
            orderId: "ORD-" + Date.now(),
            transactionId: paymentResult.transactionId,
            trackingNumber: shipment.trackingNumber,
            total: total
        };
    }
}

console.log("Facade Pattern - Order Processing:");
const orderFacade = new OrderFacade();
orderFacade.processOrder("user123").then(result => {
    console.log("\n  Order completed:", result);
});

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 4: PROXY                                   ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                      PROXY PATTERN                                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Provide a surrogate or placeholder for another object          │
 * │           to control access to it.                                       │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   CLIENT ────► PROXY ────► REAL OBJECT                          │    │
 * │  │                  │                                               │    │
 * │  │                  │ Can:                                          │    │
 * │  │                  │ • Validate access                             │    │
 * │  │                  │ • Cache results                               │    │
 * │  │                  │ • Log operations                              │    │
 * │  │                  │ • Lazy load                                   │    │
 * │  │                  │ • Rate limit                                  │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  TYPES:                                                                 │
 * │  • Virtual Proxy - Lazy initialization                                  │
 * │  • Protection Proxy - Access control                                    │
 * │  • Logging Proxy - Track operations                                     │
 * │  • Caching Proxy - Cache expensive operations                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════
// PROXY: Using ES6 Proxy
// ═══════════════════════════════════════════════════════════════════════════

// Validation Proxy
function createValidationProxy(target, schema) {
    return new Proxy(target, {
        set(obj, prop, value) {
            const validator = schema[prop];
            if (validator && !validator(value)) {
                throw new Error(`Invalid value for ${prop}: ${value}`);
            }
            obj[prop] = value;
            return true;
        }
    });
}

const userSchema = {
    age: (value) => typeof value === "number" && value >= 0 && value <= 150,
    email: (value) => typeof value === "string" && value.includes("@"),
    name: (value) => typeof value === "string" && value.length >= 2
};

console.log("Validation Proxy:");
const user = createValidationProxy({}, userSchema);
try {
    user.name = "John";
    user.age = 30;
    user.email = "john@example.com";
    console.log("  User created:", user);

    user.age = -5; // This will throw
} catch (e) {
    console.log("  Error:", e.message);
}

// ═══════════════════════════════════════════════════════════════════════════
// PROXY: Logging Proxy
// ═══════════════════════════════════════════════════════════════════════════

function createLoggingProxy(target, name = "Object") {
    return new Proxy(target, {
        get(obj, prop) {
            console.log(`  [GET] ${name}.${String(prop)}`);
            const value = obj[prop];
            return typeof value === "function" ? value.bind(obj) : value;
        },
        set(obj, prop, value) {
            console.log(`  [SET] ${name}.${String(prop)} = ${JSON.stringify(value)}`);
            obj[prop] = value;
            return true;
        }
    });
}

console.log("\nLogging Proxy:");
const loggedObj = createLoggingProxy({ count: 0 }, "counter");
loggedObj.count;
loggedObj.count = 5;
loggedObj.count;

// ═══════════════════════════════════════════════════════════════════════════
// PROXY: Caching Proxy
// ═══════════════════════════════════════════════════════════════════════════

class ExpensiveCalculator {
    fibonacci(n) {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
}

function createCachingProxy(target) {
    const cache = new Map();

    return new Proxy(target, {
        get(obj, prop) {
            const original = obj[prop];
            if (typeof original !== "function") return original;

            return function (...args) {
                const key = `${prop}:${JSON.stringify(args)}`;
                if (cache.has(key)) {
                    console.log(`  [CACHE HIT] ${key}`);
                    return cache.get(key);
                }
                console.log(`  [CACHE MISS] ${key}`);
                const result = original.apply(obj, args);
                cache.set(key, result);
                return result;
            };
        }
    });
}

console.log("\nCaching Proxy:");
const calculator = createCachingProxy(new ExpensiveCalculator());
console.log("  fibonacci(10):", calculator.fibonacci(10));
console.log("  fibonacci(10):", calculator.fibonacci(10)); // Cached

// ═══════════════════════════════════════════════════════════════════════════
// PROXY: Access Control Proxy
// ═══════════════════════════════════════════════════════════════════════════

function createAccessControlProxy(target, allowedRoles, currentRole) {
    return new Proxy(target, {
        get(obj, prop) {
            if (!allowedRoles.includes(currentRole)) {
                throw new Error(`Access denied. Required: ${allowedRoles}, Current: ${currentRole}`);
            }
            return obj[prop];
        },
        set(obj, prop, value) {
            if (!allowedRoles.includes(currentRole)) {
                throw new Error(`Write access denied. Required: ${allowedRoles}`);
            }
            obj[prop] = value;
            return true;
        }
    });
}

console.log("\nAccess Control Proxy:");
const adminData = { secret: "confidential" };
const protectedData = createAccessControlProxy(adminData, ["admin"], "user");

try {
    console.log("  Accessing as user:", protectedData.secret);
} catch (e) {
    console.log("  Error:", e.message);
}

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 5: COMPOSITE                               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     COMPOSITE PATTERN                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Compose objects into tree structures. Let clients treat       │
 * │           individual objects and compositions uniformly.                 │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │                    ┌───────────┐                                 │    │
 * │  │                    │  Company  │                                 │    │
 * │  │                    │  (root)   │                                 │    │
 * │  │                    └─────┬─────┘                                 │    │
 * │  │           ┌──────────────┼──────────────┐                        │    │
 * │  │           │              │              │                        │    │
 * │  │           ▼              ▼              ▼                        │    │
 * │  │      ┌─────────┐   ┌─────────┐   ┌─────────┐                    │    │
 * │  │      │ Dept A  │   │ Dept B  │   │ Dept C  │                    │    │
 * │  │      └────┬────┘   └────┬────┘   └─────────┘                    │    │
 * │  │           │             │                                        │    │
 * │  │      ┌────┼────┐   ┌────┼────┐                                  │    │
 * │  │      │    │    │   │    │    │                                  │    │
 * │  │      ▼    ▼    ▼   ▼    ▼    ▼                                  │    │
 * │  │     [E1] [E2] [E3] [E4] [E5] [E6]  ◄── Employees (leaves)       │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Component interface
class OrganizationComponent {
    constructor(name) {
        this.name = name;
    }

    getSalary() {
        throw new Error("Must implement getSalary");
    }

    print(indent = "") {
        throw new Error("Must implement print");
    }
}

// Leaf - Individual Employee
class Employee extends OrganizationComponent {
    constructor(name, salary) {
        super(name);
        this.salary = salary;
    }

    getSalary() {
        return this.salary;
    }

    print(indent = "") {
        console.log(`${indent}└─ ${this.name}: $${this.salary}`);
    }
}

// Composite - Department (can contain employees or sub-departments)
class Department extends OrganizationComponent {
    constructor(name) {
        super(name);
        this.children = [];
    }

    add(component) {
        this.children.push(component);
        return this;
    }

    remove(component) {
        const index = this.children.indexOf(component);
        if (index > -1) this.children.splice(index, 1);
        return this;
    }

    getSalary() {
        return this.children.reduce((total, child) => total + child.getSalary(), 0);
    }

    print(indent = "") {
        console.log(`${indent}┌─ ${this.name} (Total: $${this.getSalary()})`);
        this.children.forEach((child, i) => {
            const isLast = i === this.children.length - 1;
            child.print(indent + (isLast ? "   " : "│  "));
        });
    }
}

console.log("Composite Pattern - Organization:");

const company = new Department("TechCorp");

const engineering = new Department("Engineering");
engineering.add(new Employee("Alice", 120000));
engineering.add(new Employee("Bob", 110000));

const frontend = new Department("Frontend Team");
frontend.add(new Employee("Charlie", 95000));
frontend.add(new Employee("Diana", 90000));
engineering.add(frontend);

const sales = new Department("Sales");
sales.add(new Employee("Eve", 80000));
sales.add(new Employee("Frank", 85000));

company.add(engineering);
company.add(sales);
company.add(new Employee("CEO - Grace", 250000));

company.print();

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 6: BRIDGE                                  ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                      BRIDGE PATTERN                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Decouple abstraction from implementation so they can          │
 * │           vary independently.                                           │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   ABSTRACTION                         IMPLEMENTATION            │    │
 * │  │   ════════════                         ══════════════            │    │
 * │  │                                                                  │    │
 * │  │   ┌───────────┐     bridge      ┌────────────────┐              │    │
 * │  │   │ Renderer  │ ──────────────► │ RenderingAPI   │              │    │
 * │  │   └─────┬─────┘                 └────────┬───────┘              │    │
 * │  │         │                                │                       │    │
 * │  │    ┌────┴────┐                    ┌──────┴──────┐               │    │
 * │  │    │         │                    │             │               │    │
 * │  │    ▼         ▼                    ▼             ▼               │    │
 * │  │ ┌──────┐ ┌──────┐            ┌──────┐     ┌──────┐             │    │
 * │  │ │Circle│ │Square│            │ SVG  │     │Canvas│             │    │
 * │  │ └──────┘ └──────┘            └──────┘     └──────┘             │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  Without Bridge: CircleSVG, CircleCanvas, SquareSVG, SquareCanvas...   │
 * │  With Bridge: Circle + SVG, Circle + Canvas, Square + SVG...           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Implementation interface
class RenderingAPI {
    renderCircle(x, y, radius) {}
    renderSquare(x, y, side) {}
}

// Concrete implementations
class SVGRenderer extends RenderingAPI {
    renderCircle(x, y, radius) {
        console.log(`  [SVG] <circle cx="${x}" cy="${y}" r="${radius}" />`);
    }

    renderSquare(x, y, side) {
        console.log(`  [SVG] <rect x="${x}" y="${y}" width="${side}" height="${side}" />`);
    }
}

class CanvasRenderer extends RenderingAPI {
    renderCircle(x, y, radius) {
        console.log(`  [Canvas] ctx.arc(${x}, ${y}, ${radius}, 0, 2*Math.PI)`);
    }

    renderSquare(x, y, side) {
        console.log(`  [Canvas] ctx.fillRect(${x}, ${y}, ${side}, ${side})`);
    }
}

// Abstraction
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }

    draw() {}
}

// Refined abstractions
class Circle extends Shape {
    constructor(renderer, x, y, radius) {
        super(renderer);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw() {
        this.renderer.renderCircle(this.x, this.y, this.radius);
    }
}

class Square extends Shape {
    constructor(renderer, x, y, side) {
        super(renderer);
        this.x = x;
        this.y = y;
        this.side = side;
    }

    draw() {
        this.renderer.renderSquare(this.x, this.y, this.side);
    }
}

console.log("Bridge Pattern - Rendering:");

const svgRenderer = new SVGRenderer();
const canvasRenderer = new CanvasRenderer();

// Same shapes, different renderers
const circle1 = new Circle(svgRenderer, 10, 10, 50);
const circle2 = new Circle(canvasRenderer, 10, 10, 50);
const square1 = new Square(svgRenderer, 20, 20, 100);
const square2 = new Square(canvasRenderer, 20, 20, 100);

circle1.draw();
circle2.draw();
square1.draw();
square2.draw();

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║             PATTERN 7: FLYWEIGHT                               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                     FLYWEIGHT PATTERN                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PURPOSE: Share common parts of state between multiple objects          │
 * │           to minimize memory usage.                                     │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │                                                                  │    │
 * │  │   Particle System - 10,000 particles                            │    │
 * │  │                                                                  │    │
 * │  │   WITHOUT Flyweight:                                            │    │
 * │  │   ┌────────────────────────────────────┐                        │    │
 * │  │   │ Particle 1                         │                        │    │
 * │  │   │   x: 10, y: 20                     │                        │    │
 * │  │   │   texture: [large bitmap data]     │  ◄── Duplicated!      │    │
 * │  │   │   color: "red"                     │                        │    │
 * │  │   └────────────────────────────────────┘                        │    │
 * │  │   × 10,000 = HUGE memory                                        │    │
 * │  │                                                                  │    │
 * │  │   WITH Flyweight:                                               │    │
 * │  │   ┌────────────┐         ┌───────────────────┐                  │    │
 * │  │   │ Particle   │         │ ParticleType      │                  │    │
 * │  │   │ x: 10, y:20├────────►│ (shared flyweight)│                  │    │
 * │  │   │ type: ref  │         │ texture: [data]   │                  │    │
 * │  │   └────────────┘         │ color: "red"      │                  │    │
 * │  │   × 10,000 = small       └───────────────────┘                  │    │
 * │  │                           × 5 types = small                     │    │
 * │  │                                                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  INTRINSIC STATE (shared): texture, color, sprite                       │
 * │  EXTRINSIC STATE (unique): x, y, velocity                               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Flyweight - Shared intrinsic state
class ParticleType {
    constructor(texture, color, sprite) {
        this.texture = texture; // Heavy data - shared
        this.color = color;
        this.sprite = sprite;
    }

    render(x, y) {
        // Use shared properties with extrinsic position
        return `${this.color} particle at (${x}, ${y})`;
    }
}

// Flyweight Factory
class ParticleTypeFactory {
    constructor() {
        this.types = new Map();
    }

    getType(texture, color, sprite) {
        const key = `${texture}-${color}-${sprite}`;

        if (!this.types.has(key)) {
            console.log(`  Creating new ParticleType: ${key}`);
            this.types.set(key, new ParticleType(texture, color, sprite));
        }

        return this.types.get(key);
    }

    getTypeCount() {
        return this.types.size;
    }
}

// Context - Stores extrinsic state
class Particle {
    constructor(x, y, type) {
        this.x = x; // Extrinsic - unique per particle
        this.y = y;
        this.type = type; // Reference to flyweight
    }

    render() {
        return this.type.render(this.x, this.y);
    }
}

// Client
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.typeFactory = new ParticleTypeFactory();
    }

    createParticle(x, y, texture, color, sprite) {
        const type = this.typeFactory.getType(texture, color, sprite);
        this.particles.push(new Particle(x, y, type));
    }

    getStats() {
        return {
            totalParticles: this.particles.length,
            uniqueTypes: this.typeFactory.getTypeCount()
        };
    }
}

console.log("Flyweight Pattern - Particle System:");

const system = new ParticleSystem();

// Create 1000 particles but only 3 unique types
for (let i = 0; i < 1000; i++) {
    const types = [
        ["fire.png", "red", "circle"],
        ["water.png", "blue", "drop"],
        ["smoke.png", "gray", "cloud"]
    ];
    const [texture, color, sprite] = types[i % 3];
    system.createParticle(Math.random() * 800, Math.random() * 600, texture, color, sprite);
}

const stats = system.getStats();
console.log(`\n  Total particles: ${stats.totalParticles}`);
console.log(`  Unique types (flyweights): ${stats.uniqueTypes}`);
console.log(`  Memory saved: ~${((1 - stats.uniqueTypes / stats.totalParticles) * 100).toFixed(1)}%`);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          STRUCTURAL PATTERNS SUMMARY                           ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                 STRUCTURAL PATTERNS COMPARISON                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  PATTERN      │ PURPOSE                      │ EXAMPLE                  │
 * │  ═════════════│══════════════════════════════│════════════════════════  │
 * │               │                              │                          │
 * │  Adapter      │ Convert interface to         │ Legacy API wrapper,      │
 * │               │ another expected by client   │ Third-party adapters     │
 * │               │                              │                          │
 * │  Decorator    │ Add behavior dynamically     │ Logging, caching,        │
 * │               │ without modifying object     │ validation wrappers      │
 * │               │                              │                          │
 * │  Facade       │ Simplified interface to      │ Order processing,        │
 * │               │ complex subsystem            │ API clients              │
 * │               │                              │                          │
 * │  Proxy        │ Control access to object     │ Validation, caching,     │
 * │               │                              │ lazy loading, logging    │
 * │               │                              │                          │
 * │  Composite    │ Tree structure where         │ File systems, UI trees,  │
 * │               │ parts treated as whole       │ Organization charts      │
 * │               │                              │                          │
 * │  Bridge       │ Separate abstraction         │ Rendering engines,       │
 * │               │ from implementation          │ Database drivers         │
 * │               │                              │                          │
 * │  Flyweight    │ Share common state           │ Particle systems,        │
 * │               │ between many objects         │ Text rendering           │
 * │               │                              │                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Structural Patterns Summary:");
console.log("  1. Adapter    - Convert incompatible interfaces");
console.log("  2. Decorator  - Add behavior dynamically");
console.log("  3. Facade     - Simplify complex systems");
console.log("  4. Proxy      - Control access to objects");
console.log("  5. Composite  - Tree structures");
console.log("  6. Bridge     - Separate abstraction from implementation");
console.log("  7. Flyweight  - Share common state\n");

console.log("═══ FILE 2 COMPLETE ═══");
console.log("Run: node 03-behavioral-patterns.js");
