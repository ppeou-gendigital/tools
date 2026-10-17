# Notas - Quick Start Guide

Get up and running with Notas in 5 minutes! 🚀

---

## 🏃 Quick Setup (Development Mode)

### 1. Open the Project
```bash
cd /Users/Piseth.Peou/codes/poc/project-developo
code .
```

### 2. Launch Extension
- Press **F5** in VS Code
- A new "Extension Development Host" window opens
- Your extension is now running!

### 3. Test It Out
In the Extension Development Host window:

1. **Open a test folder:**
   - File → Open Folder
   - Choose any folder

2. **Initialize Notas:**
   - You'll see: "Initialize Notas workspace in this folder?"
   - Click "Yes"
   - Enter a Git repo URL (try a small public repo):
     ```
     https://github.com/octocat/Hello-World.git
     ```
   - Click "Yes" to clone and sync worktrees

3. **Check the Sidebar:**
   - Look for the Notas icon in the Activity Bar (left side)
   - Click it to see worktrees
   - Click a worktree to open it

4. **Try File Tools:**
   - Create a JavaScript file with messy code
   - Right-click → "Notas: Format/Pretty Print"
   - Watch it get formatted!

---

## 📦 Package for Local Installation

### Build the Extension
```bash
# Install vsce if not already installed
npm install -g @vscode/vsce

# Package
vsce package

# This creates: notas-0.1.0.vsix
```

### Install Locally
```bash
code --install-extension notas-0.1.0.vsix
```

Now Notas is installed like any other extension!

---

## 🧪 Run Tests

```bash
npm test
```

Tests will:
- Launch VS Code
- Load the extension
- Verify all commands are registered
- Report results

---

## 🎯 Test All Features

### ✅ Workspace Initialization
```
1. Open folder in VS Code
2. Command Palette (Cmd/Ctrl+Shift+P)
3. Type "Notas: Initialize Workspace"
4. Enter Git repo URL
5. Watch worktrees get created
```

### ✅ Worktree Management
```
1. Click Notas icon in sidebar
2. See list of worktrees
3. Click a worktree → Opens in new window
4. Right-click → Remove worktree
5. Click sync icon → Refresh from remote
```

### ✅ Auto-Sync Scheduler
```
1. Click status bar item (bottom left)
2. Choose "Add Schedule"
3. Enter time: 11:00
4. Add another: 19:00
5. Toggle auto-sync ON
6. Watch status bar show countdown
```

### ✅ File Comparison
```
Local Files:
1. Right-click file A → "Notas: Compare Two Files"
2. Right-click file B
3. Diff opens automatically

URLs:
1. Command Palette → "Notas: Compare Two URLs"
2. Enter URL 1: https://example.com/file1.js
3. Enter URL 2: https://example.com/file2.js
4. Watch files download and compare
```

### ✅ Format/Minify
```
Format:
1. Open any .js/.ts/.css/.html file
2. Right-click → "Notas: Format/Pretty Print"
3. Code is formatted instantly

Minify:
1. Open same file
2. Right-click → "Notas: Minify File"
3. See size savings in notification
```

---

## 🐛 Troubleshooting

### Extension Not Loading?
```bash
# Check for errors in Debug Console
# View → Debug Console

# Or check Extension Host output
# View → Output → Select "Extension Host"
```

### Commands Not Showing?
```bash
# Reload Extension Development Host
# Cmd/Ctrl+R in the Extension Development Host window
```

### Git Errors?
```bash
# Verify Git is configured
git config --list

# Test Git credentials
git ls-remote https://github.com/octocat/Hello-World.git
```

### Auto-Sync Not Working?
```bash
# Check configuration
cat .notas/config.json

# Verify schedules are added
# Check status bar shows next sync time
```

---

## 📝 Development Commands

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Run tests
npm test

# Package extension
vsce package

# Install locally
code --install-extension notas-0.1.0.vsix

# Uninstall
code --uninstall-extension Notas.notas
```

---

## 🎨 Customize (Optional)

### Change Icon
Replace `media/icon.svg` with your own icon

### Change Publisher Name
In `package.json`:
```json
{
  "publisher": "YourName"
}
```

### Add More Commands
1. Add to `package.json` → `contributes.commands`
2. Register in `extension.js`
3. Create handler in `src/commands/`

---

## 🚀 Publish to Marketplace

### 1. Create Publisher Account
- Go to https://marketplace.visualstudio.com/
- Sign in with Microsoft account
- Create a publisher

### 2. Get Personal Access Token
- Go to Azure DevOps
- Create PAT with Marketplace permissions

### 3. Login and Publish
```bash
vsce login YourPublisherName
vsce publish
```

Your extension is now live! 🎉

---

## 📚 Learn More

- **VS Code Extension API**: https://code.visualstudio.com/api
- **Publishing Guide**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **Extension Samples**: https://github.com/microsoft/vscode-extension-samples

---

## ⚡ Pro Tips

1. **Debug with Breakpoints**: Set breakpoints in your code, press F5, they'll hit in Extension Development Host

2. **Live Reload**: Make changes to code → Cmd/Ctrl+R in Extension Development Host to reload

3. **Check Logs**: View → Output → "Extension Host" shows all console.log()

4. **Test with Real Repos**: Use your actual projects for realistic testing

5. **Status Bar is Clickable**: Clicking status bar opens schedule settings

---

## 🎯 Next Steps

1. ✅ Test in development mode (F5)
2. ✅ Package as .vsix
3. ✅ Install locally and test
4. ✅ Share with friends for beta testing
5. ✅ Create publisher account
6. ✅ Publish to marketplace
7. ✅ Celebrate! 🎉

---

**Need Help?**
- Check `PROJECT_SUMMARY.md` for detailed documentation
- Check `README.md` for user-facing docs
- Look at code comments for implementation details

**Ready? Press F5 and start testing!** 🚀
