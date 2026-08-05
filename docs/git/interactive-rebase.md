# Adding a File to the Penultimate Git Commit

## The Problem

Sometimes you make two commits:

```text
A -- B -- C (HEAD)
```

where:

- `B` is the **penultimate commit** (the commit before the latest one)
- `C` is the **latest commit**

Then you realize:

> "I forgot to include a file in commit `B`."

You want the history to become:

```text
A -- B' -- C'
```

where:

- `B'` is the original `B` commit plus the missing file
- `C'` is the same as the old `C`, but rebuilt on top of the new `B'`

Git can do this with an interactive rebase.

---

## The Command

Start by rebasing the last two commits:

```bash
git rebase -i HEAD~2
```

This opens an editor showing something like:

```text
pick abc1234 Commit B
pick def5678 Commit C
```

Change the first line from:

```text
pick abc1234 Commit B
```

to:

```text
edit abc1234 Commit B
```

Leave the second commit as `pick`:

```text
edit abc1234 Commit B
pick def5678 Commit C
```

Save and close the editor.

Git will now pause at commit `B`.

---

## Add the Missing File

Add the file:

```bash
git add path/to/file
```

Then amend the commit:

```bash
git commit --amend --no-edit
```

The `--no-edit` flag keeps the existing commit message.

At this point, Git has replaced `B` with a new commit:

```text
A -- B'
```

`B'` contains the missing file.

---

## Continue the Rebase

Now run:

```bash
git rebase --continue
```

This tells Git:

> "I have finished modifying this commit. Continue applying the remaining commits."

During the rebase, Git temporarily removes the commits after the one being edited, then reapplies them on top of your modified history.

Before:

```text
A -- B -- C
```

After amending `B`:

```text
A -- B'
```

After `git rebase --continue`:

```text
A -- B' -- C'
```

The old commits are replaced with new commits because their contents changed, so their hashes change too.

---

## Does the New File Exist in the Last Commit?

Usually, yes.

Commits are snapshots of the repository state. When Git rebuilds `C`, it starts from the new `B'` and reapplies the changes from the old `C`.

Example:

Original history:

```text
B:
  foo.txt

C:
  foo.txt
  bar.txt
```

You amend `B` to add `baz.txt`:

```text
B':
  foo.txt
  baz.txt
```

After the rebase continues:

```text
C':
  foo.txt
  baz.txt
  bar.txt
```

The new file carries forward because the later commit did not remove it.

---

## The "Back to the Future" Mental Model

Interactive rebase is essentially Git time travel.

Starting point:

```text
A -- B -- C
```

1. Git goes back to the past:

   - Stop at `B` using `edit`.

2. You change the past:

   - Add the missing file.
   - Amend the commit.

3. Git rebuilds the future:

   - `git rebase --continue` replays `C` on top of the changed history.

Final timeline:

```text
A -- B' -- C'
```

The story is the same, but Git has created a new timeline with new commit identities.

---

## Important: Pushed Commits

Because rebasing rewrites history, the commit hashes change.

If these commits were already pushed to a remote repository, you will need:

```bash
git push --force-with-lease
```

Use this carefully, especially on shared branches, because other developers may still have references to the old history.

---

## Quick Recipe

```bash
git rebase -i HEAD~2

# mark the penultimate commit as "edit"

git add path/to/file

git commit --amend --no-edit

git rebase --continue
```

Result:

```text
Before:
A -- B -- C

After:
A -- B' -- C'
```

The missing file is now part of the penultimate commit.
