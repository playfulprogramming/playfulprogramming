import { useEffect } from "preact/hooks";
import mermaid from "mermaid";

export default function MermaidRenderer() {
	useEffect(() => {
		mermaid.initialize({
			startOnLoad: true,
			theme: "base",
			themeVariables: {
				darkMode: "true",
				primaryColor: "rgba(33, 51, 63, 1)",
			},
		});
		mermaid.run();
	}, []);

	return null; // This component just triggers Mermaid to render
}
