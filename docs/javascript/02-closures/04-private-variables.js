/**
 * TOPIC: Private Variables with Closures
 *
 * STORY: THE BANK VAULT
 * A bank vault (closure) holds money (private variables) that customers can't
 * touch directly. The only way to interact with the vault is through the teller
 * window (returned methods). You can ask the teller to deposit, withdraw, or
 * check your balance, but you can never walk into the vault yourself. Even if
 * you write "balance: $1,000,000" on a sticky note, the vault doesn't care —
 * the real balance is safely inside.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Closures enable TRUE privacy in JavaScript.                                ║
 * ║ Variables in outer scope are private - only accessible via returned fns.   ║
 * ║                                                                            ║
 * ║   function create() {                                                      ║
 * ║     var private = 'secret';  // PRIVATE - not on returned object!          ║
 * ║     return {                                                               ║
 * ║       getPrivate: function() { return private; }  // Only way to access    ║
 * ║     };                                                                     ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function createBankAccount(initialBalance) {
  let balance = initialBalance; // ES6: let (will be mutated)
  const transactions = []; // ES6: const (array ref stays same)

  return {
    deposit(amount) { // ES6: shorthand method
      balance += amount;
      transactions.push(`+${amount}`); // ES6: template literal
      return balance;
    },
    withdraw(amount) { // ES6: shorthand method
      if (amount > balance) return 'Insufficient funds';
      balance -= amount;
      transactions.push(`-${amount}`); // ES6: template literal
      return balance;
    },
    getBalance() { // ES6: shorthand method
      return balance;
    },
    getTransactions() { // ES6: shorthand method
      return [...transactions]; // ES6: spread operator (copy)
    }
  };
}

const account = createBankAccount(100); // ES6: const

console.log('A:', account.deposit(50));
console.log('B:', account.withdraw(30));
console.log('C:', account.balance);
console.log('D:', account.getBalance());
console.log('E:', account.getTransactions());

/**
 * OUTPUT:
 *   A: 150
 *   B: 120
 *   C: undefined
 *   D: 120
 *   E: [ '+50', '-30' ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: account.deposit(50)                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • balance starts at 100 (from initialBalance)                            ║
 * ║   • deposit adds 50: balance = 100 + 50 = 150                              ║
 * ║   • Logs '+50' to transactions                                             ║
 * ║   • Returns 150                                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: account.withdraw(30)                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   • balance is 150                                                         ║
 * ║   • 30 <= 150, so withdrawal allowed                                       ║
 * ║   • balance = 150 - 30 = 120                                               ║
 * ║   • Logs '-30' to transactions                                             ║
 * ║   • Returns 120                                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: account.balance                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • Trying to access 'balance' property directly on account                ║
 * ║   • account object doesn't HAVE a balance property!                        ║
 * ║   • balance is in the CLOSURE, not on the object                           ║
 * ║   • Returns undefined                                                      ║
 * ║                                                                            ║
 * ║   THIS IS THE PRIVACY!                                                     ║
 * ║   You can't cheat by doing account.balance = 1000000                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: account.getBalance()                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   • Calls the getter method                                                ║
 * ║   • Method has closure access to balance                                   ║
 * ║   • Returns 120 (actual balance in closure)                                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: account.getTransactions()                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   • Returns transactions.slice() (a COPY)                                  ║
 * ║   • ['+50', '-30']                                                         ║
 * ║   • Note: Returns copy so external code can't modify the original!         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: The Privacy Mechanism                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │  createBankAccount scope (PRIVATE)                              │       │
 * │   │                                                                 │       │
 * │   │  var balance = 120        ← Can't access directly!              │       │
 * │   │  var transactions = [...]  ← Can't access directly!             │       │
 * │   │            ↑                                                    │       │
 * │   │            │ closure access                                     │       │
 * │   │  ┌─────────────────────────────────────────────────────────┐   │       │
 * │   │  │  Returned object (PUBLIC interface)                     │   │       │
 * │   │  │                                                         │   │       │
 * │   │  │  deposit: [function] ───────────► balance               │   │       │
 * │   │  │  withdraw: [function] ──────────► balance               │   │       │
 * │   │  │  getBalance: [function] ────────► balance               │   │       │
 * │   │  │  getTransactions: [function] ───► transactions          │   │       │
 * │   │  │                                                         │   │       │
 * │   │  │  (NO balance property!)                                 │   │       │
 * │   │  │  (NO transactions property!)                            │   │       │
 * │   │  │                                                         │   │       │
 * │   │  └─────────────────────────────────────────────────────────┘   │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * │   account.balance = 999999;  // Creates NEW property, doesn't affect real! │
 * │   account.getBalance();      // Still returns 120                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY THIS MATTERS: Security Through Encapsulation                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WITHOUT Closures (No Privacy):                                              │
 * │                                                                             │
 * │   var account = {                                                           │
 * │     balance: 100,                                                           │
 * │     deposit: function(n) { this.balance += n; }                             │
 * │   };                                                                        │
 * │                                                                             │
 * │   account.balance = 1000000;  // CHEATING IS EASY!                          │
 * │   account.balance = -500;     // Invalid state allowed!                     │
 * │                                                                             │
 * │                                                                             │
 * │ WITH Closures (True Privacy):                                               │
 * │                                                                             │
 * │   var account = createBankAccount(100);                                     │
 * │                                                                             │
 * │   account.balance = 1000000;  // Creates new property, doesn't cheat       │
 * │   account.getBalance();       // Still returns real balance                │
 * │                                                                             │
 * │   // Can enforce rules in methods:                                          │
 * │   account.withdraw(1000000);  // "Insufficient funds"                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "How do you create private variables in JavaScript without classes?"
 * A: Use closures. Declare variables inside a factory function and return an object
 *    with methods that have closure access. The variables are not on the returned
 *    object, so external code can't access them directly. Only the returned methods
 *    can read or modify them, letting you enforce business rules.
 *
 * Q: "What's the difference between closure privacy and ES2022 `#private` fields?"
 * A: Closure privacy uses function scope — variables aren't on the object at all.
 *    ES2022 `#private` fields (e.g., `#balance`) are actual object properties but
 *    inaccessible outside the class. Closure privacy works without classes and
 *    predates `#private`. Both achieve true encapsulation.
 *
 * Q: "How is this pattern related to React's useState?"
 * A: React's `useState` stores the actual state in a closure inside React's internals.
 *    The setter function returned by `useState` is the only way to update state,
 *    just like the methods in this bank account are the only way to modify `balance`.
 *
 *
 * RUN: node docs/javascript/02-closures/04-private-variables.js
 */
