const vscode = require('vscode');
const path = require('path');

/**
 * Tree view provider for worktrees
 */
class WorktreeProvider {
  constructor(workspaceService, gitService) {
    this.workspaceService = workspaceService;
    this.gitService = gitService;
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
   * @param {WorktreeItem} element
   * @returns {vscode.TreeItem}
   */
  getTreeItem(element) {
    return element;
  }
  
  /**
   * Get children of tree item
   * @param {WorktreeItem} [element]
   * @returns {Promise<WorktreeItem[]>}
   */
  async getChildren(element) {
    const config = this.workspaceService.getConfig();
    
    if (!config) {
      return [new MessageItem('No workspace initialized')];
    }
    
    if (!element) {
      // Root level - show repository info
      try {
        const rootPath = this.workspaceService.getRootPath();
        
        // Find the main repository using the improved logic
        const repoPath = await this.gitService.findMainRepo(rootPath);
        
        if (!repoPath) {
          return [new MessageItem('No repository found. Click sync to create.')];
        }
        
        const worktrees = await this.gitService.listWorktrees(repoPath);
        
        if (worktrees.length === 0) {
          return [new MessageItem('No worktrees found. Click sync to create.')];
        }
        
        return worktrees.map(wt => 
          new WorktreeItem(
            wt.branch,
            wt.path,
            vscode.TreeItemCollapsibleState.None
          )
        );
      } catch (error) {
        return [new MessageItem(`Error: ${error.message}`)];
      }
    }
    
    return [];
  }
}

/**
 * Tree item for a worktree
 */
class WorktreeItem extends vscode.TreeItem {
  constructor(branch, worktreePath, collapsibleState) {
    super(branch, collapsibleState);
    
    this.branch = branch;
    this.worktreePath = worktreePath;
    
    this.tooltip = worktreePath;
    this.description = path.basename(worktreePath);
    this.contextValue = 'worktree';
    this.iconPath = new vscode.ThemeIcon('git-branch');
    
    this.command = {
      command: 'notas.openWorktree',
      title: 'Open Worktree',
      arguments: [this]
    };
  }
}

/**
 * Tree item for messages
 */
class MessageItem extends vscode.TreeItem {
  constructor(message) {
    super(message, vscode.TreeItemCollapsibleState.None);
    
    this.contextValue = 'message';
    this.iconPath = new vscode.ThemeIcon('info');
  }
}

module.exports = WorktreeProvider;
