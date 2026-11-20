// Profile documents: the importable JSON that carries the option catalog plus
// the current selection. Parsing is strict enough to reject junk and forgiving
// enough to read files exported by the previous CRA build.

import { JIRA_ORIGIN, SCHEMA_VERSION } from './config.js'
import {
  DEFAULT_FETCH_FIELD_IDS,
  DEFAULT_REPORT_FIELD_IDS,
  resolveFields,
} from './fields.js'
import { emptyFilters, FILTER_KEYS, normalizeItems } from './filters.js'

export const EMPTY_AVAILABLE = {
  projects: [],
  types: [],
  statuses: [],
  resolutions: [],
  fields: [],
}

export function createSelection(overrides = {}) {
  return {
    filters: emptyFilters(),
    fetchFields: resolveFields(DEFAULT_FETCH_FIELD_IDS),
    reportFields: resolveFields(DEFAULT_REPORT_FIELD_IDS),
    resources: [],
    orderBy: [],
    ...overrides,
  }
}

export function createProfile(overrides = {}) {
  return {
    schemaVersion: SCHEMA_VERSION,
    name: 'Default',
    origin: JIRA_ORIGIN,
    available: { ...EMPTY_AVAILABLE },
    selection: createSelection(),
    ...overrides,
  }
}

export function normalizeAvailable(available = {}) {
  return {
    projects: normalizeItems(available.projects),
    types: normalizeItems(available.types),
    statuses: normalizeItems(available.statuses),
    resolutions: normalizeItems(available.resolutions),
    fields: normalizeItems(available.fields),
  }
}

function normalizeFilters(filters = {}) {
  const base = emptyFilters()
  for (const key of FILTER_KEYS) {
    base[key] = normalizeItems(filters[key])
  }
  return base
}

function normalizeOrderBy(orderBy = []) {
  return (Array.isArray(orderBy) ? orderBy : [])
    .filter((entry) => entry?.id)
    .map((entry) => ({
      id: String(entry.id),
      direction: String(entry.direction ?? 'ASC').toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC',
    }))
}

// Resources keep their own key space so a person called "assignee" cannot
// collide with a field id in the exported table.
function resourceKey(item) {
  const raw = typeof item === 'string' ? item : (item?.id ?? item?.name)
  if (!raw) return null
  const value = String(raw)
  return value.startsWith('resource:') ? value : `resource:${value}`
}

export function normalizeResources(resources = []) {
  const seen = new Set()
  const result = []
  for (const item of Array.isArray(resources) ? resources : []) {
    const id = resourceKey(item)
    if (!id || seen.has(id)) continue
    seen.add(id)
    const name =
      typeof item === 'string'
        ? item
        : (item.name ?? item.displayName ?? String(item.id ?? item.name))
    result.push({ id, name: String(name) })
  }
  return result
}

export function isLegacyProfile(raw) {
  return Boolean(raw && typeof raw === 'object' && raw.jira && !raw.selection)
}

// Shape produced by the previous build's "Export profile" button:
// { jira: { projects, resolutions, sprints, types, status, columns, users,
//           orderBy, lookupList: { fields, projects, issueType, issueStatus,
//           resolutions } } }
function fromLegacy(raw, fallbackName) {
  const legacy = raw.jira ?? {}
  const lookup = legacy.lookupList ?? {}

  const available = normalizeAvailable({
    projects: lookup.projects ?? legacy.projects,
    types: lookup.issueType ?? legacy.types,
    statuses: lookup.issueStatus ?? legacy.status,
    resolutions: lookup.resolutions ?? legacy.resolutions,
    fields: lookup.fields ?? legacy.columns,
  })

  // lookupList.fields was the "columns to fetch" set; columns was the ordered
  // subset that ended up in the export.
  const fetchFields = resolveFields(
    normalizeItems(lookup.fields ?? legacy.columns).map((item) => item.id),
  )
  const reportFields = resolveFields(
    normalizeItems(legacy.columns).map((item) => item.id),
  )

  return createProfile({
    name: raw.name ?? fallbackName ?? 'Imported profile',
    origin: JIRA_ORIGIN,
    available,
    selection: createSelection({
      filters: normalizeFilters({
        projects: legacy.projects,
        resolutions: legacy.resolutions,
        sprints: legacy.sprints,
        types: legacy.types,
        statuses: legacy.status,
      }),
      fetchFields,
      reportFields,
      resources: normalizeResources(legacy.users),
      orderBy: normalizeOrderBy(legacy.orderBy),
    }),
  })
}

export function normalizeProfile(raw) {
  const available = normalizeAvailable(raw.available)
  const selection = raw.selection ?? {}

  return createProfile({
    name: String(raw.name ?? 'Default'),
    origin: String(raw.origin ?? raw.jiraOrigin ?? JIRA_ORIGIN),
    available,
    selection: createSelection({
      filters: normalizeFilters(selection.filters),
      fetchFields: resolveFields(
        normalizeItems(selection.fetchFields).map((item) => item.id),
      ),
      reportFields: resolveFields(
        normalizeItems(selection.reportFields).map((item) => item.id),
      ),
      resources: normalizeResources(selection.resources),
      orderBy: normalizeOrderBy(selection.orderBy),
    }),
  })
}

export function parseProfile(raw, { fallbackName } = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Profile must be a JSON object.')
  }

  if (isLegacyProfile(raw)) return fromLegacy(raw, fallbackName)

  const version = Number(raw.schemaVersion ?? SCHEMA_VERSION)
  if (version > SCHEMA_VERSION) {
    throw new Error(
      `Profile schema v${version} is newer than this extension supports (v${SCHEMA_VERSION}).`,
    )
  }

  return normalizeProfile({ ...raw, name: raw.name ?? fallbackName })
}

export function toExport(profile) {
  return JSON.parse(
    JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      name: profile.name,
      origin: profile.origin,
      available: profile.available,
      selection: profile.selection,
    }),
  )
}
