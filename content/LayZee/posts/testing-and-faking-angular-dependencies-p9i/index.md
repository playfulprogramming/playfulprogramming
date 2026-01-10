---
{
title: "Testing and faking Angular dependencies",
published: "2021-03-24T13:34:23Z",
edited: "2021-03-26T14:20:51Z",
tags: ["angular", "testing", "dependencyinjection"],
description: "Learn the ins an outs of Angular dependency injection in automated tests.",
originalLink: "https://dev.to/this-is-angular/testing-and-faking-angular-dependencies-p9i",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11940",
order: 1
}
---

*Let’s prepare our experimental gear. Cover photo by [deepakrit](https://pixabay.com/photos/chemistry-lab-experiment-chemist-3533039/) on Pixabay.*

*Original publication date: 2019-04-29.*

Dependency injection is a key feature of Angular. This flexible approach makes our declarables and class-based services easier to test in isolation.

[Tree-shakable dependencies](https://dev.to/this-is-angular/tree-shakable-dependencies-in-angular-projects-1ifg) remove the layer of indirection that is Angular modules, but how do we test their tree-shakable providers? We’ll test value factories that depend on injection tokens for platform-specific APIs.

Some components have browser-specific features. Together, we’ll test a banner that notifies our user that we’re ending Internet Explorer 11 support. A proper test suite can give us enough confidence that we won’t even have to test the banner in Internet Explorer 11.

Just kidding! We have to be careful not to get overly confident about complex integration scenarios. We should always make sure to perform QA (Quality Assurance) tests in environments as close to production as possible. This means running the application in a ****real**** Internet Explorer 11 browser.

The Angular testing utilities enable us to fake dependencies for the purpose of testing. We’ll explore different options of configuring and resolving dependencies in an Angular testing environment using the Angular CLI’s testing framework of choice, Jasmine.

Through examples, we’ll explore component fixtures, component initialisation, custom expectations, emulated events. We’ll even create custom test harnesses for very thin but explicit test cases.

## Faking dependency injection tokens used in token providers

In “[Tree-shakable dependencies in Angular projects](https://dev.to/this-is-angular/tree-shakable-dependencies-in-angular-projects-1ifg)”, we created a dependency injection token that evaluates to a flag indicating whether the current browser is Internet Explorer 11.

```ts
// user-agent.token.ts
import { InjectionToken } from '@angular/core';

export const userAgentToken: InjectionToken<string> =
  new InjectionToken('User agent string', {
    factory: (): string => navigator.userAgent,
    providedIn: 'root',
  });
```

```ts
// is-internet-explorer-11.token.ts
import { inject, InjectionToken } from '@angular/core';

import { userAgentToken } from './user-agent.token';

export const isInternetExplorer11Token: InjectionToken<boolean> =
  new InjectionToken('Internet Explorer 11 flag', {
    factory: (): boolean =>
      /Trident\/7\.0.+rv:11\.0/.test(inject(userAgentToken)),
    providedIn: 'root',
  });
```

<figcaption>_The user agent token factory provider reads directly from the global navigator object._</figcaption>

To test the Internet Explorer 11 flag provider in isolation, we can replace the `userAgentToken` with a fake value. We’ll practice that technique later in this article.

We notice that the user agent string provider extracts the relevant information from the platform-specific [Navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator). For the sake of learning, let’s say that we’re going to need other information from the same global `navigator` object. Depending on the test runner we use, the Navigator API might not even be available in the testing environment.

To be able to create fake navigator configurations, we create a dependency injection token for the Navigator API. We can use these fake configurations to simulate user contexts during development and testing.

```ts
// user-agent.token.ts
import { inject, InjectionToken } from '@angular/core';

import { navigatorToken } from './navigator.token';

export const userAgentToken: InjectionToken<string> =
  new InjectionToken('User agent string', {
    factory: (): string => inject(navigatorToken).userAgent,
    providedIn: 'root',
  });
```

```ts
// navigator.token.ts
import { InjectionToken } from '@angular/core';

export const navigatorToken: InjectionToken<Navigator> =
  new InjectionToken('Navigator API', {
    factory: (): Navigator => navigator,
    providedIn: 'root',
  });
```

<figcaption>_The global navigator object is abstracted into a Navigator API token._</figcaption>

**What** we test and **how** we test it should be part of our testing strategy. In more integrated component tests, we should be able to rely on most of the providers created as part of our dependency injection tokens. We’ll explore this later when testing the Internet Explorer 11 banner component.

> WHAT we test and HOW we test it should be part of our testing strategy.

For our first test, we’re going to provide a fake value for the Navigator API token which is used as a dependency in the factory provider for the user agent string token.

To replace a token provider for testing purposes, we add an overriding provider in the Angular testing module similar to how an Angular module’s own providers override those of an imported Angular module.

```ts
// navigator-api.spec.ts
import { inject, TestBed } from '@angular/core/testing';

import { navigatorToken } from './navigator.token';
import { userAgentToken } from './user-agent.token';

describe('Navigator API', () => {
  describe('User agent string', () => {
    describe('Provider', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            {
              provide: navigatorToken,
              useValue: {
                userAgent: 'Fake browser',
              },
            },
          ],
        });
      });

      it(
        'extracts the user agent string from the Navigator API token',
        inject([userAgentToken], (userAgent: string) => {
          expect(userAgent).toBe('Fake browser');
        }));
    });
  });
});
```

<figcaption>_Replacing a token dependency in a factory provider for the user agent string._</figcaption>

Note that while it’s the user agent token and its provider we’re testing, it’s the navigator token dependency we’re replacing with a fake value.

### Resolving dependencies using the `inject` function

The Angular testing utilities give us more than one way to resolve a dependency. In this test, we use the `[inject](https://angular.io/api/core/testing/inject)` function from the `@angular/core/testing` package (****not**** the one from `@angular/core`).

The `inject` function allows us to resolve multiple dependencies by listing their tokens in an array that we pass as an argument. Every dependency injection token is resolved and available to the test case function as a parameter.

I have created [a StackBlitz project with all the tests](https://stackblitz.com/edit/testing-and-faking-angular-dependencies) from this article running in Jasmine. As seen in the test report, the test works. We have successfully faked the native Navigator API for the purpose of testing.

### Gotchas when using the Angular testing function `inject`

When we are using the Angular testing module without declarables, we can usually override a provider several times even within the same test case. We’ll examine an example of that later in this article.

It’s worth noting that this is not the case when using the Angular testing function `[inject](https://angular.io/api/core/testing/inject)`. It resolves dependencies just before the test case function body is executed.

We can replace the token provider in `beforeAll` and `beforeEach` hooks using the static methods `TestBed.configureTestingModule` and `TestBed.overrideProvider`. But we can’t vary the provider between test cases or replace it during a test case when we use the `inject` testing function to resolve dependencies.

### Resolving dependency injection tokens using `TestBed`

A more flexibly way of resolving Angular dependencies in tests without declarables is to use the static method `TestBed.get`. We simply pass the dependency injection token we want to resolve, from anywhere in a test case function or a test lifecycle hook.

Let’s look at another example of a native browser API that we abstract using a dependency injection token for the purpose of development and testing.

```ts
// location.token.ts
import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const locationToken: InjectionToken<Location> =
  new InjectionToken('Location API', {
    factory: (): Location => inject(DOCUMENT).location,
    providedIn: 'root',
  });
```

```ts
// location-api.spec.ts
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { locationToken } from './location.token';

describe('Location API', () => {
  describe('Provider', () => {
    it('extracts the location from the DOCUMENT token', () => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: {
              location: {
                href: 'Fake URL',
              },
            },
          },
        ],
      });

      const location: Location = TestBed.get(locationToken);

      expect(location.href).toBe('Fake URL');
    });
  });
});
```

<figcaption>_Replacing a token dependency in a factory provider for the Location API._</figcaption>

The factory in the token’s provider is extracted from the `DOCUMENT` token which is available from the `@angular/common` package and abstracts the global `document` object.

In this test suite, we configure the Angular testing module inside the test case. I think it better illustrates the token dependency that we want to exercise in this test.

We make the Angular dependency injection system resolve the [Location API](https://developer.mozilla.org/en-US/docs/Web/API/Location) by using the static `TestBed.get` method. As demonstrated in [the StackBlitz testing project](https://stackblitz.com/edit/testing-and-faking-angular-dependencies), the document token is successfully faked and used to resolve the token-under-test using its real factory provider.

### Gotchas when resolving dependencies using `TestBed`

In the previous test, we replaced the document with a fake object by providing it for the `DOCUMENT` token in the Angular testing module. If we hadn’t done that, Angular would’ve provided the global `document` object.

Additionally, if we wanted to test different document configurations, we wouldn’t be able to do so, had we not created a testing provider for the document token.

In the case that we add a testing provider using `TestBed.configureTestingModule`, we can use the static method `TestBed.overrideProvider` to replace it with different fake values in various test cases. We’ll use this technique to create test harnesses when testing Internet Explorer 11 detection and the Internet Explorer 11 banner component.

Note that this is only possible because we don’t use declarables. As soon as we call `TestBed.createComponent`, the Angular testing platform dependencies are locked.

## Testing value factories with dependencies

In the first section of this article, we introduced a token with a value factory in its provider. The value factory evaluates whether the user agent string represents an Internet Explorer 11 browser.

To test the browser detection in the value factory, we gather a few user agent strings from real browsers and put them in an enum.

```ts
// fake-user-agent.ts
export enum FakeUserAgent {
  Chrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
  InternetExplorer10 = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
  InternetExplorer11 = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko',
  Firefox = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0',
}
```

<figcaption>_User agent strings of common browsers._</figcaption>

In the Internet Explorer 11 detection test suite, we’ll test the `isInternetExplorer11Token` almost in isolation. But the real business logic value lies in its factory provider which depends on the user agent token.

The user agent token extracts its value from the Navigator API token, but that dependency has already been covered by the Navigator API test suite. We’ll pick the user agent token as the adequate place in the dependency chain to start faking dependencies.

```ts
// internet-explorer-11-detection.spec.ts
import { TestBed } from '@angular/core/testing';

import { isInternetExplorer11Token } from './is-internet-explorer-11.token';
import { FakeUserAgent } from './fake-user-agent';
import { userAgentToken } from './user-agent.token';

describe('Internet Explorer 11 detection', () => {
  function setup({ userAgent }: { userAgent: string }) {
    TestBed.overrideProvider(userAgentToken, { useValue: userAgent });

    return {
      isInternetExplorer11: TestBed.get(isInternetExplorer11Token),
    };
  }

  const nonInternetExplorerUserAgents: ReadonlyArray<string> =
    Object.entries(FakeUserAgent)
      .filter(([browser]) =>
        !browser.toLowerCase().includes('internetexplorer'))
      .map(([_browser, userAgent]) => userAgent);

  it('accepts an Internet Explorer 11 user agent', () => {
    const { isInternetExplorer11 } = setup({
      userAgent: FakeUserAgent.InternetExplorer11,
    });

    expect(isInternetExplorer11).toBe(true);
  });

  it('rejects an Internet Explorer 10 user agent', () => {
    const { isInternetExplorer11 } = setup({
      userAgent: FakeUserAgent.InternetExplorer10,
    });

    expect(isInternetExplorer11).toBe(false);
  });

  it('rejects other user agents', () => {
    nonInternetExplorerUserAgents.forEach(userAgent => {
      const { isInternetExplorer11 } = setup({ userAgent });

      expect(isInternetExplorer11).toBe(
        false,
        `Expected to reject user agent: "${userAgent}"`);
    });
  });
});
```

<figcaption>_Internet Explorer 11 detection test suite._</figcaption>

Before specifying the test cases, we create a test setup function and reduce an array of the non-Internet Explorer user agent strings from our fake user agent strings.

The test setup function takes a user agent and uses it to fake the user agent token provider. We then return an object with a property `isInternetExplorer11` having a value that is evaluated from the `isInternetExplorer11Token` through the `TestBed.get` method.

Let’s test the happy path first. We pass an Internet Explorer 11 user agent string and expect the token-under-test to evaluate to `true` through Angular’s dependency injection system. As seen in [the StackBlitz testing project](https://stackblitz.com/edit/testing-and-faking-angular-dependencies?file=src%2Fapp%2Finternet-explorer%2Finternet-explorer-11-detection.spec.ts), the browser detection works as expected.

What happens when the user browses with Internet Explorer 10? Our test suite demonstrates that Internet Explorer 11 does not result in a false positive in this case.

In other words, the token-under-test evaluates to `false` when an Internet Explorer 10 user agent string is provided in the dependee token. If this is not the intended usage, we’d need to change the detection logic. Now that we’ve got a test, it’d be easy to demonstrate when that change would become successful.

The final test exercises the browser detection on non-Internet Explorer browsers defined by the `FakeUserAgent` enum. The test case loops through the user agent strings, fakes the user agent provider, evaluates the `isInternetExplorer11Token` and expect its value to be `false`. If that is not the case, a useful error message is displayed by the test runner.

## Faking dependencies in component tests

Now that we are satisfied with our Internet Explorer 11 browser detection, creating and displaying a deprecation banner is straightforward.

```html
<!-- internet-explorer-11-banner.component.html -->
<aside *ngIf="isBannerVisible">
  Sorry, we will not continue to support Internet Explorer 11.<br />
  Please upgrade to Microsoft Edge.<br />

  <button (click)="onDismiss()">
    Dismiss
  </button>
</aside>
```

```ts
// internet-explorer-11-banner.component.ts
import { Component, Inject } from '@angular/core';

import { isInternetExplorer11Token } from './is-internet-explorer-11.token';

@Component({
  selector: 'internet-explorer-11-banner',
  templateUrl: './internet-explorer-11-banner.component.html',
})
export class InternetExplorer11BannerComponent {
  private isDismissed = false;

  get isBannerVisible() {
    return this.isInternetExplorer11 && !this.isDismissed;
  }

  constructor(
    @Inject(isInternetExplorer11Token) private isInternetExplorer11: boolean,
  ) {}

  onDismiss() {
    this.isDismissed = true;
  }
}
```

<figcaption>_Internet Explorer 11 deprecation banner._</figcaption>

We enable the user to dismiss the banner. It’s displayed if the user agent (the browser) is Internet Explorer 11 and the user hasn’t yet dismissed the banner by clicking the banner button.

![](./v0ze5bd16nxj1kb9h8sr.png)

*Dismissable Internet Explorer 11 deprecation banner.*

The dismissed state is simply stored as local UI state in a private component property which is used by the computed property `isBannerVisible`.

The banner component has a single dependency—the `isInternetExplorer11Token` which is evaluated to a Boolean value. This Boolean value is injected through the banner component constructor because of the `Inject` decorator.

### Testing the banner component

To test the banner component, we could simply fake the `isInternetExplorer11Token` since it’s a direct dependency. However, integration tests that exercise multiple modules give us even more confidence in our components.

Instead, we will fake the `userAgentToken` by providing a value from the `FakeUserAgent` enumeration. From previous tests, we know that this chain of dependencies works.

There are 3 features we’d like to exercise in our tests:

- When the user agent is Internet Explorer 11, the banner is displayed
- When the user clicks the banner button, the banner is dismissed
- When any other browser than Internet Explorer 11 is used, the banner is hidden

To have concise tests, we’ll create a test harness that enables us to:

- Fake the user agent
- Check the banner visibility
- Click the dismiss button

This is how we want the test cases to look:

```ts
// internet-explorer-11-banner.component.spec.ts
describe('Internet Explorer 11', () => {
  it('displays a banner', () => {
    const { expectBannerToBeDisplayed } = setup({
      userAgent: FakeUserAgent.InternetExplorer11,
    });

    expectBannerToBeDisplayed();
  });

  it('the banner is dismissable', () => {
    const { clickDismissButton, expectBannerToBeHidden } = setup({
      userAgent: FakeUserAgent.InternetExplorer11
    });

    clickDismissButton();

    expectBannerToBeHidden();
  });
});


describe('Other browsers', () => {
  it('hides the banner', () => {
    const { expectBannerToBeHidden } = setup({
      userAgent: FakeUserAgent.Chrome,
    });

    expectBannerToBeHidden();
  });
});
```

<figcaption>_Test cases for the Internet Explorer 11 deprecation banner component._</figcaption>

The test harness is returned by our custom `setup` function. We’ll look at the implementation in a few seconds.

First, I want you to notice, that we only test Internet Explorer 11 and one other browser. We already covered browser detection of all our supported browsers in the test suite demonstrated by the section “Testing value factories with dependencies”.

Okay, let’s explore how the test harness is created.

```ts
// internet-explorer-11-banner.component.spec.ts
function setup({ userAgent }: { userAgent: string }) {
  TestBed.overrideProvider(userAgentToken, { useValue: userAgent });

  const fixture = TestBed.createComponent(InternetExplorer11BannerComponent);
  fixture.detectChanges();

  const readBannerText = () =>
    (fixture.nativeElement as HTMLElement).textContent.trim();

  return {
    clickDismissButton() {
      const buttonDebug = fixture.debugElement.query(By.css('button'));

      buttonDebug.triggerEventHandler('click', {});
      fixture.detectChanges();
    },
    expectBannerToBeDisplayed() {
      expect(readBannerText().toLowerCase())
        .toContain('please upgrade', 'Expected banner to be displayed');
    },
    expectBannerToBeHidden() {
      expect(readBannerText()).toBe('', 'Expected banner to be hidden');
    },
  };
}
```

<figcaption>_Test harness for the Internet Explorer 11 deprecation banner component._</figcaption>

If you are familiar with the Angular testing utilities, this should be pretty straightforward.

We fake the user agent token with the passed parameter. Then we create a component fixture for the banner component and initialise it by triggering change detection.

Finally, we create a couple of expectations to verify the banner visibility and a function to emulate a click of the dismiss button. These utilities are returned as methods on the test harness object.

You might wonder how we can create a component fixture without configuring the testing module. Don’t worry, we just need to make sure that the testing module is configured prior to calling the `setup` function. We’ll do this using the test case setup hook called `beforeEach`.

```ts
// user-agent.token.ts
import { InjectionToken } from '@angular/core';

export const userAgentToken: InjectionToken<string> =
  new InjectionToken('User agent string', {
    factory: (): string => navigator.userAgent,
    providedIn: 'root',
  });
```

```ts
// is-internet-explorer-11.token.ts
import { inject, InjectionToken } from '@angular/core';

import { userAgentToken } from './user-agent.token';

export const isInternetExplorer11Token: InjectionToken<boolean> =
  new InjectionToken('Internet Explorer 11 flag', {
    factory: (): boolean =>
      /Trident\/7\.0.+rv:11\.0/.test(inject(userAgentToken)),
    providedIn: 'root',
  });
```

```ts
// internet-explorer-11-banner.component.ts
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  InternetExplorer11BannerComponent,
} from './internet-explorer-11-banner.component';
import { InternetExplorerModule } from './internet-explorer.module';
import { FakeUserAgent } from './fake-user-agent';
import { userAgentToken } from './user-agent.token';

describe(InternetExplorer11BannerComponent.name, () => {
  function setup({ userAgent }: { userAgent: string }) {
    TestBed.overrideProvider(userAgentToken, { useValue: userAgent });

    const fixture = TestBed.createComponent(InternetExplorer11BannerComponent);
    fixture.detectChanges();

    const readBannerText = () =>
      (fixture.nativeElement as HTMLElement).textContent.trim();

    return {
      clickDismissButton() {
        const buttonDebug = fixture.debugElement.query(By.css('button'));

        buttonDebug.triggerEventHandler('click', {});
        fixture.detectChanges();
      },
      expectBannerToBeDisplayed() {
        expect(readBannerText().toLowerCase())
          .toContain('please upgrade', 'Expected banner to be displayed');
      },
      expectBannerToBeHidden() {
        expect(readBannerText()).toBe('', 'Expected banner to be hidden');
      },
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InternetExplorerModule],
      providers: [
        { provide: userAgentToken, useValue: 'No user agent' },
      ],
    }).compileComponents();
  }));

  describe('Internet Explorer 11', () => {
    it('displays a banner', () => {
      const { expectBannerToBeDisplayed } = setup({
        userAgent: FakeUserAgent.InternetExplorer11,
      });

      expectBannerToBeDisplayed();
    });

    it('the banner is dismissable', () => {
      const { clickDismissButton, expectBannerToBeHidden } = setup({
        userAgent: FakeUserAgent.InternetExplorer11
      });

      clickDismissButton();

      expectBannerToBeHidden();
    });
  });

  describe('Other browsers', () => {
    it('hides the banner', () => {
      const { expectBannerToBeHidden } = setup({
        userAgent: FakeUserAgent.Chrome,
      });

      expectBannerToBeHidden();
    });
  });
});
```

<figcaption>_Test suite for the Internet Explorer 11 deprecation banner component._</figcaption>

Putting it all together, we end up with simple test cases with very explicitly defined setup, exercise, and verification phases.

At this point, we should ask ourselves whether we feel confident enough that the deprecation banner is displayed, without testing it in an actual Internet Explorer 11 browser.

## Summary

In this article, we demonstrated how to test and fake tree-shakable dependencies in an Angular project. We also tested value factories with dependencies on platform-specific APIs.

During this process, we investigated gotchas when using the `inject` testing function to resolve dependencies. Using `TestBed`, we resolved dependency injection tokens and explored gotchas for this approach.

We tested the Internet Explorer 11 deprecation banner in many ways, to the degree that there should barely be a need to test it in the actual browser. We faked its dependencies in its component test suite, but as we discussed, we should always test it in a real browser target for complex integration scenarios.

Explore the options that Angular’s dependency injection enable us to do during development in “[Faking dependencies in Angular applications](https://dev.to/this-is-angular/faking-dependencies-in-angular-applications-4d2f)”.

## Resources

The application that we used to demonstrate how to fake dependencies in Angular applications is in [a StackBlitz project](https://stackblitz.com/edit/testing-and-faking-angular-dependencies-app).

The test suite for the application which tests and also fakes Angular dependencies is in [a separate StackBlitz project](https://stackblitz.com/edit/testing-and-faking-angular-dependencies).

Microsoft’s [Modern.IE](http://modern.ie/) domain has free resources for generating browser snapshots with Internet Explorer. It also offers free virtual machine images with Internet Explorer running on Windows 7 or 8.1.

## Related articles

We’ll create a browser faker to test the banner component during development in “[Faking dependencies in Angular applications](https://dev.to/this-is-angular/faking-dependencies-in-angular-applications-4d2f)”.

Learn how to provide tree-shakable dependencies and other complicated configurations of Angular dependency injection in “[Tree-shakable dependencies in Angular projects](https://dev.to/this-is-angular/tree-shakable-dependencies-in-angular-projects-1ifg)”. This is the article that our application is based on.

## Reviewers

These wonderful people from the Angular community helped review this article:

- [Alex Okrushko](https://dev.to/alexokrushko)
- [Andrew Grekov](https://dev.to/thekiba)
- [Brad Taniguchi](https://github.com/bradtaniguchi)
- [Christian Lüdemann](https://dev.to/chrislydemann)
- [Mahmoud Abduljawad](https://twitter.com/mahmoud_ajawad)
- [Max Koretskyi](https://twitter.com/maxkoretskyi)
- [Nicholas Jamieson](https://dev.to/cartant)
- [Shai Reznik](https://twitter.com/shai_reznik)
- [Wassim Chegham](https://dev.to/wassimchegham)
