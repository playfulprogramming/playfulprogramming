// TextInput.jsx
import styles from "./TextInput.module.css";

export const TextInput = ({ label, type, id, error }) => {
	return (
		<>
			<label htmlFor={id} className={styles.label}>
				{label}
			</label>
			<input
				id={id}
				type={type}
				aria-invalid={!!error}
				aria-errormessage={id + "-error"}
			/>
			<p className={styles.errormessage} id={id + "-error"}>
				{error}
			</p>
		</>
	);
};
