---
{
title: "The Angular Ivy guide for library authors",
published: "2021-03-24T14:08:51Z",
edited: "2021-03-24T15:08:01Z",
tags: ["angular", "ivy", "library"],
description: "How to respond to Angular Ivy in 2020/2021 if you're a library author.",
originalLink: "https://dev.to/this-is-angular/the-angular-ivy-guide-for-library-authors-9md",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

*Cover photo by [Goh Rhy Yan](https://unsplash.com/photos/C9PMQlg3HaQ) on Unsplash.*

*Original publication date: 2020-01-20.*

In the Template Compiler and View Engine era of Angular, published libraries were AOT-compiled, but if we used a 3rd party declarable in our application, we would have to use that 3rd party declarable as part of compiling our own components, every time that component or the library changed. This has to do with how compiled component factories and metadata worked in those versions of Angular.

Ivy follows the principle of locality by storing component factories and other relevant metadata in component definitions that are assigned to static properties of component classes. Similar definitions exist for Angular modules, directives, and pipes.

Because of this, Ivy comes with the option to compile libraries ahead-of-time and publish them to a package registry like NPM, GitHub Packages, or Azure Artifacts. In Ivy, we don't have to recompile our application's components whenever a 3rd party library is updated.

However, this is not yet recommended by the Angular team at Google. There are two reasons for this:

1. The Ivy Instruction Set which is the compilation output in directive and component rendering functions will not be finalised before Angular version 10.
2. Angular versions 9 and 10 applications will have an option to opt-out of Ivy and instead fall back to View Engine compilation and rendering.

{% gist https://gist.github.com/LayZeeDK/61caba93df1ec1a0788c94a973c8dfac %}

*Table 1. The View Engine-to-Ivy transition plan. [Open in new tab](https://gist.github.com/LayZeeDK/61caba93df1ec1a0788c94a973c8dfac).*

Table 1 lists the Angular team's recommendations for the different stages of the transition plan.

## The Angular compatibility compiler

Angular version 9 includes the Angular compatibility compiler (`ngcc`) which upgrades View Engine-based Angular package dependencies to Ivy, including 3rd party libraries, internal libraries and the Angular sub-packages. There's currently no plan for when the compatibility compiler will be removed from the framework. Based on the Angular team's recommendations for library authors, we can count on it being available in Angular versions 10 and 11.

The Angular team's recommendation for library authors is this:

- [Continue to publish View Engine AOT-compiled Angular libraries for Angular version 9.](https://angular.io/guide/ivy#maintaining-library-compatibility)
- Publish AOT-compiled Ivy libraries for Angular version 10.

## Angular Ivy compatibility validation

The Angular compatibility compiler can require some changes to our libraries. If we want to verify that our library works with `ngcc`, we should at it to [the Angular Ivy library compatibility validation project](https://github.com/angular/ngcc-validation) by the Angular team.

The project's readme file instructs us how to add tests for our library which will be run with every new version of the compatibility compiler. This is the official stamp of approval for Angular libraries. As of January 2020, 185 libraries have been added to the Ivy library compatibility validation project.

Seeing that Angular version 9 is the first stable release (many fixes has been made since the version 8 opt-in Ivy preview) and that the Ivy Instruction Set is a work-in-progress until Angular version 10 is released, we should expect to resolve issues with the compatibility compiler in 2020.

## Angular Ivy detection

If we want to support differences between View Engine and Ivy in versions of our libraries supporting Angular versions 9 and 10, we will have to use detection logic such as the one seen in Listing 1.

```ts
import {
  Type,
  ɵNG_COMP_DEF,
  ɵNG_DIR_DEF,
  ɵNG_MOD_DEF,
  ɵNG_PIPE_DEF,
} from '@angular/core';

function isIvy(): boolean {
  const ng: any = ((self || global || window) as any).ng;

  return ng === undefined
    || ng.getComponent !== undefined
    || ng.applyChanges !== undefined;
}

function isIvyComponent(componentType: Type<any>): boolean {
  return (componentType as any)[ɵNG_COMP_DEF] !== undefined;
}

function isIvyDirective(directiveType: Type<any>): boolean {
  return (directiveType as any)[ɵNG_DIR_DEF] !== undefined;
}

function isIvyModule(moduleType: Type<any>): boolean {
  return (moduleType as any)[ɵNG_MOD_DEF] !== undefined;
}

function isIvyPipe(pipeType: Type<any>): boolean {
  return (pipeType as any)[ɵNG_PIPE_DEF] !== undefined;
}
```

*Listing 1. Angular Ivy detection logic.*

## Migrations now affect libraries

As of Angular CLI version 9, `ng add` and `ng update` migration schematics now affect library projects in our workspaces. This is great news to library authors.

## Upgrade to the latest versions of TypeScript

Angular version 9 is compatible with TypeScript versions 3.6 and 3.7. We should make sure to make our Angular libraries compatible with those two versions. TypeScript version 3.5 is no longer supported as of Angular version 9 as seen in Table 2.

{% gist https://gist.github.com/LayZeeDK/c822cc812f75bb07b7c55d07ba2719b3 %}

\_Table 2. Angular CLI, Angular, Node.js and TypeScript compatibility table. [Open in new tab](https://gist.github.com/LayZeeDK/c822cc812f75bb07b7c55d07ba2719b3).\*

This is where it gets difficult. TypeScript doesn't follow semantic versioning. Every *minor* release could have breaking changes. In fact, this is the case for TypeScript version 3.6, especially for library authors.

The type declaration (`*.d.ts`) files that are output will contain class getters and setters as of TypeScript version 3.6. This breaks compatibility with earlier veresion of TypeScript. Since Angular applications are almost locked in to the one or few versions that the specific version of Angular CLI and Angular supports as seen in Table 2, if we want to support multiple versions of Angular, we will have to downlevel our output type declarations. This can be done using [`downlevel-dts` by Nathan Shively-Sanders](https://github.com/sandersn/downlevel-dts).

A similar thing happened in TypeScript version 2.1, which was taken care of by the similarly named tool `dts-downlevel` by Christopher Thielen. To this day, libraries such as Jasmine types ship with different versions of TypeScript declarations to support multiple breaking changes between TypeScript versions.

It is usually a good idea to keep the minimum version of a package dependency that you want to support for your consumers. Because of this, I recommend using TypeScript version 3.6 in your Angular library as that is the lowest version supported by Angular CLI version 9.0.

## Angular Ivy features for UI libraries

### Component harnesses

If our library is a UI library, that is it exposes directives, components, and pipes, we can consider implementing component harnesses using Angular CDK, a new feature of Angular version 9.

We can use them in internal tests, both for unit, integration, and end-to-end tests. We can also expose component harnesses for consumers to use in their own tests without their tests depending on our implementation details such as our data binding API and DOM.

Angular Material version 9 is the first library to expose component harnesses for their components.

[Learn about component harnesses and other new testing features and improvements in "Next-level testing in Angular Ivy version 9"](https://dev.to/this-is-angular/next-level-testing-in-angular-ivy-version-9-25oc).

[Learn how to create your own component harnesses in "Create a component harness for your tests with Angular CDK"](https://dev.to/this-is-angular/create-a-component-harness-for-your-tests-with-angular-cdk-46bg).

### Remove entryComponents metadata

Ivy removes the need to explicitly declare an array of  `entryComponents` for dynamically rendered components. In Ivy, every component is potentially an entry component. In fact, `entryComponents` metadata is deprecated for `NgModule` in Angular version 9, so it it might get removed as soon as Angular version 11 which could be released by the end of 2020 or early 2021.

### Don't use the Ivy Instruction Set yet

The Ivy Instruction Set is something like an assembly language or bytecode for DOM content and updates. This simple model will enable some advanced use cases for sure. In fact, it could allow us to use other template engines or create our own like [NG-VDOM](https://github.com/trotyl/ng-vdom) (which is View Engine-compatible by the way).

While we can experiment with the instruction set, we should be careful not to directly depend on it yet, since it will only be finalised in Angular version 10 as mentioned earlier.

### Don't use the experimental API yet

New low-level API members like `ɵrenderComponent`, `ɵmarkDirty`, and `ɵdetectChanges` will allow us to easily implement complex use cases, but the small theta symbol (ɵ) prefix in their names means private, experimental, or unstable.

This means, that we shouldn't rely on them at least in Angular version 9.

## Angular Ivy features for service libraries

If our library exposes services, an interesting new feature of Angular Ivy version 9 is additional provider scopes. Besides `providedIn: 'root'`, we can now add providers in the `'any'` and `'platform'` scopes.

For our library tests, we should note that `TestBed.get` has been replaced by the strongly typed `TestBed.inject`.

[Learn about additional provider scopes in "Improved Dependeny Injection with the new providedIn scopes 'any' and 'platform'"](https://dev.to/christiankohler/improved-dependeny-injection-with-the-new-providedin-scopes-any-and-platform-30bb).

[Learn about stronger typing and other test features and improvements in "Next-level testing in Angular Ivy version 9"](https://dev.to/this-is-angular/next-level-testing-in-angular-ivy-version-9-25oc).

## Creating and publishing an Angular Ivy library

Besides the points made in this article, we can create libraries for Angular Ivy as we're used to from View Engine by using Angular CLI with a library builder.

Here are my recommended resources:

- [The official Angular guide on authoring libraries](https://angular.io/guide/creating-libraries)
- [Making your Angular 2 library statically analyzable for AoT](https://medium.com/angular-in-depth/making-your-angular-2-library-statically-analyzable-for-aot-e1c6f3ebedd5)
- [The ultimate guide to set up your Angular library project](https://medium.com/angular-in-depth/the-ultimate-guide-to-set-up-your-angular-library-project-399d95b63500)
- [How to Build a Component Library with Angular and Storybook](https://medium.com/angular-in-depth/how-to-build-a-component-library-with-angular-and-storybook-718278ab976)
- [How to compile your Angular components library into Web Components](https://medium.com/angular-in-depth/how-to-compile-your-angular-components-library-into-web-components-47ff0ac73bd7)

## Conclusion

If you maintain or want to help maintain an Angular library, you now know how to respond to Angular Ivy:

1. Keep publishing a View Engine AOT-compiled bundle for Angular version 9.
2. Publish an Ivy AOT-compiled bundle for Angular version 10.
3. Add your library to [the Angular Ivy library compatibility validation project](https://github.com/angular/ngcc-validation).
4. Resolve Ivy compatiblity issues.
5. Support differences between View Engine and Ivy by using Ivy detection logic.
6. Make sure to at the very least support and use TypeScript version 3.6.

Points 3-6 are all actions we can do today. We don't have to wait for Angular version 10 to ensure Ivy compatibility.
