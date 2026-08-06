import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { emptyProfileMeta } from '@/lib/jira/initialState'
import {
  jiraProfileId,
  jiraProfileName,
  normalizeProfileSource,
} from '@/lib/jira/profileSource'
import {
  downloadJson,
  loadProfileConfig,
  loadProfileMeta,
  readJsonFile,
  removeProfileConfig,
  saveProfileConfig,
  saveProfileMeta,
} from '@/lib/jira/profileStorage'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [meta, setMeta] = useState(emptyProfileMeta)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadProfileMeta().then((next) => {
      if (cancelled) return
      setMeta(next)
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const persistMeta = useCallback(async (next) => {
    setMeta(next)
    await saveProfileMeta(next)
  }, [])

  const importProfileFromJson = useCallback(
    async (data, name, source) => {
      const normalized = normalizeProfileSource(source)
      let id
      let displayName
      let entrySource

      if (normalized) {
        id = jiraProfileId(normalized.issueKey, normalized.filename)
        displayName = jiraProfileName(normalized.issueKey, normalized.filename)
        entrySource = normalized
      } else {
        id = String(name || '').trim()
        displayName = id
      }

      if (!id) throw new Error('Profile name is required')
      await saveProfileConfig(id, data)
      const entry = {
        id,
        name: displayName,
        uploadTime: new Date().toISOString(),
        ...(entrySource ? { source: entrySource } : {}),
      }
      const list = [...meta.list.filter((p) => p.id !== id), entry]
      await persistMeta({ list, selected: id })
      return id
    },
    [meta.list, persistMeta],
  )

  const setProfileSource = useCallback(
    async (id, source) => {
      const normalized = normalizeProfileSource(source)
      const list = meta.list.map((p) => {
        if (p.id !== id) return p
        if (!normalized) {
          const next = { ...p }
          delete next.source
          return next
        }
        return {
          ...p,
          name: jiraProfileName(normalized.issueKey, normalized.filename),
          source: normalized,
        }
      })
      await persistMeta({ ...meta, list })
    },
    [meta, persistMeta],
  )

  const saveProfileJson = useCallback(async (id, data) => {
    await saveProfileConfig(id, data)
  }, [])

  const importProfile = useCallback(
    async (file) => {
      const value = await readJsonFile(file)
      return importProfileFromJson(value, file.name)
    },
    [importProfileFromJson],
  )

  const selectProfile = useCallback(
    async (id) => {
      await persistMeta({ ...meta, selected: id })
    },
    [meta, persistMeta],
  )

  const deleteProfile = useCallback(
    async (id) => {
      await removeProfileConfig(id)
      const list = meta.list.filter((p) => p.id !== id)
      let selected = meta.selected
      if (selected === id) {
        selected = list[list.length - 1]?.id || ''
      }
      await persistMeta({ list, selected })
    },
    [meta, persistMeta],
  )

  const exportProfile = useCallback(async (id) => {
    const config = await loadProfileConfig(id)
    const profile = meta.list.find((p) => p.id === id)
    const fileName = profile?.source?.filename || profile?.name || id
    downloadJson(fileName, config)
  }, [meta.list])

  const value = useMemo(
    () => ({
      ready,
      list: meta.list,
      selectedId: meta.selected,
      hasProfile: Boolean(meta.selected),
      importProfile,
      importProfileFromJson,
      setProfileSource,
      saveProfileJson,
      selectProfile,
      deleteProfile,
      exportProfile,
    }),
    [
      ready,
      meta.list,
      meta.selected,
      importProfile,
      importProfileFromJson,
      setProfileSource,
      saveProfileJson,
      selectProfile,
      deleteProfile,
      exportProfile,
    ],
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

export function useProfiles() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfiles must be used inside <ProfileProvider>')
  return ctx
}
