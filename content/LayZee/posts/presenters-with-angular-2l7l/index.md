---
{
title: "Presenters with Angular",
published: "2021-03-22T21:49:28Z",
edited: "2021-03-22T21:50:33Z",
tags: ["angular", "architecture", "designpatterns", "modelviewpresenter"],
description: "Learn how to extract presenters from presentational components. We discuss stateful and stateless presenters, component-to-presenter ratios and when to use a component or a pipe instead of a presenter.",
originalLink: "https://dev.to/this-is-angular/presenters-with-angular-2l7l",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "9847",
order: 1
}
---


Presenters are component level services that encapsulate complex presentational logic and user interaction. They can be platform- or framework-agnostic, enabling consistent UI behaviour across applications, platforms, and devices. We provide and use them in our presentational components and mixed components.

Presenters are practically isolated from the rest of the application. They usually have no dependencies at all, except for other presenters in the case of composite presenters. This makes them easy to test in isolation without a DOM or UI, even without Angular, if we design them carefully.

Presenters perform formatting of presented application state, manage local UI state and offer an interface for user interactions to hook into.

Presented application state can be modeled as RxJS observables, regular properties or simply methods that a component's input properties are passed through.

After discussing different types of presenters and different approaches to combining them with components, we return to refactoring the `HeroesComponent` from the Tour of Heroes tutorial.

We end up having the control flow illustrated in Figure 1.

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jgpo1kihguoyarfy5jm0.png)
<figcaption>Figure 1. The control flow after extracting a presenter from the presentational heroes component.</figcaption>

## Stateful presenters

Presentational components and in turn presenters don't care about where application state comes from. They manage their own synchronised representation of any piece of the application state that is of interest to their consuming components.

Stateful presenters can model many different types of application state, including persistent state, client state, transient client state, and local UI state. This is either represented as regular properties or as observable properties.

## Stateless presenters

A stateless presenter doesn't use properties, subjects or other kinds of observables for local UI state. Instead, they only transform data, making them mostly useful for presentation rather than user interaction.

As we prefer to delegate local UI state to presenters, a single stateless presenter would rarely be enough to meet all the needs of a component.

## Component-to-presenter ratios

How many presenters per component do we need? The answer is that we can combine them however we want. Let's discuss the different component-to-presenter ratios and when they make sense to use.

### One presenter per component

For use case-specific components, we often start out with a single presenter used by a single presentational component. We have a 1:1 component-to-presenter ratio.

As soon as a component's presentational logic starts becoming complex, we can choose to extract that logic into a presenter specific to that component as a first step. As the component grows, we can choose to split it into multiple components with 1:1 presenters.

A _composite presenter_ uses other presenters under-the-hood, basically a facade for other presenters. It is either component-specific or behaviour-specific. In the behaviour-specific case, it combines reusable, specialised presenters into more complex UI behaviour. If it's tied to a specific component, we most often have a 1:1 component-to-presenter ratio.

### Multiple presenters per component

As our project grows, we should find more and more opportunities to increase code reuse between features and use cases. At this point, a single component will use multiple presenters, giving us a 1:n component-to-presenter ratio.

We could also have multiple presenters that are specific to the same use case, but address different concerns. For example, many components have both presentational and behavioural logic. We could have a presenter for each of those concerns.

Maybe our component has a specific part of its template that has complex operations for both concerns that are very cohesive. We could have a presenter dealing with both concerns for this part of the template. Be careful though, this is usually a sign that we should extract a child component rather than only encapsulate this logic in a presenter.

### One presenter shared between multiple components

It can also be the case that a single presenter distributes application state and orchestrates user interaction between multiple components. This has a n:1 component-to-presenter ratio.

A stateless presenter could easily be shared between multiple components, especially multiple instances of the same component. If they had independent local UI state, they would need separate instances of a presenter which would mean a 1:1 or 1:n ratio. 

Another example of a shared presenter would be for a complex data table UI which consisted of multiple components. A single container component supplies application state and translates user interactions to commands which are forwarded to services.

Each row or cell component could own one or more presenters, either row-specific or column-specific presenters handling UI behaviour, local UI state, form validation, and formatting.

We could have a single, cross-column, table-wide presenter that distributes application state from the container component to the individual row and cell level components and in turn their presenters. It would also orchestrate user interactions originating from the row and cell level components and presenters.

## When to use a component instead of a presenter

We can use multiple presenters in a single component to encapsulate different concerns. If that's the case, why wouldn't we just encapsulate that presentation or user interaction logic in a separate component?

One reason could be that we can't introduce more DOM elements because a 3rd party library we use or valid HTML structures prevent us from doing so. We can only have one Angular component per DOM element. A way to solve this is to let that single component orchestrate multiple presenters.

Another way to solve the rigid DOM structure issue is to use container directives or provider directives which we'll discuss in another article.

In cases where we're okay with introducing additional DOM elements or we're able to apply a component to an existing DOM element, when would we use a component instead of a presenter to encapsulate presentational logic?

Let's say we had a search presenter like the one in Listing 1.


```ts
// search.presenter.ts
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export class SearchPresenter implements OnDestroy {
  private searchQuery = new Subject<string>();

  searchQuery$ = this.searchQuery.asObservable();

  ngOnDestroy(): void {
    this.searchQuery.complete();
  }

  search(query: string): void {
    this.searchQuery.next(query);
  }
}
```

<figcaption>Listing 1. Search presenter.</figcaption>


This is a reusable presenter that can be reused in multiple components which have a search box.

A benefit of having a reusable presenter is that we can change search behaviour in a single place. Let's say we wanted to debounce search queries and dismiss consecutive duplicates since the user is going to be to be typing on a physical or soft keyboard. This change is easily made in a reusable presenter as seen in Listing 2.


```ts
// search.presenter.ts
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class SearchPresenter implements OnDestroy {
  private searchQuery = new Subject<string>();

  searchQuery$ = this.searchQuery.pipe(
    debounceTime(150), // 👈
    distinctUntilChanged(), // 👈
  );

  ngOnDestroy(): void {
    this.searchQuery.complete();
  }

  search(query: string): void {
    this.searchQuery.next(query);
  }
}
```

<figcaption>Listing 2. Search presenter with debounced, distinct search query.</figcaption>


As an experiment, let's tie this presenter to a search box component as per Listing 3.


```ts
// search-box.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { SearchPresenter } from './search.presenter';

@Component({
  providers: [SearchPresenter],
  selector: 'app-search-box',
  template: `
    <input
      type="search"
      placeholder="Search..."
      (input)="onSearch($event.target.value)"> <!-- [1] -->
  `,
})
export class SearchBoxComponent implements OnInit {
  @Output()
  search = new EventEmitter<string>();

  constructor(
    private presenter: SearchPresenter,
  ) {}

  ngOnInit(): void {
    this.presenter.searchQuery$.subscribe(searchQuery => // [4]
      this.search.emit(searchQuery)); // [4]
  }

  onSearch(query: string): void { // [2]
    this.presenter.search(query); // [3]
  }
}
```

<figcaption>Listing 3. Search box component using search presenter.</figcaption>


We deliberately only have a dataflow going in one direction. The user enters search queries (1) which are intercepted by the component's event handler (2). The queries are then filtered through the presenter (3). Finally, the presenter's search query observable is connected to the component's output property (4), allowing parent components to use event binding to be notified of user searches.

We've effectively tied the search presenter to a search box. If that's the only place where we're going to use this user interaction logic, we might as well reuse the search box component rather than the search presenter. In this way, our consumers–or parent components–only have to use the search box component and bind to its `search` event to add search functionality.

If we had a few differences in how the search functionality should work in different use cases, we might find it better to reuse the search presenter rather than the search box component.

We would have to write glue code similar to the one in Listing 3 in every component that used the common search behaviour. The upside is that we could easily add additional reactive operations to the search query observable. They could be added in a component or another presenter, for example a component-specific presenter or a composite presenter.

To sum up, we can reuse a component (with a presenter) instead of a presenter when there's a high cohesion between the presenter and a slice of DOM. We would also need to be pretty sure that we're always going to use that exact behavior in our app, without any variations.

## When to use a pipe instead of a presenter

Usually, we pass a UI property or an input property through a transforming presenter method. Other times, we pipe them through observable operations that are finally connected to the component template, using for example the async pipe or the NgRx push pipe.

In the case of a transforming method, this is evaluated every time our component is dirty checked which could decrease performance in the case of an expensive transformation. However, we could memoize it to look up later transformations of the same value.

The performance decrease could be negligible when a presenter is paired with a presentational component, since it would only be dirty checked when its input properties change. However, some input values change very frequently.

A memoized Angular pipe caches all previously transformed results to return them in constant time.

A pure Angular pipe is short-circuited when evaluating a template expression during dirty checking if the current value and parameters are the same as the previous ones. Basically a memoized pipe with a single value buffer.

In performance-critical use cases, we can use a pure Angular pipe or a memoized pipe for presentation instead of a presenter.

The trade-off is that Angular pipes only care about a single value which is a very granular split of presentational logic. It's difficult to test pipe transforms integrated with the rest of the use case they're part of. We are forced to test through the DOM to do this.

Another trade-off is that Angular pipes require a relatively big amount of setup which includes indirection in the form of Angular module declarations, exports, and imports and the pipe name which is used in the component template.

Finally, Angular pipes only encapsulate presentational logic. They can't be used for any form of user interaction.

## Simple example

In "[Presentational components with Angular](https://dev.to/this-is-angular/presentational-components-with-angular-3961)", we moved presentational logic from the heroes component template to the heroes component model to minimise logic in the template.


```ts
// heroes.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Hero } from '../hero';

@Component({
  selector: 'app-heroes-ui',
  styleUrls: ['./heroes.component.css'],
  templateUrl: './heroes.component.html',
})
export class HeroesComponent {
  @Input()
  heroes: Hero[];
  @Input()
  title: string;

  @Output()
  add = new EventEmitter<string>();
  @Output()
  remove = new EventEmitter<Hero>();

  nameControl = new FormControl('');

  addHero(): void {
    let name = this.nameControl.value;
    this.nameControl.setValue(''); // [2]
    name = name.trim(); // [1]

    if (!name) { // [1]
      return;
    }

    this.add.emit(name);
  }
}
```

<figcaption>Listing 4. Heroes: Presentational component model with form validation and UI behaviour.</figcaption>


In Listing 4 we see that there's complex user interaction logic for form validation (1) and UI behaviour (2) in the `addHero` method.

### Extract complex presentational logic into a presenter

Let's create a heroes presenter by extracting the complex presentational logic from the presentational component.


```ts
// heroes.presenter.ts
import { FormControl } from '@angular/forms';

export class HeroesPresenter {
  nameControl = new FormControl(''); // [2]

  addHero(): void { // [1]
    const name = this.nameControl.value.trim();
    this.nameControl.setValue(''); // [3]

    if (!name) {
      return;
    }

    this.add.emit(name); // [4]
  }
}
```

<figcaption>Listing 5. Heroes: Presenter with extracted form control and related method.</figcaption>


We extract the `addHero` method (1) to a component-specific presenter called `HeroesPresenter`.

We need to include the name form control in the presenter (2) since the `addHero` method controls UI behaviour by clearing the form control (3).

The final statement of the method was previously used to emit a value through a component output property (4). It's currently broken.

We could add an Angular event emitter to this presenter, but we prefer to keep presenters framework-agnostic at least where it makes sense, so we decide to use an RxJS subject instead as seen in Listing 6. Additionally, an event emitter would be changed to an `Observable` type as soon as we added any operations on top of it.


```ts
// heroes.presenter.ts
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

export class HeroesPresenter {
  private add = new Subject<string>(); // 👈

  add$: Observable<string> = this.add.asObservable(); // 👈
  nameControl = new FormControl('');

  addHero(): void {
    const name = this.nameControl.value.trim();
    this.nameControl.setValue('');

    if (!name) {
      return;
    }

    this.add.next(name);
  }
}
```

<figcaption>Listing 6. Heroes: Presenter with subject exposed as observable.</figcaption>


The presenter now has an exposed observable `add$` property which our presentational component can connect to.

> API design tip: We shouldn't expose subjects or event emitters, except as component output properties.

### Inject the presenter into the presentational component

We want to inject the heroes presenter into the presentational component's constructor. To do this, we provide it as a component level service as seen in Listing 7.


```ts
// heroes.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Hero } from '../hero';
import { HeroesPresenter } from './heroes.presenter';

@Component({
  providers: [HeroesPresenter], // 👈
  selector: 'app-heroes-ui',
  styleUrls: ['./heroes.component.css'],
  templateUrl: './heroes.component.html',
})
export class HeroesComponent {
  @Input()
  heroes: Hero[];
  @Input()
  title: string;

  @Output()
  add = new EventEmitter<string>();
  @Output()
  remove = new EventEmitter<Hero>();

  constructor(
    private presenter: HeroesPresenter,
  ) {}

  addHero(): void {}
}
```

<figcaption>Listing 7. Heroes: Presentational component with presenter.</figcaption>


The presenter is added to the `providers` component option which scopes it to the component level, meaning the presenter's lifecycle follows that of the component. It's instantiated right before the presentational component and it's destroyed just before the component is.

### Delegate UI properties and event handlers to the presenter

Now that the presentational heroes component has access to the presenter, we can delegate UI properties and event handlers to it.


```ts
// heroes.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Hero } from '../hero';
import { HeroesPresenter } from './heroes.presenter';

@Component({
  providers: [HeroesPresenter],
  selector: 'app-heroes-ui',
  styleUrls: ['./heroes.component.css'],
  templateUrl: './heroes.component.html',
})
export class HeroesComponent {
  @Input()
  heroes: Hero[];
  @Input()
  title: string;

  @Output()
  add = new EventEmitter<string>();
  @Output()
  remove = new EventEmitter<Hero>();

  get nameControl(): FormControl {
    return this.presenter.nameControl; // 👈
  }

  constructor(
    private presenter: HeroesPresenter,
  ) {}

  addHero(): void {
    this.presenter.addHero(); // 👈
  }
}
```

<figcaption>Listing 8. Heroes: Presentational component delegating UI property and event handler to its presenter.</figcaption>


As seen in Listing 8, the heroes component creates a `nameControl` getter that delegates to the presenter. It also forwards control from its `addHero` event handler to the presenter's `addHero` method.[](https://bit.ly/39cqbxa)

### Connect the presenter to the presentational component's data binding API

We have a couple of things left to do to finish this refactoring. First, let's connect the presenter's observable property to the component's output property.


```ts
// heroes.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Hero } from '../hero';
import { HeroesPresenter } from './heroes.presenter';

@Component({
  providers: [HeroesPresenter],
  selector: 'app-heroes-ui',
  styleUrls: ['./heroes.component.css'],
  templateUrl: './heroes.component.html',
})
export class HeroesComponent implements OnInit {
  @Input()
  heroes: Hero[];
  @Input()
  title: string;

  @Output()
  add = new EventEmitter<string>();
  @Output()
  remove = new EventEmitter<Hero>();

  get nameControl(): FormControl {
    return this.presenter.nameControl;
  }

  constructor(
    private presenter: HeroesPresenter,
  ) {}

  ngOnInit(): void {
    this.presenter.add$.subscribe(name => this.add.emit(name)); // 👈
  }

  addHero(): void {
    this.presenter.addHero();
  }
}
```

<figcaption>Listing 9A. Heroes: Presentational component with its data binding API connected to its presenter.</figcaption>


In Listing 9A, we subscribe to the presenters `add$` observable and forwards the emitted value to the heroes component's `add` output property.


```ts
// heroes.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Hero } from '../hero';
import { HeroesPresenter } from './heroes.presenter';

@Component({
  providers: [HeroesPresenter],
  selector: 'app-heroes-ui',
  styleUrls: ['./heroes.component.css'],
  templateUrl: './heroes.component.html',
})
export class HeroesComponent implements OnInit {
  @Input()
  heroes: Hero[];
  @Input()
  title: string;

  @Output()
  add = new EventEmitter<string>();
  @Output()
  remove = new EventEmitter<Hero>();

  get nameControl(): FormControl {
    return this.presenter.nameControl;
  }

  constructor(
    private presenter: HeroesPresenter,
  ) {}

  ngOnInit(): void {
    this.presenter.add$.subscribe(this.add); // 👈
  }

  addHero(): void {
    this.presenter.addHero();
  }
}
```

<figcaption>Listing 9B. Heroes: Presentational component with its data binding API connected to its presenter.</figcaption>


Alternatively, we could connect the presenter to the output property by subscribing the output property to the observable `add$` property as seen in Listing 9B.

Instead of using an event emitter, we could have delegated a component getter marked as an output property to the presenter's observable property . This would work fine since an output property only needs to have a `subscribe` method like an observable or a subject. However, let's stick to Angular's own building blocks in components.

If our presenter contained presentational transformation methods, for example for formatting, we would add component methods or getters that passed input properties to them. We might also have component input properties whose setters passed a value to a presenter. Those values would be used in component UI properties delegating to getters or methods on the presenter.

Did we forget about something? How is the heroes component's connecting subscription managed?

### Manage observable subscriptions

If we had used the presenter's observable as a component output property, Angular would have managed the subscription for us.

We have three options to manage the subscription ourselves.


```ts
// heroes.component.ts
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeroesPresenter } from './heroes.presenter';

@Component({
  selector: 'app-heroes-ui',
})
export class HeroesComponent implements OnDestroy, OnInit {
  private destroy = new Subject<void>(); // 👈

  @Output()
  add = new EventEmitter<string>();

  constructor(
    private presenter: HeroesPresenter,
  ) {}

  ngOnInit(): void {
    this.presenter.add$.pipe(
      takeUntil(this.destroy), // 👈
    ).subscribe(name => this.add.emit(name));
  }

  ngOnDestroy(): void { // 👈
    this.destroy.next();
    this.destroy.complete();
  }
}
```

<figcaption>Listing 10A. Heroes: Component managing subscription using a lifecycle subject.</figcaption>


Our first option is to add a private `destroy` subject to the component which is called at the `OnDestroy` lifecycle moment and combine it with the `takeUntil` operator as seen in Listing 10A. You've probably seen this technique before.


```ts
// heroes.component.ts
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { HeroesPresenter } from './heroes.presenter';

@Component({
  selector: 'app-heroes-ui',
})
export class HeroesComponent implements OnDestroy, OnInit {
  private subscription: Subscription; // 👈

  @Output()
  add = new EventEmitter<string>();

  constructor(
    private presenter: HeroesPresenter,
  ) {}

  ngOnInit(): void {
    this.subscription = this.presenter.add$.subscribe(name =>
      this.add.emit(name));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // 👈
  }
}
```

<figcaption>Listing 10B. Heroes: Component managing subscription using a subscription object.</figcaption>


A second option is to store the resulting subscription in a private property and unsubscribe it in the component's `OnDestroy` lifecycle hook as seen in Listing 10B. This is the traditional RxJS technique.

The final option is to make the presenter manage the subscriptions that depend on it by completing the `add` subject in the `OnDestroy` hook. Compared to the other options, this is less code.


```ts
// heroes.presenter.ts
import { OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

export class HeroesPresenter implements OnDestroy {
  private add = new Subject<string>();

  add$: Observable<string> = this.add.asObservable();
  nameControl = new FormControl('');

  ngOnDestroy(): void {
    this.add.complete(); // 👈
  }

  addHero(): void {
    const name = this.nameControl.value.trim();
    this.nameControl.setValue('');

    if (!name) {
      return;
    }

    this.add.next(name);
  }
}
```

<figcaption>Listing 10C. Heroes: Presenter managing subscribers.</figcaption>


Listing 10C shows that we added an `ngOnDestroy` lifecycle hook in which we complete the private `add` subject. Completing a subject or any other observable causes all subscribers to trigger their `complete` hooks if they have one and finally unsubscribe.

However, in the case of a shared stateful presenter we have to be careful. If the components have different lifecycles, that is they are activated and destroyed at different times, we could get subscriptions running for components that have already been destroyed.

> Subscription management rule: We should only rely on the presenter managing subscriptions in the case of the presenter being shared between one or more components being activated and destroyed at the same time.

When sharing a presenter between routed components, components using dynamic rendering or structural directives, we should go for one of the traditional options of subscription management.

Using a combination where both the presenter and the subscribing components end subscriptions is probably an even better option. This helps us clean up resources in unit tests and lowers the risk of memory leaks.

## Optional improvements

There's always room for improvement. Here are a few options to consider.

### Refactoring the heroes presenter

One of the nice traits of a presenter is that we can refactor its implementation or add behaviour or presentational logic without breaking its public API.

With the UI behaviour and form validation extracted from the presentational component to the heroes presenter, it's clear that this encapsulated logic is concerned with the add hero form, nothing else.

We could rename it to `HeroForm` and it would still be a presenter. This would indicate that it was not a component-specific presenter, but rather a potentially reusable presenter as well as potentially one of multiple presenters with separate concerns.

The very imperative code in the `addHero` code smells like something that could be represented using a more declarative and reactive approach.


```ts
// heroes.presenter.ts
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class HeroesPresenter {
  private add = new Subject<string>();

  add$: Observable<string> = this.add.pipe(
    map(name => name.trim()), // 👈
    filter(name => !!name), // 👈
  );
  nameControl = new FormControl('');

  addHero(): void {
    const name = this.nameControl.value;
    this.nameControl.setValue('');

    this.add.next(name);
  }
}
```

<figcaption>Listing 11. Heroes: Presenter with input sanitising and validation in observable pipeline.</figcaption>


Listing 11 shows how we can express the sanitising and validation logic using RxJS operators. Reactive Forms has an even less imperative way to create this dataflow, but that's an exercis for another time.

### Enforce strict dependency injection rules

Angular's dependency injection system is pretty powerful, but we risk leaking private dependencies to other declarables if we're not careful.

Remember that we added the heroes presenter to the `providers` array option to be able to inject it into the presentational heroes component?

When we do this, we enable every view child and content child as well as their descendants to inject `HeroesPresenter`. As discussed in the section "Component-to-presenter ratios", we might want to share a presenter which this allows us. However, we might not want to provide this service to projected content.

Our simple example doesn't project content. If it did, we could choose to provide the heroes presenter using the `viewProviders` option instead to prevent the service from leaking to declarables that are outside of our immediate control. Using `viewProviders` can even be considered a good default for this very reason.

> Presenter injection tip: Default to providing a presenter using a component's `viewProviders` option unless you plan to share it with content children.

We can prevent accidental sharing of a presenter by only allowing injection of a service factory rather than the presenter itself.


```ts
// heroes-presenter-factory.token.ts
import { InjectionToken } from '@angular/core';

import { HeroesPresenter } from './heroes.presenter';

export const heroesPresenterFactoryToken = new InjectionToken(
  'Heroes presenter factory', {
    factory: (): (() => HeroesPresenter) =>
      () => new HeroesPresenter(),
  });
```

<figcaption>Listing 12A. Heroes: Dependency injection token for presenter service factory.</figcaption>



```ts
// heroes.presenter.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
  useFactory: (): never => {
    throw new Error('Use heroesPresenterFactoryToken to create a hero presenter.');  },
})
export class HeroesPresenter {}
```

<figcaption>Listing 12B. Heroes: Presenter provider guarding direct injection.</figcaption>



```ts
// heroes.component.ts
import { Component, Inject, OnDestroy } from '@angular/core';

import { HeroesPresenter } from './heroes.presenter';
import { heroesPresenterFactoryToken } from './heroes-presenter-factory.token';

@Component({
  providers: [
    {
      deps: [
        [new Inject(heroesPresenterFactoryToken)],
      ],
    provide: HeroesPresenter,
      useFactory:
        (createHeroesPresenter: () => HeroesPresenter): HeroesPresenter =>
          createHeroesPresenter(),
    },
  ],
  selector: 'app-heroes-ui',
})
export class HeroesComponent implements OnDestroy {
  constructor(
    private presenter: HeroesPresenter,
  ) {}
}
```

<figcaption>Listing 12C. Heroes: Presentational component using presenter service factory.</figcaption>


Listings 12A, 12B, and 12C shows how to use a service factory to create the heroes presenter. The presenter service provider would throw an error to prevent other declarables from injecting the heroes presenter directly.

Even if other declarables injected the service factory, they'd create a separate instance of the heroes presenter, making the presenter impossible to share by accident.

We could reuse the provider used in Listing 12C, for example by exporting it from the module that has the dependency injection token.

The last technique we can use to enforce strict dependency injection rules is to use the `Self` decorator factory when injecting the heroes presenter in the presentational component. Without a service factory, it would look like Listing 13.


```ts
// heroes.component.ts
import { Component, Self } from '@angular/core';

import { HeroesPresenter } from './heroes.presenter';

@Component({
  selector: 'app-heroes-ui',
})
export class HeroesComponent {
  constructor(
    @Self() private presenter: HeroesPresenter,
  ) {}
}
```

<figcaption>Listing 13. Heroes: Enforcing presenter injection from own node injector.</figcaption>


When we use the `Self` decorator factory, we instruct Angular to only allow the injection of the heroes presenter through what is provided by the component's own node injector.

> Presenter injection tip: Use the `Self` decorator factory where the presenter is injected unless it's a shared presenter. This prevents accidental injection of an ancestor component's presenter.

### Use observable presenter properties as component output properties

Purists will want to exclusively use `EventEmitter`s as output properties. Technically, all an output property need to integrate with Angular is to have a `subscribe` method that accepts an observer.

This means that we can use observables as output properties. Our presenters expose observables, so we can delegate to them from our component as seen in Listings 14A and 14B.


```ts
// heroes.component.ts
import { Component, Output } from '@angular/core';

import { HeroesPresenter } from './heroes.presenter';

@Component({
  providers: [HeroesPresenter],
  selector: 'app-heroes-ui',
  styleUrls: ['./heroes.component.css'],
  templateUrl: './heroes.component.html',
})
export class HeroesComponent {
  @Output('add')
  get add$(): Observable<string> { // 👈
    return this.presenter.add$;
  }

  constructor(
    private presenter: HeroesPresenter,
  ) {}

  addHero(): void {
    this.presenter.addHero();
  }
}
```

<figcaption>Listing 14A. Heroes: Presentational component delegating an output property to its presenter using a getter.</figcaption>



```ts
// heroes.component.ts
import { Component, Output } from '@angular/core';

import { HeroesPresenter } from './heroes.presenter';

@Component({
  providers: [HeroesPresenter],
  selector: 'app-heroes-ui',
  styleUrls: ['./heroes.component.css'],
  templateUrl: './heroes.component.html',
})
export class HeroesComponent {
  @Output('add')
  add$ = this.presenter.add$; // 👈

  constructor(
    private presenter: HeroesPresenter,
  ) {}

  addHero(): void {
    this.presenter.addHero();
  }
}
```

<figcaption>Listing 14B. Heroes: Presentational component delegating an output property to its presenter using a property reference.</figcaption>


In both of the alternatives in Listings 13A and 13B we remove the need for managing a subscription ourselves to connect the presenter's observable to the component's event emitter so we have removed the `OnInit` lifecycle hook.

### Framework-agnostic presenters

If we want to enable code-sharing between multiple frameworks and platforms or keep the option to do so, we should keep our presenters framework-agnostic.


```ts
// heroes.presenter.ts
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class HeroesPresenter {
  private add = new Subject<string>();

  add$: Observable<string> = this.add.pipe(
    map(name => name.trim()), // [2]
    filter(name => !!name), // [2]
  );

  destroy(): void { // [1]
    this.add.complete();
  }

  addHero(name: string): void {
    this.add.next(name);
  }
}
```

<figcaption>Listing 15A. Framework-agnostic heroes presenter.</figcaption>


Listing 15A shows a framework-agnostic heroes presenter. We removed the Angular-specific lifecycle hook, `ngOnDestroy` and replaced it with a method called simply `destroy` (1).

We removed the `FormControl`. While Reactive Angular Forms could be used with other frameworks and is a pretty good library, we instead move input sanitising and validation logic to our observable pipeline (2).


```ts
// app-heroes.presenter.ts
import { Injectable, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { HeroesPresenter } from './heroes.presenter';

@Injectable()
export class AppHeroesPresenter implements OnDestroy {
  add$ = this.presenter.add$; // [3]
  nameControl = new FormControl('');

  constructor(
    private presenter: HeroesPresenter, // [1]
  ) {}

  ngOnDestroy(): void {
    this.presenter.destroy(); // [2]
  }

  addHero(): void {
    const name = this.nameControl.value;
    this.nameControl.setValue(''); // [5]

    this.presenter.addHero(name); // [4]
  }
}
```

<figcaption>Listing 15B. Angular-specific presenter wrapping the framework-agnostic heroes presenter.</figcaption>


Listing 15B shows the Angular-specific presenter which wraps the framework-agnostic heroes presenter from Listing 15A. It injects the heroes presenter (1) and calls its `destroy` method in the `ngOnDestroy` lifecycle hook (2).

The Angular-specific presenter delegates to the `add$` observable property of the heroes presenter (3) and adds a `FormControl` which forwards every value to the `addHero` method of the heroes presenter (4) but keeps the UI behaviour logic of resetting the form control (5).

As the Angular-specific presenter keeps the same API, we use it in the exact same way in a component.

## Characteristics of presenters

Presenters are potentially reusable. They are almost isolated from the rest of the application with no or few dependencies – dependencies might be other presenters in the case of composite presenters. We add them in component level providers and use them in our presentational components and mixed components.

We can model the application state that presenters represent using RxJS observables, regular properties or methods that the component passes its input properties through to format it before presenting it to the user through the component's DOM.

Presenters can be stateful if they manage their own synchronised representation of a piece of application state. Most often this is local UI state modeled as regular properties or observable properties.

Stateless presenters are concerned about presentation as they only transform data which intentionally prevents them from managing user interactions.

We can use a component-to-presenter ratio that fits our use case. We could introduce one presenter per component such as a component-specific composite presenter.

We could have multiple presenters per component, for example one for user interactions and one for presentational concerns. Finally, we can share a single presenter between multiple components. Stateless presenters are easily shared in this way.

We learned that we can reuse a component instead of a presenter when the cohesion between the presenter and a slice of DOM is high. However, this is not a good approach if the UI behaviour varies under certain conditions.

For presentational concerns of performance-critical use cases, we can replace a presenter with a pure Angular pipe or a memoized pipe. Angular pipes have the trade-offs that they are very granular and have a big amount of setup.

In addition to these trade-offs, Angular pipes can't be used for user interaction concerns.

It's worth repeating that presenters can be platform- or framework-agnostic which enables consistent UI behaviour across applications, platforms, and devices.

One of the benefits of using presenters is that they are extremely easy to isolate in tests and that they can be tested without any UI or – if we design them well – without any framework- or platform-specific code.

## Extracting a presenter from a presentational component

To extract a presenter from a presentational component, we follow this recipe:

1.  Extract complex presentational logic into a presenter.
2.  Inject the presenter into the presentational component.
3.  Connect the presenter to the presentational component's data binding API.
4.  Manage observable subscriptions.

When extracting a presenter, the presentational component's template and data binding API should have little reason to change. UI properties might change when we extract complex presentational logic.

We end up with one or more presenters which cover these concerns:

* Presenting/transforming application state (formatting)
* UI behaviour (local UI state)
* Form validation (local UI state)
* Application-specific events

## Related articles

Read the introductory article “[Model-View-Presenter with Angular](https://dev.to/this-is-angular/model-view-presenter-with-angular-533h)”. This is also where you'll find links to the companion GitHub repository, related articles, and other useful resources.

[Learn how to convert a mixed component to a presentational component in "Presentational components with Angular"](https://dev.to/this-is-angular/presentational-components-with-angular-3961).

## Peer reviewers

Thank you for guiding and supporting me in this article, fellow professionals! It's my pleasure to have your keen eyes review this article.

* [Nacho Vazquez](https://dev.to/nachovazquez)
* [Nicholas Jamieson](https://ncjamieson.com/)
