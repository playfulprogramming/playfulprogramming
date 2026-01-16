---
{
title: "⏪ 4 Ways to Undo a Git Commit - Amend vs Reset",
published: "2023-01-12T13:21:45Z",
edited: "2023-01-12T13:22:58Z",
tags: ["motivation", "productivity"],
description: "I'm quite sure all of these happened to you at least once:   You committed a change with the wrong...",
originalLink: "https://leonardomontini.dev/git-undo-amend-reset/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "git better - Improve your git skills",
order: 2
}
---

I'm quite sure all of these happened to you at least once:

- You committed a change with the wrong message (typo, wrong tense, etc.)
- You committed a change with the wrong files (something missing, too many files, etc.)
- You committed a change too early (feature isn't complete yet)
- You committed a change you didn't want to (wrong code, just needs to be deleted)

Sure, you can just add a new commit, but in the long run this will mess up your git history (unless you're closing PRs with [squash](https://youtu.be/rFRtsiQEJZw)).

If you want to keep your history clean and make your mistake disappear, let me show you 4 different ways to undo a commit. They're similar but not exactly the same, so you can apply the best one for your situation.

**Bonus content**: I'll also show you how to restore hard deleted changes. What does that mean? I'll get into that later.

---

As usual, there's a live demo waiting for you on my YouTube channel where I show you all the content of this article plus some extra words and scenarios. If you're just here for the commands, you can skip the video and go straight to the article.

<iframe src="https://www.youtube.com/watch?v=ukx24CtWhms"></iframe>

## Table of Contents

- [1. Amend no-edit](#1-amend-no-edit)
- [2. Amend & Change Message](#2-amend--change-message)
- [3. Reset (soft)](#3-reset-soft)
- [4. Reset (hard)](#4-reset-hard)
- [Bonus: Restore Hard Deleted Changes](#bonus-restore-hard-deleted-changes)

## 1. Amend no-edit

Let's start with the easiest situation, you already did a commit but you forgot to add some files.

Instead of creating an extra commit on top, you can run `git commit --amend --no-edit`. As a result, the last commit will be updated with the new files.

```bash
git add .
git commit --amend --no-edit
```

No extra actions required, you're done!

## 2. Amend & Change Message

Similar situation to the previous one, but you also want to change the commit message.

```bash
git add .
git commit --amend
```

This will open your default editor and you can change the commit message. Once you're done, save and close the editor. The commit will be updated with the new message.

Actually, `git add .` is not required if all you wanted to do is to change the commit message. You can just run `git commit --amend`.

## 3. Reset (soft)

This is the case where you want to undo a commit, but you want to keep the changes so that you can make a new commit at a later time.

`git reset` is kind of a time travel, really powerful but also dangerous. The most common use case is probably to undo a commit but keep in mind that you can do much more.

The full command we need is `git reset --soft HEAD~1`.

- `--soft` means that the changes will be kept.
- `HEAD` means the current commit you're on.
- `HEAD~1` means the last commit, but you can also use `HEAD~2` to undo the last 2 commits.
- A shortcut for `HEAD` is `@`, so `@~1` would be the same as `HEAD~1`.

After running this command, you'll see that the last commit is gone but the files still have your changes applied.

You can now keep working and whenever you're ready you can do a new commit.

## 4. Reset (hard)

This is the case where you want to undo a commit and you don't want to keep the changes.

If you want to delete the changes, you need to add the `--hard` flag while running `git reset`.

**Warning**: this will also delete any uncommitted changes you have.

The full command we need this time is `git reset --hard HEAD~1` and it will delete the last commit and the changes. Forever. Or is it?

## Bonus: Restore Hard Deleted Changes

If you run `git reset --hard HEAD~1` and you're not happy with the result, you can still restore the changes.

As we've just seen, `git reset` is our time travel machine, but we need to tell it *where* to go. In this case we entirely removed a commit and there's no trace in the git history, so we cannot say `HEAD~number` anymore.

Luckily, git keeps a log of all the commits that have been removed. You can see this log by running `git reflog`.

You want to look at a log like this one:

```bash
1b2c3d4 HEAD@{0}: reset: moving to HEAD~1
```

This means that you were at commit 1b2c3d4 and you did a reset to the previous commit. You can now use this commit ID to restore the changes.

```bash
git reset --hard 1b2c3d4
```

What are we doing here? We're telling git to go back to the commit 1b2c3d4 and to get rid of all the changes we did (in this case, the change was deleting the commit). Undoing a delete operation actually means restoring the deleted commit.

## Conclusion

I hope you found this article useful and learned something new. If you have any questions or suggestions, feel free to leave a comment below.

I know there are at least a dozen different ways of moving around in git. I selected these 4 for simplicity but if you want to expand and add more in the comment section, let's do it!

Let me recommend once more to also watch the live demo and leave a like in this article (and to the video) to support my work. Thanks!

<iframe src="https://www.youtube.com/watch?v=ukx24CtWhms"></iframe>

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
