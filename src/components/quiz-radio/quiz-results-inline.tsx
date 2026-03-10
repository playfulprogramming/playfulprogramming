import { useCallback, useMemo } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { $quizState } from "./atom";
import { QuizQuestion, QuizResults } from "./quiz-results";

export interface QuizResultsInlineProps {
	quizId: string;
	questionIds: string[];
}

export function QuizResultsInline(props: QuizResultsInlineProps) {
	const quizState = useStore($quizState);

	const isSubmitted = useMemo(() => {
		return quizState.submittedQuizzes.has(props.quizId);
	}, [quizState.submittedQuizzes, props.quizId]);

	const handleSubmit = useCallback(() => {
		const submittedQuizzes = new Set(quizState.submittedQuizzes);
		submittedQuizzes.add(props.quizId);
		$quizState.set({ ...quizState, submittedQuizzes });
	}, [quizState, props.quizId]);

	const questions = useMemo<QuizQuestion[]>(() => {
		return props.questionIds.map((questionId) => {
			const questionState = quizState.selectedAnswers.get(questionId);
			return {
				isAnswered: questionState?.selectedAnswer !== undefined,
				isCorrect: (isSubmitted && questionState?.isCorrect) || false,
				isIncorrect: (isSubmitted && questionState?.isIncorrect) || false,
			};
		});
	}, [props.questionIds, quizState.selectedAnswers, isSubmitted]);

	const isDisabled = useMemo(() => {
		return questions.some((q) => !q.isAnswered);
	}, [questions]);

	return (
		<QuizResults
			questions={questions}
			isDisabled={isDisabled}
			isSubmitted={isSubmitted}
			onSubmit={handleSubmit}
		/>
	);
}
