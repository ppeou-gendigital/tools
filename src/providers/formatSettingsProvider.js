const vscode = require('vscode');

class FormatSettingsProvider {
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

      const format = config.fileTools.format || {};
      const items = [];

      items.push(new FormatSettingItem(
        '📏 Indent Type',
        format.indentType === 'tabs' ? 'Tabs' : 'Spaces',
        `Click to change (current: ${format.indentType})`,
        'notas.changeIndentType'
      ));

      items.push(new FormatSettingItem(
        '🔢 Indent Size',
        `${format.indentSize} spaces`,
        `Click to change (current: ${format.indentSize})`,
        'notas.changeIndentSize'
      ));

      items.push(new FormatSettingItem(
        '📐 Line Width',
        `${format.lineWidth} characters`,
        `Click to change (current: ${format.lineWidth})`,
        'notas.changeLineWidth'
      ));

      items.push(new FormatSettingItem(
        '💬 Quotes',
        format.quotes === 'single' ? "Single (')" : 'Double (")',
        `Click to change (current: ${format.quotes})`,
        'notas.changeQuotesStyle'
      ));

      items.push(new FormatSettingItem(
        '🔹 Semicolons',
        format.semicolons ? 'Yes' : 'No',
        `Click to toggle (current: ${format.semicolons})`,
        'notas.toggleSemicolons'
      ));

      return items;
    } catch (error) {
      console.error('Error in FormatSettingsProvider.getChildren:', error);
      return [];
    }
  }
}

class FormatSettingItem extends vscode.TreeItem {
  constructor(label, description, tooltip, commandId) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.tooltip = tooltip;
    this.command = {
      command: commandId,
      title: label
    };
    this.contextValue = 'formatSetting';
  }
}

module.exports = FormatSettingsProvider;
