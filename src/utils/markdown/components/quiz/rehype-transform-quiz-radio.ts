import type { QuizRadioOption } from "#components/quiz-radio/quiz-radio.tsx";
import type { RehypeFunctionComponent } from "../types.ts";
import {
	findLargestHeading,
	isNodeHeading,
	isNodeLargestHeading,
} from "../utils/headings.ts";
import { getHeaderNodeId } from "rehype-slug-custom-id";
import type { Element, ElementContent } from "hast";
import { toString } from "hast-util-to-string";
import { type PlayfulNode, createComponent } from "../components.ts";
import { toHtml } from "hast-util-to-html";
import { isElement } from "#utils/markdown/unist-is-element.ts";
import { visit } from "unist-util-visit";

const ALLOWED_OPTION_TAGS = new Set(["em", "strong", "code"]);

export function findTitleNode(
	children: (PlayfulNode | ElementContent)[],
): Element | undefined {
	const largestSize = findLargestHeading(children as Element[]);
	for (const child of children) {
		if (
			isElement(child) &&
			isNodeHeading(child) &&
			isNodeLargestHeading(child, largestSize)
		) {
			return child;
		}
	}
}

export function findListNode(
	children: (PlayfulNode | ElementContent)[],
): Element | undefined {
	for (const child of children) {
		if (isElement(child) && child.tagName === "ul") {
			return child;
		}
	}
}

export const transformQuizRadio: RehypeFunctionComponent = ({
	vfile,
	node,
	children,
	attributes,
}) => {
	const options: QuizRadioOption[] = [];
	const quizId = attributes["quiz-id"] || undefined;

	const titleNode = findTitleNode(children);
	if (!titleNode) {
		vfile.message("Question must contain a title heading.", {
			place: node.position,
			source: "rehype-quiz-radio",
			ruleId: "missing-heading",
		});
		return [];
	}
	const title = toString(titleNode);

	const listNode = findListNode(children);
	if (!listNode) {
		vfile.message("Question must contain a list.", {
			place: node.position,
			source: "rehype-quiz-radio",
			ruleId: "missing-list",
		});
		return [];
	}

	for (const option of listNode.children) {
		if (!isElement(option)) continue;
		if (option.tagName !== "li") continue;

		const innerParagraphEl = option.children.find(
			(c): c is Element => isElement(c) && c.tagName === "p",
		);
		const optionContentEl = innerParagraphEl ?? option;
		const innerText = optionContentEl.children.find((c) => c.type === "text");
		if (!innerText) continue;

		// We want `rawLabel` to start with `( )` or `(x)` to indicate the radio button and it's correctness or not
		const match = /^\(([x ])\) ([\S\s]*)$/.exec(innerText.value);
		if (!match) {
			vfile.message("Radio options must begin with either `( )` or `(x)`", {
				place: option.position,
				source: "rehype-quiz-radio",
				ruleId: "invalid-option",
			});
			return [];
		}
		const correct = match[1] === "x";
		// Remove the `( )` or `(x)` from the label
		innerText.value = match[2];
		const { id: value } = getHeaderNodeId(optionContentEl, {
			enableCustomId: true,
		});

		let isAllowedTagError = false;
		visit(optionContentEl, isElement, (node, _, parent) => {
			if (parent && !ALLOWED_OPTION_TAGS.has(node.tagName)) {
				vfile.message(
					`<${node.tagName}> tags are not permitted in quiz options!`,
					{
						place: node.position,
						source: "rehype-quiz-radio",
						ruleId: "invalid-option-tag",
					},
				);
				isAllowedTagError = true;
			}
		});
		if (isAllowedTagError) continue;

		const labelHtml = toHtml(optionContentEl.children);
		options.push({ id: value, labelHtml, isCorrect: correct });
	}

	if (options.length === 0) {
		vfile.message("Quiz radio must contain a valid list!", {
			place: node.position,
			source: "rehype-quiz-radio",
			ruleId: "empty-list",
		});
		return [];
	}

	const localChildren = children.filter(
		(c) => c !== titleNode && c !== listNode,
	);
	const hasChildren = localChildren.some(
		(child) => child.type != "text" || child.value.trim().length > 0,
	);

	return [
		createComponent(
			"QuizRadio",
			{
				id: attributes.id,
				quizId,
				title,
				options,
				questionNum: Number(attributes["question-num"]),
				totalNum: Number(attributes["total-num"]),
				isIndividualSubmit: quizId === undefined,
			},
			hasChildren ? localChildren : undefined,
		),
	];
};
