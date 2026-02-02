/**
 * ============================================
 * 3. 60FPS RENDERING STRATEGY
 * Processing 1000s of updates/sec without dropping frames
 * ============================================
 *
 * 60fps = 16.67ms per frame budget
 * At 10K users, you might receive 500-2000 ops/second
 * You CANNOT re-render on every operation
 */

// --- Strategy 1: Batched Updates with requestAnimationFrame ---

class RenderScheduler {
  constructor(renderFn) {
    this.renderFn = renderFn;
    this.pendingOps = [];
    this.frameRequested = false;
  }

  // Queue operations instead of rendering immediately
  scheduleUpdate(op) {
    this.pendingOps.push(op);

    if (!this.frameRequested) {
      this.frameRequested = true;
      requestAnimationFrame(() => this._flush());
    }
  }

  _flush() {
    // Apply ALL queued ops in one batch, then render ONCE
    const ops = this.pendingOps;
    this.pendingOps = [];
    this.frameRequested = false;

    // Apply ops to state
    ops.forEach((op) => this._applyToState(op));

    // Single render call
    this.renderFn();
  }

  _applyToState(op) {
    // Apply CRDT operation to local state
  }
}

// Result: 500 ops/sec → ~8 ops batched per frame → 1 render per frame = 60fps

// --- Strategy 2: Web Worker for Heavy Processing ---

// main.js
const crdtWorker = new Worker("crdt-worker.js");

// Offload CRDT merging to worker thread
crdtWorker.postMessage({ type: "REMOTE_OP", data: incomingOp });

// Worker sends back minimal UI update
crdtWorker.onmessage = (e) => {
  if (e.data.type === "STATE_PATCH") {
    // Only receives the diff, not full state
    applyPatchToDOM(e.data.patch);
  }
};

// crdt-worker.js (runs on separate thread - doesn't block UI)
/*
self.onmessage = (e) => {
  if (e.data.type === 'REMOTE_OP') {
    crdtDoc.applyRemote(e.data.data);

    // Compute minimal diff
    const patch = computeDiff(previousState, crdtDoc.getState());
    self.postMessage({ type: 'STATE_PATCH', patch });
  }
};
*/

// --- Strategy 3: Viewport-Only Rendering ---

class VirtualizedCollabEditor {
  constructor(container, doc) {
    this.container = container;
    this.doc = doc;
    this.scrollTop = 0;
    this.lineHeight = 20;
    this.viewportHeight = container.clientHeight;
  }

  render() {
    const lines = this.doc.getText().split("\n");
    const totalHeight = lines.length * this.lineHeight;

    // Only render visible lines
    const startLine = Math.floor(this.scrollTop / this.lineHeight);
    const visibleCount = Math.ceil(this.viewportHeight / this.lineHeight);
    const endLine = Math.min(startLine + visibleCount + 5, lines.length); // 5 line buffer

    // Render only ~50 lines instead of potentially 10,000
    const visibleLines = lines.slice(startLine, endLine);

    // Use a single container with transform for scroll position
    this.container.innerHTML = "";
    const content = document.createElement("div");
    content.style.height = `${totalHeight}px`;
    content.style.position = "relative";

    const viewport = document.createElement("div");
    viewport.style.transform = `translateY(${startLine * this.lineHeight}px)`;
    viewport.style.willChange = "transform"; // GPU layer hint

    visibleLines.forEach((line, i) => {
      const div = document.createElement("div");
      div.textContent = line;
      div.style.height = `${this.lineHeight}px`;
      viewport.appendChild(div);
    });

    content.appendChild(viewport);
    this.container.appendChild(content);
  }
}

// --- Strategy 4: Canvas Rendering for Extreme Performance ---

class CanvasEditor {
  constructor(canvas, doc) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.doc = doc;
    this.offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    this.offCtx = this.offscreen.getContext("2d");
  }

  render() {
    // Draw to offscreen canvas (double buffering)
    this.offCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
    this.offCtx.font = "14px monospace";

    const lines = this.doc.getVisibleLines();
    lines.forEach((line, i) => {
      this.offCtx.fillText(line.text, 0, (i + 1) * 20);

      // Draw cursors for other users
      if (line.cursors) {
        line.cursors.forEach((cursor) => {
          this.offCtx.fillStyle = cursor.color;
          this.offCtx.fillRect(cursor.x, i * 20, 2, 20);
        });
      }
    });

    // Single copy to visible canvas
    this.ctx.drawImage(this.offscreen, 0, 0);
  }
}

/**
 * PERFORMANCE BUDGET BREAKDOWN (16.67ms per frame):
 *
 * ┌──────────────────────────────┬──────────┐
 * │ Task                         │ Budget   │
 * ├──────────────────────────────┼──────────┤
 * │ Receive & decode messages    │ ~1ms     │ ← Binary protocol helps
 * │ Apply CRDT operations        │ ~2ms     │ ← Web Worker offloads this
 * │ Compute diff / patches       │ ~1ms     │ ← Worker does this too
 * │ DOM / Canvas update          │ ~4ms     │ ← Virtualization helps
 * │ Browser layout + paint       │ ~4ms     │ ← Fewer DOM nodes helps
 * │ Headroom for GC, etc.        │ ~4.67ms  │
 * ├──────────────────────────────┼──────────┤
 * │ TOTAL                        │ 16.67ms  │ ✅ 60fps
 * └──────────────────────────────┴──────────┘
 *
 * KEY TECHNIQUES SUMMARY:
 * 1. Batch updates with rAF (don't render per-op)
 * 2. Web Workers for CRDT processing (off main thread)
 * 3. Virtualized rendering (only visible content)
 * 4. Canvas for extreme perf (skip DOM entirely)
 * 5. will-change / GPU layers for smooth scrolling
 */
