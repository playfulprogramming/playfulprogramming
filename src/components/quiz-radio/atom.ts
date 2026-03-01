import { atom } from "nanostores";

export interface QuizQuestion {
	selectedAnswer?: string;
	isCorrect?: boolean;
	isIncorrect?: boolean;
}

interface QuizState {
	selectedAnswers: Map<string, QuizQuestion>;
	submittedQuizzes: Set<string>;
}

export const $quizState = atom<QuizState>({
	selectedAnswers: new Map(),
	submittedQuizzes: new Set(),
});
