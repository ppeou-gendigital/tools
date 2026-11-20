import { buildContext } from './context.js'
import groups from './groups.js'
import rules from './rules.js'

const groupIds = new Set(groups.map((group) => group.id))

function disabledReasonFor(rule, ctx) {
  if (typeof rule.reason === 'function') return rule.reason(ctx)
  if (!ctx.isAem) return 'Not an AEM page'
  if (ctx.isDam) return 'Not available for DAM assets'
  return 'Not applicable to this URL'
}

// Pure: URL in, ordered groups out. Chrome APIs stay in the UI layer.
export function buildAemLinkGroups(input, options = {}) {
  const ctx = buildContext(input, options)

  const buckets = groups.map((group) => ({ ...group, links: [] }))
  const byId = new Map(buckets.map((group) => [group.id, group]))

  for (const rule of rules) {
    const group = byId.get(rule.group)
    if (!group) {
      throw new Error(`Unknown group "${rule.group}" for rule "${rule.id}"`)
    }

    const href = rule.build(ctx) || null

    // Every rule is always emitted. A null href means "not applicable for
    // this URL"; the popup renders it as a disabled button so the layout and
    // link placement stay stable.
    group.links.push({
      id: rule.id,
      label: rule.label,
      description: rule.description,
      icon: rule.icon,
      shortcut: rule.shortcut,
      href,
      disabledReason: href ? null : disabledReasonFor(rule, ctx),
    })
  }

  return {
    parsed: ctx,
    groups: buckets,
  }
}

// Dev/test helper: catch duplicate ids and unknown groups at load time.
export function validateRegistry() {
  const seen = new Set()
  const shortcuts = new Map()
  for (const rule of rules) {
    if (seen.has(rule.id)) throw new Error(`Duplicate rule id "${rule.id}"`)
    seen.add(rule.id)
    if (!groupIds.has(rule.group)) {
      throw new Error(`Rule "${rule.id}" targets unknown group "${rule.group}"`)
    }
    if (typeof rule.build !== 'function') {
      throw new Error(`Rule "${rule.id}" is missing build(ctx)`)
    }
    if (typeof rule.icon !== 'string' || !rule.icon) {
      throw new Error(`Rule "${rule.id}" is missing an icon`)
    }
    if (rule.shortcut !== undefined) {
      if (!/^[a-z]$/.test(rule.shortcut)) {
        throw new Error(`Rule "${rule.id}" has an invalid shortcut`)
      }
      if (shortcuts.has(rule.shortcut)) {
        throw new Error(
          `Rules "${shortcuts.get(rule.shortcut)}" and "${rule.id}" share the shortcut "${rule.shortcut}"`,
        )
      }
      shortcuts.set(rule.shortcut, rule.id)
    }
  }
  return true
}
