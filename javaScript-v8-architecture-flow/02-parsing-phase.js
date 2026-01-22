/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║         JAVASCRIPT V8 ENGINE - PART 2: PARSING PHASE                         ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ 2.1 LEXICAL ANALYSIS (TOKENIZATION)                                          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   The LEXER reads source code CHARACTER BY CHARACTER and groups them
 *   into meaningful chunks called TOKENS.
 *
 *
 *   SOURCE CODE                                TOKENS
 *   ═══════════                                ══════
 *
 *   "var name = \"Surya\";"        ┌──────────────────────────────────┐
 *        │                        │ Token 1: KEYWORD     "var"       │
 *        │                        │ Token 2: IDENTIFIER  "name"      │
 *        └───────────────────────▶│ Token 3: OPERATOR    "="         │
 *                                 │ Token 4: STRING      "Surya"     │
 *                                 │ Token 5: PUNCTUATOR  ";"         │
 *                                 └──────────────────────────────────┘
 *
 *
 *   CHARACTER-BY-CHARACTER PROCESS:
 *   ════════════════════════════════
 *
 *   Position:  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
 *   Character: v   a   r   ' ' n   a   m   e   ' ' =   ' ' "   S   ...
 *              ─────────────  ───────────────  ─  ─  ─  ──────────────
 *              │              │                │  │  │  │
 *              │              │                │  │  │  └──▶ STRING: "Surya"
 *              │              │                │  │  └─────▶ (skip whitespace)
 *              │              │                │  └────────▶ OPERATOR: =
 *              │              │                └───────────▶ (skip whitespace)
 *              │              └────────────────────────────▶ IDENTIFIER: name
 *              └───────────────────────────────────────────▶ KEYWORD: var
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ TOKEN TYPES TABLE                                                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌────────────────┬─────────────────────────────────────────────────────────┐
 *   │ TOKEN TYPE     │ EXAMPLES                                                │
 *   ├────────────────┼─────────────────────────────────────────────────────────┤
 *   │ KEYWORD        │ var, let, const, function, return, if, else, for,       │
 *   │                │ while, class, new, this, typeof, instanceof, async,     │
 *   │                │ await, import, export, try, catch, throw                │
 *   ├────────────────┼─────────────────────────────────────────────────────────┤
 *   │ IDENTIFIER     │ myVar, userName, _private, $element, calculateSum       │
 *   │                │ (names you create for variables, functions, etc.)       │
 *   ├────────────────┼─────────────────────────────────────────────────────────┤
 *   │ LITERAL        │ Numbers: 42, 3.14, 0xFF, 0b1010, 1e10, 123n             │
 *   │                │ Strings: "hello", 'world', `template`                   │
 *   │                │ Boolean: true, false                                    │
 *   │                │ Special: null, undefined                                │
 *   │                │ RegExp:  /pattern/flags                                 │
 *   ├────────────────┼─────────────────────────────────────────────────────────┤
 *   │ OPERATOR       │ Arithmetic: + - * / % **                                │
 *   │                │ Comparison: == === != !== < > <= >=                     │
 *   │                │ Logical:    && || ! ?? ?.                               │
 *   │                │ Assignment: = += -= *= /= ??=                           │
 *   │                │ Bitwise:    & | ^ ~ << >> >>>                           │
 *   │                │ Other:      ... => typeof instanceof                    │
 *   ├────────────────┼─────────────────────────────────────────────────────────┤
 *   │ PUNCTUATOR     │ ( ) { } [ ] ; , . :                                     │
 *   ├────────────────┼─────────────────────────────────────────────────────────┤
 *   │ COMMENT        │ // single line                                          │
 *   │ (discarded)    │ /* multi-line *                                        │
 *   └────────────────┴─────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ 2.2 SYNTAX ANALYSIS (AST GENERATION)                                         │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   The PARSER takes tokens and builds an ABSTRACT SYNTAX TREE (AST).
 *   The AST represents the STRUCTURE and MEANING of the code.
 *
 *
 *   TOKENS                                     AST
 *   ══════                                     ═══
 *
 *   [var] [x] [=] [10] [+] [5] [;]                    Program
 *                                                       │
 *          │                                    VariableDeclaration
 *          │                                      (kind: "var")
 *          │                                            │
 *          └────────────────────────────────▶   VariableDeclarator
 *                                                  /         \
 *                                           Identifier    BinaryExpression
 *                                             (x)           (operator: +)
 *                                                            /        \
 *                                                       Literal      Literal
 *                                                        (10)         (5)
 *
 *
 *   WHY AST MATTERS - OPERATOR PRECEDENCE:
 *   ══════════════════════════════════════
 *
 *   Expression: "2 + 3 * 4"
 *
 *   ┌─────────────────────────┐    ┌─────────────────────────┐
 *   │ WITHOUT PROPER AST      │    │ WITH PROPER AST         │
 *   │ (WRONG!)                │    │ (CORRECT!)              │
 *   ├─────────────────────────┤    ├─────────────────────────┤
 *   │                         │    │                         │
 *   │         +               │    │          +              │
 *   │        / \              │    │         / \             │
 *   │       2   3             │    │        2   *            │
 *   │           │             │    │           / \           │
 *   │           * (wrong!)    │    │          3   4          │
 *   │           │             │    │                         │
 *   │           4             │    │                         │
 *   │                         │    │                         │
 *   │ Result: (2+3)*4 = 20    │    │ Result: 2+(3*4) = 14    │
 *   │ WRONG!                  │    │ CORRECT!                │
 *   └─────────────────────────┘    └─────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ AST NODE TYPES TABLE                                                         │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌────────────────────────┬────────────────────────────────────────────────┐
 *   │ NODE TYPE              │ JAVASCRIPT CODE EXAMPLE                        │
 *   ├────────────────────────┼────────────────────────────────────────────────┤
 *   │ Program                │ (Root node - contains all code)                │
 *   │ VariableDeclaration    │ var x = 10; let y = 20; const z = 30;          │
 *   │ FunctionDeclaration    │ function foo() { }                             │
 *   │ ClassDeclaration       │ class MyClass { }                              │
 *   ├────────────────────────┼────────────────────────────────────────────────┤
 *   │ Identifier             │ x, myVar, functionName                         │
 *   │ Literal                │ 42, "hello", true, null                        │
 *   │ BinaryExpression       │ a + b, x * y, i < 10                           │
 *   │ UnaryExpression        │ !flag, -num, typeof x                          │
 *   │ AssignmentExpression   │ x = 10, y += 5                                 │
 *   │ CallExpression         │ func(), console.log("hi")                      │
 *   │ MemberExpression       │ obj.prop, arr[0]                               │
 *   │ ArrowFunctionExpression│ () => { }, x => x * 2                          │
 *   │ ArrayExpression        │ [1, 2, 3]                                      │
 *   │ ObjectExpression       │ { key: value }                                 │
 *   ├────────────────────────┼────────────────────────────────────────────────┤
 *   │ IfStatement            │ if (cond) { } else { }                         │
 *   │ ForStatement           │ for (let i = 0; i < 10; i++) { }               │
 *   │ WhileStatement         │ while (cond) { }                               │
 *   │ ReturnStatement        │ return value;                                  │
 *   │ BlockStatement         │ { statement1; statement2; }                    │
 *   │ TryStatement           │ try { } catch (e) { } finally { }              │
 *   └────────────────────────┴────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ OPERATOR PRECEDENCE TABLE                                                    │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌────────────────────┬────────────────────────────────────────────────┐
 *   │ PRECEDENCE (high)  │ OPERATORS                                      │
 *   ├────────────────────┼────────────────────────────────────────────────┤
 *   │ 21                 │ () grouping                                    │
 *   │ 20                 │ . [] () member/call                            │
 *   │ 17                 │ ! ~ + - typeof void delete (unary)             │
 *   │ 16                 │ **  (exponentiation)                           │
 *   │ 15                 │ * / %                                          │
 *   │ 14                 │ + -                                            │
 *   │ 12                 │ < <= > >= in instanceof                        │
 *   │ 11                 │ == != === !==                                  │
 *   │ 7                  │ &&                                             │
 *   │ 6                  │ ||                                             │
 *   │ 5                  │ ??                                             │
 *   │ 4                  │ ? : (ternary)                                  │
 *   │ 3                  │ = += -= etc (assignment)                       │
 *   │ 1                  │ , (comma)                                      │
 *   └────────────────────┴────────────────────────────────────────────────┘
 *
 *
 * RUN: node javaScript-v8-architecture-flow/02-parsing-phase.js
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                         SIMPLE TOKENIZER DEMO
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('       PART 2: PARSING PHASE - TOKENIZATION & AST');
console.log('═'.repeat(70));

// Simple tokenizer to demonstrate the concept
function tokenize(code) {
  var tokens = [];
  var current = 0;
  var keywords = ['var', 'let', 'const', 'function', 'return', 'if', 'else'];

  while (current < code.length) {
    var char = code[current];

    // Skip whitespace
    if (/\s/.test(char)) { current++; continue; }

    // Numbers
    if (/[0-9]/.test(char)) {
      var num = '';
      while (/[0-9.]/.test(code[current])) num += code[current++];
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    // Strings
    if (char === '"' || char === "'") {
      var quote = char;
      var str = '';
      current++;
      while (code[current] !== quote) str += code[current++];
      current++;
      tokens.push({ type: 'STRING', value: str });
      continue;
    }

    // Identifiers/Keywords
    if (/[a-zA-Z_$]/.test(char)) {
      var ident = '';
      while (/[a-zA-Z0-9_$]/.test(code[current])) ident += code[current++];
      var type = keywords.includes(ident) ? 'KEYWORD' : 'IDENTIFIER';
      tokens.push({ type: type, value: ident });
      continue;
    }

    // Operators
    if ('=+-*/<>!'.includes(char)) {
      var op = char;
      current++;
      if ('='.includes(code[current])) op += code[current++];
      tokens.push({ type: 'OPERATOR', value: op });
      continue;
    }

    // Punctuators
    if ('(){}[];,.'.includes(char)) {
      tokens.push({ type: 'PUNCTUATOR', value: char });
      current++;
      continue;
    }

    current++;
  }

  return tokens;
}

// Test the tokenizer
console.log('\n1. TOKENIZATION DEMO:');
console.log('─'.repeat(40));

var code1 = 'var x = 10;';
console.log('   Code: "' + code1 + '"');
console.log('   Tokens:');
tokenize(code1).forEach(function(t, i) {
  console.log('     ' + (i+1) + '. ' + t.type.padEnd(12) + ' → ' + t.value);
});

console.log('\n2. FUNCTION TOKENIZATION:');
console.log('─'.repeat(40));

var code2 = 'function add(a, b) { return a + b; }';
console.log('   Code: "' + code2 + '"');
var tokens2 = tokenize(code2);
console.log('   Total tokens:', tokens2.length);
console.log('   Keywords:', tokens2.filter(t => t.type === 'KEYWORD').map(t => t.value).join(', '));
console.log('   Identifiers:', tokens2.filter(t => t.type === 'IDENTIFIER').map(t => t.value).join(', '));

console.log('\n3. OPERATOR PRECEDENCE DEMO:');
console.log('─'.repeat(40));
console.log('   Expression: 2 + 3 * 4');
console.log('   Result:', 2 + 3 * 4, '(* has higher precedence than +)');
console.log('   Expression: (2 + 3) * 4');
console.log('   Result:', (2 + 3) * 4, '(parentheses override precedence)');

console.log('\n' + '═'.repeat(70));
console.log('       Read the comments above for complete parsing details!');
console.log('═'.repeat(70) + '\n');
