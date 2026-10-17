const vscode = require('vscode');

/**
 * Convert JavaScript object to JSON (works on selection or entire file)
 */
async function jsToJson() {
  const editor = vscode.window.activeTextEditor;
  
  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }
  
  const selection = editor.selection;
  const hasSelection = !selection.isEmpty;
  
  // Use selection if exists, otherwise use entire document
  const range = hasSelection 
    ? selection 
    : new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
      );
  
  const text = editor.document.getText(range);
  
  if (!text) {
    vscode.window.showErrorMessage('No text to convert');
    return;
  }
  
  try {
    // Try to evaluate the JS object
    // Use Function constructor to safely evaluate
    const jsObject = new Function('return ' + text)();
    
    // Convert to JSON
    const jsonText = JSON.stringify(jsObject, null, 2);
    
    // Replace text with JSON
    await editor.edit(editBuilder => {
      editBuilder.replace(range, jsonText);
    });
    
    const target = hasSelection ? 'Selection' : 'File';
    vscode.window.showInformationMessage(`✓ ${target} converted to JSON`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to convert: ${error.message}`);
  }
}

/**
 * Convert JSON to JavaScript object (works on selection or entire file)
 */
async function jsonToJs() {
  const editor = vscode.window.activeTextEditor;
  
  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }
  
  const selection = editor.selection;
  const hasSelection = !selection.isEmpty;
  
  // Use selection if exists, otherwise use entire document
  const range = hasSelection 
    ? selection 
    : new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
      );
  
  const text = editor.document.getText(range);
  
  if (!text) {
    vscode.window.showErrorMessage('No text to convert');
    return;
  }
  
  try {
    // Parse JSON
    const jsonObject = JSON.parse(text);
    
    // Convert to JS object literal string
    const jsText = convertToJsObject(jsonObject);
    
    // Replace text with JS object
    await editor.edit(editBuilder => {
      editBuilder.replace(range, jsText);
    });
    
    const target = hasSelection ? 'Selection' : 'File';
    vscode.window.showInformationMessage(`✓ ${target} converted to JS object`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to convert: ${error.message}`);
  }
}

/**
 * Convert parsed JSON to JS object literal string
 * @param {*} obj - Parsed JSON object
 * @param {number} indent - Current indentation level
 * @returns {string}
 */
function convertToJsObject(obj, indent = 0) {
  const indentStr = '  '.repeat(indent);
  const nextIndentStr = '  '.repeat(indent + 1);
  
  if (obj === null) {
    return 'null';
  }
  
  if (obj === undefined) {
    return 'undefined';
  }
  
  if (typeof obj === 'string') {
    // Use single quotes for strings
    return "'" + obj.replace(/'/g, "\\'") + "'";
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj);
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return '[]';
    }
    
    const items = obj.map(item => nextIndentStr + convertToJsObject(item, indent + 1));
    return '[\n' + items.join(',\n') + '\n' + indentStr + ']';
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    
    if (keys.length === 0) {
      return '{}';
    }
    
    const items = keys.map(key => {
      // Check if key needs quotes (e.g., has spaces, special chars, starts with number)
      const needsQuotes = !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
      const keyStr = needsQuotes ? `'${key}'` : key;
      const value = convertToJsObject(obj[key], indent + 1);
      return nextIndentStr + keyStr + ': ' + value;
    });
    
    return '{\n' + items.join(',\n') + '\n' + indentStr + '}';
  }
  
  return String(obj);
}

module.exports = {
  jsToJson,
  jsonToJs
};
