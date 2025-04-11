---
{
    title: "Semantic Markup",
    description: "When talking about web accessibility, the story starts and ends with semantic markup. Let's learn what that means and how to leverage it in our apps.",
    published: '2025-04-02T22:12:03.284Z',
    tags: ['webdev', 'accessibility'],
    order: 2
}
---

Have you ever look through a codebase and just see a sea of `div`s as far as the eye can see?

```html
<div>
	<div>Add todo item</div>
	<div class="todos">
		<div>Play games</div>
		<div>Eat ice cream</div>
		<div>Do chores</div>
	</div>
</div>
```

While this may show the contents on screen, it's not the most readable code there is. Instead, let's replace these `div`s with elements that describe what they're doing:

```html
<div>
	<button>Add todo item</button>
	<ul class="todos">
		<li>Play games</li>
		<li>Eat ice cream</li>
		<li>Do chores</li>
	</ul>
</div>
```

See, the HTML specification gives us a wide range of HTML elements we can use, each with their own meaning and intent behind them.

> A `ul` is an `unordered list`, while a `li` is a `list item`.

Not only does this help codebase readability, it helps immensely with accessibility and UX. For example, compare and contrast the two versions of HTML without any added CSS or JavaScript.

---

**The `div` soup:**

<div>
	<div>Add todo item</div>
	<div class="todos">
		<div>Play games</div>
		<div>Eat ice cream</div>
		<div>Do chores</div>
	</div>
</div>

----

**The correct HTML tags:**

<div>
	<button>Add todo item</button>
	<ul class="todos">
		<li>Play games</li>
		<li>Eat ice cream</li>
		<li>Do chores</li>
	</ul>
</div>

-----

Notice how, by default, the correct HTML tags show bullet points next to the list? Or how the button actually is clickable?

This is because the browser knows what a `button` is, and will apply default styling and behavior to the element, that you can then overwrite if need be. Without this information, it doesn't know how to handle a `div` in any special kind of way.

Similarly, a screen-reader doesn't know that our first `<div class="todos">` was a list, and as such wouldn't indicate to the user that it has a list of items, or how many items are in the list. By using an `ul`, it will do all of that for us, without any additional code on our end.

These HTML elements are not just supported in `.html` files; **React, Angular, and Vue support all valid HTML elements.**

> **Note:**
> There are a **lot** of HTML elements supported by the latest HTML specification. To find the right element for the job, it may be worthwhile to explore the [HTML elements list from MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) until you're familiar with the list.

# Page Structure

While individual elements like `button` or `ul` provide context on a micro-level, there's also a broader understanding of a page's layout you can convey to the user via proper semantic markup.

Take a homepage like ours:

![The Playful Programming homepage with a header, top section and recent articles section](./before_landmark_outlines.png)

When the user is able to see the page, they might typically break it down into different visual components like so:

![The same homepage as before but with each distinct landmark highlighted: Header, Main, and two Sections](./landmark_outlines.png)

Similarly, we can convey the same structure of our page more programmatically using semantic markup.

Instead of:

```html
<!-- Inaccessible, do not use -->
<div class="header"></div>
<div class="main-contents">
    <div class="top-section"></div>
    <div class="recent-articles-section"></div>
</div>
```

Our markup should instead be:

```html
<header></header>
<main>
    <section class="top"></section>
    <section class="recent-articles"></section>
</main>
```

These structure-based elements, often called "landmark elements", help non-sighted users navigate the page better and even provides a good SEO boost to your site.

## Landmark elements and their meaning

- `<header>`: The header of a site, consistent between different pages.
- `<nav>`: The navigation elements of a site.
- `<main>`: The main contents of a site.
- `<section>`: A grouping of related items, most often with an associated heading.
- `<article>`: A group of related items with all the relevant context contained within.
- `<aside>`: A tangential item to the main contents on a page.
- `<footer>`: The footer of a site, consistent between different pages.

# ARIA

Sometimes we have custom UI requirements. Like, _really_ custom UI requirements. We may want a dropdown that also has the ability to filter results as the user types.

![A user input of "C" added to a dropdown of states filtered down to "California", "Colorado", and "Connecticut"](./dropdown_combobox.png)

While some of this component has clear analogs in HTML elements:

- The search input should be an `input` component
- The dropdown list should be an `ul` with `li` to indicate that it's a list

Other parts of this UI are unclear how to communicate to the user at first glance.

How do we indicate to the user that the suggestion dropdown is active? How can we associate the text input element with the suggestion list element for screen readers?

This type of ultra-custom UI is where ARIA comes into play.

ARIA is an acronym for "Accessible Rich Internet Applications", and is a collection of HTML attributes that help provide additional UI information to the end user.

 For example, the dropdown arrow might have an attribute of `aria-expanded="true"` or `aria-expanded="false"` to indicate to screen readers that the dropdown is expanded or not.

The following HTML:

```html
<button aria-expanded="true">States</button>
```

Might be read by a screen reader as "States button, expanded", which tells our user that they have more information they can access pertaining to the button.

Likewise, the `aria-controls` attribute tells the assistive technology which element the button expands. This attribute takes an HTML `id`'s name and enables the user to quickly jump to the controlled element using a user-defined key combo.

```html
<button aria-expanded="true" aria-controls="states-list">States</button>
<ul id="states-list">
   <li>Alabama</li>
   <li>Alaska</li>
   <li>Arizona</li>
   <!-- ... -->
</ul>
```

> This is an wildly incomplete example of an "Editable Combobox with Autocomplete" UI component. A more complete example of such a component [can be found on the W3C's website](https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-autocomplete-list), though even they admit their example is for demonstration purposes only.
>
> This component in particular has significantly more nuance than you might assume, and as such is an extremely tricky component to implement properly. If you're looking to add one to your production site, make sure you do sufficient user testing before shipping to your generalized end-users.

While a complete list of these ARIA attributes are out of the scope of this book, [you can find a reference to them on MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes). Each comes with their own use-cases and nuance.

## ARIA Roles

While ARIA attributes can be a massive boon to accessibility, there's an attribute that we should proceed with immense caution when using; `role`.

The `role` attribute allows us to signal the an element maps to a select list of UI components. For example, if we had a list of tabs, our markup _might_ look something like:

```html
<div>
    <ul role="tablist">
        <li role="tab" id="javascript-tab" aria-selected="true" aria-controls="javascript-panel">
            JavaScript
        </li>
        <li role="tab" id="python-tab" aria-selected="false" aria-controls="python-panel">
            Python
        </li>
    </ul>
    <div role="tabpanel" id="javascript-panel" aria-labelledby="javascript-tab">
        <code>console.log("Hello, world!");</code>
    </div>
    <div role="tabpanel" id="python-panel" aria-labelledby="python-tab">
        <code>print("Hello, world!")</code>
    </div>
</div>
```

Here, the `role` enables us to tell the user that there is a list of tabs, `aria-controls` and `aria-labelledby` tells the user which contents belong to which tab, and `aria-selected` informs the user which tab is currently selected.

> Keep in mind, we have to change these `aria` attributes on-the-fly as the information changes; say, with the `aria-selected` indicating which tab is active.
>
> HTML does not provide a way to automatically change the `aria` attributes for us without JavaScript.
>
> We'll build an interactive version of this `tab` component using React, Angular, and Vue later in this chapter that handles these things.

While `role` is imperative in its usage here, it _can_ lead to subpar or even actively hostile user experiences for assistive technologies.

This is because, using `role`, you have the ability to tell HTML that one element should be reflected to the end-user as an entirely different element, without actually providing any of the expected functionality.

To explain this more, let's look at how an HTML `button` works.

When you create an HTML element like `button`, the browser implicitly assigns it a `role` internally, regardless of if you assigned one or not.

In this case:

```html
<button>Click me!</button>
```

Is implicitly treated by the browser as having `role="button"` assigned to it.

> If that's the case, then surely `<div type="button">` must act the same as a `<button>`, right?

Not quite.

While you could create a partially analogous `button` element using a `div`:

```html
<!-- Inaccessible, do not use -->
<div tabindex="0" role="button">Save</div>
```

 You might notice a problem with it when displayed on a web page:

---

<div tabindex="0" role="button">Save</div>

---

Notice that the fake "button" here doesn't appear to "press" down? There's no styling to indicate when the user is hovered over the "button", nor is there any visual indication when the user is hovered over the "button" with their mouse.

This is why it's often **highly discouraged to use `role` in place of an HTML element with an implicit `role` enabled**; they simply don't have feature parity without a substantial amount of work and expertise.

# Building a tab component with ARIA

Now that we've seen a few examples of accessible, but non-interactive, markup let's see what we can do to breath life into these UI components using a framework.

Namely, I want to demonstrate how we can build our own accessible tab component using aria attributes:

![Two tabs of "JavaScript" and "Python" with JavaScript selected and a console.log inside](./styled_tabs.png)

Let's start by reusing our markup from the previous section, and adding in some JavaScript to make the tabs interactive.

<!-- ::start:tabs -->

## React

```jsx
const App = () => {
  const [activeTab, setActiveTab] = useState('javascript');

  return (
    <div>
      <ul role="tablist">
        <li
          role="tab"
          id="javascript-tab"
          aria-selected={activeTab === 'javascript'}
          aria-controls="javascript-panel"
          onClick={() => setActiveTab('javascript')}
        >
          JavaScript
        </li>
        <li
          role="tab"
          id="python-tab"
          aria-selected={activeTab === 'python'}
          aria-controls="python-panel"
          onClick={() => setActiveTab('python')}
        >
          Python
        </li>
      </ul>
      <div
        role="tabpanel"
        id="javascript-panel"
        aria-labelledby="javascript-tab"
        hidden={activeTab !== 'javascript'}
      >
        <code>console.log("Hello, world!");</code>
      </div>
      <div
        role="tabpanel"
        id="python-panel"
        aria-labelledby="python-tab"
        hidden={activeTab !== 'python'}
      >
        <code>print("Hello, world!")</code>
      </div>
    </div>
  );
};
```

## Angular

```angular-ts
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div>
    <ul role="tablist">
      <li
        role="tab"
        id="javascript-tab"
        [attr.aria-selected]="activeTab() === 'javascript'"
        aria-controls="javascript-panel"
        (click)="setActiveTab('javascript')"
      >
        JavaScript
      </li>
      <li
        role="tab"
        id="python-tab"
        [attr.aria-selected]="activeTab() === 'python'"
        aria-controls="python-panel"
        (click)="setActiveTab('python')"
      >
        Python
      </li>
    </ul>
    <div
      role="tabpanel"
      id="javascript-panel"
      aria-labelledby="javascript-tab"
      [hidden]="activeTab() !== 'javascript'"
    >
      <code>console.log("Hello, world!");</code>
    </div>
    <div
      role="tabpanel"
      id="python-panel"
      aria-labelledby="python-tab"
      [hidden]="activeTab() !== 'python'"
    >
      <code>print("Hello, world!")</code>
    </div>
  </div>
  `,
})
export class AppComponent {
  activeTab = signal('javascript');

  setActiveTab(val: string) {
    this.activeTab.set(val);
  }
}
```

## Vue

```vue
<script setup>
  import { ref } from 'vue'

  const activeTab = ref('javascript')

  function setActiveTab(val) {
    activeTab.value = val
  }
</script>

<template>
  <div>
    <ul role="tablist">
      <li
        role="tab"
        id="javascript-tab"
        :aria-selected="activeTab === 'javascript'"
        aria-controls="javascript-panel"
        @click="setActiveTab('javascript')"
      >
        JavaScript
      </li>
      <li
        role="tab"
        id="python-tab"
        :aria-selected="activeTab === 'python'"
        aria-controls="python-panel"
        @click="setActiveTab('python')"
      >
        Python
      </li>
    </ul>
    <div role="tabpanel" id="javascript-panel" aria-labelledby="javascript-tab" :hidden="activeTab !== 'javascript'">
      <code>console.log("Hello, world!");</code>
    </div>
    <div role="tabpanel" id="python-panel" aria-labelledby="python-tab" :hidden="activeTab !== 'python'">
      <code>print("Hello, world!")</code>
    </div>
  </div>
</template>
```

<!-- ::end:tabs -->



> 🎉 Tad-whoa. 😵‍💫

![Two bullet points of the languages with a console.log below](./unstyled_tabs.png)

> Are we sure this worked?

Well, it's not the prettiest UI visually, but we can verify it's functionality by clicking on the `JavaScript` or `Python` text in order to show the `console.log` or `print` statements respectively.

Now all we need to do is add a bit of CSS...

<details>
<summary>The required CSS for the tab component</summary>

```css
/* index.css */
[role="tablist"] {
  margin: 0;
  padding: 0; 
  display: flex;
  gap: 0.25rem;
}

[role="tab"] {
  display: inline-block;
  padding: 1rem;
  border: solid black;
  border-width: 2px 2px 0 2px;
  border-radius: 1rem 1rem 0 0;
}

[role="tab"]:hover {
  background: #d3d3d3;
}

[role="tab"]:active {
  background: #878787;
}

[role="tab"][aria-selected="true"] {
  background: black;
  color: white;
}

[role="tabpanel"] {
  border: solid black;
  border-width: 2px;
  padding: 1rem;
  border-radius: 0 1rem 1rem 1rem;
}
```

</details>

And tada! 🎉 (For real this time.)

![The correct tab styling as outlined before](./styled_tabs.png)

<!-- ::start:tabs -->

## React

<iframe data-frame-title="React Tab Component - StackBlitz" src="pfp-code:./art-of-a11y-react-tab-comp-1?embed=1&file=src/main.jsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Angular

<iframe data-frame-title="Angular Tab Component - StackBlitz" src="pfp-code:./art-of-a11y-angular-tab-comp-1?embed=1&file=src/app/main.ts" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Vue

<iframe data-frame-title="Vue Tab Component - StackBlitz" src="pfp-code:./art-of-a11y-vue-tab-comp-1?embed=1&file=src/App.vue" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- ::end:tabs -->

Now _these_ are some tabs we can work with.

