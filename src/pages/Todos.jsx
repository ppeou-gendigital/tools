import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Check,
  CircleDollarSign,
  GripVertical,
  ListMusic,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Users,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { ParticipantChips } from '@/molecules/ParticipantChips'
import { Textarea } from '@/molecules/Textarea'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import {
  formatWallDate,
  labelForJourneyPerson,
} from '@/lib/format'
import {
  addTodo,
  deleteTodo,
  getJourney,
  listJourneyPeople,
  listTodos,
  myMembership,
  reorderTodos,
  updateTodo,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

const DRAG_THRESHOLD_PX = 8

const FILTERS = [
  { id: 'open', label: 'Open' },
  { id: 'done', label: 'Done' },
  { id: 'all', label: 'All' },
]

function emptyForm() {
  return {
    title: '',
    notes: '',
    dueOn: '',
    done: false,
    assigneeIds: new Set(),
    assigneeDone: new Map(),
  }
}

function formFromTodo(todo) {
  const assigneeDone = new Map(
    (todo?.assignees ?? []).map((a) => [a.journeyPersonId, !!a.done]),
  )
  const ids = todo?.assigneeJourneyPersonIds ?? []
  for (const id of ids) {
    if (!assigneeDone.has(id)) assigneeDone.set(id, false)
  }
  return {
    title: todo?.title ?? '',
    notes: todo?.notes ?? '',
    dueOn: todo?.dueOn ?? '',
    done: !!todo?.done,
    assigneeIds: new Set(ids),
    assigneeDone,
  }
}

function formOverallDone(form) {
  if (form.assigneeIds.size === 0) return !!form.done
  return [...form.assigneeIds].every((id) => form.assigneeDone.get(id))
}

function todayYmd() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isOverdue(dueOn, done) {
  if (!dueOn || done) return false
  return String(dueOn) < todayYmd()
}

function moveItem(list, from, to) {
  if (from === to || from < 0 || to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function indexFromPoint(listEl, clientY) {
  if (!listEl) return -1
  const rows = [...listEl.querySelectorAll('[data-todo-id]')]
  if (rows.length === 0) return -1
  for (let i = 0; i < rows.length; i += 1) {
    const rect = rows[i].getBoundingClientRect()
    const mid = rect.top + rect.height / 2
    if (clientY < mid) return i
  }
  return rows.length - 1
}

function todoMeta(todo, { rosterById, currentUserId, displayLocale }) {
  const assignees = todo.assignees ?? []
  const assigneeIds = todo.assigneeJourneyPersonIds ?? []
  const doneCount = todo.assigneeDoneCount ?? assignees.filter((a) => a.done).length
  const names = assigneeIds
    .map((id) => {
      const person = rosterById.get(id)
      return person ? labelForJourneyPerson(person, currentUserId) : null
    })
    .filter(Boolean)

  let assigneeText = ''
  if (names.length === 1) {
    assigneeText = names[0]
  } else if (names.length === 2) {
    assigneeText = `${names[0]}, ${names[1]}`
  } else if (names.length > 2) {
    assigneeText = `${names[0]}, ${names[1]} +${names.length - 2}`
  }

  const dueLabel = todo.dueOn
    ? formatWallDate(todo.dueOn, null, displayLocale)
    : ''
  const overdue = isOverdue(todo.dueOn, todo.done)
  const multi = assigneeIds.length > 1
  // Pill only for partial progress; checkbox ring uses full progress object.
  const progressPill =
    multi && doneCount > 0 && doneCount < assigneeIds.length
      ? `${doneCount}/${assigneeIds.length}`
      : null

  return {
    assigneeText,
    dueText: dueLabel ? `Due ${dueLabel}` : '',
    overdue,
    progress:
      multi && !todo.done
        ? { done: doneCount, total: assigneeIds.length }
        : null,
    progressPill,
  }
}

export function Todos() {
  const {
    params,
    goBack,
    previousRouteLabel,
    goMembers,
    goSpending,
    goPlaylist,
    goMap,
    goJourneySettings,
  } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const { displayLocale } = useDisplayPrefs()
  const qc = useQueryClient()
  const listRef = useRef(null)
  const dragRef = useRef(null)
  const orderedRef = useRef([])

  const [filter, setFilter] = useState('open')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [reorderError, setReorderError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [ordered, setOrdered] = useState([])
  const [draggingId, setDraggingId] = useState(null)
  const [overIndex, setOverIndex] = useState(-1)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    orderedRef.current = ordered
  }, [ordered])

  const { data: journey } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const {
    data: membership,
    isLoading: membershipLoading,
  } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const {
    data: items = [],
    isLoading,
    isFetching,
    error: loadError,
    refetch,
  } = useQuery({
    queryKey: ['viaggio', 'todos', journeyId],
    queryFn: () => listTodos(journeyId),
    enabled: !!journeyId,
  })

  const { data: roster = [] } = useQuery({
    queryKey: ['viaggio', 'journey-people', journeyId],
    queryFn: () => listJourneyPeople(journeyId),
    enabled: !!journeyId,
  })

  const rosterById = useMemo(
    () => new Map(roster.map((p) => [p.id, p])),
    [roster],
  )

  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'
  const isViewer = !!membership && !canEdit

  const visible = useMemo(() => {
    if (filter === 'open') return ordered.filter((t) => !t.done)
    if (filter === 'done') return ordered.filter((t) => t.done)
    return ordered
  }, [ordered, filter])

  const canReorder = canEdit && filter === 'all' && ordered.length > 1

  const openCount = ordered.filter((t) => !t.done).length
  const doneCount = ordered.length - openCount

  const myPersonId = useMemo(
    () => roster.find((p) => p.linkedUserId === user?.id)?.id ?? null,
    [roster, user?.id],
  )

  const saveMut = useMutation({
    mutationFn: () => {
      const ids = [...form.assigneeIds]
      const assigneeDone = {}
      for (const id of ids) {
        assigneeDone[id] = !!form.assigneeDone.get(id)
      }
      const overall = formOverallDone(form)
      const payload = {
        title: form.title.trim(),
        notes: form.notes,
        dueOn: form.dueOn || null,
        done: overall,
        assigneeJourneyPersonIds: ids,
        assigneeDone: ids.length > 0 ? assigneeDone : undefined,
      }
      if (editing) {
        return updateTodo(editing.id, payload)
      }
      return addTodo(journeyId, payload, user.id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'todos', journeyId] })
      setEditorOpen(false)
      setEditing(null)
      setForm(emptyForm())
      setError('')
    },
    onError: (err) => setError(err.message),
  })

  const toggleMut = useMutation({
    mutationFn: ({ id, done }) => updateTodo(id, { done }),
    onMutate: async ({ id, done }) => {
      setTogglingId(id)
      await qc.cancelQueries({ queryKey: ['viaggio', 'todos', journeyId] })
      const previous = qc.getQueryData(['viaggio', 'todos', journeyId])
      const next = (previous ?? ordered).map((t) => {
        if (t.id !== id) return t
        const assignees = (t.assignees ?? []).map((a) => ({
          ...a,
          done,
        }))
        return {
          ...t,
          done,
          assignees,
          assigneeDoneCount: done ? assignees.length : 0,
        }
      })
      qc.setQueryData(['viaggio', 'todos', journeyId], next)
      setOrdered(next)
      return { previous }
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['viaggio', 'todos', journeyId], context.previous)
        setOrdered(context.previous)
      }
      setError(err.message || 'Could not update todo.')
    },
    onSettled: () => {
      setTogglingId(null)
      qc.invalidateQueries({ queryKey: ['viaggio', 'todos', journeyId] })
    },
  })

  const reorderMut = useMutation({
    mutationFn: (orderedIds) => reorderTodos(journeyId, orderedIds),
    onError: (err, _ids, context) => {
      if (context?.previous) {
        setOrdered(context.previous)
        qc.setQueryData(['viaggio', 'todos', journeyId], context.previous)
      }
      setReorderError(err.message || 'Could not save new order.')
    },
    onSuccess: (_data, orderedIds) => {
      qc.setQueryData(['viaggio', 'todos', journeyId], (old) => {
        const source = old?.length ? old : orderedRef.current
        const byId = new Map(source.map((i) => [i.id, i]))
        return orderedIds
          .map((id, sortOrder) => {
            const item = byId.get(id)
            return item ? { ...item, sortOrder } : null
          })
          .filter(Boolean)
      })
      setReorderError('')
    },
  })

  useEffect(() => {
    if (dragRef.current || reorderMut.isPending) return
    setOrdered(items)
  }, [items, reorderMut.isPending])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm())
    setError('')
    setEditorOpen(true)
  }

  function openEdit(todo) {
    setEditing(todo)
    setForm(formFromTodo(todo))
    setError('')
    setEditorOpen(true)
  }

  function closeEditor() {
    if (saveMut.isPending) return
    setEditorOpen(false)
    setEditing(null)
    setForm(emptyForm())
    setError('')
  }

  function submitEditor(e) {
    e?.preventDefault?.()
    if (!form.title.trim() || saveMut.isPending) return
    setError('')
    saveMut.mutate()
  }

  function toggleAssignee(id) {
    setForm((f) => {
      const next = new Set(f.assigneeIds)
      const doneMap = new Map(f.assigneeDone)
      if (next.has(id)) {
        next.delete(id)
        doneMap.delete(id)
      } else {
        next.add(id)
        doneMap.set(id, false)
      }
      const nextForm = { ...f, assigneeIds: next, assigneeDone: doneMap }
      return { ...nextForm, done: formOverallDone(nextForm) }
    })
  }

  function setFormAssigneeDone(id, done) {
    setForm((f) => {
      const doneMap = new Map(f.assigneeDone)
      doneMap.set(id, !!done)
      const nextForm = { ...f, assigneeDone: doneMap }
      return { ...nextForm, done: formOverallDone(nextForm) }
    })
  }

  function setFormOverallDone(done) {
    setForm((f) => {
      if (f.assigneeIds.size === 0) return { ...f, done: !!done }
      const doneMap = new Map(f.assigneeDone)
      for (const id of f.assigneeIds) doneMap.set(id, !!done)
      return { ...f, done: !!done, assigneeDone: doneMap }
    })
  }

  function assignAll() {
    setForm((f) => {
      const next = new Set(roster.map((p) => p.id))
      const doneMap = new Map(f.assigneeDone)
      for (const id of next) {
        if (!doneMap.has(id)) doneMap.set(id, false)
      }
      const nextForm = { ...f, assigneeIds: next, assigneeDone: doneMap }
      return { ...nextForm, done: formOverallDone(nextForm) }
    })
  }

  function assignMe() {
    if (!myPersonId) return
    setForm((f) => {
      const next = new Set(f.assigneeIds)
      const doneMap = new Map(f.assigneeDone)
      next.add(myPersonId)
      if (!doneMap.has(myPersonId)) doneMap.set(myPersonId, false)
      const nextForm = { ...f, assigneeIds: next, assigneeDone: doneMap }
      return { ...nextForm, done: formOverallDone(nextForm) }
    })
  }

  function clearAssignees() {
    setForm((f) => ({
      ...f,
      assigneeIds: new Set(),
      assigneeDone: new Map(),
    }))
  }

  const allAssigned =
    roster.length > 0 && form.assigneeIds.size === roster.length
  const meAssigned = myPersonId ? form.assigneeIds.has(myPersonId) : true
  const formAssigneeCount = form.assigneeIds.size
  const formAssigneeDoneCount = [...form.assigneeIds].filter((id) =>
    form.assigneeDone.get(id),
  ).length
  const formAllAssigneesDone =
    formAssigneeCount > 0 && formAssigneeDoneCount === formAssigneeCount

  function onGripPointerDown(e, index) {
    if (!canReorder || (e.button != null && e.button !== 0)) return
    e.preventDefault()
    e.stopPropagation()
    const grip = e.currentTarget
    grip.setPointerCapture(e.pointerId)
    const snapshot = orderedRef.current
    dragRef.current = {
      pointerId: e.pointerId,
      fromIndex: index,
      overIndex: index,
      startY: e.clientY,
      active: false,
      snapshot,
      dragId: snapshot[index]?.id ?? null,
    }
    setReorderError('')
  }

  function onGripPointerMove(e) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    e.preventDefault()
    const dy = Math.abs(e.clientY - drag.startY)
    if (!drag.active && dy < DRAG_THRESHOLD_PX) return
    if (!drag.active) {
      drag.active = true
      setDraggingId(drag.dragId)
    }
    const nextOver = indexFromPoint(listRef.current, e.clientY)
    if (nextOver < 0 || nextOver === drag.overIndex) return
    drag.overIndex = nextOver
    setOverIndex(nextOver)
    setOrdered(moveItem(drag.snapshot, drag.fromIndex, nextOver))
  }

  function endDrag(e) {
    const drag = dragRef.current
    if (!drag || (e && drag.pointerId !== e.pointerId)) return
    const wasActive = drag.active
    const previous = drag.snapshot
    const current = orderedRef.current
    dragRef.current = null
    setDraggingId(null)
    setOverIndex(-1)
    if (!wasActive) return

    const orderedIds = current.map((i) => i.id)
    const prevIds = previous.map((i) => i.id)
    if (orderedIds.every((id, i) => id === prevIds[i])) return

    qc.setQueryData(['viaggio', 'todos', journeyId], current)
    reorderMut.mutate(orderedIds, {
      onMutate: () => ({ previous }),
    })
  }

  if (!journeyId) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing journey.</p>
          <Button variant="outline" onClick={goBack} fullWidth>
            Back
          </Button>
        </div>
      </div>
    )
  }

  const countLabel =
    !isLoading && ordered.length > 0
      ? `${openCount} open · ${doneCount} done`
      : null

  return (
    <div className={styles.page}>
      <PageHeader
        title="To-dos"
        subtitle={[journey?.title, countLabel].filter(Boolean).join(' · ')}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          <div className={styles.toolbar}>
            <Button
              variant="ghost"
              size="sm"
              className={styles.iconBtn}
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh to-dos"
              title="Refresh"
            >
              <RefreshCw
                size={14}
                aria-hidden="true"
                className={isFetching ? styles.spin : undefined}
              />
            </Button>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={openAdd}
                aria-label="Add to-do"
                title="Add to-do"
              >
                <Plus size={14} aria-hidden="true" />
              </Button>
            )}
          </div>
        }
        shortcuts={
          <PageShortcuts
            current="todos"
            className={styles.iconBtn}
            shortcuts={[
              {
                id: 'members',
                label: 'Travelers',
                icon: Users,
                pick: () => () => goMembers(journeyId),
              },
              {
                id: 'spending',
                label: 'Spending',
                icon: CircleDollarSign,
                pick: () => () => goSpending(journeyId),
              },
              {
                id: 'playlist',
                label: 'Playlist',
                icon: ListMusic,
                pick: () => () => goPlaylist(journeyId),
              },
              {
                id: 'map',
                label: 'Map',
                icon: MapPin,
                pick: () => () => goMap(journeyId),
              },
              {
                id: 'journey-settings',
                label: 'Settings',
                icon: Settings,
                pick: () => () => goJourneySettings(journeyId),
              },
            ]}
          />
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        {isViewer && (
          <p className={styles.readOnlyBanner}>
            You can view this checklist. Ask an editor to make changes.
          </p>
        )}

        {!isLoading && !loadError && ordered.length > 0 && (
          <div
            className={styles.segmented}
            role="tablist"
            aria-label="Filter to-dos"
          >
            {FILTERS.map((f) => {
              const count =
                f.id === 'open'
                  ? openCount
                  : f.id === 'done'
                    ? doneCount
                    : ordered.length
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  className={cx(
                    styles.segment,
                    filter === f.id && styles.segmentActive,
                  )}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                  <span className={styles.segmentCount}>{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {isLoading && <LoadingState>Loading to-dos…</LoadingState>}
        {loadError && (
          <div className={styles.empty}>
            <p className={styles.error} role="alert">
              Could not load to-dos. ({loadError.message})
            </p>
            <Button variant="outline" onClick={() => refetch()} fullWidth>
              Retry
            </Button>
          </div>
        )}

        {reorderError && (
          <p className={styles.error} role="alert">
            {reorderError}
          </p>
        )}

        {error && !editorOpen && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {!isLoading && !loadError && ordered.length === 0 && (
          <div className={styles.empty}>
            <p>
              Track pre-trip prep for the group — visas, eSims, bank notices,
              and more.
            </p>
            {canEdit && (
              <Button onClick={openAdd}>
                <Plus size={14} aria-hidden="true" />
                Add to-do
              </Button>
            )}
            {isViewer && (
              <p className={styles.hint}>Ask an editor to add to-dos.</p>
            )}
            {!canEdit && !isViewer && membershipLoading && (
              <p className={styles.hint}>Checking access…</p>
            )}
          </div>
        )}

        {!isLoading &&
          !loadError &&
          ordered.length > 0 &&
          visible.length === 0 && (
            <div className={styles.empty}>
              <p>
                {filter === 'open'
                  ? 'Nothing open — nice work.'
                  : filter === 'done'
                    ? 'No completed to-dos yet.'
                    : 'No to-dos.'}
              </p>
              {canEdit && filter === 'open' && (
                <Button onClick={openAdd}>
                  <Plus size={14} aria-hidden="true" />
                  Add to-do
                </Button>
              )}
            </div>
          )}

        {!isLoading && !loadError && visible.length > 0 && (
          <ul
            ref={listRef}
            className={styles.todoList}
            aria-label="Journey to-dos"
            aria-busy={reorderMut.isPending || undefined}
          >
            {visible.map((item, index) => {
              const meta = todoMeta(item, {
                rosterById,
                currentUserId: user?.id,
                displayLocale,
              })
              const isDragging = draggingId === item.id
              const listIndex = canReorder
                ? ordered.findIndex((t) => t.id === item.id)
                : index
              const hasMeta = !!(
                meta.assigneeText ||
                meta.progressPill ||
                meta.dueText
              )
              const isPartial =
                !!meta.progress &&
                meta.progress.done > 0 &&
                meta.progress.done < meta.progress.total
              return (
                <li
                  key={item.id}
                  data-todo-id={item.id}
                  className={cx(
                    styles.todoRow,
                    canReorder && styles.todoRowEditable,
                    item.done && styles.todoRowDone,
                    isDragging && styles.todoRowDragging,
                    overIndex === listIndex &&
                      draggingId &&
                      !isDragging &&
                      styles.todoRowDropTarget,
                  )}
                >
                  {canReorder && (
                    <button
                      type="button"
                      className={styles.todoGrip}
                      aria-label={`Drag to reorder ${item.title}`}
                      title="Drag to reorder"
                      onPointerDown={(e) => onGripPointerDown(e, listIndex)}
                      onPointerMove={onGripPointerMove}
                      onPointerUp={endDrag}
                      onPointerCancel={endDrag}
                    >
                      <GripVertical size={16} aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    role="checkbox"
                    className={cx(
                      styles.todoCheck,
                      item.done && styles.todoCheckDone,
                      isPartial && styles.todoCheckIndeterminate,
                    )}
                    aria-label={
                      item.done
                        ? `Mark “${item.title}” as open`
                        : isPartial
                          ? `Mark “${item.title}” as done (${meta.progress.done} of ${meta.progress.total})`
                          : `Mark “${item.title}” as done`
                    }
                    aria-checked={
                      item.done ? true : isPartial ? 'mixed' : false
                    }
                    disabled={!canEdit || togglingId === item.id}
                    onClick={() => {
                      if (!canEdit) return
                      toggleMut.mutate({ id: item.id, done: !item.done })
                    }}
                  >
                    {item.done ? (
                      <Check size={14} aria-hidden="true" />
                    ) : isPartial ? (
                      <Minus size={14} aria-hidden="true" strokeWidth={2.5} />
                    ) : null}
                  </button>
                  <button
                    type="button"
                    className={styles.todoHit}
                    tabIndex={isDragging ? -1 : 0}
                    disabled={!canEdit}
                    aria-label={
                      canEdit
                        ? `Edit ${item.title}`
                        : item.title
                    }
                    onClick={() => {
                      if (dragRef.current?.active || !canEdit) return
                      openEdit(item)
                    }}
                  >
                    <span className={styles.rowBody}>
                      <span
                        className={cx(
                          styles.todoTitle,
                          item.done && styles.todoTitleDone,
                        )}
                      >
                        {item.title}
                      </span>
                      {hasMeta ? (
                        <span className={styles.todoMeta}>
                          {meta.assigneeText ? (
                            <span className={styles.todoMetaAssignees}>
                              {meta.assigneeText}
                            </span>
                          ) : null}
                          {meta.progressPill ? (
                            <span className={styles.todoProgressPill}>
                              {meta.progressPill}
                            </span>
                          ) : null}
                          {meta.dueText ? (
                            meta.overdue ? (
                              <span className={styles.todoDueOverdue}>
                                Overdue · {meta.dueText.replace(/^Due\s+/, '')}
                              </span>
                            ) : (
                              <span className={styles.todoDue}>
                                {meta.dueText}
                              </span>
                            )
                          ) : null}
                        </span>
                      ) : null}
                      {item.notes?.trim() ? (
                        <span className={styles.todoNotes}>
                          {item.notes.trim()}
                        </span>
                      ) : null}
                    </span>
                  </button>
                  {canEdit && (
                    <div className={styles.todoActions}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={styles.iconBtnDanger}
                        aria-label={`Remove ${item.title}`}
                        onClick={() => setConfirmDelete(item)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Modal
        open={editorOpen}
        onDismiss={closeEditor}
        title={editing ? 'Edit to-do' : 'Add to-do'}
      >
        <form className={styles.sheet} onSubmit={submitEditor}>
          <div className={styles.field}>
            <Label htmlFor="todo-title">Title</Label>
            <Input
              id="todo-title"
              value={form.title}
              onChange={(e) => {
                setForm((f) => ({ ...f, title: e.target.value }))
                setError('')
              }}
              placeholder="Apply for Visa"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="todo-notes">Notes (optional)</Label>
            <Textarea
              id="todo-notes"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Embassy appointment, documents…"
              rows={3}
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="todo-due">Due date (optional)</Label>
            <Input
              id="todo-due"
              type="date"
              value={form.dueOn}
              onChange={(e) =>
                setForm((f) => ({ ...f, dueOn: e.target.value }))
              }
            />
          </div>
          {formAssigneeCount === 0 ? (
            <div className={styles.field}>
              <button
                type="button"
                className={styles.todoDoneRow}
                aria-pressed={form.done}
                onClick={() => setFormOverallDone(!form.done)}
              >
                <span
                  className={cx(
                    styles.todoCheck,
                    form.done && styles.todoCheckDone,
                  )}
                  aria-hidden="true"
                >
                  {form.done ? <Check size={14} /> : null}
                </span>
                <span className={styles.todoDoneLabel}>
                  {form.done ? 'Marked done' : 'Mark as done'}
                </span>
              </button>
            </div>
          ) : null}
          <div className={styles.field}>
            <div className={styles.todoAssigneeHead}>
              <Label>Assignees (optional)</Label>
              {roster.length > 0 && (
                <div className={styles.todoAssigneeActions}>
                  {!meAssigned && myPersonId ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={assignMe}
                    >
                      Assign me
                    </Button>
                  ) : null}
                  {!allAssigned ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={assignAll}
                    >
                      Assign all
                    </Button>
                  ) : null}
                  {formAssigneeCount > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAssignees}
                    >
                      Clear
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
            <ParticipantChips
              roster={roster}
              selected={form.assigneeIds}
              onToggle={toggleAssignee}
              currentUserId={user?.id}
              addLabel="Add assignee"
              emptyHint="No one assigned yet. Use Assign me, Assign all, or add someone."
            />
            {formAssigneeCount > 0 ? (
              <div className={styles.todoProgressBlock}>
                <div className={styles.todoProgressHead}>
                  <span className={styles.todoProgressLabel}>
                    Progress · {formAssigneeDoneCount} of {formAssigneeCount}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFormOverallDone(!formAllAssigneesDone)
                    }
                  >
                    {formAllAssigneesDone
                      ? 'Mark all open'
                      : 'Mark all done'}
                  </Button>
                </div>
                <ul
                  className={styles.todoAssigneeDoneList}
                  aria-label="Who is done"
                >
                  {[...form.assigneeIds].map((id) => {
                    const person = rosterById.get(id)
                    if (!person) return null
                    const label = labelForJourneyPerson(person, user?.id)
                    const isDone = !!form.assigneeDone.get(id)
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          className={styles.todoAssigneeDoneRow}
                          aria-pressed={isDone}
                          aria-label={
                            isDone
                              ? `Mark ${label} as open`
                              : `Mark ${label} as done`
                          }
                          onClick={() => setFormAssigneeDone(id, !isDone)}
                        >
                          <span
                            className={cx(
                              styles.todoCheck,
                              isDone && styles.todoCheckDone,
                            )}
                            aria-hidden="true"
                          >
                            {isDone ? <Check size={14} /> : null}
                          </span>
                          <span className={styles.todoAssigneeDoneName}>
                            {label}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <div className={styles.todoFormActions}>
            <Button
              type="button"
              variant="outline"
              onClick={closeEditor}
              disabled={saveMut.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.title.trim() || saveMut.isPending}
            >
              {saveMut.isPending
                ? editing
                  ? 'Saving…'
                  : 'Adding…'
                : editing
                  ? 'Save'
                  : 'Add to-do'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onDismiss={() => !deleting && setConfirmDelete(null)}
        title="Remove to-do?"
        message={
          confirmDelete
            ? `Remove “${confirmDelete.title}” from the checklist?`
            : undefined
        }
        confirmLabel="Remove"
        busyLabel="Removing…"
        confirming={deleting}
        onConfirm={async () => {
          if (!confirmDelete) return
          setDeleting(true)
          try {
            await deleteTodo(confirmDelete.id)
            qc.invalidateQueries({
              queryKey: ['viaggio', 'todos', journeyId],
            })
            setConfirmDelete(null)
          } finally {
            setDeleting(false)
          }
        }}
      />
    </div>
  )
}
