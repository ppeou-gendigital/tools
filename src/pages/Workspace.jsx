import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Copy,
  Link2,
  Mail,
  MessageSquare,
  Share2,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import {
  canNativeShare,
  mailtoInvite,
  nativeShareInvite,
  smsInvite,
} from '@/lib/inviteShare'
import {
  createInvite,
  getWorkspace,
  inviteUrl,
  isInviteOpen,
  labelForInviteRole,
  listInvites,
  listMembers,
  myMembership,
  revokeInvite,
} from '@/lib/invitesApi'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

const APP_NAME = 'TOOLNAME'

export function Workspace() {
  const { params, goBack, previousRouteLabel, goHome } = useNavigation()
  const workspaceId = params.workspaceId
  const { user } = useAuth()
  const qc = useQueryClient()
  const [inviteRole, setInviteRole] = useState('editor')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { data: workspace, isLoading } = useQuery({
    queryKey: ['toolname', 'workspace', workspaceId],
    queryFn: () => getWorkspace(workspaceId),
    enabled: !!workspaceId,
  })

  const { data: membership } = useQuery({
    queryKey: ['toolname', 'membership', workspaceId],
    queryFn: () => myMembership(workspaceId),
    enabled: !!workspaceId && !!user?.id,
  })

  const { data: members = [] } = useQuery({
    queryKey: ['toolname', 'members', workspaceId],
    queryFn: () => listMembers(workspaceId),
    enabled: !!workspaceId,
  })

  const isOwner = membership?.role === 'owner'

  const { data: invites = [] } = useQuery({
    queryKey: ['toolname', 'invites', workspaceId],
    queryFn: () => listInvites(workspaceId),
    enabled: !!workspaceId && isOwner,
  })

  const openInvites = useMemo(
    () => invites.filter((inv) => isInviteOpen(inv)),
    [invites],
  )

  function invalidate() {
    qc.invalidateQueries({ queryKey: ['toolname', 'invites', workspaceId] })
    qc.invalidateQueries({ queryKey: ['toolname', 'members', workspaceId] })
  }

  async function ensureInvite(role = inviteRole) {
    const existing = openInvites.find(
      (inv) => inv.role === role && !inv.email,
    )
    if (existing) return existing
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    return createInvite(workspaceId, role, expires.toISOString())
  }

  async function withInvite(action, actionKey, successMessage) {
    setError('')
    setMessage('')
    setBusy(actionKey)
    try {
      const inv = await ensureInvite(inviteRole)
      const url = inviteUrl(inv.token)
      await action(url, inv)
      invalidate()
      if (successMessage) setMessage(successMessage)
    } catch (err) {
      setError(err?.message ?? 'Could not prepare invite.')
    } finally {
      setBusy('')
    }
  }

  if (!workspaceId) {
    return (
      <div className={styles.page}>
        <PageHeader title="Workspace" />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing workspace.</p>
          <Button onClick={goHome}>Go home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={workspace?.title || (isLoading ? '…' : 'Workspace')}
        subtitle="Demo shared workspace — invite collaborators with a join link."
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        {isLoading && <LoadingState>Loading workspace…</LoadingState>}
        {!isLoading && !workspace && (
          <div className={styles.empty}>
            <p className={styles.error}>
              Workspace not found, or you are not a member.
            </p>
            <Button onClick={goHome}>Go home</Button>
          </div>
        )}

        {workspace && (
          <>
            <div className={styles.block}>
              <span className={styles.rowTitle}>Members</span>
              <span className={styles.rowMeta}>
                {members.length} member{members.length === 1 ? '' : 's'}
                {membership
                  ? ` · you are ${labelForInviteRole(membership.role)}`
                  : ''}
              </span>
              <ul className={styles.list} aria-label="Members">
                {members.map((m) => (
                  <li key={m.userId} className={styles.listItem}>
                    <span>
                      {m.userId === user?.id ? 'You' : m.userId.slice(0, 8)}
                    </span>
                    <span className={styles.rowMeta}>
                      {labelForInviteRole(m.role)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {isOwner && (
              <div className={styles.block}>
                <span className={styles.rowTitle}>Share join link</span>
                <p className={styles.hint}>
                  Anyone with the link can join until it expires or you revoke
                  it. Peek works while logged out; accepting requires sign-in.
                </p>
                <div className={styles.field}>
                  <Label htmlFor="invite-role">Role</Label>
                  <select
                    id="invite-role"
                    className={styles.select}
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div className={styles.inviteActions}>
                  <Button
                    size="sm"
                    disabled={!!busy}
                    onClick={() =>
                      withInvite(async (url) => {
                        await navigator.clipboard.writeText(url)
                      }, 'copy', 'Link copied.')
                    }
                  >
                    <Copy size={14} aria-hidden="true" />
                    {busy === 'copy' ? 'Working…' : 'Copy link'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!busy}
                    onClick={() =>
                      withInvite(async (url) => {
                        mailtoInvite({
                          resourceTitle: workspace.title,
                          url,
                          appName: APP_NAME,
                        })
                      }, 'mail')
                    }
                  >
                    <Mail size={14} aria-hidden="true" />
                    Email
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!busy}
                    onClick={() =>
                      withInvite(async (url) => {
                        smsInvite({
                          resourceTitle: workspace.title,
                          url,
                          appName: APP_NAME,
                        })
                      }, 'sms')
                    }
                  >
                    <MessageSquare size={14} aria-hidden="true" />
                    Message
                  </Button>
                  {canNativeShare() && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!!busy}
                      onClick={() =>
                        withInvite(async (url) => {
                          await nativeShareInvite({
                            resourceTitle: workspace.title,
                            url,
                            appName: APP_NAME,
                          })
                        }, 'share')
                      }
                    >
                      <Share2 size={14} aria-hidden="true" />
                      Share
                    </Button>
                  )}
                </div>
                {message && (
                  <p className={styles.hint} role="status">
                    {message}
                  </p>
                )}
                {error && (
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}
                {openInvites.length > 0 && (
                  <ul className={styles.list} aria-label="Active join links">
                    {openInvites.map((inv) => (
                      <li key={inv.id} className={styles.listItem}>
                        <span>
                          <Link2 size={14} aria-hidden="true" />{' '}
                          {labelForInviteRole(inv.role)}
                          {inv.expiresAt
                            ? ` · expires ${new Date(inv.expiresAt).toLocaleDateString()}`
                            : ''}
                        </span>
                        <span className={styles.inviteActions}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(
                                  inviteUrl(inv.token),
                                )
                                setMessage('Link copied.')
                              } catch (err) {
                                setError(err.message)
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
                              try {
                                await revokeInvite(inv.id)
                                invalidate()
                                setMessage('Invite revoked.')
                              } catch (err) {
                                setError(err.message)
                              }
                            }}
                          >
                            Revoke
                          </Button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
