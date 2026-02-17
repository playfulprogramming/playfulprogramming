import { useState } from "preact/hooks";
import { QuizRadio, QuizRadioOption } from "./quiz-radio";

export interface QuizRadioInlineProps {
	title: string;
	options: QuizRadioOption[];
	questionNum: number;
	totalNum: number;
}

export function QuizRadioInline(props: QuizRadioInlineProps) {
	const { title, options } = props;
	const [selectedOption, setSelectedOption] = useState<string>();

	return (
		<QuizRadio
			title={title}
			options={options}
			questionNum={props.questionNum}
			totalNum={props.totalNum}
			value={selectedOption}
			onChange={setSelectedOption}
		/>
	);
}
