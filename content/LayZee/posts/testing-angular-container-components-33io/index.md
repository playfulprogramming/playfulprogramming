---
{
title: "Testing Angular container components",
published: "2021-03-22T21:06:02Z",
edited: "2021-03-22T21:07:07Z",
tags: ["angular", "testing", "rxjs", "modelviewpresenter"],
description: "Learn tactics for testing RxJS observables and application state commands. Opt out of Angular testing modules for blazingly fast unit tests.",
originalLink: "https://dev.to/this-is-angular/testing-angular-container-components-33io",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Model-View-Presenter with Angular",
order: 3
}
---

*Liquid samples in a laboratory. Cover photo by [Louis Reed](https://unsplash.com/photos/pwcKF7L4-no) on Unsplash.*

*Original publication date: 2018-11-19.*

To test a container component, we will go through tactics for testing RxJS observables and application state commands since these are used to implement the two main purposes of container components:

- Container components supply a data flow for presentation.
- Container components translate component-specific events to application state commands — or *actions* to put it in Redux/NgRx Store terms.

Container component templates are hardly worth testing, since they only contain data bindings. Because of this, we can opt out of Angular testing modules for faster unit tests.

---

Many terms used in this article are explained in the introductory article “[Model-View-Presenter with Angular](https://dev.to/this-is-angular/model-view-presenter-with-angular-533h)”.

---

## Testing the heroes container component

Container components are built specifically to bind data to presentational components. Because of this, we immediately know the number and types of observable properties and methods that our container components need.

In the article “[Container components with Angular](https://dev.to/this-is-angular/container-components-with-angular-4o05)”, we extracted the `HeroesContainerComponent` from a mixed component.

To bind to the presentational heroes component, `HeroesContainerComponent` needs:

- An observable property that emits all heroes
- A method that adds a hero
- A method that deletes a hero

### Setting up test doubles

Our container component delegates to a `HeroService` for commands and queries against the application state and persistence layers. In TypeScript, a type of `HeroService` does not mean that it has to be an instance of the `HeroService` class. We only need to pass an object that has the same *interface*, meaning methods and properties of the same signature as the hero service class.

---

Read an example of how types in TypeScript can be sneaky, especially for developers used to developing in mainstream C-family object-oriented programming languages such as C# and Java.

“[Sorry C# and Java developers, this is not how TypeScript works](https://dev.to/this-is-learning/sorry-c-and-java-developers-this-is-not-how-typescript-works-401)”

---

The hero service has quite a large interface with 7 public methods. Since it is very unlikely that a single component will need all of the service methods, it is in violation of the [Interface Segregation Principle](http://docs.google.com/a/cleancoder.com/viewer?a=v\&pid=explorer\&chrome=true\&srcid=0BwhCYaYDn8EgOTViYjJhYzMtMzYxMC00MzFjLWJjMzYtOGJiMDc5N2JkYmJi\&hl=en) — part of [the SOLID principles](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod) by Robert “Uncle Bob” Martin. There are ways to address this issue but we will leave that for another time.

```ts
// heroes.container.spec.ts
import { asapScheduler, of as observableOf } from 'rxjs';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroesContainerComponent } from './heroes.container';

describe(HeroesContainerComponent.name, () => {
  function createHeroServiceStub(): jasmine.SpyObj<HeroService> {
    const stub: jasmine.SpyObj<HeroService> = jasmine.createSpyObj(
      HeroService.name,
      [
        'addHero',
        'deleteHero',
        'getHeroes',
      ]);
    resetHeroServiceStub(stub);

    return stub;
  }

  function resetHeroServiceStub(stub: jasmine.SpyObj<HeroService>): void {
    stub.addHero
      .and.callFake(({ name }: Partial<Hero>) => observableOf({
        id: 42,
        name,
      }, asapScheduler))
      .calls.reset();
    stub.deleteHero
      .and.callFake((hero: Hero) => observableOf(hero, asapScheduler))
      .calls.reset();
    stub.getHeroes
      .and.returnValue(observableOf(femaleMarvelHeroes, asapScheduler))
      .calls.reset();
  }

  const heroServiceStub: jasmine.SpyObj<HeroService> = createHeroServiceStub();

  afterEach(() => {
    resetHeroServiceStub(heroServiceStub);
  });
});
```

<figcaption>Heroes: Setting up a HeroService stub for testing the container component.</figcaption>

Instead, we will create a hero service stub with only the methods we need, so an object with methods that return data in the shape that we want. By doing this, we avoid testing a service in a unit test suite that is only meant to test the component in isolation.

Notice that we use the `asapScheduler` when creating observables from arrays to make sure that values are emitted asynchronously as in a real world scenario. Failing to do so can hide edge cases — mostly in integration tests or when testing with the Angular `TestBed`. We’ll follow best practices to prevent any errors.

---

Read more about the importance of RxJS schedulers when testing in “[Testing Observables in Angular](https://netbasal.com/testing-observables-in-angular-a2dbbfaf5329)” by Netanel Basal.

---

### Blazingly fast unit tests

When testing a container component, we can leave out the Angular Compiler from the test suite entirely since a container component has no data binding API. Its template is only for binding to one or more presentational components which means that there is no user interaction involved and no tricky UI logic to test. This means that we can opt out of using the Angular `TestBed` utilities.

We will treat the component as a regular class and create instances by passing dependencies to its constructor ourselves. Getting rid of compilation, dependency injection and the component lifecycle means that our unit tests will execute blazingly fast.

The main reason for the increased testing speed is that Angular compiles components for every *test case*, that is a compilation cycle for every single `it` call in a test suite. When the component-under-test has styles and template in separate files as opposed to inline in the `Component` decorator, it will add even more to the test execution time. This is because the compiler has to read, parse, and compile multiple files before being able to run the next test case.

### Testing RxJS observables

We create a [Jasmine Spy](https://jasmine.github.io/2.9/introduction#section-Spies) that will observe the `heroes$` property by subscribing to it. This will make us able to verify what, when and how often data is emitted.

```ts
// heroes.container.spec.ts
import { fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeroService } from '../hero.service';
import { HeroesContainerComponent } from './heroes.container';

describe(HeroesContainerComponent.name, () => {
  let container: HeroesContainerComponent;
  const destroy: Subject<void> = new Subject();
  const heroServiceStub: jasmine.SpyObj<HeroService> = createHeroServiceStub();
  const observer: jasmine.Spy = jasmine.createSpy('heroes observer');

  beforeEach(fakeAsync(() => {
    container = new HeroesContainerComponent(heroServiceStub);
    container.heroes$.pipe(takeUntil(destroy)).subscribe(observer);
    tick();
  }));

  afterEach(() => {
    destroy.next();
    observer.calls.reset();
    resetHeroServiceStub(heroServiceStub);
  });

  afterAll(() => {
    destroy.complete();
  });
});
```

<figcaption>Heroes: Observing the heroes$ property of the container component.</figcaption>

For each test case, we create a container component and subscribe the spy to the `heroes$` property. In the `afterEach` and `afterAll` hooks, we clean up the subscriptions and subject that we created during the tests.

We stub only the hero service methods that are used by the container component. When adding test cases one at a time, we would have added the spies and stubbed methods when the need occurred in a test case.

### Testing a simple observable property

We expect the `heroes$` observable to emit all the hero fakes that we have provided to the hero service stub.

```ts
// heroes.container.spec.ts
describe('emits all heroes', () => {
  it('all heroes are emitted after subscribing', () => {
    expect(observer).toHaveBeenCalledWith(femaleMarvelHeroes);
  });

  it(`delegates to ${HeroService.name}`, () => {
    expect(heroServiceStub.getHeroes).toHaveBeenCalledTimes(1);
  });
});
```

<figcaption>Heroes: Testing initial heroes state.</figcaption>

In the first test case we expect our spy to have observed a single value being emitted, containing the female Marvel heroes we use as fakes. We also make sure that the heroes are emitted exactly once in the second test case.

The second test case is not really necessary from a testing perspective. We do not care about the specifics of how the container component gets its data. However, in my experience it is valuable to verify that the application state layer has only been queried once to prevent multiple requests to the back-end.

### Testing microtasks

The hero service stub emits the value asynchronously. We use the Angular testing utilities `fakeAsync` and `tick` to test in a synchronous style by flushing [the JavaScript *event loop queue*](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) on demand.

[Angular uses Zone.js to do this neat trick](https://blog.nrwl.io/controlling-time-with-zone-js-and-fakeasync-f0002dfbf48c). When calling `tick`, *microtasks* like promises as well as observables that use the `asapScheduler` are flushed first. Afterwards, *macrotasks* are flushed, such as `setTimeout` and `setInterval` operations as well as observables that use `asyncScheduler`.

---

Read short examples explaining schedulers, microtasks and macrotasks in “[What are schedulers in RxJS](https://blog.strongbrew.io/what-are-schedulers-in-rxjs/)” by Kwinten Pisman.

---

RxJS has a utility function similar to `fakeAsync` called `fakeSchedulers`. It works like the one provided by Angular. However, it currently has the slight disadvantage that it must be imported from a specific sub-package depending on the testing framework that we use. While many Angular projects use Karma and Jasmine just like Tour of Heroes, we might want to keep the option open to change the test runner, testing framework, and test doubles library at a later point in time.

---

Learn how to fake the progress of time with the solution provided by RxJS in “[RxJS: Testing with Fake Time](https://ncjamieson.com/testing-with-fake-time/)” by Nicholas Jamieson.

---

### Testing hero addition

We expect the `add` method to notify the server in the persistence layer and alter the persistent state. To verify our expectations, we test whether the `heroes$` observable emits the added hero when the server responds.

```ts
// heroes.container.spec.ts
describe('adds a hero', () => {
  it('emits the specified hero when server responds', fakeAsync(() => {
    const wonderWoman = 'Wonder Woman';

    container.add(wonderWoman);
    tick();

    expect(observer).toHaveBeenCalledWith([
      ...femaleMarvelHeroes,
      { id: 42, name: wonderWoman },
    ]);
  }));
});
```

<figcaption>Heroes: Testing addition of a hero.</figcaption>

Our hero service stub is configured to react to the `addHero` command by default.

```ts
// heroes.container.spec.ts
it(`delegates to ${HeroService.name}`, () => {
  const hawkeye = 'Hawkeye (Kate Bishop)';

  container.add(hawkeye);

  expect(heroServiceStub.addHero).toHaveBeenCalledTimes(1);
  expect(heroServiceStub.addHero).toHaveBeenCalledWith({ name: hawkeye });
});
```

<figcaption>Heroes: Testing addition of a hero.</figcaption>

The container component delegates to the hero service when a hero is added. We verify that a partial hero with the specified name is passed as an argument to the hero service method `addHero` and that it has only been called once.

This is enough to verify the integration to the persistence layer. It is the hero service’s responsibility to ensure that the server state is updated meaning that the hero service test suite is responsible for verifying this, not the heroes container component test suite.

---

I use *The Unit Testing Minimalist* testing strategy by [Sandi Metz](https://twitter.com/sandimetz) to decide which behaviours to test. To learn more, watch “[Magic Tricks of Testing](http://youtu.be/qPfQM4w4I04)” from Ancient City Ruby 2013.

<iframe src="https://www.youtube.com/watch?v=qPfQM4w4I04"></iframe>

---

So far we have verified the delegation to the hero service and the way that the application state is affected when the server responds successfully.

How do we handle server errors, connection loss, and so on? We ignore the add hero command by **not** emitting the specified hero through the `heroes$` observable. Let us alter the hero service stub and verify this behavior.

```ts
// heroes.container.spec.ts
it('does not emit the specified hero when server fails', fakeAsync(() => {
  heroServiceStub.addHero.and.returnValue(
    throwError(new Error('server error'), asapScheduler));
  const scarletWitch = 'Scarlet Witch';

  container.add(scarletWitch);
  tick();

  expect(observer).not.toHaveBeenCalledWith([
    ...femaleMarvelHeroes,
    { id: 42, name: scarletWitch },
  ]);
}));
```

<figcaption>Heroes: Testing addition of a hero.</figcaption>

When working with an observable, it is important to handle errors that it throws. We use the pessimistic update strategy here to only update the persistent state once the server state update has been confirmed.

We could combine this with a notification to the user when errors occur. We could even prompt them to retry the operation or use an automatic retry strategy to handle temporary connection loss or server downtime.

### Testing hero deletion

The `delete` method notifies the persistence layer. This expectation is verified by spying on the `deleteHero` method of our stubbed hero service.

```ts
// heroes.container.spec.ts
describe('deletes a hero', () => {
  it(`delegates to ${HeroService.name}`, () => {
    const gamora: Hero = femaleMarvelHeroes.find(x => x.name === 'Gamora');

    container.delete(gamora);

    expect(heroServiceStub.deleteHero).toHaveBeenCalledTimes(1);
    expect(heroServiceStub.deleteHero).toHaveBeenCalledWith(gamora);
  });
});
```

<figcaption>Heroes: Testing deletion of a hero.</figcaption>

The optimistic update strategy is used for hero deletion. The hero is removed immediately from the persistent state. We verify this in another test case.

```ts
// heroes.container.spec.ts
it('emits all other heroes immediately', fakeAsync(() => {
  const elektra: Hero = femaleMarvelHeroes.find(x => x.name === 'Elektra');

  container.delete(elektra);
  tick();

  expect(observer).toHaveBeenCalledWith(
    femaleMarvelHeroes.filter(x => x.id !== elektra.id));
}));
```

<figcaption>Heroes: Testing deletion of a hero.</figcaption>

We need `fakeAsync` and `tick` to observe the persistent state change. This tells us that it happens asynchronously, which is fine. We are able to check that the specified hero has been filtered out from the heroes state.

The second part of the optimistic update strategy is that the persistent state must roll back when the server state update fails.

```ts
// heroes.container.spec.ts
it('emits the specified hero when server fails', fakeAsync(() => {
  heroServiceStub.deleteHero.and.returnValue(
    throwError(new Error('timeout'), asapScheduler));
  const storm: Hero = femaleMarvelHeroes.find(x => x.name === 'Storm');

  container.delete(storm);
  tick();

  const emittedHeroes: Hero[]  = observer.calls.mostRecent().args[0];
  emittedHeroes.sort(compareIdAscending);
  expect(emittedHeroes).toEqual(femaleMarvelHeroes);
}));
```

<figcaption>Heroes: Testing deletion of a hero.</figcaption>

In this final test case, we alter the stubbed hero service to emulate a server timeout after the hero is deleted. We verify that all the heroes are back in the heroes state.

## Summary

When we test how a container component integrates with application state management, we describe how component-specific events originating from user interactions are translated into commands.

We verify that the resulting commands are sent to services, NgRx action dispatchers, or similar software artifacts. Often, we also verify the exact number of commands sent to prevent expensive side effects or corrupted state.

In addition to verifying that a command is sent, we make assertions about the visible (public) side effects that occur, such as an updated state being emitted through an observable property on a service or a store.

We tested persistence update strategies even though this application state logic belongs in a non-presentational layer such as a service or an NgRx side effect.

To test the data flow supplied by a container component, we verify which data is emitted and the time that it happens. For this purpose, we used stubbed dependencies. We even verified the exact number of queries sent to the dependency to prevent expensive side effects.

Note that we never trigger any lifecycle hooks. In fact, nothing about the container component model or its test suite is Angular-specific.

No side effects occur when our container component instance is constructed. This puts us in full control of the data flow that the container component encapsulates, making it easier to reason about.

All the integration logic that we test would have been more difficult and [a lot slower](https://gist.github.com/Quramy/1dd5bed0bce1e7f34b79184453d1790f) to test through a UI component. This would also not have added any value to the tests.

You can find [the full heroes container component test suite](https://github.com/LayZeeDK/ngx-tour-of-heroes-mvp/blob/develop/src/app/heroes/heroes.container.spec.ts) on GitHub.

## Related articles

Read the introductory article “[Model-View-Presenter with Angular](https://dev.to/this-is-angular/model-view-presenter-with-angular-533h)”.

This is also where you will find links to the companion GitHub repository, related articles, and other useful resources.

Are you sick of worrying about state management and back-end stuff in your Angular components? Extract all that nasty non-presentational logic into container components. This is how: "[Container components with Angular](https://dev.to/this-is-angular/container-components-with-angular-4o05)".

## Editor

I want to thank you, [Max Koretskyi](https://indepth.dev/author/maxkoretskyi/), for helping me get this article into the best shape possible. I greatly appreciate the time you take to share your experiences about writing for the software development community.

## Peer reviewers

Thank you, dear reviewers, for helping me realize this article. Your feedback has been invaluable!

- [Alex Rickabaugh](https://twitter.com/synalx)
- [Brian Melgaard Hansen](https://www.linkedin.com/in/brian-melgaard-hansen-8b7176153/)
- [Craig Spence](https://dev.to/phenomnominal)
- [Denise Mauldin](https://www.linkedin.com/in/denisemauldin/)
- [Kay Khan](https://github.com/KayHS)
- [Mahmoud Abduljawad](https://twitter.com/mahmoud_ajawad)
- [Martin Kayser](https://www.linkedin.com/in/mdkayser/)
- [Sandra Willford](https://www.linkedin.com/in/sandra-willford/)
- [Stephen E. Mouritsen Chiang](https://twitter.com/chiangse)
