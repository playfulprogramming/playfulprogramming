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

# Book 1: Fundamentals

- [Preface](/posts/preface) ✅
  - Why learn webdev ✅
    - Why these tools ✅
    - Who's building what ✅
  - What are we learning ✅
    - What aren't we learning ✅
    - Content outline ✅
    - Note on framework specifics ✅
- [Introduction to Components](/posts/intro-to-components) ✅
  - What is an app ✅
  - What is a component ✅
  - Rendering behavior ✅
  - Component relationships ✅
  - JS Logic ✅
  - Intro to lifecycles ✅
  - Display ✅
  - Attribute Binding ✅
  - Inputs ✅
  - Event Binding ✅
  - Outputs ✅
- [Dynamic HTML](/posts/dynamic-html) ✅
  - Conditional display ✅
    - Else conditions ✅
  - Rendering lists ✅
    - Keys ✅
- [Lifecycle Methods](/posts/lifecycle-methods) ✅
  - Render lifecycle ✅
    - Side effects ✅
    - Event bubbling ✅
  - Un-rendering ✅
  - Re-renders ✅
  - Lifecycle chart ✅
- [Derived Values](/posts/derived-values) ✅
  - Prop listening ✅
  - Derived values ✅
  - Local derived values ✅
- [Forms](/posts/forms) ✅
  - One-way binding ✅
  - Two-way bindings ✅
  - Reactive forms ✅
  - Form arrays ✅
  - Form validation ✅
  - Non-text form fields ✅
- [Partial DOM Application](/posts/partial-dom-application) ✅
  - Stacking `nothing` elements  ✅
- [Content Projection](/posts/content-projection) ✅
  - Named content projection
- [Content Reference](/posts/content-reference) ✅
  - Passing values to projected content  ✅
- [Element Reference](/posts/element-reference)
  - How to keep element reference array
- [Component Reference](/posts/component-reference)
- [Dependency injection](/posts/dependency-injection)
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

# Book 2: Ecosystem

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
- DevTools
  - React DevTools
    - `useDebugValue`
  - Angular DevTools
  - Vue.js DevTools
  - Flamegraph



----

TODO:

- I18N
- A11Y
- TypeScript for React/Vue

# Book 3: Internals

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

- Vue alternative syntax
  - Composition API
  - Show Vue using JSX
  - Show Vue `h` function
    "In fact, Vue's [virtual DOM](// TODO: Link) is similar enough to React's that it's able to use JSX"

