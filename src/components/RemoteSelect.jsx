import { useEffect, useRef, useState } from 'react'
import { Loader, Select } from '@mantine/core'
import { dedupeOptions, filterOptions } from '../lib/jira/options.js'

// Single-value search picker. Choosing a result hands it to the caller (which
// appends it to an ordered list) and clears the field for the next one, so the
// section does not also paint chips for the same selection.
export function RemoteSelect({
  label,
  description,
  placeholder,
  type,
  call,
  options = [],
  excludeIds = [],
  onPick,
  mapResults = (items) => items,
  minLength = 2,
  nothingFoundMessage,
}) {
  const [remote, setRemote] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const timer = useRef(null)
  const requestId = useRef(0)
  const inputRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])

  const excluded = new Set(excludeIds)
  const pool = dedupeOptions([...options, ...remote]).filter(
    (option) => !excluded.has(option.value),
  )
  const enough = search.trim().length >= minLength

  function runSearch(text) {
    clearTimeout(timer.current)
    setError('')

    // Invalidate whatever request is in flight so a slow response cannot
    // overwrite the results of a newer query.
    const id = requestId.current + 1
    requestId.current = id

    if (text.length < minLength) {
      setRemote([])
      setLoading(false)
      return
    }

    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const items = await call(type, { query: text })
        if (id !== requestId.current) return
        setRemote(mapResults(Array.isArray(items) ? items : []))
      } catch (requestError) {
        if (id !== requestId.current) return
        setError(requestError.message)
      } finally {
        if (id === requestId.current) setLoading(false)
      }
    }, 250)
  }

  function handleSearchChange(query) {
    setSearch(query)
    runSearch(query.trim())
  }

  function handleChange(value) {
    if (!value) return

    const picked = pool.find((option) => option.value === value)
    if (!picked) return

    onPick({ id: picked.value, name: picked.label })

    // Reset the field ourselves: the value is always null (the caller owns the
    // selection), so Mantine would otherwise keep the typed text in the input.
    clearTimeout(timer.current)
    requestId.current += 1
    setSearch('')
    setRemote([])
    setLoading(false)

    // Keep the cursor in the input so several entries can be added in a row.
    inputRef.current?.focus()
  }

  return (
    <Select
      ref={inputRef}
      label={label}
      description={description}
      placeholder={placeholder}
      data={enough ? pool : []}
      value={null}
      searchValue={search}
      onChange={handleChange}
      filter={filterOptions}
      searchable
      onSearchChange={handleSearchChange}
      rightSection={loading ? <Loader size={12} /> : null}
      nothingFoundMessage={
        nothingFoundMessage ??
        (enough ? 'No matches' : `Type at least ${minLength} characters`)
      }
      error={error || undefined}
    />
  )
}
