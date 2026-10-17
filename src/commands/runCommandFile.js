const vscode = require('vscode');

/**
 * Escape a path for safe use in bash (single-quoted, apostrophe-safe).
 * @param {string} p
 * @returns {string}
 */
function shellSingleQuote(p) {
  return "'" + String(p).replace(/'/g, "'\"'\"'") + "'";
}

/**
 * Collect .command file paths from explorer selection or active editor.
 * @param {vscode.Uri} [uri]
 * @param {vscode.Uri[]} [allUris]
 * @returns {string[]}
 */
function resolveCommandPaths(uri, allUris) {
  if (allUris && allUris.length > 0) {
    return allUris
      .filter((u) => u.scheme === 'file' && u.fsPath.toLowerCase().endsWith('.command'))
      .map((u) => u.fsPath);
  }
  if (uri && uri.scheme === 'file' && uri.fsPath.toLowerCase().endsWith('.command')) {
    return [uri.fsPath];
  }
  const editor = vscode.window.activeTextEditor;
  if (
    editor &&
    editor.document.uri.scheme === 'file' &&
    editor.document.fileName.toLowerCase().endsWith('.command')
  ) {
    return [editor.document.uri.fsPath];
  }
  return [];
}

/**
 * Run one or more .command shell scripts in the integrated terminal (macOS/Linux).
 * @param {vscode.Uri} [uri]
 * @param {vscode.Uri[]} [allUris]
 */
function runCommandFile(uri, allUris) {
  const paths = resolveCommandPaths(uri, allUris);
  if (paths.length === 0) {
    vscode.window.showWarningMessage(
      'Select or open a .command file in the Explorer, or open one in the editor.'
    );
    return;
  }

  if (process.platform === 'win32') {
    vscode.window.showInformationMessage(
      '.command files are macOS/Linux shell scripts. On Windows, run them from Git Bash, WSL, or use a .bat / .ps1 script instead.'
    );
    return;
  }

  const term = vscode.window.createTerminal({
    name: paths.length === 1 ? 'Run .command' : `Run .command (${paths.length})`
  });
  term.show();

  const parts = paths.map((fsPath) => {
    const q = shellSingleQuote(fsPath);
    return `chmod +x ${q} && bash ${q}`;
  });
  term.sendText(parts.join(' ; echo "---" ; '));
}

module.exports = {
  runCommandFile
};
