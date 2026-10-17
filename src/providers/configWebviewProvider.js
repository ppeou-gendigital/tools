const vscode = require('vscode');

/**
 * Webview provider for configuration panel (form-based UI)
 */
class ConfigWebviewProvider {
  constructor(workspaceService, schedulerService) {
    this.workspaceService = workspaceService;
    this.schedulerService = schedulerService;
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
        config: this.workspaceService.getConfig(),
        nextSync: this.schedulerService.getNextSyncTime()
      });
    }
  }

  async _handleMessage(message) {
    const config = this.workspaceService.getConfig();
    
    switch (message.type) {
      case 'toggleAutoSync':
        if (config && config.autoSync) {
          config.autoSync.enabled = !config.autoSync.enabled;
          await this.workspaceService.saveConfig();
          
          if (config.autoSync.enabled) {
            this.schedulerService.start();
          } else {
            this.schedulerService.stop();
          }
          
          vscode.window.showInformationMessage(
            `Auto-sync ${config.autoSync.enabled ? 'enabled' : 'disabled'}`
          );
          this.refresh();
        }
        break;

      case 'toggleAutoCommit':
        if (config && config.autoSync) {
          config.autoSync.autoCommit = !config.autoSync.autoCommit;
          await this.workspaceService.saveConfig();
          vscode.window.showInformationMessage(
            `Auto-commit ${config.autoSync.autoCommit ? 'enabled' : 'disabled'}`
          );
          this.refresh();
        }
        break;

      case 'changeConflictStrategy':
        if (config && config.autoSync) {
          const strategies = [
            { label: 'Keep Local', value: 'ours' },
            { label: 'Accept Remote', value: 'theirs' },
            { label: 'Manual Resolution', value: 'manual' }
          ];
          
          const choice = await vscode.window.showQuickPick(strategies, {
            placeHolder: 'Select conflict resolution strategy'
          });
          
          if (choice) {
            config.autoSync.conflictStrategy = choice.value;
            await this.workspaceService.saveConfig();
            vscode.window.showInformationMessage(`Conflict strategy: ${choice.label}`);
            this.refresh();
          }
        }
        break;

      case 'addSchedule':
        if (config && config.autoSync) {
          const time = message.time;
          
          if (!time) {
            return;
          }
          
          // Check for duplicates only
          if (config.autoSync.schedules.some(s => s.time === time)) {
            vscode.window.showWarningMessage('Schedule already exists');
            return;
          }
          
          config.autoSync.schedules.push({ time, enabled: true });
          await this.workspaceService.saveConfig();
          
          if (config.autoSync.enabled) {
            this.schedulerService.stop();
            this.schedulerService.start();
          }
          
          vscode.window.showInformationMessage(`Added schedule: ${time}`);
          this.refresh();
        }
        break;

      case 'toggleSchedule':
        if (config && config.autoSync) {
          const schedule = config.autoSync.schedules[message.index];
          if (schedule) {
            schedule.enabled = !schedule.enabled;
            await this.workspaceService.saveConfig();
            this.refresh();
          }
        }
        break;

      case 'removeSchedule':
        if (config && config.autoSync) {
          config.autoSync.schedules.splice(message.index, 1);
          await this.workspaceService.saveConfig();
          
          if (config.autoSync.enabled) {
            this.schedulerService.stop();
            this.schedulerService.start();
          }
          
          vscode.window.showInformationMessage('Schedule removed');
          this.refresh();
        }
        break;

      case 'syncNow':
        if (config) {
          await this.schedulerService.runSync('manual');
          vscode.window.showInformationMessage('Sync completed');
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
  <title>Configuration</title>
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
    
    .info-group {
      background: transparent;
      border: none;
      padding: 0;
      margin-bottom: 8px;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 0;
      font-size: 13px;
    }
    
    .info-label {
      font-weight: 400;
      color: var(--vscode-foreground);
      opacity: 0.9;
    }
    
    .info-value {
      color: var(--vscode-foreground);
      opacity: 0.6;
      font-size: 12px;
      text-align: right;
      max-width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .toggle-button {
      width: 100%;
      padding: 6px 10px;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 0.1s;
      text-align: left;
      margin-bottom: 8px;
    }
    
    .toggle-button:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    
    .toggle-button.active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    
    .toggle-button.active:hover {
      background: var(--vscode-button-hoverBackground);
    }
    
    .action-button {
      width: 100%;
      padding: 6px 10px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 8px;
      transition: background 0.1s;
      text-align: center;
      height: 28px;
      box-sizing: border-box;
    }
    
    .action-button:hover {
      background: var(--vscode-button-hoverBackground);
    }
    
    .action-button:active {
      opacity: 0.9;
    }
    
    .action-button.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    
    .action-button.secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground);
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
    
    .schedule-list {
      margin-top: 8px;
    }
    
    .schedule-item {
      background: var(--vscode-list-inactiveSelectionBackground);
      border-radius: 3px;
      padding: 8px 10px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }
    
    .schedule-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .schedule-time {
      font-weight: 400;
    }
    
    .schedule-badge {
      font-size: 11px;
      padding: 1px 4px;
      border-radius: 2px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
    }
    
    .schedule-badge.disabled {
      opacity: 0.5;
    }
    
    .schedule-actions {
      display: flex;
      gap: 4px;
    }
    
    .icon-button {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 2px;
      color: var(--vscode-foreground);
      font-size: 14px;
      line-height: 1;
      opacity: 0.7;
    }
    
    .icon-button:hover {
      background: var(--vscode-toolbar-hoverBackground);
      opacity: 1;
    }
    
    .status-indicator {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .status-indicator.active {
      background: #4ec9b0;
    }
    
    .status-indicator.inactive {
      background: #858585;
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
      margin-bottom: 6px;
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
    
    .hidden {
      display: none;
    }
    
    .schedule-error {
      color: var(--vscode-errorForeground);
      font-size: 12px;
      margin-top: -4px;
      margin-bottom: 6px;
      display: none;
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
      <div class="section-header">WORKSPACE</div>
      <div class="info-group">
        <div class="info-item">
          <span class="info-label">Repository</span>
          <span class="info-value" id="repository">-</span>
        </div>
        <div class="info-item">
          <span class="info-label">Workspace</span>
          <span class="info-value" id="workspace">-</span>
        </div>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="section">
      <div class="section-header">AUTO-SYNC</div>
      <button class="toggle-button" id="autoSyncToggle" onclick="toggleAutoSync()">
        <span style="display: flex; align-items: center;">
          <span class="status-indicator" id="autoSyncIndicator"></span>
          <span id="autoSyncText">Enable Auto-Sync</span>
        </span>
      </button>
      
      <div id="autoSyncSettings" class="hidden">
        <div class="setting-item" onclick="changeConflictStrategy()">
          <span class="setting-label">Conflict Strategy</span>
          <span class="setting-value" id="conflictStrategy">-</span>
        </div>
        
        <div class="setting-item" onclick="toggleAutoCommit()">
          <span class="setting-label">Auto-Commit</span>
          <span class="setting-value" id="autoCommit">-</span>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">Next Sync</span>
          <span class="setting-value" id="nextSync">-</span>
        </div>
        
        <div class="section-header" style="margin-top: 12px;">SCHEDULES</div>
        <div class="schedule-list" id="scheduleList"></div>
        
        <input 
          type="text" 
          id="scheduleInput" 
          class="schedule-input"
          placeholder="11:00 or 19:00"
          oninput="clearScheduleError()"
          onkeypress="handleScheduleKeyPress(event)"
          maxlength="5"
        />
        <div id="scheduleError" class="schedule-error"></div>
        <button class="action-button secondary" onclick="addSchedule()">+ Add Schedule</button>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="section">
      <div class="section-header">ACTIONS</div>
      <button class="action-button" onclick="syncNow()">Sync Now</button>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    
    let currentConfig = null;
    
    // Request initial update
    vscode.postMessage({ type: 'requestUpdate' });
    
    // Listen for updates from extension
    window.addEventListener('message', event => {
      const message = event.data;
      if (message.type === 'update') {
        currentConfig = message.config;
        updateUI(message.config, message.nextSync);
        // Clear any errors on successful update
        hideScheduleError();
      } else if (message.type === 'error') {
        showScheduleError(message.message);
      } else if (message.type === 'clearError') {
        hideScheduleError();
      }
    });
    
    function updateUI(config, nextSync) {
      if (!config) return;
      
      // Update workspace info
      document.getElementById('repository').textContent = shortenUrl(config.gitRepository);
      document.getElementById('workspace').textContent = shortenPath(config.workspaceRoot);
      
      // Update auto-sync toggle
      const autoSync = config.autoSync;
      const toggleBtn = document.getElementById('autoSyncToggle');
      const indicator = document.getElementById('autoSyncIndicator');
      const text = document.getElementById('autoSyncText');
      const settings = document.getElementById('autoSyncSettings');
      
      if (autoSync.enabled) {
        toggleBtn.classList.add('active');
        indicator.classList.add('active');
        indicator.classList.remove('inactive');
        text.textContent = 'Auto-Sync Enabled';
        settings.classList.remove('hidden');
        
        // Update settings
        document.getElementById('conflictStrategy').textContent = getStrategyLabel(autoSync.conflictStrategy);
        document.getElementById('autoCommit').textContent = autoSync.autoCommit ? 'Yes' : 'No';
        document.getElementById('nextSync').textContent = formatNextSync(nextSync);
        
        // Update schedules
        updateSchedules(autoSync.schedules);
      } else {
        toggleBtn.classList.remove('active');
        indicator.classList.add('inactive');
        indicator.classList.remove('active');
        text.textContent = 'Enable Auto-Sync';
        settings.classList.add('hidden');
      }
      
      // Clear input and error on update
      const input = document.getElementById('scheduleInput');
      if (input) {
        input.value = '';
      }
      hideScheduleError();
    }
    
    function updateSchedules(schedules) {
      const list = document.getElementById('scheduleList');
      list.innerHTML = '';
      
      if (!schedules || schedules.length === 0) {
        list.innerHTML = '<div style="padding: 8px; color: var(--vscode-descriptionForeground); font-size: 0.9em;">No schedules configured</div>';
        return;
      }
      
      schedules.forEach((schedule, index) => {
        const item = document.createElement('div');
        item.className = 'schedule-item';
        
        const scheduleInfo = document.createElement('div');
        scheduleInfo.className = 'schedule-info';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'schedule-time';
        timeSpan.textContent = '🕐 ' + schedule.time;
        
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'schedule-badge' + (schedule.enabled ? '' : ' disabled');
        badgeSpan.textContent = schedule.enabled ? 'Active' : 'Disabled';
        
        scheduleInfo.appendChild(timeSpan);
        scheduleInfo.appendChild(badgeSpan);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'schedule-actions';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'icon-button';
        toggleBtn.textContent = schedule.enabled ? '⏸' : '▶';
        toggleBtn.title = 'Toggle';
        toggleBtn.onclick = () => toggleSchedule(index);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'icon-button';
        removeBtn.textContent = '🗑️';
        removeBtn.title = 'Remove';
        removeBtn.onclick = () => removeSchedule(index);
        
        actionsDiv.appendChild(toggleBtn);
        actionsDiv.appendChild(removeBtn);
        
        item.appendChild(scheduleInfo);
        item.appendChild(actionsDiv);
        list.appendChild(item);
      });
    }
    
    function toggleAutoSync() {
      vscode.postMessage({ type: 'toggleAutoSync' });
    }
    
    function toggleAutoCommit() {
      vscode.postMessage({ type: 'toggleAutoCommit' });
    }
    
    function changeConflictStrategy() {
      vscode.postMessage({ type: 'changeConflictStrategy' });
    }
    
    function addSchedule() {
      const input = document.getElementById('scheduleInput');
      const time = input.value.trim();
      
      if (!time) {
        return;
      }
      
      // Split by colon
      const parts = time.split(':');
      
      // Check format
      if (parts.length !== 2) {
        showScheduleError('Invalid format. Use HH:MM (e.g., 08:00, 19:30)');
        return;
      }
      
      // Parse hours and minutes
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      // Check if valid numbers
      if (isNaN(hours) || isNaN(minutes)) {
        showScheduleError('Hours and minutes must be numbers');
        return;
      }
      
      // Validate ranges
      if (hours < 0 || hours > 23) {
        showScheduleError('Hours must be between 0 and 23');
        return;
      }
      
      if (minutes < 0 || minutes > 59) {
        showScheduleError('Minutes must be between 0 and 59');
        return;
      }
      
      // Format with leading zeros
      const formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
      
      // Check for duplicates
      if (currentConfig && currentConfig.autoSync && currentConfig.autoSync.schedules) {
        const exists = currentConfig.autoSync.schedules.some(s => s.time === formattedTime);
        if (exists) {
          showScheduleError('This time already exists');
          return;
        }
      }
      
      // Clear input and error, send to extension
      input.value = '';
      hideScheduleError();
      
      vscode.postMessage({ type: 'addSchedule', time: formattedTime });
    }
    
    function handleScheduleKeyPress(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        addSchedule();
      }
    }
    
    function clearScheduleError() {
      // Clear error immediately as user types
      const errorDiv = document.getElementById('scheduleError');
      if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
      }
    }
    
    function showScheduleError(message) {
      const errorDiv = document.getElementById('scheduleError');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
    
    function hideScheduleError() {
      const errorDiv = document.getElementById('scheduleError');
      if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
      }
    }
    
    function toggleSchedule(index) {
      vscode.postMessage({ type: 'toggleSchedule', index });
    }
    
    function removeSchedule(index) {
      vscode.postMessage({ type: 'removeSchedule', index });
    }
    
    function syncNow() {
      vscode.postMessage({ type: 'syncNow' });
    }
    
    function shortenUrl(url) {
      if (!url) return 'Not set';
      const match = url.match(new RegExp('/([^/]+)\\.git$'));
      if (match) return match[1];
      if (url.length > 30) return url.substring(0, 27) + '...';
      return url;
    }
    
    function shortenPath(path) {
      if (!path) return 'Not set';
      const parts = path.split('/');
      if (parts.length > 3) return '.../' + parts.slice(-2).join('/');
      return path;
    }
    
    function getStrategyLabel(strategy) {
      const labels = {
        'ours': 'Keep Local',
        'theirs': 'Accept Remote',
        'manual': 'Manual Resolution'
      };
      return labels[strategy] || strategy;
    }
    
    function formatNextSync(nextSync) {
      if (!nextSync) return 'Not scheduled';
      
      const now = new Date();
      const next = new Date(nextSync);
      const diff = next - now;
      
      if (diff < 0) return 'Soon...';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
      } else {
        return minutes + 'm';
      }
    }
  </script>
</body>
</html>`;
  }
}

module.exports = ConfigWebviewProvider;
