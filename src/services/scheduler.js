const vscode = require('vscode');
const simpleGit = require('simple-git');

/**
 * Auto-sync scheduler for Git worktrees
 */
class SchedulerService {
  constructor(workspaceService, gitService) {
    this.workspaceService = workspaceService;
    this.gitService = gitService;
    this.timers = [];
    this.statusBarItem = null;
  }
  
  /**
   * Start the scheduler
   */
  start() {
    const config = this.workspaceService.getConfig();
    
    if (!config?.autoSync?.enabled) {
      return;
    }
    
    // Create status bar item
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.statusBarItem.command = 'notas.openScheduleSettings';
    this.statusBarItem.show();
    
    // Schedule all sync times
    for (const schedule of config.autoSync.schedules) {
      if (schedule.enabled) {
        this.scheduleSync(schedule.time);
      }
    }
    
    this.updateStatusBar();
    
    console.log('Notas scheduler started');
  }
  
  /**
   * Schedule a sync at specific time
   * @param {string} timeString - Time in HH:MM format
   */
  scheduleSync(timeString) {
    // Parse time (e.g., "11:00" or "19:00")
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Calculate next occurrence
    const now = new Date();
    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const msUntilRun = nextRun.getTime() - now.getTime();
    
    console.log(`Scheduled sync at ${timeString} (in ${Math.round(msUntilRun / 60000)} minutes)`);
    
    // Schedule timer
    const timer = setTimeout(async () => {
      await this.runSync(timeString);
      
      // Reschedule for next day
      this.scheduleSync(timeString);
    }, msUntilRun);
    
    this.timers.push({ time: timeString, timer, nextRun });
  }
  
  /**
   * Run sync operation
   * @param {string} timeString - Time identifier
   * @returns {Promise<Object>}
   */
  async runSync(timeString) {
    const config = this.workspaceService.getConfig();
    
    vscode.window.showInformationMessage(
      `Starting scheduled sync (${timeString})...`
    );
    
    try {
      return await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Auto-syncing worktrees...',
        cancellable: false
      }, async (progress) => {
        // Get all worktrees - use the improved repo finder
        const workspaceRoot = this.workspaceService.getRootPath();
        
        // Find the main repository using the improved logic
        const repoPath = await this.gitService.findMainRepo(workspaceRoot);
        
        if (!repoPath) {
          throw new Error('No git repository found in workspace');
        }
        
        const worktrees = await this.gitService.listWorktrees(repoPath);
        
        const results = {
          synced: [],
          failed: []
        };
        
        for (const [index, worktree] of worktrees.entries()) {
          progress.report({
            increment: (index / worktrees.length) * 100,
            message: `Syncing ${worktree.branch}...`
          });
          
          try {
            await this.syncWorktree(
              worktree.path,
              worktree.branch,
              config.autoSync
            );
            results.synced.push(worktree.branch);
          } catch (error) {
            results.failed.push({
              branch: worktree.branch,
              error: error.message
            });
          }
        }
        
        // Show summary
        this.showSyncSummary(results);
        
        return results;
      });
      
    } catch (error) {
      vscode.window.showErrorMessage(
        `Auto-sync failed: ${error.message}`
      );
      return { synced: [], failed: [] };
    }
  }
  
  /**
   * Sync a single worktree
   * @param {string} worktreePath - Path to worktree
   * @param {string} branch - Branch name
   * @param {Object} syncConfig - Sync configuration
   * @returns {Promise<Object>}
   */
  async syncWorktree(worktreePath, branch, syncConfig) {
    const git = simpleGit(worktreePath);
    
    // 1. Check for uncommitted changes
    const status = await git.status();
    
    if (!status.isClean() && syncConfig.autoCommit) {
      // Auto-commit changes
      const commitMessage = syncConfig.commitMessage
        .replace('{time}', new Date().toLocaleTimeString())
        .replace('{branch}', branch);
      
      await git.add('.');
      await git.commit(commitMessage);
    }
    
    // 2. Fetch latest from remote
    await git.fetch();
    
    // 3. Check if remote has changes
    const localCommit = await git.revparse(['HEAD']);
    const remoteCommit = await git.revparse([`origin/${branch}`]);
    
    if (localCommit === remoteCommit) {
      // Already up to date
      return { status: 'up-to-date' };
    }
    
    // 4. Try to pull (may have conflicts)
    try {
      await git.pull('origin', branch, {
        '--no-rebase': null
      });
    } catch (error) {
      // Handle merge conflicts based on strategy
      if (error.message.includes('conflict')) {
        await this.gitService.handleConflict(worktreePath, syncConfig.conflictStrategy);
      } else {
        throw error;
      }
    }
    
    // 5. Push local changes
    await git.push('origin', branch);
    
    return { status: 'synced' };
  }
  
  /**
   * Show sync summary notification
   * @param {Object} results - Sync results
   */
  showSyncSummary(results) {
    const total = results.synced.length + results.failed.length;
    
    if (results.failed.length === 0) {
      vscode.window.showInformationMessage(
        `✓ Auto-sync completed: ${results.synced.length}/${total} worktrees synced`
      );
    } else {
      vscode.window.showWarningMessage(
        `Auto-sync completed with errors: ${results.synced.length}/${total} synced, ${results.failed.length} failed`,
        'View Errors'
      ).then(action => {
        if (action === 'View Errors') {
          this.showErrorDetails(results.failed);
        }
      });
    }
  }
  
  /**
   * Show error details in output channel
   * @param {Array} errors - Error details
   */
  showErrorDetails(errors) {
    const channel = vscode.window.createOutputChannel('Notas Auto-Sync');
    channel.clear();
    channel.appendLine('Auto-Sync Errors:\n');
    
    for (const error of errors) {
      channel.appendLine(`Branch: ${error.branch}`);
      channel.appendLine(`Error: ${error.error}`);
      channel.appendLine('---\n');
    }
    
    channel.show();
  }
  
  /**
   * Update status bar with next sync time
   */
  updateStatusBar() {
    if (!this.statusBarItem) {
      return;
    }
    
    const nextSync = this.getNextScheduledSync();
    
    if (nextSync) {
      const timeUntil = this.getTimeUntilSync(nextSync);
      this.statusBarItem.text = `$(sync) Next sync: ${nextSync.time} (${timeUntil})`;
      this.statusBarItem.tooltip = 'Click to manage auto-sync schedule';
    } else {
      this.statusBarItem.text = '$(sync-ignored) Auto-sync disabled';
    }
    
    // Update every minute
    setTimeout(() => this.updateStatusBar(), 60000);
  }
  
  /**
   * Get next scheduled sync
   * @returns {Object|null}
   */
  getNextScheduledSync() {
    if (this.timers.length === 0) return null;
    
    return this.timers.reduce((closest, current) => {
      if (!closest) return current;
      return current.nextRun < closest.nextRun ? current : closest;
    });
  }
  
  /**
   * Get next sync time as Date
   * @returns {Date|null}
   */
  getNextSyncTime() {
    const nextSync = this.getNextScheduledSync();
    return nextSync ? nextSync.nextRun : null;
  }
  
  /**
   * Get time until next sync
   * @param {Object} sync - Sync timer object
   * @returns {string}
   */
  getTimeUntilSync(sync) {
    const now = new Date();
    const msUntil = sync.nextRun.getTime() - now.getTime();
    const hours = Math.floor(msUntil / (1000 * 60 * 60));
    const minutes = Math.floor((msUntil % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
  
  /**
   * Stop the scheduler
   */
  stop() {
    // Clear all timers
    for (const { timer } of this.timers) {
      clearTimeout(timer);
    }
    this.timers = [];
    
    // Hide status bar
    if (this.statusBarItem) {
      this.statusBarItem.dispose();
      this.statusBarItem = null;
    }
    
    console.log('Notas scheduler stopped');
  }
}

module.exports = SchedulerService;
