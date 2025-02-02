---
{
  title: 'React "as" Prop Using TypeScript',
  description: 'Learn how to type the "as" prop in React to dynamically change the rendered HTML tag.',
  published: "2025-02-02",
  tags: ["react", "typescript"],
  originalLink: "https://www.christianvm.dev/blog/react-as-prop"
}
---

In modern React development, flexibility is key when creating reusable UI components. One common requirement is allowing a component to dynamically render different HTML tags while preserving type safety.

A popular approach to achieve this is by using an "as" prop, which lets developers specify the HTML tag that should be rendered. This pattern is widely utilized in component libraries like Material UI to maintain consistent styling while adapting to different semantic needs.

In this article, we’ll explore how to properly type the "as" prop in TypeScript, ensuring both flexibility and type safety when building polymorphic components in React.


# The "As" Prop

React makes it easy to implement the "as" prop by using a variable to define the component type dynamically, as shown below:

```jsx
function Example() {
  const Component = 'h1'

  return <Component>This will render a h1</Component>
}
```

The only challenge is to implement this property while maintaining type safety, because a &lt;h1&gt; tag does not have the same properties as an &lt;a&gt; tag.

# How to Type the "as" Prop Using TypeScript

Firstly, we need to create a type that receives a generic **E**. This generic extends from **React.ElementType**, ensuring that **E** can only take valid HTML tag names.

```tsx
type PolymorphicProps<E extends React.ElementType> = {
  as?: E
}
```

Next, we use React's utility types to define the props for a specified element. Normally, when working with a static tag like &lt;p&gt;, we would use **React.ComponentPropsWithoutRef<'p'>** to autocomplete its properties. However, since our tag is dynamic, we pass the E type instead.

```tsx
type PolymorphicProps<E extends React.ElementType> = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<E> & {
    as?: E
  }
>
```

Finally, we define the component Props using the **PolymorphicProps** type. Now, the component can receive an optional "as" prop that will default to a &lt;p&gt; tag, and the rest of properties will autocomplete. Custom properties can be added using intersection types, for example **color**.

```tsx
type PolymorphicProps<E extends React.ElementType> = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<E> & {
    as?: E
  }
>

type TypographyProps<T extends React.ElementType> = PolymorphicProps<T> & {
  color?: string
}

export function Typography<T extends React.ElementType = 'p'>({
  as,
  color,
  ...props
}: TypographyProps<T>) {
  const Component = as || 'p'
  console.log(color)

  return <Component {...props} />
}
```

This approach allows us to create a reusable component that has type safety, keeps consistency between styles, and is easy to reuse.

```tsx
function Social() {
  return (
    <section>
      <Typography as='h1' className='mb-4'>
        Connect
      </Typography>

      <Typography
        as='a'
        className='mb-4'
        href='https://www.christianvm.dev/'
        target='_blank'
      >
        Link to my website
      </Typography>
    </section>
  )
}
```

