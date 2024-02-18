---
{
  title: "Framework Comparison Table",
  description: "",
  published: "2024-03-11T12:16:00.000Z",
  authors: ["crutchcorn"],
  tags: ["react", "angular", "vue", "webdev"],
  attached: [],
  order: 16,
  collection: "framework-field-guide-fundamentals",
}
---

We've looked at a lot of APIs in this series! Here's a cheatsheet for all of the APIs we've covered to this point:

| React                                                        | Angular                                                      | Vue                                                          | Notes & Link                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `function Comp() {}`                                         | `@Component() class Comp {}`                                 | `Comp.vue` SFC file                                          | [Creates a component.](/posts/ffg-fundamentals-intro-to-components#parts-of-app) |
| `createRoot(el).render(<Comp/>)`                             | `bootstrapApplication(Component)`                            | `createApp(Comp).mount('el')`                                | [Renders the component.](/posts/ffg-fundamentals-intro-to-components#rendering-app) |
| Component function body                                      | Class instance properties and methods                        | `<script setup>`                                             | [Where your JavaScript code goes.](/posts/ffg-fundamentals-intro-to-components#logic) |
| `useEffect` with empty array                                 | `ngOnInit`                                                   | `onMounted`                                                  | [Side effect on component mount.](/posts/ffg-fundamentals-intro-to-components#side-effects) |
| `<p>{val}</p>`                                               | `<p>{{val}}</p>`                                             | `<p>{{val}}</p>`                                             | [Interpolate `val` into your template. This live-updates.](/posts/ffg-fundamentals-intro-to-components#display) |
| `useState`                                                   | Class properties                                             | `ref`                                                        | [State in a component.](/posts/ffg-fundamentals-intro-to-components#reactivity) |
| `<div attr={val}>`                                           | `<div [attr.attr]="val">`                                    | `<div v-bind:attr="val">` **or** `<div :attr="val">`         | [Attribute binding to an element. This live-updates.](/posts/ffg-fundamentals-intro-to-components#attr-binding) |
| `function Comp(props) {}`                                    | `@Input()`                                                   | `defineProps(['prop'])`                                      | [Component input definition.](/posts/ffg-fundamentals-intro-to-components#inputs) |
| `<div prop={val}>`                                           | `<div [prop]="val">`                                         | `<div v-bind:prop="val">` **or** `<div :prop="val">`         | [Component input passing](/posts/ffg-fundamentals-intro-to-components#inputs) |
| `<div onEvent={fn}>`                                         | `<div (event)="fn()">`                                       | `<div v-on:event="fn()">` **or** `<div @event="fn()">`       | [DOM event binding](/posts/ffg-fundamentals-intro-to-components#event-binding) |
| Pass a function as component property.                       | `@Output()`                                                  | `defineEmits(['output'])`                                    | [Component output definition.](/posts/ffg-fundamentals-intro-to-components#outputs) |
| `{bool && <div>}`                                            | `<div *ngIf="bool">`                                         | `<div v-if="bool">`                                          | [Conditional render an element.](/posts/ffg-fundamentals-dynamic-html#conditional-rendering) |
| `{bool ? <div/> : <div/>}`                                   | `*ngIf="bool; else templ"` where `templ` is an `ng-template` | `<div v-else>`                                               | [Conditionally render with an "else" clause.](/posts/ffg-fundamentals-dynamic-html#conditional-branch) |
| Multiple conditionals with different values.                 | `ngSwitch` and `*ngSwitchCase`                               | `<div v-else-if="other">`                                    | [Conditional render with multiple "else" clauses.](/posts/ffg-fundamentals-dynamic-html#expanded-branches) |
| `{list.map(item => <div></div>)}`                            | `<div *ngFor="let item of list">`                            | `<div v-for="item in list">`                                 | [Rendering a list.](/posts/ffg-fundamentals-dynamic-html#rendering-lists) |
| `{list.map((item, idx) => <div></div>)}`                     | `<div *ngFor="let item of list; let i = index">`             | `<div v-for="(item, idx) in list">`                          | [Get an index in a list render.](/posts/ffg-fundamentals-dynamic-html#rendering-lists) |
| `<div key={item.id}>`                                        | `*ngFor="let item of list; trackBy: itemTrackBy"`            | `<div :key="item.id">`                                       | [Using a key to distinguish element in a list.](/posts/ffg-fundamentals-dynamic-html#keys) |
| `<div key={item.id}>`                                        | N/A                                                          | `<div :key="item.id">`                                       | [Using a key as a render hint.](/posts/ffg-fundamentals-dynamic-html#keys-as-hints) |
| Return function from a `useEffect` with an empty dependency array. | `ngOnDestroy`                                                | `onUnmounted` **or** `watchEffect` cleanup function **or** `watch` cleanup function | [Side effect cleanup on component unmount.](/posts/ffg-fundamentals-side-effects#unmounting) |
| `<StrictMode>`                                               | N/A                                                          | N/A                                                          | [API to ensure side effect cleanup](/posts/ffg-fundamentals-side-effects#ensuring-effect-cleanup) |
| `useEffect` with no second argument                          | N/A                                                          | `onUpdated`                                                  | [Listen for re-renders.](/posts/ffg-fundamentals-side-effects#re-renders) |
| `useEffect` with an array of values to track                 | Trigger side effect on mutation function                     | `watch` **or** `watchEffect`                                 | [In-component data change side effects.](/posts/ffg-fundamentals-side-effects#in-comp-prop-side-effect) |
| `useLayoutEffect` to run before paint                        | N/A due to lack of VDOM                                      | `watch` with `{immediate: true}` and/or `{flush: "post"}`    | [Render/paint/commit phase tracking](/posts/ffg-fundamentals-side-effects#rendering-committing-painting) |
| `useRef`                                                     | `ngZone.runOutsideAngular`                                   | `let` variable mutation                                      | [Change data without a re-render](/posts/ffg-fundamentals-side-effects#changing-data-without-rendering) |
|                                                              |                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |                                                              |
