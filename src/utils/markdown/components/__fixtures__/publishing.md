# Publishing compatibility

Read the [local definition](pfp-snitip:#native).

<!-- ::start:snitip id="native" -->

## Native parsing

The parser understands the component's **Markdown** body.

- [Reference](https://example.com/native)

<!-- ::end:snitip -->

<!-- ::start:tabs -->

## JavaScript {#js-tab}

### A nested heading

```js
const result = 1;
```

<!-- ::start:no-ebook -->

Web-only information.

<!-- ::end:no-ebook -->

## TypeScript

![Relative image](./image.png)

[Relative download](./publishing.md)

<details><summary>More information</summary><p>Expanded in EPUB.</p></details>

<!-- ::end:tabs -->

<!-- ::start:filetree -->
- `src/{open: false}`
  - **`index.ts`** Entry point
<!-- ::end:filetree -->

<!-- ::start:mermaid -->
```mermaid
flowchart LR
    A --> B
```
<!-- ::end:mermaid -->

<!-- ::start:only-ebook -->

Ebook-only information.

<!-- ::end:only-ebook -->

<!-- ::user id="crutchcorn" -->

[Image preview ![Preview](./image.png)](https://example.com/preview)

<details><summary>Details outside tabs</summary><p>Some details.</p></details>
