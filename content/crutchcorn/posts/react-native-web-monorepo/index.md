---
{
  title: "Set up a React Native Web Project in a Monorepo",
  description: "",
  published: '2024-04-05T13:45:00.284Z',
  tags: ['react', 'react native'],
  license: 'cc-by-nc-sa-4',
  originalLink: "https://example.com",
  collection: "React Native Monorepo",
  order: 2
}
---

In our last blog post, we took a look at how to scaffold a React Native monorepo. We explained how some of the benefits were not only code sharing between native apps, but that it enabled us to have different types of applications share the same code:

![// TODO:](../setup-a-react-native-monorepo/rn_monorepo.png)

Here, we showed a Windows, macOS, Android, and iOS app that all share from the same codebase in a monorepo.

What if I told you that this isn't where things stopped?

Let's look at how each of these platforms are supported in React Native:

- [iOS (maintained from Meta)](https://reactnative.dev/)
- [Android (maintained by Meta)](https://reactnative.dev/)
- [Windows (maintained by Microsoft)](https://microsoft.github.io/react-native-windows/)
- [macOS (maintained by Microsoft)](https://microsoft.github.io/react-native-windows/)
- [Web (maintained by ecosystem)](https://necolas.github.io/react-native-web/)

> Wait, what?! We can build web apps using React Native?!

It's true! While this might seem backwards at first, it's a superpower to get a React Native app ported to the web quickly.

So, how do we do this?

# Creating a Vite Project

While there's more to the monorepo aspect of the monorepo, let's talk about how to set up a web project using Vite and React Native first without worrying about the monorepo parts too much.

## Setting Up the Initial Vite Project

So, let's take the file structure from the last article and add a `websites/admin-portal` folder:

<!-- ::start:filetree -->

- `apps/`
  - `customer-portal/`
  - `admin-portal/`
- `packages/`
  - `shared-elements/`
- `websites/`
  - `admin-portal/`
    - `package.json`
    - `vite.config.ts`
    - `index.html`
    - `src/`
        - `main.tsx`
    - `tsconfig.json`
- `package.json`

<!-- ::end:filetree -->

This `package.json` will include the basics to get a Vite site up-and-running:

```typescript
{
  "name": "@your-org/web-admin-portal",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

As well as a `vite.config.ts` file:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

This allows us to have our `index.html` file act as our web app's entry point:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your App Name Here</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Finally, the `<script>` tag allows us to run and import `main.tsx` from `src` to run React:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return <p>Hello, world!</p>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Adding React Native Web Support

Now, to run React Native in the Vite project, we'll add a few new packages:

```shell
yarn add react-native react-native-web
```

Then, we can tell Vite that "whenever you see `react-native`, replace it with `react-native-web`" by updating our `vite.config.ts` file:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^react-native\/(.*)/, replacement: "react-native-web/$1" },
      {
        find: /^react-native$/,
        replacement: "react-native-web",
      },
    ]
  }
})
```

Now we can use `react-native` imports in our app:

```tsx
import {Text} from "react-native";

function App() {
  return <Text>Hello, world!</Text>
}
```

## Resolving Web Modules First

In React Native's default bundler, Metro, it's able to select which files should be imported based on which platform you're building for.

IE:

<!-- ::start:filetree -->

- `main.tsx`
- `main.ios.tsx`
- `main.android.tsx`

<!-- ::end:filetree -->

Will import from `main.tsx` if you're not using React Native, `main.ios.tsx` if you are and are building for iOS apps, and `main.android.tsx` if you're targeting Android.

IE - Building for iOS will select the following file when importing `main`:

<!-- ::start:filetree -->

- `main.tsx`
- **`main.ios.tsx`**
- `main.android.tsx`

<!-- ::end:filetree -->

This feature extends to React Native Web support as well. Many libraries rely on this functionality to resolve a `.web.tsx` or `.web.js` extension before other prefixed paths.

-------

To add support for this into Vite, we'll need to add the following to our Vite config:

```typescript
const defaultExtensions = [
  ".mjs",
  ".js",
  ".mts",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
];

const allExtensions = [
  ...defaultExtensions.map((ext) => ext.replace(/^\./, ".web.")),
  // For AWS
  ...defaultExtensions.map((ext) => ext.replace(/^\./, ".browser.")),
  ...defaultExtensions,
];

export default defineConfig({
  // ...
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".ts": "tsx",
      },
      mainFields: ["module", "main"],
      resolveExtensions: [".web.js", ".js", ".ts"],
    },
  },
  resolve: {
    extensions: allExtensions,
    // ...
  },
});
```

## Handle JSX in JS Files 

Some packages do not bundle their JSX in `.jsx` file extensions and instead have their JSX in `.js` files. [Vite does not support this and requires all JSX syntax to be in `.jsx` or `.tsx` files](https://github.com/vitejs/vite/discussions/3112). 

To sidestep this, we'll add a custom Vite plugin that transfoms 

```javascript
{
  name: "load-js-files-as-jsx",
  async load(id) {
    if (
      !id.match(
        /node_modules\/(?:react-native-reanimated|react-native-vector-icons)\/.*.js$/,
      )
    ) {
      return;
    }

    const file = await fs.promises.readFile(id, "utf-8");
    return esbuild.transformSync(file, { loader: "jsx" });
  },
}
```

This means that if you see an error like this:

```
[commonjs--resolver] Unexpected token (58:16) in /websites/web-portal/node_modules/react-native-elements/dist/input/Input.js
file: /websites/web-portal/node_modules/react-native-elements/dist/input/Input.js:58:16
56:         });
57:         const hideErrorMessage = !renderErrorMessage && !errorMessage;
58:         return (<View style={StyleSheet.flatten([styles.container, containerStyle])}>
                    ^
59:         {renderText(label, Object.assign({ style: labelStyle }, labelProps), Object.assign({ fontSize: 16, color: (_a...
60:                 android: Object.assign({}, fonts.android.bold),
error during build:
SyntaxError: Unexpected token (58:16) in /websites/web-portal/node_modules/react-native-elements/dist/input/Input.js
```

You should add the dependency throwing the error (in this case, `react-native-elements`) to the regex above.

## Add Font Icons (`react-native-vector-icons`)

Any good UI project comes with icons. In the React Native world, the most common set of icons comes from [the `react-native-vector-icons` package](https://github.com/oblador/react-native-vector-icons).

To add support for the package in a Vite project, you'll:

- Use the `rollup-plugin-copy` plugin to copy the font files to a static `public` folder
- Add a stylesheet that references those fonts

You do the first by adding in the plugin to your `vite.config.ts` file:

```typescript
import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    // ...
    {
      ...copy({
        hook: "options",
        flatten: true,
        targets: [
          {
            src: "node_modules/react-native-vector-icons/Fonts/*",
            dest: "public/fonts",
          },
        ],
      }),
      enforce: "pre",
    },
  ],
  resolve: {
    // You also need to alias the vector-icons packages to be web-centric!
    alias: [
      {
        find: "react-native-vector-icons/MaterialIcons",
        replacement: "react-native-vector-icons/dist/MaterialIcons",
      },
      {
        find: "react-native-vector-icons/MaterialCommunityIcons",
        replacement: "react-native-vector-icons/dist/MaterialCommunityIcons",
      },
    ]
  }
  // ...
});
```

Then add the following to your `index.html` file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Title</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <style>
      @font-face {
        src: url("/fonts/MaterialIcons.ttf");
        font-family: MaterialIcons;
      }

      @font-face {
        src: url("/fonts/MaterialCommunityIcons.ttf");
        font-family: MaterialCommunityIcons;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```


# Adding in Monorepo Support

Now that we have our Vite React Native proejct set up properly, let's configure the monorepo aspects so we can share code with our mobile apps quickly.

## Deduplicating React Native Deps

Because all React Native projects rely on a single instance of React and React Native (as a singleton), we need to tell Vite that it should remove duplicate copies of React Native deps in our apps. We do this by using `resolve.dedupe` in `vite.config.ts`:

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  // ...
  resolve: {
    dedupe: [
      "@react-native-async-storage/async-storage",
      "@react-native-picker/picker",
      "@reduxjs/toolkit",
      "@tanstack/react-query",
      "react",
      "react-dom",
      "react-native",
      "react-native-device-info",
      "react-native-elements",
      "react-native-maps",
      "react-redux",
      "react/jsx-runtime",
      "styled-components",
      "styled-components/native",
    ],
    // ...
  },
});
```

This means that you'll want to add to this `dedupe` list anytime you add a `react` or `react-native` dependency to your shared project's `package.json`.

Now we can import our shared library into our web portal:

```typescript
// websites/admin-portal/App.tsx

import {HelloWorld} from "@your-org/shared-elements";

export const App = () => {
    return <HelloWorld/>
}
```

And it should render properly!

## Web-Specific Code in Shared Elements

Now that we have shared code between our desktop and mobile apps, it's tempting to have all of our code generic enough to support both platforms in our shared elements.

However, it turns out that there's a lot of instances where it's highly useful to have platform specific code. Let's break out `@your-org/shared-elements` package into two dedicated packages:

- `@your-org/shared-elements/mobile`
- `@your-org/shared-elements/web`

Where each platform is able to remove specific code from their respective bundles.

IE, we can do this:

```tsx
// packages/shared-elements/src/hello.tsx
import {Text} from "react-native";

const HelloWeb = () => {
	return <p>I am a website</p>;
}

const HelloMobile = () => {
	return <Text>I am an app</Text>;
}

export HelloWorld = process.env.IS_WEB ? HelloWeb : HelloMobile;
```

And only having the following on the web import:

```tsx
const HelloWorld = () => {
	return <p>I am a website</p>;
}
```

And this on the mobile import:

```tsx
import {Text} from "react-native";

const HelloMobile = () => {
	return <Text>I am an app</Text>;
}
```

-----

To enable this, we'll need to add a custom Vite plugin to replace `process.env.IS_WEB` with `true` on web builds and `false` on mobile builds. 

```typescript
// packages/shared-elements/vite/plugins.ts
import { PluginOption } from "vite";

function removeMobileCodePlugin(): PluginOption {
  return {
    name: "define web",
    transform(code, _id, ssr) {
      if (!ssr && code.includes("process.env.IS_WEB")) {
        return code.replace(/process.env.IS_WEB/g, "true");
      }
      return undefined;
    },
    enforce: "pre",
  };
}

function removeWebCodePlugin(): PluginOption {
  return {
    name: "define web",
    transform(code, _id, ssr) {
      if (!ssr && code.includes("process.env.IS_WEB")) {
        return code.replace(/process.env.IS_WEB/g, "false");
      }
    },
    enforce: "pre",
  };
}
```

Then, we'll need:

- A shared common Vite config file
- Two dedicated builds of web and mobile:

```typescript
// packages/shared-elements/vite/base-config.ts
import { LibraryFormats, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";

export const commonFormats = ["es", "cjs"] as LibraryFormats[];

export const baseOutDir = "./dist";

export const getFileName = (prefix: string, format: string) => {
  switch (format) {
    case "es":
    case "esm":
    case "module":
      return `${prefix}.mjs`;
    case "cjs":
    case "commonjs":
    default:
      return `${prefix}.cjs`;
  }
};

export const baseConfig = {
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        "@react-native-async-storage/async-storage",
        "@react-native-async-storage/async-storage",
        "@react-native-community/netinfo",
        "@react-native-picker/picker",
        "@react-native-community/geolocation",
        "@reduxjs/toolkit",
        "@tanstack/react-query"
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
} satisfies UserConfigExport;
```

```typescript
// packages/shared-elements/vite.config.web.ts
import { baseConfig, baseOutDir, commonFormats, getFileName } from "./base-config";
import { removeMobileCodePlugin } from "./remove-mobile-code-plugin";
import path from "node:path";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export const getWebConfig = defineConfig(({
    ...baseConfig,
    plugins: [
      removeMobileCodePlugin(),
      ...baseConfig.plugins,
      dts({
        entryRoot: path.resolve(__dirname, "../src"),
        outDir: resolve(__dirname, "..", baseOutDir, "web"),
      }),
    ],
    build: {
      ...baseConfig.build,
      outDir: resolve(__dirname, "..", baseOutDir, "web"),
      lib: {
        entry: resolve(__dirname, "../src/index.tsx"),
        name: "CVElementsWeb",
        fileName: (format, entryName) => getFileName("web", format),
        formats: commonFormats,
      },
    },
  })

```

```typescript
// packages/shared-elements/vite.config.mobile.ts
import { baseConfig, baseOutDir, commonFormats, getFileName } from "./base-config";
import { removeMobileCodePlugin } from "./remove-mobile-code-plugin";
import path from "node:path";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export const getWebConfig = defineConfig(({
    ...baseConfig,
    plugins: [
      removeWebCodePlugin(),
      ...baseConfig.plugins,
      dts({
        entryRoot: path.resolve(__dirname, "../src"),
        outDir: resolve(__dirname, "..", baseOutDir, "mobile"),
      }),
    ],
    build: {
      ...baseConfig.build,
      outDir: resolve(__dirname, "..", baseOutDir, "mobile"),
      lib: {
        entry: resolve(__dirname, "../src/index.tsx"),
        name: "CVElementsMobile",
        fileName: (format, entryName) => getFileName("mobile", format),
        formats: commonFormats,
      },
    },
  })
```

Then, update your `packages/shared-elements/package.json` file to build two different outputs:

```json
{
  "name": "@your-org/shared-elements",
  "scripts": {
    "build": "run-p \"build:*\"",
    "build:mobile": "vite build --config vite.config.mobile.ts",
    "build:web": "vite build --config vite.config.web.ts",
  },
  "files": [
    "assets",
    "dist",
    "src"
  ],
  "exports": {
    "./mobile": {
      "types": "./dist/mobile/index.d.ts",
      "import": "./dist/mobile/mobile.mjs",
      "require": "./dist/mobile/mobile.cjs",
      "default": "./dist/mobile/mobile.cjs"
    },
    "./web": {
      "types": "./dist/web/index.d.ts",
      "import": "./dist/web/web.mjs",
      "require": "./dist/web/web.cjs",
      "default": "./dist/web/web.cjs"
    }
  },
  "typesVersions": {
    "*": {
      "mobile": [
        "./dist/mobile/index.d.ts"
      ],
      "web": [
        "./dist/web/index.d.ts"
      ]
    }
  }
}
```

> This is a partial view of the `shared-elements` `package.json` file

------

Now you'll import the code differently in your mobile and web projects. You'll import like this on your mobile project:

```tsx
import {HelloWorld} from "@your-org/shared-elements/mobile"
```

And this in your web project:

```tsx
import {HelloWorld} from "@your-org/shared-elements/web"
```

## Adding in Styled Component Support

// TODO: Write
