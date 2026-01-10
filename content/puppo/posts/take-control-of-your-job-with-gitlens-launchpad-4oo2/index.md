---
{
title: "Take control of your job with GitLens Launchpad",
published: "2025-12-23T07:00:00Z",
tags: ["gitkraken", "tooling"],
description: "As a developer, you have to take control of your projects every day. Whether it is a company...",
originalLink: "https://blog.delpuppo.net/take-control-of-your-job-with-gitlens-launchpad",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

As a developer, you have to take control of your projects every day. Whether it is a company repository, an open source project you maintain or collaborate on, or a simple pet project.

Gaining control over your projects often depends on the platform you're working with. While there are many options available, such as [Atlassian](http://atlassian.com/) and [GitLab](https://gitlab.com), today I will focus on using [GitHub](https://github.com/) as the platform of choice. Let me guide you through how you can effectively manage your projects on [GitHub](https://github.com/).

I’ll talk about the [GitHub](https://github.com/) one because that is where I’m working on.

For me, checking the status of my PRs is essential in my daily work. On average, I spend about one or two hours a day tracking down failing CI checks and keeping my PRs in sync with the main branch, or reviewing other PRs.

To do that, I used to use the [GitHub](https://github.com/) website on [my PRs page](https://github.com/pulls). This page is good; you can find all your PRs, including those where your teammates are requesting a review. You can check whether your PR has reviews and whether the CI passes.

![github.com pull requests](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4eb207mh7zc4qc4fxonk.png)

Here you can see my PRs at this specific moment.

As you can see, you can immediately receive information about the PRs, the number of comments, and more.

I used this page for a while because it is a perfect way to check all the work across many repositories, but it has a small problem: to check the page, I have to switch between [VSCode](https://code.visualstudio.com/) and the browser during my job. This constant switching might seem trivial, but research suggests it takes an average of 23 seconds to return to a productive state after such a context switch. In the fast-paced developer environment, these seconds add up, potentially impacting overall efficiency and output.

So, I decided to search for another solution that would let me have the same information across the projects without leaving my [VSCode](https://code.visualstudio.com/) instance.

## The first useful extensions to the migration

[GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) was the first extension I started to test. This extension enables checking all PRs in the current repository I’m working on. I can see my open PRs and my teammates' open PRs. From a [VSCode](https://code.visualstudio.com/) panel, I can check the status of a PR or review another one.  
This extension enables us to open a PR directly from [VSCode](https://code.visualstudio.com/) without using the [GitHub](https://github.com/) website, reducing the need to switch context between the editor and the [GitHub](https://github.com/) website.  
Here is a picture of the extension


![GitHub Pull Requests Extension](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5ckvxthwheha79ip123j.png)

As you can see, in the left panel, we can control PRs and Issues. By clicking the PR, we can view its home page. By clicking the arrow icon that appears when you hover over the PR, you can go to the Review mode and add comments or suggestions to that PR.

That extension has improved my DX experience, especially in PR creation and review, but, as you can see, it works only on the open repository, which is a limitation, since I cannot see if in other projects something or someone is blocked by my work, or it’s waiting for a review or something else.

## The Final Solution

While browsing the web, I came across a feature of [GitKraken](https://www.gitkraken.com/) called [Launchpad](https://www.gitkraken.com/features/launchpad). This feature enables us to get a big-picture view of all issues and PRs where we are the creator or a follower. If you don’t know [GitKraken](https://www.gitkraken.com/), it is a Git client with an awesome UI for managing your repositories. You can use it as a [desktop app](https://www.gitkraken.com/git-client?_gl=1*1yb8ynx*_up*MQ..*_ga*MTM4MjU2MTEwMS4xNzY2MjM2Mjc3*_ga_TTGBQHQ5E4*czE3NjYyMzYyNzYkbzEkZzAkdDE3NjYyMzYyNzYkajYwJGwxJGgxNjcyOTAyNTQ3), [website](https://gitkraken.dev/), editor extension ([GitLens](https://www.gitkraken.com/gitlens?_gl=1*w5a9a6*_up*MQ..*_ga*MTEyMDYwODM3LjE3NjYyMzYzMTQ.*_ga_TTGBQHQ5E4*czE3NjYyMzYzMTMkbzEkZzAkdDE3NjYyMzYzMTMkajYwJGwxJGgyMDQ0NjUzMjY0)), or the [CLI](https://www.gitkraken.com/cli?_gl=1*1ltt9q5*_up*MQ..*_ga*MTEyMDYwODM3LjE3NjYyMzYzMTQ.*_ga_TTGBQHQ5E4*czE3NjYyMzYzMTMkbzEkZzEkdDE3NjYyMzY2ODgkajYwJGwxJGgyMDQ0NjUzMjY0). They have also released an [MCP server](https://www.gitkraken.com/mcp?_gl=1*1p7bqfc*_up*MQ..*_ga*MTEyMDYwODM3LjE3NjYyMzYzMTQ.*_ga_TTGBQHQ5E4*czE3NjYyMzYzMTMkbzEkZzEkdDE3NjYyMzY3MjAkajI4JGwxJGgyMDQ0NjUzMjY0) in the last period to manage your repository through an LLM.  
As you can imagine, I use the [GitLens](https://www.gitkraken.com/gitlens) extension, which has a panel that lets me see everything across my repositories.  
*Spoiler: I use it with* [*GitHub*](https://github.com/)*, but you can also use it with* [*Bitbucket*](https://bitbucket.org/) *and* [*GitLab*](https://gitlab.com/)*. It can also combine data across different platforms.*

![GitLens Lauchpad](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q3us68bhv49mb7fs3wp6.png)

In this panel, there are different groups where you can find your PRs that meet that status. If you click the PR, you will see a pop-up that lets you get more info or jump into the repository if you have already set it up on your machine.

![GitLens Lauchpad Pop-Up](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5p2cm57xnjhkpno8suvk.png)

As you can see, just using these two extensions, I reduced the number of switches between my lovely [VSCode](https://code.visualstudio.com/) and the [GitHub](https://github.com/) website. In my editor, I already have control over all my repositories, and with the correct panel, I can do most of my work directly in the editor.

Before closing, I’d like to give you another extension that reduces the need to switch between the editor and the [GitHub](https://github.com/) website. This extension is the [GitHub Actions](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions) one. This extension lets you check the status of actions directly in the editor, without jumping to [GitHub](https://github.com/) to search for them.

## Conclusion

It’s time to wrap up this article.  
At first, I showed how I used to check my current work across projects on [GitHub](https://github.com/), but eventually it became a pain point because switching between the editor and the browser was annoying.  
Then I moved to the [GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) extension, which enables me to open, review, and check PRs and Issues in the current open repository.  
Lastly, I talked about the [GitLens](https://www.gitkraken.com/gitlens) [Launchpad,](https://www.gitkraken.com/features/launchpad) which, through a panel in the editor, provides a big-picture view of all the PRs across the repositories I’m working on and helps me reduce switching between the editor and [GitHub](https://github.com/) during my daily work.

*If you want to use the* [*GitLens*](https://www.gitkraken.com/gitlens) *Launchpad, it is a PRO feature that requires a valid* [*GitKraken*](https://www.gitkraken.com/) *license. To buy one, check this* [*link*](https://gitkraken.cello.so/I4dkhuQcpJN)*.*

That’s it for this article. I hope this feature can also improve your daily DX, and see you in the following articles.

Bye bye 👋