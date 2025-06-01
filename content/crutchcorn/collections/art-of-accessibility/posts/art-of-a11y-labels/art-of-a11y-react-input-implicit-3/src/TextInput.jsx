// TextInput.jsx
export const TextInput = ({ label, type }) => {
	return (
		<label>
			{label}
			<input type={type} />
		</label>
	);
};
