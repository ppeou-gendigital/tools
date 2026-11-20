import { useEffect, useRef, useState } from 'react'
import { Loader, MultiSelect } from '@mantine/core'

// MultiSelect whose options can come from the Jira tab on demand. The caller
// decides how the option values are keyed (`mapResults`), which keeps resource
// selections in their own `resource:` namespace.
export function RemoteMultiSelect({
  label,
  description,
  placeholder,
  type,
  call,
  value,
  selectedOptions = [],
  options = [],
  mapResults = (items) => items,
  onChange,
  minLength = 2,
  nothingFoundMessage = 'Type at least 2 characters',
}) {
  const [remote, setRemote] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const timer = useRef(null)
  const requestId = useRef(0)

  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])

  function handleSearchChange(query) {
    clearTimeout(timer.current)
    const text = query.trim()
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

  const pool = dedupeOptions([...options, ...selectedOptions, ...remote])
  const data = pool.map(({ value: id, label: text }) => ({
    value: id,
    label: text,
  }))

  return (
    <MultiSelect
      label={label}
      description={description}
      placeholder={placeholder}
      data={data}
      value={value}
      onChange={(values) => onChange(values, pool)}
      searchable
      clearable
      onSearchChange={handleSearchChange}
      rightSection={loading ? <Loader size={12} /> : null}
      nothingFoundMessage={nothingFoundMessage}
      error={error || undefined}
    />
  )
}

function dedupeOptions(list) {
  const seen = new Set()
  const result = []
  for (const option of list) {
    if (!option?.value || seen.has(option.value)) continue
    seen.add(option.value)
    result.push({ value: option.value, label: option.label ?? option.value })
  }
  return result
}
