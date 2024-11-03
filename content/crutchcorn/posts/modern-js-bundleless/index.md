---
{
  title: "Writing Modern JavaScript without a Bundler",
  description: "",
  published: "2024-11-18T21:52:59.284Z",
  tags: ["javascript", "webdev"],
  license: "cc-by-4",
}
---





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