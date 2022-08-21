---
{
    title: "Package Font Files on NPM for Angular Usage",
    description: "Do you use custom fonts that you want to share with multiple apps? Learn how to distribute those fonts on NPM and consume them in Angular!",
    published: '2020-11-24T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['angular', 'javascript', 'npm'],
    attached: [],
    license: 'cc-by-4'
}
---

While working on my company's shared component system, I got a request from our design team. They wanted to keep our branding consistent with internal documents and other assets. As such, they requested we use a font called "Stirling Foundry".

While we're prepping our shared component system for an open-source release to the public, we quickly acknowledged that we couldn't possibly ship this font with the package we intend for public publishing [due to it's licensing and cost](https://www.fonts.com/font/the-foundry/foundry-sterling).

However, we have multiple teams that rely on our shared component system, and we don't want to have to copy+paste the relevant `@font-face` definition or font files. What was our solution? Ship a second `npm` package (in our internal `npm` registry) that contained all of our private assets - including font files.

Let's walk through how we did that.

# Setup Assets Package {#assets-package}

As we're wanting to ship our packages separately, we opted for two Git repositories for the component system and private assets. In a new repository, I have the following for the `package.json`:

```json
{
  "name": "ecp-private-assets",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "release": "standard-version"
  },
  "devDependencies": {
    "@commitlint/cli": "^11.0.0",
    "@commitlint/config-angular": "^11.0.0",
    "husky": "^4.3.0",
    "standard-version": "^9.0.0"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-angular"
    ]
  }
}
```

While this package will not maintain code, I still believe it important to maintain a semver for the package. If a path of the package changes, the semver will communicate that with your package's consumers alongside the changeling. As such, this `package.json` utilizes [Conventional Commit and `commitlint` to auto-generate changelogs and maintain history version](/posts/setup-standard-version/).

## Add Font Files {#font-files}

The "Foundry Stirling" font that I'm shipping is a combination of 7 `.otf` files. I start by creating a `fonts` directory. Inside that directory, I place the `.otf` files in the `fonts` directory.

Once done, your project repo should look something like this:

```
.
├── CHANGELOG.md
├── README.md
├── fonts
│   ├── foundry_sterling_bold.otf
│   ├── foundry_sterling_book.otf
│   ├── foundry_sterling_book_italic.otf
│   ├── foundry_sterling_demi.otf
│   ├── foundry_sterling_extra_bold.otf
│   ├── foundry_sterling_light.otf
│   └── foundry_sterling_medium.otf
├── index.js
├── package-lock.json
└── package.json
```

## `@font-face` CSS Definition {#css-declare}

Now that we have the fonts in their place, we need to create a common `foundry_stirling.css` file to access those fonts from CSS.

Because we're planning on using Angular CLI, we'll want to set the `src` property to be prefixed with `/assets/`, since that's where Angular sends it's assets.

```css
/* foundry_stirling.css */

@font-face {
    font-family: 'Foundry Sterling';
    font-style: normal;
    /* Light */
    font-weight: 300;
    src: local('Foundry Sterling Light'), local('FoundrySterling-light'), url("/assets/foundry_sterling_light.otf") format('opentype')
}

/* ... */

@font-face {
    font-family: 'Foundry Sterling';
    font-style: normal;
    /* Extra-Bold */
    font-weight: 800;
    src: local('Foundry Sterling Extra Bold'), local('FoundrySterling-extra-bold'), url("/assets/foundry_sterling_extra_bold.otf") format('opentype')
}
```

> While we're using CSS here, if you wanted to set the `src` to a different location for non-Angular projects, you could use a SCSS `@mixin` to define the `@font-face` declarations with a customizable `$base_path`.
>
> ```scss
> @mixin foundry_sterling($base_path) {
> @font-face {
>  font-family: 'Foundry Sterling';
>  font-style: normal;
>  /* Extra-Bold */
>  font-weight: 800;
>  src: url("#{$base_path}/foundry_sterling_extra_bold.otf") format('opentype')
> }
>
> // ... Other @font-face declarations
> }
> ```
>
> Then, when consuming the package in your client-side app, you'll want to use something like this:
>
> ```scss
> @include foundry_sterling("/assets")
> ```

### Font Name Value Mapping {#font-val-mapping}

Because our font had multiple files to declare the different CSS values weights, we had to declare the `@font-face` for each of the font files. This is the mapping we used:

| Value | Common weight name        | Related File                      |
| ----- | ------------------------- | --------------------------------- |
| 100   | Thin / Hairline           | N/A                               |
| 200   | Extra-Light / Ultra-Light | N/A                               |
| 300   | Light                     | `foundry_sterling_light.otf`      |
| 400   | Normal / Regular          | `foundry_sterling_book.otf`       |
| 500   | Medium                    | `foundry_sterling_medium.otf`     |
| 600   | Semi-Bold / Demi-Bold     | `foundry_sterling_demi.otf`       |
| 700   | Bold                      | `foundry_sterling_bold.otf`       |
| 800   | Extra-Bold / Ultra-Bold   | `foundry_sterling_extra_bold.otf` |
| 900   | Black / Heavy             | N/A                               |

# Consume Assets Package in Angular CLI {#angular-cli}

Now that we have our `npm` package configured for usage, we'll start preparing for consuming that package by installing it into our app's `package.json`:

```
npm i ecp-private-assets
```

> Remember, `ecp-private-assets` is the name of our internal package. You'll need to replace this `npm i` command with your own package name

## `angular.json` modification {#angular-json}

Once this is done, two steps are required. First, add the following to `angular.json`'s `assets` property. This will copy the files from `ecp-private-assets` to `/assets` once you setup a build.

```json
{
  "glob": "**/*",
  "input": "./node_modules/ecp-private-assets/fonts",
  "output": "./assets/"
}
```

This way, when we use the CSS `url('/assets/')`, it will point to our newly appointed `fonts` files. Once this is added, your `angular.json` should look like this:

```json
{
  "architect": {
    "build": {
      "builder": "@angular-builders/custom-webpack:browser",
      "options": {
        "customWebpackConfig": {
          "path": "./webpack.config.js"
        },
        "outputPath": "www",
        "index": "src/index.html",
        "main": "src/main.ts",
        "polyfills": "src/polyfills.ts",
        "tsConfig": "tsconfig.app.json",
        "aot": true,
        "assets": [
          "src/assets",
          {
            "glob": "**/*",
            "input": "./node_modules/ecp-private-assets/fonts",
            "output": "./assets/"
          }
        ],
        "styles": [
          "src/main.scss"
        ],
        "scripts": []
      }
    }
  }
}
```

## Import CSS {#css-import}

Now that we have our assets in place, we need to import the CSS file into our app.

If your app utilizes `postcss`'s `import` plugin or if you're using vanilla CSS, add the following line to your `main.scss` file:

```css
@import "ecp-private-assets/fonts/foundry_sterling.css";
```

> Remember to keep the `@import`s at the top of your file, as you will receive an error otherwise.

However, if you're not using `postcss` and have SCSS installed, you can use the following:

```scss
@import '~ecp-private-assets/fonts/foundry_sterling.css';
```

# Conclusion

Once you've added the file to your CSS imports and `angular.json`, you should see your font loading as-expected. Because you've setup your fonts to use `npm` to distribute them, you can now reuse your fonts across multiple apps.

If you'd like to learn more or have questions about this setup, feel free to leave a comment down below or join [our Discord](https://discord.gg/FMcvc6T) and ask questions there!
