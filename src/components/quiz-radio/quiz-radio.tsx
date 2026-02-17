import CheckmarkIcon from "src/icons/checkmark.svg?raw";
import DotIcon from "src/icons/dot.svg?raw";
import CloseIcon from "src/icons/close.svg?raw";
import { useId, useState } from "preact/hooks";
import { RawSvg } from "components/image/raw-svg";
import style from "./quiz-radio.module.scss";
import { Button } from "components/button/button";
import { Form, Label, Radio, RadioGroup } from "react-aria-components";

export interface QuizRadioOption {
	id: string;
	label?: string;
	labelHtml?: string;
	isCorrect?: boolean;
	isIncorrect?: boolean;
}

export interface QuizRadioProps {
	title: string;
	options: QuizRadioOption[];
	votesLabel: string;
}

export function QuizRadio(props: QuizRadioProps): Element {
	const { title, options } = props;
	const quizId = useId();
	const [selectedOption, setSelectedOption] = useState();

	return (
		<Form className={style.quizOptionContainer}>
			<RadioGroup>
				<Label>{title}</Label>
				<div class={style.quizOptionOptionsContainer}>
					{options.map((option) => {
						const optionId = `quiz-option:${quizId}:${option.id}`;
						return (
							<Radio
								key={optionId}
								value={optionId}
								className={style.quizOptionOptionInnerContainer}
							>
								{option.label}
							</Radio>
						);
					})}
				</div>
			</RadioGroup>

			<div class={style.quizOptionBottomContainer}>
				<div class={style.quizOptionButtonRowContainer}>
					<p
						style="display: none"
						data-loading-message
						class={`${style.quizOptionLoading} text-style-button-regular`}
					>
						Submitting your answer
						<span class={style.quizOptionLoadingDotOne}>.</span>
						<span class={style.quizOptionLoadingDotTwo}>.</span>
						<span class={style.quizOptionLoadingDotThree}>.</span>
					</p>
					<p data-votes class={style.quizOptionVotes}>
						{props.votesLabel}
					</p>
					<span class={style.quizOptionButtonContainer}>
						<Button tag="button" variant="primary-emphasized" disabled>
							Submit
						</Button>
					</span>
				</div>
				<p
					style="display: none"
					class={`${style.quizOptionErrorCode} text-style-body-small-bold`}
				>
					An error occurred. Please try again.
				</p>
			</div>
		</Form>
	) as never;
}
