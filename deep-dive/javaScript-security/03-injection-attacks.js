/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT SECURITY - Injection Attacks Prevention
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Injection attacks occur when untrusted data is sent to an interpreter as
 * part of a command or query. This covers SQL, NoSQL, Command, LDAP injections.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    INJECTION ATTACK TYPES                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  INJECTION ATTACK TREE                          │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │                         INJECTION                                        │
 * │                             │                                            │
 * │         ┌───────────────────┼───────────────────┐                       │
 * │         ▼                   ▼                   ▼                       │
 * │   ┌──────────┐        ┌──────────┐        ┌──────────┐                  │
 * │   │   SQL    │        │ Command  │        │  NoSQL   │                  │
 * │   │Injection │        │Injection │        │Injection │                  │
 * │   └──────────┘        └──────────┘        └──────────┘                  │
 * │         │                   │                   │                       │
 * │         ▼                   ▼                   ▼                       │
 * │   - Authentication    - RCE            - MongoDB query                  │
 * │     bypass           - File access      manipulation                    │
 * │   - Data theft       - System takeover - Authentication                 │
 * │   - Data modification                    bypass                         │
 * │                                                                          │
 * │   ┌──────────┐        ┌──────────┐        ┌──────────┐                  │
 * │   │  LDAP    │        │  Header  │        │   Path   │                  │
 * │   │Injection │        │Injection │        │Traversal │                  │
 * │   └──────────┘        └──────────┘        └──────────┘                  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SQL INJECTION                                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Vulnerable Query:                                                      │
 * │   SELECT * FROM users WHERE username = '" + input + "'                  │
 * │                                                                          │
 * │   Attacker Input: ' OR '1'='1' --                                       │
 * │                                                                          │
 * │   Resulting Query:                                                       │
 * │   SELECT * FROM users WHERE username = '' OR '1'='1' --'                │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                SQL INJECTION TYPES                              │   │
 * │   ├────────────────────┬────────────────────────────────────────────┤   │
 * │   │ In-band            │ Error-based, Union-based                   │   │
 * │   │ Blind              │ Boolean-based, Time-based                  │   │
 * │   │ Out-of-band        │ DNS, HTTP requests                         │   │
 * │   │ Second-order       │ Stored then executed later                 │   │
 * │   └────────────────────┴────────────────────────────────────────────┘   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           SQL INJECTION PREVENTION");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// VULNERABLE: String Concatenation
// ============================================================================
function vulnerableSQLQuery(username, password) {
    // NEVER DO THIS!
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log("❌ VULNERABLE Query:");
    console.log(`   ${query}\n`);

    // Attack: username = "admin'--", password = "anything"
    // Result: SELECT * FROM users WHERE username = 'admin'--' AND password = 'anything'
    // The -- comments out the password check!

    return query;
}

// ============================================================================
// SECURE: Parameterized Queries (MySQL example)
// ============================================================================
function secureSQLQuery(username, password) {
    // Using parameterized queries (prepared statements)
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const params = [username, password];

    console.log("✅ SECURE Parameterized Query:");
    console.log(`   Query: ${query}`);
    console.log(`   Params: ${JSON.stringify(params)}\n`);

    // mysql.execute(query, params);
    return { query, params };
}

// ============================================================================
// SECURE: PostgreSQL Parameterized Query
// ============================================================================
function securePostgresQuery(userId) {
    const query = 'SELECT * FROM orders WHERE user_id = $1 AND status = $2';
    const params = [userId, 'active'];

    console.log("✅ SECURE PostgreSQL Query:");
    console.log(`   Query: ${query}`);
    console.log(`   Params: ${JSON.stringify(params)}\n`);

    // pool.query(query, params);
    return { query, params };
}

// ============================================================================
// SECURE: Query Builder (Knex.js example)
// ============================================================================
function secureQueryBuilder(filters) {
    // Query builders automatically parameterize
    const queryExample = `
    // Knex.js automatically prevents SQL injection
    const users = await knex('users')
        .where('username', filters.username)
        .where('status', 'active')
        .select('id', 'username', 'email');

    // With dynamic conditions
    let query = knex('products').select('*');

    if (filters.category) {
        query = query.where('category', filters.category);
    }
    if (filters.minPrice) {
        query = query.where('price', '>=', filters.minPrice);
    }

    const products = await query;
    `;

    console.log("✅ SECURE Query Builder (Knex.js):");
    console.log("   Query builders automatically escape values");
    return queryExample;
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    NOSQL INJECTION                                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   MongoDB query operators can be injected:                              │
 * │                                                                          │
 * │   Normal: { username: "admin", password: "secret" }                     │
 * │                                                                          │
 * │   Attack: { username: "admin", password: { "$ne": "" } }                │
 * │   Result: Returns admin without correct password!                       │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │             DANGEROUS MONGODB OPERATORS                         │   │
 * │   ├───────────────┬─────────────────────────────────────────────────┤   │
 * │   │ $ne           │ Not equal (bypass password check)               │   │
 * │   │ $gt, $gte     │ Greater than (bypass comparisons)               │   │
 * │   │ $lt, $lte     │ Less than                                       │   │
 * │   │ $regex        │ Pattern matching (information leak)             │   │
 * │   │ $where        │ JavaScript execution (RCE risk!)                │   │
 * │   │ $exists       │ Field existence check                           │   │
 * │   └───────────────┴─────────────────────────────────────────────────┘   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           NOSQL INJECTION PREVENTION");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// VULNERABLE: Direct Object from Request
// ============================================================================
function vulnerableMongoQuery(reqBody) {
    // NEVER DO THIS!
    // If reqBody = { username: "admin", password: { "$ne": "" } }
    // This bypasses authentication!

    const query = { username: reqBody.username, password: reqBody.password };
    console.log("❌ VULNERABLE MongoDB Query:");
    console.log(`   ${JSON.stringify(query)}`);

    // db.users.findOne(query);
    return query;
}

// ============================================================================
// SECURE: Type Checking and Sanitization
// ============================================================================
function secureMongoQuery(username, password) {
    // Ensure values are strings, not objects
    if (typeof username !== 'string' || typeof password !== 'string') {
        throw new Error('Invalid input types');
    }

    // Sanitize: Remove any MongoDB operators
    const sanitizedUsername = username.replace(/\$/g, '');
    const sanitizedPassword = password.replace(/\$/g, '');

    const query = { username: sanitizedUsername, password: sanitizedPassword };
    console.log("✅ SECURE MongoDB Query (type checked):");
    console.log(`   ${JSON.stringify(query)}\n`);

    return query;
}

// ============================================================================
// MongoDB Sanitization Library
// ============================================================================
class MongoSanitizer {
    // Remove all keys starting with $
    static sanitize(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitize(item));
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            // Skip keys starting with $
            if (key.startsWith('$')) {
                console.log(`⚠️  Removed suspicious key: ${key}`);
                continue;
            }

            // Recursively sanitize nested objects
            sanitized[key] = this.sanitize(value);
        }

        return sanitized;
    }

    // Validate that value is primitive
    static ensurePrimitive(value) {
        const type = typeof value;
        if (!['string', 'number', 'boolean'].includes(type)) {
            throw new Error(`Expected primitive, got ${type}`);
        }
        return value;
    }
}

// ============================================================================
// Mongoose Schema Validation
// ============================================================================
const mongooseSchemaExample = `
// Mongoose schemas enforce types and prevent injection
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_]+$/  // Whitelist characters
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[\\w.-]+@[\\w.-]+\\.\\w+$/.test(v),
            message: 'Invalid email format'
        }
    }
});

// This automatically rejects non-string values
const user = await User.findOne({
    username: req.body.username,  // Schema ensures this is a string
    password: hashedPassword
});
`;

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    COMMAND INJECTION                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Command injection executes arbitrary OS commands                      │
 * │                                                                          │
 * │   Vulnerable:                                                            │
 * │   exec('ping ' + userInput);                                            │
 * │                                                                          │
 * │   Attack: userInput = "127.0.0.1; rm -rf /"                             │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │             DANGEROUS NODE.JS FUNCTIONS                         │   │
 * │   ├────────────────────────────────────────────────────────────────┤   │
 * │   │ child_process.exec()     - Shell command execution             │   │
 * │   │ child_process.execSync() - Synchronous shell execution         │   │
 * │   │ eval()                   - JavaScript code execution           │   │
 * │   │ new Function()           - Dynamic function creation           │   │
 * │   │ vm.runInContext()        - VM code execution                   │   │
 * │   └────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   Shell Metacharacters to Block:                                        │
 * │   ; | & $ > < ` \ ! { } [ ] ( ) # ~ = * ?                              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           COMMAND INJECTION PREVENTION");
console.log("═══════════════════════════════════════════════════════════════\n");

const { execFile, spawn } = require('child_process');

// ============================================================================
// VULNERABLE: exec with user input
// ============================================================================
function vulnerableCommandExec(filename) {
    // NEVER DO THIS!
    // const { exec } = require('child_process');
    // exec('cat /uploads/' + filename);

    // Attack: filename = "file.txt; cat /etc/passwd"
    // Attack: filename = "file.txt && rm -rf /"

    console.log("❌ VULNERABLE Command:");
    console.log(`   exec('cat /uploads/${filename}')\n`);
}

// ============================================================================
// SECURE: execFile with arguments array
// ============================================================================
function secureCommandExec(filename) {
    // Validate filename first
    if (!/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(filename)) {
        console.log("❌ Invalid filename rejected:", filename);
        return;
    }

    // Use execFile instead of exec
    // Arguments are passed as array, not string
    console.log("✅ SECURE Command (execFile with validation):");
    console.log(`   execFile('cat', ['/uploads/${filename}'])`);

    // execFile('cat', ['/uploads/' + filename], (error, stdout) => {
    //     if (error) throw error;
    //     console.log(stdout);
    // });
}

// ============================================================================
// SECURE: spawn with arguments array
// ============================================================================
function secureSpawn(ip) {
    // Validate IP address format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
        console.log("❌ Invalid IP rejected:", ip);
        return null;
    }

    // Use spawn with argument array
    console.log("✅ SECURE Command (spawn):");
    console.log(`   spawn('ping', ['-c', '4', '${ip}'])\n`);

    // const ping = spawn('ping', ['-c', '4', ip]);
    // ping.stdout.on('data', (data) => console.log(data.toString()));

    return { command: 'ping', args: ['-c', '4', ip] };
}

// ============================================================================
// Shell Argument Escaping (if exec is absolutely necessary)
// ============================================================================
function shellEscape(arg) {
    // Escape shell special characters
    return `'${arg.replace(/'/g, "'\\''")}'`;
}

function saferExec(filename) {
    // Still prefer execFile, but if exec is necessary:
    const escapedFilename = shellEscape(filename);
    console.log("⚠️  Shell-escaped argument:", escapedFilename);

    // exec(`cat ${escapedFilename}`);
    return escapedFilename;
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PATH TRAVERSAL                                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Attacker reads/writes files outside intended directory                │
 * │                                                                          │
 * │   Vulnerable:                                                            │
 * │   const filepath = '/uploads/' + req.params.filename;                   │
 * │   fs.readFile(filepath);                                                │
 * │                                                                          │
 * │   Attack: filename = "../../../etc/passwd"                              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           PATH TRAVERSAL PREVENTION");
console.log("═══════════════════════════════════════════════════════════════\n");

const path = require('path');

// ============================================================================
// VULNERABLE: Direct path concatenation
// ============================================================================
function vulnerablePathAccess(userPath) {
    // NEVER DO THIS!
    const filepath = '/uploads/' + userPath;
    console.log("❌ VULNERABLE Path:", filepath);

    // Attack: userPath = "../../../etc/passwd"
    // Result: /uploads/../../../etc/passwd -> /etc/passwd
}

// ============================================================================
// SECURE: Path normalization and validation
// ============================================================================
function securePathAccess(userPath) {
    const UPLOADS_DIR = '/uploads';

    // Normalize the path (resolves .., ., etc.)
    const normalizedPath = path.normalize(userPath);

    // Remove any leading/trailing slashes and dots
    const sanitized = normalizedPath.replace(/^[./\\]+/, '');

    // Join with base directory
    const fullPath = path.join(UPLOADS_DIR, sanitized);

    // CRITICAL: Verify the result is still within uploads directory
    const resolvedPath = path.resolve(fullPath);

    if (!resolvedPath.startsWith(UPLOADS_DIR)) {
        console.log("❌ Path traversal attempt blocked!");
        console.log(`   Attempted: ${userPath}`);
        console.log(`   Resolved: ${resolvedPath}`);
        return null;
    }

    console.log("✅ SECURE Path Access:");
    console.log(`   Input: ${userPath}`);
    console.log(`   Resolved: ${resolvedPath}\n`);

    return resolvedPath;
}

// ============================================================================
// Complete File Access Validator
// ============================================================================
class SecureFileAccess {
    constructor(baseDir) {
        this.baseDir = path.resolve(baseDir);
    }

    // Validate and resolve path
    resolvePath(userInput) {
        // Remove null bytes (poison null byte attack)
        const sanitized = userInput.replace(/\0/g, '');

        // Normalize and resolve
        const fullPath = path.resolve(this.baseDir, sanitized);

        // Verify within base directory
        if (!fullPath.startsWith(this.baseDir)) {
            throw new Error('Access denied: path outside base directory');
        }

        return fullPath;
    }

    // Safe read
    async read(userInput) {
        const safePath = this.resolvePath(userInput);
        // return fs.readFile(safePath);
        return { path: safePath, operation: 'read' };
    }

    // Safe write
    async write(userInput, content) {
        const safePath = this.resolvePath(userInput);

        // Additional check: only allow certain extensions
        const allowedExtensions = ['.txt', '.json', '.csv'];
        const ext = path.extname(safePath);

        if (!allowedExtensions.includes(ext)) {
            throw new Error(`File extension not allowed: ${ext}`);
        }

        // return fs.writeFile(safePath, content);
        return { path: safePath, operation: 'write' };
    }
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    HEADER INJECTION                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   CRLF Injection: Adding newlines to inject additional headers          │
 * │                                                                          │
 * │   Vulnerable:                                                            │
 * │   res.setHeader('Location', userInput);                                 │
 * │                                                                          │
 * │   Attack: userInput = "https://good.com\r\nSet-Cookie: evil=value"      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           HEADER INJECTION PREVENTION");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// VULNERABLE: Direct header value from user
// ============================================================================
function vulnerableHeaderSet(redirectUrl) {
    // NEVER DO THIS!
    // res.setHeader('Location', redirectUrl);

    // Attack: "https://site.com\r\nSet-Cookie: admin=true"
    console.log("❌ VULNERABLE Header:");
    console.log(`   Location: ${redirectUrl}\n`);
}

// ============================================================================
// SECURE: Header value sanitization
// ============================================================================
function sanitizeHeaderValue(value) {
    // Remove any CRLF characters
    return String(value)
        .replace(/[\r\n]/g, '')
        .replace(/%0[aAdD]/gi, '');  // URL-encoded newlines
}

function secureHeaderSet(redirectUrl) {
    // Validate URL
    try {
        const url = new URL(redirectUrl);

        // Only allow specific hosts
        const allowedHosts = ['mysite.com', 'www.mysite.com'];
        if (!allowedHosts.includes(url.hostname)) {
            console.log("❌ Redirect to untrusted host blocked");
            return null;
        }

        // Sanitize header value
        const sanitized = sanitizeHeaderValue(url.href);

        console.log("✅ SECURE Header:");
        console.log(`   Location: ${sanitized}\n`);

        // res.setHeader('Location', sanitized);
        return sanitized;
    } catch {
        console.log("❌ Invalid URL");
        return null;
    }
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    TEMPLATE INJECTION                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Server-Side Template Injection (SSTI) can lead to RCE                 │
 * │                                                                          │
 * │   Vulnerable (EJS, Pug, etc.):                                          │
 * │   res.render('template', { message: userInput });                       │
 * │                                                                          │
 * │   If template has: <%= message %>                                       │
 * │   And userInput = "<%- process.mainModule.require('child_process')      │
 * │                     .execSync('whoami') %>"                             │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Template Injection Prevention
// ============================================================================
function safeTemplateRendering() {
    const rules = `
    TEMPLATE INJECTION PREVENTION:

    1. Use auto-escaping templates (enabled by default in modern frameworks)
       - React, Vue, Angular auto-escape by default
       - EJS with <%= %> escapes (not <%- %>)

    2. Never render user input as template code
       ❌ res.render('template', { content: userProvidedTemplate })
       ❌ Mustache.render(userInput, data)

    3. Sandbox template rendering
       - Use vm2 or isolated-vm for untrusted templates

    4. Disable dangerous template features
       - EJS: { rmWhitespace: false, strict: true }
       - Pug: disable mixin/include from user input
    `;

    console.log(rules);
}

// ============================================================================
// Injection Prevention Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           INJECTION PREVENTION CHEAT SHEET                      ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  SQL INJECTION:                                                  ║");
console.log("║  • Always use parameterized queries / prepared statements       ║");
console.log("║  • Use ORMs and query builders (Knex, Sequelize, TypeORM)       ║");
console.log("║  • Never concatenate user input into queries                    ║");
console.log("║                                                                  ║");
console.log("║  NOSQL INJECTION:                                                ║");
console.log("║  • Validate input types (ensure strings are strings)            ║");
console.log("║  • Remove $ prefixed keys from user objects                     ║");
console.log("║  • Use Mongoose schemas for validation                          ║");
console.log("║                                                                  ║");
console.log("║  COMMAND INJECTION:                                              ║");
console.log("║  • Use execFile/spawn with arguments array, not exec            ║");
console.log("║  • Whitelist allowed commands and arguments                     ║");
console.log("║  • Validate and sanitize all user input                         ║");
console.log("║                                                                  ║");
console.log("║  PATH TRAVERSAL:                                                 ║");
console.log("║  • Normalize paths and verify within base directory             ║");
console.log("║  • Remove null bytes and dangerous sequences                    ║");
console.log("║  • Use path.resolve() and check prefix                          ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

// ============================================================================
// Demo Execution
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           INJECTION PREVENTION DEMONSTRATIONS");
console.log("═══════════════════════════════════════════════════════════════\n");

// SQL Injection
console.log("─── SQL Injection ───");
vulnerableSQLQuery("admin'--", "anything");
secureSQLQuery("admin", "password123");
securePostgresQuery(123);

// NoSQL Injection
console.log("─── NoSQL Injection ───");
vulnerableMongoQuery({ username: "admin", password: { "$ne": "" } });
secureMongoQuery("admin", "password123");

console.log("\nMongoDB Sanitizer:");
const maliciousQuery = { username: "admin", password: { "$ne": "", "$gt": "" } };
console.log("Input:", JSON.stringify(maliciousQuery));
console.log("Sanitized:", JSON.stringify(MongoSanitizer.sanitize(maliciousQuery)));

// Command Injection
console.log("\n─── Command Injection ───");
vulnerableCommandExec("file.txt; rm -rf /");
secureCommandExec("document.pdf");
secureSpawn("192.168.1.1");
secureSpawn("127.0.0.1; cat /etc/passwd");

// Path Traversal
console.log("─── Path Traversal ───");
vulnerablePathAccess("../../../etc/passwd");
securePathAccess("../../../etc/passwd");
securePathAccess("document.pdf");

// Header Injection
console.log("─── Header Injection ───");
vulnerableHeaderSet("https://site.com\r\nSet-Cookie: admin=true");
secureHeaderSet("https://mysite.com/page");
secureHeaderSet("https://evil.com/phishing");

module.exports = {
    secureSQLQuery,
    secureMongoQuery,
    MongoSanitizer,
    secureCommandExec,
    secureSpawn,
    SecureFileAccess,
    securePathAccess,
    sanitizeHeaderValue
};

console.log("\n═══ Next: Prototype Pollution ═══");
console.log("Run: node deep-dive/javaScript-security/04-prototype-pollution.js");
