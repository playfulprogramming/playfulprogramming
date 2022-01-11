import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from "remark-rehype";
import { rehypeTabs } from "utils/markdown/plugins/tabs";
import rehypeStringify from "rehype-stringify";

test("headers are stringified", (done) => {
  unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypeTabs)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(
      `
<!-- tabs:start -->

#### English

Hello!

#### French

Bonjour!

#### Italian

Bonjour!

<!-- tabs:end -->
    `,
      function (err, file) {
        expect(err).toBeNull();
        expect(file?.value).toMatchInlineSnapshot(`
"<tabs><tab-list><tab>English</tab><tab>French</tab><tab>Italian</tab></tab-list><tab-panel>
<p>Hello!</p>
</tab-panel><tab-panel>
<p>Bonjour!</p>
</tab-panel><tab-panel>
<p>Bonjour!</p>
<!-- tabs:end --></tab-panel></tabs>"
`);
        done();
      }
    );
});
