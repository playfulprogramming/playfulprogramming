---
{
	title: "Why Can't Angular Cast An Element to Another?",
	description: "",
	published: '2025-12-01T13:45:00.284Z',
	tags: ['angular', 'webdev', 'javascript'],
	license: 'cc-by-nc-sa-4'
}
---

While I'm a huge fan of Angular at heart, I've often used React at my day jobs.  While working with React component libraries - either internal or external - you're likely to run into a pattern like so:

```jsx
<OurButton as="a" href="oceanbit.dev">This looks like a button, but is a link</OurButton>
```

This `<OurButton/>` component is able to expose an internal `"button"` tag when nothing is passed, but transform into any other `as` element when the property is passed.

What's cooler is that the other attributes from the `as` original element (like `<a>`'s `href` above) can be type-safe using some TypeScript magic.

You can implement it in Vue, too!

<!-- ::start:tabs -->

# React

```tsx
import {
	ComponentPropsWithoutRef,
	ElementType,
	PropsWithChildren,
} from "react";

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
	ComponentPropsWithoutRef<E> & {
		as?: E;
	}
>;

type OurButtonProps<T extends ElementType = "h1"> = PolymorphicProps<T> & {
	as?: T;
};

function OurButton<const T extends ElementType = "button">({
	as,
	children,
	...props
}: OurButtonProps<T>) {
	const Button = as || "button";
	return (
		<Button {...props}>
			{children}
		</Button>
	);
}

// Usage
<OurButton as="a" href="oceanbit.dev">
    This looks like a button, but is a link
</OurButton>
```

# Vue

```vue
<!-- OurButton.vue -->
<script setup lang="ts" generic="T extends keyof HTMLElementTagNameMap = 'button'">
const props = defineProps<
	Partial<HTMLElementTagNameMap[NoInfer<T>]> & {
		as?: T;
	}
>();

const Component = props.as || "button";
</script>

<template>
	<component :is="Component" v-bind="props">
		<slot />
	</component>
</template>
```

```html
<!-- Usage -->
<OurButton as="a" href="oceanbit.dev">
    This looks like a button, but is a link
</OurButton>
```

<!-- ::end:tabs -->

> Cool! How do you do that in Angular?

Well, in short, you can't. Not without effectively rewriting React or Vue inside of Angular itself.

> With this feature being so ubiquitous as it is in React and Vue ecosystems, why doesn't Angular support it?

Well... Let's talk about that!

To start, let's make sure we're talking about the same Angular: starting with it's underpinnings.

# Angular, the compiler

Angular, from the very start, has been a template compiled framework. From its heavy investment into [the Ivy compiler](https://blog.angular.dev/a-plan-for-version-8-0-and-ivy-b3318dfc19f7?gi=50ff09ebda89) all the way back in 2018 to the [migration to AOT compiling as the default in 2019](https://angular.dev/tools/cli/aot-compiler#choosing-a-compiler), its compiler is at the heart of Angular today.

So how _does_ Angular's compiler work?

Assume we're compiling the following template:

```html
<p>Hello, {{message}}</p>
```

This outputs to something like the following:

```javascript
ɵɵdefineComponent({
  type: TestCmp,
  selectors: [['test-cmp']],
  decls: 2,
  vars: 1,
  template: function TestCmp_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementStart(0, 'p');
      ɵɵtext(1);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵtextInterpolate1('Hello, ', ctx.message, '');
    }
  },
  encapsulation: 2,
});
```

This `template` function is then called multiple times, depending on the state of the render. If it's the first render, `rf` (short for "render flag") will be set to `1`. If it's an update after the first render, `rf` will be set to `2`.

Combined, these steps will output the expected DOM results.

> You can [explore the Angular compiler yourself here in an interactive site](https://jeanmeche.github.io/angular-compiler-output/).

# Angular, the tree

> Within the static structure of a view, you can have "containers" - places where other views can be inserted and removed. They're represented in the static structure by an anchor node (usually a comment node).
>
> So `@for` for example declares a container into which one or more instances of a repeated view will be inserted
>
> Which gives the mystical `ViewContainerRef` its name - a reference to a container for views 🙂

https://playfulprogramming.com/posts/angular-templates-start-to-source

# Angular, the developer experience

How does something like `*ngComponentOutlet` work in this model, then? And how would that differ from, say, creating `View` instances from some kind of `*ngElementNameOutlet`?

> "Why can't a ViewContainer be created for something like `*ngElementNameOutlet` as well?" 

To which my mind replied: "Because then you'd have to have some kind of runtime-level framework to handle any child updates and such; which is exactly what you ran into

And that's inherently at odds with a compile-time optimized framework which Angular aims to be

Because the _structure_ of my props passed to the children can change, requiring bindings to be refreshed, children to reconcile, et al ala React