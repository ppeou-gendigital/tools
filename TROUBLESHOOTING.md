# Emergency Fix: Force Show Configuration View

If the Configuration view isn't showing, try these steps:

## Option 1: Check if Configuration is Collapsed
1. In the Notas sidebar, look for a small arrow or chevron above "NOTAS: WORKTREES"
2. There might be a collapsed "NOTAS: CONFIGURATION" section
3. Try scrolling up in the sidebar

## Option 2: Reset View State
Run this command in VS Code:
1. Press Cmd+Shift+P
2. Type: "Developer: Reload Window"
3. This forces VS Code to reload all extensions

## Option 3: Check Extension Activation
1. Press Cmd+Shift+P
2. Type: "Developer: Toggle Developer Tools"
3. In Console tab, type: `vscode.extensions.getExtension('notas.notas').isActive`
4. Should return `true`

## Option 4: Check View Registration
In Developer Console, run:
```javascript
vscode.commands.executeCommand('workbench.view.extension.notas')
```

This should open the Notas view container.

## Option 5: Manual View Visibility
The Configuration view might be hidden. Try:
1. Right-click on the Notas sidebar header
2. Look for view options or visibility settings
3. Make sure "Configuration" is checked/visible
