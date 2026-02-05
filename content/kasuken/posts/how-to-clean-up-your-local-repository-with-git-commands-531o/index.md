---
{
title: "How to Clean Up Your Local Repository with Git Commands",
published: "2023-06-16T14:02:00Z",
tags: ["git", "development"],
description: "Git is a powerful and popular version control system that helps you manage your code history and...",
originalLink: "https://dev.to/this-is-learning/how-to-clean-up-your-local-repository-with-git-commands-531o",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Git is a powerful and popular version control system that helps you manage your code history and collaborate with other developers. However, over time, your local repository may accumulate some unwanted files and branches that clutter your workspace and take up disk space. In this blog post, I will show you how to clean up your local repository with some useful git commands.

## How to remove untracked files?

Untracked files are files that are not part of your git repository. They may be temporary files, build artifacts, configuration files, or any other files that you don't want to commit or track. Untracked files can make your git status output messy and confusing, and they can also waste disk space.

To remove untracked files, you can use the git clean command. This command will delete any untracked files and directories in your working directory. You can use the -n option to perform a dry run and see what files will be deleted without actually deleting them. You can use the -f option to force the deletion of the files. You can use the -d option to also delete untracked directories. You can use the -x option to also delete ignored files (files that match the patterns in your .gitignore file).

For example, to delete all untracked files and directories, including ignored ones, you can run:

```
git clean -d -x -f
```

## How to undo local changes?

Local changes are changes that you have made to your tracked files but have not committed yet. They may be modifications, additions, or deletions of lines of code. Local changes can be useful for testing or experimenting with new features or fixes, but sometimes you may want to undo them and restore your files to their original state.

To undo local changes, you can use the git checkout command. This command will discard any local changes in your working directory and replace them with the content of the specified branch or commit. You can use the -- option to specify a file or a directory that you want to restore.

For example, to undo all local changes and reset your working directory to the state of the master branch, you can run:

```
git checkout -- .
```

To undo local changes only for a specific file, you can run:

```
git checkout -- <file>
```

## How to delete local branches?

Local branches are branches that exist only on your local repository. They may be feature branches, bugfix branches, or any other branches that you have created for your own work. Local branches can help you organize your code and work on different tasks independently, but sometimes you may want to delete them after they are merged or abandoned.

To delete local branches, you can use the git branch command with the -d or -D option. The -d option will delete a branch only if it is already merged with its upstream branch (the branch that it is tracking on the remote repository). The -D option will force delete a branch regardless of its merge status.

For example, to delete a branch named feature1 that is already merged with the master branch, you can run:

```
git branch -d feature1
```

To force delete a branch named bugfix2 that is not merged yet, you can run:

```
git branch -D bugfix2
```

## How to prune remote-tracking branches?

Remote-tracking branches are branches that track the state of branches on the remote repository (the repository that you have cloned from or pushed to). They have names like origin/master or origin/feature1. Remote-tracking branches can help you keep track of what is happening on the remote repository and synchronize your local branches with it.

However, sometimes remote-tracking branches may become stale or obsolete. This may happen when a branch on the remote repository is deleted or renamed, but your local repository still has a reference to it. Stale or obsolete remote-tracking branches can cause confusion and errors when you try to fetch, pull, or push from or to the remote repository.

To prune remote-tracking branches, you can use the git fetch command with the --prune option. This command will fetch the latest updates from the remote repository and delete any remote-tracking branches that no longer exist on the remote repository.

For example, to prune remote-tracking branches for the origin remote (the default remote), you can run:

```
git fetch --prune origin
```

## Conclusion

A few months ago I wrote a blog post about one of my morning routine I have: clean up the repository.
You can find a complete PowerShell script that you can use from your machine.

<!-- ::start:link-preview -->
[Update Sync GitHub Repositories in the Morning](https://dev.to/kasuken/update-sync-github-repositories-in-the-morning-1fab)
<!-- ::end:link-preview -->

---

Are you ready to take your productivity to the next level? Check out the Digital Garden for Notion template, inspired by the book "Building a Second Brain" by Tiago Forte. This template will help you implement the Second Brain methodology, which will expand your memory and intellect by saving and systematically reminding you of all your ideas, inspirations, insights, and connections. With this powerful productivity system, you'll be able to organize your thoughts, increase your creativity, and make the most of your experience. Don't wait any longer to build your own Second Brain - download the Digital Garden for Notion template for free today!

![Digital Garden for Notion](./rmqz9s0snux3l3fdfx75eyp7avks)

Link: https://emanuelebartolesi.gumroad.com/l/digitalgardenv1/devto
