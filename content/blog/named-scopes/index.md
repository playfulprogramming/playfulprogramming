---
{
    title: "Named Scope",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 10,
    series: "The Framework Field Guide"
}
---

Similar to how content projection works by displaying children of a component where present, you're also able to do this for more than a single set of children by providing what's called a "named slot" in order to project various peices of UI in more than a single location. For example, you could have an `AppLayout` component that would provide a place to insert a sidenav bar, main set of content, and more. This would allow you to project dynamic content where expected while keeping a consistent UI layout for the primary elements of your app

<!-- tabs:start -->

### React

Because a JSX tag simply returns a value as if it were any other function, you're able to utilize the props inside of a React component in order to pass those values and display them

```jsx
const AppLayout = ({sidebar, mainContent}) => {
	<div>
		{sidebar}
		<header>{content}</header>
		<main>
			{mainContent}
    </main>
	</div>
}

const App = () => {
	return <AppLayout
		sidebar={<Sidebar/>}
		mainContent={<AppContent/>}
	/>
}
```

### Angular
```typescript
@Component({
	selector: "app-layout",
	template: `
		<ng-container>
			<ng-content></ng-content>
		</ng-container>
	`
})
class AppLayoutComponent {
}
```

### Vue
```html

```

<!-- tabs:end -->



