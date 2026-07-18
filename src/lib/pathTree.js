// Split a paths object into a nested tree keyed by URL path segments.
//
// Input shape (visitedUrls / favorites):
//   paths = { '<pathname+search[+hash]>': PathValue, ... }
//
// Output:
//   {
//     name: 'mysite.com',   // hostname at root; last segment elsewhere
//     fullPath: '/',        // pathname from origin (no query/hash)
//     visit: PathValue|null,// set when THIS exact pathname has an entry
//     fullKey: '<key>'|null,// the paths[] key of the chosen entry
//     variantCount: 0,      // entries collapsed into this leaf
//     children: Map<string, Node>,
//   }
//
// Query/hash variants at the same pathname collapse to a single leaf; the
// newest variant wins for the link target (lastVisitedAt, else addedAt).

function pathnameOf(key) {
  let path = String(key ?? '')
  const hashIdx = path.indexOf('#')
  if (hashIdx !== -1) path = path.slice(0, hashIdx)
  const qIdx = path.indexOf('?')
  if (qIdx !== -1) path = path.slice(0, qIdx)
  return path || '/'
}

function entryTime(value) {
  return value?.lastVisitedAt ?? value?.addedAt ?? ''
}

export function buildTree(hostname, paths) {
  const root = {
    name: hostname,
    fullPath: '/',
    visit: null,
    fullKey: null,
    variantCount: 0,
    children: new Map(),
  }
  const entries =
    paths && typeof paths === 'object' && !Array.isArray(paths)
      ? Object.entries(paths)
      : []
  for (const [key, value] of entries) {
    const pathname = pathnameOf(key)
    const segments = pathname.split('/').filter(Boolean)
    let node = root
    for (const seg of segments) {
      let child = node.children.get(seg)
      if (!child) {
        const parentPath = node.fullPath === '/' ? '' : node.fullPath
        child = {
          name: seg,
          fullPath: `${parentPath}/${seg}`,
          visit: null,
          fullKey: null,
          variantCount: 0,
          children: new Map(),
        }
        node.children.set(seg, child)
      }
      node = child
    }
    node.variantCount += 1
    const prev = node.visit
    if (!prev || entryTime(value) > entryTime(prev)) {
      node.visit = value
      node.fullKey = key
    }
  }
  return root
}

export function sortedChildren(node) {
  return [...node.children.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

// Total number of distinct pathnames represented in the tree — matches the
// count you'd get by summing variantCount at every node.
export function countLeaves(root) {
  let n = 0
  const stack = [root]
  while (stack.length) {
    const node = stack.pop()
    n += node.variantCount
    for (const child of node.children.values()) stack.push(child)
  }
  return n
}
