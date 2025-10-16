'use client';

import { useEffect, useState } from "preact/hooks";
import mermaid from "mermaid";

export default function MermaidRenderer() {
	const [isDarkTheme, setIsDarkTheme] = useState(true);

	useEffect(() => {
		// set default color theme
		setIsDarkTheme(localStorage.getItem('currentTheme') === 'dark');

		const handleThemeChange = () => {
			setIsDarkTheme(localStorage.getItem('currentTheme') === 'dark');
		}

		if (typeof window !== "undefined") {
			window.addEventListener('themeChanged', handleThemeChange);
		}

		return () => {
			window.removeEventListener('themeChanged', handleThemeChange);
		}
	}, []);

	useEffect(() => {
		const initMermaid = async () => {
			// using the rgba values directly instead of the SCSS variables since mermaid doesn't seem to like SCSS variables
			// dark theme colors
			let primaryColor = 'rgba(229, 242, 255, 1)';
			let secondaryColor = 'rgba(33, 51, 63, 1)';
			let primaryTextColor = 'rgba(210, 229, 244, 1)';
			
			if (!isDarkTheme) {
				// light theme color scheme
				primaryColor = 'rgba(0, 52, 77, 1)';
				primaryTextColor = 'rgba(33, 51, 63, 1)';
				secondaryColor = 'rgba(229, 242, 255, 1)'
			}
			// mermaid docs link for color variables in case we need to change them in the future: https://mermaid.js.org/config/theming.html#theme-variables
			mermaid.initialize({
				startOnLoad: false,
				theme: "base",
				themeVariables: {
					darkMode: isDarkTheme,
					primaryColor: primaryColor,
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
					fillType1: "rgba(135, 206, 255, 0.32)"
				},
			});

			// Select all diagrams with stored source
			const elements = document.querySelectorAll<HTMLPreElement>(".mermaid");

			for (const el of elements) {
				const graph = el.dataset.graph;
				if (!graph) continue;
			
				// Generate a unique ID for the rendered SVG so we can easily re-render when there is a theme change
				const id = `m-${Math.random().toString(36).slice(2, 9)}`;
			
				try {
					const { svg } = await mermaid.render(id, graph);
					el.innerHTML = svg;
				} catch (err) {
					console.error("Mermaid render failed:", err);
				}
			}
		}
		initMermaid();
	}, [isDarkTheme]);

	return null; // This component just triggers Mermaid to render
}
