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

The gist of LRS is that each layer of your application should be able to live independently and compose together to form your application more cleanly. Ultimately, this code organization will allow you to:

- Know where any individual part of your code lives quickly, regardless of your project's scale
- Test your code in a more user-centric and consistent manner
- Introduce less bugs in your system by keeping logic consolidated
- Decrease the complexity of following the flow of any logic
- Allow developers and stakeholders to more rapidly iterate on UI
- Avoid bike-shedding of where code should live, once adopted

# Pre-requisite Concepts

Before diving into LRS itself, there's a few concepts I want to explain in-depth first. Let's dive in and try to understand the mindset I approach building React apps in.

> Understand the concepts at play? Skip ahead to the filesystem example for a quick glance.

## Defining "Smart" vs "Dumb" Component

Even in React's early days, you may have heard of "Smart" and "Dumb" components. They're so predominant in React's ecosystem in part thank to [this article by Dan Abramov that popularized them back even as far as 2015](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

> **Other names:**
>
> This concept has been referred to in a number of ways. Here's a some alternative terms you may hear:
>
> - "Fat" and "Skinny" components
> - "Container" and "Presentational" components
> - "Stateful" and "Pure" components
> - "Screens" and "Components"
>
> And many more.

While Dan has since shifted his mind on this concept, I've learned to embrace the differences between "smart" and "dumb" components.

Without recapping his article entirely, here's the base concept:

**"Smart"** components deal with the business logic of your app:

```jsx
// This is an example of a "smart" component
function UserTable() {
	const {data, error, isLoading} = useQuery(/* ... */)
    
    useEffect(() => {
		if (!error) return;
        logError(error);
    }, [error])
    
    if (isLoading) {
        return <LoadingIndicator/>
    }
    
    if (error) {
		return <ErrorScreen error={error}/>;
    }
    
    return (
    	/* ... */
    )
}
```

"**Dumb**" components, on the other hand, handle the display and styling of your app:

```jsx
// This is an example of a "dumb" component
function LoadingIndicator() {
	return <>
        <p>Loading...</p>    	
    	<svg class="spinner">
            {/* ...*/}
        </svg>
    </>
}
```

### "Smart" vs "Dumb" rules of thumb

While many versions of the "Smart" vs "Dumb" component arguments have different rules, here's some general rules of thumb I follow with my component types; I generally suggest these guidelines be followed to ensure LRS is used correctly.

- "Dumb" components _may_ contain state and logic, but _only_ when relevant to the UI, **never** business logic.

    ```jsx
    // This is an example of a "dumb" component with state
    function ErrorScreen({error}) {
        // Can contain state, but only state relevant to the UI
        const [isExpanded, setIsExpanded] = useState(false);

        const handleToggle = (event) => setIsExpanded(event.currentTarget.open);

        return <>
            <p>There was an error</p>
            <details onToggle={handleToggle} open={open}>
                <summary>{isExpanded ? 'Hide error details' : 'Show error details'}</summary>
                <pre style="white-space: pre-wrap">
                    <code>{error.stack}</code>
                </pre>
            </details>
        </>
    }
    ```

- "Dumb" components **must** only ever include other "dumb" components

    ```jsx
    // DO NOT DO THIS
    function UserListItem({user}) {
        /* ... */
        const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
        
        return <>
        	{/* ... */}
        	<button onClick={() => setIsEditDialogOpen(true)}>Edit</button>
        	{/* This modal contains buisness logic for editing a user */}
    	    {isEditDialogOpen && <EditUserDialog user={user}/>}
    	</>
    }
    
    // Instead, try moving state up to the parent:
    function UserListItem({user, openUserDialog}) {
        /* ... */
        return <>
        	{/* ... */}
        	<button onClick={openUserDialog}>Edit</button>
    	</>
    }
    ```

- "Dumb" components **must** not include a reliance on any context, service, or other application dependency

    ```jsx
    // DO NOT DO THIS
    function ProfileInformation() {
    	const user = use(UserData);
        
        return <>
        	<p>User's name: {user.name}</p>
        	{/* ... */}
        <>
    }
    
    // Instead, move application developers up and pass them down
    function ProfileInformation({user}) {    
        return <>
        	<p>User's name: {user.name}</p>
        	{/* ... */}
        <>
    }
    ```

    > I will note that I've broken this rule before, but only for contexts that contain presentational-focused information such as:
    >
    > - Internationalization/Translation string contexts
    > - Theme value contexts
    > - Feature flags specific to the UI's presentation

- "Dumb" components *should* not care how data is loaded, changed, or accessed

    ```
    // TODO: Write this example
    ```

- "Smart" components _should_ not have any markup and **must** not contain any styling

    ```
    // TODO: Write this example
    ```

## Defining Utilities vs Services

https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/



## Understanding filename sensitivities

kebab-case thanks to NTFS/Windows support



# Suggested Technologies

This section is much more opinionated than the rest of the article.

## Logic Testing

https://kentcdodds.com/blog/write-tests

Vitest Browser Mode + Testing Library + React Testing Library; no using https://github.com/testing-library/react-hooks-testing-library 

## UI Testing

https://storybook.js.org/

## Styling

Anything that allows you to extract your styling to a dedicated file. 

Ideally CSS/SCSS Modules, Vanilla Extract, or similar. Even Tailwind can work, so long as you extract your classes to a string template literal in a different file



# Introducing Layered React Structure (LRS) {#lrs}

Now that we've gotten that out of the way, let's finally outline what LRS is all about.

<!-- ::start:filetree -->

- `src/`
	- `assets/{open: false}` Where non-code assets, such as images and fonts, live
		- `logo.png`
	- `components/` Where "dumb" components go
		- `button/`
			- `button.modules.scss`
			- `button.stories.ts` The storybook file for the component
			- `button.spec.tsx` The optional unit test file for the component
			- `button.tsx`
			- `index.ts`
		- `input/{open: false}`
			- `input.modules.scss`
			- `input.tsx`
			- `index.ts`
	- `constants/{open: false}` Where non-logic hard-coded values live
		- `theme.ts`
		- `index.ts`
	- `hooks/{open: false}` Where all non-UI React-specific reusable logic lives
		- `use-android-permissions.ts`
		- `index.ts`
	- `services/{open: false}` Where all I/O code logic lives
		- `people.ts`
		- `index.ts`
	- `types/{open: false}` Where non-JS TypeScript types and interfaces live
		- `svg.d.ts`
		- `address.ts`
		- `index.ts`
	- `utils/{open: false}` Where non-React JS reusable logic lives
		- `helpers.ts`
		- `index.ts`
	- `views/` Our folder directory to contain views within our app. Also known as "pages", "screens", or "routes"
		- `homescreen/`
			- `components/{open: false}` The view-specific components. These must all be presentational components
				- `homescreen-list/`
					- `homescreen-list.module.scss`
					- `homescreen.tsx`
					- `index.ts`
			- `homescreen.spec.tsx` The integration test for the `.view.tsx` file
			- `homescreen.stories.tsx` The optional storybook file for the `.ui.tsx` file
			- `homescreen.module.scss` The styling for the `.ui.tsx` file
			- `homescreen.ui.tsx` The presentational component for the view, contains all layout for a view
			- `homescreen.view.tsx` The "smart" component for the view, contains all network and buisness logic
			- `index.ts`
	- `app.tsx` Our component entry point. May contain some providers but not much more

<!-- ::end:filetree -->

> All non-source code configuration files, such as `.storybook` or `.eslintrc.json` files must live outside of the `src`
> folder.
