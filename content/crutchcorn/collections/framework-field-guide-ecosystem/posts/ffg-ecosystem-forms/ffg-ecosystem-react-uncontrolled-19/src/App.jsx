import { useRef } from "react";

function App() {
	const agreeCheckbox = useRef();

	// This must be an `onChange` event, which differs from vanilla JS and other frameworks
	const onAgreeChange = () => {
		agreeCheckbox.current.setCustomValidity("");
	}

	const submit = (event) => {
		event.preventDefault();
		if (!agreeCheckbox.current.checked) {
			agreeCheckbox.current.setCustomValidity("You must agree to the terms.");
			agreeCheckbox.current.reportValidity();
		} else {
			agreeCheckbox.current.setCustomValidity("");
			alert("You have successfully signed up for our service, whatever that is");
		}
	}

	return (
		<form onSubmit={submit}>
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input ref={agreeCheckbox} onChange={onAgreeChange} type="checkbox" />
			</label>
			<div style={{ marginTop: "1em" }}>
				<button type="submit">Submit</button>
			</div>
		</form>
	)
}

export default App;
