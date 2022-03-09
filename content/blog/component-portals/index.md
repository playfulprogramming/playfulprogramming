---
{
    title: "Component Portals",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: []
}
---

There may be times where you might want to render a component from one part of your virtual DOM to an entirely different place in the browser DOM. A good usecase for something like this might be something like a modal that you want to render at the root of the DOM in order to avoid z-indexing.

However, this modal needs to contain properties from part of your component system and emit a response back to that same part of the virtual DOM.

<!-- tabs:start -->

### React

Consider an example where you might have a `dialog-display` component with an `onAccept` property, an `onReject` property and a `message` property:

```html
<div>
	<header></header>
	<main>
		<section>
			{shouldShow && 
				<dialog-display
          message="Licence agreement, do you accept?"
          onReject={handleClode} 
          onAccept={saveResponse}
				/>
      }
      <p>Hello there!</p>
		</section>
	</main>
</div>
```

### Angular
Consider an example where you might have a `dialog-display` component with an `accept` event emitter, a `reject` event emitter and a `message` property:

```html
<div>
	<header></header>
	<main>
		<section>
        <dialog-display
          *ngIf="shouldShow"
          [message]="'Licence agreement, do you accept?'"
          (reject)="handleClode($event)"
          (accept)="saveResponse($event)"
        >
        </dialog-display>
        <p>Hello there!</p>
		</section>
	</main>
</div>
```

### Vue
Consider an example where you might have a `dialog-display` component with an `accept` event emitter, a `reject` event emitter and a `message` property:

```html
<div>
	<header></header>
	<main>
		<section>
        <dialog-display
          v-if="shouldShow"
          :message="'Licence agreement, do you accept?'"
          @reject="handleClode($event)"
          @accept)="saveResponse($event)"
        >
        </dialog-display>
        <p>Hello there!</p>
		</section>
	</main>
</div>
```

<!-- tabs:end -->



But to have the following display in the DOM, when the component renders:

```html
<html>
	<body>
    <div class="display-dialog">
      <p>Licence agreement, do you accept?</p>
      <button>Accept</button>
      <button>Reject</button>
    </div>
    <div>
      <header></header>
      <main>
        <section>
          <p>Hello there!</p>
        </section>
      </main>
    </div>
  </body>
</html>
```

In this example, when the user selects `accept` or `reject`, it passes the values "up" to the section, despite not being a child in the browser DOM due to it's placement in the virtual DOM. Data passed in also shows up as-expected, again, despite not being a child of that element in the browser.

Depending on implementation, even DOM events (`click`ing, `focus` events, and others) are even passed to the respective component `section` rather than to the parent `body` tag



| Angular                                                     | React                                            | Vue             | Notes                                                        |
| ----------------------------------------------------------- | ------------------------------------------------ | --------------- | ------------------------------------------------------------ |
| [Portals](https://material.angular.io/cdk/portal/overview)* | [Portals](https://reactjs.org/docs/portals.html) | No Official API | \* Angular CDK is what contains the Portal logic rather than built into Angular. It interacts differently with event bubbling/etc than how React (which is built in and uses VirtualDOM instead of template injection) works |

