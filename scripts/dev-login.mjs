#!/usr/bin/env node
// dev-login.mjs — fast, one-command dev sign-in for the local Vite dev server.
//
// These apps sign in with a real email OTP (no static/test OTP). In a dev/CI
// box we can't open a mailbox, so this script:
//   1. reads the dev account from your .env(.local)  (VITE_DEV_AUTOLOGIN_EMAIL)
//   2. requests an OTP  (Supabase signInWithOtp)
//   3. reads the 6-digit code straight from Resend  (the SMTP provider)
//   4. verifies it  (Supabase verifyOtp)  -> a real session
//   5. writes public/__dev_login.html, a tiny page that drops the session into
//      localStorage[<app>.auth] and redirects to "/"
//
// Then just open the printed URL once and the app boots authenticated — no
// typing, no waiting on a human mailbox. Re-run any time the session expires.
//
// Usage:  node scripts/dev-login.mjs [--port 5173] [--url http://localhost:5173]
//         (run from the app dir, with the dev server already running)
//
// Requires RESEND_API_KEY in the environment. Reads Supabase creds + the dev
// email from .env.local / .env (same values Vite uses), so it's zero-config.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i !== -1 && args[i + 1] ? args[i + 1] : d; };

// --- load env from .env.local then .env (local wins), without extra deps ---
function loadEnvFile(name) {
  const p = resolve(process.cwd(), name);
  if (!existsSync(p)) return {};
  const out = {};
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}
const fileEnv = { ...loadEnvFile('.env'), ...loadEnvFile('.env.local') };
const env = (k) => process.env[k] ?? fileEnv[k];

function die(msg) { console.error(`\x1b[31merror:\x1b[0m ${msg}`); process.exit(1); }

const SUPABASE_URL = env('VITE_SUPABASE_URL');
const ANON = env('VITE_SUPABASE_ANON_KEY');
const EMAIL = env('VITE_DEV_AUTOLOGIN_EMAIL');
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL || !ANON) die('missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (.env.local)');
if (!EMAIL) die('missing VITE_DEV_AUTOLOGIN_EMAIL (.env.local) — set the dev test account');
if (!RESEND_API_KEY) die('missing RESEND_API_KEY in the environment');

// storageKey mirrors src/lib/supabase.js: `${pkg.name}.auth`
let appId = 'app';
try { appId = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')).name || 'app'; } catch { /* ignore */ }
const STORAGE_KEY = `${appId}.auth`;

const PORT = val('--port', '5173');
const BASE = (val('--url', `http://localhost:${PORT}`)).replace(/\/$/, '');

if (/^suppressed(\+|@)/i.test(EMAIL)) {
  console.error(
    `\x1b[33mwarning:\x1b[0m dev account "${EMAIL}" uses Resend's "suppressed" test inbox — ` +
    `its mail is marked suppressed (never delivered). Prefer a per-app Resend "delivered" test ` +
    `inbox and set it in VITE_DEV_AUTOLOGIN_EMAIL / the *_VITE_DEV_AUTOLOGIN_EMAIL secret.`,
  );
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.error(...a);

async function api(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  return { ok: res.ok, status: res.status, json };
}

async function main() {
  const startedAt = Date.now();
  log(`-> requesting OTP for ${EMAIL} @ ${new URL(SUPABASE_URL).host}`);
  const send = await api(`${SUPABASE_URL}/auth/v1/otp`, {
    method: 'POST',
    headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, create_user: true }),
  });
  if (!send.ok) die(`signInWithOtp failed: HTTP ${send.status} ${JSON.stringify(send.json)}`);

  log('-> reading code from Resend...');
  let code, emailRow;
  for (let i = 1; i <= 15 && !code; i++) {
    const list = await api('https://api.resend.com/emails?limit=20', { headers: { Authorization: `Bearer ${RESEND_API_KEY}` } });
    if (!list.ok) die(`Resend list failed: HTTP ${list.status}`);
    emailRow = (list.json.data || [])
      .filter((e) => (e.to || []).some((t) => String(t).toLowerCase() === EMAIL.toLowerCase()))
      .filter((e) => new Date(e.created_at + 'Z').getTime() >= startedAt - 1500)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    if (emailRow) {
      const full = await api(`https://api.resend.com/emails/${emailRow.id}`, { headers: { Authorization: `Bearer ${RESEND_API_KEY}` } });
      const m = `${full.json.text || ''} ${full.json.html || ''}`.match(/\b(\d{6})\b/);
      if (m) code = m[1];
    }
    if (!code) await sleep(1500);
  }
  if (!code) die('timed out waiting for the OTP email in Resend');
  log(`-> got code ${code} (Resend ${emailRow.last_event})`);

  const verify = await api(`${SUPABASE_URL}/auth/v1/verify`, {
    method: 'POST',
    headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, token: code, type: 'email' }),
  });
  if (!verify.ok || !verify.json.access_token) die(`verifyOtp failed: HTTP ${verify.status} ${JSON.stringify(verify.json)}`);

  const bootstrap = `<!doctype html><meta charset="utf-8"><title>dev login</title>
<body style="font:14px system-ui;padding:2rem">Signing in as ${EMAIL}…</body>
<script>
try { localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(verify.json))}); } catch (e) {}
location.replace('/');
</script>`;
  writeFileSync(resolve(process.cwd(), 'public/__dev_login.html'), bootstrap);

  log(`-> session ready for user ${verify.json.user?.id} (expires in ${verify.json.expires_in}s)`);
  log('\n\x1b[32mOpen this once to sign in:\x1b[0m');
  console.log(`${BASE}/__dev_login.html`);
}

main().catch((e) => die(e?.message ?? String(e)));
