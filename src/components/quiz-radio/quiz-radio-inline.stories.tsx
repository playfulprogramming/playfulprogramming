import { preactPreview as preview } from "../../../.storybook/preview.ts";
import { QuizRadioInline as Question } from "./quiz-radio-inline.tsx";

import { QuizResultsInline as Results } from "./quiz-results-inline.tsx";
import { $quizState } from "./atom.ts";
import { quizOptions } from "../../../.storybook/fixtures.ts";
import { useEffect, useId } from "preact/hooks";
function Demo() {
	const id = useId();
	useEffect(
		() => () => {
			$quizState.set({
				selectedAnswers: new Map(),
				submittedQuizzes: new Set(),
			});
		},
		[],
	);
	return (
		<>
			<Question
				id={`${id}-question`}
				quizId={id}
				title="Which element is best for an action?"
				questionNum={1}
				totalNum={1}
				options={quizOptions}
				isIndividualSubmit={false}
			/>
			<Results quizId={id} questionIds={[`${id}-question`]} />
		</>
	);
}
const meta = preview.type<{ args: Record<string, never> }>().meta({
	title: "Components/QuizRadioInline",
	component: Demo,
	args: {},
	render: () => <Demo />,
});
export const Default = meta.story({});
