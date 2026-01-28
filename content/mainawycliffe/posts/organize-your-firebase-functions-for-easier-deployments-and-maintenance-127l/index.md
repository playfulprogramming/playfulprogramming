---
{
title: "Organize Your Firebase Functions For Easier Deployments and Maintenance",
published: "2023-06-06T10:11:48Z",
tags: ["firebase", "serverless", "typescript", "javascript"],
description: "When developing Firebase functions, it's common to have everything in a single repository - all the...",
originalLink: "https://mainawycliffe.dev/blog/organize-firebase-functions-easier-deployments-maintenance",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When developing Firebase functions, it's common to have everything in a single repository - all the Firebase Functions for your project. This is usually fine when you are starting out.

But as your project grows, this can start to have negative impacts, for instance, slow deployment as Firebase has to build large functions, upload and figure out what changed and didn't change.

On top of that, it also makes it very difficult for multiple teams to work on the same project, making it hard to deploy and maintain, as teams work on their features.

![](https://content.mainawycliffe.dev/content/images/2023/06/7o55wn.jpg)

## Firebase Functions Codebases

So, how do you manage this? Firebase provides the concept of Firebase Functions Codebases, where Firebase functions can be organized into a collection in a way that makes sense to an organization, say a team owns them or by feature, and maintained and deployed together.

The functions collections can be in different repositories or in the same repository, in a mono-repo setup using something like [NX](https://nx.dev/?ref=content.mainawycliffe.dev) in combination with the [NX generator for Firebase](https://github.com/mainawycliffe/nx-toolkits?ref=content.mainawycliffe.dev) that I built earlier this year.

Firebase codebase allows you to organize your Firebase functions collection in a way that makes sense to your organization. This could be by functionality or teams and so, allowing you to maintain and deploy them together.

By default, firebase has a single, default codebase, and your Firebase config file - `firebase.json` - looks like this.

```json
{
  // ... other firebase services configurations i.e. hosting etc.
  "functions": [
    {
      "source": "dist/apps/functions",
      // default codebase
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "predeploy": [
        "pnpm nx run functions:build"
      ]
    }
  ],
  "extensions": {}
}
```

We can configure a different codebase for our Firebase functions, for a second collection of functions by modifying the codebase property of one of our functions.

For instance, in the above example, we can add a second functions collection, with a different codebase, by adding a second config option to the functions property inside our `firebase.json` config file.

```json
{
  // ... other firebase services configs
  "functions": [
    {
      "source": "dist/apps/functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "predeploy": [
        "pnpm nx run functions:build"
      ]
    },
     {
      "source": "dist/apps/functions",
      "codebase": "codebase-2",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "predeploy": [
        "pnpm nx run functions:build"
      ]
    }
  ]
}
```

In the case above, our different functions collections exist in the same repository - a mono-repo. We could have our functions collection exist in multiple repositories and in such cases, we would just need the only codebase inside the repository to be configured in our `firebase.json` config file.

```json
{
  // ... other firebase services configs
  "functions": [
     {
      "source": "dist/apps/functions",
      "codebase": "codebase-2",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "predeploy": [
        "pnpm nx run functions:build"
      ]
    }
  ]
}
```

> NB: Ensure that the codebase property is correct, as this could have unforeseen consequences, such as deleting other functions in the codebase that weren't found inside the repository.

### Deploying your Functions

As always, `firebase deploy` and `firebase deploy functions` will deploy all Firebase functions within the current directory, in all codebases. On top of that, you can specify which codebase to deploy, by using the `firebase deploy functions:codebase` command.

```sh
firebase deploy functions:codebase
```

If your function collections are distributed in multiple repos, you can just use the `firebase deploy` command. Firebase CLI will not prompt you to delete existing Firebase function collections from other codebases.

But if your function collections are in a mono repo setup, you might find it beneficial to have your target to a specific codebase, instead of deploying all codebases within the mono repo.

```sh
firebase deploy functions:codebase
```

### Firebase Functions NX Generator

For those of you using [nx](https://nx.dev/?ref=content.mainawycliffe.dev) or want to use nx to manage your Firebase project, you might find it beneficial to try out the generator I created to create Firebase functions as NX apps. with full support for codebase - [@nx-toolkits/firebase](https://github.com/mainawycliffe/nx-toolkits/blob/main/packages/firebase/README.md?ref=content.mainawycliffe.dev).  

Each Firebase functions codebase lives as an nx application, with all the benefits of NX such as codesharing between codebases and caching. For more information, check out this [post](https://mainawycliffe.dev/blog/supercharge-your-firebase-app-development-using-nx/?ref=content.mainawycliffe.dev) about my motivations as to why I built the generator.

### How it works

First, install the @nx-toolkits/firebase generator, using your favorite package manager.

```sh
// npm
npm i  @nx-toolkits/firebase

// yarn
yarn add @nx-toolkits/firebase

//pnpm
pnpm add  @nx-toolkits/firebase
```

To generate a function in the default codebase, just run the following command:

```sh
nx g @nx-toolkits/firebase:functions
```

> **NB:** Please ensure that you have run Firebase initialization in the root directory of your project. In the future, I would like to be able to handle this as well.

This will create or override the default codebase application. To create an nx application, with a different codebase, just run the following command:

```sh
nx g @nx-toolkits/firebase:functions --codebase codebase-2
```

And that's it. Running the `nx deploy` command targeting the app you just generated, will only deploy functions of the correct codebase.

```sh
nx run my-functions-app:deploy
```

And that's it.

![](https://content.mainawycliffe.dev/content/images/2023/06/7nzcu7.jpg)

## Conclusion

In this post, we looked at how we can use codebases in Firebase functions to organize our Firebase functions making it easy to maintain and deploy, as our app grows.

It's important for any project, to be able to enhance effectiveness and ensure different features can be developed and maintained with minimal conflicts and with speed.

Codebases make it easy for organizations to be able to decide how to organize Firebase functions as it makes sense to them, be it in a mono repo setup or even multiple repositories, so as to achieve business goals.

### Resources

- [Supercharge your Firebase App Development using NX](https://mainawycliffe.dev/blog/supercharge-your-firebase-app-development-using-nx/?ref=content.mainawycliffe.dev)
- [The typeof and keyof operators - referencing variable types in Typescript](https://www.allthingstypescript.dev/p/the-typeof-and-keyof-operators-referencing?ref=content.mainawycliffe.dev)
- [Organize multiple functions](https://firebase.google.com/docs/functions/organize-functions?gen=2nd\&ref=content.mainawycliffe.dev)
- [Using Zod Schemas as a Source of Truth for Typescript Types](https://www.allthingstypescript.dev/p/using-zod-schemas-as-source-of-truth?ref=content.mainawycliffe.dev)
- [My Blog is Overengineered](https://mainawycliffe.dev/blog/my-blog-is-over-engineered/?ref=content.mainawycliffe.dev)
