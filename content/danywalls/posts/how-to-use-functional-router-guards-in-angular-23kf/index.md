---
{
title: "How To Use Functional Router Guards in Angular",
published: "2022-11-30T07:20:24Z",
edited: "2022-12-04T13:20:18Z",
tags: ["devrel", "productivity", "angular"],
description: "Today I was talking with my friend Leifer, and he asked me some about Functional Guards in Angular...",
originalLink: "https://www.danywalls.com/how-to-use-functional-router-guards-in-angular",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Today I was talking with my friend [Leifer](https://www.youtube.com/channel/UCgrIGp5QAnC0J8LfNJxDRDw), and he asked me some about Functional Guards in Angular (14/15) with some questions.

- How functional Router Guards works ?
- Can The Class guards continue working in Standalone Components?
- How hard is converting class guards to functional?
- How to Inject dependencies for my Functional Guard?

All these questions are answer in the article, but to keep the article short, I will reuse the same project with [Angular Standalone Components](https://www.danywalls.com/head-start-with-standalone-components-in-angular-15).

## The Scenario

We want to protect the path 'domains'. If one service return false, redirect the users to the 'no-available' page, following the following steps:

- Create the component 'no-available'
- Create a service to provide the domain status.
- Create Class Guard with the service and router injected to redirect the user to the page 'no-available.
- Register the Class Guard in my router with Standalone Components
- Convert Class Guard to Functional Guards.

## Component And Service

If you read my article about [standalone components](https://www.danywalls.com/head-start-with-standalone-components-in-angular-15), from Angular 14, we can create standalone components with the flag `--standalone`.

```bash
ng g c pages/available --standalone
```

In the component, add the message, and the final code looks this:

```typescript
import {Component} from '@angular/core';

@Component({
  standalone: true,
  selector: 'no-available',
  template: `<h2>Sorry Domain is not available anymore :(</h2>`
})

export class NoAvailableComponent  {
}

```

Next, register the component in the router:

```typescript
  {
    path: 'no-available',
    loadComponent: () => import('./pages/noavailable/noavailable.component').then(m => m.NoAvailableComponent)
  }
```

### The Service

We need one service to use in the guards, create the `DomainService` with the `isAvailable` method and return an observable with true value.

```typescript
import {Injectable} from '@angular/core';
import {of, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DomainService {

  isAvailable() {
    return of(false).pipe(
      tap((v) =>console.log(v) )
    )
  }
}

```

## Before Starting with Guards

The Class Guards are services implementing interfaces linked with a few router events, for example:

- navigationStart :  `CanMatchGuard`
- CanLoadRoute:  `CanLoadGuard`
- ChildRouteActivation:  `CanActivateChildGuard`
- RouterActivation:  `canActivateGuard`

If you never play with guards, I recommend the example in the [official Angular docs](https://angular.io/guide/router-tutorial-toh#milestone-5-route-guards).

## Class Guards

The Guards are services implementing interfaces like `CanActivate`, and it continues working with Standalone components.

Create the guard `DomainGuard`, implements the `canActivate` interface, and inject the `router` and the `domainService`, in the constructor.

The `canActivate` use the method `isAvailable` from the service when the return is false, then use the router to navigate to the `no-available` route.

```typescript
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {tap} from 'rxjs';
import {DomainService} from './domain.service';

@Injectable({providedIn: 'root'})
export class DomainsGuard implements CanActivate {
  constructor(private domainService: DomainService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     return this.domainService.isAvailable().pipe(
       tap(value =>  !value ?  this.router.navigate(['/no-available']) : true)
     )
  }
}

```

## Using Class Guards With Standalone Components

Our next step is to register the guard with the standalone component. Open the `routes.ts` file, and use the `canActivate` property in the domain path. Add the `DomainGuard` class and test your code.

```typescript
  {
    path: 'domains',
    canActivate: [DomainsGuard],
    loadComponent: () => import('./pages/domains/domains.component').then(m => m.DomainsComponent),
  },
```

![one](./c1y2r4dxec64llcxsut5.gif)

## Turn to Functional Guards

Ok, our guards work, but how can we turn on o functional guards?
The `canActivate` array accepts functions so that we can write an arrow function into the `canActivate` array like:

```typescript
 {
    path: 'domains',
    canActivate: [() => false],
    loadComponent: () => import('./pages/domains/domains.component').then(m => m.DomainsComponent),
  },
```

![two](./hfo89gbnvh2hz7j4yb7w.gif)

### Using Inject()

In Angular 14, we can use the inject function in the constructor function scope to inject external dependencies in our functions.

Our guard functions need to get the router and the domain service to match our guards requirements.

If you want to learn more about the `inject`  I recommend looking at the article of @armen(https://dev.to/playfulprogramming-angular/always-use-inject-2do4) about Inject to answer your questions.

```typescript
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {DomainService} from '../domain.service';

export const domainGuard = () => {
    const router = inject(Router);
    const service = inject(DomainService)
    return service.isAvailable().pipe(
    tap((value) => {
      return !value ? router.navigate(['/no-available']) : true
    }
  ))
}
```

Next, register in the router, as we did before with the class.

```typescript
 {
    path: 'domains',
    canActivate: [domainGuard],
    loadComponent: () => import('./pages/domains/domains.component').then(m => m.DomainsComponent),
  },
```

![three](./h7fl8ol5rwlg59old4ol.gif)
Yeah!! We have our functional guards with standalone components.

## Conclusion

We learn how to use Class Guard with Standalone and how to convert to functional guard. Also use inject to provide dependencies to the functional guard.

Do you like functional guards? Please leave a comment or share.

The full code in [GitHub](https://github.com/danywalls/functional-guards-angular/)

Photo by Praveesh Palakeel on Unsplash
