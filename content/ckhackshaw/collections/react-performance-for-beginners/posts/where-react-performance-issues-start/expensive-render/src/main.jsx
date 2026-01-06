import { createRoot } from "react-dom/client";
import { useState } from "react";

function MyInefficientComponent() {
  const [text, setText] = useState('');

  // Intentionally awful render work
  const start = performance.now();
  while (performance.now() - start < 1500) {}

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Try typing..."
      />
      <p>{text}</p>
    </div>
  );
}

export default function App() {
	return (
		<div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
		<MyInefficientComponent />
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
