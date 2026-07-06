import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { asyncStorage } from './storage'

// Persists the TanStack Query cache into whichever backing store our
// isExtension() check chose: chrome.storage.local in the extension popup,
// localStorage on the web. First popup open of the day still fetches; every
// subsequent open shows the cached data immediately, then background-refetches.
export const queryPersister = createAsyncStoragePersister({
  storage: asyncStorage,
  key: 'toolname.queries',
  throttleTime: 1000,
})
