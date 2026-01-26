/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT SECURITY - Cryptography Basics
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Cryptographic fundamentals for JavaScript developers using Node.js crypto
 * and Web Crypto API.
 */

const crypto = require('crypto');

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CRYPTOGRAPHY OVERVIEW                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  CRYPTOGRAPHIC PRIMITIVES                       │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   1. HASHING (One-way)                                                  │
 * │      Input ──► Hash Function ──► Fixed-size digest                     │
 * │      Use: Integrity, password storage, checksums                       │
 * │                                                                          │
 * │   2. SYMMETRIC ENCRYPTION (Same key)                                    │
 * │      Plaintext + Key ──► Ciphertext                                    │
 * │      Ciphertext + Key ──► Plaintext                                    │
 * │      Use: Data encryption, session data                                │
 * │                                                                          │
 * │   3. ASYMMETRIC ENCRYPTION (Key pair)                                   │
 * │      Plaintext + Public Key ──► Ciphertext                             │
 * │      Ciphertext + Private Key ──► Plaintext                            │
 * │      Use: Key exchange, digital signatures                             │
 * │                                                                          │
 * │   4. DIGITAL SIGNATURES                                                 │
 * │      Message + Private Key ──► Signature                               │
 * │      Signature + Public Key ──► Verified/Invalid                       │
 * │      Use: Authentication, non-repudiation                              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           HASHING");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    HASHING ALGORITHMS                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────┬──────────┬─────────────────────────────────────────┐  │
 * │   │ Algorithm   │ Output   │ Use Case                                │  │
 * │   ├─────────────┼──────────┼─────────────────────────────────────────┤  │
 * │   │ MD5         │ 128 bits │ ❌ Broken, avoid for security          │  │
 * │   │ SHA-1       │ 160 bits │ ❌ Deprecated, collisions found        │  │
 * │   │ SHA-256     │ 256 bits │ ✅ Good for general hashing            │  │
 * │   │ SHA-384     │ 384 bits │ ✅ Higher security                     │  │
 * │   │ SHA-512     │ 512 bits │ ✅ Maximum security                    │  │
 * │   │ SHA-3       │ Variable │ ✅ Latest standard                     │  │
 * │   │ BLAKE2      │ Variable │ ✅ Fast, secure alternative            │  │
 * │   └─────────────┴──────────┴─────────────────────────────────────────┘  │
 * │                                                                          │
 * │   For passwords: Use bcrypt, scrypt, or Argon2 (NOT raw SHA!)          │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Basic Hashing
// ============================================================================
class HashUtils {
    // Simple hash
    static hash(data, algorithm = 'sha256') {
        return crypto
            .createHash(algorithm)
            .update(data)
            .digest('hex');
    }

    // Hash with salt (for non-password use)
    static hashWithSalt(data, salt = crypto.randomBytes(16).toString('hex')) {
        const hash = crypto
            .createHash('sha256')
            .update(salt + data)
            .digest('hex');
        return { hash, salt };
    }

    // HMAC (Hash-based Message Authentication Code)
    static hmac(data, key, algorithm = 'sha256') {
        return crypto
            .createHmac(algorithm, key)
            .update(data)
            .digest('hex');
    }

    // Verify HMAC
    static verifyHmac(data, key, expectedHmac) {
        const actualHmac = this.hmac(data, key);
        return crypto.timingSafeEqual(
            Buffer.from(actualHmac),
            Buffer.from(expectedHmac)
        );
    }

    // File hash (for integrity checking)
    static hashFile(content) {
        return this.hash(content, 'sha256');
    }
}

// Demo
console.log("─── Hashing Demo ───\n");
const data = 'Hello, World!';
console.log("Data:", data);
console.log("SHA-256:", HashUtils.hash(data));
console.log("SHA-512:", HashUtils.hash(data, 'sha512'));

const salted = HashUtils.hashWithSalt(data);
console.log("Salted:", salted);

const key = 'secret-key';
const hmac = HashUtils.hmac(data, key);
console.log("HMAC:", hmac);
console.log("HMAC Verified:", HashUtils.verifyHmac(data, key, hmac));

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SYMMETRIC ENCRYPTION                                  │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   AES (Advanced Encryption Standard)                                    │
 * │   ═══════════════════════════════════                                   │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  AES MODES                                      │   │
 * │   ├──────────────┬──────────────────────────────────────────────────┤   │
 * │   │ Mode         │ Description                                      │   │
 * │   ├──────────────┼──────────────────────────────────────────────────┤   │
 * │   │ AES-GCM      │ ✅ Recommended - Authenticated encryption       │   │
 * │   │ AES-CBC      │ ⚠️  Needs HMAC for authentication               │   │
 * │   │ AES-CTR      │ ⚠️  Stream mode, needs authentication           │   │
 * │   │ AES-ECB      │ ❌ Never use - pattern leakage                  │   │
 * │   └──────────────┴──────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   AES-GCM provides:                                                     │
 * │   • Confidentiality (encryption)                                        │
 * │   • Integrity (authentication tag)                                      │
 * │   • Associated data authentication                                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           SYMMETRIC ENCRYPTION (AES)");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// AES-GCM Encryption (Recommended)
// ============================================================================
class AESEncryption {
    static ALGORITHM = 'aes-256-gcm';
    static KEY_LENGTH = 32;  // 256 bits
    static IV_LENGTH = 12;   // 96 bits for GCM
    static TAG_LENGTH = 16;  // 128 bits

    // Generate key
    static generateKey() {
        return crypto.randomBytes(this.KEY_LENGTH);
    }

    // Derive key from password
    static deriveKey(password, salt = crypto.randomBytes(16)) {
        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, this.KEY_LENGTH, (err, key) => {
                if (err) reject(err);
                resolve({ key, salt });
            });
        });
    }

    // Encrypt
    static encrypt(plaintext, key) {
        const iv = crypto.randomBytes(this.IV_LENGTH);
        const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Return IV + AuthTag + Ciphertext (all needed for decryption)
        return {
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            ciphertext: encrypted,
            // Combined format for storage
            combined: iv.toString('hex') + authTag.toString('hex') + encrypted
        };
    }

    // Decrypt
    static decrypt(encryptedData, key) {
        let iv, authTag, ciphertext;

        if (typeof encryptedData === 'string') {
            // Parse combined format
            iv = Buffer.from(encryptedData.slice(0, this.IV_LENGTH * 2), 'hex');
            authTag = Buffer.from(encryptedData.slice(this.IV_LENGTH * 2, this.IV_LENGTH * 2 + this.TAG_LENGTH * 2), 'hex');
            ciphertext = encryptedData.slice(this.IV_LENGTH * 2 + this.TAG_LENGTH * 2);
        } else {
            iv = Buffer.from(encryptedData.iv, 'hex');
            authTag = Buffer.from(encryptedData.authTag, 'hex');
            ciphertext = encryptedData.ciphertext;
        }

        const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    // Encrypt with Associated Data (AAD)
    static encryptWithAAD(plaintext, key, associatedData) {
        const iv = crypto.randomBytes(this.IV_LENGTH);
        const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

        // Set associated data (authenticated but not encrypted)
        cipher.setAAD(Buffer.from(associatedData));

        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return {
            iv: iv.toString('hex'),
            authTag: cipher.getAuthTag().toString('hex'),
            ciphertext: encrypted
        };
    }
}

// Demo
console.log("─── AES-GCM Encryption Demo ───\n");
const key = AESEncryption.generateKey();
console.log("Generated Key:", key.toString('hex').substring(0, 32) + "...");

const plaintext = 'Sensitive data to encrypt';
console.log("Plaintext:", plaintext);

const encrypted = AESEncryption.encrypt(plaintext, key);
console.log("Encrypted:", encrypted.combined.substring(0, 40) + "...");

const decrypted = AESEncryption.decrypt(encrypted, key);
console.log("Decrypted:", decrypted);

// Test with wrong key
console.log("\nTrying with wrong key:");
try {
    const wrongKey = AESEncryption.generateKey();
    AESEncryption.decrypt(encrypted, wrongKey);
} catch (e) {
    console.log("Error (expected):", e.message);
}

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ASYMMETRIC ENCRYPTION (RSA)                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  RSA KEY PAIR                                   │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   Public Key                          Private Key                        │
 * │   ══════════                          ═══════════                        │
 * │   • Shared freely                     • Keep secret                      │
 * │   • Used for encryption               • Used for decryption             │
 * │   • Used to verify signatures         • Used to create signatures       │
 * │                                                                          │
 * │   Key Sizes:                                                             │
 * │   • 2048 bits - Minimum recommended                                     │
 * │   • 3072 bits - Better security                                         │
 * │   • 4096 bits - High security                                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           ASYMMETRIC ENCRYPTION (RSA)");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// RSA Encryption
// ============================================================================
class RSAEncryption {
    // Generate key pair
    static generateKeyPair(modulusLength = 2048) {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
    }

    // Encrypt with public key
    static encrypt(plaintext, publicKey) {
        const buffer = Buffer.from(plaintext);
        const encrypted = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            buffer
        );
        return encrypted.toString('base64');
    }

    // Decrypt with private key
    static decrypt(ciphertext, privateKey) {
        const buffer = Buffer.from(ciphertext, 'base64');
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            buffer
        );
        return decrypted.toString();
    }
}

// Demo
console.log("─── RSA Encryption Demo ───\n");
const { publicKey, privateKey } = RSAEncryption.generateKeyPair();
console.log("Public Key (first 64 chars):", publicKey.substring(0, 64));
console.log("Private Key (first 64 chars):", privateKey.substring(0, 64));

const rsaPlaintext = 'Secret message';
console.log("\nPlaintext:", rsaPlaintext);

const rsaEncrypted = RSAEncryption.encrypt(rsaPlaintext, publicKey);
console.log("Encrypted:", rsaEncrypted.substring(0, 40) + "...");

const rsaDecrypted = RSAEncryption.decrypt(rsaEncrypted, privateKey);
console.log("Decrypted:", rsaDecrypted);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DIGITAL SIGNATURES                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Message ────► Hash ────► Sign with ────► Signature                    │
 * │                           Private Key                                    │
 * │                                                                          │
 * │   Message + Signature ────► Verify with ────► Valid/Invalid             │
 * │                             Public Key                                   │
 * │                                                                          │
 * │   Provides:                                                              │
 * │   • Authentication - Proves who signed                                  │
 * │   • Integrity - Message hasn't been modified                            │
 * │   • Non-repudiation - Signer can't deny signing                         │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           DIGITAL SIGNATURES");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Digital Signatures
// ============================================================================
class DigitalSignature {
    // Generate signing key pair
    static generateKeyPair() {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
    }

    // Sign message
    static sign(message, privateKey) {
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(message);
        sign.end();
        return sign.sign(privateKey, 'base64');
    }

    // Verify signature
    static verify(message, signature, publicKey) {
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(message);
        verify.end();
        return verify.verify(publicKey, signature, 'base64');
    }

    // Ed25519 (faster, smaller keys)
    static generateEd25519KeyPair() {
        return crypto.generateKeyPairSync('ed25519', {
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
    }

    static signEd25519(message, privateKey) {
        return crypto.sign(null, Buffer.from(message), privateKey).toString('base64');
    }

    static verifyEd25519(message, signature, publicKey) {
        return crypto.verify(null, Buffer.from(message), publicKey, Buffer.from(signature, 'base64'));
    }
}

// Demo
console.log("─── Digital Signature Demo ───\n");
const sigKeys = DigitalSignature.generateKeyPair();
const message = 'This is an important document.';

console.log("Message:", message);

const signature = DigitalSignature.sign(message, sigKeys.privateKey);
console.log("Signature:", signature.substring(0, 40) + "...");

const isValid = DigitalSignature.verify(message, signature, sigKeys.publicKey);
console.log("Valid:", isValid ? "✅ Yes" : "❌ No");

// Tampered message
const tamperedValid = DigitalSignature.verify(message + 'x', signature, sigKeys.publicKey);
console.log("Tampered Valid:", tamperedValid ? "✅ Yes" : "❌ No");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    RANDOM NUMBER GENERATION                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ❌ Math.random() - NOT cryptographically secure!                      │
 * │   ✅ crypto.randomBytes() - Secure random                               │
 * │   ✅ crypto.randomUUID() - Secure UUID generation                       │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           SECURE RANDOM NUMBERS");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Secure Random Generation
// ============================================================================
class SecureRandom {
    // Generate random bytes
    static bytes(length) {
        return crypto.randomBytes(length);
    }

    // Generate random hex string
    static hex(length) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

    // Generate random base64 string
    static base64(length) {
        return crypto.randomBytes(Math.ceil(length * 0.75))
            .toString('base64')
            .replace(/[+/=]/g, '')
            .slice(0, length);
    }

    // Generate random integer in range [min, max]
    static int(min, max) {
        const range = max - min + 1;
        const bytesNeeded = Math.ceil(Math.log2(range) / 8);
        const maxValid = Math.floor(256 ** bytesNeeded / range) * range;

        let value;
        do {
            value = parseInt(crypto.randomBytes(bytesNeeded).toString('hex'), 16);
        } while (value >= maxValid);

        return min + (value % range);
    }

    // Generate secure token
    static token(length = 32) {
        return this.hex(length);
    }

    // Generate UUID v4
    static uuid() {
        return crypto.randomUUID();
    }

    // Generate secure password
    static password(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars[this.int(0, chars.length - 1)];
        }
        return password;
    }
}

// Demo
console.log("─── Secure Random Demo ───\n");
console.log("Random Bytes (16):", SecureRandom.bytes(16).toString('hex'));
console.log("Random Hex (32):", SecureRandom.hex(32));
console.log("Random Base64 (24):", SecureRandom.base64(24));
console.log("Random Int (1-100):", SecureRandom.int(1, 100));
console.log("Random Token:", SecureRandom.token());
console.log("Random UUID:", SecureRandom.uuid());
console.log("Random Password:", SecureRandom.password());

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    KEY DERIVATION FUNCTIONS                              │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("           KEY DERIVATION");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Key Derivation
// ============================================================================
class KeyDerivation {
    // PBKDF2
    static pbkdf2(password, salt, iterations = 100000, keyLength = 32) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, iterations, keyLength, 'sha256', (err, key) => {
                if (err) reject(err);
                resolve(key);
            });
        });
    }

    // scrypt (memory-hard)
    static scrypt(password, salt, keyLength = 32) {
        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, keyLength, (err, key) => {
                if (err) reject(err);
                resolve(key);
            });
        });
    }

    // HKDF (key expansion)
    static hkdf(ikm, salt, info, keyLength = 32) {
        return new Promise((resolve, reject) => {
            crypto.hkdf('sha256', ikm, salt, info, keyLength, (err, key) => {
                if (err) reject(err);
                resolve(Buffer.from(key));
            });
        });
    }
}

// Demo
(async () => {
    console.log("─── Key Derivation Demo ───\n");
    const password = 'user-password';
    const salt = SecureRandom.bytes(16);

    const pbkdf2Key = await KeyDerivation.pbkdf2(password, salt);
    console.log("PBKDF2 Key:", pbkdf2Key.toString('hex'));

    const scryptKey = await KeyDerivation.scrypt(password, salt);
    console.log("scrypt Key:", scryptKey.toString('hex'));
})();

// ============================================================================
// Cryptography Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           CRYPTOGRAPHY CHEAT SHEET                              ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  HASHING:                                                        ║");
console.log("║  • Use SHA-256/SHA-3 for general hashing                        ║");
console.log("║  • Use bcrypt/scrypt/Argon2 for passwords                       ║");
console.log("║  • Use HMAC for message authentication                          ║");
console.log("║                                                                  ║");
console.log("║  SYMMETRIC ENCRYPTION:                                           ║");
console.log("║  • Use AES-256-GCM (authenticated encryption)                   ║");
console.log("║  • Never reuse IV/nonce                                         ║");
console.log("║  • Always verify authentication tag                             ║");
console.log("║                                                                  ║");
console.log("║  ASYMMETRIC ENCRYPTION:                                          ║");
console.log("║  • RSA: Minimum 2048 bits                                       ║");
console.log("║  • Use OAEP padding, not PKCS1v15                               ║");
console.log("║  • Keep private keys secret!                                    ║");
console.log("║                                                                  ║");
console.log("║  DIGITAL SIGNATURES:                                             ║");
console.log("║  • Use RSA-SHA256 or Ed25519                                    ║");
console.log("║  • Verify signatures before trusting data                       ║");
console.log("║                                                                  ║");
console.log("║  RANDOM NUMBERS:                                                 ║");
console.log("║  • NEVER use Math.random() for security                         ║");
console.log("║  • Use crypto.randomBytes() / crypto.randomUUID()               ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    HashUtils,
    AESEncryption,
    RSAEncryption,
    DigitalSignature,
    SecureRandom,
    KeyDerivation
};

console.log("═══ Next: Security Interview Q&A ═══");
console.log("Run: node deep-dive/javaScript-security/08-interview-qa.js");
