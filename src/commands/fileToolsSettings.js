const vscode = require('vscode');

/**
 * Open file tools settings menu
 * @param {Object} services
 * @param {Object} providers
 */
async function openFileToolsSettings(services, providers) {
  const config = services.workspace.getConfig();
  
  if (!config) {
    vscode.window.showErrorMessage('No workspace initialized');
    return;
  }
  
  const fileTools = config.fileTools || {
    format: {},
    compare: {}
  };
  
  const options = [
    '✨ Format: Indent Type',
    '🔢 Format: Indent Size',
    '📐 Format: Line Width',
    '🔤 Format: Quotes Style',
    '🔹 Format: Semicolons',
    '⚪ Compare: Ignore Whitespace',
    '🔠 Compare: Ignore Case'
  ];
  
  const choice = await vscode.window.showQuickPick(options, {
    placeHolder: 'Select setting to change'
  });
  
  if (!choice) return;
  
  if (choice.includes('Indent Type')) {
    await changeIndentType(services, fileTools, providers);
  } else if (choice.includes('Indent Size')) {
    await changeIndentSize(services, fileTools, providers);
  } else if (choice.includes('Line Width')) {
    await changeLineWidth(services, fileTools, providers);
  } else if (choice.includes('Quotes Style')) {
    await changeQuotesStyle(services, fileTools, providers);
  } else if (choice.includes('Semicolons')) {
    await toggleSemicolons(services, fileTools, providers);
  } else if (choice.includes('Ignore Whitespace')) {
    await toggleIgnoreWhitespace(services, fileTools, providers);
  } else if (choice.includes('Ignore Case')) {
    await toggleIgnoreCase(services, fileTools, providers);
  }
}

/**
 * Change indent type (spaces/tabs)
 */
async function changeIndentType(services, fileTools, providers) {
  const choice = await vscode.window.showQuickPick([
    { label: 'Spaces', value: 'spaces' },
    { label: 'Tabs', value: 'tabs' }
  ], {
    placeHolder: `Current: ${fileTools.format?.indentType || 'spaces'}`
  });
  
  if (!choice) return;
  
  if (!fileTools.format) fileTools.format = {};
  fileTools.format.indentType = choice.value;
  fileTools.format.useTabs = choice.value === 'tabs';
  
  await saveFileToolsConfig(services, fileTools, providers);
  vscode.window.showInformationMessage(`Indent type set to: ${choice.label}`);
}

/**
 * Change indent size
 */
async function changeIndentSize(services, fileTools, providers) {
  const current = fileTools.format?.indentSize || 2;
  
  const size = await vscode.window.showQuickPick([
    { label: '2 spaces', value: 2 },
    { label: '4 spaces', value: 4 },
    { label: '8 spaces', value: 8 }
  ], {
    placeHolder: `Current: ${current} spaces`
  });
  
  if (!size) return;
  
  if (!fileTools.format) fileTools.format = {};
  fileTools.format.indentSize = size.value;
  fileTools.format.tabWidth = size.value;
  
  await saveFileToolsConfig(services, fileTools, providers);
  vscode.window.showInformationMessage(`Indent size set to: ${size.label}`);
}

/**
 * Change line width
 */
async function changeLineWidth(services, fileTools, providers) {
  const current = fileTools.format?.printWidth || 120;
  
  const width = await vscode.window.showInputBox({
    prompt: 'Enter maximum line width',
    value: current.toString(),
    placeHolder: '80, 100, 120, etc.',
    validateInput: (value) => {
      const num = parseInt(value);
      if (isNaN(num) || num < 40 || num > 500) {
        return 'Please enter a number between 40 and 500';
      }
      return null;
    }
  });
  
  if (!width) return;
  
  if (!fileTools.format) fileTools.format = {};
  fileTools.format.printWidth = parseInt(width);
  
  await saveFileToolsConfig(services, fileTools, providers);
  vscode.window.showInformationMessage(`Line width set to: ${width} characters`);
}

/**
 * Change quotes style
 */
async function changeQuotesStyle(services, fileTools, providers) {
  const current = fileTools.format?.singleQuote;
  
  const choice = await vscode.window.showQuickPick([
    { label: 'Single quotes (\')' , value: true },
    { label: 'Double quotes (")', value: false }
  ], {
    placeHolder: `Current: ${current ? 'single' : 'double'}`
  });
  
  if (!choice) return;
  
  if (!fileTools.format) fileTools.format = {};
  fileTools.format.singleQuote = choice.value;
  
  await saveFileToolsConfig(services, fileTools, providers);
  vscode.window.showInformationMessage(`Quotes style set to: ${choice.label}`);
}

/**
 * Toggle semicolons
 */
async function toggleSemicolons(services, fileTools, providers) {
  if (!fileTools.format) fileTools.format = {};
  fileTools.format.semi = !fileTools.format.semi;
  
  await saveFileToolsConfig(services, fileTools, providers);
  vscode.window.showInformationMessage(
    `Semicolons: ${fileTools.format.semi ? 'Enabled' : 'Disabled'}`
  );
}

/**
 * Toggle ignore whitespace in compare
 */
async function toggleIgnoreWhitespace(services, fileTools, providers) {
  if (!fileTools.compare) fileTools.compare = {};
  fileTools.compare.ignoreWhitespace = !fileTools.compare.ignoreWhitespace;
  
  await saveFileToolsConfig(services, fileTools, providers);
  vscode.window.showInformationMessage(
    `Ignore whitespace: ${fileTools.compare.ignoreWhitespace ? 'Yes' : 'No'}`
  );
}

/**
 * Toggle ignore case in compare
 */
async function toggleIgnoreCase(services, fileTools, providers) {
  if (!fileTools.compare) fileTools.compare = {};
  fileTools.compare.ignoreCase = !fileTools.compare.ignoreCase;
  
  await saveFileToolsConfig(services, fileTools, providers);
  vscode.window.showInformationMessage(
    `Ignore case: ${fileTools.compare.ignoreCase ? 'Yes' : 'No'}`
  );
}

/**
 * Save file tools configuration
 */
async function saveFileToolsConfig(services, fileTools, providers) {
  const config = services.workspace.getConfig();
  config.fileTools = fileTools;
  
  await services.workspace.saveConfig();
  
  // Refresh all config views
  if (providers.config) {
    providers.config.refresh();
  }
  if (providers.formatSettings) {
    providers.formatSettings.refresh();
  }
  if (providers.compareSettings) {
    providers.compareSettings.refresh();
  }
}

module.exports = { openFileToolsSettings };
