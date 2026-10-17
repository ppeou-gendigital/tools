const path = require('path');
const fs = require('fs').promises;

/**
 * Workspace configuration management
 */
class WorkspaceService {
  constructor(context) {
    this.context = context;
    this.config = null;
    this.rootPath = null;
  }
  
  /**
   * Check if .notas/config.json exists in this folder or parent
   * @param {string} rootPath - Workspace root path
   * @returns {Promise<boolean>}
   */
  async hasConfig(rootPath) {
    const configPath = path.join(rootPath, '.notas', 'config.json');
    try {
      await fs.access(configPath);
      return true;
    } catch {
      // Check parent folder
      const parentPath = path.dirname(rootPath);
      if (parentPath && parentPath !== rootPath) {
        const parentConfigPath = path.join(parentPath, '.notas', 'config.json');
        try {
          await fs.access(parentConfigPath);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }
  
  /**
   * Find workspace root (folder containing .notas/config.json)
   * Checks current folder and parent folder
   * @param {string} startPath - Starting path
   * @returns {Promise<string|null>}
   */
  async findWorkspaceRoot(startPath) {
    // Check current folder
    const configPath = path.join(startPath, '.notas', 'config.json');
    try {
      await fs.access(configPath);
      return startPath;
    } catch {
      // Check parent folder
      const parentPath = path.dirname(startPath);
      if (parentPath && parentPath !== startPath) {
        const parentConfigPath = path.join(parentPath, '.notas', 'config.json');
        try {
          await fs.access(parentConfigPath);
          return parentPath;
        } catch {
          return null;
        }
      }
      return null;
    }
  }
  
  /**
   * Load configuration from .notas/config.json
   * @param {string} rootPath - Workspace root path
   * @returns {Promise<Object>}
   */
  async loadConfig(rootPath) {
    this.rootPath = rootPath;
    const configPath = path.join(rootPath, '.notas', 'config.json');
    
    try {
      const content = await fs.readFile(configPath, 'utf8');
      this.config = JSON.parse(content);
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
  }
  
  /**
   * Create new workspace configuration
   * @param {string} rootPath - Workspace root path
   * @param {string} gitRepoUrl - Git repository URL
   * @returns {Promise<Object>}
   */
  async createConfig(rootPath, gitRepoUrl) {
    this.rootPath = rootPath;
    
    const notasDir = path.join(rootPath, '.notas');
    await fs.mkdir(notasDir, { recursive: true });
    
    this.config = {
      version: '1.0.0',
      gitRepository: gitRepoUrl,
      workspaceRoot: rootPath,
      createdAt: new Date().toISOString(),
      autoSync: {
        enabled: true,
        schedules: [
          { time: '18:00', enabled: true }
        ],
        conflictStrategy: 'ours',
        autoCommit: true,
        commitMessage: 'Auto-sync at {time}'
      },
      fileTools: {
        format: {
          indentSize: 2,
          indentType: 'spaces',
          singleQuote: true,
          semi: false,
          printWidth: 120,
          trailingComma: 'es5',
          bracketSpacing: true,
          arrowParens: 'avoid',
          endOfLine: 'lf',
          wrapAttributes: 'auto',
          onePropertyPerLine: false,
          prettyPrint: {
            sameLine: false,
            selfCloseTags: true,
            preserveNewlines: true
          },
          minify: {
            removeComments: true,
            removeWhitespace: true,
            shortenNames: false,
            removeConsole: false,
            removeDebugger: false,
            keepFunctionNames: true,
            keepClassNames: true,
            compress: false,
            deadCodeElimination: false
          }
        },
        compare: {
          ignoreWhitespace: false,
          ignoreCase: false,
          ignoreEmptyLines: false,
          ignoreLineEndings: false,
          ignoreTrailingWhitespace: false,
          showSideBySide: true,
          characterDiff: false,
          contextLines: 3
        }
      }
    };
    
    await this.saveConfig();
    
    return this.config;
  }
  
  /**
   * Save current configuration to disk
   * @returns {Promise<void>}
   */
  async saveConfig() {
    if (!this.config || !this.rootPath) {
      throw new Error('No configuration to save');
    }
    
    const configPath = path.join(this.rootPath, '.notas', 'config.json');
    await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
  }
  
  /**
   * Update configuration
   * @param {Object} updates - Configuration updates
   * @returns {Promise<void>}
   */
  async updateConfig(updates) {
    if (!this.config) {
      throw new Error('No configuration loaded');
    }
    
    this.config = { ...this.config, ...updates };
    await this.saveConfig();
  }
  
  /**
   * Get current configuration
   * @returns {Object|null}
   */
  getConfig() {
    return this.config;
  }
  
  /**
   * Get workspace root path
   * @returns {string|null}
   */
  getRootPath() {
    return this.rootPath;
  }
}

module.exports = WorkspaceService;
