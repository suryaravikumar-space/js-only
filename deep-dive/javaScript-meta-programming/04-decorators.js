/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT META-PROGRAMMING - Decorators
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Decorators are a proposal to add annotations and meta-programming syntax
 * for class declarations and members. Currently Stage 3 in ECMAScript.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DECORATOR OVERVIEW                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   WHAT ARE DECORATORS?                                                  │
 * │   ═════════════════════                                                  │
 * │                                                                          │
 * │   • Functions that modify class behavior                                │
 * │   • Apply to classes, methods, fields, accessors                        │
 * │   • Execute at class definition time                                    │
 * │   • Compose with @ syntax                                               │
 * │                                                                          │
 * │   @decorator                                                             │
 * │   class MyClass {                                                       │
 * │       @methodDecorator                                                  │
 * │       myMethod() {}                                                     │
 * │                                                                          │
 * │       @fieldDecorator                                                   │
 * │       myField = value;                                                  │
 * │   }                                                                      │
 * │                                                                          │
 * │   STATUS: Stage 3 Proposal (2023)                                       │
 * │   Available via: TypeScript, Babel                                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           DECORATORS (PATTERNS & IMPLEMENTATIONS)");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * Since native decorators aren't available in Node.js yet,
 * we'll implement decorator patterns using higher-order functions.
 */

// ============================================================================
// Class Decorator Pattern
// ============================================================================
console.log("─── Class Decorator Pattern ───\n");

function sealed(target) {
    Object.seal(target);
    Object.seal(target.prototype);
    return target;
}

function withTimestamp(target) {
    return class extends target {
        constructor(...args) {
            super(...args);
            this.createdAt = new Date();
        }
    };
}

// Manual application (without @ syntax)
class User {
    constructor(name) {
        this.name = name;
    }
}

const SealedUser = sealed(User);
const TimestampedUser = withTimestamp(User);

const user = new TimestampedUser('John');
console.log("TimestampedUser:", user);
console.log("");

// ============================================================================
// Method Decorator Pattern
// ============================================================================
console.log("─── Method Decorator Pattern ───\n");

// Logging decorator
function log(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
        console.log(`[LOG] Calling ${propertyKey} with:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`[LOG] ${propertyKey} returned:`, result);
        return result;
    };

    return descriptor;
}

// Memoization decorator
function memoize(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map();

    descriptor.value = function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log(`[CACHE HIT] ${propertyKey}`);
            return cache.get(key);
        }

        console.log(`[COMPUTING] ${propertyKey}`);
        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };

    return descriptor;
}

// Manual application
class Calculator {
    add(a, b) {
        return a + b;
    }

    fibonacci(n) {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
}

// Apply decorators manually
const addDescriptor = Object.getOwnPropertyDescriptor(Calculator.prototype, 'add');
Object.defineProperty(Calculator.prototype, 'add', log(Calculator.prototype, 'add', addDescriptor));

const calc = new Calculator();
calc.add(1, 2);
console.log("");

// ============================================================================
// Common Decorator Implementations
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           COMMON DECORATOR PATTERNS");
console.log("═══════════════════════════════════════════════════════════════\n");

// ----------------------------------------------------------------------------
// 1. Readonly Decorator
// ----------------------------------------------------------------------------
console.log("─── @readonly ───\n");

function readonly(target, propertyKey, descriptor) {
    descriptor.writable = false;
    return descriptor;
}

class Config {
    get apiUrl() {
        return 'https://api.example.com';
    }
}

// Simulate readonly on a method
const config = new Config();
console.log("config.apiUrl:", config.apiUrl);
console.log("");

// ----------------------------------------------------------------------------
// 2. Debounce Decorator
// ----------------------------------------------------------------------------
console.log("─── @debounce ───\n");

function debounce(delay) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        let timeoutId;

        descriptor.value = function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                originalMethod.apply(this, args);
            }, delay);
        };

        return descriptor;
    };
}

class SearchHandler {
    search(query) {
        console.log(`Searching for: ${query}`);
    }
}

// Apply debounce manually
const searchDescriptor = Object.getOwnPropertyDescriptor(SearchHandler.prototype, 'search');
const debouncedDescriptor = debounce(300)(SearchHandler.prototype, 'search', searchDescriptor);
Object.defineProperty(SearchHandler.prototype, 'search', debouncedDescriptor);
console.log("Debounce decorator applied (300ms delay)");
console.log("");

// ----------------------------------------------------------------------------
// 3. Validate Decorator
// ----------------------------------------------------------------------------
console.log("─── @validate ───\n");

function validate(schema) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            for (let i = 0; i < args.length; i++) {
                const validator = schema[i];
                if (validator && !validator(args[i])) {
                    throw new Error(`Invalid argument at position ${i}`);
                }
            }
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

class UserService {
    createUser(name, age) {
        return { name, age };
    }
}

const createUserDescriptor = Object.getOwnPropertyDescriptor(UserService.prototype, 'createUser');
const validatedDescriptor = validate([
    name => typeof name === 'string' && name.length > 0,
    age => typeof age === 'number' && age >= 0
])(UserService.prototype, 'createUser', createUserDescriptor);
Object.defineProperty(UserService.prototype, 'createUser', validatedDescriptor);

const userService = new UserService();
console.log("Valid call:", userService.createUser('John', 25));
try {
    userService.createUser('', -5);
} catch (e) {
    console.log("Invalid call:", e.message);
}
console.log("");

// ----------------------------------------------------------------------------
// 4. Bind Decorator
// ----------------------------------------------------------------------------
console.log("─── @bind ───\n");

function bind(target, propertyKey, descriptor) {
    return {
        configurable: true,
        get() {
            const bound = descriptor.value.bind(this);
            Object.defineProperty(this, propertyKey, {
                value: bound,
                configurable: true,
                writable: true
            });
            return bound;
        }
    };
}

class Button {
    constructor(label) {
        this.label = label;
    }

    handleClick() {
        console.log(`Clicked: ${this.label}`);
    }
}

// Apply bind
const handleClickDescriptor = Object.getOwnPropertyDescriptor(Button.prototype, 'handleClick');
Object.defineProperty(Button.prototype, 'handleClick', bind(Button.prototype, 'handleClick', handleClickDescriptor));

const btn = new Button('Submit');
const handler = btn.handleClick;
handler();  // Works! 'this' is bound
console.log("");

// ----------------------------------------------------------------------------
// 5. Timing Decorator
// ----------------------------------------------------------------------------
console.log("─── @timing ───\n");

function timing(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
        const start = performance.now();
        const result = await originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
        return result;
    };

    return descriptor;
}

class DataProcessor {
    async processData(data) {
        // Simulate async work
        await new Promise(r => setTimeout(r, 100));
        return data.map(x => x * 2);
    }
}

// Apply timing
const processDescriptor = Object.getOwnPropertyDescriptor(DataProcessor.prototype, 'processData');
Object.defineProperty(DataProcessor.prototype, 'processData', timing(DataProcessor.prototype, 'processData', processDescriptor));

const processor = new DataProcessor();
processor.processData([1, 2, 3]).then(result => {
    console.log("Result:", result);
});

// ============================================================================
// TypeScript/Babel Decorator Syntax
// ============================================================================
console.log("\n─── TypeScript/Babel Syntax (Reference) ───\n");

const decoratorSyntax = `
// TypeScript decorator syntax

// Class decorator
@sealed
class Person {}

// Method decorator
class Calculator {
    @log
    @memoize
    add(a: number, b: number): number {
        return a + b;
    }
}

// Property decorator
class User {
    @observable
    name: string = '';
}

// Parameter decorator
class Controller {
    greet(@required name: string) {
        return \`Hello, \${name}\`;
    }
}

// Decorator factory (with parameters)
@Component({ selector: 'app-root' })
class AppComponent {}

// Accessor decorator
class Point {
    @configurable(false)
    get x() { return this._x; }
}
`;

console.log(decoratorSyntax);

// ============================================================================
// Stage 3 Decorator Proposal
// ============================================================================
console.log("─── Stage 3 Proposal (New Syntax) ───\n");

const stage3Syntax = `
// New decorator proposal (Stage 3)

// Decorator receives context object
function log(value, context) {
    if (context.kind === 'method') {
        return function (...args) {
            console.log(\`Calling \${context.name}\`);
            return value.apply(this, args);
        };
    }
}

// Class decorator
function register(value, context) {
    if (context.kind === 'class') {
        context.addInitializer(() => {
            Registry.register(value);
        });
    }
}

// Auto-accessor decorator
class Person {
    @tracked
    accessor name = '';  // Creates getter/setter pair
}
`;

console.log(stage3Syntax);

// ============================================================================
// Decorator Composition
// ============================================================================
console.log("─── Decorator Composition ───\n");

function compose(...decorators) {
    return function (target, propertyKey, descriptor) {
        return decorators.reduceRight((desc, decorator) => {
            return decorator(target, propertyKey, desc) || desc;
        }, descriptor);
    };
}

console.log("Decorators execute bottom-to-top:");
console.log("@first");
console.log("@second");
console.log("@third");
console.log("method() {} // third -> second -> first\n");

// ============================================================================
// Decorators Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           DECORATORS CHEAT SHEET                                ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  METHOD DECORATOR SIGNATURE:                                     ║");
console.log("║  function decorator(target, propertyKey, descriptor) {          ║");
console.log("║      // target: prototype or class                              ║");
console.log("║      // propertyKey: method name                                ║");
console.log("║      // descriptor: property descriptor                         ║");
console.log("║      return descriptor;                                         ║");
console.log("║  }                                                               ║");
console.log("║                                                                  ║");
console.log("║  DECORATOR FACTORY:                                              ║");
console.log("║  function decorator(options) {                                  ║");
console.log("║      return function(target, key, desc) { ... }                 ║");
console.log("║  }                                                               ║");
console.log("║                                                                  ║");
console.log("║  COMMON PATTERNS:                                                ║");
console.log("║  @log - Logging                                                 ║");
console.log("║  @memoize - Caching                                             ║");
console.log("║  @debounce(ms) - Debouncing                                     ║");
console.log("║  @readonly - Immutability                                       ║");
console.log("║  @bind - Auto-bind this                                         ║");
console.log("║  @validate(schema) - Validation                                 ║");
console.log("║                                                                  ║");
console.log("║  EXECUTION ORDER: Bottom to top                                 ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    sealed,
    withTimestamp,
    log,
    memoize,
    debounce,
    validate,
    bind,
    timing,
    compose
};

console.log("═══ Next: Property Descriptors ═══");
console.log("Run: node deep-dive/javaScript-meta-programming/05-property-descriptors.js");
