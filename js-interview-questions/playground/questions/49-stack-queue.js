/**
 * Question 49: Implement Stack and Queue
 *
 * Stack: LIFO (Last In, First Out)
 * - push(item): Add to top
 * - pop(): Remove from top
 * - peek(): View top item
 *
 * Queue: FIFO (First In, First Out)
 * - enqueue(item): Add to back
 * - dequeue(): Remove from front
 * - front(): View front item
 *
 * Bonus: Implement Queue using two Stacks
 */

class Stack {
    // Your solution here
}

class Queue {
    // Your solution here
}

class QueueUsingStacks {
    // Bonus: Your solution here
}

// Test cases
const stack = new Stack();
stack.push(1);
stack.push(2);
console.log(stack.pop()); // 2

const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue()); // 1
