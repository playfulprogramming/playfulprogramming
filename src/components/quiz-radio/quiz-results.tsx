import { useCallback } from "preact/hooks";
import style from "./quiz-results.module.scss";
import { Button } from "components/button/button";

export interface QuizQuestion {
	isAnswered: boolean;
	isCorrect: boolean;
	isIncorrect: boolean;
}

export interface QuizResultsProps {
	questions: QuizQuestion[];
	isSubmitted?: boolean;
	isDisabled?: boolean;
	onSubmit?(): void;
}

export function QuizResults(props: QuizResultsProps) {
	const handleSubmit = useCallback(
		(e: Event) => {
			e.preventDefault();
			props.onSubmit?.call(undefined);
		},
		[props.onSubmit],
	);

	return (
		<div class={`${style.container} markdownCollapsePadding`}>
			<div class={style.questionBar}>
				{props.questions.map((question, i) => (
					<span
						key={i}
						class={style.question}
						data-answered={question.isAnswered}
						data-correct={question.isCorrect}
						data-incorrect={question.isIncorrect}
					/>
				))}
			</div>
			<p class={`${style.prompt} text-style-headline-5`}>
				Ready to see your results?
			</p>
			<Button
				tag="button"
				variant="primary-emphasized"
				disabled={props.isDisabled}
				onClick={handleSubmit}
				class={style.submit}
			>
				Submit
			</Button>
		</div>
	);
}
