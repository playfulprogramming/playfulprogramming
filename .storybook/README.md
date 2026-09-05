# Component Storybook

Visual `.astro` and `.tsx` components under `src/components` have colocated
story files. Related exports from the same file (such as button sizes, tab panels,
file lists, and code preview states) are demonstrated together. Types, stores,
stylesheets, non-component utilities, SEO metadata components, the Mermaid
renderer, and blocking initialization scripts do not have standalone stories.

```sh
nvm use
pnpm install
pnpm storybook
```

Build the static Storybook with `pnpm build:storybook`.

## Story conventions

Stories use Storybook's CSF Next factory API: `preview.type`, `preview.meta`, and
`meta.story`. Astro stories import the default `.storybook/preview.ts` export.
Preact stories import its named `preactPreview` export; it composes the official
Preact renderer so state, events, and Controls work in the browser. Both exports
come from the main preview file because Storybook's factory indexer requires it.

Astro stories use component-owned props, either exported `Props` or Astro's
`ComponentProps`. The additional `slots` argument transports default and named
slot HTML. Preact stories derive their args from `ComponentProps` and use small
stateful demos when a component requires a controller or parent context.

Shared sample content lives in `fixtures.ts`. Cards use local public artwork;
embedded frames use local `srcDoc` content or `about:blank`. External links remain
links, and no story starts a WebContainer or calls an application backend.

## Coverage and interactions

- Buttons, inputs, selection controls, cards, tooltips, and embeds include default
  examples and relevant disabled, selected, expanded, or content variants.
- Radio buttons and options render in their required groups and lists. Tabs include
  their panels. Pagination updates local state without leaving Storybook.
- Dialog and snitip examples have open/close controls. File picking, resizable code
  panels, quiz submission, and results can be exercised directly.
- Inline quizzes use isolated question IDs and reset their store on unmount.
- Layouts and script-only Astro components use small fixtures in `fixtures/`.
  The theme sidebar includes its trigger, and heading links include article headings.

The preview imports the site's global tokens and typography. `site-integration.ts`
adds Preact and the site's Astro icons to the adapter's isolated render server.
Its Storybook environment uses direct image URLs, avoiding the production image
CDN and the development-only `/_image` endpoint. The main preview build uses the
same environment. `astro-scripts.ts` bundles hoisted component scripts and repairs
the adapter’s static script URLs. `astro-styles.ts` preserves frontmatter
stylesheet imports omitted by the adapter’s browser stubs. The heading-link story also runs its legacy
load-event initialization after the script is ready. Sass receives the site's `src` alias and `SASS_PATH`.

## Adapter boundaries

CSF Next is a preview API, and the Astro adapter is community-supported. Static
Astro stories are prerendered with their default args; Controls cannot rerender
those stories after deployment. Preact stories remain interactive in static builds.

Some Astro components use fixed document IDs, document-level listeners, or
persisted appearance/tab preferences. View those demos individually in Canvas.
Script lifecycle behavior should also be checked on the actual site, especially
when navigating between stories without a full iframe reload. Theme and tab
preferences persist on the Storybook origin, as they do on the site.
