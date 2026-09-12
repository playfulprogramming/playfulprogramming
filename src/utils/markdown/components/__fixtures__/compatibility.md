# Comment-component migration baseline

The frozen `legacy-parse-components.ts` is only used by migration tests. It retains
the old publishing parser so tests can compare normalized HAST and rendering,
without loading both implementations in a production pipeline.

The initial inventory found 366 component-bearing Markdown files under `content/`
and the framework field guide assets. Ranged components were `no-ebook` (1,212),
`tabs` (513), `link-preview` (69), `only-ebook` (29), `filetree` (26), `snitip` (19),
`mermaid` (10), `quiz-radio` (5), and `quiz` (1). Standalone components were `user`
(221) and `in-content-ad` (86). Counts include literal examples. Attributes in this
corpus are `id`, `title`, `body`, `button-text`, `button-href`, and `tags`.

Successful legacy behavior includes different-name nesting, raw HTML inside a
range, HTML-normalized attributes, and component comments only at the document
root or directly in another component. Comments inside ordinary elements,
blockquotes, and lists are not components. Fenced and inline code stay literal.

Known legacy bugs are not successful compatibility cases: same-name nesting uses
the first closing comment without counting depth; missing or noncanonical closing
comments can cause the splice loop to insert nodes indefinitely. The baseline
tests intentionally do not execute those hanging inputs. The native grammar must
test and document their safe recovery separately.
