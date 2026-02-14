import CheckmarkIcon from "src/icons/checkmark.svg?raw";
import DotIcon from "src/icons/dot.svg?raw";
import CloseIcon from "src/icons/close.svg?raw";
import { useId } from "preact/hooks";
import { RawSvg } from "components/image/raw-svg";

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

	return (
		<form data-quiz-radio class="quizOptionContainer">
			<fieldset>
				<div class="quizOptionTitle">
					<legend class="text-style-headline-6">{title}</legend>
				</div>

				<div class="quizOptionOptionsContainer">
					{options.map((option) => {
						const optionId = `quiz-option:${quizId}:${option.id}`;
						return (
							<div class="quizOptionOptionContainer" key={optionId}>
								<label>
									<input
										class="quizOptionOptionInput"
										required
										type="radio"
										name={optionId}
										value={option.id}
									/>
									<div class="quizOptionOptionInnerContainer">
										<div class="quizOptionOptionCheckboxSvgContainer">
											<RawSvg
												class="quizOptionOptionCheckboxCheckmarkSvgContainer"
												icon={CheckmarkIcon}
											/>
											<RawSvg
												class="quizOptionOptionCheckboxDotSvgContainer"
												icon={DotIcon}
											/>
											<RawSvg
												class="quizOptionOptionCheckboxCloseSvgContainer"
												icon={CloseIcon}
											/>
										</div>
										{option.label}
									</div>
								</label>
							</div>
						);
					})}
				</div>
			</fieldset>

			<div class="quizOptionBottomContainer">
				<div class="quizOptionButtonRowContainer">
					<p
						style="display: none"
						data-loading-message
						class="quizOptionLoading text-style-button-regular"
					>
						Submitting your answer<span class="quizOptionLoadingDotOne">.</span>
						<span class="quizOptionLoadingDotTwo">.</span>
						<span class="quizOptionLoadingDotThree">.</span>
					</p>
					<p data-votes class="quizOptionVotes">
						{props.votesLabel}
					</p>
					<span class="quizOptionButtonContainer">
						<button
							disabled
							class="button text-style-button-regular primary-emphasized regular"
						>
							<span className="innerText">Submit</span>
						</button>
					</span>
				</div>
				<p
					style="display: none"
					data-error-message
					class="quizOptionErrorCode text-style-body-small-bold"
				>
					An error occurred. Please try again.
				</p>
			</div>
		</form>
	) as never;
}
