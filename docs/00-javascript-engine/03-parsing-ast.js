/**
 * LESSON 03: Parsing and Abstract Syntax Tree (AST) - DEEP DIVE
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ The PARSER takes the stream of tokens from the lexer and builds an         ║
 * ║ ABSTRACT SYNTAX TREE (AST) - a tree representation of code structure.      ║
 * ║                                                                            ║
 * ║ Tokens: [var] [x] [=] [10] [+] [5] [;]                                      ║
 * ║                        ↓                                                   ║
 * ║                     PARSER                                                 ║
 * ║                        ↓                                                   ║
 * ║                 VariableDeclaration                                        ║
 * ║                        │                                                   ║
 * ║                VariableDeclarator                                          ║
 * ║                   /         \                                              ║
 * ║             Identifier    BinaryExpression                                 ║
 * ║               "x"           /    |    \                                    ║
 * ║                       Literal  "+"  Literal                                ║
 * ║                         10            5                                    ║
 * ║                                                                            ║
 * ║ The AST captures the MEANING/STRUCTURE, not just the text.                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHY AST? WHY NOT JUST USE TOKENS?                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Tokens are LINEAR: [var] [x] [=] [10] [+] [5] [;]                          ║
 * ║ - No hierarchy or structure                                                ║
 * ║ - Can't tell operator precedence                                           ║
 * ║ - Can't tell scope or nesting                                              ║
 * ║                                                                            ║
 * ║ AST is HIERARCHICAL:                                                       ║
 * ║ - Shows that "+" operates on 10 and 5                                      ║
 * ║ - Shows the result is assigned to x                                        ║
 * ║ - Shows this is a variable declaration                                     ║
 * ║                                                                            ║
 * ║ Consider: "2 + 3 * 4"                                                      ║
 * ║                                                                            ║
 * ║ Without AST (wrong):     With AST (correct):                               ║
 * ║       +                        +                                           ║
 * ║      / \                      / \                                          ║
 * ║     2   3                    2   *                                         ║
 * ║         |                       / \                                        ║
 * ║         * ← wrong!             3   4  ← * has higher precedence            ║
 * ║         |                                                                  ║
 * ║         4                                                                  ║
 * ║                                                                            ║
 * ║ AST correctly represents: 2 + (3 * 4) = 14, not (2 + 3) * 4 = 20           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ AST NODE TYPES IN JAVASCRIPT (ESTree Specification)                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ PROGRAM STRUCTURE:                                                         ║
 * ║ ─────────────────                                                          ║
 * ║   Program              Root node containing all code                       ║
 * ║   BlockStatement       { ... } block of statements                         ║
 * ║   EmptyStatement       ; (just a semicolon)                                ║
 * ║   ExpressionStatement  Any expression used as statement                    ║
 * ║                                                                            ║
 * ║ DECLARATIONS:                                                              ║
 * ║ ─────────────                                                              ║
 * ║   VariableDeclaration  var/let/const x = value                             ║
 * ║   FunctionDeclaration  function name() { }                                 ║
 * ║   ClassDeclaration     class Name { }                                      ║
 * ║                                                                            ║
 * ║ EXPRESSIONS:                                                               ║
 * ║ ────────────                                                               ║
 * ║   Identifier           x, myVar, _private                                  ║
 * ║   Literal              42, "hello", true, null                             ║
 * ║   BinaryExpression     a + b, x * y, left OP right                         ║
 * ║   UnaryExpression      !x, -num, typeof val                                ║
 * ║   AssignmentExpression x = 10, y += 5                                      ║
 * ║   CallExpression       func(args)                                          ║
 * ║   MemberExpression     obj.prop, arr[0]                                    ║
 * ║   ConditionalExpression a ? b : c (ternary)                                ║
 * ║   ArrowFunctionExpression () => { }                                        ║
 * ║   ArrayExpression      [1, 2, 3]                                           ║
 * ║   ObjectExpression     { key: value }                                      ║
 * ║                                                                            ║
 * ║ STATEMENTS:                                                                ║
 * ║ ───────────                                                                ║
 * ║   IfStatement          if (cond) { } else { }                              ║
 * ║   ForStatement         for (init; test; update) { }                        ║
 * ║   WhileStatement       while (cond) { }                                    ║
 * ║   DoWhileStatement     do { } while (cond)                                 ║
 * ║   ReturnStatement      return value                                        ║
 * ║   ThrowStatement       throw error                                         ║
 * ║   TryStatement         try { } catch { } finally { }                       ║
 * ║   SwitchStatement      switch (val) { case: }                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                    BUILDING A SIMPLE AST PARSER
// ═══════════════════════════════════════════════════════════════════════════════

// First, let's create a simple tokenizer (from previous lesson)
function tokenize(code) {
  var tokens = [];
  var current = 0;
  var keywords = ['var', 'let', 'const', 'function', 'return', 'if', 'else', 'true', 'false', 'null'];
  
  while (current < code.length) {
    var char = code[current];
    
    if (/\s/.test(char)) { current++; continue; }
    
    if (/[0-9]/.test(char)) {
      var num = '';
      while (/[0-9.]/.test(code[current])) num += code[current++];
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }
    
    if (char === '"' || char === "'") {
      var quote = char;
      var str = '';
      current++;
      while (code[current] !== quote) str += code[current++];
      current++;
      tokens.push({ type: 'STRING', value: str });
      continue;
    }
    
    if (/[a-zA-Z_$]/.test(char)) {
      var ident = '';
      while (/[a-zA-Z0-9_$]/.test(code[current])) ident += code[current++];
      var type = keywords.includes(ident) ? 'KEYWORD' : 'IDENTIFIER';
      tokens.push({ type: type, value: ident });
      continue;
    }
    
    if ('=+-*/%<>!&|'.includes(char)) {
      var op = char;
      current++;
      if ('=<>&|'.includes(code[current])) op += code[current++];
      if (code[current] === '=' && (op === '==' || op === '!=')) op += code[current++];
      tokens.push({ type: 'OPERATOR', value: op });
      continue;
    }
    
    if ('(){}[];,.'.includes(char)) {
      tokens.push({ type: 'PUNCTUATOR', value: char });
      current++;
      continue;
    }
    
    current++;
  }
  
  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}

// Now let's build the parser
function createParser(tokens) {
  var current = 0;
  
  function peek(offset) {
    return tokens[current + (offset || 0)];
  }
  
  function consume(type, value) {
    var token = peek();
    if (type && token.type !== type) {
      throw new Error('Expected ' + type + ' but got ' + token.type);
    }
    if (value && token.value !== value) {
      throw new Error('Expected "' + value + '" but got "' + token.value + '"');
    }
    current++;
    return token;
  }
  
  function parseProgram() {
    var body = [];
    while (peek().type !== 'EOF') {
      body.push(parseStatement());
    }
    return { type: 'Program', body: body };
  }
  
  function parseStatement() {
    var token = peek();
    
    if (token.type === 'KEYWORD') {
      if (token.value === 'var' || token.value === 'let' || token.value === 'const') {
        return parseVariableDeclaration();
      }
      if (token.value === 'function') {
        return parseFunctionDeclaration();
      }
      if (token.value === 'return') {
        return parseReturnStatement();
      }
      if (token.value === 'if') {
        return parseIfStatement();
      }
    }
    
    // Expression statement
    var expr = parseExpression();
    if (peek().type === 'PUNCTUATOR' && peek().value === ';') {
      consume('PUNCTUATOR', ';');
    }
    return { type: 'ExpressionStatement', expression: expr };
  }
  
  function parseVariableDeclaration() {
    var kind = consume('KEYWORD').value; // var, let, or const
    var declarations = [];
    
    do {
      var id = consume('IDENTIFIER');
      var init = null;
      
      if (peek().type === 'OPERATOR' && peek().value === '=') {
        consume('OPERATOR', '=');
        init = parseExpression();
      }
      
      declarations.push({
        type: 'VariableDeclarator',
        id: { type: 'Identifier', name: id.value },
        init: init
      });
      
      if (peek().type === 'PUNCTUATOR' && peek().value === ',') {
        consume('PUNCTUATOR', ',');
      } else {
        break;
      }
    } while (true);
    
    if (peek().type === 'PUNCTUATOR' && peek().value === ';') {
      consume('PUNCTUATOR', ';');
    }
    
    return { type: 'VariableDeclaration', kind: kind, declarations: declarations };
  }
  
  function parseFunctionDeclaration() {
    consume('KEYWORD', 'function');
    var id = consume('IDENTIFIER');
    consume('PUNCTUATOR', '(');
    
    var params = [];
    while (peek().type !== 'PUNCTUATOR' || peek().value !== ')') {
      params.push({ type: 'Identifier', name: consume('IDENTIFIER').value });
      if (peek().type === 'PUNCTUATOR' && peek().value === ',') {
        consume('PUNCTUATOR', ',');
      }
    }
    consume('PUNCTUATOR', ')');
    
    var body = parseBlockStatement();
    
    return {
      type: 'FunctionDeclaration',
      id: { type: 'Identifier', name: id.value },
      params: params,
      body: body
    };
  }
  
  function parseBlockStatement() {
    consume('PUNCTUATOR', '{');
    var body = [];
    while (peek().type !== 'PUNCTUATOR' || peek().value !== '}') {
      body.push(parseStatement());
    }
    consume('PUNCTUATOR', '}');
    return { type: 'BlockStatement', body: body };
  }
  
  function parseReturnStatement() {
    consume('KEYWORD', 'return');
    var argument = null;
    if (peek().type !== 'PUNCTUATOR' || peek().value !== ';') {
      argument = parseExpression();
    }
    if (peek().type === 'PUNCTUATOR' && peek().value === ';') {
      consume('PUNCTUATOR', ';');
    }
    return { type: 'ReturnStatement', argument: argument };
  }
  
  function parseIfStatement() {
    consume('KEYWORD', 'if');
    consume('PUNCTUATOR', '(');
    var test = parseExpression();
    consume('PUNCTUATOR', ')');
    
    var consequent = peek().value === '{' ? parseBlockStatement() : parseStatement();
    var alternate = null;
    
    if (peek().type === 'KEYWORD' && peek().value === 'else') {
      consume('KEYWORD', 'else');
      alternate = peek().value === '{' ? parseBlockStatement() : parseStatement();
    }
    
    return { type: 'IfStatement', test: test, consequent: consequent, alternate: alternate };
  }
  
  function parseExpression() {
    return parseAssignment();
  }
  
  function parseAssignment() {
    var left = parseComparison();
    
    if (peek().type === 'OPERATOR' && peek().value === '=') {
      consume('OPERATOR', '=');
      var right = parseAssignment();
      return { type: 'AssignmentExpression', operator: '=', left: left, right: right };
    }
    
    return left;
  }
  
  function parseComparison() {
    var left = parseAdditive();
    
    while (peek().type === 'OPERATOR' && 
           ['==', '===', '!=', '!==', '<', '>', '<=', '>='].includes(peek().value)) {
      var operator = consume('OPERATOR').value;
      var right = parseAdditive();
      left = { type: 'BinaryExpression', operator: operator, left: left, right: right };
    }
    
    return left;
  }
  
  function parseAdditive() {
    var left = parseMultiplicative();
    
    while (peek().type === 'OPERATOR' && ['+', '-'].includes(peek().value)) {
      var operator = consume('OPERATOR').value;
      var right = parseMultiplicative();
      left = { type: 'BinaryExpression', operator: operator, left: left, right: right };
    }
    
    return left;
  }
  
  function parseMultiplicative() {
    var left = parseUnary();
    
    while (peek().type === 'OPERATOR' && ['*', '/', '%'].includes(peek().value)) {
      var operator = consume('OPERATOR').value;
      var right = parseUnary();
      left = { type: 'BinaryExpression', operator: operator, left: left, right: right };
    }
    
    return left;
  }
  
  function parseUnary() {
    if (peek().type === 'OPERATOR' && ['!', '-', '+'].includes(peek().value)) {
      var operator = consume('OPERATOR').value;
      var argument = parseUnary();
      return { type: 'UnaryExpression', operator: operator, prefix: true, argument: argument };
    }
    return parseCallMember();
  }
  
  function parseCallMember() {
    var object = parsePrimary();
    
    while (true) {
      if (peek().type === 'PUNCTUATOR' && peek().value === '(') {
        consume('PUNCTUATOR', '(');
        var args = [];
        while (peek().type !== 'PUNCTUATOR' || peek().value !== ')') {
          args.push(parseExpression());
          if (peek().type === 'PUNCTUATOR' && peek().value === ',') {
            consume('PUNCTUATOR', ',');
          }
        }
        consume('PUNCTUATOR', ')');
        object = { type: 'CallExpression', callee: object, arguments: args };
      } else if (peek().type === 'PUNCTUATOR' && peek().value === '.') {
        consume('PUNCTUATOR', '.');
        var property = consume('IDENTIFIER');
        object = { type: 'MemberExpression', object: object, property: { type: 'Identifier', name: property.value }, computed: false };
      } else if (peek().type === 'PUNCTUATOR' && peek().value === '[') {
        consume('PUNCTUATOR', '[');
        var property = parseExpression();
        consume('PUNCTUATOR', ']');
        object = { type: 'MemberExpression', object: object, property: property, computed: true };
      } else {
        break;
      }
    }
    
    return object;
  }
  
  function parsePrimary() {
    var token = peek();
    
    if (token.type === 'NUMBER') {
      consume('NUMBER');
      return { type: 'Literal', value: parseFloat(token.value), raw: token.value };
    }
    
    if (token.type === 'STRING') {
      consume('STRING');
      return { type: 'Literal', value: token.value, raw: '"' + token.value + '"' };
    }
    
    if (token.type === 'KEYWORD' && ['true', 'false'].includes(token.value)) {
      consume('KEYWORD');
      return { type: 'Literal', value: token.value === 'true', raw: token.value };
    }
    
    if (token.type === 'KEYWORD' && token.value === 'null') {
      consume('KEYWORD');
      return { type: 'Literal', value: null, raw: 'null' };
    }
    
    if (token.type === 'IDENTIFIER') {
      consume('IDENTIFIER');
      return { type: 'Identifier', name: token.value };
    }
    
    if (token.type === 'PUNCTUATOR' && token.value === '(') {
      consume('PUNCTUATOR', '(');
      var expr = parseExpression();
      consume('PUNCTUATOR', ')');
      return expr;
    }
    
    if (token.type === 'PUNCTUATOR' && token.value === '[') {
      consume('PUNCTUATOR', '[');
      var elements = [];
      while (peek().type !== 'PUNCTUATOR' || peek().value !== ']') {
        elements.push(parseExpression());
        if (peek().type === 'PUNCTUATOR' && peek().value === ',') {
          consume('PUNCTUATOR', ',');
        }
      }
      consume('PUNCTUATOR', ']');
      return { type: 'ArrayExpression', elements: elements };
    }
    
    throw new Error('Unexpected token: ' + token.type + ' ' + token.value);
  }
  
  return parseProgram();
}

// Helper to parse code to AST
function parse(code) {
  var tokens = tokenize(code);
  return createParser(tokens);
}

// Pretty print AST
function printAST(node, indent) {
  indent = indent || 0;
  var pad = '  '.repeat(indent);
  var result = '';
  
  if (!node) return pad + 'null\n';
  
  if (Array.isArray(node)) {
    result += pad + '[\n';
    node.forEach(function(item) {
      result += printAST(item, indent + 1);
    });
    result += pad + ']\n';
    return result;
  }
  
  if (typeof node !== 'object') {
    return pad + JSON.stringify(node) + '\n';
  }
  
  result += pad + node.type + '\n';
  
  for (var key in node) {
    if (key === 'type') continue;
    result += pad + '  ' + key + ': ';
    
    if (typeof node[key] === 'object' && node[key] !== null) {
      result += '\n' + printAST(node[key], indent + 2);
    } else {
      result += JSON.stringify(node[key]) + '\n';
    }
  }
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//                              TEST CASES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('TEST A: Simple Variable Declaration');
console.log('═'.repeat(70));
var code1 = 'var x = 10;';
console.log('Input: "' + code1 + '"');
console.log('─'.repeat(70));
console.log(printAST(parse(code1)));

console.log('═'.repeat(70));
console.log('TEST B: Binary Expression with Precedence');
console.log('═'.repeat(70));
var code2 = 'var result = 2 + 3 * 4;';
console.log('Input: "' + code2 + '"');
console.log('─'.repeat(70));
var ast2 = parse(code2);
console.log('Result shows: 2 + (3 * 4) due to operator precedence');
console.log(printAST(ast2));

console.log('═'.repeat(70));
console.log('TEST C: Function Declaration');
console.log('═'.repeat(70));
var code3 = 'function add(a, b) { return a + b; }';
console.log('Input: "' + code3 + '"');
console.log('─'.repeat(70));
console.log(printAST(parse(code3)));

console.log('═'.repeat(70));
console.log('TEST D: Function Call');
console.log('═'.repeat(70));
var code4 = 'console.log("Hello");';
console.log('Input: "' + code4 + '"');
console.log('─'.repeat(70));
console.log(printAST(parse(code4)));

console.log('═'.repeat(70));
console.log('TEST E: If Statement');
console.log('═'.repeat(70));
var code5 = 'if (x > 10) { return true; } else { return false; }';
console.log('Input: "' + code5 + '"');
console.log('─'.repeat(70));
console.log(printAST(parse(code5)));

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ OPERATOR PRECEDENCE IN JAVASCRIPT                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  The parser must handle operator precedence correctly:                     ║
 * ║                                                                            ║
 * ║  ┌────────────────────┬────────────────────────────────────────────────┐  ║
 * ║  │ Precedence (high)  │ Operators                                      │  ║
 * ║  ├────────────────────┼────────────────────────────────────────────────┤  ║
 * ║  │ 21                 │ () grouping                                    │  ║
 * ║  │ 20                 │ . [] () member/call                            │  ║
 * ║  │ 19                 │ new (with args)                                │  ║
 * ║  │ 17                 │ ! ~ + - typeof void delete (unary)             │  ║
 * ║  │ 16                 │ **  (exponentiation)                           │  ║
 * ║  │ 15                 │ * / %                                          │  ║
 * ║  │ 14                 │ + -                                            │  ║
 * ║  │ 13                 │ << >> >>>                                      │  ║
 * ║  │ 12                 │ < <= > >= in instanceof                        │  ║
 * ║  │ 11                 │ == != === !==                                  │  ║
 * ║  │ 10                 │ &                                              │  ║
 * ║  │ 9                  │ ^                                              │  ║
 * ║  │ 8                  │ |                                              │  ║
 * ║  │ 7                  │ &&                                             │  ║
 * ║  │ 6                  │ ||                                             │  ║
 * ║  │ 5                  │ ??                                             │  ║
 * ║  │ 4                  │ ? : (ternary)                                  │  ║
 * ║  │ 3                  │ = += -= etc (assignment)                       │  ║
 * ║  │ 2                  │ yield                                          │  ║
 * ║  │ 1                  │ , (comma)                                      │  ║
 * ║  └────────────────────┴────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ REAL-WORLD AST USES                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. BABEL - JavaScript Transpiler                                           ║
 * ║    Input:  const fn = () => x                                              ║
 * ║    AST manipulation converts to:                                           ║
 * ║    Output: var fn = function() { return x; }                               ║
 * ║                                                                            ║
 * ║ 2. ESLINT - Code Linter                                                    ║
 * ║    Analyzes AST to find:                                                   ║
 * ║    - Unused variables (VariableDeclarator not referenced)                  ║
 * ║    - Missing semicolons (based on statement boundaries)                    ║
 * ║    - Dangerous patterns (eval, ==, etc.)                                   ║
 * ║                                                                            ║
 * ║ 3. PRETTIER - Code Formatter                                               ║
 * ║    Parses code → AST → Regenerates with consistent formatting              ║
 * ║                                                                            ║
 * ║ 4. UGLIFY/TERSER - Minifiers                                               ║
 * ║    Uses AST to safely:                                                     ║
 * ║    - Rename variables (myLongName → a)                                     ║
 * ║    - Remove dead code                                                      ║
 * ║    - Inline constants                                                      ║
 * ║                                                                            ║
 * ║ 5. V8 Engine                                                               ║
 * ║    Uses AST to generate bytecode                                           ║
 * ║    Optimizes based on AST patterns                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PARSING ALGORITHMS                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ RECURSIVE DESCENT (What we built above)                                    ║
 * ║ ────────────────────────────────────────                                   ║
 * ║   - Top-down parsing                                                       ║
 * ║   - Each grammar rule = one function                                       ║
 * ║   - Easy to understand and implement                                       ║
 * ║   - Used by V8, most hand-written parsers                                  ║
 * ║                                                                            ║
 * ║ PRATT PARSING (Operator Precedence)                                        ║
 * ║ ────────────────────────────────────                                       ║
 * ║   - Handles operator precedence elegantly                                  ║
 * ║   - Each operator has "binding power"                                      ║
 * ║   - Used for expression parsing                                            ║
 * ║                                                                            ║
 * ║ PACKRAT PARSING                                                            ║
 * ║ ────────────────                                                           ║
 * ║   - Memoizes parsing results                                               ║
 * ║   - Avoids re-parsing same positions                                       ║
 * ║   - Guarantees linear time                                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SYNTAX ERRORS VS SEMANTIC ERRORS                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ SYNTAX ERROR (Caught by Parser):                                           ║
 * ║   var = 10;        → Unexpected token '='                                  ║
 * ║   function () { }  → Missing function name                                 ║
 * ║   if x > 10 { }    → Missing parentheses                                   ║
 * ║                                                                            ║
 * ║ SEMANTIC ERROR (Caught Later):                                             ║
 * ║   const x = 10; x = 20;  → Assignment to constant (valid syntax!)          ║
 * ║   let x; let x;          → Duplicate declaration (valid syntax!)           ║
 * ║   undefinedVar + 1       → Reference error at runtime                      ║
 * ║                                                                            ║
 * ║ The parser only checks STRUCTURE, not MEANING.                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW QUESTION: How does the parser handle "2 + 3 * 4"?                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ANSWER:                                                                    ║
 * ║                                                                            ║
 * ║ 1. The parser uses PRECEDENCE CLIMBING:                                    ║
 * ║    - parseAdditive() handles + -                                           ║
 * ║    - parseMultiplicative() handles * / %                                   ║
 * ║    - parseMultiplicative is called INSIDE parseAdditive                    ║
 * ║                                                                            ║
 * ║ 2. Execution flow:                                                         ║
 * ║    parseAdditive() called                                                  ║
 * ║    ├── parseMultiplicative() → returns Literal(2)                          ║
 * ║    ├── sees '+', consumes it                                               ║
 * ║    ├── parseMultiplicative() called for right side                         ║
 * ║    │   ├── parsePrimary() → returns Literal(3)                             ║
 * ║    │   ├── sees '*', consumes it                                           ║
 * ║    │   ├── parsePrimary() → returns Literal(4)                             ║
 * ║    │   └── returns BinaryExpression(3 * 4)                                 ║
 * ║    └── returns BinaryExpression(2 + (3*4))                                 ║
 * ║                                                                            ║
 * ║ 3. Result: * binds tighter because parseMultiplicative runs first          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/00-javascript-engine/03-parsing-ast.js
 */
