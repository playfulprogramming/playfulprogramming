---
{
  title: "Framework Comparison Table",
  description: "Let's compare and contrast React, Angular, and Vue's APIs all in one place.",
  published: "2024-03-11T12:16:00.000Z",
  authors: ["crutchcorn"],
  tags: ["react", "angular", "vue", "webdev"],
  attached: [],
  order: 16,
  collection: "framework-field-guide-fundamentals",
  version: "v2",
}
---

We've looked at a lot of APIs in this series! Here's a cheatsheet for all the APIs we've covered to this point:

<!-- ::in-content-ad title="Consider supporting" body="Donating any amount will help towards further development of the Framework Field Guide." button-text="Sponsor my work" button-href="https://github.com/sponsors/crutchcorn/" -->

<!-- ::start:no-ebook -->

<div class="table-overflow">

| React                                                              | Angular                                                                         | Vue                                                                                 | Notes & Link                                                                                                            |
|--------------------------------------------------------------------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `function Comp() {}`                                               | `@Component() class Comp {}`                                                    | `Comp.vue` SFC file                                                                 | [Creates a component.](/posts/ffg-fundamentals-intro-to-components#parts-of-app)                                        |
| `createRoot(el).render(<Comp/>)`                                   | `bootstrapApplication(Component)`                                               | `createApp(Comp).mount('el')`                                                       | [Renders the component.](/posts/ffg-fundamentals-intro-to-components#rendering-app)                                     |
| Component function body                                            | Class instance properties and methods                                           | `<script setup>`                                                                    | [Where your JavaScript code goes.](/posts/ffg-fundamentals-intro-to-components#logic)                                   |
| `useEffect` with empty array                                       | `ngOnInit`                                                                      | `onMounted`                                                                         | [Side effect on component mount.](/posts/ffg-fundamentals-intro-to-components#side-effects)                             |
| `<p>{val}</p>`                                                     | `<p>{{val}}</p>`                                                                | `<p>{{val}}</p>`                                                                    | [Interpolate `val` into your template. This live-updates.](/posts/ffg-fundamentals-intro-to-components#display)         |
| `useState`                                                         | Class properties                                                                | `ref`                                                                               | [State in a component.](/posts/ffg-fundamentals-intro-to-components#reactivity)                                         |
| `<div attr={val}>`                                                 | `<div [attr.attr]="val">`                                                       | `<div v-bind:attr="val">` **or** `<div :attr="val">`                                | [Attribute binding to an element. This live-updates.](/posts/ffg-fundamentals-intro-to-components#attr-binding)         |
| `function Comp(props) {}`                                          | `@Input()`                                                                      | `defineProps(['prop'])`                                                             | [Component input definition.](/posts/ffg-fundamentals-intro-to-components#inputs)                                       |
| `<div prop={val}>`                                                 | `<div [prop]="val">`                                                            | `<div v-bind:prop="val">` **or** `<div :prop="val">`                                | [Component input passing](/posts/ffg-fundamentals-intro-to-components#inputs)                                           |
| `<div onEvent={fn}>`                                               | `<div (event)="fn()">`                                                          | `<div v-on:event="fn()">` **or** `<div @event="fn()">`                              | [DOM event binding](/posts/ffg-fundamentals-intro-to-components#event-binding)                                          |
| Pass a function as component property.                             | `@Output()`                                                                     | `defineEmits(['output'])`                                                           | [Component output definition.](/posts/ffg-fundamentals-intro-to-components#outputs)                                     |
| `{bool && <div>}`                                                  | `@if (bool) {<div>}`                                                            | `<div v-if="bool">`                                                                 | [Conditional render an element.](/posts/ffg-fundamentals-dynamic-html#conditional-rendering)                            |
| `{bool ? <div/> : <div/>}`                                         | `@else {}`                                                                      | `<div v-else>`                                                                      | [Conditionally render with an "else" clause.](/posts/ffg-fundamentals-dynamic-html#conditional-branch)                  |
| Multiple conditionals with different values.                       | `@else if (other) {}` **or** `@switch` & `@case`                                | `<div v-else-if="other">`                                                           | [Conditional render with multiple "else" clauses.](/posts/ffg-fundamentals-dynamic-html#expanded-branches)              |
| `{list.map(item => <div></div>)}`                                  | `@for (item of list) {<div>}`                                                   | `<div v-for="item in list">`                                                        | [Rendering a list.](/posts/ffg-fundamentals-dynamic-html#rendering-lists)                                               |
| `{list.map((item, idx) => <div></div>)}`                           | `@for (item of list; let idx = $index) {<div>}`                                 | `<div v-for="(item, idx) in list">`                                                 | [Get an index in a list render.](/posts/ffg-fundamentals-dynamic-html#rendering-lists)                                  |
| `<div key={item.id}>`                                              | `@for (item of list; track item.id) {<div>}`                                    | `<div :key="item.id">`                                                              | [Using a key to distinguish element in a list.](/posts/ffg-fundamentals-dynamic-html#keys)                              |
| `<div key={item.id}>`                                              | N/A                                                                             | `<div :key="item.id">`                                                              | [Using a key as a render hint.](/posts/ffg-fundamentals-dynamic-html#keys-as-hints)                                     |
| Return function from a `useEffect` with an empty dependency array. | `ngOnDestroy`                                                                   | `onUnmounted` **or** `watchEffect` cleanup function **or** `watch` cleanup function | [Side effect cleanup on component unmount.](/posts/ffg-fundamentals-side-effects#unmounting)                            |
| `<StrictMode>`                                                     | N/A                                                                             | N/A                                                                                 | [API to ensure side effect cleanup](/posts/ffg-fundamentals-side-effects#ensuring-effect-cleanup)                       |
| `useEffect` with no second argument                                | N/A                                                                             | `onUpdated`                                                                         | [Listen for re-renders.](/posts/ffg-fundamentals-side-effects#re-renders)                                               |
| `useEffect` with an array of values to track                       | Trigger side effect on mutation function                                        | `watch` **or** `watchEffect`                                                        | [In-component data change side effects.](/posts/ffg-fundamentals-side-effects#in-comp-prop-side-effect)                 |
| `useLayoutEffect` to run before paint                              | N/A due to lack of VDOM                                                         | `watch` with `{immediate: true}` and/or `{flush: "post"}`                           | [Render/paint/commit phase tracking](/posts/ffg-fundamentals-side-effects#rendering-committing-painting)                |
| `useRef`                                                           | `ngZone.runOutsideAngular`                                                      | `let` variable mutation                                                             | [Change data without a re-render](/posts/ffg-fundamentals-side-effects#changing-data-without-rendering)                 |
| `useEffect` with `useRef` of previous value                        | `ngOnChanges`                                                                   | `watch` with old and new value arguments                                            | [Listen for component property changes](/posts/ffg-fundamentals-derived-values#prop-listening)                          |
| `useMemo`                                                          | `@Pipe()`                                                                       | `computed`                                                                          | [Property-based computed values](/posts/ffg-fundamentals-derived-values#computed-values)                                |
| `<Fragment>` **or** `<></>`                                        | `<ng-container>`                                                                | `<template>`                                                                        | [Transparent elements](/posts/ffg-fundamentals-transparent-elements)                                                    |
| `children` property with a JSX value                               | `<ng-content>`                                                                  | `<slot>`                                                                            | [Children injection site](/posts/ffg-fundamentals-passing-children#passing-basic-children)                              |
| Named properties with a JSX value                                  | `<ng-content select="name">`                                                    | `<slot name="name" />`                                                              | [Named children injection site](/posts/ffg-fundamentals-passing-children#named-children)                                |
| `const refName = useRef()` & `<div ref={refName}>`                 | `@ViewChild()`                                                                  | `const refName = ref()` & `<div ref="refName">`                                     | [Element reference that doesn't trigger reactive change](/posts/ffg-fundamentals-element-reference#basic-el-references) |
| `<div ref={fn}>`                                                   | `@ViewChild()` with `ngAfterViewInit`                                           | `<div :ref="fn">`                                                                   | [Element reference that triggers reactive change](/posts/ffg-fundamentals-element-reference#basic-el-references)        |
| `useRef([])` & `<div ref={el => ref.current[i] = el}>`             | `@ViewChildren()`                                                               | `ref([])` & `ref="refName"`                                                         | [Array of element references](/posts/ffg-fundamentals-element-reference#array-of-elements)                              |
| `forwardRef`                                                       | N/A                                                                             | N/A                                                                                 | [Allow access to a custom component](/posts/ffg-fundamentals-component-reference#introducing-component-reference)       |
| `useImperativeHandle`                                              | All methods and properties from the referenced component are exposed by default | `defineExpose`                                                                      | [Allow access to component's internals](/posts/ffg-fundamentals-component-reference#introducing-component-reference)    |
| `componentDidCatch`                                                | `ErrorHandler`                                                                  | `onErrorCaptured`                                                                   | [Log an error](/posts/ffg-fundamentals-error-handling#logging-errors)                                                   |
| `getDerivedStateFromError`                                         | `ErrorHandler` + parent state                                                   | `onErrorCaptured` + `ref`                                                           | [Display an error](/posts/ffg-fundamentals-error-handling#displaying-the-error)                                         |
| `createContext`                                                    | `InjectionToken` **or** `Injectable`                                            | N/A                                                                                 | [Dependency injection context creation](/posts/ffg-fundamentals-dependency-injection#basic-values)                      |
| `Context.Provider`                                                 | `providers` array on class                                                      | `provide`                                                                           | [Dependency injection data provider](/posts/ffg-fundamentals-dependency-injection#basic-values)                         |
| `useContext`                                                       | `inject`                                                                        | `inject`                                                                            | [Dependency injection data injection](/posts/ffg-fundamentals-dependency-injection#basic-values)                        |
| Enabled by default                                                 | `inject(SomeVal, {optional: true})`                                             | Enabled by default                                                                  | [Optional injected values](/posts/ffg-fundamentals-dependency-injection#optional-injected-values)                       |
| `Context.Provider` in root component                               | `@Injectable({ providedIn: "root" })`                                           | `provide` in root component                                                         | [App-wide providers](/posts/ffg-fundamentals-dependency-injection#app-wide-providers)                                   |
| `createPortal(<div/>, el)`                                         | `DomPortal` **or** `TemplatePortal` & `cdkPortalOutlet`                         | `<Teleport to="body">`                                                              | [Portal contents to other DOM location](/posts/ffg-fundamentals-portals)                                                |
| Custom Hooks                                                       | Services                                                                        | Compositions                                                                        | [Logic sharing between components](/posts/ffg-fundamentals-shared-component-logic)                                      |
| N/A                                                                | `@Directive()`                                                                  | Object with special properties                                                      | [Directives](/posts/ffg-fundamentals-directives)                                                                        |
| `children` property and single value passed                        | `@ContentChild()`                                                               | N/A                                                                                 | [Access a reference to a single projected child](/posts/ffg-fundamentals-accessing-children)                            |
| `Children.toArray(children)`                                       | `@ContentChildren()`                                                            | N/A                                                                                 | [Access a reference to projected children](/posts/ffg-fundamentals-accessing-children)                                  |
| `Children.count(children)`                                         | `@ContentChildren()` & `length` property                                        | N/A                                                                                 | [Count projected children](/posts/ffg-fundamentals-accessing-children#counting-comp-children)                           |
| `children(val)`                                                    | `ng-template` & Template Context                                                | `<template>` & `v-slot`                                                             | [Pass values to projected children](/posts/ffg-fundamentals-accessing-children#passing-values-to-projected-content)     |

</div>

<!-- ::end:no-ebook -->

<!-- ::start:only-ebook -->

<div class="table-overflow">
<table>
<thead>
<tr>
<th>React</th>
<th>Angular</th>
<th>Vue</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>function Comp() {}</code></td>
<td><code>@Component() class Comp {}</code></td>
<td><code>Comp.vue</code> SFC file</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#parts-of-app"
>Creates a component.</a
>
</td>
</tr>

<tr>
<td><code>createRoot(el).render(&#x3C;Comp/>)</code></td>
<td><code>bootstrapApplication(Component)</code></td>
<td><code>createApp(Comp).mount('el')</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#rendering-app"
>Renders the component.</a
>
</td>
</tr>

<tr>
<td>Component function body</td>
<td>Class instance properties and methods</td>
<td><code>&#x3C;script setup></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#logic"
>Where your JavaScript code goes.</a
>
</td>
</tr>

<tr>
<td><code>useEffect</code> with empty array</td>
<td><code>ngOnInit</code></td>
<td><code>onMounted</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#side-effects"
>Side effect on component mount.</a
>
</td>
</tr>

<tr>
<td><code>&#x3C;p>{val}&#x3C;/p></code></td>
<td><code>&#x3C;p>{{val}}&#x3C;/p></code></td>
<td><code>&#x3C;p>{{val}}&#x3C;/p></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#display"
>Interpolate <code>val</code> into your template. This
live-updates.</a
>
</td>
</tr>

<tr>
<td><code>useState</code></td>
<td>Class properties</td>
<td><code>ref</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#reactivity"
>State in a component.</a
>
</td>
</tr>

<tr>
<td><code>&#x3C;div attr={val}></code></td>
<td><code>&#x3C;div [attr.attr]="val"></code></td>
<td>
<code>&#x3C;div v-bind:attr="val"></code> <strong>or</strong>
<code>&#x3C;div :attr="val"></code>
</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#attr-binding"
>Attribute binding to an element. This live-updates.</a
>
</td>
</tr>

<tr>
<td><code>function Comp(props) {}</code></td>
<td><code>@Input()</code></td>
<td><code>defineProps(['prop'])</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#inputs"
>Component input definition.</a
>
</td>
</tr>

<tr>
<td><code>&#x3C;div prop={val}></code></td>
<td><code>&#x3C;div [prop]="val"></code></td>
<td>
<code>&#x3C;div v-bind:prop="val"></code> <strong>or</strong>
<code>&#x3C;div :prop="val"></code>
</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#inputs"
>Component input passing</a
>
</td>
</tr>

<tr>
<td><code>&#x3C;div onEvent={fn}></code></td>
<td><code>&#x3C;div (event)="fn()"></code></td>
<td>
<code>&#x3C;div v-on:event="fn()"></code> <strong>or</strong>
<code>&#x3C;div @event="fn()"></code>
</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#event-binding"
>DOM event binding</a
>
</td>
</tr>

<tr>
<td>Pass a function as component property.</td>
<td><code>@Output()</code></td>
<td><code>defineEmits(['output'])</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-intro-to-components#outputs"
>Component output definition.</a
>
</td>
</tr>

<tr>
<td><code>{bool &#x26;&#x26; &#x3C;div>}</code></td>
<td><code>@if (bool) {&#x3C;div>}</code></td>
<td><code>&#x3C;div v-if="bool"></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dynamic-html#conditional-rendering"
>Conditional render an element.</a
>
</td>
</tr>

<tr>
<td><code>{bool ? &#x3C;div/> : &#x3C;div/>}</code></td>
<td>
<code>@else {&#x3C;div>}</code>
</td>
<td><code>&#x3C;div v-else></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dynamic-html#conditional-branch"
>Conditionally render with an "else" clause.</a
>
</td>
</tr>

<tr>
<td>Multiple conditionals with different values.</td>
<td><code>@else if (other) {}</code> <strong>or</strong> <code>@switch</code> &#x26; <code>@case</code></td>
<td><code>&#x3C;div v-else-if="other"></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dynamic-html#expanded-branches"
>Conditional render with multiple "else" clauses.</a
>
</td>
</tr>

<tr>
<td><code>{list.map(item => &#x3C;div>&#x3C;/div>)}</code></td>
<td><code>@for (item of list) {&#x3C;div>}</code></td>
<td><code>&#x3C;div v-for="item in list"></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dynamic-html#rendering-lists"
>Rendering a list.</a
>
</td>
</tr>

<tr>
<td><code>{list.map((item, idx) => &#x3C;div>&#x3C;/div>)}</code></td>
<td><code>@for (item of list; let i = $index) {&#x3C;div>}</code></td>
<td><code>&#x3C;div v-for="(item, idx) in list"></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dynamic-html#rendering-lists"
>Get an index in a list render.</a
>
</td>
</tr>

<tr>
<td><code>&#x3C;div key={item.id}></code></td>
<td><code>@for (item of list; track item.id) {&#x3C;div>}</code></td>
<td><code>&#x3C;div :key="item.id"></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dynamic-html#keys"
>Using a key to distinguish element in a list.</a
>
</td>
</tr>

<tr>
<td><code>&#x3C;div key={item.id}></code></td>
<td>N/A</td>
<td><code>&#x3C;div :key="item.id"></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dynamic-html#keys-as-hints"
>Using a key as a render hint.</a
>
</td>
</tr>

<tr>
<td>
Return function from a <code>useEffect</code> with an empty dependency
array.
</td>
<td><code>ngOnDestroy</code></td>
<td>
<code>onUnmounted</code> <strong>or</strong>
<code>watchEffect</code> cleanup function <strong>or</strong>
<code>watch</code> cleanup function
</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-side-effects#unmounting"
>Side effect cleanup on component unmount.</a
>
</td>
</tr>

<tr>
<td><code>&#x3C;StrictMode></code></td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-side-effects#ensuring-effect-cleanup"
>API to ensure side effect cleanup</a
>
</td>
</tr>

<tr>
<td><code>useEffect</code> with no second argument</td>
<td>N/A</td>
<td><code>onUpdated</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-side-effects#re-renders"
>Listen for re-renders.</a
>
</td>
</tr>

<tr>
<td><code>useEffect</code> with an array of values to track</td>
<td>Trigger side effect on mutation function</td>
<td><code>watch</code> <strong>or</strong> <code>watchEffect</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-side-effects#in-comp-prop-side-effect"
>In-component data change side effects.</a
>
</td>
</tr>

<tr>
<td><code>useLayoutEffect</code> to run before paint</td>
<td>N/A due to lack of VDOM</td>
<td>
<code>watch</code> with <code>{immediate: true}</code> and/or
<code>{flush: "post"}</code>
</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-side-effects#rendering-committing-painting"
>Render/paint/commit phase tracking</a
>
</td>
</tr>

<tr>
<td><code>useRef</code></td>
<td><code>ngZone.runOutsideAngular</code></td>
<td><code>let</code> variable mutation</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-side-effects#changing-data-without-rendering"
>Change data without a re-render</a
>
</td>
</tr>

<tr>
<td><code>useEffect</code> with <code>useRef</code> of previous value</td>
<td><code>ngOnChanges</code></td>
<td><code>watch</code> with old and new value arguments</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-derived-values#prop-listening"
>Listen for component property changes</a
>
</td>
</tr>

<tr>
<td><code>useMemo</code></td>
<td><code>@Pipe()</code></td>
<td><code>computed</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-derived-values#computed-values"
>Property-based computed values</a
>
</td>
</tr>

<tr>
<td>
<code>&#x3C;Fragment></code> <strong>or</strong>
<code>&#x3C;>&#x3C;/></code>
</td>
<td><code>&#x3C;ng-container></code></td>
<td><code>&#x3C;template></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-transparent-elements"
>Transparent elements</a
>
</td>
</tr>

<tr>
<td><code>children</code> property with a JSX value</td>
<td><code>&#x3C;ng-content></code></td>
<td><code>&#x3C;slot></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-passing-children#passing-basic-children"
>Children injection site</a
>
</td>
</tr>

<tr>
<td>Named properties with a JSX value</td>
<td><code>&#x3C;ng-content select="name"></code></td>
<td><code>&#x3C;slot name="name" /></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-passing-children#named-children"
>Named children injection site</a
>
</td>
</tr>

<tr>
<td>
<code>const refName = useRef()</code> &#x26;
<code>&#x3C;div ref={refName}></code>
</td>
<td><code>@ViewChild()</code></td>
<td>
<code>const refName = ref()</code> &#x26;
<code>&#x3C;div ref="refName"></code>
</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-element-reference#basic-el-references"
>Element reference that doesn't trigger reactive change</a
>
</td>
</tr>

<tr>
<td><code>&#x3C;div ref={fn}></code></td>
<td><code>@ViewChild()</code> with <code>ngAfterViewInit</code></td>
<td><code>&#x3C;div :ref="fn"></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-element-reference#basic-el-references"
>Element reference that triggers reactive change</a
>
</td>
</tr>

<tr>
<td>
<code>useRef([])</code> &#x26;
<code>&#x3C;div ref={el => ref.current[i] = el}></code>
</td>
<td><code>@ViewChildren()</code></td>
<td><code>ref([])</code> &#x26; <code>ref="refName"</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-element-reference#array-of-elements"
>Array of element references</a
>
</td>
</tr>

<tr>
<td><code>forwardRef</code></td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-component-reference#introducing-component-reference"
>Allow access to a custom component</a
>
</td>
</tr>

<tr>
<td><code>useImperativeHandle</code></td>
<td>
All methods and properties from the referenced component are exposed by
default
</td>
<td><code>defineExpose</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-component-reference#introducing-component-reference"
>Allow access to component's internals</a
>
</td>
</tr>

<tr>
<td><code>componentDidCatch</code></td>
<td><code>ErrorHandler</code></td>
<td><code>onErrorCaptured</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-error-handling#logging-errors"
>Log an error</a
>
</td>
</tr>

<tr>
<td><code>getDerivedStateFromError</code></td>
<td><code>ErrorHandler</code> + parent state</td>
<td><code>onErrorCaptured</code> + <code>ref</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-error-handling#displaying-the-error"
>Display an error</a
>
</td>
</tr>

<tr>
<td><code>createContext</code></td>
<td>
<code>InjectionToken</code> <strong>or</strong> <code>Injectable</code>
</td>
<td>N/A</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dependency-injection#basic-values"
>Dependency injection context creation</a
>
</td>
</tr>

<tr>
<td><code>Context.Provider</code></td>
<td><code>providers</code> array on class</td>
<td><code>provide</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dependency-injection#basic-values"
>Dependency injection data provider</a
>
</td>
</tr>

<tr>
<td><code>useContext</code></td>
<td><code>inject</code></td>
<td><code>inject</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-dependency-injection#basic-values"
>Dependency injection data injection</a
>
</td>
</tr>

<tr>
<td>Enabled by default</td>
<td><code>inject(SomeVal, {optional: true})</code></td>
<td>Enabled by default</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-dependency-injection#optional-injected-values"
>Optional injected values</a
>
</td>
</tr>

<tr>
<td><code>Context.Provider</code> in root component</td>
<td><code>@Injectable({ providedIn: "root" })</code></td>
<td><code>provide</code> in root component</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-dependency-injection#app-wide-providers"
>App-wide providers</a
>
</td>
</tr>

<tr>
<td><code>createPortal(&#x3C;div/>, el)</code></td>
<td>
<code>DomPortal</code> <strong>or</strong>
<code>TemplatePortal</code> &#x26; <code>cdkPortalOutlet</code>
</td>
<td><code>&#x3C;Teleport to="body"></code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-portals"
>Portal contents to other DOM location</a
>
</td>
</tr>

<tr>
<td>Custom Hooks</td>
<td>Services</td>
<td>Compositions</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-shared-component-logic"
>Logic sharing between components</a
>
</td>
</tr>

<tr>
<td>N/A</td>
<td><code>@Directive()</code></td>
<td>Object with special properties</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-directives">Directives</a>
</td>
</tr>
<tr>
<td><code>children</code> property and single value passed</td>
<td><code>@ContentChild()</code></td>
<td>N/A</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-accessing-children"
>Access a reference to a single projected child</a
>
</td>
</tr>

<tr>
<td><code>Children.toArray(children)</code></td>
<td><code>@ContentChildren()</code></td>
<td>N/A</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a href="/posts/ffg-fundamentals-accessing-children"
>Access a reference to projected children</a
>
</td>
</tr>

<tr>
<td><code>Children.count(children)</code></td>
<td>
<code>@ContentChildren()</code> &#x26; <code>length</code> property
</td>
<td>N/A</td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-accessing-children#counting-comp-children"
>Count projected children</a
>
</td>
</tr>

<tr>
<td><code>children(val)</code></td>
<td><code>ng-template</code> &#x26; Template Context</td>
<td><code>&#x3C;template></code> &#x26; <code>v-slot</code></td>
</tr>
<tr>
<td colspan="3">
<strong>Note:</strong>
<a
href="/posts/ffg-fundamentals-accessing-children#passing-values-to-projected-content"
>Pass values to projected children</a
>
</td>
</tr>
</tbody>
</table>
</div>

<!-- ::end:only-ebook -->
