---
{
title: "Angular 15: what happened to environment.ts",
published: "2023-01-27T19:21:20Z",
edited: "2023-01-30T13:39:34Z",
tags: ["angular", "typescript", "devops", "webdev"],
description: "TL;DR: Nothing!   Angular 15 simply doesn't ship anymore environment files by default. You...",
originalLink: "https://dev.to/this-is-angular/angular-15-what-happened-to-environmentts-koh",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

## TL;DR: Nothing!
Angular 15 simply doesn't ship anymore environment files by default.
You can still create them and configure their replacement based on build target as it was done automatically at project creation in previous versions.

----

## A misunderstood purpose
The origin of the confusion, arising lately about the missing of these files in new project created with `ng-cli` at version 15, has its roots in the misconception that `src/environments/environment.ts` and `src/environments/environment.prod.ts` were some kind of sacred paths hardcoded in the deepest guts of Angular framework.
Reality is that they were just a convenience default choice, with no reference in codebase, and that could have been substituted by different paths and names with no harm to the application.
    
## Original role
The only place in code where you could find them referenced at project creation was `main.ts`, generated with something like this:
```ts
...
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
...
```
Their `environment.production` property was used to check if the build just booted had to enable `ProdMode` or not.
This function was turning off a flag (yes, the flag is indeed `isDevMode`, and not `isProdMode` like one could expect) actually checked in Angular codebase to toggle some "debugging" features, most evident of which is the familiar message logged in console 

> Angular is running in development mode.
Call enableProdMode() to enable production mode.

When the flag is `true`, it means we are running a development stage of our app, so we want the framework to be more verbose in warnings and errors, and even to be a bit more "pedantic" checking situations that are not an error per-se, but that could lead to undesired and often erroneous behaviour in production.
Famous one is surely [NG0100: Expression has changed after it was checked](https://angular.io/errors/NG0100), responsible of verifying our data-binding follows a unidirectional flow, something that **could** bring problems during execution, but that will not throw errors on its own at runtime.

Originally Angular had no way to switch this flag other than putting the function in a file parsed at bootstrap.

## Black magic of file replacement
People tended to accept the interpretation of the 
correct file to load as faith, without questioning **how** the framework was capable of reading `environment.ts` or `environment.prod.ts` accordingly to the build target of choice.
The answer was nothing involving deep understanding of Angular inner mechanisms, but just the use of a nice feature offered by its builder, that while parsing configuration for chosen target, was instructed to take in account `fileReplacements` array, issuing the substitution defined in its objects.
This was default config for **production** build some versions ago:
```json
"configurations": {
...
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
...
```
Nothing was preventing us to add new replacements or change default one but, if the latter, we should have considered to modify our `main.ts` to check in the right file for the `environment.production` property it used to toggle production flag.

## What changed in version 15
Last major release of Angular leverages a different system to toggle production flag: it lets `optimization` builder option, by default passed to `production` build target, set global `NgDevMode` to false, without having to parse any env file.

This change took off the only reason to have any environment file in the beginning, leading devs to get rid of them completely and obviously removing default `fileReplacements` occurrences in build targets configuration.

## Why people are freaking out
Looking at what we read so far, it looks like this new approach is not something that should affect majority of Angular applications developers, being it more an "internal" of the framework.
Thing is that, being these files already generated at project creation and correctly managed on a build target basis, it became common practice using them to store a bunch of values that need to be switched between production and development build.
Usually these involved address of API servers to contact and Auth providers configurations.

Without finding the files where expected on newly generated projects, people who never had been interested in understanding how they ever worked didn't know where to put these data, unaware of the simplicity of manually reproducing the original setup.

## Lazy solution
After the huge amount of complaints about this, Angular devs choose to "restore" on demand something similar to the old behaviour in [15.1 release](https://github.com/angular/angular-cli/pull/24409).

So, from that version onwards, having environment files in place after creating a project is as simple as issuing
```bash
ng generate environments
```
that as [explained in docs](https://angular.io/guide/build#configure-environment-specific-defaults) will create them and configure `build` and `server` targets to use them.

In short: it will create `src/environments/environment.ts` and `src/environments/environment.development.ts` adding the latter as replacement of the former for build configuration's `development` target
```json
"development": {
...
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.development.ts"
    }
  ]
```

## Why they didn't think of that before
The habit of putting environment variables inside those files is less straightforward than it could seem.
Even if their name and their use could lead to look at them as the ideal spot for such information, in real case scenario they're far from best solution.
Data like domains, endpoints, ports and alike are not bound only to *building* target, but often more tightly to **deployment context**.
That's why many people prefer to keep them outside of building process, and let the app evaluating them at runtime as token injected at deploying, maybe as environment variable of the hosting framework or docker bundling, read by a minimal server side process and exposed as API, or even passing them in dedicated configuration file inserted as assets by pipeline, as explained in this [awesome article](https://dev.to/thisdotmedia/runtime-environment-configuration-with-angular-4f5j) from good ol' @frederikprijck.

----

Now it should be clear there's been no change in environment variables management by Angular, just an upgrade that made an old easy convenient configuration not needed anymore, leading to reconsider what had always been an habit that often was a suboptimal solution, but that's available as it always has been.

Cheers.
