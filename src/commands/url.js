const vscode = require('vscode');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Download file from URL to selected folder
 * @param {vscode.Uri} folderUri - Selected folder URI
 */
async function openFromUrl(folderUri) {
  // If no folder selected, use workspace root
  let targetFolder;
  
  if (folderUri) {
    const stat = await fs.stat(folderUri.fsPath);
    targetFolder = stat.isDirectory() ? folderUri.fsPath : path.dirname(folderUri.fsPath);
  } else {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('No workspace folder open');
      return;
    }
    targetFolder = workspaceFolders[0].uri.fsPath;
  }
  
  // Prompt for URL
  const url = await vscode.window.showInputBox({
    prompt: 'Enter URL to download',
    placeHolder: 'https://example.com/file.json',
    validateInput: (value) => {
      if (!value) {
        return 'URL is required';
      }
      try {
        new URL(value);
        return null;
      } catch {
        return 'Invalid URL';
      }
    }
  });
  
  if (!url) {
    return;
  }
  
  // Extract filename from URL
  const urlObj = new URL(url);
  const defaultFilename = path.basename(urlObj.pathname) || 'downloaded-file.txt';
  
  // Prompt for filename
  const filename = await vscode.window.showInputBox({
    prompt: 'Enter filename',
    value: defaultFilename,
    validateInput: (value) => {
      if (!value) {
        return 'Filename is required';
      }
      if (value.includes('/') || value.includes('\\')) {
        return 'Filename cannot contain slashes';
      }
      return null;
    }
  });
  
  if (!filename) {
    return;
  }
  
  const filePath = path.join(targetFolder, filename);
  
  // Check if file exists
  try {
    await fs.access(filePath);
    const overwrite = await vscode.window.showWarningMessage(
      `File "${filename}" already exists. Overwrite?`,
      'Yes', 'No'
    );
    
    if (overwrite !== 'Yes') {
      return;
    }
  } catch {
    // File doesn't exist, continue
  }
  
  // Download file with progress
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Downloading ${filename}...`,
    cancellable: false
  }, async (progress) => {
    try {
      const content = await downloadFile(url, (downloaded, total) => {
        if (total > 0) {
          const percent = Math.round((downloaded / total) * 100);
          progress.report({ message: `${percent}%` });
        }
      });
      
      await fs.writeFile(filePath, content);
      
      vscode.window.showInformationMessage(`Downloaded: ${filename}`);
      
      // Ask if user wants to open the file
      const openFile = await vscode.window.showInformationMessage(
        'File downloaded successfully',
        'Open File', 'Show in Explorer'
      );
      
      if (openFile === 'Open File') {
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
      } else if (openFile === 'Show in Explorer') {
        await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(filePath));
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to download: ${error.message}`);
    }
  });
}

/**
 * Download file from URL
 * @param {string} url - URL to download from
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Buffer>}
 */
function downloadFile(url, onProgress) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, onProgress)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      const chunks = [];
      const totalSize = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedSize = 0;
      
      response.on('data', (chunk) => {
        chunks.push(chunk);
        downloadedSize += chunk.length;
        
        if (onProgress) {
          onProgress(downloadedSize, totalSize);
        }
      });
      
      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      
      response.on('error', reject);
    }).on('error', reject);
  });
}

module.exports = { openFromUrl };
