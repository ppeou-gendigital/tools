import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Globe } from 'lucide-react'
import { FavStar } from '@/patterns/FavStar'
import {
  buildTree,
  compressPathNode,
  countLeaves,
  sortedChildren,
} from '@/lib/pathTree'
import { cx } from '@/lib/cx'
import styles from './PathTree.module.scss'

// Recursive tree row. Depth drives indent via a CSS var.
//
// Empty single-child chains (no visit/link) are compressed into one
// label like GitHub's file tree — `:x:/r/personal` instead of three
// nested rows. Collapse / link / FavStar all bind to the chain tip.
//
// labelMode:
//   - segment: path segment + optional visit title + FavStar (Site Tree)
//   - displayName: leaf shows saved title only; no FavStar / variant badge
function TreeNode({
  node,
  origin,
  depth,
  collapsed,
  onToggle,
  labelMode = 'segment',
}) {
  const { tip, displayName, parts } = useMemo(
    () => compressPathNode(node),
    [node],
  )
  const hasChildren = tip.children.size > 0
  const isCollapsed = hasChildren && collapsed.has(tip.fullPath)
  const clickable = !!tip.visit
  const title = tip.visit?.title
  const href = clickable ? `${origin}${tip.fullKey ?? tip.fullPath}` : null
  const isDisplayName = labelMode === 'displayName'
  const primaryLabel = isDisplayName
    ? clickable
      ? title?.trim() || '(untitled)'
      : displayName
    : displayName

  return (
    <>
      <div
        className={cx(styles.treeRow, isDisplayName && styles.treeRowDisplayName)}
        style={{ '--tree-depth': depth }}
      >
        {hasChildren ? (
          <button
            type="button"
            className={styles.chevronBtn}
            onClick={() => onToggle(tip.fullPath)}
            aria-expanded={!isCollapsed}
            aria-label={
              isCollapsed ? `Expand ${primaryLabel}` : `Collapse ${primaryLabel}`
            }
          >
            {isCollapsed ? (
              <ChevronRight size={14} aria-hidden="true" />
            ) : (
              <ChevronDown size={14} aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className={styles.chevronSpacer} aria-hidden="true" />
        )}

        {clickable ? (
          <a
            className={styles.treeLink}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={isDisplayName ? href : title || href}
          >
            {isDisplayName ? (
              <span className={cx(styles.treeName, styles.treeNameDisplay)}>
                {primaryLabel}
              </span>
            ) : (
              <CompressedName parts={parts} title={title} />
            )}
          </a>
        ) : (
          <span className={styles.treePlain}>
            {isDisplayName ? (
              <span className={cx(styles.treeName, styles.treeNameDisplay)}>
                {primaryLabel}
              </span>
            ) : (
              <CompressedName parts={parts} />
            )}
          </span>
        )}

        {!isDisplayName && tip.variantCount > 1 && (
          <span
            className={styles.variantBadge}
            title={`${tip.variantCount} query-string variants`}
          >
            ×{tip.variantCount}
          </span>
        )}

        {!isDisplayName &&
          (clickable ? (
            <FavStar
              url={href}
              title={title ?? ''}
              className={styles.treeFav}
            />
          ) : (
            <span className={styles.treeFavSpacer} aria-hidden="true" />
          ))}
      </div>

      {hasChildren && !isCollapsed && (
        <div className={styles.children}>
          {sortedChildren(tip).map((child) => (
            <TreeNode
              key={child.fullPath}
              node={child}
              origin={origin}
              depth={depth + 1}
              collapsed={collapsed}
              onToggle={onToggle}
              labelMode={labelMode}
            />
          ))}
        </div>
      )}
    </>
  )
}

// Render `a/b/c` with muted separators so compressed chains read like
// GitHub's tree, while a single segment stays a plain name.
function CompressedName({ parts, title }) {
  return (
    <>
      <span className={styles.treeName} title={parts.join('/')}>
        {parts.map((part, i) => (
          <span key={`${i}:${part}`}>
            {i > 0 && (
              <span className={styles.pathSep} aria-hidden="true">
                /
              </span>
            )}
            {part}
          </span>
        ))}
      </span>
      {title && <span className={styles.treeTitle}>{title}</span>}
    </>
  )
}

// One site's tree with collapse state scoped per mount (per hostname slide).
export function PathTreeSlide({
  hostname,
  label,
  origin,
  paths,
  labelMode = 'segment',
  countNoun = 'page',
  emptyMessage,
  headIcon: HeadIcon = Globe,
}) {
  const [collapsed, setCollapsed] = useState(() => new Set())

  const tree = useMemo(
    () => buildTree(hostname, paths),
    [hostname, paths],
  )
  const pathCount = tree ? countLeaves(tree) : 0
  const plural =
    pathCount === 1 ? countNoun : countNoun.endsWith('s') ? countNoun : `${countNoun}s`

  function onToggle(fullPath) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(fullPath)) next.delete(fullPath)
      else next.add(fullPath)
      return next
    })
  }

  return (
    <div className={styles.slideBody}>
      <div className={styles.slideHead}>
        <HeadIcon
          size={14}
          aria-hidden="true"
          className={styles.slideHeadIcon}
        />
        <div className={styles.slideHeadText}>
          <span className={styles.slideLabel}>{label}</span>
          <span className={styles.slideHost}>{hostname}</span>
        </div>
        <span className={styles.slideCount}>
          {pathCount === 1 ? `1 ${countNoun}` : `${pathCount} ${plural}`}
        </span>
      </div>
      <div className={styles.slideScroll}>
        {pathCount === 0 ? (
          <p className={cx(styles.muted, styles.emptyTree)}>
            {emptyMessage ?? (
              <>
                No pages captured for this site yet. Open a tab on{' '}
                <code>{hostname}</code> and it will show up here.
              </>
            )}
          </p>
        ) : (
          <TreeNode
            node={tree}
            origin={origin}
            depth={0}
            collapsed={collapsed}
            onToggle={onToggle}
            labelMode={labelMode}
          />
        )}
      </div>
    </div>
  )
}

// Multi-domain favorites tree for Landing slide 2. Domains render in the
// caller-provided order; each group has its own collapse state via a nested
// PathTreeBody so expanding one domain doesn't affect another.
export function FavLinksTreeSlide({ groups }) {
  const totalCount = groups.reduce((n, g) => n + g.count, 0)
  const isEmpty = groups.length === 0

  return (
    <div className={styles.slideBody}>
      <div className={styles.slideHead}>
        <Globe size={14} aria-hidden="true" className={styles.slideHeadIcon} />
        <div className={styles.slideHeadText}>
          <span className={styles.slideLabel}>Fav links</span>
          <span className={styles.slideHost}>
            {isEmpty
              ? 'no favorites yet'
              : `${groups.length} ${groups.length === 1 ? 'domain' : 'domains'}`}
          </span>
        </div>
        {!isEmpty && (
          <span className={styles.slideCount}>
            {totalCount === 1 ? '1 link' : `${totalCount} links`}
          </span>
        )}
      </div>
      <div className={styles.slideScroll}>
        {isEmpty ? (
          <p className={cx(styles.muted, styles.emptyTree)}>
            No favorites yet. Star a URL from the toolbar or Fav links page
            and it will show up here.
          </p>
        ) : (
          groups.map((group) => (
            <DomainTreeGroup key={group.hostname} group={group} />
          ))
        )}
      </div>
    </div>
  )
}

function DomainTreeGroup({ group }) {
  const [collapsed, setCollapsed] = useState(() => new Set())
  const tree = useMemo(
    () => buildTree(group.hostname, group.paths),
    [group.hostname, group.paths],
  )

  function onToggle(fullPath) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(fullPath)) next.delete(fullPath)
      else next.add(fullPath)
      return next
    })
  }

  return (
    <div className={styles.domainGroup}>
      <div className={styles.domainHead}>
        <span className={styles.domainLabel}>{group.label}</span>
        <span className={styles.domainHost}>{group.hostname}</span>
      </div>
      <TreeNode
        node={tree}
        origin={group.origin}
        depth={0}
        collapsed={collapsed}
        onToggle={onToggle}
        labelMode="displayName"
      />
    </div>
  )
}
