# @tools/behavioral

Config/slot interaction shells: AppShell, FloatingMenu, MenuPanel, nav, auth gate/form.

## AppShell bottom clearance

By default the main scroll area has **no** FAB bottom padding (`--shell-main-pad-bottom: 0`).

Viaggio is the only tool that should opt in:

```jsx
<AppShell fabClearance chrome={<FloatingMenu />} hosts={<PlaylistPlaybackHost />}>
  {children}
</AppShell>
```

That adds `.bh-shell--fab-clearance` (FAB height + corner offset + spacing). Playlist mini-dock and map full-bleed still override via `data-playlist-dock` / `data-map-page`.
