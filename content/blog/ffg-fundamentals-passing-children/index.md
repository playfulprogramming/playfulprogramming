---
{
    title: "Passing Children",
    description: "Just like HTML nodes have parents and children, so too do framework components. Let's learn how React, Angular, and Vue allow you to pass children to your components.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 7,
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

<!-- tabs:start -->

# React

```jsx
const ToggleButtonList = () => {
	const [pressed, setPressed] = useState(false);
	return <>
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}} type="button" aria-pressed={pressed}>
			Hello world!
		</button>
	</>
}
```

# Angular

```typescript
@Component({
  selector: 'toggle-button-list',
  template: `
    <button (click)="togglePressed()" [ngStyle]="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button" [attr.aria-pressed]="pressed">
      Hello world!
    </button>
    `,
})
export class ToggleButtonListComponent {
  pressed = false;
  togglePressed() {
    this.pressed = !this.pressed;
  }
}
```



# Vue

```vue
<!-- ToggleButtonList.vue -->
<template>
  <button @click="togglePressed()"
          :style="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}"
          type="button"
          :aria-pressed="pressed">
    Hello world!
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

<!-- tabs:end -->

> TODO: Shortly mention `aria-pressed` and link to accessibility chapter and "Introduction to A11Y"

While this works for a single button pretty well, what happens when we want to add a second button? Sure, we could simply add a second variable:

<!-- tabs:start -->

# React

```jsx
const ToggleButtonList = () => {
	const [pressed, setPressed] = useState(false);
	const [pressed2, setPressed2] = useState(false);
	return <>
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}} type="button" aria-pressed={pressed}>
			Hello world!
		</button>
		<button onClick={() => setPressed2(!pressed2)} style={{backgroundColor: pressed2 ? 'black' : 'white', color: pressed2 ? 'white' : 'black'}} type="button" aria-pressed={pressed}>
			Hello other friends!
		</button>
	</>
}
```

# Angular

```typescript
@Component({
  selector: 'toggle-button-list',
  template: `
    <button (click)="togglePressed()" [ngStyle]="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button" [attr.aria-pressed]="pressed">
      Hello world!
    </button>
    <button (click)="togglePressed2()" [ngStyle]="{backgroundColor: pressed2 ? 'black' : 'white', color: pressed2 ? 'white' : 'black'}" type="button" [attr.aria-pressed]="pressed2">
    Hello world!
  </button>
    `,
})
export class ToggleButtonListComponent {
  pressed = false;
  togglePressed() {
    this.pressed = !this.pressed;
  }
  pressed2 = false;
  togglePressed2() {
    this.pressed2 = !this.pressed2;
  }
}
```



# Vue

```vue
<!-- ToggleButtonList.vue -->
<template>
  <button @click="togglePressed()"
          :style="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button"
          :aria-pressed="pressed">
    Hello world!
  </button>
  <button @click="togglePressed2()"
          :style="{backgroundColor: pressed2 ? 'black' : 'white', color: pressed2 ? 'white' : 'black'}" type="button"
          :aria-pressed="pressed2">
    Hello world!
  </button>
</template>

<script setup>
import {ref} from 'vue';

const pressed = ref(false);
const pressed2 = ref(false);

function togglePressed() {
  pressed.value = !pressed.value;
}

function togglePressed2() {
  pressed2.value = !pressed2.value;
}
</script>
```

<!-- tabs:end -->

But this admittedly adds a fair bit of complexity and muddles up the code's readability.

We could instead use [dynamic HTML](/posts/ffg-fundamentals-dynamic-html) and create a `for` loop, but what if we wanted to have items in between some of the `button`s? It's not a great fit.

Instead, let's create a `ToggleButton` component to re-use the logic!

<!-- tabs:start -->

# React

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

# Angular

```typescript
@Component({
  selector: 'toggle-button',
  template: `
    <button (click)="togglePressed()" [ngStyle]="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button" [attr.aria-pressed]="pressed">
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
  template: `
    <toggle-button text="Hello world!"></toggle-button>
    <toggle-button text="Hello other friends!"></toggle-button>
  `,
})
export class ToggleButtonListComponent {}
```

# Vue

```vue
<!-- ToggleButton.vue -->
<template>
  <button @click="togglePressed()"
          :style="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button"
          :aria-pressed="pressed">
    {{ props.text }}
  </button>
</template>

<script setup>
import {ref} from 'vue';

const pressed = ref(false);

const props = defineProps(['text'])

function togglePressed() {
  pressed.value = !pressed.value;
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

Instead, **let's allow the parent of our `ToggleButton` to pass in a template that's then rendered into the component**.

<!-- tabs:start -->

# React

In React, passed content is treated like any other property that's passed into a component. However, by default when you pass content as children, the property name assigned to that `ReactNode` value is `children`.

```jsx
// "children" is a preserved property name by React. It reflects passed child nodes
const ToggleButton = ({children}) => {
	const [pressed, setPressed] = useState(false);
	return (
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}} type="button" aria-pressed={pressed}>
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

# Angular

Angular has a special tag called `ng-content` that acts as a pass-through for all children content passed to a component.

```typescript
@Component({
  selector: 'toggle-button',
  template: `
    <button (click)="togglePressed()" [ngStyle]="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button" [attr.aria-pressed]="pressed">
    <ng-content></ng-content>
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
  template: `
    <toggle-button>Hello <span [ngStyle]="{fontWeight: 'bold'}">world</span>!</toggle-button>
    <toggle-button>Hello other friends!</toggle-button>
  `,
})
export class ToggleButtonListComponent {}
```

Because `ng-content` is built-in to [Angular's compiler](// TODO: Link to Angular internals section), we do not need to import anything into a module to use the feature.

# Vue

When in Vue-land, the `slot` tag is utilized in order to pass children through to a component's template. 

```vue
<!-- ToggleButton.vue -->
<template>
  <button @click="togglePressed()"
          :style="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button"
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

Here, we can see that we're able to pass a `span` and other template items directly as _children_ to our `ToggleButton` component. [This is similar to how you're able to pass HTML elements as `children` to other HTML elements](https://unicorn-utterances.com/posts/understanding-the-dom).

However, because these templates have the full power of the frameworks at their disposal, these _children_ have super-powers! Let's add in a `for` loop into our children template to say hello to all of our friends:

<!-- tabs:start -->

# React

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

# Angular

```typescript
@Component({
  selector: 'rainbow-exclamation-mark',
  template: `
  <span
  [ngStyle]="{
    fontSize: '3rem',
    background: rainbowGradient,
    backgroundSize: '100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    MozBackgroundClip: 'text'
  }"
>
  !
</span>
    `,
})
export class RainbowExclamationMarkComponent {
  rainbowGradient =
    'linear-gradient(180deg, #FE0000 16.66%, #FD8C00 16.66%, 33.32%, #FFE500 33.32%, 49.98%, #119F0B 49.98%, 66.64%, #0644B3 66.64%, 83.3%, #C22EDC 83.3%)';
}

@Component({
  selector: 'toggle-button-list',
  template: `
    <toggle-button>Hello <span *ngFor="let friend of friends">{{friend}} </span>!</toggle-button>
    <toggle-button>Hello other friends<rainbow-exclamation-mark></rainbow-exclamation-mark></toggle-button>
  `,
})
export class ToggleButtonListComponent {
  friends = ['Kevin,', 'Evelyn,', 'and James'];
}
```

# Vue

```vue
<!-- RainbowExclamationMark.vue -->
<template>
    <span
        :style="{
          fontSize: '3rem',
          background: rainbowGradient,
          backgroundSize: '100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          MozBackgroundClip: 'text'
        }"
    >
    !
  </span>
</template>

<script setup>
const rainbowGradient = 'linear-gradient(180deg, #FE0000 16.66%, #FD8C00 16.66%, 33.32%, #FFE500 33.32%, 49.98%, #119F0B 49.98%, 66.64%, #0644B3 66.64%, 83.3%, #C22EDC 83.3%)';
</script>
```

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

<!-- tabs:end -->

As you can see, we can use any features inside of our `children` - even other components!

> [Thanks to Sarah Fossheim for the guide on how to add clipped background text like our exclamation mark!](https://fossheim.io/writing/posts/css-text-gradient/)



# Applying our knowledge

Now that we're familiar with how content projection works, let's apply it to one of our components we've been building for our file hosting application.

One example where we can utilize content projection in our application is as a wrapper component for our files list.

![A table of files with headings for "Name", "Last modified", "Type", and "Size"](./file_list.png)

As we can see, this file "list" is really more of a file "table". Let's go ahead and do some refactor work on our file list to be a `table`:

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
  selector: 'file',
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
  <td *ngIf="isFolder"><file-date inputDate={new Date()}></file-date></td>
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
  template: `
    <tbody>
      <ng-container *ngFor="let file of filesArray">
        <file
         *ngIf="!file.isFolder"
         [fileName]="file.fileName"
         [href]="file.href"
         [isSelected]="false"
         [isFolder]="file.isFolder"
         ></file>
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
  template: `
    <table><file-table-body></file-table-body></table>
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

<!-- tabs:end -->

<!-- Author's note: It's not clear what the best A11Y pattern is here. The best guide for this seems to be an incomplete WCAG guide -->
<!-- https://w3c.github.io/aria-practices/examples/grid/advancedDataGrid.html -->
<!-- That said, it seems like the best overall pattern here is that the row selection should have `aria-selected` (not `aria-pressed`) with the information present -->

--------------

Now that we have an explicit `FileTable` component, let's see if we're able to style it a bit more with a replacement `FileTableContainer` component, which utilizes content projection to style the underlying `table` element.

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
  template: `
  <table [style]="{color: '#3366FF', border: '2px solid #F5F8FF'}">
    <ng-content></ng-content>
  </table>
  `,
})
class FileTableContainerComponent {}

@Component({
  selector: 'file-table',
  template: `
    <file-table-container><file-table-body></file-table-body></file-table-container>
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

# Named Content Projection

Oftentimes when building a component that utilizes content projection, you'll find yourself wanting to have more than one area to inject content into. For example, in our table, let's pretend that on top of passing the table's body contents, we also want to pass a table's header.

While we _could_ simply pass the table as a `child`:

```jsx
<table>
   <FileHeader/>
   <FileList/>
</table>
```

 What happens if we want to apply custom styling to our `FileHeader` and apply it universally to all instances of a `table`'s `thead`?

This is where a named content projection would come in handy.

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

`ng-content` allows you to pass a `select` property to have specific children projected in dedicated locations. This `select` property takes [CSS selector query values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors). Knowing this, we can pass the attribute query for `header` by wrapping the attribute name in square brackets like so:

````typescript

@Component({
  selector: 'file-table-container',
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
  template: `
    <file-table-container>
    <tr header>
      <th>Name</th>
      <th>Date</th>
    </tr>
    <file-table-body></file-table-body>
    </file-table-container>
  `,
})
class FileTableComponent {}
````

Once `ng-content` finds related elements that match the `select` query, they will be content projected into the appropriate locations. If not matched by a `ng-content[select]`, they will be projected to a non `select` enabled `ng-content`.

## Vue

Similar to how Angular's `ng-content[select]` query works, Vue allows you to pass a `name` to the `slot` component in order to project named content.

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
    <template v-slot:header>
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

Here, we can see that `slot` is querying for a `header` template slot. This query is then satisfied by `FileTable`'s template for the heading `tr` element.

`v-slot` also has a shorthand of `#`, similar to how `v-bind` has a shorthand of `:`. Using this shorthand, we can modify our `FileTable` component to look like:

```vue
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
```

<!-- tabs:end -->



// TODO: Conclusion







# Challenge



Add in `resize` detection to the `useElementBounds` hook.

https://stackblitz.com/edit/react-ts-kkycvf?file=App.tsx,lib.dom.d.ts
