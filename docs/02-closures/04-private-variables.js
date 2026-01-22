/**
 * CHALLENGE 04: Private Variables with Closures
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
  var balance = initialBalance;
  var transactions = [];

  return {
    deposit: function(amount) {
      balance += amount;
      transactions.push('+' + amount);
      return balance;
    },
    withdraw: function(amount) {
      if (amount > balance) return 'Insufficient funds';
      balance -= amount;
      transactions.push('-' + amount);
      return balance;
    },
    getBalance: function() {
      return balance;
    },
    getTransactions: function() {
      return transactions.slice();
    }
  };
}

var account = createBankAccount(100);

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
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Closures enable true data privacy in JavaScript. In this bank account      │
 * │  example, balance and transactions are variables in the factory function's  │
 * │  scope - they're not properties on the returned object.                     │
 * │                                                                             │
 * │  When you try account.balance, you get undefined because there IS no        │
 * │  balance property on the object. The only way to access or modify the       │
 * │  actual balance is through the methods that have closure access.            │
 * │                                                                             │
 * │  This lets us enforce business rules - like preventing negative balances    │
 * │  or tracking all transactions. External code can't bypass these rules       │
 * │  by directly modifying the variables.                                       │
 * │                                                                             │
 * │  Note that getTransactions returns a copy (slice) to prevent the caller     │
 * │  from modifying the internal array.                                         │
 * │                                                                             │
 * │  This pattern is the foundation of the Module Pattern and is similar        │
 * │  to how React's useState works - the actual state is in a closure,          │
 * │  and you can only update it through the setter function."                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/02-closures/04-private-variables.js
 */
