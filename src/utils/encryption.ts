import crypto from "crypto";

// The secret key should ideally be 32 bytes (256 bits) for aes-256-cbc.
// Make sure to set ENCRYPTION_KEY in your .env.local file.
// If not set, it falls back to a 32-character string for development.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const ALGORITHM = process.env.ALGORITHM || "";

/**
 * Decrypts data using AES-256-CBC
 * @param encryptedData Hex string of the encrypted payload
 * @param iv Hex string of the initialization vector
 * @returns Decrypted string (usually JSON)
 */
export function decryptData(encryptedData: string, iv: string): string {
  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, "hex"),
      Buffer.from(iv, "hex"),
    );

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Encrypts data using AES-256-CBC
 * @param text The string to encrypt (e.g., JSON.stringify(payload))
 * @returns Object containing the generated IV and the encryptedData
 */
export function encryptData(text: string): {
  iv: string;
  encryptedData: string;
} {
  try {
    const iv = crypto.randomBytes(16); // 16 bytes is standard for AES
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, "utf-8"),
      iv,
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
      iv: iv.toString("hex"),
      encryptedData: encrypted,
    };
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}
