# Astro Storybook scope

This is an intentionally small Storybook spike for the site's `.astro`
components. It uses Storybook's CSF Next factory API throughout:
`defineMain`, `definePreview`, `preview.meta`, and `meta.story`.
Story args use explicit contracts because the community adapter's renderer type
does not yet infer `.astro` props on its own, and its compatibility shim prevents
Astro's usual `ComponentProps<typeof Component>` utility from narrowing them.

Run it locally with:

```sh
nvm use
pnpm storybook
```

Build the static Storybook with:

```sh
pnpm build:storybook
```

## Initial coverage

- `achievement-card.astro` is the baseline for serializable object props and
  component-scoped Sass.
- `page-card.astro` covers responsive styles, public assets, and default/named
  slot content.
- `mailing-list.astro` checks that an Astro component can compose the site's
  Preact inputs and buttons.

The preview imports `src/styles/global.scss` because the production site normally
loads those tokens and typography styles through `document.astro`. The
accessibility addon is enabled both in the main config and the CSF Next preview
so its configuration remains type-aware. The Vite config also mirrors the
site's `src` alias, which Sass modules use in their `@use` paths. `SASS_PATH`
bridges that same path into the adapter's isolated static-prerender server, and
the Preact renderer integration lets composed `.tsx` children render there.

## Known boundaries

- CSF Next is still a Storybook preview API.
- The Astro adapter is community-supported. In a static Storybook build, Astro
  stories are pre-rendered with their default args, so Controls are useful in
  development but cannot re-render those stories after deployment.
- Astro component scripts need browser-level coverage; portable server renders
  do not execute their client scripts.
- Prop descriptions and generated Astro usage snippets are currently manual in
  the adapter, so this spike does not attempt full component API documentation.
- `bowtie-button.astro` is deferred until its fixed DOM id and document-level
  listeners are scoped per component instance.
