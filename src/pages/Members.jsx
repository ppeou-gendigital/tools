import { useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  EllipsisVertical,
  Link2,
  Mail,
  MessageSquare,
  Plus,
  Share2,
} from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import popoverStyles from '@/molecules/AnchoredPopover.module.scss'
import { AiPlannerButton } from '@/molecules/AiPlannerButton'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { journeyAllShortcuts } from '@/lib/journeyNav'
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
  const nav = useNavigation()
  const {
    params,
    goBack,
    previousRouteLabel,
    goHome,
  } = nav
  const journeyId = params.journeyId
  const { user } = useAuth()
  const qc = useQueryClient()
  const [message, setMessage] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [addOpen, setAddOpen] = useState(false)
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

  function openAdd() {
    setError('')
    setAddOpen(true)
  }

  function closeAdd() {
    if (busyAction === 'add-traveler') return
    setAddOpen(false)
    setNewName('')
    setNewEmail('')
  }

  async function submitAdd() {
    if (!newName.trim() || busyAction === 'add-traveler') return
    setBusyAction('add-traveler')
    setError('')
    try {
      await addJourneyPerson({
        journeyId,
        displayName: newName.trim(),
        email: newEmail.trim() || null,
      })
      setNewName('')
      setNewEmail('')
      setAddOpen(false)
      invalidate()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyAction('')
    }
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
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={openAdd}
                aria-label="Add traveler"
                title="Add traveler"
              >
                <Plus size={14} aria-hidden="true" />
              </Button>
            </div>
          ) : null
        }
        shortcuts={
          <PageShortcuts
            current="members"
            className={styles.iconBtn}
            shortcuts={journeyAllShortcuts(journeyId, nav)}
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
            <p>No travelers yet.</p>
            {canEdit && (
              <Button onClick={openAdd}>
                <Plus size={14} aria-hidden="true" />
                Add traveler
              </Button>
            )}
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
            !isOwner && styles.dualZoneSolo,
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
                <li key={jp.id} className={cx(styles.block, styles.travelerCard)}>
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
                    <div className={styles.entryActions}>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.rowInfo}
                          aria-label={`Actions for ${name}`}
                          title="Traveler actions"
                          aria-expanded={menuForId === jp.id}
                          aria-haspopup="menu"
                          disabled={pending}
                          onClick={(e) => {
                            const next = menuForId === jp.id ? null : jp.id
                            if (next) moreBtnRef.current = e.currentTarget
                            setMenuForId(next)
                          }}
                        >
                          <EllipsisVertical size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {isOwner && (
          <div className={cx(styles.inviteColumn, styles.stickyPanel)}>
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
                    <div className={styles.field}>
                      <Label id="invite-role-label">Role when they join</Label>
                      <div
                        className={styles.segmented}
                        role="radiogroup"
                        aria-labelledby="invite-role-label"
                      >
                        {[
                          { value: 'editor', label: labelForRole(journey, 'editor') },
                          { value: 'viewer', label: labelForRole(journey, 'viewer') },
                          { value: 'owner', label: labelForRole(journey, 'owner') },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={inviteRole === opt.value}
                            className={cx(
                              styles.segment,
                              inviteRole === opt.value && styles.segmentActive,
                            )}
                            onClick={() => setInviteRole(opt.value)}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <Label htmlFor="invite-email">Email (optional)</Label>
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
                        placeholder="+1…"
                      />
                    </div>
                    <div
                      className={styles.shareActions}
                      role="group"
                      aria-label="Share join link"
                    >
                      {canNativeShare() && (
                        <Button
                          className={styles.shareActionBtn}
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
                          aria-label="Share"
                          title="Share via Messages, Mail, and more"
                        >
                          <Share2 size={18} aria-hidden="true" />
                        </Button>
                      )}
                      <Button
                        variant={canNativeShare() ? 'outline' : 'default'}
                        className={styles.shareActionBtn}
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
                        aria-label="Copy link"
                        title="Copy link"
                      >
                        <Copy size={18} aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        className={styles.shareActionBtn}
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
                        aria-label="Send invite email"
                        title={
                          inviteEmail.trim()
                            ? 'Send invite email'
                            : 'Add an email to send'
                        }
                      >
                        <Mail size={18} aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        className={styles.shareActionBtn}
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
                        aria-label="Message"
                        title="Open Messages with invite link"
                      >
                        <MessageSquare size={18} aria-hidden="true" />
                      </Button>
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
        align="end"
        fluid
        role="menu"
        aria-label="Traveler actions"
      >
        {(() => {
          const jp = roster.find((r) => r.id === menuForId)
          if (!jp) return null
          const name = labelForJourneyPerson(jp, user?.id)
          const mem = jp.linkedUserId
            ? memberByUser.get(jp.linkedUserId)
            : null
          const isGuest = !jp.linkedUserId
          const roles = ['editor', 'viewer', 'owner']
          return (
            <>
              <ul className={styles.rowActionMenu}>
                {mem &&
                  roles.map((role) => {
                    const active = mem.role === role
                    return (
                      <li key={role} role="none">
                        <button
                          type="button"
                          role="menuitemradio"
                          aria-checked={active}
                          className={styles.rowActionMenuItem}
                          disabled={pending}
                          onClick={async () => {
                            setMenuForId(null)
                            if (active) return
                            try {
                              await setMemberRole(
                                journeyId,
                                jp.linkedUserId,
                                role,
                              )
                              invalidate()
                            } catch (err) {
                              setError(err.message)
                            }
                          }}
                        >
                          <span className={styles.rowActionMenuIcon}>
                            {active ? (
                              <Check size={16} aria-hidden="true" />
                            ) : null}
                          </span>
                          <span>{labelForRole(journey, role)}</span>
                        </button>
                      </li>
                    )
                  })}
                {isGuest && (
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.rowActionMenuItem}
                      disabled={pending}
                      onClick={() => {
                        setMenuForId(null)
                        openRowInvite(jp)
                      }}
                    >
                      <Mail size={16} aria-hidden="true" />
                      <span>Invite</span>
                    </button>
                  </li>
                )}
              </ul>
              <div className={popoverStyles.actions}>
                {jp.linkedUserId ? (
                  <>
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
                  </>
                ) : (
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
                )}
              </div>
            </>
          )
        })()}
      </AnchoredPopover>

      <Modal
        open={addOpen}
        onDismiss={closeAdd}
        title="Add traveler"
      >
        <form
          className={styles.sheet}
          onSubmit={(e) => {
            e.preventDefault()
            submitAdd()
          }}
        >
          {error && addOpen && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <div className={styles.field}>
            <Label htmlFor="new-name">Display name</Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Display name"
              required
              autoFocus
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
            type="submit"
            disabled={!newName.trim() || busyAction === 'add-traveler'}
            fullWidth
          >
            {busyAction === 'add-traveler' ? 'Adding…' : 'Add traveler'}
          </Button>
        </form>
      </Modal>

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
