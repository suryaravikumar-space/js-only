/**
 * DESIGN PATTERNS: 01 - Singleton Pattern
 *
 * ONE CONCEPT: Ensure only ONE instance of a class exists
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS SINGLETON?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Singleton = Only ONE instance can ever exist.
 *
 * Every time you ask for it, you get the SAME object.
 *
 *
 * REAL-WORLD EXAMPLES:
 * ────────────────────
 *
 *   • Database connection pool  (don't want multiple pools)
 *   • Logger                    (one log file)
 *   • App configuration         (one config object)
 *   • Shopping cart             (one cart per user)
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   const db1 = Database.getInstance();
 *   const db2 = Database.getInstance();
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEMORY                                                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   First call: getInstance()                                          │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  instance === null?  YES                                    │    │
 *   │   │  Create new Database object                                 │    │
 *   │   │  Store in 'instance' variable                               │    │
 *   │   │  Return instance                                            │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   │   HEAP:                                                              │
 *   │   ┌───────────────────────┐                                          │
 *   │   │  Database Object      │◄─── instance (closure variable)          │
 *   │   │  { connection: ... }  │◄─── db1                                  │
 *   │   └───────────────────────┘◄─── db2  (SAME object!)                  │
 *   │                                                                      │
 *   │                                                                      │
 *   │   Second call: getInstance()                                         │
 *   │   ┌─────────────────────────────────────────────────────────────┐    │
 *   │   │  instance === null?  NO                                     │    │
 *   │   │  Return existing instance (no new object created)           │    │
 *   │   └─────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 *   db1 === db2  // true (same reference)
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 1: Closure (Classic)
// ═══════════════════════════════════════════════════════════════════════════

const Database = (function() {
  let instance = null;  // Private, stored in closure

  function createInstance() {
    return {
      connection: 'MongoDB://localhost',
      query(sql) {
        console.log(`Executing: ${sql}`);
      }
    };
  }

  return {
    getInstance() {
      if (instance === null) {
        instance = createInstance();
        console.log('Created NEW database instance');
      } else {
        console.log('Returning EXISTING instance');
      }
      return instance;
    }
  };
})();

console.log('=== Singleton with Closure ===\n');

const db1 = Database.getInstance();  // Creates new
const db2 = Database.getInstance();  // Returns existing

console.log('db1 === db2:', db1 === db2);  // true


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 2: ES6 Class
// ═══════════════════════════════════════════════════════════════════════════

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;  // Return existing instance
    }

    this.logs = [];
    Logger.instance = this;  // Store instance on class
  }

  log(message) {
    this.logs.push({ message, timestamp: new Date() });
    console.log(`[LOG] ${message}`);
  }

  getHistory() {
    return this.logs;
  }
}

console.log('\n=== Singleton with ES6 Class ===\n');

const logger1 = new Logger();
const logger2 = new Logger();

logger1.log('First message');
logger2.log('Second message');

console.log('logger1 === logger2:', logger1 === logger2);  // true
console.log('Total logs:', logger1.getHistory().length);   // 2


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION 3: Module Export (Modern/Simple)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * In ES Modules, the module itself is cached.
 * Export an object = automatic singleton!
 *
 * // config.js
 * const config = {
 *   apiUrl: 'https://api.example.com',
 *   timeout: 5000
 * };
 * export default config;
 *
 * // Any file that imports gets the SAME object
 * import config from './config.js';
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHEN TO USE / NOT USE
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  ✓ USE SINGLETON WHEN:                                             │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  • Exactly one instance is needed (database pool, logger)           │
 *   │  • Global access point is required                                  │
 *   │  • Creating multiple instances would cause problems                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  ✗ AVOID SINGLETON WHEN:                                           │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  • Testing is important (hard to mock singletons)                   │
 *   │  • Multiple instances might be needed later                         │
 *   │  • It's just for "convenience" (use dependency injection instead)  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Singleton pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Singleton pattern ensures that only one instance of a class
 * can ever exist. Every time you request it, you get the same object.
 *
 * In JavaScript, I typically implement it using a closure. I have a
 * private 'instance' variable, and a getInstance() method that checks
 * if instance is null. If null, it creates and stores the object.
 * If not null, it returns the existing one. The closure keeps 'instance'
 * private so it can't be tampered with from outside.
 *
 * With ES6 classes, you can check in the constructor if an instance
 * already exists on the class itself, and return that instead of
 * creating a new one.
 *
 * In modern JavaScript with ES modules, you can also just export an
 * object directly - since modules are cached, every import gets the
 * same reference.
 *
 * Common use cases are database connection pools, loggers, and app
 * configuration objects - things where multiple instances would either
 * waste resources or cause conflicts.
 *
 * One caveat: Singletons can make testing harder because they're
 * global state. So I use them sparingly and consider dependency
 * injection as an alternative."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Only one instance ever exists
 * ✓ Closure keeps instance private
 * ✓ getInstance() checks and returns/creates
 * ✓ Use cases: database, logger, config
 * ✓ Caveat: hard to test
 *
 */


// RUN: node docs/25-design-patterns/01-singleton-pattern.js
