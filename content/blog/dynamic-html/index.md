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

```jsx
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

```typescript
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

```javascript
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

```jsx {2}
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

```typescript {2}
@Component({
  selector: 'conditional-render',
  template: `<div><p *ngIf="bool">Text here</p></div>`,
})
export class ConditionalRenderComponent {
  @Input() bool: boolean;
}
```

### Vue

```javascript {1}
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

Knowing this, let's add in conditional rendering into our application.

## Conditional Rendering our Date

Right now we have a list of files to present to the user. However, if we look back to our mockups, we'll notice that we wanted to list folders alongside files.

Luckily for us, our `File` component already manages a lot that we would want a `Folder` component to as well. For example, when the user clicks on a folder, we want to select the folder like we would any other file in a list.

However, something that's currently preventing us from using `File` for our folders as well is that folders do not have a creation date associated with it. Otherwise, it becomes unclear to the user if the listed date refers to the first file created or the date the folder itself was created.

One way we could solve for this problem and still reuse the `File` component to list out folders is to conditionally render the date if we know we're showing a folder instead of a file.

To do this, let's add an input called `isFolder` and prevent the date from rendering if set to `true`.

Adding this to our component is just as easy as we outlined before:

<!-- tabs:start -->

### React

```jsx {11}
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

```typescript {13}
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

```javascript {11}
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

# Conditional Branches

One other way we can use conditional rendering inside of our `File` component is to inform the user if a listed item is a folder or file using a bit of text.

<!-- tabs:start -->

## React

```jsx
{isFolder && <span>Type: Folder</span>}
{!isFolder && <span>Type: File</span>}
```

## Angular

```html
<span *ngIf="isFolder">Type: Folder</span>
<span *ngIf="!isFolder">Type: File</span>
```

## Vue

```html
<span v-if="isFolder">Type: Folder</span>
<span v-if="!isFolder">Type: File</span>
```

<!-- tabs:end -->

While this works, those familiar with `if` statements in JavaScript will be quick to point out that this is simply reconstructing an [`if ... else` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else).

Just like the JavaScript environment these frameworks run in, they too implement a similar API for this exact purpose.



<!-- tabs:start -->

## React

```jsx
{
  isFolder ?
    <span>Type: Folder</span> :
    <span>Type: File</span>
}
```

## Angular

```html
<span *ngIf="isFolder; else fileDisplay">Type: Folder</span>
<ng-template #fileDisplay><span>Type: File</span></ng-template>
```

Undoubtably you're looking at this snippet of code and wondering what `ng-template` is doing here. 

The [long answer is complicated and may involve more experience with Angular than you currently have](https://unicorn-utterances.com/posts/angular-templates-start-to-source) — We encourage a read after this course.

Luckily, the short answer is as simple as: "An `ng-template` is a bit of HTML that you can assign to a in-template variable in order for Angular to use in conditional statements and a few other places"

With this known, we can explain that the syntax looks something like this:

```html
<ng-template #varNameHere><p>HTML tags go in here as children</p></ng-template>
```

Which we can then use in an `*ngIf` statement like so:

```html
*ngIf="bool; else varNameHere"
```

## Vue

```html
<span v-if="isFolder">Type: Folder</span>
<span v-else>Type: File</span>
```

A `v-else` tag **must** immediately follow a `v-if`, otherwise it won't work. 

<!-- tabs:end -->

## Expanded Branches

While an `if ... else` works wonders if you only have a single Boolean value you need to check, oftentimes you'll find yourself needing more than a single conditional branch to check against.

For example, what if we added an `isImage` Boolean to differentiate between images and other file types?

While we could move back to a simple `if` statement for each condition:

<!-- tabs:start -->

## React

```jsx
{isFolder && <span>Type: Folder</span>}
{!isFolder && isImage && <span>Type: Image</span>}
{!isFolder && !isImage && <span>Type: File</span>}
```

## Angular

```html
<span *ngIf="isFolder">Type: Folder</span>
<span *ngIf="!isFolder && isImage">Type: Image</span>
<span *ngIf="!isFolder && !isImage">Type: File</span>
```

## Vue

```html
<span v-if="isFolder">Type: Folder</span>
<span v-if="!isFolder && isImage">Type: Image</span>
<span v-if="!isFolder && !isImage">Type: File</span>
```

<!-- tabs:end -->

This can get hard to read with multiple conditionals in a row. As a result, these frameworks have tools that you can use to make things a bit more readable.

<!-- tabs:start -->

## React

```jsx
{
  isFolder ?
    <span>Type: Folder</span> :
    isImage ?
      <span>Type: Image</span> :
      <span>Type: File</span>
}
```

## Angular

```html
<ng-container [ngSwitch]="true">
  <span *ngSwitchCase="isFolder">Type: Folder</span>
  <span *ngSwitchCase="isImage">Type: Image</span>
  <span *ngSwitchDefault>Type: File</span>
</ng-container>
```

Angular does not support `else if` statements in the template like the other frameworks do.

Instead, Angular has a mechanism for utilizing [`switch/case` statements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch). These switch/case statements work by matching a value from a `case` to the `switch` value. So, if you had:

```html
<ng-container [ngSwitch]="'folder'">
  <span *ngSwitchCase="'folder'">Type: Folder</span>
  <span *ngSwitchCase="'image'">Type: Image</span>
  <span *ngSwitchDefault>Type: File</span>
</ng-container>
```

It would render:

```html
<span>Type: Folder</span>
```

Because the `[ngSwitch]` value of `'folder'` matched the `ngSwitchCase` value of `'folder'`.

Using this tool, we can simply set the `ngSwitch` value to `true` and add in a conditional into the `ngSwitchCase`.

## Vue

```html
<span v-if="isFolder">Type: Folder</span>
<span v-else-if="isImage">Type: Image</span>
<span v-else>Type: File</span>
```

Once again, the `v-else-if` and `v-else` tags must follow one another to work as intended.

<!-- tabs:end -->



-------

Dynamic HTML

- For loop
  - Key
- Combining if and for
