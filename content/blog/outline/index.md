---
{
    title: "Outline",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: []
}
---

# Future Sections

- Forms
  - ngModel/Angular
    - Angular Forms
  - One way binding/React
  - v-model/Vue
- Partial DOM Application
  - `React.Fragment` / React
  - `ng-template` / Angular
  - `template` / Vue



---------



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



-------

- Content reference
  - Children/React
    - Children.forEach and beyond
  - `@ViewContents` / Angular
  - `slots` / Vue
  - Passing values to content projection
    - `v-slot` attribute / Vue
    - `React.cloneElement` / React
    - NgTemplate `context` / Angular

File list created by `Children.forEach` or a `ng-template` of `ViewContents` .



Then, we pass relevant data via `v-slot`.



End API looks something like:

```jsx
<FileList component={File}/>
```







---------



- Component reference
  - `ref`/`forwardRef` / `useImperativeHandle` React
  - ViewChild/Angular
  - `ref` / Vue
  - Element reference
  - Component reference



Element reference first, introduce alternative to `onClick` using `document.addEventListener()`

`element.focus()` example



Then, move to component reference to introduce calling component method/data.

https://stackblitz.com/edit/react-ts-gpjzsm?file=index.tsx







-----------

- Dependency injection
  - `useContext` / React
  - `provide/inject` / Vue
  - Angular DI 

- Error handling
  - onErrorCapture / Vue
  - Error boundary / React
  - [`ErrorHandler`](https://angular.io/api/core/ErrorHandler) / Angular

- Fundamentals/Structure
  - Pure vs impure logic
  - Unidirectionality

- Routing
  - React Router
  - Angular Router
  - Vue Router

- HTTPS
  - Angular HTTP library
  - Fetch / React & Vue

- Testing
  - Testing library, simply for ease of comparison

- SSR
  - NextJS / React
  - NuxtJS / Vue
  - Angular Universal / Angular

- SSG
  - Gatsby / React
  - Gridsome / Vue (alternatively: VuePress, but Grindsome seems more like Gatsby)
  - Scully / Angular

- Store
  - NgRX / Angular
  - Vuex / Vue
  - Redux / React
    - Redux DevTools / NgRX

  -------

- DevTools

  - React DevTools
    - `useDebugValue`
  - Angular DevTools
  - Vue.js DevTools
  - Flamegraph



------

- Performance
  - OnPush/Angular
  - memo/React
  - [`v-once`](https://vuejs.org/guide/best-practices/performance.html#v-once) / Vue
- Under-the-hood how do each framework render contents?
  - Vue/React = Virtual DOM
  - Angular = Incremental DOM
- Under-the-hood how do each framework track changes?
  - React explicit
  - Angular = Zone.js
  - Vue = Proxies
    - Bad redux example
- Building a demo app
- API Comparison Table
- Terminology/Glossary



----

TODO:

- I18N
- A11Y
