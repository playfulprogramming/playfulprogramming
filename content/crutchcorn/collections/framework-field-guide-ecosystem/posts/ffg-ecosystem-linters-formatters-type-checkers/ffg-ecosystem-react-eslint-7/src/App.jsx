// This is buggy code that ESLint will catch with React plugins configured
import { useState } from "react";

let someBool = true;

export default function App() {
	if (someBool) {
		const [val, setVal] = useState(0);
		return <p onClick={() => setVal(val + 1)}>{val}</p>;
	}
	return null;
}
