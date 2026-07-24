/**
 * Dev-only scenario seeders for smoke tests.
 * Exposed as window.__viaggioSeed when import.meta.env.DEV.
 */
import { supabase } from '@/lib/supabase'
import {
  addJourneyPerson,
  addPlaylistItem,
  addTodo,
  createInvite,
  createJourney,
  inviteUrl,
  listEntries,
  listExpensesForJourney,
  listJourneys,
  listJourneyPeople,
  listMembers,
  listPlaylist,
  listTodos,
  updateJourney,
  upsertEntry,
  upsertExpenseWithSplits,
} from '@/lib/viaggioApi'
import { wallTimeToUtcIso } from '@/lib/timezone'

function equalSplits(journeyPersonIds, amountCents) {
  const n = journeyPersonIds.length
  if (n === 0) return []
  const base = Math.floor(amountCents / n)
  let rem = amountCents - base * n
  return journeyPersonIds.map((journeyPersonId) => {
    const extra = rem > 0 ? 1 : 0
    if (rem > 0) rem -= 1
    return { journeyPersonId, amountCents: base + extra }
  })
}

/** Map auth userId → journey_person id for a journey. */
async function rosterByUserId(journeyId) {
  const people = await listJourneyPeople(journeyId)
  const map = new Map()
  for (const p of people) {
    if (p.linkedUserId) map.set(p.linkedUserId, p.id)
  }
  return { people, map }
}

function entryByTitle(entries, title) {
  return entries.find((e) => e.title === title)
}

async function addGame(journeyId, { title, opponent, homeAway, wall, tz, place }) {
  return upsertEntry({
    journeyId,
    activityId: 'game',
    schema: 'event',
    title,
    occursAt: wallTimeToUtcIso(wall, tz),
    timezone: tz,
    placeName: place,
    details: { opponent, home_away: homeAway },
    body: {},
  })
}

async function addFlight(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'flight',
    schema: 'transit',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.departWall, opts.departTz),
    endsAt: wallTimeToUtcIso(opts.arriveWall, opts.arriveTz),
    startTimezone: opts.departTz,
    endTimezone: opts.arriveTz,
    timezone: opts.arriveTz,
    details: {
      from: opts.from,
      to: opts.to,
      airline: opts.airline || '',
    },
    body: {},
  })
}

async function addHotel(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'hotel',
    schema: 'lodging',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.checkIn, opts.tz),
    endsAt: wallTimeToUtcIso(opts.checkOut, opts.tz),
    timezone: opts.tz,
    placeName: opts.place || '',
    details: { confirmation: opts.confirmation || '' },
    body: {},
  })
}

async function addDrive(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'drive_leg',
    schema: 'transit',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.startWall, opts.startTz),
    endsAt: wallTimeToUtcIso(opts.endWall, opts.endTz),
    startTimezone: opts.startTz,
    endTimezone: opts.endTz,
    timezone: opts.endTz,
    details: { from: opts.from, to: opts.to },
    placeName: opts.to,
    body: {},
  })
}

/** Solo trip following Spain through WC 2026 (group + knockouts fixtures). */
export async function seedSpainWorldCup() {
  const journey = await createJourney({
    title: 'Solo: Spain through WC 2026',
    type: 'trip',
    preset: 'league_season',
    defaultTimezone: 'America/New_York',
    defaultCurrency: 'USD',
    startsOn: '2026-06-14',
    endsOn: '2026-07-20',
  })

  const jid = journey.id

  await addFlight(jid, {
    title: 'ORD → ATL',
    departWall: '2026-06-14T08:00',
    departTz: 'America/Chicago',
    arriveWall: '2026-06-14T11:05',
    arriveTz: 'America/New_York',
    from: 'Chicago ORD',
    to: 'Atlanta ATL',
    airline: 'Delta',
  })
  await addHotel(jid, {
    title: 'Atlanta base — midtown',
    checkIn: '2026-06-14T15:00',
    checkOut: '2026-06-22T11:00',
    tz: 'America/New_York',
    place: 'Atlanta',
  })
  await addGame(jid, {
    title: 'Spain vs Cape Verde',
    opponent: 'Cape Verde',
    homeAway: 'neutral',
    wall: '2026-06-15T12:00',
    tz: 'America/New_York',
    place: 'Mercedes-Benz Stadium, Atlanta',
  })
  await addGame(jid, {
    title: 'Spain vs Saudi Arabia',
    opponent: 'Saudi Arabia',
    homeAway: 'neutral',
    wall: '2026-06-21T12:00',
    tz: 'America/New_York',
    place: 'Mercedes-Benz Stadium, Atlanta',
  })
  await addFlight(jid, {
    title: 'ATL → GDL',
    departWall: '2026-06-23T09:00',
    departTz: 'America/New_York',
    arriveWall: '2026-06-23T11:30',
    arriveTz: 'America/Mexico_City',
    from: 'Atlanta ATL',
    to: 'Guadalajara GDL',
    airline: 'Aeromexico',
  })
  await addHotel(jid, {
    title: 'Guadalajara stay',
    checkIn: '2026-06-23T15:00',
    checkOut: '2026-06-27T11:00',
    tz: 'America/Mexico_City',
    place: 'Zapopan / Guadalajara',
  })
  await addGame(jid, {
    title: 'Uruguay vs Spain',
    opponent: 'Uruguay',
    homeAway: 'neutral',
    wall: '2026-06-26T18:00',
    tz: 'America/Mexico_City',
    place: 'Estadio Akron, Zapopan',
  })
  await addFlight(jid, {
    title: 'GDL → LAX',
    departWall: '2026-06-28T08:00',
    departTz: 'America/Mexico_City',
    arriveWall: '2026-06-28T10:15',
    arriveTz: 'America/Los_Angeles',
    from: 'Guadalajara GDL',
    to: 'Los Angeles LAX',
  })
  await addGame(jid, {
    title: 'R32: Spain vs Austria',
    opponent: 'Austria',
    homeAway: 'neutral',
    wall: '2026-07-02T12:00',
    tz: 'America/Los_Angeles',
    place: 'SoFi Stadium, Los Angeles',
  })
  await addFlight(jid, {
    title: 'LAX → DFW',
    departWall: '2026-07-04T10:00',
    departTz: 'America/Los_Angeles',
    arriveWall: '2026-07-04T15:20',
    arriveTz: 'America/Chicago',
    from: 'Los Angeles LAX',
    to: 'Dallas DFW',
  })
  await addGame(jid, {
    title: 'R16: Portugal vs Spain',
    opponent: 'Portugal',
    homeAway: 'neutral',
    wall: '2026-07-06T14:00',
    tz: 'America/Chicago',
    place: 'AT&T Stadium, Dallas',
  })
  await addFlight(jid, {
    title: 'DFW → LAX',
    departWall: '2026-07-08T09:00',
    departTz: 'America/Chicago',
    arriveWall: '2026-07-08T10:30',
    arriveTz: 'America/Los_Angeles',
    from: 'Dallas DFW',
    to: 'Los Angeles LAX',
  })
  await addGame(jid, {
    title: 'QF: Spain vs Belgium',
    opponent: 'Belgium',
    homeAway: 'neutral',
    wall: '2026-07-10T12:00',
    tz: 'America/Los_Angeles',
    place: 'SoFi Stadium, Los Angeles',
  })
  await addFlight(jid, {
    title: 'LAX → DFW',
    departWall: '2026-07-12T11:00',
    departTz: 'America/Los_Angeles',
    arriveWall: '2026-07-12T16:20',
    arriveTz: 'America/Chicago',
    from: 'Los Angeles LAX',
    to: 'Dallas DFW',
  })
  await addGame(jid, {
    title: 'SF: France vs Spain',
    opponent: 'France',
    homeAway: 'neutral',
    wall: '2026-07-14T14:00',
    tz: 'America/Chicago',
    place: 'AT&T Stadium, Dallas',
  })
  await addFlight(jid, {
    title: 'DFW → EWR',
    departWall: '2026-07-16T10:00',
    departTz: 'America/Chicago',
    arriveWall: '2026-07-16T14:10',
    arriveTz: 'America/New_York',
    from: 'Dallas DFW',
    to: 'Newark EWR',
  })
  await addGame(jid, {
    title: 'Final: Spain vs Argentina',
    opponent: 'Argentina',
    homeAway: 'neutral',
    wall: '2026-07-19T15:00',
    tz: 'America/New_York',
    place: 'MetLife Stadium, New York/New Jersey',
  })

  return journey
}

const SPAIN_WC_TITLE_MATCH = /Spain through WC 2026/i

/**
 * Enrich the existing Spain WC journey for multi-traveler smoke tests:
 * rename off "Solo", add social/transit activities, equal + custom expenses
 * across all members, and playlist links.
 *
 * Usage (DEV console, signed in as owner):
 *   await __viaggioSeed.enrichSpainWorldCup()
 */
export async function enrichSpainWorldCup(journeyId) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in first, then re-run enrichSpainWorldCup')

  let journey
  if (journeyId) {
    const all = await listJourneys()
    journey = all.find((j) => j.id === journeyId)
  } else {
    const all = await listJourneys()
    journey = all.find((j) => SPAIN_WC_TITLE_MATCH.test(j.title))
  }
  if (!journey) {
    throw new Error(
      'Spain WC journey not found. Pass journeyId or seedSpainWorldCup first.',
    )
  }

  const jid = journey.id
  const members = await listMembers(jid)
  if (members.length < 2) {
    throw new Error(
      `Need at least 2 members to test splits (found ${members.length}). Invite travelers first.`,
    )
  }

  const { map: personOf } = await rosterByUserId(jid)
  const memberIds = members
    .map((m) => personOf.get(m.userId))
    .filter(Boolean)
  if (memberIds.length < 2) {
    throw new Error(
      'Need journey roster people for members (run journey_people.sql patch).',
    )
  }
  const ownerUserId =
    members.find((m) => m.role === 'owner')?.userId || user.id
  const ownerId = personOf.get(ownerUserId)
  const travelerIds = memberIds.filter((id) => id !== ownerId)
  const payerA = ownerId
  const payerB = travelerIds[0] || ownerId
  const payerC = travelerIds[1] || payerB

  if (journey.title !== 'Spain through WC 2026') {
    journey = await updateJourney(jid, { title: 'Spain through WC 2026' })
  }

  let entries = await listEntries(jid)

  async function ensureEntry(title, factory) {
    let e = entryByTitle(entries, title)
    if (!e) {
      e = await factory()
      entries = await listEntries(jid)
    }
    return entryByTitle(entries, title) || e
  }

  const mealAtlanta = await ensureEntry('Welcome dinner — Atlanta', () =>
    upsertEntry({
      journeyId: jid,
      activityId: 'meal',
      schema: 'meal',
      title: 'Welcome dinner — Atlanta',
      occursAt: wallTimeToUtcIso('2026-06-14T19:30', 'America/New_York'),
      timezone: 'America/New_York',
      placeName: 'Midtown Atlanta',
      details: {},
      body: {},
    }),
  )

  const rideAtl = await ensureEntry('Uber to Mercedes-Benz Stadium', () =>
    upsertEntry({
      journeyId: jid,
      activityId: 'rideshare',
      schema: 'transit',
      title: 'Uber to Mercedes-Benz Stadium',
      occursAt: wallTimeToUtcIso('2026-06-15T10:30', 'America/New_York'),
      timezone: 'America/New_York',
      placeName: 'Atlanta',
      details: { provider: 'Uber', from: 'Hotel', to: 'Mercedes-Benz Stadium' },
      body: {},
    }),
  )

  const rentalLax = await ensureEntry('LAX car rental', () =>
    upsertEntry({
      journeyId: jid,
      activityId: 'car_rental',
      schema: 'rental',
      title: 'LAX car rental',
      occursAt: wallTimeToUtcIso('2026-06-28T11:00', 'America/Los_Angeles'),
      endsAt: wallTimeToUtcIso('2026-07-04T09:00', 'America/Los_Angeles'),
      startTimezone: 'America/Los_Angeles',
      endTimezone: 'America/Los_Angeles',
      timezone: 'America/Los_Angeles',
      placeName: 'Los Angeles',
      details: {
        provider: 'Enterprise',
        confirmation: 'WC26-LAX',
        pickup_location: 'LAX',
        dropoff_location: 'LAX',
      },
      body: {},
    }),
  )

  const mealFinal = await ensureEntry('Final watch party dinner', () =>
    upsertEntry({
      journeyId: jid,
      activityId: 'meal',
      schema: 'meal',
      title: 'Final watch party dinner',
      occursAt: wallTimeToUtcIso('2026-07-19T19:00', 'America/New_York'),
      timezone: 'America/New_York',
      placeName: 'Jersey City',
      details: {},
      body: {},
    }),
  )

  const hotelAtl = entryByTitle(entries, 'Atlanta base — midtown')
  const gameCapeVerde = entryByTitle(entries, 'Spain vs Cape Verde')
  const gameFinal = entryByTitle(entries, 'Final: Spain vs Argentina')

  entries = await listEntries(jid)
  const existingExpenses = await listExpensesForJourney(jid)
  const expenseTitles = new Set(existingExpenses.map((x) => x.title))

  async function ensureExpense(title, input) {
    if (expenseTitles.has(title)) return null
    const row = await upsertExpenseWithSplits({ ...input, title })
    expenseTitles.add(title)
    return row
  }

  // Equal USD split — all members
  if (mealAtlanta) {
    await ensureExpense('Welcome dinner (equal)', {
      entryId: mealAtlanta.id,
      amountCents: 18000,
      currency: 'USD',
      paidBy: payerA,
      splitMode: 'equal',
      category: 'food',
      splits: equalSplits(memberIds, 18000),
    })
  }

  // Equal MXN — Guadalajara game night (multi-currency)
  const hotelGdl = entryByTitle(entries, 'Guadalajara stay')
  if (hotelGdl) {
    await ensureExpense('Tacos night Guadalajara (equal MXN)', {
      entryId: hotelGdl.id,
      amountCents: 240000,
      currency: 'MXN',
      paidBy: payerB,
      splitMode: 'equal',
      category: 'food',
      splits: equalSplits(memberIds, 240000),
    })
  }

  // Custom uneven split — tickets
  if (gameCapeVerde && memberIds.length >= 3) {
    const [a, b, c] = memberIds
    await ensureExpense('Group stage tickets Cape Verde (custom)', {
      entryId: gameCapeVerde.id,
      amountCents: 45000,
      currency: 'USD',
      paidBy: payerA,
      splitMode: 'custom',
      category: 'tickets',
      splits: [
        { journeyPersonId: a, amountCents: 20000 },
        { journeyPersonId: b, amountCents: 15000 },
        { journeyPersonId: c, amountCents: 10000 },
      ],
    })
  } else if (gameCapeVerde) {
    await ensureExpense('Group stage tickets Cape Verde (equal)', {
      entryId: gameCapeVerde.id,
      amountCents: 45000,
      currency: 'USD',
      paidBy: payerA,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(memberIds, 45000),
    })
  }

  // Rideshare — payer traveler, equal split
  if (rideAtl) {
    await ensureExpense('Stadium Uber (equal)', {
      entryId: rideAtl.id,
      amountCents: 4800,
      currency: 'USD',
      paidBy: payerC,
      splitMode: 'equal',
      category: 'transport',
      splits: equalSplits(memberIds, 4800),
    })
  }

  // Hotel — custom (owner covers more)
  if (hotelAtl && memberIds.length >= 2) {
    const total = 120000
    const ownerShare = Math.round(total * 0.5)
    const rest = total - ownerShare
    const others = memberIds.filter((id) => id !== ownerId)
    const otherSplits = equalSplits(others, rest)
    await ensureExpense('Atlanta hotel nights (custom)', {
      entryId: hotelAtl.id,
      amountCents: total,
      currency: 'USD',
      paidBy: payerA,
      splitMode: 'custom',
      category: 'lodging',
      splits: [{ journeyPersonId: ownerId, amountCents: ownerShare }, ...otherSplits],
    })
  }

  // Car rental — equal
  if (rentalLax) {
    await ensureExpense('LAX rental car (equal)', {
      entryId: rentalLax.id,
      amountCents: 36000,
      currency: 'USD',
      paidBy: payerB,
      splitMode: 'equal',
      category: 'transport',
      splits: equalSplits(memberIds, 36000),
    })
  }

  // Final tickets EUR — multi-currency equal
  if (gameFinal) {
    await ensureExpense('Final tickets (equal EUR)', {
      entryId: gameFinal.id,
      amountCents: 90000,
      currency: 'EUR',
      paidBy: payerA,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(memberIds, 90000),
    })
  }

  if (mealFinal) {
    await ensureExpense('Final dinner (equal)', {
      entryId: mealFinal.id,
      amountCents: 21000,
      currency: 'USD',
      paidBy: payerB,
      splitMode: 'equal',
      category: 'food',
      splits: equalSplits(memberIds, 21000),
    })
  }

  const playlist = await listPlaylist(jid)
  const playlistUrls = new Set(playlist.map((p) => p.url))
  const wantPlaylist = [
    {
      url: 'https://www.youtube.com/watch?v=y6120QOlsfU',
      title: 'Spain vibes — road playlist',
      platform: 'youtube',
    },
    {
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
      title: 'World Cup energy',
      platform: 'spotify',
    },
  ]
  for (const item of wantPlaylist) {
    if (!playlistUrls.has(item.url)) {
      await addPlaylistItem(jid, item, user.id)
      playlistUrls.add(item.url)
    }
  }

  const summary = {
    journeyId: jid,
    title: journey.title,
    members: members.length,
    entries: (await listEntries(jid)).length,
    expenses: (await listExpensesForJourney(jid)).length,
    playlist: (await listPlaylist(jid)).length,
  }
  console.info('[viaggio] enrichSpainWorldCup done', summary)
  return summary
}

/** One-month solo road/rail trip Europe → Asia-Pacific. */
export async function seedEuApacRoadTrip() {
  const journey = await createJourney({
    title: 'Solo: EU → Asia-Pacific month',
    type: 'trip',
    preset: 'road_trip',
    defaultTimezone: 'Europe/Paris',
    defaultCurrency: 'EUR',
    startsOn: '2026-09-01',
    endsOn: '2026-09-30',
  })
  const jid = journey.id

  await addDrive(jid, {
    title: 'Paris → Lyon drive',
    startWall: '2026-09-01T09:00',
    startTz: 'Europe/Paris',
    endWall: '2026-09-01T14:00',
    endTz: 'Europe/Paris',
    from: 'Paris',
    to: 'Lyon',
  })
  await addHotel(jid, {
    title: 'Lyon overnight',
    checkIn: '2026-09-01T16:00',
    checkOut: '2026-09-03T10:00',
    tz: 'Europe/Paris',
    place: 'Lyon',
  })
  await addDrive(jid, {
    title: 'Lyon → Milan',
    startWall: '2026-09-03T08:00',
    startTz: 'Europe/Paris',
    endWall: '2026-09-03T14:30',
    endTz: 'Europe/Rome',
    from: 'Lyon',
    to: 'Milan',
  })
  await addHotel(jid, {
    title: 'Milan base',
    checkIn: '2026-09-03T16:00',
    checkOut: '2026-09-07T11:00',
    tz: 'Europe/Rome',
    place: 'Milan',
  })
  await addDrive(jid, {
    title: 'Milan → Venice → Ljubljana',
    startWall: '2026-09-07T08:30',
    startTz: 'Europe/Rome',
    endWall: '2026-09-07T18:00',
    endTz: 'Europe/Ljubljana',
    from: 'Milan',
    to: 'Ljubljana',
  })
  await addHotel(jid, {
    title: 'Ljubljana stay',
    checkIn: '2026-09-07T19:00',
    checkOut: '2026-09-10T10:00',
    tz: 'Europe/Ljubljana',
    place: 'Ljubljana',
  })
  await addFlight(jid, {
    title: 'LJU → IST → BKK',
    departWall: '2026-09-10T12:40',
    departTz: 'Europe/Ljubljana',
    arriveWall: '2026-09-11T06:55',
    arriveTz: 'Asia/Bangkok',
    from: 'Ljubljana LJU',
    to: 'Bangkok BKK',
    airline: 'Turkish',
  })
  await addHotel(jid, {
    title: 'Bangkok riverside',
    checkIn: '2026-09-11T14:00',
    checkOut: '2026-09-16T11:00',
    tz: 'Asia/Bangkok',
    place: 'Bangkok',
  })
  await addDrive(jid, {
    title: 'Bangkok → Hua Hin coastal drive',
    startWall: '2026-09-16T09:00',
    startTz: 'Asia/Bangkok',
    endWall: '2026-09-16T12:30',
    endTz: 'Asia/Bangkok',
    from: 'Bangkok',
    to: 'Hua Hin',
  })
  await addHotel(jid, {
    title: 'Hua Hin beach days',
    checkIn: '2026-09-16T14:00',
    checkOut: '2026-09-20T11:00',
    tz: 'Asia/Bangkok',
    place: 'Hua Hin',
  })
  await addFlight(jid, {
    title: 'BKK → SIN → SYD',
    departWall: '2026-09-20T19:30',
    departTz: 'Asia/Bangkok',
    arriveWall: '2026-09-21T09:45',
    arriveTz: 'Australia/Sydney',
    from: 'Bangkok BKK',
    to: 'Sydney SYD',
    airline: 'Singapore Airlines',
  })
  await addHotel(jid, {
    title: 'Sydney harbor stay',
    checkIn: '2026-09-21T14:00',
    checkOut: '2026-09-26T11:00',
    tz: 'Australia/Sydney',
    place: 'Sydney',
  })
  await addDrive(jid, {
    title: 'Sydney → Blue Mountains day drive',
    startWall: '2026-09-23T08:00',
    startTz: 'Australia/Sydney',
    endWall: '2026-09-23T18:00',
    endTz: 'Australia/Sydney',
    from: 'Sydney',
    to: 'Katoomba / Blue Mountains',
  })
  await addFlight(jid, {
    title: 'SYD → NRT',
    departWall: '2026-09-26T22:00',
    departTz: 'Australia/Sydney',
    arriveWall: '2026-09-27T06:10',
    arriveTz: 'Asia/Tokyo',
    from: 'Sydney SYD',
    to: 'Tokyo NRT',
    airline: 'ANA',
  })
  await addHotel(jid, {
    title: 'Tokyo wrap-up',
    checkIn: '2026-09-27T15:00',
    checkOut: '2026-09-30T11:00',
    tz: 'Asia/Tokyo',
    place: 'Shinjuku',
  })

  return journey
}

const SCANDI_TITLE = 'Scandi reunion — Class of ’16'

async function addMeal(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'meal',
    schema: 'meal',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.wall, opts.tz),
    timezone: opts.tz,
    placeName: opts.place || '',
    details: {},
    body: {},
  })
}

async function addSight(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'sightseeing',
    schema: 'place',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.wall, opts.tz),
    timezone: opts.tz,
    placeName: opts.place || '',
    details: {},
    body: {},
  })
}

async function addRideshare(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'rideshare',
    schema: 'transit',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.wall, opts.tz),
    timezone: opts.tz,
    placeName: opts.place || '',
    details: {
      provider: opts.provider || 'Uber',
      from: opts.from || '',
      to: opts.to || '',
    },
    body: {},
  })
}

async function addTrain(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'train',
    schema: 'transit',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.departWall, opts.tz),
    endsAt: wallTimeToUtcIso(opts.arriveWall, opts.tz),
    startTimezone: opts.tz,
    endTimezone: opts.tz,
    timezone: opts.tz,
    details: { from: opts.from, to: opts.to },
    placeName: opts.to,
    body: {},
  })
}

async function addBoat(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'boat',
    schema: 'transit',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.departWall, opts.tz),
    endsAt: wallTimeToUtcIso(opts.arriveWall, opts.tz),
    startTimezone: opts.tz,
    endTimezone: opts.tz,
    timezone: opts.tz,
    details: { from: opts.from, to: opts.to },
    placeName: opts.to,
    body: {},
  })
}

async function addRental(journeyId, opts) {
  return upsertEntry({
    journeyId,
    activityId: 'car_rental',
    schema: 'rental',
    title: opts.title,
    occursAt: wallTimeToUtcIso(opts.pickupWall, opts.tz),
    endsAt: wallTimeToUtcIso(opts.dropoffWall, opts.tz),
    startTimezone: opts.tz,
    endTimezone: opts.tz,
    timezone: opts.tz,
    placeName: opts.place || '',
    details: {
      provider: opts.provider || '',
      confirmation: opts.confirmation || '',
      pickup_location: opts.pickup || '',
      dropoff_location: opts.dropoff || '',
    },
    body: {},
  })
}

/**
 * 10-year college reunion — 2 weeks Scandinavia starting last week of Sep 2026.
 * Origins: LA (owner), Tokyo (user1), Paris (user2) → meet in Copenhagen.
 *
 * Usage (owner signed in):
 *   const { journey, inviteToken, inviteLink } = await __viaggioSeed.seedScandiReunion()
 * Then travelers open inviteLink / acceptInvite(token).
 * After 3 members:
 *   await __viaggioSeed.enrichScandiReunion()
 */
export async function seedScandiReunion() {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in as owner first')

  const existing = (await listJourneys()).find((j) => j.title === SCANDI_TITLE)
  if (existing) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    const inv = await createInvite(existing.id, 'editor', expires.toISOString())
    return {
      journey: existing,
      inviteToken: inv.token,
      inviteLink: inviteUrl(inv.token),
      reused: true,
    }
  }

  const journey = await createJourney({
    title: SCANDI_TITLE,
    type: 'trip',
    preset: 'leisure_trip',
    defaultTimezone: 'Europe/Copenhagen',
    defaultCurrency: 'EUR',
    startsOn: '2026-09-26',
    endsOn: '2026-10-10',
    activityPacks: [],
  })
  const jid = journey.id

  // --- Converge: home cities → Copenhagen ---
  await addFlight(jid, {
    title: 'LAX → CPH (Piseth)',
    departWall: '2026-09-26T15:40',
    departTz: 'America/Los_Angeles',
    arriveWall: '2026-09-27T11:05',
    arriveTz: 'Europe/Copenhagen',
    from: 'Los Angeles LAX',
    to: 'Copenhagen CPH',
    airline: 'SAS / Norse',
  })
  await addFlight(jid, {
    title: 'NRT → CPH (Tokyo crew)',
    departWall: '2026-09-26T11:20',
    departTz: 'Asia/Tokyo',
    arriveWall: '2026-09-27T16:40',
    arriveTz: 'Europe/Copenhagen',
    from: 'Tokyo NRT',
    to: 'Copenhagen CPH',
    airline: 'Finnair via HEL',
  })
  await addFlight(jid, {
    title: 'CDG → CPH (Paris crew)',
    departWall: '2026-09-27T09:15',
    departTz: 'Europe/Paris',
    arriveWall: '2026-09-27T11:05',
    arriveTz: 'Europe/Copenhagen',
    from: 'Paris CDG',
    to: 'Copenhagen CPH',
    airline: 'Air France',
  })
  await addRideshare(jid, {
    title: 'CPH airport → Indre By hotel',
    wall: '2026-09-27T12:00',
    tz: 'Europe/Copenhagen',
    place: 'Copenhagen',
    provider: 'Taxi',
    from: 'CPH Terminal 3',
    to: 'Hotel d’Angleterre area',
  })
  await addHotel(jid, {
    title: 'Copenhagen — Indre By base',
    checkIn: '2026-09-27T15:00',
    checkOut: '2026-09-30T11:00',
    tz: 'Europe/Copenhagen',
    place: 'Copenhagen city center',
    confirmation: 'REU-CPH-16',
  })
  await addMeal(jid, {
    title: 'Welcome dinner — Nyhavn (10-year toast)',
    wall: '2026-09-27T19:30',
    tz: 'Europe/Copenhagen',
    place: 'Nyhavn, Copenhagen',
  })

  // --- Copenhagen days ---
  await addSight(jid, {
    title: 'Tivoli Gardens afternoon',
    wall: '2026-09-28T14:00',
    tz: 'Europe/Copenhagen',
    place: 'Tivoli, Copenhagen',
  })
  await addMeal(jid, {
    title: 'Smørrebrød lunch — Torvehallerne',
    wall: '2026-09-28T12:30',
    tz: 'Europe/Copenhagen',
    place: 'Torvehallerne',
  })
  await addBoat(jid, {
    title: 'Copenhagen canal harbour tour',
    departWall: '2026-09-28T16:00',
    arriveWall: '2026-09-28T17:00',
    tz: 'Europe/Copenhagen',
    from: 'Nyhavn',
    to: 'Nyhavn (loop)',
  })
  await addSight(jid, {
    title: 'Louisiana Museum day trip',
    wall: '2026-09-29T10:30',
    tz: 'Europe/Copenhagen',
    place: 'Humlebæk',
  })
  await addTrain(jid, {
    title: 'Øresundståg CPH → Humlebæk',
    departWall: '2026-09-29T09:20',
    arriveWall: '2026-09-29T10:00',
    tz: 'Europe/Copenhagen',
    from: 'København H',
    to: 'Humlebæk',
  })
  await addMeal(jid, {
    title: 'Dinner — Nørrebro (reunion stories)',
    wall: '2026-09-29T20:00',
    tz: 'Europe/Copenhagen',
    place: 'Nørrebro',
  })

  // --- Copenhagen → Stockholm ---
  await addTrain(jid, {
    title: 'SJ X2000 CPH → Stockholm',
    departWall: '2026-09-30T08:14',
    arriveWall: '2026-09-30T13:35',
    tz: 'Europe/Stockholm',
    from: 'København H',
    to: 'Stockholm C',
  })
  await addHotel(jid, {
    title: 'Stockholm — Gamla Stan / Old Town',
    checkIn: '2026-09-30T15:00',
    checkOut: '2026-10-04T11:00',
    tz: 'Europe/Stockholm',
    place: 'Gamla Stan, Stockholm',
    confirmation: 'REU-STO-16',
  })
  await addMeal(jid, {
    title: 'Fika + cinnamon buns — Gamla Stan',
    wall: '2026-09-30T16:00',
    tz: 'Europe/Stockholm',
    place: 'Gamla Stan',
  })
  await addSight(jid, {
    title: 'Vasa Museum',
    wall: '2026-10-01T10:00',
    tz: 'Europe/Stockholm',
    place: 'Djurgården',
  })
  await addSight(jid, {
    title: 'Fotografiska + Södermalm walk',
    wall: '2026-10-01T14:30',
    tz: 'Europe/Stockholm',
    place: 'Södermalm',
  })
  await addMeal(jid, {
    title: 'Dinner — Östermalms Saluhall area',
    wall: '2026-10-01T19:30',
    tz: 'Europe/Stockholm',
    place: 'Östermalm',
  })
  await addBoat(jid, {
    title: 'Stockholm archipelago day cruise',
    departWall: '2026-10-02T09:30',
    arriveWall: '2026-10-02T17:00',
    tz: 'Europe/Stockholm',
    from: 'Strömkajen',
    to: 'Vaxholm / return',
  })
  await addMeal(jid, {
    title: 'Archipelago lunch ashore',
    wall: '2026-10-02T12:30',
    tz: 'Europe/Stockholm',
    place: 'Vaxholm',
  })
  await addSight(jid, {
    title: 'City Hall + Nobel tour',
    wall: '2026-10-03T11:00',
    tz: 'Europe/Stockholm',
    place: 'Stadshuset, Stockholm',
  })
  await addMeal(jid, {
    title: 'Class of ’16 tasting menu night',
    wall: '2026-10-03T19:00',
    tz: 'Europe/Stockholm',
    place: 'Stockholm',
  })

  // --- Stockholm → Oslo ---
  await addFlight(jid, {
    title: 'ARN → OSL',
    departWall: '2026-10-04T10:25',
    departTz: 'Europe/Stockholm',
    arriveWall: '2026-10-04T11:20',
    arriveTz: 'Europe/Oslo',
    from: 'Stockholm ARN',
    to: 'Oslo OSL',
    airline: 'SAS',
  })
  await addRideshare(jid, {
    title: 'OSL → Grünerløkka hotel',
    wall: '2026-10-04T12:15',
    tz: 'Europe/Oslo',
    place: 'Oslo',
    provider: 'Vy Flytoget + taxi',
    from: 'OSL',
    to: 'Grünerløkka',
  })
  await addHotel(jid, {
    title: 'Oslo — Grünerløkka base',
    checkIn: '2026-10-04T15:00',
    checkOut: '2026-10-07T11:00',
    tz: 'Europe/Oslo',
    place: 'Oslo',
    confirmation: 'REU-OSL-16',
  })
  await addSight(jid, {
    title: 'Oslo Opera House roof walk',
    wall: '2026-10-04T17:00',
    tz: 'Europe/Oslo',
    place: 'Operahuset',
  })
  await addMeal(jid, {
    title: 'Dinner — Aker Brygge waterfront',
    wall: '2026-10-04T20:00',
    tz: 'Europe/Oslo',
    place: 'Aker Brygge',
  })
  await addSight(jid, {
    title: 'Vigeland Park + Munch Museum',
    wall: '2026-10-05T10:00',
    tz: 'Europe/Oslo',
    place: 'Frogner / Bjørvika',
  })
  await addMeal(jid, {
    title: 'Lunch — Mathallen food hall',
    wall: '2026-10-05T13:30',
    tz: 'Europe/Oslo',
    place: 'Mathallen Oslo',
  })
  await addSight(jid, {
    title: 'Holmenkollen ski jump viewpoint',
    wall: '2026-10-06T11:00',
    tz: 'Europe/Oslo',
    place: 'Holmenkollen',
  })
  await addMeal(jid, {
    title: 'Farewell-Oslo seafood dinner',
    wall: '2026-10-06T19:30',
    tz: 'Europe/Oslo',
    place: 'Oslo fjord side',
  })

  // --- Oslo → Bergen + fjords ---
  await addFlight(jid, {
    title: 'OSL → BGO',
    departWall: '2026-10-07T09:10',
    departTz: 'Europe/Oslo',
    arriveWall: '2026-10-07T10:05',
    arriveTz: 'Europe/Oslo',
    from: 'Oslo OSL',
    to: 'Bergen BGO',
    airline: 'Widerøe / SAS',
  })
  await addHotel(jid, {
    title: 'Bergen — Bryggen waterfront',
    checkIn: '2026-10-07T14:00',
    checkOut: '2026-10-10T11:00',
    tz: 'Europe/Oslo',
    place: 'Bryggen, Bergen',
    confirmation: 'REU-BGO-16',
  })
  await addSight(jid, {
    title: 'Bryggen wharf + Fløibanen',
    wall: '2026-10-07T15:30',
    tz: 'Europe/Oslo',
    place: 'Bergen',
  })
  await addMeal(jid, {
    title: 'Bergen fish soup — Torget',
    wall: '2026-10-07T18:30',
    tz: 'Europe/Oslo',
    place: 'Fish Market, Bergen',
  })
  await addRental(jid, {
    title: 'Bergen car — Hardangerfjord day',
    pickupWall: '2026-10-08T08:30',
    dropoffWall: '2026-10-08T19:00',
    tz: 'Europe/Oslo',
    place: 'Bergen',
    provider: 'Hertz',
    confirmation: 'REU-CAR-BGO',
    pickup: 'Bergen city / BGO',
    dropoff: 'Bergen city / BGO',
  })
  await addDrive(jid, {
    title: 'Hardangerfjord scenic loop',
    startWall: '2026-10-08T09:00',
    startTz: 'Europe/Oslo',
    endWall: '2026-10-08T18:00',
    endTz: 'Europe/Oslo',
    from: 'Bergen',
    to: 'Norheimsund / return',
  })
  await addMeal(jid, {
    title: 'Fjord-side lunch (cider country)',
    wall: '2026-10-08T13:00',
    tz: 'Europe/Oslo',
    place: 'Hardanger',
  })
  await addTrain(jid, {
    title: 'Flåm Railway day (Bergen line connection)',
    departWall: '2026-10-09T08:40',
    arriveWall: '2026-10-09T17:30',
    tz: 'Europe/Oslo',
    from: 'Bergen',
    to: 'Flåm / Myrdal loop',
  })
  await addBoat(jid, {
    title: 'Nærøyfjord sightseeing cruise',
    departWall: '2026-10-09T11:00',
    arriveWall: '2026-10-09T13:00',
    tz: 'Europe/Oslo',
    from: 'Flåm',
    to: 'Gudvangen / return',
  })
  await addMeal(jid, {
    title: 'Final reunion dinner — Bergen',
    wall: '2026-10-09T20:00',
    tz: 'Europe/Oslo',
    place: 'Bergen',
  })

  // --- Homebound ---
  await addFlight(jid, {
    title: 'BGO → LAX (Piseth home)',
    departWall: '2026-10-10T12:30',
    departTz: 'Europe/Oslo',
    arriveWall: '2026-10-10T16:05',
    arriveTz: 'America/Los_Angeles',
    from: 'Bergen BGO',
    to: 'Los Angeles LAX',
    airline: 'via AMS / Delta',
  })
  await addFlight(jid, {
    title: 'BGO → NRT (Tokyo crew home)',
    departWall: '2026-10-10T13:15',
    departTz: 'Europe/Oslo',
    arriveWall: '2026-10-11T10:40',
    arriveTz: 'Asia/Tokyo',
    from: 'Bergen BGO',
    to: 'Tokyo NRT',
    airline: 'via HEL / Finnair',
  })
  await addFlight(jid, {
    title: 'BGO → CDG (Paris crew home)',
    departWall: '2026-10-10T11:05',
    departTz: 'Europe/Oslo',
    arriveWall: '2026-10-10T14:20',
    arriveTz: 'Europe/Paris',
    from: 'Bergen BGO',
    to: 'Paris CDG',
    airline: 'via AMS / KLM',
  })

  const {
    data: { user: u2 },
  } = await supabase.auth.getUser()
  await addPlaylistItem(
    jid,
    {
      url: 'https://open.spotify.com/track/1rqqCSm0Qe4I9rUvWncaom',
      title: 'High Hopes — Panic! At The Disco',
      platform: 'spotify',
    },
    u2.id,
  )
  await addPlaylistItem(
    jid,
    {
      url: 'https://www.youtube.com/watch?v=8xg3vE8Ie_E',
      title: 'Fjords from the Flåm line',
      platform: 'youtube',
    },
    u2.id,
  )

  const expires = new Date()
  expires.setDate(expires.getDate() + 30)
  const inv = await createInvite(jid, 'editor', expires.toISOString())

  const summary = {
    journey,
    inviteToken: inv.token,
    inviteLink: inviteUrl(inv.token),
    reused: false,
  }
  console.info('[viaggio] seedScandiReunion', summary)
  return summary
}

/**
 * After Tokyo + Paris travelers have accepted the invite, attach 3-way expenses.
 */
export async function enrichScandiReunion(journeyId) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in first')

  let journey
  if (journeyId) {
    journey = (await listJourneys()).find((j) => j.id === journeyId)
  } else {
    journey = (await listJourneys()).find((j) => j.title === SCANDI_TITLE)
  }
  if (!journey) throw new Error('Scandi reunion journey not found')

  const jid = journey.id
  const members = await listMembers(jid)
  if (members.length < 3) {
    throw new Error(
      `Need 3 members for reunion splits (found ${members.length}). Accept invite first.`,
    )
  }

  const { map: personOf } = await rosterByUserId(jid)
  const memberIds = members
    .map((m) => personOf.get(m.userId))
    .filter(Boolean)
  if (memberIds.length < 3) {
    throw new Error(
      'Need journey roster people for members (run journey_people.sql patch).',
    )
  }
  const ownerUserId =
    members.find((m) => m.role === 'owner')?.userId || user.id
  const ownerId = personOf.get(ownerUserId)
  const others = memberIds.filter((id) => id !== ownerId)
  const tokyoId = others[0]
  const parisId = others[1] || others[0]

  const entries = await listEntries(jid)
  const existingExpenses = await listExpensesForJourney(jid)
  const expenseTitles = new Set(existingExpenses.map((x) => x.title))

  async function ensureExpense(title, input) {
    if (expenseTitles.has(title)) return null
    const row = await upsertExpenseWithSplits({ ...input, title })
    expenseTitles.add(title)
    return row
  }

  const byTitle = (t) => entryByTitle(entries, t)

  const welcome = byTitle('Welcome dinner — Nyhavn (10-year toast)')
  if (welcome) {
    await ensureExpense('Nyhavn welcome dinner (equal DKK)', {
      entryId: welcome.id,
      amountCents: 240000,
      currency: 'DKK',
      paidBy: ownerId,
      splitMode: 'equal',
      category: 'food',
      splits: equalSplits(memberIds, 240000),
    })
  }

  const hotelCph = byTitle('Copenhagen — Indre By base')
  if (hotelCph) {
    const total = 960000
    const ownerShare = Math.round(total * 0.4)
    const rest = total - ownerShare
    await ensureExpense('Copenhagen hotel (custom DKK)', {
      entryId: hotelCph.id,
      amountCents: total,
      currency: 'DKK',
      paidBy: ownerId,
      splitMode: 'custom',
      category: 'lodging',
      splits: [
        { journeyPersonId: ownerId, amountCents: ownerShare },
        ...equalSplits(others, rest),
      ],
    })
  }

  const louisiana = byTitle('Louisiana Museum day trip')
  if (louisiana) {
    await ensureExpense('Louisiana tickets + train (equal DKK)', {
      entryId: louisiana.id,
      amountCents: 135000,
      currency: 'DKK',
      paidBy: parisId,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(memberIds, 135000),
    })
  }

  const sj = byTitle('SJ X2000 CPH → Stockholm')
  if (sj) {
    await ensureExpense('SJ X2000 tickets (equal SEK)', {
      entryId: sj.id,
      amountCents: 360000,
      currency: 'SEK',
      paidBy: tokyoId,
      splitMode: 'equal',
      category: 'transport',
      splits: equalSplits(memberIds, 360000),
    })
  }

  const hotelSto = byTitle('Stockholm — Gamla Stan / Old Town')
  if (hotelSto) {
    await ensureExpense('Stockholm hotel nights (equal SEK)', {
      entryId: hotelSto.id,
      amountCents: 1280000,
      currency: 'SEK',
      paidBy: tokyoId,
      splitMode: 'equal',
      category: 'lodging',
      splits: equalSplits(memberIds, 1280000),
    })
  }

  const arch = byTitle('Stockholm archipelago day cruise')
  if (arch) {
    await ensureExpense('Archipelago cruise (equal SEK)', {
      entryId: arch.id,
      amountCents: 210000,
      currency: 'SEK',
      paidBy: ownerId,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(memberIds, 210000),
    })
  }

  const tasting = byTitle('Class of ’16 tasting menu night')
  if (tasting) {
    const total = 540000
    await ensureExpense('Tasting menu night (custom SEK)', {
      entryId: tasting.id,
      amountCents: total,
      currency: 'SEK',
      paidBy: parisId,
      splitMode: 'custom',
      category: 'food',
      splits: [
        { journeyPersonId: ownerId, amountCents: 200000 },
        { journeyPersonId: tokyoId, amountCents: 170000 },
        { journeyPersonId: parisId, amountCents: 170000 },
      ],
    })
  }

  const hotelOsl = byTitle('Oslo — Grünerløkka base')
  if (hotelOsl) {
    await ensureExpense('Oslo hotel (equal NOK)', {
      entryId: hotelOsl.id,
      amountCents: 990000,
      currency: 'NOK',
      paidBy: parisId,
      splitMode: 'equal',
      category: 'lodging',
      splits: equalSplits(memberIds, 990000),
    })
  }

  const munch = byTitle('Vigeland Park + Munch Museum')
  if (munch) {
    await ensureExpense('Munch + transit day pass (equal NOK)', {
      entryId: munch.id,
      amountCents: 120000,
      currency: 'NOK',
      paidBy: tokyoId,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(memberIds, 120000),
    })
  }

  const hotelBgo = byTitle('Bergen — Bryggen waterfront')
  if (hotelBgo) {
    await ensureExpense('Bergen hotel (equal NOK)', {
      entryId: hotelBgo.id,
      amountCents: 870000,
      currency: 'NOK',
      paidBy: ownerId,
      splitMode: 'equal',
      category: 'lodging',
      splits: equalSplits(memberIds, 870000),
    })
  }

  const rental = byTitle('Bergen car — Hardangerfjord day')
  if (rental) {
    await ensureExpense('Hardanger car + fuel (equal NOK)', {
      entryId: rental.id,
      amountCents: 280000,
      currency: 'NOK',
      paidBy: ownerId,
      splitMode: 'equal',
      category: 'transport',
      splits: equalSplits(memberIds, 280000),
    })
  }

  const flam = byTitle('Flåm Railway day (Bergen line connection)')
  if (flam) {
    await ensureExpense('Flåm Railway + fjord cruise (equal NOK)', {
      entryId: flam.id,
      amountCents: 450000,
      currency: 'NOK',
      paidBy: parisId,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(memberIds, 450000),
    })
  }

  const finalDinner = byTitle('Final reunion dinner — Bergen')
  if (finalDinner) {
    await ensureExpense('Final reunion dinner (equal NOK)', {
      entryId: finalDinner.id,
      amountCents: 360000,
      currency: 'NOK',
      paidBy: tokyoId,
      splitMode: 'equal',
      category: 'food',
      splits: equalSplits(memberIds, 360000),
    })
  }

  // Shared EUR buffer for intercity flights booked as a group
  const arnOsl = byTitle('ARN → OSL')
  if (arnOsl) {
    await ensureExpense('ARN→OSL group fares (equal EUR)', {
      entryId: arnOsl.id,
      amountCents: 42000,
      currency: 'EUR',
      paidBy: ownerId,
      splitMode: 'equal',
      category: 'transport',
      splits: equalSplits(memberIds, 42000),
    })
  }

  const summary = {
    journeyId: jid,
    title: journey.title,
    members: members.length,
    entries: entries.length,
    expenses: (await listExpensesForJourney(jid)).length,
    playlist: (await listPlaylist(jid)).length,
  }
  console.info('[viaggio] enrichScandiReunion done', summary)
  return summary
}

async function resolveScandiJourney(journeyId) {
  if (journeyId) {
    const hit = (await listJourneys()).find((j) => j.id === journeyId)
    if (!hit) throw new Error(`Journey ${journeyId} not found`)
    return hit
  }
  const byTitle = (await listJourneys()).find((j) => j.title === SCANDI_TITLE)
  if (!byTitle) throw new Error('Scandi reunion journey not found')
  return byTitle
}

async function ensureEntryByTitle(entries, title, create) {
  const existing = entryByTitle(entries, title)
  if (existing) return existing
  const row = await create()
  entries.push(row)
  return row
}

/**
 * Run while signed in as Benjamin (Tokyo). Updates return flight + Stockholm leg.
 */
export async function asBenjaminEnrichScandi(journeyId) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in as Benjamin first')

  await supabase
    .from('profiles')
    .update({ display_name: 'Benjamin Bing' })
    .eq('id', user.id)

  const journey = await resolveScandiJourney(journeyId)
  const jid = journey.id
  const people = await listJourneyPeople(jid)
  const byName = (name) =>
    people.find((p) => p.displayName === name) ||
    people.find((p) => p.linkedUserId === user.id)
  const me = byName('Benjamin Bing')
  const owner = byName('Piseth Peou') || people.find((p) => !p.linkedUserId || p.displayName?.includes('Piseth'))
  const charlie = byName('Charlie Charming')
  const david = byName('David Doughlas')
  if (!me) throw new Error('Benjamin seat not on roster')
  const all = [owner?.id, me.id, charlie?.id, david?.id].filter(Boolean)
  // ×3 activities: Benjamin’s party — not the whole roster (keeps owner off the bill).
  const party3 = [me.id, charlie?.id, david?.id].filter(Boolean).slice(0, 3)

  const entries = await listEntries(jid)

  const ret =
    entryByTitle(entries, 'BGO → NRT (Benjamin home — TBD confirm)') ||
    entryByTitle(entries, 'BGO → NRT (Benjamin home)') ||
    entryByTitle(entries, 'BGO → NRT (Tokyo crew home)')
  if (ret) {
    await upsertEntry({
      id: ret.id,
      journeyId: jid,
      activityId: 'flight',
      schema: 'transit',
      title: 'BGO → NRT (Benjamin home)',
      occursAt: wallTimeToUtcIso('2026-10-10T11:40', 'Europe/Oslo'),
      endsAt: wallTimeToUtcIso('2026-10-11T08:15', 'Asia/Tokyo'),
      startTimezone: 'Europe/Oslo',
      endTimezone: 'Asia/Tokyo',
      timezone: 'Asia/Tokyo',
      placeName: 'Tokyo Narita',
      details: {
        from: 'Bergen BGO',
        to: 'Tokyo NRT',
        airline: 'ANA via FRA',
        confirmation: 'BB-RET-01',
      },
      body: {},
      participantIds: [me.id],
    })
  }

  await ensureEntryByTitle(entries, 'Stockholm — Hotel At Six', () =>
    upsertEntry({
      journeyId: jid,
      activityId: 'hotel',
      schema: 'lodging',
      title: 'Stockholm — Hotel At Six',
      occursAt: wallTimeToUtcIso('2026-09-29T15:00', 'Europe/Stockholm'),
      endsAt: wallTimeToUtcIso('2026-10-02T11:00', 'Europe/Stockholm'),
      timezone: 'Europe/Stockholm',
      placeName: 'Brunkebergstorg 6, Stockholm',
      details: { confirmation: 'AT6-4421' },
      body: {},
      participantIds: all,
    }),
  )
  await ensureEntryByTitle(entries, 'SJ X2000 CPH → Stockholm', () =>
    addTrain(jid, {
      title: 'SJ X2000 CPH → Stockholm',
      departWall: '2026-09-29T08:14',
      arriveWall: '2026-09-29T13:35',
      tz: 'Europe/Stockholm',
      from: 'København H',
      to: 'Stockholm C',
    }),
  )
  const vasa = await ensureEntryByTitle(entries, 'Vasa Museum', () =>
    addSight(jid, {
      title: 'Vasa Museum',
      wall: '2026-09-30T10:00',
      tz: 'Europe/Stockholm',
      place: 'Djurgården',
    }),
  )
  await ensureEntryByTitle(entries, 'Fika at Vete-Katten', () =>
    addMeal(jid, {
      title: 'Fika at Vete-Katten',
      wall: '2026-09-30T15:00',
      tz: 'Europe/Stockholm',
      place: 'Kungsgatan 55, Stockholm',
    }),
  )
  const abba = await ensureEntryByTitle(entries, 'ABBA The Museum', () =>
    addSight(jid, {
      title: 'ABBA The Museum',
      wall: '2026-10-01T11:00',
      tz: 'Europe/Stockholm',
      place: 'Djurgårdsvägen 68, Stockholm',
    }),
  )
  await ensureEntryByTitle(entries, 'Dinner at Pelikan', () =>
    addMeal(jid, {
      title: 'Dinner at Pelikan',
      wall: '2026-10-01T19:00',
      tz: 'Europe/Stockholm',
      place: 'Blekingegatan 40, Stockholm',
    }),
  )
  const sjOslo = await ensureEntryByTitle(
    entries,
    'SJ X2000 · Stockholm → Oslo',
    () =>
      addTrain(jid, {
        title: 'SJ X2000 · Stockholm → Oslo',
        departWall: '2026-10-02T08:21',
        arriveWall: '2026-10-02T14:45',
        tz: 'Europe/Stockholm',
        from: 'Stockholm C',
        to: 'Oslo S',
      }),
  )
  await ensureEntryByTitle(entries, 'Stockholm archipelago day cruise', () =>
    addBoat(jid, {
      title: 'Stockholm archipelago day cruise',
      departWall: '2026-10-01T09:30',
      arriveWall: '2026-10-01T16:30',
      tz: 'Europe/Stockholm',
      from: 'Strömkajen',
      to: 'Vaxholm / return',
    }),
  )

  const existingExpenses = await listExpensesForJourney(jid)
  const normalizeExpenseTitle = (t) =>
    String(t || '')
      .replace(/[×x]/gi, 'x')
      .replace(/→/g, '->')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
  const existingByNorm = new Map(
    existingExpenses.map((x) => [normalizeExpenseTitle(x.title), x]),
  )
  async function ensureExpense(title, input) {
    const prev = existingByNorm.get(normalizeExpenseTitle(title))
    const row = await upsertExpenseWithSplits({
      ...input,
      id: prev?.id,
      title,
    })
    existingByNorm.set(normalizeExpenseTitle(title), row)
    return row
  }

  if (vasa && party3.length) {
    await ensureExpense('Vasa Museum tickets ×3', {
      entryId: vasa.id,
      amountCents: 5700,
      currency: 'EUR',
      paidBy: me.id,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(party3, 5700),
    })
  }
  if (abba && party3.length) {
    await ensureExpense('ABBA Museum tickets ×3', {
      entryId: abba.id,
      amountCents: 8100,
      currency: 'EUR',
      paidBy: me.id,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(party3, 8100),
    })
  }
  if (sjOslo && party3.length) {
    await ensureExpense('SJ train Stockholm → Oslo', {
      entryId: sjOslo.id,
      amountCents: 21000,
      currency: 'EUR',
      paidBy: me.id,
      splitMode: 'equal',
      category: 'transport',
      splits: equalSplits(party3, 21000),
    })
  }

  const playlist = await listPlaylist(jid)
  const urls = new Set(playlist.map((p) => p.url))
  const wants = [
    {
      url: 'https://open.spotify.com/track/0DiWol3AO6WpXZgp0goxAV',
      title: 'One More Time — Daft Punk',
      platform: 'spotify',
    },
    {
      url: 'https://www.youtube.com/watch?v=YkgkThdzX-8',
      title: 'Stockholm walking tour',
      platform: 'youtube',
    },
  ]
  for (const item of wants) {
    if (!urls.has(item.url)) {
      await addPlaylistItem(jid, item, user.id)
      urls.add(item.url)
    }
  }

  const summary = {
    as: 'Benjamin Bing',
    journeyId: jid,
    entries: (await listEntries(jid)).length,
    expenses: (await listExpensesForJourney(jid)).length,
    playlist: (await listPlaylist(jid)).length,
  }
  console.info('[viaggio] asBenjaminEnrichScandi', summary)
  return summary
}

/**
 * Run while signed in as Charlie (Paris). Updates return flight + Oslo/Bergen leg.
 */
export async function asCharlieEnrichScandi(journeyId) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in as Charlie first')

  await supabase
    .from('profiles')
    .update({ display_name: 'Charlie Charming' })
    .eq('id', user.id)

  const journey = await resolveScandiJourney(journeyId)
  const jid = journey.id
  const people = await listJourneyPeople(jid)
  const byName = (name) => people.find((p) => p.displayName === name)
  const me = byName('Charlie Charming') || people.find((p) => p.linkedUserId === user.id)
  const owner = byName('Piseth Peou')
  const benjamin = byName('Benjamin Bing')
  const david = byName('David Doughlas')
  if (!me) throw new Error('Charlie seat not on roster')
  const all = [owner?.id, benjamin?.id, me.id, david?.id].filter(Boolean)
  // ×3 activities: Charlie’s party — not the whole roster (keeps owner off the bill).
  const party3 = [me.id, benjamin?.id, david?.id].filter(Boolean).slice(0, 3)

  const entries = await listEntries(jid)

  const ret =
    entryByTitle(entries, 'BGO → CDG (Charlie home — TBD confirm)') ||
    entryByTitle(entries, 'BGO → CDG (Charlie home)') ||
    entryByTitle(entries, 'BGO → CDG (Paris crew home)')
  if (ret) {
    await upsertEntry({
      id: ret.id,
      journeyId: jid,
      activityId: 'flight',
      schema: 'transit',
      title: 'BGO → CDG (Charlie home)',
      occursAt: wallTimeToUtcIso('2026-10-10T13:05', 'Europe/Oslo'),
      endsAt: wallTimeToUtcIso('2026-10-10T16:40', 'Europe/Paris'),
      startTimezone: 'Europe/Oslo',
      endTimezone: 'Europe/Paris',
      timezone: 'Europe/Paris',
      placeName: 'Paris CDG',
      details: {
        from: 'Bergen BGO',
        to: 'Paris CDG',
        airline: 'Air France',
        confirmation: 'CC-RET-01',
      },
      body: {},
      participantIds: [me.id],
    })
  }

  await ensureEntryByTitle(entries, 'Hotel Bristol, Oslo', () =>
    upsertEntry({
      journeyId: jid,
      activityId: 'hotel',
      schema: 'lodging',
      title: 'Hotel Bristol, Oslo',
      occursAt: wallTimeToUtcIso('2026-10-02T16:00', 'Europe/Oslo'),
      endsAt: wallTimeToUtcIso('2026-10-05T11:00', 'Europe/Oslo'),
      timezone: 'Europe/Oslo',
      placeName: 'Kristian IVs gate 7, Oslo',
      details: { confirmation: 'BRIS-881' },
      body: {},
      participantIds: all,
    }),
  )
  await ensureEntryByTitle(entries, 'Vigeland Park', () =>
    addSight(jid, {
      title: 'Vigeland Park',
      wall: '2026-10-03T10:00',
      tz: 'Europe/Oslo',
      place: 'Nobels gate 32, Oslo',
    }),
  )
  const munch = await ensureEntryByTitle(entries, 'Munch Museum', () =>
    addSight(jid, {
      title: 'Munch Museum',
      wall: '2026-10-03T14:00',
      tz: 'Europe/Oslo',
      place: 'Edvard Munchs plass 1, Oslo',
    }),
  )
  const maaemo = await ensureEntryByTitle(entries, 'Dinner at Maaemo', () =>
    addMeal(jid, {
      title: 'Dinner at Maaemo',
      wall: '2026-10-03T18:30',
      tz: 'Europe/Oslo',
      place: 'Dronning Eufemias gate 23, Oslo',
    }),
  )
  const fjordBoat = await ensureEntryByTitle(entries, 'Oslofjord mini cruise', () =>
    addBoat(jid, {
      title: 'Oslofjord mini cruise',
      departWall: '2026-10-04T09:00',
      arriveWall: '2026-10-04T12:00',
      tz: 'Europe/Oslo',
      from: 'Rådhusbrygge',
      to: 'Rådhusbrygge',
    }),
  )
  await ensureEntryByTitle(entries, 'Vy train · Oslo → Bergen', () =>
    addTrain(jid, {
      title: 'Vy train · Oslo → Bergen',
      departWall: '2026-10-05T08:25',
      arriveWall: '2026-10-05T15:00',
      tz: 'Europe/Oslo',
      from: 'Oslo S',
      to: 'Bergen',
    }),
  )
  await ensureEntryByTitle(entries, 'Clarion Hotel Admiral, Bergen', () =>
    upsertEntry({
      journeyId: jid,
      activityId: 'hotel',
      schema: 'lodging',
      title: 'Clarion Hotel Admiral, Bergen',
      occursAt: wallTimeToUtcIso('2026-10-05T16:00', 'Europe/Oslo'),
      endsAt: wallTimeToUtcIso('2026-10-10T11:00', 'Europe/Oslo'),
      timezone: 'Europe/Oslo',
      placeName: 'C. Sundts gate 9, Bergen',
      details: { confirmation: 'ADM-2209' },
      body: {},
      participantIds: all,
    }),
  )
  const floyen = await ensureEntryByTitle(
    entries,
    'Fløibanen funicular + Mount Fløyen',
    () =>
      addSight(jid, {
        title: 'Fløibanen funicular + Mount Fløyen',
        wall: '2026-10-06T09:30',
        tz: 'Europe/Oslo',
        place: 'Vetrlidsallmenningen 23A, Bergen',
      }),
  )
  const naeroy = await ensureEntryByTitle(
    entries,
    'Norled ferry · Bergen → Flåm (Nærøyfjord)',
    () =>
      upsertEntry({
        journeyId: jid,
        activityId: 'ferry',
        schema: 'transit',
        title: 'Norled ferry · Bergen → Flåm (Nærøyfjord)',
        occursAt: wallTimeToUtcIso('2026-10-07T08:00', 'Europe/Oslo'),
        endsAt: wallTimeToUtcIso('2026-10-07T13:30', 'Europe/Oslo'),
        startTimezone: 'Europe/Oslo',
        endTimezone: 'Europe/Oslo',
        timezone: 'Europe/Oslo',
        placeName: 'Flåm',
        details: {
          from: 'Bergen',
          to: 'Flåm',
          vessel: 'Vision of the Fjords',
          confirmation: 'NR-FER-07',
        },
        body: {},
        participantIds: all,
      }),
  )
  await ensureEntryByTitle(entries, 'Bryggen Wharf walk', () =>
    addSight(jid, {
      title: 'Bryggen Wharf walk',
      wall: '2026-10-08T10:00',
      tz: 'Europe/Oslo',
      place: 'Bryggen, Bergen',
    }),
  )
  await ensureEntryByTitle(entries, 'Seafood lunch at Fisketorget', () =>
    addMeal(jid, {
      title: 'Seafood lunch at Fisketorget',
      wall: '2026-10-08T13:00',
      tz: 'Europe/Oslo',
      place: 'Torget, Bergen',
    }),
  )
  await ensureEntryByTitle(entries, 'Closing night · hotel sauna + cards', () =>
    upsertEntry({
      journeyId: jid,
      activityId: 'group_activity',
      schema: 'event',
      title: 'Closing night · hotel sauna + cards',
      occursAt: wallTimeToUtcIso('2026-10-09T20:00', 'Europe/Oslo'),
      timezone: 'Europe/Oslo',
      placeName: 'Clarion Hotel Admiral, Bergen',
      details: {},
      body: {},
      participantIds: all,
    }),
  )

  const existingExpenses = await listExpensesForJourney(jid)
  const normalizeExpenseTitle = (t) =>
    String(t || '')
      .replace(/[×x]/gi, 'x')
      .replace(/→/g, '->')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
  const existingByNorm = new Map(
    existingExpenses.map((x) => [normalizeExpenseTitle(x.title), x]),
  )
  async function ensureExpense(title, input) {
    const prev = existingByNorm.get(normalizeExpenseTitle(title))
    const row = await upsertExpenseWithSplits({
      ...input,
      id: prev?.id,
      title,
    })
    existingByNorm.set(normalizeExpenseTitle(title), row)
    return row
  }

  if (munch && party3.length) {
    await ensureExpense('Munch Museum tickets ×3', {
      entryId: munch.id,
      amountCents: 4800,
      currency: 'EUR',
      paidBy: me.id,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(party3, 4800),
    })
  }
  if (fjordBoat && party3.length) {
    await ensureExpense('Oslofjord boat cruise ×3', {
      entryId: fjordBoat.id,
      amountCents: 7500,
      currency: 'EUR',
      paidBy: me.id,
      splitMode: 'equal',
      category: 'transport',
      splits: equalSplits(party3, 7500),
    })
  }
  if (naeroy && party3.length) {
    await ensureExpense('Norled Nærøyfjord ferry ×3', {
      entryId: naeroy.id,
      amountCents: 24000,
      currency: 'EUR',
      paidBy: me.id,
      splitMode: 'equal',
      category: 'transport',
      splits: equalSplits(party3, 24000),
    })
  }
  if (floyen && party3.length) {
    await ensureExpense('Fløibanen funicular ×3', {
      entryId: floyen.id,
      amountCents: 3600,
      currency: 'EUR',
      paidBy: me.id,
      splitMode: 'equal',
      category: 'tickets',
      splits: equalSplits(party3, 3600),
    })
  }
  if (maaemo && party3.length) {
    await ensureExpense('Dinner at Maaemo (Charlie treat)', {
      entryId: maaemo.id,
      amountCents: 45000,
      currency: 'EUR',
      paidBy: me.id,
      splitMode: 'equal',
      category: 'food',
      splits: equalSplits(party3, 45000),
    })
  }

  const playlist = await listPlaylist(jid)
  const urls = new Set(playlist.map((p) => p.url))
  const wants = [
    {
      url: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
      title: 'Blinding Lights — The Weeknd',
      platform: 'spotify',
    },
    {
      url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
      title: 'Norway fjords drone',
      platform: 'youtube',
    },
  ]
  for (const item of wants) {
    if (!urls.has(item.url)) {
      await addPlaylistItem(jid, item, user.id)
      urls.add(item.url)
    }
  }

  const summary = {
    as: 'Charlie Charming',
    journeyId: jid,
    entries: (await listEntries(jid)).length,
    expenses: (await listExpensesForJourney(jid)).length,
    playlist: (await listPlaylist(jid)).length,
  }
  console.info('[viaggio] asCharlieEnrichScandi', summary)
  return summary
}

/**
 * Repair Scandi ×3 / party expenses so the owner isn’t on every Charlie/Benjamin
 * bill (My expenses then differs from Journey). Safe to re-run as any editor.
 *
 *   await __viaggioSeed.repairScandiPartySplits()
 */
export async function repairScandiPartySplits(journeyId) {
  const journey = await resolveScandiJourney(journeyId)
  const jid = journey.id
  const people = await listJourneyPeople(jid)
  const byName = (name) => people.find((p) => p.displayName === name)
  const owner = byName('Piseth Peou')
  const benjamin = byName('Benjamin Bing')
  const charlie = byName('Charlie Charming')
  const david = byName('David Doughlas')
  const charlieParty = [charlie?.id, benjamin?.id, david?.id]
    .filter(Boolean)
    .slice(0, 3)
  const benjaminParty = [benjamin?.id, charlie?.id, david?.id]
    .filter(Boolean)
    .slice(0, 3)

  const charlieRx =
    /munch|oslofjord|nærøyfjord|naeroyfjord|norled|fløibanen|floibanen|maaemo/i
  const benjaminRx = /vasa|abba|sj train/i

  const expenses = await listExpensesForJourney(jid)
  let updated = 0
  for (const ex of expenses) {
    let party = null
    if (charlie?.id && ex.paidBy === charlie.id && charlieRx.test(ex.title)) {
      party = charlieParty
    } else if (
      benjamin?.id &&
      ex.paidBy === benjamin.id &&
      benjaminRx.test(ex.title)
    ) {
      party = benjaminParty
    }
    if (!party?.length) continue
    // Skip when owner isn’t on the bill and party size already matches ×3.
    if (owner?.id && !party.includes(owner.id)) {
      // still rewrite so seed matches party3
    }
    await upsertExpenseWithSplits({
      id: ex.id,
      entryId: ex.entryId,
      title: ex.title,
      amountCents: ex.amountCents,
      currency: ex.currency,
      paidBy: ex.paidBy,
      splitMode: 'equal',
      category: ex.category,
      splits: equalSplits(party, ex.amountCents),
    })
    updated += 1
  }

  const summary = { journeyId: jid, updated }
  console.info('[viaggio] repairScandiPartySplits', summary)
  return summary
}

/**
 * Known-good embeds for player smoke tests (YT / Spotify / Vimeo / SoundCloud).
 * Safe to re-run — skips URLs already on the journey playlist.
 *
 * Usage (DEV console, signed in):
 *   await __viaggioSeed.seedPlaylistDemo('<journeyId>')
 *   // or omit id to use the first journey you belong to
 */
export const DEMO_PLAYLIST_ITEMS = [
  {
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    title: 'YouTube — Me at the zoo',
    platform: 'youtube',
  },
  {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'YouTube — Never Gonna Give You Up',
    platform: 'youtube',
  },
  {
    url: 'https://youtu.be/y6120QOlsfU',
    title: 'YouTube — Sandstorm',
    platform: 'youtube',
  },
  // Spotify IDs verified via oEmbed — prefer tracks over editorial playlists
  // (playlists are often market-locked in the embed player).
  {
    url: 'https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl',
    title: 'Spotify — Cut To The Feeling',
    platform: 'spotify',
  },
  {
    url: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
    title: 'Spotify — Blinding Lights',
    platform: 'spotify',
  },
  {
    url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    title: 'Spotify — Never Gonna Give You Up',
    platform: 'spotify',
  },
  {
    url: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3',
    title: 'Spotify — Shape of You',
    platform: 'spotify',
  },
  {
    url: 'https://open.spotify.com/track/1rqqCSm0Qe4I9rUvWncaom',
    title: 'Spotify — High Hopes',
    platform: 'spotify',
  },
  {
    url: 'https://vimeo.com/76979871',
    title: 'Vimeo — The New Vimeo Player',
    platform: 'vimeo',
  },
  {
    url: 'https://vimeo.com/148751763',
    title: 'Vimeo — sample short',
    platform: 'vimeo',
  },
  {
    url: 'https://soundcloud.com/forss/flickermood',
    title: 'SoundCloud — Flickermood',
    platform: 'soundcloud',
  },
  {
    url: 'https://soundcloud.com/soundcloud/community-guidelines',
    title: 'SoundCloud — Community Guidelines',
    platform: 'soundcloud',
  },
]

export async function seedPlaylistDemo(journeyId) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Sign in first')

  let jid = journeyId
  if (!jid) {
    const journeys = await listJourneys()
    jid = journeys[0]?.id
  }
  if (!jid) throw new Error('No journey found — open a journey first')

  const existing = await listPlaylist(jid)
  const urls = new Set(existing.map((p) => p.url))
  let added = 0
  for (const item of DEMO_PLAYLIST_ITEMS) {
    if (urls.has(item.url)) continue
    await addPlaylistItem(jid, item, user.id)
    urls.add(item.url)
    added += 1
  }

  const summary = {
    journeyId: jid,
    added,
    playlist: (await listPlaylist(jid)).length,
  }
  console.info('[viaggio] seedPlaylistDemo done', summary)
  return summary
}

/**
 * Seed a shared pre-trip checklist. Idempotent by title.
 * Usage (DEV console):
 *   await __viaggioSeed.seedTodoDemo('<journeyId>')
 */
export const DEMO_TODO_ITEMS = [
  {
    title: 'Apply for Visa',
    notes: 'Check passport validity; book embassy appointment',
    done: false,
  },
  {
    title: 'Get eSim',
    notes: 'Compare Airalo / local carriers for destination',
    done: false,
  },
  {
    title: 'Notify bank of travel',
    notes: '',
    done: false,
  },
  {
    title: 'Download offline maps',
    notes: 'Google Maps offline for first city',
    done: true,
  },
  {
    title: 'Travel insurance',
    notes: 'Confirm medical coverage abroad',
    done: false,
  },
]

export async function seedTodoDemo(journeyId) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Sign in first')

  let jid = journeyId
  if (!jid) {
    const journeys = await listJourneys()
    jid = journeys[0]?.id
  }
  if (!jid) throw new Error('No journey found — open a journey first')

  const existing = await listTodos(jid)
  const titles = new Set(existing.map((t) => t.title.trim().toLowerCase()))
  let added = 0
  for (const item of DEMO_TODO_ITEMS) {
    const key = item.title.trim().toLowerCase()
    if (titles.has(key)) continue
    await addTodo(jid, item, user.id)
    titles.add(key)
    added += 1
  }

  const summary = {
    journeyId: jid,
    added,
    todos: (await listTodos(jid)).length,
  }
  console.info('[viaggio] seedTodoDemo done', summary)
  return summary
}

const EAST_ASIA_TITLE = 'East Asia — Japan · Korea · Taiwan'

async function resolveEastAsiaJourney(journeyId) {
  const all = await listJourneys()
  if (journeyId) {
    const hit = all.find((j) => j.id === journeyId)
    if (!hit) throw new Error(`Journey not found: ${journeyId}`)
    return hit
  }
  const byTitle = all.find((j) => j.title === EAST_ASIA_TITLE)
  if (!byTitle) throw new Error(`Open “${EAST_ASIA_TITLE}” first`)
  return byTitle
}

/**
 * Seed East Asia checklist items for the signed-in traveler only.
 * Idempotent by title. Usage: ?devRun=seedEastAsiaTodos
 *
 * Chrome (owner) / Firefox (Benjamin) / Opera (Charlie) each add their set.
 */
export async function seedEastAsiaTodos(journeyId) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in first')

  const journey = await resolveEastAsiaJourney(journeyId)
  const jid = journey.id
  const { people, map: personOf } = await rosterByUserId(jid)
  const me = personOf.get(user.id)
  if (!me) throw new Error('You are not on this journey roster')

  const byEmail = (email) =>
    people.find((p) => String(p.email || '').toLowerCase() === email)
  const owner =
    byEmail('ppeou@msn.com') || people.find((p) => p.linkedUserId === user.id)
  const benjamin = byEmail('delivered+user1@resend.dev')
  const charlie = byEmail('delivered+user2@resend.dev')
  const allIds = [owner?.id, benjamin?.id, charlie?.id].filter(Boolean)

  const email = String(user.email || '').toLowerCase()
  let role = 'owner'
  if (email === 'delivered+user1@resend.dev') role = 'benjamin'
  else if (email === 'delivered+user2@resend.dev') role = 'charlie'

  const itemsByRole = {
    owner: [
      {
        title: 'Group travel insurance',
        notes:
          'Confirm medical + trip cancellation for all three. Compare World Nomads vs Allianz.',
        done: false,
        dueOn: '2026-08-20',
        assigneeJourneyPersonIds: allIds,
      },
      {
        title: 'Share final itinerary PDF',
        notes: 'Drop PDF in shared drive + pin link in playlist notes.',
        done: false,
        dueOn: '2026-09-01',
        assigneeJourneyPersonIds: owner?.id ? [owner.id] : [me],
      },
      {
        title: 'Book JR Pass',
        notes: '7-day ordinary; activate on NRT arrival day.',
        done: true,
        dueOn: '2026-08-15',
        assigneeJourneyPersonIds: allIds,
      },
    ],
    benjamin: [
      {
        title: 'Korea eSIM',
        notes: 'Airalo Korea 5GB — activate before ICN landing.',
        done: false,
        dueOn: '2026-09-10',
        assigneeJourneyPersonIds: benjamin?.id ? [benjamin.id] : [me],
      },
      {
        title: 'Seoul transit card',
        notes: 'T-money at CU / GS25; load ₩30,000.',
        done: false,
        dueOn: '2026-09-12',
        assigneeJourneyPersonIds: benjamin?.id ? [benjamin.id] : [me],
      },
      {
        title: 'Confirm Busan hotel',
        notes: 'Reply to booking.com for late check-in (23:00).',
        done: true,
        dueOn: '2026-09-05',
        assigneeJourneyPersonIds: benjamin?.id ? [benjamin.id] : [me],
      },
    ],
    charlie: [
      {
        title: 'Taiwan EasyCard',
        notes: 'Airport MRT counter; keep for Taipei + Kaohsiung.',
        done: false,
        dueOn: '2026-09-19',
        assigneeJourneyPersonIds: charlie?.id ? [charlie.id] : [me],
      },
      {
        title: 'Night market shortlist',
        notes:
          'Shilin, Raohe, Ningxia — pick two evenings. Note vegetarian stalls for the group.',
        done: false,
        dueOn: '2026-09-18',
        assigneeJourneyPersonIds: [charlie?.id, owner?.id].filter(Boolean),
      },
      {
        title: 'Notify bank (AUD)',
        notes: 'CommBank travel notice for JP / KR / TW dates.',
        done: false,
        dueOn: '2026-09-01',
        assigneeJourneyPersonIds: charlie?.id ? [charlie.id] : [me],
      },
    ],
  }

  const mine = itemsByRole[role] || itemsByRole.owner
  const existing = await listTodos(jid)
  const titles = new Set(existing.map((t) => t.title.trim().toLowerCase()))
  let added = 0
  for (const item of mine) {
    const key = item.title.trim().toLowerCase()
    if (titles.has(key)) continue
    await addTodo(jid, item, user.id)
    titles.add(key)
    added += 1
  }

  const summary = {
    journeyId: jid,
    role,
    as: user.email,
    added,
    todos: (await listTodos(jid)).length,
  }
  console.info('[viaggio] seedEastAsiaTodos done', summary)
  return summary
}

/**
 * Benjamin (Firefox): Korea week + EUR/USD expenses + playlist.
 * Usage (signed in as Benjamin): ?devRun=asBenjaminEastAsia
 */
export async function asBenjaminEastAsia(journeyId) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in as Benjamin first')

  const journey = await resolveEastAsiaJourney(journeyId)
  const jid = journey.id
  const { people, map: personOf } = await rosterByUserId(jid)
  const me = personOf.get(user.id)
  if (!me) throw new Error('Benjamin is not on this journey roster')

  const byEmail = (email) =>
    people.find((p) => String(p.email || '').toLowerCase() === email)
  const owner = byEmail('ppeou@msn.com') || people.find((p) => p.id !== me)
  const charlie =
    byEmail('delivered+user2@resend.dev') ||
    people.find((p) => p.id !== me && p.id !== owner?.id)
  const all3 = [owner?.id, me, charlie?.id].filter(Boolean)
  if (all3.length < 3) throw new Error('Need all 3 travelers on roster')

  const existing = await listEntries(jid)
  const titles = new Set(existing.map((e) => e.title))
  async function ensureEntry(factory, title) {
    if (titles.has(title)) return existing.find((e) => e.title === title)
    const row = await factory()
    titles.add(title)
    existing.push(row)
    return row
  }

  const flight = await ensureEntry(
    () =>
      addFlight(jid, {
        title: 'NRT → ICN (crew)',
        departWall: '2026-09-12T09:15',
        departTz: 'Asia/Tokyo',
        arriveWall: '2026-09-12T11:55',
        arriveTz: 'Asia/Seoul',
        from: 'Tokyo NRT',
        to: 'Seoul ICN',
        airline: 'Korean Air',
      }),
    'NRT → ICN (crew)',
  )
  const hotel = await ensureEntry(
    () =>
      addHotel(jid, {
        title: 'Seoul — Hongdae base',
        checkIn: '2026-09-12T15:00',
        checkOut: '2026-09-19T11:00',
        tz: 'Asia/Seoul',
        place: 'Hongdae, Seoul',
        confirmation: 'EA-SEL-01',
      }),
    'Seoul — Hongdae base',
  )
  await ensureEntry(
    () =>
      addSight(jid, {
        title: 'Gyeongbokgung palace morning',
        wall: '2026-09-13T09:30',
        tz: 'Asia/Seoul',
        place: 'Gyeongbokgung, Seoul',
      }),
    'Gyeongbokgung palace morning',
  )
  const bbq = await ensureEntry(
    () =>
      addMeal(jid, {
        title: 'Korean BBQ — Mapo',
        wall: '2026-09-13T19:00',
        tz: 'Asia/Seoul',
        place: 'Mapo-gu, Seoul',
      }),
    'Korean BBQ — Mapo',
  )
  const cafe = await ensureEntry(
    () =>
      addMeal(jid, {
        title: 'Coffee crawl — Ikseon-dong (pair)',
        wall: '2026-09-14T15:00',
        tz: 'Asia/Seoul',
        place: 'Ikseon-dong',
      }),
    'Coffee crawl — Ikseon-dong (pair)',
  )

  const expenses = await listExpensesForJourney(jid)
  const expTitles = new Set(expenses.map((e) => e.title))
  async function ensureExpense(title, input) {
    if (expTitles.has(title)) return null
    const row = await upsertExpenseWithSplits({ ...input, title })
    expTitles.add(title)
    return row
  }

  // Hotel USD equal — Benjamin paid
  await ensureExpense('Seoul hotel — Hongdae (equal USD)', {
    entryId: hotel.id,
    amountCents: 126000,
    currency: 'USD',
    paidBy: me,
    splitMode: 'equal',
    category: 'lodging',
    splits: equalSplits(all3, 126000),
  })
  // BBQ EUR equal — owner paid
  await ensureExpense('Mapo BBQ (equal EUR)', {
    entryId: bbq.id,
    amountCents: 18000,
    currency: 'EUR',
    paidBy: owner.id,
    splitMode: 'equal',
    category: 'food',
    splits: equalSplits(all3, 18000),
  })
  // Party of 2 (Benjamin + Charlie only) custom USD — Charlie paid
  const pair = [me, charlie.id]
  await ensureExpense('Ikseon coffee (party of 2 USD)', {
    entryId: cafe.id,
    amountCents: 4200,
    currency: 'USD',
    paidBy: charlie.id,
    splitMode: 'custom',
    category: 'food',
    splits: [
      { journeyPersonId: me, amountCents: 2200 },
      { journeyPersonId: charlie.id, amountCents: 2000 },
    ],
  })
  // Flight transfer fees EUR equal — Benjamin paid
  await ensureExpense('NRT–ICN baggage (equal EUR)', {
    entryId: flight.id,
    amountCents: 9000,
    currency: 'EUR',
    paidBy: me,
    splitMode: 'equal',
    category: 'transit',
    splits: equalSplits(all3, 9000),
  })

  const playlist = await listPlaylist(jid)
  const urls = new Set(playlist.map((p) => p.url))
  const kTrack = {
    url: 'https://www.youtube.com/watch?v=IHNzOHi8sJs',
    title: 'Korea vibes — DDU-DU DDU-DU',
  }
  if (!urls.has(kTrack.url)) {
    await addPlaylistItem(jid, kTrack, user.id)
  }

  const summary = {
    journeyId: jid,
    as: 'benjamin',
    entries: (await listEntries(jid)).length,
    expenses: (await listExpensesForJourney(jid)).length,
    playlist: (await listPlaylist(jid)).length,
    pairExcluded: owner?.displayName,
  }
  console.info('[viaggio] asBenjaminEastAsia', summary)
  return summary
}

/**
 * Charlie (Opera): Taiwan week + AUD/USD expenses + playlist.
 * Usage (signed in as Charlie): ?devRun=asCharlieEastAsia
 */
export async function asCharlieEastAsia(journeyId) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in as Charlie first')

  const journey = await resolveEastAsiaJourney(journeyId)
  const jid = journey.id
  const { people, map: personOf } = await rosterByUserId(jid)
  const me = personOf.get(user.id)
  if (!me) throw new Error('Charlie is not on this journey roster')

  const byEmail = (email) =>
    people.find((p) => String(p.email || '').toLowerCase() === email)
  const owner = byEmail('ppeou@msn.com') || people.find((p) => p.id !== me)
  const benjamin =
    byEmail('delivered+user1@resend.dev') ||
    people.find((p) => p.id !== me && p.id !== owner?.id)
  const all3 = [owner?.id, benjamin?.id, me].filter(Boolean)
  if (all3.length < 3) throw new Error('Need all 3 travelers on roster')

  const existing = await listEntries(jid)
  const titles = new Set(existing.map((e) => e.title))
  async function ensureEntry(factory, title) {
    if (titles.has(title)) return existing.find((e) => e.title === title)
    const row = await factory()
    titles.add(title)
    existing.push(row)
    return row
  }

  await ensureEntry(
    () =>
      addFlight(jid, {
        title: 'ICN → TPE (crew)',
        departWall: '2026-09-19T10:40',
        departTz: 'Asia/Seoul',
        arriveWall: '2026-09-19T12:15',
        arriveTz: 'Asia/Taipei',
        from: 'Seoul ICN',
        to: 'Taipei TPE',
        airline: 'EVA Air',
      }),
    'ICN → TPE (crew)',
  )
  const hotel = await ensureEntry(
    () =>
      addHotel(jid, {
        title: 'Taipei — Ximending base',
        checkIn: '2026-09-19T15:00',
        checkOut: '2026-09-26T11:00',
        tz: 'Asia/Taipei',
        place: 'Ximending, Taipei',
        confirmation: 'EA-TPE-01',
      }),
    'Taipei — Ximending base',
  )
  const nightMarket = await ensureEntry(
    () =>
      addMeal(jid, {
        title: 'Shilin night market feast',
        wall: '2026-09-19T20:00',
        tz: 'Asia/Taipei',
        place: 'Shilin Night Market',
      }),
    'Shilin night market feast',
  )
  await ensureEntry(
    () =>
      addSight(jid, {
        title: 'Jiufen day trip',
        wall: '2026-09-21T09:00',
        tz: 'Asia/Taipei',
        place: 'Jiufen',
      }),
    'Jiufen day trip',
  )
  const treats = await ensureEntry(
    () =>
      addMeal(jid, {
        title: 'Charlie treats — Din Tai Fung',
        wall: '2026-09-22T12:30',
        tz: 'Asia/Taipei',
        place: 'Xinyi, Taipei',
      }),
    'Charlie treats — Din Tai Fung',
  )
  await ensureEntry(
    () =>
      addFlight(jid, {
        title: 'TPE → LAX (Piseth home)',
        departWall: '2026-09-26T12:00',
        departTz: 'Asia/Taipei',
        arriveWall: '2026-09-26T09:30',
        arriveTz: 'America/Los_Angeles',
        from: 'Taipei TPE',
        to: 'Los Angeles LAX',
        airline: 'EVA Air',
      }),
    'TPE → LAX (Piseth home)',
  )
  await ensureEntry(
    () =>
      addFlight(jid, {
        title: 'TPE → CDG (Benjamin home)',
        departWall: '2026-09-26T13:10',
        departTz: 'Asia/Taipei',
        arriveWall: '2026-09-27T06:40',
        arriveTz: 'Europe/Paris',
        from: 'Taipei TPE',
        to: 'Paris CDG',
        airline: 'China Airlines',
      }),
    'TPE → CDG (Benjamin home)',
  )
  await ensureEntry(
    () =>
      addFlight(jid, {
        title: 'TPE → SYD (Charlie home)',
        departWall: '2026-09-26T22:30',
        departTz: 'Asia/Taipei',
        arriveWall: '2026-09-27T09:55',
        arriveTz: 'Australia/Sydney',
        from: 'Taipei TPE',
        to: 'Sydney SYD',
        airline: 'Qantas',
      }),
    'TPE → SYD (Charlie home)',
  )

  const expenses = await listExpensesForJourney(jid)
  const expTitles = new Set(expenses.map((e) => e.title))
  async function ensureExpense(title, input) {
    if (expTitles.has(title)) return null
    const row = await upsertExpenseWithSplits({ ...input, title })
    expTitles.add(title)
    return row
  }

  await ensureExpense('Taipei hotel — Ximending (equal AUD)', {
    entryId: hotel.id,
    amountCents: 210000,
    currency: 'AUD',
    paidBy: me,
    splitMode: 'equal',
    category: 'lodging',
    splits: equalSplits(all3, 210000),
  })
  await ensureExpense('Shilin night market (equal USD)', {
    entryId: nightMarket.id,
    amountCents: 9600,
    currency: 'USD',
    paidBy: benjamin.id,
    splitMode: 'equal',
    category: 'food',
    splits: equalSplits(all3, 9600),
  })
  // Charlie treats — custom 3-way AUD
  await ensureExpense('Din Tai Fung (custom AUD)', {
    entryId: treats.id,
    amountCents: 15000,
    currency: 'AUD',
    paidBy: me,
    splitMode: 'custom',
    category: 'food',
    splits: [
      { journeyPersonId: owner.id, amountCents: 4000 },
      { journeyPersonId: benjamin.id, amountCents: 5000 },
      { journeyPersonId: me, amountCents: 6000 },
    ],
  })

  const playlist = await listPlaylist(jid)
  const urls = new Set(playlist.map((p) => p.url))
  const twTrack = {
    url: 'https://www.youtube.com/watch?v=T0iQgLlFY2E',
    title: 'Taiwan vibes — Mandopop night',
  }
  if (!urls.has(twTrack.url)) {
    await addPlaylistItem(jid, twTrack, user.id)
  }

  const summary = {
    journeyId: jid,
    as: 'charlie',
    entries: (await listEntries(jid)).length,
    expenses: (await listExpensesForJourney(jid)).length,
    playlist: (await listPlaylist(jid)).length,
  }
  console.info('[viaggio] asCharlieEastAsia', summary)
  return summary
}

const EUROPE_CRUISE_TITLE =
  'Northern Lights Cruise — Amsterdam · Ship · Bergen'
const EUROPE_CRUISE_MOM = 'Mom'
const EUROPE_CRUISE_DAD = 'Dad'

/**
 * Owner-only cruise demo with Mom/Dad as guest travelers (no accounts).
 * NYC → Amsterdam pre-cruise → 2-week cruise → Bergen → LA.
 * Usage (signed in as owner): ?devRun=seedEuropeCruiseParents
 *   or await __viaggioSeed.seedEuropeCruiseParents()
 */
export async function seedEuropeCruiseParents() {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr) throw authErr
  if (!user) throw new Error('Sign in as owner first')

  let journey = (await listJourneys()).find(
    (j) => j.title === EUROPE_CRUISE_TITLE,
  )
  let reused = false
  if (journey) {
    reused = true
  } else {
    journey = await createJourney({
      title: EUROPE_CRUISE_TITLE,
      type: 'trip',
      preset: 'leisure_trip',
      defaultTimezone: 'Europe/Amsterdam',
      defaultCurrency: 'USD',
      startsOn: '2026-08-01',
      endsOn: '2026-08-21',
      activityPacks: [],
    })
  }
  const jid = journey.id

  let people = await listJourneyPeople(jid)
  const byName = (name) =>
    people.find(
      (p) =>
        String(p.displayName || '').trim().toLowerCase() ===
        name.toLowerCase(),
    )
  const me =
    people.find((p) => p.linkedUserId === user.id) ||
    people.find((p) => p.linkedUserId)

  if (!me) {
    throw new Error('Owner is not on this journey roster')
  }

  if (!byName(EUROPE_CRUISE_MOM)) {
    await addJourneyPerson({
      journeyId: jid,
      displayName: EUROPE_CRUISE_MOM,
    })
  }
  if (!byName(EUROPE_CRUISE_DAD)) {
    await addJourneyPerson({
      journeyId: jid,
      displayName: EUROPE_CRUISE_DAD,
    })
  }
  people = await listJourneyPeople(jid)
  const mom = byName(EUROPE_CRUISE_MOM)
  const dad = byName(EUROPE_CRUISE_DAD)
  if (!mom?.id || !dad?.id) {
    throw new Error('Failed to add Mom/Dad guest travelers')
  }
  if (mom.linkedUserId || dad.linkedUserId) {
    throw new Error('Mom/Dad should remain guests (no linked account)')
  }

  const all3 = [me.id, mom.id, dad.id]
  const ams = 'Europe/Amsterdam'
  const bergen = 'Europe/Oslo'
  const nyc = 'America/New_York'
  const la = 'America/Los_Angeles'

  const existing = await listEntries(jid)
  const titles = new Set(existing.map((e) => e.title))
  async function ensureEntry(factory, title) {
    if (titles.has(title)) return existing.find((e) => e.title === title)
    const row = await factory()
    titles.add(title)
    existing.push(row)
    return row
  }

  const flightOut = await ensureEntry(
    () =>
      addFlight(jid, {
        title: 'JFK → AMS (family)',
        departWall: '2026-08-01T18:30',
        departTz: nyc,
        arriveWall: '2026-08-02T07:45',
        arriveTz: ams,
        from: 'New York JFK',
        to: 'Amsterdam AMS',
        airline: 'KLM',
      }),
    'JFK → AMS (family)',
  )
  const amsHotel = await ensureEntry(
    () =>
      addHotel(jid, {
        title: 'Amsterdam — Canal belt hotel',
        checkIn: '2026-08-02T15:00',
        checkOut: '2026-08-04T11:00',
        tz: ams,
        place: 'Amsterdam canal belt',
        confirmation: 'NL-AMS-CRUISE',
      }),
    'Amsterdam — Canal belt hotel',
  )
  await ensureEntry(
    () =>
      addSight(jid, {
        title: 'Rijksmuseum morning',
        wall: '2026-08-03T10:00',
        tz: ams,
        place: 'Rijksmuseum, Amsterdam',
      }),
    'Rijksmuseum morning',
  )
  const damDinner = await ensureEntry(
    () =>
      addMeal(jid, {
        title: 'Dam square dinner',
        wall: '2026-08-03T19:00',
        tz: ams,
        place: 'Damrak, Amsterdam',
      }),
    'Dam square dinner',
  )
  const cruise = await ensureEntry(
    () =>
      addBoat(jid, {
        title: 'Northern Lights cruise embarkation',
        departWall: '2026-08-04T16:00',
        arriveWall: '2026-08-18T09:00',
        tz: ams,
        from: 'Amsterdam cruise terminal',
        to: 'Bergen cruise terminal',
      }),
    'Northern Lights cruise embarkation',
  )
  const onboardDinner = await ensureEntry(
    () =>
      addMeal(jid, {
        title: 'Onboard specialty dinner',
        wall: '2026-08-10T19:30',
        tz: ams,
        place: 'Cruise ship — specialty restaurant',
      }),
    'Onboard specialty dinner',
  )
  const bergenHotel = await ensureEntry(
    () =>
      addHotel(jid, {
        title: 'Bergen — Bryggen hotel',
        checkIn: '2026-08-18T15:00',
        checkOut: '2026-08-21T11:00',
        tz: bergen,
        place: 'Bryggen, Bergen',
        confirmation: 'NO-BGO-CRUISE',
      }),
    'Bergen — Bryggen hotel',
  )
  const seafood = await ensureEntry(
    () =>
      addMeal(jid, {
        title: 'Bryggen seafood dinner',
        wall: '2026-08-19T19:00',
        tz: bergen,
        place: 'Bryggen, Bergen',
      }),
    'Bryggen seafood dinner',
  )
  await ensureEntry(
    () =>
      addSight(jid, {
        title: 'Fløibanen funicular',
        wall: '2026-08-20T11:00',
        tz: bergen,
        place: 'Fløyen, Bergen',
      }),
    'Fløibanen funicular',
  )
  const flightHome = await ensureEntry(
    () =>
      addFlight(jid, {
        title: 'BGO → LAX (family)',
        departWall: '2026-08-21T13:20',
        departTz: bergen,
        arriveWall: '2026-08-21T16:45',
        arriveTz: la,
        from: 'Bergen BGO',
        to: 'Los Angeles LAX',
        airline: 'SAS / United',
      }),
    'BGO → LAX (family)',
  )

  const expenses = await listExpensesForJourney(jid)
  const expTitles = new Set(expenses.map((e) => e.title))
  async function ensureExpense(title, input) {
    if (expTitles.has(title)) return null
    const row = await upsertExpenseWithSplits({ ...input, title })
    expTitles.add(title)
    return row
  }

  await ensureExpense('JFK–AMS flights (equal USD)', {
    entryId: flightOut.id,
    amountCents: 360000,
    currency: 'USD',
    paidBy: me.id,
    splitMode: 'equal',
    category: 'transit',
    splits: equalSplits(all3, 360000),
  })
  await ensureExpense('Amsterdam hotel — canal belt (equal EUR)', {
    entryId: amsHotel.id,
    amountCents: 90000,
    currency: 'EUR',
    paidBy: me.id,
    splitMode: 'equal',
    category: 'lodging',
    splits: equalSplits(all3, 90000),
  })
  await ensureExpense('Dam square dinner (equal EUR)', {
    entryId: damDinner.id,
    amountCents: 18000,
    currency: 'EUR',
    paidBy: dad.id,
    splitMode: 'equal',
    category: 'food',
    splits: equalSplits(all3, 18000),
  })
  await ensureExpense('Cruise fare — family cabin (equal USD)', {
    entryId: cruise.id,
    amountCents: 900000,
    currency: 'USD',
    paidBy: me.id,
    splitMode: 'equal',
    category: 'lodging',
    splits: equalSplits(all3, 900000),
  })
  await ensureExpense('Onboard specialty dinner (equal USD)', {
    entryId: onboardDinner.id,
    amountCents: 24000,
    currency: 'USD',
    paidBy: mom.id,
    splitMode: 'equal',
    category: 'food',
    splits: equalSplits(all3, 24000),
  })
  await ensureExpense('Bergen hotel — Bryggen (equal NOK)', {
    entryId: bergenHotel.id,
    amountCents: 1200000,
    currency: 'NOK',
    paidBy: me.id,
    splitMode: 'equal',
    category: 'lodging',
    splits: equalSplits(all3, 1200000),
  })
  await ensureExpense('Bryggen seafood (equal NOK)', {
    entryId: seafood.id,
    amountCents: 180000,
    currency: 'NOK',
    paidBy: me.id,
    splitMode: 'equal',
    category: 'food',
    splits: equalSplits(all3, 180000),
  })
  await ensureExpense('BGO–LAX flights (equal USD)', {
    entryId: flightHome.id,
    amountCents: 420000,
    currency: 'USD',
    paidBy: me.id,
    splitMode: 'equal',
    category: 'transit',
    splits: equalSplits(all3, 420000),
  })

  const summary = {
    journeyId: jid,
    title: EUROPE_CRUISE_TITLE,
    reused,
    momId: mom.id,
    dadId: dad.id,
    ownerId: me.id,
    guests: [mom.displayName, dad.displayName],
    entries: (await listEntries(jid)).length,
    expenses: (await listExpensesForJourney(jid)).length,
  }
  console.info('[viaggio] seedEuropeCruiseParents', summary)
  return summary
}
