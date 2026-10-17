const vscode = require('vscode');

/**
 * Webview provider for format settings panel (form-based UI)
 */
class FormatSettingsWebviewProvider {
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
      case 'updateIndentSize':
        const size = parseInt(message.value, 10);
        if (!isNaN(size) && size >= 1 && size <= 8) {
          config.fileTools.format.indentSize = size;
          await this.workspaceService.saveConfig();
          this.refresh();
        }
        break;

      case 'updateLineWidth':
        const width = parseInt(message.value, 10);
        if (!isNaN(width) && width >= 40 && width <= 200) {
          config.fileTools.format.printWidth = width;
          await this.workspaceService.saveConfig();
          this.refresh();
        }
        break;

      case 'toggleIndentType':
        config.fileTools.format.indentType = config.fileTools.format.indentType === 'spaces' ? 'tabs' : 'spaces';
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleQuoteStyle':
        config.fileTools.format.singleQuote = !config.fileTools.format.singleQuote;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleSemicolons':
        config.fileTools.format.semi = !config.fileTools.format.semi;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleTrailingCommas':
        config.fileTools.format.trailingComma = config.fileTools.format.trailingComma === 'none' ? 'es5' : 'none';
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleBracketSpacing':
        config.fileTools.format.bracketSpacing = !config.fileTools.format.bracketSpacing;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleArrowParens':
        config.fileTools.format.arrowParens = config.fileTools.format.arrowParens === 'always' ? 'avoid' : 'always';
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleEndOfLine':
        config.fileTools.format.endOfLine = config.fileTools.format.endOfLine === 'lf' ? 'crlf' : 'lf';
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleWrapAttributes':
        const wrapOptions = ['auto', 'force', 'force-aligned', 'force-expand-multiline'];
        const currentIndex = wrapOptions.indexOf(config.fileTools.format.wrapAttributes || 'auto');
        const nextIndex = (currentIndex + 1) % wrapOptions.length;
        config.fileTools.format.wrapAttributes = wrapOptions[nextIndex];
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleOnePropertyPerLine':
        config.fileTools.format.onePropertyPerLine = !config.fileTools.format.onePropertyPerLine;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'togglePrettyPrintSameLine':
        config.fileTools.format.prettyPrint = config.fileTools.format.prettyPrint || {};
        config.fileTools.format.prettyPrint.sameLine = !config.fileTools.format.prettyPrint.sameLine;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'togglePrettyPrintSelfClose':
        config.fileTools.format.prettyPrint = config.fileTools.format.prettyPrint || {};
        config.fileTools.format.prettyPrint.selfCloseTags = !config.fileTools.format.prettyPrint.selfCloseTags;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'togglePrettyPrintPreserveNewlines':
        config.fileTools.format.prettyPrint = config.fileTools.format.prettyPrint || {};
        config.fileTools.format.prettyPrint.preserveNewlines = !config.fileTools.format.prettyPrint.preserveNewlines;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyRemoveComments':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.removeComments = !config.fileTools.format.minify.removeComments;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyRemoveWhitespace':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.removeWhitespace = !config.fileTools.format.minify.removeWhitespace;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyShortNames':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.shortenNames = !config.fileTools.format.minify.shortenNames;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyRemoveConsole':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.removeConsole = !config.fileTools.format.minify.removeConsole;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyRemoveDebugger':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.removeDebugger = !config.fileTools.format.minify.removeDebugger;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyKeepFunctionNames':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.keepFunctionNames = !config.fileTools.format.minify.keepFunctionNames;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyKeepClassNames':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.keepClassNames = !config.fileTools.format.minify.keepClassNames;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyCompress':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.compress = !config.fileTools.format.minify.compress;
        await this.workspaceService.saveConfig();
        this.refresh();
        break;

      case 'toggleMinifyDeadCode':
        config.fileTools.format.minify = config.fileTools.format.minify || {};
        config.fileTools.format.minify.deadCodeElimination = !config.fileTools.format.minify.deadCodeElimination;
        await this.workspaceService.saveConfig();
        this.refresh();
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
  <title>Format Settings</title>
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
    
    .setting-value {
      color: var(--vscode-foreground);
      opacity: 0.6;
      font-size: 12px;
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
    
    .divider {
      height: 1px;
      background: var(--vscode-panel-border);
      margin: 10px -16px;
      opacity: 0.2;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="section">
      <div class="section-header">PRETTY PRINT</div>
      
      <div class="setting-item" onclick="toggleIndentType()">
        <span class="setting-label">Indent Type</span>
        <span class="setting-value" id="indentType">-</span>
      </div>
      
      <div class="setting-item">
        <span class="setting-label">Indent Size</span>
        <input 
          type="number" 
          id="indentSizeInput"
          class="schedule-input" 
          style="width: 60px; text-align: right;"
          min="1" 
          max="8"
          onchange="updateIndentSize(this.value)"
        />
      </div>
      
      <div class="setting-item">
        <span class="setting-label">Line Width</span>
        <input 
          type="number" 
          id="lineWidthInput"
          class="schedule-input" 
          style="width: 80px; text-align: right;"
          min="40" 
          max="200"
          onchange="updateLineWidth(this.value)"
        />
      </div>
      
      <div class="setting-item" onclick="toggleQuoteStyle()">
        <span class="setting-label">Quote Style</span>
        <span class="setting-value" id="quoteStyle">-</span>
      </div>
      
      <div class="setting-item" onclick="toggleSemicolons()">
        <span class="setting-label">Semicolons</span>
        <div class="toggle-switch" id="toggleSemicolons"></div>
      </div>
      
      <div class="setting-item" onclick="toggleTrailingCommas()">
        <span class="setting-label">Trailing Commas</span>
        <div class="toggle-switch" id="toggleTrailingCommas"></div>
      </div>
      
      <div class="setting-item" onclick="toggleBracketSpacing()">
        <span class="setting-label">Bracket Spacing</span>
        <div class="toggle-switch" id="toggleBracketSpacing"></div>
      </div>
      
      <div class="setting-item" onclick="toggleArrowParens()">
        <span class="setting-label">Arrow Parens</span>
        <span class="setting-value" id="arrowParens">-</span>
      </div>
      
      <div class="setting-item" onclick="toggleEndOfLine()">
        <span class="setting-label">End of Line</span>
        <span class="setting-value" id="endOfLine">-</span>
      </div>
      
      <div class="setting-item" onclick="togglePrettyPrintSameLine()">
        <span class="setting-label">Same Line Tags</span>
        <div class="toggle-switch" id="toggleSameLine"></div>
      </div>
      
      <div class="setting-item" onclick="togglePrettyPrintSelfClose()">
        <span class="setting-label">Self-Close Tags</span>
        <div class="toggle-switch" id="toggleSelfClose"></div>
      </div>
      
      <div class="setting-item" onclick="togglePrettyPrintPreserveNewlines()">
        <span class="setting-label">Preserve Newlines</span>
        <div class="toggle-switch" id="togglePreserveNewlines"></div>
      </div>
      
      <div class="setting-item" onclick="toggleWrapAttributes()">
        <span class="setting-label">Wrap Attributes</span>
        <span class="setting-value" id="wrapAttributes">-</span>
      </div>
      
      <div class="setting-item" onclick="toggleOnePropertyPerLine()">
        <span class="setting-label">One Property Per Line</span>
        <div class="toggle-switch" id="toggleOnePropertyPerLine"></div>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="section">
      <div class="section-header">MINIFY</div>
      
      <div class="setting-item" onclick="toggleMinifyRemoveComments()">
        <span class="setting-label">Remove Comments</span>
        <div class="toggle-switch" id="toggleRemoveComments"></div>
      </div>
      
      <div class="setting-item" onclick="toggleMinifyRemoveWhitespace()">
        <span class="setting-label">Remove Whitespace</span>
        <div class="toggle-switch" id="toggleRemoveWhitespace"></div>
      </div>
      
      <div class="setting-item" onclick="toggleMinifyShortNames()">
        <span class="setting-label">Shorten Names</span>
        <div class="toggle-switch" id="toggleShortNames"></div>
      </div>
      
      <div class="setting-item" onclick="toggleMinifyRemoveConsole()">
        <span class="setting-label">Remove Console</span>
        <div class="toggle-switch" id="toggleRemoveConsole"></div>
      </div>
      
      <div class="setting-item" onclick="toggleMinifyRemoveDebugger()">
        <span class="setting-label">Remove Debugger</span>
        <div class="toggle-switch" id="toggleRemoveDebugger"></div>
      </div>
      
      <div class="setting-item" onclick="toggleMinifyKeepFunctionNames()">
        <span class="setting-label">Keep Function Names</span>
        <div class="toggle-switch" id="toggleKeepFunctionNames"></div>
      </div>
      
      <div class="setting-item" onclick="toggleMinifyKeepClassNames()">
        <span class="setting-label">Keep Class Names</span>
        <div class="toggle-switch" id="toggleKeepClassNames"></div>
      </div>
      
      <div class="setting-item" onclick="toggleMinifyCompress()">
        <span class="setting-label">Advanced Compress</span>
        <div class="toggle-switch" id="toggleCompress"></div>
      </div>
      
      <div class="setting-item" onclick="toggleMinifyDeadCode()">
        <span class="setting-label">Dead Code Elimination</span>
        <div class="toggle-switch" id="toggleDeadCode"></div>
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
      
      const format = config.fileTools.format || {};
      const prettyPrint = format.prettyPrint || {};
      const minify = format.minify || {};
      
      // Update Pretty Print settings
      document.getElementById('indentType').textContent = format.indentType === 'tabs' ? 'Tabs' : 'Spaces';
      document.getElementById('indentSizeInput').value = format.indentSize || 2;
      document.getElementById('lineWidthInput').value = format.printWidth || 120;
      document.getElementById('quoteStyle').textContent = format.singleQuote ? "Single (')" : 'Double (")';
      document.getElementById('arrowParens').textContent = format.arrowParens === 'always' ? 'Always' : 'Avoid';
      document.getElementById('endOfLine').textContent = format.endOfLine === 'crlf' ? 'CRLF' : 'LF';
      document.getElementById('wrapAttributes').textContent = getWrapAttributesLabel(format.wrapAttributes);
      
      updateToggle('toggleSemicolons', format.semi);
      updateToggle('toggleTrailingCommas', format.trailingComma !== 'none');
      updateToggle('toggleBracketSpacing', format.bracketSpacing !== false);
      updateToggle('toggleSameLine', prettyPrint.sameLine);
      updateToggle('toggleSelfClose', prettyPrint.selfCloseTags);
      updateToggle('togglePreserveNewlines', prettyPrint.preserveNewlines);
      updateToggle('toggleOnePropertyPerLine', format.onePropertyPerLine);
      
      // Update Minify settings
      updateToggle('toggleRemoveComments', minify.removeComments !== false); // default true
      updateToggle('toggleRemoveWhitespace', minify.removeWhitespace !== false); // default true
      updateToggle('toggleShortNames', minify.shortenNames);
      updateToggle('toggleRemoveConsole', minify.removeConsole);
      updateToggle('toggleRemoveDebugger', minify.removeDebugger);
      updateToggle('toggleKeepFunctionNames', minify.keepFunctionNames);
      updateToggle('toggleKeepClassNames', minify.keepClassNames);
      updateToggle('toggleCompress', minify.compress);
      updateToggle('toggleDeadCode', minify.deadCodeElimination);
    }
    
    function getWrapAttributesLabel(value) {
      const labels = {
        'auto': 'Auto',
        'force': 'Force',
        'force-aligned': 'Force Aligned',
        'force-expand-multiline': 'Force Expand'
      };
      return labels[value] || 'Auto';
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
    
    function toggleIndentType() {
      vscode.postMessage({ type: 'toggleIndentType' });
    }
    
    function updateIndentSize(value) {
      vscode.postMessage({ type: 'updateIndentSize', value: value });
    }
    
    function updateLineWidth(value) {
      vscode.postMessage({ type: 'updateLineWidth', value: value });
    }
    
    function toggleQuoteStyle() {
      vscode.postMessage({ type: 'toggleQuoteStyle' });
    }
    
    function toggleSemicolons() {
      vscode.postMessage({ type: 'toggleSemicolons' });
    }
    
    function toggleTrailingCommas() {
      vscode.postMessage({ type: 'toggleTrailingCommas' });
    }
    
    function toggleBracketSpacing() {
      vscode.postMessage({ type: 'toggleBracketSpacing' });
    }
    
    function toggleArrowParens() {
      vscode.postMessage({ type: 'toggleArrowParens' });
    }
    
    function toggleEndOfLine() {
      vscode.postMessage({ type: 'toggleEndOfLine' });
    }
    
    function toggleWrapAttributes() {
      vscode.postMessage({ type: 'toggleWrapAttributes' });
    }
    
    function toggleOnePropertyPerLine() {
      vscode.postMessage({ type: 'toggleOnePropertyPerLine' });
    }
    
    function togglePrettyPrintSameLine() {
      vscode.postMessage({ type: 'togglePrettyPrintSameLine' });
    }
    
    function togglePrettyPrintSelfClose() {
      vscode.postMessage({ type: 'togglePrettyPrintSelfClose' });
    }
    
    function togglePrettyPrintPreserveNewlines() {
      vscode.postMessage({ type: 'togglePrettyPrintPreserveNewlines' });
    }
    
    function toggleMinifyRemoveComments() {
      vscode.postMessage({ type: 'toggleMinifyRemoveComments' });
    }
    
    function toggleMinifyRemoveWhitespace() {
      vscode.postMessage({ type: 'toggleMinifyRemoveWhitespace' });
    }
    
    function toggleMinifyShortNames() {
      vscode.postMessage({ type: 'toggleMinifyShortNames' });
    }
  </script>
</body>
</html>`;
  }
}

module.exports = FormatSettingsWebviewProvider;
