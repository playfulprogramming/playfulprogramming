import { css } from "@emotion/css";

const headerColor = "#2A3751";

export function App() {
	return (
		<h1
			className={css`
				color: ${headerColor};
				font-size: 2rem;
				text-decoration: underline;
			`}
		>
			I am a title
		</h1>
	);
}
