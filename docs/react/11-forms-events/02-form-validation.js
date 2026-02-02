/**
 * TOPIC: Form Validation — onChange vs onSubmit, Custom Validation, Error State
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Validate onChange for instant feedback. Validate     ║
 * ║  onSubmit for batch checking. Store errors in state   ║
 * ║  alongside form values. Show errors per field.        ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A bouncer at a club:    │
 * │ onChange = checks ID at │
 * │   the door (each step)  │
 * │ onSubmit = checks       │
 * │   everything at the gate│
 * │   before entry.         │
 * │ Best: check at door +   │
 * │   final gate check.     │
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  onChange validation:  │
 * │  type → validate → show error immediately │
 * │                       │
 * │  onSubmit validation:  │
 * │  type → type → submit → validate all → show errors │
 * └───────────────────────┘
 */

// --- Validation helpers ---
const validators = {
  required: (val) => (val.trim() ? null : "Required"),
  email: (val) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : "Invalid email"),
  minLength: (min) => (val) => (val.length >= min ? null : `Min ${min} chars`),
  match: (other, label) => (val) => (val === other ? null : `Must match ${label}`),
};

// --- Form state manager ---
function createForm(config) {
  const values = {};
  const errors = {};
  const touched = {};

  Object.keys(config).forEach((field) => {
    values[field] = "";
    errors[field] = null;
    touched[field] = false;
  });

  function validateField(field) {
    const rules = config[field];
    for (const rule of rules) {
      const error = rule(values[field]);
      if (error) return error;
    }
    return null;
  }

  function onChange(field, value) {
    values[field] = value;
    touched[field] = true;
    errors[field] = validateField(field);
  }

  function onSubmit() {
    Object.keys(config).forEach((field) => {
      touched[field] = true;
      errors[field] = validateField(field);
    });
    const isValid = Object.values(errors).every((e) => e === null);
    return { isValid, values: { ...values }, errors: { ...errors } };
  }

  function getState() { return { values, errors, touched }; }

  return { onChange, onSubmit, getState };
}

// A: onChange validation — instant feedback
console.log("A: onChange validation (instant feedback)");
const form = createForm({
  email: [validators.required, validators.email],
  password: [validators.required, validators.minLength(6)],
});

form.onChange("email", "surya");
console.log(`  email="surya" → error: ${form.getState().errors.email}`);

form.onChange("email", "surya@dev.com");
console.log(`  email="surya@dev.com" → error: ${form.getState().errors.email}`);

form.onChange("password", "123");
console.log(`  password="123" → error: ${form.getState().errors.password}`);

form.onChange("password", "secure123");
console.log(`  password="secure123" → error: ${form.getState().errors.password}`);

// B: onSubmit validation — batch check
console.log("\nB: onSubmit validation (batch)");
const form2 = createForm({
  name: [validators.required],
  email: [validators.required, validators.email],
});
const result = form2.onSubmit();
console.log(`  Empty submit → valid: ${result.isValid}`);
console.log(`  Errors: ${JSON.stringify(result.errors)}`);

form2.onChange("name", "Surya");
form2.onChange("email", "surya@dev.com");
const result2 = form2.onSubmit();
console.log(`  Filled submit → valid: ${result2.isValid}`);

// C: Show errors only after touched
console.log("\nC: Show errors only when field touched");
const form3 = createForm({ email: [validators.required, validators.email] });
const s = form3.getState();
console.log(`  Before touch: show error? ${s.touched.email ? s.errors.email : "(hidden)"}`);
form3.onChange("email", "bad");
const s2 = form3.getState();
console.log(`  After touch:  show error? ${s2.touched.email ? s2.errors.email : "(hidden)"}`);

// D: Password confirmation
console.log("\nD: Password confirmation (cross-field validation)");
let pw = "secret123";
const confirmValidator = (val) => val === pw ? null : "Passwords don't match";
const form4 = createForm({ confirm: [validators.required, confirmValidator] });
form4.onChange("confirm", "wrong");
console.log(`  confirm="wrong" → ${form4.getState().errors.confirm}`);
form4.onChange("confirm", "secret123");
console.log(`  confirm="secret123" → ${form4.getState().errors.confirm}`);

// E: Disable submit until valid
console.log("\nE: Disable submit button until valid");
const form5 = createForm({ email: [validators.required, validators.email] });
const canSubmit = () => {
  const { errors, touched } = form5.getState();
  return Object.values(touched).every(Boolean) && Object.values(errors).every((e) => e === null);
};
console.log(`  Empty form → button disabled: ${!canSubmit()}`);
form5.onChange("email", "surya@dev.com");
console.log(`  Valid form → button disabled: ${!canSubmit()}`);

/**
 * OUTPUT:
 * A: onChange validation
 *   email="surya" → error: Invalid email
 *   email="surya@dev.com" → error: null
 *   password="123" → error: Min 6 chars
 *   password="secure123" → error: null
 *
 * B: onSubmit validation
 *   Empty submit → valid: false
 *   Errors: {"name":"Required","email":"Required"}
 *   Filled submit → valid: true
 *
 * C: Show errors only when touched
 *   Before touch: (hidden)
 *   After touch: Invalid email
 *
 * D: Password confirmation
 *   confirm="wrong" → Passwords don't match
 *   confirm="secret123" → null
 *
 * E: Disable submit button
 *   Empty form → button disabled: true
 *   Valid form → button disabled: false
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Two strategies: onChange (instant feedback per field)   │
 * │ and onSubmit (validate all at once). Best: combine     │
 * │ both. Track touched state to avoid showing errors on   │
 * │ pristine fields. Libraries: Formik, React Hook Form.   │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/11-forms-events/02-form-validation.js
 */
