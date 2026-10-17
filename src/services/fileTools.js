const prettier = require('prettier');
const { minify: terserMinify } = require('terser');
const postcss = require('postcss');
const cssnano = require('cssnano');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

/**
 * File formatting, minification, and URL fetching
 */
class FileToolsService {
  /**
   * Format code using Prettier
   * @param {string} code - Code to format
   * @param {string} language - Language/parser name
   * @param {Object} options - Format options (optional)
   * @returns {Promise<string>}
   */
  async formatCode(code, language, options = {}) {
    const parser = this.getParser(language);
    
    if (!parser) {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    // Default options
    const defaultOptions = {
      parser,
      printWidth: 120,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true
    };
    
    // Merge with custom options
    const prettierOptions = { ...defaultOptions, ...options };
    
    // For JSON with onePropertyPerLine, use a very small printWidth to force line breaks
    if (parser === 'json' && options.onePropertyPerLine) {
      prettierOptions.printWidth = 1;
    }
    
    try {
      return await prettier.format(code, prettierOptions);
    } catch (error) {
      throw new Error(`Format failed: ${error.message}`);
    }
  }
  
  /**
   * Minify code
   * @param {string} code - Code to minify
   * @param {string} language - Language name
   * @returns {Promise<string>}
   */
  async minifyCode(code, language) {
    try {
      switch (language) {
        case 'javascript':
        case 'typescript': {
          const result = await terserMinify(code, {
            compress: {
              dead_code: true,
              drop_console: false,
              drop_debugger: true,
              pure_funcs: []
            },
            mangle: true,
            format: {
              comments: false
            }
          });
          return result.code;
        }
        
        case 'css': {
          const cssResult = await postcss([cssnano]).process(code, {
            from: undefined
          });
          return cssResult.css;
        }
        
        case 'json':
          // Minify JSON - remove all whitespace
          return JSON.stringify(JSON.parse(code));
        
        case 'html': {
          // Minify HTML - remove whitespace between tags
          return code
            .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
            .replace(/>\s+</g, '><') // Remove whitespace between tags
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();
        }
        
        case 'xml': {
          // Minify XML - similar to HTML
          return code
            .replace(/<!--[\s\S]*?-->/g, '') // Remove XML comments
            .replace(/>\s+</g, '><') // Remove whitespace between tags
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();
        }
        
        case 'yaml': {
          // Minify YAML - remove comments and extra whitespace
          return code
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .join('\n');
        }
        
        case 'markdown': {
          // Minify Markdown - remove extra blank lines
          return code
            .replace(/\n\n\n+/g, '\n\n') // Remove excessive blank lines
            .trim();
        }
        
        default:
          // Generic minification - remove comments and collapse whitespace
          return code
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // C-style comments
            .replace(/<!--[\s\S]*?-->/g, '') // HTML comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .trim();
      }
    } catch (error) {
      throw new Error(`Minify failed: ${error.message}`);
    }
  }
  
  /**
   * Fetch content from URL
   * @param {string} url - URL to fetch
   * @returns {Promise<string>}
   */
  async fetchURL(url) {
    try {
      const response = await axios.get(url, {
        timeout: 30000,
        maxContentLength: 5 * 1024 * 1024, // 5MB limit
        responseType: 'text'
      });
      
      const content = typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data, null, 2);
      
      return {
        content,
        contentType: response.headers['content-type'] || null
      };
    } catch (error) {
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
  }
  
  /**
   * Download URL content to temp file
   * @param {string} url - URL to download
   * @param {string} filename - Filename for temp file
   * @returns {Promise<string>} - Path to temp file
   */
  async downloadURLToTemp(url, filename) {
    const { content } = await this.fetchURL(url);
    
    const tempDir = path.join(os.tmpdir(), 'notas');
    await fs.mkdir(tempDir, { recursive: true });
    
    const tempFile = path.join(tempDir, filename);
    await fs.writeFile(tempFile, content, 'utf8');
    
    return tempFile;
  }
  
  /**
   * Extract file extension from URL
   * @param {string} url - URL to parse
   * @returns {string|null} - Extension (with dot) or null
   */
  getExtensionFromURL(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
      return match ? `.${match[1]}` : null;
    } catch {
      return null;
    }
  }
  
  /**
   * Map Content-Type to file extension
   * @param {string} contentType - HTTP Content-Type header
   * @returns {string|null} - Extension (with dot) or null
   */
  getExtensionFromContentType(contentType) {
    if (!contentType) return null;
    
    // Remove charset and other parameters
    const mimeType = contentType.split(';')[0].trim().toLowerCase();
    
    const mimeMap = {
      'text/css': '.css',
      'text/javascript': '.js',
      'application/javascript': '.js',
      'application/x-javascript': '.js',
      'text/html': '.html',
      'application/json': '.json',
      'text/xml': '.xml',
      'application/xml': '.xml',
      'text/plain': '.txt',
      'text/markdown': '.md',
      'text/x-yaml': '.yaml',
      'application/x-yaml': '.yaml',
      'text/x-python': '.py',
      'text/x-java': '.java',
      'text/x-c': '.c',
      'text/x-c++': '.cpp'
    };
    
    return mimeMap[mimeType] || null;
  }
  
  /**
   * Download URL to temp with smart extension detection
   * @param {string} url - URL to download
   * @param {string} baseFilename - Base filename without extension (e.g., 'url1')
   * @returns {Promise<{path: string, extension: string}>}
   */
  async downloadURLToTempSmart(url, baseFilename) {
    const { content, contentType } = await this.fetchURL(url);
    
    // Try to get extension from URL first
    let extension = this.getExtensionFromURL(url);
    
    // Fallback to Content-Type
    if (!extension) {
      extension = this.getExtensionFromContentType(contentType);
    }
    
    // Default to .txt if still unknown
    if (!extension) {
      extension = '.txt';
    }
    
    const tempDir = path.join(os.tmpdir(), 'notas');
    await fs.mkdir(tempDir, { recursive: true });
    
    const filename = `${baseFilename}${extension}`;
    const tempFile = path.join(tempDir, filename);
    await fs.writeFile(tempFile, content, 'utf8');
    
    return {
      path: tempFile,
      extension: extension
    };
  }
  
  /**
   * Get Prettier parser for language
   * @param {string} language - Language name
   * @returns {string|null}
   */
  getParser(language) {
    const parsers = {
      'javascript': 'babel',
      'typescript': 'typescript',
      'json': 'json',
      'html': 'html',
      'xml': 'html', // Use HTML parser for XML
      'css': 'css',
      'scss': 'scss',
      'markdown': 'markdown',
      'yaml': 'yaml'
    };
    
    return parsers[language] || null;
  }
  
  /**
   * Detect language from filename
   * @param {string} filename - Filename
   * @returns {string}
   */
  detectLanguage(filename) {
    const ext = path.extname(filename).toLowerCase();
    
    const languages = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.json': 'json',
      '.html': 'html',
      '.htm': 'html',
      '.xml': 'xml',
      '.svg': 'xml',
      '.css': 'css',
      '.scss': 'scss',
      '.less': 'css',
      '.md': 'markdown',
      '.markdown': 'markdown',
      '.yml': 'yaml',
      '.yaml': 'yaml'
    };
    
    return languages[ext] || 'text';
  }
}

module.exports = FileToolsService;
