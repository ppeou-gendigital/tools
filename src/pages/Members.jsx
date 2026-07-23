import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Copy,
  Link2,
  Mail,
  MessageSquare,
  Share2,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { Select } from '@/molecules/Select'
import { PageHeader } from '@/patterns/PageHeader'
import { labelForRole } from '@/lib/catalog'
import { labelForJourneyPerson } from '@/lib/format'
import {
  canNativeShare,
  mailtoInvite,
  nativeShareInvite,
  smsInvite,
} from '@/lib/inviteShare'
import {
  addJourneyPerson,
  blockMember,
  createInvite,
  getJourney,
  inviteUrl,
  leaveJourney,
  listBlocks,
  listInvites,
  listJourneyPeople,
  listMembers,
  listMyPeople,
  myMembership,
  removeJourneyPerson,
  removeMember,
  revokeInvite,
  sendInviteEmail,
  setMemberRole,
  unblockMember,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Page.module.scss'

function isInviteOpen(inv) {
  if (!inv || inv.revokedAt) return false
  if (!inv.expiresAt) return true
  return new Date(inv.expiresAt).getTime() > Date.now()
}

export function Members() {
  const { params, goBack, previousRouteLabel, goHome, goPeople } =
    useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const qc = useQueryClient()
  const [message, setMessage] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [invitePersonId, setInvitePersonId] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [libraryPersonId, setLibraryPersonId] = useState('')
  const [error, setError] = useState('')
  const [busyAction, setBusyAction] = useState('')

  const { data: journey } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: membership } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const { data: roster = [], isLoading: rosterLoading } = useQuery({
    queryKey: ['viaggio', 'journey-people', journeyId],
    queryFn: () => listJourneyPeople(journeyId),
    enabled: !!journeyId,
  })

  const { data: members = [] } = useQuery({
    queryKey: ['viaggio', 'members', journeyId],
    queryFn: () => listMembers(journeyId),
    enabled: !!journeyId,
  })

  const { data: library = [] } = useQuery({
    queryKey: ['viaggio', 'my-people'],
    queryFn: listMyPeople,
    enabled: !!journeyId,
  })

  const isOwner = membership?.role === 'owner'
  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'

  const { data: invites = [] } = useQuery({
    queryKey: ['viaggio', 'invites', journeyId],
    queryFn: () => listInvites(journeyId),
    enabled: !!journeyId && isOwner,
  })

  const { data: blocks = [] } = useQuery({
    queryKey: ['viaggio', 'blocks', journeyId],
    queryFn: () => listBlocks(journeyId),
    enabled: !!journeyId && isOwner,
  })

  const memberByUser = useMemo(() => {
    const map = new Map()
    for (const m of members) map.set(m.userId, m)
    return map
  }, [members])

  const libraryAvailable = useMemo(() => {
    const onRoster = new Set(roster.map((r) => r.personId).filter(Boolean))
    return library.filter((p) => !onRoster.has(p.id))
  }, [library, roster])

  function invalidate() {
    qc.invalidateQueries({ queryKey: ['viaggio', 'journey-people', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'members', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'invites', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'blocks', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'membership', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'my-people'] })
  }

  async function ensureInvite(role = inviteRole, extras = {}) {
    const existing = invites.find(
      (inv) =>
        inv.role === role &&
        isInviteOpen(inv) &&
        (extras.journeyPersonId
          ? inv.journeyPersonId === extras.journeyPersonId
          : !inv.journeyPersonId),
    )
    if (existing) return existing
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    return createInvite(journeyId, role, expires.toISOString(), extras)
  }

  async function withInvite(action, actionKey, successMessage, extras = {}) {
    setError('')
    setMessage('')
    setBusyAction(actionKey)
    try {
      const inv = await ensureInvite(inviteRole, extras)
      const url = inviteUrl(inv.token)
      await action(url, inv)
      invalidate()
      if (successMessage) setMessage(successMessage)
    } catch (err) {
      setError(err?.message ?? 'Could not prepare invite.')
    } finally {
      setBusyAction('')
    }
  }

  const pending = busyAction !== ''

  return (
    <div className={styles.page}>
      <PageHeader
        title="Travelers"
        subtitle={journey?.title}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
      />
      <div className={styles.body}>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.hint}>{message}</p>}
        {rosterLoading && <LoadingState>Loading travelers…</LoadingState>}
        {!rosterLoading && roster.length === 0 && (
          <div className={styles.empty}>
            <p>No travelers yet. Add someone below or send an invite.</p>
          </div>
        )}

        <ul className={styles.list}>
          {roster.map((jp) => {
            const mem = jp.linkedUserId
              ? memberByUser.get(jp.linkedUserId)
              : null
            const isSelf = jp.linkedUserId === user?.id
            return (
              <li key={jp.id} className={styles.block}>
                <div className={styles.rowBody}>
                  <span className={styles.rowTitle}>
                    {labelForJourneyPerson(jp, user?.id)}
                  </span>
                  <span className={styles.rowMeta}>
                    {[
                      jp.linkedUserId ? 'Has account' : 'Guest',
                      mem ? labelForRole(journey, mem.role) : null,
                      jp.email,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
                {isOwner && !isSelf && (
                  <div className={styles.actions}>
                    {mem && (
                      <Select
                        fit
                        aria-label={`Role for ${labelForJourneyPerson(jp, user?.id)}`}
                        value={mem.role}
                        onChange={async (e) => {
                          try {
                            await setMemberRole(
                              journeyId,
                              jp.linkedUserId,
                              e.target.value,
                            )
                            invalidate()
                          } catch (err) {
                            setError(err.message)
                          }
                        }}
                      >
                        <option value="owner">
                          {labelForRole(journey, 'owner')}
                        </option>
                        <option value="editor">
                          {labelForRole(journey, 'editor')}
                        </option>
                        <option value="viewer">
                          {labelForRole(journey, 'viewer')}
                        </option>
                      </Select>
                    )}
                    {jp.linkedUserId ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              await removeMember(journeyId, jp.linkedUserId)
                              invalidate()
                            } catch (err) {
                              setError(err.message)
                            }
                          }}
                        >
                          Remove access
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            try {
                              await blockMember(journeyId, jp.linkedUserId)
                              invalidate()
                            } catch (err) {
                              setError(err.message)
                            }
                          }}
                        >
                          Block
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await removeJourneyPerson(jp.id)
                            invalidate()
                          } catch (err) {
                            setError(err.message)
                          }
                        }}
                      >
                        Remove
                      </Button>
                    )}
                    {isOwner && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending || !(jp.email || inviteEmail)}
                        onClick={() =>
                          withInvite(
                            async (url, inv) => {
                              try {
                                await sendInviteEmail({
                                  inviteId: inv.id,
                                  journeyId,
                                })
                                setMessage('Invite email sent.')
                              } catch {
                                mailtoInvite({
                                  email: jp.email || inviteEmail,
                                  journeyTitle: journey?.title,
                                  url,
                                })
                                setMessage(
                                  'Opened Mail (server email unavailable).',
                                )
                              }
                            },
                            `email-${jp.id}`,
                            null,
                            {
                              journeyPersonId: jp.id,
                              email: jp.email || inviteEmail || null,
                            },
                          )
                        }
                      >
                        <Mail size={14} />
                        Invite
                      </Button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {canEdit && (
          <section className={styles.form}>
            <p className={styles.sectionTitle}>Add traveler</p>
            {libraryAvailable.length > 0 && (
              <div className={styles.field}>
                <Label htmlFor="from-library">From your people</Label>
                <Select
                  id="from-library"
                  value={libraryPersonId}
                  onChange={(e) => setLibraryPersonId(e.target.value)}
                >
                  <option value="">Select…</option>
                  {libraryAvailable.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName}
                      {p.email ? ` (${p.email})` : ''}
                    </option>
                  ))}
                </Select>
                <div className={styles.actions}>
                  <Button
                    size="sm"
                    disabled={!libraryPersonId}
                    onClick={async () => {
                      try {
                        await addJourneyPerson({
                          journeyId,
                          personId: libraryPersonId,
                        })
                        setLibraryPersonId('')
                        invalidate()
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                  >
                    Add from library
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => goPeople()}>
                    Manage people
                  </Button>
                </div>
              </div>
            )}
            <div className={styles.field}>
              <Label htmlFor="new-name">Or create new</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Display name"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="new-email">Email (optional)</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <Button
              disabled={!newName.trim()}
              onClick={async () => {
                try {
                  await addJourneyPerson({
                    journeyId,
                    displayName: newName.trim(),
                    email: newEmail.trim() || null,
                  })
                  setNewName('')
                  setNewEmail('')
                  invalidate()
                } catch (err) {
                  setError(err.message)
                }
              }}
            >
              Add traveler
            </Button>
          </section>
        )}

        {isOwner && (
          <section className={styles.form}>
            <p className={styles.sectionTitle}>Invite link</p>
            <div className={styles.field}>
              <Label htmlFor="invite-role">Role when they join</Label>
              <Select
                id="invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="editor">{labelForRole(journey, 'editor')}</option>
                <option value="viewer">{labelForRole(journey, 'viewer')}</option>
                <option value="owner">{labelForRole(journey, 'owner')}</option>
              </Select>
            </div>
            <div className={styles.field}>
              <Label htmlFor="invite-person">Claim seat (optional)</Label>
              <Select
                id="invite-person"
                value={invitePersonId}
                onChange={(e) => {
                  setInvitePersonId(e.target.value)
                  const jp = roster.find((r) => r.id === e.target.value)
                  if (jp?.email) setInviteEmail(jp.email)
                }}
              >
                <option value="">Open invite (no seat)</option>
                {roster
                  .filter((r) => !r.linkedUserId)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.displayName}
                    </option>
                  ))}
              </Select>
            </div>
            <div className={styles.field}>
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="invite-phone">Phone (optional)</Label>
              <Input
                id="invite-phone"
                type="tel"
                value={invitePhone}
                onChange={(e) => setInvitePhone(e.target.value)}
              />
            </div>
            <p className={styles.hint}>
              Send invite uses Viaggio email (magic link). Copy / Text / Share
              still work without server email.
            </p>
            <div className={styles.actions}>
              <Button
                onClick={() =>
                  withInvite(
                    async (url) => {
                      try {
                        await navigator.clipboard.writeText(url)
                        setMessage('Invite link copied.')
                      } catch {
                        setMessage(url)
                      }
                    },
                    'copy',
                    null,
                    {
                      journeyPersonId: invitePersonId || null,
                      email: inviteEmail || null,
                    },
                  )
                }
                disabled={pending}
              >
                <Link2 size={14} />
                {busyAction === 'copy' ? 'Working…' : 'Copy link'}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  withInvite(
                    async (url, inv) => {
                      try {
                        await sendInviteEmail({
                          inviteId: inv.id,
                          journeyId,
                        })
                        setMessage('Invite email sent.')
                      } catch {
                        mailtoInvite({
                          email: inviteEmail,
                          journeyTitle: journey?.title,
                          url,
                        })
                        setMessage(
                          'Opened Mail (deploy Edge Function for server send).',
                        )
                      }
                    },
                    'email',
                    null,
                    {
                      journeyPersonId: invitePersonId || null,
                      email: inviteEmail || null,
                    },
                  )
                }
                disabled={pending || !inviteEmail.trim()}
              >
                <Mail size={14} />
                {busyAction === 'email' ? 'Working…' : 'Send invite'}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  withInvite(
                    async (url) => {
                      smsInvite({
                        phone: invitePhone,
                        journeyTitle: journey?.title,
                        url,
                      })
                    },
                    'sms',
                    'Opened Messages with invite link.',
                    {
                      journeyPersonId: invitePersonId || null,
                      email: inviteEmail || null,
                    },
                  )
                }
                disabled={pending}
              >
                <MessageSquare size={14} />
                {busyAction === 'sms' ? 'Working…' : 'Text'}
              </Button>
              {canNativeShare() && (
                <Button
                  variant="outline"
                  onClick={() =>
                    withInvite(
                      async (url) => {
                        await nativeShareInvite({
                          journeyTitle: journey?.title,
                          url,
                        })
                      },
                      'share',
                      'Share sheet opened.',
                      {
                        journeyPersonId: invitePersonId || null,
                        email: inviteEmail || null,
                      },
                    )
                  }
                  disabled={pending}
                >
                  <Share2 size={14} />
                  {busyAction === 'share' ? 'Working…' : 'Share'}
                </Button>
              )}
            </div>

            {invites.filter(isInviteOpen).length > 0 && (
              <ul className={styles.list}>
                {invites.filter(isInviteOpen).map((inv) => (
                  <li key={inv.id} className={styles.block}>
                    <span className={styles.rowMeta}>
                      {labelForRole(journey, inv.role)}
                      {inv.email ? ` · ${inv.email}` : ''}
                      {' · expires '}
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </span>
                    <div className={styles.actions}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const url = inviteUrl(inv.token)
                          try {
                            await navigator.clipboard.writeText(url)
                            setMessage('Link copied.')
                          } catch {
                            setMessage(url)
                          }
                        }}
                      >
                        <Copy size={14} />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          await revokeInvite(inv.id)
                          invalidate()
                        }}
                      >
                        Revoke
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {blocks.length > 0 && (
              <>
                <p className={styles.sectionTitle}>Blocked</p>
                <ul className={styles.list}>
                  {blocks.map((b) => (
                    <li key={b.userId} className={styles.block}>
                      <span className={styles.rowTitle}>
                        {b.displayName || b.userId.slice(0, 8)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await unblockMember(journeyId, b.userId)
                          invalidate()
                        }}
                      >
                        Unblock
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

        <Button
          variant="outline"
          onClick={async () => {
            try {
              await leaveJourney(journeyId)
              goHome()
            } catch (err) {
              setError(err.message)
            }
          }}
        >
          Leave journey
        </Button>
      </div>
    </div>
  )
}
