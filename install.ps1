# Installs the jira-capacity CLI for the current Windows user.
#
#   powershell -ExecutionPolicy Bypass -File .\install.ps1
#   powershell -ExecutionPolicy Bypass -File .\install.ps1 -Uninstall
#
# Works from a checkout (release\jira-capacity.mjs) or from the unzipped
# artefacts folder (jira-capacity.mjs next to this script).

[CmdletBinding()]
param(
  [switch]$Uninstall,
  [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
  @'
Usage: powershell -ExecutionPolicy Bypass -File .\install.ps1 [-Uninstall]

Installs the jira-capacity CLI for the current user.
  -Uninstall   remove the launcher (profiles and tokens are kept)
'@ | Write-Host
  exit 0
}

$Name = 'jira-capacity'
$InstallDir = Join-Path $env:LOCALAPPDATA "Programs\$Name"
$Launcher = Join-Path $InstallDir "$Name.cmd"
$Bundle = Join-Path $InstallDir "$Name.mjs"

function Say([string]$Message) { Write-Host $Message }

function Get-UserPath {
  return [Environment]::GetEnvironmentVariable('Path', 'User')
}

function Remove-FromUserPath([string]$PathToRemove) {
  $current = Get-UserPath
  if ([string]::IsNullOrWhiteSpace($current)) { return }
  $parts = $current -split ';' | Where-Object { $_ -and $_ -ne $PathToRemove }
  [Environment]::SetEnvironmentVariable('Path', ($parts -join ';'), 'User')
}

if ($Uninstall) {
  $current = Get-UserPath
  if ($current -and (($current -split ';') -contains $InstallDir)) {
    Remove-FromUserPath $InstallDir
    Say "Removed $InstallDir from the user PATH."
  }
  if (Test-Path $InstallDir) {
    Remove-Item -Recurse -Force $InstallDir
    Say "Removed $InstallDir"
  } else {
    Say "$Name is not installed."
  }
  $config = Join-Path $env:APPDATA $Name
  Say "Profiles and tokens were left in $config."
  exit 0
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  throw 'Node.js is required. Install Node 20 or newer, then re-run.'
}

$major = [int](& node -p "process.versions.node.split('.')[0]")
if ($major -lt 20) {
  throw "Node 20 or newer is required (found $(& node -v))."
}

$candidates = @(
  $env:JIRA_CAPACITY_SRC,
  (Join-Path $PSScriptRoot 'release\jira-capacity.mjs'),
  (Join-Path $PSScriptRoot 'jira-capacity.mjs'),
  (Join-Path (Split-Path $PSScriptRoot -Parent) 'release\jira-capacity.mjs')
) | Where-Object { $_ -and (Test-Path $_) }

if (-not $candidates -or $candidates.Count -eq 0) {
  throw 'Could not find jira-capacity.mjs. Run this from the unzipped artefacts folder or the repo root.'
}

$source = $candidates[0]
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Copy-Item -Force $source $Bundle

@'
@echo off
node "%~dp0jira-capacity.mjs" %*
'@ | Set-Content -Path $Launcher -Encoding ASCII

$current = Get-UserPath
$parts = @()
if ($current) { $parts = $current -split ';' | Where-Object { $_ } }
if (-not ($parts -contains $InstallDir)) {
  [Environment]::SetEnvironmentVariable(
    'Path',
    (($parts + $InstallDir) -join ';'),
    'User'
  )
  Say "Added $InstallDir to the user PATH (open a new terminal to pick it up)."
}

$config = Join-Path $env:APPDATA $Name
New-Item -ItemType Directory -Force -Path (Join-Path $config 'profiles') | Out-Null

Say "Installed $Launcher"
Say "Profiles: $config\profiles"
Say ''
Say 'Next:'
Say '  1. jira-capacity auth set --jira -        # paste the Jira PAT'
Say '  2. jira-capacity auth status              # confirms the user'
Say '  3. jira-capacity profiles pull --from confluence:<pageId>'
Say ''
Say 'The clipboard path uses PowerShell STA mode and should paste as cells in Excel.'
Say 'If the agent runs remotely, use --out report.xls instead.'
