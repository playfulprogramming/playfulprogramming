---
{
  title: 'Vue "as" Prop using TypeScript',
  description: "Vue can dynamically change a rendered HTML tag using a special syntax. Let's learn how to use it with TypeScript.",
  published: "2025-02-18",
  tags: ["vue", "typescript", "webdev"],
  license: "cc-by-4",
}
---

Let's assume that we have a component system in our company's codebase. In this component system, there's a `OurButton` component:

```vue
<OurButton (click)="openDialog()">Confirm</OurButton>
```

This component works great, but after some time of the company using it you get a new ticket:

> Is there any way to have the `OurButton` component render an `<a>` tag instead of a `<button>`? 

While you could break out the styling and behavior of `<OurButton>` to a new component - say `<OurLinkButton>` - you remember that [React has a way to change the rendered HTML element to another one using an `as` property](/posts/react-as-prop).

> I wonder if there's a way to do this in Vue as well?

Luckily for us, there is!

# Dynamic Component Casting

JSX allows us to cast an element to a dynamic value doing the following:

```jsx
const Tag = props.as || "button";

<Tag/>
```

> Vue supports JSX as well, but it's not the standard way of writing Vue components. Is there a way to do this in an SFC component?

SFCs also support this functionality, but using a different API:

```vue
<script setup>
const props = defineProps(['as']); 
   
const Component = props.as || "button";
</script>
<template>
	<component :is="Component"></component>
</template>
```

This will render the tag passed to under the `as` property, or default to the `button` element otherwise.

# Passing Props

In JSX, we can pass properties through to a child by using an API like such:

```jsx
const props = {href: "https://playfulprogramming.com"};

<a {...props}/>
```

In SFCs, however, the same effect is achieved using a different syntax:

``` vue
<script setup>
const props = {href: "https://playfulprogramming.com"};
</script>
<template>
	<a v-bind="props"></a>
</template>
```

# TypeScript Support

> This is great, but how do I get TypeScript support for the properties of the tag I want passed in? 
>
> For example, if I pass `as="button"`, I don't want to allow `href` to be passed; but support it when `as="a"` is passed.

Great question!

Let's start by understanding what built-in types TypeScript's `dom` API has built-in. While looking into the supported types, we can find ourselves a list of all [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)'s tag names and their associated properties and methods: 

```typescript
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "applet": HTMLAppletElement;
    "area": HTMLAreaElement;
    "audio": HTMLAudioElement;
    "base": HTMLBaseElement;
    // ...
}
```

We can then use this, in combination with Vue's `generic`'s support to build out this API:

```vue
<!-- OurButton.vue -->
<script setup lang="ts" generic="T extends keyof HTMLElementTagNameMap = 'button'">
const props = defineProps<
	Partial<HTMLElementTagNameMap[T]> & {
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

> Vue's language service today [has a bug that prevents this from working as-expected today](https://github.com/vuejs/language-tools/issues/5159). You can work around this for now by removing the `Partial<HTMLElementTagNameMap[T]>` from the props type.

----

Once this is done, we can use the `OurButton` component like so:

```vue
<!-- Usage -->
<OurButton as="a" href="https://playfulprogramming.com">
    This looks like a button, but is a link
</OurButton>
```

<iframe data-frame-title="Vue 'as' Prop - StackBlitz" src="pfp-code:./as-prop-1?template=node&embed=1&file=src%2FApp.vue"></iframe>
