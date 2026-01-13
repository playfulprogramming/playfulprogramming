---
{
title: "The Most Upvoted Visual Studio Code Feature",
published: "2023-11-29T20:20:46Z",
tags: ["vscode", "microsoft", "github", "productivity"],
description: "Up until yesterday (technically, a few days ago), tabs were bound to the same vscode window, but...",
originalLink: "https://leonardomontini.dev/multi-window-vscode",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Visual Studio Code",
order: 5
}
---

Up until yesterday (technically, a few days ago), tabs were bound to the same vscode window, but today, things have changed.

What happens if I release a tab outside the window... here’s the magic!

![Floating window](./lbz0divld57x8bvv9zv0.gif)

The thing is, if you’re not amazed by this new feature, well, you should know that this is the most upvoted issue ever on vscode.

You can check by yourself if you don't believe me, just sort the issues by upvotes (👍) and this is the result: https://github.com/microsoft/vscode/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc

## Requirements

If you don't see it working for you, it's probably because you're using the stable version of vscode. As of today the feature is still in preview and only available in the Insiders edition.

I mean, not that this is a problem, you can get it from the official website https://code.visualstudio.com/insiders/

### Insiders?

This version is basically a client that gets updated pretty much once a day including the latest features.

Does that mean that sometimes things are broken? Yeah, it could happen, but in the last couple of years I think it happend just twice to have bugs making it unusable, which anyway got fixed in just a few hours, so nothing really to worry about.

One that I remember was on the Explorer tab, clicking on folders did not open/collapse them, making it pretty much unusable. I was searching files by name from the quick pick menu. Anyway, in probably an hour or two it got fixed and in any case the stable version was still working. Not a big deal.

## Playing with the new feature

On Mac I noticed a little issue when dragging the tab, with that unskippable animation (you can also see in the gif above) and I played a little bit with it, by spawning multiple windows, grouping them and closing one tab vs the full window.

I also noticed that global shortcuts (such as opening the terminal) even if launched on the floating windows are actually sent to the main window, which I think it makes sense.

But features like this are better seen than explained, so as usual I recorded a short demo for my YouTube channel, enjoy:

<iframe src="https://www.youtube.com/watch?v=vUFqWWQIC4s"></iframe>

## Keeping up to date

If you'd like to know more and how the feature is evolving, you can keep an eye on the open issues on the GitHub repo. All issues are tagged with the `workbench-auxwindow` label, so you can filter them out here: https://github.com/microsoft/vscode/labels/workbench-auxwindow

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
