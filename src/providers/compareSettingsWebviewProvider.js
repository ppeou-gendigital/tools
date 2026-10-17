const vscode = require('vscode');

/**
 * Webview provider for compare settings panel (form-based UI)
 */
class CompareSettingsWebviewProvider {
  constructor(workspaceService) {
    this.workspaceService = workspaceService;
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
        type: 'update', 
        config: this.workspaceService.getConfig()
      });
    }
  }

  async _handleMessage(message) {
    const config = this.workspaceService.getConfig();
    
    if (!config || !config.fileTools) {
      return;
    }

    switch (message.type) {
      case 'toggleIgnoreWhitespace':
        config.fileTools.compare = config.fileTools.compare || {};
        config.fileTools.compare.ignoreWhitespace = !config.fileTools.compare.ignoreWhitespace;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleIgnoreCase':
        config.fileTools.compare = config.fileTools.compare || {};
        config.fileTools.compare.ignoreCase = !config.fileTools.compare.ignoreCase;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleShowSideBySide':
        config.fileTools.compare = config.fileTools.compare || {};
        config.fileTools.compare.showSideBySide = !config.fileTools.compare.showSideBySide;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleIgnoreEmptyLines':
        config.fileTools.compare = config.fileTools.compare || {};
        config.fileTools.compare.ignoreEmptyLines = !config.fileTools.compare.ignoreEmptyLines;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleIgnoreLineEndings':
        config.fileTools.compare = config.fileTools.compare || {};
        config.fileTools.compare.ignoreLineEndings = !config.fileTools.compare.ignoreLineEndings;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleIgnoreTrailingWhitespace':
        config.fileTools.compare = config.fileTools.compare || {};
        config.fileTools.compare.ignoreTrailingWhitespace = !config.fileTools.compare.ignoreTrailingWhitespace;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleCharacterDiff':
        config.fileTools.compare = config.fileTools.compare || {};
        config.fileTools.compare.characterDiff = !config.fileTools.compare.characterDiff;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'updateContextLines':
        const lines = parseInt(message.value, 10);
        if (!isNaN(lines) && lines >= 0 && lines <= 20) {
          config.fileTools.compare = config.fileTools.compare || {};
          config.fileTools.compare.contextLines = lines;
          await this.workspaceService.saveConfig();
          this.refresh();
        }
        break;

      case 'requestUpdate':
        this.refresh();
        break;
    }
  }

  _getHtmlForWebview(webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compare Settings</title>
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
      margin-bottom: 12px;
    }
    
    .section-header {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--vscode-foreground);
      opacity: 0.6;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }
    
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 0;
      margin-bottom: 2px;
      cursor: pointer;
      font-size: 13px;
    }
    
    .setting-item:hover {
      opacity: 0.8;
    }
    
    .setting-label {
      font-weight: 400;
    }
    
    .toggle-switch {
      width: 36px;
      height: 18px;
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border);
      border-radius: 9px;
      position: relative;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .toggle-switch.active {
      background: var(--vscode-button-background);
      border-color: var(--vscode-button-background);
    }
    
    .toggle-switch::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--vscode-foreground);
      top: 1px;
      left: 1px;
      transition: transform 0.2s;
      opacity: 0.5;
    }
    
    .toggle-switch.active::after {
      transform: translateX(18px);
      opacity: 1;
    }
    
    .schedule-input {
      width: 100%;
      padding: 6px 10px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 2px;
      font-size: 13px;
      font-family: var(--vscode-font-family);
      height: 28px;
      box-sizing: border-box;
    }
    
    .schedule-input:focus {
      outline: 1px solid var(--vscode-focusBorder);
      outline-offset: -1px;
    }
    
    .schedule-input::placeholder {
      color: var(--vscode-input-placeholderForeground);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="section">
      <div class="section-header">COMPARISON OPTIONS</div>
      
      <div class="setting-item" onclick="toggleIgnoreWhitespace()">
        <span class="setting-label">Ignore Whitespace</span>
        <div class="toggle-switch" id="toggleIgnoreWhitespace"></div>
      </div>
      
      <div class="setting-item" onclick="toggleIgnoreCase()">
        <span class="setting-label">Ignore Case</span>
        <div class="toggle-switch" id="toggleIgnoreCase"></div>
      </div>
      
      <div class="setting-item" onclick="toggleIgnoreEmptyLines()">
        <span class="setting-label">Ignore Empty Lines</span>
        <div class="toggle-switch" id="toggleIgnoreEmptyLines"></div>
      </div>
      
      <div class="setting-item" onclick="toggleIgnoreLineEndings()">
        <span class="setting-label">Ignore Line Endings</span>
        <div class="toggle-switch" id="toggleIgnoreLineEndings"></div>
      </div>
      
      <div class="setting-item" onclick="toggleIgnoreTrailingWhitespace()">
        <span class="setting-label">Ignore Trailing Space</span>
        <div class="toggle-switch" id="toggleIgnoreTrailingWhitespace"></div>
      </div>
      
      <div class="setting-item" onclick="toggleShowSideBySide()">
        <span class="setting-label">Side-by-Side View</span>
        <div class="toggle-switch" id="toggleShowSideBySide"></div>
      </div>
      
      <div class="setting-item" onclick="toggleCharacterDiff()">
        <span class="setting-label">Character Diff</span>
        <div class="toggle-switch" id="toggleCharacterDiff"></div>
      </div>
      
      <div class="setting-item">
        <span class="setting-label">Context Lines</span>
        <input 
          type="number" 
          id="contextLinesInput"
          class="schedule-input" 
          style="width: 60px; text-align: right;"
          min="0" 
          max="20"
          onchange="updateContextLines(this.value)"
        />
      </div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    
    // Request initial update
    vscode.postMessage({ type: 'requestUpdate' });
    
    // Listen for updates from extension
    window.addEventListener('message', event => {
      const message = event.data;
      if (message.type === 'update') {
        updateUI(message.config);
      }
    });
    
    function updateUI(config) {
      if (!config || !config.fileTools) return;
      
      const compare = config.fileTools.compare || {};
      
      updateToggle('toggleIgnoreWhitespace', compare.ignoreWhitespace);
      updateToggle('toggleIgnoreCase', compare.ignoreCase);
      updateToggle('toggleIgnoreEmptyLines', compare.ignoreEmptyLines);
      updateToggle('toggleIgnoreLineEndings', compare.ignoreLineEndings);
      updateToggle('toggleIgnoreTrailingWhitespace', compare.ignoreTrailingWhitespace);
      updateToggle('toggleShowSideBySide', compare.showSideBySide !== false); // default true
      updateToggle('toggleCharacterDiff', compare.characterDiff);
      
      document.getElementById('contextLinesInput').value = compare.contextLines || 3;
    }
    
    function updateToggle(id, isActive) {
      const toggle = document.getElementById(id);
      if (toggle) {
        if (isActive) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }
      }
    }
    
    function toggleIgnoreWhitespace() {
      vscode.postMessage({ type: 'toggleIgnoreWhitespace' });
    }
    
    function toggleIgnoreCase() {
      vscode.postMessage({ type: 'toggleIgnoreCase' });
    }
    
    function toggleIgnoreEmptyLines() {
      vscode.postMessage({ type: 'toggleIgnoreEmptyLines' });
    }
    
    function toggleIgnoreLineEndings() {
      vscode.postMessage({ type: 'toggleIgnoreLineEndings' });
    }
    
    function toggleIgnoreTrailingWhitespace() {
      vscode.postMessage({ type: 'toggleIgnoreTrailingWhitespace' });
    }
    
    function toggleShowSideBySide() {
      vscode.postMessage({ type: 'toggleShowSideBySide' });
    }
    
    function toggleCharacterDiff() {
      vscode.postMessage({ type: 'toggleCharacterDiff' });
    }
    
    function updateContextLines(value) {
      vscode.postMessage({ type: 'updateContextLines', value: value });
    }
  </script>
</body>
</html>`;
  }
}

module.exports = CompareSettingsWebviewProvider;
