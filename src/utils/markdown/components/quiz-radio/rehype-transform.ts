import { QuizRadioOption } from "components/quiz-radio/quiz-radio";
import { RehypeFunctionComponent } from "../types";
import {
	findLargestHeading,
	isNodeHeading,
	isNodeLargestHeading,
} from "../utils/headings";
import { getHeaderNodeId } from "rehype-slug-custom-id";
import { Element, Text } from "hast";
import { toString } from "hast-util-to-string";
import {
	ComponentMarkupNode,
	createComponent,
	isComponentMarkup,
	PlayfulRoot,
} from "../components";
import { toHtml } from "hast-util-to-html";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Adds question-num and total-num attributes onto each quiz-radio node in the document.
 */
export const rehypeQuizIndexes: Plugin<[], PlayfulRoot> = () => {
	return (tree, _) => {
		const quizComponents: ComponentMarkupNode[] = [];
		visit(tree, isComponentMarkup, (node) => {
			if (node.component === "quiz-radio") {
				quizComponents.push(node);
			}
		});

		quizComponents.forEach((node, i) => {
			node.attributes["question-num"] = String(i + 1);
			node.attributes["total-num"] = String(quizComponents.length);
		});
	};
};

export const transformQuizRadio: RehypeFunctionComponent = ({
	children,
	attributes,
}) => {
	// Setup
	const largestSize = findLargestHeading(children as Element[]);

	// QuizRadioProps
	const options: QuizRadioOption[] = [];
	let questionId = "";
	const localChildren = [] as Element[];
	let title = "";

	for (const child of children as Element[]) {
		if (isNodeHeading(child) && isNodeLargestHeading(child, largestSize)) {
			// TODO: Does not need to run `getHeaderNodeId` since it's a heading and this should have already occurred
			const { id } = child.properties;
			questionId = id as string;
			title = toString(child);
			continue;
		}

		if (child.type === "element" && child.tagName === "ul") {
			if (options.length !== 0) {
				continue;
			}

			for (const option of child.children as Element[]) {
				if (option.type !== "element" && option.tagName !== "li") {
					continue;
				}
				const innerText = option.children[0] as Text;
				// We want `rawLabel` to start with `( )` or `(x)` to indicate the radio button and it's correctness or not
				// If it is not, we assume this `ul` is not a quiz radio option list and don't want to transform it
				const match = /^\((.)\) (.*)$/.exec(innerText.value);
				if (!match) {
					localChildren.push(child);
					break;
				}
				const correct = match[1] === "x";
				// Remove the `( )` or `(x)` from the label
				innerText.value = match[2];
				const { id: value } = getHeaderNodeId(option, {
					enableCustomId: true,
				});
				const labelHtml = toHtml(option.children);
				options.push({ id: value, labelHtml, isCorrect: correct });
			}

			if (options.length !== 0) {
				continue;
			}
		}

		localChildren.push(child);
	}

	return [
		createComponent("QuizRadio", {
			title,
			options,
			questionNum: Number(attributes["question-num"]),
			totalNum: Number(attributes["total-num"]),
		}),
	];
};
