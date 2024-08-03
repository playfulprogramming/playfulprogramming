---
{
    title: "Styling",
    description: "",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["react", "angular", "vue", "webdev"],
    order: 3
}
---

<details>
<summary>What tools are we learning in this chapter?</summary>
Styling is a highly contested space in web development. Surely, no matter what tools I select there will always be someone with a different perspective on which tools I should have written about.

Just to name a few, here's some of the styling tools we're not talking about in this chapter:

- [Styled Components](https://styled-components.com/)
- [StyleX](https://stylexjs.com/)
- [UnoCSS](https://unocss.dev/)
- [Vanilla Extract](vanilla-extract.style/)
- [Less](https://lesscss.org/)

Given the broad range and number of tools we aren't looking at, what tools _are_ we going to be learning about? Well, in addition to a few built-in browser techniques, we'll touch on:

- [Tailwind](https://tailwindcss.com/) for its ubiquitous adoption among utility class libraries (nearly 10M downloads a week on NPM) 
- [CSS Modules](https://github.com/css-modules/css-modules) for its close-to-bare CSS and invisible usage
- [SCSS](https://sass-lang.com/) for its broad adoption (13M downloads a week on NPM) and ability to compile complex styling to raw CSS
- [Emotion](https://emotion.sh/) for its framework agnostic approach to runtime CSS-in-JS
- [Panda CSS](https://panda-css.com/) for its framework agnostic approach to compiled away CSS-in-JS

Let's get into it.

</details>

CSS is awesome. It's also used in every web app out there; which makes sense given that it's one of the three core languages of the web: HTML, CSS, and JavaScript.

If we wanted to, for example, build the header bar of this mockup:

![](./css_intro_mockup.png)

Our markup might look something like this:

```jsx
<header class="container">
	<LogoIcon/>
	<SearchBar/>
	<SettingsCog/>
	<ProfilePicture/>
</header>
```

With the `container` class being defined in CSS like so:

``` css
/* header.css */
.container {
    display: flex;
    padding: 8px 24px;
    align-items: center;
    gap: 32px;
    border-bottom: 2px solid #F5F8FF;
    background: #FFF;
}
```

This works out pretty well for some basic styling!

![TODO: Add alt](./header_basic_css_demo.png)

Now let's build out the search box:

```html
<div class="container">
	<SearchIcon/>
</div>
```

```css
/* search-box.css */
.container {
	border-radius: 8px;
    color: #3366FF;
    background: rgba(102, 148, 255, 0.1);
    padding: 8px;
    flex-grow: 1;
}
```

![TODO: Add alt](./search_box.png)

Now let's import both of these CSS files into the same HTML file:

```html
<link rel="stylesheet" href="header.css">
<link rel="stylesheet" href="search-box.css">
```

Annnnd:

![TODO: Add alt](./header_searchbox_merge.png)

Oh dear... It seems like the styling for the header has impacted the search box and vice-versa.

-----

This merging of styling is occurring because `container` is the same CSS identifier between the search box container and the header container; despite being in two different CSS files.

This problem is known as "scoping", and is a problem that gets worse the larger your codebase gets; it's hard to keep track of every preexisting class name that's been used.

# BEM Classes

One way to solve this problem of scoping in CSS relies on no external tooling than a self-motivated convention. This solution is called "BEM Classes".

BEM stands for "Box Element Modifier" and helps you establish scoping through uniquely named classes that are "namespaced" based on where on the screen they exist.

![TODO: Write alt](./bem.png)

The example we demonstrated scoping problems within has two "boxes":

1) The header
2) The search box

As such, the container for these elements might be called:

```css
.header {}

.search-box {}
```

-----

The "Elements" part of BEM is then referring to the elements within each "Box".

For example, both the header and the search box have icons inside. We would then prefix the "Box" name and then the name of the "Element":

```css
.header__icon {}

.search-box__icon {}
```

------

Finally, we have "Modifiers" to complete the "BEM" acronym.

For example, we might want to have two different colors of icons we support; sharing the rest of the styling across all header icons besides the color.

To do this, we'll prefix the name of the "Box" followed by what the "Modifier" does:

```css
.header--blue {}

.search-box--grey {}
```

------

BEM is a viable alternative for large-scale codebases if you follow its conventions well enough. Many people swear by its utility and ability to leverage the platform itself to solve the scoping problem.

However, for some, even the need to remember what "Box" names have already been used can lead to confusion and other levels of scoping problems.

Let's look at some other alternatives to using the BEM methodology.

# Utility Classes

Another way you're able to solve the problem of scoping through convention is by leaning into the shared aspects of CSS classes as styling identifiers.

This means that instead of something like this:

```html
<div class="search-container"></div>

<style>
.search-container {
	border-radius: 8px;
    color: #3366FF;
    background: rgba(102, 148, 255, 0.1);
    padding: 8px;
    flex-grow: 1;
}
</style>
```

We could instead break these CSS rules into modular reusable classes:

```html
<div class="rounded-md padding-md grow blue-on-blue"></div>

<style>
.rounded-md {
	border-radius: 8px;
}

.padding-md {
	padding: 8px;
}

.grow {
    flex-grow: 1;
}

.blue-on-blue {
    color: #3366FF;
    background: rgba(102, 148, 255, 0.1);
}
</style>
```

This means that instead of having one-off classes that are utilized on a case by case basis, we have global classes that are reused across the entire application.

This comes with a few added benefits:

- Only one CSS file to worry about
- Less duplicated CSS shipped
- Easier to visualize styling from markup

But also has its own downfalls:

- You have to figure out naming for every class; consistency can be challenging
- Your markup ends up cluttered with complex styles represented by many classes

## Tailwind

When the topic of utility classes comes up, Tailwind is not far behind.

Tailwind is a CSS framework that ships with all of the utility classes you could ever need. Just like rolling your own utility classes, Tailwind's are able to be applied to any element and reused globally.

Our example from before might look something like this:

```html
<div class="rounded-lg p-8 grow bg-blue-50 text-blue-800"></div>
```

![TODO: Add alt](./search_box.png)

While Tailwind doesn't solve the cluttered markup challenges with hand-rolling your own utility classes, it comes with some additional benefits over utility classes:

- Ease of training. If someone's used Tailwind before, they know how to use it and what class names to use. Moreover, the Tailwind docs are very very polished.

  ![TODO: Add alt](./tailwind_docs.png)

- Pre-built styling tokens. No need to figure out what `padding-lg` or `padding-xl` should be; Tailwind ships with a strong color pallet and sane defaults out-of-the-box for you to use as your design system base.

  ![TODO: Add alt](./tailwind_colors.png)

- IDE support. From color previews to class name auto-completion, Tailwind has many integrations with most IDEs you'd want to use. 

  ![TODO: Add alt](./tailwind_ide.png)

### Install Tailwind

To install Tailwind, start by using your package manager to install the required packages:

```shell
npm install -D tailwindcss postcss autoprefixer
```

Then, create a `tailwind.config.js` file:

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Next, create a CSS file:

```css
// src/styles.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Finally, you'll configure Tailwind to integrate with your bundler:

<!-- ::start:tabs -->

#### React

To enable Tailwind in your React Vite project, you'll use Vite's built-in support for [PostCSS](https://postcss.org/https://postcss.org/). PostCSS is a CSS transformer that powers Tailwind's compilation of your CSS. (more on this later)

Let's start by configuring the PostCSS configuration:

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Finally we'll import our `src/styles.css` file into Vite's entry point of `index.html`:

```html {7}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### Angular

Since the Angular CLI supports Tailwind out-of-the-box, we don't need to do any additional configuration steps.

So long as your `angular.json` file references the `src/style.css` file we added earlier, you should be off to the races!

#### Vue

Just like React, we'll use [PostCSS](https://postcss.org/https://postcss.org/), the CSS transformer that powers Tailwind's compilation of your CSS, to add Tailwind to our Vue app.

Add the PostCSS configuration:

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

And import our `src/styles.css` file into Vite's `index.html`:

```html {7}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

<!-- ::end:tabs -->

To make sure that Tailwind is properly configured, we can add it to our root component:

<!-- ::start:tabs -->

#### React

```jsx
const App = () => {
	return (
      <a
        className="bg-indigo-600 text-white py-2 px-4 rounded-md"
        href="https://discord.gg/FMcvc6T"
      >
        Join our Discord
      </a>
	)
}
```

// TODO: Add iframe

#### Angular

```angular-ts
@Component({
  selector: "app-root",
  standalone: true,
  template: `
      <a
        class="bg-indigo-600 text-white py-2 px-4 rounded-md"
        href="https://discord.gg/FMcvc6T"
      >
        Join our Discord
      </a>
  `,
})
export class App {}
```

// TODO: Add iframe

#### Vue

```vue
<template>
  <a
    className="bg-indigo-600 text-white py-2 px-4 rounded-md"
    href="https://discord.gg/FMcvc6T"
  >
    Join our Discord
  </a>
</template>
```

// TODO: Add iframe

<!-- ::end:tabs -->

Once you preview the component, it should look like this:

![TODO: Add alt](./tailwind_join_our_discord.png)

### Tailwind Compilation

You might wonder:

> With **so many** utility classes in Tailwind, if I use it the download size of my CSS must be huge!

Not so! See, when Tailwind generates the CSS for your application, it only adds in the classes you actually use within your templates.

This is why we had to add a list of files (via regex) to our `tailwind.config.js` file earlier: It's watching to see what classes to add to your CSS or not.

This means that if you don't have any Tailwind classes in your code, only the prerequisite CSS generated will be included:

![TODO: Add alt](./tailwind_base_size.png) 

> You're even able to shrink this prerequisite CSS down if you'd like. We can customize our `src/style.css` file to only include the prerequisites we need for our project. 
>
> To demonstrate this, you can remove all of the `@tailwind` imports and you'll end up with `0kb` of CSS when you aren't using any Tailwind classes.

### Dynamic Classes using Tailwind

Because of Tailwind's "compile based on your code" strategy, it's able to have a distinct superpower over rolling your own utility classes: [Generating arbitrary CSS from class names.](https://tailwindcss.com/docs/adding-custom-styles#arbitrary-properties)

Say you want to blur an image:

 ```html
 <img class="[filter:blur(4px)]" src="/unicorn.png" alt="A blurry cartoon unicorn in a bowtie"/>
 ```

<img src="./unicorn.png" alt="A blurry cartoon unicorn in a bowtie" style="filter: blur(4px);" />

Or maybe you want to have border width of a specific pixel value:

```html
<img class="rounded-full border-sky-200 border-[12px]" src="/unicorn.png" alt="A cartoon unicorn in a bowtie with a light blue rounded border"/>
```

<img src="./unicorn.png" alt="A cartoon unicorn in a bowtie with a light blue rounded border" style="border-radius: 9999px; border-color: rgb(186 230 253); border-width: 12px; border-style: solid" />

You're able to truly make Tailwind your own.

// TODO: Add iframe to play with

# CSS Modules

But not everyone wants to use utility classes for their solutions. For many, they just want to reuse their existing CSS knowledge with selectors and all just with the scoping problem solved for them.

Well, what if each CSS file had their own auto-scoping pre-applied?

For example, wouldn't it be great if we had t

// Talk about how this is built into just about everything and solves the problems with CSS scoping

# SCSS

// Talk about how adding in a compilation step into your stylesheets enables everything from CSS modules but also adds new features (tokens, etc)

// Talk about the downsides of using a new language for tokens and such

# CSS-in-JS 

// Talk about the benefits regarding typechecking, tokens, and more

// Then talk about the downsides of not working properly in SSR, SSG, or other static contexts

// Also downsides of the performance aspect

React: https://emotion.sh/docs/introduction

Also with React, talk about the `styled` API

Angular: https://stackblitz.com/edit/angular-ivy-v7vjkp?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html

Vue: https://stackblitz.com/edit/vue-ai8qpp?file=src%2FApp.vue

# Compiled CSS-in-JS

// Talk about how ASTs are able to explore your codebase pre-emtively and codegen CSS for you in a static way

React: https://panda-css.com/docs/installation/vite
Angular: https://panda-css.com/docs/installation/cli (Angular)
Vue: https://panda-css.com/docs/installation/vue