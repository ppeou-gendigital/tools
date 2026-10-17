// Diagnostic: Run this in VS Code Developer Console (Cmd+Shift+P > Developer: Toggle Developer Tools)
// Paste this into the Console tab:

console.log('=== Notas Extension Diagnostic ===');

// Check if extension is activated
const notasExt = vscode.extensions.getExtension('notas.notas');
console.log('1. Extension found:', !!notasExt);
console.log('2. Extension active:', notasExt?.isActive);

if (!notasExt?.isActive) {
  console.log('3. Activating extension...');
  notasExt.activate().then(() => {
    console.log('4. Extension activated successfully');
  }).catch(err => {
    console.error('4. Activation failed:', err);
  });
}

// Check registered tree views
setTimeout(() => {
  console.log('5. Checking registered commands...');
  vscode.commands.getCommands().then(commands => {
    const notasCommands = commands.filter(c => c.startsWith('notas.'));
    console.log('6. Notas commands:', notasCommands);
  });
}, 2000);

console.log('=== End Diagnostic ===');
