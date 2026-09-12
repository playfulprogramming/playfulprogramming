import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolve } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug-custom-id";
import { remarkCommentComponents } from "mdast-comment-components";
import { VFile } from "vfile";
import type { MarkdownVFile } from "../types.ts";
import type { PlayfulRoot } from "./components.ts";
import { componentToHast } from "./component-to-hast.ts";
import { remarkComponentDiagnostics } from "./remark-component-diagnostics.ts";
import { rehypeValidateComponents } from "./rehype-validate-components.ts";
import { rehypeTransformComponents } from "./rehype-transform-components.ts";
import { rehypeQuizIndexes, transformQuiz } from "./quiz/rehype-transform.ts";
import { transformQuizRadio } from "./quiz/rehype-transform-quiz-radio.ts";
import { rehypeCodeEmbed } from "./code-embed/rehype-transform.ts";

vi.mock("./components.ts", () => ({
	createComponent: (component: string, props: object, children = []) => ({
		type: "playful-component",
		component,
		props,
		children,
	}),
	isComponentMarkup: (node: { type?: string }) =>
		node?.type === "playful-component-markup",
	isComponentNode: (node: { type?: string }) =>
		node?.type === "playful-component",
}));
vi.mock("#src/constants/env/index.ts", () => ({ default: { CI: false } }));
vi.mock("./code-embed/code-embed-shiki.ts", () => ({ codeToHtml: vi.fn() }));

function file(source: string): MarkdownVFile {
	return new VFile({
		value: source,
		path: resolve("content/test/posts/component-validation/index.md"),
		data: {
			kind: "post",
			file: "index.md",
			warnings: [],
			headingIds: [],
			tableOfContents: [],
			snitips: new Map(),
		},
	}) as MarkdownVFile;
}

function processor() {
	return unified()
		.use(remarkParse)
		.use(remarkCommentComponents)
		.use(remarkComponentDiagnostics)
		.use(remarkToRehype, {
			allowDangerousHtml: true,
			handlers: { playfulComponent: componentToHast },
		})
		.use(rehypeRaw, { passThrough: ["playful-component-markup"] });
}

function question(title: string) {
	return `<!-- ::start:quiz-radio -->\n\n## ${title}\n\n- (x) **Correct**\n- ( ) Incorrect\n\n<!-- ::end:quiz-radio -->`;
}

describe("native component publishing validation", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.spyOn(console, "log").mockImplementation(() => {});
	});

	it("preserves quiz ancestry, heading IDs, option markup and individual submit behavior", async () => {
		const source = `<!-- ::start:quiz -->\n\n${question("First question")}\n\n${question("Second question")}\n\n<!-- ::end:quiz -->\n\n${question("Individual question")}`;
		const vfile = file(source);
		const pipeline = processor()
			.use(rehypeSlug)
			.use(rehypeQuizIndexes)
			.use(rehypeValidateComponents)
			.use(rehypeTransformComponents, {
				components: {
					quiz: transformQuiz,
					"quiz-radio": transformQuizRadio,
				},
			});
		const tree = (await pipeline.run(
			pipeline.parse(vfile),
			vfile,
		)) as PlayfulRoot;
		const quiz = tree.children.find(
			(node) =>
				node.type === "playful-component" && node.component === "QuizResults",
		);
		expect(quiz).toMatchObject({
			props: {
				quizId: "quiz-1",
				questionIds: ["first-question", "second-question"],
			},
		});
		if (quiz?.type !== "playful-component")
			throw new Error("Missing quiz output");
		const questions = quiz.children.filter(
			(node) => node.type === "playful-component",
		);
		expect(questions).toMatchObject([
			{
				component: "QuizRadio",
				props: {
					id: "first-question",
					quizId: "quiz-1",
					questionNum: 1,
					totalNum: 2,
					isIndividualSubmit: false,
				},
			},
			{
				component: "QuizRadio",
				props: {
					id: "second-question",
					quizId: "quiz-1",
					questionNum: 2,
					totalNum: 2,
					isIndividualSubmit: false,
				},
			},
		]);
		expect(questions[0]).toMatchObject({
			props: {
				options: [
					{ labelHtml: "<strong>Correct</strong>", isCorrect: true },
					{ labelHtml: "Incorrect", isCorrect: false },
				],
			},
		});
		expect(
			tree.children.find(
				(node) =>
					node.type === "playful-component" && node.component === "QuizRadio",
			),
		).toMatchObject({
			props: {
				id: "individual-question",
				questionNum: 1,
				totalNum: 1,
				isIndividualSubmit: true,
			},
		});
		expect(vfile.data.headingIds).toEqual(
			expect.arrayContaining([
				"first-question",
				"second-question",
				"individual-question",
			]),
		);
		expect(vfile.data.warnings).toEqual([]);
	});

	it("keeps pfp-code iframes as synthetic component producers inside native ranges", async () => {
		const vfile = file(
			'<!-- ::start:tabs -->\n\n<iframe data-frame-title="Project" src="pfp-code:./project?file=src%2Findex.ts"></iframe>\n\n<!-- ::end:tabs -->',
		);
		const pipeline = processor()
			.use(rehypeCodeEmbed)
			.use(rehypeValidateComponents);
		const tree = (await pipeline.run(
			pipeline.parse(vfile),
			vfile,
		)) as PlayfulRoot;
		const tabs = tree.children.find(
			(node) => node.type === "playful-component-markup",
		);
		if (tabs?.type !== "playful-component-markup")
			throw new Error("Missing tabs");
		expect(
			tabs.children.find((node) => node.type === "playful-component-markup"),
		).toMatchObject({
			component: "code-embed",
			attributes: {
				projectDir: resolve("content/test/posts/component-validation/project"),
				post: "component-validation",
				project: "project",
				title: "Project",
				file: "src/index.ts",
			},
		});
		expect(vfile.data.warnings).toEqual([]);
	});

	it("still rejects synthetic components under ordinary HTML elements", async () => {
		const vfile = file('<div><iframe src="pfp-code:./project"></iframe></div>');
		const pipeline = processor()
			.use(rehypeCodeEmbed)
			.use(rehypeValidateComponents);
		await expect(pipeline.run(pipeline.parse(vfile), vfile)).rejects.toThrow();
		expect(vfile.data.warnings[0].message).toContain(
			"Component code-embed cannot be placed in element",
		);
	});

	it("leaves unknown names to the publishing transform map", async () => {
		const vfile = file("<!-- ::unknown-component -->");
		const pipeline = processor().use(rehypeTransformComponents, {
			components: {},
		});
		expect(pipeline.parse(vfile).children[0]).toMatchObject({
			type: "playfulComponent",
			component: "unknown-component",
		});
		await expect(pipeline.run(pipeline.parse(vfile), vfile)).rejects.toThrow();
		expect(vfile.data.warnings[0].message).toBe(
			"Unknown markdown component unknown-component",
		);
	});

	it.each([
		["<!-- ::start:tabs\n\nUnrelated content", "invalid-marker"],
		["<!-- ::start:tabs -->\n\nUnrelated content", "missing-close"],
		["<!-- ::end:tabs -->\n\nUnrelated content", "unexpected-close"],
		[
			"<!-- ::start:tabs -->\n\n<!-- ::end:user -->\n\nUnrelated content\n\n<!-- ::end:tabs -->",
			"mismatched-close",
		],
	])(
		"reports parser diagnostics through VFile and prevents malformed publication: %s",
		async (source, ruleId) => {
			const vfile = file(source);
			const pipeline = processor();
			const tree = pipeline.parse(vfile);
			expect(JSON.stringify(tree)).toContain("Unrelated content");
			expect(tree.data?.commentComponentDiagnostics?.[0]).toMatchObject({
				ruleId,
			});
			await expect(pipeline.run(tree, vfile)).rejects.toThrow(
				"Cannot publish malformed Markdown components",
			);
			expect(vfile.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						source: "mdast-comment-components",
						ruleId,
					}),
				]),
			);
			expect(vfile.data.warnings[0]).toMatchObject({ col: 1 });
			expect(vfile.data.warnings[0].message).toBe(
				tree.data!.commentComponentDiagnostics![0].message,
			);
		},
	);
});
