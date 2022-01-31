---
{
    title: "Dynamic HTML",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 3,
    series: "The Framework Field Guide"
}
---

Previously, we learned how to create components for our file application. These components included a way to create a component tree, add inputs to each component to pass data, and add an output of data back to a parent component.

Where we last left off, we manually input a list of files, which included file names and dates inside of an `li`. Let's take a look at our file component to start:

<!-- tabs:start -->

### React

```jsx {2,5,19-27,31-36}
const File = ({ href, fileName, isSelected, onSelected }) => {
  return (
    <li
      onClick={onSelected}
      style={
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      }
    >
      <a href={href}>{fileName}</a>
      <FileDate inputDate={new Date()} />
    </li>
  );
};
```

### Angular

```typescript {11,27-28,35-40,57-65}
@Component({
  selector: 'file',
  template: `
    <li
      (click)="selected.emit()"
      [style]="
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      "
    >
      <a [href]="href">
        {{ fileName }}
        <file-date [inputDate]="inputDate"></file-date>
      </a>
    </li>
  `,
})
export class FileComponent {
  @Input() fileName: string;
  @Input() href: string;
  @Input() isSelected: boolean;
  @Output() selected = new EventEmitter();
}
```

### Vue

```javascript {3,13-14,20-25,40-53}
const File = {
  template: `
    <li
      v-on:click="$emit('selected')"
      :style="
        isSelected ?
          {backgroundColor: 'blue', color: 'white'} :
          {backgroundColor: 'white', color: 'blue'}
      ">
      <a :href="href">
        {{ fileName }}
        <file-date [inputDate]="inputDate"></file-date>
      </a>
    </li>`,
  emits: ['selected'],
  props: ['isSelected', 'fileName', 'href'],
};
```

<!-- tabs:end -->

This is a strong basis for a component, without needing much changing for now. 

One thing we would love to add is the ability to see folders listed alongside files. While we _could_ - and arguably should - add in a component which copy/pastes the code from the `File` component to create a new `Folder` component, let's reuse what we already have!

To do this, we'll create a new property called `isFolder` which hides the date when set to true.

# Conditional Rendering

While one way to do this is to utilize `display: none`, let's go one step further and hide the rendered HTML entirely when not present. Here's a simplified example:

<!-- tabs:start -->

### React

```jsx {2,5,19-27,31-36}
const ConditionalRender = ({ bool }) => {
  return (
    <div>{bool && <p>Text here</p>}</div>
  );
};
```

Here, we're using React's `{}` JavaScript binding in order to add in an [`AND` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND). This works by utilizing Boolean logic of ["short circuiting"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation). This means that if we have:

```javascript
const val = true || {}
```

`val` will be set to `{}`, while if we have:

```javascript
const val = false || {}
```

`val` will be set to `false`. 

React then uses this return value to render the value when the condition inside of the curly braces is **not** `undefined` or `null`.

This means that these examples **will** render their contained values:

```jsx
<div>{0}</div>
<div>{"Hello"}</div>
<div>{true || <Comp/>}</div>
<div>{true}</div>
// Renders as
<div>0</div>
<div>Hello</div>
<div><Comp/></div>
<div>true</div>
```

But the following examples **will not** render their contained values:

```jsx
<div>{undefined}</div>
<div>{false}</div>
// Both render as
<div></div>
```

### Angular

```typescript {11,27-28,35-40,57-65}
@Component({
  selector: 'conditional-render',
  template: `<div><p *ngIf="bool">Text here</p></div>`,
})
export class ConditionalRenderComponent {
  @Input() bool: boolean;
}
```

### Vue

```javascript {3,13-14,20-25,40-53}
const ConditionalRender = {
  template: `<div><p v-if="bool">Text here</p></div>`,
  props: ['bool']
};
```

<!-- tabs:end -->

In this example, when we pass `bool` as `true`, the component's HTML is rendered as:

```html
<div><p>Text here</p></div>
```

But when `bool` is set to `false`, it instead renders the following HTML:

```html
<div></div>
```

This is possible because React, Angular, and Vue control what is rendered to the screen. Utilizing this, they're able to remove or add HTML rendered to the DOM with nothing more than a simple Boolean instruction. 

## Conditional Rendering our Date

Adding this to our file component is just as easy as before:

<!-- tabs:start -->

### React

```jsx {2,5,19-27,31-36}
const File = ({ href, fileName, isSelected, onSelected, isFolder }) => {
  return (
    <li
      onClick={onSelected}
      style={
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      }
    >
      <a href={href}>{fileName}</a>
      {isFolder && <FileDate inputDate={new Date()} />}
    </li>
  );
};
```

### Angular

```typescript {11,27-28,35-40,57-65}
@Component({
  selector: 'file',
  template: `
    <li
      (click)="selected.emit()"
      [style]="
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      "
    >
      <a [href]="href">
        {{ fileName }}
        <file-date *ngIf="isFolder" [inputDate]="inputDate"></file-date>
      </a>
    </li>
  `,
})
export class FileComponent {
  @Input() fileName: string;
  @Input() href: string;
  @Input() isSelected: boolean;
  @Input() isFolder: boolean;
  @Output() selected = new EventEmitter();
}
```

### Vue

```javascript {3,13-14,20-25,40-53}
const File = {
  template: `
    <li
      v-on:click="$emit('selected')"
      :style="
        isSelected ?
          {backgroundColor: 'blue', color: 'white'} :
          {backgroundColor: 'white', color: 'blue'}
      ">
      <a :href="href">
        {{ fileName }}
        <file-date v-if="isFolder" [inputDate]="inputDate"></file-date>
      </a>
    </li>`,
  emits: ['selected'],
  props: ['isSelected', 'isFolder', 'fileName', 'href'],
};
```

<!-- tabs:end -->





-------

Dynamic HTML

- Conditional display
  - If/else
  - switch/case Angular
- For loop
  - Key
- Combining if and for
