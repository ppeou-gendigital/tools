const vscode = require('vscode');

class CompareSettingsProvider {
  constructor(workspaceService) {
    this.workspaceService = workspaceService;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren(element) {
    try {
      const config = await this.workspaceService.getConfig();
      if (!config || !config.fileTools) {
        return [];
      }

      const compare = config.fileTools.compare || {};
      const items = [];

      items.push(new CompareSettingItem(
        '⚪ Ignore Whitespace',
        compare.ignoreWhitespace ? 'Yes' : 'No',
        `Click to toggle (current: ${compare.ignoreWhitespace ? 'enabled' : 'disabled'})`,
        'notas.toggleIgnoreWhitespace'
      ));

      items.push(new CompareSettingItem(
        '🔤 Ignore Case',
        compare.ignoreCase ? 'Yes' : 'No',
        `Click to toggle (current: ${compare.ignoreCase ? 'enabled' : 'disabled'})`,
        'notas.toggleIgnoreCase'
      ));

      return items;
    } catch (error) {
      console.error('Error in CompareSettingsProvider.getChildren:', error);
      return [];
    }
  }
}

class CompareSettingItem extends vscode.TreeItem {
  constructor(label, description, tooltip, commandId) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.tooltip = tooltip;
    this.command = {
      command: commandId,
      title: label
    };
    this.contextValue = 'compareSetting';
  }
}

module.exports = CompareSettingsProvider;
