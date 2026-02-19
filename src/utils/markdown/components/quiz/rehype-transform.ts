import { QuizRadioOption } from "components/quiz-radio/quiz-radio";
import { RehypeFunctionComponent } from "../types";
import {
	findLargestHeading,
	isNodeHeading,
	isNodeLargestHeading,
} from "../utils/headings";
import { getHeaderNodeId } from "rehype-slug-custom-id";
import { Element, ElementContent, Text } from "hast";
import { toString } from "hast-util-to-string";
import {
	ComponentMarkupNode,
	createComponent,
	isComponentMarkup,
	PlayfulNode,
	PlayfulRoot,
} from "../components";
import { toHtml } from "hast-util-to-html";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { isElement } from "utils/markdown/unist-is-element";
import { logError } from "utils/markdown/logger";

/**
 * Adds question-num and total-num attributes onto each quiz-radio node in the document.
 */
export const rehypeQuizIndexes: Plugin<[], PlayfulRoot> = () => {
	return (tree, _) => {
		let quizCount = 0;
		const quizzes: {
			default: {
				quiz?: ComponentMarkupNode;
				questions: ComponentMarkupNode[];
			};
			[key: string]: {
				quiz?: ComponentMarkupNode;
				questions: ComponentMarkupNode[];
			};
		} = {
			default: { questions: [] },
		};

		visit(tree, isComponentMarkup, (node, _, parent) => {
			if (node.component === "quiz") {
				node.attributes.id = `quiz-${++quizCount}`;
			}
			if (node.component === "quiz-radio") {
				if (isComponentMarkup(parent) && parent.component === "quiz") {
					const quizData = quizzes[parent.attributes.id];
					quizzes[parent.attributes.id] = {
						quiz: parent,
						questions: [...(quizData?.questions ?? []), node],
					};
				} else {
					quizzes.default.questions.push(node);
				}
			}
		});

		Object.entries(quizzes).forEach(([quizId, quizData], i) => {
			const questionIds: string[] = [];
			quizData.questions.forEach((question, questionIndex) => {
				const id = `${quizId}-question-${i + questionIndex}`;
				question.attributes["id"] = id;
				question.attributes["question-num"] = String(questionIndex + 1);
				question.attributes["total-num"] = String(quizData.questions.length);
				if (quizId !== "default") {
					question.attributes["quiz-id"] = quizId;
				}
				questionIds.push(id);
			});

			if (quizData.quiz) {
				quizData.quiz.attributes.questions = questionIds.join();
			}
		});
	};
};

export const transformQuizRadio: RehypeFunctionComponent = ({
	vfile,
	node,
	children,
	attributes,
}) => {
	// Setup
	const largestSize = findLargestHeading(children as Element[]);

	// QuizRadioProps
	const options: QuizRadioOption[] = [];
	const quizId = attributes["quiz-id"] || undefined;
	const localChildren: (PlayfulNode | ElementContent)[] = [];
	let title = "";

	for (const child of children) {
		if (
			isElement(child) &&
			isNodeHeading(child) &&
			isNodeLargestHeading(child, largestSize)
		) {
			title = toString(child);
			continue;
		}

		if (
			child.type === "element" &&
			child.tagName === "ul" &&
			options.length == 0
		) {
			for (const option of child.children) {
				if (!isElement(option)) continue;
				if (option.tagName !== "li") continue;

				const innerText = option.children.find((c) => c.type === "text");
				if (!innerText) continue;

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

	if (options.length === 0) {
		logError(vfile, node, "Quiz radio must contain a valid list!");
		return [];
	}

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

export const transformQuiz: RehypeFunctionComponent = ({
	children,
	attributes,
}) => {
	return [
		createComponent(
			"QuizResults",
			{
				quizId: attributes.id,
				questionIds: attributes.questions.split(","),
			},
			children,
		),
	];
};
