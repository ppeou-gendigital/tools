const vscode = require('vscode');
const path = require('path');
const { promptForLanguage, isMinifiable } = require('../utils/languageHelpers');
const { getCommandTarget } = require('../utils/commandHelpers');

/**
 * Format file(s) or selection - main entry point
 * @param {vscode.Uri} [uri] - File URI
 * @param {vscode.Uri[]} [allUris] - All selected files from explorer
 * @param {Object} fileToolsService
 * @param {Object} workspaceService
 */
async function formatFile(uri, allUris, fileToolsService, workspaceService) {
  const config = workspaceService?.getConfig();
  const formatOptions = config?.fileTools?.format || {};
  
  const target = getCommandTarget(uri, allUris);
  
  switch (target.type) {
    case 'files':
      await formatMultipleFiles(target.uris, fileToolsService, formatOptions);
      break;
    case 'selection':
      await formatSelection(target.editor, fileToolsService, formatOptions);
      break;
    case 'file':
      await formatSingleFile(target.uri, fileToolsService, formatOptions);
      break;
    default:
      vscode.window.showErrorMessage('No active editor or files selected');
  }
}

/**
 * Format a single file
 * @param {vscode.Uri} fileUri
 * @param {Object} fileToolsService
 * @param {Object} formatOptions
 */
async function formatSingleFile(fileUri, fileToolsService, formatOptions) {
  try {
    const document = await vscode.workspace.openTextDocument(fileUri);
    let language = fileToolsService.detectLanguage(document.fileName);
    
    // Prompt for language if unknown
    if (language === 'text') {
      language = await promptForLanguage('format');
      if (!language) return; // User cancelled or skipped
    }
    
    const code = document.getText();
    const formatted = await fileToolsService.formatCode(code, language, formatOptions);
    
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(code.length)
    );
    
    edit.replace(document.uri, fullRange, formatted);
    await vscode.workspace.applyEdit(edit);
    
    vscode.window.showInformationMessage(`✓ Formatted: ${path.basename(document.fileName)}`);
  } catch (error) {
    throw new Error(`${path.basename(fileUri.fsPath)}: ${error.message}`);
  }
}

/**
 * Format selected text in editor
 * @param {vscode.TextEditor} editor
 * @param {Object} fileToolsService
 * @param {Object} formatOptions
 */
async function formatSelection(editor, fileToolsService, formatOptions) {
  try {
    let language = fileToolsService.detectLanguage(editor.document.fileName);
    
    // Prompt for language if unknown
    if (language === 'text') {
      language = await promptForLanguage('format');
      if (!language) return; // User cancelled or skipped
    }
    
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    const formatted = await fileToolsService.formatCode(text, language, formatOptions);
    
    await editor.edit(editBuilder => {
      editBuilder.replace(selection, formatted);
    });
    
    vscode.window.showInformationMessage('✓ Selection formatted');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to format selection: ${error.message}`);
  }
}

/**
 * Format multiple files with progress indicator
 * @param {vscode.Uri[]} fileUris
 * @param {Object} fileToolsService
 * @param {Object} formatOptions
 */
async function formatMultipleFiles(fileUris, fileToolsService, formatOptions) {
  let successCount = 0;
  let failCount = 0;
  const errors = [];
  
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Formatting ${fileUris.length} file(s)...`,
    cancellable: true
  }, async (progress, token) => {
    
    for (let i = 0; i < fileUris.length; i++) {
      if (token.isCancellationRequested) {
        vscode.window.showWarningMessage(`Format cancelled (${successCount} completed, ${fileUris.length - i} skipped)`);
        break;
      }
      
      const fileUri = fileUris[i];
      const fileName = path.basename(fileUri.fsPath);
      
      progress.report({
        increment: (100 / fileUris.length),
        message: `${i + 1}/${fileUris.length}: ${fileName}`
      });
      
      try {
        const document = await vscode.workspace.openTextDocument(fileUri);
        const language = fileToolsService.detectLanguage(document.fileName);
        const code = document.getText();
        
        const formatted = await fileToolsService.formatCode(code, language, formatOptions);
        
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(code.length)
        );
        
        edit.replace(document.uri, fullRange, formatted);
        await vscode.workspace.applyEdit(edit);
        
        successCount++;
      } catch (error) {
        failCount++;
        errors.push(`${fileName}: ${error.message}`);
      }
    }
  });
  
  // Show summary
  if (successCount > 0 && failCount === 0) {
    vscode.window.showInformationMessage(`✓ Formatted ${successCount} file(s) successfully`);
  } else if (successCount > 0 && failCount > 0) {
    vscode.window.showWarningMessage(
      `Formatted ${successCount} file(s), ${failCount} failed`,
      'Show Errors'
    ).then(choice => {
      if (choice === 'Show Errors') {
        const errorMsg = errors.join('\n');
        vscode.window.showErrorMessage(errorMsg, { modal: true });
      }
    });
  } else if (failCount > 0) {
    vscode.window.showErrorMessage(`Failed to format ${failCount} file(s)`, 'Show Errors')
      .then(choice => {
        if (choice === 'Show Errors') {
          const errorMsg = errors.join('\n');
          vscode.window.showErrorMessage(errorMsg, { modal: true });
        }
      });
  }
}

/**
 * Minify file(s) or selection - main entry point
 * @param {vscode.Uri} [uri] - File URI
 * @param {vscode.Uri[]} [allUris] - All selected files from explorer
 * @param {Object} fileToolsService
 */
async function minifyFile(uri, allUris, fileToolsService) {
  const target = getCommandTarget(uri, allUris);
  
  switch (target.type) {
    case 'files':
      await minifyMultipleFiles(target.uris, fileToolsService);
      break;
    case 'selection':
      await minifySelection(target.editor, fileToolsService);
      break;
    case 'file':
      await minifySingleFile(target.uri, fileToolsService);
      break;
    default:
      vscode.window.showErrorMessage('No active editor or files selected');
  }
}

/**
 * Minify a single file
 * @param {vscode.Uri} fileUri
 * @param {Object} fileToolsService
 */
async function minifySingleFile(fileUri, fileToolsService) {
  try {
    const document = await vscode.workspace.openTextDocument(fileUri);
    let language = fileToolsService.detectLanguage(document.fileName);
    
    // Prompt for language if unknown or not minifiable
    if (language === 'text' || !isMinifiable(language)) {
      language = await promptForLanguage('minify');
      if (!language) return; // User cancelled or skipped
    }
    
    const code = document.getText();
    const minified = await fileToolsService.minifyCode(code, language);
    
    const originalSize = Buffer.byteLength(code, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(code.length)
    );
    
    edit.replace(document.uri, fullRange, minified);
    await vscode.workspace.applyEdit(edit);
    
    vscode.window.showInformationMessage(
      `✓ ${path.basename(document.fileName)}: Saved ${savings}% (${originalSize} → ${minifiedSize} bytes)`
    );
  } catch (error) {
    throw new Error(`${path.basename(fileUri.fsPath)}: ${error.message}`);
  }
}

/**
 * Minify selected text in editor
 * @param {vscode.TextEditor} editor
 * @param {Object} fileToolsService
 */
async function minifySelection(editor, fileToolsService) {
  try {
    let language = fileToolsService.detectLanguage(editor.document.fileName);
    
    // Prompt for language if unknown or not minifiable
    if (language === 'text' || !isMinifiable(language)) {
      language = await promptForLanguage('minify');
      if (!language) return; // User cancelled or skipped
    }
    
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    const minified = await fileToolsService.minifyCode(text, language);
    
    const originalSize = Buffer.byteLength(text, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    
    await editor.edit(editBuilder => {
      editBuilder.replace(selection, minified);
    });
    
    vscode.window.showInformationMessage(
      `✓ Selection minified: Saved ${savings}% (${originalSize} → ${minifiedSize} bytes)`
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to minify selection: ${error.message}`);
  }
}

/**
 * Minify multiple files with progress indicator
 * @param {vscode.Uri[]} fileUris
 * @param {Object} fileToolsService
 */
async function minifyMultipleFiles(fileUris, fileToolsService) {
  let successCount = 0;
  let failCount = 0;
  let totalOriginalSize = 0;
  let totalMinifiedSize = 0;
  const errors = [];
  
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Minifying ${fileUris.length} file(s)...`,
    cancellable: true
  }, async (progress, token) => {
    
    for (let i = 0; i < fileUris.length; i++) {
      if (token.isCancellationRequested) {
        vscode.window.showWarningMessage(`Minify cancelled (${successCount} completed, ${fileUris.length - i} skipped)`);
        break;
      }
      
      const fileUri = fileUris[i];
      const fileName = path.basename(fileUri.fsPath);
      
      progress.report({
        increment: (100 / fileUris.length),
        message: `${i + 1}/${fileUris.length}: ${fileName}`
      });
      
      try {
        const document = await vscode.workspace.openTextDocument(fileUri);
        const language = fileToolsService.detectLanguage(document.fileName);
        const code = document.getText();
        const originalSize = Buffer.byteLength(code, 'utf8');
        
        const minified = await fileToolsService.minifyCode(code, language);
        const minifiedSize = Buffer.byteLength(minified, 'utf8');
        
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(code.length)
        );
        
        edit.replace(document.uri, fullRange, minified);
        await vscode.workspace.applyEdit(edit);
        
        totalOriginalSize += originalSize;
        totalMinifiedSize += minifiedSize;
        successCount++;
      } catch (error) {
        failCount++;
        errors.push(`${fileName}: ${error.message}`);
      }
    }
  });
  
  // Show summary with total savings
  if (successCount > 0 && failCount === 0) {
    const totalSavings = ((1 - totalMinifiedSize / totalOriginalSize) * 100).toFixed(1);
    vscode.window.showInformationMessage(
      `✓ Minified ${successCount} file(s): Saved ${totalSavings}% (${totalOriginalSize} → ${totalMinifiedSize} bytes)`
    );
  } else if (successCount > 0 && failCount > 0) {
    const totalSavings = totalOriginalSize > 0 
      ? ((1 - totalMinifiedSize / totalOriginalSize) * 100).toFixed(1)
      : '0.0';
    vscode.window.showWarningMessage(
      `Minified ${successCount} file(s) (saved ${totalSavings}%), ${failCount} failed`,
      'Show Errors'
    ).then(choice => {
      if (choice === 'Show Errors') {
        const errorMsg = errors.join('\n');
        vscode.window.showErrorMessage(errorMsg, { modal: true });
      }
    });
  } else if (failCount > 0) {
    vscode.window.showErrorMessage(`Failed to minify ${failCount} file(s)`, 'Show Errors')
      .then(choice => {
        if (choice === 'Show Errors') {
          const errorMsg = errors.join('\n');
          vscode.window.showErrorMessage(errorMsg, { modal: true });
        }
      });
  }
}

module.exports = { formatFile, minifyFile };
