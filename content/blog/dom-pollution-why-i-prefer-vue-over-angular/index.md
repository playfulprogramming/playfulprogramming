---
{
    title: 'DOM Pollution, Why I prefer Vue over Angular',
    description: 'See why not all frontend SPA frameworks render the same and what you need to be aware of when using Angular',
    published: '2022-05-24T22:07:20.000Z',
    edited: '2022-05-24T22:07:20.000Z',
    authors: ['splatkillwill'],
    tags: ['webdev', 'angular', 'vue'],
    attached: [],
    license: 'cc-by-nc-nd-4'
}
---

One of the reasons I prefer front end frameworks like Vue and React over Angular, is what I like to call DOM Pollution.

Unlike Vue and React, which use a virtual DOM, Angular today uses incremental rendering. Each has its pros and cons, but without a virtual DOM the components need to be represented in the browser's “real” DOM. Kind of like a trail of breadcrumbs, this lets the renderer know how to get back to what it’s updating.

With a renderer like the one used by Angular, breaking down your UI into reusable components comes at a cost; or at least with a side effect to be aware of. Every component adds another tag to the DOM that otherwise wouldn't be there, unless you made one big ugly monolith component. This can cause some problems:

- Complicates CSS selectors
- Makes SEO crawlers jobs harder
- Can make the markup harder to read when debugging
- Can be limiting when trying to wrap an element that needs to be a direct child of another element

To illustrate, take the following example in Vue:

```html
<template>
  <h1>John Hammond No Expense Report</h1>
  <my-table>
    <my-row>
      <my-header-cell>Category</my-header-cell>
      <my-header-cell>Amount</my-header-cell>
    </my-row>
    <my-row>
      <my-text-cell>Dinosaurs</my-text-cell>
      <my-decimal-cell :value="999999999.99"></my-decimal-cell>
    </my-row>
    <my-row>
      <my-text-cell>Park</my-text-cell>
      <my-decimal-cell :value="999999999.99"></my-decimal-cell>
    </my-row>
    <my-row>
      <my-text-cell>IT</my-text-cell>
      <my-decimal-cell :value="5.27"></my-decimal-cell>
    </my-row>
  </my-table>
</template>
```

Which can produce:

![HTML table with rows and columns](./Capture1.JPG)

Then if you tried the same in Angular:

```html
<div>
  <h1>
    John Hammond No Expense Report
  </h1>
  <my-table>
    <my-row>
      <my-header-cell>Category</my-header-cell>
      <my-header-cell>Amount</my-header-cell>
    </my-row>
    <my-row>
      <my-text-cell>Dinosaurs</my-text-cell>
      <my-decimal-cell [value]="999999999.99"></my-decimal-cell>
    </my-row>
    <my-row>
      <my-text-cell>Park</my-text-cell>
      <my-decimal-cell [value]="999999999.99"></my-decimal-cell>
    </my-row>
    <my-row>
      <my-text-cell>IT</my-text-cell>
      <my-decimal-cell [value]="5.27"></my-decimal-cell>
    </my-row>
  </my-table>
</div>
```

![HTML table with rows and columns messed up](./Capture2.JPG)

What happened? Lets compare the custom components.

MyTextCell.vue
```vue
<template>
  <td>
    <slot></slot>
  </td>
</template>
<script>
export default {
  name: "MyTextCell",
};
</script>
<style scoped>
td {
  border: 1px solid black;
  text-align: left;
}
</style>
```

text-cell.component.ts
```ts
import { Component } from "@angular/core";

@Component({
  selector: "my-text-cell",
  template: `
    <td>
      <ng-content></ng-content>
    </td>
  `,
  styles: [
    `
      td {
        border: 1px solid black;
        text-align: left;
      }
    `
  ]
})
export class MyTextCellComponent {
}
```

They both look like they are just wrapping table detail (cell) tags but they render completely diffrent.

Vue output:

```html
<table>
    <!-- ect -->
    <tr>
        <td data-v-5fa58eab="">IT</td><!-- see here -->
        <td data-v-451cbf87="" style="color: red;">5.27</td>
    </tr>
    <!-- ect -->
</table>
```

Angular output:
```html
<my-table _ngcontent-rbt-c270="" _nghost-rbt-c271="">
    <table _ngcontent-rbt-c271="">
        <!-- ect -->
        <my-row _ngcontent-rbt-c270="" _nghost-rbt-c272="">
            <tr _ngcontent-rbt-c272="">
                <!-- ect -->
                <my-text-cell _ngcontent-rbt-c270="" _nghost-rbt-c274=""><!-- see here -->
                    <td _ngcontent-rbt-c274="">IT</td>
                </my-text-cell>
                <!-- ect -->
            </tr>
        </my-row>
        <!-- ect -->
    </table>
</my-table>
```

So much more going on. This is because, even though the components look like they are doing the same thing, the renderer has, and must, output extra tags. Now this isn't how I'd make a table in Angular and there are ways to address this like using `display: table-cell` and `role` attributes on the host but it could still be a hindrance.

This doesn't mean Angular is all that bad. Actually, the reason Angular components are written this way is to closely resemble a proposed standard; Web Components. 

Speaking of that checkout [Corbin](/unicorns/crutchcorn)'s [series on Web Components](/collections/web-components-101) and also [Angular elements](https://angular.io/guide/elements).
