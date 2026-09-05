import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { QuizResults } from "./quiz-results.tsx";

const meta = preview.type<{ args: ComponentProps<typeof QuizResults> }>().meta({
	title: "Components/QuizResults",
	component: QuizResults,
	args: {
		questions: [
			{ isAnswered: true, isCorrect: true, isIncorrect: false },
			{ isAnswered: true, isCorrect: false, isIncorrect: true },
		],
		isSubmitted: true,
	},
});
export const Default = meta.story({});
export const Unanswered = meta.story({
	args: {
		isSubmitted: false,
		isDisabled: true,
		questions: [{ isAnswered: false, isCorrect: false, isIncorrect: false }],
	},
});
