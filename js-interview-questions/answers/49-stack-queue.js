/**
 * Answer 49: Implement Stack and Queue
 *
 * Fundamental data structures:
 */

// ==================== STACK ====================

class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
        return this;
    }

    pop() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
        return this;
    }

    print() {
        console.log(this.items.join(' <- '));
        return this;
    }
}

// ==================== QUEUE ====================

class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item) {
        this.items.push(item);
        return this;
    }

    dequeue() {
        return this.items.shift();
    }

    front() {
        return this.items[0];
    }

    rear() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
        return this;
    }

    print() {
        console.log(this.items.join(' <- '));
        return this;
    }
}

// Optimized Queue using object (O(1) dequeue)
class OptimizedQueue {
    constructor() {
        this.items = {};
        this.frontIndex = 0;
        this.backIndex = 0;
    }

    enqueue(item) {
        this.items[this.backIndex] = item;
        this.backIndex++;
        return this;
    }

    dequeue() {
        if (this.isEmpty()) return undefined;

        const item = this.items[this.frontIndex];
        delete this.items[this.frontIndex];
        this.frontIndex++;
        return item;
    }

    front() {
        return this.items[this.frontIndex];
    }

    isEmpty() {
        return this.frontIndex === this.backIndex;
    }

    size() {
        return this.backIndex - this.frontIndex;
    }
}

// ==================== QUEUE USING TWO STACKS ====================

class QueueUsingStacks {
    constructor() {
        this.inbox = [];
        this.outbox = [];
    }

    enqueue(item) {
        this.inbox.push(item);
        return this;
    }

    dequeue() {
        if (this.outbox.length === 0) {
            while (this.inbox.length > 0) {
                this.outbox.push(this.inbox.pop());
            }
        }
        return this.outbox.pop();
    }

    front() {
        if (this.outbox.length === 0) {
            while (this.inbox.length > 0) {
                this.outbox.push(this.inbox.pop());
            }
        }
        return this.outbox[this.outbox.length - 1];
    }

    isEmpty() {
        return this.inbox.length === 0 && this.outbox.length === 0;
    }

    size() {
        return this.inbox.length + this.outbox.length;
    }
}

// ==================== STACK USING TWO QUEUES ====================

class StackUsingQueues {
    constructor() {
        this.q1 = [];
        this.q2 = [];
    }

    push(item) {
        this.q2.push(item);

        while (this.q1.length > 0) {
            this.q2.push(this.q1.shift());
        }

        [this.q1, this.q2] = [this.q2, this.q1];
        return this;
    }

    pop() {
        return this.q1.shift();
    }

    top() {
        return this.q1[0];
    }

    isEmpty() {
        return this.q1.length === 0;
    }
}

// ==================== MIN STACK ====================

class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }

    push(val) {
        this.stack.push(val);
        const min = this.minStack.length === 0
            ? val
            : Math.min(val, this.minStack[this.minStack.length - 1]);
        this.minStack.push(min);
    }

    pop() {
        this.minStack.pop();
        return this.stack.pop();
    }

    top() {
        return this.stack[this.stack.length - 1];
    }

    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}

// Test cases
console.log("=== Stack ===");
const stack = new Stack();
stack.push(1).push(2).push(3);
stack.print(); // 1 <- 2 <- 3
console.log("Pop:", stack.pop()); // 3
console.log("Peek:", stack.peek()); // 2

console.log("\n=== Queue ===");
const queue = new Queue();
queue.enqueue(1).enqueue(2).enqueue(3);
queue.print(); // 1 <- 2 <- 3
console.log("Dequeue:", queue.dequeue()); // 1
console.log("Front:", queue.front()); // 2

console.log("\n=== Queue Using Stacks ===");
const queueStack = new QueueUsingStacks();
queueStack.enqueue(1).enqueue(2).enqueue(3);
console.log("Dequeue:", queueStack.dequeue()); // 1
console.log("Dequeue:", queueStack.dequeue()); // 2

console.log("\n=== Min Stack ===");
const minStack = new MinStack();
minStack.push(3);
minStack.push(5);
minStack.push(2);
minStack.push(1);
console.log("Min:", minStack.getMin()); // 1
minStack.pop();
console.log("Min after pop:", minStack.getMin()); // 2

/**
 * Time Complexity:
 * Stack: All operations O(1)
 * Queue (array): enqueue O(1), dequeue O(n)
 * Queue (optimized): All operations O(1)
 * Queue using stacks: Amortized O(1)
 */
