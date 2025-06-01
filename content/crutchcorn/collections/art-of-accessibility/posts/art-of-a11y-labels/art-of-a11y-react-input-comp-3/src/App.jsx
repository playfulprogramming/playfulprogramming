// App.jsx
import { TextInput } from "./TextInput";

export const App = () => {
	return (
		<form>
			<TextInput label="Email" id="email" error="Invalid email" />
			<TextInput label="Password" id="password" type="password" />
			<button type="submit">Login</button>
		</form>
	);
};
