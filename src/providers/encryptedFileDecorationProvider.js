const vscode = require('vscode');

/**
 * File Decoration Provider for encrypted files
 */
class EncryptedFileDecorationProvider {
  constructor(encryptionService) {
    this.encryptionService = encryptionService;
    this._onDidChangeFileDecorations = new vscode.EventEmitter();
    this.onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;
  }

  async provideFileDecoration(uri) {
    // Only check regular file URIs
    if (uri.scheme !== 'file') {
      return undefined;
    }
    
    try {
      const isEncrypted = await this.encryptionService.isEncrypted(uri.fsPath);
      
      if (isEncrypted) {
        return {
          badge: '🔒',
          tooltip: 'Encrypted File',
          propagate: false
        };
      }
    } catch (error) {
      // Ignore errors (file might not exist, etc.)
    }
    
    return undefined;
  }

  refresh() {
    this._onDidChangeFileDecorations.fire(undefined);
  }
}

module.exports = EncryptedFileDecorationProvider;
