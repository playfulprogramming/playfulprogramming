---
{
    title: "WebDev 101: How to use npm and Yarn",
    description: "",
    published: '2021-10-13T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev', 'javascript', 'node'],
    attached: [],
    license: 'cc-by-4'
}
---

If you're new to web development, it can be difficult to figure out when (and how) to use the package manager most commonly used to install app dependencies and utilities: `npm`. Likewise, if you've looked into projects that are already established, you may find yourself looking at instructions to use `yarn`.

In this article, we'll outline what Node and npm are, how to use both `npm` and `yarn` to install dependencies for your project, and point out some "gotcha's" that are good to keep in mind while using them.



## What's Node and `npm`, anyway?

If you're new to web development - well, firstly, welcome! - you may wonder what Node and `npm` are. Great questions!

### Node

Let's start with Node. Node is a [JavaScript runtime](/posts/how-computers-speak/#compiled-vs-runtime) that allows you to run JavaScript code on your machine without having to run your JavaScript in a browser. This means that you can write JavaScript that interacts with your computer in ways your browser cannot. For example, you can host a REST web server from Node, write files to your hard drive, interact with operating system APIs (like notifications), and more!

> You can [learn more about what a runtime is and how they work from our article that introduces the concept](/posts/how-computers-speak/#compiled-vs-runtime)

### `npm`

Any sufficiently useful programming langauge needs an ecosystem to rely on. One of the primary elements for an ecosystem is a collection of libraries that you can use to build out your own libraries and applications.

> A library is a snippet of code that other people have written that you can easily import into your own code and use yourself - often with a single line of code

`npm` is a combination of two things:

1) The registry - the servers and databases that host the packages with their specific named packages. 
2) The client-side CLI utility - the program that runs on your computer in order to install and manage the packages on your local disk

When, say, Facebook wants to publish a new version of `react`, someone from the React team (with publishing credentials) will setup and build the production version of the React source code, open the client-side utility in order to run the command `npm publish`, which will send the production code to the registry. From there, when you install `react` using the `npm` command on your device, it will pull the relevant files from the registry onto your local machine for you to use.

While the registry is vital for the usage of the CLI utility, most of the time we say `npm` in this article, we're referring to the CLI tool. We'll make sure to be explicit when talking about the registry itself

## Setting Up Node

Before we explain how to install Node, let's explain something about the release process of the software. 

When it comes to install options there are two: 

1) LTS

2) Current

The "LTS" release stands for "long-term release" is considered the most "stable" release, and is recommended for production usage. This is because LTS releases will recieve critical bug fixes and improvements even after a new version comes along. LTS releases often see years of support.

The "current" release, on the other hand, usually sees new features of JavaScript implemented that may not be present in the LTS release. This is often used to experiment and tests new features and functionality before the next LTS release.

NodeJS swiches back and forth between LTS and non-LTS stable releases. For example, Node 12 and 14 were LTS releases, but Node 13 and 15 were not. You can [read more about their release cycle on their website](https://nodejs.org/en/about/releases/)

### Installing Node

You can find pre-build binaries ready-to-install from [NodeJS' website](https://nodejs.org/en/download/). Simply download the package you want and install it. 

> If you're unsure which version of Node to go with, stick to the LTS release

Node installs come pre-packaged with their own version of `npm`, so don't worry about having to install that seperately.

However, the process of upgrading and changing version of NodeJS can be difficult. This is why I (and many others) recommend using NVM to manage your Node versions.

#### NVM

While Node has a fairly stable API (and their LTS releases are often supported for many years at a time), there may be instances where it's benificial to have the ability to quickly upgrade and change the currently installed Node versions.

For example, some webdev projects only work on specific versions of Node, while other times specific JavaScript features are only available on new versions of Node.

Both Windows, macOS, and Linux all have versions of a program called `nvm`, which allows you to change the installed version of node based on a single CLI command:

```
nvm use --lts
```

Additionally, you can (and, in order to use `nvm`, **must** use `nvm` to do so) install new versions of node using `nvm` . To do this, simply type:

```
nvm install --lts
```

##### Windows NVM

It's worth noting that the Windows variant of `nvm` does not support the same commands as the macOS and Linux variants. As such, when you find instructions for `nvm` online, you may have to find the alternative versions of those commands for the Windows version

For example, the previously mentioned `lts` command does not work on Windows. Instead, you'll have to lookup the newest LTS release of Node (from their website) and install it as such:

```
nvm install 12.16.3
```

Then, simply declare it as your main version of node:

```
nvm use 12.16.3
```

#### Upgrading NPM

The default version of `npm` is typically good enough for 99.99% of use-cases. Like any other software, however, bug fixes and features are added to new versions of `npm`. You can follow [the official `npm` blog]() to read about new features and bug fixes the versions introduce.

Ironically enough, the method of upgrading `npm` is by using `npm` itself:

```
npm i -g npm@latest
```

> Keep in mind that if you switch Node versions using `nvm`, you will need to re-run this command on every version of installed Node, as switching Node also swiches the installed version of `npm`.

### Yarn

`npm` isn't the only game in town when it comes to installing packages for use in webdev. One of the biggest alternatives to `npm` is the `yarn` package manager

### Installing Yarn

Once you have node and npm installed, installing yarn is as simple as:

```
npm i -g yarn
```

#### macOS

If you're using macOS and want to utilize `nvm`, you can also use Homebrew (a third party package manager for Macs)

```
brew install yarn
```

https://classic.yarnpkg.com/en/docs/install/#mac-stable

#### Windows

https://unicorn-utterances.com/posts/ultimate-windows-development-environment-guide/#package-management

```
choco install yarn
```

https://classic.yarnpkg.com/en/docs/install/#windows-stable

## Using Node

```
node
```





https://unicorn-utterances.com/posts/ultimate-windows-development-environment-guide/#terminal-usage



## Using NPM/Yarn

```
npm init
```

### `package-lock.json`



### Ignoring `node_modules`

