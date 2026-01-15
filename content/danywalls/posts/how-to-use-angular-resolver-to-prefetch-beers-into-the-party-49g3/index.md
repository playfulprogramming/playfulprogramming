---
{
title: "How to use Angular resolvers to prefetch beers to the party",
published: "2021-10-16T07:57:23Z",
edited: "2021-10-16T10:51:28Z",
tags: ["angular", "codenewbie", "javascript", "rxjs"],
description: "When we go to a party, I love to have all beers ready to drink and take  one, but sometimes take time...",
originalLink: "https://dev.to/this-is-angular/how-to-use-angular-resolver-to-prefetch-beers-into-the-party-49g3",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When we go to a party, I love to have all beers ready to drink and take  one, but sometimes take time to pick from fridge to the table, and stay waiting is not a good experience.

The same happen with our users work with our angular apps, we show the component, but the data is not there or the HTTP request take time, and they are waiting.

A good solution is show a loading until get the data, but if my users want the beers ready from the beginning ? No problem because Angular have a solution, *The Resolvers.*

The Resolvers help us to prefetch data, before the router finish start the transition between components, and store.

The resolvers are helpful to avoid show an empty component, and  have our data ready, before move to the component.

## The Angular Party

Let's put the resolver to test, building an app to show a list of beers from
https://api.punkapi.com/v2/beers API, using a service.

The app have 2 routes ComponentRoom and ResolverRoom, each one have a different user experience.

- The Component Room, use the pipe async to get the data from the service.
- The Resolver Room, use a resolver to get the data and the component access to it using the route.snapshot.data.

## What we need to do ?

We will be going step by step.

1- Create an interface for mapping the API response.
2- Create the beer service, to get the data and provide a subscription with the result.
3- Create 3 components, BeerRoom and ResolverRoom and HomeComponent.
4- Create the resolver.
5- Register it and define the app routes.

Also, we include another actors as Router, ActivateRoute, Observable etc… But let to works!

> The source code is in

## The beer service

We create an interface Beer and a service BeerService to provide the data from the API.

The Beer interface have some properties of the beer API response.

```typescript
export  interface  Beer {
   id: number;
   name: string;
   tagline: string;
   first_brewed: string;
   description: string;
   image_url: string;
 }
```

The BeerService require  inject the httpClient, to make request to the API, also using Rxjs to return  an  observable array of Beer.

We import httpClient and Injectable decorator, and create the getBeers method to return the result of the request to https://api.punkapi.com/v2/beers, also using the delay operator it makes the response slow for 5 seconds.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Beer } from './models/beer';

@Injectable()
export class BeerService {
 public beers$: Observable<Beer[]>;
 constructor(private http: HttpClient) {
   this.getBeers();
 }
 private getBeers(): void {
   this.beers$ = this.http
     .get<Beer[]>('https://api.punkapi.com/v2/beers')
     .pipe(delay(4000));
 }
}

```

> Read more about operators and services
> Delay Operator https://www.learnrxjs.io/learn-rxjs/operators/utility/delay
> Services https://angular.io/tutorial/toh-pt4

## The home component

It is the home page with 2 links to get access to routes beer-room and resolver-room, using the directive routerLink.

```html
  <p class="text-center">
    Do you want to join to party and wait for the beers, or when you get in, the
    beers are ready ?
  </p>
  <div class="btn-group btn-group-block">
    <a [routerLink]="['/beer-room']" class="btn btn-primary">Component Room</a>
    <a [routerLink]="['/resolver-room']" class="btn btn-secondary"
      >Resolver Room</a
    >
  </div>
```

> More about router link https://angular.io/api/router/RouterLink

## The BeerRoom Component

The component Room, get the data from the beer service and resolve the subscription
into the template, we declare the variable beers as observable and assign the observable from our service to it.

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BeerService } from '../../beer.service';
import { Beer } from '../../models/beer';

@Component({
  selector: 'app-beer-room',
  templateUrl: './beer-room.component.html',
})
export class BeerRoomComponent {
  public beers$: Observable<Beer[]>;
  constructor(private beerService: BeerService) {
    this.beers$ = beerService.beers$;
  }
}

```

Into the template, use the pipe async to wait until the subscription finish.

```html
    <div *ngIf="beers$ | async as beers">
      <div class="chip" *ngFor="let beer of beers">
        <img [src]="beer?.image_url" class="avatar avatar-sm" />
        {{ beer.name }}
      </div>
    </div>
```

> Read more directives and pipes.
> ngIf https://angular.io/api/common/NgIf
> ngFor https://angular.io/api/common/NgForOf
> Pipe Async https://angular.io/api/common/AsyncPipe

## The ResolverRoom Component

Close similar to the beer component, we inject ActivateRoute, it provides the data in the snapshot stored by the resolver into the beer variable.

The vale of the beer into the snapshot is store into the beerRouterList variable.

> You will see how we configure the resolver in the route configuration.

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Beer } from '../../models/beer';

@Component({
  templateUrl: './resolver-room.component.html',
})
export class ResolverRoomComponent implements OnInit {
  beerRouterList: Beer[];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.beerRouterList = this.route.snapshot.data['beers'];
  }
}

```

Similar like the BeerComponent we iterate over the beer array using ngFor directive.

```html
<div class="chip" *ngFor="let beer of beerRouterList">
      <img [src]="beer?.image_url" class="avatar avatar-sm" />
      {{ beer.name }}
    </div>
```

Done, next steps are creating the resolver and configure it with the route configuration.

## The Resolver

The key player in the article, *the resolver*, The BeerResolverService it implements the Resolve interface, the resolver works a data provider used by the router to resolve
during the navigation process and the router, wait for it to complete before it get activated.

It implements the resolve methods, same like the component we inject the beerService and return the observable beers$, also update the type return to match with Observable\<Beer\[]>.

```typescript
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BeerService } from '../beer.service';
import { Beer } from '../models/beer';

@Injectable()
export class BeerResolverService implements Resolve<Observable<Beer[]>> {
  constructor(private beerService: BeerService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Beer[]> {
    return this.beerService.beers$;
  }
}

```

## Register resolver and create the routes.

We don't  go deep how works router in angular, you can read more in details into the official documentation, but here  define 2 routes for our app.

- The path home, load the HomeComponent.
- The path beer-room, load the BeerRoomComponent.
- The path resolve-room load the component but with a special case,
  it uses the resolve to find the data provided by resolver and store into the beer variable beers and store into the into
  the route.snapshot.data with the key beers and the value returned by the subscription.
- The final path: ''' redirect any request to the home component.

```typescript
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'beer-room',
    component: BeerRoomComponent,
  },
  {
    path: 'resolver-room',
    component: ResolverRoomComponent,
    resolve: { beers: BeerResolverService },
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
```

## Get the experience!!!

Ready, we have the 2 experiences:

- The Component you get into the room but not beer ready.
- The resolve allow you to move to the area only when it is ready.

*My personal opinion*

If you have your room is getting a single value, I like to use the resolver.

But If my component has multiple requests, I like to resolve the data into the component, because the user start to get results.

What you think is better for our user, play with it and get your feeling!

<iframe src="pfp-code:./prefetch-data-with-resolver-angular?embed=1&file=src/app/app-routing.module.ts" data-frame-title="Prefetch Data with Resolver Angular - StackBlitz" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>


Hopefully, that will give you a bit of help with how and when to use resolver. If you enjoyed this post, share it!

Photo by <a href="https://unsplash.com/@merittthomas?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Meritt Thomas</a> on <a href="https://unsplash.com/s/photos/beers?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
