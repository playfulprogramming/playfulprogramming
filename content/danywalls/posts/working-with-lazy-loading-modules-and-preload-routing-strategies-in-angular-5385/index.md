---
{
title: "Working With Lazy Loading Modules and Preload Routing Strategies In Angular",
published: "2022-10-26T12:50:46Z",
edited: "2022-10-26T12:51:02Z",
tags: ["angular"],
description: "When we build an Angular application with multiple modules in a large app, the main script file...",
originalLink: "https://www.danywalls.com/working-with-lazy-loading-modules-and-preload-routing-strategies-in-angular",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When we build an Angular application with multiple modules in a large app, the main script file becomes a giant monster. One alternative to improve the user experience is to use the Lazy Module. Today, We will learn how to use lazy loading to enhance the user experience and add preload and custom strategies for loading modules.

## The Scenario

I'm working on a payment app with four modules `Dashboard`, `MoneyTransfer`, `Wallet` and `Activity`. Each one represents a business context with components. The following example shows the `ActivityModule` is the same for every module.

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity.component';
import { ActivityRouterModule } from './activity.routing.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ActivityComponent]
})
export class ActivityModule { }

```

Import every module in the `app.module` and register in the imports section. We need to configure the Router module to navigate to every component.

The `RouterModule.forRoot`  use a route configuration with the `path` and the `component` to load in the `<router-outlet></router-outlet>`.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {MoneyTransferModule} from "./moneytransfer/moneytransfer.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {WalletModule} from "./wallet/wallet.module";
import {ActivityModule} from "./activity/activity.module";
import {RouterModule, Routes} from "@angular/router";
import {WalletComponent} from "./wallet/wallet.component";
import {ActivityComponent} from "./activity/activity.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MoneyTransferComponent} from "./moneytransfer/moneytransfer.component";

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'wallet', component: WalletComponent },
    { path: 'activity', component: ActivityComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'money', component: MoneyTransferComponent },
    { path: '**', component: NotFoundComponent },
]
@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [BrowserModule, MoneyTransferModule, DashboardModule, WalletModule, ActivityModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

The app is ready to use. Let's see the final output.

> Learn more about [Routing in Angular](https://angular.io/guide/router)


![The Scenario](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nbisuipkqmimklzqu16q.png)

### What is Angular doing? 
Every module is compiled,  merged,  packaged, and bundled in the `main.js` file. We are loading all modules in a single file, it hits the application load time, and the user needs to wait for all modules to interact with the application. 

Some questions come to my head.

- We are loading `36.0kB` in the `Dashboard` area. 
- Why load all modules? 
- Why do we need to wait to load other modules that are not working? 
  

We are going to improve the situation using Angular Lazy Loading Modules.


## Lazy Loading

Let's start splitting the responsibility and separate importing all modules from the `app.module`. Create a new file `app.routing.module`, responsible for loading the modules.

The `app.routing.module`, help us to define the routes and load the modules, using the'loadChildren' property in the route definition.

The `loadChildren`  import module when the user requests the routes and loads the module.

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  {
    path: 'wallet',
    loadChildren: () =>
      import('./wallet/wallet.module').then((m) => m.WalletModule),
  },
  {
    path: 'activity',
    loadChildren: () =>
      import('./activity/activity.module').then((m) => m.ActivityModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'money',
    loadChildren: () =>
      import('./moneytransfer/moneytransfer.module').then(
        (m) => m.MoneyTransferModule
      ),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```
Next, we need to configure the modules to expose a RouterModule configuration to load the component using the `RouterModule.forChild()` method.

> The process is the same for every module, we show the example with the ActivityModule 

The `ActivityRouterModule` imports the  `RouterModule` and configures the `RouterModule.forChild()` with the routes object with the path and the component to load.

> The ActivityRouterModule

```typescript
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityComponent } from './activity.component';

const routes = [  { path: 'activity', component: ActivityComponent }]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule],
})
export class ActivityRouterModule { }
```
The 'ActivityModule' imports the `ActivityRouterModule` to provide the routing configuration.

We remove all module references from the app.modules and only need to register the app.routing.module.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    AppRoutingModule,
      BrowserModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

```
Perfect! We improve the load, only getting the minimum files and every module load when the user navigates the path.



![Lazy Loading](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j2ghyzlz513hpwhgejip.png)


### What do we get? 

- The size of main.js is decreased from 32KB to 12.8 KB 
- The modules are loaded on demand.

### Side effects 

One of the advantages is our new pain, "the loading on demand"; when the user clicks on the module, it takes time to request and load the module, getting delayed.

![Side effects ](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5w86af960aibtjm0aq6u.png)

## PreLoad Modules
Angular help us to one once the app is loaded, fetch all the remaining module chunks, and have faster navigation between different modules using `preloadingStrategy`. 

The preloadingStrategy helps us to download the modules asynchronously once you add the configuration in the root module routing. 

The router in the `forRoot` method passes an object with the option `preloadingStrategy: PreloadAllModules`. 

> The PreloadAllModules come from the angular router

```
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

```
Now, we have the lazy loading and downloading of the remaining modules asynchrono


![PreloadAllModules](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gtk5hdmfmogerhja1iyu.png)

> Read more about PreLoadStrategy https://angular.io/api/router/PreloadingStrategy

## Custom Loading Strategy

The `PreloadAllModules` loads all modules. Maybe we want to control which modules load, and maybe we want to control or be selective about which modules will use the `preloadingStrategy`.

We can customize the `preloadingStrategy` to create a class that implements the built-in `PreloadingStrategy` interface.

The class must implement the method `preload()`. In this method, we determine whether to preload the module or not in the route. 

We need to activate some flags in the route to know if the route will load or not. The easy way is to use the `route.data` property to set up the flag.

The load function compares if it contains the `preload` option to load the modules, then execute the load or returns an empty observable.

```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ModuleLoadingStrategyService implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}

```

Change the `PreLoadAllModules` to `ModuleLoadingStrategyService`strategy.

```typescript
import {ModuleLoadingStrategyService} from "./config/module.loading.strategy";

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
        preloadingStrategy: ModuleLoadingStrategyService,
    })
  ],
  exports: [RouterModule],
})
```
Finally, set the `preload` property in the `router.data` for the module to use the custom preload strategy, for example, wallet.

```typescript
{
    path: 'wallet',
    loadChildren: () =>
      import('./wallet/wallet.module').then((m) => m.WalletModule),
    data: { preload: true },
  },
```


![Custom Loading Strategy](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/el6dbep3nq52bnl1b09u.png)

Perfect! We have lazy loading with a custom preload strategy to load specific modules in the app!

## Recap

We learn how to implement lazy loading, preload the modules, and create a custom strategy to have a particular module for loading and speeding the application.

Photo by <a href="https://unsplash.com/@cinusek?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Marcin Simonides</a> on <a href="https://unsplash.com/s/photos/load?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  

My recommendation use lazy loading with a custom preload strategy. Pick the modules necessary for the application or high demand by the users, and maybe add some delay in the loading time. I hope it helps to speed up the performance of your Angular Apps.

- [Github Repo](https://github.com/danywalls/routing-strategies)
- Feel free to play in [StackBlitz](https://stackblitz.com/github/danywalls/routing-strategies)


