---
{
  title: "Writing Modern JavaScript without a Bundler",
  description: "",
  published: "2024-11-18T21:52:59.284Z",
  tags: ["javascript", "webdev"],
  license: "cc-by-4",
}
---


- JSDoc + TypeScript + ESLint
- "HMR"
- Import maps
- CDNs
- PNPM vendor install path
- node_modules aliasing
- Tooling choices
- Bundling deps w/ many files to single ESM file (lol)



## Incompatible Modules

While many libraries are properly packaged to be bundled in a single ESM file, others are not. Let's take `dayjs` as an example:

```shell
pnpm install dayjs
```

This gives us a `src/vendor` folder that looks like this:

<!-- ::start:filetree -->

- `esm/`
	- `locale/`
		- `en.js`
		- `es.js`
		- `fr.js`
		- `...`
	- `plugin/`
	- `constant.js`
	- `index.d.ts`
	- `index.js`
	- `utils.js`
- `locale`
- `CHANGELOG.md`
- `dayjs.min.js`
- `index.d.ts`
- `package.json`
- `README.md`

<!-- ::end:filetree -->

## Framework Support

<!-- ::start:tabs -->

### Angular

Not possible without a compiler to bundle the template.

### React

Technically possible to use without JSX:

```
React.createElement(Element, propsObject, childrenArray)
```

// TODO: Add iframe

But it's not a pretty API at scale; practically infeasible.

### Vue

- Cannot use SFCs
- Must add components via `components: {}` property

### Lit

- Cannot use decorators, must be replaced with `static get` properties
- Must call `customElements.define` manually

<!-- ::end:tabs -->

