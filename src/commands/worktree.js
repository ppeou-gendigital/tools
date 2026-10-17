const vscode = require('vscode');
const path = require('path');

/**
 * Sync worktrees command
 * @param {Object} services
 * @param {Object} providers
 */
async function syncWorktrees(services, providers) {
  const config = services.workspace.getConfig();
  
  if (!config) {
    vscode.window.showErrorMessage('No workspace initialized');
    return;
  }
  
  const rootPath = services.workspace.getRootPath();
  
  // Find the main repository using the improved logic
  const repoPath = await services.git.findMainRepo(rootPath);
  
  if (!repoPath) {
    vscode.window.showErrorMessage('No repository found. Please clone the repository first.');
    return;
  }
  
  try {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Syncing worktrees...',
      cancellable: false
    }, async (progress) => {
      // Get branches
      progress.report({ message: 'Fetching branches...' });
      const branches = await services.git.getBranches(repoPath);
      
      // Sync worktrees
      progress.report({ message: 'Creating worktrees...' });
      const results = await services.git.syncWorktrees(repoPath, branches.remote);
      
      // Show results
      if (results.created.length > 0) {
        vscode.window.showInformationMessage(
          `Created ${results.created.length} worktree(s): ${results.created.join(', ')}`
        );
      } else if (results.skipped.length > 0) {
        vscode.window.showInformationMessage('All worktrees already exist');
      }
      
      if (results.errors.length > 0) {
        vscode.window.showWarningMessage(
          `${results.errors.length} error(s) occurred. Check output for details.`
        );
      }
      
      // Refresh tree view
      providers.worktree.refresh();
      if (providers.config) {
        providers.config.refresh();
      }
    });
  } catch (error) {
    vscode.window.showErrorMessage(`Sync failed: ${error.message}`);
  }
}

/**
 * Refresh worktrees view
 * @param {Object} providers
 */
function refreshWorktrees(providers) {
  providers.worktree.refresh();
  if (providers.config) {
    providers.config.refresh();
  }
  vscode.window.showInformationMessage('Worktree view refreshed');
}

/**
 * Open worktree in new window
 * @param {Object} item - Tree item
 */
async function openWorktree(item) {
  if (!item || !item.worktreePath) {
    vscode.window.showErrorMessage('Invalid worktree selection');
    return;
  }
  
  const uri = vscode.Uri.file(item.worktreePath);
  
  // Ask user if they want to open in new window or current window
  const choice = await vscode.window.showQuickPick(
    ['New Window', 'Current Window'],
    { placeHolder: `Open ${item.branch} in...` }
  );
  
  if (choice === 'New Window') {
    await vscode.commands.executeCommand('vscode.openFolder', uri, true);
  } else if (choice === 'Current Window') {
    await vscode.commands.executeCommand('vscode.openFolder', uri, false);
  }
}

/**
 * Remove worktree
 * @param {Object} services
 * @param {Object} providers
 * @param {Object} item - Tree item
 */
async function removeWorktree(services, providers, item) {
  if (!item || !item.branch) {
    vscode.window.showErrorMessage('Invalid worktree selection');
    return;
  }
  
  const confirm = await vscode.window.showWarningMessage(
    `Remove worktree for branch "${item.branch}"? This will delete the folder.`,
    'Remove', 'Cancel'
  );
  
  if (confirm !== 'Remove') {
    return;
  }
  
  try {
    const rootPath = services.workspace.getRootPath();
    await services.git.removeWorktree(rootPath, item.branch);
    
    vscode.window.showInformationMessage(`Worktree "${item.branch}" removed`);
    
    // Refresh tree view
    providers.worktree.refresh();
    if (providers.config) {
      providers.config.refresh();
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to remove worktree: ${error.message}`);
  }
}

/**
 * Create a new branch
 * @param {Object} services
 * @param {Object} providers
 */
async function createBranch(services, providers) {
  const config = services.workspace.getConfig();
  
  if (!config) {
    vscode.window.showErrorMessage('No workspace initialized');
    return;
  }
  
  const rootPath = services.workspace.getRootPath();
  
  // Find the main repository using the improved logic
  const repoPath = await services.git.findMainRepo(rootPath);
  
  if (!repoPath) {
    vscode.window.showErrorMessage('No repository found. Please clone the repository first.');
    return;
  }
  
  try {
    // Get existing branches
    const branches = await services.git.getBranches(repoPath);
    
    // Prompt for branch name
    const branchName = await vscode.window.showInputBox({
      prompt: 'Enter new branch name',
      placeHolder: 'feature/my-feature',
      validateInput: (value) => {
        if (!value || value.trim() === '') {
          return 'Branch name cannot be empty';
        }
        if (branches.local.includes(value)) {
          return `Branch '${value}' already exists`;
        }
        if (!/^[a-zA-Z0-9/_-]+$/.test(value)) {
          return 'Branch name can only contain letters, numbers, /, - and _';
        }
        return null;
      }
    });
    
    if (!branchName) {
      return; // User cancelled
    }
    
    // Ask for base branch
    const baseBranchOptions = ['(Current branch)', ...branches.local];
    const baseBranch = await vscode.window.showQuickPick(baseBranchOptions, {
      placeHolder: 'Select base branch (branch to create from)'
    });
    
    if (!baseBranch) {
      return; // User cancelled
    }
    
    const baseRef = baseBranch === '(Current branch)' ? null : baseBranch;
    
    // Ask if they want to create a worktree
    const createWorktree = await vscode.window.showQuickPick(
      [
        { label: 'Create branch with worktree', value: true },
        { label: 'Create branch only', value: false }
      ],
      { placeHolder: 'Do you want to create a worktree for this branch?' }
    );
    
    if (!createWorktree) {
      return; // User cancelled
    }
    
    // Create the branch
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Creating branch '${branchName}'...`,
      cancellable: false
    }, async () => {
      await services.git.createBranch(repoPath, branchName, baseRef, createWorktree.value);
    });
    
    vscode.window.showInformationMessage(
      `✓ Branch '${branchName}' created${createWorktree.value ? ' with worktree' : ''}`
    );
    
    // Refresh views
    providers.worktree.refresh();
    if (providers.config) {
      providers.config.refresh();
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create branch: ${error.message}`);
  }
}

/**
 * Clean up inconsistent worktrees
 * @param {Object} services
 * @param {Object} providers
 */
async function cleanupWorktrees(services, providers) {
  const config = services.workspace.getConfig();
  
  if (!config) {
    vscode.window.showErrorMessage('No workspace initialized');
    return;
  }
  
  const rootPath = services.workspace.getRootPath();
  
  // Find the main repository
  const repoPath = await services.git.findMainRepo(rootPath);
  
  if (!repoPath) {
    vscode.window.showErrorMessage('No repository found.');
    return;
  }
  
  // Ask user if they want to recreate worktrees
  const choice = await vscode.window.showWarningMessage(
    'This will remove worktrees not at the workspace root level. Recreate them in the correct location?',
    'Yes, Recreate',
    'Just Remove',
    'Cancel'
  );
  
  if (!choice || choice === 'Cancel') {
    return;
  }
  
  const recreate = choice === 'Yes, Recreate';
  
  try {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Cleaning up worktrees...',
      cancellable: false
    }, async (progress) => {
      const results = await services.git.cleanupWorktrees(repoPath, recreate);
      
      // Build summary message
      let message = '';
      
      if (results.removed.length > 0) {
        message += `Removed ${results.removed.length} inconsistent worktree(s):\n`;
        message += results.removed.map(w => `  - ${w}`).join('\n');
      }
      
      if (results.recreated.length > 0) {
        message += `\n\nRecreated ${results.recreated.length} worktree(s) at correct location:\n`;
        message += results.recreated.map(w => `  - ${w}`).join('\n');
      }
      
      if (results.errors.length > 0) {
        message += `\n\nErrors:\n`;
        message += results.errors.map(e => `  - ${e.branch}: ${e.error}`).join('\n');
      }
      
      if (results.removed.length === 0 && results.recreated.length === 0) {
        vscode.window.showInformationMessage('No inconsistent worktrees found. All good!');
      } else {
        vscode.window.showInformationMessage(message, { modal: true });
      }
      
      // Refresh views
      providers.worktree.refresh();
      if (providers.config) {
        providers.config.refresh();
      }
    });
  } catch (error) {
    vscode.window.showErrorMessage(`Cleanup failed: ${error.message}`);
  }
}

module.exports = {
  syncWorktrees,
  refreshWorktrees,
  openWorktree,
  removeWorktree,
  createBranch,
  cleanupWorktrees
};
