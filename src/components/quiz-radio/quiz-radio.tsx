import { useId, useState } from "preact/hooks";
import { RawSvg } from "components/image/raw-svg";
import style from "./quiz-radio.module.scss";
import { Button } from "components/button/button";
import { Form, Label, Radio, RadioGroup } from "react-aria-components";
import RadioButtonIcon from "src/icons/radio_button.svg?raw";
import RadioButtonSelectedIcon from "src/icons/radio_button_selected.svg?raw";

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
	questionNum: number;
	totalNum: number;
	votesLabel?: string;
	errorMessage?: string;
	value?: string;
	onChange(value: string): void;
	onSubmit?(): void;
}

export function QuizRadio(props: QuizRadioProps) {
	return (
		<Form className={`${style.quizOptionContainer} markdownCollapsePadding`}>
			<RadioGroup value={props.value} onChange={props.onChange}>
				<span class={`${style.quizNum} text-style-body-medium`}>
					<span class="text-style-body-medium-bold">{props.questionNum}</span>
					{" of "}
					<span class="text-style-body-medium-bold">{props.totalNum}</span>
				</span>
				<Label className={`${style.quizOptionTitle} text-style-headline-5`}>
					{props.title}
				</Label>
				<span class={`${style.quizPrompt} text-style-body-medium-bold`}>
					Select the correct answer.
				</span>
				<div class={style.quizOptionOptionsContainer}>
					{props.options.map((option) => {
						return (
							<Radio
								key={option.id}
								value={option.id}
								className={`${style.quizOptionOptionInnerContainer} text-style-body-medium`}
							>
								<RawSvg
									class={style.icon}
									icon={
										props.value === option.id
											? RadioButtonSelectedIcon
											: RadioButtonIcon
									}
									aria-hidden
								/>
								{option.labelHtml ? (
									<span
										dangerouslySetInnerHTML={{ __html: option.labelHtml }}
									/>
								) : (
									<span>{option.label}</span>
								)}
							</Radio>
						);
					})}
				</div>
			</RadioGroup>

			<div class={style.quizOptionBottomContainer}>
				<div class={style.quizOptionButtonRowContainer}>
					<p class={`${style.quizOptionVotes} text-style-body-medium`}>
						{props.votesLabel}
					</p>
					<span class={style.quizOptionButtonContainer}>
						<Button
							tag="button"
							variant="primary-emphasized"
							disabled={props.value === undefined}
						>
							Submit
						</Button>
					</span>
				</div>
				{props.errorMessage && (
					<p class={`${style.quizOptionErrorCode} text-style-body-small-bold`}>
						{props.errorMessage}
					</p>
				)}
			</div>
		</Form>
	);
}
