import { useRef, useState } from "react";

function App() {
	const checkboxRef = useRef(null);
	const [checked, setChecked] = useState(false);
	const [showError, setShowError] = useState(false);

	// This must be an `onChange` event, which differs from vanilla JS and other frameworks
	const onAgreeChange = (e) => {
		setChecked(e.target.checked);
		setShowError(false);
	};

	const submit = (event) => {
		event.preventDefault();
		if (!checked) {
			setShowError(true);
		} else {
			setShowError(false);
			alert(
				"You have successfully signed up for our service, whatever that is",
			);
		}
	};

	const onAgreeClick = () => {
		if (!checkboxRef.current) return;
		checkboxRef.current.checked = true;
		// Trigger the change event manually
		const event = new Event("input");
		// Yes, really, this is needed for `e.target` to work in the handler
		Object.defineProperty(event, "target", {
			writable: false,
			value: checkboxRef.current,
		});
		onAgreeChange(event);
	};

	return (
		<form onSubmit={submit}>
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input ref={checkboxRef} onChange={onAgreeChange} type="checkbox" />
			</label>
			{showError && !checked && (
				<div>
					<p style={{ color: "red" }}>You must agree to the terms.</p>
					<button type="button" onClick={onAgreeClick}>
						Agree
					</button>
				</div>
			)}
			<div style={{ marginTop: "1em" }}>
				<button type="submit">Submit</button>
			</div>
		</form>
	);
}

export default App;
