// App.jsx
import { TextInput } from "./TextInput";

export const App = () => {
	return (
		<form>
			<TextInput label="Email" />
			<TextInput label="Password" type="password" />
			<button type="submit">Login</button>
		</form>
	);
};
