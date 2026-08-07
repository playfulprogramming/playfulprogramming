import { useState } from "react";

function App() {
	const [checked, setChecked] = useState(false);
	const [showError, setShowError] = useState(false);

	// This must be an `onChange` event, which differs from vanilla JS and other frameworks
	const onAgreeChange = (e) => {
		setChecked(e.target.checked);
		setShowError(false);
	}

	const submit = (event) => {
		event.preventDefault();
		if (!checked) {
			setShowError(true);
		} else {
			setShowError(false);
			alert("You have successfully signed up for our service, whatever that is");
		}
	}

	return (
		<form onSubmit={submit}>
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input onChange={onAgreeChange} type="checkbox" />
			</label>
			{showError && !checked && <p style={{ color: "red" }}>You must agree to the terms.</p>}
			<div style={{ marginTop: "1em" }}>
				<button type="submit">Submit</button>
			</div>
		</form>
	)
}

export default App;
