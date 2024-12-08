/** @jsxRuntime automatic */
import { Element } from "hast";
import checkmark from "src/icons/checkmark.svg?raw";
import dot from "src/icons/dot.svg?raw";
import { fromHtml } from "hast-util-from-html";

const checkmarkHast = fromHtml(checkmark, { fragment: true });
const dotHast = fromHtml(dot, { fragment: true });

export interface QuizRadioOption {
	value: string;
	label: string;
	correct: boolean;
}

export interface QuizRadioProps {
	id: string;
	title: string;
	options: QuizRadioOption[];
	numberOfVotes: number;
	numberOfCorrectVotes: number;
	children: Element[];
}

/** @jsxImportSource hastscript */
export function QuizRadio(props: QuizRadioProps): Element {
	const { id, title, options, numberOfVotes, numberOfCorrectVotes, children } =
		props;

	return (
		<form data-quiz-radio class="quizOptionContainer">
			<fieldset>
				<div class="quizOptionTitle">
					<legend class="text-style-headline-6">{title}</legend>
				</div>

				{children}

				<div class="quizOptionOptionsContainer">
					{options.map((option) => {
						const optionId = option.value + "_id";
						return (
							<div class="quizOptionOptionContainer">
								<label>
									<input
										class="quizOptionOptionInput"
										required
										type="radio"
										name={id}
										value={option.value}
									/>
									<div class="quizOptionOptionInnerContainer">
										<div class="quizOptionOptionCheckboxSvgContainer">
											<div class="quizOptionOptionCheckboxCheckmarkSvgContainer">
												{checkmarkHast}
											</div>
											<div class="quizOptionOptionCheckboxDotSvgContainer">
												{dotHast}
											</div>
										</div>
										{option.label}
									</div>
								</label>
							</div>
						);
					})}
				</div>
			</fieldset>

			<div data-message-section></div>

			<div class="quizOptionButtonRowContainer">
				<p class="quizOptionVotes">{numberOfVotes} votes</p>
				<span class="quizOptionButtonContainer">
					<button
						disabled
						class="button text-style-button-regular primary-emphasized regular"
					>
						Submit
					</button>
				</span>
			</div>
		</form>
	) as never;
}
