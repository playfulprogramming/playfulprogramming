import { useCallback, useMemo } from "preact/hooks";
import style from "./quiz-results.module.scss";
import { Button } from "#components/button/button.tsx";
import QuizIcon from "#src/icons/quiz.svg?raw";
import CorrectIcon from "#src/icons/correct.svg?raw";
import IncorrectIcon from "#src/icons/incorrect.svg?raw";
import { RawSvg } from "#components/image/raw-svg.tsx";
import type { Translate } from "#utils/translations.ts";
import type { Languages } from "#types/index.ts";

export interface QuizQuestion {
	isAnswered: boolean;
	isCorrect: boolean;
	isIncorrect: boolean;
}

export interface QuizResultsProps {
	translate: Translate;
	locale: Languages;
	questions: QuizQuestion[];
	isSubmitted?: boolean;
	isDisabled?: boolean;
	onSubmit?(): void;
}

export function QuizResults(props: QuizResultsProps) {
	const numberFormatter = useMemo(
		() => new Intl.NumberFormat(props.locale),
		[props.locale],
	);
	const percentFormatter = useMemo(
		() =>
			new Intl.NumberFormat(props.locale, {
				style: "percent",
				maximumFractionDigits: 0,
			}),
		[props.locale],
	);
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
		() => percentFormatter.format(correctNum / props.questions.length),
		[correctNum, percentFormatter, props.questions.length],
	);

	return (
		<div class={`${style.container} markdownCollapsePadding`}>
			<div class={style.questionSummary}>
				<span class={style.questionCount}>
					<RawSvg icon={QuizIcon} />
					<span class="text-style-button-regular">
						{props.translate(
							props.questions.length === 1
								? "quiz.questions_one"
								: "quiz.questions_other",
							numberFormatter.format(props.questions.length),
						)}
					</span>
				</span>
				{props.isSubmitted ? (
					<>
						<span class={style.answerCount}>
							<RawSvg icon={CorrectIcon} />
							<span class="text-style-button-regular">
								{numberFormatter.format(correctNum)}
							</span>
						</span>
						<span class={style.answerCount}>
							<RawSvg icon={IncorrectIcon} />
							<span class="text-style-button-regular">
								{numberFormatter.format(incorrectNum)}
							</span>
						</span>
					</>
				) : (
					<span class={`${style.remaining} text-style-button-regular`}>
						{props.translate(
							remainingNum === 1
								? "quiz.remaining_one"
								: "quiz.remaining_other",
							numberFormatter.format(remainingNum),
						)}
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
						{props.translate(
							"quiz.score",
							numberFormatter.format(correctNum),
							numberFormatter.format(props.questions.length),
							correctPercentage,
						)}
					</p>
				) : (
					<>
						<p class={`${style.prompt} text-style-headline-5`}>
							{props.translate("quiz.ready_for_results")}
						</p>
						<Button
							tag="button"
							variant="primary-emphasized"
							disabled={props.isDisabled}
							onClick={handleSubmit}
							class={style.submit}
						>
							{props.translate("action.submit")}
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
