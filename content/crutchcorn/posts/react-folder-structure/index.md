---
{
  title: "Scale Your Project with Layered React Structure",
  description: "",
  published: '2025-06-01T20:12:03.284Z',
  tags: [ 'react', 'webdev', 'opinion' ],
  license: 'cc-by-4'
}
---

> **Preface:**
>
> When I first started web development, I worked on an Angular 2 project. In Angular there's a [strong, opinionated, and reasonably laid out style guide](https://angular.dev/style-guide) that outlines how you should structure your project. Combined with a list of official tools that built on top of the core, well written Angular apps can feel very consistent from one app to another.
>
> Imagine my surprise when my next work project was in React and I learned how there's few official libraries relevant to most app authors and no codified style guide to reference. This feeling never truly left even after a few React projects under my belt so, when I started working on my own (now defunct) multi-year-long application, I was determined to solve this problem.
>
> This article outlines the solution I came up with after years of experimentation and has been refined after years of production usage after said experimentation.

This article proposes a method of laying out your React project called "**Layered React Structure**", or "**LRS**" for short.

It enables 



We have the following whitelist of files and folders in the `src` directory:

- `assets`
	- Where non-code assets, such as images and fonts, live
- `components`
	- Where "dumb" components go to live when they're utilized in more than one location
- `constants`
	- Where non-logic hard-coded values live
	- Any hardcoded value should be broken out to a variable, once a variable is used in more than one file, go ahead
	  and extract it to a variable
	- [Theme values](https://styled-components.com/docs/advanced#theming) and programmatic app config files should live
	  here
- `hooks`
	- Where all non-UI React-specific reusable logic lives
	- React-specific re-usable logic that's longer than 20 lines of code long should live here
- `services`
	- Where all I/O code logic lives
- `types`
	- Where non-JS TypeScript types and interfaces live
	- TypeScript types that aren't specific to a given component and are used in more than 3 components should be moved
	  here
- `utils`
	- Where non-React JS/TS reusable logic lives
	- Non-React re-usable logic that's longer than 10 lines of code long should live here
- `views`
	- Our folder directory to contain views within our app also known as "pages", "screens", or "routes"
	- Any "view" may contain the following files/folders:
		- `components` - The view-specific components. These must all be presentational components
		- `[name].styles.tsx` - The styling for the `.ui.tsx` file
		- `[name].ui.tsx` - The presentational component for the view, contains all layout for a view
		- `[name].view.tsx` - The "smart" component for the view, contains all network and buisness logic
- `app.tsx`
	- Our component entry point. May contain some providers but not much more

> All non-source code configuration files, such as `.storybook` or `.eslintrc.json` files must live outside of the `src`
> folder.

### Full Filesystem Example

<!-- ::start:filetree -->

- `src/`
	- `assets/`
		- `logo.png`
	- `components/`
		- `button/`
			- `button.styles.ts`
			- `button.stories.ts`
			- `button.spec.tsx`
			- `button.tsx`
			- `index.ts`
		- `input/`
			- `input.styles.ts`
			- `index.ts`
	- `constants/`
		- `theme.ts`
		- `index.ts`
	- `hooks/`
		- `use-android-permissions.ts`
		- `index.ts`
	- `services/`
		- `people.ts`
		- `index.ts`
	- `types/`
		- `svg.d.ts`
		- `address.ts`
		- `index.ts`
	- `utils/`
		- `helpers.ts`
		- `index.ts`
	- `views/`
		- `homescreen/`
			- `components/`
				- `homescreen-list/`
					- `homescreen-list.styles.ts`
					- `homescreen.tsx`
					- `index.ts`
			- `homescreen.spec.tsx`
			- `homescreen.stories.tsx`
			- `homescreen.styles.ts`
			- `homescreen.ui.tsx`
			- `homescreen.view.tsx`
			- `index.ts`
	- `app.tsx`

<!-- ::end:filetree -->
