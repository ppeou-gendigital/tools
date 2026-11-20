import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  CopyButton,
  Group,
  Kbd,
  ScrollArea,
  SegmentedControl,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  VisuallyHidden,
} from '@mantine/core'
import {
  IconBolt,
  IconCheck,
  IconCopy,
  IconDeviceDesktop,
  IconLink,
  IconMoon,
  IconSearch,
  IconSun,
  IconSunrise,
  IconX,
} from '@tabler/icons-react'
import { buildAemLinkGroups } from './lib/aem/registry.js'
import { useChromeStorage } from './hooks/useChromeStorage.js'
import { GroupCard } from './components/GroupCard.jsx'

const MODE_LABEL = {
  edit: 'Edit mode',
  preview: 'Preview',
  disabled: 'Disabled',
}

const MODE_COLOR = {
  edit: 'orange',
  preview: 'gray',
  disabled: 'gray',
}

const FLAVOR_LABEL = {
  traditional: 'AEM 6.5 / AMS',
  cloud: 'AEM Cloud',
  ue: 'Universal Editor',
}

const THEMES = [
  { value: 'light', label: 'Light', Icon: IconSun },
  { value: 'dark', label: 'Dark', Icon: IconMoon },
  { value: 'system', label: 'System', Icon: IconDeviceDesktop },
  { value: 'sunrise', label: 'Sunrise/sunset', Icon: IconSunrise },
]

function extensionAvailable() {
  return typeof chrome !== 'undefined' && Boolean(chrome.tabs)
}

export default function App({
  colorScheme = 'system',
  onColorSchemeChange = () => {},
}) {
  const [tabId, setTabId] = useState(null)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [overrideUrl, setOverrideUrl] = useState('')
  const [manualValue, setManualValue] = useState('')
  const [manualError, setManualError] = useState('')
  const searchRef = useRef(null)

  const [openInNewTab, setOpenInNewTab] = useChromeStorage(
    'aemJump.openInNewTab',
    false,
  )
  const [collapsedGroups, setCollapsedGroups] = useChromeStorage(
    'aemJump.collapsedGroups',
    [],
  )
  const [favorites, setFavorites] = useChromeStorage('aemJump.favorites', [])

  useEffect(() => {
    if (!extensionAvailable()) {
      // Preview the popup in a normal browser tab:
      //   /popup.html?url=<encoded AEM URL>
      const demoUrl = new URLSearchParams(window.location.search).get('url')
      if (demoUrl) {
        setUrl(demoUrl)
        return undefined
      }
      setError(
        'Chrome extension APIs are not available. Load the built extension from chrome://extensions.',
      )
      return undefined
    }

    let alive = true

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!alive) return
      const tab = tabs?.[0]
      if (!tab?.url) {
        setError('Could not read the current tab URL.')
        return
      }
      setTabId(tab.id)
      setUrl(tab.url)
    })

    return () => {
      alive = false
    }
  }, [])

  const currentUrl = overrideUrl || url

  const result = useMemo(() => {
    if (!currentUrl) return null
    try {
      return buildAemLinkGroups(currentUrl, { now: Date.now() })
    } catch (err) {
      return { error: err.message }
    }
  }, [currentUrl])

  const parsed = result?.parsed
  const groups = result?.groups ?? []
  const showManualForm =
    Boolean(error) ||
    Boolean(result?.error) ||
    Boolean(url && parsed && !parsed.isAem)

  const allLinks = useMemo(
    () => groups.flatMap((group) => group.links),
    [groups],
  )

  const pinnedLinks = useMemo(
    () =>
      favorites
        .map((id) => allLinks.find((link) => link.id === id))
        .filter(Boolean),
    [favorites, allLinks],
  )

  const sourceGroups = useMemo(
    () =>
      pinnedLinks.length > 0
        ? [{ id: 'pinned', label: 'Pinned', links: pinnedLinks }, ...groups]
        : groups,
    [pinnedLinks, groups],
  )

  const visibleGroups = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return sourceGroups

    return sourceGroups
      .map((group) => ({
        ...group,
        links: group.links.filter(
          (link) =>
            link.label.toLowerCase().includes(query) ||
            (link.description ?? '').toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.links.length > 0)
  }, [sourceGroups, search])

  const linkCount = groups.reduce(
    (total, group) => total + group.links.length,
    0,
  )
  const availableCount = groups.reduce(
    (total, group) =>
      total + group.links.filter((link) => Boolean(link.href)).length,
    0,
  )

  function openLink(href) {
    if (!extensionAvailable()) return
    if (openInNewTab || overrideUrl || tabId == null) {
      chrome.tabs.create({ url: href })
    } else {
      chrome.tabs.update(tabId, { url: href })
    }
    window.close()
  }

  function applyManualUrl(event) {
    event.preventDefault()
    const value = manualValue.trim()
    if (!value) {
      setManualError('Enter an AEM author URL.')
      return
    }

    try {
      const next = buildAemLinkGroups(value, { now: Date.now() })
      if (!next.parsed.isAem) {
        setManualError('That does not look like an AEM author URL.')
        return
      }
    } catch (err) {
      setManualError(err.message || 'Invalid URL.')
      return
    }

    setManualError('')
    setOverrideUrl(value)
  }

  function useCurrentTab() {
    setOverrideUrl('')
    setManualValue('')
    setManualError('')
  }

  useEffect(() => {
    function onKeyDown(event) {
      const target = event.target
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if (event.key === '/' && !typing) {
        event.preventDefault()
        searchRef.current?.focus()
        return
      }

      if (event.key === 'Escape' && (typing || search)) {
        setSearch('')
        searchRef.current?.blur()
        return
      }

      if (
        typing ||
        event.repeat ||
        event.isComposing ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        !/^[a-z]$/i.test(event.key)
      ) {
        return
      }

      const link = allLinks.find(
        (entry) => entry.shortcut === event.key.toLowerCase(),
      )
      if (!link?.href) return

      event.preventDefault()
      openLink(link.href)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [search, allLinks, tabId, openInNewTab, overrideUrl])

  function toggleGroup(id) {
    setCollapsedGroups((previous) =>
      previous.includes(id)
        ? previous.filter((entry) => entry !== id)
        : [...previous, id],
    )
  }

  function toggleFavorite(id) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((entry) => entry !== id)
        : [...previous, id],
    )
  }

  function handleGridKeyDown(event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    const rows = Array.from(
      event.currentTarget.querySelectorAll(
        '[data-link-row]:not([disabled])',
      ),
    )
    if (rows.length === 0) return

    const index = rows.indexOf(document.activeElement)
    if (index === -1) return

    event.preventDefault()
    const offset = event.key === 'ArrowDown' ? 1 : -1
    rows[(index + offset + rows.length) % rows.length]?.focus()
  }

  return (
    <div className="app">
      <Group className="header" justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <ThemeIcon variant="filled" color="orange" size={30} radius="md">
            <IconBolt size={17} />
          </ThemeIcon>
          <Box>
            <Title order={1} size="h5" fw={700}>
              AEM Jump
            </Title>
            <Text size="xs" c="dimmed">
              Open the current URL anywhere in AEM
            </Text>
          </Box>
        </Group>

        {parsed?.isAem && parsed?.mode ? (
          <Badge variant="light" color={MODE_COLOR[parsed.mode] ?? 'gray'}>
            {MODE_LABEL[parsed.mode] ?? parsed.mode}
          </Badge>
        ) : null}
      </Group>

      <Box px="md" pb={6}>
        <Group className="url-bar" gap={6} wrap="nowrap">
          <Text
            size="xs"
            ff="monospace"
            c="dimmed"
            truncate
            style={{ flex: 1 }}
            title={currentUrl}
          >
            {currentUrl || 'Reading current tab…'}
          </Text>

          <CopyButton value={currentUrl || ''} timeout={1200}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy URL'}>
                <ActionIcon
                  color={copied ? 'teal' : 'gray'}
                  onClick={copy}
                  disabled={!currentUrl}
                  aria-label="Copy current URL"
                >
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>

          {overrideUrl ? (
            <Tooltip label="Use current tab">
              <ActionIcon
                variant="light"
                color="orange"
                onClick={useCurrentTab}
                aria-label="Use current tab URL"
              >
                <IconX size={14} />
              </ActionIcon>
            </Tooltip>
          ) : null}
        </Group>

        <Group gap={4} mt={6} wrap="wrap">
          {overrideUrl ? (
            <Badge variant="light" color="orange">
              manual
            </Badge>
          ) : null}
          {parsed?.isAem ? (
            <Badge variant="default" color="gray">
              {FLAVOR_LABEL[parsed.flavor] ?? parsed.flavor}
            </Badge>
          ) : null}
          {parsed?.siteName ? (
            <Badge variant="default" color="gray">
              site: {parsed.siteName}
            </Badge>
          ) : null}
          {parsed?.resourcePath ? (
            <Text
              className="path-chip"
              size="xs"
              ff="monospace"
              c="dimmed"
              truncate
              title={parsed.resourcePath}
            >
              {parsed.resourcePath}
            </Text>
          ) : null}
        </Group>
      </Box>

      {showManualForm ? (
        <Box px="md" pb={8}>
          <form onSubmit={applyManualUrl}>
            <Group gap={6} wrap="nowrap" align="flex-start">
              <TextInput
                style={{ flex: 1 }}
                size="xs"
                value={manualValue}
                onChange={(event) => {
                  setManualValue(event.currentTarget.value)
                  if (manualError) setManualError('')
                }}
                placeholder="Paste an AEM author URL…"
                aria-label="AEM author URL"
                leftSection={<IconLink size={14} />}
                error={manualError || undefined}
              />
              <Button type="submit" size="xs" variant="light" color="orange">
                Use URL
              </Button>
            </Group>
          </form>
          <Text size="xs" c="dimmed" mt={4}>
            Fallback for publish, preview, or non-AEM tabs.
          </Text>
        </Box>
      ) : null}

      <Box px="md" pb={8}>
        <TextInput
          ref={searchRef}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Filter links…"
          leftSection={<IconSearch size={14} />}
          rightSectionPointerEvents={search ? 'all' : 'none'}
          rightSection={
            search ? (
              <ActionIcon
                size="xs"
                color="gray"
                onClick={() => setSearch('')}
                aria-label="Clear filter"
              >
                <IconX size={12} />
              </ActionIcon>
            ) : (
              <Kbd>/</Kbd>
            )
          }
        />
      </Box>

      <Box className="content">
        <ScrollArea h="100%" type="auto" offsetScrollbars scrollbarSize={8}>
          <Box
            px="md"
            className="groups-wrap"
            onKeyDown={handleGridKeyDown}
          >
            {error ? (
              <Alert color="red" variant="light" mb="sm">
                {error}
              </Alert>
            ) : null}

            {!error && result?.error ? (
              <Alert color="red" variant="light" mb="sm">
                {result.error}
              </Alert>
            ) : null}

            {!error &&
            currentUrl &&
            result &&
            !result.error &&
            parsed &&
            !parsed.isAem ? (
              <Alert color="gray" variant="light" mb="sm" py={6}>
                <Text size="xs">
                  Not an AEM author URL — every destination is shown, but none
                  apply to this page.
                </Text>
              </Alert>
            ) : null}

            {visibleGroups.length > 0 ? (
              <Box className="groups">
                {visibleGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    collapsed={
                      !search && collapsedGroups.includes(group.id)
                    }
                    onToggle={() => toggleGroup(group.id)}
                    favorites={favorites}
                    onOpen={openLink}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </Box>
            ) : null}

            {!error &&
            currentUrl &&
            visibleGroups.length === 0 &&
            !result?.error ? (
              <Text size="xs" c="dimmed" ta="center" py="md">
                No links match “{search}”.
              </Text>
            ) : null}
          </Box>
        </ScrollArea>
      </Box>

      <Group className="footer" justify="space-between" wrap="nowrap">
        <Group gap="md" wrap="nowrap">
          <Switch
            label="Open in new tab"
            checked={Boolean(openInNewTab)}
            onChange={(event) => setOpenInNewTab(event.currentTarget.checked)}
          />
          <SegmentedControl
            aria-label="Theme"
            size="xs"
            radius="md"
            value={colorScheme}
            onChange={onColorSchemeChange}
            data={THEMES.map(({ value, label, Icon }) => ({
              value,
              label: (
                <Tooltip label={label} openDelay={200}>
                  <span className="theme-option">
                    <Icon size={13} stroke={1.8} />
                    <VisuallyHidden>{label}</VisuallyHidden>
                  </span>
                </Tooltip>
              ),
            }))}
          />
        </Group>
        <Group gap="xs" wrap="nowrap">
          <Text size="xs" c="dimmed">
            {availableCount}/{linkCount} available
          </Text>
          <Kbd>/</Kbd>
          <Text size="xs" c="dimmed">
            search
          </Text>
        </Group>
      </Group>
    </div>
  )
}
