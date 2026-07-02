# Working with git worktrees

Because every tool lives on its own branch in this repo, `git switch tool/xyz` completely swaps the files in your working directory. That's fine occasionally, but it gets in the way when you want to have several tools open at once, or keep `main` around to update the project index.

`git worktree` solves this: it lets one repository have **multiple working directories**, each on a different branch, all sharing the same `.git/` store.

---

## Layout you'll likely end up with

```
~/gengit/
├── tools/           # this repo, main branch (README, scripts, LICENSE)
├── xyz/             # worktree on branch tool/xyz
├── myReactApp1/     # worktree on branch poc/myReactApp1
└── MyBio/           # worktree on branch web/MyBio
```

Each sibling directory is a full checkout of a single project branch. `tools/` stays clean on `main`.

---

## Create a worktree for a new project

Either use the helper:

```bash
scripts/new-project.sh tool/xyz --worktree
```

...or do it by hand:

```bash
git worktree add ../xyz -b tool/xyz main
```

Both create `../xyz/` with a fresh branch `tool/xyz` based on `main`.

---

## Create a worktree for an existing project branch

If the branch already exists (locally or on `origin`):

```bash
# make sure we know about remote branches
git fetch origin

# check the existing branch out into ../xyz/
git worktree add ../xyz tool/xyz
```

You can now `cd ../xyz` and work there. Commits pushed from that directory update `tool/xyz` normally.

---

## Inspect and clean up

```bash
git worktree list                # show every worktree and its branch
git worktree remove ../xyz       # delete the worktree directory (branch stays)
git worktree prune               # forget worktrees whose dirs are gone
```

Deleting a worktree does **not** delete the branch. Delete the branch separately if you want:

```bash
git branch -D tool/xyz                       # local
git push origin --delete tool/xyz            # remote
```

---

## Gotchas

- **You can't check out the same branch in two worktrees at once.** Git will refuse — this is a feature.
- **Uncommitted changes stay in the worktree they were made in.** They don't magically follow you between directories.
- **Paths are absolute in `.git/worktrees/`.** If you move a worktree directory, run `git worktree repair` from either location.
- **IDE indexers may get confused if two worktrees share the same project name.** Point your IDE at the worktree directory, not at the shared `.git/`.

---

## Why this fits the branch-per-project style of this repo

- `main` (this directory) stays untouched, so you can always update the README index or `scripts/` without stashing project work.
- No `git switch` needed when jumping between tools — just `cd`.
- Each tool has its own physical directory, which mirrors how the tools actually feel: independent projects that happen to share a single remote.
