const assert = require('assert');
const vscode = require('vscode');

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('Notas.notas'));
  });

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    
    const expectedCommands = [
      'notas.initWorkspace',
      'notas.syncWorktrees',
      'notas.compareFiles',
      'notas.compareURLs',
      'notas.formatFile',
      'notas.minifyFile',
      'notas.openScheduleSettings',
      'notas.manualSync'
    ];
    
    for (const cmd of expectedCommands) {
      assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
    }
  });
});
