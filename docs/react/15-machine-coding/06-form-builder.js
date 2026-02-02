/**
 * TOPIC: Dynamic Form Builder — Machine Coding
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: Form = JSON Config + Validation Engine +      ║
 * ║  Error Map. Config drives fields, rules drive errors.       ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: A clerk has a form template (JSON config). Citizens  │
 * │  fill it in. The clerk checks each answer against rules      │
 * │  (required? too short? wrong pattern?) and stamps errors     │
 * │  in red before accepting or rejecting the submission.        │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                             │
 * │                                             │
 * │  JSON Config ──> Field Renderer             │
 * │                    │                        │
 * │              ┌─────┴─────┐                  │
 * │              │  text     │                  │
 * │              │  select   │                  │
 * │              │  checkbox │                  │
 * │              │  radio    │                  │
 * │              └─────┬─────┘                  │
 * │                    │                        │
 * │              Validation Engine              │
 * │                    │                        │
 * │              Error Map / Submit             │
 * └─────────────────────────────────────────────┘
 *
 * RUN: node docs/react/15-machine-coding/06-form-builder.js
 */

// ─── Form Config ─────────────────────────────────────────────
const formConfig = [
  {
    name: "username", type: "text", label: "Username",
    rules: [
      { type: "required", message: "Username is required" },
      { type: "minLength", value: 3, message: "Min 3 characters" },
    ],
  },
  {
    name: "email", type: "text", label: "Email",
    rules: [
      { type: "required", message: "Email is required" },
      { type: "pattern", value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
    ],
  },
  {
    name: "role", type: "select", label: "Role",
    options: ["developer", "designer", "manager"],
    rules: [{ type: "required", message: "Please select a role" }],
  },
  {
    name: "newsletter", type: "checkbox", label: "Subscribe to newsletter",
    rules: [],
  },
  {
    name: "experience", type: "radio", label: "Experience Level",
    options: ["junior", "mid", "senior"],
    rules: [{ type: "required", message: "Select experience level" }],
  },
];

// ─── Validation Engine ───────────────────────────────────────
function validateField(value, rules) {
  const errors = [];
  for (const rule of rules) {
    if (rule.type === "required" && (!value || (typeof value === "string" && !value.trim()))) {
      errors.push(rule.message);
    }
    if (rule.type === "minLength" && typeof value === "string" && value.length < rule.value) {
      errors.push(rule.message);
    }
    if (rule.type === "pattern" && typeof value === "string" && !rule.value.test(value)) {
      errors.push(rule.message);
    }
  }
  return errors;
}

function validateForm(config, values) {
  const errorMap = {};
  let valid = true;
  for (const field of config) {
    const errs = validateField(values[field.name], field.rules);
    if (errs.length > 0) {
      errorMap[field.name] = errs;
      valid = false;
    }
  }
  return { valid, errorMap };
}

// ─── Render simulation ──────────────────────────────────────
function renderForm(config, values, errorMap) {
  const lines = [];
  for (const field of config) {
    const val = values[field.name] ?? "(empty)";
    const display = field.type === "checkbox" ? (val ? "checked" : "unchecked") : val;
    let line = `  ${field.label} [${field.type}]: ${display}`;
    if (errorMap[field.name]) {
      line += `  ** ${errorMap[field.name].join("; ")} **`;
    }
    lines.push(line);
  }
  return lines.join("\n");
}

// ─── Submit handler ──────────────────────────────────────────
function handleSubmit(config, values) {
  const { valid, errorMap } = validateForm(config, values);
  if (valid) {
    return { success: true, data: values };
  }
  return { success: false, errorMap };
}

// ─── Simulation ──────────────────────────────────────────────
console.log("=== FORM BUILDER SIMULATION ===\n");

// A: Render empty form
console.log("A: Empty form rendered from config");
const emptyValues = {};
let result = validateForm(formConfig, emptyValues);
console.log(renderForm(formConfig, emptyValues, {}) + "\n");

// B: Submit empty — all required errors
console.log("B: Submit empty form — validation errors");
result = handleSubmit(formConfig, emptyValues);
console.log(`   Success: ${result.success}`);
console.log(`   Errors: ${JSON.stringify(result.errorMap, null, 2)}\n`);

// C: Partial fill
const partial = { username: "Su", email: "bad", role: "", experience: "" };
console.log("C: Partial fill — multiple validation rules trigger");
result = handleSubmit(formConfig, partial);
console.log(renderForm(formConfig, partial, result.errorMap) + "\n");

// D: Valid submission
const valid = {
  username: "surya", email: "surya@dev.com",
  role: "developer", newsletter: true, experience: "senior",
};
console.log("D: Valid submission");
result = handleSubmit(formConfig, valid);
console.log(`   Success: ${result.success}`);
console.log(`   Data: ${JSON.stringify(result.data)}\n`);

// E: Dynamic field addition
console.log("E: Dynamically add a field at runtime");
formConfig.push({
  name: "bio", type: "text", label: "Bio",
  rules: [{ type: "minLength", value: 10, message: "Bio must be 10+ chars" }],
});
const withBio = { ...valid, bio: "Hi" };
result = handleSubmit(formConfig, withBio);
console.log(`   Bio 'Hi' valid? ${!result.errorMap?.bio}`);
withBio.bio = "Full-stack developer from India";
result = handleSubmit(formConfig, withBio);
console.log(`   Bio long enough? ${result.success}\n`);

// F: Field type rendering summary
console.log("F: Supported field types");
const types = [...new Set(formConfig.map((f) => f.type))];
console.log(`   Types: ${types.join(", ")}\n`);

// G: Error count summary
const allEmpty = handleSubmit(formConfig, {});
const totalErrors = Object.values(allEmpty.errorMap).flat().length;
console.log(`G: Total validation errors on empty submit: ${totalErrors}\n`);

// ─── Follow-up Questions ─────────────────────────────────────
console.log("=== FOLLOW-UP QUESTIONS ===");
console.log("1. How to add async validation (e.g., check username availability)?");
console.log("2. How to implement conditional fields (show B only if A = 'yes')?");
console.log("3. How to support multi-step / wizard forms?");
console.log("4. How to handle file upload fields?");
console.log("5. How to add cross-field validation (password === confirm)?");

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER                                           ║
 * ║                                                             ║
 * ║  Form builder: JSON config array drives rendering. Each     ║
 * ║  field has name, type, label, options, and rules. A         ║
 * ║  validation engine loops rules (required, minLength,        ║
 * ║  pattern) and returns an error map. Submit checks all       ║
 * ║  fields; if error map is empty, form is valid. This         ║
 * ║  pattern separates config from logic cleanly.               ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
