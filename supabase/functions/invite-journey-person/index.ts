// Deno Edge Function: send magic-link / invite email for a journey person.
// Deploy: supabase functions deploy invite-journey-person
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INVITE_REDIRECT_URL
//   (INVITE_REDIRECT_URL = app origin, e.g. http://localhost:5173)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const redirectBase =
      Deno.env.get('INVITE_REDIRECT_URL') ?? Deno.env.get('SITE_URL') ?? ''

    if (!supabaseUrl || !serviceKey) {
      return json({ error: 'Server misconfigured' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Missing authorization' }, 401)

    const userClient = createClient(supabaseUrl, anonKey || serviceKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser()
    if (userErr || !user) return json({ error: 'Unauthorized' }, 401)

    const body = await req.json().catch(() => ({}))
    const inviteId = body.inviteId as string | undefined
    const journeyId = body.journeyId as string | undefined
    if (!inviteId || !journeyId) {
      return json({ error: 'inviteId and journeyId required' }, 400)
    }

    const admin = createClient(supabaseUrl, serviceKey)

    const { data: membership } = await admin
      .from('viaggio_journey_members')
      .select('role')
      .eq('journey_id', journeyId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (membership?.role !== 'owner') {
      return json({ error: 'Only owners can send invite emails' }, 403)
    }

    const { data: invite, error: invErr } = await admin
      .from('viaggio_invites')
      .select('*')
      .eq('id', inviteId)
      .eq('journey_id', journeyId)
      .maybeSingle()

    if (invErr || !invite) return json({ error: 'Invite not found' }, 404)
    if (invite.revoked_at) return json({ error: 'Invite revoked' }, 400)

    let email = (invite.email as string | null)?.trim() || ''
    if (!email && invite.journey_person_id) {
      const { data: jp } = await admin
        .from('viaggio_journey_people')
        .select('email')
        .eq('id', invite.journey_person_id)
        .maybeSingle()
      email = (jp?.email as string | null)?.trim() || ''
    }
    if (!email) {
      return json({ error: 'Invite has no email address' }, 400)
    }

    const redirectTo = redirectBase
      ? `${redirectBase.replace(/\/$/, '')}/?invite=${encodeURIComponent(invite.token)}`
      : undefined

    const { data: linkData, error: linkErr } =
      await admin.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: redirectTo ? { redirectTo } : undefined,
      })

    if (linkErr) {
      // Fall back to inviteUserByEmail (creates user if needed + sends email)
      const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
        email,
        redirectTo ? { redirectTo } : undefined,
      )
      if (inviteErr) {
        return json({ error: inviteErr.message || linkErr.message }, 400)
      }
      return json({ ok: true, method: 'inviteUserByEmail' })
    }

    // generateLink does not always send; prefer inviteUserByEmail for delivery
    if (!linkData?.properties?.action_link) {
      const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
        email,
        redirectTo ? { redirectTo } : undefined,
      )
      if (inviteErr) return json({ error: inviteErr.message }, 400)
      return json({ ok: true, method: 'inviteUserByEmail' })
    }

    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
      email,
      redirectTo ? { redirectTo } : undefined,
    )
    if (inviteErr) {
      // User may already exist — try OTP magiclink send via generateLink only
      // Client still has invite URL; report soft success with note
      return json({
        ok: true,
        method: 'generateLink',
        note: inviteErr.message,
      })
    }

    return json({ ok: true, method: 'inviteUserByEmail' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return json({ error: message }, 500)
  }
})

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
