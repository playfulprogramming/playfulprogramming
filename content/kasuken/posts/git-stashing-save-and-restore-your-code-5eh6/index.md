---
{
title: "Git stashing: save and restore your code",
published: "2025-03-19T07:56:00Z",
tags: ["git", "github", "devops", "development"],
description: "Have you ever been in the middle of coding when suddenly you needed to switch branches, but your work...",
originalLink: "https://dev.to/this-is-learning/git-stashing-save-and-restore-your-code-5eh6",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Have you ever been in the middle of coding when suddenly you needed to switch branches, but your work wasn't ready for a commit?
I think it happens to me like 200 times a week. 😀
This is where **Git stash** comes in handy. Stashing allows you to temporarily save your work without committing it, letting you switch contexts seamlessly.

---

## What is Git Stashing?

Git stashing temporarily saves your uncommitted changes without adding them to a commit. This is useful when:

- You need to switch branches but don’t want to commit unfinished work.
- You want to test a different feature without losing progress.
- You’re working in a dirty working directory and need a clean state.

A stash includes modified and staged files but doesn’t store untracked or ignored files unless explicitly specified.

---

## Basic Git Stash Commands

### `git stash`
This command stashes your current changes, leaving your working directory clean.

#### **Example**
```sh
# Work on a feature but need to switch branches
$ git stash
Saved working directory and index state WIP on main: abc1234 Add new feature
```

Now your working directory is clean, and you can safely switch branches.

### `git stash list`
Displays a list of all saved stashes.

#### **Example**
```sh
$ git stash list
stash@{0}: WIP on main: abc1234 Add new feature
stash@{1}: WIP on dev: def5678 Refactor component
```
This allows you to see all your stored work-in-progress changes.

### `git stash show`
Shows a summary of what’s inside a stash.

#### **Example**
```sh
$ git stash show stash@{0}
 src/main.js | 5 +++--
```
Use `-p` to see detailed changes:
```sh
$ git stash show -p stash@{0}
```

---

## Working With Multiple Stashes

### `git stash pop`
Applies the most recent stash and removes it from the stash list.

#### **Example**
```sh
$ git stash pop
```
If there are merge conflicts, Git will notify you.

I don't use this command very often to be honest because I am afraid to lose some commits, even if I know that it's safe.

### `git stash apply`
Applies a stash but **keeps it in the stash list**.

#### **Example**
```sh
$ git stash apply stash@{1}
```
Useful when you want to reuse a stash multiple times.

### `git stash drop`
Deletes a specific stash after applying changes.

#### **Example**
```sh
$ git stash drop stash@{1}
```
Removes stash@{1} from the list.

---

## Advanced Git Stash Commands

### `git stash push -m "message"`
Stores a stash with a custom message for better organization.

#### **Example**
```sh
$ git stash push -m "Fixing bug in login form"
```
This makes it easier to find later in `git stash list`.

### `git stash branch`
Creates a new branch from a stash.

#### **Example**
```sh
$ git stash branch feature-branch stash@{0}
```
Useful when you want to resume work from a stash as a separate branch.

### `git stash clear`
Removes all stored stashes.

#### **Example**
```sh
$ git stash clear
```
Use this command carefully because it's irreversible!

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

{% embed https://dev.to/kasuken %}
