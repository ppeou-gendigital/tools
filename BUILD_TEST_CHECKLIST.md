# Build & Test Checklist

## ✅ Pre-Build Verification

- [x] All implementation files updated
  - [x] src/commands/compare.js
  - [x] src/commands/format.js
  - [x] extension.js
  - [x] package.json
- [x] No linter errors in source code
- [x] Version bumped to 0.2.0
- [x] CHANGELOG.md updated
- [x] README.md updated

## 📦 Build Steps

1. **Clean old builds (optional)**
   ```bash
   rm -f notas-*.vsix
   ```

2. **Install dependencies (if needed)**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run package
   ```
   
   This should create: `notas-0.2.0.vsix`

4. **Verify the .vsix file**
   ```bash
   ls -lh notas-0.2.0.vsix
   ```
   
   Should be around 1-2 MB

## 🔧 Installation

### For VS Code:
```bash
code --install-extension notas-0.2.0.vsix
```

### For VSCodium:
```bash
codium --install-extension notas-0.2.0.vsix
```

### Or use combined command:
```bash
npm run build-install
```

### Manually:
1. Open VS Code
2. Go to Extensions (Cmd+Shift+X)
3. Click "..." menu → "Install from VSIX..."
4. Select `notas-0.2.0.vsix`

## 🧪 Testing Checklist

### Basic Multi-Select Tests

- [ ] **Compare 2 files**
  1. Select 2 files with Ctrl+Click
  2. Right-click → "Notas: Compare Two Files"
  3. ✓ Diff opens immediately

- [ ] **Compare 3+ files**
  1. Select 3+ files with Ctrl+Click
  2. Right-click → "Notas: Compare Two Files"
  3. ✓ Quick pick appears
  4. Select 2 files
  5. ✓ Diff opens

- [ ] **Format multiple files**
  1. Select 3+ JS/CSS files
  2. Right-click → "Notas: Format/Pretty Print"
  3. ✓ Progress bar appears
  4. ✓ Success notification shows count

- [ ] **Minify multiple files**
  1. Select 2+ JS/CSS files
  2. Right-click → "Notas: Minify File"
  3. ✓ Progress bar appears
  4. ✓ Shows total size savings

### File Type Filtering

- [ ] **Format menu visibility**
  - [ ] Shows for .js, .ts, .json, .css, .html, .md
  - [ ] Does NOT show for .png, .jpg, .txt

- [ ] **Minify menu visibility**
  - [ ] Shows for .js, .ts, .css
  - [ ] Does NOT show for .json, .md, .png

### Backward Compatibility

- [ ] **Editor context menu**
  1. Open a file
  2. Right-click in editor
  3. ✓ Format and Minify commands appear
  4. ✓ Commands work

- [ ] **Command Palette**
  1. Cmd+Shift+P → "Notas: Compare Two Files"
  2. ✓ File picker appears
  3. Select 2 files
  4. ✓ Diff opens

- [ ] **Sequential compare (old way)**
  1. Right-click file1 → Compare
  2. Right-click file2 → Compare
  3. ✓ Diff opens

### Error Handling

- [ ] **Cancel operation**
  1. Select 10+ files → Format
  2. Click Cancel during progress
  3. ✓ Operation stops
  4. ✓ Shows "cancelled" message

- [ ] **Handle errors gracefully**
  1. Create file with syntax error
  2. Select it + valid files → Format
  3. ✓ Valid files format successfully
  4. ✓ Error message for invalid file
  5. ✓ "Show Errors" button works

- [ ] **Undo support**
  1. Format a file
  2. Press Cmd+Z
  3. ✓ File reverts to original

### Edge Cases

- [ ] Select same file twice → Compare (should still work)
- [ ] Select folder + file (folder ignored)
- [ ] Select 20+ files → Format (should handle large batch)
- [ ] Empty file → Format (should handle gracefully)
- [ ] Very large file → Minify (should work)

## 🐛 Known Issues (Expected)

The following are NOT bugs:

1. **Test linter errors**: The test file has linter warnings for mocha globals - this is normal
2. **Quick pick for 1 file compare**: Falls back to sequential selection mode (backward compatible)
3. **Format shows for all file types in command palette**: This is VS Code's default behavior

## 📊 Success Criteria

All tests should pass with:
- ✅ No crashes or errors
- ✅ Progress indicators working
- ✅ Context menus showing for appropriate file types
- ✅ Batch operations completing successfully
- ✅ Error messages being clear and helpful
- ✅ Old workflows still functioning

## 🚀 Deployment

Once all tests pass:

1. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: Add explorer multi-select support for compare, format, and minify"
   ```

2. **Tag version**
   ```bash
   git tag v0.2.0
   ```

3. **Push to remote**
   ```bash
   git push origin main --tags
   ```

4. **Publish to VS Code Marketplace** (if applicable)
   ```bash
   npx vsce publish
   ```

## 📝 Post-Deployment

- [ ] Update GitHub release notes
- [ ] Share with users
- [ ] Monitor for feedback
- [ ] Address any issues reported

## 🎉 Completion

When all checkboxes are checked, the enhancement is complete and ready for use!

---

## 📚 Reference Documents

- [README.md](./README.md) - Full documentation
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - User guide
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) - Testing scenarios
- [UX_EXAMPLES.md](./UX_EXAMPLES.md) - Before/after comparisons
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
