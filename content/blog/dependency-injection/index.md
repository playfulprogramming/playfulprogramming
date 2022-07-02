---
{
    title: "Dependency Injection",
    description: "Passing around props sucks. They're trivial get out of sync and easy to forget to pass. What if there was a better way to pass data between different parts of your app?",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 12,
    series: "The Framework Field Guide"
}
---



Selected file is a good example of DI



Let's take the following example:

<!-- tabs:start -->

# React

```jsx
const InfoSidebar = ({ file }) => {
  const type =
    file.type[0].toUpperCase() + file.type.slice(1, file.type.length);
  const created = file.created.toISOString().slice(0, 10);
  const modified = file.modified.toISOString().slice(0, 10);
  return (
    <div>
      <h1>{file.name}</h1>
      <hr />
      <table>
        <tr>
          <th scope="row">Type</th>
          <td>{type}</td>
        </tr>
        <tr>
          <th scope="row">Created</th>
          <td>{created}</td>
        </tr>
        <tr>
          <th scope="row">Modified</th>
          <td>{modified}</td>
        </tr>
      </table>
    </div>
  );
};

const FileList = ({ filesList, selectFile }) => {
  return (
    <ul>
      {filesList.map((file) => (
        <li>
          <button onClick={() => selectFile(file)}>{file.name}</button>
        </li>
      ))}
    </ul>
  );
};

const filesList = [
  {
    name: 'Movies',
    type: 'folder',
    created: new Date('12/04/2008'),
    modified: new Date('1/17/2022'),
  },
  {
    name: 'Pictures',
    type: 'folder',
    created: new Date('2/07/2012'),
    modified: new Date('6/9/2021'),
  },
  {
    name: 'GTA V Cheat Codes',
    type: 'file',
    created: new Date('9/23/2018'),
    modified: new Date('3/5/2020'),
  },
];

export default function App() {
  const [selectedFile, setSelectedFile] = React.useState();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <FileList
        filesList={filesList}
        selectFile={(file) => setSelectedFile(file)}
      />
      {selectedFile && <InfoSidebar file={selectedFile} />}
    </div>
  );
}
```

# Angular

// TODO: Code sample



----





```typescript

class InjectedValue {
  message = "Hello, world";
}

@Component({
  selector: "child",
  template: `<div></div>`
})
class ChildComponent implements OnInit {
  constructor(private injectedValue: InjectedValue) {}

  ngOnInit() {
    console.log(this.injectedValue);
  }
}

@Component({
  selector: "app-root",
  providers: [InjectedValue],
  template: `<child></child>`
})
class ParentComponent {
}
```





----





````typescript
class InjectedValue {
  message = "Hello, world";
}

@Component({
  selector: "child",
  template: `<div></div>`
})
class ChildComponent implements OnInit {
  constructor(private injectedValue: InjectedValue) {}

  ngOnInit() {
    setTimeout(() => {
      console.log(this.injectedValue);
    }, 0)
  }
}

@Component({
  selector: "app-root",
  providers: [InjectedValue],
  template: `<child></child>`
})
class ParentComponent {
  constructor(private injectedValue: InjectedValue) {}

  ngOnInit() {
    this.injectedValue.message = "Test";
  }
}
````



-------



// TODO: Talk about `Injectable`



# Vue

// TODO: Code sample

<!-- tabs:end -->











------









`@Optional`
