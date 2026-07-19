# Accesso vault datafeed

JSON contract for importing and exporting **credentials** and **credit cards**.
Use the sample files in this folder as templates when building feeds from
another system.

Exported files contain **plaintext secrets**. Treat them as highly sensitive:
encrypt at rest, transmit over trusted channels, and delete after import.

## Envelope

Every feed is a single JSON object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | number | yes | Format version. Currently `1`. |
| `type` | string | yes | One of `credentials`, `credit_cards`, or `vault`. |
| `exportedAt` | string | no | ISO-8601 timestamp (export fills this). |
| `items` | array | for typed feeds | Item list when `type` is `credentials` or `credit_cards`. |
| `credentials` | array | for `vault` | Credential items when `type` is `vault`. |
| `creditCards` | array | for `vault` | Credit-card items when `type` is `vault`. |

Unknown fields are ignored. Extra keys on items are ignored.

## Types

### `credentials`

See [`credentials.sample.json`](./credentials.sample.json).

Each item:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `displayName` | string | yes | Plaintext label (also stored unencrypted in the DB). |
| `urlOrApp` | string | no | Site URL or app name. Matching uses hostname only. |
| `accounts` | array | no | Zero or more `{ username, password }` objects. |
| `notes` | string | no | Free text. |

`accounts[].username` and `accounts[].password` are strings (may be empty).
Empty account rows are dropped on import; if none remain, one empty account
is stored so the edit form still opens cleanly.

### `credit_cards`

See [`credit-cards.sample.json`](./credit-cards.sample.json).

Each item:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `displayName` | string | no | Optional label. Blank → client shows `Issuer •••• last4`. |
| `cardholderName` | string | no | |
| `cardNumber` | string | no | Digits; non-digits are stripped on import. |
| `expMonth` | string | no | e.g. `"12"`. |
| `expYear` | string | no | Prefer 4-digit year, e.g. `"2029"`. |
| `cvv` | string | no | |
| `issuerBank` | string | no | |
| `billingZip` | string | no | |
| `pin` | string | no | |
| `notes` | string | no | |
| `isFavorite` | boolean | no | Defaults to `false`. |

Card brand is never stored; Accesso derives it from `cardNumber`.

### `vault` (combined)

See [`vault.sample.json`](./vault.sample.json). Carries both collections in one
file. Useful for full-vault export/import between Accesso installs.

## Import behavior (Accesso)

1. Vault must be unlocked (client-side E2EE encrypts each item before write).
2. Items are **always created as new rows** — no merge/update by URL or card number.
3. Invalid envelope / wrong `version` / wrong `type` rejects the whole file.
4. Per-item validation errors skip that item and continue; the UI reports counts.

## Export behavior (Accesso)

Export writes the same shapes as the samples (with `exportedAt` set). Row ids
and timestamps are omitted so feeds stay portable across systems.
