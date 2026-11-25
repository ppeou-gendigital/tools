// Confluence Data Center attachments. Pages are the distribution channel for
// both the skill artefacts and shared profile JSON.

import { CliError } from './http.mjs'

const JSON_SNIFF = /\.json$/i

export function createConfluence(client) {
  const { request } = client

  async function currentUser() {
    return request('/rest/api/user/current')
  }

  async function page(pageId) {
    const data = await request(`/rest/api/content/${encodeURIComponent(pageId)}`, {
      query: { expand: 'version,space,history.lastUpdated' },
    })
    return {
      id: String(data.id),
      title: data.title,
      spaceKey: data.space?.key ?? '',
      version: Number(data.version?.number ?? 0),
      url: `${client.base}/pages/viewpage.action?pageId=${data.id}`,
    }
  }

  async function listAttachments(pageId, { limit = 100 } = {}) {
    const data = await request(
      `/rest/api/content/${encodeURIComponent(pageId)}/child/attachment`,
      { query: { limit, expand: 'version' } },
    )

    return (data?.results ?? []).map((attachment) => ({
      id: String(attachment.id),
      filename: String(attachment.title ?? attachment.filename ?? ''),
      size: Number(attachment.extensions?.fileSize ?? 0),
      mimeType: attachment.extensions?.mediaType ?? '',
      version: Number(attachment.version?.number ?? 1),
      when: attachment.version?.when ?? null,
      author: attachment.version?.by?.displayName ?? '',
      download: attachment._links?.download ?? null,
      isJson: JSON_SNIFF.test(String(attachment.title ?? '')),
    }))
  }

  async function downloadAttachment(attachment) {
    const link =
      attachment.download ??
      `/download/attachments/${attachment.id}/${encodeURIComponent(attachment.filename)}`
    return request(link, { expect: 'buffer' })
  }

  // Uploading a file whose name already exists creates a new version on Data
  // Center. The `/data` endpoint is the documented version-update path, so use
  // it when the filename is already present.
  async function uploadAttachment(pageId, filename, bytes, { comment = '' } = {}) {
    const existing = (await listAttachments(pageId, { limit: 200 })).find(
      (attachment) => attachment.filename === filename,
    )

    const form = new FormData()
    form.append('file', new Blob([bytes], { type: 'application/json' }), filename)
    if (comment) form.append('comment', comment)

    const endpoint = existing
      ? `/rest/api/content/${encodeURIComponent(pageId)}/child/attachment/${encodeURIComponent(existing.id)}/data`
      : `/rest/api/content/${encodeURIComponent(pageId)}/child/attachment`

    const data = await request(endpoint, {
      method: 'POST',
      body: form,
      headers: { 'X-Atlassian-Token': 'no-check' },
    })

    const created = data?.results?.[0] ?? data
    if (!created?.id) {
      throw new CliError('Confluence accepted the upload but returned no attachment.', {
        code: 'upload',
      })
    }

    return {
      id: String(created.id),
      filename: String(created.title ?? created.filename ?? filename),
      version: Number(created.version?.number ?? existing?.version ?? 0),
      link: created._links?.download ?? null,
    }
  }

  return {
    currentUser,
    page,
    listAttachments,
    downloadAttachment,
    uploadAttachment,
  }
}
