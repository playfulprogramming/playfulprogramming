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
- [Element Reference](/posts/element-reference) ✅
  - How to keep element reference array ✅
- [Component Reference](/posts/component-reference) ✅
- [Dependency injection](/posts/dependency-injection) ✅
  - `useContext` / React ✅
  - `provide/inject` / Vue ✅
  - Angular DI ✅
- [Shared Component Logic](/posts/shared-component-logic)
  - React / Custom Hooks ✅
  - Angular / Services ✅
  - Vue / Custom Compositions ✅

- [Directives](/posts/directives)
  - React / Custom Hooks & Passing Props ✅
  - Angular ✅
  - [Vue](https://vuejs.org/guide/reusability/custom-directives.html) ✅

- Portals
  - `Portal` / React
  - `Portal` CDK / Angular
  - `Teleport` / Vue
- Error handling
  - onErrorCapture / Vue
  - Error boundary / React
  - [`ErrorHandler`](https://angular.io/api/core/ErrorHandler) / Angular
- Accessibility (A11Y)
- Fundamentals/Structure
  - Pure vs impure logic
  - Unidirectionality

# Book 2: Ecosystem

- Build Tooling
  - Official Tooling
    - Angular CLI
    - React CLI
    - Vue CLI

  - Manual Bundling
    - Webpack
    - Rollup
    - Parcel

  - Best of Both Worlds
    - Vite
- Styling
  - CSS Modules
  - CSS-in-JS
    - Emotion CSS
      - React `styled` API
      - [Angular](https://stackblitz.com/edit/angular-ivy-v7vjkp?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html)
      - [Vue](https://stackblitz.com/edit/vue-ai8qpp?file=src%2FApp.vue)
- Routing
  - React Router
  - Angular Router
  - Vue Router
- Observables
  - RxJS

- API
  - HTTPS
    - Angular HTTP library
    - Browser's Fetch / React & Vue

  - GraphQL
    - [Apollo Client](https://www.apollographql.com/docs/react/)
- Internationalization (i18n)
  - [React / i18next](https://react.i18next.com)
  - [Angular Internationalization](https://angular.io/guide/i18n-overview)
  - [Vue i18n](https://kazupon.github.io/vue-i18n/)
- Testing
  - Test Running & Unit Testing
    - [Vitest](vitest.dev/)

    - Basic logic testing, no UI testing

    - Angular / [Service Testing](https://angular.io/guide/testing-services#testing-services)

  - Integration testing
    - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
    - [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)
    - [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
    - [MSW](https://mswjs.io/)

  - End-to-end testing
    - [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro)
- Visual Playground
  - [Storybook](storybook.js.org/)
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

**Not sure about**

- TypeScript for React/Vue



# Book 3: Internals

- Performance
  - OnPush/Angular
  - memo/React
  - [`v-once`](https://vuejs.org/guide/best-practices/performance.html#v-once) / Vue
- Rendering Behavior
  - Vue/React = Virtual DOM
    - JSX Aside
      - Explain `h` function
  - Angular = Incremental DOM
- Reactivity
  - React explicit
  - Angular = Zone.js
  - Vue = Proxies
    - Bad redux example
- Angular Dependency Injection
- Alternative Syntaxes
  - Angular
    - Standalone Components (or Modules)

  - Vue
    - Composition API
    - Setup Function
    - RFC Sugar
    - JSX

- Building a demo app
- API Comparison Table
- Terminology/Glossary

