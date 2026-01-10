---
{
title: "Bind Route Info to Component Inputs (New Router feature)",
published: "2023-04-05T15:41:34Z",
edited: "2023-04-05T16:06:07Z",
tags: ["angular", "router", "input", "v16"],
description: "Pass router info to routed component inputs            Topics covered in this...",
originalLink: "https://eneajahollari.medium.com/bind-route-info-to-component-inputs-new-router-feature-1d747e559dc4",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

### Pass router info to routed component inputs

#### Topics covered in this article:
- How it works today
- How it will work in Angular v16
- How to use it
- How to migrate to the new API
- How to test it
- Caveats

When building applications with Angular, most of the time we use the Router to render different pages for different urls.

And based on the url we also load the data based on its path parameters or query parameters.

In the latest version of Angular v16, we will get a new feature that will simplify the process of retrieving route information in the component and make it way easier.

### How it works today

Let's say we have a routes array like this one:

```ts
const routes: Routes = [
  {
    path: "search",
    component: SearchComponent,
  },
];
```

And inside the component we need to read the query params in order to fill a search form.

With an URL like this: `http://localhost:4200/search?q=Angular`;

```ts
@Component({})
export class SearchComponent implements OnInit {
    // here we inject the ActivatedRoute class that contains info about our current route
    private route = inject(ActivatedRoute);

    query$ = this.route.queryParams.pipe(map(queryParams) => queryParams['q']);

    ngOnInit() {
        this.query$.subscribe(query => { // do something with the query });
    }
}
```

As you can see, we need to inject the `ActivatedRoute` service and then we can access the query params from it. But we can also access the path params and the data, or even the resolved data, as we can see in the following example:

```ts
const routes: Routes = [
  {
    path: "search/:id",
    component: SearchComponent,
    data: { title: "Search" },
    resolve: { searchData: SearchDataResolver }
  },
];
```

```ts
@Component({})
export class SearchComponent implements OnInit {
    private route = inject(ActivatedRoute);

    query$ = this.route.queryParams.pipe(map(queryParams) => queryParams['q']);
    id$ = this.route.params.pipe(map(params) => params['id']);
    title$ = this.route.data.pipe(map(data) => data['title']);
    searchData$ = this.route.data.pipe(map(data) => data['searchData']);

    ngOnInit() {
        this.query$.subscribe(query => { // do something with the query });
        this.id$.subscribe(id => { // do something with the id });
        this.title$.subscribe(title => { // do something with the title });
        this.searchData$.subscribe(searchData => { // do something with the searchData });
    }
}
```

### How it will work in Angular v16

In Angular v16 we will get a new feature that will simplify the process of retrieving route information in the component and make it way easier.

We will be able to pass the route information to the component inputs, so we don't need to inject the `ActivatedRoute` service anymore.

```ts
const routes: Routes = [
  {
    path: "search",
    component: SearchComponent,
  },
];
```

```ts
@Component({})
export class SearchComponent implements OnInit {
    /* 
        We can use the same name as the query param, for example 'query'
        Example url: http://localhost:4200/search?query=Angular
    */
    @Input() query?: string; // we can use the same name as the query param

    /* 
        Or we can use a different name, for example 'q', and then we can use the @Input('q')
        Example url: http://localhost:4200/search?q=Angular
    */
    @Input('q') queryParam?: string; // we can also use a different name

    ngOnInit() {
        // do something with the query
    }
}
```

And we can also pass the path params, the data and resolved data to the component inputs:

```ts
const routes: Routes = [
  {
    path: "search/:id",
    component: SearchComponent,
    data: { title: "Search" },
    resolve: { searchData: SearchDataResolver }
  },
];
```

```ts
@Component({})
export class SearchComponent implements OnInit {
    @Input() query?: string; // this will come from the query params
    @Input() id?: string; // this will come from the path params
    @Input() title?: string; // this will come from the data
    @Input() searchData?: any; // this will come from the resolved data

    ngOnInit() {
        // do something with the query
        // do something with the id
        // do something with the title
        // do something with the searchData
    }
}
```

And of course we can rename the inputs to whatever we want:

```ts
const routes: Routes = [
  {
    path: "search/:id",
    component: SearchComponent,
    data: { title: "Search" },
    resolve: { searchData: SearchDataResolver }
  },
];
```

```ts
@Component({})
export class SearchComponent implements OnInit {
    @Input() query?: string; 
    @Input('id') pathId?: string; 
    @Input('title') dataTitle?: string;
    @Input('searchData') resolvedData?: any; 

    ngOnInit() {
        // do something with the query
        // do something with the pathId
        // do something with the dataTitle
        // do something with the resolvedData
    }
}
```

### How to use it
In order to use this new feature, we need to enable it in the `RouterModule`:

```ts
@NgModule({
  imports: [
    RouterModule.forRoot([], {
      //... other features
      bindToComponentInputs: true // <-- enable this feature
    })
  ],
})
export class AppModule {}
```

Or if we are in a standalone application, we can enable it like this:

```ts
bootstrapApplication(App, {
  providers: [
    provideRouter(routes, 
        //... other features
        withComponentInputBinding() // <-- enable this feature
    )
  ],
});
```

### How to migrate to the new api

If we have a component that is using the `ActivatedRoute` service, we can migrate it to the new api by doing the following:

1. Remove the `ActivatedRoute` service from the component constructor.
2. Add the `@Input()` decorator to the properties that we want to bind to the route information.
3. Enable the `bindToComponentInputs` feature in the `RouterModule` or `provideRouter` function.

Example with before and after for path params, with url: http://localhost:4200/search/123

```ts
// Before
@Component({})
export class SearchComponent implements OnInit {
    private route = inject(ActivatedRoute);

    id$ = this.route.params.pipe(map(params) => params['id']);

    ngOnInit() {
        this.id$.subscribe(id => { // do something with the id });
    }
}
```

```ts
// After
@Component({})
export class SearchComponent implements OnInit {
    @Input() id?: string; // this will come from the path params

    ngOnInit() {
        // do something with the id
    }
}
```

### How to test it

In order to test the new feature, we can use the `RouterTestingHarness` and let it handle the navigation for us.

Here is an example of how to test the route info bound to component inputs with the `RouterTestingHarness`:
```ts
@Component({})
export class SearchComponent {
    @Input() id?: string; 
    @Input() query?: string; 
}
```

```ts
it('sets id and query inputs from matching query params and path params', async () => {
    TestBed.configureTestingModule({
        providers: [ provideRouter(
            [{ path: 'search/:id', component: SearchComponent }],
            withComponentInputBinding()
        ) ],
    });

    const harness = await RouterTestingHarness.create();

    const instance = await harness.navigateByUrl(
        '/search/123?query=Angular',
        TestComponent
    );

    expect(instance.id).toEqual('123');
    expect(instance.query).toEqual('Angular');

    await harness.navigateByUrl('/search/2?query=IsCool!');
    expect(instance.id).toEqual('2');
    expect(instance.query).toEqual('IsCool!');
});
```

It's as simple as that!

### Caveats
- Sometimes we want the `id` or `queryParams` to be observables, so we can combine them with other observable to get some data.

For example, let's say we have a component that is using the `id` and `queryParams` to get some data from the server:

```ts
@Component({})
export class SearchComponent implements OnInit {
    private dataService = inject(DataService);

    @Input() id?: string; 
    @Input() query?: string; 

    ngOnInit() {
        this.dataService.getData(this.id, this.query).subscribe(data => {
            // do something with the data
        });
    }
}
```

If we want to use the async pipe in order to subscribe to the data, we need to make sure that the `id` and `query` are observables instead of strings, otherwise this example below will not work:

```ts
@Component({})
export class SearchComponent implements OnInit {
    private dataService = inject(DataService);

    @Input() id?: string; 
    @Input() query?: string; 

    // this will not work because the id and the query don't have a value yet (they are undefined)
    // they will have a value only after the component is initialized and the inputs are set
    data$ = this.dataService.getData(this.id, this.query); 
}
```

In order to make the `id` and `query` observables, we can use the `BehaviorSubject`:

```ts
@Component({
    template: `
        <div *ngIf="data$ | async as data">
            {{ data }}
        </div>
    `
})
export class SearchComponent implements OnInit {
    private dataService = inject(DataService);

    id$ = new BehaviorSubject<string | null>(null);
    query$ = new BehaviorSubject<string | null>(null);

    @Input() set id(id: string) { this.id$.next(id); }
    @Input() set query(query: string) { this.query$.next(query); }

    data$ = combineLatest([
        this.id$.pipe(filter(id => id !== null)), 
        this.query$.pipe(filter(query => query !== null))
    ]).pipe(
        switchMap(([id, query]) => this.dataService.getData(id, query))
    );
}
```

As you can see, we are using the `BehaviorSubject` to make the `id` and `query` observables, and we are using the `combineLatest` operator to combine them with the `switchMap` operator to get the data from the server. 

Personally, I think that this is a bit too much code for a simple example, so I would recommend to use the `ActivatedRoute` service instead of the new api in this case.

- Priority of the route information when the route infos have the same name.
For example, let's say we have a route with the following configuration:

```ts
const routes: Routes = [
  {
    path: 'test/:value',
    component: TestComponent,
    data: { value: 'Hello from data' },
  }
];
```

```ts
@Component({ template: `{{ value }}` })
export class TestComponent {
  @Input() value?: string;
}
```

The new api will bind the route information to the component inputs in the following order:

1. Data
2. Path params
3. Query params

If there's no data, it will use the path params, if there's no path params, it will use the query params
If there's no query params, the value input will be undefined!

- We don't know where the input value will come from 😬

In my opinion, for this "issue" what we can do is to rename the Input in imports and use it like this: 
```ts
import { Input as RouteInput, Component } from "@angular/core";

@Component({ template: `{{ value }}` })
export class TestComponent {
  @RouteInput() value?: string;
}

// OR 
import { Input as QueryParamInput, Component } from "@angular/core";

@Component({ template: `{{ value }}` })
export class TestComponent {
  @QueryParamInput() value?: string;
}
```

Not the best way possible, but we can see that it's not a normal input and that it is connected with the router info.

### Conclusion
I hope you enjoyed this article, and I hope that you will find this new feature useful.

If you have any questions or suggestions, feel free to leave a comment below.

Play with the feature here: https://stackblitz.com/edit/angular-jb85mb?file=src/main.ts 🎮

Thanks for reading!

---

I tweet a lot about Angular (latest news, videos, podcasts, updates, RFCs, pull requests and so much more). If you’re interested about it, give me a follow at [@Enea_Jahollari](https://twitter.com/Enea_Jahollari). Give me a follow on [dev.to](https://dev.to/eneajaho) if you liked this article and want to see more like this!