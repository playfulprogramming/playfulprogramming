---
{
    title: "Dependency Injection",
    description: "Passing around props sucks. They're trivial get out of sync and easy to forget to pass. What if there was a better way to pass data between different parts of your app?",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 13,
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



# Vue

// TODO: Code sample

<!-- tabs:end -->







# Angular Notes



## Basic Usage



````typescript
import { InjectionToken, Component, Inject} from '@angular/core';

const WELCOME_MESSAGE_TOKEN = new InjectionToken('WELCOME_MESSAGE');

@Component({
  selector: 'child',
  template: ``
})
export class ChildComponent {
  constructor(@Inject(WELCOME_MESSAGE_TOKEN) private welcomeMsg: string) {}

  ngOnInit() {
    console.log(this.welcomeMsg);
  }
}

@Component({
  selector: 'app-root',
  template: `<child></child>`,
  providers: [
    {provide: WELCOME_MESSAGE_TOKEN, useValue: 'Hello, world!' },
  ]
})
export class AppComponent {
}
````



You can also use `inject` function instead.

```typescript
import { InjectionToken, Component, inject} from '@angular/core';

const WELCOME_MESSAGE_TOKEN = new InjectionToken<string>('WELCOME_MESSAGE');

@Component({
  selector: 'child',
  template: ``
})
export class ChildComponent {
  welcomeMsg = inject(WELCOME_MESSAGE_TOKEN);

  ngOnInit() {
    console.log(this.welcomeMsg);
  }
}

@Component({
  selector: 'app-root',
  template: `<child></child>`,
  providers: [
    {provide: WELCOME_MESSAGE_TOKEN, useValue: 'Hello, world!' },
  ]
})
export class AppComponent {
}
```





## Class Usage

```typescript
@Injectable()
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



## Setting values from the provider itself

````typescript
@Injectable()
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



## Optional DI

If we remove the `providers` from `ParentComponent`, like so:

```typescript
@Component({
  selector: "app-root",
  template: `<child></child>`
})
class ParentComponent {
  constructor(private injectedValue: InjectedValue) {}

  ngOnInit() {
    this.injectedValue.message = "Test";
  }
}
```

We get the following error:

> ```
> ERROR NullInjectorError: R3InjectorError(AppModule)[InjectedValue -> InjectedValue -> InjectedValue]: 
>   NullInjectorError: No provider for InjectedValue!
> ```

This is because Angular requires you to provide a value for an injected value by default.

```typescript

import { Injectable, Component, OnInit, Optional} from '@angular/core';

@Injectable()
class InjectedValue {
  message = "Hello, world";
}

@Component({
  selector: "child",
  template: `<div></div>`
})
class ChildComponent implements OnInit {
  constructor(@Optional() private injectedValue: InjectedValue) {}

  ngOnInit() {
    console.log(this.injectedValue);
  }
}

@Component({
  selector: "app-root",
  template: `<child></child>`
})
class ParentComponent {
}
```





## Global providers

```typescript
@Injectable({providedIn: 'root'})
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
  template: `<child></child>`
})
class ParentComponent {
}
```





# Outline

- Angular
  - Basic component `providers` with `useValue`
  - Basic component `providers` with classes
  - `@Optional`
  - `@Injectable{provideIn: 'root'}`

## Not going to teach

- Angular
  - `Self` and `SkipSelf` - Too complex, not features in other frameworks
  - `Host` - See above
  - `factory(() => {})`
  - `'platform'` and `'any'` `provideIn`

