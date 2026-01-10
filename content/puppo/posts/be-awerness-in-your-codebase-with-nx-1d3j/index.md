---
{
title: "Be aware of your codebase with Nx",
published: "2022-11-29T09:00:45Z",
edited: "2022-11-29T09:10:43Z",
tags: ["nx", "monorepo", "onboarding", "graph"],
description: "Preface   Is your team aware of the relations between your modules? Is a team member able to...",
originalLink: "https://blog.delpuppo.net/be-aware-of-your-codebase-with-nx",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---


## Preface

Is your team aware of the relations between your modules? Is a team member able to understand what is affected by the changes in a new feature quickly? Probably your answer is: it depends. It depends on the team member and on the time that this team member is on the project. But today I want to show you how you can make your team more confident in your codebase regardless of the seniority or the time he or she is in the project.

## The problem

Imagine a typical first onboarding day in your company. Probably after the introduction and some hours with the HR team the new colleague starts the onboarding stage with a technical team member. The first thing shown is a demo of the software so they start to understand the business value of the project. After that or its coffee break time or its time to see the codebase. After the project's checkout, your new colleague and you will open the project in your editor or IDE and the first impact with the codebase for your newbie could be like this:

![Folder Structure](https://cdn.hashnode.com/res/hashnode/image/upload/v1668354281193/7vxbzNjKL.png)

And now you start to illustrate how the codebase is structured for each folder. Yes, if you are on the project for a while you know much of the code but for your new colleague understanding and remembering all this stuff quickly is not simple. They also want to see which modules are connected and how, but you dont have a tool to see this information quickly. So you will be forced to open many files to know where the imports are, but for your new colleague, these actions will result in tedious unintelligible steps and will not leave the correct information in their mind.

But is there a way to improve this situation and help the newbie and the boomer of your project to have a picture of the project and get this info quickly anytime?

## A better onboarding day

Ok, your onboarding day could probably be better, and your new colleague could be more confident about the project after the first day. Do you know that a picture is better than thousand words for your mind? Do you know that your mind remembers images better than words? Therefore, what if the first impression of the project for your new colleague could be like this?

![Nx Graph Picture](https://cdn.hashnode.com/res/hashnode/image/upload/v1668354412400/_PZrnslfp.png)

The newbies will be grateful because they have a big picture of the project and by themselves, they can understand the relations in the codebase. But the surprises are not finished; if you click with the mouse on the relation's arrows, it's possible to see which file creates the connection between the modules, is it not cool?

Ok, fantastic, but now you are wondering "How can I do that?" Beah, it's simple, using [Nx](https://nx.dev/).

## What is Nx?

Nx is a **Smart** , **Fast** , **Extensible** build System.

Nx is a tool built by [Nrwl](https://nrwl.io/) that allows teams to handle their projects in a great way. One of the goals of Nx is to improve the DevX of teams that work using Monorepo. Nx exposes out-of-the-box for testing: jest, storybook and cypress. Instead, Eslint and Prettier are already configurated to work with the code style. About frameworks, Nx is able to work in the same workspace with React, Angular, WebComponent, and NextJs on the frontend side and with Express, Fastify and NestJS on the backend side. The nrwl team officially maintains these frameworks, but it is also possible to use Nx with other languages or frameworks thanks to the plugins created by the community. Cool!! But Nx doesnt stop here its potential. Nx has an excellent feature called Nx Graph, available by a web application or the Nx Console (an extension created by the nrwl team that works both in VsCode and WebStorm). But lets deepen into Nx Graph.

## Nx Graph

Nx Graph is a web application that shows the tree of your workspace and allows the team to see the state of the codebase. Using the Nx Graph is very simple to check the relations between the modules, and its easy to check the paths between two modules. But Nx doesnt end its power here because it is also able to understand what is changed in your feature branch and detects what is affected by these changes. In these cases, the Nx Graph highlights modules affected by the changes, so you and your team can visualize what could be impacted.

Nx under the hood uses this information to improve tasks like building and testing. Yes, you read well, it uses this info to enhance the tasks, so Nx is able to build and test only the modules affected by the changes. As you can understand, if your project snowballs, the build and the test time dont increase drastically.

## Not only for onboarding days

The benefits of using Nx are not only during the onboarding days. Using the Nx Graph, your team can see in less time how the project has changed over time or check how the project is growing up. Using Nx is also possible to create rules to prevent relations between modules or tagging modules to develop rules around these tags, but this is another story that we will discover in future.

Okay, for today, that's all. I hope you understood this tool's power and that now you are curious about it. If so, visit the [Nx site](https://nx.dev/) and start to take your first steps. If you are curious about the Nx Graph, I suggest you to watch this [video](https://youtu.be/ZST_rmhzRXI) by [juri](https://twitter.com/juristr?s=21&t=yONfiWmu7Y0_OjWAXW13fw).

See you soon with other posts about Nx.

Bye bye