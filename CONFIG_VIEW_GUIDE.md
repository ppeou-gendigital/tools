# Workspace Configuration View - Feature Guide

## Overview

The new Workspace Configuration View provides a visual display of your Notas workspace settings directly in the VS Code sidebar. No more hunting through command palette or settings files!

## What's Displayed

### 📦 Repository
- Shows the Git repository URL
- Displays shortened repo name for readability
- Full URL shown in tooltip

### 📁 Workspace
- Shows workspace root path
- Path shortened if too long
- Full path shown in tooltip

### 🔄 Auto-Sync
Expandable section showing:
- **Status**: ✓ Enabled or ✗ Disabled (with color indicator)
- **Schedules**: Active sync times (e.g., 11:00, 18:00)
- **Conflict Strategy**: Keep Local, Accept Remote, or Manual
- **Auto-Commit**: Yes or No
- **Next Sync**: Time remaining until next sync (e.g., "2h 30m")

### Quick Actions
- **⚙️ Configure**: Opens schedule settings menu
- **🔄 Sync Now**: Triggers manual sync immediately

## Visual Examples

### Initialized Workspace
```
NOTAS: CONFIGURATION
├── 📦 Repository: my-project
├── 📁 Workspace: .../workspace
├── 🔄 Auto-Sync: ✓ Enabled
│   ├── 📅 Schedules: 2 active
│   │   ├── 🕐 11:00
│   │   └── 🕐 18:00
│   ├── 🔀 Conflict Strategy: Keep Local
│   ├── 💾 Auto-Commit: Yes
│   └── ⏰ Next Sync: 2h 30m
├── ⚙️ Configure
└── 🔄 Sync Now

NOTAS: WORKTREES (5)
├── 📂 main
├── 📂 develop
└── ...
```

### Uninitialized Workspace
```
NOTAS: CONFIGURATION
└── ⚙️ Initialize Workspace
    Click to set up Notas in this workspace
```

### Auto-Sync Disabled
```
NOTAS: CONFIGURATION
├── 📦 Repository: my-project
├── 📁 Workspace: .../workspace
├── 🔄 Auto-Sync: ✗ Disabled
├── ⚙️ Configure
└── 🔄 Sync Now
```

## User Interactions

### Clicking Items

**Repository**: Shows full URL in tooltip (no action)
**Workspace**: Shows full path in tooltip (no action)
**Auto-Sync**: Expands to show details
**Configure Button**: Opens schedule settings menu
**Sync Now Button**: Triggers manual sync

### Expanding Sections

Click **Auto-Sync** to expand and see:
- All active schedules
- Conflict resolution strategy
- Auto-commit setting
- Next scheduled sync time

Click **Schedules** to expand and see individual sync times.

## Live Updates

The configuration view updates automatically when:
- ✅ You toggle auto-sync on/off
- ✅ You add or remove schedules
- ✅ You change conflict strategy
- ✅ You initialize workspace
- ✅ You click refresh button

## Benefits

### Before (Without Config View)
❌ Run command to check if initialized  
❌ Run command to see auto-sync status  
❌ Run command to see schedules  
❌ Check status bar for next sync  
❌ Hard to troubleshoot configuration  

### After (With Config View)
✅ See everything at a glance  
✅ Visual status indicators  
✅ One-click access to settings  
✅ Easy troubleshooting  
✅ Clear, organized information  

## Integration with Other Features

### Status Bar
The status bar still shows next sync time and is clickable. Both the status bar and sidebar provide access to the same settings.

### Command Palette
All commands still work from Command Palette. The sidebar is an additional, visual way to access the same functionality.

### Context Menus
Right-clicking worktrees still provides the same options. The sidebar adds visibility, not complexity.

## Customization

The view automatically adjusts to your workspace:
- Shows only relevant information
- Hides sections when auto-sync is disabled
- Updates timing in real-time
- Adapts to number of schedules

## Troubleshooting

### Config view is empty
- Click "Initialize Workspace" if shown
- Check that you have a folder open in VS Code
- Try clicking the refresh button

### Auto-sync section not showing schedules
- Make sure auto-sync is enabled
- Check that you've added at least one schedule
- Click refresh button to update

### "Next Sync" shows "Not scheduled"
- Auto-sync might be disabled
- No active schedules configured
- Scheduler might not be started (reload window)

### Changes not reflected immediately
- Most changes update instantly
- Click refresh button if needed
- Some changes require restarting scheduler

## Tips

1. **Quick Status Check**: Look at the Auto-Sync icon color (green = enabled, gray = disabled)

2. **Time Until Sync**: Watch the "Next Sync" time to know when sync will happen

3. **Quick Config**: Click "Configure" button for fast access to settings

4. **Visual Feedback**: Icons and colors provide instant understanding

5. **Expand for Details**: Click Auto-Sync to see full configuration

## Keyboard Navigation

The sidebar supports keyboard navigation:
- **Tab**: Move between items
- **Arrow Keys**: Navigate up/down
- **Enter**: Expand/collapse or trigger action
- **Space**: Same as Enter

## Accessibility

- All items have descriptive labels
- Icons are supplemented with text
- Tooltips provide full information
- Keyboard accessible
- Screen reader friendly

## Future Enhancements

Potential additions in future versions:
- Click repository to copy URL
- Click workspace to open in terminal
- Edit schedules inline
- Visual schedule timeline
- Sync history/logs view

---

**Note**: This feature is part of Notas v0.3.0 and requires VS Code 1.85.0 or higher.
