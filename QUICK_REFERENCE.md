# Quick Reference Guide - Multi-Select Features

## 🎯 How to Use Multi-Select

### Step 1: Select Files
In the VS Code Explorer, select files using:
- **Ctrl+Click** (Windows/Linux) or **Cmd+Click** (Mac) to select multiple files
- **Shift+Click** to select a range of files

### Step 2: Right-Click
Right-click on any of the selected files to open the context menu.

### Step 3: Choose Operation
Select one of the Notas commands:
- **Compare Two Files** (any file types)
- **Format/Pretty Print** (JS, TS, JSON, HTML, CSS, SCSS, Markdown, YAML)
- **Minify File** (JS, TS, CSS, SCSS)

---

## 📊 Compare Files

### Scenario 1: Compare Exactly 2 Files
```
Select: app.js + config.js
Right-click → Compare Two Files
→ Diff opens immediately ✓
```

### Scenario 2: Compare from 3+ Files
```
Select: app.js + config.js + utils.js + index.js
Right-click → Compare Two Files
→ Quick pick appears:
  1. Choose first file
  2. Choose second file
→ Diff opens ✓
```

### Scenario 3: Sequential Selection (Old Way Still Works)
```
1. Right-click app.js → Compare Two Files
2. Right-click config.js → Compare Two Files
→ Diff opens ✓
```

---

## 🎨 Format Files

### Single File
```
Select: app.js
Right-click → Format/Pretty Print
→ ✓ Formatted: app.js
```

### Multiple Files
```
Select: app.js + config.json + styles.css + README.md
Right-click → Format/Pretty Print
→ Progress bar appears
→ ✓ Formatted 4 file(s) successfully
```

### From Editor (Still Works)
```
Open file → Right-click in editor → Format/Pretty Print
→ ✓ Formatted: filename.js
```

---

## 📦 Minify Files

### Single File
```
Select: bundle.js
Right-click → Minify File
→ ✓ bundle.js: Saved 68.2% (45280 → 14523 bytes)
```

### Multiple Files
```
Select: app.js + vendor.js + styles.css
Right-click → Minify File
→ Progress bar appears
→ ✓ Minified 3 file(s): Saved 67.3% (145280 → 47523 bytes)
```

---

## ⚡ Tips & Tricks

### Tip 1: Filter Before Selection
Only select files you want to process. The commands will filter out unsupported file types automatically.

### Tip 2: Cancel Operations
Click the **Cancel** button in the progress notification if you need to stop a batch operation.

### Tip 3: Review Errors
If some files fail, click **Show Errors** to see detailed error messages.

### Tip 4: Undo Support
All operations support **Ctrl+Z** (Cmd+Z) because they use VS Code's built-in edit system.

### Tip 5: Command Palette
All features still work from Command Palette (Cmd+Shift+P) if you prefer keyboard shortcuts.

---

## 🔍 Supported File Types

### Format/Pretty Print
| Extension | Supported |
|-----------|-----------|
| .js, .jsx | ✅ |
| .ts, .tsx | ✅ |
| .json | ✅ |
| .html | ✅ |
| .css, .scss, .less | ✅ |
| .md | ✅ |
| .yml, .yaml | ✅ |
| Others | ❌ |

### Minify
| Extension | Supported |
|-----------|-----------|
| .js, .jsx | ✅ |
| .ts, .tsx | ✅ |
| .css, .scss | ✅ |
| Others | ❌ |

---

## 🐛 Troubleshooting

### Q: Context menu doesn't show Notas commands
**A:** Make sure you're right-clicking on a file (not a folder) and the file type is supported.

### Q: Selected multiple files but only one was processed
**A:** Make sure all files are still selected when you right-click. Files should be highlighted.

### Q: Operation failed for all files
**A:** Check the error message. Common issues:
- File has syntax errors (for format/minify)
- File is read-only
- File type not supported

### Q: Can I format/minify entire folders?
**A:** Not directly. Select all files in the folder (Ctrl+A in explorer), then right-click.

### Q: How do I compare files in different folders?
**A:** Use multi-select to select files from different folders, then right-click on either one.

---

## 📝 Keyboard Shortcuts

Currently, Notas commands don't have default keyboard shortcuts, but you can add them:

1. Open Keyboard Shortcuts: `Cmd+K Cmd+S` (Mac) or `Ctrl+K Ctrl+S` (Windows/Linux)
2. Search for "Notas"
3. Click the + icon to add your preferred shortcut

**Suggested shortcuts:**
- Compare Files: `Cmd+Shift+C`
- Format File: `Cmd+Shift+F`
- Minify File: `Cmd+Shift+M`

---

## 📚 More Information

- Full documentation: [README.md](./README.md)
- UX examples: [UX_EXAMPLES.md](./UX_EXAMPLES.md)
- Changelog: [CHANGELOG.md](./CHANGELOG.md)
