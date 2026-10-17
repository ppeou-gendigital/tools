# Demo Script - Multi-Select Features

Follow this step-by-step demo to see the new multi-select features in action.

## Prerequisites

1. Install the updated extension (v0.2.0)
2. Open a project with multiple JavaScript, CSS, or JSON files

---

## 🎬 Demo 1: Compare Two Files (Quick)

### What You'll Do
Compare two files using multi-select

### Steps
1. Open VS Code Explorer (Cmd+Shift+E)
2. Navigate to a folder with at least 2 files
3. **Ctrl+Click** (or Cmd+Click on Mac) on first file
4. **Ctrl+Click** on second file
5. **Right-click** on either selected file
6. Click **"Notas: Compare Two Files"**

### Expected Result
- Diff view opens immediately
- Side-by-side comparison of the two files

### Demo Files to Use
- `package.json` vs `package-lock.json`
- `app.js` vs `app.min.js`

---

## 🎬 Demo 2: Compare with Quick Pick (3+ Files)

### What You'll Do
Select multiple files and choose which 2 to compare

### Steps
1. Select **4-5 files** using Ctrl+Click
2. **Right-click** on any selected file
3. Click **"Notas: Compare Two Files"**
4. A quick pick appears with all selected files
5. Select first file to compare
6. Select second file to compare

### Expected Result
- Quick pick menu appears
- After selecting 2 files, diff view opens

---

## 🎬 Demo 3: Format Multiple Files

### What You'll Do
Format 5 JavaScript files at once

### Steps
1. Create or find 5 JS files (or copy the same file 5 times)
2. Select all 5 files using Ctrl+Click or Shift+Click
3. **Right-click** on any selected file
4. Click **"Notas: Format/Pretty Print"**

### Expected Result
- Progress notification appears showing:
  - "Formatting 5 file(s)..."
  - Progress bar (0% → 100%)
  - Current file being processed
  - Cancel button
- Success notification: "✓ Formatted 5 file(s) successfully"
- All files are formatted with consistent style

### Demo Files to Create
Create 5 files with messy formatting:

**test1.js:**
```javascript
const x={a:1,b:2,c:3};function test(){return x.a+x.b;}
```

**test2.js:**
```javascript
if(true){console.log("hello");console.log("world");}
```

**test3.js:**
```javascript
const arr=[1,2,3,4,5];arr.forEach(x=>{console.log(x);});
```

**test4.js:**
```javascript
class MyClass{constructor(name){this.name=name;}greet(){return"Hello "+this.name;}}
```

**test5.js:**
```javascript
async function fetchData(){const res=await fetch("/api");return res.json();}
```

After formatting, they should have proper spacing and indentation!

---

## 🎬 Demo 4: Minify Multiple CSS Files

### What You'll Do
Minify 3 CSS files and see total size savings

### Steps
1. Create or find 3 CSS files
2. Select all 3 files
3. **Right-click** → **"Notas: Minify File"**

### Expected Result
- Progress notification appears
- Success notification shows total savings:
  - "✓ Minified 3 file(s): Saved 67.3% (12,450 → 4,072 bytes)"

### Demo Files to Create

**styles1.css:**
```css
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
```

**styles2.css:**
```css
.header {
  background-color: #333;
  color: white;
  padding: 1rem;
}

.nav {
  display: flex;
  gap: 1rem;
}
```

**styles3.css:**
```css
.button {
  background-color: blue;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
```

After minifying, all CSS will be compact with whitespace removed!

---

## 🎬 Demo 5: File Type Filtering

### What You'll Do
Show that commands only appear for appropriate file types

### Steps
1. Select a mix of files:
   - 2 JavaScript files (.js)
   - 1 JSON file (.json)
   - 1 image file (.png)
   - 1 text file (.txt)
2. **Right-click** and observe menu

### Expected Result for Format
- Command appears (will process JS and JSON only)
- PNG and TXT will be filtered out

### Expected Result for Minify
- Command appears (will process JS only)
- JSON, PNG, TXT will be filtered out

---

## 🎬 Demo 6: Cancel Operation

### What You'll Do
Start a batch operation and cancel it mid-process

### Steps
1. Select **10-20 files**
2. Right-click → Format
3. When progress notification appears, click **Cancel**

### Expected Result
- Operation stops immediately
- Notification shows: "Format cancelled (X completed, Y skipped)"
- Files processed before cancel are still formatted
- Remaining files are unchanged

---

## 🎬 Demo 7: Error Handling

### What You'll Do
Process files with intentional errors

### Steps
1. Create a file with invalid JavaScript:

**invalid.js:**
```javascript
const x = {
  a: 1
  b: 2  // Missing comma
  c: 3
}
```

2. Create valid files: **valid1.js**, **valid2.js**
3. Select all 3 files
4. Right-click → Format

### Expected Result
- Progress processes all 3 files
- Notification: "⚠ Formatted 2 file(s), 1 failed [Show Errors]"
- Click "Show Errors" to see: "invalid.js: Format failed: Unexpected token"

---

## 🎬 Demo 8: Backward Compatibility

### What You'll Do
Verify old methods still work

### Method 1: Editor Context Menu
1. Open a file in editor
2. **Right-click in the editor**
3. Select "Notas: Format/Pretty Print"
4. ✓ File formats

### Method 2: Command Palette
1. Press **Cmd+Shift+P** (or Ctrl+Shift+P)
2. Type "Notas: Compare"
3. Select "Notas: Compare Two Files"
4. File picker dialog appears
5. Select 2 files
6. ✓ Diff opens

### Method 3: Sequential Selection (Compare)
1. Right-click file1 → Compare Two Files
2. Notification: "Select one more file to compare"
3. Right-click file2 → Compare Two Files
4. ✓ Diff opens

---

## 📊 Demo Summary Checklist

After completing all demos, you should have verified:

- [ ] Multi-select works with 2 files (compare)
- [ ] Multi-select works with 3+ files (quick pick)
- [ ] Batch format works with progress
- [ ] Batch minify shows size savings
- [ ] File type filtering works
- [ ] Cancel operation works
- [ ] Error handling works gracefully
- [ ] Editor context menu still works
- [ ] Command palette still works
- [ ] Sequential selection still works

---

## 🎥 Recording Tips

If you want to record a demo video:

1. **Use a clean workspace** with demo files prepared
2. **Enable screencast mode** in VS Code (shows keys pressed)
3. **Use larger font size** for visibility
4. **Show Explorer sidebar** prominently
5. **Pause between operations** to let viewers see results
6. **Highlight cursor** with a tool like Mouseposé (Mac)

---

## 🐛 Troubleshooting During Demo

### Issue: Context menu doesn't show commands
**Fix:** Make sure you're right-clicking on a **file** (not folder) and it's a supported file type.

### Issue: Multi-select not working
**Fix:** Make sure files are highlighted (selected) before right-clicking.

### Issue: Progress notification disappears too quickly
**Fix:** This is normal for fast operations. Try selecting more files or larger files.

### Issue: No "Compare" option for selected files
**Fix:** Compare works for any file type, but make sure "explorerResourceIsFolder == false".

---

## 📝 Notes

- All demos use real VS Code functionality
- Undo (Cmd+Z) works for all operations
- All operations are non-destructive to original files
- Can test with copies of important files

Enjoy the demo! 🚀
