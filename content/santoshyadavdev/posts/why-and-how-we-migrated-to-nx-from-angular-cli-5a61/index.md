---
{
title: "Why and How we migrated to Nx from Angular CLI",
published: "2022-03-18T12:51:49Z",
edited: "2022-03-20T19:42:52Z",
tags: ["angular", "nx", "migration", "monorepo"],
description: "Photo by Luca Bravo on Unsplash  Note: Due to NDA, we won't mention the client's name.  We finished...",
originalLink: "https://dev.to/this-is-angular/why-and-how-we-migrated-to-nx-from-angular-cli-5a61",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Photo by <a href="https://unsplash.com/@lucabravo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Luca Bravo</a> on <a href="https://unsplash.com/s/photos/code-migration?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

**Note**: Due to NDA, we won't mention the client's name.

We finished migrating to Nx from Angular CLI last year, and it was one of the biggest restructure we did. This post will cover why we decided to do it and what we did.

## Our challenges

- **Code Sharing:** We had code shared across the applications. We had most of the reusables as part of our App, and we kept adding more reusable code as part of our main Application.

- **Refactoring:** We had started perf optimization as mentioned. It was challenging to refactor the codebase in the existing state. It was challenging to determine which part of the code needed to touch. Or where to add a new feature.

- **Build Time:** Our build time was high; we had to wait a lot of time post every PR/MR. More build time means more time stuck at a task and fewer changes to shipping every release cycle.

- **Adding new features:** It was challenging to add new features in the App that was already too big.

- **Code Review:** It was hard to add code owners with a single app holding all the codebase.

The above pain points gave us a clear idea that NxDevTools is the best option for us, and we should go ahead with it.

# Why we did it

It was a big decision to move to Nx from Angular CLI. We had a single project for the main app created using Angular CLI and some smaller separate applications within the same workspace before migrating to Nx. It was like a massive piece of code sitting inside a single code base, so we had a lot of challenges migrating, and even more, if we never migrated to Nx.

When I joined the team, there was a decision to tackle the performance issues in the App, so we had a lot of refactoring of code coming soon.

## What is Nx

Nx is a DevTools for managing mono-repos. The advantage of using [mono-repos ](https://monorepo.tools/) is you can create and manage multiple applications inside a single workspace and maintain/[share ](https://monorepo.tools/#why-a-monorepo) libraries.
Nx does more than a mono-repo. It gives you access to the devkit to write your generators and builders/executors (custom command).

Nx also provides caching for your builds, so you don’t have to compile your unchanged code every time you run your build. And Nx Cloud is a fantastic product if you want to get the caching advantages on your CI pipeline.

## Concern before we started

Before starting the migration, it was essential to identify what part of the code needed to be moved from App and created as libraries.

We decided to do the following:

- Breaking everything was not what we wanted to do. We decided in the first iteration we would only move a big folder named common/legacy, which had a most reusable code base, and create a new library.

- As soon as we moved the large legacy folder to another library, we ended up with another issue. The plan to move legacy code was the right choice in the end. The problem was an increase in the bundle size, and it grew exponentially. And we couldn't go ahead with this.

We were on the drawing board again, and we decided to assemble and discuss.
We had the below choices:

- I had used secondary entrypoints in the past. My suggestion was to go with secondary entrypoints.
  - This sounds like the best idea, and I will go with this option in most cases.
  - The problem was we had extensive code to be moved to libraries.
  - If we went with this option, it might have taken us more than a year considering the large codebase, as we had three people team and only me doing this full-time.

- Considering the complexity of Solution one, we decided to go with another solution
  - We decided to use wild card paths in `tsconfig.base.json` like below
    `"@domain/common-legacy/*": ["libs/common/legacy/src/lib/*"]`
  - This was a good idea as we import only what we need.
  - But it has its challenges

### Little about the Solution

We decided to split the entire migration into 3 parts:

- Move the common/legacy and solve the issue we come across.
- Move the rest of the code after the first step is a success.
- Take care of Circular Dependency.

#### Solution as part of the initial Solution

- We dont need to create secondary entrypoints less work. We can just have folders for each `component/module/service/` etc. And use it as

```
import { HomeModule } from '@domain-common-legacy/home.module'
```

- We dont get the entire lib as part of the bundle. We only get the code that we need. Keeping bundle budget under control. And as we move new code, we need to configure the path correctly.

- But it introduced an issue, the libraries created were not buildable. But we decided to move ahead as having buildable libraries was not part of Part 1 of this migration process.

- We decided to disable the Circular Dependency checks.

# The Final solution

Once we figured out how our initial Solution works, we decided to go through the codebase, identify all the features we have and split them into libs.

We identified most of the features we have consist of 3 parts:

- feature/common: Common components/directives used within the feature and other features.
- Core: We lazy load our features, so we don't end up with a large bloated application. The core-libs consisted of components/services/directives/modules which are part of the lazy-loaded feature and not shared outside.
- State: Every feature has a state, we use NgRx for global state and RxAngular for handling local state, the state library holds the NgRx code for feature and is sometimes shared with other features.

We also decided the shared code will be part of a folder called core so we have

- core/directive
- core/shared-components
- core/state
- core/model

and many more, these libs are used across the libraries and multiple applications inside the organization.

## What after creating Libraries

As I mentioned, creating libs was only part one of the entire migration. During this exercise, we figured out a huge chunk of state management/ NgRx code with our main bundle.

We decided we could parallelly handle this by splitting them and only loading the states we need as part of the main code.

We started with around 2.9MB in the main bundle down to 2.30MB with the build for the evergreen browser.

## Handling Circular Dependency

Once we were done creating libraries, we ended up with 180+ libraries, which we had started with a single application.

Now it was time to handle the Circular Dependency issues. It was not possible to do it in one go.
So we decided to start with core libs and figured out, the large codebase responsible for the Circular Dependency issues was part of core-libs, mostly interfaces/services and states.

We kept the Circular Dependency check disabled, even though we were fixing one of the mistakes we made.

We realized we could enable the check for new code, and we enabled the check for an entire repo by adding in the root eslint config and disabled it for all the libs which had Circular Dependency. In this way, now new libraries can only be merged if they dont have a Circular Dependency issue.

We decided to enable the Circular Dependency check for libraries as we kept fixing it.

The Circular Dependency fix required us to create more libraries and finally, we ended up with more than 250+ libraries.

## Building Libraries

As we mentioned earlier, one of the issues with the approach as we can not build these libraries.

Our teammate decided to take this matter into his own hands and ended up writing a builder to build all the new libraries created with this approach.

Matt also wrote a Library Generator so we create all the libraries using the same structure, so we don't end up with entire libs as part of the bundle.

# What we achieved

After this migration, we have

Code Owners: We decided to create a CODEOWNERS file to split the responsibility for code review and which group owns the specific part of the code.

- Custom eslint rules: As a part of our process, we have some checks for our code review process; moving to Nx allowed us to convert all those checks to custom eslint rules, saving more time for us.

- Easy to refactor code: We fix/add a lot of code weekly, and having those libs made our life easier, as now it's easy to find out which part of the code needs to be touched.

# Conclusion

The choice to move to NX worked well for us, and we were able to identify features and move them to libraries, giving us the advantage of having small PRs. Also, we could identify the unused and duplicate code.

Adding custom rules and code owners was a great help for us. We were able to identify the code we needed to review.

Please share your experience on Twitter migrating to Nx and how it helped you.

You can Join Nx Community Slack: https://go.nrwl.io/join-slack

Special thanks to [Juri](https://twitter.com/juristr) for giving his precious time to review this article. Love you and your work Juri 💙

Shoutout to my [GitHub Sponsors](https://github.com/sponsors/santoshyadavdev)

- [Sunil](https://twitter.com/sunil_designer)
- [Fahad](https://twitter.com/fahadqazi)
- [Digger.dev](https://digger.dev/)
