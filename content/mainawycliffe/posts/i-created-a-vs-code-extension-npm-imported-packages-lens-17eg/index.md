---
{
title: "I created a VS Code Extension - NPM Imported Packages Lens",
published: "2022-07-18T09:05:19Z",
tags: ["typescript", "javascript", "webdev", "vscode"],
description: "When you read JavaScript/Typescript code, have you ever encountered an imported package and wanted to...",
originalLink: "https://mainawycliffe.dev/blog/npm-imported-packages-lens/",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When you read JavaScript/Typescript code, have you ever encountered an imported package and wanted to learn more about it? For instance, go to the NPM or GitHub Repo, where you can get more information. When I find myself in this situation, my process always involves copying the package name, Googling it, and finally getting to my destination, either NPM, GitHub Repo, or the website for the package. This can also be not as straightforward as you might think, as it could involve several packages that are closely named, and you have to figure out which one is the correct one.

## NPM Imported Packages Lens Extension

![NPM Imported Packages Lens Extension](https://cms.mainawycliffe.dev/content/images/2022/07/ezgif.com-gif-maker.gif)

Last week, I decided to do something about this. I created a VS Code Extension that will show you links to NPM, Github, and the Homepage (usually a docs site or GitHub ReadMe of the project) for an imported package right there in the Typescript/Javascript file. Click on whichever you want to open, and you will land on the correct page without the mental model involved in my previous process.

The extension currently shows three links: NPM, GitHub, and Homepage, and all of these are pulled from NPM for the latest version of the package - I will try and address the versioning issue as time goes on especially for the link to the Homepage. And the extension currently works for ES modules for Typescript, Javascript, and JSX/TSX files; I hope to add support for other frameworks such as Vue, Svelte, and Astro in the near future.

You can install the extension from [here](https://marketplace.visualstudio.com/items?itemName=MainaWycliffe.view-package-on-npm) and find the Github repository [here](https://github.com/mainawycliffe/npm-imported-packages-lens) (please leave a star ⭐). Thank you.
