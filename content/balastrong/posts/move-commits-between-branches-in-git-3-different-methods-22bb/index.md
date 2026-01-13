---
{
title: "Move Commits Between Branches in Git - 3 Different Methods 🍒",
published: "2023-02-13T07:58:08Z",
edited: "2023-02-13T11:20:01Z",
tags: ["git", "tutorial", "beginners", "codenewbie"],
description: "Why do you need to move commits between branches? Let's imagine this scenario:  You're so happy, the...",
originalLink: "https://leonardomontini.dev/git-move-commits-between-branches/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "git better - Improve your git skills",
order: 4
}
---

Why do you need to move commits between branches? Let's imagine this scenario:

You're so happy, the first building block of that new feature is ready and it's a great time to commit. You open the terminal and type:

```bash
git add .
git commit -m "feat: first commit"
```

But then you realise that you're not on the right branch. You're on `main` and you should be on `feature/new-cool-stuff`. You can't just switch branch because you already committed something, besides `main` has some policies and you can't even push now.

What can you do?

Fear not, there are many ways to move commits between branches and I'll show you 3 of them. Anyway, I'm quite sure you can do pretty much the same in a dozen other ways so feel free to add yours in the comments!

If you want to see some live action and a step by step procedure, you can watch the video! Otherwise feel free to keep reading :)

<iframe src="https://www.youtube.com/watch?v=0pzFGXvemvA"></iframe>

## 1. Move to a new branch

This is the easiest scenario and is exactly what is described above. You did a commit on `main` but you actually wanted to move to a new branch.

Think about it, when you create a new branch you basically start from the current situation of the branch you're on. So, if you're on `main` and you create a new branch, you'll start from the current state of `main` (which is the commit you just did).

This means that step #1 is:

```bash
git branch feature/new-cool-stuff
```

**Note**: I intentionally did not use `git checkout -b feature/new-cool-stuff` because that command also moves you to the new branch. We want to stay on `main` for now.

At the current state, you have both `main` and `feature/new-cool-stuff` pointing to the same commit and you're still positioned on `main`.

You can do a quick check with:

```bash
git log --oneline
```

Step #2 is as easy as an hard reset to the previous commit:

```bash
git reset HEAD~1
```

What happend here? You removed from `main` the commit you just did, but you didn't lose it. It's still there but on new branch.

## 2. Move to an existing branch (stash)

Let's shift the focus a little bit, you can be on any branch and you want to move the last commit to another branch. You can do it by stashing the commit and then popping it on the other branch. Let me explain.

If you have uncommitted changes you can still switch from a branch to another, but not always. If your changes are conflicting with the new branch you're trying to switch to, you'll get an error. This is where stashing comes in handy.

But we were talking about a commit in the wrong branch and you cannot stash a commit (or can you? Not that I know).

The plan here is to get rid of the commit, put the changes somewhere (stash) and then reapply the changes in the right branch so you can commit again. Let's see how.

First of all, you need to get rid of the commit. You can do it with a soft reset:

```bash
git reset --soft HEAD~1
```

Since we used `--soft` the changes are still there, they're just not committed. Now you can stash them:

```bash
git stash
```

As you can see now, all your changes have disappeared. Fear not, if you run `git stash list` you'll see that they're still there.

It's now time to switch to the right branch:

```bash
git checkout feature/new-cool-stuff
```

And finally, you can reapply your changes with:

```bash
git stash pop
```

Why `pop`? Because the stash is actually a stack. With the first `git stash` you added a new element on top of the stack. With `git stash pop` you basically remove the top element from the stack and apply it.

At this point you might have some conflicts (that's why we used stash instead of just doing checkout with the uncommitted changes) but it's not a problem if you watched my video on [how to resolve merge conflicts](https://youtu.be/lz5OuKzvadQ).

## 3. Move to an existing branch (cherry-pick)

A similar way to move commits between branches is to use `git cherry-pick`. In this case the plan is not to remove the commit than commit it back, but to just move it to the other branch (and then you can cleanup the old branch).

What `cherry-pick` does is basically copy a commit from one branch to another (by generating a new commit, with the same changes). Let's see how we can use it in our scenario.

First of all, you need to get the commit hash of the commit you want to move. You can do it with:

```bash
git log --oneline
```

If you follow me you know I usually go with [git aliases](https://youtu.be/Uk4GnYoQx_I) so in the video you'll see me using `git lgo` instead of `git log --oneline`.

Now that you have the hash, you can `checkout` to the target branch where you want to move the commit, and then you can `cherry-pick` it:

```bash
git checkout feature/new-cool-stuff
git cherry-pick <commit-hash>
```

That's it! As usual if you have conflicts you can solve them with vscode. Similarly to a regular merge, once you fixed all conflicts you can use `git add .` and `git cherry-pick --continue` to finish the cherry-pick. If you want to abort the cherry-pick you can use `git cherry-pick --abort` and the situation will be the same as before you started.

Now that the new branch has our commit, we can go back to the old branch and remove it:

```bash
git checkout main
git reset HEAD~1
```

Nice and clean, you moved the commit from `main` to `feature/new-cool-stuff` and you removed it from `main`.

## Conclusion

I hope you enjoyed this post and that you learned something new. If you did, please share it with your friends and colleagues!

What about you, do you have any other way to move commits between branches? I mean, as mentioned at the beginning I'm sure there are, I'm just curious on which one works best for you. Let me know in the comments, I'd love to learn new methods!

---

See it in action!

<iframe src="https://www.youtube.com/watch?v=0pzFGXvemvA"></iframe>

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
