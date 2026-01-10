---
{
title: "How to run a GitHub Action in local - LIVE DEMO",
published: "2022-12-18T18:26:08Z",
edited: "2023-01-03T15:13:10Z",
tags: ["emptystring"],
description: "GitHub Actions are so cool, you can automate your workflow for free and they’re really easy to set...",
originalLink: "https://leonardomontini.dev/run-github-action-in-local/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "21246",
order: 1
}
---

GitHub Actions are so cool, you can automate your workflow for free and they’re really easy to set up.

However, since the actions run on GitHub, every time you want to change something you need to commit and push to your repository. For example if you’re fixing a failing build for an expected reason, it might take quite a few frustrating cycles of code-commit-push-repeat.

**But: we are programmers, we are lazy, and someone already found a solution for this!**

## Act

Act is a Command Line Interface that lets you run your GitHub Actions locally in your computer, without the need of pushing your commits to GitHub. Actually, you don’t even need commits.

Some key features?

- User friendly, after the setup, all you need to do is running act in your terminal
- Written in GO
- Open Source! Head over the [GitHub repository](https://github.com/nektos/act) if you want to contribute!

## Setup

**Sounds great but, how can I get started? Good question.**

First of all, since act runs with Docker, make sure to have it in your machine. If not, just head over the [Docker website](https://www.docker.com/) and install Docker Desktop for your OS.

Back to act, If you’re using Homebrew for Linux and MacOS, `brew install act` will be enough. If you want to use a different method, the README of the project has a long list of options.

## First act run

Once the installation is done, make sure Docker is running and type `act` in your terminal to give it the first time configuration.

The first operation will be pulling the docker images.

It might seem that it's not doing anything, because it's not showing any output, but it's actually downloading the images. Anyway, running act with the argument `--verbose` will reveal the truth and now… let’s wait.

## Demo

Now that we have everything set up, let me show you some of the main act capabilities in this demo!

The first two minutes of the video are pretty much the article you just read until this point. I suggest you to watch them because you know, I always like to hide some puns and jokes in my videos

In any case, if you're only interested in the live demo, feel free to skip to the minute 2:03. Enjoy!

{% youtube Ugonll0e2Os %}

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel!
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
