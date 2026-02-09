---
{
title: "How to set up an Nx-style monorepo workspace with the Angular CLI: Part 2",
published: "2021-03-31T12:15:06Z",
edited: "2021-09-18T23:08:54Z",
tags: ["angular", "nx", "ngrx", "monorepo"],
description: "In Part 2 of this tutorial, we'll set up our custom generate project tool and create the shared and booking data access libraries with NgRx. To honor the flow of dependencies, we extract a shared environments library.",
originalLink: "https://dev.to/playfulprogramming-angular/how-to-set-up-an-nx-style-monorepo-workspace-with-the-angular-cli-part-2-1e2j",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "How to set up an Nx-style monorepo workspace with the Angular CLI",
order: 2
}
---

*Original cover photo by [Edgar Chaparro](https://unsplash.com/photos/r6mBXuHnxBk) on Unsplash.*

*Original publication date: 2020-05-12.*

> This tutorial is part of the Angular Architectural Patterns series.

In Part 1 of this tutorial, we set up the booking desktop application project, a project for its end-to-end test suite, and the booking feature shell workspace library.

In this part, we'll set up our custom generate project tool to automate the steps we did manually in Part 1. We'll use it to create the shared and booking data acess libraries with NgRx Store, NgRx Effects, NgRx Schematics, and NgRx Store DevTools.

To configure the data access libraries while keeping the flow of dependencies correct, we'll extract a shared environments library. Data access will be hooked up to the booking feature shell library.

## Generate project tool

To generate the rest of the workspace libraries, we are going to use commands very similar to the ones we just saw.

Instead of copy-pasting snippets, let's create a script to generate a workspace library. We could have created an Angular CLI schematic for this, but we'll use a Node.js script for simplicity.

```bash
npm install --save-dev yargs
# or
yarn add --dev yargs
```

<figcaption>Install utility for parsing command line arguments.</figcaption>

We'll use the package `yargs` for parsing command line arguments passed to our script.

Create a `tools` folder with a filed named `generate-project.js`.

Paste in the content of [the Gist `LayZeeDK/generate-project.js`](https://gist.github.com/LayZeeDK/46479a1ed6b8005e7e50c6fd89716deb).

The tool basically runs commands demonstrated in the earlier sections with a few tweaks. We could have created a schematic, but I wanted you to be able to see the similarities without knowing about the complicated nature of schematic implementations.

`yargs` is used to setup up commands and parameters for the tool.

When we run `node ./tools/generate-project.js`, we get output similar to the following.

```bash
Usage: generate-project <command> <args>

Commands:
  generate-project application <name>     Generate application    [aliases: app]
  generate-project library <type> [name]  Generate workspace library
                                                                  [aliases: lib]

Options:
  --scope, -s      Project scope, for example "shared", "booking", or "check-in"
                                                    [string] [default: "shared"]
  --npm-scope, -p  Workspace path mapping scope, for example "workspace", or
                    "nrwl-airlines"               [string] [default: "workspace"]
  --help, -h       Show help                                           [boolean]
  --version, -v    Show version number                                 [boolean]
```

<figcaption>Command line instructions for the generate project tool.</figcaption>

Let's set up an NPM script for our tool in `package.json`.

```json
{
  "//": "package.json",
  "scripts": {
    "generate-project": "node ./tools/generate-project.js"
  }
}
```

<figcaption>NPM script for the generate project tool.</figcaption>

## Booking data access library

Now we're ready to try out the generate project tool. Run the following commands to generate the booking data access library.

```bash
npm run generate-project -- library data-access --scope=booking --npm-scope=nrwl-airlines
# or
yarn generate-project library data-access --scope=booking --npm-scope=nrwl-airlines
```

<figcaption>Generate booking data access library.</figcaption>

The generated file and folder structure is shown in this figure.

```bash
libs/booking/data-access
├── src
│   ├── lib
│   │   ├── booking-data-access.module.spec.ts
│   │   └── booking-data-access.module.ts
│   ├── index.ts
│   └── test.ts
├── README.md
├── karma.conf.js
├── tsconfig.lib.json
├── tsconfig.spec.json
└── tslint.json
```

<figcaption>Initial booking data access file and folder structure.</figcaption>

Like our other workspace library, this one is configured with `test` and `lint` architect targets.

You know the drill. Run the commands in this listing to try them out.

```bash
ng run booking-data-access:lint

ng run booking-data-access:test --watch=false
```

<figcaption>Lint and test the booking data access library.</figcaption>

### Booking state with NgRx

Let's add application state for the booking domain.

```bash
npm install @ngrx/store @ngrx/effects
npm install --save-dev @ngrx/schematics
# or
yarn add @ngrx/store @ngrx/effects
yarn add --dev @ngrx/schematics
```

<figcaption>Install NgRx package dependencies.</figcaption>

First, we install the NgRx packages we're going to use by running the previous commands.

Next, we're going to generate application state management with NgRx Store and NgRx Effects as seen in this listing.

```bash
ng generate @ngrx/schematics:feature +state/booking --project=booking-data-access --module=booking-data-access.module.ts --creators=true --api=false
```

<figcaption>Generate booking feature state.</figcaption>

This generates the folder and files illustrated in the following figure inside `libs/booking/data-access/src/lib`.

```bash
libs/booking/data-access/src/lib/+state
├── booking.actions.spec.ts
├── booking.actions.ts
├── booking.effects.spec.ts
├── booking.effects.ts
├── booking.reducer.spec.ts
├── booking.reducer.ts
├── booking.selectors.spec.ts
└── booking.selectors.ts
```

<figcaption>File and folder structure for booking feature state.</figcaption>

The NgRx feature schematic registered our booking feature store and effects with the booking data access module as per this listing.

```ts
// booking-data-access.module.ts
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BookingEffects } from './+state/booking.effects';
import * as fromBooking from './+state/booking.reducer';

@NgModule({
  imports: [StoreModule.forFeature(fromBooking.bookingFeatureKey, fromBooking.reducer), EffectsModule.forFeature([BookingEffects])],
})
export class BookingDataAccessModule {}
```

<figcaption>Booking data access module with feature store and effects.</figcaption>

Finally, we'll register it in the booking feature shell module as shown in the following listing.

```ts
// booking-feature-shell.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingDataAccessModule } from '@nrwl-airlines/booking/data-access';

import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [],
  },
];

@NgModule({
  declarations: [ShellComponent],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes),
    BookingDataAccessModule, // ?
    CommonModule,
  ],
})
export class BookingFeatureShellModule {}
```

<figcaption>Booking feature shell module with booking data access registered.</figcaption>

## Shared data access library

Let's move on to the shared data access library. This workspace library will be shared between all the booking and check-in applications.

```bash
npm run generate-project -- library data-access --scope=shared --npm-scope=nrwl-airlines
# or
yarn generate-project library data-access --scope=shared --npm-scope=nrwl-airlines
```

<figcaption>Generate shared data access library.</figcaption>

Use the previous commands to generate the shared data access library. By now, you know what this generates and configures.

A shared data access library sets up root level configuration for application state management and data services. This could be adding HTTP interceptors for security and API paths.

In our case, we'll initialise the root store and effects of our applications.

```bash
npm install @ngrx/store-devtools
# or
yarn add @ngrx/store-devtools
```

<figcaption>Install the NgRx Store development tools package.</figcaption>

First, we install the NgRx Store development tools package with the previous commands.

```bash
ng generate @ngrx/schematics:store app --project=shared-data-access --module=shared-data-access.module.ts --root --state-path=+state --state-interface=app-state
```

<figcaption>Generate the root store in the shared data access library.</figcaption>

The previous listing shows how to generate and register the root store in the shared data access library. Unfortunately, we stumble upon a few issues when doing this, at least at the time of writing.

```ts
// shared-data-access.module.ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { reducers, metaReducers } from './+state';

@NgModule({
  imports: [
  StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    })!environment.production ? StoreDevtoolsModule.instrument() : []]
})
export class SharedDataAccessModule {}
```

<figcaption>Default root store and store development tools registration in the shared data access module.</figcaption>

There are a few problems in the generated code shown in the previous listing.

First, a comma is missing after the import of `StoreModule.forRoot`. This is easily fixed as per this listing.

```ts
// shared-data-access.module.ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { metaReducers, reducers } from './+state';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
})
export class SharedDataAccessModule {}
```

<figcaption>Shared data access module with corrected store development tools registration.</figcaption>

### Using the environment configuration in a workspace library

The final problem we need to solve is that because our registration is done in a workspace library, we don't have access to the environment file which is usually in an application project.

We don't have path mappings that we can use to import from an application project. We shouldn't add them either! Workspace libraries must never depend on application projects – only the other way around.

How do we solve this dependency issue?

We solve it by extracting a shared environments workspace library from our application project as described in my article "[Tiny Angular application projects in Nx workspaces](https://indepth.dev/tiny-angular-application-projects-in-nx-workspaces/#extract-an-environments-workspace-library)".

As we don't expect any differences between our application environment settings, we'll make the library shared between all application projects.

```bash
npm run generate-project -- library environments --scope=shared --npm-scope=nrwl-airlines
#or
yarn generate-project library environments --scope=shared --npm-scope=nrwl-airlines

npx rimraf libs/shared/environments/src/lib/*.*

mv apps/booking/booking-desktop/src/environments/*.* libs/shared/environments/src/lib

"export * from './lib/environment';" > ./libs/shared/environments/src/index.ts

npx rimraf apps/booking/booking-desktop/src/environments
```

<figcaption>Generate the shared environments library.</figcaption>

After running the previous commands, our environments library has the file and folder structure shown in this figure.

```bash
libs/shared/environments
├── src
│   ├── lib
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── index.ts
│   └── test.ts
├── README.md
├── karma.conf.js
├── tsconfig.lib.json
├── tsconfig.spec.json
└── tslint.json
```

<figcaption>The file and folder structure of the shared environments library.</figcaption>

Because we moved the environment file, we have to update the `fileReplacements` option for the `production` configuration of our application's `build` architect target. This is shown in the following listing.

```json
{
  "//": "angular.json",
  "projects": {
    "booking-desktop": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "libs/shared/environments/src/lib/environment.ts",
                  "with": "libs/shared/environments/src/lib/environment.prod.ts"
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

<figcaption>Updated `fileReplacements` option which uses the environments library.</figcaption>

Now we're ready to correct the dependency in our shared data access module as seen in this code listing.

```ts
// shared-data-access.module.ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@nrwl-airlines/shared/environments';

import { metaReducers, reducers } from './+state';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
})
export class SharedDataAccessModule {}
```

<figcaption>Shared data access module using the shared environments library.</figcaption>

Don't forget to update the import statement in the booking desktop application's `main.ts` file. This is shown here.

```ts
// main.ts
import { enableProdMode } from '@angular/core';
import { environment } from '@nrwl-airlines/shared/environments';

if (environment.production) {
  enableProdMode();
}
```

<figcaption>Main file using the shared environments library</figcaption>

To use the shared data access library in the booking desktop application, we need to register our shared data access module in the booking feature shell module.

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
    children: [],
  },
];

@NgModule({
  declarations: [ShellComponent],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes),
    SharedDataAccessModule, // ?
    BookingDataAccessModule,
    CommonModule,
  ],
})
export class BookingFeatureShellModule {}
```

<figcaption>Booking feature shell module with shared data access registered.</figcaption>

Note that we register the shared data access module before the domain-specific data access module `BookingDataAccessModule` as Angular modules import order matters. For example, the root store needs to be registered before any feature store.

```bash
ng generate @ngrx/schematics:effect +state/app --project=shared-data-access --module=shared-data-access.module.ts --root --creators=true --api=false
```

<figcaption>Generate root effects in the shared data access library.</figcaption>

Let's also generate root effects with the commands in the listing above. This will register the root effects in the shared data access module as seen in this listing.

```ts
// shared-data-access.module.ts
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@nrwl-airlines/shared/environments';

import { metaReducers, reducers } from './+state';
import { AppEffects } from './+state/app.effects';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
  ],
})
export class SharedDataAccessModule {}
```

<figcaption>Shared data access with registered root effects.</figcaption>

Our shared data access library ends up having the file and folder structure displayed in the following figure.

```bash
libs/shared/data-access
├── src
│   ├── lib
│   │   ├── +state
│   │   │   ├── app.effects.spec.ts
│   │   │   ├── app.effects.ts
│   │   │   └── index.ts
│   │   ├── shared-data-access.module.spec.ts
│   │   └── shared-data-access.module.ts
│   ├── index.ts
│   └── test.ts
├── README.md
├── karma.conf.js
├── tsconfig.lib.json
├── tsconfig.spec.json
└── tslint.json
```

<figcaption>The file and folder structure of the shared data access library.</figcaption>

If we lint the workspace library now, we have a few code smells to address in the generated code. I'll leave this as an exercise for you to do. Consider circling back and doing the same for the booking data access library.

## Conclusion

Start the application by running the `ng run booking-desktop:serve` command.

<figure class="kg-card kg-image-card kg-card-hascaption">![](https://images.indepth.dev/images/2020/05/image-12.png)
<figcaption>The booking desktop application with the NgRx Store DevTools open.</figcaption>

The previous screenshot shows how the booking desktop application looks with the NgRx Store DevTools open.

```bash
nrwl-airlines
├── apps
│   └── booking
│       ├── booking-desktop
│       └── booking-desktop-e2e
├── libs
│   ├── booking
│   │   ├── data-access
│   │   └── feature-shell
│   └── shared
│       ├── data-access
│       └── environments
└── tools
```

<figcaption>Workspace folder structure after Part 2.</figcaption>

At this point, our workspace has project folders as seen in the previous figure.

In Part 2, we started by setting up our custom generate project tool. It automated the steps we did manually to generate application, end-to-end, and workspace library projects in Part 1.

First, we used the tool to generate the booking data access library. We then installed NgRx Store, NgRx Effects, and NgRx Schematics to our package dependencies.

We used the NgRx Schematics to generate a `+state` folder in our workspace library with NgRx feature effects, actions, reducers, and selectors.

To register the feature state in the booking desktop application, we imported the booking data access Angular module in the booking feature shell Angular module.

After the booking data access library, we generated the shared data access library which is intended to configure and initialise the root NgRx state and effects for both the booking and check-in (still to come) applications.

We added the NgRx Store DevTools package, used the NgRx schematics to create a `+state` folder with root reducers, meta reducers, root effects and configuration of runtime checks and NgRx Store DevTools instrumentation.

Some of the configuration needed to know whether the application was running in the development or production mode. This state is usually defined in the environment object of the application project.

Since the shared data access is a library project, it must not depend on an application project. Because of this, we used a recipe from the article "[Tiny Angular application projects in Nx workspaces](https://dev.to/playfulprogramming-angular/tiny-angular-application-projects-in-nx-workspaces-229a)" to extract a shared environments library. We set up file replacements in our builders.

With this in place, both our booking desktop application project and the shared data access library project was able to depend on the environment configuration.

We hooked everything up by registering data access in the booking feature shell Angular module. As we saw in the screenshot in this conclusion, NgRx Store DevTools shows us that everything is set up correctly.

That's it for Part 2 of this tutorial. In Part 3, we'll create the passenger info and flight search feature libraries with routing and set up the mobile booking application project and its end-to-end test project and create a mobile-specific template for the flight search component.

## Resources

For the impatient programmer, [the full solution is in the `LayZeeDK/ngx-nrwl-airlines-workspace` GitHub repository](https://github.com/LayZeeDK/ngx-nrwl-airlines-workspace)
