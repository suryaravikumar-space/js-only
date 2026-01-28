/**
 * Question 36: Implement Function.prototype.bind
 *
 * The bind() method creates a new function that, when called, has its
 * 'this' keyword set to the provided value.
 *
 * Task: Implement your own version of bind.
 *
 * Example:
 * const obj = { x: 10 };
 * function add(y) { return this.x + y; }
 * const boundAdd = add.myBind(obj);
 * boundAdd(5) // 15
 */

Function.prototype.myBind = function (context, ...args) {
    // Your solution here
};

// Test cases
const obj = { x: 10 };
function add(y, z) {
    return this.x + y + z;
}
const boundAdd = add.myBind(obj, 5);
console.log(boundAdd(3)); // 18
