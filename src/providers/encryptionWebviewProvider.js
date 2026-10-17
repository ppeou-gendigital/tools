const vscode = require('vscode');
const os = require('os');

/**
 * Webview provider for encryption settings
 */
class EncryptionWebviewProvider {
  constructor(encryptionService) {
    this.encryptionService = encryptionService;
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

    // Refresh content
    this.refresh();
  }

  refresh() {
    if (this._view) {
      this._view.webview.postMessage({ 
        type: 'requestPaths'
      });
    }
  }

  async _handleMessage(message) {
    switch (message.type) {
      case 'requestPaths':
        await this.sendCurrentPaths();
        break;

      case 'browsePublicKey':
        await this.browsePublicKey();
        break;

      case 'browsePrivateKey':
        await this.browsePrivateKey();
        break;

      case 'setPublicKey':
        await this.setPublicKey(message.path);
        break;

      case 'setPrivateKey':
        await this.setPrivateKey(message.path);
        break;
    }
  }

  async sendCurrentPaths() {
    const publicKeyPath = await this.encryptionService.getPublicKeyPath();
    const privateKeyPath = await this.encryptionService.getPrivateKeyPath();
    
    if (this._view) {
      this._view.webview.postMessage({
        type: 'updatePaths',
        publicKeyPath: publicKeyPath || '',
        privateKeyPath: privateKeyPath || ''
      });
    }
  }

  async browsePublicKey() {
    const result = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: 'Select Public Key',
      title: 'Select Public Key File',
      filters: {
        'Key Files': ['pem', 'pub', 'key'],
        'All Files': ['*']
      }
    });

    if (result && result[0]) {
      await this.setPublicKey(result[0].fsPath);
    }
  }

  async browsePrivateKey() {
    const result = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: 'Select Private Key',
      title: 'Select Private Key File',
      filters: {
        'Key Files': ['pem', 'key'],
        'All Files': ['*']
      }
    });

    if (result && result[0]) {
      await this.setPrivateKey(result[0].fsPath);
    }
  }

  async setPublicKey(path) {
    try {
      await this.encryptionService.setPublicKeyPath(path);
      vscode.window.showInformationMessage('Public key path saved');
      await this.sendCurrentPaths();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to set public key: ${error.message}`);
    }
  }

  async setPrivateKey(path) {
    try {
      await this.encryptionService.setPrivateKeyPath(path);
      vscode.window.showInformationMessage('Private key path saved');
      await this.sendCurrentPaths();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to set private key: ${error.message}`);
    }
  }

  _getHtmlForWebview(webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Encryption Settings</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      padding: 0;
      margin: 0;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
    }
    
    .container {
      padding: 8px 16px;
    }
    
    .section {
      margin-bottom: 16px;
    }
    
    .section-header {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--vscode-foreground);
      opacity: 0.6;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    
    .info-box {
      background: var(--vscode-textBlockQuote-background);
      border-left: 3px solid var(--vscode-textBlockQuote-border);
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 12px;
      line-height: 1.5;
    }
    
    .key-input-group {
      margin-bottom: 12px;
    }
    
    .key-label {
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 4px;
      display: block;
    }
    
    .key-input-row {
      display: flex;
      gap: 4px;
    }
    
    .key-input {
      flex: 1;
      padding: 4px 8px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 2px;
      font-size: 12px;
      font-family: var(--vscode-editor-font-family);
      min-width: 0;
    }
    
    .key-input:focus {
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: -1px;
    }
    
    .browse-button {
      padding: 4px 12px;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }
    
    .browse-button:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    
    .status-indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
    
    .status-indicator.configured {
      background: #4ec9b0;
    }
    
    .status-indicator.not-configured {
      background: #858585;
    }
    
    .status-text {
      font-size: 12px;
      margin-top: 4px;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="info-box">
      🔐 Configure paths to your RSA public and private key files. You can use existing SSH keys or generate new ones with OpenSSL.
    </div>
    
    <div class="section">
      <div class="section-header">PUBLIC KEY</div>
      <div class="key-input-group">
        <label class="key-label">Public Key Path</label>
        <div class="key-input-row">
          <input 
            type="text" 
            id="publicKeyPath" 
            class="key-input" 
            placeholder="e.g., ~/.ssh/id_rsa.pub"
            readonly
          />
          <button class="browse-button" onclick="browsePublicKey()">Browse...</button>
        </div>
        <div class="status-text">
          <span class="status-indicator" id="publicKeyStatus"></span>
          <span id="publicKeyStatusText">Not configured</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">PRIVATE KEY</div>
      <div class="key-input-group">
        <label class="key-label">Private Key Path</label>
        <div class="key-input-row">
          <input 
            type="text" 
            id="privateKeyPath" 
            class="key-input" 
            placeholder="e.g., ~/.ssh/id_rsa"
            readonly
          />
          <button class="browse-button" onclick="browsePrivateKey()">Browse...</button>
        </div>
        <div class="status-text">
          <span class="status-indicator" id="privateKeyStatus"></span>
          <span id="privateKeyStatusText">Not configured</span>
        </div>
      </div>
    </div>
    
    <div class="info-box" style="margin-top: 16px;">
      <strong>How to generate keys:</strong><br/>
      <code style="font-size: 11px;">openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048</code><br/>
      <code style="font-size: 11px;">openssl rsa -in private.pem -pubout -out public.pem</code>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    
    // Request initial paths
    vscode.postMessage({ type: 'requestPaths' });
    
    // Listen for updates from extension
    window.addEventListener('message', event => {
      const message = event.data;
      
      if (message.type === 'updatePaths') {
        updateUI(message.publicKeyPath, message.privateKeyPath);
      }
    });
    
    function updateUI(publicKeyPath, privateKeyPath) {
      // Update public key
      const publicKeyInput = document.getElementById('publicKeyPath');
      const publicKeyStatus = document.getElementById('publicKeyStatus');
      const publicKeyStatusText = document.getElementById('publicKeyStatusText');
      
      if (publicKeyPath) {
        publicKeyInput.value = publicKeyPath;
        publicKeyStatus.className = 'status-indicator configured';
        publicKeyStatusText.textContent = 'Configured';
      } else {
        publicKeyInput.value = '';
        publicKeyStatus.className = 'status-indicator not-configured';
        publicKeyStatusText.textContent = 'Not configured';
      }
      
      // Update private key
      const privateKeyInput = document.getElementById('privateKeyPath');
      const privateKeyStatus = document.getElementById('privateKeyStatus');
      const privateKeyStatusText = document.getElementById('privateKeyStatusText');
      
      if (privateKeyPath) {
        privateKeyInput.value = privateKeyPath;
        privateKeyStatus.className = 'status-indicator configured';
        privateKeyStatusText.textContent = 'Configured';
      } else {
        privateKeyInput.value = '';
        privateKeyStatus.className = 'status-indicator not-configured';
        privateKeyStatusText.textContent = 'Not configured';
      }
    }
    
    function browsePublicKey() {
      vscode.postMessage({ type: 'browsePublicKey' });
    }
    
    function browsePrivateKey() {
      vscode.postMessage({ type: 'browsePrivateKey' });
    }
  </script>
</body>
</html>`;
  }
}

module.exports = EncryptionWebviewProvider;
