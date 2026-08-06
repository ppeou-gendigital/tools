import { asyncStorage } from '@/lib/storage'
import {
  STORAGE_PROFILES_KEY,
  profileConfigKey,
} from './config'
import { emptyProfileMeta, normalizeProfileConfig } from './initialState'

export async function loadProfileMeta() {
  const raw = await asyncStorage.getItem(STORAGE_PROFILES_KEY)
  if (!raw) return emptyProfileMeta()
  try {
    const parsed = JSON.parse(raw)
    return {
      list: Array.isArray(parsed.list) ? parsed.list : [],
      selected: typeof parsed.selected === 'string' ? parsed.selected : '',
    }
  } catch {
    return emptyProfileMeta()
  }
}

export async function saveProfileMeta(meta) {
  await asyncStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(meta))
}

export async function loadProfileConfig(id) {
  if (!id) return normalizeProfileConfig(null)
  const raw = await asyncStorage.getItem(profileConfigKey(id))
  if (!raw) return normalizeProfileConfig(null)
  try {
    return normalizeProfileConfig(JSON.parse(raw))
  } catch {
    return normalizeProfileConfig(null)
  }
}

export async function saveProfileConfig(id, config) {
  if (!id) return
  await asyncStorage.setItem(
    profileConfigKey(id),
    JSON.stringify(normalizeProfileConfig(config)),
  )
}

export async function removeProfileConfig(id) {
  if (!id) return
  await asyncStorage.removeItem(profileConfigKey(id))
}

export function downloadJson(fileName, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
