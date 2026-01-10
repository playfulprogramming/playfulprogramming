---
{
title: "How to set up an Nx-style monorepo workspace with the Angular CLI: Part 3",
published: "2021-03-31T12:15:14Z",
edited: "2021-09-18T23:09:03Z",
tags: ["angular", "nx", "cli", "monorepo"],
description: "In Part 3 of this tutorial, we create the passenger info and flight search feature libraries. We use the generate project tool to create the mobile booking application and its test project. Finally, we create a mobile version of the flight search component template.",
originalLink: "https://dev.to/this-is-angular/how-to-set-up-an-nx-style-monorepo-workspace-with-the-angular-cli-part-3-4bb6",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "14674",
order: 1
}
---


_Original cover photo by [Edgar Chaparro](https://unsplash.com/photos/r6mBXuHnxBk) on Unsplash._

_Original publication date: 2020-05-15._

> This tutorial is part of the Angular Architectural Patterns series.

In Part 2 of this tutorial, we used the generate project tool to generate the booking data access and shared data access workspace libraries with NgRx Store and Effects. We extracted a shared environments library and hooked everything up to the booking feature shell library.

In this part of the tutorial, we're going to create the passenger info and flight search feature libraries, each with a routed component. After that, we'll create the mobile booking application project and its end-to-end test project. Finally, we'll use builder file replacement to create a mobile version of the flight search component template.

## Passenger info feature library

Let's create our first feature library, the passenger info feature which is part of the booking domain.

```bash
npm run generate-project -- library feature feature-passenger-info --scope=booking --npm-scope=nrwl-airlines
# or
yarn generate-project library feature feature-passenger-info --scope=booking --npm-scope=nrwl-airlines
```

<figcaption>Generate passenger info feature library.</figcaption>

After generating the project using the previous commands and parameters, we get this file and folder structure.

```bash
libs/booking/feature-passenger-info
├── src
│   ├── lib
│   │   ├── passenger-info
│   │   │   ├── passenger-info.component.css
│   │   │   ├── passenger-info.component.html
│   │   │   ├── passenger-info.component.spec.ts
│   │   │   └── passenger-info.component.ts
│   │   ├── booking-feature-passenger-info.module.spec.ts
│   │   └── booking-feature-passenger-info.module.ts
│   ├── index.ts
│   └── test.ts
├── README.md
├── karma.conf.js
├── tsconfig.lib.json
├── tsconfig.spec.json
└── tslint.json
```

<figcaption>The file and folder structure of the booking passenger info feature library.</figcaption>

This looks a little different from a feature shell library and a data access library.

After the generate project tool has created the workspace library with an entry point Angular module, it runs the commands in the next listing.

The generate project tool also removed the `--no-common-module` flag from the `ng generate module` command we saw earlier, since this Angular module will be declaring components.

```bash
ng generate component passenger-info --project=booking-feature-passenger-info --module=booking-feature-passenger-info.module.ts --display-block
```

<figcaption>Generate component command run when generating a feature library.</figcaption>

Let's look at the Angular module our tool has generated.

```ts
// booking-feature-passenger-info.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PassengerInfoComponent } from './passenger-info/passenger-info.component';

@NgModule({
  declarations: [PassengerInfoComponent],
  imports: [CommonModule],
})
export class BookingFeaturePassengerInfoModule {}
```

<figcaption>Initial entry point Angular module in the passenger info feature library.</figcaption>

The entry point Angular module shown in the previous listing is a good starting point. We need to set up the feature routing for our component though. This is done in the next listing.

```ts
// booking-feature-passenger-info.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PassengerInfoComponent } from './passenger-info/passenger-info.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PassengerInfoComponent,
  },
];

@NgModule({
  declarations: [PassengerInfoComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class BookingFeaturePassengerInfoModule {}
```

<figcaption>Passenger info feature Angular module with route configuration for its entry point component.</figcaption>

Nice! Now we've prepared our feature library to be hooked up to the feature shell library's routing configuration.

The generated component is what you'd expect. What it'd display in a real booking application is not really important for the purpose of this article.

Let's hook up this feature to the booking application's routing by adding a route configuration to the booking feature shell Angular module as seen here.

```ts
// booking-feature-shell.module.ts
import { Routes } from '@angular/router';

import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'passenger-info',
        loadChildren: () => import('@nrwl-airlines/booking/feature-passenger-info').then((esModule) => esModule.BookingFeaturePassengerInfoModule),
      },
    ],
  },
];
```

<figcaption>Route configuration for the passenger info feature.</figcaption>

## Flight search feature library

We have one feature library left in the booking domain. Use the following command to generate the flight search feature library.

```bash
npm run generate-project -- library feature feature-flight-search --scope=booking --npm-scope=nrwl-airlines
# or
yarn generate-project library feature feature-flight-search --scope=booking --npm-scope=nrwl-airlines
```

<figcaption>Generate flight search feature library.</figcaption>

We'll perform the same changes as we did in the passenger info feature library. Configure routing to the entry point component and set up lazy-loaded routing in the feature shell Angular module.

```ts
// booking-feature-flight-search.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlightSearchComponent } from './flight-search/flight-search.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FlightSearchComponent,
  },
];

@NgModule({
  declarations: [FlightSearchComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class BookingFeatureFlightSearchModule {}
```

<figcaption>Booking flight search feature module with entry point component route.</figcaption>

```ts
// booking-feature-shell.module.ts
import { Routes } from '@angular/router';

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
    ],
  },
];
```

<figcaption>Route configuration for the flight search feature.</figcaption>

As the previous listing shows, we've also configured the default route to redirect to the flight search path.

Take a look at our current project folder structure in this figure.

```bash
nrwl-airlines
├── apps
│   └── booking
│       ├── booking-desktop
│       └── booking-desktop-e2e
└── libs
     ├── booking
     │   ├── data-access
     │   ├── feature-flight-search
     │   ├── feature-passenger-info
     │   └── feature-shell
     └── shared
         ├── data-access
         └── environments
```

<figcaption>Project folder structure after setting up the flight search feature library.</figcaption>

Now that we have a few routes, try spinning up the booking desktop application with `npm start` or `yarn start`. Try out the routes `http://localhost:4200/flight-search` and `http://localhost:4200/passenger-info`.

We're done with the booking domain. Let's set up the mobile booking application.

## Mobile booking application

I've extended [the generate project tool](https://gist.github.com/LayZeeDK/46479a1ed6b8005e7e50c6fd89716deb) to support an `application` command that automates the commands we used to generate the booking desktop application.

Use this command to generate the application project.

```bash
npm run generate-project -- application booking-mobile --scope=booking --grouping-folder=booking --npm-scope=nrwl-airlines
# or
yarn generate-project application booking-mobile --scope=booking --grouping-folder=booking --npm-scope=nrwl-airlines
```

<figcaption>Generate mobile booking application.</figcaption>

So now we have two identical applications. How does that make sense? Nrwl's book mentions an adaptive layout approach where the application that's served is based on browser sniffing so that the two booking web applications are served on the same URL.

How can we differentiate components between two application projects sharing the same orchestration through a feature shell library like in this example? Read "[Shell Library patterns with Nx and Monorepo Architectures](https://indepth.dev/the-shell-library-patterns-with-nx-and-monorepo-architectures/)" by Nacho Vazquez to learn a few techniques, or simply use file replacements in `angular.json`.

Let's use the file replacements technique for the purpose of our case study.

First, create a mobile flight search component template by using this command.

```bash
"<p>mobile flight-search works!</p>" > libs/booking/feature-flight-search/src/lib/flight-search/flight-search.mobile.component.html
```

<figcaption>Create mobile flight search component template.</figcaption>

Now configure file replacements to use the mobile flight search component template when building and serving the mobile booking application.

```bash
# development configuration
ng config projects["booking-mobile"].architect.build.options.fileReplacements []

ng config projects["booking-mobile"].architect.build.options.fileReplacements[0].replace "libs/booking/feature-flight-search/src/lib/flight-search/flight-search.component.html"

ng config projects["booking-mobile"].architect.build.options.fileReplacements[0].with "libs/booking/feature-flight-search/src/lib/flight-search/flight-search.mobile.component.html"

# production configuration
ng config projects["booking-mobile"].architect.build.configurations.production.fileReplacements[1].replace "libs/booking/feature-flight-search/src/lib/flight-search/flight-search.component.html"

ng config projects["booking-mobile"].architect.build.configurations.production.fileReplacements[1].with "libs/booking/feature-flight-search/src/lib/flight-search/flight-search.mobile.component.html"
```

<figcaption>Replace flight search component template with mobile version.</figcaption>

Unfortunately, we have to keep the file replacement entries in sync between the development configuration and the production configuration.

We now have these file replacement configurations for the mobile booking application project.

```json
{
  "//": "angular.json",
  "projects": {
    "booking-mobile": {
      "architect": {
        "build": {
          "options": {
            "fileReplacements": [
              {
                "replace": "libs/booking/feature-flight-search/src/lib/flight-search/flight-search.component.html",
                "with": "libs/booking/feature-flight-search/src/lib/flight-search/flight-search.mobile.component.html"
              }
            ]
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "libs/shared/environments/src/lib/environment.ts",
                  "with": "libs/shared/environments/src/lib/environment.prod.ts"
                },
                {
                  "replace": "libs/booking/feature-flight-search/src/lib/flight-search/flight-search.component.html",
                  "with": "libs/booking/feature-flight-search/src/lib/flight-search/flight-search.mobile.component.html"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

<figcaption>File replacement configuration for the mobile desktop application, enabling the mobile flight search component template.</figcaption>

Run the following commands to verify that it worked. You should see the message `mobile flight-search works!`.

```bash
ng run booking-mobile:serve
```

<figcaption>Start development server for the mobile booking application.</figcaption>

Remember to lint and test our new projects to keep a tidy ship!

```bash
ng run booking-mobile:lint

ng run booking-mobile:test --watch=false

ng run booking-mobile-e2e:lint

ng run booking-mobile-e2e:e2e
```

<figcaption>Lint and test the mobile booking application and end-to-end testing projects.</figcaption>

Well done, we now have the following application project folder structure in place.

```bash
nrwl-airlines
└── apps
     └── booking
         ├── booking-desktop
         ├── booking-desktop-e2e
         ├── booking-mobile
         └── booking-mobile-e2e
```

<figcaption>All booking application and end-to-end testing projects are ready.</figcaption>

## Conclusion

Start the mobile booking application by running the `ng run booking-mobile:serve` command.

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mjqtfopal89dmv14eo5z.png)

<figcaption>The mobile booking application with the mobile version of the flight search feature.</figcaption>

The current folder structure of our workspace is shown in the following figure.

```bash
nrwl-airlines
├── apps
│   └── booking
│       ├── booking-desktop
│       ├── booking-desktop-e2e
│       ├── booking-mobile
│       └── booking-mobile-e2e
├── libs
│   ├── booking
│   │   ├── data-access
│   │   ├── feature-flight-search
│   │   ├── feature-passenger-info
│   │   └── feature-shell
│   └── shared
│       ├── data-access
│       └── environments
└── tools
```

<figcaption>The workspace folder structure after Part 3.</figcaption>

In this part of the tutorial, we used our generate project tool to generate the passenger info feature library.

To set up routing for this feature, we added a single route for the passenger info component to the passenger info feature Angular module. We then added a lazy-loaded route to the booking feature shell Angular module.

Next, we generated the flight search feature library. Like before, we added routing and set up the default route to redirect to the flight search route in the booking feature shell Angular module.

After checking that the routes worked, we used the generate project tool to generate application and end-to-end projects for the first time. We used the tool to generate the mobile booking application and its end-to-end test suite.

To implement the adaptive layout approach that Nrwl's books mentions, we used file replacements to allow a mobile template for the flight search component.

Finally, we linted and ran test suites for the new projects and started the mobile booking application which at this point looks like the screenshot in this conclusion.

In Part 4, we're going to create two workspace libraries and two applications in the booking domain and hook up data access and the feature shell Angular module. We review how much of this is automated by our generate project tool.

## Resources

For the impatient programmer, [the full solution is in the `LayZeeDK/ngx-nrwl-airlines-workspace` GitHub repository](https://github.com/LayZeeDK/ngx-nrwl-airlines-workspace)
