---
{
title: "Emulating standalone components using single component Angular modules (SCAMs)",
published: "2020-11-20T21:54:12Z",
edited: "2022-08-28T18:11:59Z",
tags: ["angular", "ivy", "components"],
description: "SCAMs are a safe, View Engine-compatible migration path towards standalone components.",
originalLink: "https://dev.to/this-is-angular/emulating-tree-shakable-components-using-single-component-angular-modules-13do",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "19509",
order: 1
}
---


_Organising your stuff feels good! Cover photo by [Bynder](https://unsplash.com/@bynder) on Unsplash._

_Original publication date: 2019-06-21._

[SCAMs (single component Angular modules)](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2) can emulate standalone components by having an Angular module only be concerned about declaring and exporting a single component. A SCAM instructs the Angular compiler to link **declarable dependencies** (components, directives, and pipes used in a component template) to its component template by importing other SCAMs and fine-grained third-party Angular modules.

We’ll work with a small application containing the zippy component, a button directive with a custom click handler, and the capitalize pipe. To prepare the application for standalone components, we will refactor the application to use SCAMs.

> Please note that truly standalone components will only be possible if Angular adds [the `deps` metadata option for components](https://youtu.be/JX5GGu_7JKc?t=714). A proposal that is at this point only an idea.

We start out with the View Engine application which lists every declarable in its root module. This is how simple applications are often developed, because it’s easy to have a single Angular module and let the Angular framework take care of figuring out the details of linking declarable dependencies to component templates.

The GitHub repository [ngx-zippy-view-engine](https://github.com/LayZeeDK/ngx-zippy-view-engine) is our starting point. You can follow along using [the StackBlitz workspace](https://stackblitz.com/github/LayZeeDK/ngx-zippy-view-engine).

## Scoping the root module to the root component

Every component, directive, and pipe is declared in the root module. We want to have an Angular module per declarable.

```ts
// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ZippyComponent } from './zippy.component';
import { ButtonDirective } from './button.directive';
import { CapitalizePipe } from './capitalize.pipe';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, ButtonDirective, CapitalizePipe, ZippyComponent],
  imports: [BrowserModule],
})
export class AppModule {}
```

_View Engine: Everything declared in `AppModule`._

Components, directives, and pipes can only be declared in a single Angular module. So let’s start by removing all declarations except the root component.

```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule],
})
export class AppModule {}
```

_SCAMs: All declarations except the root component are removed._

If we had widget module imports used by the child components such as Angular Material modules, we would also remove them.

## Creating a SCAM for the zippy component

Let’s create a SCAM for the zippy component.

```html
<!-- zippy.component.html -->
<button appButton (appClick)="onToggle()">
  {{label}}
</button>

<div [hidden]="!isExpanded">
  <ng-content></ng-content>
</div>
```

```ts
// zippy.component.ts
import { Component, Input, NgModule } from '@angular/core';

import { ButtonModule } from './button.directive';

@Component({
  selector: 'app-zippy',
  templateUrl: './zippy.component.html',
})
export class ZippyComponent {
  @Input()
  label = 'Toggle';

  isExpanded = false;

  onToggle() {
    this.isExpanded = !this.isExpanded;
  }
}

@NgModule({
  declarations: [ZippyComponent],
  exports: [ZippyComponent],
  imports: [
    ButtonModule, // [1]
  ],
})
export class ZippyModule {}
```

_Figure 1. The zippy component and its SCAM._

The zippy SCAM declares and exports the zippy component.

![](https://dev-to-uploads.s3.amazonaws.com/i/q36z0al6c0q2y86gcgqp.png) _The transitive compilation scope of the zippy SCAM._

SCAMs for routed components and bootstrapped components do not export their component.

![](https://dev-to-uploads.s3.amazonaws.com/i/rzop9etdqnronxbujhc8.png) _The SCAM for a routed component doesn’t export its component. It also doesn’t configure routes._

![](https://dev-to-uploads.s3.amazonaws.com/i/75kjvn762m0xug9z2ost.png) _The SCAM for a bootstrapped component doesn’t export its component. It also doesn’t add bootstrapping instructions. That is a job for a root Angular module._

SCAMs for dynamic components lists their component as an entry component instead of an exported component (only required in View Engine).

![](https://dev-to-uploads.s3.amazonaws.com/i/azlpr1o1aadszjoptx3w.png) _The SCAM for a dynamic component doesn’t export its component but it lists it as an entry component (only required in View Engine). This instructs the compiler to always include it in an application bundle._

## Creating a SCAM for the button directive

The zippy component uses a button directive in its template. This button directive is a declarable dependency to the zippy component, so we need to import an Angular module that exports it.

In Mark 1 of Figure 1, we imported the button directive’s SCAM, `ButtonModule`. Let’s make sure to create this SCAM.

```ts
// button.directive.ts
import { Directive, EventEmitter, HostListener, NgModule, Output } from '@angular/core';

@Directive({
  selector: '[appButton]',
})
export class ButtonDirective {
  @Output()
  appClick = new EventEmitter<void>();

  @HostListener('click')
  onClick() {
    console.log('Click');
    this.appClick.emit();
  }
}

@NgModule({
  declarations: [ButtonDirective],
  exports: [ButtonDirective],
})
export class ButtonModule {}
```

_The button directive and its SCAM._

Yes, we can create SCAMs for directives and pipes as well. I know the full name (single **component** Angular module) doesn’t make as much sense but let’s stick to a single concept and a single name.

Since directives and pipes don’t have templates, their SCAMs don’t have Angular module imports or entry components. Each of them will only ever have a single declaration and a single exported declarable.

The `ButtonModule` SCAM declares and exports the `ButtonDirective`. It’s as simple as that.

Now the zippy component has all of its declarable dependencies imported and it should work. Let’s return to the `AppComponent`.

```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ZippyModule } from './zippy.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, ZippyModule],
})
export class AppModule {}
```

_The root module now imports the zippy SCAM._

We’ve added the zippy SCAM to the root module’s imports. Let’s look at the component template to see if we have other declarable dependencies.

```ts
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-zippy label="Click me">
      {{ title | capitalize }}
    </app-zippy>
  `,
})
export class AppComponent {
  title = 'single component angular modules';
}
```

_The root component model and template._

The only component used by the root component template is the zippy component. In the projected content, we interpolate the `title` property and pipe it through the `capitalize` pipe.

## Creating a SCAM for the capitalize pipe

The capitalize pipe is another declarable dependency. Let’s create a capitalize SCAM.

```ts
// capitalize.pipe.ts
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string) {
    return value
      .split(/\s+/g)
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(' ');
  }
}

@NgModule({
  declarations: [CapitalizePipe],
  exports: [CapitalizePipe],
})
export class CapitalizeModule {}
```

_The capitalize pipe and its SCAM._

Similar to a directive’s SCAM, a pipe’s SCAM only declares and exports a pipe. The `CapitalizeModule` declares and exports the `CapitalizePipe`. A component that uses this pipe must import its SCAM.

Let’s go back to the `AppModule` and add the capitalize SCAM.

```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CapitalizeModule } from './capitalize.pipe';
import { ZippyModule } from './zippy.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, CapitalizeModule, ZippyModule],
})
export class AppModule {}
```

_The root module now imports the capitalize SCAM._

Great, the application is now refactored from having all declarations in the root module to having a single Angular module per declarable.

![](https://dev-to-uploads.s3.amazonaws.com/i/we0mb1rpod6ru6rtkl2f.png) _The transitive compilation scope of the root Angular module._

The GitHub repository [ngx-zippy-scams](https://github.com/LayZeeDK/ngx-zippy-scams) contains the resulting application. You can also see a live version in [this StackBlitz workspace](https://stackblitz.com/github/LayZeeDK/ngx-zippy-scams).

## Transitive compilation scope in the original application

You know, having all declarations in the same Angular module is pretty mind-boggling. The zippy component uses the button directive. The root component uses the zippy component and the capitalize pipe.

So we have a nested component tree, but all components are declared by the same Angular module.

For a component template to work, Angular needs to know how to map component selectors to components, directive selectors to directives and pipe names to pipes. Angular will consider the Angular module declaring the component. The declaring Angular module has [a transitive compilation scope](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2#transitive-module-scope) which lists these mappings to declarables.

The `ZippyComponent` uses the `ButtonDirective`. They were both declared by the `AppModule` in the original application. The declarable dependency is linked and the component template can be compiled.

The `AppComponent` uses the `ZippyComponent` and the `CapitalizePipe`. They were all declared by the `AppModule` in the original application. The declarable dependencies are linked and the component template can be compiled.

> In short, when all declarations are in the same Angular module, they all share the same transitive compilation scope.

## The transitive compilation scopes in a SCAM application

In an application using SCAMs such as our refactored zippy application, all components have a transitive compilation scope that matches exactly the declarable dependencies used by their templates. Nothing more, nothing less.

A SCAM’s [transitive exported scope](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2#transitive-exported-scope) consists at most of its specific declarable. A routed or bootstrapped component’s SCAMs will have an empty transitive exported scope. This is also the case for a dynamic component’s SCAM, but it will instead list the component as an entry component liked mentioned in a previous section.

## Standalone components

![](https://dev-to-uploads.s3.amazonaws.com/i/rk7jf56n4ubg6ov4z7xp.jpeg) _Photo by [Providence Doucet](https://unsplash.com/@providence) on Unsplash._

One of the main reasons for using SCAMs is to end up with [standalone components](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2#tree-shakable-components) having [local component scopes](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2#local-component-scope). With the Ivy rewrite, every component is treated as an entry component, meaning that it can be dynamically rendered, it can be routed and it can be bootstrapped.

In the View Engine—the current Angular rendering engine—entry components cannot be tree shaked from our application bundles. Their entry component metadata annotations are there to explicitly instruct the compiler to always include them, even though they might not be used in any component templates.

[The proposal for adding a `deps` metadata option](https://youtu.be/JX5GGu_7JKc?t=714) to Angular component and element decorator factories represents true standalone components since every declarable dependency must be directly referenced in the metadata of the component using it. So if a declarable is unused, it will not be referenced in the `deps` option of any component or element and therefore not listed in any `import` statement. Because of this, it can be tree shaked away by our build process.

For the longest time, the [Angular Devkit Build Optimizer](https://www.npmjs.com/package/@angular-devkit/build-optimizer) has been able to tree-shake away declarables that are not mentioned in component templates, even if they are in the exported compilation scope of Angular modules that we import or if they are declared in Angular modules in our application. The exception is components that are explicitly listed as entry components. These components can’t be left out of our application bundles by the build optimizer.

## Testing components is easier with SCAMs

![](https://dev-to-uploads.s3.amazonaws.com/i/0c2lkrtmkjy5t3x914q9.jpeg) _Photo by [Louis Reed](https://unsplash.com/@_louisreed) on Unsplash._

SCAMs import exactly the declarables needed to render a single component template. This makes them useful for component testing, since we won’t have to configure as many options in the testing module or use shallow rendering.

## Identifying unused imports is easier with SCAMs

![](https://dev-to-uploads.s3.amazonaws.com/i/iqgtylzfucg6mct49sql.jpeg) _Photo by [Alexander Csontala](https://unsplash.com/@csontala) on Unsplash._

In an Angular module with many declarations, how will we identify imports that are unused? We would have to go through the component template of every component declared by the Angular module.

As I mentioned in the section *Standalone components*, the build optimizer will shake unused declarables from our bundles, but they are unable to exclude entry components. On a side note, we also cannot tree shake dependencies listed in the `providers` metadata of an Angular module that we import. So too many imported Angular modules might increase our application bundle despite using the build optimizer.

Using SCAMs, we only have to consider a single component template to check whether we have unused imported Angular modules. For every component, directive, and pipe used in the component template, its SCAM imports another SCAM or a third-party Angular module.

## Code-splitting on the component level

![](https://dev-to-uploads.s3.amazonaws.com/i/1cpw9i3tttlyekptkm3g.jpeg) _Photo by [Tim Krauss](https://unsplash.com/@carsbytim) on Unsplash._

When we scope an Angular module to a single component, we can split our code on the component level. We can do so using lazy loaded routes, the `"lazyModule"` option in `angular.json` and dynamic `import()`s. Alternatively, we can compile a component as a separate library and lazy load it, again by using a dynamic `import()`.

## The elephant in the room

![](https://dev-to-uploads.s3.amazonaws.com/i/bitdchlvv82rxe7eytsz.jpeg) _Photo by [Daniel Brubaker](https://unsplash.com/@dpmb87) on Unsplash._

As mentioned in the previous section, SCAMs bring some benefits to the table but not everything is golden. SCAMs mean more Angular modules since we will have one for every component, directive, and pipe in our application.

You might be aware that [I’m on a mission to get rid of all Angular modules](https://youtu.be/DA3efofhpq4). SCAMs are a means to an end. They are a safe, View Engine-compatible migration path towards standalone components. While I can give you no promise that [the proposed component API](https://www.youtube.com/watch?v=JX5GGu_7JKc&feature=youtu.be&t=714) will become part of Angular, we should all give our feedback to the Angular team about whether this is useful to our applications and use cases.

## Summary

SCAMs (single component Angular modules) are Angular modules that are scoped to a single declarable. For directives and pipes, they declare and export a single declarable.

A SCAM will declare its component. It will import an Angular module for every declarable dependency in the component template. Most components will be exported by their SCAM. However, routed and bootstrapped components will not be exported. Dynamically rendered components will not be exported by their SCAM, but they will be listed as an entry component.

The end goal is to have standalone components. That will become possible if the `deps` option makes it past the proposal stage. With standalone components, a component that is used in the application will be referenced. If it’s unused, no other component will reference it.

Ivy allows all components to be dynamically rendered or bootstrapped if we use experimental APIs. In future articles, we will explore those experimental Ivy APIs to create compilation scopes with less Angular modules and references.

## Resources

The initial zippy application:

- [GitHub repository](https://github.com/LayZeeDK/ngx-zippy-view-engine)
- [StackBlitz workspace](https://stackblitz.com/github/LayZeeDK/ngx-zippy-view-engine)

The zippy application refactored using SCAMs:

- [GitHub repository](https://github.com/LayZeeDK/ngx-zippy-scams)
- [StackBlitz workspace](https://stackblitz.com/github/LayZeeDK/ngx-zippy-scams)

Slides for my talk “Angular revisited: Tree-shakable components and optional NgModules”:

{% speakerdeck a37afcc56cc1462793fdc4ae7038bb34 %}

In this talk, I introduce additional techniques for getting rid of some of our Angular modules today, using experimental Ivy APIs for change detection and rendering.

Here’s the recording of my talk presented at ngVikings 2019 in Copenhagen:

{% youtube DA3efofhpq4 %}

## Related articles

Standalone components is just one of the techniques used to make Angular modules optional. Read what you can expect from the upcoming Angular Ivy era in “[Angular revisited: Tree-shakable components and optional NgModules](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2)”.

## Peer reviewers

I had help shaping up this article for your enjoyment. Thank you, dear reviewers 🙇‍♂️ Your help is much appreciated.

- [Alexey Zuev](https://twitter.com/yurzui)
- [Max Koretskyi](https://twitter.com/maxkoretskyi)
- [Nacho Vazquez](https://twitter.com/nacho_vazquez14)
