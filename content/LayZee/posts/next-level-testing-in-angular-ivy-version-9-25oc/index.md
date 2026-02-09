---
{
title: "Next-level testing in Angular Ivy version 9",
published: "2021-03-24T14:18:32Z",
edited: "2021-03-24T15:08:28Z",
tags: ["angular", "ivy", "testing"],
description: "AOT, faster tests, stronger types, and component harnesses.",
originalLink: "https://dev.to/playfulprogramming-angular/next-level-testing-in-angular-ivy-version-9-25oc",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

*Cover photo by [Science in HD](https://unsplash.com/@scienceinhd) on Unsplash.*

*Original publication date: 2020-01-27.*

The Angular Ivy version 9 release comes with major testing additions and improvements. If you love testing, you can rest assured that Angular version 9 sparks joy:

- AOT compilation in tests
- Faster builds
- Faster tests
- Stronger typing
- A new concept called *component harnesses*

## AOT compilation everywhere

Yes, you read that right. By default, Ivy enables AOT compilation in all phases of our projects, including testing. This allows us to catch errors more quickly since we have fewer differences between the testing environment and the production environment.

## Faster builds and rebuilds with Ivy

In general, the Ivy compiler is faster than the View Engine compiler. Ivy is enabled by default in Angular version 9. Of course, this includes compilation for tests.

Thanks to the principle of locality combined with a caching mechanism, rebuilds are also faster. This is another major feature that also benefits testing.

## Faster tests with Ivy

Angular unit tests have had a big performance issue since Angular version 2’s initial release in September 2016. Between each test case (each `it` declaration), all components were recompiled. This was even worse for components with separate template files and stylesheets, because multiple files had to be read from disk per component.

Starting in Angular version 9, this is no longer the case. The Angular `TestBed` now caches compiled declarables and Angular modules between test cases which gives major speed improvements for all component tests that use the `TestBed`.

## Stronger typing for dependency injection in tests

In Angular version 8, `TestBed.get` was deprecated. In Angular version 9, we see why: `TestBed.inject<T>` is introduced as a type-safe replacement.

There are two differences between `TestBed.get` and `TestBed.inject<T>`:

1. `TestBed.get` returns `any`. `TestBed.inject<T>` returns a value of type `T`.
2. `TestBed.get` accepts a token of type `any`. `TestBed.inject<T>` accepts a token of type `Type<T> | InjectionToken<T> | AbstractType<T>`.

The type `T` in (1) is either a concrete class type, an abstract class type or the value returned by a dependency injection token, as defined by the passed token argument.

(2) is similar to the fact that `Injector#get` accepted a token of type `any` in Angular version 2. This signature was deprecated in Angular version 4 and a method signature similar to `TestBed.inject` was introduced.

This means that in practice, we are able to use for example a string or a number as an injector token. However, this has been a deprecated feature for 3 years and should not be used.

What `TestBed.inject` means in practice for our tests is that TypeScript now can infer the type of the returned value when resolving dependencies as seen in Listing 1.

```ts
// my.service.spec.ts
it('infers dependency types', () => {
  // `service` has inferred type `MyService` in Angular version 9
  const service = TestBed.inject(MyService);
});
```

*Listing 1. The types of resolved dependencies are now inferred.*

## Angular CDK introduces component harnesses

Angular CDK version 9 introduces a testing subpackage which can be used to implement and use so-called component harnesses for tests.

A component harness hides implementation details of a component and exposes an API which can be used to retrieve important DOM attributes such as ARIA attributes, interact with the component as a user would, without querying the component’s DOM, and get harnesses of related components such as child components or dialogs and menus triggered by the current component.

Component harnesses can be used both in unit tests, integration tests, and end-to-end tests. Angular CDK comes with two harness environments out-of-the-box:

- `TestbedHarnessEnvironment` which is used for unit tests and integration tests
- `ProtractorHarnessEnvironment` which is used for end-to-end tests driven by Protractor

The `TestbedHarnessEnvironment` is first and foremost meant to be used with Jasmine and Karma, the defacto Angular unit testing stack, but should work with other test runners and test frameworks as well. I successfully used it with Jest.

If our testing stack is not supported by the harness environments provided by Angular CDK, we can implement our own harness environment.

[Learn how to create your own component harnesses in "Create a component harness for your tests with Angular CDK"](https://dev.to/playfulprogramming-angular/create-a-component-harness-for-your-tests-with-angular-cdk-46bg).

## Angular Material adds component harnesses

Angular Material version 9 exposes component harnesses for Angular Material components. This allows us to exercise Angular Material components in our own tests without depending on their DOM implementation or data binding APIs.

By providing us with component harnesses, the Angular Components team can justify changing DOM implementations without breaking our component tests. This is exactly what they plan to do as they are currently replacing Angular-native implementations with adapters for Material Component for the web, another Google project.

[Learn how to use Angular Material's component harnesses in "Create a component harness for your tests with Angular CDK"](https://dev.to/playfulprogramming-angular/create-a-component-harness-for-your-tests-with-angular-cdk-46bg).

## Component harness benefits

- Test as a user
- Hide implementation details from tests
- Use the same harness for all types of tests (unit, integration, end-to-end)
- Publish component harnesses with our Angular libraries
- Use the published component harnesses for internal Angular library tests
- Use 3rd party component harnesses to exercise 3rd party Angular components without depending on their implementation details
- Automatically trigger change detection between component interactions
- We don't *have* to add separate attributes or classes for test selectors since all tests share the single selector defined by the component harness

## Conclusion

Angular version 9 is an amazing release for testing!

Thanks to Ivy, we now have AOT compilation everywhere, faster builds and rebuilds, faster tests and stronger typing for dependency injection.

Component harnesses are an interesting approach to testing components. They provide *test-as-a-user* APIs which can be used across unit tests, integration tests, and end-to-end tests.

Angular Material is the first Angular library to expose component harnesses for their components.

## Related resources

[Learn how to use component harnesses, how to implement component harnesses and how to implement custom harness environments in the official component harness guide](https://material.angular.io/cdk/test-harnesses/overview).

[Learn how to use Angular Material’s component harnesses in your tests in the official Angular Material guide](https://material.angular.io/guide/using-component-harnesses).

## Peer reviewers

- [Michael Hoffmann](https://dev.to/mokkapps)
