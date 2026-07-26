import { useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  Link2,
  ListChecks,
  ListMusic,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Share2,
  CircleDollarSign,
} from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import popoverStyles from '@/molecules/AnchoredPopover.module.scss'
import { AiPlannerButton } from '@/molecules/AiPlannerButton'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { Select } from '@/molecules/Select'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
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
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

function isInviteOpen(inv) {
  if (!inv || inv.revokedAt) return false
  if (!inv.expiresAt) return true
  return new Date(inv.expiresAt).getTime() > Date.now()
}

export function Members() {
  const {
    params,
    goBack,
    previousRouteLabel,
    goHome,
    goPeople,
    goSpending,
    goPlaylist,
    goTodos,
    goMap,
    goJourneySettings,
  } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const qc = useQueryClient()
  const [message, setMessage] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [libraryPersonId, setLibraryPersonId] = useState('')
  const [error, setError] = useState('')
  const [busyAction, setBusyAction] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [shareExpanded, setShareExpanded] = useState(false)
  const [rowInvite, setRowInvite] = useState(null)
  const [rowInviteEmail, setRowInviteEmail] = useState('')
  const [rowInvitePhone, setRowInvitePhone] = useState('')
  const [menuForId, setMenuForId] = useState(null)
  const moreBtnRef = useRef(null)

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

  const openInvites = useMemo(
    () => invites.filter(isInviteOpen),
    [invites],
  )

  const ownerCount = useMemo(
    () => members.filter((m) => m.role === 'owner').length,
    [members],
  )
  const isSoleOwner = isOwner && ownerCount <= 1

  function invalidate() {
    qc.invalidateQueries({ queryKey: ['viaggio', 'journey-people', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'members', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'invites', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'blocks', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'membership', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'my-people'] })
  }

  /** Open join-link invites only (no seat). Row invites pass journeyPersonId. */
  async function ensureInvite(role = inviteRole, extras = {}) {
    const seatId = extras.journeyPersonId || null
    const existing = invites.find(
      (inv) =>
        inv.role === role &&
        isInviteOpen(inv) &&
        (seatId
          ? inv.journeyPersonId === seatId
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

  function openRowInvite(jp) {
    setError('')
    setMessage('')
    setRowInvite(jp)
    setRowInviteEmail(jp.email || '')
    setRowInvitePhone('')
  }

  function closeRowInvite() {
    if (busyAction.startsWith('row-')) return
    setRowInvite(null)
    setRowInviteEmail('')
    setRowInvitePhone('')
  }

  const pending = busyAction !== ''
  const rowInviteName = rowInvite
    ? labelForJourneyPerson(rowInvite, user?.id)
    : ''

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
        actions={
          canEdit ? (
            <div className={styles.toolbar}>
              <AiPlannerButton
                journeyId={journeyId}
                className={styles.iconBtn}
              />
            </div>
          ) : null
        }
        shortcuts={
          <PageShortcuts
            current="members"
            className={styles.iconBtn}
            shortcuts={[
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
                id: 'todos',
                label: 'To-dos',
                icon: ListChecks,
                pick: () => () => goTodos(journeyId),
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
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className={styles.hint} role="status">
            {message}
          </p>
        )}
        {rosterLoading && <LoadingState>Loading travelers…</LoadingState>}
        {!rosterLoading && roster.length === 0 && (
          <div className={styles.empty}>
            <p>No travelers yet. Add someone below or share a join link.</p>
          </div>
        )}

        <p className={styles.hint}>
          {roster.length} traveler{roster.length === 1 ? '' : 's'}
          {members.length
            ? ` · ${members.length} with account access`
            : ''}
        </p>

        {!canEdit && !rosterLoading && (
          <p className={styles.readOnlyBanner}>
            You can view the roster. Only organizers can add travelers or
            invite people to join.
          </p>
        )}

        <div
          className={cx(
            styles.dualZone,
            !(canEdit || isOwner) && styles.dualZoneSolo,
          )}
        >
          <ul className={styles.list} aria-label="Travelers">
            {roster.map((jp) => {
              const mem = jp.linkedUserId
                ? memberByUser.get(jp.linkedUserId)
                : null
              const isSelf = jp.linkedUserId === user?.id
              const name = labelForJourneyPerson(jp, user?.id)
              const isGuest = !jp.linkedUserId
              const statusLabel = isGuest
                ? 'Guest'
                : mem
                  ? `Joined · ${labelForRole(journey, mem.role)}`
                  : 'Joined'
              return (
                <li key={jp.id} className={styles.block}>
                  <div className={styles.rowBody}>
                    <span className={styles.rowTitle}>{name}</span>
                    <span className={styles.statusLine}>
                      <span className={styles.badge}>{statusLabel}</span>
                      {jp.email ? (
                        <span className={styles.rowMetaQuiet}>{jp.email}</span>
                      ) : null}
                    </span>
                  </div>
                  {isOwner && !isSelf && (
                    <div className={styles.actions}>
                      {mem && (
                        <Select
                          fit
                          aria-label={`Role for ${name}`}
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
                      {isGuest && (
                        <Button
                          size="sm"
                          aria-label={`Invite ${name}`}
                          disabled={pending}
                          onClick={() => openRowInvite(jp)}
                        >
                          <Mail size={14} aria-hidden="true" />
                          Invite
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`More actions for ${name}`}
                        aria-expanded={menuForId === jp.id}
                        aria-haspopup="dialog"
                        onClick={(e) => {
                          const next = menuForId === jp.id ? null : jp.id
                          if (next) moreBtnRef.current = e.currentTarget
                          setMenuForId(next)
                        }}
                      >
                        <MoreHorizontal size={14} aria-hidden="true" />
                        More
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {(canEdit || isOwner) && (
          <div className={cx(styles.inviteColumn, styles.stickyPanel)}>
            {canEdit && (
              <section className={styles.form} aria-labelledby="add-traveler-heading">
                <h2 id="add-traveler-heading" className={styles.sectionTitle}>
                  Add traveler
                </h2>
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => goPeople()}
                      >
                        Manage people
                      </Button>
                    </div>
                  </div>
                )}
                <div className={styles.field}>
                  <Label htmlFor="new-name">
                    {libraryAvailable.length > 0 ? 'Or create new' : 'Display name'}
                  </Label>
                  <Input
                    id="new-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Display name"
                  />
                  {!newName.trim() && (
                    <p className={styles.hint}>Enter a name to add a traveler.</p>
                  )}
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
              <section
                className={styles.form}
                aria-labelledby="share-access-heading"
              >
                <div className={styles.shareHeader}>
                  <h2 id="share-access-heading" className={styles.sectionTitle}>
                    Share join link
                  </h2>
                  {openInvites.length > 0 && (
                    <span className={styles.badge}>
                      {openInvites.length} active
                    </span>
                  )}
                </div>
                <p className={styles.hint}>
                  Anyone with the link can join this journey. To invite a
                  specific guest, use Invite on their row.
                </p>
                <Button
                  variant={shareExpanded ? 'outline' : 'default'}
                  fullWidth
                  aria-expanded={shareExpanded}
                  onClick={() => setShareExpanded((v) => !v)}
                >
                  <Link2 size={14} aria-hidden="true" />
                  {shareExpanded ? 'Hide share options' : 'Share join link'}
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={cx(
                      styles.disclosureChevron,
                      shareExpanded && styles.disclosureChevronOpen,
                    )}
                  />
                </Button>

                {shareExpanded && (
                  <>
                    <p className={styles.hint}>
                      We’ll email a sign-in link when possible; otherwise copy
                      or share the link.
                    </p>
                    <div className={styles.field}>
                      <Label htmlFor="invite-email">Email (for send)</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="friend@example.com"
                      />
                      {!inviteEmail.trim() && (
                        <p className={styles.hint}>
                          Add an email to enable Send invite. Copy and Message
                          work without it.
                        </p>
                      )}
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
                    <details className={styles.disclosure}>
                      <summary>Advanced</summary>
                      <div className={styles.field}>
                        <Label htmlFor="invite-role">Role when they join</Label>
                        <Select
                          id="invite-role"
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                        >
                          <option value="editor">
                            {labelForRole(journey, 'editor')}
                          </option>
                          <option value="viewer">
                            {labelForRole(journey, 'viewer')}
                          </option>
                          <option value="owner">
                            {labelForRole(journey, 'owner')}
                          </option>
                        </Select>
                      </div>
                    </details>
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
                            {},
                          )
                        }
                        disabled={pending}
                      >
                        <Link2 size={14} aria-hidden="true" />
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
                                  'Opened Mail (server email unavailable).',
                                )
                              }
                            },
                            'email',
                            null,
                            { email: inviteEmail || null },
                          )
                        }
                        disabled={pending || !inviteEmail.trim()}
                      >
                        <Mail size={14} aria-hidden="true" />
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
                            {},
                          )
                        }
                        disabled={pending}
                      >
                        <MessageSquare size={14} aria-hidden="true" />
                        {busyAction === 'sms' ? 'Working…' : 'Message'}
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
                              {},
                            )
                          }
                          disabled={pending}
                        >
                          <Share2 size={14} aria-hidden="true" />
                          {busyAction === 'share' ? 'Working…' : 'Share'}
                        </Button>
                      )}
                    </div>

                    {openInvites.length > 0 && (
                      <ul className={styles.list} aria-label="Active join links">
                        {openInvites.map((inv) => (
                          <li key={inv.id} className={styles.block}>
                            <span className={styles.rowMeta}>
                              {labelForRole(journey, inv.role)}
                              {inv.journeyPersonId ? ' · seat claim' : ''}
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
                                <Copy size={14} aria-hidden="true" />
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
                  </>
                )}

                {blocks.length > 0 && (
                  <>
                    <h2 className={styles.sectionTitle}>Blocked</h2>
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
          </div>
          )}
        </div>

        <div className={styles.dangerZone}>
          <h2 className={styles.sectionTitle}>Danger zone</h2>
          <p className={styles.hint}>
            {isSoleOwner
              ? 'You are the only organizer. Transfer ownership before leaving, or the journey may be stuck without an organizer.'
              : 'Leaving removes your access until someone invites you again.'}
          </p>
          <Button
            variant="outline"
            fullWidth
            onClick={() =>
              setConfirm({
                title: 'Leave this journey?',
                message: isSoleOwner
                  ? 'You are the only organizer. You will lose access until someone invites you again, and no one else can manage ownership.'
                  : 'You will lose access until someone invites you again.',
                confirmLabel: 'Leave',
                run: async () => {
                  await leaveJourney(journeyId)
                  goHome()
                },
              })
            }
          >
            Leave journey
          </Button>
        </div>
      </div>

      <AnchoredPopover
        open={!!menuForId}
        onClose={() => setMenuForId(null)}
        anchorRef={moreBtnRef}
        title="Actions"
        aria-label="Traveler actions"
      >
        {(() => {
          const jp = roster.find((r) => r.id === menuForId)
          if (!jp) return null
          const name = labelForJourneyPerson(jp, user?.id)
          if (jp.linkedUserId) {
            return (
              <div className={popoverStyles.actions}>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setMenuForId(null)
                    setConfirm({
                      title: 'Remove access?',
                      message: `${name} will lose access to this journey.`,
                      confirmLabel: 'Remove access',
                      run: async () => {
                        await removeMember(journeyId, jp.linkedUserId)
                        invalidate()
                      },
                    })
                  }}
                >
                  Remove access
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  fullWidth
                  onClick={() => {
                    setMenuForId(null)
                    setConfirm({
                      title: 'Block this traveler?',
                      message: `${name} will be removed and cannot rejoin with an invite.`,
                      confirmLabel: 'Block',
                      run: async () => {
                        await blockMember(journeyId, jp.linkedUserId)
                        invalidate()
                      },
                    })
                  }}
                >
                  Block
                </Button>
              </div>
            )
          }
          return (
            <div className={popoverStyles.actions}>
              <Button
                size="sm"
                variant="outline"
                fullWidth
                onClick={() => {
                  setMenuForId(null)
                  setConfirm({
                    title: 'Remove traveler?',
                    message: `Remove ${name} from this journey?`,
                    confirmLabel: 'Remove',
                    run: async () => {
                      await removeJourneyPerson(jp.id)
                      invalidate()
                    },
                  })
                }}
              >
                Remove
              </Button>
            </div>
          )
        })()}
      </AnchoredPopover>

      <Modal
        open={!!rowInvite}
        onDismiss={closeRowInvite}
        title={rowInvite ? `Invite ${rowInviteName}` : 'Invite'}
      >
        <div className={styles.sheet}>
          <p className={styles.hint}>
            Send a join link for this seat. We’ll email a sign-in link when
            possible.
          </p>
          <div className={styles.field}>
            <Label htmlFor="row-invite-email">Email</Label>
            <Input
              id="row-invite-email"
              type="email"
              value={rowInviteEmail}
              onChange={(e) => setRowInviteEmail(e.target.value)}
              placeholder="friend@example.com"
              required
            />
            {!rowInviteEmail.trim() && (
              <p className={styles.hint}>
                Email is required to send. You can still copy the link.
              </p>
            )}
          </div>
          <div className={styles.field}>
            <Label htmlFor="row-invite-phone">Phone (optional)</Label>
            <Input
              id="row-invite-phone"
              type="tel"
              value={rowInvitePhone}
              onChange={(e) => setRowInvitePhone(e.target.value)}
            />
          </div>
          <div className={styles.actions}>
            <Button
              onClick={() =>
                withInvite(
                  async (url) => {
                    try {
                      await navigator.clipboard.writeText(url)
                      setMessage('Invite link copied.')
                      setRowInvite(null)
                    } catch {
                      setMessage(url)
                    }
                  },
                  'row-copy',
                  null,
                  {
                    journeyPersonId: rowInvite?.id || null,
                    email: rowInviteEmail.trim() || null,
                  },
                )
              }
              disabled={pending}
            >
              <Link2 size={14} aria-hidden="true" />
              {busyAction === 'row-copy' ? 'Working…' : 'Copy link'}
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
                      setRowInvite(null)
                    } catch {
                      mailtoInvite({
                        email: rowInviteEmail.trim(),
                        journeyTitle: journey?.title,
                        url,
                      })
                      setMessage('Opened Mail (server email unavailable).')
                      setRowInvite(null)
                    }
                  },
                  'row-email',
                  null,
                  {
                    journeyPersonId: rowInvite?.id || null,
                    email: rowInviteEmail.trim() || null,
                  },
                )
              }
              disabled={pending || !rowInviteEmail.trim()}
            >
              <Mail size={14} aria-hidden="true" />
              {busyAction === 'row-email' ? 'Working…' : 'Send invite'}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                withInvite(
                  async (url) => {
                    smsInvite({
                      phone: rowInvitePhone,
                      journeyTitle: journey?.title,
                      url,
                    })
                    setRowInvite(null)
                  },
                  'row-sms',
                  'Opened Messages with invite link.',
                  {
                    journeyPersonId: rowInvite?.id || null,
                    email: rowInviteEmail.trim() || null,
                  },
                )
              }
              disabled={pending}
            >
              <MessageSquare size={14} aria-hidden="true" />
              {busyAction === 'row-sms' ? 'Working…' : 'Message'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onDismiss={() => {
          if (busyAction !== 'confirm') setConfirm(null)
        }}
        title={confirm?.title || ''}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel || 'Confirm'}
        busyLabel="Working…"
        confirming={busyAction === 'confirm'}
        onConfirm={async () => {
          if (!confirm?.run) return
          setBusyAction('confirm')
          setError('')
          try {
            await confirm.run()
            setConfirm(null)
          } catch (err) {
            setError(err.message)
            setConfirm(null)
          } finally {
            setBusyAction('')
          }
        }}
      />
    </div>
  )
}
