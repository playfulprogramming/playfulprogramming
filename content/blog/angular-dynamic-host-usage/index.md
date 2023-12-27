---
{
	title: "Angular Dynamic host Property Usage",
	description: "",
	published: '2023-12-27T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['angular', 'webdev', javascript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---


Angular is a _powerful_ framework. Most folks know of it as the component framework, but it's much more than that.

For example, did you know about Angular directives?

Directives allow you to bind to an element via an attribute and change the behavior of said element.

```typescript
import { Component, Directive } from '@angular/core';

@Directive({
  selector: '[doNothing]',
  standalone: true,
})
class DoNothingDirective {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DoNothingDirective],
  template: `
    <p doNothing>I am currently unchanged.</p>
`,
})
export class App {}
```

Think of them as components without templates. They can use lifecycle methods:

```typescript
@Directive({
  selector: '[alertOnDestroy]',
  standalone: true,
})
class AlertOnDestroyDirective implements OnDestroy {
  ngOnDestroy() {
    alert('Element was unrendered!');
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AlertOnDestroyDirective, NgIf],
  template: `
    <p *ngIf="render" alertOnDestroy>Unmount me to see an alert!</p>
    <button (click)="render = !render">Toggle</button>
`,
})
export class App {
  render = true;
}
```

Store state:

```typescript
@Directive({
  selector: '[listenForEvents]',
  standalone: true,
})
class ListenForEventDirective implements OnInit {
  count = 0;
  ngOnInit() {
    document.addEventListener('hello', () => {
      alert(`You sent this many events: ${++this.count}`);
    });
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ListenForEventDirective],
  template: `
    <p listenForEvents>This paragraph tag listens for events!</p>
    <button (click)="sendEvent()">Send event</button>
`,
})
export class App {
  sendEvent() {
    const event = new CustomEvent('hello');
    document.dispatchEvent(event);
  }
}
```

Use the `inject` function:

```typescript
import { Component, Directive, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[listenForEvents]',
  standalone: true,
})
class ListenForEventDirective implements OnInit {
  count = 0;

  doc = inject(DOCUMENT);

  ngOnInit() {
    this.doc.addEventListener('hello', () => {
      alert(`You sent this many events: ${++this.count}`);
    });
  }
}
```

And do just about anything else a component can do without a template of its own.

# Accessing a directives' element with `ElementRef`

Because a directive is attached to an element, a typical usage of a directive is to modify the element it's attached to using `ElementRef` and `inject`; like so:

```typescript
const injectAndGetEl = () => {
  const el = inject(ElementRef);
  console.log(el.nativeElement);
  return el;
};

@Directive({
  selector: '[logEl]',
  standalone: true,
})
class LogElDirective {
  _el = injectAndGetEl();
}
```

While this doesn't do anything yet, it logs the element to the `console.log` method. Let's instead change this code to make the attached element have a red background and white text:

```typescript
import { Component, Directive, ElementRef, inject } from '@angular/core';

const injectAndMakeRed = () => {
  const el = inject(ElementRef);
  el.nativeElement.style.backgroundColor = 'red';
  el.nativeElement.style.color = 'white';
};

@Directive({
  selector: '[red]',
  standalone: true,
})
class RedDirective {
  _el = injectAndMakeRed();
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RedDirective],
  template: `
    <p red>This is red</p>
`,
})
export class App {}
```

# `host` property binding

While the `inject` method works, there's a better way to bind an element: the `host` property.

```typescript
@Directive({
  selector: '[red]',
  standalone: true,
  host: {
    style: 'background-color: red; color: white;',
  },
})
class RedDirective {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RedDirective],
  template: `
    <p red>This is red</p>
`,
})
export class App {}
```

Here, `host` refers to the element the directive is attached to. We can use it to then attach new attributes to the parent element like we did above.

# Dynamic `host` property binding

`host` isn't just useful for static attribute bindings either, you can use it with attribute binding and event listening using the same `[]` and `()` syntax you're familiar with:

````typescript
@Directive({
  selector: '[red]',
  standalone: true,
  host: {
    '[style]': `selected ? 'background-color: red; color: white;' : ''`,
    '(click)': 'selected = !selected',
  },
})
class RedDirective {
  selected = false;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RedDirective],
  template: `
    <p red>This is red when I am selected</p>
`,
})
export class App {}
````



# Dynamic component `host` property binding

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
