---
{
title: "GitHub Copilot CLI is your new GIT assistant",
published: "2023-05-08T06:58:26Z",
edited: "2024-04-29T16:39:05Z",
tags: ["ai", "github", "programming", "git"],
description: "GitHub Copilot CLI comes with three aliases:    ??: Ask for a generic shell command  git?: Ask for a...",
originalLink: "https://leonardomontini.dev/copilot-x-git-cli/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "GitHub Copilot",
order: 3
}
---

GitHub Copilot CLI comes with three aliases:

- `??`: Ask for a generic shell command
- `git?`: Ask for a `git` command
- `gh?`: Ask for a GitHub CLI command

Today I play with `git?` to test how accurate the suggestions are and how easy it is to get the right command. You can find the video [here](https://youtu.be/3OE2734U-fs), or at the end of the post

*Spoiler*: if you run AI generated commands without understanding what they do, the outcome is... unpredictable 😅

## Unharmful example

At the beginning of the video you'll see me asking a pretty simple question, basically creating a new branch from main.

The suggested code is:

```bash
git switch -c <branch> main
```

I'm happy so I run the command and...

```bash
(eval):1: no such file or directory: branch
```

Wait, what? Ah, I forgot to replace `<branch>` with the actual branch name 🤦‍♂️

This was entirely my fault but luckily nothing bad happened, I revised the query and set the right name.

## Potentially harmful example

However, later in the video I try to move and remove commits and the first suggestion is:

```bash
git reset --hard HEAD~1
```

Imagine running it without understanding what it does... ok sure, with `reflog` you can recover the lost commit but if you're unaware of that you'll probably just panic because of all the changes you just lost. Doesn't seem like a cool situation to be in.

Actually, while writing this article I realized I could have just asked this in the video:

```bash
git? recover the last hard reset commit
```

I did it now and the first suggestion is:

```bash
 ──────────────────── Command ────────────────────

git reflog
git reset --hard HEAD@{1}

 ────────────────── Explanation ──────────────────

○ git reflog lists all commits that are no longer referenced by any branch.
○ git reset resets the current branch to a previous commit.
  ◆ --hard means that we also discard any changes made to the files in the working directory.
  ◆ HEAD@{1} specifies that we reset to the commit one before the current one.
```

If you just didn't remember the syntax, this is great, but if you're not sure what you're doing... imagine being told by an AI that to restore a hard reset you need to do another hard reset. Wouldn't that be scary? Let me know what you think!

## Fun fact

I didn't realize I had Copilot Voice turned on when I started recording the video. At some point I said something like:

> I'm on a branch called copilot-x-test, but is it correct?

And after a second I heard a voice coming out from my speakers:

> It depends on the task. You should make sure that the task is valid and reliable before taking it

Aaaah it was Copilot Voice!

## Full Demo

Anyway, here's the full video where I play with Copilot X CLI, asking for `git` commands and giving you my personal thoughts on the AI generated suggestions.

{% youtube 3OE2734U-fs %}

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
