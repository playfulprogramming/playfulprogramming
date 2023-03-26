---
{
    title: "Directives",
    description: "If components are a way to share JS logic between mutliple, composible DOM nodes; directives are a way to assign logic to any single DOM node.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 13,
    series: "The Framework Field Guide"
}
---

In our last chapter, we talked about how you can create custom logic that isn't associated with any particular component, but can be used by said components to extend its logic.

This is helpful for sharing logic between components, but isn't the whole story of code re-use within React, Angular, and Vue.

For example, we may want to have logic that's associated with a given DOM node without having to create an entire component specifically for that purpose. This exact problem is what a Directive aims to solve.

In this chapter, we'll explore:

- What a directive is
- Basic directive usage
- How to use lifecyle methods in directives
- How to conditionally render UI with directives

# What is a directive

In our [Introduction to Components chapter](/posts/ffg-fundamentals-intro-to-components), we talked about how a component is a collection of structure, styling, and logic that's associated with one or more HTML nodes. 

A directive, on the other hand, is a collection of JavaScript logic that you can apply to a single DOM element.

While this comparison between a directive and a component seem stark, think about it: Components have a collection of JavaScript logic that's applied to a single "virtual" element.

As a result, some frameworks, like Angular, take this comparison literally and utilize directives under-the-hood in order to create components.

Here's what a basic directive looks like in each of the three frameworks:



<!-- tabs:start -->

## React

React as a framework doesn't _quite_ have the concept of directives built-in. 

Luckily, this doesn't mean that us React developers need to be left behind. Because a React component is effectively just a JavaScript function, we can use the base concept of a directive to create shared logic for DOM nodes.

Remember from our [Element Reference chapter that you can use a function associated with an element's `ref` property](localhost:9000/posts/element-reference). We'll use this concept alongside the idea of a [custom hook](/posts/ffg-fundamentals-shared-component-logic#Rules-of-Custom-Hooks) in order to create a simple API to add logic to an HTML element:

```jsx
const useLogElement = () => {
  const ref = (el) => console.log(el);
  return { ref };
};

const App = () => {
  const { ref } = useLogElement();
  return <p ref={ref}>Hello, world</p>;
};
```

> While we'll continue to cover alternative APIs that can do much of the same as directives in other frameworks, it might be beneficial to broaden your horizons and take a glance at what a "true" directive looks like in other frameworks. 

## Angular

You setup a directive in Angular very similarly to how you might construct a component: using the `@Directive` decorator.

```typescript
import { Component, ElementRef, Directive } from '@angular/core';

@Directive({
  selector: '[sayHi]',
})
class LogElementDirective {
  constructor() {
    console.log("Hello, world!");
  }
}

@Component({
  selector: 'my-app',
  template: `
    <p sayHi>Hello, world</p>
  `,
})
class AppComponent {}
```

Here, we've told Angular to listen for any `sayHi` attributes ([using a CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)) and run a `console.log` any time an element with said attribute is rendered.

This isn't particularly useful, but demonstrates the most minimal version of what a directive looks like.

Instead, it's oftentimes more useful to get a reference to the element that the attribute is present on. To do this, we'll use Angular's [dependency injection](/posts/ffg-fundamentals-dependency-injection) to ask Angular for an `ElementRef` that's present within the framework's internals when you create a directive instance.

```typescript
@Directive({
  selector: '[logElement]',
})
class LogElementDirective {
  constructor(private el: ElementRef<any>) {
    // This will output a reference to the HTMLParagraphElement
    console.log(this.el.nativeElement);
  }
}

@Component({
  selector: 'my-app',
  template: `
    <p logElement>Hello, world</p>
  `,
})
class AppComponent {}
```

## Vue

Setting up a directive in Vue is as simple as creating an object within our `setup` `script`.

Inside of this object, we'll add a key for `created` and assign it a function in order to let Vue know to run said function when the directive is instantiated.

```vue
<!-- App.vue -->
<script setup>
const vSayHi = {
  created: () => console.log('Hello, world!'),
}
</script>

<template>
  <p v-say-hi>Hello, world</p>
</template>
```

Directives in Vue must start with `v-` prefix (which is why our object starts with `v`) and are `dash-cased` when presented inside of a `template`. This means that our `vSayHi` object directive is turned into `v-say-hi` when used in the template.

<!-- tabs:end -->

Once our apps load up, you should see a `console.log` execute that prints out the [HTMLParagraphElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLParagraphElement) reference.

You'll notice that these directives' logic are applied to elements through some means of an attribute-like selector, similar to how a component has a named tag associated with it.

Now that we've seen what a directive looks like, let's apply it to some real-world examples.


# Basic Directives

Now that we have a reference to the underlying DOM node, we can utilize that to do various things with the element.

For example, let's say that we wanted to change the color of a button using nothing more than an HTML attribute - we can do that now using [the HTMLElement's `style` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

<!-- tabs:start -->

## React

```jsx
const useStyleBackground = () => {
  const ref = (el) => {
    el.style.background = 'red';
  };
  return { ref };
};

const App = () => {
  const { ref } = useStyleBackground();
  return <button ref={ref}>Hello, world</button>;
};
```

## Angular

```typescript
@Directive({
  selector: '[styleBackground]',
})
class StyleBackgroundDirective {
  constructor(private el: ElementRef<any>) {
    this.el.nativeElement.style.background = 'red';
  }
}

@Component({
  selector: 'my-app',
  template: `
    <button styleBackground>Hello, world</button>
  `,
})
class AppComponent {}
```

## Vue

When using the `created` property function inside of a directive, we can gain access to the underlying DOM node the directive is applied to using the function's arguments.

The first argument that's passed to `created` is an DOM node reference that we can change the `style` property of in order to style our `button`.

```vue
<!-- App.vue -->
<script setup>
const vStyleBackground = {
  created: (el) => {
    el.style.background = 'red'
  },
}
</script>

<template>
  <button v-style-background>Hello, world</button>
</template>
```

<!-- tabs:end -->

>While this is a good demonstration of how you can use an element reference within a directive, styling an element is generally suggested to be done within a CSS file itself, unless you have good reason otherwise.

# Lifecycle Methods in Directives

[Previously in the book, we've explored adding in a `focus` event when an element is rendered](/posts/ffg-fundamentals-component-reference#Using-component-reference-to-focus-our-context-menu). However, in this chapter we explicitly had to call a `focus` method. What if we could have our `button` focus itself immediately when it's rendered onto the page?

Luckily, with attributes we can!

See, while a component has a lifecycle of being rendered, updated, cleaned up, and beyond - so too does an element that's bound to a directive!

Because of this, we can hook into the ability to use lifecycle methods within directives to [add a side effect](/posts/ffg-fundamentals-side-effects#Side-Effects) that focuses when an element is rendered.

<!-- tabs:start -->

## React

As we already know, we can use built-in React hooks into our custom hooks, which means that we can use `useEffect` just like we could inside of any other component.

```jsx
const useFocusElement = () => {
  const [el, setEl] = useState();

  useEffect(() => {
    if (!el) return;
    el.focus();
  }, [el])

  const ref = (localEl) => {
    setEl(localEl);
  };
  return { ref };
};

const App = () => {
  const { ref } = useFocusElement();
  return <button ref={ref}>Hello, world</button>;
};
```

> Truthfully, this is a bad example for `useEffect`. Instead, I would simply run `localEl.focus()` inside of the `ref` function.

## Angular

Angular uses the same `implements` implementation for classes to use lifecycle methods in directives as it does components.

```typescript
@Directive({
  selector: '[focusElement]',
})
class StyleBackgroundDirective implements OnInit {
  constructor(private el: ElementRef<any>) {}

  ngOnInit() {
    this.el.nativeElement.focus();
  }
}

@Component({
  selector: 'my-app',
  template: `
    <button focusElement>Hello, world</button>
  `,
})
class AppComponent {}
```

## Vue

Just as you can use the `created` property on a directive object, you can change this property's name to match any of Vue's component lifecycle method names. 

```vue
<!-- App.vue -->
<script setup>
const vFocusElement = {
  mounted: (el) => {
    el.focus()
  },
}
</script>

<template>
  <button v-focus-element>Hello, world</button>
</template>
```

For example, if we wanted to add a cleanup to this directive, we could change `mounted` to be `unmounted` instead.

<!-- tabs:end -->



# Passing Data to Directives

Let's look back at our directive we wrote to add colors to our button. It worked, but that red we were applying to the `button` element was rather harsh, wasn't it?

We could just set the color to a nicer shade of red — say, `#FFAEAE` — but then what if we wanted to re-use that code elsewhere to set a different button to blue?

To solve this issue of per-instance customization of a directive, let's add the ability to pass in data to a directive.

<!-- tabs:start -->

## React

Because a React Hook is a function at heart, we're able to just pass values as we would to any other function:

```jsx
const useStyleBackground = (color) => {
  const ref = (el) => {
    el.style.background = color;
  };
  return { ref };
};

const App = () => {
  const { ref } = useStyleBackground('#FFAEAE');
  return <button ref={ref}>Hello, world</button>;
};
```

## Angular

In order to pass a value to an Angular directive, we can use the `@Input` directive, the same as a component. 

However, one way that a directive's inputs differ from a component's is that you need to prepend the `selector` value as the `Input` variable name, like so:

```typescript
@Directive({
  selector: '[styleBackground]',
})
class StyleBackgroundDirective implements OnInit {
  @Input() styleBackground: string;

  constructor(private el: ElementRef<any>) {}

  ngOnInit() {
    this.el.nativeElement.style.background = this.styleBackground;
  }
}

@Component({
  selector: 'my-app',
  template: `
    <button styleBackground="red">Hello, world</button>
  `,
})
class AppComponent {}
```

## Vue

While Vue's directives are not simply functions, as they're objects that contain functions, they are able to access the value bound to the directive through a function argument on each property. 

While the first argument of each lifecycle's key is an element reference (`el`) , the second argument will always be the value that's assigned to the directive.

```vue
<!-- App.vue -->
<script setup>
const vStyleBackground = {
  mounted: (el, binding) => {
    el.style.background = binding.value
  },
}
</script>

<template>
  <button v-style-background="'red'">Hello, world</button>
</template>
```

You access the bindings' value through `binding.value`, but can also access things like the previous value by using `binding.oldValue`.

<!-- tabs:end -->

## Passing JavaScript Values

Similar to how you can pass any valid JavaScript object to a component's inputs; you can do the same with a directive.

To demonstrate this, let's create a `Color` class that includes the following properties:

```javascript
class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
```

Then, we can render out this color inside of our background styling directive:

<!-- tabs:start -->

### React

```jsx
class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

const colorInstance = new Color(255, 174, 174);

const useStyleBackground = (color) => {
  const ref = (el) => {
    el.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
  };
  return { ref };
};

const App = () => {
  const { ref } = useStyleBackground(colorInstance);
  return <button ref={ref}>Hello, world</button>;
};
```

### Angular

```typescript
class Color {
  r: number;
  g: number;
  b: number;

  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

@Directive({
  selector: '[styleBackground]',
})
class StyleBackgroundDirective implements OnInit {
  @Input() styleBackground: Color;

  constructor(private el: ElementRef<any>) {}

  ngOnInit() {
    const color = this.styleBackground;
    this.el.nativeElement.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
}

@Component({
  selector: 'my-app',
  template: `
    <button [styleBackground]="color">Hello, world</button>
  `,
})
class AppComponent {
  color = new Color(255, 174, 174);
}
```

### Vue

```vue
<!-- App.vue -->
<script setup>
class Color {
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }
}

const colorInstance = new Color(255, 174, 174)

const vStyleBackground = {
  mounted: (el, binding) => {
    const color = binding.value
    el.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`
  },
}
</script>

<template>
  <button v-style-background="colorInstance">Hello, world</button>
</template>
```

<!-- tabs:end -->

Now we can customize the color using incremental updates to the RGB values of a color we're passing.

## Passing Multiple Values

While a class instance of `Color` may be useful in production apps, for smaller projects it might be nicer to manually pass the  `r`, `g`, and `b` values directly to a directive, without needing a class.

Just like we're able to pass mutliple values to a component, we can do the same within a directive. Let's see how it's done for each of the three frameworks:

<!-- tabs:start -->

### React

Once again, the fact that a custom hook is still just a normal function provides us the ability to pass multiple arguments, as if they are any other function.

```jsx
const useStyleBackground = (r, g, b) => {
  const ref = (el) => {
    el.style.background = `rgb(${r}, ${g}, ${b})`;
  };
  return { ref };
};

const App = () => {
  const { ref } = useStyleBackground(255, 174, 174);
  return <button ref={ref}>Hello, world</button>;
};
```

### Angular

I have to come clean about something: when I said "a directive's input must be named the same as the attribute's selector", I was lying to keep things simple to explain.

In reality, you can name an input anything you'd like, but then need to have an empty attribute with the same name as the selector.

```typescript
@Directive({
  selector: '[styleBackground]',
})
class StyleBackgroundDirective implements OnInit {
  @Input() r: number;
  @Input() g: number;
  @Input() b: number;

  constructor(private el: ElementRef<any>) {}

  ngOnInit() {
    this.el.nativeElement.style.background = `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

@Component({
  selector: 'my-app',
  template: `
    <button styleBackground [r]="255" [g]="174" [b]="174">Hello, world</button>
  `,
})
class AppComponent {}
```

> If you forget to include the attribute with the same selector (in this case,  `styleBackground`), you'll get the following error:
> 
> ```
> Can't bind to 'r' since it isn't a known property of 'button'.
> ```

### Vue

Vue's directives do not directly support multiple arguments, as there's only one syntax to bind a value into a directive.

However, you can get around this limitation by passing an argument to the directive instead, like so:

```vue
<!-- App.vue -->
<script setup>
const vStyleBackground = {
  mounted: (el, binding) => {
    const color = binding.value
    el.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`
  },
}
</script>

<template>
  <button v-style-background="{ r: 255, g: 174, b: 174 }">Hello, world</button>
</template>
```

<!-- tabs:end -->







# Conditionally Rendered UI Via Directives

The examples we've used to build out basic directives have previously all mutated elements that don't change their visibility; these elements are always rendered on screen and don't change that behavior programatically.

But what if we wanted a directive that helped us dynamically render an element, [like we do with our conditional rendering](/posts/ffg-fundamentals-dynamic-html#Conditional-Rendering), but using only an attribute to trigger the render?

Luckily, we can do that!

---

Let's build out a basic "[feature flags](https://www.youtube.com/watch?v=c8KgKTgyFUE)" implementation, where we can decide if we want a part of the UI rendered based on specific values.

The basic idea of a feature flag is that you have multiple different UIs that you'd like to display to different users in order to test their effectivity.

For example, say you want to test two different buttons and see which button gets your users to click on more items to purchase:

```html
<button>Add to cart</button>
```

```html
<button>Purchase this item</button>
```

You'd start a "feature flag" that separates your audience into two groups, show each group their respective button terminology, and measure their outcome on user's behaviors when purchasing. You'd then take these measured results and use them to change the roadmap and functionality of your app.

While the separation of your users into "groups" (or "buckets") is typically done on the backend, let's just use a simple object for this demo.

```javascript
const flags = {
  addToCartButton: true,
  purchaseThisItemButton: false
};
```

In this instance, we might render something like:

```html
<button id="addToCart">Add to Cart</button>
```

Let's build a basic version of this in each of our frameworks.

<!-- tabs:start -->

## React

React has a special ability that the other frameworks do not. Using JSX, you're able to assign a bit of HTML template into a variable... But that doesn't mean that you have to use that variable.

The idea in a feature flag is that you conditionally render UI components.

See where I'm going with this?

Let's store a bit of UI into a JSX variable and pass it to a custom React Hook that either returns the JSX or `null` to render nothing, based on the `flags` named boolean.

```jsx
const flags = {
  addToCartButton: true,
  purchaseThisItemButton: false
};

const useFeatureFlag = ({
  flag,
  enabledComponent,
  disabledComponent = null,
}) => {
  if (flags[flag]) {
    return { comp: enabledComponent };
  }
  return {
    comp: disabledComponent,
  };
};

export default function App() {
  const { comp: addToCartComp } = useFeatureFlag({
    flag: 'addToCartButton',
    enabledComponent: <button>Add to cart</button>,
  });
  
  const { comp: purchaseComp } = useFeatureFlag({
    flag: 'purchaseThisItemButton',
    enabledComponent: <button>Purchase this item</button>,
  });
    
  return (
    <div>
      {addToCartComp}
      {purchaseComp}
  	</div>
  );
}
```

## Angular

Before we get into how to implement this functionality in Angular, I first need to circle back to [how Angular uses `ng-template` to define partial application of HTML elements that can then be rendered after-the-fact](/posts/ffg-fundamentals-accessing-children#Back-to-the-start-ng-template-rendering).

Remember from this chapter that you're able to pass an `ng-template` to another component like so:

```typescript
@Component({
  selector: 'parent-list',
  template: `
    <div>
      <ng-template *ngFor="let template of children" [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{backgroundColor: 'grey'}"></ng-template>
    </div>
  `,
})
class ParentListComponent {
  @ContentChildren('item', { read: TemplateRef }) children: QueryList<
    TemplateRef<any>
  >;
}

@Component({
  selector: 'my-app',
  template: `
  <parent-container>
    <ng-template #item let-backgroundColor="backgroundColor">
      <p [style]="{backgroundColor}">Hello, world!</p>
    </ng-template>
  </parent-container>
  `,
})
class AppComponent {
}
```

Well, what if I said that you can pass a template to a directive as well? The syntax is a bit different, but in the end you get access to an `ng-template` all the same.

### Use Templates to Pass Parts of the DOM to Directives 

Here, we'll use dependency injection to get access to an `ng-template`:

```typescript
@Directive({
  selector: '[item]',
})
class ItemDirective {
  constructor(
    private template: TemplateRef<any>
  ) {
    console.log(this.template);
  }
}

@Component({
  selector: 'my-app',
  template: `
    <div>
      <ng-template item>
        <p>Hello, world!</p>
      </ng-template>
    </div>
  `,
})
class AppComponent {}
```

> Because we're expecting Angular to pass an `ng-template` reference to `ItemDirective`, if we use the `item` attribute on anything other than a template, we'll end up with the following error:
>
> ```
> Property 'backgroundColor' does not exist on type 'AppComponent'.
> ```

Doing this, we'll see that we get the `TemplateRef` as expected in our console:

```
TemplateRef {_declarationLView: Array[34], _declarationTContainer: {…}, elementRef: {…}}
```

But wait, if you don't have a template, how can you render this `template`? After all, without a template, you don't have `ngTemplateOutlet` to render the template like we were doing before.

This is where `ViewContainerRef` comes into play.

### Render templates from directives using `ViewContainerRef`

See, in Angular, there's always an instance of the parent element called a "View Container". This allows us to render a template into the "View Container" using [the `ViewContainerRef` API](https://angular.io/api/core/ViewContainerRef).

This `ViewContainerRef` has the ability to render a `TemplateRef` using `createEmbeddedView`:

```typescript
@Directive({
  selector: '[passBackground]',
})
class PassBackgroundDirective {
  constructor(
    private parentViewRef: ViewContainerRef,
    private templToRender: TemplateRef<any>
  ) {
    this.parentViewRef.createEmbeddedView(this.templToRender);
  }
}

@Component({
  selector: 'my-app',
  template: `
    <div>
      <ng-template passBackground>
        <p>Hello, world!</p>
      </ng-template>
    </div>
  `,
})
class AppComponent {}
```

Now we should be able to see the `p` tag rendering!

> While I'd love to explain more about how `ViewContainerRef` gets set up in Angular, and what `createEmbeddedView` is doing under-the-hood this get a little into the weeds of how Angular works internally. I'll explain this more in-depth in [the third book in the "Framework Field Guide" series, titled "Internals"](https://framework.guide).

> Don't want to wait for the third book in order to learn what a `ViewContainerRef` is? [I wrote an article explaining what it is for Unicorn Utterances](https://unicorn-utterances.com/posts/angular-templates-start-to-source#components-are-directives).



### Pass data to rendered templates inside of Directives

Just as we could [pass data to a template inside of a component using `ngTemplateOutletContext`](/posts/ffg-fundamentals-accessing-children#Template-Contexts), we can do the same using a second argument of `createEmbeddedView`:

```typescript
@Directive({
  selector: '[passBackground]',
})
class PassBackgroundDirective {
  constructor(
    private parentViewRef: ViewContainerRef,
    private templToRender: TemplateRef<any>
  ) {
    this.parentViewRef.createEmbeddedView(this.templToRender, {
      backgroundColor: 'grey',
    });
  }
}

@Component({
  selector: 'my-app',
  template: `
    <div>
      <ng-template passBackground let-backgroundColor="backgroundColor">
        <p [style]="{backgroundColor}">Hello, world!</p>
      </ng-template>
    </div>
  `,
})
class AppComponent {}
```

We can also simplify our `AppComponent` template to use [structural directives](https://unicorn-utterances.com/posts/angular-templates-start-to-source#structural-directives) instead of an explicit `ng-template`:

```typescript
@Component({
  selector: 'my-app',
  template: `
    <div *passBackground let-backgroundColor="backgroundColor">
        <p [style]="{backgroundColor}">Hello, world!</p>
    </div>
  `,
})
class AppComponent {}
```

### Build the Feature Flag Behavior using Structural Templates

Now that we have our foundation written out, we can finally build a simple `featureFlag` directive that renders nothing if a `flag` is false, but renders the contents if a flag is `true`:

````typescript
const flags = {
  addToCartButton: true,
  purchaseThisItemButton: false
};

@Directive({
  selector: '[featureFlag]',
})
class StyleBackgroundDirective {
  @Input() featureFlag: string;

  constructor(
    private parentViewRef: ViewContainerRef,
    private templToRender: TemplateRef<any>
  ) {
    this.parentViewRef.createEmbeddedView(this.templToRender);
  }
}

@Component({
  selector: 'my-app',
  template: `
    <div>
	    <button *featureFlag="'addToCartButton'">Add to cart</button>
    	<button *featureFlag="'purchaseThisItemButton'">Purchase this item</button>
    </div>
  `,
})
class AppComponent {}
````

## Vue

Unlike React and Angular, Vue does not have a way of storing parts of a template inside of a variable without rendering it on-screen.

> While Vue _does_ [have the ability to use the `template` tag in some ways](/posts/ffg-fundamentals-transparent-elements), it ultimately serves a different purpose than the one we're trying to implement here.

As a result, **Vue is unable to implement a `featureFlag` directive out-of-the-box** without some major code overhaul.

Instead, it's suggested to use a component to conditionally render parts of the UI instead:

```vue
<!-- FeatureFlag.vue -->
<script setup>
const flags = {
  addToCartButton: true,
  purchaseThisItemButton: false,
}

const props = defineProps(['name'])
</script>

<template>
  <slot v-if="flags[props.name]"></slot>
</template>
```

```vue
<!-- App.vue -->
<script setup>
import FeatureFlag from './FeatureFlag.vue'
</script>

<template>
  <FeatureFlag name="addToCartButton">
    <button>Add to cart</button>
  </FeatureFlag>
  <FeatureFlag name="purchaseThisItemButton">
    <button>Purchase this item</button>
  </FeatureFlag>
</template>
```

In my opinion, this is not as clean as using a directive, since you need to have two additional HTML tags, but that's just one of the limitations with Vue's directive.

That said, this method is fairly extensible as you can even use this `FeatureFlag` component to [fetch data from the server using an Async Component, which is a concept that's built into Vue](https://vuejs.org/guide/components/async.html#basic-usage).

> While you _could_ theoretically use things like `el.innerHTML` to mutate the HTML of a DOM node inside of a directive in order to display what you'd like to, there are a few major limitations:
>
> - No live updating the values within said HTML
> - Difficult to capture DOM events
> - Slow performance
> - Brittle and easy to break

<!-- tabs:end -->