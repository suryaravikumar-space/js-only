/**
 * ============================================
 * 2. CRDT - CONFLICT-FREE REPLICATED DATA TYPES
 * How 10K users edit the same document without conflicts
 * ============================================
 *
 * TWO APPROACHES:
 * - OT (Operational Transform): Used by Google Docs. Requires central server.
 * - CRDT: Peer-to-peer friendly. No central authority needed. Better for scale.
 *
 * We choose CRDT because:
 * - No server bottleneck for conflict resolution
 * - Works offline (merge when back online)
 * - Mathematically guaranteed to converge
 */

// --- Simplified CRDT for a collaborative text editor ---
// Real-world: Use Yjs or Automerge library

class CRDTDocument {
  constructor(siteId) {
    this.siteId = siteId; // Unique per user
    this.clock = 0; // Lamport timestamp
    this.chars = []; // Sorted list of CRDT characters
  }

  // Generate a unique position ID between two characters
  _generateId(before, after) {
    // Fractional indexing: position between two IDs
    const beforePos = before?.position || [];
    const afterPos = after?.position || [1]; // Max boundary

    const newPos = [];
    for (let i = 0; ; i++) {
      const lo = beforePos[i] || 0;
      const hi = afterPos[i] !== undefined ? afterPos[i] : 256;

      if (hi - lo > 1) {
        newPos.push(lo + Math.floor((hi - lo) / 2));
        break;
      } else {
        newPos.push(lo);
      }
    }

    return {
      position: newPos,
      siteId: this.siteId,
      clock: ++this.clock,
    };
  }

  // Local insert operation
  insert(index, char) {
    const before = this.chars[index - 1] || null;
    const after = this.chars[index] || null;
    const id = this._generateId(before, after);

    const crdtChar = { id, value: char, deleted: false };
    this.chars.splice(index, 0, crdtChar);

    // Return operation to broadcast
    return { type: "INSERT", id, value: char };
  }

  // Local delete (tombstone, don't actually remove)
  delete(index) {
    const crdtChar = this.chars[index];
    crdtChar.deleted = true; // Tombstone

    return { type: "DELETE", id: crdtChar.id };
  }

  // Apply remote operation
  applyRemote(op) {
    if (op.type === "INSERT") {
      // Find correct position using ID ordering
      const index = this._findInsertPosition(op.id);
      this.chars.splice(index, 0, {
        id: op.id,
        value: op.value,
        deleted: false,
      });
    } else if (op.type === "DELETE") {
      const char = this.chars.find(
        (c) =>
          c.id.siteId === op.id.siteId && c.id.clock === op.id.clock
      );
      if (char) char.deleted = true;
    }

    // Update local clock
    this.clock = Math.max(this.clock, op.id.clock) + 1;
  }

  _findInsertPosition(id) {
    for (let i = 0; i < this.chars.length; i++) {
      if (this._compareIds(id, this.chars[i].id) < 0) {
        return i;
      }
    }
    return this.chars.length;
  }

  _compareIds(a, b) {
    // Compare position arrays, then siteId as tiebreaker
    for (let i = 0; i < Math.max(a.position.length, b.position.length); i++) {
      const aVal = a.position[i] || 0;
      const bVal = b.position[i] || 0;
      if (aVal !== bVal) return aVal - bVal;
    }
    return a.siteId.localeCompare(b.siteId);
  }

  // Get visible text (skip tombstones)
  getText() {
    return this.chars
      .filter((c) => !c.deleted)
      .map((c) => c.value)
      .join("");
  }
}

// --- Usage Example ---
const doc1 = new CRDTDocument("user-A");
const doc2 = new CRDTDocument("user-B");

// User A types "Hello"
const ops1 = [];
"Hello".split("").forEach((char, i) => {
  ops1.push(doc1.insert(i, char));
});

// User B receives and applies
ops1.forEach((op) => doc2.applyRemote(op));

// Both users now see "Hello" - guaranteed convergence
console.log(doc1.getText()); // "Hello"
console.log(doc2.getText()); // "Hello"

// Concurrent edits: User A inserts at 0, User B inserts at 0
const opA = doc1.insert(0, "A");
const opB = doc2.insert(0, "B");

// Apply each other's ops
doc1.applyRemote(opB);
doc2.applyRemote(opA);

// Both converge to the same result (order determined by siteId tiebreaker)
console.log(doc1.getText() === doc2.getText()); // true - always!

/**
 * WHY CRDT OVER OT FOR 10K USERS:
 *
 * OT (Operational Transform):
 * - Every op must go through central server for transformation
 * - Server becomes bottleneck at 10K users
 * - Complex transformation functions (O(n²) in worst case)
 *
 * CRDT:
 * - No central coordination needed
 * - Operations commute - order doesn't matter
 * - Scales horizontally (shard by document/room)
 * - Higher memory (tombstones) but memory is cheap
 *
 * PRODUCTION LIBRARIES:
 * - Yjs: Fastest, smallest. Used by VS Code Live Share, Notion
 * - Automerge: More features, JSON-like API
 * - Diamond Types: Rust-based, fastest raw performance
 */
