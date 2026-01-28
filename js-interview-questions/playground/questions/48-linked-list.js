/**
 * Question 48: Linked List Operations
 *
 * Implement a singly linked list with the following operations:
 * - append(value): Add node at end
 * - prepend(value): Add node at beginning
 * - delete(value): Remove node with value
 * - find(value): Find node with value
 * - reverse(): Reverse the list
 *
 * Bonus: Detect cycle in linked list
 */

class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    // Your solution here
}

// Test cases
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.print(); // 1 -> 2 -> 3
list.reverse();
list.print(); // 3 -> 2 -> 1
