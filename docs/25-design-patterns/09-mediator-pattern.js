/**
 * DESIGN PATTERNS: 09 - Mediator Pattern
 *
 * ONE CONCEPT: Central hub that coordinates communication between objects
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS MEDIATOR?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mediator = A central object that coordinates communication between
 *            multiple objects (colleagues).
 *
 * Instead of objects talking to each other directly, they talk to the mediator.
 * The mediator decides who gets what message.
 *
 *
 * ANALOGY:
 * ────────
 *
 *   Air Traffic Control:
 *   - Planes don't talk to each other directly
 *   - All communication goes through the control tower
 *   - Tower coordinates takeoffs, landings, spacing
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   Without Mediator (chaos):
 *
 *   ┌───────┐       ┌───────┐       ┌───────┐
 *   │ Obj A │◄─────▶│ Obj B │◄─────▶│ Obj C │
 *   └───┬───┘       └───┬───┘       └───┬───┘
 *       │               │               │
 *       └───────────────┴───────────────┘
 *           Everyone talks to everyone
 *           N * (N-1) connections!
 *
 *
 *   With Mediator (organized):
 *
 *   ┌───────┐       ┌───────┐       ┌───────┐
 *   │ Obj A │       │ Obj B │       │ Obj C │
 *   └───┬───┘       └───┬───┘       └───┬───┘
 *       │               │               │
 *       │               ▼               │
 *       │        ┌───────────┐          │
 *       └───────▶│  MEDIATOR │◄─────────┘
 *                └───────────┘
 *           Everyone talks to mediator
 *           N connections!
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION: Chat Room
// ═══════════════════════════════════════════════════════════════════════════

// Mediator
class ChatRoom {
  constructor() {
    this.users = new Map();
  }

  register(user) {
    this.users.set(user.name, user);
    user.chatRoom = this;
    console.log(`${user.name} joined the chat`);
  }

  send(message, from, to) {
    if (to) {
      // Direct message
      const recipient = this.users.get(to);
      if (recipient) {
        recipient.receive(message, from);
      }
    } else {
      // Broadcast to all except sender
      this.users.forEach((user, name) => {
        if (name !== from) {
          user.receive(message, from);
        }
      });
    }
  }
}

// Colleague
class User {
  constructor(name) {
    this.name = name;
    this.chatRoom = null;
  }

  send(message, to = null) {
    console.log(`\n${this.name} sends: "${message}"${to ? ` to ${to}` : ' (broadcast)'}`);
    this.chatRoom.send(message, this.name, to);
  }

  receive(message, from) {
    console.log(`  ${this.name} received from ${from}: "${message}"`);
  }
}

console.log('=== Mediator: Chat Room ===\n');

const chatRoom = new ChatRoom();

const alice = new User('Alice');
const bob = new User('Bob');
const charlie = new User('Charlie');

chatRoom.register(alice);
chatRoom.register(bob);
chatRoom.register(charlie);

alice.send('Hello everyone!');  // Broadcast
bob.send('Hi Alice!', 'Alice');  // Direct message


// ═══════════════════════════════════════════════════════════════════════════
// PRACTICAL EXAMPLE: Form Validation
// ═══════════════════════════════════════════════════════════════════════════

class FormMediator {
  constructor() {
    this.fields = {};
    this.submitButton = null;
  }

  registerField(name, field) {
    this.fields[name] = field;
    field.mediator = this;
  }

  registerSubmitButton(button) {
    this.submitButton = button;
    button.mediator = this;
  }

  notify(sender, event, data) {
    console.log(`  [Mediator] ${sender} triggered ${event}`);

    if (event === 'fieldChanged') {
      this.validateAll();
    }

    if (event === 'submit') {
      if (this.validateAll()) {
        console.log('  [Mediator] Form is valid, submitting...');
        return true;
      } else {
        console.log('  [Mediator] Form is invalid, cannot submit');
        return false;
      }
    }
  }

  validateAll() {
    const allValid = Object.values(this.fields).every(field => field.isValid());

    if (this.submitButton) {
      this.submitButton.setEnabled(allValid);
    }

    return allValid;
  }
}

class FormField {
  constructor(name, validator) {
    this.name = name;
    this.value = '';
    this.validator = validator;
    this.mediator = null;
  }

  setValue(value) {
    this.value = value;
    console.log(`\n${this.name} changed to: "${value}"`);
    this.mediator.notify(this.name, 'fieldChanged', value);
  }

  isValid() {
    const valid = this.validator(this.value);
    console.log(`  ${this.name} valid: ${valid}`);
    return valid;
  }
}

class SubmitButton {
  constructor() {
    this.enabled = false;
    this.mediator = null;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`  [Submit Button] ${enabled ? 'Enabled' : 'Disabled'}`);
  }

  click() {
    console.log('\n[Click Submit]');
    return this.mediator.notify('submitButton', 'submit');
  }
}

console.log('\n=== Mediator: Form ===\n');

const formMediator = new FormMediator();

const emailField = new FormField('email', (v) => v.includes('@'));
const passwordField = new FormField('password', (v) => v.length >= 6);
const submitBtn = new SubmitButton();

formMediator.registerField('email', emailField);
formMediator.registerField('password', passwordField);
formMediator.registerSubmitButton(submitBtn);

emailField.setValue('test');  // Invalid
passwordField.setValue('123');  // Invalid

emailField.setValue('test@example.com');  // Valid
passwordField.setValue('123456');  // Valid

submitBtn.click();


// ═══════════════════════════════════════════════════════════════════════════
// REAL-WORLD EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHERE YOU SEE MEDIATOR                                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Redux Store:                                                       │
 *   │    Components dispatch actions to store (mediator)                  │
 *   │    Store notifies subscribed components                             │
 *   │                                                                     │
 *   │  Express.js Router:                                                 │
 *   │    Routes requests to correct handlers                              │
 *   │                                                                     │
 *   │  Dialog/Modal Controllers:                                          │
 *   │    Coordinates buttons, inputs, validation                          │
 *   │                                                                     │
 *   │  Game Engine:                                                       │
 *   │    Coordinates collision between game objects                       │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "Explain the Mediator pattern"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The Mediator pattern creates a central object that coordinates
 * communication between multiple objects. Instead of objects talking
 * to each other directly, they communicate through the mediator.
 *
 * Think of air traffic control. Planes don't coordinate directly with
 * each other - that would be chaos. They all communicate with the
 * control tower, which coordinates everything.
 *
 * In code, I might have a form with email field, password field,
 * and submit button. Without a mediator, each component would need
 * to know about the others - email checks password, password checks
 * email, button checks both. With a mediator, components just notify
 * the mediator when something changes. The mediator decides what to
 * do - validate fields, enable/disable the submit button, etc.
 *
 * The benefit is loose coupling. Components only know about the
 * mediator, not each other. This makes it easier to add new components
 * or change the coordination logic.
 *
 * Redux is a great example - components dispatch actions to the store,
 * which is the mediator. The store coordinates state updates and
 * notifies subscribers. Components don't talk to each other directly."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Central hub for communication
 * ✓ Objects don't talk directly to each other
 * ✓ Reduces N*(N-1) connections to N
 * ✓ Loose coupling between components
 * ✓ Example: Air traffic control, Redux
 *
 */


// RUN: node docs/25-design-patterns/09-mediator-pattern.js
