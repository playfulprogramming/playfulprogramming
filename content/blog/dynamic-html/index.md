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

# Rendering Lists

While we've primarily focused on our `File` component until now, let's take another look at our `FileList` component.

<!-- tabs:start -->

## React

```jsx
const FileList = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onSelected = (idx) => {
    if (selectedIndex === idx) {
      setSelectedIndex(-1);
      return;
    }
    setSelectedIndex(idx);
  };

  return (
    <ul>
      <File
        isSelected={selectedIndex === 0}
        onSelected={() => onSelected(0)}
        fileName="File one"
        href="/file/file_one"
      />
      <File
        isSelected={selectedIndex === 1}
        onSelected={() => onSelected(1)}
        fileName="File two"
        href="/file/file_two"
      />
      <File
        isSelected={selectedIndex === 2}
        onSelected={() => onSelected(2)}
        fileName="File three"
        href="/file/file_three"
      />
    </ul>
  );
};
```

## Angular

```typescript
@Component({
  selector: 'file-list',
  template: `
    <ul>
      <file
        (selected)="onSelected(0)"
        [isSelected]="selectedIndex === 0"
        fileName="File one" 
        href="/file/file_one"
      ></file>
      <file
        (selected)="onSelected(1)"
        [isSelected]="selectedIndex === 1"
        fileName="File two" 
        href="/file/file_two"
      ></file>
      <file
        (selected)="onSelected(2)"
        [isSelected]="selectedIndex === 2"
        fileName="File three" 
        href="/file/file_three"
      ></file>
    </ul>
  `,
})
export class FileListComponent {
  selectedIndex = -1;

  onSelected(idx) {
    if (this.selectedIndex === idx) {
      this.selectedIndex = -1;
      return;
    }
    this.selectedIndex = idx;
  }
}
```

## Vue

```javascript
const FileList = {
  template: `
    <ul>
      <file 
        @selected="onSelected(0)" 
        :isSelected="selectedIndex === 0" 
        fileName="File one" 
        href="/file/file_one"
      ></file>
      <file 
        @selected="onSelected(1)" 
        :isSelected="selectedIndex === 1" 
        fileName="File two" 
        href="/file/file_two"
      ></file>
      <file 
        @selected="onSelected(2)" 
        :isSelected="selectedIndex === 2" 
        fileName="File three" 
        href="/file/file_three"
      ></file>
    </ul>
  `,
  data() {
    return {
      selectedIndex: -1,
    };
  },
  methods: {
    onSelected(idx) {
      if (this.selectedIndex === idx) {
        this.selectedIndex = -1;
        return;
      }
      this.selectedIndex = idx;
    },
  },
  components: {
    File,
  },
};
```

<!-- tabs:end -->

Something that might immediately jump out at you upon second glance is just how long these code samples are! Interestingly, this is primarily due to the copy-pasted nature of our `File` component being repeated.

What's more - this method of hardcoding file components means that we're unable to create new files in JavaScript and display them in the DOM.

Let's fix that by replacing the copy-pasted components with a loop and an array.

<!-- tabs:start -->

## React

```jsx {0-13,28-33}
const filesArray = [
    {
        fileName: "File one",
        href: "/file/file_one"
    },
    {
        fileName: "File two",
        href: "/file/file_two"
    },
    {
        fileName: "File three",
        href: "/file/file_three"
    }
]

const FileList = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onSelected = (idx) => {
    if (selectedIndex === idx) {
      setSelectedIndex(-1);
      return;
    }
    setSelectedIndex(idx);
  };

  return (
    <ul>
      {filesArray.map((file, i) => <File
        isSelected={selectedIndex === i}
        onSelected={() => onSelected(i)}
        fileName={file.fileName}
        href={file.href}
      />}
    </ul>
  );
};
```

React uses [JavaScript's built-in `Array.map` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) in order to loop through each item and map them to some React component.

We can then use the second argument inside of the `map` in order to gain access to the index of the looped item.

## Angular

```typescript {4-10,25-38}
@Component({
  selector: 'file-list',
  template: `
    <ul>
      <file
      	*ngFor="let file of filesArray; let i = index"
        (selected)="onSelected(i)"
        [isSelected]="selectedIndex === i"
        [fileName]="file.fileName" 
        [href]="file.href"
      ></file>
    </ul>
  `,
})
export class FileListComponent {
  selectedIndex = -1;

  onSelected(idx) {
    if (this.selectedIndex === idx) {
      this.selectedIndex = -1;
      return;
    }
    this.selectedIndex = idx;
  }
    
  filesArray = [
    {
        fileName: "File one",
        href: "/file/file_one"
    },
    {
        fileName: "File two",
        href: "/file/file_two"
    },
    {
        fileName: "File three",
        href: "/file/file_three"
    }
  ]
}
```

Inside of our `ngFor`, `index` may not seem like it is being defined, however, Angular declares it whenever you attempt to utilize `ngFor` under-the-hood. Assigning it to a template variable using `let` allows you to use it as the index of the looped item.

## Vue

```javascript {3-9,15-28}
const FileList = {
  template: `
    <ul>
      <file 
        v-for="(file, i) in filesArray"
        @selected="onSelected(i)" 
        :isSelected="selectedIndex === i" 
        :fileName="file.fileName" 
        :href="file.href"
      ></file>
    </ul>
  `,
  data() {
    return {
      selectedIndex: -1,
        filesArray: [
          {
              fileName: "File one",
              href: "/file/file_one"
          },
          {
              fileName: "File two",
              href: "/file/file_two"
          },
          {
              fileName: "File three",
              href: "/file/file_three"
          }
        ]
    };
  },
  methods: {
    onSelected(idx) {
      if (this.selectedIndex === idx) {
        this.selectedIndex = -1;
        return;
      }
      this.selectedIndex = idx;
    },
  },
  components: {
    File,
  },
};
```

<!-- tabs:end -->

Now if we look at the rendered output, we can see that we have all three files listing out as-expected!

Now all it would take to add a new item to our files list would be to `push` to said array and also force a re-render.

## Keys

If you're using React, you may encounter an error like the following:

> Warning: Each child in a list should have a unique "key" prop.

Or, in Vue, the error might say:

> Elements in iteration expect to have 'v-bind:key' directives

This is because each of these frameworks is only able to keep track of what's what inside of a loop using a manually input unique ID of some kind.

What this means is that if you don't provide a unique ID, when you re-render the loop, it will destroy the entire tree.

Say you have the following:

<!-- tabs:start -->

### React

```jsx
const WordList = () => {
  const [words, setWords] = React.useState([]);

  const addWord = () => {
    const newWord = getRandomWord();
    // Remove ability for duplicate words
    if (words.includes(newWord)) return;
    setWords([...words, newWord]);
  };

  return (
    <div>
      <button onClick={addWord}>Add word</button>
      <ul>
        {words.map((word) => {
          return <li>{word.word}</li>;
        })}
      </ul>
    </div>
  );
};

const wordDatabase = [
  { word: 'who', id: 1 },
  { word: 'what', id: 2 },
  { word: 'when', id: 3 },
  { word: 'where', id: 4 },
  { word: 'why', id: 5 },
  { word: 'how', id: 6 },
];

function getRandomWord() {
  return wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
}
```

### Angular

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'word-list',
  template: `
  <div>
      <button (click)="addWord()">Add word</button>
      <ul>
        <li *ngFor="let word of words">{{word.word}}</li>
      </ul>
    </div>
  `,
})
export class WordListComponent {
  words: Array<{ word: string; id: number }> = [];

  addWord() {
    const newWord = getRandomWord();
    // Remove ability for duplicate words
    if (this.words.includes(newWord)) return;
    this.words = [...this.words, newWord];
  }
}

const wordDatabase = [
  { word: 'who', id: 1 },
  { word: 'what', id: 2 },
  { word: 'when', id: 3 },
  { word: 'where', id: 4 },
  { word: 'why', id: 5 },
  { word: 'how', id: 6 },
];

function getRandomWord() {
  return wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
}
```

### Vue

```javascript
const WordList = {
  template: `
  <div>
  <button @click="addWord()">Add word</button>
  <ul>
    <li v-for="word in words">{{word.word}}</li>
  </ul>
</div>
`,
  data() {
    return {
      words: [],
    };
  },
  methods: {
    addWord() {
      const newWord = getRandomWord();
      // Remove ability for duplicate words
      if (this.words.includes(newWord)) return;
      this.words = [...this.words, newWord];
    },
  },
};

const wordDatabase = [
  { word: 'who', id: 1 },
  { word: 'what', id: 2 },
  { word: 'when', id: 3 },
  { word: 'where', id: 4 },
  { word: 'why', id: 5 },
  { word: 'how', id: 6 },
];

function getRandomWord() {
  return wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
}
```

<!-- tabs:end -->

Without using some kind of `key` prop, when you run `addWord` it will iterate through every item in the list and destroy them. This is because **the framework isn't able to detect which item in your array has changed, marks all DOM elements as "outdated" and destroys them in the process, only to immediately reconstruct them**.

**// TODO: add diagram demonstrating each item in the array being re-rendered**

In order to solve for this problem, we need to tell the framework which DOM element associates with which item in our JavaScript array.

<!-- tabs:start -->

### React

```jsx {4}
<div>
  <button onClick={addWord}>Add word</button>
  <ul>
    {words.map((word) => {
      return <li key={word.id}>{word.word}</li>;
    })}
  </ul>
</div>
```

Here, we're using the `key` property to tell React which `li` is related to which `word` via the `word`'s unique `id` field.

### Angular

While Angular doesn't have quite the same API for`key` as React and Vue, Angular instead uses a [`trackBy` method](https://angular.io/api/core/TrackByFunction) to figure out which item is which.

```typescript {8,16-18}
import { Component } from '@angular/core';

@Component({
  selector: 'word-list',
  template: `
    <div>
      <button (click)="addWord()">Add word</button>
      <ul>
        <li *ngFor="let word of words; trackBy: wordTrackBy">{{word.word}}</li>
      </ul>
    </div>
  `,
})
export class WordListComponent {
  words: Array<{ word: string; id: number }> = [];

  wordTrackBy(index, user) {
    return user.id;
  }

  // ...
}
```

Another difference to the other frameworks is that while React and Vue have no default `key` behavior, Angular has a default `trackBy` function if one is not provided. If no `trackBy` is provided, the default will simply do a strict equality (`===`) between the old item in the array and the new to check if the item is the same.

While this works in some cases, for the most part it's suggested to provide your own `trackBy` to avoid problems with the limitations present with the default.

### Vue

```javascript {5}
const WordList = {
  template: `
    <div>
      <button @click="addWord()">Add word</button>
      <ul>
        <li v-for="word in words" :key="word.id">{{word.word}}</li>
      </ul>
    </div>
`,
 // ...
}
```

<!-- tabs:end -->

Now that this is done, when we re-render the list, the framework is able to know exactly which items have and have not changed.

As such, it will only re-render the new items, leaving the old and unchanged DOM elements alone.

**// TODO: add diagram demonstrating only new items in the array being re-rendered** 

## Keys As Render Hints

// Use `key` to force a refresh





-------

Dynamic HTML

- For loop
  - Key
- Combining if and for
