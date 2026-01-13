---
{
title: "Restore deleted/lost files with git",
published: "2024-02-06T12:50:28Z",
tags: ["git", "tutorial", "codenewbie"],
description: "Remember that file you deleted last week? Too bad, now you need it. Let's see how git restore can...",
originalLink: "https://leonardomontini.dev/git-restore-deleted-file",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "git better - Improve your git skills",
order: 6
}
---

Remember that file you deleted last week? Too bad, now you need it. Let's see how `git restore` can help you recover it.

There are a few ways to restore deleted files in git, depending on how far away in the history the file was deleted. I'll cover the most common scenarios and how you can find lost files with `git log` for those cases where you don't exactly remember when it happened.

As usual, I recorded a video with a demo of how the command works, but if you're just in for the commands you can find everything below.

<iframe src="https://www.youtube.com/watch?v=TL\_t3aOXumo"></iframe>

### You just deleted it

The easiest scenario, most IDEs will likely have a button somewhere (vscode has the SCM tab) to undo the deletion.

If you feel faster in the terminal, there's a shortcut with `git checkout`:

```bash
git checkout HEAD path/to/file.ts
```

Nice and clean, your file is back. Nothing happened.

### You already committed the deletion

Not too bad, you can use the exact same command as before, with `HEAD~1` to go back one commit:

```bash
git checkout HEAD~1 path/to/file.ts
```

## Time travel with git restore

If the situation is more complex, it's probably time to explore how `git restore` can help you. This command is specifically designed for this kind of operation (while checkout is more general) and comes with a few extra options.

I'd recommend having a look at the [official documentation](https://git-scm.com/docs/git-restore) to understand all the options, but here are a few common scenarios, starting with the basic one:

```bash
git restore --source=<commit> --worktree -- path/to/file.ts
```

### The deleted file is still on main

You deleted the file in your branch, a few commits ago, but you know for sure it's still in `main`. Let's make it easy, you can use `git restore` to bring it back:

```bash
git restore --source=origin/main --worktree -- path/to/file.ts
```

Here I also added `origin/` to make sure it picks the file from the remote, but if you're at the latest version on your local main, then `--source=main` will do its job.

### The file was deleted a long time ago, and you don't know when

This is where `git log` comes in handy. You can use it to find the commit where the file was deleted, and then use `git restore` to bring it back.

```bash
git log --diff-filter=D --summary
```

This command will show you all the commits where files were deleted, and you can use the commit hash to restore the file.

However, if this happened looong time ago there might be way too many commits to look through. Fear not, you can add a filter with the path to the file:

```bash
git log --diff-filter=D --summary -- path/to/file.ts
```

This will only show the commits where that specific file was deleted. You can now grab the commit hash and use it with `git restore`:

```bash
git restore --source=<commit>~1 --worktree -- path/to/file.ts
```

Don't forget to add `~1` to the commit hash. The reason is as follow, that hash is the commit where the file has been deleted, which means it's no longer there. With `~1` you're simply going back one commit, the one before the deletion, where the file is still there.

## Undo a commit

In some other cases you might simply want to undo a commit. I got you covered! Check out [this video](https://youtu.be/ukx24CtWhms) where I explore some of the possibilities!

To be fair I undo commits quite often to the point I made a [git alias](https://youtu.be/Uk4GnYoQx_I) for it that I called `git back` (it runs `git reset HEAD~1 --soft`).

I hope you found this article useful and now let me ask you, how do you usually go recover deleted files in git? Let me know in the comments below, I'd love to hear about your workflow!

---

Thanks for reading this article, I hope you found it interesting!

I recently launched a GitHub Community! We create Open Source projects with the goal of learning Web Development together!

Join us: https://github.com/DevLeonardoCommunity

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
