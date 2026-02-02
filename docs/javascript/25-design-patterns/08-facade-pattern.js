/**
 * DESIGN PATTERNS: 08 - Facade Pattern
 *
 * ONE CONCEPT: Provide a simple interface to a complex system
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS FACADE?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Facade = A simple, unified interface that hides complex subsystems.
 *
 * User interacts with ONE simple object.
 * That object coordinates multiple complex parts behind the scenes.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Hotel concierge:
 *   - You say: "I need a dinner reservation"
 *   - Concierge handles: calling restaurant, checking availability,
 *     booking table, confirming, arranging transportation...
 *
 *   You don't deal with complexity - concierge is the FACADE.
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   videoConverter.convert('video.avi', 'mp4');
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  STRUCTURE                                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │   CLIENT CODE                                                        │
 *   │        │                                                             │
 *   │        │  Simple call: convert('video.avi', 'mp4')                   │
 *   │        ▼                                                             │
 *   │   ┌───────────────────────────────────────────────────────────────┐  │
 *   │   │                    FACADE                                     │  │
 *   │   │   (VideoConverter)                                            │  │
 *   │   │                                                               │  │
 *   │   │   convert(input, format) {                                    │  │
 *   │   │     file = FileReader.read(input);                            │  │
 *   │   │     codec = CodecFactory.getCodec(format);                    │  │
 *   │   │     buffer = Decoder.decode(file);                            │  │
 *   │   │     encoded = Encoder.encode(buffer, codec);                  │  │
 *   │   │     return FileWriter.write(encoded);                         │  │
 *   │   │   }                                                           │  │
 *   │   │                                                               │  │
 *   │   └────────────────────────┬──────────────────────────────────────┘  │
 *   │                            │                                         │
 *   │           ┌────────────────┼────────────────┐                        │
 *   │           ▼                ▼                ▼                        │
 *   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
 *   │   │ FileReader  │  │   Decoder   │  │  Encoder    │                  │
 *   │   └─────────────┘  └─────────────┘  └─────────────┘                  │
 *   │   ┌─────────────┐  ┌─────────────┐                                   │
 *   │   │CodecFactory │  │ FileWriter  │                                   │
 *   │   └─────────────┘  └─────────────┘                                   │
 *   │                                                                      │
 *   │   Client only knows about Facade                                     │
 *   │   Subsystems are hidden                                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// COMPLEX SUBSYSTEMS (Hidden from user)
// ═══════════════════════════════════════════════════════════════════════════

// Subsystem 1: Inventory
class Inventory {
  checkStock(productId) {
    console.log(`  [Inventory] Checking stock for ${productId}`);
    return { available: true, quantity: 10 };
  }

  reserve(productId, quantity) {
    console.log(`  [Inventory] Reserved ${quantity} of ${productId}`);
    return true;
  }
}

// Subsystem 2: Payment
class PaymentGateway {
  validateCard(cardDetails) {
    console.log('  [Payment] Validating card...');
    return true;
  }

  charge(amount, cardDetails) {
    console.log(`  [Payment] Charging $${amount}`);
    return { transactionId: 'TXN-' + Date.now() };
  }
}

// Subsystem 3: Shipping
class ShippingService {
  calculateCost(address, weight) {
    console.log('  [Shipping] Calculating shipping cost...');
    return 9.99;
  }

  schedulePickup(orderId) {
    console.log(`  [Shipping] Scheduled pickup for order ${orderId}`);
    return { trackingNumber: 'TRK-' + Date.now() };
  }
}

// Subsystem 4: Email
class EmailService {
  sendConfirmation(email, orderDetails) {
    console.log(`  [Email] Sending confirmation to ${email}`);
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// THE FACADE: Simple interface
// ═══════════════════════════════════════════════════════════════════════════

class OrderFacade {
  constructor() {
    this.inventory = new Inventory();
    this.payment = new PaymentGateway();
    this.shipping = new ShippingService();
    this.email = new EmailService();
  }

  // ONE simple method that coordinates everything
  placeOrder(order) {
    console.log('Processing order...\n');

    // Step 1: Check inventory
    const stock = this.inventory.checkStock(order.productId);
    if (!stock.available) {
      throw new Error('Product out of stock');
    }

    // Step 2: Reserve inventory
    this.inventory.reserve(order.productId, order.quantity);

    // Step 3: Validate payment
    if (!this.payment.validateCard(order.card)) {
      throw new Error('Invalid payment');
    }

    // Step 4: Calculate shipping
    const shippingCost = this.shipping.calculateCost(order.address, 2);

    // Step 5: Charge payment
    const total = order.amount + shippingCost;
    const payment = this.payment.charge(total, order.card);

    // Step 6: Schedule shipping
    const shipping = this.shipping.schedulePickup(payment.transactionId);

    // Step 7: Send confirmation
    this.email.sendConfirmation(order.email, {
      transactionId: payment.transactionId,
      trackingNumber: shipping.trackingNumber,
      total
    });

    console.log('\nOrder completed!');
    return {
      success: true,
      transactionId: payment.transactionId,
      trackingNumber: shipping.trackingNumber
    };
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// USAGE: Client code is simple!
// ═══════════════════════════════════════════════════════════════════════════

console.log('=== Facade Pattern ===\n');

const orderFacade = new OrderFacade();

// Simple call - all complexity hidden
const result = orderFacade.placeOrder({
  productId: 'LAPTOP-001',
  quantity: 1,
  amount: 999,
  card: { number: '****1234' },
  address: '123 Main St',
  email: 'customer@example.com'
});

console.log('\nResult:', result);


// ═══════════════════════════════════════════════════════════════════════════
// ANOTHER EXAMPLE: Computer Startup
// ═══════════════════════════════════════════════════════════════════════════

class CPU {
  freeze() { console.log('  [CPU] Freezing...'); }
  jump(addr) { console.log(`  [CPU] Jumping to ${addr}`); }
  execute() { console.log('  [CPU] Executing...'); }
}

class Memory {
  load(addr, data) { console.log(`  [Memory] Loading data at ${addr}`); }
}

class HardDrive {
  read(sector, size) {
    console.log(`  [HardDrive] Reading sector ${sector}`);
    return 'boot data';
  }
}

// Facade
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  start() {
    console.log('Starting computer...\n');
    this.cpu.freeze();
    this.memory.load(0x00, this.hardDrive.read(0, 1024));
    this.cpu.jump(0x00);
    this.cpu.execute();
    console.log('\nComputer started!');
  }
}

console.log('\n=== Computer Facade ===\n');

const computer = new ComputerFacade();
computer.start();  // One simple call!


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Facade pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Facade pattern provides a simplified interface to a complex
 * system. It hides the complexity of multiple subsystems behind a
 * single, easy-to-use interface.
 *
 * Think of a hotel concierge. You say 'book me a dinner reservation',
 * and they handle calling restaurants, checking availability, making
 * the booking, and confirming. You don't deal with all those steps -
 * the concierge is your facade.
 *
 * In code, I might have an e-commerce system with separate Inventory,
 * Payment, Shipping, and Email subsystems. Without a facade, the
 * client would need to call each one in the right order. With a
 * facade, I create an OrderFacade with one placeOrder() method.
 * It internally coordinates all the subsystems, but the client just
 * makes one simple call.
 *
 * The facade doesn't hide the subsystems - they're still accessible
 * if you need fine-grained control. It just provides a convenient
 * shortcut for common operations.
 *
 * jQuery is a classic facade example. It provides simple methods
 * like $.ajax() that hide the complexity of XMLHttpRequest and
 * browser differences."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Simple interface to complex system
 * ✓ Hides multiple subsystems
 * ✓ One convenient method for common operations
 * ✓ Subsystems still accessible if needed
 * ✓ Example: jQuery, any "wrapper" API
 *
 */


// RUN: node docs/25-design-patterns/08-facade-pattern.js
