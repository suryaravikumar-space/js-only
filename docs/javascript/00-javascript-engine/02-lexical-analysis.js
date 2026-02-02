/**
 * LESSON 02: Lexical Analysis (Tokenization) - DEEP DIVE
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STORY: THE MAIL ROOM SORTER                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   Imagine you work in a mail room. Letters arrive as one long stream of   ║
 * ║   characters on a conveyor belt. Your job is to separate them into        ║
 * ║   envelopes labeled: "Name", "Address", "Zip Code", "Stamp".             ║
 * ║                                                                            ║
 * ║   You don't care WHAT the letter says — you just sort the pieces.         ║
 * ║   That's exactly what a LEXER does with source code.                      ║
 * ║                                                                            ║
 * ║   Source code arrives as one long string. The lexer reads it character    ║
 * ║   by character and sorts pieces into TOKENS: keywords, identifiers,       ║
 * ║   numbers, operators, punctuators — the smallest units of meaning.        ║
 * ║                                                                            ║
 * ║   The lexer doesn't understand MEANING - it just identifies PIECES.       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE LEXER'S JOB - CHARACTER BY CHARACTER                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   Input String: "var x = 10;"                                              ║
 * ║                                                                            ║
 * ║   Position:  0   1   2   3   4   5   6   7   8   9   10                    ║
 * ║   Character: v   a   r   ' ' x   ' ' =   ' ' 1   0   ;                     ║
 * ║                                                                            ║
 * ║   ┌─────────────────────────────────────────────────────────────────────┐  ║
 * ║   │ Step 1: Read 'v' - Is it a letter? YES - Start collecting word      │  ║
 * ║   │ Step 2: Read 'a' - Still letter? YES - Continue: "va"               │  ║
 * ║   │ Step 3: Read 'r' - Still letter? YES - Continue: "var"              │  ║
 * ║   │ Step 4: Read ' ' - Space? YES - Stop. "var" is a KEYWORD token      │  ║
 * ║   │ Step 5: Skip the space                                              │  ║
 * ║   │ Step 6: Read 'x' - Letter? YES - Collect: "x"                       │  ║
 * ║   │ Step 7: Read ' ' - Space? YES - Stop. "x" is an IDENTIFIER token    │  ║
 * ║   │ Step 8: Skip the space                                              │  ║
 * ║   │ Step 9: Read '=' - Operator? YES - Create OPERATOR token            │  ║
 * ║   │ Step 10: Skip the space                                             │  ║
 * ║   │ Step 11: Read '1' - Digit? YES - Start collecting number            │  ║
 * ║   │ Step 12: Read '0' - Still digit? YES - Continue: "10"               │  ║
 * ║   │ Step 13: Read ';' - Not digit - Stop. "10" is NUMBER token          │  ║
 * ║   │ Step 14: ';' is PUNCTUATOR token                                    │  ║
 * ║   └─────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ║   Final Tokens:                                                            ║
 * ║   ┌──────────────────────────────────────────────────────────────────────┐ ║
 * ║   │ { type: KEYWORD,    value: "var", line: 1, column: 0  }             │ ║
 * ║   │ { type: IDENTIFIER, value: "x",   line: 1, column: 4  }             │ ║
 * ║   │ { type: OPERATOR,   value: "=",   line: 1, column: 6  }             │ ║
 * ║   │ { type: NUMBER,     value: "10",  line: 1, column: 8  }             │ ║
 * ║   │ { type: PUNCTUATOR, value: ";",   line: 1, column: 10 }             │ ║
 * ║   └──────────────────────────────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ ALL JAVASCRIPT TOKEN TYPES                                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. KEYWORDS (Reserved Words) - 64 in total                                 ║
 * ║ ─────────────────────────────────────────────────────────────────────────  ║
 * ║    Declaration:  var, let, const, function, class                          ║
 * ║    Control:      if, else, switch, case, default, break, continue          ║
 * ║    Loops:        for, while, do                                            ║
 * ║    Functions:    return, yield, async, await                               ║
 * ║    Exception:    try, catch, finally, throw                                ║
 * ║    Logical:      true, false, null, undefined                              ║
 * ║    Object:       new, this, super, delete, typeof, instanceof, in, of      ║
 * ║    Module:       import, export, default, from, as                         ║
 * ║    Reserved:     enum, implements, interface, package, private, protected  ║
 * ║                  public, static, void, with, debugger                      ║
 * ║                                                                            ║
 * ║ 2. IDENTIFIERS - Names you create                                          ║
 * ║ ─────────────────────────────────────────────────────────────────────────  ║
 * ║    Valid:   myVar, _private, $jquery, camelCase, PascalCase, CONSTANT      ║
 * ║    Invalid: 123abc (starts with number), my-var (contains hyphen)          ║
 * ║    Rules:   Start with letter, _, or $. Continue with letters, numbers, _  ║
 * ║                                                                            ║
 * ║ 3. LITERALS - Raw Values                                                   ║
 * ║ ─────────────────────────────────────────────────────────────────────────  ║
 * ║    Number:     42, 3.14, 0xFF (hex), 0o77 (octal), 0b1010 (binary)         ║
 * ║    BigInt:     123n, 9007199254740991n                                     ║
 * ║    String:     "double", 'single', `template ${expr}`                      ║
 * ║    Boolean:    true, false                                                 ║
 * ║    Null:       null                                                        ║
 * ║    Undefined:  undefined                                                   ║
 * ║    RegExp:     /pattern/flags                                              ║
 * ║    Array:      [1, 2, 3]                                                   ║
 * ║    Object:     { key: value }                                              ║
 * ║                                                                            ║
 * ║ 4. OPERATORS - 47 operators                                                ║
 * ║ ─────────────────────────────────────────────────────────────────────────  ║
 * ║    Arithmetic:   + - * / % ** ++ --                                        ║
 * ║    Assignment:   = += -= *= /= %= **= &= |= ^= <<= >>= >>>=                ║
 * ║    Comparison:   == === != !== < > <= >=                                   ║
 * ║    Logical:      && || ! ?? ?.                                             ║
 * ║    Bitwise:      & | ^ ~ << >> >>>                                         ║
 * ║    Other:        typeof instanceof in delete void , ?:                     ║
 * ║    Spread/Rest:  ...                                                       ║
 * ║    Arrow:        =>                                                        ║
 * ║                                                                            ║
 * ║ 5. PUNCTUATORS - Structural Characters                                     ║
 * ║ ─────────────────────────────────────────────────────────────────────────  ║
 * ║    Grouping:     ( ) [ ] { }                                               ║
 * ║    Separators:   ; , :                                                     ║
 * ║    Accessor:     .                                                         ║
 * ║                                                                            ║
 * ║ 6. COMMENTS (Usually discarded by lexer)                                   ║
 * ║ ─────────────────────────────────────────────────────────────────────────  ║
 * ║    Single-line:  // comment                                                ║
 * ║    Multi-line:   /* comment                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *****
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                    BUILDING A COMPLETE TOKENIZER
// ═══════════════════════════════════════════════════════════════════════════════

function createLexer(sourceCode) {
  const tokens = [];
  let current = 0;
  let line = 1;
  let column = 0;

  // Complete list of JavaScript keywords
  const keywords = [
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 
    'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 
    'false', 'finally', 'for', 'function', 'if', 'implements', 'import', 
    'in', 'instanceof', 'interface', 'let', 'new', 'null', 'package', 
    'private', 'protected', 'public', 'return', 'static', 'super', 
    'switch', 'this', 'throw', 'true', 'try', 'typeof', 'undefined', 
    'var', 'void', 'while', 'with', 'yield', 'async', 'await', 'of'
  ];
  
  // Multi-character operators (order matters - check longer ones first!)
  const multiCharOperators = [
    '>>>=', '===', '!==', '>>>', '**=', '<<=' , '>>=', '...', 
    '&&=', '||=', '??=', '==', '!=', '<=', '>=', '&&', '||', 
    '??', '**', '++', '--', '+=', '-=', '*=', '/=', '%=', 
    '&=', '|=', '^=', '<<', '>>', '=>', '?.', '<', '>'
  ];
  
  function peek(offset = 0) {
    return sourceCode[current + offset];
  }

  function advance() {
    const char = sourceCode[current];
    current++;
    column++;
    if (char === '\n') {
      line++;
      column = 0;
    }
    return char;
  }
  
  function addToken(type, value) {
    tokens.push({
      type: type,
      value: value,
      line: line,
      column: column - value.length
    });
  }
  
  function isDigit(char) {
    return char >= '0' && char <= '9';
  }
  
  function isAlpha(char) {
    return (char >= 'a' && char <= 'z') || 
           (char >= 'A' && char <= 'Z') || 
           char === '_' || char === '$';
  }
  
  function isAlphaNumeric(char) {
    return isAlpha(char) || isDigit(char);
  }
  
  function readString(quote) {
    let value = '';
    advance(); // skip opening quote

    while (peek() !== quote && current < sourceCode.length) {
      if (peek() === '\\') {
        advance(); // skip backslash
        const escaped = advance();
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          case "'": value += "'"; break;
          default: value += escaped;
        }
      } else {
        value += advance();
      }
    }
    
    if (current >= sourceCode.length) {
      throw new Error(`Unterminated string at line ${line}`);
    }
    
    advance(); // skip closing quote
    return value;
  }
  
  function readNumber() {
    let value = '';
    let hasDecimal = false;

    // Check for hex, octal, binary
    if (peek() === '0' && peek(1)) {
      const nextChar = peek(1).toLowerCase();
      if (nextChar === 'x') {
        value += advance() + advance(); // '0x'
        while (/[0-9a-fA-F]/.test(peek())) value += advance();
        return value;
      } else if (nextChar === 'o') {
        value += advance() + advance(); // '0o'
        while (/[0-7]/.test(peek())) value += advance();
        return value;
      } else if (nextChar === 'b') {
        value += advance() + advance(); // '0b'
        while (/[01]/.test(peek())) value += advance();
        return value;
      }
    }
    
    while (isDigit(peek()) || peek() === '.') {
      if (peek() === '.') {
        if (hasDecimal) break; // Second decimal - stop
        hasDecimal = true;
      }
      value += advance();
    }
    
    // Scientific notation
    if (peek() === 'e' || peek() === 'E') {
      value += advance();
      if (peek() === '+' || peek() === '-') value += advance();
      while (isDigit(peek())) value += advance();
    }
    
    // BigInt suffix
    if (peek() === 'n') {
      value += advance();
    }
    
    return value;
  }
  
  function readIdentifier() {
    let value = '';
    while (isAlphaNumeric(peek()) && current < sourceCode.length) {
      value += advance();
    }
    return value;
  }
  
  function readOperator() {
    // Try to match multi-character operators first (longest match wins)
    for (const op of multiCharOperators) {
      const match = [...op].every((char, j) => peek(j) === char);
      if (match) {
        for (let k = 0; k < op.length; k++) advance();
        return op;
      }
    }

    // Single character operator
    return advance();
  }
  
  function skipWhitespace() {
    while (current < sourceCode.length) {
      const char = peek();
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        advance();
      } else if (char === '/' && peek(1) === '/') {
        // Single-line comment
        while (peek() !== '\n' && current < sourceCode.length) {
          advance();
        }
      } else if (char === '/' && peek(1) === '*') {
        // Multi-line comment
        advance(); advance(); // skip /*
        while (!(peek() === '*' && peek(1) === '/') && current < sourceCode.length) {
          advance();
        }
        advance(); advance(); // skip */
      } else {
        break;
      }
    }
  }
  
  // Main lexer loop
  while (current < sourceCode.length) {
    skipWhitespace();
    
    if (current >= sourceCode.length) break;
    
    const char = peek();

    // String
    if (char === '"' || char === "'") {
      const str = readString(char);
      addToken('STRING', str);
      continue;
    }
    
    // Template literal (simplified - doesn't handle expressions)
    if (char === '`') {
      advance();
      let template = '';
      while (peek() !== '`' && current < sourceCode.length) {
        template += advance();
      }
      advance();
      addToken('TEMPLATE', template);
      continue;
    }
    
    // Number
    if (isDigit(char) || (char === '.' && isDigit(peek(1)))) {
      const num = readNumber();
      addToken('NUMBER', num);
      continue;
    }
    
    // Identifier or Keyword
    if (isAlpha(char)) {
      const ident = readIdentifier();
      const type = keywords.includes(ident) ? 'KEYWORD' : 'IDENTIFIER';
      addToken(type, ident);
      continue;
    }
    
    // Operators
    if ('=+-*/%<>!&|^~?:.'.includes(char)) {
      const op = readOperator();
      addToken('OPERATOR', op);
      continue;
    }
    
    // Punctuators
    if ('(){}[];,'.includes(char)) {
      addToken('PUNCTUATOR', advance());
      continue;
    }
    
    // RegExp (simplified detection)
    if (char === '/') {
      // This is a simplified check - real engines are more complex
      const op = readOperator();
      addToken('OPERATOR', op);
      continue;
    }
    
    // Unknown character
    throw new Error(`Unexpected character "${char}" at line ${line}, column ${column}`);
  }
  
  addToken('EOF', '');
  return tokens;
}

// Format tokens for display (ES6: arrow function, template literal)
const formatTokens = (tokens) => {
  return tokens.map(t =>
    `${t.type.padEnd(12)} │ ${String(t.value).padEnd(15)} │ L${t.line}:C${t.column}`
  ).join('\n');
};

// ═══════════════════════════════════════════════════════════════════════════════
//                              TEST CASES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('TEST A: Simple Variable Declaration');
console.log('═'.repeat(70));
const code1 = 'var x = 10;';
console.log(`Input: "${code1}"`);
console.log('─'.repeat(70));
console.log(formatTokens(createLexer(code1)));
console.log();

console.log('═'.repeat(70));
console.log('TEST B: Function with Multiple Data Types');
console.log('═'.repeat(70));
const code2 = 'function greet(name) { return "Hello " + name; }';
console.log(`Input: "${code2}"`);
console.log('─'.repeat(70));
const tokens2 = createLexer(code2);
console.log(`Total tokens: ${tokens2.length}`);
console.log(`Keywords: ${tokens2.filter(t => t.type === 'KEYWORD').map(t => t.value).join(', ')}`);
console.log(`Identifiers: ${tokens2.filter(t => t.type === 'IDENTIFIER').map(t => t.value).join(', ')}`);
console.log();

console.log('═'.repeat(70));
console.log('TEST C: All Number Formats (ES6: 0o octal, 0b binary, BigInt n)');
console.log('═'.repeat(70));
const code3 = 'const decimal = 42; const hex = 0xFF; const octal = 0o77; const binary = 0b1010; const bigint = 123n; const float = 3.14; const scientific = 1e10;';
console.log(`Input: ${code3.substring(0, 50)}...`);
console.log('─'.repeat(70));
const tokens3 = createLexer(code3);
console.log(`Numbers found: ${tokens3.filter(t => t.type === 'NUMBER').map(t => t.value).join(', ')}`);
console.log();

console.log('═'.repeat(70));
console.log('TEST D: All Comparison Operators');
console.log('═'.repeat(70));
const code4 = 'a == b; a === b; a != b; a !== b; a < b; a > b; a <= b; a >= b;';
console.log(`Input: "${code4}"`);
console.log('─'.repeat(70));
const tokens4 = createLexer(code4);
console.log(`Operators found: ${tokens4.filter(t => t.type === 'OPERATOR').map(t => t.value).join(', ')}`);
console.log();

console.log('═'.repeat(70));
console.log('TEST E: ES6+ Features (arrow =>, async/await, ?., ??)');
console.log('═'.repeat(70));
const code5 = 'const fn = async () => { await fetch(); }; const x = obj?.prop ?? fallback;';
console.log(`Input: "${code5}"`);
console.log('─'.repeat(70));
const tokens5 = createLexer(code5);
console.log(`Keywords: ${tokens5.filter(t => t.type === 'KEYWORD').map(t => t.value).join(', ')}`);
console.log(`Operators: ${tokens5.filter(t => t.type === 'OPERATOR').map(t => t.value).join(', ')}`);
console.log();

console.log('═'.repeat(70));
console.log('TEST F: String Escape Sequences');
console.log('═'.repeat(70));
const code6 = 'const msg = "Hello\\nWorld\\tTab";';
console.log(`Input: "${code6}"`);
console.log('─'.repeat(70));
const tokens6 = createLexer(code6);
console.log(`String value: ${JSON.stringify(tokens6.find(t => t.type === 'STRING').value)}`);
console.log();

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP: HOW V8 TOKENIZES YOUR CODE                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  1. V8's Scanner class (src/parsing/scanner.cc) handles tokenization       ║
 * ║                                                                            ║
 * ║  2. It uses a "lookahead" system:                                          ║
 * ║     - current_ : The current token being processed                         ║
 * ║     - next_    : The next token (one token lookahead)                      ║
 * ║                                                                            ║
 * ║  3. The scanner maintains:                                                 ║
 * ║     - Position in source                                                   ║
 * ║     - Line number (for error messages)                                     ║
 * ║     - Current token type and value                                         ║
 * ║                                                                            ║
 * ║  4. Special handling for:                                                  ║
 * ║     - Template literals (with embedded expressions)                        ║
 * ║     - Regular expressions (context-dependent)                              ║
 * ║     - Unicode escapes (\u{1F600})                                          ║
 * ║     - Automatic Semicolon Insertion (ASI)                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ LEXICAL ERRORS - WHAT CAN GO WRONG                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  1. UNTERMINATED STRING                                                    ║
 * ║     var x = "hello;                                                        ║
 * ║     Error: Unterminated string literal                                     ║
 * ║                                                                            ║
 * ║  2. INVALID CHARACTER                                                      ║
 * ║     var x = @value;                                                        ║
 * ║     Error: Unexpected character '@'                                        ║
 * ║                                                                            ║
 * ║  3. INVALID NUMBER                                                         ║
 * ║     var x = 123abc;                                                        ║
 * ║     Error: Identifier starts immediately after numeric literal             ║
 * ║                                                                            ║
 * ║  4. INVALID ESCAPE                                                         ║
 * ║     var x = "\z";                                                          ║
 * ║     Error: Invalid escape sequence (in strict mode)                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW QUESTIONS                                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Q1: "What is tokenization in JavaScript?"                                 ║
 * ║                                                                            ║
 * ║ A: Tokenization (lexical analysis) is the first phase of code processing  ║
 * ║    where the source code string is broken into tokens — the smallest      ║
 * ║    meaningful units like keywords (const, function), identifiers (myVar), ║
 * ║    operators (+, ===), numbers, strings, and punctuators ({, ;).          ║
 * ║    The lexer reads character by character, grouping them into tokens       ║
 * ║    without understanding grammar or structure.                            ║
 * ║                                                                            ║
 * ║ Q2: "Can the tokenizer catch all syntax errors?"                          ║
 * ║                                                                            ║
 * ║ A: No. The tokenizer only catches lexical errors like unterminated        ║
 * ║    strings ("hello), invalid characters (@), or malformed numbers         ║
 * ║    (123abc). Grammar errors like `var = 10;` produce valid tokens but     ║
 * ║    are caught by the parser, which checks structure and grammar.          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ Q3: What's the difference between Lexer and Parser?                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  LEXER (Tokenizer/Scanner):                                                ║
 * ║  - Input: Source code (string)                                             ║
 * ║  - Output: Stream of tokens                                                ║
 * ║  - Handles: Characters, whitespace, keywords, literals                     ║
 * ║  - Errors: Invalid characters, unterminated strings                        ║
 * ║                                                                            ║
 * ║  PARSER:                                                                   ║
 * ║  - Input: Stream of tokens                                                 ║
 * ║  - Output: Abstract Syntax Tree (AST)                                      ║
 * ║  - Handles: Grammar, structure, nesting                                    ║
 * ║  - Errors: Unexpected token, missing parenthesis                           ║
 * ║                                                                            ║
 * ║  Example:                                                                  ║
 * ║    "var = 10;"                                                             ║
 * ║    Lexer: SUCCESS - produces [KEYWORD:var, OPERATOR:=, NUMBER:10, ...]     ║
 * ║    Parser: FAIL - "var" must be followed by identifier, not "="            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/00-javascript-engine/02-lexical-analysis.js
 */
