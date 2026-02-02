/**
 * TOPIC: PropTypes - Runtime Type Validation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ PropTypes provide RUNTIME type checking for props in development.        ║
 * ║ They warn in the console but do NOT prevent rendering.                  ║
 * ║ For production apps, use TypeScript instead for COMPILE-TIME safety.    ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────────────┐
 * │                                                                           │
 * │ PropTypes is like a SECURITY GUARD at a club. They CHECK your ID         │
 * │ (type) at the door (render). Wrong ID = warning, but they still let      │
 * │ you in. TypeScript is the BOUNCER - wrong ID and you don't compile.     │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   PropTypes (runtime)          TypeScript (compile-time)                  │
 * │   ┌────────────────────┐      ┌────────────────────────┐                 │
 * │   │ User.propTypes = { │      │ interface UserProps {   │                 │
 * │   │   name: string,    │      │   name: string;        │                 │
 * │   │   age: number      │      │   age: number;         │                 │
 * │   │ }                  │      │ }                      │                 │
 * │   │ Warns at RUNTIME   │      │ Errors at COMPILE      │                 │
 * │   └────────────────────┘      └────────────────────────┘                 │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// A: Simulating PropTypes validation
function createValidator(typeName, checkFn) {
  const validator = (props, propName, componentName) => {
    if (!checkFn(props[propName])) {
      return `Warning: Invalid prop '${propName}' of type '${typeof props[propName]}' ` +
             `supplied to '${componentName}', expected '${typeName}'.`;
    }
    return null;
  };
  validator.isRequired = (props, propName, componentName) => {
    if (props[propName] === undefined) {
      return `Warning: '${propName}' is required in '${componentName}'.`;
    }
    return validator(props, propName, componentName);
  };
  return validator;
}

const PropTypes = {
  string:  createValidator('string', v => typeof v === 'string'),
  number:  createValidator('number', v => typeof v === 'number'),
  bool:    createValidator('boolean', v => typeof v === 'boolean'),
  func:    createValidator('function', v => typeof v === 'function'),
  array:   createValidator('array', v => Array.isArray(v)),
  object:  createValidator('object', v => typeof v === 'object' && !Array.isArray(v)),
};

console.log('A: PropTypes validators:');
console.log('   string("hi"):', PropTypes.string({ n: 'hi' }, 'n', 'Test') || 'valid');
console.log('   number("hi"):', PropTypes.number({ n: 'hi' }, 'n', 'Test'));

// B: Using propTypes on a component
function UserProfile(props) {
  return `[User: ${props.name}, age: ${props.age}]`;
}
UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
};

console.log('\nB: Validate component props:');
function validateProps(component, props) {
  const errors = [];
  for (const [key, validator] of Object.entries(component.propTypes || {})) {
    const err = validator(props, key, component.name);
    if (err) errors.push(err);
  }
  return errors.length ? errors : ['All props valid'];
}

console.log('   Valid:', validateProps(UserProfile, { name: 'Surya', age: 25 }));
console.log('   Missing:', validateProps(UserProfile, { age: 25 }));
console.log('   Wrong type:', validateProps(UserProfile, { name: 123 }));

// C: Common PropTypes patterns (in real React)
console.log('\nC: Common PropTypes (React syntax):');
const patterns = [
  'PropTypes.string          - any string',
  'PropTypes.number          - any number',
  'PropTypes.bool            - true/false',
  'PropTypes.func            - function',
  'PropTypes.array           - array',
  'PropTypes.oneOf(["a","b"])- enum values',
  'PropTypes.shape({...})    - object shape',
  'PropTypes.arrayOf(number) - typed array',
  'PropTypes.any.isRequired  - required any type',
];
patterns.forEach(p => console.log('   ' + p));

// D: TypeScript vs PropTypes
console.log('\nD: Modern recommendation:');
console.log('   Use TypeScript for new projects - catches errors at compile time');
console.log('   PropTypes still useful for JS-only codebases');

/**
 * OUTPUT:
 *   A: Validator results
 *   B: Component prop validation
 *   C: Common patterns list
 *   D: Modern recommendation
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "PropTypes is a runtime type checking library for React props. You        │
 * │  define expected types on ComponentName.propTypes and React warns in      │
 * │  development if props don't match. Common validators include string,      │
 * │  number, bool, func, shape, oneOf, and arrayOf. For production apps,     │
 * │  TypeScript is preferred as it catches type errors at compile time.       │
 * │  PropTypes only warns - it doesn't prevent rendering."                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/01-components-props/03-prop-types.js
 */
