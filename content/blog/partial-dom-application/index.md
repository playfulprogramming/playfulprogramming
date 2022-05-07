---
{
    title: "Partial DOM Application",
    description: "There are specific instances where you may want to have a wrapper element in a framework that renders to nothing in the DOM. This is how.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 7,
    series: "The Framework Field Guide"
}
---


Whew! That last chapter was a doozy. Let's slow things down a bit for this chapter: Short and sweet.

Let's think back to the ["Dynamic HTML"](/posts/dynamic-html) and ["Intro to Components"](/posts/intro-to-components) chapters, where we were building our `File ` and `FileList` components:

<!-- tabs:start -->

# React

```jsx
const File = ({ href, fileName, isSelected, onSelected, isFolder }) => {
  return (
    <button
      onClick={onSelected}
      style={
        isSelected
          ? { backgroundColor: 'blue', color: 'white' }
          : { backgroundColor: 'white', color: 'blue' }
      }
    >
      <a href={href}>{fileName}</a>
      {isFolder && <FileDate inputDate={new Date()} />}
    </button>
  );
};

const FileList = () => {
  // ...

  return (
    // ...
    <ul>
      {filesArray.map((file, i) => (
        <li>
          {(!onlyShowFiles || !file.isFolder) &&
            <File
              key={file.id}
              isSelected={selectedIndex === i}
              onSelected={() => onSelected(i)}
              fileName={file.fileName}
              href={file.href}
              isFolder={file.isFolder}
            />
          }
        </li>
      ))}
    </ul>
    // ...
  );
};
```

# Angular

```typescript
@Component({
  selector: 'file',
  template: `
    <button
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
    </button>
  `,
})
export class FileComponent {
  @Input() fileName: string;
  @Input() href: string;
  @Input() isSelected: boolean;
  @Input() isFolder: boolean;
  @Output() selected = new EventEmitter();
}

@Component({
  selector: 'file-list',
  template: `
    <!-- ... -->
    <ul>
      <li *ngFor="let file of filesArray; let i = index; trackBy: fileTrackBy">
        <file
          *ngIf="onlyShowFiles ? !file.isFolder : true"
          (selected)="onSelected(i)"
          [isSelected]="selectedIndex === i"
          [fileName]="file.fileName" 
          [href]="file.href"
          [isFolder]="file.isFolder"
        ></file>
      </li>
    </ul>
    <!-- ... -->
  `,
})
export class FileListComponent {
  // ...
}
```

# Vue

```javascript
const File = {
  template: `
    <button
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
    </button>`,
  emits: ['selected'],
  props: ['isSelected', 'isFolder', 'fileName', 'href'],
};

const FileList = {
  template: `
    <!-- ... -->
    <ul>
      <li
        v-for="(file, i) in filesArray"
        :key="file.id"
      >
      <file 
        v-if="onlyShowFiles ? !file.isFolder : true"
        @selected="onSelected(i)" 
        :isSelected="selectedIndex === i" 
        :fileName="file.fileName" 
        :href="file.href"
        :isFolder="file.isFolder"
      ></file>
      </li>
    </ul>
    <!-- ... -->
  `,
  // ...
};
```

<!-- tabs:end -->

While this theoretically _works_, there's a significant problem with it. Let's take a look at what the HTML looks like when rendering with `onlyShowFiles=true` and the following `filesArray`:

```javascript
[
  {
    fileName: "File one",
    href: "/file/file_one",
    isFolder: false,
    id: 1
  },
  {
    fileName: "Folder one",
    href: "",
    isFolder: true,
    id: 2
  }
]
```

Because our conditional statement is on the `li` when rendered to the DOM, it might look something like this:

```html
<!-- ... -->
<ul>
  <li>
    <!-- File Component -->
    <button>...</button>
  </li>
  <li></li>
</ul>
<!-- ... -->
```

While this might not seem like a big problem at first, the fact that there's an empty `li` in the middle of our `ul` introduces three issues:

1) It will leave an empty space created by any styling you have applied to the `li`.
2) [Any assistive technologies, like screen readers](/posts/intro-to-web-accessability), will read out that there's an empty item, a confusing behavior for those users.
3) Any search engines reading data off of your page may incorrectly assume that your list is intentionally empty, thus potentially impacting your ranking on sites.

Solving these issues is where something called "partial DOM application" comes into play. See, ideally, what we want to have is something like a tag that renders to _nothing_.

This means that, if we could instead generate something like the following psuedo-syntax in framework code:

```html
<ul>
  <nothing>
    <li>
      <button>...</button>
    </li>
  </nothing>
  <nothing></nothing>
</ul>
```

We could render this into the DOM itself:

```html
<ul>
  <li>
    <button>...</button>
  </li>
</ul>
```

Luckily for us, each of the three frameworks provides a method for doing so, simply with a different syntax. Let's see how each framework does so:

<!-- tabs:start -->

# React

In React, we use something called a "Fragment" in place of the `nothing` component.

```jsx
import { Fragment } from 'react';

// ...

<ul>
  {
    filesArray.map(file => {
      return <Fragment key={file.id}>
        {file.isFolder && <li><File /></li>}
      </Fragment>
    })
  }
</ul>
```

`Fragment` also has an alternative syntax in JSX. Instead of `<Fragment></Fragment>`, you can simply do `<></>`. This shorthand removes the need for the import and makes the above code sample read like this:

```jsx
<ul>
  {
    filesArray.map(file => {
      return <>
        {file.isFolder && <li><File /></li>}
      </>
    })
  }
</ul>
```

> You may notice that `<>` syntax for `Fragment` does not have a `key`  associated with it. This is because the `<>` syntax does not allow you to have props associated with it. However, this means that your loop will still misbehave and add performance overhead as a penalty for not including `key` ([as we discussed in the "Dynamic HTML" chapter](/posts/dynamic-html)). For this reason, when inside of a `map` loop, you'll want to use `Fragment` with a `key` property associated with it.

# Angular

Angular's version of the `nothing` element is the `ng-container` element.

```html
<ul>
  <ng-container *ngFor="let file of filesArray; let i = index; trackBy: fileTrackBy">
    <li>
      <file
        *ngIf="onlyShowFiles ? !file.isFolder : true" 
        (selected)="onSelected(i)"
        [isSelected]="selectedIndex === i" 
        [fileName]="file.fileName" 
        [href]="file.href" 
        [isFolder]="file.isFolder"
      ></file>
    <li>
  </ng-container>
</ul>
```

# Vue

In order to render out something akin to a `nothing` element, we can use a [`template`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) element with a `v-for` or `v-if` associated with it.

```html
<ul>
  <template v-for="(file, i) of filesArray">
    <li :key="file.id">
      <file
        v-if="onlyShowFiles ? !file.isFolder : true"
        (selected)="onSelected(i)"
        [isSelected]="selectedIndex === i"
        [fileName]="file.fileName"
        [href]="file.href"
        [isFolder]="file.isFolder"
      ></file>
    <li>
  </template>
</ul>
```

<!-- tabs:end -->

# Stacking Partial Application

Just as a quick note, not only can these `nothing` elements be used once, but they can be stacked back-to-back to do... Well, nothing!

Here's some code samples that render out the following:

```html
<p>Test</p>
```

<!-- tabs:start -->

## React

```jsx
<>
  <>
    <>
    	<p>Test</p>
    </>
  </>
</>
```

## Angular

```html
<ng-container>
  <ng-container>
    <ng-container>
    	<p>Test</p>
    </ng-container>
  </ng-container>
</ng-container>
```

## Vue

While the other frameworks have a more 1:1 mapping between our pseudo-syntax `nothing`, Vue has a slightly different approach due to its reuse of the [existing HTML `<template>` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

By default, if you render a `template` in Vue, it will render nothing to the screen:

```html
<template>
  <p>Test</p>
</template>
```

> It's worth mentioning that even if it shows nothing on screen, the `template` element is still in the DOM itself, waiting to be utilized in other ways. While explaining "why" a `template` element renders nothing by default is outside of the scope of this book, it is expected behavior.

However, if you add a `v-for`, `v-if`, or a `v-slot` (we'll touch on what a `v-slot` is in [our "Content Reference" chapter](/posts/content-reference)), it will remove the `<template>` and only render out the children.

This means that both:
```html
<template v-if="true">
  <p>Test</p>
</template>
```

And:

```html
<template v-if="true">
  <template v-if="true">
    <template v-if="true">
      <p>Test</p>
    </template>
  </template>
</template>
```

Will both render out to the following HTML:

```html
<p>Test</p>
```

<!-- tabs:end -->

# Conclusion

And that's all!

> Wait, that's all?!

See? I told you it'd be a short chapter this time around!

Admittedly, this chapter was a stepping stone to help explain other topics elsewhere.

Next up, [we'll take a look at how to project content into another component](/posts/content-projection).

