# Viaggio follow-ups

Open items found during development / collab testing. Not blocking current smoke tests.

## Bugs / UX debt

- [ ] **Playlist sync needs a query-cache refresh** — When one member adds a playlist link, other browsers may keep serving a stale `viaggio.queries` (persisted React Query) list until cache clear + reopen Playlist. Invalidate/refetch playlist queries across sessions (or shorten persist for `['viaggio','playlist']`) so collaborators see new items without manual refresh hacks.

## Later product / tech

- [ ] Attachments UI wired to entry-scoped schema
- [ ] Realtime live sync (timeline / expenses / playlist) without refresh
- [ ] Maps phase
