---
{
title: "⚙ This new GIT push config will save you lot of frustration!",
published: "2022-08-02T17:09:00Z",
edited: "2022-11-22T22:16:56Z",
tags: ["git", "beginners", "github", "tutorial"],
description: "If you have 59 seconds and in particular you're also on mobile, you might enjoy watching the YouTube...",
originalLink: "https://leonardomontini.dev/git-push-auto-setup-remote/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "19914",
order: 1
}
---

If you have 59 seconds and in particular you're also on mobile, you might enjoy watching the YouTube #Shorts video.

[![YouTube Video](./oorxbnl87cb86fw5jr9p.png)](https://youtube.com/shorts/KrgNpJA0sX4)

---

When creating and pushing a new branch, you will get this error:

```sh
fatal: The current branch feature/my-cool-branch has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin feature/my-cool-branch

```

Since version 2.37 git has introduced a new config, called `push.autoSetupRemote` that covers this case.

From the [official documentation](https://git-scm.com/docs/git-config#Documentation/git-config.txt-pushautoSetupRemote):

> If set to "true" assume --set-upstream on default push when no upstream tracking exists for the current branch; this option takes effect with push.default options simple, upstream, and current. It is useful if by default you want new branches to be pushed to the default remote (like the behavior of push.default=current) and you also want the upstream tracking to be set. Workflows most likely to benefit from this option are simple central workflows where all branches are expected to have the same name on the remote.

First of all, make sure you're on version 2.37 or higher by just running

```sh
git --version
```

You can download the latest version from https://git-scm.com/ or via command line, for example with a mac using `homebrew`:

```sh
brew install git
```

Now that you're all set, just run this command:

```sh
git config --global push.autoSetupRemote true
```

It will set in your global git configuration file the value `true` to `push.autoSetupRemote`.

With that set, all first-time push on new branches will automatically set the default upstream.

To see it live, you can have a look at this short YouTube video.
[![YouTube Video](./oorxbnl87cb86fw5jr9p-1.png)](https://youtube.com/shorts/KrgNpJA0sX4)

---

Thanks for reading this post, I hope you find it interesting!
Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
You can also follow me on [Twitter](https://twitter.com/Balastrong) and [YouTube](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA)!
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge\&logo=twitter\&logoColor=white)](https://twitter.com/Balastrong) [![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA)
