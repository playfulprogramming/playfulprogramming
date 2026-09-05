# Component Storybook

Storybook covers selected `.astro` and `.tsx` components with colocated
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

All stories appear under `components`, regardless of renderer. Use readable display
names with spaces (such as `Radio Button Group` and `X Embed`) and omit the
`Placeholder` suffix from story titles.

Stories use Storybook's CSF Next factory API: `preview.type`, `preview.meta`, and
`meta.story`. Astro stories import the default `.storybook/preview.ts` export.
Preact stories import its named `preactPreview` export; it composes the official
Preact renderer so state, events, and Controls work in the browser. Both exports
come from the main preview file because Storybook's factory indexer requires it.

Astro stories use component-owned props, either exported `Props` or Astro's
`ComponentProps`. The additional `slots` argument transports default and named
slot HTML. Preact stories derive their args from `ComponentProps` and use small
stateful demos when a component requires a controller or parent context.

Shared sample content lives in `fixtures.ts`. Sample avatars and the collection
cover use `unicorn_happy.svg`, shared from the site's emote assets. Image previews,
post banners, video thumbnails, and community content use the community illustration;
embedded frames use local `srcDoc` content or `about:blank`. External links remain
links, and no story starts a WebContainer or calls an application backend.

## Coverage and interactions

- Buttons, inputs, selection controls, cards, tooltips, and embeds include default
  examples and relevant disabled, selected, expanded, or content variants.
- Radio buttons and options render in their required groups and lists. Tabs include
  their panels. Pagination updates local state without leaving Storybook.
- Snitips demonstrates the full interaction alongside the standalone Snitip Dialog
  and Snitip Content stories. It hardcodes the inline references emitted by
  [SnitipLink.tsx](../src/utils/markdown/snitip-link/SnitipLink.tsx) and loads the
  same styles and interaction script as
  [snitip-template.astro](../src/utils/markdown/components/snitip/snitip-template.astro). Its two references
  share a dialog and support hover, click, keyboard navigation, dismissal, and focus
  restoration. Resize the Canvas to try the mobile modal layout.
- Dialog examples have open/close controls. File picking, resizable code
  panels, quiz submission, and results can be exercised directly.
- Layouts and script-only Astro components use small fixtures in `fixtures/`.
  The theme sidebar includes its trigger, and heading links include article headings.

The preview imports the site's global tokens and typography. `site-integration.ts`
adds Preact and the site's Astro icons to the adapter's isolated render server.
Its Storybook environment uses direct image URLs, avoiding the production image
CDN and the development-only `/_image` endpoint. The main preview build uses the
same environment. `astro-scripts.ts` bundles hoisted component scripts and repairs
the adapter’s static script URLs. `astro-styles.ts` preserves frontmatter
stylesheet imports omitted by the adapter’s browser stubs. The heading-link story
initializes each render directly and uses the Markdown pipeline's heading markup
for hover and keyboard focus styles. Sass receives the site's `src` alias and `SASS_PATH`.

## Adapter boundaries

CSF Next is a preview API, and the Astro adapter is community-supported. Static
Astro stories are prerendered with their default args; Controls cannot rerender
those stories after deployment. Preact stories remain interactive in static builds.

Some Astro components use fixed document IDs, document-level listeners, or
persisted appearance/tab preferences. View those demos individually in Canvas.
Script lifecycle behavior should also be checked on the actual site, especially
when navigating between stories without a full iframe reload. Theme and tab
preferences persist on the Storybook origin, as they do on the site.
