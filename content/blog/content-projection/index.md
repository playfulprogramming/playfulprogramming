---
{
    title: "Content Projection",
    description: "Just like HTML nodes have parents and children, so too do framework components. Let's learn how React, Angular, and Vue allow you to pass children to your components.",
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

```javascript
const ToggleButtonList = {
  template: `
  <button @click="togglePressed()" :style="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button" :aria-pressed="pressed">
  Hello world!
</button>
`,
  data() {
    return { pressed: false };
  },
  methods: {
    togglePressed() {
      this.pressed = !this.pressed;
    },
  },
};
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

```javascript
const ToggleButtonList = {
  template: `
  <button @click="togglePressed()" :style="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button" :aria-pressed="pressed">
  Hello world!
</button>
<button @click="togglePressed2()" :style="{backgroundColor: pressed2 ? 'black' : 'white', color: pressed2 ? 'white' : 'black'}" type="button" :aria-pressed="pressed2">
Hello world!
</button>
`,
  data() {
    return { pressed: false, pressed2: false };
  },
  methods: {
    togglePressed() {
      this.pressed = !this.pressed;
    },

    togglePressed2() {
      this.pressed2 = !this.pressed2;
    },
  },
};
```



<!-- tabs:end -->

But this admittedly adds a fair bit of complexity and muddles up the code's readability.

We could instead use [dynamic HTML](/posts/dynamic-html) and create a `for` loop, but what if we wanted to have items in between some of the `button`s? It's not a great fit.

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

```javascript
const ToggleButton = {
  template: `
  <button @click="togglePressed()" :style="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button" :aria-pressed="pressed">
  {{text}}
</button>
  `,
  props: ['text'],
  data() {
    return { pressed: false };
  },
  methods: {
    togglePressed() {
      this.pressed = !this.pressed;
    },
  },
};

const ToggleButtonList = {
  template: `
  <toggle-button text="Hello world!"></toggle-button>
  <toggle-button text="Hello other friends!"></toggle-button>
`,
  components: {
    ToggleButton,
  },
};
```

<!-- tabs:end -->

Here, we're passing `text` as a string property to assign text. But oh no! What if we wanted to add a `span` inside of the `button` to add bolded text? After all, if you pass `Hello, <span>world</span>!`, it wouldn't render the `span`, but instead render the `<span>` as text.

Instead, **let's allow the parent of our `ToggleButton` to pass in a template that's then rendered into the component**.

<!-- tabs:start -->

# React

// TODO: Mention `children` being a special property name in React

```jsx
const ToggleButton = ({children}) => {
	const [pressed, setPressed] = useState(false);
	return (
		<button onClick={() => setPressed(!pressed)} style={{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}} type="button" aria-pressed={pressed}>
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

# Angular

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

// TODO: Mention `ng-content` to be a special tab

# Vue

// TODO: Mention "slot" being a special element

```javascript
const ToggleButton = {
  template: `
  <button @click="togglePressed()" :style="{backgroundColor: pressed ? 'black' : 'white', color: pressed ? 'white' : 'black'}" type="button" :aria-pressed="pressed">
  <slot></slot>
</button>
  `,
  props: ['text'],
  data() {
    return { pressed: false };
  },
  methods: {
    togglePressed() {
      this.pressed = !this.pressed;
    },
  },
};

const ToggleButtonList = {
  template: `
  <toggle-button>Hello <span style="font-weight: bold">world</span>!</toggle-button>
  <toggle-button>Hello other friends!</toggle-button>
`,
  components: {
    ToggleButton,
  },
};
```

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

```javascript
const RainbowExclamationMark = {
  template: `
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
  `,
  data() {
    return {
      rainbowGradient:
        'linear-gradient(180deg, #FE0000 16.66%, #FD8C00 16.66%, 33.32%, #FFE500 33.32%, 49.98%, #119F0B 49.98%, 66.64%, #0644B3 66.64%, 83.3%, #C22EDC 83.3%)',
    };
  },
};

const ToggleButtonList = {
  template: `
  <toggle-button>Hello <span v-for="friend of friends">{{friend}} </span>!</toggle-button>
  <toggle-button>Hello other friends<rainbow-exclamation-mark></rainbow-exclamation-mark></toggle-button></toggle-button>
`,
  components: {
    ToggleButton,
    RainbowExclamationMark,
  },
  data() {
    return {
      friends: ['Kevin,', 'Evelyn,', 'and James'],
    };
  },
};
```

<!-- tabs:end -->

As you can see, we can use any features inside of our `children` - even other components!

> [Thanks to Sarah Fossheim for the guide on how to add clipped background text like our exclamation mark!](https://fossheim.io/writing/posts/css-text-gradient/)



# Applying our knowledge

Now that we're familiar with how content projection works, let's apply it to one of our components we've been building for our file hosting application.

One example where we can utilize content projection in our application is as a wrapper component for our files list.

![// TODO: Add content](./file_list.png)

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

```jsx

const File = {
  template: `
  <tr
    @click="selected.emit()"
    :aria-selected="isSelected"
    :style="
      isSelected
        ? { backgroundColor: 'blue', color: 'white' }
        : { backgroundColor: 'white', color: 'blue' }
    "
  >
    <td><a :href="href">{{fileName}}</a></td>
    <td v-if="isFolder"><file-date :inputDate="new Date()"></file-date></td>
  </tr>
  `,
  components: {
    FileDate,
  },
  props: ['fileName', 'href', 'isSelected', 'isFolder'],
  emits: ['selected'],
};

// This was previously called "FileList"
const FileTableBody = {
  template: `
  <tbody>
    <template v-for="file in filesArray">
      <file
        v-if="!file.isFolder"
        :fileName="file.fileName"
        :href="file.href"
        :isSelected="false"
        :isFolder="file.isFolder"
        ></file>
        </template>
    </tbody>`,
  components: { File },
  data() {
    return {
      filesArray: [
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
      ],
    };
  },
};

// This is a new component
const FileTable = {
  template: `
    <table><file-table-body></file-table-body></table>
  `,
  components: {
    FileTableBody,
  },
};
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

```javascript
const FileTableContainer = {
  template: `
  <table :style="{color: '#3366FF', border: '2px solid #F5F8FF'}">
    <slot></slot>
  </table>
  `,
};

const FileTable = {
  template: `
    <file-table-container><file-table-body></file-table-body></file-table-container>
  `,
  components: {
    FileTableBody,
    FileTableContainer,
  },
};
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

// TODO: Mention `[header]` selector aligning with CSS selector query value

## Vue

```javascript

const FileTableContainer = {
  template: `
  <table :style="{color: '#3366FF', border: '2px solid #F5F8FF'}">
    <thead><slot name="header"></slot></thead>
    <slot></slot>
  </table>
  `,
};

const FileTable = {
  template: `
    <file-table-container>
      <header>
        <tr>
        <th>Name</th>
        <th>Date</th>
        </tr>
      </header>
      <file-table-body></file-table-body>
    </file-table-container>
  `,
  components: {
    FileTableBody,
    FileTableContainer,
  },
};
```

// TODO: Mention how `header` is not a component, just a reference to the named `slot`

<!-- tabs:end -->



------------

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