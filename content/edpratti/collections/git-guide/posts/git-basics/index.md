---
{
	title: "Git Basics",
	description: "In our first chapter, we tackle the most common aspects of git and explain how they work in tandem with one another.",
	published: "2025-03-22",
	tags: ["git"],
	license: "cc-by-nc-sa-4",
	order: 1
}
---

Git is a version control system that is used to build the vast majority of software that we use every day.

In this first article, we're going to be looking at some of the items you'll be interacting with constantly when working with Git!

While we're about to explain the basic concepts of Git, later chapters will focus on more complex operations, usually applicable when collaborating with other people, and handling multiple concurrent development goals within a single project.

Without further ado, let's get into it.

# How do I install git?

**[Git can be installed from its official website.](https://git-scm.com/)** Once installed, it will work across your system, through either a command prompt or terminal or through a third-party GUI, tracking file changes inside your repositories.

However, if you're completely new to Git, you may be wondering: ***what's a repository?***

# Repositories

Repositories are folders — local or remote; more on that later — that contain a `.git` folder inside, which contain all the necessary files that allow it to track changes inside of the repository. 

Git will only track changes inside folders with a `.git` folder.

## How to create a repository

**Although implementations in git clients differ**, one can create a repository by navigating to a folder in a terminal and using the following command.

```
git init
```

This will generate the necessary `.git` folder, at which point you will have created a **local repository**.

## Locals and remotes

There are two types of repositories — local and remote. A **local** repository is a repository that has not been published online and can only be modified within the machine it is copied onto.

A **remote repository**, on the other hand, is a cloud-hosted repository that can be cloned, downloaded and modified locally; and with the proper permissions, those changes can be pushed onto the original cloud hosted repository.

A GitHub repository, for example, is hosted in the cloud, and thus, can be cloned onto a local folder.

## How to clone a repository

We can easily clone a GitHub repository by copying its repository URL, like so.

![Image of a GitHub repository, with the cloning popup being shown](./github_clone.png)

> A proper repository URL will always end with .git!

With the repository URL in your clipboard, we can use the `git clone` command to copy it into our desired folder.

```
git clone https://github.com/playfulprogramming/playfulprogramming.git
```

This will copy over all of the files — including the `.git` folder — into a local instance inside your machine.

Once a file is modified inside this local repository, Git will make note of it, and track the differences between the initial (when the file was first initialized or added) and the latest versions.

> But what if I want more granular control? What if I'd like to keep a history of different versions of the same file?

This is exactly what Git is for! And to save snapshots of these changes for easier revision, **[you can create a commit for each](#commits)**!

## How to publish a repository

```
TO-DO
```

## Creating a fork

```
TO-DO
```

---

# Commits

As explained earlier, commits are snapshots of changes. They allow us to save important version updates to perform regressions or more granular reviews if necessary.

An example of a commit would be as such:

<img src="./git_commit_initial.svg" alt="An example of an initial commit, with an author, and a small message, as well as the timestamp of the change." style="border-radius: var(--corner-radius_xl)" />

It contains, by default:

- **An author**
  - This is most commonly taken from the initial config when installing Git, but can be set per repository as well as overriden per commit.
- **A timestamp**
- **A commit message**
  - This is a mandatory part of every commit. You cannot commit without adding a message. If you attempt to commit without a message, you'll be given an interface in which to write a message. If that step fails, the commit will be aborted.

> Now that we know how they're displayed, how do we create them?

Before you create a commit, you must `stage` files.

## Staging files

Although Git tracks all changes within a repository, when creating a commit, you are allowed to only specify certain files to be submitted. This is what's called staging.

Staging lets Git know to only add specific file changes in the next commit and to ignore all other unaccounted changes. This is important if you're changing other files for testing purposes and these changes are not to be reflected in production.

We can stage files like so:

```
git add filename.ext
```

This will stage that specific file for the next commit.

Adding a file to staging will save a temporary snapshot of the file changes, meaning that if a staged file is modified after staging, it needs to be staged again in order to update the differences.

To account for this behavior, you may want to only stage elements right before committing.

> This looks very laborious.

It is! The `git add` command is designed for granular control of changes. Most commonly, we can completely skip this step if the nature of the file changes you're performing are not wide reaching.

We can, also, ignore files!

## Ignoring files

Inside a repository, you can have a `.gitignore` file, which lets Git know which files to never stage or commit changes from.

This is very important to stop yourself from committing useless log files or updates to dependencies that are not required to make use of the modifications you've made.

Just as with `git add`, the ignore command follows the same syntax.

```
git ignore filename.ext
```

**From this point onwards, that specific file will never be added to staging or a commit unless we manually open the `.gitignore` file in a text editor and remove the specific entry.**

And with that out of the way, we can create a commit!

## Creating a commit

We can perform a commit with the following command:

```
git commit -m "Your commit message here"
```

Continuously committing changes will save them accordingly in a commit history, or a `git log`. An example of a theoretical commit history UI would be the following:

<img src="./git_commit_history.svg" alt="An example of a multiple commits in a timeline." style="border-radius: var(--corner-radius_xl)" />

---

# Branches