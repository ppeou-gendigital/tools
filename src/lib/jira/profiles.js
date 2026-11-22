// Profile documents: the importable JSON that carries the current selection.
// Parsing is strict enough to reject junk and forgiving enough to read files
// exported by the previous CRA build. Option catalogs are never stored: every
// picker searches Jira live, and selected items carry their own labels.

import { JIRA_ORIGIN, SCHEMA_VERSION } from './config.js'
import { alignFieldOrder } from './fieldSelection.js'
import {
  DEFAULT_FETCH_FIELD_IDS,
  DEFAULT_REPORT_FIELD_IDS,
  ISSUE_FIELDS,
  resolveFields,
} from './fields.js'
import { emptyFilters, FILTER_KEYS, idsOf, itemsForIds, normalizeItems } from './filters.js'

export function createSelection(overrides = {}) {
  const { filters, ...rest } = overrides
  return {
    filters: { ...emptyFilters(), ...(filters ?? {}) },
    fetchFields: resolveFields(DEFAULT_FETCH_FIELD_IDS),
    reportFields: resolveFields(DEFAULT_REPORT_FIELD_IDS),
    resources: [],
    orderBy: [],
    ...rest,
  }
}

// Stable identity for a logical profile. It survives renames, re-syncs, and
// copies to another ticket, and is what the attachment file name is built on.
export function newProfileId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `profile-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`
}

export function createProfile(overrides = {}) {
  const now = new Date().toISOString()
  const createdAt = overrides.createdAt || now
  return {
    name: 'Default',
    origin: JIRA_ORIGIN,
    selection: createSelection(),
    ...overrides,
    schemaVersion: SCHEMA_VERSION,
    id: overrides.id || newProfileId(),
    createdAt,
    createdBy: overrides.createdBy ?? '',
    updatedAt: overrides.updatedAt || createdAt,
    updatedBy: overrides.updatedBy ?? overrides.createdBy ?? '',
  }
}

// A profile created from scratch starts with no fields selected. The default
// fetch/report fields stay as the fallback for imported documents that omit a
// selection.
export function createBlankProfile(overrides = {}) {
  return createProfile({
    ...overrides,
    selection: createSelection({ fetchFields: [], reportFields: [] }),
  })
}

// Only the legacy CRA export needs a catalog, and only to turn its bare ids
// into display names. The result is folded into `selection` and never stored.
function legacyCatalog(available = {}) {
  return {
    projects: normalizeItems(available.projects),
    types: normalizeItems(available.types),
    statuses: normalizeItems(available.statuses),
    resolutions: normalizeItems(available.resolutions),
    fields: normalizeItems(available.fields),
  }
}

// Pools only supply display names for ids that were stored bare; anything the
// selection already carries keeps its own name.
function normalizeFilters(filters = {}, pools = {}) {
  const base = emptyFilters()
  for (const key of FILTER_KEYS) {
    base[key] = itemsForIds(idsOf(filters[key]), filters[key], pools[key])
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

// Working configs live in storage on their own, so the same function is used
// when they are read back as when a profile document is imported.
export function normalizeSelection(selection = {}) {
  const fetchFields = itemsForIds(
    idsOf(selection.fetchFields),
    ISSUE_FIELDS,
    selection.fetchFields,
  )
  const reportFields = itemsForIds(
    idsOf(selection.reportFields),
    ISSUE_FIELDS,
    selection.reportFields,
  )

  return createSelection({
    filters: normalizeFilters(selection.filters),
    // The Fields column renders one list, so the fetched order must agree with
    // the report order (and contain every report column).
    fetchFields: alignFieldOrder(fetchFields, reportFields),
    reportFields,
    resources: normalizeResources(selection.resources),
    orderBy: normalizeOrderBy(selection.orderBy),
  })
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

  const catalog = legacyCatalog({
    projects: lookup.projects ?? legacy.projects,
    types: lookup.issueType ?? legacy.types,
    statuses: lookup.issueStatus ?? legacy.status,
    resolutions: lookup.resolutions ?? legacy.resolutions,
    fields: lookup.fields ?? legacy.columns,
  })

  // lookupList.fields was the "columns to fetch" set; columns was the ordered
  // subset that ended up in the export.
  const fetchFields = itemsForIds(
    idsOf(lookup.fields ?? legacy.columns),
    ISSUE_FIELDS,
    lookup.fields ?? legacy.columns,
    catalog.fields,
  )
  const reportFields = itemsForIds(
    idsOf(legacy.columns),
    ISSUE_FIELDS,
    legacy.columns,
    catalog.fields,
  )

  return createProfile({
    name: raw.name ?? fallbackName ?? 'Imported profile',
    origin: JIRA_ORIGIN,
    selection: createSelection({
      filters: normalizeFilters(
        {
          projects: legacy.projects,
          resolutions: legacy.resolutions,
          sprints: legacy.sprints,
          types: legacy.types,
          statuses: legacy.status,
        },
        catalog,
      ),
      fetchFields,
      reportFields,
      resources: normalizeResources(legacy.users),
      orderBy: normalizeOrderBy(legacy.orderBy),
    }),
  })
}

export function normalizeProfile(raw) {
  const selection = raw.selection ?? {}

  return createProfile({
    id: raw.id,
    name: String(raw.name ?? 'Default'),
    origin: String(raw.origin ?? raw.jiraOrigin ?? JIRA_ORIGIN),
    createdAt: raw.createdAt,
    createdBy: raw.createdBy,
    updatedAt: raw.updatedAt,
    updatedBy: raw.updatedBy,
    selection: normalizeSelection(selection),
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
      id: profile.id,
      name: profile.name,
      origin: profile.origin,
      createdAt: profile.createdAt,
      createdBy: profile.createdBy,
      updatedAt: profile.updatedAt,
      updatedBy: profile.updatedBy,
      selection: profile.selection,
    }),
  )
}
