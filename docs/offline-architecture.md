# Offline architecture (Notas)

## Modes

| Mode | When | UI |
|------|------|-----|
| **Online** | `navigator.onLine` | Full app (Supabase). Settings → **Available offline**. |
| **Offline** | Offline **and** ≥1 pinned pack | Read-only `OfflineRouter` (notebooks + notes). |
| **Offline empty** | Offline **and** no packs | Message to connect and pin a workspace. |

Shell (HTML/JS/CSS) still comes from the PWA service worker. Domain data comes only from **IndexedDB packs**, not from React Query persist or Supabase HTTP caching.

## Pack shape

Built by `src/lib/offline/workspacePack.js`, stored in `notas.offline` (IndexedDB).

- `scopeId` = user id (whole workspace)
- `kind: 'workspace'`
- Snapshot from `fetchRemoteWorkspace` (notebooks, notes, tags, lockboxes)
- Locked notes remain **ciphertext** (+ lockbox `vault_meta`); never store passphrases
- `syncedAt` ISO timestamp

Attachments are out of v1 (not in the workspace document).

## Unlock offline

Per-lockbox unlock uses the same PBKDF2 + verifier + AES-GCM path as online (`LockboxProvider` / `LockboxUnlockOverlay`). Decrypt in memory only.

## Key modules

| Path | Role |
|------|------|
| `src/lib/offline/connectivity.js` | Online/offline signal |
| `src/lib/offline/packStore.js` | IndexedDB CRUD |
| `src/lib/offline/workspacePack.js` | Build / read workspace packs |
| `src/providers/OfflineProvider.jsx` | Mode flags + pin API |
| `src/pages/offline/*` | Read-only offline UI |

## Reuse in other tools

Copy `connectivity.js`, `packStore.js`, and `OfflineProvider` patterns. Replace `workspacePack.js` with a tool-specific packer (`toolId`, `kind`, `scopeId`). Keep payloads opaque to the store.
