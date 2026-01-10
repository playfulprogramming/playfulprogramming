---
{
title: "Supercharge your Firebase App Development using NX",
published: "2022-12-28T08:49:07Z",
tags: ["javascript", "firebase", "tooling", "typescript"],
description: "One of the pain points that I am sure some of us have come across when using Firebase projects that...",
originalLink: "https://mainawycliffe.dev/blog/supercharge-your-firebase-app-development-using-nx/",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

One of the pain points that I am sure some of us have come across when using Firebase projects that have been generated with Firebase CLI is code sharing between the frontend and Firebase functions, the backend.

This is because when using Firebase CLI to scaffold Firebase functions, it usually creates a new Firebase directory with its dependencies isolated from the rest of the repository. There are good reasons for this, as Firebase needs to install packages consumed by your Firebase functions in the Firebase.

Installing NPM packages not being consumed by your functions would be less than ideal as it would slow down your deployments if they are too many. Imagine installing the dependencies for your Angular app to deploy your firebase functions. The impact wouldn't be negligible. Another disadvantage would be storage consumption, which could have unforeseen circumstances.

## Disadvantages of The Default Setup

This kind of setup has a few disadvantages; the common one which I alluded to earlier, is code sharing between your frontend app and your Firebase functions. It's not impossible, but it may require you to do some work before making it work. Think of things like Types, Schemas, etc., which don't change whether they are consumed on the backend or the frontend. This can have unforeseen circumstances if they are out of sync.

The second is a smaller one; managing two sources of dependencies within your application will negatively impact the developer experience (DevX). You must ensure you switch to the correct directory to install dependencies, which requires some mental load. It would be much faster if we had a single source of truth.

And lastly has to do with caching build, lining, and testing results. For small applications, this doesn't matter, but for large applications, this could save you hours and hours, as a correct caching mechanism such as NX can allow you never to build, test, or lint on code that hasn't changed.

## Nx Generator for Firebase - @nx-toolkits/firebase

Considering the above disadvantages, I have spent the last few days working on an NX generator for Firebase Functions - [**@nx-toolkits/firebase**](https://www.npmjs.com/package/@nx-toolkits/firebase). I will expand this to include setting up hosting for NX apps in the future.

[![](https://cms.mainawycliffe.dev/content/images/2022/12/nx-toolkits.png)](https://www.npmjs.com/package/@nx-toolkits/firebase)

My goal was simple when using my NX generator; it would create a new NX app for Firebase functions, just like you would have an Express, React, NestJS, or Angular application. On top of creating an NX app, we would benefit from caching of linting, testing, and builds, and on top of that code, sharing that is enabled by NX mono repo, allowing you to share code between all your apps and libs.

In short, I am implying it needed to behave like any other NX app within your NX mono repo. Another goal I had in mind is to ensure that you can still use Firebase CLI as you would normally do, commands such as `firebase deploy --only functions` should work without you having to think.

And with those goals in mind, I went ahead and developed `@nx-toolkits/firebase`.

[@nx-toolkits/firebase on NPM](https://www.npmjs.com/package/@nx-toolkits/firebase)

## How does it work?

Just like any other NX plugin, we start by installing the plugin using NPM.

```bash
npm install -D @nx-toolkits/firebase
```

And once that has been installed, we can then go ahead and generate a Firebase functions app:

```bash
npx nx g @nx-toolkits/firebase:functions
```

You will need to provide the following options:

- `name` - Name of the NX App
- `firebaseProject` - the Firebase project id. This is optional if you already ran `firebase init` command in your project directory.
- `codebase` - This is a firebase config to organize Firebase functions collection when there are too many; please read the docs here for more information.
- `nodeVersion` - the runtime version of NodeJS for your Firebase function.

After generating the functions app, you can run the usual command with nx such as linting, testing, and building.

```bash
nx run my-functions-app:lint
```

This assumes `my-functions-app` as the name of the app

And finally, you can deploy your Firebase app once you are done. There are two ways of doing this:

1. The first one is the common way to deploy firebase apps, using the `firebase deploy` command

```bash
firebase deploy --only functions
```

1. Or the second one is to run the NX executor to deploy the command.

```bash
npx nx run my-functions-app:deploy
```

Both of these commands work exactly the same way now, and none of them has an advantage over the other.

That's it; you have an NX app Firebase functions with all the benefits of NX at your Fingertips.

### So, what's next for you

Try out the generator, and if you come across any bugs or have any ideas on areas of improvement, I would appreciate any feedback to improve this NX generator. You can find the source code [here](https://github.com/mainawycliffe/nx-toolkits).

[@nx-toolkits/firebase](https://github.com/mainawycliffe/nx-toolkits)

## Conclusion

In this post, we saw how to supercharge your Firebase development experience using NX, and how we can bring the benefits of NX to Firebase app development and rip the benefits of NX. In the next few weeks, I will work on improving a few feature sets around hosting and functions, and if you have any feedback, please feel free to open an issue [here](https://github.com/mainawycliffe/nx-toolkits/issues).