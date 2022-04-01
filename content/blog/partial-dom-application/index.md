---
{
    title: "Partial DOM Application",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 7,
    series: "The Framework Field Guide"
}
---


Whew! That last chapter was a doozy. Let's slow things down a bit for this chapter: Short and sweet.

First, let's think back to the ["Dynamic HTML"](/posts/dynamic-html) and ["Intro to Components"](/posts/intro-to-components) chapters, where we were building our `File ` and `FileList` components:

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
        {filesArray.map((file, i) => {
          if (onlyShowFiles ? file.isFolder : false) return null;
          return <File
            key={file.id}
            isSelected={selectedIndex === i}
            onSelected={() => onSelected(i)}
            fileName={file.fileName}
            href={file.href}
            isFolder={file.isFolder}
          />;
        }
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



Move `li` into `File` component?





----





<!-- tabs:start -->

# React

```jsx
<ul>
	{
        list.map(item => {
            return <li>{item.name}</li>
        })
    }
</ul>
```

# Angular

```html
<ul>
  <li *ngFor="let item of list">{{item.name}}</li>
</ul>
```

# Vue

```html
<ul>
  <li v-for="item of list">{{item.name}}</li>
</ul>
```

<!-- tabs:end -->



While this works, what if we want to conditionally render the `li` if `item.show` is `true`?



<!-- tabs:start -->

# React

```jsx
<ul>
  {
    list.map(item => {
      return <div>
        {item.show && <li>{item.name}</li>}
      </div>
    })
  }
</ul>
```

> There's actually an easier way to run this code without the method we'll point to later... Can you figure out what that way of doing things is?

# Angular

```html
<ul>
  <div *ngFor="let item of list">
    <li *ngIf="item.show">{{item.name}}</li>
  </div>
</ul>
```

# Vue

```html
<ul>
  <li v-for="item of list">{{item.name}}</li>
</ul>
```

<!-- tabs:end -->





-----------------------------------------------------------------------------------------------

- `React.Fragment` / React
- `ng-template` / Angular
- `template` / Vue
