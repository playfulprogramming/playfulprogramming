---
{
title: "The Tree Shaking Journey in Angular: A Deep Dive",
published: "2024-12-23T17:08:33Z",
tags: ["angular", "modern", "treeshaking", "santoshyadavdev"],
description: "Hey friends, how are you doing? This year, I tried a new Angular version and wanted to experiment...",
originalLink: "https://www.santoshyadav.dev/blog/2024-12-20-the-tree-shaking-journey-in-angular-a-deep-dive/",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---


Hey friends, how are you doing? This year, I tried a new Angular version and wanted to experiment with how the tree shaking works with the latest version, especially once the standalone components came into the game. The result surprised me, so let's learn what has improved and what you need to do to improve your build time and optimize your production bundle.

## What is Tree Shaking?

Before we jump into the topic, let's understand tree shaking. The build tools we use can remove unused/dead code from your final production bundle; this is what we mean by tree shaking. Most Javascript tools today support tree shaking out of the box.

Let's take the code below, for example, where we have two methods, `add`  and `sub`.

```Javascript
export function add(a,b){
	return a+b;
}
 
export function sub(a,b){
	return a-b;
}
```

Let's say we only consume the `add` function. What happened to the `sub` function? The build tools are smart enough to remove it from the final prod bundle, so you only get `add,` which is used in our code.


## What is Nx

This blogs is not about Nx, but as we are going to use it, we should know about Nx, Nx is a build tool with monorepo support and can help improve your build time and optimize CI time.

## Angular secondary-entrypoints

One more term used in this blog is secondary-entrypoints, I recommend watching this stream I did you YouTube

{% youtube FH3i0yKOi8U %}

## Tree Shaking with Angular libraries

For an extended period, tree shaking with Angular libraries is supported when using secondary-entrypoints, which is supported by [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/main/docs/secondary-entrypoints.md).

And if you use Nx, Nx provides a secondary-entrypoints generator to work with the libraries.

Most of us use the above tools when we want our Angular application to drop dead code or do tree shaking.

But what if you dont need to do this anymore? Dont need a big statement, but you only sometimes need to do secondary-entrypoint for tree shaking.


> Please use the standalone component by default. I am showing examples with the module if you cannot use standalone yet. This means you are not on Angular 14 or above. You will not see the tree-shaking advantages, but you can make your code future-proof, and as soon as you upgrade to Angular 16, you will get tree-shaking out of the box.


### Let's dive into the code

I suggest writing some code to understand the entire tree-shaking process. For this purpose, I will use an Nx workspace to manage multiple projects, as it is my go-to tool for writing new code.

Create A New App

``` shell
npx create-nx-workspace

✔ Where would you like to create your workspace? · tree-shaking-demo
✔ Which stack do you want to use? · angular
✔ Integrated monorepo, or standalone project? · integrated
✔ Application name · hello-world
✔ Which bundler would you like to use? · esbuild
✔ Default stylesheet format · css
✔ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? · No
✔ Test runner to use for end to end (E2E) tests · none
✔ Which CI provider would you like to use? · skip
✔ Would you like remote caching to make your build faster? · skip

```

### Library with single module exporting multiple components

One practice I have seen often in large codebases is having a God module. It's a made-up name, but the idea is to have one module export all the library's components. Talk is cheap; let's see the code to understand what we mean by God modules.

With Nx, we will keep our libraries under the `libs` folder; just a small piece of information with Nx 16 and above, you can keep your library anywhere within the workspace. Go ahead and run the below command to create god-module-lib if you notice we are passing the `standalone=false` flag as we want to use module for this library

``` shell
npx nx generate @nx/angular:library --directory=libs/god-module-lib --buildable=true --name=god-module-lib --standalone=false --no-interactive 
```

Let's add a few dummy components in this library and export via the module.

``` shell
npx nx generate @nx/angular:component --path=libs/god-module-lib/src/lib/table/table --export=true --standalone=false --module=god-module-lib.module.ts --no-interactive --dry-run 

npx nx generate @nx/angular:component --path=libs/god-module-lib/src/lib/button/button --export=true --standalone=false --module=god-module-lib.module.ts --no-interactive --dry-run 
``` 

In the next step, let's use this module in our Application; as the Application is created with the standalone flag by default, we will not find any modules, let's add `GodModuleLibModule` to our `app.component.ts`

```ts
import { GodModuleLibModule } from '@tree-shaking-demo/god-module-lib';

@Component({
 imports: [ RouterModule, GodModuleLibModule],
})
export class AppComponent {
 title = 'hello-world';
}
```

and let's use `button`  component in the template `app.component.html`

``` html
<lib-button/>

```

Once added, let's run the build with the sourceMap flag, which we will use to  generate the bundle report:

``` shell
nx run hello-world:build:production --sourceMap

npx source-map-explorer dist/apps/hello-world/browser/*.* --html report/hello-world.html
```


![main bundle shows 395 Bytes of code from the GodModuleLibModule](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/37tqne69tt9p62mntlww.png)


Once you open the report, you will find 395 Bytes of code from the `GodModuleLibModule`. It only includes the button component code we use in our template. Now, do the same exercise on the Angular version you are using. I tried with Angular 14, and I got the code for both the Button and Table. 

Angular is becoming smart at identifying dead code. If you have code with GodModule exporting multiple components, your app will still benefit from tree shaking. 

But there is a catch again: What if we have modules for the Button and Table components that are being exported from `GodModuleLibModule`?


### Convert Library to use multiple Angular modules 

Now, in this exercise, we will split Table and Button to have their modules and re-export them via the GodModuleLibModule

Let's add ButtonModule under the `button` folder and TableModule under `table`.

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@NgModule({
 imports: [CommonModule],
 declarations: [ButtonComponent],
 exports: [ButtonComponent],
})
export class ButtonModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';

@NgModule({
 imports: [CommonModule],
 declarations: [TableComponent],
 exports: [TableComponent],
})
export class TableModule {}

```
and update index.ts file

```ts
export * from './lib/god-module-lib.module';

export * from './lib/button/button.component';
export * from './lib/button/button.module';

export * from './lib/table/table.component';
export * from './lib/table/table.module';
```

Lets run the build and generate the report again 

``` shell
nx run hello-world:build:production --sourceMap

npx source-map-explorer dist/apps/hello-world/browser/*.* --html report/hello-world-individual-module.html
```

Oh, wow. The bundle size is almost double; it's 701 Bytes now, and you can see the code for the table. The module is part of your bundle, though it's unused.

Let's move to another exercise, drop the module, and use a standalone component.


![The main bundle size is almost double; it's 701 Bytes now](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wdyrips57lf8lqxne0eu.png)


### Convert lib to use a standalone component 

To convert to standalone, we do have a migration from Angular, but this is a small app; we can do it manually let's delete `GodModuleLibModule` `ButtonModule`, and `TableModule` files

Now go to `button.component.ts` and `table.component.ts` and update the below line 

```ts
 standalone: false --> true,
```

after this update, your index.ts

``` ts
export * from './lib/button/button.component';

export * from './lib/table/table.component';
```
It is much cleaner right now. We are just importing the components. 

Next, go to your app and update the import in `app.component.ts`

``` ts
import { GodModuleLibModule } from '@tree-shaking-demo/god-module-lib';

To 

import { ButtonComponent } from '@tree-shaking-demo/god-module-lib';

and 

imports: [GodModuleLibModule --> ButtonComponent],

```

We are all set to rerun the build and report, and wow, we have only 234 Bytes, and it includes only Button Code.

``` shell
nx run hello-world:build:production --sourceMap

npx source-map-explorer dist/apps/hello-world/browser/*.* --html report/standalone.html
```

![The main bundle contains only button code which is 234 Bytes](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2vd42fq20p9t2qblgph2.png)


### Using a publishable library 

Let's create a library and publish it to see how tree shaking works:

```shell
npx nx generate @nx/angular:library --directory=libs/ng-publishable --publishable=true --importPath=@ngx-santosh/ng-publishable --no-interactive 
```

Let's add a few components; we will go with standalone components:

```shell
npx nx generate @nx/angular:component --path=libs/ng-publishable/src/lib/accordion --export=true --no-interactive

npx nx generate @nx/angular:component --path=libs/ng-publishable/src/lib/grid --export=true --no-interactive
```

Let's publish the library and use `GridComponent` in our Application:

```typescript
import {GridComponent, AccordionComponent} from '@ngx-santosh/ng-publishable';

@Component({
 imports: [GridComponent],
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrl: './app.component.css',
})
export class AppComponent {
 title = 'hello-world';
}
```

And add the Grid component to the template.

```html
<lib-grid/>
```

lets run the build and generate the bundle again 

```shell
nx run hello-world:build:production --sourceMap

npx source-map-explorer dist/apps/hello-world/browser/*.* --html report/hello-world-publish-libs.html  
```


![main bundle shows 248 Bytes of grid component code](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pmeh19gi5yc16wvvh3s3.png)

We still get the tree shaking with publishable libraries. The final code contains only 248 Bytes of grid component code, and once you add more components, you only pay for those components.

Another advantage of the secondary-entrypoint is if we are using any third-party library, such as lodash, Angular build can drop lodash if the component where lodash is used is not part of the code. What happens if we are using lodash but dont have a secondary-entrypoint? Does tree-shaking still work? Good news, yes, it will work without the secondary entry point.

### Library with secondary-entrypoints

Why should we still read this section and go with secondary-entrypoints even though we have only been able to get the minimal code in the production bundle with standalone components in the exercise so far? 

Remember, once your library becomes too big and has hundreds of imports, which is a common scenario for most developers working on the design system.

If you are not publishing your library on artifactory, I recommend splitting them into smaller libraries; if you are using Nx, you can get the build cache, which will help you improve your build and test times.

But for publishable libraries, where we need to bundle all code into a single package and publish on an artifactory, splitting to smaller libs is not an option; in this case, I recommend going with secondary-entry points.

Another advantage of the secondary-entrypoint is if we use any third-party library, such as lodash, Angular build can drop lodash if the component where lodash is used is not part of the code. What happens if we are using lodash but dont have a secondary-entrypoint? Does tree-shaking still work? 
Good news, yes, it will work without the secondary entry point.


## Some closing notes

1. If you are using Angular 14 or below, the exercise we did may not work to reduce your bundle size, but my recommendation is to start adopting standalone. Once you migrate to Angular 15, use `ng g @angular/core:standalone` to get the minimal code in your final production bundle.
1. The above suggestion applies to your application and library code.
1. For libraries with a lot of components, 
  * I recommend splitting them into smaller libs.
  * If it is publishable, I recommend going with secondary-entrypoint.
1. With Latest Angular language service you get warning in IDE if you are importing unused Component
1. The new Angular compiler can warn you during build if you have unused import 


<BlogImage src={buildwarning} alt="The new Angular compiler can warn you during build if you have unused import " />


> The angular compiler is improving, and it's great to see we dont need to always reach out to secondary-entrypoints with libraries to get the advantage of tree shaking, so what are you waiting for? Adopt a newer version of Angular and get small bundles and better tree shaking.

I am also happy that developers can focus more on writing code and stop worrying about making the libraries tree shakable when using Angular.

You can find the code used in this exercise below
- [Nx Application and buildable libs](https://github.com/santoshyadavdev/tree-shaking-demo)
- [Angular Publishable libs](https://github.com/santoshyadavdev/angular-publishable)

So go ahead and try this on our codebase and share your story. Did it help you and your team shave off some KBs from your prod bundle?


Shout out to my GitHub Sponsors for supporting my work on Open Source.
- [CodeRabbit](https://www.coderabbit.ai/)
- [Cometa.rocks](https://github.com/cometa-rocks/)
- [Umair](https://twitter.com/_UmairHafeez_)
- [Anand](https://twitter.com/AnandChowdhary)
- [Sunil](https://twitter.com/sunil_designer)