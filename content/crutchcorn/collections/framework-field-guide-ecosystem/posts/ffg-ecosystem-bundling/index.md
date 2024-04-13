---
{
    title: "Bundling",
    description: "",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["react", "angular", "vue", "webdev"],
    order: 1
}
---

<details>
    <summary>What tools are we learning in this chapter?</summary>
There are many good options out there for bundling today:

- [Parcel](https://parceljs.org/)
- [Rspack](https://www.rspack.dev/)
- [Turbopack](https://turbo.build/pack)

While each come with their own pros and cons, we're instead going to be focusing on [Vite](https://vitejs.dev/). Here's why:

- Vite is the suggested bundler for Vue apps and is maintained by many of the Vue maintainers
- Vite is used by Angular's tooling to host a development server (more on that soon)
- Vite is widely adopted by modern React applications
- The configurability of the other tools _can_ be more complex in many instances
- Due to Vite's popularity, there's a lot of learning resources out there and plugins available to you immediately
- There is an ongoing effort to migrate Vite's core ([Rollup](https://rollupjs.org/)) to Rust (under the name [Rolldown](https://rolldown.rs/)), meaning that your Vite apps will get much faster to bundle in the future

Without further ado, let's get to the meat of the chapter.

</details>

When working with websites written with nothing more than HTML, CSS, and JavaScript, it can be challenging to keep all of your code organized and consolidated.

Not sure what I mean? Let's build a small `index.html` file to demonstate.

This `index.html` file will contains a button and a count of how many times the button was pressed:

```html
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>My Site</title>
	</head>
	<body>
		<p id="count">0</p>
		<button id="button">Add one</button>
	</body>
</html>
```

Naturally, this code won't function without some JavaScript, so let's add in some logic:

```html
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>My Site</title>
	</head>
	<body>
		<p id="count">0</p>
		<button id="button">Add one</button>
		<script>
			const buttonEl = document.querySelector("#button");
			let count = 0;
			buttonEl.addEventListener("click", () => {
				count++;
				document.querySelector("#count").textContent = count;
			});
		</script>
	</body>
</html>
```

Finally, we'll sprinkle in some styling to make it look nicer:

```html
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>My Site</title>
		<style>
			* {
				font-family: sans-serif;
			}

			#count {
				font-size: 3rem;
				text-align: center;
			}

			#button {
				border-radius: 99px;
				background-color: #00344d;
				color: #e5f2ff;
				border: none;
				padding: 1rem 2rem;
				font-size: 2rem;
				margin: 0 auto;
				display: block;
			}
		</style>
	</head>
	<body>
		<p id="count">0</p>
		<button id="button">Add one</button>
		<script>
			const buttonEl = document.querySelector("#button");
			let count = 0;
			buttonEl.addEventListener("click", () => {
				count++;
				document.querySelector("#count").textContent = count;
			});
		</script>
	</body>
</html>
```

<iframe data-frame-title="No Bundle - StackBlitz" src="uu-code:./ffg-ecosystem-no-bundle-1?template=node&embed=1&file=src%2Fmain.jsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Notice how our `index.html` file went from a quickly glanceable 11 lines of code into a somewhat sprawling 40?

# Splitting files using web standards

Let's take that longer `index.html` file and break it into multiple files:

```html
<!-- index.html -->
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>My Site</title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body>
		<p id="count">0</p>
		<button id="button">Add one</button>
		<script src="script.js"></script>
	</body>
</html>
```

```javascript
// script.js
const buttonEl = document.querySelector("#button");
let count = 0;
buttonEl.addEventListener("click", () => {
	count++;
	document.querySelector("#count").textContent = count;
});
```

```css
/* style.css */
* {
    font-family: sans-serif;
}

#count {
    font-size: 3rem;
    text-align: center;
}

#button {
    border-radius: 99px;
    background-color: #00344d;
    color: #e5f2ff;
    border: none;
    padding: 1rem 2rem;
    font-size: 2rem;
    margin: 0 auto;
    display: block;
}
```

<iframe data-frame-title="Web Standard Imports - StackBlitz" src="uu-code:./ffg-ecosystem-web-standard-imports-2?template=node&embed=1&file=src%2Fmain.jsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Notice how our files are now separated by concerns? One file for templating, another for logic, and a final one for styling; all neat and organized.

----------

Now let's say that we want to use [TypeScript](https://www.typescriptlang.org/) and [SCSS](https://sass-lang.com/) (two languages that compile to JavaScript and CSS, respectively) in our website.

```scss
/* style.scss */
* {
    font-family: sans-serif;
}

#count {
    font-size: 3rem;
    text-align: center;
}

$bgColor: #00344d;
$textColor: #e5f2ff;

#button {
    border-radius: 99px;
    background-color: $bgColor;
    color: $textColor;
    border: none;
    padding: 1rem 2rem;
    font-size: 2rem;
    margin: 0 auto;
    display: block;
}
```

```typescript
// script.ts
const buttonEl = document.querySelector("#button") as HTMLButtonElement;
let count = 0;
buttonEl.addEventListener("click", () => {
	count++;
	document.querySelector("#count")!.textContent = "" + count;
});
```

We could:

1. Add the TypeScript compiler as a pre-serve step to compile down to JavaScript
2. Add the SCSS compiler as a pre-serve step to compile down to CSS
3. Link the compiled files to your `index.html` file and hope you didn't make a typo

```json
{
	"name": "your-package-json",
	"scripts": {
		"start": "tsc && sass src && servor src"
	},
	"dependencies": {
		"servor": "^4.0.2",
		"sass": "^1.75.0",
		"typescript": "^5.4.5"
	}
}
```

```json
{
	"// tsconfig.json": "",
	"compilerOptions": {
		"target": "es2016",
		"lib": ["dom"],
		"strict": true,
		"skipLibCheck": true
	},
	"include": ["src/**/*.ts"]
}
```


But by doing this, you'll lose:

- Warnings when you rename a source code file, but not the reference to that file in your `index.html`
- Hot reloading when you change the `.ts` or `.scss` file
  - You can re-introduce that, but you'll need another dependency for it
- Only compiling the related files when you modify one of them

<iframe data-frame-title="No Bundle SCSS/TS - StackBlitz" src="uu-code:./ffg-ecosystem-no-bundle-scss-ts-3?template=node&embed=1&file=src%2Fmain.jsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>



-----

Alternatively, we could use a bundler, change two lines of code in our `index.html` file, change our `"start"` script, and be done:

```html
<!-- index.html -->
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>My Site</title>
		<link rel="stylesheet" href="./src/style.scss" />
	</head>
	<body>
		<p id="count">0</p>
		<button id="button">Add one</button>
		<script src="./src/script.ts"></script>
	</body>
</html>
```

```json
{
	"name": "your-package-json",
	"scripts": {
		"start": "vite"
	},
	"dependencies": {
		"vite": "^5.2.8",
		"sass": "^1.75.0",
		"typescript": "^5.4.5"
	}
}
```

<iframe data-frame-title="Bundled SCSS/TS - StackBlitz" src="uu-code:./ffg-ecosystem-bundle-scss-ts-4?template=node&embed=1&file=src%2Fmain.jsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

This barely scratches the surface of the power and convenience of what a bundler can provide you.

# What does a bundler do?

You may be asking yourself:

> What is a bundler and what can it do?

In short, a bundler is responsible for a wide array of actions that helps you manage your codebase and consolidate it to a final output you can host for your site to be optimized.

A bundler can do many things:

1) Compile templates from `.jsx`, `.vue` files and Angular Templates into dedicated CSS files and JavaScript instructions to run in the browser
2) Compile TypeScript to regular JavaScript so it can run in the browser
3) Translate newer JavaScript code into older JavaScript code so it can run in older browsers
   - This step is called "transpilation"
   - A common tool for transpilation is Babel
4) Automatically remove unused code from the output to make things faster and smaller
   - This step is called "Tree-shaking"
5) Merge multiple files that rely on one another into a single file so that HTTP doesn't have to make multiple round-trips to download everything
6) Optimize the code for size, making harder for humans to read but faster to download
   - This step is called "minification"

While each of these steps may call a different tool under-the-hood, most bundlers nowadays do a good job at abstracting away those nuances for many use-cases.

As such, you typically either do not need to modify a bundler's behavior beyond a couple of configuration options, if even.

> This isn't to say that you can never modify a bundler's behavior, just be aware that when you do so, there tends to be seldom resources out there to explain what to do to fix things when they go awry. Thar be dragons. 🐉





# The Bundling Pipeline





<!-- tabs:start -->

## React

```tsx
// A TypeScript React component - `App.tsx`
export const App = () => {
    const message: string = "Test";
	return <p>{message}</p>
}
```

// TODO: Write this


## Angular

// TODO: Write this

## Vue

// TODO: Write this

<!-- tabs:end -->


> Notice how the bundling process doesn't inherently have to include every feature available. You could, for example, opt out of the TypeScript compilation by using JavaScript.
>
> Similarly, you can often explicitly disable specific features — like minification — by configuring your bundler to skip that step.

