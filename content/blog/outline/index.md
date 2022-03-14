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

# Intro notes

- AngularJS is not Angular
- We're using Vue 3, Angular 13, React 18
  - React is stable, but updates often
  - Angular is stable, but updates often

- Ecosystem numbers
- Mention tooling and third party packages
- Outline contents
- React has two methods of display: We'll focus on hooks
- Vue has two methods of display: We'll focus on options API

# Future Sections

- Forms
  - ngModel/Angular
    - Angular Forms
  - One way binding/React
  - v-model/Vue
- Fundamentals/Structure
  - Pure vs impure logic
  - Unidirectionality
- Under-the-hood how do each framework render contents?
  - Vue/React = Virtual DOM
  - Angular = Incremental DOM
- Under-the-hood how do each framework track changes?
  - React explicit
  - Angular = Zone.js
  - Vue = Proxies
    - Bad redux example
- Performance
  - OnPush/Angular
  - memo/React
  - ???? / Vue
- Component reference
  - `ref`/`forwardRef` / React
  - ViewChild/Angular
  - `ref` / Vue
- Content projection
  - `{props.children}` / React
  - `ng-content` / Angular
  - `<slot>` / Vue
- Content reference
  - Children/React
    - Children.forEach and beyond
  - `@ViewContents` / Angular
  - `slots` / Vue
- Dependency injection
  - `useContext` / React
  - `provide/inject` / Vue
  - Angular DI 
- Error handling
  - onErrorCapture Vue
  - Error boundary React
- Routing
  - React Router
  - Angular Router
  - Vue Router
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
  - Angular DevTools
  - Vue.js DevTools
  - Flamegraph
- Building a demo app
- Terminology/Glossary



----------



Unsure:

- HTTPS
  - Angular HTTP library
  - Fetch / React & Vue
- i18n
  - React i18n
  - Angular i18n
  - ???? / Vue
- Animations
  - ???? / React (too many)
  - Angular Animation
  - 
