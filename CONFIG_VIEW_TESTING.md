# Configuration View - Testing Guide

## Prerequisites

1. Build the extension:
   ```bash
   npm run package
   ```

2. Install the extension:
   ```bash
   code --install-extension notas-0.3.0.vsix
   ```

3. Reload VS Code window

## Test Scenarios

### Test 1: Uninitialized Workspace

**Setup**: Open a folder that doesn't have Notas configured

**Expected Result**:
```
NOTAS: CONFIGURATION
└── ⚙️ Initialize Workspace
    Click to set up Notas in this workspace
```

**Steps**:
1. Click "Initialize Workspace" button
2. Enter a Git repository URL
3. Complete initialization

**Verify**:
- ✓ Button is clickable
- ✓ Initialization workflow starts
- ✓ View updates after initialization

---

### Test 2: Initialized Workspace (Auto-Sync Disabled)

**Setup**: Initialize a workspace but don't enable auto-sync

**Expected Result**:
```
NOTAS: CONFIGURATION
├── 📦 Repository: [repo-name]
├── 📁 Workspace: .../[path]
├── 🔄 Auto-Sync: ✗ Disabled
├── ⚙️ Configure
└── 🔄 Sync Now
```

**Steps**:
1. Observe the configuration view
2. Check repository name
3. Check workspace path
4. Verify auto-sync shows as disabled

**Verify**:
- ✓ Repository name is shortened correctly
- ✓ Workspace path is shortened correctly
- ✓ Auto-sync shows red X icon
- ✓ Auto-sync says "Disabled"
- ✓ Action buttons are present

---

### Test 3: Enable Auto-Sync

**Setup**: Workspace with auto-sync disabled

**Steps**:
1. Click "⚙️ Configure" button
2. Select "Toggle Auto-Sync"
3. Observe configuration view

**Expected Result**:
```
NOTAS: CONFIGURATION
├── 📦 Repository: [repo-name]
├── 📁 Workspace: .../[path]
├── 🔄 Auto-Sync: ✓ Enabled      [expanded]
│   ├── 🔀 Conflict Strategy: Keep Local
│   └── 💾 Auto-Commit: Yes
├── ⚙️ Configure
└── 🔄 Sync Now
```

**Verify**:
- ✓ Auto-sync changes to "✓ Enabled"
- ✓ Icon color changes to green
- ✓ Section expands automatically
- ✓ Shows conflict strategy
- ✓ Shows auto-commit status

---

### Test 4: Add Schedules

**Setup**: Workspace with auto-sync enabled but no schedules

**Steps**:
1. Click "⚙️ Configure"
2. Select "Add Schedule"
3. Enter "11:00"
4. Repeat for "18:00"

**Expected Result**:
```
NOTAS: CONFIGURATION
├── 📦 Repository: [repo-name]
├── 📁 Workspace: .../[path]
├── 🔄 Auto-Sync: ✓ Enabled      [expanded]
│   ├── 📅 Schedules: 2 active   [can expand]
│   │   ├── 🕐 11:00
│   │   └── 🕐 18:00
│   ├── 🔀 Conflict Strategy: Keep Local
│   ├── 💾 Auto-Commit: Yes
│   └── ⏰ Next Sync: [time remaining]
├── ⚙️ Configure
└── 🔄 Sync Now
```

**Verify**:
- ✓ Schedules section appears
- ✓ Shows correct count (2 active)
- ✓ Individual times shown when expanded
- ✓ Next sync time appears
- ✓ Countdown updates (wait 1 minute, check again)

---

### Test 5: Change Conflict Strategy

**Setup**: Workspace with auto-sync enabled

**Steps**:
1. Click "⚙️ Configure"
2. Select "Change Conflict Strategy"
3. Choose "Theirs (Keep remote changes)"

**Expected Result**:
```
NOTAS: CONFIGURATION
├── ...
├── 🔄 Auto-Sync: ✓ Enabled
│   ├── ...
│   ├── 🔀 Conflict Strategy: Accept Remote  [changed]
│   └── ...
```

**Verify**:
- ✓ Strategy updates immediately
- ✓ Shows new strategy label
- ✓ No page refresh needed

---

### Test 6: Expandable Sections

**Setup**: Workspace with auto-sync enabled and schedules

**Steps**:
1. Click on "🔄 Auto-Sync" to collapse
2. Click again to expand
3. Click on "📅 Schedules" to collapse
4. Click again to expand

**Verify**:
- ✓ Auto-sync section expands/collapses
- ✓ Schedules section expands/collapses
- ✓ Arrow icons change direction
- ✓ Smooth animation

---

### Test 7: Action Buttons

**Setup**: Fully configured workspace

**Test 7a: Configure Button**

**Steps**:
1. Click "⚙️ Configure" button

**Expected**:
- ✓ Settings menu appears
- ✓ Shows all options (Toggle, Add Schedule, etc.)

**Test 7b: Sync Now Button**

**Steps**:
1. Click "🔄 Sync Now" button

**Expected**:
- ✓ Manual sync starts
- ✓ Progress notification appears
- ✓ Configuration view updates after sync

---

### Test 8: Tooltips

**Setup**: Fully configured workspace

**Steps**:
1. Hover over "📦 Repository" item
2. Hover over "📁 Workspace" item

**Verify**:
- ✓ Repository tooltip shows full URL
- ✓ Workspace tooltip shows full path
- ✓ Tooltips appear quickly
- ✓ Tooltips are readable

---

### Test 9: Next Sync Countdown

**Setup**: Workspace with auto-sync enabled and a schedule in the near future

**Steps**:
1. Add a schedule for current time + 5 minutes
2. Observe "⏰ Next Sync" value
3. Wait 1 minute
4. Click refresh button
5. Observe updated value

**Expected**:
```
⏰ Next Sync: 5m     (initially)
⏰ Next Sync: 4m     (after 1 minute)
⏰ Next Sync: 3m     (after 2 minutes)
...
```

**Verify**:
- ✓ Countdown shows correct time
- ✓ Updates when refreshed
- ✓ Shows hours and minutes (e.g., "2h 30m")
- ✓ Shows only minutes if less than 1 hour

---

### Test 10: Remove Schedule

**Setup**: Workspace with 2 schedules

**Steps**:
1. Click "⚙️ Configure"
2. Select "Remove Schedule"
3. Choose "11:00"

**Expected Result**:
```
NOTAS: CONFIGURATION
├── ...
├── 🔄 Auto-Sync: ✓ Enabled
│   ├── 📅 Schedules: 1 active   [count decreased]
│   │   └── 🕐 18:00             [11:00 removed]
│   └── ⏰ Next Sync: [updated]
```

**Verify**:
- ✓ Schedule removed immediately
- ✓ Count updates (2 → 1)
- ✓ Next sync time recalculates
- ✓ Remaining schedule still shown

---

### Test 11: Disable Auto-Sync

**Setup**: Workspace with auto-sync enabled

**Steps**:
1. Click "⚙️ Configure"
2. Select "Toggle Auto-Sync"

**Expected Result**:
```
NOTAS: CONFIGURATION
├── 📦 Repository: [repo-name]
├── 📁 Workspace: .../[path]
├── 🔄 Auto-Sync: ✗ Disabled     [collapsed]
├── ⚙️ Configure
└── 🔄 Sync Now
```

**Verify**:
- ✓ Auto-sync changes to "✗ Disabled"
- ✓ Icon color changes to gray
- ✓ Section collapses
- ✓ Schedules hidden
- ✓ Next sync time hidden

---

### Test 12: Refresh Button

**Setup**: Fully configured workspace

**Steps**:
1. Click the refresh icon in the CONFIGURATION view title
2. Observe the view

**Verify**:
- ✓ View refreshes without errors
- ✓ All data remains consistent
- ✓ No visual glitches

---

### Test 13: Multiple Workspaces

**Setup**: Two VS Code windows with different Notas workspaces

**Steps**:
1. Open workspace A in window 1
2. Open workspace B in window 2
3. Compare configuration views

**Verify**:
- ✓ Each window shows its own config
- ✓ Repository names are different
- ✓ Auto-sync settings are independent
- ✓ No data leakage between windows

---

### Test 14: Long Repository URL

**Setup**: Repository with very long URL

**Test URL**: `https://github.com/very-long-organization-name/very-long-repository-name-that-exceeds-forty-characters.git`

**Expected**:
```
📦 Repository: very-long-repository-name-th...
```

**Steps**:
1. Initialize with long URL
2. Check configuration view
3. Hover over repository item

**Verify**:
- ✓ Repository name is truncated
- ✓ Ellipsis (...) appears
- ✓ Tooltip shows full URL
- ✓ View doesn't overflow

---

### Test 15: Deep Workspace Path

**Setup**: Workspace in deeply nested directory

**Test Path**: `/Users/username/Documents/Projects/Work/Client/ProjectName/Workspace`

**Expected**:
```
📁 Workspace: .../ProjectName/Workspace
```

**Steps**:
1. Use workspace with deep path
2. Check configuration view
3. Hover over workspace item

**Verify**:
- ✓ Path is shortened
- ✓ Shows last 2 directories
- ✓ Leading ".../" appears
- ✓ Tooltip shows full path

---

### Test 16: Error Handling

**Test 16a: Sync Now Without Config**

**Setup**: Try to sync before configuring

**Expected**:
- ✓ Error message appears
- ✓ Says "Auto-sync not configured"
- ✓ No crash or hanging

**Test 16b: Invalid Schedule Time**

**Setup**: Try to add invalid schedule

**Steps**:
1. Click Configure → Add Schedule
2. Enter "25:00" (invalid hour)

**Expected**:
- ✓ Validation error appears
- ✓ Schedule not added
- ✓ Can try again

---

### Test 17: Keyboard Navigation

**Setup**: Fully configured workspace

**Steps**:
1. Click in configuration view
2. Press Tab to move between items
3. Press Enter on expandable items
4. Press Enter on action buttons

**Verify**:
- ✓ Tab cycles through items
- ✓ Enter expands/collapses sections
- ✓ Enter triggers action buttons
- ✓ Keyboard navigation is smooth

---

## Integration Tests

### Test 18: Sync Updates View

**Steps**:
1. Observe worktree count
2. Click "Sync Now" or trigger manual sync
3. Observe configuration view

**Verify**:
- ✓ View refreshes after sync
- ✓ Next sync time updates
- ✓ No visual glitches

### Test 19: Initialize Updates View

**Steps**:
1. Start with uninitialized workspace
2. Initialize workspace
3. Observe configuration view

**Verify**:
- ✓ "Initialize" button disappears
- ✓ Configuration items appear
- ✓ Repository and workspace shown

### Test 20: Theme Compatibility

**Setup**: Test with different VS Code themes

**Steps**:
1. Switch to Light theme
2. Check configuration view colors
3. Switch to Dark theme
4. Switch to High Contrast theme

**Verify**:
- ✓ Icons visible in all themes
- ✓ Text readable in all themes
- ✓ Colors appropriate for theme
- ✓ No visual artifacts

---

## Performance Tests

### Test 21: Large Number of Schedules

**Setup**: Add 10+ schedules

**Verify**:
- ✓ View renders quickly
- ✓ No lag when expanding
- ✓ Scrolling is smooth
- ✓ All schedules shown

### Test 22: Rapid Configuration Changes

**Steps**:
1. Toggle auto-sync on/off repeatedly
2. Add and remove schedules quickly
3. Change conflict strategy multiple times

**Verify**:
- ✓ View updates smoothly
- ✓ No flickering
- ✓ No errors in console
- ✓ Final state is correct

---

## Bug Testing

### Test 23: Edge Cases

**Test 23a: No Schedules**
- Auto-sync enabled but no schedules
- Should show "Not scheduled" for next sync

**Test 23b: Midnight Schedule**
- Add schedule for "00:00"
- Should handle correctly

**Test 23c: Past Schedule**
- Add schedule for time that already passed today
- Should schedule for tomorrow

**Test 23d: Very Long Schedule**
- Add schedule for 23:59
- Time until sync should show correctly

---

## Acceptance Criteria

All tests must pass with ✓ for feature to be considered complete:

- [ ] Configuration view appears in sidebar
- [ ] All information displays correctly
- [ ] Expandable sections work
- [ ] Action buttons function properly
- [ ] View updates automatically after changes
- [ ] Tooltips provide full information
- [ ] No linter errors or warnings
- [ ] No console errors during use
- [ ] Performance is acceptable
- [ ] Works with all VS Code themes
- [ ] Keyboard navigation works
- [ ] Error handling is graceful

---

## Reporting Issues

If any test fails, report:
1. Test number and name
2. Steps to reproduce
3. Expected result
4. Actual result
5. VS Code version
6. Extension version
7. Console errors (if any)

---

**Testing Date**: __________  
**Tested By**: __________  
**Version**: 0.3.0  
**Status**: [ ] Pass [ ] Fail
