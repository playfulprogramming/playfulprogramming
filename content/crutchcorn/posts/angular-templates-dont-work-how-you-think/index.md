---
{
	title: "Angular's Templates Don't Work the Way You Think They Do",
	description: "Angular templates are mission-critial for components. But how do they work? Using a compiler, yes, but how do they bind to the DOM itself? Read on to find out.",
	published: '2023-12-27T13:45:00.284Z',
	tags: ['angular', 'webdev', 'javascript'],
	license: 'cc-by-nc-sa-4'
}
---

When I started learning Angular, I was taught about Angular's components like this:

> Angular's components have a template that is part of a component and a selector that indicates where the template should go. The way Angular adds this template in is by using a compiler to turn the template into a function that is then executed to generate the DOM nodes.

 My thinking when learning about this went something like this:

> **This my old wrong internal model of how Angular templates worked:**
>
> A component compiles its template and assigns it to a `selector`. Whenever Angular sees that `selector`, it runs the template and injects an element with the `selector` to act as the parent.

But see that's not right.

# Explaining Angular templates the _right_ way

Let's take the following example of a `do-nothing` component:

```typescript
@Component({
  selector: 'do-nothing',
  standalone: true,
  // Nothing in the template means nothing rendered as the `do-nothing` element
  template: '',
})
class DoNothingComponent {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DoNothingComponent],
  template: `
    <div>
    	<!-- This is not some magic by Angular, it is creating a "<do-nothing>" in the DOM -->
      <do-nothing></do-nothing>
    </div>
`,
})
export class App {}
```

This code sample will render:

````html
<div>
	<do-nothing></do-nothing>
</div>
````

Because we added an empty template. This `do-nothing` element isn't special, either; the browser is built to allow non-registered elements and treat them akin to a `div` when they render.

Don't believe me? Try to render the above markup in HTML:

```html
<div>
	<do-nothing>
		<p>Hello, world!</p>
  </do-nothing>
</div>
```

This will render the same markup as typed; no removal of `<do-nothing>` will occur and the `<p>` element will act as if it were inside of two `div`s.

That's all that's _really_ happening when we add a template to our existing `<do-nothing>` element:

```typescript
@Component({
  selector: 'do-nothing',
  standalone: true,
  template: '<p>Hello, world!</p>',
})
class DoNothingComponent {}
```

While there _is_ a template compiler in Angular, it's only really there for [reactivity](/posts/what-is-reactivity). Otherwise, it injects the results of `template` in the `selector`'s (by default empty) children array.

<!-- in-content-ad title="Consider supporting" body="Donating any amount will help towards further development of articles like this." button-text="Visit our Open Collective" button-href="https://opencollective.com/unicorn-utterances" -->

This is why when people ask me:

> How to remove the host element created by an Angular component's `selector`?

The answer is: **it is not possible to remove the host element**. The host element is not being created by the `selector`, but rather is injecting the component's template as the children of a non-standard HTML element; who's default behavior is to be a blank slate.

This is one of the reasons directives and components are _so_ similar to one another; **a component is just a directive with a template to be injected into the children of the selector**. Other than that; their functionality is shared between the two.

# Replacing the host element using `selector`

While you can add reactive attributes and even event listeners to the host element by using the `host` decorator property, sometimes you want to avoid having a non-standard host element and use a built-in HTML element like `li` for your host element.

To do this, we'll just change our `selector` to be an attribute string:

```typescript
@Component({
  // Yes, this is supported by components!
  selector: 'li[sayHi]',
  standalone: true,
  template: '<span>Hello, world!</span>',
})
class SayHiComponent {}
```

Now we can use this component and bind it like we might otherwise:

````typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SayHiComponent],
  template: `
    <ul>
      <li sayHi></li>
    </ul>
`,
})
export class App {}
````

Now rather than having an arbitrary `<say-hi>` element without any [semantic meaning](/posts/intro-to-web-accessibility#html-semantic-tags), we can use `<li>` with an attribute to bind our reactivity, lifecycle methods, and everything else components have to offer. 
