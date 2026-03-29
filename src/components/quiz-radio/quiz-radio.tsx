import { useCallback, useMemo } from "preact/hooks";
import { RawSvg } from "#components/image/raw-svg";
import style from "./quiz-radio.module.scss";
import { Button } from "#components/button/button";
import { Form, Label, Radio, RadioGroup } from "react-aria-components";
import RadioButtonIcon from "#src/icons/radio_button.svg?raw";
import RadioButtonSelectedIcon from "#src/icons/radio_button_selected.svg?raw";
import RadioButtonCorrectIcon from "#src/icons/radio_button_correct_filled.svg?raw";
import RadioButtonIncorrectIcon from "#src/icons/radio_button_incorrect_filled.svg?raw";
import { ComponentChildren } from "preact";

export interface QuizRadioOption {
	id: string;
	label?: string;
	labelHtml?: string;
	/**
	 * True if the option was the correct answer
	 */
	isCorrect?: boolean;
	/**
	 * True if the option was picked incorrectly
	 */
	isIncorrect?: boolean;
	/**
	 * Explanation label shown if an answer is correct or incorrect
	 */
	explanation?: string;
}

export interface QuizRadioProps {
	id?: string;
	title: string;
	options: QuizRadioOption[];
	questionNum: number;
	totalNum: number;
	votesLabel?: string;
	errorMessage?: string;
	value?: string;
	isDisabled?: boolean;
	onChange(value: string): void;
	onSubmit?(): void;
	children?: ComponentChildren;
}

export function QuizRadio(props: QuizRadioProps) {
	const isDisabled = useMemo(
		() =>
			props.isDisabled ||
			props.options.some((o) => o.isCorrect || o.isIncorrect),
		[props.isDisabled, props.options],
	);

	const handleSubmit = useCallback(
		(e: Event) => {
			e.preventDefault();
			props.onSubmit?.call(undefined);
		},
		[props.onSubmit],
	);

	return (
		<Form
			id={props.id}
			className={`${style.quizOptionContainer} markdownCollapsePadding`}
		>
			<RadioGroup
				value={props.value}
				onChange={props.onChange}
				isDisabled={isDisabled}
			>
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
						const isSelected = props.value === option.id;
						const isBold = isSelected || option.isCorrect || option.isIncorrect;
						const icon = option.isCorrect
							? RadioButtonCorrectIcon
							: option.isIncorrect
								? RadioButtonIncorrectIcon
								: isSelected
									? RadioButtonSelectedIcon
									: RadioButtonIcon;

						return (
							<Radio
								key={option.id}
								value={option.id}
								className={style.option}
								data-correct={option.isCorrect}
								data-incorrect={option.isIncorrect}
							>
								<span
									class={`${style.optionInner} text-style-body-medium${isBold ? "-bold" : ""}`}
								>
									<RawSvg class={style.icon} icon={icon} aria-hidden />
									{option.labelHtml ? (
										<span
											dangerouslySetInnerHTML={{ __html: option.labelHtml }}
										/>
									) : (
										<span>{option.label}</span>
									)}
								</span>
								{option.explanation && (
									<p
										class={`${style.explanationLabel} text-style-body-small-bold`}
									>
										{option.explanation}
									</p>
								)}
							</Radio>
						);
					})}
				</div>
			</RadioGroup>

			<div class={style.quizOptionBottomContainer}>
				{props.onSubmit ? (
					<div class={style.quizOptionButtonRowContainer}>
						<p class={`${style.quizOptionVotes} text-style-body-medium`}>
							{props.votesLabel}
						</p>
						<Button
							tag="button"
							variant="primary-emphasized"
							disabled={isDisabled || typeof props.value === "undefined"}
							onClick={handleSubmit}
						>
							Submit
						</Button>
					</div>
				) : undefined}
				{props.errorMessage && (
					<p class={`${style.quizOptionErrorCode} text-style-body-small-bold`}>
						{props.errorMessage}
					</p>
				)}
			</div>
			{props.children && (
				<div class={`${style.explanation} text-style-body-small-bold`}>
					{props.children}
				</div>
			)}
		</Form>
	);
}
