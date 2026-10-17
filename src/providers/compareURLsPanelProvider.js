const vscode = require('vscode');

/**
 * Compare URLs panel - Quick URL comparison tool
 */
class CompareURLsPanelProvider {
  constructor() {
    this._view = null;
  }

  resolveWebviewView(webviewView, context, _token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: []
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      await this._handleMessage(message);
    });
  }

  async _handleMessage(message) {
    if (message.type === 'compareURLs') {
      await this._compareURLs(message.urls);
    }
  }

  async _compareURLs(urlsText) {
    if (!urlsText || !urlsText.trim()) {
      vscode.window.showErrorMessage('Please enter URLs or file paths to compare');
      return;
    }

    // Extract sources: split by newlines and commas
    const sources = urlsText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);

    if (sources.length < 2) {
      vscode.window.showErrorMessage(`Found ${sources.length} item(s). Please enter at least 2 URLs or file paths.`);
      return;
    }

    if (sources.length > 2) {
      vscode.window.showInformationMessage(`Found ${sources.length} items. Comparing the first two.`);
    }

    await vscode.commands.executeCommand('notas.compareURLsWithArgs', sources);
  }

  _getHtmlForWebview(webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compare URLs or Paths</title>
  <style>
    body {
      padding: 10px;
      color: var(--vscode-foreground);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
    }
    
    button {
      width: 100%;
      padding: 4px 8px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      cursor: pointer;
      border-radius: 2px;
      margin-bottom: 8px;
      font-size: 11px;
    }
    
    button:hover {
      background: var(--vscode-button-hoverBackground);
    }
    
    textarea {
      width: 100%;
      min-height: 120px;
      padding: 8px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 12px;
      resize: vertical;
      margin-bottom: 8px;
      box-sizing: border-box;
    }
    
    textarea:focus {
      outline: 1px solid var(--vscode-focusBorder);
    }
    
    textarea::placeholder {
      opacity: 0.5;
    }
    
    .help-text {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 8px;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <textarea 
    id="urlsInput" 
    placeholder="Enter URLs or file paths (comma or newline):
https://example.com/file1.css, ./local/file2.css"
  ></textarea>
  
  <button onclick="compareURLs()">🔍 Compare URLs or Paths</button>
  
  <div class="help-text">
    Enter 2 or more URLs or file paths to compare (URLs are downloaded; paths open from disk)
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    
    function compareURLs() {
      const urls = document.getElementById('urlsInput').value;
      vscode.postMessage({ type: 'compareURLs', urls });
    }
  </script>
</body>
</html>`;
  }
}

module.exports = CompareURLsPanelProvider;
