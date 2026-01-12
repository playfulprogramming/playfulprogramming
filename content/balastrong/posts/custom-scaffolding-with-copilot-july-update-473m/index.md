---
{
title: "Custom scaffolding with Copilot - July 2023 Update",
published: "2023-07-24T11:58:20Z",
edited: "2024-04-29T16:39:22Z",
tags: ["githubcopilot", "github", "news", "vscode"],
description: "You got the idea for a new and fun side project which you will abandon after a few weeks, but that's...",
originalLink: "https://leonardomontini.dev/copilot-create-workspace/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "GitHub Copilot",
order: 5
}
---

You got the idea for a new and fun side project ~~which you will abandon after a few weeks, but that's another story~~

You open your terminal and start typing:

```bash
mkdir my-new-project
cd my-new-project
```

And now, you think...

> Ok, what files should I create now?

> How should I define the folder structure for the project?

Depending on what project you want to create (a Next.js app, an Astro blog, an npm package) there's most likely already a CLI tool which takes some parameters and creates the project for you.

Scaffolding and boilerplates for new apps are usually done this way, but sometimes you have some particular needs which are not covered in an existing template.

You might want to already start with a `npm package, with settings and files for Open Source, jest set up, GitHub Actions workflows to run the tests, a license, a changelog template...` and so on.

What options do you have?

1. Create an empty npm project with `npm init` and then add all the files you need
2. Search for an existing template which is close to what you need and then modify it
3. Search for an existing project which has most of the features you need, copy it and remove the parts you don't need

or...

4. Use Copilot to define the folder structure and create the files you need in just one click

## Copilot's /createWorkspace new command

In [July's update](https://github.blog/changelog/2023-07-14-github-copilot-july-14th-update/#create-workspaces) GitHub Copilot introduced a new command: `/createWorkspace`.

You can type in Copilot Chat `/createWorkspace` followed by a prompt which describes what project you're going to create.

To begin with, you will get a proposed folder structure based on your needs, with also some comments and description of what has been generated.

At the end of the message, a blue "Create Workspace" button will appear.

Clicking the button will ask you to select a folder in which Copilot will create all the files and folders previously proposed.

Files will not be empty! Copilot will also generate some example content for each file, including package.json, eslint config, perfectly working GitHub Actions workflows and more.

---

However... we're still in an early phase. The folder structure is perfectly fine most of the time, but the content sometimes needs to be tweaked before running the generated project.

I gave it a try and recorded the session, you can watch it here:

{% youtube b\_VLQL00b8Y %}

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
