---
{
    title: "Tab Focusing",
    description: "",
    published: '2026-01-01T22:12:03.284Z',
    tags: ['webdev', 'accessibility'],
    order: 4
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
outline-offset: 4px;
}
</style>
</div>

Awesome! We know have a focus ring that has our page's branding colors applied! Now let's apply this focus ring to a button:

<div>
<div class="green-test-2">
<button>This is a button</button>
</div>
<style>
.green-test-2  {
  padding: 1rem;
  min-height: 150px;
  min-width: 300px;
  max-width: 100%;
  background: #C9FBE2;
}
.green-test-2 a {
  color: #00524F;
}
.green-test-2 *:focus {
  outline: 4px solid #009483;
  outline-offset: 4px;
}
</style>
</div>


Everything looks good, but... Wait... Why is the focus ring visible when the user is clicking on the button with a mouse? That's not how the browser default focus indicator works!

That's correct. To solve this problem. we need not eleminate the custom outline, but instead we can replace our `:focus` psuedo-selector with [a `:focus-visible` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible):

```css
*:focus-visible {
	/* Green 600 */
    outline: 4px solid #009483;
    /* Add a gap between the element and the outline */
    outline-offset: 4px;
}
```

This CSS state selector enables you to customize the behavior when the browser would typically show a focus ring by default.

Let's see if it's fixed the issue with our button annnnd...

<div>
<div class="green-test-3">
<button>This is a button</button>
</div>
<style>
.green-test-3  {
  padding: 1rem;
  min-height: 150px;
  min-width: 300px;
  max-width: 100%;
  background: #C9FBE2;
}
.green-test-3 a {
  color: #00524F;
}
.green-test-3 *:focus-visible {
  outline: 4px solid #009483;
  outline-offset: 4px;
}
</style>
</div>


It has! 🎉 Hooray!

# `tabindex` Handling

Let's loop back to the core theme of this chapter: Keyboard navigation is key for accessibility on your site. 

One easy to conceptualize way to make your site navigable via a keyboard is by making sure all interactive elements are able to be tabbed into. Some elements are marked as "tab-able" by the browser without any extra effort:

- Links (`<a>`)
- Inputs (`<input>`)
- Select Dropdowns (`<select>`)
- Textareas (`<textarea>`)
- Buttons (`<button>`)
- iFrames (`<iframe>`)

While the browser does a good job at marking most relevant elements, some applications have more unique requirements.

For example, let's say you're building a document reader:

<!-- Add mockup like this https://www.a11yproject.com/img/posts/how-to-use-the-tabindex-attribute/scrollable-overflow-container.png -->

Let's build out the CSS for this:

```css
.documentReader {
    box-sizing: inherit;
    max-width: 300px;
    max-height: 150px;
    overflow: scroll;
    border: 4px solid black;
    margin: 1rem auto;
}
```



<div style="box-sizing: inherit;max-width: 300px;max-height: 150px;overflow: scroll;border: 4px solid black;margin: 1rem auto;">
Cupcake ipsum dolor sit amet cake dessert. Liquorice cake candy canes I love sesame snaps marshmallow lollipop I love croissant. Bonbon soufflé gingerbread macaroon tart tootsie roll. Macaroon donut caramels cookie gummi bears. I love liquorice jelly toffee fruitcake. Chupa chups oat cake gummies chocolate cake jelly beans sweet soufflé. Jelly cotton candy sweet danish gingerbread cake candy. Pudding gummies I love I love cake I love fruitcake. Gummies I love marshmallow dessert gummies. Lemon drops I love croissant cotton candy tart. Shortbread tootsie roll dessert gummies I love chupa chups topping. Muffin cookie halvah chocolate cake lollipop sweet roll I love fruitcake. Gingerbread dessert icing marshmallow bear claw. Cake I love wafer dragée powder gummi bears wafer chocolate bar.
Candy jelly donut sesame snaps biscuit liquorice dragée. Macaroon pie gummies chocolate bonbon lollipop sugar plum. I love gummies toffee cotton candy soufflé. Pie danish muffin donut croissant lollipop marzipan shortbread. I love powder cake I love marshmallow dessert lemon drops. Lollipop candy canes pie dragée sugar plum wafer danish sweet lemon drops. Fruitcake pie sesame snaps wafer bear claw lemon drops macaroon dragée. Pastry pie dragée sweet roll cupcake lollipop gummies. Powder danish I love powder I love carrot cake. Sesame snaps sesame snaps I love I love apple pie cake icing dragée cupcake. Fruitcake icing pastry cotton candy macaroon pie sugar plum cotton candy apple pie. Bear claw bear claw I love shortbread cheesecake tiramisu. Chupa chups gummi bears wafer jujubes I love gummi bears dragée.
Apple pie marshmallow gummies I love pie. I love croissant apple pie oat cake jelly-o toffee soufflé ice cream lollipop. Shortbread tiramisu sugar plum dessert toffee I love brownie oat cake ice cream. I love icing I love cake fruitcake I love. Gummi bears cake pudding cheesecake bear claw fruitcake. Ice cream I love cookie candy I love topping. I love chocolate cake jelly-o sweet cake caramels jelly candy canes sweet. Marzipan sesame snaps I love wafer candy caramels marshmallow jelly beans sweet roll. Gummi bears sweet roll oat cake bear claw gummies candy canes. Pie tart gummi bears oat cake candy canes I love caramels. Icing marshmallow icing candy canes cupcake muffin. Candy canes toffee bear claw I love shortbread ice cream I love pastry.
Chocolate I love sugar plum sesame snaps liquorice bonbon lemon drops macaroon. Donut gummi bears oat cake fruitcake cake croissant biscuit oat cake cake. Caramels chupa chups toffee brownie lollipop I love lollipop toffee cake. Halvah jelly-o cookie soufflé bear claw caramels. Candy sugar plum cake dessert jelly-o. Carrot cake cake caramels pie brownie liquorice tart fruitcake. Pudding I love I love candy canes icing I love chocolate shortbread oat cake. Toffee I love candy muffin I love apple pie wafer dragée. Jujubes fruitcake marzipan topping ice cream dessert jelly-o cake. Caramels sesame snaps carrot cake croissant oat cake. Candy chocolate I love chupa chups toffee shortbread. Cheesecake jelly beans oat cake lemon drops caramels dessert brownie pudding jelly-o.
Pudding bear claw liquorice powder tiramisu chocolate bar I love pastry. Oat cake cake gummies dessert gummi bears chupa chups jelly beans donut I love. Liquorice dessert chupa chups powder donut chocolate I love I love. Macaroon oat cake candy canes gummies marzipan. Cupcake I love marshmallow jelly-o pudding I love toffee ice cream croissant. Biscuit pie wafer I love pudding jelly cotton candy biscuit I love. Cupcake cake brownie jelly beans marshmallow powder chocolate bar dragée cake. Caramels marzipan brownie dessert fruitcake. Topping chocolate toffee icing chocolate. Sesame snaps apple pie cotton candy sweet jelly beans. Jelly-o I love gummi bears lollipop I love cake tiramisu sesame snaps soufflé. Cake bear claw marzipan chupa chups tart. Powder ice cream caramels gingerbread soufflé toffee jelly-o. Sweet tart shortbread cookie lemon drops sweet biscuit I love apple pie.
</div>

This CSS allows the user to scroll with a mouse through the contents of the document, but alas there's a problem:

How are keyboard-only users supposed to scroll through the document? If they could focus on it, they could use the up and down arrow keys to navigate through the document, but `div`s are not focusable by default.

The good news is that we have the ability to **make the typically unfocusable `div` focusable _in order to enable keyboard navigation_** of the document. The solution? `tabindex`.


While [the `tabindex` has more nuance to it than this](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex), you can think of `tabindex` as a way of manually adding or removing the ability to tab to an HTML element.

// TODO: Write

A `tabindex` value of `0` allows a user to tab to an element, regardless of element type. Meanwhile, a `tabindex` value of `-1` disables the ability to tab to an otherwise tab-able element.

> A negative `tabindex` value also provides us a way to `focus` an element using JavaScript, but more on that later... 🤫

// TODO: Write





> While it may seem initially intuitive to add `tabindex="0"` to each heading on the site to make navigation to each major section of the site, be careful in doing so.
>
> Most screen readers and accessibility technologies already provide a way to rapidly jump from heading to heading with nothing more than their keyboard. As a result, adding `tabindex="0"` to headings can be a duplicate effort to tab past and make things worse than they were before.
>
> [To learn more about acceptable usage of `tabindex`, check out this article by the A11Y Project](https://www.a11yproject.com/posts/how-to-use-the-tabindex-attribute/#scrollable-overflow-containers).

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
