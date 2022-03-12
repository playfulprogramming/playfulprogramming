import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from "remark-rehype";
import { rehypeTabs } from "utils/markdown/plugins/tabs/tabs";
import rehypeStringify from "rehype-stringify";

test("headers are tabified", (done) => {
  unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypeTabs, {})
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
          "<tabs><tab-list><tab data-tabname=\\"english\\">English</tab><tab data-tabname=\\"french\\">French</tab><tab data-tabname=\\"italian\\">Italian</tab></tab-list><tab-panel data-tabname=\\"english\\">
          <p>Hello!</p>
          </tab-panel><tab-panel data-tabname=\\"french\\">
          <p>Bonjour!</p>
          </tab-panel><tab-panel data-tabname=\\"italian\\">
          <p>Bonjour!</p>
          <!-- tabs:end --></tab-panel></tabs>"
        `);
        done();
      }
    );
});

test("sub-headers are not tabified", (done) => {
  unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypeTabs, {})
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(
      `
<!-- tabs:start -->

#### English

Hello!

##### A note about English

Something!

#### French

Bonjour!

#### Italian

Bonjour!

<!-- tabs:end -->
    `,
      function (err, file) {
        expect(err).toBeNull();
        expect(file?.value).toMatchInlineSnapshot(`
          "<tabs><tab-list><tab data-tabname=\\"english\\">English</tab><tab data-tabname=\\"french\\">French</tab><tab data-tabname=\\"italian\\">Italian</tab></tab-list><tab-panel data-tabname=\\"english\\">
          <p>Hello!</p>
          <h5>A note about English</h5>
          <p>Something!</p>
          </tab-panel><tab-panel data-tabname=\\"french\\">
          <p>Bonjour!</p>
          </tab-panel><tab-panel data-tabname=\\"italian\\">
          <p>Bonjour!</p>
          <!-- tabs:end --></tab-panel></tabs>"
        `);
        done();
      }
    );
});

test("tabs can have custom IDs", (done) => {
  unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypeTabs, { tabSlugifyProps: { enableCustomId: true } })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(
      `
<!-- tabs:start -->

#### English {#test}

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
          "<tabs><tab-list><tab data-tabname=\\"test\\">English</tab><tab data-tabname=\\"french\\">French</tab><tab data-tabname=\\"italian\\">Italian</tab></tab-list><tab-panel data-tabname=\\"test\\">
          <p>Hello!</p>
          </tab-panel><tab-panel data-tabname=\\"french\\">
          <p>Bonjour!</p>
          </tab-panel><tab-panel data-tabname=\\"italian\\">
          <p>Bonjour!</p>
          <!-- tabs:end --></tab-panel></tabs>"
        `);
        done();
      }
    );
});
