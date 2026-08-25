# Astro Storybook scope

This is an intentionally small Storybook spike for the site's `.astro`
components. It uses Storybook's CSF Next factory API throughout:
`defineMain`, `definePreview`, `preview.meta`, and `meta.story`.
Each story imports the component's exported `Props` contract and supplies it to
`preview.type`, because the community adapter's renderer does not yet infer
`.astro` props on its own. `page-card` adds only the Storybook-specific `slots`
transport to that component-owned type.

Run it locally with:

```sh
nvm use
pnpm storybook
```

Build the static Storybook with:

```sh
pnpm build:storybook
```

## Visual regression screenshots

The initial visual-regression spike uses
`storybook-addon-playwright`'s screenshot definitions and comparison engine,
with Playwright Test providing the test process and Storybook dev-server
lifecycle. Run all committed comparisons with:

```sh
pnpm test:storybook
```

Intentionally replace the baselines after reviewing a visual change with:

```sh
pnpm test:storybook:update
```

The update command is the only command that should write baselines. A normal
test first checks that every expected baseline exists, then fails on any image
whose pixels or dimensions differ. Both commands start and stop Storybook
automatically; an already-running server on port 6006 is reused outside CI.

Screenshot settings live beside their CSF files as
`*.stories.playwright.json`, and baselines live in the adjacent
`__screenshots__` directory. The PNGs are tracked by Git LFS. New visual
coverage has three steps:

1. Add a named story for the visual state. Astro stories are pre-rendered, so
   each state should be an exported story rather than an args override stored
   only in the screenshot JSON.
2. Add that story ID and one or more browser settings to the adjacent
   `*.stories.playwright.json` file.
3. Run `pnpm test:storybook:update`, review the PNG, and commit the definition
   and baseline together.

The current seven screenshots cover every initial story in Chromium at
1280×800, plus the Page Card long-content story at a 390×844 mobile viewport.
They force light color scheme, CSS-pixel scale, hidden carets, and disabled
animations, and wait for fonts and images before capture.

## Initial coverage

- `achievement-card.astro` is the baseline for serializable object props and
  component-scoped Sass.
- `page-card.astro` covers responsive styles, public assets, and default/named
  slot content.
- `mailing-list.astro` checks that an Astro component can compose the site's
  Preact inputs and buttons.

The preview imports `src/global.scss` because the production site normally
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
- `storybook-addon-playwright` 7.15 officially targets Storybook 8, Playwright
  1.59, and React. This project uses Storybook 10, Playwright 1.60, and Astro.
  Storybook therefore prints a compatibility warning when these tests start.
- The add-on's manager panel cannot be registered here: its Storybook 8 bundle
  aborts Storybook 10 startup with `__STORYBOOK_COMPONENTS__ is not defined`.
  The server-side capture and diff engine works through the compatibility
  adapter in `playwright-config.cjs`; remove that adapter when the add-on gains
  native Storybook 10 support.
- Comparisons currently use the add-on's exact-pixel default. This is stricter
  than the existing page screenshots' `maxDiffPixels: 150` allowance.
- Browser screenshots are platform-sensitive. Before making this a required CI
  job, regenerate and commit the baselines in the same pinned Linux/Playwright
  image CI will use. Keep the existing e2e job until equivalent page-level,
  light/dark, and cross-browser stories exist.
