---
{
    title: 'Vue Composition API Inspector',
    description: 'A peek under the hood of Vue compilation. See how Vue interpretes TypeScript',
    published: '2022-07-30T09:30:00.000Z',
    edited: '2022-07-30T09:30:00.000Z',
    tags: ['webdev', 'vue'],
    license: 'cc-by-nc-nd-4'
}
---

I've recently been upgrading a Vue 2 JavaScript project using the [Options API](https://vuejs.org/guide/introduction.html#options-api) for single file components to Vue 3 typescript and taking advantage of the [Composition API](https://vuejs.org/guide/introduction.html#composition-api).

For example going from this Options API:

```js
export default {
  props: {
    name: {
      type: String,
      required: true.
    }
  },
  emits: ['someEvent', 'increaseBy']
};
```

to this Composition API:

```ts
 const props = defineProps<{
  name: string;
 }>();

 const emit = defineEmits<{
  (event: 'someEvent): void;
  (event: 'increaseBy', value: number): void;
 }>();
```

Some of conversions from the `emits` and `props` options of the Options API to the `defineEmits` and `defineProps` functions [type-based syntax](https://vuejs.org/guide/typescript/composition-api.html) of the Composition API were not straightforward. I was also curious about how Vue handled interfaces.TypeScript interfaces are constructs that only exists during design time and compile time. They are stripped away when traspiled before the JavaScript runtime so how do they effect the behavior of the component? Spoiler alert, it's just `{ type: Object }`.

I wondered if there was a way to see how Vue interpreted the generic parameters passed to `defineEmits` and `defineProps`. If you notice the docs say you don't need to import the `defineEmits` and `defineProps` functions. This is because they are actually [macros](https://github.com/vuejs/core/blob/a95554d35c65e5bfd0bf9d1c5b908ae789345a6d/packages/compiler-sfc/src/compileScript.ts#L58-L62) for the JavaScript functions of the same name. Before the full TypeScript pass is done the Vue webpack plugin uses TypeScript's AST (abstract syntax tree) to derive the options for JavaScript version of the functions.

> If you're not familiar with what an AST is, [we have an article that explains it here.](/posts/how-computers-speak#ast)

If it weren't for the macro:

```ts
  defineProps<{
    prop1: string;
    prop2: number;
  }>();
```

would just become:

```js
  defineProps();
```

resulting in an error for missing parameters.

If you look at Vue's SFC (single file component) compiler source, there is a function called [`compileScript`](https://github.com/vuejs/core/blob/a95554d35c65e5bfd0bf9d1c5b908ae789345a6d/packages/compiler-sfc/src/compileScript.ts#L141). I started out trying to call this function with the minimum number of parameters that wouldn't error, mocking any required parameters that weren't important. Eventually I found an other function called [`parse`](https://github.com/vuejs/core/blob/a95554d35c65e5bfd0bf9d1c5b908ae789345a6d/packages/compiler-sfc/src/parse.ts#L96). That gave me most of the parameters I needed leaving only the component id left to mock.

What I came up with is a little script that will take a .vue file of the SFC and spit out how Vue interpretes the TypeScript.


```js
import { readFile, writeFile } from "fs";
import parseArgs from "minimist";
import { parse, compileScript } from "@vue/compiler-sfc";

const { file, out } = parseArgs(process.argv.slice(2), {
  string: ["file", "out"],
  alias: {
    file: "f",
    out: "o"
  }
});

const filename = file;
const mockId = "xxxxxxxx";

readFile(filename, "utf8", (err, data) => {
  const { descriptor } = parse(data, {
    filename
  });
  const { content } = compileScript(descriptor, {
    inlineTemplate: true,
    templateOptions: {
      filename
    },
    id: mockId
  });

  if (out) {
    writeFile(out, "utf8", content);
  } else {
    process.stdout.write(content);
  }
});
```

> Try for yourself [here](https://stackblitz.com/edit/node-fzuykn?file=index.js)

For example the following component:

```ts
  interface Bar {
    prop1: string;
    prop2: number;
  }

  defineProps<{
    bar: Bar;
    bars: Bar[];
    asdf1?: boolean;
    asdf2: string[];
  }>();
```

outputs:

```ts
interface Bar {
    prop1: string;
    prop2: number;
  }


export default /*#__PURE__*/_defineComponent({
  __name: 'demo',
  props: {
    bar: { type: Object, required: true },
    bars: { type: Array, required: true },
    asdf1: { type: Boolean, required: false },
    asdf2: { type: Array, required: true }
  },
  setup(__props: any) {




return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div"))
}
}
```

As you see the SFC compiler takes the TypeScript type info and builds the prop objects. Primatives are one to one. Interfaces are Objects and the `?` optional syntax drives the `required` property.
