---
{
    title: "The Art of Accessibility: Labels",
    description: "Forms and how we label them make up a large part of our apps, let's take a cursory glance at how we can make them more accessible.",
    published: '2025-05-07T22:12:03.284Z',
    tags: ['webdev', 'accessibility'],
    order: 4
}
---

In the last section, we showed some markup that looked like this:
```html
<!-- ... -->

<li role="tab" id="javascript-tab" aria-selected="true" aria-controls="javascript-panel">
JavaScript
</li>

<!-- ... -->

<div role="tabpanel" id="javascript-panel" aria-labelledby="javascript-tab">

<!-- ... -->
```

While we shortly explained in the last section that `aria-controls` is looking for a `role="tabpanel"` with the same `id` as the attribute's value we never fully explained _why_.

The reason we're doing this is to link two seemingly unrelated HTML elements together, so that assistive technologies are able to provide this information to the user.

Let's say that you have an HTML login form like so:

```html
<!-- DO NOT DO THIS, IT IS INACCESSIBLE -->
<form>
    <input name="username" type="text"/>
    <input name="password" type="password"/>
    <button type="submit">Login</button>
</form>
```

By default, this will look like the following:

----


<form>
    <input name="username" type="text"/>
    <input name="password" type="password"/>
    <button type="submit">Login</button>
</form>


----

Notice that our form doesn't indicate which text input is for which field; neither to sighted or blind users. Let's change that and make a visual label for our inputs:

```html
<!-- DO NOT DO THIS, IT IS INACCESSIBLE -->
<form style="display: flex; gap: 1rem;">
	<div style="display: flex; flex-direction: column;">
        <p style="margin: 0;">Username</p>
        <input name="username" type="text"/>
	</div>
	<div style="display: flex; flex-direction: column;">
        <p style="margin: 0;">Password</p>
	    <input name="password" type="password"/>
    </div>
    <div style="display: flex; flex-direction: column; justify-content: flex-end;">
	    <button type="submit">Login</button>
    </div>
</form>	
```

----

<form onsubmit="event.preventDefault()" style="display: flex; gap: 1rem;">
	<div style="display: flex; flex-direction: column;">
        <p style="margin: 0;">Username</p>
        <input name="username" type="text"/>
	</div>
	<div style="display: flex; flex-direction: column;">
        <p style="margin: 0;">Password</p>
	    <input name="password" type="password"/>
    </div>
    <div style="display: flex; flex-direction: column; justify-content: flex-end;">
        <button type="submit">Login</button>
    </div>
</form>	


---

Now the fields visually _look_ like they're labelled, but we've just introduced a critical accessibility issue into our app: Assistive technologies do not indicate which label belongs to which field.

After all, how would a screen reader know that adjacent `input` and `p` tags are supposed to be related? After all, how would the code automatically know how to link the following HTML:

```html
<p>Sign up for our newsletter</p>
<input name="email" />
<p>Email</p>
```

> You might think that the `input`'s `name` attribute provides a hint to accessibility technologies, but alas this is not the case. The `name` attribute is simply there to tell the `form` which input relates to what dataset it should track.

Because of this semantic ambiguity, there are two different ways of linking elements together:

- Implicit element association
- Explicit element association

Let's start with "implicit element association" and go from there.

# Implicit Element Association

Luckily, when dealing with `input`s, there's an easy way to link a text input to a text label: simply wrap your `input` in a `label` element:

```html
<form>
	<label>
        Username
        <input name="username" type="text"/>
	</label>
	<label>
        Password
	    <input name="password" type="password"/>
    </label>
    <button type="submit">Login</button>
</form>	
```

---

<form onsubmit="event.preventDefault()">
	<label>
        Username
        <input name="username" type="text"/>
	</label>
	<label>
        Password
	    <input name="password" type="password"/>
    </label>
    <button type="submit">Login</button>
</form>	

---

This allows screen-readers to associate elements together and read out "Text input, username" when the user has the first text input focused.

## Label Styling Considerations

Don't like the inline styling of the labels? No problem. You can style `<label>` elements like any other. In this case, we'll leverage the previously used flex styling to make the labels appear above the inputs:

```html
<form style="display: flex; gap: 1rem;">
	<label style="display: flex; flex-direction: column;">
        <span>Username</span>
        <input name="username" type="text"/>
	</label>
	<label style="display: flex; flex-direction: column;">
        <span>Password</span>
	    <input name="password" type="password"/>
    </label>
    <div style="display: flex; flex-direction: column; justify-content: flex-end;">
        <button type="submit">Login</button>
    </div>
</form>
```

----

<form style="display: flex; gap: 1rem;" onsubmit="event.preventDefault()">
	<label style="display: flex; flex-direction: column;">
        <span>Username</span>
        <input name="username" type="text"/>
	</label>
	<label style="display: flex; flex-direction: column;">
        <span>Password</span>
	    <input name="password" type="password"/>
    </label>
    <div style="display: flex; flex-direction: column; justify-content: flex-end;">
        <button type="submit">Login</button>
    </div>
</form>	


---

It's worth noting, however, that while `<span>` tags are absolutely welcomed and allowed to be used in a `<label>`, there are some restrictions on the elements you can have as child tags.

Only tags that are considered [phrasing content](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Content_categories#phrasing_content) are allowed; otherwise a screen-reader may not properly handle the text inside.

This mean that while **the following incomplete list of elements are allowed**:
- `<b>`
- `<em>`
- `<i>`
- `<span>`
- `<strong>`

**The rest of HTML elements are not allowed**, like:

- `<p>`
- `<h1>` through `<h6>`s
- `<article>`s, `<nav>`s, and other landmark elements
- Other `<label>`s
- Any other `<input>` elements than the one you want labelled
  - One label per input only!


# Why You Shouldn't Use Placeholders

Whenever the topic of element association comes up, I regularly get asked the following:

> Why don't you just use placeholders in an element?

It's a valid question, given that it's been adopted as a broadly utilized pattern for many forms in recent years. Additionally — at least visually — it seems like placeholders provide a similar level of information as labels might.

---


<form style="display: flex; gap: 1rem;" aria-hidden="true" onsubmit="event.preventDefault()">
    <input placeholder="Username" name="username" type="text"/>
    <input placeholder="password" type="password"/>
    <button type="submit">Login</button>
</form>


----

Despite their popularity, **placeholders have been widely seen as a harmful U.X. pattern for inputs by accessibility experts**. Some of the issues with placeholders these experts cite are:

- **Inadequate color contrast for placeholders**
- **Confusion if a placeholder is pre-filled data or not**
- **Confusion when the user has the input focused due to disappearing hints**
- **Inability for the browser to automatically translate the placeholde**r (using services like Google Translate)

Not only that, but [many screen readers handle the placeholder attribute inconsistently from one-another](https://www.davidmacd.com/blog/is-placeholder-accessible-label.html).

> It's important to remember that blind users are not the only ones that benefit from accessibility. Many of the points above can directly apply to users with cognitive disabilities. In addition, the overall improved U.X. enhances your forms for everyone.

Want to read more? Here are a few resources that explore the problems with placeholders in forms and text inputs:

- [Placeholder Research - Low Vision Accessibility Task Force - W3C](https://www.w3.org/WAI/GL/low-vision-a11y-tf/wiki/Placeholder_Research)

- [The Anatomy of Accessible Forms: The Problem with Placeholders | Deque](https://www.deque.com/blog/accessible-forms-the-problem-with-placeholders/)

- [Don’t Use The Placeholder Attribute — Smashing Magazine](https://www.smashingmagazine.com/2018/06/placeholder-attribute/)

- [Why you should avoid placeholder text  - Tolu Adegbite](https://www.tolu.xyz/blog/why-you-should-avoid-placeholder-text)

- [Placeholders in Form Fields Are Harmful - Nielsen Norman Group](https://www.nngroup.com/articles/form-design-placeholders/)

# Explicit Element Association

> If `<label>` is able to link an `<input>` and label text together, why don't we always do this?

Well, while you're able to place `div`s and other elements inside of a `label` element, let's say that you want to provide the following style, where your labels and inputs are in a table side-by-side:

---

<table>
    <tbody>
        <tr>
            <td><label for="username-input">Username</label></td>
            <td><input id="username-input" type="text"></td>
        </tr>
        <tr>
            <td><label for="password-input">Password</label></td>
            <td><input id="password-input" type="password"></td>
        </tr>
        <tr>
            <td><label for="confirm-password-input">Confirm Password</label></td>
            <td><input id="confirm-password-input" type="password"></td>
        </tr>
    </tbody>
</table>

----

Doing this with the implicit element association _might_ be possible, but would be very challenging to do properly. Instead, let's use a `table` element to layout the labels and elements:

```html
<!-- DO NOT DO THIS, IT IS INACCESSIBLE -->
<table>
    <tbody>
        <tr>
            <td><label>Username</label></td>
            <td><input type="text"/></td>
        </tr>
        <tr>
            <td><label>Password</label></td>
            <td><input type="password"/></td>
        </tr>
        <tr>
            <td><label>Confirm Password</label></td>
            <td><input type="password"/></td>
        </tr>
    </tbody>
</table>
```

While this gives us the visual style we're looking for, we've reintroduced an earlier accessibility issue: The `label` elements are not associated with the `input` elements anymore. To solve this, we can create a unique `id` for each input:

```html
<input id="username-input"/>
```

Then we can use this `id` value inside of a `for` attribute on our `label` element:

```html
<label for="username-input">Username</label>
```

This links the two elements and behave exactly as if the `label` element was wrapping the `input` element.

We can apply this explicit element association to our entire table, which solves our accessibility error: 

```html
<table>
    <tbody>
        <tr>
            <td><label for="username-input">Username</label></td>
            <td><input id="username-input" type="text"/></td>
        </tr>
        <tr>
            <td><label for="password-input">Password</label></td>
            <td><input id="password-input" type="password"/></td>
        </tr>
        <tr>
            <td><label for="confirm-password-input">Confirm Password</label></td>
            <td><input id="confirm-password-input" type="password"/></td>
        </tr>
    </tbody>
</table>
```

## Non-`for` Usage

While a `label`'s `for` field can be important to link a `label` and an `input` together, there's other examples of explicit element association that can be important for application development.

For example, let's say that we have the following form field:

```html
<label for="email">Email address:</label>
<input type="email" name="email" id="email" />
```

But oh no! The user has typed in an invalid email address! How do we inform the user of this?

Well, we can add an error message to indicate that there's a problem:

```html
<!-- This isn't accessible as-is -->
<label for="email">Email address:</label>
<input type="email" name="email" id="email" />
<span class="errormessage">Error: Enter a valid email address</span>
```

But once again, we run into the problem where a user utilizing a screen reader won't know that the error is present when focused on the `input` element.

To solve this, we can:

- Add in a `aria-invalid="true"` attribute to the `input` when the user's input is invalid
- Link the error message `span` using `aria-errormessage` and a unique ID for the error `span`

```html
<p>
  <label for="email">Email address:</label>
  <input
    type="email"
    name="email"
    id="email"
    aria-invalid="true"
    aria-errormessage="err1" />
  <span id="err1" class="errormessage">Error: Enter a valid email address</span>
</p>
```

Now, when we focus on the element during an invalid state, it properly tells our user that they need to input a valid email.

`aria-errormessage` isn't the only attribute that follows this same pattern however; there's a slew of other attributes that do the same as well.

Here's an incomplete list of attributes that use this same pattern of an explicit `id` passed to the attribute to link two otherwise unrelated elements:

- [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for)

- [`aria-controls`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls)
- [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)
- [`aria-details`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-details)
- [`aria-errormessage`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-errormessage)
- [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby)

# Creating an Input Component

Let's take this knowledge of linking elements together and create a `TextInput` component in our frameworks. Let's start by utilizing implicit element association:

<!-- ::start:tabs -->

## React

```jsx
// TextInput.jsx
export const TextInput = ({label, type}) => {
	return <label>
		{label}
		<input type={type} />
	</label>
}
```

```jsx
import {TextInput} from './TextInput';

export const App = () => {
	return <form>
	    <TextInput label="Email"/>
	    <TextInput label="Password" type="password"/>
        <button type="submit">Login</button>
    </form>
}
```

## Angular

```typescript
// TextInput.component.ts
@Component({
    selector: "text-input",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    	<label>
    		{{label()}}
    		<input [type]="type()" />
    	</label>
    `
})
class TextInputComponent {
	label = input.required<string>();
	type = input<string>();
}
```

```typescript
// app.component.ts
@Component({
  selector: 'my-app',
  template: `
    <form>
          <text-input label="Email"></text-input>
          <text-input label="Password" type="password"></text-input>
          <button type="submit">Login</button>
      </form>
  `,
})
export class AppComponent {}
```

## Vue

```vue
<!-- TextInput.vue -->
<script setup>
const props = defineProps(['label', 'type']);
</script>

<template>
	<label>
    	{{props.label}}
        <input :type="props.type"/>
    </label>
</template>
```

```vue
<!-- App.vue -->
<script setup>
import TextInput from "./TextInput.vue";
</script>

<form>
    <TextInput label="Email"/>
    <TextInput label="Password" type="password"/>
    <button type="submit">Login</button>
</form>
```

<!-- ::end:tabs -->

Our form now works!

----


<form onsubmit="event.preventDefault()">
  <label>Email <input /></label>
  <label>Password <input type="password" /></label>
  <button type="submit">Login</button>
</form>


----

It's not the prettiest form in the world, but it's functional!

## Explicit Label Input Component

Let's add in some minor styling and add in the ability to pass an error message.

> Remember, we need to explicitly define an `id` for the component now that we want to link multiple elements together!

<!-- ::start:tabs -->

### React

```css
/* TextInput.module.css */
.label {
	margin-right: 1rem;
}

.errormessage {
	color: red;
}
```



```jsx
// TextInput.jsx
import styles from "./TextInput.module.css";

export const TextInput = ({ label, type, id, error }) => {
  return (
    <>
      <label for={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={!!error}
        aria-errormessage={id + '-error'}
      />
      <p className={styles.errormessage} id={id + '-error'}>
        {error}
      </p>
    </>
  );
};
```

```jsx
import {TextInput} from './TextInput';

export const App = () => {
  return (
    <form>
      <TextInput label="Email" id="email" error="Invalid email" />
      <TextInput label="Password" type="password" id="password" />
      <button type="submit">Login</button>
    </form>
  );
};
```

### Angular

```typescript
// TextInput.component.ts
@Component({
	selector: "text-input",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label [for]="id()" class="label">
			{{ label() }}
		</label>
		<input
			[id]="id()"
			[type]="type()"
			[attr.aria-invalid]="!!error()"
			[attr.aria-errormessage]="id() + '-error'"
		/>
		<p class="errormessage" [id]="id() + '-error'">{{ error() }}</p>
	`,
	styles: [
		`
			.label {
				margin-right: 1rem;
			}
			.errormessage {
				color: red;
			}
		`,
	],
})
export class TextInputComponent {
	label = input.required<string>();
	id = input.required<string>();
	type = input<string>();
	error = input<string>();
}
```

```typescript
// app.component.ts
@Component({
  selector: 'my-app',
  template: `
    <form>
          <text-input label="Email" id="email" error="Invalid email"></text-input>
          <text-input label="Password" type="password" id="password"></text-input>
          <button type="submit">Login</button>
      </form>
  `,
})
export class AppComponent {}
```

### Vue

```vue
<!-- TextInput.vue -->
<script setup>
const props = defineProps(['label', 'type', 'id', 'error'])
</script>

<template>
  <label :for="props.id" class="label">
    {{ props.label }}
  </label>
  <input 
    :id="props.id" 
    :type="props.type" 
    :aria-invalid="!!props.error" 
    :aria-errormessage="props.id + '-error'"
  />
  <p class="errormessage" :id="props.id + '-error'">{{ props.error }}</p>
</template>

<style scoped>
.label {
  margin-right: 1rem;
}

.errormessage {
  color: red;
}
</style>
```

```vue
<!-- App.vue -->
<script setup>
import TextInput from "./TextInput.vue";
</script>

<form>
    <TextInput label="Email" id="email" error="Invalid email" />
    <TextInput label="Password" type="password" id="password" />
    <button type="submit">Login</button>
</form>
```

<!-- ::end:tabs -->

Now we can see our form with a warning about an invalid email. It looks something like this when an invalid email is entered:

----

<form class="__form_error_example_1" onsubmit="event.preventDefault()"><label for="email" class="label">Email</label><input id="email" aria-invalid="true" aria-errormessage="email-error"><p class="errormessage" id="email-error">Invalid email</p><label for="password" class="label">Password</label><input id="password" type="password" aria-invalid="false" aria-errormessage="password-error"><p class="errormessage" id="password-error"></p><button type="submit">Login</button><style>
.__form_error_example_1 .label {
  margin-right: 1rem;
}
.__form_error_example_1 .errormessage {
  color: red;
}</style></form>


---

## Generating Unique IDs Automatically 

Our forms above are pretty functional now, but there's a small developer experience headache associated with our new `TextInput` form: You are _required_ to define an unique `id` manually for each field.

While this isn't a problem for small forms, as your application grows this can be quite a headache remembering all of the used `id`s for new forms.

While it would be nice to remove the requirement to pass a custom `id`, we need to have one present in our input to link the `label`, error `span`, and `input` together. Luckily for us, most of these frameworks have had a fairly reliable way of generating a unique IDs.

Let's look at how we can integrate this into our `TextInput` component:

<!-- ::start:tabs -->

### React

Since React 18, there's been a way to generate unique IDs via the `useId` hook:

```jsx {5}
// TextInput.jsx
import {useId} from "react";

export const TextInput = ({ label, type, id, error }) => {
	const _id = useId();

	const realId = id || _id;

	return (
		<>
			<label for={realId} className={styles.label}>
				{label}
			</label>
			<input
				id={id}
				type={type}
				aria-invalid={!!error}
				aria-errormessage={id + "-error"}
			/>
			<p className={styles.errormessage} id={realId + "-error"}>
				{error}
			</p>
		</>
	);
};
```

```jsx
export const App = () => {
  return (
    <form>
      <TextInput label="Email" id="email" error="Invalid email" />
      <TextInput label="Password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
};
```

<iframe data-frame-title="React Input Component - StackBlitz" src="pfp-code:./art-of-a11y-react-input-comp-3?embed=1&file=src/main.jsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Angular

While Angular doesn't have a built-in way to generate unique IDs, we can still build out this functionality by using **UUIDs**.

> What are UUIDs?

While [I've written in depth about UUIDs before](/posts/what-are-uuids), the gist of "What is a UUID" is "They're a method of generating unique IDs for items using a specific algorithm, designated by a 'version' of UUID used to generate the ID".

For our purposes, we'll be using a [UUIDv4](/posts/what-are-uuids#UUIDv4) to generate truly unique IDs for each DOM element we want to associate.

Since there's not a method for generating UUIDs as part of JavaScript's core APIs, let's install a `uuid` package to do this for us:

```
npm install uuid
```

Now that we have the ability to generate UUIDv4s using:

```javascript
import {v4 as uuidv4} from 'uuid';

uuidv4();
```

-----

Let's integrate this package into our Angular component:

```typescript {29}
@Component({
	selector: "text-input",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label [for]="id()" class="label">
			{{ label() }}
		</label>
		<input
			[id]="id()"
			[type]="type()"
			[attr.aria-invalid]="!!error()"
			[attr.aria-errormessage]="id() + '-error'"
		/>
		<p class="errormessage" [id]="id() + '-error'">{{ error() }}</p>
	`,
	styles: [
		`
			.label {
				margin-right: 1rem;
			}
			.errormessage {
				color: red;
			}
		`,
	],
})
export class TextInputComponent {
	label = input.required<string>();
	id = input(uuidv4());
	type = input<string>();
	error = input<string>();
}
```

```typescript
// app.component.ts
@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TextInputComponent],
	template: `
		<form>
			<text-input label="Email" id="email" error="Invalid email"></text-input>
			<text-input label="Password" type="password"></text-input>
			<button type="submit">Login</button>
		</form>
	`,
})
export class AppComponent {}
```

<iframe data-frame-title="Angular Input Component - StackBlitz" src="pfp-code:./art-of-a11y-angular-input-comp-3?embed=1&file=src/main.ts" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Vue

Since Vue 3.5, we can generate a unique ID using `useId`:

```vue {8-10}
<!-- TextInput.vue -->
<script setup>
import {computed, useId} from 'vue';

const props = defineProps(['label', 'type', 'id', 'error'])

const _id = useId();
    
const realId = computed(() => props.id || _id);
</script>

<template>
  <label :for="props.id" class="label">
    {{ props.label }}
  </label>
  <input 
    :id="props.id" 
    :type="props.type" 
    :aria-invalid="!!props.error" 
    :aria-errormessage="realId + '-error'"
  />
  <p class="errormessage" :id="realId + '-error'">{{ props.error }}</p>
</template>

<style scoped>
.label {
  margin-right: 1rem;
}

.errormessage {
  color: red;
}
</style>
```

```vue
<!-- App.vue -->
<script setup>
import TextInput from "./TextInput.vue";
</script>

<template>
    <form>
        <TextInput label="Email" id="email" error="Invalid email" />
        <TextInput label="Password" type="password" />
        <button type="submit">Login</button>
    </form>
</template>
```

<iframe data-frame-title="Vue Input Component - StackBlitz" src="pfp-code:./art-of-a11y-vue-input-comp-3?embed=1&file=src/App.vue" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- ::end:tabs -->

Here, we can see that we can choose to pass an `id` if we really want to pass one, but it's no longer a required field, as it was before.
