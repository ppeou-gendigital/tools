# Changelog

All notable changes to the Notas extension will be documented in this file.

## [Unreleased] - Development

### Added
- **Workspace Configuration View** in sidebar
  - Shows Git repository information
  - Displays workspace root path
  - Shows auto-sync status (enabled/disabled)
  - Displays active schedules with next sync time
  - Shows conflict resolution strategy
  - Quick action buttons for Configure and Sync Now
  - Expandable sections for detailed information
- **File Tools Settings** in configuration view
  - Format settings: Indent type (spaces/tabs), indent size (2/4/8), line width, quotes style, semicolons
  - Compare settings: Ignore whitespace, ignore case
  - Visual display of all current settings
  - Quick access menu to change any setting
  - Settings stored in workspace config
  - Apply to all format and compare operations
- **Explorer multi-select support** for compare, format, and minify commands
  - Select multiple files using Ctrl/Cmd+Click
  - Right-click to apply operations to all selected files at once
- **Batch processing** with progress indicators
  - Format multiple files simultaneously with progress notifications
  - Minify multiple files with total size savings summary
  - Cancellable batch operations
- **File type filtering** in context menus
  - Format command only appears for supported formats (JS, TS, JSON, HTML, CSS, SCSS, Markdown, YAML)
  - Minify command only appears for JS, TS, and CSS files
  - Compare command appears for all non-folder files
- **Enhanced error handling**
  - Detailed error messages for failed operations
  - Success/failure summaries for batch operations
  - "Show Errors" button for detailed error inspection
- **Visual status indicators** with icons and colors
  - Green checkmark for enabled features
  - Red X for disabled features
  - Clock icons for schedules
  - Emoji icons for file tools settings
- **Live updates** - Configuration view refreshes automatically when settings change

### Changed
- Sidebar now has two sections: Configuration and Worktrees
- Refresh button updates both configuration and worktree views
- All configuration commands now update the sidebar view immediately
- Format commands now use workspace settings (indent, quotes, etc.)
- Action buttons split into Auto-Sync and File Tools configuration
- Compare files now supports three modes:
  - Multi-select (2 files): Opens diff immediately
  - Multi-select (3+ files): Quick pick to choose which 2 to compare
  - Single selection: Sequential selection mode (backward compatible)

### Improved
- Better visibility into workspace setup
- Easier access to configuration settings
- More intuitive understanding of auto-sync and format settings
- Consistent formatting across team when config is shared
- UX for file operations (no longer requires opening files in editor)
- Performance when processing multiple files
- User feedback during batch operations

## [0.1.0] - 2026-02-10

### Added
- Initial release
- Git worktree management
  - Initialize workspace with Git repository
  - Sync worktrees from remote branches
  - Visual sidebar for browsing worktrees
  - Open worktrees in new VS Code windows
  - Remove worktrees safely
- Auto-sync scheduler
  - Multiple daily sync schedules
  - Auto-commit before sync
  - Conflict resolution strategies (ours/theirs/manual)
  - Status bar integration
  - Manual sync trigger
- File comparison tools
  - Compare two local files
  - Compare two URLs
  - Side-by-side diff viewer
- File tools
  - Pretty format with Prettier
  - Minify with Terser and cssnano
  - Size savings statistics
- Support for multiple Git providers (GitHub, GitLab, Bitbucket, etc.)
- Support for SSH and HTTPS Git URLs
