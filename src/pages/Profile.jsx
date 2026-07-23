import { useState } from 'react'
import { ArrowLeft, Check, Loader2, TriangleAlert } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { supabase } from '@/lib/supabase'
import styles from './Page.module.scss'

export function Profile() {
  const { user } = useAuth()
  const { goBack, previousRouteLabel } = useNavigation()
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle()
      if (error) throw error
      return data ?? { display_name: '' }
    },
  })

  const initialName = profileQuery.data?.display_name ?? ''
  const [displayName, setDisplayName] = useState(initialName)
  const [syncedFrom, setSyncedFrom] = useState(initialName)

  // Re-seed the controlled input whenever the query data changes (initial
  // load, after invalidation on save, or on refocus refetch). Done during
  // render (React 19-recommended pattern) instead of in useEffect so it
  // doesn't cause an extra commit — React batches this with the current render.
  if (syncedFrom !== initialName) {
    setSyncedFrom(initialName)
    setDisplayName(initialName)
  }

  const saveProfile = useMutation({
    mutationFn: async (name) => {
      const { error } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          email: user.email,
          display_name: name.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      )
      if (error) throw error
      return name
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
    },
  })

  function handleSave(e) {
    e.preventDefault()
    if (!user) return
    saveProfile.mutate(displayName)
  }

  function handleChange(next) {
    setDisplayName(next)
    if (saveProfile.isSuccess || saveProfile.isError) saveProfile.reset()
  }

  const isLoading = profileQuery.isLoading
  const isSaving = saveProfile.isPending
  const dirty = displayName !== initialName
  const showSuccess = saveProfile.isSuccess && !dirty && !saveProfile.isPending
  const errorMessage =
    saveProfile.error?.message ?? profileQuery.error?.message ?? null

  return (
    <div className={styles.page}>
      <PageHeader
        title="Profile"
        subtitle="How you appear to co-travelers."
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
      />

      <div className={styles.body}>
        {isLoading && <LoadingState>Loading profile…</LoadingState>}
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.field}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? ''} readOnly disabled />
          </div>

          <div className={styles.field}>
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              placeholder={isLoading ? 'Loading…' : 'How should we call you?'}
              value={displayName}
              onChange={(e) => handleChange(e.target.value)}
              disabled={isLoading || isSaving}
              maxLength={80}
            />
          </div>

          {showSuccess && (
            <p className={styles.hint} role="status">
              <Check size={12} aria-hidden="true" /> Saved.
            </p>
          )}
          {errorMessage && (
            <p className={styles.error} role="alert">
              <TriangleAlert size={12} aria-hidden="true" /> {errorMessage}
            </p>
          )}

          <div className={styles.actionsSticky}>
            <Button type="submit" disabled={isLoading || isSaving || !dirty}>
              {isSaving ? (
                <>
                  <Loader2 size={14} aria-hidden="true" />
                  Saving
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
