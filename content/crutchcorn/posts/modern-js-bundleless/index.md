---
{
  title: "Writing Modern JavaScript without a Bundler",
  description: "",
  published: "2024-11-18T21:52:59.284Z",
  tags: ["javascript", "webdev"],
  license: "cc-by-4",
}
---

Modern web development is awesome. We've never had a period of time where our tools enable us to move faster, ship less bugs, and make great web apps.

But while tools like Vite and Webpack are extremely powerful and can provide a better user experience (UX), they can often feel like they're getting in the way of rapid prototyping.

Let's explore how we can build a website using many of the conveniences of a Vite app while remaining buildless.

In this article, we'll learn how to:

- Import JavaScript files from a script tag
- Use tools like TypeScript and ESLint without adding a build step
- Adding a flavor of "hot module reloading" (HMR) to reload our code in development for better developer experience (DX)
- Import libraries from CDNs
- Move away from CDNs and leverage NPM to install modules
- Pick a framework that supports no-build environments
- Use dependencies that might otherwise not work through micro-bundling

Without further ado, let's dive in!

# Setting up Pre-Requisites

Let's first set up the initial bit of tooling required to run a webpage locally. We'll start with a `package.json` file:

```json
{
	"name": "your-name-here",
	"private": true,
	"version": "0.0.0",
	"scripts": {
		"start": "http-server src"
	},
	"devDependencies": {
		"http-server": "^14.1.1"
	}
}
```

Then create a `src` folder so we don't mix up our source code files with other files we'll add later:

<!-- ::start:filetree -->

- `src/`
  - `index.html`
- `package.json`

<!-- ::end:filetree -->

And finally, we'll create our `index.html` file with a `Hello world` message:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta name="viewport" content="width=device-width" />
		<meta charset="utf-8" />
		<title>Basic Setup</title>
	</head>

	<body>
		<p>Hello, world!</p>
	</body>
</html>
```

Now we can `npm run start` from root and get a basic web server at `http://127.0.0.1:8080/`.

<iframe data-frame-title="Basic Setup - StackBlitz" src="pfp-code:./basic-setup?template=node&embed=1&file=src%2Findex.html"></iframe>

# Import JS files From a Script Tag

Let's start 

- `<script type="module">`
- `import "./something.js"`

<iframe data-frame-title="JS Files Script Tag - StackBlitz" src="pfp-code:./js-files-script-tag?template=node&embed=1&file=src%2Fscript.js"></iframe>

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------

--------




- `<script type="module">`
- `import "./something.js"`
- JSDoc + TypeScript + ESLint
- "HMR"
- Import maps
- CDNs
- PNPM vendor install path
- node_modules aliasing
- Tooling choices (Vue, Lit, etc)
- Bundling deps w/ many files to single ESM file (lol)



## Incompatible Modules

While many libraries are properly packaged to be bundled in a single ESM file, others are not. Let's take `dayjs` as an example:

```shell
pnpm install dayjs
```

This gives us a `src/vendor` folder that looks like this:

<!-- ::start:filetree -->

- `esm/`
	- `locale/`
		- `en.js`
		- `es.js`
		- `fr.js`
		- `...`
	- `plugin/`
	- `constant.js`
	- `index.d.ts`
	- `index.js`
	- `utils.js`
- `locale`
- `CHANGELOG.md`
- `dayjs.min.js`
- `index.d.ts`
- `package.json`
- `README.md`

<!-- ::end:filetree -->

## Framework Support

<!-- ::start:tabs -->

### Angular

Not possible without a compiler to bundle the template.

### React

Technically possible to use without JSX:

```
React.createElement(Element, propsObject, childrenArray)
```

// TODO: Add iframe

But it's not a pretty API at scale; practically infeasible.

### Vue

- Cannot use SFCs
- Must add components via `components: {}` property

### Lit

- Cannot use decorators, must be replaced with `static get` properties
- Must call `customElements.define` manually

<!-- ::end:tabs -->

