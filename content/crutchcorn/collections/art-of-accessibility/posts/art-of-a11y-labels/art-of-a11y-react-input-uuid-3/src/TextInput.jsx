// TextInput.jsx
import { useId } from "react";
import styles from "./TextInput.module.css";

export const TextInput = ({ label, type, id, error }) => {
	const uuid = useId();
	const realId = id || uuid;

	return (
		<>
			<label htmlFor={realId} className={styles.label}>
				{label}
			</label>
			<input
				id={realId}
				type={type}
				aria-invalid={!!error}
				aria-errormessage={realId + "-error"}
			/>
			<p className={styles.errormessage} id={realId + "-error"}>
				{error}
			</p>
		</>
	);
};
