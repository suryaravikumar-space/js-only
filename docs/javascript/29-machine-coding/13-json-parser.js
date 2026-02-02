/**
 * MACHINE CODING: 13 - JSON Parser (without JSON.parse)
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE: A recursive descent parser. Read one character at a      ║
 * ║  time, decide which parseX function to call based on the current       ║
 * ║  character. Handle strings, numbers, booleans, null, arrays, objects.  ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  STORY TO REMEMBER: A reader (cursor) walks through a book (string).   │
 * │  At each sentence start, the first letter tells them which language     │
 * │  rule to apply: " = string, [ = array, { = object, etc.               │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  VISUAL DIAGRAM                                                        │
 * │                                                                        │
 * │   Input:  '{"a": [1, true, "hi"]}'                                     │
 * │                                                                        │
 * │   parseValue ──► sees '{' ──► parseObject                              │
 * │                    parseString("a")                                     │
 * │                    expect ':'                                           │
 * │                    parseValue ──► sees '[' ──► parseArray               │
 * │                      parseValue ──► parseNumber(1)                     │
 * │                      parseValue ──► parseLiteral(true)                 │
 * │                      parseValue ──► parseString("hi")                  │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * PROBLEM: Implement parseJSON(str) without JSON.parse. Handle all JSON types.
 *
 * RUN: node docs/javascript/29-machine-coding/13-json-parser.js
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

function parseJSON(str) {
  let i = 0;

  function current() { return str[i]; }
  function advance() { return str[i++]; }

  function skipWhitespace() {
    while (i < str.length && " \t\n\r".includes(str[i])) i++;
  }

  function expect(ch) {
    skipWhitespace();
    if (advance() !== ch) throw new Error(`Expected '${ch}' at position ${i - 1}`);
  }

  function parseValue() {
    skipWhitespace();
    const ch = current();
    if (ch === '"') return parseString();
    if (ch === '{') return parseObject();
    if (ch === '[') return parseArray();
    if (ch === 't' || ch === 'f') return parseBoolean();
    if (ch === 'n') return parseNull();
    if (ch === '-' || (ch >= '0' && ch <= '9')) return parseNumber();
    throw new Error(`Unexpected character '${ch}' at position ${i}`);
  }

  function parseString() {
    expect('"');
    let result = "";
    while (i < str.length && current() !== '"') {
      if (current() === '\\') {
        advance(); // skip backslash
        const esc = advance();
        const escMap = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };
        if (esc === 'u') {
          const hex = str.slice(i, i + 4);
          result += String.fromCharCode(parseInt(hex, 16));
          i += 4;
        } else if (esc in escMap) {
          result += escMap[esc];
        } else {
          throw new Error(`Invalid escape \\${esc}`);
        }
      } else {
        result += advance();
      }
    }
    expect('"'); // closing quote
    return result;
  }

  function parseNumber() {
    let start = i;
    if (current() === '-') advance();
    while (i < str.length && current() >= '0' && current() <= '9') advance();
    if (current() === '.') {
      advance();
      while (i < str.length && current() >= '0' && current() <= '9') advance();
    }
    if (current() === 'e' || current() === 'E') {
      advance();
      if (current() === '+' || current() === '-') advance();
      while (i < str.length && current() >= '0' && current() <= '9') advance();
    }
    return Number(str.slice(start, i));
  }

  function parseBoolean() {
    if (str.slice(i, i + 4) === 'true') { i += 4; return true; }
    if (str.slice(i, i + 5) === 'false') { i += 5; return false; }
    throw new Error(`Invalid boolean at ${i}`);
  }

  function parseNull() {
    if (str.slice(i, i + 4) === 'null') { i += 4; return null; }
    throw new Error(`Invalid null at ${i}`);
  }

  function parseArray() {
    expect('[');
    skipWhitespace();
    const arr = [];
    if (current() === ']') { advance(); return arr; }
    arr.push(parseValue());
    while (true) {
      skipWhitespace();
      if (current() === ']') { advance(); return arr; }
      expect(',');
      arr.push(parseValue());
    }
  }

  function parseObject() {
    expect('{');
    skipWhitespace();
    const obj = {};
    if (current() === '}') { advance(); return obj; }
    const key = parseString();
    expect(':');
    obj[key] = parseValue();
    while (true) {
      skipWhitespace();
      if (current() === '}') { advance(); return obj; }
      expect(',');
      skipWhitespace();
      const k = parseString();
      expect(':');
      obj[k] = parseValue();
    }
  }

  const result = parseValue();
  skipWhitespace();
  if (i < str.length) throw new Error(`Unexpected content at position ${i}`);
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST CASES
// ═══════════════════════════════════════════════════════════════════════════

function test(label, input, expected) {
  const result = parseJSON(input);
  const pass = JSON.stringify(result) === JSON.stringify(expected);
  console.log(`${label}: ${pass ? "PASS" : "FAIL"}`, JSON.stringify(result));
}

console.log("═══ TEST A: Primitives ═══");
test("A1: string", '"hello"', "hello");
test("A2: number", "42", 42);
test("A3: negative", "-3.14", -3.14);
test("A4: boolean true", "true", true);
test("A5: boolean false", "false", false);
test("A6: null", "null", null);

console.log("\n═══ TEST B: Arrays ═══");
test("B1: empty array", "[]", []);
test("B2: number array", "[1, 2, 3]", [1, 2, 3]);
test("B3: mixed array", '[1, "two", true, null]', [1, "two", true, null]);
test("B4: nested array", "[[1, 2], [3, 4]]", [[1, 2], [3, 4]]);

console.log("\n═══ TEST C: Objects ═══");
test("C1: empty object", "{}", {});
test("C2: simple object", '{"a": 1, "b": 2}', { a: 1, b: 2 });
test("C3: nested object", '{"x": {"y": 1}}', { x: { y: 1 } });

console.log("\n═══ TEST D: Complex nested ═══");
const complex = '{"users": [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}], "count": 2}';
test("D1: complex", complex, { users: [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }], count: 2 });

console.log("\n═══ TEST E: Escape sequences ═══");
test("E1: newline", '"hello\\nworld"', "hello\nworld");
test("E2: tab", '"a\\tb"', "a\tb");
test("E3: escaped quote", '"say \\"hi\\""', 'say "hi"');
test("E4: unicode", '"\\u0041"', "A");

console.log("\n═══ TEST F: Scientific notation ═══");
test("F1: exponent", "1e10", 1e10);
test("F2: negative exp", "2.5e-3", 2.5e-3);

console.log("\n═══ TEST G: Error handling ═══");
try { parseJSON("{bad}"); } catch (e) { console.log("G1: Error caught:", e.message); }
try { parseJSON("[1, 2,]"); } catch (e) { console.log("G2: Trailing comma:", e.message); }

// ═══════════════════════════════════════════════════════════════════════════
// FOLLOW-UP QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 1. How would you implement JSON.stringify from scratch?
 * 2. How would you handle circular references?
 * 3. What is the time and space complexity?
 * 4. How would you add a reviver function like JSON.parse(str, reviver)?
 * 5. How does this compare to a tokenizer + parser approach?
 */

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW ANSWER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  "I use recursive descent parsing. A cursor walks through the string.  ║
 * ║  parseValue checks the current char: '"' calls parseString, '{'        ║
 * ║  calls parseObject, '[' calls parseArray, digits call parseNumber,     ║
 * ║  t/f/n call parseLiteral. Each function advances the cursor and        ║
 * ║  returns the parsed JS value. Time: O(n), Space: O(d) for depth d."   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
