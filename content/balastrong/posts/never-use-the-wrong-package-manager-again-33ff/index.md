---
{
title: "Never Use the WRONG Package Manager Again!",
published: "2023-04-11T09:09:37Z",
tags: ["webdev", "node", "codenewbie", "opensource"],
description: "npm or yarn, what does this project use? Or maybe it's pnpm? Or Bun? Well, let's just use ni!  Is...",
originalLink: "https://leonardomontini.dev/npm-yarn-ni-package-manager/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "21771",
order: 1
}
---

`npm` or `yarn`, what does this project use? Or maybe it's pnpm? Or Bun? Well, let's just use [`ni`](https://github.com/antfu/ni)!

Is this a new package manager? No, no, don't worry ^^'

`ni` is a simple tool that will try to identify which package manager is in use in the current project, and then run the corresponding command.

## How does it work?

From the docs:

> ni assumes that you work with lockfiles (and you should)
>
> Before it runs, it will detect your yarn.lock / pnpm-lock.yaml / package-lock.json / bun.lockb to know current package manager (or packageManager field in your packages.json if specified), and runs the [corresponding commands](https://github.com/antfu/ni/blob/main/src/agents.ts).

In case you were wondering if that weird `package-lock.json` file that appears to change unexpectedly on `npm install` is needed or not, it indeed is!

## Demo

I recorded a short demo to show how cool this tool is, you can watch it here:

{% youtube NiTmtiBgJKI %}

## Installation

Assuming you already have at least npm globally installed:

```bash
npm i -g @antfu/ni
```

## Usage

You just opened a new project and you're ready to install the dependencies. Just type `ni` and you're good to go! In the [video demo](https://youtu.be/NiTmtiBgJKI) I show it in a real use case.

### Supported commands

Here's a description of all currently supported commands. In case something changes and this gets outdated, you can always check the full list on the project's [README](https://github.com/antfu/ni).

#### `ni` - Install dependencies

*Same as `npm install`.*

You can run it with no arguments to get the full dependencies, or with a package name to install it.

```bash
ni
ni react
```

You can also set the `-D` flag to install as a dev dependency.

```bash
ni -D prettier
```

#### `nr` - Run scripts

*Same as `npm run`.*

You can run commands in your package.json scripts.

```bash
nr start
nr build
```

### `nlx` - Download and execute a package

*Same as `npx`.*

```bash
nlx gitignore node
```

Fun fact, it was originally called `nx` but then it was renamed to `nix`... and then again to `nlx`, to avoid confusion with other existing tools.

#### `nu` - Upgrade dependencies

*Same as `npm upgrade`.*

Upgrades all your packages to the latest version.

```bash
nu
```

#### `nun` - Uninstall dependencies

*Same as `npm uninstall`.*

```bash
nun husky
```

This will remove your package from `package.json` and uninstall it from `node_modules`.

#### `nci` - Clean install dependencies

*Same as `npm ci`.*

This will remove your `node_modules` folder and install all your dependencies again.

```bash
nci
```

#### `na` - Alias for the current manager

*Same as `npm`... when you don't know you're using npm!*

```bash
na run test
```

It will use the correct package manager to forward the command.

## Conclusion

As an Open Source contributor it happens quite often to switch between projects that use different package managers. This tool is a great way to avoid having to remember which one is used where.

Even if most of the time npm is the right one, just typing ni or nr is faster anyway.

I hope you'll find this useful too!

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
