---
{
    title: "Passing Children",
    description: "Just like HTML nodes have parents and children, so too do framework components. Let's learn how React, Angular, and Vue allow you to pass children to your components.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 7,
    collection: "The Framework Field Guide - Fundamentals"
}
---

[As mentioned previously](// TODO), in the DOM your HTML elements have a relationship to one another. 

For example, the following:

```html
<div>
    <ul>
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
    </ul>
</div>
```

Would construct the following DOM tree:

![// TODO: DO](./bredth_first.png)

This is how the DOM constructs nodes as parents and children. Notice how the `<li>` is distinctly below the `<ul>` tag rather than a syntax like:

```html
<!-- This isn't correct HTML to do what we want -->
<div
	ul="
        li='One'
        li='Two'
        li='Three'
    "
/>
```

 While the above looks strange and counter-intuitive, let's look at how we define the same list if each element is a dedicated component using the methods we've created thus far:

<!-- tabs:start -->

# React

```jsx
const ListItem = ({name}) => {
    return <li>{name}</li>
}

const List = () => {
    return <ul>
    	<ListItem name="One"/>
    	<ListItem name="Two"/>
    	<ListItem name="Three"/>
    </ul>
}

const Container = () => {
	return <div>
		<List/>
	</div>
}
```

# Angular

// TODO: Write

# Vue

// TODO: Write

<!-- tabs:end -->

This is fairly similar to that strange fake nested HTML syntax. The alternative component usage syntax that matches closer to the DOM might otherwise look like this:

```jsx
<Component>
	<OtherComponent/>
</Component>
```

This mismatch occurs because, if we look at how our components are defined, we're building out our previous components **deeply** rather than **broadly**.


![// TODO: DO](./depth_first.png)

This is the difference in building apps with HTML alone and building them with a frontend framework - while the DOM is typically thought of as one-dimensional, there are really 2 dimensions that are exposed more thoroughly by the frameworks ability to construct this tree in a more fine-grained manner.

Let's move the component tree back to being breadth first by using a feature that may sound familiar: Passing children.

# Passing Basic Children

Before we explore passing children with our frameworks, let's first think of a potential use case for when we want to do this.

For example, say you want the `button` to have "pressed" effect whenever you click on it. Then, when you click on it for a second time, it unclicks. This might look something like the following:

<!-- tabs:start -->

### React

```jsx
const ToggleButton = ({text}) => {
	const [pressed, setPressed] = useState(false);
	return (
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}} type="button" aria-pressed={pressed}>
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

### Angular

```typescript
@Component({
  selector: 'toggle-button',
  standalone: true,
  template: `
    <button (click)="togglePressed()" [style]="pressed ? 'background-color: black; color: white;' : 'background-color: white;color: black'" type="button" [attr.aria-pressed]="pressed">
      {{text}}
    </button>
    `,
})
export class ToggleButtonComponent {
  @Input() text: string;
  pressed = false;
  togglePressed() {
    this.pressed = !this.pressed;
  }
}

@Component({
  selector: 'toggle-button-list',
  standalone: true,
  imports: [ToggleButtonComponent],
  template: `
    <toggle-button text="Hello world!"></toggle-button>
    <toggle-button text="Hello other friends!"></toggle-button>
  `,
})
export class ToggleButtonListComponent {}
```

### Vue

```vue
<!-- ToggleButton.vue -->
<template>
  <button
    @click="togglePressed()"
    :style="pressed ? 'background-color: black; color: white' : 'background-color: white; color: black'"
    type="button"
    :aria-pressed="pressed"
  >
    {{ props.text || 'Test' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const pressed = ref(false)

const props = defineProps(['text'])

function togglePressed() {
  pressed.value = !pressed.value
}
</script>
```

```vue
<!-- ToggleButtonList.vue -->
<template>
  <ToggleButton text="Hello world!"></ToggleButton>
  <ToggleButton text="Hello other friends!"></ToggleButton>
</template>

<script setup>
import ToggleButton from './ToggleButton.vue';
</script>
```

<!-- tabs:end -->

Here, we're passing `text` as a string property to assign text. But oh no! What if we wanted to add a `span` inside of the `button` to add bolded text? After all, if you pass `Hello, <span>world</span>!`, it wouldn't render the `span`, but instead render the `<span>` as text.

![// TODO: Write](./hello_span_button.png)

Instead, **let's allow the parent of our `ToggleButton` to pass in a template that's then rendered into the component**.

<!-- tabs:start -->

### React

In React, JSX that's passed as a child to a component can be accessed through a special `children` component property name:

```jsx
// "children" is a preserved property name by React. It reflects passed child nodes
const ToggleButton = ({children}) => {
	const [pressed, setPressed] = useState(false);
	return (
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}} type="button" aria-pressed={pressed}>
            {/* We then utilize this special property name as any */}
            {/* other JSX variable to display its contents */}
			{children}
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

### Angular

Angular has a special tag called `ng-content` that acts as a pass-through for all children content passed to a component.

```typescript
@Component({
  selector: 'toggle-button',
  standalone: true,
  template: `
    <button (click)="togglePressed()" [style]="pressed ? 'background-color: black; color: white;' : 'background-color: white;color: black'" type="button" [attr.aria-pressed]="pressed">
    <ng-content/>
    </button>
    `,
})
export class ToggleButtonComponent {
  pressed = false;
  togglePressed() {
    this.pressed = !this.pressed;
  }
}

@Component({
  selector: 'toggle-button-list',
  standalone: true,
  imports: [ToggleButtonComponent],
  template: `
    <toggle-button>Hello <span style="font-weight: bold;">world</span>!</toggle-button>
    <toggle-button>Hello other friends!</toggle-button>
  `,
})
export class ToggleButtonListComponent {}
```

Because `ng-content` is built-in to [Angular's compiler](// TODO: Link to Angular internals section), we do not need to import anything into a module to use the feature.

### Vue

When in Vue-land, the `slot` tag is utilized in order to pass children through to a component's template. 

```vue
<!-- ToggleButton.vue -->
<template>
  <button @click="togglePressed()"
          :style="pressed ? 'background-color: black; color: white' : 'background-color: white; color: black'"
		  type="button"
          :aria-pressed="pressed">
    <slot></slot>
  </button>
</template>

<script setup>
import {ref} from 'vue';

const pressed = ref(false);

function togglePressed() {
  pressed.value = !pressed.value;
}
</script>
```

```vue
<!-- ToggleButtonList.vue -->
<template>
  <ToggleButton>Hello <span style="font-weight: bold">world</span>!</ToggleButton>
  <ToggleButton>Hello other friends!</ToggleButton>
</template>

<script setup>
import ToggleButton from './ToggleButton.vue';
</script>
```

Because `slot` is a built-in component to Vue, we do not need to import it from the `vue` package.

<!-- tabs:end -->

Here, we can see that we're able to pass a `span` and other elements directly as _children_ to our `ToggleButton` component.

## Using other Framework Features with Component Children

However, because these templates have the full power of the frameworks at their disposal, these _children_ have super-powers! Let's add in a `for` loop into our children template to say hello to all of our friends:

<!-- tabs:start -->

### React

```jsx
function ToggleButtonList() {
    const friends = ["Kevin,", "Evelyn,", "and James"];
    return <>
	    <ToggleButton>Hello {friends.map(friend => <span>{friend} </span>)}!</ToggleButton>
	    <ToggleButton>Hello other friends<RainbowExclamationMark/></ToggleButton>
	</>
}

function RainbowExclamationMark() {
  const rainbowGradient = `
    linear-gradient(
      180deg,
      #fe0000 16.66%,
      #fd8c00 16.66%,
      33.32%,
      #ffe500 33.32%,
      49.98%,
      #119f0b 49.98%,
      66.64%,
      #0644b3 66.64%,
      83.3%,
      #c22edc 83.3%
    )
  `;

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
```

### Angular

```typescript
@Component({
  selector: 'toggle-button-list',
  template: `
    <toggle-button>Hello <span *ngFor="let friend of friends">{{friend}} </span>!</toggle-button>
    <toggle-button>Hello other friends<rainbow-exclamation-mark/></toggle-button>
  `,
})
export class ToggleButtonListComponent {
  friends = ['Kevin,', 'Evelyn,', 'and James'];
}

@Component({
  selector: 'rainbow-exclamation-mark',
  standalone: true,
  template: `
  <span>!</span>
    `,
  // These styles will only apply to this component
  styles: [
    `
  span {
    font-size: 3rem;
    background: linear-gradient(
      180deg,
      #fe0000 16.66%,
      #fd8c00 16.66%,
      33.32%,
      #ffe500 33.32%,
      49.98%,
      #119f0b 49.98%,
      66.64%,
      #0644b3 66.64%,
      83.3%,
      #c22edc 83.3%
    );
    background-size: 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
  }
  `,
  ],
})
export class RainbowExclamationMarkComponent {}
```

### Vue


```vue
<!-- ToggleButtonList.vue -->
<template>
  <ToggleButton>Hello <span v-for="friend of friends">{{ friend }} </span>!</ToggleButton>
  <ToggleButton>Hello other friends
    <RainbowExclamationMark></RainbowExclamationMark>
  </ToggleButton>
</template>

<script setup>
import ToggleButton from './ToggleButton.vue';
import RainbowExclamationMark from './RainbowExclamationMark.vue';

const friends = ['Kevin,', 'Evelyn,', 'and James']
</script>
```


```vue
<!-- RainbowExclamationMark.vue -->
<template>
  <span>!</span>
</template>

<!-- "scoped" means the styles only apply to this component -->
<style scoped>
span {
  font-size: 3rem;
  background: linear-gradient(
    180deg,
    #fe0000 16.66%,
    #fd8c00 16.66%,
    33.32%,
    #ffe500 33.32%,
    49.98%,
    #119f0b 49.98%,
    66.64%,
    #0644b3 66.64%,
    83.3%,
    #c22edc 83.3%
  );
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
}
</style>
```

<!-- tabs:end -->

As you can see, we can use any features inside of our `children` - even other components!

> [Thanks to Sarah Fossheim for the guide on how to add clipped background text like our exclamation mark!](https://fossheim.io/writing/posts/css-text-gradient/)

# Named Children

While passing one set of elements is useful in its own right, many components require there two be more than one "slot" of data you can pass.

For example, take this dropdown component:


<details>
<summary>Let's build this dropdown component</summary>
These tend to be useful for FAQ pages, hidden contents, and more!
</details>

This dropdown component has two potential places where passing elements would be very useful:

```html
<Dropdown>
	<DropdownHeader>Let's build this dropdown component</DropdownHeader>
	<DropdownBody>These tend to be useful for FAQ pages, hidden contents, and more!</DropdownBody>
</Dropdown>
```

Let's build this component with a similar API to the above using "named children".

<!-- tabs:start -->

## React

Something worth reminding is that JSX constructs a value, just like a number or string, that you can then store to a variable.

```jsx
const table = <p>Test</p>;
```

This can be passed to a function, like `console.log`, or anything any other JavaScript value can do.

```jsx
console.log(<p>Test</p>); // ReactElement
```

Because of this behavior, in order to pass more than one JSX value to a component, we can use function parameters and pass them that way.

```jsx
const Dropdown = ({ children, header, expanded, toggle }) => {
  return (
    <>
      <button
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls="dropdown-contents"
      >
        {expanded ? '🡇' : '🡆'} {header}
      </button>
      <div id="dropdown-contents" role="region" hidden={!expanded}>
        {children}
      </div>
    </>
  );
};

export default function App() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Dropdown
      expanded={expanded}
      toggle={() => setExpanded(!expanded)}
      header={<>Let's build this dropdown component</>}
    >
      These tend to be useful for FAQ pages, hidden contents, and more!
    </Dropdown>
  );
}
```

## Angular

`ng-content` allows you to pass a `select` property to have specific children projected in dedicated locations. This `select` property takes [CSS selector query values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors). Knowing this, we can pass the attribute query for `header` by wrapping the attribute name in square brackets like so:

```typescript
@Component({
  selector: 'dropdown-comp',
  standalone: true,
  template: `
  <button (click)="toggle.emit()" :aria-expanded="expanded" aria-controls="dropdown-contents">
    {{ expanded ? '🡇' : '🡆' }} <ng-content select="[header]"/>
  </button>
  <div id="dropdown-contents" role="region" [hidden]="!expanded">
  <ng-content/>
  </div>
    `,
})
export class DropdownComponent {
  @Input() expanded: boolean;
  @Output() toggle = new EventEmitter();
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DropdownComponent],
  template: `
  <dropdown-comp [expanded]="expanded" (toggle)="expanded = !expanded">
    <ng-container header>Let's build this dropdown component</ng-container>
    These tend to be useful for FAQ pages, hidden contents, and more!
  </dropdown-comp>
    `,
})
class AppComponent {
  expanded = false;
}
```

Once `ng-content` finds related elements that match the `select` query, they will be content projected into the appropriate locations. If not matched by a `ng-content[select]`, they will be projected to a non `select` enabled `ng-content`.

## Vue

Similar to how Angular's `ng-content[select]` query works, Vue allows you to pass a `name` to the `slot` component in order to project named content.

```vue
<!-- Dropdown.vue -->
<template>
  <button @click="emit('toggle')" :aria-expanded="expanded" aria-controls="dropdown-contents">
    {{ props.expanded ? '🡇' : '🡆' }} <slot name="header" />
  </button>
  <div id="dropdown-contents" role="region" :hidden="!props.expanded">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps(['expanded'])

const emit = defineEmits(['toggle'])
</script>
```

```vue
<!-- App.vue -->
<template>
  <Dropdown :expanded="expanded" @toggle="expanded = !expanded">
    <template v-slot:header>Let's build this dropdown component</template>
    These tend to be useful for FAQ pages, hidden contents, and more!
  </Dropdown>
</template>

<script setup>
import { ref } from 'vue'
import Dropdown from './Dropdown.vue'

const expanded = ref(false)
</script>
```

Here, we can see that `slot` is querying for a `header` template slot. This query is then satisfied by `App`'s template for the heading `template` element.

`v-slot` also has a shorthand of `#`, similar to how `v-bind` has a shorthand of `:`. Using this shorthand, we can modify our `App` component to look like:

```vue
<!-- App.vue -->
<template>
  <Dropdown :expanded="expanded" @toggle="expanded = !expanded">
    <template #header>Let's build this dropdown component</template>
    These tend to be useful for FAQ pages, hidden contents, and more!
  </Dropdown>
</template>

<script setup>
import { ref } from 'vue'
import Dropdown from './Dropdown.vue'

const expanded = ref(false)
</script>
```

<!-- tabs:end -->



# Using Passed Children to Build a Table

Now that we're familiar with how to pass a child to a component, let's apply it to one of our components we've been building for our file hosting application - our files "list".

![A table of files with headings for "Name", "Last modified", "Type", and "Size"](./file_list.png)

While this _does_ constitute as a list of files, there's actually two dimensions of data: Down and right. This makes this "list" really more of a "table". As such, it's actually a bit of a misconception to use the Unordered List (`<ul>`) and List Item (`<li>`) elements for this specific UI element.

Instead, let's build out an HTML `table` element. A normal HTML table might look something like this:

```html
<table>
	<thead>
		<tr>
			<th>Name</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Movies</td>
		</tr>
	</tbody>
</table>
```

Where `th` acts as a heading data item and `td` acts as a bit of data on a given row and column.

Let's refactor our file list to use this DOM layout:

<!-- tabs:start -->

## React

```jsx
const File = ({ href, fileName, isSelected, onSelected, isFolder }) => {
  return (
    <tr
      onClick={onSelected}
      aria-selected={isSelected}
      style={
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      }
    >
      <td><a href={href}>{fileName}</a></td>
      {isFolder && <td><FileDate inputDate={new Date()} /></td>}
    </tr>
  );
};

const filesArray = [
    {
      fileName: 'File one',
      href: '/file/file_one',
      isFolder: false,
    },
    {
      fileName: 'File two',
      href: '/file/file_two',
      isFolder: false,
    },
    {
      fileName: 'File three',
      href: '/file/file_three',
      isFolder: false,
    },
  ];

// This was previously called "FileList"
const FileTableBody = () => {
  return (<tbody>
  {
    filesArray.map(file => {
      return <>
        {
            !file.isFolder &&
            <File
              fileName={file.fileName}
         	  href={file.href}
         	  isSelected={false}
         	  isFolder={file.isFolder}
              onSelected={() => {}}
            />
        }
      </>
    })
  }
</tbody>)
}

// This is a new component
const FileTable = () => {
  return (
  	<table><FileTableBody/></table>
  )
}
```

> Please note that we've temporarily disabled `isSelected` logic for the sake of code sample brevity

## Angular

```typescript
@Component({
  selector: 'file-item',
  standalone: true,
  imports: [NgIf, FileDateComponent],
  template: `
  <tr
  (click)="selected.emit()"  [attr.aria-selected]="isSelected"
  [style]="
    isSelected
      ? { backgroundColor: 'blue', color: 'white' }
      : { backgroundColor: 'white', color: 'blue' }
  "
>
  <td><a [href]="href">{{fileName}}</a></td>
  <td *ngIf="isFolder"><file-date inputDate={new Date()}/></td>
</tr>
  `,
})
class FileComponent {
  @Input() fileName: string;
  @Input() href: string;
  @Input() isSelected: boolean;
  @Input() isFolder: boolean;
  @Output() selected = new EventEmitter();
}

// This was previously called "FileList"
@Component({
  selector: 'file-table-body',
  standalone: true,
  imports: [NgFor, NgIf, FileComponent],
  template: `
    <tbody>
      <ng-container *ngFor="let file of filesArray">
        <file
         *ngIf="!file.isFolder"
         [fileName]="file.fileName"
         [href]="file.href"
         [isSelected]="false"
         [isFolder]="file.isFolder"
         />
      </ng-container>
    </tbody>
  `,
})
class FileTableBodyComponent {
  filesArray = [
    {
      fileName: 'File one',
      href: '/file/file_one',
      isFolder: false,
    },
    {
      fileName: 'File two',
      href: '/file/file_two',
      isFolder: false,
    },
    {
      fileName: 'File three',
      href: '/file/file_three',
      isFolder: false,
    },
  ];
}

// This is a new component
@Component({
  selector: 'file-table',
  standalone: true,
  imports: [FileTableBodyComponent],
  template: `
    <table><file-table-body/></table>
  `,
})
class FileTableComponent {}
```

> Please note that we've temporarily disabled `isSelected` logic for the sake of code sample brevity

## Vue

```vue
<!-- File.vue -->
<template>
  <tr
      @click="emit('selected')"
      :aria-selected="props.isSelected"
      :style="
      props.isSelected
        ? { backgroundColor: 'blue', color: 'white' }
        : { backgroundColor: 'white', color: 'blue' }
    "
  >
    <td><a :href="props.href">{{props.fileName}}</a></td>
    <td v-if="props.isFolder"><FileDate :inputDate="new Date()"></FileDate></td>
  </tr>
</template>

<script setup>
import FileDate from './FileDate.vue';

const props = defineProps(['fileName', 'href', 'isSelected', 'isFolder']);
const emit = defineEmits(['selected']);
</script>
```

```vue
<!-- FileTableBody -->
<!-- This was previously called "FileList" -->
<template>
  <tbody>
    <template v-for="file in filesArray">
      <File
          v-if="!file.isFolder"
          :fileName="file.fileName"
          :href="file.href"
          :isFolder="file.isFolder"
          :isSelected="false"
      />
    </template>
  </tbody>
</template>

<script setup>
import File from './File.vue';

const filesArray = [
  {
    fileName: 'File one',
    href: '/file/file_one',
    isFolder: false,
  },
  {
    fileName: 'File two',
    href: '/file/file_two',
    isFolder: false,
  },
  {
    fileName: 'File three',
    href: '/file/file_three',
    isFolder: false,
  },
]
</script>
```

```vue
<!-- FileTable -->
<template>
  <table><FileTableBody/></table>
</template>

<script setup>
import FileTableBody from './FileTableBody.vue';
</script>
```

> Please note that we've temporarily disabled `isSelected` logic for the sake of code sample brevity

<!-- tabs:end -->

<!-- Author's note: It's not clear what the best A11Y pattern is here. The best guide for this seems to be an incomplete WCAG guide -->
<!-- https://w3c.github.io/aria-practices/examples/grid/advancedDataGrid.html -->
<!-- That said, it seems like the best overall pattern here is that the row selection should have `aria-selected` (not `aria-pressed`) with the information present -->

--------------

Now that we have an explicit `FileTable` component, let's see if we're able to style it a bit more with a replacement `FileTableContainer` component, which utilizes passing children to style the underlying `table` element.

<!-- tabs:start -->

## React

````jsx
const FileTableContainer = ({children}) => {
  return <table style={{color: '#3366FF', border: '2px solid #F5F8FF'}}>
		{children}
	</table>
}

const FileTable = () => {
  return (
  	<FileTableContainer><FileList/></FileTableContainer>
  )
}
````

## Angular

```typescript
@Component({
  selector: 'file-table-container',
  standalone: true,
  template: `
  <table [style]="{color: '#3366FF', border: '2px solid #F5F8FF'}">
    <ng-content></ng-content>
  </table>
  `,
})
class FileTableContainerComponent {}

@Component({
  selector: 'file-table',
  standalone: true,
  imports: [FileTableContainerComponent],
  template: `
    <file-table-container><file-table-body/></file-table-container>
  `,
})
class FileTableComponent {}
```

## Vue

```vue
<!-- FileTableContainer -->
<template>
  <table :style="{color: '#3366FF', border: '2px solid #F5F8FF'}">
    <slot></slot>
  </table>
</template>
```

```vue
<!-- FileTable -->
<template>
  <FileTableContainer><FileTableBody/></FileTableContainer>
</template>

<script setup>
import FileTableContainer from './FileTableContainer.vue';
import FileTableBody from './FileTableBody.vue';
</script>
```

<!-- tabs:end -->

# Challenge

Let's make this chapters' challenge a continuation on the table that we just built in the last section. See, our previous table only had the files themselves, not the header. Let's change that by adding in a second set of children we can pass, like so:

```jsx
<table>
   <FileHeader/>
   <FileList/>
</table>
```

<!-- tabs:start -->

## React

```jsx
const FileTableContainer = ({children, header}) => {
  return <table style={{color: '#3366FF', border: '2px solid #F5F8FF'}}>
        <thead>{header}</thead>
		{children}
	</table>
}

const FileTable = () => {
  const headerEl = <tr>
            <th>Name</th>
        	<th>Date</th>
        </tr>
    
    return (
  	<FileTableContainer header={headerEl}>
      <FileTableBody/>
    </FileTableContainer>
  )
}
```

## Angular

````typescript
@Component({
  selector: 'file-table-container',
  standalone: true,
  template: `
  <table [style]="{color: '#3366FF', border: '2px solid #F5F8FF'}">
    <thead><ng-content select="[header]"></ng-content></thead>
    <ng-content></ng-content>
  </table>
  `,
})
class FileTableContainerComponent {}

@Component({
  selector: 'file-table',
  standalone: true,
  imports: [FileTableContainerComponent, FileTableBodyComponent],
  template: `
    <file-table-container>
        <tr header>
          <th>Name</th>
          <th>Date</th>
        </tr>
        <file-table-body/>
    </file-table-container>
  `,
})
class FileTableComponent {}
````

## Vue

```vue
<!-- FileTableContainer -->
<template>
  <table :style="{color: '#3366FF', border: '2px solid #F5F8FF'}">
    <thead><slot name="header"></slot></thead>
    <slot></slot>
  </table>
</template>
```

````vue
<!-- FileTable -->
<template>
  <FileTableContainer>
    <template #header>
      <tr>
        <th>Name</th>
        <th>Date</th>
      </tr>
    </template>
    <FileTableBody/>
  </FileTableContainer>
</template>

<script setup>
import FileTableContainer from './FileTableContainer.vue';
import FileTableBody from './FileTableBody.vue';
</script>
````

<!-- tabs:end -->

