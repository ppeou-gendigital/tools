const vscode = require('vscode');

/**
 * Determine the target for a command (file or selection)
 * @param {vscode.Uri} [uri] - URI from command
 * @param {vscode.Uri[]} [allUris] - Multiple URIs from explorer
 * @returns {Object} Target information
 */
function getCommandTarget(uri, allUris) {
  // Multiple files from explorer
  if (allUris && allUris.length > 0) {
    return {
      type: 'files',
      uris: allUris
    };
  }
  
  // Check for active selection in editor
  const editor = vscode.window.activeTextEditor;
  if (editor && !editor.selection.isEmpty) {
    return {
      type: 'selection',
      editor: editor,
      selection: editor.selection
    };
  }
  
  // Single file from explorer
  if (uri) {
    return {
      type: 'file',
      uri: uri
    };
  }
  
  // Active editor without selection
  if (editor) {
    return {
      type: 'file',
      uri: editor.document.uri
    };
  }
  
  // No target found
  return {
    type: 'none'
  };
}

module.exports = {
  getCommandTarget
};
