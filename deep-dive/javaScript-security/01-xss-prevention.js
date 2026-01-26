/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT SECURITY - XSS (Cross-Site Scripting) Prevention
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * XSS attacks inject malicious scripts into trusted websites, executing
 * arbitrary code in users' browsers with full access to session data.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    XSS ATTACK TYPES OVERVIEW                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                    THREE TYPES OF XSS                           │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   1. STORED XSS (Persistent)                                            │
 * │   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
 * │   │ Attacker │───►│  Server  │───►│ Database │───►│  Victim  │         │
 * │   │  Posts   │    │  Saves   │    │  Stores  │    │  Views   │         │
 * │   │  Script  │    │  Data    │    │  Script  │    │  Page    │         │
 * │   └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
 * │                                                                          │
 * │   2. REFLECTED XSS (Non-Persistent)                                     │
 * │   ┌──────────┐    ┌──────────┐    ┌──────────┐                          │
 * │   │ Attacker │───►│  Victim  │───►│  Server  │──┐                       │
 * │   │  Crafts  │    │  Clicks  │    │ Reflects │  │                       │
 * │   │   URL    │    │   Link   │    │  Script  │  │                       │
 * │   └──────────┘    └──────────┘    └──────────┘  │                       │
 * │                          ▲                       │                       │
 * │                          └───────────────────────┘                       │
 * │                            Script Executes                               │
 * │                                                                          │
 * │   3. DOM-BASED XSS (Client-Side)                                        │
 * │   ┌──────────┐    ┌──────────┐    ┌──────────┐                          │
 * │   │ Attacker │───►│  Victim  │───►│  Client  │                          │
 * │   │  Crafts  │    │  Opens   │    │   JS     │                          │
 * │   │   URL    │    │   Page   │    │ Executes │                          │
 * │   └──────────┘    └──────────┘    └──────────┘                          │
 * │                                   No Server!                             │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    VULNERABLE CODE EXAMPLES                              │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// VULNERABLE: innerHTML with user input
// ============================================================================
function vulnerableInnerHTML(userInput) {
    // NEVER DO THIS!
    // document.getElementById('output').innerHTML = userInput;

    // If userInput = '<img src=x onerror="alert(document.cookie)">'
    // The script executes!

    console.log("❌ VULNERABLE: Direct innerHTML assignment");
    console.log("   Input:", userInput);
    console.log("   Result: Script would execute in browser");
}

// ============================================================================
// VULNERABLE: document.write with user input
// ============================================================================
function vulnerableDocumentWrite(userInput) {
    // NEVER DO THIS!
    // document.write('<div>' + userInput + '</div>');

    console.log("❌ VULNERABLE: document.write with user input");
}

// ============================================================================
// VULNERABLE: eval() with user input
// ============================================================================
function vulnerableEval(userInput) {
    // NEVER DO THIS!
    // eval(userInput);
    // new Function(userInput)();
    // setTimeout(userInput, 0);
    // setInterval(userInput, 1000);

    console.log("❌ VULNERABLE: eval() and related functions");
}

// ============================================================================
// VULNERABLE: URL parameter injection
// ============================================================================
function vulnerableURLParam() {
    // URL: https://example.com/search?q=<script>alert('XSS')</script>

    // NEVER DO THIS!
    // const params = new URLSearchParams(window.location.search);
    // document.getElementById('search').innerHTML = params.get('q');

    console.log("❌ VULNERABLE: URL parameters in DOM");
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    XSS PREVENTION TECHNIQUES                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  DEFENSE IN DEPTH                               │   │
 * │   ├─────────────────────────────────────────────────────────────────┤   │
 * │   │                                                                 │   │
 * │   │   Layer 1: Input Validation                                    │   │
 * │   │   ════════════════════════                                     │   │
 * │   │   • Whitelist allowed characters                               │   │
 * │   │   • Reject unexpected input formats                            │   │
 * │   │   • Validate on both client AND server                         │   │
 * │   │                                                                 │   │
 * │   │   Layer 2: Output Encoding                                     │   │
 * │   │   ══════════════════════                                       │   │
 * │   │   • HTML encode for HTML context                               │   │
 * │   │   • JavaScript encode for JS context                           │   │
 * │   │   • URL encode for URL context                                 │   │
 * │   │   • CSS encode for style context                               │   │
 * │   │                                                                 │   │
 * │   │   Layer 3: Content Security Policy (CSP)                       │   │
 * │   │   ══════════════════════════════════════                       │   │
 * │   │   • Block inline scripts                                       │   │
 * │   │   • Whitelist script sources                                   │   │
 * │   │   • Report violations                                          │   │
 * │   │                                                                 │   │
 * │   │   Layer 4: HTTP-Only Cookies                                   │   │
 * │   │   ══════════════════════════                                   │   │
 * │   │   • Prevent JavaScript access to cookies                       │   │
 * │   │   • Limit XSS damage                                           │   │
 * │   │                                                                 │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SECURE: HTML Encoding
// ============================================================================
function htmlEncode(str) {
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return String(str).replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
}

// ============================================================================
// SECURE: JavaScript String Encoding
// ============================================================================
function jsEncode(str) {
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\f/g, '\\f')
        .replace(/</g, '\\x3c')
        .replace(/>/g, '\\x3e')
        .replace(/\//g, '\\x2f');
}

// ============================================================================
// SECURE: URL Encoding
// ============================================================================
function urlEncode(str) {
    return encodeURIComponent(String(str));
}

// ============================================================================
// SECURE: Using textContent instead of innerHTML
// ============================================================================
function secureTextContent(userInput) {
    // SAFE: textContent doesn't parse HTML
    // document.getElementById('output').textContent = userInput;

    console.log("✅ SECURE: Use textContent for text-only content");
    console.log("   Input:", userInput);
    console.log("   Result: Displayed as plain text, not executed");
}

// ============================================================================
// SECURE: Creating DOM elements programmatically
// ============================================================================
function secureCreateElement(userInput) {
    // SAFE: Create elements using DOM API
    // const div = document.createElement('div');
    // div.textContent = userInput;
    // document.body.appendChild(div);

    console.log("✅ SECURE: Create elements with DOM API");
}

// ============================================================================
// SECURE: DOMPurify for HTML sanitization
// ============================================================================
function secureDOMPurify(dirtyHTML) {
    // Using DOMPurify library (recommended)
    // const clean = DOMPurify.sanitize(dirtyHTML);
    // document.getElementById('output').innerHTML = clean;

    console.log("✅ SECURE: Use DOMPurify for HTML that needs to contain markup");
    console.log("   DOMPurify removes dangerous elements and attributes");
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CONTENT SECURITY POLICY (CSP)                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   HTTP Response Header:                                                  │
 * │   ════════════════════                                                  │
 * │                                                                          │
 * │   Content-Security-Policy: default-src 'self';                          │
 * │                            script-src 'self' https://trusted.cdn.com;    │
 * │                            style-src 'self' 'unsafe-inline';            │
 * │                            img-src 'self' data: https:;                 │
 * │                            connect-src 'self' https://api.example.com;  │
 * │                            frame-ancestors 'none';                       │
 * │                            report-uri /csp-report                        │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                     CSP DIRECTIVES                              │   │
 * │   ├─────────────────┬───────────────────────────────────────────────┤   │
 * │   │ default-src     │ Fallback for other directives                 │   │
 * │   │ script-src      │ Valid sources for JavaScript                  │   │
 * │   │ style-src       │ Valid sources for stylesheets                 │   │
 * │   │ img-src         │ Valid sources for images                      │   │
 * │   │ connect-src     │ Valid sources for fetch/XHR/WebSocket         │   │
 * │   │ font-src        │ Valid sources for fonts                       │   │
 * │   │ object-src      │ Valid sources for plugins                     │   │
 * │   │ media-src       │ Valid sources for audio/video                 │   │
 * │   │ frame-src       │ Valid sources for frames                      │   │
 * │   │ frame-ancestors │ Valid parents for embedding                   │   │
 * │   │ report-uri      │ Where to send violation reports               │   │
 * │   └─────────────────┴───────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   Special Keywords:                                                      │
 * │   'self'          - Same origin only                                    │
 * │   'none'          - Block everything                                    │
 * │   'unsafe-inline' - Allow inline scripts/styles (NOT recommended)       │
 * │   'unsafe-eval'   - Allow eval() (NOT recommended)                      │
 * │   'nonce-xxx'     - Allow specific inline scripts with nonce            │
 * │   'strict-dynamic'- Trust scripts loaded by trusted scripts             │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// CSP Nonce Implementation
// ============================================================================
function generateCSPNonce() {
    // Server generates unique nonce per request
    const crypto = require('crypto');
    const nonce = crypto.randomBytes(16).toString('base64');

    // In HTML: <script nonce="generated-nonce">...</script>
    // In header: Content-Security-Policy: script-src 'nonce-generated-nonce'

    console.log("Generated CSP nonce:", nonce);
    return nonce;
}

// ============================================================================
// Express.js CSP Middleware Example
// ============================================================================
function cspMiddleware(req, res, next) {
    const crypto = require('crypto');
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.nonce = nonce;

    const csp = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}'`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self'",
        "font-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; ');

    res.setHeader('Content-Security-Policy', csp);
    // For reporting only (doesn't block):
    // res.setHeader('Content-Security-Policy-Report-Only', csp);

    console.log("✅ CSP Header set:", csp.substring(0, 50) + "...");
    return { nonce, csp };
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DOM XSS PREVENTION                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   DANGEROUS SINKS (avoid with user input):                              │
 * │   ═════════════════════════════════════════                              │
 * │                                                                          │
 * │   DOM Manipulation:                                                      │
 * │   • element.innerHTML                                                   │
 * │   • element.outerHTML                                                   │
 * │   • document.write()                                                    │
 * │   • document.writeln()                                                  │
 * │                                                                          │
 * │   JavaScript Execution:                                                  │
 * │   • eval()                                                              │
 * │   • Function()                                                          │
 * │   • setTimeout(string)                                                  │
 * │   • setInterval(string)                                                 │
 * │                                                                          │
 * │   URL/Location:                                                          │
 * │   • location.href                                                       │
 * │   • location.assign()                                                   │
 * │   • location.replace()                                                  │
 * │   • window.open()                                                       │
 * │                                                                          │
 * │   DANGEROUS SOURCES (validate before use):                              │
 * │   ═════════════════════════════════════════                              │
 * │   • location.href, location.search, location.hash                       │
 * │   • document.referrer                                                   │
 * │   • window.name                                                         │
 * │   • document.cookie                                                     │
 * │   • localStorage, sessionStorage                                        │
 * │   • postMessage data                                                    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Safe URL Handling
// ============================================================================
function safeURLRedirect(userURL) {
    // Validate URL before redirect
    try {
        const url = new URL(userURL);

        // Only allow same-origin or specific trusted domains
        const trustedDomains = ['example.com', 'trusted-site.com'];
        const currentDomain = 'example.com'; // window.location.hostname

        if (url.hostname === currentDomain ||
            trustedDomains.includes(url.hostname)) {
            console.log("✅ Safe redirect to:", url.href);
            // window.location.href = url.href;
        } else {
            console.log("❌ Blocked redirect to untrusted domain:", url.hostname);
        }

        // Also check for javascript: protocol
        if (url.protocol === 'javascript:') {
            console.log("❌ Blocked javascript: protocol");
            return false;
        }

        return true;
    } catch (e) {
        console.log("❌ Invalid URL:", userURL);
        return false;
    }
}

// ============================================================================
// Safe postMessage Handling
// ============================================================================
function setupPostMessageHandler() {
    // window.addEventListener('message', (event) => {
    //     // ALWAYS validate origin
    //     if (event.origin !== 'https://trusted-site.com') {
    //         console.log('Rejected message from:', event.origin);
    //         return;
    //     }
    //
    //     // Validate and sanitize data
    //     const data = event.data;
    //     if (typeof data !== 'object' || !data.action) {
    //         return;
    //     }
    //
    //     // Handle specific actions
    //     switch (data.action) {
    //         case 'updateContent':
    //             // Sanitize before use
    //             document.getElementById('content').textContent = data.value;
    //             break;
    //     }
    // });

    console.log("✅ postMessage handler with origin validation");
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    INPUT VALIDATION PATTERNS                             │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Comprehensive Input Validator
// ============================================================================
class InputValidator {
    static patterns = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        alphanumeric: /^[a-zA-Z0-9]+$/,
        numeric: /^\d+$/,
        slug: /^[a-z0-9-]+$/,
        username: /^[a-zA-Z0-9_]{3,20}$/,
        phone: /^\+?[\d\s-]{10,}$/
    };

    static validate(input, type) {
        if (!this.patterns[type]) {
            throw new Error(`Unknown validation type: ${type}`);
        }
        return this.patterns[type].test(input);
    }

    static sanitizeForHTML(input) {
        return htmlEncode(String(input));
    }

    static sanitizeForJS(input) {
        return jsEncode(String(input));
    }

    static sanitizeForURL(input) {
        return urlEncode(String(input));
    }

    static stripTags(input) {
        return String(input).replace(/<[^>]*>/g, '');
    }

    static truncate(input, maxLength) {
        const str = String(input);
        return str.length > maxLength ? str.substring(0, maxLength) : str;
    }
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    FRAMEWORK-SPECIFIC PROTECTIONS                        │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   REACT:                                                                 │
 * │   ══════                                                                 │
 * │   • JSX auto-escapes by default                                         │
 * │   • DANGER: dangerouslySetInnerHTML                                     │
 * │   • Use DOMPurify before dangerouslySetInnerHTML                        │
 * │                                                                          │
 * │   // Safe                                                                │
 * │   <div>{userInput}</div>                                                │
 * │                                                                          │
 * │   // Dangerous                                                           │
 * │   <div dangerouslySetInnerHTML={{__html: userInput}} />                 │
 * │                                                                          │
 * │   // Safe with sanitization                                              │
 * │   <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(html)}} />  │
 * │                                                                          │
 * │   VUE:                                                                   │
 * │   ════                                                                   │
 * │   • {{ }} auto-escapes by default                                       │
 * │   • DANGER: v-html directive                                            │
 * │                                                                          │
 * │   // Safe                                                                │
 * │   <div>{{ userInput }}</div>                                            │
 * │                                                                          │
 * │   // Dangerous                                                           │
 * │   <div v-html="userInput"></div>                                        │
 * │                                                                          │
 * │   ANGULAR:                                                               │
 * │   ════════                                                               │
 * │   • Interpolation auto-escapes by default                               │
 * │   • DANGER: bypassSecurityTrustHtml()                                   │
 * │   • Use DomSanitizer carefully                                          │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// React Component Example (Pseudo-code)
// ============================================================================
const reactExample = `
// SAFE: Auto-escaped
function SafeComponent({ userInput }) {
    return <div>{userInput}</div>;
}

// DANGEROUS: Use with sanitization only
function DangerousComponent({ htmlContent }) {
    const sanitized = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'title', 'target']
    });

    return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// SAFE: URL validation
function LinkComponent({ url, text }) {
    const isValidUrl = (url) => {
        try {
            const parsed = new URL(url);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    };

    if (!isValidUrl(url)) {
        return <span>{text}</span>;
    }

    return <a href={url} rel="noopener noreferrer">{text}</a>;
}
`;

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    XSS TESTING PAYLOADS                                  │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │   (For security testing your own applications only)                     │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const xssTestPayloads = [
    // Basic payloads
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert("XSS")>',

    // Event handlers
    '<div onmouseover="alert(\'XSS\')">hover me</div>',
    '<body onload=alert("XSS")>',
    '<input onfocus=alert("XSS") autofocus>',

    // Encoded variants
    '<script>alert(String.fromCharCode(88,83,83))</script>',
    '<img src=x onerror="&#x61;lert(1)">',

    // Data URLs
    '<a href="data:text/html,<script>alert(\'XSS\')</script>">click</a>',

    // JavaScript URLs
    '<a href="javascript:alert(\'XSS\')">click</a>',

    // Template literals
    '${alert("XSS")}',

    // Breaking out of attributes
    '" onclick="alert(\'XSS\')" "',
    "' onclick='alert(\"XSS\")' '",

    // Filter bypass attempts
    '<scr<script>ipt>alert("XSS")</scr</script>ipt>',
    '<SCRIPT>alert("XSS")</SCRIPT>',
    '\\x3cscript\\x3ealert("XSS")\\x3c/script\\x3e'
];

// ============================================================================
// XSS Prevention Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           XSS PREVENTION CHEAT SHEET                            ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  1. NEVER trust user input                                      ║");
console.log("║  2. Use textContent instead of innerHTML                        ║");
console.log("║  3. Encode output based on context (HTML/JS/URL/CSS)           ║");
console.log("║  4. Implement Content Security Policy                           ║");
console.log("║  5. Use DOMPurify for rich HTML content                         ║");
console.log("║  6. Set HttpOnly flag on cookies                                ║");
console.log("║  7. Validate URLs before redirects                              ║");
console.log("║  8. Validate postMessage origins                                ║");
console.log("║  9. Avoid eval() and related functions                          ║");
console.log("║  10. Use framework auto-escaping features                       ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

// ============================================================================
// Demo Execution
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           XSS PREVENTION DEMONSTRATIONS");
console.log("═══════════════════════════════════════════════════════════════\n");

const maliciousInput = '<script>alert("XSS")</script>';

console.log("Original malicious input:");
console.log(`  "${maliciousInput}"\n`);

console.log("HTML Encoded:");
console.log(`  "${htmlEncode(maliciousInput)}"\n`);

console.log("JavaScript Encoded:");
console.log(`  "${jsEncode(maliciousInput)}"\n`);

console.log("URL Encoded:");
console.log(`  "${urlEncode(maliciousInput)}"\n`);

console.log("Strip Tags:");
console.log(`  "${InputValidator.stripTags(maliciousInput)}"\n`);

// Validate patterns
console.log("Pattern Validation:");
console.log(`  Email "test@example.com": ${InputValidator.validate('test@example.com', 'email')}`);
console.log(`  Email "<script>@x.com": ${InputValidator.validate('<script>@x.com', 'email')}`);
console.log(`  Username "john_doe": ${InputValidator.validate('john_doe', 'username')}`);
console.log(`  Username "<script>": ${InputValidator.validate('<script>', 'username')}\n`);

// CSP Example
console.log("CSP Configuration:");
cspMiddleware();

// URL Validation
console.log("\nURL Validation:");
safeURLRedirect('https://example.com/page');
safeURLRedirect('https://evil-site.com/steal');
safeURLRedirect('javascript:alert(1)');

module.exports = {
    htmlEncode,
    jsEncode,
    urlEncode,
    InputValidator,
    safeURLRedirect,
    cspMiddleware,
    xssTestPayloads
};

console.log("\n═══ Next: CSRF Protection ═══");
console.log("Run: node deep-dive/javaScript-security/02-csrf-protection.js");
