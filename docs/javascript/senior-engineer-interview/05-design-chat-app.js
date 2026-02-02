/**
 * ================================================================
 * QUESTION: "Design a chat application like WhatsApp/Messenger."
 * ================================================================
 *
 * ASKED AT: Google (L5-L6), Meta (E5 — "Design Messenger"), Amazon (SDE2),
 *           Flipkart, Uber
 * TYPE:     Frontend System Design (most common system design question)
 *
 * Sources:
 *   - GreatFrontEnd Chat System Design: https://www.greatfrontend.com/questions/system-design/chat-application-messenger
 *   - Frontend Interview Handbook: https://www.frontendinterviewhandbook.com
 *   - Glassdoor Amazon FE interviews (85 reported questions)
 *   - Prepfully Google Interview Guide
 *
 * ================================================================
 * YOUR STORY TO THE INTERVIEWER:
 * ================================================================
 *
 * "I'd break this into 4 layers. Let me draw them out:
 *
 *  1. Transport — how messages travel (WebSocket)
 *  2. State — how we store messages locally (normalized store)
 *  3. UI — how we render efficiently (virtualized list)
 *  4. Features — typing indicators, read receipts, offline
 *
 *  Let me start with the transport layer because that's the
 *  foundation everything else depends on."
 *
 * ================================================================
 * VISUAL: FRONTEND ARCHITECTURE
 * ================================================================
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │                         UI LAYER                             │
 *   │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
 *   │  │ Chat List    │  │ Message View  │  │ Input + Attachments│ │
 *   │  │ (virtualized)│  │ (virtualized) │  │                    │ │
 *   │  └──────┬──────┘  └──────┬────────┘  └────────┬───────────┘ │
 *   ├─────────┴────────────────┴─────────────────────┴────────────┤
 *   │                      STATE LAYER                             │
 *   │  ┌────────────────────────────────────────────────────────┐ │
 *   │  │  Normalized Store                                      │ │
 *   │  │  messages: { [id]: { text, sender, status, timestamp } │ │
 *   │  │  conversations: { [id]: { messageIds[], unread } }     │ │
 *   │  │  users: { [id]: { name, avatar, online } }             │ │
 *   │  └──────────────────────┬─────────────────────────────────┘ │
 *   ├─────────────────────────┴───────────────────────────────────┤
 *   │                    TRANSPORT LAYER                           │
 *   │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
 *   │  │  WebSocket   │  │  Retry Queue │  │  IndexedDB         │ │
 *   │  │  Connection  │  │  (offline)   │  │  (persistence)     │ │
 *   │  └──────┬──────┘  └──────────────┘  └────────────────────┘ │
 *   └─────────┴───────────────────────────────────────────────────┘
 *              │
 *              ▼
 *         [ Server ]
 *
 * ================================================================
 * LAYER 1: TRANSPORT — WebSocket with reconnection
 * ================================================================
 */

// Why WebSocket, not HTTP polling?
// Polling: Client asks "any new messages?" every 2 seconds = wasteful
// WebSocket: Server PUSHES messages instantly = real-time + less bandwidth

class ChatConnection {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.queue = []; // messages to send while offline
    this.handlers = new Map();
  }

  connect() {
    // Auth via query param or first message (WebSocket has no headers)
    this.ws = new WebSocket(`${this.url}?token=${this.token}`);

    this.ws.onopen = () => {
      // Send all queued messages (offline support)
      while (this.queue.length > 0) {
        this.ws.send(JSON.stringify(this.queue.shift()));
      }
    };

    this.ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      const handler = this.handlers.get(msg.type);
      if (handler) handler(msg.payload);
    };

    this.ws.onclose = () => {
      // Reconnect with exponential backoff + jitter
      const delay = Math.min(1000 * 2 ** this.reconnectCount, 30000);
      const jitter = Math.random() * delay * 0.3;
      setTimeout(() => this.connect(), delay + jitter);
      this.reconnectCount = (this.reconnectCount || 0) + 1;
    };
  }

  send(type, payload) {
    const msg = { type, payload, clientId: crypto.randomUUID() };
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      this.queue.push(msg); // queue for when connection returns
    }
  }

  on(type, handler) {
    this.handlers.set(type, handler);
  }
}

/**
 * ================================================================
 * LAYER 2: STATE — Normalized store (not nested)
 * ================================================================
 *
 * ❌ BAD — nested structure:
 * {
 *   conversations: [
 *     { id: 1, messages: [{ id: 1, text: "hi" }, ...10000 messages] }
 *   ]
 * }
 * Problem: To update one message status, you clone the entire array.
 *
 * ✅ GOOD — normalized (like a database):
 */

const state = {
  // Lookup by ID = O(1)
  messages: {
    "msg-1": { id: "msg-1", text: "Hey!", sender: "user-1", convId: "conv-1",
               timestamp: 1706745600, status: "delivered" },
    "msg-2": { id: "msg-2", text: "Hi!", sender: "user-2", convId: "conv-1",
               timestamp: 1706745601, status: "read" },
  },

  // Conversation stores only message IDs (not full message objects)
  conversations: {
    "conv-1": { id: "conv-1", participants: ["user-1", "user-2"],
                messageIds: ["msg-1", "msg-2"], unreadCount: 0,
                lastMessageId: "msg-2" },
  },

  // User presence
  users: {
    "user-1": { name: "Alice", avatar: "/img/alice.jpg", online: true,
                lastSeen: null, typing: false },
    "user-2": { name: "Bob", avatar: "/img/bob.jpg", online: false,
                lastSeen: 1706745500, typing: false },
  },
};

// Update message status = change ONE object. No deep cloning.
// state.messages["msg-1"].status = "read";  ← instant, O(1)

/**
 * ================================================================
 * LAYER 3: UI — Virtualized message list
 * ================================================================
 *
 * Problem: A chat can have 50,000+ messages. Rendering all = crash.
 * Solution: Only render messages visible in the viewport (~20-30).
 *
 *   ┌────────────────────────────┐
 *   │     (off-screen above)     │ ← not in DOM
 *   │     messages 1 - 9,950     │
 *   ├────────────────────────────┤
 *   │  ┌──────────────────────┐  │
 *   │  │ message 9,951        │  │ ← rendered (in viewport)
 *   │  │ message 9,952        │  │
 *   │  │ message 9,953        │  │
 *   │  │ ...                  │  │
 *   │  │ message 9,980        │  │
 *   │  └──────────────────────┘  │
 *   ├────────────────────────────┤
 *   │     (off-screen below)     │ ← not in DOM
 *   │     messages 9,981+        │
 *   └────────────────────────────┘
 *
 *   Library: react-window or @tanstack/virtual
 *   50,000 messages → only ~30 DOM nodes → smooth scrolling
 */

/**
 * ================================================================
 * LAYER 4: FEATURES (mention these to stand out)
 * ================================================================
 *
 * TYPING INDICATOR:
 *   - Throttle to 1 event per 3 seconds (don't send on every keystroke)
 *   - Send "stopped typing" after 3s of no input
 *   - Server broadcasts to other participants only
 *
 * READ RECEIPTS:
 *   - Use IntersectionObserver on message elements
 *   - When message enters viewport → mark as "read"
 *   - Batch: don't send 50 "read" events, send "read up to msg-9980"
 *
 * OFFLINE SUPPORT:
 *   - Store messages in IndexedDB (survives page refresh)
 *   - Queue outgoing messages (sent when back online)
 *   - Show "Connecting..." banner when WebSocket is down
 *
 * MESSAGE STATUS FLOW:
 *   sending → sent → delivered → read
 *      │        │        │         │
 *   (in queue) (server  (recipient (recipient
 *              received) connected) viewed)
 *
 * OPTIMISTIC UI:
 *   - Show message immediately when user hits send (status: "sending")
 *   - If server confirms → update to "sent"
 *   - If server fails → show retry button
 *   - User sees instant response. Actual network call is async.
 */

/**
 * ================================================================
 * PAGINATION: How to load old messages
 * ================================================================
 *
 * Cursor-based pagination (NOT offset-based):
 *
 *   GET /api/messages?conversationId=conv-1&before=msg-9951&limit=50
 *
 *   Returns: messages 9,901 to 9,950
 *
 * Why cursor, not offset?
 *   - Offset: "give me page 5" → if new messages arrive, page 5 shifts
 *   - Cursor: "give me 50 messages before THIS message" → always correct
 *
 * Load trigger: User scrolls to top → fetch older messages → prepend
 * Use IntersectionObserver on a sentinel element at the top of the list
 */

/**
 * ================================================================
 * CHEAT SHEET
 * ================================================================
 *
 * Interviewer says...                  │  You say...
 * ─────────────────────────────────────┼──────────────────────────────
 * "Why WebSocket not polling?"         │  Polling wastes bandwidth. WS pushes
 *                                      │  instantly. Bidirectional.
 * "How do you handle offline?"         │  IndexedDB for persistence.
 *                                      │  Queue for outgoing. Sync on reconnect.
 * "50K messages in one chat?"          │  Virtualized list. Only ~30 DOM nodes.
 *                                      │  Cursor-based pagination for history.
 * "Why normalized state?"              │  O(1) updates. No deep cloning.
 *                                      │  One message status change = one object.
 * "How does typing indicator work?"    │  Throttled (1/3s). Auto-stop after 3s
 *                                      │  idle. Server only sends to participants.
 * "Optimistic UI?"                     │  Show instantly, confirm async.
 *                                      │  Retry button if server fails.
 * "How to scale to millions?"          │  Shard by conversation ID.
 *                                      │  Each server handles N conversations.
 *                                      │  Presence via Redis pub/sub.
 */
