const vscode = require('vscode');
const path = require('path');

/**
 * Initialize workspace command
 * @param {Object} services
 * @param {Object} providers
 */
async function initWorkspace(services, providers) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a folder first');
    return;
  }
  
  const rootPath = workspaceFolder.uri.fsPath;
  
  // Ask for Git repo URL
  const repoUrl = await vscode.window.showInputBox({
    prompt: 'Enter Git repository URL',
    placeHolder: 'https://github.com/user/repo.git or git@github.com:user/repo.git',
    validateInput: (value) => {
      if (!value) return 'Repository URL is required';
      // Support both HTTPS and SSH URLs
      if (!value.match(/^(https?:\/\/.+\.git|git@.+:.+\.git)$/)) {
        return 'Please enter a valid Git URL (HTTPS or SSH)';
      }
      return null;
    }
  });
  
  if (!repoUrl) return;
  
  try {
    // Create config
    await services.workspace.createConfig(rootPath, repoUrl);
    
    vscode.window.showInformationMessage('Workspace initialized!');
    
    // Refresh tree view
    providers.worktree.refresh();
    if (providers.config) {
      providers.config.refresh();
    }
    if (providers.commandsPanel) {
      providers.commandsPanel.refresh();
    }
    
    // Ask if user wants to clone and sync worktrees now
    const sync = await vscode.window.showInformationMessage(
      'Clone repository and sync worktrees now?',
      'Yes', 'Later'
    );
    
    if (sync === 'Yes') {
      // Detect the default branch name from the remote repository
      vscode.window.showInformationMessage('Detecting default branch...');
      const defaultBranch = await services.git.getDefaultBranch(repoUrl);
      
      // Clone repository using the default branch name as the folder name
      const repoPath = path.join(rootPath, defaultBranch);
      
      await services.git.cloneRepo(repoUrl, repoPath);
      
      vscode.window.showInformationMessage(`Repository cloned to '${defaultBranch}' folder!`);
      
      // Sync worktrees
      const worktreeCommands = require('./worktree');
      await worktreeCommands.syncWorktrees(services, providers);
    }
    
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to initialize workspace: ${error.message}`);
  }
}

module.exports = { initWorkspace };
