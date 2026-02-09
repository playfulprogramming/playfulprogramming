---
{
title: "Component features with Angular Ivy",
published: "2021-03-24T13:59:36Z",
edited: "2021-07-29T22:17:55Z",
tags: ["angular", "ivy", "components"],
description: "The Angular Ivy runtime introduces a new concept called component features. Component features are mixins for components. They add, remove or modify traits at runtime.",
originalLink: "https://dev.to/playfulprogramming-angular/component-features-with-angular-ivy-213h",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

*Cover photo by [Pixabay](https://www.pexels.com/photo/abstract-alcohol-art-bar-274131/) on Pexels.*

*Original publication date: 2019-12-26.*

The Angular Ivy runtime introduces a new concept called *component features*. In the first release version of Ivy, component features are not publically available. However, component features are applied internally by Angular to all components.

Component features are mixins for components. They add, remove or modify traits at runtime.

> Wait a minute, isn't this already possible with base classes or decorators?

Sure, but both of those options have severe drawbacks.

Base classes suck because JavaScript limits us to a single superclass and we are tightly coupling our classes to that base class. Any changes in the base class affect us. Any additional shared business logic we want to add can only be added through other means such as dependency injection and forwarding of control to collaborators.

Custom decorators are questionable. After several years, they are still not ratified in an ECMAScript standard. Their syntax or semantics might change. Heck, they might never make it into the language, rendering them in limbo in TypeScript and other transpiled languages.

Additionally, custom decorators are by default not tree-shakable.

Sure, Angular makes heavy use of decorators, but they are transformed into runtime annotations by the Angular compiler and they are made tree-shakable by using black voodoo magic.

> How about a library adding an extra compilation step similar to Angular then?

Yes, this is also an option, but it adds extra package dependencies and forces us to use a custom Angular CLI builder with a custom WebPack configuration.

## Component mixins without inheritance or decorators

Component features is the Angular way of doing mixins without inheritance and without class or property decorators. As they are built into the Angular runtime, they don't force us to use custom Angular CLI builders or custom WebPack configurations. Component features are even tree-shakable.

> This sounds too good to be true. What's the catch?

The catch is that while component features are supported by the Angular runtime, they are not exposed in a public API. All the Angular team has to do to expose them to us, is to add a `features` option to the `Component` decorator factory and add them in a simple compilation step like they do with their internal component features.

## Why are we still waiting?

> Why has the Angular team not exposed component features then?

I have identified two reasons.

The first reason is that the first Ivy release, Angular version 9, (and probably the following one or two releases) is focused on backwards compatibility, meaning we should need to change very little code to upgrade from the View Engine compiler and rendering engine to Ivy. The Angular team simply can't spend their time adding much new functionality before they have released Ivy with near feature-parity while maintaining backwards compatibility. There are more reasons why Ivy has taken so long to finish, but that's for another discussion.

I learned the second reason when suggesting to Minko Gechev that the Angular team should consider exposing component features. Minko is concerned that exposing this internal API will make it difficult for the Angular team to make changes to the framework.

To get a better understanding about the reasoning behind Minko's concerns, we need to explore the structure of component features.

## The structure of component features

Component feature factories are functions that take parameters to customise the effect of adding the component feature. A component feature factory is a higher-order function in that it returns a function. The function returned by the factory is the actual component feature.

> A *component feature* is a function that takes a *component definition* as a parameter and performs side effects.

Component features are applied to component definitions once by the Angular runtime.

We'll look at an example component features in a minute, but first let's discuss component definitions.

## Component definitions

*Component definitions* are Angular component annotations that are available at runtime. In Ivy, they are implemented as static properties on component classes. In Angular version 8 they were assigned to the static property `ngComponentDef`. However, this changed in Angular version 9, where instead the component definition is assigned to the static property `ɵcmp`. Theta (ɵ) indicates an *experimental* (unstable or not finalised) part of Angular's API while *cmp* is simply short for *component* or rather *component definition*.

A component definition has the shape of  `ComponentDef<T>` which is a data structure with many metadata properties used by the Ivy runtime. Examples of metadata properties in the component definition include metadata about the view encapsulation mode, whether the component uses the `OnPush` change detection strategy, directive definitions available to the component view, component selectors, and lifecycle hooks.

The most interesting metadata property for our purpose is of course the `features` property which is either null or an array of component features.

The metadata property most useful for creating component features is `factory` which is a factory function that we can pass the component type (the component class) to create a component instance. Additionally, the component lifecycle hooks are useful to certain categories of component features.

## The username component feature

Let's look at our first example component feature. We imagine an application that uses NgRx Store. The current username can be selected from the store using the `'username'`  key.

We have multiple components that rely on the current username. We could inject the store and create an observable by selecting the username from it. We could also create a user service with an observable property representing the username and inject this service into our components.

Instead, we will create a simple component feature called `withUsername`.

```ts
// with-username.feature.ts
import {
  ɵComponentDef as ComponentDef,
  ɵɵdirectiveInject as directiveInject,
} from '@angular/core';
import { select, Store } from '@ngrx/store';

export function withUsername(componentDef: ComponentDef<unknown>): void {
  const { factory, type } = componentDef;

  componentDef.factory = () => {
    const component = factory(type);
    const store = directiveInject(Store);
    component.username$ = store.pipe(select('username'));

    return component;
  };
}
```

*Listing 1. The username component feature.*

Note that the feature in Listing 1 is not the function creating component instances or injecting anything. The feature's concern is to assign a new component factory to the component definition.

Inside this new component factory, we first create a component instance using the original component factory. We then inject the NgRx Store and assign the selected state slice to the observable `username$`  property of the newly created component instance. Finally, the component factory returns the component instance.

## Applying component features

Earlier in this article, we discussed that component features are not exposed in any public API. If they were, we would be able to apply our username component feature something like demonstrated by the example in Listing 2.

```ts
// profile.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { withUsername } from './with-username.feature';

@Component({
  features: [
    withUsername,
  ],
  selector: '[appProfile]',
  template: `
    Username: {{username$ | async}}
  `,
})
export class ProfileComponent {
  username$: Observable<string>;
}
```

*Listing 2. Applying the username component feature, if component features were supported by the `Component` decorator factory.*

The promise of mixins without inheritance is that we can easily mix in multiple traits to a single class of objects. Looking at Listing 2, I bet you are able to guess that we can add multiple component features by listing multiple of them in the `features` option array.

Imagine the possibilities if Angular exposed this feature to us (pun intended).

> Can we use them today?

You bet! Of course, we need to start out with the usual caveat that *here be dragons.* Since we are using parts of the Angular framework's API that are meant to be experimental and internal, our code could break with any Angular update. We already learned that the static property name used to store the component definition at runtime had its name changed between Angular versions 8 and 9.

Let's look at a relatively simple class decorator that allows us to use component features today, but with no guarantees of being stable between different versions of Angular.

```ts
// component-features.decorator.ts
import { Type, ɵNG_COMP_DEF } from '@angular/core';

import { ComponentDefFeatures } from './component-def-feature';

export function componentFeatures(features: ComponentDefFeatures) {
  return <T>(componentType: Type<T>) => {
    // At runtime, before bootstrap
    Promise.resolve().then(() => {
      const componentDef = componentType[ɵNG_COMP_DEF];

      if (componentDef === undefined) {
        throw new Error('Ivy is not enabled.');
      }

      componentDef.features = componentDef.features || [];

      // List features in component definition
      componentDef.features = [...componentDef.features, ...features];

      // Apply features to component definition
      features.forEach(feature => feature(componentDef));
    });
  };
}
```

*Listing 3. Component features class decorator.*

The component features decorator in Listing 3 supports Ivy in Angular versions 8 and 9. It relies on the interface and type in Listing 4 since Angular does not directly expose the `ComponentDefFeature` interface yet.

```ts
// component-def-feature.ts
import { ɵComponentDef as ComponentDef } from '@angular/core';

export interface ComponentDefFeature {
  <T>(componentDef: ComponentDef<T>): void;
  /**
   * Marks a feature as something that {@link InheritDefinitionFeature} will
   * execute during inheritance.
   *
   * NOTE: DO NOT SET IN ROOT OF MODULE! Doing so will result in
   * tree-shakers/bundlers identifying the change as a side effect, and the
   * feature will be included in every bundle.
   */
  ngInherit?: true;
}

export type ComponentDefFeatures = ReadonlyArray<ComponentDefFeature>;
```

*Listing 4. Component feature interface and collection type.*

Going back  to our profile component example, we can use our custom decorator like shown in Listing 5.

```ts
// profile.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { componentFeatures } from './component-features.decorator';
import { withUsername } from './with-username.feature';

@Component({
  selector: '[appProfile]',
  template: `
    Username: {{username$ | async}}
  `,
})
@componentFeatures([
  withUsername,
])
export class ProfileComponent {
  username$: Observable<string>;
}
```

*Listing 5. Applying a component feature using our custom component features decorator.*

## Adding options to component features

Our username component feature assumes that the component expects an input property named `username$`. We can make this customisable by converting our component feature to a component feature factory as seen in Listing 6.

```ts
// with-username.feature.ts
import {
  ɵComponentDef as ComponentDef,
  ɵɵdirectiveInject as directiveInject,
} from '@angular/core';
import { select, Store } from '@ngrx/store';

import { ComponentDefFeature } from './component-def-feature.ts';

export function withUsername(inputName = 'username$'): ComponentDefFeature {
  return (componentDef: ComponentDef<unknown>): void => {
    const { factory, type } = componentDef;

    componentDef.factory = () => {
      const component = factory(type);
      const store = directiveInject(Store);
      component[inputName] = store.pipe(select('username'));

      return component;
    };
  };
}
```

*Listing 6. Component feature factory.*

For completeness, Listing 7 demonstrates how to pass an option to a component feature factory.

```ts
// profile.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { componentFeatures } from './component-features.decorator';
import { withUsername } from './with-username.feature';

@Component({
  selector: '[appProfile]',
  template: `
    Username: {{profileName$ | async}}
  `,
})
@componentFeatures([
  withUsername('profileName$'),
])
export class ProfileComponent {
  profileName$: Observable<string>;
}
```

*Listing 7. Passing an option to a component feature factory.*

## The host features paradox

Here's the kicker. If the Angular team is concerned about publicly exposing component features, they can't publicly expose the `renderComponent` function in its current form. This function for bootstrapping components to the DOM has an option called `hostFeatures` which takes an array of component features that are applied to the bootstrapped component. Angular contains the component feature called `LifecycleHooksFeature` which adds support for component lifecycle hooks like `ngOnInit` to components that are bootstrapped using `renderComponent`.

```ts
// main.ts
import {
  ɵLifecycleHooksFeature as LifecycleHooksFeature,
  ɵrenderComponent as renderComponent,
} from '@angular/core';
import { AppComponent } from './app.component';

renderComponent(AppComponent, {
  hostFeatures: [
    LifecycleHooksFeature,
  ],
});
```

*Bootstrapping a component that implements `OnInit`.*

So either the Angular team will have to bake in support for lifecycle hooks to those components, expose component features in a public API, just don't expose `renderComponent` publicly (which would be an awful decision) or add yet another `Component` decorator factory option.

I think that the Angular team will eventually have to expose component features in a public API. I also think that they should since component features enable powerful composition options to Angular developers.

Minko's concern is about exposing the component definition in a public API. While component features can put component definitions to use for advanced use cases like supporting DSLs and template languages other than Angular HTML, most use cases for component features only need access to the component factory and dependency injection.

The Angular team could consider only passing the component factory to custom component features and allow the use of `directiveInject` like seen in our example. Exposing a more limited API publicly would prevent internals from leaking but would also prevent a few categories of advanced use cases.

## Directive features

For completeness sake, I'll mention that directive features are also introduced by Ivy. They work almost exactly like component features, except the directive definition is stored in the static property `ɵdir` instead of `ɵcmp`, with *dir* being short for *directive* or rather *directive definition*.

I'm sure you can figure out how to create and apply directive features based on the examples we discussed.

## Conclusion

We've looked at what component features are, how to implement them, how to potentially use them if they become part of the Angular framework's public API and how to use them today, using a custom decorator that depends on experimental Angular APIs.

Component features enable us to strap on logic whose creation is evaluated at runtime. This is a breath of fresh air in a framework that has for too long suffered from being rigid because of [ahead-of-time compilation's restrictions on metadata](https://angular.io/guide/aot-compiler#metadata-restrictions).

### Summary

Component decorators can be used to mix in common traits or near-boilerplate glue code without relying on inheritance or custom decorators (if we disregard the `componentFeatures` decorator introduced in this article for educational purposes). They also don't require extra package dependencies or custom WebPack configurations and they are tree-shakable.

We learned that Angular itself uses component features to mix in common traits. To learn more, search for these features in the Angular source code:

- `ɵɵNgOnChangesFeature`
- `ɵɵProvidersFeature`
- `ɵɵInheritDefinitionFeature`
- `ɵɵCopyDefinitionFeature`

Component features have been the main topic of our discussion, but we also learned that directive features work in a very similar way and that host features for bootstrapped components are already part of what might just get exposed as part of the public Angular API.

To understand component features, we went over the structure of component features and component feature factories. We also briefly touched on component definitions.

### Use cases for component features

I hope that the Angular team decides to expose component features to us. I believe they will change how we implement business logic in our Angular components.

For inspirational purposes, I'm listing the use cases I imagine component features can address:

- Route parameters, route data, query parameters
- Replace container components, for example by interacting with NgRx Store, WebStorage and other means of managing application state and persistence
- Local store for local UI state
- Observable lifecycle events
- Convert observables to event emitters
- Advanced (requires working with Ivy instructions): Observable UI events like `click` and `keypress`
- Manage subscriptions and call `markDirty`

In fact, I already developed proof-of-concept component features for some of these use cases in [my GitHub repository called `ngx-ivy-features`](https://github.com/LayZeeDK/ngx-ivy-features).

### Component feature limitations

Most powerful techniques come with limitations. Component features are no exception.

Feature **declarations** can't vary at runtime. They are meant to be listed as component metadata at compile time. We can't vary them based on a runtime condition. Howeverm, we could, bake conditions into the component features themselves.

We can only have one feature declaration list per component or directive. This means that we probably can't use them exactly like higher-order components in React. Ivy could enable other ways of doing this down the road.

Of course, the biggest current limitation is that component features are not exposed in a public Angular API as of Angular version 9. However, the adventurous can use them today, since they are supported by the Ivy runtime. We've seen examples of how in this article.

Let's give component features a test run and give our feedback to the Angular team. Let's get experimental! ⚗️?‍?

## Resources

### My talk about component features

In November 2019, I presented a talk called "Ivy's hidden features" at the ngPoland conference and later at the Angular Online Event #3 2020.

<iframe src="https://www.youtube.com/watch?v=8NQCgmAQEdE"></iframe>

*Slides from my talk "Ivy's hidden features/Ivy's best kept secret" at ngPoland 2019/Angular Online Event #3 2020. [Open in new tab](https://speakerdeck.com/layzee/ivys-hidden-features).*

In the talk, I introduce and discuss component features. I walk the audience through a few simple use cases that can be solved using component features.

### Experimental component features

I created in the [`ngx-ivy-features` GitHub repository](https://github.com/LayZeeDK/ngx-ivy-features) to experiment with and demonstrate various component features. You can find router features, NgRx Store features, component lifecycle features and `LocalStorage` features.

## Acknowledgements

There are a few people I would like to thank for their involvement in this article.

### Peer reviewers

This article is brought to you with the help of these wonderful people:

- [Craig Spence](https://dev.to/phenomnominal)
- [Oleksandr Poshtaruk](https://dev.to/oleksandr)
- [Vitalii Bobrov](https://dev.to/bobrov1989)

### Special thanks

Special thanks to [Minko Gechev](https://twitter.com/mgechev) from the Angular team for discussing component features with me.
