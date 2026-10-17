const vscode = require('vscode');

/**
 * Tree view provider for workspace configuration
 */
class WorkspaceConfigProvider {
  constructor(workspaceService, schedulerService) {
    this.workspaceService = workspaceService;
    this.schedulerService = schedulerService;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  
  /**
   * Refresh tree view
   */
  refresh() {
    this._onDidChangeTreeData.fire();
  }
  
  /**
   * Get tree item
   * @param {ConfigItem} element
   * @returns {vscode.TreeItem}
   */
  getTreeItem(element) {
    return element;
  }
  
  /**
   * Get children of tree item
   * @param {ConfigItem} [element]
   * @returns {Promise<ConfigItem[]>}
   */
  async getChildren(element) {
    try {
      const config = this.workspaceService.getConfig();
      
      if (!config) {
        return [
          new ActionItem(
            '⚙️ Initialize Workspace',
            'Click to set up Notas in this workspace',
            'notas.initWorkspace'
          )
        ];
      }
    
    if (!element) {
      // Root level - show main config items
      const items = [];
      
      // Repository info
      items.push(new ConfigItem(
        '📦 Repository',
        this.shortenUrl(config.gitRepository),
        vscode.TreeItemCollapsibleState.None,
        config.gitRepository,
        'repo'
      ));
      
      // Workspace root
      items.push(new ConfigItem(
        '📁 Workspace',
        this.shortenPath(config.workspaceRoot),
        vscode.TreeItemCollapsibleState.None,
        config.workspaceRoot,
        'workspace'
      ));
      
      // Divider
      items.push(new SectionHeader('AUTO-SYNC'));
      
      // Auto-sync toggle button
      if (config.autoSync) {
        const autoSync = config.autoSync;
        const status = autoSync.enabled ? 'Enabled' : 'Disabled';
        const icon = autoSync.enabled ? 'debug-start' : 'debug-stop';
        const color = autoSync.enabled ? 'charts.green' : 'charts.red';
        
        items.push(new ToggleItem(
          autoSync.enabled ? '✓' : '✗',
          'Auto-Sync',
          status,
          'Click to toggle Auto-Sync',
          'notas.toggleAutoSync',
          icon,
          color
        ));
        
        // Show details when enabled
        if (autoSync.enabled) {
          // Schedules section
          items.push(new ConfigItem(
            '📅 Schedules',
            '',
            vscode.TreeItemCollapsibleState.Collapsed,
            'Manage sync schedules',
            'schedules'
          ));
          
          // Conflict strategy
          const strategyLabel = this.getStrategyLabel(autoSync.conflictStrategy);
          items.push(new ClickableItem(
            '🔀 Conflict Strategy',
            strategyLabel,
            'Click to change',
            'notas.changeConflictStrategy'
          ));
          
          // Auto-commit toggle
          items.push(new ToggleItem(
            autoSync.autoCommit ? '✓' : '✗',
            'Auto-Commit',
            autoSync.autoCommit ? 'Yes' : 'No',
            'Click to toggle auto-commit',
            'notas.toggleAutoCommit',
            autoSync.autoCommit ? 'check' : 'x'
          ));
          
          // Next sync time
          const nextSync = this.schedulerService.getNextSyncTime();
          if (nextSync) {
            items.push(new ConfigItem(
              '⏰ Next Sync',
              this.formatNextSync(nextSync),
              vscode.TreeItemCollapsibleState.None,
              nextSync.toString(),
              'nextsync'
            ));
          }
        }
      }
      
      // Divider
      items.push(new SectionHeader('ACTIONS'));
      
      // Action buttons
      items.push(new ActionButton(
        'Sync Now',
        'Manually sync all worktrees',
        'notas.manualSync',
        'sync'
      ));
      
      items.push(new ActionButton(
        'Configure File Tools',
        'Change format and compare settings',
        'notas.openFileToolsSettings',
        'tools'
      ));
      
      return items;
    }
    
    // Expandable items (Auto-Sync details)
    if (element.contextValue === 'autosync') {
      const autoSync = config.autoSync;
      const details = [];
      
      if (autoSync.enabled) {
        // Schedules
        if (autoSync.schedules && autoSync.schedules.length > 0) {
          const activeSchedules = autoSync.schedules.filter(s => s.enabled);
          if (activeSchedules.length > 0) {
            details.push(new ConfigItem(
              '📅 Schedules',
              `${activeSchedules.length} active`,
              vscode.TreeItemCollapsibleState.Collapsed,
              null,
              'schedules'
            ));
          }
        }
        
        // Conflict strategy
        const strategyLabel = this.getStrategyLabel(autoSync.conflictStrategy);
        details.push(new ConfigItem(
          '🔀 Conflict Strategy',
          strategyLabel,
          vscode.TreeItemCollapsibleState.None,
          null,
          'strategy'
        ));
        
        // Auto-commit status
        details.push(new ConfigItem(
          '💾 Auto-Commit',
          autoSync.autoCommit ? 'Yes' : 'No',
          vscode.TreeItemCollapsibleState.None,
          null,
          'autocommit'
        ));
        
        // Next sync time
        const nextSync = this.schedulerService.getNextSyncTime();
        if (nextSync) {
          details.push(new ConfigItem(
            '⏰ Next Sync',
            this.formatNextSync(nextSync),
            vscode.TreeItemCollapsibleState.None,
            null,
            'nextsync'
          ));
        }
      }
      
      return details;
    }
    
    // Schedule details
    if (element.contextValue === 'schedules') {
      const autoSync = config.autoSync;
      const schedules = autoSync.schedules || [];
      const items = [];
      
      schedules.forEach((schedule, index) => {
        items.push(new ScheduleItem(
          schedule.time,
          schedule.enabled,
          index,
          'notas.editSchedule'
        ));
      });
      
      // Add schedule button
      items.push(new ActionButton(
        'Add Schedule',
        'Add a new sync schedule',
        'notas.addSchedule',
        'add'
      ));
      
      return items;
    }
    
    return [];
  } catch (error) {
    console.error('WorkspaceConfigProvider error:', error);
    return [
      new ConfigItem(
        'Error loading configuration',
        error.message,
        vscode.TreeItemCollapsibleState.None,
        error.stack,
        'error'
      )
    ];
  }
}
  
  /**
   * Shorten URL for display
   * @param {string} url
   * @returns {string}
   */
  shortenUrl(url) {
    if (!url) return 'Not set';
    
    // Extract repo name from URL
    const match = url.match(/\/([^/]+)\.git$/);
    if (match) {
      return match[1];
    }
    
    // If URL is too long, truncate
    if (url.length > 40) {
      return url.substring(0, 37) + '...';
    }
    
    return url;
  }
  
  /**
   * Shorten path for display
   * @param {string} filePath
   * @returns {string}
   */
  shortenPath(filePath) {
    if (!filePath) return 'Not set';
    
    const parts = filePath.split('/');
    if (parts.length > 3) {
      return '.../' + parts.slice(-2).join('/');
    }
    
    return filePath;
  }
  
  /**
   * Get conflict strategy label
   * @param {string} strategy
   * @returns {string}
   */
  getStrategyLabel(strategy) {
    const labels = {
      'ours': 'Keep Local',
      'theirs': 'Accept Remote',
      'manual': 'Manual Resolution'
    };
    
    return labels[strategy] || strategy;
  }
  
  /**
   * Format next sync time
   * @param {Date} nextSync
   * @returns {string}
   */
  formatNextSync(nextSync) {
    if (!nextSync) return 'Not scheduled';
    
    const now = new Date();
    const diff = nextSync - now;
    
    if (diff < 0) return 'Soon...';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}

/**
 * Tree item for configuration
 */
class ConfigItem extends vscode.TreeItem {
  constructor(label, description, collapsibleState, tooltip, contextValue, color, commandId) {
    super(label, collapsibleState);
    
    this.description = description;
    this.tooltip = tooltip || description;
    this.contextValue = contextValue;
    
    if (color) {
      this.iconPath = new vscode.ThemeIcon('circle-filled', new vscode.ThemeColor(color));
    }
    
    // Add command if provided
    if (commandId) {
      this.command = {
        command: commandId,
        title: label,
        arguments: [contextValue]
      };
    }
  }
}

/**
 * Tree item for actions/buttons
 */
class ActionItem extends vscode.TreeItem {
  constructor(label, tooltip, commandId) {
    super(label, vscode.TreeItemCollapsibleState.None);
    
    this.tooltip = tooltip;
    this.contextValue = 'action';
    
    this.command = {
      command: commandId,
      title: tooltip,
      arguments: []
    };
  }
}

/**
 * Section header (non-clickable separator)
 */
class SectionHeader extends vscode.TreeItem {
  constructor(label) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.contextValue = 'header';
    this.description = '';
    this.iconPath = new vscode.ThemeIcon('symbol-keyword');
  }
}

/**
 * Toggle item (clickable toggle button)
 */
class ToggleItem extends vscode.TreeItem {
  constructor(prefix, label, description, tooltip, commandId, icon, color) {
    super(`${prefix} ${label}`, vscode.TreeItemCollapsibleState.None);
    
    this.description = description;
    this.tooltip = tooltip;
    this.contextValue = 'toggle';
    
    if (icon) {
      this.iconPath = new vscode.ThemeIcon(icon, color ? new vscode.ThemeColor(color) : undefined);
    }
    
    this.command = {
      command: commandId,
      title: tooltip,
      arguments: []
    };
  }
}

/**
 * Clickable item (for settings that open a picker)
 */
class ClickableItem extends vscode.TreeItem {
  constructor(label, description, tooltip, commandId) {
    super(label, vscode.TreeItemCollapsibleState.None);
    
    this.description = description;
    this.tooltip = tooltip;
    this.contextValue = 'clickable';
    this.iconPath = new vscode.ThemeIcon('settings-gear');
    
    this.command = {
      command: commandId,
      title: tooltip,
      arguments: []
    };
  }
}

/**
 * Action button (prominent button style)
 */
class ActionButton extends vscode.TreeItem {
  constructor(label, tooltip, commandId, icon) {
    super(`▶ ${label}`, vscode.TreeItemCollapsibleState.None);
    
    this.tooltip = tooltip;
    this.contextValue = 'button';
    
    if (icon) {
      this.iconPath = new vscode.ThemeIcon(icon);
    }
    
    this.command = {
      command: commandId,
      title: tooltip,
      arguments: []
    };
  }
}

/**
 * Schedule item (individual schedule with actions)
 */
class ScheduleItem extends vscode.TreeItem {
  constructor(time, enabled, index, commandId) {
    super(`🕐 ${time}`, vscode.TreeItemCollapsibleState.None);
    
    this.description = enabled ? 'Daily' : 'Disabled';
    this.tooltip = 'Click to edit or remove';
    this.contextValue = 'schedule';
    
    const color = enabled ? 'charts.green' : 'charts.gray';
    this.iconPath = new vscode.ThemeIcon('circle-filled', new vscode.ThemeColor(color));
    
    this.command = {
      command: commandId,
      title: 'Edit schedule',
      arguments: [index]
    };
  }
}

module.exports = WorkspaceConfigProvider;
