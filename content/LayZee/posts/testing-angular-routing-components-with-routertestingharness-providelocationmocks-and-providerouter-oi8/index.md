---
{
title: "Testing Angular routing components with RouterTestingHarness, provideLocationMocks, and provideRouter",
published: "2023-02-08T23:54:59Z",
edited: "2023-02-09T07:32:14Z",
tags: ["angular", "testing", "router"],
description: "Learn how to implement integrated routing component tests with RouterTestingHarness, provideRouter, and provideLocationMocks.",
originalLink: "https://dev.to/playfulprogramming-angular/testing-angular-routing-components-with-routertestingharness-providelocationmocks-and-providerouter-oi8",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Angular router testing",
order: 4
}
---

*Cover art by DALL·E 2.*

It's been three years since [Testing Angular routing components with the RouterTestingModule](https://dev.to/playfulprogramming-angular/testing-angular-routing-components-with-the-routertestingmodule-4cj0). This article revisits integrated routing component tests with modern Angular APIs, including standalone components, [`provideRouter`](https://angular.io/api/router/provideRouter), [`provideLocationMocks`](https://angular.io/api/common/testing/provideLocationMocks), and [`RouterTestingHarness`](https://next.angular.io/api/router/testing/RouterTestingHarness). Additionally, we use a [SIFERS](https://medium.com/@kolodny/testing-with-sifers-c9d6bb5b362) for managing our test setup and test utilities.

![The show hero detail use case](./2nmyzdvl6jlded36ix89.png)

<figcaption>The <em>show hero detail</em> use case.</figcaption>

## providerRouter and provideLocationMocks

[`provideRouter`](https://angular.io/api/router/provideRouter) (introduced by Angular version 14.2) is the standalone version of [`RouterModule.forRoot`](https://angular.io/api/router/RouterModule#forroot). Combine it with [`provideLocationMocks`](https://angular.io/api/common/testing/provideLocationMocks) (introduced by Angular version 15.0) and we have the standalone version of [`RouterTestingModule.withRoutes`](https://angular.io/api/router/testing/RouterTestingModule#withroutes).

> ℹ️ Note
> Read [What does the RouterTestingModule do?](https://dev.to/playfulprogramming-angular/testing-angular-routing-components-with-the-routertestingmodule-4cj0#what-does-the-routertestingmodule-do) for a detailed explanation of how [`RouterTestingModule`](https://angular.io/api/router/testing/RouterTestingModule) replaces Angular Router dependencies. [`provideLocationMocks`](https://angular.io/api/common/testing/provideLocationMocks) does the same.

## RouterTestingHarness

[`RouterTestingHarness`](https://next.angular.io/api/router/testing/RouterTestingHarness) (introduced by Angular version 15.2) is similar to [Spectacular](https://www.npmjs.com/package/@ngworker/spectacular)'s [Feature testing API](https://ngworker.github.io/ngworker/docs/feature-testing).

When we call [`RouterTestingHarness.create`](https://next.angular.io/api/router/testing/RouterTestingHarness#create) (only call it once per test), a test root component with a router outlet is created behind the scenes but we don't get access to this component or its component fixture.

The resolved [`RouterTestingHarness`](https://next.angular.io/api/router/testing/RouterTestingHarness) instance has the properties [`routeDebugElement`](https://next.angular.io/api/router/testing/RouterTestingHarness#properties) and [`routeNativeElement`](https://next.angular.io/api/router/testing/RouterTestingHarness#properties) which access the [`DebugElement`](https://angular.io/api/core/DebugElement) and [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) corresponding to the component currently activated by the test root component's [`RouterOutlet`](https://angular.io/api/router/RouterOutlet).

[`RouterTestingHarness`](https://next.angular.io/api/router/testing/RouterTestingHarness) has a [`detectChanges`](https://next.angular.io/api/router/testing/RouterTestingHarness#detectchanges) method which calls [`ComponentFixture#detectChanges`](https://angular.io/api/core/testing/ComponentFixture#detectChanges) for the test root component.

The [`RouterTestingHarness#navigateByUrl`](https://next.angular.io/api/router/testing/RouterTestingHarness#navigatebyurl) method wraps [`Router#navigateByUrl`](https://angular.io/api/router/Router#navigatebyurl) and resolves the component activated by that navigation.

That's all the background we need. Let's explore a [`RouterTestingHarness`](https://next.angular.io/api/router/testing/RouterTestingHarness) version of the integrated routed component test for the `DashboardComponent` from [the Tour of Heroes Router tutorial](https://angular.io/guide/router-tutorial-toh).

## Integrated routing component test suite

```typescript
import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { Component } from '@angular/core';
import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { asapScheduler, of } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';
import { DashboardComponent } from './dashboard.component';

async function setup() {
  const fakeService = {
    getHeroes() {
      return of([...HEROES]).pipe(observeOn(asapScheduler));
    },
  } as Partial<HeroService>;

  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {
          path: '',
          pathMatch: 'full',
          component: DashboardComponent,
        },
        {
          path: 'detail/:id',
          component: TestHeroDetailComponent,
        },
      ]),
      provideLocationMocks(),
      { provide: HeroService, useValue: fakeService },
    ],
  });

  const harness = await RouterTestingHarness.create(); // [1]
  const location = TestBed.inject(Location);

  return {
    advance() {
      tick();
      harness.detectChanges();
    },
    clickTopHero() {
      const firstHeroLink = harness.routeDebugElement.query(
        By.css('a')
      );

      firstHeroLink.triggerEventHandler('click', {
        button: leftMouseButton,
      });
    },
    harness,
    location,
  };
}

@Component({
  standalone: true,
  template: '',
})
class TestHeroDetailComponent {}

const leftMouseButton = 0;

describe('DashboardComponent (integrated)', () => {
  it('navigates to the detail view when a hero link is clicked', fakeAsync(async () => {
    const { advance, clickTopHero, harness, location } =
      await setup();
    const component /* [2] */ = await harness.navigateByUrl(
      '/',
      DashboardComponent // [3]
    );
    const [topHero] = component.heroes;

    clickTopHero();
    advance();

    const expectedPath = '/detail/' + topHero.id;
    expect(location.path())
      .withContext(
        'must navigate to the detail view for the top hero'
      )
      .toBe(expectedPath);
  }));
});
```

(1) Notice how we only call [`RouterTestingHarness.create`](https://next.angular.io/api/router/testing/RouterTestingHarness#create) once per test case in our `setup` SIFERS.

> ⚠️ Warning
> [`ModuleTeardownOptions#destroyAfterEach`](https://angular.io/api/core/testing/ModuleTeardownOptions#properties) must be set to `true` for [`RouterTestingHarness`](https://next.angular.io/api/router/testing/RouterTestingHarness) to work correctly. See [Improving Angular tests by enabling Angular testing module teardown](https://dev.to/playfulprogramming-angular/improving-angular-tests-by-enabling-angular-testing-module-teardown-38kh) for details on this option.

(1) We could have passed an initial URL, for example `await RouterTestingHarness.create("/")` or `await RouterTestingHarness.create("/heroes")` but it doesn't return an activated component.

(2) `RouterTestingHarness#navigateByUrl` resolves an activated component and optionally accepts the type (class) of the activated component we expect (3). If the component activated by that navigation is not of the expected type, an error is thrown.

[The full test suite is available in this Gist](https://gist.github.com/LayZeeDK/e2350b4f839effac80d84fabd4840c39).

## Summary

Let's sum up what we learned in this article:

- [`RouterTestingHarness`](https://next.angular.io/api/router/testing/RouterTestingHarness) (introduced by Angular version 15.2) is a testing harness specifically for interacting with Angular Router-related APIs in tests
- [`provideRouter`](https://angular.io/api/router/provideRouter) (introduced by Angular version 14.2) is the standalone version of [`RouterModule.forRoot`](https://angular.io/api/router/RouterModule#forroot).
- [`provideLocationMocks`](https://angular.io/api/common/testing/provideLocationMocks) (introduced by Angular version 15.0) is the standalone version of [`RouterTestingModule`](https://angular.io/api/router/testing/RouterTestingModule)
- The standalone version of [`RouterTestingModule.withRoutes`](https://angular.io/api/router/testing/RouterTestingModule#withroutes) is [`provideRouter`](https://angular.io/api/router/provideRouter) and [`provideLocationMocks`](https://angular.io/api/common/testing/provideLocationMocks) combined.

[`RouterTestingHarness.create`](https://next.angular.io/api/router/testing/RouterTestingHarness#create) creates an initializes a test root component with a router outlet. It must only be called once per test case and requires [`ModuleTeardownOptions#destroyAfterEach`](https://angular.io/api/core/testing/ModuleTeardownOptions#properties) to be set to `true`. It optionally accepts an initial URL.

[`RouterTestingHarness#navigateByUrl`](https://next.angular.io/api/router/testing/RouterTestingHarness#navigatebyurl) accepts a URL for navigation and optionally the expected type of the component activated by that navigation. The activated component is resolved by the method call.

[`RouterTestingHarness#detectChanges`](https://next.angular.io/api/router/testing/RouterTestingHarness#detectchanges) triggers a change detection cycle starting at the test root component.
