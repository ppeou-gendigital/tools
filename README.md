# Notas - Git Worktree Manager

**Notas** is a powerful VS Code extension that helps you manage Git worktrees, compare files, format code, and automatically sync with remote repositories.

## ✨ Features

### 🌿 Git Worktree Management
- **One-click initialization**: Set up your workspace with a Git repository
- **Automatic worktree creation**: Sync all remote branches as worktrees
- **Visual sidebar**: Browse workspace config and worktrees easily
- **Configuration view**: See repository, auto-sync status, and schedules at a glance
- **Clean removal**: Remove worktrees safely

### 🔄 Auto-Sync Scheduler
- **Multiple daily schedules**: Set sync times like 11:00 AM, 7:00 PM
- **Smart conflict resolution**: Choose between keeping local, remote, or manual resolution
- **Auto-commit**: Automatically commit changes before syncing
- **Status bar integration**: See next sync time at a glance

### 📊 File Comparison
- **Compare local files**: Select multiple files in explorer to compare
- **Multi-select support**: Ctrl/Cmd+Click to select 2+ files
- **Compare URLs**: Download and compare files from URLs
- **Side-by-side diff**: Uses VS Code's built-in diff viewer

### 🎨 File Tools
- **Pretty format**: Format code with Prettier (JS, TS, JSON, HTML, CSS, etc.)
- **Minify**: Reduce file size for all web development files (JS, TS, CSS, HTML, JSON, XML, YAML, Markdown)
- **Batch processing**: Select multiple files in explorer to format/minify at once
- **Statistics**: See size savings in real-time

### ▶️ Commands (saved scripts)
- **Sidebar panel**: Open **Notas → Commands** for a searchable list of named scripts
- **JSON file**: Configure **`notas.commands.file`** in User or **Workspace** settings (default: `notas-commands.json` at the project root so you can commit it; not under `.notas`). In Settings (UI), open the **Notas: Commands** section, or run **Notas: Open Commands File Path Setting** from the Command Palette to jump straight to this option.
- **Run**: Click **▶** to send the `script` line to a new integrated terminal
- **Search**: Filter by `name` or `script` text in the panel search box
- **Refresh / edit**: Use the view title actions or **Notas: Open Commands File**

Example `notas-commands.json` (or whatever path you set):

```json
[
  { "name": "Open Opera", "script": "open -a Opera --args --disable-web-security --user-data-dir=~/emptydir" },
  { "name": "Command 1", "script": "~/doSomething.sh" }
]
```

## 🚀 Quick Start

### 1. Install Extension
Install from VS Code Marketplace or:
```bash
code --install-extension notas-0.1.0.vsix
```

### 2. Open a Folder
Open the folder where you want to manage worktrees.

### 3. Initialize Workspace
- Click "Yes" when prompted to initialize Notas workspace
- Enter your Git repository URL (HTTPS or SSH)
- Click "Yes" to clone and sync worktrees

### 4. Start Working
- Browse worktrees in the sidebar
- Click a worktree to open it in a new window
- Use auto-sync to keep everything up-to-date

## 📖 Usage

### View Workspace Configuration
The Notas sidebar shows your workspace configuration:
- **Repository**: Current Git repository URL
- **Workspace**: Workspace root path
- **Auto-Sync**: Status, schedules, and next sync time
- **File Tools**: Format and compare settings (indent, quotes, whitespace, etc.)
- **Quick Actions**: Configure and sync buttons

Click any item to view details or use the action buttons.

### Initialize Workspace
```
Command Palette → Notas: Initialize Workspace
```

### Sync Worktrees
```
Command Palette → Notas: Sync Worktrees
```
Or click the sync icon in the Notas sidebar.

### Compare Files
**From Explorer (Recommended):**
1. Select 2 files using Ctrl/Cmd+Click
2. Right-click → "Notas: Compare Two Files"
3. Diff opens automatically

**Alternative - Single Selection:**
1. Right-click first file → "Notas: Compare Two Files"
2. Right-click second file → "Notas: Compare Two Files"
3. Diff opens automatically

**From Command Palette:**
```
Command Palette → Notas: Compare Two Files
```
Then select 2 files from the dialog.

### Compare URLs
```
Command Palette → Notas: Compare Two URLs
```
Enter two URLs to download and compare.

### Format File
**From Explorer (Recommended):**
1. Select one or more files (Ctrl/Cmd+Click for multiple)
2. Right-click → "Notas: Format/Pretty Print"
3. Progress bar shows batch operation

**From Editor:**
```
Right-click in editor → Notas: Format/Pretty Print
```

**Supported formats:** JS, JSX, TS, TSX, JSON, HTML, CSS, SCSS, LESS, Markdown, YAML

### Minify File
**From Explorer (Recommended):**
1. Select one or more files (Ctrl/Cmd+Click for multiple)
2. Right-click → "Notas: Minify File"
3. See total size savings

**From Editor:**
```
Right-click in editor → Notas: Minify File
```

**Supported formats:** JS, JSX, TS, TSX, CSS, SCSS, HTML, JSON, XML, SVG, YAML, Markdown

### Manage Auto-Sync
Click the status bar item (shows next sync time) or:
```
Command Palette → Notas: Manage Auto-Sync Schedule
```

Options:
- Toggle auto-sync on/off
- Add schedule (e.g., 11:00, 19:00)
- Remove schedule
- Change conflict strategy
- Manual sync now

## ⚙️ Configuration

### Workspace Config
Notas creates a `.notas/config.json` file in your workspace:

```json
{
  "version": "1.0.0",
  "gitRepository": "https://github.com/user/repo.git",
  "workspaceRoot": "/path/to/workspace",
  "autoSync": {
    "enabled": true,
    "schedules": [
      { "time": "18:00", "enabled": true }
    ],
    "conflictStrategy": "ours",
    "autoCommit": true,
    "commitMessage": "Auto-sync at {time}"
  }
}
```

### Conflict Strategies
- **ours**: Keep local changes (default)
- **theirs**: Accept remote changes
- **manual**: Skip worktrees with conflicts

## 🗂️ Workspace Structure

```
your-workspace/
├── .notas/
│   └── config.json          # Workspace configuration
├── repo-name/               # Main repository
├── main/                    # Worktree for 'main' branch
├── develop/                 # Worktree for 'develop' branch
└── feature-branch/          # Worktree for 'feature-branch'
```

## 🎯 Use Cases

### Scenario 1: Multi-Branch Development
Work on multiple features simultaneously without switching branches:
- Each branch has its own folder
- Changes are isolated
- No need to stash or commit incomplete work

### Scenario 2: Code Review
Compare different branches side-by-side:
- Open main branch in one window
- Open feature branch in another
- Use file comparison tools

### Scenario 3: Automated Sync
Keep all branches synchronized:
- Set sync times (e.g., 11 AM, 7 PM)
- Auto-commits work in progress
- Pulls latest from remote
- Pushes local changes

## 🛠️ Requirements

- **VS Code**: 1.85.0 or higher
- **Git**: Installed and configured with credentials (SSH keys or HTTPS)
- **Node.js**: For extension dependencies

## 📝 Commands

| Command | Description |
|---------|-------------|
| `Notas: Initialize Workspace` | Set up Notas in current folder |
| `Notas: Sync Worktrees` | Create worktrees for all remote branches |
| `Notas: Refresh Worktree View` | Refresh sidebar view |
| `Notas: Compare Two Files` | Compare local files |
| `Notas: Compare Two URLs` | Download and compare URLs |
| `Notas: Format/Pretty Print` | Format current file |
| `Notas: Minify File` | Minify current file |
| `Notas: Manage Auto-Sync Schedule` | Configure auto-sync |
| `Notas: Sync All Worktrees Now` | Manual sync trigger |

## 🐛 Troubleshooting

### Extension not showing initialization prompt?
- Manually trigger: `Cmd+Shift+P` → "Notas: Initialize Workspace"
- Check the Notas icon in the Activity Bar (left sidebar)
- Reload window: `Cmd+Shift+P` → "Developer: Reload Window"
- Verify extension is active: `Cmd+Shift+P` → "Extensions: Show Running Extensions"

### Worktrees not showing?
- Check that repository is cloned
- Click refresh icon in sidebar
- Check output panel for errors
- Run "Notas: Sync Worktrees" from Command Palette

### Auto-sync not working?
- Verify schedules are added
- Check that auto-sync is enabled
- Look at status bar for next sync time

### Git credentials not working?
- Notas uses system Git credentials
- Test Git commands in terminal first
- For SSH: Ensure keys are added to ssh-agent
- For HTTPS: Configure credential helper

### VSCodium-specific issues?
- Extension is fully compatible with VSCodium
- Use `codium` CLI instead of `code`
- All features work the same as in VS Code

## 📄 License

MIT License - see LICENSE file

## 🤝 Support

Found a bug or have a feature request?
- Open an issue on GitHub
- Check existing issues first

## 🙏 Acknowledgments

Built with:
- [simple-git](https://github.com/steveukx/git-js) - Git operations
- [Prettier](https://prettier.io/) - Code formatting
- [Terser](https://terser.org/) - JS minification
- [cssnano](https://cssnano.co/) - CSS minification

---

**Happy coding with Notas!** 🌿
