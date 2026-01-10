---
{
title: "Angular Revisited: Standalone Angular applications, the replacement for NgModules",
published: "2022-08-30T14:00:17Z",
edited: "2023-12-20T11:09:22Z",
tags: ["angular"],
description: "The future is now, old man. Standalone Angular applications are now a viable alternative to classic NgModule-based Angular applications.",
originalLink: "https://dev.to/this-is-angular/angular-revisited-standalone-angular-applications-the-replacement-for-ngmodules-238m",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "19509",
order: 1
}
---


_Cover photo by [Laura Cleffman](https://unsplash.com/photos/rL6q_Y5uBLs) on Unsplash._

It's been 4 years since I started looking into _standalone_ Angular applications, that is Angular applications that unlike _classic_ Angular applications have no Angular modules.

Angular version 15 delivers an amazing full-on standalone Angular application experience and it is about much more than standalone components. It is a shift in perspective on Angular concepts as we know them.

<!--
## Article series outline

In this article series, we explore important concepts and patterns for composing our standalone Angular applications. Alongside this exploration, we discuss the benefits of standalone Angular applications compared to classic Angular applications.

Topics I might cover in the *Standalone Angular applications* article series:
- Declarables
  - Standalone components
  - Standalone directives
  - Standalone pipes
  - Testing standalone declarables
  - Local component scope
  - Standalone Angular Elements
  - Transitive compilation scope
  - Standalone Angular libraries
- Dependency injection
  - Standalone providers
  - Environment injectors
  - Routes with providers
  - Extracting providers from Angular modules
- Standalone application composition
  - Angular's application concept
  - Standalone routed features
  - Testing standalone routed features
  - Lazy-loading routed standalone components
  - Dynamically rendering standalone components
  - Encapsulating software artifacts in standalone Angular applications

Until the individual parts of this series have been published, you can get a taste of these topics in [the Standalone APIs category of the This is Angular guides](https://this-is-angular.github.io/angular-guides/docs/category/standalone-apis). Contributions are welcome!
-->

## Optional NgModules

Standalone Angular applications mark the final milestone of the *optional NgModules* epic. No longer do we have to use or write Angular modules. We now have an alternative for every use case.

Angular modules are one of the most confusing concepts of the Angular framework. The vision for Angular was to get rid of Angular modules following AngularJS versions 1.x but shortly before Angular version 2.0, Angular modules were reintroduced for the sake of the compiler to pave the path for application-scoped Ahead-of-Time compilation, a major improvement compared to Just-in-Time compilation, the only compilation mode for AngularJS.

Angular modules are difficult to teach and learn. Introduced as necessary compiler annotations rather than to improve the developer experience, Angular modules address many concerns with declarable linking to component templates and environment injector configuration being the two major concerns.

```typescript
@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  entryComponents: [AppComponent],
  exports: [AppComponent],
  id: 'app',
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    MatButtonModule,
    RouterModule.forRoot(routes),
  ],
  jit: false,
  providers: [AppService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

Let's have a look at every metadata option for the `NgModule` decorator, discuss their purpose and their standalone application replacements.

### NgModule.bootstrap

Marks one or more components to be bootstrapped as root components.

Replace with [`bootstrapApplication`](https://angular.io/api/platform-browser/bootstrapApplication).

### NgModule.declarations

Declares components, directives, and pipes, including them in Angular module's [transitive compilation scope](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2#transitive-compilation-scope).

> ⚠️ **Warning**
> A classic component, directive, or pipe can only be declared in one Angular module. Declaring them in multiple Angular modules results in compilation errors.

Replace with the [`Component.imports`](https://angular.io/api/core/Component#imports), [`Component.standalone`](https://angular.io/api/core/Component#standalone), [`Directive.standalone`](https://angular.io/api/core/Directive#standalone), and [`Pipe.standalone`](https://angular.io/api/core/Pipe#standalone) metadata options.

### NgModule.entryComponents
Deprecated since Angular version 9, the first stable release of Angular Ivy, the `NgModule.entryComponents` option marks a component for dynamic rendering support. This was implicitly done for components marked with [`NgModule.bootstrap`](https://angular.io/api/core/NgModule#bootstrap) and [`Route#component`](https://angular.io/api/router/Route#properties) in the Angular Template Compiler and Angular View Engine framework generations.

> ℹ️ **Note**
> Stop using this metadata option in classic Angular applications.

In Angular Ivy, components do not have to be marked explicitly as entry components. Dynamic rendering of any component is possible so no replacement is necessary. 

### NgModule.exports

Marks classic and/or standalone declarables as part of this Angular module's [transitive exported scope](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2#transitive-exported-scope). Listing other Angular modules includes their transitive exported scope in this Angular module's transitive exported scope.

Replace with the native `export` declaration to make a standalone declarable accessible to the template of a component including it in its [`Component.imports`](https://angular.io/api/core/Component#imports) metadata option or the transitive scope of an Angular module including it in its [`NgModule.imports`](https://angular.io/api/core/NgModule#imports) or [`NgModule.exports`](https://angular.io/api/core/NgModule#exports) metadata options.

To indicate public or internal access to a standalone declarable, we can structure our Angular workspaces using barrel files, workspace libraries, and or lint rules.

### NgModule.id
Marks this Angular module as non-tree-shakable and allows access through the [`getNgModuleById`](https://angular.io/api/core/getNgModuleById) function.

> ⚠️ **Warning**
> [You probably don't need this option](https://angular.io/errors/NG6100).

Not needed in standalone applications. For classic application, replace with a dynamic import statement, for example: 

```typescript
const TheModule = await import('./the.module')
  .then(esModule => esModule.TheModule);
```
### NgModule.jit

Excludes this Angular module and its declarations from Ahead-of-Time compilation.

> ℹ️ **Note**
> The JIT compiler must be bundled with the application for this option to work for example by adding the following statement in the `main.ts` file:
>```typescript
>import '@angular/compiler';
>```

Introduced in Angular version 6 to support the ongoing work of what was going to be the next framework generation, Angular Ivy.

Replace with the [`Component.jit`](https://angular.io/api/core/Component#inherited-from-directive-decorator) and [`Directive.jit`](https://angular.io/api/core/Directive#jit) metadata options.

### NgModule.imports

Includes the [transitive exported scope](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2#transitive-exported-scope) of listed Angular modules in this Angular module's [transitive module scope](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2#transitive-module-scope). Standalone declarables can also be listed to include them in this Angular module's transitive module scope.

This links imported declarables to templates of components declared by this Angular module.

Providers listed in Angular modules added to the [`NgModule.imports`](https://angular.io/api/core/NgModule#imports) metadata option are added to the environment injector(s) (formerly known as module injectors) that this Angular module is part of.

To mark components, directives, and pipes as declarable dependencies of a standalone component, use its [`Component.imports`](https://angular.io/api/core/Component#imports) metadata option which also supports Angular modules.

### NgModule.providers

Lists providers that are added to the environment injector(s) (formerly known as module injectors) that this Angular module is part of.

Angular version 6 introduced [tree-shakable providers](https://dev.to/this-is-angular/tree-shakable-dependencies-in-angular-projects-1ifg), removing the need for Angular modules to configure environment injectors, at the time known as module injectors.

Replace `NgModule.providers` with the [`InjectionToken.factory`](https://angular.io/api/core/InjectionToken) metadata option, [`Injectable.providedIn`](https://angular.io/api/core/Injectable#providedIn) metadata option, [`Route#providers`](https://angular.io/api/router/Route#properties) setting, and [`ApplicationConfig#providers`](https://angular.io/api/platform-browser/ApplicationConfig) setting.

> 💡 **Tip**
> Consider using a component-level provider to follow the lifecycle of a directive or component by specifying the [`Component.providers`](https://angular.io/api/core/Component#inherited-from-directive-decorator), [`Component.viewProviders`](https://angular.io/api/core/Component#viewproviders), and [`Directive.providers`](https://angular.io/api/core/Directive#providers) metadata options. Consider this both for classic and standalone Angular applications.

### NgModule.schemas

Adds template compilation schemas to support web component usage by listing the [`CUSTOM_ELEMENTS_SCHEMA`](https://angular.io/api/core/CUSTOM_ELEMENTS_SCHEMA) or to ignore the use of any unknown element, attribute, or property by listing the [`NO_ERRORS_SCHEMA`](https://angular.io/api/core/NO_ERRORS_SCHEMA).

This controls the template compilation schemas for components that are declared by this Angular module.

Replace with the [`Component.schemas`](https://angular.io/api/core/Component#schemas) metadata option.

As we have learned in this introductory article, every possible Angular module metadata option now has a standalone Angular application replacement.

## Standalone alternatives for official Angular modules

Several Angular modules are exposed in the public APIs of official Angular packages. As of Angular version 15.1, there are standalone alternatives for the following official Angular modules:

| Angular module | Standalone replacement |
|---|---|
| [`BrowserAnimationsModule`](https://angular.io/api/platform-browser/animations/BrowserAnimationsModule) | [`provideAnimations`](https://angular.io/api/platform-browser/animations/provideAnimations) |
| [`CommonModule`](https://angular.io/api/common/CommonModule) | [`AsyncPipe`](https://angular.io/api/common/AsyncPipe), [`CurrencyPipe`](https://angular.io/api/common/CurrencyPipe), [`DatePipe`](https://angular.io/api/common/DatePipe), [`DecimalPipe`](https://angular.io/api/common/DecimalPipe), [`I18nPluralPipe`](https://angular.io/api/common/I18nPluralPipe), [`I18nSelectPipe`](https://angular.io/api/common/I18nSelectPipe), [`JsonPipe`](https://angular.io/api/common/JsonPipe), [`KeyValuePipe`](https://angular.io/api/common/KeyValuePipe), [`LowerCasePipe`](https://angular.io/api/common/LowerCasePipe), [`NgClass`](https://angular.io/api/common/NgClass), [`NgComponentOutlet`](https://angular.io/api/common/NgComponentOutlet), [`NgIf`](https://angular.io/api/common/NgIf), [`NgForOf`](https://angular.io/api/common/NgForOf), [`NgPlural`](https://angular.io/api/common/NgPlural), [`NgPluralCase`](https://angular.io/api/common/NgPluralCase), [`NgStyle`](https://angular.io/api/common/NgStyle), [`NgSwitch`](https://angular.io/api/common/NgSwitch), [`NgSwitchCase`](https://angular.io/api/common/NgSwitchCase), [`NgSwitchDefault`](https://angular.io/api/common/NgSwitchDefault), [`NgTemplateOutlet`](https://angular.io/api/common/NgTemplateOutlet), [`PercentPipe`](https://angular.io/api/common/PercentPipe), [`SlicePipe`](https://angular.io/api/common/SlicePipe), [`TitleCasePipe`](https://angular.io/api/common/TitleCasePipe), and [`UppercasePipe`](https://angular.io/api/common/UppercasePipe) |
| `CdkScrollableModule` | [`CdkScrollable`](https://material.angular.io/cdk/scrolling/api#CdkScrollable) |
| [`DragDropModule`](https://material.angular.io/cdk/drag-drop/api) | [`CdkDrag`](https://material.angular.io/cdk/drag-drop/api#CdkDrag), [`CdkDragHandle`](https://material.angular.io/cdk/drag-drop/api#CdkDragHandle), [`CdkDragPlaceholder`](https://material.angular.io/cdk/drag-drop/api#CdkDragPlaceholder), [`CdkDragPreview`](https://material.angular.io/cdk/drag-drop/api#CdkDragPreview), [`CdkDropList`](https://material.angular.io/cdk/drag-drop/api#CdkDropList), [`CdkDropListGroup`](https://material.angular.io/cdk/drag-drop/api#CdkDropListGroup), and [`CdkScrollable`](https://material.angular.io/cdk/scrolling/api#CdkScrollable) |
| [`HttpClientModule`](https://angular.io/api/common/http/HttpClientModule) | [`provideHttpClient`](https://angular.io/api/common/http/provideHttpClient) |
| [`HttpClientJsonpModule`](https://angular.io/api/common/http/HttpClientJsonpModule) | [`provideHttpClient`](https://angular.io/api/common/http/provideHttpClient) and [`withJsonpSupport`](https://angular.io/api/common/http/withJsonpSupport) |
| [`HttpClientTestingModule`](https://angular.io/api/common/http/testing/HttpClientTestingModule) | [`provideHttpClientTesting`](https://angular.io/api/common/http/testing/provideHttpClientTesting) |
| [`HttpClientXsrfModule`](https://angular.io/api/common/http/HttpClientXsrfModule) | [`provideHttpClient`](https://angular.io/api/common/http/provideHttpClient), [`withNoXsrfProtection`](https://angular.io/api/common/http/withNoXsrfProtection) and [`withXsrfConfiguration`](https://angular.io/api/common/http/withXsrfConfiguration) |
| [`NoopAnimationsModule`](https://angular.io/api/platform-browser/animations/NoopAnimationsModule) | [`provideNoopAnimations`](https://angular.io/api/platform-browser/animations/provideNoopAnimations) |
| [`RouterModule`](https://angular.io/api/router/RouterModule) | [`provideRouter`](https://angular.io/api/router/provideRouter), [`RouterLink`](https://angular.io/api/router/RouterLink), [`RouterLinkActive`](https://angular.io/api/router/RouterLinkActive), [`RouterOutlet`](https://angular.io/api/router/RouterOutlet), [`withDebugTracing`](https://angular.io/api/router/withDebugTracing), [`withDisabledInitialNavigation`](https://angular.io/api/router/withDisabledInitialNavigation), [`withEnabledBlockingInitialNavigation`](https://angular.io/api/router/withEnabledBlockingInitialNavigation), [`withHashLocation`](https://angular.io/api/router/withHashLocation), [`withInMemoryScrolling`](https://angular.io/api/router/withInMemoryScrolling), [`withPreloading`](https://angular.io/api/router/withPreloading), and [`withRouterConfig`](https://angular.io/api/router/withRouterConfig) |
| [`ScrollingModule`](https://material.angular.io/cdk/scrolling/api) | [`CdkFixedSizeVirtualScroll`](https://material.angular.io/cdk/scrolling/api#CdkFixedSizeVirtualScroll), [`CdkScrollable`](https://material.angular.io/cdk/scrolling/api#CdkScrollable), [`CdkVirtualForOf`](https://material.angular.io/cdk/scrolling/api#CdkVirtualForOf), [`CdkVirtualScrollableElement`](https://material.angular.io/cdk/scrolling/api#CdkVirtualScrollableElement), [`CdkVirtualScrollableWindow`](https://material.angular.io/cdk/scrolling/api#CdkVirtualScrollableWindow), and [`CdkVirtualScrollViewport`](https://material.angular.io/cdk/scrolling/api#CdkVirtualScrollViewport) |


> ℹ️ **Note**
> The classic Angular modules can still be used and are not deprecated.

## Standalone vs. classic Angular applications

Due to interoperability between standalone APIs and Angular modules, standalone Angular applications do not require a big bang migration. We can gradually migrate to standalone APIs or use standalone APIs for new features but leave the classic Angular APIs in-place for now.

In Angular version 15.x, picking between standalone and classic Angular applications was mostly a stylistic choice. However, there are already noteworthy differences to consider:
- [`bootstrapApplication`](https://angular.io/api/platform-browser/bootstrapApplication) and [`createApplication`](https://angular.io/api/platform-browser/createApplication) do not support NgZone options unlike [`PlatformRef#bootstrapModule`](https://angular.io/api/core/PlatformRef#bootstrapmodule), making it impossible to exclude Zone.js from our standalone application bundle using these APIs
- The [Directive composition API](https://angular.io/guide/directive-composition-api) only supports standalone directives and components as host directives
- Standalone APIs are easier to teach and learn because of less mental overhead and simpler APIs using native data structures without framework-specific metadata
- The Angular Language Service only supports automatic imports for standalone components
- Component testing is easier with standalone declarables
- Storybook stories are easier with standalone declarables
- Standalone components can be lazy-loaded and dynamically  rendered using [ViewContainerRef#createComponent](https://angular.io/api/core/ViewContainerRef#createcomponent)
- Standalone components can be wrapped in React components as demonstrated by the [ngx-reactify](https://gist.github.com/lacolaco/8e81f61d82327b42f664cdc7080761ac) proof-of-concept Gist
- Standalone components can be rendered and hydrated by [Astro](https://astro.build/) by [using a plugin by Analog.js](https://dev.to/brandontroberts/bringing-angular-components-to-astro-islands-52jp)
- [`@defer` blocks](https://angular.io/guide/defer) only support standalone components in their derrable views

![Red pill: Standalone. Blue pill: NgModules.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/59ix6dlbbsrkcda57rx9.jpg)

>You take the blue pill, the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill, you stay in wonderland, and I show you how deep the rabbit hole goes.
>—Morpheus