import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAemLinkGroups, validateRegistry } from './registry.js'

const PAGE =
  'https://author.example.com/editor.html/content/mysite/us/en/page.html?foo=bar'
const DAM = 'https://author.example.com/assets.html/content/dam/mysite/logo.png'
const CLOUD =
  'https://author-p123-e456.adobeaemcloud.com/ui#/aem/editor.html/content/mysite/us/en/page.html?foo=bar'
const UE =
  'https://author-p123-e456.adobeaemcloud.com/ui#/@org123/aem/universal-editor/canvas/author-p123-e456.adobeaemcloud.com/content/mysite/us/en/page.html'
const NOW = 1730000000000

function hrefFor(result, id) {
  for (const group of result.groups) {
    const link = group.links.find((entry) => entry.id === id)
    if (link) return link.href
  }
  return null
}

function linkIds(result, groupId) {
  const group = result.groups.find((entry) => entry.id === groupId)
  return group ? group.links.map((link) => link.id) : []
}

test('registry has unique ids, known groups, and build functions', () => {
  assert.equal(validateRegistry(), true)
})

test('traditional editor URL becomes every page destination', () => {
  const result = buildAemLinkGroups(PAGE)

  assert.equal(result.parsed.flavor, 'traditional')
  assert.equal(result.parsed.resourcePath, '/content/mysite/us/en/page')
  assert.equal(result.parsed.siteName, 'mysite')
  assert.equal(result.parsed.isDam, false)
  assert.equal(result.parsed.mode, 'edit')
  assert.equal(result.parsed.params, 'foo=bar')

  assert.equal(
    hrefFor(result, 'edit'),
    'https://author.example.com/editor.html/content/mysite/us/en/page.html?foo=bar',
  )
  assert.equal(
    hrefFor(result, 'preview'),
    'https://author.example.com/content/mysite/us/en/page.html?foo=bar',
  )
  assert.equal(
    hrefFor(result, 'disabled'),
    'https://author.example.com/content/mysite/us/en/page.html?foo=bar&wcmmode=disabled',
  )
  assert.equal(
    hrefFor(result, 'properties'),
    'https://author.example.com/mnt/overlay/wcm/core/content/sites/properties.html?item=%2Fcontent%2Fmysite%2Fus%2Fen%2Fpage',
  )
  assert.equal(
    hrefFor(result, 'sites'),
    'https://author.example.com/sites.html/content/mysite/us/en/page',
  )
  assert.equal(
    hrefFor(result, 'sitesRoot'),
    'https://author.example.com/sites.html/content/mysite',
  )
  assert.equal(
    hrefFor(result, 'templatesConsole'),
    'https://author.example.com/libs/wcm/core/content/sites/templates.html/conf/mysite',
  )
  assert.equal(
    hrefFor(result, 'crx'),
    'https://author.example.com/crx/de/index.jsp#/content/mysite/us/en/page',
  )
  assert.equal(hrefFor(result, 'universalEditor'), null)
})

test('groups and links keep declaration order', () => {
  const result = buildAemLinkGroups(PAGE)

  assert.deepEqual(
    result.groups.map((group) => group.id),
    ['page', 'manage', 'developer', 'consoles', 'components'],
  )
  assert.deepEqual(linkIds(result, 'page'), [
    'edit',
    'universalEditor',
    'preview',
    'disabled',
    'abTesting',
    'cacheBust',
    'pageJson',
  ])
  assert.deepEqual(linkIds(result, 'manage'), [
    'properties',
    'versions',
    'livecopy',
    'publish',
  ])
})

test('dam asset disables page links and exposes asset links', () => {
  const result = buildAemLinkGroups(DAM)

  assert.equal(result.parsed.isDam, true)
  assert.equal(result.parsed.siteName, 'mysite')

  // Inapplicable rules stay in place, just without an href.
  assert.deepEqual(linkIds(result, 'page'), [
    'edit',
    'universalEditor',
    'preview',
    'disabled',
    'abTesting',
    'cacheBust',
    'pageJson',
  ])

  assert.equal(
    hrefFor(result, 'assets'),
    'https://author.example.com/assets.html/content/dam/mysite/logo.png',
  )
  assert.equal(
    hrefFor(result, 'assetDetails'),
    'https://author.example.com/assetdetails.html/content/dam/mysite/logo.png',
  )
  assert.equal(
    hrefFor(result, 'damRoot'),
    'https://author.example.com/assets.html/content/dam/mysite',
  )
  assert.equal(
    hrefFor(result, 'assetJson'),
    'https://author.example.com/content/dam/mysite/logo.png.json',
  )
  assert.equal(hrefFor(result, 'edit'), null)
  assert.equal(hrefFor(result, 'disabled'), null)
  assert.equal(hrefFor(result, 'properties'), null)
  assert.equal(hrefFor(result, 'templatesConsole'), null)

  const pageGroup = result.groups.find((group) => group.id === 'page')
  assert.equal(
    pageGroup.links.find((link) => link.id === 'edit').disabledReason,
    'Not available for DAM assets',
  )
})

test('disabled preview input reports the disabled mode', () => {
  const result = buildAemLinkGroups(
    'https://author.example.com/content/mysite/us/en/page.html?wcmmode=disabled',
  )

  assert.equal(result.parsed.mode, 'disabled')
  assert.equal(result.parsed.params, '')
  assert.equal(
    hrefFor(result, 'edit'),
    'https://author.example.com/editor.html/content/mysite/us/en/page.html',
  )
  assert.equal(
    hrefFor(result, 'disabled'),
    'https://author.example.com/content/mysite/us/en/page.html?wcmmode=disabled',
  )
})

test('A/B testing link forces mboxDisable=1 on the rendered page', () => {
  const result = buildAemLinkGroups(PAGE)

  assert.equal(
    hrefFor(result, 'abTesting'),
    'https://author.example.com/content/mysite/us/en/page.html?foo=bar&mboxDisable=1',
  )
})

test('A/B testing link is idempotent when already disabled', () => {
  const result = buildAemLinkGroups(
    'https://author.example.com/content/mysite/us/en/page.html?mboxDisable=1',
  )

  assert.equal(
    hrefFor(result, 'abTesting'),
    'https://author.example.com/content/mysite/us/en/page.html?mboxDisable=1',
  )
})

test('A/B testing link keeps disabled mode', () => {
  const result = buildAemLinkGroups(
    'https://author.example.com/content/mysite/us/en/page.html?wcmmode=disabled',
  )

  assert.equal(
    hrefFor(result, 'abTesting'),
    'https://author.example.com/content/mysite/us/en/page.html?mboxDisable=1&wcmmode=disabled',
  )
})

test('A/B testing link is disabled for DAM assets', () => {
  const result = buildAemLinkGroups(DAM)

  assert.ok(linkIds(result, 'page').includes('abTesting'))
  assert.equal(hrefFor(result, 'abTesting'), null)
})

test('cache-bust appends _random_ in place', () => {
  const result = buildAemLinkGroups(PAGE, { now: NOW })

  assert.equal(
    hrefFor(result, 'cacheBust'),
    'https://author.example.com/editor.html/content/mysite/us/en/page.html?foo=bar&_random_=1730000000000',
  )
})

test('cache-bust writes inside cloud shell fragments', () => {
  const result = buildAemLinkGroups(CLOUD, { now: NOW })

  assert.equal(
    hrefFor(result, 'cacheBust'),
    'https://author-p123-e456.adobeaemcloud.com/ui#/aem/editor.html/content/mysite/us/en/page.html?foo=bar&_random_=1730000000000',
  )
})

test('cache-bust works on DAM assets and replaces an existing param', () => {
  const dam = buildAemLinkGroups(DAM, { now: NOW })
  assert.equal(
    hrefFor(dam, 'cacheBust'),
    'https://author.example.com/assets.html/content/dam/mysite/logo.png?_random_=1730000000000',
  )

  const repeated = buildAemLinkGroups(
    'https://author.example.com/editor.html/content/mysite/us/en/page.html?_random_=old',
    { now: NOW },
  )
  assert.equal(
    hrefFor(repeated, 'cacheBust'),
    'https://author.example.com/editor.html/content/mysite/us/en/page.html?_random_=1730000000000',
  )
})

test('cache-bust is disabled for non-AEM URLs', () => {
  const result = buildAemLinkGroups('https://example.com/foo', { now: NOW })

  assert.ok(linkIds(result, 'page').includes('cacheBust'))
  assert.equal(hrefFor(result, 'cacheBust'), null)
})

test('cloud shell URLs get /ui#/aem prefixes', () => {
  const result = buildAemLinkGroups(CLOUD)

  assert.equal(result.parsed.flavor, 'cloud')
  assert.equal(result.parsed.shell, '/ui#/aem')
  assert.equal(result.parsed.resourcePath, '/content/mysite/us/en/page')

  assert.equal(
    hrefFor(result, 'edit'),
    'https://author-p123-e456.adobeaemcloud.com/ui#/aem/editor.html/content/mysite/us/en/page.html?foo=bar',
  )
  assert.equal(
    hrefFor(result, 'sites'),
    'https://author-p123-e456.adobeaemcloud.com/ui#/aem/sites.html/content/mysite/us/en/page',
  )
  assert.equal(hrefFor(result, 'systemConsole'), null)
  const developer = result.groups.find((group) => group.id === 'developer')
  assert.equal(
    developer.links.find((link) => link.id === 'systemConsole').disabledReason,
    'Only available on AEM 6.5 / AMS',
  )
})

test('universal editor fragments round-trip', () => {
  const result = buildAemLinkGroups(UE)

  assert.equal(result.parsed.flavor, 'ue')
  assert.equal(result.parsed.mode, 'edit')
  assert.equal(result.parsed.imsOrg, 'org123')
  assert.equal(
    result.parsed.ueHost,
    'author-p123-e456.adobeaemcloud.com',
  )
  assert.equal(
    hrefFor(result, 'universalEditor'),
    'https://author-p123-e456.adobeaemcloud.com/ui#/@org123/aem/universal-editor/canvas/author-p123-e456.adobeaemcloud.com/content/mysite/us/en/page.html',
  )
  assert.equal(
    hrefFor(result, 'edit'),
    'https://author-p123-e456.adobeaemcloud.com/ui#/aem/editor.html/content/mysite/us/en/page.html',
  )

  const cached = buildAemLinkGroups(UE, { now: NOW })
  assert.equal(
    hrefFor(cached, 'cacheBust'),
    'https://author-p123-e456.adobeaemcloud.com/ui#/@org123/aem/universal-editor/canvas/author-p123-e456.adobeaemcloud.com/content/mysite/us/en/page.html?_random_=1730000000000',
  )
})

test('site roots do not become page edit links', () => {
  const result = buildAemLinkGroups(
    'https://author.example.com/sites.html/content/mysite',
  )

  assert.equal(result.parsed.siteName, 'mysite')
  assert.equal(hrefFor(result, 'sitesRoot'), 'https://author.example.com/sites.html/content/mysite')
  assert.equal(hrefFor(result, 'edit'), null)
  assert.equal(
    hrefFor(result, 'templatesConsole'),
    'https://author.example.com/libs/wcm/core/content/sites/templates.html/conf/mysite',
  )
})

test('non-AEM URLs keep every group and disable every link', () => {
  const result = buildAemLinkGroups('https://example.com/foo?bar=1')

  assert.equal(result.parsed.isAem, false)
  assert.deepEqual(
    result.groups.map((group) => group.id),
    ['page', 'manage', 'developer', 'consoles', 'components'],
  )

  const links = result.groups.flatMap((group) => group.links)
  assert.ok(links.length > 0)
  assert.ok(links.every((link) => link.href === null))
  const pageGroup = result.groups.find((group) => group.id === 'page')
  assert.equal(
    pageGroup.links.find((link) => link.id === 'edit').disabledReason,
    'Not an AEM page',
  )
})

test('every rule is present for every URL', () => {
  const expected = buildAemLinkGroups(PAGE)
    .groups.flatMap((group) => group.links.map((link) => `${group.id}:${link.id}`))
    .sort()

  for (const input of [PAGE, DAM, CLOUD, UE, 'https://example.com/foo']) {
    const actual = buildAemLinkGroups(input)
      .groups.flatMap((group) => group.links.map((link) => `${group.id}:${link.id}`))
      .sort()
    assert.deepEqual(actual, expected)
  }
})

test('every generated href is an absolute URL', () => {
  for (const input of [PAGE, DAM, CLOUD, UE]) {
    const result = buildAemLinkGroups(input)
    for (const group of result.groups) {
      for (const link of group.links) {
        if (!link.href) continue
        assert.doesNotThrow(
          () => new URL(link.href),
          `${link.id} produced ${link.href}`,
        )
      }
    }
  }
})

test('console and developer groups include the added destinations', () => {
  const result = buildAemLinkGroups(PAGE)

  assert.deepEqual(linkIds(result, 'consoles'), [
    'sites',
    'sitesRoot',
    'assets',
    'assetDetails',
    'damRoot',
    'assetJson',
    'experienceFragments',
    'projects',
  ])
  assert.deepEqual(linkIds(result, 'developer'), [
    'crx',
    'crxExplorer',
    'packmgr',
    'debugClientLibs',
    'bundles',
    'osgiConfig',
    'jmx',
    'logs',
    'replicationAgents',
    'treeActivation',
    'tags',
    'queryBuilder',
    'workflowConsole',
    'users',
    'systemConsole',
  ])
})

test('added links build traditional URLs', () => {
  const result = buildAemLinkGroups(PAGE)

  assert.equal(
    hrefFor(result, 'projects'),
    'https://author.example.com/projects.html',
  )
  assert.equal(
    hrefFor(result, 'debugClientLibs'),
    'https://author.example.com/libs/granite/ui/content/dumplibs.html',
  )
  assert.equal(
    hrefFor(result, 'crxExplorer'),
    'https://author.example.com/crx/explorer/index.jsp',
  )
  assert.equal(
    hrefFor(result, 'bundles'),
    'https://author.example.com/system/console/bundles',
  )
  assert.equal(
    hrefFor(result, 'jmx'),
    'https://author.example.com/system/console/jmx',
  )
  assert.equal(
    hrefFor(result, 'replicationAgents'),
    'https://author.example.com/etc/replication/agents.author.html',
  )
  assert.equal(
    hrefFor(result, 'treeActivation'),
    'https://author.example.com/etc/replication/treeactivation.html',
  )
  assert.equal(
    hrefFor(result, 'tags'),
    'https://author.example.com/libs/cq/tagging/content/tagadmin.html',
  )
})

test('cloud URLs disable the 6.5-only admin tools', () => {
  const result = buildAemLinkGroups(CLOUD)
  const developer = result.groups.find((group) => group.id === 'developer')

  for (const id of [
    'bundles',
    'jmx',
    'replicationAgents',
    'treeActivation',
    'systemConsole',
    'logs',
    'osgiConfig',
  ]) {
    assert.equal(hrefFor(result, id), null, `${id} should be disabled`)
    assert.equal(
      developer.links.find((link) => link.id === id).disabledReason,
      'Only available on AEM 6.5 / AMS',
    )
  }

  assert.equal(
    hrefFor(result, 'projects'),
    'https://author-p123-e456.adobeaemcloud.com/ui#/aem/projects.html',
  )
  assert.equal(
    hrefFor(result, 'debugClientLibs'),
    'https://author-p123-e456.adobeaemcloud.com/libs/granite/ui/content/dumplibs.html',
  )
  assert.equal(
    hrefFor(result, 'crxExplorer'),
    'https://author-p123-e456.adobeaemcloud.com/crx/explorer/index.jsp',
  )
  assert.equal(
    hrefFor(result, 'tags'),
    'https://author-p123-e456.adobeaemcloud.com/libs/cq/tagging/content/tagadmin.html',
  )
})

test('shortcuts are unique and exposed on links', () => {
  const result = buildAemLinkGroups(PAGE)
  const links = result.groups.flatMap((group) => group.links)
  const shortcuts = links
    .map((link) => link.shortcut)
    .filter((shortcut) => shortcut !== undefined)

  assert.equal(new Set(shortcuts).size, shortcuts.length)
  assert.equal(shortcuts.length, 15)
  assert.equal(links.find((link) => link.id === 'edit').shortcut, 'e')
  assert.equal(links.find((link) => link.id === 'properties').shortcut, 'p')
  assert.equal(links.find((link) => link.id === 'disabled').shortcut, 'd')
})
