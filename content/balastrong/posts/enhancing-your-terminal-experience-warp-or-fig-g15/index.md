---
{
title: "Enhancing your terminal experience: Warp or Fig?",
published: "2023-05-31T07:34:31Z",
tags: ["terminal", "ai", "productivity"],
description: "After using Warp for over a couple of months (and collecting feedback from colleagues already using...",
originalLink: "https://leonardomontini.dev/warp-terminal-vs-fig/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "21771",
order: 1
}
---


After using [Warp](https://www.warp.dev/) for over a couple of months (and collecting feedback from colleagues already using it), the time has come. Is it better than [Fig](https://fig.io/)?

What you will find here is a quite long article where I try to compare the two tools. If you don't know what Warp or Fig are, this will be a nice introduction. If you already know the tools and can't decide which one to use, I hope this will help you make a decision.

Some of the features are better shown than told, that's why you can find here a video where I go through all the topics I cover in this article. I'd recommend you give it a watch, but if you prefer reading, keep scrolling.

{% youtube GHKy8cTg1kA %}

---

What you're going to find in this article:

- [Key differences](#key-differences)
- [Pricing](#pricing)
- [Artificial Intelligence](#artificial-intelligence)
- [Features](#features)
  - [Available on both](#available-on-both)
      - [Autocomplete](#autocomplete)
      - [AI](#ai)
      - [Themes](#themes)
  - [Fig Only](#fig-only)
      - [Custom scripts](#custom-scripts)
      - [Full IDEs integration](#full-ides-integration)
      - [Dotfiles](#dotfiles)
  - [Warp Only](#warp-only)
      - [Command Palette](#command-palette)
      - [Blocks](#blocks)
      - [Multi tabs](#multi-tabs)
      - [User-friendly Input](#user-friendly-input)
- [Technologies](#technologies)
- [Open Source](#open-source)
  - [Warp](#warp)
  - [Fig](#fig)
- [Documentation](#documentation)
- [Community](#community)
- [Conclusion](#conclusion)

Seems promising, right? Let's get started!

## Key differences

First of all, let's make it clear, they're not the same thing. Let me highlight the main differences:

**Warp is a terminal**: to make it simple, an app that lives on its own. You can install it as you would do with a regular app (because that's what it is), click on the icon and it will show up on your screen.
**Fig is a plugin** that lives on top of supported terminals, IDEs, and shells. It does not live on its own but rather as an extension of another tool.

What are the pros and cons of each approach? To name a few:

- Onboarding on Fig might be easier as the tool enhances a terminal you're already familiar with, while Warp is an entire new terminal. However, it shouldn't take long to get used to it. Actually, it has quite some handy customizations.
- Being a proper app, Warp has more control on the UI and how the user interacts with it, for example, you can natively write multiline scripts and use the mouse to move the cursor around, something that wouldn't be possible on Fig as it relies on the terminal where is it running.
- Fig's flexibility from working on top of a terminal might make it easier to distribute on multiple platforms, however, both Fig and Warp are still only available on MacOS. Fig has a waitlist for Windows and Linux and the same for Warp, but the latter also mentions the plan to support WASM with the goal of running on the browser to enable collaborative features.
- Fig's settings clearly aren't managed through the terminal, even if we said it's a plugin. You need an app installed on your computer, while Warp's settings are already handled in the Warp window itself.

## Pricing

Both Warp and Fig are free to use, and already ship a lot of interesting features for individuals. However, when it comes to more team-oriented features, some of them require a paid plan.

They both have three levels of pricing (Free/Individual, Team and Enterprise), with the main differences being:

Warp ([pricing page](https://www.warp.dev/pricing))

- Free version includes AI
- Pricing for Team and Enterprise is not available yet, you can get in touch with them to get a quote
- No free trial for Team and Enterprise, but as an individual you probably won't even need it

Fig ([pricing page](https://fig.io/pricing))

- AI is only for paid plans
- Team is $12 per user per month, Enterprise requires contacting them
- Team has a 14 day free trial

## Artificial Intelligence

Let's address the elephant in the room, right after pricing the hottest topic in 2023 can only be AI. Let's see how Warp and Fig compare in this area now, so that we can forget about AI for the rest of the post, I promise!

As mentioned above, Warp includes AI in the free version, while Fig requires a paid plan.

Activating the AI works exactly the same on both tools, just start a sentence in natural language with `#` and it will be sent to the AI engine to be converted into a command.

---

Here is how it would look like on Warp:

![Warp AI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rah5ibt2c7qzb8jwdxrj.png)

Leveraging the fact that Warp is a standalone app, there's more flexibility in how the UI is handled. Here you can input the command with Cmd+Enter but you can also click on buttons to get an explanation, see examples or related commands, directly in the UI.

Asking for an explanation will the Warp AI side panel. Here you can get a more powerful interaction with the AI, for example you can ask for an explanation of the command or even get more insights when a command you launched resulted in an error.

![Warp AI Panel](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7647fd2oo5d5nlowu7ni.png)

It's worth noting that despite the command generation being free and having no limits, the more powerful AI side panel is limited to 100 requests per day on the free plan.

---

And here is how it would look like in Fig:

![Fig AI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ln4l9h6tamxbahuetwm6.png)

The generated command is exactly the same, but the UI is more terminal-like (really similar to Copilot CLI) and you can select the next action with the arrows.

The options give you good control over the answer as you can either edit or regenerate if you're not satisfied, but there's no quick way to get more information about the command and as I usually write in my articles about AI these days, running an AI-generated script without understanding what it does is usually not a good idea. If all you needed was just the syntax, then you're good to go.

## Features

The two tools come with a wide range of smart features, some of them are pretty much overlapping to both, and some are unique to each one. Let's go through them.

### Available on both

#### Autocomplete

Personally, this is the key feature I consider a must-have for any terminal app/tool/whatever. I can't imagine going back to a terminal without autocomplete at this point.

Both tools we're looking at today have this feature (otherwise I wouldn't be writing about them), and they both work pretty well. Something I really like is that they aren't limited to "simple" suggestions such as the next folder while navigating the file system with `cd`, but they also provide suggestions for `git` aliases, to name one.

Both tools are able to read my aliases, suggest them and also show in a tooltip what command the alias is for. Warp suggests alias expansions as well, they posted a demo in a [tweet](https://twitter.com/warpdotdev/status/1641107953406074882) recently.

A little difference I noticed is that Warp does not only show the suggestions in a dropdown menu, but also tries to guess what your next command might be and shows it already in the input field, so you can decide if navigate through the suggested continuations in the dropdown or already accept the guess.

Let me add an example here, you can either select a git command (with a letter `c` in it, as that's what I already written) and continue by yourself, or directly click the right arrow to accept `git cb develop` in one go.

![Warp Autocomplete](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p6ykd36qxang1h1f6yqa.png)

Speaking of the interaction, both tools allow you to customize it, whether you want to use the arrows, tab, enter or whatever you like the most to navigate and select the suggestions.

#### AI

I promised I wouldn't talk about AI anymore, but since this is a list of features available on both tools, let me mention it again.

Ok, end of this chapter :)

#### Themes

If you don't like the default theme, both tools support custom ones!

On Warp you can create your own or choose one from the community. There's a [public repo on GitHub](https://github.com/warpdotdev/themes) about that!

You can quickly select a different theme with `^ + Cmd + T` or if you don't remember the shortcut, you can always use the command palette and type "theme". A sidebar will open on the left and you can select the theme you want to use.

![Warp Themes](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pr0ytv4fofa0i5d5f1td.png)

Pretty much the same happens on Fig, you can find the themes on the settings and there's also a [public repo on GitHub](https://github.com/withfig/themes).

![Fig Themes](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bnialedrscu6z9d37sjs.png)

### Fig Only

#### Custom scripts

Through the Fig settings app you can define some custom scripts. You can see them as aliases with some extra features around them, such as adding a description and being able to share them.

There's also a Scripts Store where public scripts can be distributed and installed.

![Fig Script Store](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ptxv9j4euc8jkepq462v.png)

To run one of those scripts you can start with `fig run` and the autocomplete dropdown will show you the available ones.

#### Full IDEs integration

One of the advantages of being a plugin instead of a standalone app is that you can more easily integrate with other tools. Fig currently works with VS Code, Android Studio and the JetBrains IDEs.

#### Dotfiles

Aliases, variables, paths... all the annoying settings you have to manually set up in some hidden files can be managed through the Fig settings app in a visual way.

With the free plan, you can manage your personal dotfiles, while with the paid plans you can also manage and share the configs with your team.

### Warp Only

The advantages of being a standalone app are clear when it comes to the UI and UX, Warp has more control over how the user interacts with it and it can leverage that to provide a much better experience.

#### Command Palette

Command Palettes are a common tool available in many scopes, from MacOS, to GitHub, Visual Studio code... and also Warp.

With `Cmd + P` you can open the command palette and search for any command you want to run. As you might expect, you can start typing to narrow down the results and you can use the arrows to navigate through them.

#### Blocks

This is the feature I didn't know I needed until I tried it. Blocks are a way to group commands and outputs into a single entity, making it easy to scroll on long logs with clearly defined input and output.

On this session I ran three commands: `pnpm install` first, which has a long log, then a `git status` and one of my aliases to print commits. There are three blocks on the screen and even if the first has a reeally long log, I can still see on top which command I executed in case I want to debug it. Right below, a new block with the `git status` output which fits entirely into the terminal and last, one more long log with my git alias. I scrolled up a little bit so that I can see all of them at once, with the commands on top of each block.

![Warp Blocks](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d77k3z49bjfzgrzpxz4n.png)

Blocks and also be shared with permalinks (even in the free plan) so that instead of having to scroll through a long output to show someone a specific part, you can just send them the link to the entire block and they can see it in their browser.

Here's an example of a shared block, where you can see the command on top and the output properly highlighted: https://app.warp.dev/block/o2Z0EGHZoDT834ohnO5KZm

You can also run some actions specifically on blocks, such as finding a specific text, copying the input or output and asking AI for assistance based on the block's content.

#### Multi tabs

To be fair, having multiple tabs is the responsibility of the terminal, clearly, fig cannot do that. If you want more tabs, you need to use fig on top of a terminal that already supports tabs... to name one: Warp.

#### User-friendly Input

One thing that really "grinds my gears" is moving my cursor in the input text and having to select/cut/paste parts of it.

![Grind my gears](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uzn2bvwh5frl45ln5xgr.png)

I think I'm not the only one though, as Warp thought about that. The input box where you type your command is a proper input field, you can use the mouse to click anywhere you want in your input, and all your expected text-editor keyboard shortcuts should work as well (for example, Option + left to move to the previous word).

Bonus points, you can use multi-cursors!

## Technologies

Warp has a lot of stuff to handle so the team decided to build it in Rust, which rhymes to "blazingly fast". Jokes aside, it's cool to see how Rust is becoming more popular and it's being used to deliver cool and fast tools.

Fig is built in Typescript making it easy to have the dashboard also available as a web app in your browser.

## Open Source

Both projects have an eye on the open source community, even if the core code isn't available, with almost a dozen of public repos on GitHub each.

### Warp

_Organization page - [warpdotdev](https://github.com/warpdotdev)_

Right after the main repo with about 13k stars, you can find the [themes](https://github.com/warpdotdev/themes) repository. This is where Warp official themes are and indeed you can jump in and contribute. The programming language used here is Python.

Feeling inspired? You can 100% customize your own theme with this tool created by a community member: [Warp Themes](https://warp-themes.com/). You can generate it with all the color pickers, see the live preview and then download a file you can then import in Warp.

The [workflows](https://github.com/warpdotdev/workflows) repo is also interesting, using Rust this time, holding a collection of all public workflows you can access from Warp (Command palette, or `^ + Shift + R`) and also from [commands.dev](https://www.commands.dev/).

### Fig

_Fig organization page - [withfig](https://github.com/withfig)_

Fig's coolest repo is for sure the [autocomplete](https://github.com/withfig/autocomplete) with almost 22k stars. This is where all the autocomplete content comes from and if a command is missing or outdated, you're more than welcome in opening a Pull Request.

Similarly to Warp's workflows repo, on the [plugins](https://github.com/withfig/plugins) repository, you can find the content of Fig's plugin store. Do you have a cool plugin to share with the community? Open a PR!

## Documentation

[Warp docs](https://docs.warp.dev/) - [Fig docs](https://fig.io/user-manual)

Both tools come with good documentation, with a lot of screenshots, examples, and gifs. I noticed on Warp there are also some videos, which is a nice touch.

Installation instructions are clear and all core features are properly documented.

Changelogs are also available, which is always a good sign of a healthy project:

- [Warp changelog](https://docs.warp.dev/getting-started/changelog)
- [Fig changelog](https://fig.io/changelog)

## Community

One of the keys to success for a project is the community around it. Let's take a look at some numbers:

| Metric              | Warp | Fig  |
| ------------------- | ---- | ---- |
| GitHub followers    | 918  | 477  |
| Twitter followers   | 14k  | 16k  |
| Discord members     | 10k  | 1k   |
| dev.to user posts   | ~60  | ~50  |
| YouTube subscribers | 2k   | 24   |
| TikTok followers    | 6.5k | 4.3k |

By looking at the stats, Fig has slightly more followers on twitter while all other socials see Warp in the lead. The biggest difference is in the Discord community with warp being 10x more and on YouTube where warp shares some cool educational content (like [5 Command Line Tools That Boost Developer Productivity (2023)](https://www.youtube.com/watch?v=6ivti-DfZng) and [Terminal Basics That Nobody Teaches You In School](https://www.youtube.com/watch?v=zhzhTvaFOiw), cool titles :D) while fig doesn't seem to be using YouTube at all. They're both quite active on TikTok though!

No metrics here, but both tools have their own blog ([Warp](https://www.warp.dev/blog) - [Fig](https://fig.io/blog)) where they talk about their product, challenges faced in building it, and other interesting topics.

Warp also has some swags like t-shirts, hoodies and even a jacket ([tweet with the details](https://twitter.com/warpdotdev/status/1656328242507415552)).

## Conclusion

Now that we're in the closing chapter, let's get back to the initial statement: we're looking at two _different_ tools.

Warp is bringing a whole new experience in interacting with a terminal thanks to features like blocks, command palette and the proper input field. However, this comes with the requirement of moving to a new terminal. Is this a problem? Probably not, it depends on your habits.

On the other side, Fig aims to provide a set of new features, even if less than Warp, but already in your favourite terminal.

From my point of view this is probably one the biggest criteria to consider when choosing between the two: do you need to keep using your terminal with some improvements or are you willing to switch to a new one in order to access all the extra features?

It's hard to say what is right or wrong as both tools are great... the answer is 100% up to you.

And with that said, thank you for reading until this point! I hope this article gave you a good overview of the two tools and helped you in making a decision.

Warp: https://www.warp.dev/
Fig: https://fig.io/

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}