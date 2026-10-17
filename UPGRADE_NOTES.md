# Multi-Select Enhancement - Upgrade Notes

## What's New

Enhanced the file comparison, format, and minify features to support multi-select from VS Code's Explorer view.

## Changes Made

### 1. Explorer Context Menu Integration

Added explorer context menu support for all three features:
- **Compare Files**: Now appears when right-clicking files in explorer
- **Format/Pretty Print**: Now appears for formattable files (JS, TS, JSON, HTML, CSS, SCSS, Markdown, YAML)
- **Minify File**: Now appears for minifiable files (JS, TS, CSS, SCSS)

### 2. Multi-Select Support

Users can now select multiple files using Ctrl/Cmd+Click:

**Compare Files:**
- Select exactly 2 files → Opens diff immediately
- Select 3+ files → Quick pick to choose 2
- Select 1 file → Falls back to sequential selection

**Format/Pretty Print:**
- Select 1+ files → Formats all with progress indicator
- Cancellable operation
- Error summary if any files fail

**Minify File:**
- Select 1+ files → Minifies all with progress indicator
- Shows total size savings
- Cancellable operation

### 3. File Type Filtering

Commands now only appear for appropriate file types:

**Format**: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.html`, `.css`, `.scss`, `.less`, `.md`, `.yml`, `.yaml`

**Minify**: `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.scss`

### 4. Enhanced User Feedback

- Progress notifications for batch operations
- Cancellable operations
- Success/failure summaries
- Detailed error messages on demand
- Size savings statistics for minify

## Files Modified

1. **package.json** - Added explorer/context menu entries with file type filtering
2. **src/commands/compare.js** - Added multi-select support
3. **src/commands/format.js** - Complete rewrite with batch processing
4. **extension.js** - Updated command registrations to pass allUris parameter
5. **README.md** - Updated documentation with new usage instructions

## Testing Checklist

- [ ] Compare 2 files from explorer (multi-select)
- [ ] Compare 3+ files from explorer (shows quick pick)
- [ ] Compare 1 file from explorer (sequential mode)
- [ ] Format single file from explorer
- [ ] Format multiple files from explorer
- [ ] Minify single file from explorer
- [ ] Minify multiple files from explorer
- [ ] Format from editor context menu (existing behavior)
- [ ] Minify from editor context menu (existing behavior)
- [ ] Verify context menu only appears for appropriate file types
- [ ] Cancel operation mid-batch
- [ ] Check error handling for invalid files

## Building & Installing

```bash
npm run package
code --install-extension notas-0.1.0.vsix
```

Or use the combined command:
```bash
npm run build-install
```

## Version Bump

Consider bumping version to `0.2.0` in package.json for this enhancement release.
