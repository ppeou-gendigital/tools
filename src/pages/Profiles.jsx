import { useEffect, useRef, useState } from 'react'
import {
  CloudDownload,
  CloudUpload,
  Download,
  FileJson,
  SquareArrowOutUpRight,
  Ticket,
  Trash2,
  Upload,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { PageHeader } from '@/patterns/PageHeader'
import { jiraApi } from '@/lib/jira/api'
import { isJsonAttachment, parseIssueKey } from '@/lib/jira/issueKey'
import {
  canSyncWithJira,
  getActiveTabHost,
  JIRA_HOST,
} from '@/lib/jira/profileSource'
import { loadProfileConfig } from '@/lib/jira/profileStorage'
import { useProfiles } from '@/providers/ProfileProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

function formatBytes(size) {
  const n = Number(size) || 0
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function attachmentFilename(profile) {
  return profile.source?.filename || profile.name
}

export function Profiles() {
  const fileRef = useRef(null)
  const {
    list,
    selectedId,
    importProfile,
    importProfileFromJson,
    setProfileSource,
    saveProfileJson,
    selectProfile,
    deleteProfile,
    exportProfile,
  } = useProfiles()
  const { replace } = useNavigation()
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [ticketInput, setTicketInput] = useState('')
  const [issueKey, setIssueKey] = useState('')
  const [attachments, setAttachments] = useState(null)
  const [loadingList, setLoadingList] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [pushingNew, setPushingNew] = useState(false)
  const [activeHost, setActiveHost] = useState(null)
  const [importMode, setImportMode] = useState('jira')

  const selectedProfile = list.find((p) => p.id === selectedId)
  const pushBusy = Boolean(busyId) || pushingNew

  useEffect(() => {
    let cancelled = false
    const refreshHost = () => {
      getActiveTabHost().then((host) => {
        if (!cancelled) setActiveHost(host)
      })
    }
    refreshHost()
    const onActivated = () => refreshHost()
    const onUpdated = (_id, info) => {
      if (info.status === 'complete' || info.url) refreshHost()
    }
    try {
      chrome?.tabs?.onActivated?.addListener(onActivated)
      chrome?.tabs?.onUpdated?.addListener(onUpdated)
    } catch {
      /* non-extension */
    }
    return () => {
      cancelled = true
      try {
        chrome?.tabs?.onActivated?.removeListener(onActivated)
        chrome?.tabs?.onUpdated?.removeListener(onUpdated)
      } catch {
        /* ignore */
      }
    }
  }, [])

  async function refreshAttachments(key = issueKey) {
    if (!key) return
    const { data, error: err } = await jiraApi.attachments.list(key)
    if (err) {
      setError(String(err?.message || err))
      return
    }
    setAttachments(data.filter(isJsonAttachment))
  }

  async function onFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    setSuccess(null)
    try {
      await importProfile(file)
      replace('report')
    } catch (err) {
      setError(err?.message || 'Could not import profile JSON')
    }
  }

  async function openProfile(id) {
    await selectProfile(id)
    replace('report')
  }

  async function loadAttachments(e) {
    e?.preventDefault?.()
    setError(null)
    setSuccess(null)
    setAttachments(null)
    setIssueKey('')

    let key
    try {
      key = parseIssueKey(ticketInput)
    } catch (err) {
      setError(err?.message || 'Invalid issue key')
      return
    }

    setLoadingList(true)
    try {
      const { data, error: err } = await jiraApi.attachments.list(key)
      if (err) {
        setError(String(err?.message || err))
        return
      }
      setIssueKey(key)
      setAttachments(data.filter(isJsonAttachment))
    } finally {
      setLoadingList(false)
    }
  }

  async function importAttachment(att) {
    setError(null)
    setSuccess(null)
    setBusyId(`import:${att.id}`)
    try {
      const { data, error: err } = await jiraApi.attachments.downloadJson(
        att.contentUrl,
      )
      if (err) {
        setError(String(err?.message || err))
        return
      }
      await importProfileFromJson(data, att.filename, {
        issueKey,
        attachmentId: att.id,
        filename: att.filename,
        host: JIRA_HOST,
      })
      replace('report')
    } catch (err) {
      setError(err?.message || 'Could not import attachment')
    } finally {
      setBusyId(null)
    }
  }

  async function syncFromJira(profile) {
    setError(null)
    setSuccess(null)
    const { issueKey: key, attachmentId, filename } = profile.source
    setBusyId(`from:${profile.id}`)
    try {
      const { data: atts, error: listErr } = await jiraApi.attachments.list(key)
      if (listErr) {
        setError(String(listErr?.message || listErr))
        return
      }
      const att =
        atts.find((a) => String(a.id) === String(attachmentId)) ||
        atts.find((a) => a.filename === filename)
      if (!att) {
        setError(`Attachment “${filename}” not found on ${key}.`)
        return
      }
      const { data, error: dlErr } = await jiraApi.attachments.downloadJson(
        att.contentUrl,
      )
      if (dlErr) {
        setError(String(dlErr?.message || dlErr))
        return
      }
      await saveProfileJson(profile.id, data)
      await setProfileSource(profile.id, {
        issueKey: key,
        attachmentId: att.id,
        filename: att.filename,
        host: JIRA_HOST,
      })
      setSuccess(`Synced from ${key}`)
    } catch (err) {
      setError(err?.message || 'Could not sync from Jira')
    } finally {
      setBusyId(null)
    }
  }

  async function syncToJira(profile) {
    setError(null)
    setSuccess(null)
    const { issueKey: key, attachmentId, filename } = profile.source
    setBusyId(`to:${profile.id}`)
    try {
      const config = await loadProfileConfig(profile.id)
      if (attachmentId) {
        const { error: delErr } = await jiraApi.attachments.remove(attachmentId)
        if (delErr) {
          setError(String(delErr?.message || delErr))
          return
        }
      }
      const { data, error: upErr } = await jiraApi.attachments.upload(key, {
        filename,
        json: config,
      })
      if (upErr) {
        setError(String(upErr?.message || upErr))
        return
      }
      if (data?.id) {
        await setProfileSource(profile.id, {
          issueKey: key,
          attachmentId: data.id,
          filename,
          host: JIRA_HOST,
        })
      }
      setSuccess(`Synced to ${key}`)
      if (issueKey === key) await refreshAttachments(key)
    } catch (err) {
      setError(err?.message || 'Could not sync to Jira')
    } finally {
      setBusyId(null)
    }
  }

  async function uploadSelectedProfile() {
    setError(null)
    setSuccess(null)
    if (!issueKey) {
      setError('Load a Jira ticket first.')
      return
    }
    if (!selectedId || !selectedProfile) {
      setError('Select a saved profile first.')
      return
    }

    setPushingNew(true)
    try {
      const config = await loadProfileConfig(selectedId)
      const filename = attachmentFilename(selectedProfile)
      const { data, error: upErr } = await jiraApi.attachments.upload(issueKey, {
        filename,
        json: config,
      })
      if (upErr) {
        setError(String(upErr?.message || upErr))
        return
      }
      if (data?.id) {
        await importProfileFromJson(config, filename, {
          issueKey,
          attachmentId: data.id,
          filename,
          host: JIRA_HOST,
        })
      }
      setSuccess(`Uploaded to ${issueKey}`)
      await refreshAttachments(issueKey)
    } catch (err) {
      setError(err?.message || 'Could not upload profile')
    } finally {
      setPushingNew(false)
    }
  }

  return (
    <div className={styles.shellPage}>
      <PageHeader
        title="Profiles"
        subtitle="Add a profile from a Jira attachment or a local JSON file."
      />
      <div className={cx('is-fluid-width', styles.shellBody)}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className={styles.success} role="status">
            {success}
          </p>
        )}

        <section
          className={styles.profilePanel}
          aria-labelledby="add-profile-heading"
        >
          <h2 id="add-profile-heading" className={styles.rowTitle}>
            Add a profile
          </h2>

          <div
            className={styles.importChooser}
            role="tablist"
            aria-label="Import method"
          >
            <button
              type="button"
              role="tab"
              id="import-tab-jira"
              aria-selected={importMode === 'jira'}
              aria-controls="import-panel-jira"
              className={cx(
                styles.importChoice,
                importMode === 'jira' && styles.importChoiceActive,
              )}
              onClick={() => setImportMode('jira')}
            >
              <Ticket size={16} aria-hidden="true" />
              From Jira ticket
            </button>
            <button
              type="button"
              role="tab"
              id="import-tab-file"
              aria-selected={importMode === 'file'}
              aria-controls="import-panel-file"
              className={cx(
                styles.importChoice,
                importMode === 'file' && styles.importChoiceActive,
              )}
              onClick={() => setImportMode('file')}
            >
              <Upload size={16} aria-hidden="true" />
              From computer
            </button>
          </div>

          {importMode === 'jira' && (
            <div
              id="import-panel-jira"
              role="tabpanel"
              aria-labelledby="import-tab-jira"
              className={styles.importPanel}
            >
              <form className={styles.ticketRow} onSubmit={loadAttachments}>
                <Input
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="WEBEXP-99797 or browse URL"
                  aria-label="Jira issue key or URL"
                />
                <Button
                  type="submit"
                  className={styles.ticketLoadBtn}
                  disabled={!ticketInput.trim() || loadingList || pushBusy}
                >
                  {loadingList ? 'Loading…' : 'Load'}
                </Button>
              </form>

              {attachments && (
                <div className={styles.attachmentBlock}>
                  <p className={styles.hint}>
                    JSON attachments on <strong>{issueKey}</strong>
                    {attachments.length > 0 ? ` (${attachments.length})` : ''}
                  </p>
                  {attachments.length === 0 ? (
                    <p className={styles.hint}>
                      No JSON attachments on this ticket.
                    </p>
                  ) : (
                    <ul className={styles.attachmentList}>
                      {attachments.map((att) => {
                        const importing = busyId === `import:${att.id}`
                        return (
                          <li key={att.id} className={styles.attachmentRow}>
                            <div className={styles.attachmentMeta}>
                              <FileJson
                                size={16}
                                className={styles.attachmentIcon}
                                aria-hidden="true"
                              />
                              <div className={styles.attachmentText}>
                                <span
                                  className={styles.attachmentName}
                                  title={att.filename}
                                >
                                  {att.filename}
                                </span>
                                <span className={styles.attachmentSub}>
                                  {formatBytes(att.size)}
                                  {att.created
                                    ? ` · ${new Date(att.created).toLocaleDateString()}`
                                    : ''}
                                </span>
                              </div>
                            </div>
                            <div className={styles.attachmentActions}>
                              <Button
                                type="button"
                                size="sm"
                                className={styles.attachmentImportBtn}
                                disabled={pushBusy}
                                onClick={() => importAttachment(att)}
                              >
                                {importing ? 'Importing…' : 'Import'}
                              </Button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  <div className={styles.uploadSelectedRow}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={pushBusy || !selectedId}
                      onClick={uploadSelectedProfile}
                      title={
                        selectedProfile
                          ? `Upload ${attachmentFilename(selectedProfile)} to ${issueKey}`
                          : 'Select a saved profile first'
                      }
                    >
                      <Upload size={14} aria-hidden="true" />
                      {pushingNew
                        ? 'Uploading…'
                        : selectedProfile
                          ? `Upload “${attachmentFilename(selectedProfile)}”`
                          : 'Upload selected profile'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {importMode === 'file' && (
            <div
              id="import-panel-file"
              role="tabpanel"
              aria-labelledby="import-tab-file"
              className={styles.importPanel}
            >
              <p className={styles.hint}>
                Choose a JSON capacity config export from your computer.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className={styles.hiddenInput}
                onChange={onFileChange}
              />
              <Button
                type="button"
                fullWidth
                className={styles.chooseFileBtn}
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={16} aria-hidden="true" />
                Choose JSON file
              </Button>
            </div>
          )}
        </section>

        <section className={styles.profilePanel} aria-labelledby="profiles-heading">
          <div className={styles.profilePanelHead}>
            <h2 id="profiles-heading" className={styles.rowTitle}>
              Saved profiles
            </h2>
            {list.length > 0 && (
              <span className={styles.count}>{list.length}</span>
            )}
          </div>

          {list.length === 0 ? (
            <div className={styles.profileEmpty}>
              <p className={styles.hint}>No profiles yet.</p>
              <p className={styles.hint}>
                Load a Jira ticket above and import a JSON attachment.
              </p>
            </div>
          ) : (
            <ul className={styles.profileList}>
              {list.map((profile) => {
                const active = profile.id === selectedId
                const showSync = canSyncWithJira(profile, activeHost)
                const syncingFrom = busyId === `from:${profile.id}`
                const syncingTo = busyId === `to:${profile.id}`
                return (
                  <li
                    key={profile.id}
                    className={cx(
                      styles.profileRow,
                      active && styles.profileRowActive,
                    )}
                  >
                    <button
                      type="button"
                      className={styles.profileMain}
                      onClick={() => openProfile(profile.id)}
                      title={`Open ${profile.name}`}
                    >
                      <span className={styles.profileName} title={profile.name}>
                        {profile.name}
                      </span>
                      {active && (
                        <span className={styles.profileBadge}>Active</span>
                      )}
                    </button>
                    <div className={styles.profileActions}>
                      {showSync && (
                        <>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className={styles.profileIconBtn}
                            title={
                              syncingFrom ? 'Syncing from Jira…' : 'Sync from Jira'
                            }
                            aria-label={`Sync ${profile.name} from Jira`}
                            disabled={pushBusy}
                            onClick={() => syncFromJira(profile)}
                          >
                            <CloudDownload size={16} aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className={styles.profileIconBtn}
                            title={
                              syncingTo ? 'Syncing to Jira…' : 'Sync to Jira'
                            }
                            aria-label={`Sync ${profile.name} to Jira`}
                            disabled={pushBusy}
                            onClick={() => syncToJira(profile)}
                          >
                            <CloudUpload size={16} aria-hidden="true" />
                          </Button>
                        </>
                      )}
                      <Button
                        type="button"
                        size="icon"
                        variant={active ? 'secondary' : 'default'}
                        className={styles.profileIconBtn}
                        title="Open"
                        aria-label={`Open ${profile.name}`}
                        onClick={() => openProfile(profile.id)}
                      >
                        <SquareArrowOutUpRight size={16} aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className={styles.profileIconBtn}
                        title="Export"
                        aria-label={`Export ${profile.name}`}
                        onClick={() => exportProfile(profile.id)}
                      >
                        <Download size={16} aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className={cx(
                          styles.profileIconBtn,
                          styles.profileDeleteBtn,
                        )}
                        title="Remove"
                        aria-label={`Remove ${profile.name}`}
                        onClick={() => deleteProfile(profile.id)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
