import { useCallback, useMemo } from "preact/hooks";
import style from "./quiz-results.module.scss";
import { Button } from "#components/button/button";
import QuizIcon from "#src/icons/quiz.svg?raw";
import CorrectIcon from "#src/icons/correct.svg?raw";
import IncorrectIcon from "#src/icons/incorrect.svg?raw";
import { RawSvg } from "#components/image/raw-svg";

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

	const remainingNum = useMemo(
		() => props.questions.filter((q) => !q.isAnswered).length,
		[props.questions],
	);
	const correctNum = useMemo(
		() => props.questions.filter((q) => q.isCorrect).length,
		[props.questions],
	);
	const incorrectNum = useMemo(
		() => props.questions.filter((q) => q.isIncorrect).length,
		[props.questions],
	);
	const correctPercentage = useMemo(
		() => `${Math.round((100 * correctNum) / props.questions.length)}%`,
		[correctNum, props.questions.length],
	);

	return (
		<div class={`${style.container} markdownCollapsePadding`}>
			<div class={style.questionSummary}>
				<span class={style.questionCount}>
					<RawSvg icon={QuizIcon} />
					<span class="text-style-button-regular">
						{props.questions.length} questions
					</span>
				</span>
				{props.isSubmitted ? (
					<>
						<span class={style.answerCount}>
							<RawSvg icon={CorrectIcon} />
							<span class="text-style-button-regular">{correctNum}</span>
						</span>
						<span class={style.answerCount}>
							<RawSvg icon={IncorrectIcon} />
							<span class="text-style-button-regular">{incorrectNum}</span>
						</span>
					</>
				) : (
					<span class={`${style.remaining} text-style-button-regular`}>
						{remainingNum} remaining
					</span>
				)}
			</div>
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
			<div class={style.content}>
				{props.isSubmitted ? (
					<p class={`${style.prompt} text-style-headline-5`}>
						You scored {correctNum} out of {props.questions.length} (
						{correctPercentage})!
					</p>
				) : (
					<>
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
					</>
				)}
			</div>
		</div>
	);
}
