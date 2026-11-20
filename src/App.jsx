import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  Kbd,
  Menu,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
} from '@mantine/core'
import {
  IconCheck,
  IconDeviceDesktop,
  IconLink,
  IconLinkCode,
  IconMoon,
  IconSearch,
  IconSun,
  IconSunrise,
  IconX,
} from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { buildAemLinkGroups } from './lib/aem/registry.js'
import { applyGroupOrder, moveItem } from './lib/aem/order.js'
import { useChromeStorage } from './hooks/useChromeStorage.js'
import { GroupCard } from './components/GroupCard.jsx'

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
  const [groupOrder, setGroupOrder] = useChromeStorage(
    'aemJump.groupOrder',
    null,
  )

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
    () => applyGroupOrder(groups, groupOrder),
    [groups, groupOrder],
  )

  const pinnedGroup = useMemo(
    () =>
      pinnedLinks.length > 0
        ? { id: 'pinned', label: 'Pinned', links: pinnedLinks }
        : null,
    [pinnedLinks],
  )

  const isSearching = Boolean(search.trim())

  function matchesSearch(link, query) {
    return (
      link.label.toLowerCase().includes(query) ||
      (link.description ?? '').toLowerCase().includes(query)
    )
  }

  const visiblePinned = useMemo(() => {
    if (!pinnedGroup) return null
    const query = search.trim().toLowerCase()
    if (!query) return pinnedGroup
    const links = pinnedGroup.links.filter((link) => matchesSearch(link, query))
    return links.length > 0 ? { ...pinnedGroup, links } : null
  }, [pinnedGroup, search])

  const visibleGroups = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return sourceGroups

    return sourceGroups
      .map((group) => ({
        ...group,
        links: group.links.filter((link) => matchesSearch(link, query)),
      }))
      .filter((group) => group.links.length > 0)
  }, [sourceGroups, search])

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

  function handleGroupDragEnd({ source, destination }) {
    if (!destination || destination.index === source.index) return

    const ids = sourceGroups.map((group) => group.id)
    setGroupOrder(moveItem(ids, source.index, destination.index))
  }

  function renderGroupCard(group, options = {}) {
    return (
      <GroupCard
        group={group}
        collapsed={!search && collapsedGroups.includes(group.id)}
        onToggle={() => toggleGroup(group.id)}
        favorites={favorites}
        onOpen={openLink}
        onToggleFavorite={toggleFavorite}
        dragHandleProps={options.dragHandleProps}
      />
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

  const activeTheme = THEMES.find((theme) => theme.value === colorScheme) ?? THEMES[2]

  return (
    <div className="app">
      <div className="toolbar">
        {showManualForm ? (
          <Box px="md" pt={10} pb={8}>
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
                <Button
                  type="submit"
                  size="xs"
                  variant="light"
                  color="orange"
                >
                  Use URL
                </Button>
              </Group>
            </form>
            <Text size="xs" c="dimmed" mt={4}>
              Fallback for publish, preview, or non-AEM tabs.
            </Text>
          </Box>
        ) : null}

        <Box px="md" pt={showManualForm ? 0 : 10} pb={8}>
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
      </div>

      <Box
        px="md"
        pb={8}
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

        {visiblePinned ? (
          <Box className="groups pinned-group">
            {renderGroupCard(visiblePinned)}
          </Box>
        ) : null}

        {visibleGroups.length > 0 ? (
          isSearching ? (
            // Reordering a filtered subset would make the stored order
            // ambiguous, so the handles are omitted while filtering.
            <Box className="groups">
              {visibleGroups.map((group) => (
                <div key={group.id} className="group-drag">
                  {renderGroupCard(group)}
                </div>
              ))}
            </Box>
          ) : (
            <DragDropContext onDragEnd={handleGroupDragEnd}>
              <Droppable droppableId="aem-groups">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="groups"
                  >
                    {visibleGroups.map((group, index) => (
                      <Draggable
                        key={group.id}
                        draggableId={group.id}
                        index={index}
                        disableInteractiveElementBlocking
                      >
                        {(draggable, snapshot) => (
                          <div
                            ref={draggable.innerRef}
                            {...draggable.draggableProps}
                            className={`group-drag${snapshot.isDragging ? ' is-dragging' : ''}`}
                          >
                            {renderGroupCard(group, {
                              dragHandleProps: draggable.dragHandleProps,
                            })}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          )
        ) : null}

        {!error &&
        currentUrl &&
        visibleGroups.length === 0 &&
        !visiblePinned &&
        !result?.error ? (
          <Text size="xs" c="dimmed" ta="center" py="md">
            No links match “{search}”.
          </Text>
        ) : null}
      </Box>

      <Group className="footer" justify="space-between" wrap="nowrap">
        <Group gap={5} wrap="nowrap" title="AEM Jump">
          <ThemeIcon
            variant="filled"
            size={18}
            radius="xl"
            style={{ backgroundColor: '#22c55e', color: '#ffffff' }}
          >
            <IconLinkCode size={11} stroke={2.2} />
          </ThemeIcon>
          <Text size="xs" fw={600} lh={1}>
            AEM Jump
          </Text>
        </Group>

        <Group gap={4} wrap="nowrap">
          <Tooltip label="Open in new tab" openDelay={200}>
            <span className="footer-switch">
              <Switch
                aria-label="Open in new tab"
                checked={Boolean(openInNewTab)}
                onChange={(event) => setOpenInNewTab(event.currentTarget.checked)}
              />
            </span>
          </Tooltip>

          <Menu position="top-end" width={170} withinPortal shadow="md">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="md"
                aria-label="Change theme"
              >
                <activeTheme.Icon size={16} stroke={1.8} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Theme</Menu.Label>
              {THEMES.map(({ value, label, Icon }) => (
                <Menu.Item
                  key={value}
                  leftSection={<Icon size={14} stroke={1.8} />}
                  rightSection={
                    colorScheme === value ? <IconCheck size={14} /> : null
                  }
                  onClick={() => onColorSchemeChange(value)}
                >
                  {label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          {overrideUrl ? (
            <Tooltip label="Use current tab" openDelay={200}>
              <ActionIcon
                variant="light"
                color="orange"
                size="md"
                onClick={useCurrentTab}
                aria-label="Use current tab URL"
              >
                <IconX size={14} />
              </ActionIcon>
            </Tooltip>
          ) : null}
        </Group>
      </Group>
    </div>
  )
}
