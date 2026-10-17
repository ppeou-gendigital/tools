const vscode = require('vscode');
const path = require('path');
const WorkspaceService = require('./src/services/workspace');
const GitService = require('./src/services/git');
const FileToolsService = require('./src/services/fileTools');
const SchedulerService = require('./src/services/scheduler');
const EncryptionService = require('./src/services/encryption');
const WorktreeProvider = require('./src/providers/worktreeProvider');
const ConfigWebviewProvider = require('./src/providers/configWebviewProvider');
const SyncPanelProvider = require('./src/providers/syncPanelProvider');
const CompareURLsPanelProvider = require('./src/providers/compareURLsPanelProvider');
const CommandsPanelProvider = require('./src/providers/commandsPanelProvider');
const DecryptedFileSystemProvider = require('./src/providers/decryptedFileSystemProvider');
const EncryptedFileDecorationProvider = require('./src/providers/encryptedFileDecorationProvider');

// Command handlers
const workspaceCommands = require('./src/commands/workspace');
const worktreeCommands = require('./src/commands/worktree');
const compareCommands = require('./src/commands/compare');
const formatCommands = require('./src/commands/format');
const schedulerCommands = require('./src/commands/scheduler');
const fileToolsSettingsCommands = require('./src/commands/fileToolsSettings');
const convertCommands = require('./src/commands/convert');
const urlCommands = require('./src/commands/url');
const encryptionCommands = require('./src/commands/encryption');
const runCommandFileCommands = require('./src/commands/runCommandFile');

let services = {};
let providers = {};

/**
 * Extension activation
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  console.log('Notas extension activated');
  
  // Initialize services
  services.workspace = new WorkspaceService(context);
  services.git = new GitService();
  services.fileTools = new FileToolsService();
  services.scheduler = new SchedulerService(services.workspace, services.git);
  services.encryption = new EncryptionService(context);
  
  // Initialize providers
  providers.worktree = new WorktreeProvider(services.workspace, services.git);
  providers.config = new ConfigWebviewProvider(services.workspace, services.scheduler);
  providers.syncPanel = new SyncPanelProvider(services.workspace, services.scheduler);
  providers.compareURLsPanel = new CompareURLsPanelProvider();
  providers.commandsPanel = new CommandsPanelProvider(services.workspace);
  providers.decryptedFileSystem = new DecryptedFileSystemProvider(services.encryption);
  providers.encryptedFileDecoration = new EncryptedFileDecorationProvider(services.encryption);
  
  // Check if workspace needs initialization
  await checkWorkspaceStatus();
  
  // Start scheduler if configured
  if (services.workspace.getConfig()?.autoSync?.enabled) {
    services.scheduler.start();
  }
  
  // Register all commands
  registerCommands(context);
  
  console.log('Notas ready!');
}

/**
 * Check workspace status and prompt for initialization
 */
async function checkWorkspaceStatus() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  
  if (!workspaceFolder) {
    return; // No folder open
  }
  
  const currentPath = workspaceFolder.uri.fsPath;
  
  // Check if this folder or parent has Notas config
  const workspaceRoot = await services.workspace.findWorkspaceRoot(currentPath);
  
  if (!workspaceRoot) {
    // No config found - prompt user to initialize
    const response = await vscode.window.showInformationMessage(
      'Initialize Notas workspace in this folder?',
      'Yes', 'Later'
    );
    
    if (response === 'Yes') {
      await workspaceCommands.initWorkspace(services, providers);
    }
  } else {
    // Load existing config (from current or parent folder)
    try {
      await services.workspace.loadConfig(workspaceRoot);
      if (providers.worktree) {
        providers.worktree.refresh();
      }
      if (providers.config) {
        providers.config.refresh();
      }
      if (providers.commandsPanel) {
        providers.commandsPanel.refresh();
      }
      
      // Show info message if opened a worktree subfolder
      if (workspaceRoot !== currentPath) {
        vscode.window.showInformationMessage(
          `Using Notas workspace from parent folder: ${path.basename(workspaceRoot)}`
        );
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to load workspace: ${error.message}`);
    }
  }
}

/**
 * Register all extension commands
 * @param {vscode.ExtensionContext} context
 */
function registerCommands(context) {
  const commands = [
    // Workspace commands
    vscode.commands.registerCommand('notas.initWorkspace', 
      () => workspaceCommands.initWorkspace(services, providers)),
    
    // Worktree commands
    vscode.commands.registerCommand('notas.syncWorktrees',
      () => worktreeCommands.syncWorktrees(services, providers)),
    
    vscode.commands.registerCommand('notas.refreshWorktrees',
      () => worktreeCommands.refreshWorktrees(providers)),
    
    vscode.commands.registerCommand('notas.openWorktree',
      (item) => worktreeCommands.openWorktree(item)),
    
    vscode.commands.registerCommand('notas.removeWorktree',
      (item) => worktreeCommands.removeWorktree(services, providers, item)),
    
    vscode.commands.registerCommand('notas.createBranch',
      () => worktreeCommands.createBranch(services, providers)),
    
    vscode.commands.registerCommand('notas.cleanupWorktrees',
      () => worktreeCommands.cleanupWorktrees(services, providers)),
    
    // Comparison commands
    vscode.commands.registerCommand('notas.compareFiles',
      (uri, allUris) => compareCommands.compareFiles(uri, allUris)),
    
    vscode.commands.registerCommand('notas.compareURLs',
      () => compareCommands.compareURLs(services.fileTools)),
    
    vscode.commands.registerCommand('notas.compareURLsFromSelection',
      () => compareCommands.compareURLsFromSelection(services.fileTools)),
    
    vscode.commands.registerCommand('notas.compareURLsWithArgs',
      (urls) => compareCommands.compareURLs(services.fileTools, urls)),
    
    // File tools commands
    vscode.commands.registerCommand('notas.formatFile',
      (uri, allUris) => formatCommands.formatFile(uri, allUris, services.fileTools, services.workspace)),
    
    vscode.commands.registerCommand('notas.minifyFile',
      (uri, allUris) => formatCommands.minifyFile(uri, allUris, services.fileTools)),
    
    // Scheduler commands
    vscode.commands.registerCommand('notas.openScheduleSettings',
      () => schedulerCommands.openScheduleSettings(services, providers)),
    
    vscode.commands.registerCommand('notas.toggleAutoSync',
      () => schedulerCommands.toggleAutoSyncCommand(services, providers)),
    
    vscode.commands.registerCommand('notas.toggleAutoCommit',
      () => schedulerCommands.toggleAutoCommitCommand(services, providers)),
    
    vscode.commands.registerCommand('notas.changeConflictStrategy',
      () => schedulerCommands.changeConflictStrategyCommand(services, providers)),
    
    vscode.commands.registerCommand('notas.addSchedule',
      () => schedulerCommands.addScheduleCommand(services, providers)),
    
    vscode.commands.registerCommand('notas.removeSchedule',
      () => schedulerCommands.removeScheduleCommand(services, providers)),
    
    vscode.commands.registerCommand('notas.editSchedule',
      (index) => schedulerCommands.editScheduleCommand(services, providers, index)),
    
    vscode.commands.registerCommand('notas.manualSync',
      () => schedulerCommands.manualSync(services, providers)),
    
    vscode.commands.registerCommand('notas.syncNow',
      () => schedulerCommands.manualSync(services, providers)),
    
    // File Tools Settings commands
    vscode.commands.registerCommand('notas.openFileToolsSettings',
      () => fileToolsSettingsCommands.openFileToolsSettings(services, providers)),
    
    // Conversion commands
    vscode.commands.registerCommand('notas.jsToJson',
      () => convertCommands.jsToJson()),
    
    vscode.commands.registerCommand('notas.jsonToJs',
      () => convertCommands.jsonToJs()),
    
    // URL commands
    vscode.commands.registerCommand('notas.openFromUrl',
      (uri) => urlCommands.openFromUrl(uri)),
    
    // Encryption commands
    vscode.commands.registerCommand('notas.lockFile',
      (uri) => encryptionCommands.lockFile(services, providers, uri)),
    
    vscode.commands.registerCommand('notas.unlockFile',
      (uri) => encryptionCommands.unlockFile(services, providers, uri)),

    vscode.commands.registerCommand('notas.runCommandFile',
      (uri, allUris) => runCommandFileCommands.runCommandFile(uri, allUris)),

    vscode.commands.registerCommand('notas.refreshCommands',
      () => providers.commandsPanel?.refresh()),

    vscode.commands.registerCommand('notas.openCommandsFile',
      () => providers.commandsPanel?.openCommandsFile()),

    vscode.commands.registerCommand('notas.openCommandsPathSetting', () =>
      vscode.commands.executeCommand('workbench.action.openSettings', 'notas.commands.file'))
  ];
  
  context.subscriptions.push(...commands);
  
  // Register providers
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('notas.worktrees', providers.worktree),
    vscode.window.registerWebviewViewProvider('notas.sync', providers.syncPanel),
    vscode.window.registerWebviewViewProvider('notas.compareURLs', providers.compareURLsPanel),
    vscode.window.registerWebviewViewProvider('notas.commands', providers.commandsPanel),
    vscode.workspace.registerFileSystemProvider('decrypted', providers.decryptedFileSystem, { 
      isCaseSensitive: true 
    }),
    vscode.window.registerFileDecorationProvider(providers.encryptedFileDecoration),
    new vscode.Disposable(() => providers.commandsPanel?.dispose())
  );
}

/**
 * Extension deactivation
 */
function deactivate() {
  // Stop scheduler
  if (services.scheduler) {
    services.scheduler.stop();
  }
  
  console.log('Notas deactivated');
}

module.exports = { activate, deactivate };
