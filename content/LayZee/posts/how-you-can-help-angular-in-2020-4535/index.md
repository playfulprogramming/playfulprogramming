---
{
title: "How you can help Angular in 2020",
published: "2020-11-18T10:34:08Z",
edited: "2022-11-20T14:55:51Z",
tags: ["angular", "ivy", "community"],
description: "2020 is the year you can help the Angular ecosystem thrive.",
originalLink: "https://dev.to/this-is-angular/how-you-can-help-angular-in-2020-4535",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

*Cover photo by [bamagal](https://unsplash.com/photos/bq31L0jQAjU) on Unsplash.*

*Original publication date: 2020-01-20.*

What are the toughest challenges for Angular in 2020?

Ivy has taken up most of the Angular team's time for the past few years. There's a lot of catching up to do in 2020.

We're going to look at what is going on in the ecosystem and how you can help the Angular team solve issues so that they can focus on bringing in new features to Angular versions 10 and 11.

**Update 2020-11-18**

- RxJS 7 is not released as of November 2020.
- Bazel has been detached from Angular.
- TSLint is end-of-life as of December 1st 2020.
- The future of Protractor is [being questioned in the Angular roadmap](https://angular.io/guide/roadmap#update-our-e2e-testing-strategy).
- Augury still only has partial support for Angular Ivy, that is many features are broken.
- The strategy for Angular Ivy libraries has changed according to [this RFC](https://github.com/angular/angular/issues/38366) and is currently in active development [according to the Angular roadmap](https://angular.io/guide/roadmap#angular-libraries-use-ivy). This is a significant change from what is described in this article.

# RxJS

2020 is the year we will see RxJS version 7. It deprecates features that will be removed in version 8 and it introduces breaking changes based on features that were deprecated in version 6.x. We might even see RxJS version 8 in 2020.

The official Angular packages sets the bar for RxJS compatibility. Angular version 9 will most likely be released with RxJS version 6.5 support.

This can prove a challenge to a framework so tightly coupled with RxJS. Some of us clearly remember the upgrade from RxJS versions 5.x to 6.0.

Since RxJS version 7.0 and 8.0 will both contain breaking changes, Angular can only upgrade compatibility in its own major versions. This means, that the earliest we will see RxJS version 7.x support will be Angular version 10.0. Likewise, RxJS version 8.x will at the earliest be supported in Angular version 11.

Luckily, Angular CLI schematics have made it easy to add migrations to support upgrading despite breaking changes.

## How can I help?

1. Write articles to educate on the upcoming changes in RxJS 7.x and 8.x.
2. [Contribute to the RxJS documentation](https://dzhavat.github.io/2020/01/03/getting-started-with-contributing-to-rxjs-docs.html).
3. Help build `ng update` schematics for RxJS versions 7.0 and 8.0.

# Bazel

The plan is to release support for Bazel version 2.1 as an opt-in option for Angular version 9. Eventually, Bazel will become the default build automation tool for the Angular CLI.

## How can I help?

1. Opt-in to Bazel in your Angular version 9 project by running `ng add @angular/bazel`.
2. Create new Angular version 9 projects using Bazel by first following [the Bazel installation guide](https://docs.bazel.build/versions/2.0.0/install.html), then using this command: `npx -p @angular/bazel ng new --collection=@angular/bazel my-angular-workspace`.
3. File issues on [Angular](https://github.com/angular/angular/issues) and [Bazel](https://github.com/bazelbuild/bazel/issues)'s GitHub repositories.

Adding `@angular/bazel` converts our `angular.json` to use the `@angular/bazel:build` Angular CLI builder and generates setup and configuration files to support dependencies like RxJS and Protractor.

# TSLint

[TSLint is now deprecated](https://github.com/palantir/tslint/issues/4534#issue-413722441) and will entirely stop maintenance at the end of 2020.

The official Angular CLI lint builder and the Codelyzer lint rules both depend on TSLint. The Angular team [plans to replace TSLint with ESLint in Angular version 10](https://github.com/angular/angular-cli/issues/13732#issuecomment-573149865).

## How can I help?

1. Refer to [this issue update from Minko Gechev](https://github.com/angular/angular-cli/issues/13732#issuecomment-575796158).
2. Help James Henry create [an Angular CLI builder for ESLint](https://github.com/angular-eslint/angular-eslint/tree/master/packages/builder) and [migrate Codelyzer rules to ESLint](https://github.com/angular-eslint/angular-eslint#rules-list).

# Protractor

The official end-to-end testing framework that comes out-of-the-box with Angular is not in a good place. Protractor has barely been touched in 2019 despite a growing number of issues (around 200 open issues from 2019 alone) and breaking changes in the Selenium WebDriver APIs it wraps.

The latest stable version (5.4.2) of Protractor was in December 2018. There was a very [unofficial version 6 release](https://github.com/angular/protractor/issues/5290#issuecomment-521320499) in March 2019 which has not yet been tagged as `latest` on NPM.

First of all, the upgrade requires us to refactor all of our tests to use `async-await` instead of synchronous steps because of changes in Selenium WebDriver. Secondly, some features are broken and documentation and types are partially missing or out of date.

[The Angular team has taken ownership of Protractor](https://github.com/angular/protractor/issues/5209#issuecomment-523182031), but they have probably been too busy with Ivy to deal with Protractor and Selenium.

## How can I help?

1. Protractor needs `ng update` schematics to migrate tests from Protractor 5.x to 6.0 and make them use `async-await` when interacting with the browser and querying the DOM.
2. Protractor needs fully updated types from `selenium-webdriver`.
3. Protractor needs to update its documentation to reflect the API changes and general flow of tests.
4. `webdriver-manager` (part of Protractor) needs ironing out of bugs and updates to its documentation.

# Augury

Augury is the official in-browser developer tool for Angular, maintained by Rangle.io. While it has been keeping up with bugfixes, it hasn't seen any noteworthy feature additions since its initial version.

The 2020 challenge for Augury is that it [doesn't yet have a plan to support Ivy](https://github.com/rangle/augury#supported-version), rendering it broken for new and well-maintained projects that use Ivy.

Ivy removes `ng.probe`, but introduces a new set of runtime debugging APIs.

## How can I help?

1. Ask the Angular team how you can help [document the new debugging APIs](https://github.com/angular/angular/issues/30737#issuecomment-498284237).
2. [Fork Augury](https://github.com/rangle/augury), migrate to the Ivy debugging APIs and submit a pull request.
3. File [issues to the Augury GitHub repository](https://github.com/rangle/augury/issues) suggesting new use cases.

# The View Engine-to-Ivy transition

The release of Angular version 9 officially marks the start of the transition plan from View Engine to Ivy.

In Angular version 9, the recommendation is to switch applications to Ivy, but keep publishing View Engine libraries.

In Angular version 10, the recommendation is to publish AOT-compiled Ivy libraries.

In Angular version 11, the View Engine will be removed from applications, but the Angular compatibility compiler will make sure that Ivy applications can still work with View Engine libraries.

<iframe src="https://gist.github.com/LayZeeDK/61caba93df1ec1a0788c94a973c8dfac"></iframe>
*Table 1. The View Engine-to-Ivy transition plan. [Open in new tab](https://gist.github.com/LayZeeDK/61caba93df1ec1a0788c94a973c8dfac).*

Table 1 lists the Angular team's recommendations for the different stages of the transition plan.

## How can I help?

1. Add Angular libraries to [the Angular Ivy library compatibility validation project](https://github.com/angular/ngcc-validation).
2. Help resolve issues for libraries that fail the Ivy compatibility validation by submitting issues or better yet pull requests to their GitHub repositories.

# Conclusion

Angular Ivy is a huge effort. With the first stable release in Angular version 9, the Angular team is still left with quite a few challenges to solve in 2020.

In this article, we looked at how different technology challenges affect the Angular ecosystem in 2020. I suggested how you can contribute to the Angular ecosystem by helping out with each of these topics:

- RxJS
- Bazel
- TSLint
- Protractor
- Augury
- The View Engine-to-Ivy transition plan

Happy contributing!
