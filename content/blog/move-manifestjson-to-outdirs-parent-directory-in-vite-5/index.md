---
{
  title: "Move manifest.json to the Output Directory's Parent in Vite 5",
  description: "Move Vite's manifest.json file outside of the build directory.",
  published: '2024-02-07',
  authors: ["tylerlwsmith"],
  tags: ["javascript"],
  originalLink: "https://dev.to/tylerlwsmith/move-manifestjson-to-outdirs-parent-directory-in-vite-5-5fpf",
  license: 'cc-by-4'
}
---

Imagine you're using Vite with Flask or some other minimal web framework. You need to generate a manifest file so your app can look up the filenames of the production assets. Now imagine that for whatever reason, you don't want the manifest file to be URL-accessible. Maybe you have a new super-secret feature you're working on, and having the asset listed in Vite's `manifest.json` would spoil the surprise.

In an attempt to keep the manifest file a secret, you use the following code in `vite.config.js` to try to place the manifest file in the parent of `outDir` so that it is no longer URL-accessible:

```js
// WARNING: THIS CODE WON'T WORK!

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    manifest: "../manifest.json",
  },
});
```

Unfortunately when you run `npm run build`, you get the following error:

`[vite:manifest] The "fileName" or "name" properties of emitted chunks and assets must be strings that are neither absolute nor relative paths, received "../manifest.json".`

Vite won't let you use relative paths (e.g. `./filename` and `../filename`) to specify where a file should be built. This is a limitation of Rollup.js, and the maintainer says [there are no future plans to support this behavior](https://github.com/rollup/rollup/issues/3507#issuecomment-616495912). 

Fortunately, there are ways to hack around this limitation. This post will show **two different methods** to move the manifest file to the parent of `outDir`.

## The easy way: Add a `mv` command to the `build` script

One option is specifying the manifest filename in `vite.config.js`, then adding a `mv` command to the end of the `build` script within `package.json`.

Here's an example of what `vite.config.js` might look like:

```js
// vite.config.js

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    manifest: "manifest.json",
  },
});
```

Next, add the `mv` command to the `build` command in `package.json`'s `scripts` object.

```js
// package.json 
// (don't copy and paste this comment)

{
  "name": "vite-move-manifest",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build && mv dist\/manifest.json manifest.json",
  },
  "devDependencies": {
    "vite": "^5.0.8"
  }
}
```

Now when you run `npm run build`, the file will be moved from `{your_project}/dist/manifest.json` to `{your_project}/manifest.json`. 

This method will even work if you run the build command from another directory, using a command like `npm run --prefix project_directory build`.

### Gotchas

If you set `manifest: true` in `vite.config.js` instead of passing it a filename, it will generate the manifest file at `dist/.vite/manifest.json`. Be sure to check that you're looking for the manifest file in the right place.

## The hard way: writing a Vite plugin

If the previous solution feels _too_ simple, you can write a plugin that accomplishes the same thing, albeit using a lot more code.

Here's what the `vite.config.js` file would look like:

```js
// vite.config.js

import path from "node:path";
import fs from "node:fs/promises";

import { defineConfig } from "vite";

/**
 *
 * @param {string} desiredManifestPath
 * @returns {import('vite').Plugin}
 */
function MoveManifestPlugin(desiredManifestPath) {
  let outDir, manifest;

  const defaultManifestPath = ".vite/manifest.json";

  return {
    name: "move-manifest",
    configResolved(resolvedConfig) {
      outDir = resolvedConfig.build.outDir;

      const resolvedManifest = resolvedConfig.build.manifest;
      if (resolvedManifest) {
        manifest =
          typeof resolvedManifest === "string"
            ? resolvedManifest
            : defaultManifestPath;
      } else {
        manifest = false;
      }
    },
    async writeBundle(_options, _bundle) {
      if (manifest === false) return;

      await fs.rename(
        path.resolve(__dirname, outDir, manifest),
        desiredManifestPath
      );
    },
  };
}

export default defineConfig({
  build: {
    outDir: "dist",
    manifest: "manifest.json",
  },
  plugins: [MoveManifestPlugin("./manifest.json")],
});
```

Let's break down what this code is doing:

1. **It defines a `MoveManifestPlugin` function that returns a Vite plugin object.** It accepts the `desiredManifestPath` as an argument.
1. **When Vite boots up, it grabs the `outDir` and `manifest` from the resolved config and stores them as variables for later.** The resolved config includes Vite's defaults and plugins added to the config. If the `manifest` from the resolved config is set to `true`, it stores the default manifest path.
1. **After all assets have been generated, it moves the manifest file by renaming it, overwriting the file at the desired path if it already exists.** The [`writeBundle`](https://rollupjs.org/plugin-development/#writebundle) output hook is only called after all files have been generated during a build, so this method will not be called when using the development server.
1. **It adds our plugin to the Vite config's plugin array, passing in the desired manifest path as an argument.** This registers our plugin with Vite so it is used during the build.

Like the previous method, this will still work correctly if you run the build command from another directory using `npm run --prefix project_directory build`.

Creating a plugin is much more complicated than modifying the `build` command in `package.json`, so why would you opt to do this? The main advantage is that the plugin will continue to work if the output directory or manifest filenames change. Using a plugin also keeps all of the build information in `vite.config.js`.

Whichever method you use, it will successfully work around Rollup's limitations and move the manifest file outside of the output directory.
