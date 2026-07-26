import {
  addPlaceIdea,
  addPlaylistItem,
  addTodo,
  deleteEntry,
  deleteExpense,
  deletePlaceIdea,
  deletePlaylistItem,
  deleteTodo,
  listJourneyPeople,
  updateJourney,
  updatePlaceIdea,
  updatePlaylistItem,
  updateTodo,
  upsertEntry,
  upsertExpenseWithSplits,
} from '@/lib/viaggioApi'
import { resolveSchemaForActivity } from '@/lib/catalog'

function equalSplits(personIds, amountCents) {
  const n = personIds.length
  if (!n || amountCents == null || !Number.isFinite(amountCents)) return []
  const base = Math.floor(amountCents / n)
  let rem = amountCents - base * n
  return personIds.map((journeyPersonId) => {
    const extra = rem > 0 ? 1 : 0
    if (rem > 0) rem -= 1
    return { journeyPersonId, amountCents: base + extra }
  })
}

function emptyApplied() {
  return {
    entries: [],
    todos: [],
    place_ideas: [],
    playlist: [],
    expenses: [],
    journey: null,
    removed: [],
  }
}

/**
 * Apply additive AI suggestions to a live journey.
 * @returns {{ applied: object, errors: string[] }}
 */
export async function applyEnrichment(journeyId, enrichment, userId) {
  const applied = emptyApplied()
  const errors = []

  for (const entry of enrichment?.entries || []) {
    try {
      const schema =
        entry.schema || resolveSchemaForActivity(entry.activity_id)
      const row = await upsertEntry({
        journeyId,
        activityId: entry.activity_id,
        schema,
        title: entry.title,
        body: entry.body || {},
        occursOn: entry.occurs_on,
        occursAt: entry.occurs_at,
        endsAt: entry.ends_at,
        timezone: entry.timezone,
        startTimezone: entry.start_timezone,
        endTimezone: entry.end_timezone,
        placeName: entry.place_name,
        address: entry.address,
        lat: entry.lat,
        lng: entry.lng,
        details: entry.details || {},
        participantIds: [],
      })
      applied.entries.push(row)
    } catch (err) {
      errors.push(`Entry “${entry.title}”: ${err.message}`)
    }
  }

  for (const todo of enrichment?.todos || []) {
    try {
      const row = await addTodo(
        journeyId,
        {
          title: todo.title,
          notes: todo.notes,
          dueOn: todo.due_on,
          done: !!todo.done,
        },
        userId,
      )
      applied.todos.push(row)
    } catch (err) {
      errors.push(`Todo “${todo.title}”: ${err.message}`)
    }
  }

  for (const idea of enrichment?.place_ideas || []) {
    try {
      const row = await addPlaceIdea(
        journeyId,
        {
          name: idea.name,
          address: idea.address,
          lat: idea.lat,
          lng: idea.lng,
          note: idea.note,
        },
        userId,
      )
      applied.place_ideas.push(row)
    } catch (err) {
      errors.push(`Place “${idea.name}”: ${err.message}`)
    }
  }

  for (const item of enrichment?.playlist || []) {
    try {
      const row = await addPlaylistItem(
        journeyId,
        {
          url: item.url,
          title: item.title,
          platform: item.platform,
        },
        userId,
      )
      applied.playlist.push(row)
    } catch (err) {
      errors.push(`Playlist “${item.title}”: ${err.message}`)
    }
  }

  return { applied, errors }
}

async function resolveExpenseSplits(journeyId, expense, userId) {
  const people = await listJourneyPeople(journeyId)
  const personIds = new Set((people || []).map((p) => p.id))
  if (!personIds.size) {
    throw new Error(
      'Add at least one person to the journey before logging expenses.',
    )
  }

  let paidBy = expense.paid_by_person_id
  if (!personIds.has(paidBy)) {
    const self = (people || []).find(
      (p) => userId && p.linkedUserId === userId,
    )
    paidBy = self?.id || people[0].id
  }

  const amountCents = expense.amount_cents
  let splits
  if (expense.split_mode === 'custom' && expense.splits?.length) {
    splits = expense.splits
      .filter((s) => personIds.has(s.journey_person_id))
      .map((s) => ({
        journeyPersonId: s.journey_person_id,
        amountCents: s.amount_cents,
      }))
    const sum = splits.reduce((n, s) => n + s.amountCents, 0)
    if (!splits.length || sum !== amountCents) {
      splits = equalSplits(
        (people || []).map((p) => p.id),
        amountCents,
      )
    }
  } else {
    splits = equalSplits(
      (people || []).map((p) => p.id),
      amountCents,
    )
  }

  if (!splits.length) {
    throw new Error('Could not compute expense splits.')
  }

  return { paidBy, amountCents, splits }
}

async function applyExpenseAction(journeyId, action, userId, { update = false } = {}) {
  const applied = emptyApplied()
  const errors = []
  const expense = action?.expense
  if (!expense) {
    return { applied, errors: ['Missing expense payload'] }
  }
  if (update && !expense.id) {
    return { applied, errors: ['Missing expense id for update'] }
  }

  try {
    const { paidBy, amountCents, splits } = await resolveExpenseSplits(
      journeyId,
      expense,
      userId,
    )
    const row = await upsertExpenseWithSplits({
      id: update ? expense.id : null,
      entryId: expense.entry_id,
      title: expense.title,
      amountCents,
      currency: expense.currency,
      paidBy,
      splitMode: expense.split_mode === 'custom' ? 'custom' : 'equal',
      category: expense.category || null,
      splits,
    })
    applied.expenses.push(row)
  } catch (err) {
    errors.push(`Expense “${expense.title}”: ${err.message}`)
  }

  return { applied, errors }
}

async function applyRemove(action, deleteFn, noun) {
  const applied = emptyApplied()
  const errors = []
  for (const id of action.ids || []) {
    try {
      await deleteFn(id)
      applied.removed.push({ type: noun, id })
    } catch (err) {
      errors.push(`${noun} ${id}: ${err.message}`)
    }
  }
  return { applied, errors }
}

async function applyUpdateEntries(journeyId, action) {
  const applied = emptyApplied()
  const errors = []
  for (const entry of action.entries || []) {
    if (!entry?.id) {
      errors.push(`Entry “${entry?.title || '?'}”: missing id for update`)
      continue
    }
    try {
      const schema =
        entry.schema || resolveSchemaForActivity(entry.activity_id)
      const row = await upsertEntry({
        id: entry.id,
        journeyId,
        activityId: entry.activity_id,
        schema,
        title: entry.title,
        body: entry.body || {},
        occursOn: entry.occurs_on,
        occursAt: entry.occurs_at,
        endsAt: entry.ends_at,
        timezone: entry.timezone,
        startTimezone: entry.start_timezone,
        endTimezone: entry.end_timezone,
        placeName: entry.place_name,
        address: entry.address,
        lat: entry.lat,
        lng: entry.lng,
        details: entry.details || {},
        participantIds: [],
      })
      applied.entries.push(row)
    } catch (err) {
      errors.push(`Update “${entry.title}”: ${err.message}`)
    }
  }
  return { applied, errors }
}

async function applyUpdateTodos(action) {
  const applied = emptyApplied()
  const errors = []
  for (const todo of action.todos || []) {
    if (!todo?.id) {
      errors.push('Todo update missing id')
      continue
    }
    try {
      const patch = {}
      if (todo.title) patch.title = todo.title
      if (todo.notes !== undefined) patch.notes = todo.notes
      if (todo.due_on !== undefined) patch.dueOn = todo.due_on
      if (todo.done !== undefined) patch.done = todo.done
      const row = await updateTodo(todo.id, patch)
      applied.todos.push(row)
    } catch (err) {
      errors.push(`Todo “${todo.title || todo.id}”: ${err.message}`)
    }
  }
  return { applied, errors }
}

async function applyUpdatePlaceIdeas(action) {
  const applied = emptyApplied()
  const errors = []
  for (const idea of action.place_ideas || []) {
    if (!idea?.id) {
      errors.push('Place idea update missing id')
      continue
    }
    try {
      const patch = {}
      if (idea.name) patch.name = idea.name
      if (idea.address !== undefined) patch.address = idea.address
      if (idea.note !== undefined) patch.note = idea.note
      if (idea.lat !== undefined) patch.lat = idea.lat
      if (idea.lng !== undefined) patch.lng = idea.lng
      const row = await updatePlaceIdea(idea.id, patch)
      applied.place_ideas.push(row)
    } catch (err) {
      errors.push(`Place “${idea.name || idea.id}”: ${err.message}`)
    }
  }
  return { applied, errors }
}

async function applyUpdatePlaylist(action) {
  const applied = emptyApplied()
  const errors = []
  for (const item of action.playlist || []) {
    if (!item?.id) {
      errors.push('Playlist update missing id')
      continue
    }
    try {
      const row = await updatePlaylistItem(item.id, {
        url: item.url,
        title: item.title,
        platform: item.platform,
      })
      applied.playlist.push(row)
    } catch (err) {
      errors.push(`Playlist “${item.title || item.id}”: ${err.message}`)
    }
  }
  return { applied, errors }
}

async function applyUpdateJourney(journeyId, action) {
  const applied = emptyApplied()
  const errors = []
  const patch = action.journey
  if (!patch) {
    return { applied, errors: ['Missing journey patch'] }
  }
  try {
    const row = await updateJourney(journeyId, {
      title: patch.title,
      startsOn: patch.starts_on,
      endsOn: patch.ends_on,
      defaultTimezone: patch.default_timezone,
      defaultCurrency: patch.default_currency,
    })
    applied.journey = row
  } catch (err) {
    errors.push(`Journey update: ${err.message}`)
  }
  return { applied, errors }
}

export async function applyChatAction(journeyId, action, userId) {
  const type = action?.type

  switch (type) {
    case 'add_expense':
      return applyExpenseAction(journeyId, action, userId, { update: false })
    case 'update_expense':
      return applyExpenseAction(journeyId, action, userId, { update: true })
    case 'remove_expenses':
      return applyRemove(action, deleteExpense, 'Expense')
    case 'remove_entries':
      return applyRemove(action, deleteEntry, 'Entry')
    case 'remove_todos':
      return applyRemove(action, deleteTodo, 'Todo')
    case 'remove_place_ideas':
      return applyRemove(action, deletePlaceIdea, 'Place')
    case 'remove_playlist':
      return applyRemove(action, deletePlaylistItem, 'Playlist')
    case 'update_entries':
      return applyUpdateEntries(journeyId, action)
    case 'update_todos':
      return applyUpdateTodos(action)
    case 'update_place_ideas':
      return applyUpdatePlaceIdeas(action)
    case 'update_playlist':
      return applyUpdatePlaylist(action)
    case 'update_journey':
      return applyUpdateJourney(journeyId, action)
    case 'add_entries':
    case 'add_todos':
    case 'add_place_ideas':
    case 'add_playlist':
      return applyEnrichment(
        journeyId,
        {
          entries: type === 'add_entries' ? action.entries || [] : [],
          todos: type === 'add_todos' ? action.todos || [] : [],
          place_ideas: type === 'add_place_ideas' ? action.place_ideas || [] : [],
          playlist: type === 'add_playlist' ? action.playlist || [] : [],
        },
        userId,
      )
    default:
      return {
        applied: emptyApplied(),
        errors: [`Unsupported action type: ${type || '?'}`],
      }
  }
}

export async function applySelectedPlaceIdeas(journeyId, ideas, userId) {
  return applyEnrichment(journeyId, { place_ideas: ideas }, userId)
}
