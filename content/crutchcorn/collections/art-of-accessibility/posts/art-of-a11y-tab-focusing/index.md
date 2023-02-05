---
{
    title: "Tab Focusing",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 4,
    series: "The Accessibility Almanac"
}
---

We've discussed before how imperative it is to enable your users to be able to navigate your site using their keyboard alone. To do this, we need to make sure that they can properly <kbd>Tab</kbd> throughout the elements on your screen.

But how does the user know what element is focused? How does the browser know which element to focus next? How can we build a nicer user experience using insights to the previous two questions? 

Let's answer each of these questions, starting with...

# Outline Styles

Let's try an experiment.

Given the following image, what is currently focused?

![A table of contents of the series of The Accessibility Almanac with the Part 3 focused with the browser's default focus ring](./focused_chapters.png)

Okay, now which one is focused in this image:

![A table of contents of the series of The Accessibility Almanac with no clearly focused element visible](./non_focused_chapters.png)

You might assume "None", but you'd be wrong. In this image, the "Part 6" is focused, but the element has had the following CSS applied:

```css
/* This CSS demonstrates how to remove an outline on keyboard focus. Do not do this in production */
outline: none;
```

This is a common "trick" used by many engineers in order to avoid having the blue glow around elements when focused. But here's the thing; if you don't have that glow, how will you know if your element is focused or not?

This is why the accessibility community has been fairly prescriptive with usage of `outline`: "Never use `outline: none` unless you know what you're doing."

## Creating custom outline states

Just because the rule of thumb is to not use `outline: none` without good cause doesn't mean we can't ever customize our focus outline. While the browser's default focus outline is typically a blue outline, what if our page has primarily green colors as part of its brand and we wanted our focus states to match?

Let's change that using CSS to customize the ["All elements" selector (`*`)](https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors) and [the `:focus` state selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus):

```css
body {
	/* Green 100 */
    background: #C9FBE2;
	/* Green 900 */
    color: #00524F;
}

a {
    /* Green 900 */
    color: #00524F;
}

*:focus {
	/* Green 600 */
    outline: 4px solid #009483;
    /* Add a gap between the element and the outline */
    outline-offset: 4px;
}
```

We can check this against a link element to verify that we have a focus indicator when the user has the element tabbed to.

<div>

<div class="green-test-1">
<a href="#">This is a link</a>
</div>
<style>
.green-test-1  {
  padding: 1rem;
  min-height: 150px;
  min-width: 300px;
  max-width: 100%;
  background: #C9FBE2;
}
.green-test-1 a {
  color: #00524F;
}
.green-test-1 *:focus {
  outline: 4px solid #009483;
}
</style>
</div>







Awesome! We know have a focus ring that has our page's branding colors applied! Now let's apply this focus ring to a button:

<button>Testing</button>

Everything looks good, but... Wait... Why is the focus ring visible when the user is clicking on the button with a mouse? That's not how the browser default focus indicator works!







# `tabindex` Handling



While [the `tabindex` has more nuance to it than this](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex), you can think of `tabindex` as a way of manually adding or removing the ability to tab to an HTML element.

// TODO: Write

A `tabindex` value of `0` allows a user to tab to an element, regardless of element type. Meanwhile, a `tabindex` value of `-1` disables the ability to tab to an otherwise tab-able element. 

> A negative `tabindex` value also provides us a way to `focus` an element using JavaScript, but more on that later... 🤫

// TODO: Write



# Element Reference `focus()`

// TODO: Use `ref` to `focus` an element

# Adding in Keyboard Interactions to Our Tab Component

Let's [think back to the tab component we built in the "Semantic Markup" chapter](/posts/semantic-markup). 

![// TODO: Write alt](../semantic-markup/styled_tabs.png)

<!-- tabs:start -->

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

```typescript
@Component({
  selector: 'my-app',
  template: `
  <div>
    <ul role="tablist">
      <li
        role="tab"
        id="javascript-tab"
        [attr.aria-selected]="activeTab === 'javascript'"
        aria-controls="javascript-panel"
        (click)="setActiveTab('javascript')"
      >
        JavaScript
      </li>
      <li
        role="tab"
        id="python-tab"
        [attr.aria-selected]="activeTab === 'python'"
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
      [hidden]="activeTab !== 'javascript'"
    >
      <code>console.log("Hello, world!");</code>
    </div>
    <div
      role="tabpanel"
      id="python-panel"
      aria-labelledby="python-tab"
      [hidden]="activeTab !== 'python'"
    >
      <code>print("Hello, world!")</code>
    </div>
  </div>
  `,
})
export class AppComponent {
  activeTab = 'javascript';

  setActiveTab(val: string) {
    this.activeTab = val;
  }
}
```

## Vue

```vue
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

<script setup>
import { ref } from 'vue'

const activeTab = ref('javascript')

function setActiveTab(val) {
  activeTab.value = val
}
</script>
```

<!-- tabs:end -->

While this component's _markup_ might be fairly accessible, as a whole it's missing a few things.

Namely, we should make sure that our tabs are accessible using only the keyboard. As things stand right now, we cannot tab to the other tabs and enable them using only our keyboard.

We can fix this by adding in a `tabindex` attribute with a value of `0`, as we learned earlier.

Let's use this knowledge of `tabindex` to add the ability to keyboard cycle through each tab header:

```html
<div>
    <ul role="tablist">
        <li tabindex="1">JavaScript</li>
        <li tabindex="1">Python</li>
    </ul>
    <!-- ... -->
</div>
```

Yay! We can now navigate through each of the tab headers using the <kbd>Tab</kbd> key! Let's deploy this change to the Framework Field Guide website!

Oh no, when we deployed this version of tabs, users came back to complain about its behavior! 😱

It turns out that when you have as many tabs as we do on the website, having to tab through _every single tab header_ can be a bit of a headache. Instead, our users have requested the ability to tab to the first tab header, then use arrow keys to navigate left and right through the remaining tabs. That way, instead of having to tab through `n` tabs, they can simply tab through a single tab list, and use arrow key navigation to access the other tabs - much better!

Let's do that!

To make this change, we'll utilize our understanding of `tabindex`. Remember, a `tabindex` of `0` means that you can actively tab to the element, while a `tabindex` of `-1` enables you to focus an element using JavaScript, but not using a keyboard alone. This means that we can change our markup to the following:

```html
<div>
    <ul role="tablist">
        <li tabindex="0">JavaScript</li>
        <li tabindex="-1">Python</li>
    </ul>
    <!-- ... -->
</div>
```

After we change our markup, we can use some JavaScript to:

- Listen for the `keydown` event
  - On `keydown`, `focus()` the next tab
  - Change the `tabindex` to reflect the newly focused tab

To do this, we'll use a number to track which element is currently focused, rather than a string. This will allow us to easily increment and decrement our `currentTab` using our `keydown` listener:

```javascript
let currentTab = 0;

function setNextTab() {
	currentTab = currentTab + 1;
}

function setPreviousTab() {
	currentTab = currentTab - 1;
}
```

Lastly, let's clamp the users navigation input. This means both that:

- If the user is on the last tab and tries to navigate to the "next" tab, they won't go anywhere
- If the user is on the first tab and tries to navigate to the "previous" tab, they won't go anywhere

Alright! Let's get to coding:

<!-- tabs:start -->

## React

```jsx {0-24,30,36,41,47}
// JavaScript
const minTabIndex = 0;

// Python
const maxTabIndex = 1;

export const App = () => {
  const [activeTab, setActiveTab] = useState(0);

  function onKeyDown(i) {
    return (e) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = Math.max(minTabIndex, i - 1);
        setActiveTab(newIndex);
        document.getElementById(`tab-${newIndex}`).focus();
        return;
      }
      if (e.key === 'ArrowRight') {
        const newIndex = Math.min(maxTabIndex, i + 1);
        setActiveTab(newIndex);
        document.getElementById(`tab-${newIndex}`).focus();
        return;
      }
    };
  }

  return (
    <div>
      <ul role="tablist">
        <li
          tabindex={activeTab === 0 ? '0' : '-1'}
          role="tab"
          id="tab-0"
          aria-selected={activeTab === 0}
          aria-controls="javascript-panel"
          onClick={() => setActiveTab(0)}
          onKeyDown={onKeyDown(0)}
        >
          JavaScript
        </li>
        <li
          tabindex={activeTab === 1 ? '0' : '-1'}
          role="tab"
          id="tab-1"
          aria-selected={activeTab === 1}
          aria-controls="python-panel"
          onClick={() => setActiveTab(1)}
          onKeyDown={onKeyDown(1)}
        >
          Python
        </li>
      </ul>
      <div
        role="tabpanel"
        id="javascript-panel"
        aria-labelledby="tab-0"
        hidden={activeTab !== 0}
      >
        <code>console.log("Hello, world!");</code>
      </div>
      <div
        role="tabpanel"
        id="python-panel"
        aria-labelledby="tab-1"
        hidden={activeTab !== 1}
      >
        <code>print("Hello, world!")</code>
      </div>
    </div>
  );
};
```

## Angular

```typescript {0-4,12,18,23,29,60-73}
// JavaScript
const minTabIndex = 0;

// Python
const maxTabIndex = 1;

@Component({
  selector: 'my-app',
  template: `
  <div>
    <ul role="tablist">
      <li
        [tabIndex]="activeTab === 0 ? '0' : '-1'"
        role="tab"
        id="javascript-tab"
        [attr.aria-selected]="activeTab === 0"
        aria-controls="javascript-panel"
        (click)="setActiveTab(0)"
        (keydown)="onKeyDown(0, $event)"
      >
        JavaScript
      </li>
      <li
        [tabIndex]="activeTab === 1 ? '0' : '-1'"
        role="tab"
        id="python-tab"
        [attr.aria-selected]="activeTab === 1"
        aria-controls="python-panel"
        (click)="setActiveTab(1)"
        (keydown)="onKeyDown(1, $event)"
      >
        Python
      </li>
    </ul>
    <div
      role="tabpanel"
      id="javascript-panel"
      aria-labelledby="javascript-tab"
      [hidden]="activeTab !== 0"
    >
      <code>console.log("Hello, world!");</code>
    </div>
    <div
      role="tabpanel"
      id="python-panel"
      aria-labelledby="python-tab"
      [hidden]="activeTab !== 1"
    >
      <code>print("Hello, world!")</code>
    </div>
  </div>
  `,
})
export class AppComponent {
  activeTab = 0;

  setActiveTab(val: number) {
    this.activeTab = val;
  }

  onKeyDown(i, e) {
    if (e.key === 'ArrowLeft') {
      const newIndex = Math.max(minTabIndex, i - 1);
      this.setActiveTab(newIndex);
      document.getElementById(`tab-${newIndex}`).focus();
      return;
    }
    if (e.key === 'ArrowRight') {
      const newIndex = Math.min(maxTabIndex, i + 1);
      this.setActiveTab(newIndex);
      document.getElementById(`tab-${newIndex}`).focus();
      return;
    }
  }
}
```

## Vue

```vue {4,10,15,21,50-65}
<template>
  <div>
    <ul role="tablist">
      <li
        :tabIndex="activeTab === 0 ? '0' : '-1'"
        role="tab"
        id="tab-0"
        :aria-selected="activeTab === 0"
        aria-controls="javascript-panel"
        @click="setActiveTab(0)"
        @keydown="onKeyDown(0)"
      >
        JavaScript
      </li>
      <li
        :tabIndex="activeTab === 1 ? '0' : '-1'"
        role="tab"
        id="tab-1"
        :aria-selected="activeTab === 1"
        aria-controls="python-panel"
        @click="setActiveTab(1)"
        @keydown="onKeyDown(1)"
      >
        Python
      </li>
    </ul>
    <div role="tabpanel" id="javascript-panel" aria-labelledby="tab-0" :hidden="activeTab !== 0">
      <code>console.log("Hello, world!");</code>
    </div>
    <div role="tabpanel" id="python-panel" aria-labelledby="tab-1" :hidden="activeTab !== 1">
      <code>print("Hello, world!")</code>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// JavaScript
const minTabIndex = 0

// Python
const maxTabIndex = 1

const activeTab = ref(0)

function setActiveTab(val) {
  activeTab.value = val
}

function onKeyDown(i) {
  return (e) => {
    if (e.key === 'ArrowLeft') {
      const newIndex = Math.max(minTabIndex, i - 1)
      setActiveTab(newIndex)
      document.getElementById(`tab-${newIndex}`).focus()
      return
    }
    if (e.key === 'ArrowRight') {
      const newIndex = Math.min(maxTabIndex, i + 1)
      setActiveTab(newIndex)
      document.getElementById(`tab-${newIndex}`).focus()
      return
    }
  }
}
</script>
```

<!-- tabs:end -->
