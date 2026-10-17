# File Tools Settings - Feature Guide

## Overview

Configure formatting and comparison options directly from the Notas sidebar! Control how your files are formatted and compared without touching config files.

## What's Available

### 🎨 Format Settings

#### 📏 Indent Type
Choose between **Spaces** or **Tabs** for indentation.
- **Spaces**: Uses spaces for indentation (default)
- **Tabs**: Uses tab characters for indentation

#### 🔢 Indent Size
Set the number of spaces per indentation level.
- **2 spaces**: Compact, common in JavaScript/TypeScript
- **4 spaces**: Traditional, common in Python/Java
- **8 spaces**: Rare, but supported

#### 📐 Line Width
Maximum characters per line before wrapping.
- Default: **120 characters**
- Range: 40-500 characters
- Common values: 80, 100, 120

#### 🔤 Quotes Style
Choose your preferred quote style.
- **Single quotes** ('): Default, common in JavaScript
- **Double quotes** ("): Common in JSON, some languages

#### 🔹 Semicolons
Add or omit semicolons at end of statements.
- **Yes**: Always add semicolons
- **No**: Omit semicolons (default)

### 📊 Compare Settings

#### ⚪ Ignore Whitespace
When comparing files, ignore whitespace differences.
- **Yes**: Spaces, tabs, and newlines don't count as differences
- **No**: All whitespace is significant (default)

#### 🔠 Ignore Case
When comparing files, ignore case differences.
- **Yes**: "Hello" and "hello" are treated as same
- **No**: Case matters (default)

## How to Use

### Method 1: Quick Actions Menu

1. Click the Notas icon in Activity Bar
2. Expand **Configuration** section
3. Click **"🎨 Configure File Tools"** button
4. Select the setting you want to change
5. Choose new value from the menu

### Method 2: Expandable View

1. Click the Notas icon
2. Expand **Configuration**
3. Expand **🎨 File Tools**
4. Expand **✨ Format Settings** or **📊 Compare Settings**
5. See all current values at a glance

## Visual Example

```
NOTAS: CONFIGURATION
├── 📦 Repository: my-project
├── 📁 Workspace: .../workspace
├── 🔄 Auto-Sync: ✓ Enabled
├── 🎨 File Tools
│   ├── ✨ Format Settings
│   │   ├── 📏 Indent Type: Spaces
│   │   ├── 🔢 Indent Size: 2 spaces
│   │   ├── 📐 Line Width: 120 characters
│   │   ├── 🔤 Quotes: Single (')
│   │   └── 🔹 Semicolons: No
│   └── 📊 Compare Settings
│       ├── ⚪ Ignore Whitespace: No
│       └── 🔠 Ignore Case: No
├── ⚙️ Configure Auto-Sync
├── 🎨 Configure File Tools
└── 🔄 Sync Now
```

## Settings Effects

### Format Settings Apply To:
- ✅ **Format/Pretty Print** command
- ✅ Batch formatting operations
- ✅ All formatters (JS, TS, JSON, HTML, CSS, etc.)

### Compare Settings Apply To:
- ✅ **Compare Two Files** command
- ✅ Side-by-side diff view
- ✅ File comparison operations

## Configuration Storage

All settings are stored in `.notas/config.json`:

```json
{
  "version": "1.0.0",
  "gitRepository": "...",
  "fileTools": {
    "format": {
      "indentSize": 2,
      "indentType": "spaces",
      "singleQuote": true,
      "semi": false,
      "printWidth": 120
    },
    "compare": {
      "ignoreWhitespace": false,
      "ignoreCase": false
    }
  }
}
```

## Common Configurations

### JavaScript/TypeScript Standard
```
Indent: 2 spaces
Line Width: 120
Quotes: Single
Semicolons: No
```

### Python Style
```
Indent: 4 spaces
Line Width: 88
Quotes: Double
Semicolons: N/A
```

### Google Style
```
Indent: 2 spaces
Line Width: 80
Quotes: Single
Semicolons: Yes
```

### Airbnb Style
```
Indent: 2 spaces
Line Width: 100
Quotes: Single
Semicolons: Yes
```

## Tips

1. **Team Consistency**: Configure once, commit `.notas/config.json`, share with team
2. **Per-Workspace**: Each workspace can have different settings
3. **Live Preview**: Settings apply immediately to next format operation
4. **Undo Support**: Format operations support Ctrl+Z/Cmd+Z
5. **Batch Operations**: Settings apply to all files in batch format

## Troubleshooting

### Settings not applying?
- Check that workspace is initialized
- Make sure `.notas/config.json` exists
- Try refreshing the configuration view

### Want different settings per language?
- Currently settings apply to all languages
- Consider using VS Code's built-in formatter settings for language-specific control

### Settings reset after reload?
- Settings are saved to `.notas/config.json`
- Make sure file is not read-only
- Check file permissions

## Future Enhancements

Potential additions:
- Per-language format settings
- Import/export style presets
- Visual settings editor
- Format on save option
- Minify settings (compression level, etc.)

---

**Note**: This feature is part of Notas v0.3.0+
