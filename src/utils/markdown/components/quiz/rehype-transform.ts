import { RehypeFunctionComponent } from "../types";
import {
	ComponentMarkupNode,
	createComponent,
	isComponentMarkup,
	PlayfulRoot,
} from "../components";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

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
				const id = `${quizId}-question-${questionIndex + 1}`;
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

export const transformQuiz: RehypeFunctionComponent = ({
	children,
	attributes,
}) => {
	return [
		createComponent(
			"QuizResults",
			{
				quizId: attributes.id,
				questionIds: attributes.questions?.split(",") ?? [],
			},
			children,
		),
	];
};
