import type { JSXNode } from "components/types";
import { PostInfo, RawPostInfo } from "types/PostInfo";
import { render } from "preact-render-to-string";
import { PostTitleHeader } from "../blog-post/post-title-header/post-title-header";
import dayjs from "dayjs";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { rehypeUnicornElementMap } from "src/utils/markdown/rehype-unicorn-element-map";

// This needs to use a minimal version of our unified chain,
// as we can't import `createRehypePlugins` through an Astro
// file due to the hastscript JSX
const unifiedChain = unified()
	.use(remarkParse, { fragment: true } as never)
	.use(remarkGfm)
	.use(remarkUnwrapImages)
	.use(remarkToRehype, { allowDangerousHtml: true })
	.use(rehypeRaw, { passThrough: [`mdxjsEsm`] })
	.use(rehypeUnicornElementMap)
	.use(rehypeStringify, { allowDangerousHtml: true, voids: [] });

interface PreviewPostProps {
	entry: {
		getIn<T>(path: string[]): T;
	};
	widgetFor(field: string): JSXNode;
}

export function PreviewPost(props: PreviewPostProps) {
	const bodyMarkdown: string = props.entry.getIn(["data", "body"]);
	const bodyHtml = unifiedChain.processSync(bodyMarkdown).toString();

	// this is a hack to access the global React instance provided by decap-cms
	const h = (window as never as { h: (...args: unknown[]) => JSXNode }).h;

	const postRaw: RawPostInfo = {
		title: props.entry.getIn(["data", "title"]),
		published: props.entry.getIn(["data", "published"]),
		authors: props.entry.getIn(["data", "authors"]),
		tags: props.entry.getIn(["data", "tags"]),
		attached: [], // what does this do?
		license: props.entry.getIn(["data", "license"]),
		description: props.entry.getIn(["data", "description"]),
		edited: props.entry.getIn(["data", "edited"]),
		collection: props.entry.getIn(["data", "collection"]),
		order: props.entry.getIn(["data", "order"]),
		originalLink: props.entry.getIn(["data", "originalLink"]),
		noindex: false,
	};

	const post: PostInfo = {
		...postRaw,
		slug: "",
		locales: ["en"],
		locale: "en",
		publishedMeta: dayjs(postRaw.published).format("MMMM D, YYYY"),
		editedMeta: postRaw.edited && dayjs(postRaw.edited).format("MMMM D, YYYY"),
		authorsMeta: postRaw.authors.map(author => ({
			id: author,
			name: author,
			firstName: author,
			lastName: author,
			description: author,
			socials: {},
			profileImg: "",
			color: "",
			roles: [],
			achievements: [],
			rolesMeta: [],
			profileImgMeta: undefined,
		})),
		licenseMeta: undefined,
		socialImg: "",
		wordCount: bodyMarkdown.split(" ").length,
	}

	const html = render(
		<main>
			<PostTitleHeader post={post} />
			<div
				class="post-body"
				dangerouslySetInnerHTML={{ __html: bodyHtml }}
			/>
		</main>
	);

	return h("div", {
		dangerouslySetInnerHTML: { __html: html }
	});
}
