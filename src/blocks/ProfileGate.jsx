import { useEffect } from 'react'
import { LoadingState } from '@tools/ui'
import {
  PROFILE_GATED_ROUTES,
  useNavigation,
} from '@/providers/NavigationProvider'
import { useProfiles } from '@/providers/ProfileProvider'

/** Redirects to Profiles when a gated route is opened without a selected profile. */
export function ProfileGate({ children }) {
  const { ready, hasProfile } = useProfiles()
  const { route, replace } = useNavigation()

  useEffect(() => {
    if (!ready) return
    if (!hasProfile && PROFILE_GATED_ROUTES.has(route)) {
      replace('profiles')
    }
  }, [ready, hasProfile, route, replace])

  if (!ready) {
    return <LoadingState>Loading profiles…</LoadingState>
  }

  if (!hasProfile && PROFILE_GATED_ROUTES.has(route)) {
    return <LoadingState>Opening profiles…</LoadingState>
  }

  return children
}
