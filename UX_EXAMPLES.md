# Multi-Select UX Examples

## Before vs After

### Compare Files

#### BEFORE (Command-based):
```
1. Right-click file1.js → "Notas: Compare Two Files"
   → Shows: "Select one more file to compare"
2. Right-click file2.js → "Notas: Compare Two Files"
   → Opens diff
```
**Issues**: Hard to track which file was selected first, confusing multi-step process

#### AFTER (Explorer multi-select):
```
In Explorer:
├── src/
│   ├── app.js          ← Ctrl+Click (selected)
│   ├── config.js       ← Ctrl+Click (selected)
│   └── utils.js

Right-click → "Notas: Compare Two Files"
→ Opens diff immediately!
```

**Or with 3+ files:**
```
Selected 4 files → Right-click → "Notas: Compare Two Files"
→ Quick pick appears:
   > Select first file to compare
     📄 app.js (src/)
     📄 config.js (src/)
     📄 utils.js (src/)
     📄 index.js (src/)
   
   > Select second file to compare with app.js
     📄 config.js (src/)
     📄 utils.js (src/)
     📄 index.js (src/)
→ Opens diff!
```

---

### Format Files

#### BEFORE (Editor-only):
```
1. Open file1.js
2. Right-click in editor → "Notas: Format/Pretty Print"
3. Wait for format
4. Open file2.js
5. Right-click in editor → "Notas: Format/Pretty Print"
6. Repeat for each file...
```
**Issues**: Must open each file individually, time-consuming for multiple files

#### AFTER (Batch processing):
```
In Explorer:
├── src/
│   ├── app.js          ← Ctrl+Click
│   ├── config.js       ← Ctrl+Click
│   ├── utils.js        ← Ctrl+Click
│   ├── index.js        ← Ctrl+Click
│   └── styles.css      ← Ctrl+Click

Right-click → "Notas: Format/Pretty Print"

Progress notification appears:
┌─────────────────────────────────────┐
│ Formatting 5 file(s)...             │
│ ████████░░░░░░░░░░ 40%             │
│ 2/5: config.js                      │
│                              [Cancel]│
└─────────────────────────────────────┘

Result notification:
✓ Formatted 5 file(s) successfully
```

---

### Minify Files

#### BEFORE:
```
Open each JS/CSS file individually and minify
```

#### AFTER:
```
In Explorer:
├── dist/
│   ├── app.js          ← Ctrl+Click
│   ├── vendor.js       ← Ctrl+Click
│   └── styles.css      ← Ctrl+Click

Right-click → "Notas: Minify File"

Progress notification:
┌─────────────────────────────────────┐
│ Minifying 3 file(s)...              │
│ ████████████████████ 100%           │
│ 3/3: styles.css                     │
└─────────────────────────────────────┘

Result notification:
✓ Minified 3 file(s): Saved 67.3% (145280 → 47523 bytes)
```

---

## File Type Filtering

Context menu entries now only appear for supported file types:

### Format/Pretty Print
Shows for:
```
✓ app.js
✓ config.json
✓ styles.css
✓ README.md
✓ config.yml
✗ image.png      (not shown)
✗ binary.exe     (not shown)
```

### Minify File
Shows for:
```
✓ app.js
✓ bundle.js
✓ styles.css
✗ config.json    (not shown - no benefit)
✗ README.md      (not shown - not supported)
```

---

## Error Handling

When some files fail:

```
Progress: Formatting 10 files...
- file1.js ✓
- file2.js ✓
- invalid.js ✗ (syntax error)
- file4.js ✓
...

Result notification:
⚠ Formatted 9 file(s), 1 failed     [Show Errors]

Click "Show Errors":
invalid.js: Format failed: Unexpected token
```

---

## Keyboard Users

All features still work from Command Palette:
```
Cmd+Shift+P → "Notas: Compare Two Files"
→ File picker dialog (select 2 files)

Cmd+Shift+P → "Notas: Format/Pretty Print"
→ Formats active editor
```

---

## Benefits Summary

✅ **Faster**: Multi-select → one click → done  
✅ **Visual**: See which files are selected  
✅ **Safe**: Progress indicator, cancellable, undo support  
✅ **Smart**: Only shows for appropriate file types  
✅ **Flexible**: Works from explorer, editor, or command palette  
✅ **Informative**: Detailed progress and error reporting
