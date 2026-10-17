const vscode = require('vscode');

/**
 * Sync panel - Auto-sync actions and schedules
 */
class SyncPanelProvider {
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
      const config = this.workspaceService.getConfig();
      const nextSyncISO = this.schedulerService.getNextSyncTime();
      
      // Format next sync time as local time
      let nextSyncLocal = null;
      if (nextSyncISO) {
        try {
          const date = new Date(nextSyncISO);
          // Format as: Feb 11, 2:30 PM
          nextSyncLocal = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        } catch (e) {
          nextSyncLocal = nextSyncISO;
        }
      }
      
      this._view.webview.postMessage({ 
        type: 'update', 
        autoSyncEnabled: config?.autoSync?.enabled || false,
        schedules: config?.autoSync?.schedules || [],
        nextSync: nextSyncLocal
      });
    }
  }

  async _handleMessage(message) {
    switch (message.type) {
      case 'toggleAutoSync':
        await vscode.commands.executeCommand('notas.toggleAutoSync');
        this.refresh();
        break;
        
      case 'syncNow':
        await vscode.commands.executeCommand('notas.syncNow');
        break;
        
      case 'addSchedule':
        if (message.time) {
          // Add schedule directly with the provided time
          await this._addScheduleWithTime(message.time);
        } else {
          // Fall back to command palette
          await vscode.commands.executeCommand('notas.addSchedule');
        }
        this.refresh();
        break;
        
      case 'deleteSchedule':
        await this._deleteSchedule(message.time);
        break;
        
      case 'toggleSchedule':
        await this._toggleSchedule(message.time);
        break;
    }
  }

  async _addScheduleWithTime(time) {
    const config = this.workspaceService.getConfig();
    if (!config || !config.autoSync) {
      vscode.window.showErrorMessage('Auto-sync configuration not found');
      return;
    }
    
    // Check if schedule already exists
    if (config.autoSync.schedules.some(s => s.time === time)) {
      vscode.window.showWarningMessage(`Schedule ${time} already exists`);
      return;
    }
    
    config.autoSync.schedules.push({ time, enabled: true });
    await this.workspaceService.saveConfig();
    
    // Restart scheduler if auto-sync is enabled
    if (config.autoSync.enabled) {
      this.schedulerService.stop();
      this.schedulerService.start();
    }
    
    vscode.window.showInformationMessage(`Added schedule: ${time}`);
    this.refresh();
  }

  async _deleteSchedule(time) {
    const config = this.workspaceService.getConfig();
    if (!config || !config.autoSync) return;
    
    config.autoSync.schedules = config.autoSync.schedules.filter(s => s.time !== time);
    await this.workspaceService.saveConfig();
    
    // Restart scheduler if auto-sync is enabled
    if (config.autoSync.enabled) {
      this.schedulerService.stop();
      this.schedulerService.start();
    }
    
    vscode.window.showInformationMessage(`Removed schedule: ${time}`);
    this.refresh();
  }

  async _toggleSchedule(time) {
    const config = this.workspaceService.getConfig();
    if (!config || !config.autoSync) return;
    
    const schedule = config.autoSync.schedules.find(s => s.time === time);
    if (schedule) {
      schedule.enabled = !schedule.enabled;
      await this.workspaceService.saveConfig();
      
      // Restart scheduler if auto-sync is enabled
      if (config.autoSync.enabled) {
        this.schedulerService.stop();
        this.schedulerService.start();
      }
      
      this.refresh();
    }
  }

  _getHtmlForWebview(webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sync</title>
  <style>
    body {
      padding: 10px;
      color: var(--vscode-foreground);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
    }
    
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
    }
    
    .setting-label {
      flex: 1;
    }
    
    .toggle-switch {
      width: 36px;
      height: 20px;
      background: var(--vscode-button-secondaryBackground);
      border-radius: 10px;
      position: relative;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .toggle-switch.active {
      background: var(--vscode-button-background);
    }
    
    .toggle-switch::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      top: 2px;
      left: 2px;
      transition: left 0.2s;
    }
    
    .toggle-switch.active::after {
      left: 18px;
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
    
    button.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    
    button.secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    
    .status {
      padding: 6px 0;
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }
    
    .status strong {
      color: var(--vscode-foreground);
    }
    
    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      opacity: 0.6;
      margin: 16px 0 8px 0;
      letter-spacing: 0.5px;
    }
    
    .schedule-item {
      display: flex;
      align-items: center;
      padding: 4px 6px;
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border);
      border-radius: 2px;
      margin-bottom: 4px;
      font-size: 12px;
    }
    
    .schedule-time {
      flex: 1;
      font-family: 'Monaco', 'Courier New', monospace;
      cursor: pointer;
    }
    
    .schedule-toggle {
      width: auto;
      padding: 1px 6px;
      margin: 0 4px 0 0;
      font-size: 10px;
      border-radius: 2px;
    }
    
    .schedule-delete {
      width: auto;
      padding: 1px 6px;
      margin: 0 0 0 4px;
      font-size: 10px;
      background: var(--vscode-errorForeground);
      border-radius: 2px;
    }
    
    .schedule-delete:hover {
      background: var(--vscode-errorForeground);
      opacity: 0.8;
    }
    
    .schedule-item.disabled {
      opacity: 0.5;
    }
    
    .help-text {
      font-size: 11px;
      opacity: 0.5;
      margin-top: 12px;
      line-height: 1.4;
    }
    
    .empty-state {
      padding: 12px 8px;
      text-align: center;
      opacity: 0.4;
      font-size: 11px;
    }
    
    .schedule-input-container {
      margin-bottom: 8px;
    }
    
    input[type="text"] {
      width: 100%;
      padding: 4px 6px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 2px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 12px;
      box-sizing: border-box;
      margin-bottom: 4px;
    }
    
    input[type="text"]:focus {
      outline: 1px solid var(--vscode-focusBorder);
    }
    
    .input-buttons {
      display: flex;
      gap: 4px;
    }
    
    .input-buttons button {
      flex: 1;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="setting-item">
    <div class="setting-label">Auto-Sync</div>
    <div class="toggle-switch" id="autoSyncToggle" onclick="toggleAutoSync()"></div>
  </div>
  
  <div class="status">
    Next Sync: <strong id="nextSync">-</strong>
  </div>
  
  <button onclick="syncNow()">⚡ Sync Now</button>
  
  <div class="section-title">Schedules</div>
  
  <div id="scheduleInput" style="display: none;" class="schedule-input-container">
    <input type="text" id="scheduleTime" placeholder="HH:MM (e.g., 09:00)" />
    <div class="input-buttons">
      <button onclick="saveSchedule()">Add</button>
      <button class="secondary" onclick="cancelSchedule()">Cancel</button>
    </div>
  </div>
  
  <div id="schedules"></div>
  
  <button class="secondary" onclick="showAddSchedule()">+ Add Schedule</button>
  
  <div class="help-text">
    All configurations are available in Settings
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    let currentData = null;
    
    // Handle messages from extension
    window.addEventListener('message', event => {
      const message = event.data;
      
      if (message.type === 'update') {
        currentData = message;
        updateUI(message);
      }
    });
    
    function updateUI(data) {
      // Update auto-sync toggle
      const toggleEl = document.getElementById('autoSyncToggle');
      if (data.autoSyncEnabled) {
        toggleEl.classList.add('active');
      } else {
        toggleEl.classList.remove('active');
      }
      
      // Update next sync time (format as local time)
      const nextSyncEl = document.getElementById('nextSync');
      if (data.nextSync) {
        nextSyncEl.textContent = data.nextSync;
      } else {
        nextSyncEl.textContent = 'Not scheduled';
      }
      
      // Update schedules list
      const schedulesEl = document.getElementById('schedules');
      if (!data.schedules || data.schedules.length === 0) {
        schedulesEl.innerHTML = '<div class="empty-state">No schedules configured</div>';
      } else {
        schedulesEl.innerHTML = data.schedules.map((s, idx) => 
          '<div class="schedule-item ' + (s.enabled ? '' : 'disabled') + '">' +
            '<button class="schedule-toggle" onclick="toggleSchedule(\\'' + s.time + '\\')">' +
              (s.enabled ? '⏸' : '▶') +
            '</button>' +
            '<span class="schedule-time">' + s.time + '</span>' +
            '<button class="schedule-delete" onclick="deleteSchedule(\\'' + s.time + '\\')">×</button>' +
          '</div>'
        ).join('');
      }
    }
    
    function toggleAutoSync() {
      vscode.postMessage({ type: 'toggleAutoSync' });
    }
    
    function syncNow() {
      vscode.postMessage({ type: 'syncNow' });
    }
    
    function showAddSchedule() {
      document.getElementById('scheduleInput').style.display = 'block';
      document.getElementById('scheduleTime').focus();
    }
    
    function cancelSchedule() {
      document.getElementById('scheduleInput').style.display = 'none';
      document.getElementById('scheduleTime').value = '';
    }
    
    function saveSchedule() {
      const time = document.getElementById('scheduleTime').value.trim();
      if (!time) return;
      
      // Validate format
      if (!/^\\d{1,2}:\\d{2}$/.test(time)) {
        alert('Format must be HH:MM (e.g., 09:00)');
        return;
      }
      
      const [hours, minutes] = time.split(':').map(Number);
      if (hours > 23 || minutes > 59) {
        alert('Invalid time: hours must be 0-23, minutes 0-59');
        return;
      }
      
      // Format with leading zeros
      const formattedTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
      
      vscode.postMessage({ type: 'addSchedule', time: formattedTime });
      cancelSchedule();
    }
    
    function toggleSchedule(time) {
      vscode.postMessage({ type: 'toggleSchedule', time: time });
    }
    
    function deleteSchedule(time) {
      vscode.postMessage({ type: 'deleteSchedule', time: time });
    }
    
    // Allow Enter key to save schedule
    document.addEventListener('DOMContentLoaded', () => {
      const input = document.getElementById('scheduleTime');
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            saveSchedule();
          } else if (e.key === 'Escape') {
            cancelSchedule();
          }
        });
      }
    });
  </script>
</body>
</html>`;
  }
}

module.exports = SyncPanelProvider;
