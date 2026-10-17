const vscode = require('vscode');

/**
 * Virtual File System Provider for decrypted files
 * Provides read/write access to encrypted files in decrypted form
 */
class DecryptedFileSystemProvider {
  constructor(encryptionService) {
    this.encryptionService = encryptionService;
    this._emitter = new vscode.EventEmitter();
    this.onDidChangeFile = this._emitter.event;
    
    // Cache decrypted content
    this.contentCache = new Map();
  }

  /**
   * Clear cache for a specific file
   * @param {string} filePath - Path to the file to clear from cache
   */
  clearCache(filePath) {
    this.contentCache.delete(filePath);
  }

  watch(uri, options) {
    // Not implemented - we don't watch for external changes
    return new vscode.Disposable(() => {});
  }

  async stat(uri) {
    // Get original file path from URI
    const originalPath = uri.path;
    
    try {
      const fs = require('fs').promises;
      const stats = await fs.stat(originalPath);
      
      return {
        type: vscode.FileType.File,
        ctime: stats.ctimeMs,
        mtime: stats.mtimeMs,
        size: stats.size
      };
    } catch (error) {
      throw vscode.FileSystemError.FileNotFound(uri);
    }
  }

  async readDirectory(uri) {
    // Not implemented - we only handle files
    return [];
  }

  async createDirectory(uri) {
    // Not implemented
    throw vscode.FileSystemError.NoPermissions();
  }

  async readFile(uri) {
    const originalPath = uri.path;
    
    try {
      // Check cache first
      if (this.contentCache.has(originalPath)) {
        const cached = this.contentCache.get(originalPath);
        return Buffer.from(cached, 'utf8');
      }
      
      // Decrypt file
      const decryptedBuffer = await this.encryptionService.decryptFile(originalPath);
      
      // Cache it
      this.contentCache.set(originalPath, decryptedBuffer.toString('utf8'));
      
      return decryptedBuffer;
      
    } catch (error) {
      throw vscode.FileSystemError.FileNotFound(uri);
    }
  }

  async writeFile(uri, content, options) {
    const originalPath = uri.path;
    
    try {
      // Convert buffer to string
      const contentString = Buffer.from(content).toString('utf8');
      
      // Update cache
      this.contentCache.set(originalPath, contentString);
      
      // Encrypt content
      const publicKey = await this.encryptionService.readPublicKey();
      const encrypted = this.encryptionService.encryptContent(
        Buffer.from(contentString, 'utf8'),
        publicKey
      );
      
      // Write to original file (encrypted is already a string in line format)
      const fs = require('fs').promises;
      await fs.writeFile(originalPath, encrypted, 'utf8');
      
      // Fire change event
      this._emitter.fire([{ type: vscode.FileChangeType.Changed, uri }]);
      
      // Show confirmation
      const path = require('path');
      const fileName = path.basename(originalPath);
      vscode.window.showInformationMessage(`🔒 ${fileName} encrypted and saved`);
      
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to save: ${error.message}`);
      throw vscode.FileSystemError.NoPermissions(uri);
    }
  }

  async delete(uri, options) {
    // Not implemented - don't allow deleting through virtual FS
    throw vscode.FileSystemError.NoPermissions();
  }

  async rename(oldUri, newUri, options) {
    // Not implemented
    throw vscode.FileSystemError.NoPermissions();
  }

  /**
   * Clear cache for a file
   */
  clearCache(originalPath) {
    this.contentCache.delete(originalPath);
  }

  /**
   * Clear all cache
   */
  clearAllCache() {
    this.contentCache.clear();
  }
}

module.exports = DecryptedFileSystemProvider;
