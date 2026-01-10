---
{
title: "Faking dependencies in Angular applications",
published: "2021-03-24T13:44:32Z",
edited: "2021-03-26T14:21:21Z",
tags: ["angular", "dependencyinjection", "testing"],
description: "Create components and directives for manual tests.",
originalLink: "https://dev.to/this-is-angular/faking-dependencies-in-angular-applications-4d2f",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11940",
order: 1
}
---


*Experimental props. Cover photo by [rawpixel.com](https://www.pexels.com/photo/assorted-color-flowers-951233/) on Pexels.*

*Original publication date: 2019-05-07.*

Using the power of Angular’s dependency injection system, we can fake specific use cases. This is useful for automated tests, but in this article, we’ll look at a way to use it for manual testing.

In “[Testing and faking Angular dependencies](https://dev.to/this-is-angular/testing-and-faking-angular-dependencies-p9i)”, we created an Internet Explorer 11 deprecation banner component and added test suites. We didn’t test it in an actual Internet Explorer 11 browser yet.

To make life easier for ourselves, we’ll create a browser faker component that’s only enabled in development mode thanks to a custom structural directive. For fun, we’ll add text pipes to use common string operations in our component templates.

## Simulating a browser environment

While we should always test in our actual browser targets—in this case Internet Explorer 11, we might want the convenience of easily simulating other browser environments during development without leaving our browser of choice.

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

_Deprecation banner with primitive value dependency._

Currently, the deprecation banner component has a direct dependency on the `isInternetExplorer11Token`. Replacing a dependency with another value dynamically would require us to intercept the injector chain with a conditionally inserted ancestor component or directive.

### Dynamically replacing a dependency using a class-based service

The user agent token factory is only evaluated once per module injector and if it’s not replaced in an element injector provided by an ancestor component or directive, we have to use another technique to fake the dependency. We’ll replace the dependency injection token dependency with a class-based service dependency.

```ts
// internet-explorer-11-banner.component.ts
import { Component } from '@angular/core';

import { InternetExplorerService } from './internet-explorer.service';

@Component({
  selector: 'internet-explorer-11-banner',
  templateUrl: './internet-explorer-11-banner.component.html',
})
export class InternetExplorer11BannerComponent {
  private isDismissed = false;

  get isBannerVisible() {
    return this.internetExplorer.isInternetExplorer11State && !this.isDismissed;
  }

  constructor(
    private internetExplorer: InternetExplorerService,
  ) {}

  onDismiss() {
    this.isDismissed = true;
  }
}
```

```ts
// internet-explorer-service.ts
import { Inject, Injectable } from '@angular/core';

import { userAgentToken } from './user-agent.token';

@Injectable({
  providedIn: 'root',
})
export class InternetExplorerService {
  get isInternetExplorer11State(): boolean {
    return this.isInternetExplorer11(this.userAgent);
  }

  constructor(
    @Inject(userAgentToken) private userAgent: string,
  ) {}

  isInternetExplorer11(userAgent: string): boolean {
    return /Trident\/7\.0.+rv:11\.0/.test(userAgent);
  }
}
```

_Extracting the Internet Explorer 11 detection to a service._

First, we extract the Internet Explorer 11 detection from the dependency injection token to our newly created `InternetExplorerService` class. The Internet Explorer 11 detection token now delegates to the service when evaluating its value based on the user agent.

At this point, the application should still be working. Unfortunately, we broke the test suite, so we restructure it to use the Internet Explorer service.

```ts
// internet-explorer-11-detection.spec.ts
import { TestBed } from '@angular/core/testing';

import { InternetExplorerService } from './internet-explorer.service';
import { FakeUserAgent } from './fake-user-agent';

describe('Internet Explorer 11 detection', () => {
  function setup({ userAgent }: { userAgent: string }) {
    const service: InternetExplorerService =
      TestBed.get(InternetExplorerService);

    return {
      isInternetExplorer11: service.isInternetExplorer11(userAgent),
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

_Internet Explorer 11 detection test suite restructured to use the Internet Explorer service._

As already mentioned, we won’t dynamically replace the user agent token declaratively in a template using an element injector. Instead, we’ll change the state imperatively.

## Creating an observable state

Instead of the user agent token, we’ll make the Internet Explorer service depend on an observable which it’ll get from a separate browser service.

```ts
// internet-explorer.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrowserService } from './browser.service';

@Injectable({
  providedIn: 'root',
})
export class InternetExplorerService {
  isInternetExplorer11$: Observable<boolean> =
    this.browser.userAgent$.pipe(
      map(userAgent => this.isInternetExplorer11(userAgent)),
    );

  constructor(
    private browser: BrowserService,
  ) {}

  isInternetExplorer11(userAgent: string): boolean {
    return /Trident\/7\.0.+rv:11\.0/.test(userAgent);
  }
}
```

```ts
// browser.service.ts

import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { FakeUserAgent } from './fake-user-agent';
import { userAgentToken } from './user-agent.token';

@Injectable({
  providedIn: 'root',
})
export class BrowserService implements OnDestroy {
  private userAgent = new BehaviorSubject(this.realUserAgent);

  userAgent$ = this.userAgent.pipe(
    distinctUntilChanged(),
  );

  constructor(
    @Inject(userAgentToken) private realUserAgent: string,
  ) {}

  ngOnDestroy() {
    this.userAgent.complete();
  }

  fakeUserAgent(value: FakeUserAgent) {
    this.userAgent.next(FakeUserAgent[value]);
  }

  stopFakingUserAgent() {
    this.userAgent.next(this.realUserAgent);
  }
}
```

_Observable browser state in a class-based service._

We store the current user agent state in a `BehaviorSubject<string>` which is exposed in the observable `userAgent$` property of `BrowserService`. The whole application should depend on this observable when it needs the user agent.

Initially, the behaviour subject is hydrated with the real user agent string from the user agent token. This value is also stored for later use, since we allow to change the browser state through two commands.

We expose the `fakeUserAgent` method which sets the user agent state to a fake user agent string. Additionally, we allow a dependee to call the `stopFakingUserAgent` method which resets the user agent state to the real user agent string.

To keep a tidy ship, we even remember to complete the behaviour subject if the service is ever destroyed.

The Internet Explorer service now exposes an observable property called `isInternetExplorer11$` which is evaluated whenever the observable user agent property of the browser service emits a value.

All we need now is to have the deprecation banner component depend on the observable Internet Explorer 11 detection property instead of the regular property which we replaced.

```html
<!-- internet-explorer-11-banner.component.html -->
<aside *ngIf="isBannerVisible$ | async">
  Sorry, we will not continue to support Internet Explorer 11.<br />
  Please upgrade to Microsoft Edge.<br />

  <button (click)="onDismiss()">
    Dismiss
  </button>
</aside>
```

```ts
// internet-explorer-11-banner.component.ts
import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { InternetExplorerService } from './internet-explorer.service';

@Component({
  host: { style: 'display: block;' },
  selector: 'internet-explorer-11-banner',
  templateUrl: './internet-explorer-11-banner.component.html',
})
export class InternetExplorer11BannerComponent {
  private isDismissed = new BehaviorSubject(false);

  isBannerVisible$ = combineLatest(
    this.internetExplorer.isInternetExplorer11$,
    this.isDismissed,
  ).pipe(
    map(([isInternetExplorer11, isDismissed]) =>
      isInternetExplorer11 && !isDismissed),
  );

  constructor(
    private internetExplorer: InternetExplorerService,
  ) {}

  onDismiss(): void {
    this.isDismissed.next(true);
  }
}
```

_Deprecation banner component using observable state._

In the deprecation banner component, we replace the Boolean `isDismissed` property with a `BehaviorSubject<boolean>` which is initially cleared (set to `false`). We now have an observable `isBannerVisible$` property which is a combination of the observable state from `isDismissed` and `InternetExplorerService#isInternetExplorer11$`. The UI behaviour logic is similar to before, except it’s now expressed as part of the observable pipeline.

Instead of assigning a Boolean value to a property, the `onDismiss` event handler now emits a Boolean value through the `isDismissed` behaviour subject.

At this point, the application behaves exactly the way it did before we introduced the Internet Explorer service and the browser service. We have the browser state change commands, but we need some mechanism to trigger them.

For this purpose, we will develop a browser faker component that enables us to fake a browser environment for the rest of the application.

```html
<!-- browser-faker.component.html -->
<label>
  Fake a browser

  <select [formControl]="selectedBrowser">
    <option value="">
      My browser
    </option>

    <option *ngFor="let browser of browsers"
      [value]="browser">
      {{browser | replace:wordStartPattern:' $&' | trim}}
    </option>
  </select>
</label>
```

```ts
// browser-faker.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { BrowserService } from './browser.service';
import { FakeUserAgent } from './fake-user-agent';

@Component({
  host: { style: 'display: block;' },
  selector: 'browser-faker',
  templateUrl: './browser-faker.component.html',
})
export class BrowserFakerComponent implements OnDestroy, OnInit {
  private defaultOptionValue = '';
  private destroy = new Subject<void>();
  private fakeBrowserSelection$: Observable<FakeUserAgent>;
  private realBrowserSelection$: Observable<void>;

  browsers = Object.keys(FakeUserAgent);
  selectedBrowser = new FormControl(this.defaultOptionValue);
  wordStartPattern = /[A-Z]|\d+/g;

  constructor(
    private browser: BrowserService,
  ) {
    this.realBrowserSelection$ = this.selectedBrowser.valueChanges.pipe(
      filter(value => value === this.defaultOptionValue),
      takeUntil(this.destroy),
    );
    this.fakeBrowserSelection$ = this.selectedBrowser.valueChanges.pipe(
      filter(value => value !== this.defaultOptionValue),
      takeUntil(this.destroy),
    );
  }

  ngOnInit(): void {
    this.bindEvents();
  }

  ngOnDestroy() {
    this.unbindEvents();
  }

  private bindEvents(): void {
    this.fakeBrowserSelection$.subscribe(userAgent =>
      this.browser.fakeUserAgent(userAgent));
    this.realBrowserSelection$.subscribe(() =>
      this.browser.stopFakingUserAgent());
  }

  private unbindEvents(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
```

_Browser faker component._

The browser faker component injects the browser service. It has a single form control that is bound to a native `<select>` control. When a browser is selected, we start faking its user agent through the browser service. When the default browser option is selected, we stop faking a user agent.

---

As part of the application we’re testing, I created [a range of text pipes for component templates](https://stackblitz.com/edit/testing-and-faking-angular-dependencies?file=src%2Fapp%2Ftext%2Ftext.module.ts). For example, the `replace` and `trim` pipes used by the browser faker component.

---

Now we have a browser faker component, but we only want it to be enabled during development. Let’s create a structural directive that is conditionally rendered in development mode only.

```ts
// is-development-mode.token.ts
import { InjectionToken, isDevMode } from '@angular/core';

export const isDevelopmentModeToken: InjectionToken<boolean> =
  new InjectionToken('Development mode flag', {
    factory: (): boolean => isDevMode(),
    providedIn: 'root',
  });
```

```ts
// development-only.directive.ts
import {
  Directive,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { isDevelopmentModeToken } from './is-development-mode.token';

@Directive({
  exportAs: 'developmentOnly',
  selector: '[developmentOnly]',
})
export class DevelopmentOnlyDirective implements OnDestroy, OnInit {
  private get isEnabled(): boolean {
    return this.isDevelopmentMode;
  }

  constructor(
    private container: ViewContainerRef,
    private template: TemplateRef<any>,
    @Inject(isDevelopmentModeToken) private isDevelopmentMode: boolean,
  ) {}

  ngOnInit(): void {
    if (this.isEnabled) {
      this.createAndAttachView();
    }
  }

  ngOnDestroy(): void {
    this.destroyView();
  }

  private createAndAttachView(): void {
    this.container.createEmbeddedView(this.template);
  }

  private destroyView(): void {
    this.container.clear();
  }
}
```

```ts
// development-only.directive.spec.ts
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DevelopmentOnlyDirective } from './development-only.directive';
import { isDevelopmentModeToken } from './is-development-mode.token';

@Component({
  template: '<button *developmentOnly>God Mode</button>',
})
class TestComponent {}

describe(DevelopmentOnlyDirective.name, () => {
  function setup({ isDevelopmentMode }: { isDevelopmentMode: boolean }) {
    TestBed.configureTestingModule({
      declarations: [
        DevelopmentOnlyDirective,
        TestComponent,
      ],
      providers: [
        { provide: isDevelopmentModeToken, useValue: isDevelopmentMode },
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));

    return {
      expectButtonToBeOmitted() {
        expect(button).toBe(null);
      },
      expectButtonToBeRendered() {
        expect(button.nativeElement).not.toBe(null);
        expect(button.nativeElement.textContent).toContain('God Mode');
      },
    };
  }

  it('renders its element in development mode', () => {
    const { expectButtonToBeRendered } = setup({ isDevelopmentMode: true });

    expectButtonToBeRendered();
  });

  it('omits its element in production mode', () => {
    const { expectButtonToBeOmitted } = setup({ isDevelopmentMode: false });

    expectButtonToBeOmitted();
  });
});
```

_Development only structural directive._

This structural directive simply renders the component or element it’s attached to if the application is running in development mode, as verified by its test suite.

Now, all that is left is to add the deprecation banner and the browser faker to our application.

```html
<!-- app.component.html -->
<browser-faker *developmentOnly></browser-faker>
<internet-explorer-11-banner></internet-explorer-11-banner>

URL: <code><browser-url></browser-url></code>
```

```ts
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

_Angular application with Internet Explorer 11 deprecation banner and browser faker._

The application also includes [a URL component](https://stackblitz.com/edit/testing-and-faking-angular-dependencies-app?file=src%2Fapp%2Fbrowser%2Furl.component.ts) that demonstrates the [Location API](https://developer.mozilla.org/en-US/docs/Web/API/Location) as an Angular dependency.

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3n5r1jkrmdm77i9lrp9q.png)
<figcaption>When Internet Explorer 11 is faked, the deprecation banner is rendered.</figcaption></figure>

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/284avb9ihdte1edibogr.png)
<figcaption>When another browser is faked, the deprecation banner is omitted.</figcaption></figure>

Now, we can fake a browser environment to ease development and manual testing. Of course, we still need to test the deprecation banner in a real Internet Explorer 11 browser to make sure. Find help to do this in the __Resources__ section.

## Summary

To be able to simulate a user environment, we created a browser faker component that’s conditionally rendered in development mode. We encapsulated the browser state in a class-based service and had the application depend on it. This is the same service that’s used by the browser faker.

The browser faker is a simple example of faking a dependency in Angular applications. We discussed other techniques to dynamically configure Angular’s dependency injection mechanism.[](https://bit.ly/39cqbxa)

## Resources

The application that we used to demonstrate how to fake dependencies in Angular applications is in [a StackBlitz project](https://stackblitz.com/edit/testing-and-faking-angular-dependencies-app).

The test suite for the application which tests and also fakes Angular dependencies is in [a separate StackBlitz project](https://stackblitz.com/edit/testing-and-faking-angular-dependencies).

Microsoft’s [Modern.IE](http://modern.ie/) domain has free resources for generating browser snapshots with Internet Explorer. It also offers free virtual machine images with Internet Explorer running on Windows 7 or 8.1.

## Related articles

Look into techniques for configuring and resolving dependencies in an Angular testing environment in “[Testing and faking Angular dependencies](https://dev.to/this-is-angular/testing-and-faking-angular-dependencies-p9i)”.

Learn how to provide tree-shakable dependencies and other complicated configurations of Angular dependency injection in “[Tree-shakable dependencies in Angular projects](https://dev.to/this-is-angular/tree-shakable-dependencies-in-angular-projects-1ifg)”. This is the article that our application is based on.

## Reviewers

These wonderful people from the Angular community helped review this article:

* [Alex Okrushko](https://dev.to/alexokrushko)
* [Andrew Grekov](https://dev.to/thekiba)
* [Brad Taniguchi](https://github.com/bradtaniguchi)
* [Christian Lüdemann](https://dev.to/chrislydemann)
* [Mahmoud Abduljawad](https://twitter.com/mahmoud_ajawad)
* [Max Koretskyi](https://twitter.com/maxkoretskyi)
* [Nicholas Jamieson](https://dev.to/cartant)
* [Shai Reznik](https://twitter.com/shai_reznik)
* [Wassim Chegham](https://dev.to/wassimchegham)
