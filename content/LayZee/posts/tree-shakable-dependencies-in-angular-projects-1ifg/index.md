---
{
title: "Tree-shakable dependencies in Angular projects",
published: "2020-11-22T22:37:58Z",
edited: "2021-03-26T14:20:43Z",
tags: ["angular", "dependencyinjection", "treeshaking"],
description: "Since Angular version 6, we can create tree-shakable dependencies and even leave out Angular modules.",
originalLink: "https://dev.to/this-is-angular/tree-shakable-dependencies-in-angular-projects-1ifg",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Angular dependencies",
order: 1
}
---

*Cover photo by [Paul Green](https://unsplash.com/photos/fhOGkxwQz0s) on Unsplash.*

*Original publication date: 2019-01-22.*

Tree-shakable dependencies are easier to reason about and compile to smaller bundles.

Angular modules (`NgModule`s) used to be the primary way to provide application-wide dependencies such as constants, configurations, functions, and class-based services. Since Angular version 6, we can create tree-shakable dependencies and even leave out Angular modules.

# Angular module providers create hard dependencies

When we use the `providers` option of the `NgModule` decorator factory to provide dependencies, the import statements at the top of the Angular module file reference the dependency files.

This means that all the services provided in an Angular module become part of the bundle, even the ones that aren’t used by declarables or other dependencies. Let’s call these hard dependencies since they aren’t tree-shakable by our build process.

Instead, we can invert the dependencies by letting the dependency files refer to the Angular module files. This means that even though an application imports the Angular module, it does not refer to a dependency until it uses the dependency in, for example, a component.

# Providing singleton services

A lot of class-based services are what are known as **application-wide singleton services**—or simply **singleton services**, since we rarely use them at the platform injector level.

## Pre-Angular 6 singleton service providers

In Angular versions 2 through 5, we had to add singleton services to the `providers` option of an `NgModule`. We then had to take care that only eagerly loaded Angular modules imported the providing Angular module— by convention this was the `CoreModule` of our application.

```ts
// pre-six-singleton.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PreSixSingletonService {
  constructor(private http: HttpClient) {}
}
```

```ts
// pre-six.module.ts
import { NgModule } from '@angular/core';

import { PreSixSingletonService } from './pre-six-singleton.service';

@NgModule({
  providers: [PreSixSingletonService],
})
export class PreSixModule {}
```

```ts
// core.module.ts
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { PreSixModule } from './pre-six.module.ts';

@NgModule({
  imports: [HttpClientModule, PreSixModule],
})
export class CoreModule {}
```

*Pre-Angular 6 singleton service.*

If we imported the providing Angular module in a lazy-loaded feature module, we would get a different instance of the service.

## Providing services in mixed Angular modules

When providing a service in an Angular module with declarables, we should use the `forRoot` pattern to indicate that it’s a mixed Angular module— that it provides both declarables and dependencies.

This is important, since importing an Angular module with a dependency provider in a lazy-loaded Angular module will create an instance of the service for that module injector. This happens even if an instance has already been created in the root module injector.

```ts
// pre-six-mixed.module.ts
import { ModuleWithProviders, NgModule } from '@angular/core';

import { MyComponent } from './my.component';
import { PreSixSingletonService } from './pre-six-singleton.service';

@NgModule({
  declarations: [MyComponent],
  exports: [MyComponent],
})
export class PreSixMixedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PreSixMixedModule,
      providers: [PreSixSingletonService],
    };
  }
}
```

*The `forRoot` pattern for singleton services.*

The static `forRoot` method is intended for our `CoreModule` which becomes part of the root module injector.

## Tree-shakable singleton service providers

Fortunately, Angular version 6 added the `providedIn` option to the `Injectable` decorator factory. This is a simpler approach for declaring application-wide singleton services.

```ts
// modern-singleton.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModernSingletonService {
  constructor(private http: HttpClient) {}
}
```

*Modern singleton service.*

A singleton service is created the first time any component that depends on it is constructed.

---

It’s considered best practice to always decorate a class-based service with `Injectable`. It configures Angular to inject dependencies through the service constructor.

Prior to Angular version 6, if our service had no dependencies, the `Injectable` decorator was technically unnecessary. Still, it was considered best practice to add it so that we would not forget to do so if we added dependencies at a later time.

Now that we have the `providedIn` option, we have another reason to always add the `Injectable` decorator to our singleton services.

An exception to this rule of thumb is if we create a service that’s always intended to be constructed by a factory provider (using the `useFactory` option) . If this is the case, we should not instruct Angular to inject dependencies into its constructor.

---

The `providedIn: 'root'` option will provide the singleton service in the root module injector. This is the injector created for the bootstrapped Angular module — by convention the `AppModule`. In fact, this injector is used for all eagerly loaded Angular modules.

Alternatively, we can refer the `providedIn` option to an Angular module which is similar to what we used to do with the `forRoot` pattern for mixed Angular modules, but with a few exceptions.

```ts
// modern-singleton.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ModernMixedModule } from './modern-mixed.module';

@Injectable({
  providedIn: ModernMixedModule,
})
export class ModernSingletonService {
  constructor(private http: HttpClient) {}
}
```

```ts
// modern-mixed.module.ts
import { NgModule } from '@angular/core';

import { MyComponent } from './my.component';

@NgModule({
  declarations: [MyComponent],
  exports: [MyComponent],
})
export class ModernMixedModule {}
```

*Modern `forRoot` alternative for singleton services.*

There are 2 differences when using this approach compared to the `'root'` option value:

1. The singleton service cannot be injected unless the providing Angular module has been imported.
2. Lazy-loaded Angular modules and the `AppModule` create their own instances because of separate module injectors.

## Guarding against multiple injectors

Assuming an Angular application with a single root Angular module, we can guard against module injectors creating multiple instances of a service. We do this by using a factory provider that resolves an existing instance or creates a new one.

```ts
// modern-singleton.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, SkipSelf } from '@angular/core';

import { ModernMixedModule } from './modern-mixed.module';

@Injectable({
  deps: [[new Optional(), new SkipSelf(), ModernSingletonService], HttpClient],
  providedIn: ModernMixedModule,
  useFactory: (instance: ModernSingletonService | null, http: HttpClient) => instance || new ModernSingletonService(http),
})
export class ModernSingletonService {
  constructor(private http: HttpClient) {}
}
```

```ts
// modern-mixed.module.ts
import { NgModule } from '@angular/core';

import { MyComponent } from './my.component';

@NgModule({
  declarations: [MyComponent],
  exports: [MyComponent],
})
export class ModernMixedModule {}
```

*Modern singleton service guarded against multiple injectors.*

This is the pattern [used by Angular Material](https://github.com/angular/components/blob/7.2.0/src/lib/icon/icon-registry.ts#L592-L611) for its singleton services such as `MatIconRegistry`.

Just make sure that the providing module is imported as part of the root module injector. Otherwise, two lazy-loaded modules would still create two instances.

## Stick to the root

Most of the time, using the `'root'` option value is the easiest and least error-prone way of providing an application-wide singleton service.

In addition to being easier to use and reason about, the `providedIn` option of the `Injectable` decorator factory enables services to be tree-shakable as previously discussed.

# Providing primitive values

Let’s imagine that we are tasked to display a deprecation notice to Internet Explorer 11 users. We’ll create an `InjectionToken<boolean>`.

This allows us to inject a `boolean` flag into services, components and so on. At the same time, we only evaluate the Internet Explorer 11 detection expression once per module injector. This means once for the root module injector and once per lazy-loaded module injector.

In Angular versions 4 and 5, we had to use an Angular module to provide a value for the injection token.

```ts
// is-internet-explorer.token.ts
import { InjectionToken } from '@angular/core';

export const isInternetExplorer11Token: InjectionToken<boolean> = new InjectionToken('Internet Explorer 11 flag');
```

```ts
// internet-explorer.module.ts
import { NgModule } from '@angular/core';

import { isInternetExplorer11Token } from './is-internet-explorer-11.token';

@NgModule({
  providers: [
    {
      provide: isInternetExplorer11Token,
      useFactory: (): boolean => /Trident\/7\.0.+rv:11\.0/.test(navigator.userAgent),
    },
  ],
})
export class InternetExplorerModule {}
```

*Angular 4–5 dependency injection token with factory provider.*

In Angular version 2, we could use an `OpaqueToken` similar to an `InjectionToken` but without the type argument.

Since Angular version 6, we can pass a factory to the `InjectionToken` constructor, removing the need for an Angular module.

```ts
// is-internet-explorer-11.token.ts
import { InjectionToken } from '@angular/core';

export const isInternetExplorer11Token: InjectionToken<boolean> = new InjectionToken('Internet Explorer 11 flag', {
  factory: (): boolean => /Trident\/7\.0.+rv:11\.0/.test(navigator.userAgent),
  providedIn: 'root',
});
```

*Modern dependency injection token with value factory.*

When using a factory provider, `providedIn` defaults to `'root'`, but let’s be explicit by keeping it. It’s also more consistent with how providers are declared using the `Injectable` decorator factory.

## Value factories with dependencies

We decide to extract the user agent string into its own dependency injection token which we can use in multiple places and only read from the browser once per module injector.

In Angular versions 4 and 5, we had to use the `deps` option (short for **dependencies**) to declare factory dependencies.

```ts
// user-agent.token.ts
import { InjectionToken } from '@angular/core';

export const userAgentToken: InjectionToken<string> = new InjectionToken('User agent string');
```

```ts
// is-internet-explorer.token.ts
import { InjectionToken } from '@angular/core';

export const isInternetExplorer11Token: InjectionToken<boolean> = new InjectionToken('Internet Explorer 11 flag');
```

```ts
// internet-explorer.module.ts
import { Inject, NgModule } from '@angular/core';

import { isInternetExplorer11Token } from './is-internet-explorer.token';
import { userAgentToken } from './user-agent.token';

@NgModule({
  providers: [
    { provide: userAgentToken, useFactory: () => navigator.userAgent },
    {
      deps: [[new Inject(userAgentToken)]],
      provide: isInternetExplorer11Token,
      useFactory: (userAgent: string): boolean => /Trident\/7\.0.+rv:11\.0/.test(userAgent),
    },
  ],
})
export class InternetExplorerModule {}
```

*Angular 4–5 dependency injection token with value factory provider that declares dependencies.*

Unfortunately, the dependency injection token constructor doesn’t currently allow us to declare factory provider dependencies. Instead, we have to use the `inject` function from `@angular/core`.

```ts
// user-agent.token.ts
import { InjectionToken } from '@angular/core';

export const userAgentToken: InjectionToken<string> = new InjectionToken('User agent string', {
  factory: (): string => navigator.userAgent,
  providedIn: 'root',
});
```

```ts
// is-internet-explorer-11.token.ts
import { inject, InjectionToken } from '@angular/core';

import { userAgentToken } from './user-agent.token';

export const isInternetExplorer11Token: InjectionToken<boolean> = new InjectionToken('Internet Explorer 11 flag', {
  factory: (): boolean => /Trident\/7\.0.+rv:11\.0/.test(inject(userAgentToken)),
  providedIn: 'root',
});
```

*Modern dependency injection token with value factory that has dependencies.*

The `inject` function injects dependencies from the module injector in which it’s provided—in this example the root module injector. It can be used by factories in tree-shakable providers. Tree-shakable class-based services can also use it in their constructor and property initialisers.

---

To resolve an optional dependency with `inject`, we can pass a second argument of `InjectFlags.Optional`. `InjectFlags` is in the `@angular/core` package and supports other injector options as bit flags.

---

In future Angular versions, [`inject`](https://github.com/angular/angular/issues/23330) [will support more use cases](https://github.com/angular/angular/issues/23330) like using a node injector.

# Providing platform-specific APIs

To make use of platform-specific APIs and ensure a high level of testability, we can use dependency injection tokens to provide the APIs.

Let’s go with an example of `Location` (not the one from Angular). In browsers, it’s available as the global variable `location` and additionally in `document.location`. It has the type `Location` in TypeScript. If you inject it by type in one of your services, you might fail to realize that `Location` is an interface.

Interfaces are compile-time artifacts in TypeScript which Angular is unable to use as dependency injection tokens. Angular resolves dependencies at run-time so we must use software artifacts that are available at run-time. Much like a key for a `Map` or a `WeakMap`.

Instead, we create a dependency injection token and use it to inject `Location` into, for example, a service.

```ts
// location.token.ts
import { InjectionToken } from '@angular/core';

export const locationToken: InjectionToken<Location> = new InjectionToken('Location API');
```

```ts
// browser.module.ts
import { NgModule } from '@angular/core';

import { locationToken } from './location.token';

@NgModule({
  providers: [{ provide: locationToken, useFactory: (): Location => document.location }],
})
export class BrowserModule {}
```

*Angular 4–5 dependency injection token with factory provider.*

Like with a primitive value, we can create an injection token with a factory to get rid of the Angular module.

```ts
// location.token.ts
import { InjectionToken } from '@angular/core';

export const locationToken: InjectionToken<Location> = new InjectionToken('Location API', {
  factory: (): Location => document.location,
  providedIn: 'root',
});
```

*Modern dependency injection token with API factory.*

In the API factory, we use the global variable `document`. This is a dependency for resolving the Location API in the factory. We could create another dependency injection token, but it turns out that Angular already exposes one for this platform-specific API — the `DOCUMENT` dependency injection token exported by the `@angular/common` package.

In Angular versions 4 and 5, we would declare the dependency in the factory provider by adding it to the `deps` option.

```ts
// location.token.ts
import { InjectionToken } from '@angular/core';

export const locationToken: InjectionToken<Location> = new InjectionToken('Location API');
```

```ts
// browser.module.ts
import { DOCUMENT } from '@angular/common';
import { Inject, NgModule } from '@angular/core';

import { locationToken } from './location.token';

@NgModule({
  providers: [
    {
      deps: [[new Inject(DOCUMENT)]],
      provide: locationToken,
      useFactory: (document: Document): Location => document.location,
    },
  ],
})
export class BrowserModule {}
```

*Angular 4–5 dependency injection token with API factory provider that declares dependencies.*

As before, we can get rid of the Angular module by passing the factory to the dependency injection token constructor. Remember that we have to convert the factory dependency to a call to `inject`.

```ts
// location.token.ts
import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const locationToken: InjectionToken<Location> = new InjectionToken('Location API', {
  factory: (): Location => inject(DOCUMENT).location,
  providedIn: 'root',
});
```

*Modern dependency injection token with API factory that has dependencies.*

Now we have a way of creating a common accessor for a platform-specific API. This will prove useful when testing declarables and services that rely on them.

# Testing tree-shakable dependencies

When testing tree-shakable dependencies, it’s important to notice that the dependencies are by default provided by the factories passed as options to `Injectable` and `InjectionToken`.

To override tree-shakable dependencies, we use `TestBed.overrideProvider`, for example `TestBed.overrideProvider(userAgentToken, { useValue: 'TestBrowser' })`.

Providers in Angular modules are only used in tests when the Angular modules are added to the Angular testing module imports, for example `TestBed.configureTestingModule({ imports: [InternetExplorerModule] })`.

# Do tree-shakable dependencies matter?

Tree-shakable dependencies don’t make a whole lot of sense for small applications where we should be able to pretty easily tell whether a service is actually in use.

Instead, imagine that we created a library of shared services used by multiple applications. The application bundles can now leave out the services that are not used in that particular application. This is useful both for monorepo workspaces and multirepo projects with shared libraries.

Tree-shakable dependencies are also important for Angular libraries. As an example, let’s say that we imported all the Angular Material modules in our application but only used some of the components and their related class-based services. Because Angular Material provides tree-shakable services, only the services we use are included in our application bundle.

# Summary

We’ve looked at modern options for configuring injectors with tree-shakable providers. Compared to the providers in the pre-Angular 6 era, tree-shakable dependencies are often easier to reason about and less error-prone.

Unused tree-shakable services from shared libraries and Angular libraries are removed at compilation, resulting in smaller bundles.

# Related articles

Tree-shakable dependencies is just one of the techniques used to make Angular modules optional. Read what you can expect from the upcoming Angular Ivy era in “[Angular revisited: tree-shakable components and optional NgModules](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2)”.

Learn the ins and outs of Angular dependency injection in automated tests in “[Testing and faking Angular dependencies](https://dev.to/this-is-angular/testing-and-faking-angular-dependencies-p9i)”.

We’ll create a browser faker to test the banner component during development in “[Faking dependencies in Angular applications](https://dev.to/this-is-angular/faking-dependencies-in-angular-applications-4d2f)”.

# Peer reviewers

An enormous thank you to all of my fellow Angular professionals who gave me valuable feedback on this article 🙏

I meet wonderful, helpful people like these in the Angular communities.

- [Alexey Zuev](https://twitter.com/yurzui)
- [Brad Taniguchi](https://github.com/bradtaniguchi)
- [Joost Koehoorn](https://twitter.com/devjoost)
- [Kay Khan](https://github.com/KayHS)
- [Mahmoud Abduljawad](https://twitter.com/mahmoud_ajawad)
- [Max Koretskyi](https://twitter.com/maxkoretskyi)
- [Sandra Willford](https://www.linkedin.com/in/sandra-willford/)
- [Tim Deschryver](https://twitter.com/tim_deschryver)
- [Todd Palmer](https://twitter.com/toddtpalmer)
- [Trotyl Yu](https://twitter.com/trotylyu)
- [Wassim Chegham](https://twitter.com/manekinekko)
