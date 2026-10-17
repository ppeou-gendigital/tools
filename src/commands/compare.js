const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let selectedFiles = [];

/**
 * @param {string} str
 * @returns {boolean}
 */
function isUrl(str) {
  return /^https?:\/\//i.test(str && str.trim());
}

/**
 * Resolve a file path to an absolute path and return a file URI.
 * @param {string} input - Path (absolute or relative to workspace/cwd)
 * @param {string} [workspaceRoot] - Workspace root for resolving relative paths
 * @returns {vscode.Uri}
 */
function resolveToFileUri(input, workspaceRoot) {
  const trimmed = input.trim();
  const root = workspaceRoot || (vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath) || process.cwd();
  const absolutePath = path.isAbsolute(trimmed) ? path.normalize(trimmed) : path.resolve(root, trimmed);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }
  return vscode.Uri.file(absolutePath);
}

/**
 * Compare two files - supports multi-select from explorer
 * @param {vscode.Uri} [uri] - File URI
 * @param {vscode.Uri[]} [allUris] - All selected files from explorer
 */
async function compareFiles(uri, allUris) {
  // Get all selected files from explorer
  const selectedUris = allUris || (uri ? [uri] : []);
  
  if (selectedUris.length === 2) {
    // Perfect! Compare them directly
    await openDiff(selectedUris[0], selectedUris[1]);
    return;
  }
  
  if (selectedUris.length > 2) {
    // Show quick pick to choose 2 from selection
    const items = selectedUris.map(u => ({
      label: path.basename(u.fsPath),
      description: path.relative(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', u.fsPath),
      uri: u
    }));
    
    // Pick first file
    const file1 = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select first file to compare',
      matchOnDescription: true
    });
    
    if (!file1) return;
    
    // Pick second file
    const remainingItems = items.filter(item => item.uri.fsPath !== file1.uri.fsPath);
    const file2 = await vscode.window.showQuickPick(remainingItems, {
      placeHolder: `Select second file to compare with ${file1.label}`,
      matchOnDescription: true
    });
    
    if (!file2) return;
    
    await openDiff(file1.uri, file2.uri);
    return;
  }
  
  if (selectedUris.length === 1) {
    // Single file selected - use old behavior (collect selections)
    selectedFiles.push(selectedUris[0]);
    
    if (selectedFiles.length === 1) {
      vscode.window.showInformationMessage('Select one more file to compare');
    } else if (selectedFiles.length === 2) {
      await openDiff(selectedFiles[0], selectedFiles[1]);
      selectedFiles = [];
    } else {
      // Reset if more than 2
      selectedFiles = [selectedUris[0]];
      vscode.window.showInformationMessage('Select one more file to compare');
    }
    return;
  }
  
  // No files selected - command palette
  const files = await vscode.window.showOpenDialog({
    canSelectMany: true,
    canSelectFiles: true,
    canSelectFolders: false,
    openLabel: 'Select 2 files to compare'
  });
  
  if (!files || files.length !== 2) {
    vscode.window.showErrorMessage('Please select exactly 2 files');
    return;
  }
  
  await openDiff(files[0], files[1]);
}

/**
 * Compare two URLs or file paths (or one of each).
 * @param {Object} fileToolsService
 * @param {string[]} [preselectedSources] - Optional array of 2 strings: URLs or file paths
 */
async function compareURLs(fileToolsService, preselectedSources = null) {
  let sources = preselectedSources;

  // If no preselected sources, ask user for input
  if (!sources || sources.length < 2) {
    const input = await vscode.window.showInputBox({
      prompt: 'Enter two URLs or file paths separated by comma',
      placeHolder: 'https://example.com/file1.js, ./local/file2.js',
      value: '',
      ignoreFocusOut: true
    });

    if (!input) return;

    sources = input.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  if (sources.length < 2) {
    vscode.window.showErrorMessage('Please provide two URLs or file paths separated by comma');
    return;
  }

  const source1 = sources[0];
  const source2 = sources[1];

  if (sources.length > 2) {
    vscode.window.showWarningMessage('More than 2 entries provided, comparing only the first two');
  }

  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

  try {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Preparing comparison...',
      cancellable: false
    }, async (progress) => {
      let uri1;
      let uri2;
      let result1 = null;
      let result2 = null;

      // First source: URL → download, path → resolve
      if (isUrl(source1)) {
        progress.report({ increment: 0, message: 'Downloading first file...' });
        result1 = await fileToolsService.downloadURLToTempSmart(source1, 'url1');
        uri1 = vscode.Uri.file(result1.path);
      } else {
        progress.report({ increment: 0, message: 'Resolving first file...' });
        uri1 = resolveToFileUri(source1, workspaceRoot);
      }

      // Second source: URL → download, path → resolve
      if (isUrl(source2)) {
        progress.report({ increment: 50, message: 'Downloading second file...' });
        result2 = await fileToolsService.downloadURLToTempSmart(source2, 'url2');
        uri2 = vscode.Uri.file(result2.path);
      } else {
        progress.report({ increment: 50, message: 'Resolving second file...' });
        uri2 = resolveToFileUri(source2, workspaceRoot);
      }

      // File type prompt only for downloaded URLs that defaulted to .txt
      if ((result1 && result1.extension === '.txt') || (result2 && result2.extension === '.txt')) {
        const selectedType = await vscode.window.showQuickPick(
          [
            { label: 'CSS', extension: '.css' },
            { label: 'JavaScript', extension: '.js' },
            { label: 'TypeScript', extension: '.ts' },
            { label: 'HTML', extension: '.html' },
            { label: 'JSON', extension: '.json' },
            { label: 'XML', extension: '.xml' },
            { label: 'Markdown', extension: '.md' },
            { label: 'YAML', extension: '.yaml' },
            { label: 'Python', extension: '.py' },
            { label: 'Text', extension: '.txt' }
          ],
          {
            placeHolder: 'Could not detect file type. Please select the file type:',
            ignoreFocusOut: true
          }
        );

        if (selectedType && selectedType.extension !== '.txt') {
          const fsp = require('fs').promises;
          if (result1 && result1.extension === '.txt') {
            const newPath1 = result1.path.replace(/\.txt$/, selectedType.extension);
            await fsp.rename(result1.path, newPath1);
            result1.path = newPath1;
            uri1 = vscode.Uri.file(newPath1);
          }
          if (result2 && result2.extension === '.txt') {
            const newPath2 = result2.path.replace(/\.txt$/, selectedType.extension);
            await fsp.rename(result2.path, newPath2);
            result2.path = newPath2;
            uri2 = vscode.Uri.file(newPath2);
          }
        }
      }

      progress.report({ increment: 100, message: 'Opening comparison...' });

      await openDiff(uri1, uri2, `${source1} ↔ ${source2}`);
    });
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to compare: ${error.message}`);
  }
}

/**
 * Open diff editor
 * @param {vscode.Uri} uri1
 * @param {vscode.Uri} uri2
 * @param {string} [title]
 */
async function openDiff(uri1, uri2, title) {
  const diffTitle = title || `${uri1.fsPath} ↔ ${uri2.fsPath}`;
  
  await vscode.commands.executeCommand(
    'vscode.diff',
    uri1,
    uri2,
    diffTitle
  );
}

/**
 * Extract URLs and file paths from text (split by newlines and commas).
 * @param {string} text
 * @returns {string[]}
 */
function extractSourcesFromText(text) {
  return text.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Compare two URLs or file paths from selected text.
 * Extracts URLs and paths from selection (comma or newline separated).
 * @param {Object} fileToolsService
 */
async function compareURLsFromSelection(fileToolsService) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  const selectedText = editor.document.getText(editor.selection);

  if (!selectedText) {
    vscode.window.showErrorMessage('No text selected. Please select 2 URLs or file paths (comma or newline separated).');
    return;
  }

  const sources = extractSourcesFromText(selectedText);

  if (sources.length < 2) {
    vscode.window.showErrorMessage(
      `Found ${sources.length} item(s) in selection. Please select at least 2 URLs or file paths.`
    );
    return;
  }

  if (sources.length > 2) {
    vscode.window.showInformationMessage(`Found ${sources.length} items. Comparing the first two.`);
  }

  await compareURLs(fileToolsService, sources);
}

module.exports = { compareFiles, compareURLs, compareURLsFromSelection };
