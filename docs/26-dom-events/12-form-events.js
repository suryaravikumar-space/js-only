/**
 * DOM EVENTS: 12 - Form Events
 *
 * ONE CONCEPT: Events triggered by form elements and form submission
 */


// =============================================================================
// FORM EVENT TYPES
// =============================================================================

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  FORM EVENTS                                                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  FORM SUBMISSION:                                                   │
 *   │  submit   - Form is being submitted                                 │
 *   │  reset    - Form is being reset                                     │
 *   │                                                                     │
 *   │  INPUT VALUE CHANGES:                                               │
 *   │  input    - Value changed (fires immediately, on every keystroke)   │
 *   │  change   - Value committed (fires on blur or Enter)                │
 *   │                                                                     │
 *   │  FOCUS EVENTS:                                                      │
 *   │  focus    - Element gained focus (doesn't bubble)                   │
 *   │  blur     - Element lost focus (doesn't bubble)                     │
 *   │  focusin  - Element gained focus (BUBBLES)                          │
 *   │  focusout - Element lost focus (BUBBLES)                            │
 *   │                                                                     │
 *   │  SELECTION:                                                         │
 *   │  select   - Text selected in input/textarea                         │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// input vs change
// =============================================================================

console.log('=== input vs change Events ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THE KEY DIFFERENCE                                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  input event:                                                       │
 *   │  ─────────────                                                      │
 *   │  • Fires on EVERY change (every keystroke)                          │
 *   │  • Real-time updates                                                │
 *   │  • Good for: live search, character counters, live preview          │
 *   │                                                                     │
 *   │  change event:                                                      │
 *   │  ─────────────                                                      │
 *   │  • Fires when value is "committed"                                  │
 *   │  • For text inputs: on blur (clicking away) or Enter                │
 *   │  • For checkbox/radio/select: immediately on change                 │
 *   │  • Good for: form validation, saving data                           │
 *   │                                                                     │
 *   │                                                                     │
 *   │  Example: Type "hello" in input, then click away                    │
 *   │  ─────────────────────────────────────────────────                  │
 *   │  input events: 5 (h, e, l, l, o)                                    │
 *   │  change events: 1 (on blur)                                         │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const inputVsChangeExample = `
// input: fires on every keystroke
searchInput.addEventListener('input', (e) => {
  // Live search - fires as user types
  performSearch(e.target.value);
});

// change: fires when user is "done"
emailInput.addEventListener('change', (e) => {
  // Validate after user finishes typing
  validateEmail(e.target.value);
});

// Different behavior for different elements:
// ─────────────────────────────────────────

// Checkbox - both fire immediately
checkbox.addEventListener('input', () => console.log('input'));
checkbox.addEventListener('change', () => console.log('change'));
// Click checkbox → both fire

// Select - both fire immediately
select.addEventListener('input', () => console.log('input'));
select.addEventListener('change', () => console.log('change'));
// Change option → both fire

// Text input - input fires immediately, change fires on blur
textInput.addEventListener('input', () => console.log('input'));
textInput.addEventListener('change', () => console.log('change'));
// Type 'abc' → input fires 3 times
// Click away → change fires 1 time
`;

console.log(inputVsChangeExample);


// =============================================================================
// FORM SUBMISSION
// =============================================================================

console.log('=== Form Submission ===\n');

const submitExample = `
// Handle form submission
form.addEventListener('submit', function(e) {
  e.preventDefault();  // Stop page reload

  // Get form data
  const formData = new FormData(this);

  // Access individual values
  const email = formData.get('email');
  const password = formData.get('password');

  // Or convert to object
  const data = Object.fromEntries(formData);
  console.log(data); // { email: '...', password: '...' }

  // Submit via fetch
  fetch('/api/login', {
    method: 'POST',
    body: formData
    // OR: body: JSON.stringify(data)
  });
});

// Alternative: FormData from specific form
const formData = new FormData(document.getElementById('myForm'));

// Multiple ways to trigger submit:
// 1. Click submit button
// 2. Press Enter in a text input
// 3. form.submit() (doesn't trigger submit event!)
// 4. form.requestSubmit() (triggers submit event)
`;

console.log(submitExample);


// =============================================================================
// FOCUS EVENTS
// =============================================================================

console.log('=== Focus Events ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  focus/blur vs focusin/focusout                                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  focus/blur:                                                        │
 *   │  • Do NOT bubble                                                    │
 *   │  • Can only listen on the element itself                            │
 *   │                                                                     │
 *   │  focusin/focusout:                                                  │
 *   │  • DO bubble                                                        │
 *   │  • Can use event delegation                                         │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const focusExample = `
// focus/blur - attach to each input
input.addEventListener('focus', () => {
  input.classList.add('focused');
});
input.addEventListener('blur', () => {
  input.classList.remove('focused');
});

// focusin/focusout - event delegation!
form.addEventListener('focusin', (e) => {
  e.target.classList.add('focused');
});
form.addEventListener('focusout', (e) => {
  e.target.classList.remove('focused');
  validateField(e.target);  // Validate on blur
});

// Programmatic focus
input.focus();     // Give focus
input.blur();      // Remove focus

// Check what has focus
document.activeElement;  // Returns currently focused element
`;

console.log(focusExample);


// =============================================================================
// FORM VALIDATION
// =============================================================================

console.log('=== Form Validation ===\n');

const validationExample = `
// HTML5 Validation API
const form = document.getElementById('myForm');
const email = document.getElementById('email');

// Check validity
email.checkValidity();     // Returns boolean
email.reportValidity();    // Shows validation message + returns boolean
form.checkValidity();      // Check all fields

// Access validation state
email.validity.valid;           // Overall valid?
email.validity.valueMissing;    // Required but empty?
email.validity.typeMismatch;    // Wrong type (email format)?
email.validity.tooShort;        // Below minlength?
email.validity.tooLong;         // Above maxlength?
email.validity.patternMismatch; // Doesn't match pattern?
email.validity.rangeUnderflow;  // Below min?
email.validity.rangeOverflow;   // Above max?

// Custom validation message
email.setCustomValidity('Please enter a valid email');
email.setCustomValidity('');  // Clear custom message

// Validation event
input.addEventListener('invalid', (e) => {
  e.preventDefault();  // Don't show browser's default message
  showCustomError(e.target);
});

// Real-time validation
input.addEventListener('input', (e) => {
  if (e.target.validity.valid) {
    clearError(e.target);
  } else {
    showError(e.target);
  }
});
`;

console.log(validationExample);


// =============================================================================
// GETTING FORM VALUES
// =============================================================================

console.log('=== Getting Form Values ===\n');

const getValuesExample = `
// Method 1: Individual elements
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// Method 2: FormData (recommended)
const formData = new FormData(form);
const email = formData.get('email');
const all = Object.fromEntries(formData);

// Method 3: form.elements
const email = form.elements.email.value;
const password = form.elements.password.value;
const checkbox = form.elements.remember.checked;

// For different input types:
// ───────────────────────────
// text/email/password → .value
// checkbox → .checked (boolean)
// radio → form.elements.radioName.value (selected value)
// select → .value (selected option's value)
// select multiple → .selectedOptions (collection)
// file → .files (FileList)

// File input
const files = fileInput.files;  // FileList
const firstFile = files[0];     // File object
`;

console.log(getValuesExample);


// =============================================================================
// PRACTICAL PATTERNS
// =============================================================================

console.log('=== Practical Patterns ===\n');

const practicalExample = `
// Pattern 1: Disable submit button while submitting
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    await submitForm(new FormData(form));
    showSuccess();
  } catch (error) {
    showError(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});

// Pattern 2: Character counter
textarea.addEventListener('input', (e) => {
  const count = e.target.value.length;
  const max = e.target.maxLength;
  counter.textContent = \`\${count}/\${max}\`;
});

// Pattern 3: Auto-save draft
let saveTimeout;
editor.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveDraft(editor.value);
  }, 1000);  // Save 1 second after user stops typing
});
`;

console.log(practicalExample);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "Explain form events in JavaScript"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The main form events are submit, input, change, focus, and blur.
 *
 * The submit event fires when a form is submitted. I always preventDefault
 * to stop the page reload, then handle submission with JavaScript using
 * fetch. I use FormData to easily get all form values.
 *
 * For value changes, there's input and change. Input fires on every
 * keystroke - I use it for live features like search-as-you-type or
 * character counters. Change fires when the user is 'done' - for text
 * inputs that's when they blur or press Enter. I use change for
 * validation after the user finishes a field.
 *
 * Focus and blur fire when elements gain or lose focus. The important
 * thing is they don't bubble, so you can't use event delegation. If you
 * need delegation, use focusin and focusout instead - they do bubble.
 *
 * For form validation, there's a built-in Validity API. Each input has
 * a validity object with properties like valid, valueMissing,
 * typeMismatch, etc. You can call checkValidity to validate, and
 * setCustomValidity for custom error messages.
 *
 * A common pattern is using the input event for real-time feedback and
 * the change or focusout event for final validation. I also often
 * debounce the input event for auto-save features."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ submit: use preventDefault, FormData for values
 * ✓ input: fires on every change, good for live features
 * ✓ change: fires on commit (blur/Enter), good for validation
 * ✓ focus/blur don't bubble; use focusin/focusout for delegation
 * ✓ Validity API for validation
 *
 */


// RUN: node docs/26-dom-events/12-form-events.js
