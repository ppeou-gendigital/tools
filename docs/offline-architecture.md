# Offline architecture (Viaggio)

## Modes

| Mode | When | UI |
|------|------|-----|
| **Online** | `navigator.onLine` | Full app (Supabase). Journey Settings → **Available offline**. |
| **Offline** | Offline **and** ≥1 pinned pack | Read-only `OfflineRouter` (timeline, spending, todos, …). |
| **Offline empty** | Offline **and** no packs | Message to connect and pin a journey. |

Shell (HTML/JS/CSS) still comes from the PWA service worker. Domain data comes only from **IndexedDB packs**, not from React Query persist or Supabase HTTP caching.

## Pack shape

Built by `src/lib/offline/journeyPack.js`, stored in `viaggio.offline` (IndexedDB).

- `scopeId` = journey id  
- Client-mapped entities (`journey`, `entries`, `expenses`, `todos`, …)  
- Prefetched `fx` rates at pin time  
- Prefetched `weather` map (keyed by rounded lat|lng|date) for geo activities in the 7-day horizon at pin time  
- Last-known flight status lives on each flight entry’s `details` (refreshed on demand while online)  
- `syncedAt` ISO timestamp  

Not the portable file snapshot (`journeySnapshot.js`) — that format remaps IDs on import.

## Key modules

| Path | Role |
|------|------|
| `src/lib/offline/connectivity.js` | Online/offline signal |
| `src/lib/offline/packStore.js` | IndexedDB CRUD |
| `src/lib/offline/journeyPack.js` | Build / read journey packs |
| `src/providers/OfflineProvider.jsx` | Mode flags + pin API |
| `src/pages/offline/*` | Read-only offline UI |

## Theme

When offline, sunrise/sunset (`daynight`) uses **device clock**, not geolocation.

## Reuse in other tools

Copy `connectivity.js`, `packStore.js`, and `OfflineProvider` patterns. Replace `journeyPack.js` with a tool-specific packer (`toolId`, `kind`, `scopeId`). Keep payloads opaque to the store.
