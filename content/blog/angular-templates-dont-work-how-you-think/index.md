---
{
	title: "Angular's Templates Don't Work the Way You Think They Do",
	description: "",
	published: '2023-12-27T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['angular', 'webdev', javascript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

But what if I told you that these `host` properties were not unique to a directive? See, when I asked you at the start of the article to think of directives like components without templates I wasn't joking: **Angular components are directives with an additional template that is rendered as the `selector`'s children**.

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

This is why when people ask me:

> How to remove the host element created by an Angular component's `selector`?

The answer is: **it is not possible to remove the host element**. The host element is not being created by the `selector`, but rather is injecting the component's template as the children of a non-standard HTML element; who's default behavior is to be a blank slate.

