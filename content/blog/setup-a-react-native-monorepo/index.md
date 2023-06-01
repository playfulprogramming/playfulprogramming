---
{
	title: "How to Setup a React Native Monorepo",
	description: "",
	published: '2023-06-02T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['react', 'react native'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

[React Native](https://reactnative.dev/) allows you to write React code that outputs to native applications for various platforms, including:

- Android
- iOS
- Windows
- macOS

It's an undeniably powerful way to share code between web applications and your mobile apps; particularly within small teams that either don't have the knowledge or the capacity to go fully native.

Similarly, [monorepos](https://monorepo.tools/) can be a fantastic way to share code between multiple projects with a similar tech stack.

Combined together and even a small team can maintain multiple React Native applications seamlessly.

![TODO](./rn_monorepo.png)

Unfortunately, it can be rather challenging to build out a monorepo that properly supports React Native. While [Expo supports monorepo usage](https://docs.expo.dev/guides/monorepos/), one common complaint when using Expo is that [Expo does not support many popular React Native libraries that require native code](https://web.archive.org/web/20230321191807/https://docs.expo.dev/introduction/why-not-expo/#expo-go).

To further exacerbate the issue, React Native comes with many uncommon edgecases that makes monorepos particularly challenging to create. Many of the tutorials I've found outlining how to build a monorepo for this purpose use outdated tools to work around this.

Knowing just how potent the potential impact of a monorepo would be to my projects, I disregarded these headaches and spent a month or two building out a monorepo that solved my problems.

By the end of it all, I had a monorepo structure that looked something like the following:

<!-- filetree:start -->

- `apps/`
  - `customer-portal/{open: false}`
      - `android/`
      - `ios/`
      - `src`
          - `App.tsx`
          - `components/`
          - `hooks/`
          - `utils/`
          - `types/`
      - `.eslintrc.js`
      - `app.json`
      - `babel.config.js`
      - `index.js`
      - `metro.config.js`
      - `node_modules`
      - `package.json`
      - `tsconfig.json`
  - `admin-portal/{open: false}`
      - `android/`
      - `ios/`
      - `src`
          - `App.tsx`
          - `components/`
          - `hooks/`
          - `utils/`
          - `types/`
      - `.eslintrc.js`
      - `app.json`
      - `babel.config.js`
      - `index.js`
      - `metro.config.js`
      - `node_modules`
      - `package.json`
      - `tsconfig.json`
- `packages/`
  - `config/{open: false}`
    - `.eslintrc.js`
    - `babel-config.js`
    - `eslint-preset.js`
    - `package.json`
    - `tsconfig.json`
  - `shared-elements/{open: false}`
    -  `src/`
       -  `components/`
       -  `hooks/`
       -  `utils/`
       -  `types/`
    -  `.eslintrc.js`
    -  `package.json`
    -  `vite.config.ts`
- `.eslintrc.js`
- `.gitignore`
- `.yarnrc.yml`
- `README.md`
- `package.json`
- `yarn.lock`

<!-- filetree:end -->


I'd like to share how you can do the same in this article. Let's walk through how to:

- [Set up a React Native app](#setup-app)

- [Have multiple `package.json` files for each app and package](#yarn-berry)
- [Run interdependent tasks in your monorepo easily](#turborepo)
- [Fix issues with React Native's bundler](#metro)
- [Build basic shared React Native components](#building-components)
- [Style shared components](#styled-components)
- [Test your shared application logic](#jest)
- [Enforce consistent project configuration across your monorepo](#config-package)
- [Prepare for further code sharing](#conclusion)

# Setup React Native Project {#setup-app}

Let's setup a basic React Native project to extend using a monorepo.

> Before you get started with this section, make sure you have [your environment set up](https://reactnative.dev/docs/environment-setup), including XCode/Android Studio.

To setup a basic React Native project from scratch, run the following:

```shell
npx react-native init CustomerPortal
```

Once this command finishes, you should have a functioning React Native project scaffolded in `CustomerPortal` folder:

<!-- filetree:start -->

- `android/`
- `ios/`
- `.eslintrc.js`
- `app.json`
- `App.tsx`
- `babel.config.js`
- `index.js`
- `metro.config.js`
- `node_modules`
- `package.json`
- `tsconfig.json`

<!-- filetree:end -->

We now have a basic demo application that we can extend by adding it to our monorepo.

To start setting up the monorepo, take the following actions:

1. Move the generated files into a sub-folder of `apps` called `customer-portal`.
2. Run `npm init` at the new root to create a `package.json`
3. Run `git init` at the new root to create a Git repository to track your code changes
4. Add a `.gitignore` (you can copy it from your app) at the new root to make sure you're not tracking new `node_modules`

<!-- filetree:start -->

- `.git/`
- `apps/`
  - `customer-portal/{open: false}`
    - `android/`
    - `ios/`
    - `.eslintrc.js`
    - `app.json`
    - `App.tsx`
    - `babel.config.js`
    - `index.js`
    - `metro.config.js`
    - `node_modules`
    - `package.json`
    - `tsconfig.json`
- `.gitignore`
- `package.json`

<!-- filetree:end -->

Congrats! You _technically_ now have a monorepo, even if it's currently missing many conviniences of a well-established monorepo.


# Maintain Multiple Package Roots with Yarn {#yarn}

Let's imagine that we've taken our newly created monorepo and added a second application inside:

<!-- filetree:start -->

- `apps/`
  - `customer-portal/`
      - `package.json`
      - ...
  - `admin-portal/`
      - `package.json`
      - ...
- `.gitignore`
- `package.json`

<!-- filetree:end -->

Notice how each of our sub-projects has it's own `package.json`? This allows us to split out our dependencies based on which project requires them, rather than having a single global `package.json` with every project's dependencies in it.

However, without any additional configuration, it means that we need to `npm install` in every subdirectory manually to get our projects setup.

What if there was a way to have a single `install` command that installed all packages for all `package.json` files in our repo? Well, we can!

To do this, we need some kind of "workspace" support, which tells our package manager to install deps from every `package.json` in our system.

Here are the most popular Node package managers that support workspaces:

- [`npm`](https://docs.npmjs.com/cli/v7/using-npm/workspaces) (as of v7)
- [`yarn`](https://yarnpkg.com/)
- [`pnpm`](https://pnpm.io/)

While NPM is often reached for as the default package manager for Node apps, it lacks a big feature that's a nice-to-have in large-scale monorepos: Patching NPM packages.

While NPM can [use a third-party package](https://www.npmjs.com/package/patch-package) to enable this functionality, it has shakey support for monorepos. Compare this to PNPM and Yarn which both have this functionality built-in for monorepos.

This leaves us with a choice between `pnpm` and `yarn` for our package manager in our monorepo.

While pnpm is well loved by developers for [it's offline functionality](https://pnpm.io/cli/install#--offline), I've had more experience with Yarn and found it to work well for my needs.

## Installing Yarn 3 (Berry)

When most people talk about using Yarn, they're often talking about using Yarn v1 which [originally launched in 2017](https://github.com/yarnpkg/yarn/releases/tag/v1.0.0). While Yarn v1 works for most needs, I've ran into bugs with its monorepo support that halted progress at times.

Here's the bad news: Yarn v1's [last release was in 2022](https://github.com/yarnpkg/yarn/releases/tag/v1.22.19) and is [in maintainance mode](https://github.com/yarnpkg/yarn/issues/8583#issuecomment-783161589).

Here's the good news: Yarn has continued development with breaking changes and is now on Yarn 3. These newer versions of Yarn are colloquially called ["Yarn Berry"](https://github.com/yarnpkg/berry).

To setup Yarn Berry from your project, you'll need:

- Node 16 or higher
- ... That's it.

While there's more extensive documentation on [how to install Yarn on their docs pages](https://yarnpkg.com/getting-started/install), you need to enable [Corepack](https://nodejs.org/dist/latest/docs/api/corepack.html) by running the following in your terminal:

```shell
corepack enable
```

Then, you can run the following:

````shell
corepack prepare yarn@stable --activate
````

And finally:

```shell
yarn set version stable
```

This will download the `yarn-3.x.x.cjs` file, configure a `.yarnrc.yml` file, and add the information required to your `package.json` file.

> Wait! **Don't run `yarn install` yet!** We still have some more configuration to do! 

## Disabling Yarn Plug'n'Play (PNP)

By default, Yarn Berry uses a method of installing your packages called `Yarn Plug'n'Play` (PNP), which allows you to commit your `node_modules` cache to your Git repository.

[Because of React Native's incompatibility with Yarn PNP](https://yarnpkg.com/features/pnp#incompatible), we need to disable it. To do this, we update out `.yarnrc.yml` file to _add_:

```yml
nodeLinker: node-modules
```

> It's worth mentioning that while PNPM doesn't use PNP as its install mechanism, it does extensively use symlinks for monorepos. If you're using PNPM for your project, you'll likely want to [disable the symlinking functionality for your monorepo](https://pnpm.io/7.x/npmrc#node-linker).

You'll also want to add the following to your `.gitignore`

```
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
```

On the note of Git; **you'll want to commit `.yarn/releases/yarn-3.x.x.cjs`**, as Yarn will not work for your other developers otherwise.


> **`yarn install` _still_ won't work yet, keep reading!**

## Configuring Yarn to Support Monorepos

Now that we've disabled Yarn PNP, we need to configure Yarn to install all deps for all of the projects in our workspace. To do this, add the following to your `package.json`:

```json {4-10}
{
    "name": "AppRoot",
    "version": "0.0.1",
    "private": true,
    "workspaces": {
     "packages": [
       "apps/*",
       "packages/*",
       "websites/*"
     ]
    },
    "packageManager": "yarn@3.5.1"
}
```

Finally, let's configure `yarn` to install a fresh version of `node_modules` for each of our apps, so that React Native can easily detect our packages without having to configure Metro to find multiple `node_modules`. To do that, we'll add [a new line](https://yarnpkg.com/configuration/yarnrc#nmHoistingLimits) to our `.yarnrc.yml` file:

```yml
nmHoistingLimits: workspaces
```

Congrats! **You can now install all of your apps' dependencies using `yarn install`**! 🎉

### A note about `nohoist`

It's worth mentioning that other React Native monorepo guides often utilize [Yarn 1's `nohoist`](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) functionality that no longer is supported in Yarn 2+.

Here's what a maintainer of Yarn told me about the possibility of supporting `nohoist` in Yarn is:

https://twitter.com/larixer/status/1570459837498290178

https://twitter.com/crutchcorn/status/1570464405456064520

https://twitter.com/larixer/status/1570465023293820928

As such, it seems like `nohoist` won't be seeing a comeback to Yarn. This means that if you have the same package in 3 apps, it will be installed 3 individual times.

This may seem like a bad thing until you realize that you're now free of having to have a `package.json` with a hundred entries in `nohoist`:

https://twitter.com/crutchcorn/status/1570465437221277696



# Package Shared Elements to use Across Apps

Having multiple related apps in the same monorepo is valuable in its own right for colocating your teams' focus, but we can go one step further.

What if we had a way to share code between different apps using a shared package? Let's do this by creating a new package inside of our monorepo called `shared-elements`.

Start by:

1. Creating a new folder called `packages` and a subfolder called `shared-elements `.
2. Running `npm init` inside to make a new `package.json` file.
3. Create `src/index.tsx`.

<!-- filetree:start -->

- `apps/`
  - `customer-portal/`
  - `admin-portal/`
- `packages/`
  - `shared-elements/`
    -  `src/`
        - `index.tsx`
    -  `package.json`
- `.gitignore`
- `.yarnrc.yml`
- `package.json`
- `yarn.lock`

<!-- filetree:end -->

Inside of our newly created `index.tsx`, let's create a `HelloWorld` component:

```tsx
import {Text} from "react-native";

export const HelloWorld = () => {
	return <Text>Hello world</Text>
}
```

At this point, your IDE will likely complain that you don't have `react-native` or `react` installed. To fix that:

1. Open your terminal and `cd` into `packages/shared-elements/`

2. Install your expected packages using:

```shell
yarn add react react-native
yarn add -D @types/react @types/react-native typescript
```

You should now not see any errors in your IDE!

## Bundling our Shared Repo with Vite

While our IDE isn't showing any errors, if we attempt to consume our library in our apps right now we'll run into various issues, because we're trying to import `.tsx` files without turning them into `.js` files first.

To transform these source files, we need to configure a "Bundler" to take our source code files and turn them into compiled files to be used by our apps.

While we could theoretically use any other bundler, I find that [Vite](https://vitejs.dev/) is the easiest to configure and provides the nicest developer experience out-of-the-box.

Using [Vite's React plugin](https://github.com/vitejs/vite-plugin-react) and [Vite's library mode](https://vitejs.dev/guide/build.html#library-mode), we can easily generate `.js` files for our source code. Combined with [`vite-plugin-dts`](https://www.npmjs.com/package/vite-plugin-dts), we can even generate `.d.ts` files for TypeScript to get our typings as well.

Here's what an example `vite.config.ts` file - placed in `/packages/shared-elements/` - might look like:

```typescript
// This config file is incomplete and will cause bugs at build, read on for more
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: path.resolve(__dirname, "./src"),
    }),
  ],
  build: {
    lib: {
      entry: {
        "shared-elements": path.resolve(__dirname, "src/index.tsx"),
      },
      name: "SharedElements",
      fileName: (format, entryName) => `${entryName}-${format}.js`,
      formats: ["es", "cjs"],
    },
  },
});
```

The `fileName`, `formats`, and `entry` files tell Vite to "build everything inside of `src/index.tsx` into a CommonJS and ES Module file for apps to consume". We then need to update our `package.json` file (located in `/packages/shared-elements/`) to tell these apps where to look when importing from this package:

```json {8-18}
{
  "name": "shared-elements",
  "version": "0.0.1",
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "tsc": "tsc --noEmit"
  },
  "types": "dist/index.d.ts",
  "main": "./dist/shared-elements-cjs.js",
  "module": "./dist/shared-elements-es.js",
  "react-native": "./dist/shared-elements-es.js",
  "exports": {
    ".": {
      "import": "./dist/shared-elements-es.js",
      "require": "./dist/shared-elements-cjs.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.71.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.7",
    "@types/react-native": "^0.72.2",
    "@vitejs/plugin-react": "^3.1.0",
    "typescript": "^4.9.3",
    "vite": "^4.1.2",
    "vite-plugin-dts": "^2.0.2"
	}
}
```

Now let's run `yarn build` annnnd...

```shell
vite v4.3.3 building for production...
✓ 2 modules transformed.

[vite:dts] Start generate declaration files...
✓ built in 900ms
[vite:dts] Declaration files built in 743ms.

[commonjs--resolver] Unexpected token (14:7) in /packages/shared-elements/node_modules/react-native/index.js
file: /packages/shared-elements/node_modules/node_modules/react-native/index.js:14:7
12:
13: // Components
14: import typeof AccessibilityInfo from './Libraries/Components/AccessibilityInfo/AccessibilityInfo';
           ^
15: import typeof ActivityIndicator from './Libraries/Components/ActivityIndicator/ActivityIndicator';
16: import typeof Button from './Libraries/Components/Button';
error during build:
SyntaxError: Unexpected token (14:7) in /packages/shared-elements/node_modules/node_modules/react-native/index.js
```

Uh oh.

This error is occuring because React Native is written with Flow, which our Vite configuration doesn't understand. While we could fix this by using [`vite-plugin-babel`](https://www.npmjs.com/package/vite-plugin-babel) to parse out the Flow code, **we don't want to bundle `react` or `react-native` into our shared package anyway**.

This is because React (and React Native) expects a [singleton](https://www.patterns.dev/posts/singleton-pattern) where the app only has a single instance of the project. This means that we need to tell Vite not to transform the `import` and `require`s of those two libraries:

```typescript {22-38}
// vite.config.ts
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: path.resolve(__dirname, "./src"),
    }),
  ],
  build: {
    lib: {
      entry: {
        "shared-elements": path.resolve(__dirname, "src/index.tsx"),
      },
      name: "SharedElements",
      fileName: (format, entryName) => `${entryName}-${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-native",
        "react/jsx-runtime",
      ],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
          "react-native": "ReactNative",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
```

Because these packages aren't included in the bundle anymore, we need to flag to our apps that they need to install the packages as well. To do this we need to utilize [`devDependencies` and `peerDependencies`](https://unicorn-utterances.com/posts/how-to-use-npm) in  `/packages/shared-elements/`:

```json {19-31}
{
  "name": "shared-elements",
  "version": "0.0.1",
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "tsc": "tsc --noEmit"
  },
  "types": "dist/index.d.ts",
  "main": "./dist/shared-elements-cjs.js",
  "module": "./dist/shared-elements-es.js",
  "react-native": "./dist/shared-elements-es.js",
  "exports": {
    ".": {
      "import": "./dist/shared-elements-es.js",
      "require": "./dist/shared-elements-cjs.js",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "react": "18.2.0",
    "react-native": "0.71.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.7",
    "@types/react-native": "^0.72.2",
    "@vitejs/plugin-react": "^3.1.0",
    "react": "18.2.0",
    "react-native": "0.71.7",
    "typescript": "^4.9.3",
    "vite": "^4.1.2",
    "vite-plugin-dts": "^2.0.2"
	}
}
```

> Any time we add a dependency that relies on React or React Native, we need to add them to the `external` array, the `peerDependencies`, and the `devDependencies` list.
>
> EG: If you add `react-native-fs` it needs to be added to both and installed in the app's package.

## Fixing issues with the Metro Bundler {#metro}

Remember how React requires a single instance of React (and React deps) require exactly one single instance of itself in order to operate properly?

Well, not only do we have to solve this issue on the `shared-elements` package, we also have to update the bundler in our React Native app. This bundler is called Metro and can be configured with a file called `metro.config.js`.

```javascript
const path = require("path");

module.exports = (__dirname) => {
  // Live refresh when any of our packages are rebuilt
  const packagesWorkspace = path.resolve(
    path.join(__dirname, "../../packages")
  );

  const watchFolders = [packagesWorkspace];

  const nodeModulesPaths = [
    path.resolve(path.join(__dirname, "./node_modules")),
  ];

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: true,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      // "Please use our `node_modules` instance of these packages"
      resolveRequest: (context, moduleName, platform) => {
        if (
          // Add to this list whenever a new React-reliant dependency is added
          moduleName.startsWith("react") ||
          moduleName.startsWith("@react-native") ||
          moduleName.startsWith("@react-native-community")
        ) {
          const pathToResolve = path.resolve(
            __dirname,
            "node_modules",
            moduleName
          );
          return context.resolveRequest(context, pathToResolve, platform);
        }
        // Optionally, chain to the standard Metro resolver.
        return context.resolveRequest(context, moduleName, platform);
      },
      nodeModulesPaths,
    },
    watchFolders,
  };
};
```

**Without this additional configuration, Metro will attempt to resolve the `import` and `require`s of the `shared-elements` package from `/packages/shared-elements/node_modules` instead of `/apps/your-app/node_modules`**, which leads to a non-singleton mismatch of React versions.

This means that any time you add a package that relies on React, you'll want to add it to your `resolveRequest` conditional check.

> Without this `if` check, you're telling Metro to search for _all_ dependencies from your app root. While this might sound like a good idea at first, it means that you'll have to install all subdependencies of your projects as well as your `peerDep`s, which would quickly bloat and confuse your `package.json`.

# Run Distributed Tasks with Turborepo {#turborepo}





# Building Basic React Native Components {#building-components}



# Styling Components using Styled Components {#styled-components}









# Add Testing to our Monorepo with Jest {#jest}



## Make Tests More Representative with Testing Library {#testing-library}





# Sharing Configuration Files between Apps {#config-package}



## Enforce Consistent TypeScript Usage with `tsconfig` {#tsconfig}



## Lint Your Apps with ESLint {#eslint}





# Next Stop: The Web {#conclusion}

<!-- Conclusion section, talk about React Native for Web, Storybooks, Vite -->

