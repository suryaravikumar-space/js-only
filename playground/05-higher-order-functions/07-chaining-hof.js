// CHALLENGE 07: Chaining Higher-Order Functions
//
// What prints for A, B?

var users = [
  { name: 'Alice', age: 25, salary: 50000 },
  { name: 'Bob', age: 30, salary: 70000 },
  { name: 'Charlie', age: 35, salary: 60000 },
  { name: 'Diana', age: 28, salary: 80000 },
  { name: 'Eve', age: 22, salary: 45000 }
];

// Chain: filter -> map -> reduce
var totalSalaryAbove25 = users
  .filter(user => user.age > 25)
  .map(user => user.salary)
  .reduce((sum, salary) => sum + salary, 0);

console.log('A:', totalSalaryAbove25);

// Chain: filter -> sort -> map
var namesOfTop3Earners = users
  .sort((a, b) => b.salary - a.salary)
  .slice(0, 3)
  .map(user => user.name);

console.log('B:', namesOfTop3Earners);
