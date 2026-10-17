const crypto = require('crypto');
const fs = require('fs').promises;

/**
 * Encryption Service
 * Handles file encryption/decryption using public/private key pairs
 */
class EncryptionService {
  constructor(context) {
    this.context = context;
  }
  
  /**
   * Set public key path
   * @param {string} path - Path to public key file
   */
  async setPublicKeyPath(path) {
    await this.context.secrets.store('notas.encryption.publicKeyPath', path);
  }
  
  /**
   * Set private key path
   * @param {string} path - Path to private key file
   */
  async setPrivateKeyPath(path) {
    await this.context.secrets.store('notas.encryption.privateKeyPath', path);
  }
  
  /**
   * Get public key path
   * @returns {Promise<string|undefined>}
   */
  async getPublicKeyPath() {
    return await this.context.secrets.get('notas.encryption.publicKeyPath');
  }
  
  /**
   * Get private key path
   * @returns {Promise<string|undefined>}
   */
  async getPrivateKeyPath() {
    return await this.context.secrets.get('notas.encryption.privateKeyPath');
  }
  
  /**
   * Read public key from file
   * @returns {Promise<string>}
   */
  async readPublicKey() {
    const path = await this.getPublicKeyPath();
    if (!path) {
      throw new Error('Public key path not configured. Please set it in Encryption settings.');
    }
    
    try {
      return await fs.readFile(path, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read public key from ${path}: ${error.message}`);
    }
  }
  
  /**
   * Read private key from file
   * @returns {Promise<string>}
   */
  async readPrivateKey() {
    const path = await this.getPrivateKeyPath();
    if (!path) {
      throw new Error('Private key path not configured. Please set it in Encryption settings.');
    }
    
    try {
      return await fs.readFile(path, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read private key from ${path}: ${error.message}`);
    }
  }
  
  /**
   * Check if a file is encrypted
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>}
   */
  async isEncrypted(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.trim().split('\n');
      
      // Check if it has at least 4 lines and all are base64
      if (lines.length < 4) {
        return false;
      }
      
      // Validate that all lines look like base64
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;
      return lines.slice(0, 4).every(line => base64Regex.test(line.trim()));
      
    } catch {
      return false;
    }
  }
  
  /**
   * Encrypt file content
   * @param {Buffer|string} content - Content to encrypt
   * @param {string} publicKey - Public key in PEM format
   * @returns {string} Encrypted data in line format
   */
  encryptContent(content, publicKey) {
    // Generate random AES key and IV
    const aesKey = crypto.randomBytes(32); // 256 bits
    const iv = crypto.randomBytes(16);
    
    // Encrypt content with AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(content),
      cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    
    // Encrypt AES key with RSA public key
    const encryptedAesKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      aesKey
    );
    
    // Return as line-based format
    return [
      authTag.toString('base64'),
      iv.toString('base64'),
      encryptedAesKey.toString('base64'),
      encrypted.toString('base64')
    ].join('\n');
  }
  
  /**
   * Decrypt file content
   * @param {string} encryptedContent - Encrypted data in line format
   * @param {string} privateKey - Private key in PEM format
   * @returns {Buffer} Decrypted content
   */
  decryptContent(encryptedContent, privateKey) {
    // Parse line-based format
    const lines = encryptedContent.trim().split('\n');
    
    if (lines.length < 4) {
      throw new Error('Invalid encrypted file format');
    }
    
    const authTag = Buffer.from(lines[0], 'base64');
    const iv = Buffer.from(lines[1], 'base64');
    const encryptedAesKey = Buffer.from(lines[2], 'base64');
    const encrypted = Buffer.from(lines[3], 'base64');
    
    // Decrypt AES key with RSA private key
    const aesKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      encryptedAesKey
    );
    
    // Decrypt content with AES key
    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted;
  }
  
  /**
   * Encrypt a file (in-place)
   * @param {string} filePath - Path to file to encrypt
   */
  async encryptFile(filePath) {
    // Read public key
    const publicKey = await this.readPublicKey();
    
    // Read file content as UTF-8 string (preserves text format for multi-layer encryption)
    const content = await fs.readFile(filePath, 'utf8');
    
    // Encrypt (returns line-based format)
    const encrypted = this.encryptContent(content, publicKey);
    
    // Write back to file
    await fs.writeFile(filePath, encrypted, 'utf8');
  }
  
  /**
   * Decrypt a file and return content
   * @param {string} filePath - Path to encrypted file
   * @returns {Promise<Buffer>} Decrypted content
   */
  async decryptFile(filePath) {
    // Read private key
    const privateKey = await this.readPrivateKey();
    
    // Read encrypted file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Decrypt
    return this.decryptContent(content, privateKey);
  }
  
  /**
   * Check if keys are configured
   * @returns {Promise<boolean>}
   */
  async areKeysConfigured() {
    const publicKeyPath = await this.getPublicKeyPath();
    const privateKeyPath = await this.getPrivateKeyPath();
    return !!(publicKeyPath && privateKeyPath);
  }
}

module.exports = EncryptionService;
