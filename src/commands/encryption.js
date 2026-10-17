const vscode = require('vscode');
const path = require('path');

async function openEncryptionSettings() {
  await vscode.commands.executeCommand('workbench.action.openSettings', 'notas.encryption');
}

/**
 * Lock (encrypt) a file
 * @param {Object} services - Services object
 * @param {Object} providers - Providers object
 * @param {vscode.Uri} fileUri - File URI
 */
async function lockFile(services, providers, fileUri) {
  try {
    const filePath = fileUri.fsPath;
    const fileName = path.basename(filePath);
    
    // Check if keys are configured
    const keysConfigured = await services.encryption.areKeysConfigured();
    if (!keysConfigured) {
      const choice = await vscode.window.showErrorMessage(
        'Encryption keys not configured. Please configure your public and private key paths.',
        'Open Settings'
      );
      
      if (choice === 'Open Settings') {
        await openEncryptionSettings();
      }
      return;
    }
    
    // Save any open editors for this file (including decrypted views) but don't close
    for (const editor of vscode.window.visibleTextEditors) {
      const editorPath = editor.document.uri.scheme === 'decrypted'
        ? editor.document.uri.path 
        : editor.document.uri.fsPath;
      
      if (editorPath === filePath) {
        // Save if dirty
        if (editor.document.isDirty) {
          await editor.document.save();
        }
      }
    }
    
    // Also save all just to be safe
    await vscode.workspace.saveAll(false);
    
    // Small delay to ensure file is written
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Confirm action
    const confirm = await vscode.window.showWarningMessage(
      `Encrypt "${fileName}"?`,
      'Lock File', 'Cancel'
    );
    
    if (confirm !== 'Lock File') {
      return;
    }
    
    // Encrypt file
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Encrypting ${fileName}...`,
      cancellable: false
    }, async () => {
      await services.encryption.encryptFile(filePath);
      
      // Clear cache for this file to ensure fresh read on next unlock
      if (providers.decryptedFileSystem) {
        providers.decryptedFileSystem.clearCache(filePath);
      }
    });
    
    vscode.window.showInformationMessage(`🔒 ${fileName} encrypted successfully`);
    
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to encrypt file: ${error.message}`);
  }
}

/**
 * Unlock (decrypt) a file and open in editor
 * @param {Object} services - Services object
 * @param {Object} providers - Providers object
 * @param {vscode.Uri} fileUri - File URI
 */
async function unlockFile(services, providers, fileUri) {
  try {
    const filePath = fileUri.fsPath;
    const fileName = path.basename(filePath);
    
    // Check if keys are configured
    const keysConfigured = await services.encryption.areKeysConfigured();
    if (!keysConfigured) {
      const choice = await vscode.window.showErrorMessage(
        'Encryption keys not configured. Please configure your public and private key paths.',
        'Open Settings'
      );
      
      if (choice === 'Open Settings') {
        await openEncryptionSettings();
      }
      return;
    }
    
    // Clear cache to ensure we read fresh content from disk
    if (providers.decryptedFileSystem) {
      providers.decryptedFileSystem.clearCache(filePath);
    }
    
    // Open decrypted view (no check - just try to decrypt)
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Decrypting ${fileName}...`,
      cancellable: false
    }, async () => {
      // Create virtual URI for decrypted content
      // Use proper URI format for FileSystemProvider
      const decryptedUri = vscode.Uri.parse(`decrypted:${filePath}`).with({
        scheme: 'decrypted',
        path: filePath
      });
      
      // Open in editor with explicit edit mode
      const doc = await vscode.workspace.openTextDocument(decryptedUri);
      await vscode.window.showTextDocument(doc, {
        preview: false,
        viewColumn: vscode.ViewColumn.Active,
        preserveFocus: false
      });
      
      // Force the document to be editable by setting it as dirty if needed
      // This is a workaround to ensure VS Code treats it as editable
      if (!doc.isDirty) {
        const edit = new vscode.WorkspaceEdit();
        // Make a no-op edit to mark as editable
        edit.insert(doc.uri, new vscode.Position(0, 0), '');
        edit.delete(doc.uri, new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));
        await vscode.workspace.applyEdit(edit);
      }
    });
    
    vscode.window.showInformationMessage(`🔓 ${fileName} opened (decrypted view)`);
    
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to decrypt file: ${error.message}`);
  }
}

module.exports = {
  lockFile,
  unlockFile
};
