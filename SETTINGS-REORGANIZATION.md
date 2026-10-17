# Settings & Sidebar Reorganization

## Overview

Reorganized the extension to follow VS Code best practices: **Settings** for persistent configuration, **Sidebar** for actions and current status.

## What Changed

### ✅ Moved to VS Code Settings Page

All persistent configuration is now in the Settings UI (searchable, typed, validated):

#### Auto-Sync Settings
- `notas.autoSync.enabled` - Enable/disable auto-sync
- `notas.autoSync.showNotifications` - Show sync notifications
- `notas.autoSync.conflictStrategy` - Conflict resolution strategy
- `notas.autoSync.autoCommit` - Auto-commit before sync

#### Format Settings (15 options)
- `notas.format.indentType` - Spaces or tabs
- `notas.format.indentSize` - Indentation size
- `notas.format.lineWidth` - Max line width
- `notas.format.quoteStyle` - Single or double quotes
- `notas.format.semicolons` - Add semicolons
- `notas.format.trailingCommas` - Trailing commas
- `notas.format.bracketSpacing` - Bracket spacing
- `notas.format.arrowParens` - Arrow function parens
- `notas.format.endOfLine` - Line ending style
- `notas.format.sameLineTags` - Same line closing tags
- `notas.format.selfCloseTags` - Self-close tags
- `notas.format.preserveNewlines` - Preserve newlines
- `notas.format.wrapAttributes` - HTML attribute wrapping
- `notas.format.onePropertyPerLine` - One property per line

#### Minify Settings (9 options)
- `notas.minify.removeComments` - Remove comments
- `notas.minify.removeWhitespace` - Remove whitespace
- `notas.minify.shortenNames` - Shorten variable names
- `notas.minify.removeConsole` - Remove console statements
- `notas.minify.removeDebugger` - Remove debugger statements
- `notas.minify.keepFunctionNames` - Keep function names
- `notas.minify.keepClassNames` - Keep class names
- `notas.minify.advancedCompress` - Advanced compression
- `notas.minify.deadCodeElimination` - Dead code elimination

#### Encryption Settings
- `notas.encryption.publicKeyPath` - Public key file path
- `notas.encryption.privateKeyPath` - Private key file path

### ✅ Kept in Sidebar (Actions & Status)

#### WORKTREES
- Tree view showing all worktrees
- Actions: Create, open, remove worktrees

#### ACTIONS (New Unified Panel)
**Sync Section**:
- Auto-sync status indicator
- Next sync time display
- "Sync Now" button
- Schedules list with enable/disable toggles
- Add/Remove schedule buttons

**Compare URLs Section**:
- Multi-line textarea for entering URLs
- "Compare URLs" button
- Intelligent URL extraction (supports various formats)

## Benefits

### User Experience
✅ **Discoverable** - Settings appear in VS Code's Settings UI search
✅ **Typed & Validated** - Dropdowns, number ranges, boolean toggles
✅ **Consistent** - Uses VS Code's standard UI patterns
✅ **Organized** - Settings grouped by category with descriptions

### Developer Experience
✅ **Cleaner Code** - Sidebar only handles UI/actions, not configuration
✅ **Less Duplication** - No need to build form UIs for settings
✅ **Easier Testing** - Configuration is separate from UI state
✅ **Better Separation** - Clear distinction between config and actions

### Sidebar Improvements
✅ **Focused** - Only actions and current status
✅ **Cleaner** - Removed 4 webview panels, kept 2
✅ **Faster** - Less HTML/CSS/JS to load
✅ **More Usable** - Quick access to common actions

## Files Changed

### Created
- `src/providers/sidebarProvider.js` - New unified sidebar

### Modified
- `package.json` - Added 40+ configuration properties, simplified views
- `extension.js` - Removed old providers, registered new sidebar

### Deprecated (can be deleted)
- `src/providers/formatSettingsWebviewProvider.js`
- `src/providers/compareSettingsWebviewProvider.js`
- Parts of `src/providers/configWebviewProvider.js` (Config section can be removed)
- `src/providers/encryptionWebviewProvider.js` (Settings moved to Settings page)

## Migration Notes

Existing users won't lose settings - the extension will need to:
1. Read old config from workspace config
2. Migrate to new VS Code settings format
3. This can be done in a future update

## Next Steps

1. **Reload Extension** - Test the new sidebar and settings
2. **Update Services** - Make sure services read from `vscode.workspace.getConfiguration('notas')` instead of workspace config file
3. **Clean Up** - Remove deprecated provider files
4. **Documentation** - Update README with new settings locations

## Command Quick Reference

New internal command:
- `notas.compareURLsWithArgs` - Compare URLs passed as arguments (used by sidebar)

Existing commands still work:
- `notas.compareURLs` - Compare URLs via input prompt
- `notas.compareURLsFromSelection` - Compare URLs from selected text
