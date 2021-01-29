---
{
    title: "WebDev 101: How to use npm and Yarn",
    description: "",
    published: '2021-10-13T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['rxjs', 'javascript'],
    attached: [],
    license: 'cc-by-4'
}
---

If you're new to web development, it can be difficult to figure out when (and how) to use the package manager most commonly used to install app dependencies and utilities: `npm`. Likewise, if you've looked into projects that are already established, you may find yourself looking at instructions to use `yarn`.

In this article, we'll outline how to use both `npm` and `yarn` to install dependencies for your project, point out some "gotcha's" that are good to keep in mind while using them, 



# Installing

## Installing Node

You can find pre-build binaries ready-to-install from [NodeJS' website](). Simply download the package and install it. 

Node installs come pre-packaged with their own version of `npm`. While 

However, the process of upgrading and changing version of NodeJS can be difficult. This is why I (and many others) recommend using NVM to manage your Node versions.

### NVM

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

#### Windows NVM

It's worth noting that the Windows variant of `nvm` does not support the same commands as the macOS and Linux variants. As such, when you find instructions for `nvm` online, you may have to find the alternative versions of those commands for the Windows version

For example, the previously mentioned `lts` command does not work on Windows. Instead, you'll have to lookup the newest LTS release of Node (from their website) and install it as such:

```
nvm install 12.16.3
```

Then, simply declare it as your main version of node:

```
nvm use 12.16.3
```

### Upgrading NPM

The default version of `npm` is typically good enough for 99.99% of use-cases. Like any other software, however, bug fixes and features are added to new versions of `npm`. You can follow [the official `npm` blog]() to read about new features and bug fixes the versions introduce.

Ironically enough, the method of upgrading `npm` is by using `npm` itself:

```
npm i -g npm@latest
```

> Keep in mind that if you switch Node versions using `nvm`, you will need to re-run this command on every version of installed Node, as switching Node also swiches the installed version of `npm`.

## Installing Yarn

Once you have node and npm installed, installing yarn is as simple as:

```
npm i -g yarn
```

### Homebrew

If you're using macOS and want to utilize `nvm`, you can also use Homebrew (a third party package manager for Macs)

# Using Node

```
node
```





# Using NPM/Yarn

```
npm init
```

## `package-lock.json`



## Ignoring `node_modules`

