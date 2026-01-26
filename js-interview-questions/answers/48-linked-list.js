/**
 * Answer 48: Linked List Operations
 *
 * Complete implementation of singly linked list:
 */

class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    // Add node at end
    append(value) {
        const newNode = new ListNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }

        this.length++;
        return this;
    }

    // Add node at beginning
    prepend(value) {
        const newNode = new ListNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }

        this.length++;
        return this;
    }

    // Insert at specific index
    insertAt(index, value) {
        if (index < 0 || index > this.length) return false;
        if (index === 0) return this.prepend(value);
        if (index === this.length) return this.append(value);

        const newNode = new ListNode(value);
        const prev = this.getAt(index - 1);
        newNode.next = prev.next;
        prev.next = newNode;
        this.length++;

        return this;
    }

    // Get node at index
    getAt(index) {
        if (index < 0 || index >= this.length) return null;

        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }

        return current;
    }

    // Find node with value
    find(value) {
        let current = this.head;
        let index = 0;

        while (current) {
            if (current.value === value) {
                return { node: current, index };
            }
            current = current.next;
            index++;
        }

        return null;
    }

    // Delete node with value
    delete(value) {
        if (!this.head) return null;

        if (this.head.value === value) {
            const deleted = this.head;
            this.head = this.head.next;
            if (!this.head) this.tail = null;
            this.length--;
            return deleted;
        }

        let current = this.head;
        while (current.next) {
            if (current.next.value === value) {
                const deleted = current.next;
                current.next = current.next.next;
                if (!current.next) this.tail = current;
                this.length--;
                return deleted;
            }
            current = current.next;
        }

        return null;
    }

    // Delete at index
    deleteAt(index) {
        if (index < 0 || index >= this.length) return null;

        if (index === 0) {
            const deleted = this.head;
            this.head = this.head.next;
            if (!this.head) this.tail = null;
            this.length--;
            return deleted;
        }

        const prev = this.getAt(index - 1);
        const deleted = prev.next;
        prev.next = prev.next.next;
        if (!prev.next) this.tail = prev;
        this.length--;

        return deleted;
    }

    // Reverse the list
    reverse() {
        let prev = null;
        let current = this.head;
        this.tail = this.head;

        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }

        this.head = prev;
        return this;
    }

    // Convert to array
    toArray() {
        const arr = [];
        let current = this.head;

        while (current) {
            arr.push(current.value);
            current = current.next;
        }

        return arr;
    }

    // Print list
    print() {
        console.log(this.toArray().join(' -> ') || 'empty');
        return this;
    }

    // Create from array
    static fromArray(arr) {
        const list = new LinkedList();
        arr.forEach(value => list.append(value));
        return list;
    }
}

// Detect cycle (Floyd's Cycle Detection)
function hasCycle(head) {
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) return true;
    }

    return false;
}

// Find middle node
function findMiddle(head) {
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}

// Merge two sorted lists
function mergeSortedLists(l1, l2) {
    const dummy = new ListNode(0);
    let current = dummy;

    while (l1 && l2) {
        if (l1.value < l2.value) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }

    current.next = l1 || l2;
    return dummy.next;
}

// Test cases
console.log("=== Basic Operations ===");
const list = new LinkedList();
list.append(1).append(2).append(3);
list.print(); // 1 -> 2 -> 3

console.log("\n=== Prepend ===");
list.prepend(0);
list.print(); // 0 -> 1 -> 2 -> 3

console.log("\n=== Delete ===");
list.delete(2);
list.print(); // 0 -> 1 -> 3

console.log("\n=== Reverse ===");
list.reverse();
list.print(); // 3 -> 1 -> 0

console.log("\n=== Find ===");
console.log(list.find(1)); // { node: ListNode, index: 1 }

console.log("\n=== From Array ===");
const list2 = LinkedList.fromArray([5, 10, 15]);
list2.print(); // 5 -> 10 -> 15

console.log("\n=== Find Middle ===");
const middle = findMiddle(list2.head);
console.log("Middle:", middle.value); // 10

/**
 * Time Complexity:
 * - append/prepend: O(1)
 * - find/delete: O(n)
 * - reverse: O(n)
 *
 * Space Complexity: O(n) for the list
 */
