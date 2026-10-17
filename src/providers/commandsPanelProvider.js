const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;

/**
 * Sidebar webview: saved commands from JSON (name + script), search, run in terminal.
 */
class CommandsPanelProvider {
  /**
   * @param {import('../services/workspace')} workspaceService
   */
  constructor(workspaceService) {
    this.workspaceService = workspaceService;
    this._view = null;
    /** @type {{ name: string, script: string }[]} */
    this._commandsCache = [];
    this._lastError = null;
    this._lastFilePath = null;
    this._watcherDisposable = null;
    this._configDisposable = null;
  }

  /**
   * @returns {string|null}
   */
  _getWorkspaceBase() {
    const root = this.workspaceService.getRootPath();
    if (root) {
      return root;
    }
    const folder = vscode.workspace.workspaceFolders?.[0];
    return folder ? folder.uri.fsPath : null;
  }

  /**
   * Path from setting `notas.commands.file` (relative or absolute).
   * Default matches package.json: workspace-root `notas-commands.json` (git-friendly).
   * @returns {string}
   */
  _getRelativeCommandsPath() {
    const config = vscode.workspace.getConfiguration('notas');
    const rel = config.get('commands.file');
    return typeof rel === 'string' && rel.trim() ? rel.trim() : 'notas-commands.json';
  }

  /**
   * Absolute path to commands JSON file.
   * @returns {string|null}
   */
  getCommandsFilePath() {
    const base = this._getWorkspaceBase();
    if (!base) {
      return null;
    }
    const rel = this._getRelativeCommandsPath();
    return path.isAbsolute(rel) ? rel : path.join(base, rel);
  }

  /**
   * Parse and validate commands array from JSON.
   * @param {unknown} data
   * @returns {{ name: string, script: string }[]}
   */
  _validateCommands(data) {
    if (!Array.isArray(data)) {
      throw new Error('JSON root must be an array');
    }
    const out = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row || typeof row !== 'object') {
        throw new Error(`Item ${i + 1} must be an object`);
      }
      const name = row.name;
      const script = row.script;
      if (typeof name !== 'string' || !name.trim()) {
        throw new Error(`Item ${i + 1} must have a non-empty string "name"`);
      }
      if (typeof script !== 'string' || !script.trim()) {
        throw new Error(`Item ${i + 1} must have a non-empty string "script"`);
      }
      out.push({ name: name.trim(), script: script.trim() });
    }
    return out;
  }

  /**
   * @returns {Promise<void>}
   */
  async _loadFromDisk() {
    const fullPath = this.getCommandsFilePath();
    this._lastFilePath = fullPath;
    this._lastError = null;
    this._commandsCache = [];

    if (!fullPath) {
      this._lastError = 'Open a folder to use Commands.';
      return;
    }

    try {
      const raw = await fs.readFile(fullPath, 'utf8');
      const data = JSON.parse(raw);
      this._commandsCache = this._validateCommands(data);
    } catch (e) {
      if (e.code === 'ENOENT') {
        this._lastError = `File not found. Create: ${fullPath}`;
      } else if (e instanceof SyntaxError) {
        this._lastError = `Invalid JSON: ${e.message}`;
      } else {
        this._lastError = e.message || String(e);
      }
      this._commandsCache = [];
    }
  }

  _postState() {
    if (!this._view) {
      return;
    }
    this._view.webview.postMessage({
      type: 'state',
      commands: this._commandsCache,
      error: this._lastError,
      filePath: this._lastFilePath
    });
  }

  resolveWebviewView(webviewView, _context, _token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: []
    };

    webviewView.webview.html = this._getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      await this._handleMessage(message);
    });

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this.refresh();
      }
    });

    this._setupFileWatcher();
    this._setupConfigListener();

    this.refresh();
  }

  _setupFileWatcher() {
    if (this._watcherDisposable) {
      this._watcherDisposable.dispose();
      this._watcherDisposable = null;
    }

    const base = this._getWorkspaceBase();
    if (!base) {
      return;
    }

    const rel = this._getRelativeCommandsPath();
    if (path.isAbsolute(rel)) {
      const dir = path.dirname(rel);
      const baseName = path.basename(rel);
      try {
        const pattern = new vscode.RelativePattern(vscode.Uri.file(dir), baseName);
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);
        watcher.onDidChange(() => this.refresh());
        watcher.onDidCreate(() => this.refresh());
        watcher.onDidDelete(() => this.refresh());
        this._watcherDisposable = watcher;
      } catch {
        // ignore invalid pattern
      }
      return;
    }

    const pattern = new vscode.RelativePattern(vscode.Uri.file(base), rel);
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);
    watcher.onDidChange(() => this.refresh());
    watcher.onDidCreate(() => this.refresh());
    watcher.onDidDelete(() => this.refresh());
    this._watcherDisposable = watcher;
  }

  _setupConfigListener() {
    if (this._configDisposable) {
      this._configDisposable.dispose();
      this._configDisposable = null;
    }
    this._configDisposable = vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('notas.commands')) {
        this._setupFileWatcher();
        this.refresh();
      }
    });
  }

  async refresh() {
    await this._loadFromDisk();
    this._postState();
  }

  /**
   * @param {import('vscode').Uri} [uri]
   */
  async openCommandsFile(uri) {
    const fullPath = uri?.fsPath || this.getCommandsFilePath();
    if (!fullPath) {
      vscode.window.showWarningMessage('Open a workspace folder first.');
      return;
    }
    const fileUri = vscode.Uri.file(fullPath);
    try {
      await vscode.workspace.fs.stat(fileUri);
    } catch {
      vscode.window.showErrorMessage(
        `Commands file not found: ${fullPath}. Create it with a JSON array of { "name", "script" }.`
      );
      return;
    }
    const doc = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(doc, { preview: false });
  }

  async _handleMessage(message) {
    switch (message.type) {
      case 'run': {
        const index = message.index;
        if (typeof index !== 'number' || index < 0 || index >= this._commandsCache.length) {
          vscode.window.showErrorMessage('Invalid command index.');
          return;
        }
        const item = this._commandsCache[index];
        const term = vscode.window.createTerminal({
          name: item.name.length > 32 ? `${item.name.slice(0, 29)}...` : item.name
        });
        term.show();
        term.sendText(item.script);
        break;
      }
      case 'openFile':
        await this.openCommandsFile();
        break;
      default:
        break;
    }
  }

  dispose() {
    if (this._watcherDisposable) {
      this._watcherDisposable.dispose();
      this._watcherDisposable = null;
    }
    if (this._configDisposable) {
      this._configDisposable.dispose();
      this._configDisposable = null;
    }
  }

  _getHtmlForWebview() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Commands</title>
  <style>
    body {
      padding: 8px;
      color: var(--vscode-foreground);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      margin: 0;
    }
    .search-wrap {
      margin-bottom: 8px;
    }
    .search-wrap input {
      width: 100%;
      box-sizing: border-box;
      padding: 4px 6px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 2px;
      font-size: 12px;
    }
    .search-wrap input:focus {
      outline: 1px solid var(--vscode-focusBorder);
    }
    .error {
      font-size: 11px;
      color: var(--vscode-errorForeground);
      margin-bottom: 8px;
      line-height: 1.4;
      word-break: break-all;
    }
    .path-hint {
      font-size: 10px;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 8px;
      word-break: break-all;
    }
    .row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 6px 4px;
      border-bottom: 1px solid var(--vscode-widget-border, rgba(128,128,128,0.2));
    }
    .row-main {
      flex: 1;
      min-width: 0;
    }
    .row-name {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .row-script {
      font-size: 10px;
      font-family: var(--vscode-editor-font-family, monospace);
      color: var(--vscode-descriptionForeground);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .run-btn {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      padding: 0;
      margin: 0;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .run-btn:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    .empty {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      padding: 12px 4px;
      text-align: center;
      opacity: 0.85;
    }
    .open-link {
      background: none;
      border: none;
      color: var(--vscode-textLink-foreground);
      cursor: pointer;
      text-decoration: underline;
      font-size: 11px;
      padding: 0;
      margin-top: 6px;
    }
    .open-link:hover {
      color: var(--vscode-textLink-activeForeground);
    }
  </style>
</head>
<body>
  <div class="search-wrap">
    <input type="text" id="search" placeholder="Search by name or script…" />
  </div>
  <div id="error" class="error" style="display:none;"></div>
  <div id="path" class="path-hint" style="display:none;"></div>
  <div id="list"></div>
  <div id="empty" class="empty" style="display:none;"></div>

  <script>
    (function () {
      const vscode = acquireVsCodeApi();
      const searchEl = document.getElementById('search');
      const errorEl = document.getElementById('error');
      const pathEl = document.getElementById('path');
      const listEl = document.getElementById('list');
      const emptyEl = document.getElementById('empty');

      let allCommands = [];
      let loadError = null;

      function render() {
        const q = (searchEl.value || '').trim().toLowerCase();
        listEl.innerHTML = '';
        let shown = 0;

        if (loadError) {
          emptyEl.style.display = 'none';
          return;
        }

        allCommands.forEach(function (c, index) {
          const hay = (c.name + ' ' + c.script).toLowerCase();
          if (q && hay.indexOf(q) === -1) {
            return;
          }
          shown++;

          const row = document.createElement('div');
          row.className = 'row';

          const main = document.createElement('div');
          main.className = 'row-main';

          const nameEl = document.createElement('div');
          nameEl.className = 'row-name';
          nameEl.textContent = c.name;

          const scriptEl = document.createElement('div');
          scriptEl.className = 'row-script';
          scriptEl.textContent = c.script;
          scriptEl.title = c.script;

          main.appendChild(nameEl);
          main.appendChild(scriptEl);

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'run-btn';
          btn.title = 'Run in terminal';
          btn.textContent = '▶';
          btn.addEventListener('click', function () {
            vscode.postMessage({ type: 'run', index: index });
          });

          row.appendChild(main);
          row.appendChild(btn);
          listEl.appendChild(row);
        });

        if (allCommands.length === 0) {
          emptyEl.style.display = 'block';
          emptyEl.textContent = 'No commands in file. Add { "name", "script" } entries to your JSON.';
        } else if (shown === 0 && allCommands.length > 0) {
          emptyEl.style.display = 'block';
          emptyEl.textContent = 'No commands match your search.';
        } else {
          emptyEl.style.display = 'none';
        }
      }

      searchEl.addEventListener('input', render);

      window.addEventListener('message', function (event) {
        const msg = event.data;
        if (msg.type !== 'state') {
          return;
        }
        allCommands = Array.isArray(msg.commands) ? msg.commands : [];
        loadError = msg.error || null;

        if (msg.error) {
          errorEl.style.display = 'block';
          errorEl.textContent = msg.error;
        } else {
          errorEl.style.display = 'none';
          errorEl.textContent = '';
        }

        if (msg.filePath) {
          pathEl.style.display = 'block';
          pathEl.textContent = msg.filePath;
        } else {
          pathEl.style.display = 'none';
        }

        render();
      });
    })();
  </script>
</body>
</html>`;
  }
}

module.exports = CommandsPanelProvider;
