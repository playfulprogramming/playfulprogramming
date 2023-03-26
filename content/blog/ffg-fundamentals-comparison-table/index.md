---
{
    title: "Framework Comparison Table",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: []
}
---



# Similarities:

| Angular                                                      | React                                                        | Vue                                                          | Notes                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `{{}}`                                                       | [`{}`](https://reactjs.org/docs/introducing-jsx.html#embedding-expressions-in-jsx)* | [`{{}}`](https://vuejs.org/v2/guide/#Declarative-Rendering)  | \* JSX (React) handles this a bit differently than the others. While you can use some JS in Vue and Angular, you can run all JavaScript (JS) within JSX |
| `[prop]`                                                     | `prop={}`                                                    | `v-bind:prop=""`/`:prop=""`                                  |                                                              |
| `(event)`                                                    | Functions passed via props                                   | `v-on:event`/`@event`                                        |                                                              |
| [OnChanges](https://angular.io/api/core/OnChanges)           | [`componentDidUpdate`](https://reactjs.org/docs/react-component.html#componentdidupdate)\*/`useEffect` | [`watch`](https://vuejs.org/v2/guide/computed.html#Watchers)/[`vm.$watch`](https://vuejs.org/v2/api/#vm-watch)**/`watchEffect` | \*This is a bit different. This is called when a render is called. This is because of the differences between local state and not with React/others<br />\*\* This only listens to a single properties and not a list of others |
| `constructor`/ [OnInit](https://angular.io/api/core/OnInit)  | `constructor`/[ComponentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount)/`useEffect(()=>{}, []);` | `created`/`mounted`/`onMounted`                              |                                                              |
| [OnDestroy](https://angular.io/api/core/OnDestroy)           | [ComponentWillUnmount](https://reactjs.org/docs/react-component.html#componentwillunmount)/Return `useEffect` | `beforeDestroy`/`onBeforeDestroy`                            |                                                              |
| [*ngFor](https://angular.io/api/common/NgForOf)              | [`map` with `key` in JSX](https://reactjs.org/docs/lists-and-keys.html) | [`v-for` with key](https://vuejs.org/v2/guide/#Conditionals-and-Loops) |                                                              |
| [*ngIf](https://angular.io/api/common/NgIf)                  | [Ternary operator with a `null`/`undefined` to prevent rendering](https://reactjs.org/docs/conditional-rendering.html) | [`v-if`](https://vuejs.org/v2/guide/#Conditionals-and-Loops) |                                                              |
| [OnChanges `preveousValue` diff checking](https://angular.io/api/core/OnChanges)/[ChangeDetection.OnPush](https://angular.io/api/core/ChangeDetectionStrategy)* | [ShouldComponentUpdate](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)**/[PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent)/`React.memo`/[React Forget](https://youtu.be/lGEMwh32soc) |                                                              | * `ChangeDetection.OnPush` does NOT directly do the same thing as `PureComponent` as it pertains to a very specific Angular-only logic. That being said, if you're familiar with `OnPush`. ** In the future React may treat `shouldComponentUpdate()` as a hint rather than a strict directive, and returning false may still result in a re-rendering of the component. |
| [ChangeDetectorRef](https://angular.io/api/core/ChangeDetectorRef)\* | [forceUpdate](https://reactjs.org/docs/react-component.html#forceupdate) | [`vm.$forceUpdate()`](https://vuejs.org/v2/api/#vm-forceUpdate)** | \* This does not guarantee that the component will re-render - see back to differences between Angular and React<br />**Does not apply to children |
| [`[attr.atrib]="val"`](https://angular.io/guide/template-syntax#attribute-binding) | [`atrib={val}`](https://reactjs.org/docs/dom-elements.html)  | [`v-bind:atrib="val"`](https://vuejs.org/v2/guide/#Declarative-Rendering)/`:atrib="val"` |                                                              |
| `([ngModel])`                                                | Separate value and setter function props                     | `v-model`                                                    |                                                              |
| `@ViewChild`/`elementRef.nativeElement`                      | [`React.createRef`](https://reactjs.org/docs/refs-and-the-dom.html)/[`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) | `vm.$el`                                                     |                                                              |
| [Pipes](https://angular.io/guide/pipes)                      | [`useMemo`](https://reactjs.org/docs/hooks-effect.html)      | [`computed`](https://vuejs.org/v2/guide/computed.html)*      | * While Vue computed fields have a similar caching ability to pure Angular pipes, they can also have setters rather than just being used as a data pipe |
| [`[ngClass]="{'active': isActive}"`](https://angular.io/api/common/NgClass) | No special API - `className={}` as with any other prop       | [`v-bind:class="{ active: isActive }"`](https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax) |                                                              |
| `@ViewChild`                                                 | `React.Children`                                             | `ref`/`$vm.refs`                                             |                                                              |
| [`ngContent`](https://angular.io/guide/content-projection)   | `this.props.children`                                        | `slot`                                                       |                                                              |
| [`event.emit(value)`](https://angular.io/guide/component-interaction#parent-listens-for-child-event) | Child function pass*                                         | [`$emit('event', val)`](https://vuejs.org/v2/guide/components.html#Emitting-a-Value-With-an-Event) | *This goes much more inline with the `raise state` logic that React pushes very hard - and is probably the main reason for this |
| `ng-container`                                               | [Fragments](https://reactjs.org/docs/fragments.html)         | Vue 2: BYOF - Bring your own fragments<br />Vue 3: `<template>` |                                                              |
| Class props                                                  | [`state = {}`](https://reactjs.org/docs/state-and-lifecycle.html)/[`useState`](https://reactjs.org/docs/hooks-state.html) | [`data`](https://vuejs.org/v2/guide/instance.html#Data-and-Methods)/`useRef`/`reactive` |                                                              |
| Angular Universal/ScullyIO*                                  | Next.JS\*/Gatsby\*                                           | Nuxt.JS\*                                                    | \* These are unofficial solutions but are the most  popular versions of these concepts |
| `Output`(?). Classes sorta handle this for free              | `forwardRef`                                                 | [`expose`](https://v3.vuejs.org/api/composition-api.html#setup) |                                                              |
| `ngAfterViewChecked`*                                        | useEffect with no dep                                        | `updated` lifecycle method                                   | * More like "when every diff is checked"                     |



# Differences:


|                  | Angular          | React                                | Vue                                                          |
| ---------------- | ---------------- | ------------------------------------ | ------------------------------------------------------------ |
| Change Detection | Zones (`ZoneJS`) | Maniually State Calling (`setState`) | `getters` and `setters` (`Object.definedProperty` v2/`Proxy` v3) |
|                  |                  |                                      |                                                              |

https://github.com/angular/angular/issues/22587
