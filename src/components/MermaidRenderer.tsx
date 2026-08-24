import { useEffect } from "preact/hooks";
import { MERMAID_THEME_CSS } from "./mermaid-theme.ts";

let diagramId = 0;

function createDiagramId() {
	diagramId += 1;
	return `mermaid-diagram-${diagramId}`;
}

export default function MermaidRenderer() {
	useEffect(() => {
		let disposed = false;

		const renderDiagrams = async () => {
			const [{ default: mermaid }] = await Promise.all([
				import("mermaid"),
				document.fonts.ready,
			]);

			if (disposed) return;

			mermaid.initialize({
				startOnLoad: false,
				theme: "base",
				htmlLabels: false,
				themeCSS: MERMAID_THEME_CSS,
				themeVariables: {
					fontFamily: "Figtree, Arial, Roboto, sans-serif",
					fontSize: "14px",
				},
			});

			const elements = document.querySelectorAll<HTMLPreElement>(".mermaid");

			for (const el of elements) {
				const graph = el.dataset.graph;
				if (!graph) continue;

				el.setAttribute("aria-busy", "true");

				try {
					const { svg, bindFunctions } = await mermaid.render(
						createDiagramId(),
						graph,
					);
					if (disposed) return;

					el.innerHTML = svg;
					el.removeAttribute("aria-busy");
					bindFunctions?.(el);
				} catch (err) {
					el.textContent = graph;
					el.removeAttribute("aria-busy");
					console.error("Mermaid render failed:", err);
				}
			}
		};

		void renderDiagrams();

		return () => {
			disposed = true;
		};
	}, []);

	return null;
}
