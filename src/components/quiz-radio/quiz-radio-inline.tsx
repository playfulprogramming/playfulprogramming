import { useCallback, useMemo, useState } from "preact/hooks";
import { QuizRadio, QuizRadioOption } from "./quiz-radio";
import { useStore } from "@nanostores/preact";
import { $quizState } from "./atom";
import { ComponentChildren } from "preact";

export interface QuizRadioInlineProps {
	id: string;
	quizId?: string;
	title: string;
	options: QuizRadioOption[];
	questionNum: number;
	totalNum: number;
	isIndividualSubmit?: boolean;
	children?: ComponentChildren;
}

export function QuizRadioInline(props: QuizRadioInlineProps) {
	// isQuestionSubmitted = true if the question was submitted individually (from the submit button within the component)
	const [isQuestionSubmitted, setSubmitted] = useState(false);
	const quizState = useStore($quizState);
	const questionState = useMemo(() => {
		return quizState.selectedAnswers.get(props.id);
	}, [quizState.selectedAnswers, props.id]);

	// isQuizSubmitted = true if the overall quiz was submitted (from quiz-results.tsx)
	const isQuizSubmitted = useMemo(() => {
		return props.quizId ? quizState.submittedQuizzes.has(props.quizId) : false;
	}, [quizState.submittedQuizzes, props.quizId]);
	const isSubmitted = isQuestionSubmitted || isQuizSubmitted;

	const handleChange = useCallback(
		(answer: string) => {
			const selectedAnswers = new Map(quizState.selectedAnswers);
			const isCorrect = props.options.find(
				(opt) => opt.id === answer,
			)?.isCorrect;

			selectedAnswers.set(props.id, {
				selectedAnswer: answer,
				isCorrect: !!isCorrect,
				isIncorrect: !isCorrect,
			});
			$quizState.set({ ...quizState, selectedAnswers });
		},
		[quizState, props.options, props.id],
	);

	const handleSubmit = useCallback(() => {
		setSubmitted(true);
	}, [setSubmitted]);

	const options = useMemo(() => {
		return props.options.map((option) => ({
			...option,
			isCorrect: isSubmitted && option.isCorrect,
			isIncorrect:
				isSubmitted &&
				option.id === questionState?.selectedAnswer &&
				!option.isCorrect,
			explanation: isSubmitted
				? option.isCorrect
					? option.id === questionState?.selectedAnswer
						? "You got it!"
						: "The correct answer"
					: option.id === questionState?.selectedAnswer
						? "You answered"
						: undefined
				: undefined,
		}));
	}, [props.options, isSubmitted, questionState?.selectedAnswer]);

	return (
		<QuizRadio
			id={props.id}
			title={props.title}
			options={options}
			questionNum={props.questionNum}
			totalNum={props.totalNum}
			value={questionState?.selectedAnswer}
			isDisabled={isSubmitted}
			onChange={handleChange}
			onSubmit={
				props.isIndividualSubmit === false || isSubmitted
					? undefined
					: handleSubmit
			}
			children={isSubmitted ? props.children : undefined}
		/>
	);
}
