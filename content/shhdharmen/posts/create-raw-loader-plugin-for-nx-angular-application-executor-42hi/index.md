---
{
title: "Create Raw Loader Plugin for NX Angular Application Executor",
published: "2025-07-06T09:09:52Z",
edited: "2025-07-09T14:47:30Z",
tags: ["angular", "nx", "typescript", "javascript"],
description: "In this article I am going to share the plugin I created for Angular Material Blocks to preview code...",
originalLink: "https://blog.shhdharmen.me/create-raw-loader-for-nx-angular-application-executor"
}
---

In this article I am going to share the plugin I created for [Angular Material Blocks](https://ui.angular-material.dev/blocks) to preview code contents from files!

## TL;DR

If you are simply interested in plugin code, jump to [Creating and using plugin](#creating-and-using-the-plugin) section!

## Why NX?

Before starting to work on [Angular Material Blocks](https://ui.angular-material.dev/blocks), I spent some days on deciding whether I should create a project using Angular CLI or NX.

While Angular CLI is great for many use-cases, including projects with multiple [libraries](https://angular.dev/cli/generate/library) and [applications](https://angular.dev/cli/generate/application). But, NX provides many more add-ons by default. You can read about all differences [here](https://nx.dev/technologies/angular/recipes/nx-and-angular), but below are some key points which benefited me a lot while working with NX:

1. Generators & Executors

2. Building, Testing [**Only What is Affected**](https://nx.dev/features/run-tasks#run-tasks-on-projects-affected-by-a-pr)

3. [Extensible Plugin System](https://nx.dev/extending-nx/intro/getting-started)

4. Environment variables from `.env` files

5. [Enforced Module Boundaries](https://nx.dev/features/enforce-module-boundaries)

## Why raw loader plugin?

When I started working on [Angular Material Blocks](https://ui.angular-material.dev/blocks), I needed some functionality which would allow me to import code snippets as constants without any extra efforts.

For example, take a look at below screenshot of [Badge 1 block](https://ui.angular-material.dev/blocks/application/elements/badges#badge-1) where I show raw contents from components files (HTML templates, TS class contents and CSS/SCSS style contents) along with preview.

![Screenshot of a code editor showing HTML code for a badge component. The code uses Angular directives to create a chip set that dynamically displays badges with icons based on their trend. The editor tabs for HTML, TypeScript, and SCSS files are visible.](./0df6ea3a-0ef1-43c5-9a26-5914580351a6.png)

But, NX does not have a built-in mechanism to import raw contents, so I had to create a custom plugin so that I can easily import raw contents from any files (mainly HTML, TS, CSS/SCSS).

## Usage pattern

Before creating the plugin, I needed to finalize the pattern how I am going to use the plugin. I prefer how [vite builder supports importing asset as string](https://vite.dev/guide/assets.html#importing-asset-as-string) like below:

```
import shaderString from './shader.glsl?raw'
```

So my goal was create a plugin named 'raw' that enables importing files as raw text content using the `?raw` query parameter syntax.

## Creating and using the plugin

Please note that I am using [`@nx/angular:application`](https://nx.dev/technologies/angular/api/executors/application) executor, and it supports custom [ESBuild plugins](https://esbuild.github.io/plugins/), hence the code will be compatible to only [`@nx/angular:application`](https://nx.dev/technologies/angular/api/executors/application) or [`@nx/angular:browser-esbuild`](https://nx.dev/technologies/angular/api/executors/browser-esbuild) executors.

### The `raw-loader` plugin

Start by creating a file at `plugins/raw-loader-plugin.js` with below content:

```javascript
import { readFileSync } from 'fs';
import * as path from 'path';

const rawLoaderPlugin = {
  name: 'raw',
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, args => {
      return {
        path: path.isAbsolute(args.path)
          ? args.path
          : path.join(args.resolveDir, args.path),
        namespace: 'raw-loader',
      };
    });
    build.onLoad({ filter: /\?raw$/, namespace: 'raw-loader' }, async args => {
      return {
        contents: readFileSync(args.path.replace(/\?raw$/, '')),
        loader: 'text',
      };
    });
  },
};

module.exports = rawLoaderPlugin;

```

Below the explanation of the above code:

1. `setup(build) { ... }` - This is the core function of an ESBuild plugin. It takes a `build` object as an argument, which provides methods to interact with the ESBuild build process. Inside this `setup` function, we define how our plugin will handle specific types of imports.

2. **Import Resolution Hook -** The `onResolve` hook intercepts any import paths ending with `?raw` using the regex filter `/?raw$/`

3. **Path Handling** : When a `?raw` import is detected, it resolves the absolute path by checking if the path is already absolute, or joining it with the resolver directory if it's relative

4. **Namespace Assignment** : Resolved `?raw` imports are assigned to the 'raw-loader' namespace to separate them from normal module processing

5. **File Loading Hook** : The `onLoad` hook handles files in the 'raw-loader' namespace that match the `?raw` filter pattern

6. **Raw Content Extraction** : The plugin strips the `?raw` suffix from the file path using `replace(/\?raw$/, '')` and reads the actual file content using Node.js `readFileSync`

7. **Text Loader** : The file contents are returned with `loader: 'text'`, which tells ESBuild to treat the content as plain text rather than JavaScript/TypeScript code

8. **Usage Result** : This allows me to import the raw source code content of files as strings, bypassing normal module compilation and getting the literal file contents instead

### Providing the `raw-loader` plugin

To provide the plugin to your Angular application, simply add it in the `plugins` array in your projects `project.json`'s `targets.build.options` property, read more [here](https://nx.dev/technologies/angular/api/executors/browser-esbuild#examples):

```json
{
  "targets": {
    "build": {
      "executor": "@nx/angular:application",
      "options": {
        "plugins": [
          "plugins/raw-loader-plugin.js"
        ]
      }
    }
  }
}

```

### Using the `raw-loader` plugin

Now, to use the plugin, simply use the query parameter `?raw` with file-extension when you import:

```typescript
import deviceServiceContent from 'path/to/device.service.ts?raw';

// prints raw TS content of device.service.ts file
console.log(deviceServiceContent)

```

### Handling TypeScript errors

If you use the raw-loader as explained above, you will start getting TS errors like below:

```
Cannot find module 'path/to/device.service.ts?raw' or its corresponding type declarations.
```

The reasons you will get above error are as below:

- **Missing Type Definitions** : TypeScript doesn't have built-in type definitions for the `?raw` import syntax, so it cannot understand what type the imported value should be

- **Custom Import Syntax** : The `?raw` query parameter is a custom ESBuild plugin feature, not a standard TypeScript or JavaScript import mechanism that TypeScript recognizes

- **Runtime vs Compile Time** : While the ESBuild plugin could handle the `?raw` imports at build time, TypeScript's type checker runs separately and doesn't know about this custom transformation

- **Type Inference Failure** : TypeScript cannot infer that `deviceServiceContent` should be of type `string` because it doesn't understand that `?raw` imports return file contents as text

To handle the error or to achieve error suppression, there are 2 ways:

1. Adding type definition (recommended)

2. Adding inline comment

#### Adding type definition (recommended)

Create a file `types.d.ts` at root of the project with below content:

```typescript
declare module '*?raw' {
  const content: string;
  export default content;
}

```

Then, add `types.d.ts` file in `include` array of `tsconfig.base.json`:

```
{ "include": ["types.d.ts"]}
```

Do not forget to make same changes in all your applications and libraries tsconfig files!

Once you are done adding the files, you may want to close and re-open the editor to make TS compiler stop complaining.

#### Adding inline comment

If you do not want to create type definition, you can add inline comment just above the import statement:

```typescript
// @ts-expect-error TypeScript cannot provide types for raw-loader
import deviceServiceContent from 'path/to/device.service.ts?raw';

```

The `@ts-expect-error` directive tells TypeScript to ignore the type error on the next line, acknowledging that this specific import will work at runtime despite TypeScript's confusion.

## Achieving similar functionality in Angular CLI workspace

If you are using Angular CLI workspace, and want to achieve similar functionality, like reading the raw content of any file, there is a built-in feature available with [application builder](https://angular.dev/tools/cli/build-system-migration) from Angular version 17.

### Import attribute loader customization

You can use `loader` import attribute with `import` statement to customize the loading behavior.

```typescript
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import contents from './some-file.svg' with { loader: 'text' };

```

TypeScript currently lacks support for type definitions derived from import attribute values. For now, you'll need to use either `@ts-expect-error`/`@ts-ignore` or separate type definition files (if they're consistently imported with the same loader attribute).

You can read more about it on [angular.dev](https://angular.dev/tools/cli/build-system-migration#import-attribute-loader-customization).

---

## Angular Material Blocks

I am running a limited time 20% discount on Personal & Teams licenses for lifetime access on [Angular Material Blocks](https://ui.angular-material.dev/home)! Do not forget to check it out and grab this deal!

[![](./GrqA5u4WgAALuc1?format=jpg\&name=medium)](https://ui.angular-material.dev/home#pricing)
