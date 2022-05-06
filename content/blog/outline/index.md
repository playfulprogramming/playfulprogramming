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



- Component reference
  - `ref`/`forwardRef` / `useImperativeHandle` React
    - Array of refs
  - ViewChild/Angular
    - `ViewChildren`
  - `ref` / Vue
    - Array of refs
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

- Portals

  - `Portal` / React
  - `Portal` CDK / Angular
  - `Teleport` / Vue

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
