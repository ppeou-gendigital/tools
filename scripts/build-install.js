const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const packageJson = require(path.join(rootDir, 'package.json'));
const vsixPath = path.join(rootDir, `${packageJson.name}-${packageJson.version}.vsix`);

function executableFor(command) {
  return process.platform === 'win32' ? `${command}.cmd` : command;
}

function run(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(' ')}`);

  const result = spawnSync(executableFor(command), args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
    ...options,
  });

  if (result.error) {
    console.error(`Failed to run ${command}: ${result.error.message}`);
    return { status: 1 };
  }

  return result;
}

function commandExists(command) {
  const lookupCommand = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(lookupCommand, [command], {
    stdio: 'ignore',
    shell: false,
  });

  return result.status === 0;
}

const packageResult = run('npm', ['run', 'package']);
if (packageResult.status !== 0) {
  process.exit(packageResult.status || 1);
}

if (!fs.existsSync(vsixPath)) {
  console.error(`Expected VSIX was not created: ${vsixPath}`);
  process.exit(1);
}

const availableEditors = ['code', 'codium'].filter(commandExists);

if (availableEditors.length === 0) {
  console.warn('\nPackaged successfully, but neither `code` nor `codium` is available on your PATH.');
  console.log('Install the VSIX manually after enabling the editor CLI command:');
  console.log(`  code --install-extension "${vsixPath}" --force`);
  console.log(`  codium --install-extension "${vsixPath}" --force`);
  process.exit(0);
}

let failedInstalls = 0;

for (const editorCli of availableEditors) {
  const installResult = run(editorCli, ['--install-extension', vsixPath, '--force']);
  if (installResult.status !== 0) {
    failedInstalls += 1;
  }
}

if (failedInstalls > 0) {
  process.exit(1);
}

console.log(`\nInstalled ${path.basename(vsixPath)} using: ${availableEditors.join(', ')}`);

