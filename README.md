# Tools

A personal collection of small, useful daily tools, apps, and proofs of concept.

Instead of creating a new GitHub repo for every little project, this repo keeps them all together — but not in the usual monorepo way. **Each project lives on its own branch**, and `main` stays almost empty on purpose.

---

## The convention

Every project branch is named `<category>/<name>`.

| Category   | Meaning                                                       | Example                    |
| ---------- | ------------------------------------------------------------- | -------------------------- |
| `poc/`     | Proof of concept — throwaway experiments                      | `poc/myReactApp1`          |
| `tool/`    | Reusable tools / CLI utilities                                | `tool/xyz`                 |
| `web/`     | Websites, landing pages, small web apps                       | `web/MyBio`                |
| `script/`  | One-off scripts (bash, python, node)                          | `script/rename-photos`     |
| `lib/`     | Reusable libraries / modules meant to be copied or vendored   | `lib/date-utils`           |
| `doc/`     | Notes, cheatsheets, writeups                                  | `doc/kubernetes-cheatsheet`|

Feel free to invent more categories — the only constraint enforced by `scripts/new-project.sh` is `^[a-z]+/[A-Za-z0-9._-]+$`.

### Web tools from `template/base` → GitHub Pages

For Chrome-extension + web app tools scaffolded from [`template/base`](../../tree/template/base), the live Pages path uses the **repo name** + the **branch name suffix** (not the category):

| Branch | Vite `base` (after init) | Live URL |
| ------ | ------------------------ | -------- |
| `tool/loopy` | `/tools/loopy/` | `https://ppeou-gendigital.github.io/tools/loopy/` |
| `tool/foo` | `/tools/foo/` | `https://ppeou-gendigital.github.io/tools/foo/` |

Workflow: branch off `template/base` → `npm run init -- --name <suffix>` → push to `tool/<suffix>`. That sets `base` / `outDir`, the Pages workflow trigger, and PWA metadata. Full checklist: [`TEMPLATE.md` on `template/base`](../../blob/template/base/TEMPLATE.md).

---

## Quick start

Create a new project branch from `main`:

```bash
scripts/new-project.sh tool/my-new-tool
```

Create it in a separate directory so `main` stays checked out here:

```bash
scripts/new-project.sh tool/my-new-tool --worktree
# -> creates ../my-new-tool/ with the branch tool/my-new-tool checked out
```

Create it and push to `origin` in one shot:

```bash
scripts/new-project.sh tool/my-new-tool --worktree --push
```

List everything you have:

```bash
scripts/list-projects.sh
```

Work on an existing project without leaving `main`:

```bash
git worktree add ../my-new-tool tool/my-new-tool
```

See [`docs/WORKTREES.md`](docs/WORKTREES.md) for more on worktrees.

---

## Project Index

Add a row here every time you create a new project. Replace `<user>/<repo>` with the actual GitHub path once the remote is set up.

### `tool/`

| Name | Description | Branch |
| ---- | ----------- | ------ |
| loopy | Chrome browser extension (Manifest V3) | [`tool/loopy`](../../tree/tool/loopy) |

### `poc/`

| Name | Description | Branch |
| ---- | ----------- | ------ |
| _(none yet)_ | | |

### `web/`

| Name | Description | Branch |
| ---- | ----------- | ------ |
| _(none yet)_ | | |

### `script/`

| Name | Description | Branch |
| ---- | ----------- | ------ |
| _(none yet)_ | | |

### `lib/`

| Name | Description | Branch |
| ---- | ----------- | ------ |
| _(none yet)_ | | |

### `doc/`

| Name | Description | Branch |
| ---- | ----------- | ------ |
| _(none yet)_ | | |

> Tip: `scripts/list-projects.sh` prints branches grouped by category if you ever want to regenerate this index.

---

## Rules (read these before you shoot yourself in the foot)

Because each project branch has its own, unrelated file tree, this repo does not behave like a normal one. Follow these rules:

1. **Never `git merge` one project branch into another** (or into `main`). Doing so will fuse two unrelated projects into an unrecoverable mess. If you need code from one project in another, copy the files by hand or extract them into a `lib/<name>` branch that you vendor.
2. **Pull Requests stay within a single project.** A feature branch like `tool/xyz-feature` should target `tool/xyz`, never `main`.
3. **`main` only holds scaffolding** — this README, `.gitignore`, `LICENSE`, and `scripts/`. Nothing else lands here.
4. **Scaffolding changes do not auto-propagate.** If you update `.gitignore` on `main`, existing project branches keep the old one. Cherry-pick if you want the update everywhere.
5. **CI belongs on the project branch**, not on `main`. `main` has no code to build or test.

---

## Layout of `main`

```
.
├── README.md              # this file
├── LICENSE                # MIT
├── .gitignore             # common ignores (OS, editors, Node, Python, builds)
├── scripts/
│   ├── new-project.sh     # create a new <category>/<name> branch
│   └── list-projects.sh   # list local + remote branches grouped by category
└── docs/
    └── WORKTREES.md       # how to use git worktree with this repo
```
