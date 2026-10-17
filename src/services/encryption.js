const vscode = require('vscode');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Encryption Service
 * Handles file encryption/decryption using public/private key pairs
 */
class EncryptionService {
  constructor(context) {
    this.context = context;
  }

  _getConfig() {
    return vscode.workspace.getConfiguration('notas');
  }

  _normalizeKeyPath(filePath) {
    if (typeof filePath !== 'string') {
      return '';
    }

    const trimmedPath = filePath.trim();
    if (!trimmedPath) {
      return '';
    }

    if (trimmedPath === '~') {
      return os.homedir();
    }

    if (trimmedPath.startsWith('~/') || trimmedPath.startsWith('~\\')) {
      return path.join(os.homedir(), trimmedPath.slice(2));
    }

    return trimmedPath;
  }

  async _setKeyPath(settingKey, legacySecretKey, filePath) {
    const normalizedPath = this._normalizeKeyPath(filePath);
    const config = this._getConfig();

    await config.update(settingKey, normalizedPath, vscode.ConfigurationTarget.Global);

    if (this.context?.secrets?.delete) {
      await this.context.secrets.delete(legacySecretKey);
    }
  }

  async _getKeyPath(settingKey, legacySecretKey) {
    const config = this._getConfig();
    const configuredPath = this._normalizeKeyPath(config.get(settingKey));
    if (configuredPath) {
      return configuredPath;
    }

    const legacyPath = this._normalizeKeyPath(await this.context.secrets.get(legacySecretKey));
    if (!legacyPath) {
      return undefined;
    }

    await config.update(settingKey, legacyPath, vscode.ConfigurationTarget.Global);

    if (this.context?.secrets?.delete) {
      await this.context.secrets.delete(legacySecretKey);
    }

    return legacyPath;
  }

  /**
   * Set public key path
   * @param {string} path - Path to public key file
   */
  async setPublicKeyPath(path) {
    await this._setKeyPath('encryption.publicKeyPath', 'notas.encryption.publicKeyPath', path);
  }
  
  /**
   * Set private key path
   * @param {string} path - Path to private key file
   */
  async setPrivateKeyPath(path) {
    await this._setKeyPath('encryption.privateKeyPath', 'notas.encryption.privateKeyPath', path);
  }
  
  /**
   * Get public key path
   * @returns {Promise<string|undefined>}
   */
  async getPublicKeyPath() {
    return await this._getKeyPath('encryption.publicKeyPath', 'notas.encryption.publicKeyPath');
  }
  
  /**
   * Get private key path
   * @returns {Promise<string|undefined>}
   */
  async getPrivateKeyPath() {
    return await this._getKeyPath('encryption.privateKeyPath', 'notas.encryption.privateKeyPath');
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
    
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
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
