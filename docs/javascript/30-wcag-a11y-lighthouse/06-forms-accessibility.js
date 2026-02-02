/**
 * TOPIC: Forms Accessibility
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                               ║
 * ║  Every input MUST have a label. Every error MUST be announced.  ║
 * ║  <label for="id"> is the simplest, most powerful a11y tool.     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────┐
 * │ A form without labels is like a tax form with blank boxes      │
 * │ and no instructions. You can see WHERE to write, but not       │
 * │ WHAT to write. Labels are the instructions.                    │
 * └───────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────┐
 * │  Label Association Methods:                                    │
 * │  1. <label for="id">   → Explicit (BEST)                     │
 * │  2. <label><input></label> → Implicit wrapping                │
 * │  3. aria-label          → Invisible label                     │
 * │  4. aria-labelledby     → Reference other element             │
 * │                                                                │
 * │  Error Pattern:                                                │
 * │  <input aria-invalid="true" aria-describedby="err1">         │
 * │  <span id="err1" role="alert">Error message</span>           │
 * └───────────────────────────────────────────────────────────────┘
 */

// ─── A: Label Association Methods ───────────────────────────────
console.log("A: Label Association Methods:");

const checkLabelAssociation = (input) => {
  if (input.labelFor) return { method: "explicit <label for>", accessible: true };
  if (input.wrappedInLabel) return { method: "implicit wrapping", accessible: true };
  if (input.ariaLabel) return { method: "aria-label", accessible: true };
  if (input.ariaLabelledby) return { method: "aria-labelledby", accessible: true };
  if (input.title) return { method: "title attribute", accessible: true };
  if (input.placeholder) return { method: "placeholder ONLY", accessible: false };
  return { method: "NONE", accessible: false };
};

const inputs = [
  { name: "Email",    labelFor: "email-id" },
  { name: "Password", wrappedInLabel: true },
  { name: "Search",   ariaLabel: "Search site" },
  { name: "Filter",   ariaLabelledby: "filter-heading" },
  { name: "Phone",    placeholder: "Enter phone" },
  { name: "Code",     title: "Verification code" },
  { name: "Mystery" },
];

inputs.forEach(input => {
  const { method, accessible } = checkLabelAssociation(input);
  console.log(`   ${input.name.padEnd(10)} → ${method.padEnd(25)} [${accessible ? "PASS" : "FAIL"}]`);
});

// ─── B: Placeholder is NOT a Label ──────────────────────────────
console.log("\nB: Why Placeholder is NOT a Label:");
console.log("   1. Disappears when user starts typing");
console.log("   2. Low contrast (gray on white)");
console.log("   3. Not all screen readers announce it");
console.log("   4. Can't be styled like a label");
console.log("   5. Confuses users — is this pre-filled?");
console.log("   Use: <label> for the label, placeholder for hints ONLY");

// ─── C: Form Validation with A11y ──────────────────────────────
console.log("\nC: Accessible Form Validation:");

class AccessibleForm {
  constructor(fields) {
    this.fields = fields;
    this.errors = {};
  }

  validate = () => {
    this.errors = {};
    this.fields.forEach(field => {
      if (field.required && !field.value) {
        this.errors[field.name] = `${field.label} is required`;
      } else if (field.pattern && !field.pattern.test(field.value)) {
        this.errors[field.name] = field.errorMessage;
      } else if (field.minLength && field.value.length < field.minLength) {
        this.errors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
      }
    });
    return Object.keys(this.errors).length === 0;
  };

  getAriaAttributes = (fieldName) => {
    const hasError = this.errors[fieldName];
    return {
      "aria-invalid": hasError ? "true" : "false",
      "aria-describedby": hasError ? `${fieldName}-error` : undefined,
      "aria-required": this.fields.find(f => f.name === fieldName)?.required ? "true" : undefined,
    };
  };

  getErrorAnnouncement = () => {
    const count = Object.keys(this.errors).length;
    if (count === 0) return "Form submitted successfully";
    return `${count} error${count > 1 ? "s" : ""} found. ${Object.values(this.errors).join(". ")}`;
  };
}

const form = new AccessibleForm([
  { name: "email", label: "Email", value: "", required: true, pattern: /\S+@\S+\.\S+/, errorMessage: "Invalid email format" },
  { name: "password", label: "Password", value: "abc", required: true, minLength: 8 },
  { name: "name", label: "Name", value: "John", required: true },
]);

const valid = form.validate();
console.log(`   Valid: ${valid}`);
console.log(`   Errors: ${JSON.stringify(form.errors)}`);
console.log(`   Announcement: "${form.getErrorAnnouncement()}"`);
console.log(`   Email ARIA: ${JSON.stringify(form.getAriaAttributes("email"))}`);
console.log(`   Name ARIA: ${JSON.stringify(form.getAriaAttributes("name"))}`);

// ─── D: Fieldset & Legend ───────────────────────────────────────
console.log("\nD: Fieldset/Legend for Grouped Fields:");
console.log("   Use for: radio groups, checkbox groups, related fields");
console.log('   <fieldset>');
console.log('     <legend>Payment Method</legend>');
console.log('     <input type="radio" id="cc" name="pay"><label for="cc">Credit Card</label>');
console.log('     <input type="radio" id="pp" name="pay"><label for="pp">PayPal</label>');
console.log('   </fieldset>');
console.log("   Screen reader: 'Payment Method grouping, Credit Card radio button'");

// ─── E: Required Fields ─────────────────────────────────────────
console.log("\nE: Marking Required Fields:");
console.log('   HTML5:  <input required>  (browser enforces + SR announces)');
console.log('   ARIA:   aria-required="true" (SR announces, no browser validation)');
console.log('   Visual: * asterisk + <span class="sr-only">(required)</span>');
console.log("   Best: use HTML required + visual indicator + helper text");

// ─── F: Autocomplete Attribute ──────────────────────────────────
console.log("\nF: Autocomplete for Cognitive A11y (WCAG 1.3.5):");
const autocompleteValues = [
  { field: "Full name",    value: "name" },
  { field: "Email",        value: "email" },
  { field: "Phone",        value: "tel" },
  { field: "Street",       value: "street-address" },
  { field: "ZIP/Postal",   value: "postal-code" },
  { field: "Credit card",  value: "cc-number" },
];

autocompleteValues.forEach(({ field, value }) => {
  console.log(`   ${field.padEnd(14)} → autocomplete="${value}"`);
});

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Every input needs a label — <label for> is  ║
 * ║ best. Placeholder is NOT a label. Use aria-invalid and         ║
 * ║ aria-describedby to link error messages. Group related fields  ║
 * ║ with fieldset/legend. Mark required with HTML required + ARIA. ║
 * ║ Use autocomplete for cognitive accessibility (WCAG 1.3.5).     ║
 * ║ Announce validation errors with role='alert'."                 ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/javascript/30-wcag-a11y-lighthouse/06-forms-accessibility.js
 */
