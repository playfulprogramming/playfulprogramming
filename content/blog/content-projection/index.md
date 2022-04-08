---
{
    title: "Content Projection",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 8,
    series: "The Framework Field Guide"
}
---

In our last chapter, we touched on the idea of having a `nothing` element that renders out of the DOM's view, but stays in a component to help handle logic when doing dynamic HTML.

That was a neat concept that allowed us to expand our horizons of what HTML can look like inside of our components, and how it changes our view of these framework's templates.

Let's continue that trend and introduce a new concept: Content projection.

Let's think of a simple example where you have the following HTML:

```html
<button>
  Hello world!
</button>
```

Say you want the `button` to have "pressed" effect whenever you click on it. Then, when you click on it for a second time, it unclicks. This might look something like the following:

// TODO: Add other framework examples, this is just React

```jsx
const ToggleButtonList = () => {
	const [pressed, setPressed] = useState(false);
	return <>
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}}>
			Hello world!
		</button>
	</>
}
```


While this works for a single button pretty well, what happens when we want to add a second button? Sure, we could simply add a second variable:

// TODO: Add other framework examples, this is just React

```jsx
const ToggleButtonList = () => {
	const [pressed, setPressed] = useState(false);
	const [pressed2, setPressed2] = useState(false);
	return <>
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}}>
			Hello world!
		</button>
		<button onClick={() => setPressed2(!pressed2)} style={{backgroundColor: pressed2 ? 'black' : 'white', color: pressed2 ? 'white' : 'black'}}>
			Hello other friends!
		</button>
	</>
}
```

But this admittedly adds a fair bit of complexity and muddles up the code's readability.

We could instead use [dynamic HTML](/posts/dynamic-html) and create a `for` loop, but what if we wanted to have items in between some of the `button`s? It's not a great fit.

Instead, let's create a `ToggleButton` component to re-use the logic!

// TODO: Add other framework examples, this is just React

```jsx
const ToggleButton = ({text}) => {
	const [pressed, setPressed] = useState(false);
	return (
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}}>
			{text}
		</button>
    )
}

const ToggleButtonList = () => {
    return <>
		<ToggleButton text="Hello world!"/>
		<ToggleButton text="Hello other friends!"/>
	</>
}
```

Here, we're passing `text` as a string property to assign text. But oh no! What if we wanted to add a `span` inside of the `button` to add bolded text? After all, if you pass `Hello, <span>world</span>!`, it wouldn't render the `span`, but instead render the `<span>` as text.

Instead, **let's allow the parent of our `ToggleButton` to pass in a template that's then rendered into the component**.

// TODO: Add other framework examples, this is just React

// TODO: Mention `children` being a special property name in React

```jsx
const ToggleButton = ({children}) => {
	const [pressed, setPressed] = useState(false);
	return (
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}}>
			{text}
		</button>
    )
}

const ToggleButtonList = () => {
    return <>
	    <ToggleButton>Hello <span style={{fontWeight: 'bold'}}>world</span>!</ToggleButton>
	    <ToggleButton>Hello other friends!</ToggleButton>
	</>
}
```

Here, we can see that we're able to pass a `span` and other template items directly as _children_ to our `ToggleButton` component. [This is similar to how you're able to pass HTML elements as `children` to other HTML elements](https://unicorn-utterances.com/posts/understanding-the-dom).

However, because these templates have the full power of the frameworks at their disposal, these _children_ have super-powers! Let's add in a `for` loop into our children template to say hello to all of our friends:

// TODO: Add other framework examples, this is just React

```jsx
const RainbowExclamationMark = () => {
  const rainbowGradient =
    'linear-gradient(180deg, #FE0000 16.66%, #FD8C00 16.66%, 33.32%, #FFE500 33.32%, 49.98%, #119F0B 49.98%, 66.64%, #0644B3 66.64%, 83.3%, #C22EDC 83.3%)';
  return (
    <span
      style={{
        fontSize: '3rem',
        background: rainbowGradient,
        backgroundSize: '100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        MozBackgroundClip: 'text',
      }}
    >
      !
    </span>
  );
};

const ToggleButtonList = () => {
    const friends = ["Kevin,", "Evelyn,", "and James"];
    return <>
	    <ToggleButton>Hello {friends.map(friend => <span>{friend} </span>)}!</ToggleButton>
	    <ToggleButton>Hello other friends<RainbowExclamationMark/></ToggleButton>
	</>
}
```

As you can see, we can use any features inside of our `children` - even other components!

> [Thanks to Sarah Fossheim for the guide on how to add clipped background text like our exclamation mark!](https://fossheim.io/writing/posts/css-text-gradient/)












- Content projection
  - `{props.children}` / React
  - `ng-content` / Angular
  - `<slot>` / Vue
  - Named slots
    - `{props.header}` / React
    - `ng-content select` / Angular
    - `<slot name` / Vue

Create a `FileContainer` component that has a bunch of stying around the contrainer itself.

Then, add in `header` for buttons related to the file list

