// CHALLENGE 04: Private Variables with Closures
//
// What prints for A, B, C, D, E?

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
