---
{
title: "How to set up an Nx-style monorepo workspace with the Angular CLI: Part 5",
published: "2021-03-31T12:15:31Z",
edited: "2021-09-18T23:09:19Z",
tags: ["angular", "nx", "cli", "monorepo"],
description: "In the final part of this tutorial, we create the seatmap data access, seat listing feature, shared buttons UI, and shared formatting utilities library. Finally, we compare our approach with the full Nx toolchain.",
originalLink: "https://dev.to/this-is-angular/how-to-set-up-an-nx-style-monorepo-workspace-with-the-angular-cli-part-5-2hk7",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "14674",
order: 1
}
---


_Original cover photo by [Edgar Chaparro](https://unsplash.com/photos/r6mBXuHnxBk) on Unsplash._

_Original publication date: 2020-05-22._

> This tutorial is part of the Angular Architectural Patterns series.

In Part 4 of this tutorial, we used our generate project tool to create the check-in data access library, the check-in feature shell library, the check-in desktop application, and the mobile check-in application. We hooked everything up and reviewed how much was automated by our tool.

In this part of the tutorial, we're going to create the seatmap data access library with NgRx feature state. We then created the seat listing feature library and hooked it up to all applications with routing. Finally, we created the shared buttons UI library and the shared formatting utilities library which we used in the seat listing component.

## Seatmap data access library

The shared seatmap feature has its own data access library. This is where we would add data services and application state management specific to the seatmap domain.

```bash
npm run generate-project -- library data-access --scope=seatmap --grouping-folder=shared/seatmap --npm-scope=nrwl-airlines --with-state
# or
yarn generate-project library data-access --scope=seatmap --grouping-folder=shared/seatmap --npm-scope=nrwl-airlines --with-state
```

<figcaption>Generate the seatmap data access library.</figcaption>

For now, we'll put the feature store and effects in place by using the `--with-state` parameter of the generate project tool. Note that we use the nested grouping folder `shared/seatmap`.

```ts
// seatmap-data-access.module.ts
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SeatmapEffects } from './+state/seatmap.effects';
import * as fromSeatmap from './+state/seatmap.reducer';

@NgModule({
  imports: [StoreModule.forFeature(fromSeatmap.seatmapFeatureKey, fromSeatmap.reducer), EffectsModule.forFeature([SeatmapEffects])],
})
export class SeatmapDataAccessModule {}
```

<figcaption>The seatmap data access module.</figcaption>

The seatmap data access Angular module gives us an overview of what's configured in the seatmap data access library. This is a good starting point.

```bash
ng run seatmap-data-access:lint

ng run seatmap-data-access:test --watch=false
```

<figcaption>Lint and test the seatmap data access library.</figcaption>

Everything looks ready to go!

## Seat listing feature library

It's time to add the first feature of the seatmap domain which is used in both the check-in and booking applications.

```bash
npm run generate-project -- library feature feature-seat-listing --scope=seatmap --grouping-folder=shared/seatmap --npm-scope=nrwl-airlines
# or
yarn generate-project library feature feature-seat-listing --scope=seatmap --grouping-folder=shared/seatmap --npm-scope=nrwl-airlines
```

<figcaption>Generate the seatmap seat listing feature library.</figcaption>

Our tool generates an Angular module and a component for us.

To add this feature to our applications, we add a route to each feature shell module.

```ts
// check-in-feature-shell.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckInDataAccessModule } from '@nrwl-airlines/check-in/data-access';
import { SharedDataAccessModule } from '@nrwl-airlines/shared/data-access';

import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'seatmap', // 👈
      },
      {
        path: 'seatmap', // 👈
        loadChildren: () => import('@nrwl-airlines/seatmap/feature-seat-listing').then((esModule) => esModule.SeatmapFeatureSeatListingModule),
      },
    ],
  },
];

@NgModule({
  declarations: [ShellComponent],
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes), SharedDataAccessModule, CheckInDataAccessModule, CommonModule],
})
export class CheckInFeatureShellModule {}
```

<figcaption>Check-in feature shell module with a route to the seat listing.</figcaption>

As the check-in applications don't have any other features at this moment, we'll use the seatmap as the default route.

```ts
// booking-feature-shell.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingDataAccessModule } from '@nrwl-airlines/booking/data-access';
import { SharedDataAccessModule } from '@nrwl-airlines/shared/data-access';

import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'flight-search',
      },
      {
        path: 'flight-search',
        loadChildren: () => import('@nrwl-airlines/booking/feature-flight-search').then((esModule) => esModule.BookingFeatureFlightSearchModule),
      },
      {
        path: 'passenger-info',
        loadChildren: () => import('@nrwl-airlines/booking/feature-passenger-info').then((esModule) => esModule.BookingFeaturePassengerInfoModule),
      },
      {
        path: 'seatmap', // 👈
        loadChildren: () => import('@nrwl-airlines/seatmap/feature-seat-listing').then((esModule) => esModule.SeatmapFeatureSeatListingModule),
      },
    ],
  },
];

@NgModule({
  declarations: [ShellComponent],
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes), SharedDataAccessModule, BookingDataAccessModule, CommonModule],
})
export class BookingFeatureShellModule {}
```

The booking application will continue to have the flight search as its default route.

Careful! Before we try to use a seatmap route, we have to configure routes in the seat listing feature.

```ts
// seatmap-feature-seat-listing.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeatListingComponent } from './seat-listing/seat-listing.component';

const routes: Routes = [
  // 👈
  {
    path: '',
    pathMatch: 'full',
    component: SeatListingComponent,
  },
];

@NgModule({
  declarations: [SeatListingComponent],
  imports: [
    RouterModule.forChild(routes), // 👈
    CommonModule,
  ],
})
export class SeatmapFeatureSeatListingModule {}
```

<figcaption>Seat listing feature module with default route.</figcaption>

As the final touch, we register the seatmap data access Angular module.

```ts
// seatmap-feature-seat-listing.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatmapDataAccessModule } from '@nrwl-airlines/seatmap/data-access';

import { SeatListingComponent } from './seat-listing/seat-listing.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SeatListingComponent,
  },
];

@NgModule({
  declarations: [SeatListingComponent],
  imports: [
    RouterModule.forChild(routes),
    SeatmapDataAccessModule, // 👈
    CommonModule,
  ],
})
export class SeatmapFeatureSeatListingModule {}
```

Start the mobile check-in application and make sure there are no errors.

```bash
ng run check-in-mobile:serve
```

<figcaption>Start the development server for the mobile check-in web app.</figcaption>

You should see the title `check-in-mobile` and the message `seat-listing works!`.

You might have noticed that the seat listing feature Angular module is similar to a feature shell Angular module. This is because the seat listing component is the entry point for the seatmap domain. However, this Angular module is lazy loaded in case the user won't need it.

## Shared buttons UI library

Let's create our first reusable presentational components and expose them in a shared buttons UI library.

```ts
npm run generate-project -- library ui ui-buttons --scope=shared --npm-scope=nrwl-airlines
# or
yarn generate-project library ui ui-buttons --scope=shared --npm-scope=nrwl-airlines
```

<figcaption>Generate shared buttons UI library.</figcaption>

Let's delete the default component and create a new confirm button component with a [SCAM](https://dev.to/this-is-angular/emulating-tree-shakable-components-using-single-component-angular-modules-13do).

```bash
npx rimraf libs/shared/ui-buttons/src/lib/buttons

ng generate module confirm-button --project=shared-ui-buttons

ng generate component confirm-button --project=shared-ui-buttons --export --display-block
```

<figcaption>Delete the default component and create a confirm button component.</figcaption>

In the following listings, we give the confirm button a simple implementation.

```html
<!-- confirm-button.component.html -->
<button (click)="onClick()">
  <ng-content></ng-content>
</button>
```

<figcaption>The confirm button's template projects content into the button and binds the `click` event to its event handler.</figcaption>

```ts
// confirm-button.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'nrwl-airlines-confirm-button',
  styleUrls: ['./confirm-button.component.css'],
  templateUrl: './confirm-button.component.html',
})
export class ConfirmButtonComponent {
  @Input()
  message = 'Do you confirm this action?';

  @Output()
  confirmed = new EventEmitter<boolean>();

  onClick() {
    this.confirmed.emit(confirm(this.message));
  }
}
```

<figcaption>The confirm button prompts the user with the `confirm()` dialog that has the message defined by its input property, then emits the user's answer through its output property.</figcaption>

Edit the shared UI buttons module to only export the confirm button SCAM.

```ts
// shared-ui-buttons.module.ts
import { NgModule } from '@angular/core';

import { ConfirmButtonModule } from './confirm-button/confirm-button.module';

@NgModule({
  exports: [
    // 👈
    ConfirmButtonModule, // 👈
  ],
})
export class SharedUiButtonsModule {}
```

Finally, make sure to export the confirm button component class in the library's public API. Consumers might want to hold a reference to an instance or dynamically render a confirm button.

```ts
// libs/shared/ui-buttons/src/index.ts
/*
 * Public API Surface of shared-ui-buttons
 */

export * from './lib/shared-ui-buttons.module';
export * from './lib/confirm-button/confirm-button.component'; // 👈
```

<figcaption>Public API exposing the confirm button component class.</figcaption>

Let's use the confirm button in the seat listing component, even though it can be used in the same way in every domain.

```ts
// seatmap-feature-seat-listing.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatmapDataAccessModule } from '@nrwl-airlines/seatmap/data-access';
import { SharedUiButtonsModule } from '@nrwl-airlines/shared/ui-buttons'; // 👈

import { SeatListingComponent } from './seat-listing/seat-listing.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SeatListingComponent,
  },
];

@NgModule({
  declarations: [SeatListingComponent],
  imports: [
    RouterModule.forChild(routes),
    SeatmapDataAccessModule,
    CommonModule,
    SharedUiButtonsModule, // 👈
  ],
})
export class SeatmapFeatureSeatListingModule {}
```

First add it to the seat listing feature Angular module as seen in the previous listing since it's the declaring Angular module of the seat listing component.

Now that it's in the compilation scope of the seat listing component, we can use it in its template and bind it to the component model.

```html
<!-- seat-listing.component.html -->
<p>seat-listing works!</p>

<nrwl-airlines-confirm-button message="Do you confirm checking in at this seat?" (confirmed)="onSeatConfirmed($event)"> Check in </nrwl-airlines-confirm-button>
```

<figcaption>The seat listing component template which uses the confirm button.</figcaption>

```ts
// seat-listing.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'seatmap-seat-listing',
  styleUrls: ['./seat-listing.component.css'],
  templateUrl: './seat-listing.component.html',
})
export class SeatListingComponent {
  onSeatConfirmed(isConfirmed: boolean): void {
    // 👈
    console.log('Is seat confirmed?', isConfirmed);
  }
}
```

<figcaption>The seat listing component model which is bound to the confirm button.</figcaption>

In the previous listings we pass a message for the confirmation dialog and listens for the user's response which we log to the browser console.

## Shared formatting utilities library

Our final workspace library is the shared formatting utilities library.

```bash
npm run generate-project -- library util util-formatting --scope=shared --npm-scope=nrwl-airlines
# or
yarn generate-project library util util-formatting --scope=shared --npm-scope=nrwl-airlines
```

<figcaption>Generate the shared formatting utilities library.</figcaption>

For now, this library will only expose add a single pure function. Delete the generated Angular module and its test suite.

```bash
npx rimraf libs/shared/util-formatting/src/lib/*.module*.ts
```

<figcaption>Delete the shared formatting utilities Angular module and its test suite.</figcaption>

We'll use Luxon as our date-time library.

```bash
npm install luxon
npm install --save-dev @types/luxon
# or
yarn add luxon
yarn add --dev @types/luxon
```

<figcaption>Install Luxon.</figcaption>

Create a file called `format-date.ts` in the library's `lib` folder.

```ts
// format-date.ts
import { DateTime } from 'luxon';

export function formatDate(luxonDate: DateTime): string {
  return luxonDate.toLocaleString({ ...DateTime.DATE_MED, weekday: 'long' });
}
```

<figcaption>A function to format a date in our preferred display format.</figcaption>

Expose it in the library's public API. Remember to remove the export of the Angular module that we deleted.

```ts
// libs/shared/util-formatting/src/index.ts
/*
 * Public API Surface of shared-util-formatting
 */

export * from './lib/format-date'; // 👈
```

<figcaption>The date formatting function is exposed in the shared formatting utilities library's public API.</figcaption>

Let's use the formatting function in the seat listing component.

```ts
// seat-listing.component.ts
import { Component } from '@angular/core';
import { formatDate } from '@nrwl-airlines/shared/util-formatting'; // 👈
import { DateTime } from 'luxon'; // 👈

@Component({
  selector: 'seatmap-seat-listing',
  styleUrls: ['./seat-listing.component.css'],
  templateUrl: './seat-listing.component.html',
})
export class SeatListingComponent {
  get today(): string {
    // 👈
    const now = DateTime.local();

    return formatDate(now);
  }

  onSeatConfirmed(isConfirmed: boolean): void {
    console.log('Is seat confirmed?', isConfirmed);
  }
}
```

<figcaption>The seat listing component model uses the `formatDate` function.</figcaption>

Now expose the UI property in the seat listing template.

```html
<!-- seat-listing.component.html -->
<p>Today is {{ today }}<!-- ? --></p>

<nrwl-airlines-confirm-button message="Do you confirm checking in at this seat?" (confirmed)="onSeatConfirmed($event)"> Check in </nrwl-airlines-confirm-button>
```

<figcaption>Seat listing component template presenting the `today` UI property.</figcaption>

> Note that it's a terrible practice to get the current date and time directly in a declarable as it makes it non-deterministic and in turn difficult to test. We should have created a separate service for accessing the current date-time. I'll leave that as an exercise for you.

The purpose of this section was to create and expose a formatting utilities library, so I'll leave it as an exercise to you to create an abstraction for accessing the current date-time.

The final file and folder structure of the shared formatting utilities library looks like this:

```bash
libs/shared/util-formatting
├── src
│   ├── lib
│   │   └── format-date.ts
│   ├── index.ts
│   └── test.ts
├── README.md
├── karma.conf.js
├── tsconfig.lib.json
├── tsconfig.spec.json
└── tslint.json
```

<figcaption>The final file and folder structure of the shared formatting utilities library.</figcaption>

## Conclusion

Start the desktop check-in application by running the `ng run check-in-desktop:serve` command. It should look like the following screenshot.

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1zhjq45n1px7ohb6spo7.png)

<figcaption>The check-in desktop application with the NgRx Store DevTools open.</figcaption>

Well done! We now have a full Nrwl Airlines monorepo workspace with multiple applications and workspace libraries as seen in the following figure.

```bash
nrwl-airlines
├── apps
│   ├── booking
│   │   ├── booking-desktop
│   │   ├── booking-desktop-e2e
│   │   ├── booking-mobile
│   │   └── booking-mobile-e2e
│   └── check-in
│       ├── check-in-desktop
│       ├── check-in-desktop-e2e
│       ├── check-in-mobile
│       └── check-in-mobile-e2e
├── libs
│   ├── booking
│   │   ├── data-access
│   │   ├── feature-flight-search
│   │   ├── feature-passenger-info
│   │   └── feature-shell
│   ├── check-in
│   │   ├── data-access
│   │   └── feature-shell
│   └── shared
│       ├── data-access
│       ├── environments
│       ├── seatmap
│       │   ├── data-access
│       │   └── feature-seat-listing
│       ├── ui-buttons
│       └── util-formatting
└── tools
```

<figcaption>The final folder structure of our Nrwl Airlines monorepo.</figcaption>

In the final part of this tutorial, we first generated the seatmap data access library with feature state.

Next, we generated the seat listing feature library and added seatmap routing to the check-in and booking feature shell Angular modules. To make this work, we added a single route to the seat listing component in the seatmap listing feature shell Angular module.

As the final part of the seatmap domain, we registered seatmap data access in the seat listing feature Angular module since this is the entry point feature library for the seatmap domain.

We generated the shared buttons UI library, then implemented and exposed the confirm button component which we used to display a check-in confirmation dialog in the seat listing component.

Finally, we generated the shared formatting utilities workspace library and added the format date function which we used in the seat listing component to display the current date as seen in the screenshot of this conclusion.

### Tutorial series conclusion

In this tutorial series, we learned how to use the Angular CLI to generate an Nx-style workspace. We used the default schematics, made changes and finally automated those changes using a custom Node.js command line tool. We would do ourselves a favour by converting the tool to Angular schematics, but that's beyond the scope of this article.

[View the generate project tool at GitHub Gists](https://gist.github.com/LayZeeDK/46479a1ed6b8005e7e50c6fd89716deb).

In the generate project tool, we should also have used the programmatic APIs of the other command line tools we used, but I wanted you to be able to easier identify how our manually run commands relate to the tool.

We created application projects with as little logic as possible. We created small workspace libraries that encapsulate use case-specific business logic or reusable logic.

Using path mappings, both our application projects and library projects can refer to library projects using our chosen import path prefix, the `--npm-scope` parameter we passed to the generate project tool.

The Nx CLI is not required to use a monorepo workspace structure and commands. The Nx CLI is built around the same building blocks as the Angular CLI: Schematics, builders, and the workspace configuration.

### What's missing?

Nx CLI offers a lot more than schematics. Nx gives us enforcement of architectural boundaries so that dependencies are not created between layers that we won't allow. We could create something like this ourselves, for example using [the TSLint `import-blacklist` rule](https://palantir.github.io/tslint/rules/import-blacklist/), but that would be error-prone and cumbersome.

Nx CLI enables us to generate a dependency graph which visualises the dependencies between our projects and allows us to reason about them. We could use [Dependency cruiser](https://www.npmjs.com/package/dependency-cruiser) to do this.

Nx contains schematics for other frameworks and tooling as well, for example ESLint, Jest, Cypress, Storybook, React, Express, and Nest. We don't have an alternative here, except Nest has their own schematics and Storybook have a command similar to a generator schematic.

Nx adds a ton of commands, tools, and configurations that are helpful to set up a production-grade deployment pipeline. Incremental builds, distributed cache, affected builders, and parallel execution, to mention a few. We could set some of these up ourselves using other tools and configuration, but if you have the opportunity to use it, the Nx CLI will not disappoint you.

## Resources

Refer to [the GitHub repository `LayZeeDK/ngx-nrwl-airlines-workspace` for the full solution](https://github.com/LayZeeDK/ngx-nrwl-airlines-workspace).

## Peer reviewers

Thank you for helping me whip this tutorial in shape, fellow professionals:

- [Jordan Hall](https://twitter.com/JordanHall_dev)
- [Maina Wycliffe](https://dev.to/mainawycliffe)
- [Mateus Carniatto](https://twitter.com/c4rniatto)
- [Nacho Vazquez](https://dev.to/nachovazquez)
- [Oleksandr Poshtaruk](https://dev.to/oleksandr)
- [Stephen Adams](https://twitter.com/stephenradams)
