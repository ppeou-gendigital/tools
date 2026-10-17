const vscode = require('vscode');

/**
 * Language options for user selection
 */
const FORMATTABLE_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'HTML', value: 'html' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Skip - Plain Text', value: 'skip' }
];

const MINIFIABLE_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Skip - Plain Text', value: 'skip' }
];

const MINIFIABLE_LANGUAGE_VALUES = ['javascript', 'typescript', 'css', 'html', 'json', 'xml', 'yaml', 'markdown'];

/**
 * Prompt user to select a language type
 * @param {string} action - Action being performed ('format' or 'minify')
 * @returns {Promise<string|null>} Selected language or null if skipped/cancelled
 */
async function promptForLanguage(action = 'format') {
  const languages = action === 'minify' ? MINIFIABLE_LANGUAGES : FORMATTABLE_LANGUAGES;
  
  const selectedType = await vscode.window.showQuickPick(languages, {
    placeHolder: `Could not detect file type. Please select the language to ${action}:`,
    ignoreFocusOut: true
  });
  
  if (!selectedType || selectedType.value === 'skip') {
    if (selectedType?.value === 'skip') {
      vscode.window.showInformationMessage(`Skipped ${action}ing plain text`);
    }
    return null;
  }
  
  return selectedType.value;
}

/**
 * Check if a language is minifiable
 * @param {string} language
 * @returns {boolean}
 */
function isMinifiable(language) {
  return MINIFIABLE_LANGUAGE_VALUES.includes(language);
}

module.exports = {
  FORMATTABLE_LANGUAGES,
  MINIFIABLE_LANGUAGES,
  MINIFIABLE_LANGUAGE_VALUES,
  promptForLanguage,
  isMinifiable
};
