# @tools/behavioral

Config/slot interaction shells: AppShell, FloatingMenu, MenuPanel, nav, auth gate/form.

## SignInForm (passwordless OTP)

One form for every tool: **email → 6-digit code → session**. No Sign in / Sign up tabs. New users are created implicitly (`shouldCreateUser: true`).

```jsx
<SignInForm appName="Viaggio" logoIcon={PlaneTakeoff} />
// Invite / pre-auth context:
<SignInForm
  appName="Viaggio"
  logoIcon={PlaneTakeoff}
  contextMessage="Sign in to join the journey."
  onBack={() => goHome()}
/>
```

### Supabase email templates (required)

`signInWithOtp` + `verifyOtp({ type: 'email' })` need a **6-digit code**, not a magic-link confirm URL.

Dashboard → **Authentication** → **Email Templates**:

- **Magic Link** and **Confirm sign up** bodies must include `{{ .Token }}` (the code).
- Do not rely on `{{ .ConfirmationURL }}` as the primary path — that produces `type=signup` links (often with `redirect_to=localhost`).

Also set **URL Configuration**:

- **Site URL** → your production host (e.g. `https://project-viaggio.web.app`), not `http://localhost:3000`.
- **Redirect URLs** → allowlist Firebase hosts + local Vite origins.

## AppShell bottom clearance

By default the main scroll area has **no** FAB bottom padding (`--shell-main-pad-bottom: 0`).

Viaggio is the only tool that should opt in:

```jsx
<AppShell fabClearance chrome={<FloatingMenu />} hosts={<PlaylistPlaybackHost />}>
  {children}
</AppShell>
```

That adds `.bh-shell--fab-clearance` (FAB height + corner offset + spacing). Playlist mini-dock and map full-bleed still override via `data-playlist-dock` / `data-map-page`.
