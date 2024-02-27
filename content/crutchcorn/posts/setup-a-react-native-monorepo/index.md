---
{
  title: "How to Setup a React Native Monorepo",
  description: "React Native can be challenging to setup a monorepo for. Let's explore what an optimal monorepo setup looks like for it.",
  published: '2023-06-29T13:45:00.284Z',
  tags: ['react', 'react native'],
  license: 'cc-by-nc-sa-4',
  originalLink: "https://blog.cvoice.io/how-to-setup-a-react-native-monorepo"
}
---

[React Native](https://reactnative.dev/) allows you to write React code that outputs to native applications for various platforms, including:

- Android
- iOS
- Windows
- macOS

It's an undeniably powerful way to share code between web applications and your mobile apps, particularly within small teams that either don't have the knowledge or the capacity to go fully native.

Similarly, [monorepos](https://monorepo.tools/) can be a fantastic way to share code between multiple projects with a similar tech stack.

Combined together and even a small team can maintain multiple React Native applications seamlessly.

<img src="./rn_monorepo.png" alt="Two apps: One customer portal and one admin panel extending from shared code. Each portal has a Windows, macOS, Android, and iOS app" data-dont-round/>

Unfortunately, it can be rather challenging to build out a monorepo that properly supports React Native. While [Expo supports monorepo usage](https://docs.expo.dev/guides/monorepos/), one common complaint when using Expo is that [Expo does not support many popular React Native libraries that require native code](https://web.archive.org/web/20230321191807/https://docs.expo.dev/introduction/why-not-expo/#expo-go).

To further exacerbate the issue, React Native comes with many uncommon edgecases that make monorepos particularly challenging to create. Many of the tutorials I've found outlining how to build a monorepo for this purpose use outdated tools to work around this.

Knowing just how potent the potential impact of a monorepo would be on my projects, I disregarded these headaches and spent a month or two building out a monorepo that solved my problems.

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

# Set Up a React Native Project {#set-up-app}

Let's set up a basic React Native project to extend using a monorepo.

> Before you get started with this section, make sure you have [your environment set up](https://reactnative.dev/docs/environment-setup), including XCode/Android Studio.

To set up a basic React Native project from scratch, run the following:

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

Congrats! You _technically_ now have a monorepo, even if it's currently missing many conveniences of a well-established monorepo.


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

Notice how each of our sub-projects has its own `package.json`? This allows us to split out our dependencies based on which project requires them rather than having a single global `package.json` with every project's dependencies in it.

However, without any additional configuration, it means that we need to `npm install` in every subdirectory manually to get our projects set up.

What if there was a way to have a single `install` command that installed all packages for all `package.json` files in our repo? Well, we can!

To do this, we need some kind of "workspace" support, which tells our package manager to install deps from every `package.json` in our system.

Here are the most popular Node package managers that support workspaces:

- [`npm`](https://docs.npmjs.com/cli/v7/using-npm/workspaces) (as of v7)
- [`yarn`](https://yarnpkg.com/)
- [`pnpm`](https://pnpm.io/)

While NPM is often reached for as the default package manager for Node apps, it lacks a big feature that's a nice-to-have in large-scale monorepos: Patching NPM packages.

While NPM can [use a third-party package](https://www.npmjs.com/package/patch-package) to enable this functionality, it has shaky support for monorepos. Compare this to PNPM and Yarn, which both have this functionality built-in for monorepos.

This leaves us with a choice between `pnpm` and `yarn` for our package manager in our monorepo.

While pnpm is well loved by developers for [its offline functionality](https://pnpm.io/cli/install#--offline), I've had more experience with Yarn and found it to work well for my needs.

## Installing Yarn 3 (Berry)

When most people talk about using Yarn, they're often talking about using Yarn v1, which [originally launched in 2017](https://github.com/yarnpkg/yarn/releases/tag/v1.0.0). While Yarn v1 works for most needs, I've run into bugs with its monorepo support that halted progress at times.

Here's the bad news: Yarn v1's [last release was in 2022](https://github.com/yarnpkg/yarn/releases/tag/v1.22.19) and is [in maintenance mode](https://github.com/yarnpkg/yarn/issues/8583#issuecomment-783161589).

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

[Because of React Native's incompatibility with Yarn PNP](https://yarnpkg.com/features/pnp#incompatible), we need to disable it. To do this, we update our `.yarnrc.yml` file to _add_:

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

On the note of Git, **you'll want to commit `.yarn/releases/yarn-3.x.x.cjs`**, as Yarn will not work for your other developers otherwise.


> **`yarn install` _still_ won't work yet; keep reading!**

## Configuring Yarn to Support Monorepos

Now that we've disabled Yarn PNP, we need to configure Yarn to install all deps for all of the projects in our workspace. To do this, add the following to your `package.json`:

```json {4-10}
{
    "name": "@your-org/app-root",
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

> Replace `your-org` with an NPM organization that your company owns. Otherwise, [you're susceptible with various attacks](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610) without this org namespace. 

Finally, let's configure `yarn` to install a fresh version of `node_modules` for each of our apps so that React Native can easily detect our packages without having to configure Metro to find multiple `node_modules`. To do that, we'll add [a new line](https://yarnpkg.com/configuration/yarnrc#nmHoistingLimits) to our `.yarnrc.yml` file:

```yml
nmHoistingLimits: workspaces
```

Congrats! **You can now install all of your apps' dependencies using `yarn install`**! 🎉

### A note about `nohoist`

It's worth mentioning that other React Native monorepo guides often utilize [Yarn 1's `nohoist`](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) functionality, which is no longer supported in Yarn 2+.

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
        "@your-org/shared-elements": path.resolve(__dirname, "src/index.tsx"),
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
  "name": "@your-org/shared-elements",
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

Finally, we'll add a small `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es6", "dom"],
    "jsx": "react-native",
    "strict": true,
    "outDir": "dist",
    "noEmit": false,
    "skipLibCheck": true
  }
}
```

And add a `/packages/shared-elements/.gitignore` file:

```
dist/
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
        "@your-org/shared-elements": path.resolve(__dirname, "src/index.tsx"),
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

Because these packages aren't included in the bundle anymore, we need to flag to our apps that they need to install the packages as well. To do this we need to utilize [`devDependencies` and `peerDependencies`](/posts/how-to-use-npm) in  `/packages/shared-elements/`:

```json {19-31}
{
  "name": "@your-org/shared-elements",
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



## Install the Shared Package {#yarn-workspace-install}

Now that we have our package setup in our monorepo, we need to tell Yarn to associate the package as a dependency of our app. To do this, modify the `apps/[YOUR-APP]/package.json` file by adding:

```json
{
    "/* ... */": "...",
    "dependencies": {
        "@your-org/shared-elements": "workspace:*"
    }
}
```

Now, re-run `yarn` at the root of the monorepo. This will link your dependencies together as if it were any other, but pulling from your local filesystem!

## Using the Package in Our App {#use-shared-in-app}

Now that we have our package set up, let's use it in our app!

```tsx
// App.tsx
import {HelloWorld} from "@your-org/shared-elements";

export const App = () => {
    return <HelloWorld/>
}
```

That's all! 🎉

But wait... We're hitting some kind of error when we run our app... I wonder if it's becaus...

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
          moduleName.startsWith("@react-native-community") ||
          moduleName.startsWith("@your-org")
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

# Add Testing to our Monorepo with Jest {#jest}

While [I'm not an avid fan of Test-Driven-Development](/posts/documentation-driven-development), it's hard to argue that testing doesn't make a massive impact to the overall quality of the end-result of a codebase.

Let's set up [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to write fast and [easy to read](/posts/five-suggestions-for-simpler-tests) integration tests for our applications.

> While you could add end-to-end testing with something like [Detox](https://github.com/wix/Detox) or [Maestro](https://maestro.mobile.dev/platform-support/react-native), I find that integration testing is often a better fit for most apps.

While we'll eventually add testing to all of our apps and packages, let's start by adding testing to our `shared-elements` package. 

Install the following packages:

```shell
yarn add -D jest @testing-library/react-native @testing-library/jest-native babel-jest ts-jest @types/jest react-test-renderer
```

This will enable usage of Testing Library and all the deps you'll need for Jest. Jest can then be configured using a `jest.config.js` file:

```javascript
// packages/shared-elements/jest.config.js
const path = require("path");

module.exports = {
  preset: "@testing-library/react-native",
  moduleNameMapper: {
    "^react$": "<rootDir>/node_modules/react",
  },
  setupFilesAfterEnv: [
    path.resolve(__dirname, "./jest/setup-files-after-env.js"),
  ],
  transform: {
    "^.+\\.jsx$": [
      "babel-jest",
      { configFile: path.resolve(__dirname, "./babel.config.js") },
    ],
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        babelConfig: path.resolve(__dirname, "./babel.config.js"),
        tsconfig: path.resolve(__dirname, "./tsconfig.jest.json"),
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native(.*)?|@react-native(-community)?)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "dist/"],
};
```

And providing the needed configuration files:

```javascript
// packages/shared-elements/jest/setup-files-after-env.js
import "@testing-library/jest-native/extend-expect";
```

```javascript
// packages/shared-elements/babel.config.js
module.exports = {
  presets: ["module:metro-react-native-babel-preset"]
};
```

Finally, add your test-specific TypeScript configuration file to `packages/shared-elements/tsconfig.jest.json`:

```json
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "types": ["node", "jest"],
    "isolatedModules": false,
    "noUnusedLocals": false
  },
  "include": ["**/*.spec.tsx"],
  "exclude": []
}
```

Now you can write your test: 

```tsx
// packages/shared-elements/src/index.spec.tsx
import {HelloWorld} from "./index";
import {render} from "@testing-library/react-native";

test("Says hello", () => {
  const {getByText} = render(<HelloWorld/>);

  expect(getByText("Hello world")).toBeDefined();
})
```

And you should see a passing test when running:

```shell
yarn jest # Run this inside /packages/shared-elements
```

🎉

>If you get the following error message when trying to run your tests:
>
>```
> FAIL  src/index.spec.tsx
>  ● Test suite failed to run
>
>    Configuration error:
>
>    Could not locate module react mapped as:
>    /packages/shared-elements/node_modules/react.
>
>    Please check your configuration for these entries:
>    {
>      "moduleNameMapper": {
>        "/^react$/": /packages/shared-elements/node_modules/react"
>      },
>      "resolver": undefined
>    }
>```
>
>Make sure that you didn't forget to add the following to your root `.yarnrc.yml` file:
>
>```yml
>nmHoistingLimits: workspaces
>```

Whoa... That moved a little fast... Let's stop and take a look at that `jest.config.js` file again and explain each section of it.

## Dissecting the Jest Config File {#jest-config}

First, in our Jest config file, we're telling Jest that it needs to treat our environment as if it were a React Native JavaScript runtime:

```javascript
module.exports = {
  preset: "@testing-library/react-native",
  // ...
};
```

-----

We then follow this up with `moduleNameMapper`:

```javascript
module.exports = {
  // ...
  moduleNameMapper: {
    "^react$": "<rootDir>/node_modules/react",
  },
  // ...
};
```

Which acts similarly to Vite or Webpack's `alias` field, telling Jest that "whenever one of these regexes is matched, resolve the following package instead".

This `moduleNameMapper` allows us to make sure that each React dependency/subdependency is resolved to a singleton, rather than at the per-package path. This is less important right now with our base `shared-elements` package, and more relevant when talking about Jest usage in our apps.

Because of this singleton aspect, **we need to make sure that we're adding each React sub-dependant to this `moduleNameMapper` when a new package is installed**.

----

Next up is the `transform` key, which allows us to use TypeScript and `.tsx` files for our tests, as well as telling Jest to transform `.js` and `.jsx` files to handle React Native specific rules (more on that soon):

```javascript
module.exports = {
  // ...
  transform: {
    "^.+\\.jsx$": [
      "babel-jest",
      { configFile: path.resolve(__dirname, "./babel.config.js") },
    ],
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        babelConfig: path.resolve(__dirname, "./babel.config.js"),
        tsconfig: path.resolve(__dirname, "./tsconfig.jest.json"),
      },
    ],
  },
  // ...
};
```

----

Finally, we have our `transformIgnorePatterns` and `testPathIgnorePatterns`:

```javascript
module.exports = {
  // ...
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native(.*)?|@react-native(-community)?)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "dist/"],
};
```

These tell Jest to "transform everything except for these folders and files". You'll notice that we have a strange regex in `tranformIgnorePatterns`:

```
node_modules/(?!((jest-)?react-native(.*)?|@react-native(-community)?)/)
```

This regex is saying:

- Ignore `node_modules` unless the next part of the path:
  - Starts with `jest-react-native`
  - Starts with `react-native`
  - Is a `@react-native` org package
  - Is a `@react-native-community` org package

> You can learn more about reading and writing regex from [my regex guide](/posts/the-complete-guide-to-regular-expressions-regex)!

Its purpose is to tell Jest that it should actively transform these non-ignored packages with `ts-jest` and `babel-jest`. See, both of them run `babel` over their respective source code files, which allows for things like:

- `import` usage (Jest only supports CommonJS)
- JSX usage
- Newer ECMAScript usage than your Node version might support

Or anything else configured in your `babel.config.js` file.

As such, you'll need to add to this regex when you add a package that's:

- Using non-transformed JSX, as many React Native packages do
- ESM only

## How to Debug Common Issues with Jest

While using Jest in a React Native monorepo as this _can_ feel like a superpower, it comes with more risks of difficult-to-debug solutions as well.

Here are just a few we've discovered along the way:

### Invalid Default Export Issues

Every once in a while, while working on a Jest test, I get the following error:

```
console.error
  Warning: React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: object.

  Check the render method of `de`.
      at Pn (/packages/shared-elements/dist/shared-elements-cjs.js:37:18535)
```

With the error pointing to some code like so:

```typescript
import SomePackage from "some-package";
```

Alternatively, if I pass that same component usage to `styled-components`, that error turns into:


```
 FAIL  src/screens/Documents/EventDocuments/EventDocumentsScreen.spec.tsx
  ● Test suite failed to run

    Cannot create styled-component for component: [object Object].

      956 |   width: 100%;
      957 |   align-items: center;
    > 958 | `,OC=
```

This happens because Jest handles ESM in particularly poor ways and, along the way of compiling into CJS exports, can get confused and often needs help figuring out when something is default exported or not.

To solve these issues, you can hack around Jest's default export detection:

```javascript
jest.mock("some-package", () => {
  const pkg = jest.requireActual(
    "some-package"
  );
  return Object.assign(pkg.default, pkg);
});
```

Similarly, If you run into the following error while using styled components:

```shell
 FAIL  src/screens/More/MoreHome/MoreHomeScreen.spec.tsx
  ● Test suite failed to run

    TypeError: w is not a function

    > 1 | "use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const c=require("react/jsx-runtime"),g=require("react-native"),w=require("styled-components/native"),B=require("react"),fe=require("react-native-elements"),re=require("@fortawesome/react-native-fontawesome"),Ce=require("styled-components"),s6=require("react-native-phone-call"),v0=require("react-native-geocoding"),Zt=require("@reduxjs/toolkit"),nr=require("aws-amplify"),Ii=require("@react-native-async-storage/async-storage"),p0=require("axios"),m0=require("react-redux"),Tu=require("react-native-maps"),se=require("@tanstack/react-query"),Mu=require("@react-native-clipboard/clipboard"),l6=require("@fortawesome/react-fontawesome"),Br=require("react-native-webview"),Za=require("react-native-actionsheet"),Ga=require("react-native-image-picker"),Fr=require("react-native-pager-view"),Pi=require("react-native-actions-sheet"),c6=require("react-native-share"),u6=require("react-native-fs"),go=require("react-native-gesture-handler"),x0=require("react-native-email-link");function d6(e){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const r in e)if(r!=="default"){const a=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,a.get?a:{enumerable:!0,get:()=>e[r]})}}return t.default=e,Object.freeze(t)}const Rt=d6(B),f6=w(g.View)`
```

It's fixed by:

```typescript
jest.mock("styled-components", () => {
  const SC = jest.requireActual("styled-components");
  return Object.assign(SC.default, SC);
});
```

As `styled-components` falls under the same problems.

### Unexpected Token Issues

If you run into an error like so:

```
 FAIL  src/screens/SomeScreen.spec.tsx
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /path/node_modules/@fortawesome/react-native-fontawesome/index.js:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){export { default as FontAwesomeIcon } from './dist/components/FontAwesomeIcon'
                                                                                      ^^^^^^

    SyntaxError: Unexpected token 'export'
```

It's caused by forgetting to include the package in question in your `transformIgnorePatterns` array:

```javascript
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native(.*)?|@react-navigation|@react-native(-community)?|axios|styled-components|@fortawesome)/)",
  ],
```

To explain further, it's due to ESM or JSX being used inside of a package that Jest doesn't know how to handle. By adding it to the array, you're telling Jest to transpile the package for Jest to safely use first. 



### No Context Value/Invalid Hook Call/Cannot Find Module

This is a three-for-one issue: **If you forget to pass a package to `moduleNameMapper`, Jest won't properly create a singleton of the package** (required for React to function properly) and will throw an error.

For example, if you don't link `react` in `moduleNameMapper`, you'll get:

```
 FAIL  src/screens/SomeScreen.spec.tsx (29.693 s)
  ● Console

    console.error
      Warning: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
      1. You might have mismatching versions of React and the renderer (such as React DOM)
      2. You might be breaking the Rules of Hooks
      3. You might have more than one copy of React in the same app
      See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
```

Similarly if you forget to link `react-redux`, you'll get:

```
could not find react-redux context value; please ensure the component is wrapped in a <Provider>
```

Or, if you're trying to mock a module that isn't linked, you'll get:

```
 FAIL  src/screens/SomeScreen.spec.tsx
  ● Test suite failed to run

    Cannot find module 'react-native-reanimated' from '../../packages/config/jest/setup-files-after-env.js'

      24 | jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);
      25 |
    > 26 | jest.mock("react-native-reanimated", () => {
         |      ^
      27 |   // eslint-disable-next-line @typescript-eslint/no-var-requires
      28 |   const Reanimated = require("react-native-reanimated/mock");
      29 |

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (../../packages/config/jest/setup-files-after-env.js:26:6)
```

### `Libraries/Image/Image`

If you get the following error:

```
 FAIL  src/screens/SomeScreen.spec.tsx
  ● Test suite failed to run

    Cannot find module '../Libraries/Image/Image' from 'node_modules/react-native/jest/setup.js'
```

You forgot to add the following preset to your shared Jest config:

```javascript
// jest.config.js
module.exports = {
  // Or "@testing-library/react-native"
  preset: 'react-native',
};
```

This Jest config applies [the following rules](https://github.com/facebook/react-native/blob/0bd6b28b324a6f511eec38d6669fcda4630772dc/packages/react-native/jest-preset.js#L14-L15):

```javascript
module.exports = {
  haste: {
    defaultPlatform: 'ios',
    platforms: ['android', 'ios', 'native'],
  },
  // ...
}
```

Which tells Jest to find files with those prefixes in the following order:

```
[file].ios.js
[file].android.js
[file].native.js
```

You can also solve this issue by adding in the `defaultPlatform` string and `platforms` array to your config.

#### Could Not Find `react-dom`

Similarly, if you get:

```
 FAIL  src/screens/SomeScreen.spec.tsx
  ● Test suite failed to run

    Cannot find module 'react-dom' from 'node_modules/react-redux/lib/utils/reactBatchedUpdates.js'

    Require stack:
      node_modules/react-redux/lib/utils/reactBatchedUpdates.js
      node_modules/react-redux/lib/index.js
```

It's because you're not adding `"native"` to the `platforms`' array from above and only have `android` and `ios` in it.

# Sharing Configuration Files between Apps {#config-package}

A monorepo doesn't mean much if you can't share configuration files between the apps! This allows you to keep consistent sets of rules across your codebases.

Let's take a look at two of the most popular tools to do this:

- TypeScript
- ESLint
- Jest


## Setting up the `config` package

We'll once again set up a new package to share our configuration files: `@your-org/config`.

To do this, `cd` into `packages`, and make a new directory called `config`:

```shell
cd packages
mkdir config
cd config
```

Then, `yarn init` a new package:

```shell
yarn init
```

Once done, set the `package.json` to have a name of `@your-org/config`:

```json
{
  name: '@your-org/config',
  packageManager: 'yarn@3.2.3'
}
```

Now we're off to the races!

> Don't forget to install this package in your other `packages` or `apps`.
>
> You can do this by adding:
>
> ```json
> {
>     "/* ... */": "...",
>     "devDependencies": {
>         "@your-org/config": "workspace:*"
>     }
> }
> ```
>
> And running `yarn` at the root.

## Enforce Consistent TypeScript Usage with `tsconfig` {#tsconfig}

Start by creating a `tsconfig` file in your `packages/config` directory:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es6", "dom"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js",
    "../../**/dist/**/*",
    "../../**/*.spec.tsx",
    "../../**/*.spec.ts"
  ]
}
```

> Your `tsconfig` file may look different from this, that's OK! This is just for an example.

You can then use this as the basis for your apps in your `apps/customer-portal/tsconfig.json` file:

```json
{
  "extends": "@your-org/config/tsconfig.json"
}
```

### Jest TSConfig

You can even create a Jest configuration that extends the base config and is then used in your apps:

```json
{
  "/* packages/config/tsconfig.jest.json */ ": "...",
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["node", "jest"],
    "isolatedModules": false,
    "noUnusedLocals": false
  },
  "include": ["**/*.spec.tsx"],
  "exclude": []
}
```

```json
{
  "/* apps/customer-portal/tsconfig.jest.json */ ": "...",
  "extends": "@your-org/config/tsconfig.jest.json",
}
```

## Jest Shared Config {#jest-shared-config}

Speaking of Jest, to get a shared configuration working for Jest in your apps and packages:

1. Move your `packages/shared-elements/jest.config.js` file into `packages/config/jest.config.js`.
2. Create a new `packages/shared-elements/jest.config.js` file with:

```javascript
module.exports = require("@your-org/config/jest.config");
```

3. Profit.

------

You can even customize the base rules on a per-app basis by doing something akin to the following:

```javascript
// packages/shared-elements/jest.config.js
const jestConfig = require("@your-org/config/jest.config");

module.exports = {
  ...jestConfig,
  moduleNameMapper: {
    ...jestConfig.moduleNameMapper,
    "^react-native$": "<rootDir>/node_modules/react-native",
  },
};
```



## Lint Your Apps with ESLint {#eslint}

To create a base ESLint configuration you can use in all of your apps, start by creating a `eslint-preset.js` file in `packages/config`:

```javascript
module.exports = {
  extends: [
    "@react-native-community",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["prettier"],
  rules: {
    "no-extra-boolean-cast": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
};
```

> We're using Prettier here, but you don't have to if you don't wish to!

Then, create `.eslintrc.js` files in:

- `packages/config/.eslintrc.js`:

  ```javascript
  module.exports = require("./eslint-preset");
  ```

- `/.eslintrc.js`

  ```javascript
  module.exports = require("./packages/config/eslint-preset");
  ```

- `packages/shared-elements/.eslintrc.js`

  ```javascript
  module.exports = require("@your-org/config/eslint-preset");
  ```

- `/apps/customer-portal/.eslintrc.js`

  ```javascript
  module.exports = require("@your-org/config/eslint-preset");
  ```

Finally, at the root of your project, run:

```shell
yarn add -W -D @typescript-eslint/parser @typescript-eslint/eslint-plugin @react-native-community/eslint-config eslint eslint-config-prettier eslint-config-react-app eslint-plugin-prettier prettier
```


And add in the linting scripts to your apps' and packages' `package.json`s:

```json
{
	"scripts": {
	    "lint": "eslint 'src/**/*.{js,jsx,ts,tsx}'",
	    "format": "eslint 'src/**/*.{js,jsx,ts,tsx}' --fix",
	}
}
```



# Next Stop: The Web and Beyond {#conclusion}

That's it! You now have a fully functional monorepo!

You may want to work to add [Nx](https://nx.dev/), [Lerna](https://lerna.js.org/), or [Turborepo](https://turbo.build/) to make dependency script management easier, but those tend to be simple to add to existing monorepos after-the-fact - we'll leave that as homework for you to do! 😉

Want to see what a final version of this monorepo might look like? [Check out my monorepo example package that integrates all of these tools and more!](https://github.com/crutchcorn/react-native-monorepo-example)

----------

The next article in the series will showcase how you can use Vite to add a web-based portal to the project using the same codebase to run on both mobile and web architectures.

Until next time - happy hacking!
