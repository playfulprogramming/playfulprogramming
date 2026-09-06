import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { QuizRadio } from "./quiz-radio.tsx";
import { quizOptions } from "../../../.storybook/fixtures.ts";
import { useState } from "preact/hooks";
function Demo(args: ComponentProps<typeof QuizRadio>) {
	const [value, setValue] = useState(args.value);
	const [submitted, setSubmitted] = useState(false);
	return (
		<QuizRadio
			{...args}
			value={value}
			onChange={setValue}
			onSubmit={() => setSubmitted(true)}
			options={
				submitted
					? quizOptions.map((option) => ({
							...option,
							isIncorrect: option.id === value && !option.isCorrect,
						}))
					: args.options
			}
		/>
	);
}
const meta = preview.type<{ args: ComponentProps<typeof QuizRadio> }>().meta({
	title: "components/Quiz Radio",
	component: QuizRadio,
	args: {
		title: "Which element is best for an action?",
		questionNum: 1,
		totalNum: 2,
		options: quizOptions.map(({ id, label }) => ({ id, label })),
		onChange: () => {},
	},
	render: (args) => <Demo {...args} />,
});
export const Default = meta.story({});
export const Error = meta.story({
	args: { errorMessage: "Please try again." },
});
