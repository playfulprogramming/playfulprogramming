---
{
title: "You don't need importProvidersFrom with Angular Material",
published: "2025-02-18T22:38:00Z",
edited: "2025-03-30T20:38:26Z",
tags: ["angular", "material", "providers", "standalone"],
description: "Cover photo generated with Microsoft Designer.  Traditionally, we had to import mixed Angular modules...",
originalLink: "https://dev.to/this-is-angular/you-dont-need-importprovidersfrom-with-angular-material-3nih",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---


*Cover photo generated with Microsoft Designer.*

Traditionally, we had to import mixed Angular modules from Angular Material at the root level to provide services required for the following components.

- [Datepicker](https://material.angular.io/components/datepicker)
- [Dialog](https://material.angular.io/components/dialog)
- [Snackbar](https://material.angular.io/components/snack-bar)
- [Timepicker](https://material.angular.io/components/timepicker)
- [Tooltip](https://material.angular.io/components/tooltip)

## Standalone Angular application

In Angular 14.0, the [`importProvidersFrom`](https://angular.dev/api/core/importProvidersFrom) function was introduced with standalone application support in Angular. This allowed us to be more explicit about the reason for adding the Angular module import to the [`ApplicationConfig`](https://angular.dev/api/core/ApplicationConfig) used with [`bootstrapApplication`](https://angular.dev/api/platform-browser/bootstrapApplication) as seen in the following example.

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackbarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appDateFormats } from './app-date-formats';

export const appConfig: ApplicationConfig = {
  providers: [
    // Datepicker (and Timepicker)
    importProvidersFrom(MatDatepickerModule, MatNativeDateModule),
    { provide: MAT_DATE_FORMATS, useValue: appDateFormats },
    importProvidersFrom(MatDialogModule),
    importProvidersFrom(MatSnackbarModule),
    importProvidersFrom(MatTooltipModule),
  ],
};
```
<figcaption><code>app.config.ts</code> example with Angular Material 14.0.</figcaption>

## Classic Angular application

In an `AppModule` in a classic Angular application, it is less clear why we need to maintain these Angular module imports.

```typescript
import { ApplicationConfig, importProvidersFrom, NgModule } from '@angular/core';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackbarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { appDateFormats } from './app-date-formats';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    // Angular Material
    BrowserAnimationsModule,
    // Datepicker (and Timepicker)
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: MAT_DATE_FORMATS, useValue: appDateFormats },
    MatDialogModule,
    MatSnackbarModule,
    MatTooltipModule,
  ],
})
export class AppModule {}
```
<figcaption><code>app.module.ts</code> example with Angular Material 13.3.</figcaption>

## Standalone Angular Material providers

In recent Angular Material versions, we can leave out the following imports from our `ApplicationConfig` as the dependencies they provide are all tree-shakable ([`@Injectable`](https://angular.dev/api/core/Injectable)`({ providedIn: 'root' })` or [`InjectionToken`](https://angular.dev/api/core/InjectionToken) with an inline provider).

- [`MatDialogModule`](https://material.angular.io/components/dialog/api)
- [`MatSnackbarModule`](https://material.angular.io/components/snack-bar/api)
- [`MatTooltipModule`](https://material.angular.io/components/tooltip/api)

As for the [Datepicker](https://material.angular.io/components/datepicker) and [Timepicker](https://material.angular.io/components/timepicker) dependencies, we can use the [`provideNativeDateAdapter`](https://material.angular.io/components/datepicker/overview#choosing-a-date-implementation-and-date-format-settings) function or a date-time library-specific date adapter like [`provideDateFnsAdapter`](https://material.angular.io/components/datepicker/overview#choosing-a-date-implementation-and-date-format-settings) as seen in the following example.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appDateFormats } from './app-date-formats';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // Datepicker (and Timepicker)
    provideNativeDateAdapter(appDateFormats),
  ],
};
```
<figcaption><code>app.config.ts</code> example with Angular Material 17.1.</figcaption>

Much cleaner, right?

## Benefits

Other than simpler application configuration code that is easier to reason about, we get the following benefits.

- Smaller bundle size as the Angular Material service dependencies are loaded when a lazy-loaded chunk need them for the first time
- Simpler component story configuration in Storybook as they can be simplified simlar to our `ApplicationConfig` as seen in the next section
- Simpler component test configuration as it is simplified in a similar way as seen in a later section

## Storybook component stories

In component stories, we use the [`applicationConfig`](https://storybook.js.org/tutorials/intro-to-storybook/angular/en/screen/) Storybook decorator to add root-level providers.


```typescript
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { myDateFormats } from './my-date-formats';
import { MyMaterialComponent } from './my-material.component';

const meta: Meta<MyMaterialComponent> = {
  title: 'MyMaterialComponent',
  component: MyMaterialComponent,
  decorators: [
    applicationConfig({
      providers: [
        // Angular Material
        provideAnimationsAsync(),
        // Datepicker (and Timepicker)
        provideNativeDateAdapter(myDateFormats),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<MyMaterialComponent>;

export const Default: Story = {};
```

<figcaption><code>my-material.component.stories.ts</code> example with Angular Material 17.1.</figcaption>

In earlier versions of Angular Material, we had to use [`importProvidersFrom`](https://angular.dev/api/core/importProvidersFrom) or pass the Angular modules to the `imports` option of thte [`moduleMetadata`](https://storybook.js.org/recipes/@angular/material) Storybook decorator.

## Component tests

Angular Material depdendencies are also simpler to configure in component tests. When unit testing an Angular component, we configure root-level providers with [the `providers` option](https://angular.dev/api/core/testing/TestModuleMetadata#providers) for the [`TestBed.configureTestingModule`](https://angular.dev/api/core/testing/TestBedStatic#configureTestingModule) method.

```typescript
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { myDateFormats } from './my-date-formats';
import { MyMaterialComponent } from './my-material.component';

it('MyMaterialComponent', () => {
  TestBed.configureTestingModule({
    providers: [
      // Angular Material
      provideNoopAnimations(),
      // Datepicker (and Timepicker)
      provideNativeDateAdapter(myDateFormats),
    ],
  });

  const fixture = TestBed.createComponent(MyMaterialComponent);

  expect(fixture.componentInstance).toBeDefined();
});
```
<figcaption><code>my-material.component.spec.ts</code> example with Angular Material 17.1.</figcaption>

## Conclusion

Modern Angular Material versions are easier to use, in part because of the standalone providers used for component dependencies since version 17.1. The following table shows the exact versions when each Angular Material component was converted to standalone providers.

| Component | First version with standalone providers |
| --- | --- |
| Datepicker | `17.1.0` |
| Dialog | `17.0.0` |
| Snackbar | `17.0.0` |
| Timepicker | `19.0.0` |
| Tooltip | `15.0.4` |

Root-level provider configuration for Angular Material components is easier to set up and reason about both in Angular applications, Storybook component stories, and Angular component tests.

Bundle sizes are optimized because of the tree-shakable providers.

Except for Date picker and Timepicker components, we don't have to remember to add any providers. Similarly, we don't have to remember to remove them if and when we remove all Angular Material component uses in an application, a component story, or a component test.

Historically, Angular and Angular Material progressed in the following way.

1. Add Angular modules to `NgModule.imports` for `AppModule`
1. Pass Angular modules to `importProvidersFrom` in `ApplicationConfig.providers`
1. No Angular modules but a provider function for the [Datepicker](https://material.angular.io/components/datepicker) and [Timerpicker](https://material.angular.io/components/timepicker) dependencies