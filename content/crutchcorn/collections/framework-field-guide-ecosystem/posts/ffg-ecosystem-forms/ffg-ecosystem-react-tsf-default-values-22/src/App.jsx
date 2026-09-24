import { useForm } from '@tanstack/react-form';

function App() {
	const form = useForm({
		defaultValues: {
			usersName: ""
		},
		onSubmit: ({ value }) => {
			console.log("Form submitted with values:", value);
		}
	});

	const onSubmit = (e) => {
		e.preventDefault();
		form.submit();
	};

	return (
		<form onSubmit={onSubmit}>
			<form.Field
				name="usersName"
				children={field => (
					<input
						value={field.state.value}
						onChange={e => field.api.handleChange(e.target.value)}
					/>
				)}
			/>
			<button type="submit">Submit</button>
		</form>
	)
}

export default App;
