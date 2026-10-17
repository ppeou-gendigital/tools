const simpleGit = require('simple-git');
const path = require('path');
const vscode = require('vscode');

/**
 * Git operations and worktree management
 */
class GitService {
  /**
   * Get the default branch name from a remote repository
   * @param {string} repoUrl - Repository URL
   * @returns {Promise<string>} Default branch name (e.g., 'main', 'master', 'develop')
   */
  async getDefaultBranch(repoUrl) {
    const git = simpleGit();
    
    try {
      // Use git ls-remote to get the default branch without cloning
      const result = await git.raw(['ls-remote', '--symref', repoUrl, 'HEAD']);
      
      // Parse output like: "ref: refs/heads/main	HEAD"
      const match = result.match(/ref: refs\/heads\/(\S+)\s+HEAD/);
      
      if (match && match[1]) {
        return match[1];
      }
      
      // Fallback to 'main' if we can't detect
      return 'main';
    } catch (error) {
      console.error('Error detecting default branch:', error);
      // Fallback to 'main' as default
      return 'main';
    }
  }
  
  /**
   * Clone a repository to target path
   * @param {string} repoUrl - Repository URL
   * @param {string} targetPath - Target directory
   * @returns {Promise<void>}
   */
  async cloneRepo(repoUrl, targetPath) {
    const git = simpleGit();
    
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Cloning repository...',
      cancellable: false
    }, async (progress) => {
      try {
        await git.clone(repoUrl, targetPath);
        progress.report({ increment: 100 });
      } catch (error) {
        throw new Error(`Clone failed: ${error.message}`);
      }
    });
  }
  
  /**
   * Get all branches (local and remote)
   * @param {string} repoPath - Repository path
   * @returns {Promise<{local: string[], remote: string[]}>}
   */
  async getBranches(repoPath) {
    const git = simpleGit(repoPath);
    
    try {
      // Fetch from remote
      await git.fetch();
      
      // Get all branches
      const branches = await git.branch(['-a']);
      
      return {
        local: branches.all.filter(b => !b.startsWith('remotes/')),
        remote: branches.all
          .filter(b => b.startsWith('remotes/origin/'))
          .map(b => b.replace('remotes/origin/', ''))
          .filter(b => b !== 'HEAD')
      };
    } catch (error) {
      throw new Error(`Failed to get branches: ${error.message}`);
    }
  }
  
  /**
   * Create a new branch
   * @param {string} repoPath - Repository path
   * @param {string} branchName - New branch name
   * @param {string} baseBranch - Base branch to create from (optional)
   * @param {boolean} createWorktree - Whether to create a worktree for the branch
   * @returns {Promise<void>}
   */
  async createBranch(repoPath, branchName, baseBranch = null, createWorktree = false) {
    const git = simpleGit(repoPath);
    
    try {
      // Validate branch name
      if (!branchName || branchName.trim() === '') {
        throw new Error('Branch name cannot be empty');
      }
      
      // Check if branch already exists
      const branches = await git.branch(['-a']);
      if (branches.all.includes(branchName)) {
        throw new Error(`Branch '${branchName}' already exists`);
      }
      
      if (createWorktree) {
        // Create worktree with new branch
        const worktreePath = path.join(
          path.dirname(repoPath),
          branchName
        );
        
        const args = ['worktree', 'add', '-b', branchName, worktreePath];
        if (baseBranch) {
          args.push(baseBranch);
        }
        
        await git.raw(args);
        
        // Push the new branch to remote
        try {
          await git.push('origin', branchName, ['--set-upstream']);
        } catch (error) {
          console.warn(`Failed to push new branch to remote: ${error.message}`);
          // Don't fail the entire operation if push fails
        }
      } else {
        // Create branch without worktree
        if (baseBranch) {
          await git.checkoutBranch(branchName, baseBranch);
        } else {
          await git.checkoutLocalBranch(branchName);
        }
        
        // Push the new branch to remote
        try {
          await git.push('origin', branchName, ['--set-upstream']);
        } catch (error) {
          console.warn(`Failed to push new branch to remote: ${error.message}`);
          // Don't fail the entire operation if push fails
        }
      }
    } catch (error) {
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }
  
  /**
   * List all worktrees
   * @param {string} repoPath - Repository path
   * @returns {Promise<Array<{path: string, branch: string}>>}
   */
  async listWorktrees(repoPath) {
    const git = simpleGit(repoPath);
    
    try {
      const result = await git.raw(['worktree', 'list', '--porcelain']);
      
      const worktrees = [];
      const lines = result.split('\n');
      let current = {};
      
      for (const line of lines) {
        if (line.startsWith('worktree ')) {
          current.path = line.substring(9);
        } else if (line.startsWith('branch ')) {
          current.branch = line.substring(7).replace('refs/heads/', '');
        } else if (line === '') {
          if (current.path && current.branch) {
            worktrees.push(current);
          }
          current = {};
        }
      }
      
      return worktrees;
    } catch (error) {
      console.error('Error listing worktrees:', error);
      return [];
    }
  }
  
  /**
   * Find the main repository path from workspace root
   * Looks for the first worktree (which is typically the main repo)
   * @param {string} workspaceRoot - Workspace root path
   * @returns {Promise<string|null>}
   */
  async findMainRepo(workspaceRoot) {
    const fs = require('fs').promises;
    
    try {
      // Look for any git repository in the workspace
      const entries = await fs.readdir(workspaceRoot, { withFileTypes: true });
      const repoDirs = entries.filter(e => 
        e.isDirectory() && 
        e.name !== '.notas' && 
        !e.name.startsWith('.')
      );
      
      if (repoDirs.length === 0) {
        return null;
      }
      
      // Try each directory to see if it's a git repo
      for (const dir of repoDirs) {
        const dirPath = path.join(workspaceRoot, dir.name);
        const gitPath = path.join(dirPath, '.git');
        
        try {
          const stats = await fs.stat(gitPath);
          // If .git exists (either as directory or file for worktrees)
          if (stats) {
            // Get worktree list from this repo
            const worktrees = await this.listWorktrees(dirPath);
            
            // Find the main worktree (the one that contains the actual .git directory)
            const mainWorktree = worktrees.find(wt => {
              const wtGitPath = path.join(wt.path, '.git');
              try {
                const wtStats = require('fs').statSync(wtGitPath);
                return wtStats.isDirectory(); // Main repo has .git as directory
              } catch {
                return false;
              }
            });
            
            if (mainWorktree) {
              return mainWorktree.path;
            }
            
            // If no main worktree found with directory .git, use first worktree
            if (worktrees.length > 0) {
              return worktrees[0].path;
            }
            
            // Fallback to this directory
            return dirPath;
          }
        } catch {
          continue;
        }
      }
      
      // Fallback: use first directory
      return path.join(workspaceRoot, repoDirs[0].name);
    } catch (error) {
      console.error('Error finding main repo:', error);
      return null;
    }
  }
  
  /**
   * Clean up inconsistent worktrees
   * Removes worktrees not at workspace root level and optionally recreates them
   * @param {string} repoPath - Repository path
   * @param {boolean} recreate - Whether to recreate worktrees in correct location
   * @returns {Promise<{removed: string[], recreated: string[], errors: Array}>}
   */
  async cleanupWorktrees(repoPath, recreate = true) {
    const git = simpleGit(repoPath);
    const workspaceRoot = path.dirname(repoPath);
    
    const results = {
      removed: [],
      recreated: [],
      errors: []
    };
    
    try {
      const worktrees = await this.listWorktrees(repoPath);
      
      for (const wt of worktrees) {
        // Check if worktree is at the correct level (sibling of repo)
        const wtParent = path.dirname(wt.path);
        
        // Skip the main repository worktree
        const gitPath = path.join(wt.path, '.git');
        try {
          const stats = require('fs').statSync(gitPath);
          if (stats.isDirectory()) {
            continue; // This is the main repo, don't touch it
          }
        } catch {
          // Not main repo, continue checking
        }
        
        // If worktree is not at workspace root level, it's inconsistent
        if (wtParent !== workspaceRoot) {
          try {
            // Remove the inconsistent worktree
            await git.raw(['worktree', 'remove', wt.path, '--force']);
            results.removed.push(`${wt.branch} (from ${wt.path})`);
            
            // Recreate at correct location if requested
            if (recreate) {
              const newPath = path.join(workspaceRoot, wt.branch);
              
              // Check if a worktree already exists at the correct location
              const exists = worktrees.some(existingWt => existingWt.path === newPath);
              
              if (!exists) {
                await git.raw(['worktree', 'add', newPath, wt.branch]);
                results.recreated.push(wt.branch);
              }
            }
          } catch (error) {
            results.errors.push({
              branch: wt.branch,
              error: error.message
            });
          }
        }
      }
    } catch (error) {
      results.errors.push({
        branch: 'general',
        error: error.message
      });
    }
    
    return results;
  }
  
  /**
   * Sync worktrees with remote branches
   * @param {string} repoPath - Repository path
   * @param {string[]} remoteBranches - Remote branch names
   * @returns {Promise<{created: string[], skipped: string[], errors: Array}>}
   */
  async syncWorktrees(repoPath, remoteBranches) {
    const git = simpleGit(repoPath);
    const worktrees = await this.listWorktrees(repoPath);
    const existingBranches = worktrees.map(wt => wt.branch);
    
    const results = {
      created: [],
      skipped: [],
      errors: []
    };
    
    // Get workspace root (parent of repo)
    const workspaceRoot = path.dirname(repoPath);
    
    // Create worktrees for remote branches that don't exist locally
    for (const remoteBranch of remoteBranches) {
      if (existingBranches.includes(remoteBranch)) {
        results.skipped.push(remoteBranch);
        continue;
      }
      
      try {
        // Use the full branch name as the folder name
        // This ensures main -> main, develop -> develop, etc.
        const folderName = remoteBranch;
        const worktreePath = path.join(workspaceRoot, folderName);
        
        // Create local branch tracking remote
        await git.raw([
          'worktree', 'add', '-b', remoteBranch, 
          worktreePath, 
          `origin/${remoteBranch}`
        ]);
        
        results.created.push(remoteBranch);
      } catch (error) {
        results.errors.push({
          branch: remoteBranch,
          error: error.message
        });
      }
    }
    
    return results;
  }
  
  /**
   * Remove a worktree
   * @param {string} repoPath - Repository path
   * @param {string} branchName - Branch name
   * @returns {Promise<void>}
   */
  async removeWorktree(repoPath, branchName) {
    const git = simpleGit(repoPath);
    
    const worktreePath = path.join(
      path.dirname(repoPath),
      branchName
    );
    
    try {
      await git.raw(['worktree', 'remove', worktreePath, '--force']);
    } catch (error) {
      throw new Error(`Failed to remove worktree: ${error.message}`);
    }
  }
  
  /**
   * Get Git status for a worktree
   * @param {string} worktreePath - Worktree path
   * @returns {Promise<Object>}
   */
  async getStatus(worktreePath) {
    const git = simpleGit(worktreePath);
    
    try {
      return await git.status();
    } catch (error) {
      throw new Error(`Failed to get status: ${error.message}`);
    }
  }
  
  /**
   * Commit changes in a worktree
   * @param {string} worktreePath - Worktree path
   * @param {string} message - Commit message
   * @returns {Promise<void>}
   */
  async commit(worktreePath, message) {
    const git = simpleGit(worktreePath);
    
    try {
      await git.add('.');
      await git.commit(message);
    } catch (error) {
      throw new Error(`Failed to commit: ${error.message}`);
    }
  }
  
  /**
   * Pull changes from remote
   * @param {string} worktreePath - Worktree path
   * @param {string} branch - Branch name
   * @returns {Promise<void>}
   */
  async pull(worktreePath, branch) {
    const git = simpleGit(worktreePath);
    
    try {
      await git.pull('origin', branch, { '--no-rebase': null });
    } catch (error) {
      throw new Error(`Failed to pull: ${error.message}`);
    }
  }
  
  /**
   * Push changes to remote
   * @param {string} worktreePath - Worktree path
   * @param {string} branch - Branch name
   * @returns {Promise<void>}
   */
  async push(worktreePath, branch) {
    const git = simpleGit(worktreePath);
    
    try {
      await git.push('origin', branch);
    } catch (error) {
      throw new Error(`Failed to push: ${error.message}`);
    }
  }
  
  /**
   * Handle merge conflicts based on strategy
   * @param {string} worktreePath - Worktree path
   * @param {string} strategy - Conflict strategy ('ours', 'theirs', 'manual')
   * @returns {Promise<void>}
   */
  async handleConflict(worktreePath, strategy) {
    const git = simpleGit(worktreePath);
    
    try {
      switch (strategy) {
        case 'ours':
          // Keep local changes
          await git.raw(['checkout', '--ours', '.']);
          await git.add('.');
          await git.raw(['commit', '--no-edit']);
          break;
        
        case 'theirs':
          // Keep remote changes
          await git.raw(['checkout', '--theirs', '.']);
          await git.add('.');
          await git.raw(['commit', '--no-edit']);
          break;
        
        case 'manual':
          // Abort and notify user
          await git.merge(['--abort']);
          throw new Error('Merge conflict - manual resolution required');
        
        default:
          throw new Error('Unknown conflict strategy');
      }
    } catch (error) {
      throw new Error(`Conflict resolution failed: ${error.message}`);
    }
  }
}

module.exports = GitService;
