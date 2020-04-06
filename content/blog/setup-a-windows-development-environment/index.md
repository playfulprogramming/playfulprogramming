---
{
	title: "Setup a Development Environment in Windows",
	description: "Many developers like MacOS or Linux for development environments, but don't know that Windows has plenty to offer. Let's explore that!",
	published: '2020-04-06T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['tooling', 'windows'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Ask any developer running off of a Linux or macOS machine, and they'll be able to tell you what about their systems make them such a strong contender for development usage. Some of the top contenders I've heard are:

- [Package management](#package-management)
- [Terminal usage](#terminal-usage)
- Window Tiling
- Customization

What many don't know is that Windows has gained many of these options over the years. Between official tooling such as WSL2 right around the corner to third-party offerings becoming more-and-more mature, there's never been a better time to be a developer on the Windows platform.

Moreover, much of what we'll be taking a look at today is either free, open-source, or both! There will be a few mentions of paid software as alternatives to free options, but I've personally used every paid software that I'll be mentioning.

> I understand that for some, Windows simply isn't their cup of tea. Additionally, I acknowledge that other platforms may do things *_better_* than Windows can. However, Windows is undisputedly a cheaper option than MacOS and often required for application usage where WINE and others fall flat. Just keep an open mind and understand that this isn't a put-down of other options.

# Package Management {#package-management}

When it comes to CLI package management on Windows, nothing beats [Chocolatey](https://chocolatey.org/). [It only takes a single PowerShell command to install](https://chocolatey.org/install), not unlike [Homebrew for macOS](https://brew.sh/). The comparisons with Homebrew don't stop there, either; Much like it, Chocolatey is an unofficial repository of software but does include checks of verification for a select number of popular packages.

It's also popular amongst sysadmins due to its ease of deployment across multiple devices and stability.

You'll need to run in an administrator window, but once you do, you'll find the utility straightforward. A simple `choco search package-name` will find related packages to the name you input where areas `choco install package-name` will install the package.

## Manage Packages via GUI {#chocolatey-gui}

Readers, I won't lie to you. I'm not the kind of person to use CLIs for everything. I see their worth entirely, but it's simply not my strong suit remembering various commands even if I understand the core concepts entirely. For people like me, you might be glad to hear that _Chocolatey has a GUI for installing, uninstalling, updating, and searching packages_. It's as simple as (Chocolate) pie!

![A list of installed software via the Chocolatey GUI](./choco_gui_list.png)

You can see that it gives a list of installed packages with a simple at-glance view of what packages need updating.

![A search result of the Chocolatey GUI](./choco_gui_search.png)

## Suggested Packages {#suggested-packages}

While Chocolatey has a myriad of useful packages to developers, there are some packages that I have installed on my local machine that I'd like to highlight.

For starters, what's a developer machine without `git`? Let's throw that on:

```
choco install git.install
```

Additionally, I know a lot of developers would like to have access to common GNU utilities, such as `rm` and `touch`. Using an install flag, you're able to add those to your path for usage:

```
choco install git.install--params "/GitAndUnixToolsOnPath"
```

### CLI Utilities {#cli-packages}

| Package Name | Explanation                                                  |
| ------------ | ------------------------------------------------------------ |
| `micro`      | A great terminal editor (ala Nano). It even supports using mouse usage! |
| `bat`        | A great alternative to `cat` with line numbers and syntax highlighting |
| `gh`         | GitHub's official CLI for managing issues, PRs, and more     |
| `nvm`        | "Node version manager" - Enables users to have multiple installs of different Node versions and dynamically switch between them |
| `yarn`       | An alternative to `npm` with better monorepo support. If installed through `choco`, it will support `nvm` switching seamlessly. |

You're able to install all of these packages using `choco install micro bat gh nvm yarn`.

## IDEs {#ides}

| Package Name                                                 | Explanation                                                |
| ------------------------------------------------------------ | ---------------------------------------------------------- |
| `vscode`                                                     | Popular Microsoft IDE for many languages                   |
| `sublimetext3`                                               | Popular text editor with syntax support for many languages |
| `visualstudio2019professional` / `visualstudio2019community` | Microsoft's flagship IDE                                   |

You're able to install all of these packages using:

```
choco install vscode sublimetext3 visualstudio2019community
```

## Others {#utilities}

| Package Name                               | Explanation                                                  |
| ------------------------------------------ | ------------------------------------------------------------ |
| `powertoys`                                | Built by MS itself, provides SVG/Markdown previews, provides utility for mass renaming, image resizing all from the file explorer itself. It also allows you to configure tiling and more. We'll talk about this more later |
| `virtualbox`                               | A program that allows you to create, run, and edit virtual machines |
| `virtualbox-guest-additions-guest.install` | The extension to `virtualbox` that provides better USB passthrough support |
| `firacode`                                 | A popular programming font that supports ligatures           |
| `scrcpy`                                   | A utility that allows you to mirror your Android phone screen via ADB |
| `typora`                                   | A markdown editor with a "preview edit" mode allowing you to edit markdown files similarly to Word |
| `postman`                                  | A REST API tester                                            |
| `Firefox`                                  | The popular web browser by Mozilla                           |
| `licecap`                                  | A quick-and-easy GIF capture software                        |
| `7zip`                                     | Compressed file format manager. Allows you to extract files from various formats |
| `jdk` / `jre`                              | Java runtime and development kit                             |

You're able to install all of these packages using:

```
choco install powertoys virtualbox virtualbox-guest-additions-guest.install firacode scrcpy typora postman Firefox licecap 7zip jdk jre
```

## Windows Store {#windows-store}

I'm sure some avid Microsoft fans will have pointed out by now that I forgot something. You know, the official solution by Microsoft? Naturally, I haven't forgotten about the Windows Store.

While some of you may be surprised to hear this, the Microsoft Store has gained a fair number of development tools on its storefront. For example, there's now a package for Python that's now there. You're also able to get quick updates for all of your apps and seamlessly integrate them as-if they were typical windows apps.

![A preview of the "Downloads and updates" tab in the Windows Store](./windows_store_update.png)

# Terminal Usage {#terminal-usage}

Terminal usage is essential for most developers. It's a relatively universal utility regardless of what form of programming you're into. It's important to make sure that your terminal is fully featured for functionality and customizable for tastes and fun.



## Terminal Options {#terminals}

One of the most important elements to one's terminal usage is, well, the terminal itself! While Windows has not historically had many options in this regard, things have turned around in recent years. Additional to the built-in CMD and PowerShell windows, we now have many newcomers, including one from Microsoft itself.

First, let's start with the unofficial offerings. We have many options, but the two I want to highlight is `Cmder` and `Terminus`.

### Cmder {#cmder}

[Cmder is an open-source terminal offering](https://github.com/cmderdev/cmder) built on top of a long-standing base called [ConEmu](https://conemu.github.io/). It provides a massive set of configurations that I think make the terminal much more useful and pretty. For example, this is the default view of Cmder:

![A preview of the cmder terminal open on the UU repo](./cmder.png)

As you can see, there's some custom logic for embedding Git metadata in the prompt, a custom `λ` prompt, and even contains some logic for more effective tab autocomplete. The terminal itself contains all kinds of functionality:

- Multi-line copy+paste
- Tiling
- Tabs

Those are just the features at the top of my head! What's nice about Cmder is that even if you don't use the terminal itself, you can use the configurations for CMD and PowerShell with other shells if you'd like. All of the screenshots for the other terminals will be shown using the Cmder configs.