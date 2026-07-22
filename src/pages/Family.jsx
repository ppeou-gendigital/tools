import { useCallback, useEffect, useId, useState } from 'react'
import { Copy, Share2, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { PatientSwitcher } from '@/patterns/PatientSwitcher'
import { useAuth } from '@/providers/AuthProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import {
  acceptInvite,
  acceptInviteByToken,
  createInvite,
  listFamilyMembers,
  listMyPendingInvites,
  listPendingInvites,
  revokeInvite,
  revokeMember,
} from '@/lib/familyApi'
import styles from './SectionPage.module.scss'

const ROLE_LABEL = {
  owner: 'Owner',
  helper: 'Can help',
  viewer: 'Can view',
}

function readInviteTokenFromHash() {
  if (typeof location === 'undefined') return null
  const match = location.hash.match(/invite=([^&]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

function clearInviteHash() {
  if (typeof location === 'undefined' || typeof history === 'undefined') return
  if (!location.hash.includes('invite=')) return
  history.replaceState(null, '', `${location.pathname}${location.search}`)
}

export function Family() {
  const { user } = useAuth()
  const vault = usePatientVault()
  const [members, setMembers] = useState([])
  const [invites, setInvites] = useState([])
  const [inbox, setInbox] = useState([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('viewer')
  const [lastToken, setLastToken] = useState(null)
  const [linkToken, setLinkToken] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const emailId = useId()

  const reload = useCallback(async () => {
    if (!vault.patientId) return
    const [m, inv, mine] = await Promise.all([
      listFamilyMembers(vault.patientId),
      vault.isOwner ? listPendingInvites(vault.patientId) : Promise.resolve([]),
      listMyPendingInvites(),
    ])
    setMembers(m)
    setInvites(inv)
    setInbox(mine.filter((i) => i.patient_id !== vault.patientId))
  }, [vault.patientId, vault.isOwner])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  useEffect(() => {
    let token = readInviteTokenFromHash()
    if (token) clearInviteHash()
    if (!token && typeof sessionStorage !== 'undefined') {
      try {
        token = sessionStorage.getItem('docto.pendingInvite')
        if (token) sessionStorage.removeItem('docto.pendingInvite')
      } catch {
        // ignore
      }
    }
    if (token) setLinkToken(token)
  }, [])

  async function acceptWithPubkey(acceptFn) {
    if (!vault.identityPublicJwk) {
      throw new Error('Unlock your vault first so we can publish your key.')
    }
    return acceptFn(vault.identityPublicJwk)
  }

  async function onInvite(e) {
    e.preventDefault()
    if (!vault.isOwner) return
    setBusy(true)
    setError(null)
    setMessage(null)
    setLastToken(null)
    try {
      const { invite, token } = await createInvite({
        patientId: vault.patientId,
        invitedBy: user.id,
        email,
        role,
      })
      setLastToken(token)
      setEmail('')
      setMessage(`Invite created for ${invite.invited_email}. Copy the link below.`)
      await reload()
    } catch (err) {
      setError(err?.message ?? 'Could not invite')
    } finally {
      setBusy(false)
    }
  }

  async function onShareKeys() {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const n = await vault.shareKeysWithFamily()
      setMessage(
        n > 0
          ? `Shared vault key with ${n} family member${n === 1 ? '' : 's'}.`
          : 'No pending members need a key right now.',
      )
      await reload()
    } catch (err) {
      setError(err?.message ?? 'Could not share keys')
    } finally {
      setBusy(false)
    }
  }

  async function onAccept(invite) {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await acceptWithPubkey((publicKeyJwk) =>
        acceptInvite({
          invite,
          userId: user.id,
          publicKeyJwk,
        }),
      )
      setMessage(
        'Invite accepted. Ask the owner to open Family and tap “Share keys”.',
      )
      await reload()
    } catch (err) {
      setError(err?.message ?? 'Could not accept invite')
    } finally {
      setBusy(false)
    }
  }

  async function onAcceptLink() {
    if (!linkToken) return
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await acceptWithPubkey((publicKeyJwk) =>
        acceptInviteByToken({
          token: linkToken,
          userId: user.id,
          publicKeyJwk,
        }),
      )
      setLinkToken(null)
      setMessage(
        'Invite accepted. Ask the owner to open Family and tap “Share keys”.',
      )
      await reload()
    } catch (err) {
      setError(err?.message ?? 'Could not accept invite link')
    } finally {
      setBusy(false)
    }
  }

  async function onRevokeMember(memberId) {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await revokeMember(memberId)
      await vault.rotateKeysAfterRevoke()
      setMessage('Member removed and vault key rotated.')
      await reload()
    } catch (err) {
      setError(err?.message ?? 'Could not revoke member')
    } finally {
      setBusy(false)
    }
  }

  const inviteUrl = lastToken
    ? `${typeof location !== 'undefined' ? location.origin : ''}${typeof location !== 'undefined' ? location.pathname : ''}#invite=${lastToken}`
    : null

  const needsKey = members.filter(
    (m) =>
      m.role !== 'owner' &&
      m.pubkey &&
      (!m.wrapped_dek || m.wrapped_dek_iv !== 'ecdh'),
  )

  return (
    <div className={styles.page}>
      <PageHeader
        title="Family"
        subtitle="Invite people who Can view or Can help — keys stay end-to-end encrypted."
        shortcuts={
          <PageShortcuts current="family" className={styles.iconBtn} />
        }
      />
      <div className={styles.body}>
        <PatientSwitcher />

        {(error || message) && (
          <p className={styles.empty}>{error || message}</p>
        )}

        {linkToken && (
          <section className={styles.form}>
            <p className={styles.cardTitle}>Invite link</p>
            <p className={styles.muted}>
              You opened an invite link. Accept to join this patient record.
            </p>
            <Button size="sm" onClick={onAcceptLink} disabled={busy}>
              Accept invite
            </Button>
          </section>
        )}

        {inbox.length > 0 && (
          <section className={styles.form}>
            <p className={styles.cardTitle}>Invites for you</p>
            <ul className={styles.list}>
              {inbox.map((inv) => (
                <li key={inv.id} className={styles.card}>
                  <span className={styles.cardMeta}>
                    {inv.invited_email} · {ROLE_LABEL[inv.role] || inv.role}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => onAccept(inv)}
                    disabled={busy}
                  >
                    Accept
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {vault.isOwner && (
          <form className={styles.form} onSubmit={onInvite}>
            <p className={styles.cardTitle}>Invite someone</p>
            <div className={styles.field}>
              <Label htmlFor={emailId}>Email</Label>
              <Input
                id={emailId}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="family@example.com"
              />
            </div>
            <div className={styles.field}>
              <Label>Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: 6 }}
              >
                <option value="viewer">Can view</option>
                <option value="helper">Can help</option>
              </select>
            </div>
            <Button type="submit" size="sm" disabled={busy}>
              <UserPlus size={14} aria-hidden="true" />
              Send invite
            </Button>
            {inviteUrl && (
              <div className={styles.row}>
                <code className={styles.muted} style={{ wordBreak: 'break-all' }}>
                  {inviteUrl}
                </code>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard?.writeText(inviteUrl)
                    setMessage('Invite link copied.')
                  }}
                >
                  <Copy size={14} />
                  Copy
                </Button>
              </div>
            )}
          </form>
        )}

        {vault.isOwner && (
          <div className={styles.form}>
            <p className={styles.cardTitle}>Share vault keys</p>
            <p className={styles.muted}>
              After someone accepts, share the encrypted vault key so they can
              decrypt. {needsKey.length} member
              {needsKey.length === 1 ? '' : 's'} waiting.
            </p>
            <Button size="sm" onClick={onShareKeys} disabled={busy}>
              <Share2 size={14} aria-hidden="true" />
              Share keys
            </Button>
          </div>
        )}

        <section>
          <p className={styles.cardTitle}>Members</p>
          {members.length === 0 ? (
            <p className={styles.empty}>No members yet.</p>
          ) : (
            <ul className={styles.list}>
              {members.map((m) => (
                <li key={m.id} className={styles.card}>
                  <div className={styles.row}>
                    <span className={styles.cardTitle}>
                      {m.user_id === user.id ? 'You' : m.user_id.slice(0, 8)}
                    </span>
                    <span className={styles.cardMeta}>
                      {ROLE_LABEL[m.role] || m.role}
                      {m.role !== 'owner' &&
                        (!m.wrapped_dek || m.wrapped_dek_iv !== 'ecdh') &&
                        ' · awaiting key'}
                    </span>
                  </div>
                  {vault.isOwner && m.role !== 'owner' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Remove member"
                      disabled={busy}
                      onClick={() => onRevokeMember(m.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {vault.isOwner && invites.length > 0 && (
          <section>
            <p className={styles.cardTitle}>Pending invites</p>
            <ul className={styles.list}>
              {invites.map((inv) => (
                <li key={inv.id} className={styles.card}>
                  <span className={styles.cardMeta}>
                    {inv.invited_email} · {ROLE_LABEL[inv.role]}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={async () => {
                      await revokeInvite(inv.id)
                      await reload()
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
