import { useEffect } from "preact/hooks";

const THEME_CHANGED_EVENT = "themeChanged";

let diagramId = 0;

function createDiagramId() {
	diagramId += 1;
	return `mermaid-diagram-${diagramId}`;
}

export default function MermaidRenderer() {
	useEffect(() => {
		let renderVersion = 0;
		let disposed = false;

		const renderDiagrams = async () => {
			const currentRender = ++renderVersion;
			const { default: mermaid } = await import("mermaid");

			if (disposed || currentRender !== renderVersion) return;

			const isDarkTheme = document.documentElement.classList.contains("dark");
			let primaryColor = "rgba(229, 242, 255, 1)";
			let secondaryColor = "rgba(33, 51, 63, 1)";
			let primaryTextColor = "rgba(210, 229, 244, 1)";

			if (!isDarkTheme) {
				primaryColor = "rgba(0, 52, 77, 1)";
				primaryTextColor = "rgba(33, 51, 63, 1)";
				secondaryColor = "rgba(229, 242, 255, 1)";
			}

			mermaid.initialize({
				startOnLoad: false,
				theme: "base",
				themeVariables: {
					darkMode: isDarkTheme,
					primaryColor,
					fontFamily: "Figtree, Arial, Roboto, sans-serif",
					primaryTextColor: secondaryColor,
					textColor: primaryTextColor,
					loopTextColor: primaryTextColor,
					noteBkgColor: "rgba(135, 206, 255, 0.32)",
					noteTextColor: primaryTextColor,
					edgeLabelBackground: "rgba(135, 206, 255, 0.32)",
					lineColor: primaryColor,
					classText: secondaryColor,
					titleColor: primaryTextColor,
					fillType0: secondaryColor,
					fillType1: "rgba(135, 206, 255, 0.32)",
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
					if (disposed || currentRender !== renderVersion) return;

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
		window.addEventListener(THEME_CHANGED_EVENT, renderDiagrams);

		return () => {
			disposed = true;
			renderVersion += 1;
			window.removeEventListener(THEME_CHANGED_EVENT, renderDiagrams);
		};
	}, []);

	return null;
}
