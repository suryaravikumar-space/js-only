# Challenge 04: Private Variables with Closures

## The Golden Rule

```
Closures enable TRUE privacy in JavaScript.
Variables in outer scope are private - only accessible via returned functions.
```

## The Challenge

```javascript
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
      return transactions.slice(); // Return copy!
    }
  };
}

var account = createBankAccount(100);

console.log('A:', account.deposit(50));
console.log('B:', account.withdraw(30));
console.log('C:', account.balance);
console.log('D:', account.getBalance());
console.log('E:', account.getTransactions());
```

**What prints for A, B, C, D, E?**

---

## Key Concepts

| Access Type | Example | Result |
|-------------|---------|--------|
| Via method | account.getBalance() | Works - closure access |
| Direct access | account.balance | undefined - truly private! |
| Modify directly | account.balance = 1000000 | Creates new property, doesn't affect real balance |

## Why This Pattern Matters

```javascript
// Without closures - NO privacy
var account = {
  balance: 100,
  deposit: function(n) { this.balance += n; }
};
account.balance = 1000000; // Cheating is easy!

// With closures - TRUE privacy
var account = createBankAccount(100);
account.balance = 1000000; // Does nothing to real balance!
account.getBalance(); // Still returns the real value
```

## The Privacy Mechanism

```
┌─────────────────────────────────────────────────┐
│  createBankAccount scope (PRIVATE)              │
│                                                 │
│  var balance = 100;      ← Can't access directly│
│  var transactions = [];  ← Can't access directly│
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Returned object (PUBLIC interface)     │   │
│  │                                         │   │
│  │  deposit()  ───────► balance           │   │
│  │  withdraw() ───────► balance           │   │
│  │  getBalance() ─────► balance           │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## Real World Uses

- Module pattern
- React hooks (useState stores value in closure)
- Event handler state
- Memoization caches
