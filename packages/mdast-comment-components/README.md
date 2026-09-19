# mdast-comment-components

Native Markdown parsing and serialization for HTML-comment components. This
package contains syntax, MDAST types, and optional diagnostic reporting; it does
not depend on a component registry, a renderer, Astro, or the publishing site's
environment.

## Public API

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { remarkCommentComponents } from "mdast-comment-components";

const processor = unified()
	.use(remarkParse)
	.use(remarkCommentComponents)
	.use(remarkStringify);

// Component nodes already exist here; no processor.run() is needed.
const tree = processor.parse('<!-- ::user id="crutchcorn" -->');
const markdown = processor.stringify(tree);
```

The Remark attacher registers `micromarkExtensions`, `fromMarkdownExtensions`, and
`toMarkdownExtensions`. It does not return a tree transformer. The public entry
point also exports:

- `commentComponents()` for micromark syntax recognition.
- `commentComponentsFromMarkdown()` for `mdast-util-from-markdown` compilation.
- `commentComponentsToMarkdown()` for `mdast-util-to-markdown` serialization.
- `remarkComponentDiagnostics` for optional VFile reporting during `run()`.
- `CommentComponent` and `CommentComponentDiagnostic` TypeScript types.
- `RemarkComponentDiagnosticsOptions` for reporting policy and callbacks.

Each extension and the types also have corresponding subpath exports:
`/micromark-extension`, `/from-markdown`, `/to-markdown`, `/remark-components`,
`/remark-component-diagnostics`, and `/types`. Exports point to ESM TypeScript
source. Consumers need a TypeScript-aware runtime or bundler; this initial
workspace package does not ship compiled JavaScript and is not published to npm.

## Syntax and tree

```markdown
<!-- ::start:tabs -->

## First tab

Some **Markdown** content.

<!-- ::user id="crutchcorn" -->

<!-- ::end:tabs -->
```

All names use one node type. Renderability is a separate concern, so an unknown
component name is still representable:

```ts
{
	type: "commentComponent",
	component: "tabs",
	attributes: {},
	form: "ranged",
	children: [/* Markdown blocks, including nested components */],
	position: { /* full source span, including the closing marker */ },
}
```

Standalone components use `form: "standalone"` and have no content children. An
empty ranged component retains `form: "ranged"`. Child positions refer to the
original document, not to an independently parsed body. Standard Markdown and
other registered extensions, such as GFM and math, work inside ranged bodies.

Attributes use the publishing pipeline's normalized HTML properties:
`Record<string, string>`. Names are case-folded, HTML entities decoded, duplicate
attributes keep the first value, arrays join with spaces, and other property
values become strings. For example, `class` becomes `className`, `data-foo`
becomes `dataFoo`, and a present `disabled` becomes `"true"`. Custom hyphenated
names such as `button-text` and `button-href` remain available. Attribute parsing
uses HTML parsing rather than splitting on spaces.

An unquoted final attribute retains HTML parsing's trailing slash:
`<!-- ::custom label=value -->` stores `label: "value/"` because
the marker is parsed as `<custom label=value/>`. Prefer quoted attributes. The
serializer always quotes values, so repeated round trips do not add slashes.

## HAST integration

Configure `remark-rehype` with `passThrough: ["commentComponent"]` to preserve
component metadata while converting its Markdown children to HAST. If the
pipeline uses `rehype-raw`, configure the same `passThrough` option there so raw
HTML inside components is parsed without discarding the component nodes.
No custom MDAST-to-HAST handler is needed. Consumers must render or remove the
component nodes before serializing HAST to HTML.

## Placement and recovery

Markers are block syntax at the document root or directly inside a ranged
component. Zero to three leading spaces are accepted; four spaces form an
indented code block. Markers in lists, blockquotes, ordinary HTML elements,
fenced code, or inline code retain their ordinary Markdown/HTML meaning.
An HTML element can remain open across a Markdown blank line, so putting blank
lines around a marker inside `<div>` does not make it a component.

Adjacent component markers may share a line. A marker line containing other
text or ordinary HTML, such as `<!-- ::user -->Text` or
`<!-- ordinary --><!-- ::user -->`, remains ordinary HTML. Use separate lines
for those forms. A completed HTML element or void tag on the previous line,
such as `<br/>`, does not require a blank line before the component marker.

LF and CRLF are supported, as are multiline attribute lists and surrounding
whitespace inside comments. Closing markers use the same whitespace trimming
and HTML name case folding as openers, so `<!--::end:tabs-->` and
`<!-- ::end:TABS -->` are accepted. Canonical serialization always uses lowercase
names and one space around marker contents. Both same-name and different-name
nesting are supported.

Malformed input is preserved and reported on
`root.data.commentComponentDiagnostics`. Entries contain `ruleId`, `message`,
`severity: "error"`, and the marker's source `position`:

- A missing closer leaves the opening comment as an HTML node and parses its
  following content as ordinary sibling Markdown blocks. If an outer component
  closes while an inner differently named component is unclosed, that inner
  component falls back without consuming the outer closer.
- Unexpected or mismatched closing markers remain HTML comments. A mismatched
  closer does not end the currently open component.
- Invalid component names or closing-marker attributes remain HTML comments
  with an `invalid-marker` diagnostic.
- An unterminated component comment also produces `invalid-marker`. Its opening
  line remains HTML while following lines are parsed as ordinary Markdown;
  unterminated ordinary HTML comments retain CommonMark's behavior.

Parsing itself does not log, throw, or access a VFile. Comments in unsupported
placements do not produce component diagnostics. Consumers choose their
diagnostic policy by reading the entries directly or adding the optional
`remarkComponentDiagnostics` plugin:

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import { VFile } from "vfile";
import {
	remarkCommentComponents,
	remarkComponentDiagnostics,
} from "mdast-comment-components";

const processor = unified()
	.use(remarkParse)
	.use(remarkCommentComponents)
	.use(remarkComponentDiagnostics, {
		fatal: true,
		onDiagnostic(diagnostic, file) {
			// Optional: forward diagnostics to an application's logger or UI.
		},
	});
const file = new VFile("<!-- ::end:example -->");
const tree = processor.parse(file); // Recovers without reporting or throwing.
await processor.run(tree, file); // Reports diagnostics, then throws in fatal mode.
```

The reporting plugin creates a positioned VFile message for every diagnostic,
preserving its message and rule ID with `source: "mdast-comment-components"`.
It then calls `onDiagnostic(diagnostic, file)` synchronously for that entry, if
provided. By default, reporting is nonfatal and processing continues with the
recovered tree. With `fatal: true`, it reports every entry and invokes every
callback before adding a fatal `invalid-components` message and throwing.
The plugin does not modify the tree or emit console output. Attaching it does
not change `parse()` behavior; reporting only happens during `run()` or
`process()`.

## Serialization guarantees

The serializer emits `<!-- ::name ... -->` or paired
`<!-- ::start:name ... -->` / `<!-- ::end:name -->` comments. It uses one space
around marker contents and blank lines around ranged bodies. Empty ranged
components have a blank line between their markers. Attributes are double-quoted;
HTML property names are mapped back to attribute names. Ampersands, quotes, angle
brackets, and line endings in attribute values are encoded as character
references so values cannot end a comment or introduce another marker line.

Children use the surrounding serializer's state, options, and extension handlers.
For supported syntax, `parse → stringify → parse` preserves component names,
normalized attribute values, standalone/ranged form, and Markdown child semantics.
Ordinary comments and literal examples inside code remain ordinary Markdown.
Positions and original formatting are not preserved byte for byte.

## Local development

From the workspace root:

```sh
pnpm --filter mdast-comment-components test
pnpm --filter mdast-comment-components test:watch
pnpm --filter mdast-comment-components typecheck
```

Or run `pnpm test` / `pnpm typecheck` in this directory. Tests use the package's
own Node Vitest configuration and require no site setup, aliases, mocks, browser
plugins, or Paraglide compilation. Dependencies are declared here explicitly.

The root Vitest configuration includes this project once under the name
`mdast-comment-components`; CI also runs the package's TypeScript check separately.
Syntax fixtures are stored in this package, including copied fenced examples
from the site's `FEATURES.md` and the framework field guide's tabs example. They
do not read files outside the package. Site-local HAST and publishing tests
cover HAST conversion, HTML/EPUB behavior, and the content corpus.
