const vscode = require('vscode');

/**
 * Open schedule settings menu
 * @param {Object} services
 * @param {Object} providers
 */
async function openScheduleSettings(services, providers) {
  const config = services.workspace.getConfig();
  
  if (!config) {
    vscode.window.showErrorMessage('No workspace initialized');
    return;
  }
  
  const autoSync = config.autoSync || {
    enabled: false,
    schedules: [],
    conflictStrategy: 'ours',
    autoCommit: true,
    commitMessage: 'Auto-sync at {time}'
  };
  
  const options = [
    `${autoSync.enabled ? '$(check)' : '$(circle-slash)'} Toggle Auto-Sync (${autoSync.enabled ? 'ON' : 'OFF'})`,
    '$(add) Add Schedule',
    '$(trash) Remove Schedule',
    '$(settings-gear) Change Conflict Strategy',
    '$(sync) Manual Sync Now'
  ];
  
  const choice = await vscode.window.showQuickPick(options, {
    placeHolder: 'Manage Auto-Sync'
  });
  
  if (!choice) return;
  
  if (choice.includes('Toggle Auto-Sync')) {
    await toggleAutoSync(services, autoSync, providers);
  } else if (choice.includes('Add Schedule')) {
    await addSchedule(services, autoSync, providers);
  } else if (choice.includes('Remove Schedule')) {
    await removeSchedule(services, autoSync, providers);
  } else if (choice.includes('Change Conflict Strategy')) {
    await changeConflictStrategy(services, autoSync, providers);
  } else if (choice.includes('Manual Sync Now')) {
    await manualSync(services, providers);
  }
}

/**
 * Toggle auto-sync on/off
 * @param {Object} services
 * @param {Object} autoSync
 * @param {Object} providers
 */
async function toggleAutoSync(services, autoSync, providers) {
  autoSync.enabled = !autoSync.enabled;
  await saveAutoSyncConfig(services, autoSync);
  
  if (autoSync.enabled) {
    services.scheduler.start();
    vscode.window.showInformationMessage('Auto-sync enabled');
  } else {
    services.scheduler.stop();
    vscode.window.showInformationMessage('Auto-sync disabled');
  }
  
  // Refresh config view
  if (providers.config) {
    providers.config.refresh();
  }
}

/**
 * Add a new schedule
 * @param {Object} services
 * @param {Object} autoSync
 * @param {Object} providers
 */
async function addSchedule(services, autoSync, providers) {
  const time = await vscode.window.showInputBox({
    prompt: 'Enter sync time (24-hour format)',
    placeHolder: '11:00 or 19:00',
    validateInput: (value) => {
      if (!value.match(/^\d{1,2}:\d{2}$/)) {
        return 'Format must be HH:MM (e.g., 11:00)';
      }
      const [hours, minutes] = value.split(':').map(Number);
      if (hours > 23 || minutes > 59) {
        return 'Invalid time';
      }
      return null;
    }
  });
  
  if (!time) return;
  
  // Check if time already exists
  if (autoSync.schedules.some(s => s.time === time)) {
    vscode.window.showWarningMessage('Schedule already exists');
    return;
  }
  
  autoSync.schedules.push({ time, enabled: true });
  await saveAutoSyncConfig(services, autoSync);
  
  // Restart scheduler to pick up new schedule
  if (autoSync.enabled) {
    services.scheduler.stop();
    services.scheduler.start();
  }
  
  vscode.window.showInformationMessage(`Added schedule: ${time}`);
  
  // Refresh config view
  if (providers.config) {
    providers.config.refresh();
  }
}

/**
 * Remove a schedule
 * @param {Object} services
 * @param {Object} autoSync
 * @param {Object} providers
 */
async function removeSchedule(services, autoSync, providers) {
  if (autoSync.schedules.length === 0) {
    vscode.window.showInformationMessage('No schedules to remove');
    return;
  }
  
  const time = await vscode.window.showQuickPick(
    autoSync.schedules.map(s => s.time),
    { placeHolder: 'Select schedule to remove' }
  );
  
  if (!time) return;
  
  autoSync.schedules = autoSync.schedules.filter(s => s.time !== time);
  await saveAutoSyncConfig(services, autoSync);
  
  // Restart scheduler
  if (autoSync.enabled) {
    services.scheduler.stop();
    services.scheduler.start();
  }
  
  vscode.window.showInformationMessage(`Removed schedule: ${time}`);
  
  // Refresh config view
  if (providers.config) {
    providers.config.refresh();
  }
}

/**
 * Change conflict resolution strategy
 * @param {Object} services
 * @param {Object} autoSync
 * @param {Object} providers
 */
async function changeConflictStrategy(services, autoSync, providers) {
  const strategy = await vscode.window.showQuickPick([
    {
      label: 'Ours (Keep local changes)',
      value: 'ours',
      description: 'Always keep your local changes in conflicts'
    },
    {
      label: 'Theirs (Keep remote changes)',
      value: 'theirs',
      description: 'Always accept remote changes in conflicts'
    },
    {
      label: 'Manual (Skip on conflict)',
      value: 'manual',
      description: 'Skip worktrees with conflicts, require manual resolution'
    }
  ], {
    placeHolder: `Current strategy: ${autoSync.conflictStrategy}`
  });
  
  if (!strategy) return;
  
  autoSync.conflictStrategy = strategy.value;
  await saveAutoSyncConfig(services, autoSync);
  
  vscode.window.showInformationMessage(
    `Conflict strategy: ${strategy.label}`
  );
  
  // Refresh config view
  if (providers.config) {
    providers.config.refresh();
  }
}

/**
 * Trigger manual sync
 * @param {Object} services
 * @param {Object} providers
 */
async function manualSync(services, providers) {
  const config = services.workspace.getConfig();
  
  if (!config?.autoSync) {
    vscode.window.showErrorMessage('Auto-sync not configured');
    return;
  }
  
  // Trigger sync manually
  await services.scheduler.runSync('manual');
  
  // Refresh views after sync
  if (providers.worktree) {
    providers.worktree.refresh();
  }
  if (providers.config) {
    providers.config.refresh();
  }
}

/**
 * Save auto-sync configuration
 * @param {Object} services
 * @param {Object} autoSync
 */
async function saveAutoSyncConfig(services, autoSync) {
  const config = services.workspace.getConfig();
  config.autoSync = autoSync;
  
  await services.workspace.saveConfig();
}

/**
 * Command wrapper: Toggle auto-sync
 */
async function toggleAutoSyncCommand(services, providers) {
  const config = services.workspace.getConfig();
  if (!config || !config.autoSync) {
    vscode.window.showErrorMessage('No workspace configured');
    return;
  }
  
  await toggleAutoSync(services, config.autoSync, providers);
}

/**
 * Command wrapper: Toggle auto-commit
 */
async function toggleAutoCommitCommand(services, providers) {
  const config = services.workspace.getConfig();
  if (!config || !config.autoSync) {
    vscode.window.showErrorMessage('No workspace configured');
    return;
  }
  
  config.autoSync.autoCommit = !config.autoSync.autoCommit;
  await saveAutoSyncConfig(services, config.autoSync);
  
  vscode.window.showInformationMessage(
    `Auto-commit ${config.autoSync.autoCommit ? 'enabled' : 'disabled'}`
  );
  
  // Refresh config view
  if (providers.config) {
    providers.config.refresh();
  }
}

/**
 * Command wrapper: Change conflict strategy
 */
async function changeConflictStrategyCommand(services, providers) {
  const config = services.workspace.getConfig();
  if (!config || !config.autoSync) {
    vscode.window.showErrorMessage('No workspace configured');
    return;
  }
  
  await changeConflictStrategy(services, config.autoSync, providers);
}

/**
 * Command wrapper: Add schedule
 */
async function addScheduleCommand(services, providers) {
  const config = services.workspace.getConfig();
  if (!config || !config.autoSync) {
    vscode.window.showErrorMessage('No workspace configured');
    return;
  }
  
  await addSchedule(services, config.autoSync, providers);
}

/**
 * Command wrapper: Edit/remove schedule
 */
async function editScheduleCommand(services, providers, index) {
  const config = services.workspace.getConfig();
  if (!config || !config.autoSync) {
    vscode.window.showErrorMessage('No workspace configured');
    return;
  }
  
  const schedule = config.autoSync.schedules[index];
  if (!schedule) {
    vscode.window.showErrorMessage('Schedule not found');
    return;
  }
  
  const action = await vscode.window.showQuickPick([
    { label: '✓ Toggle Enabled/Disabled', value: 'toggle' },
    { label: '🗑️ Remove Schedule', value: 'remove' },
    { label: '✏️ Edit Time', value: 'edit' }
  ], {
    placeHolder: `Schedule: ${schedule.time}`
  });
  
  if (!action) return;
  
  switch (action.value) {
    case 'toggle':
      schedule.enabled = !schedule.enabled;
      await saveAutoSyncConfig(services, config.autoSync);
      vscode.window.showInformationMessage(
        `Schedule ${schedule.time} ${schedule.enabled ? 'enabled' : 'disabled'}`
      );
      break;
      
    case 'remove':
      config.autoSync.schedules.splice(index, 1);
      await saveAutoSyncConfig(services, config.autoSync);
      
      // Restart scheduler
      if (config.autoSync.enabled) {
        services.scheduler.stop();
        services.scheduler.start();
      }
      
      vscode.window.showInformationMessage(`Removed schedule: ${schedule.time}`);
      break;
      
    case 'edit':
      const newTime = await vscode.window.showInputBox({
        prompt: 'Enter new sync time (24-hour format)',
        value: schedule.time,
        validateInput: (value) => {
          if (!value.match(/^\d{1,2}:\d{2}$/)) {
            return 'Format must be HH:MM (e.g., 11:00)';
          }
          const [hours, minutes] = value.split(':').map(Number);
          if (hours > 23 || minutes > 59) {
            return 'Invalid time';
          }
          return null;
        }
      });
      
      if (newTime) {
        schedule.time = newTime;
        await saveAutoSyncConfig(services, config.autoSync);
        
        // Restart scheduler
        if (config.autoSync.enabled) {
          services.scheduler.stop();
          services.scheduler.start();
        }
        
        vscode.window.showInformationMessage(`Updated schedule to: ${newTime}`);
      }
      break;
  }
  
  // Refresh config view
  if (providers.config) {
    providers.config.refresh();
  }
}

/**
 * Remove schedule command (wrapper)
 * @param {Object} services
 * @param {Object} providers
 */
async function removeScheduleCommand(services, providers) {
  const config = services.workspace.getConfig();
  
  if (!config || !config.autoSync) {
    vscode.window.showErrorMessage('Auto-sync configuration not found');
    return;
  }
  
  await removeSchedule(services, config.autoSync, providers);
  
  // Refresh sync panel
  if (providers.syncPanel) {
    providers.syncPanel.refresh();
  }
}

module.exports = { 
  openScheduleSettings, 
  manualSync,
  toggleAutoSyncCommand,
  toggleAutoCommitCommand,
  changeConflictStrategyCommand,
  addScheduleCommand,
  editScheduleCommand,
  removeScheduleCommand
};
