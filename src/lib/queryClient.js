import { QueryClient } from '@tanstack/react-query'

// Module-level singleton. App.jsx wires it into <PersistQueryClientProvider>
// and AuthProvider imports it to clear on SIGNED_OUT.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
})
