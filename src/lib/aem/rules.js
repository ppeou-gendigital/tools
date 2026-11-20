// Ordered rule registry. Array index sets the order inside each group.
//
// A rule is: { id, group, label, icon, description?, reason?, build(ctx) -> href | null }
//   - `group` must match an id in groups.js.
//   - `icon` is a key from icons.js.
//   - `build` is the single source of truth for applicability: return null
//     when the link does not make sense for the current URL.
//   - `reason(ctx)` optionally explains why a link is disabled.

import {
  aemOnly,
  damOnly,
  hasSite,
  pageOnly,
  traditionalOnly,
} from './guards.js'
import { withParam } from './context.js'

export default [
  /* ------------------------------- Page ------------------------------- */
  {
    id: 'edit',
    group: 'page',
    label: 'Edit',
    icon: 'pencil',
    shortcut: 'e',
    description: 'Open the page in the editor',
    build: (ctx) =>
      pageOnly(ctx)
        ? `${ctx.origin}${ctx.shell}/editor.html${ctx.path}.html${ctx.q}${ctx.h}`
        : null,
  },
  {
    id: 'universalEditor',
    group: 'page',
    label: 'Universal Editor',
    icon: 'wand',
    description: 'Edit in Universal Editor',
    reason: (ctx) =>
      ctx.originIsCloud
        ? 'Only available while editing a Cloud page with an IMS org'
        : 'Only available on AEM Cloud',
    build: (ctx) =>
      pageOnly(ctx) && ctx.originIsCloud && ctx.imsOrg && ctx.ueHost
        ? `${ctx.origin}/ui#/@${ctx.imsOrg}/aem/universal-editor/canvas/${ctx.ueHost}${ctx.path}.html`
        : null,
  },
  {
    id: 'preview',
    group: 'page',
    label: 'Preview',
    icon: 'eye',
    description: 'Rendered page without the editor',
    build: (ctx) =>
      pageOnly(ctx) ? `${ctx.origin}${ctx.path}.html${ctx.q}${ctx.h}` : null,
  },
  {
    id: 'disabled',
    group: 'page',
    label: 'Disabled mode',
    icon: 'eyeOff',
    shortcut: 'd',
    description: 'Rendered page with wcmmode=disabled',
    build: (ctx) =>
      pageOnly(ctx) ? `${ctx.origin}${ctx.path}.html${ctx.disableQ}${ctx.h}` : null,
  },
  {
    id: 'abTesting',
    group: 'page',
    label: 'Disable A/B testing',
    icon: 'flask',
    description: 'Add mboxDisable=1 to the rendered page',
    build: (ctx) => {
      if (!pageOnly(ctx)) return null

      const params = new URLSearchParams(ctx.params)
      params.set('mboxDisable', '1')
      if (ctx.mode === 'disabled') params.set('wcmmode', 'disabled')

      return `${ctx.origin}${ctx.path}.html?${params.toString()}${ctx.h}`
    },
  },
  {
    id: 'cacheBust',
    group: 'page',
    label: 'Bust page cache',
    icon: 'refresh',
    description: 'Append a _random_ param to the current URL',
    build: (ctx) =>
      aemOnly(ctx)
        ? withParam(ctx.url, '_random_', String(ctx.now))
        : null,
  },
  {
    id: 'pageJson',
    group: 'page',
    label: 'Page JSON',
    icon: 'braces',
    description: 'Full content tree as JSON',
    build: (ctx) =>
      pageOnly(ctx) ? `${ctx.origin}${ctx.path}.infinity.json` : null,
  },

  /* -------------------------- Page management -------------------------- */
  {
    id: 'properties',
    group: 'manage',
    label: 'Page Properties',
    icon: 'adjustments',
    shortcut: 'p',
    description: 'Open the page properties dialog',
    build: (ctx) =>
      pageOnly(ctx)
        ? `${ctx.origin}${ctx.shell}/mnt/overlay/wcm/core/content/sites/properties.html?item=${ctx.item}`
        : null,
  },
  {
    id: 'versions',
    group: 'manage',
    label: 'Versions',
    icon: 'history',
    description: 'View and restore page versions',
    build: (ctx) =>
      pageOnly(ctx)
        ? `${ctx.origin}${ctx.shell}/mnt/overlay/wcm/core/content/sites/versions.html?item=${ctx.item}`
        : null,
  },
  {
    id: 'livecopy',
    group: 'manage',
    label: 'Live Copy',
    icon: 'copy',
    description: 'MSM live copy status',
    build: (ctx) =>
      pageOnly(ctx)
        ? `${ctx.origin}${ctx.shell}/mnt/overlay/wcm/core/content/sites/livecopy.html?item=${ctx.item}`
        : null,
  },
  {
    id: 'publish',
    group: 'manage',
    label: 'Manage Publication',
    icon: 'send',
    description: 'Open the publish wizard',
    build: (ctx) =>
      pageOnly(ctx)
        ? `${ctx.origin}${ctx.shell}/mnt/overlay/wcm/core/content/sites/publishpagewizard.html?item=${ctx.item}`
        : null,
  },

  /* ----------------------------- Consoles ----------------------------- */
  {
    id: 'sites',
    group: 'consoles',
    label: 'Sites console',
    icon: 'layoutGrid',
    shortcut: 's',
    description: 'Open this page in the Sites console',
    build: (ctx) =>
      pageOnly(ctx) ? `${ctx.origin}${ctx.shell}/sites.html${ctx.path}` : null,
  },
  {
    id: 'sitesRoot',
    group: 'consoles',
    label: 'Site root',
    icon: 'folder',
    description: 'Open the site in the Sites console',
    build: (ctx) =>
      hasSite(ctx) && !ctx.isDam
        ? `${ctx.origin}${ctx.shell}/sites.html/content/${ctx.siteName}`
        : null,
  },
  {
    id: 'assets',
    group: 'consoles',
    label: 'Assets console',
    icon: 'photo',
    shortcut: 'a',
    description: 'Open this asset in the Assets console',
    reason: (ctx) =>
      ctx.isAem ? 'Only available on DAM assets' : 'Not an AEM page',
    build: (ctx) =>
      damOnly(ctx) ? `${ctx.origin}${ctx.shell}/assets.html${ctx.path}` : null,
  },
  {
    id: 'assetDetails',
    group: 'consoles',
    label: 'Asset details',
    icon: 'fileInfo',
    description: 'Open the asset details view',
    reason: (ctx) =>
      ctx.isAem ? 'Only available on DAM assets' : 'Not an AEM page',
    build: (ctx) =>
      damOnly(ctx)
        ? `${ctx.origin}${ctx.shell}/assetdetails.html${ctx.path}`
        : null,
  },
  {
    id: 'damRoot',
    group: 'consoles',
    label: 'DAM root',
    icon: 'database',
    description: 'Open the site folder under /content/dam',
    build: (ctx) =>
      ctx.isAem && ctx.hasResource
        ? `${ctx.origin}${ctx.shell}/assets.html/content/dam${
            ctx.siteName ? `/${ctx.siteName}` : ''
          }`
        : null,
  },
  {
    id: 'assetJson',
    group: 'consoles',
    label: 'Asset JSON',
    icon: 'fileCode',
    description: 'Asset metadata as JSON',
    reason: (ctx) =>
      ctx.isAem ? 'Only available on DAM assets' : 'Not an AEM page',
    build: (ctx) =>
      damOnly(ctx) ? `${ctx.origin}${ctx.path}.json` : null,
  },
  {
    id: 'experienceFragments',
    group: 'consoles',
    label: 'Experience Fragments',
    icon: 'puzzle',
    description: 'Open the XF console for this site',
    build: (ctx) =>
      hasSite(ctx) && !ctx.isDam
        ? `${ctx.origin}${ctx.shell}/aem/experience-fragments.html/content/experience-fragments/${ctx.siteName}`
        : null,
  },
  {
    id: 'projects',
    group: 'consoles',
    label: 'Projects console',
    icon: 'folders',
    description: 'Open the AEM Projects console',
    build: (ctx) =>
      aemOnly(ctx) ? `${ctx.origin}${ctx.shell}/projects.html` : null,
  },

  /* ---------------------- Components & templates ---------------------- */
  {
    id: 'componentsConsole',
    group: 'components',
    label: 'Components console',
    icon: 'components',
    description: 'Browse component definitions and usage',
    build: (ctx) =>
      aemOnly(ctx)
        ? `${ctx.origin}${ctx.shell}/libs/wcm/core/content/sites/components.html`
        : null,
  },
  {
    id: 'templatesConsole',
    group: 'components',
    label: 'Editable Templates',
    icon: 'template',
    description: 'Open the template console for this site',
    build: (ctx) =>
      hasSite(ctx) && !ctx.isDam
        ? `${ctx.origin}${ctx.shell}/libs/wcm/core/content/sites/templates.html/conf/${ctx.siteName}`
        : null,
  },

  /* --------------------------- Developer tools --------------------------- */
  {
    id: 'crx',
    group: 'developer',
    label: 'CRX/DE',
    icon: 'code',
    shortcut: 'c',
    description: 'Open this path in CRXDE Lite',
    build: (ctx) =>
      aemOnly(ctx)
        ? `${ctx.origin}/crx/de/index.jsp#${ctx.path || '/'}`
        : null,
  },
  {
    id: 'crxExplorer',
    group: 'developer',
    label: 'CRX Explorer',
    icon: 'folderSearch',
    shortcut: 'x',
    description: 'Browse the JCR repository in CRX Explorer',
    build: (ctx) =>
      aemOnly(ctx) ? `${ctx.origin}/crx/explorer/index.jsp` : null,
  },
  {
    id: 'packmgr',
    group: 'developer',
    label: 'Package Manager',
    icon: 'package',
    description: 'Open the CRX package manager',
    build: (ctx) =>
      aemOnly(ctx) ? `${ctx.origin}/crx/packmgr/index.jsp` : null,
  },
  {
    id: 'debugClientLibs',
    group: 'developer',
    label: 'Debug ClientLibs',
    icon: 'bug',
    description: 'Open the ClientLibs debugger',
    build: (ctx) =>
      aemOnly(ctx)
        ? `${ctx.origin}/libs/granite/ui/content/dumplibs.html`
        : null,
  },
  {
    id: 'bundles',
    group: 'developer',
    label: 'Bundles',
    icon: 'box',
    shortcut: 'b',
    description: 'Open the OSGi bundles console',
    reason: () => 'Only available on AEM 6.5 / AMS',
    build: (ctx) =>
      traditionalOnly(ctx) ? `${ctx.origin}/system/console/bundles` : null,
  },
  {
    id: 'osgiConfig',
    group: 'developer',
    label: 'OSGi configs',
    icon: 'settings',
    description: 'Open the OSGi configuration manager',
    reason: () => 'Only available on AEM 6.5 / AMS',
    build: (ctx) =>
      traditionalOnly(ctx) ? `${ctx.origin}/system/console/configMgr` : null,
  },
  {
    id: 'jmx',
    group: 'developer',
    label: 'JMX',
    icon: 'activity',
    shortcut: 'j',
    description: 'Open the JMX console',
    reason: () => 'Only available on AEM 6.5 / AMS',
    build: (ctx) =>
      traditionalOnly(ctx) ? `${ctx.origin}/system/console/jmx` : null,
  },
  {
    id: 'logs',
    group: 'developer',
    label: 'Logs',
    icon: 'listDetails',
    shortcut: 'l',
    description: 'Open the log support page',
    reason: () => 'Only available on AEM 6.5 / AMS',
    build: (ctx) =>
      traditionalOnly(ctx) ? `${ctx.origin}/system/console/slinglog` : null,
  },
  {
    id: 'replicationAgents',
    group: 'developer',
    label: 'Replication Agents',
    icon: 'route',
    shortcut: 'r',
    description: 'Open the author replication agents',
    reason: () => 'Only available on AEM 6.5 / AMS',
    build: (ctx) =>
      traditionalOnly(ctx)
        ? `${ctx.origin}/etc/replication/agents.author.html`
        : null,
  },
  {
    id: 'treeActivation',
    group: 'developer',
    label: 'Tree Activation',
    icon: 'sitemap',
    description: 'Activate or deactivate a content tree',
    reason: () => 'Only available on AEM 6.5 / AMS',
    build: (ctx) =>
      traditionalOnly(ctx)
        ? `${ctx.origin}/etc/replication/treeactivation.html`
        : null,
  },
  {
    id: 'tags',
    group: 'developer',
    label: 'Tags',
    icon: 'tags',
    shortcut: 't',
    description: 'Open the tag administration console',
    build: (ctx) =>
      aemOnly(ctx)
        ? `${ctx.origin}/libs/cq/tagging/content/tagadmin.html`
        : null,
  },
  {
    id: 'queryBuilder',
    group: 'developer',
    label: 'Query Builder',
    icon: 'search',
    shortcut: 'q',
    description: 'Open the QueryBuilder debugger',
    build: (ctx) =>
      aemOnly(ctx) ? `${ctx.origin}/libs/cq/search/content/querydebug.html` : null,
  },
  {
    id: 'workflowConsole',
    group: 'developer',
    label: 'Workflow console',
    icon: 'timeline',
    shortcut: 'w',
    description: 'Open the workflow instances console',
    build: (ctx) =>
      aemOnly(ctx)
        ? `${ctx.origin}${ctx.shell}/libs/cq/workflow/content/console.html`
        : null,
  },
  {
    id: 'users',
    group: 'developer',
    label: 'Users',
    icon: 'users',
    shortcut: 'u',
    description: 'Open the user administration console',
    build: (ctx) =>
      aemOnly(ctx) ? `${ctx.origin}${ctx.shell}/security/users.html` : null,
  },
  {
    id: 'systemConsole',
    group: 'developer',
    label: 'System Console',
    icon: 'server',
    description: 'Open the OSGi web console',
    reason: () => 'Only available on AEM 6.5 / AMS',
    build: (ctx) =>
      traditionalOnly(ctx) ? `${ctx.origin}/system/console` : null,
  },
]
